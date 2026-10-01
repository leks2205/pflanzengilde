/**
 * Independent scenario tests for the single-guild compatibility prefilter (src/core/compatibility.ts).
 *
 * The oracle is analyzeGuildAntagonisms: a companion is a star-conflict when adding it to the
 * guild produces a CRITICAL/WARNING INTERNAL_PROXIMITY conflict that the star alone does not
 * produce, after auto-placement (spacing-solvable rules are handled by the placement engine).
 * External site alerts (walnut siting, tea on lime, Verticillium nightshades, ...) are about
 * plants outside the guild and are not star-companion conflicts.
 */
import { STAR_TREES } from '../src/data/starTrees';
import { GUILD_PLANTS, ACTIVE_GUILD_PLANTS } from '../src/data/guildPlants';
import { analyzeGuildAntagonisms, AntagonistConflict } from '../src/core/antagonistEngine';
import { autoPlaceGuildPlants, isAlliumPlant } from '../src/core/placementRules';
import {
  getStarIncompatibility,
  isCompatibleWithStar,
  getCompanionPairIncompatibility,
  isCompatiblePair,
  getGuildIncompatibility,
  isCompatibleWithGuild,
  partitionGuildByCompatibility,
  SPACING_SOLVABLE_RULES,
  summarizeIncompatibility,
} from '../src/core/compatibility';
import { GuildPlant, Hemisphere, StarTree } from '../src/types/guild';

let passedChecks = 0;
let totalChecks = 0;
const scenarioResults: Array<{ name: string; failures: number }> = [];
let currentScenario = '';
let currentFailures = 0;

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

// Repeated identical failures inside the exhaustive loops are capped per scenario to keep output readable.
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
  if (n < 25) console.error(`FAIL [${currentScenario}]: ${message}`);
  else if (n === 25) console.error(`FAIL [${currentScenario}]: ... further failures suppressed`);
  printedPerScenario.set(currentScenario, n + 1);
}

const HEMIS: Hemisphere[] = ['NORTHERN', 'SOUTHERN'];
const ACTIVE = GUILD_PLANTS.filter(p => !p.retired);
const SPACING_IDS = new Set(SPACING_SOLVABLE_RULES.map(r => r.conflictId));
const plant = (id: string): GuildPlant => {
  const p = GUILD_PLANTS.find(x => x.id === id);
  if (!p) throw new Error(`missing plant ${id}`);
  return p;
};
const star = (id: string): StarTree => {
  const t = STAR_TREES.find(x => x.id === id);
  if (!t) throw new Error(`missing star ${id}`);
  return t;
};
const isBlocking = (c: AntagonistConflict) =>
  c.type === 'INTERNAL_PROXIMITY' && (c.severity === 'CRITICAL' || c.severity === 'WARNING') && !SPACING_IDS.has(c.id);

/** Engine-derived star-companion conflicts (ids → severity) of adding `p` to `s`, over both hemispheres. */
function oracleStarConflicts(s: StarTree, p: GuildPlant): Map<string, string> {
  const out = new Map<string, string>();
  for (const h of HEMIS) {
    const base = new Set(analyzeGuildAntagonisms(s, [], h).conflicts.filter(isBlocking).map(c => c.id));
    for (const c of analyzeGuildAntagonisms(s, [p], h).conflicts) {
      if (isBlocking(c) && !base.has(c.id)) out.set(c.id, c.severity);
    }
  }
  return out;
}

/** Blocking conflicts of a full guild that the bare star does not already have. */
function oracleGuildConflicts(s: StarTree, plants: GuildPlant[], h: Hemisphere): AntagonistConflict[] {
  const base = new Set(analyzeGuildAntagonisms(s, [], h).conflicts.filter(isBlocking).map(c => c.id));
  return analyzeGuildAntagonisms(s, plants, h).conflicts.filter(c => isBlocking(c) && !base.has(c.id));
}

