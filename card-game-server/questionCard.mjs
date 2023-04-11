import Card from './card.mjs';
export default class QuestionCard extends Card {
    constructor(setId, id, text, pick = 1) {
        super(setId, id, text);
        this.pick = pick;
    }
}