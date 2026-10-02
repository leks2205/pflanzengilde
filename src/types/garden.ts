import { ClimateZone, GuildPlant, Hemisphere, Language, LocalizedString, SoilType, StarTree, TreeAgeMode } from './guild';

export type StarPlantPattern = 'SINGLE' | 'LINE' | 'GRID' | 'TRIANGLE';

export interface StarPlantClusterConfig {
  pattern: StarPlantPattern;
  count: number;              // Number of star plants in cluster (1..12)
  spacingM: number;           // Center-to-center distance in meters
  orientationDeg?: number;    // Line angle (e.g. 0° = N-S, 90° = E-W)
  gridCols?: number;          // Columns for grid layout
}

export interface ImportedGuildTemplate {
  id: string;
  sourceName: string;         // e.g. "Apfelbaum-Gilde" or file name
  starTree: StarTree;
  selectedPlantIds: string[]; // Companions configured in the imported JSON
  importedAt: string;
}

export interface GardenStarPlantInstance {
  instanceId: string;
  treeId: string;
  starTree: StarTree;
  xM: number;
  yM: number;
  customName?: string;
  selectedPlantIds?: string[]; // Custom companion plant IDs for this star tree
  clusterConfig?: StarPlantClusterConfig;
}

export interface GardenCompanionInstance {
  instanceId: string;
  plantId: string;
  plant: GuildPlant;
  xM: number;
  yM: number;
  servicingTreeIds: string[]; // IDs of star trees currently benefiting from this companion
  isMerged: boolean;          // True if shared between 2 or more star trees
  currentLightCondition: 'FULL_SUN' | 'PARTIAL_SUN' | 'FULL_SHADE';
  isKeyPestDefense?: boolean; // True if protecting against a registered star tree pest
}

export type GardenConflictType =
  | 'JUGLONE'
  | 'ALLIUM_LEGUME'
  | 'FENNEL_ALLELOPATHY'
  | 'WORMWOOD_ALLELOPATHY'
  | 'EDAPHIC_PH'
  | 'SOLANACEAE_FRUIT'
  | 'PEST_HOST'
  | 'TRUNK_COLLISION'
  | 'PEST_VULNERABILITY_GAP';

export interface GardenConflict {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  type: GardenConflictType;
  title: LocalizedString;
  description: LocalizedString;
  distanceM: number;
  requiredDistanceM: number;
  plantA: { id: string; name: LocalizedString; xM: number; yM: number };
  plantB: { id: string; name: LocalizedString; xM: number; yM: number };
  /** Literature backing the warning (same citations as the guild-level conflict); none for pure geometry. */
  sources?: string[];
}

export interface GardenShadePocket {
  id: string;
  xM: number;
  yM: number;
  radiusM: number;
  treeIds: string[];
  shadeLevel: 'DEEP_SHADE' | 'PARTIAL_SHADE';
  suggestedPlantIds: string[];
}

export interface GardenStats {
  starPlantCount: number;
  companionPlantCount: number;
  unoptimizedCompanionCount: number; // Sum of companion count if each tree had independent guild
  plantsSaved: number;
  savingsPercent: number;
  coveredRoles: number;              // 0..9 permaculture roles
  criticalConflictsCount: number;
  warningConflictsCount: number;
}

export interface GardenState {
  version: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
  soil: SoilType;
  zone: ClimateZone;
  hemisphere: Hemisphere;
  language: Language;
  starPlants: GardenStarPlantInstance[];
  placedCompanions: GardenCompanionInstance[];
  gridBoundsM: { minX: number; maxX: number; minY: number; maxY: number };
  /** Planting age (bare zone around trunks for ground covers); absent = young. */
  treeAge?: TreeAgeMode;
}
