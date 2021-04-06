import request from '@/utils/request'

/**
 *GET /api/imei/qryImei 查询设备
 * @param {*} params
 * @returns
 */
export function qryImei (params) {
  return request({
    url: '/api/imei/qryImei',
    method: 'get',
    params
  })
}
