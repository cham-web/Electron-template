import request from '@/utils/request'

/**
 *GET /api/home/login 登录
 * @param {*} params
 * @returns
 */
export function login (params) {
  return request({
    url: '/api/home/login',
    method: 'get',
    params
  })
}
