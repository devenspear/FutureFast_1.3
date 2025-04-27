import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ResourceCard, { ResourceCardProps } from './ResourceCard';

interface CarouselProps {
  cards: Array<ResourceCardProps>;
}

const scrollAmount = 300;

// Define keyframes for the pulse animation
const pulseAnimation = `
@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.7);
    transform: translateY(-50%) scale(1.3);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(147, 51, 234, 0);
    transform: translateY(-50%) scale(1.4);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(147, 51, 234, 0);
    transform: translateY(-50%) scale(1.3);
  }
}
`;

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
      {/* Add the keyframes animation to the head */}
      <style>{pulseAnimation}</style>
      
      <button
        aria-label="Scroll left"
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-gray-900/70 text-blue-200 shadow-md rounded-full p-4 hover:bg-purple-700 hover:text-white transition border border-purple-500"
        style={{ 
          opacity: 0.85, 
          animation: 'pulse-animation 2s infinite',
          transform: 'translateY(-50%) scale(1.3)',
          left: '-30px' // Position mostly outside with ~20% overlap
        }}
        onClick={() => scroll('left')}
      >
        <FaChevronLeft size={24} />
      </button>
      
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 py-4 px-8 scrollbar-hide scroll-smooth"
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
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-gray-900/70 text-blue-200 shadow-md rounded-full p-4 hover:bg-purple-700 hover:text-white transition border border-purple-500"
        style={{ 
          opacity: 0.85, 
          animation: 'pulse-animation 2s infinite',
          transform: 'translateY(-50%) scale(1.3)',
          right: '-30px' // Position mostly outside with ~20% overlap
        }}
        onClick={() => scroll('right')}
      >
        <FaChevronRight size={24} />
      </button>
    </div>
  );
};

export default Carousel;
