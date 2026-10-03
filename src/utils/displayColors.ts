import { GuildPlant } from '../types/guild';

/**
 * Display colours per plan: the plants shown together get colours that are as far apart as
 * possible. Hues are spaced evenly around the colour wheel in a perceptual colour space (OKLCH),
 * so 5 plants get 5 very different hues and 20 plants get finer steps; from 9 plants on, the
 * lightness alternates between neighbours for extra contrast. Each plant keeps roughly its own
 * catalogue hue: the plants are ordered by their catalogue hue and the evenly spaced hues are
 * rotated to fit that order best. Deterministic (same plant set → same colours).
 */

// ── OKLCH ↔ sRGB ─────────────────────────────────────────────────────────────────────────────────
const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map(x => x + x).join('') : h;
  return [parseInt(v.slice(0, 2), 16) / 255, parseInt(v.slice(2, 4), 16) / 255, parseInt(v.slice(4, 6), 16) / 255];
}

function rgbToOklab([r, g, b]: [number, number, number]): [number, number, number] {
  const lr = toLinear(r), lg = toLinear(g), lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToRgb([L, a, b]: [number, number, number]): [number, number, number] {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (c: [number, number, number]) => c.every(v => v >= -0.0005 && v <= 1.0005);

/** OKLCH → hex, reducing chroma until the colour fits in sRGB. */
export function oklchToHex(L: number, C: number, hDeg: number): string {
  const h = (hDeg * Math.PI) / 180;
  let c = C;
  let rgb = oklabToRgb([L, c * Math.cos(h), c * Math.sin(h)]);
  while (!inGamut(rgb) && c > 0.01) {
    c -= 0.005;
    rgb = oklabToRgb([L, c * Math.cos(h), c * Math.sin(h)]);
  }
  const hex = rgb.map(v => Math.round(Math.min(1, Math.max(0, toGamma(Math.min(1, Math.max(0, v))))) * 255).toString(16).padStart(2, '0'));
  return `#${hex.join('')}`;
}

/** Hue of a hex colour in OKLCH (degrees). Greys get hue 0. */
export function hueOf(hex: string): number {
  const [, a, b] = rgbToOklab(hexToRgb(hex));
  const h = (Math.atan2(b, a) * 180) / Math.PI;
  return (h + 360) % 360;
}

/** Perceptual distance (OKLab ΔE ×100) between two hex colours. */
export function colorDistance(a: string, b: string): number {
  const p = rgbToOklab(hexToRgb(a));
  const q = rgbToOklab(hexToRgb(b));
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) * 100;
}

const angleDiff = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

/**
 * Assigns maximally distinct colours to a set of plant ids (catalogue colours give the hue order).
 * Returns id → hex.
 */
export function assignDisplayColors(plants: Array<Pick<GuildPlant, 'id' | 'color'>>): Map<string, string> {
  const unique = [...new Map(plants.map(p => [p.id, p])).values()].sort((a, b) => a.id.localeCompare(b.id));
  const out = new Map<string, string>();
  const n = unique.length;
  if (n === 0) return out;
  if (n === 1) {
    out.set(unique[0].id, unique[0].color);
    return out;
  }
  // order by catalogue hue (ties by id) so neighbours on the wheel stay neighbours
  const withHue = unique.map(p => ({ p, h: hueOf(p.color) })).sort((a, b) => a.h - b.h || a.p.id.localeCompare(b.p.id));
  const step = 360 / n;
  // rotation that keeps the evenly spaced hues closest to the catalogue hues
  let bestOffset = 0;
  let bestCost = Infinity;
  for (let k = 0; k < 360; k += 2) {
    let cost = 0;
    withHue.forEach(({ h }, i) => { cost += angleDiff(h, k + i * step) ** 2; });
    if (cost < bestCost) {
      bestCost = cost;
      bestOffset = k;
    }
  }
  const alternate = n >= 9;
  withHue.forEach(({ p }, i) => {
    const hue = (bestOffset + i * step) % 360;
    const L = alternate ? (i % 2 === 0 ? 0.62 : 0.78) : 0.68;
    const C = alternate ? (i % 2 === 0 ? 0.17 : 0.13) : 0.16;
    out.set(p.id, oklchToHex(L, C, hue));
  });
  return out;
}

/** Copy of a plant with its display colour (same object if unchanged). */
export function withDisplayColor<T extends { id: string; color: string }>(plant: T, colors: Map<string, string>): T {
  const c = colors.get(plant.id);
  return c && c !== plant.color ? { ...plant, color: c } : plant;
}
