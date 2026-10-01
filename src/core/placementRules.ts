import { CardinalSector, GuildPlant, Hemisphere, PlacedPlant, PlantLayer, PlantingZone, StarTree } from '../types/guild';

/** Ring radii in metres from the trunk. Values in comments are for trees with drip >= 2.2 m. */
export interface GuildSpatialMetrics {
  collarRadiusM: number;   // 0.3 bare trunk collar
  bulbRingInnerM: number;  // 0.3
  bulbRingOuterM: number;  // 1.0
  midZoneInnerM: number;   // 1.0
  midZoneOuterM: number;   // drip - 0.7
  dripLineM: number;       // drip
  dripZoneInnerM: number;  // drip - 0.7
  dripZoneOuterM: number;  // drip + 1.0
  outerZoneMaxM: number;   // drip + 2.5
  ladderSectorStartDeg: number; // SW access path kept free for a ladder
  ladderSectorEndDeg: number;
}

export function calculateSpatialMetrics(starTree: StarTree): GuildSpatialMetrics {
  const drip = starTree.matureRadiusM;
  if (drip >= 2.2) {
    return {
      collarRadiusM: 0.3,
      bulbRingInnerM: 0.3,
      bulbRingOuterM: 1.0,
      midZoneInnerM: 1.0,
      midZoneOuterM: Math.max(1.2, drip - 0.7),
      dripLineM: drip,
      dripZoneInnerM: Math.max(1.2, drip - 0.7),
      dripZoneOuterM: drip + 1.0,
      outerZoneMaxM: drip + 2.5,
      ladderSectorStartDeg: 215,
      ladderSectorEndDeg: 245
    };
  } else {
    // Shrubs, vines and herbs: scale the rings with the plant
    const collar = Number(Math.min(0.2, drip * 0.2).toFixed(2));
    const bulbOuter = Number(Math.max(0.7, drip * 0.6).toFixed(2));
    const midOuter = Number(Math.max(bulbOuter + 0.65, drip + 0.35).toFixed(2));
    const dripOuter = Number(Math.max(midOuter + 0.75, drip + 1.1).toFixed(2));
    const outerMax = Number(Math.max(dripOuter + 0.9, drip + 1.9).toFixed(2));
    return {
      collarRadiusM: collar,
      bulbRingInnerM: collar,
      bulbRingOuterM: bulbOuter,
      midZoneInnerM: bulbOuter,
      midZoneOuterM: midOuter,
      dripLineM: drip,
      dripZoneInnerM: midOuter,
      dripZoneOuterM: dripOuter,
      outerZoneMaxM: outerMax,
      ladderSectorStartDeg: 215,
      ladderSectorEndDeg: 245
    };
  }
}

export function getSectorAngleRange(sector: CardinalSector, hemisphere: Hemisphere): { minDeg: number; maxDeg: number; centerDeg: number } {
  // 0° = North, clockwise. Sun and shade sectors swap in the southern hemisphere.
  if (hemisphere === 'NORTHERN') {
    switch (sector) {
      case 'NORTH_SHADE':
        return { minDeg: 315, maxDeg: 45, centerDeg: 0 };
      case 'EAST_MORNING':
        return { minDeg: 45, maxDeg: 135, centerDeg: 90 };
      case 'SOUTH_SUN':
        return { minDeg: 135, maxDeg: 225, centerDeg: 180 };
      case 'WEST_WIND':
        return { minDeg: 225, maxDeg: 315, centerDeg: 270 };
      case 'ANY':
      default:
        return { minDeg: 0, maxDeg: 360, centerDeg: 120 };
    }
  } else {
    switch (sector) {
      case 'NORTH_SHADE':
        return { minDeg: 135, maxDeg: 225, centerDeg: 180 };
      case 'SOUTH_SUN':
        return { minDeg: 315, maxDeg: 45, centerDeg: 0 };
      case 'EAST_MORNING':
        return { minDeg: 45, maxDeg: 135, centerDeg: 90 };
      case 'WEST_WIND':
        return { minDeg: 225, maxDeg: 315, centerDeg: 270 };
      case 'ANY':
      default:
        return { minDeg: 0, maxDeg: 360, centerDeg: 60 };
    }
  }
}

