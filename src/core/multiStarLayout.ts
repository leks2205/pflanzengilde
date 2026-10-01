import { GuildPlant, Hemisphere, StarTree } from '../types/guild';
import { StarPlantClusterConfig, StarPlantPattern } from '../types/garden';

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

/** Inter-tree spacing from the mature diameter, so canopies just touch at maturity. */
export function getRecommendedSpacingM(starTree: StarTree): { min: number; optimal: number; max: number } {
  const diameter = starTree.matureRadiusM * 2;
  const min = Math.max(1.0, Number((diameter * 0.75).toFixed(1)));
  const optimal = Math.max(1.2, Number((diameter * 0.95).toFixed(1)));
  const max = Math.max(1.8, Number((diameter * 1.3).toFixed(1)));
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

export interface ClusterCompanionResult {
  plantId: string;
  plant: GuildPlant;
  dxM: number;
  dyM: number;
  servicingTreeIndices: number[];
  isMerged: boolean;
  roleCategory: 'INSECTARY' | 'NITROGEN_MULCH' | 'PERIMETER_BARRIER' | 'DYNAMIC_ACCUMULATOR' | 'SENTINEL_REPELLER';
}

/**
 * Companion positions for a multi-tree cluster, shared where possible instead of 1:1 per tree:
 * insectaries between 2-3 trees, N-fixers/mulch between neighbours, barriers on the perimeter.
 */
export function generateClusterCompanions(
  starTree: StarTree,
  selectedPlants: GuildPlant[],
  cluster: MultiStarLayoutResult,
  hemisphere: Hemisphere = 'NORTHERN'
): {
  companions: ClusterCompanionResult[];
  unoptimizedCount: number;
  optimizedCount: number;
  savingsPercent: number;
} {
  const { count, treePoints } = cluster;
  const companions: ClusterCompanionResult[] = [];
  const unoptimizedCount = count * selectedPlants.length;

  if (count <= 1 || treePoints.length <= 1) {
    const r = Math.max(1.0, starTree.matureRadiusM * 0.7);
    selectedPlants.forEach((p, idx) => {
      const angle = (idx * (360 / Math.max(1, selectedPlants.length)) * Math.PI) / 180;
      companions.push({
        plantId: p.id,
        plant: p,
        dxM: Number((r * Math.sin(angle)).toFixed(2)),
        dyM: Number((-r * Math.cos(angle)).toFixed(2)),
        servicingTreeIndices: [0],
        isMerged: false,
        roleCategory: 'SENTINEL_REPELLER'
      });
    });

    return {
      companions,
      unoptimizedCount,
      optimizedCount: companions.length,
      savingsPercent: 0,
    };
  }

  // Each plant gets exactly one primary role
  const insectaryPlants: GuildPlant[] = [];
  const nitrogenAndMulchPlants: GuildPlant[] = [];
  const dynamicAccumulators: GuildPlant[] = [];
  const grassBarriers: GuildPlant[] = [];
  const repellers: GuildPlant[] = [];
  const otherPlants: GuildPlant[] = [];

  selectedPlants.forEach(p => {
    if (p.roles.includes('POLLINATOR_MAGNET') || p.botanicalName.includes('Achillea') || p.botanicalName.includes('Foeniculum')) {
      insectaryPlants.push(p);
    } else if (p.roles.includes('NITROGEN_FIXER') || p.roles.includes('LIVING_MULCH') || p.roles.includes('BIOMASS_PRODUCER')) {
      nitrogenAndMulchPlants.push(p);
    } else if (p.roles.includes('DYNAMIC_ACCUMULATOR')) {
      dynamicAccumulators.push(p);
    } else if (p.roles.includes('GRASS_BARRIER') || p.layer === 'BULB_ROOT') {
      grassBarriers.push(p);
    } else if (p.roles.includes('PEST_REPELLER') || p.roles.includes('ANTIFUNGAL')) {
      repellers.push(p);
    } else {
      otherPlants.push(p);
    }
  });

  // Insectaries: one station per 2-3 trees
  insectaryPlants.forEach(plant => {
    const stationsNeeded = Math.max(1, Math.ceil(count / 2.5));
    const step = Math.max(1, Math.floor(treePoints.length / stationsNeeded));

    for (let s = 0; s < stationsNeeded; s++) {
      const idxA = (s * step) % treePoints.length;
      const idxB = Math.min(treePoints.length - 1, idxA + 1);
      const ptA = treePoints[idxA];
      const ptB = treePoints[idxB];

      const sunOffset = (hemisphere === 'NORTHERN' ? 0.6 : -0.6);
      const dxM = Number(((ptA.dxM + ptB.dxM) / 2).toFixed(2));
      const dyM = Number(((ptA.dyM + ptB.dyM) / 2 + sunOffset).toFixed(2));

      companions.push({
        plantId: plant.id,
        plant,
        dxM,
        dyM,
        servicingTreeIndices: idxA === idxB ? [idxA] : [idxA, idxB],
        isMerged: idxA !== idxB,
        roleCategory: 'INSECTARY'
      });
    }
  });

  // N-fixers and living mulch between neighbouring trees
  nitrogenAndMulchPlants.forEach(plant => {
    for (let i = 0; i < treePoints.length - 1; i++) {
      const ptA = treePoints[i];
      const ptB = treePoints[i + 1];
      companions.push({
        plantId: plant.id,
        plant,
        dxM: Number(((ptA.dxM + ptB.dxM) / 2).toFixed(2)),
        dyM: Number(((ptA.dyM + ptB.dyM) / 2).toFixed(2)),
        servicingTreeIndices: [i, i + 1],
        isMerged: true,
        roleCategory: 'NITROGEN_MULCH'
      });
    }
  });

  // Dynamic accumulators on the shaded side, one per two trees
  dynamicAccumulators.forEach(plant => {
    const stationsNeeded = Math.max(1, Math.ceil(count / 2));
    for (let i = 0; i < stationsNeeded; i++) {
      const ptIdx = Math.min(treePoints.length - 1, i * 2);
      const pt = treePoints[ptIdx];
      const shadeOffset = (hemisphere === 'NORTHERN' ? -starTree.matureRadiusM * 0.75 : starTree.matureRadiusM * 0.75);
      companions.push({
        plantId: plant.id,
        plant,
        dxM: Number(pt.dxM.toFixed(2)),
        dyM: Number((pt.dyM + shadeOffset).toFixed(2)),
        servicingTreeIndices: [ptIdx],
        isMerged: false,
        roleCategory: 'DYNAMIC_ACCUMULATOR'
      });
    }
  });

  // Grass barriers at both ends of the formation (and mid-row for 3+)
  grassBarriers.forEach(plant => {
    const r = Math.max(0.6, starTree.matureRadiusM * 0.45);
    const sunSide = hemisphere === 'NORTHERN' ? r : -r;

    const ptFirst = treePoints[0];
    const ptLast = treePoints[treePoints.length - 1];

    companions.push({
      plantId: plant.id,
      plant,
      dxM: Number((ptFirst.dxM - r).toFixed(2)),
      dyM: Number(ptFirst.dyM.toFixed(2)),
      servicingTreeIndices: [0],
      isMerged: false,
      roleCategory: 'PERIMETER_BARRIER'
    });

    if (treePoints.length > 1) {
      companions.push({
        plantId: plant.id,
        plant,
        dxM: Number((ptLast.dxM + r).toFixed(2)),
        dyM: Number(ptLast.dyM.toFixed(2)),
        servicingTreeIndices: [treePoints.length - 1],
        isMerged: false,
        roleCategory: 'PERIMETER_BARRIER'
      });
    }

    if (treePoints.length >= 3) {
      const midIdx = Math.floor(treePoints.length / 2);
      const ptMid = treePoints[midIdx];
      companions.push({
        plantId: plant.id,
        plant,
        dxM: Number(ptMid.dxM.toFixed(2)),
        dyM: Number((ptMid.dyM + sunSide).toFixed(2)),
        servicingTreeIndices: [midIdx],
        isMerged: false,
        roleCategory: 'PERIMETER_BARRIER'
      });
    }
  });

  // Repeller sentinels
  repellers.forEach(plant => {
    const stationsNeeded = Math.max(1, Math.ceil(count * 0.7));
    const step = Math.max(1, Math.floor(treePoints.length / stationsNeeded));
    for (let s = 0; s < stationsNeeded; s++) {
      const idx = Math.min(treePoints.length - 1, s * step);
      const pt = treePoints[idx];
      const angle = (idx % 2 === 0 ? 180 : 270) * (Math.PI / 180);
      const r = Math.max(0.8, starTree.matureRadiusM * 0.6);
      companions.push({
        plantId: plant.id,
        plant,
        dxM: Number((pt.dxM + r * Math.sin(angle)).toFixed(2)),
        dyM: Number((pt.dyM - r * Math.cos(angle)).toFixed(2)),
        servicingTreeIndices: [idx],
        isMerged: false,
        roleCategory: 'SENTINEL_REPELLER'
      });
    }
  });

  otherPlants.forEach(plant => {
    const stationsNeeded = Math.max(1, Math.ceil(count / 2));
    for (let i = 0; i < stationsNeeded; i++) {
      const idx = Math.min(treePoints.length - 1, i * 2);
      const pt = treePoints[idx];
      const r = starTree.matureRadiusM * 0.8;
      companions.push({
        plantId: plant.id,
        plant,
        dxM: Number((pt.dxM + r * 0.7).toFixed(2)),
        dyM: Number((pt.dyM + r * 0.7).toFixed(2)),
        servicingTreeIndices: [idx],
        isMerged: false,
        roleCategory: 'SENTINEL_REPELLER'
      });
    }
  });

  const optimizedCount = companions.length;
  const savingsPercent = unoptimizedCount > 0
    ? Math.max(0, Math.round(((unoptimizedCount - optimizedCount) / unoptimizedCount) * 100))
    : 0;

  return {
    companions,
    unoptimizedCount,
    optimizedCount,
    savingsPercent,
  };
}
