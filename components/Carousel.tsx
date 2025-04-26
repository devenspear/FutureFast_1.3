import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ResourceCard, { ResourceCardProps } from './ResourceCard';

interface CarouselProps {
  cards: Array<ResourceCardProps>;
}

const scrollAmount = 300;

const Carousel: React.FC<CarouselProps> = ({ cards }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-full min-h-[440px] md:min-h-[470px] lg:min-h-[500px] xl:min-h-[520px]">
      <button
        aria-label="Scroll left"
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-gray-900 text-blue-200 shadow-md rounded-full p-3 hover:bg-blue-700 hover:text-white transition border border-blue-700"
        style={{ opacity: 0.7, transform: 'translateY(-50%) scale(1.3)' }}
        onClick={() => scroll('left')}
      >
        <FaChevronLeft size={20} />
      </button>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 py-4 px-2 scrollbar-hide scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        {cards.map((card, idx) => (
          <div
            key={card.title || idx}
            className="flex-shrink-0 w-64 h-[420px] md:w-72 md:h-[450px] lg:w-80 lg:h-[480px] xl:w-80 xl:h-[500px]"
          >
            <ResourceCard {...card} />
          </div>
        ))}
      </div>
      <button
        aria-label="Scroll right"
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-gray-900 text-blue-200 shadow-md rounded-full p-3 hover:bg-blue-700 hover:text-white transition border border-blue-700"
        style={{ opacity: 0.7, transform: 'translateY(-50%) scale(1.3)' }}
        onClick={() => scroll('right')}
      >
        <FaChevronRight size={20} />
      </button>
    </div>
  );
};

export default Carousel;
