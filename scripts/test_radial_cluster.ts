/**
 * Radial plan, multi-star mode (GardenPlanCanvas count > 1): parity with the garden planner.
 *
 * Contract (src/core/multiStarLayout.ts): the radial plan renders computeClusterGardenLayout, which must be
 * exactly what the garden planner (/garten, resolveGardenConflicts) computes for the same star instances;
 * App.handleOpenInGardenGrid hands buildClusterStarInstances(..., String(Date.now())) to the garden.
 * Oracles: resolveGardenConflicts on independently built instances, analyzeGardenAntagonisms,
 * autoPlaceGuildPlants (single-guild regression), and the server-rendered SVG of GardenPlanCanvas.
 */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { STAR_TREES } from '../src/data/starTrees';
import { GUILD_PLANTS } from '../src/data/guildPlants';
import { GUILD_PRESETS, DEFAULT_GUILD_PLANT_IDS } from '../src/core/guildPresets';
import {
  generateStarPlantCoordinates,
  buildClusterStarInstances,
  computeClusterGardenLayout,
  getRecommendedSpacingM,
  getMinTrunkDistanceM,
} from '../src/core/multiStarLayout';
import { resolveGardenConflicts, isTrunkCollarCompanion } from '../src/core/gardenOptimizer';
import { analyzeGardenAntagonisms } from '../src/core/gardenAntagonist';
import { autoPlaceGuildPlants, isAlliumPlant } from '../src/core/placementRules';
import { partitionGuildByCompatibility } from '../src/core/compatibility';
import { GardenPlanCanvas } from '../src/components/GardenPlanCanvas';
import { t } from '../src/i18n/translations';
import {
  GardenCompanionInstance,
  GardenStarPlantInstance,
  StarPlantClusterConfig,
  StarPlantPattern,
} from '../src/types/garden';
import { ClimateZone, GuildPlant, Hemisphere, SoilType, StarTree } from '../src/types/guild';

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
  if (n < 15) console.error(`FAIL [${currentScenario}]: ${message}`);
  else if (n === 15) console.error(`FAIL [${currentScenario}]: ... further failures suppressed`);
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

const PLANTS_BY_ID = new Map(GUILD_PLANTS.map(p => [p.id, p]));
const PATTERNS: StarPlantPattern[] = ['LINE', 'GRID', 'TRIANGLE'];
const HEMISPHERES: Hemisphere[] = ['NORTHERN', 'SOUTHERN'];
const fin = (v: number) => Number.isFinite(v);

/** Guilds a user can actually build: the guild builder keeps only compatible companions. */
function guildsFor(star: StarTree): Array<{ name: string; ids: string[] }> {
  const pick = (ids: readonly string[]) =>
    partitionGuildByCompatibility(
      star,
      ids.map(id => PLANTS_BY_ID.get(id)).filter((p): p is GuildPlant => Boolean(p) && !p!.retired)
    ).compatible.map(p => p.id);
  const out = [
    { name: 'rec8', ids: pick(star.recommendedCompanions.slice(0, 8)) },
    { name: 'default', ids: pick(DEFAULT_GUILD_PLANT_IDS) },
  ];
  for (const [k, v] of Object.entries(GUILD_PRESETS)) if (v.treeId === star.id) out.push({ name: `preset-${k}`, ids: pick(v.plantIds) });
  return out.filter(g => g.ids.length > 0);
}

/** Companion layout keyed by star index instead of instance id (instance ids differ per idStamp). */
function normalize(companions: GardenCompanionInstance[], stars: GardenStarPlantInstance[]) {
  const idx = new Map(stars.map((s, i) => [s.instanceId, i]));
  return companions
    .map(c => ({
      plantId: c.plantId,
      x: c.xM,
      y: c.yM,
      serves: c.servicingTreeIds.map(id => idx.get(id) ?? -1).sort((a, b) => a - b).join('+'),
      merged: c.isMerged,
      light: c.currentLightCondition,
    }))
    .map(c => JSON.stringify(c))
    .sort();
}
function normalizeIds(eff: Record<string, string[]>, stars: GardenStarPlantInstance[]) {
  return stars.map(s => [...(eff[s.instanceId] ?? [])]);
}
function firstDiff(a: string[], b: string[]): string {
  const sa = new Set(a), sb = new Set(b);
  const onlyA = a.filter(x => !sb.has(x)).slice(0, 2);
  const onlyB = b.filter(x => !sa.has(x)).slice(0, 2);
  return `radial-only ${onlyA.join(' ')} | garden-only ${onlyB.join(' ')} (lengths ${a.length}/${b.length})`;
}

