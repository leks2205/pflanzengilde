import { STAR_TREES } from '../src/data/starTrees';
import { GUILD_PLANTS } from '../src/data/guildPlants';
import { autoPlaceGuildPlants, isAlliumPlant, isLegumePlant } from '../src/core/placementRules';
import { analyzeGuildAntagonisms } from '../src/core/antagonistEngine';
import { analyzeGuildSpacing } from '../src/core/spacingEngine';
import { optimizeGardenCompanions } from '../src/core/gardenOptimizer';
import { analyzeGardenAntagonisms } from '../src/core/gardenAntagonist';
import { generateGardenPlanPdfDoc } from '../src/core/gardenPdfExporter';
import { generateGuildPdf } from '../src/core/pdfExporter';
import { GardenStarPlantInstance } from '../src/types/garden';
import { Hemisphere } from '../src/types/guild';

let allPassed = true;
const fail = (msg: string) => {
  console.error(`FAIL: ${msg}`);
  allPassed = false;
};

const getPlant = (id: string) => {
  const p = GUILD_PLANTS.find(x => x.id === id);
  if (!p) throw new Error(`Missing plant ${id}`);
  return p;
};

const getTree = (id: string) => {
  const t = STAR_TREES.find(x => x.id === id);
  if (!t) throw new Error(`Missing tree ${id}`);
  return t;
};

const SPATIAL_CONFLICT_IDS = new Set([
  'internal-allium-legume-proximity',
  'internal-allium-nfixing-tree-proximity',
  'internal-fennel-allelopathy',
  'internal-wormwood-allelopathy',
]);

// 1. Default recommendedCompanions: no conflicts and no crown overlap in either hemisphere
const hemispheres: Hemisphere[] = ['NORTHERN', 'SOUTHERN'];
for (const hemi of hemispheres) {
  for (const tree of STAR_TREES) {
    const recCompanions = tree.recommendedCompanions
      .map(id => GUILD_PLANTS.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));

    const report = analyzeGuildAntagonisms(tree, recCompanions, hemi);
    const internalConflicts = report.conflicts.filter(c => c.type === 'INTERNAL_PROXIMITY');
    if (internalConflicts.length > 0) {
      fail(
        `[${hemi}] Default guild for ${tree.id} has ${internalConflicts.length} internal conflicts: ` +
        internalConflicts.map(c => `${c.id} (${c.affectedPlants.map(a => a.id).join(', ')})`).join('; ')
      );
    }

    const spacing = analyzeGuildSpacing(tree, recCompanions, hemi);
    if (spacing.hasConflicts) {
      fail(
        `[${hemi}] Default guild for ${tree.id} has ${spacing.totalConflicts} physical crown overlap conflicts: ` +
        spacing.conflicts.map(c => `${c.plantA.plantId} vs ${c.plantB.plantId} (${c.distanceM.toFixed(2)}m < ${c.combinedRadiusM.toFixed(2)}m)`).join('; ')
      );
    }

    // Also test single-tree Garden Builder optimization for each star tree
    const inst: GardenStarPlantInstance = {
      instanceId: `inst-${tree.id}`,
      treeId: tree.id,
      starTree: tree,
      xM: 12,
      yM: -8,
      selectedPlantIds: tree.recommendedCompanions,
    };
    const opt = optimizeGardenCompanions([inst], GUILD_PLANTS, hemi);
    const gardenConflicts = analyzeGardenAntagonisms([inst], opt.companions);
    if (gardenConflicts.length > 0) {
      fail(
        `[${hemi}] Default garden guild for ${tree.id} has ${gardenConflicts.length} garden conflicts: ` +
        gardenConflicts.map(c => `${c.type}: ${c.title.en}`).join('; ')
      );
    }
  }
}

// 2. Auto-placement keeps Allium, Legume, Fennel and Wormwood apart for every star and hemisphere
const fennelPlant = getPlant('plant-fennel');
const wormwoodPlant = getPlant('plant-wormwood');
const allAlliums = GUILD_PLANTS.filter(isAlliumPlant);
const allLegumes = GUILD_PLANTS.filter(isLegumePlant);

