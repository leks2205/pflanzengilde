import { GuildPlant, GuildRole, Hemisphere, StarTree } from '../types/guild';
import { GardenCompanionInstance, GardenStarPlantInstance, GardenStats } from '../types/garden';
import { GUILD_PLANTS } from '../data/guildPlants';
import { isAlliumPlant, isLegumePlant, isFennelPlant, isWormwoodPlant } from './placementRules';
import { analyzeGardenAntagonisms } from './gardenAntagonist';
import { getCompanionPestDefenseForTree } from './pestCompanionEngine';

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
    if (dist <= treeInst.starTree.matureRadiusM) {
      canopyOverlaps++;
    }

    // Shadow falls to the pole side: north (negative y) in the northern hemisphere
    const isNorthOfTrunk = hemisphere === 'NORTHERN' ? (yM < treeInst.yM) : (yM > treeInst.yM);
    if (isNorthOfTrunk && dist <= treeInst.starTree.matureRadiusM * 1.3) {
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

  for (const treeInst of starPlants) {
    const companionIds = new Set<string>();
    if (treeInst.selectedPlantIds && treeInst.selectedPlantIds.length > 0) {
      treeInst.selectedPlantIds.forEach(id => companionIds.add(id));
    } else if (treeInst.starTree.recommendedCompanions && treeInst.starTree.recommendedCompanions.length > 0) {
      treeInst.starTree.recommendedCompanions.forEach(id => companionIds.add(id));
    } else {
      ['plant-comfrey', 'plant-white-clover', 'plant-chives', 'plant-daffodil', 'plant-yarrow'].forEach(id =>
        companionIds.add(id)
      );
    }
    treeCompanionMap.set(treeInst.instanceId, companionIds);
    totalUnoptimizedCompanions += companionIds.size;
  }

  const allUniqueCompanionIds = new Set<string>();
  for (const set of treeCompanionMap.values()) {
    for (const id of set) allUniqueCompanionIds.add(id);
  }

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

        if (dist <= maxSharingDist && dist < minPartnerDist) {
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

            if (dA <= benefitRadius && dB <= benefitRadius && dC <= benefitRadius) {
              thirdPartner = treeC;
              break;
            }
          }
        }

        if (thirdPartner) {
          const cx = Number(((treeA.xM + bestPartner.xM + thirdPartner.xM) / 3).toFixed(2));
          const cy = Number(((treeA.yM + bestPartner.yM + thirdPartner.yM) / 3).toFixed(2));
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

          const midX = Number((((treeA.xM + bestPartner.xM) / 2) + perpX * offsetM).toFixed(2));
          const midY = Number((((treeA.yM + bestPartner.yM) / 2) + perpY * offsetM).toFixed(2));

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

  // Relaxation: push crowded companions apart and keep allium/legume, fennel and wormwood buffers
  for (let iter = 0; iter < 16; iter++) {
    for (let i = 0; i < placedCompanions.length; i++) {
      for (let j = i + 1; j < placedCompanions.length; j++) {
        const p1 = placedCompanions[i];
        const p2 = placedCompanions[j];
        const dist = Math.hypot(p2.xM - p1.xM, p2.yM - p1.yM);

        const isAlliumLegume =
          (isAlliumPlant(p1.plant) && isLegumePlant(p2.plant)) ||
          (isLegumePlant(p1.plant) && isAlliumPlant(p2.plant));
        const isFennelPair = isFennelPlant(p1.plant) || isFennelPlant(p2.plant);
        const isWormwoodPair =
          (isWormwoodPlant(p1.plant) && !p2.plant.botanicalName.toLowerCase().startsWith('ribes')) ||
          (isWormwoodPlant(p2.plant) && !p1.plant.botanicalName.toLowerCase().startsWith('ribes'));

        let minSeparation = Math.max(0.6, (p1.plant.spreadM + p2.plant.spreadM) * 0.4);
        if (isAlliumLegume) {
          minSeparation = Math.max(minSeparation, 1.95);
        } else if (isFennelPair) {
          minSeparation = Math.max(minSeparation, 1.65);
        } else if (isWormwoodPair) {
          minSeparation = Math.max(minSeparation, 1.35);
        }

        if (dist < minSeparation) {
          const overlap = minSeparation - dist;
          let angle: number;
          if (dist > 0.05) {
            angle = Math.atan2(p2.yM - p1.yM, p2.xM - p1.xM);
          } else {
            angle = ((i * 137.5 + j * 45) * Math.PI) / 180;
          }
          const pushDist = (overlap + 0.06) / 2;

          p1.xM = Number((p1.xM - pushDist * Math.cos(angle)).toFixed(2));
          p1.yM = Number((p1.yM - pushDist * Math.sin(angle)).toFixed(2));
          p2.xM = Number((p2.xM + pushDist * Math.cos(angle)).toFixed(2));
          p2.yM = Number((p2.yM + pushDist * Math.sin(angle)).toFixed(2));
        }
      }
    }

    // Keep the trunk collar bare (0.4 m; 1.95 m for alliums next to N-fixing trees)
    for (const comp of placedCompanions) {
      for (const tree of starPlants) {
        const dTrunk = Math.hypot(comp.xM - tree.xM, comp.yM - tree.yM);
        const isAlliumNearNTree = tree.starTree.category === 'NITROGEN_FIXING_TREE' && isAlliumPlant(comp.plant);
        const minTrunkDist = isAlliumNearNTree ? 1.95 : 0.4;
        if (dTrunk < minTrunkDist) {
          const angle = dTrunk > 0.01 ? Math.atan2(comp.yM - tree.yM, comp.xM - tree.xM) : 0.5;
          comp.xM = Number((tree.xM + minTrunkDist * Math.cos(angle)).toFixed(2));
          comp.yM = Number((tree.yM + minTrunkDist * Math.sin(angle)).toFixed(2));
        }
      }
    }
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

/** Guild roles that some star trees fill themselves. */
export const DUAL_ROLE_STAR_TREE_MAP: Record<string, GuildRole[]> = {
  'tree-seabuckthorn': ['NITROGEN_FIXER', 'POLLINATOR_MAGNET', 'BIOMASS_PRODUCER'],
  'tree-seabuckthorn-star': ['NITROGEN_FIXER', 'POLLINATOR_MAGNET', 'BIOMASS_PRODUCER'],
  'shrub-elderberry': ['POLLINATOR_MAGNET', 'DYNAMIC_ACCUMULATOR', 'PEST_REPELLER'],
  'shrub-red-currant': ['EDIBLE_UNDERSTORY', 'POLLINATOR_MAGNET', 'LIVING_MULCH'],
  'shrub-rhododendron': ['POLLINATOR_MAGNET', 'LIVING_MULCH', 'GRASS_BARRIER'],
  'tree-linden': ['POLLINATOR_MAGNET', 'DYNAMIC_ACCUMULATOR', 'BIOMASS_PRODUCER', 'EDIBLE_UNDERSTORY'],
  'herb-hemp': ['DYNAMIC_ACCUMULATOR', 'BIOMASS_PRODUCER', 'PEST_REPELLER'],
  'tree-tea-sinensis': ['EDIBLE_UNDERSTORY', 'DYNAMIC_ACCUMULATOR', 'LIVING_MULCH'],
  'shrub-blueberry': ['EDIBLE_UNDERSTORY', 'POLLINATOR_MAGNET'],
  'shrub-blackcurrant': ['EDIBLE_UNDERSTORY', 'POLLINATOR_MAGNET'],
  'herb-rhubarb': ['EDIBLE_UNDERSTORY', 'BIOMASS_PRODUCER'],
  'tree-alder': ['NITROGEN_FIXER', 'BIOMASS_PRODUCER'],
  'plant-willow': ['BIOMASS_PRODUCER', 'DYNAMIC_ACCUMULATOR', 'POLLINATOR_MAGNET'],
};

/** Synthetic GuildPlant for showing a star tree in PlantDetailModal. */
export function starTreeToGuildPlant(tree: StarTree): GuildPlant {
  const dualRoles = DUAL_ROLE_STAR_TREE_MAP[tree.id] || ['BIOMASS_PRODUCER'];
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
    jugloneTolerance: tree.jugloneProducer ? 'TOLERANT' : 'NEUTRAL',
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

/** Places one companion in its preferred zone around a single tree. */
function placeIndividualCompanion(
  t: GardenStarPlantInstance,
  plant: GuildPlant,
  plantIdx: number,
  totalComps: number,
  starPlants: GardenStarPlantInstance[],
  hemisphere: Hemisphere
): GardenCompanionInstance {
  // Outer flank: direction pointing away from the other trees
  let outerAngleDeg: number | null = null;
  const otherTrees = starPlants.filter(other => other.instanceId !== t.instanceId);
  if (otherTrees.length > 0) {
    let sumDx = 0;
    let sumDy = 0;
    for (const other of otherTrees) {
      const d = Math.hypot(other.xM - t.xM, other.yM - t.yM);
      if (d > 0.01) {
        sumDx += (other.xM - t.xM) / d;
        sumDy += (other.yM - t.yM) / d;
      }
    }
    if (Math.hypot(sumDx, sumDy) > 0.1) {
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
  const hashJitter = (hashString(plant.id + t.instanceId) % 31) - 15;

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
  const xM = Number((t.xM + r * Math.cos(rad)).toFixed(2));
  const yM = Number((t.yM + r * Math.sin(rad)).toFixed(2));

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
