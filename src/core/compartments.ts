import { RaisedBed } from '../types/garden';
import { pointInShape, shapeAreaM2 } from './geometry2d';

/** Compartment of a point: the id of the (smallest) raised bed containing it, or 'OPEN'. */
export function compartmentAt(xM: number, yM: number, beds: readonly RaisedBed[]): string {
  let best: RaisedBed | null = null;
  let bestArea = Infinity;
  for (const b of beds) {
    if (!pointInShape(xM, yM, b.shape)) continue;
    const a = shapeAreaM2(b.shape);
    if (a < bestArea) {
      best = b;
      bestArea = a;
    }
  }
  return best ? best.id : 'OPEN';
}

/** True when a raised-bed wall separates the two points. */
export function wallBetween(a: { xM: number; yM: number }, b: { xM: number; yM: number }, beds: readonly RaisedBed[]): boolean {
  if (beds.length === 0) return false;
  return compartmentAt(a.xM, a.yM, beds) !== compartmentAt(b.xM, b.yM, beds);
}
