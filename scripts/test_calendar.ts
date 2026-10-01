import { STAR_TREES } from '../src/data/starTrees';
import { GUILD_PLANTS } from '../src/data/guildPlants';
import { generateGuildCalendarIcs } from '../src/core/calendarExporter';
import { buildGardenIcsContent } from '../src/core/gardenCalendar';

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

// 1. Basic Generation Test (Apple Tree + Diverse Companions)
const appleTree = STAR_TREES.find(t => t.id === 'tree-apple')!;
const samplePlants = [
  GUILD_PLANTS.find(p => p.id === 'plant-comfrey')!, // Perennial, 3-4 chop flushes
  GUILD_PLANTS.find(p => p.id === 'plant-borage')!,  // Annual (perennial: false), chop & drop, nectar
  GUILD_PLANTS.find(p => p.id === 'plant-white-clover')!, // Perennial living mulch legume
  GUILD_PLANTS.find(p => p.id === 'plant-horseradish')!, // Perennial, biofumigant, edible root
  GUILD_PLANTS.find(p => p.id === 'plant-nasturtium')!, // Annual, pest repeller, living mulch
  GUILD_PLANTS.find(p => p.id === 'plant-sage')!, // Perennial subshrub, VOC priming
];

const icsDe = generateGuildCalendarIcs({
  starTree: appleTree,
  selectedPlants: samplePlants,
  selectedSoil: 'LOAM',
  selectedZone: 'TEMPERATE',
  hemisphere: 'NORTHERN',
  language: 'de'
});

assert(icsDe.startsWith('BEGIN:VCALENDAR\r\n'), 'Calendar starts with BEGIN:VCALENDAR');
assert(icsDe.endsWith('\r\nEND:VCALENDAR'), 'Calendar ends with END:VCALENDAR');
assert(icsDe.includes('VERSION:2.0'), 'Contains VERSION:2.0');
assert(icsDe.includes('X-WR-CALNAME:Pflanzengilde'), 'Contains German calendar name');

// 2. Line Folding & Octet Limit Verification
const rawLines = icsDe.split('\r\n');
let maxOctetLen = 0;
for (const line of rawLines) {
  const byteLen = Buffer.byteLength(line, 'utf-8');
  if (byteLen > maxOctetLen) maxOctetLen = byteLen;
  if (byteLen > 75) {
    console.error(`Line exceeded 75 octets (${byteLen}): "${line.slice(0, 50)}..."`);
  }
}
assert(maxOctetLen <= 75, `All lines obey RFC 5545 <= 75 octet limit (Max observed: ${maxOctetLen} octets)`);

// 3. Count VEVENT blocks
const veventCount = (icsDe.match(/BEGIN:VEVENT/g) || []).length;
const endVeventCount = (icsDe.match(/END:VEVENT/g) || []).length;
assert(veventCount > 10, `Generated comprehensive set of events (${veventCount} events)`);
assert(veventCount === endVeventCount, 'Every BEGIN:VEVENT has a matching END:VEVENT');

// 4. Perennial vs Annual Planting Logic
// Apple Tree (perennial): Planting event must NOT have RRULE:FREQ=YEARLY
const treePlantingMatch = icsDe.match(/BEGIN:VEVENT\r\nUID:tree-apple-planting[^\r\n]*\r\n(?:[^\r\n]+\r\n)*?END:VEVENT/);
assert(Boolean(treePlantingMatch), 'Tree planting event exists');
if (treePlantingMatch) {
  assert(!treePlantingMatch[0].includes('RRULE:FREQ=YEARLY'), 'Tree planting is one-time (NO RRULE)');
}

// Comfrey (perennial): Planting event must NOT have RRULE:FREQ=YEARLY
const comfreyPlantingMatch = icsDe.match(/BEGIN:VEVENT\r\nUID:tree-apple\.plant-comfrey-planting[^\r\n]*\r\n(?:[^\r\n]+\r\n)*?END:VEVENT/);
assert(Boolean(comfreyPlantingMatch), 'Comfrey planting event exists');
if (comfreyPlantingMatch) {
  assert(!comfreyPlantingMatch[0].includes('RRULE:FREQ=YEARLY'), 'Comfrey planting is one-time (NO RRULE for perennial)');
}

