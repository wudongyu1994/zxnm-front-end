import { login, logout, getAuth } from '@/api/auth'
import router, { resetRouter } from '@/router'
import store from '@/store'
import { Message } from 'element-ui'

const state = {
  authorities: [],
  name: '',
  principal: null,
  hasAddRoutes: false
}

const mutations = {
  SET_AUTH: (state, auths) => {
    let ret = []
    auths.forEach(auth => { ret = ret.concat(auth.authority) })
    state.authorities = ret
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_PRINCIPAL: (state, principal) => {
    state.principal = principal
  },
  SET_HASADDROUTES: (state, flag) => {
    state.hasAddRoutes = flag
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise(async(resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response
          commit('SET_AUTH', data.authorities)
          commit('SET_NAME', data.name)
          commit('SET_PRINCIPAL', data.principal)
          store.dispatch('permission/generateRoutes', store.getters.authorities)
            .then(response => {
            // dynamically add accessible routes
              router.addRoutes(response)
              commit('SET_HASADDROUTES', true)
            })
            .catch(error => {
              Message.error(error)
              commit('SET_HASADDROUTES', false)
            })
          resolve()
        })
        .catch(error => {
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
        commit('SET_HASADDROUTES', false)
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
      commit('SET_HASADDROUTES', false)
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

