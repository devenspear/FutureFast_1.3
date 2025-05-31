"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaPlay, FaCalendarAlt, FaYoutube } from 'react-icons/fa';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
  url: string;
  category?: string;
  featured?: boolean;
}

const scrollAmount = 320;

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

export default function VideoInterviewsSection() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add the keyframes to the document
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = pulseAnimation;
      document.head.appendChild(style);
    }

    // Fetch videos on component mount
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/youtube');
        if (!response.ok) {
          throw new Error(`Failed to fetch videos: ${response.status}`);
        }
        const data = await response.json();
        setVideos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (error) {
    return (
      <section className="py-12 bg-black text-white">
        <div className="container mx-auto px-4">
          <h1 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
            Video/Interviews
          </h1>
          <div className="text-center text-red-400">
            <p>Unable to load videos: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <h1 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
          Video/Interviews
        </h1>
        <p className="font-sans text-lg md:text-xl text-cyan-100 text-center max-w-3xl mx-auto mb-8 md:mb-12">
          Tune into insightful discussions, expert interviews, and visual explainers. Stay updated with the latest trends and deepen your understanding through engaging video content.
        </p>

        <div className="relative">
          {/* Navigation Buttons */}
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

          {/* Video Cards Container */}
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
            {loading ? (
              // Loading skeleton with original dimensions
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-72 md:w-80 h-[380px] md:h-[440px] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl border border-gray-700 shadow-lg overflow-hidden"
                >
                  <div className="w-full h-36 md:h-44 bg-gray-700 animate-pulse relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse"></div>
                  </div>
                  <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                    <div className="h-3 bg-gray-600 rounded animate-pulse w-1/2"></div>
                    <div className="h-4 bg-gray-600 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gray-600 rounded animate-pulse w-1/3"></div>
                    <div className="h-3 bg-gray-600 rounded animate-pulse w-full"></div>
                    <div className="h-3 bg-gray-600 rounded animate-pulse w-2/3"></div>
                    <div className="h-8 md:h-10 bg-gray-600 rounded animate-pulse w-full mt-4"></div>
                  </div>
                </div>
              ))
            ) : (
              videos.map((video) => (
                <div
                  key={video.id}
                  className="flex-shrink-0 w-72 md:w-80 h-[380px] md:h-[440px] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 border border-gray-700 hover:border-cyan-400/50 cursor-pointer group"
                  onClick={() => window.open(video.url, '_blank')}
                  style={{
                    // Mobile touch optimizations
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    // Hardware acceleration
                    willChange: 'transform',
                    WebkitTransform: 'translate3d(0, 0, 0)',
                    transform: 'translate3d(0, 0, 0)',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden'
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      window.open(video.url, '_blank');
                    }
                  }}
                >
                  {/* Thumbnail Section */}
                  <div className="relative h-36 md:h-44 w-full overflow-hidden">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="320px"
                      unoptimized
                    />
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <FaPlay className="text-white text-xl ml-1" />
                      </div>
                    </div>

                    {/* YouTube logo */}
                    <div className="absolute top-3 right-3">
                      <FaYoutube className="text-red-500 text-2xl drop-shadow-lg" />
                    </div>

                    {/* Featured badge */}
                    {video.featured && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded">
                        FEATURED
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-3 md:p-4 space-y-2 md:space-y-3 flex flex-col h-full">
                    {/* Category and Channel */}
                    <div className="flex flex-row items-center gap-1 md:gap-2 text-xs font-semibold text-cyan-400 mb-1">
                      {video.category && <span className="text-xs">{video.category}</span>}
                      {video.category && video.channelTitle && <span className="mx-1">|</span>}
                      {video.channelTitle && (
                        <div className="flex items-center gap-1">
                          <FaYoutube className="text-red-500 text-xs" />
                          <span className="text-xs truncate">{video.channelTitle}</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base md:text-lg text-white line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300">
                      {video.title}
                    </h3>

                    {/* Date */}
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <FaCalendarAlt className="text-cyan-500 text-xs" />
                      <span className="text-xs">{formatDate(video.publishedAt)}</span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-xs md:text-sm text-gray-300 line-clamp-2 md:line-clamp-3 leading-relaxed flex-grow">
                      {video.description}
                    </p>

                    {/* Watch button - mobile responsive */}
                    <div className="mt-auto pt-2">
                      <div className="inline-block w-full py-2 md:py-3 px-4 md:px-6 rounded-lg font-medium text-white text-center transition-all duration-200 bg-gradient-to-r from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800 shadow-lg cursor-pointer text-sm md:text-base">
                        <div className="flex items-center justify-center gap-1 md:gap-2">
                          <FaPlay className="text-xs" />
                          <span className="text-xs md:text-sm">Watch on YouTube</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 