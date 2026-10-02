import { jsPDF, GState } from 'jspdf';
import { buildRadialCoverInput, computeGroundCovers } from './groundCoverEngine';
import {
  GuildPlant,
  Hemisphere,
  Language,
  PlantLayer,
  PlantingZone,
  CardinalSector,
  PlacedPlant,
  SoilType,
  StarTree,
  TreeAgeMode,
  ClimateZone,
  getLoc
} from '../types/guild';
import { autoPlaceGuildPlants, calculateSpatialMetrics } from './placementRules';
import { calculateRoleCoverage, ALL_ROLES } from './roleCoverageEngine';
import { t, formatNumber, translateStarCategory, translateSeason } from '../i18n/translations';
import { captureRadialMapSvg } from './svgCapture';
import { preloadGuildImages } from './imageLoader';
import { analyzeGuildAntagonisms } from './antagonistEngine';
import { drawBrandLogoIcon, restrictToWinAnsi, soilLabel } from './gardenPdfExporter';

export interface GeneratePdfOptions {
  starTree: StarTree;
  selectedPlants: GuildPlant[];
  selectedSoil: SoilType;
  hemisphere: Hemisphere;
  language: Language;
  radialMapDataUrl?: string | null;
  treeImageDataUrl?: string | null;
  plantImages?: Map<string, string>;
  /** Ground-cover areas in the vector fallback map. */
  treeAge?: TreeAgeMode;
  selectedZone?: ClimateZone;
}

