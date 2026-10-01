import { jsPDF } from 'jspdf';
import { GardenState } from '../types/garden';
import { getLoc, SoilType } from '../types/guild';
import { t, formatNumber, translateClimateZone, translateRole } from '../i18n/translations';
import { analyzeGardenAntagonisms, detectGardenShadePockets } from './gardenAntagonist';

export interface GenerateGardenPdfOptions {
  garden: GardenState;
}

const WIN_ANSI_EXTRA = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';
const WIN_ANSI_SUBSTITUTES: Record<string, string> = { '≥': '>=', '≤': '<=', '→': '->', '←': '<-', '≈': '~' };

function toWinAnsi(s: string): string {
  let out = '';
  for (const ch of s) {
    if (ch.codePointAt(0)! <= 0xff || WIN_ANSI_EXTRA.includes(ch)) out += ch;
    else if (WIN_ANSI_SUBSTITUTES[ch]) out += WIN_ANSI_SUBSTITUTES[ch];
  }
  // A leading symbol that got dropped (e.g. "⚠️ Title") would otherwise leave a stray space.
  return /^\s/.test(out) && !/^\s/.test(s) ? out.trimStart() : out;
}

/**
 * The built-in Helvetica only covers WinAnsi. A single character outside it (≥, ✓, emoji)
 * makes jsPDF encode the whole string as 2-byte text, which renders as letter-spaced garbage.
 */
export function restrictToWinAnsi(doc: jsPDF): void {
  const text = doc.text.bind(doc) as (...args: unknown[]) => jsPDF;
  const split = doc.splitTextToSize.bind(doc);
  const width = doc.getTextWidth.bind(doc);
  doc.text = ((s: string | string[], ...rest: unknown[]) =>
    text(Array.isArray(s) ? s.map(toWinAnsi) : toWinAnsi(s), ...rest)) as jsPDF['text'];
  doc.splitTextToSize = (s, maxLen, options) => split(toWinAnsi(s), maxLen, options);
  doc.getTextWidth = (s) => width(toWinAnsi(s));
}

export function soilLabel(soil: SoilType, tr: ReturnType<typeof t>): string {
  switch (soil) {
    case 'LOAM': return tr.soilLoam;
    case 'CLAY': return tr.soilClay;
    case 'SANDY': return tr.soilSandy;
    case 'CHALKY': return tr.soilChalky;
    case 'ACIDIC': return tr.soilAcidic;
    case 'SILT': return tr.soilSilt;
    default: return String(soil).replace(/_/g, ' ');
  }
}

function hexToRgb(hex: string): [number, number, number] {
  let clean = (hex || '').replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num) || clean.length !== 6) return [22, 163, 74];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/** Vector copy of public/favicon.svg (Lucide Sprout in a rounded #16a34a box). */
export function drawBrandLogoIcon(doc: jsPDF, x: number, y: number, sizeMm: number) {
  doc.setFillColor(22, 163, 74);
  const rx = sizeMm * 0.25;
  doc.roundedRect(x, y, sizeMm, sizeMm, rx, rx, 'F');

  // favicon.svg places the 24x24 icon at translate(12,12) scale(1.6667) in a 64x64 viewBox.
  const s = (1.6667 / 64) * sizeMm;
  const tx = (u: number) => x + (12 / 64) * sizeMm + u * s;
  const ty = (v: number) => y + (12 / 64) * sizeMm + v * s;

  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(Math.max(0.35, sizeMm * 0.055));

  // M7 20 h10
  doc.line(tx(7), ty(20), tx(17), ty(20));

  // M10 20 c5.5-2.5 .8-6.4 3-10
  doc.lines([[5.5, -2.5, 0.8, -6.4, 3, -10]], tx(10), ty(20), [s, s], 'S', false);

  // M9.5 9.4 c1.1.8 1.8 2.2 2.3 3.7 -2 .4 -3.5.4 -4.8-.3 -1.2-.6 -2.3-1.9 -3-4.2 2.8-.5 4.4 0 5.5.8 z
  doc.lines(
    [
      [1.1, 0.8, 1.8, 2.2, 2.3, 3.7],
      [-2.0, 0.4, -3.5, 0.4, -4.8, -0.3],
      [-1.2, -0.6, -2.3, -1.9, -3.0, -4.2],
      [2.8, -0.5, 4.4, 0.0, 5.5, 0.8]
    ],
    tx(9.5),
    ty(9.4),
    [s, s],
    'S',
    true
  );

  // M14.1 6 a7 7 0 0 0 -1.1 4 c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6 -2.7.1 -4 1 -4.9 2 z (arc approximated as a cubic)
  doc.lines(
    [
      [-0.65, 1.25, -1.02, 2.62, -1.1, 4.0],
      [1.9, -0.1, 3.3, -0.6, 4.3, -1.4],
      [1.0, -1.0, 1.6, -2.3, 1.7, -4.6],
      [-2.7, 0.1, -4.0, 1.0, -4.9, 2.0]
    ],
    tx(14.1),
    ty(6.0),
    [s, s],
    'S',
    true
  );
}

