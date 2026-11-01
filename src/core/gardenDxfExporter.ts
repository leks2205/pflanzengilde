import { Attrib, DxfWriter, LWPolylineFlags, SeqEnd, TextHorizontalAlignment, TextVerticalAlignment, Units, point3d } from '@tarikjabiri/dxf';
import { GardenDrawing, DrawingShape, DrawingSpecies, dxfLayerNames } from './gardenDrawing';
import { Pt } from './geometry2d';
import { t, formatNumber } from '../i18n/translations';

/**
 * DXF (AutoCAD 2007 format, UTF-8) at true scale: 1 drawing unit = 1 metre ($INSUNITS = 6),
 * X east, Y north, origin = south-west corner of the plan. Opens in AutoCAD, Vectorworks,
 * Allplan, ArchiCAD, BricsCAD, QCAD/LibreCAD and QGIS.
 *
 * Every species is a block with attributes (CODE, NAME, BOTANICAL, HEIGHT_M, WIDTH_M) so CAD
 * programs can build a plant schedule from the drawing. Raised beds carry their wall height as
 * thickness, so they extrude in 3D views.
 */

const ACI = { RED: 1, YELLOW: 2, GREEN: 3, CYAN: 4, BLUE: 5, MAGENTA: 6, WHITE: 7, DARK_GREY: 8, LIGHT_GREY: 9 };

function rgbInt(hex: string, fallback = 0x16a34a): string {
  let clean = (hex || '').replace('#', '').trim();
  if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
  const n = parseInt(clean, 16);
  return String(clean.length === 6 && !isNaN(n) ? n : fallback);
}

export const blockName = (sp: DrawingSpecies) => `PG_${sp.code}`;

