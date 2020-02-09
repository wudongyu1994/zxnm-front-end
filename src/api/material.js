import request from '@/utils/request'

export function getMaterialByProductItemId(productItemId) {
  return request({
    url: '/productItem/' + productItemId + '/material',
    method: 'get'
  })
}
export function addMaterial(data) {
  return request({
    url: '/material',
    method: 'post',
    data
  })
}
export function modifyMaterial(data) {
  return request({
    url: '/material/' + data.id,
    method: 'patch',
    data
  })
}
export function deleteMaterial(id) {
  return request({
    url: '/material/' + id,
    method: 'delete'
  })
}
