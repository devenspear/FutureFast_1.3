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
        <div className="p-3 flex flex-col h-full">
          {/* Tag and Type side by side */}
          {(overlayText || platform) && (
            <div className="flex flex-row items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
              {overlayText && <span>{overlayText}</span>}
              {overlayText && platform && <span className="mx-1">|</span>}
              {platform && <span>{platform}</span>}
            </div>
          )}
          {/* Bold, dark title */}
          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">{title}</h3>
          {author && <p className="text-xs text-gray-500 mb-1">By: {author}</p>}
          {/* Month and Year side by side */}
          {date && <p className="text-xs text-gray-400 mb-1">{date}</p>}
          {/* Expanded description with ellipsis if too long */}
          {description && (
            <p className="text-sm text-gray-700 mt-1 line-clamp-3">{description}</p>
          )}
          {/* Bottom info: Month Year, Tag|Type, See Source always pinned */}
          <div className="mt-auto pt-2 flex flex-col gap-1">
            {/* Month and Year side by side, if available */}
            {/* (Assume date is formatted as 'Month Year' already, else parse if needed) */}
            {/* Tag and Type already shown above */}
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="see-source-btn block w-full text-center font-semibold transition focus:outline-none"
              >
                See Source
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
