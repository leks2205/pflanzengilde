/**
 * Independent scenario tests for garden-level conflict auto-resolution
 * (resolveGardenConflicts in src/core/gardenOptimizer.ts).
 *
 * Oracles are the existing engines: analyzeGardenAntagonisms for conflicts, the plants' roles for
 * role coverage, compatibility.ts for star compatibility, shareUtils for the share round trip.
 */
import { STAR_TREES } from '../src/data/starTrees';
import { GUILD_PLANTS } from '../src/data/guildPlants';
import {
  resolveGardenConflicts,
  getEffectiveCompanionIds,
  pinKey,
  optimizeGardenCompanions,
  DUAL_ROLE_STAR_TREE_MAP,
} from '../src/core/gardenOptimizer';
import { analyzeGardenAntagonisms } from '../src/core/gardenAntagonist';
import { isCompatibleWithStar } from '../src/core/compatibility';
import { encodeGardenToCode, decodeGardenFromCode } from '../src/utils/shareUtils';
import { GardenConflict, GardenStarPlantInstance } from '../src/types/garden';
import { ClimateZone, GuildPlant, GuildRole, Hemisphere, SoilType } from '../src/types/guild';

let passedChecks = 0;
let totalChecks = 0;
const scenarioResults: Array<{ name: string; failures: number }> = [];
let currentScenario = '';
let currentFailures = 0;
const printedPerScenario = new Map<string, number>();

function assert(condition: boolean, message: string) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    return;
  }
  currentFailures++;
  process.exitCode = 1;
  const n = printedPerScenario.get(currentScenario) ?? 0;
  if (n < 20) console.error(`FAIL [${currentScenario}]: ${message}`);
  else if (n === 20) console.error(`FAIL [${currentScenario}]: ... further failures suppressed`);
  printedPerScenario.set(currentScenario, n + 1);
}

function scenario(name: string, fn: () => void) {
  currentScenario = name;
  currentFailures = 0;
  try {
    fn();
  } catch (e) {
    assert(false, `threw: ${(e as Error).stack || e}`);
  }
  scenarioResults.push({ name, failures: currentFailures });
}

type Resolution = ReturnType<typeof resolveGardenConflicts>;
type ResolveOptions = NonNullable<Parameters<typeof resolveGardenConflicts>[1]>;

const PLANTS_BY_ID = new Map(GUILD_PLANTS.map(p => [p.id, p]));
const star = (id: string) => {
  const t = STAR_TREES.find(x => x.id === id);
  if (!t) throw new Error(`missing star ${id}`);
  return t;
};
function inst(instanceId: string, treeId: string, xM: number, yM: number, selectedPlantIds?: string[]): GardenStarPlantInstance {
  return { instanceId, treeId, starTree: star(treeId), xM, yM, ...(selectedPlantIds ? { selectedPlantIds } : {}) };
}
const isBlocking = (c: GardenConflict) => c.severity === 'CRITICAL' || c.severity === 'WARNING';
/** Roles of a guild: its companions plus the roles the star fills itself (same definition as the optimizer stats). */
const rolesOf = (ids: string[], treeId?: string): Set<GuildRole> =>
  new Set([...(treeId ? DUAL_ROLE_STAR_TREE_MAP[treeId] ?? [] : []), ...ids.flatMap(id => PLANTS_BY_ID.get(id)?.roles ?? [])]);
const snapshot = (stars: GardenStarPlantInstance[]) =>
  JSON.stringify(stars.map(s => ({ i: s.instanceId, t: s.treeId, x: s.xM, y: s.yM, sel: s.selectedPlantIds ?? null, st: s.starTree.id })));
const fingerprint = (r: Resolution) =>
  JSON.stringify({
    c: r.companions.map(c => [c.instanceId, c.plantId, c.xM, c.yM, [...c.servicingTreeIds].sort()]),
    e: r.effectiveCompanionIds,
    s: r.substitutions,
    g: r.suggestions,
    u: r.unresolved.map(u => u.id).sort(),
  });
const withLists = (stars: GardenStarPlantInstance[], lists: Record<string, string[]>) =>
  stars.map(s => ({ ...s, selectedPlantIds: [...(lists[s.instanceId] ?? [])] }));

function companionCaused(conflicts: GardenConflict[], companionIds: Set<string>) {
  return conflicts.filter(c => isBlocking(c) && (companionIds.has(c.plantA.id) || companionIds.has(c.plantB.id)));
}
function starStar(conflicts: GardenConflict[], starIds: Set<string>) {
  return conflicts.filter(c => isBlocking(c) && starIds.has(c.plantA.id) && starIds.has(c.plantB.id));
}
const fmt = (cs: GardenConflict[]) => cs.map(c => `${c.type}:${c.plantA.id}~${c.plantB.id}@${c.distanceM}m`).join(', ');