function checkMessage(r: { message: { de: string; en: string } }, ctx: string) {
  for (const lang of ['de', 'en'] as const) {
    const m = r.message?.[lang];
    assert(typeof m === 'string' && m.trim().length > 0, `${ctx}: ${lang} message is empty`);
    if (typeof m === 'string') {
      assert(!/\{[a-z]+\}/i.test(m), `${ctx}: ${lang} message has an unfilled placeholder: "${m}"`);
      assert(!m.includes('undefined'), `${ctx}: ${lang} message contains "undefined": "${m}"`);
    }
  }
}

// Deterministic PRNG for the fuzz scenarios
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------------------------
scenario('G1 every star × every active plant: prefilter verdict == engine verdict', () => {
  let hidden = 0;
  for (const s of STAR_TREES) {
    for (const p of ACTIVE) {
      const oracle = oracleStarConflicts(s, p);
      const reasons = getStarIncompatibility(p, s);
      const allowed = isCompatibleWithStar(p, s);
      assert(allowed === (reasons.length === 0), `${s.id}/${p.id}: isCompatibleWithStar disagrees with getStarIncompatibility`);
      if (allowed) {
        assert(
          oracle.size === 0,
          `${s.id}/${p.id}: prefilter ALLOWS but engine reports ${[...oracle.entries()].map(([id, sev]) => `${id}(${sev})`).join(', ')}`
        );
      } else {
        hidden++;
        assert(oracle.size > 0, `${s.id}/${p.id}: prefilter HIDES (${reasons.map(r => r.conflictId).join(', ')}) but the engine reports no conflict`);
        for (const r of reasons) {
          assert(oracle.has(r.conflictId), `${s.id}/${p.id}: reason ${r.conflictId} is not reported by the engine (engine: ${[...oracle.keys()].join(', ')})`);
          if (oracle.has(r.conflictId)) {
            assert(oracle.get(r.conflictId) === r.severity, `${s.id}/${p.id}: reason ${r.conflictId} severity ${r.severity} != engine ${oracle.get(r.conflictId)}`);
          }
          assert(r.withId === s.id, `${s.id}/${p.id}: star reason withId=${r.withId}`);
          assert(r.withName?.de === s.commonName.de && r.withName?.en === s.commonName.en, `${s.id}/${p.id}: withName is not the star's name`);
          checkMessage(r, `${s.id}/${p.id}/${r.conflictId}`);
        }
        for (const id of oracle.keys()) {
          assert(reasons.some(r => r.conflictId === id), `${s.id}/${p.id}: engine conflict ${id} has no matching reason`);
        }
      }
    }
  }
  assert(hidden > 0, 'prefilter hides at least one star/plant combination');
});

scenario('G2 every active companion pair: isCompatiblePair == engine (neutral star)', () => {
  // tree-ginkgo has no pH class, makes no juglone, is on no pest-host spec: a neutral host for pair checks
  const neutral = star('tree-ginkgo');
  for (const p of ACTIVE) assert(oracleStarConflicts(neutral, p).size === 0, `neutral star assumption broken by ${p.id}`);
  for (let i = 0; i < ACTIVE.length; i++) {
    for (let j = i + 1; j < ACTIVE.length; j++) {
      const a = ACTIVE[i];
      const b = ACTIVE[j];
      const ab = isCompatiblePair(a, b);
      const ba = isCompatiblePair(b, a);
      assert(ab === ba, `isCompatiblePair not symmetric for ${a.id}/${b.id}`);
      const engine = HEMIS.flatMap(h => oracleGuildConflicts(neutral, [a, b], h));
      if (ab) {
        assert(engine.length === 0, `pair ${a.id}+${b.id} allowed but engine reports ${engine.map(c => c.id).join(', ')}`);
      } else {
        assert(engine.length > 0, `pair ${a.id}+${b.id} blocked but engine reports nothing`);
        const reasons = getCompanionPairIncompatibility(a, b);
        assert(reasons.every(r => r.withId === b.id), `pair reasons for ${a.id} should name ${b.id}`);
        for (const r of reasons) {
          assert(engine.some(c => c.id === r.conflictId), `pair reason ${r.conflictId} not in engine for ${a.id}+${b.id}`);
          checkMessage(r, `pair ${a.id}+${b.id}`);
        }
      }
    }
    assert(isCompatiblePair(ACTIVE[i], ACTIVE[i]), `${ACTIVE[i].id} is incompatible with itself`);
  }
});

