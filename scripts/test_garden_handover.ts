/**
 * "Open in garden grid" handover of a multi-star cluster into an existing garden.
 *
 * App.handleOpenInGardenGrid hands buildClusterStarInstances(...) to GardenPlannerPage, which appends
 * them to its stars. Before the fix every cluster landed at the cluster's own origin, so opening the
 * apple LINE x3 preset twice stacked three trunks onto three trunks (TRUNK_COLLISION at 0 m).
 * The placement is now a pure function (HANDOVER below) that translates the new cluster into free space.
 *
 * Oracles (independent of the implementation): analyzeGardenAntagonisms for star–star conflicts,
 * getRecommendedSpacingM / getMinTrunkDistanceM for spacing, computeClusterGardenLayout (the radial
 * preview) for the cluster layout, resolveGardenConflicts for the companions, the garden share code
 * for the round-trip, and a brute-force search for "is a conflict-free spot available".
 *
 * "Avoidable" (precise): a translation (tx, ty) on the 0.5 m lattice inside the box
 *   [bbox(existing stars) ∪ {0}] expanded by (cluster extent + JUGLONE_ROOT_ZONE_M + 5 m)
 * exists for which every new star keeps >= pairSpacing to every existing star and no new star–star
 * CRITICAL conflict or TRUNK_COLLISION appears. If such a spot exists the handover must not introduce
 * any CRITICAL star–star conflict, trunk collision or spacing violation; and if a spot without any
 * star–star conflict exists (pest-host WARNINGs included), none may be introduced.
 * pairSpacing(a, b) = max(TRUNK_COLLISION threshold, recommended optimal spacing of a and of b).
 */
import { STAR_TREES } from '../src/data/starTrees';
import { GUILD_PLANTS } from '../src/data/guildPlants';
import { GUILD_PRESETS } from '../src/core/guildPresets';
import {
  buildClusterStarInstances,
  computeClusterGardenLayout,
  getRecommendedSpacingM,
} from '../src/core/multiStarLayout';
import * as MSL from '../src/core/multiStarLayout';
import { resolveGardenConflicts } from '../src/core/gardenOptimizer';
import * as GO from '../src/core/gardenOptimizer';
import { analyzeGardenAntagonisms } from '../src/core/gardenAntagonist';
import { partitionGuildByCompatibility } from '../src/core/compatibility';
import { JUGLONE_ROOT_ZONE_M } from '../src/core/placementRules';
import { encodeGardenToCode, decodeGardenFromCode } from '../src/utils/shareUtils';
import * as storage from '../src/utils/gardenStorage';
import {
  GardenConflict,
  GardenStarPlantInstance,
  StarPlantClusterConfig,
  StarPlantPattern,
} from '../src/types/garden';
import { GuildPlant, Hemisphere, StarTree } from '../src/types/guild';

/* ----------------------------------------------------------------------------------------------- */
/* Harness                                                                                          */
/* ----------------------------------------------------------------------------------------------- */

let passedChecks = 0;
let totalChecks = 0;
const scenarioResults: Array<{ name: string; failures: number; checks: number }> = [];
let currentScenario = '';
let currentFailures = 0;
let currentChecks = 0;
const printedPerScenario = new Map<string, number>();
const advisories: string[] = [];

function assert(condition: boolean, message: string | (() => string)) {
  totalChecks++;
  currentChecks++;
  if (condition) {
    passedChecks++;
    return;
  }
  currentFailures++;
  process.exitCode = 1;
  const n = printedPerScenario.get(currentScenario) ?? 0;
  if (n < 12) console.error(`FAIL [${currentScenario}]: ${typeof message === 'string' ? message : message()}`);
  else if (n === 12) console.error(`FAIL [${currentScenario}]: ... further failures suppressed`);
  printedPerScenario.set(currentScenario, n + 1);
}

function advise(message: string) {
  if (advisories.length < 40) advisories.push(`[${currentScenario}] ${message}`);
  else if (advisories.length === 40) advisories.push('... further advisories suppressed');
}

function scenario(name: string, fn: () => void) {
  currentScenario = name;
  currentFailures = 0;
  currentChecks = 0;
  try {
    fn();
  } catch (e) {
    assert(false, `threw: ${(e as Error).stack || e}`);
  }
  scenarioResults.push({ name, failures: currentFailures, checks: currentChecks });
}

/* ----------------------------------------------------------------------------------------------- */
/* Implementation under test (see handover/API.md)                                                  */
/* ----------------------------------------------------------------------------------------------- */

type Placement = { starPlants: GardenStarPlantInstance[]; offsetM: { dx: number; dy: number }; moved: boolean; renamed?: boolean };
const placeClusterInGarden = (MSL as unknown as {
  placeClusterInGarden: (e: readonly GardenStarPlantInstance[], n: readonly GardenStarPlantInstance[], o?: { stepM?: number; clearanceM?: number }) => Placement;
}).placeClusterInGarden;
const getRequiredStarDistanceM = (MSL as unknown as {
  getRequiredStarDistanceM?: (a: StarTree, b: StarTree) => { spacingM: number; ruleM: number };
}).getRequiredStarDistanceM;
if (typeof placeClusterInGarden !== 'function') throw new Error('placeClusterInGarden is not exported from src/core/multiStarLayout.ts');
/** Companion layout of a rigidly moved, isolated cluster equals the preview (API.md). */
const JITTER_TRANSLATION_INVARIANT = true;
let lastPlacement: Placement | null = null;

/**
 * Exactly what GardenPlannerPage's hand-over effect stores: placeClusterInGarden(currentStars,
 * pendingTreesToPlace), then append the placed stars whose id is not in the garden yet.
 */
function HANDOVER(existing: GardenStarPlantInstance[], incoming: GardenStarPlantInstance[]): GardenStarPlantInstance[] {
  const placement = placeClusterInGarden(existing, incoming);
  lastPlacement = placement;
  return [...existing, ...placement.starPlants.filter(t => !existing.some(p => p.instanceId === t.instanceId))];
}

/* ----------------------------------------------------------------------------------------------- */
/* Fixtures                                                                                         */
/* ----------------------------------------------------------------------------------------------- */

const TREE = (id: string): StarTree => {
  const t = STAR_TREES.find(s => s.id === id);
  if (!t) throw new Error(`unknown star ${id}`);
  return t;
};
const PLANTS_BY_ID = new Map(GUILD_PLANTS.map(p => [p.id, p]));
const PATTERNS: StarPlantPattern[] = ['LINE', 'GRID', 'TRIANGLE'];
const HEMISPHERES: Hemisphere[] = ['NORTHERN', 'SOUTHERN'];

