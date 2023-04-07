const port = process.env.PORT || 3000;

import Room from './room.mjs';

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
import PlayerClient from './playerClient.mjs';

let rooms = [];

io.on('connection', (socket) => {
    console.log('New connection from ' + socket.id);

    socket.on('createRoom', (data) => {

        if (data.nickname != null && data.nickname != "" && data.nickname != undefined) {
            let roomId = nanoid(8);
            socket.join(roomId);
            let room = new Room(roomId);
            let nick = data.nickname.slice(0, 12);
            room.addPlayer(socket.id, nick, true);
            rooms.push(room);
            console.log("Created room " + roomId + " for " + nick);
            socket.emit('players', convertPlayersForClient(room.players));
            socket.emit('roomJoined', { roomCode: roomId, isAdmin: true });
        }
        else {
            socket.emit('error', { message: "Error creating room" });
        }

    });

    socket.on('joinRoom', (data) => {
        let nick = data.nickname.slice(0, 12);
        console.log("Joining room " + data.roomCode + " for " + nick);

        if (data.nickname != null && data.nickname != "" && data.nickname != undefined) {
            let room = getRoom(data.roomCode);
            if (room != null) {
                console.log("Room found");
                socket.join(room.id);
                room.addPlayer(socket.id, nick);
                io.to(room.id).emit('players', convertPlayersForClient(room.players));
                socket.emit('roomJoined', { roomCode: data.roomCode, isAdmin: false });
            }
            else {
                console.log("Room not found");
                socket.emit('error', { message: "Room not found" })
            }
        }
        else {
            socket.emit('error', { message: "Error joining room" });
        }


    });

    socket.on('startGame', (data) => {
        let room = getRoom(data.roomCode);
        if (room != null) {
            if(isAdmin(socket.id, room)) {
                io.to(room.id).emit('gameStarted');
            }
            else {
                socket.emit('error', {message: "Only admin can start game"});
            }
        }
    });

    socket.on('disconnect', () => {
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

function isAdmin(socketId, room) {
    for (let p of room.players) {
        if (p.socketId == socketId) {
            return p.isAdmin;
        }
    }
    return false;
}

function convertPlayersForClient(players) {
    let convertedPlayers = [];
    for (let p of players) {
        convertedPlayers.push(new PlayerClient(p.name, p.isAdmin));
    }
    return convertedPlayers;
}