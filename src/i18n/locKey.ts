/**
 * Stable short key for an English source string (FNV-1a, 32 bit, base36).
 * The Norwegian data overlay (src/i18n/nb-data) is keyed by this, so the
 * upstream data files can stay untouched. If upstream rewrites an English
 * text, its key changes and the UI falls back to English until re-translated.
 */
export function locKey(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}
