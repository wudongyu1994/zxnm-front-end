import request from '@/utils/request'
import qs from 'qs'

export function getUserByPage(query) {
  return request({
    url: '/user',
    method: 'get',
    param: query
  })
}
export function createUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}
export function updateUser(data) {
  return request({
    url: '/user',
    method: 'patch',
    data
  })
}

export function test1() {
  return request({
    url: '/hello',
    method: 'get'
  })
}
export function test2(data) {
  return request({
    url: '/test',
    method: 'post',
    data: qs.stringify(data)
  })
}
