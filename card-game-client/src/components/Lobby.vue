<template>
    <div class="q-pa-md lobby">
        <div class="text-h4 title">Room: {{ sData.roomCode }}</div>
        <div class="share-div">
            <span class="share" @click="copyShareUrl">
                <q-icon name="share" />
                Share this link with your friends:
                <br>
                <span class="share-url">
                    {{ shareUrl }}
                </span>
            </span>
        </div>
        <q-toolbar class="bg-primary text-white shadow-2">
            <q-toolbar-title>Players</q-toolbar-title>
        </q-toolbar>
        <q-list class="rounded-borders player-list" dense bordered separator>
            <q-scroll-area class="player-list">
                <q-item v-for="player in sData.players">
                    <q-item-section avatar>
                        <q-avatar color="primary" text-color="white">
                            {{ player.name.charAt(0) }}
                        </q-avatar>
                    </q-item-section>
                    <q-item-section>
                        {{ player.name }}
                    </q-item-section>
                    <q-item-section v-if="player.isAdmin" side>
                        <q-icon name="star" color="yellow" size="2em" />
                    </q-item-section>
                </q-item>
            </q-scroll-area>
        </q-list>
        <div class="start-game">
            <q-btn v-if="sData.isAdmin" @click="startGame" class="start-game-button" label="Start game" color="primary" />
            <div v-else>
                <q-spinner-hourglass color="purple" size="3em" />
                Waiting for admin to start the game
                <q-spinner-hourglass color="purple" size="3em" />
            </div>
        </div>
    </div>
</template>

<style>
.title {
    margin-bottom: 0.5em;
}

.lobby {
    width: 80vw;
}

.share-div {
    margin-bottom: 1em;
}

.share {
    cursor: pointer;
}

.share-url {
    color: #35a2ff;
}

.player-list {
    height: 30vh;
}

.start-game {
    margin-top: 1em;
}

.start-game-button {
    padding: 0.5em 4em;
}
</style>
 
<script>
import { socketData, socket } from "../socket";
import { useQuasar, copyToClipboard } from 'quasar'

export default {
    name: 'Lobby',
    data: function () {
        return {
            sData: socketData,
            shareUrl: window.location.origin + "/join-room/" + this.$route.params.roomCode,
            $q: useQuasar()
        };
    },
    methods: {
        copyShareUrl() {
            copyToClipboard(this.shareUrl)
                .then(() => {
                    this.$q.notify({
                        color: 'grey-5',
                        textColor: 'white',
                        icon: 'info',
                        message: 'Copied to clipboard'
                    })
                })
                .catch(() => {
                    this.$q.notify({
                        color: 'red-5',
                        textColor: 'white',
                        icon: 'warning',
                        message: 'Failed to copy to clipboard'
                    })
                })
        },
        startGame() {
            socket.emit("startGame", { roomCode: this.sData.roomCode });
        }
    }
}
</script>