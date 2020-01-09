import request from '@/utils/request'

export function getAllPermissionTree() {
  return request({
    url: '/treePermission',
    method: 'get'
  })
}
export function createPermission(data) {
  return request({
    url: '/permission',
    method: 'post',
    data
  })
}
export function modifyPermission(data) {
  return request({
    url: '/permission/' + data.id,
    method: 'patch',
    data
  })
}
export function deletePermission(id) {
  return request({
    url: '/permission/' + id,
    method: 'delete'
  })
}
