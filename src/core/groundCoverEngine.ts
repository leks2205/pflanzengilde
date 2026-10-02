import { ClimateZone, GuildPlant, Hemisphere, PhenoSeason, StarTree, TreeAgeMode } from '../types/guild';
import { GroundCoverSpec, getGroundCoverSpec } from '../data/groundCoverSpecs';
import { isAlliumPlant, isFennelPlant, isLegumePlant, isWormwoodPlant } from './placementRules';

/**
 * Ground-cover areas.
 *
 * Every area plant (see data/groundCoverSpecs.ts) is drawn as an area instead of a single point.
 * Each cover gets a scalar "suitability" field f(x, y) in [0, 1]; the area is the iso-0.5 contour
 * of that field, traced with marching squares. The field encodes the evidence-based rules:
 *
 *  - bare zone around every trunk: 0.75 m around young trees (weed-free circle/strip trials:
 *    Willoughby 1999, Neilsen & Hogue 2000, Smith et al. 2005), 0.3 m collar around established
 *    trees (Atucha et al. 2011), 0.5 m for dense, vole-friendly covers (Merwin et al. 1999)
 *  - SHADE covers concentrate in the canopy shadow, which falls poleward of the trunk by
 *    crownHeight × cot(noon sun elevation) (solar geometry, Cooper 1969); SUN covers avoid it;
 *    spring ephemerals ignore it (they grow before leaf-out, Muller & Bormann 1976)
 *  - holes around clump companions (their spread plus one year of runner growth) and around
 *    allelopathic plants (fennel, wormwood) and, for legume covers, around alliums – the same
 *    distances the conflict engines use
 *  - ALLEY covers are strips outside every canopy (orchard alley strips, Cahenzli et al. 2019)
 *  - the same species around neighbouring trees merges smoothly (smooth maximum), and different
 *    covers that grow at the same time share the ground through a soft partition whose blend width
 *    follows their growth form (guerrilla runners interweave, phalanx mats meet at a near-hard
 *    edge; Lovett Doust 1981). Covers of different season layers overlap.
 *
 * The engine is pure and deterministic (seeded noise), works in metres (x east, y south) and is
 * used by the radial guild view, the garden grid and both PDF exporters.
 */

export type { TreeAgeMode };
export type Ring = Array<[number, number]>;

export interface CoverStarInput {
  /** Stable key (instance id) – seeds the organic edge noise. */
  key: string;
  xM: number;
  yM: number;
  star: StarTree;
}

export interface CoverInstanceInput {
  instanceId: string;
  plant: GuildPlant;
  /** Marker position of the plant (m). */
  anchor: { xM: number; yM: number };
  /** Keys of the stars this cover grows around. */
  servingStarKeys: string[];
}

export interface ClumpInput {
  xM: number;
  yM: number;
  plant: GuildPlant;
}

export interface GroundCoverInput {
  stars: CoverStarInput[];
  covers: CoverInstanceInput[];
  clumps: ClumpInput[];
  hemisphere: Hemisphere;
  zone?: ClimateZone;
  treeAge: TreeAgeMode;
  /** Season shown; covers that are not active then are flagged `inSeason: false`. */
  season?: PhenoSeason | 'ALL';
  /** Grid resolution in metres (0.05 radial view, 0.1 garden grid). */
  resolutionM: number;
  /** Optional mask (e.g. garden outline, raised-bed compartments): return 0 to forbid a point. */
  mask?: (xM: number, yM: number, cover: CoverInstanceInput) => number;
}

export interface CoverShape {
  /** One shape per species (instances of the same species merge). */
  plantId: string;
  instanceIds: string[];
  plant: GuildPlant;
  spec: GroundCoverSpec;
  color: string;
  /** Fill opacity for renderers. */
  opacity: number;
  /** Rings in metres; draw all rings of a shape with the even-odd rule (holes are inner rings). */
  rings: Ring[];
  /** Clustered dots for bulb drifts: [x, y] in metres. */
  dots: Array<[number, number]>;
  inSeason: boolean;
  areaM2: number;
  /** Anchors that lie outside the drawn area (renderers can draw a leader line). */
  detachedAnchors: Array<{ instanceId: string; xM: number; yM: number }>;
}

// ── Small maths helpers ────────────────────────────────────────────────────────────────────────────

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const smoothstep = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

export function hash32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Smooth maximum (log-sum-exp); merges the same cover around neighbouring trees like metaballs. */
export function smoothMax(values: number[], k = 8): number {
  if (values.length === 0) return 0;
  if (values.length === 1) return values[0];
  let m = -Infinity;
  for (const v of values) if (v > m) m = v;
  let sum = 0;
  for (const v of values) sum += Math.exp(k * (v - m));
  return clamp01(m + Math.log(sum) / k);
}

