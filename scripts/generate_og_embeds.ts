import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { STAR_TREES } from '../src/data/starTrees';
import { GUILD_PLANTS } from '../src/data/guildPlants';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicOgDir = path.resolve(__dirname, '../public/og');
const distOgDir = path.resolve(__dirname, '../dist/og');

fs.mkdirSync(publicOgDir, { recursive: true });

// Optional filter, e.g. `--only=garden-plan,tree-linden`, to regenerate single cards (all by default)
const onlyArg = process.argv.find(arg => arg.startsWith('--only='));
const onlyIds = onlyArg ? new Set(onlyArg.slice('--only='.length).split(',').map(id => id.trim()).filter(Boolean)) : null;
const shouldGenerate = (id: string) => !onlyIds || onlyIds.has(id);

// Counts shown on the garden card come from the data, so they can't go stale
const starPlantCount = STAR_TREES.length;
const companionCountLabel = `${Math.floor(GUILD_PLANTS.length / 10) * 10}+`;

function escapeXml(unsafe: string): string {
  return String(unsafe).replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function wrapText(text: string, maxCharsPerLine = 46, maxLines = 3): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const w of words) {
    if ((current + ' ' + w).trim().length <= maxCharsPerLine) {
      current = (current + ' ' + w).trim();
    } else {
      if (lines.length + 1 >= maxLines) {
        current += '...';
        break;
      }
      lines.push(current);
      current = w;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

function createSvgOverlay(title: string, botanical: string, description: string): string {
  const descLines = wrapText(description, 44, 3);
  const descSvgLines = descLines.map((line, idx) =>
    `<text x="70" y="${275 + idx * 36}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400" fill="#e2e8f0">${escapeXml(line)}</text>`
  ).join('\n  ');

  return `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0a140c" stop-opacity="0.96" />
      <stop offset="48%" stop-color="#0a140c" stop-opacity="0.88" />
      <stop offset="72%" stop-color="#0a140c" stop-opacity="0.32" />
      <stop offset="100%" stop-color="#0a140c" stop-opacity="0.0" />
    </linearGradient>
    <linearGradient id="bottomGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="65%" stop-color="#000000" stop-opacity="0" />
      <stop offset="100%" stop-color="#0a140c" stop-opacity="0.8" />
    </linearGradient>
  </defs>

  <!-- Dark gradients for maximum readability -->
  <rect width="1200" height="630" fill="url(#grad)" />
  <rect width="1200" height="630" fill="url(#bottomGrad)" />

  <!-- Permaculture Badge -->
  <rect x="70" y="65" width="250" height="34" rx="17" fill="#14532d" fill-opacity="0.95" stroke="#22c55e" stroke-width="1.5" />
  <text x="195" y="87" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#86efac" letter-spacing="1.5">PERMAKULTUR-GILDE</text>

  <!-- Title & Botanical Name -->
  <text x="70" y="155" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="bold" fill="#ffffff">${escapeXml(title)}</text>
  <text x="70" y="200" font-family="Arial, Helvetica, sans-serif" font-size="26" font-style="italic" fill="#86efac">${escapeXml(botanical)}</text>

  <!-- Short Description -->
  ${descSvgLines}

  <!-- BOTTOM LEFT: Pflanzengilde.de Logo + Text -->
  <g transform="translate(70, 505)">
    <!-- Sprout Icon Badge -->
    <rect width="64" height="64" rx="18" fill="#16a34a" />
    <g transform="translate(14, 14) scale(1.5)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 20h10"/>
      <path d="M10 20c5.5-2.5.8-6.4 3-10"/>
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/>
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>
    </g>
    <!-- Brand Typography -->
    <text x="82" y="36" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="bold" fill="#ffffff">Pflanzengilde<tspan fill="#4ade80">.de</tspan></text>
    <text x="84" y="56" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold" fill="#a7f3d0" letter-spacing="0.02em">Interaktiver Permakultur-Gildenplaner</text>
  </g>
</svg>
`.trim();
}

async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  // Site-relative paths are served from public/
  if (url.startsWith('/')) {
    const localPath = path.resolve(__dirname, '../public', url.split(/[?#]/)[0].replace(/^\//, ''));
    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath);
    }
    console.warn(`Local image not found at ${localPath}`);
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 PflanzengildeBot/1.0'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.warn(`Failed to fetch image from ${url}:`, (err as Error).message);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function createFallbackBackground(): Promise<Buffer> {
  return await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 3,
      background: { r: 16, g: 35, b: 20 }
    }
  }).jpeg().toBuffer();
}