function guildIds(star: StarTree, ids?: readonly string[]): string[] {
  const src = ids ?? star.recommendedCompanions.slice(0, 8);
  return partitionGuildByCompatibility(
    star,
    src.map(id => PLANTS_BY_ID.get(id)).filter((p): p is GuildPlant => Boolean(p) && !p!.retired)
  ).compatible.map(p => p.id);
}

function star(id: string, treeId: string, x: number, y: number, ids?: string[]): GardenStarPlantInstance {
  const tree = TREE(treeId);
  return { instanceId: id, treeId, starTree: tree, xM: x, yM: y, selectedPlantIds: ids ?? guildIds(tree) };
}

/** Existing gardens (positions in metres). */
function existingGardens(): Array<{ name: string; stars: GardenStarPlantInstance[] }> {
  const apple = TREE('tree-apple');
  const appleLine3 = buildClusterStarInstances(apple, { pattern: 'LINE', count: 3, spacingM: 0, orientationDeg: 90 }, guildIds(apple, GUILD_PRESETS.apple.plantIds), 'old');
  const dense: GardenStarPlantInstance[] = [];
  const denseIds = ['tree-apple', 'tree-pear', 'tree-plum', 'tree-cherry', 'tree-hazelnut', 'tree-quince', 'tree-fig', 'shrub-blackcurrant'];
  let k = 0;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    dense.push(star(`dense-${k}`, denseIds[k % denseIds.length], (i - 1.5) * 7.5, (j - 1.5) * 7.5));
    k++;
  }
  return [
    { name: 'empty', stars: [] },
    { name: 'apple@origin', stars: [star('e-apple', 'tree-apple', 0, 0)] },
    { name: 'apple-LINEx3@origin (bug report)', stars: appleLine3 },
    { name: 'near-centre pear+cherry', stars: [star('e-pear', 'tree-pear', 1.2, 0.4), star('e-cherry', 'tree-cherry', -2.5, 3.1)] },
    { name: 'dense 4x4 mixed (7.5 m)', stars: dense },
    { name: 'walnut@(6,0)', stars: [star('e-walnut', 'tree-walnut', 6, 0)] },
    { name: 'walnut@origin + apple@(20,0)', stars: [star('e-walnut0', 'tree-walnut', 0, 0), star('e-apple20', 'tree-apple', 20, 0)] },
    { name: 'elderberry star@origin (SWD host)', stars: [star('e-elder', 'shrub-elderberry', 0, 0)] },
    { name: 'alder star@(3,-2) (Prunus host)', stars: [star('e-alder', 'tree-alder', 3, -2)] },
    { name: 'off-origin garden around (40,-25)', stars: [star('o1', 'tree-pear', 40, -25), star('o2', 'tree-plum', 46, -25), star('o3', 'tree-cherry', 43, -19)] },
    { name: 'ring of hazels r=6', stars: Array.from({ length: 8 }, (_, i) => star(`ring-${i}`, 'tree-hazelnut', Number((6 * Math.cos(i * Math.PI / 4)).toFixed(2)), Number((6 * Math.sin(i * Math.PI / 4)).toFixed(2)))) },
  ];
}

/** Incoming clusters: [star, guild, pattern list, counts]. */
const CLUSTER_STARS: Array<{ id: string; preset?: keyof typeof GUILD_PRESETS }> = [
  { id: 'tree-apple', preset: 'apple' },
  { id: 'tree-walnut', preset: 'walnut' },
  { id: 'tree-apricot', preset: 'apricot' },
  { id: 'tree-cherry' },
  { id: 'tree-plum' },
  { id: 'shrub-blueberry' },
];

/* ----------------------------------------------------------------------------------------------- */
/* Oracles                                                                                          */
/* ----------------------------------------------------------------------------------------------- */

/** Trunk-collision threshold of analyzeGardenAntagonisms for a pair. */
const pairMinTrunk = (a: StarTree, b: StarTree) => Math.max(1.5, (a.matureRadiusM + b.matureRadiusM) * 0.4);
/**
 * Recommended spacing of two stars: the larger of the two species' recommended (optimal) spacings
 * (getRecommendedSpacingM), never below the trunk-collision rule. Two identical stars: exactly the
 * spacing the radial plan uses inside a cluster.
 */
const pairSpacing = (a: StarTree, b: StarTree) =>
  Math.max(pairMinTrunk(a, b), getRecommendedSpacingM(a).optimal, getRecommendedSpacingM(b).optimal);

const EPS = 1e-6;

/** Star–star conflicts (no companions) between a new star and an existing one. */
function crossStarConflicts(existing: GardenStarPlantInstance[], added: GardenStarPlantInstance[]): GardenConflict[] {
  const exIds = new Set(existing.map(s => s.instanceId));
  const newIds = new Set(added.map(s => s.instanceId));
  return analyzeGardenAntagonisms([...existing, ...added], []).filter(c =>
    (exIds.has(c.plantA.id) && newIds.has(c.plantB.id)) || (newIds.has(c.plantA.id) && exIds.has(c.plantB.id))
  );
}
const isHardStarConflict = (c: GardenConflict) => c.severity === 'CRITICAL' || c.type === 'TRUNK_COLLISION';

function translate(stars: GardenStarPlantInstance[], tx: number, ty: number): GardenStarPlantInstance[] {
  return stars.map(s => ({ ...s, xM: s.xM + tx, yM: s.yM + ty }));
}

/** Brute-force "avoidable" search (see header). Returns a free translation or null. */
function findFreeSpot(existing: GardenStarPlantInstance[], incoming: GardenStarPlantInstance[], wantSoft = false): { tx: number; ty: number } | null {
  if (existing.length === 0) return { tx: 0, ty: 0 };
  const xs = [0, ...existing.map(s => s.xM)], ys = [0, ...existing.map(s => s.yM)];
  const ext = Math.max(...incoming.map(s => Math.hypot(s.xM, s.yM) + s.starTree.matureRadiusM));
  const pad = ext + JUGLONE_ROOT_ZONE_M + 5;
  const minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad;
  const minY = Math.min(...ys) - pad, maxY = Math.max(...ys) + pad;
  // Rings outward from the origin so the first hit is near; coarse 0.5 m lattice
  const cand: Array<[number, number]> = [];
  for (let x = Math.ceil(minX * 2) / 2; x <= maxX; x += 0.5) for (let y = Math.ceil(minY * 2) / 2; y <= maxY; y += 0.5) cand.push([x, y]);
  cand.sort((a, b) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1]));
  for (const [tx, ty] of cand) {
    const moved = translate(incoming, tx, ty);
    let ok = true;
    for (const n of moved) {
      for (const e of existing) {
        if (Math.hypot(n.xM - e.xM, n.yM - e.yM) < pairSpacing(n.starTree, e.starTree) - EPS) { ok = false; break; }
      }
      if (!ok) break;
    }
    if (!ok) continue;
    const cc = crossStarConflicts(existing, moved);
    if (cc.some(isHardStarConflict)) continue;
    if (wantSoft && cc.length > 0) continue;
    return { tx, ty };
  }
  return null;
}

