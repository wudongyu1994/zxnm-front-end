import request from '@/utils/request'

export function getAllRole() {
  return request({
    url: '/role',
    method: 'get'
  })
}

export function getRoleByPage(params) {
  return request({
    url: '/roleByPage',
    method: 'get',
    params
  })
}
export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function modifyRole(data) {
  return request({
    url: '/role/' + data.id,
    method: 'patch',
    data
  })
}
export function deleteRole(id) {
  return request({
    url: '/role/' + id,
    method: 'delete'
  })
}
