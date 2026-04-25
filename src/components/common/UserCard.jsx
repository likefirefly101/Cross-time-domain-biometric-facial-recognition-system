import React from 'react'
import { useSelector } from 'react-redux'
import defaultUserAvatar from '../../assets/user.png'

function UserCard() {
    const username = useSelector((state) => state.auth.username) // 从Redux获取用户信息;

    return (
        <div className='fixed top-4 right-8 flex justify-center items-center gap-10'>
            <div className='font-normal text-xs text-[#4C4C4C] tracking-[2px] font-family: Microsoft YaHei, Microsoft YaHei'>
               欢迎回来， {username || '请先设置用户昵称'}
            </div>
            <div className='w-[45px] h-[45px] border border-solid border-[#707070] bg-[#FFFFFF] rounded-[50%] flex justify-center items-center'>
                {/* 用户头像 */}
                <img src={defaultUserAvatar} className='object-contain transform scale-75' alt="用户头像" />
            </div>
        </div>
    )
} 

export default UserCard