for (const hemi of hemispheres) {
  for (const tree of STAR_TREES) {
    const recCompanions = tree.recommendedCompanions
      .map(id => GUILD_PLANTS.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));

    // 2A. Default guild + Fennel + Wormwood
    const withFennelAndWormwood = [
      ...recCompanions,
      ...(recCompanions.some(p => p.id === 'plant-fennel') ? [] : [fennelPlant]),
      ...(recCompanions.some(p => p.id === 'plant-wormwood') ? [] : [wormwoodPlant]),
    ];
    const fwReport = analyzeGuildAntagonisms(tree, withFennelAndWormwood, hemi);
    const fwSpatialConflicts = fwReport.conflicts.filter(c => SPATIAL_CONFLICT_IDS.has(c.id));
    if (fwSpatialConflicts.length > 0) {
      fail(
        `[${hemi}] ${tree.id} + Fennel + Wormwood produced spatial conflicts: ` +
        fwSpatialConflicts.map(c => `${c.id}: ${c.spatialAdvice.en}`).join('; ')
      );
    }
    if (!fwReport.resolvedHarmonies.some(h => h.id === 'resolved-fennel-allelopathy-spacing' && h.affectedPlants.length >= 2)) {
      fail(`[${hemi}] ${tree.id} + Fennel did not emit resolved-fennel-allelopathy-spacing with nearest neighbor`);
    }
    if (!fwReport.resolvedHarmonies.some(h => h.id === 'resolved-wormwood-allelopathy-spacing')) {
      fail(`[${hemi}] ${tree.id} + Wormwood did not emit resolved-wormwood-allelopathy-spacing`);
    }

    // 2B. All alliums + all legumes + fennel + wormwood together
    const multiAlliumLegumeMix = [...allAlliums, ...allLegumes, fennelPlant, wormwoodPlant];
    const malReport = analyzeGuildAntagonisms(tree, multiAlliumLegumeMix, hemi);
    const malSpatialConflicts = malReport.conflicts.filter(c => SPATIAL_CONFLICT_IDS.has(c.id));
    if (malSpatialConflicts.length > 0) {
      fail(
        `[${hemi}] ${tree.id} with all alliums + legumes + fennel + wormwood produced spatial conflicts: ` +
        malSpatialConflicts.map(c => `${c.id}: ${c.spatialAdvice.en}`).join('; ')
      );
    }
    if (tree.category === 'NITROGEN_FIXING_TREE') {
      if (!malReport.resolvedHarmonies.some(h => h.id === 'resolved-allium-nfixing-tree-spacing')) {
        fail(`[${hemi}] N-fixing tree ${tree.id} did not emit resolved-allium-nfixing-tree-spacing`);
      }
    }

    // 2C. Every single companion plant added to default guild
    for (const extraPlant of GUILD_PLANTS) {
      const testSet = recCompanions.some(p => p.id === extraPlant.id)
        ? recCompanions
        : [...recCompanions, extraPlant];
      const rep = analyzeGuildAntagonisms(tree, testSet, hemi);
      const spConf = rep.conflicts.filter(c => SPATIAL_CONFLICT_IDS.has(c.id));
      if (spConf.length > 0) {
        fail(
          `[${hemi}] ${tree.id} + ${extraPlant.id} produced spatial conflict: ` +
          spConf.map(c => `${c.id}: ${c.spatialAdvice.en}`).join('; ')
        );
      }
    }
  }
}

// 2D. Full plant database on every star
for (const tree of STAR_TREES) {
  const stressRep = analyzeGuildAntagonisms(tree, GUILD_PLANTS, 'NORTHERN');
  const stressSpConf = stressRep.conflicts.filter(c => SPATIAL_CONFLICT_IDS.has(c.id));
  if (stressSpConf.length > 0) {
    fail(
      `Full-database stress test on ${tree.id} produced spatial conflicts: ` +
      stressSpConf.map(c => `${c.id}: ${c.spatialAdvice.en}`).join('; ')
    );
  }
}

