import { ClimateZone, GuildPlant, GuildRole, Hemisphere, LocalizedString, SoilType, StarTree } from '../types/guild';
import {
  GardenCompanionInstance,
  GardenConflict,
  GardenConflictType,
  GardenStarPlantInstance,
  GardenStats
} from '../types/garden';
import { GUILD_PLANTS } from '../data/guildPlants';
import { STAR_TREES } from '../data/starTrees';
import {
  isAlliumPlant,
  isLegumePlant,
  isFennelPlant,
  isWormwoodPlant,
  isJugloneSensitiveStar,
  isStrictAcidophilePlant,
  isStrictCalcicolePlant,
  isAcidIntolerantStar,
  STRICT_ACIDOPHILE_STAR_IDS,
  JUGLONE_ROOT_ZONE_M
} from './placementRules';
import { analyzeGardenAntagonisms } from './gardenAntagonist';
import { getCompanionPestDefenseForTree } from './pestCompanionEngine';
import { PEST_HOST_CONFLICTS } from './pestHostConflicts';
import { isCompatibleWithStar, isCompatiblePair } from './compatibility';

/**
 * Tolerance for distance comparisons and cm rounding. Positions are cm values; comparing with a
 * tolerance and rounding halves consistently upwards makes the layout depend only on relative
 * positions, so a cluster moved as a rigid block (by whole cm) gets the same layout.
 */
const GEOM_EPS = 1e-9;

/** Rounds to whole cm, halves upwards regardless of float noise (translation-consistent). */
function roundCm(v: number): number {
  return Math.round(v * 100 + 1e-6) / 100;
}

/** Insectary plants that feed parasitoid wasps and hoverflies. */
function isInsectaryPlant(plant: GuildPlant): boolean {
  return (
    plant.roles.includes('POLLINATOR_MAGNET') ||
    plant.botanicalName.includes('Achillea') ||
    plant.botanicalName.includes('Foeniculum') ||
    plant.botanicalName.includes('Daucus') ||
    plant.botanicalName.includes('Aster')
  );
}

/** Effective benefit radius (m) of a companion, from agroecological literature. */
export function getCompanionBenefitRadiusM(plant: GuildPlant): number {
  // Parasitoid / hoverfly foraging range around nectar sources
  if (isInsectaryPlant(plant)) {
    return 4.5;
  }

  // Actinorhizal and legume nitrogen fixers
  if (plant.roles.includes('NITROGEN_FIXER')) {
    if (plant.layer === 'CANOPY' || plant.botanicalName.includes('Alnus')) {
      return 4.0; // Alder tree deep mycorrhizal network & leaf mulch reach
    }
    if (plant.layer === 'SHRUB' || plant.botanicalName.includes('Elaeagnus') || plant.botanicalName.includes('Hippophae')) {
      return 2.5; // Actinorhizal shrub root nodule & leaf fall radius
    }
    return 1.8; // Herbaceous clover/lupine mycorrhizal transfer limit
  }

  // Dynamic accumulators and deep taproots (comfrey, horseradish, dandelion)
  if (plant.roles.includes('DYNAMIC_ACCUMULATOR') || plant.roles.includes('BIOMASS_PRODUCER')) {
    return 1.8; // Rosette mulch drop radius & root zone mining
  }

  // VOC pest repellers and antifungals (lavender, wormwood, mint, rue, tansy)
  if (plant.roles.includes('PEST_REPELLER') || plant.roles.includes('ANTIFUNGAL')) {
    return 1.8; // Atmospheric volatile plume masking threshold
  }

  // Bulb and allium trunk-collar barriers
  if (isTrunkCollarCompanion(plant)) {
    return 0.8; // Dense root collar barrier & vole repulsion threshold
  }

  return 1.5;
}

/**
 * Trunk-collar plants (alliums, daffodils, bulbs) sit within 0.8 m of the trunk
 * and are never shared between trees.
 */
export function isTrunkCollarCompanion(plant: GuildPlant): boolean {
  return (
    isAlliumPlant(plant) ||
    plant.layer === 'BULB_ROOT' ||
    plant.preferredZone === 'ZONE_1_BULB' ||
    plant.id === 'plant-chives' ||
    plant.id === 'plant-garlic' ||
    plant.id === 'plant-daffodil'
  );
}

/** True if the companion defends against a registered pest/disease of the tree (see pestCompanionEngine). */
export function isCompanionPestDefenseForTree(companion: GuildPlant, tree: StarTree): boolean {
  return getCompanionPestDefenseForTree(companion, tree).length > 0;
}

/** Local light at (xM, yM) from canopy overlap and the shadow side of each tree. */
export function calculateLocalLight(
  xM: number,
  yM: number,
  starPlants: GardenStarPlantInstance[],
  hemisphere: Hemisphere = 'NORTHERN'
): 'FULL_SUN' | 'PARTIAL_SUN' | 'FULL_SHADE' {
  let canopyOverlaps = 0;
  let inNorthernShadow = false;

  for (const treeInst of starPlants) {
    const dist = Math.hypot(xM - treeInst.xM, yM - treeInst.yM);
    if (dist <= treeInst.starTree.matureRadiusM + GEOM_EPS) {
      canopyOverlaps++;
    }

    // Shadow falls to the pole side: north (negative y) in the northern hemisphere
    const isNorthOfTrunk = hemisphere === 'NORTHERN' ? (yM < treeInst.yM) : (yM > treeInst.yM);
    if (isNorthOfTrunk && dist <= treeInst.starTree.matureRadiusM * 1.3 + GEOM_EPS) {
      inNorthernShadow = true;
    }
  }

  if (canopyOverlaps >= 2 || (canopyOverlaps >= 1 && inNorthernShadow)) {
    return 'FULL_SHADE';
  }
  if (canopyOverlaps === 1 || inNorthernShadow) {
    return 'PARTIAL_SUN';
  }
  return 'FULL_SUN';
}

/**
 * Places companions for all star trees: shares a plant between 2-3 trees when it is
 * within its benefit radius of each, then pushes crowded or antagonistic plants apart.
 */
