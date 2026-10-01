import { getLoc } from '../types/guild';
import { GardenState } from '../types/garden';
import { t } from '../i18n/translations';
import { CHOP_INSTRUCTIONS_MAP, CHOP_PLANT_ANCHORS, IcsEvent, foldIcsLine, escapeIcsText } from './calendarExporter';

export interface GardenCalendarExportOptions {
  garden: GardenState;
  baseUrl?: string;
  /**
   * Stable id of this garden (e.g. persisted with the garden). Goes into every event UID so two
   * gardens imported into one calendar don't overwrite each other, while re-importing the same
   * garden updates its events. Falls back to a hash of the garden's name and tree instances.
   */
  gardenKey?: string;
}

/** FNV-1a, 32 bit, as 8 hex chars. */
export function hashString(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function gardenUidKey(garden: GardenState, gardenKey?: string): string {
  const explicit = (gardenKey || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  if (explicit) return explicit;
  const instanceIds = garden.starPlants.map(sp => sp.instanceId).sort();
  return hashString(`${garden.name}|${instanceIds.join(',')}`);
}

export function buildGardenIcsContent(options: GardenCalendarExportOptions): string {
  const { garden } = options;
  const { language, hemisphere, starPlants, placedCompanions } = garden;
  const tr = t(language);
  const origin = options.baseUrl || 'https://pflanzengilde.de';
  // No dates in UIDs: the year rolls over, the garden doesn't
  const uidPrefix = `garden-${gardenUidKey(garden, options.gardenKey)}`;

  const events: IcsEvent[] = [];
  const targetYear = new Date().getFullYear();

  const uniqueTreeSpecies = new Map<string, typeof starPlants[0]['starTree']>();
  for (const sp of starPlants) {
    if (!uniqueTreeSpecies.has(sp.treeId)) {
      uniqueTreeSpecies.set(sp.treeId, sp.starTree);
    }
  }

  for (const tree of uniqueTreeSpecies.values()) {
    const treeName = getLoc(tree.commonName, language);
    const treeCount = starPlants.filter(sp => sp.treeId === tree.id).length;

    const isAutumnPlanting = ['FRUIT_TREE', 'NUT_TREE', 'NITROGEN_FIXING_TREE', 'BERRY_SHRUB'].includes(tree.category);
    const plantMonth = isAutumnPlanting
      ? (hemisphere === 'NORTHERN' ? 10 : 4)
      : (hemisphere === 'NORTHERN' ? 4 : 10);
    const plantDay = 15;
    const startStr = `${targetYear}${String(plantMonth).padStart(2, '0')}${String(plantDay).padStart(2, '0')}`;
    const endStr = `${targetYear}${String(plantMonth).padStart(2, '0')}${String(plantDay + 1).padStart(2, '0')}`;

    const plantingTitle = tr.calendarGardenTreePlantingTitle
      .replace('{tree}', treeName)
      .replace('{count}', String(treeCount));

    const exposure = tree.sunPreference === 'FULL_SUN' ? tr.calendarGardenExposureFullSun : tr.calendarGardenExposureOther;
    const plantingDesc = tr.calendarGardenTreePlantingDesc
      .replace('{tree}', treeName)
      .replace('{botanical}', tree.botanicalName)
      .replace('{exposure}', exposure)
      .replace('{radius}', String(tree.matureRadiusM))
      .replace('{origin}', origin);

    const htmlDesc = `<!DOCTYPE html><html><body><h2>${plantingTitle}</h2><p>${tree.description[language]}</p><p><a href="${origin}/garten">Pflanzengilde.de Garten-Planer</a></p></body></html>`;

    events.push({
      uid: `${uidPrefix}-tree-${tree.id}-planting@pflanzengilde.de`,
      startDate: startStr,
      endDate: endStr,
      summary: plantingTitle,
      description: plantingDesc,
      htmlDescription: htmlDesc,
      categories: ['PFLANZEN', 'LEITPFLANZE', 'PERMAKULTUR'],
      isRecurring: false
    });
  }

  const uniqueCompanions = new Map<string, typeof placedCompanions[0]['plant']>();
  for (const c of placedCompanions) {
    if (!uniqueCompanions.has(c.plantId)) {
      uniqueCompanions.set(c.plantId, c.plant);
    }
  }

  for (const plant of uniqueCompanions.values()) {
    const plantName = getLoc(plant.commonName, language);
    const count = placedCompanions.filter(c => c.plantId === plant.id).length;
    const isPerennial = plant.perennial;

    const sowMonth = hemisphere === 'NORTHERN' ? 4 : 10;
    const sowDay = 20;
    const startStr = `${targetYear}${String(sowMonth).padStart(2, '0')}${String(sowDay).padStart(2, '0')}`;
    const endStr = `${targetYear}${String(sowMonth).padStart(2, '0')}${String(sowDay + 1).padStart(2, '0')}`;

    const sowTitle = `🌿 ${isPerennial ? tr.calendarPlanting : tr.calendarGardenSowing}: ${plantName} (${count}x)`;

    const sowDesc = tr.calendarGardenSowDesc
      .replace('{plant}', plantName)
      .replace('{botanical}', plant.botanicalName)
      .replace('{roles}', plant.roles.join(', '))
      .replace('{origin}', origin);

    events.push({
      uid: `${uidPrefix}-comp-${plant.id}-sow@pflanzengilde.de`,
      startDate: startStr,
      endDate: endStr,
      summary: sowTitle,
      description: sowDesc,
      categories: ['BEGLEITPFLANZE', isPerennial ? 'MEHRJAEHRIG' : 'EINJAEHRIG'],
      isRecurring: !isPerennial
    });

    const chopInfo = CHOP_INSTRUCTIONS_MAP[plant.id];
    if (chopInfo && plant.seasonalActivity.chopAndDropSeasons.length > 0) {
      const northern = hemisphere === 'NORTHERN';
      const chopMonths = [...new Set(plant.seasonalActivity.chopAndDropSeasons.map(s => {
        switch (s) {
          case 'WINTER': return northern ? 2 : 8;
          case 'EARLY_SPRING': return northern ? 3 : 9;
          case 'LATE_SPRING': return northern ? 5 : 11;
          case 'SUMMER': return northern ? 7 : 1;
          case 'AUTUMN': return northern ? 9 : 3;
          default: return northern ? 6 : 12;
        }
      }))];

      chopMonths.forEach((m, idx) => {
        const cStart = `${targetYear}${String(m).padStart(2, '0')}15`;
        const cEnd = `${targetYear}${String(m).padStart(2, '0')}16`;

        const chopTitle = tr.calendarGardenChopTitle
          .replace('{plant}', plantName)
          .replace('{index}', String(idx + 1))
          .replace('{total}', String(chopMonths.length));

        const guideAnchor = CHOP_PLANT_ANCHORS[plant.id] ? `${origin}/guides#${CHOP_PLANT_ANCHORS[plant.id]}` : `${origin}/guides`;

        const chopDesc = tr.calendarGardenChopDesc
          .replace('{howToCut}', chopInfo.howToCut[language])
          .replace('{howMuch}', chopInfo.howMuch[language])
          .replace('{where}', chopInfo.whereToSpread[language])
          .replace('{benefit}', chopInfo.nutrientBenefit[language])
          .replace('{guide}', guideAnchor);

        events.push({
          uid: `${uidPrefix}-chop-${plant.id}-m${String(m).padStart(2, '0')}@pflanzengilde.de`,
          startDate: cStart,
          endDate: cEnd,
          summary: chopTitle,
          description: chopDesc,
          categories: ['CHOP_DROP', 'MULCH', 'PFLEGE'],
          isRecurring: true
        });
      });
    }
  }

  events.sort((a, b) => a.startDate.localeCompare(b.startDate));

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Pflanzengilde//Permakultur-Garten-Planer//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    foldIcsLine(`X-WR-CALNAME:${escapeIcsText(`${garden.name || tr.calendarGardenDefaultName} • Pflanzengilde.de`)}`),
    'X-WR-TIMEZONE:Europe/Berlin',
  ];

  for (const ev of events) {
    lines.push('BEGIN:VEVENT');
    lines.push(foldIcsLine(`UID:${ev.uid}`));
    lines.push(`DTSTAMP:${targetYear}0101T000000Z`);
    lines.push(`DTSTART;VALUE=DATE:${ev.startDate}`);
    lines.push(`DTEND;VALUE=DATE:${ev.endDate}`);
    lines.push(foldIcsLine(`SUMMARY:${escapeIcsText(ev.summary)}`));
    lines.push(foldIcsLine(`DESCRIPTION:${escapeIcsText(ev.description)}`));
    if (ev.htmlDescription) {
      lines.push(foldIcsLine(`X-ALT-DESC;FMTTYPE=text/html:${escapeIcsText(ev.htmlDescription)}`));
    }
    if (ev.isRecurring) {
      lines.push('RRULE:FREQ=YEARLY');
    }
    lines.push(`CATEGORIES:${ev.categories.join(',')}`);
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function exportGardenCalendarIcs(options: GardenCalendarExportOptions): void {
  const content = buildGardenIcsContent(options);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = `${(options.garden.name || 'permakultur_garten').toLowerCase().replace(/[^a-z0-9äöüß]+/gi, '_')}_kalender.ics`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
