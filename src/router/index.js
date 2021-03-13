import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:"*",
    redirect:"/"
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/location/:location',
    name: 'Home',
    component: Home
  },
  {
    path: '/update',
    name: 'Update',
    component: () => import(/* webpackChunkName: "update" */ '../views/Update.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
