<template>
  <div class="text-h5 waiting-text" v-if="sData.hasJudged">
    <q-spinner-hourglass color="purple" size="2em" />
    <br />
    You have voted. <br />
    Grab a drink and wait for the other players.
    <br />
    <q-spinner-hourglass color="purple" size="2em" />
  </div>
  <div>
    <swiper :effect="'cards'" :modules="modules" :grabCursor="true" @swiper="onSwiper" @slideChange="onSlideChange">
      <swiper-slide class="judging-card" v-for="card in sData.cardsToJudge" :key="card.id" :id="card.id">
        <div class="judging-card-face">
          <div class="judging-card-label">
            {{ card.text }}
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <Transition name="vote-button" v-if="!sData.hasJudged">
      <q-btn :key="activeCardNumber" @click="vote" class="j-button"
        :label="'Vote for card number ' + (activeCardNumber + 1)" color="primary" />
    </Transition>
  </div>
</template>

<script>
import { socketData, socket } from '../socket';
import { useQuasar } from 'quasar';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

import 'swiper/css/effect-cards';
import { EffectCards } from 'swiper';
import { Transition } from 'vue';

export default {
  name: 'Judge',
  components: {
    Swiper,
    SwiperSlide,
    Transition
  },
  data: function () {
    return {
      sData: socketData,
      activeCardNumber: 0,
      $q: useQuasar(),
    }
  },
  setup() {
    return {
      modules: [EffectCards],
    };
  },
  methods: {
    vote() {
      if (!this.sData.hasJudged) {
        socket.emit('voteForCard', this.sData.cardsToJudge[this.activeCardNumber].id);
      }
    },
    onSwiper: function (swiper) {
      this.activeCardNumber = swiper.realIndex;
    },
    onSlideChange: function (swiper) {
      this.activeCardNumber = swiper.realIndex;
    },
  },
}
</script>


<style>
.waiting-text {
  -webkit-user-select: none;
  /* Safari */
  -ms-user-select: none;
  /* IE 10 and IE 11 */
  user-select: none;
  /* Standard syntax */
  font-family: Georgia, serif;
  margin-bottom: 2em;
  width: 50vw;
}

.judging-card {
  width: 200px !important;
  height: 300px !important;
  background: #000;
  border: 1px solid white;
  -webkit-user-select: none;
  /* Safari */
  -ms-user-select: none;
  /* IE 10 and IE 11 */
  user-select: none;
  /* Standard syntax */
  position: relative;
}

.judging-card:after {
  bottom: 0;
  content: "";
  left: -60px;
  position: absolute;
  right: -60px;
  top: 0px;
  z-index: 10;
}

.judging-card-face {
  bottom: 0;
  content: "";
  left: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
}

.judging-card-face:after {
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
}


.judging-card-label {
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 16px 16px;
}

.swiper {
  width: 200px;
  height: 300px;
}

.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: bold;
  color: #fff;
}

.j-button {
  padding: 0.5em 4em;
  margin: 3em 0.5em 0.5em 0.5em;
}

.vote-button-enter-active,
.vote-button-leave-active {
  transition: 0.3s all ease;
  opacity: 1;
}

.vote-button-enter-from {
  transform: translateX(100vw);
  opacity: 0;
}

.vote-button-leave-to {
  transform: translateX(-100vw);
  opacity: 0;
}
</style>

