import React from 'react';
import { ExternalLink, Search } from 'lucide-react';

interface GoogleImagesButtonProps {
  query: string;
  label?: string;
  iconOnly?: boolean;
  className?: string;
  title?: string;
}

export const GoogleImagesButton: React.FC<GoogleImagesButtonProps> = ({
  query,
  label = 'Google Images',
  iconOnly = false,
  className = '',
  title = 'Search on Google Images',
}) => {
  const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
  const accessibleLabel = label ? `${label}: ${query}` : `Google Images: ${query}`;

  return (
    <a
      href={googleImagesUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      title={title}
      aria-label={accessibleLabel}
      className={`inline-flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer select-none ${
        iconOnly
          ? 'p-1 rounded-md text-stone-500 hover:text-blue-600 hover:bg-blue-50'
          : 'px-2 py-1 rounded-lg bg-stone-100 hover:bg-blue-50 text-stone-600 hover:text-blue-700 border border-stone-200 hover:border-blue-200'
      } ${className}`}
    >
      <Search className="w-3 h-3 text-blue-500" />
      {!iconOnly && <span>{label}</span>}
      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
    </a>
  );
};