interface Expect {
  /** Plant ids that must be gone from a given tree's list after resolution. */
  removed?: Record<string, string[]>;
  /** Plant ids that must survive in a given tree's list. */
  kept?: Record<string, string[]>;
  /** Star–star conflict types that must be reported as unresolved. */
  unresolvedStarTypes?: string[];
  /** The scenario must actually contain companion conflicts before resolution. */
  expectCompanionConflictsBefore?: boolean;
}

/**
 * Runs every generic invariant on one garden. Returns the resolution for scenario-specific checks.
 */
function checkGarden(label: string, stars: GardenStarPlantInstance[], opts: ResolveOptions, expect: Expect = {}): Resolution | null {
  const hemisphere: Hemisphere = opts.hemisphere ?? 'NORTHERN';
  const allPlants: GuildPlant[] = opts.allGuildPlants ?? GUILD_PLANTS;
  const before = snapshot(stars);
  const starIds = new Set(stars.map(s => s.instanceId));
  const beforeLists: Record<string, string[]> = Object.fromEntries(stars.map(s => [s.instanceId, getEffectiveCompanionIds(s)]));

  // Baseline (what the user had before resolution)
  const base = optimizeGardenCompanions(stars, allPlants, hemisphere);
  const baseConflicts = analyzeGardenAntagonisms(stars, base.companions);
  const baseCompanionConflicts = companionCaused(baseConflicts, new Set(base.companions.map(c => c.instanceId)));
  if (expect.expectCompanionConflictsBefore) {
    assert(baseCompanionConflicts.length > 0, `${label}: fixture should have companion conflicts before resolution (has none)`);
  }

  const t0 = Date.now();
  let r: Resolution;
  try {
    r = resolveGardenConflicts(stars, opts);
  } catch (e) {
    assert(false, `${label}: resolveGardenConflicts threw ${(e as Error).stack}`);
    return null;
  }
  const ms = Date.now() - t0;
  assert(ms < 15000, `${label}: resolution took ${ms} ms (time bound 15 s)`);
  assert(snapshot(stars) === before, `${label}: input starPlants were mutated`);

  // 1. unresolved == analyzeGardenAntagonisms(final layout)
  const finalConflicts = analyzeGardenAntagonisms(stars, r.companions);
  const ids = (cs: GardenConflict[]) => cs.map(c => c.id).sort().join('|');
  assert(ids(r.unresolved) === ids(finalConflicts), `${label}: unresolved list != analyzeGardenAntagonisms(final)`);

  // 2. companions are the optimizer output on the resolved lists
  const replay = optimizeGardenCompanions(withLists(stars, r.effectiveCompanionIds), allPlants, hemisphere);
  assert(
    JSON.stringify(replay.companions.map(c => [c.instanceId, c.xM, c.yM])) === JSON.stringify(r.companions.map(c => [c.instanceId, c.xM, c.yM])),
    `${label}: companions are not reproducible from effectiveCompanionIds`
  );
  assert(r.stats.companionPlantCount === r.companions.length, `${label}: stats.companionPlantCount mismatch`);
  for (const c of r.companions) {
    for (const t of c.servicingTreeIds) {
      assert((r.effectiveCompanionIds[t] ?? []).includes(c.plantId), `${label}: companion ${c.instanceId} serves ${t} whose list lacks ${c.plantId}`);
    }
  }
  for (const s of stars) {
    const list = r.effectiveCompanionIds[s.instanceId];
    assert(Array.isArray(list), `${label}: effectiveCompanionIds missing ${s.instanceId}`);
    if (list) assert(new Set(list).size === list.length, `${label}: duplicate ids in ${s.instanceId} list: ${list.join(',')}`);
  }

  // 3. no CRITICAL/WARNING companion-caused conflict remains (when enabled and nothing pinned)
  const compIds = new Set(r.companions.map(c => c.instanceId));
  const leftover = companionCaused(finalConflicts, compIds);
  const autoMode = opts.enabled !== false && !(opts.pinned && opts.pinned.size > 0);
  if (autoMode) {
    assert(leftover.length === 0, `${label}: companion-caused conflicts remain: ${fmt(leftover)}`);
  } else {
    for (const c of leftover) {
      const covered = r.suggestions.some(sg => sg.conflictIds.includes(c.id) || sg.instanceId === c.plantA.id || sg.instanceId === c.plantB.id);
      assert(covered, `${label}: remaining companion conflict ${c.id} has no suggestion`);
    }
  }

  // 4. star–star conflicts are never "resolved" and stay reported
  const baseStarStar = starStar(baseConflicts, starIds);
  for (const c of baseStarStar) {
    assert(r.unresolved.some(u => u.id === c.id), `${label}: star–star conflict ${c.id} vanished from unresolved`);
  }
  for (const type of expect.unresolvedStarTypes ?? []) {
    assert(starStar(r.unresolved, starIds).some(c => c.type === type), `${label}: expected unresolved star–star ${type}`);
  }

  // 5. role coverage per guild ≥ before, or the shortfall is listed in rolesLost
  for (const s of stars) {
    const beforeRoles = rolesOf(beforeLists[s.instanceId], s.treeId);
    const afterRoles = rolesOf(r.effectiveCompanionIds[s.instanceId] ?? [], s.treeId);
    for (const role of beforeRoles) {
      if (afterRoles.has(role)) continue;
      const listed = [...r.substitutions, ...r.suggestions].some(sb => sb.servedTreeIds.includes(s.instanceId) && sb.rolesLost.includes(role));
      assert(listed, `${label}: ${s.instanceId} lost role ${role} without it being listed in rolesLost`);
    }
  }

  // 6. substitution records
  const subIds = new Set<string>();
  for (const sb of [...r.substitutions, ...r.suggestions]) {
    assert(!subIds.has(sb.id), `${label}: duplicate substitution id ${sb.id}`);
    subIds.add(sb.id);
    assert(sb.addedPlantId === (sb.addedPlantIds[0] ?? null), `${label}: ${sb.id} addedPlantId != addedPlantIds[0]`);
    assert(sb.addedPlantIds.length <= 2, `${label}: ${sb.id} adds ${sb.addedPlantIds.length} plants`);
    assert(!sb.addedPlantIds.includes(sb.removedPlantId), `${label}: ${sb.id} replaces ${sb.removedPlantId} with itself`);
    assert(sb.servedTreeIds.length > 0 && sb.servedTreeIds.every(t => starIds.has(t)), `${label}: ${sb.id} servedTreeIds invalid: ${sb.servedTreeIds}`);
    assert(Boolean(sb.reason?.de) && Boolean(sb.reason?.en), `${label}: ${sb.id} has no bilingual reason`);
    for (const role of sb.rolesLost) assert(!sb.rolesPreserved.includes(role), `${label}: ${sb.id} lists ${role} as both preserved and lost`);
  }
  for (const sb of r.substitutions) {
    assert(sb.auto === true, `${label}: applied substitution ${sb.id} has auto=false`);
    assert(sb.servedTreeIds.every(t => beforeLists[t].includes(sb.removedPlantId)), `${label}: ${sb.id} removes ${sb.removedPlantId} that a served tree never had`);
    for (const added of sb.addedPlantIds) {
      const p = PLANTS_BY_ID.get(added);
      assert(Boolean(p), `${label}: substitute ${added} does not exist`);
      if (!p) continue;
      assert(!p.retired, `${label}: substitute ${added} is retired`);
      if (opts.zone) assert(p.climateZones.includes(opts.zone), `${label}: substitute ${added} not suited to zone ${opts.zone} (${p.climateZones})`);
      if (opts.soil) assert(!p.unsuitableSoils.includes(opts.soil), `${label}: substitute ${added} unsuitable for soil ${opts.soil}`);
      // Without a garden zone the served stars' zones are the only climate hint
      if (!opts.zone) {
        for (const t of sb.servedTreeIds) {
          const tree = stars.find(s => s.instanceId === t)!;
          assert(p.climateZones.some(z => tree.starTree.climateZones.includes(z)), `${label}: substitute ${added} shares no climate zone with served star ${tree.treeId}`);
        }
      }
      for (const t of sb.servedTreeIds) {
        const tree = stars.find(s => s.instanceId === t)!;
        // The substitute may itself be removed by a later step; only check those that survived
        if ((r.effectiveCompanionIds[t] ?? []).includes(added)) {
          assert(isCompatibleWithStar(p, tree.starTree), `${label}: substitute ${added} is incompatible with served star ${tree.treeId}`);
        }
      }
    }
  }
  for (const sg of r.suggestions) assert(sg.auto === false, `${label}: suggestion ${sg.id} has auto=true`);
  // every substitute present in the final layout is compatible with every star it serves there
  const addedEver = new Set(r.substitutions.flatMap(sb => sb.addedPlantIds));
  for (const c of r.companions) {
    if (!addedEver.has(c.plantId)) continue;
    for (const t of c.servicingTreeIds) {
      const tree = stars.find(s => s.instanceId === t)!;
      assert(isCompatibleWithStar(c.plant, tree.starTree), `${label}: placed substitute ${c.plantId} serves incompatible star ${tree.treeId}`);
    }
  }

  // 7. per-tree expectations
  for (const [tree, gone] of Object.entries(expect.removed ?? {})) {
    for (const id of gone) assert(!(r.effectiveCompanionIds[tree] ?? []).includes(id), `${label}: ${id} should be removed from ${tree}`);
  }
  for (const [tree, keep] of Object.entries(expect.kept ?? {})) {
    for (const id of keep) assert((r.effectiveCompanionIds[tree] ?? []).includes(id), `${label}: ${id} should be kept in ${tree}`);
  }

  // 8. determinism
  const r2 = resolveGardenConflicts(stars, opts);
  assert(fingerprint(r) === fingerprint(r2), `${label}: not deterministic (two runs differ)`);
  // deterministic w.r.t. a deep copy as well (no hidden state keyed by object identity)
  const copy = JSON.parse(JSON.stringify(stars)) as GardenStarPlantInstance[];
  assert(fingerprint(resolveGardenConflicts(copy, opts)) === fingerprint(r), `${label}: deep copy of input gives a different result`);

  // 9. idempotence: resolving the resolved garden changes nothing
  //    (stability checks only make sense once the first resolution is clean; otherwise they repeat check 3)
  if (autoMode && leftover.length === 0) {
    const resolvedStars = withLists(stars, r.effectiveCompanionIds);
    const again = resolveGardenConflicts(resolvedStars, opts);
    assert(again.substitutions.length === 0, `${label}: second resolution applied ${again.substitutions.length} more substitutions (${again.substitutions.map(s => `${s.removedPlantId}->${s.addedPlantId}`).join(', ')})`);
    assert(JSON.stringify(again.effectiveCompanionIds) === JSON.stringify(r.effectiveCompanionIds), `${label}: second resolution changed the lists`);
    assert(
      JSON.stringify(again.companions.map(c => [c.instanceId, c.xM, c.yM])) === JSON.stringify(r.companions.map(c => [c.instanceId, c.xM, c.yM])),
      `${label}: second resolution changed the layout`
    );

    // 9b. the resolved lists stay conflict-free when the same garden gets other instance ids
    //     (the UI creates random ids on add/duplicate/import, and share links decode to garden-tree-<i>-<id>)
    const renamed = withLists(stars, r.effectiveCompanionIds).map((s, i) => ({ ...s, instanceId: `garden-tree-${i}-${s.treeId}` }));
    const renamedLayout = optimizeGardenCompanions(renamed, allPlants, hemisphere);
    const renamedLeft = companionCaused(analyzeGardenAntagonisms(renamed, renamedLayout.companions), new Set(renamedLayout.companions.map(c => c.instanceId)));
    assert(renamedLeft.length === 0, `${label}: resolved lists conflict again after renaming instance ids only: ${fmt(renamedLeft)}`);

    // 9c. ... and when the lists come back in catalogue order (share-code masks decode in GUILD_PLANTS order)
    const catalogueIndex = new Map(GUILD_PLANTS.map((p, i) => [p.id, i]));
    const reordered = withLists(stars, r.effectiveCompanionIds).map(s => ({
      ...s,
      selectedPlantIds: [...(s.selectedPlantIds ?? [])].sort((a, b) => (catalogueIndex.get(a) ?? 1e9) - (catalogueIndex.get(b) ?? 1e9)),
    }));
    const reorderedLayout = optimizeGardenCompanions(reordered, allPlants, hemisphere);
    const reorderedLeft = companionCaused(analyzeGardenAntagonisms(reordered, reorderedLayout.companions), new Set(reorderedLayout.companions.map(c => c.instanceId)));
    assert(reorderedLeft.length === 0, `${label}: resolved lists conflict again when only their order changes (catalogue order): ${fmt(reorderedLeft)}`);

    // 10. share-code round trip of the resolved garden
    const code = encodeGardenToCode({
      gardenName: label,
      starPlants: stars.map(s => ({ treeId: s.treeId, xM: s.xM, yM: s.yM, selectedPlantIds: r.effectiveCompanionIds[s.instanceId] ?? [] })),
      soil: opts.soil,
      zone: opts.zone,
      hemisphere,
      language: 'en',
    });
    const decoded = decodeGardenFromCode(code);
    assert(Boolean(decoded), `${label}: resolved garden share code does not decode`);
    if (decoded) {
      assert(decoded.starPlants.length === stars.length, `${label}: share round trip lost stars (${decoded.starPlants.length}/${stars.length})`);
      assert(decoded.hemisphere === hemisphere, `${label}: share round trip hemisphere`);
      decoded.starPlants.forEach((d, i) => {
        const s = stars[i];
        assert(d.treeId === s.treeId, `${label}: share round trip tree ${i}`);
        const sent = [...(r.effectiveCompanionIds[s.instanceId] ?? [])].filter(id => !PLANTS_BY_ID.get(id)?.retired).sort();
        assert(JSON.stringify([...(d.selectedPlantIds ?? [])].sort()) === JSON.stringify(sent), `${label}: share round trip changed list of ${s.instanceId}`);
      });
      // a shared resolved garden opens without further changes
      const reopened = resolveGardenConflicts(decoded.starPlants, { ...opts, zone: decoded.zone ?? undefined, soil: decoded.soil ?? undefined });
      assert(reopened.substitutions.length === 0, `${label}: reopened share link triggers ${reopened.substitutions.length} new substitutions`);
      const reopenedLeft = companionCaused(reopened.unresolved, new Set(reopened.companions.map(c => c.instanceId)));
      assert(reopenedLeft.length === 0, `${label}: reopened share link has companion conflicts: ${fmt(reopenedLeft)}`);
    }
  }

  // 11. maxIterations is honoured (tiny cap still returns a consistent result)
  const capped = resolveGardenConflicts(stars, { ...opts, maxIterations: 1 });
  assert(capped.substitutions.length <= Math.max(1, stars.length * 50), `${label}: maxIterations=1 produced ${capped.substitutions.length} substitutions`);
  assert(ids(capped.unresolved) === ids(analyzeGardenAntagonisms(stars, capped.companions)), `${label}: maxIterations=1 unresolved inconsistent`);

  return r;
}

