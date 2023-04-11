export default class Player {
    constructor(id, name, isAdmin = false){
        this.id = id;
        this.name = name;
        this.isAdmin = isAdmin;
        this.cardsInHand = [];
    }

    addCardToHand(card) {
        this.cardsInHand.push(card);
    }

    removeCardFromHand(card) {
        this.cardsInHand.splice(this.cardsInHand.findIndex(c => c.id == card.id), 1);
    }
}