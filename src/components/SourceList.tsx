import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Language } from '../types/guild';
import { t } from '../i18n/translations';

// Matches, in priority order: a doi.org URL, any other http(s) URL, or a bare DOI
// (optionally prefixed with "doi:" / "DOI:").
const LINK_PATTERN = /https?:\/\/(?:dx\.)?doi\.org\/(10\.\d{4,9}\/\S+)|(https?:\/\/\S+)|(?:doi:\s*)?(10\.\d{4,9}\/\S+)/gi;

/** Strips trailing sentence punctuation from a matched link; keeps balanced closing parentheses. */
const trimTrailing = (s: string): string => {
  let out = s;
  for (;;) {
    const last = out.charAt(out.length - 1);
    if ('.,;:]\'"'.includes(last) && out.length > 1) {
      out = out.slice(0, -1);
    } else if (last === ')' && (out.match(/\)/g) || []).length > (out.match(/\(/g) || []).length) {
      out = out.slice(0, -1);
    } else {
      return out;
    }
  }
};

const linkClass = 'underline decoration-dotted hover:text-emerald-800 break-all';

/** Renders a citation string with DOIs linked to doi.org and plain URLs linked as-is. */
const renderCitation = (text: string): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(text)) !== null) {
    const raw = match[0];
    const kept = trimTrailing(raw);
    const start = match.index;
    const end = start + kept.length;
    LINK_PATTERN.lastIndex = end;
    if (start > cursor) nodes.push(text.slice(cursor, start));

    let href: string;
    if (match[1] !== undefined) {
      href = `https://doi.org/${trimTrailing(match[1])}`;
    } else if (match[2] !== undefined) {
      href = kept;
    } else {
      const doi = trimTrailing(match[3]);
      href = `https://doi.org/${doi}`;
    }
    nodes.push(
      <a key={start} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {kept}
      </a>
    );
    cursor = end;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
};

interface SourceListProps {
  sources?: string[];
  language: Language;
  /** Heading text; defaults to "Sources"/"Quellen". Pass null to hide the heading. */
  title?: string | null;
  /** Show only this many entries until expanded; 0 disables collapsing. */
  collapseAfter?: number;
  className?: string;
}

/** Compact, muted list of literature citations (same look as the pest-defence evidence sources). */
export const SourceList: React.FC<SourceListProps> = ({
  sources,
  language,
  title,
  collapseAfter = 3,
  className = ''
}) => {
  const [expanded, setExpanded] = useState(false);
  const items = (sources ?? []).map(s => s.trim()).filter(Boolean);
  if (items.length === 0) return null;

  const tr = t(language);
  const heading = title === undefined ? tr.evidenceSourcesTitle : title;
  const canCollapse = collapseAfter > 0 && items.length > collapseAfter + 1;
  const visible = canCollapse && !expanded ? items.slice(0, collapseAfter) : items;

  return (
    <div className={`text-[10px] text-stone-500 leading-snug space-y-0.5 ${className}`}>
      {heading && (
        <div className="flex items-center gap-1 font-semibold text-stone-600 uppercase tracking-wider">
          <BookOpen className="w-3 h-3 shrink-0" />
          <span>{heading}</span>
        </div>
      )}
      <ul className="space-y-0.5 pl-4 list-disc">
        {visible.map((source, idx) => (
          <li key={idx}>{renderCitation(source)}</li>
        ))}
      </ul>
      {canCollapse && (
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          aria-expanded={expanded}
          className="pl-4 font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
        >
          {expanded ? tr.sourcesShowFewer : tr.sourcesShowAll.replace('{count}', String(items.length))}
        </button>
      )}
    </div>
  );
};