async function generateAll() {
  console.log(`Starting social embed image generation for ${STAR_TREES.length} star trees...`);

  for (const tree of STAR_TREES) {
    if (!shouldGenerate(tree.id)) continue;
    const outPath = path.join(publicOgDir, `${tree.id}.jpg`);
    const title = tree.commonName.de;
    const botanical = tree.botanicalName;
    const desc = tree.description.de;

    let bgBuffer: Buffer;
    const imgBuf = await fetchImageBuffer(tree.imageUrl);

    if (imgBuf) {
      bgBuffer = await sharp(imgBuf)
        .resize(1200, 630, { fit: 'cover', position: 'right' })
        .toBuffer();
    } else {
      bgBuffer = await createFallbackBackground();
    }

    const svg = createSvgOverlay(title, botanical, desc);

    const finalJpg = await sharp(bgBuffer)
      .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
      .jpeg({ quality: 90, mozjpeg: true })
      .toBuffer();

    fs.writeFileSync(outPath, finalJpg);
    console.log(`✓ Generated ${tree.id}.jpg (${Math.round(finalJpg.length / 1024)} KB)`);
  }

  // default.jpg is the apple tree card
  const defaultSrc = path.join(publicOgDir, 'tree-apple.jpg');
  if (shouldGenerate('tree-apple') && fs.existsSync(defaultSrc)) {
    fs.copyFileSync(defaultSrc, path.join(publicOgDir, 'default.jpg'));
    console.log('✓ Copied default.jpg from tree-apple.jpg');
  }

  // garden-plan.jpg for the /garten route
  const gardenSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#07130b" />
      <stop offset="55%" stop-color="#0c1d11" />
      <stop offset="100%" stop-color="#112918" />
    </linearGradient>
    <radialGradient id="mapGlow" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#16a34a" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#090d0a" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Full Canvas Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)" />

  <!-- RIGHT SIDE: 2D CAD Multi-Tree Garden Grid Preview Card -->
  <g transform="translate(650, 45)">
    <rect width="495" height="540" rx="28" fill="#0c130e" stroke="#1f3a27" stroke-width="2.5" />
    <rect width="495" height="540" rx="28" fill="url(#mapGlow)" />

    <!-- Coordinate Grid Lines -->
    <g stroke="#1a2e20" stroke-width="1">
      <line x1="80" y1="0" x2="80" y2="540" />
      <line x1="165" y1="0" x2="165" y2="540" />
      <line x1="250" y1="0" x2="250" y2="540" />
      <line x1="335" y1="0" x2="335" y2="540" />
      <line x1="420" y1="0" x2="420" y2="540" />
      <line x1="0" y1="90" x2="495" y2="90" />
      <line x1="0" y1="180" x2="495" y2="180" />
      <line x1="0" y1="270" x2="495" y2="270" />
      <line x1="0" y1="360" x2="495" y2="360" />
      <line x1="0" y1="450" x2="495" y2="450" />
    </g>

    <!-- Origin Crosshair -->
    <line x1="250" y1="0" x2="250" y2="540" stroke="#264530" stroke-width="1.5" stroke-dasharray="6,6" />
    <line x1="0" y1="270" x2="495" y2="270" stroke="#264530" stroke-width="1.5" stroke-dasharray="6,6" />

    <!-- CAD Distance Lines Between Star Trees -->
    <line x1="145" y1="155" x2="365" y2="175" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="7,5" />
    <line x1="145" y1="155" x2="240" y2="375" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="7,5" />
    <line x1="365" y1="175" x2="240" y2="375" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="7,5" />

    <!-- Distance Pill 1 (5.0m) -->
    <rect x="220" y="148" width="66" height="26" rx="8" fill="#090d0a" stroke="#475569" stroke-width="1.5" />
    <text x="253" y="166" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold" fill="#f8fafc">5.0m</text>

    <!-- Distance Pill 2 (4.8m) -->
    <rect x="155" y="252" width="66" height="26" rx="8" fill="#090d0a" stroke="#475569" stroke-width="1.5" />
    <text x="188" y="270" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold" fill="#f8fafc">4.8m</text>

    <!-- Distance Pill 3 (5.2m) -->
    <rect x="275" y="262" width="66" height="26" rx="8" fill="#090d0a" stroke="#475569" stroke-width="1.5" />
    <text x="308" y="280" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold" fill="#f8fafc">5.2m</text>

    <!-- Companion Plant Dots Around & Between Star Trees -->
    <!-- Tree 1 Companions -->
    <circle cx="105" cy="115" r="8" fill="#9333ea" stroke="#ffffff" stroke-width="1.5" />
    <circle cx="185" cy="110" r="8" fill="#facc15" stroke="#ffffff" stroke-width="1.5" />
    <circle cx="95" cy="185" r="8" fill="#c084fc" stroke="#ffffff" stroke-width="1.5" />
    <circle cx="145" cy="118" r="7" fill="#4ade80" stroke="#ffffff" stroke-width="1.5" />
    <!-- Shared Interstitial Companions -->
    <circle cx="255" cy="130" r="9" fill="#f43f5e" stroke="#ffffff" stroke-width="2" />
    <circle cx="250" cy="220" r="9" fill="#38bdf8" stroke="#ffffff" stroke-width="2" />
    <circle cx="185" cy="295" r="9" fill="#9333ea" stroke="#ffffff" stroke-width="2" />
    <circle cx="315" cy="295" r="9" fill="#dc2626" stroke="#ffffff" stroke-width="2" />
    <!-- Tree 2 Companions -->
    <circle cx="410" cy="135" r="8" fill="#9333ea" stroke="#ffffff" stroke-width="1.5" />
    <circle cx="418" cy="210" r="8" fill="#facc15" stroke="#ffffff" stroke-width="1.5" />
    <circle cx="355" cy="128" r="7" fill="#c084fc" stroke="#ffffff" stroke-width="1.5" />
    <!-- Tree 3 Companions -->
    <circle cx="185" cy="415" r="8" fill="#4ade80" stroke="#ffffff" stroke-width="1.5" />
    <circle cx="295" cy="418" r="8" fill="#f43f5e" stroke="#ffffff" stroke-width="1.5" />
    <circle cx="240" cy="432" r="8" fill="#9333ea" stroke="#ffffff" stroke-width="1.5" />

    <!-- Star Tree 1: Apfelbaum -->
    <circle cx="145" cy="155" r="24" fill="#ef4444" fill-opacity="0.22" />
    <circle cx="145" cy="155" r="15" fill="#ef4444" stroke="#ffffff" stroke-width="3" />
    <text x="145" y="195" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#fecaca">Apfelbaum</text>

    <!-- Star Tree 2: Winterlinde -->
    <circle cx="365" cy="175" r="24" fill="#65a30d" fill-opacity="0.22" />
    <circle cx="365" cy="175" r="15" fill="#65a30d" stroke="#ffffff" stroke-width="3" />
    <text x="365" y="215" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#d9f99d">Winterlinde</text>

    <!-- Star Tree 3: Kulturbirne -->
    <circle cx="240" cy="375" r="24" fill="#eab308" fill-opacity="0.22" />
    <circle cx="240" cy="375" r="15" fill="#eab308" stroke="#ffffff" stroke-width="3" />
    <text x="240" y="412" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#fef08a">Kulturbirne</text>

    <!-- Bottom Map Legend Bar -->
    <rect x="22" y="478" width="451" height="42" rx="12" fill="#142419" stroke="#264530" stroke-width="1" />
    <circle cx="46" cy="499" r="6" fill="#ef4444" />
    <text x="58" y="504" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#e2e8f0">Leitbäume</text>
    <circle cx="155" cy="499" r="6" fill="#9333ea" />
    <text x="167" y="504" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#e2e8f0">Begleitpflanzen</text>
    <text x="455" y="504" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#86efac">CAD-Abstände (m)</text>
  </g>

  <!-- LEFT SIDE: Badge, Title, Subtitle, Features, and Brand Logo -->
  <rect x="65" y="60" width="310" height="36" rx="18" fill="#14532d" stroke="#22c55e" stroke-width="1.5" />
  <text x="220" y="83" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#86efac" letter-spacing="1.5">2D-PERMAKULTUR-GARTENPLAN</text>

  <text x="65" y="152" font-family="Arial, Helvetica, sans-serif" font-size="50" font-weight="bold" fill="#ffffff">Permakultur-</text>
  <text x="65" y="208" font-family="Arial, Helvetica, sans-serif" font-size="50" font-weight="bold" fill="#4ade80">Gartenplan</text>

  <text x="65" y="252" font-family="Arial, Helvetica, sans-serif" font-size="22" font-style="italic" fill="#a7f3d0">Mehrbaum-Raster &amp; Begleitpflanzen-Optimierung</text>

  <text x="65" y="308" font-family="Arial, Helvetica, sans-serif" font-size="21" fill="#e2e8f0">• Maßstabsgetreue Baum-Koordinaten &amp; Abstände</text>
  <text x="65" y="346" font-family="Arial, Helvetica, sans-serif" font-size="21" fill="#e2e8f0">• Intelligente Begleitpflanzen-Teilung zwischen Gilden</text>
  <text x="65" y="384" font-family="Arial, Helvetica, sans-serif" font-size="21" fill="#e2e8f0">• Allelopathie-Prüfung, PDF-Plan &amp; Einkaufsliste</text>

  <!-- Pill Badges -->
  <rect x="65" y="418" width="160" height="36" rx="10" fill="#14291a" stroke="#22c55e" stroke-width="1" />
  <text x="145" y="441" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="bold" fill="#86efac">${starPlantCount} Leitpflanzen</text>

  <rect x="240" y="418" width="195" height="36" rx="10" fill="#14291a" stroke="#22c55e" stroke-width="1" />
  <text x="337" y="441" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="bold" fill="#86efac">${companionCountLabel} Begleitpflanzen</text>

  <!-- BOTTOM LEFT: Pflanzengilde.de Logo + Text -->
  <g transform="translate(65, 505)">
    <rect width="64" height="64" rx="18" fill="#16a34a" />
    <g transform="translate(14, 14) scale(1.5)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 20h10"/>
      <path d="M10 20c5.5-2.5.8-6.4 3-10"/>
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/>
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>
    </g>
    <text x="82" y="36" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="bold" fill="#ffffff">Pflanzengilde<tspan fill="#4ade80">.de</tspan></text>
    <text x="84" y="56" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold" fill="#a7f3d0" letter-spacing="0.02em">Interaktiver Permakultur-Gartenplaner</text>
  </g>
</svg>
`.trim();

  if (shouldGenerate('garden-plan')) {
    const gardenBg = await createFallbackBackground();
    const gardenJpg = await sharp(gardenBg)
      .composite([{ input: Buffer.from(gardenSvg), top: 0, left: 0 }])
      .jpeg({ quality: 92, mozjpeg: true })
      .toBuffer();
    fs.writeFileSync(path.join(publicOgDir, 'garden-plan.jpg'), gardenJpg);
    console.log(`✓ Generated garden-plan.jpg (${Math.round(gardenJpg.length / 1024)} KB)`);
  }

  if (fs.existsSync(path.resolve(__dirname, '../dist'))) {
    fs.mkdirSync(distOgDir, { recursive: true });
    const files = fs.readdirSync(publicOgDir);
    for (const f of files) {
      fs.copyFileSync(path.join(publicOgDir, f), path.join(distOgDir, f));
    }
    console.log('✓ Mirrored all OG images to dist/og/');
  }

}

generateAll().catch(err => {
  console.error('Fatal error during embed image generation:', err);
  process.exit(1);
});
