import { GuildPlant, GuildRole, LocalizedString, PhenoSeason, SeasonalGap, StarTree } from '../types/guild';
import { getCompanionPestDefenseForTree } from './pestCompanionEngine';
import { ACTIVE_GUILD_PLANTS } from '../data/guildPlants';
import { isCompatiblePair, isCompatibleWithGuild } from './compatibility';

export interface PhenoSeasonDef {
  id: PhenoSeason;
  label: LocalizedString;
  months: LocalizedString;
  description: LocalizedString;
}

export const PHENO_SEASONS: PhenoSeasonDef[] = [
  {
    id: 'EARLY_SPRING',
    label: {
      en: 'Early Spring',
      de: 'Vorfrühling'
    },
    months: {
      en: 'March – April',
      de: 'März – April'
    },
    description: {
      en: 'Sap rises, queen bumblebees and solitary bees awaken; frost still possible.',
      de: 'Saftstrom erwacht, Hummelköniginnen und Wildbienen fliegen aus; Nachtfröste möglich.'
    }
  },
  {
    id: 'LATE_SPRING',
    label: {
      en: 'Late Spring / Early Summer',
      de: 'Spätfrühling / Frühsommer'
    },
    months: {
      en: 'May – June',
      de: 'Mai – Juni'
    },
    description: {
      en: 'Tree blossoms open, rapid shoot growth, fruit set begins.',
      de: 'Hauptblüte der Obstbäume, rasanter Triebzuwachs, erster Fruchtansatz.'
    }
  },
  {
    id: 'SUMMER',
    label: {
      en: 'High Summer',
      de: 'Hochsommer'
    },
    months: {
      en: 'July – August',
      de: 'Juli – August'
    },
    description: {
      en: 'Strongest sun, fruit swelling, risk of heat and drought stress.',
      de: 'Stärkste Sonneneinstrahlung, Fruchtwachstum, Gefahr von Hitze- und Trockenstress.'
    }
  },
  {
    id: 'AUTUMN',
    label: {
      en: 'Early Autumn',
      de: 'Frühherbst'
    },
    months: {
      en: 'September – October',
      de: 'September – Oktober'
    },
    description: {
      en: 'Fruit and nut harvest, leaf drop, pollinators packing winter reserves.',
      de: 'Obst- und Nussernte, einsetzender Laubfall, Bienen sammeln letzte Winterreserven.'
    }
  },
  {
    id: 'WINTER',
    label: {
      en: 'Winter Dormancy',
      de: 'Winterruhe'
    },
    months: {
      en: 'November – February',
      de: 'November – Februar'
    },
    description: {
      en: 'Canopy dormant; bare soil stays uncovered; voles may gnaw roots and bark.',
      de: 'Baumkrone ruht; offener Boden bleibt unbedeckt; Wühlmäuse können Wurzeln und Rinde benagen.'
    }
  }
];

export interface RoleSeasonalStatus {
  role: GuildRole;
  displayName: LocalizedString;
  seasonCoverage: Record<PhenoSeason, { covered: boolean; plants: GuildPlant[] }>;
  gaps: SeasonalGap[];
}

const ROLE_DISPLAY_NAMES: Record<GuildRole, LocalizedString> = {
  NITROGEN_FIXER: { en: 'Nitrogen Fixer', de: 'Stickstoff-Fixierer' },
  DYNAMIC_ACCUMULATOR: { en: 'Dynamic Accumulator', de: 'Dynamischer Akkumulator' },
  POLLINATOR_MAGNET: { en: 'Pollinator Magnet', de: 'Bestäuber- & Nützlingsmagnet' },
  PEST_REPELLER: { en: 'Pest Repeller', de: 'Schädlingsabwehr' },
  LIVING_MULCH: { en: 'Living Mulch', de: 'Lebendiger Mulch' },
  GRASS_BARRIER: { en: 'Grass Barrier', de: 'Grasbarriere' },
  ANTIFUNGAL: { en: 'Antifungal Ally', de: 'Pilzhemmende Begleiter' },
  BIOMASS_PRODUCER: { en: 'Biomass Producer', de: 'Biomasse / Chop & Drop' },
  EDIBLE_UNDERSTORY: { en: 'Edible Understory', de: 'Essbarer Unterwuchs' }
};

