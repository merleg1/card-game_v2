export default class Player {
    constructor(socketId, name, isAdmin = false){
        this.socketId= socketId;
        this.name = name;
        this.isAdmin = isAdmin;
    }
}