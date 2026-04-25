import React from 'react'
import SideBar from '../SideBar/SideBar'
import { useSelector } from "react-redux";
import UserCard from '../common/UserCard';

function MainLayout(props) {
    const isLogin = useSelector((state) => state.auth.isLogin)

    return (
        <div className='w-screen h-screen relative'>
          <div className='fixed top-0 left-0 w-21.5 h-full bg-[#F6F6F6] z-10'>
            <SideBar />
          </div>
          <div id='main-scroll-container' className='absolute top-0 left-21.5 w-[calc(100%-5.5rem)] h-full overflow-y-auto overflow-x-hidden'>
            {props.children}
          </div>
          {isLogin && <UserCard />}
        </div>
    )
} 

export default MainLayout