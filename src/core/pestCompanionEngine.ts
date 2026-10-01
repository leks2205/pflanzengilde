import { ClimateZone, Language, LocalizedString, GuildPlant, StarTree } from '../types/guild';
import { t } from '../i18n/translations';
import { GUILD_PLANTS } from '../data/guildPlants';

/**
 * Evidence tiers. Only the two strongest tiers may produce pest-defense badges;
 * 'promising' and 'folklore' claims live in PEST_RESEARCH_NOTES (guide text only).
 * - field-proven: several independent field trials, or one large multi-site field trial
 * - scientific:   one field trial measuring pest/damage, or a proven natural-enemy chain with field data
 * - promising:    extracts, lab/closed-chamber, other host or pest, extrapolated
 * - folklore:     no evidence found, or contradicted by trials
 */
export type EvidenceLevel = 'field-proven' | 'scientific' | 'promising' | 'folklore';
export type BadgeEvidenceLevel = Extract<EvidenceLevel, 'field-proven' | 'scientific'>;

export interface EvidenceCitation {
  label: string;
  doi?: string;
  url?: string;
}

export interface PestDefenseRule {
  id: string;
  ruleTitle: LocalizedString;
  keywords: string[];
  /** Restricts the rule to these star plants (evidence is host-specific). Omit = any star. */
  starTreeIds?: string[];
  evidence: BadgeEvidenceLevel;
  citations: EvidenceCitation[];
  companionPlantIds: string[];
  scientificMechanism: LocalizedString;
  companionRoles: Record<string, LocalizedString>;
}

export interface PestResearchNote {
  id: string;
  pest: LocalizedString;
  companions: LocalizedString;
  evidence: Extract<EvidenceLevel, 'promising' | 'folklore'>;
  note: LocalizedString;
  citations: EvidenceCitation[];
}

/** UI badge label for an evidence level, from the central string files. */
export const evidenceLabel = (level: EvidenceLevel, lang: Language): string => {
  const tr = t(lang);
  switch (level) {
    case 'field-proven': return tr.evidenceLevelFieldProven;
    case 'scientific': return tr.evidenceLevelScientific;
    case 'promising': return tr.evidenceLevelPromising;
    case 'folklore': return tr.evidenceLevelFolklore;
  }
};

export const citationHref = (c: EvidenceCitation): string | undefined =>
  c.doi ? `https://doi.org/${c.doi}` : c.url;

const ruleAppliesToTree = (rule: PestDefenseRule, starTreeId?: string): boolean =>
  !rule.starTreeIds || (!!starTreeId && rule.starTreeIds.includes(starTreeId));

const PLANT_ZONES = new Map(GUILD_PLANTS.map(p => [p.id, p.climateZones]));

const growsInZone = (plantId: string, zone?: ClimateZone): boolean =>
  !zone || !!PLANT_ZONES.get(plantId)?.includes(zone);

const CAHENZLI_2019: EvidenceCitation = {
  label: 'Cahenzli et al. 2019, Agric. Ecosyst. Environ. 278:43–53 (23 orchard blocks, 7 countries)',
  doi: '10.1016/j.agee.2019.03.011'
};
const HASANALIYEVA_2024: EvidenceCitation = {
  label: 'Hasanaliyeva et al. 2024, Front. Plant Sci. 15:1498848 (2 organic vineyards, 2 years)',
  doi: '10.3389/fpls.2024.1498848'
};