scenario('G3 default recommendedCompanions of every star are all allowed and conflict-free', () => {
  for (const s of STAR_TREES) {
    const rec = s.recommendedCompanions.map(id => GUILD_PLANTS.find(p => p.id === id));
    s.recommendedCompanions.forEach((id, i) => {
      assert(Boolean(rec[i]), `${s.id} recommends unknown plant ${id}`);
      assert(!rec[i]?.retired, `${s.id} recommends retired plant ${id}`);
    });
    const plants = rec.filter((p): p is GuildPlant => Boolean(p) && !p!.retired);
    for (const p of plants) {
      assert(isCompatibleWithStar(p, s), `${s.id}: default companion ${p.id} is hidden (${getStarIncompatibility(p, s).map(r => r.conflictId).join(', ')})`);
    }
    const part = partitionGuildByCompatibility(s, plants);
    assert(
      part.incompatible.length === 0,
      `${s.id}: default guild loses ${part.incompatible.map(x => `${x.plant.id}(${x.reasons.map(r => r.conflictId).join('/')})`).join(', ')}`
    );
  }
});

scenario('G4 walnut star: juglone-sensitive companions hidden (CRITICAL), others allowed', () => {
  const walnut = star('tree-walnut');
  const sensitive = ACTIVE.filter(p => p.jugloneTolerance === 'SENSITIVE').map(p => p.id).sort();
  assert(sensitive.length >= 5, `expected the cited sensitive list, got ${sensitive.join(', ')}`);
  for (const id of ['plant-alfalfa', 'plant-rhododendron', 'plant-blueberry', 'plant-rhubarb', 'plant-alder']) {
    const r = getStarIncompatibility(plant(id), walnut);
    assert(r.some(x => x.code === 'JUGLONE' && x.severity === 'CRITICAL'), `walnut must hide ${id} with a CRITICAL JUGLONE reason`);
  }
  for (const p of ACTIVE) {
    if (p.jugloneTolerance !== 'SENSITIVE') {
      assert(!getStarIncompatibility(p, walnut).some(r => r.code === 'JUGLONE'), `walnut hides non-sensitive ${p.id} for juglone`);
    }
  }
  // Juglone is a producer property: no other star hides sensitive plants for juglone
  for (const s of STAR_TREES.filter(t => !t.jugloneProducer)) {
    for (const id of sensitive) {
      assert(!getStarIncompatibility(plant(id), s).some(r => r.code === 'JUGLONE'), `${s.id} (no juglone) hides ${id} for juglone`);
    }
  }
});

