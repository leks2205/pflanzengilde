import { GardenDrawing, DrawingShape, dxfLayerNames } from './gardenDrawing';
import { Pt } from './geometry2d';
import { t, formatNumber } from '../i18n/translations';

/**
 * SVG at a true, printable scale (1:50 … 1:1000): width/height are in millimetres and one SVG
 * user unit is 1 mm on paper, so printing at 100 % reproduces the scale. Top-level groups are
 * Inkscape layers (Illustrator and Affinity import them as layers/groups).
 */

export const SVG_SCALES = [50, 100, 200, 250, 500, 1000] as const;

/** Largest paper the plan should fit on (A0 landscape, mm). */
const MAX_PAPER = { w: 1189, h: 841 };
const MARGIN = 15;
const LEGEND_W = 95;
const TITLE_H = 22;

export function chooseSvgScale(widthM: number, heightM: number): number {
  for (const s of SVG_SCALES) {
    const k = 1000 / s;
    if (widthM * k + LEGEND_W + 3 * MARGIN <= MAX_PAPER.w && heightM * k + TITLE_H + 2 * MARGIN <= MAX_PAPER.h) return s;
  }
  return SVG_SCALES[SVG_SCALES.length - 1];
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const n = (v: number) => (Math.round(v * 100) / 100).toString();

function safeColor(c: string, fallback = '#16a34a'): string {
  return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(c || '') ? c : fallback;
}

export function generateGardenSvg(drawing: GardenDrawing, scale = chooseSvgScale(drawing.widthM, drawing.heightM)): string {
  const lang = drawing.language;
  const tr = t(lang);
  const L = dxfLayerNames(lang);
  const fmt = (v: number, d = 2) => formatNumber(v, d, lang);
  const k = 1000 / scale; // mm on paper per metre
  const W = drawing.widthM;
  const H = drawing.heightM;
  const planW = W * k;
  const planH = H * k;
  const ox = MARGIN;
  const oy = MARGIN + TITLE_H;
  const legendX = ox + planW + MARGIN;
  const speciesRows = drawing.species.length + drawing.beds.length;
  const legendH = 60 + speciesRows * 5.2;
  const paperW = Math.ceil(legendX + LEGEND_W + MARGIN);
  const paperH = Math.ceil(Math.max(oy + planH + MARGIN + 8, oy + legendH + MARGIN));

  const X = (x: number) => n(ox + x * k);
  const Y = (y: number) => n(oy + (H - y) * k);
  const pts = (p: Pt[]) => p.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ');
  const ringPath = (rings: Pt[][]) => rings.map(r => `M${pts(r).replace(/ /g, 'L')}Z`).join('');
  const shapeEl = (s: DrawingShape, attrs: string) =>
    s.kind === 'CIRCLE'
      ? `<circle cx="${X(s.cx)}" cy="${Y(s.cy)}" r="${n(s.r * k)}" ${attrs}/>`
      : `<polygon points="${pts(s.points)}" ${attrs}/>`;
  const fs = Math.max(1.8, Math.min(3.2, 0.25 * k)); // label size in mm on paper
  const layer = (id: string, label: string, body: string[]) =>
    `<g id="${id}" inkscape:groupmode="layer" inkscape:label="${esc(label)}">\n${body.join('\n')}\n</g>`;

  // Grid (1 m, or 5 m when the cells would be smaller than 4 mm)
  const step = k >= 4 ? 1 : 5;
  const grid: string[] = [];
  for (let x = 0; x <= W + 1e-9; x += step) grid.push(`<line x1="${X(x)}" y1="${Y(0)}" x2="${X(x)}" y2="${Y(H)}"/>`);
  for (let y = 0; y <= H + 1e-9; y += step) grid.push(`<line x1="${X(0)}" y1="${Y(y)}" x2="${X(W)}" y2="${Y(y)}"/>`);
  const labelStep = step * (W * k / step > 300 ? 5 : 1) * (k < 8 ? 5 : 1);
  for (let x = 0; x <= W + 1e-9; x += labelStep) grid.push(`<text x="${X(x)}" y="${n(oy + planH + 4)}" text-anchor="middle" stroke="none" fill="#78716c" font-size="2.4">${x}</text>`);
  for (let y = 0; y <= H + 1e-9; y += labelStep) grid.push(`<text x="${n(ox - 1.5)}" y="${Y(y)}" text-anchor="end" dominant-baseline="middle" stroke="none" fill="#78716c" font-size="2.4">${y}</text>`);

  const outline = drawing.outline
    ? [shapeEl(drawing.outline, 'fill="none" stroke="#1c1917" stroke-width="0.5" stroke-dasharray="3 1.8"')]
    : [];

  const beds = drawing.beds.flatMap(bed => {
    const c = bed.shape.kind === 'CIRCLE' ? [bed.shape.cx, bed.shape.cy]
      : [bed.shape.points.reduce((s, p) => s + p[0], 0) / bed.shape.points.length, bed.shape.points.reduce((s, p) => s + p[1], 0) / bed.shape.points.length];
    return [
      shapeEl(bed.shape, 'fill="#92400e" fill-opacity="0.25" stroke="#78350f" stroke-width="0.4"'),
      `<text x="${X(c[0])}" y="${Y(c[1])}" text-anchor="middle" dominant-baseline="middle" font-size="${n(fs)}" font-weight="bold" fill="#78350f">${esc(`${bed.name} (${Math.round(bed.heightM * 100)} cm)`)}</text>`,
    ];
  });

  const covers = drawing.groundCovers.flatMap(gc => {
    const color = safeColor(gc.species.color);
    const out = [`<path d="${ringPath(gc.rings)}" fill="${color}" fill-opacity="${n(Math.min(0.5, gc.opacity + 0.06))}" fill-rule="evenodd" stroke="${color}" stroke-width="0.25"><title>${esc(`${gc.species.code} ${gc.species.name} (${gc.species.botanicalName})`)}</title></path>`];
    for (const [x, y] of gc.dots) out.push(`<circle cx="${X(x)}" cy="${Y(y)}" r="${n(Math.max(0.3, 0.05 * k))}" fill="${color}" fill-opacity="0.8"/>`);
    const outer = gc.polygons[0]?.[0];
    if (outer) {
      const top = outer.reduce((b, p) => (p[1] > b[1] ? p : b), outer[0]);
      out.push(`<text x="${X(top[0])}" y="${n(Number(Y(top[1])) - 1)}" text-anchor="middle" font-size="${n(fs * 0.9)}" fill="#14532d">${gc.species.code}</text>`);
    }
    return out;
  });

  const canopies = drawing.trees.map(tree => {
    const color = safeColor(tree.species.color);
    return `<circle cx="${X(tree.x)}" cy="${Y(tree.y)}" r="${n(tree.canopyRadiusM * k)}" fill="${color}" fill-opacity="0.12" stroke="${color}" stroke-width="0.35" stroke-dasharray="2 1.2"><title>${esc(`${tree.species.code} ${tree.label} – ${tr.cadCanopyDiameter} ${fmt(tree.canopyRadiusM * 2, 1)} m`)}</title></circle>`;
  });

  const trunks = drawing.trees.flatMap(tree => [
    `<circle cx="${X(tree.x)}" cy="${Y(tree.y)}" r="${n(Math.max(0.8, 0.15 * k))}" fill="#57534e" stroke="#ffffff" stroke-width="0.3"/>`,
  ]);

  const plants = drawing.plants.map(p => {
    const color = safeColor(p.species.color);
    return `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="${n(Math.max(0.6, p.radiusM * k))}" fill="${color}" fill-opacity="${p.shared ? 0.6 : 0.35}" stroke="${color}" stroke-width="0.25"><title>${esc(`${p.species.code} ${p.species.name} (${p.species.botanicalName})`)}</title></circle>`;
  });

  const labels = [
    ...drawing.trees.map(tree => `<text x="${X(tree.x)}" y="${n(Number(Y(tree.y)) + Math.max(2.5, 0.15 * k) + fs)}" text-anchor="middle" font-size="${n(fs)}" font-weight="bold" fill="#1c1917">${esc(`${tree.species.code} ${tree.label}`)}</text>`),
    ...drawing.plants.map(p => `<text x="${n(Number(X(p.x)) + Math.max(0.6, p.radiusM * k) + 0.4)}" y="${Y(p.y)}" dominant-baseline="middle" font-size="${n(fs * 0.8)}" fill="#44403c">${p.species.code}</text>`),
  ];

  const dims = drawing.dimensions.flatMap(d => {
    const mx = (Number(X(d.a[0])) + Number(X(d.b[0]))) / 2;
    const my = (Number(Y(d.a[1])) + Number(Y(d.b[1]))) / 2;
    let ang = (Math.atan2(Number(Y(d.b[1])) - Number(Y(d.a[1])), Number(X(d.b[0])) - Number(X(d.a[0]))) * 180) / Math.PI;
    if (ang > 90) ang -= 180;
    if (ang < -90) ang += 180;
    return [
      `<line x1="${X(d.a[0])}" y1="${Y(d.a[1])}" x2="${X(d.b[0])}" y2="${Y(d.b[1])}" stroke="#475569" stroke-width="0.25" stroke-dasharray="1 0.8"/>`,
      `<text x="${n(mx)}" y="${n(my - 0.8)}" transform="rotate(${n(ang)} ${n(mx)} ${n(my)})" text-anchor="middle" font-size="${n(fs * 0.85)}" font-weight="bold" fill="#334155">${fmt(d.distanceM)} m</text>`,
    ];
  });

  // Title, north arrow, scale bar and plant schedule
  const legend: string[] = [];
  legend.push(`<text x="${ox}" y="${MARGIN + 7}" font-size="7" font-weight="bold" fill="#14532d">${esc(drawing.name)}</text>`);
  legend.push(`<text x="${ox}" y="${MARGIN + 14}" font-size="3.2" fill="#57534e">${esc(tr.cadSvgSubtitle.replace('{scale}', `1:${scale}`).replace('{w}', fmt(W, 0)).replace('{h}', fmt(H, 0)))}</text>`);
  const nx = legendX + 8;
  const ny = oy + 4;
  legend.push(`<path d="M${n(nx)},${n(ny)} L${n(nx - 3.5)},${n(ny + 11)} L${n(nx)},${n(ny + 8)} L${n(nx + 3.5)},${n(ny + 11)} Z" fill="#1c1917"/>`);
  legend.push(`<text x="${n(nx)}" y="${n(ny + 16)}" text-anchor="middle" font-size="4" font-weight="bold">N</text>`);
  // Scale bar: largest of 1/2/5/10/20/50 m that fits in 60 mm
  const barM = [50, 20, 10, 5, 2, 1].find(m => m * k <= 60) ?? 1;
  const bx = legendX + 20;
  const by = ny + 10;
  legend.push(`<rect x="${n(bx)}" y="${n(by)}" width="${n(barM * k / 2)}" height="1.6" fill="#1c1917"/>`);
  legend.push(`<rect x="${n(bx + barM * k / 2)}" y="${n(by)}" width="${n(barM * k / 2)}" height="1.6" fill="#ffffff" stroke="#1c1917" stroke-width="0.3"/>`);
  legend.push(`<text x="${n(bx)}" y="${n(by - 1.5)}" font-size="2.6">0</text>`);
  legend.push(`<text x="${n(bx + barM * k)}" y="${n(by - 1.5)}" font-size="2.6" text-anchor="end">${barM} m</text>`);
  legend.push(`<text x="${n(bx)}" y="${n(by + 5.5)}" font-size="2.6" fill="#57534e">${tr.cadScale} 1:${scale}</text>`);
  let ly = ny + 28;
  legend.push(`<text x="${n(legendX)}" y="${n(ly)}" font-size="3.6" font-weight="bold">${esc(tr.cadLegendSchedule)}</text>`);
  ly += 6;
  for (const sp of drawing.species) {
    const color = safeColor(sp.color);
    const qty = sp.kind === 'GROUND_COVER' && sp.areaM2 != null ? `${fmt(sp.areaM2, 1)} m²` : `${sp.count}×`;
    legend.push(`<circle cx="${n(legendX + 1.6)}" cy="${n(ly - 1)}" r="1.6" fill="${color}" fill-opacity="${sp.kind === 'TREE' ? 0.3 : 0.6}" stroke="${color}" stroke-width="0.3"/>`);
    legend.push(`<text x="${n(legendX + 5)}" y="${n(ly)}" font-size="2.7"><tspan font-weight="bold">${sp.code}</tspan> ${esc(sp.name)} <tspan font-style="italic" fill="#57534e">${esc(sp.botanicalName)}</tspan> · ${qty}</text>`);
    ly += 5.2;
  }
  for (const bed of drawing.beds) {
    legend.push(`<rect x="${n(legendX)}" y="${n(ly - 2.6)}" width="3.2" height="3.2" fill="#92400e" fill-opacity="0.3" stroke="#78350f" stroke-width="0.3"/>`);
    legend.push(`<text x="${n(legendX + 5)}" y="${n(ly)}" font-size="2.7">${esc(`${bed.name}: ${fmt(bed.areaM2, 1)} m², ${Math.round(bed.heightM * 100)} cm`)}</text>`);
    ly += 5.2;
  }
  ly += 3;
  legend.push(`<text x="${n(legendX)}" y="${n(ly)}" font-size="2.4" fill="#78716c">${esc(tr.cadLegendOrigin)}</text>`);
  legend.push(`<text x="${n(legendX)}" y="${n(ly + 4)}" font-size="2.4" fill="#78716c">pflanzengilde.de</text>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="${paperW}mm" height="${paperH}mm" viewBox="0 0 ${paperW} ${paperH}" font-family="Helvetica, Arial, sans-serif">
<title>${esc(drawing.name)} – 1:${scale}</title>
<desc>${esc(tr.cadSvgDesc.replace('{scale}', `1:${scale}`))}</desc>
<rect width="100%" height="100%" fill="#ffffff"/>
${layer('pg-grid', L.grid, [`<g stroke="#e7e5e4" stroke-width="0.15">`, ...grid, `</g>`])}
${layer('pg-outline', L.outline, outline)}
${layer('pg-beds', L.beds, beds)}
${layer('pg-ground-covers', L.groundCovers, covers)}
${layer('pg-canopies', L.canopies, canopies)}
${layer('pg-plants', L.plants, plants)}
${layer('pg-trunks', L.trunks, trunks)}
${layer('pg-dimensions', L.dimensions, dims)}
${layer('pg-labels', L.labels, labels)}
${layer('pg-legend', L.legend, legend)}
</svg>
`;
}
