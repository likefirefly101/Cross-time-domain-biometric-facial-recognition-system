// TitlePageContent.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import InformationPageContent from '../InformationPageContent/InformationPageContent';
import './index.css'
import heroBackground from '../../assets/home_slices/_background1.webp'
import gearIcon from '../../assets/home_slices/@2x/_gear@2x.webp'

function TitlePageContent() {
    const isLogin = useSelector((state) => state.auth.isLogin)
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true);
    };

    useEffect(() => {
        if (isClicked) {
            // 【修改滚动逻辑】
            setTimeout(() => {
                // 1. 获取真正的滚动容器
                const scrollContainer = document.getElementById('main-scroll-container');
                if (scrollContainer) {
                    // 2. 滚动距离为容器当前的可视高度 (刚好一屏)
                    scrollContainer.scrollTo({
                        top: scrollContainer.clientHeight, 
                        behavior: 'smooth'
                    });
                }
            }, 50); // 给 React 一点时间完成 DOM 渲染
        }
    }, [isClicked]);

    return (
        <>
            <div
                className='relative w-full h-screen shrink-0 flex justify-center items-center -gap-20 bg-no-repeat bg-center bg-cover -translate-y-18'
                style={{ backgroundImage: `url(${heroBackground})` }}
            >
                <div className='flex flex-col justify-center items-center gap-9'>
                    <div className="flex items-center justify-center w-[644px]"> {/* class 改为 className */}
                        <h1
                            data-text="TRACE-Net"
                            className="relative font-black text-8xl text-white tracking-wider
                                after:content-[attr(data-text)]
                                after:absolute after:-left-1.5 after:top-[4px] after:-z-10
                                after:bg-gradient-to-b after:from-[#E94E65] after:via-[#8E7AB5] after:to-[#7e90a3]
                                after:bg-clip-text after:text-transparent
                                drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)]"
                        >
                            TRACE-Net
                        </h1>
                    </div>
                    {/* 清理了非法的 className 语法 */}
                    <div className='w-[644px] h-[37px] ml-10 font-normal text-[28px] text-black text-left not-italic font-[Microsoft_YaHei]'>
                        基于非线性与对抗双重解耦的跨时域面部识别系统
                    </div>
                    <div className='w-155 h-[69px] ml-3 font-normal text-sm text-[#4C4C4C] leading-[25px] text-left not-italic font-[Microsoft_YaHei] cursor-pointer'>
                        本系统通过非线性显性解耦与对抗隐性解耦的双重解耦策略，结合FE-Net50、高效卷积块注意力模块、对抗域适应、梯度反转层以及多任务联合训练等核心算法，能够彻底抽离岁月干扰并提取纯净身份特征，满足人类与非人类生物在跨越漫长时间线下的高精度、强泛化身份核验需求。</div>
                </div>
                <div className="ml-50 -translate-x-10">
                    {/* 清理了多余的 transform 类 */}
                    <img className='gear-rotate scale-70' src={gearIcon} alt="" />
                </div>
                <div className='absolute bottom-30 left-1/2 -translate-x-1/2 flex justify-center items-center gap-40'>
                    {isLogin ? null : (
                        <Link to={"/login"} className="w-40 h-[52px] shadow-[3px_3px_6px_1px_rgba(0,0,0,0.16)] rounded-[5px] bg-[#F96452] font-normal text-xl text-white flex justify-center items-center hover:bg-[#fd7734] transition-colors duration-300 font-[Microsoft_YaHei]">
                            开始体验
                        </Link>
                    )}
                    {isClicked ? null : (
                        <a href="javascript:void(0)" onClick={handleClick} className="w-40 h-[52px] shadow-[3px_3px_6px_1px_rgba(0,0,0,0.16)] rounded-[5px] bg-[#3F9AF7] font-normal text-xl text-white flex justify-center items-center hover:bg-[#3F9AF7]/80 transition-colors duration-300 font-[Microsoft_YaHei]">
                            了解更多
                        </a>
                    )}
                </div>
            </div>

            {isClicked ? <InformationPageContent /> : null}
        </>
    )
}

export default TitlePageContent