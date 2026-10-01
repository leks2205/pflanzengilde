import { ClimateZone, GuildPlant, Hemisphere, SoilType, StarTree } from '../types/guild';
import { GardenShadePocket, GardenStarPlantInstance, StarPlantClusterConfig, StarPlantPattern } from '../types/garden';
import { GardenResolution, resolveGardenConflicts } from './gardenOptimizer';
import { detectGardenShadePockets } from './gardenAntagonist';
import { calculateSpatialMetrics } from './placementRules';

export interface RelativePoint {
  index: number;
  dxM: number;
  dyM: number;
}

export interface MultiStarLayoutResult {
  pattern: StarPlantPattern;
  count: number;
  spacingM: number;
  treePoints: RelativePoint[];
  recommendedSpacingM: number;
  minSpacingM: number;
  widthM: number;
  heightM: number;
}

/**
 * Smallest trunk-to-trunk distance between two identical stars that the garden conflict analysis
 * accepts (same threshold as the TRUNK_COLLISION rule in analyzeGardenAntagonisms).
 */
export function getMinTrunkDistanceM(starTree: StarTree): number {
  return Math.max(1.5, starTree.matureRadiusM * 2 * 0.4);
}

/**
 * Inter-tree spacing from the mature diameter, so canopies just touch at maturity. Never below the
 * garden's minimum trunk distance, so the recommended spacing never triggers a trunk collision.
 */
export function getRecommendedSpacingM(starTree: StarTree): { min: number; optimal: number; max: number } {
  const diameter = starTree.matureRadiusM * 2;
  const minTrunk = getMinTrunkDistanceM(starTree);
  const min = Math.max(minTrunk, Number((diameter * 0.75).toFixed(1)));
  const optimal = Math.max(minTrunk, 1.2, Number((diameter * 0.95).toFixed(1)));
  const max = Math.max(1.8, optimal, Number((diameter * 1.3).toFixed(1)));
  return { min, optimal, max };
}

/** Metric offsets centred on (0, 0) for N identical star plants. */
export function generateStarPlantCoordinates(
  starTree: StarTree,
  config: StarPlantClusterConfig
): MultiStarLayoutResult {
  const { pattern, count, spacingM } = config;
  const recommended = getRecommendedSpacingM(starTree);
  const spacing = spacingM > 0 ? spacingM : recommended.optimal;
  const orientationRad = (((config.orientationDeg ?? 90) - 90) * Math.PI) / 180; // 90° = E-W default

  const points: RelativePoint[] = [];

  if (count <= 1 || pattern === 'SINGLE') {
    points.push({ index: 0, dxM: 0, dyM: 0 });
    return {
      pattern: 'SINGLE',
      count: 1,
      spacingM: spacing,
      treePoints: points,
      recommendedSpacingM: recommended.optimal,
      minSpacingM: recommended.min,
      widthM: starTree.matureRadiusM * 2,
      heightM: starTree.matureRadiusM * 2,
    };
  }

  if (pattern === 'LINE') {
    for (let i = 0; i < count; i++) {
      const offset = (i - (count - 1) / 2) * spacing;
      const dxM = Number((offset * Math.cos(orientationRad)).toFixed(2));
      const dyM = Number((offset * Math.sin(orientationRad)).toFixed(2));
      points.push({ index: i, dxM, dyM });
    }
  } else if (pattern === 'GRID') {
    const cols = config.gridCols && config.gridCols > 0
      ? config.gridCols
      : Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);

    let idx = 0;
    for (let r = 0; r < rows && idx < count; r++) {
      for (let c = 0; c < cols && idx < count; c++) {
        const xOffset = (c - (cols - 1) / 2) * spacing;
        const yOffset = (r - (rows - 1) / 2) * spacing;
        points.push({
          index: idx,
          dxM: Number(xOffset.toFixed(2)),
          dyM: Number(yOffset.toFixed(2)),
        });
        idx++;
      }
    }
  } else if (pattern === 'TRIANGLE') {
    if (count === 3) {
      // Equilateral triangle centered at (0,0)
      const r = spacing / Math.sqrt(3);
      for (let i = 0; i < 3; i++) {
        const angle = orientationRad + (i * 2 * Math.PI) / 3;
        points.push({
          index: i,
          dxM: Number((r * Math.cos(angle)).toFixed(2)),
          dyM: Number((r * Math.sin(angle)).toFixed(2)),
        });
      }
    } else {
      // Hexagonal / staggered close packing
      const cols = Math.ceil(Math.sqrt(count));
      const rowHeight = spacing * (Math.sqrt(3) / 2);
      const rows = Math.ceil(count / cols);

      let idx = 0;
      for (let r = 0; r < rows && idx < count; r++) {
        const rowShift = (r % 2 === 1) ? spacing * 0.5 : 0;
        for (let c = 0; c < cols && idx < count; c++) {
          const xOffset = (c - (cols - 1) / 2) * spacing + rowShift;
          const yOffset = (r - (rows - 1) / 2) * rowHeight;
          points.push({
            index: idx,
            dxM: Number(xOffset.toFixed(2)),
            dyM: Number(yOffset.toFixed(2)),
          });
          idx++;
        }
      }
    }
  }

  const xs = points.map(p => p.dxM);
  const ys = points.map(p => p.dyM);
  const minX = Math.min(...xs) - starTree.matureRadiusM;
  const maxX = Math.max(...xs) + starTree.matureRadiusM;
  const minY = Math.min(...ys) - starTree.matureRadiusM;
  const maxY = Math.max(...ys) + starTree.matureRadiusM;

  return {
    pattern,
    count,
    spacingM: spacing,
    treePoints: points,
    recommendedSpacingM: recommended.optimal,
    minSpacingM: recommended.min,
    widthM: Number((maxX - minX).toFixed(2)),
    heightM: Number((maxY - minY).toFixed(2)),
  };
}

