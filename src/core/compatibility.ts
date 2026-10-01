import { GuildPlant, LocalizedString, StarTree } from '../types/guild';
import {
  isStrictAcidophilePlant,
  isStrictCalcicolePlant,
  isAcidIntolerantStar,
  STRICT_ACIDOPHILE_STAR_IDS
} from './placementRules';
import { PEST_HOST_CONFLICTS } from './pestHostConflicts';
import { en } from '../i18n/en';
import { de } from '../i18n/de';

/**
 * Guild compatibility: which companions may share a guild (one root zone) with a star plant
 * and with each other. Derived from the same classifiers and specs as analyzeGuildAntagonisms
 * (antagonistEngine.ts), so the builder can never offer a plant that the engine then reports
 * as a CRITICAL/WARNING conflict. Pure data logic, no React/UI imports.
 *
 * Incompatible (no spacing inside one guild can fix it):
 * - JUGLONE    star is a juglone producer, companion is juglone-sensitive
 *              (engine: 'internal-walnut-sensitive-companions', CRITICAL).
 * - EDAPHIC_PH strict acidophile vs. calcicole / acid-intolerant plant in the same root zone
 *              (engine: 'internal-edaphic-ph-antagonism', WARNING; the guild engine flags it
 *              regardless of distance). Applies star↔companion and companion↔companion.
 * - PEST_HOST  companion is a reservoir host of a pest/pathogen of the star (pestHostConflicts.ts,
 *              kind 'INTERNAL', WARNING). Star-only: companions are never the susceptible side.
 *
 * Spacing-solvable (allowed; autoPlaceGuildPlants keeps the buffer): see SPACING_SOLVABLE_RULES.
 * External alerts (walnut siting, juniper rust, Verticillium nightshades, tea on lime,
 * lupine/ink disease) concern plants outside the guild and never block a companion.
 * Climate zone and soil suitability are separate filters and are NOT checked here.
 */

export type IncompatibilityCode = 'JUGLONE' | 'EDAPHIC_PH' | 'PEST_HOST';

export interface IncompatibilityReason {
  code: IncompatibilityCode;
  /** Severity of the conflict the engine would report. */
  severity: 'CRITICAL' | 'WARNING';
  /** ID of the mirrored conflict in analyzeGuildAntagonisms / PEST_HOST_CONFLICTS. */
  conflictId: string;
  /** Conflict partner: the star plant ID or the other companion's ID. */
  withId: string;
  withName: LocalizedString;
  /** Short bilingual explanation (from en.ts/de.ts). */
  message: LocalizedString;
}

/** Pairwise conflicts the placement engine resolves by distance; they never block a pairing. */
export const SPACING_SOLVABLE_RULES: ReadonlyArray<{ conflictId: string; bufferM: number }> = [
  { conflictId: 'internal-allium-legume-proximity', bufferM: 1.8 },
  { conflictId: 'internal-allium-nfixing-tree-proximity', bufferM: 1.8 },
  { conflictId: 'internal-fennel-allelopathy', bufferM: 1.5 },
  { conflictId: 'internal-wormwood-allelopathy', bufferM: 1.2 }
];

type CompatMsgKey = 'compatReasonJuglone' | 'compatReasonEdaphic' | 'compatReasonPestHost';

function fill(template: string, vars: Record<string, string>): string {
  return Object.keys(vars).reduce((acc, k) => acc.split(`{${k}}`).join(vars[k]), template);
}

function msg(key: CompatMsgKey, vars: (lang: 'de' | 'en') => Record<string, string>): LocalizedString {
  return { de: fill(de[key], vars('de')), en: fill(en[key], vars('en')) };
}

/** pH class of a star, using the engine's classifiers. */
type PhClass = 'ACID' | 'CALC' | null;

function starPhClass(star: StarTree): PhClass {
  if (STRICT_ACIDOPHILE_STAR_IDS.has(star.id)) return 'ACID';
  if (isAcidIntolerantStar(star)) return 'CALC';
  return null;
}

/**
 * Reasons why `plant` cannot join the guild of `star` (empty = compatible). Covers only
 * star↔companion conflicts; use getGuildIncompatibility to include the already-selected companions.
 */
