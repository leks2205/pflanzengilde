import { GardenDrawing, drawingShapePoints, signedArea } from './gardenDrawing';
import { Pt } from './geometry2d';

/**
 * GeoJSON (RFC 7946, WGS84 lon/lat) for QGIS, ArcGIS, geojson.io and web maps.
 *
 * The plan has only local metres, so the user pins one plan point (a tree trunk or the plan
 * origin) to a real latitude/longitude. Plan north is taken as true north, as everywhere in the app
 * (shade and sun sectors assume it). Metres are converted with the WGS84 meridian and prime-vertical
 * radii at the reference latitude; over a garden-sized area (< 1 km) the error is far below 1 cm.
 */

export interface GeoReference {
  /** Plan point in plan coordinates (metres, X east, Y north). */
  planX: number;
  planY: number;
  lat: number;
  lon: number;
}

const A = 6378137;               // WGS84 semi-major axis
const E2 = 6.69437999014e-3;     // first eccentricity squared

export function metresToLonLat(ref: GeoReference): (x: number, y: number) => [number, number] {
  const phi = (ref.lat * Math.PI) / 180;
  const s = 1 - E2 * Math.sin(phi) ** 2;
  const rMeridian = (A * (1 - E2)) / s ** 1.5;
  const rNormal = A / Math.sqrt(s);
  const degPerMNorth = 180 / (Math.PI * rMeridian);
  const degPerMEast = 180 / (Math.PI * rNormal * Math.cos(phi));
  const r7 = (v: number) => Math.round(v * 1e7) / 1e7; // ~1 cm
  return (x, y) => [r7(ref.lon + (x - ref.planX) * degPerMEast), r7(ref.lat + (y - ref.planY) * degPerMNorth)];
}

export function isValidGeoReference(lat: number, lon: number): boolean {
  return isFinite(lat) && isFinite(lon) && Math.abs(lat) <= 85 && Math.abs(lon) <= 180;
}

type Geometry =
  | { type: 'Point'; coordinates: [number, number] }
  | { type: 'Polygon'; coordinates: [number, number][][] }
  | { type: 'MultiPolygon'; coordinates: [number, number][][][] };

interface Feature {
  type: 'Feature';
  geometry: Geometry;
  properties: Record<string, string | number | boolean | null>;
}

export function generateGardenGeoJson(drawing: GardenDrawing, ref: GeoReference): string {
  const toLL = metresToLonLat(ref);
  // RFC 7946: closed rings, exterior counter-clockwise, holes clockwise
  const ring = (pts: Pt[], outer: boolean): [number, number][] => {
    const ccw = signedArea(pts) > 0;
    const oriented = ccw === outer ? pts : [...pts].reverse();
    const ll = oriented.map(([x, y]) => toLL(x, y));
    return [...ll, ll[0]];
  };
  const circle = (x: number, y: number, r: number) => drawingShapePoints({ kind: 'CIRCLE', cx: x, cy: y, r }, 48);
  const features: Feature[] = [];
  const base = (kind: string) => ({ kind, plan_name: drawing.name });

  if (drawing.outline) {
    features.push({ type: 'Feature', geometry: { type: 'Polygon', coordinates: [ring(drawingShapePoints(drawing.outline), true)] },
      properties: { ...base('outline'), area_m2: drawing.outline.areaM2 } });
  }
  for (const bed of drawing.beds) {
    features.push({ type: 'Feature', geometry: { type: 'Polygon', coordinates: [ring(drawingShapePoints(bed.shape), true)] },
      properties: { ...base('raised_bed'), name: bed.name, height_m: bed.heightM, area_m2: bed.areaM2 } });
  }
  for (const gc of drawing.groundCovers) {
    if (gc.polygons.length === 0) continue;
    const sp = gc.species;
    features.push({ type: 'Feature',
      geometry: { type: 'MultiPolygon', coordinates: gc.polygons.map(rings => rings.map((r, i) => ring(r, i === 0))) },
      properties: { ...base('ground_cover'), code: sp.code, name: sp.name, botanical_name: sp.botanicalName,
        plant_id: sp.plantId, area_m2: sp.areaM2 ?? null, height_m: sp.heightM, color: sp.color } });
  }
  for (const tree of drawing.trees) {
    const sp = tree.species;
    const props = { code: sp.code, ref: tree.ref, no: tree.no, name: tree.label, botanical_name: sp.botanicalName, plant_id: sp.plantId,
      height_m: sp.heightM, canopy_diameter_m: Math.round(tree.canopyRadiusM * 200) / 100, plan_x_m: tree.x, plan_y_m: tree.y, color: sp.color };
    features.push({ type: 'Feature', geometry: { type: 'Polygon', coordinates: [ring(circle(tree.x, tree.y, tree.canopyRadiusM), true)] },
      properties: { ...base('tree_canopy'), ...props } });
    features.push({ type: 'Feature', geometry: { type: 'Point', coordinates: toLL(tree.x, tree.y) },
      properties: { ...base('tree'), ...props } });
  }
  for (const p of drawing.plants) {
    const sp = p.species;
    features.push({ type: 'Feature', geometry: { type: 'Point', coordinates: toLL(p.x, p.y) },
      properties: { ...base('plant'), code: sp.code, ref: p.ref, no: p.no, name: sp.name, botanical_name: sp.botanicalName, plant_id: sp.plantId,
        height_m: sp.heightM, spread_m: sp.widthM, layer: sp.layer, roles: sp.roles,
        serves_trees: p.servesTreeNos.map(no => drawing.trees.find(t => t.no === no)?.ref ?? String(no)).join(' '), shared: p.shared, light: p.light, plan_x_m: p.x, plan_y_m: p.y, color: sp.color } });
  }

  const collection = {
    type: 'FeatureCollection',
    name: drawing.name,
    // Non-standard but harmless member; QGIS ignores it, other tools keep it as metadata.
    pflanzengilde: {
      generator: 'pflanzengilde.de',
      created: drawing.createdAt,
      reference: { plan_x_m: ref.planX, plan_y_m: ref.planY, lat: ref.lat, lon: ref.lon },
      plan_width_m: drawing.widthM,
      plan_height_m: drawing.heightM,
    },
    features,
  };
  return JSON.stringify(collection, null, 1);
}
