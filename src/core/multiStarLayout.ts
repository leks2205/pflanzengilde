import { ClimateZone, GuildPlant, Hemisphere, SoilType, StarTree } from '../types/guild';
import { GardenShadePocket, GardenStarPlantInstance, StarPlantClusterConfig, StarPlantPattern } from '../types/garden';
import { GardenResolution, resolveGardenConflicts } from './gardenOptimizer';
import { detectGardenShadePockets } from './gardenAntagonist';
import { calculateSpatialMetrics, isJugloneSensitiveStar, JUGLONE_ROOT_ZONE_M } from './placementRules';
import { PEST_HOST_CONFLICTS } from './pestHostConflicts';

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

/* ------------------------------------------------------------------------------------------------
 * Handing a cluster over to a garden that already has stars
 * ---------------------------------------------------------------------------------------------- */

/**
 * Trunk-to-trunk distance two stars should keep in a garden.
 * - `spacingM`: no trunk collision (same threshold as TRUNK_COLLISION) and at least the recommended
 *   spacing of either star, so canopies at most touch.
 * - `ruleM`: additionally the star–star rule distances of the garden analysis (walnut juglone root
 *   zone next to a sensitive star, internal pest/pathogen host stars, e.g. elder next to cherry).
 */
export function getRequiredStarDistanceM(a: StarTree, b: StarTree): { spacingM: number; ruleM: number } {
  const spacingM = Math.max(
    1.5,
    (a.matureRadiusM + b.matureRadiusM) * 0.4,
    getRecommendedSpacingM(a).optimal,
    getRecommendedSpacingM(b).optimal
  );
  let ruleM = spacingM;
  if ((a.jugloneProducer && isJugloneSensitiveStar(b)) || (b.jugloneProducer && isJugloneSensitiveStar(a))) {
    ruleM = Math.max(ruleM, JUGLONE_ROOT_ZONE_M);
  }
  for (const spec of PEST_HOST_CONFLICTS) {
    if (spec.kind !== 'INTERNAL') continue;
    if (
      (spec.starTreeIds.includes(a.id) && spec.hostStarIds.includes(b.id)) ||
      (spec.starTreeIds.includes(b.id) && spec.hostStarIds.includes(a.id))
    ) {
      ruleM = Math.max(ruleM, spec.safeDistanceM);
    }
  }
  return { spacingM, ruleM };
}

interface LatticeOffset { i: number; j: number; d2: number }
let latticeCache: { maxK: number; offsets: LatticeOffset[] } = { maxK: 0, offsets: [] };

/**
 * Lattice offsets (i, j) != (0, 0) within radius maxK, nearest first; ties go east, then south (+y),
 * north, west. Cached: the list only depends on maxK, and a longer list serves every smaller radius.
 */
function latticeOffsetsByDistance(maxK: number): LatticeOffset[] {
  if (latticeCache.maxK >= maxK) return latticeCache.offsets;
  const offsets: Array<LatticeOffset & { ang: number }> = [];
  for (let i = -maxK; i <= maxK; i++) {
    for (let j = -maxK; j <= maxK; j++) {
      if (i === 0 && j === 0) continue;
      const d2 = i * i + j * j;
      if (d2 > maxK * maxK) continue;
      offsets.push({ i, j, d2, ang: Math.abs(Math.atan2(j, i)) + (j < 0 ? 1e-6 : 0) });
    }
  }
  offsets.sort((x, y) => x.d2 - y.d2 || x.ang - y.ang);
  latticeCache = { maxK, offsets };
  return offsets;
}

export interface ClusterPlacementOptions {
  /** Lattice step of the offset search in metres (default 0.5; coarser for very large gardens). */
  stepM?: number;
  /** Extra gap added to every required star distance (default 0). */
  clearanceM?: number;
}

export interface ClusterPlacement {
  /**
   * The new stars, translated as one rigid block (relative layout unchanged; positions rounded to cm).
   * An instance id already used in the garden gets a suffix (-2, -3, ...).
   */
  starPlants: GardenStarPlantInstance[];
  /** Translation applied to every new star, in metres (multiples of the search step). */
  offsetM: { dx: number; dy: number };
  /** True if the block had to be moved (the garden already had stars in the way). */
  moved: boolean;
  /** True if at least one instance id had to be changed (suffix -2, -3, ...) to stay unique. */
  renamed: boolean;
}

/**
 * Where a handed-over cluster goes in a garden that already has stars: the smallest translation
 * (searched on a lattice; ties go east, then south, then north, then west; a straight shift is
 * preferred if at most ~10 % longer) such that every new star keeps
 * getRequiredStarDistanceM(...).ruleM (+ clearance) from every existing star. The cluster is moved as
 * a rigid block, so its relative layout - and, while no existing star is within
 * getStarInteractionRangeM, its companion layout - matches the radial preview. An empty garden, or one
 * whose stars already keep their distance, leaves the cluster where it is (offset 0).
 * Pure; neither input is mutated.
 */
