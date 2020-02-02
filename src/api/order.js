import request from '@/utils/request'

export function getOrderByPage(params) {
  return request({
    url: '/order',
    method: 'get',
    params
  })
}
export function getProductItemByOrderId(orderId) {
  return request({
    url: '/order/' + orderId + '/productItem',
    method: 'get'
  })
}
export function addOrder(data) {
  return request({
    url: '/order',
    method: 'post',
    data
  })
}
export function modifyOrder(data) {
  return request({
    url: '/order/' + data.id,
    method: 'patch',
    data
  })
}
export function deleteOrder(id) {
  return request({
    url: '/order/' + id,
    method: 'delete'
  })
}
