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

socket.on('cardsPlayed', () => {
    socketData.hasPlayed = true;
    socket.emit('updateClientSocketData', socketData);
});

socket.on('judged', () => {
    socketData.hasJudged = true;
});

socket.on('judge', (data) => {
    Notify.create({
        message: `Its time to Judge! Pick the best card by swiping and clicking the button.`,
        position: 'center',
    });

    socketData.isJudging = true;
    socketData.currentQuestion = data.question;
    data.cardsToJudge.forEach(a => {
        let t = socketData.currentQuestion;
        a.cards.forEach(c => {
            if (t.includes('_')) {
                t = t.replace('_', c.text.replaceAll('.', ''));
            }
            else {
                t += ' ' + c.text;
            }
        });
        socketData.cardsToJudge.push({ id: a.id, text: t });
    });

    socket.emit('updateClientSocketData', socketData);
});

socket.on('newRound', async (data) => {
    Notify.create({
        message: `Round ${data.round}: Drag your cards to the question to play them. `,
        position: 'center',
    });

    socketData.hasPlayed = false;
    socketData.hasJudged = false;
    socketData.isJudging = false;
    socketData.cardsToJudge = [];
    socketData.cardsPicked = [];
    socketData.currentQuestion = data.question;
    socketData.currentQuestionPick = data.pick;
    console.log(data.newCardsInHand);
    const timer = ms => new Promise(res => setTimeout(res, ms))
    for (let c of data.newCardsInHand) {
        await timer(500);
        socketData.cardsInHand.push(c);
    }
    socket.emit('updateClientSocketData', socketData);
});

socket.on('roomLeft', () => {
    socketData.roomJoined = false;
    socketData = reactive(new clientSocketData());
    socket.emit('updateClientSocketData', socketData);
    Router.push('/');
});
