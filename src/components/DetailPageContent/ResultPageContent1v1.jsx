import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { message } from 'antd'
import vsImage from '../../assets/home_slices/_vs.webp'
import ProgressBar from '../common/ProgressBar'
import Download1v1ReportButton from '../common/Download1v1ReportButton'
import { get1v1HeatmapsByCategory } from '../../utils/heatmap1v1'

function PreviewFrame({ src, alt, label }) {
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
    <div className='w-75 h-75 border-2 border-blue-200 overflow-hidden bg-[#F7F7F7] relative flex items-center justify-center'>
      {src ? (
        <>
          <img
            ref={imageRef}
            src={src}
            alt={alt}
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

function ResultPageContent1v1() {
  const individualResult = useSelector((state) => state.analyze.individualResult)
  const individualUploads = useSelector((state) => state.analyze.individualUploads)
  const [isHeatmapMode, setIsHeatmapMode] = useState(false)
  const similarity = Number(individualResult?.similarity_percentage ?? 0)
  const judgmentMsg = individualResult?.judgment_msg || (individualResult?.is_same_entity ? '同一生物个体' : '非同一生物个体')
  const imageA = individualUploads?.imgB
  const imageB = individualUploads?.imgA
  const category = individualResult?.category
  const heatmaps = get1v1HeatmapsByCategory(category)

  const displayImageA = isHeatmapMode ? (heatmaps?.imgA || imageA) : imageA
  const displayImageB = isHeatmapMode ? (heatmaps?.imgB || imageB) : imageB

  const handleToggleHeatmap = () => {
    if (!isHeatmapMode && !heatmaps) {
      message.warning('当前物种暂未配置1v1热力图，先展示原图')
      return
    }

    setIsHeatmapMode((prev) => !prev)
  }

  return (
    <div className='w-3/5 h-full flex flex-col justify-end pb-20'>
      
      {/* 上半部分：图片比对区域 */}
      <div className='flex justify-between items-center gap-16'>
        <div>
          <PreviewFrame src={displayImageA} alt='比对图像1' label={isHeatmapMode ? '热力图1' : '比对图像1'} />
          <div className='mt-3 mx-auto font-normal text-lg text-[#4C4C4C] leading-[51px] text-center'>比对图像1</div>
        </div>
        <div className='flex flex-col items-center'>
          <img src={vsImage} alt="VS" />
          <div onClick={handleToggleHeatmap} className='mt-10 w-[118px] h-[41px] border rounded-[5px] border-solid border-[#F7A225] flex justify-center items-center font-normal text-base text-[#F7A225] cursor-pointer hover:bg-orange-50 transition-colors'>
            <div>{isHeatmapMode ? '切换为原图' : '切换为热力图'}</div>
          </div>
        </div>
        <div>
          <PreviewFrame src={displayImageB} alt='比对图像2' label={isHeatmapMode ? '热力图2' : '比对图像2'} />
          <div className='mt-3 mx-auto font-normal text-lg text-[#4C4C4C] leading-[51px] text-center'>比对图像2</div>
        </div>
      </div>

      {/* 下半部分：结果判定区域 */}
      {/* 【修改点2】：移除了 justify-self-start，用 mt-12 将上下两部分顶开距离 */}
      <div className='mt-12 flex flex-col gap-5 items-start'>
        <div className='h-21 flex flex-col justify-between items-start w-full'>
          {/* 【修改点3】：font-[bold] 是非标准的，改成了标准的 font-bold */}
          <div className='font-bold text-lg text-black text-left'>
            <span>特征相似度：</span>
          </div>
          <div className='w-50'>
          <ProgressBar similarity={similarity} />
          </div>
        </div>
        <div className='h-25 flex flex-col justify-between items-start'>
          <div className='font-bold text-lg text-black text-left'>
            <span>判定结果：</span>
          </div>
          <div className='font-normal text-lg text-[#4C4C4C] leading-[51px] text-left'>
            <span className='decorateItem'>{judgmentMsg}</span>
          </div>
        </div>
        <Download1v1ReportButton />
      </div>

    </div>
  )
}

export default ResultPageContent1v1