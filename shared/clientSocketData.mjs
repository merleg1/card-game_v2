export default class SocketClientData {
    constructor(gameStarted = false, roomJoined = false, roomCode = '', isAdmin = false, players = []) {
        this.gameStarted = gameStarted;
        this.roomJoined = roomJoined;
        this.roomCode = roomCode;
        this.isAdmin = isAdmin;
        this.players = players;
    }
}