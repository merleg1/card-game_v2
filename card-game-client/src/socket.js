import { io } from 'socket.io-client';

export const socket = io(window.location.hostname + ':' + import.meta.env.VITE_SOCKET_PORT);