import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { GardenPlanCanvas } from '../src/components/GardenPlanCanvas';
import { STAR_TREES } from '../src/data/starTrees';
import { ACTIVE_GUILD_PLANTS, GUILD_PLANTS } from '../src/data/guildPlants';
import { GROUND_COVER_SPECS, getGroundCoverSpec, isAreaPlant } from '../src/data/groundCoverSpecs';
import {
  computeGroundCovers, marchingSquares, simplifyRing, signedArea, evenOddArea, pointInRing,
  trunkClearanceM, GroundCoverInput, CoverShape, Ring, smoothMax,
} from '../src/core/groundCoverEngine';

let passed = 0;
let failed = 0;
const check = (cond: boolean, msg: string) => {
  if (cond) passed++;
  else {
    failed++;
    console.error(`FAIL: ${msg}`);
  }
};
const plant = (id: string) => {
  const p = GUILD_PLANTS.find(x => x.id === id);
  if (!p) throw new Error(`missing ${id}`);
  return p;
};
const tree = (id: string) => {
  const t = STAR_TREES.find(x => x.id === id);
  if (!t) throw new Error(`missing ${id}`);
  return t;
};

// ── Data completeness ────────────────────────────────────────────────────────────────────────────
const CARPET = ['plant-white-clover', 'plant-woodruff', 'plant-thyme', 'plant-bugleweed', 'plant-creeping-jenny', 'plant-strawberry', 'plant-cranberry', 'plant-wild-garlic', 'plant-sweet-potato', 'plant-peppermint', 'plant-nettle', 'plant-wintergreen', 'plant-lingonberry', 'plant-wild-ginger', 'plant-subterranean-clover', 'plant-ladys-mantle', 'plant-creeping-phlox'];
const DRIFT = ['plant-daffodil', 'plant-crocus', 'plant-snowdrop', 'plant-winter-aconite', 'plant-miners-lettuce', 'plant-nasturtium', 'plant-chamomile', 'plant-yarrow', 'plant-oregano', 'plant-tansy', 'plant-ostrich-fern', 'plant-lungwort', 'plant-epimedium'];
const ALLEY = ['plant-alfalfa', 'plant-sweet-alyssum', 'plant-wild-carrot', 'plant-sainfoin', 'plant-sicklepod', 'plant-soybean', 'plant-sorghum-sudangrass', 'plant-chicory', 'plant-ribwort-plantain', 'plant-salad-burnet', 'plant-buckwheat', 'plant-phacelia', 'plant-fodder-radish', 'plant-basil', 'plant-summer-savory', 'plant-cornflower', 'plant-pot-marigold', 'plant-african-marigold', 'plant-chinese-motherwort', 'plant-indian-mustard', 'plant-common-vetch'];
for (const [ids, mode] of [[CARPET, 'CARPET'], [DRIFT, 'DRIFT'], [ALLEY, 'ALLEY']] as const) {
  for (const id of ids) check(GROUND_COVER_SPECS[id]?.mode === mode, `${id} should be ${mode}`);
}
check(Object.keys(GROUND_COVER_SPECS).length === CARPET.length + DRIFT.length + ALLEY.length, 'no unexpected ground-cover specs');
const activeIds = new Set(ACTIVE_GUILD_PLANTS.map(p => p.id));
for (const spec of Object.values(GROUND_COVER_SPECS)) {
  check(activeIds.has(spec.plantId), `${spec.plantId} spec refers to an active plant`);
  check(spec.sources.length > 0, `${spec.plantId} has sources`);
  check(spec.coverFraction > 0 && spec.coverFraction <= 1, `${spec.plantId} cover fraction in (0,1]`);
}
for (const p of ACTIVE_GUILD_PLANTS) {
  if (p.layer === 'GROUND_COVER') check(isAreaPlant(p), `${p.id} has layer GROUND_COVER but no area spec`);
}
// Light classes follow the Hill et al. 1999 light value where one is given
const LIGHT_EXCEPTIONS = new Set(['plant-daffodil', 'plant-snowdrop', 'plant-winter-aconite']); // spring ephemerals: before leaf-out, light class ANY
for (const spec of Object.values(GROUND_COVER_SPECS)) {
  if (spec.ellenbergL === undefined || LIGHT_EXCEPTIONS.has(spec.plantId)) continue;
  const L = spec.ellenbergL;
  const ok = spec.light === 'ANY' || (spec.light === 'SHADE' && L <= 4) || (spec.light === 'HALF' && L >= 5 && L <= 6) || (spec.light === 'SUN' && L >= 7);
  check(ok || spec.heuristic.includes('light'), `${spec.plantId}: light class ${spec.light} matches Hill L ${L}`);
  check(spec.sources.some(src => src.includes('Hill, M. O.')), `${spec.plantId}: Ellenberg value is sourced (Hill et al. 1999)`);
}
for (const t of STAR_TREES) check(typeof t.matureHeightM === 'number' && t.matureHeightM > 0, `${t.id} has matureHeightM`);