// 3. Antagonisms are flagged in both Guild Builder and Garden Builder
const apple = getTree('tree-apple');
const walnut = getTree('tree-walnut');
const alder = getTree('tree-alder');

// 3A. Walnut Juglone vs Sensitive Companions (Alfalfa, Lupine, Cranberry, Tea, Rosemary, Wormwood, Thyme)
const jugloneSensitiveIds = [
  'plant-alfalfa',
  'plant-lupine',
  'plant-cranberry',
  'plant-tea-sinensis',
  'plant-rosemary',
  'plant-wormwood',
  'plant-thyme',
];
for (const sensId of jugloneSensitiveIds) {
  const sensPlant = getPlant(sensId);
  const gReport = analyzeGuildAntagonisms(walnut, [sensPlant], 'NORTHERN');
  if (!gReport.conflicts.some(c => c.id === 'internal-walnut-sensitive-companions')) {
    fail(`Guild Builder did not flag ${sensId} as juglone-sensitive under tree-walnut`);
  }

  const wInst: GardenStarPlantInstance = {
    instanceId: 'w1',
    treeId: walnut.id,
    starTree: walnut,
    xM: 0,
    yM: 0,
    selectedPlantIds: [sensId],
  };
  const gConflicts = analyzeGardenAntagonisms([wInst], [
    {
      instanceId: 'c1',
      plantId: sensId,
      plant: sensPlant,
      xM: 2.0,
      yM: 0,
      isMerged: false,
      servicingTreeIds: ['w1'],
      currentLightCondition: 'FULL_SUN',
    },
  ]);
  if (!gConflicts.some(c => c.type === 'JUGLONE')) {
    fail(`Garden Builder did not flag ${sensId} within 2.0m of tree-walnut as JUGLONE conflict`);
  }
}

// 3B. Allium vs Legume (< 1.8m) in Guild Builder & Garden Builder
{
  const chives = getPlant('plant-chives');
  const clover = getPlant('plant-white-clover');
  const customClosePlaced = [
    { plantId: chives.id, plant: chives, distanceM: 1.0, angleDeg: 90, zone: 'ZONE_1_BULB' as const, sector: 'EAST_MORNING' as const },
    { plantId: clover.id, plant: clover, distanceM: 1.8, angleDeg: 90, zone: 'ZONE_2_MID' as const, sector: 'EAST_MORNING' as const }, // 0.8m apart
  ];
  const gReport = analyzeGuildAntagonisms(apple, [chives, clover], customClosePlaced);
  if (!gReport.conflicts.some(c => c.id === 'internal-allium-legume-proximity')) {
    fail('Guild Builder did not flag Allium + Legume placed 0.8m apart');
  }

  const aInst: GardenStarPlantInstance = {
    instanceId: 'a1',
    treeId: apple.id,
    starTree: apple,
    xM: 0,
    yM: 0,
    selectedPlantIds: [chives.id, clover.id],
  };
  const gConflicts = analyzeGardenAntagonisms([aInst], [
    { instanceId: 'c1', plantId: chives.id, plant: chives, xM: 1.0, yM: 0, isMerged: false, servicingTreeIds: ['a1'], currentLightCondition: 'FULL_SUN' },
    { instanceId: 'c2', plantId: clover.id, plant: clover, xM: 2.1, yM: 0, isMerged: false, servicingTreeIds: ['a1'], currentLightCondition: 'FULL_SUN' }, // 1.1m apart
  ]);
  if (!gConflicts.some(c => c.type === 'ALLIUM_LEGUME')) {
    fail('Garden Builder did not flag Allium + Legume placed 1.1m apart');
  }
}

