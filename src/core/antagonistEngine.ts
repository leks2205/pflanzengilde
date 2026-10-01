import {
  GuildPlant,
  Hemisphere,
  LocalizedString,
  PlacedPlant,
  PlantingZone,
  StarTree,
  getLoc
} from '../types/guild';
import {
  autoPlaceGuildPlants,
  calculatePolarDistanceM,
  isAlliumPlant,
  isLegumePlant,
  isFennelPlant,
  isWormwoodPlant,
  isStrictAcidophilePlant,
  isStrictCalcicolePlant,
  isJugloneSensitiveStar,
  isAcidIntolerantStar,
  STRICT_ACIDOPHILE_STAR_IDS,
  JUGLONE_ROOT_ZONE_M
} from './placementRules';
import { PEST_HOST_CONFLICTS } from './pestHostConflicts';
import { formatNumber } from '../i18n/translations';

/* Shared, verified citations; also attached to the matching garden-level conflicts (gardenAntagonist.ts). */
/** Juglone mechanism (internal walnut conflict). */
export const JUGLONE_MECHANISM_CITATIONS: readonly string[] = [
  'Dana, M. N., & Lerner, B. R. (rev. 1994). Black Walnut Toxicity. Purdue University Cooperative Extension Service, HO-193. https://www.extension.purdue.edu/extmedia/HO/HO-193.pdf',
  'Hejl, A. M., Einhellig, F. A., & Rasmussen, J. A. (1993). Effects of juglone on growth, photosynthesis, and respiration. Journal of Chemical Ecology, 19(3), 559–568. doi:10.1007/BF00994325',
  'Hejl, A. M., & Koster, K. L. (2004). Juglone disrupts root plasma membrane H+-ATPase activity and impairs water uptake, root respiration, and growth in soybean (Glycine max) and corn (Zea mays). Journal of Chemical Ecology, 30(2), 453–471. doi:10.1023/B:JOEC.0000017988.20530.d5'
];
/** Juglone root-zone distance (external walnut alert). */
export const JUGLONE_DISTANCE_CITATIONS: readonly string[] = [
  'Funt, R. C., & Martin, J. (1993). Black Walnut Toxicity to Plants, Humans and Horses. Ohio State University Extension Fact Sheet HYG-1148-93.',
  'Dana, M. N., & Lerner, B. R. (rev. 1994). Black Walnut Toxicity. Purdue University Cooperative Extension Service, HO-193. https://www.extension.purdue.edu/extmedia/HO/HO-193.pdf',
  'Hejl, A. M., & Koster, K. L. (2004). Juglone disrupts root plasma membrane H+-ATPase activity and impairs water uptake, root respiration, and growth in soybean (Glycine max) and corn (Zea mays). Journal of Chemical Ecology, 30(2), 453–471. doi:10.1023/B:JOEC.0000017988.20530.d5'
];
/** Allium extract vs. legume nodulation (precautionary spacing). */
export const ALLIUM_LEGUME_CITATIONS: readonly string[] = [
  'Adeleke, M. T. V. (2016). Effect of Allium sativum (garlic) extract on the growth and nodulation of cowpea (Vigna unguiculata) and groundnut (Arachis hypogea). African Journal of Agricultural Research, 11(43), 4304–4312. doi:10.5897/AJAR2016.11208'
];
/** Fennel extract/oil allelopathy (lab). */
export const FENNEL_ALLELOPATHY_CITATIONS: readonly string[] = [
  'Nourimand, M., Mohsenzadeh, S., Teixeira da Silva, J. A., & Saharkhiz, M. J. (2011). Allelopathic potential of fennel (Foeniculum vulgare Mill.). Medicinal and Aromatic Plant Science and Biotechnology, 5(1), 54–57. http://globalsciencebooks.info/Online/GSBOnline/images/2011/MAPSB_5(1)/MAPSB_5(1)54-57o.pdf',
  'Gharibvandi, A., Karimmojeni, H., Ehsanzadeh, P., Rahimmalek, M., & Mastinu, A. (2022). Weed management by allelopathic activity of Foeniculum vulgare essential oil. Plant Biosystems, 156(6), 1298–1306. doi:10.1080/11263504.2022.2036848'
];
/** Wormwood (absinthin) allelopathy field trials. */
export const WORMWOOD_ALLELOPATHY_CITATIONS: readonly string[] = [
  'Bode, H. R. (1940). Über die Blattausscheidungen des Wermuts und ihre Wirkung auf andere Pflanzen. Planta, 30(4), 567–589. doi:10.1007/BF01917042',
  'Funke, G. L. (1943). The influence of Artemisia absinthium on neighbouring plants. Blumea, 5(2), 281–293. https://repository.naturalis.nl/pub/526079'
];
/** Acidophile vs. calcicole root-zone pH needs. */
export const EDAPHIC_PH_CITATIONS: readonly string[] = [
  'White, P. J., & Broadley, M. R. (2003). Calcium in plants. Annals of Botany, 92(4), 487–511. doi:10.1093/aob/mcg164',
  'Hajiboland, R. (2017). Environmental and nutritional requirements for tea cultivation. Folia Horticulturae, 29(2), 199–220. doi:10.1515/fhort-2017-0019',
  'Munns, D. N. (1965). Soil acidity and growth of a legume. I. Interactions of lime with nitrogen and phosphate on growth of Medicago sativa L. and Trifolium subterraneum L. Australian Journal of Agricultural Research, 16(5), 733–741. doi:10.1071/AR9650733',
  'Munns, D. N. (1965). Soil acidity and growth of a legume. III. Interaction of lime and phosphate on growth of Medicago sativa L. in relation to aluminium toxicity and phosphate fixation. Australian Journal of Agricultural Research, 16(5), 757–766. doi:10.1071/AR9650757'
];
/** Fennel root-exudate terpenes (only cited where the mechanism text mentions them). */
export const FENNEL_RHIZOSPHERE_TERPENES_CITATION = 'Yang, Y., et al. (2022). Antimicrobial terpenes suppressed the infection process of Phytophthora in fennel-pepper intercropping system. Frontiers in Plant Science, 13, 890534. doi:10.3389/fpls.2022.890534';

export type AntagonistSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
export type AntagonistType = 'INTERNAL_PROXIMITY' | 'EXTERNAL_ALERT' | 'RESOLVED_HARMONY';

export interface AffectedPlantLocation {
  id: string;
  name: LocalizedString;
  botanicalName: string;
  distanceM: number;
  angleDeg: number;
  cardinalDirection: LocalizedString;
  zone: PlantingZone | 'CENTER';
  roleOrFamily?: string;
}

export interface AntagonistConflict {
  id: string;
  type: AntagonistType;
  severity: AntagonistSeverity;
  antagonistName: LocalizedString;
  antagonistBotanical: string;
  title: LocalizedString;
  mechanism: LocalizedString;
  scientificCitations: string[];
  spatialAdvice: LocalizedString;
  safeDistanceM: number;
  affectedPlants: AffectedPlantLocation[];
}

export interface AntagonistReport {
  hasCritical: boolean;
  hasWarning: boolean;
  totalConflicts: number;
  conflicts: AntagonistConflict[];
  resolvedHarmonies?: AntagonistConflict[];
}

