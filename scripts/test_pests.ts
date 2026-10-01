import { STAR_TREES } from '../src/data/starTrees';
import { ACTIVE_GUILD_PLANTS, GUILD_PLANTS } from '../src/data/guildPlants';
import {
  PEST_DEFENSE_RULES,
  PEST_RESEARCH_NOTES,
  resolvePestDefense,
  getCompanionPestDefenseForTree
} from '../src/core/pestCompanionEngine';
import {
  analyzePlantRedundancy,
  analyzeSeasonalRoleGaps,
  getGapCandidateIds,
  plantCoversRoleInSeason,
  PHENO_SEASONS
} from '../src/core/seasonalGapEngine';
import { DUAL_ROLE_STAR_TREE_MAP } from '../src/core/gardenOptimizer';
import { ALL_ROLES } from '../src/core/roleCoverageEngine';

let failures = 0;
const fail = (msg: string) => {
  console.error(`FAIL: ${msg}`);
  failures++;
};

const plantIds = new Set(GUILD_PLANTS.map(p => p.id));
const starIds = new Set(STAR_TREES.map(t => t.id));

// 1. Rule integrity: evidence tag, citations, existing IDs, bilingual role text per companion
for (const rule of PEST_DEFENSE_RULES) {
  if (rule.evidence !== 'field-proven' && rule.evidence !== 'scientific') {
    fail(`${rule.id}: badge rules must be 'field-proven' or 'scientific'`);
  }
  if (rule.citations.length === 0) fail(`${rule.id}: needs at least one citation`);
  for (const c of rule.citations) {
    if (!c.doi && !c.url) fail(`${rule.id}: citation "${c.label}" has no DOI or URL`);
  }
  for (const id of rule.starTreeIds || []) {
    if (!starIds.has(id)) fail(`${rule.id}: unknown star plant ${id}`);
  }
  for (const id of rule.companionPlantIds) {
    if (!plantIds.has(id)) fail(`${rule.id}: companion ${id} missing from GUILD_PLANTS`);
    const role = rule.companionRoles[id];
    if (!role?.en || !role?.de) fail(`${rule.id}: companion ${id} needs DE and EN role text`);
  }
  if (!rule.scientificMechanism.en || !rule.scientificMechanism.de) fail(`${rule.id}: mechanism needs DE and EN`);
}

// 2. Research notes are always non-badge tiers with bilingual text
for (const note of PEST_RESEARCH_NOTES) {
  if (note.evidence !== 'promising' && note.evidence !== 'folklore') {
    fail(`${note.id}: research notes must be 'promising' or 'folklore'`);
  }
  if (!note.note.en || !note.note.de) fail(`${note.id}: note needs DE and EN`);
}

// 3. DE/EN symmetry per index (catches mismatched vulnerability lists)
for (const tree of STAR_TREES) {
  const { en, de } = tree.vulnerabilities;
  if (en.length !== de.length) {
    fail(`${tree.id}: EN has ${en.length} vulnerabilities, DE has ${de.length}`);
    continue;
  }
  en.forEach((pestEn, i) => {
    const resEn = resolvePestDefense(pestEn, tree.id);
    const resDe = resolvePestDefense(de[i], tree.id);
    if (resEn.ruleId !== resDe.ruleId) {
      fail(`${tree.id}[${i}]: "${pestEn}" -> ${resEn.ruleId ?? 'none'} but "${de[i]}" -> ${resDe.ruleId ?? 'none'}`);
    }
  });
}

// 4. Abiotic stresses must never resolve to a companion defense
const ABIOTIC = /frost|drought|dürre|trocken|staunässe|waterlog|chloros|compaction|verdichtung|sunburn|sonnenbrand|pollinat|bestäub|shade|schatten|wind|grass|gras|bird|vogel|nitrogen|stickstoff|taproot|wurzelstörung|feline|katze|establishment|jugendwachstum|fruit drop|fruchtfall|hypoxia/i;
for (const tree of STAR_TREES) {
  for (const pest of [...tree.vulnerabilities.en, ...tree.vulnerabilities.de]) {
    // 'Spitzendürre' is Monilinia blossom blight, not drought
    if (ABIOTIC.test(pest.replace(/spitzendürre/i, '')) && resolvePestDefense(pest, tree.id).combatable) {
      fail(`${tree.id}: abiotic stress "${pest}" resolved to a companion defense`);
    }
  }
}

