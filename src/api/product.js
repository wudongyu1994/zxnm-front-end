import request from '@/utils/request'

export function getProductVO(params) {
  return request({
    url: '/product',
    method: 'get',
    params
  })
}
export function addProductVO(data) {
  return request({
    url: '/product',
    method: 'post',
    data
  })
}
export function modifyProductVO(data) {
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
