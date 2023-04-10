import Player from './player.mjs';

export default class Room {
    players = [];

    constructor(id) {
        this.id = id;
    }

    addPlayer(id, name, isAdmin = false) {
        this.players.push(new Player(id, name, isAdmin));
    }

    removePlayer(id) {
        this.players.splice(this.players.findIndex(p => p.id == id), 1);
    }

    hasPlayer(id) {
        return this.players.findIndex(p => p.id == id) != -1;
    }
}