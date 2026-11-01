import { GardenShape, GardenState } from '../types/garden';
import { GuildPlant, Language, getLoc } from '../types/guild';
import { CoverShape, buildGardenCoverInput, computeGroundCovers } from './groundCoverEngine';
import { getGroundCoverSpec, isAreaPlant } from '../data/groundCoverSpecs';
import { pointInPolygon, pointInShape, shapeToPolygon, Pt } from './geometry2d';
import { compartmentAt } from './compartments';
import { bedLabel } from './gardenSite';
import { translateLayer, translateRole } from '../i18n/translations';

/**
 * Format-neutral drawing of the garden grid for the CAD (DXF), SVG, CSV and GeoJSON exports.
 *
 * Plan coordinates are metres with X east and Y NORTH (CAD/GIS convention; the grid itself uses
 * y south). The origin (0, 0) is the south-west corner of the plan, rounded outwards to whole metres
 * with a 1 m margin, so every coordinate is positive.
 */

export type DrawingShape =
  | { kind: 'POLYGON'; points: Pt[] }
  | { kind: 'CIRCLE'; cx: number; cy: number; r: number };

export interface DrawingSpecies {
  /** Plan key, e.g. "B1" (trees, de) / "T1" (en), "P3", "G2" (ground covers). */
  code: string;
  kind: 'TREE' | 'PLANT' | 'GROUND_COVER';
  plantId: string;
  name: string;
  botanicalName: string;
  heightM: number | null;
  /** Canopy diameter (trees) or spread (plants). */
  widthM: number;
  layer: string;
  roles: string;
  color: string;
  count: number;
  /** Ground covers only: covered area in m² (holes subtracted). */
  areaM2?: number;
}

export interface DrawingTree {
  no: number;
  /** Instance key: species code + running number within the species, e.g. "B1-2". */
  ref: string;
  instanceId: string;
  species: DrawingSpecies;
  label: string;
  x: number;
  y: number;
  canopyRadiusM: number;
  /** Grid coordinates (x east, y south), kept for the CSV. */
  gridXM: number;
  gridYM: number;
}

export interface DrawingPlant {
  no: number;
  ref: string;
  instanceId: string;
  species: DrawingSpecies;
  x: number;
  y: number;
  radiusM: number;
  servesTreeNos: number[];
  shared: boolean;
  light: string;
  keyPestDefense: boolean;
  gridXM: number;
  gridYM: number;
}

export interface DrawingGroundCover {
  species: DrawingSpecies;
  /** Closed rings; inner rings are holes (even-odd). */
  rings: Pt[][];
  /** Rings grouped into polygons: [outer, ...holes]. */
  polygons: Pt[][][];
  dots: Pt[];
  opacity: number;
}

export interface DrawingBed {
  no: number;
  name: string;
  heightM: number;
  shape: DrawingShape;
  areaM2: number;
}

export interface DrawingDimension {
  a: Pt;
  b: Pt;
  distanceM: number;
}

export interface GardenDrawing {
  name: string;
  language: Language;
  createdAt: string;
  /** Grid point (x east, y south) that became the plan origin (0, 0). */
  originGrid: { xM: number; yM: number };
  /** Plan extent in plan coordinates (always starts at 0, 0). */
  widthM: number;
  heightM: number;
  outline: (DrawingShape & { areaM2: number }) | null;
  beds: DrawingBed[];
  trees: DrawingTree[];
  plants: DrawingPlant[];
  groundCovers: DrawingGroundCover[];
  dimensions: DrawingDimension[];
  species: DrawingSpecies[];
}

export interface BuildDrawingOptions {
  garden: GardenState;
  /** Ground covers as shown on screen; computed from the garden when absent. */
  groundCovers?: CoverShape[];
}

const r3 = (v: number) => Math.round(v * 1000) / 1000;

export function polygonArea(pts: Pt[]): number {
  let a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) a += (pts[j][0] + pts[i][0]) * (pts[j][1] - pts[i][1]);
  return Math.abs(a) / 2;
}