const sameNum = (a: number, b: number, tol = 1e-6) => Math.abs(a - b) <= tol;

function companionCausedProblems(stars: GardenStarPlantInstance[], res: ReturnType<typeof resolveGardenConflicts>): GardenConflict[] {
  const compIds = new Set(res.companions.map(c => c.instanceId));
  return res.unresolved.filter(c =>
    (c.severity === 'CRITICAL' || c.severity === 'WARNING') && (compIds.has(c.plantA.id) || compIds.has(c.plantB.id))
  );
}

/** Distance from which two stars cannot influence each other's companion layout. */
function isolationM(a: StarTree, b: StarTree): number {
  const range = (GO as unknown as { getStarInteractionRangeM?: (a: StarTree, b: StarTree) => number }).getStarInteractionRangeM;
  return Math.max(1.5 * (a.matureRadiusM + b.matureRadiusM) + 2, range ? range(a, b) : 0);
}

/**
 * Compares the companions serving only stars of `gotStars` with those of `wantStars` (same order =
 * same star index), relative to star 0, with a 1.1 cm tolerance (cm rounding). null = equal.
 */
function compareRelCompanions(
  gotRes: ReturnType<typeof resolveGardenConflicts>, gotStars: GardenStarPlantInstance[],
  wantRes: ReturnType<typeof resolveGardenConflicts>, wantStars: GardenStarPlantInstance[]
): string | null {
  const rows = (res: ReturnType<typeof resolveGardenConflicts>, group: GardenStarPlantInstance[]) => {
    const idx = new Map(group.map((s, i) => [s.instanceId, i]));
    return res.companions
      .filter(c => c.servicingTreeIds.length > 0 && c.servicingTreeIds.every(id => idx.has(id)))
      .map(c => ({
        key: `${c.plantId}|${c.servicingTreeIds.map(id => idx.get(id)).sort().join('+')}|${c.isMerged}|${c.currentLightCondition}`,
        dx: c.xM - group[0].xM,
        dy: c.yM - group[0].yM,
      }))
      .sort((a, b) => a.key.localeCompare(b.key) || a.dx - b.dx || a.dy - b.dy);
  };
  const g = rows(gotRes, gotStars), w = rows(wantRes, wantStars);
  if (g.length !== w.length) return `${g.length} vs ${w.length} companions`;
  for (let i = 0; i < g.length; i++) {
    if (g[i].key !== w[i].key) return `companion ${g[i].key} vs preview ${w[i].key}`;
    if (Math.abs(g[i].dx - w[i].dx) > 0.011 || Math.abs(g[i].dy - w[i].dy) > 0.011) {
      return `${g[i].key} at rel (${g[i].dx.toFixed(3)},${g[i].dy.toFixed(3)}) vs preview (${w[i].dx.toFixed(3)},${w[i].dy.toFixed(3)})`;
    }
  }
  return null;
}

/* ----------------------------------------------------------------------------------------------- */
/* One handover, all invariants                                                                     */
/* ----------------------------------------------------------------------------------------------- */

interface HandoverCase {
  label: string;
  existing: GardenStarPlantInstance[];
  tree: StarTree;
  cfg: StarPlantClusterConfig;
  ids: string[];
  hemisphere: Hemisphere;
  autoResolve: boolean;
  stamp: string;
}

interface HandoverOutcome {
  merged: GardenStarPlantInstance[];
  added: GardenStarPlantInstance[];
  tx: number;
  ty: number;
}

const stats = { handovers: 0, translated: 0, avoidableChecked: 0, jitterCompared: 0, jitterSkipped: 0 };

