<template>
    <Game v-if="sData.gameStarted" />
    <Lobby v-else />
</template>

<script>
import Lobby from '../components/Lobby.vue'
import Game from '../components/Game.vue'
import { socketData } from "../socket";

export default {
    name: 'Room',
    data: function () {
        return {
            roomCode: this.$route.params.roomCode,
            sData: socketData
        };
    },
    mounted() {
        if (!socketData.roomJoined) {
            this.$router.push('/');
        }
    },
    components: {
        Lobby, 
        Game
    }
}
</script>