export function optimizeGardenCompanions(
  starPlants: GardenStarPlantInstance[],
  allGuildPlants: GuildPlant[] = GUILD_PLANTS,
  hemisphere: Hemisphere = 'NORTHERN'
): {
  companions: GardenCompanionInstance[];
  stats: GardenStats;
} {
  if (starPlants.length === 0) {
    return {
      companions: [],
      stats: {
        starPlantCount: 0,
        companionPlantCount: 0,
        unoptimizedCompanionCount: 0,
        plantsSaved: 0,
        savingsPercent: 0,
        coveredRoles: 0,
        criticalConflictsCount: 0,
        warningConflictsCount: 0,
      }
    };
  }

  const treeCompanionMap: Map<string, Set<string>> = new Map();
  let totalUnoptimizedCompanions = 0;

  // Catalogue order, not list order: share codes and re-imports reorder lists, and the layout
  // (sector spread, merge order) must not change with it
  const catalogueIndex = new Map(allGuildPlants.map((p, i) => [p.id, i]));
  const byCatalogue = (a: string, b: string) =>
    (catalogueIndex.get(a) ?? Infinity) - (catalogueIndex.get(b) ?? Infinity) || (a < b ? -1 : a > b ? 1 : 0);

  for (const treeInst of starPlants) {
    const companionIds = new Set<string>([...getEffectiveCompanionIds(treeInst)].sort(byCatalogue));
    treeCompanionMap.set(treeInst.instanceId, companionIds);
    totalUnoptimizedCompanions += companionIds.size;
  }

  // Catalogue order across the whole garden, so adding another guild elsewhere does not reorder
  // (and re-relax) this guild's companions
  const uniqueIds = new Set<string>();
  for (const set of treeCompanionMap.values()) {
    for (const id of set) uniqueIds.add(id);
  }
  const allUniqueCompanionIds = [...uniqueIds].sort(byCatalogue);

  const placedCompanions: GardenCompanionInstance[] = [];
  const plantsById = new Map(allGuildPlants.map(p => [p.id, p]));

  for (const plantId of allUniqueCompanionIds) {
    const plant = plantsById.get(plantId);
    if (!plant) continue;

    const requestingTrees = starPlants.filter(t => treeCompanionMap.get(t.instanceId)?.has(plantId));
    if (requestingTrees.length === 0) continue;

    // Collar barriers and allium volatiles only act within ~0.8 m of the trunk (voles,
    // fungal spore splash), so every tree gets its own.
    if (isTrunkCollarCompanion(plant)) {
      for (const tree of requestingTrees) {
        const tCompanionIds = Array.from(treeCompanionMap.get(tree.instanceId) || []);
        const plantIdx = Math.max(0, tCompanionIds.indexOf(plantId));
        const totalComps = Math.max(1, tCompanionIds.length);
        placedCompanions.push(
          placeIndividualCompanion(tree, plant, plantIdx, totalComps, starPlants, hemisphere)
        );
      }
      continue;
    }

    // Everything else may be shared if one plant is within its benefit radius of every tree it serves.
    const benefitRadius = getCompanionBenefitRadiusM(plant);
    const isInsectary = isInsectaryPlant(plant);

    const unservicedTrees = new Set<string>(requestingTrees.map(t => t.instanceId));
    // Deterministic west-to-east order
    const sortedTrees = [...requestingTrees].sort((a, b) => (a.xM - b.xM) || (a.yM - b.yM));

    for (const treeA of sortedTrees) {
      if (!unservicedTrees.has(treeA.instanceId)) continue;

      let bestPartner: GardenStarPlantInstance | null = null;
      let minPartnerDist = Infinity;

      for (const treeB of sortedTrees) {
        if (treeB.instanceId === treeA.instanceId || !unservicedTrees.has(treeB.instanceId)) continue;

        const dist = Math.hypot(treeB.xM - treeA.xM, treeB.yM - treeA.yM);

        const maxSharingDist = isInsectary
          ? benefitRadius * 2
          : (treeA.starTree.matureRadiusM + treeB.starTree.matureRadiusM) * 0.95 + benefitRadius;

        if (dist <= maxSharingDist + GEOM_EPS && dist < minPartnerDist - GEOM_EPS) {
          minPartnerDist = dist;
          bestPartner = treeB;
        }
      }

      if (bestPartner) {
        // Insectaries can serve a third tree if all three are within range of the centroid
        let thirdPartner: GardenStarPlantInstance | null = null;
        if (isInsectary) {
          for (const treeC of sortedTrees) {
            if (
              treeC.instanceId === treeA.instanceId ||
              treeC.instanceId === bestPartner.instanceId ||
              !unservicedTrees.has(treeC.instanceId)
            ) continue;

            const cx = (treeA.xM + bestPartner.xM + treeC.xM) / 3;
            const cy = (treeA.yM + bestPartner.yM + treeC.yM) / 3;
            const dA = Math.hypot(treeA.xM - cx, treeA.yM - cy);
            const dB = Math.hypot(bestPartner.xM - cx, bestPartner.yM - cy);
            const dC = Math.hypot(treeC.xM - cx, treeC.yM - cy);

            if (dA <= benefitRadius + GEOM_EPS && dB <= benefitRadius + GEOM_EPS && dC <= benefitRadius + GEOM_EPS) {
              thirdPartner = treeC;
              break;
            }
          }
        }

        if (thirdPartner) {
          const cx = roundCm((treeA.xM + bestPartner.xM + thirdPartner.xM) / 3);
          const cy = roundCm((treeA.yM + bestPartner.yM + thirdPartner.yM) / 3);
          const isPestDef =
            isCompanionPestDefenseForTree(plant, treeA.starTree) ||
            isCompanionPestDefenseForTree(plant, bestPartner.starTree) ||
            isCompanionPestDefenseForTree(plant, thirdPartner.starTree);

          placedCompanions.push({
            instanceId: `${plant.id}-merged-${treeA.instanceId}-${bestPartner.instanceId}-${thirdPartner.instanceId}`,
            plantId: plant.id,
            plant,
            xM: cx,
            yM: cy,
            servicingTreeIds: [treeA.instanceId, bestPartner.instanceId, thirdPartner.instanceId],
            isMerged: true,
            currentLightCondition: calculateLocalLight(cx, cy, starPlants, hemisphere),
            isKeyPestDefense: isPestDef
          });

          unservicedTrees.delete(treeA.instanceId);
          unservicedTrees.delete(bestPartner.instanceId);
          unservicedTrees.delete(thirdPartner.instanceId);
        } else {
          // Midpoint, nudged sideways towards the sun. Stacked trunks (dist 0) fall back to an E-W axis.
          const dist = minPartnerDist;
          const dx = dist > 0 ? (bestPartner.xM - treeA.xM) / dist : 1;
          const dy = dist > 0 ? (bestPartner.yM - treeA.yM) / dist : 0;
          const perpX = -dy;
          const perpY = dx;

          const sunSign = hemisphere === 'NORTHERN' ? (perpY >= 0 ? 1 : -1) : (perpY <= 0 ? 1 : -1);
          const offsetM = 0.35 * sunSign;

          const midX = roundCm(((treeA.xM + bestPartner.xM) / 2) + perpX * offsetM);
          const midY = roundCm(((treeA.yM + bestPartner.yM) / 2) + perpY * offsetM);

          const isPestDef =
            isCompanionPestDefenseForTree(plant, treeA.starTree) ||
            isCompanionPestDefenseForTree(plant, bestPartner.starTree);

          placedCompanions.push({
            instanceId: `${plant.id}-merged-${treeA.instanceId}-${bestPartner.instanceId}`,
            plantId: plant.id,
            plant,
            xM: midX,
            yM: midY,
            servicingTreeIds: [treeA.instanceId, bestPartner.instanceId],
            isMerged: true,
            currentLightCondition: calculateLocalLight(midX, midY, starPlants, hemisphere),
            isKeyPestDefense: isPestDef
          });

          unservicedTrees.delete(treeA.instanceId);
          unservicedTrees.delete(bestPartner.instanceId);
        }
      } else {
        const tCompanionIds = Array.from(treeCompanionMap.get(treeA.instanceId) || []);
        const plantIdx = Math.max(0, tCompanionIds.indexOf(plantId));
        const totalComps = Math.max(1, tCompanionIds.length);

        placedCompanions.push(
          placeIndividualCompanion(treeA, plant, plantIdx, totalComps, starPlants, hemisphere)
        );
        unservicedTrees.delete(treeA.instanceId);
      }
    }
  }

  // Plant classifications are string tests; compute them once instead of per pair and iteration
  const flags = placedCompanions.map(c => ({
    allium: isAlliumPlant(c.plant),
    legume: isLegumePlant(c.plant),
    fennel: isFennelPlant(c.plant),
    wormwood: isWormwoodPlant(c.plant)
  }));

  // Relaxation: push crowded companions apart and keep allium/legume, fennel and wormwood buffers
  for (let iter = 0; iter < 16; iter++) {
    for (let i = 0; i < placedCompanions.length; i++) {
      for (let j = i + 1; j < placedCompanions.length; j++) {
        const p1 = placedCompanions[i];
        const p2 = placedCompanions[j];
        const f1 = flags[i];
        const f2 = flags[j];
        const dist = Math.hypot(p2.xM - p1.xM, p2.yM - p1.yM);

        const isAlliumLegume = (f1.allium && f2.legume) || (f1.legume && f2.allium);
        const isFennelPair = f1.fennel || f2.fennel;
        const isWormwoodPair = f1.wormwood || f2.wormwood;

        let minSeparation = Math.max(0.6, (p1.plant.spreadM + p2.plant.spreadM) * 0.4);
        if (isAlliumLegume) {
          minSeparation = Math.max(minSeparation, 1.95);
        } else if (isFennelPair) {
          minSeparation = Math.max(minSeparation, 1.65);
        } else if (isWormwoodPair) {
          minSeparation = Math.max(minSeparation, 1.35);
        }

        if (dist < minSeparation - GEOM_EPS) {
          const overlap = minSeparation - dist;
          let angle: number;
          if (dist > 0.05 + GEOM_EPS) {
            angle = Math.atan2(p2.yM - p1.yM, p2.xM - p1.xM);
          } else {
            // Stacked plants: direction from the species pair, not array indices, so other guilds
            // in the garden do not change it
            angle = ((hashString(`${p1.plantId}|${p2.plantId}`) % 360) * Math.PI) / 180;
          }
          const pushDist = (overlap + 0.06) / 2;

          p1.xM = roundCm(p1.xM - pushDist * Math.cos(angle));
          p1.yM = roundCm(p1.yM - pushDist * Math.sin(angle));
          p2.xM = roundCm(p2.xM + pushDist * Math.cos(angle));
          p2.yM = roundCm(p2.yM + pushDist * Math.sin(angle));
        }
      }
    }

    // Keep the trunk collar bare (0.4 m; 1.95 m for alliums next to N-fixing trees)
    for (let ci = 0; ci < placedCompanions.length; ci++) {
      const comp = placedCompanions[ci];
      for (const tree of starPlants) {
        const dTrunk = Math.hypot(comp.xM - tree.xM, comp.yM - tree.yM);
        const isAlliumNearNTree = tree.starTree.category === 'NITROGEN_FIXING_TREE' && flags[ci].allium;
        const minTrunkDist = isAlliumNearNTree ? 1.95 : 0.4;
        if (dTrunk < minTrunkDist - GEOM_EPS) {
          const angle = dTrunk > 0.01 + GEOM_EPS ? Math.atan2(comp.yM - tree.yM, comp.xM - tree.xM) : 0.5;
          comp.xM = roundCm(tree.xM + minTrunkDist * Math.cos(angle));
          comp.yM = roundCm(tree.yM + minTrunkDist * Math.sin(angle));
        }
      }
    }
  }

  // The per-tree projection above runs tree after tree, so pushing a companion out of one trunk
  // zone can pull it back into a neighbouring one (e.g. chives between two sea buckthorns), and
  // rounding to cm can leave it a few mm inside. Settle every trunk zone at once.
  for (let ci = 0; ci < placedCompanions.length; ci++) {
    settleTrunkClearance(placedCompanions[ci], starPlants, tree =>
      tree.starTree.category === 'NITROGEN_FIXING_TREE' && flags[ci].allium ? 1.95 : 0.4
    );
  }

  const companionPlantCount = placedCompanions.length;
  const plantsSaved = Math.max(0, totalUnoptimizedCompanions - companionPlantCount);
  const savingsPercent = totalUnoptimizedCompanions > 0
    ? Math.round((plantsSaved / totalUnoptimizedCompanions) * 100)
    : 0;

  // Ecological roles covered (of 9), including the star trees' own roles
  const allCoveredRoles = new Set<string>();
  for (const c of placedCompanions) {
    for (const r of c.plant.roles) allCoveredRoles.add(r);
  }

  for (const treeInst of starPlants) {
    const roles = DUAL_ROLE_STAR_TREE_MAP[treeInst.treeId];
    if (roles) {
      roles.forEach(r => allCoveredRoles.add(r));
    }
    const compMatch = allGuildPlants.find(
      p => p.botanicalName.toLowerCase().trim() === treeInst.starTree.botanicalName.toLowerCase().trim()
    );
    if (compMatch) {
      compMatch.roles.forEach(r => allCoveredRoles.add(r));
    }
  }

  const activeConflicts = analyzeGardenAntagonisms(starPlants, placedCompanions);
  const criticalConflictsCount = activeConflicts.filter(c => c.severity === 'CRITICAL').length;
  const warningConflictsCount = activeConflicts.filter(c => c.severity === 'WARNING').length;

  return {
    companions: placedCompanions,
    stats: {
      starPlantCount: starPlants.length,
      companionPlantCount,
      unoptimizedCompanionCount: totalUnoptimizedCompanions,
      plantsSaved,
      savingsPercent,
      coveredRoles: allCoveredRoles.size,
      criticalConflictsCount,
      warningConflictsCount,
    }
  };
}

