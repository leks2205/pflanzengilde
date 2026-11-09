/**
 * Norwegian (bokmål) overlay for inline { en, de } data strings, keyed by locKey(en).
 * Run `npx tsx scripts/extract_localized.ts` to list strings that still lack a translation.
 */
import { d00 } from './d00';
import { d01 } from './d01';
import { d02 } from './d02';
import { d03 } from './d03';
import { d04 } from './d04';
import { d05 } from './d05';
import { d06 } from './d06';
import { d07 } from './d07';
import { d08 } from './d08';
import { d09 } from './d09';
import { d10 } from './d10';
import { d11 } from './d11';
import { d12 } from './d12';
import { d13 } from './d13';

export const NB_DATA: Record<string, string> = {
  ...d00, ...d01, ...d02, ...d03, ...d04, ...d05, ...d06, ...d07, ...d08, ...d09, ...d10, ...d11, ...d12, ...d13,
};
