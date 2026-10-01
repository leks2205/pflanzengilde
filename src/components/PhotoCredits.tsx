import React from 'react';
import { Camera } from 'lucide-react';
import { Language, getLoc } from '../types/guild';
import { t } from '../i18n/translations';
import { STAR_TREES } from '../data/starTrees';
import { GUILD_PLANTS } from '../data/guildPlants';
import { IMAGE_CREDITS, ImageCredit, getImageCredit } from '../data/imageCredits';

interface PhotoCreditsProps {
  language: Language;
}

type Tr = ReturnType<typeof t>;

interface CreditRow {
  key: string;
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
        {rows.map(({ key, name, latin, credit }) => (
          <li key={key} className="px-4 py-2.5 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
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
  const byName = (a: CreditRow, b: CreditRow) => a.name.localeCompare(b.name, language);
  const seen = new Set<string>();

  const plantRows = (items: { id: string; imageUrl: string; commonName: Parameters<typeof getLoc>[0]; botanicalName: string }[]) =>
    items
      .flatMap((p): CreditRow[] => {
        const credit = getImageCredit(p.imageUrl);
        if (!credit) return [];
        seen.add(p.imageUrl.split(/[?#]/)[0]);
        return [{ key: p.id, name: getLoc(p.commonName, language), latin: p.botanicalName, credit }];
      })
      .sort(byName);

  const starRows = plantRows(STAR_TREES);
  const companionRows = plantRows(GUILD_PLANTS);
  const soilRows: CreditRow[] = Object.entries(SOIL_LABELS).flatMap(([path, label]) => {
    const credit = IMAGE_CREDITS[path];
    if (!credit) return [];
    seen.add(path);
    return [{ key: path, name: String(tr[label]), credit }];
  });
  // Credited files no longer referenced by the catalog still get listed rather than silently dropped.
  const otherRows: CreditRow[] = Object.entries(IMAGE_CREDITS)
    .filter(([path]) => !seen.has(path))
    .map(([path, credit]) => ({ key: path, name: path.split('/').pop() ?? path, credit }));

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
