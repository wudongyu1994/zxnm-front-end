import request from '@/utils/request'

export function getLogisticsByOrderId(orderId) {
  return request({
    url: '/order/' + orderId + '/logistics',
    method: 'get'
  })
}
export function addLogistics(data) {
  return request({
    url: '/logistics',
    method: 'post',
    data
  })
}
export function modifyLogistics(data) {
  return request({
    url: '/logistics/' + data.id,
    method: 'patch',
    data
  })
}
export function deleteLogistics(id) {
  return request({
    url: '/logistics/' + id,
    method: 'delete'
  })
}
