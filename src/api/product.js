import request from '@/utils/request'

export function getProduct(params) {
  return request({
    url: '/product',
    method: 'get',
    params
  })
}
export function addProduct(data) {
  return request({
    url: '/product',
    method: 'post',
    data
  })
}
export function modifyProduct(data) {
  return request({
    url: '/product/' + data.id,
    method: 'patch',
    data
  })
}
export function deleteProduct(id) {
  return request({
    url: '/product/' + id,
    method: 'delete'
  })
}