/** Smaller layers first: a gap is usually filled with an understory plant, not another tree. */
const LAYER_RANK: Record<GuildPlant['layer'], number> = {
  GROUND_COVER: 0, BULB_ROOT: 0, HERBACEOUS: 1, VINE: 2, SHRUB: 3, SUB_CANOPY: 4, CANOPY: 5
};

/**
 * Catalogue plants (retired ones excluded) that fill `role` in `season`, best first: companions
 * recommended for the star plant, then smaller layers, then plants with more roles. Plants that
 * conflict with the star or with the already chosen `guildPlants` (compatibility.ts) are left out.
 */
export function getGapCandidateIds(
  role: GuildRole,
  season: PhenoSeason,
  excludeIds: Set<string> = new Set(),
  starTree?: StarTree | null,
  limit = 4,
  guildPlants: readonly GuildPlant[] = []
): string[] {
  const isRecommended = (p: GuildPlant) =>
    !!starTree && (starTree.recommendedCompanions.includes(p.id) || p.recommendedForTrees.includes(starTree.id));
  return ACTIVE_GUILD_PLANTS
    .map((plant, index) => ({ plant, index }))
    .filter(({ plant }) =>
      !excludeIds.has(plant.id) &&
      (starTree ? isCompatibleWithGuild(plant, starTree, guildPlants) : guildPlants.every(g => isCompatiblePair(plant, g))) &&
      plantCoversRoleInSeason(plant, role, season)
    )
    .sort((a, b) =>
      Number(isRecommended(b.plant)) - Number(isRecommended(a.plant)) ||
      LAYER_RANK[a.plant.layer] - LAYER_RANK[b.plant.layer] ||
      b.plant.roles.length - a.plant.roles.length ||
      a.index - b.index
    )
    .slice(0, limit)
    .map(({ plant }) => plant.id);
}

/**
 * Seasonal gaps per role. Suggestions are derived from the catalogue data (role + season), and a
 * gap that no unselected catalogue plant could fill is not reported.
 */