export const PEST_DEFENSE_RULES: PestDefenseRule[] = [
  // 1. Codling Moth (Cydia pomonella) – perennial native flower strips
  {
    id: 'rule-codling-moth-flower-strip',
    ruleTitle: {
      en: 'Codling Moth (Cydia pomonella)',
      de: 'Apfelwickler (Cydia pomonella)'
    },
    keywords: ['codling moth', 'apfelwickler', 'cydia pomonella'],
    starTreeIds: ['tree-apple', 'tree-quince'],
    evidence: 'field-proven',
    citations: [
      CAHENZLI_2019,
      { label: 'Mátray & Herz 2022, Biol. Control 171:104950 (lab: Ascogaster on flower diets)', doi: '10.1016/j.biocontrol.2022.104950' }
    ],
    companionPlantIds: ['plant-yarrow', 'plant-bugleweed', 'plant-wild-carrot'],
    scientificMechanism: {
      en: 'Species-rich perennial native flower strips sown in the orchard alleys were tested in 23 organic apple orchard blocks across 7 European countries. With flower strips, codling moth numbers fell more and fruit damage rose less than in control alleys. The flowers feed natural enemies such as the codling moth parasitoid Ascogaster quadridentata. The effect works for the mix as a whole and is modest: the authors stress it is not a stand-alone control, so combine it with other measures.',
      de: 'Artenreiche, mehrjährige Blühstreifen aus heimischen Wildblumen in den Fahrgassen wurden in 23 Bio-Apfelanlagen in 7 europäischen Ländern getestet. Mit Blühstreifen sank die Zahl der Apfelwickler stärker und die Fruchtschäden stiegen weniger als in Kontrollgassen. Die Blüten ernähren Nützlinge wie die Wickler-Schlupfwespe Ascogaster quadridentata. Die Wirkung gilt für die Mischung als Ganzes und ist moderat: Laut den Autoren ersetzt sie keine anderen Maßnahmen, sondern ergänzt sie.'
    },
    companionRoles: {
      'plant-yarrow': {
        en: 'Core species of the tested flower-strip mix. Its flat flower heads offer easy-to-reach nectar and pollen for parasitoid wasps and predators through the summer.',
        de: 'Kernart der getesteten Blühstreifen-Mischung. Ihre flachen Blütenstände bieten Schlupfwespen und Räubern den ganzen Sommer leicht erreichbaren Nektar und Pollen.'
      },
      'plant-bugleweed': {
        en: 'Part of the tested flower-strip mix. Flowers early in spring, feeding natural enemies before the first codling moth generation.',
        de: 'Teil der getesteten Blühstreifen-Mischung. Blüht früh im Frühjahr und ernährt Nützlinge schon vor der ersten Wicklergeneration.'
      },
      'plant-wild-carrot': {
        en: 'Part of the tested flower-strip mix. In the lab, wild carrot flowers more than doubled the survival of the codling moth parasitoid Ascogaster quadridentata.',
        de: 'Teil der getesteten Blühstreifen-Mischung. Im Labor verdoppelten Möhrenblüten die Lebensdauer der Wickler-Schlupfwespe Ascogaster quadridentata mehr als.'
      }
    }
  },

  // 2. Woolly Apple Aphid (Eriosoma lanigerum) – sweet alyssum
  {
    id: 'rule-woolly-aphid',
    ruleTitle: {
      en: 'Woolly Apple Aphid (Eriosoma lanigerum)',
      de: 'Blutlaus (Eriosoma lanigerum)'
    },
    keywords: ['woolly aphid', 'blutlaus', 'blutläuse', 'eriosoma'],
    starTreeIds: ['tree-apple'],
    evidence: 'scientific',
    citations: [
      { label: 'Gontijo, Beers & Snyder 2013, Biol. Control 66:8–15 (2 field experiments, Washington State)', doi: '10.1016/j.biocontrol.2013.03.007' },
      { label: 'Contradicting: Markó et al. 2013, Biocontrol Sci. Technol. 23:126–145 (6-year trial, mixed flowering alleys)', doi: '10.1080/09583157.2012.743972' }
    ],
    companionPlantIds: ['plant-sweet-alyssum'],
    scientificMechanism: {
      en: 'In two field experiments, apple trees next to sweet alyssum had significantly fewer woolly apple aphids within a week, and the difference lasted several weeks. Spiders and predatory bugs increased, and marking showed them moving from the alyssum into the trees. Caution: in a 6-year Hungarian trial, mixed flowering alleys increased woolly aphid, so the evidence is specific to alyssum and still contested.',
      de: 'In zwei Feldexperimenten hatten Apfelbäume neben Duftsteinrich schon nach einer Woche deutlich weniger Blutläuse, und der Unterschied hielt mehrere Wochen an. Spinnen und Raubwanzen nahmen zu, und Markierungen zeigten, dass sie vom Duftsteinrich in die Bäume wanderten. Vorsicht: In einem 6-jährigen ungarischen Versuch erhöhten gemischte Blühgassen den Blutlausbefall; der Beleg gilt also speziell für Duftsteinrich und ist noch umstritten.'
    },
    companionRoles: {
      'plant-sweet-alyssum': {
        en: 'Its long-flowering, open blossoms feed spiders, predatory bugs and parasitoids, which moved from the alyssum into the apple trees and reduced woolly aphid colonies.',
        de: 'Die lange blühenden, offenen Blüten ernähren Spinnen, Raubwanzen und Schlupfwespen, die vom Duftsteinrich in die Apfelbäume wanderten und die Blutlauskolonien verringerten.'
      }
    }
  },

  // 3. Peach Brown Rot (Monilinia spp.) – white clover in the tree row
  {
    id: 'rule-peach-brown-rot',
    ruleTitle: {
      en: 'Peach Brown Rot (Monilinia spp.)',
      de: 'Monilia-Fruchtfäule am Pfirsich (Monilinia spp.)'
    },
    keywords: ['brown rot', 'monilia-fruchtfäule', 'monilinia'],
    starTreeIds: ['tree-peach'],
    evidence: 'scientific',
    citations: [
      { label: 'Bussi et al. 2016, Crop Prot. 88:37–44 (4-year field trial, INRAE)', doi: '10.1016/j.cropro.2016.05.010' }
    ],
    companionPlantIds: ['plant-white-clover'],
    scientificMechanism: {
      en: 'In a 4-year INRAE field trial, peaches with a white clover cover in the tree row had less brown rot on the fruit than peaches on herbicide-bare soil. The clover takes up soil water after heavy rain, so fewer micro-cracks form in the fruit skin, which is where the fungus gets in. The effect was strongest together with reduced irrigation. It concerns fruit rot, not blossom blight; still remove mummified fruit.',
      de: 'In einem 4-jährigen INRAE-Feldversuch hatten Pfirsiche mit Weißklee-Unterwuchs im Baumstreifen weniger Monilia-Fruchtfäule als Pfirsiche auf mit Herbizid freigehaltenem Boden. Der Klee nimmt nach Starkregen Bodenwasser auf, sodass sich weniger Mikrorisse in der Fruchthaut bilden – dort dringt der Pilz ein. Am stärksten war die Wirkung zusammen mit reduzierter Bewässerung. Sie betrifft die Fruchtfäule, nicht die Blütenmonilia; Fruchtmumien trotzdem entfernen.'
    },
    companionRoles: {
      'plant-white-clover': {
        en: 'As a living cover in the tree row it competes for soil water after rain, reducing the fruit cracking that lets brown rot in.',
        de: 'Als lebende Bodendecke im Baumstreifen konkurriert er nach Regen um Bodenwasser und verringert so die Fruchtrisse, über die Monilia eindringt.'
      }
    }
  },

  // 4. Grapevine Downy Mildew (Plasmopara viticola) – permanent cover as splash barrier
  {
    id: 'rule-grape-downy-mildew',
    ruleTitle: {
      en: 'Grapevine Downy Mildew (Plasmopara viticola)',
      de: 'Falscher Mehltau der Rebe (Plasmopara viticola)'
    },
    keywords: ['plasmopara', 'downy mildew', 'falscher mehltau'],
    starTreeIds: ['vine-grape'],
    evidence: 'scientific',
    citations: [HASANALIYEVA_2024],
    companionPlantIds: ['plant-white-clover', 'plant-sainfoin'],
    scientificMechanism: {
      en: 'A permanent living ground cover under the vines (tested: perennial ryegrass 48 %, sainfoin 43 %, white clover 9 %) cut the rain-splash droplets escaping the soil by 75–95 %. In two organic vineyards over two years it delayed downy mildew epidemics by 2–4 weeks and reduced disease by up to over 90 % in unsprayed plots. The effect comes from the dense cover layer as a whole, not from one species.',
      de: 'Eine dauerhafte lebende Begrünung unter den Reben (getestet: Deutsches Weidelgras 48 %, Esparsette 43 %, Weißklee 9 %) verringerte die aus dem Boden spritzenden Regentropfen um 75–95 %. In zwei Bio-Weinbergen über zwei Jahre verzögerte sie Falschen Mehltau um 2–4 Wochen und senkte den Befall in unbehandelten Parzellen um bis zu über 90 %. Die Wirkung kommt von der dichten Pflanzendecke als Ganzes, nicht von einer einzelnen Art.'
    },
    companionRoles: {
      'plant-white-clover': {
        en: 'Low part of the tested cover mix. Keeps the soil covered all year so rain cannot splash overwintering spores up onto the leaves.',
        de: 'Niedriger Teil der getesteten Begrünungsmischung. Hält den Boden ganzjährig bedeckt, sodass Regen keine überwinternden Sporen auf die Blätter spritzt.'
      },
      'plant-sainfoin': {
        en: 'Main legume of the tested cover mix (43 %). Its dense foliage intercepts rain splash from the soil surface.',
        de: 'Hauptleguminose der getesteten Begrünungsmischung (43 %). Ihr dichtes Laub fängt Spritzwasser von der Bodenoberfläche ab.'
      }
    }
  },

  // 5. Grapevine Powdery Mildew (Erysiphe necator) – same permanent cover
  {
    id: 'rule-grape-powdery-mildew',
    ruleTitle: {
      en: 'Grapevine Powdery Mildew (Erysiphe necator)',
      de: 'Echter Mehltau der Rebe (Erysiphe necator)'
    },
    keywords: ['erysiphe necator', 'powdery mildew', 'echter mehltau'],
    starTreeIds: ['vine-grape'],
    evidence: 'scientific',
    citations: [HASANALIYEVA_2024],
    companionPlantIds: ['plant-white-clover', 'plant-sainfoin'],
    scientificMechanism: {
      en: 'In the same vineyard trial, the permanent ground cover also delayed powdery mildew epidemics and reduced severity by up to over 90 % in unsprayed plots. Results varied by site and year, and infected bark remains the main source of the fungus, so keep up normal hygiene.',
      de: 'Im selben Weinbergversuch verzögerte die dauerhafte Begrünung auch den Echten Mehltau und senkte den Befall in unbehandelten Parzellen um bis zu über 90 %. Die Ergebnisse schwankten je nach Standort und Jahr, und befallene Rinde bleibt die Hauptquelle des Pilzes – normale Hygiene also beibehalten.'
    },
    companionRoles: {
      'plant-white-clover': {
        en: 'Low part of the tested cover mix that keeps the soil permanently covered.',
        de: 'Niedriger Teil der getesteten Begrünungsmischung, der den Boden dauerhaft bedeckt.'
      },
      'plant-sainfoin': {
        en: 'Main legume of the tested cover mix; its dense stand makes up much of the protective cover layer.',
        de: 'Hauptleguminose der getesteten Begrünungsmischung; ihr dichter Bestand bildet einen Großteil der schützenden Pflanzendecke.'
      }
    }
  },

  // 6. European Grapevine Moth (Lobesia botrana) – permanent ground vegetation
  {
    id: 'rule-lobesia-botrana',
    ruleTitle: {
      en: 'European Grapevine Moth (Lobesia botrana)',
      de: 'Bekreuzter Traubenwickler (Lobesia botrana)'
    },
    keywords: ['lobesia', 'grapevine moth', 'traubenwickler'],
    starTreeIds: ['vine-grape'],
    evidence: 'scientific',
    citations: [
      { label: 'Tortosa et al. 2025, Ecol. Appl. 35:e70045 (38 vineyards)', doi: '10.1002/eap.70045' },
      { label: 'Carlos et al. 2022, Bull. Entomol. Res. 112:697–706 (parasitism survey 2002–2015)', doi: '10.1017/S0007485322000116' },
      { label: 'Reiff et al. 2021, Insects 12:220 (pupal predation)', doi: '10.3390/insects12030220' }
    ],
    companionPlantIds: ['plant-white-clover', 'plant-sainfoin'],
    scientificMechanism: {
      en: 'Across 38 vineyards, berry damage by the grapevine moth fell as the share of ground vegetation between the rows rose. Vineyards with ground cover also had more parasitised caterpillars, and ground vegetation raised predation of the pupae. The evidence is correlational: it supports keeping the inter-row permanently green, not any single species. Sown Phacelia or buckwheat alone did not raise parasitism.',
      de: 'In 38 Weinbergen sanken die Beerenschäden durch den Traubenwickler, je größer der Anteil an Bodenvegetation zwischen den Reihen war. Weinberge mit Begrünung hatten auch mehr parasitierte Raupen, und Bodenvegetation erhöhte den Fraß an den Puppen. Der Beleg ist korrelativ: Er spricht für eine dauerhaft grüne Fahrgasse, nicht für eine einzelne Art. Gesäte Phacelia oder Buchweizen allein erhöhten die Parasitierung nicht.'
    },
    companionRoles: {
      'plant-white-clover': {
        en: 'Keeps the inter-row permanently green, providing shelter for the ground predators that eat grapevine moth pupae.',
        de: 'Hält die Fahrgasse dauerhaft grün und bietet Bodenräubern Unterschlupf, die Traubenwickler-Puppen fressen.'
      },
      'plant-sainfoin': {
        en: 'Perennial flowering part of the permanent sward that supports parasitoids and ground predators.',
        de: 'Mehrjähriger, blühender Teil der Dauerbegrünung, der Schlupfwespen und Bodenräuber fördert.'
      }
    }
  },

  // 7. Tea Green Leafhopper (Empoasca onukii) – sicklepod intercrop
  {
    id: 'rule-tea-green-leafhopper',
    ruleTitle: {
      en: 'Tea Green Leafhopper (Empoasca onukii)',
      de: 'Grüne Teezikade (Empoasca onukii)'
    },
    keywords: ['empoasca', 'tea green leafhopper', 'teezikade'],
    starTreeIds: ['tree-tea-sinensis', 'tree-tea-assamica'],
    evidence: 'field-proven',
    citations: [
      { label: 'Zhang Z. et al. 2014, Phytoparasitica 42:595–607 (field intercrop)', doi: '10.1007/s12600-014-0400-y' },
      { label: 'Zhang Z.-Q. et al. 2017, J. Pest Sci. 90:227–237 (field, 2 seasons, 4 plants compared)', doi: '10.1007/s10340-016-0783-2' }
    ],
    companionPlantIds: ['plant-sicklepod'],
    scientificMechanism: {
      en: 'Two independent field studies in Chinese tea gardens found markedly fewer tea green leafhoppers where tea was intercropped with sicklepod (Senna tora), plus more natural enemies such as spiders. Sicklepod volatiles repel the leafhopper in choice tests. Sicklepod is a warm-season annual, so this only works on subtropical or very warm sites.',
      de: 'Zwei unabhängige Feldstudien in chinesischen Teegärten fanden deutlich weniger Grüne Teezikaden, wo Tee mit Sichelhülse (Senna tora) im Mischanbau stand, dazu mehr Nützlinge wie Spinnen. Duftstoffe der Sichelhülse wehren die Zikade in Wahlversuchen ab. Die Sichelhülse ist eine wärmeliebende Einjährige; das funktioniert daher nur an subtropischen oder sehr warmen Standorten.'
    },
    companionRoles: {
      'plant-sicklepod': {
        en: 'Its volatiles repel the leafhopper, and the intercrop harbours spiders and other predators that move into the tea rows.',
        de: 'Ihre Duftstoffe wehren die Zikade ab, und der Mischanbau beherbergt Spinnen und andere Räuber, die in die Teereihen wandern.'
      }
    }
  },

  // 8. Tea Geometrid (Ectropis obliqua) – rosemary intercrop
  {
    id: 'rule-tea-geometrid',
    ruleTitle: {
      en: 'Tea Geometrid (Ectropis obliqua)',
      de: 'Teespanner (Ectropis obliqua)'
    },
    keywords: ['ectropis', 'tea geometrid', 'teespanner'],
    starTreeIds: ['tree-tea-sinensis', 'tree-tea-assamica'],
    evidence: 'scientific',
    citations: [
      { label: 'Zhang Z. et al. 2013, J. Chem. Ecol. 39:1284–1296 (volatiles + field intercrop)', doi: '10.1007/s10886-013-0344-6' },
      { label: 'Zhang Z. et al. 2015, Pest Manag. Sci. 71:96–104 (lab: repellent compounds)', doi: '10.1002/ps.3771' }
    ],
    companionPlantIds: ['plant-rosemary'],
    scientificMechanism: {
      en: 'Rosemary volatiles repel the tea geometrid moth, and a field intercrop of tea with rosemary suppressed geometrid infestations. Caution: rosemary prefers neutral to alkaline, dry soil, while tea needs pH 4.5–5.8. Plant rosemary in a raised, limed edge strip rather than in the acidic tea bed; the builder flags the pH conflict when they share a root zone.',
      de: 'Duftstoffe des Rosmarins wehren den Teespanner ab, und ein Mischanbau von Tee mit Rosmarin unterdrückte den Befall im Feld. Vorsicht: Rosmarin bevorzugt neutralen bis kalkhaltigen, trockenen Boden, Tee braucht pH 4,5–5,8. Rosmarin daher in einem erhöhten, gekalkten Randstreifen statt im sauren Teebeet pflanzen; der Planer meldet den pH-Konflikt, wenn beide denselben Wurzelraum teilen.'
    },
    companionRoles: {
      'plant-rosemary': {
        en: 'Releases volatiles that repel egg-laying tea geometrid moths; best planted in a separate limed edge strip.',
        de: 'Gibt Duftstoffe ab, die eiablegende Teespanner abwehren; am besten in einem separaten, gekalkten Randstreifen pflanzen.'
      }
    }
  },

  // 9. Tea Blister Blight (Exobasidium vexans) – soybean intercrop
  {
    id: 'rule-tea-blister-blight',
    ruleTitle: {
      en: 'Tea Blister Blight (Exobasidium vexans)',
      de: 'Tee-Blasenrost (Exobasidium vexans)'
    },
    keywords: ['exobasidium', 'blister blight', 'blasenrost'],
    starTreeIds: ['tree-tea-sinensis'],
    evidence: 'scientific',
    citations: [
      { label: 'Shao et al. 2026, Ind. Crops Prod. 251:124159 (single study)', doi: '10.1016/j.indcrop.2026.124159' }
    ],
    companionPlantIds: ['plant-soybean'],
    scientificMechanism: {
      en: 'A tea–soybean intercrop lowered the blister blight disease index by about 79 % and anthracnose by about 67 % compared with tea alone, and raised tea yield. Leaves in the intercrop carried more Pseudomonas bacteria, which are linked to disease suppression. This is a single study, so treat it as a promising lead to confirm.',
      de: 'Ein Tee-Soja-Mischanbau senkte den Befallsindex des Blasenrosts um etwa 79 % und Anthraknose um etwa 67 % gegenüber reinem Tee und steigerte den Teeertrag. Die Blätter im Mischanbau trugen mehr Pseudomonas-Bakterien, die mit Krankheitsunterdrückung in Verbindung stehen. Es ist eine Einzelstudie und sollte noch bestätigt werden.'
    },
    companionRoles: {
      'plant-soybean': {
        en: 'Intercropped between tea rows, it shifted the tea leaf microbiome towards disease-suppressing Pseudomonas and reduced blister blight.',
        de: 'Zwischen den Teereihen angebaut, verschob sie das Blatt-Mikrobiom des Tees hin zu krankheitsunterdrückenden Pseudomonas und verringerte den Blasenrost.'
      }
    }
  }
];

