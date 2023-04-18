<template>
    <div class="card-stack">
        <div class="stack-card" v-for="card in sData.cardsToJudge" :key="card.id">
            <div class="stack-card-face">
                <div class="stack-card-label">{{ card.text }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { socketData, socket } from '../socket';
import { useQuasar } from 'quasar';

export default {
  name: 'Judge',
  components: {

  },
  data: function () {
    return {
      sData: socketData,
      $q: useQuasar(),
    }
  },
}
</script>


<style>
/* body {
  max-width: 375px;
  margin: 10px auto;
} */

.carousel-3d-container .carousel-3d-slide {
  padding: 20px;
}

.carousel-3d-container .carousel-3d-slide .title {
  font-size: 22px;
}
</style>

