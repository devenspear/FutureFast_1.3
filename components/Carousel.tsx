import React, { useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ResourceCard, { ResourceCardProps } from './ResourceCard';

interface CarouselProps {
  cards: Array<ResourceCardProps>;
}

const scrollAmount = 320; // Match YouTube section scroll amount
const SCROLL_DURATION = 1000; // 1 second for smooth scrolling

// Glow animation styles
const glowAnimation = `
@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3), 0 0 15px rgba(59, 130, 246, 0.2);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.4);
    transform: scale(1.05);
  }
}
`;

const Carousel: React.FC<CarouselProps> = ({ cards }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add the keyframes to the document
    if (typeof document !== 'undefined' && !document.getElementById('carousel-glow-animation')) {
      const style = document.createElement('style');
      style.id = 'carousel-glow-animation';
      style.textContent = glowAnimation;
      document.head.appendChild(style);
    }
  }, []);

  const smoothScroll = (element: HTMLElement, target: number, duration: number) => {
    const start = element.scrollLeft;
    const distance = target - start;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Ease in/out function
      const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      
      element.scrollLeft = start + distance * easeInOutQuad(progress);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      const target = scrollRef.current.scrollLeft - scrollAmount;
      smoothScroll(scrollRef.current, target, SCROLL_DURATION);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const target = scrollRef.current.scrollLeft + scrollAmount;
      smoothScroll(scrollRef.current, target, SCROLL_DURATION);
    }
  };

  return (
    <div className="relative">
      {/* Navigation Buttons - matching YouTube section style exactly */}
      <button
        onClick={scrollLeft}
        className="absolute left-2 md:left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 text-white p-2 md:p-3 rounded-full shadow-lg transition-all duration-200 touch-manipulation"
        style={{
          animation: 'glow-pulse 3s ease-in-out infinite',
          // iOS/Android touch optimizations
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          // Ensure minimum touch target size (44px iOS, 48px Android)
          minWidth: '44px',
          minHeight: '44px',
          // Hardware acceleration
          willChange: 'transform, box-shadow',
          WebkitTransform: 'translate3d(0, 0, 0)',
          transform: 'translate3d(0, 0, 0)'
        }}
        aria-label="Scroll left"
        type="button"
      >
        <FaChevronLeft className="text-sm md:text-base" />
      </button>
      
      <button
        onClick={scrollRight}
        className="absolute right-2 md:right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 text-white p-2 md:p-3 rounded-full shadow-lg transition-all duration-200 touch-manipulation"
        style={{ 
          animation: 'glow-pulse 3s ease-in-out infinite 1.5s',
          // iOS/Android touch optimizations
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          // Ensure minimum touch target size (44px iOS, 48px Android)
          minWidth: '44px',
          minHeight: '44px',
          // Hardware acceleration
          willChange: 'transform, box-shadow',
          WebkitTransform: 'translate3d(0, 0, 0)',
          transform: 'translate3d(0, 0, 0)'
        }}
        aria-label="Scroll right"
        type="button"
      >
        <FaChevronRight className="text-sm md:text-base" />
      </button>
      
      {/* Cards Container - matching YouTube section layout */}
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden scrollbar-hide px-4 md:px-12 scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          // iOS specific fixes
          WebkitTransform: 'translate3d(0, 0, 0)',
          transform: 'translate3d(0, 0, 0)',
          // Android specific fixes
          overscrollBehaviorX: 'contain',
          // Prevent bounce on iOS
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden'
        }}
      >
        {cards.map((card, idx) => (
          <ResourceCard key={card.id || idx} {...card} />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
