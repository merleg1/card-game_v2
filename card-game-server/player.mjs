export default class Player {
    constructor(id, name, isAdmin = false){
        this.id = id;
        this.name = name;
        this.isAdmin = isAdmin;
    }
}