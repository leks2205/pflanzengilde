import {
  encodeGuildToCode,
  decodeGuildFromCode,
  encodeGardenToCode,
  decodeGardenFromCode,
  buildGardenShareUrl,
  buildGardenEmbedUrl,
  parseGardenUrl,
  parseGuildUrl
} from '../src/utils/shareUtils';
import { STAR_TREES } from '../src/data/starTrees';
import { GUILD_PLANTS } from '../src/data/guildPlants';

let totalChecks = 0;
let passedChecks = 0;

function assert(condition: boolean, msg: string) {
  totalChecks++;
  if (!condition) {
    console.error(`FAIL: ${msg}`);
    process.exitCode = 1;
  } else {
    passedChecks++;
  }
}

// 1. Basic Round-trip Encoding & Decoding
const appleTree = STAR_TREES.find(t => t.id === 'tree-apple')!;
const pearTree = STAR_TREES.find(t => t.id === 'tree-pear')!;
const walnutTree = STAR_TREES.find(t => t.id === 'tree-walnut')!;

const comfrey = GUILD_PLANTS.find(p => p.id === 'plant-comfrey')!;
const chives = GUILD_PLANTS.find(p => p.id === 'plant-chives')!;
const clover = GUILD_PLANTS.find(p => p.id === 'plant-white-clover')!;

const testStarPlants = [
  {
    treeId: appleTree.id,
    xM: 5.5,
    yM: -3.2,
    selectedPlantIds: [comfrey.id, chives.id]
  },
  {
    treeId: pearTree.id,
    xM: -8.0,
    yM: 12.4,
    selectedPlantIds: [clover.id]
  },
  {
    treeId: walnutTree.id,
    xM: 0.0,
    yM: 0.0,
    selectedPlantIds: []
  }
];

const gardenCode = encodeGardenToCode({
  gardenName: 'Mein Obstgarten im Waldviertel',
  starPlants: testStarPlants,
  soil: 'SANDY',
  zone: 'BOREAL',
  hemisphere: 'NORTHERN',
  language: 'de',
  autoShadeEnabled: true
});

assert(typeof gardenCode === 'string' && gardenCode.length > 0, `Generated compact garden code: ${gardenCode} (${gardenCode.length} chars)`);

const decoded = decodeGardenFromCode(gardenCode);
assert(Boolean(decoded), 'Successfully decoded garden code');

if (decoded) {
  assert(decoded.gardenName === 'Mein Obstgarten im Waldviertel', `Decoded garden name matches: "${decoded.gardenName}"`);
  assert(decoded.soil === 'SANDY', `Decoded soil matches: "${decoded.soil}"`);
  assert(decoded.zone === 'BOREAL', `Decoded zone matches: "${decoded.zone}"`);
  assert(decoded.hemisphere === 'NORTHERN', `Decoded hemisphere matches: "${decoded.hemisphere}"`);
  assert(decoded.language === 'de', `Decoded language matches: "${decoded.language}"`);
  assert(decoded.autoShadeEnabled === true, `Decoded autoShadeEnabled matches: ${decoded.autoShadeEnabled}`);
  assert(decoded.starPlants.length === 3, `Decoded star tree count: ${decoded.starPlants.length}`);

  // Test Tree 1
  const t1 = decoded.starPlants[0];
  assert(t1.treeId === appleTree.id, `Tree 1 id matches: ${t1.treeId}`);
  assert(Math.abs(t1.xM - 5.5) < 0.05, `Tree 1 xM close to 5.5 (got: ${t1.xM})`);
  assert(Math.abs(t1.yM - -3.2) < 0.05, `Tree 1 yM close to -3.2 (got: ${t1.yM})`);
  assert(t1.selectedPlantIds.includes(comfrey.id), 'Tree 1 includes comfrey');
  assert(t1.selectedPlantIds.includes(chives.id), 'Tree 1 includes chives');

  // Test Tree 2
  const t2 = decoded.starPlants[1];
  assert(t2.treeId === pearTree.id, `Tree 2 id matches: ${t2.treeId}`);
  assert(Math.abs(t2.xM - -8.0) < 0.05, `Tree 2 xM close to -8.0 (got: ${t2.xM})`);
  assert(Math.abs(t2.yM - 12.4) < 0.05, `Tree 2 yM close to 12.4 (got: ${t2.yM})`);
  assert(t2.selectedPlantIds.includes(clover.id), 'Tree 2 includes clover');

  // Test Tree 3
  const t3 = decoded.starPlants[2];
  assert(t3.treeId === walnutTree.id, `Tree 3 id matches: ${t3.treeId}`);
  assert(Math.abs(t3.xM - 0.0) < 0.05, `Tree 3 xM is 0 (got: ${t3.xM})`);
  assert(Math.abs(t3.yM - 0.0) < 0.05, `Tree 3 yM is 0 (got: ${t3.yM})`);
  assert(t3.selectedPlantIds.length === 0, 'Tree 3 has 0 selected companion IDs');
}