type Site = { zone?: ClimateZone; soil?: SoilType };
const SITES: Site[] = [{}, { zone: 'TEMPERATE' as ClimateZone, soil: 'LOAM' as SoilType }];

/** Recommended spacing everywhere; site, slider extremes, orientation and grid columns on a subset (runtime). */
function variantsFor(star: StarTree, count: number, pattern: StarPlantPattern, hemisphere: Hemisphere) {
  const out: Array<{ name: string; site: Site; cfg: Omit<StarPlantClusterConfig, 'pattern' | 'count'> }> = [
    { name: 'recommended', site: {}, cfg: { spacingM: 0, orientationDeg: 90 } },
  ];
  if (hemisphere === 'NORTHERN' && count % 2 === 0) out.push({ name: 'site', site: SITES[1], cfg: { spacingM: 0, orientationDeg: 90 } });
  if (hemisphere === 'NORTHERN' && (count === 3 || count === 6)) {
    const sliderMin = Math.max(getMinTrunkDistanceM(star), Number((star.matureRadiusM * 1.2).toFixed(1)));
    out.push({ name: `sliderMin ${sliderMin} N-S`, site: {}, cfg: { spacingM: sliderMin, orientationDeg: 0 } });
    out.push({ name: 'wide 45deg', site: {}, cfg: { spacingM: getRecommendedSpacingM(star).max, orientationDeg: 45, ...(pattern === 'GRID' ? { gridCols: 2 } : {}) } });
  }
  return out;
}