// 3C. Allium vs Nitrogen-Fixing Star Tree (< 1.8m) in Guild Builder & Garden Builder
{
  const wildGarlic = getPlant('plant-wild-garlic');
  const customCollarPlaced = [
    { plantId: wildGarlic.id, plant: wildGarlic, distanceM: 0.9, angleDeg: 0, zone: 'ZONE_1_BULB' as const, sector: 'NORTH_SHADE' as const },
  ];
  const gReport = analyzeGuildAntagonisms(alder, [wildGarlic], customCollarPlaced);
  if (!gReport.conflicts.some(c => c.id === 'internal-allium-nfixing-tree-proximity')) {
    fail('Guild Builder did not flag Allium placed 0.9m from Nitrogen-Fixing Star Tree (Alder)');
  }

  const alderInst: GardenStarPlantInstance = {
    instanceId: 'alder1',
    treeId: alder.id,
    starTree: alder,
    xM: 0,
    yM: 0,
    selectedPlantIds: [wildGarlic.id],
  };
  const gConflicts = analyzeGardenAntagonisms([alderInst], [
    { instanceId: 'c1', plantId: wildGarlic.id, plant: wildGarlic, xM: 1.0, yM: 0, isMerged: false, servicingTreeIds: ['alder1'], currentLightCondition: 'FULL_SHADE' },
  ]);
  if (!gConflicts.some(c => c.type === 'ALLIUM_LEGUME' && c.id.includes('allium-ntree'))) {
    fail('Garden Builder did not flag Allium placed 1.0m from Nitrogen-Fixing Star Tree (Alder)');
  }
}

// 3D. Fennel Allelopathy (< 1.5m) in Guild Builder & Garden Builder
{
  const fennel = getPlant('plant-fennel');
  const borage = getPlant('plant-borage');
  const customCloseFennel = [
    { plantId: fennel.id, plant: fennel, distanceM: 2.5, angleDeg: 180, zone: 'ZONE_4_OUTER' as const, sector: 'SOUTH_SUN' as const },
    { plantId: borage.id, plant: borage, distanceM: 1.8, angleDeg: 180, zone: 'ZONE_2_MID' as const, sector: 'SOUTH_SUN' as const }, // 0.7m apart
  ];
  const gReport = analyzeGuildAntagonisms(apple, [fennel, borage], customCloseFennel);
  if (!gReport.conflicts.some(c => c.id === 'internal-fennel-allelopathy')) {
    fail('Guild Builder did not flag Fennel + Borage placed 0.7m apart');
  }

  const aInst: GardenStarPlantInstance = {
    instanceId: 'a1',
    treeId: apple.id,
    starTree: apple,
    xM: 0,
    yM: 0,
    selectedPlantIds: [fennel.id, borage.id],
  };
  const gConflicts = analyzeGardenAntagonisms([aInst], [
    { instanceId: 'c1', plantId: fennel.id, plant: fennel, xM: 2.0, yM: 0, isMerged: false, servicingTreeIds: ['a1'], currentLightCondition: 'FULL_SUN' },
    { instanceId: 'c2', plantId: borage.id, plant: borage, xM: 3.0, yM: 0, isMerged: false, servicingTreeIds: ['a1'], currentLightCondition: 'FULL_SUN' }, // 1.0m apart
  ]);
  if (!gConflicts.some(c => c.type === 'FENNEL_ALLELOPATHY')) {
    fail('Garden Builder did not flag Fennel + Borage placed 1.0m apart');
  }
}

