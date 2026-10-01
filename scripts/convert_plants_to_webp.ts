import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { STAR_TREES } from '../src/data/starTrees';
import { GUILD_PLANTS } from '../src/data/guildPlants';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, '../public/images/plants');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function fetchBuffer(url: string, retries = 3): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(
      url,
      {
        headers: {
          'User-Agent': 'PlantGuildExplorer/1.0 (https://pflanzengilde.de; contact@pflanzengilde.de) Mozilla/5.0',
          Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        },
      },
      (res) => {
        const status = res.statusCode ?? 0;
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          if (retries <= 0) return reject(new Error(`Too many redirects for ${url}`));
          // Location may be relative
          const next = new URL(res.headers.location, url).toString();
          return fetchBuffer(next, retries - 1).then(resolve).catch(reject);
        }
        if (status !== 200) {
          res.resume();
          if (retries > 0 && status >= 500) {
            setTimeout(() => {
              fetchBuffer(url, retries - 1).then(resolve).catch(reject);
            }, 1000);
            return;
          }
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      }
    );
    req.on('error', (err) => {
      if (retries > 0) {
        setTimeout(() => {
          fetchBuffer(url, retries - 1).then(resolve).catch(reject);
        }, 1000);
      } else {
        reject(err);
      }
    });
    req.setTimeout(15000, () => {
      req.destroy(new Error(`Timeout fetching ${url}`));
    });
  });
}

async function convertImage(id: string, url: string, isTree: boolean): Promise<boolean> {
  const destPath = path.join(outputDir, `${id}.webp`);
  if (fs.existsSync(destPath)) {
    const stats = fs.statSync(destPath);
    if (stats.size > 1000) {
      console.log(`[EXISTS] ${id}.webp (${Math.round(stats.size / 1024)} KB)`);
      return true;
    }
  }

  // Request Wikimedia's 960px rendition rather than whatever thumbnail size the data references
  let cleanUrl = url;
  if (cleanUrl.includes('wikimedia.org') && /\/\d+px-/.test(cleanUrl)) {
    cleanUrl = cleanUrl.replace(/\/\d+px-/, '/960px-');
  }

  try {
    const rawBuffer = await fetchBuffer(cleanUrl);
    const maxDimension = isTree ? 640 : 400;
    const quality = isTree ? 82 : 80;

    const webpBuffer = await sharp(rawBuffer)
      .resize({
        width: maxDimension,
        height: maxDimension,
        fit: 'cover',
        position: 'center',
        withoutEnlargement: true,
      })
      .webp({ quality, effort: 4 })
      .toBuffer();

    fs.writeFileSync(destPath, webpBuffer);
    console.log(`✓ [CONVERTED] ${id}.webp (${Math.round(webpBuffer.length / 1024)} KB)`);
    return true;
  } catch (err: any) {
    console.error(`✗ [FAILED] ${id} (${cleanUrl}): ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('Converting plant and tree images to WebP');
  console.log(`Output Directory: ${outputDir}`);
  console.log(`Star Trees: ${STAR_TREES.length}`);
  console.log(`Guild Companions: ${GUILD_PLANTS.length}`);

  let success = 0;
  let failed = 0;

  // Batches of 4 to stay polite with Wikimedia
  console.log('\n--- Processing Star Trees ---');
  for (let i = 0; i < STAR_TREES.length; i += 4) {
    const batch = STAR_TREES.slice(i, i + 4);
    const results = await Promise.all(
      batch.map((tree) => convertImage(tree.id, tree.imageUrl, true))
    );
    results.forEach((ok) => (ok ? success++ : failed++));
  }

  console.log('\n--- Processing Companion Plants ---');
  for (let i = 0; i < GUILD_PLANTS.length; i += 4) {
    const batch = GUILD_PLANTS.slice(i, i + 4);
    const results = await Promise.all(
      batch.map((plant) => convertImage(plant.id, plant.imageUrl, false))
    );
    results.forEach((ok) => (ok ? success++ : failed++));
  }

  console.log(`\nFinished: ${success} converted/existing, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
