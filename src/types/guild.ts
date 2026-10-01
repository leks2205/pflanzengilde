export type Language = 'en' | 'de';

export interface LocalizedString {
  en: string;
  de: string;
}

export type GuildRole = 
  | 'NITROGEN_FIXER'
  | 'DYNAMIC_ACCUMULATOR'
  | 'POLLINATOR_MAGNET'
  | 'PEST_REPELLER'
  | 'LIVING_MULCH'
  | 'GRASS_BARRIER'
  | 'ANTIFUNGAL'
  | 'BIOMASS_PRODUCER'
  | 'EDIBLE_UNDERSTORY';

export type PhenoSeason = 
  | 'EARLY_SPRING' 
  | 'LATE_SPRING' 
  | 'SUMMER' 
  | 'AUTUMN' 
  | 'WINTER';

export type PlantLayer = 
  | 'CANOPY'
  | 'SUB_CANOPY'
  | 'SHRUB' 
  | 'HERBACEOUS' 
  | 'GROUND_COVER' 
  | 'BULB_ROOT' 
  | 'VINE';

export type PlantingZone = 
  | 'ZONE_0_COLLAR'  // 0 - 0.3 m (Must keep bare trunk collar)
  | 'ZONE_1_BULB'    // 0.3 - 1.0 m (Grass barrier bulbs & non-competing alliums)
  | 'ZONE_2_MID'     // 1.0 - 2.5 m (Deep taproots, dynamic accumulators, living mulch)
  | 'ZONE_3_DRIP'    // 2.5 - 4.5 m (Drip line feeder root zone: shrubs, berry bushes, N-fixers)
  | 'ZONE_4_OUTER';  // 4.5+ m (Trellis vines, windbreak, outer perimeter)

export type CardinalSector = 
  | 'NORTH_SHADE'    // Northern quadrant (shade / cool / moisture)
  | 'SOUTH_SUN'      // Southern quadrant (maximum solar radiation / low herbs)
  | 'EAST_MORNING'   // Eastern quadrant (gentle morning sun / dew drying)
  | 'WEST_WIND'      // Western quadrant (afternoon heat / prevailing wind scent drift)
  | 'ANY';

export type JugloneTolerance = 'TOLERANT' | 'SENSITIVE' | 'NEUTRAL';

export type SoilType = 
  | 'LOAM'     // Balanced garden loam (40 sand / 40 silt / 20 clay), ideal benchmark
  | 'CLAY'     // Heavy clay / heavy loam (nutrient-rich, slow draining, prone to compaction)
  | 'SANDY'    // Sandy / gravelly (free-draining, warm, fast leaching, drought-prone)
  | 'CHALKY'   // Chalky / calcareous / limestone (alkaline pH > 7.5, stony, free-draining)
  | 'ACIDIC'   // Acidic / woodland / peaty (pH < 6.0, high organic matter, damp)
  | 'SILT';    // Silty alluvial (fertile, high moisture, erosion/crusting prone)

export interface SeasonalActivity {
  activeSeasons: PhenoSeason[];
  floweringSeasons: PhenoSeason[];      // Key for pollinator nectar bridge
  foliageSeasons: PhenoSeason[];        // Key for living mulch & soil armor
  chopAndDropSeasons: PhenoSeason[];    // Key for biomass organic mulch pulses
  pestDeterrenceSeasons: PhenoSeason[]; // Volatiles in active foliage vs winter rodent repellent
  plantingSeasons?: PhenoSeason[];      // Key for sowing/planting badge in phenology
  harvestSeasons?: PhenoSeason[];       // Key for harvest/bloom badge in phenology
}

export type StarPlantCategory = 
  | 'FRUIT_TREE' 
  | 'NUT_TREE' 
  | 'NITROGEN_FIXING_TREE' 
  | 'BERRY_SHRUB' 
  | 'VINE' 
  | 'PERENNIAL_HERB'
  | 'ANNUAL_HERB';

export type SunPreference = 'FULL_SUN' | 'PARTIAL_SUN' | 'FULL_SHADE';

