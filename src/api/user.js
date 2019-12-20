import request from '@/utils/request'

export function getUserByPage(params) {
  return request({
    url: '/user',
    method: 'get',
    params
  })
}
export function addUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}
export function modifyUser(data) {
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
