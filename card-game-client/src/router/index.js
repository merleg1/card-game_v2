import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ErrorPage from '../views/ErrorPage.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
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
        path: '/room',
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