import React from 'react'
import { useLocation } from 'react-router-dom'
import searchImage from '../../assets/home_slices/_search-image.webp'
import ResultPageContent1v1 from './ResultPageContent1v1'
import ResultPageContent1vN from './ResultPageContent1vN'
import routeObj from '../../utils/RouteConfig'

function DetailPageContent() {
    const location = useLocation()
    const isIndividualMode = location.pathname === routeObj.dashboard.detail.individual

    return (
        <div className='relative w-full flex-1 flex justify-center items-end text-3xl font-bold text-[#707070]'>
            {isIndividualMode ? <ResultPageContent1v1 /> : <ResultPageContent1vN />}
            <img src={searchImage} alt="Search" className='absolute bottom-0 right-9' />
        </div>
    )
}

export default DetailPageContent