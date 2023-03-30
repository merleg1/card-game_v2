<script>
import { socket } from "../socket";

export default {
    name: 'CreateRoom',
    data: function () {
        return {
            nickname: ''
        };
    },
    methods: {
        createRoom: function () {
            socket.emit("createRoom", { nickname: this.nickname });
        }
    }
}
</script>

<template>
    <div>
        <h2>Create a new Room</h2>
        <div class="form-group">
            <label for="nickname">Nickname</label>
            <input type="text" class="form-control" id="nickname" placeholder="Enter nickname" v-model="nickname">
        </div>
        <button class="btn btn-primary" @click="createRoom">Create room</button>
        <br>
        <router-link to="/">Go back</router-link>
    </div>
</template>