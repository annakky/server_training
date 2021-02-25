import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Main from '../views/Main.vue'

import store from '../store/index'
import VueCookies from 'vue-cookies'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { unauthorized: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { unauthorized: true }
  },
  {
    path: '/',
    name: 'Main',
    component: Main,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.unauthorized) || VueCookies.get('access_token')) {
    return next()
  }

  if (VueCookies.get('access_token') === null && VueCookies.get('refresh_token') !== null) {
    store.dispatch('refreshToken')
    .then(() => {
      return next()
    })
    .catch(() => {
      return next('/login')
    })
  }

  return next('/login')
})

export default router
