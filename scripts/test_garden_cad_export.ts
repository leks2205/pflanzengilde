import { writeFileSync, mkdirSync } from 'fs';
import { STAR_TREES } from '../src/data/starTrees';
import { GUILD_PLANTS } from '../src/data/guildPlants';
import { isAreaPlant } from '../src/data/groundCoverSpecs';
import type { GardenState, GardenStarPlantInstance, GardenCompanionInstance } from '../src/types/garden';
import { buildGardenDrawing, ringsToPolygons, polygonsArea } from '../src/core/gardenDrawing';
import { generateGardenDxf } from '../src/core/gardenDxfExporter';
import { generateGardenSvg, chooseSvgScale } from '../src/core/gardenSvgExporter';
import { generateGardenCsv } from '../src/core/gardenCsvExporter';
import { generateGardenGeoJson, metresToLonLat } from '../src/core/gardenGeoJsonExporter';

let total = 0;
let passed = 0;
function assert(cond: boolean, msg: string) {
  total++;
  if (!cond) { console.error(`FAIL: ${msg}`); process.exitCode = 1; } else passed++;
}
const near = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) <= eps;

const apple = STAR_TREES.find(t => t.id === 'tree-apple')!;
const pear = STAR_TREES.find(t => t.id === 'tree-pear') ?? STAR_TREES[1];
const comfrey = GUILD_PLANTS.find(p => p.id === 'plant-comfrey')!;
const chives = GUILD_PLANTS.find(p => p.id === 'plant-chives')!;
const clover = GUILD_PLANTS.find(p => p.id === 'plant-white-clover')!;
const crocus = GUILD_PLANTS.find(p => p.id === 'plant-crocus')!;

const stars: GardenStarPlantInstance[] = [
  { instanceId: 's1', treeId: apple.id, starTree: apple, xM: 0, yM: 0 },
  { instanceId: 's2', treeId: pear.id, starTree: pear, xM: 8, yM: 0, customName: 'Birne „Gute Luise“' },
];
const comp = (id: string, plant: typeof comfrey, x: number, y: number, trees: string[]): GardenCompanionInstance => ({
  instanceId: id, plantId: plant.id, plant, xM: x, yM: y, servicingTreeIds: trees, isMerged: trees.length > 1, currentLightCondition: 'PARTIAL_SUN',
});
const companions = [
  comp('c1', comfrey, 1.5, 0, ['s1']),
  comp('c2', chives, -1, 1, ['s1']),
  comp('c3', comfrey, 4, 0.5, ['s1', 's2']),
  comp('c4', clover, 0, 2, ['s1']),
  comp('c5', crocus, 8, 1.5, ['s2']),
];

const garden: GardenState = {
  version: '2.0', name: 'Testgarten', createdAt: '2026-11-01T00:00:00Z', soil: 'LOAM', zone: 'TEMPERATE',
  hemisphere: 'NORTHERN', language: 'de', starPlants: stars, placedCompanions: companions,
  gridBoundsM: { minX: -20, maxX: 20, minY: -20, maxY: 20 },
  infrastructure: {
    outline: { kind: 'RECT', xM: -6, yM: -6, wM: 20, hM: 12 },
    raisedBeds: [
      { id: 'b1', shape: { kind: 'RECT', xM: 2, yM: 3, wM: 2, hM: 1.2 }, heightM: 0.6 },
      { id: 'b2', shape: { kind: 'CIRCLE', cxM: 11, cyM: 3, rM: 1 }, heightM: 0.4, name: 'Kräuterspirale' },
    ],
  },
};

