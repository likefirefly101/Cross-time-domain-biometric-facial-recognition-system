import {withTokenRequest, withoutTokenRequest} from "./request";

/**
 * 注册
 * @param {object} data password,confirmPassword,email,code
 */
export function registerApi(data) {
  return withoutTokenRequest({
    url: '/user/register',
    method:'post',
    data,
  })
}

/**
 * 登录
 * @param {object} data email,password
 */
export function loginApi(data) {
  return withoutTokenRequest({
    url: '/user/login',
    method:'post',
    data,
  })
}
  
  /**
   * 发送验证码
   * @param {string} email 用户邮箱
   */
  export function sendCodeApi(email) {
    return withoutTokenRequest({
      url: `/user/sendCode?email=${email}`,
      method:'get',
    })
  }

/**
 * 上传头像
 * @param {object} data 包含file的FormData对象
 */
export function uploadAvatarApi(data) {
  return withTokenRequest({
    url: '/user/avatar',
    method:'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 修改密码
 * @param {object} data newPassword
 */
export function changePasswordApi(data) {
  return withTokenRequest({
    url: '/user/password',
    method:'put',
    data,
  })
}

/** 
 * 修改昵称
 * @param {object} data newUsername
 */
export function changeNicknameApi(data) {
  return withTokenRequest({
    url: '/user/username',
    method:'put',
    data,
  })
}

/**
 * 退出登录
 */
export function logoutApi() {
  return withTokenRequest({
    url: '/user/logout',
    method:'get',
  })
}