/** Angle in degrees (0° = North, clockwise) to a localized 8-point compass label. */
export function getCardinalDirection(angleDeg: number): LocalizedString {
  const norm = ((angleDeg % 360) + 360) % 360;
  if (norm >= 337.5 || norm < 22.5) {
    return { de: 'Norden (N, 0°)', en: 'North (N, 0°)' };
  } else if (norm >= 22.5 && norm < 67.5) {
    return { de: 'Nordost (NO, 45°)', en: 'North-East (NE, 45°)' };
  } else if (norm >= 67.5 && norm < 112.5) {
    return { de: 'Osten (O, 90°)', en: 'East (E, 90°)' };
  } else if (norm >= 112.5 && norm < 157.5) {
    return { de: 'Südost (SO, 135°)', en: 'South-East (SE, 135°)' };
  } else if (norm >= 157.5 && norm < 202.5) {
    return { de: 'Süden (S, 180°)', en: 'South (S, 180°)' };
  } else if (norm >= 202.5 && norm < 247.5) {
    return { de: 'Südwest (SW, 225°)', en: 'South-West (SW, 225°)' };
  } else if (norm >= 247.5 && norm < 292.5) {
    return { de: 'Westen (W, 270°)', en: 'West (W, 270°)' };
  } else {
    return { de: 'Nordwest (NW, 315°)', en: 'North-West (NW, 315°)' };
  }
}

function starAt(
  starTree: StarTree,
  roleOrFamily: string,
  cardinalDirection: LocalizedString = { de: 'Zentrum (0,0 m)', en: 'Center (0.0 m)' }
): AffectedPlantLocation {
  return {
    id: starTree.id,
    name: starTree.commonName,
    botanicalName: starTree.botanicalName,
    distanceM: 0,
    angleDeg: 0,
    cardinalDirection,
    zone: 'CENTER',
    roleOrFamily
  };
}

function placedAt(p: PlacedPlant, roleOrFamily: string): AffectedPlantLocation {
  return {
    id: p.plant.id,
    name: p.plant.commonName,
    botanicalName: p.plant.botanicalName,
    distanceM: p.distanceM,
    angleDeg: p.angleDeg,
    cardinalDirection: getCardinalDirection(p.angleDeg),
    zone: p.zone,
    roleOrFamily
  };
}

const distBetween = (a: PlacedPlant, b: PlacedPlant): number =>
  calculatePolarDistanceM(a.distanceM, a.angleDeg, b.distanceM, b.angleDeg);

/**
 * Allelopathic and phytopathological antagonisms of a guild: proximity conflicts inside the
 * guild layout plus siting alerts for antagonists outside it. The third argument may be a
 * pre-placed layout instead of a hemisphere.
 */
