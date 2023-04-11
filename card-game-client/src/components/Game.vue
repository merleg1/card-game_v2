<template>
    <div>
        GAME
        <div id="hand">
            <div class="card" v-for="card in sData.cardsInHand">
                <div class="card-face">
                    <div class="card-label">
                        {{ card.text }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
#hand {
    bottom: 0;
    display: flex;
    height: 150px;
    padding: 0 50px;
    justify-content: center;
    position: fixed;
    left: 0;
    right: 0;
}

.card {
  height: 150px;
  margin: 0 -25px;
  position: relative;
  width: 100px;
}

.card:after {
  bottom: 0;
  content: "";
  left: -60px;
  position: absolute;
  right: -60px;
  top: 0px;
  z-index: 10;
}

.card-face {
  bottom: 0;
  content: "";
  left: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  transition: 800ms cubic-bezier(0.19, 1, 0.22, 1) transform;
}

.card-face:after {
  -webkit-animation: none;
          animation: none;
  background: #fff;
  bottom: 0;
  content: "";
  left: 0;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.card-label {
  font-size: 14px;
  font-weight: 700;
  padding: 14px 14px;
}

.card:nth-child(1) .card-face {
  background: linear-gradient(-135deg, #ff9999, #da0b0b);
  box-shadow: -5px 5px 5px rgba(0, 0, 0, 0.15), inset 0 0 0 2px rgba(255, 153, 153, 0.75);
  transform: translateY(46.6666666667px) rotate(-29.1666666667deg);
}
.card:nth-child(1) .card-face .card-label {
  color: #db0000;
  text-shadow: -0.025em 0.025em 0 #ff8080;
}
.card:nth-child(1):hover .card-face {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4), inset 0 0 0 2px rgba(255, 153, 153, 0.75);
  transform: translateY(-100px) rotate(0deg) scale(2);
  transition-duration: 0ms;
  z-index: 5;
}
.card:nth-child(1):hover .card-face:after {
  -webkit-animation: fade 250ms ease-out forwards;
          animation: fade 250ms ease-out forwards;
}
.card:nth-child(1):hover:after {
  top: -175px;
}

.card:nth-child(2) .card-face {
  background: linear-gradient(-135deg, #ff99e6, #da0ba6);
  box-shadow: -5px 5px 5px rgba(0, 0, 0, 0.15), inset 0 0 0 2px rgba(255, 153, 230, 0.75);
  transform: translateY(33.3333333333px) rotate(-20.8333333333deg);
}
.card:nth-child(2) .card-face .card-label {
  color: #db00a4;
  text-shadow: -0.025em 0.025em 0 #ff80df;
}
.card:nth-child(2):hover .card-face {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4), inset 0 0 0 2px rgba(255, 153, 230, 0.75);
  transform: translateY(-100px) rotate(0deg) scale(2);
  transition-duration: 0ms;
  z-index: 5;
}
.card:nth-child(2):hover .card-face:after {
  -webkit-animation: fade 250ms ease-out forwards;
          animation: fade 250ms ease-out forwards;
}
.card:nth-child(2):hover:after {
  top: -175px;
}

.card:nth-child(3) .card-face {
  background: linear-gradient(-135deg, #cc99ff, #730bda);
  box-shadow: -5px 5px 5px rgba(0, 0, 0, 0.15), inset 0 0 0 2px rgba(204, 153, 255, 0.75);
  transform: translateY(20px) rotate(-12.5deg);
}
.card:nth-child(3) .card-face .card-label {
  color: #6e00db;
  text-shadow: -0.025em 0.025em 0 #bf80ff;
}
.card:nth-child(3):hover .card-face {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4), inset 0 0 0 2px rgba(204, 153, 255, 0.75);
  transform: translateY(-100px) rotate(0deg) scale(2);
  transition-duration: 0ms;
  z-index: 5;
}
.card:nth-child(3):hover .card-face:after {
  -webkit-animation: fade 250ms ease-out forwards;
          animation: fade 250ms ease-out forwards;
}
.card:nth-child(3):hover:after {
  top: -175px;
}

.card:nth-child(4) .card-face {
  background: linear-gradient(-135deg, #99b3ff, #0b3fda);
  box-shadow: -5px 5px 5px rgba(0, 0, 0, 0.15), inset 0 0 0 2px rgba(153, 179, 255, 0.75);
  transform: translateY(6.6666666667px) rotate(-4.1666666667deg);
}
.card:nth-child(4) .card-face .card-label {
  color: #0037db;
  text-shadow: -0.025em 0.025em 0 #809fff;
}
.card:nth-child(4):hover .card-face {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4), inset 0 0 0 2px rgba(153, 179, 255, 0.75);
  transform: translateY(-100px) rotate(0deg) scale(2);
  transition-duration: 0ms;
  z-index: 5;
}
.card:nth-child(4):hover .card-face:after {
  -webkit-animation: fade 250ms ease-out forwards;
          animation: fade 250ms ease-out forwards;
}
.card:nth-child(4):hover:after {
  top: -175px;
}

.card:nth-child(5) .card-face {
  background: linear-gradient(-135deg, #99ffff, #0bdada);
  box-shadow: -5px 5px 5px rgba(0, 0, 0, 0.15), inset 0 0 0 2px rgba(153, 255, 255, 0.75);
  transform: translateY(6.6666666667px) rotate(4.1666666667deg);
}
.card:nth-child(5) .card-face .card-label {
  color: #00dbdb;
  text-shadow: -0.025em 0.025em 0 #80ffff;
}
.card:nth-child(5):hover .card-face {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4), inset 0 0 0 2px rgba(153, 255, 255, 0.75);
  transform: translateY(-100px) rotate(0deg) scale(2);
  transition-duration: 0ms;
  z-index: 5;
}
.card:nth-child(5):hover .card-face:after {
  -webkit-animation: fade 250ms ease-out forwards;
          animation: fade 250ms ease-out forwards;
}
.card:nth-child(5):hover:after {
  top: -175px;
}

.card:nth-child(6) .card-face {
  background: linear-gradient(-135deg, #99ffb3, #0bda3f);
  box-shadow: -5px 5px 5px rgba(0, 0, 0, 0.15), inset 0 0 0 2px rgba(153, 255, 179, 0.75);
  transform: translateY(20px) rotate(12.5deg);
}
.card:nth-child(6) .card-face .card-label {
  color: #00db37;
  text-shadow: -0.025em 0.025em 0 #80ff9f;
}
.card:nth-child(6):hover .card-face {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4), inset 0 0 0 2px rgba(153, 255, 179, 0.75);
  transform: translateY(-100px) rotate(0deg) scale(2);
  transition-duration: 0ms;
  z-index: 5;
}
.card:nth-child(6):hover .card-face:after {
  -webkit-animation: fade 250ms ease-out forwards;
          animation: fade 250ms ease-out forwards;
}
.card:nth-child(6):hover:after {
  top: -175px;
}

.card:nth-child(7) .card-face {
  background: linear-gradient(-135deg, #ccff99, #73da0b);
  box-shadow: -5px 5px 5px rgba(0, 0, 0, 0.15), inset 0 0 0 2px rgba(204, 255, 153, 0.75);
  transform: translateY(33.3333333333px) rotate(20.8333333333deg);
}
.card:nth-child(7) .card-face .card-label {
  color: #6edb00;
  text-shadow: -0.025em 0.025em 0 #bfff80;
}
.card:nth-child(7):hover .card-face {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4), inset 0 0 0 2px rgba(204, 255, 153, 0.75);
  transform: translateY(-100px) rotate(0deg) scale(2);
  transition-duration: 0ms;
  z-index: 5;
}
.card:nth-child(7):hover .card-face:after {
  -webkit-animation: fade 250ms ease-out forwards;
          animation: fade 250ms ease-out forwards;
}
.card:nth-child(7):hover:after {
  top: -175px;
}

.card:nth-child(8) .card-face {
  background: linear-gradient(-135deg, #ffe699, #daa60b);
  box-shadow: -5px 5px 5px rgba(0, 0, 0, 0.15), inset 0 0 0 2px rgba(255, 230, 153, 0.75);
  transform: translateY(46.6666666667px) rotate(29.1666666667deg);
}
.card:nth-child(8) .card-face .card-label {
  color: #dba400;
  text-shadow: -0.025em 0.025em 0 #ffdf80;
}
.card:nth-child(8):hover .card-face {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4), inset 0 0 0 2px rgba(255, 230, 153, 0.75);
  transform: translateY(-100px) rotate(0deg) scale(2);
  transition-duration: 0ms;
  z-index: 5;
}
.card:nth-child(8):hover .card-face:after {
  -webkit-animation: fade 250ms ease-out forwards;
          animation: fade 250ms ease-out forwards;
}
.card:nth-child(8):hover:after {
  top: -175px;
}

@-webkit-keyframes fade {
  0% {
    opacity: 0.9;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.15);
  }
}

@keyframes fade {
  0% {
    opacity: 0.9;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.15);
  }
}

</style>

<script>
import { socketData, socket } from "../socket";
import { useQuasar } from 'quasar'

export default {
    name: 'Game',
    data: function () {
        return {
            sData: socketData,
            shareUrl: window.location.origin + "/join-room/" + this.$route.params.roomCode,
            $q: useQuasar()
        };
    },
    methods: {
    }
}
</script>