// 2. URL builders & Parser
const shareUrl = buildGardenShareUrl({
  baseUrl: 'https://pflanzengilde.de',
  gardenName: 'Community Orchard',
  starPlants: testStarPlants,
  language: 'en',
  soil: 'CLAY'
});
assert(shareUrl.startsWith('https://pflanzengilde.de/garten/?garden='), `Share URL is well-formed: ${shareUrl}`);

const embedUrl = buildGardenEmbedUrl({
  baseUrl: 'https://pflanzengilde.de',
  gardenName: 'Community Orchard',
  starPlants: testStarPlants,
  language: 'en',
  soil: 'CLAY'
});
assert(embedUrl.startsWith('https://pflanzengilde.de/embed/?garden='), `Embed URL is well-formed: ${embedUrl}`);

const parsedFromSearch = parseGardenUrl(`?garden=${shareUrl.split('?garden=')[1]}`);
assert(Boolean(parsedFromSearch), 'Successfully parsed garden URL search string');
if (parsedFromSearch) {
  assert(parsedFromSearch.gardenName === 'Community Orchard', `Parsed name: ${parsedFromSearch.gardenName}`);
  assert(parsedFromSearch.language === 'en', `Parsed language: ${parsedFromSearch.language}`);
  assert(parsedFromSearch.soil === 'CLAY', `Parsed soil: ${parsedFromSearch.soil}`);
  assert(parsedFromSearch.starPlants.length === 3, 'Parsed 3 star trees');
}

// 3. Invalid or Missing Codes
assert(parseGardenUrl('') === null, 'Empty search string returns null');
assert(parseGardenUrl('?g=invalid') === null, 'Missing garden param returns null');
assert(decodeGardenFromCode('invalid!base64') === null, 'Corrupt base64 code returns null');

// 4. Backward compatibility: codes produced by the legacy encoders (guild v0, garden v1, taken
// from git HEAD before the format change) must keep decoding exactly as the legacy decoders did.
// Index order in the data files is append-only, so these fixtures stay valid as data grows.
const legacyGuildFixtures: { code: string; expected: unknown }[] = [
  {
    code: 'AAEL',
    expected: { treeId: 'tree-apple', plantIds: ['plant-comfrey', 'plant-white-clover', 'plant-chives'], soil: 'LOAM', zone: 'TEMPERATE', hemisphere: 'NORTHERN', language: 'de' }
  },
  {
    code: 'OB-AAAAB',
    expected: { treeId: 'herb-hemp', plantIds: ['plant-borage', 'plant-hosta'], soil: 'CLAY', zone: null, hemisphere: 'SOUTHERN', language: 'en' }
  },
  {
    code: '_wcB',
    expected: { treeId: null, plantIds: ['plant-comfrey'], soil: null, zone: null, hemisphere: 'NORTHERN', language: 'de' }
  }
];
for (const { code, expected } of legacyGuildFixtures) {
  const got = decodeGuildFromCode(code);
  assert(JSON.stringify(got) === JSON.stringify(expected), `Legacy guild code ${code} decodes as before (got ${JSON.stringify(got)})`);
}

