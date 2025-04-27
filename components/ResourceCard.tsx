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

  return (
    <div
      className="rounded-xl shadow-md overflow-hidden hover:scale-105 hover:shadow-lg hover:ring-2 hover:ring-blue-300 transition-transform duration-200 ease-in-out group cursor-pointer relative animate-card-glow flex flex-col h-full bg-gradient-to-br from-white via-white to-purple-100/90"
      style={{ minHeight: 320, maxHeight: 520 }}
    >
      <div className="flex flex-col h-full">
        <div className="relative h-36 w-full rounded-t-xl overflow-hidden">
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="object-cover rounded-t-xl"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="p-3 flex flex-col flex-1 min-h-0">
          {/* Tag and Type side by side */}
          {(overlayText || platform) && (
            <div className="flex flex-row items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
              {overlayText && <span>{overlayText}</span>}
              {overlayText && platform && <span className="mx-1">|</span>}
              {platform && <span>{platform}</span>}
            </div>
          )}
          {/* Bold, dark title - Reduced font size from text-lg to text-base with custom styling */}
          <h3 className="font-bold text-base text-gray-900 mb-1 line-clamp-2" style={{ fontSize: '14px' }}>{title}</h3>
          {author && <p className="text-xs text-gray-500 mb-1">By: {author}</p>}
          {/* Month and Year side by side */}
          {date && <p className="text-xs text-gray-400 mb-1">{date}</p>}
          {/* Description with expanded height to show more text - removed gradient fade */}
          {description && (
            <div className="mt-1 mb-3">
              <p className="text-sm text-gray-700" style={{ lineHeight: '1.5' }}>{description}</p>
            </div>
          )}
          {/* Bottom info: See Source always pinned with direct styling */}
          <div className="mt-auto">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => url && trackResourceClick(title, url)}
                className="inline-block w-full py-3 px-6 rounded-lg font-medium text-white text-center transition-all duration-200 bg-gradient-to-r from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800 shadow-lg"
              >
                See Source Here
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
