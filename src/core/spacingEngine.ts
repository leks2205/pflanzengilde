import { isAreaPlant } from '../data/groundCoverSpecs';
import {
  ClimateZone,
  GuildPlant,
  GuildRole,
  Hemisphere,
  LocalizedString,
  PlacedPlant,
  PlantingZone,
  SoilType,
  StarTree
} from '../types/guild';
import {
  areLayersCompeting,
  autoPlaceGuildPlants,
  calculatePolarDistanceM,
  calculateSpatialMetrics
} from './placementRules';
import { ACTIVE_GUILD_PLANTS } from '../data/guildPlants';
import { isCompatibleWithGuild } from './compatibility';
import { formatNumber } from '../i18n/translations';

export interface AlternativeRolePlant {
  plant: GuildPlant;
  sharedRoles: GuildRole[];
  spreadReductionM: number;
  spreadReductionPercent: number;
  reason: LocalizedString;
}

export interface PlantOverlapConflict {
  id: string;
  plantA: PlacedPlant;
  plantB: PlacedPlant;
  distanceM: number;
  combinedRadiusM: number;
  overlapDistanceM: number;
  overlapPercent: number; // 0-100
  isSameLayer: boolean;
  severity: 'CRITICAL' | 'WARNING';
  suggestedAlternativesA: AlternativeRolePlant[];
  suggestedAlternativesB: AlternativeRolePlant[];
}

export interface ZoneSaturationReport {
  zone: PlantingZone;
  zoneAreaM2: number;
  plantsAreaM2: number;
  saturationPercent: number;
  isOvercrowded: boolean;
  plantCount: number;
}

export interface SpacingReport {
  hasConflicts: boolean;
  hasCritical: boolean;
  totalConflicts: number;
  conflicts: PlantOverlapConflict[];
  zoneSaturations: ZoneSaturationReport[];
}

/**
 * Up to three more compact catalog plants that share at least one role with a crowded plant.
 * Only plants compatible with the star and the remaining companions are offered (compatibility.ts).
 */
export function suggestAlternativeRolePlants(
  crowdedPlant: GuildPlant,
  starTree: StarTree,
  selectedPlants: GuildPlant[],
  selectedSoil?: SoilType,
  selectedZone?: ClimateZone
): AlternativeRolePlant[] {
  const selectedIds = new Set(selectedPlants.map(p => p.id));
  const remainingPlants = selectedPlants.filter(p => p.id !== crowdedPlant.id);

  const candidates: {
    plant: GuildPlant;
    sharedRoles: GuildRole[];
    spreadReductionM: number;
    spreadReductionPercent: number;
    score: number;
    reason: LocalizedString;
  }[] = [];

  const crowdedSpread = crowdedPlant.spreadM;

  ACTIVE_GUILD_PLANTS.forEach(candidate => {
    if (candidate.id === crowdedPlant.id || selectedIds.has(candidate.id)) return;

    const sharedRoles = candidate.roles.filter(r => crowdedPlant.roles.includes(r));
    if (sharedRoles.length === 0) return;

    if (selectedSoil && candidate.unsuitableSoils.includes(selectedSoil)) return;
    if (selectedZone && !candidate.climateZones.includes(selectedZone)) return;
    if (!isCompatibleWithGuild(candidate, starTree, remainingPlants)) return;

    const spreadDiff = crowdedSpread - candidate.spreadM;
    const isMoreCompact = spreadDiff >= 0.15;
    const isComplementaryLayer =
      (crowdedPlant.layer === 'SHRUB' || crowdedPlant.layer === 'HERBACEOUS') &&
      (candidate.layer === 'GROUND_COVER' || candidate.layer === 'BULB_ROOT');

    if (!isMoreCompact && !isComplementaryLayer) return;

    const spreadReductionPercent = crowdedSpread > 0
      ? Math.max(0, Math.round((spreadDiff / crowdedSpread) * 100))
      : 0;

    // 20 per shared role, 1 per % space saved, bonuses for star recommendation and soil fit
    let score = sharedRoles.length * 20 + spreadReductionPercent;
    if (
      candidate.recommendedForTrees.includes(starTree.id) ||
      starTree.recommendedCompanions.includes(candidate.id)
    ) {
      score += 15;
    }
    if (candidate.suitableSoils.includes(selectedSoil || 'LOAM')) {
      score += 10;
    }

    const reason: LocalizedString = {
      de: isMoreCompact
        ? `${formatNumber(spreadDiff, 1, 'de')} m kompakter (${spreadReductionPercent}% weniger Platzbedarf) bei Übernahme von ${sharedRoles.length} Kern-Rolle(n).`
        : `Nischendifferenzierte Schicht (${candidate.layer === 'BULB_ROOT' ? 'Wurzel-/Zwiebelschicht' : 'Bodendecker'}) zur Entlastung des Kronenraums.`,
      en: isMoreCompact
        ? `${formatNumber(spreadDiff, 1, 'en')} m more compact (${spreadReductionPercent}% space saved) while fulfilling ${sharedRoles.length} core role(s).`
        : `Vertically stratified layer (${candidate.layer === 'BULB_ROOT' ? 'Bulb/Root' : 'Ground Cover'}) alleviating canopy competition.`
    };

    candidates.push({
      plant: candidate,
      sharedRoles,
      spreadReductionM: Math.max(0, Number(spreadDiff.toFixed(2))),
      spreadReductionPercent,
      score,
      reason
    });
  });

  candidates.sort((a, b) => b.score - a.score);

  return candidates.slice(0, 3).map(c => ({
    plant: c.plant,
    sharedRoles: c.sharedRoles,
    spreadReductionM: c.spreadReductionM,
    spreadReductionPercent: c.spreadReductionPercent,
    reason: c.reason
  }));
}