function both(name: string, build: () => GardenStarPlantInstance[], opts: Omit<ResolveOptions, 'hemisphere'>, expect: Expect = {}) {
  for (const hemisphere of ['NORTHERN', 'SOUTHERN'] as Hemisphere[]) {
    scenario(`${name} [${hemisphere}]`, () => {
      checkGarden(name, build(), { ...opts, hemisphere }, expect);
    });
  }
}

// ---------------------------------------------------------------------------------------------
// R1 tea + apple adjacent: apple's calcicoles (hellebore, alfalfa) vs tea star and tea's acidophiles
both('R1 tea + apple 3.5 m', () => [inst('tea', 'tree-tea-sinensis', 0, 0), inst('apple', 'tree-apple', 3.5, 0)], { zone: 'TEMPERATE', soil: 'LOAM' }, {
  expectCompanionConflictsBefore: true,
  kept: { apple: ['plant-comfrey', 'plant-yarrow'], tea: ['plant-comfrey'] },
});
both('R1b tea + apple 5 m', () => [inst('tea', 'tree-tea-sinensis', 0, 0), inst('apple', 'tree-apple', 5, 0)], { zone: 'TEMPERATE', soil: 'LOAM' });

// R2 walnut + apple 12 m: star–star juglone stays; sensitive companions (alfalfa, alder, rhubarb) leave the root zone
both('R2 walnut + apple 12 m', () => [inst('wal', 'tree-walnut', 0, 0), inst('apple', 'tree-apple', 12, 0)], { zone: 'TEMPERATE', soil: 'LOAM' }, {
  expectCompanionConflictsBefore: true,
  unresolvedStarTypes: ['JUGLONE'],
  removed: { apple: ['plant-alfalfa', 'plant-rhubarb', 'plant-alder'] },
});

