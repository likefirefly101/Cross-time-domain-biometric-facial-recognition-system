import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CarouselPagination = ({
  slides = [],
  total,
  currentIndex: controlledIndex,
  onIndexChange,
}) => {
  const [innerIndex, setInnerIndex] = useState(0);
  const resolvedSlides = slides.length > 0
    ? slides
    : [{ id: 1, title: 'Empty', url: '' }];
  const resolvedTotal = Math.max(total || resolvedSlides.length, 1);
  const currentIndex = typeof controlledIndex === 'number' ? controlledIndex : innerIndex;

  const setCurrentIndex = (updater) => {
    const nextValue = typeof updater === 'function' ? updater(currentIndex) : updater;
    if (typeof controlledIndex !== 'number') {
      setInnerIndex(nextValue);
    }
    onIndexChange?.(nextValue);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? resolvedTotal - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === resolvedTotal - 1 ? 0 : prev + 1));
  };

  return (
    <div className='justify-self-start flex flex-col gap-5 justify-between items-start mb-10'>
      <div className='font-[bold] text-lg text-black text-left not-italic'>
        数据库匹配图：
      </div>

      <div className="relative overflow-hidden w-57 h-57 border-2 border-blue-200 aspect-square bg-gray-100">
        <div 
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {resolvedSlides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full">
              {slide.url ? (
                <img
                  src={slide.url}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-[#AFAFAF]">
                  暂无图片
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 select-none">

        <button
          onClick={handlePrev}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors active:scale-90"
          aria-label="Previous slide"
        >
          <ChevronLeft />
        </button>

        <div className="flex items-center">
          {[...Array(resolvedTotal)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="group relative py-4 px-1 focus:outline-none"
            >
              <div
                className={`
                h-1.5 rounded-full transition-all duration-300
                ${currentIndex === i
                    ? "w-8 bg-gradient-to-r from-[#E94E65] to-[#8E7AB5] shadow-sm"
                    : "w-2 bg-gray-300 group-hover:bg-gray-400"
                  }
              `}
              />

              {/* 可选：增加一个对齐反馈的微弱提示（如需要） */}
              {currentIndex === i && (
                <span className="absolute inset-0 rounded-lg pointer-events-none" />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors active:scale-90"
          aria-label="Next slide"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
      );
};

      export default CarouselPagination;