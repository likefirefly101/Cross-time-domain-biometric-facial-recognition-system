import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { message } from 'antd'
import { login, registerAsync, sendCodeAsync } from '../../store/authSlice'
import eyeIcon from '../../assets/log_slices/_preview-close-one(1).webp'
import qqIcon from '../../assets/log_slices/_qq.webp'
import wechatIcon from '../../assets/log_slices/_wechat.webp'

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&._-]{6,20}$/
const CODE_REGEX = /^\d{6}$/

function RegisterForm({ onSwitchToLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const dispatch = useDispatch()

  useEffect(() => {
    if (countdown <= 0) {
      return undefined
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  const validateForm = () => {
    const normalizedEmail = email.trim()

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      message.error('请输入正确的邮箱格式')
      return false
    }

    if (!PASSWORD_REGEX.test(password)) {
      message.error('密码需为6-20位，且至少包含字母和数字')
      return false
    }

    if (password !== confirmPassword) {
      message.error('两次输入的密码不一致')
      return false
    }

    if (!CODE_REGEX.test(code.trim())) {
      message.error('验证码需为6位数字')
      return false
    }

    return true
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsRegistering(true)
      const response = await dispatch(registerAsync({
        email: email.trim(),
        password,
        confirmPassword,
        code: code.trim(),
      })).unwrap()

      if (response?.token && response?.userInfo) {
        dispatch(login({
          token: response.token,
          userInfo: response.userInfo,
        }))
      }

      message.success('注册成功，请登录')
      onSwitchToLogin()
    } catch (error) {
      console.error('注册失败', error)
    } finally {
      setIsRegistering(false)
    }
  }

  const handleSendCode = async () => {
    const normalizedEmail = email.trim()

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      message.warning('请输入正确邮箱后再获取验证码')
      return
    }

    try {
      setIsSendingCode(true)
      await dispatch(sendCodeAsync(normalizedEmail)).unwrap()
      setCountdown(60)
      message.success('验证码已发送，请查收邮箱')
    } catch (error) {
      console.error('发送验证码失败', error)
    } finally {
      setIsSendingCode(false)
    }
  }

  return (
    <div className='flex flex-col w-4/5 gap-6'>
      <div className='flex flex-col gap-6.5 justify-start items-start'>
        <div className='font-extrabold text-2xl text-black text-center not-italic normal-case; font-family: Microsoft YaHei, Microsoft YaHei;'>
          注册账号
        </div>
        <div>
          <p>已有账号？<button onClick={() => onSwitchToLogin()} className="justify-self-center text-sm text-[#F7A225] text-left not-italic hover:underline border-b-amber-400 border-b-2 bg-none border-0 cursor-pointer p-0">立即登录</button></p>
        </div>
      </div>
      <form onSubmit={handleRegister} className='flex flex-col gap-7'>
        <div className='custom-log-border'>
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            pattern={EMAIL_REGEX.source}
            required
          />
        </div>
        <div className='custom-log-border flex justify-between items-center'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            pattern={PASSWORD_REGEX.source}
            required
          />
          <img
            className='cursor-pointer'
            src={eyeIcon}
            onClick={() => setShowPassword(!showPassword)}
            alt='toggle password'
          />
        </div>
        <div className='custom-log-border flex justify-between items-center'>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="确认密码"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            pattern={PASSWORD_REGEX.source}
            required
          />
          <img
            className='cursor-pointer'
            src={eyeIcon}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            alt='toggle confirm password'
          />
        </div>
        <div className='flex justify-between items-center gap-5'>
          <div className='custom-log-border w-1/2'>
            <input
              type="text"
              placeholder="输入验证码"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              pattern={CODE_REGEX.source}
              maxLength={6}
              required
            />
          </div>
          <button
            type='button'
            className='custom-getVerificationNode-button border-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'
            onClick={handleSendCode}
            disabled={isSendingCode || countdown > 0}
          >
            {isSendingCode ? '发送中...' : countdown > 0 ? `${countdown}s后重试` : '获取邮箱验证码'}
          </button>
        </div>
        <button type='submit' className='custom-button cursor-pointer border-0' disabled={isRegistering}>
          {isRegistering ? '注册中...' : '注册'}
        </button>
      </form>
      <div className='flex flex-col justify-center items-center gap-4'>
        <div className='h-4.75 font-normal text-sm text-[#949494] text-left not-italic; font-family: Microsoft YaHei, Microsoft YaHei cursor-pointer'>其他方式注册</div>
        <div className='flex justify-center items-center gap-10'>
          <img src={qqIcon} alt="" />
          <img src={wechatIcon} alt="" />
        </div>
      </div>
    </div>
  )
}

export default RegisterForm