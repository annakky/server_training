import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'
import VueCookies from 'vue-cookies'

// import auth from './modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken: ''
  },
  mutations: {

  },
  actions: {
    async refreshToken ({ commit }) {
      try {
        const token = await axios.post('/api/refreshToken', { refresh_token: VueCookies.get('refresh_token') })
          .then(res => {
            if (res.data.status == 200) {
              VueCookies.set('access_token', res.data.data.access_token, '10s')
              axios.defaults.headers.access_token = VueCookies.get('access_token')
            }
          });
        VueCookies.set('access_token', token.data.data.access_token, '60s')
        return token
      } catch (err) {
        return err
      }
    }
  }
})
