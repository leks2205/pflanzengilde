import { GardenShape } from '../types/garden';

/** Plane geometry for garden shapes (metres, x east / y south). */

export type Pt = [number, number];

export const snapM = (v: number, step = 0.25) => Math.round(v / step) * step;

/** Polygon approximation of a shape (circles as 64-gons). */
export function shapeToPolygon(shape: GardenShape, segments = 64): Pt[] {
  if (shape.kind === 'RECT') {
    const { xM, yM, wM, hM } = shape;
    return [[xM, yM], [xM + wM, yM], [xM + wM, yM + hM], [xM, yM + hM]];
  }
  if (shape.kind === 'CIRCLE') {
    const pts: Pt[] = [];
    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push([shape.cxM + shape.rM * Math.cos(a), shape.cyM + shape.rM * Math.sin(a)]);
    }
    return pts;
  }
  return shape.points;
}

export function pointInPolygon(x: number, y: number, pts: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function pointInShape(x: number, y: number, shape: GardenShape): boolean {
  if (shape.kind === 'RECT') return x >= shape.xM && x <= shape.xM + shape.wM && y >= shape.yM && y <= shape.yM + shape.hM;
  if (shape.kind === 'CIRCLE') return Math.hypot(x - shape.cxM, y - shape.cyM) <= shape.rM;
  return pointInPolygon(x, y, shape.points);
}

function distToSegment(x: number, y: number, a: Pt, b: Pt): { d: number; px: number; py: number } {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  const t = len2 > 0 ? Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / len2)) : 0;
  const px = a[0] + t * dx;
  const py = a[1] + t * dy;
  return { d: Math.hypot(x - px, y - py), px, py };
}

/** Distance from a point to the shape's border and the nearest border point. */
export function nearestOnBorder(x: number, y: number, shape: GardenShape): { d: number; px: number; py: number } {
  if (shape.kind === 'CIRCLE') {
    const d = Math.hypot(x - shape.cxM, y - shape.cyM);
    const ux = d > 1e-9 ? (x - shape.cxM) / d : 1;
    const uy = d > 1e-9 ? (y - shape.cyM) / d : 0;
    return { d: Math.abs(d - shape.rM), px: shape.cxM + ux * shape.rM, py: shape.cyM + uy * shape.rM };
  }
  const pts = shapeToPolygon(shape);
  let best = { d: Infinity, px: x, py: y };
  for (let i = 0; i < pts.length; i++) {
    const r = distToSegment(x, y, pts[i], pts[(i + 1) % pts.length]);
    if (r.d < best.d) best = r;
  }
  return best;
}

/** Signed distance: negative inside, positive outside. */
export function signedDistanceToShape(x: number, y: number, shape: GardenShape): number {
  const { d } = nearestOnBorder(x, y, shape);
  return pointInShape(x, y, shape) ? -d : d;
}

/** Moves a point so it lies at least `insetM` inside the shape (unchanged if already there). */
export function nearestPointInside(x: number, y: number, shape: GardenShape, insetM: number): Pt {
  if (signedDistanceToShape(x, y, shape) <= -insetM) return [x, y];
  const c = shapeCentroid(shape);
  // walk from the border point towards the centroid until inset is satisfied
  const { px, py } = pointInShape(x, y, shape) ? nearestOnBorder(x, y, shape) : nearestOnBorder(x, y, shape);
  for (let t = 0; t <= 1.0001; t += 0.05) {
    const qx = px + (c[0] - px) * t;
    const qy = py + (c[1] - py) * t;
    if (signedDistanceToShape(qx, qy, shape) <= -insetM) return [qx, qy];
  }
  return c;
}

/** Moves a point so it lies at least `offsetM` outside the shape (unchanged if already there). */
export function nearestPointOutside(x: number, y: number, shape: GardenShape, offsetM: number): Pt {
  if (signedDistanceToShape(x, y, shape) >= offsetM) return [x, y];
  const { px, py } = nearestOnBorder(x, y, shape);
  const c = shapeCentroid(shape);
  let ux = px - c[0];
  let uy = py - c[1];
  const len = Math.hypot(ux, uy) || 1;
  ux /= len;
  uy /= len;
  for (let step = 0; step < 200; step++) {
    const qx = px + ux * (offsetM + step * 0.05);
    const qy = py + uy * (offsetM + step * 0.05);
    if (signedDistanceToShape(qx, qy, shape) >= offsetM) return [qx, qy];
  }
  return [px + ux * offsetM, py + uy * offsetM];
}