export function getStarIncompatibility(plant: GuildPlant, star: StarTree): IncompatibilityReason[] {
  const reasons: IncompatibilityReason[] = [];
  const starName = star.commonName;

  if (star.jugloneProducer && plant.jugloneTolerance === 'SENSITIVE') {
    reasons.push({
      code: 'JUGLONE',
      severity: 'CRITICAL',
      conflictId: 'internal-walnut-sensitive-companions',
      withId: star.id,
      withName: starName,
      message: msg('compatReasonJuglone', l => ({ other: starName[l] }))
    });
  }

  const sp = starPhClass(star);
  if ((sp === 'ACID' && isStrictCalcicolePlant(plant)) || (sp === 'CALC' && isStrictAcidophilePlant(plant))) {
    reasons.push({
      code: 'EDAPHIC_PH',
      severity: 'WARNING',
      conflictId: 'internal-edaphic-ph-antagonism',
      withId: star.id,
      withName: starName,
      message: msg('compatReasonEdaphic', l => ({ other: starName[l] }))
    });
  }

  for (const spec of PEST_HOST_CONFLICTS) {
    if (spec.kind !== 'INTERNAL') continue;
    if (!spec.starTreeIds.includes(star.id) || !spec.hostPlantIds.includes(plant.id)) continue;
    reasons.push({
      code: 'PEST_HOST',
      severity: 'WARNING',
      conflictId: spec.id,
      withId: star.id,
      withName: starName,
      message: msg('compatReasonPestHost', l => ({ other: starName[l], conflict: spec.title[l] }))
    });
  }

  return reasons;
}

/** True when `plant` has no star↔companion conflict with `star`. */
export function isCompatibleWithStar(plant: GuildPlant, star: StarTree): boolean {
  return getStarIncompatibility(plant, star).length === 0;
}

/**
 * Companion↔companion conflicts that spacing inside one guild cannot solve (currently only
 * EDAPHIC_PH: acid-soil vs. lime-soil plant). Reasons are from `plant`'s view (withId = other.id).
 * Allium/legume, fennel and wormwood are spacing-solvable and return [].
 */
export function getCompanionPairIncompatibility(plant: GuildPlant, other: GuildPlant): IncompatibilityReason[] {
  if (plant.id === other.id) return [];
  const a = { acid: isStrictAcidophilePlant(plant), calc: isStrictCalcicolePlant(plant) };
  const b = { acid: isStrictAcidophilePlant(other), calc: isStrictCalcicolePlant(other) };
  if ((a.acid && b.calc) || (a.calc && b.acid)) {
    return [{
      code: 'EDAPHIC_PH',
      severity: 'WARNING',
      conflictId: 'internal-edaphic-ph-antagonism',
      withId: other.id,
      withName: other.commonName,
      message: msg('compatReasonEdaphic', l => ({ other: other.commonName[l] }))
    }];
  }
  return [];
}

/** True when the two companions may share one guild. */
export function isCompatiblePair(plant: GuildPlant, other: GuildPlant): boolean {
  return getCompanionPairIncompatibility(plant, other).length === 0;
}

/**
 * All reasons why `plant` cannot be added to the guild of `star` that already holds
 * `companions` (the plant itself is skipped if present). Empty = safe to add.
 */
export function getGuildIncompatibility(
  plant: GuildPlant,
  star: StarTree,
  companions: readonly GuildPlant[] = []
): IncompatibilityReason[] {
  const reasons = getStarIncompatibility(plant, star);
  for (const other of companions) {
    if (other.id === plant.id) continue;
    reasons.push(...getCompanionPairIncompatibility(plant, other));
  }
  return reasons;
}

/** True when `plant` can be added to the guild of `star` with `companions` without a conflict. */
export function isCompatibleWithGuild(plant: GuildPlant, star: StarTree, companions: readonly GuildPlant[] = []): boolean {
  return getGuildIncompatibility(plant, star, companions).length === 0;
}

/**
 * Short list for display: the star-level reasons if there are any (they explain everything),
 * otherwise one reason per conflict code among the companion pairs.
 */
export function summarizeIncompatibility(reasons: readonly IncompatibilityReason[], starId: string): IncompatibilityReason[] {
  const starReasons = reasons.filter(r => r.withId === starId);
  if (starReasons.length > 0) return starReasons;
  const seen = new Set<string>();
  return reasons.filter(r => !seen.has(r.conflictId) && !!seen.add(r.conflictId));
}

export interface IncompatibleSelection {
  plant: GuildPlant;
  reasons: IncompatibilityReason[];
}

/**
 * Splits an existing selection (share link, star switch, import) into a conflict-free guild and
 * the plants that must go: star-incompatible plants first, then pair conflicts resolved greedily
 * in selection order (the earlier plant stays).
 */
export function partitionGuildByCompatibility(
  star: StarTree,
  selectedPlants: readonly GuildPlant[]
): { compatible: GuildPlant[]; incompatible: IncompatibleSelection[] } {
  const compatible: GuildPlant[] = [];
  const incompatible: IncompatibleSelection[] = [];
  for (const plant of selectedPlants) {
    const reasons = getGuildIncompatibility(plant, star, compatible);
    if (reasons.length > 0) incompatible.push({ plant, reasons });
    else compatible.push(plant);
  }
  return { compatible, incompatible };
}
