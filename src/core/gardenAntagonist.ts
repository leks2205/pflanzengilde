import { GardenCompanionInstance, GardenConflict, GardenShadePocket, GardenStarPlantInstance } from '../types/garden';
import {
  isAlliumPlant,
  isLegumePlant,
  isFennelPlant,
  isWormwoodPlant,
  isStrictAcidophilePlant,
  isStrictCalcicolePlant
} from './placementRules';
import { PEST_HOST_CONFLICTS } from './pestHostConflicts';
import { en } from '../i18n/en';
import { de } from '../i18n/de';
import { formatNumber } from '../i18n/translations';

type AntagonistMsgKey = keyof typeof en & keyof typeof de;

/** Fills {placeholder} tokens in a message template. */
function fillMsg(template: string, vars: Record<string, string>): string {
  return Object.keys(vars).reduce((acc, k) => acc.replace(`{${k}}`, vars[k]), template);
}

/** Builds a bilingual message from the central string files. */
function locMsg(
  key: AntagonistMsgKey,
  deVars: Record<string, string>,
  enVars: Record<string, string>
): { de: string; en: string } {
  return { de: fillMsg(de[key], deVars), en: fillMsg(en[key], enVars) };
}

const JUGLONE_SENSITIVE_STAR_IDS = new Set([
  'tree-apple',
  'tree-pear',
  'tree-cherry',
  'tree-plum',
  'tree-peach',
  'tree-apricot',
  'tree-quince',
  'tree-hazelnut',
  'shrub-blueberry',
  'shrub-rhododendron',
  'vine-grape',
  'tree-tea-sinensis',
  'tree-tea-assamica',
  'herb-rhubarb'
]);

const STRICT_ACIDOPHILE_STAR_IDS = new Set([
  'shrub-blueberry',
  'shrub-rhododendron',
  'tree-tea-sinensis',
  'tree-tea-assamica',
  'tree-chestnut'
]);

const STRICT_CALCICOLE_STAR_IDS = new Set([
  'tree-fig'
]);

