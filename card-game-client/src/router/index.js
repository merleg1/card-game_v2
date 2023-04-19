import { createRouter, createWebHistory } from 'vue-router'
import ErrorPage from '../views/ErrorPage.vue'

const routes = [
    {
        path: '/',
        name: 'Starting',
        component: () => import('../views/StartingScreen.vue')
    },
    {
        path: '/Home',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/create-room',
        name: 'CreateRoom',
        component: () => import('../views/CreateRoom.vue')
    }, {
        path: '/join-room/:roomCode?',
        name: 'JoinRoom',
        component: () => import('../views/JoinRoom.vue')
    }, {
        path: '/room/:roomCode',
        name: 'Room',
        component: () => import('../views/Room.vue')
    },
    {
        path: '/:catchAll(.*)',
        name: 'ErrorPage',
        component: ErrorPage,
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router