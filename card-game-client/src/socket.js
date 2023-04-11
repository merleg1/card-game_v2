import { io } from 'socket.io-client';
import { Notify } from 'quasar';
import { reactive } from 'vue';
import Router from './router/index';
import clientSocketData from '../../shared/clientSocketData.mjs';

export const socket = io(window.location.hostname + ':' + import.meta.env.VITE_SOCKET_PORT);

export let socketData = reactive(new clientSocketData());

socket.on("session", ({ sessionID, userID, clientSocketData }) => {
    socket.auth = { sessionID };
    localStorage.setItem("sessionID", sessionID);
    socket.userID = userID;
    socketData = reactive(clientSocketData);
});

socket.on('error', (data) => {
    Notify.create({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: data.message
    });
});

socket.on('roomJoined', (data) => {
    socketData.roomJoined = true;
    socketData.roomCode = data.roomCode;
    socketData.isAdmin = data.isAdmin;
    socket.emit('updateClientSocketData', socketData);
    Router.push('/room/' + data.roomCode);

    Notify.create({
        color: 'green-5',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Room joined'
    });
});

socket.on('players', (data) => {
    socketData.players = data;
    socket.emit('updateClientSocketData', socketData);
});

socket.on('gameStarted', () => {
    socketData.gameStarted = true;
    socket.emit('updateClientSocketData', socketData);
});

socket.on('newRound', (data) => {
    socketData.currentQuestion = data.question;
    socketData.currentQuestionPick = data.pick;
    socketData.cardsInHand = data.cardsInHand;
    console.log(socketData.cardsInHand);
    socket.emit('updateClientSocketData', socketData);
});

socket.on('roomLeft', () => {
    socketData.roomJoined = false;
    socketData = reactive(new clientSocketData());
    socket.emit('updateClientSocketData', socketData);
    Router.push('/');
});