function checkHandover(h: HandoverCase): HandoverOutcome {
  stats.handovers++;
  const L = `${h.label} | ${h.tree.id} ${h.cfg.pattern}x${h.cfg.count} ${h.hemisphere} auto=${h.autoResolve} into ${h.existing.length} stars`;
  const existingSnapshot = JSON.stringify(h.existing);
  const incoming = buildClusterStarInstances(h.tree, h.cfg, h.ids, h.stamp);
  const incomingSnapshot = JSON.stringify(incoming);
  const preview = computeClusterGardenLayout(h.tree, h.cfg, h.ids, { hemisphere: h.hemisphere, autoResolve: h.autoResolve, idStamp: h.stamp });

  const merged = HANDOVER(h.existing, incoming);
  const merged2 = HANDOVER(JSON.parse(existingSnapshot).map((s: GardenStarPlantInstance) => ({ ...s, starTree: TREE(s.treeId) })), JSON.parse(incomingSnapshot).map((s: GardenStarPlantInstance) => ({ ...s, starTree: TREE(s.treeId) })));

  // Inputs untouched, existing stars untouched and first, in order
  assert(JSON.stringify(h.existing) === existingSnapshot, `${L}: existing input array mutated`);
  assert(JSON.stringify(incoming) === incomingSnapshot, `${L}: incoming input array mutated`);
  assert(merged.length === h.existing.length + incoming.length, `${L}: merged has ${merged.length} stars, expected ${h.existing.length + incoming.length}`);
  for (let i = 0; i < h.existing.length; i++) {
    assert(JSON.stringify(merged[i]) === JSON.stringify(h.existing[i]), () => `${L}: existing star ${i} changed: ${JSON.stringify({ ...merged[i], starTree: undefined })} vs ${JSON.stringify({ ...h.existing[i], starTree: undefined })}`);
  }
  const added = merged.slice(h.existing.length);

  // Deterministic
  assert(JSON.stringify(merged) === JSON.stringify(merged2), `${L}: not deterministic (two calls on equal inputs differ)`);

  // Ids unique
  const ids = merged.map(s => s.instanceId);
  assert(new Set(ids).size === ids.length, () => `${L}: duplicate instance ids ${ids.filter((x, i) => ids.indexOf(x) !== i).join(',')}`);

  // Same stars, same guilds, same order as the incoming cluster
  for (let i = 0; i < added.length && i < incoming.length; i++) {
    assert(added[i].treeId === incoming[i].treeId && added[i].starTree.id === incoming[i].treeId, `${L}: new star ${i} species changed`);
    assert(JSON.stringify(added[i].selectedPlantIds) === JSON.stringify(incoming[i].selectedPlantIds), `${L}: new star ${i} companion list changed`);
    assert(Number.isFinite(added[i].xM) && Number.isFinite(added[i].yM), `${L}: new star ${i} non-finite position`);
  }

  // Rigid translation: star offsets identical to the radial preview
  const tx = added.length ? added[0].xM - preview.starPlants[0].xM : 0;
  const ty = added.length ? added[0].yM - preview.starPlants[0].yM : 0;
  for (let i = 0; i < added.length; i++) {
    const p = preview.starPlants[i];
    assert(sameNum(added[i].xM - p.xM, tx) && sameNum(added[i].yM - p.yM, ty),
      () => `${L}: star ${i} offset not preserved: got (${added[i].xM},${added[i].yM}) preview (${p.xM},${p.yM}) translation (${tx.toFixed(3)},${ty.toFixed(3)})`);
  }
  if (Math.abs(tx) > EPS || Math.abs(ty) > EPS) stats.translated++;

  // Empty garden: nothing moves, the garden equals the radial preview exactly
  if (h.existing.length === 0) {
    assert(Math.abs(tx) < EPS && Math.abs(ty) < EPS, `${L}: empty garden but cluster moved by (${tx},${ty})`);
    const res = resolveGardenConflicts(merged, { allGuildPlants: GUILD_PLANTS, hemisphere: h.hemisphere, enabled: h.autoResolve, pinned: new Set() });
    assert(JSON.stringify(res) === JSON.stringify(preview.resolution), `${L}: empty-garden resolution differs from the radial preview`);
  }

  // Spacing to existing stars (>= pairSpacing) and no hard star–star conflicts, when avoidable
  const freeSpot = findFreeSpot(h.existing, incoming);
  stats.avoidableChecked++;
  const cross = crossStarConflicts(h.existing, added);
  if (freeSpot) {
    for (const n of added) for (const e of h.existing) {
      const d = Math.hypot(n.xM - e.xM, n.yM - e.yM);
      const need = pairSpacing(n.starTree, e.starTree);
      assert(d >= need - EPS, () => `${L}: new ${n.instanceId} at (${n.xM.toFixed(2)},${n.yM.toFixed(2)}) is ${d.toFixed(2)} m from existing ${e.instanceId} (${e.treeId} @ ${e.xM},${e.yM}); recommended >= ${need.toFixed(2)} m (free spot exists, e.g. translation ${freeSpot.tx},${freeSpot.ty})`);
    }
    for (const c of cross.filter(isHardStarConflict)) {
      assert(false, `${L}: introduced avoidable ${c.severity} ${c.type} ${c.plantA.id} <-> ${c.plantB.id} at ${c.distanceM} m (required ${c.requiredDistanceM} m; free translation e.g. ${freeSpot.tx},${freeSpot.ty})`);
    }
  } else {
    advise(`${L}: no free spot found in search box (unexpected)`);
  }
  // Star–star WARNINGs (pest/pathogen host stars, e.g. elder next to cherry at < 20 m) too, when a
  // completely conflict-free spot exists (API.md: ruleM includes the INTERNAL pest-host distances)
  const soft = cross.filter(c => !isHardStarConflict(c));
  if (soft.length > 0) {
    const softFree = findFreeSpot(h.existing, incoming, true);
    assert(!softFree, () => `${L}: introduced ${soft.length} avoidable star–star ${soft[0].severity} ${soft[0].type} (${soft[0].plantA.id} <-> ${soft[0].plantB.id} at ${soft[0].distanceM} m, safe ${soft[0].requiredDistanceM} m); conflict-free translation exists e.g. ${softFree!.tx},${softFree!.ty}`);
  }

  // Placement result is consistent with what happened, and the offset is (near-)minimal
  if (lastPlacement) {
    const pl = lastPlacement;
    assert(sameNum(pl.offsetM.dx, tx) && sameNum(pl.offsetM.dy, ty), `${L}: offsetM (${pl.offsetM.dx},${pl.offsetM.dy}) != applied translation (${tx},${ty})`);
    assert(pl.moved === (Math.abs(tx) > EPS || Math.abs(ty) > EPS), `${L}: moved=${pl.moved} but translation (${tx},${ty})`);
    assert(Math.abs(tx * 2 - Math.round(tx * 2)) < 1e-6 && Math.abs(ty * 2 - Math.round(ty * 2)) < 1e-6, `${L}: offset (${tx},${ty}) not on the 0.5 m lattice`);
    const norm = Math.hypot(tx, ty);
    if (freeSpot && norm > 0) {
      // Independent oracle: the nearest lattice offset that keeps spacing and has no star–star conflict
      const nearest = findFreeSpot(h.existing, incoming, true);
      if (nearest) {
        const n0 = Math.hypot(nearest.tx, nearest.ty);
        // API.md: a straight shift may win if <= ~10 % + 1 m (+ one step) longer; the step grows
        // beyond 0.5 m only for search bounds over ~50 m (allow up to 2 m there)
        const far = Math.max(...h.existing.map(e => Math.hypot(e.xM, e.yM))) + Math.max(...incoming.map(s => Math.hypot(s.xM, s.yM))) + JUGLONE_ROOT_ZONE_M > 50;
        assert(norm <= n0 * 1.1 + 1 + (far ? 2 : 0.5) + EPS, `${L}: offset (${tx},${ty}) |${norm.toFixed(2)}| m is far from minimal; conflict-free offset (${nearest.tx},${nearest.ty}) |${n0.toFixed(2)}| m exists`);
      }
    }
    if (h.existing.length > 0 && norm === 0) {
      // Not moved: then the cluster already fit where it was
      assert(cross.length === 0, `${L}: not moved although it conflicts with existing stars`);
    }
  }

  // Companions: the merged garden (same options as GardenPlannerPage) adds no unresolved companion conflicts
  const resMerged = resolveGardenConflicts(merged, { allGuildPlants: GUILD_PLANTS, hemisphere: h.hemisphere, enabled: h.autoResolve, pinned: new Set() });
  const resExisting = h.existing.length
    ? resolveGardenConflicts(h.existing, { allGuildPlants: GUILD_PLANTS, hemisphere: h.hemisphere, enabled: h.autoResolve, pinned: new Set() })
    : null;
  const before = (resExisting ? companionCausedProblems(h.existing, resExisting).length : 0) + companionCausedProblems(preview.starPlants, preview.resolution).length;
  const after = companionCausedProblems(merged, resMerged);
  if (h.autoResolve) {
    assert(after.length <= before, () => `${L}: merged garden has ${after.length} unresolved companion CRITICAL/WARNING conflicts, existing alone + preview alone had ${before}; first: ${after.slice(0, 3).map(c => `${c.severity} ${c.type} ${c.plantA.id}<->${c.plantB.id} ${c.distanceM}m`).join('; ')}`);
  }

  // Companions of the new cluster keep the preview's layout relative to their stars when the cluster
  // is isolated (no companion shared with an existing star, no substitution touching both groups)
  const newIds = new Set(added.map(s => s.instanceId));
  const shared = resMerged.companions.some(c => c.servicingTreeIds.some(id => newIds.has(id)) && c.servicingTreeIds.some(id => !newIds.has(id)));
  const newEff = added.map(s => JSON.stringify(resMerged.effectiveCompanionIds[s.instanceId]));
  const prevEff = preview.starPlants.map(s => JSON.stringify(preview.resolution.effectiveCompanionIds[s.instanceId]));
  // Isolated = additionally every new star is far enough from every existing star that neither
  // guild's companion area (<= 1.5 x canopy radius + 1 m each) can touch the other
  const isolated = added.every(n => h.existing.every(e => Math.hypot(n.xM - e.xM, n.yM - e.yM) >= isolationM(n.starTree, e.starTree)));
  if (isolated && !shared && h.existing.length > 0 && JSON.stringify(newEff) === JSON.stringify(prevEff)) {
    stats.jitterCompared++;
    const diff = compareRelCompanions(resMerged, added, preview.resolution, preview.starPlants);
    const equal = diff === null;
    if (JITTER_TRANSLATION_INVARIANT) {
      assert(equal, () => `${L}: companions relative to their stars differ from the preview after translation (${tx.toFixed(2)},${ty.toFixed(2)}): ${diff}`);
    } else if (!equal) {
      advise(`${L}: companion layout relative to stars differs from preview after translation (jitter not translation-invariant)`);
    }
  } else if (h.existing.length > 0) {
    stats.jitterSkipped++;
  }

  // Share code round-trip of the merged garden
  const code = encodeGardenToCode({
    starPlants: merged.map(s => ({ treeId: s.treeId, xM: s.xM, yM: s.yM, selectedPlantIds: s.selectedPlantIds ?? [] })),
    hemisphere: h.hemisphere,
    zone: 'TEMPERATE',
    soil: 'LOAM',
    language: 'en',
  });
  const dec = decodeGardenFromCode(code);
  assert(Boolean(dec), `${L}: share code did not decode`);
  if (dec) {
    assert(dec.starPlants.length === merged.length, `${L}: share round-trip has ${dec.starPlants.length} stars, expected ${merged.length}`);
    assert(dec.hemisphere === h.hemisphere, `${L}: share round-trip hemisphere ${dec.hemisphere}`);
    for (let i = 0; i < Math.min(dec.starPlants.length, merged.length); i++) {
      const a = merged[i], b = dec.starPlants[i];
      assert(a.treeId === b.treeId, `${L}: share star ${i} species ${b.treeId} != ${a.treeId}`);
      assert(Math.abs(a.xM - b.xM) <= 0.05 + EPS && Math.abs(a.yM - b.yM) <= 0.05 + EPS,
        `${L}: share star ${i} moved (${a.xM},${a.yM}) -> (${b.xM},${b.yM})`);
      assert(JSON.stringify([...(a.selectedPlantIds ?? [])].sort()) === JSON.stringify([...b.selectedPlantIds!].sort()),
        `${L}: share star ${i} companions changed`);
    }
    // Decimetre rounding must not create star–star conflicts the merged garden does not have
    const hardMerged = analyzeGardenAntagonisms(merged, []).filter(isHardStarConflict).length;
    const hardDec = analyzeGardenAntagonisms(dec.starPlants, []).filter(isHardStarConflict).length;
    assert(hardDec <= hardMerged, `${L}: share round-trip introduces star–star conflicts (${hardDec} vs ${hardMerged})`);
    // Re-encoding the decoded garden is stable
    const code2 = encodeGardenToCode({
      starPlants: dec.starPlants.map(s => ({ treeId: s.treeId, xM: s.xM, yM: s.yM, selectedPlantIds: s.selectedPlantIds ?? [] })),
      hemisphere: dec.hemisphere, zone: dec.zone ?? undefined, soil: dec.soil ?? undefined, language: dec.language,
    });
    assert(code2 === code, `${L}: share code not stable after one round-trip`);
    // Positions on the decimetre lattice round-trip exactly
    const onLattice = merged.every(s => Math.abs(s.xM * 10 - Math.round(s.xM * 10)) < 1e-6 && Math.abs(s.yM * 10 - Math.round(s.yM * 10)) < 1e-6);
    if (onLattice) {
      for (let i = 0; i < Math.min(dec.starPlants.length, merged.length); i++) {
        assert(sameNum(dec.starPlants[i].xM, merged[i].xM) && sameNum(dec.starPlants[i].yM, merged[i].yM), `${L}: decimetre position ${i} not exact after round-trip`);
      }
    } else if (h.existing.length > 0 && (Math.abs(tx * 10 - Math.round(tx * 10)) > 1e-6 || Math.abs(ty * 10 - Math.round(ty * 10)) > 1e-6)) {
      advise(`${L}: translation (${tx},${ty}) is not decimetre-aligned, so share links shift the cluster's stars by different rounding`);
    }
  }

  return { merged, added, tx, ty };
}