/** All pairwise spatial antagonisms between star trees and companions in the garden. */
export function analyzeGardenAntagonisms(
  starPlants: GardenStarPlantInstance[],
  placedCompanions: GardenCompanionInstance[]
): GardenConflict[] {
  const conflicts: GardenConflict[] = [];

  // Walnut juglone vs. sensitive trees (20 m) and companions (15 m)
  const walnuts = starPlants.filter(t => t.starTree.jugloneProducer);

  for (const walnut of walnuts) {
    for (const otherTree of starPlants) {
      if (otherTree.instanceId === walnut.instanceId) continue;

      const dist = Math.hypot(otherTree.xM - walnut.xM, otherTree.yM - walnut.yM);
      const bot = otherTree.starTree.botanicalName;
      const isSensitiveTree =
        JUGLONE_SENSITIVE_STAR_IDS.has(otherTree.starTree.id) ||
        bot.includes('Prunus') ||
        bot.includes('Malus') ||
        bot.includes('Pyrus') ||
        bot.includes('Cydonia') ||
        bot.includes('Vaccinium') ||
        bot.includes('Rhododendron') ||
        bot.includes('Vitis') ||
        bot.includes('Camellia') ||
        bot.includes('Rheum');

      if (isSensitiveTree && dist < 20.0) {
        conflicts.push({
          id: `juglone-tree-${walnut.instanceId}-${otherTree.instanceId}`,
          severity: 'CRITICAL',
          type: 'JUGLONE',
          title: locMsg(
            'gardenAntagonistJugloneTreeTitle',
            { name: otherTree.starTree.commonName.de },
            { name: otherTree.starTree.commonName.en }
          ),
          description: locMsg(
            'gardenAntagonistJugloneTreeDesc',
            { botanical: otherTree.starTree.botanicalName, dist: formatNumber(dist, 1, 'de') },
            { botanical: otherTree.starTree.botanicalName, dist: formatNumber(dist, 1, 'en') }
          ),
          distanceM: Number(dist.toFixed(1)),
          requiredDistanceM: 20.0,
          plantA: { id: walnut.instanceId, name: walnut.starTree.commonName, xM: walnut.xM, yM: walnut.yM },
          plantB: { id: otherTree.instanceId, name: otherTree.starTree.commonName, xM: otherTree.xM, yM: otherTree.yM }
        });
      }
    }

    for (const comp of placedCompanions) {
      if (comp.plant.jugloneTolerance === 'SENSITIVE') {
        const dist = Math.hypot(comp.xM - walnut.xM, comp.yM - walnut.yM);
        if (dist < 15.0) {
          conflicts.push({
            id: `juglone-comp-${walnut.instanceId}-${comp.instanceId}`,
            severity: 'CRITICAL',
            type: 'JUGLONE',
            title: locMsg(
              'gardenAntagonistJugloneCompTitle',
              { name: comp.plant.commonName.de },
              { name: comp.plant.commonName.en }
            ),
            description: locMsg(
              'gardenAntagonistJugloneCompDesc',
              { name: comp.plant.commonName.de, botanical: comp.plant.botanicalName, dist: formatNumber(dist, 1, 'de') },
              { name: comp.plant.commonName.en, botanical: comp.plant.botanicalName, dist: formatNumber(dist, 1, 'en') }
            ),
            distanceM: Number(dist.toFixed(1)),
            requiredDistanceM: 15.0,
            plantA: { id: walnut.instanceId, name: walnut.starTree.commonName, xM: walnut.xM, yM: walnut.yM },
            plantB: { id: comp.instanceId, name: comp.plant.commonName, xM: comp.xM, yM: comp.yM }
          });
        }
      }
    }
  }

  // Alliums inhibit nodulation of legumes and N-fixing trees (1.8 m)
  const alliums = placedCompanions.filter(c => isAlliumPlant(c.plant));
  const legumes = placedCompanions.filter(c => isLegumePlant(c.plant));
  const nFixingTrees = starPlants.filter(t => t.starTree.category === 'NITROGEN_FIXING_TREE');

  for (const allium of alliums) {
    for (const legume of legumes) {
      const dist = Math.hypot(legume.xM - allium.xM, legume.yM - allium.yM);
      if (dist < 1.8) {
        conflicts.push({
          id: `allium-legume-${allium.instanceId}-${legume.instanceId}`,
          severity: 'WARNING',
          type: 'ALLIUM_LEGUME',
          title: locMsg(
            'gardenAntagonistAlliumLegumeTitle',
            { allium: allium.plant.commonName.de, legume: legume.plant.commonName.de },
            { allium: allium.plant.commonName.en, legume: legume.plant.commonName.en }
          ),
          description: locMsg(
            'gardenAntagonistAlliumLegumeDesc',
            { dist: formatNumber(dist, 1, 'de') },
            { dist: formatNumber(dist, 1, 'en') }
          ),
          distanceM: Number(dist.toFixed(1)),
          requiredDistanceM: 1.8,
          plantA: { id: allium.instanceId, name: allium.plant.commonName, xM: allium.xM, yM: allium.yM },
          plantB: { id: legume.instanceId, name: legume.plant.commonName, xM: legume.xM, yM: legume.yM }
        });
      }
    }

    for (const nTree of nFixingTrees) {
      const dist = Math.hypot(nTree.xM - allium.xM, nTree.yM - allium.yM);
      if (dist < 1.8) {
        conflicts.push({
          id: `allium-ntree-${allium.instanceId}-${nTree.instanceId}`,
          severity: 'WARNING',
          type: 'ALLIUM_LEGUME',
          title: locMsg(
            'gardenAntagonistAlliumTreeTitle',
            { allium: allium.plant.commonName.de, tree: nTree.starTree.commonName.de },
            { allium: allium.plant.commonName.en, tree: nTree.starTree.commonName.en }
          ),
          description: locMsg(
            'gardenAntagonistAlliumTreeDesc',
            { allium: allium.plant.commonName.de, tree: nTree.starTree.commonName.de, dist: formatNumber(dist, 1, 'de') },
            { allium: allium.plant.commonName.en, tree: nTree.starTree.commonName.en, dist: formatNumber(dist, 1, 'en') }
          ),
          distanceM: Number(dist.toFixed(1)),
          requiredDistanceM: 1.8,
          plantA: { id: allium.instanceId, name: allium.plant.commonName, xM: allium.xM, yM: allium.yM },
          plantB: { id: nTree.instanceId, name: nTree.starTree.commonName, xM: nTree.xM, yM: nTree.yM }
        });
      }
    }
  }

  // Fennel allelopathy (1.5 m)
  const fennels = placedCompanions.filter(c => isFennelPlant(c.plant));
  for (const fennel of fennels) {
    for (const other of placedCompanions) {
      if (other.instanceId === fennel.instanceId) continue;
      if (isFennelPlant(other.plant) && fennel.instanceId > other.instanceId) continue;
      const dist = Math.hypot(other.xM - fennel.xM, other.yM - fennel.yM);
      if (dist < 1.5) {
        conflicts.push({
          id: `fennel-allelopathy-${fennel.instanceId}-${other.instanceId}`,
          severity: 'WARNING',
          type: 'FENNEL_ALLELOPATHY',
          title: locMsg(
            'gardenAntagonistFennelTitle',
            { fennel: fennel.plant.commonName.de, other: other.plant.commonName.de },
            { fennel: fennel.plant.commonName.en, other: other.plant.commonName.en }
          ),
          description: locMsg(
            'gardenAntagonistFennelDesc',
            { other: other.plant.commonName.de, dist: formatNumber(dist, 1, 'de') },
            { other: other.plant.commonName.en, dist: formatNumber(dist, 1, 'en') }
          ),
          distanceM: Number(dist.toFixed(1)),
          requiredDistanceM: 1.5,
          plantA: { id: fennel.instanceId, name: fennel.plant.commonName, xM: fennel.xM, yM: fennel.yM },
          plantB: { id: other.instanceId, name: other.plant.commonName, xM: other.xM, yM: other.yM }
        });
      }
    }
  }

  // Wormwood allelopathy (1.2 m); Ribes tolerate it
  const wormwoods = placedCompanions.filter(c => isWormwoodPlant(c.plant));
  for (const wormwood of wormwoods) {
    for (const other of placedCompanions) {
      if (other.instanceId === wormwood.instanceId) continue;
      if (other.plant.botanicalName.toLowerCase().startsWith('ribes')) continue;
      if (isFennelPlant(other.plant)) continue; // reported by the fennel check
      if (isWormwoodPlant(other.plant) && wormwood.instanceId > other.instanceId) continue;
      const dist = Math.hypot(other.xM - wormwood.xM, other.yM - wormwood.yM);
      if (dist < 1.2) {
        conflicts.push({
          id: `wormwood-allelopathy-${wormwood.instanceId}-${other.instanceId}`,
          severity: 'WARNING',
          type: 'WORMWOOD_ALLELOPATHY',
          title: locMsg(
            'gardenAntagonistWormwoodTitle',
            { wormwood: wormwood.plant.commonName.de, other: other.plant.commonName.de },
            { wormwood: wormwood.plant.commonName.en, other: other.plant.commonName.en }
          ),
          description: locMsg(
            'gardenAntagonistWormwoodDesc',
            { other: other.plant.commonName.de, dist: formatNumber(dist, 1, 'de') },
            { other: other.plant.commonName.en, dist: formatNumber(dist, 1, 'en') }
          ),
          distanceM: Number(dist.toFixed(1)),
          requiredDistanceM: 1.2,
          plantA: { id: wormwood.instanceId, name: wormwood.plant.commonName, xM: wormwood.xM, yM: wormwood.yM },
          plantB: { id: other.instanceId, name: other.plant.commonName, xM: other.xM, yM: other.yM }
        });
      }
    }
  }

  // Soil pH: strict acidophiles vs. strict calcicoles (2.5 m)
  const acidElements: Array<{ id: string; name: { de: string; en: string }; xM: number; yM: number }> = [
    ...starPlants
      .filter(t => STRICT_ACIDOPHILE_STAR_IDS.has(t.starTree.id))
      .map(t => ({ id: t.instanceId, name: t.starTree.commonName, xM: t.xM, yM: t.yM })),
    ...placedCompanions
      .filter(c => isStrictAcidophilePlant(c.plant))
      .map(c => ({ id: c.instanceId, name: c.plant.commonName, xM: c.xM, yM: c.yM }))
  ];

  const calcElements: Array<{ id: string; name: { de: string; en: string }; xM: number; yM: number }> = [
    ...starPlants
      .filter(t => STRICT_CALCICOLE_STAR_IDS.has(t.starTree.id))
      .map(t => ({ id: t.instanceId, name: t.starTree.commonName, xM: t.xM, yM: t.yM })),
    ...placedCompanions
      .filter(c => isStrictCalcicolePlant(c.plant))
      .map(c => ({ id: c.instanceId, name: c.plant.commonName, xM: c.xM, yM: c.yM }))
  ];

  for (const acid of acidElements) {
    for (const calc of calcElements) {
      const dist = Math.hypot(calc.xM - acid.xM, calc.yM - acid.yM);
      if (dist < 2.5) {
        conflicts.push({
          id: `edaphic-ph-${acid.id}-${calc.id}`,
          severity: 'WARNING',
          type: 'EDAPHIC_PH',
          title: locMsg(
            'gardenAntagonistSoilPhTitle',
            { acid: acid.name.de, calc: calc.name.de },
            { acid: acid.name.en, calc: calc.name.en }
          ),
          description: locMsg(
            'gardenAntagonistSoilPhDesc',
            { dist: formatNumber(dist, 1, 'de'), acid: acid.name.de, calc: calc.name.de },
            { dist: formatNumber(dist, 1, 'en'), acid: acid.name.en, calc: calc.name.en }
          ),
          distanceM: Number(dist.toFixed(1)),
          requiredDistanceM: 2.5,
          plantA: acid,
          plantB: calc
        });
      }
    }
  }

  // Pest/pathogen reservoir hosts near susceptible star plants (see pestHostConflicts.ts)
  for (const spec of PEST_HOST_CONFLICTS.filter(c => c.kind === 'INTERNAL')) {
    const hosts = [
      ...placedCompanions
        .filter(c => spec.hostPlantIds.includes(c.plantId))
        .map(c => ({ id: c.instanceId, name: c.plant.commonName, xM: c.xM, yM: c.yM })),
      ...starPlants
        .filter(t => spec.hostStarIds.includes(t.starTree.id))
        .map(t => ({ id: t.instanceId, name: t.starTree.commonName, xM: t.xM, yM: t.yM }))
    ];
    for (const star of starPlants.filter(t => spec.starTreeIds.includes(t.starTree.id))) {
      for (const host of hosts) {
        const dist = Math.hypot(host.xM - star.xM, host.yM - star.yM);
        if (dist >= spec.safeDistanceM) continue;
        conflicts.push({
          id: `${spec.id}-${star.instanceId}-${host.id}`,
          severity: spec.severity,
          type: 'PEST_HOST',
          title: {
            de: `${spec.title.de}: ${host.name.de} ↔ ${star.starTree.commonName.de}`,
            en: `${spec.title.en}: ${host.name.en} ↔ ${star.starTree.commonName.en}`
          },
          description: locMsg(
            'gardenAntagonistPestHostDesc',
            { mechanism: spec.mechanism.de, dist: formatNumber(dist, 1, 'de'), safe: String(spec.safeDistanceM) },
            { mechanism: spec.mechanism.en, dist: formatNumber(dist, 1, 'en'), safe: String(spec.safeDistanceM) }
          ),
          distanceM: Number(dist.toFixed(1)),
          requiredDistanceM: spec.safeDistanceM,
          plantA: { id: star.instanceId, name: star.starTree.commonName, xM: star.xM, yM: star.yM },
          plantB: host
        });
      }
    }
  }

  // Trunks too close together
  for (let i = 0; i < starPlants.length; i++) {
    for (let j = i + 1; j < starPlants.length; j++) {
      const t1 = starPlants[i];
      const t2 = starPlants[j];
      const dist = Math.hypot(t2.xM - t1.xM, t2.yM - t1.yM);
      const minTrunkDist = Math.max(1.5, (t1.starTree.matureRadiusM + t2.starTree.matureRadiusM) * 0.4);

      if (dist < minTrunkDist) {
        conflicts.push({
          id: `trunk-collision-${t1.instanceId}-${t2.instanceId}`,
          severity: dist < 1.5 ? 'CRITICAL' : 'WARNING',
          type: 'TRUNK_COLLISION',
          title: locMsg(
            'gardenAntagonistTrunkTitle',
            { a: t1.starTree.commonName.de, b: t2.starTree.commonName.de },
            { a: t1.starTree.commonName.en, b: t2.starTree.commonName.en }
          ),
          description: locMsg(
            'gardenAntagonistTrunkDesc',
            { dist: formatNumber(dist, 1, 'de'), min: formatNumber(minTrunkDist, 1, 'de') },
            { dist: formatNumber(dist, 1, 'en'), min: formatNumber(minTrunkDist, 1, 'en') }
          ),
          distanceM: Number(dist.toFixed(1)),
          requiredDistanceM: Number(minTrunkDist.toFixed(1)),
          plantA: { id: t1.instanceId, name: t1.starTree.commonName, xM: t1.xM, yM: t1.yM },
          plantB: { id: t2.instanceId, name: t2.starTree.commonName, xM: t2.xM, yM: t2.yM }
        });
      }
    }
  }

  return conflicts;
}

