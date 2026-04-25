import React, { useRef, useState } from 'react'
import { useAnalyzeRequest } from '../../hooks/useAnalyzeRequest'
import { useDispatch } from 'react-redux'
import { message, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import backgroundImage from '../../assets/home_slices/@2x/_background@2x.webp'
import frame1Image from '../../assets/home_slices/@2x/_frame1@2x.webp'
import uploadImage from '../../assets/home_slices/_image-files-yellow.webp'
import frame2Image from '../../assets/home_slices/_frame2.webp'
import routeObj from '../../utils/RouteConfig'
import { setIndividualUploads, setTeamUpload } from '../../store/analyzeSlice'

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })

function SharedContent(props) {
  const { handleAnalyze, currentManner } = useAnalyzeRequest()
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFilechange = async (event) => {
    const files = event.target.files

    if (!files || files.length === 0) {
      return
    }

    // 判断当前选择是"一对一匹配"还是"数据库查询"
    if (currentManner === '一对一匹配' && files.length < 2) {
      message.error('一对一匹配需要上传两张图片')
      return
    }

    const imageData = currentManner === '一对一匹配'
      ? {
          imgA: files[0],
          imgB: files[1],
        }
      : {
          img: files[0],
        }

    const detailPath = currentManner === '一对一匹配'
      ? routeObj.dashboard.detail.individual
      : routeObj.dashboard.detail.team

    setLoading(true)
    try {
      if (currentManner === '一对一匹配') {
        const [imgA, imgB] = await Promise.all([
          readFileAsDataUrl(files[0]),
          readFileAsDataUrl(files[1]),
        ])
        dispatch(setIndividualUploads({ imgA, imgB }))
      } else {
        const img = await readFileAsDataUrl(files[0])
        dispatch(setTeamUpload({ img }))
      }

      const response = await handleAnalyze(imageData)
      if (response) {
        navigate(detailPath)
      }
    } finally {
      setLoading(false)
    }

    // 清空 input，允许重新选择相同的文件
    event.target.value = ''
  }

  return (
    <Spin spinning={loading} size="large">
      <div className='w-full h-screen flex justify-center items-end'>
        <img src={backgroundImage} className='mb-8' alt="" />
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <img src={frame1Image} className='translate scale-50 permanent-rotate' alt="" />
        </div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer' onClick={handleUploadClick}>
          <img src={uploadImage} alt="" />
          <div className='pt-2 w-16 font-normal text-base text-[#FBB03B] leading-[14px] text-center'>上传图片</div>
        </div>
        <div className='absolute top-1/8 left-1/2 transform -translate-x-1/2'>
          <img src={frame2Image} alt="" />
          <div className='absolute top-1/8 left-1/2 transform -translate-x-1/2 flex flex-col justify-center items-center'>
            <div className='w-[312px] text-center font-bold text-2xl text-black leading-10 whitespace-pre-line' dangerouslySetInnerHTML={{ __html: props.title }}>
            </div>
            <div className='w-[270px] font-normal text-sm text-[#4C4C4C] leading-[20px] text-center'>
              {props.description}
            </div>
          </div>
        </div>

        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          multiple={currentManner === '一对一匹配'}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFilechange}
        />
      </div>
    </Spin>
  )
}

export default SharedContent