// 3E. Wormwood Absinthin Allelopathy (< 1.2m) in Guild Builder & Garden Builder (and Ribes exception)
{
  const wormwood = getPlant('plant-wormwood');
  const lovage = getPlant('plant-lovage');
  const redCurrant = getPlant('plant-red-currant');

  const customCloseWormwood = [
    { plantId: wormwood.id, plant: wormwood, distanceM: 2.2, angleDeg: 180, zone: 'ZONE_4_OUTER' as const, sector: 'SOUTH_SUN' as const },
    { plantId: lovage.id, plant: lovage, distanceM: 1.5, angleDeg: 180, zone: 'ZONE_2_MID' as const, sector: 'SOUTH_SUN' as const }, // 0.7m apart
  ];
  const gReport = analyzeGuildAntagonisms(apple, [wormwood, lovage], customCloseWormwood);
  if (!gReport.conflicts.some(c => c.id === 'internal-wormwood-allelopathy')) {
    fail('Guild Builder did not flag Wormwood + Lovage placed 0.7m apart');
  }

  // Verify Ribes (Red Currant) is NOT flagged as sensitive to Wormwood
  const customWormwoodRibes = [
    { plantId: wormwood.id, plant: wormwood, distanceM: 2.2, angleDeg: 180, zone: 'ZONE_4_OUTER' as const, sector: 'SOUTH_SUN' as const },
    { plantId: redCurrant.id, plant: redCurrant, distanceM: 1.5, angleDeg: 180, zone: 'ZONE_3_DRIP' as const, sector: 'SOUTH_SUN' as const },
  ];
  const ribesReport = analyzeGuildAntagonisms(apple, [wormwood, redCurrant], customWormwoodRibes);
  if (ribesReport.conflicts.some(c => c.id === 'internal-wormwood-allelopathy')) {
    fail('Guild Builder erroneously flagged Red Currant (Ribes) next to Wormwood');
  }

  const aInst: GardenStarPlantInstance = {
    instanceId: 'a1',
    treeId: apple.id,
    starTree: apple,
    xM: 0,
    yM: 0,
    selectedPlantIds: [wormwood.id, lovage.id],
  };
  const gConflicts = analyzeGardenAntagonisms([aInst], [
    { instanceId: 'c1', plantId: wormwood.id, plant: wormwood, xM: 2.0, yM: 0, isMerged: false, servicingTreeIds: ['a1'], currentLightCondition: 'FULL_SUN' },
    { instanceId: 'c2', plantId: lovage.id, plant: lovage, xM: 2.8, yM: 0, isMerged: false, servicingTreeIds: ['a1'], currentLightCondition: 'FULL_SUN' }, // 0.8m apart
  ]);
  if (!gConflicts.some(c => c.type === 'WORMWOOD_ALLELOPATHY')) {
    fail('Garden Builder did not flag Wormwood + Lovage placed 0.8m apart');
  }
}

// 3F. Edaphic pH Antagonism (Strict Calcifuge vs Strict Calcicole) in Guild Builder & Garden Builder
{
  const cranberry = getPlant('plant-cranberry');
  const hellebore = getPlant('plant-hellebore');

  const gReport = analyzeGuildAntagonisms(apple, [cranberry, hellebore], 'NORTHERN');
  if (!gReport.conflicts.some(c => c.id === 'internal-edaphic-ph-antagonism')) {
    fail('Guild Builder did not flag Edaphic pH Antagonism between Cranberry (Calcifuge) and Hellebore (Calcicole)');
  }

  const aInst: GardenStarPlantInstance = {
    instanceId: 'a1',
    treeId: apple.id,
    starTree: apple,
    xM: 0,
    yM: 0,
    selectedPlantIds: [cranberry.id, hellebore.id],
  };
  const gConflicts = analyzeGardenAntagonisms([aInst], [
    { instanceId: 'c1', plantId: cranberry.id, plant: cranberry, xM: 1.5, yM: 0, isMerged: false, servicingTreeIds: ['a1'], currentLightCondition: 'PARTIAL_SUN' },
    { instanceId: 'c2', plantId: hellebore.id, plant: hellebore, xM: 2.8, yM: 0, isMerged: false, servicingTreeIds: ['a1'], currentLightCondition: 'PARTIAL_SUN' }, // 1.3m apart
  ]);
  if (!gConflicts.some(c => c.type === 'EDAPHIC_PH')) {
    fail('Garden Builder did not flag Edaphic pH Antagonism between Cranberry and Hellebore placed 1.3m apart');
  }
}

