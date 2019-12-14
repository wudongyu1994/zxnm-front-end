import request from '@/utils/request'
import qs from 'qs'

export function test1() {
  return request({
    url: '/hello',
    method: 'get'
  })
}
export function test2(data) {
  return request({
    url: '/test',
    method: 'post',
    data: qs.stringify(data)
  })
}
