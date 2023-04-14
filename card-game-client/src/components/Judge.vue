<template>
    <card-swipe :ratio="0.65" class="judge">
      <card-swipe-item class="playing-card" v-for="card in sData.cardsToJudge" :key="card.setId + '.' + card.id"
        :id="card.setId + '.' + card.id">
        <div class="playing-card-face">
          <div class="playing-card-label">
            {{ card.text }}
          </div>
        </div>
      </card-swipe-item>
    </card-swipe>
</template>

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

.detail-wrap {
  display: block;
  height: 100%;
  border-radius: 5px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.detail-wrap h5 {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 0 15px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    word-break: break-all;
    font-size: 16px;
    line-height: 20px;
    color: #fff;
    -webkit-line-clamp: 2;
    max-height: 38px;
    font-weight: bold;
    margin-bottom: 10px;
    text-shadow: 0px 0px 4px #333;
  }

.color-card {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  color: #fff;
  font-size: 36px;
}

.msg {
  font-size: 14px;
  margin: 10px 0;
  color: #555;
}
</style>