// Borage (annual): Planting/sowing event MUST have RRULE:FREQ=YEARLY
const boragePlantingMatch = icsDe.match(/BEGIN:VEVENT\r\nUID:tree-apple\.plant-borage-planting[^\r\n]*\r\n(?:[^\r\n]+\r\n)*?END:VEVENT/);
assert(Boolean(boragePlantingMatch), 'Borage planting event exists');
if (boragePlantingMatch) {
  assert(boragePlantingMatch[0].includes('RRULE:FREQ=YEARLY'), 'Borage sowing is recurring yearly (RRULE:FREQ=YEARLY)');
}

// Nasturtium (annual): Planting/sowing event MUST have RRULE:FREQ=YEARLY
const nasturtiumPlantingMatch = icsDe.match(/BEGIN:VEVENT\r\nUID:tree-apple\.plant-nasturtium-planting[^\r\n]*\r\n(?:[^\r\n]+\r\n)*?END:VEVENT/);
assert(Boolean(nasturtiumPlantingMatch), 'Nasturtium planting event exists');
if (nasturtiumPlantingMatch) {
  assert(nasturtiumPlantingMatch[0].includes('RRULE:FREQ=YEARLY'), 'Nasturtium sowing is recurring yearly (RRULE:FREQ=YEARLY)');
}

// 5. Chop & Drop Events
// Comfrey has 3 chop seasons: late spring, summer, autumn -> each must have RRULE:FREQ=YEARLY
const comfreyChopSpring = icsDe.match(/UID:tree-apple\.plant-comfrey-chop-late_spring@pflanzengilde\.de/);
const comfreyChopSummer = icsDe.match(/UID:tree-apple\.plant-comfrey-chop-summer@pflanzengilde\.de/);
const comfreyChopAutumn = icsDe.match(/UID:tree-apple\.plant-comfrey-chop-autumn@pflanzengilde\.de/);
assert(Boolean(comfreyChopSpring), 'Comfrey spring chop event generated');
assert(Boolean(comfreyChopSummer), 'Comfrey summer chop event generated');
assert(Boolean(comfreyChopAutumn), 'Comfrey autumn chop event generated');

// 6. Direct Instructions and Guide Links
assert(icsDe.includes('https://pflanzengilde.de/guides#chop-plant-comfrey') || icsDe.includes('/guides#chop-plant-comfrey'), 'Contains direct guide link to comfrey chop guide');
assert(icsDe.includes('https://pflanzengilde.de/guides#guild_design') || icsDe.includes('/guides#guild_design'), 'Contains direct guide link to guild design');
assert(icsDe.includes('?g='), 'Contains guild share link with ?g= permalink');

// 7. English Localization Verification
const icsEn = generateGuildCalendarIcs({
  starTree: appleTree,
  selectedPlants: samplePlants,
  selectedSoil: 'LOAM',
  selectedZone: 'TEMPERATE',
  hemisphere: 'NORTHERN',
  language: 'en'
});

assert(icsEn.includes('X-WR-CALNAME:Plant Guild'), 'English calendar has English name');
assert(icsEn.includes('[Planting] Apple Tree'), 'English tree planting event title');
assert(icsEn.includes('[Chop & Drop] Russian Comfrey'), 'English comfrey chop event title');
assert(icsEn.includes('STEP-BY-STEP PRUNING INSTRUCTIONS'), 'English chore instructions present');

// 8. Southern Hemisphere Date Shift Verification
const icsSouth = generateGuildCalendarIcs({
  starTree: appleTree,
  selectedPlants: samplePlants,
  hemisphere: 'SOUTHERN',
  language: 'en'
});

