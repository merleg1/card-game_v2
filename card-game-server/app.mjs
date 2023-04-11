const port = process.env.PORT || 3000;

import Room from './room.mjs';
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
            socket.socketIds = session.socketIds;
            return next();
        }
    }

    socket.sessionID = nanoid();
    socket.userID = nanoid();
    socket.socketIds = [];
    socket.clientSocketData = new clientSocketData();
    next();
});

io.on('connection', (socket) => {
    console.log('New connection from ' + socket.id);
    socket.socketIds.push(socket.id);
    socket.join(socket.userID);

    sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        clientSocketData: socket.clientSocketData,
        socketIds: socket.socketIds,
        connected: true
    });

    socket.emit('session', { sessionID: socket.sessionID, userID: socket.userID, clientSocketData: socket.clientSocketData });

    socket.on('createRoom', (data) => {

        if (data.nickname != null && data.nickname != "" && data.nickname != undefined && !isInRoom(socket.userID)) {
            let roomId = nanoid(8);
            socket.join(roomId);
            let room = new Room(roomId, allCards);
            let nick = data.nickname.slice(0, 12);
            room.addPlayer(socket.userID, nick, true);
            rooms.push(room);
            console.log("Created room " + roomId + " for " + nick);
            let players = convertPlayersForClient(room.players)
            emitToSession(socket.socketIds, 'players', players);
            emitToSession(socket.socketIds, 'roomJoined', { roomCode: roomId, isAdmin: true });

        }
        else {
            emitToSession(socket.socketIds, 'error', { message: "Error creating room" });
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
                emitToSession(socket.socketIds, 'roomJoined', { roomCode: data.roomCode, isAdmin: false });

            }
            else {
                console.log("Room not found");
                emitToSession(socket.socketIds, 'error', { message: "Room not found" });
            }
        }
        else {
            emitToSession(socket.socketIds, 'error', { message: "Error joining room" });
        }


    });

    socket.on('startGame', (data) => {
        let room = getRoom(data.roomCode);
        if (room != null) {
            if (isAdmin(socket.userID, room)) {
                room.startGame();
                io.to(room.id).emit('gameStarted');
                room.players.forEach(player => {
                    io.to(player.id).emit('newRound', { question: room.currentQuestionCard.text, pick: room.currentQuestionCard.pick, cardsInHand: player.cardsInHand});
                });          
            }
            else {
                emitToSession(socket.socketIds, 'error', { message: "Only admin can start game" });
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
                    emitToSession(socket.socketIds, 'roomLeft');
                }
            }
        }
    });

    socket.on('updateClientSocketData', (data) => {
        socket.clientSocketData = data;

        sessionStore.saveSession(socket.sessionID, {
            userID: socket.userID,
            clientSocketData: socket.clientSocketData,
            socketIds: socket.socketIds,
            connected: true
        });
    });

    socket.on('disconnect', () => {
        socket.socketIds = socket.socketIds.splice(socket.socketIds.indexOf(socket.id), 1);
        sessionStore.saveSession(socket.sessionID, {
            userID: socket.userID,
            clientSocketData: socket.clientSocketData,
            socketIds: socket.socketIds,
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
        convertedPlayers.push({ name: p.name, isAdmin: p.isAdmin });
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

function emitToSession(socketIds, event, data) {
    for (let id of socketIds) {
        io.to(id).emit(event, data);
    }
}