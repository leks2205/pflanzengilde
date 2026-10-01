import { STAR_TREES } from '../src/data/starTrees';
import { GUILD_PLANTS } from '../src/data/guildPlants';
import { generateGardenPlanPdfDoc } from '../src/core/gardenPdfExporter';
import type { GardenState, GardenStarPlantInstance, GardenCompanionInstance } from '../src/types/garden';

let totalChecks = 0;
let passedChecks = 0;

function assert(condition: boolean, msg: string) {
  totalChecks++;
  if (!condition) {
    console.error(`FAIL: ${msg}`);
    process.exitCode = 1;
  } else {
    passedChecks++;
  }
}

// Two stars, four companions (one shared)
const appleTree = STAR_TREES.find(t => t.id === 'tree-apple')!;
const walnutTree = STAR_TREES.find(t => t.id === 'tree-walnut')!;

const comfrey = GUILD_PLANTS.find(p => p.id === 'plant-comfrey')!;
const chives = GUILD_PLANTS.find(p => p.id === 'plant-chives')!;
const chamomile = GUILD_PLANTS.find(p => p.id === 'plant-chamomile')!;
const clover = GUILD_PLANTS.find(p => p.id === 'plant-white-clover')!;

const testStarPlants: GardenStarPlantInstance[] = [
  {
    instanceId: 'star-1',
    treeId: appleTree.id,
    starTree: appleTree,
    xM: 5.0,
    yM: 5.0,
    selectedPlantIds: [comfrey.id, chives.id, clover.id]
  },
  {
    instanceId: 'star-2',
    treeId: walnutTree.id,
    starTree: walnutTree,
    xM: 14.0,
    yM: 6.5,
    selectedPlantIds: [chamomile.id]
  }
];

const testCompanions: GardenCompanionInstance[] = [
  {
    instanceId: 'comp-1',
    plantId: comfrey.id,
    plant: comfrey,
    xM: 6.2,
    yM: 5.8,
    servicingTreeIds: ['star-1'],
    isMerged: false
  },
  {
    instanceId: 'comp-2',
    plantId: chives.id,
    plant: chives,
    xM: 4.2,
    yM: 5.3,
    servicingTreeIds: ['star-1'],
    isMerged: false
  },
  {
    instanceId: 'comp-3',
    plantId: clover.id,
    plant: clover,
    xM: 9.5,
    yM: 5.8,
    servicingTreeIds: ['star-1', 'star-2'],
    isMerged: true // shared between apple and walnut
  },
  {
    instanceId: 'comp-4',
    plantId: chamomile.id,
    plant: chamomile,
    xM: 13.0,
    yM: 7.2,
    servicingTreeIds: ['star-2'],
    isMerged: false
  }
];

const mockGarden: GardenState = {
  name: 'Test Permakultur Garten',
  soil: 'LOAM',
  zone: 'TEMPERATE',
  hemisphere: 'NORTHERN',
  language: 'de',
  starPlants: testStarPlants,
  placedCompanions: testCompanions,
  loadedGuildTemplates: []
};

// 2. Generate German PDF Document
const docDe = generateGardenPlanPdfDoc({ garden: mockGarden });
assert(Boolean(docDe), 'Generated valid jsPDF document for German language');

// Check page count
const pageCountDe = docDe.getNumberOfPages();
assert(pageCountDe >= 3, `PDF contains at least 3 pages (got: ${pageCountDe})`);

// Check that doc can export to ArrayBuffer without crash
const arrayBufferDe = docDe.output('arraybuffer');
assert(arrayBufferDe.byteLength > 1000, `Generated non-empty PDF binary output (${arrayBufferDe.byteLength} bytes)`);

// 3. Generate English PDF Document
const mockGardenEn: GardenState = {
  ...mockGarden,
  name: 'Test Permaculture Garden',
  language: 'en'
};
const docEn = generateGardenPlanPdfDoc({ garden: mockGardenEn });
assert(Boolean(docEn), 'Generated valid jsPDF document for English language');

const pageCountEn = docEn.getNumberOfPages();
assert(pageCountEn >= 3, `English PDF contains at least 3 pages (got: ${pageCountEn})`);

const arrayBufferEn = docEn.output('arraybuffer');
assert(arrayBufferEn.byteLength > 1000, `Generated non-empty English PDF binary output (${arrayBufferEn.byteLength} bytes)`);

// 4. Test Single Star Tree (No Neighboring Lines)
const singleStarGarden: GardenState = {
  ...mockGarden,
  starPlants: [testStarPlants[0]],
  placedCompanions: [testCompanions[0]]
};
const docSingle = generateGardenPlanPdfDoc({ garden: singleStarGarden });
assert(Boolean(docSingle), 'Handles single star plant gracefully without neighbor crash');

console.log(`garden pdf: ${passedChecks}/${totalChecks} checks passed`);