export function analyzeGuildAntagonisms(
  starTree: StarTree,
  selectedPlants: GuildPlant[],
  hemisphereOrPlaced: Hemisphere | PlacedPlant[] = 'NORTHERN',
  customPlacedPlants?: PlacedPlant[]
): AntagonistReport {
  const conflicts: AntagonistConflict[] = [];
  const resolvedHarmonies: AntagonistConflict[] = [];
  const hemisphere: Hemisphere = Array.isArray(hemisphereOrPlaced) ? 'NORTHERN' : hemisphereOrPlaced;
  const placedPlants: PlacedPlant[] = Array.isArray(hemisphereOrPlaced)
    ? hemisphereOrPlaced
    : (customPlacedPlants || autoPlaceGuildPlants(starTree, selectedPlants, hemisphere));

  const placedMap = new Map<string, PlacedPlant>();
  placedPlants.forEach(p => placedMap.set(p.plantId, p));

  // Walnut juglone
  const sensitivePlants: AffectedPlantLocation[] = [];

  // Only stars named on the cited observation lists (see JUGLONE_SENSITIVE_STAR_IDS)
  const treeIsSensitive = isJugloneSensitiveStar(starTree);
  if (treeIsSensitive) {
    sensitivePlants.push(
      starAt(starTree, 'Juglone-Sensitive Star Plant',{ de: 'Zentrum (Stamm, 0,0 m)', en: 'Center (Trunk, 0.0 m)' })
    );
  }

  selectedPlants.forEach(plant => {
    if (plant.jugloneTolerance === 'SENSITIVE') {
      const placed = placedMap.get(plant.id);
      const dist = placed ? placed.distanceM : 2.0;
      const angle = placed ? placed.angleDeg : 0;
      sensitivePlants.push({
        id: plant.id,
        name: plant.commonName,
        botanicalName: plant.botanicalName,
        distanceM: dist,
        angleDeg: angle,
        cardinalDirection: getCardinalDirection(angle),
        zone: placed ? placed.zone : 'ZONE_2_MID',
        roleOrFamily: plant.roles.join(', ')
      });
    }
  });

  // Star is a juglone producer and sensitive companions sit in its root zone
  if (starTree.jugloneProducer) {
    const sensitiveCompanions = sensitivePlants.filter(p => p.id !== starTree.id);
    if (sensitiveCompanions.length > 0) {
      conflicts.push({
        id: 'internal-walnut-sensitive-companions',
        type: 'INTERNAL_PROXIMITY',
        severity: 'CRITICAL',
        antagonistName: { de: `${starTree.commonName.de} (Zentraler Leitbaum)`, en: `${starTree.commonName.en} (Central Star Tree)` },
        antagonistBotanical: starTree.botanicalName,
        title: {
          de: 'Kritischer Juglon-Kontakt: Empfindliche Pflanzen im Walnuss-Wurzelraum',
          en: 'Critical Juglone Exposure: Sensitive Plants in Walnut Rhizosphere'
        },
        mechanism: {
          de: 'Walnussbäume, vor allem die Schwarznuss, enthalten Juglon (5-Hydroxy-1,4-naphthochinon), am meisten in Knospen, Nussschalen und Wurzeln. Juglon hemmt die Atmung: In Versuchen störte es die Funktion von Mitochondrien und Chloroplasten, hemmte die H+-ATPase der Wurzel-Plasmamembran und verringerte Wasseraufnahme, Wurzelatmung und Wachstum. Empfindliche Pflanzen zeigen im Wurzelraum Vergilbung, Welke und können absterben.',
          en: 'Walnut trees, above all black walnut, contain juglone (5-hydroxy-1,4-naphthoquinone), most of it in buds, nut hulls and roots. Juglone inhibits respiration: in experiments it disturbed mitochondrial and chloroplast function, inhibited the root plasma-membrane H+-ATPase and reduced water uptake, root respiration and growth. Sensitive plants in the root zone show yellowing and wilting and may die.'
        },
        scientificCitations: [...JUGLONE_MECHANISM_CITATIONS],
        safeDistanceM: JUGLONE_ROOT_ZONE_M,
        spatialAdvice: {
          de: `Die markierten juglon-empfindlichen Pflanzen stehen höchstens ${formatNumber(Math.max(...sensitiveCompanions.map(p => p.distanceM)), 1, 'de')} m vom Stamm entfernt – die ganze Gilde liegt im Wurzelraum des Walnussbaums, der bei einem ausgewachsenen Baum im Mittel 15–18 m (bis etwa 24 m) weit reicht. Aus der Gilde entfernen und durch Arten ersetzen, die in Beobachtungslisten als juglon-tolerant geführt werden (z. B. Hyazinthe, Waldmeister, Günsel), oder vorsorglich mindestens ${formatNumber(JUGLONE_ROOT_ZONE_M, 0, 'de')} m vom Stamm entfernt pflanzen.`,
          en: `The highlighted juglone-sensitive plants sit at most ${formatNumber(Math.max(...sensitiveCompanions.map(p => p.distanceM)), 1, 'en')} m from the trunk – the whole guild lies inside the walnut root zone, which averages 15–18 m (up to about 24 m) around a mature tree. Remove them from this guild and replace them with species that observation lists rate as juglone-tolerant (e.g. hyacinth, sweet woodruff, bugleweed), or, as a precaution, plant them at least ${formatNumber(JUGLONE_ROOT_ZONE_M, 0, 'en')} m from the trunk.`
        },
        affectedPlants: sensitiveCompanions
      });
    }
  }

  // Guild contains juglone-sensitive plants: siting guidance for any walnut nearby
  if (!starTree.jugloneProducer && sensitivePlants.length > 0) {
    const maxDist = Math.max(...sensitivePlants.map(p => p.distanceM), starTree.matureRadiusM);
    const sectorList = (lang: 'de' | 'en') =>
      Array.from(new Set(sensitivePlants.map(p => p.cardinalDirection[lang].split(' (')[0]))).join(', ');

    conflicts.push({
      id: 'external-walnut-spatial-planning',
      type: 'EXTERNAL_ALERT',
      severity: 'CRITICAL',
      antagonistName: { de: 'Walnussbaum & Schwarznuss (Juglans-Arten)', en: 'Black & Persian Walnut (Juglans species)' },
      antagonistBotanical: 'Juglans regia, Juglans nigra, Carya spp.',
      title: {
        de: 'Externer Antagonist: Walnuss-Sicherheitsabstand & Pflanzplanung',
        en: 'External Antagonist: Walnut Buffer Distance & Landscape Siting'
      },
      mechanism: {
        de: 'Walnussbäume enthalten Juglon (5-Hydroxy-1,4-naphthochinon), am meisten in Knospen, Nussschalen und Wurzeln. Juglon hemmt in Versuchen die Wurzelatmung und die H+-ATPase der Wurzel-Plasmamembran. Laut US-Beratungsblättern reicht die Giftzone einer ausgewachsenen Schwarznuss im Mittel 15–18 m (50–60 ft) vom Stamm, bis etwa 24 m (80 ft), und wächst mit dem Baum. Apfel, Heidelbeere, Rhododendron, Rhabarber, Schwarzerle und Linde werden dort als empfindlich geführt; Kirsche, Pflaume und Pfirsich wurden dagegen nahe Schwarznüssen wachsend beobachtet, und für die Birne widersprechen sich die Listen. Persische Walnuss (Juglans regia) auf eigener Unterlage scheint kaum toxisch zu wirken.',
        en: 'Walnut trees contain juglone (5-hydroxy-1,4-naphthoquinone), most of it in buds, nut hulls and roots. In experiments juglone inhibits root respiration and the root plasma-membrane H+-ATPase. According to US extension fact sheets, the toxic zone of a mature black walnut averages 15–18 m (50–60 ft) from the trunk, up to about 24 m (80 ft), and grows with the tree. Apple, blueberry, rhododendron, rhubarb, black alder and linden (basswood) are listed there as sensitive, whereas cherry, plum and peach were observed growing near black walnut, and for pear the lists disagree. Persian walnut (Juglans regia) on its own rootstock does not appear to be toxic.'
      },
      scientificCitations: [...JUGLONE_DISTANCE_CITATIONS],
      safeDistanceM: JUGLONE_ROOT_ZONE_M,
      spatialAdvice: {
        de: `Vorsorglicher Mindestabstand für neue Walnuss-Pflanzungen: ≥ ${formatNumber(JUGLONE_ROOT_ZONE_M, 1, 'de')} m zur äußersten Grenze dieser Gilde (${formatNumber(maxDist + JUGLONE_ROOT_ZONE_M, 1, 'de')} m vom Stammzentrum) – das obere Ende der beobachteten mittleren Giftzone von 15–18 m (bei sehr großen Bäumen bis etwa 24 m). Empfindliche Pflanzen erstrecken sich in Richtung ${sectorList('de')} bis ${formatNumber(maxDist, 1, 'de')} m. Walnusslaub, -schalen und -häcksel nicht als Mulch in dieser Gilde verwenden.`,
        en: `Precautionary minimum buffer for any new walnut planting: ≥ ${formatNumber(JUGLONE_ROOT_ZONE_M, 1, 'en')} m beyond the outer perimeter of this guild (${formatNumber(maxDist + JUGLONE_ROOT_ZONE_M, 1, 'en')} m from the central trunk) – the upper end of the observed average toxic zone of 15–18 m (up to about 24 m for very large trees). Sensitive species extend towards ${sectorList('en')} up to ${formatNumber(maxDist, 1, 'en')} m. Do not use walnut leaves, hulls or chips as mulch in this guild.`
      },
      affectedPlants: sensitivePlants
    });
  }

  // Allium exudates vs. legume rhizobia
  const alliumPlants = placedPlants.filter(p => isAlliumPlant(p.plant));
  const legumePlants = placedPlants.filter(p => isLegumePlant(p.plant));

  if (alliumPlants.length > 0 && legumePlants.length > 0) {
    let minPairDist = Infinity;
    let closestAllium = alliumPlants[0];
    let closestLegume = legumePlants[0];
    for (const a of alliumPlants) {
      for (const l of legumePlants) {
        const d = distBetween(a, l);
        if (d < minPairDist) {
          minPairDist = d;
          closestAllium = a;
          closestLegume = l;
        }
      }
    }
    const affectedPair: AffectedPlantLocation[] = [
      placedAt(closestAllium, 'Allium (Organosulfur producer)'),
      placedAt(closestLegume, 'Fabaceae / Rhizobium Symbiont')
    ];

    if (minPairDist < 1.8) {
      conflicts.push({
        id: 'internal-allium-legume-proximity',
        type: 'INTERNAL_PROXIMITY',
        severity: 'WARNING',
        antagonistName: { de: 'Allium-Lauchgewächse (Schnittlauch / Bärlauch / Knoblauch)', en: 'Allium Species (Chives / Wild Garlic / Garlic)' },
        antagonistBotanical: 'Allium spp.',
        title: {
          de: 'Vorsorge-Abstand: Lauchgewächse neben Leguminosen',
          en: 'Precautionary Spacing: Alliums Next to Legumes'
        },
        mechanism: {
          de: 'In einem Gewächshausversuch verringerte Knoblauchextrakt, der in den Boden gegeben wurde, die Knöllchenbildung und das Wachstum von Augenbohne und Erdnuss, umso stärker, je höher die Konzentration war. Eine Messung, ob lebende Lauchgewächse benachbarte Leguminosen im Beet so beeinträchtigen, wurde nicht gefunden. Die 1,8 m sind ein vorsorglicher Planungswert, keine gemessene Grenze.',
          en: 'In a greenhouse study, garlic extract added to the soil reduced nodulation and growth of cowpea and groundnut, more so at higher concentrations. No measurement was found of whether living alliums affect neighbouring legumes in a bed in this way. The 1.8 m is a precautionary planning value, not a measured threshold.'
        },
        scientificCitations: [...ALLIUM_LEGUME_CITATIONS],
        safeDistanceM: 1.8,
        spatialAdvice: {
          de: `Aktueller Abstand beträgt nur ${formatNumber(minPairDist, 2, 'de')} m. Lauchgewächse und Leguminosen vorsorglich in unterschiedliche Sektoren setzen (z. B. Schnittlauch im Südbereich bei ${affectedPair[0].angleDeg}°, Leguminosen im Ostsektor), mit mindestens 1,8 m Abstand.`,
          en: `Current measured distance is only ${formatNumber(minPairDist, 2, 'en')} m. As a precaution, place alliums and legumes in different sectors (e.g. chives in the southern sector at ${affectedPair[0].angleDeg}°, legumes in the eastern sector), at least 1.8 m apart.`
        },
        affectedPlants: affectedPair
      });
    } else {
      resolvedHarmonies.push({
        id: 'resolved-allium-legume-spacing',
        type: 'RESOLVED_HARMONY',
        severity: 'INFO',
        antagonistName: { de: 'Allium & Leguminosen (Optimal entzerrt)', en: 'Allium & Legumes (Optimally Separated)' },
        antagonistBotanical: 'Allium spp. vs. Fabaceae',
        title: {
          de: 'Harmonisch entzerrt: Allium & Leguminosen optimal getrennt',
          en: 'Harmoniously Spaced: Allium & Legumes Optimally Separated'
        },
        mechanism: {
          de: 'Lauchgewächse (Allium) und Leguminosen wurden im Pflanzplan automatisch in getrennten Sektoren mit mindestens 1,8 m Abstand platziert. Das ist eine Vorsichtsmaßnahme: Im Gewächshaus verringerte Knoblauchextrakt im Boden die Knöllchenbildung von Leguminosen; eine Messung an lebenden Pflanzen im Beet wurde nicht gefunden.',
          en: 'Alliums and legumes were automatically placed in separate sectors of the plan, at least 1.8 m apart. This is a precaution: in a greenhouse study, garlic extract in the soil reduced legume nodulation; no measurement for living plants in a bed was found.'
        },
        scientificCitations: [...ALLIUM_LEGUME_CITATIONS],
        safeDistanceM: 1.8,
        spatialAdvice: {
          de: `Erfolgreich gelöst: Gemessener Mindestabstand beträgt ${formatNumber(minPairDist, 2, 'de')} m (≥ 1,8 m Pufferzone). Allium (${getLoc(closestAllium.plant.commonName, 'de')}) steht bei ${closestAllium.angleDeg}°, Leguminose (${getLoc(closestLegume.plant.commonName, 'de')}) bei ${closestLegume.angleDeg}°.`,
          en: `Successfully resolved: Measured distance is ${formatNumber(minPairDist, 2, 'en')} m (≥ 1.8 m buffer zone). Allium (${getLoc(closestAllium.plant.commonName, 'en')}) is sited at ${closestAllium.angleDeg}°, Legume (${getLoc(closestLegume.plant.commonName, 'en')}) at ${closestLegume.angleDeg}°.`
        },
        affectedPlants: affectedPair
      });
    }
  }

  // Pear trellis rust, alternate host juniper
  if (starTree.id === 'tree-pear' || starTree.botanicalName.toLowerCase().includes('pyrus')) {
    conflicts.push({
      id: 'external-pear-juniper-rust',
      type: 'EXTERNAL_ALERT',
      severity: 'WARNING',
      antagonistName: { de: 'Zier-Wacholder / Sadebaum (Juniperus-Arten)', en: 'Ornamental Junipers (Juniperus species)' },
      antagonistBotanical: 'Juniperus sabina, Juniperus chinensis, Juniperus virginiana',
      title: {
        de: 'Gefahr durch Birnengitterrost (Gymnosporangium sabinae)',
        en: 'Risk of Pear Trellis Rust (Gymnosporangium sabinae)'
      },
      mechanism: {
        de: 'Der Birnengitterrost ist ein wirtswechselnder Rostpilz: Er bildet Teliosporen und Basidiosporen auf Wacholder (normalerweise Juniperus sabina, J. virginiana, J. chinensis) und Spermatien und Aeciosporen auf der Birne. Birnen werden durch Basidiosporen infiziert, deren Freisetzung vor allem von Regen (mindestens 10 mm) bei Temperaturen von mindestens 10 °C abhängt.',
        en: 'Pear trellis rust is a host-alternating rust fungus: it produces teliospores and basidiospores on juniper (normally Juniperus sabina, J. virginiana, J. chinensis) and spermatia and aeciospores on pear. Pears are infected by basidiospores, whose release depends mainly on rain (at least 10 mm) at temperatures of at least 10 °C.'
      },
      scientificCitations: [
        'Lāce, B., Kārkliņa, K., & Deņisova, I. (2022). Gymnosporangium sabinae development cycle—Peculiarities and influencing factors. Journal of Phytopathology, 170(10), 675–682. doi:10.1111/jph.13131',
        'Lāce, B. (2017). Gymnosporangium species – an important issue of plant protection. Proceedings of the Latvian Academy of Sciences, Section B, 71(3), 95–102. doi:10.1515/prolas-2017-0017',
        'Ormrod, D. J., O\'Reilly, H. J., van der Kamp, B. J., & Borno, C. (1984). Epidemiology, cultivar susceptibility, and chemical control of Gymnosporangium fuscum in British Columbia. Canadian Journal of Plant Pathology, 6(1), 63–70. doi:10.1080/07060668409501592 (distance data as summarised by Lāce 2017)'
      ],
      safeDistanceM: 300,
      spatialAdvice: {
        de: 'Wacholder-Abstand: In einer Studie (zitiert bei Lāce 2017) waren bei 30 m Abstand zum Wacholder 100 % der Birnenblätter befallen, bei 150 m 50 % und bei 300 m gab es keine Symptome; vereinzelt wurden aber Infektionen über viel größere Distanzen berichtet. Keine Zierwacholder (insb. Juniperus sabina) im Umkreis von 300 m um den Birnbaum pflanzen.',
        en: 'Juniper buffer: in one study (cited by Lāce 2017), 100 % of pear leaves were infected at 30 m from the juniper, 50 % at 150 m, and there were no symptoms at 300 m; occasional infections over much larger distances have, however, been reported. Do not plant ornamental junipers (especially Juniperus sabina) within 300 m of the pear tree.'
      },
      affectedPlants: [starAt(starTree, 'Pome Fruit / Primary Host')]
    });
  }

  // White pine blister rust, alternate host Ribes
  const isRibes = (p: { id: string; botanicalName: string }) =>
    p.id.includes('currant') || p.botanicalName.toLowerCase().startsWith('ribes');
  const starIsRibes = isRibes(starTree);

  if (starIsRibes || selectedPlants.some(isRibes)) {
    const ribesPlants = placedPlants.filter(p => isRibes(p.plant));

    const affectedRibesList: AffectedPlantLocation[] = [
      ...(starIsRibes ? [starAt(starTree, 'Grossulariaceae / Primary Guild Shrub')] : []),
      ...ribesPlants.map(rp => placedAt(rp, 'Grossulariaceae / Intermediate Host'))
    ];

    conflicts.push({
      id: 'external-ribes-white-pine-rust',
      type: 'EXTERNAL_ALERT',
      severity: 'INFO',
      antagonistName: { de: 'Weymouths-Kiefern & 5-nadelige Kiefern (Pinus strobus)', en: 'Eastern White Pines & 5-Needle Pines (Pinus strobus)' },
      antagonistBotanical: 'Pinus strobus, Pinus monticola',
      title: {
        de: 'Wirtswechsel Blasenrost (Cronartium ribicola)',
        en: 'White Pine Blister Rust Alternate Host (Cronartium ribicola)'
      },
      mechanism: {
        de: 'Der Blasenrost wechselt zwischen Johannis-/Stachelbeeren (Ribes, Telienwirt) und 5-nadeligen Kiefern (Aecienwirt). Die auf Ribes-Blättern gebildeten, empfindlichen Basidiosporen infizieren nahe Kiefern (über Meter bis wenige Kilometer). An den Kiefern entstehen Rindenkrebse; umfasst ein Krebs den Stamm, sterben junge Bäume rasch ab.',
        en: 'White pine blister rust alternates between Ribes (currants/gooseberries, telial host) and 5-needle white pines (aecial host). The delicate basidiospores formed on Ribes leaves infect nearby pines (over metres to a few kilometres). On the pines they cause cankers; once a canker girdles the stem, young trees die rapidly.'
      },
      scientificCitations: [
        'Geils, B. W., Hummer, K. E., & Hunt, R. S. (2010). White pines, Ribes, and blister rust: A review and synthesis. Forest Pathology, 40(3–4), 147–185. doi:10.1111/j.1439-0329.2010.00654.x'
      ],
      safeDistanceM: 300,
      spatialAdvice: {
        de: 'Pufferabstand: Zwischen kultivierten Johannisbeeren und wertvollen 5-nadeligen Kiefern (Pinus strobus) Abstand halten; früher wurden Ribes in festgelegten Abständen um Kiefernbestände entfernt. Die 300 m sind ein vorsorglicher Planungswert, keine gemessene Grenze.',
        en: 'Buffer distance: keep cultivated Ribes away from valuable 5-needle white pines (Pinus strobus); historically, Ribes were removed to set distances around pine stands. The 300 m is a precautionary planning value, not a measured limit.'
      },
      affectedPlants: affectedRibesList
    });
  }

  // Nightshades as Verticillium reservoir near fruit trees
  const isFruitTree = starTree.category === 'FRUIT_TREE' || starTree.category === 'BERRY_SHRUB';
  if (isFruitTree) {
    conflicts.push({
      id: 'external-solanaceae-fruit-tree-verticillium',
      type: 'EXTERNAL_ALERT',
      severity: 'WARNING',
      antagonistName: { de: 'Nachtschattengewächse (Kartoffeln, Tomaten, Auberginen)', en: 'Nightshades (Potatoes, Tomatoes, Eggplants)' },
      antagonistBotanical: 'Solanum tuberosum, Solanum lycopersicum',
      title: {
        de: 'Bodengesundheit: Verticillium-Welke durch Nachtschattengewächse',
        en: 'Soil Health: Verticillium Wilt Risk from Nightshade Crops'
      },
      mechanism: {
        de: 'Kartoffel und Tomate gehören zu den wichtigen Wirten des bodenbürtigen Welkepilzes Verticillium dahliae, der über 200 Pflanzenarten befallen kann, darunter Obst- und Landschaftsgehölze. Seine Dauerkörper (Mikrosklerotien) können ohne Wirt bis zu 14 Jahre im Boden überdauern. Der Pilz verursacht Gefäßwelke.',
        en: 'Potato and tomato are among the important hosts of the soil-borne wilt fungus Verticillium dahliae, which can infect more than 200 plant species, including fruit and landscape trees. Its resting structures (microsclerotia) can survive in soil for up to 14 years without a host. The fungus causes vascular wilt.'
      },
      scientificCitations: [
        'Klosterman, S. J., Atallah, Z. K., Vallad, G. E., & Subbarao, K. V. (2009). Diversity, pathogenicity, and management of Verticillium species. Annual Review of Phytopathology, 47, 39–62. doi:10.1146/annurev-phyto-080508-081748',
        'Pegg, G. F., & Brady, B. L. (2002). Verticillium Wilts. Wallingford: CABI Publishing. doi:10.1079/9780851995298.0000',
        'Wilhelm, S. (1955). Longevity of the Verticillium wilt fungus in the laboratory and field. Phytopathology, 45, 180–181.'
      ],
      safeDistanceM: Number((starTree.matureRadiusM + 2.0).toFixed(1)),
      spatialAdvice: {
        de: `Vorsorglich keine Kartoffeln oder Tomaten innerhalb der Baumscheibe oder des Kronentraufbereichs (${formatNumber(starTree.matureRadiusM + 2.0, 1, 'de')} m) anbauen; dieser Abstand ist ein Planungswert, keine gemessene Grenze.`,
        en: `As a precaution, do not grow potatoes, tomatoes or eggplants within the tree basin or canopy drip line (${formatNumber(starTree.matureRadiusM + 2.0, 1, 'en')} m); this distance is a planning value, not a measured limit.`
      },
      affectedPlants: [starAt(starTree, 'Susceptible Vascular Host')]
    });
  }

  // Allium within 1.8 m of an actinorhizal N-fixing star
  if (starTree.category === 'NITROGEN_FIXING_TREE' && alliumPlants.length > 0) {
    const closeAlliums = alliumPlants.filter(a => a.distanceM < 1.8);
    if (closeAlliums.length > 0) {
      conflicts.push({
        id: 'internal-allium-nfixing-tree-proximity',
        type: 'INTERNAL_PROXIMITY',
        severity: 'WARNING',
        antagonistName: { de: 'Allium-Lauchgewächse am Stammkragen eines N-Fixierer-Baums', en: 'Allium Species Near Nitrogen-Fixing Tree Collar' },
        antagonistBotanical: `Allium spp. vs. ${starTree.botanicalName}`,
        title: {
          de: `Vorsorge-Abstand: Lauchgewächse am Stamm von ${starTree.commonName.de}`,
          en: `Precautionary Spacing: Alliums at the Trunk of ${starTree.commonName.en}`
        },
        mechanism: {
          de: 'Im Gewächshaus verringerte Knoblauchextrakt im Boden die Knöllchenbildung von Leguminosen (Rhizobien-Symbiose). Eine Studie dazu, ob Lauchgewächse die Frankia-Knöllchen stickstoffbindender Bäume wie Erle oder Sanddorn beeinträchtigen, wurde nicht gefunden. Der Planer überträgt den Vorsorge-Abstand von 1,8 m daher auch auf diese Bäume.',
          en: 'In a greenhouse study, garlic extract in the soil reduced nodulation of legumes (rhizobia symbiosis). No study was found on whether alliums affect the Frankia nodules of nitrogen-fixing trees such as alder or sea buckthorn. The planner therefore applies the same precautionary 1.8 m spacing to these trees.'
        },
        scientificCitations: [...ALLIUM_LEGUME_CITATIONS],
        safeDistanceM: 1.8,
        spatialAdvice: {
          de: `Lauchgewächse vorsorglich mindestens 1,8 m vom Stammzentrum von ${starTree.commonName.de} entfernt pflanzen (in die äußere Traufzone versetzen).`,
          en: `As a precaution, keep alliums at least 1.8 m away from the trunk center of ${starTree.commonName.en} (place them in the outer drip zone).`
        },
        affectedPlants: [
          starAt(starTree, 'Actinorhizal Nitrogen-Fixing Tree'),
          ...closeAlliums.map(a => placedAt(a, 'Allium (Organosulfur producer)'))
        ]
      });
    } else {
      const closestTreeAllium = alliumPlants.reduce((a, b) => (b.distanceM < a.distanceM ? b : a));
      resolvedHarmonies.push({
        id: 'resolved-allium-nfixing-tree-spacing',
        type: 'RESOLVED_HARMONY',
        severity: 'INFO',
        antagonistName: { de: `Allium & ${starTree.commonName.de} (Optimal entzerrt)`, en: `Allium & ${starTree.commonName.en} (Optimally Separated)` },
        antagonistBotanical: `Allium spp. vs. ${starTree.botanicalName}`,
        title: {
          de: `Harmonisch entzerrt: Allium in sicherer Traufzone von ${starTree.commonName.de}`,
          en: `Harmoniously Spaced: Allium Placed in Safe Drip Zone of ${starTree.commonName.en}`
        },
        mechanism: {
          de: `Da ${starTree.commonName.de} mit Frankia-Knöllchen Luftstickstoff bindet, wurden Lauchgewächse (Allium) vorsorglich in die äußere Traufzone (≥ 1,8 m vom Stamm) verschoben. Eine Studie zur Hemmung von Frankia durch Lauch wurde nicht gefunden; der Abstand folgt einem Gewächshausbefund mit Knoblauchextrakt an Leguminosen.`,
          en: `Because ${starTree.commonName.en} fixes atmospheric nitrogen with Frankia root nodules, alliums were moved to the outer drip zone (≥ 1.8 m from the trunk) as a precaution. No study on inhibition of Frankia by alliums was found; the spacing follows a greenhouse finding with garlic extract on legumes.`
        },
        scientificCitations: [...ALLIUM_LEGUME_CITATIONS],
        safeDistanceM: 1.8,
        spatialAdvice: {
          de: `Erfolgreich gelöst: Gemessener Abstand zum Stammzentrum beträgt ${formatNumber(closestTreeAllium.distanceM, 2, 'de')} m (≥ 1,8 m Pufferzone).`,
          en: `Successfully resolved: Measured distance from trunk center is ${formatNumber(closestTreeAllium.distanceM, 2, 'en')} m (≥ 1.8 m buffer zone).`
        },
        affectedPlants: [
          starAt(starTree, 'Actinorhizal Nitrogen-Fixing Tree'),
          placedAt(closestTreeAllium, 'Allium (Organosulfur producer)')
        ]
      });
    }
  }

  // Fennel allelopathy (< 1.5 m)
  const fennel = placedPlants.find(p => isFennelPlant(p.plant));
  if (fennel) {
    const otherForFennel = placedPlants.filter(p => p.plant.id !== fennel.plant.id);
    const closeToFennel = otherForFennel.filter(p => distBetween(fennel, p) < 1.5);

    if (closeToFennel.length > 0) {
      const minFennelDist = Math.min(...closeToFennel.map(p => distBetween(fennel, p)));
      conflicts.push({
        id: 'internal-fennel-allelopathy',
        type: 'INTERNAL_PROXIMITY',
        severity: 'WARNING',
        antagonistName: { de: 'Fenchel (Foeniculum vulgare)', en: 'Fennel (Foeniculum vulgare)' },
        antagonistBotanical: 'Foeniculum vulgare',
        title: {
          de: 'Allelopathie-Vorsorge: Fenchel neben Begleitpflanzen',
          en: 'Allelopathy Precaution: Fennel Next to Companion Plants'
        },
        mechanism: {
          de: 'Im Laborversuch hemmten Extrakte aus Fenchelsamen und Fenchel-Öl die Keimung und das Keimlingswachstum von Testpflanzen. In Wurzelausscheidungen und Wurzelraum-Boden von Fenchel wurden Terpene wie Anethol, Estragol und D-Limonen nachgewiesen. Eine Messung, ob lebender Fenchel Nachbarpflanzen im Beet hemmt und über welche Entfernung, wurde nicht gefunden; die 1,5 m sind ein vorsorglicher Planungswert.',
          en: 'In lab tests, fennel seed extract and fennel essential oil inhibited germination and seedling growth of test plants. Terpenes such as anethole, estragole and D-limonene were found in fennel root exudates and rhizosphere soil. No measurement was found of whether living fennel inhibits neighbouring plants in a bed, or over what distance; the 1.5 m is a precautionary planning value.'
        },
        scientificCitations: [...FENNEL_ALLELOPATHY_CITATIONS, FENNEL_RHIZOSPHERE_TERPENES_CITATION],
        safeDistanceM: 1.5,
        spatialAdvice: {
          de: `Fenchel steht aktuell nur ${formatNumber(minFennelDist, 2, 'de')} m von benachbarten Begleitern entfernt. Fenchel vorsorglich am äußeren Gildenrand platzieren, mit mindestens 1,5 m Abstand zu anderen Begleitpflanzen.`,
          en: `Fennel is currently sited only ${formatNumber(minFennelDist, 2, 'en')} m from neighbouring companions. As a precaution, place fennel at the outer guild boundary, at least 1.5 m from other companion plants.`
        },
        affectedPlants: [
          placedAt(fennel, 'Apiaceae Allelopath'),
          ...closeToFennel.map(p => placedAt(p, 'Allelopathy-Sensitive Neighbor'))
        ]
      });
    } else {
      let closestFennelPeer: PlacedPlant | null = null;
      let minFennelClearance = fennel.distanceM;
      for (const p of otherForFennel) {
        const d = distBetween(fennel, p);
        if (!closestFennelPeer || d < minFennelClearance) {
          minFennelClearance = d;
          closestFennelPeer = p;
        }
      }

      const fennelAffectedList: AffectedPlantLocation[] = [
        placedAt(fennel, 'Apiaceae Insectary / Allelopath'),
        ...(closestFennelPeer ? [placedAt(closestFennelPeer, 'Nearest Companion (Safe Buffer)')] : [])
      ];

      resolvedHarmonies.push({
        id: 'resolved-fennel-allelopathy-spacing',
        type: 'RESOLVED_HARMONY',
        severity: 'INFO',
        antagonistName: { de: 'Bronzefenchel (Automatisch am Außenrand entzerrt)', en: 'Bronze Fennel (Optimally Isolated on Perimeter)' },
        antagonistBotanical: 'Foeniculum vulgare',
        title: {
          de: 'Harmonisch entzerrt: Fenchel vorsorglich am Gildenrand',
          en: 'Harmoniously Spaced: Fennel Placed on the Perimeter as a Precaution'
        },
        mechanism: {
          de: 'Fenchel wurde im Pflanzplan automatisch am äußeren Gildenrand (Zone 4) mit mindestens 1,5 m Abstand zu allen anderen Begleitpflanzen platziert. Das ist eine Vorsichtsmaßnahme: Fenchelextrakte und -öl hemmten im Labor Keimung und Keimlingswachstum; eine Messung an lebenden Pflanzen im Beet wurde nicht gefunden.',
          en: 'Fennel was automatically placed on the outer guild perimeter (Zone 4) with at least 1.5 m clearance from all other companions. This is a precaution: fennel extracts and oil inhibited germination and seedling growth in the lab; no measurement for living plants in a bed was found.'
        },
        scientificCitations: [...FENNEL_ALLELOPATHY_CITATIONS],
        safeDistanceM: 1.5,
        spatialAdvice: {
          de: closestFennelPeer
            ? `Erfolgreich gelöst: Gemessener Mindestabstand zum nächsten Nachbarn (${getLoc(closestFennelPeer.plant.commonName, 'de')}) beträgt ${formatNumber(minFennelClearance, 2, 'de')} m (≥ 1,5 m Pufferzone). Fenchel steht am Außenrand bei ${formatNumber(fennel.distanceM, 1, 'de')} m (${fennel.angleDeg}°).`
            : `Erfolgreich gelöst: Optimal platziert am Außenrand bei ${formatNumber(fennel.distanceM, 1, 'de')} m (${getLoc(getCardinalDirection(fennel.angleDeg), 'de')}) mit ≥ 1,5 m Abstand.`,
          en: closestFennelPeer
            ? `Successfully resolved: Measured minimum distance to nearest neighbor (${getLoc(closestFennelPeer.plant.commonName, 'en')}) is ${formatNumber(minFennelClearance, 2, 'en')} m (≥ 1.5 m buffer zone). Fennel is sited on the outer perimeter at ${formatNumber(fennel.distanceM, 1, 'en')} m (${fennel.angleDeg}°).`
            : `Successfully resolved: Optimally sited on the outer perimeter at ${formatNumber(fennel.distanceM, 1, 'en')} m (${getLoc(getCardinalDirection(fennel.angleDeg), 'en')}) with ≥ 1.5 m clearance.`
        },
        affectedPlants: fennelAffectedList
      });
    }
  }

  // Wormwood allelopathy (< 1.2 m): Funke (1943) found every test species except wormwood itself injured within ~1 m
  const wormwood = placedPlants.find(p => isWormwoodPlant(p.plant));
  if (wormwood) {
    const sensitivePeersForWormwood = placedPlants.filter(p => p.plant.id !== wormwood.plant.id);
    const closeToWormwood = sensitivePeersForWormwood.filter(p => distBetween(wormwood, p) < 1.2);

    if (closeToWormwood.length > 0) {
      const minWormwoodDist = Math.min(...closeToWormwood.map(p => distBetween(wormwood, p)));
      conflicts.push({
        id: 'internal-wormwood-allelopathy',
        type: 'INTERNAL_PROXIMITY',
        severity: 'WARNING',
        antagonistName: { de: 'Echter Wermut (Artemisia absinthium)', en: 'Wormwood (Artemisia absinthium)' },
        antagonistBotanical: 'Artemisia absinthium',
        title: {
          de: 'Allelopathie: Wermut-Blattausscheidungen (Absinthin) hemmen Nachbarpflanzen',
          en: 'Allelopathy: Wormwood Leaf Drip (Absinthin) Inhibits Neighbouring Plants'
        },
        mechanism: {
          de: 'Die Blätter des Echten Wermuts tragen Drüsenhaare, die ätherische Öle und den Bitterstoff Absinthin ausscheiden. Im Garten wurden Fenchel-Keimlinge und andere Arten innerhalb von etwa 1 m um Wermut im Wachstum gehemmt. In einem Versuch mit 18 Arten neben einer Wermuthecke wurden alle Testarten außer Wermut selbst im Umkreis von etwa 100 cm stark geschädigt, Liebstöckel starb sogar ab; als Ursache gilt wahrscheinlich das ausgeschiedene Absinthin.',
          en: 'Wormwood leaves bear glandular hairs that excrete essential oils and the bitter compound absinthin. In a garden, fennel seedlings and other species within about 1 m of wormwood grew poorly. In a trial with 18 species sown beside a wormwood hedge, every test species except wormwood itself was severely injured within about 100 cm, and lovage was even killed; the excreted absinthin is the probable cause.'
        },
        scientificCitations: [...WORMWOOD_ALLELOPATHY_CITATIONS],
        safeDistanceM: 1.2,
        spatialAdvice: {
          de: `Wermut steht nur ${formatNumber(minWormwoodDist, 2, 'de')} m von krautigen Begleitern entfernt. Wermut als Solitär am Außenrand (Zone 4) platzieren, mit mindestens 1,2 m Abstand zu anderen Pflanzen – etwas mehr als die in Versuchen beobachtete Wirkzone von etwa 1 m.`,
          en: `Wormwood is currently only ${formatNumber(minWormwoodDist, 2, 'en')} m from herbaceous companions. Place wormwood as an isolated boundary plant (Zone 4) at least 1.2 m from other plants – a little more than the effect zone of about 1 m observed in trials.`
        },
        affectedPlants: [
          placedAt(wormwood, 'Asteraceae Allelopath (Absinthin)'),
          ...closeToWormwood.map(p => placedAt(p, 'Absinthin-Sensitive Neighbor'))
        ]
      });
    } else {
      let closestWormwoodPeer: PlacedPlant | null = null;
      let minWormwoodClearance = wormwood.distanceM;
      for (const p of sensitivePeersForWormwood) {
        const d = distBetween(wormwood, p);
        if (!closestWormwoodPeer || d < minWormwoodClearance) {
          minWormwoodClearance = d;
          closestWormwoodPeer = p;
        }
      }

      const wormwoodAffectedList: AffectedPlantLocation[] = [
        placedAt(wormwood, 'Asteraceae Boundary Repeller'),
        ...(closestWormwoodPeer ? [placedAt(closestWormwoodPeer, 'Nearest Companion (Safe Buffer)')] : [])
      ];

      resolvedHarmonies.push({
        id: 'resolved-wormwood-allelopathy-spacing',
        type: 'RESOLVED_HARMONY',
        severity: 'INFO',
        antagonistName: { de: 'Echter Wermut (Automatisch am Außenrand entzerrt)', en: 'Wormwood (Optimally Separated on Perimeter)' },
        antagonistBotanical: 'Artemisia absinthium',
        title: {
          de: 'Harmonisch entzerrt: Wermut mit Abstand am Außenrand',
          en: 'Harmoniously Spaced: Wormwood Kept Apart on the Perimeter'
        },
        mechanism: {
          de: 'Echter Wermut wurde automatisch am äußeren Gildenrand (Zone 4) mit mindestens 1,2 m Abstand zu empfindlichen Begleitpflanzen platziert. In Versuchen schädigte Wermut Nachbarpflanzen innerhalb von etwa 1 m, wahrscheinlich durch ausgeschiedenes Absinthin.',
          en: 'Wormwood was automatically placed on the outer perimeter (Zone 4) at least 1.2 m from sensitive companions. In trials, wormwood injured neighbouring plants within about 1 m, probably through excreted absinthin.'
        },
        scientificCitations: [...WORMWOOD_ALLELOPATHY_CITATIONS],
        safeDistanceM: 1.2,
        spatialAdvice: {
          de: closestWormwoodPeer
            ? `Erfolgreich gelöst: Gemessener Mindestabstand zum nächsten empfindlichen Nachbarn (${getLoc(closestWormwoodPeer.plant.commonName, 'de')}) beträgt ${formatNumber(minWormwoodClearance, 2, 'de')} m (≥ 1,2 m Pufferzone). Wermut steht am Außenrand bei ${formatNumber(wormwood.distanceM, 1, 'de')} m (${wormwood.angleDeg}°).`
            : `Erfolgreich gelöst: Optimal platziert am Außenrand bei ${formatNumber(wormwood.distanceM, 1, 'de')} m (${getLoc(getCardinalDirection(wormwood.angleDeg), 'de')}) mit ≥ 1,2 m Abstand.`,
          en: closestWormwoodPeer
            ? `Successfully resolved: Measured minimum distance to nearest sensitive neighbor (${getLoc(closestWormwoodPeer.plant.commonName, 'en')}) is ${formatNumber(minWormwoodClearance, 2, 'en')} m (≥ 1.2 m buffer zone). Wormwood is sited on the outer perimeter at ${formatNumber(wormwood.distanceM, 1, 'en')} m (${wormwood.angleDeg}°).`
            : `Successfully resolved: Optimally sited on the outer perimeter at ${formatNumber(wormwood.distanceM, 1, 'en')} m (${getLoc(getCardinalDirection(wormwood.angleDeg), 'en')}) with ≥ 1.2 m separation.`
        },
        affectedPlants: wormwoodAffectedList
      });
    }
  }

  // Soil pH: strict calcifuges vs. calcicoles
  const starIsStrictAcidophile = STRICT_ACIDOPHILE_STAR_IDS.has(starTree.id);
  const starIsStrictCalcicole = isAcidIntolerantStar(starTree);
  const acidophileCompanions = placedPlants.filter(p => isStrictAcidophilePlant(p.plant));
  const calcicoleCompanions = placedPlants.filter(p => isStrictCalcicolePlant(p.plant));

  const hasAcidophile = starIsStrictAcidophile || acidophileCompanions.length > 0;
  const hasCalcicole = starIsStrictCalcicole || calcicoleCompanions.length > 0;

  if (hasAcidophile && hasCalcicole) {
    const affectedEdaphic: AffectedPlantLocation[] = [
      ...(starIsStrictAcidophile || starIsStrictCalcicole
        ? [starAt(starTree, starIsStrictAcidophile ? 'Strict Acidophile' : 'Needs Less Acid Soil (pH ≥ 6)')]
        : []),
      ...acidophileCompanions.map(ap => placedAt(ap, 'Strict Acidophile / Calcifuge')),
      ...calcicoleCompanions.map(cp => placedAt(cp, 'Calcicole / Neutral-to-Chalky Soil'))
    ];

    conflicts.push({
      id: 'internal-edaphic-ph-antagonism',
      type: 'INTERNAL_PROXIMITY',
      severity: 'WARNING',
      antagonistName: { de: 'Boden-pH-Unverträglichkeit: Moorbeetpflanzen (Kalkflüchter) ↔ Kalkliebende Arten', en: 'Edaphic pH Antagonism: Strict Calcifuges ↔ Calcicole Species' },
      antagonistBotanical: 'Acid-soil plants (e.g. Ericaceae, Theaceae) vs. lime-tolerant plants',
      title: {
        de: 'Edaphischer Konflikt: Unvereinbare Boden-pH-Ansprüche im selben Wurzelraum',
        en: 'Edaphic Conflict: Incompatible Rhizosphere pH Requirements'
      },
      mechanism: {
        de: 'Der Planer führt einige Arten als strikte Säurepflanzen (z. B. Heidelbeere, Cranberry, Teestrauch) und andere als Pflanzen neutraler bis kalkhaltiger Böden (z. B. Salbei, Luzerne, Esparsette, Christrose). Pflanzen unterscheiden sich stark in ihrem Calciumbedarf, was die Flora kalkreicher und saurer Böden prägt. Tee braucht einen Boden-pH von etwa 4,5–5,6. Luzerne wächst dagegen auf sauren Böden schlecht, wo Aluminium giftig wirkt, und Kalkung verbessert ihr Wachstum. Ein gemeinsamer Wurzelraum kann daher nicht beiden Gruppen gerecht werden.',
        en: 'The planner rates some species as strict acid-soil plants (e.g. blueberry, cranberry, tea) and others as plants of neutral to chalky soils (e.g. sage, alfalfa, sainfoin, Christmas rose). Plants differ widely in their calcium requirements, which shapes the flora of chalky and acid soils. Tea needs a soil pH of about 4.5–5.6. Alfalfa (lucerne), in contrast, grows poorly on acid soils where aluminium is toxic, and liming improves its growth. One shared root zone therefore cannot suit both groups.'
      },
      scientificCitations: [...EDAPHIC_PH_CITATIONS],
      safeDistanceM: 2.5,
      spatialAdvice: {
        de: 'Strenge Säurepflanzen nicht mit Pflanzen neutraler bis kalkhaltiger Böden (z. B. Salbei, Luzerne, Esparsette, Christrose) in denselben Wurzelraum setzen. Die 2,5 m sind ein vorsorglicher Planungswert. Die unpassende Art passend zum pH-Bedarf deiner Leitpflanze ersetzen.',
        en: 'Do not combine strict acid-soil plants with plants of neutral to chalky soils (e.g. sage, alfalfa, sainfoin, Christmas rose) in the same root zone. The 2.5 m is a precautionary planning value. Replace the mismatched species to match your star plant’s soil pH needs.'
      },
      affectedPlants: affectedEdaphic
    });
  }

  // Tea on calcareous soil
  const isTea = (p: { id: string; botanicalName: string }) =>
    p.id.includes('tea') || p.botanicalName.toLowerCase().includes('camellia');
  const starIsTea = isTea(starTree);

  if (starIsTea || selectedPlants.some(isTea)) {
    conflicts.push({
      id: 'external-tea-calcium-incompatibility',
      type: 'EXTERNAL_ALERT',
      severity: 'WARNING',
      antagonistName: { de: 'Kalkreicher Boden, Bauschutt & Freies Calciumcarbonat', en: 'Calcareous / Chalky Soils & Free Calcium Carbonate' },
      antagonistBotanical: 'CaCO3 / soil pH > 5.6',
      title: {
        de: 'Kalk-Risiko: Teesträucher brauchen sauren Boden',
        en: 'Lime Risk: Tea Plants Need Acid Soil'
      },
      mechanism: {
        de: 'Tee (Camellia sinensis) wird in den Tropen und Subtropen auf sauren Böden angebaut; sein pH-Bedarf liegt bei etwa 4,5–5,6. Kalk, Holzasche und kalkhaltige Baustoffe heben den Boden-pH über diesen Bereich.',
        en: 'Tea (Camellia sinensis) is grown in the tropics and subtropics on acid soils; its pH requirement is about 4.5–5.6. Lime, wood ash and lime-containing building materials raise soil pH above this range.'
      },
      scientificCitations: [
        'Hajiboland, R. (2017). Environmental and nutritional requirements for tea cultivation. Folia Horticulturae, 29(2), 199–220. doi:10.1515/fhort-2017-0019',
        'White, P. J., & Broadley, M. R. (2003). Calcium in plants. Annals of Botany, 92(4), 487–511. doi:10.1093/aob/mcg164'
      ],
      safeDistanceM: 5.0,
      spatialAdvice: {
        de: 'Teepflanzen nicht an frisch betonierte Mauern oder Fundamente setzen und weder Holzasche noch Kalkdünger geben. Die 5 m sind ein vorsorglicher Planungswert.',
        en: 'Do not plant tea next to fresh concrete walls or foundations, and do not apply wood ash or lime. The 5 m is a precautionary planning value.'
      },
      affectedPlants: [
        ...(starIsTea ? [starAt(starTree, 'Calcifuge (pH 4.5–5.6)')] : []),
        ...placedPlants.filter(p => isTea(p.plant)).map(tp => placedAt(tp, 'Calcifuge (pH 4.5–5.6)'))
      ]
    });
  }

  // Pest and pathogen reservoir hosts (pestHostConflicts.ts)
  for (const spec of PEST_HOST_CONFLICTS) {
    if (!spec.starTreeIds.includes(starTree.id)) continue;
    const hosts = placedPlants.filter(p => spec.hostPlantIds.includes(p.plant.id));
    if (hosts.length === 0) continue;

    conflicts.push({
      id: spec.id,
      type: spec.kind === 'INTERNAL' ? 'INTERNAL_PROXIMITY' : 'EXTERNAL_ALERT',
      severity: spec.severity,
      antagonistName: spec.antagonistName,
      antagonistBotanical: spec.antagonistBotanical,
      title: spec.title,
      mechanism: spec.mechanism,
      scientificCitations: spec.scientificCitations,
      safeDistanceM: spec.safeDistanceM,
      spatialAdvice: spec.spatialAdvice,
      affectedPlants: [
        starAt(starTree, 'Susceptible Star Plant'),
        ...hosts.map(h => placedAt(h, 'Pest / Pathogen Host'))
      ]
    });
  }

  const hasCritical = conflicts.some(c => c.severity === 'CRITICAL');
  const hasWarning = conflicts.some(c => c.severity === 'WARNING');

  return {
    hasCritical,
    hasWarning,
    totalConflicts: conflicts.length,
    conflicts,
    resolvedHarmonies
  };
}