/** Deep-shade pockets where two mature canopies overlap substantially. */
export function detectGardenShadePockets(
  starPlants: GardenStarPlantInstance[]
): GardenShadePocket[] {
  const pockets: GardenShadePocket[] = [];

  for (let i = 0; i < starPlants.length; i++) {
    for (let j = i + 1; j < starPlants.length; j++) {
      const t1 = starPlants[i];
      const t2 = starPlants[j];
      const dist = Math.hypot(t2.xM - t1.xM, t2.yM - t1.yM);
      const combinedRadius = t1.starTree.matureRadiusM + t2.starTree.matureRadiusM;

      if (dist < combinedRadius * 0.85) {
        const midX = Number(((t1.xM + t2.xM) / 2).toFixed(2));
        const midY = Number(((t1.yM + t2.yM) / 2).toFixed(2));
        const overlapWidth = Number(((combinedRadius - dist) / 2).toFixed(1));

        pockets.push({
          id: `shade-${t1.instanceId}-${t2.instanceId}`,
          xM: midX,
          yM: midY,
          radiusM: Math.max(0.8, overlapWidth),
          treeIds: [t1.instanceId, t2.instanceId],
          shadeLevel: 'DEEP_SHADE',
          suggestedPlantIds: ['plant-comfrey', 'plant-sweet-cicely', 'plant-hosta', 'plant-wild-garlic']
        });
      }
    }
  }

  return pockets;
}