/** Periodic 1-D value noise in [-1, 1] over the angle (two octaves, cosine interpolation). */
function makeAngularNoise(seed: number): (theta: number) => number {
  const rnd = mulberry32(seed);
  const oct = [10, 22].map(n => ({ n, v: Array.from({ length: n }, () => rnd() * 2 - 1) }));
  return (theta: number) => {
    let total = 0;
    let amp = 1;
    let norm = 0;
    for (const { n, v } of oct) {
      const u = ((theta / (2 * Math.PI)) % 1 + 1) % 1 * n;
      const i = Math.floor(u);
      const f = u - i;
      const w = (1 - Math.cos(Math.PI * f)) / 2;
      total += amp * (v[i % n] * (1 - w) + v[(i + 1) % n] * w);
      norm += amp;
      amp *= 0.45;
    }
    return total / norm;
  };
}

// ── Evidence-based parameters ──────────────────────────────────────────────────────────────────────

const TREE_CATEGORIES = new Set(['FRUIT_TREE', 'NUT_TREE', 'NITROGEN_FIXING_TREE']);

/**
 * Bare zone around a trunk (m). Young trees: 0.75 m radius (1.5 m weed-free strip / 1.83 m circle
 * trials); established trees: 0.3 m collar, 0.5 m for dense vole-friendly covers. Shrubs, vines
 * and perennials keep at most half their canopy radius (min 0.3 m), since the orchard trials
 * concern trees.
 */
export function trunkClearanceM(star: StarTree, treeAge: TreeAgeMode, spec?: GroundCoverSpec | null): number {
  const base = treeAge === 'YOUNG' ? 0.75 : spec?.denseVoleFriendly ? 0.5 : 0.3;
  if (TREE_CATEGORIES.has(star.category)) return base;
  return Math.min(base, Math.max(0.3, star.matureRadiusM * 0.5));
}

/** Representative latitude per climate zone (planning value) for the shade offset. */
const ZONE_LATITUDE: Record<ClimateZone, number> = { BOREAL: 60, TEMPERATE: 50, SUBTROPICAL: 35, TROPICAL: 15 };
/** Mean solar declination for May–August (growing season), degrees. */
const SUMMER_DECLINATION = 18;

/** Poleward displacement of a tree's noon canopy shadow (m): crown-centre height × cot(α). */
export function shadeOffsetM(star: StarTree, zone: ClimateZone = 'TEMPERATE'): number {
  const height = star.matureHeightM ?? star.matureRadiusM * 1.6;
  const crownCentre = Math.max(height * 0.6, height - star.matureRadiusM);
  const alphaDeg = 90 - Math.abs(ZONE_LATITUDE[zone] - SUMMER_DECLINATION);
  const cot = 1 / Math.tan((alphaDeg * Math.PI) / 180);
  return Math.max(0, crownCentre * cot);
}

/** Half-width of the blend band between two covers (m): guerrilla runners interweave further. */
function blendHalfWidthM(spec: GroundCoverSpec): number {
  if (spec.edge === 'HARD') return 0.03;
  if (spec.strategy === 'GUERRILLA') return spec.stolonRateMPerYr ? Math.max(0.15, spec.stolonRateMPerYr * 2) : 0.25;
  return 0.08;
}

/** Clearance a cover keeps around a clump companion (m): its spread plus one year of runner growth. */
function clumpHoleRadiusM(clump: GuildPlant, spec: GroundCoverSpec): number {
  const growth = spec.stolonRateMPerYr ?? (spec.strategy === 'GUERRILLA' ? 0.2 : 0.1);
  return Math.max(0.1, clump.spreadM / 2 + growth + (spec.clumpClearanceExtraM ?? 0));
}

/** Allelopathic / chemical buffers mirrored from the conflict engines (m). */
function chemicalBufferM(clump: GuildPlant, cover: GuildPlant): number {
  if (isFennelPlant(clump)) return 1.5;
  if (isWormwoodPlant(clump)) return 1.2;
  if (isAlliumPlant(clump) && isLegumePlant(cover)) return 1.8;
  return 0;
}

const SEASON_LAYER_ACTIVE: Record<GroundCoverSpec['seasonLayer'], PhenoSeason[]> = {
  SUMMER: ['LATE_SPRING', 'SUMMER', 'AUTUMN'],
  SPRING_EPHEMERAL: ['EARLY_SPRING', 'LATE_SPRING'],
  COOL_SEASON: ['AUTUMN', 'WINTER', 'EARLY_SPRING', 'LATE_SPRING'],
};

// ── Field construction ─────────────────────────────────────────────────────────────────────────────

interface StarTerm {
  x: number;
  y: number;
  rIn: number;
  rOutBase: number;
  rCanopy: number;
  noise: (theta: number) => number;
  noiseAmp: number;
  /** Shade disc centre. */
  sx: number;
  sy: number;
  /** Preferred direction of this cover around this star (radians, screen frame: 0 = east, y south). */
  prefAngle: number;
  bbox: { minX: number; maxX: number; minY: number; maxY: number };
}

interface CoverGroup {
  plantId: string;
  plant: GuildPlant;
  spec: GroundCoverSpec;
  instances: CoverInstanceInput[];
  terms: StarTerm[];
  blendW: number;
  bbox: { minX: number; maxX: number; minY: number; maxY: number };
}

