<template>
  <swiper
  :effect="'cards'"
  :modules="modules"
  :grabCursor="true"
    @swiper="onSwiper" @slideChange="onSlideChange">
    <swiper-slide class="judging-card" v-for="card in sData.cardsToJudge" :key="card.id" :id="card.id">
      <div class="judging-card-face">
        <div class="judging-card-label">
          {{ card.text }}
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script>
import { socketData, socket } from '../socket';
import { useQuasar } from 'quasar';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

import 'swiper/css/effect-cards';
import { EffectCards } from 'swiper';

export default {
  name: 'Judge',
  components: {
    Swiper,
    SwiperSlide,
  },
  data: function () {
    return {
      sData: socketData,
      $q: useQuasar(),
    }
  },
  setup() {
    const onSwiper = (swiper) => {
      console.log(swiper);
    };
    const onSlideChange = (s) => {
      console.log(s);
      console.log('slide change');
    };
    return {
      onSwiper,
      onSlideChange,
      modules: [EffectCards],
    };
  },
}
</script>


<style>

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
</style>