// 5. Exact expected badge map (regression guard: every change to the evidence base must be deliberate)
const EXPECTED: Record<string, string[]> = {
  'tree-apple': ['rule-codling-moth-flower-strip', 'rule-woolly-aphid'],
  'tree-quince': ['rule-codling-moth-flower-strip'],
  'tree-peach': ['rule-peach-brown-rot'],
  'vine-grape': ['rule-grape-downy-mildew', 'rule-grape-powdery-mildew', 'rule-lobesia-botrana'],
  // Blister blight (soybean intercrop) moved to research notes: the only source's accessible
  // abstract does not name blister blight, so the badge claim could not be verified.
  'tree-tea-sinensis': ['rule-tea-green-leafhopper', 'rule-tea-geometrid'],
  'tree-tea-assamica': ['rule-tea-green-leafhopper', 'rule-tea-geometrid']
};
for (const tree of STAR_TREES) {
  const actual = tree.vulnerabilities.en
    .map(p => resolvePestDefense(p, tree.id).ruleId)
    .filter((id): id is string => Boolean(id));
  const expected = EXPECTED[tree.id] || [];
  if (actual.join(',') !== expected.join(',')) {
    fail(`${tree.id}: badges [${actual.join(', ')}] but expected [${expected.join(', ')}]`);
  }
}

// 6. Star scoping: host-specific rules must not leak to other stars
const leakChecks: Array<[string, string]> = [
  ['tree-apricot', 'Monilinia Brown Rot'],
  ['tree-cherry', 'Monilinia Blossom Blight'],
  ['shrub-blueberry', 'Mummy Berry (Monilinia vaccinii-corymbosi)'],
  ['tree-quince', 'Powdery Mildew'],
  ['tree-walnut', 'Codling Moth (Cydia pomonella)']
];
for (const [treeId, pest] of leakChecks) {
  if (resolvePestDefense(pest, treeId).combatable) fail(`${treeId}: "${pest}" must not be combatable`);
}
if (resolvePestDefense('Codling Moth (Cydia pomonella)').combatable) {
  fail('Scoped rules must not match when no star plant is given');
}

// 7. Companion modal detail: returns tag + citations and only for the scoped star
const apple = STAR_TREES.find(t => t.id === 'tree-apple')!;
const walnut = STAR_TREES.find(t => t.id === 'tree-walnut')!;
const yarrow = GUILD_PLANTS.find(p => p.id === 'plant-yarrow')!;
const lavender = GUILD_PLANTS.find(p => p.id === 'plant-lavender')!;
const appleYarrow = getCompanionPestDefenseForTree(yarrow, apple);
if (appleYarrow.length !== 1 || appleYarrow[0].evidence !== 'field-proven' || appleYarrow[0].citations.length === 0) {
  fail('Yarrow on apple should show one field-proven codling moth defense with citations');
}
if (getCompanionPestDefenseForTree(yarrow, walnut).length !== 0) fail('Yarrow must not defend walnut (untested host)');
if (getCompanionPestDefenseForTree(lavender, apple).length !== 0) fail('Lavender must not show any defense (folklore)');

// 8. Climate zones: a key pest only counts as combatable in a zone where at least one of its
//    companions grows; otherwise the badge is greyed out. And no recommended companion may be
//    invisible in every zone of its star.
const ALL_ZONES = ['BOREAL', 'TEMPERATE', 'SUBTROPICAL', 'TROPICAL'] as const;
for (const star of STAR_TREES) {
  for (const zone of ALL_ZONES) {
    star.vulnerabilities.en.forEach((pest, i) => {
      const base = resolvePestDefense(pest, star.id);
      const zoned = resolvePestDefense(pest, star.id, zone);
      const zonedDe = resolvePestDefense(star.vulnerabilities.de[i], star.id, zone);
      const growing = base.companionPlantIds.filter(id => GUILD_PLANTS.find(p => p.id === id)!.climateZones.includes(zone));
      if (zoned.combatable !== growing.length > 0) fail(`${star.id}/${zone}: "${pest}" combatable=${zoned.combatable} but ${growing.length} companions grow there`);
      if (zoned.companionPlantIds.join() !== growing.join()) fail(`${star.id}/${zone}: "${pest}" lists companions that don't grow there`);
      if (zoned.combatable !== zonedDe.combatable) fail(`${star.id}/${zone}: DE/EN disagree for "${pest}"`);
    });
  }
}
const sinensis = STAR_TREES.find(t => t.id === 'tree-tea-sinensis')!;
const sicklepod = GUILD_PLANTS.find(p => p.id === 'plant-sicklepod')!;
if (resolvePestDefense('Tea Green Leafhopper (Empoasca onukii)', sinensis.id, 'TEMPERATE').combatable) {
  fail('Tea leafhopper must be greyed out in TEMPERATE (sicklepod does not grow there)');
}
if (!resolvePestDefense('Tea Green Leafhopper (Empoasca onukii)', sinensis.id, 'SUBTROPICAL').combatable) {
  fail('Tea leafhopper must be combatable in SUBTROPICAL');
}
if (getCompanionPestDefenseForTree(sicklepod, sinensis, 'TEMPERATE').length !== 0) {
  fail('Sicklepod modal must not claim a defense in TEMPERATE');
}
for (const star of STAR_TREES) {
  const recommended = new Set([
    ...star.recommendedCompanions,
    ...GUILD_PLANTS.filter(p => p.recommendedForTrees.includes(star.id)).map(p => p.id)
  ]);
  for (const pid of recommended) {
    const plant = GUILD_PLANTS.find(p => p.id === pid);
    if (plant && !star.climateZones.some(z => plant.climateZones.includes(z))) {
      fail(`${pid} is recommended for ${star.id} but never visible in its climate zones`);
    }
  }
}

