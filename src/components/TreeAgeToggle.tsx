import React from 'react';
import { Sprout, TreeDeciduous } from 'lucide-react';
import { Language, TreeAgeMode } from '../types/guild';
import { t } from '../i18n/translations';

interface TreeAgeToggleProps {
  language: Language;
  treeAge: TreeAgeMode;
  onSelectTreeAge: (age: TreeAgeMode) => void;
  compact?: boolean;
}

/** Young planting vs established trees: sets the bare zone ground covers keep around trunks. */
export const TreeAgeToggle: React.FC<TreeAgeToggleProps> = ({ language, treeAge, onSelectTreeAge, compact }) => {
  const tr = t(language);
  const options: { id: TreeAgeMode; label: string; Icon: typeof Sprout }[] = [
    { id: 'YOUNG', label: tr.treeAgeYoung, Icon: Sprout },
    { id: 'ESTABLISHED', label: tr.treeAgeEstablished, Icon: TreeDeciduous },
  ];
  return (
    <div
      role="radiogroup"
      aria-label={tr.treeAgeLabel}
      title={tr.treeAgeHint}
      className="flex items-center gap-1 text-xs font-semibold p-0.5 rounded-xl bg-stone-100/90 border border-stone-200 shadow-2xs"
    >
      {!compact && <span className="px-2 text-[11px] text-stone-500 font-medium">{tr.treeAgeLabel}</span>}
      {options.map(({ id, label, Icon }) => {
        const active = treeAge === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelectTreeAge(id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              active ? 'bg-white text-forest-800 shadow-xs border border-forest-200' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};