export function analyzeSeasonalRoleGaps(selectedPlants: GuildPlant[], starTree?: StarTree | null): RoleSeasonalStatus[] {
  const selectedIds = new Set(selectedPlants.map(p => p.id));
  const candidatesFor = (role: GuildRole, season: PhenoSeason) => getGapCandidateIds(role, season, selectedIds, starTree, 4, selectedPlants);
  const allRoles: GuildRole[] = [
    'POLLINATOR_MAGNET',
    'LIVING_MULCH',
    'GRASS_BARRIER',
    'PEST_REPELLER',
    'BIOMASS_PRODUCER',
    'NITROGEN_FIXER',
    'DYNAMIC_ACCUMULATOR'
  ];

  return allRoles.map(role => {
    const rolePlants = selectedPlants.filter(p => p.roles.includes(role));

    const seasonCoverage: Record<PhenoSeason, { covered: boolean; plants: GuildPlant[] }> = {
      EARLY_SPRING: { covered: false, plants: [] },
      LATE_SPRING: { covered: false, plants: [] },
      SUMMER: { covered: false, plants: [] },
      AUTUMN: { covered: false, plants: [] },
      WINTER: { covered: false, plants: [] }
    };

    for (const plant of rolePlants) {
      for (const s of PHENO_SEASONS) {
        if (plantCoversRoleInSeason(plant, role, s.id)) {
          seasonCoverage[s.id].covered = true;
          if (!seasonCoverage[s.id].plants.some(p => p.id === plant.id)) {
            seasonCoverage[s.id].plants.push(plant);
          }
        }
      }
    }

    const gaps: SeasonalGap[] = [];

    // Gaps only matter for roles the guild already fills in some season
    if (rolePlants.length > 0) {
      if (role === 'POLLINATOR_MAGNET') {
        const requiredSeasons: PhenoSeason[] = ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'];
        for (const season of requiredSeasons) {
          if (!seasonCoverage[season].covered) {
            const candidates = candidatesFor(role, season);
            if (candidates.length === 0) continue;
            let reason: LocalizedString = { en: '', de: '' };

            if (season === 'EARLY_SPRING') {
              reason = {
                en: 'Early Spring Gap: No companion flowers before the fruit trees bloom, when queen bumblebees and early solitary bees are already flying.',
                de: 'Vorfrühlings-Lücke: Keine Begleitblüten vor der Obstbaumblüte, wenn Hummelköniginnen und frühe Wildbienen schon fliegen.'
              };
            } else if (season === 'LATE_SPRING') {
              reason = {
                en: 'Late Spring Blossom Gap: Companion flowers needed to sustain pollinators while fruit trees are in bloom.',
                de: 'Blütenlücke im Spätfrühling: Begleitblüten fehlen, um Bestäuber während der Obstblüte verlässlich im System zu halten.'
              };
            } else if (season === 'SUMMER') {
              reason = {
                en: 'High Summer Nectar Gap: No companion flowers in midsummer. In lab tests, a codling moth parasitoid wasp lived more than twice as long when it could feed on flowers.',
                de: 'Hochsommer-Nektarlücke: Keine Begleitblüten im Hochsommer. Im Labor lebte eine Schlupfwespe des Apfelwicklers mehr als doppelt so lange, wenn sie an Blüten fressen konnte.'
              };
            } else if (season === 'AUTUMN') {
              reason = {
                en: 'Autumn Gap: No companion flowers late in the season for bees and other flower visitors still active in autumn.',
                de: 'Herbst-Lücke: Keine späten Begleitblüten für Bienen und andere Blütenbesucher, die im Herbst noch aktiv sind.'
              };
            }

            gaps.push({
              role,
              season,
              reason,
              suggestedPlantIds: candidates
            });
          }
        }
      } else if (role === 'LIVING_MULCH') {
        const candidates = candidatesFor(role, 'WINTER');
        if (!seasonCoverage['WINTER'].covered && candidates.length > 0) {
          gaps.push({
            role,
            season: 'WINTER',
            reason: {
              en: 'Winter Ground Cover Gap: None of the selected ground covers keeps its leaves in winter, so the soil lies bare until spring.',
              de: 'Winterlücke bei der Bodendeckung: Keiner der gewählten Bodendecker behält im Winter sein Laub, der Boden liegt bis zum Frühjahr offen.'
            },
            suggestedPlantIds: candidates
          });
        }
      } else if (role === 'GRASS_BARRIER') {
        const candidates = candidatesFor(role, 'SUMMER');
        if (!seasonCoverage['SUMMER'].covered && candidates.length > 0) {
          gaps.push({
            role,
            season: 'SUMMER',
            reason: {
              en: 'Summer Weed Barrier Gap: None of the selected weed-suppressing plants is active in summer, when weeds grow fastest in the tree strip. In an organic apple orchard, peppermint and lady\'s mantle living mulches cut summer weeds most; that any planting holds back lawn grass is untested, so mulching the tree basin stays the more reliable option.',
              de: 'Unkrautbarriere-Sommerlücke: Keine der gewählten unkrautunterdrückenden Pflanzen ist im Sommer aktiv, wenn Unkraut im Baumstreifen am stärksten wächst. In einer Bio-Apfelanlage senkten lebende Mulche aus Pfefferminze und Frauenmantel das Sommerunkraut am stärksten; dass eine Pflanzung Rasengras zurückhält, ist nicht geprüft, Mulchen der Baumscheibe bleibt daher verlässlicher.'
            },
            suggestedPlantIds: candidates
          });
        }
      } else if (role === 'PEST_REPELLER') {
        const candidates = candidatesFor(role, 'WINTER');
        if (!seasonCoverage['WINTER'].covered && candidates.length > 0) {
          gaps.push({
            role,
            season: 'WINTER',
            reason: {
              en: 'Winter Pest Repeller Gap: None of the selected repeller plants is active in winter. No study was found showing that a companion plant protects tree bark or roots from voles; a wire-mesh root basket and trunk guard are the physical options.',
              de: 'Winterlücke bei der Schädlingsabwehr: Keine der gewählten Abwehrpflanzen ist im Winter aktiv. Eine Studie, nach der eine Begleitpflanze Rinde oder Wurzeln vor Wühlmäusen schützt, wurde nicht gefunden; Wurzelschutzkorb aus Drahtgeflecht und Stammschutz sind die mechanischen Möglichkeiten.'
            },
            suggestedPlantIds: candidates
          });
        }
      }
    }

    return {
      role,
      displayName: ROLE_DISPLAY_NAMES[role],
      seasonCoverage,
      gaps
    };
  });
}

