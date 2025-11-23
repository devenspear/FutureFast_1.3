"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
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

const scrollAmount = 300;

export default function VideoInterviewsSection() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedThumbnails, setFailedThumbnails] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Client-side cache key and duration (5 minutes for development, 30 minutes for production)
  const CACHE_KEY = 'youtube_videos_cache';
  const CACHE_DURATION = process.env.NODE_ENV === 'development' ? 5 * 60 * 1000 : 30 * 60 * 1000; // 5 minutes in dev, 30 minutes in prod

  // Check if cached data is still valid
  const getCachedData = useCallback((): YouTubeVideo[] | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid (within 30 minutes)
      if (now - timestamp < CACHE_DURATION) {
        console.log('Using cached YouTube data');
        return data;
      } else {
        // Cache expired, remove it
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
    } catch (error) {
      console.error('Error reading YouTube cache:', error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }, [CACHE_KEY, CACHE_DURATION]);

  // Save data to cache
  const setCachedData = useCallback((data: YouTubeVideo[]) => {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log('YouTube data cached for 30 minutes');
    } catch (error) {
      console.error('Error caching YouTube data:', error);
    }
  }, [CACHE_KEY]);

  // Sort videos by published date (newest first)
  const sortedVideos = [...videos].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  useEffect(() => {
    // Add pulse animation styles
    const style = document.createElement('style');
    const pulseAnimation = `
      @keyframes glow-pulse {
        0%, 100% { box-shadow: 0 0 5px rgba(34, 211, 238, 0.3); }
        50% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.6), 0 0 30px rgba(34, 211, 238, 0.4); }
      }
    `;
    
    if (!document.querySelector('#glow-pulse-styles')) {
      style.id = 'glow-pulse-styles';
      style.textContent = pulseAnimation;
      document.head.appendChild(style);
    }

    // Fetch videos with caching
    const fetchVideos = async () => {
      try {
        setLoading(true);
        
        // First, try to get cached data
        const cachedVideos = getCachedData();
        if (cachedVideos && cachedVideos.length > 0) {
          setVideos(cachedVideos);
          setLoading(false);
          return;
        }

        // If no valid cache, fetch from API
        console.log('Fetching fresh YouTube data from API');
        const response = await fetch('/api/youtube');
        if (!response.ok) {
          throw new Error(`Failed to fetch videos: ${response.status}`);
        }
        const data = await response.json();
        
        // Cache the fresh data
        setCachedData(data);
        setVideos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [getCachedData, setCachedData]);

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
    try {
      const date = new Date(dateString);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return '';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC' // Force UTC to prevent date shifts
      });
    } catch (err) {
      console.error('Error formatting date:', err, 'Date string:', dateString);
      return '';
    }
  };

  const handleThumbnailError = (videoId: string) => {
    console.log('Thumbnail failed to load for video:', videoId);
    setFailedThumbnails(prev => new Set(prev).add(videoId));
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
        <h1 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
          Video/Interviews
        </h1>
        <p className="font-sans text-lg md:text-xl text-cyan-100 text-center max-w-3xl mx-auto mb-8 md:mb-12">
          See the future. Hear it speak.<br />
          Watch deep dives, visionary interviews, and visual explainers designed to wake up your strategic senses. These aren&apos;t just conversations—they&apos;re transmissions from tomorrow.
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
            className="flex space-x-4 overflow-x-auto pb-6 px-2 scrollbar-hide -mx-4"
            style={{
              transform: 'translate3d(0, 0, 0)',
              // Android specific fixes
              overscrollBehaviorX: 'contain',
              // iOS specific fixes
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              WebkitTransform: 'translate3d(0, 0, 0)',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              // Smooth scrolling
              scrollBehavior: 'smooth'
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
              sortedVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex-shrink-0 w-72 md:w-80 h-[380px] md:h-[440px] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 border border-gray-700 hover:border-cyan-400/50 cursor-pointer group"
                  onClick={() => window.open(`/videos/video-${video.id}`, '_blank')}
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
                      window.open(`/videos/video-${video.id}`, '_blank');
                    }
                  }}
                >
                  {/* Thumbnail Section */}
                  <div className="relative h-36 md:h-44 w-full overflow-hidden bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
                    {failedThumbnails.has(video.id) ? (
                      // Fallback placeholder for failed thumbnails
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
                        <div className="text-center">
                          <FaYoutube className="text-red-500 text-6xl mx-auto mb-2 opacity-50" />
                          <p className="text-gray-400 text-sm">Thumbnail Unavailable</p>
                        </div>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={() => handleThumbnailError(video.id)}
                      />
                    )}

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
                          <span className="text-xs md:text-sm">View Details</span>
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