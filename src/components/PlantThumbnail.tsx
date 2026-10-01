import React, { useState } from 'react';

interface PlantThumbnailProps {
  src?: string;
  alt: string;
  fallbackText?: string;
  fallbackColor?: string;
  className?: string;
  roundedClassName?: string;
  targetSize?: number;
  priority?: 'high' | 'low' | 'auto';
}

// Only Unsplash URLs get resized; local assets are pre-sized and Wikimedia rejects unknown params.
function getOptimizedImageUrl(url: string, targetSize: number): string {
  if (url.includes('images.unsplash.com')) {
    if (url.includes('w=')) {
      return url.replace(/w=\d+/, `w=${targetSize}&q=75&auto=format`);
    } else {
      const sep = url.includes('?') ? '&' : '?';
      return `${url}${sep}w=${targetSize}&q=75&auto=format`;
    }
  }

  return url;
}

export const PlantThumbnail: React.FC<PlantThumbnailProps> = ({
  src,
  alt,
  fallbackText,
  fallbackColor = '#15803d',
  className = 'w-10 h-10',
  roundedClassName = 'rounded-xl',
  targetSize = 160,
  priority = 'auto',
}) => {
  // Keyed by src so a reused instance (e.g. the selected-tree preview) resets when the image changes.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const hasError = !!src && failedSrc === src;
  const isLoaded = !!src && loadedSrc === src;

  const initials = fallbackText
    ? fallbackText.substring(0, 2).toUpperCase()
    : alt.substring(0, 2).toUpperCase();

  if (!src || hasError) {
    return (
      <div
        className={`${className} ${roundedClassName} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-xs select-none`}
        style={{ backgroundColor: fallbackColor }}
        title={alt}
      >
        {initials}
      </div>
    );
  }

  const optimizedSrc = getOptimizedImageUrl(src, targetSize);
  const optimized2x = getOptimizedImageUrl(src, targetSize * 2);
  const isHighPriority = priority === 'high';

  return (
    <div className={`relative ${className} ${roundedClassName} overflow-hidden flex-shrink-0 bg-stone-100 shadow-xs`}>
      {!isLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold animate-pulse"
          style={{ backgroundColor: fallbackColor }}
        >
          {initials}
        </div>
      )}
      <img
        src={optimizedSrc}
        srcSet={optimized2x !== optimizedSrc ? `${optimizedSrc} 1x, ${optimized2x} 2x` : undefined}
        alt={alt}
        loading={isHighPriority ? 'eager' : 'lazy'}
        fetchPriority={isHighPriority ? 'high' : priority === 'low' ? 'low' : undefined}
        decoding={isHighPriority ? 'sync' : 'async'}
        onLoad={() => setLoadedSrc(src)}
        onError={() => setFailedSrc(src)}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