/* ----------------------------------------------------------------------------------------------- */
/* Scenarios                                                                                        */
/* ----------------------------------------------------------------------------------------------- */

function configsFor(pattern: StarPlantPattern, count: number): StarPlantClusterConfig[] {
  return [{ pattern, count, spacingM: 0, orientationDeg: 90 }];
}

scenario('radial preview reads the same auto-resolve preference as the garden', () => {
  // Pure part: readSavedAutoResolvePreference vs the garden's own rule (GardenPlannerPage:
  // JSON.parse(localStorage[STORAGE_KEY_GARDEN_GRID]); typeof autoResolveEnabled === 'boolean' ? it : true;
  // unreadable state -> null -> true)
  const store = new Map<string, string>();
  const shim = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => { store.set(k, String(v)); },
    removeItem: (k: string) => { store.delete(k); },
    clear: () => store.clear(),
    key: (i: number) => [...store.keys()][i] ?? null,
    get length() { return store.size; },
  };
  const g = globalThis as unknown as { localStorage?: unknown };
  const had = 'localStorage' in g;
  const prev = g.localStorage;
  g.localStorage = shim;
  try {
    assert(storage.STORAGE_KEY_GARDEN_GRID === 'permaculture_garden_grid_v1', `garden storage key is ${storage.STORAGE_KEY_GARDEN_GRID}`);
    const gardenRule = (raw: string | null): boolean => {
      let saved: { autoResolveEnabled?: unknown } | null = null;
      try { if (raw) saved = JSON.parse(raw); } catch { saved = null; }
      return typeof saved?.autoResolveEnabled === 'boolean' ? saved.autoResolveEnabled : true;
    };
    const cases: Array<string | null> = [
      null, '', '{}', 'null', '42', '"x"', '[]', '{not json',
      JSON.stringify({ autoResolveEnabled: false }), JSON.stringify({ autoResolveEnabled: true }),
      JSON.stringify({ autoResolveEnabled: 'false' }), JSON.stringify({ autoResolveEnabled: 0 }),
      JSON.stringify({ autoResolveEnabled: null }), JSON.stringify({ starPlants: [], autoResolveEnabled: false, pinnedCompanions: [] }),
    ];
    for (const raw of cases) {
      store.clear();
      if (raw !== null) store.set(storage.STORAGE_KEY_GARDEN_GRID, raw);
      const got = storage.readSavedAutoResolvePreference();
      assert(got === gardenRule(raw), `saved ${JSON.stringify(raw)}: preview reads ${got}, garden uses ${gardenRule(raw)}`);
    }
    // A preference under another key must not be read
    store.clear();
    store.set('permaculture_plant_guild_v1', JSON.stringify({ autoResolveEnabled: false }));
    assert(storage.readSavedAutoResolvePreference() === true, 'preference read from a foreign key');
    // getItem throwing (privacy mode) -> default on, like the garden
    g.localStorage = { ...shim, getItem: () => { throw new Error('denied'); } };
    let v: boolean | string;
    try { v = storage.readSavedAutoResolvePreference(); } catch (e) { v = `threw ${(e as Error).message}`; }
    assert(v === true, `throwing localStorage: ${v}`);
    // No localStorage at all (SSR / tests) -> default on
    delete g.localStorage;
    try { v = storage.readSavedAutoResolvePreference(); } catch (e) { v = `threw ${(e as Error).message}`; }
    assert(v === true, `no localStorage: ${v}`);
  } finally {
    if (had) g.localStorage = prev; else delete g.localStorage;
  }

  // Preview with a given preference == garden with that auto-resolve setting; and the setting must
  // actually change some previews, or this parity check proves nothing
  let mattered = 0;
  let probes = 0;
  const probe = (tree: StarTree, cfg: StarPlantClusterConfig, ids: string[]) => {
    probes++;
    for (const autoResolve of [true, false]) {
      const preview = computeClusterGardenLayout(tree, cfg, ids, { hemisphere: 'NORTHERN', autoResolve, idStamp: 's' });
      const garden = resolveGardenConflicts(HANDOVER([], buildClusterStarInstances(tree, cfg, ids, 's')), { allGuildPlants: GUILD_PLANTS, hemisphere: 'NORTHERN', enabled: autoResolve, pinned: new Set() });
      assert(JSON.stringify(preview.resolution) === JSON.stringify(garden), `${tree.id} ${cfg.pattern}x${cfg.count} autoResolve=${autoResolve}: preview != garden`);
    }
    const on = computeClusterGardenLayout(tree, cfg, ids, { autoResolve: true });
    const off = computeClusterGardenLayout(tree, cfg, ids, { autoResolve: false });
    if (JSON.stringify(on.resolution) !== JSON.stringify(off.resolution)) mattered++;
  };
  for (const cs of CLUSTER_STARS) {
    const tree = TREE(cs.id);
    const ids = guildIds(tree, cs.preset ? GUILD_PRESETS[cs.preset].plantIds : undefined);
    probe(tree, { pattern: 'GRID', count: 4, spacingM: getRecommendedSpacingM(tree).min }, ids);
    probe(tree, { pattern: 'LINE', count: 3, spacingM: 0 }, ids);
  }
  // Guilds built to conflict across neighbouring guilds (allium next to legume / N-fixer)
  const sbt = TREE('tree-seabuckthorn-star');
  probe(sbt, { pattern: 'GRID', count: 4, spacingM: getRecommendedSpacingM(sbt).min }, ['plant-chives', 'plant-white-clover', 'plant-comfrey'].filter(id => PLANTS_BY_ID.has(id)));
  const apple = TREE('tree-apple');
  probe(apple, { pattern: 'LINE', count: 2, spacingM: getRecommendedSpacingM(apple).min }, ['plant-chives', 'plant-white-clover', 'plant-comfrey', 'plant-ribwort-plantain'].filter(id => PLANTS_BY_ID.has(id)));
  assert(mattered > 0, `auto-resolve on/off never changed any of ${probes} previews: the parity check is vacuous`);
  console.log(`  (auto-resolve changed the preview in ${mattered} of ${probes} probe clusters)`);
});

