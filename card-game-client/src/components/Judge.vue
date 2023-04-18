<template>
    <swiper
    :slides-per-view="3"
    :space-between="50"
    @swiper="onSwiper"
    @slideChange="onSlideChange">
      <swiper-slide  class="playing-card" v-for="card in sData.cardsToJudge" :key="card.setId + '.' + card.id"
        :id="card.setId + '.' + card.id">
        <div class="playing-card-face">
          <div class="playing-card-label">
            {{ card.text }}
          </div>
        </div>
      </swiper-slide>
    </swiper >
</template>

<script>
import { socketData, socket } from '../socket';
import { useQuasar } from 'quasar';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

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
      const onSlideChange = () => {
        console.log('slide change');
      };
      return {
        onSwiper,
        onSlideChange,
      };
    },
}
</script>


<style>
</style>

