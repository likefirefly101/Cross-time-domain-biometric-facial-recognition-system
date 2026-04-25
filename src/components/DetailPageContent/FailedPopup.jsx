import React, { useState } from 'react'
import { Select, Input, message } from 'antd'
import { createStaticStyles } from 'antd-style';

const classNames = createStaticStyles(({ css }) => ({
  root: css`
    border-radius: 2px;
    width: 270px;
    height: 36px;
    border: 1px solid #D3D3D3;
    font-weight: 400;
    font-size: 14px;
    color: #AFAFAF;
    line-height: 50px;
    text-align: left;
  `,
}));


function FailedPopup(props) {
  const generateMockId = (currentSpecies) => {
    if (currentSpecies === '人类') {
      return String(9000 + Math.floor(Math.random() * 900))
    }
    return String(2000 + Math.floor(Math.random() * 900))
  }

  const [species, setSpecies] = useState('山魈')
  const [gender, setGender] = useState('男/雄性')
  const [estimatedAge, setEstimatedAge] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [assignedId, setAssignedId] = useState(() => generateMockId('山魈'))

  const handleSpeciesChange = (value) => {
    setSpecies(value)
    setAssignedId(generateMockId(value))
  }

  const handleConfirm = () => {
    if (!species) {
      message.warning('请选择物种类别')
      return
    }

    if (!gender) {
      message.warning('请选择性别')
      return
    }

    const ageText = estimatedAge.trim()
    if (ageText && !/^[0-9]+(\.[0-9]+)?$/.test(ageText)) {
      message.warning('预估年龄请输入数字')
      return
    }

    setIsSubmitting(true)
    message.loading({
      content: '正在入库，请稍候...',
      key: 'fake_insert',
      duration: 0,
    })

    setTimeout(() => {
      message.success({
        content: '入库成功',
        key: 'fake_insert',
        duration: 2,
      })
      setIsSubmitting(false)
      props.onClose?.()
    }, 1200)
  }

  return (
    <div className=' fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 w-160 h-100 bg-white shadow-[0px_3px_10px_1px_rgba(0,0,0,0.16)] border rounded-[1px_1px_1px_1px] border-solid border-[#D3D3D3] flex flex-col justify-center gap-5 p-6'>
      <div className='items-start font-[bold] text-lg text-black text-left'>
        未知个体特征录入
      </div>
      <div className='flex flex-col justify-between items-center gap-5'>
        <div className='flex justify-between items-center gap-3'>
          <div className='font-normal text-lg text-[#707070] leading-[50px] text-left'>物种类别：</div>
          <Select
            value={species}
            onChange={handleSpeciesChange}
            classNames={classNames}
            options={[
              { value: '人类', label: '人类' },
              { value: '山魈', label: '山魈' },
            ]}
          />
        </div>

        <div className='flex justify-between items-center gap-3'>
          <div className='font-normal text-lg text-[#707070] leading-[50px] text-left'>分配ID：</div>
          <div className='w-63 font-normal text-sm text-[#AFAFAF] leading-[50px] text-left'>
            {assignedId}
          </div>
        </div>

        <div className='flex justify-between items-center gap-3 ml-10'>
          <div className='font-normal text-lg text-[#707070] leading-[50px] text-left'>性别：</div>
          <Select
            value={gender}
            onChange={setGender}
            classNames={classNames}
            options={[
              { value: '男/雄性', label: '男/雄性' },
              { value: '女/雌性', label: '女/雌性' },
            ]}
          />
        </div>

        <div className='flex justify-between items-center gap-3'>
          <div className='font-normal text-lg text-[#707070] leading-[50px] text-left'>预估年龄：</div>
          <Input
            placeholder="(选填)"
            value={estimatedAge}
            onChange={(event) => setEstimatedAge(event.target.value)}
            classNames={classNames}
          />
        </div>
      </div>
      <div className='w-full flex justify-end items-end gap-5'>
        <div onClick={props.onClose} className={`w-[104px] h-[36px] border rounded-[5px_5px_5px_5px] border-solid border-[#949494] flex justify-center items-center font-medium text-sm text-[#949494] text-left not-italic ${isSubmitting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
          取消
        </div>
        <div onClick={isSubmitting ? undefined : handleConfirm} className={`w-[104px] h-[36px] border rounded-[5px_5px_5px_5px] border-solid border-[#0066CD] flex justify-center items-center font-medium text-sm text-[#0066CD] text-left not-italic ${isSubmitting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
          确认入库
        </div>
      </div>
    </div>
  )
}

export default FailedPopup