/**
 * Guild roles that some star plants fill themselves: exactly the evidence-checked roles of the
 * companion entry for the same species (e.g. Black Alder star = Black Alder companion), so the two
 * can never drift apart. Stars without a companion twin fill no extra role.
 */
export const DUAL_ROLE_STAR_TREE_MAP: Record<string, GuildRole[]> = Object.fromEntries(
  STAR_TREES.flatMap(tree => {
    const twin = GUILD_PLANTS.find(
      p => !p.retired && p.botanicalName.toLowerCase().trim() === tree.botanicalName.toLowerCase().trim()
    );
    return twin && twin.roles.length > 0 ? [[tree.id, [...twin.roles]]] : [];
  })
);

/** Synthetic GuildPlant for showing a star tree in PlantDetailModal. */
export function starTreeToGuildPlant(tree: StarTree): GuildPlant {
  const dualRoles = DUAL_ROLE_STAR_TREE_MAP[tree.id] || [];
  return {
    id: tree.id,
    commonName: tree.commonName,
    botanicalName: tree.botanicalName,
    layer: 'CANOPY',
    roles: dualRoles,
    seasonalActivity: {
      activeSeasons: [tree.bloomSeason, tree.harvestSeason, 'SUMMER'],
      floweringSeasons: [tree.bloomSeason],
      foliageSeasons: ['EARLY_SPRING', 'LATE_SPRING', 'SUMMER', 'AUTUMN'],
      chopAndDropSeasons: ['LATE_SPRING', 'AUTUMN'],
      pestDeterrenceSeasons: ['LATE_SPRING', 'SUMMER'],
      harvestSeasons: [tree.harvestSeason],
    },
    preferredZone: 'ZONE_3_DRIP',
    preferredSector: 'ANY',
    jugloneTolerance: tree.jugloneProducer ? 'TOLERANT' : isJugloneSensitiveStar(tree) ? 'SENSITIVE' : 'NEUTRAL',
    climateZones: tree.climateZones,
    minDistanceM: 0,
    maxDistanceM: tree.matureRadiusM,
    spreadM: tree.matureRadiusM * 2,
    heightM: tree.matureRadiusM * 2.5,
    perennial: true,
    notes: tree.description,
    color: tree.color,
    iconName: 'Trees',
    imageUrl: tree.imageUrl,
    suitableSoils: tree.preferredSoils,
    unsuitableSoils: tree.unsuitableSoils,
    soilNotes: tree.soilAdvice,
    recommendedForTrees: [],
    plantingTime: tree.plantingTime,
    harvestTime: tree.harvestTime,
  };
}

