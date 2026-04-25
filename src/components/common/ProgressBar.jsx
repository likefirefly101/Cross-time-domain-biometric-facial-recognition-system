import React from 'react'

const colorMap = {
  0: '#E16277', // 红色
  1: '#53A7FC', // 蓝色
}

function ProgressBar(props) {
  if (props.similarity < 0 || props.similarity > 100) {
    console.warn('Similarity should be between 0 and 100');
    return null;
  }

  // 根据相似度选择颜色（可以根据需要调整阈值）
  const chosenColor = props.similarity >= 50 ? colorMap[1] : colorMap[0];

  return (
    <div className='w-105 flex justify-between items-center ml-auto'>
      {/* 这个是总的进度条 */}
      <div className='w-85 h-1.25 bg-gray-300 rounded-full'>
        {/* 这个是相似度占比的进度条 */}
        <div className='h-2.25 transform -translate-y-0.5 rounded-r-full' style={{ width: `${props.similarity}%`, backgroundColor: chosenColor }}></div>
      </div>
      <div className='font-normal text-lg text-[#4C4C4C] leading-[51px] text-center'>
        {props.similarity}%
      </div>
    </div>
  )
}

export default ProgressBar