// 9. Redundancy check must never flag a plant that fights a key pest of the selected star
for (const star of STAR_TREES) {
  const guild = star.recommendedCompanions
    .map(id => GUILD_PLANTS.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  for (const report of analyzePlantRedundancy(guild, star)) {
    if (getCompanionPestDefenseForTree(report.plant, star).length > 0) {
      fail(`${report.plant.id} fights a key pest of ${star.id} but is flagged as redundant`);
    }
  }
}
const appleGuild = apple.recommendedCompanions.map(id => GUILD_PLANTS.find(p => p.id === id)!).filter(Boolean);
const flaggedWithoutStar = analyzePlantRedundancy(appleGuild).map(r => r.plant.id);
const flaggedWithStar = analyzePlantRedundancy(appleGuild, apple).map(r => r.plant.id);
console.log(`Apple default guild redundancy: ${flaggedWithoutStar.length} flagged without star context, ${flaggedWithStar.length} with it.`);

// 9. Retired companions and engine consistency
for (const p of GUILD_PLANTS.filter(x => x.retired)) {
  if (p.recommendedForTrees.length > 0) fail(`retired ${p.id} still recommends star plants`);
  for (const t of STAR_TREES) if (t.recommendedCompanions.includes(p.id)) fail(`${t.id} still recommends retired ${p.id}`);
  for (const r of PEST_DEFENSE_RULES) if (r.companionPlantIds.includes(p.id)) fail(`${r.id} lists retired ${p.id}`);
}
for (const p of ACTIVE_GUILD_PLANTS) if (p.roles.length === 0) fail(`${p.id} has no guild role left`);
// Gap suggestions come from the data: every suggested plant is active and fills that role in that season.
for (const { role } of ALL_ROLES) {
  for (const { id: season } of PHENO_SEASONS) {
    for (const id of getGapCandidateIds(role, season)) {
      const plant = GUILD_PLANTS.find(p => p.id === id);
      if (!plant || plant.retired || !plantCoversRoleInSeason(plant, role, season)) {
        fail(`gap candidate ${id} does not fill ${role} in ${season}`);
      }
    }
  }
}
for (const star of STAR_TREES) {
  for (const size of [1, 3, 6]) {
    const guild = star.recommendedCompanions.slice(0, size).map(id => GUILD_PLANTS.find(p => p.id === id)!).filter(Boolean);
    for (const status of analyzeSeasonalRoleGaps(guild, star)) {
      for (const gap of status.gaps) {
        if (gap.suggestedPlantIds.length === 0) fail(`${star.id}: ${gap.role}/${gap.season} gap reported without any possible filler`);
        for (const id of gap.suggestedPlantIds) {
          const plant = GUILD_PLANTS.find(p => p.id === id);
          if (!plant || plant.retired || !plantCoversRoleInSeason(plant, gap.role, gap.season) || guild.some(g => g.id === id)) {
            fail(`${star.id}: gap suggestion ${id} invalid for ${gap.role}/${gap.season}`);
          }
          if (star.jugloneProducer && plant?.jugloneTolerance === 'SENSITIVE') fail(`${star.id}: juglone-sensitive gap suggestion ${id}`);
        }
      }
    }
  }
}
// A star plant's own roles equal the evidence-checked roles of its companion entry (same species).
for (const star of STAR_TREES) {
  const twin = ACTIVE_GUILD_PLANTS.find(p => p.botanicalName === star.botanicalName);
  const dual = DUAL_ROLE_STAR_TREE_MAP[star.id] || [];
  if (JSON.stringify(dual) !== JSON.stringify(twin ? twin.roles : [])) {
    fail(`${star.id}: star roles [${dual}] differ from companion ${twin?.id} [${twin?.roles}]`);
  }
}
for (const id of Object.keys(DUAL_ROLE_STAR_TREE_MAP)) if (!starIds.has(id)) fail(`dual-role entry for unknown star ${id}`);

const badgeCount = STAR_TREES.reduce(
  (n, t) => n + t.vulnerabilities.en.filter(p => resolvePestDefense(p, t.id).combatable).length,
  0
);
console.log(`Pest rules: ${PEST_DEFENSE_RULES.length} badge rules, ${PEST_RESEARCH_NOTES.length} research notes, ${badgeCount} badges across ${STAR_TREES.length} star plants.`);

if (failures > 0) {
  console.error(`\n${failures} pest test(s) failed.`);
  process.exit(1);
}
console.log('pests: all checks passed');
