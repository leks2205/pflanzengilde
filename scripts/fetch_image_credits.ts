/**
 * Regenerates src/data/imageCredits.ts with author/license attribution for every photo
 * in public/images/ (plant photos and soil textures, nearly all from Wikimedia Commons).
 *
 * The mapping local file -> Commons file title below is the single source of truth for
 * where each image came from. When you add or replace an image in public/images/, add its
 * Commons file here and re-run:
 *
 *   npx tsx scripts/fetch_image_credits.ts
 *
 * The script queries the Commons API (extmetadata) and fails loudly for files that are
 * missing, lack an author or are not under a free license.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outFile = path.resolve(__dirname, '../src/data/imageCredits.ts');
const publicDir = path.resolve(__dirname, '../public');

const USER_AGENT = 'PlantGuildExplorer/1.0 (https://pflanzengilde.de; contact@pflanzengilde.de) image-credits-script';
const API = 'https://commons.wikimedia.org/w/api.php';

// Local image path (as referenced by imageUrl) -> Commons file title (without the "File:" prefix).
export const IMAGE_SOURCES: Record<string, string> = {
  "/images/plants/herb-hemp.webp": "Hemp plants-cannabis sativa-single 1.JPG",
  "/images/plants/herb-rhubarb.webp": "Rheum rhabarbarum.2006-04-27.uellue.jpg",
  "/images/plants/plant-albizia.webp": "Albizia chinensis - Chinese Albizia young leaves at Periya 2018 (1).jpg",
  "/images/plants/plant-alder.webp": "Alnus glutinosa 01 by-dpc.jpg",
  "/images/plants/plant-alfalfa.webp": "75 Medicago sativa L.jpg",
  "/images/plants/plant-aster.webp": "Symphyotrichum novae-angliae3.jpg",
  "/images/plants/plant-blackcurrant.webp": "Ribes nigrum - Cassis à Grez-Doiceau 001.jpg",
  "/images/plants/plant-blueberry.webp": "Vaccinium corymbosum a2.jpg",
  "/images/plants/plant-borage.webp": "Borago officinalis (2025).jpg",
  "/images/plants/plant-bugleweed.webp": "Ajuga reptans 20070429 132711 1.jpg",
  "/images/plants/plant-catmint.webp": "Nepeta cataria RF.jpg",
  "/images/plants/plant-chamomile.webp": "Matricaria recutita 001.JPG",
  "/images/plants/plant-chives.webp": "Allium schoenoprasum - Bombus lapidarius - Tootsi.jpg",
  "/images/plants/plant-comfrey.webp": "Symphytum officinale 01.jpg",
  "/images/plants/plant-cowslip.webp": "Primula veris 0x.JPG",
  "/images/plants/plant-cranberry.webp": "American Cranberry (Vaccinium macrocarpon) - Tor Bay Provincial Park, Nova Scotia 2022-07-27.jpg",
  "/images/plants/plant-creeping-jenny.webp": "Lysimachia nummularia0.jpg",
  "/images/plants/plant-crocus.webp": "Crocus vernus with bee.jpg",
  "/images/plants/plant-daffodil.webp": "Narcissus pseudonarcissus flower 300303.jpg",
  "/images/plants/plant-dandelion.webp": "A Taraxacum Ruderalia dandelion clock.jpg",
  "/images/plants/plant-echinacea.webp": "Echinacea purpurea 001.JPG",
  "/images/plants/plant-elaeagnus.webp": "Elaeagnus umbellata1.jpg",
  "/images/plants/plant-elderberry.webp": "Sambucus nigra 004.jpg",
  "/images/plants/plant-epimedium.webp": "Epimedium grandiflorum 1.jpg",
  "/images/plants/plant-fennel.webp": "Foeniculum July 2011-1a.jpg",
  "/images/plants/plant-garlic.webp": "Knoblauch Blüte focus stack-20250713-RM-111019.jpg",
  "/images/plants/plant-goumi.webp": "Elaeagnus multiflora2.jpg",
  "/images/plants/plant-hellebore.webp": "Helleborus niger Kaiser.jpg",
  "/images/plants/plant-hemp.webp": "Cannabis sativa plant top view 01.jpg",
  "/images/plants/plant-horseradish.webp": "Armoracia rusticana.jpg",
  "/images/plants/plant-hosta.webp": "Hosta Bressingham Blue.JPG",
  "/images/plants/plant-hyacinth.webp": "Hyacinthus orientalis 'Delft Blue' 2019-04-06 02.jpg",
  "/images/plants/plant-hyssop.webp": "Hyssop (Hyssopus officinalis).jpg",
  "/images/plants/plant-lavender.webp": "Lavandula angustifolia - lavender - Lavendel - 01.jpg",
  "/images/plants/plant-lemon-balm.webp": "Lemon balm plant.jpg",
  "/images/plants/plant-linden.webp": "Tilia cordata flowers.jpg",
  "/images/plants/plant-lingonberry.webp": "Vaccinium vitis-idaea L..jpg",
  "/images/plants/plant-lovage.webp": "Liebstöckel.JPG",
  "/images/plants/plant-lungwort.webp": "Pulmonaria officinalis (s. str.) sl2.jpg",
  "/images/plants/plant-lupine.webp": "Lupinus perennis in flower.jpg",
  "/images/plants/plant-marigold.webp": "Tagetes patula 05012015 (3).jpg",
  "/images/plants/plant-meadowsweet.webp": "FilipendulaUlmaria.jpg",
  "/images/plants/plant-miners-lettuce.webp": "Claytonia perfoliata 6641.JPG",
  "/images/plants/plant-nasturtium.webp": "Tropaeolum majus 2005 G1.jpg",
  "/images/plants/plant-nepal-alder.webp": "Alnus nepalensis.JPG",
  "/images/plants/plant-nettle.webp": "Brennnessel.jpg",
  "/images/plants/plant-oregano.webp": "ORIGANUM VULGARE - SANT JUST - IB-230 (Orenga).JPG",
  "/images/plants/plant-ostrich-fern.webp": "Matteuccia struthiopteris fiddleheads.jpg",
  "/images/plants/plant-peppermint.webp": "Pfefferminze natur peppermint.jpg",
  "/images/plants/plant-red-currant.webp": "Ribes rubrum 1.jpg",
  "/images/plants/plant-rhododendron.webp": "Rhododendron-catawbiense.jpg",
  "/images/plants/plant-rhubarb.webp": "Rheum rhabarbarum.2006-04-27.uellue.jpg",
  "/images/plants/plant-rosemary.webp": "Rosemary in bloom.JPG",
  "/images/plants/plant-sage.webp": "Salvia officinalis in Cardaillac (1).jpg",
  "/images/plants/plant-sainfoin.webp": "Onobrychis viciifolia Inflorescence 11April2009 CampoCalatrava.jpg",
  "/images/plants/plant-seabuckthorn.webp": "Hippophae rhamnoides-01 (xndr).JPG",
  "/images/plants/plant-sedum.webp": "Sedum spectabile - blossom top (aka).jpg",
  "/images/plants/plant-sicklepod.webp": "Senna tora Blanco1.122-cropped.jpg",
  "/images/plants/plant-snowdrop.webp": "Galanthus nivalis.jpg",
  "/images/plants/plant-southernwood.webp": "Artemisia abrotanum0.jpg",
  "/images/plants/plant-soybean.webp": "Soybean.USDA.jpg",
  "/images/plants/plant-strawberry.webp": "Fragaria vesca - metsmaasikas.jpg",
  "/images/plants/plant-sweet-alyssum.webp": "Smagliczka nadmorska 1.jpg",
  "/images/plants/plant-sweet-cicely.webp": "Myrrhis odorata, Roomse kervel plant.jpg",
  "/images/plants/plant-sweet-flag.webp": "AcorusCalamus.jpg",
  "/images/plants/plant-sweet-potato.webp": "Ipomoea batatas 006.JPG",
  "/images/plants/plant-tansy.webp": "20140711Tanacetum vulgare.jpg",
  "/images/plants/plant-tea-sinensis.webp": "Tea, two leaves and a bud.jpg",
  "/images/plants/plant-thyme.webp": "Thymus serpyllum1.jpg",
  "/images/plants/plant-welsh-onion.webp": "Negibozu 06x1963sv.jpg",
  "/images/plants/plant-white-clover.webp": "Trifolium repens - white clover on way from Govindghat to Gangria at Valley of Flowers National Park - during LGFC - VOF 2019 (1).jpg",
  "/images/plants/plant-wild-carrot.webp": "Daucus carota May 2008-1 edit.jpg",
  "/images/plants/plant-wild-garlic.webp": "Photo of Allium Ursinum, wild garlic, north-west Hampshire, UK, May 2014.jpg",
  "/images/plants/plant-wild-ginger.webp": "Asarum europaeum 170406.jpg",
  "/images/plants/plant-willow.webp": "Salix viminalis 001.jpg",
  "/images/plants/plant-winter-aconite.webp": "Winterling-Bluete-70.jpg",
  "/images/plants/plant-wintergreen.webp": "Gaultheria procumbens Golteria rozesłana 2020-08-07 04.jpg",
  "/images/plants/plant-woodruff.webp": "Waldmeister(Mai).JPG",
  "/images/plants/plant-wormwood.webp": "Artemisia absinthium P1210748.jpg",
  "/images/plants/plant-yarrow.webp": "Achillea millefolium (bright).jpg",
  "/images/plants/shrub-blackcurrant.webp": "Ribes nigrum - Cassis à Grez-Doiceau 001.jpg",
  "/images/plants/shrub-blueberry.webp": "Vaccinium corymbosum a2.jpg",
  "/images/plants/shrub-elderberry.webp": "00 3769 Schwarzen Holunder (Sambucus nigra).jpg",
  "/images/plants/shrub-red-currant.webp": "Ribes rubrum 1.jpg",
  "/images/plants/shrub-rhododendron.webp": "Rhododendron-catawbiense.jpg",
  "/images/plants/tree-alder.webp": "Alnus glutinosa 01 by-dpc.jpg",
  "/images/plants/tree-apple.webp": "Apples on tree 2021 G2.jpg",
  "/images/plants/tree-apricot.webp": "Apricots.jpg",
  "/images/plants/tree-cherry.webp": "Cherries on a tree Germany 2020.jpg",
  "/images/plants/tree-chestnut.webp": "Frucht der Edelkastanie.jpg",
  "/images/plants/tree-fig.webp": "Figs.jpg",
  "/images/plants/tree-ginkgo.webp": "GinkgoLeaves.jpg",
  "/images/plants/tree-hazelnut.webp": "Corylus avellana (Betulaceae) - (fruit-bearing), Elst (Gld), the Netherlands.jpg",
  "/images/plants/tree-linden.webp": "Tilia cordata flowers.jpg",
  "/images/plants/tree-mulberry.webp": "Ripe fruit of morus nigra.JPG",
  "/images/plants/tree-pawpaw.webp": "Asimina triloba3.jpg",
  "/images/plants/tree-peach.webp": "Prunus persica-Jerusalem-Fruits.jpg",
  "/images/plants/tree-pear.webp": "Conference-Birnen.jpg",
  "/images/plants/tree-plum.webp": "Fruits Prunus domestica.jpg",
  "/images/plants/tree-quince.webp": "2022-09-11 Birnenquitte.jpg",
  "/images/plants/tree-seabuckthorn-star.webp": "Hippophae rhamnoides-01 (xndr).JPG",
  "/images/plants/tree-tea-assamica.webp": "Camellia sinensis var. assamica in Auckland Botanic Gardens.jpg",
  "/images/plants/tree-tea-sinensis.webp": "Csinensis.jpg",
  "/images/plants/tree-walnut.webp": "Black Walnut nut and leave detail.JPG",
  "/images/plants/vine-grape.webp": "Uva nera da vino - grappoli 1.jpg",
  "/images/plants/vine-kiwi.webp": "2015-09-27 Kiwi Beeren aus Österreich.JPG",
  "/images/soils/soil-acidic.webp": "Pine forest floor, Jamestown Island, 2014-03-19, 01.jpg",
  "/images/soils/soil-chalky.webp": "Calcareous Soil Profile, Seven Sisters Country Park - geograph.org.uk - 1280181.jpg",
  "/images/soils/soil-clay.webp": "Cracked mud in Black Rock desert.JPG",
  "/images/soils/soil-loam.webp": "Earth pattern.jpg",
  "/images/soils/soil-sandy.webp": "Yellow sand texture.jpg",
  "/images/soils/soil-silt.webp": "Loess (9940595213).jpg",
};

interface ImageCredit {
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  sourceName: string;
}

// Images that did NOT come from Wikimedia Commons. They are written to imageCredits.ts as-is.
// (Currently none: the former Unsplash photos were replaced with Commons photos.)
export const MANUAL_CREDITS: Record<string, ImageCredit> = {};

const decodeEntities = (s: string) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));

const stripHtml = (html: string | undefined) =>
  decodeEntities((html ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();

// Removes wiki boilerplate from author names: "(talk)" links, footnote markers, the
// "No machine-readable author provided. X assumed (based on copyright claims)." template text.
const cleanAuthor = (author: string) =>
  author
    .replace(/^No machine-readable author provided\.\s*(.+?)\s+assumed \(based on copyright claims\)\.?$/i, '$1')
    .replace(/\s*\((talk|Diskussion)\)/gi, '')
    .replace(/\s*\[\d+\]/g, '')
    .trim();

// Licenses Commons accepts as free. CC BY / BY-SA / CC0 / public domain are unproblematic on the web;
// GFDL-only and (L)GPL files are free but formally ask for the full license text, so they are
// reported as notes and worth replacing.
const isFreeLicense = (short: string) => /^(CC0|CC[ -]BY(-SA)?\b|Public domain|PD\b|GFDL|L?GPL|FAL|Attribution)/i.test(short);
const isCopyleftTextLicense = (short: string) => /^(GFDL|L?GPL)/i.test(short);

// Manual author fixes for files whose Commons page has neither an Artist field nor an uploader who is
// the author (e.g. US government works re-uploaded by someone else), or whose Artist field is a whole
// sentence rather than a name. Keyed by Commons file title.
const AUTHOR_OVERRIDES: Record<string, string> = {
  'Corylus avellana (Betulaceae) - (fruit-bearing), Elst (Gld), the Netherlands.jpg': 'B. Schoenmakers (Waarneming.nl)',
  'Soybean.USDA.jpg': 'U.S. Department of Agriculture',
};

async function commonsQuery(extra: Record<string, string>) {
  const params = new URLSearchParams({ action: 'query', format: 'json', formatversion: '2', redirects: '1', ...extra });
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': USER_AGENT } });
    if (res.ok) return res.json() as Promise<any>;
    if (attempt >= 3) throw new Error(`Commons API HTTP ${res.status}`);
    await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
  }
}

const queryBatch = (titles: string[]) =>
  commonsQuery({ prop: 'imageinfo', iiprop: 'extmetadata|url', titles: titles.map(t => `File:${t}`).join('|') });

// Some older files have no {{Information}} template, so extmetadata carries no Artist. For those the
// author is the user who uploaded the first version (e.g. "Taken by [[User:Thue]]" / {{PD-user|Thue}}).
async function originalUploader(fileTitle: string): Promise<string> {
  const json = await commonsQuery({ prop: 'imageinfo', iiprop: 'user', iilimit: '500', titles: fileTitle });
  const versions = json.query?.pages?.[0]?.imageinfo ?? [];
  return versions.length ? String(versions[versions.length - 1].user ?? '') : '';
}

async function main() {
  const entries = Object.entries(IMAGE_SOURCES);
  const problems: string[] = [];
  const notes: string[] = [];

  for (const [local] of entries) {
    if (!fs.existsSync(path.join(publicDir, local))) problems.push(`${local}: local file does not exist`);
  }

  // Normalised title -> metadata
  const meta = new Map<string, { page: any; resolved: string }>();
  const titles = [...new Set(entries.map(([, t]) => t))];
  for (let i = 0; i < titles.length; i += 50) {
    const json = await queryBatch(titles.slice(i, i + 50));
    const q = json.query ?? {};
    const alias = new Map<string, string>();
    for (const n of q.normalized ?? []) alias.set(n.from, n.to);
    for (const r of q.redirects ?? []) alias.set(r.from, r.to);
    const pages = new Map<string, any>((q.pages ?? []).map((p: any) => [p.title, p]));
    for (const t of titles.slice(i, i + 50)) {
      let key = `File:${t}`;
      for (let hops = 0; alias.has(key) && hops < 3; hops++) key = alias.get(key)!;
      meta.set(t, { page: pages.get(key), resolved: key });
    }
  }

  const credits: Record<string, ImageCredit> = {};
  for (const [local, title] of entries) {
    const { page, resolved } = meta.get(title)!;
    const info = page?.imageinfo?.[0];
    if (!page || page.missing || !info) {
      problems.push(`${local}: Commons file "${title}" not found`);
      continue;
    }
    const em = info.extmetadata ?? {};
    const fileName = resolved.replace(/^File:/, '');
    let author = AUTHOR_OVERRIDES[fileName] || cleanAuthor(stripHtml(em.Attribution?.value) || stripHtml(em.Artist?.value));
    if (!author) {
      const uploader = await originalUploader(resolved);
      if (uploader) {
        author = uploader;
        notes.push(`${local}: no Artist field, using original uploader "${uploader}" as author (${resolved})`);
      }
    }
    const license = stripHtml(em.LicenseShortName?.value);
    const licenseUrl = stripHtml(em.LicenseUrl?.value);
    if (!author) problems.push(`${local}: no author/artist in Commons metadata (${resolved})`);
    if (!license || em.NonFree?.value === 'true' || !isFreeLicense(license)) {
      problems.push(`${local}: license "${license || 'unknown'}" is not a recognised free license (${resolved})`);
    } else if (isCopyleftTextLicense(license)) {
      notes.push(`${local}: "${license}" only (free, but formally requires the full license text; consider replacing) (${resolved})`);
    }
    if (!licenseUrl && !/^(Public domain|PD|CC0)/i.test(license)) {
      notes.push(`${local}: no license URL for "${license}" (${resolved})`);
    }
    credits[local] = {
      title: fileName,
      author: author || 'Unknown',
      license: license || 'Unknown',
      licenseUrl: licenseUrl.replace(/^http:/, 'https:').replace(/^\/\//, 'https://'),
      sourceUrl: info.descriptionurl,
      sourceName: 'Wikimedia Commons',
    };
  }

  for (const [local, credit] of Object.entries(MANUAL_CREDITS)) {
    if (!fs.existsSync(path.join(publicDir, local))) problems.push(`${local}: local file does not exist`);
    if (local in credits) problems.push(`${local}: listed in both IMAGE_SOURCES and MANUAL_CREDITS`);
    credits[local] = credit;
  }

  const sorted = Object.fromEntries(Object.entries(credits).sort(([a], [b]) => a.localeCompare(b)));
  const body = `// AUTO-GENERATED by scripts/fetch_image_credits.ts from the Wikimedia Commons API.
// Do not edit by hand: change IMAGE_SOURCES in that script and re-run it.

export interface ImageCredit {
  /** Commons file title without the "File:" prefix (or the original file id for other sources) */
  title: string;
  /** Author / required attribution as plain text */
  author: string;
  /** License short name, e.g. "CC BY-SA 4.0" or "Public domain" */
  license: string;
  /** License deed URL (empty for public-domain files) */
  licenseUrl: string;
  /** File description page (Commons) or original URL */
  sourceUrl: string;
  /** Where the image was taken from, e.g. "Wikimedia Commons" */
  sourceName: string;
}

