import { GardenInfrastructure, GardenShape, RaisedBed } from '../types/garden';
/** localStorage key of the garden planner state (GardenPlannerPage; App's JSON import writes it too). */
export const STORAGE_KEY_GARDEN_GRID = 'permaculture_garden_grid_v1';

/**
 * The garden's saved "automatic conflict resolution" preference (default on), so the radial plan's
 * multi-star preview resolves conflicts exactly like the garden it hands the cluster to.
 */
export function readSavedAutoResolvePreference(): boolean {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_GARDEN_GRID) : null;
    if (!raw) return true;
    const data = JSON.parse(raw);
    return typeof data?.autoResolveEnabled === 'boolean' ? data.autoResolveEnabled : true;
  } catch {
    return true;
  }
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && Math.abs(v) <= 300;

/** Validates a stored or imported shape (drops malformed ones). */
export function sanitizeShape(raw: unknown): GardenShape | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (r.kind === 'RECT' && isNum(r.xM) && isNum(r.yM) && isNum(r.wM) && isNum(r.hM) && r.wM > 0 && r.hM > 0) {
    return { kind: 'RECT', xM: r.xM, yM: r.yM, wM: r.wM, hM: r.hM };
  }
  if (r.kind === 'CIRCLE' && isNum(r.cxM) && isNum(r.cyM) && isNum(r.rM) && r.rM > 0) {
    return { kind: 'CIRCLE', cxM: r.cxM, cyM: r.cyM, rM: r.rM };
  }
  if (r.kind === 'POLYGON' && Array.isArray(r.points) && r.points.length >= 3 && r.points.length <= 256) {
    const pts = r.points.filter((p): p is [number, number] => Array.isArray(p) && isNum(p[0]) && isNum(p[1]));
    if (pts.length >= 3) return { kind: 'POLYGON', points: pts.map(([x, y]) => [x, y] as [number, number]) };
  }
  return null;
}

/** Validates stored or imported garden infrastructure (outline and raised beds). */
export function sanitizeInfrastructure(raw: unknown): GardenInfrastructure {
  if (!raw || typeof raw !== 'object') return { outline: null, raisedBeds: [] };
  const r = raw as Record<string, unknown>;
  const outline = sanitizeShape(r.outline);
  const beds: RaisedBed[] = [];
  if (Array.isArray(r.raisedBeds)) {
    for (const b of r.raisedBeds.slice(0, 64)) {
      if (!b || typeof b !== 'object') continue;
      const bb = b as Record<string, unknown>;
      const shape = sanitizeShape(bb.shape);
      if (!shape) continue;
      const heightM = isNum(bb.heightM) && bb.heightM >= 0.05 && bb.heightM <= 2 ? bb.heightM : 0.45;
      const id = typeof bb.id === 'string' && bb.id.length <= 40 ? bb.id : `bed-${beds.length + 1}`;
      const name = typeof bb.name === 'string' ? bb.name.slice(0, 40) : undefined;
      if (beds.some(x => x.id === id)) continue;
      beds.push(name ? { id, shape, heightM, name } : { id, shape, heightM });
    }
  }
  return { outline, raisedBeds: beds };
}