/** Distance between two points given in polar coordinates (law of cosines). */
export function calculatePolarDistanceM(
  r1: number,
  thetaDeg1: number,
  r2: number,
  thetaDeg2: number
): number {
  const angleDiffRad = ((thetaDeg1 - thetaDeg2) * Math.PI) / 180;
  const distSq = r1 * r1 + r2 * r2 - 2 * r1 * r2 * Math.cos(angleDiffRad);
  return Math.sqrt(Math.max(0, distSq));
}

/**
 * Whether two layers compete for the same horizontal space. Bulbs, ground covers under
 * shrubs/trees and vines stack vertically instead.
 */
export function areLayersCompeting(layerA: PlantLayer, layerB: PlantLayer): boolean {
  if (layerA === layerB) return true;
  if ((layerA === 'SHRUB' && layerB === 'HERBACEOUS') || (layerA === 'HERBACEOUS' && layerB === 'SHRUB')) return true;
  if ((layerA === 'CANOPY' && layerB === 'SUB_CANOPY') || (layerA === 'SUB_CANOPY' && layerB === 'CANOPY')) return true;
  return false;
}

export function isAlliumPlant(plant: GuildPlant): boolean {
  const id = plant.id.toLowerCase();
  const bot = plant.botanicalName.toLowerCase();
  return id.includes('chives') || id.includes('garlic') || id.includes('onion') || bot.startsWith('allium');
}

export function isLegumePlant(plant: GuildPlant): boolean {
  const id = plant.id.toLowerCase();
  return (
    plant.roles.includes('NITROGEN_FIXER') ||
    id.includes('clover') ||
    id.includes('goumi') ||
    id.includes('elaeagnus') ||
    id.includes('seabuckthorn') ||
    id.includes('lupine') ||
    id.includes('alfalfa')
  );
}

export function isFennelPlant(plant: GuildPlant): boolean {
  const id = plant.id.toLowerCase();
  const bot = plant.botanicalName.toLowerCase();
  return id.includes('fennel') || bot.startsWith('foeniculum');
}

export function isWormwoodPlant(plant: GuildPlant): boolean {
  const id = plant.id.toLowerCase();
  const bot = plant.botanicalName.toLowerCase();
  return id.includes('wormwood') || bot.startsWith('artemisia absinthium');
}

/**
 * Companions whose sourced soil notes demand acid soil (cranberry pH 4.0–5.2, lingonberry
 * 4.3–5.5, wintergreen < 6, tea 4.5–5.5, rhododendron 4.5–6.0, blueberry 4.5–5.5).
 * Lupine is not listed: it grows mainly on slightly acid sands but is also reported on
 * neutral soils.
 */
export function isStrictAcidophilePlant(plant: GuildPlant): boolean {
  const id = plant.id.toLowerCase();
  return (
    id.includes('cranberry') ||
    id.includes('lingonberry') ||
    id.includes('wintergreen') ||
    id.includes('tea-sinensis') ||
    id.includes('rhododendron') ||
    id.includes('blueberry')
  );
}

/**
 * Companions whose sourced soil notes need neutral to calcareous soil: sage (neutral to
 * alkaline), alfalfa (pH 6.5–7.0, lime acid soils), sainfoin (calcareous, pH 6.6–8, fails on
 * acid ground), Christmas rose (carbonate bedrock, base-rich soils). Lavender, rosemary and
 * hyssop only tolerate lime (sandy or chalky soils) and are not counted.
 */
export function isStrictCalcicolePlant(plant: GuildPlant): boolean {
  const id = plant.id.toLowerCase();
  return (
    id.includes('sage') ||
    id.includes('alfalfa') ||
    id.includes('sainfoin') ||
    id.includes('hellebore')
  );
}

/**
 * Star plants listed as juglone-sensitive in the observation lists the walnut texts cite.
 * Funt & Martin (1993, Ohio State HYG-1148): apple, European alder (Alnus glutinosa), basswood
 * (Tilia), rhododendron, blueberry and rhubarb do not grow near black walnut, while peach,
 * nectarine, cherry, plum (Prunus) and pear were observed growing near it. Purdue HO-193
 * (Dana & Lerner 1994) lists apple, pear, blueberry, rhubarb, rhododendron, black alder and
 * basswood as sensitive and cherry and pawpaw as tolerant. Penn State lists Prunus, quince,
 * wild grape and American hazel as tolerant. Pear stays on the list as a precaution because
 * the lists disagree; species on no list (tea, fig, mulberry, chestnut …) are not flagged.
 */
