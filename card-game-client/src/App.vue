<template>
  
  <router-view/>
</template>

<style>
</style>  

<script>
import { socket } from "./socket";

export default {
  name: 'App',
  components: {},
  created() {
    socket.connect();
  },
  beforeUnmount() {
    socket.disconnect();
  }
}
</script>