/** Suggested plants in suggestion order (retired companions never included). */
export function getSuggestedPlantsForGap(suggestedIds: string[]): GuildPlant[] {
  return suggestedIds
    .map(id => ACTIVE_GUILD_PLANTS.find(p => p.id === id))
    .filter((p): p is GuildPlant => !!p);
}

export function plantCoversRoleInSeason(plant: GuildPlant, role: GuildRole, season: PhenoSeason): boolean {
  if (!plant.roles.includes(role)) return false;
  if (role === 'POLLINATOR_MAGNET') {
    return plant.seasonalActivity.floweringSeasons.includes(season);
  } else if (role === 'LIVING_MULCH') {
    return plant.seasonalActivity.foliageSeasons.includes(season);
  } else if (role === 'PEST_REPELLER') {
    return plant.seasonalActivity.pestDeterrenceSeasons.includes(season);
  } else if (role === 'BIOMASS_PRODUCER') {
    return plant.seasonalActivity.chopAndDropSeasons.includes(season);
  } else {
    return plant.seasonalActivity.activeSeasons.includes(season);
  }
}

export interface RedundantPlantReport {
  plant: GuildPlant;
  roles: GuildRole[];
  coveringPlants: GuildPlant[];
  roleBreakdown: {
    role: GuildRole;
    coveredBy: GuildPlant[];
  }[];
  uncoveredRolesInGuild: GuildRole[];
  suggestedAlternativeForGaps: GuildPlant[];
}

/**
 * Plants whose every role, in every season they fill it, is also covered by another selected
 * plant. Plants with an evidence-backed defense against a pest of the star plant are never
 * redundant: the proven defenses mostly work as a mix (flower strips, ground covers).
 */