const SECTOR_ANGLE_N: Record<string, number> = {
  // compass bearing (0 = north, clockwise) in the northern hemisphere
  NORTH_SHADE: 0,
  EAST_MORNING: 90,
  SOUTH_SUN: 180,
  WEST_WIND: 270,
};

/** Compass bearing → screen angle (x east, y south): east = 0, south = +90°. */
const bearingToScreenRad = (bearingDeg: number) => ((bearingDeg - 90) * Math.PI) / 180;

export function computeGroundCovers(input: GroundCoverInput): CoverShape[] {
  const res = input.resolutionM;
  const eps = Math.max(2 * res, 0.08);
  const starByKey = new Map(input.stars.map(s => [s.key, s]));
  const hemiSign = input.hemisphere === 'SOUTHERN' ? 1 : -1; // shade falls to -y (north) in the north

  // Group cover instances by species
  const groupsById = new Map<string, CoverGroup>();
  for (const inst of input.covers) {
    const spec = getGroundCoverSpec(inst.plant);
    if (!spec) continue;
    let g = groupsById.get(inst.plant.id);
    if (!g) {
      g = {
        plantId: inst.plant.id,
        plant: inst.plant,
        spec,
        instances: [],
        terms: [],
        blendW: blendHalfWidthM(spec),
        bbox: { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
      };
      groupsById.set(inst.plant.id, g);
    }
    g.instances.push(inst);
  }
  const groups = [...groupsById.values()].sort((a, b) => a.plantId.localeCompare(b.plantId));
  if (groups.length === 0) return [];

  // Preferred directions: covers of one season layer around one star are spread round the trunk,
  // starting from their preferred sector, so that they partition the ground instead of stacking
  const coversPerStarLayer = new Map<string, CoverGroup[]>();
  for (const g of groups) {
    const keys = new Set(g.instances.flatMap(i => i.servingStarKeys));
    for (const k of keys) {
      const id = `${k}|${g.spec.seasonLayer}|${g.spec.mode === 'ALLEY' ? 'A' : 'C'}`;
      const list = coversPerStarLayer.get(id) ?? [];
      list.push(g);
      coversPerStarLayer.set(id, list);
    }
  }

  const shadeOffsetCache = new Map<string, number>();
  for (const g of groups) {
    const keys = [...new Set(g.instances.flatMap(i => i.servingStarKeys))].filter(k => starByKey.has(k));
    for (const key of keys) {
      const s = starByKey.get(key)!;
      const R = s.star.matureRadiusM;
      const rIn = trunkClearanceM(s.star, input.treeAge, g.spec) + (g.spec.rInnerExtraM ?? 0);
      let rOutBase: number;
      if (g.spec.mode === 'ALLEY') {
        // Strip starts 0.5 m outside the drip line
        rOutBase = R + 0.5 + (g.spec.stripWidthM ?? 1);
      } else {
        rOutBase = Math.max(rIn + 0.6, R * g.spec.rOuterFactor);
      }
      const innerEdge = g.spec.mode === 'ALLEY' ? R + 0.5 : rIn;
      let off = shadeOffsetCache.get(s.star.id);
      if (off === undefined) {
        off = shadeOffsetM(s.star, input.zone);
        shadeOffsetCache.set(s.star.id, off);
      }
      const peers = coversPerStarLayer.get(`${key}|${g.spec.seasonLayer}|${g.spec.mode === 'ALLEY' ? 'A' : 'C'}`) ?? [g];
      const idx = peers.indexOf(g);
      const sector = g.plant.preferredSector;
      let bearing: number;
      if (sector && sector !== 'ANY') {
        bearing = SECTOR_ANGLE_N[sector];
        if (input.hemisphere === 'SOUTHERN' && (sector === 'NORTH_SHADE' || sector === 'SOUTH_SUN')) bearing = (bearing + 180) % 360;
      } else {
        bearing = (hash32(g.plantId) % 360);
      }
      // spread peers evenly so two covers sharing a sector still split the ring
      bearing = (bearing + (idx * 360) / Math.max(1, peers.length)) % 360;
      const noiseAmp = g.spec.mode === 'ALLEY' ? 0.06 : 0.12;
      const reach = rOutBase * (1 + noiseAmp) + eps;
      const term: StarTerm = {
        x: s.xM,
        y: s.yM,
        rIn: innerEdge,
        rOutBase,
        rCanopy: R,
        noise: makeAngularNoise(hash32(`${key}|${g.plantId}`)),
        noiseAmp,
        sx: s.xM,
        sy: s.yM + hemiSign * off,
        prefAngle: bearingToScreenRad(bearing),
        bbox: { minX: s.xM - reach, maxX: s.xM + reach, minY: s.yM - reach, maxY: s.yM + reach },
      };
      g.terms.push(term);
      g.bbox.minX = Math.min(g.bbox.minX, term.bbox.minX);
      g.bbox.maxX = Math.max(g.bbox.maxX, term.bbox.maxX);
      g.bbox.minY = Math.min(g.bbox.minY, term.bbox.minY);
      g.bbox.maxY = Math.max(g.bbox.maxY, term.bbox.maxY);
    }
  }

  // Obstacles (bare trunk zones, clump holes, chemical buffers) per cover, bucketed in 2 m cells so
  // each grid point only checks nearby trees and plants
  const clumps = input.clumps.filter(c => !getGroundCoverSpec(c.plant));
  const BUCKET = 2;
  const bucketKey = (ix: number, iy: number) => (ix + 32768) * 65536 + (iy + 32768);
  interface Obstacle { x: number; y: number; r: number }
  const obstacleBuckets = new Map<CoverGroup, Map<number, Obstacle[]>>();
  const termBuckets = new Map<CoverGroup, Map<number, StarTerm[]>>();
  const insert = <T,>(map: Map<number, T[]>, item: T, x0: number, x1: number, y0: number, y1: number) => {
    for (let ix = Math.floor(x0 / BUCKET); ix <= Math.floor(x1 / BUCKET); ix++) {
      for (let iy = Math.floor(y0 / BUCKET); iy <= Math.floor(y1 / BUCKET); iy++) {
        const k = bucketKey(ix, iy);
        const list = map.get(k);
        if (list) list.push(item);
        else map.set(k, [item]);
      }
    }
  };
  for (const g of groups) {
    const ob = new Map<number, Obstacle[]>();
    for (const s of input.stars) {
      const c = trunkClearanceM(s.star, input.treeAge, g.spec);
      // strips stay outside every canopy (+0.5 m)
      const r = g.spec.mode === 'ALLEY' ? Math.max(c, s.star.matureRadiusM + 0.5) : c;
      insert(ob, { x: s.xM, y: s.yM, r }, s.xM - r - eps, s.xM + r + eps, s.yM - r - eps, s.yM + r + eps);
    }
    for (const c of clumps) {
      const r = Math.max(clumpHoleRadiusM(c.plant, g.spec), chemicalBufferM(c.plant, g.plant));
      insert(ob, { x: c.xM, y: c.yM, r }, c.xM - r - eps, c.xM + r + eps, c.yM - r - eps, c.yM + r + eps);
    }
    obstacleBuckets.set(g, ob);
    const tb = new Map<number, StarTerm[]>();
    for (const t of g.terms) insert(tb, t, t.bbox.minX, t.bbox.maxX, t.bbox.minY, t.bbox.maxY);
    termBuckets.set(g, tb);
  }
  const EMPTY: never[] = [];

  /** Raw field of one cover before sharing the ground: [plain value, value weighted by the
   *  cover's preferred direction around the nearest tree]. */
  const vals: number[] = [];
  const rawField = (g: CoverGroup, x: number, y: number): [number, number] => {
    const key = bucketKey(Math.floor(x / BUCKET), Math.floor(y / BUCKET));
    const terms = termBuckets.get(g)!.get(key) ?? EMPTY;
    if (terms.length === 0) return [0, 0];
    vals.length = 0;
    let affinity = 0;
    for (const t of terms) {
      if (x < t.bbox.minX || x > t.bbox.maxX || y < t.bbox.minY || y > t.bbox.maxY) continue;
      const dx = x - t.x;
      const dy = y - t.y;
      const d = Math.hypot(dx, dy);
      if (d > t.rOutBase * (1 + t.noiseAmp) + eps || d < t.rIn) continue;
      const theta = Math.atan2(dy, dx);
      const rOut = t.rOutBase * (1 + t.noiseAmp * t.noise(theta));
      let v = smoothstep((d - t.rIn) / eps) * smoothstep((rOut - d) / eps);
      if (v <= 0) continue;
      if (g.spec.seasonLayer !== 'SPRING_EPHEMERAL' && g.spec.mode !== 'ALLEY') {
        const ds = Math.hypot(x - t.sx, y - t.sy);
        const shade = 1 - smoothstep((ds - t.rCanopy) / 0.5);
        if (g.spec.light === 'SHADE') v *= 0.25 + 0.75 * shade;
        else if (g.spec.light === 'SUN') v *= 1 - 0.4 * shade; // thins under the canopy but persists (clover grows in peach tree rows, Bussi et al. 2016)
      }
      vals.push(v);
      affinity = Math.max(affinity, 0.5 + 0.5 * Math.cos(theta - t.prefAngle));
    }
    let f = smoothMax(vals);
    if (f <= 0) return [0, 0];
    for (const o of obstacleBuckets.get(g)!.get(key) ?? EMPTY) {
      const d = Math.hypot(x - o.x, y - o.y);
      if (d < o.r + eps) {
        f *= smoothstep((d - o.r) / eps);
        if (f <= 0) return [0, 0];
      }
    }
    return [f, f * (0.55 + 0.45 * affinity)];
  };

  // Raw fields on a shared world lattice (multiples of res), one grid per cover
  interface Grid { minX: number; minY: number; w: number; h: number; own: Float32Array; aff: Float32Array }
  const grids = new Map<CoverGroup, Grid>();
  for (const g of groups) {
    if (g.terms.length === 0) continue;
    const minX = (Math.floor(g.bbox.minX / res) - 1) * res;
    const minY = (Math.floor(g.bbox.minY / res) - 1) * res;
    const w = Math.ceil((g.bbox.maxX - minX) / res) + 2;
    const h = Math.ceil((g.bbox.maxY - minY) / res) + 2;
    const own = new Float32Array(w * h);
    const aff = new Float32Array(w * h);
    const probe = g.instances[0];
    for (let j = 1; j < h - 1; j++) {
      const y = minY + j * res;
      for (let i = 1; i < w - 1; i++) {
        const x = minX + i * res;
        const [f, a] = rawField(g, x, y);
        if (f <= 0) continue;
        const mask = input.mask ? input.mask(x, y, probe) : 1;
        if (mask <= 0) continue;
        own[j * w + i] = f * mask;
        aff[j * w + i] = a * mask;
      }
    }
    grids.set(g, { minX, minY, w, h, own, aff });
  }
  const sampleOwn = (grid: Grid, x: number, y: number) => {
    const i = Math.round((x - grid.minX) / res);
    const j = Math.round((y - grid.minY) / res);
    if (i < 0 || j < 0 || i >= grid.w || j >= grid.h) return 0;
    return grid.own[j * grid.w + i];
  };
  const sampleAff = (grid: Grid, x: number, y: number) => {
    const i = Math.round((x - grid.minX) / res);
    const j = Math.round((y - grid.minY) / res);
    if (i < 0 || j < 0 || i >= grid.w || j >= grid.h) return 0;
    return grid.aff[j * grid.w + i];
  };

  // Covers of the same season layer share the ground (soft partition)
  const peersOf = new Map<string, CoverGroup[]>();
  for (const g of groups) {
    if (!grids.has(g)) continue;
    // Sown alley strips overlap tree-ring covers (mixed edge) instead of splitting the ground
    const l = `${g.spec.seasonLayer}|${g.spec.mode === 'ALLEY' ? 'A' : 'C'}`;
    peersOf.set(l, [...(peersOf.get(l) ?? []), g]);
  }

  const shapes: CoverShape[] = [];
  for (const g of groups) {
    const grid = grids.get(g);
    if (!grid) continue;
    const { minX, minY, w, h, own, aff } = grid;
    const peers = (peersOf.get(`${g.spec.seasonLayer}|${g.spec.mode === 'ALLEY' ? 'A' : 'C'}`) ?? [g]).filter(p => p !== g);
    // guerrilla covers reach a little past the midline (interweaving band)
    const reachBoost = g.spec.edge === 'HARD' ? 1 : 1 + Math.min(0.6, g.blendW * 1.6);
    // Where a cover can grow (own >= 0.5) the field is a plateau, elsewhere zero, so the traced
    // edge sits exactly on the suitability boundary and neighbours meet without gaps after blurring
    let field: Float32Array = new Float32Array(w * h);
    if (peers.length === 0) {
      for (let idx = 0; idx < own.length; idx++) field[idx] = own[idx] >= 0.5 ? 1 : 0;
    } else {
      // Neighbouring covers meet on one line (no unclaimed strip): where this cover can grow
      // (own >= 0.5) its value is set by its share of the ground, so two equally strong covers
      // both sit exactly at the 0.5 contour on their common border. Guerrilla runners reach a
      // little past it (interweaving band); hard-edged, contained covers do not.
      const overlap = g.spec.edge === 'HARD' ? 0 : Math.min(0.18, g.blendW * 0.5);
      for (let j = 1; j < h - 1; j++) {
        const y = minY + j * res;
        for (let i = 1; i < w - 1; i++) {
          const idx = j * w + i;
          const o = own[idx];
          if (o <= 0) continue;
          const x = minX + i * res;
          const ownA = aff[idx];
          // temperature: narrow band for phalanx/hard edges, wider for guerrilla runners
          let tau = Math.max(0.03, g.blendW * 0.4);
          const pv: number[] = [];
          for (const p of peers) {
            const pg = grids.get(p)!;
            // only covers that actually grow here compete for the spot
            if (sampleOwn(pg, x, y) < 0.5) continue;
            const v = sampleAff(pg, x, y);
            if (v > 0) {
              pv.push(v);
              tau = Math.min(tau, Math.max(0.03, p.blendW * 0.4));
            }
          }
          if (o < 0.5) continue;
          if (pv.length === 0) {
            field[idx] = 1;
            continue;
          }
          const ownW = Math.exp(ownA / tau);
          let sum = ownW;
          for (const v of pv) sum += Math.exp(v / tau);
          const share = ownW / sum;
          const byShare = clamp01(0.5 + 2 * (share - 0.5) + overlap);
          // the winner of the spot owns it; both sides then blur to the same midline
          field[idx] = byShare;
        }
      }
    }
    // Smooth the field slightly before tracing: removes thin arms and grid jaggies without moving
    // the edges of broad areas (Gaussian blur, sigma about one grid step, at least 6 cm)
    field = gaussianBlur(field, w, h, Math.max(0.06, res * 1.2) / res);
    const gridRings = marchingSquares(field, w, h, 0.5);
    const rings: Ring[] = [];
    for (const r of gridRings) {
      const m: Ring = r.map(([gx, gy]) => [round2(minX + gx * res), round2(minY + gy * res)]);
      const simp = simplifyRing(chaikin(simplifyRing(m, Math.max(0.02, res * 0.3)), 2), Math.max(0.01, res * 0.15)).map(
        ([x, y]) => [round2(x), round2(y)] as [number, number]
      );
      if (simp.length >= 3 && Math.abs(signedArea(simp)) >= 0.04) rings.push(simp);
    }
    if (rings.length === 0) continue;
    const areaM2 = evenOddArea(rings);
    const fieldAt = (x: number, y: number) => {
      const i = Math.round((x - minX) / res);
      const j = Math.round((y - minY) / res);
      if (i < 0 || j < 0 || i >= w || j >= h) return 0;
      return field[j * w + i];
    };
    const dots: Array<[number, number]> = [];
    if (g.spec.drift) {
      const rnd = mulberry32(hash32(`drift|${g.plantId}|${g.terms.map(t => `${t.x.toFixed(1)},${t.y.toFixed(1)}`).join(';')}`));
      const area = (g.bbox.maxX - g.bbox.minX) * (g.bbox.maxY - g.bbox.minY);
      const nParents = Math.min(120, Math.round(area * g.spec.drift.parentsPerM2));
      for (let p = 0; p < nParents && dots.length < 400; p++) {
        const px = g.bbox.minX + rnd() * (g.bbox.maxX - g.bbox.minX);
        const py = g.bbox.minY + rnd() * (g.bbox.maxY - g.bbox.minY);
        if (fieldAt(px, py) < 0.5) continue;
        const n = Math.max(1, Math.round(g.spec.drift.childrenMean * (0.5 + rnd())));
        for (let c = 0; c < n && dots.length < 400; c++) {
          // Box–Muller
          const u1 = Math.max(1e-9, rnd());
          const u2 = rnd();
          const r = g.spec.drift.sigmaM * Math.sqrt(-2 * Math.log(u1));
          const cx = px + r * Math.cos(2 * Math.PI * u2);
          const cy = py + r * Math.sin(2 * Math.PI * u2);
          if (fieldAt(cx, cy) >= 0.5) dots.push([round2(cx), round2(cy)]);
        }
      }
    }
    const season = input.season ?? 'ALL';
    const inSeason = season === 'ALL' || SEASON_LAYER_ACTIVE[g.spec.seasonLayer].includes(season);
    const baseOpacity = g.spec.drift ? 0.14 : 0.16 + 0.24 * g.spec.coverFraction;
    shapes.push({
      plantId: g.plantId,
      instanceIds: g.instances.map(i => i.instanceId),
      plant: g.plant,
      spec: g.spec,
      color: g.plant.color,
      opacity: inSeason ? baseOpacity : 0.06,
      rings,
      dots,
      inSeason,
      areaM2,
      detachedAnchors: g.instances
        .filter(i => fieldAt(i.anchor.xM, i.anchor.yM) < 0.5)
        .map(i => ({ instanceId: i.instanceId, xM: i.anchor.xM, yM: i.anchor.yM })),
    });
  }
  return shapes;
}

const round2 = (v: number) => Math.round(v * 100) / 100;

// ── Geometry: marching squares, simplification, area ───────────────────────────────────────────────

/**
 * Marching squares on a w×h grid (row-major). Returns closed rings in grid coordinates. The grid
 * border must be below `iso` (callers pad with a zero row/column) so every ring closes.
 */
export function marchingSquares(f: Float32Array | number[], w: number, h: number, iso: number): Ring[] {
  const at = (i: number, j: number) => f[j * w + i];
  // Edge ids: horizontal edge (i,j)-(i+1,j) => 2*(j*w+i); vertical edge (i,j)-(i,j+1) => 2*(j*w+i)+1
  const point = (edge: number): [number, number] => {
    const base = edge >> 1;
    const i = base % w;
    const j = Math.floor(base / w);
    if ((edge & 1) === 0) {
      const a = at(i, j);
      const b = at(i + 1, j);
      const t = a === b ? 0.5 : (iso - a) / (b - a);
      return [i + clamp01(t), j];
    }
    const a = at(i, j);
    const b = at(i, j + 1);
    const t = a === b ? 0.5 : (iso - a) / (b - a);
    return [i, j + clamp01(t)];
  };
  const next = new Map<number, number>();
  const add = (from: number, to: number) => next.set(from, to);
  for (let j = 0; j < h - 1; j++) {
    for (let i = 0; i < w - 1; i++) {
      const tl = at(i, j) >= iso ? 8 : 0;
      const tr = at(i + 1, j) >= iso ? 4 : 0;
      const br = at(i + 1, j + 1) >= iso ? 2 : 0;
      const bl = at(i, j + 1) >= iso ? 1 : 0;
      const c = tl | tr | br | bl;
      if (c === 0 || c === 15) continue;
      const top = 2 * (j * w + i);
      const bottom = 2 * ((j + 1) * w + i);
      const left = 2 * (j * w + i) + 1;
      const right = 2 * (j * w + i + 1) + 1;
      // Segments oriented so the inside (>= iso) is on the left in screen coordinates
      switch (c) {
        case 1: add(bottom, left); break;
        case 2: add(right, bottom); break;
        case 3: add(right, left); break;
        case 4: add(top, right); break;
        case 5: {
          const centre = (at(i, j) + at(i + 1, j) + at(i + 1, j + 1) + at(i, j + 1)) / 4;
          if (centre >= iso) { add(top, left); add(bottom, right); } else { add(top, right); add(bottom, left); }
          break;
        }
        case 6: add(top, bottom); break;
        case 7: add(top, left); break;
        case 8: add(left, top); break;
        case 9: add(bottom, top); break;
        case 10: {
          const centre = (at(i, j) + at(i + 1, j) + at(i + 1, j + 1) + at(i, j + 1)) / 4;
          if (centre >= iso) { add(left, bottom); add(right, top); } else { add(left, top); add(right, bottom); }
          break;
        }
        case 11: add(right, top); break;
        case 12: add(left, right); break;
        case 13: add(bottom, right); break;
        case 14: add(left, bottom); break;
      }
    }
  }
  const rings: Ring[] = [];
  const visited = new Set<number>();
  for (const start of next.keys()) {
    if (visited.has(start)) continue;
    const ring: Ring = [];
    let e = start;
    let guard = 0;
    while (!visited.has(e) && guard++ < 1e6) {
      visited.add(e);
      ring.push(point(e));
      const n = next.get(e);
      if (n === undefined) break;
      e = n;
    }
    if (ring.length >= 3) rings.push(ring);
  }
  return rings;
}

export function signedArea(r: Ring): number {
  let a = 0;
  for (let i = 0; i < r.length; i++) {
    const [x1, y1] = r[i];
    const [x2, y2] = r[(i + 1) % r.length];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}

export function pointInRing(x: number, y: number, r: Ring): boolean {
  let inside = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i];
    const [xj, yj] = r[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Area under the even-odd rule: rings nested an odd number of times are holes. */
export function evenOddArea(rings: Ring[]): number {
  let total = 0;
  rings.forEach((r, idx) => {
    const [px, py] = r[0];
    let depth = 0;
    rings.forEach((o, k) => {
      if (k !== idx && pointInRing(px, py, o)) depth++;
    });
    total += (depth % 2 === 0 ? 1 : -1) * Math.abs(signedArea(r));
  });
  return Math.max(0, total);
}

/** Ramer–Douglas–Peucker for a closed ring. */
export function simplifyRing(r: Ring, tol: number): Ring {
  if (r.length <= 4) return r;
  // split at the vertex farthest from the first one
  let far = 0;
  let farD = -1;
  for (let i = 1; i < r.length; i++) {
    const d = (r[i][0] - r[0][0]) ** 2 + (r[i][1] - r[0][1]) ** 2;
    if (d > farD) { farD = d; far = i; }
  }
  const a = rdp(r.slice(0, far + 1), tol);
  const b = rdp([...r.slice(far), r[0]], tol);
  return [...a.slice(0, -1), ...b.slice(0, -1)];
}

function rdp(pts: Ring, tol: number): Ring {
  if (pts.length < 3) return pts;
  const [x1, y1] = pts[0];
  const [x2, y2] = pts[pts.length - 1];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1e-9;
  let maxD = -1;
  let idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / len;
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD <= tol) return [pts[0], pts[pts.length - 1]];
  const left = rdp(pts.slice(0, idx + 1), tol);
  const right = rdp(pts.slice(idx), tol);
  return [...left.slice(0, -1), ...right];
}

/** Chaikin corner cutting on a closed ring: rounds the polygon into a smooth outline. */
export function chaikin(r: Ring, iterations: number): Ring {
  let pts = r;
  for (let it = 0; it < iterations; it++) {
    if (pts.length < 3) return pts;
    const out: Ring = [];
    for (let i = 0; i < pts.length; i++) {
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[(i + 1) % pts.length];
      out.push([0.75 * x0 + 0.25 * x1, 0.75 * y0 + 0.25 * y1], [0.25 * x0 + 0.75 * x1, 0.25 * y0 + 0.75 * y1]);
    }
    pts = out;
  }
  return pts;
}

/** Separable Gaussian blur of a w×h field; sigma in grid cells. The zero border stays zero. */
export function gaussianBlur(f: Float32Array, w: number, h: number, sigma: number): Float32Array {
  if (sigma < 0.3) return f;
  const rad = Math.max(1, Math.ceil(sigma * 2));
  const k = new Float32Array(2 * rad + 1);
  let ks = 0;
  for (let i = -rad; i <= rad; i++) {
    k[i + rad] = Math.exp(-(i * i) / (2 * sigma * sigma));
    ks += k[i + rad];
  }
  for (let i = 0; i < k.length; i++) k[i] /= ks;
  const tmp = new Float32Array(w * h);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      let acc = 0;
      for (let d = -rad; d <= rad; d++) {
        const ii = i + d;
        if (ii >= 0 && ii < w) acc += f[j * w + ii] * k[d + rad];
      }
      tmp[j * w + i] = acc;
    }
  }
  const out = new Float32Array(w * h);
  for (let j = 1; j < h - 1; j++) {
    for (let i = 1; i < w - 1; i++) {
      let acc = 0;
      for (let d = -rad; d <= rad; d++) {
        const jj = j + d;
        if (jj >= 0 && jj < h) acc += tmp[jj * w + i] * k[d + rad];
      }
      out[j * w + i] = acc;
    }
  }
  return out;
}