export const JUGLONE_SENSITIVE_STAR_IDS: ReadonlySet<string> = new Set([
  'tree-apple',
  'tree-pear',
  'tree-alder',
  'tree-linden',
  'shrub-blueberry',
  'shrub-rhododendron',
  'herb-rhubarb'
]);

export function isJugloneSensitiveStar(tree: Pick<StarTree, 'id' | 'jugloneProducer'>): boolean {
  return !tree.jugloneProducer && JUGLONE_SENSITIVE_STAR_IDS.has(tree.id);
}

/**
 * Juglone zone around a mature black walnut: on average 15–18 m (50–60 ft) from the trunk,
 * up to about 24 m (80 ft) (Funt & Martin 1993; Morton Arboretum). The planner uses the upper
 * end of the average, 18 m, as its precautionary buffer.
 */
export const JUGLONE_ROOT_ZONE_M = 18;

/** Star plants whose sourced texts call them calcifuge / strict acid-soil plants. */
export const STRICT_ACIDOPHILE_STAR_IDS: ReadonlySet<string> = new Set([
  'shrub-blueberry',     // pH 4.5–5.5
  'shrub-rhododendron',  // pH 4.5–6.0
  'tree-tea-sinensis',   // pH 4.5–5.5
  'tree-tea-assamica',   // pH 4.5–5.5
  'tree-chestnut'        // pH 3.5–5.5, does not thrive on limestone
]);

/**
 * Star plants that cannot use acid soil (SoilType ACIDIC = pH < 6.0 is listed as unsuitable),
 * e.g. hemp (best at pH 6.0–7.0). Paired with strict acidophiles in the pH conflict check.
 */
export function isAcidIntolerantStar(tree: Pick<StarTree, 'unsuitableSoils'>): boolean {
  return tree.unsuitableSoils.includes('ACIDIC');
}