/** Keyed by the site-relative image path used in imageUrl fields. */
export const IMAGE_CREDITS: Record<string, ImageCredit> = ${JSON.stringify(sorted, null, 2)};

/** Looks up the credit for an imageUrl (query strings such as ?v=4 are ignored). */
export const getImageCredit = (imageUrl: string | undefined): ImageCredit | undefined =>
  imageUrl ? IMAGE_CREDITS[imageUrl.split(/[?#]/)[0]] : undefined;
`;
  fs.writeFileSync(outFile, body, 'utf8');
  console.log(`Wrote ${Object.keys(sorted).length} credits to ${path.relative(process.cwd(), outFile)}`);

  // Every image on disk should have a credit entry
  for (const dir of ['images/plants', 'images/soils']) {
    for (const f of fs.readdirSync(path.join(publicDir, dir))) {
      const local = `/${dir}/${f}`;
      if (!(local in IMAGE_SOURCES) && !(local in MANUAL_CREDITS)) problems.push(`${local}: no source in IMAGE_SOURCES (uncredited image)`);
    }
  }

  if (notes.length) {
    console.log(`\n${notes.length} note(s):`);
    for (const n of notes) console.log(`  - ${n}`);
  }
  if (problems.length) {
    console.warn(`\n${problems.length} problem(s):`);
    for (const p of problems) console.warn(`  - ${p}`);
    process.exitCode = 1;
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
