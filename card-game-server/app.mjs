const port = process.env.PORT || 3000;

import Room from './room.mjs';
import Player from './player.mjs';
import MemorySessionStore from './sessionStore.mjs';
const sessionStore = new MemorySessionStore();
import clientSocketData from '../shared/clientSocketData.mjs';
import sets from '../shared/sets.json' assert { type: 'json' };
import QuestionCard from './questionCard.mjs';
import Card from './card.mjs';

import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server } from 'socket.io';
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
import { nanoid } from 'nanoid';

let rooms = [];
let allCards = { questionCards: [], answerCards: [] };
for (let i = 0; i < sets.length; i++) {
    for (let j = 0; j < sets[i].black.length; j++) {
        allCards.questionCards.push(new QuestionCard(i, j, sets[i].black[j].text, sets[i].black[j].pick));
    }
    for (let j = 0; j < sets[i].white.length; j++) {
        allCards.answerCards.push(new Card(i, j, sets[i].white[j].text));
    }
}
console.log(allCards.questionCards.length + allCards.answerCards.length + " cards loaded");

io.use((socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
        const session = sessionStore.findSession(sessionID);
        if (session) {
            socket.sessionID = sessionID;
            socket.userID = session.userID;
            socket.clientSocketData = session.clientSocketData;
            if (socket.clientSocketData.roomJoined) {
                socket.join(socket.clientSocketData.roomCode);
            }
            return next();
        }
    }

    socket.sessionID = nanoid();
    socket.userID = nanoid();
    socket.clientSocketData = new clientSocketData();
    next();
});

