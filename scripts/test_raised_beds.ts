import { STAR_TREES } from '../src/data/starTrees';
import { ACTIVE_GUILD_PLANTS, GUILD_PLANTS } from '../src/data/guildPlants';
import { BED_WARNINGS, COMPANION_BED_SUITABILITY, STAR_BED_SUITABILITY, getBedSuitability } from '../src/data/raisedBedSuitability';
import { analyzeGardenAntagonisms } from '../src/core/gardenAntagonist';
import { optimizeGardenCompanions, resolveGardenConflicts } from '../src/core/gardenOptimizer';
import { analyzeGardenSite } from '../src/core/gardenSite';
import { compartmentAt } from '../src/core/compartments';
import { plantCrossesBedWall, roleCrossesBedWall } from '../src/core/bedWallRules';
import {
  isSimplePolygon, lassoToPolygon, nearestPointInside, nearestPointOutside, pointInShape, shapeAreaM2, signedDistanceToShape,
} from '../src/core/geometry2d';
import { encodeGardenToCode, decodeGardenFromCode } from '../src/utils/shareUtils';
import { sanitizeInfrastructure } from '../src/utils/gardenStorage';
import { generateGardenPlanPdfDoc } from '../src/core/gardenPdfExporter';
import { GardenStarPlantInstance, RaisedBed } from '../src/types/garden';
import { buildGardenCoverInput, computeGroundCovers, pointInRing } from '../src/core/groundCoverEngine';

let passed = 0;
let failed = 0;
const check = (cond: boolean, msg: string) => {
  if (cond) passed++;
  else {
    failed++;
    console.error(`FAIL: ${msg}`);
  }
};
const tree = (id: string) => STAR_TREES.find(t => t.id === id)!;
const plant = (id: string) => GUILD_PLANTS.find(p => p.id === id)!;
const star = (id: string, treeId: string, xM: number, yM: number, ids?: string[]): GardenStarPlantInstance => ({
  instanceId: id, treeId, starTree: tree(treeId), xM, yM, selectedPlantIds: ids ?? tree(treeId).recommendedCompanions.slice(0, 5),
});
const bed = (id: string, xM: number, yM: number, wM: number, hM: number, heightM = 0.6): RaisedBed => ({ id, shape: { kind: 'RECT', xM, yM, wM, hM }, heightM });

// ── Geometry ──────────────────────────────────────────────────────────────────────────────────────
{
  const sq = { kind: 'RECT' as const, xM: 0, yM: 0, wM: 2, hM: 2 };
  check(pointInShape(1, 1, sq) && !pointInShape(3, 1, sq), 'pointInShape rect');
  check(Math.abs(shapeAreaM2({ kind: 'CIRCLE', cxM: 0, cyM: 0, rM: 1 }) - Math.PI) < 1e-9, 'circle area');
  check(Math.abs(signedDistanceToShape(1, 1, sq) + 1) < 1e-9, 'signed distance inside = -1');
  const [ix, iy] = nearestPointInside(5, 1, sq, 0.15);
  check(signedDistanceToShape(ix, iy, sq) <= -0.149, 'nearestPointInside respects inset');
  const [ox, oy] = nearestPointOutside(1, 1, sq, 0.1);
  check(signedDistanceToShape(ox, oy, sq) >= 0.099, 'nearestPointOutside respects offset');
  const raw: Array<[number, number]> = Array.from({ length: 120 }, (_, i) => {
    const a = (i / 120) * Math.PI * 2;
    return [3 * Math.cos(a), 2 * Math.sin(a)];
  });
  const lasso = lassoToPolygon(raw, 0.05);
  check(lasso.length >= 8 && lasso.length < 60 && isSimplePolygon(lasso), `freehand lasso simplifies to a simple polygon (${lasso.length} pts)`);
  check(!isSimplePolygon([[0, 0], [2, 2], [2, 0], [0, 2]]), 'bow-tie polygon is not simple');
}

// ── Bed-wall roles ────────────────────────────────────────────────────────────────────────────────
check(roleCrossesBedWall(plant('plant-phacelia'), 'POLLINATOR_MAGNET'), 'pollinator role crosses');
check(!roleCrossesBedWall(plant('plant-white-clover'), 'NITROGEN_FIXER'), 'N fixing is blocked');
check(!plantCrossesBedWall(plant('plant-white-clover')), 'clover (N fixer, living mulch) does not cross as a whole');
check(!roleCrossesBedWall(plant('plant-sorghum-sudangrass'), 'PEST_REPELLER'), 'sorghum nematode effect is blocked');