// ------------------------------------------------------------------------------------------------
// 1. Parity: radial multi-star layout == garden planner for the same instances
// ------------------------------------------------------------------------------------------------
let parityCases = 0;
let unresolvedCompanionConflictCases = 0;
for (const star of STAR_TREES) {
  scenario(`parity/${star.id}`, () => {
    for (const guild of guildsFor(star)) {
      for (const count of [2, 3, 4, 5, 6]) {
        for (const pattern of PATTERNS) {
          for (const hemisphere of HEMISPHERES) {
            for (const variant of variantsFor(star, count, pattern, hemisphere)) {
              const site = variant.site;
              parityCases++;
              const key = `${guild.name} n=${count} ${pattern} ${hemisphere} ${variant.name}`;
              const config: StarPlantClusterConfig = { pattern, count, ...variant.cfg };
              const radial = computeClusterGardenLayout(star, config, guild.ids, { hemisphere, ...site, autoResolve: true });

              // Independent garden: own instances from the coordinates, App's id scheme with a Date.now stamp
              const pts = generateStarPlantCoordinates(star, config).treePoints;
              const stamp = '1727790000000';
              const gardenStars: GardenStarPlantInstance[] = pts.map((p, i) => ({
                instanceId: `star-tree-${star.id}-${stamp}-${i}`,
                treeId: star.id,
                starTree: star,
                xM: p.dxM,
                yM: p.dyM,
                selectedPlantIds: [...guild.ids],
              }));
              const garden = resolveGardenConflicts(gardenStars, {
                hemisphere, zone: site.zone, soil: site.soil, enabled: true, pinned: new Set<string>(),
              });

              assert(radial.starPlants.length === count, `${key}: ${radial.starPlants.length} stars, expected ${count}`);
              radial.starPlants.forEach((s, i) => {
                assert(s.xM === pts[i].dxM && s.yM === pts[i].dyM, `${key}: star #${i + 1} at (${s.xM},${s.yM}), coordinates say (${pts[i].dxM},${pts[i].dyM})`);
                assert(s.treeId === star.id && s.starTree === star, `${key}: star #${i + 1} is not ${star.id}`);
                assert(JSON.stringify(s.selectedPlantIds) === JSON.stringify(guild.ids), `${key}: star #${i + 1} companion list ${s.selectedPlantIds} != guild`);
              });
              assert(new Set(radial.starPlants.map(s => s.instanceId)).size === count, `${key}: duplicate star instance ids`);

              const rn = normalize(radial.resolution.companions, radial.starPlants);
              const gn = normalize(garden.companions, gardenStars);
              assert(JSON.stringify(rn) === JSON.stringify(gn), `${key}: companions differ from garden: ${firstDiff(rn, gn)}`);
              assert(
                JSON.stringify(normalizeIds(radial.resolution.effectiveCompanionIds, radial.starPlants)) ===
                  JSON.stringify(normalizeIds(garden.effectiveCompanionIds, gardenStars)),
                `${key}: effective companion ids differ from garden`
              );
              assert(JSON.stringify(radial.resolution.stats) === JSON.stringify(garden.stats),
                `${key}: stats ${JSON.stringify(radial.resolution.stats)} != garden ${JSON.stringify(garden.stats)}`);
              const subs = (r: typeof garden) => r.substitutions.map(s => `${s.removedPlantId}>${s.addedPlantIds.join(',')}x${s.servedTreeIds.length}`).sort().join(' ');
              assert(subs(radial.resolution) === subs(garden), `${key}: substitutions '${subs(radial.resolution)}' != garden '${subs(garden)}'`);
              const types = (cs: { type: string; severity: string }[]) => cs.map(c => `${c.type}:${c.severity}`).sort().join(',');
              assert(types(radial.resolution.unresolved) === types(garden.unresolved),
                `${key}: unresolved conflicts '${types(radial.resolution.unresolved)}' != garden '${types(garden.unresolved)}'`);

              // ---- invariants of the drawn layout ----
              const comps = radial.resolution.companions;
              const b = radial.boundsM;
              assert([b.minX, b.maxX, b.minY, b.maxY].every(fin) && b.maxX > b.minX && b.maxY > b.minY, `${key}: bad bounds ${JSON.stringify(b)}`);
              for (const s of radial.starPlants) {
                assert(fin(s.xM) && fin(s.yM), `${key}: star NaN`);
                const r = star.matureRadiusM;
                assert(s.xM - r >= b.minX - 1e-6 && s.xM + r <= b.maxX + 1e-6 && s.yM - r >= b.minY - 1e-6 && s.yM + r <= b.maxY + 1e-6,
                  `${key}: canopy of ${s.instanceId} outside bounds`);
              }
              for (const c of comps) {
                assert(fin(c.xM) && fin(c.yM), `${key}: ${c.plantId} at NaN`);
                assert(c.xM >= b.minX && c.xM <= b.maxX && c.yM >= b.minY && c.yM <= b.maxY,
                  `${key}: ${c.plantId} (${c.xM},${c.yM}) outside bounds ${JSON.stringify(b)}`);
                for (const s of radial.starPlants) {
                  const d = Math.hypot(c.xM - s.xM, c.yM - s.yM);
                  // 0.4 m bare collar; alliums >= 1.8 m from N-fixing trunks (ALLIUM_NTREE rule of the garden analysis)
                  const min = s.starTree.category === 'NITROGEN_FIXING_TREE' && isAlliumPlant(c.plant) ? 1.8 : 0.4;
                  assert(d >= min - 0.011, `${key}: ${c.plantId} ${d.toFixed(2)} m from trunk ${s.instanceId} (collar ${min} m)`);
                }
                if (isTrunkCollarCompanion(c.plant)) {
                  assert(c.servicingTreeIds.length === 1, `${key}: trunk-collar plant ${c.plantId} shared by ${c.servicingTreeIds.length} stars`);
                }
              }
              // No identical positions (D1 of the old implementation stacked up to 7 plants on one point)
              const pos = comps.map(c => `${c.xM},${c.yM}`);
              assert(new Set(pos).size === pos.length, `${key}: ${pos.length - new Set(pos).size} companions on identical coordinates`);
              // Every star is served by every companion of its (effective) guild
              radial.starPlants.forEach((s, i) => {
                for (const id of radial.resolution.effectiveCompanionIds[s.instanceId] ?? []) {
                  if (!PLANTS_BY_ID.has(id)) continue;
                  assert(comps.some(c => c.plantId === id && c.servicingTreeIds.includes(s.instanceId)), `${key}: ${id} does not serve star #${i + 1}`);
                }
              });
              // Recommended spacing never collides trunks
              const conflicts = analyzeGardenAntagonisms(radial.starPlants, comps);
              assert(!conflicts.some(c => c.type === 'TRUNK_COLLISION'), `${key}: trunk collision at recommended spacing`);
              // unresolved == fresh analysis of the drawn layout (nothing hidden)
              assert(types(conflicts) === types(radial.resolution.unresolved), `${key}: drawn layout has conflicts '${types(conflicts)}' but resolution reports '${types(radial.resolution.unresolved)}'`);
              const compIds = new Set(comps.map(c => c.instanceId));
              const companionCaused = radial.resolution.unresolved.filter(c => compIds.has(c.plantA.id) || compIds.has(c.plantB.id));
              if (companionCaused.length > 0) unresolvedCompanionConflictCases++;
              assert(companionCaused.length === 0 || radial.resolution.suggestions.length > 0 || garden.unresolved.length === radial.resolution.unresolved.length,
                `${key}: companion conflicts left without suggestion`);
            }
          }
        }
      }
    }
  });
}

