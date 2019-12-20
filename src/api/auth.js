import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: qs.stringify(data),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
export function getAuth() {
  return request({
    url: '/auth',
    method: 'get'
  })
}
