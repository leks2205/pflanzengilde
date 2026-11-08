/**
 * Lists every inline { en, de } string in the source tree (outside src/i18n) so the
 * Norwegian overlay in src/i18n/nb-data can be checked for gaps.
 *
 *   npx tsx scripts/extract_localized.ts            -> prints missing entries as JSON
 *   npx tsx scripts/extract_localized.ts --all      -> prints all entries
 *   npx tsx scripts/extract_localized.ts --stats    -> counts only
 */
import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
import { locKey } from '../src/i18n/locKey';
import { NB_DATA } from '../src/i18n/nb-data';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'src');

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return d.name === 'i18n' ? [] : walk(p);
    return /\.tsx?$/.test(d.name) ? [p] : [];
  });
}

function literalText(n: ts.Expression | undefined): string | null {
  if (!n) return null;
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) return n.text;
  return null;
}

const entries = new Map<string, { en: string; file: string }>();
let skippedDynamic = 0;

for (const file of walk(ROOT)) {
  const text = fs.readFileSync(file, 'utf8');
  const src = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  // Local helpers such as `const L = (en: string, de: string) => ({ en, de })`: name -> index of the English argument
  const helpers = new Map<string, number>();
  for (const m of text.matchAll(/const (\w+) = \((en|de): string, (en|de): string/g)) helpers.set(m[1], m[2] === 'en' ? 0 : 1);
  const visit = (node: ts.Node) => {
    if (ts.isObjectLiteralExpression(node)) {
      const props = new Map<string, ts.Expression>();
      for (const p of node.properties) {
        if (ts.isPropertyAssignment(p) && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name))) {
          props.set(p.name.text, p.initializer);
        }
      }
      const en = props.get('en');
      if (en && props.has('de')) {
        const texts: (string | null)[] = ts.isArrayLiteralExpression(en)
          ? en.elements.map(e => literalText(e as ts.Expression))
          : [literalText(en)];
        for (const t of texts) {
          if (t === null) { skippedDynamic++; continue; }
          if (!t.trim()) continue;
          const k = locKey(t);
          if (!entries.has(k)) entries.set(k, { en: t, file: path.relative(ROOT, file) });
        }
      }
    }
    // Calls of those helpers, e.g. L('english', 'deutsch')
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && helpers.has(node.expression.text) && node.arguments.length >= 2) {
      const enArg = node.arguments[helpers.get(node.expression.text)!];
      const t = literalText(enArg);
      if (t === null) skippedDynamic++;
      else if (t.trim()) {
        const k = locKey(t);
        if (!entries.has(k)) entries.set(k, { en: t, file: path.relative(ROOT, file) });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(src);
}

const args = process.argv.slice(2);
const all = [...entries.entries()];
const missing = all.filter(([k]) => !(k in NB_DATA));
if (args.includes('--stats')) {
  console.log(JSON.stringify({ total: all.length, translated: all.length - missing.length, missing: missing.length, skippedDynamic }));
} else {
  const list = args.includes('--all') ? all : missing;
  const fileFilter = args.find(a => a.startsWith('--file='))?.slice(7);
  const out: Record<string, string> = {};
  for (const [k, v] of list) if (!fileFilter || v.file.includes(fileFilter)) out[k] = v.en;
  console.log(JSON.stringify(out, null, 1));
}