// Companion-caused conflicts after auto resolution, one strict check per star at the default guild
scenario('no companion-caused conflicts left (auto resolve, compatible guild, recommended spacing)', () => {
  for (const star of STAR_TREES) {
    for (const guild of guildsFor(star)) {
      for (const count of [2, 3, 6]) {
        for (const pattern of PATTERNS) {
          const r = computeClusterGardenLayout(star, { pattern, count, spacingM: 0, orientationDeg: 90 }, guild.ids, { hemisphere: 'NORTHERN' });
          const compIds = new Set(r.resolution.companions.map(c => c.instanceId));
          const left = r.resolution.unresolved.filter(c => compIds.has(c.plantA.id) || compIds.has(c.plantB.id));
          assert(left.length === 0, `${star.id} ${guild.name} n=${count} ${pattern}: ${left.length} companion conflicts remain: ${[...new Set(left.map(c => `${c.type}(${c.plantA.id} / ${c.plantB.id})`))].slice(0, 3).join('; ')}`);
        }
      }
    }
  }
});

// ------------------------------------------------------------------------------------------------
// 2. Options, spacing, determinism, id independence
// ------------------------------------------------------------------------------------------------
scenario('autoResolve=false equals garden with auto mode off', () => {
  for (const star of STAR_TREES.slice(0, 10)) {
    const ids = guildsFor(star)[0]?.ids ?? [];
    const cfg: StarPlantClusterConfig = { pattern: 'GRID', count: 4, spacingM: 0 };
    const r = computeClusterGardenLayout(star, cfg, ids, { autoResolve: false });
    const g = resolveGardenConflicts(buildClusterStarInstances(star, cfg, ids, 'other'), { enabled: false });
    assert(r.resolution.substitutions.length === 0, `${star.id}: substitutions applied with autoResolve=false`);
    assert(JSON.stringify(normalize(r.resolution.companions, r.starPlants)) ===
      JSON.stringify(normalize(g.companions, buildClusterStarInstances(star, cfg, ids, 'other'))), `${star.id}: layout differs from garden (auto off)`);
    assert(r.resolution.suggestions.length === g.suggestions.length, `${star.id}: ${r.resolution.suggestions.length} suggestions vs garden ${g.suggestions.length}`);
  }
});

