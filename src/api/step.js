import request from '@/utils/request'

export function getAllStep() {
  return request({
    url: '/step',
    method: 'get'
  })
}
export function addStep(data) {
  return request({
    url: '/step',
    method: 'post',
    data
  })
}
export function modifyStep(data) {
  return request({
    url: '/step/' + data.id,
    method: 'patch',
    data
  })
}
export function deleteStep(id) {
  return request({
    url: '/step/' + id,
    method: 'delete'
  })
}
