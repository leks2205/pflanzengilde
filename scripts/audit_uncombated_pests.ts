import { STAR_TREES } from '../src/data/starTrees';
import { resolvePestDefense } from '../src/core/pestCompanionEngine';

console.log('=== UNCOMBATED PESTS AUDIT ===');
const uncombated: Array<{ treeId: string; treeName: string; de: string; en: string }> = [];

for (const tree of STAR_TREES) {
  const deList = tree.vulnerabilities?.de || [];
  const enList = tree.vulnerabilities?.en || [];
  const max = Math.max(deList.length, enList.length);
  for (let i = 0; i < max; i++) {
    const de = deList[i] || '';
    const en = enList[i] || '';
    const resDe = resolvePestDefense(de, tree.id);
    const resEn = resolvePestDefense(en, tree.id);
    if (!resDe.combatable && !resEn.combatable) {
      uncombated.push({
        treeId: tree.id,
        treeName: tree.commonName.en,
        de,
        en
      });
    }
  }
}

for (const p of uncombated) {
  console.log(`[${p.treeId}] ${p.treeName} -> DE: "${p.de}" | EN: "${p.en}"`);
}
console.log(`Total uncombated pests: ${uncombated.length}`);
