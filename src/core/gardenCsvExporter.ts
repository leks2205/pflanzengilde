import { GardenDrawing } from './gardenDrawing';
import { t, formatNumber } from '../i18n/translations';

/**
 * Plant list (CSV) for tenders, nurseries and spreadsheets: one row per tree and plant with plan
 * coordinates in metres, one row per ground-cover species with its area, one row per raised bed.
 * German files use ";" and decimal commas (what German Excel expects); English uses "," and points.
 * Starts with a UTF-8 BOM so Excel shows umlauts.
 */
export function generateGardenCsv(drawing: GardenDrawing): string {
  const lang = drawing.language;
  const tr = t(lang);
  const sep = lang === 'de' ? ';' : ',';
  const num = (v: number | null | undefined, d = 2) => (v == null || !isFinite(v) ? '' : formatNumber(v, d, lang));
  const cell = (v: string | number) => {
    const s = String(v);
    return s.includes(sep) || /["\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const light = (l: string) => (l === 'FULL_SUN' ? tr.cadLightSun : l === 'PARTIAL_SUN' ? tr.cadLightPartial : tr.cadLightShade);

  const header = [
    tr.cadCsvNo, tr.cadCsvCode, tr.cadCsvType, tr.cadCsvName, tr.cadCsvBotanical, tr.cadCsvQuantity, tr.cadCsvUnit,
    tr.cadCsvX, tr.cadCsvY, tr.cadCsvHeight, tr.cadCsvWidth, tr.cadCsvLayer, tr.cadCsvRoles, tr.cadCsvServes, tr.cadCsvNotes,
  ];
  const rows: Array<Array<string | number>> = [header];
  const treeRefByNo = new Map(drawing.trees.map(tree => [tree.no, tree.ref]));

  for (const tree of drawing.trees) {
    const sp = tree.species;
    rows.push([tree.ref, sp.code, tr.cadTypeTree, tree.label, sp.botanicalName, 1, tr.cadUnitPiece,
      num(tree.x), num(tree.y), num(sp.heightM, 1), num(sp.widthM, 1), sp.layer, '', '', '']);
  }
  for (const p of drawing.plants) {
    const sp = p.species;
    const notes = [light(p.light), p.shared ? tr.cadNoteShared : '', p.keyPestDefense ? tr.cadNotePest : ''].filter(Boolean).join(', ');
    rows.push([p.ref, sp.code, tr.cadTypePlant, sp.name, sp.botanicalName, 1, tr.cadUnitPiece,
      num(p.x), num(p.y), num(sp.heightM, 2), num(sp.widthM, 2), sp.layer, sp.roles,
      p.servesTreeNos.map(no => treeRefByNo.get(no) ?? String(no)).join(' '), notes]);
  }
  for (const gc of drawing.groundCovers) {
    const sp = gc.species;
    rows.push([sp.code, sp.code, tr.cadTypeGroundCover, sp.name, sp.botanicalName, num(sp.areaM2 ?? 0, 2), 'm²',
      '', '', num(sp.heightM, 2), num(sp.widthM, 2), sp.layer, sp.roles, '', tr.cadNoteGroundCover]);
  }
  for (const bed of drawing.beds) {
    const pts = bed.shape.kind === 'CIRCLE' ? [[bed.shape.cx, bed.shape.cy]] : bed.shape.points;
    const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
    rows.push([`HB-${bed.no}`, '', tr.cadTypeBed, bed.name, '', num(bed.areaM2, 2), 'm²', num(cx), num(cy),
      num(bed.heightM, 2), '', '', '', '', '']);
  }
  if (drawing.outline) {
    rows.push(['', '', tr.cadTypeOutline, drawing.name, '', num(drawing.outline.areaM2, 2), 'm²', '', '', '', '', '', '', '', tr.cadLegendOrigin]);
  }

  return '\uFEFF' + rows.map(r => r.map(cell).join(sep)).join('\r\n') + '\r\n';
}