// ── Geometry primitives ──────────────────────────────────────────────────────────────────────────
{
  // disc of radius 20 cells on a 60x60 grid
  const w = 60, h = 60;
  const f = new Float32Array(w * h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) f[j * w + i] = Math.hypot(i - 30, j - 30) <= 20 ? 1 : 0;
  const rings = marchingSquares(f, w, h, 0.5);
  check(rings.length === 1, `disc → 1 ring (got ${rings.length})`);
  const a = Math.abs(signedArea(rings[0]));
  check(Math.abs(a - Math.PI * 400) / (Math.PI * 400) < 0.03, `disc area within 3 % (got ${a.toFixed(1)})`);
  const s = simplifyRing(rings[0], 0.3);
  check(s.length >= 8 && s.length < rings[0].length, 'RDP keeps a closed polygon with fewer points');
  // annulus
  const g = new Float32Array(w * h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const d = Math.hypot(i - 30, j - 30); g[j * w + i] = d <= 22 && d >= 10 ? 1 : 0; }
  const ar = marchingSquares(g, w, h, 0.5);
  check(ar.length === 2, `annulus → 2 rings (got ${ar.length})`);
  const area = evenOddArea(ar);
  check(Math.abs(area - Math.PI * (484 - 100)) / (Math.PI * 384) < 0.05, `annulus even-odd area (got ${area.toFixed(1)})`);
  check(Math.abs(smoothMax([0.3]) - 0.3) < 1e-9 && smoothMax([0.45, 0.45]) > 0.5, 'smoothMax bridges two half-strength fields (melting)');
}

// ── Engine ───────────────────────────────────────────────────────────────────────────────────────
const apple = tree('tree-apple');
const base = (over: Partial<GroundCoverInput> = {}): GroundCoverInput => ({
  stars: [{ key: 's1', xM: 0, yM: 0, star: apple }],
  covers: [
    { instanceId: 'c1', plant: plant('plant-white-clover'), anchor: { xM: 2.5, yM: 0 }, servingStarKeys: ['s1'] },
    { instanceId: 'c2', plant: plant('plant-daffodil'), anchor: { xM: 0, yM: 0.8 }, servingStarKeys: ['s1'] },
    { instanceId: 'c3', plant: plant('plant-woodruff'), anchor: { xM: 0, yM: -2 }, servingStarKeys: ['s1'] },
    { instanceId: 'c4', plant: plant('plant-phacelia'), anchor: { xM: 4.5, yM: 0 }, servingStarKeys: ['s1'] },
  ],
  clumps: [{ xM: -2, yM: 1, plant: plant('plant-comfrey') }],
  hemisphere: 'NORTHERN',
  zone: 'TEMPERATE',
  treeAge: 'YOUNG',
  season: 'ALL',
  resolutionM: 0.1,
  ...over,
});
const minDistToPoint = (shape: CoverShape, x: number, y: number) =>
  Math.min(...shape.rings.flatMap(r => r.map(([px, py]) => Math.hypot(px - x, py - y))));
const inside = (shape: CoverShape, x: number, y: number) => {
  let n = 0;
  for (const r of shape.rings) if (pointInRing(x, y, r)) n++;
  return n % 2 === 1;
};

