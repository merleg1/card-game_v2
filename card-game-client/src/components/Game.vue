<template>
  <q-btn class="score-button" label="Show scoreboard" color="primary" @click="showScoreBoard = true" />
  <div v-if="!sData.isJudging">
    <div class="text-h5 waiting-text" v-if="sData.hasPlayed">
      <q-spinner-hourglass color="primary" size="2em" />
      Waiting for other players. 
      <q-spinner-hourglass color="primary" size="2em" />
    </div>
    <Transition name="question">
      <div :key="sData.currentQuestion" v-html="sData.currentQuestion" class="text-h4 question" id="question">
      </div>
    </Transition>
    <TransitionGroup name="hand" class="hand" tag="div">
      <div class="playing-card" v-for="card in sData.cardsInHand" :key="card.setId + '.' + card.id"
        :id="card.setId + '.' + card.id" @mousedown="startDrag($event, card)" @touchstart="startDrag($event, card)">
        <div class="playing-card-face">
          <div class="playing-card-label">
            {{ card.text }}
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
  <Judge v-else />

  <q-dialog v-model="showScoreBoard" persistent :maximized="true" transition-show="slide-up" transition-hide="slide-down">
    <q-card class="text-white">
      <q-bar>
        <q-space />

        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <ScoreBoard />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="scss">
.score-button {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0em 0.5em;
  margin: 1em;
}

.question,
.waiting-text {
  -webkit-user-select: none;
  /* Safari */
  -ms-user-select: none;
  /* IE 10 and IE 11 */
  user-select: none;
  /* Standard syntax */
  font-family: 'ClashDisplay-Semibold', sans-serif;
  margin-bottom: 2em;
  width: 50vw;
}

.answer-text {
  color: var(--q-primary);
}

.question-enter-active,
.question-leave-active {
  transition: all 0.3s ease;
}

.question-enter-from,
.question-leave-to {
  transform: translate(50vw, -20vh) rotate(30deg) scale(0.7) skew(-30deg);
  opacity: 0;
}

.hand {
  bottom: 0;
  display: flex;
  height: 150px;
  padding: 0 50px;
  justify-content: center;
  position: fixed;
  left: 0;
  right: 0;
}

.hand-enter-active,
.hand-leave-active {
  transition: 0.5s left ease, 0.5s bottom ease;
  left: 0;
  bottom: 0;
}

.hand-enter-from,
.hand-leave-to {
  bottom: -30px;
  left: 300px;
}

.playing-card {
  perspective: 300px;
  -webkit-user-select: none;
  /* Safari */
  -ms-user-select: none;
  /* IE 10 and IE 11 */
  user-select: none;
  /* Standard syntax */
  height: 150px;
  margin: 0 -25px;
  position: relative;
  width: 100px;
  cursor: -webkit-grab;
  cursor: -moz-grab;
  cursor: -o-grab;
  cursor: -ms-grab;
  cursor: grab;
}

.playing-card:active {
  cursor: -webkit-grabbing;
  cursor: -moz-grabbing;
  cursor: -o-grabbing;
  cursor: -ms-grabbing;
  cursor: grabbing;
}

.playing-card:after {
  bottom: 0;
  content: "";
  left: -60px;
  position: absolute;
  right: -60px;
  top: 0px;
  z-index: 10;
}

.playing-card-face {
  bottom: 0;
  content: "";
  left: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  transition: 800ms cubic-bezier(0.19, 1, 0.22, 1) transform;
  border-radius: 10px;
}

.playing-card-face:after {
  -webkit-animation: none;
  animation: none;
  background: #fff;
  bottom: 0;
  content: "";
  left: 0;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  border-radius: 10px;
}

.playing-card-label {
  font-size: 11px;
  line-height: 1;
  font-weight: 700;
  padding: 14px 14px;
  color:#000;
  text-align: left;
}

$total: 8;

@for $i from 0 through ($total - 1) {
  $hue: ($i / $total) * -360;
  $rotationRange: 50;
  $rotation: ($i - ($total - 1) / 2) / ($total - 2) * $rotationRange;
  $offsetRange: 80;
  $offset: abs(($i - ($total - 1) / 2) / ($total - 2) * $offsetRange);

  .playing-card:nth-child(#{$i + 1}) {
    .playing-card-face {
      background: linear-gradient(-135deg, hsla($hue, 100%, 80%, 1),
          hsla($hue, 90%, 60%, 1));
      box-shadow:
        -5px 5px 5px hsla(0, 0%, 0%, 0.15),
        inset 0 0 0 2px hsla($hue, 100%, 80%, 0.75);
      transform: translateY($offset * 1px) rotate($rotation * 1deg);

      .playing-card-label {
        color: hsla($hue, 100%, 20%, 1);
        text-shadow: -0.025em 0.025em 0 hsla($hue, 100%, 75%, 1);
      }
    }

    &:hover {
      .playing-card-face {
        box-shadow:
          0 10px 20px hsla(0, 0%, 0%, 0.4),
          inset 0 0 0 2px hsla($hue, 100%, 80%, 0.75);
        transform: translateY(-100px) rotate(0deg) scale(2);
        transition-duration: 0ms;
        z-index: 5;

        &:after {
          animation: fade 250ms ease-out forwards;
        }
      }

      &:after {
        top: -175px;
      }
    }
  }
}

