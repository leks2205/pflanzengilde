import React from 'react';
import { GuildPlant, Language, StarTree, getLoc } from '../types/guild';
import { Sprout, ExternalLink, Sparkles } from 'lucide-react';
import { t } from '../i18n/translations';
import { PhotoCreditBadge, creditAnchorId } from './PhotoCreditBadge';

interface GuildEmbedCardProps {
  starTree: StarTree;
  selectedPlants?: GuildPlant[];
  language: Language;
  compact?: boolean;
  showActionBtn?: boolean;
  actionUrl?: string;
  className?: string;
}

export const GuildEmbedCard: React.FC<GuildEmbedCardProps> = ({
  starTree,
  selectedPlants = [],
  language,
  compact = false,
  showActionBtn = true,
  actionUrl,
  className = '',
}) => {
  const tr = t(language);
  const commonName = getLoc(starTree.commonName, language);
  const description = getLoc(starTree.description, language);

  const targetUrl = actionUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://pflanzengilde.de');

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-800 bg-stone-950 text-white shadow-2xl select-none transition-all ${
        compact ? 'p-4 sm:p-5' : 'p-5 sm:p-7 min-h-[320px] sm:min-h-[380px]'
      } flex flex-col justify-between ${className}`}
    >
      <div className="absolute inset-0 z-0">
        <img
          src={starTree.imageUrl}
          alt={commonName}
          className="w-full h-full object-cover object-center opacity-45 sm:opacity-55 scale-105 filter blur-[0.3px]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-stone-950/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
      </div>
      {/* Embeds live in iframes on other sites, so the credit opens in a new tab. */}
      <PhotoCreditBadge
        imageUrl={starTree.imageUrl}
        anchorId={creditAnchorId(starTree.id)}
        language={language}
        external
        className="top-2 right-2 sm:top-3 sm:right-3"
      />

      <div className="relative z-10 space-y-3 sm:space-y-4 max-w-xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest-900/80 border border-forest-500/40 text-forest-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="w-3 h-3 text-forest-400" />
            <span>{tr.permacultureGuildLabel}</span>
          </span>
          {selectedPlants.length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-stone-900/80 border border-stone-700 text-stone-300 text-[10px] sm:text-xs font-medium backdrop-blur-xs">
              {selectedPlants.length} {tr.embedCardCompanions}
            </span>
          )}
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm font-sans">
            {commonName}
          </h2>
          <div className="text-sm sm:text-base italic text-emerald-400 mt-0.5 tracking-wide">
            {starTree.botanicalName}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed line-clamp-3 sm:line-clamp-4 max-w-lg drop-shadow-xs font-normal">
          {description}
        </p>

        {selectedPlants.length > 0 && !compact && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {selectedPlants.slice(0, 4).map(p => (
              <span
                key={p.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-900/85 border border-stone-700/80 text-[10px] text-stone-300 font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                <span>{getLoc(p.commonName, language)}</span>
              </span>
            ))}
            {selectedPlants.length > 4 && (
              <span className="px-1.5 py-0.5 rounded-md bg-stone-800/80 text-[10px] text-stone-400 font-medium">
                +{selectedPlants.length - 4} {tr.embedCardMore}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="relative z-10 pt-4 sm:pt-6 mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 border-t border-stone-800/80">
        <a
          href="https://pflanzengilde.de"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer text-left focus:outline-none"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-forest-600 group-hover:bg-forest-500 text-white flex items-center justify-center shadow-lg shadow-forest-600/30 transition-all group-hover:scale-105 shrink-0 border border-forest-400/30">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug group-hover:text-forest-300 transition-colors">
              Pflanzengilde<span className="text-emerald-400">.de</span>
            </div>
            <div className="text-[10px] sm:text-xs text-stone-400 font-medium">
              {tr.embedCardTagline}
            </div>
          </div>
        </a>

        {showActionBtn && (
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest-600 hover:bg-forest-500 text-white text-xs font-semibold shadow-md transition-all hover:shadow-forest-600/30 hover:scale-[1.02] shrink-0"
          >
            <span>{tr.openInPlanner}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