/**
 * Companion claims that did NOT reach field-trial evidence. Rendered in the pest guide's
 * "Evidence check" section only – never as pest-defense badges.
 */
export const PEST_RESEARCH_NOTES: PestResearchNote[] = [
  {
    id: 'note-codling-moth-extracts',
    pest: { en: 'Codling moth', de: 'Apfelwickler' },
    companions: { en: 'Tansy, wormwood, fennel', de: 'Rainfarn, Wermut, Fenchel' },
    evidence: 'promising',
    note: {
      en: 'Tansy and wormwood extracts deter young codling moth caterpillars from entering fruit in the lab, but nobody has shown that growing the plants protects trees. Fennel only fits by analogy with other umbellifers in lab tests.',
      de: 'Extrakte aus Rainfarn und Wermut halten junge Apfelwickler-Raupen im Labor vom Einbohren ab, aber niemand hat gezeigt, dass die lebenden Pflanzen Bäume schützen. Fenchel passt nur in Analogie zu anderen Doldenblütlern aus Laborversuchen.'
    },
    citations: [
      { label: 'Pszczolkowski 2023, Agriculture 13:311 (review of extract studies)', doi: '10.3390/agriculture13020311' },
      { label: 'Mátray & Herz 2022, Biol. Control 171:104950 (lab)', doi: '10.1016/j.biocontrol.2022.104950' }
    ]
  },
  {
    id: 'note-codling-moth-folklore',
    pest: { en: 'Codling moth', de: 'Apfelwickler' },
    companions: { en: 'Lavender, southernwood, French marigold', de: 'Lavendel, Eberraute, Studentenblume' },
    evidence: 'folklore',
    note: {
      en: 'No study of any kind found for lavender or southernwood. In a factorial field trial, French marigold under apple did not reduce codling moth or fruit damage and even lowered natural enemies.',
      de: 'Für Lavendel und Eberraute wurde keinerlei Studie gefunden. In einem Feldversuch senkte Studentenblume unter Apfel weder Apfelwickler noch Fruchtschäden und verringerte sogar die Nützlinge.'
    },
    citations: [{ label: 'Laffon et al. 2022, Insects 13:908', doi: '10.3390/insects13100908' }]
  },
  {
    id: 'note-codling-moth-walnut',
    pest: { en: 'Codling moth on walnut', de: 'Apfelwickler an Walnuss' },
    companions: { en: 'Flower strips (yarrow, bugleweed, wild carrot)', de: 'Blühstreifen (Schafgarbe, Kriechender Günsel, Wilde Möhre)' },
    evidence: 'promising',
    note: {
      en: 'The flower-strip trial was run in apple orchards only. It will probably also help walnut, but that has not been tested.',
      de: 'Der Blühstreifen-Versuch lief nur in Apfelanlagen. Wahrscheinlich hilft er auch bei Walnuss, getestet ist das aber nicht.'
    },
    citations: [{ label: 'Cahenzli et al. 2019, Agric. Ecosyst. Environ. 278:43–53', doi: '10.1016/j.agee.2019.03.011' }]
  },
  {
    id: 'note-apple-scab',
    pest: { en: 'Apple scab', de: 'Apfelschorf' },
    companions: { en: 'Chives, garlic, willow, meadowsweet', de: 'Schnittlauch, Knoblauch, Weide, Mädesüß' },
    evidence: 'folklore',
    note: {
      en: 'No evidence that living plants reduce scab – not even for garlic extract in orchards. What does work is removing or breaking down fallen leaves, where the fungus overwinters. Cover-crop mulch raised earthworm numbers, which speeds up leaf breakdown (scab itself was not measured).',
      de: 'Kein Beleg, dass lebende Pflanzen Schorf verringern – nicht einmal für Knoblauchextrakt im Obstbau. Was hilft, ist das Entfernen oder schnelle Zersetzen des Falllaubs, in dem der Pilz überwintert. Mulch aus Begrünungsschnitt erhöhte die Zahl der Regenwürmer, die das Laub schneller abbauen (Schorf selbst wurde nicht gemessen).'
    },
    citations: [{ label: 'Webber et al. 2022, Appl. Soil Ecol. 178:104569', doi: '10.1016/j.apsoil.2022.104569' }]
  },
  {
    id: 'note-woolly-aphid-nasturtium',
    pest: { en: 'Woolly apple aphid', de: 'Blutlaus' },
    companions: { en: 'Nasturtium', de: 'Kapuzinerkresse' },
    evidence: 'folklore',
    note: {
      en: 'No study found. Mixed flowering alleys even increased woolly aphid in a 6-year trial. Earwigs are proven woolly aphid predators: hang pots stuffed with wood wool or cardboard in the trees.',
      de: 'Keine Studie gefunden. Gemischte Blühgassen erhöhten den Blutlausbefall in einem 6-jährigen Versuch sogar. Ohrwürmer fressen Blutläuse nachweislich: Mit Holzwolle oder Pappe gefüllte Töpfe in die Bäume hängen.'
    },
    citations: [
      { label: 'Markó et al. 2013, Biocontrol Sci. Technol. 23:126–145', doi: '10.1080/09583157.2012.743972' },
      { label: 'Alins et al. 2023, Insects 14:890 (earwig releases)', doi: '10.3390/insects14110890' }
    ]
  },
  {
    id: 'note-aphids-single-plants',
    pest: { en: 'Aphids (fruit trees, currants, hemp, linden, elder)', de: 'Blattläuse (Obstbäume, Johannisbeeren, Hanf, Linde, Holunder)' },
    companions: { en: 'Yarrow, fennel, stinging nettle, catmint', de: 'Schafgarbe, Fenchel, Brennnessel, Katzenminze' },
    evidence: 'promising',
    note: {
      en: 'Mixed perennial flower margins reduced rosy apple aphid damage in apple (trees with damaged fruit fell from 80 % to 48 %), but no single plant has been tested on its own. Nettle feeds early aphid enemies, and fennel aphids fed ladybirds in cotton, but aphids on the crop were not measured. Catmint only has lab data for its pure compound.',
      de: 'Gemischte mehrjährige Blühsäume verringerten Schäden durch die Mehlige Apfelblattlaus (Bäume mit geschädigten Früchten sanken von 80 % auf 48 %), aber keine Einzelpflanze wurde allein getestet. Brennnesseln ernähren frühe Blattlausfeinde, und Fenchel-Blattläuse ernährten Marienkäfer in Baumwolle, doch die Blattläuse an der Kultur wurden nicht gemessen. Für Katzenminze gibt es nur Labordaten zum Reinstoff.'
    },
    citations: [
      { label: 'Howard et al. 2024, J. Appl. Ecol. 61:821–835', doi: '10.1111/1365-2664.14598' },
      { label: 'Baverstock et al. 2011, BioControl 56:215–223', doi: '10.1007/s10526-010-9330-x' },
      { label: 'Fernandes et al. 2015, PLoS ONE 10:e0131449', doi: '10.1371/journal.pone.0131449' }
    ]
  },
  {
    id: 'note-pear-psylla',
    pest: { en: 'Pear psylla', de: 'Birnenblattsauger' },
    companions: { en: 'Stinging nettle (promising); yarrow, fennel (no effect)', de: 'Brennnessel (vielversprechend); Schafgarbe, Fenchel (ohne Wirkung)' },
    evidence: 'promising',
    note: {
      en: 'Nettle patches are a known spring reservoir of the predatory bug Anthocoris nemoralis, and released Anthocoris cut psylla by 31–40 % in orchards – but no trial has measured whether nettle patches reduce psylla. An undersown flower mix raised anthocorids without reducing psylla significantly.',
      de: 'Brennnesselbestände sind ein bekanntes Frühjahrsreservoir der Raubwanze Anthocoris nemoralis, und freigelassene Anthocoris senkten den Blattsauger in Anlagen um 31–40 % – ob Brennnesseln den Blattsauger verringern, hat aber kein Versuch gemessen. Eine Blühmischung als Untersaat erhöhte die Raubwanzen, ohne den Blattsauger deutlich zu senken.'
    },
    citations: [
      { label: 'Hérard 1986, Agronomie 6:1–34', doi: '10.1051/agro:19860101' },
      { label: 'Sigsgaard et al. 2006, Biol. Control 39:87–95', doi: '10.1016/j.biocontrol.2006.02.008' },
      { label: 'Fitzgerald & Solomon 2004, Biocontrol Sci. Technol. 14:291–300', doi: '10.1080/09583150410001665178' }
    ]
  },
  {
    id: 'note-borers-alliums',
    pest: { en: 'Peach tree borer, currant clearwing', de: 'Pfirsichbaumbohrer, Johannisbeer-Glasflügler' },
    companions: { en: 'Chives, garlic, Welsh onion', de: 'Schnittlauch, Knoblauch, Winterheckenzwiebel' },
    evidence: 'folklore',
    note: {
      en: 'Only gardening-site claims, no trial. The peach tree borer (Synanthedon exitiosa) is a North American pest. Against the currant clearwing only pheromone mating disruption is documented; cut out and burn infested shoots.',
      de: 'Nur Behauptungen auf Gartenseiten, kein Versuch. Der Pfirsichbaumbohrer (Synanthedon exitiosa) ist ein nordamerikanischer Schädling. Gegen den Johannisbeer-Glasflügler ist nur die Pheromon-Verwirrung belegt; befallene Triebe herausschneiden und verbrennen.'
    },
    citations: []
  },
  {
    id: 'note-voles',
    pest: { en: 'Voles', de: 'Wühlmäuse' },
    companions: { en: 'Daffodil (promising); hyacinth, hellebore (folklore)', de: 'Narzisse (vielversprechend); Hyazinthe, Christrose (Volksweisheit)' },
    evidence: 'promising',
    note: {
      en: 'In feeding trials with captive voles, daffodil bulbs were resisted – so the bulbs themselves survive. Whether they protect neighbouring tree roots has never been tested. Nothing was found for hellebore. A wire root basket is the proven protection.',
      de: 'In Fütterungsversuchen mit Wühlmäusen wurden Narzissenzwiebeln gemieden – die Zwiebeln selbst überleben also. Ob sie benachbarte Baumwurzeln schützen, wurde nie getestet. Für die Christrose fand sich nichts. Ein Wurzelschutzkorb aus Draht ist der belegte Schutz.'
    },
    citations: [
      { label: 'Curtis et al. 2009, HortTechnology 19:499–503', doi: '10.21273/HORTTECH.19.3.499' },
      { label: 'Curtis et al. 2002, Crop Prot. 21:299–306', doi: '10.1016/S0261-2194(01)00101-6' }
    ]
  },
  {
    id: 'note-turf-grass',
    pest: { en: 'Turf grass competition', de: 'Konkurrenz durch Rasengräser' },
    companions: { en: 'Daffodil, chives, hosta', de: 'Narzisse, Schnittlauch, Funkie' },
    evidence: 'folklore',
    note: {
      en: 'Grass competition with young trees is well documented, but that a bulb or herb ring suppresses grass has only been claimed in permaculture literature, never measured. Mulch the tree basin instead.',
      de: 'Dass Gras mit jungen Bäumen konkurriert, ist gut belegt; dass ein Zwiebel- oder Kräuterring Gras unterdrückt, wird aber nur in der Permakultur-Literatur behauptet, nie gemessen. Stattdessen die Baumscheibe mulchen.'
    },
    citations: []
  },
  {
    id: 'note-nematodes',
    pest: { en: 'Root-knot nematodes (fig)', de: 'Wurzelgallenälchen (Feige)' },
    companions: { en: 'Marigold (promising); hemp (contradicted)', de: 'Studentenblume (vielversprechend); Hanf (widerlegt)' },
    evidence: 'promising',
    note: {
      en: 'Marigold works as a dense pre-plant or rotation cover crop in annual crops, not as a scattered companion under trees. Hemp is actually a good host of root-knot nematodes; only hemp extracts are nematicidal.',
      de: 'Studentenblumen wirken als dichte Vor- oder Zwischenfrucht in einjährigen Kulturen, nicht als vereinzelte Begleiter unter Bäumen. Hanf ist sogar ein guter Wirt für Wurzelgallenälchen; nur Hanfextrakte wirken nematizid.'
    },
    citations: [
      { label: 'Hooks et al. 2010, Appl. Soil Ecol. 46:307–320', doi: '10.1016/j.apsoil.2010.09.005' },
      { label: 'Coburn & Desaeger 2024, J. Nematol. 56:20240003', doi: '10.2478/jofnem-2024-0003' }
    ]
  },
  {
    id: 'note-spider-mites',
    pest: { en: 'Spider mites (grape, tea, linden)', de: 'Spinnmilben (Rebe, Tee, Linde)' },
    companions: { en: 'White clover, yarrow', de: 'Weißklee, Schafgarbe' },
    evidence: 'promising',
    note: {
      en: 'Vineyard ground covers raise predatory mites on the vines, but spider mites were not measured, and nothing exists for tea or linden. White clover is itself a spider mite host; in citrus, a grass cover controlled mites better than broadleaf cover. For linden, releasing predatory mites is the proven tool.',
      de: 'Weinbergbegrünungen erhöhen die Raubmilben an den Reben, Spinnmilben wurden aber nicht gemessen, und für Tee oder Linde gibt es nichts. Weißklee ist selbst ein Spinnmilbenwirt; in Zitrus kontrollierte eine Grasbegrünung Milben besser als breitblättrige Begrünung. Bei Linden ist das Freilassen von Raubmilben das belegte Mittel.'
    },
    citations: [
      { label: 'Aguilar-Fenollosa et al. 2011, Crop Prot. 30:1328–1333', doi: '10.1016/j.cropro.2011.05.011' },
      { label: 'Markó et al. 2012, Biocontrol Sci. Technol. (flowering alleys, apple mites)', doi: '10.1080/09583157.2011.642337' }
    ]
  },
  {
    id: 'note-downy-mildew-sage',
    pest: { en: 'Grapevine downy mildew', de: 'Falscher Mehltau der Rebe' },
    companions: { en: 'Sage', de: 'Salbei' },
    evidence: 'promising',
    note: {
      en: 'Grape leaves kept with sage in an airtight box for 24–48 h were less susceptible afterwards, and sage extracts work as sprays. No vineyard trial with living sage exists yet.',
      de: 'Rebblätter, die 24–48 Stunden mit Salbei in einer luftdichten Box standen, waren danach weniger anfällig, und Salbeiextrakte wirken als Spritzmittel. Einen Weinbergversuch mit lebendem Salbei gibt es noch nicht.'
    },
    citations: [{ label: 'Fittipaldi Broussard et al. 2026, Agronomy 16:201', doi: '10.3390/agronomy16020201' }]
  },
  {
    id: 'note-grey-mould',
    pest: { en: 'Grey mould (Botrytis)', de: 'Grauschimmel (Botrytis)' },
    companions: { en: 'Oregano (promising); chamomile, garlic, chives (folklore)', de: 'Oregano (vielversprechend); Kamille, Knoblauch, Schnittlauch (Volksweisheit)' },
    evidence: 'promising',
    note: {
      en: 'Oregano essential oil inhibits Botrytis in the lab and as a treatment, but living oregano plants have not been tested. Nothing was found for chamomile, garlic or chives. Airflow, thinning and removing infected material are what help.',
      de: 'Oreganoöl hemmt Botrytis im Labor und als Behandlung, lebende Oreganopflanzen wurden aber nicht getestet. Für Kamille, Knoblauch oder Schnittlauch fand sich nichts. Was hilft: Luftzirkulation, Auslichten und Entfernen befallener Teile.'
    },
    citations: []
  },
  {
    id: 'note-lace-bug',
    pest: { en: 'Rhododendron lace bug', de: 'Rhododendron-Netzwanze' },
    companions: { en: 'Layered planting (tree canopy + shrubs + groundcover)', de: 'Mehrschichtige Pflanzung (Baumkrone + Sträucher + Bodendecker)' },
    evidence: 'promising',
    note: {
      en: 'For the related azalea lace bug, structurally complex, layered gardens had far fewer lace bugs because spiders and other predators were more common. This has not been tested for the rhododendron lace bug. Sunny sites favour lace bugs.',
      de: 'Bei der verwandten Azaleen-Netzwanze hatten strukturreiche, mehrschichtige Gärten weit weniger Netzwanzen, weil Spinnen und andere Räuber häufiger waren. Für die Rhododendron-Netzwanze ist das nicht getestet. Sonnige Standorte begünstigen Netzwanzen.'
    },
    citations: [{ label: 'Shrewsbury & Raupp 2006, Ecol. Appl. 16:262–272', doi: '10.1890/04-1347' }]
  },
  {
    id: 'note-spotted-wing-drosophila',
    pest: { en: 'Spotted wing drosophila', de: 'Kirschessigfliege' },
    companions: { en: 'Peppermint', de: 'Pfefferminze' },
    evidence: 'promising',
    note: {
      en: 'Results conflict: one intercropping study reported benefits, while peppermint interplanted in strawberries did not reduce the fly. Keep elder away from cherries and blueberries – it is a major wild host. Fine insect netting and prompt harvesting work.',
      de: 'Die Ergebnisse widersprechen sich: Eine Mischanbau-Studie berichtete Vorteile, während Pfefferminze zwischen Erdbeeren die Fliege nicht verringerte. Holunder von Kirschen und Heidelbeeren fernhalten – er ist ein wichtiger Wildwirt. Feine Insektennetze und zügiges Ernten wirken.'
    },
    citations: [
      { label: 'Gowton et al. 2021, Front. Sustain. Food Syst. 5:700842', doi: '10.3389/fsufs.2021.700842' },
      { label: 'Renkema et al. 2020, Can. Entomol. 152', doi: '10.4039/tce.2020.34' }
    ]
  },
  {
    id: 'note-oriental-fruit-moth',
    pest: { en: 'Oriental fruit moth', de: 'Pfirsichwickler' },
    companions: { en: 'Chinese mint (Mentha haplocalyx)', de: 'Chinesische Minze (Mentha haplocalyx)' },
    evidence: 'promising',
    note: {
      en: 'Volatiles of Mentha haplocalyx repel the moth and lowered apple fruit infestation; the field design is not yet confirmed, and it is a different mint from peppermint.',
      de: 'Duftstoffe von Mentha haplocalyx wehren den Falter ab und senkten den Befall von Apfelfrüchten; das Versuchsdesign im Feld ist noch nicht bestätigt, und es ist eine andere Minze als die Pfefferminze.'
    },
    citations: [{ label: 'Zhang Y. et al. 2026, Crop Prot. 199:107430', doi: '10.1016/j.cropro.2025.107430' }]
  },
  {
    id: 'note-rhubarb-phytophthora',
    pest: { en: 'Rhubarb Phytophthora crown rot', de: 'Phytophthora-Wurzelhalsfäule am Rhabarber' },
    companions: { en: 'Fennel', de: 'Fenchel' },
    evidence: 'promising',
    note: {
      en: 'Fennel root terpenes reduced Phytophthora capsici in pepper fields – a different host and pathogen, and fennel is allelopathic. Drainage and planting crowns slightly raised are what protect rhubarb.',
      de: 'Terpene aus Fenchelwurzeln senkten Phytophthora capsici in Paprikafeldern – ein anderer Wirt und Erreger, und Fenchel ist allelopathisch. Rhabarber schützen Drainage und leicht erhöht gesetzte Wurzelstöcke.'
    },
    citations: [{ label: 'Yang et al. 2022, Front. Plant Sci. 13:890534', doi: '10.3389/fpls.2022.890534' }]
  },
  {
    id: 'note-walnut-anthracnose',
    pest: { en: 'Walnut anthracnose', de: 'Walnuss-Anthraknose' },
    companions: { en: 'Autumn olive', de: 'Schmalblättrige Ölweide' },
    evidence: 'promising',
    note: {
      en: 'Nitrogen fertiliser lowered anthracnose on black walnut; that a nitrogen-fixing companion does the same is only extension advice. Collect fallen leaves and thin for airflow.',
      de: 'Stickstoffdüngung senkte die Anthraknose an Schwarznuss; dass ein stickstoffbindender Begleiter dasselbe bewirkt, ist nur Beratungsempfehlung. Falllaub einsammeln und für Luftzirkulation auslichten.'
    },
    citations: [{ label: 'Neely 1981, Plant Dis. 65:580', doi: '10.1094/PD-65-580' }]
  }
];