// In Northern hemisphere, canopy pruning is late winter (month 02 / Feb).
// In Southern hemisphere, month should be shifted by 6 months (month 08 / Aug).
const southTreePrune = icsSouth.match(/UID:tree-apple-pruning-winter@pflanzengilde\.de\r\n(?:[^\r\n]+\r\n)*?DTSTART;VALUE=DATE:(\d{4})(\d{2})(\d{2})/);
assert(Boolean(southTreePrune), 'Southern hemisphere tree pruning event found');
if (southTreePrune) {
  const pruneMonth = southTreePrune[2];
  assert(pruneMonth === '08', `Southern hemisphere dormant pruning shifted to August (08), got: ${pruneMonth}`);
}

// 9. Branding & HTML Card Asset Verification
assert(icsDe.includes('X-ALT-DESC;FMTTYPE=text/html'), 'Contains rich HTML formatted description (X-ALT-DESC)');
assert(icsDe.includes('favicon.svg'), 'Reuses official website favicon.svg in HTML description');
assert(icsDe.includes('images/plants/'), 'Reuses authentic website plant images in HTML description');
assert(icsDe.includes('Pflanzengilde.de'), 'Contains Pflanzengilde.de branding');
assert(icsDe.includes('pflanzengilde.de'), 'Contains bottom-right plain text pflanzengilde.de signature');
assert(icsDe.includes('Permakultur-Gilden-Planung'), 'Contains bottom-right German subtitle signature');
assert(icsEn.includes('Permaculture Guild Design'), 'Contains bottom-right English subtitle signature');
assert(icsDe.includes('Pflanzenfoto:'), 'Contains direct Pflanzenfoto URL in German plain text description');
assert(icsEn.includes('Plant Photo:'), 'Contains direct Plant Photo URL in English plain text description');

// 10. Attachments (RFC 5545 ATTACH for Thunderbird & native calendar clients)
assert(icsDe.includes('ATTACH;FMTTYPE=image/webp:'), 'Contains RFC 5545 ATTACH property with plant WebP image');
assert(icsDe.includes('ATTACH;FMTTYPE=image/svg+xml:'), 'Contains RFC 5545 ATTACH property with favicon.svg');

// 11. Chronological Timeline & No-Past-Events Verification
// All events start today or later
const todayDateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const dtStarts = Array.from(icsDe.matchAll(/DTSTART;VALUE=DATE:(\d{8})/g)).map(m => m[1]);
assert(dtStarts.length > 0, 'Found DTSTART entries');
const anyInPast = dtStarts.some(d => d < todayDateStr);
assert(!anyInPast, `No events are scheduled in the past (All DTSTART >= ${todayDateStr})`);

// First event is the keystone tree planting
const firstEventMatch = icsDe.match(/BEGIN:VEVENT\r\nUID:([^\r\n]+)\r\n(?:[^\r\n]+\r\n)*?SUMMARY:([^\r\n]+)/);
assert(Boolean(firstEventMatch && firstEventMatch[1].startsWith('tree-apple-planting')), `Calendar starts with keystone tree planting (First event UID: ${firstEventMatch?.[1]})`);

// Check that events are sorted chronologically
let isChronological = true;
for (let i = 1; i < dtStarts.length; i++) {
  if (dtStarts[i] < dtStarts[i - 1]) {
    isChronological = false;
    break;
  }
}
assert(isChronological, 'All calendar events are ordered in strict chronological sequence');

// 12. UIDs: unique within a calendar, specific to the guild's star tree, stable across re-exports
const uidsOf = (ics: string) => Array.from(ics.replace(/\r\n /g, '').matchAll(/^UID:([^\r\n]+)\r?$/gm)).map(m => m[1]);
const appleUids = uidsOf(icsDe);
assert(new Set(appleUids).size === appleUids.length, 'Every event UID in one calendar is unique');
assert(appleUids.every(uid => uid.startsWith('tree-apple')), 'Every UID of the apple guild carries the star tree id');
assert(!/\d{8}@/.test(appleUids.join(' ')), 'UIDs contain no dates, so re-imports on another day update instead of duplicating');

