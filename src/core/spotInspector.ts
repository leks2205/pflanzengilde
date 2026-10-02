import { GuildPlant, LocalizedString, StarTree } from '../types/guild';
import { CoverShape, pointInRing } from './groundCoverEngine';

export type SpotEntryKind = 'TRUNK' | 'CANOPY' | 'PLANT' | 'COVER' | 'DRIFT';

export interface SpotEntry {
  key: string;
  kind: SpotEntryKind;
  name: LocalizedString;
  color: string;
  /** Distance from the spot to the plant's centre (m). */
  distanceM: number;
  /** Ground cover that does not occupy the ground in the shown season. */
  outOfSeason?: boolean;
}

export interface SpotQuery {
  xM: number;
  yM: number;
  stars: Array<{ key: string; xM: number; yM: number; star: StarTree }>;
  plants: Array<{ key: string; xM: number; yM: number; plant: GuildPlant }>;
  covers: CoverShape[];
  isInSeason?: (shape: CoverShape) => boolean;
  /** Pick radius around small markers (m). */
  pickRadiusM?: number;
}

/** Everything that grows at one spot: trunks and canopies, clump plants, ground-cover areas. */
export function plantsAtSpot(q: SpotQuery): SpotEntry[] {
  const out: SpotEntry[] = [];
  const pick = q.pickRadiusM ?? 0.25;
  for (const s of q.stars) {
    const d = Math.hypot(q.xM - s.xM, q.yM - s.yM);
    if (d <= pick) out.push({ key: `trunk-${s.key}`, kind: 'TRUNK', name: s.star.commonName, color: s.star.color, distanceM: d });
    else if (d <= s.star.matureRadiusM) out.push({ key: `canopy-${s.key}`, kind: 'CANOPY', name: s.star.commonName, color: s.star.color, distanceM: d });
  }
  for (const p of q.plants) {
    const d = Math.hypot(q.xM - p.xM, q.yM - p.yM);
    if (d <= Math.max(pick, p.plant.spreadM / 2)) {
      out.push({ key: `plant-${p.key}`, kind: 'PLANT', name: p.plant.commonName, color: p.plant.color, distanceM: d });
    }
  }
  for (const shape of q.covers) {
    let depth = 0;
    for (const r of shape.rings) if (pointInRing(q.xM, q.yM, r)) depth++;
    if (depth % 2 === 1) {
      out.push({
        key: `cover-${shape.plantId}`,
        kind: shape.spec.drift ? 'DRIFT' : 'COVER',
        name: shape.plant.commonName,
        color: shape.color,
        distanceM: 0,
        outOfSeason: q.isInSeason ? !q.isInSeason(shape) : false,
      });
    }
  }
  const order: Record<SpotEntryKind, number> = { TRUNK: 0, PLANT: 1, CANOPY: 2, COVER: 3, DRIFT: 4 };
  // A clump plant that is also listed as a cover (area plant marker) only shows once, as the area
  const coverNames = new Set(out.filter(e => e.kind === 'COVER' || e.kind === 'DRIFT').map(e => e.name.en));
  return out
    .filter(e => e.kind !== 'PLANT' || !coverNames.has(e.name.en))
    .sort((a, b) => order[a.kind] - order[b.kind] || a.distanceM - b.distanceM);
}