// R2b walnut + apple at 17.9 m (just inside the buffer) and 18.1 m (outside)
both('R2b walnut + apple 17.9 m', () => [inst('wal', 'tree-walnut', 0, 0), inst('apple', 'tree-apple', 17.9, 0)], { zone: 'TEMPERATE' }, {
  unresolvedStarTypes: ['JUGLONE'],
});
both('R2c walnut + apple 18.1 m', () => [inst('wal', 'tree-walnut', 0, 0), inst('apple', 'tree-apple', 18.1, 0)], { zone: 'TEMPERATE' });

// R3 chestnut (acid) + fig (acid-intolerant): chestnut's acidophiles near the fig, fig's sage near the chestnut
both('R3 chestnut + fig 6 m', () => [inst('ch', 'tree-chestnut', 0, 0), inst('fig', 'tree-fig', 6, 0)], { zone: 'TEMPERATE', soil: 'LOAM' });
both('R3b chestnut + fig 4.5 m', () => [inst('ch', 'tree-chestnut', 0, 0), inst('fig', 'tree-fig', 4.5, 0)], { zone: 'SUBTROPICAL', soil: 'SANDY' });

// R4 sea buckthorn with a legacy guild holding strawberry + marigold, next to an apple with Verticillium hosts
both(
  'R4 sea buckthorn (legacy strawberry/marigold) + apple 3 m',
  () => [
    inst('sbt', 'tree-seabuckthorn-star', 0, 0, ['plant-strawberry', 'plant-marigold', 'plant-thyme', 'plant-yarrow']),
    inst('apple', 'tree-apple', 3, 0, ['plant-strawberry', 'plant-marigold', 'plant-horseradish', 'plant-peppermint', 'plant-comfrey', 'plant-yarrow']),
  ],
  { zone: 'TEMPERATE', soil: 'LOAM' },
  { expectCompanionConflictsBefore: true, removed: { sbt: ['plant-strawberry', 'plant-marigold'] }, kept: { sbt: ['plant-thyme', 'plant-yarrow'] } }
);