/** Crown overlaps between placed plants and how full each planting ring is. */
export function analyzeGuildSpacing(
  starTree: StarTree,
  selectedPlants: GuildPlant[],
  hemisphere: Hemisphere = 'NORTHERN',
  selectedSoil?: SoilType,
  selectedZone?: ClimateZone
): SpacingReport {
  const metrics = calculateSpatialMetrics(starTree);
  const placedPlants = autoPlaceGuildPlants(starTree, selectedPlants, hemisphere);

  const zoneDefinitions: { zone: PlantingZone; innerR: number; outerR: number }[] = [
    { zone: 'ZONE_1_BULB', innerR: metrics.bulbRingInnerM, outerR: metrics.bulbRingOuterM },
    { zone: 'ZONE_2_MID', innerR: metrics.midZoneInnerM, outerR: metrics.midZoneOuterM },
    { zone: 'ZONE_3_DRIP', innerR: metrics.dripZoneInnerM, outerR: metrics.dripZoneOuterM },
    { zone: 'ZONE_4_OUTER', innerR: metrics.dripZoneOuterM, outerR: metrics.outerZoneMaxM }
  ];

  const zoneSaturations: ZoneSaturationReport[] = zoneDefinitions.map(def => {
    const zoneAreaM2 = Math.PI * (def.outerR * def.outerR - def.innerR * def.innerR);
    // Area plants (ground covers) are drawn as areas that share the ground; they don't crowd a zone
    const plantsInZone = placedPlants.filter(p => p.zone === def.zone && !isAreaPlant(p.plant));
    const plantsAreaM2 = plantsInZone.reduce((sum, p) => {
      const r = p.plant.spreadM / 2;
      return sum + Math.PI * r * r;
    }, 0);

    const saturationPercent = Math.round((plantsAreaM2 / Math.max(zoneAreaM2, 0.1)) * 100);

    return {
      zone: def.zone,
      zoneAreaM2: Number(zoneAreaM2.toFixed(2)),
      plantsAreaM2: Number(plantsAreaM2.toFixed(2)),
      saturationPercent,
      isOvercrowded: saturationPercent > 85,
      plantCount: plantsInZone.length
    };
  });

  const conflicts: PlantOverlapConflict[] = [];
  const alternativesCache = new Map<string, AlternativeRolePlant[]>();
  const alternativesFor = (plant: GuildPlant): AlternativeRolePlant[] => {
    let alts = alternativesCache.get(plant.id);
    if (!alts) {
      alts = suggestAlternativeRolePlants(plant, starTree, selectedPlants, selectedSoil, selectedZone);
      alternativesCache.set(plant.id, alts);
    }
    return alts;
  };

  for (let i = 0; i < placedPlants.length; i++) {
    for (let j = i + 1; j < placedPlants.length; j++) {
      const pA = placedPlants[i];
      const pB = placedPlants[j];

      // Ground covers grow as areas around other plants (holes are built into their shape)
      if (isAreaPlant(pA.plant) || isAreaPlant(pB.plant)) continue;
      const distanceM = calculatePolarDistanceM(pA.distanceM, pA.angleDeg, pB.distanceM, pB.angleDeg);

      const rA = pA.plant.spreadM / 2;
      const rB = pB.plant.spreadM / 2;
      const combinedRadiusM = rA + rB;

      if (distanceM < combinedRadiusM) {
        const overlapDistanceM = combinedRadiusM - distanceM;
        const overlapPercent = Math.round((overlapDistanceM / combinedRadiusM) * 100);

        const isSameLayer = pA.plant.layer === pB.plant.layer;
        const layersCompeting = areLayersCompeting(pA.plant.layer, pB.plant.layer);

        // Competing layers: >= 30 % warning, >= 50 % critical. Stacked layers: >= 65 % warning.
        let shouldTrigger = false;
        let severity: 'CRITICAL' | 'WARNING' = 'WARNING';

        if (layersCompeting) {
          if (overlapPercent >= 50) {
            shouldTrigger = true;
            severity = 'CRITICAL';
          } else if (overlapPercent >= 30) {
            shouldTrigger = true;
            severity = 'WARNING';
          }
        } else {
          if (overlapPercent >= 65) {
            shouldTrigger = true;
            severity = 'WARNING';
          }
        }

        if (shouldTrigger) {
          const suggestedAlternativesA = alternativesFor(pA.plant);
          const suggestedAlternativesB = alternativesFor(pB.plant);

          conflicts.push({
            id: `overlap-${pA.plant.id}-${pB.plant.id}`,
            plantA: pA,
            plantB: pB,
            distanceM: Number(distanceM.toFixed(2)),
            combinedRadiusM: Number(combinedRadiusM.toFixed(2)),
            overlapDistanceM: Number(overlapDistanceM.toFixed(2)),
            overlapPercent,
            isSameLayer,
            severity,
            suggestedAlternativesA,
            suggestedAlternativesB
          });
        }
      }
    }
  }

  conflicts.sort((a, b) => {
    if (a.severity === 'CRITICAL' && b.severity !== 'CRITICAL') return -1;
    if (b.severity === 'CRITICAL' && a.severity !== 'CRITICAL') return 1;
    return b.overlapPercent - a.overlapPercent;
  });

  const hasCritical = conflicts.some(c => c.severity === 'CRITICAL');

  return {
    hasConflicts: conflicts.length > 0 || zoneSaturations.some(z => z.isOvercrowded),
    hasCritical,
    totalConflicts: conflicts.length,
    conflicts,
    zoneSaturations
  };
}
