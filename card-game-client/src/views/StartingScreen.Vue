<template>
    <Transition>
    <div class="loading-wrapper">
        <div class="loading-text">
        <p>Prinzipe<br> <span class="ml-1">Öber</span><br> <span class="ml-2">Bord</span></p>
        </div>
    </div>
    </Transition>
</template>

<style>
.ml-1 {
    animation: ml-1 2s forwards;
}

@keyframes ml-1 {
    0% {
        margin-left:0;
    }

    100% {
        margin-left:5vw;
    }
}

.ml-2 {
    animation: ml-2 2s forwards;
}

@keyframes ml-2 {
    0% {
        margin-left:0;
    }

    100% {
        margin-left:10vw;
        color:#9B61FE;
    }
}

.loading-wrapper {
  display:flex;
  height:90vh;
  width:94vw;
  margin:auto;
  align-content: center;
  justify-content: center;
}

.loading-text {
  display:flex;
  flex-wrap:wrap;
  align-content: center;
  font-family: 'ClashDisplay-Semibold', sans-serif;
  font-size: 8rem;
  line-height: 7rem;
  text-align: left;
  text-transform: uppercase;
  color:white;
  animation: loader 3s forwards;
}

@keyframes loader {
    0% {
      opacity:0;
    }

    100% {
      opacity:1;
    }
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
    created(){
      setTimeout( () => this.$router.push({ path: '/Home'}), 4000);
    }
}
</script>