import React from 'react';
import { BookOpen } from 'lucide-react';
import { Language } from '../types/guild';
import { EvidenceCitation, EvidenceLevel, citationHref, evidenceLabel } from '../core/pestCompanionEngine';

const TAG_STYLES: Record<EvidenceLevel, string> = {
  'field-proven': 'bg-emerald-600 text-white border-emerald-700',
  'scientific': 'bg-sky-100 text-sky-900 border-sky-300',
  'promising': 'bg-amber-100 text-amber-900 border-amber-300',
  'folklore': 'bg-stone-200 text-stone-700 border-stone-300'
};

export const EvidenceTag: React.FC<{ level: EvidenceLevel; language: Language; compact?: boolean }> = ({
  level,
  language,
  compact = false
}) => (
  <span
    className={`inline-flex items-center rounded-md border font-bold uppercase tracking-wider whitespace-nowrap ${
      compact ? 'px-1 text-[8px]' : 'px-1.5 py-0.5 text-[9px]'
    } ${TAG_STYLES[level]}`}
  >
    {evidenceLabel(level, language)}
  </span>
);

export const EvidenceCitations: React.FC<{ citations: EvidenceCitation[]; title: string }> = ({ citations, title }) => {
  if (citations.length === 0) return null;
  return (
    <div className="text-[10px] text-stone-500 leading-snug space-y-0.5">
      <div className="flex items-center gap-1 font-semibold text-stone-600 uppercase tracking-wider">
        <BookOpen className="w-3 h-3 shrink-0" />
        <span>{title}</span>
      </div>
      <ul className="space-y-0.5 pl-4 list-disc">
        {citations.map(c => {
          const href = citationHref(c);
          return (
            <li key={c.label}>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-emerald-800">
                  {c.label}
                </a>
              ) : (
                c.label
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