/* ------------------------------------------------------------------------------------------------
 * Multi-star cluster = a small garden
 *
 * The radial plan's multi-star mode and "Open in garden grid" both build the same star instances
 * and run the garden pipeline (resolveGardenConflicts: optimizeGardenCompanions + garden conflict
 * analysis + automatic substitution), so the radial preview and the garden show the same layout.
 * ---------------------------------------------------------------------------------------------- */

/** Instance id of star `index` of a cluster. Same scheme for the radial preview and the garden. */
export function clusterStarInstanceId(starTree: StarTree, idStamp: string, index: number): string {
  return `star-tree-${starTree.id}-${idStamp}-${index}`;
}

/**
 * Garden star instances for a cluster: positions from generateStarPlantCoordinates, every instance
 * with the guild's companion ids. `idStamp` only makes the ids unique (the layout depends on
 * positions and plant ids, and the id scheme keeps all id-based tie-breaks identical).
 */
export function buildClusterStarInstances(
  starTree: StarTree,
  config: StarPlantClusterConfig,
  selectedPlantIds: readonly string[],
  idStamp = 'radial'
): GardenStarPlantInstance[] {
  const layout = generateStarPlantCoordinates(starTree, config);
  return layout.treePoints.map(pt => ({
    instanceId: clusterStarInstanceId(starTree, idStamp, pt.index),
    treeId: starTree.id,
    starTree,
    xM: pt.dxM,
    yM: pt.dyM,
    selectedPlantIds: [...selectedPlantIds],
  }));
}

export interface ClusterGardenOptions {
  hemisphere?: Hemisphere;
  zone?: ClimateZone;
  soil?: SoilType;
  /** Automatic conflict resolution (GardenPlannerPage default: on). */
  autoResolve?: boolean;
  allGuildPlants?: GuildPlant[];
  idStamp?: string;
}

export interface ClusterGardenLayout {
  layout: MultiStarLayoutResult;
  starPlants: GardenStarPlantInstance[];
  /** Exactly what GardenPlannerPage computes for these instances (companions, stats, conflicts, swaps). */
  resolution: GardenResolution;
  shadePockets: GardenShadePocket[];
  /** Extent of canopies, companion spreads and zone rings, in metres. */
  boundsM: { minX: number; maxX: number; minY: number; maxY: number };
}

/**
 * Layout of N identical stars with the garden pipeline. This is what the radial plan renders in
 * multi-star mode; App.handleOpenInGardenGrid places the same instances in the garden.
 */
export function computeClusterGardenLayout(
  starTree: StarTree,
  config: StarPlantClusterConfig,
  selectedPlantIds: readonly string[],
  options: ClusterGardenOptions = {}
): ClusterGardenLayout {
  const layout = generateStarPlantCoordinates(starTree, config);
  const starPlants = buildClusterStarInstances(starTree, config, selectedPlantIds, options.idStamp);
  const resolution = resolveGardenConflicts(starPlants, {
    ...(options.allGuildPlants ? { allGuildPlants: options.allGuildPlants } : {}),
    hemisphere: options.hemisphere ?? 'NORTHERN',
    zone: options.zone,
    soil: options.soil,
    enabled: options.autoResolve ?? true,
  });
  const shadePockets = detectGardenShadePockets(starPlants);

  // Per-star zone rings reach the outer edge of the drip zone
  const treeReach = Math.max(starTree.matureRadiusM, calculateSpatialMetrics(starTree).dripZoneOuterM);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const grow = (x: number, y: number, r: number) => {
    minX = Math.min(minX, x - r); maxX = Math.max(maxX, x + r);
    minY = Math.min(minY, y - r); maxY = Math.max(maxY, y + r);
  };
  for (const t of starPlants) grow(t.xM, t.yM, treeReach);
  for (const c of resolution.companions) grow(c.xM, c.yM, Math.max(0.3, c.plant.spreadM / 2));

  return {
    layout,
    starPlants,
    resolution,
    shadePockets,
    boundsM: {
      minX: Number(minX.toFixed(2)),
      maxX: Number(maxX.toFixed(2)),
      minY: Number(minY.toFixed(2)),
      maxY: Number(maxY.toFixed(2)),
    },
  };
}