export function placeClusterInGarden(
  existingStars: readonly GardenStarPlantInstance[],
  newStars: readonly GardenStarPlantInstance[],
  options: ClusterPlacementOptions = {}
): ClusterPlacement {
  const clearance = Math.max(0, options.clearanceM ?? 0);
  // Instance ids must stay unique in the garden (e.g. two hand-overs stamped in the same millisecond)
  const takenIds = new Set(existingStars.map(t => t.instanceId));
  const uniqueIds = newStars.map(t => {
    let id = t.instanceId;
    for (let n = 2; takenIds.has(id); n++) id = `${t.instanceId}-${n}`;
    takenIds.add(id);
    return id;
  });
  const renamed = uniqueIds.some((id, k) => id !== newStars[k].instanceId);
  const copy = (dx: number, dy: number): GardenStarPlantInstance[] =>
    newStars.map((t, k) => ({
      ...t,
      instanceId: uniqueIds[k],
      selectedPlantIds: t.selectedPlantIds ? [...t.selectedPlantIds] : t.selectedPlantIds,
      xM: Number((t.xM + dx).toFixed(2)),
      yM: Number((t.yM + dy).toFixed(2)),
    }));
  if (existingStars.length === 0 || newStars.length === 0) {
    return { starPlants: copy(0, 0), offsetM: { dx: 0, dy: 0 }, moved: false, renamed };
  }

  // Required distance per (new, existing) pair, cached by species
  const reqCache = new Map<string, number>();
  const required = (a: StarTree, b: StarTree): number => {
    const key = `${a.id}|${b.id}`;
    let v = reqCache.get(key);
    if (v === undefined) {
      v = getRequiredStarDistanceM(a, b).ruleM + clearance;
      reqCache.set(key, v);
    }
    return v;
  };
  const fits = (dx: number, dy: number): boolean => {
    for (const n of newStars) {
      const x = n.xM + dx;
      const y = n.yM + dy;
      for (const e of existingStars) {
        if (Math.hypot(x - e.xM, y - e.yM) < required(n.starTree, e.starTree) - 1e-9) return false;
      }
    }
    return true;
  };
  if (fits(0, 0)) return { starPlants: copy(0, 0), offsetM: { dx: 0, dy: 0 }, moved: false, renamed };

  // Beyond this radius every pair is far enough apart, so the search always finds an offset
  const reachNew = Math.max(...newStars.map(t => Math.hypot(t.xM, t.yM)));
  const reachExisting = Math.max(...existingStars.map(t => Math.hypot(t.xM, t.yM)));
  let maxReq = 0;
  for (const n of newStars) for (const e of existingStars) maxReq = Math.max(maxReq, required(n.starTree, e.starTree));
  const bound = reachNew + reachExisting + maxReq;
  // Lattice search, nearest first. Smallest fitting offset; a straight east/west/north/south shift
  // wins if it is at most ~10 % + 1 m longer, so a second row lines up with the first instead of
  // sitting 1.5 m askew.
  const search = (step: number, maxK: number): { dx: number; dy: number } | null => {
    const candidates = latticeOffsetsByDistance(maxK);
    let best: { i: number; j: number; d2: number } | null = null;
    for (const c of candidates) {
      if (c.d2 > maxK * maxK) break;
      if (best) {
        if (best.i === 0 || best.j === 0) break;
        if (Math.sqrt(c.d2) * step > Math.sqrt(best.d2) * step * 1.1 + 1) break;
        if ((c.i === 0 || c.j === 0) && fits(c.i * step, c.j * step)) {
          best = c;
          break;
        }
        continue;
      }
      if (fits(c.i * step, c.j * step)) best = c;
    }
    return best ? { dx: Number((best.i * step).toFixed(2)), dy: Number((best.j * step).toFixed(2)) } : null;
  };
  const baseStep = options.stepM && options.stepM > 0 ? Math.max(0.5, Math.round(options.stepM / 0.5) * 0.5) : 0.5;
  // Fine pass within 80 m (covers almost every garden); coarse pass (<= ~100 rings) beyond that
  const FINE_RADIUS_M = 80;
  let found = search(baseStep, Math.ceil(Math.min(bound, FINE_RADIUS_M) / baseStep) + 1);
  let step = baseStep;
  if (!found && bound > FINE_RADIUS_M) {
    step = Math.max(baseStep, Math.ceil(bound / 100 / 0.5) * 0.5);
    found = search(step, Math.ceil(bound / step) + 1);
  }
  if (found) {
    return { starPlants: copy(found.dx, found.dy), offsetM: found, moved: true, renamed };
  }

  // Unreachable by construction; keep a safe fallback east of everything
  const dx = Number((Math.ceil((reachNew + reachExisting + maxReq) / step) * step + step).toFixed(2));
  return { starPlants: copy(dx, 0), offsetM: { dx, dy: 0 }, moved: true, renamed };
}

/**
 * The garden after a hand-over: `existingStars` followed by the placed cluster
 * (placeClusterInGarden). This is exactly what GardenPlannerPage stores. Pure.
 */
export function appendClusterToGarden(
  existingStars: readonly GardenStarPlantInstance[],
  newStars: readonly GardenStarPlantInstance[],
  options: ClusterPlacementOptions = {}
): { starPlants: GardenStarPlantInstance[]; placement: ClusterPlacement } {
  const placement = placeClusterInGarden(existingStars, newStars, options);
  return { starPlants: [...existingStars, ...placement.starPlants], placement };
}