function getPreferredAngleDeg(plant: GuildPlant, hemisphere: Hemisphere): number {
  // Alliums east/south-east, legumes on the opposite side, to keep them apart
  if (isAlliumPlant(plant)) {
    return hemisphere === 'NORTHERN' ? 120 : 60;
  }
  if (isLegumePlant(plant)) {
    return hemisphere === 'NORTHERN' ? 300 : 240;
  }
  if (hemisphere === 'NORTHERN') {
    switch (plant.preferredSector) {
      case 'NORTH_SHADE': return 0;
      case 'EAST_MORNING': return 90;
      case 'SOUTH_SUN': return 180;
      case 'WEST_WIND': return 270;
      default: return (hashString(plant.id) % 360);
    }
  } else {
    switch (plant.preferredSector) {
      case 'NORTH_SHADE': return 180;
      case 'EAST_MORNING': return 90;
      case 'SOUTH_SUN': return 0;
      case 'WEST_WIND': return 270;
      default: return (hashString(plant.id) % 360);
    }
  }
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Moves a companion the shortest distance (on the cm grid) so it keeps `minDist(tree)` from every
 * trunk: candidates are the radial projections onto each violated clearance circle and the
 * intersections of every pair of nearby circles. Leaves a companion that already complies untouched.
 */
function settleTrunkClearance(
  comp: { xM: number; yM: number },
  starPlants: GardenStarPlantInstance[],
  minDist: (tree: GardenStarPlantInstance) => number
): void {
  const ok = (x: number, y: number) =>
    starPlants.every(t => Math.hypot(x - t.xM, y - t.yM) >= minDist(t) - 1e-9);
  if (ok(comp.xM, comp.yM)) return;

  // Aim 1 cm outside the circle so rounding to cm never lands inside it
  const circles = starPlants
    .map(t => ({ x: t.xM, y: t.yM, r: minDist(t) + 0.01 }))
    .filter(c => Math.hypot(comp.xM - c.x, comp.yM - c.y) < c.r + 4);
  const candidates: Array<[number, number]> = [];
  for (const c of circles) {
    const d = Math.hypot(comp.xM - c.x, comp.yM - c.y);
    const a = d > 0.01 + GEOM_EPS ? Math.atan2(comp.yM - c.y, comp.xM - c.x) : 0.5;
    candidates.push([c.x + c.r * Math.cos(a), c.y + c.r * Math.sin(a)]);
  }
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      const c1 = circles[i];
      const c2 = circles[j];
      const d = Math.hypot(c2.x - c1.x, c2.y - c1.y);
      if (d < 1e-6 || d > c1.r + c2.r || d < Math.abs(c1.r - c2.r)) continue;
      const a = (c1.r * c1.r - c2.r * c2.r + d * d) / (2 * d);
      const h = Math.sqrt(Math.max(0, c1.r * c1.r - a * a));
      const mx = c1.x + (a * (c2.x - c1.x)) / d;
      const my = c1.y + (a * (c2.y - c1.y)) / d;
      candidates.push([mx + (h * (c2.y - c1.y)) / d, my - (h * (c2.x - c1.x)) / d]);
      candidates.push([mx - (h * (c2.y - c1.y)) / d, my + (h * (c2.x - c1.x)) / d]);
    }
  }
  let best: [number, number] | null = null;
  let bestD = Infinity;
  for (const [x, y] of candidates) {
    const rx = roundCm(x);
    const ry = roundCm(y);
    if (!ok(rx, ry)) continue;
    const d = Math.hypot(rx - comp.xM, ry - comp.yM);
    if (d < bestD - GEOM_EPS) {
      bestD = d;
      best = [rx, ry];
    }
  }
  if (best) {
    comp.xM = best[0];
    comp.yM = best[1];
  }
}

/**
 * Distance (m) within which two guilds interact in the optimizer: the largest companion-sharing
 * distance (insectaries 2 × 4.5 m; others (rA + rB) × 0.95 + benefit radius ≤ 4.5 m). Stars farther
 * apart do not influence each other's companion placement (outer flank, jitter), so a cluster moved as
 * a rigid block keeps its layout as long as no other star comes within this range.
 */
export function getStarInteractionRangeM(a: StarTree, b: StarTree): number {
  return Math.max(9, (a.matureRadiusM + b.matureRadiusM) * 0.95 + 4.5);
}

/** Stars other than `t` within interaction range of it. */
function interactingNeighbours(
  t: GardenStarPlantInstance,
  starPlants: GardenStarPlantInstance[]
): GardenStarPlantInstance[] {
  return starPlants.filter(
    other =>
      other.instanceId !== t.instanceId &&
      Math.hypot(other.xM - t.xM, other.yM - t.yM) <= getStarInteractionRangeM(t.starTree, other.starTree) + GEOM_EPS
  );
}

