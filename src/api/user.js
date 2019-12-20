import request from '@/utils/request'

export function getUserByPage(params) {
  return request({
    url: '/user',
    method: 'get',
    params
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