io.on('connection', (socket) => {
    console.log('New connection from ' + socket.id);
    socket.join(socket.userID);

    sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        clientSocketData: socket.clientSocketData,
        connected: true
    });

    socket.emit('session', { sessionID: socket.sessionID, userID: socket.userID, clientSocketData: socket.clientSocketData });

    socket.on('createRoom', (data) => {

        let nickNameVal = data.nickname != null && data.nickname != "" && data.nickname != undefined;
        let numberOfRoundsVal = data.numberOfRounds != null && data.numberOfRounds != "" && data.numberOfRounds != undefined && data.numberOfRounds > 0 && data.numberOfRounds < 100;
        if (nickNameVal && numberOfRoundsVal && !isInRoom(socket.userID)) {
            let roomId = nanoid(8);
            socket.join(roomId);
            let room = new Room(roomId, allCards, data.numberOfRounds);
            let nick = data.nickname.slice(0, 12);
            room.addPlayer(socket.userID, nick, true);
            rooms.push(room);
            console.log("Created room " + roomId + " for " + nick);
            let players = convertPlayersForClient(room.players)
            io.to(socket.userID).emit('players', players);
            io.to(socket.userID).emit('roomJoined', { roomCode: roomId, isAdmin: true });

        }
        else {
            io.to(socket.userID).emit('error', { message: "Error creating room" });
        }

    });

    socket.on('joinRoom', (data) => {
        let nick = data.nickname.slice(0, 12);
        console.log("Joining room " + data.roomCode + " for " + nick);
        if (data.nickname != null && data.nickname != "" && data.nickname != undefined && !isInRoom(socket.userID)) {
            let room = getRoom(data.roomCode);
            if (room != null) {
                console.log("Room found");
                socket.join(room.id);
                room.addPlayer(socket.userID, nick);
                let players = convertPlayersForClient(room.players);
                io.to(room.id).emit('players', players);
                io.to(socket.userID).emit('roomJoined', { roomCode: data.roomCode, isAdmin: false });

            }
            else {
                console.log("Room not found");
                io.to(socket.userID).emit('error', { message: "Room not found" });
            }
        }
        else {
            io.to(socket.userID).emit('error', { message: "Error joining room" });
        }


    });

    socket.on('startGame', (data) => {
        let room = getRoom(data.roomCode);
        if (room != null) {
            if (isAdmin(socket.userID, room)) {
                if(room.players.length > 3){
                    room.startGame();
                    io.to(room.id).emit('gameStarted');
                    room.round++;
                    room.players.forEach(player => {
                        io.to(player.id).emit('newRound', { question: room.currentQuestionCard.text, pick: room.currentQuestionCard.pick, newCardsInHand: player.cardsInHand, round: room.round });
                    });
                }
                else {
                    io.to(socket.userID).emit('error', { message: "Not enough players" });
                }          
            }
            else {
                io.to(socket.userID).emit('error', { message: "Only admin can start game" });
            }
        }
    });

    socket.on('playCards', (data) => {
        let room = getRoom(socket.clientSocketData.roomCode);
        if (room != null) {
            let player = room.getPlayer(socket.userID);
            if (player != null && !player.hasPlayed) {
                let i = 0;
                data.forEach(card => {
                    if (player.playCard(card) && i < room.currentQuestionCard.pick) {
                        i++;
                    }
                });
                io.to(player.id).emit('cardsPlayed');
                player.hasPlayed = true;
            }
            if (room.players.every(player => player.hasPlayed)) {
                room.setCardsToJudge();
                room.players.forEach(p => {
                    io.to(p.id).emit('judge', { question: room.currentQuestionCard.text, cardsToJudge: room.getCardsToJudgeForClient(p.id) });
                });
            }
        }
    });

    socket.on('voteForCard', (data) => {

        let room = getRoom(socket.clientSocketData.roomCode);
        if (room != null) {
            let player = room.getPlayer(socket.userID);
            if (player != null && !player.hasVoted) {
                player.hasVoted = true;
                let card = room.getJudgeCardById(data);
                if (card != null) {
                    card.votes++;
                    io.to(player.id).emit('judged');
                }
            }
            if (room.players.every(player => player.hasVoted)) {
                let winningCards = room.getWinningCards();
                let winningPlayers = [];
                winningCards.forEach(card => {
                    let player = room.getPlayer(card.playerId);
                    if (player != null) {
                        winningPlayers.push(player);
                    }
                });
                winningPlayers.forEach(player => {
                    player.score++;
                });
                io.to(room.id).emit('roundEnded', { winningPlayerNames: winningPlayers.map(p => p.name) });
                room.players.forEach(player => {
                    player.hasPlayed = false;
                    player.hasVoted = false;
                    player.playedCards = [];
                });
                let cardsToDraw = room.currentQuestionCard.pick;
                room.cardsToJudge = [];
                room.drawQuestionCard();
                room.round++;
                let clientPlayers = convertPlayersForClient(room.players);
                io.to(room.id).emit('players', clientPlayers);
                if (room.round > room.numberOfRounds) {
                    let winners = room.getGameWinners();
                    let winnerNames = winners.map(p => p.name)
                    io.to(room.id).emit('gameEnded', { winners: winnerNames });
                    rooms.splice(rooms.indexOf(room), 1);
                    io.in(room.id).socketsLeave(room.id);
                }
                else {
                    room.players.forEach(player => {
                        let newCards = room.drawAnswerCards(player.id, cardsToDraw);
                        io.to(player.id).emit('newRound', { question: room.currentQuestionCard.text, pick: room.currentQuestionCard.pick, newCardsInHand: newCards, round: room.round });
                    });
                }
            }
        }
    });


    socket.on('leaveRoom', (data) => {
        let room = getRoom(data.roomCode);
        if (room != null) {
            if (room.hasPlayer(socket.userID)) {
                if (isAdmin(socket.userID, room)) {
                    rooms.splice(rooms.indexOf(room), 1);
                    io.to(room.id).emit('roomLeft');
                    io.in(room.id).socketsLeave(room.id);
                }
                else {
                    room.removePlayer(socket.userID);
                    let players = convertPlayersForClient(room.players);
                    io.to(room.id).emit('players', players);
                    socket.leave(room.id);
                    io.to(socket.userID).emit('roomLeft');
                }
            }
        }
    });

    socket.on('updateClientSocketData', (data) => {
        socket.clientSocketData = data;

        sessionStore.saveSession(socket.sessionID, {
            userID: socket.userID,
            clientSocketData: socket.clientSocketData,
            connected: true
        });
    });

    socket.on('disconnect', () => {
        sessionStore.saveSession(socket.sessionID, {
            userID: socket.userID,
            clientSocketData: socket.clientSocketData,
            connected: false
        });
        socket.leave(socket.userID);
        console.log(socket.id, "has disconnected");
    });

});

server.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

function getRoom(roomId) {
    for (let r of rooms) {
        if (r.id == roomId) {
            return r;
        }
    }
    return null;
}

function isAdmin(userID, room) {
    for (let p of room.players) {
        if (p.id == userID) {
            return p.isAdmin;
        }
    }
    return false;
}

function convertPlayersForClient(players) {
    let convertedPlayers = [];
    for (let p of players) {
        convertedPlayers.push({ name: p.name, isAdmin: p.isAdmin, score: p.score });
    }
    return convertedPlayers;
}

function isInRoom(userID) {
    for (let r of rooms) {
        for (let p of r.players) {
            if (p.id == userID) {
                return true;
            }
        }
    }
    return false;
}