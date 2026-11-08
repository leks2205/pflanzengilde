import type { en } from './en';
import { nbPart1 } from './nb/part1';
import { nbPart2 } from './nb/part2';
import { nbPart3 } from './nb/part3';
import { nbPart4 } from './nb/part4';
import { nbPart5 } from './nb/part5';
import { nbPart6 } from './nb/part6';
import { nbPart7 } from './nb/part7';
import { nbPart8 } from './nb/part8';
import { nbPart9 } from './nb/part9';

/** Norwegian (bokmål). Missing keys fall back to English in translations.ts. */
export const nb: Partial<typeof en> = {
  ...nbPart1, ...nbPart2, ...nbPart3, ...nbPart4, ...nbPart5,
  ...nbPart6, ...nbPart7, ...nbPart8, ...nbPart9,
};
