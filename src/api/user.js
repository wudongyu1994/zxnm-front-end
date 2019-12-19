import request from '@/utils/request'
import qs from 'qs'

export function getUserByPage(pageSetting) {
  return request({
    url: '/user',
    method: 'get',
    params: pageSetting
  })
}
export function createUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function updateUser(data) {
  return request({
    url: '/user/' + data.id,
    method: 'patch',
    data
  })
}
export function deleteUser(id) {
  return request({
    url: '/user/' + id,
    method: 'delete'
  })
}