scenario('G5 acid stars (tea, chestnut, blueberry, rhododendron) hide calcicoles; lime-tolerant herbs stay', () => {
  const calcicoles = ['plant-sage', 'plant-alfalfa', 'plant-sainfoin', 'plant-hellebore'];
  const limeTolerant = ['plant-lavender', 'plant-rosemary', 'plant-hyssop', 'plant-thyme'];
  for (const sid of ['tree-tea-sinensis', 'tree-tea-assamica', 'tree-chestnut', 'shrub-blueberry', 'shrub-rhododendron']) {
    const s = star(sid);
    for (const id of calcicoles) {
      assert(getStarIncompatibility(plant(id), s).some(r => r.code === 'EDAPHIC_PH'), `${sid} must hide calcicole ${id}`);
    }
    for (const id of limeTolerant) {
      assert(!getStarIncompatibility(plant(id), s).some(r => r.code === 'EDAPHIC_PH'), `${sid} hides lime-tolerant ${id} for pH`);
    }
    // acid companions with an acid star are fine
    for (const id of ['plant-cranberry', 'plant-lingonberry', 'plant-wintergreen', 'plant-blueberry', 'plant-rhododendron', 'plant-tea-sinensis']) {
      assert(!getStarIncompatibility(plant(id), s).some(r => r.code === 'EDAPHIC_PH'), `${sid} hides acidophile ${id} for pH`);
    }
  }
  // Acid-intolerant stars (fig, hemp) hide the strict acidophiles
  for (const sid of ['tree-fig', 'herb-hemp']) {
    for (const id of ['plant-cranberry', 'plant-lingonberry', 'plant-wintergreen', 'plant-blueberry', 'plant-rhododendron', 'plant-tea-sinensis']) {
      assert(getStarIncompatibility(plant(id), star(sid)).some(r => r.code === 'EDAPHIC_PH'), `${sid} must hide acidophile ${id}`);
    }
  }
  // The example from the task: tea star + sage
  assert(!isCompatibleWithStar(plant('plant-sage'), star('tree-tea-sinensis')), 'tea + sage must be hidden');
  // Neutral star (apple) keeps both sides; pairing them inside one guild is what is blocked
  assert(isCompatibleWithStar(plant('plant-sage'), star('tree-apple')) && isCompatibleWithStar(plant('plant-cranberry'), star('tree-apple')), 'apple allows sage and cranberry individually');
  assert(!isCompatibleWithGuild(plant('plant-sage'), star('tree-apple'), [plant('plant-cranberry')]), 'apple guild with cranberry must block sage');
  const r = getGuildIncompatibility(plant('plant-sage'), star('tree-apple'), [plant('plant-comfrey'), plant('plant-cranberry')]);
  assert(r.length === 1 && r[0].withId === 'plant-cranberry' && r[0].code === 'EDAPHIC_PH', `sage vs cranberry reason should name cranberry, got ${JSON.stringify(r.map(x => [x.code, x.withId]))}`);
});

scenario('G6 N-fixing stars keep alliums (spacing-solvable) and auto-place them ≥ 1.8 m', () => {
  const nStars = STAR_TREES.filter(t => t.category === 'NITROGEN_FIXING_TREE');
  assert(nStars.length >= 2, `expected alder and sea buckthorn as N-fixing stars, got ${nStars.map(t => t.id).join(', ')}`);
  const alliums = ACTIVE.filter(isAlliumPlant);
  assert(alliums.length >= 4, `expected several alliums, got ${alliums.length}`);
  for (const s of nStars) {
    for (const a of alliums) {
      assert(isCompatibleWithStar(a, s), `${s.id} hides allium ${a.id} although the spacing rule solves it`);
      for (const h of HEMIS) {
        const placed = autoPlaceGuildPlants(s, [a], h).find(x => x.plantId === a.id);
        assert(Boolean(placed) && placed!.distanceM >= 1.8, `${s.id}/${a.id} [${h}] auto-placed at ${placed?.distanceM} m (< 1.8 m)`);
      }
    }
    // Worst case all alliums + all legumes: still no blocking conflict after placement
    const mix = [...alliums, ...ACTIVE.filter(p => p.roles.includes('NITROGEN_FIXER'))].filter(p => isCompatibleWithStar(p, s));
    const part = partitionGuildByCompatibility(s, mix);
    for (const h of HEMIS) {
      const spatial = analyzeGuildAntagonisms(s, part.compatible, h).conflicts.filter(c => SPACING_IDS.has(c.id));
      assert(spatial.length === 0, `${s.id} [${h}] alliums+legumes placed with spacing conflicts: ${spatial.map(c => c.id).join(', ')}`);
    }
  }
  // But an allium hand-placed at the trunk of an alder is still a real (spacing) conflict
  const placedAtTrunk = [{ instanceId: 'chives-1', plantId: 'plant-chives', plant: plant('plant-chives'), distanceM: 0.6, angleDeg: 90, zone: 'ZONE_1_BULB' as const, sector: 'EAST_MORNING' as const }];
  assert(
    analyzeGuildAntagonisms(star('tree-alder'), [plant('plant-chives')], placedAtTrunk).conflicts.some(c => c.id === 'internal-allium-nfixing-tree-proximity'),
    'hand-placed chives 0.6 m from alder trunk is still reported'
  );
});