export function shapeCentroid(shape: GardenShape): Pt {
  if (shape.kind === 'RECT') return [shape.xM + shape.wM / 2, shape.yM + shape.hM / 2];
  if (shape.kind === 'CIRCLE') return [shape.cxM, shape.cyM];
  const pts = shape.points;
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    const cr = x1 * y2 - x2 * y1;
    a += cr;
    cx += (x1 + x2) * cr;
    cy += (y1 + y2) * cr;
  }
  if (Math.abs(a) < 1e-9) {
    const n = pts.length || 1;
    return [pts.reduce((s, p) => s + p[0], 0) / n, pts.reduce((s, p) => s + p[1], 0) / n];
  }
  return [cx / (3 * a), cy / (3 * a)];
}

export function shapeAreaM2(shape: GardenShape): number {
  if (shape.kind === 'RECT') return Math.abs(shape.wM * shape.hM);
  if (shape.kind === 'CIRCLE') return Math.PI * shape.rM * shape.rM;
  const pts = shape.points;
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a) / 2;
}

export function shapeBBox(shape: GardenShape): { minX: number; maxX: number; minY: number; maxY: number } {
  if (shape.kind === 'RECT') return { minX: shape.xM, maxX: shape.xM + shape.wM, minY: shape.yM, maxY: shape.yM + shape.hM };
  if (shape.kind === 'CIRCLE') return { minX: shape.cxM - shape.rM, maxX: shape.cxM + shape.rM, minY: shape.cyM - shape.rM, maxY: shape.cyM + shape.rM };
  const xs = shape.points.map(p => p[0]);
  const ys = shape.points.map(p => p[1]);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

export function translateShape(shape: GardenShape, dx: number, dy: number): GardenShape {
  if (shape.kind === 'RECT') return { ...shape, xM: shape.xM + dx, yM: shape.yM + dy };
  if (shape.kind === 'CIRCLE') return { ...shape, cxM: shape.cxM + dx, cyM: shape.cyM + dy };
  return { kind: 'POLYGON', points: shape.points.map(([x, y]) => [x + dx, y + dy] as Pt) };
}

/** Normalises a rectangle drawn from any corner to positive width/height. */
export function rectFromCorners(a: Pt, b: Pt): GardenShape {
  return { kind: 'RECT', xM: Math.min(a[0], b[0]), yM: Math.min(a[1], b[1]), wM: Math.abs(b[0] - a[0]), hM: Math.abs(b[1] - a[1]) };
}

/** Freehand lasso → polygon: moving-average smoothing, then Ramer–Douglas–Peucker. */
export function lassoToPolygon(raw: Pt[], toleranceM = 0.05): Pt[] {
  if (raw.length < 3) return raw;
  const n = raw.length;
  const win = Math.min(3, Math.floor(n / 6));
  const smooth: Pt[] = raw.map((_, i) => {
    let sx = 0, sy = 0, c = 0;
    for (let k = -win; k <= win; k++) {
      const p = raw[(i + k + n) % n];
      sx += p[0];
      sy += p[1];
      c++;
    }
    return [sx / c, sy / c];
  });
  const simplified = rdpClosed(smooth, toleranceM);
  return simplified.map(([x, y]) => [Math.round(x * 100) / 100, Math.round(y * 100) / 100] as Pt);
}

function rdpOpen(pts: Pt[], tol: number): Pt[] {
  if (pts.length < 3) return pts;
  const [x1, y1] = pts[0];
  const [x2, y2] = pts[pts.length - 1];
  let maxD = -1;
  let idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = distToSegment(pts[i][0], pts[i][1], [x1, y1], [x2, y2]).d;
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD <= tol) return [pts[0], pts[pts.length - 1]];
  const left = rdpOpen(pts.slice(0, idx + 1), tol);
  const right = rdpOpen(pts.slice(idx), tol);
  return [...left.slice(0, -1), ...right];
}

function rdpClosed(pts: Pt[], tol: number): Pt[] {
  let far = 0;
  let farD = -1;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[0][0], pts[i][1] - pts[0][1]);
    if (d > farD) { farD = d; far = i; }
  }
  const a = rdpOpen(pts.slice(0, far + 1), tol);
  const b = rdpOpen([...pts.slice(far), pts[0]], tol);
  return [...a.slice(0, -1), ...b.slice(0, -1)];
}

/** True if no two non-adjacent edges cross. */
export function isSimplePolygon(pts: Pt[]): boolean {
  const n = pts.length;
  if (n < 3) return false;
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const segX = (p1: Pt, p2: Pt, p3: Pt, p4: Pt) => {
    const d1 = cross(p3, p4, p1), d2 = cross(p3, p4, p2), d3 = cross(p1, p2, p3), d4 = cross(p1, p2, p4);
    return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
  };
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(i - j) <= 1 || (i === 0 && j === n - 1)) continue;
      if (segX(pts[i], pts[(i + 1) % n], pts[j], pts[(j + 1) % n])) return false;
    }
  }
  return true;
}
