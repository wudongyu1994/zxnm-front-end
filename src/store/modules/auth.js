import { login, logout, getAuth } from '@/api/auth'
import { resetRouter } from '@/router'

const state = {
  authorities: [],
  name: '',
  principal: null
}

const mutations = {
  SET_AUTH: (state, auth) => {
    state.authorities = auth
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_PRINCIPAL: (state, principal) => {
    state.principal = principal
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_AUTH', data.authorities)
        commit('SET_NAME', data.name)
        commit('SET_PRINCIPAL', data.principal)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user authorities
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getAuth().then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        commit('SET_AUTH', data.authorities)
        commit('SET_NAME', data.name)
        commit('SET_PRINCIPAL', data.principal)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_AUTH', [])
        commit('SET_NAME', '')
        commit('SET_PRINCIPAL', null)
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove auth
  resetAuth({ commit }) {
    return new Promise(resolve => {
      commit('SET_AUTH', [])
      commit('SET_NAME', '')
      commit('SET_PRINCIPAL', null)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

