<template>
  
  <router-view/>
</template>

<style>
</style>  

<script>
import { socket } from "./socket";
import { useQuasar } from 'quasar'


export default {
  name: 'App',
  components: {},
  setup () {
    const $q = useQuasar()

    // calling here; equivalent to when component is created
    $q.dark.set(true)
  },
  created() {
    socket.connect();
  },
  beforeUnmount() {
    socket.disconnect();
  }
}
</script>