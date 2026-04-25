import React, { useState, useEffect } from 'react'
import './index.css'
import { message, Tooltip } from 'antd'
import { createStaticStyles } from 'antd-style';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LogOutButton from '../common/LogOutButton'
import routeObj from '../../utils/RouteConfig'
import logoImage from '../../assets/logo.png'
import homeIcon from '../../assets/home_slices/_home.webp'
import analysisIcon from '../../assets/home_slices/_analysis.webp'
import detailIcon from '../../assets/home_slices/_detail.webp'
import settingIcon from '../../assets/home_slices/_setting.webp'

function SideBar() {
  const [activeLink, setActiveLink] = useState('/')
  const location = useLocation()
  const navigate = useNavigate()
  const isLogin = useSelector((state) => state.auth.isLogin)
  const { individualResult, teamResult, individualUploads, teamUpload, lastMode } = useSelector((state) => state.analyze)

  const hasIndividualData = Boolean(individualResult || individualUploads)
  const hasTeamData = Boolean(teamResult || teamUpload)
  const hasAnyAnalyzeData = hasIndividualData || hasTeamData

  const targetDetailPath = (() => {
    if (lastMode === 'team' && hasTeamData) {
      return routeObj.dashboard.detail.team
    }

    if (lastMode === 'individual' && hasIndividualData) {
      return routeObj.dashboard.detail.individual
    }

    if (hasIndividualData) {
      return routeObj.dashboard.detail.individual
    }

    return routeObj.dashboard.detail.team
  })()

  const classNames = createStaticStyles(({ css }) => ({
    container: css`
    padding: 10px;
  `,
  }));

  const styles = {
    container: {
      backgroundColor: 'rgba(138,142,158, 0.8)',
      padding: 12,
      color: '#fff',
      borderRadius: 4,
    },
  }

  useEffect(() => {
    setActiveLink(location.pathname)
  }, [location.pathname])

  const handleDetailClick = (e) => {
    if (!hasAnyAnalyzeData) {
      e.preventDefault()
      message.warning('暂无权进入，请先上传文件再查看结果')
      if (!location.pathname.startsWith(routeObj.dashboard.analysis.root)) {
        message.loading('正在跳转...')
      }

      setTimeout(() => {
        navigate(routeObj.dashboard.analysis.individual)
      }, 1500)
      return
    }

    e.preventDefault()
    navigate(targetDetailPath)
  }

  // 计算竖边的位置 (每个按钮 h-16 = 64px，gap-3 = 12px)
  const getIndicatorTop = () => {
    if (activeLink === '/') return 0
    if (activeLink.startsWith('/analysis')) return 90
    if (activeLink.startsWith('/detail')) return 166
    if (activeLink.startsWith('/setting')) return 242
    return 0
  }

  return (
    <div className=" flex flex-col justify-start items-center w-full gap-10">
      <div className='w-[45px] h-[45px] mt-10 border border-solid border-[#707070] rounded-[50%] bg-[#FFFFFF] flex justify-center items-center'>
        <img src={logoImage} className='object-fill' alt="" />
      </div>
      <div className='flex flex-col justify-start items-center gap-3 w-full relative'>
        {/* 移动竖边指示器 */}
        <div
          className='absolute left-0 top-1/2 transform -translate-y-1/2 w-0 h-[39px] border-l-[5px] border-solid border-black transition-all duration-300 z-10'
          style={{ top: `calc(${getIndicatorTop()}px + 2rem)` }}
        ></div>
        <Tooltip classNames={classNames} styles={styles} placement="right" title="首页" arrow={false}>
          <div className={`relative w-full h-16 flex justify-center items-center transition-colors duration-300 ${activeLink === '/' ? 'active' : ''}`}>
            <Link to="/" className=' flex justify-center items-center' >
              <img src={homeIcon} alt="" />
            </Link>
          </div>
        </Tooltip>
        <div className='w-[59px] h-0 border-b-[3px] border-solid border-[#949494]'></div>
        <Tooltip classNames={classNames} styles={styles} placement="right" title="上传比对" arrow={false}>
          <div className={`relative w-full h-16 flex justify-center items-center transition-colors duration-300 ${activeLink.startsWith('/analysis') ? 'active' : ''}`}>
            <Link to="/analysis/individual" className='flex justify-center items-center'>
              <img src={analysisIcon} alt="" />
            </Link>
          </div>
        </Tooltip>
        <Tooltip classNames={classNames} styles={styles} placement="right" title="结果分析" arrow={false}>
          <div className={`relative w-full h-16 flex justify-center items-center transition-colors duration-300 ${activeLink.startsWith('/detail') ? 'active' : ''}`}>
            <Link to={targetDetailPath} onClick={handleDetailClick} className='flex justify-center items-center'>
              <img src={detailIcon} alt="" />
            </Link>
          </div>
        </Tooltip>
        <Tooltip classNames={classNames} styles={styles} placement="right" title="用户设置" arrow={false}>
          <div className={`relative w-full h-16 flex justify-center items-center transition-colors duration-300 ${activeLink.startsWith('/setting') ? 'active' : ''}`}>
            <Link to="/setting" className='flex justify-center items-center'>
              <img src={settingIcon} alt="" />
            </Link>
          </div>
        </Tooltip>
      </div>
      <Tooltip classNames={classNames} styles={styles} placement="right" title="退出登录" arrow={false}>
      <div className='absolute bottom-8 w-full h-16 flex justify-center items-center cursor-pointer'>
        <LogOutButton isLogin={isLogin} />
      </div>
      </Tooltip>
    </div>
  )
}

export default SideBar