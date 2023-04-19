import { createApp } from 'vue'
import { Quasar, Notify } from 'quasar'
import App from './App.vue'
import router from './router'
import { setCssVar } from 'quasar'

import './style.css'

import './assets/fonts/ClashDisplay/css/clash-display.css'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

setCssVar('primary', '#9B61FE');

const myApp = createApp(App)

myApp.use(Quasar, {
    plugins: { Notify }, // import Quasar plugins and add here
})

myApp.use(router).mount('#app');