// R5 alder (N-fixer) near alliums: legacy alder list with chives + a blackcurrant full of alliums 2.5 m away
both(
  'R5 alder + alliums',
  () => [
    inst('al', 'tree-alder', 0, 0, ['plant-chives', 'plant-garlic', 'plant-comfrey', 'plant-nettle']),
    inst('bc', 'shrub-blackcurrant', 2.5, 0),
  ],
  { zone: 'TEMPERATE', soil: 'LOAM' }
);

// R6 three-guild clusters with shared companions
both('R6 apple/pear/cherry triangle', () => [inst('a', 'tree-apple', 0, 0), inst('p', 'tree-pear', 4, 0), inst('c', 'tree-cherry', 2, 3.5)], { zone: 'TEMPERATE', soil: 'LOAM' }, {
  expectCompanionConflictsBefore: true,
});
both('R6b apple/plum/cherry line', () => [inst('a', 'tree-apple', 0, 0), inst('p', 'tree-plum', 4, 0), inst('c', 'tree-cherry', 8, 0)], { zone: 'TEMPERATE', soil: 'LOAM' }, {
  expectCompanionConflictsBefore: true,
});
both('R6c alder + tea + apple cluster', () => [inst('al', 'tree-alder', 0, 0), inst('t', 'tree-tea-sinensis', 3, 2), inst('a', 'tree-apple', 4, -1.5)], { zone: 'TEMPERATE', soil: 'LOAM' });