scenario('G7 Verticillium-sensitive stars (sea buckthorn, linden) hide the host companions only', () => {
  const hosts = ['plant-horseradish', 'plant-marigold', 'plant-african-marigold', 'plant-peppermint', 'plant-strawberry'];
  for (const sid of ['tree-seabuckthorn-star', 'tree-linden']) {
    for (const id of hosts) {
      const r = getStarIncompatibility(plant(id), star(sid));
      assert(r.some(x => x.code === 'PEST_HOST' && x.conflictId === 'internal-verticillium-host-companions'), `${sid} must hide Verticillium host ${id}`);
    }
    // Non-hosts in the same roles stay
    for (const id of ['plant-yarrow', 'plant-comfrey', 'plant-thyme', 'plant-pot-marigold']) {
      assert(isCompatibleWithStar(plant(id), star(sid)), `${sid} hides non-host ${id}`);
    }
  }
  for (const id of hosts) {
    assert(isCompatibleWithStar(plant(id), star('tree-apple')), `apple must keep ${id} (not Verticillium-sensitive star)`);
  }
});

scenario('G8 pest-host pairs: plantain/apple, elderberry/cherry, willow+alder/Prunus, strawberry/rhododendron', () => {
  assert(!isCompatibleWithStar(plant('plant-ribwort-plantain'), star('tree-apple')), 'apple must hide ribwort plantain');
  for (const sid of ['tree-plum', 'tree-cherry', 'tree-mulberry']) {
    assert(isCompatibleWithStar(plant('plant-ribwort-plantain'), star(sid)), `${sid} must keep ribwort plantain`);
  }
  assert(!isCompatibleWithStar(plant('plant-elderberry'), star('tree-cherry')), 'cherry must hide elderberry');
  assert(!isCompatibleWithStar(plant('plant-elderberry'), star('shrub-blueberry')), 'blueberry star must hide elderberry');
  assert(isCompatibleWithStar(plant('plant-elderberry'), star('tree-walnut')), 'walnut keeps elderberry');
  for (const sid of ['tree-peach', 'tree-plum', 'tree-apricot', 'tree-cherry']) {
    for (const id of ['plant-willow', 'plant-alder', 'plant-nepal-alder']) {
      assert(!isCompatibleWithStar(plant(id), star(sid)), `${sid} must hide silver-leaf host ${id}`);
    }
  }
  assert(isCompatibleWithStar(plant('plant-willow'), star('tree-apple')), 'apple keeps willow');
  assert(!isCompatibleWithStar(plant('plant-strawberry'), star('shrub-rhododendron')), 'rhododendron must hide strawberry (vine weevil)');
  // External INFO alert never blocks
  assert(isCompatibleWithStar(plant('plant-lupine'), star('tree-chestnut')), 'chestnut keeps lupine (ink disease is an external INFO alert)');
  // Tea companion is a site alert, never a star conflict for a neutral star
  assert(isCompatibleWithStar(plant('plant-tea-sinensis'), star('tree-ginkgo')), 'ginkgo keeps tea (external lime alert only)');
});

