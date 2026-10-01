import { LocalizedString } from '../types/guild';

/**
 * Companions (or star plants) that act as reservoir or alternate hosts of a key pest or
 * pathogen of a neighbouring star plant. Shared by the guild antagonist engine and the
 * garden antagonist so both builders flag the same pairs.
 *
 * - kind 'INTERNAL': flagged whenever a host companion is in the guild (don't combine).
 * - kind 'EXTERNAL': site-dependent caution; shown as an alert, never blocks a default guild.
 */
export interface PestHostConflictSpec {
  id: string;
  kind: 'INTERNAL' | 'EXTERNAL';
  severity: 'WARNING' | 'INFO';
  /** Star plants at risk. */
  starTreeIds: string[];
  /** Companion plant IDs that host the pest. */
  hostPlantIds: string[];
  /** Star plant IDs that host the pest (garden builder, star next to star). */
  hostStarIds: string[];
  safeDistanceM: number;
  antagonistName: LocalizedString;
  antagonistBotanical: string;
  title: LocalizedString;
  mechanism: LocalizedString;
  scientificCitations: string[];
  spatialAdvice: LocalizedString;
}

const PRUNUS_STARS = ['tree-plum', 'tree-cherry', 'tree-apricot', 'tree-peach'];

export const PEST_HOST_CONFLICTS: PestHostConflictSpec[] = [
  {
    id: 'internal-elderberry-drosophila-suzukii',
    kind: 'INTERNAL',
    severity: 'WARNING',
    starTreeIds: ['tree-cherry', 'shrub-blueberry'],
    hostPlantIds: ['plant-elderberry'],
    hostStarIds: ['shrub-elderberry'],
    safeDistanceM: 20,
    antagonistName: { de: 'Schwarzer Holunder', en: 'Black Elder' },
    antagonistBotanical: 'Sambucus nigra',
    title: {
      de: 'Reservoirwirt der Kirschessigfliege (Drosophila suzukii)',
      en: 'Reservoir Host of Spotted Wing Drosophila (Drosophila suzukii)'
    },
    mechanism: {
      de: 'Schwarzer Holunder ist in Europa einer der wichtigsten Wildwirte der Kirschessigfliege. Seine Beeren werden stark befallen und bauen im Spätsommer Populationen auf, die in benachbarte Kirschen und Heidelbeeren einfliegen.',
      en: 'Black elder is one of the main wild hosts of spotted wing drosophila in Europe. Its berries are heavily infested and build up late-summer populations that move into neighbouring cherries and blueberries.'
    },
    scientificCitations: [
      'Kenis, M., et al. (2016). Non-crop plants used as hosts by Drosophila suzukii in Europe. Journal of Pest Science, 89, 735–748. doi:10.1007/s10340-016-0755-6',
      'Ulmer, R., et al. (2022). Macroecological patterns of fruit infestation rates by the invasive fly Drosophila suzukii in the wild reservoir host plant Sambucus nigra. Agricultural and Forest Entomology, 24. doi:10.1111/afe.12520'
    ],
    spatialAdvice: {
      de: 'Holunder nicht in die Gilde von Kirsche oder Heidelbeere setzen; mindestens 20 m Abstand halten und Holunderbeeren vollständig ernten.',
      en: 'Keep elder out of cherry and blueberry guilds; keep at least 20 m apart and harvest elderberries completely.'
    }
  },
  {
    id: 'internal-willow-alder-silver-leaf',
    kind: 'INTERNAL',
    severity: 'WARNING',
    starTreeIds: PRUNUS_STARS,
    hostPlantIds: ['plant-willow', 'plant-alder', 'plant-nepal-alder'],
    hostStarIds: ['tree-alder'],
    safeDistanceM: 10,
    antagonistName: { de: 'Weide & Erle (Stockausschlag, Schnittholz)', en: 'Willow & Alder (coppice stumps, cut wood)' },
    antagonistBotanical: 'Salix spp., Alnus spp.',
    title: {
      de: 'Wirtspflanzen der Bleiglanzkrankheit (Chondrostereum purpureum)',
      en: 'Hosts of Silver Leaf (Chondrostereum purpureum)'
    },
    mechanism: {
      de: 'Der Bleiglanz-Pilz besiedelt Schnittstellen und Stubben von Weide und Erle und bildet dort Fruchtkörper. Deren Sporen infizieren Schnittwunden von Pflaume, Kirsche und anderen Prunus-Arten, die besonders anfällig sind.',
      en: 'The silver leaf fungus colonises cut surfaces and stumps of willow and alder and fruits on them. Its airborne spores infect pruning wounds of plum, cherry and other Prunus, which are especially susceptible.'
    },
    scientificCitations: [
      'Setliff, E. C. (2002). The wound pathogen Chondrostereum purpureum, its history and incidence on trees in North America. Australian Journal of Botany, 50, 645–651. doi:10.1071/BT01058',
      'De Jong, M. T. (2000). The BioChon story: deployment of Chondrostereum purpureum to suppress stump sprouting in hardwoods. Mycologist, 14(2), 58–62. doi:10.1016/S0269-915X(00)80005-1',
      'NIAB EMR (2019). Plum Best Practice Guide – Silver leaf.'
    ],
    spatialAdvice: {
      de: 'Weiden und Erlen, die regelmäßig auf den Stock gesetzt werden, nicht in die Gilde von Steinobst setzen (≥ 10 m). Schnittholz und Stubben entfernen; Steinobst nur im Sommer schneiden.',
      en: 'Keep regularly coppiced willow and alder out of stone-fruit guilds (≥ 10 m). Remove cut wood and stumps; prune stone fruit only in summer.'
    }
  },
  {
    id: 'internal-strawberry-vine-weevil',
    kind: 'INTERNAL',
    severity: 'WARNING',
    starTreeIds: ['shrub-rhododendron'],
    hostPlantIds: ['plant-strawberry'],
    hostStarIds: [],
    safeDistanceM: 5,
    antagonistName: { de: 'Walderdbeere', en: 'Woodland Strawberry' },
    antagonistBotanical: 'Fragaria vesca',
    title: {
      de: 'Wirtspflanze des Gefurchten Dickmaulrüsslers (Otiorhynchus sulcatus)',
      en: 'Host of Black Vine Weevil (Otiorhynchus sulcatus)'
    },
    mechanism: {
      de: 'Erdbeeren gehören zu den bevorzugten Wirten des Dickmaulrüsslers. Die Larven fressen an ihren Wurzeln und bauen Populationen auf, deren Käfer dann Rhododendronblätter befressen und deren Larven Rhododendronwurzeln schädigen.',
      en: 'Strawberries are a favoured host of black vine weevil. Larvae feed on their roots and build up populations whose adults notch rhododendron leaves and whose larvae damage rhododendron roots.'
    },
    scientificCitations: [
      'Moorhouse, E. R., Charnley, A. K., & Gillespie, A. T. (1992). A review of the biology and control of the vine weevil, Otiorhynchus sulcatus. Annals of Applied Biology, 121, 431–454. doi:10.1111/j.1744-7348.1992.tb03455.x'
    ],
    spatialAdvice: {
      de: 'Keine Erdbeeren im Wurzelbereich des Rhododendrons pflanzen (≥ 5 m Abstand).',
      en: 'Do not plant strawberries in the rhododendron root zone (≥ 5 m apart).'
    }
  },
  {
    id: 'internal-verticillium-host-companions',
    kind: 'INTERNAL',
    severity: 'WARNING',
    starTreeIds: ['tree-seabuckthorn-star', 'tree-linden'],
    hostPlantIds: ['plant-horseradish', 'plant-marigold', 'plant-peppermint', 'plant-strawberry'],
    hostStarIds: [],
    safeDistanceM: 3,
    antagonistName: { de: 'Verticillium-Wirte (Meerrettich, Studentenblume, Pfefferminze, Erdbeere)', en: 'Verticillium hosts (horseradish, marigold, peppermint, strawberry)' },
    antagonistBotanical: 'Armoracia rusticana, Tagetes spp., Mentha × piperita, Fragaria spp.',
    title: {
      de: 'Verticillium-Welke: Wirtspflanzen im Wurzelraum',
      en: 'Verticillium Wilt: Host Plants in the Root Zone'
    },
    mechanism: {
      de: 'Diese Begleiter werden von Verticillium dahliae befallen und vermehren dessen langlebige Mikrosklerotien im Boden. Sanddorn und Linde sind anfällig; der Pilz dringt über die Feinwurzeln ein und verstopft die Leitbahnen.',
      en: 'These companions are infected by Verticillium dahliae and multiply its long-lived microsclerotia in the soil. Sea buckthorn and linden are susceptible; the fungus enters through fine roots and blocks the water-conducting vessels.'
    },
    scientificCitations: [
      'Yu, J. M., et al. (2016). Morphology, molecular identity, and pathogenicity of Verticillium dahliae and V. longisporum associated with internally discolored horseradish roots. Plant Disease, 100. doi:10.1094/PDIS-08-15-0846-RE',
      'Harris, D. C., & Yang, J. R. (1996). The relationship between the amount of Verticillium dahliae in soil and the incidence of strawberry wilt as a basis for disease risk prediction. Plant Pathology, 45, 106–114. doi:10.1046/j.1365-3059.1996.d01-96.x',
      'Johnson, D. A., & Santo, G. S. (2001). Development of wilt in mint in response to infection by two pathotypes of Verticillium dahliae. Plant Disease, 85, 1189–1192. doi:10.1094/PDIS.2001.85.11.1189',
      'UC IPM (2023). Pest Notes: Verticillium Wilt (Publication 74126) – host list incl. marigold.'
    ],
    spatialAdvice: {
      de: 'Keine Verticillium-Wirte innerhalb von 3 m um Sanddorn oder Linde pflanzen.',
      en: 'Keep Verticillium hosts at least 3 m away from sea buckthorn or linden.'
    }
  },
  {
    id: 'external-lupine-chestnut-ink-disease',
    kind: 'EXTERNAL',
    severity: 'INFO',
    starTreeIds: ['tree-chestnut'],
    hostPlantIds: ['plant-lupine'],
    hostStarIds: [],
    safeDistanceM: 5,
    antagonistName: { de: 'Lupine (auf nassen Böden)', en: 'Lupine (on wet soils)' },
    antagonistBotanical: 'Lupinus spp.',
    title: {
      de: 'Tintenkrankheit (Phytophthora cinnamomi): Lupinen auf nassen Böden',
      en: 'Ink Disease (Phytophthora cinnamomi): Lupines on Wet Soils'
    },
    mechanism: {
      de: 'Gelbe Lupine (Lupinus luteus) ist ein Wirt von Phytophthora cinnamomi und erhöhte in spanischen Eichen-Weiden das Infektionspotenzial im Boden. Für andere Lupinenarten ist das nicht geprüft; auf nassen, schlecht drainierten Böden ist Vorsicht geboten, weil der Erreger die Tintenkrankheit der Esskastanie auslöst.',
      en: 'Yellow lupine (Lupinus luteus) is a host of Phytophthora cinnamomi and raised soil inoculum in Spanish oak rangelands. Other lupine species are untested; be careful on wet, poorly drained soils, because the pathogen causes ink disease of sweet chestnut.'
    },
    scientificCitations: [
      'Serrano, M. S., et al. (2010). Lupinus luteus, a new host of Phytophthora cinnamomi in Spanish oak-rangeland ecosystems. European Journal of Plant Pathology, 128. doi:10.1007/s10658-010-9652-7'
    ],
    spatialAdvice: {
      de: 'Auf gut drainierten Böden unbedenklich. Auf nassen oder verdichteten Böden Lupinen mindestens 5 m vom Kastanienstamm entfernt pflanzen.',
      en: 'Fine on well-drained soils. On wet or compacted soils keep lupines at least 5 m from the chestnut trunk.'
    }
  }
];
