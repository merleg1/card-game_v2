export default class Player {
    constructor(id, name, isAdmin = false) {
        this.id = id;
        this.name = name;
        this.isAdmin = isAdmin;
        this.cardsInHand = [];
        this.playedCards = [];
        this.votes = 0;
        this.hasPlayed = false;
        this.hasVoted = false;
        this.score = 0;
    }

    addCardToHand(card) {
        this.cardsInHand.push(card);
    }

    removeCardFromHand(card) {
        this.cardsInHand.splice(this.cardsInHand.findIndex(c => c.setId == card.setId && c.id == card.id), 1);
    }

    hasCardInHand(card) {
        return this.cardsInHand.findIndex(c => c.setId == card.setId && c.id == card.id) != -1;
    }

    playCard(card) {
        if (this.hasCardInHand(card)) {
            this.removeCardFromHand(card);
            this.playedCards.push(card);
        }
        return false;
    }

}