/** Signed area, positive = counter-clockwise in a y-up system. */
export function signedArea(pts: Pt[]): number {
  let a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) a += pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
  return a / 2;
}

/**
 * Groups even-odd rings into polygons with holes: a ring's nesting depth is the number of other
 * rings containing it; even depth = outer ring, odd depth = hole of the smallest enclosing outer ring.
 */
export function ringsToPolygons(rings: Pt[][]): Pt[][][] {
  const valid = rings.filter(r => r.length >= 3);
  const contains = (outer: Pt[], inner: Pt[]) => {
    // Test a vertex and the midpoint of the first edge so shared vertices don't mislead.
    const m: Pt = [(inner[0][0] + inner[1][0]) / 2, (inner[0][1] + inner[1][1]) / 2];
    return pointInPolygon(m[0], m[1], outer);
  };
  const depth = valid.map((ring, i) => valid.reduce((d, other, j) => (i !== j && contains(other, ring) ? d + 1 : d), 0));
  const area = valid.map(polygonArea);
  const polys: Array<{ idx: number; rings: Pt[][] }> = [];
  valid.forEach((ring, i) => { if (depth[i] % 2 === 0) polys.push({ idx: i, rings: [ring] }); });
  valid.forEach((ring, i) => {
    if (depth[i] % 2 === 0) return;
    let best: { idx: number; rings: Pt[][] } | null = null;
    for (const p of polys) {
      if (depth[p.idx] !== depth[i] - 1 || !contains(valid[p.idx], ring)) continue;
      if (!best || area[p.idx] < area[best.idx]) best = p;
    }
    if (best) best.rings.push(ring);
  });
  return polys.map(p => p.rings);
}

export function polygonsArea(polys: Pt[][][]): number {
  return polys.reduce((s, rings) => s + polygonArea(rings[0]) - rings.slice(1).reduce((h, r) => h + polygonArea(r), 0), 0);
}

function computeCovers(garden: GardenState): CoverShape[] {
  if (!garden.placedCompanions.some(c => getGroundCoverSpec(c.plant))) return [];
  const infra = garden.infrastructure;
  return computeGroundCovers(buildGardenCoverInput(garden.starPlants, garden.placedCompanions, {
    hemisphere: garden.hemisphere, zone: garden.zone, treeAge: garden.treeAge ?? 'YOUNG',
    mask: infra?.outline ? (x: number, y: number) => (pointInShape(x, y, infra.outline!) ? 1 : 0) : undefined,
    compartmentOf: infra && infra.raisedBeds.length > 0 ? (x: number, y: number) => compartmentAt(x, y, infra.raisedBeds) : undefined,
  }));
}