/** Places one companion in its preferred zone around a single tree. */
function placeIndividualCompanion(
  t: GardenStarPlantInstance,
  plant: GuildPlant,
  plantIdx: number,
  totalComps: number,
  starPlants: GardenStarPlantInstance[],
  hemisphere: Hemisphere
): GardenCompanionInstance {
  // Outer flank: direction pointing away from the neighbouring trees (stars beyond interaction range
  // do not shape this guild)
  let outerAngleDeg: number | null = null;
  const otherTrees = interactingNeighbours(t, starPlants);
  if (otherTrees.length > 0) {
    let sumDx = 0;
    let sumDy = 0;
    for (const other of otherTrees) {
      const d = Math.hypot(other.xM - t.xM, other.yM - t.yM);
      if (d > 0.01 + GEOM_EPS) {
        sumDx += (other.xM - t.xM) / d;
        sumDy += (other.yM - t.yM) / d;
      }
    }
    if (Math.hypot(sumDx, sumDy) > 0.1 + GEOM_EPS) {
      const awayAngleRad = Math.atan2(-sumDy, -sumDx);
      outerAngleDeg = ((awayAngleRad * 180) / Math.PI + 90 + 360) % 360;
    }
  }

  let r = t.starTree.matureRadiusM * 0.7;
  if (isTrunkCollarCompanion(plant)) {
    r = Math.max(0.45, Math.min(0.75, t.starTree.matureRadiusM * 0.22 + (plantIdx % 3) * 0.08));
  } else if (plant.preferredZone === 'ZONE_1_BULB') {
    r = Math.max(0.6, t.starTree.matureRadiusM * 0.35 + (plantIdx % 2) * 0.2);
  } else if (plant.preferredZone === 'ZONE_2_MID') {
    r = Math.max(0.9, t.starTree.matureRadiusM * 0.65 + ((plantIdx % 3) - 1) * 0.25);
  } else if (plant.preferredZone === 'ZONE_3_DRIP') {
    r = Math.max(1.2, t.starTree.matureRadiusM * 0.95 + ((plantIdx % 3) - 1) * 0.3);
  } else if (plant.preferredZone === 'ZONE_4_OUTER') {
    r = Math.max(1.5, t.starTree.matureRadiusM * 1.25 + (plantIdx % 2) * 0.35);
  }

  let finalAngleDeg: number;
  const baseAngle = getPreferredAngleDeg(plant, hemisphere);
  const sectorSpreadDeg = (plantIdx - (totalComps - 1) / 2) * (360 / Math.max(totalComps, 6));
  // Keyed by species and the positions of the neighbouring stars relative to this one (whole cm),
  // not instanceId or absolute position: a shared link or JSON re-import (new instance ids)
  // reproduces the same layout and conflicts, and a cluster moved as a rigid block keeps it
  const neighbourKey = otherTrees
    .map(o => `${Math.round((o.xM - t.xM) * 100)},${Math.round((o.yM - t.yM) * 100)}`)
    .sort()
    .join(';');
  const hashJitter = (hashString(`${plant.id}|${t.treeId}|n:${neighbourKey}`) % 31) - 15;

  if (
    outerAngleDeg !== null &&
    (plant.preferredZone === 'ZONE_4_OUTER' ||
      plant.roles.includes('PEST_REPELLER') ||
      plant.roles.includes('GRASS_BARRIER'))
  ) {
    // Repellers and barriers guard the exposed outer edge
    finalAngleDeg = (outerAngleDeg + hashJitter + 360) % 360;
  } else {
    finalAngleDeg = (baseAngle + sectorSpreadDeg * 0.4 + hashJitter + 360) % 360;
  }

  const rad = ((finalAngleDeg - 90) * Math.PI) / 180;
  const xM = roundCm(t.xM + r * Math.cos(rad));
  const yM = roundCm(t.yM + r * Math.sin(rad));

  return {
    instanceId: `${plant.id}-${t.instanceId}`,
    plantId: plant.id,
    plant,
    xM,
    yM,
    servicingTreeIds: [t.instanceId],
    isMerged: false,
    currentLightCondition: calculateLocalLight(xM, yM, starPlants, hemisphere),
    isKeyPestDefense: isCompanionPestDefenseForTree(plant, t.starTree)
  };
}

/* ------------------------------------------------------------------------------------------------
 * Garden-level conflict resolution
 *
 * Each guild is prefiltered on its own, but in a garden a companion serving (or sitting near) guild A
 * can clash with star B or with a companion of guild B (soil pH, juglone, pest-host reservoirs,
 * Verticillium hosts, alliums next to N-fixing trees …). resolveGardenConflicts replaces such
 * companions with catalogue plants that are compatible with every star they serve or sit near and
 * that keep each affected guild's role coverage, then re-runs the optimizer and the antagonist
 * analysis to verify the swap (fixed-point iteration).
 * ---------------------------------------------------------------------------------------------- */

/** One companion swap made (or suggested) by resolveGardenConflicts. */
export interface GardenSubstitution {
  /** Deterministic id: `${removedPlantId}@${servedTreeIds}`. */
  id: string;
  removedPlantId: string;
  /** Main substitute; null when the plant was dropped because no compatible substitute exists. */
  addedPlantId: string | null;
  /** 0..2 substitutes (a second one only when one plant cannot cover all roles). */
  addedPlantIds: string[];
  /** Star instance ids whose companion lists change. */
  servedTreeIds: string[];
  /** Companion instance that caused the conflict. */
  instanceId: string;
  conflictType: GardenConflictType;
  /** Conflicts (in the layout before the swap) the swap addresses. */
  conflictIds: string[];
  /** The other party of the first conflict (a star or a companion). */
  conflictWith: { id: string; name: LocalizedString };
  /** Title of the first triggering conflict. */
  reason: LocalizedString;
  /** Roles of the removed plant that every served guild still has after the swap. */
  rolesPreserved: GuildRole[];
  /** Roles of the removed plant that some served guild loses (role gap). */
  rolesLost: GuildRole[];
  /** true = applied automatically, false = suggestion only (user-chosen companion or auto mode off). */
  auto: boolean;
}

export interface ResolveGardenOptions {
  allGuildPlants?: GuildPlant[];
  hemisphere?: Hemisphere;
  /** Garden climate zone; substitutes outside it are strongly penalised. */
  zone?: ClimateZone;
  /** Garden soil; substitutes that list it as unsuitable are penalised. */
  soil?: SoilType;
  /** false: nothing is applied, every fixable conflict gets a suggestion instead. Default true. */
  enabled?: boolean;
  /** User-chosen companions (pinKey(treeInstanceId, plantId)): never replaced automatically, only suggested. */
  pinned?: ReadonlySet<string>;
  /** Cap on accepted swaps. Default 24. */
  maxIterations?: number;
}

export interface GardenResolution {
  companions: GardenCompanionInstance[];
  stats: GardenStats;
  /** Star instance id -> companion plant ids after resolution. */
  effectiveCompanionIds: Record<string, string[]>;
  substitutions: GardenSubstitution[];
  suggestions: GardenSubstitution[];
  /** Every conflict left in the final layout (star–star conflicts, pinned companions, unsolvable ones). */
  unresolved: GardenConflict[];
}

/** Key for a user-chosen companion of one star instance. */
export function pinKey(treeInstanceId: string, plantId: string): string {
  return `${treeInstanceId}::${plantId}`;
}

/** Companion ids the optimizer uses for a star (empty selection falls back to the recommendations). */
export function getEffectiveCompanionIds(tree: GardenStarPlantInstance): string[] {
  if (tree.selectedPlantIds && tree.selectedPlantIds.length > 0) return [...tree.selectedPlantIds];
  if (tree.starTree.recommendedCompanions && tree.starTree.recommendedCompanions.length > 0) {
    return [...tree.starTree.recommendedCompanions];
  }
  return ['plant-comfrey', 'plant-white-clover', 'plant-chives', 'plant-daffodil', 'plant-yarrow'];
}

export type StarIncompatibilityReason = 'JUGLONE' | 'EDAPHIC_PH' | 'PEST_HOST' | 'ALLIUM_NTREE';

/**
 * Garden rule (same thresholds as analyzeGardenAntagonisms) that a companion at `distanceM` from a
 * star would break, or null. Use distance 0 for a star the plant serves.
 */
export function getStarIncompatibilityForPlant(
  plant: GuildPlant,
  star: StarTree,
  distanceM: number
): StarIncompatibilityReason | null {
  if (star.jugloneProducer && plant.jugloneTolerance === 'SENSITIVE' && distanceM < JUGLONE_ROOT_ZONE_M) return 'JUGLONE';
  if (distanceM < 2.5) {
    if (STRICT_ACIDOPHILE_STAR_IDS.has(star.id) && isStrictCalcicolePlant(plant)) return 'EDAPHIC_PH';
    if (isAcidIntolerantStar(star) && isStrictAcidophilePlant(plant)) return 'EDAPHIC_PH';
  }
  for (const spec of PEST_HOST_CONFLICTS) {
    if (spec.kind !== 'INTERNAL') continue;
    if (spec.starTreeIds.includes(star.id) && spec.hostPlantIds.includes(plant.id) && distanceM < spec.safeDistanceM) {
      return 'PEST_HOST';
    }
  }
  if (star.category === 'NITROGEN_FIXING_TREE' && isAlliumPlant(plant) && distanceM < 1.8) return 'ALLIUM_NTREE';
  return null;
}