scenario('optimizer is translation-invariant for an isolated cluster (jitter keyed relative, not absolute)', () => {
  const offsets: Array<[number, number]> = [[0.5, 0], [-13.5, 7], [37.3, -12.45], [101.01, 99.99], [-250, 0.07]];
  for (const cs of CLUSTER_STARS) {
    const tree = TREE(cs.id);
    const ids = guildIds(tree, cs.preset ? GUILD_PRESETS[cs.preset].plantIds : undefined);
    for (const pattern of PATTERNS) for (const count of [2, 3, 5]) for (const hemisphere of HEMISPHERES) {
      const cfg = { pattern, count, spacingM: 0, orientationDeg: 90 };
      const preview = computeClusterGardenLayout(tree, cfg, ids, { hemisphere, idStamp: 't' });
      for (const [dx, dy] of offsets) {
        const moved = translate(preview.starPlants, dx, dy).map(s => ({ ...s, xM: Number(s.xM.toFixed(2)), yM: Number(s.yM.toFixed(2)) }));
        const res = resolveGardenConflicts(moved, { allGuildPlants: GUILD_PLANTS, hemisphere, pinned: new Set() });
        const d = compareRelCompanions(res, moved, preview.resolution, preview.starPlants);
        assert(d === null, `${tree.id} ${pattern}x${count} ${hemisphere} moved by (${dx},${dy}): ${d}`);
        assert(JSON.stringify(res.effectiveCompanionIds) === JSON.stringify(preview.resolution.effectiveCompanionIds), `${tree.id} ${pattern}x${count} moved by (${dx},${dy}): substitutions differ`);
      }
    }
  }
});

