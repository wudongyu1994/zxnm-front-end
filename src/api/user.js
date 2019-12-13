import request from '@/utils/request'

export function test1() {
  return request({
    url: '/hello',
    method: 'get'
  })
}
export function test2(data) {
  return request({
    url: '/user/test',
    method: 'post',
    data
  })
}
export function test3(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