scenario('spacing: recommended and slider minimum never below the garden trunk-collision threshold', () => {
  for (const star of STAR_TREES) {
    const rec = getRecommendedSpacingM(star);
    const minTrunk = getMinTrunkDistanceM(star);
    assert(minTrunk === Math.max(1.5, (star.matureRadiusM + star.matureRadiusM) * 0.4), `${star.id}: getMinTrunkDistanceM ${minTrunk} != analyzeGardenAntagonisms threshold`);
    assert(rec.min >= minTrunk && rec.optimal >= minTrunk && rec.max >= rec.optimal && rec.optimal >= rec.min,
      `${star.id}: spacing ${JSON.stringify(rec)} vs min trunk ${minTrunk}`);
    // GardenPlanCanvas slider minimum
    const sliderMin = Math.max(minTrunk, Number((star.matureRadiusM * 1.2).toFixed(1)));
    for (const pattern of PATTERNS) {
      for (const spacingM of [sliderMin, rec.optimal, rec.max]) {
        const stars = buildClusterStarInstances(star, { pattern, count: 6, spacingM }, []);
        const tc = analyzeGardenAntagonisms(stars, []).filter(c => c.type === 'TRUNK_COLLISION');
        assert(tc.length === 0, `${star.id} ${pattern} n=6 spacing ${spacingM}: ${tc.length} trunk collisions`);
      }
    }
  }
});

scenario('deterministic and idStamp-independent', () => {
  for (const star of [STAR_TREES[0], STAR_TREES[1], STAR_TREES[12], STAR_TREES[15]]) {
    const ids = guildsFor(star)[0].ids;
    for (const pattern of PATTERNS) {
      const cfg: StarPlantClusterConfig = { pattern, count: 5, spacingM: 0, orientationDeg: 90 };
      const a = computeClusterGardenLayout(star, cfg, ids, { hemisphere: 'SOUTHERN' });
      const b = computeClusterGardenLayout(star, cfg, ids, { hemisphere: 'SOUTHERN' });
      assert(JSON.stringify(a) === JSON.stringify(b), `${star.id} ${pattern}: two runs differ`);
      for (const stamp of ['1', '99999999999999', 'zzz', String(Date.now())]) {
        const c = computeClusterGardenLayout(star, cfg, ids, { hemisphere: 'SOUTHERN', idStamp: stamp });
        assert(JSON.stringify(normalize(a.resolution.companions, a.starPlants)) === JSON.stringify(normalize(c.resolution.companions, c.starPlants)),
          `${star.id} ${pattern}: idStamp '${stamp}' changes the layout`);
      }
      // List order of the guild must not matter (share links reorder)
      const rev = computeClusterGardenLayout(star, cfg, [...ids].reverse(), { hemisphere: 'SOUTHERN' });
      assert(JSON.stringify(normalize(a.resolution.companions, a.starPlants)) === JSON.stringify(normalize(rev.resolution.companions, rev.starPlants)),
        `${star.id} ${pattern}: reversed guild order changes the layout`);
    }
  }
  // Inputs are not mutated
  const ids = ['plant-comfrey', 'plant-chives'];
  const cfg: StarPlantClusterConfig = { pattern: 'LINE', count: 3, spacingM: 0 };
  const snap = JSON.stringify({ ids, cfg });
  computeClusterGardenLayout(STAR_TREES[0], cfg, ids);
  assert(JSON.stringify({ ids, cfg }) === snap, 'inputs mutated');
});

scenario('edge cases: empty guild, unknown ids, count 1 / SINGLE', () => {
  const star = STAR_TREES[0];
  const empty = computeClusterGardenLayout(star, { pattern: 'LINE', count: 3, spacingM: 0 }, []);
  // An empty selection falls back to the star's recommendations in the garden (getEffectiveCompanionIds)
  const g = resolveGardenConflicts(buildClusterStarInstances(star, { pattern: 'LINE', count: 3, spacingM: 0 }, [], 'e'));
  assert(JSON.stringify(normalize(empty.resolution.companions, empty.starPlants)) === JSON.stringify(normalize(g.companions, buildClusterStarInstances(star, { pattern: 'LINE', count: 3, spacingM: 0 }, [], 'e'))),
    'empty guild: differs from garden');
  const unk = computeClusterGardenLayout(star, { pattern: 'GRID', count: 4, spacingM: 0 }, ['plant-does-not-exist', 'plant-comfrey']);
  assert(unk.resolution.companions.every(c => c.plantId === 'plant-comfrey' || PLANTS_BY_ID.has(c.plantId)), 'unknown id produced a companion');
  assert(Object.values(unk.boundsM).every(fin), 'unknown id: bounds NaN');
  for (const cfg of [{ pattern: 'SINGLE' as const, count: 1, spacingM: 0 }, { pattern: 'LINE' as const, count: 1, spacingM: 0 }]) {
    const one = computeClusterGardenLayout(star, cfg, ['plant-comfrey']);
    assert(one.starPlants.length === 1 && one.starPlants[0].xM === 0 && one.starPlants[0].yM === 0, `count 1 ${cfg.pattern}: not one star at origin`);
  }
  // Huge spacing / every count: no NaN
  for (const pattern of PATTERNS) for (let n = 2; n <= 6; n++) {
    const r = computeClusterGardenLayout(STAR_TREES[1], { pattern, count: n, spacingM: 25, gridCols: 0 }, ['plant-comfrey']);
    assert(r.starPlants.every(s => fin(s.xM) && fin(s.yM)) && Object.values(r.boundsM).every(fin), `${pattern} n=${n} spacing 25: NaN`);
  }
});

