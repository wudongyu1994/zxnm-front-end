import Cookies from 'js-cookie'

const AuthKey = 'vue_admin_template_auth'

export function getAuths() {
  return Cookies.get(AuthKey)
}

export function setToken(token) {
  return Cookies.set(AuthKey, token)
}

export function removeToken() {
  return Cookies.remove(AuthKey)
}
