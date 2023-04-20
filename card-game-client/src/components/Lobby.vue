<template>
    <div class="q-pa-md lobby">
        <div class="text-h4 title title-clashDisplay">Room <span class="text-primary">{{ sData.roomCode }}</span></div>
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
        <div class="bg-primary rounded">
        <q-toolbar class="rounded text-white">
            <q-toolbar-title>Players</q-toolbar-title>
        </q-toolbar>
        <q-list class="rounded-borders bg-dark rounded border-p player-list-lobby" dense bordered separator>
            <q-scroll-area class="player-list-lobby">
                <q-item v-for="player in sData.players">
                    <q-item-section avatar>
                        <q-avatar color="primary" text-color="white">
                            {{ player.name.charAt(0) }}
                        </q-avatar>
                    </q-item-section>
                    <q-item-section>
                        {{ player.name }}
                    </q-item-section>
                    <q-item-section  style="width: 4em;" side>
                        <q-icon v-if="player.isAdmin" name="star" color="yellow" size="2em" />
                    </q-item-section>
                </q-item>
            </q-scroll-area>
        </q-list>
        </div>
        <div class="start-game">
            <div v-if="sData.isAdmin">
                <q-btn @click="startGame" class="l-button" label="Start game" color="primary" />
                <q-btn @click="leaveRoom" class="l-button" label="Close Room" color="red" />
            </div>           
            <div v-else>
                <q-spinner-hourglass color="purple" size="3em" />
                Waiting for admin to start the game
                <q-spinner-hourglass color="purple" size="3em" />
                <br>
                <q-btn @click="leaveRoom" class="l-button" label="Leave Room" color="red" />
            </div>
        </div>
    </div>
</template>

<style>

.rounded {
    border-radius:15px!important;
}

.border-p {
    border:1px solid #9B61FE;
}

.title {
    margin-bottom: 0.5em;
}

.lobby {
    width: 80vw;
}

.share-div {
    margin-bottom: 2em;
}

.share {
    cursor: pointer;
}

.share-url {
    color: #9B61FE;
}

.player-list-lobby {
    height: 30vh;
}

.start-game {
    margin-top: 1em;
}

.l-button {
    padding: 0.5em 4em;
    margin: 0.5em;
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
        },
        leaveRoom() {
            socket.emit("leaveRoom", { roomCode: this.sData.roomCode });
        }
    }
}
</script>