const t0 = Date.now();
const young = computeGroundCovers(base());
const tYoung = Date.now() - t0;
const byId = (shapes: CoverShape[], id: string) => shapes.find(s => s.plantId === id)!;
check(young.length === 4, `4 cover shapes (got ${young.length})`);
const clover = byId(young, 'plant-white-clover');
check(Boolean(clover) && clover.areaM2 > 5, 'clover covers a real area');
check(!inside(clover, 0, 0) && !inside(clover, 0.6, 0) && !inside(clover, 0, -0.6), 'young tree: trunk zone bare (0.75 m)');
const cYoung = trunkClearanceM(apple, 'YOUNG');
for (const s of young.filter(s => s.spec.mode !== 'ALLEY')) {
  const need = trunkClearanceM(apple, 'YOUNG', s.spec);
  check(minDistToPoint(s, 0, 0) >= need - 0.05, `${s.plantId}: no vertex inside young trunk clearance (${minDistToPoint(s, 0, 0).toFixed(2)})`);
}
check(!inside(clover, -2, 1), 'clover leaves a hole around the comfrey clump');
const alley = byId(young, 'plant-phacelia');
check(minDistToPoint(alley, 0, 0) >= apple.matureRadiusM + 0.5 - 0.12, 'alley strip stays outside the drip line + 0.5 m');
const daff = byId(young, 'plant-daffodil');
check(daff.dots.length > 10 && daff.dots.every(([x, y]) => Math.hypot(x, y) >= trunkClearanceM(apple, 'YOUNG', daff.spec) - 0.05), 'daffodil drift dots exist outside the (spring-ephemeral) collar');
check(trunkClearanceM(apple, 'YOUNG', daff.spec) === 0.3 && cYoung === 0.9, 'young clearance 0.9 m; spring ephemerals keep the 0.3 m collar');
const wood = byId(computeGroundCovers(base({ treeAge: 'ESTABLISHED' })), 'plant-woodruff');
// shade cover: more woodruff north of the trunk (negative y) than south
const northShare = (() => {
  let n = 0, s = 0;
  for (let a = 0; a < 360; a += 10) {
    const r = apple.matureRadiusM * 0.7;
    const x = r * Math.cos((a * Math.PI) / 180), y = r * Math.sin((a * Math.PI) / 180);
    if (inside(wood, x, y)) { if (y < 0) n++; else s++; }
  }
  return { n, s };
})();
check(northShare.n > northShare.s, `woodruff (shade) sits mainly north of the tree (${northShare.n} vs ${northShare.s})`);

const cloverOnly = (treeAge: 'YOUNG' | 'ESTABLISHED') => computeGroundCovers(base({ treeAge, covers: [base().covers[0]], clumps: [] }))[0];
const cloverEst = cloverOnly('ESTABLISHED');
check(cloverEst.areaM2 > cloverOnly('YOUNG').areaM2 + 0.5, 'established trees let covers grow closer to the trunk');
check(minDistToPoint(cloverOnly('YOUNG'), 0, 0) < 1.0, 'clover alone reaches the young-tree clearance edge');
check(minDistToPoint(cloverEst, 0, 0) >= trunkClearanceM(apple, 'ESTABLISHED', getGroundCoverSpec(plant('plant-white-clover'))) - 0.05, 'clover keeps the 0.5 m vole-safe collar when established');

// determinism and translation invariance
const again = computeGroundCovers(base());
check(JSON.stringify(again) === JSON.stringify(young), 'deterministic output');
const shifted = computeGroundCovers(base({
  stars: [{ key: 's1', xM: 10, yM: -5, star: apple }],
  covers: base().covers.map(c => ({ ...c, anchor: { xM: c.anchor.xM + 10, yM: c.anchor.yM - 5 } })),
  clumps: [{ xM: 8, yM: -4, plant: plant('plant-comfrey') }],
}));
const sClover = byId(shifted, 'plant-white-clover');
check(Math.abs(sClover.areaM2 - clover.areaM2) / clover.areaM2 < 0.03, 'translated garden gives the same clover area');