const SEVERITY_WEIGHT: Record<GardenConflict['severity'], number> = { CRITICAL: 3, WARNING: 1, INFO: 0.25 };

interface ResolutionRun {
  companions: GardenCompanionInstance[];
  stats: GardenStats;
  conflicts: GardenConflict[];
  score: number;
}

interface ConflictSlot {
  key: string;
  instance: GardenCompanionInstance;
  servedTreeIds: string[];
  conflicts: GardenConflict[];
  pinned: boolean;
}

interface CandidateOption {
  ids: string[];
  score: number;
}

/**
 * Replaces companions that cause garden-level conflicts (a companion of guild A that clashes with
 * star B or with a companion of guild B) by compatible, role-preserving catalogue plants.
 *
 * Deterministic algorithm: run optimizeGardenCompanions on each star's effective companion list and
 * analyze conflicts; group the fixable ones (at least one side is a companion) by the companion
 * instance to replace; for the heaviest slot try ranked substitutes — active plants compatible with
 * every star they serve or sit near (getStarIncompatibilityForPlant), not clashing with the guild's
 * other companions, covering the roles only the removed plant gave each served guild (two
 * substitutes if one cannot), then preferring recommendedForTrees, the same layer/zone and the
 * garden's climate zone and soil. A swap is kept only if a re-run lowers the weighted conflict score
 * and the new plant is in no conflict. Repeats until no fixable slot is left or `maxIterations`.
 * Star–star conflicts stay in `unresolved`; pinned (user-chosen) companions, and every slot when
 * `enabled === false`, only produce `suggestions`. `starPlants` is not mutated.
 */
