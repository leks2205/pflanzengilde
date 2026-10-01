import { GuildPlant, GuildRole, LocalizedString, PhenoSeason, SeasonalGap, StarTree } from '../types/guild';
import { getCompanionPestDefenseForTree } from './pestCompanionEngine';
import { GUILD_PLANTS } from '../data/guildPlants';

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
      en: 'Peak solar energy, fruit sizing, heat stress, moisture conservation critical.',
      de: 'Maximale Sonneneinstrahlung, Fruchtreife, Hitzestress, Feuchtigkeitsschutz essenziell.'
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
      en: 'Canopy dormant, bare soil vulnerable to erosion, subterranean rodent bark damage.',
      de: 'Baumkrone ruht, offener Boden frost- und erosionsgefährdet, Wühlmausgefahr an Rinde.'
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

export function analyzeSeasonalRoleGaps(selectedPlants: GuildPlant[]): RoleSeasonalStatus[] {
  const selectedIds = new Set(selectedPlants.map(p => p.id));
  const notSelected = (id: string) => !selectedIds.has(id);
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
            let reason: LocalizedString = { en: '', de: '' };
            let candidates: string[] = [];

            if (season === 'EARLY_SPRING') {
              reason = {
                en: 'Early Spring Hunger Gap: Emerging queen bumblebees and solitary bees face starvation before main crops bloom, threatening early pollination.',
                de: 'Vorfrühlings-Hungerlücke: Erwachende Hummelköniginnen und Wildbienen finden vor der Obstbaumblüte keine Nahrung, was die spätere Bestäubung gefährdet.'
              };
              candidates = ['plant-crocus', 'plant-snowdrop', 'plant-dandelion', 'plant-chives'];
            } else if (season === 'LATE_SPRING') {
              reason = {
                en: 'Late Spring Blossom Gap: Companion flowers needed to sustain pollinators while fruit trees are in bloom.',
                de: 'Blütenlücke im Spätfrühling: Begleitblüten fehlen, um Bestäuber während der Obstblüte verlässlich im System zu halten.'
              };
              candidates = ['plant-comfrey', 'plant-white-clover', 'plant-borage', 'plant-chives'];
            } else if (season === 'SUMMER') {
              reason = {
                en: 'High Summer Nectar Gap: Peak beneficial predator populations (parasitic wasps, hoverflies) need nectar to control pests.',
                de: 'Hochsommer-Nektarlücke: Nützlingsinsekten (Schlupfwespen, Schwebfliegen) benötigen dringend Nektar zur biologischen Schädlingskontrolle.'
              };
              candidates = ['plant-yarrow', 'plant-lavender', 'plant-fennel', 'plant-nasturtium'];
            } else if (season === 'AUTUMN') {
              reason = {
                en: 'Autumn Storage Gap: Bees require late-season nectar to store honey reserves before winter frost.',
                de: 'Herbst-Versorgungslücke: Spättracht fehlt, damit Bienen und Schmetterlinge lebenswichtige Winterreserven anlegen können.'
              };
              candidates = ['plant-sedum', 'plant-aster', 'plant-white-clover'];
            }

            gaps.push({
              role,
              season,
              reason,
              suggestedPlantIds: candidates.filter(notSelected)
            });
          }
        }
      } else if (role === 'LIVING_MULCH') {
        if (!seasonCoverage['WINTER'].covered) {
          gaps.push({
            role,
            season: 'WINTER',
            reason: {
              en: 'Winter Soil Armor Gap: Current ground covers collapse after frost, leaving bare soil vulnerable to winter rain erosion and weed invasion.',
              de: 'Bodenpanzer-Winterlücke: Das Laub zieht bei Frost ein. Unbedeckter Boden ist winterlicher Nährstoffauswaschung, Verdichtung und Unkrautkeimung ausgesetzt.'
            },
            suggestedPlantIds: ['plant-thyme', 'plant-white-clover', 'plant-woodruff', 'plant-bugleweed'].filter(notSelected)
          });
        }
      } else if (role === 'GRASS_BARRIER') {
        if (!seasonCoverage['SUMMER'].covered) {
          gaps.push({
            role,
            season: 'SUMMER',
            reason: {
              en: 'Summer Grass Encroachment Gap: Spring bulbs go dormant by midsummer. Fibrous perennial companions are needed to block summer grass rhizomes.',
              de: 'Grasbarriere-Sommerlücke: Frühjahrszwiebeln ziehen im Juni ein. Ausdauernde Horste werden benötigt, um kriechende Rasengräser im Sommer aufzuhalten.'
            },
            suggestedPlantIds: ['plant-chives', 'plant-bugleweed', 'plant-strawberry'].filter(notSelected)
          });
        }
      } else if (role === 'PEST_REPELLER') {
        if (!seasonCoverage['WINTER'].covered) {
          gaps.push({
            role,
            season: 'WINTER',
            reason: {
              en: 'Winter Rodent Bark Defense Gap: Voles and rabbits gnaw tree bark beneath snow. Persistent aromatic or subterranean barriers are needed.',
              de: 'Winterliche Nagerschutz-Lücke: Wühlmäuse und Kaninchen benagen die Baumrinde unter der Schneedecke. Wintergrüne Duftpflanzen oder Zwiebelschutzbarrieren fehlen.'
            },
            suggestedPlantIds: ['plant-southernwood', 'plant-garlic', 'plant-daffodil', 'plant-thyme'].filter(notSelected)
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

export function getSuggestedPlantsForGap(suggestedIds: string[]): GuildPlant[] {
  return GUILD_PLANTS.filter(p => suggestedIds.includes(p.id));
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
      const candidateReplacements = GUILD_PLANTS.filter(candidate => {
        if (selectedIds.has(candidate.id)) return false;
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