// ── Conflicts across a wall ───────────────────────────────────────────────────────────────────────
{
  const walnut = star('w', 'tree-walnut', 0, 0, []);
  const appleOut = star('a', 'tree-apple', 10, 0, []);
  const beds = [bed('bed-1', 8.5, -1.5, 3, 3)];
  const plain = analyzeGardenAntagonisms([walnut, appleOut], []);
  check(plain.some(c => c.type === 'JUGLONE' && c.severity === 'CRITICAL'), 'walnut vs apple 10 m: CRITICAL without bed');
  const withBed = analyzeGardenAntagonisms([walnut, appleOut], [], beds);
  const j = withBed.find(c => c.type === 'JUGLONE');
  check(Boolean(j) && j!.severity === 'INFO' && j!.bedEffect === 'REDUCED_BY_BED', 'apple in a bed outside the canopy: juglone reduced to INFO');
  const appleNear = star('a2', 'tree-apple', 4, 0, []);
  const near = analyzeGardenAntagonisms([walnut, appleNear], [], [bed('bed-2', 2.5, -1.5, 3, 3)]);
  check(near.some(c => c.type === 'JUGLONE' && c.bedEffect === 'BED_LEAF_LITTER'), 'apple in a bed under the walnut canopy: leaf-litter INFO');
  const both = analyzeGardenAntagonisms([walnut, appleOut], [], [bed('big', -2, -2, 15, 4)]);
  check(both.some(c => c.type === 'JUGLONE' && c.severity === 'CRITICAL'), 'walnut and apple in the same bed: conflict unchanged');
}
{
  // allium vs legume: dropped across a wall
  const s1 = star('s1', 'tree-apple', 0, 0, ['plant-chives']);
  const s2 = star('s2', 'tree-pear', 2.5, 0, ['plant-white-clover']);
  const comps = [
    { instanceId: 'c1', plantId: 'plant-chives', plant: plant('plant-chives'), xM: 0.6, yM: 0, servicingTreeIds: ['s1'], isMerged: false, currentLightCondition: 'FULL_SUN' as const },
    { instanceId: 'c2', plantId: 'plant-white-clover', plant: plant('plant-white-clover'), xM: 1.6, yM: 0, servicingTreeIds: ['s2'], isMerged: false, currentLightCondition: 'FULL_SUN' as const },
  ];
  check(analyzeGardenAntagonisms([s1, s2], comps).some(c => c.type === 'ALLIUM_LEGUME'), 'allium–legume conflict without bed');
  check(!analyzeGardenAntagonisms([s1, s2], comps, [bed('b', 1.2, -1, 2, 2)]).some(c => c.type === 'ALLIUM_LEGUME'), 'allium–legume conflict dropped across a bed wall');
}
{
  // flying pest host (elder / SWD) is not blocked
  const cherry = star('ch', 'tree-cherry', 0, 0, []);
  const elder = star('el', 'shrub-elderberry', 12, 0, []);
  check(analyzeGardenAntagonisms([cherry, elder], [], [bed('b', -2, -2, 4, 4)]).some(c => c.type === 'PEST_HOST'), 'elderberry/SWD conflict is not blocked by a bed');
}

