import Player from './player.mjs';

export default class Room {
    players = [];

    constructor(id) {
        this.id = id;
    }

    addPlayer(socketId, name, isAdmin = false) {
        this.players.push(new Player(socketId, name, isAdmin));
    }
}