export type ClimateZone =
  | 'BOREAL'        // Cold Temperate / Boreal / Subarctic (USDA 2–4, short season, severe freeze)
  | 'TEMPERATE'     // Temperate Oceanic & Continental (USDA 5–7, 4 distinct seasons, Central/North Europe, North America)
  | 'SUBTROPICAL'   // Subtropical / Mediterranean / Warm Temperate (USDA 8–10, mild winters, hot summers)
  | 'TROPICAL';     // Tropical / Equatorial (USDA 11–13, frost-free, humid/monsoonal)

export interface StarTree {
  id: string;
  commonName: LocalizedString;
  botanicalName: string;
  category: StarPlantCategory;
  matureRadiusM: number;          // Radius of canopy / drip line at maturity in meters
  rootHabit: 'SURFACE_FEEDER' | 'DEEP_TAP' | 'WIDE_SPREADING';
  jugloneProducer: boolean;       // Produces allelopathic juglone (e.g. Walnuts)
  sunPreference: SunPreference;   // Light level at which the sources report the best growth/yield (shade tolerance is described in the text)
  climateZones: ClimateZone[];    // Only zones the cited hardiness data supports (USDA bands as defined on ClimateZone)
  vulnerabilities: { en: string[]; de: string[] }; // Specific pests/diseases
  description: LocalizedString;
  bloomSeason: PhenoSeason;
  harvestSeason: PhenoSeason;
  color: string;
  imageUrl: string;
  preferredSoils: SoilType[];
  unsuitableSoils: SoilType[];
  soilAdvice: LocalizedString;    // Agronomic guidance for site soils
  recommendedCompanions: string[]; // IDs of GuildPlants specifically tailored to this plant's vulnerabilities
  plantingTime?: LocalizedString;  // Optimal planting window
  harvestTime?: LocalizedString;   // Typical harvest or bloom phase
  sources?: string[];              // Citations backing description and soilAdvice ("Author (Year). Title. Journal. doi:…")
}

export interface GuildPlant {
  id: string;
  commonName: LocalizedString;
  botanicalName: string;
  layer: PlantLayer;
  roles: GuildRole[];
  seasonalActivity: SeasonalActivity;
  preferredZone: PlantingZone;
  preferredSector: CardinalSector;
  jugloneTolerance: JugloneTolerance;
  climateZones: ClimateZone[];
  minDistanceM: number;               // distance from the trunk
  maxDistanceM: number;
  spreadM: number;
  heightM: number;
  perennial: boolean;
  notes: LocalizedString;
  color: string;
  iconName: string;
  imageUrl: string;
  suitableSoils: SoilType[];          // Soils where this plant thrives or grows stably
  unsuitableSoils: SoilType[];        // Soils where this plant rots, fails, or suffers severe chlorosis
  soilNotes: LocalizedString;         // Botanical soil requirement notes
  recommendedForTrees: string[];      // IDs of StarTrees where this plant is a prime companion
  plantingTime?: LocalizedString;     // Optimal planting window
  harvestTime?: LocalizedString;      // Typical harvest or bloom phase
  sources?: string[];                 // Citations backing notes and soilNotes ("Author (Year). Title. Journal. doi:…")
  /**
   * Retired from the catalogue: never offered, recommended or suggested any more. The entry stays
   * in GUILD_PLANTS only because share codes encode array indices; old share links drop it on decode,
   * while old locally saved guilds may still show it.
   */
  retired?: boolean;
}

export interface PlacedPlant {
  instanceId: string;
  plantId: string;
  plant: GuildPlant;
  angleDeg: number;       // 0 to 360 degrees (0 = North, 90 = East, 180 = South, 270 = West)
  distanceM: number;      // Distance from trunk in meters
  zone: PlantingZone;
  sector: CardinalSector;
}

export interface SeasonalGap {
  role: GuildRole;
  season: PhenoSeason;
  reason: LocalizedString;
  suggestedPlantIds: string[];
}

export interface ActiveGapFilter {
  role: GuildRole;
  season: PhenoSeason;
}

export interface ActivePestFilter {
  pestName: string;
  plantIds: string[];
}

export interface RoleCoverageReport {
  role: GuildRole;
  displayName: LocalizedString;
  description: LocalizedString;
  covered: boolean;
  plantCount: number;
  plants: GuildPlant[];
  seasonalGaps: SeasonalGap[];
}

export type Hemisphere = 'NORTHERN' | 'SOUTHERN';

export function getLoc(val: LocalizedString | string, lang: Language): string {
  if (typeof val === 'string') return val;
  return val[lang] || val.en;
}