// ── Compartments in the optimizer ─────────────────────────────────────────────────────────────────
{
  const ids = ['plant-white-clover', 'plant-borage'];
  const a = star('a', 'tree-apple', 0, 0, ids);
  const b = star('b', 'tree-apple', 6, 0, ids);
  const noBed = optimizeGardenCompanions([a, b]);
  const cloverShared = noBed.companions.filter(c => c.plantId === 'plant-white-clover');
  check(cloverShared.length === 1 && cloverShared[0].isMerged, 'without beds the two apples share one clover');
  const beds = [bed('bed-1', 4, -2, 4, 4)];
  const withBed = optimizeGardenCompanions([a, b], undefined, 'NORTHERN', beds);
  const clovers = withBed.companions.filter(c => c.plantId === 'plant-white-clover');
  check(clovers.length === 2, 'a bed wall between the apples duplicates clover (N fixer stays on each side)');
  const phacelia = withBed.companions.filter(c => c.plantId === 'plant-borage');
  check(phacelia.length === 1, 'borage (pollinator only) is still shared across the wall');
  for (const c of withBed.companions) {
    const comps = new Set(c.servicingTreeIds.map(id => compartmentAt([a, b].find(t => t.instanceId === id)!.xM, 0, beds)));
    if (comps.size === 1) {
      check(compartmentAt(c.xM, c.yM, beds) === [...comps][0], `${c.instanceId} sits in its guild's compartment`);
    }
  }
  // resolver passes beds through
  const res = resolveGardenConflicts([a, b], { beds });
  check(res.companions.filter(c => c.plantId === 'plant-white-clover').length === 2, 'resolver keeps compartments');
  // no beds: byte-identical to before
  const r1 = JSON.stringify(resolveGardenConflicts([a, b]));
  const r2 = JSON.stringify(resolveGardenConflicts([a, b], { beds: [] }));
  check(r1 === r2, 'empty bed list changes nothing');
}

// ── Suitability data ──────────────────────────────────────────────────────────────────────────────
for (const t of STAR_TREES) check(Boolean(STAR_BED_SUITABILITY[t.id]), `${t.id} has a raised-bed rating`);
for (const p of ACTIVE_GUILD_PLANTS) check(Boolean(COMPANION_BED_SUITABILITY[p.id]), `${p.id} has a raised-bed rating`);
for (const [id, sbt] of [...Object.entries(STAR_BED_SUITABILITY), ...Object.entries(COMPANION_BED_SUITABILITY)]) {
  check(['S', 'C', 'C_REC', 'U'].includes(sbt.rating), `${id} rating valid`);
  for (const w of sbt.warnings) check(Boolean(BED_WARNINGS[w]), `${id} warning ${w} exists`);
  if (sbt.rating !== 'S') check(sbt.warnings.length > 0, `${id}: non-S rating explains itself`);
}
for (const [w, def] of Object.entries(BED_WARNINGS)) {
  check(def.sources.length > 0, `${w} has sources`);
  check(def.text.en.length > 20 && def.text.de.length > 20, `${w} has EN and DE text`);
  check(!/[✓≥≤]/.test(def.text.en + def.text.de), `${w} has no PDF-unsafe symbols`);
}
check(getBedSuitability('tree-walnut')?.rating === 'U', 'walnut unsuitable');
check(getBedSuitability('shrub-blueberry')?.rating === 'C_REC', 'blueberry recommended with acid substrate');

// ── Site warnings ─────────────────────────────────────────────────────────────────────────────────
{
  const apple = star('a', 'tree-apple', 0, 0, []);
  const walnut = star('w', 'tree-walnut', 20, 0, []);
  const infra = { outline: { kind: 'RECT' as const, xM: -5, yM: -5, wM: 15, hM: 10 }, raisedBeds: [bed('bed-1', -1, -1, 2, 2, 0.3), bed('bed-2', 19, -1, 2, 2)] };
  const w = analyzeGardenSite([apple, walnut], [], infra);
  check(w.some(x => x.kind === 'OUTSIDE_OUTLINE' && x.instanceId === 'w'), 'walnut outside the outline is flagged');
  check(w.some(x => x.kind === 'BED_UNSUITABLE' && x.plantId === 'tree-walnut'), 'walnut in a bed: unsuitable warning');
  check(w.some(x => x.kind === 'BED_CONDITIONAL' && x.plantId === 'tree-apple'), 'apple in a bed: conditional warning');
  check(w.some(x => x.kind === 'BED_TOO_LOW' && x.plantId === 'tree-apple'), 'apple in a 30 cm bed: too low');
}

