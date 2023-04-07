import { io } from 'socket.io-client';
import { Notify } from 'quasar';
import { reactive } from 'vue';
import Router from './router/index';

export const socket = io(window.location.hostname + ':' + import.meta.env.VITE_SOCKET_PORT);

export let socketData = reactive({
    gameStarted : false,
    roomJoined: false,
    roomCode: '',
    isAdmin : false,
    players: [],
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
});

socket.on('gameStarted', () => {
    socketData.gameStarted = true;
});