export function analyzePlantRedundancy(selectedPlants: GuildPlant[], starTree?: StarTree | null): RedundantPlantReport[] {
  const validPlants = (selectedPlants || []).filter(p => Boolean(p && p.id && p.roles));
  if (validPlants.length <= 1) return [];

  const redundantReports: RedundantPlantReport[] = [];
  const selectedIds = new Set(validPlants.map(p => p.id));

  const uncoveredRolesInGuild = (Object.keys(ROLE_DISPLAY_NAMES) as GuildRole[]).filter(
    role => !validPlants.some(p => p.roles.includes(role))
  );

  validPlants.forEach(plant => {
    if (plant.roles.length === 0) return;
    if (starTree && getCompanionPestDefenseForTree(plant, starTree).length > 0) return;

    const otherPlants = validPlants.filter(p => p.id !== plant.id);
    let isFullyRedundant = true;
    const allCoveringMap = new Map<string, GuildPlant>();
    const roleBreakdown: { role: GuildRole; coveredBy: GuildPlant[] }[] = [];

    for (const role of plant.roles) {
      const roleCoveringPlants = new Map<string, GuildPlant>();

      for (const seasonDef of PHENO_SEASONS) {
        const season = seasonDef.id;
        if (plantCoversRoleInSeason(plant, role, season)) {
          const othersCoveringInSeason = otherPlants.filter(q =>
            plantCoversRoleInSeason(q, role, season)
          );

          if (othersCoveringInSeason.length === 0) {
            isFullyRedundant = false;
            break;
          } else {
            othersCoveringInSeason.forEach(oc => {
              roleCoveringPlants.set(oc.id, oc);
              allCoveringMap.set(oc.id, oc);
            });
          }
        }
      }

      if (!isFullyRedundant) break;

      roleBreakdown.push({
        role,
        coveredBy: Array.from(roleCoveringPlants.values())
      });
    }

    if (isFullyRedundant && allCoveringMap.size > 0) {
      const candidateReplacements = ACTIVE_GUILD_PLANTS.filter(candidate => {
        if (selectedIds.has(candidate.id)) return false;
        // A replacement must fit the guild that remains after removing `plant`
        if (starTree ? !isCompatibleWithGuild(candidate, starTree, otherPlants) : !otherPlants.every(o => isCompatiblePair(candidate, o))) return false;
        return candidate.roles.some(r => uncoveredRolesInGuild.includes(r));
      }).slice(0, 3);

      redundantReports.push({
        plant,
        roles: plant.roles,
        coveringPlants: Array.from(allCoveringMap.values()),
        roleBreakdown,
        uncoveredRolesInGuild,
        suggestedAlternativeForGaps: candidateReplacements
      });
    }
  });

  return redundantReports;
}

const MONTH_RE =
  /(?<![a-zäöüß])(jan(?:uar|uary)?|feb(?:ruar|ruary)?|märz?|mar(?:ch)?|apr(?:il)?|mai|may|jun[ie]?|jul[iy]?|aug(?:ust)?|sep(?:t(?:ember)?)?|okt(?:ober)?|oct(?:ober)?|nov(?:ember)?|dez(?:ember)?|dec(?:ember)?)(?![a-zäöüß])/g;
const RANGE_SEP_RE = /^\s*(?:[–—-]|bis|to|until|through)\s*$/;
const MONTH_INDEX: Record<string, number> = {
  jan: 0, feb: 1, mär: 2, mar: 2, apr: 3, mai: 4, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, okt: 9, oct: 9, nov: 10, dez: 11, dec: 11
};
const MONTH_SEASON: PhenoSeason[] = [
  'WINTER', 'WINTER', 'EARLY_SPRING', 'EARLY_SPRING', 'LATE_SPRING', 'LATE_SPRING',
  'SUMMER', 'SUMMER', 'AUTUMN', 'AUTUMN', 'WINTER', 'WINTER'
];

/**
 * Seasons covered by the months named in a planting/harvest text, expanding ranges like
 * "Mär–Mai" or "Dezember bis April" (wrapping over the new year), in order of appearance.
 * German is parsed first because English "may" is ambiguous.
 */
function seasonsFromMonths(text?: LocalizedString): PhenoSeason[] {
  for (const raw of [text?.de, text?.en]) {
    if (!raw) continue;
    const lower = raw.toLowerCase();
    const matches = [...lower.matchAll(MONTH_RE)];
    if (matches.length === 0) continue;

    const seasons: PhenoSeason[] = [];
    const add = (month: number) => {
      const s = MONTH_SEASON[month];
      if (!seasons.includes(s)) seasons.push(s);
    };
    for (let i = 0; i < matches.length; i++) {
      const cur = matches[i];
      const next = matches[i + 1];
      const start = MONTH_INDEX[cur[1].slice(0, 3)];
      const between = next ? lower.slice(cur.index! + cur[0].length, next.index) : '';
      if (next && RANGE_SEP_RE.test(between)) {
        const end = MONTH_INDEX[next[1].slice(0, 3)];
        for (let m = start; ; m = (m + 1) % 12) {
          add(m);
          if (m === end) break;
        }
        i++;
      } else {
        add(start);
      }
    }
    return seasons;
  }
  return [];
}

