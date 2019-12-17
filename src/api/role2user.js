import request from '@/utils/request'

export function getRole2UserByUserId(userId) {
  return request({
    url: '/role2user/' + userId,
    method: 'get'
  })
}

