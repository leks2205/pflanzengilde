import React from 'react';
import { Language } from '../types/guild';
import { t } from '../i18n/translations';
import { getImageCredit } from '../data/imageCredits';

/** Anchor id of a plant's row on the /credits page (star and companion plants share the namespace). */
export const creditAnchorId = (plantId: string): string => `credit-${plantId}`;
/** Anchor id of a soil texture row on the /credits page, e.g. "loam" -> "credit-soil-loam". */
export const soilCreditAnchorId = (soilId: string): string => `credit-soil-${soilId}`;

interface PhotoCreditBadgeProps {
  /** imageUrl of the photo; the badge renders nothing when the file has no credit entry. */
  imageUrl: string | undefined;
  /** Full anchor id of the credits row, see creditAnchorId(). */
  anchorId: string;
  language: Language;
  /** App's SPA navigation; without it the badge falls back to pushState + popstate (which App listens to). */
  onNavigate?: (path: string) => void;
  /** Open the credits page in a new tab with a plain link (embeds rendered inside iframes on other sites). */
  external?: boolean;
  /** Positioning classes; the parent must be `relative`. */
  className?: string;
}

/** Tiny "©" footnote marker on a photo that links to the photo's row on the credits page. */
export const PhotoCreditBadge: React.FC<PhotoCreditBadgeProps> = ({
  imageUrl,
  anchorId,
  language,
  onNavigate,
  external = false,
  className = 'bottom-1 right-1',
}) => {
  const credit = getImageCredit(imageUrl);
  if (!credit) return null;

  const tr = t(language);
  const label = tr.photoCreditBadgeLabel.replace('{author}', credit.author).replace('{license}', credit.license);
  const href = `/credits#${anchorId}`;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Never let the click reach a surrounding card/select handler.
    e.stopPropagation();
    if (external) return;
    // Let modified clicks (new tab/window) use the browser default.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (onNavigate) {
      onNavigate(href);
    } else {
      window.history.pushState({}, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      onMouseDown={e => e.stopPropagation()}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      title={label}
      aria-label={label}
      data-photo-credit={anchorId}
      className={`absolute z-20 inline-flex items-center justify-center w-4 h-4 rounded-full bg-black/50 hover:bg-black/80 focus-visible:bg-black/80 text-white text-[10px] font-semibold leading-none no-underline select-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${className}`}
    >
      <span aria-hidden="true">©</span>
    </a>
  );
};
