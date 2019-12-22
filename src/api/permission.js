import request from '@/utils/request'

export function getAllPermissionTree() {
  return request({
    url: '/treePermission',
    method: 'get'
  })
}