// ------------------------------------------------------------------------------------------------
// 3. "Open in garden grid" (App.handleOpenInGardenGrid, pure part)
// ------------------------------------------------------------------------------------------------
scenario('open in garden grid: same instances and same layout as the radial preview', () => {
  for (const star of STAR_TREES) {
    const guild = guildsFor(star)[0];
    for (const pattern of PATTERNS) {
      for (const count of [2, 3, 6]) {
        const cfg: StarPlantClusterConfig = { pattern, count, spacingM: 0, orientationDeg: 90 };
        const key = `${star.id} ${pattern} n=${count}`;
        const preview = computeClusterGardenLayout(star, cfg, guild.ids, { hemisphere: 'NORTHERN', zone: 'TEMPERATE' as ClimateZone, soil: 'LOAM' as SoilType });
        // App: selectedPlants.map(p => p.id), String(Date.now())
        const handed = buildClusterStarInstances(star, cfg, guild.ids.map(id => PLANTS_BY_ID.get(id)!.id), String(1727790000000 + count));
        assert(handed.length === preview.starPlants.length, `${key}: ${handed.length} instances handed over, preview has ${preview.starPlants.length}`);
        handed.forEach((h, i) => {
          const p = preview.starPlants[i];
          assert(h.xM === p.xM && h.yM === p.yM && h.treeId === p.treeId, `${key}: instance #${i + 1} position/tree differs`);
          assert(JSON.stringify(h.selectedPlantIds) === JSON.stringify(p.selectedPlantIds), `${key}: instance #${i + 1} companions differ`);
          assert(h.instanceId !== p.instanceId, `${key}: handed-over id equals preview id (collides when opened twice?)`);
        });
        assert(new Set(handed.map(h => h.instanceId)).size === handed.length, `${key}: duplicate instance ids`);
        // Independent companion lists (garden edits one star only)
        handed[0].selectedPlantIds!.push('plant-x');
        assert(!handed[1].selectedPlantIds!.includes('plant-x'), `${key}: instances share one selectedPlantIds array`);
        handed[0].selectedPlantIds!.pop();
        // Garden page: resolveGardenConflicts(starPlants, { hemisphere, zone, soil, enabled: autoResolve(default true), pinned: [] })
        const garden = resolveGardenConflicts(handed, { hemisphere: 'NORTHERN', zone: 'TEMPERATE' as ClimateZone, soil: 'LOAM' as SoilType, enabled: true, pinned: new Set() });
        const a = normalize(preview.resolution.companions, preview.starPlants);
        const b = normalize(garden.companions, handed);
        assert(JSON.stringify(a) === JSON.stringify(b), `${key}: garden after hand-over differs from preview: ${firstDiff(a, b)}`);
        // Two hand-overs (clicked twice) must not reuse ids
        const again = buildClusterStarInstances(star, cfg, guild.ids, String(1727790000001 + count));
        assert(!again.some(x => handed.some(h => h.instanceId === x.instanceId)), `${key}: second hand-over reuses instance ids`);
      }
    }
  }
});

