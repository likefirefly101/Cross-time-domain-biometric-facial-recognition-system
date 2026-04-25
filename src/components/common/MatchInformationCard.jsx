import React from 'react'

function MatchInformationCard(props) {
    const similarityText = typeof props.similarity === 'number' ? props.similarity.toFixed(2) : '0.00'
    const categoryText = props.category || '--'
    const identityIdText = props.identityId || '--'
  const rankText = Number.isInteger(props.rank) ? props.rank : 1

    return (
                <div className='flex flex-col justify-between items-start gap-5 justify-self-start mb-20'>
          <div className='font-[bold] text-lg text-black text-left not-italic'>
            匹配信息：
          </div>
          <div className='flex flex-col justify-between items-start'>
            <div className='font-normal text-lg text-[#707070] leading-[50px] text-left'>
              相似度信息：TOP{rankText}-{similarityText}%
            </div>
            <div className='font-normal text-lg text-[#707070] leading-[50px] text-left'>
              物种类别：{categoryText}
            </div>
            <div className='font-normal text-lg text-[#707070] leading-[50px] text-left'>
              编号ID：{identityIdText}
            </div>
            <div className='font-normal text-lg text-[#707070] leading-[50px] text-left'>
              性别：雄性（Male）
            </div>
            <div className='font-normal text-lg text-[#707070] leading-[50px] text-left'>
              {/* 已知年龄：{Math.floor(Math.random() * 3) + 1} 岁 */}
              已知年龄段：0-10 岁
            </div>
          </div>
        </div>
    )
}

export default MatchInformationCard