// R7 tiny garden, everything overlapping: trunk collisions and walnut/apple stay unresolved
both(
  'R7 tiny overlapping garden',
  () => [inst('a', 'tree-apple', 0, 0), inst('t', 'tree-tea-sinensis', 2.2, 0), inst('s', 'tree-seabuckthorn-star', 1.1, 1.9), inst('w', 'tree-walnut', 1, -2)],
  { zone: 'TEMPERATE', soil: 'LOAM' },
  { expectCompanionConflictsBefore: true, unresolvedStarTypes: ['TRUNK_COLLISION', 'JUGLONE'] }
);
both('R7b two stars on the same spot', () => [inst('a', 'tree-apple', 0, 0), inst('b', 'tree-tea-sinensis', 0, 0)], {}, {
  unresolvedStarTypes: ['TRUNK_COLLISION'],
});

// R8 climate/soil constraints on substitutes
both('R8 subtropical chalk: tea-assamica + fig', () => [inst('ta', 'tree-tea-assamica', 0, 0), inst('fig', 'tree-fig', 3.5, 0)], { zone: 'SUBTROPICAL', soil: 'CHALKY' });
both('R8b boreal clay: blueberry + apple', () => [inst('bb', 'shrub-blueberry', 0, 0), inst('a', 'tree-apple', 3, 0)], { zone: 'BOREAL', soil: 'CLAY' });

// R9 hemp (acid-intolerant) between fig and chestnut
both('R9 fig/hemp/chestnut row', () => [inst('f', 'tree-fig', 0, 0), inst('h', 'herb-hemp', 3, 0), inst('c', 'tree-chestnut', 6, 0)], { zone: 'TEMPERATE', soil: 'LOAM' }, {
  expectCompanionConflictsBefore: true,
});