export interface PestResolution {
  pestText: string;
  combatable: boolean;
  companionPlantIds: string[];
  scientificMechanism?: LocalizedString;
  ruleTitle?: LocalizedString;
  ruleId?: string;
  evidence?: BadgeEvidenceLevel;
  citations?: EvidenceCitation[];
}

/**
 * Whether a star plant's pest can be countered by catalog companions with field evidence.
 * With a climate zone, only companions that grow there count.
 */
export function resolvePestDefense(pestText: string, starTreeId?: string, zone?: ClimateZone): PestResolution {
  const lower = pestText.toLowerCase().trim();

  for (const rule of PEST_DEFENSE_RULES) {
    if (!ruleAppliesToTree(rule, starTreeId)) continue;
    if (rule.keywords.some(k => lower.includes(k))) {
      const companionPlantIds = rule.companionPlantIds.filter(id => growsInZone(id, zone));
      if (companionPlantIds.length === 0) continue;
      return {
        pestText,
        combatable: true,
        companionPlantIds,
        scientificMechanism: rule.scientificMechanism,
        ruleTitle: rule.ruleTitle,
        ruleId: rule.id,
        evidence: rule.evidence,
        citations: rule.citations
      };
    }
  }

  return {
    pestText,
    combatable: false,
    companionPlantIds: []
  };
}