scenario('G9 star switch: partition removes exactly the now-incompatible companions', () => {
  const switches: Array<[string, string]> = [
    ['tree-apple', 'tree-walnut'],
    ['tree-apple', 'tree-tea-sinensis'],
    ['tree-apple', 'tree-seabuckthorn-star'],
    ['tree-apple', 'tree-cherry'],
    ['tree-plum', 'tree-apple'],
    ['tree-chestnut', 'tree-fig'],
    ['tree-alder', 'herb-hemp'],
    ['shrub-rhododendron', 'tree-walnut'],
    ['tree-fig', 'tree-chestnut'],
    ['tree-linden', 'tree-apple'],
  ];
  for (const [fromId, toId] of switches) {
    const from = star(fromId);
    const to = star(toId);
    const guild = partitionGuildByCompatibility(from, from.recommendedCompanions.map(plant).filter(p => !p.retired)).compatible;
    const { compatible, incompatible } = partitionGuildByCompatibility(to, guild);
    // Oracle: plants with an engine conflict against the new star
    const expectedGone = guild.filter(p => oracleStarConflicts(to, p).size > 0).map(p => p.id).sort();
    const gone = incompatible.map(x => x.plant.id).sort();
    // A plant may also go because of a pair conflict with an earlier plant; those are not star conflicts
    const starGone = incompatible.filter(x => x.reasons.some(r => r.withId === to.id)).map(x => x.plant.id).sort();
    assert(JSON.stringify(starGone) === JSON.stringify(expectedGone), `${fromId}→${toId}: star-removed ${starGone.join(',')} != expected ${expectedGone.join(',')}`);
    assert(compatible.length + incompatible.length === guild.length, `${fromId}→${toId}: plants lost/duplicated in partition`);
    assert(gone.every(id => guild.some(p => p.id === id)), `${fromId}→${toId}: removed a plant that was not selected`);
    for (const h of HEMIS) {
      const left = oracleGuildConflicts(to, compatible, h);
      assert(left.length === 0, `${fromId}→${toId} [${h}]: kept guild still conflicts: ${left.map(c => c.id).join(', ')}`);
    }
  }
  // Concrete expectations
  const appleGuild = star('tree-apple').recommendedCompanions.map(plant);
  const toWalnut = partitionGuildByCompatibility(star('tree-walnut'), appleGuild).incompatible.map(x => x.plant.id).sort();
  assert(JSON.stringify(toWalnut) === JSON.stringify(['plant-alder', 'plant-alfalfa', 'plant-rhubarb']), `apple→walnut removes alder, alfalfa, rhubarb; got ${toWalnut.join(',')}`);
  const toTea = partitionGuildByCompatibility(star('tree-tea-sinensis'), appleGuild).incompatible.map(x => x.plant.id).sort();
  assert(JSON.stringify(toTea) === JSON.stringify(['plant-alfalfa', 'plant-hellebore']), `apple→tea removes alfalfa, hellebore; got ${toTea.join(',')}`);
  const toSbt = partitionGuildByCompatibility(star('tree-seabuckthorn-star'), appleGuild).incompatible.map(x => x.plant.id).sort();
  assert(
    JSON.stringify(toSbt) === JSON.stringify(['plant-horseradish', 'plant-marigold', 'plant-peppermint', 'plant-strawberry']),
    `apple→sea buckthorn removes the Verticillium hosts; got ${toSbt.join(',')}`
  );
});

scenario('G10 partition fuzz: invariants on 4000 random selections', () => {
  const rnd = mulberry32(0xC0FFEE);
  for (let iter = 0; iter < 4000; iter++) {
    const s = STAR_TREES[Math.floor(rnd() * STAR_TREES.length)];
    const n = 1 + Math.floor(rnd() * 14);
    const sel: GuildPlant[] = [];
    while (sel.length < n) {
      const p = ACTIVE[Math.floor(rnd() * ACTIVE.length)];
      if (!sel.includes(p)) sel.push(p);
    }
    const h = HEMIS[iter % 2];
    const ctx = `#${iter} ${s.id} [${sel.map(p => p.id).join(',')}]`;
    const { compatible, incompatible } = partitionGuildByCompatibility(s, sel);
    // order-preserving split
    const merged = sel.filter(p => compatible.includes(p) || incompatible.some(x => x.plant === p));
    assert(merged.length === sel.length && compatible.length + incompatible.length === sel.length, `${ctx}: partition loses/duplicates plants`);
    assert(JSON.stringify(compatible.map(p => p.id)) === JSON.stringify(sel.filter(p => compatible.includes(p)).map(p => p.id)), `${ctx}: compatible order changed`);
    // kept guild conflict-free per engine
    const left = oracleGuildConflicts(s, compatible, h);
    assert(left.length === 0, `${ctx} [${h}]: kept guild conflicts: ${left.map(c => c.id).join(', ')}`);
    // the module's premise: spacing-solvable rules really are solved by auto-placement
    const spacingLeft = analyzeGuildAntagonisms(s, compatible, h).conflicts.filter(c => SPACING_IDS.has(c.id) && c.type === 'INTERNAL_PROXIMITY');
    assert(spacingLeft.length === 0, `${ctx} [${h}]: spacing-solvable conflict not solved by auto-placement: ${spacingLeft.map(c => c.id).join(', ')}`);
    // idempotent
    assert(partitionGuildByCompatibility(s, compatible).incompatible.length === 0, `${ctx}: partition not idempotent`);
    // every removal has reasons pointing at the star or an earlier kept plant
    for (const x of incompatible) {
      assert(x.reasons.length > 0, `${ctx}: ${x.plant.id} removed without reason`);
      const idx = sel.indexOf(x.plant);
      for (const r of x.reasons) {
        const partnerOk = r.withId === s.id || compatible.some(p => p.id === r.withId && sel.indexOf(p) < idx);
        assert(partnerOk, `${ctx}: ${x.plant.id} reason partner ${r.withId} is neither the star nor an earlier kept plant`);
      }
      // the removal is real: adding it back makes the engine report something
      const back = HEMIS.flatMap(hh => oracleGuildConflicts(s, [...compatible, x.plant], hh));
      assert(back.length > 0, `${ctx}: ${x.plant.id} removed but engine sees no conflict when re-added`);
    }
    // maximality (greedy): nothing removed could be re-added to the final kept set
    for (const x of incompatible) {
      assert(!isCompatibleWithGuild(x.plant, s, compatible), `${ctx}: removed ${x.plant.id} is compatible with the final guild (over-removal)`);
    }
  }
});