// R10 large mixed orchard (time bound + all invariants)
both(
  'R10 12-star mixed orchard',
  () => {
    const ids = ['tree-apple', 'tree-tea-sinensis', 'tree-plum', 'tree-chestnut', 'tree-fig', 'tree-seabuckthorn-star', 'tree-alder', 'tree-cherry', 'tree-linden', 'shrub-rhododendron', 'herb-hemp', 'shrub-blueberry'];
    return ids.map((id, i) => inst(`o${i}`, id, (i % 4) * 5, Math.floor(i / 4) * 5));
  },
  { zone: 'TEMPERATE', soil: 'LOAM' }
);

// R11 options: disabled → nothing applied, everything suggested
scenario('R11 enabled:false only suggests', () => {
  const stars = [inst('tea', 'tree-tea-sinensis', 0, 0), inst('apple', 'tree-apple', 3.5, 0)];
  const before = Object.fromEntries(stars.map(s => [s.instanceId, getEffectiveCompanionIds(s)]));
  const r = checkGarden('R11', stars, { enabled: false, zone: 'TEMPERATE', soil: 'LOAM' });
  if (!r) return;
  assert(r.substitutions.length === 0, `disabled: ${r.substitutions.length} substitutions were applied`);
  assert(JSON.stringify(r.effectiveCompanionIds) === JSON.stringify(before), 'disabled: companion lists changed');
  assert(r.suggestions.length > 0, 'disabled: no suggestions offered for the tea/apple pH conflicts');
  const opt = optimizeGardenCompanions(stars, GUILD_PLANTS, 'NORTHERN');
  assert(JSON.stringify(opt.companions.map(c => c.instanceId)) === JSON.stringify(r.companions.map(c => c.instanceId)), 'disabled: layout differs from plain optimizer');
});

// R12 pinned companions are never auto-replaced, only suggested
scenario('R12 pinned companion stays, gets a suggestion', () => {
  const stars = [inst('wal', 'tree-walnut', 0, 0), inst('apple', 'tree-apple', 12, 0)];
  const pinned = new Set([pinKey('apple', 'plant-alfalfa')]);
  assert(pinKey('apple', 'plant-alfalfa') === 'apple::plant-alfalfa', `pinKey format: ${pinKey('apple', 'plant-alfalfa')}`);
  const r = checkGarden('R12', stars, { pinned, zone: 'TEMPERATE', soil: 'LOAM' });
  if (!r) return;
  assert(r.effectiveCompanionIds.apple.includes('plant-alfalfa'), 'pinned alfalfa was removed');
  assert(r.suggestions.some(s => s.removedPlantId === 'plant-alfalfa' && s.servedTreeIds.includes('apple')), 'no suggestion for pinned alfalfa');
  assert(!r.effectiveCompanionIds.apple.includes('plant-rhubarb'), 'unpinned rhubarb should still be auto-replaced');
});

// R13 degenerate inputs
scenario('R13 degenerate inputs', () => {
  const empty = resolveGardenConflicts([], {});
  assert(empty.companions.length === 0 && empty.substitutions.length === 0 && empty.unresolved.length === 0, 'empty garden');
  checkGarden('R13 single star no conflicts', [inst('a', 'tree-apple', 0, 0)], {});
  checkGarden('R13 empty selection', [inst('a', 'tree-apple', 0, 0, []), inst('w', 'tree-walnut', 4, 0, [])], {});
  // unknown and retired ids in a legacy list must not crash
  const r = resolveGardenConflicts([inst('a', 'tree-apple', 0, 0, ['plant-does-not-exist', 'plant-wormwood', 'plant-comfrey'])], {});
  assert(r.effectiveCompanionIds.a?.includes('plant-comfrey'), 'unknown/retired ids: comfrey kept');
  // walnut with every juglone-sensitive plant selected (single guild legacy list)
  checkGarden('R13 walnut legacy sensitive list', [inst('w', 'tree-walnut', 0, 0, ['plant-alfalfa', 'plant-rhododendron', 'plant-blueberry', 'plant-rhubarb', 'plant-alder', 'plant-comfrey'])], { zone: 'TEMPERATE' }, {
    removed: { w: ['plant-alfalfa', 'plant-rhododendron', 'plant-blueberry', 'plant-rhubarb', 'plant-alder'] },
    kept: { w: ['plant-comfrey'] },
  });
  // plantain listed directly under an apple
  checkGarden('R13 apple + plantain', [inst('a', 'tree-apple', 0, 0, ['plant-ribwort-plantain', 'plant-comfrey'])], {}, { removed: { a: ['plant-ribwort-plantain'] } });
});

