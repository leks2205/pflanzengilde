import React, { useEffect, useState } from 'react';
import { Language, getLoc } from '../types/guild';
import { SpotEntry, SpotEntryKind } from '../core/spotInspector';
import { t } from '../i18n/translations';

/** Tracks whether Shift is held (also cleared when the window loses focus). */
export function useShiftKey(): boolean {
  const [down, setDown] = useState(false);
  useEffect(() => {
    const on = (e: KeyboardEvent) => { if (e.key === 'Shift') setDown(true); };
    const off = (e: KeyboardEvent) => { if (e.key === 'Shift') setDown(false); };
    const blur = () => setDown(false);
    window.addEventListener('keydown', on);
    window.addEventListener('keyup', off);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', on);
      window.removeEventListener('keyup', off);
      window.removeEventListener('blur', blur);
    };
  }, []);
  return down;
}

/** "[⇧ Shift] Hold Shift while hovering …" hint. */
export const ShiftHint: React.FC<{ language: Language; className?: string }> = ({ language, className = '' }) => {
  const tr = t(language);
  return (
    <div className={`flex items-center gap-2 text-[11px] text-stone-500 ${className}`}>
      <kbd className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-stone-300 border-b-2 bg-white text-stone-700 font-sans font-semibold text-[10px] shadow-2xs shrink-0">
        <span aria-hidden="true">⇧</span>
        <span>{tr.spotHintKey}</span>
      </kbd>
      <span>{tr.spotHint}</span>
    </div>
  );
};

interface SpotLegendProps {
  language: Language;
  entries: SpotEntry[];
  /** Position of the cursor inside the positioned container (px). */
  x: number;
  y: number;
  containerWidth: number;
  subtitle?: string;
}

/** Floating legend next to the cursor listing everything at the hovered spot. */
export const SpotLegend: React.FC<SpotLegendProps> = ({ language, entries, x, y, containerWidth, subtitle }) => {
  const tr = t(language);
  const kindLabel: Record<SpotEntryKind, string> = {
    TRUNK: tr.spotKindTrunk,
    CANOPY: tr.spotKindCanopy,
    PLANT: tr.spotKindPlant,
    COVER: tr.spotKindCover,
    DRIFT: tr.spotKindDrift,
  };
  const width = 230;
  const left = x + 16 + width > containerWidth ? Math.max(4, x - 16 - width) : x + 16;
  return (
    <div
      className="absolute z-30 pointer-events-none bg-white/95 backdrop-blur-xs border border-stone-200 rounded-xl shadow-lg px-3 py-2 text-[11px] text-stone-800"
      style={{ left, top: Math.max(4, y - 10), width }}
      role="status"
    >
      <div className="font-bold text-stone-900">{tr.spotTitle}</div>
      {subtitle && <div className="text-[10px] text-stone-500 mb-1">{subtitle}</div>}
      {entries.length === 0 ? (
        <div className="text-stone-500 italic">{tr.spotNothing}</div>
      ) : (
        <ul className="space-y-0.5 mt-1">
          {entries.map(e => (
            <li key={e.key} className={`flex items-center gap-1.5 ${e.outOfSeason ? 'opacity-50' : ''}`}>
              <span
                className={`w-2.5 h-2.5 shrink-0 ${e.kind === 'COVER' || e.kind === 'DRIFT' ? 'rounded-sm' : 'rounded-full'}`}
                style={{ background: e.color, opacity: e.kind === 'CANOPY' ? 0.5 : 1 }}
              />
              <span className="font-semibold truncate">{getLoc(e.name, language)}</span>
              <span className="text-stone-500 shrink-0">
                · {kindLabel[e.kind]}{e.outOfSeason ? ` (${tr.groundCoverOutOfSeason})` : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
