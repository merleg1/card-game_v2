<template>
    <div class="q-pa-md create-room-form">
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <div class="text-h4">Create a new room</div>
            <q-input filled v-model="nickname" label="Your nickname *" hint="A descriptive name" lazy-rules :rules="[
                val => val != '' || 'Please type your nickname',
                val => val && val.length >= nicknameMinLength && val.length <= nicknameMaxLength || 'Your nickname must be between ' + nicknameMinLength + ' and ' + nicknameMaxLength + ' characters'
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
import { socket } from "../socket";
import { useQuasar } from 'quasar'

export default {
    data: function () {
        return {
            nicknameMaxLength: 12,
            nicknameMinLength: 4,
            nickname: '',
            $q: useQuasar()
        };
    },
    methods: {
        onSubmit() {
            this.$q.notify({
                color: 'green-5',
                textColor: 'white',
                icon: 'cloud_done',
                message: 'Data submitted'
            })
            socket.emit("createRoom", { nickname: this.nickname });
        },
        onReset() {
            this.nickname = '';
        }
    },


}
</script>