export function buildGardenDrawing({ garden, groundCovers: screenCovers }: BuildDrawingOptions): GardenDrawing {
  const lang = garden.language;
  const de = lang === 'de';
  const covers = screenCovers ?? computeCovers(garden);
  const infra = garden.infrastructure;

  // Extent in grid coordinates, including canopies, plant spreads and cover areas
  const xs: number[] = [];
  const ys: number[] = [];
  const addPt = (x: number, y: number) => { xs.push(x); ys.push(y); };
  for (const s of garden.starPlants) {
    const r = s.starTree.matureRadiusM;
    addPt(s.xM - r, s.yM - r); addPt(s.xM + r, s.yM + r);
  }
  for (const c of garden.placedCompanions) {
    const r = (c.plant.spreadM || 0) / 2;
    addPt(c.xM - r, c.yM - r); addPt(c.xM + r, c.yM + r);
  }
  for (const sh of covers) for (const ring of sh.rings) for (const [x, y] of ring) addPt(x, y);
  if (infra?.outline) for (const [x, y] of shapeToPolygon(infra.outline)) addPt(x, y);
  for (const b of infra?.raisedBeds ?? []) for (const [x, y] of shapeToPolygon(b.shape)) addPt(x, y);
  if (xs.length === 0) { addPt(-5, -5); addPt(5, 5); }

  const originX = Math.floor(Math.min(...xs)) - 1;
  const originYSouth = Math.ceil(Math.max(...ys)) + 1; // southern edge (grid y grows south)
  const widthM = Math.ceil(Math.max(...xs)) + 1 - originX;
  const heightM = originYSouth - (Math.floor(Math.min(...ys)) - 1);

  const X = (xM: number) => r3(xM - originX);
  const Y = (yM: number) => r3(originYSouth - yM);
  const P = (p: Pt): Pt => [X(p[0]), Y(p[1])];
  const toShape = (s: GardenShape): DrawingShape =>
    s.kind === 'CIRCLE'
      ? { kind: 'CIRCLE', cx: X(s.cxM), cy: Y(s.cyM), r: r3(s.rM) }
      : { kind: 'POLYGON', points: shapeToPolygon(s).map(P) };
  const shapeArea = (s: GardenShape) => (s.kind === 'CIRCLE' ? Math.PI * s.rM * s.rM : polygonArea(shapeToPolygon(s)));

  // Species keys in order of appearance
  const species: DrawingSpecies[] = [];
  const speciesBy = new Map<string, DrawingSpecies>();
  const prefix = { TREE: de ? 'B' : 'T', PLANT: 'P', GROUND_COVER: 'G' } as const;
  const counters = { TREE: 0, PLANT: 0, GROUND_COVER: 0 };
  const getSpecies = (kind: DrawingSpecies['kind'], p: {
    id: string; name: string; botanicalName: string; heightM: number | null; widthM: number; layer: string; roles: string; color: string;
  }) => {
    const key = `${kind}:${p.id}`;
    let sp = speciesBy.get(key);
    if (!sp) {
      sp = { code: `${prefix[kind]}${++counters[kind]}`, kind, plantId: p.id, name: p.name, botanicalName: p.botanicalName,
        heightM: p.heightM, widthM: r3(p.widthM), layer: p.layer, roles: p.roles, color: p.color, count: 0 };
      speciesBy.set(key, sp);
      species.push(sp);
    }
    sp.count++;
    return sp;
  };
  const plantInfo = (pl: GuildPlant) => ({
    id: pl.id, name: getLoc(pl.commonName, lang), botanicalName: pl.botanicalName, heightM: pl.heightM ?? null,
    widthM: pl.spreadM, layer: translateLayer(pl.layer, lang), roles: pl.roles.map(r => translateRole(r, lang)).join(', '), color: pl.color,
  });

  const trees: DrawingTree[] = garden.starPlants.map((s, i) => {
    const t = s.starTree;
    const sp = getSpecies('TREE', {
      id: t.id, name: getLoc(t.commonName, lang), botanicalName: t.botanicalName, heightM: t.matureHeightM ?? null,
      widthM: t.matureRadiusM * 2, layer: translateLayer('CANOPY', lang), roles: '', color: t.color,
    });
    return { no: i + 1, ref: '', instanceId: s.instanceId, species: sp, label: s.customName || sp.name,
      x: X(s.xM), y: Y(s.yM), canopyRadiusM: t.matureRadiusM, gridXM: r3(s.xM), gridYM: r3(s.yM) };
  });
  const refCounter = new Map<string, number>();
  const nextRef = (code: string) => {
    const k = (refCounter.get(code) ?? 0) + 1;
    refCounter.set(code, k);
    return `${code}-${k}`;
  };
  trees.forEach(t => { t.ref = nextRef(t.species.code); });
  const treeNoById = new Map(trees.map(t => [t.instanceId, t.no]));

  const plants: DrawingPlant[] = garden.placedCompanions
    .filter(c => !isAreaPlant(c.plant))
    .map((c, i) => {
      const species = getSpecies('PLANT', plantInfo(c.plant));
      return {
      no: i + 1, ref: nextRef(species.code), instanceId: c.instanceId, species,
      x: X(c.xM), y: Y(c.yM), radiusM: Math.max(0.05, (c.plant.spreadM || 0.1) / 2),
      servesTreeNos: c.servicingTreeIds.map(id => treeNoById.get(id)).filter((n): n is number => n !== undefined),
      shared: c.isMerged, light: c.currentLightCondition, keyPestDefense: !!c.isKeyPestDefense,
      gridXM: r3(c.xM), gridYM: r3(c.yM),
      };
    });

  const groundCovers: DrawingGroundCover[] = covers.map(sh => {
    const sp = getSpecies('GROUND_COVER', plantInfo(sh.plant));
    sp.count = sh.instanceIds.length;
    if (sh.color) sp.color = sh.color;
    const rings = sh.rings.filter(r => r.length >= 3).map(r => r.map(P));
    const polygons = ringsToPolygons(rings);
    sp.areaM2 = Math.round(polygonsArea(polygons) * 100) / 100;
    return { species: sp, rings, polygons, dots: sh.dots.map(P), opacity: sh.opacity };
  });

  const beds: DrawingBed[] = (infra?.raisedBeds ?? []).map((b, i) => ({
    no: i + 1, name: b.name || getLoc(bedLabel(i), lang), heightM: b.heightM, shape: toShape(b.shape),
    areaM2: Math.round(shapeArea(b.shape) * 100) / 100,
  }));

  // Distances between each tree and its two nearest neighbours (as in the PDF)
  const dimensions: DrawingDimension[] = [];
  const seen = new Set<string>();
  trees.forEach((a, i) => {
    trees
      .map((b, j) => ({ j, d: Math.hypot(b.x - a.x, b.y - a.y) }))
      .filter(e => e.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2)
      .forEach(({ j, d }) => {
        const key = `${Math.min(i, j)}-${Math.max(i, j)}`;
        if (seen.has(key)) return;
        seen.add(key);
        dimensions.push({ a: [a.x, a.y], b: [trees[j].x, trees[j].y], distanceM: r3(d) });
      });
  });

  return {
    name: garden.name || (de ? 'Gartenplan' : 'Garden plan'),
    language: lang,
    createdAt: new Date().toISOString(),
    originGrid: { xM: originX, yM: originYSouth },
    widthM, heightM,
    outline: infra?.outline ? { ...toShape(infra.outline), areaM2: Math.round(shapeArea(infra.outline) * 100) / 100 } : null,
    beds, trees, plants, groundCovers, dimensions, species,
  };
}

