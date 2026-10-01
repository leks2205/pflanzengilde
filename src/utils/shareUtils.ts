import { ClimateZone, GuildPlant, Hemisphere, Language, SoilType, StarTree } from '../types/guild';
import { GardenStarPlantInstance } from '../types/garden';
import { STAR_TREES } from '../data/starTrees';
import { GUILD_PLANTS, isRetiredPlantId } from '../data/guildPlants';

export const SOIL_TYPES: SoilType[] = ['LOAM', 'CLAY', 'SANDY', 'CHALKY', 'ACIDIC', 'SILT'];
export const CLIMATE_ZONES: ClimateZone[] = ['BOREAL', 'TEMPERATE', 'SUBTROPICAL', 'TROPICAL'];

export interface BuildShareUrlOptions {
  starTree: StarTree;
  selectedPlants: GuildPlant[];
  soil?: SoilType;
  zone?: ClimateZone;
  hemisphere?: Hemisphere;
  language?: Language;
  baseUrl?: string;
  useShareRoute?: boolean; // default true -> /share/<treeId>/?g=...
}

export interface ParsedGuildUrlData {
  treeId: string | null;
  plantIds: string[];
  soil: SoilType | null;
  zone: ClimateZone | null;
  hemisphere: Hemisphere | null;
  language: Language | null;
  hasGuildParams: boolean;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** Unsigned LEB128: 7 bits per byte, high bit = more bytes follow. */
function pushVarint(out: number[], value: number): void {
  let v = Math.max(0, Math.floor(value));
  while (v >= 0x80) {
    out.push((v & 0x7f) | 0x80);
    v = Math.floor(v / 128);
  }
  out.push(v);
}

/** Reads an unsigned LEB128 value; null when the buffer ends mid-value. */
function readVarint(bytes: Uint8Array, offset: number): { value: number; next: number } | null {
  let value = 0;
  let factor = 1;
  let pos = offset;
  while (pos < bytes.length && pos - offset < 5) {
    const b = bytes[pos++];
    value += (b & 0x7f) * factor;
    if ((b & 0x80) === 0) return { value, next: pos };
    factor *= 128;
  }
  return null;
}

/** Bitmask over GUILD_PLANTS indices, trailing zero bytes trimmed. */
function buildPlantMask(plantIds: Iterable<string>): Uint8Array {
  const mask = new Uint8Array(Math.ceil(GUILD_PLANTS.length / 8));
  for (const id of plantIds) {
    const idx = GUILD_PLANTS.findIndex(p => p.id === id);
    if (idx >= 0) mask[idx >> 3] |= (1 << (idx & 7));
  }
  let len = mask.length;
  while (len > 0 && mask[len - 1] === 0) len--;
  return mask.subarray(0, len);
}

/** Plant ids from a bitmask; retired companions in old links are dropped silently. */
function readPlantMask(bytes: Uint8Array, start: number, end: number): string[] {
  const ids: string[] = [];
  for (let b = start; b < end; b++) {
    const val = bytes[b];
    for (let bit = 0; bit < 8; bit++) {
      if ((val & (1 << bit)) !== 0) {
        const plantIdx = (b - start) * 8 + bit;
        const plant = GUILD_PLANTS[plantIdx];
        if (plant && !plant.retired) ids.push(plant.id);
      }
    }
  }
  return ids;
}

/**
 * Compact guild code (base64url). Indices refer to array order in the data files, so entries may
 * only ever be appended there, or existing links break.
 *
 * Byte 0: treeField (bits 0-4) | soilIdx (bits 5-7, 7 = none)
 * Byte 1: zoneIdx (bits 0-2, 7 = none) | hemiBit (3) | langBit (4) | version (bits 5-7)
 *
 * version 0 (legacy, every link made before v1): treeField = treeIdx, 31 = none, so only trees
 *   0..30 fit. Bytes 2..: plant bitmask.
 * version 1 (current): treeField 0..29 = treeIdx, 31 = none, 30 = extended: an unsigned LEB128
 *   varint holding (treeIdx - 30) follows byte 1. The plant bitmask comes after it.
 * Plant bitmask: bit i = GUILD_PLANTS[i], trailing zero bytes trimmed (no length limit).
 * The legacy encoder always wrote version 0 and its decoder ignored the version bits, so every
 * code whose version is not 1 is decoded exactly as before.
 */
const GUILD_CODE_VERSION = 1;
const GUILD_TREE_EXTENDED = 30;
const GUILD_TREE_NONE = 31;

export function encodeGuildToCode(options: {
  starTree: StarTree;
  selectedPlants: GuildPlant[];
  soil?: SoilType;
  zone?: ClimateZone;
  hemisphere?: Hemisphere;
  language?: Language;
}): string {
  const treeIdx = STAR_TREES.findIndex(t => t.id === options.starTree.id);
  const treeField = treeIdx < 0 ? GUILD_TREE_NONE : Math.min(treeIdx, GUILD_TREE_EXTENDED);

  const soilIdx = options.soil ? SOIL_TYPES.indexOf(options.soil) : -1;
  const s = soilIdx >= 0 && soilIdx < 7 ? soilIdx : 7;

  const zoneIdx = options.zone ? CLIMATE_ZONES.indexOf(options.zone) : -1;
  const z = zoneIdx >= 0 && zoneIdx < 7 ? zoneIdx : 7;

  const hemiIdx = options.hemisphere === 'SOUTHERN' ? 1 : 0;
  const langIdx = options.language === 'en' ? 1 : 0;

  const out: number[] = [
    (treeField & 0x1f) | ((s & 0x07) << 5),
    (z & 0x07) | ((hemiIdx & 0x01) << 3) | ((langIdx & 0x01) << 4) | ((GUILD_CODE_VERSION & 0x07) << 5),
  ];
  if (treeField === GUILD_TREE_EXTENDED) {
    pushVarint(out, treeIdx - GUILD_TREE_EXTENDED);
  }

  const mask = buildPlantMask(options.selectedPlants.map(p => p.id));
  for (let i = 0; i < mask.length; i++) out.push(mask[i]);

  return bytesToBase64Url(new Uint8Array(out));
}

export function decodeGuildFromCode(code: string): Omit<ParsedGuildUrlData, 'hasGuildParams'> | null {
  try {
    const bytes = base64UrlToBytes(code);
    if (bytes.length < 2) return null;

    const byte0 = bytes[0];
    const byte1 = bytes[1];

    const treeField = byte0 & 0x1f;
    const soilIdx = (byte0 >> 5) & 0x07;
    const zoneIdx = byte1 & 0x07;
    const hemiIdx = (byte1 >> 3) & 0x01;
    const langIdx = (byte1 >> 4) & 0x01;
    const version = (byte1 >> 5) & 0x07;

    let treeIdx = treeField;
    let maskStart = 2;
    if (version === GUILD_CODE_VERSION) {
      if (treeField === GUILD_TREE_NONE) {
        treeIdx = -1;
      } else if (treeField === GUILD_TREE_EXTENDED) {
        const ext = readVarint(bytes, 2);
        if (!ext) return null;
        treeIdx = GUILD_TREE_EXTENDED + ext.value;
        maskStart = ext.next;
      }
    }

    const treeId = treeIdx >= 0 && treeIdx < STAR_TREES.length ? STAR_TREES[treeIdx].id : null;
    const soil = soilIdx < SOIL_TYPES.length ? SOIL_TYPES[soilIdx] : null;
    const zone = zoneIdx < CLIMATE_ZONES.length ? CLIMATE_ZONES[zoneIdx] : null;
    const hemisphere = hemiIdx === 1 ? 'SOUTHERN' : 'NORTHERN';
    const language = langIdx === 1 ? 'en' : 'de';

    const plantIds = readPlantMask(bytes, maskStart, bytes.length);

    return {
      treeId,
      plantIds,
      soil,
      zone,
      hemisphere,
      language,
    };
  } catch (e) {
    return null;
  }
}

// e.g. https://pflanzengilde.de/share/tree-apple/?g=AAEv (the /share/ page carries per-tree OG tags)
export function buildShareUrl(options: BuildShareUrlOptions): string {
  const origin = options.baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://pflanzengilde.de');
  const code = encodeGuildToCode(options);

  const useShare = options.useShareRoute !== false;
  const path = useShare ? `/share/${options.starTree.id}/` : '/';
  return `${origin}${path}?g=${code}`;
}

export function buildEmbedUrl(options: BuildShareUrlOptions): string {
  const origin = options.baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://pflanzengilde.de');
  const code = encodeGuildToCode(options);

  return `${origin}/embed/?g=${code}`;
}

export function buildEmbedIframeCode(embedUrl: string, width = 640, height = 360): string {
  return `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" style="border:0; border-radius: 16px; overflow: hidden; max-width: 100%; box-shadow: 0 4px 20px rgba(0,0,0,0.12);" title="Pflanzengilde.de Permakultur-Gilde" allow="clipboard-write"></iframe>`;
}

// Accepts the compact ?g= code as well as legacy ?tree=&plants= links.
export function parseGuildUrl(searchString: string, pathname: string = '/'): ParsedGuildUrlData {
  const params = new URLSearchParams(searchString || '');

  const shortCode = params.get('g');
  if (shortCode) {
    const decoded = decodeGuildFromCode(shortCode);
    if (decoded && (decoded.treeId || decoded.plantIds.length > 0)) {
      return {
        treeId: decoded.treeId,
        plantIds: decoded.plantIds,
        soil: decoded.soil,
        zone: decoded.zone,
        hemisphere: decoded.hemisphere,
        language: decoded.language,
        hasGuildParams: true,
      };
    }
  }

  let treeId: string | null = params.get('tree');
  if (!treeId) {
    const match = pathname.match(/\/(share|guild|embed)\/([a-zA-Z0-9_-]+)/);
    if (match && match[2]) {
      treeId = match[2];
    }
  }

  // ?plants=a,b or repeated ?plant=a&plant=b
  const plantsRaw = params.get('plants');
  let plantIds: string[] = [];
  if (plantsRaw) {
    plantIds = plantsRaw
      .split(',')
      .map(id => id.trim())
      .filter(Boolean);
  } else {
    plantIds = params.getAll('plant').map(id => id.trim()).filter(Boolean);
  }
  plantIds = plantIds.filter(id => !isRetiredPlantId(id));

  const soilRaw = params.get('soil')?.toUpperCase();
  let soil: SoilType | null = null;
  if (soilRaw && (SOIL_TYPES as string[]).includes(soilRaw)) {
    soil = soilRaw as SoilType;
  }

  const zoneRaw = params.get('zone')?.toUpperCase();
  let zone: ClimateZone | null = null;
  if (zoneRaw && (CLIMATE_ZONES as string[]).includes(zoneRaw)) {
    zone = zoneRaw as ClimateZone;
  }

  const hemiRaw = params.get('hemi')?.toUpperCase() || params.get('hemisphere')?.toUpperCase();
  let hemisphere: Hemisphere | null = null;
  if (hemiRaw === 'NORTHERN' || hemiRaw === 'SOUTHERN') {
    hemisphere = hemiRaw as Hemisphere;
  }

  const langRaw = params.get('lang')?.toLowerCase();
  let language: Language | null = null;
  if (langRaw === 'de' || langRaw === 'en') {
    language = langRaw as Language;
  }

  const hasGuildParams = Boolean(treeId || plantIds.length > 0);

  return {
    treeId,
    plantIds,
    soil,
    zone,
    hemisphere,
    language,
    hasGuildParams,
  };
}

export interface EncodedGardenStarPlant {
  treeId: string;
  xM: number;
  yM: number;
  selectedPlantIds: string[];
}

export interface EncodeGardenOptions {
  gardenName?: string;
  starPlants: EncodedGardenStarPlant[];
  soil?: SoilType;
  zone?: ClimateZone;
  hemisphere?: Hemisphere;
  language?: Language;
  autoShadeEnabled?: boolean;
}

export interface DecodedGardenData {
  gardenName: string | null;
  starPlants: GardenStarPlantInstance[];
  soil: SoilType | null;
  zone: ClimateZone | null;
  hemisphere: Hemisphere;
  language: Language;
  autoShadeEnabled: boolean;
}

/**
 * Garden code layout (base64url):
 * Byte 0: soil (3 bits) | zone (3 bits) | hemiBit | langBit
 * Byte 1: version (3 bits) | autoShade | hasCustomName
 *
 * version 1 (legacy): byte 2 = star count, then per star: treeIdx (1 byte), x/y as int16
 *   decimetres (big endian), mask length (1 byte), mask bytes; optional trailing name as length
 *   byte + UTF-8. The single bytes cap trees at 255, the mask at 2040 plants and the name at 255 bytes.
 * version 2 (current): same order, but star count, treeIdx, mask length and name length are
 *   unsigned LEB128 varints (still one byte while < 128), so those ceilings are gone. Unknown
 *   trees are left out instead of being written as index 0.
 * Every code whose version is not 2 is decoded with the legacy rules, exactly as before.
 */
const GARDEN_CODE_VERSION = 2;

export function encodeGardenToCode(options: EncodeGardenOptions): string {
  const soilIdx = options.soil ? SOIL_TYPES.indexOf(options.soil) : -1;
  const s = soilIdx >= 0 && soilIdx < 7 ? soilIdx : 7;

  const zoneIdx = options.zone ? CLIMATE_ZONES.indexOf(options.zone) : -1;
  const z = zoneIdx >= 0 && zoneIdx < 7 ? zoneIdx : 7;

  const hemiBit = options.hemisphere === 'SOUTHERN' ? 1 : 0;
  const langBit = options.language === 'en' ? 1 : 0;
  const autoShadeBit = options.autoShadeEnabled ? 1 : 0;

  const trimmedName = (options.gardenName || '').trim();
  const isDefaultName =
    !trimmedName ||
    trimmedName === 'Mein Permakultur-Garten' ||
    trimmedName === 'My Permaculture Garden';
  const hasCustomNameBit = isDefaultName ? 0 : 1;

  const byte0 = (s & 0x07) | ((z & 0x07) << 3) | ((hemiBit & 0x01) << 6) | ((langBit & 0x01) << 7);
  const byte1 = (GARDEN_CODE_VERSION & 0x07) | ((autoShadeBit & 0x01) << 3) | ((hasCustomNameBit & 0x01) << 4);

  const stars = options.starPlants
    .map(sp => ({ sp, tIdx: STAR_TREES.findIndex(t => t.id === sp.treeId) }))
    .filter(entry => entry.tIdx >= 0);

  const chunks: number[] = [byte0, byte1];
  pushVarint(chunks, stars.length);

  for (const { sp, tIdx } of stars) {
    const xDeci = Math.max(-32768, Math.min(32767, Math.round(sp.xM * 10)));
    const yDeci = Math.max(-32768, Math.min(32767, Math.round(sp.yM * 10)));
    const xU16 = xDeci & 0xffff;
    const yU16 = yDeci & 0xffff;

    pushVarint(chunks, tIdx);
    chunks.push((xU16 >> 8) & 0xff, xU16 & 0xff, (yU16 >> 8) & 0xff, yU16 & 0xff);

    const mask = buildPlantMask(sp.selectedPlantIds);
    pushVarint(chunks, mask.length);
    for (let b = 0; b < mask.length; b++) chunks.push(mask[b]);
  }

  if (hasCustomNameBit === 1) {
    // Slice by code points so a surrogate pair is never cut in half
    const nameBytes = new TextEncoder().encode(Array.from(trimmedName).slice(0, 64).join(''));
    pushVarint(chunks, nameBytes.length);
    for (let b = 0; b < nameBytes.length; b++) chunks.push(nameBytes[b]);
  }

  return bytesToBase64Url(new Uint8Array(chunks));
}

export function decodeGardenFromCode(code: string): DecodedGardenData | null {
  try {
    const bytes = base64UrlToBytes(code);
    if (bytes.length < 3) return null;

    const byte0 = bytes[0];
    const byte1 = bytes[1];

    const soilIdx = byte0 & 0x07;
    const zoneIdx = (byte0 >> 3) & 0x07;
    const hemiBit = (byte0 >> 6) & 0x01;
    const langBit = (byte0 >> 7) & 0x01;

    const version = byte1 & 0x07;
    const autoShadeBit = (byte1 >> 3) & 0x01;
    const hasCustomNameBit = (byte1 >> 4) & 0x01;
    const isLegacy = version !== GARDEN_CODE_VERSION;

    const soil: SoilType | null = soilIdx < SOIL_TYPES.length ? SOIL_TYPES[soilIdx] : null;
    const zone: ClimateZone | null = zoneIdx < CLIMATE_ZONES.length ? CLIMATE_ZONES[zoneIdx] : null;
    const hemisphere: Hemisphere = hemiBit === 1 ? 'SOUTHERN' : 'NORTHERN';
    const language: Language = langBit === 1 ? 'en' : 'de';
    const autoShadeEnabled = autoShadeBit === 1;

    // Legacy count/index/length fields are single bytes, v2 ones are varints; null = data ran out.
    const readField = (pos: number): { value: number; next: number } | null => {
      if (isLegacy) return pos < bytes.length ? { value: bytes[pos], next: pos + 1 } : null;
      return readVarint(bytes, pos);
    };

    const countField = readField(2);
    if (!countField) return null;
    const count = countField.value;
    let offset = countField.next;
    const starPlants: GardenStarPlantInstance[] = [];

    for (let i = 0; i < count; i++) {
      const treeField = readField(offset);
      // tree field + 4 coordinate bytes + at least one mask-length byte
      if (!treeField || treeField.next + 5 > bytes.length) break;
      const treeIdx = treeField.value;
      offset = treeField.next;
      const xRaw = (bytes[offset] << 8) | bytes[offset + 1];
      offset += 2;
      const yRaw = (bytes[offset] << 8) | bytes[offset + 1];
      offset += 2;
      const maskField = readField(offset);
      if (!maskField) break;
      const maskLen = maskField.value;
      offset = maskField.next;

      if (offset + maskLen > bytes.length) break;

      const xDeci = xRaw >= 0x8000 ? xRaw - 0x10000 : xRaw;
      const yDeci = yRaw >= 0x8000 ? yRaw - 0x10000 : yRaw;
      const xM = Number((xDeci / 10).toFixed(1));
      const yM = Number((yDeci / 10).toFixed(1));

      const selectedPlantIds = readPlantMask(bytes, offset, offset + maskLen);
      offset += maskLen;

      // Legacy links fell back to the first tree for unknown indices; keep that so they decode as before.
      const starTree: StarTree | undefined = STAR_TREES[treeIdx] || (isLegacy ? STAR_TREES[0] : undefined);
      if (!starTree) continue;
      starPlants.push({
        instanceId: `garden-tree-${i}-${starTree.id}`,
        treeId: starTree.id,
        starTree,
        xM,
        yM,
        selectedPlantIds,
      });
    }

    let gardenName: string | null = null;
    if (hasCustomNameBit === 1 && offset < bytes.length) {
      const nameField = readField(offset);
      if (nameField && nameField.next + nameField.value <= bytes.length) {
        gardenName = new TextDecoder().decode(bytes.subarray(nameField.next, nameField.next + nameField.value));
      }
    }

    return {
      gardenName,
      starPlants,
      soil,
      zone,
      hemisphere,
      language,
      autoShadeEnabled,
    };
  } catch (e) {
    return null;
  }
}

export function buildGardenShareUrl(options: EncodeGardenOptions & { baseUrl?: string }): string {
  const origin = options.baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://pflanzengilde.de');
  const code = encodeGardenToCode(options);
  return `${origin}/garten/?garden=${code}`;
}

export function buildGardenEmbedUrl(options: EncodeGardenOptions & { baseUrl?: string }): string {
  const origin = options.baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://pflanzengilde.de');
  const code = encodeGardenToCode(options);
  return `${origin}/embed/?garden=${code}`;
}

export function parseGardenUrl(searchString: string): DecodedGardenData | null {
  const params = new URLSearchParams(searchString || '');
  const gardenCode = params.get('garden');
  if (!gardenCode) return null;
  return decodeGardenFromCode(gardenCode);
}

