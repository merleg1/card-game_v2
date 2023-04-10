<template>
    <div class="q-pa-md row flex-center q-gutter-md">
        <router-link class="card-router" to="/create-room">
            <q-card class="card text-white column flex-center"
                style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">
                <q-card-section>
                    <div class="text-h4">Create a new room</div>
                </q-card-section>
            </q-card>
        </router-link>
        <router-link class="card-router" to="/join-room">
            <q-card class="card text-white column flex-center"
                style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">
                <q-card-section>
                    <div class="text-h4">Join an existing room</div>
                </q-card-section>
            </q-card>
        </router-link>
    </div>
</template>

<style>
.card {
    padding: 8em;
    margin: 1em;
    width: 40vw;
    height: 40vh;
}

.card-router {
    text-decoration: none;
}
</style>

<script>
import { socketData } from "../socket";

export default {
    data: function () {
        return {
            sData: socketData,
            nicknameMaxLength: 12,
        };
    },
    mounted() {
        if (this.sData.roomJoined) {
            this.$router.push({ name: 'Room', params: { roomCode: this.sData.roomCode } });
        }
    },
}
</script>