const legacyGardenCode = 'AhkCAAA3_-ABCRj_sAB8BAAAAAEPTWVpbiBPYnN0Z2FydGVu';
const legacyGardenExpected = {
  gardenName: 'Mein Obstgarten',
  starPlants: [
    { instanceId: 'garden-tree-0-tree-apple', treeId: 'tree-apple', xM: 5.5, yM: -3.2, selectedPlantIds: ['plant-comfrey', 'plant-chives'] },
    { instanceId: 'garden-tree-1-herb-hemp', treeId: 'herb-hemp', xM: -8, yM: 12.4, selectedPlantIds: ['plant-hosta'] }
  ],
  soil: 'SANDY',
  zone: 'BOREAL',
  hemisphere: 'NORTHERN',
  language: 'de',
  autoShadeEnabled: true
};
const legacyGarden = decodeGardenFromCode(legacyGardenCode);
assert(Boolean(legacyGarden), 'Legacy garden code decodes');
if (legacyGarden) {
  const comparable = {
    ...legacyGarden,
    starPlants: legacyGarden.starPlants.map(sp => ({
      instanceId: sp.instanceId,
      treeId: sp.treeId,
      xM: sp.xM,
      yM: sp.yM,
      selectedPlantIds: sp.selectedPlantIds
    }))
  };
  assert(JSON.stringify(comparable) === JSON.stringify(legacyGardenExpected), `Legacy garden code decodes as before (got ${JSON.stringify(comparable)})`);
}

// 5. New guild format: version marker set, round-trips, and tree indices beyond the old 5-bit field
const guildVersionOf = (code: string) => (Buffer.from(code, 'base64url')[1] >> 5) & 0x07;
const gardenVersionOf = (code: string) => Buffer.from(code, 'base64url')[1] & 0x07;

const newGuildCode = encodeGuildToCode({ starTree: appleTree, selectedPlants: [comfrey, chives, clover], soil: 'LOAM', zone: 'TEMPERATE', hemisphere: 'SOUTHERN', language: 'en' });
assert(guildVersionOf(newGuildCode) === 1, `New guild codes carry version 1 (code ${newGuildCode})`);
const newGuildDecoded = decodeGuildFromCode(newGuildCode);
assert(
  JSON.stringify(newGuildDecoded) === JSON.stringify({
    treeId: 'tree-apple',
    plantIds: GUILD_PLANTS.filter(p => [comfrey.id, chives.id, clover.id].includes(p.id)).map(p => p.id),
    soil: 'LOAM', zone: 'TEMPERATE', hemisphere: 'SOUTHERN', language: 'en'
  }),
  `New guild code round-trips (got ${JSON.stringify(newGuildDecoded)})`
);
assert(newGuildCode.length === 'AAEL'.length, `Guilds with trees below index 30 are as short as legacy codes (${newGuildCode})`);

for (const tree of STAR_TREES) {
  const code = encodeGuildToCode({ starTree: tree, selectedPlants: [comfrey] });
  const back = decodeGuildFromCode(code);
  assert(back?.treeId === tree.id && back.plantIds.join() === comfrey.id, `Guild round-trip for ${tree.id} (index ${STAR_TREES.indexOf(tree)})`);
}
const noTree = decodeGuildFromCode(encodeGuildToCode({ starTree: { ...appleTree, id: 'tree-does-not-exist' }, selectedPlants: [chives] }));
assert(noTree?.treeId === null && noTree.plantIds.join() === chives.id, 'Unknown tree encodes as "no tree" in the new format');

// Simulate a much larger tree catalogue: indices 29..300 must survive (old format stopped at 30).
const realTreeCount = STAR_TREES.length;
const fillerTrees: typeof STAR_TREES = [];
for (let i = realTreeCount; i <= 300; i++) {
  fillerTrees.push({ ...appleTree, id: `tree-test-filler-${i}` });
}
STAR_TREES.push(...fillerTrees);
try {
  for (const idx of [29, 30, 31, 32, 63, 127, 128, 157, 158, 255, 300]) {
    const tree = STAR_TREES[idx];
    const guild = decodeGuildFromCode(encodeGuildToCode({ starTree: tree, selectedPlants: [comfrey, clover], soil: 'CLAY', language: 'en' }));
    assert(guild?.treeId === tree.id, `Guild tree index ${idx} round-trips (got ${guild?.treeId})`);
    assert(guild?.soil === 'CLAY' && guild.language === 'en', `Guild tree index ${idx} keeps soil/language`);
    assert(
      guild?.plantIds.length === 2 && guild.plantIds.includes(comfrey.id) && guild.plantIds.includes(clover.id),
      `Guild tree index ${idx} keeps its companions`
    );
  }

  // Garden codes: tree index > 255 (old single byte) and many trees (old count byte)
  const bigGardenStars = [0, 31, 200, 255, 256, 300].map((idx, i) => ({
    treeId: STAR_TREES[idx].id,
    xM: i * 1.5,
    yM: -i,
    selectedPlantIds: [comfrey.id]
  }));
  const bigGarden = decodeGardenFromCode(encodeGardenToCode({ starPlants: bigGardenStars, gardenName: 'Big' }));
  assert(
    JSON.stringify(bigGarden?.starPlants.map(sp => sp.treeId)) === JSON.stringify(bigGardenStars.map(s => s.treeId)),
    'Garden tree indices up to 300 round-trip'
  );

  const manyStars = Array.from({ length: 300 }, (_, i) => ({ treeId: STAR_TREES[i % STAR_TREES.length].id, xM: i / 10, yM: 0, selectedPlantIds: [] }));
  const manyDecoded = decodeGardenFromCode(encodeGardenToCode({ starPlants: manyStars, gardenName: 'Many' }));
  assert(manyDecoded?.starPlants.length === 300 && manyDecoded.gardenName === 'Many', `Gardens with more than 255 trees round-trip (got ${manyDecoded?.starPlants.length})`);
} finally {
  STAR_TREES.splice(realTreeCount);
}
assert(STAR_TREES.length === realTreeCount, 'Test filler trees removed again');

