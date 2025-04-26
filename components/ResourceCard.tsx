import React from "react";
import Image from 'next/image';

export interface ResourceCardProps {
  id: string;
  title: string;
  author?: string;
  date?: string;
  description?: string;
  image: string;
  overlayText?: string;
  duration?: string;
  platform?: string;
  url?: string;
}

const CARD_HEIGHT = 420; // 30% less than previous

const GRADIENT_PLACEHOLDER = '/images/gradient-placeholder.svg';

const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  author,
  date,
  description,
  image,
  overlayText,
  duration,
  platform,
  url,
}) => {
  // Use gradient placeholder if image is missing or blank
  const imgSrc = image && typeof image === 'string' && image.trim() !== '' ? image : GRADIENT_PLACEHOLDER;

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 hover:shadow-lg hover:ring-2 hover:ring-blue-300 transition-transform duration-200 ease-in-out group cursor-pointer relative animate-card-glow flex flex-col justify-between h-[420px] md:h-[450px] lg:h-[480px] xl:h-[500px]"
      style={{ minHeight: 320, maxHeight: 520 }}
    >
      <div>
        <div className="relative h-36 w-full rounded-t-xl overflow-hidden">
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="object-cover rounded-t-xl"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="p-3">
          {/* Tag as text, not ribbon */}
          {overlayText && (
            <span className="inline-block text-xs font-semibold text-blue-700 mb-1">Tag: {overlayText}</span>
          )}
          {/* Bold, dark title */}
          <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
          {author && <p className="text-xs text-gray-500 mb-1">By: {author}</p>}
          {date && <p className="text-xs text-gray-400 mb-1">{date}</p>}
          {/* Expanded description */}
          {description && (
            <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{description}</p>
          )}
          {platform && (
            <span className="inline-block mt-2 text-xs text-blue-700 font-bold">
              {platform}
            </span>
          )}
        </div>
      </div>
      {/* Simple hyperlink instead of button */}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block m-3 mt-auto text-blue-700 underline text-center font-semibold hover:text-blue-900 transition"
        >
          See Source
        </a>
      )}
    </div>
  );
};

export default ResourceCard;
