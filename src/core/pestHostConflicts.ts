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
      de: 'Schwarzer Holunder ist in Europa ein wichtiger wilder Reservoirwirt der Kirschessigfliege; die Gattung Sambucus gehörte in einer Erhebung in drei Ländern zu den am stärksten befallenen Wildfrüchten. Befallene Holunderbeeren können so Fliegen für benachbarte Kirschen und Heidelbeeren liefern.',
      en: 'Black elder is a major wild reservoir host of spotted wing drosophila in Europe; in a survey across three countries, Sambucus was among the most heavily infested wild fruits. Infested elderberries can therefore supply flies to neighbouring cherries and blueberries.'
    },
    scientificCitations: [
      'Kenis, M., et al. (2016). Non-crop plants used as hosts by Drosophila suzukii in Europe. Journal of Pest Science, 89(3), 735–748. doi:10.1007/s10340-016-0755-6',
      'Ulmer, R., et al. (2022). Macroecological patterns of fruit infestation rates by the invasive fly Drosophila suzukii in the wild reservoir host plant Sambucus nigra. Agricultural and Forest Entomology, 24(4), 548–563. doi:10.1111/afe.12520'
    ],
    spatialAdvice: {
      de: 'Holunder nicht in die Gilde von Kirsche oder Heidelbeere setzen und Holunderbeeren vollständig ernten. Die 20 m Abstand sind ein vorsorglicher Planungswert, keine gemessene Grenze.',
      en: 'Keep elder out of cherry and blueberry guilds and harvest elderberries completely. The 20 m distance is a precautionary planning value, not a measured limit.'
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
      de: 'Der Bleiglanz-Pilz ist ein Wundparasit, der als Erreger der Bleiglanzkrankheit an Steinobst und anderen Rosengewächsen bekannt ist. In einer Auswertung von 561 Herbarbelegen aus Nordamerika gehörten Erlen (15 %) und Weiden (5 %) zu den häufigen Wirten; Sporen bilden sich an Fruchtkörpern auf Schnittholz und Stubben und infizieren frische Wunden.',
      en: 'The silver leaf fungus is a wound pathogen best known for causing silver leaf of stone fruit and other Rosaceae. In a survey of 561 North American herbarium records, alder (15 %) and willow (5 %) were among its common hosts; spores come from fruiting bodies on cut wood and stumps and infect fresh wounds.'
    },
    scientificCitations: [
      'Setliff, E. C. (2002). The wound pathogen Chondrostereum purpureum, its history and incidence on trees in North America. Australian Journal of Botany, 50(5), 645–651. doi:10.1071/BT01058',
      'De Jong, M. T. (2000). The BioChon story: deployment of Chondrostereum purpureum to suppress stump sprouting in hardwoods. Mycologist, 14(2), 58–62. doi:10.1016/S0269-915X(00)80005-1'
    ],
    spatialAdvice: {
      de: 'Weiden und Erlen, die regelmäßig auf den Stock gesetzt werden, nicht in die Gilde von Steinobst setzen und Schnittholz sowie Stubben entfernen. Die 10 m Abstand sind ein vorsorglicher Planungswert, keine gemessene Grenze.',
      en: 'Keep regularly coppiced willow and alder out of stone-fruit guilds and remove cut wood and stumps. The 10 m distance is a precautionary planning value, not a measured limit.'
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
      de: 'Der Dickmaulrüssler hat fast 150 bekannte Wirtspflanzen; Schäden entstehen vor allem durch die wurzelfressenden Larven, die Käfer fressen an Blättern. Er gilt als wichtiger Schädling in Baumschulen und im Beerenobst, auch in Erdbeerfeldern, und Rhododendren gehören zu seinen Wirten. Erdbeeren im Rhododendronbeet können so eine örtliche Population aufbauen.',
      en: 'Black vine weevil has nearly 150 known host plants; damage comes mainly from the root-feeding larvae, while adults feed on leaves. It is an important pest in nurseries and small-fruit production, including strawberry fields, and rhododendrons are among its hosts. Strawberries in a rhododendron bed can therefore build up a local population.'
    },
    scientificCitations: [
      'Moorhouse, E. R., Charnley, A. K., & Gillespie, A. T. (1992). A review of the biology and control of the vine weevil, Otiorhynchus sulcatus (Coleoptera: Curculionidae). Annals of Applied Biology, 121(2), 431–454. doi:10.1111/j.1744-7348.1992.tb03455.x',
      'van Tol, R. W. H. M., et al. (2012). Field attraction of the vine weevil Otiorhynchus sulcatus to kairomones. Journal of Economic Entomology, 105(1), 169–175. doi:10.1603/EC11248',
      'Valla, D. (1980). An evaluation of resistance to the black vine weevil, Otiorhynchus sulcatus (F.), in Taxus and Rhododendron. Thesis, University of Rhode Island. doi:10.23860/thesis-valla-drew-1980'
    ],
    spatialAdvice: {
      de: 'Keine Erdbeeren im Wurzelbereich des Rhododendrons pflanzen. Die 5 m Abstand sind ein vorsorglicher Planungswert, keine gemessene Grenze.',
      en: 'Do not plant strawberries in the rhododendron root zone. The 5 m distance is a precautionary planning value, not a measured limit.'
    }
  },
  {
    id: 'internal-verticillium-host-companions',
    kind: 'INTERNAL',
    severity: 'WARNING',
    starTreeIds: ['tree-seabuckthorn-star', 'tree-linden'],
    hostPlantIds: ['plant-horseradish', 'plant-marigold', 'plant-african-marigold', 'plant-peppermint', 'plant-strawberry'],
    hostStarIds: [],
    safeDistanceM: 3,
    antagonistName: { de: 'Verticillium-Wirte (Meerrettich, Studentenblumen, Pfefferminze, Erdbeere)', en: 'Verticillium hosts (horseradish, French and African marigold, peppermint, strawberry)' },
    antagonistBotanical: 'Armoracia rusticana, Tagetes patula, Tagetes erecta, Mentha × piperita, Fragaria spp.',
    title: {
      de: 'Verticillium-Welke: Wirtspflanzen im Wurzelraum',
      en: 'Verticillium Wilt: Host Plants in the Root Zone'
    },
    mechanism: {
      de: 'Diese Begleiter können von Verticillium dahliae befallen werden (Meerrettich, Studentenblumen, Pfefferminze, Erdbeere). Der Pilz hat über 200 Wirtsarten, und seine Mikrosklerotien können ohne Wirt bis zu 14 Jahre im Boden überdauern. Auch Sanddorn und Linde können an Verticillium-Welke erkranken.',
      en: 'These companions can be infected by Verticillium dahliae (horseradish, French and African marigold, peppermint, strawberry). The fungus has more than 200 host species, and its microsclerotia can survive in soil for up to 14 years without a host. Sea buckthorn and linden can also develop Verticillium wilt.'
    },
    scientificCitations: [
      'Yu, J. M., Cafarov, I. H., & Babadoost, M. (2016). Morphology, molecular identity, and pathogenicity of Verticillium dahliae and V. longisporum associated with internally discolored horseradish roots. Plant Disease, 100(4), 749–757. doi:10.1094/PDIS-08-15-0846-RE',
      'Harris, D. C., & Yang, J. R. (1996). The relationship between the amount of Verticillium dahliae in soil and the incidence of strawberry wilt as a basis for disease risk prediction. Plant Pathology, 45(1), 106–114. doi:10.1046/j.1365-3059.1996.d01-96.x',
      'Johnson, D. A., & Santo, G. S. (2001). Development of wilt in mint in response to infection by two pathotypes of Verticillium dahliae and co-infection by Pratylenchus penetrans. Plant Disease, 85(11), 1189–1192. doi:10.1094/PDIS.2001.85.11.1189',
      'Saleem, H., et al. (2026). Biogenic Fe2O3 nanoparticles enhance carotenoid pathway gene expression and suppress verticillium root rot in marigold (Tagetes erecta). BMC Plant Biology, 26, 1091. doi:10.1186/s12870-026-08901-3',
      'Klosterman, S. J., Atallah, Z. K., Vallad, G. E., & Subbarao, K. V. (2009). Diversity, pathogenicity, and management of Verticillium species. Annual Review of Phytopathology, 47, 39–62. doi:10.1146/annurev-phyto-080508-081748',
      'Kennedy, D. M. (1987). Verticillium wilt of sea buckthorn (Hippophae rhamnoides). Plant Pathology, 36(3), 420–422. doi:10.1111/j.1365-3059.1987.tb02257.x',
      'Harada, Y., Furueda, T., & Murata, K. (1997). Verticillium wilt of Tilia japonica and Acer palmatum, the first report on the occurrence of Verticillium dahliae on trees in Japan. Japanese Journal of Phytopathology, 63(4), 345–350. doi:10.3186/jjphytopath.63.345'
    ],
    spatialAdvice: {
      de: 'Keine Verticillium-Wirte in den Wurzelbereich von Sanddorn oder Linde pflanzen. Die 3 m Abstand sind ein vorsorglicher Planungswert, keine gemessene Grenze.',
      en: 'Keep Verticillium hosts out of the root zone of sea buckthorn or linden. The 3 m distance is a precautionary planning value, not a measured limit.'
    }
  },
  {
    id: 'internal-plantain-rosy-apple-aphid',
    kind: 'INTERNAL',
    severity: 'WARNING',
    starTreeIds: ['tree-apple'],
    hostPlantIds: ['plant-ribwort-plantain'],
    hostStarIds: [],
    safeDistanceM: 20,
    antagonistName: { de: 'Spitzwegerich', en: 'Ribwort Plantain' },
    antagonistBotanical: 'Plantago lanceolata',
    title: {
      de: 'Sommerwirt der Mehligen Apfelblattlaus (Dysaphis plantaginea)',
      en: 'Summer Host of the Rosy Apple Aphid (Dysaphis plantaginea)'
    },
    mechanism: {
      de: 'Die Mehlige Apfelblattlaus wechselt den Wirt: Sie überwintert als Ei am Apfelbaum, die Frühjahrsgenerationen saugen am Apfel, und im Frühsommer fliegen geflügelte Läuse auf Spitzwegerich ab, wo sie den Sommer verbringen; im Herbst kehren die Geschlechtstiere zur Eiablage auf den Apfel zurück. Spitzwegerich ist ihr Sommerwirt und kann so Läuse für den Rückflug in benachbarte Apfelbäume liefern.',
      en: 'The rosy apple aphid alternates hosts: it overwinters as eggs on apple, the spring generations feed on apple, and in early summer winged aphids migrate to ribwort plantain, where they spend the summer; in autumn the sexual forms fly back to apple to lay eggs. Ribwort plantain is its summer host and can therefore supply aphids for the return flight to nearby apple trees.'
    },
    scientificCitations: [
      'Blommers, L. H. M., Helsen, H. H. M., & Vaal, F. W. N. M. (2004). Life history data of the rosy apple aphid Dysaphis plantaginea (Pass.) (Homopt., Aphididae) on plantain and as migrant to apple. Journal of Pest Science, 77(3), 155–163. doi:10.1007/s10340-004-0046-5'
    ],
    spatialAdvice: {
      de: 'Keinen Spitzwegerich in die Apfelgilde setzen. Die 20 m Abstand sind ein vorsorglicher Planungswert, keine gemessene Grenze.',
      en: 'Keep ribwort plantain out of apple guilds. The 20 m distance is a precautionary planning value, not a measured limit.'
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
      de: 'Gelbe Lupine (Lupinus luteus) ist ein Wirt von Phytophthora cinnamomi: In spanischen Eichen-Weiden wurde der Erreger aus Wurzeln welkender Lupinen isoliert, und die Autoren sehen die Lupine als mögliches Infektionsreservoir für Baumwurzeln. Für andere Lupinenarten ist das nicht geprüft. P. cinnamomi verursacht die Tintenkrankheit, gegen die die Europäische Esskastanie kaum resistent ist.',
      en: 'Yellow lupine (Lupinus luteus) is a host of Phytophthora cinnamomi: in Spanish oak rangelands the pathogen was isolated from roots of wilting lupines, and the authors see lupine as a possible inoculum reservoir for tree roots. Other lupine species are untested. P. cinnamomi causes ink disease, to which European sweet chestnut has little or no resistance.'
    },
    scientificCitations: [
      'Serrano, M. S., et al. (2010). Lupinus luteus, a new host of Phytophthora cinnamomi in Spanish oak-rangeland ecosystems. European Journal of Plant Pathology, 128(2), 149–152. doi:10.1007/s10658-010-9652-7',
      'Santos, C., et al. (2017). First interspecific genetic linkage map for Castanea sativa x Castanea crenata revealed QTLs for resistance to Phytophthora cinnamomi. PLoS ONE, 12(9), e0184381. doi:10.1371/journal.pone.0184381'
    ],
    spatialAdvice: {
      de: 'Vorsorglich Lupinen nicht direkt an den Kastanienstamm pflanzen, besonders auf nassen oder verdichteten Böden. Die 5 m Abstand sind ein vorsorglicher Planungswert, keine gemessene Grenze.',
      en: 'As a precaution, do not plant lupines right next to the chestnut trunk, especially on wet or compacted soils. The 5 m distance is a precautionary planning value, not a measured limit.'
    }
  },
  {
    id: 'external-dense-shade-tea-mosquito-bug',
    kind: 'EXTERNAL',
    severity: 'INFO',
    starTreeIds: ['tree-tea-assamica'],
    hostPlantIds: ['plant-nepal-alder', 'plant-albizia', 'plant-gliricidia'],
    hostStarIds: [],
    safeDistanceM: 3,
    antagonistName: { de: 'Dichter Schatten durch Schattenbäume', en: 'Dense shade from shade trees' },
    antagonistBotanical: 'Alnus nepalensis, Albizia chinensis, Gliricidia sepium',
    title: {
      de: 'Teewanze (Helopeltis theivora): Schatten nicht zu dicht werden lassen',
      en: 'Tea Mosquito Bug (Helopeltis theivora): Keep the Shade Light'
    },
    mechanism: {
      de: 'In einer Feldbeobachtung auf Hainan (China) hatte eine großblättrige Teepflanzung unter dichtem Regenwald-Kronendach (etwa 20 % Licht) mehr Fraßschäden der Teewanze als Pflanzungen unter mittlerem Schatten durch Betelnusspalmen (etwa 50 % Licht) oder ohne Schatten (72, 60 und 49 befallene Triebe pro 100). Untersucht wurde nur je eine Pflanzung pro Schattenstufe in einem Monat, und die Schattenbäume waren andere Arten; der Befund ist daher eine Korrelation, kein Nachweis, dass Schattenbäume den Befall verursachen. Mäßiger Schatten bleibt empfohlen: In Yunnan steigerten zwischengepflanzte Erlen den Ertrag von Assam-Tee um 50–72 %, und Schatten erhöht den Theaningehalt der Triebe.',
      en: 'In a field survey on Hainan (China), a large-leaf tea plantation under dense rainforest canopy (about 20 % light) had more tea mosquito bug feeding damage than plantations under medium shade from areca palms (about 50 % light) or without shade (72, 60 and 49 damaged shoots per 100). Only one plantation per shade level was surveyed in a single month, and the shade trees were other species, so this is a correlation, not proof that shade trees cause infestation. Moderate shade remains recommended: in Yunnan, interplanted alders raised Assam tea yield by 50–72 %, and shade raises the theanine content of the shoots.'
    },
    scientificCitations: [
      'Yao, Q., Lin, Y., Qin, S., Lin, Z., & Ji, X. (2025). Characterization of feeding damage by tea mosquito bug, Helopeltis theivora Waterhouse (Hemiptera: Miridae) on Hainan Dayezhong tea cultivar. Frontiers in Plant Science, 15, 1529535. doi:10.3389/fpls.2024.1529535',
      'Mortimer, P. E., Gui, H., Xu, J., Zhang, C., Barrios, E., & Hyde, K. D. (2015). Alder trees enhance crop productivity and soil microbial biomass in tea plantations. Applied Soil Ecology, 96, 25–32. doi:10.1016/j.apsoil.2015.05.012',
      'Sano, T., Horie, H., Matsunaga, A., & Hirono, Y. (2018). Effect of shading intensity on morphological and color traits and on chemical components of new tea (Camellia sinensis L.) shoots under direct covering cultivation. Journal of the Science of Food and Agriculture, 98(15), 5666–5676. doi:10.1002/jsfa.9112'
    ],
    spatialAdvice: {
      de: 'Schattenbäume regelmäßig auslichten oder schneiteln, sodass etwa die Hälfte des Lichts oder mehr den Tee erreicht. Die 3 m Abstand sind ein vorsorglicher Planungswert, keine gemessene Grenze.',
      en: 'Lop or pollard shade trees regularly so that about half the light or more reaches the tea. The 3 m distance is a precautionary planning value, not a measured limit.'
    }
  }
];