// --- Drawing model ---
const d = buildGardenDrawing({ garden });
assert(d.originGrid.xM === -7 && d.originGrid.yM === 7, `origin = SW corner with 1 m margin (got ${JSON.stringify(d.originGrid)})`);
assert(d.widthM === 22 && d.heightM === 14, `extent 22 x 14 m (got ${d.widthM} x ${d.heightM})`);
const [t1, t2] = d.trees;
assert(near(t1.x, 7) && near(t1.y, 7), `apple at plan (7,7) (got ${t1.x},${t1.y})`);
assert(near(t2.x - t1.x, 8) && near(t2.y, t1.y), 'trees stay 8 m apart, same northing');
// Grid y south → plan y north: chives at grid y=+1 (south of the apple) must have a smaller Y
const chivesP = d.plants.find(p => p.instanceId === 'c2')!;
assert(chivesP.y < t1.y && near(chivesP.y, 6), `y axis flipped to north-up (chives Y=${chivesP.y})`);
assert(d.species[0].code === 'B1' && d.species[1].code === 'B2', 'tree codes B1, B2 in German');
const comfreySp = d.species.find(s => s.plantId === comfrey.id)!;
assert(comfreySp.count === 2 && comfreySp.kind === 'PLANT', 'comfrey counted twice as one species');
assert(d.plants.every(p => !isAreaPlant({ id: p.species.plantId })), 'area plants are not point symbols');
assert(d.groundCovers.length >= 1, `ground covers present (${d.groundCovers.length})`);
for (const gc of d.groundCovers) assert((gc.species.areaM2 ?? 0) > 0, `${gc.species.code} has an area`);
assert(d.plants.filter(p => p.species.plantId === comfrey.id).map(p => p.ref).join() === 'P1-1,P1-2', 'per-species instance refs');
assert(d.trees[1].ref === 'B2-1', 'tree ref per species');
assert(d.dimensions.length === 1 && near(d.dimensions[0].distanceM, 8), 'one 8 m distance between the trees');
assert(near(d.beds[0].areaM2, 2.4) && near(d.beds[1].areaM2, Math.round(Math.PI * 100) / 100), 'bed areas');
assert(d.outline !== null && near(d.outline.areaM2, 240), 'outline area 240 m²');
const outlinePts = d.outline!.kind === 'POLYGON' ? d.outline!.points : [];
assert(outlinePts.some(([x, y]) => near(x, 1) && near(y, 1)) && outlinePts.some(([x, y]) => near(x, 21) && near(y, 13)), 'outline corners at (1,1) and (21,13)');

// Ring nesting: square with a hole
const outer: [number, number][] = [[0, 0], [10, 0], [10, 10], [0, 10]];
const hole: [number, number][] = [[2, 2], [4, 2], [4, 4], [2, 4]];
const island: [number, number][] = [[2.5, 2.5], [3.5, 2.5], [3.5, 3.5], [2.5, 3.5]];
const polys = ringsToPolygons([hole, outer, island]);
assert(polys.length === 2 && polys.some(p => p.length === 2), 'outer+hole and island polygons');
assert(near(polygonsArea(polys), 100 - 4 + 1), 'even-odd area 97 m²');

// --- DXF ---
const dxf = generateGardenDxf(d);
assert(/\$INSUNITS\s*\r?\n\s*70\s*\r?\n\s*6/.test(dxf), 'DXF declares metres ($INSUNITS = 6)');
assert(dxf.includes('AC1021'), 'DXF version 2007 (UTF-8)');
for (const layer of ['PG-Grundstueck', 'PG-Hochbeete', 'PG-Baeume-Krone', 'PG-Pflanzen', 'PG-Bodendecker']) assert(dxf.includes(layer), `DXF layer ${layer}`);
assert(dxf.includes('PG_B1') && dxf.includes('PG_P1'), 'DXF species blocks');
assert(dxf.includes('Malus') && dxf.includes('Kräuterspirale'), 'DXF carries botanical names and UTF-8 text');
assert(dxf.trimEnd().endsWith('EOF'), 'DXF ends with EOF');

// --- SVG ---
assert(chooseSvgScale(22, 14) === 50, '22 x 14 m fits A0 at 1:50');
assert(chooseSvgScale(80, 50) === 100, '80 x 50 m needs 1:100');
const svg = generateGardenSvg(d, 100);
const w = Number(/width="(\d+)mm"/.exec(svg)?.[1]);
const vb = /viewBox="0 0 (\d+) (\d+)"/.exec(svg);
assert(vb !== null && Number(vb[1]) === w, 'SVG viewBox in mm (1 unit = 1 mm)');
const canopy = new RegExp(`<circle cx="(${15 + 70})" cy="([\\d.]+)" r="${apple.matureRadiusM * 10}"`).exec(svg);
assert(canopy !== null, `SVG apple canopy at x=85 mm with r=${apple.matureRadiusM * 10} mm at 1:100`);
assert((svg.match(/inkscape:groupmode="layer"/g) ?? []).length === 10, 'SVG has 10 layers');
assert(!svg.includes('NaN') && !svg.includes('undefined'), 'SVG has no NaN/undefined');

