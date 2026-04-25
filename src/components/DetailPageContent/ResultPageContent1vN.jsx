import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { message } from 'antd'
import CarouselPagination from '../common/Carousel'
import ProgressBar from '../common/ProgressBar'
import MatchInformationCard from '../common/MatchInformationCard'
import FailedPopup from './FailedPopup'
import { ChevronsRight } from 'lucide-react';
import { get1vNAssetsByCategory } from '../../utils/mandrillus1vNAssets'

function PreviewFrame({ src, label }) {
  const [status, setStatus] = useState(src ? 'loading' : 'empty')
  const imageRef = useRef(null)

  useEffect(() => {
    if (!src) {
      setStatus('empty')
      return
    }

    setStatus('loading')

    const imageElement = imageRef.current
    if (imageElement && imageElement.complete && imageElement.naturalWidth > 0) {
      setStatus('loaded')
    }
  }, [src])

  return (
    <div className='w-57 h-57 border-2 border-blue-200 overflow-hidden bg-[#F7F7F7] relative flex items-center justify-center'>
      {src ? (
        <>
          <img
            ref={imageRef}
            src={src}
            alt={label}
            className={`object-cover w-full h-full transition-opacity duration-200 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('error')}
          />
          {status === 'loading' && (
            <div className='absolute inset-0 flex items-center justify-center text-sm text-[#AFAFAF]'>
              图片加载中...
            </div>
          )}
          {status === 'error' && (
            <div className='absolute inset-0 flex flex-col items-center justify-center gap-1 text-sm text-[#AFAFAF]'>
              <span>图片加载失败</span>
              <span>{label}</span>
            </div>
          )}
        </>
      ) : (
        <div className='flex flex-col items-center justify-center gap-1 text-sm text-[#AFAFAF]'>
          <span>暂无图片</span>
          <span>{label}</span>
        </div>
      )}
    </div>
  )
}

function normalizeMatchList(teamResult) {
  if (!teamResult) {
    return []
  }

  // 新格式：match_info 为数组
  if (Array.isArray(teamResult.match_info)) {
    return teamResult.match_info
  }

  // 兼容旧格式：match_info 为单对象
  if (teamResult.match_info && typeof teamResult.match_info === 'object') {
    return [teamResult.match_info]
  }

  // 兼容可能出现的其他字段名
  if (Array.isArray(teamResult.match_infos)) {
    return teamResult.match_infos
  }
  if (Array.isArray(teamResult.matches)) {
    return teamResult.matches
  }
  if (Array.isArray(teamResult.top_matches)) {
    return teamResult.top_matches
  }

  return []
}

function ResultPageContent1vN() {
  const teamResult = useSelector((state) => state.analyze.teamResult)
  const teamUpload = useSelector((state) => state.analyze.teamUpload)
  const isMatchFound = Boolean(teamResult?.is_match_found)
  const [showFailedPopup, setShowFailedPopup] = useState(false)
  const [isHeatmapMode, setIsHeatmapMode] = useState(false)
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const uploadedImage = teamUpload?.img

  const rawMatches = normalizeMatchList(teamResult)

  const top5Matches = Array.from({ length: 5 }, (_, index) => {
    const item = rawMatches[index]
    if (!item) {
      return {
        identity_id: '--',
        similarity_percentage: 0,
      }
    }

    return {
      identity_id: item.identity_id || '--',
      similarity_percentage: Number(item.similarity_percentage ?? 0),
      gallery_image_base64: item.gallery_image_base64 || null,
    }
  })

  const category = teamResult?.category
  const { returnMap: returnMapSlides, heatmaps: heatmapMapSlides } = get1vNAssetsByCategory(category)

  const selectedMatch = top5Matches[currentMatchIndex] || top5Matches[0]

  const dbSlides = returnMapSlides.length > 0
    ? returnMapSlides.map((url, index) => ({
      id: `db-${index + 1}`,
      title: `TOP${index + 1} 数据库匹配图`,
      url,
    }))
    : top5Matches.map((item, index) => ({
      id: `db-${index + 1}`,
      title: `TOP${index + 1} 数据库匹配图`,
      url: item.gallery_image_base64 || '',
    }))

  const heatmapSlides = heatmapMapSlides.length > 0
    ? heatmapMapSlides.map((url, index) => ({
      id: `heat-${index + 1}`,
      title: `TOP${index + 1} 热力图`,
      url,
    }))
    : top5Matches.map((item, index) => ({
      id: `heat-${index + 1}`,
      title: `TOP${index + 1} 热力图`,
      url: item.gallery_image_base64 || '',
    }))

  const activeSlides = isHeatmapMode ? heatmapSlides : dbSlides
  const carouselTotal = Math.max(activeSlides.length, 1)

  const displayImageSrc = uploadedImage
  const displayLabel = '上传图像'

  const handleOpenFailedPopup = (event) => {
    event.preventDefault()
    setShowFailedPopup(true)
  }

  const handleCloseFailedPopup = () => {
    setShowFailedPopup(false)
  }

  const handleMaskClick = () => {
    message.info('请点击弹窗中的“取消”按钮关闭')
  }

  const handleToggleHeatmap = () => {
    const hasAnyHeatmap = heatmapMapSlides.length > 0

    if (!hasAnyHeatmap) {
      message.info('1vN 热力图暂未接入，待 ML 实时返回后展示')
      return
    }

    setIsHeatmapMode((prev) => !prev)
  }

  useEffect(() => {
    if (currentMatchIndex >= activeSlides.length) {
      setCurrentMatchIndex(0)
    }
  }, [activeSlides.length, currentMatchIndex])

  return (
    <div className='relative w-2/3 h-screen justify-self-end flex justify-between items-center py-15'>
      <div className='h-full flex flex-col justify-between items-center '>
        <div className='justify-self-start flex flex-col gap-5 justify-between items-start'>
          <div className='font-[bold] text-lg text-black text-left not-italic'>
            上传图像：
          </div>
          <PreviewFrame src={displayImageSrc} label={displayLabel} />
        </div>
        <div onClick={handleToggleHeatmap} className='mt-5 w-[118px] h-[41px] border rounded-[5px_5px_5px_5px] border-solid border-[#F7A225] flex justify-center items-center font-normal text-base text-[#F7A225] text-left not-italic cursor-pointer'>
          <div>{isHeatmapMode ? '切换为原图' : '切换为热力图'}</div>
        </div>
        <CarouselPagination
          slides={activeSlides}
          total={carouselTotal}
          currentIndex={currentMatchIndex}
          onIndexChange={setCurrentMatchIndex}
        />
      </div>

      <div className='flex flex-col h-full justify-between items-start gap-8 mr-10'>
        <div className='flex flex-col justify-between items-start gap-12'>
          <div className='flex justify-items-start gap-5'>
            <div className='font-[bold] text-lg text-black text-left not-italic'>
              匹配情况：
            </div>
            <div className='decorateItem font-normal text-lg text-[#4C4C4C] text-left'>
              {isMatchFound ? '匹配成功：已在底库中匹配到该生物' : '匹配失败：未在底库中匹配到该生物'}
            </div>
          </div>
          <div>
            {top5Matches.map((item, index) => (
              <div
                key={`top-${index + 1}`}
                onClick={() => setCurrentMatchIndex(index)}
                className={`flex justify-items-start gap-5 items-center px-2 rounded-md cursor-pointer transition-colors ${
                  currentMatchIndex === index ? 'bg-[#FFF3E2]' : 'hover:bg-[#F7F7F7]'
                }`}
              >
                <div className={`font-normal text-lg leading-[51px] text-center ${currentMatchIndex === index ? 'text-[#F7A225]' : 'text-[#4C4C4C]'}`}>
                  TOP{index + 1} ID：{item.identity_id}
                </div>
                <ProgressBar similarity={item.similarity_percentage} />
              </div>
            ))}
          </div>
        </div>

        {/* 如果匹配失败，多显示一行： */}
        {!isMatchFound && (
          <div className='flex justify-items-start items-center gap-3 -mt-10'>
            <ChevronsRight size={24} color="#AFAFAF" />
            <a href='#' onClick={handleOpenFailedPopup} className='font-normal text-lg text-[#0066CD] leading-[51px] text-left'>
              将该未知个体特征录入 FAISS 底库
            </a>
          </div>
        )}

        <MatchInformationCard
          similarity={selectedMatch?.similarity_percentage}
          category={teamResult?.category}
          identityId={selectedMatch?.identity_id}
          rank={currentMatchIndex + 1}
        />
      </div>
      {showFailedPopup && (
        <>
          <div onClick={handleMaskClick} className='fixed inset-0 bg-black/45 z-40'></div>
          <FailedPopup onClose={handleCloseFailedPopup} />
        </>
      )}
    </div>
  )
}

export default ResultPageContent1vN