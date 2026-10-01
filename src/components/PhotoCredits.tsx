import React, { useEffect } from 'react';
import { Camera } from 'lucide-react';
import { Language, getLoc } from '../types/guild';
import { t } from '../i18n/translations';
import { STAR_TREES } from '../data/starTrees';
import { ACTIVE_GUILD_PLANTS, GUILD_PLANTS } from '../data/guildPlants';
import { IMAGE_CREDITS, ImageCredit, getImageCredit } from '../data/imageCredits';
import { creditAnchorId, soilCreditAnchorId } from './PhotoCreditBadge';

interface PhotoCreditsProps {
  language: Language;
}

type Tr = ReturnType<typeof t>;

interface CreditRow {
  key: string;
  /** Stable anchor id so photo badges can deep-link to /credits#<anchor> */
  anchor: string;
  name: string;
  latin?: string;
  credit: ImageCredit;
}

const SOIL_LABELS: Record<string, keyof Tr> = {
  '/images/soils/soil-loam.webp': 'soilLoam',
  '/images/soils/soil-clay.webp': 'soilClay',
  '/images/soils/soil-sandy.webp': 'soilSandy',
  '/images/soils/soil-chalky.webp': 'soilChalky',
  '/images/soils/soil-acidic.webp': 'soilAcidic',
  '/images/soils/soil-silt.webp': 'soilSilt',
};

/** "/images/soils/soil-loam.webp" -> "loam" */
const soilIdFromPath = (path: string) => (path.split('/').pop() ?? path).replace(/\.[^.]+$/, '').replace(/^soil-/, '');
const fileAnchorPart = (path: string) => (path.split('/').pop() ?? path).replace(/\.[^.]+$/, '').replace(/[^A-Za-z0-9_-]/g, '-');

const HIGHLIGHT = ['ring-2', 'ring-forest-500', 'ring-inset', 'bg-forest-50'];

const linkClass = 'text-forest-700 hover:text-forest-900 underline underline-offset-2';

export const LicenseLink: React.FC<{ credit: ImageCredit; className?: string }> = ({ credit, className = linkClass }) =>
  credit.licenseUrl ? (
    <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer license" className={className}>
      {credit.license}
    </a>
  ) : (
    <>{credit.license}</>
  );

const CreditList: React.FC<{ title: string; rows: CreditRow[]; tr: Tr }> = ({ title, rows, tr }) => {
  if (rows.length === 0) return null;
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider">
        {title} <span className="font-medium text-stone-400">({rows.length})</span>
      </h2>
      <ul className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
        {rows.map(({ key, anchor, name, latin, credit }) => (
          <li
            key={key}
            id={anchor}
            className="px-4 py-2.5 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-baseline sm:gap-4 scroll-mt-24 transition-all first:rounded-t-2xl last:rounded-b-2xl"
          >
            <div className="sm:w-1/3 shrink-0 font-semibold text-stone-900">
              {name}
              {latin && <span className="block text-xs font-normal italic text-stone-500">{latin}</span>}
            </div>
            <div className="text-stone-600 leading-relaxed min-w-0 break-words">
              {tr.photoCreditPhoto}: {credit.author} · <LicenseLink credit={credit} /> ·{' '}
              {tr.photoCreditsSourceLink}:{' '}
              <a href={credit.sourceUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {credit.sourceName}
              </a>
              <span className="block text-[11px] text-stone-400 truncate" title={credit.title}>
                {credit.title}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export const PhotoCredits: React.FC<PhotoCreditsProps> = ({ language }) => {
  const tr = t(language);

  // Deep links from photo badges (/credits#credit-<id>): scroll the row into view and highlight it briefly.
  useEffect(() => {
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)); };

    const handleUrlChange = () => {
      if (!window.location.pathname.startsWith('/credits')) return;
      const hash = decodeURIComponent(window.location.hash.replace('#', ''));
      if (!hash) return;
      const tryScroll = (attempts: number) => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add(...HIGHLIGHT);
          later(() => el.classList.remove(...HIGHLIGHT), 3500);
        } else if (attempts > 0) {
          later(() => tryScroll(attempts - 1), 100);
        }
      };
      later(() => tryScroll(5), 100);
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      timers.forEach(id => window.clearTimeout(id));
    };
  }, []);

  const byName = (a: CreditRow, b: CreditRow) => a.name.localeCompare(b.name, language);
  const seen = new Set<string>();

  const plantRows = (items: { id: string; imageUrl: string; commonName: Parameters<typeof getLoc>[0]; botanicalName: string }[]) =>
    items
      .flatMap((p): CreditRow[] => {
        const credit = getImageCredit(p.imageUrl);
        if (!credit) return [];
        seen.add(p.imageUrl.split(/[?#]/)[0]);
        return [{ key: p.id, anchor: creditAnchorId(p.id), name: getLoc(p.commonName, language), latin: p.botanicalName, credit }];
      })
      .sort(byName);

  const starRows = plantRows(STAR_TREES);
  const companionRows = plantRows(ACTIVE_GUILD_PLANTS);
  // Retired companions are no longer offered, but older saved guilds may still show their photos.
  const retiredRows = plantRows(GUILD_PLANTS.filter(p => p.retired));
  const soilRows: CreditRow[] = Object.entries(SOIL_LABELS).flatMap(([path, label]) => {
    const credit = IMAGE_CREDITS[path];
    if (!credit) return [];
    seen.add(path);
    return [{ key: path, anchor: soilCreditAnchorId(soilIdFromPath(path)), name: String(tr[label]), credit }];
  });
  // Credited files no longer referenced by the catalog still get listed rather than silently dropped.
  const otherRows: CreditRow[] = [...retiredRows, ...Object.entries(IMAGE_CREDITS)
    .filter(([path]) => !seen.has(path))
    .map(([path, credit]) => ({ key: path, anchor: `credit-file-${fileAnchorPart(path)}`, name: path.split('/').pop() ?? path, credit }))];

  return (
    <div className="flex-1 w-full bg-stone-50 text-stone-900 font-sans py-4 sm:py-6">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 w-full space-y-6">
        <div className="border-b border-stone-200 pb-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-50 border border-forest-200 text-forest-800 text-xs font-semibold mb-3">
            <Camera className="w-3.5 h-3.5 text-forest-600" />
            <span>{[...new Set(Object.values(IMAGE_CREDITS).map(c => c.sourceName))].join(' · ')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">{tr.photoCreditsTitle}</h1>
          <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-3xl leading-relaxed">{tr.photoCreditsIntro}</p>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-3xl leading-relaxed">{tr.photoCreditsModifiedNote}</p>
        </div>

        <CreditList title={tr.photoCreditsGroupStar} rows={starRows} tr={tr} />
        <CreditList title={tr.photoCreditsGroupCompanion} rows={companionRows} tr={tr} />
        <CreditList title={tr.photoCreditsGroupSoil} rows={soilRows} tr={tr} />
        <CreditList title={tr.photoCreditsGroupOther} rows={otherRows} tr={tr} />
      </main>
    </div>
  );
};