export interface CompanionPestDefenseDetail {
  pestText: LocalizedString;
  ruleTitle: LocalizedString;
  scientificMechanism: LocalizedString;
  companionRole: LocalizedString;
  evidence: BadgeEvidenceLevel;
  citations: EvidenceCitation[];
}

/** Evidence-backed pest defenses this companion provides against the star plant's pests. */
export function getCompanionPestDefenseForTree(
  companion: GuildPlant,
  starTree?: StarTree | null,
  zone?: ClimateZone
): CompanionPestDefenseDetail[] {
  if (!starTree || !starTree.vulnerabilities) {
    return [];
  }
  if (zone && !companion.climateZones.includes(zone)) {
    return [];
  }

  const results: CompanionPestDefenseDetail[] = [];
  const handledRuleIds = new Set<string>();

  const deList = starTree.vulnerabilities.de || [];
  const enList = starTree.vulnerabilities.en || [];
  const maxLen = Math.max(deList.length, enList.length);

  for (let i = 0; i < maxLen; i++) {
    const pestDe = deList[i] || enList[i] || '';
    const pestEn = enList[i] || deList[i] || '';

    const lowerDe = pestDe.toLowerCase();
    const lowerEn = pestEn.toLowerCase();

    for (const rule of PEST_DEFENSE_RULES) {
      if (handledRuleIds.has(rule.id)) continue;
      if (!ruleAppliesToTree(rule, starTree.id)) continue;

      const matches = rule.keywords.some(k => lowerDe.includes(k) || lowerEn.includes(k));
      if (matches && rule.companionPlantIds.includes(companion.id)) {
        handledRuleIds.add(rule.id);
        results.push({
          pestText: { de: pestDe, en: pestEn },
          ruleTitle: rule.ruleTitle,
          scientificMechanism: rule.scientificMechanism,
          companionRole: rule.companionRoles[companion.id] || rule.scientificMechanism,
          evidence: rule.evidence,
          citations: rule.citations
        });
      }
    }
  }

  return results;
}