const appleAgain = uidsOf(generateGuildCalendarIcs({
  starTree: appleTree,
  selectedPlants: samplePlants,
  selectedSoil: 'LOAM',
  selectedZone: 'TEMPERATE',
  hemisphere: 'NORTHERN',
  language: 'de'
}));
assert(JSON.stringify(appleAgain) === JSON.stringify(appleUids), 'Re-exporting the same guild yields identical UIDs');
assert(JSON.stringify(uidsOf(icsEn).sort()) === JSON.stringify([...appleUids].sort()), 'Language does not change UIDs');

const pearTree = STAR_TREES.find(t => t.id === 'tree-pear')!;
const pearUids = uidsOf(generateGuildCalendarIcs({
  starTree: pearTree,
  selectedPlants: samplePlants,
  hemisphere: 'NORTHERN',
  language: 'de'
}));
assert(pearUids.length > 0 && !pearUids.some(uid => appleUids.includes(uid)), 'Two guilds with the same companions share no UID (no overwrite on import)');
assert(pearUids.includes('tree-pear.plant-comfrey-chop-summer@pflanzengilde.de'), 'Companion UID scheme: <tree>.<plant>-<task>@pflanzengilde.de');

// 13. Garden calendar UIDs: per garden instance, stable for the same garden
const gardenTree = (tree: typeof appleTree, instanceId: string) => ({ instanceId, treeId: tree.id, starTree: tree, xM: 0, yM: 0, selectedPlantIds: [] });
const comfreyPlant = samplePlants[0];
const makeGarden = (name: string, instanceIds: string[]) => ({
  version: '2.0',
  name,
  createdAt: new Date().toISOString(),
  soil: 'LOAM' as const,
  zone: 'TEMPERATE' as const,
  hemisphere: 'NORTHERN' as const,
  language: 'de' as const,
  starPlants: instanceIds.map(id => gardenTree(appleTree, id)),
  placedCompanions: [{
    instanceId: 'c1', plantId: comfreyPlant.id, plant: comfreyPlant, xM: 1, yM: 1,
    servicingTreeIds: [instanceIds[0]], isMerged: false, currentLightCondition: 'FULL_SUN' as const
  }],
  gridBoundsM: { minX: -20, maxX: 20, minY: -20, maxY: 20 }
});
const gardenA = makeGarden('Garten A', ['star-tree-a-1']);
const gardenB = makeGarden('Garten B', ['star-tree-b-1']);
const gUidsA = uidsOf(buildGardenIcsContent({ garden: gardenA }));
const gUidsA2 = uidsOf(buildGardenIcsContent({ garden: { ...gardenA, createdAt: '2000-01-01T00:00:00Z' } }));
const gUidsB = uidsOf(buildGardenIcsContent({ garden: gardenB }));
assert(gUidsA.length > 0 && new Set(gUidsA).size === gUidsA.length, 'Garden calendar UIDs are unique');
assert(JSON.stringify(gUidsA) === JSON.stringify(gUidsA2), 'Same garden exported twice keeps its UIDs');
assert(!gUidsA.some(uid => gUidsB.includes(uid)), 'Two gardens with the same plants share no UID');
const keyedA = uidsOf(buildGardenIcsContent({ garden: gardenA, gardenKey: 'g7k2m9' }));
const keyedAMoreTrees = uidsOf(buildGardenIcsContent({ garden: makeGarden('Garten A (umbenannt)', ['star-tree-a-1', 'star-tree-a-2']), gardenKey: 'g7k2m9' }));
assert(keyedA.every(uid => uid.startsWith('garden-g7k2m9-')), 'Persisted garden key goes into every garden UID');
assert(keyedA.every(uid => keyedAMoreTrees.includes(uid)), 'With a garden key, renaming or adding trees keeps existing UIDs');

console.log(`calendar: ${passedChecks}/${totalChecks} checks passed`);
if (passedChecks !== totalChecks) process.exitCode = 1;
