import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { logout, logoutAsync } from '../../store/authSlice'
import logoutIcon from '../../assets/home_slices/_logout.webp'

function LogOutButton(props) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleLogout = async () => {
        if (isSubmitting) {
            return
        }

        try {
            setIsSubmitting(true)
            await dispatch(logoutAsync()).unwrap()
            message.success('已退出登录')
        } catch (error) {
            // logoutAsync 内部 finally 会清理本地状态，这里兜底确保一致
            dispatch(logout())
            message.warning('服务端退出失败，已清理本地登录状态')
            console.error('退出登录失败', error)
        } finally {
            setIsSubmitting(false)
            navigate('/login', { replace: true })
        }
    }

    return props.isLogin? (
        <button
            type='button'
            className='w-[50px] h-[50px] bg-[#EAEAEA] rounded-full flex justify-center items-center border-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
            onClick={handleLogout}
            disabled={isSubmitting}
        >
            <img src={logoutIcon} alt="" />
        </button>
    ):null
}

export default LogOutButton