export function autoPlaceGuildPlants(
  starTree: StarTree,
  selectedPlants: GuildPlant[],
  hemisphere: Hemisphere = 'NORTHERN'
): PlacedPlant[] {
  const metrics = calculateSpatialMetrics(starTree);
  const placed: PlacedPlant[] = [];
  const isNFixingStarTree = starTree.category === 'NITROGEN_FIXING_TREE';

  const plantsByZone: Record<PlantingZone, GuildPlant[]> = {
    ZONE_0_COLLAR: [],
    ZONE_1_BULB: [],
    ZONE_2_MID: [],
    ZONE_3_DRIP: [],
    ZONE_4_OUTER: []
  };

  selectedPlants.forEach(plant => {
    // Precaution (no study on Frankia found): keep alliums >= 1.8 m from an N-fixing star's collar
    if (isNFixingStarTree && isAlliumPlant(plant) && (plant.preferredZone === 'ZONE_1_BULB' || plant.preferredZone === 'ZONE_2_MID')) {
      plantsByZone['ZONE_3_DRIP'].push(plant);
    } else if (isFennelPlant(plant) || isWormwoodPlant(plant)) {
      plantsByZone['ZONE_4_OUTER'].push(plant);
    } else {
      plantsByZone[plant.preferredZone].push(plant);
    }
  });

  const isInsideLadder = (deg: number) => {
    const norm = (deg + 360) % 360;
    return norm >= metrics.ladderSectorStartDeg && norm <= metrics.ladderSectorEndDeg;
  };

  const hasAlliums = selectedPlants.some(isAlliumPlant);
  const hasLegumes = selectedPlants.some(isLegumePlant);
  const zoneOrder: PlantingZone[] = ['ZONE_1_BULB', 'ZONE_2_MID', 'ZONE_3_DRIP', 'ZONE_4_OUTER'];

  const isInSectorRange = (angle: number, minDeg: number, maxDeg: number): boolean => {
    return maxDeg >= minDeg
      ? (angle >= minDeg && angle <= maxDeg)
      : (angle >= minDeg || angle <= maxDeg);
  };

  zoneOrder.forEach(zone => {
    const plants = plantsByZone[zone];
    if (plants.length === 0) return;

    let minR = metrics.midZoneInnerM;
    let maxR = metrics.midZoneOuterM;

    if (zone === 'ZONE_1_BULB') {
      minR = metrics.bulbRingInnerM;
      maxR = metrics.bulbRingOuterM;
    } else if (zone === 'ZONE_2_MID') {
      minR = metrics.midZoneInnerM;
      maxR = metrics.midZoneOuterM;
    } else if (zone === 'ZONE_3_DRIP') {
      minR = metrics.dripZoneInnerM;
      maxR = metrics.dripZoneOuterM;
    } else if (zone === 'ZONE_4_OUTER') {
      minR = metrics.dripZoneOuterM;
      maxR = metrics.outerZoneMaxM;
    }

    // Alliums first so they anchor their sunny spots, then others by spread, then legumes, allelopaths last
    const sorted = [...plants].sort((a, b) => {
      const getPriority = (p: GuildPlant) => {
        if (isAlliumPlant(p)) return 0;
        if (isWormwoodPlant(p)) return 4;
        if (isFennelPlant(p)) return 3;
        if (isLegumePlant(p)) return 2;
        return 1;
      };
      const diff = getPriority(a) - getPriority(b);
      if (diff !== 0) return diff;
      return b.spreadM - a.spreadM;
    });

    sorted.forEach((plant, idx) => {
      const sectorRange = getSectorAngleRange(plant.preferredSector, hemisphere);
      const rSpan = Math.max(0.2, maxR - minR);
      let distance = minR + (rSpan * 0.35) + ((idx % 3) * (rSpan * 0.28));

      if (isNFixingStarTree && isAlliumPlant(plant)) {
        distance = Math.max(distance, 1.9);
      }

      let targetAngle = 0;

      // Alliums and legumes together: keep >= 1.85 m between the two groups
      const isLegumeWithAlliums = hasAlliums && isLegumePlant(plant);
      const isAlliumWithPlacedLegumes = hasLegumes && isAlliumPlant(plant) && placed.some(p => isLegumePlant(p.plant));

      if (isLegumeWithAlliums || isAlliumWithPlacedLegumes) {
        const opponents = placed.filter(p =>
          isLegumePlant(plant) ? isAlliumPlant(p.plant) : isLegumePlant(p.plant)
        );
        const sameGroup = placed.filter(p =>
          isLegumePlant(plant) ? isLegumePlant(p.plant) : isAlliumPlant(p.plant)
        );
        const isAny = plant.preferredSector === 'ANY';

        if (opponents.length > 0) {
          const maxOppR = Math.max(...opponents.map(o => o.distanceM), 0.5);
          if (distance + maxOppR < 1.95) {
            distance = Number(Math.max(distance, 1.95 - maxOppR + 0.1, metrics.dripZoneInnerM).toFixed(2));
          }
        }
        if (isNFixingStarTree && isAlliumPlant(plant)) {
          distance = Math.max(distance, 1.9);
        }

        const evaluateAngles = (candidateDist: number, strictlyInSector: boolean) => {
          let bestA = 0;
          let bestScore = -999999;
          let bestMinOppDist = opponents.length === 0 ? 999 : 0;

          for (let a = 0; a < 360; a += 5) {
            if (strictlyInSector && !isAny) {
              if (!isInSectorRange(a, sectorRange.minDeg, sectorRange.maxDeg)) continue;
            }

            if (zone !== 'ZONE_1_BULB' && isInsideLadder(a)) {
              continue;
            }

            let minOppDist = 999;
            for (const opp of opponents) {
              const d = calculatePolarDistanceM(opp.distanceM, opp.angleDeg, candidateDist, a);
              if (d < minOppDist) minOppDist = d;
            }

            let minSameAngleDiff = 999;
            for (const sg of sameGroup) {
              const diff = Math.abs(((a - sg.angleDeg + 540) % 360) - 180);
              if (diff < minSameAngleDiff) minSameAngleDiff = diff;
            }

            let crownPenalty = 0;
            for (const p of placed) {
              const d = calculatePolarDistanceM(p.distanceM, p.angleDeg, candidateDist, a);
              const combinedR = (plant.spreadM + p.plant.spreadM) / 2;
              const competing = areLayersCompeting(plant.layer, p.plant.layer);
              const reqCrown = combinedR * (competing ? 0.73 : 0.37);
              if (d < reqCrown) {
                crownPenalty -= (reqCrown - d) * 25.0;
              }
            }

            const inPreferredBonus = (!isAny && isInSectorRange(a, sectorRange.minDeg, sectorRange.maxDeg)) ? 2.0 : 0;
            const sameSpacingPenalty = minSameAngleDiff < 25 ? -4.0 : 0;
            const safeDistanceBonus = minOppDist >= 1.85 ? 50.0 : (minOppDist - 1.85) * 40.0;

            const score =
              safeDistanceBonus +
              Math.min(minOppDist, 3.5) * 3.0 +
              (Math.min(minSameAngleDiff, 90) / 30.0) +
              inPreferredBonus +
              sameSpacingPenalty +
              crownPenalty;

            if (score > bestScore) {
              bestScore = score;
              bestA = a;
              bestMinOppDist = minOppDist;
            }
          }
          return { bestA, bestScore, bestMinOppDist };
        };

        // Preferred sector first, then the whole circle, then step outward
        let candidateResult = evaluateAngles(distance, true);
        if (candidateResult.bestMinOppDist < 1.85 && !isAny) {
          candidateResult = evaluateAngles(distance, false);
        }

        while (candidateResult.bestMinOppDist < 1.85 && distance < 15.0) {
          distance = Number((distance + 0.35).toFixed(2));
          candidateResult = evaluateAngles(distance, false);
        }

        targetAngle = candidateResult.bestA;
      } else if (isFennelPlant(plant) || isWormwoodPlant(plant)) {
        // Fennel (< 1.5 m) and wormwood (< 1.2 m) are allelopathic: outer edge, clear of neighbours
        distance = Number(Math.max(distance, metrics.outerZoneMaxM - 0.3, isFennelPlant(plant) ? 1.85 : 1.65).toFixed(2));
        const isAny = plant.preferredSector === 'ANY';

        const findBestAllelopathAngle = (candDist: number) => {
          let localBestA = (idx * 90 + 45) % 360;
          let localBestScore = -999999;
          let localMinDeficit = placed.length === 0 ? 1.0 : -999;

          for (let a = 0; a < 360; a += 5) {
            if (isInsideLadder(a)) continue;

            let minDeficit = 999;
            let minDist = 999;

            for (const p of placed) {
              const d = calculatePolarDistanceM(p.distanceM, p.angleDeg, candDist, a);
              if (d < minDist) minDist = d;

              // Funke (1943): every test species except wormwood itself was injured within ~1 m
              let reqClear = 0.4;
              if (isFennelPlant(plant) || isFennelPlant(p.plant)) {
                reqClear = 1.55;
              } else if (isWormwoodPlant(plant) || isWormwoodPlant(p.plant)) {
                reqClear = 1.25;
              }
              const combinedR = (plant.spreadM + p.plant.spreadM) / 2;
              const competing = areLayersCompeting(plant.layer, p.plant.layer);
              reqClear = Math.max(reqClear, combinedR * (competing ? 0.73 : 0.37));

              const deficit = d - reqClear;
              if (deficit < minDeficit) minDeficit = deficit;
            }

            if (placed.length === 0) {
              minDeficit = 1.0;
              minDist = candDist;
            }

            const inPreferredBonus = (!isAny && isInSectorRange(a, sectorRange.minDeg, sectorRange.maxDeg)) ? 1.5 : 0;
            const score = (minDeficit >= 0 ? 100.0 + Math.min(minDist, 4.0) * 2.0 : minDeficit * 50.0) + inPreferredBonus;

            if (score > localBestScore) {
              localBestScore = score;
              localBestA = a;
              localMinDeficit = minDeficit;
            }
          }
          return { localBestA, localMinDeficit };
        };

        let res = findBestAllelopathAngle(distance);
        while (res.localMinDeficit < 0 && distance < 16.0) {
          distance = Number((distance + 0.35).toFixed(2));
          res = findBestAllelopathAngle(distance);
        }
        targetAngle = res.localBestA;
      } else {
        // Everything else: preferred sector, a few candidate radii, avoid crown collisions
        const isAny = plant.preferredSector === 'ANY';
        const baseCandRadii = [
          distance,
          minR + rSpan * 0.2,
          minR + rSpan * 0.5,
          minR + rSpan * 0.8,
          maxR
        ];
        if (isNFixingStarTree && isAlliumPlant(plant)) {
          for (let rIdx = 0; rIdx < baseCandRadii.length; rIdx++) {
            baseCandRadii[rIdx] = Math.max(baseCandRadii[rIdx], 1.9);
          }
        }

        const findBestStandardSpot = (radii: number[], strictlyInSector: boolean) => {
          let bestA = (idx * 45 + 30) % 360;
          let bestR = radii[0];
          let bestScore = -999999;
          let bestMinMargin = placed.length === 0 ? 1.0 : -999;

          for (const candR of radii) {
            for (let a = 0; a < 360; a += 5) {
              if (strictlyInSector && !isAny) {
                if (!isInSectorRange(a, sectorRange.minDeg, sectorRange.maxDeg)) continue;
              }
              if (zone !== 'ZONE_1_BULB' && isInsideLadder(a)) continue;

              let minMargin = 999;
              let minPeerDist = 999;
              for (const p of placed) {
                const d = calculatePolarDistanceM(p.distanceM, p.angleDeg, candR, a);
                if (d < minPeerDist) minPeerDist = d;

                const combinedR = (plant.spreadM + p.plant.spreadM) / 2;
                const competing = areLayersCompeting(plant.layer, p.plant.layer);
                let reqClear = combinedR * (competing ? 0.73 : 0.37);

                if (isFennelPlant(p.plant)) reqClear = Math.max(reqClear, 1.55);
                if (isWormwoodPlant(p.plant)) {
                  reqClear = Math.max(reqClear, 1.25);
                }

                const margin = d - reqClear;
                if (margin < minMargin) minMargin = margin;
              }

              if (placed.length === 0) {
                minMargin = 1.0;
                minPeerDist = 2.0;
              }

              const inSector = isAny || isInSectorRange(a, sectorRange.minDeg, sectorRange.maxDeg);
              const sectorBonus = inSector ? 3.0 : 0;
              const score =
                (minMargin >= 0 ? 50.0 + Math.min(minPeerDist, 2.5) * 2.0 : minMargin * 40.0) +
                sectorBonus -
                Math.abs(candR - distance) * 0.5;

              if (score > bestScore) {
                bestScore = score;
                bestA = a;
                bestR = candR;
                bestMinMargin = minMargin;
              }
            }
          }
          return { bestA, bestR, bestMinMargin };
        };

        let spot = findBestStandardSpot(baseCandRadii, true);
        if (spot.bestMinMargin < 0 && !isAny) {
          spot = findBestStandardSpot(baseCandRadii, false);
        }
        let expandStep = 1;
        while (spot.bestMinMargin < 0 && expandStep <= 6) {
          const extraR = Number((maxR + expandStep * 0.35).toFixed(2));
          spot = findBestStandardSpot([extraR], false);
          expandStep++;
        }

        targetAngle = spot.bestA;
        distance = spot.bestR;
      }

      let actualZone: PlantingZone = zone;
      if (isFennelPlant(plant) || isWormwoodPlant(plant) || distance > metrics.dripZoneOuterM + 0.05) {
        actualZone = 'ZONE_4_OUTER';
      } else if (distance > metrics.midZoneOuterM + 0.05) {
        actualZone = 'ZONE_3_DRIP';
      } else if (distance > metrics.bulbRingOuterM + 0.05) {
        actualZone = 'ZONE_2_MID';
      }

      placed.push({
        instanceId: `placed-${plant.id}-${idx}`,
        plantId: plant.id,
        plant,
        angleDeg: Math.round(targetAngle),
        distanceM: Number(distance.toFixed(2)),
        zone: actualZone,
        sector: plant.preferredSector
      });
    });
  });

  return placed;
}

