import React from 'react';

interface RichTextProps {
  text: string;
  onFootnote?: (id: string) => void;
  // Optional non-text nodes (links, <code>, styled spans, custom buttons) referenced as {{0}}, {{1}}, …
  slots?: React.ReactNode[];
}

// Renders translation strings with a minimal inline markup:
//   **bold**   *italic*   [^3] → clickable footnote marker "[3]" (calls onFootnote('fn-3'))
//   **bold with *italic* inside** is supported (one level of nesting).
//   {{n}} → slots[n] (only when the slots prop is given)
const TOKEN = /(\*\*(?:[^*]|\*[^*]+\*)+\*\*|\*[^*]+\*|\[\^[\w-]+\])/g;
const TOKEN_WITH_SLOTS = /(\*\*(?:[^*]|\*[^*]+\*)+\*\*|\*[^*]+\*|\[\^[\w-]+\]|\{\{\d+\}\})/g;

export const RichText: React.FC<RichTextProps> = ({ text, onFootnote, slots }) => (
  <>
    {text.split(slots ? TOKEN_WITH_SLOTS : TOKEN).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong key={i}>
            <RichText text={part.slice(2, -2)} onFootnote={onFootnote} slots={slots} />
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      const fn = part.match(/^\[\^([\w-]+)\]$/);
      if (fn) {
        return (
          <button
            key={i}
            type="button"
            onClick={() => onFootnote?.(`fn-${fn[1]}`)}
            className="text-forest-700 font-bold hover:underline cursor-pointer"
          >
            [{fn[1]}]
          </button>
        );
      }
      const slot = slots && part.match(/^\{\{(\d+)\}\}$/);
      if (slot) {
        return <React.Fragment key={i}>{slots[Number(slot[1])]}</React.Fragment>;
      }
      return part;
    })}
  </>
);
