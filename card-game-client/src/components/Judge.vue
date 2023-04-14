<template>
    <div class="judge">
        <div class="playing-card" v-for="card in sData.cardsToJudge" :key="card.setId + '.' + card.id"
        :id="card.setId + '.' + card.id">
        <div class="playing-card-face">
          <div class="playing-card-label">
            {{ card.text }}
          </div>
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
    CardStack,
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