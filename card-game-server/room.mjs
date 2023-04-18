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
        this.round = 0;
        this.cardsToJudge = [];
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
            this.drawAnswerCards(p.id, 8);
        });
    }

    drawQuestionCard() {
        let index = Math.floor(Math.random() * this.questionCards.length);
        let card = this.questionCards[index];
        this.questionCards.splice(index, 1);
        this.currentQuestionCard = card;
        return card;
    }

    drawAnswerCard(playerId) {
        let index = Math.floor(Math.random() * this.answerCards.length);
        let card = this.answerCards[index];
        this.answerCards.splice(index, 1);
        this.players.find(p => p.id == playerId).addCardToHand(card);
        return card;
    }

    drawAnswerCards(playerId, amount) {
        let cards = [];
        for (let i = 0; i < amount; i++) {
            cards.push(this.drawAnswerCard(playerId));
        }
        return cards;
    }

    setCardsToJudge() {
        this.cardsToJudge = [];
        let i = 1;
        this.players.forEach(p => {
            this.cardsToJudge.push({ id: i, playerId: p.id, cards: p.playedCards, votes: 0 });
            i++;
        });
    }

    getCardsToJudgeForClient(playerId) {
        let cards = [];
        this.cardsToJudge.forEach(c => {
            if (c.playerId != playerId) {
                cards.push({ id: c.id, cards: c.cards });
            }
        });
        return cards;
    }

    getJudgeCardById(id) {
        return this.cardsToJudge.find(c => c.id == id);
    }

    getWinningCard() {
        let winningCard = null;
        let winningVotes = 0;
        this.cardsToJudge.forEach(c => {
            if (c.votes > winningVotes) {
                winningVotes = c.votes;
                winningCard = c;
            }
        });
        return winningCard;
    }
}