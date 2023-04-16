<template>
    <carousel3d class="judge" :width="200" :height="400" :inverse-scaling="50" :space="50" :perspective="15">
      <slide  :index="i" class="playing-card" v-for="card in sData.cardsToJudge" :key="card.setId + '.' + card.id"
        :id="card.setId + '.' + card.id">
        <div class="playing-card-face">
          <div class="playing-card-label">
            {{ card.text }}
          </div>
        </div>
      </slide>
    </carousel3d>
</template>

<script>
import { socketData, socket } from '../socket';
import { useQuasar } from 'quasar';
import { carousel3d, slide } from 'vue-carousel-3d';

export default {
name: 'Judge',
components: {
    'carousel3d': window['carousel-3d'].Carousel3d,
    'slide': window['carousel-3d'].Slide
  }
data: function () {
    return {
    sData: socketData,
    shareUrl: window.location.origin + "/join-room/" + this.$route.params.roomCode,
    cardsPicked: [],
    $q: useQuasar(),
    }
},
}
</script>


<style>
body {
  max-width: 375px;
  margin: 10px auto;
}
.carousel-3d-container {
  .carousel-3d-slide {
    padding: 20px;
    
    .title { font-size: 22px; }
  }
}
</style>

<script>
import { socketData, socket } from '../socket';
import { useQuasar } from 'quasar';
import { CardSwipe, CardSwipeItem } from '@eshengsky/vue-card-swipe';

export default {
name: 'Judge',
components: {
    CardSwipe,
    CardSwipeItem
  },
data: function () {
    return {
    sData: socketData,
    $q: useQuasar(),
    }
},
}
</script>


