import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param auth
 * @param route
 */
export function hasPermission(auth, route) {
  if (route.meta && route.meta.permissions) {
    const per = route.meta.permissions
    return auth.some(au => au.indexOf(per) > -1)
    // return route.meta.permissions.every(per => auth.includes(per))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param auth
 */
export function filterAsyncRoutes(routes, auth) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(auth, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, auth)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, auth) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, auth)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
