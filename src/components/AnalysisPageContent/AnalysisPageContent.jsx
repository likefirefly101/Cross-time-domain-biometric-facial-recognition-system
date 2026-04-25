import React from 'react'
import './index.css'
import SharedContent from './SharedContent'
import routeObj from '../../utils/RouteConfig'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ModalSelect from '../common/ModalSelect'

function AnalysisPageContent() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const location = useLocation()
    
    useEffect(() => {
        if (location.pathname === routeObj.dashboard.analysis.individual) {
            setTitle('点击下方上传图片<br />进行相似度匹配或生物库检索')
            setDescription('若为一对一匹配，则上传两张图片，若为数据库查询，请仅上传一张图片')
        }
        else if (location.pathname === routeObj.dashboard.analysis.team) {
            setTitle('点击下方上传图片<br />查询系统数据库内同一个体')
            setDescription('上传的图片将作为查询源文件')
        }
    }, [location.pathname])

    return (
        <>
        <SharedContent title={title} description={description} />
        <ModalSelect />
        </>
    )
}

export default AnalysisPageContent