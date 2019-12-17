import request from '@/utils/request'

export function getAllRole() {
  return request({
    url: '/role',
    method: 'get'
  })
}

/*
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
*/
