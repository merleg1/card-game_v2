<template>
    <div class="text-h4 scoreboard-title title-clashDisplay">Scoreboard:</div>
    <div class="player-table">
        <q-toolbar class="bg-primary text-white shadow-2">
            <q-toolbar-title>Players</q-toolbar-title>
        </q-toolbar>
        <q-list class="rounded-borders player-list" dense bordered separator>
            <q-scroll-area class="player-list">
                <q-item v-for="player in orderedPlayers">
                    <q-item-section avatar>
                        <q-avatar color="primary" text-color="white">
                            {{ player.name.charAt(0) }}
                        </q-avatar>
                    </q-item-section>
                    <q-item-section>
                        {{ player.name }}
                    </q-item-section>
                    <q-item-section>
                        {{ player.score }}
                    </q-item-section>
                    <q-item-section style="width: 4em;" side>
                        <q-icon v-if="player.isAdmin" name="star" color="yellow" size="2em" />
                    </q-item-section>
                </q-item>
            </q-scroll-area>
        </q-list>
    </div>
</template>

<style>
.scoreboard-title {
    margin-bottom: 0.5em;
    text-align: center;
}

.player-table {
    font-family: 'ClashDisplay-Medium', sans-serif;
    text-align: center;
}

.player-list {
    height: 50vh;
}
</style>

<script>
import { socketData } from "../socket";
import { useQuasar } from 'quasar'

export default {
    name: 'ScoreBoard',
    components: {
    },
    data: function () {
        return {
            sData: socketData,
            $q: useQuasar(),
        };
    },
    computed: {
        orderedPlayers() {
            return this.sData.players.sort((a, b) => b.score - a.score);
        }
    },


}

</script>