// two trees: clover melts into one patch when close, stays separate when far apart
const twoTrees = (dx: number) => computeGroundCovers(base({
  stars: [{ key: 's1', xM: 0, yM: 0, star: apple }, { key: 's2', xM: dx, yM: 0, star: apple }],
  covers: [{ instanceId: 'c1', plant: plant('plant-white-clover'), anchor: { xM: dx / 2, yM: 0 }, servingStarKeys: ['s1', 's2'] }],
  clumps: [],
}));
const outerRings = (s: CoverShape) => s.rings.filter((r, i) => {
  let depth = 0;
  s.rings.forEach((o, k) => { if (k !== i && pointInRing(r[0][0], r[0][1], o)) depth++; });
  return depth % 2 === 0;
}).length;
check(outerRings(twoTrees(7)[0]) === 1, 'clover around two close trees melts into one patch');
check(outerRings(twoTrees(20)[0]) === 2, 'clover around two distant trees stays two patches');
check(!inside(twoTrees(7)[0], 7, 0), 'merged clover still keeps the second trunk bare');

// seasons
const winter = computeGroundCovers(base({ season: 'SUMMER' }));
check(!byId(winter, 'plant-daffodil').inSeason && byId(winter, 'plant-white-clover').inSeason, 'season flag: daffodil out of season in summer');

// allium buffer for legume covers
const withChives = computeGroundCovers(base({ clumps: [{ xM: 2, yM: 0, plant: plant('plant-chives') }] }));
check(!inside(byId(withChives, 'plant-white-clover'), 2, 1.5), 'clover keeps 1.8 m from chives (allium/legume buffer)');

// no NaN anywhere
check(!JSON.stringify(young).includes('null'), 'no NaN / null coordinates');

// performance: 25 trees, 3 covers each, 10 cm grid
{
  const stars = Array.from({ length: 25 }, (_, i) => ({ key: `s${i}`, xM: (i % 5) * 8, yM: Math.floor(i / 5) * 8, star: apple }));
  const ids = ['plant-white-clover', 'plant-daffodil', 'plant-phacelia'];
  const covers = ids.map((id, k) => ({ instanceId: `c${k}`, plant: plant(id), anchor: { xM: 0, yM: 0 }, servingStarKeys: stars.map(s => s.key) }));
  const t1 = Date.now();
  const out = computeGroundCovers(base({ stars, covers, clumps: [] }));
  const ms = Date.now() - t1;
  check(out.length === 3, 'big garden produces 3 shapes');
  check(ms < 4000, `25-tree garden computes in < 4 s (took ${ms} ms)`);
  console.log(`ground cover timing: single tree ${tYoung} ms, 25 trees ${ms} ms`);
}

// Radial view renders the areas (server-side markup, no transforms inside the cover layer)
{
  const plants = ['plant-white-clover', 'plant-comfrey', 'plant-daffodil', 'plant-phacelia'].map(plant);
  const html = renderToStaticMarkup(React.createElement(GardenPlanCanvas, {
    language: 'en', starTree: apple, selectedPlants: plants, currentSeason: 'SUMMER', hemisphere: 'NORTHERN',
    onSelectPlant: () => {},
  }));
  const layer = html.match(/<g id="ground-covers"[\s\S]*?<g id="canopy-spreads"/)?.[0] ?? '';
  check(layer.includes('data-cover="plant-white-clover"') && layer.includes('data-cover="plant-phacelia"'), 'radial SVG draws clover and phacelia areas');
  check(!layer.includes('transform='), 'ground-cover layer uses absolute coordinates');
  check(!/NaN|Infinity|undefined/.test(layer), 'ground-cover layer has no NaN/Infinity');
  check(html.includes('fill-rule="evenodd"'), 'covers use the even-odd rule (holes)');
}

if (failed > 0) {
  console.error(`ground cover: ${failed} failed, ${passed} passed`);
  process.exit(1);
}
console.log(`ground cover: ${passed}/${passed} checks passed`);