// R15 no compatible substitute in the catalogue: the conflict must still go (drop + rolesLost), never stay silently
scenario('R15 restricted catalogue: walnut + alfalfa/comfrey only', () => {
  const cat = GUILD_PLANTS.filter(p => p.id === 'plant-alfalfa' || p.id === 'plant-comfrey');
  const r = checkGarden('R15', [inst('w', 'tree-walnut', 0, 0, ['plant-alfalfa', 'plant-comfrey'])], { allGuildPlants: cat }, { removed: { w: ['plant-alfalfa'] }, kept: { w: ['plant-comfrey'] } });
  if (!r) return;
  const drop = r.substitutions.find(s => s.removedPlantId === 'plant-alfalfa');
  assert(Boolean(drop) && drop!.addedPlantId === null && drop!.rolesLost.includes('NITROGEN_FIXER'), 'R15: alfalfa should be dropped with NITROGEN_FIXER listed in rolesLost');
});

// R16 regressions found by the wide fuzz (QA_FUZZ_SEED=99): removing the culprit reshuffles the layout so
// another pair collides, every single swap is rejected, and the companion conflict stays without a suggestion
scenario('R16 cherry + two alders (fuzz seed 99 #120)', () => {
  checkGarden(
    'R16',
    [inst('f120-0', 'tree-cherry', 7.1, 4.5), inst('f120-1', 'tree-alder', 8.1, 5.6), inst('f120-2', 'tree-alder', 4.6, 0.8)],
    { hemisphere: 'NORTHERN', zone: 'BOREAL', soil: 'LOAM' },
    { expectCompanionConflictsBefore: true, unresolvedStarTypes: ['PEST_HOST', 'TRUNK_COLLISION'] }
  );
});
scenario('R16b rhododendron/quince/elderberry/hemp/apricot (fuzz seed 99 #21)', () => {
  checkGarden(
    'R16b',
    [
      inst('f21-0', 'shrub-rhododendron', 5.7, 10.6),
      inst('f21-1', 'tree-quince', 5.3, 2.4),
      inst('f21-2', 'shrub-elderberry', 4.6, 6.7),
      inst('f21-3', 'herb-hemp', 10.2, 10),
      inst('f21-4', 'tree-apricot', 8.1, 9.9),
    ],
    { hemisphere: 'SOUTHERN', zone: 'BOREAL', soil: 'CHALKY' },
    { expectCompanionConflictsBefore: true }
  );
});

// R14 seeded fuzz over random small gardens
// QA_FUZZ_N / QA_FUZZ_SEED widen the search locally (e.g. QA_FUZZ_N=300 npx tsx scripts/test_garden_resolution.ts)
const FUZZ_N = Number((globalThis as any).process?.env?.QA_FUZZ_N) || 40;
const FUZZ_SEED = Number((globalThis as any).process?.env?.QA_FUZZ_SEED) || 0x5eed;
scenario(`R14 fuzz: ${FUZZ_N} random gardens`, () => {
  let seed = FUZZ_SEED;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const zones: ClimateZone[] = ['BOREAL', 'TEMPERATE', 'SUBTROPICAL'];
  const soils: SoilType[] = ['LOAM', 'CLAY', 'SANDY', 'CHALKY', 'ACIDIC', 'SILT'];
  for (let g = 0; g < FUZZ_N; g++) {
    const n = 2 + Math.floor(rnd() * 4);
    const stars: GardenStarPlantInstance[] = [];
    for (let i = 0; i < n; i++) {
      const t = STAR_TREES[Math.floor(rnd() * STAR_TREES.length)];
      stars.push(inst(`f${g}-${i}`, t.id, Math.round(rnd() * 120) / 10, Math.round(rnd() * 120) / 10));
    }
    // every 4th garden has no zone/soil so the star-climate fallback is exercised too
    const site = g % 4 === 3 ? {} : { zone: zones[g % 3], soil: soils[g % 6] };
    checkGarden(`R14#${g}`, stars, { hemisphere: g % 2 ? 'SOUTHERN' : 'NORTHERN', ...site });
  }
});

// ---------------------------------------------------------------------------------------------
console.log('\nScenario results:');
for (const r of scenarioResults) console.log(`  ${r.failures === 0 ? 'PASS' : 'FAIL'}  ${r.name}${r.failures ? ` (${r.failures} failed checks)` : ''}`);
console.log(`garden resolution: ${passedChecks}/${totalChecks} checks passed`);
if (passedChecks !== totalChecks) process.exit(1);