// ── Persistence: share code extension, sanitizer, PDF ─────────────────────────────────────────────
{
  const stars = [star('a', 'tree-apple', 1.25, -2.5)];
  const infra = {
    outline: { kind: 'POLYGON' as const, points: [[-10.25, -8], [12.5, -7.75], [11, 9.5], [-9, 10]] as Array<[number, number]> },
    raisedBeds: [bed('bed-1', 2.25, 3, 1.25, 4, 0.45), { id: 'bed-2', shape: { kind: 'CIRCLE' as const, cxM: -3.5, cyM: -1.25, rM: 0.75 }, heightM: 0.8 }],
  };
  const code = encodeGardenToCode({ starPlants: stars, language: 'en', hemisphere: 'NORTHERN', treeAge: 'ESTABLISHED', infrastructure: infra });
  const dec = decodeGardenFromCode(code)!;
  check(dec.starPlants.length === 1 && dec.starPlants[0].xM === 1.3, 'stars still decode (dm precision)');
  check(dec.treeAge === 'ESTABLISHED', 'tree age round-trips');
  check(JSON.stringify(dec.infrastructure?.outline) === JSON.stringify(infra.outline), 'polygon outline round-trips in cm');
  check(dec.infrastructure?.raisedBeds.length === 2 && JSON.stringify(dec.infrastructure!.raisedBeds[0].shape) === JSON.stringify(infra.raisedBeds[0].shape), 'rect bed round-trips');
  check(Math.abs(dec.infrastructure!.raisedBeds[1].heightM - 0.8) < 1e-9, 'bed height round-trips');
  // old clients ignore the extension: the code without the extension bit decodes to the same trees
  const plainCode = encodeGardenToCode({ starPlants: stars, language: 'en', hemisphere: 'NORTHERN' });
  const plain = decodeGardenFromCode(plainCode)!;
  check(JSON.stringify(plain.starPlants) === JSON.stringify(dec.starPlants), 'extension does not change the trees');
  check(plain.infrastructure === undefined && plain.treeAge === undefined, 'plain code has no extension');
  // truncated tail: trees survive
  const bytes = code.slice(0, code.length - 6);
  const trunc = decodeGardenFromCode(bytes);
  check(Boolean(trunc) && trunc!.starPlants.length === 1, 'truncated extension still decodes the trees');
  const san = sanitizeInfrastructure({ outline: { kind: 'RECT', xM: 0, yM: 0, wM: -1, hM: 2 }, raisedBeds: [{ shape: { kind: 'CIRCLE', cxM: 0, cyM: 0, rM: 1 }, heightM: 99 }, 'junk'] });
  check(san.outline === null && san.raisedBeds.length === 1 && san.raisedBeds[0].heightM === 0.45, 'sanitizer drops malformed shapes and clamps heights');
  const res = resolveGardenConflicts(stars, { beds: infra.raisedBeds });
  const doc = generateGardenPlanPdfDoc({ garden: { version: '2.1', name: 'Beds', createdAt: '', soil: 'LOAM', zone: 'TEMPERATE', hemisphere: 'NORTHERN', language: 'en', starPlants: stars, placedCompanions: res.companions, gridBoundsM: { minX: -20, maxX: 20, minY: -20, maxY: 20 }, infrastructure: infra } });
  check(doc.getNumberOfPages() >= 1, 'garden PDF with outline and beds renders');
}

// ── Ground covers respect bed walls (per tree) ──────────────────────────────────────────────────
{
  const ids = ['plant-white-clover'];
  const walnutLike = star('far', 'tree-apple', -12, 0, ids);
  const inBed = star('in', 'tree-apple', 4, 0, ids);
  const beds = [{ id: 'bed-1', shape: { kind: 'CIRCLE' as const, cxM: 4, cyM: 0, rM: 2.5 }, heightM: 0.6 }];
  const res = resolveGardenConflicts([walnutLike, inBed], { beds });
  const covers = computeGroundCovers(buildGardenCoverInput([walnutLike, inBed], res.companions, {
    hemisphere: 'NORTHERN', treeAge: 'ESTABLISHED', compartmentOf: (x, y) => compartmentAt(x, y, beds),
  }));
  const clover = covers.find(c => c.plantId === 'plant-white-clover')!;
  const inside = (x: number, y: number) => clover.rings.filter(r => pointInRing(x, y, r)).length % 2 === 1;
  check(inside(5.5, 0) && !inside(7.2, 0) && !inside(4, 3.2), 'clover of the tree in the bed stays inside the bed');
  check(inside(-12 + 2.5, 0), 'clover of the open-ground tree still grows there');
}

if (failed > 0) {
  console.error(`raised beds: ${failed} failed, ${passed} passed`);
  process.exit(1);
}
console.log(`raised beds: ${passed}/${passed} checks passed`);