scenario('G11 getGuildIncompatibility edge cases', () => {
  const apple = star('tree-apple');
  const sage = plant('plant-sage');
  assert(getGuildIncompatibility(sage, apple).length === 0, 'default companions arg = []');
  assert(getGuildIncompatibility(sage, apple, [sage]).length === 0, 'plant itself in companions is skipped');
  // the plant is reported once per conflicting partner
  const r = getGuildIncompatibility(sage, apple, [plant('plant-cranberry'), plant('plant-blueberry')]);
  assert(r.length === 2 && new Set(r.map(x => x.withId)).size === 2, `sage vs cranberry+blueberry: one reason per partner, got ${r.length}`);
  // star + pair reasons together
  const r2 = getGuildIncompatibility(sage, star('tree-tea-sinensis'), [plant('plant-cranberry')]);
  assert(r2.some(x => x.withId === 'tree-tea-sinensis') && r2.some(x => x.withId === 'plant-cranberry'), 'tea star + cranberry companion both block sage');
  // display summary: star reasons win; otherwise one per conflict id; never empty for a blocked plant
  const sum1 = summarizeIncompatibility(r2, 'tree-tea-sinensis');
  assert(sum1.length > 0 && sum1.every(x => x.withId === 'tree-tea-sinensis'), 'summary keeps only star reasons when present');
  const sum2 = summarizeIncompatibility(r, 'tree-apple');
  assert(sum2.length === 1 && sum2[0].code === 'EDAPHIC_PH', `summary collapses pair reasons per conflict, got ${sum2.length}`);
  assert(summarizeIncompatibility([], 'tree-apple').length === 0, 'summary of no reasons is empty');
  // retired plants do not crash the prefilter
  for (const p of GUILD_PLANTS.filter(x => x.retired)) {
    for (const s of STAR_TREES) getStarIncompatibility(p, s);
  }
  assert(ACTIVE_GUILD_PLANTS.length === ACTIVE.length, 'ACTIVE_GUILD_PLANTS matches non-retired filter');
  // no reasons are duplicated for one partner+conflict
  for (const s of STAR_TREES) {
    for (const p of ACTIVE) {
      const rs = getStarIncompatibility(p, s);
      const keys = rs.map(x => `${x.conflictId}|${x.withId}`);
      assert(new Set(keys).size === keys.length, `${s.id}/${p.id}: duplicate reasons ${keys.join(', ')}`);
    }
  }
});

// ---------------------------------------------------------------------------------------------
console.log('\nScenario results:');
for (const r of scenarioResults) console.log(`  ${r.failures === 0 ? 'PASS' : 'FAIL'}  ${r.name}${r.failures ? ` (${r.failures} failed checks)` : ''}`);
console.log(`guild compat: ${passedChecks}/${totalChecks} checks passed`);
if (passedChecks !== totalChecks) process.exit(1);