/** Planting seasons: explicit data first, else parsed from the planting-time text. */
export function getPlantingSeasons(plant: GuildPlant): PhenoSeason[] {
  if (plant.seasonalActivity.plantingSeasons && plant.seasonalActivity.plantingSeasons.length > 0) {
    return plant.seasonalActivity.plantingSeasons;
  }
  const fromMonths = seasonsFromMonths(plant.plantingTime);
  if (fromMonths.length > 0) return fromMonths;

  const text = `${plant.plantingTime?.de || ''} ${plant.plantingTime?.en || ''}`.toLowerCase();
  const seasons: PhenoSeason[] = [];

  if (text.includes('vorfrühling') || text.includes('late winter') || (text.includes('mär') && text.includes('feb'))) {
    seasons.push('EARLY_SPRING');
  }
  if (text.includes('frühjahr') || text.includes('frühling') || text.includes('apr') || text.includes('mai') || text.includes('spring')) {
    if (!seasons.includes('LATE_SPRING')) seasons.push('LATE_SPRING');
    if ((text.includes('mär') || text.includes('mar')) && !seasons.includes('EARLY_SPRING')) seasons.push('EARLY_SPRING');
  }
  if (text.includes('sommer') || text.includes('jun') || text.includes('jul') || text.includes('summer')) {
    if (!seasons.includes('SUMMER')) seasons.push('SUMMER');
  }
  if (text.includes('herbst') || text.includes('spätsommer') || text.includes('aug') || text.includes('sep') || text.includes('okt') || text.includes('autumn')) {
    if (!seasons.includes('AUTUMN')) seasons.push('AUTUMN');
  }
  if (text.includes('spätherbst bis winter') || (text.includes('winter') && !text.includes('late winter')) || text.includes('nov') || text.includes('dez')) {
    if (!seasons.includes('WINTER')) seasons.push('WINTER');
  }
  return seasons.length > 0 ? seasons : ['LATE_SPRING'];
}

/** Harvest (or, for inedible plants, bloom) seasons: explicit data first, else parsed from text. */
export function getHarvestSeasons(plant: GuildPlant): PhenoSeason[] {
  if (plant.seasonalActivity.harvestSeasons && plant.seasonalActivity.harvestSeasons.length > 0) {
    return plant.seasonalActivity.harvestSeasons;
  }
  const text = `${plant.harvestTime?.de || ''} ${plant.harvestTime?.en || ''}`.toLowerCase();
  const seasons: PhenoSeason[] = [];

  if (text.includes('nicht essbar') && !text.includes('blütezeit') && !text.includes('bloom')) {
    return seasons;
  }
  const fromMonths = seasonsFromMonths(plant.harvestTime);
  if (fromMonths.length > 0) return fromMonths;

  if (text.includes('vorfrühling') || text.includes('feb') || text.includes('jan') || (text.includes('mär') && text.includes('apr'))) {
    seasons.push('EARLY_SPRING');
  }
  if (text.includes('frühjahr') || text.includes('apr') || text.includes('mai') || text.includes('spring') || text.includes('märz bis mai')) {
    if (!seasons.includes('LATE_SPRING')) seasons.push('LATE_SPRING');
    if ((text.includes('mär') || text.includes('mar')) && !seasons.includes('EARLY_SPRING')) seasons.push('EARLY_SPRING');
  }
  if (text.includes('sommer') || text.includes('jun') || text.includes('jul') || text.includes('johannistag') || text.includes('summer')) {
    if (!seasons.includes('SUMMER')) seasons.push('SUMMER');
  }
  if (text.includes('herbst') || text.includes('spätsommer') || text.includes('aug') || text.includes('sep') || text.includes('okt') || text.includes('autumn')) {
    if (!seasons.includes('AUTUMN')) seasons.push('AUTUMN');
  }
  if (text.includes('winter') || text.includes('nov') || text.includes('dez')) {
    if (!seasons.includes('WINTER')) seasons.push('WINTER');
  }
  return seasons;
}

