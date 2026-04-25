import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import { login, loginAsync } from '../../store/authSlice'
import { validatePresetLogin } from '../../utils/presetLoginValidator'
import eyeIcon from '../../assets/log_slices/_preview-close-one(1).webp'
import qqIcon from '../../assets/log_slices/_qq.webp'
import wechatIcon from '../../assets/log_slices/_wechat.webp'

function LoginForm({ onSwitchToRegister }) {
    const [account, setAccount] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLogining, setIsLogining] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    
    // 从Redux获取预设账户
    const presetAccount = useSelector((state) => state.user.presetAccount)

    const navigateToFrom = () => {
        const from = location.state?.from?.pathname || '/'
        navigate(from, { replace: true })
    }

    const handleLogin = async (e) => {
        e.preventDefault()

        // 预设账户验证逻辑保留并迁移到独立工具文件
        if (validatePresetLogin(account, password, presetAccount)) {
            // 分发login action
            dispatch(login({
                token: presetAccount.token,
                userInfo: presetAccount.userInfo
            }))
            navigateToFrom()
            return
        }

        try {
            setIsLogining(true)
            await dispatch(loginAsync({
                account: account.trim(),
                password,
            })).unwrap()
            navigateToFrom()
        } catch (error) {
            console.error('登录失败', error)
            message.error('登录失败，请检查账号或密码')
        } finally {
            setIsLogining(false)
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    return (
        <div className='flex flex-col w-4/5 gap-6'>
            <div className='flex flex-col gap-6.5 justify-start items-start'>
                <div className='font-extrabold text-2xl text-black text-center not-italic normal-case; font-family: Microsoft YaHei, Microsoft YaHei;'>
                    登录账号
                </div>
                <div>
                    <p>没有账号？<button onClick={() => onSwitchToRegister()} className="justify-self-center text-sm text-[#F7A225] text-left not-italic hover:underline border-b-amber-400 border-b-2 bg-none border-0 cursor-pointer p-0">立即注册</button></p>
                </div>
            </div>
            <form onSubmit={handleLogin} className='flex flex-col gap-7'>
                <div className='custom-log-border'>
                    <input 
                        type="text" 
                        placeholder="手机号/邮箱" 
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        required
                    />
                </div>
                <div className='custom-log-border flex justify-between items-center'>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="密码" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <img 
                        className='cursor-pointer' 
                        src={eyeIcon}
                        onClick={togglePasswordVisibility}
                        alt="toggle password"
                    />
                </div>
                <div className='flex justify-between items-center'>
                    <label className='relative '>
                        <input type="radio" value="remember" />
                        <span className='absolute left-5 top-1 w-20 h-4 font-normal text-xs text-[#949494] text-left; font-family: Microsoft YaHei, Microsoft YaHei'>记住登录状态</span>
                    </label>
                    <p className=' h-4.75 font-normal text-sm text-[#949494] text-left not-italic; font-family: Microsoft YaHei, Microsoft YaHei cursor-pointer'>忘记密码？</p>
                </div>
                <button type="submit" className='custom-button cursor-pointer border-0' disabled={isLogining}>
                    {isLogining ? '登录中...' : '登录'}
                </button>
            </form>
            <div className='flex flex-col justify-center items-center gap-4.5'>
                <div className='h-4.75 font-normal text-sm text-[#949494] text-left not-italic; font-family: Microsoft YaHei, Microsoft YaHei cursor-pointer'>其他方式登录</div>
                <div className='flex justify-center items-center gap-10'>
                    <img src={qqIcon} alt="" />
                    <img src={wechatIcon} alt="" />
                </div>
            </div>
        </div>
    )
}

export default LoginForm