scenario('placement with clearance next to a garden keeps the preview companion layout', () => {
  for (const g of existingGardens().filter(x => x.stars.length > 0)) for (const cs of CLUSTER_STARS) {
    const tree = TREE(cs.id);
    const ids = guildIds(tree, cs.preset ? GUILD_PRESETS[cs.preset].plantIds : undefined);
    for (const pattern of PATTERNS) {
      const cfg = { pattern, count: 4, spacingM: 0, orientationDeg: 90 };
      const incoming = buildClusterStarInstances(tree, cfg, ids, 'c');
      const preview = computeClusterGardenLayout(tree, cfg, ids, { hemisphere: 'NORTHERN', idStamp: 'c' });
      const pl = placeClusterInGarden(g.stars, incoming, { clearanceM: 12 });
      const merged = [...g.stars, ...pl.starPlants];
      const L = `${g.name} | ${tree.id} ${pattern}x4 clearance 12`;
      for (const n of pl.starPlants) for (const e of g.stars) {
        const need = (getRequiredStarDistanceM ? getRequiredStarDistanceM(n.starTree, e.starTree).ruleM : pairSpacing(n.starTree, e.starTree)) + 12;
        assert(Math.hypot(n.xM - e.xM, n.yM - e.yM) >= need - 1e-6, `${L}: ${n.instanceId} closer than ruleM + clearance to ${e.instanceId}`);
      }
      const isolated = pl.starPlants.every(n => g.stars.every(e => Math.hypot(n.xM - e.xM, n.yM - e.yM) >= isolationM(n.starTree, e.starTree)));
      const res = resolveGardenConflicts(merged, { allGuildPlants: GUILD_PLANTS, hemisphere: 'NORTHERN', pinned: new Set() });
      const sameIds = pl.starPlants.every((s, i) => JSON.stringify(res.effectiveCompanionIds[s.instanceId]) === JSON.stringify(preview.resolution.effectiveCompanionIds[preview.starPlants[i].instanceId]));
      if (isolated && sameIds) {
        stats.jitterCompared++;
        const d = compareRelCompanions(res, pl.starPlants, preview.resolution, preview.starPlants);
        assert(d === null, `${L}: offset (${pl.offsetM.dx},${pl.offsetM.dy}): ${d}`);
      } else stats.jitterSkipped++;
    }
  }
});

scenario('bug report: apple preset LINE x3 opened twice', () => {
  const apple = TREE('tree-apple');
  const ids = guildIds(apple, GUILD_PRESETS.apple.plantIds);
  const cfg: StarPlantClusterConfig = { pattern: 'LINE', count: 3, spacingM: 0, orientationDeg: 90 };
  const first = checkHandover({ label: '1st', existing: [], tree: apple, cfg, ids, hemisphere: 'NORTHERN', autoResolve: true, stamp: '1000' });
  const second = checkHandover({ label: '2nd', existing: first.merged, tree: apple, cfg, ids, hemisphere: 'NORTHERN', autoResolve: true, stamp: '2000' });
  const trunk = analyzeGardenAntagonisms(second.merged, []).filter(c => c.type === 'TRUNK_COLLISION');
  assert(trunk.length === 0, `expected 0 trunk collisions after opening twice, got ${trunk.length} (${trunk.map(c => c.distanceM + ' m').join(', ')})`);
});

scenario('empty garden == radial preview (all stars, patterns, counts 2-6, hemispheres, auto on/off)', () => {
  for (const cs of CLUSTER_STARS) {
    const tree = TREE(cs.id);
    const ids = guildIds(tree, cs.preset ? GUILD_PRESETS[cs.preset].plantIds : undefined);
    for (const pattern of PATTERNS) for (let count = 2; count <= 6; count++) for (const hemisphere of HEMISPHERES) {
      for (const cfg of configsFor(pattern, count)) {
        for (const autoResolve of [true, false]) {
          if (!autoResolve && (count % 2 === 1 || hemisphere === 'SOUTHERN')) continue; // runtime
          checkHandover({ label: 'empty', existing: [], tree, cfg, ids, hemisphere, autoResolve, stamp: `e${count}` });
        }
      }
    }
  }
});

scenario('handover into existing gardens (all patterns, counts 2-6, both hemispheres)', () => {
  const gardens = existingGardens().filter(g => g.stars.length > 0);
  for (const g of gardens) for (const cs of CLUSTER_STARS) {
    const tree = TREE(cs.id);
    const ids = guildIds(tree, cs.preset ? GUILD_PRESETS[cs.preset].plantIds : undefined);
    for (const pattern of PATTERNS) for (let count = 2; count <= 6; count++) for (const hemisphere of HEMISPHERES) {
      // Full matrix for apple and walnut; other stars on a rotating subset to bound runtime
      if (!['tree-apple', 'tree-walnut'].includes(cs.id) && (count + PATTERNS.indexOf(pattern) + HEMISPHERES.indexOf(hemisphere)) % 3 !== 0) continue;
      for (const cfg of configsFor(pattern, count)) {
        checkHandover({ label: g.name, existing: g.stars, tree, cfg, ids, hemisphere, autoResolve: true, stamp: `x${count}` });
      }
    }
  }
});

scenario('rotated / custom-spaced clusters into the bug-report garden', () => {
  const g = existingGardens().find(x => x.name.startsWith('apple-LINEx3'))!;
  for (const cs of CLUSTER_STARS.slice(0, 4)) {
    const tree = TREE(cs.id);
    const ids = guildIds(tree, cs.preset ? GUILD_PRESETS[cs.preset].plantIds : undefined);
    const rec = getRecommendedSpacingM(tree);
    for (const cfg of [
      { pattern: 'LINE' as const, count: 4, spacingM: rec.min, orientationDeg: 0 },
      { pattern: 'LINE' as const, count: 5, spacingM: rec.max, orientationDeg: 37 },
      { pattern: 'GRID' as const, count: 6, spacingM: 0, gridCols: 3 },
      { pattern: 'GRID' as const, count: 5, spacingM: rec.min, gridCols: 1 },
      { pattern: 'TRIANGLE' as const, count: 3, spacingM: rec.max, orientationDeg: 150 },
    ]) {
      checkHandover({ label: 'variant', existing: g.stars, tree, cfg, ids, hemisphere: 'SOUTHERN', autoResolve: true, stamp: 'v' });
    }
  }
});

