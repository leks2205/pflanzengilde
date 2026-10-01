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
  isStrictCalcicolePlant
} from './placementRules';
import { PEST_HOST_CONFLICTS } from './pestHostConflicts';
import { formatNumber } from '../i18n/translations';

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

// Juglone-intolerant star plants (Rosaceae, Ericaceae, Vitaceae, Theaceae, Polygonaceae, Corylus)
const JUGLONE_SENSITIVE_TREES = new Set([
  'tree-apple',
  'tree-pear',
  'tree-cherry',
  'tree-plum',
  'tree-peach',
  'tree-apricot',
  'tree-almond',
  'tree-medlar',
  'tree-quince',
  'tree-hazelnut',
  'shrub-blueberry',
  'shrub-rhododendron',
  'vine-grape',
  'tree-tea-sinensis',
  'tree-tea-assamica',
  'herb-rhubarb'
]);

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

  const treeIsSensitive =
    !starTree.jugloneProducer &&
    (JUGLONE_SENSITIVE_TREES.has(starTree.id) || starTree.category === 'FRUIT_TREE');
  if (treeIsSensitive) {
    sensitivePlants.push(
      starAt(starTree, 'Rosaceae / Star Tree', { de: 'Zentrum (Stamm, 0,0 m)', en: 'Center (Trunk, 0.0 m)' })
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
          de: 'Walnussbäume scheiden über Blätter, Rinde, Nusschalen und Feinwurzeln Hydrojuglon aus, das im Boden zu hochtoxischem Juglon (5-Hydroxy-1,4-naphthochinon) oxidiert. Juglon hemmt spezifisch die mitochondriale Elektronentransportkette (Komplexe I und III) und entkoppelt die oxidative Phosphorylierung (ATP-Synthese). Bei empfindlichen Arten führt dies zu Wurzelbräunung, vaskulärem Xylemkollaps, permanenter Welke und Wurzelfäule.',
          en: 'Walnut trees release hydrojuglone via foliage, bark, nut hulls, and fibrous roots, which oxidizes in the rhizosphere into toxic juglone (5-hydroxy-1,4-naphthoquinone). Juglone directly inhibits the mitochondrial electron transport chain (Complexes I and III) and uncouples oxidative phosphorylation (ATP synthesis). In sensitive species, this induces root apex browning, irreversible xylem vascular collapse, chlorosis, and root necrosis.'
        },
        scientificCitations: [
          'Hejl, A. M., & Koster, K. L. (1993). The allelochemical juglone inhibits ATP synthesis in plant mitochondria. Journal of Chemical Ecology, 19(5), 959–968.',
          'Jose, S., & Gillespie, A. R. (1998). Allelopathy in black walnut (Juglans nigra L.) alley cropping: I. Spatio-temporal variation in soil juglone. Journal of Chemical Ecology, 24(3), 417–433.',
          'Dana, M. N., & Lerner, B. R. (2001). Black Walnut Toxicity. Purdue University Extension, HO-193-W.'
        ],
        safeDistanceM: Math.round(starTree.matureRadiusM * 2.5),
        spatialAdvice: {
          de: `Unmittelbarer toxischer Kontakt! Die markierten empfindlichen Pflanzen befinden sich direkt im Wurzelraum des Walnussbaums (0,3 bis ${formatNumber(starTree.matureRadiusM + 1.5, 1, 'de')} m). Sie müssen aus der Gilde entfernt und durch juglon-tolerante Arten (z. B. Echte Hyazinthe, Beinwell, Waldmeister, Rote Johannisbeere) ersetzt werden.`,
          en: `Direct toxic rhizosphere contact! The highlighted sensitive plants are placed within the active root zone of the walnut tree (0.3 to ${formatNumber(starTree.matureRadiusM + 1.5, 1, 'en')} m). They must be removed from this guild and replaced with juglone-tolerant allies (e.g. Common Hyacinth, Comfrey, Sweet Woodruff, Red Currant).`
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
        de: 'Walnussbäume (Juglandaceae) sondern das Allelochemikal Hydrojuglon ab, das bei Kontakt mit Luftsauerstoff und Bodenmikroben zu Juglon (5-Hydroxy-1,4-naphthochinon) oxidiert. Juglon blockiert die H+-ATPase und stört die Zellatmung empfindlicher Rosengewächse (Kern- und Steinobst) sowie krautiger Arten. Die Toxinzone erstreckt sich durch Wurzelausläufer 15 bis 20 m (und bis zu 24 m) weit über den Kronentraufbereich hinaus.',
        en: 'Walnut trees (Juglandaceae) exude the allelochemical hydrojuglone, which oxidizes in soil air into juglone (5-hydroxy-1,4-naphthoquinone). Juglone inhibits plasma membrane H+-ATPase and mitochondrial respiration in sensitive Rosaceae (apples, pears, stone fruits) and herbaceous allies. The rhizosphere toxic zone extends 15 to 20 meters (and up to 24 meters) beyond the walnut trunk via far-reaching feeder roots.'
      },
      scientificCitations: [
        'Dana, M. N., & Lerner, B. R. (2001). Black Walnut Toxicity. Purdue University Extension, HO-193-W.',
        'Hejl, A. M., & Koster, K. L. (1993). The allelochemical juglone inhibits ATP synthesis in plant mitochondria. Journal of Chemical Ecology, 19(5), 959–968.',
        'Jose, S., & Gillespie, A. R. (1998). Allelopathy in black walnut alley cropping. Journal of Chemical Ecology, 24(3), 417–433.'
      ],
      safeDistanceM: 20,
      spatialAdvice: {
        de: `Empfohlener Mindestabstand für neue Walnuss-Pflanzungen: ≥ 20,0 m Sicherheitsabstand zur äußersten Grenze dieser Gilde (${formatNumber(maxDist + 20, 1, 'de')} m vom Stammzentrum). Empfindliche Pflanzen erstrecken sich in Richtung ${sectorList('de')} bis ${formatNumber(maxDist, 1, 'de')} m. Pflanze Walnussbäume niemals hangaufwärts dieser Gilde, da ausgewaschenes Hydrojuglon mit dem Hangwasser in den Wurzelbereich dieser Gilde transportiert wird. Walnussbäume stets hangabwärts oder mit ausreichendem Grünstreifen positionieren.`,
        en: `Recommended minimum buffer for any new walnut planting: ≥ 20.0 m beyond the outer perimeter of this guild (${formatNumber(maxDist + 20, 1, 'en')} m from the central trunk). Sensitive species extend towards ${sectorList('en')} up to ${formatNumber(maxDist, 1, 'en')} m. Never plant a walnut tree uphill or up-gradient from this guild, as water-soluble hydrojuglone leaches with subsurface runoff into the root zone. Position walnuts downslope or with a safe 20 m grass buffer.`
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
          de: 'Nachbarschaftskonflikt: Allium hemmt Knöllchenbakterien (Rhizobien)',
          en: 'Proximity Conflict: Allium Exudates Inhibit Symbiotic Rhizobia'
        },
        mechanism: {
          de: 'Lauchgewächse (Allium) emittieren schwefelorganische flüchtige Substanzen (Allicin, Diallyldisulfid) und phenolische Wurzelexudate mit stark bakterizider Wirkung. Wissenschaftliche Studien belegen, dass diese Substanzen bei Pflanzabständen von unter 1,8 m die Knöllchenbildung (Nodulation) und die symbiontische N2-Fixierung durch Rhizobium- und Frankia-Bakterien an Leguminosen signifikant hemmen.',
          en: 'Allium species release volatile organosulfur compounds (allicin, diallyl disulfide) and phenolic root exudates with broad-spectrum antimicrobial activity. Peer-reviewed research demonstrates that at distances below 1.8 m, these exudates suppress nodulation and nitrogenase enzyme activity of symbiotic Rhizobium and Frankia bacteria on legume roots.'
        },
        scientificCitations: [
          'Adeleke, M. T. V. (2016). Effect of Allium sativum (garlic) extract on the growth and nodulation of cowpea and groundnut. African Journal of Agricultural Research, 11(48), 4945–4951.',
          'An, M., et al. (1998). Allelopathy in crops: Allium species. Australian Journal of Agricultural Research, 49(8), 1269–1274.'
        ],
        safeDistanceM: 1.8,
        spatialAdvice: {
          de: `Aktueller Abstand beträgt nur ${formatNumber(minPairDist, 2, 'de')} m. Trenne Allium und Leguminosen räumlich in unterschiedliche Himmelsrichtungen (z. B. Schnittlauch im sonnigen Südbereich bei ${affectedPair[0].angleDeg}°, Leguminosen im Ostsektor), um mindestens 1,8 m Pufferzone einzuhalten.`,
          en: `Current measured distance is only ${formatNumber(minPairDist, 2, 'en')} m. Separate Allium and Legumes into distinct cardinal sectors (e.g. chives in southern sun sector at ${affectedPair[0].angleDeg}°, legumes in the eastern morning sector) to maintain a buffer of at least 1.8 m.`
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
          de: 'Lauchgewächse (Allium) und Leguminosen wurden im interaktiven Pflanzplan automatisch in gegenüberliegenden Sektoren platziert. Durch den Pufferabstand von mindestens 1,8 m können sich die Knöllchenbakterien (Rhizobien) der Leguminosen ungestört entwickeln, während Allium den Baum vor Schorf und Pilzkrankheiten schützt.',
          en: 'Allium species and legumes were automatically arranged in opposing sectors in the radial plan. With a safe buffer distance of at least 1.8 m, symbiotic root nodule bacteria (Rhizobia) develop without inhibition while Allium protects the tree against scab and fungal blights.'
        },
        scientificCitations: [
          'Adeleke, M. T. V. (2016). Effect of Allium sativum (garlic) extract on the growth and nodulation of cowpea and groundnut. African Journal of Agricultural Research, 11(48), 4945–4951.',
          'An, M., et al. (1998). Allelopathy in crops: Allium species. Australian Journal of Agricultural Research, 49(8), 1269–1274.'
        ],
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
        de: 'Der Birnengitterrost ist ein wirtswechselnder Rostpilz (heterözisch). Er überwintert in Zweiggallen an Wacholderarten (Winterwirt) und bildet im Frühjahr bei Regen gallertartige Sporenlager (Telien). Die freigesetzten Basidiosporen infizieren Birnenblätter (Sommerwirt) über Distanzen von mehreren hundert Metern, was zu orangefarbenen Blattgallen, vorzeitigem Laubfall und drastischem Ertragsausfall führt.',
        en: 'Pear trellis rust is an obligate heteroecious rust fungus that alternates between junipers (winter host) and pear trees (summer host). In rainy spring weather, gelatinous telial spore horns on junipers discharge airborne basidiospores that infect young pear foliage across hundreds of meters, causing orange leaf pustules, premature defoliation, and fruit stunting.'
      },
      scientificCitations: [
        'Hilber, U. W., et al. (2000). Epidemiology and control of Gymnosporangium sabinae in Switzerland. Journal of Plant Pathology, 82(2), 101–108.',
        'Weber, R. W. S., & Webster, J. (2001). Teaching techniques for mycology: Gymnosporangium sabinae (pear rust). Mycologist, 15(3), 108–110.'
      ],
      safeDistanceM: 300,
      spatialAdvice: {
        de: 'Wacholder-Abstand: Befallshäufigkeit sinkt ab 150 m signifikant, ab 300–500 m ist das Infektionsrisiko minimal. Keine Zierwacholder (insb. Juniperus sabina) im Umkreis von 300 m um den Birnbaum pflanzen. Der heimische Gemeine Wacholder (Juniperus communis) ist weitgehend resistent.',
        en: 'Juniper buffer: Infection severity drops dramatically beyond 150 m and is minimal beyond 300–500 m. Do not plant ornamental junipers (especially Juniperus sabina) within 300 m of the pear tree. Wild common juniper (Juniperus communis) is generally resistant.'
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
        de: 'Der Blasenrost wechselt zyklisch zwischen Johannis-/Stachelbeeren (Ribes, Zwischenwirt) und 5-nadeligen Kiefern (Hauptwirt). Auf Ribes entstehen im Spätsommer empfindliche Basidiosporen, die Kiefernnadeln infizieren und dort tödliche Rindennekrosen und Stammgallen auslösen.',
        en: 'White pine blister rust is a macrocyclic rust that alternates between Ribes (currants/gooseberries, telial host) and 5-needle white pines (aecial host). In late summer, delicate basidiospores on Ribes leaves disperse in moist air to infect white pine needles, causing girdling cankers and tree death in young pines.'
      },
      scientificCitations: [
        'Geils, B. W., Hummer, K. E., & Hunt, R. S. (2010). White pines, Ribes, and blister rust: A review and synthesis. Forest Pathology, 40(3–4), 147–185.'
      ],
      safeDistanceM: 300,
      spatialAdvice: {
        de: 'Pufferabstand: Halte zwischen kultivierten Johannisbeeren und wertvollen 5-nadeligen Kiefern (Pinus strobus) mindestens 300 m Abstand ein, um die Infektionskette zu unterbrechen.',
        en: 'Buffer distance: Maintain at least 300 m separation between cultivated Ribes bushes and valuable 5-needle white pines (Pinus strobus) to break the basidiospore transmission cycle.'
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
        de: 'Nachtschattengewächse (Solanaceae) sind primäre Wirte und Multiplikatoren des bodenbürtigen Gefäßpilzes Verticillium dahliae. Der Pilz bildet extrem langlebige Dauerkörper (Mikrosklerotien), die über 10 bis 14 Jahre im Boden lebensfähig bleiben. Er dringt über Feinwurzeln in Obstbäume ein und verstopft die Wasserleitbahnen (Tracheen), was zu einseitiger Welke (Verticillium-Welke) und Aststerben führt.',
        en: 'Nightshade crops (Solanaceae) are primary reservoir hosts for the persistent soil-borne vascular pathogen Verticillium dahliae. The fungus generates durable resting structures (microsclerotia) that persist in soil for 10 to 14 years. It invades fruit tree root tips and colonizes xylem water vessels, causing unilateral vascular wilting and branch dieback.'
      },
      scientificCitations: [
        'Pegg, G. F., & Brady, B. L. (2002). Verticillium Wilts. CABI Publishing.',
        'Wilhelm, S. (1955). Longevity of the Verticillium wilt fungus in the laboratory and field. Phytopathology, 45, 180–181.'
      ],
      safeDistanceM: 6.0,
      spatialAdvice: {
        de: `Niemals Kartoffeln oder Tomaten innerhalb der Baumscheibe oder des Kronentraufbereichs (${formatNumber(starTree.matureRadiusM + 2.0, 1, 'de')} m) anbauen. Reserviere diesen Wurzelbereich für Allium, Beinwell und mehrjährige Kräuter.`,
        en: `Never cultivate potatoes, tomatoes, or eggplants within the tree basin or canopy drip line (${formatNumber(starTree.matureRadiusM + 2.0, 1, 'en')} m). Reserve this zone for alliums, deep-rooted comfrey, and perennial living mulch.`
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
          de: `Bakterizide Wurzelhemmung: Allium hemmt Frankia-Knöllchen von ${starTree.commonName.de}`,
          en: `Bactericidal Inhibition: Allium Suppresses Frankia Nodules of ${starTree.commonName.en}`
        },
        mechanism: {
          de: 'Lauchgewächse (Allium) geben über ihre Wurzeln Allicin und Thiosulfinate ab. Stehen sie näher als 1,8 m am Wurzelhals eines stickstofffixierenden Leitbaums (Schwarzerle, Sanddorn), hemmen diese bakteriziden Exudate die aktinorhizale Frankia-Symbiose und reduzieren die Stickstofffixierung.',
          en: 'Allium bulbs exude bactericidal allicin and thiosulfinates into the topsoil. When planted closer than 1.8 m to the root collar of an actinorhizal nitrogen-fixing star tree (Black Alder, Sea Buckthorn), these organosulfurs inhibit Frankia root nodulation and nitrogenase activity.'
        },
        scientificCitations: [
          'Adeleke, M. T. V. (2016). Effect of Allium sativum extract on growth and nodulation. African Journal of Agricultural Research, 11(48), 4945–4951.',
          'An, M., et al. (1998). Allelopathy in crops: Allium species. Australian Journal of Agricultural Research, 49(8), 1269–1274.'
        ],
        safeDistanceM: 1.8,
        spatialAdvice: {
          de: `Halte Lauchgewächse mindestens 1,8 m vom Stammzentrum von ${starTree.commonName.de} entfernt (in die äußere Traufzone versetzen).`,
          en: `Keep Allium companions at least 1.8 m away from the trunk center of ${starTree.commonName.en} (place in the outer drip zone).`
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
          de: `Da ${starTree.commonName.de} über aktinorhizale Frankia-Knöllchen am Wurzelhals Luftstickstoff bindet, wurden Lauchgewächse (Allium) automatisch aus der inneren Zwiebelzone in die äußere Traufzone (≥ 1,8 m vom Stamm) verschoben.`,
          en: `Because ${starTree.commonName.en} fixes atmospheric nitrogen via actinorhizal Frankia root nodules near the trunk collar, Allium companions were automatically shifted from the inner bulb ring to the outer drip zone (≥ 1.8 m from the trunk).`
        },
        scientificCitations: [
          'Adeleke, M. T. V. (2016). Effect of Allium sativum extract on growth and nodulation. African Journal of Agricultural Research, 11(48), 4945–4951.',
          'An, M., et al. (1998). Allelopathy in crops: Allium species. Australian Journal of Agricultural Research, 49(8), 1269–1274.'
        ],
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
          de: 'Allelopathie: Fenchel-Wurzelexudate hemmen benachbarte Begleitpflanzen',
          en: 'Allelopathy: Fennel Exudates Inhibit Neighbouring Companion Plants'
        },
        mechanism: {
          de: 'Fenchelwurzeln scheiden bioaktive Monoterpene und Phenylpropanoide (insbesondere trans-Anethol, Fenchon, Estragol) sowie Scopoletin in den Boden ab. Bei Abständen unter 1,5 m hemmen diese Stoffe die mitotische Zellteilung im Wurzelapikalmeristem und unterdrücken das Wachstum benachbarter krautiger Pflanzen und Leguminosen.',
          en: 'Fennel roots exude bioactive monoterpenes and phenylpropanoids (notably trans-anethole, fenchone, estragole) and coumarins into the rhizosphere. At distances below 1.5 m, these allelochemicals disrupt mitotic cell division in the root apical meristem and stunt adjacent herbaceous species and legumes.'
        },
        scientificCitations: [
          'Al-Charchafchi, F. M. R., et al. (2007). Allelopathic effects of Foeniculum vulgare on germination and radicle growth of crops. Allelopathy Journal, 20(2), 341–352.'
        ],
        safeDistanceM: 1.5,
        spatialAdvice: {
          de: `Fenchel steht aktuell nur ${formatNumber(minFennelDist, 2, 'de')} m von benachbarten Begleitern entfernt. Positioniere Fenchel isoliert am äußersten Gildenrand (≥ 1,5 m Abstand zu allen anderen Begleitpflanzen).`,
          en: `Fennel is currently sited only ${formatNumber(minFennelDist, 2, 'en')} m from neighbouring companions. Position fennel isolated at the outer guild boundary with at least 1.5 m separation from other companion plants.`
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
          de: 'Harmonisch entzerrt: Fenchel-Allelopathie durch Randplatzierung neutralisiert',
          en: 'Harmoniously Spaced: Fennel Allelopathy Neutralized by Perimeter Siting'
        },
        mechanism: {
          de: 'Bronzefenchel wurde im interaktiven Pflanzplan automatisch am äußeren Gildenrand (Zone 4) mit mindestens 1,5 m Sicherheitsabstand zu allen anderen Begleitpflanzen platziert. So hemmen seine Anethol-Wurzelexudate keine Nachbarpflanzen, während seine Doldenblüten Schwebfliegen und Schlupfwespen anlocken.',
          en: 'Bronze fennel was automatically placed on the outer guild perimeter (Zone 4) with at least 1.5 m clearance from all other companions, preventing trans-anethole root exudate inhibition while its umbels attract hoverflies and parasitoid wasps.'
        },
        scientificCitations: [
          'Al-Charchafchi, F. M. R., et al. (2007). Allelopathic effects of Foeniculum vulgare on germination and radicle growth of crops. Allelopathy Journal, 20(2), 341–352.'
        ],
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

  // Wormwood allelopathy (< 1.2 m); Ribes tolerate absinthin
  const wormwood = placedPlants.find(p => isWormwoodPlant(p.plant));
  if (wormwood) {
    const sensitivePeersForWormwood = placedPlants.filter(
      p => p.plant.id !== wormwood.plant.id && !p.plant.botanicalName.toLowerCase().startsWith('ribes')
    );
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
          de: 'Echter Wermut bildet in seinen Blattdrüsenhaaren das Sesquiterpenlacton Absinthin sowie Thujon, die durch Regenwasser (Blatttraufe) in den Oberboden ausgewaschen werden. In einem Umkreis von unter 1,2 m hemmen diese Verbindungen stark die Keimung und das Wurzelwachstum krautiger Begleitpflanzen (insbesondere Doldenblütler wie Fenchel/Liebstöckel und Leguminosen; Johannisbeeren/Ribes sind hingegen tolerant).',
          en: 'Wormwood synthesizes the sesquiterpene lactone absinthin and thujone in glandular leaf trichomes, which leach into the topsoil via rain drip. Within 1.2 m, these compounds strongly inhibit seed germination and root growth of herbaceous companions (especially Apiaceae umbellifers and Fabaceae legumes, whereas Ribes currants are tolerant).'
        },
        scientificCitations: [
          'Bode, H. R. (1940). Über die Blattausscheidungen des Wermuts und ihre Wirkung auf andere Pflanzen. Planta, 30(5), 767–785.',
          'Funke, G. L. (1943). The influence of Artemisia absinthium on neighbouring plants. Blumea, 5(2), 281–293.'
        ],
        safeDistanceM: 1.2,
        spatialAdvice: {
          de: `Wermut steht nur ${formatNumber(minWormwoodDist, 2, 'de')} m von krautigen Begleitern entfernt. Platziere Wermut als Solitär am windzugewandten Außenrand (Zone 4) mit mindestens 1,2 m Abstand zu Doldenblütlern, Leguminosen und feinen Kräutern.`,
          en: `Wormwood is currently only ${formatNumber(minWormwoodDist, 2, 'en')} m from herbaceous companions. Place wormwood as an isolated windward boundary plant (Zone 4) with at least 1.2 m separation from umbellifers, legumes, and tender herbs.`
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
          de: 'Harmonisch entzerrt: Wermut schützt am Außenrand ohne Absinthin-Hemmung',
          en: 'Harmoniously Spaced: Wormwood Shields Perimeter Without Absinthin Inhibition'
        },
        mechanism: {
          de: 'Echter Wermut wurde automatisch am äußeren Gildenrand (Zone 4) mit mindestens 1,2 m Abstand zu empfindlichen Begleitkräutern platziert. Dadurch wirkt seine Duftwolke gegen Säulchenrost, Blattwespen und Wickler, ohne Nachbarpflanzen durch Absinthin-Blatttraufe zu beeinträchtigen.',
          en: 'Wormwood was automatically positioned on the outer perimeter (Zone 4) with at least 1.2 m separation from sensitive herbs, providing volatile pest and rust deterrence without absinthin drip inhibition.'
        },
        scientificCitations: [
          'Bode, H. R. (1940). Über die Blattausscheidungen des Wermuts und ihre Wirkung auf andere Pflanzen. Planta, 30(5), 767–785.'
        ],
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
  const starIsStrictAcidophile = ['shrub-blueberry', 'shrub-rhododendron', 'tree-tea-sinensis', 'tree-tea-assamica', 'tree-chestnut'].includes(starTree.id);
  const starIsStrictCalcicole = ['tree-fig'].includes(starTree.id);
  const acidophileCompanions = placedPlants.filter(p => isStrictAcidophilePlant(p.plant));
  const calcicoleCompanions = placedPlants.filter(p => isStrictCalcicolePlant(p.plant));

  const hasAcidophile = starIsStrictAcidophile || acidophileCompanions.length > 0;
  const hasCalcicole = starIsStrictCalcicole || calcicoleCompanions.length > 0;

  if (hasAcidophile && hasCalcicole) {
    const affectedEdaphic: AffectedPlantLocation[] = [
      ...(starIsStrictAcidophile || starIsStrictCalcicole
        ? [starAt(starTree, starIsStrictAcidophile ? 'Strict Acidophile (pH 4.2–5.8)' : 'Calcicole (pH 6.8–8.0)')]
        : []),
      ...acidophileCompanions.map(ap => placedAt(ap, 'Strict Acidophile / Calcifuge (pH 4.0–5.8)')),
      ...calcicoleCompanions.map(cp => placedAt(cp, 'Calcicole / Alkaline-Lover (pH 6.5–8.0)'))
    ];

    conflicts.push({
      id: 'internal-edaphic-ph-antagonism',
      type: 'INTERNAL_PROXIMITY',
      severity: 'WARNING',
      antagonistName: { de: 'Boden-pH-Unverträglichkeit: Moorbeetpflanzen (Kalkflüchter) ↔ Kalkliebende Arten', en: 'Edaphic pH Antagonism: Strict Calcifuges ↔ Calcicole Species' },
      antagonistBotanical: 'Ericaceae / Theaceae (pH 4.2–5.5) vs. Calcicoles (pH 6.8–8.0)',
      title: {
        de: 'Edaphischer Konflikt: Unvereinbare Boden-pH-Ansprüche im selben Wurzelraum',
        en: 'Edaphic Conflict: Incompatible Rhizosphere pH Requirements'
      },
      mechanism: {
        de: 'Strikte Kalkflüchter (Heidelbeere, Cranberry, Preiselbeere, Scheinbeere, Teestrauch, Lupine) benötigen stark saure Böden (pH 4,2–5,8) und ericoide Mykorrhiza; freies Calciumcarbonat blockiert ihre Eisen- und Manganaufnahme (Kalkchlorose). Umgekehrt benötigen kalkliebende Arten (Luzerne/Sinorhizobium meliloti, Lavendel, Rosmarin, Christrose, Ysop) neutrale bis alkalische Böden (pH 6,5–8,0) und erleiden im sauren Milieu Aluminiumtoxizität und Knöllchenversagen.',
        en: 'Strict calcifuges (Blueberry, Cranberry, Lingonberry, Wintergreen, Tea, Lupine) require acidic soils (pH 4.2–5.8) and ericoid mycorrhizae, suffering fatal iron chlorosis in calcareous soil. Conversely, calcicoles (Alfalfa/Sinorhizobium meliloti, Lavender, Rosemary, Hellebore, Hyssop) require neutral-to-alkaline soil (pH 6.5–8.0) and suffer aluminum root toxicity and nodulation failure in acidic soil.'
      },
      scientificCitations: [
        'Ghanati, F., et al. (2005). Deposition of suberin and lignin in tea roots as affected by calcium and pH. Physiologia Plantarum, 123(2), 170–178.',
        'Munns, D. N. (1965). Soil acidity and growth of a legume: Interactions of lime with nitrogen and phosphate on growth of Medicago sativa L. and Trifolium subterraneum L. Australian Journal of Agricultural Research, 16(5), 733–741.'
      ],
      safeDistanceM: 2.5,
      spatialAdvice: {
        de: 'Kombiniere keine strengen Moorbeet-/Säurepflanzen mit kalkliebenden mediterranen Kräutern oder Luzerne innerhalb derselben Baumscheibe (< 2,5 m). Ersetze die unpassende Art passend zum Ziel-pH-Wert deiner Leitpflanze.',
        en: 'Do not combine obligate acidophiles with calcicole Mediterranean subshrubs or alfalfa within the same root zone (< 2.5 m). Replace the mismatched species to match your star plant’s target soil pH.'
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
      antagonistBotanical: 'CaCO3 / pH > 6.5',
      title: {
        de: 'Kalkchlorose-Risiko: Teesträucher sind strikte Kalkflüchter',
        en: 'Lime Chlorosis Risk: Tea Plants Are Strict Calcifuges'
      },
      mechanism: {
        de: 'Teepflanzen (Camellia sinensis) sind hochgradig acidophil (optimaler pH-Wert 4,5–5,8). Freie Calcium-Ionen (Ca2+) im Boden fällen Eisen (Fe) und Mangan (Mn) unlöslich aus. Bei pH > 6,5 führt dies zu schwerer intervaskulärer Blattchlorose, Wachstumsstillstand und Triebspitzennekrosen.',
        en: 'Tea plants (Camellia sinensis) are strictly acidophilic (optimum pH 4.5–5.8). Free calcium ions (Ca2+) in alkaline or chalky soils precipitate essential iron and manganese into insoluble complexes. At pH > 6.5, this induces severe interveinal leaf chlorosis, metabolic arrest, and apical dieback.'
      },
      scientificCitations: [
        'Ghanati, F., et al. (2005). Deposition of suberin and lignin in tea roots as affected by calcium and pH. Physiologia Plantarum, 123(2), 170–178.',
        'White, P. J., & Broadley, M. R. (2003). Calcium in plants. Annals of Botany, 92(4), 487–511.'
      ],
      safeDistanceM: 5.0,
      spatialAdvice: {
        de: 'Halte Teepflanzen mindestens 5 m entfernt von frisch betonierten Mauern/Fundamenten (Kalkaustrag), Holzasche-Gaben oder kalkhaltigen Düngern. Mulche den Wurzelbereich kontinuierlich mit Nadelstreu oder saurem Laubkompost.',
        en: 'Keep tea plants at least 5 m away from concrete foundations leaching calcium hydroxide, wood ash applications, or lime fertilizers. Maintain the rhizosphere acidic using pine needle or oak leaf mulch.'
      },
      affectedPlants: [
        ...(starIsTea ? [starAt(starTree, 'Calcifuge (pH 4.5–5.8)')] : []),
        ...placedPlants.filter(p => isTea(p.plant)).map(tp => placedAt(tp, 'Calcifuge (pH 4.5–5.8)'))
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
