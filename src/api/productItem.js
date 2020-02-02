import request from '@/utils/request'

export function getProductItem(params) {
  return request({
    url: '/product',
    method: 'get',
    params
  })
}
