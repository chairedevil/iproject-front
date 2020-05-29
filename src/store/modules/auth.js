import Axios from 'axios'
import config from '../../config'
import router from '../../router'

const auth = {
  namespaced: true,
  state: {
    user: {
      token: localStorage.getItem('token') || '',
      userInfo: {}
    },
    status: {
      msg : '',
      isLoggedIn: false,
    }
  },
  mutations: {
    login (state, user) {
      state.user.token = user.token
      state.user.userInfo = user.user_info
      state.status.isLoggedIn = true
    },
    logout (state) {
      state.user.token = ''
      state.user.userInfo = {}
      state.status.isLoggedIn = false
    },
    getUserInfo (state, user) {
      state.user.userInfo = user.data
      state.status.isLoggedIn = true
    },
    setMsg (state, msg) {
      state.status.msg = msg
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
        commit('setMsg', 'ログインしました。')
        commit('login', response.data.data)
      })
      .catch(err => {
        console.log(err.response.data.message)
        if(err.response.data.message === 'Unauthorised.'){
          commit('setMsg', '')
          commit('setMsg', 'メールまたはパスワードが間違います。')
        }
      })
    },
    logout({commit}){
      localStorage.removeItem('token')
      commit('setMsg', 'ログアウトしました。')
      commit('logout')
      
      if (router.currentRoute.fullPath !== '/') router.push('/')
      //router.push('/')
    },
    getUserInfo({commit, state}) {
      Axios.get(config.API_SERVER + 'user', 
      { headers: { Authorization: `Bearer ${state.user.token}` } })
      .then(response => {
        commit('setMsg', 'ログイン中')
        commit('getUserInfo', response.data)
      })
    },
    setAlert ({commit}, msg) {
      commit('setMsg', msg)
    }
  },
}

export default auth