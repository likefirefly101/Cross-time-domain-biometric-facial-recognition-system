import React from 'react'
import infoBanner from '../../assets/information_slices/ZONG.webp'
import loadingIcon from '../../assets/information_slices/@2x/_loading@2x.png'
import sectionTwoImage from '../../assets/information_slices/2.webp'
import sectionThreeImage from '../../assets/information_slices/3.webp'
import layerImage from '../../assets/information_slices/_layer2.webp'


function InformationPageContent() {
    return (
        <div className='w-full flex flex-col justify-center items-center gap-16 p-10 '>
            <div className='flex flex-col justify-center items-start gap-7'>
                <div className='w-28 font-extrabold text-[28px] text-black text-left float-left font-family: Microsoft YaHei, Microsoft YaHei'>技术简介</div>
                <img src={infoBanner} alt="" className='w-full h-auto' />
                <div className='w-full flex flex-col justify-between items-start'>
                    <div className='flex justify-between items-center gap-10'>
                        <img src={loadingIcon} alt="" />
                        <div className='w-20 font-normal text-xl text-[#4C4C4C] leading-10 text-left'>总体介绍</div>
                    </div>
                    <div className='w-full font-normal text-base text-[#4C4C4C] leading-10 text-left mt-3'>
                        生物的面部特征会随着成长、衰老及环境影响发生自然变化，导致传统识别算法失效。无论是对野外生物进行长达数年的生态追踪，还是在茫茫人海中助力失踪人口的长跨度 查找，突破时间域泛化能力不足的痛点已成为行业刚需。为此，我们研发了这款跨时间域生物面部识别系统。
                        <br />
                        我们的模型不仅在时间跨度大于三年的复杂非人类生物数据集上表现卓越，更在标准人脸公开数据集的迁移验证中展现出强大的泛化能力。系统拒绝传统算法的简单拟合，创 新性地提出了双重解耦策略，将面部特征中的身份信息与时间信息进行彻底剥离。
                    </div>
                </div>
            </div>
            <div className='w-full flex flex-col justify-between gap-20 mb-10'>
                <div className='w-full flex justify-between items-center gap-18'>
                    <img src={sectionTwoImage} alt="" className='w-1/2' />
                    <div className='flex flex-col justify-between items-start gap-5'>
                        <div className='flex justify-start items-center gap-10 w-full'>
                            <img src={loadingIcon} alt="" />
                            <div className=' font-normal text-xl text-[#4C4C4C] leading-10 text-left'>
                                第一重：基于注意力掩码的非线性解耦
                            </div>
                        </div>
                        <div className=' font-normal text-base text-[#4C4C4C] leading-10 text-left'>
                            模型以FE-Net50提取初始混合特征，并引入高效卷积块注意力模块。通过并行的通道与空间注意力机制生成高精度掩码，提取出身份特征；随后利用多层 感知机进行非线性映射，从混合特征中显性减去时间干扰，精准剥离出年龄特征。
                        </div>
                    </div>
                </div>
                <div className='w-full flex justify-between items-center gap-18'>
                    <div className='flex flex-col justify-between items-start gap-5'>
                        <div className='flex justify-start items-center gap-10 w-200'>
                            <img src={loadingIcon} alt="" />
                            <div className=' font-normal text-xl text-[#4C4C4C] leading-10 text-left'>
                                第二重：基于梯度反转层的对抗隐形解耦
                            </div>
                        </div>
                        <div className='w-full font-normal text-base text-[#4C4C4C] leading-10 text-left'>
                            在多任务联合训练框架下，我们将身份特征强制送入带有梯度反转层的年龄预 测器。反向传播时，梯度反转层会将梯度取负，迫使前端特征提取器在迭代中 拼命擦除身份特征里的年龄痕迹。通过这种左右互搏的对抗学习，模型最终提 炼出不受岁月干扰的绝对纯净特征。
                        </div>
                    </div>
                    <img src={sectionThreeImage} alt="" className='w-1/2' />
                </div>
                <div className='w-full flex justify-center items-center gap-28'>
                    <img src={layerImage} alt="" />
                    <div className='flex flex-col justify-between items-start gap-5'>
                        <div className='flex justify-start items-center gap-10'>
                            <img src={loadingIcon} alt="" />
                            <div className=' font-normal text-xl text-[#4C4C4C] leading-10 text-left'>
                                优势与创新特色
                            </div>
                        </div>
                        <div className='w-180 font-normal text-base text-[#4C4C4C] leading-10 text-left'>
                            首个跨时间域生物面部特征智能识别与溯源系统
                            <br />
                            <br />
                            构造了包含人类与非人类生物（山魈）的长周期多模态跨时域数据集
                            <br />
                            设计了在年龄上严格互斥的训练、测试集 
                            <br />
                            提出了基于FAISS的特征向量库构建，库中数据无法被复原成图像，避免隐私泄露
                            <br />
                            <br />
                            提出非线性与对抗双重解耦算法，针对特征漂移任务能“抽离”出纯净身份向量 跨物种、跨年龄段的长周期（≥3年）识别泛化性能达到本领域SOTA水平
                            <br />
                            <br />
                            设计、实现了一套快捷轻量化的WEB检测应用并进行了鲁棒性测试
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default InformationPageContent