/** SVG path data for a shape's rings, mapped by `toPx`. Use with fill-rule="evenodd". */
export function ringsToSvgPath(rings: Ring[], toPx: (xM: number, yM: number) => { x: number; y: number }): string {
  const parts: string[] = [];
  for (const r of rings) {
    if (r.length < 3) continue;
    const pts = r.map(([x, y]) => toPx(x, y));
    if (pts.some(p => !Number.isFinite(p.x) || !Number.isFinite(p.y))) continue;
    parts.push(`M${pts.map(p => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join('L')}Z`);
  }
  return parts.join('');
}

// ── Input builders shared by the radial view, the garden grid and the PDFs ─────────────────────────

/** True when the cover occupies the ground in the given season. */
export function isCoverInSeason(spec: GroundCoverSpec, season: PhenoSeason | 'ALL'): boolean {
  return season === 'ALL' || SEASON_LAYER_ACTIVE[spec.seasonLayer].includes(season);
}

/** Radial guild (one star at the origin): polar placements → engine input. */
export function buildRadialCoverInput(
  star: StarTree,
  placed: Array<{ instanceId: string; plant: GuildPlant; angleDeg: number; distanceM: number }>,
  opts: { hemisphere: Hemisphere; zone?: ClimateZone; treeAge: TreeAgeMode; resolutionM?: number }
): GroundCoverInput {
  const toXY = (d: number, a: number) => {
    const rad = ((a - 90) * Math.PI) / 180;
    return { xM: d * Math.cos(rad), yM: d * Math.sin(rad) };
  };
  const covers: CoverInstanceInput[] = [];
  const clumps: ClumpInput[] = [];
  for (const p of placed) {
    const pos = toXY(p.distanceM, p.angleDeg);
    if (getGroundCoverSpec(p.plant)) covers.push({ instanceId: p.instanceId, plant: p.plant, anchor: pos, servingStarKeys: ['star'] });
    else clumps.push({ ...pos, plant: p.plant });
  }
  return {
    stars: [{ key: 'star', xM: 0, yM: 0, star }],
    covers,
    clumps,
    hemisphere: opts.hemisphere,
    zone: opts.zone,
    treeAge: opts.treeAge,
    season: 'ALL',
    resolutionM: opts.resolutionM ?? 0.06,
  };
}

