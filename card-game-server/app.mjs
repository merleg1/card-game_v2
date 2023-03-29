const port = process.env.PORT || 3000;

import Room from './room.mjs';

import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server } from 'socket.io';
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
      }
  });
import { nanoid } from 'nanoid';

let rooms = [];

io.on('connection', (socket) => {
    console.log('New connection from ' + socket.id);

    socket.on('createRoom', (data) => {
        let roomId = nanoid(8);
        socket.join(roomId);
        rooms.push(new Room(roomId));
    });

    socket.on('joinRoom', (data) => {
        socket.join(data.roomId);
    });

    socket.on('disconnect', () => {
        console.log(socket.id, "has disconnected");
    });

});

server.listen(port, () => {
    console.log(`App listening on port ${port}`)
})