/** CAD/SVG layer names (ASCII, so every CAD program accepts them). */
export interface DxfLayerNames {
  grid: string; outline: string; beds: string; trunks: string; canopies: string; plants: string;
  groundCovers: string; labels: string; dimensions: string; legend: string;
}

export function dxfLayerNames(lang: 'de' | 'en'): DxfLayerNames {
  return lang === 'de'
    ? { grid: 'PG-Raster', outline: 'PG-Grundstueck', beds: 'PG-Hochbeete', trunks: 'PG-Baeume-Stamm', canopies: 'PG-Baeume-Krone',
        plants: 'PG-Pflanzen', groundCovers: 'PG-Bodendecker', labels: 'PG-Beschriftung', dimensions: 'PG-Abstaende', legend: 'PG-Legende' }
    : { grid: 'PG-Grid', outline: 'PG-Outline', beds: 'PG-Raised-beds', trunks: 'PG-Trees-trunk', canopies: 'PG-Trees-canopy',
        plants: 'PG-Plants', groundCovers: 'PG-Ground-covers', labels: 'PG-Labels', dimensions: 'PG-Distances', legend: 'PG-Legend' };
}

/** Polygon points of a drawing shape (circles as n-gons), counter-clockwise. */
export function drawingShapePoints(s: DrawingShape, segments = 64): Pt[] {
  if (s.kind === 'POLYGON') return signedArea(s.points) < 0 ? [...s.points].reverse() : s.points;
  return Array.from({ length: segments }, (_, i) => {
    const a = (i / segments) * Math.PI * 2;
    return [r3(s.cx + s.r * Math.cos(a)), r3(s.cy + s.r * Math.sin(a))] as Pt;
  });
}

export function safeFileName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9äöüß]+/gi, '_').replace(/^_+|_+$/g, '') || 'garden';
}

export function downloadFile(content: string | Blob, fileName: string, mime: string): void {
  const blob = typeof content === 'string' ? new Blob([content], { type: mime }) : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