// ------------------------------------------------------------------------------------------------
// 4. Rendered canvas (react-dom/server) at counts 1/2/3/6
// ------------------------------------------------------------------------------------------------
function render(star: StarTree, plants: GuildPlant[], hemisphere: Hemisphere, language: 'de' | 'en', cfg?: Partial<StarPlantClusterConfig>, site: Site = {}) {
  return renderToStaticMarkup(
    React.createElement(GardenPlanCanvas, {
      language,
      starTree: star,
      selectedPlants: plants,
      currentSeason: 'SUMMER',
      hemisphere,
      selectedSoil: site.soil,
      selectedZone: site.zone,
      onSelectPlant: () => {},
      onOpenInGardenGrid: () => {},
      initialClusterConfig: cfg,
    })
  );
}
function mainSvg(html: string): string {
  const i = html.indexOf('id="radial-garden-map-svg"');
  return i < 0 ? '' : html.slice(html.lastIndexOf('<svg', i), html.indexOf('</svg>', i));
}

scenario('canvas count 1 == single-guild radial plan (regression)', () => {
  for (const star of [STAR_TREES[0], STAR_TREES[1], STAR_TREES[15]]) {
    const plants = guildsFor(star)[0].ids.map(id => PLANTS_BY_ID.get(id)!);
    for (const hemisphere of HEMISPHERES) {
      const def = render(star, plants, hemisphere, 'en');
      for (const cfg of [{ count: 1 }, { count: 1, pattern: 'GRID' as const }, { pattern: 'SINGLE' as const, count: 1 }]) {
        assert(render(star, plants, hemisphere, 'en', cfg) === def, `${star.id} ${hemisphere} ${JSON.stringify(cfg)}: differs from default single render`);
      }
      const svg = mainSvg(def);
      assert(!/data-star-instance|data-companion=|id="cluster-/.test(svg), `${star.id}: cluster groups drawn in single mode`);
      assert(!def.includes('radial-cluster-garden-check'), `${star.id}: garden check panel in single mode`);
      // Every placed plant at its autoPlaceGuildPlants position
      const placed = autoPlaceGuildPlants(star, plants, hemisphere);
      const tr = [...svg.matchAll(/transform="translate\(([-\d.e]+), ([-\d.e]+)\)"/g)].map(m => [+m[1], +m[2]]);
      assert(tr.length === placed.length, `${star.id} ${hemisphere}: ${tr.length} plant markers, autoPlaceGuildPlants placed ${placed.length}`);
    }
  }
});

scenario('canvas multi-star SVG matches computeClusterGardenLayout', () => {
  const cases: Array<{ star: StarTree; site: Site }> = [
    { star: STAR_TREES.find(s => s.id === 'tree-apple')!, site: {} },
    { star: STAR_TREES.find(s => s.id === 'tree-walnut')!, site: { zone: 'TEMPERATE' as ClimateZone, soil: 'CLAY' as SoilType } },
    { star: STAR_TREES.find(s => s.id === 'shrub-blackcurrant')!, site: {} },
    { star: STAR_TREES.find(s => s.id === 'tree-alder')!, site: {} },
  ];
  for (const { star, site } of cases) {
    for (const guild of guildsFor(star)) {
      const plants = guild.ids.map(id => PLANTS_BY_ID.get(id)!);
      for (const language of ['de', 'en'] as const) {
        for (const hemisphere of HEMISPHERES) {
          for (const count of [2, 3, 6]) {
            for (const pattern of PATTERNS) {
              const key = `${star.id} ${guild.name} ${language} ${hemisphere} n=${count} ${pattern}`;
              const html = render(star, plants, hemisphere, language, { count, pattern }, site);
              const svg = mainSvg(html);
              assert(svg.length > 0, `${key}: no radial svg`);
              assert(!/NaN|Infinity|undefined/.test(html), `${key}: NaN/Infinity/undefined in markup: ${html.match(/.{30}(NaN|Infinity|undefined).{10}/)?.[0]}`);
              const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
              const W = vb ? +vb[1] : NaN, H = vb ? +vb[2] : NaN;
              const model = computeClusterGardenLayout(star, { pattern, count, spacingM: 0, orientationDeg: 90 }, guild.ids, { hemisphere, ...site, autoResolve: true });
              const starGroups = svg.match(/data-star-instance="/g)?.length ?? 0;
              assert(starGroups === count, `${key}: ${starGroups} star groups drawn, expected ${count}`);
              const drawnComps = [...svg.matchAll(/data-companion="([^"]+)" transform="translate\(([-\d.e]+), ([-\d.e]+)\)"/g)];
              assert(drawnComps.length === model.resolution.companions.length, `${key}: ${drawnComps.length} companions drawn, model ${model.resolution.companions.length}`);
              const drawnIds = drawnComps.map(m => m[1]).sort().join(',');
              const modelIds = model.resolution.companions.map(c => c.plantId).sort().join(',');
              assert(drawnIds === modelIds, `${key}: drawn companion species differ from the model`);
              // Pixel positions: drawn layout is a similarity transform of the model (same relative geometry)
              const b = model.boundsM;
              const scale = (W - 88) / Math.max(b.maxX - b.minX, b.maxY - b.minY, 4);
              const toPx = (x: number, y: number) => [W / 2 + (x - (b.minX + b.maxX) / 2) * scale, H / 2 + (y - (b.minY + b.maxY) / 2) * scale];
              const want = model.resolution.companions.map(c => toPx(c.xM, c.yM));
              let mismatched = 0;
              drawnComps.forEach((m, i) => {
                const [x, y] = [+m[2], +m[3]];
                assert(x >= 0 && x <= W && y >= 0 && y <= H, `${key}: companion ${m[1]} drawn at (${x.toFixed(0)},${y.toFixed(0)}) outside viewBox ${W}x${H}`);
                if (Math.abs(x - want[i][0]) > 0.5 || Math.abs(y - want[i][1]) > 0.5) mismatched++;
              });
              assert(mismatched === 0, `${key}: ${mismatched} companions not drawn at their model position (expected fit-to-bounds mapping)`);
              // Star markers inside the view, canopy circles inside the view
              const starPx = model.starPlants.map(s => toPx(s.xM, s.yM));
              for (const [x, y] of starPx) {
                const r = star.matureRadiusM * scale;
                assert(x - r >= -0.5 && x + r <= W + 0.5 && y - r >= -0.5 && y + r <= H + 0.5, `${key}: star canopy at (${x.toFixed(0)},${y.toFixed(0)}) r=${r.toFixed(0)} clipped`);
              }
              // Labels and panel
              const countLabel = language === 'de' ? `${count}x Leitpflanzen` : `${count}x Star Plants`;
              assert(html.includes(countLabel), `${key}: toolbar label '${countLabel}' missing`);
              for (let k = 1; k <= count; k++) assert(svg.includes(`#${k}<`) || svg.includes(`#${k} `) || svg.includes(`#<!-- -->${k}`), `${key}: star label #${k} missing`);
              assert(html.includes('id="radial-cluster-garden-check"'), `${key}: garden check panel missing`);
              const st = model.resolution.stats;
              const esc = (x: string) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
              const savings = t(language).gardenPlanSavings
                .replace('{optimized}', String(st.companionPlantCount))
                .replace('{unoptimized}', String(st.unoptimizedCompanionCount))
                .replace('{percent}', String(st.savingsPercent));
              if (st.savingsPercent > 0) assert(html.includes(esc(savings)), `${key}: savings line '${savings}' (garden stats) not shown`);
              const unresolvedN = model.resolution.unresolved.length;
              const panel = html.slice(html.indexOf('id="radial-cluster-garden-check"'));
              if (unresolvedN > 0) assert(panel.includes(`${unresolvedN} ${esc(t(language).gardenWarningsConflicts)}`) || panel.includes(`${unresolvedN}<!-- --> <!-- -->${esc(t(language).gardenWarningsConflicts)}`), `${key}: panel does not report ${unresolvedN} conflicts`);
              else assert(panel.includes(esc(t(language).gardenWarningsInHarmony)), `${key}: panel does not report harmony although no conflict is left`);
            }
          }
        }
      }
    }
  }
});

// ------------------------------------------------------------------------------------------------
console.log('\nRadial multi-star scenarios:');
for (const r of scenarioResults) console.log(`  ${r.failures === 0 ? 'PASS' : 'FAIL'}  ${r.name}${r.failures ? ` (${r.failures} failed checks)` : ''}`);
console.log(`\n${parityCases} parity cases; ${unresolvedCompanionConflictCases} with companion conflicts the garden also leaves unresolved`);
console.log(`${passedChecks}/${totalChecks} checks passed`);
