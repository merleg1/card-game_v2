import Player from './player.mjs';
import QuestionCard from './questionCard.mjs';
import Card from './card.mjs';

export default class Room {
    players = [];

    constructor(id, allCards, selectedSets = [0]) {
        this.id = id;
        this.selectedSets = selectedSets;
        this.questionCards = allCards.questionCards.filter(c => this.selectedSets.includes(c.setId));
        this.answerCards = allCards.answerCards.filter(c => this.selectedSets.includes(c.setId));
        this.currentQuestionCard = null;
        this.cardsToJudge = new Map();
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

    getPlayer(id) {
        return this.players.find(p => p.id == id);
    }

    startGame() {
        this.drawQuestionCard();
        this.players.forEach(p => {
            for (let i = 0; i < 8; i++) {
                this.drawAnswerCard(p.id);
            }
        });
    }

    drawQuestionCard() {
        let index = Math.floor(Math.random() * this.questionCards.length);
        let card = this.questionCards[index];
        this.questionCards.splice(index, 1);
        this.currentQuestionCard = card;
    }

    drawAnswerCard(playerId) {
        let index = Math.floor(Math.random() * this.answerCards.length);
        let card = this.answerCards[index];
        this.answerCards.splice(index, 1);
        this.players.find(p => p.id == playerId).addCardToHand(card); 
    }
}