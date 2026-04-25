import React from 'react'
import EditableItem from '../common/EditableItem';

import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changeNicknameAsync, changePasswordAsync, logout, logoutAsync } from '../../store/authSlice';
import editIcon from '../../assets/log_slices/_edit.webp';
import userAvatar from '../../assets/user.png';
import telephoneIcon from '../../assets/log_slices/_telephone.webp';
import qqIcon from '../../assets/log_slices/_qq.webp';
import wechatIcon from '../../assets/log_slices/_wechat.webp';
import mailboxIcon from '../../assets/log_slices/_mailbox.webp';

function SettingPageContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmittingLogout, setIsSubmittingLogout] = useState(false)
  const { userId, username, thirdPartyBindings } = useSelector((state) => state.auth);
  const accountDisplay = userId ? `ID_${userId}` : 'ID_未设置';
  const nicknameDisplay = username || '未设置';

  const thirdPartyItems = [
    { key: 'mailbox', icon: mailboxIcon },
    { key: 'qq', icon: qqIcon, iconClassName: 'transform scale-120' },
    { key: 'wechat', icon: wechatIcon, iconClassName: 'transform scale-120' },
    { key: 'telephone', icon: telephoneIcon },
  ];

  // 统一的保存逻辑
  const handleUpdate = async (field, newValue) => {
    const normalizedValue = newValue.trim();
    if (!normalizedValue) {
      message.warning('内容不能为空');
      throw new Error('内容不能为空');
    }

    if (field === 'nickname') {
      await dispatch(changeNicknameAsync({ 'newUsername': normalizedValue })).unwrap();
      localStorage.setItem('username', normalizedValue); // 更新本地存储中的用户名
      message.success('昵称修改成功');
      return;
    }

    if (field === 'password') {
      await dispatch(changePasswordAsync({ 'newPassword': normalizedValue })).unwrap();
      message.success('密码修改成功');
    }
  };

  const handleThirdPartyAction = () => {
    message.info('该功能暂未开放')
  }

  const handleLogout = async () => {
    if (isSubmittingLogout) {
      return
    }

    try {
      setIsSubmittingLogout(true)
      await dispatch(logoutAsync()).unwrap()
      message.success('已退出登录')
    } catch (error) {
      dispatch(logout())
      message.warning('服务端退出失败，已清理本地登录状态')
      console.error('退出登录失败', error)
    } finally {
      setIsSubmittingLogout(false)
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className='w-full h-screen flex justify-center items-center '>
      <div className=' w-150 h-142.5 shadow-[0px_0px_20px_1px_rgba(37,37,37,0.12)] rounded-[20px_20px_20px_20px] bg-[F6F6F6] flex justify-center items-center flex-col gap-8 px-6'>
        <div className='relative w-[88px] h-[88px] border border-solid border-[#707070] bg-[#F9F9F9] rounded-full flex justify-center items-center'>
          <div className='absolute right-0 bottom-0 w-[26px] h-[26px] bg-[#129B98] flex justify-center items-center rounded-full'>
            <img src={editIcon} alt="" />
          </div>
          {/* 这里放置用户头像 */}
          <img src={userAvatar} className='transform scale-75' alt="" />
        </div>
        <div className='h-78 w-full flex justify-center items-center gap-5'>
          <div className='h-full w-62 flex flex-col justify-between items-start'>
            <div className='h-6 font-normal text-lg text-[#4C4C4C] text-left; font-family: Microsoft YaHei, Microsoft YaHei'>基础信息设置</div>
            <div className='relative w-full'>
              {/* 账号 - 不可修改 */}
              <EditableItem
                label="账号"
                value={accountDisplay}
                editable={false}
              />

              {/* 昵称 - 点击修改图标变 Input */}
              <EditableItem
                label="昵称"
                value={nicknameDisplay}
                onSave={(val) => handleUpdate('nickname', val)}
              />

              {/* 密码 - 掩码显示，点击修改图标变 Input */}
              <EditableItem
                label="密码"
                value=""
                type="password"
                onSave={(val) => handleUpdate('password', val)}
              />
            </div>
          </div>
          <div className='h-full w-62 flex flex-col justify-between items-start gap-6'>
            <div className='h-6 font-normal text-lg text-[#4C4C4C] text-left; font-family: Microsoft YaHei, Microsoft YaHei'>关联第三方账号</div>
            <div className='flex flex-col justify-between items-start w-full h-full'>
              {thirdPartyItems.map((item) => {
                const binding = thirdPartyBindings?.[item.key]
                return (
                  <div key={item.key} className='flex justify-between items-center w-full'>
                    <div className='flex justify-center items-center gap-8'>
                      <img src={item.icon} className={item.iconClassName || ''} alt="" />
                      <span className='font-normal text-xs text-[#4C4C4C] leading-[30px] text-left; font-family: Microsoft YaHei, Microsoft YaHei'>
                        {binding?.value || '未绑定'}
                      </span>
                    </div>
                    <div
                      onClick={handleThirdPartyAction}
                      className='font-normal text-xs text-[#4C4C4C] leading-[30px] text-left; font-family: Microsoft YaHei, Microsoft YaHei cursor-pointer border-b-[1px] border-solid border-[#4C4C4C] transform -translate-y-0.5 opacity-90'
                    >
                      {binding?.bound ? '点击修改' : '点击绑定'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className='flex justify-center items-center gap-10 w-full'>
          <div onClick={handleLogout} className={`w-[104px] h-[41px] border rounded-[5px_5px_5px_5px] border-solid border-[#4C4C4C] flex justify-center items-center font-normal text-base text-[#4C4C4C] text-left not-italic ${isSubmittingLogout ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
            退出账号
          </div>
          <div className='w-[104px] h-[41px] border rounded-[5px_5px_5px_5px] border-solid border-[#E16277] flex justify-center items-center font-normal text-base text-[#E16277] text-left not-italic cursor-pointer'>
            注销账号
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingPageContent