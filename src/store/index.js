import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import config from '../config'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    user: {
      token: localStorage.getItem('token') || '',
      userInfo: {}
    }
  },
  mutations: {
    login (state, user) {
      state.user.token = user.token
      state.user.userInfo = user.user_info
      state.isLoggedIn = true
    },
    logout (state) {
      state.user.token = ''
      state.user.userInfo = {}
      state.isLoggedIn = false
    },
    getUserInfo (state, user) {
      state.user.userInfo = user.data
      state.isLoggedIn = true
    }
  },
  actions: {
    login ({commit}, user) {
      Axios.post(config.API_SERVER + 'login', {
        email: user.email,
        password: user.pwd
      })
      .then(response => {
        localStorage.setItem('token', response.data.data.token)
        commit('login', response.data.data)
      })
    },
    logout({commit}){
      localStorage.removeItem('token')
      commit('logout')
    },
    getUserInfo({commit, state}) {
      Axios.get(config.API_SERVER + 'user', 
      { headers: { Authorization: `Bearer ${state.user.token}` } })
      .then(response => {
        console.log(response)
        commit('getUserInfo', response.data)
      })
    }
  },
  modules: {
  }
})