// --- CSV ---
const csv = generateGardenCsv(d);
const lines = csv.replace(/^\uFEFF/, '').trim().split('\r\n');
assert(csv.startsWith('\uFEFF'), 'CSV has a UTF-8 BOM');
assert(lines[0].split(';').length === 15, 'CSV German header with ";" and 15 columns');
const appleRow = lines.find(l => l.startsWith('B1-1;'))!;
assert(Boolean(appleRow) && appleRow.includes(';7,00;7,00;'), `CSV apple row with decimal commas (${appleRow})`);
assert(lines.some(l => l.includes('"Birne „Gute Luise“"') || l.includes('Birne „Gute Luise“')), 'CSV keeps custom tree names');
assert(lines.filter(l => l.includes(';Begleitpflanze;')).length === d.plants.length, 'CSV row per companion');
assert(lines.some(l => l.startsWith('HB-2;') && l.includes('Kräuterspirale')), 'CSV raised-bed rows');
const csvEn = generateGardenCsv(buildGardenDrawing({ garden: { ...garden, language: 'en' } }));
assert(csvEn.split('\r\n')[1].startsWith('T1-1,') && csvEn.includes(',7.00,7.00,'), 'English CSV uses "," and points, tree code T');

// --- GeoJSON ---
const ref = { planX: t1.x, planY: t1.y, lat: 53.1435, lon: 8.2146 }; // Oldenburg
const toLL = metresToLonLat(ref);
const [lonE] = toLL(t1.x + 100, t1.y);
const [, latN] = toLL(t1.x, t1.y + 100);
// 100 m east / north at 53.14°N; expected deltas from GeographicLib (WGS84 geodesic Direct problem).
// 1e-7° ≈ 1 cm.
assert(Math.abs((lonE - ref.lon) - 0.0014944463) < 2e-7, `100 m east → longitude delta (${lonE - ref.lon})`);
assert(Math.abs((latN - ref.lat) - 0.0008985616) < 2e-7, `100 m north → latitude delta (${latN - ref.lat})`);
const gj = JSON.parse(generateGardenGeoJson(d, ref));
assert(gj.type === 'FeatureCollection' && gj.features.length > 0, 'GeoJSON FeatureCollection');
const appleFeat = gj.features.find((f: any) => f.properties.kind === 'tree' && f.properties.no === 1);
assert(appleFeat.geometry.coordinates[0] === 8.2146 && appleFeat.geometry.coordinates[1] === 53.1435, 'reference tree sits exactly on the reference coordinates');
const ringOk = (r: number[][], outerRing: boolean) => {
  let a = 0;
  for (let i = 0; i < r.length - 1; i++) a += r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1];
  return r[0][0] === r[r.length - 1][0] && r[0][1] === r[r.length - 1][1] && (outerRing ? a > 0 : a < 0);
};
let ringsChecked = 0;
for (const f of gj.features) {
  const g = f.geometry;
  const polysG = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
  for (const p of polysG) p.forEach((r: number[][], i: number) => { ringsChecked++; assert(ringOk(r, i === 0), `RFC 7946 ring orientation (${f.properties.kind})`); });
}
assert(ringsChecked > 4, `checked ${ringsChecked} rings`);

// Empty garden still exports
const empty = buildGardenDrawing({ garden: { ...garden, starPlants: [], placedCompanions: [], infrastructure: undefined } });
assert(empty.widthM > 0 && generateGardenDxf(empty).includes('EOF') && generateGardenSvg(empty).includes('</svg>'), 'empty garden exports');

if (process.env.CAD_EXPORT_OUT) {
  mkdirSync(process.env.CAD_EXPORT_OUT, { recursive: true });
  writeFileSync(`${process.env.CAD_EXPORT_OUT}/test.dxf`, dxf);
  writeFileSync(`${process.env.CAD_EXPORT_OUT}/test.svg`, svg);
  writeFileSync(`${process.env.CAD_EXPORT_OUT}/test.csv`, csv);
  writeFileSync(`${process.env.CAD_EXPORT_OUT}/test.geojson`, JSON.stringify(gj));
}

console.log(`garden CAD export: ${passed}/${total} checks passed`);