scenario('repeated handovers (2-4 times, same and mixed clusters)', () => {
  const runs: Array<{ name: string; seq: Array<{ id: string; preset?: keyof typeof GUILD_PRESETS; pattern: StarPlantPattern; count: number }> }> = [
    { name: 'apple LINE3 x4', seq: Array(4).fill({ id: 'tree-apple', preset: 'apple', pattern: 'LINE', count: 3 }) },
    { name: 'apple GRID6 x3', seq: Array(3).fill({ id: 'tree-apple', preset: 'apple', pattern: 'GRID', count: 6 }) },
    { name: 'walnut TRI3 x2', seq: Array(2).fill({ id: 'tree-walnut', preset: 'walnut', pattern: 'TRIANGLE', count: 3 }) },
    { name: 'walnut then apple then walnut then apple', seq: [
      { id: 'tree-walnut', preset: 'walnut', pattern: 'LINE', count: 2 },
      { id: 'tree-apple', preset: 'apple', pattern: 'GRID', count: 4 },
      { id: 'tree-walnut', preset: 'walnut', pattern: 'TRIANGLE', count: 3 },
      { id: 'tree-apple', preset: 'apple', pattern: 'LINE', count: 5 },
    ] },
    { name: 'cherry/plum/apricot/blueberry', seq: [
      { id: 'tree-cherry', pattern: 'TRIANGLE', count: 5 },
      { id: 'tree-plum', pattern: 'GRID', count: 3 },
      { id: 'tree-apricot', preset: 'apricot', pattern: 'LINE', count: 6 },
      { id: 'shrub-blueberry', pattern: 'TRIANGLE', count: 4 },
    ] },
  ];
  for (const hemisphere of HEMISPHERES) for (const start of existingGardens().filter(g => ['empty', 'dense 4x4 mixed (7.5 m)', 'walnut@(6,0)'].includes(g.name))) {
    for (const run of runs) {
      let garden = start.stars;
      run.seq.forEach((step, i) => {
        const tree = TREE(step.id);
        const ids = guildIds(tree, step.preset ? GUILD_PRESETS[step.preset].plantIds : undefined);
        // Same stamp twice would be the same Date.now(): App uses distinct stamps per click
        const out = checkHandover({ label: `${start.name} / ${run.name} #${i + 1}`, existing: garden, tree, cfg: { pattern: step.pattern, count: step.count, spacingM: 0, orientationDeg: 90 }, ids, hemisphere, autoResolve: true, stamp: `r${i}` });
        garden = out.merged;
      });
      const hard = analyzeGardenAntagonisms(garden, []).filter(isHardStarConflict);
      const baseHard = analyzeGardenAntagonisms(start.stars, []).filter(isHardStarConflict);
      assert(hard.length === baseHard.length, () => `${start.name} / ${run.name} ${hemisphere}: final garden has ${hard.length} hard star–star conflicts (start had ${baseHard.length}): ${hard.slice(0, 3).map(c => `${c.type} ${c.plantA.id}<->${c.plantB.id} ${c.distanceM}m`).join('; ')}`);
    }
  }
});

scenario('large gardens (coarse search step) and gardens whose stars already conflict', () => {
  const walnutField: GardenStarPlantInstance[] = [];
  for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) walnutField.push(star(`wf-${i}-${j}`, 'tree-walnut', (i - 2.5) * 12, (j - 2.5) * 12));
  const longRow = Array.from({ length: 20 }, (_, i) => star(`row-${i}`, 'tree-pear', i * 7, 0));
  const farAway = [star('far-1', 'tree-pear', 400, -300), star('far-2', 'tree-apple', 0, 0)];
  const alreadyBad = [star('bad-1', 'tree-apple', 0, 0), star('bad-2', 'tree-apple', 0.5, 0), star('bad-w', 'tree-walnut', 4, 0)];
  const gardens = [
    { name: '6x6 walnut field (12 m)', stars: walnutField },
    { name: '20 pears in a 133 m row', stars: longRow },
    { name: 'pear 500 m away + apple@origin', stars: farAway },
    { name: 'existing stacked apples + walnut', stars: alreadyBad },
  ];
  for (const g of gardens) for (const cs of CLUSTER_STARS.slice(0, 4)) {
    const tree = TREE(cs.id);
    const ids = guildIds(tree, cs.preset ? GUILD_PRESETS[cs.preset].plantIds : undefined);
    for (const [pattern, count] of [['LINE', 6], ['GRID', 4], ['TRIANGLE', 3]] as const) {
      checkHandover({ label: g.name, existing: g.stars, tree, cfg: { pattern, count, spacingM: 0, orientationDeg: 90 }, ids, hemisphere: 'NORTHERN', autoResolve: true, stamp: 'L' });
    }
  }
});

scenario('same idStamp twice (two clicks in one millisecond) still yields unique ids', () => {
  const apple = TREE('tree-apple');
  const ids = guildIds(apple, GUILD_PRESETS.apple.plantIds);
  const cfg: StarPlantClusterConfig = { pattern: 'LINE', count: 3, spacingM: 0, orientationDeg: 90 };
  const a = HANDOVER([], buildClusterStarInstances(apple, cfg, ids, '42'));
  const b = HANDOVER(a, buildClusterStarInstances(apple, cfg, ids, '42'));
  const all = b.map(s => s.instanceId);
  assert(new Set(all).size === all.length, `duplicate ids after two handovers with the same stamp: ${all.join(', ')}`);
  assert(b.length === 6, `second hand-over with the same stamp dropped stars: ${b.length} stars, expected 6`);
  const hard = analyzeGardenAntagonisms(b, []).filter(isHardStarConflict);
  assert(hard.length === 0, `same-stamp hand-over: ${hard.length} hard star–star conflicts`);
  const c = HANDOVER(b, buildClusterStarInstances(apple, cfg, ids, '42'));
  const allC = c.map(s => s.instanceId);
  assert(new Set(allC).size === allC.length && c.length === 9, `third same-stamp hand-over: ${allC.join(', ')}`);
});

/* ----------------------------------------------------------------------------------------------- */

console.log('\nGarden handover scenarios:');
for (const s of scenarioResults) console.log(`  ${s.failures === 0 ? 'PASS' : 'FAIL'}  ${s.name} (${s.checks} checks${s.failures ? `, ${s.failures} failed` : ''})`);
console.log(`  handovers ${stats.handovers}, translated ${stats.translated}, avoidability searches ${stats.avoidableChecked}, companion-layout comparisons ${stats.jitterCompared} (skipped ${stats.jitterSkipped}: shared/substituted companions)`);
if (advisories.length) {
  console.log(`\nAdvisories (${advisories.length}, not failures):`);
  for (const a of advisories) console.log(`  - ${a}`);
}
console.log(`\nGarden handover tests: ${passedChecks}/${totalChecks} checks passed.`);
