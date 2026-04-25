import { withTokenRequest } from "./request";

/** 
 * 单个匹配
 * @param {Object} data - 请求数据,包括imgA,imgB与category（human/mandrillus）
 */
export function analyzeIndividualApi(data) {
  return withTokenRequest({
    url: '/ai/verify-1v1',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 从数据库中匹配
 * @param {Object} data - 请求数据,包括img与category（human/mandrillus）
 */
export function analyzeTeamApi(data) {
  return withTokenRequest({
    url: '/ai/verify-1vN',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}