// 6. New garden format details
assert(gardenVersionOf(gardenCode) === 2, `New garden codes carry version 2 (code ${gardenCode})`);
const longName = '🌳'.repeat(80);
const longNameDecoded = decodeGardenFromCode(encodeGardenToCode({ gardenName: longName, starPlants: testStarPlants }));
assert(longNameDecoded?.gardenName === '🌳'.repeat(64), 'Names with 4-byte characters keep 64 characters (> 255 UTF-8 bytes)');
const unknownTreeGarden = decodeGardenFromCode(encodeGardenToCode({
  starPlants: [{ treeId: 'tree-does-not-exist', xM: 1, yM: 1, selectedPlantIds: [] }, testStarPlants[1]]
}));
assert(
  unknownTreeGarden?.starPlants.length === 1 && unknownTreeGarden.starPlants[0].treeId === pearTree.id,
  'Unknown trees are dropped instead of turning into apple trees'
);

// 7. Retired companions (southernwood, wormwood, sweet flag): their indices stay in GUILD_PLANTS so
// old codes keep decoding, but the decoders drop them silently instead of failing.
const retiredPlants = GUILD_PLANTS.filter(p => p.retired);
assert(
  JSON.stringify(retiredPlants.map(p => p.id).sort()) === JSON.stringify(['plant-southernwood', 'plant-sweet-flag', 'plant-wormwood']),
  `Exactly the three owner-retired companions are flagged (got ${retiredPlants.map(p => p.id).join(', ')})`
);
const guildWithRetired = decodeGuildFromCode(encodeGuildToCode({ starTree: appleTree, selectedPlants: [comfrey, ...retiredPlants, clover] }));
assert(
  guildWithRetired?.treeId === appleTree.id && JSON.stringify(guildWithRetired.plantIds) === JSON.stringify([comfrey.id, clover.id]),
  `Guild codes containing retired companions decode without them (got ${JSON.stringify(guildWithRetired?.plantIds)})`
);
const onlyRetired = decodeGuildFromCode(encodeGuildToCode({ starTree: appleTree, selectedPlants: retiredPlants }));
assert(onlyRetired?.treeId === appleTree.id && onlyRetired.plantIds.length === 0, 'A guild code with only retired companions still decodes (tree kept, no plants)');
const gardenWithRetired = decodeGardenFromCode(encodeGardenToCode({
  starPlants: [{ treeId: appleTree.id, xM: 0, yM: 0, selectedPlantIds: [chives.id, ...retiredPlants.map(p => p.id)] }]
}));
assert(
  JSON.stringify(gardenWithRetired?.starPlants[0]?.selectedPlantIds) === JSON.stringify([chives.id]),
  `Garden codes containing retired companions decode without them (got ${JSON.stringify(gardenWithRetired?.starPlants[0]?.selectedPlantIds)})`
);
const plainUrl = parseGuildUrl('?tree=tree-apple&plants=plant-wormwood,plant-comfrey,plant-sweet-flag', '/');
assert(JSON.stringify(plainUrl.plantIds) === JSON.stringify([comfrey.id]), `Plain ?plants= links drop retired companions (got ${JSON.stringify(plainUrl.plantIds)})`);

console.log(`garden share: ${passedChecks}/${totalChecks} checks passed`);