// 3G. Pest & pathogen reservoir hosts (pestHostConflicts.ts) in Guild Builder & Garden Builder
{
  const cherry = getTree('tree-cherry');
  const plum = getTree('tree-plum');
  const chestnut = getTree('tree-chestnut');
  const elderberry = getPlant('plant-elderberry');
  const willow = getPlant('plant-willow');
  const lupine = getPlant('plant-lupine');

  const cherryReport = analyzeGuildAntagonisms(cherry, [elderberry], 'NORTHERN');
  if (!cherryReport.conflicts.some(c => c.id === 'internal-elderberry-drosophila-suzukii' && c.type === 'INTERNAL_PROXIMITY')) {
    fail('Guild Builder did not flag elderberry as Drosophila suzukii reservoir next to cherry');
  }
  const plumReport = analyzeGuildAntagonisms(plum, [willow], 'NORTHERN');
  if (!plumReport.conflicts.some(c => c.id === 'internal-willow-alder-silver-leaf')) {
    fail('Guild Builder did not flag willow as silver leaf host next to plum');
  }
  const chestnutReport = analyzeGuildAntagonisms(chestnut, [lupine], 'NORTHERN');
  const lupineAlert = chestnutReport.conflicts.find(c => c.id === 'external-lupine-chestnut-ink-disease');
  if (!lupineAlert || lupineAlert.type !== 'EXTERNAL_ALERT') {
    fail('Guild Builder did not show the lupine / ink disease alert for chestnut as an external alert');
  }

  const cInst: GardenStarPlantInstance = { instanceId: 'ch1', treeId: cherry.id, starTree: cherry, xM: 0, yM: 0, selectedPlantIds: [] };
  const eInst: GardenStarPlantInstance = { instanceId: 'el1', treeId: 'shrub-elderberry', starTree: getTree('shrub-elderberry'), xM: 12, yM: 0, selectedPlantIds: [] };
  const farInst: GardenStarPlantInstance = { ...eInst, instanceId: 'el2', xM: 30 };
  if (!analyzeGardenAntagonisms([cInst, eInst], []).some(c => c.type === 'PEST_HOST')) {
    fail('Garden Builder did not flag an elderberry star 12 m from a cherry star');
  }
  if (analyzeGardenAntagonisms([cInst, farInst], []).some(c => c.type === 'PEST_HOST')) {
    fail('Garden Builder flagged an elderberry star 30 m from a cherry star (beyond the 20 m buffer)');
  }
}

// 4. Garden and guild PDF generation
{
  const pear = getTree('tree-pear');
  const starInstances: GardenStarPlantInstance[] = [
    {
      instanceId: 'inst-1',
      treeId: apple.id,
      starTree: apple,
      xM: 25, // Intentionally far from (0,0) to verify auto-centering
      yM: -18,
      selectedPlantIds: apple.recommendedCompanions.slice(0, 6),
    },
    {
      instanceId: 'inst-2',
      treeId: pear.id,
      starTree: pear,
      xM: 31,
      yM: -15,
      selectedPlantIds: pear.recommendedCompanions.slice(0, 6),
    },
  ];
  const opt = optimizeGardenCompanions(starInstances, GUILD_PLANTS, 'NORTHERN');
  const gardenDoc = generateGardenPlanPdfDoc({
    garden: {
      version: '1.0',
      name: 'Off-Center Auto-Zoom Test Garden',
      createdAt: new Date().toISOString(),
      soil: 'LOAM',
      zone: 'ZONE_7',
      hemisphere: 'NORTHERN',
      language: 'de',
      starPlants: starInstances,
      placedCompanions: opt.companions,
      gridBoundsM: { minX: -20, maxX: 40, minY: -30, maxY: 20 },
    },
  });
  if (gardenDoc.getNumberOfPages() < 3) {
    fail(`Expected at least 3 pages in Garden PDF, got ${gardenDoc.getNumberOfPages()}`);
  }

  const guildDoc = generateGuildPdf({
    starTree: apple,
    selectedPlants: apple.recommendedCompanions.slice(0, 6).map(id => getPlant(id)),
    selectedSoil: 'LOAM',
    hemisphere: 'NORTHERN',
    language: 'de',
  });
  if (guildDoc.getNumberOfPages() < 2) {
    fail(`Expected at least 2 pages in Guild PDF, got ${guildDoc.getNumberOfPages()}`);
  }
}

if (!allPassed) process.exit(1);
console.log(`conflicts: all checks passed (${STAR_TREES.length} star trees)`);
