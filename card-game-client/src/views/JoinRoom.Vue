<script>
import { socket } from "../socket";

export default {
    name: 'JoinRoom',
    data: function () {
        return {
            nickname: '',
            roomCode: ''
        };
    },
    methods: {
        joinRoom: function () {
            socket.emit("joinRoom", { roomCode : this.roomCode, nickname: this.nickname });
        }
    }
}
</script>

<template>
    <div>
        <div>
            <h2>Join a existing room</h2>
            <div class="form-group">
                <label for="roomcode">Room code</label>
                <input type="text" class="form-control" id="roomcode" placeholder="Enter Room code" v-model="roomCode">
            </div>
            <div class="form-group">
                <label for="nickname">Nickname</label>
                <input type="text" class="form-control" id="nickname" placeholder="Enter nickname" v-model="nickname">
            </div>
            <button class="btn btn-primary" @click="joinRoom">Join room</button>
            <br>
            <router-link to="/">Join Room</router-link>
        </div>
    </div>
</template>