import { STAR_TREES } from '../src/data/starTrees';
import { GUILD_PLANTS } from '../src/data/guildPlants';
import { generateStarPlantCoordinates, generateClusterCompanions, getRecommendedSpacingM } from '../src/core/multiStarLayout';
import { optimizeGardenCompanions } from '../src/core/gardenOptimizer';
import { analyzeGardenAntagonisms, detectGardenShadePockets } from '../src/core/gardenAntagonist';
import { buildGardenIcsContent } from '../src/core/gardenCalendar';
import { GardenStarPlantInstance, GardenState } from '../src/types/garden';

let passedChecks = 0;
let totalChecks = 0;

function assert(condition: boolean, message: string) {
  totalChecks++;
  if (condition) {
    passedChecks++;
  } else {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. MULTI-STAR LAYOUT ENGINE TESTS
console.log('--- 1. Multi-Star Layout Geometry & Coordinates ---');
const appleTree = STAR_TREES.find(t => t.id === 'tree-apple')!;
assert(Boolean(appleTree), 'Apple tree found');

// Single tree
const singleLayout = generateStarPlantCoordinates(appleTree, {
  count: 1,
  pattern: 'SINGLE',
  spacingM: 4.0,
  orientationDeg: 90
});
assert(singleLayout.treePoints.length === 1, 'Single layout produces 1 tree point');
assert(singleLayout.treePoints[0].dxM === 0 && singleLayout.treePoints[0].dyM === 0, 'Single tree is at (0,0)');

// Line layout: 3 trees
const lineLayout = generateStarPlantCoordinates(appleTree, {
  count: 3,
  pattern: 'LINE',
  spacingM: 4.0,
  orientationDeg: 90
});
assert(lineLayout.treePoints.length === 3, 'Line layout produces 3 tree points');
assert(lineLayout.treePoints[1].dxM === 0, 'Center tree of odd-count row is at x=0');
assert(Math.abs(lineLayout.treePoints[0].dxM - (-4.0)) < 0.05, 'Left tree is at x=-4.0');
assert(Math.abs(lineLayout.treePoints[2].dxM - 4.0) < 0.05, 'Right tree is at x=+4.0');

// Triangle layout: 3 trees
const triLayout = generateStarPlantCoordinates(appleTree, {
  count: 3,
  pattern: 'TRIANGLE',
  spacingM: 5.0,
  orientationDeg: 90
});
assert(triLayout.treePoints.length === 3, 'Triangle layout produces 3 tree points');
const dist01 = Math.hypot(triLayout.treePoints[0].dxM - triLayout.treePoints[1].dxM, triLayout.treePoints[0].dyM - triLayout.treePoints[1].dyM);
assert(Math.abs(dist01 - 5.0) < 0.1, `Equilateral triangle edge distance is ~5.0m (got ${dist01.toFixed(2)}m)`);

// 2. NON-LINEAR COMPANION SCALING TESTS
console.log('\n--- 2. Non-Linear Companion Plant Scaling & Savings ---');
const testGuildCompanions = GUILD_PLANTS.filter(p =>
  ['plant-yarrow', 'plant-white-clover', 'plant-comfrey', 'plant-chives', 'plant-lavender'].includes(p.id)
);
assert(testGuildCompanions.length === 5, 'Found 5 test guild plants');

const clusterCompanions = generateClusterCompanions(appleTree, testGuildCompanions, lineLayout, 'NORTHERN');
assert(clusterCompanions.unoptimizedCount === 15, `Naive 1:1 duplication count is 15 (got ${clusterCompanions.unoptimizedCount})`);
assert(clusterCompanions.optimizedCount < clusterCompanions.unoptimizedCount, `Optimized companion count (${clusterCompanions.optimizedCount}) is less than naive 15`);
assert(clusterCompanions.savingsPercent > 0, `Savings percent is positive (${clusterCompanions.savingsPercent}%)`);
assert(clusterCompanions.companions.some(c => c.isMerged), 'Has merged companion instances between trees');

// 3. REAL-TIME BOTANICAL ANTAGONISM ENGINE TESTS
console.log('\n--- 3. Botanical Antagonisms (Juglone & Allium vs Legume) ---');
const walnutTree = STAR_TREES.find(t => t.id === 'tree-walnut')!;
const apricotTree = STAR_TREES.find(t => t.id === 'tree-apricot')!;
assert(Boolean(walnutTree), 'Walnut tree found');
assert(Boolean(apricotTree), 'Apricot tree found');

// Walnut at (0, 0), Apricot at (10, 0) -> distance 10m < 20m Juglone threshold
const walnutInstance: GardenStarPlantInstance = {
  instanceId: 'tree-walnut-1',
  starTree: walnutTree,
  xM: 0,
  yM: 0,
  customRadiusM: walnutTree.matureRadiusM,
};
const apricotInstanceClose: GardenStarPlantInstance = {
  instanceId: 'tree-apricot-1',
  starTree: apricotTree,
  xM: 10,
  yM: 0,
  customRadiusM: apricotTree.matureRadiusM,
};
const conflictsClose = analyzeGardenAntagonisms([walnutInstance, apricotInstanceClose], []);
const jugloneConflict = conflictsClose.find(c => c.type === 'JUGLONE');
assert(Boolean(jugloneConflict), 'Juglone toxicity conflict detected at 10m distance');
assert(jugloneConflict?.severity === 'CRITICAL', 'Juglone conflict severity is CRITICAL');

// Move Apricot to (25, 0) -> distance 25m >= 20m Juglone threshold
const apricotInstanceSafe: GardenStarPlantInstance = {
  ...apricotInstanceClose,
  xM: 25,
};
const conflictsSafe = analyzeGardenAntagonisms([walnutInstance, apricotInstanceSafe], []);
const jugloneConflictSafe = conflictsSafe.find(c => c.type === 'JUGLONE');
assert(!jugloneConflictSafe, 'No Juglone conflict when distance is 25m (>= 20m clearance)');

// 4. CANOPY SHADING & OVERLAP ANALYSIS
console.log('\n--- 4. Canopy Overlap & Microclimate Shading ---');
const treeA: GardenStarPlantInstance = {
  instanceId: 'tree-apple-1',
  starTree: appleTree,
  xM: -2.5,
  yM: 0,
};
const treeB: GardenStarPlantInstance = {
  instanceId: 'tree-apple-2',
  starTree: appleTree,
  xM: 2.5,
  yM: 0,
};
const shadePockets = detectGardenShadePockets([treeA, treeB]);
assert(shadePockets.length > 0, 'Canopy shade pocket detected for overlapping apple trees (5m spacing with 3m radius)');
assert(shadePockets[0].suggestedPlantIds.length > 0, 'Shade pocket suggests shade-tolerant companions');

// 5. GARDEN GRID COMPANION OPTIMIZER TESTS
console.log('\n--- 5. Dynamic Companion Repulsion & Centroid Optimization ---');
const { companions: optimizedGardenCompanions, stats } = optimizeGardenCompanions([treeA, treeB], testGuildCompanions, 'NORTHERN');
assert(optimizedGardenCompanions.length > 0, `Optimized garden companions placed (count: ${optimizedGardenCompanions.length})`);
assert(stats.companionPlantCount === optimizedGardenCompanions.length, 'Stats count matches placed companions length');
// Verify no companion is placed right on trunk collars
for (const comp of optimizedGardenCompanions) {
  const distA = Math.hypot(comp.xM - treeA.xM, comp.yM - treeA.yM);
  const distB = Math.hypot(comp.xM - treeB.xM, comp.yM - treeB.yM);
  assert(distA >= 0.28 && distB >= 0.28, `Companion ${comp.plant.commonName.de} preserves bare trunk collar buffer (distA=${distA.toFixed(2)}, distB=${distB.toFixed(2)})`);
}

// Verify Allium vs Legume auto-separation (>= 1.8m)
const chives = optimizedGardenCompanions.find(c => c.plantId === 'plant-chives');
const clover = optimizedGardenCompanions.find(c => c.plantId === 'plant-white-clover');
if (chives && clover) {
  const dAllLeg = Math.hypot(clover.xM - chives.xM, clover.yM - chives.yM);
  assert(dAllLeg >= 1.8, `Allium (Schnittlauch) & Legume (Weißklee) are auto-spaced >= 1.8m (got ${dAllLeg.toFixed(2)}m)`);
}

// 5b. DISTANT TREES (12m apart) - No unrealistic central clustering
console.log('\n--- 5b. Distant Trees (12m Spacing) - Empirical Range Enforcement ---');
const distantTreeA: GardenStarPlantInstance = {
  instanceId: 'distant-apple-1',
  starTree: appleTree,
  xM: -6.0,
  yM: 0,
};
const distantTreeB: GardenStarPlantInstance = {
  instanceId: 'distant-apple-2',
  starTree: appleTree,
  xM: 6.0,
  yM: 0,
};
const { companions: distantCompanions } = optimizeGardenCompanions(
  [distantTreeA, distantTreeB],
  testGuildCompanions,
  'NORTHERN'
);

// At 12 m apart the midpoint (x=0) is out of reach for every companion in this guild
const centralCompanions = distantCompanions.filter(c => Math.abs(c.xM) < 2.0);
assert(
  centralCompanions.length === 0,
  `No companions placed in the middle when trees are 12m apart (found ${centralCompanions.length})`
);

// Both distant trees must have their own Chives at their own trunk collar
const distantChivesA = distantCompanions.find(c => c.plantId === 'plant-chives' && c.servicingTreeIds.includes('distant-apple-1'));
const distantChivesB = distantCompanions.find(c => c.plantId === 'plant-chives' && c.servicingTreeIds.includes('distant-apple-2'));
assert(Boolean(distantChivesA && distantChivesB), 'Both distant trees retain their own dedicated trunk collar Chives');
if (distantChivesA && distantChivesB) {
  const dTrunkA = Math.hypot(distantChivesA.xM - distantTreeA.xM, distantChivesA.yM - distantTreeA.yM);
  const dTrunkB = Math.hypot(distantChivesB.xM - distantTreeB.xM, distantChivesB.yM - distantTreeB.yM);
  assert(dTrunkA <= 0.8, `Tree A Chives is within 0.8m of trunk (got ${dTrunkA.toFixed(2)}m)`);
  assert(dTrunkB <= 0.8, `Tree B Chives is within 0.8m of trunk (got ${dTrunkB.toFixed(2)}m)`);
}

// Outer edge trees must have companions on their outer flanks
const outerLeftPlants = distantCompanions.filter(c => c.xM < distantTreeA.xM);
const outerRightPlants = distantCompanions.filter(c => c.xM > distantTreeB.xM);
assert(outerLeftPlants.length > 0, `Outer left flank has companions (count: ${outerLeftPlants.length})`);
assert(outerRightPlants.length > 0, `Outer right flank has companions (count: ${outerRightPlants.length})`);

// 6. MULTI-TREE CALENDAR EXPORT
console.log('\n--- 6. Multi-Tree RFC 5545 Garden Calendar Exporter ---');
const mockGardenState: GardenState = {
  id: 'test-garden-1',
  name: 'Test Permakultur Garten',
  starPlants: [treeA, treeB],
  placedCompanions: optimizedGardenCompanions,
  language: 'de',
  selectedSoil: 'LOAM',
  selectedZone: 'TEMPERATE',
  hemisphere: 'NORTHERN',
  gridSizeM: 24,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const icsOutput = buildGardenIcsContent({ garden: mockGardenState, baseUrl: 'https://pflanzengilde.de' });
assert(icsOutput.startsWith('BEGIN:VCALENDAR'), 'ICS output starts with BEGIN:VCALENDAR');
assert(icsOutput.includes('END:VCALENDAR'), 'ICS output ends with END:VCALENDAR');
assert(icsOutput.includes('tree-apple'), 'ICS output contains apple tree tasks');
assert(icsOutput.includes('Chop & Drop'), 'ICS output contains Chop & Drop events');
assert(icsOutput.split('\r\n').every(line => line.length <= 75), 'All ICS lines strictly obey RFC 5545 <= 75 octet limit');

console.log(`garden optimizer: ${passedChecks}/${totalChecks} checks passed`);
if (passedChecks !== totalChecks) process.exit(1);
