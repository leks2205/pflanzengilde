import { ClimateZone, Hemisphere } from '../types/guild';

export type WorldRegionId =
  | 'BOREAL_NORTH'
  | 'TEMPERATE_NORTH'
  | 'SUBTROPICAL_NORTH'
  | 'TROPICAL_NORTH'
  | 'TROPICAL_SOUTH'
  | 'SUBTROPICAL_SOUTH'
  | 'TEMPERATE_SOUTH'
  | 'BOREAL_SOUTH';

type Point = [number, number];

// Catmull-Rom spline through the points as cubic Bezier segments (without the initial move).
function splineSegments(points: Point[]): string {
  let d = '';
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i === 0 ? points[0] : points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i + 2 < points.length ? points[i + 2] : p2;

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** Smooth SVG path through the points. */
export function pointsToSvgPath(points: Point[]): string {
  if (points.length < 2) return '';
  return `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}` + splineSegments(points);
}

/**
 * Closed band between two boundary lines. The bottom line is traced in reverse with the same
 * spline, so adjacent bands share identical edges and leave no gaps.
 */
export function createBandPolygon(topPoints: Point[], bottomPoints: Point[]): string {
  const reversedBottom = [...bottomPoints].reverse();
  return (
    pointsToSvgPath(topPoints) +
    ` L ${reversedBottom[0][0].toFixed(1)} ${reversedBottom[0][1].toFixed(1)}` +
    splineSegments(reversedBottom) +
    ' Z'
  );
}

const MAP_TOP_EDGE: Point[] = [[0, 20], [500, 20], [1000, 20]];
const MAP_BOTTOM_EDGE: Point[] = [[0, 460], [500, 460], [1000, 460]];

/**
 * Climate boundary lines in map coordinates, bent where ocean currents shift the zones:
 * 1. North Atlantic Drift / Gulf Stream warming Northwestern Europe up to 62°N.
 * 2. Cold Labrador Current dipping Boreal conditions to 48°N in Eastern Canada.
 * 3. Oyashio Current dipping subarctic conditions south of Kamchatka.
 * 4. Mediterranean Basin warmth reaching 43°N into Provence/Italy.
 * 5. Cold Humboldt Current cooling the Peruvian coastline up to 16°S.
 * 6. ITCZ / Equator dividing Northern and Southern Tropics.
 */
export const BOUNDARY_POINTS = {
  // Line 1: Boreal North / Temperate North
  borealTemperateN: [
    [0, 88],
    [130, 90],   // Alaska Panhandle / Pacific NW (mild Alaska Current)
    [230, 105],  // Canadian Prairies
    [310, 118],  // Quebec / Labrador / Newfoundland (Cold Labrador Current dip)
    [410, 96],   // Mid-Atlantic
    [480, 84],   // British Isles (Gulf Stream warmth keeps Scotland temperate)
    [525, 75],   // Norway Coast / North Sea (North Atlantic Drift reaches ~62°N)
    [560, 85],   // Southern Sweden / Baltic (~58°N)
    [620, 98],   // Russia / Moscow
    [720, 108],  // Central Siberia (extreme continental freeze)
    [810, 122],  // Sea of Okhotsk / Kamchatka (cold Oyashio Current dip)
    [870, 110],  // Kurils / Sakhalin
    [1000, 88],  // Pacific return
  ] as Point[],

  // Line 2: Temperate North / Subtropical North
  temperateSubtropicalN: [
    [0, 152],
    [150, 140],  // Northern California (Mediterranean climate reaches ~39°N)
    [230, 156],  // Rockies / Great Basin
    [280, 146],  // US Southeast / Carolinas (Gulf Stream / Gulf of Mexico warmth)
    [380, 144],  // Atlantic
    [475, 134],  // Iberia (Mediterranean climate at 42°N)
    [525, 130],  // Southern France / Northern Italy (Po Valley / Provence warmth reaches 43°N)
    [575, 138],  // Greece / Aegean
    [650, 150],  // Levant / Iran
    [710, 162],  // Tibetan Plateau (high altitude cooling)
    [780, 152],  // Yangtze Valley / Central China
    [840, 146],  // Southern Japan (warm Kuroshio Current)
    [1000, 150], // Pacific return
  ] as Point[],

  // Line 3: Subtropical North / Tropical North
  subtropicalTropicalN: [
    [0, 185],
    [170, 184],  // Baja / Mexico
    [260, 176],  // Yucatan / Caribbean / South Florida (humid tropical warmth)
    [380, 184],  // Atlantic
    [470, 188],  // West Africa
    [530, 202],  // Sahara Desert interior (dry desert pushes tropical monsoon south to ~17°N)
    [590, 195],  // Red Sea / Sudan
    [680, 180],  // India / Mumbai (Indian Monsoon tropical expansion)
    [790, 176],  // Indochina / Vietnam / Philippines
    [1000, 185], // Pacific return
  ] as Point[],

  // Line 4: Tropical North / Tropical South (Equator 0°)
  equator: [
    [0, 250],
    [270, 247],  // Colombia / Northern South America
    [330, 248],  // Amazon Mouth
    [430, 249],  // Atlantic
    [515, 246],  // Congo / Gulf of Guinea
    [590, 248],  // Kenya / East Africa
    [700, 250],  // Indian Ocean
    [810, 250],  // Indonesia / Sumatra / Borneo
    [1000, 250], // Pacific return
  ] as Point[],

  // Line 5: Tropical South / Subtropical South
  tropicalSubtropicalS: [
    [0, 315],
    [285, 295],  // Peru / Atacama coast (cold Humboldt Current cools coast to ~16°S)
    [315, 308],  // Bolivia / Paraguay
    [350, 320],  // Brazil coast / Sao Paulo (warm Brazil Current extends tropics south to ~25°S)
    [430, 316],  // South Atlantic
    [495, 306],  // Namibia coast (cold Benguela Current)
    [560, 322],  // Mozambique / East Africa (warm Agulhas Current)
    [680, 315],  // Indian Ocean
    [825, 314],  // Northern Australia / Queensland
    [1000, 315], // Pacific return
  ] as Point[],

  // Line 6: Subtropical South / Temperate South
  subtropicalTemperateS: [
    [0, 348],
    [290, 340],  // Central Chile / Santiago (Mediterranean climate at 33°S)
    [335, 347],  // Argentina Pampas / Buenos Aires (34.5°S)
    [440, 348],  // South Atlantic
    [530, 345],  // South Africa / Cape Town (Mediterranean climate at 34°S)
    [680, 348],  // Indian Ocean
    [850, 352],  // Southern Australia / Melbourne / Adelaide (36°–38°S)
    [920, 352],  // New Zealand North Island
    [1000, 348], // Pacific return
  ] as Point[],

  // Line 7: Temperate South / Boreal South (Subantarctic)
  temperateBorealS: [
    [0, 404],
    [305, 398],  // Southern Patagonia / Tierra del Fuego / Falklands
    [400, 404],  // South Atlantic
    [700, 404],  // Southern Ocean
    [1000, 404], // Pacific return
  ] as Point[],
};

export interface WorldRegionDef {
  id: WorldRegionId;
  zone: ClimateZone;
  hemisphere: Hemisphere;
  name: { en: string; de: string };
  geoAreas: { en: string; de: string };
  usda: string;
  latRange: { en: string; de: string };
  color: string;
  fillColor: string;
  beaconX: number;
  beaconY: number;
  polygonPath: string;
}

export const WORLD_REGIONS: WorldRegionDef[] = [
  {
    id: 'BOREAL_NORTH',
    zone: 'BOREAL',
    hemisphere: 'NORTHERN',
    name: { de: 'Boreal / Kaltgemäßigt Nord', en: 'Boreal / Subarctic North' },
    geoAreas: { de: 'Skandinavien, Baltikum, Alaska, Kanada, Sibirien, Alpen', en: 'Scandinavia, Baltic, Alaska, Canada, Siberia, Alps' },
    usda: 'USDA 2–4',
    latRange: { de: '55° – 85° N', en: '55° – 85° N' },
    color: '#0284c7',
    fillColor: '#38bdf8',
    beaconX: 540,
    beaconY: 60,
    polygonPath: createBandPolygon(MAP_TOP_EDGE, BOUNDARY_POINTS.borealTemperateN),
  },
  {
    id: 'TEMPERATE_NORTH',
    zone: 'TEMPERATE',
    hemisphere: 'NORTHERN',
    name: { de: 'Gemäßigt Nord', en: 'Temperate North' },
    geoAreas: { de: 'Mitteleuropa (DE/AT/CH/UK/FR), Nordamerika, N-China, Japan', en: 'Central Europe (DE/AT/CH/UK/FR), North America, N-China, Japan' },
    usda: 'USDA 5–7',
    latRange: { de: '35° – 55° N (bis 62°N in Europa)', en: '35° – 55° N (up to 62°N in Europe)' },
    color: '#16a34a',
    fillColor: '#22c55e',
    beaconX: 520,
    beaconY: 110,
    polygonPath: createBandPolygon(BOUNDARY_POINTS.borealTemperateN, BOUNDARY_POINTS.temperateSubtropicalN),
  },
  {
    id: 'SUBTROPICAL_NORTH',
    zone: 'SUBTROPICAL',
    hemisphere: 'NORTHERN',
    name: { de: 'Subtropisch / Mediterran Nord', en: 'Subtropical / Mediterranean North' },
    geoAreas: { de: 'Mittelmeerraum (ES/IT/GR), Kalifornien, US-Südstaaten, Levante', en: 'Mediterranean (ES/IT/GR), California, US South, Levant' },
    usda: 'USDA 8–10',
    latRange: { de: '23.5° – 35° N (bis 43°N im Mittelmeer)', en: '23.5° – 35° N (up to 43°N in the Mediterranean)' },
    color: '#d97706',
    fillColor: '#f59e0b',
    beaconX: 520,
    beaconY: 156,
    polygonPath: createBandPolygon(BOUNDARY_POINTS.temperateSubtropicalN, BOUNDARY_POINTS.subtropicalTropicalN),
  },
  {
    id: 'TROPICAL_NORTH',
    zone: 'TROPICAL',
    hemisphere: 'NORTHERN',
    name: { de: 'Tropen & Äquatorial Nord', en: 'Tropical & Equatorial North' },
    geoAreas: { de: 'Zentralamerika, Karibik, N-Amazonas, Sahel/Zentralafrika, S-Indien, Indochina', en: 'Central America, Caribbean, N-Amazon, Central Africa, S-India, Indochina' },
    usda: 'USDA 11–13',
    latRange: { de: '0° – 23.5° N', en: '0° – 23.5° N' },
    color: '#e11d48',
    fillColor: '#f43f5e',
    beaconX: 275,
    beaconY: 215,
    polygonPath: createBandPolygon(BOUNDARY_POINTS.subtropicalTropicalN, BOUNDARY_POINTS.equator),
  },
  {
    id: 'TROPICAL_SOUTH',
    zone: 'TROPICAL',
    hemisphere: 'SOUTHERN',
    name: { de: 'Tropen & Äquatorial Süd', en: 'Tropical & Equatorial South' },
    geoAreas: { de: 'Südliches Amazonasbecken, Peru, Kongo, Tansania, Indonesien, N-Australien', en: 'Southern Amazon, Peru, Congo, Tanzania, Indonesia, N-Australia' },
    usda: 'USDA 11–13',
    latRange: { de: '23.5° S – 0°', en: '23.5° S – 0°' },
    color: '#e11d48',
    fillColor: '#f43f5e',
    beaconX: 325,
    beaconY: 280,
    polygonPath: createBandPolygon(BOUNDARY_POINTS.equator, BOUNDARY_POINTS.tropicalSubtropicalS),
  },
  {
    id: 'SUBTROPICAL_SOUTH',
    zone: 'SUBTROPICAL',
    hemisphere: 'SOUTHERN',
    name: { de: 'Subtropisch Süd', en: 'Subtropical South' },
    geoAreas: { de: 'Südafrika, Südbrasilien, Uruguay, Subtropisches Australien (Perth/Brisbane)', en: 'South Africa, Southern Brazil, Uruguay, Subtropical Australia' },
    usda: 'USDA 8–10',
    latRange: { de: '23.5° – 35° S', en: '23.5° – 35° S' },
    color: '#d97706',
    fillColor: '#f59e0b',
    beaconX: 550,
    beaconY: 332,
    polygonPath: createBandPolygon(BOUNDARY_POINTS.tropicalSubtropicalS, BOUNDARY_POINTS.subtropicalTemperateS),
  },
  {
    id: 'TEMPERATE_SOUTH',
    zone: 'TEMPERATE',
    hemisphere: 'SOUTHERN',
    name: { de: 'Gemäßigt Süd', en: 'Temperate South' },
    geoAreas: { de: 'Neuseeland, Melbourne, Tasmanien, Patagonien (Chile/Argentinien)', en: 'New Zealand, Melbourne, Tasmania, Patagonia (Chile/Argentina)' },
    usda: 'USDA 5–7',
    latRange: { de: '35° – 55° S', en: '35° – 55° S' },
    color: '#16a34a',
    fillColor: '#22c55e',
    beaconX: 920,
    beaconY: 368,
    polygonPath: createBandPolygon(BOUNDARY_POINTS.subtropicalTemperateS, BOUNDARY_POINTS.temperateBorealS),
  },
  {
    id: 'BOREAL_SOUTH',
    zone: 'BOREAL',
    hemisphere: 'SOUTHERN',
    name: { de: 'Kaltgemäßigt Süd', en: 'Cold Temperate / Subantarctic South' },
    geoAreas: { de: 'Feuerland, Falklandinseln, Subantarktis', en: 'Tierra del Fuego, Falkland Islands, Subantarctic' },
    usda: 'USDA 2–4',
    latRange: { de: '55° – 70° S', en: '55° – 70° S' },
    color: '#0284c7',
    fillColor: '#38bdf8',
    beaconX: 312,
    beaconY: 420,
    polygonPath: createBandPolygon(BOUNDARY_POINTS.temperateBorealS, MAP_BOTTOM_EDGE),
  },
];

export interface ClimateBoundaryDisplay {
  id: string;
  name: { en: string; de: string };
  d: string;
  stroke: string;
  strokeWidth: number;
  dashArray: string;
  opacity: number;
}

export const CLIMATE_DISPLAY_BOUNDARIES: ClimateBoundaryDisplay[] = [
  {
    id: 'boreal-temperate-n',
    name: {
      en: 'Boreal / Temperate Boundary (Gulf Stream lift in Europe ~62°N vs Labrador Current dip ~48°N)',
      de: 'Boreal / Gemäßigt Grenze (Golfstrom-Ausbuchtung Europa ~62°N vs Labradorstrom ~48°N)',
    },
    d: pointsToSvgPath(BOUNDARY_POINTS.borealTemperateN),
    stroke: '#38bdf8',
    strokeWidth: 1.1,
    dashArray: '3 3',
    opacity: 0.6,
  },
  {
    id: 'temperate-subtropical-n',
    name: {
      en: 'Temperate / Subtropical Boundary (Mediterranean Basin ~43°N & California ~39°N)',
      de: 'Gemäßigt / Subtropisch Grenze (Mittelmeerraum ~43°N & Kalifornien ~39°N)',
    },
    d: pointsToSvgPath(BOUNDARY_POINTS.temperateSubtropicalN),
    stroke: '#4ade80',
    strokeWidth: 1.0,
    dashArray: '3 3',
    opacity: 0.5,
  },
  {
    id: 'subtropical-tropical-n',
    name: {
      en: 'Tropic of Cancer Boundary (~23.5°N)',
      de: 'Nördlicher Wendekreis (~23.5°N)',
    },
    d: pointsToSvgPath(BOUNDARY_POINTS.subtropicalTropicalN),
    stroke: '#fbbf24',
    strokeWidth: 0.9,
    dashArray: '4 4',
    opacity: 0.5,
  },
  {
    id: 'equator',
    name: {
      en: 'Equator 0° (ITCZ Division: Northern vs Southern Hemisphere)',
      de: 'Äquator 0° (ITCZ-Teilung: Nord- vs Südhalbkugel)',
    },
    d: pointsToSvgPath(BOUNDARY_POINTS.equator),
    stroke: '#ffffff',
    strokeWidth: 1.4,
    dashArray: '6 3',
    opacity: 0.85,
  },
  {
    id: 'tropical-subtropical-s',
    name: {
      en: 'Tropic of Capricorn Boundary (~23.5°S / Humboldt Current lift in Peru)',
      de: 'Südlicher Wendekreis (~23.5°S / Humboldtstrom-Einfluss Peru)',
    },
    d: pointsToSvgPath(BOUNDARY_POINTS.tropicalSubtropicalS),
    stroke: '#fbbf24',
    strokeWidth: 0.9,
    dashArray: '4 4',
    opacity: 0.5,
  },
  {
    id: 'subtropical-temperate-s',
    name: {
      en: 'Subtropical / Temperate Boundary (~35°S Cape Town, Melbourne, Santiago)',
      de: 'Subtropisch / Gemäßigt Grenze (~35°S Kapstadt, Melbourne, Santiago)',
    },
    d: pointsToSvgPath(BOUNDARY_POINTS.subtropicalTemperateS),
    stroke: '#4ade80',
    strokeWidth: 1.0,
    dashArray: '3 3',
    opacity: 0.5,
  },
  {
    id: 'temperate-boreal-s',
    name: {
      en: 'Temperate / Subantarctic Boundary (~52°–55°S Patagonia / Tierra del Fuego)',
      de: 'Gemäßigt / Subantarktis Grenze (~52°–55°S Patagonien / Feuerland)',
    },
    d: pointsToSvgPath(BOUNDARY_POINTS.temperateBorealS),
    stroke: '#38bdf8',
    strokeWidth: 1.1,
    dashArray: '3 3',
    opacity: 0.6,
  },
];