@keyframes fade {
  0% {
    opacity: 0.9;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(1.15);
  }
}
</style>

<script>
import { ref } from 'vue'
import { socketData, socket } from "../socket";
import { useQuasar } from 'quasar'
import Judge from './Judge.vue'
import ScoreBoard from './ScoreBoard.vue';

export default {
  name: 'Game',
  components: {
    Judge,
    ScoreBoard
  },
  data: function () {
    return {
      showScoreBoard: ref(false),
      sData: socketData,
      shareUrl: window.location.origin + "/join-room/" + this.$route.params.roomCode,
      $q: useQuasar(),
      dragData: {
        move: false,
        ww: window.innerWidth,
        wh: window.innerHeight,
        cardw: 0,
        cardh: 0,
        cardx: 0,
        cardy: 0,
        startcardx: 0,
        startcardy: 0,
        pinx: 0,
        piny: 0,
        pinxperc: 0,
        pinyperc: 0,
        mx: 0,
        my: 0,
        targetx: 0,
        targety: 0,
        ocardx: 0,
        ocardy: 0,
        rx: 0,
        ry: 0,
        targetrx: 0,
        targetry: 0,
        targetscale: 1,
        scale: 1,
        cardDiv: null,
        card: null,
        questionDiv: null,
        transformbefore: "",
      }
    };
  },
  methods: {
    doElsCollide: function (el1, el2) {
      let rect1 = el1.getBoundingClientRect();
      let rect2 = el2.getBoundingClientRect();
      if (rect1 != null && rect2 != null) {
        return !(rect1.right < rect2.left ||
          rect1.left > rect2.right ||
          rect1.bottom < rect2.top ||
          rect1.top > rect2.bottom);
      }
      return false;
    },
    startDrag: function (event, card) {
      this.dragData.cardDiv = event.target;
      this.dragData.card = card;

      this.dragData.move = true;
      this.dragData.cardw = event.target.offsetWidth;
      this.dragData.cardh = event.target.offsetHeight;
      this.dragData.cardx = event.target.offsetLeft;
      this.dragData.cardy = this.dragData.wh - event.target.offsetTop - this.dragData.cardh;
      this.dragData.startcardx = this.dragData.cardx;
      this.dragData.startcardy = this.dragData.cardy;
      if (event instanceof MouseEvent) {
        this.dragData.mx = event.pageX;
        this.dragData.my = event.pageY;
      }
      if (event instanceof TouchEvent) {
        this.dragData.mx = event.touches[0].pageX;
        this.dragData.my = event.touches[0].pageY;
      }

      this.dragData.pinx = this.dragData.cardw / 2;
      this.dragData.piny = this.dragData.cardh / 2;
      this.dragData.pinxperc = 100 - (this.dragData.pinx / this.dragData.cardw) * 100;
      this.dragData.pinyperc = 100 - (this.dragData.piny / this.dragData.cardh) * 100;

      let cface = event.target.querySelector(".playing-card-face");
      this.dragData.transformbefore = cface.style.transform;
      cface.style.transform = "";

    },
    drag: function (event) {
      if (this.dragData.move) {
        if (event instanceof MouseEvent) {
          this.dragData.mx = event.pageX;
          this.dragData.my = event.pageY;
        }
        if (event instanceof TouchEvent) {
          this.dragData.mx = event.touches[0].pageX;
          this.dragData.my = event.touches[0].pageY;
        }
      }
    },
    endDrag: function () {
      if (this.dragData.move) {
        this.dragData.questionDiv = document.getElementById("question");
        if (this.dragData.questionDiv != null && this.dragData.questionDiv != undefined && this.doElsCollide(this.dragData.cardDiv, this.dragData.questionDiv) && this.sData.cardsPicked.length < this.sData.currentQuestionPick && !this.sData.hasPlayed) {
          this.sData.cardsPicked.push(this.dragData.card);
          this.sData.cardsInHand.splice(this.sData.cardsInHand.indexOf(this.dragData.card), 1);
          if (this.sData.currentQuestion.includes("___")) {
            this.sData.currentQuestion = this.sData.currentQuestion.replace("___", this.dragData.card.text.replaceAll(".", ""));
          }
          else {
            this.sData.currentQuestion += ` <span class="answer-text">${this.dragData.card.text}</span>`;
          }

          if (this.sData.cardsPicked.length >= this.sData.currentQuestionPick) {
            socket.emit("playCards", this.sData.cardsPicked);
          }
          socket.emit('updateClientSocketData', socketData);
        }
        else {
          this.dragData.cardDiv.style.transform = "";
          this.dragData.cardDiv.querySelector('.playing-card-face').transformOrigin = "";
          this.dragData.cardDiv.querySelector('.playing-card-face').style.transform = this.dragData.transformbefore;
        }
        this.dragData.move = false;
        this.dragData.cardDiv = null;
        this.dragData.card = null;
      }
    },
    onResize: function () {
      this.dragData.ww = window.innerWidth;
      this.dragData.wh = window.innerHeight;
    },
    moveCard: function () {

      // set new target position
      this.dragData.targetx = this.dragData.mx - this.dragData.cardx - this.dragData.pinx;
      this.dragData.targety = this.dragData.my - this.dragData.cardy - this.dragData.piny;
      // console.log("moveCard", this.dragData.targetx, this.dragData.targety);

      // lerp to new position
      this.dragData.cardx += this.dragData.targetx * 0.25;
      this.dragData.cardy += this.dragData.targety * 0.25;
      // console.log("lerped", this.dragData.pinx, this.dragData.piny)

      // contain card to window bounds
      if (this.dragData.cardx < -this.dragData.cardw / 2) {
        this.dragData.cardx = -this.dragData.cardw / 2;
      }
      if (this.dragData.cardx > this.dragData.ww - this.dragData.cardw / 2) {
        this.dragData.cardx = this.dragData.ww - this.dragData.cardw / 2;
      }
      if (this.dragData.cardy < -this.dragData.cardh / 2) {
        this.dragData.cardy = -this.dragData.cardh / 2;
      }
      if (this.dragData.cardy > this.dragData.wh - this.dragData.cardh / 2) {
        this.dragData.cardy = this.dragData.wh - this.dragData.cardh / 2;
      }
      // console.log("bounds", this.dragData.cardx, this.dragData.cardy)


      // get rotation based on how much card moved
      this.dragData.targetrx = (this.dragData.ocardy - this.dragData.cardy - this.dragData.rx) * 3;
      this.dragData.targetry = (this.dragData.cardx - this.dragData.ocardx - this.dragData.ry) * 3;

      // lock rotation so things don't get too crazy
      this.dragData.targetrx = Math.min(this.dragData.targetrx, 90);
      this.dragData.targetrx = Math.max(this.dragData.targetrx, -90);
      this.dragData.targetry = Math.min(this.dragData.targetry, 90);
      this.dragData.targetry = Math.max(this.dragData.targetry, -90);

      // lerp to new rotation
      this.dragData.rx += this.dragData.targetrx * 0.1;
      this.dragData.ry += this.dragData.targetry * 0.1;

      // scale up when the mouse is pressed
      this.dragData.targetscale = this.dragData.move ? 2 - this.dragData.scale : 1 - this.dragData.scale;
      this.dragData.scale += this.dragData.targetscale * 0.2;

      // apply the transform
      let cardxrel = this.dragData.cardx - this.dragData.startcardx;
      let cardyrel = this.dragData.cardy - this.dragData.startcardy;
      if (this.dragData.cardDiv != null) {
        this.dragData.cardDiv.style['transform'] = 'translate3d(' + cardxrel + 'px, ' + cardyrel + 'px, 0)' + ' scale(' + this.dragData.scale + ')';
        this.dragData.cardDiv.querySelector('.playing-card-face').style['transform-origin'] = this.dragData.pinxperc + '% ' + this.dragData.pinyperc + '%';
        this.dragData.cardDiv.querySelector('.playing-card-face').style['transform'] = 'rotateY(' + this.dragData.ry + 'deg) rotateX(' + this.dragData.rx + 'deg)';
      }

      // store the old card position
      this.dragData.ocardx = this.dragData.cardx;
      this.dragData.ocardy = this.dragData.cardy;

      requestAnimationFrame(this.moveCard);
    }

  },
  created() {

    window.addEventListener('mousemove', this.drag);
    window.addEventListener('touchmove', this.drag);
    window.addEventListener('mouseup', this.endDrag);
    window.addEventListener('touchend', this.endDrag);
    window.addEventListener('resize', this.onResize);

    requestAnimationFrame(this.moveCard);
  },
  mounted() {
    this.onResize();
  },

}

</script>