/** Garden grid / cluster: star instances and placed companions → engine input. */
export function buildGardenCoverInput(
  stars: Array<{ instanceId: string; xM: number; yM: number; starTree: StarTree }>,
  companions: Array<{ instanceId: string; plant: GuildPlant; xM: number; yM: number; servicingTreeIds: string[] }>,
  opts: { hemisphere: Hemisphere; zone?: ClimateZone; treeAge: TreeAgeMode; resolutionM?: number; mask?: GroundCoverInput['mask'] }
): GroundCoverInput {
  const covers: CoverInstanceInput[] = [];
  const clumps: ClumpInput[] = [];
  for (const c of companions) {
    if (getGroundCoverSpec(c.plant)) {
      covers.push({ instanceId: c.instanceId, plant: c.plant, anchor: { xM: c.xM, yM: c.yM }, servingStarKeys: c.servicingTreeIds });
    } else {
      clumps.push({ xM: c.xM, yM: c.yM, plant: c.plant });
    }
  }
  // Coarser grid for large gardens keeps the computation interactive (≈ 60k cells per cover)
  let res = opts.resolutionM;
  if (res === undefined) {
    if (stars.length === 0) res = 0.1;
    else {
      const xs = stars.map(s => s.xM);
      const ys = stars.map(s => s.yM);
      const span = Math.max(4, Math.max(...xs) - Math.min(...xs) + 12) * Math.max(4, Math.max(...ys) - Math.min(...ys) + 12);
      res = Math.min(0.25, Math.max(0.1, Math.sqrt(span / 60000)));
      res = Math.round(res * 100) / 100;
    }
  }
  return {
    stars: stars.map(s => ({ key: s.instanceId, xM: s.xM, yM: s.yM, star: s.starTree })),
    covers,
    clumps,
    hemisphere: opts.hemisphere,
    zone: opts.zone,
    treeAge: opts.treeAge,
    season: 'ALL',
    resolutionM: res,
    mask: opts.mask,
  };
}

/** Outer reach of a cover around a star (m) – used to size views. */
export function coverReachM(star: StarTree, plant: GuildPlant): number {
  const spec = getGroundCoverSpec(plant);
  if (!spec) return 0;
  if (spec.mode === 'ALLEY') return star.matureRadiusM + 0.5 + (spec.stripWidthM ?? 1);
  return Math.max(star.matureRadiusM * spec.rOuterFactor, 1) * 1.12;
}
