import request from '@/utils/request'

export function getAllDevice() {
  return request({
    url: '/device',
    method: 'get'
  })
}
export function getDeviceStatusById(id) {
  return request({
    url: '/device/' + id + '/status',
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
export function setDeviceLedById(id, isTurnOn) {
  return request({
    url: '/device/' + id + '/led/' + isTurnOn,
    method: 'get'
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