/** Small radar in each plant card: trunk, zone rings and this plant's position. */
function drawMiniPlantingMap(
  doc: jsPDF,
  placed: PlacedPlant,
  starTree: StarTree,
  hemisphere: Hemisphere,
  language: Language,
  x: number,
  y: number,
  size: number
) {
  const tr = t(language);
  const metrics = calculateSpatialMetrics(starTree);
  const outerM = metrics.outerZoneMaxM;
  const cx = x + size / 2;
  const cy = y + size / 2 - 2.5;
  const radarR = (size / 2) - 3.5;
  const scale = (radarR * 0.96) / (outerM + 0.3);

  doc.setFillColor(248, 250, 252);
  doc.circle(cx, cy, radarR, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.35);
  doc.circle(cx, cy, radarR, 'S');

  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  doc.line(cx, cy - radarR + 1, cx, cy + radarR - 1);
  doc.line(cx - radarR + 1, cy, cx + radarR - 1, cy);

  // Bulb ring, mid zone, drip line, drip zone
  doc.setDrawColor(245, 158, 11);
  doc.circle(cx, cy, metrics.bulbRingOuterM * scale, 'S');

  doc.setDrawColor(2, 132, 199);
  doc.circle(cx, cy, metrics.midZoneOuterM * scale, 'S');
  doc.setDrawColor(22, 163, 74);
  doc.circle(cx, cy, metrics.dripLineM * scale, 'S');
  doc.setDrawColor(5, 150, 105);
  doc.circle(cx, cy, metrics.dripZoneOuterM * scale, 'S');

  doc.setFillColor(120, 53, 15);
  doc.circle(cx, cy, 1.1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(2, 132, 199);
  doc.text(hemisphere === 'NORTHERN' ? tr.pdfCompassNorth : `${tr.pdfCompassNorth}*`, cx, cy - radarR + 2, { align: 'center' });
  doc.setTextColor(217, 119, 6);
  doc.text(hemisphere === 'NORTHERN' ? `${tr.pdfCompassSouth}*` : tr.pdfCompassSouth, cx, cy + radarR - 0.5, { align: 'center' });

  const rad = ((placed.angleDeg - 90) * Math.PI) / 180;
  const px = cx + placed.distanceM * scale * Math.cos(rad);
  const py = cy + placed.distanceM * scale * Math.sin(rad);

  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.4);
  doc.line(cx, cy, px, py);

  doc.setFillColor(220, 38, 38);
  doc.circle(px, py, 1.8, 'F');
  doc.setFillColor(255, 255, 255);
  doc.circle(px, py, 0.7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(180, 83, 9);
  doc.text(`${formatNumber(placed.distanceM, 2, language)} m`, cx, y + size - 1.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  doc.setTextColor(100, 116, 139);
  const shortSector = placed.sector === 'NORTH_SHADE' ? tr.pdfCompassNorth : placed.sector === 'SOUTH_SUN' ? tr.pdfCompassSouth : placed.sector === 'EAST_MORNING' ? tr.pdfCompassEast : placed.sector === 'WEST_WIND' ? tr.pdfCompassWest : '*';
  doc.text(`${placed.angleDeg}° • ${shortSector}`, cx, y + size + 1.5, { align: 'center' });
}

/** Vector fallback for the radial map when the on-screen SVG can't be captured (or outside a browser). */
function drawNativeRadialMap(
  doc: jsPDF,
  starTree: StarTree,
  placedPlants: PlacedPlant[],
  hemisphere: Hemisphere,
  language: Language,
  cx: number,
  cy: number,
  maxR: number,
  coverOpts: { treeAge: TreeAgeMode; zone?: ClimateZone } = { treeAge: 'YOUNG' }
) {
  const metrics = calculateSpatialMetrics(starTree);
  const outerM = metrics.outerZoneMaxM;
  const scale = (maxR * 0.94) / (outerM + 0.3);

  doc.setFillColor(250, 250, 249);
  doc.circle(cx, cy, maxR, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.circle(cx, cy, maxR, 'S');

  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(cx, cy - maxR + 2, cx, cy + maxR - 2);
  doc.line(cx - maxR + 2, cy, cx + maxR - 2, cy);

  // Ladder / harvest corridor
  const radL1 = ((metrics.ladderSectorStartDeg - 90) * Math.PI) / 180;
  const radL2 = ((metrics.ladderSectorEndDeg - 90) * Math.PI) / 180;
  doc.setDrawColor(180, 180, 180);
  doc.line(cx, cy, cx + maxR * Math.cos(radL1), cy + maxR * Math.sin(radL1));
  doc.line(cx, cy, cx + maxR * Math.cos(radL2), cy + maxR * Math.sin(radL2));

  // Rings are filled outermost first so inner zones paint over outer ones.
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(5, 150, 105);
  doc.circle(cx, cy, metrics.dripZoneOuterM * scale, 'FD');

  doc.setDrawColor(22, 163, 74);
  doc.circle(cx, cy, metrics.dripLineM * scale, 'S');

  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(2, 132, 199);
  doc.circle(cx, cy, metrics.midZoneOuterM * scale, 'FD');

  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(217, 119, 6);
  doc.circle(cx, cy, metrics.bulbRingOuterM * scale, 'FD');

  doc.setFillColor(254, 226, 226);
  doc.setDrawColor(220, 38, 38);
  doc.circle(cx, cy, metrics.collarRadiusM * scale, 'FD');

  // Ground-cover areas (same engine as the on-screen map), clipped to the map disc
  const covers = computeGroundCovers(buildRadialCoverInput(starTree, placedPlants, { hemisphere, zone: coverOpts.zone, treeAge: coverOpts.treeAge }));
  if (covers.length > 0) {
    doc.saveGraphicsState();
    doc.circle(cx, cy, maxR, null);
    doc.clip();
    doc.discardPath();
    for (const shape of covers) {
      const hex = (shape.color || '#16a34a').replace('#', '');
      const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
      doc.setGState(new GState({ opacity: Math.min(0.5, shape.opacity + 0.06) }));
      doc.setFillColor(r, g, b);
      let any = false;
      for (const ring of shape.rings) {
        if (ring.length < 3) continue;
        doc.moveTo(cx + ring[0][0] * scale, cy + ring[0][1] * scale);
        for (let i = 1; i < ring.length; i++) doc.lineTo(cx + ring[i][0] * scale, cy + ring[i][1] * scale);
        doc.close();
        any = true;
      }
      if (any) doc.fillEvenOdd();
      if (shape.dots.length > 0) {
        doc.setGState(new GState({ opacity: 0.8 }));
        for (const [x, y] of shape.dots) doc.circle(cx + x * scale, cy + y * scale, 0.35, 'F');
      }
    }
    doc.restoreGraphicsState();
  }

  doc.setFillColor(120, 53, 15);
  doc.circle(cx, cy, 2.5, 'F');

  const tr = t(language);
  const sun = tr.pdfCompassSun;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(2, 132, 199);
  doc.text(hemisphere === 'NORTHERN' ? tr.pdfCompassNorth : `${tr.pdfCompassNorth} (${sun})`, cx, cy - maxR + 5, { align: 'center' });
  doc.setTextColor(217, 119, 6);
  doc.text(hemisphere === 'NORTHERN' ? `${tr.pdfCompassSouth} (${sun})` : tr.pdfCompassSouth, cx, cy + maxR - 2, { align: 'center' });
  doc.setTextColor(120, 113, 108);
  doc.text(tr.pdfCompassEast, cx + maxR - 4, cy + 1);
  doc.text(tr.pdfCompassWest, cx - maxR + 2, cy + 1);

  // Metre ticks on the east axis
  [1, 2, 3, 4, 5].filter(m => m <= outerM).forEach(m => {
    const tx = cx + m * scale;
    doc.setDrawColor(100, 116, 139);
    doc.line(tx, cy - 1, tx, cy + 1);
    doc.setFontSize(5);
    doc.setTextColor(100, 116, 139);
    doc.text(`${m}m`, tx, cy + 3.2, { align: 'center' });
  });

  placedPlants.forEach((placed, idx) => {
    const rad = ((placed.angleDeg - 90) * Math.PI) / 180;
    const px = cx + placed.distanceM * scale * Math.cos(rad);
    const py = cy + placed.distanceM * scale * Math.sin(rad);

    doc.setFillColor(22, 101, 52);
    doc.circle(px, py, 2.5, 'F');
    doc.setDrawColor(255, 255, 255);
    doc.circle(px, py, 2.5, 'S');

    doc.setFontSize(5);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(`${idx + 1}`, px, py + 0.8, { align: 'center' });
  });
}

export function generateGuildPdf({
  starTree,
  selectedPlants,
  selectedSoil,
  hemisphere,
  language,
  radialMapDataUrl,
  treeImageDataUrl,
  plantImages,
  treeAge,
  selectedZone
}: GeneratePdfOptions): jsPDF {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
    compress: true
  });
  restrictToWinAnsi(doc);

  const tr = t(language);
  const placedPlants = autoPlaceGuildPlants(starTree, selectedPlants, hemisphere);
  const coverageReports = calculateRoleCoverage(selectedPlants);
  const coveredCount = coverageReports.filter(r => r.covered).length;
  const efficiencyPercent = Math.round((coveredCount / ALL_ROLES.length) * 100);

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2;
  let currentY = 12;

  // Starts a continuation page with a compact brand header when the next block doesn't fit.
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 14) {
      doc.addPage();
      currentY = 10;
      drawBrandLogoIcon(doc, marginX, currentY - 1, 5.5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(28, 25, 23);
      doc.text('Pflanzengilde', marginX + 7, currentY + 3);
      const pgW = doc.getTextWidth('Pflanzengilde');
      doc.setTextColor(22, 163, 74);
      doc.text('.de', marginX + 7 + pgW, currentY + 3);
      const deW = doc.getTextWidth('.de');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(87, 83, 78);
      const pageHeaderTitle = `• ${getLoc(starTree.commonName, language)} (${starTree.botanicalName}) • ${tr.pdfTitle}`;
      const pageHeaderLines = doc.splitTextToSize(pageHeaderTitle, contentWidth - (9 + pgW + deW));
      doc.text(pageHeaderLines[0] || '', marginX + 9 + pgW + deW, currentY + 3);
      doc.setDrawColor(231, 229, 228);
      doc.setLineWidth(0.3);
      doc.line(marginX, currentY + 6, marginX + contentWidth, currentY + 6);
      currentY += 11;
    }
  };

  const getShortZoneLabel = (zone: PlantingZone): string => {
    switch (zone) {
      case 'ZONE_0_COLLAR':
        return tr.zoneCollar;
      case 'ZONE_1_BULB':
        return tr.zoneBulb;
      case 'ZONE_2_MID':
        return tr.zoneMid;
      case 'ZONE_3_DRIP':
        return tr.pdfZoneDripShort;
      case 'ZONE_4_OUTER':
        return tr.pdfZoneOuterShort;
    }
  };

  const getShortSectorLabel = (sector: CardinalSector): string => {
    switch (sector) {
      case 'NORTH_SHADE':
        return tr.pdfSectorNorthShort;
      case 'SOUTH_SUN':
        return tr.pdfSectorSouthShort;
      case 'EAST_MORNING':
        return tr.pdfSectorEastShort;
      case 'WEST_WIND':
        return tr.pdfSectorWestShort;
      case 'ANY':
        return tr.pdfSectorAnyShort;
    }
  };

  const getLayerLabel = (layer: PlantLayer): string => {
    switch (layer) {
      case 'CANOPY': return tr.layerCanopy;
      case 'SUB_CANOPY': return tr.pdfLayerSubCanopy;
      case 'SHRUB': return tr.layerShrub;
      case 'HERBACEOUS': return tr.layerHerbaceous;
      case 'GROUND_COVER': return tr.layerGroundCover;
      case 'BULB_ROOT': return tr.pdfLayerBulbRoot;
      case 'VINE': return tr.layerVine;
    }
  };

  // Page 1: brand header
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(231, 229, 228); // stone-200
  doc.setLineWidth(0.35);
  doc.roundedRect(marginX, currentY - 3, contentWidth, 23, 2, 2, 'FD');

  drawBrandLogoIcon(doc, marginX + 3.5, currentY - 0.5, 9);

  const brandX = marginX + 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(28, 25, 23); // stone-900
  doc.text('Pflanzengilde', brandX, currentY + 3.8);
  const pgWidth = doc.getTextWidth('Pflanzengilde');
  doc.setTextColor(22, 163, 74); // forest-600 (#16a34a)
  doc.text('.de', brandX + pgWidth, currentY + 3.8);
  const dotDeWidth = doc.getTextWidth('.de');

  const badgeText = tr.badge;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  const badgeW = doc.getTextWidth(badgeText) + 3.6;
  const badgeX = brandX + pgWidth + dotDeWidth + 2.5;
  doc.setFillColor(220, 252, 231); // forest-100
  doc.roundedRect(badgeX, currentY + 0.3, badgeW, 4.5, 1.5, 1.5, 'F');
  doc.setTextColor(22, 101, 52); // forest-800
  doc.text(badgeText, badgeX + 1.8, currentY + 3.3);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(120, 113, 108); // stone-500
  doc.text(tr.appSubtitle, brandX, currentY + 7.5);

  const dateString = new Date().toLocaleDateString(tr.dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(20, 83, 45); // forest-900
  doc.text(tr.pdfTitle, marginX + contentWidth - 3.5, currentY + 4.2, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(120, 113, 108);
  doc.text(`${tr.generatedOn} ${dateString}`, marginX + contentWidth - 3.5, currentY + 8.0, { align: 'right' });

  // Tree & site summary strip
  doc.setFillColor(240, 253, 244); // forest-50
  doc.roundedRect(marginX + 2, currentY + 10.5, contentWidth - 4, 7.5, 1.2, 1.2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(22, 101, 52);
  const treeTitle = `${getLoc(starTree.commonName, language)} (${starTree.botanicalName})`;
  const hemisphereLabel = hemisphere === 'NORTHERN' ? tr.northHemisphere : tr.southHemisphere;
  const soilSummary = `${tr.soilType}: ${soilLabel(selectedSoil, tr)}`;
  const bannerSubLines = doc.splitTextToSize(`${treeTitle} • ${soilSummary} • ${hemisphereLabel}`, contentWidth - 10);
  doc.text(bannerSubLines[0] || '', marginX + 5, currentY + 15.5);

  currentY += 24;

  // Tree profile (left) and site conditions (right)
  const leftColW = 96;
  const rightColW = contentWidth - leftColW - 4;
  const cardHeight = 46;

  doc.setFillColor(240, 253, 244); // Emerald 50
  doc.setDrawColor(187, 247, 208); // Emerald 200
  doc.roundedRect(marginX, currentY, leftColW, cardHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(20, 83, 45);
  doc.text(`1. ${tr.pdfKeystoneTree}`, marginX + 3.5, currentY + 6);

  let textLeftX = marginX + 3.5;
  let textWidth = leftColW - 7;

  if (treeImageDataUrl) {
    try {
      const treePhotoSize = 27;
      doc.addImage(treeImageDataUrl, 'JPEG', marginX + 3.5, currentY + 9, treePhotoSize, treePhotoSize);
      doc.setDrawColor(187, 247, 208);
      doc.setLineWidth(0.3);
      doc.rect(marginX + 3.5, currentY + 9, treePhotoSize, treePhotoSize, 'S');

      doc.setFontSize(5.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      const catName = translateStarCategory(starTree.category, language);
      doc.text(catName, marginX + 3.5 + treePhotoSize / 2, currentY + 9 + treePhotoSize + 4, { align: 'center' });

      textLeftX = marginX + 3.5 + treePhotoSize + 3.5;
      textWidth = leftColW - treePhotoSize - 9;
    } catch (e) {
      console.warn('Failed to embed tree image:', e);
    }
  }

  doc.setFontSize(7.2);
  doc.setTextColor(51, 65, 85);

  doc.setFont('helvetica', 'bold');
  doc.text(tr.pdfSpeciesLabel, textLeftX, currentY + 11.2);
  doc.setFont('helvetica', 'normal');
  const treeNameLines = doc.splitTextToSize(getLoc(starTree.commonName, language), textWidth - 11);
  doc.text(treeNameLines[0] || '', textLeftX + 11, currentY + 11.2);

  doc.setFont('helvetica', 'bold');
  doc.text(tr.pdfDripLabel, textLeftX, currentY + 15.6);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formatNumber(starTree.matureRadiusM, 1, language)}m (${formatNumber(starTree.matureRadiusM * 2, 1, language)}m Ø)`, textLeftX + 11, currentY + 15.6);

  doc.setFont('helvetica', 'bold');
  doc.text(tr.pdfRootLabel, textLeftX, currentY + 20.0);
  doc.setFont('helvetica', 'normal');
  const rootHabitText = starTree.rootHabit === 'SURFACE_FEEDER'
    ? tr.pdfRootSurface
    : starTree.rootHabit === 'DEEP_TAP'
    ? tr.rootDeep
    : tr.rootWide;
  doc.text(rootHabitText, textLeftX + 11, currentY + 20.0);

  doc.setFont('helvetica', 'bold');
  doc.text(tr.pdfPestsLabel, textLeftX, currentY + 24.4);
  doc.setFont('helvetica', 'normal');
  const vulnText = starTree.vulnerabilities[language].slice(0, 2).join(', ');
  const vulnLines = doc.splitTextToSize(vulnText, textWidth - 11);
  doc.text(vulnLines[0] || '', textLeftX + 11, currentY + 24.4);

  if (starTree.plantingTime) {
    doc.setFont('helvetica', 'bold');
    doc.text(tr.pdfPlantingLabel, textLeftX, currentY + 28.8);
    doc.setFont('helvetica', 'normal');
    const ptLines = doc.splitTextToSize(getLoc(starTree.plantingTime, language), textWidth - 14);
    doc.text(ptLines[0] || '', textLeftX + 14, currentY + 28.8);
  }

  if (starTree.harvestTime) {
    doc.setFont('helvetica', 'bold');
    doc.text(tr.pdfHarvestLabel, textLeftX, currentY + 33.2);
    doc.setFont('helvetica', 'normal');
    const htLines = doc.splitTextToSize(getLoc(starTree.harvestTime, language), textWidth - 14);
    doc.text(htLines[0] || '', textLeftX + 14, currentY + 33.2);
  }

  const treeDesc = getLoc(starTree.description, language);
  const treeDescLines = doc.splitTextToSize(treeDesc, textWidth);
  doc.setFontSize(6.4);
  doc.setTextColor(100, 116, 139);
  doc.text(treeDescLines[0] || '', textLeftX, currentY + 38.0);
  if (treeDescLines[1]) {
    doc.text(treeDescLines[1], textLeftX, currentY + 41.8);
  }

  const rightX = marginX + leftColW + 4;
  doc.setFillColor(254, 252, 232);
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(rightX, currentY, rightColW, cardHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(146, 64, 14);
  doc.text(`2. ${tr.pdfSiteParams}`, rightX + 3.5, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 83, 9);
  doc.text(`${tr.soilType}: ${soilLabel(selectedSoil, tr)}`, rightX + 3.5, currentY + 12);

  let soilDesc = '';
  switch (selectedSoil) {
    case 'LOAM': soilDesc = tr.soilLoamDesc; break;
    case 'CLAY': soilDesc = tr.soilClayDesc; break;
    case 'SANDY': soilDesc = tr.soilSandyDesc; break;
    case 'CHALKY': soilDesc = tr.soilChalkyDesc; break;
    case 'ACIDIC': soilDesc = tr.soilAcidicDesc; break;
    case 'SILT': soilDesc = tr.soilSiltDesc; break;
  }
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const soilDescLines = doc.splitTextToSize(soilDesc, rightColW - 7);
  doc.text(soilDescLines[0] || '', rightX + 3.5, currentY + 17);
  doc.text(soilDescLines[1] || '', rightX + 3.5, currentY + 21.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text(tr.pdfTreeAdviceLabel, rightX + 3.5, currentY + 28);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const adviceLines = doc.splitTextToSize(getLoc(starTree.soilAdvice, language), rightColW - 7);
  doc.text(adviceLines[0] || '', rightX + 3.5, currentY + 33);
  doc.text(adviceLines[1] || '', rightX + 3.5, currentY + 37.5);

  currentY += cardHeight + 5;

  // Radial map
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 83, 45);
  doc.text(`3. ${tr.pdfRadialMap}`, marginX, currentY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(tr.pdfRadialMapSub, marginX, currentY + 8.5);

  const mapContainerY = currentY + 11;
  const mapContainerH = 158;

  doc.setFillColor(250, 250, 249);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, mapContainerY, contentWidth, mapContainerH, 2.5, 2.5, 'FD');

  const mapSize = 126;
  const mapX = marginX + (contentWidth - mapSize) / 2;
  const mapY = mapContainerY + 3;

  if (radialMapDataUrl) {
    try {
      doc.addImage(radialMapDataUrl, 'PNG', mapX, mapY, mapSize, mapSize);
    } catch (err) {
      console.warn('Failed to embed captured radial map image, using native vector fallback:', err);
      drawNativeRadialMap(doc, starTree, placedPlants, hemisphere, language, marginX + contentWidth / 2, mapY + mapSize / 2, mapSize / 2, { treeAge: treeAge ?? 'YOUNG', zone: selectedZone });
    }
  } else {
    drawNativeRadialMap(doc, starTree, placedPlants, hemisphere, language, marginX + contentWidth / 2, mapY + mapSize / 2, mapSize / 2, { treeAge: treeAge ?? 'YOUNG', zone: selectedZone });
  }

  // Map legend: two centred rows
  const legendRows = [
    [
      { label: tr.legendCollar, col: [239, 68, 68] },
      { label: tr.legendBulb, col: [245, 158, 11] },
      { label: tr.legendMid, col: [2, 132, 199] },
    ],
    [
      { label: tr.legendDrip, col: [16, 185, 129] },
      { label: tr.pdfLegendHarvestCorridor, col: [148, 163, 184] },
    ],
  ];

  const itemGap = 9;
  const dotGap = 4;
  const circleOffset = 1.3;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);

  let curLegendY = mapContainerY + mapSize + 7.5;
  legendRows.forEach(row => {
    const rowW = row.reduce((sum, item) => sum + dotGap + doc.getTextWidth(item.label), 0) + (row.length - 1) * itemGap;
    let itemX = marginX + Math.max(4, (contentWidth - rowW) / 2);

    row.forEach(item => {
      doc.setFillColor(item.col[0], item.col[1], item.col[2]);
      doc.circle(itemX + circleOffset, curLegendY - 0.7, 1.2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text(item.label, itemX + dotGap, curLegendY);
      itemX += dotGap + doc.getTextWidth(item.label) + itemGap;
    });

    curLegendY += 5.5;
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  const mapFootnote = tr.pdfMapFootnote.replace('{count}', String(selectedPlants.length));
  const footnoteLines = doc.splitTextToSize(mapFootnote, contentWidth - 10);
  footnoteLines.forEach((fnLine: string, idx: number) => {
    doc.text(fnLine, marginX + contentWidth / 2, curLegendY + 2.5 + idx * 3.5, { align: 'center' });
  });

  // Page 2: zonation guide and plant inventory
  doc.addPage();
  currentY = 14;

  doc.setFillColor(245, 247, 245);
  doc.rect(marginX, currentY - 3, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(20, 83, 45);
  const p2HeaderTitle = `${getLoc(starTree.commonName, language)} (${starTree.botanicalName}) • ${tr.pdfTitle}`;
  const p2HeaderLines = doc.splitTextToSize(p2HeaderTitle, contentWidth - 6);
  doc.text(p2HeaderLines[0] || '', marginX + 3, currentY + 2);
  currentY += 10;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, currentY, contentWidth, 48, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`4. ${tr.pdfSpatialGuide}`, marginX + 4, currentY + 6.5);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  const zones = [
    { name: tr.pdfCollarRule, tag: '0.0 - 0.3 m', col: [220, 38, 38] },
    { name: tr.pdfBulbRule, tag: '0.3 - 1.0 m', col: [217, 119, 6] },
    { name: tr.pdfMidRule, tag: `${formatNumber(1, 1, language)} - ${formatNumber(starTree.matureRadiusM - 0.7, 1, language)} m`, col: [2, 132, 199] },
    { name: tr.pdfDripRule, tag: `${formatNumber(starTree.matureRadiusM - 0.7, 1, language)} - ${formatNumber(starTree.matureRadiusM + 1.0, 1, language)} m`, col: [16, 185, 129] },
    { name: tr.pdfLadderRule, tag: '215° - 245° (SW)', col: [100, 116, 139] },
  ];

  let zoneY = currentY + 12;
  zones.forEach(z => {
    doc.setFillColor(z.col[0], z.col[1], z.col[2]);
    doc.circle(marginX + 6, zoneY - 0.8, 1.2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.text(z.tag, marginX + 10, zoneY);

    doc.setFont('helvetica', 'normal');
    const zLines = doc.splitTextToSize(z.name, contentWidth - 42);
    doc.text(zLines[0] || '', marginX + 38, zoneY);

    zoneY += 7.2;
  });

  currentY += 54;

  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 83, 45);
  doc.text(`5. ${tr.pdfPlantInventory} (${selectedPlants.length} ${tr.pdfAlliesUnit})`, marginX, currentY + 2);
  currentY += 6;

  if (placedPlants.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      tr.pdfNoCompanions,
      marginX,
      currentY + 5
    );
    currentY += 12;
  } else {
    placedPlants.forEach((placed, index) => {
      checkPageBreak(47);

      const plant = placed.plant;
      const isAltRow = index % 2 === 1;
      const cardH = 43;

      doc.setFillColor(isAltRow ? 250 : 255, isAltRow ? 250 : 255, isAltRow ? 250 : 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(marginX, currentY, contentWidth, cardH, 1.5, 1.5, 'FD');

      doc.setFillColor(22, 101, 52);
      doc.roundedRect(marginX, currentY, 2.5, cardH, 1, 0, 'F');

      // Left: photo, or a colour tile with initials if there is none
      const photoSize = 25;
      const photoX = marginX + 4.5;
      const photoY = currentY + 4;
      const plantImgData = plantImages?.get(plant.id);

      let photoDrawn = false;
      if (plantImgData) {
        try {
          doc.addImage(plantImgData, 'JPEG', photoX, photoY, photoSize, photoSize);
          doc.setDrawColor(203, 213, 225);
          doc.setLineWidth(0.3);
          doc.rect(photoX, photoY, photoSize, photoSize, 'S');
          photoDrawn = true;
        } catch (e) {
          console.warn('Failed to embed plant image:', plant.id, e);
        }
      }
      if (!photoDrawn) {
        doc.setFillColor(plant.color || '#166534');
        doc.roundedRect(photoX, photoY, photoSize, photoSize, 1.5, 1.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        const initials = getLoc(plant.commonName, language).substring(0, 2).toUpperCase();
        doc.text(initials, photoX + photoSize / 2, photoY + photoSize / 2 + 3, { align: 'center' });
      }

      doc.setFontSize(5.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      const layerSnippet = getLayerLabel(plant.layer);
      doc.text(layerSnippet, photoX + photoSize / 2, photoY + photoSize + 4.5, { align: 'center' });

      // Right: position radar
      const miniMapSize = 26;
      const miniMapX = marginX + contentWidth - miniMapSize - 3.5;
      const miniMapY = currentY + 3.5;
      drawMiniPlantingMap(doc, placed, starTree, hemisphere, language, miniMapX, miniMapY, miniMapSize);

      // Centre: one line each, clipped to the column so nothing runs into the radar
      const infoX = photoX + photoSize + 4;
      const maxInfoW = miniMapX - infoX - 4;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      const plantTitle = `#${index + 1}. ${getLoc(plant.commonName, language)} (${plant.botanicalName})`;
      const titleLines = doc.splitTextToSize(plantTitle, maxInfoW);
      doc.text(titleLines[0] || '', infoX, currentY + 5.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(180, 83, 9);
      const posLabel = tr.pdfPlacementLabel;
      const posText = `${posLabel} ${getShortZoneLabel(placed.zone)} • ${formatNumber(placed.distanceM, 2, language)} m • ${placed.angleDeg}° ${getShortSectorLabel(placed.sector)}`;
      const posLines = doc.splitTextToSize(posText, maxInfoW);
      doc.text(posLines[0] || '', infoX, currentY + 11.2);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      const specLabel = tr.pdfDimensionsRolesLabel;
      const rolesFormatted = plant.roles
        .map(r => {
          const roleObj = ALL_ROLES.find(ar => ar.role === r);
          return roleObj ? getLoc(roleObj.displayName, language) : r;
        })
        .join(', ');
      const specsText = `${specLabel} H: ${formatNumber(plant.heightM, 1, language)}m, ${tr.pdfWidthAbbr}: ${formatNumber(plant.spreadM, 1, language)}m • ${rolesFormatted}`;
      const specsLines = doc.splitTextToSize(specsText, maxInfoW);
      doc.text(specsLines[0] || '', infoX, currentY + 16.8);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      const phenoLabel = tr.pdfPhenologyLabel;
      const flowerSeasons = plant.seasonalActivity.floweringSeasons.map(s => translateSeason(s, language)).join(', ');
      const chopSeasons = plant.seasonalActivity.chopAndDropSeasons.map(s => translateSeason(s, language)).join(', ');

      const phenoParts: string[] = [];
      if (flowerSeasons) phenoParts.push(`${tr.bloom}: ${flowerSeasons}`);
      if (chopSeasons) phenoParts.push(`${tr.pdfChopDropLabel}: ${chopSeasons}`);
      const phenoText = `${phenoLabel} ${phenoParts.join(' • ') || tr.pdfAllSeasonArmor}`;
      const phenoLines = doc.splitTextToSize(phenoText, maxInfoW);
      doc.text(phenoLines[0] || '', infoX, currentY + 22.2);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(22, 101, 52);
      const plantTimingParts: string[] = [];
      if (plant.plantingTime) {
        plantTimingParts.push(`${tr.plantingSeasonTag}: ${getLoc(plant.plantingTime, language)}`);
      }
      if (plant.harvestTime) {
        plantTimingParts.push(`${tr.pdfHarvestBloom}: ${getLoc(plant.harvestTime, language)}`);
      }
      if (plantTimingParts.length > 0) {
        const timingText = plantTimingParts.join(' • ');
        const timingLines = doc.splitTextToSize(timingText, maxInfoW);
        doc.text(timingLines[0] || '', infoX, currentY + 27.2);
      }

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(6.8);
      doc.setTextColor(100, 116, 139);
      const notes = getLoc(plant.notes, language);
      const notesLines = doc.splitTextToSize(notes, maxInfoW);
      doc.text(notesLines[0] || '', infoX, currentY + 32.5);
      if (notesLines[1]) {
        doc.text(notesLines[1], infoX, currentY + 36.8);
      }

      currentY += cardH + 3.5;
    });
  }

  // Role coverage
  checkPageBreak(55);
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(marginX, currentY, contentWidth, 50, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(20, 83, 45);
  doc.text(
    `6. ${tr.pdfEcologicalRoles}: ${coveredCount} / ${ALL_ROLES.length} ${tr.pdfRolesCovered} (${efficiencyPercent}%)`,
    marginX + 4,
    currentY + 6.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);

  let gridY = currentY + 12;
  ALL_ROLES.forEach((roleDef, i) => {
    const matchingCount = selectedPlants.filter(p => p.roles.includes(roleDef.role)).length;
    const isCovered = matchingCount > 0;

    const colIndex = i % 2;
    const xPos = colIndex === 0 ? marginX + 4 : marginX + 94;

    if (isCovered) {
      doc.setFillColor(34, 197, 94);
      doc.circle(xPos + 2, gridY - 0.8, 1.1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(20, 83, 45);
      doc.text(`[+] ${getLoc(roleDef.displayName, language)} (${matchingCount}x)`, xPos + 4.5, gridY);
    } else {
      doc.setFillColor(203, 213, 225);
      doc.circle(xPos + 2, gridY - 0.8, 1.1, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text(`[–] ${getLoc(roleDef.displayName, language)} (${tr.pdfUncovered})`, xPos + 4.5, gridY);
    }

    if (colIndex === 1 || i === ALL_ROLES.length - 1) {
      gridY += 7;
    }
  });

  currentY += 54;

  // Antagonists
  checkPageBreak(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 83, 45);
  doc.text(`7. ${tr.antagonistsSectionTitle}`, marginX, currentY + 2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(tr.antagonistsSectionSub, marginX, currentY + 6.5);
  currentY += 10;

  const antagonistReport = analyzeGuildAntagonisms(starTree, selectedPlants, hemisphere);

  if (antagonistReport.conflicts.length === 0) {
    checkPageBreak(25);
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(marginX, currentY, contentWidth, 22, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(20, 83, 45);
    doc.text(tr.noAntagonistsFound, marginX + 4, currentY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(22, 101, 52);
    doc.text(tr.noAntagonistsFoundSub, marginX + 4, currentY + 14);

    currentY += 26;
  } else {
    // splitTextToSize measures with the current font, so wrap each block in the font it is drawn in.
    const wrap = (text: string, style: 'normal' | 'bold' | 'italic', size: number): string[] => {
      doc.setFont('helvetica', style);
      doc.setFontSize(size);
      return doc.splitTextToSize(text, contentWidth - 8);
    };
    antagonistReport.conflicts.forEach(conflict => {
      const isCrit = conflict.severity === 'CRITICAL';
      const isWarn = conflict.severity === 'WARNING';

      const cardTitleText = `[${isCrit ? tr.antagonistCriticalAlert : isWarn ? tr.antagonistWarningAlert : tr.antagonistInfoAlert}] ${getLoc(conflict.title, language)}`;
      const titleLines = wrap(cardTitleText, 'bold', 8.5);

      const antagHeader = `Antagonist: ${getLoc(conflict.antagonistName, language)} (${conflict.antagonistBotanical}) • ${tr.antagonistBufferLabel}: ≥ ${conflict.safeDistanceM} m (${conflict.type === 'INTERNAL_PROXIMITY' ? tr.antagonistInternalTag : tr.antagonistExternalTag})`;
      const antagHeaderLines = wrap(antagHeader, 'bold', 7.5);

      const affectedNames = conflict.affectedPlants
        .map(p => `${getLoc(p.name, language)} (${formatNumber(p.distanceM, 1, language)}m, ${getLoc(p.cardinalDirection, language)})`)
        .join('; ');
      const affectedLines = wrap(`${tr.antagonistAffectedInGuild}: ${affectedNames}`, 'bold', 7);

      const mechanismLines = wrap(`${tr.antagonistMechanism}: ${getLoc(conflict.mechanism, language)}`, 'normal', 6.8);
      const adviceLines = wrap(`${tr.antagonistSpatialAdvice}: ${getLoc(conflict.spatialAdvice, language)}`, 'bold', 6.8);
      const citationText = conflict.scientificCitations[0] ? `[Lit] ${conflict.scientificCitations[0]}` : '';
      const citationLines = citationText ? wrap(citationText, 'italic', 6.2) : [];

      const totalLinesCount = titleLines.length + antagHeaderLines.length + affectedLines.length + mechanismLines.length + adviceLines.length + citationLines.length;
      const cardH = Math.max(38, 12 + totalLinesCount * 3.6);

      checkPageBreak(cardH + 4);

      if (isCrit) {
        doc.setFillColor(255, 241, 242);
        doc.setDrawColor(254, 205, 211);
      } else if (isWarn) {
        doc.setFillColor(254, 252, 232);
        doc.setDrawColor(253, 230, 138);
      } else {
        doc.setFillColor(240, 249, 255);
        doc.setDrawColor(186, 230, 253);
      }
      doc.roundedRect(marginX, currentY, contentWidth, cardH, 2, 2, 'FD');

      doc.setFillColor(isCrit ? 225 : isWarn ? 217 : 2, isCrit ? 29 : isWarn ? 119 : 132, isCrit ? 72 : isWarn ? 6 : 199);
      doc.roundedRect(marginX, currentY, 2.5, cardH, 1, 0, 'F');

      let innerY = currentY + 5.5;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(isCrit ? 159 : isWarn ? 146 : 12, isCrit ? 18 : isWarn ? 64 : 74, isCrit ? 57 : isWarn ? 14 : 110);
      titleLines.forEach((line: string) => {
        doc.text(line, marginX + 5, innerY);
        innerY += 4.0;
      });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      antagHeaderLines.forEach((line: string) => {
        doc.text(line, marginX + 5, innerY);
        innerY += 3.8;
      });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(180, 83, 9);
      affectedLines.forEach((line: string) => {
        doc.text(line, marginX + 5, innerY);
        innerY += 3.5;
      });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(51, 65, 85);
      mechanismLines.forEach((line: string) => {
        doc.text(line, marginX + 5, innerY);
        innerY += 3.4;
      });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(20, 83, 45);
      adviceLines.forEach((line: string) => {
        doc.text(line, marginX + 5, innerY);
        innerY += 3.4;
      });

      if (citationLines.length > 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(6.2);
        doc.setTextColor(100, 116, 139);
        citationLines.forEach((line: string) => {
          doc.text(line, marginX + 5, innerY);
          innerY += 3.2;
        });
      }

      currentY += cardH + 4;
    });
  }

  // Footer on every page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const footerLineY = pageHeight - 13;
    doc.setDrawColor(231, 229, 228); // stone-200
    doc.setLineWidth(0.3);
    doc.line(marginX, footerLineY, marginX + contentWidth, footerLineY);

    drawBrandLogoIcon(doc, marginX, footerLineY + 2, 5.5);

    const fBrandX = marginX + 7.2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(28, 25, 23); // stone-900
    doc.text('Pflanzengilde', fBrandX, footerLineY + 5.2);
    const fPgWidth = doc.getTextWidth('Pflanzengilde');
    doc.setTextColor(22, 163, 74); // forest-600
    doc.text('.de', fBrandX + fPgWidth, footerLineY + 5.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(120, 113, 108); // stone-500
    doc.text(tr.footerText, fBrandX, footerLineY + 8.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(87, 83, 78); // stone-600
    doc.text(
      `${tr.page} ${i} / ${totalPages}`,
      marginX + contentWidth,
      footerLineY + 6.2,
      { align: 'right' }
    );
  }

  return doc;
}

export async function exportGuildPlanPdf(options: GeneratePdfOptions): Promise<void> {
  let mapDataUrl = options.radialMapDataUrl;
  let treeImageDataUrl = options.treeImageDataUrl;
  let plantImages = options.plantImages;

  if (typeof document !== 'undefined') {
    if (!mapDataUrl) {
      mapDataUrl = await captureRadialMapSvg('radial-garden-map-svg');
    }
    if (!plantImages) {
      const preloadResult = await preloadGuildImages(
        treeImageDataUrl ? undefined : options.starTree.imageUrl,
        options.selectedPlants.map(p => ({ id: p.id, url: p.imageUrl }))
      );
      treeImageDataUrl = treeImageDataUrl || preloadResult.treeImage;
      plantImages = preloadResult.plantImages;
    }
  }

  const doc = generateGuildPdf({
    ...options,
    radialMapDataUrl: mapDataUrl,
    treeImageDataUrl,
    plantImages
  });

  const treeName = getLoc(options.starTree.commonName, options.language)
    .toLowerCase()
    .replace(/[^a-z0-9äöüß]+/gi, '_');
  const filename = `${treeName}_guild_plan_${options.language}.pdf`;
  doc.save(filename);
}
