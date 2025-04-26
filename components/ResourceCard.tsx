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
      className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 hover:shadow-lg hover:ring-2 hover:ring-blue-300 transition-transform duration-200 ease-in-out group cursor-pointer relative animate-card-glow flex flex-col h-full"
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
          {/* Bold, dark title */}
          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">{title}</h3>
          {author && <p className="text-xs text-gray-500 mb-1">By: {author}</p>}
          {/* Month and Year side by side */}
          {date && <p className="text-xs text-gray-400 mb-1">{date}</p>}
          {/* Description with expanded height to show more text */}
          {description && (
            <div className="mt-1" style={{ 
              minHeight: '5rem', 
              maxHeight: '14rem', 
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '25px'
            }}>
              <p className="text-sm text-gray-700" style={{ lineHeight: '1.5' }}>{description}</p>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '30px',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))'
              }}></div>
            </div>
          )}
          {/* Bottom info: See Source always pinned with direct styling */}
          <div className="mt-auto">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.5rem 0',
                  borderRadius: '9999px',
                  background: 'linear-gradient(90deg, #06b6d4 0%, #2563eb 100%)',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '1rem',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px 0 rgba(59,130,246,0.10)',
                  minHeight: '2.5rem',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  marginBottom: '15px' 
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)';
                  e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(59,130,246,0.18)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #06b6d4 0%, #2563eb 100%)';
                  e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(59,130,246,0.10)';
                }}
              >
                See Source...
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