export function generateGardenPlanPdfDoc(options: GenerateGardenPdfOptions): jsPDF {
  const { garden } = options;
  const { language, starPlants, placedCompanions } = garden;
  const tr = t(language);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  restrictToWinAnsi(doc);

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Mirrors the Navbar branding.
  const addHeader = (title: string, sub: string) => {
    const headerY = 10;
    const headerH = 17;

    doc.setFillColor(255, 255, 255);
    doc.rect(margin, headerY, contentWidth, headerH, 'F');
    doc.setDrawColor(231, 229, 228); // stone-200
    doc.setLineWidth(0.4);
    doc.line(margin, headerY + headerH, margin + contentWidth, headerY + headerH);

    const logoSize = 10.5;
    const logoX = margin + 1;
    const logoY = headerY + 2.5;
    drawBrandLogoIcon(doc, logoX, logoY, logoSize);

    const brandTextX = logoX + logoSize + 3;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(28, 25, 23); // stone-900
    const mainWord = 'Pflanzengilde';
    doc.text(mainWord, brandTextX, logoY + 4.8);
    const mainWordW = doc.getTextWidth(mainWord);

    doc.setTextColor(22, 163, 74); // forest-600 (#16a34a)
    const tldWord = '.de';
    doc.text(tldWord, brandTextX + mainWordW, logoY + 4.8);
    const tldWordW = doc.getTextWidth(tldWord);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.8);
    const badgeText = tr.badge.toUpperCase();
    const badgeW = doc.getTextWidth(badgeText) + 3.6;
    const badgeX = brandTextX + mainWordW + tldWordW + 2.2;
    const badgeY = logoY + 1.3;
    doc.setFillColor(220, 252, 231); // forest-100
    doc.roundedRect(badgeX, badgeY, badgeW, 4.3, 2.1, 2.1, 'F');
    doc.setTextColor(22, 101, 52); // forest-800
    doc.text(badgeText, badgeX + 1.8, badgeY + 3.0);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(120, 113, 108); // stone-500
    doc.text(tr.appSubtitle, brandTextX, logoY + 9.2);
    const subtitleEndX = brandTextX + doc.getTextWidth(tr.appSubtitle);

    // Clip the right-aligned title/sub to one line so long garden names can't run into the brand block.
    const rightX = margin + contentWidth - 1;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(20, 83, 45); // forest-900
    doc.text(doc.splitTextToSize(title, rightX - (badgeX + badgeW + 4))[0] || '', rightX, logoY + 4.8, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(87, 83, 78); // stone-600
    doc.text(doc.splitTextToSize(sub, rightX - (subtitleEndX + 4))[0] || '', rightX, logoY + 9.2, { align: 'right' });
  };

  const addFooter = (pageNum: number, totalPages: number) => {
    const footerLineY = pageHeight - 13;
    doc.setDrawColor(231, 229, 228); // stone-200
    doc.setLineWidth(0.35);
    doc.line(margin, footerLineY, margin + contentWidth, footerLineY);

    const miniSize = 4.8;
    const miniY = footerLineY + 2.2;
    drawBrandLogoIcon(doc, margin, miniY, miniSize);

    const textX = margin + miniSize + 2.0;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(28, 25, 23); // stone-900
    const fBrand = 'Pflanzengilde';
    doc.text(fBrand, textX, miniY + 3.5);
    const fBrandW = doc.getTextWidth(fBrand);

    doc.setTextColor(22, 163, 74); // forest-600
    const fTld = '.de';
    doc.text(fTld, textX + fBrandW, miniY + 3.5);
    const fTldW = doc.getTextWidth(fTld);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(120, 113, 108); // stone-500
    const cleanFooterDesc = tr.footerText.replace(/^Pflanzengilde\.de\s*[–—-]\s*/, '');
    doc.text(` – ${cleanFooterDesc}`, textX + fBrandW + fTldW, miniY + 3.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(120, 113, 108);
    doc.text(
      tr.gardenPdfPageOf.replace('{page}', String(pageNum)).replace('{total}', String(totalPages)),
      margin + contentWidth,
      miniY + 3.5,
      { align: 'right' }
    );
  };

  const formatLayer = (l: string) => {
    switch (l) {
      case 'CANOPY': return tr.gardenPdfLayerCanopy;
      case 'SUB_CANOPY': return tr.gardenPdfLayerSubCanopy;
      case 'SHRUB': return tr.gardenPdfLayerShrub;
      case 'HERBACEOUS': return tr.gardenPdfLayerHerbaceous;
      case 'GROUND_COVER': return tr.layerGroundCover;
      case 'BULB_ROOT': return tr.gardenPdfLayerBulbRoot;
      case 'VINE': return tr.gardenPdfLayerVine;
      default: return l;
    }
  };

  // Short labels where the BOM column is tight; other roles use their regular name.
  const formatRole = (role: string): string => {
    switch (role) {
      case 'NITROGEN_FIXER': return tr.gardenPdfRoleNFixer;
      case 'DYNAMIC_ACCUMULATOR': return tr.gardenPdfRoleAccumulator;
      case 'POLLINATOR_MAGNET': return tr.tabPollinator;
      case 'PEST_REPELLER': return tr.gardenPdfRolePestRepeller;
      default: return translateRole(role, language);
    }
  };

  const soilName = soilLabel(garden.soil, tr);
  const zoneName = translateClimateZone(garden.zone, language);

  const starCountMap = new Map<string, { tree: typeof starPlants[0]['starTree']; count: number }>();
  for (const treeInst of starPlants) {
    const existing = starCountMap.get(treeInst.treeId);
    if (existing) existing.count++;
    else starCountMap.set(treeInst.treeId, { tree: treeInst.starTree, count: 1 });
  }

  const compCountMap = new Map<string, { plant: typeof placedCompanions[0]['plant']; count: number; mergedCount: number }>();
  for (const comp of placedCompanions) {
    const existing = compCountMap.get(comp.plantId);
    if (existing) {
      existing.count++;
      if (comp.isMerged) existing.mergedCount++;
    } else {
      compCountMap.set(comp.plantId, {
        plant: comp.plant,
        count: 1,
        mergedCount: comp.isMerged ? 1 : 0
      });
    }
  }

  // Page 1: overview map
  addHeader(
    garden.name || tr.gardenPdfDefaultTitle,
    `${starPlants.length} ${tr.gardenPdfStarPlants} • ${placedCompanions.length} ${tr.gardenPdfCompanionPlants} • ${soilName} / ${zoneName}`
  );

  doc.setFillColor(245, 245, 244);
  doc.roundedRect(margin, 30, contentWidth, 9.5, 2, 2, 'F');
  doc.setTextColor(28, 25, 23);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  const statsText = tr.gardenPdfStats
    .replace('{soil}', soilName)
    .replace('{zone}', zoneName)
    .replace('{hemisphere}', garden.hemisphere === 'NORTHERN' ? tr.gardenPdfHemisphereNorth : tr.gardenPdfHemisphereSouth)
    .replace('{date}', new Date().toLocaleDateString(tr.dateLocale));
  doc.text(statsText, margin + 4, 36.2);

  // Legend height is computed first so the map can take whatever is left on page 1.
  interface LegendItem {
    name: string;
    sub: string;
    color: string;
    isStarTree: boolean;
    isMerged?: boolean;
    count: number;
  }

  const legendItems: LegendItem[] = [];

  for (const { tree, count } of starCountMap.values()) {
    legendItems.push({
      name: getLoc(tree.commonName, language),
      sub: tr.gardenPdfStarTree,
      color: tree.color || '#ef4444',
      isStarTree: true,
      count
    });
  }

  for (const { plant, count, mergedCount } of compCountMap.values()) {
    legendItems.push({
      name: getLoc(plant.commonName, language),
      sub: formatLayer(plant.layer),
      color: plant.color || '#16a34a',
      isStarTree: false,
      isMerged: mergedCount > 0,
      count
    });
  }

  const numCols = legendItems.length <= 4 ? 2 : 3;
  const colW = (contentWidth - 8) / numCols;
  const numRows = Math.ceil(legendItems.length / numCols);
  const rowH = 4.6;
  const legendPaddingTop = 7.5;
  const legendSymbolsH = 7.5;
  const totalLegendH = Math.max(25, legendPaddingTop + numRows * rowH + legendSymbolsH + 3.5);

  const mapY = 42;
  const maxAvailableMapH = (pageHeight - 15) - totalLegendH - 6.5 - mapY;
  const mapW = contentWidth;
  const mapH = Math.max(95, Math.min(175, maxAvailableMapH));
  const mapX = margin;

  doc.setFillColor(250, 250, 249);
  doc.setDrawColor(214, 211, 209);
  doc.setLineWidth(0.5);
  doc.rect(mapX, mapY, mapW, mapH, 'FD');

  // Fit the map to the bounding box of all plants.
  const rawX = [...starPlants.map(s => s.xM), ...placedCompanions.map(c => c.xM)];
  const rawY = [...starPlants.map(s => s.yM), ...placedCompanions.map(c => c.yM)];
  const minXM = rawX.length > 0 ? Math.min(...rawX) : -5;
  const maxXM = rawX.length > 0 ? Math.max(...rawX) : 5;
  const minYM = rawY.length > 0 ? Math.min(...rawY) : -5;
  const maxYM = rawY.length > 0 ? Math.max(...rawY) : 5;

  const gardenCenterXM = (minXM + maxXM) / 2;
  const gardenCenterYM = (minYM + maxYM) / 2;
  const spanXM = Math.max(2.0, maxXM - minXM);
  const spanYM = Math.max(2.0, maxYM - minYM);

  // Padding keeps outer plant dots from clipping the frame.
  const padMm = 8.0;
  const usableW = mapW - padMm * 2;
  const usableH = mapH - padMm * 2;
  const scaleMmPerM = Math.min(usableW / spanXM, usableH / spanYM);

  const mapCenterX = mapX + mapW / 2;
  const mapCenterY = mapY + mapH / 2;

  const toPdfX = (xM: number) => mapCenterX + (xM - gardenCenterXM) * scaleMmPerM;
  const toPdfY = (yM: number) => mapCenterY + (yM - gardenCenterYM) * scaleMmPerM;

  const visibleWidthM = mapW / scaleMmPerM;
  const visibleHeightM = mapH / scaleMmPerM;
  const maxVisibleSpanM = Math.max(visibleWidthM, visibleHeightM);
  const stepM = maxVisibleSpanM > 30 ? 5 : maxVisibleSpanM > 12 ? 2 : 1;

  doc.setDrawColor(231, 229, 228);
  doc.setLineWidth(0.2);

  const startGridXM = Math.floor((gardenCenterXM - visibleWidthM / 2) / stepM) * stepM;
  const endGridXM = Math.ceil((gardenCenterXM + visibleWidthM / 2) / stepM) * stepM;
  for (let m = startGridXM; m <= endGridXM; m += stepM) {
    const xPos = toPdfX(m);
    if (xPos >= mapX && xPos <= mapX + mapW) {
      doc.line(xPos, mapY, xPos, mapY + mapH);
    }
  }

  const startGridYM = Math.floor((gardenCenterYM - visibleHeightM / 2) / stepM) * stepM;
  const endGridYM = Math.ceil((gardenCenterYM + visibleHeightM / 2) / stepM) * stepM;
  for (let m = startGridYM; m <= endGridYM; m += stepM) {
    const yPos = toPdfY(m);
    if (yPos >= mapY && yPos <= mapY + mapH) {
      doc.line(mapX, yPos, mapX + mapW, yPos);
    }
  }

  // Dimension lines from each star plant to its two nearest neighbours.
  if (starPlants.length >= 2) {
    doc.setDrawColor(71, 85, 105); // Slate 600
    doc.setLineWidth(0.3);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(51, 65, 85);

    const drawnPairs = new Set<string>();
    const edgesToDraw: Array<{ aIdx: number; bIdx: number; dist: number }> = [];

    const addEdge = (i: number, j: number) => {
      const pairKey = [Math.min(i, j), Math.max(i, j)].join('-');
      if (!drawnPairs.has(pairKey)) {
        drawnPairs.add(pairKey);
        const a = starPlants[i];
        const b = starPlants[j];
        const dist = Math.hypot(b.xM - a.xM, b.yM - a.yM);
        edgesToDraw.push({ aIdx: i, bIdx: j, dist });
      }
    };

    if (starPlants.length === 2) {
      addEdge(0, 1);
    } else {
      for (let i = 0; i < starPlants.length; i++) {
        const distances: Array<{ j: number; dist: number }> = [];
        for (let j = 0; j < starPlants.length; j++) {
          if (i === j) continue;
          const dist = Math.hypot(starPlants[j].xM - starPlants[i].xM, starPlants[j].yM - starPlants[i].yM);
          distances.push({ j, dist });
        }
        distances.sort((a, b) => a.dist - b.dist);
        if (distances[0]) addEdge(i, distances[0].j);
        if (distances[1]) addEdge(i, distances[1].j);
      }
    }

    for (const edge of edgesToDraw) {
      const a = starPlants[edge.aIdx];
      const b = starPlants[edge.bIdx];
      const ax = toPdfX(a.xM);
      const ay = toPdfY(a.yM);
      const bx = toPdfX(b.xM);
      const by = toPdfY(b.yM);

      doc.setDrawColor(71, 85, 105);
      doc.setLineWidth(0.3);
      doc.line(ax, ay, bx, by);

      // Perpendicular end ticks
      const angle = Math.atan2(by - ay, bx - ax);
      const perpAngle = angle + Math.PI / 2;
      const tickLen = 2.0;
      doc.line(
        ax - Math.cos(perpAngle) * tickLen,
        ay - Math.sin(perpAngle) * tickLen,
        ax + Math.cos(perpAngle) * tickLen,
        ay + Math.sin(perpAngle) * tickLen
      );
      doc.line(
        bx - Math.cos(perpAngle) * tickLen,
        by - Math.sin(perpAngle) * tickLen,
        bx + Math.cos(perpAngle) * tickLen,
        by + Math.sin(perpAngle) * tickLen
      );

      const midX = (ax + bx) / 2;
      const midY = (ay + by) / 2;
      const labelText = `${formatNumber(edge.dist, 1, language)} m`;
      const textW = doc.getTextWidth(labelText);

      doc.setFillColor(255, 255, 255);
      doc.rect(midX - textW / 2 - 1.2, midY - 2.2, textW + 2.4, 4.4, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(51, 65, 85);
      doc.text(labelText, midX, midY + 1.1, { align: 'center' });
    }
  }

  // Star plants: species-coloured node with a white pin; the legend identifies species.
  for (const treeInst of starPlants) {
    const tx = toPdfX(treeInst.xM);
    const ty = toPdfY(treeInst.yM);
    const treeColor = treeInst.starTree.color || '#ef4444';
    const [r, g, b] = hexToRgb(treeColor);

    doc.setFillColor(r, g, b);
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.45);
    doc.circle(tx, ty, 2.5, 'FD');

    doc.setFillColor(255, 255, 255);
    doc.circle(tx, ty, 0.8, 'F');
  }

  // Companions: shared ones get an outer ring in their own colour.
  for (const comp of placedCompanions) {
    const cx = toPdfX(comp.xM);
    const cy = toPdfY(comp.yM);
    const [r, g, b] = hexToRgb(comp.plant.color || '#16a34a');

    doc.setFillColor(r, g, b);
    doc.circle(cx, cy, 1.5, 'F');

    if (comp.isMerged) {
      doc.setDrawColor(r, g, b);
      doc.setLineWidth(0.35);
      doc.circle(cx, cy, 2.4, 'S');
    }
  }

  doc.setTextColor(120, 113, 108);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(
    tr.gardenPdfGridScale
      .replace('{step}', String(stepM))
      .replace('{spanX}', formatNumber(spanXM, 1, language))
      .replace('{spanY}', formatNumber(spanYM, 1, language)),
    mapCenterX,
    mapY + mapH + 3.8,
    { align: 'center' }
  );

  const legendY = mapY + mapH + 6.2;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, legendY, contentWidth, totalLegendH, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(20, 83, 45);
  doc.text(
    tr.gardenPdfColorKey,
    margin + 4,
    legendY + 5.2
  );

  for (let i = 0; i < legendItems.length; i++) {
    const item = legendItems[i];
    const col = i % numCols;
    const row = Math.floor(i / numCols);
    const itemX = margin + 4 + col * colW;
    const itemY = legendY + legendPaddingTop + row * rowH;

    const [r, g, b] = hexToRgb(item.color);

    if (item.isStarTree) {
      doc.setFillColor(r, g, b);
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.3);
      doc.circle(itemX + 2.5, itemY + 0.5, 2.0, 'FD');
      doc.setFillColor(255, 255, 255);
      doc.circle(itemX + 2.5, itemY + 0.5, 0.6, 'F');
    } else {
      doc.setFillColor(r, g, b);
      doc.circle(itemX + 2.5, itemY + 0.5, 1.4, 'F');
      if (item.isMerged) {
        doc.setDrawColor(r, g, b);
        doc.setLineWidth(0.3);
        doc.circle(itemX + 2.5, itemY + 0.5, 2.2, 'S');
      }
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(30, 41, 59);
    const label = `${item.count}× ${item.name}`;
    doc.text(label.slice(0, 22), itemX + 6, itemY + 1.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139);
    doc.text(`(${item.sub})`, itemX + 6 + doc.getTextWidth(label.slice(0, 22)) + 1.5, itemY + 1.2);
  }

  // Symbol key
  const symY = legendY + legendPaddingTop + numRows * rowH + 3.5;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.25);
  doc.line(margin + 4, symY - 1.5, margin + contentWidth - 4, symY - 1.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);

  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(0.3);
  doc.line(margin + 6, symY + 1.5, margin + 18, symY + 1.5);
  doc.line(margin + 6, symY + 0.3, margin + 6, symY + 2.7);
  doc.line(margin + 18, symY + 0.3, margin + 18, symY + 2.7);
  doc.text(
    tr.gardenPdfCadLine,
    margin + 21,
    symY + 2.2
  );

  doc.setFillColor(16, 185, 129);
  doc.circle(margin + 115, symY + 1.5, 1.2, 'F');
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.3);
  doc.circle(margin + 115, symY + 1.5, 2.0, 'S');
  doc.text(
    tr.gardenPdfSharedRing,
    margin + 120,
    symY + 2.2
  );

  // Page 2: bill of materials
  doc.addPage();
  addHeader(
    tr.gardenPdfBomTitle,
    tr.gardenPdfBomSub
  );

  let curY = 36;

  interface BomRow {
    color: string;
    qty: number;
    isStar: boolean;
    type: string;
    name: string;
    botanical: string;
    layer: string;
    functions: string;
  }

  const bomRows: BomRow[] = [];

  for (const { tree, count } of starCountMap.values()) {
    bomRows.push({
      color: tree.color || '#ef4444',
      qty: count,
      isStar: true,
      type: tr.gardenPdfStarTree,
      name: getLoc(tree.commonName, language),
      botanical: tree.botanicalName,
      layer: tr.gardenPdfCanopyLayer,
      functions: tr.gardenPdfStarFunctions,
    });
  }

  for (const { plant, count } of compCountMap.values()) {
    bomRows.push({
      color: plant.color || '#16a34a',
      qty: count,
      isStar: false,
      type: tr.gardenPdfCompanion,
      name: getLoc(plant.commonName, language),
      botanical: plant.botanicalName,
      layer: formatLayer(plant.layer),
      functions: plant.roles.slice(0, 2).map(formatRole).join(', '),
    });
  }

  const renderTableHeader = (y: number) => {
    doc.setFillColor(240, 253, 244);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(20, 83, 45);

    doc.text(tr.gardenPdfColColor, margin + 3, y + 4.8);
    doc.text(tr.gardenPdfColPos, margin + 14, y + 4.8);
    doc.text(tr.gardenPdfColQty, margin + 23, y + 4.8);
    doc.text(tr.gardenPdfColType, margin + 37, y + 4.8);
    doc.text(tr.gardenPdfColName, margin + 60, y + 4.8);
    doc.text(tr.gardenPdfColBotanical, margin + 98, y + 4.8);
    doc.text(tr.layer, margin + 138, y + 4.8);
    doc.text(tr.gardenPdfColRoles, margin + 158, y + 4.8);

    doc.setDrawColor(187, 247, 208);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 7, margin + contentWidth, y + 7);
  };

  renderTableHeader(curY);
  curY += 9;

  doc.setFontSize(7.5);
  for (let idx = 0; idx < bomRows.length; idx++) {
    const row = bomRows[idx];

    if (curY > pageHeight - 22) {
      doc.addPage();
      addHeader(
        tr.gardenPdfBomContTitle,
        tr.gardenPdfBomContSub
      );
      curY = 36;
      renderTableHeader(curY);
      curY += 9;
    }

    const [r, g, b] = hexToRgb(row.color);

    if (idx % 2 === 1) {
      doc.setFillColor(250, 250, 249);
      doc.rect(margin, curY - 3.5, contentWidth, 5.5, 'F');
    }

    doc.setFillColor(r, g, b);
    doc.rect(margin, curY - 3.5, 2.0, 5.5, 'F');

    doc.setFillColor(r, g, b);
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.25);
    doc.circle(margin + 6.5, curY - 0.8, 1.8, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(String(idx + 1), margin + 14, curY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 83, 45);
    doc.text(`${row.qty}×`, margin + 23, curY);

    doc.setFont('helvetica', 'normal');
    if (row.isStar) doc.setTextColor(20, 83, 45);
    else doc.setTextColor(71, 85, 105);
    doc.text(row.type, margin + 37, curY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(28, 25, 23);
    doc.text(row.name.slice(0, 22), margin + 60, curY);

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(87, 83, 78);
    doc.text(row.botanical.slice(0, 24), margin + 98, curY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(row.layer, margin + 138, curY);

    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text(row.functions.slice(0, 22), margin + 158, curY);
    doc.setFontSize(7.5);

    curY += 5.5;
  }

  // Page 3: antagonisms and maintenance
  doc.addPage();
  addHeader(
    tr.gardenPdfHarmonyTitle,
    tr.gardenPdfHarmonySub
  );

  let p3Y = 36;

  const conflicts = analyzeGardenAntagonisms(starPlants, placedCompanions);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(conflicts.length > 0 ? 185 : 20, conflicts.length > 0 ? 28 : 83, conflicts.length > 0 ? 28 : 45);
  doc.text(
    conflicts.length > 0
      ? tr.gardenPdfConflictsFound
      : tr.gardenPdfNoConflicts,
    margin,
    p3Y
  );
  p3Y += 6;

  if (conflicts.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(68, 64, 60);
    doc.text(
      tr.gardenPdfNoConflictsText,
      margin,
      p3Y
    );
    p3Y += 12;
  } else {
    const severityLabel = { CRITICAL: tr.antagonistCriticalAlert, WARNING: tr.antagonistWarningAlert, INFO: tr.antagonistInfoAlert };
    for (const c of conflicts) {
      // Wrap with the same fonts the lines are drawn in.
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      const splitTitle: string[] = doc.splitTextToSize(`[${severityLabel[c.severity]}] ${getLoc(c.title, language)}`, contentWidth);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      const splitDesc: string[] = doc.splitTextToSize(getLoc(c.description, language), contentWidth);
      const itemH = splitTitle.length * 4.5 + splitDesc.length * 3.8 + 4;
      if (p3Y + itemH > pageHeight - 24) {
        doc.addPage();
        addHeader(
          tr.gardenPdfHarmonyContTitle,
          tr.gardenPdfHarmonyContSub
        );
        p3Y = 36;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(c.severity === 'CRITICAL' ? 185 : 180, c.severity === 'CRITICAL' ? 28 : 83, 28);
      for (const line of splitTitle) {
        doc.text(line, margin, p3Y);
        p3Y += 4.5;
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(41, 37, 36);
      doc.text(splitDesc, margin, p3Y);
      p3Y += splitDesc.length * 3.8 + 4;
    }
  }

  if (p3Y + 60 > pageHeight - 22) {
    doc.addPage();
    addHeader(
      tr.gardenPdfHarmonyContTitle,
      tr.gardenPdfMicroChopContSub
    );
    p3Y = 36;
  }

  const shadePockets = detectGardenShadePockets(starPlants);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 83, 45);
  doc.text(tr.gardenPdfShadingTitle, margin, p3Y);
  p3Y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(68, 64, 60);
  if (shadePockets.length === 0) {
    doc.text(
      tr.gardenPdfNoShade,
      margin,
      p3Y
    );
    p3Y += 12;
  } else {
    const shadeLines: string[] = doc.splitTextToSize(tr.gardenPdfShadePockets.replace('{count}', String(shadePockets.length)), contentWidth);
    for (const line of shadeLines) {
      doc.text(line, margin, p3Y);
      p3Y += 3.8;
    }
    p3Y += 10 - 3.8;
  }

  doc.setFillColor(245, 245, 244);
  doc.roundedRect(margin, p3Y, contentWidth, 34, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(20, 83, 45);
  doc.text(tr.gardenPdfChopTitle, margin + 4, p3Y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(41, 37, 36);
  const chopText = tr.gardenPdfChopText;
  const splitChop = doc.splitTextToSize(chopText, contentWidth - 8);
  doc.text(splitChop, margin + 4, p3Y + 12);

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  return doc;
}

export async function exportGardenPlanPdf(options: GenerateGardenPdfOptions): Promise<void> {
  const doc = generateGardenPlanPdfDoc(options);
  const filename = `${(options.garden.name || 'permakultur_garten').toLowerCase().replace(/[^a-z0-9äöüß]+/gi, '_')}_plan.pdf`;
  doc.save(filename);
}
