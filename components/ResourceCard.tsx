"use client";

import React from "react";
import Image from 'next/image';
import { trackResourceClick } from '../lib/analytics';

export interface ResourceCardProps {
  id: string;
  title: string;
  author?: string;
  date?: string;
  description?: string;
  image: string;
  overlayText?: string;
  platform?: string;
  url?: string;
}

const GRADIENT_PLACEHOLDER = '/images/gradient-placeholder.svg';

const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  author,
  date,
  description,
  image,
  overlayText,
  platform,
  url,
}) => {
  // Use gradient placeholder if image is missing or blank
  const imgSrc = image && typeof image === 'string' && image.trim() !== '' ? image : GRADIENT_PLACEHOLDER;

  const handleCardClick = () => {
    if (url) {
      trackResourceClick(title, url);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="flex-shrink-0 w-72 md:w-80 h-[380px] md:h-[440px] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 border border-gray-700 hover:border-cyan-400/50 cursor-pointer group"
      onClick={handleCardClick}
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
          handleCardClick();
        }
      }}
    >
      {/* Thumbnail Section */}
      <div className="relative h-36 md:h-44 w-full overflow-hidden">
          <Image
            src={imgSrc}
            alt={title}
            fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 768px) 288px, 320px"
          />
        
        {/* Overlay Text */}
        {overlayText && (
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
            <p className="text-white text-base md:text-lg font-bold text-center px-4">
              {overlayText}
            </p>
            </div>
          )}

        {/* Platform Badge */}
        {platform && (
          <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded">
            {platform}
            </div>
            )}
          </div>

      {/* Content Section */}
      <div className="p-3 md:p-4 space-y-2 md:space-y-3 flex flex-col h-full">
        {/* Category and Author */}
        <div className="flex flex-row items-center gap-1 md:gap-2 text-xs font-semibold text-cyan-400 mb-1">
          {platform && <span className="text-xs">{platform}</span>}
          {platform && author && <span className="mx-1">|</span>}
          {author && <span className="text-xs truncate">By: {author}</span>}
        </div>

        {/* Title */}
        <h3 className="font-bold text-base md:text-lg text-white line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300">
          {title}
        </h3>

        {/* Date */}
        {date && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span className="text-xs">{date}</span>
          </div>
        )}
        
        {/* Description */}
        <p className="text-xs md:text-sm text-gray-300 line-clamp-2 md:line-clamp-3 leading-relaxed flex-grow">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ResourceCard;
