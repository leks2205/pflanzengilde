import { GardenCompanionInstance, GardenInfrastructure, GardenSiteWarning, GardenStarPlantInstance } from '../types/garden';
import { LocalizedString } from '../types/guild';
import { BED_WARNINGS, getBedSuitability } from '../data/raisedBedSuitability';
import { pointInShape } from './geometry2d';
import { compartmentAt } from './compartments';
import { formatNumber } from '../i18n/translations';

const L = (de: string, en: string): LocalizedString => ({ de, en });

export function bedLabel(index: number): LocalizedString {
  return L(`Hochbeet ${index + 1}`, `Raised bed ${index + 1}`);
}

/**
 * Site checks for the garden outline and raised beds: plants outside the outline, and plants in a
 * raised bed that are unsuitable or conditional for beds (raisedBedSuitability.ts), including a
 * bed that is lower than the plant needs.
 */
export function analyzeGardenSite(
  starPlants: GardenStarPlantInstance[],
  companions: GardenCompanionInstance[],
  infra: GardenInfrastructure
): GardenSiteWarning[] {
  const out: GardenSiteWarning[] = [];
  const outline = infra.outline;
  if (outline) {
    for (const s of starPlants) {
      if (!pointInShape(s.xM, s.yM, outline)) {
        out.push({
          id: `outside-${s.instanceId}`, kind: 'OUTSIDE_OUTLINE', severity: 'WARNING', instanceId: s.instanceId, plantId: s.treeId,
          title: L(`${s.starTree.commonName.de} steht außerhalb des Gartens`, `${s.starTree.commonName.en} is outside the garden`),
          description: L('Der Stamm liegt außerhalb des gezeichneten Gartenumrisses. Pflanze verschieben oder den Umriss anpassen.', 'The trunk lies outside the drawn garden outline. Move the plant or adjust the outline.'),
        });
      }
    }
    const seen = new Set<string>();
    for (const c of companions) {
      if (pointInShape(c.xM, c.yM, outline) || seen.has(c.plantId)) continue;
      seen.add(c.plantId);
      out.push({
        id: `outside-${c.instanceId}`, kind: 'OUTSIDE_OUTLINE', severity: 'INFO', instanceId: c.instanceId, plantId: c.plantId,
        title: L(`${c.plant.commonName.de} liegt außerhalb des Gartens`, `${c.plant.commonName.en} lies outside the garden`),
        description: L('Diese Begleitpflanze wurde außerhalb des Gartenumrisses platziert; die Gilde braucht dort mehr Platz.', 'This companion was placed outside the garden outline; the guild needs more room there.'),
      });
    }
  }
  const beds = infra.raisedBeds;
  if (beds.length === 0) return out;
  const bedIndex = new Map(beds.map((b, i) => [b.id, i]));
  const items = [
    ...starPlants.map(s => ({ key: s.instanceId, id: s.treeId, name: s.starTree.commonName, xM: s.xM, yM: s.yM })),
    ...companions.map(c => ({ key: c.instanceId, id: c.plantId, name: c.plant.commonName, xM: c.xM, yM: c.yM })),
  ];
  const done = new Set<string>();
  for (const it of items) {
    const comp = compartmentAt(it.xM, it.yM, beds);
    if (comp === 'OPEN') continue;
    const k = `${comp}|${it.id}`;
    if (done.has(k)) continue;
    done.add(k);
    const suit = getBedSuitability(it.id);
    if (!suit) continue;
    const bed = beds[bedIndex.get(comp)!];
    const label = bed.name ? L(bed.name, bed.name) : bedLabel(bedIndex.get(comp)!);
    const texts = suit.warnings.map(w => BED_WARNINGS[w]);
    const sources = [...new Set(texts.flatMap(t => t.sources))];
    if (suit.rating !== 'S' && texts.length > 0) {
      const kind = suit.rating === 'U' ? 'BED_UNSUITABLE' : suit.rating === 'C_REC' ? 'BED_RECOMMENDED' : 'BED_CONDITIONAL';
      out.push({
        id: `bed-${comp}-${it.id}`, kind, severity: suit.rating === 'U' ? 'WARNING' : 'INFO', instanceId: it.key, plantId: it.id, bedId: comp,
        title: L(`${it.name.de} in ${label.de}: ${texts[0].title.de}`, `${it.name.en} in ${label.en}: ${texts[0].title.en}`),
        description: L(texts.map(t => t.text.de).join(' '), texts.map(t => t.text.en).join(' ')),
        sources, guideHash: `bed-${suit.warnings[0].toLowerCase()}`,
      });
    }
    const need = Math.max(0, ...texts.map(t => t.minBedHeightM ?? 0));
    if (need > 0 && bed.heightM + 1e-9 < need) {
      out.push({
        id: `bedlow-${comp}-${it.id}`, kind: 'BED_TOO_LOW', severity: 'WARNING', instanceId: it.key, plantId: it.id, bedId: comp,
        title: L(`${label.de} ist zu niedrig für ${it.name.de}`, `${label.en} is too low for ${it.name.en}`),
        description: L(
          `Das Beet ist ${formatNumber(bed.heightM * 100, 0, 'de')} cm hoch; ${it.name.de} braucht mindestens ${formatNumber(need * 100, 0, 'de')} cm Erde.`,
          `The bed is ${formatNumber(bed.heightM * 100, 0, 'en')} cm high; ${it.name.en} needs at least ${formatNumber(need * 100, 0, 'en')} cm of soil.`
        ),
        sources, guideHash: 'bed-dimensions',
      });
    }
  }
  return out;
}