export function generateGardenDxf(drawing: GardenDrawing): string {
  const lang = drawing.language;
  const tr = t(lang);
  const L = dxfLayerNames(lang);
  const fmt = (v: number, d = 2) => formatNumber(v, d, lang);
  const dxf = new DxfWriter();
  dxf.setUnits(Units.Meters);

  dxf.addLayer(L.grid, ACI.LIGHT_GREY, 'CONTINUOUS');
  dxf.addLayer(L.outline, ACI.WHITE, 'CONTINUOUS');
  dxf.addLayer(L.beds, ACI.RED, 'CONTINUOUS');
  dxf.addLayer(L.trunks, ACI.DARK_GREY, 'CONTINUOUS');
  dxf.addLayer(L.canopies, ACI.GREEN, 'CONTINUOUS');
  dxf.addLayer(L.plants, ACI.CYAN, 'CONTINUOUS');
  dxf.addLayer(L.groundCovers, ACI.GREEN, 'CONTINUOUS');
  dxf.addLayer(L.labels, ACI.WHITE, 'CONTINUOUS');
  dxf.addLayer(L.dimensions, ACI.BLUE, 'CONTINUOUS');
  dxf.addLayer(L.legend, ACI.WHITE, 'CONTINUOUS');

  const W = drawing.widthM;
  const H = drawing.heightM;
  const textH = Math.max(0.15, Math.min(0.6, Math.max(W, H) / 120));
  const center = { horizontalAlignment: TextHorizontalAlignment.Center, verticalAlignment: TextVerticalAlignment.Middle };

  const closedPoly = (pts: Pt[], layerName: string, extra: { trueColor?: string; thickness?: number } = {}) =>
    dxf.addLWPolyline(pts.map(([x, y]) => ({ point: { x, y } })), { flags: LWPolylineFlags.Closed, layerName, ...extra });
  const shape = (s: DrawingShape, layerName: string, extra: { trueColor?: string; thickness?: number } = {}) => {
    if (s.kind === 'CIRCLE') dxf.addCircle(point3d(s.cx, s.cy, 0), s.r, { layerName, ...extra });
    else closedPoly(s.points, layerName, extra);
  };
  const centerText = (x: number, y: number, h: number, value: string, layerName: string) =>
    dxf.addText(point3d(x, y, 0), h, value, { layerName, ...center, secondAlignmentPoint: point3d(x, y, 0) });

  // Grid: 1 m (5 m for large plans), with metre labels along the south and west edges
  const step = Math.max(W, H) > 60 ? 5 : 1;
  for (let x = 0; x <= W + 1e-9; x += step) dxf.addLine(point3d(x, 0, 0), point3d(x, H, 0), { layerName: L.grid });
  for (let y = 0; y <= H + 1e-9; y += step) dxf.addLine(point3d(0, y, 0), point3d(W, y, 0), { layerName: L.grid });
  const labelStep = step * (Math.max(W, H) > 30 ? 5 : 1);
  for (let x = 0; x <= W + 1e-9; x += labelStep) centerText(x, -textH * 1.2, textH * 0.8, `${x}`, L.grid);
  for (let y = 0; y <= H + 1e-9; y += labelStep) centerText(-textH * 1.5, y, textH * 0.8, `${y}`, L.grid);

  // Blocks: one per species. Entities on layer 0 take the layer of the INSERT.
  const attrTags = ['CODE', 'NAME', 'BOTANICAL', 'HEIGHT_M', 'WIDTH_M'] as const;
  for (const sp of drawing.species) {
    if (sp.kind === 'GROUND_COVER') continue;
    const b = dxf.addBlock(blockName(sp));
    if (sp.kind === 'TREE') {
      b.addCircle(point3d(0, 0, 0), 0.15, { layerName: '0' });
      b.addLine(point3d(-0.25, 0, 0), point3d(0.25, 0, 0), { layerName: '0' });
      b.addLine(point3d(0, -0.25, 0), point3d(0, 0.25, 0), { layerName: '0' });
    } else {
      b.addCircle(point3d(0, 0, 0), Math.max(0.05, sp.widthM / 2), { layerName: '0', trueColor: rgbInt(sp.color) });
      b.addCircle(point3d(0, 0, 0), 0.03, { layerName: '0' });
    }
    attrTags.forEach((tag, i) => b.addAttdef(point3d(0, -i * textH, 0), textH * (i === 0 ? 0.9 : 0.7), tag, '', { layerName: '0' }));
  }

  const addInsert = (sp: DrawingSpecies, x: number, y: number, layerName: string) => {
    const ins = dxf.addInsert(blockName(sp), point3d(x, y, 0), { layerName });
    const values: Record<(typeof attrTags)[number], string> = {
      CODE: sp.code, NAME: sp.name, BOTANICAL: sp.botanicalName,
      HEIGHT_M: sp.heightM != null ? sp.heightM.toFixed(2) : '', WIDTH_M: sp.widthM.toFixed(2),
    };
    // Only the code is shown on the plan; the rest is data for schedules (ATTEXT / data extraction).
    // Written by hand because DxfWriter.addAttrib() emits a SEQEND after every attribute and
    // leaves the ATTRIBs owned by model space, which CAD programs drop as stray entities.
    ins.attributesFollowFlag = 1;
    attrTags.forEach((tag, i) => {
      const attrib = dxf.modelSpace.addEntity(new Attrib(point3d(x + 0.2, y + 0.2 - i * textH, 0), textH * (i === 0 ? 0.9 : 0.7), tag, values[tag],
        { layerName, visible: tag === 'CODE' && sp.kind === 'PLANT' }));
      attrib.ownerBlockRecord = ins.handle;
    });
    const seqEnd = dxf.modelSpace.addEntity(new SeqEnd());
    seqEnd.ownerBlockRecord = ins.handle;
    seqEnd.layerName = layerName;
  };

  // Garden outline and raised beds (wall height as thickness)
  if (drawing.outline) shape(drawing.outline, L.outline);
  for (const bed of drawing.beds) {
    shape(bed.shape, L.beds, { thickness: bed.heightM });
    const pts = bed.shape.kind === 'CIRCLE' ? [[bed.shape.cx, bed.shape.cy] as Pt] : bed.shape.points;
    const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
    centerText(cx, cy, textH, `${bed.name} (${Math.round(bed.heightM * 100)} cm)`, L.labels);
  }

  // Ground covers: closed outlines per ring (holes are separate rings), bulb drifts as small circles
  for (const gc of drawing.groundCovers) {
    const color = rgbInt(gc.species.color);
    for (const ring of gc.rings) closedPoly(ring, L.groundCovers, { trueColor: color });
    for (const [x, y] of gc.dots) dxf.addCircle(point3d(x, y, 0), 0.05, { layerName: L.groundCovers, trueColor: color });
    const outer = gc.polygons[0]?.[0];
    if (outer) {
      const [lx, ly] = outer.reduce((best, p) => (p[1] > best[1] ? p : best), outer[0]);
      centerText(lx, ly + textH * 0.8, textH * 0.8, gc.species.code, L.labels);
    }
  }

  // Trees: canopy circle + trunk block + label
  for (const tree of drawing.trees) {
    dxf.addCircle(point3d(tree.x, tree.y, 0), tree.canopyRadiusM, { layerName: L.canopies, trueColor: rgbInt(tree.species.color) });
    addInsert(tree.species, tree.x, tree.y, L.trunks);
    centerText(tree.x, tree.y - 0.45 - textH * 0.6, textH, `${tree.species.code} ${tree.label}`, L.labels);
  }

  // Companion plants
  for (const p of drawing.plants) addInsert(p.species, p.x, p.y, L.plants);

  // Distances between trees
  for (const d of drawing.dimensions) {
    dxf.addLine(point3d(d.a[0], d.a[1], 0), point3d(d.b[0], d.b[1], 0), { layerName: L.dimensions });
    const ang = (Math.atan2(d.b[1] - d.a[1], d.b[0] - d.a[0]) * 180) / Math.PI;
    const rot = ang > 90 || ang < -90 ? ang + 180 : ang;
    const mx = (d.a[0] + d.b[0]) / 2;
    const my = (d.a[1] + d.b[1]) / 2;
    dxf.addText(point3d(mx, my + textH * 0.3, 0), textH * 0.8, `${fmt(d.distanceM)} m`,
      { layerName: L.dimensions, rotation: rot, horizontalAlignment: TextHorizontalAlignment.Center,
        verticalAlignment: TextVerticalAlignment.Bottom, secondAlignmentPoint: point3d(mx, my + textH * 0.3, 0) });
  }

  // North arrow (top right, outside the plan)
  const nx = W + 2;
  const ny = H - 1;
  closedPoly([[nx, ny + 1], [nx - 0.35, ny - 0.2], [nx, ny + 0.1], [nx + 0.35, ny - 0.2]], L.legend);
  centerText(nx, ny + 1.4, textH * 1.4, 'N', L.legend);

  // Legend / plant schedule to the right of the plan
  const lx = W + 3.5;
  let ly = H - 0.2;
  const line = (s: string, h = textH) => {
    dxf.addText(point3d(lx, ly, 0), h, s, { layerName: L.legend });
    ly -= h * 1.6;
  };
  line(drawing.name, textH * 1.6);
  line(tr.cadLegendUnits);
  line(tr.cadLegendOrigin);
  line(tr.cadLegendSize.replace('{w}', fmt(W, 0)).replace('{h}', fmt(H, 0)));
  ly -= textH;
  line(tr.cadLegendSchedule, textH * 1.2);
  for (const sp of drawing.species) {
    const qty = sp.kind === 'GROUND_COVER' && sp.areaM2 != null ? `${fmt(sp.areaM2, 1)} m²` : `${sp.count}×`;
    line(`${sp.code}  ${sp.name} (${sp.botanicalName})  ${qty}`);
  }
  if (drawing.beds.length > 0) {
    ly -= textH;
    for (const bed of drawing.beds) line(`${bed.name}: ${fmt(bed.areaM2, 1)} m², ${Math.round(bed.heightM * 100)} cm`);
  }
  ly -= textH;
  line('pflanzengilde.de', textH * 0.8);

  dxf.setVariable('$EXTMIN', { 10: -2, 20: Math.min(-2, ly - 1), 30: 0 });
  dxf.setVariable('$EXTMAX', { 10: W + 25, 20: H + 3, 30: 0 });
  return dxf.stringify();
}
