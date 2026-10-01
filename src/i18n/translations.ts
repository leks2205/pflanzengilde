import { 
  Language, 
  GuildRole, 
  PlantLayer, 
  PlantingZone, 
  CardinalSector, 
  PhenoSeason, 
  JugloneTolerance,
  StarPlantCategory,
  ClimateZone
} from '../types/guild';
import { en } from './en';
import { de } from './de';

const TRANSLATIONS = {
  en,
  de
};

export function t(lang: Language): typeof en {
  return TRANSLATIONS[lang] || en;
}

export function translateRole(role: GuildRole | string, lang: Language): string {
  const dict = t(lang);
  switch (role) {
    case 'NITROGEN_FIXER': return dict.roleNitrogenFixer;
    case 'DYNAMIC_ACCUMULATOR': return dict.roleDynamicAccumulator;
    case 'POLLINATOR_MAGNET': return dict.rolePollinatorMagnet;
    case 'PEST_REPELLER': return dict.rolePestRepeller;
    case 'LIVING_MULCH': return dict.roleLivingMulch;
    case 'GRASS_BARRIER': return dict.roleGrassBarrier;
    case 'ANTIFUNGAL': return dict.roleAntifungal;
    case 'BIOMASS_PRODUCER': return dict.roleBiomassProducer;
    case 'EDIBLE_UNDERSTORY': return dict.roleEdibleUnderstory;
    default: return role.replace(/_/g, ' ');
  }
}

export function translateLayer(layer: PlantLayer | string, lang: Language): string {
  const dict = t(lang);
  switch (layer) {
    case 'CANOPY': return dict.layerCanopy;
    case 'SUB_CANOPY': return dict.layerSubCanopy;
    case 'SHRUB': return dict.layerShrub;
    case 'HERBACEOUS': return dict.layerHerbaceous;
    case 'GROUND_COVER': return dict.layerGroundCover;
    case 'BULB_ROOT': return dict.layerBulbRoot;
    case 'VINE': return dict.layerVine;
    default: return layer.replace(/_/g, ' ');
  }
}

export function translateZone(zone: PlantingZone | string, lang: Language): string {
  const dict = t(lang);
  switch (zone) {
    case 'ZONE_0_COLLAR': return dict.zoneCollar;
    case 'ZONE_1_BULB': return dict.zoneBulb;
    case 'ZONE_2_MID': return dict.zoneMid;
    case 'ZONE_3_DRIP': return dict.zoneDrip;
    case 'ZONE_4_OUTER': return dict.zoneOuter;
    default: return zone.replace(/_/g, ' ');
  }
}

export function translateSector(sector: CardinalSector | string, lang: Language): string {
  const dict = t(lang);
  switch (sector) {
    case 'NORTH_SHADE': return dict.sectorNorth;
    case 'SOUTH_SUN': return dict.sectorSouth;
    case 'EAST_MORNING': return dict.sectorEast;
    case 'WEST_WIND': return dict.sectorWest;
    case 'ANY': return dict.sectorAny;
    default: return sector.replace(/_/g, ' ');
  }
}

export function translateSeason(season: PhenoSeason | string, lang: Language): string {
  const dict = t(lang);
  switch (season) {
    case 'EARLY_SPRING': return dict.seasonEarlySpring;
    case 'LATE_SPRING': return dict.seasonLateSpring;
    case 'SUMMER': return dict.seasonSummer;
    case 'AUTUMN': return dict.seasonAutumn;
    case 'WINTER': return dict.seasonWinter;
    default: return season.replace(/_/g, ' ');
  }
}

export function translateSun(sun: string, lang: Language): string {
  const dict = t(lang);
  switch (sun) {
    case 'FULL_SUN': return dict.sunFull;
    case 'PARTIAL_SUN': return dict.sunPartial;
    case 'FULL_SHADE': return dict.sunShade;
    default: return sun.replace(/_/g, ' ');
  }
}

export function translateStarCategory(category: StarPlantCategory | string, lang: Language): string {
  const dict = t(lang);
  switch (category) {
    case 'FRUIT_TREE': return dict.catFruitTree;
    case 'NUT_TREE': return dict.catNutTree;
    case 'NITROGEN_FIXING_TREE': return dict.catNFixer;
    case 'BERRY_SHRUB': return dict.catBerryShrub;
    case 'VINE': return dict.catVine;
    case 'PERENNIAL_HERB': return dict.catPerennialHerb;
    case 'ANNUAL_HERB': return dict.catAnnualHerb;
    default: return category.replace(/_/g, ' ');
  }
}

export function translateRootHabit(root: string, lang: Language): string {
  const dict = t(lang);
  switch (root) {
    case 'SURFACE_FEEDER': return dict.rootSurface;
    case 'DEEP_TAP': return dict.rootDeep;
    case 'WIDE_SPREADING': return dict.rootWide;
    default: return root.replace(/_/g, ' ');
  }
}

export function translateJuglone(juglone: JugloneTolerance | string, lang: Language): string {
  const dict = t(lang);
  switch (juglone) {
    case 'TOLERANT': return dict.jugloneTolerant;
    case 'SENSITIVE': return dict.jugloneSensitive;
    case 'NEUTRAL': return dict.jugloneNeutral;
    default: return juglone.replace(/_/g, ' ');
  }
}

export function translateClimateZone(zone: ClimateZone | string, lang: Language): string {
  const dict = t(lang);
  switch (zone) {
    case 'BOREAL': return dict.zoneBoreal;
    case 'TEMPERATE': return dict.zoneTemperate;
    case 'SUBTROPICAL': return dict.zoneSubtropical;
    case 'TROPICAL': return dict.zoneTropical;
    default: return zone.replace(/_/g, ' ');
  }
}

/** Fixed-decimal number in the language's convention: comma for German, dot for English. */
export function formatNumber(value: number, digits: number, lang: Language): string {
  const s = value.toFixed(digits);
  return lang === 'de' ? s.replace('.', ',') : s;
}
