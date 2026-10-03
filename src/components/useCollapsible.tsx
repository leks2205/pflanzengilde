import React, { useCallback, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

/** Open/closed state for sidebar sections (all open by default, kept for the session only). */
export function useCollapsible(initiallyClosed: string[] = []) {
  const [closed, setClosed] = useState<Set<string>>(() => new Set(initiallyClosed));
  const isOpen = useCallback((key: string) => !closed.has(key), [closed]);
  const toggle = useCallback((key: string) => {
    setClosed(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);
  return { isOpen, toggle };
}

/** Chevron shown in front of a collapsible title. */
export const CollapseChevron: React.FC<{ open: boolean; className?: string }> = ({ open, className = 'w-3.5 h-3.5 text-stone-400 shrink-0' }) =>
  open ? <ChevronDown className={className} aria-hidden="true" /> : <ChevronRight className={className} aria-hidden="true" />;
