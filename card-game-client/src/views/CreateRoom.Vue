<template>
    <div class="q-pa-md create-room-form">
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <div class="text-h4">Create a new room</div>
            <q-input filled v-model="nickname" label="Your nickname *" hint="A descriptive name" lazy-rules :rules="[
                val => val != '' || 'Please type your nickname',
                val => val && val.length >= nicknameMinLength && val.length <= nicknameMaxLength || 'Your nickname must be between ' + nicknameMinLength + ' and ' + nicknameMaxLength + ' characters'
            ]" />

            <q-input filled type="number" v-model="numberOfRounds" label="Number of Rounds to play *" lazy-rules :rules="[
                val => val !== null && val !== '' || 'Please type Number of Rounds',
                val => val > 0 && val < 100 || 'Please type a Number of Rounds between 1 and 50'
            ]" />

            <div>
                <q-btn label="Submit" type="submit" color="primary" />
                <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
        </q-form>
        <div class="go-back"><router-link to="/"><q-icon name="arrow_back" /> Go back</router-link></div>

    </div>
</template>

<style>
.create-room-form {
    width: 600px;
}

.go-back {
    margin-top: 2em;
}
</style>

<script>
import { socket, socketData } from "../socket";
import { useQuasar } from 'quasar'

export default {
    data: function () {
        return {
            sData: socketData,
            nicknameMaxLength: 12,
            nicknameMinLength: 4,
            nickname: '',
            numberOfRounds: 5,
            $q: useQuasar()
        };
    },
    mounted() {
        if (this.sData.roomJoined) {
            this.$router.push({ name: 'Room', params: { roomCode: this.sData.roomCode } });
        }
    },
    methods: {
        onSubmit() {
            this.$q.notify({
                color: 'green-5',
                textColor: 'white',
                icon: 'cloud_done',
                message: 'Data submitted'
            })
            socket.emit("createRoom", { nickname: this.nickname, numberOfRounds: this.numberOfRounds });
        },
        onReset() {
            this.nickname = '';
        }
    },


}
</script>