export function resolveGardenConflicts(
  starPlants: GardenStarPlantInstance[],
  options: ResolveGardenOptions = {}
): GardenResolution {
  const allPlants = options.allGuildPlants ?? GUILD_PLANTS;
  const hemisphere = options.hemisphere ?? 'NORTHERN';
  const enabled = options.enabled ?? true;
  const pinned = options.pinned ?? new Set<string>();
  const maxIterations = options.maxIterations ?? 24;
  const plantsById = new Map(allPlants.map(p => [p.id, p]));
  const starTreeIds = new Set(STAR_TREES.map(t => t.id));
  const treesById = new Map(starPlants.map(t => [t.instanceId, t]));

  const banned = new Map<string, Set<string>>(starPlants.map(t => [t.instanceId, new Set<string>()]));
  const exhaustedSlots = new Set<string>();
  const rejected = new Map<string, Set<string>>();

  const evaluate = (current: Map<string, string[]>): ResolutionRun => {
    const trees = starPlants.map(t => ({ ...t, selectedPlantIds: [...(current.get(t.instanceId) ?? [])] }));
    const { companions, stats } = optimizeGardenCompanions(trees, allPlants, hemisphere);
    const conflicts = analyzeGardenAntagonisms(trees, companions);
    const score = conflicts.reduce((s, c) => s + SEVERITY_WEIGHT[c.severity], 0);
    return { companions, stats, conflicts, score };
  };

  const isPinnedSlot = (plantId: string, treeIds: string[]) =>
    !enabled || treeIds.some(tid => pinned.has(pinKey(tid, plantId)));

  const isRecommendedHere = (c: GardenCompanionInstance) =>
    c.servicingTreeIds.some(tid => {
      const tree = treesById.get(tid);
      return Boolean(tree && ((c.plant.recommendedForTrees ?? []).includes(tree.treeId) ||
        tree.starTree.recommendedCompanions.includes(c.plantId)));
    });

  const collectSlots = (run: ResolutionRun): ConflictSlot[] => {
    const compById = new Map(run.companions.map(c => [c.instanceId, c]));
    // Conflicts between two stars cannot be fixed by swapping companions
    const fixable = run.conflicts.filter(c => compById.has(c.plantA.id) || compById.has(c.plantB.id));

    // How many fixable conflicts each companion instance takes part in (greedy vertex cover)
    const involvement = new Map<string, number>();
    for (const c of fixable) {
      for (const id of [c.plantA.id, c.plantB.id]) {
        if (compById.has(id)) involvement.set(id, (involvement.get(id) ?? 0) + 1);
      }
    }

    const slots = new Map<string, ConflictSlot>();
    for (const c of [...fixable].sort((a, b) => a.id.localeCompare(b.id))) {
      const sides = [c.plantA.id, c.plantB.id].filter(id => compById.has(id)).map(id => compById.get(id)!);
      let culprit: GardenCompanionInstance;
      if (sides.length === 1) {
        culprit = sides[0];
      } else {
        const [a, b] = sides;
        const aPinned = isPinnedSlot(a.plantId, a.servicingTreeIds);
        const bPinned = isPinnedSlot(b.plantId, b.servicingTreeIds);
        // The allelopath (fennel, wormwood) or the allium is the aggressor (plantA in those conflicts)
        const aggressorFirst =
          c.type === 'FENNEL_ALLELOPATHY' || c.type === 'WORMWOOD_ALLELOPATHY' || c.type === 'ALLIUM_LEGUME';
        if (aPinned !== bPinned) {
          culprit = aPinned ? b : a;
        } else if (aggressorFirst) {
          culprit = a;
        } else {
          // Replace the "foreigner": the plant that would not even fit the other plant's guild star
          // (e.g. a calcicole of the apple guild next to the tea guild's acidophiles), then the one
          // in more conflicts, then the one not recommended for the stars it serves
          const foreign = (x: GardenCompanionInstance, other: GardenCompanionInstance) =>
            other.servicingTreeIds.some(tid => {
              const tree = treesById.get(tid);
              return Boolean(tree && !isCompatibleWithStar(x.plant, tree.starTree));
            });
          const rank = (x: GardenCompanionInstance) =>
            (foreign(x, x === a ? b : a) ? 100 : 0) +
            (involvement.get(x.instanceId) ?? 0) * 10 + (isRecommendedHere(x) ? 0 : 3);
          const ra = rank(a);
          const rb = rank(b);
          culprit = ra > rb ? a : rb > ra ? b : (a.instanceId < b.instanceId ? a : b);
        }
      }
      const servedTreeIds = [...culprit.servicingTreeIds].sort();
      const key = `${culprit.plantId}@${servedTreeIds.join('+')}`;
      const slot = slots.get(key);
      if (slot) {
        slot.conflicts.push(c);
      } else {
        slots.set(key, {
          key,
          instance: culprit,
          servedTreeIds,
          conflicts: [c],
          pinned: isPinnedSlot(culprit.plantId, servedTreeIds)
        });
      }
    }
    const weight = (s: ConflictSlot) => s.conflicts.reduce((sum, c) => sum + SEVERITY_WEIGHT[c.severity], 0);
    return [...slots.values()].sort((a, b) => weight(b) - weight(a) || a.key.localeCompare(b.key));
  };

  const rolesOfTree = (treeInstanceId: string, ids: string[]): Set<GuildRole> => {
    const tree = treesById.get(treeInstanceId);
    const roles = new Set<GuildRole>(tree ? DUAL_ROLE_STAR_TREE_MAP[tree.treeId] ?? [] : []);
    for (const id of ids) plantsById.get(id)?.roles.forEach(r => roles.add(r));
    return roles;
  };

  const rankCandidates = (slot: ConflictSlot, current: Map<string, string[]>, run: ResolutionRun): CandidateOption[] => {
    const removed = slot.instance.plant;
    const servedTrees = slot.servedTreeIds.map(id => treesById.get(id)).filter((t): t is GardenStarPlantInstance => Boolean(t));

    // Roles only the removed plant gave each served guild
    const required = new Set<GuildRole>();
    for (const tree of servedTrees) {
      const others = (current.get(tree.instanceId) ?? []).filter(id => id !== removed.id);
      const remaining = rolesOfTree(tree.instanceId, others);
      removed.roles.forEach(r => { if (!remaining.has(r)) required.add(r); });
    }

    // Conservative distance from each star to the area the substitute may occupy (0 for served stars)
    const starDistances = starPlants.map(star => {
      if (slot.servedTreeIds.includes(star.instanceId)) return { star, dist: 0 };
      let dist = Math.hypot(star.xM - slot.instance.xM, star.yM - slot.instance.yM);
      for (const served of servedTrees) {
        const reach = served.starTree.matureRadiusM * 1.3 + 0.5;
        dist = Math.min(dist, Math.max(0, Math.hypot(star.xM - served.xM, star.yM - served.yM) - reach));
      }
      return { star, dist };
    });

    const mateIds = new Set<string>();
    for (const tree of servedTrees) {
      for (const id of current.get(tree.instanceId) ?? []) if (id !== removed.id) mateIds.add(id);
    }
    const mates = [...mateIds].map(id => plantsById.get(id)).filter((p): p is GuildPlant => Boolean(p));
    const nearby = run.companions
      .filter(c => c.instanceId !== slot.instance.instanceId &&
        Math.hypot(c.xM - slot.instance.xM, c.yM - slot.instance.yM) < 4.5)
      .map(c => c.plant);
    const rejectedHere = rejected.get(slot.key) ?? new Set<string>();

    const eligible = (p: GuildPlant): boolean => {
      if (p.retired || p.id === removed.id || rejectedHere.has(p.id) || starTreeIds.has(p.id)) return false;
      if (isFennelPlant(p) || isWormwoodPlant(p)) return false;
      // Site fit: the garden's zone and soil when known, else a climate zone shared with every served star
      if (options.zone && !p.climateZones.includes(options.zone)) return false;
      if (options.soil && p.unsuitableSoils.includes(options.soil)) return false;
      if (!options.zone && servedTrees.some(t => !t.starTree.climateZones.some(z => p.climateZones.includes(z)))) return false;
      // Same single-guild rules the guild builder uses (compatibility.ts)
      if (servedTrees.some(t => !isCompatibleWithStar(p, t.starTree))) return false;
      if (mates.some(m => !isCompatiblePair(p, m))) return false;
      for (const tree of servedTrees) {
        if (banned.get(tree.instanceId)?.has(p.id)) return false;
        if ((current.get(tree.instanceId) ?? []).includes(p.id)) return false;
      }
      for (const { star, dist } of starDistances) {
        if (getStarIncompatibilityForPlant(p, star.starTree, dist)) return false;
      }
      for (const other of [...mates, ...nearby]) {
        if (isStrictAcidophilePlant(p) && isStrictCalcicolePlant(other)) return false;
        if (isStrictCalcicolePlant(p) && isStrictAcidophilePlant(other)) return false;
      }
      for (const other of nearby) {
        if (isAlliumPlant(p) && isLegumePlant(other)) return false;
        if (isLegumePlant(p) && isAlliumPlant(other)) return false;
      }
      return true;
    };

    const baseScore = (p: GuildPlant): number => {
      let s = 0;
      s += removed.roles.filter(r => p.roles.includes(r)).length * 50;
      s += p.roles.filter(r => !removed.roles.includes(r)).length * 2;
      for (const tree of servedTrees) {
        if ((p.recommendedForTrees ?? []).includes(tree.treeId)) s += 40;
        if (tree.starTree.recommendedCompanions.includes(p.id)) s += 40;
      }
      if (p.layer === removed.layer) s += 20;
      if (p.preferredZone === removed.preferredZone) s += 10;
      if (isTrunkCollarCompanion(p) === isTrunkCollarCompanion(removed)) s += 15;
      if (options.soil && p.suitableSoils.includes(options.soil)) s += 10;
      if (isAlliumPlant(p) && mates.some(isLegumePlant)) s -= 25;
      if (isLegumePlant(p) && mates.some(isAlliumPlant)) s -= 25;
      return s;
    };

    const pool = allPlants.filter(eligible).map(p => ({ p, s: baseScore(p) }));
    pool.sort((a, b) => b.s - a.s || a.p.id.localeCompare(b.p.id));

    const requiredList = [...required];
    const coversAll = (roles: GuildRole[]) => requiredList.every(r => roles.includes(r));
    const ranked: CandidateOption[] = pool.map(({ p, s }) => ({
      ids: [p.id],
      score: s + (coversAll(p.roles) ? 1000 : requiredList.filter(r => p.roles.includes(r)).length * 100)
    }));

    // Two substitutes when no single plant covers every required role
    if (requiredList.length > 0 && !pool.some(({ p }) => coversAll(p.roles))) {
      for (const { p: first, s: s1 } of pool.slice(0, 8)) {
        const missing = requiredList.filter(r => !first.roles.includes(r));
        if (missing.length === 0 || missing.length === requiredList.length) continue;
        const second = pool.find(({ p }) => p.id !== first.id && missing.every(r => p.roles.includes(r)));
        if (second) ranked.push({ ids: [first.id, second.p.id], score: 1000 + (s1 + second.s) / 2 - 5 });
      }
    }

    ranked.sort((a, b) => b.score - a.score || a.ids.join().localeCompare(b.ids.join()));
    // Last resort: drop the plant (roles it alone gave are reported in rolesLost); never empty a list,
    // which would bring back the star's default recommendations
    if (servedTrees.every(t => (current.get(t.instanceId) ?? []).length > 1)) {
      ranked.push({ ids: [], score: -Infinity });
    }
    return ranked;
  };

  const applyIds = (current: Map<string, string[]>, slot: ConflictSlot, added: string[]): Map<string, string[]> => {
    const next = new Map(current);
    for (const tid of slot.servedTreeIds) {
      const list = [...(next.get(tid) ?? [])];
      const idx = list.indexOf(slot.instance.plantId);
      const insert = added.filter(id => !list.includes(id));
      if (idx >= 0) list.splice(idx, 1, ...insert);
      else list.push(...insert);
      if (list.length > 0) next.set(tid, list);
    }
    return next;
  };

  /**
   * Weight of conflicts no automatic swap may touch: star–star conflicts and conflicts whose every
   * companion side is pinned (or all of them when auto mode is off).
   */
  const lockedScore = (r: ResolutionRun): number => {
    const compById = new Map(r.companions.map(c => [c.instanceId, c]));
    return r.conflicts.reduce((sum, c) => {
      const sides = [c.plantA.id, c.plantB.id].map(id => compById.get(id)).filter((x): x is GardenCompanionInstance => Boolean(x));
      const locked = sides.every(x => isPinnedSlot(x.plantId, x.servicingTreeIds));
      return locked ? sum + SEVERITY_WEIGHT[c.severity] : sum;
    }, 0);
  };

  /**
   * strict: the weighted conflict score drops. relaxed: the swap may shift the layout so that other
   * companions collide (new fixable conflicts are solved in later iterations), but locked conflicts
   * must not grow. Both: the new plant itself is in no conflict. Every accepted swap bans the removed
   * plant from its trees for good, so the iteration terminates.
   */
  const acceptable = (
    before: ResolutionRun,
    after: ResolutionRun,
    slot: ConflictSlot,
    added: string[],
    mode: 'strict' | 'relaxed' = 'strict'
  ): boolean => {
    if (mode === 'strict' ? after.score >= before.score : lockedScore(after) > lockedScore(before)) return false;
    const newInstances = new Set(
      after.companions
        .filter(c => added.includes(c.plantId) && c.servicingTreeIds.some(tid => slot.servedTreeIds.includes(tid)))
        .map(c => c.instanceId)
    );
    return !after.conflicts.some(c => newInstances.has(c.plantA.id) || newInstances.has(c.plantB.id));
  };

  const describe = (
    slot: ConflictSlot,
    before: Map<string, string[]>,
    after: Map<string, string[]>,
    added: string[],
    auto: boolean
  ): GardenSubstitution => {
    const removed = slot.instance.plant;
    const lost = new Set<GuildRole>();
    for (const tid of slot.servedTreeIds) {
      const had = rolesOfTree(tid, before.get(tid) ?? []);
      const has = rolesOfTree(tid, after.get(tid) ?? []);
      removed.roles.forEach(r => { if (had.has(r) && !has.has(r)) lost.add(r); });
    }
    const first = slot.conflicts[0];
    const other = first.plantA.id === slot.instance.instanceId ? first.plantB : first.plantA;
    return {
      id: slot.key,
      removedPlantId: removed.id,
      addedPlantId: added[0] ?? null,
      addedPlantIds: [...added],
      servedTreeIds: [...slot.servedTreeIds],
      instanceId: slot.instance.instanceId,
      conflictType: first.type,
      conflictIds: slot.conflicts.map(c => c.id),
      conflictWith: { id: other.id, name: other.name },
      reason: first.title,
      rolesPreserved: removed.roles.filter(r => !lost.has(r)),
      rolesLost: removed.roles.filter(r => lost.has(r)),
      auto
    };
  };

  /** First ranked candidate whose swap passes verification, or null. */
  const trySlot = (slot: ConflictSlot, current: Map<string, string[]>, run: ResolutionRun, maxTries: number) => {
    const ranked = rankCandidates(slot, current, run);
    // The drop option (no substitute) is always tried last, even beyond maxTries
    const candidates = [
      ...ranked.filter(c => c.ids.length > 0).slice(0, maxTries),
      ...ranked.filter(c => c.ids.length === 0)
    ];
    // Fallback when no candidate lowers the score: the relaxed candidate with the lowest score
    let fallback: { ids: string[]; next: Map<string, string[]>; nextRun: ResolutionRun } | null = null;
    for (const cand of candidates) {
      const next = applyIds(current, slot, cand.ids);
      const nextRun = evaluate(next);
      if (acceptable(run, nextRun, slot, cand.ids)) return { ids: cand.ids, next, nextRun };
      if (
        acceptable(run, nextRun, slot, cand.ids, 'relaxed') &&
        (!fallback || nextRun.score < fallback.nextRun.score)
      ) {
        fallback = { ids: cand.ids, next, nextRun };
      }
      if (!rejected.has(slot.key)) rejected.set(slot.key, new Set());
      cand.ids.forEach(id => rejected.get(slot.key)!.add(id));
    }
    return fallback;
  };

  let current = new Map<string, string[]>(starPlants.map(t => [t.instanceId, getEffectiveCompanionIds(t)]));
  let run = evaluate(current);
  const substitutions: GardenSubstitution[] = [];

  // maxIterations caps accepted swaps; the step guard also bounds slots that turn out unsolvable
  for (let step = 0; substitutions.length < maxIterations && step < maxIterations * 4; step++) {
    const open = collectSlots(run).filter(s => !s.pinned && !exhaustedSlots.has(s.key));
    if (open.length === 0) break;

    // Fast path: swap every open slot for its best candidate and verify all of them with one re-run
    if (open.length > 1) {
      let batched = current;
      const picks: Array<{ slot: ConflictSlot; ids: string[] }> = [];
      for (const s of open) {
        const best = rankCandidates(s, batched, run)[0];
        if (!best) continue;
        batched = applyIds(batched, s, best.ids);
        picks.push({ slot: s, ids: best.ids });
      }
      if (picks.length > 1) {
        const batchRun = evaluate(batched);
        if (picks.every(p => acceptable(run, batchRun, p.slot, p.ids))) {
          for (const p of picks) {
            substitutions.push(describe(p.slot, current, batched, p.ids, true));
            for (const tid of p.slot.servedTreeIds) banned.get(tid)?.add(p.slot.instance.plantId);
          }
          current = batched;
          run = batchRun;
          continue;
        }
      }
    }

    const slot = open[0];
    const result = trySlot(slot, current, run, 6);
    if (!result) {
      exhaustedSlots.add(slot.key);
      continue;
    }
    substitutions.push(describe(slot, current, result.next, result.ids, true));
    for (const tid of slot.servedTreeIds) banned.get(tid)?.add(slot.instance.plantId);
    current = result.next;
    run = result.nextRun;
  }

  // One-click suggestions for user-chosen companions (or for everything when auto mode is off)
  const suggestions: GardenSubstitution[] = [];
  // Also slots auto mode gave up on (cap reached or no verified swap), so nothing is left silently
  for (const slot of collectSlots(run).filter(s => s.pinned || exhaustedSlots.has(s.key) || substitutions.length >= maxIterations)) {
    const result = trySlot(slot, current, run, 4);
    if (result) suggestions.push(describe(slot, current, result.next, result.ids, false));
  }

  const effectiveCompanionIds: Record<string, string[]> = {};
  for (const t of starPlants) effectiveCompanionIds[t.instanceId] = [...(current.get(t.instanceId) ?? [])];

  return {
    companions: run.companions,
    stats: run.stats,
    effectiveCompanionIds,
    substitutions,
    suggestions,
    unresolved: run.conflicts
  };
}

/** Companion lists after applying one substitution (one-click "resolve" for a suggestion). */
export function applyGardenSubstitution(
  effectiveIds: Record<string, string[]>,
  sub: Pick<GardenSubstitution, 'removedPlantId' | 'addedPlantIds' | 'servedTreeIds'>
): Record<string, string[]> {
  const next: Record<string, string[]> = { ...effectiveIds };
  for (const tid of sub.servedTreeIds) {
    const list = [...(next[tid] ?? [])];
    const idx = list.indexOf(sub.removedPlantId);
    const insert = sub.addedPlantIds.filter(id => !list.includes(id));
    if (idx >= 0) list.splice(idx, 1, ...insert);
    else list.push(...insert);
    if (list.length > 0) next[tid] = list;
  }
  return next;
}
