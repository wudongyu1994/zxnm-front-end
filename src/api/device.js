import request from '@/utils/request'

export function getAllDevice() {
  return request({
    url: '/device',
    method: 'get'
  })
}
export function getDevicePropertyById(id) {
  return request({
    url: '/device/' + id + '/property',
    method: 'get'
  })
}
export function getDeviceLedHistoryById(id) {
  return request({
    url: '/device/' + id + '/propertyHistory/led',
    method: 'get'
  })
}
export function getDeviceDevTempHistoryById(id) {
  return request({
    url: '/device/' + id + '/propertyHistory/devTemp',
    method: 'get'
  })
}
export function getDeviceEventById(id) {
  return request({
    url: '/device/' + id + '/event',
    method: 'get'
  })
}
export function getDeviceEventHistoryById(id) {
  return request({
    url: '/device/' + id + '/propertyHistory/event',
    method: 'get'
  })
}
export function clearDeviceEventById(id, params) {
  return request({
    url: '/device/' + id + '/eventClear',
    method: 'get',
    params
  })
}
export function setDeviceLedById(id, params) {
  return request({
    url: '/device/' + id + '/led',
    method: 'get',
    params
  })
}
export function addDevice(data) {
  return request({
    url: '/device',
    method: 'post',
    data
  })
}
export function deleteDevice(id) {
  return request({
    url: '/device/' + id,
    method: 'delete'
  })
}
