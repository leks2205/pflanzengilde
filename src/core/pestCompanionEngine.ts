import { ClimateZone, Language, LocalizedString, GuildPlant, StarTree } from '../types/guild';
import { t } from '../i18n/translations';
import { GUILD_PLANTS } from '../data/guildPlants';
import { STAR_TREES } from '../data/starTrees';
import { isCompatibleWithStar } from './compatibility';

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
  /**
   * Weaker tier for single companions added to a rule on less evidence than its main companions
   * (e.g. one field study). Omitted companions carry the rule's `evidence`.
   */
  companionEvidence?: Partial<Record<string, BadgeEvidenceLevel>>;
  scientificMechanism: LocalizedString;
  companionRoles: Record<string, LocalizedString>;
  /** Ids of related rules or research notes, linked as "See also" in the pest guide. */
  seeAlso?: string[];
}

export interface PestResearchNote {
  id: string;
  pest: LocalizedString;
  companions: LocalizedString;
  evidence: Extract<EvidenceLevel, 'promising' | 'folklore'>;
  note: LocalizedString;
  citations: EvidenceCitation[];
  /** Ids of related rules or research notes, linked as "See also" in the pest guide. */
  seeAlso?: string[];
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

const PLANTS_BY_ID = new Map(GUILD_PLANTS.map(p => [p.id, p]));

/** Companion may join the star's guild (compatibility.ts); unknown IDs pass. */
const fitsStar = (plantId: string, starTreeId?: string): boolean => {
  const star = starTreeId ? STAR_TREES.find(t => t.id === starTreeId) : undefined;
  const plant = PLANTS_BY_ID.get(plantId);
  return !star || !plant || isCompatibleWithStar(plant, star);
};

const companionEvidence = (rule: PestDefenseRule, plantId: string): BadgeEvidenceLevel =>
  rule.companionEvidence?.[plantId] ?? rule.evidence;

/** Strongest tier among the companions that count (e.g. those growing in the selected zone). */
const strongestEvidence = (rule: PestDefenseRule, plantIds: string[]): BadgeEvidenceLevel =>
  plantIds.some(id => companionEvidence(rule, id) === 'field-proven') ? 'field-proven' : 'scientific';

const CAHENZLI_2019: EvidenceCitation = {
  label: 'Cahenzli et al. 2019, Agric. Ecosyst. Environ. 278:43–53 (organic apple orchards in 7 European countries)',
  doi: '10.1016/j.agee.2019.03.011'
};
const JACOBSEN_2022: EvidenceCitation = {
  label: 'Jacobsen, Sørensen & Sigsgaard 2022, Crop Prot. 156:105962 (same strip design; species chosen for easily reached nectar and pollen)',
  doi: '10.1016/j.cropro.2022.105962'
};
const HASANALIYEVA_2024: EvidenceCitation = {
  label: 'Hasanaliyeva et al. 2024, Front. Plant Sci. 15:1498848 (2 organic vineyards, 2 years)',
  doi: '10.3389/fpls.2024.1498848'
};
const SUTTON_2000: EvidenceCitation = {
  label: 'Sutton, MacHardy & Lord 2000, Plant Dis. 84:1319–1326 (leaf-litter shredding)',
  doi: '10.1094/PDIS.2000.84.12.1319'
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
      JACOBSEN_2022,
      { label: 'Mátray & Herz 2022, Biol. Control 171:104950 (lab: Ascogaster on flower diets)', doi: '10.1016/j.biocontrol.2022.104950' }
    ],
    companionPlantIds: ['plant-yarrow', 'plant-bugleweed', 'plant-wild-carrot'],
    scientificMechanism: {
      en: 'Perennial flower strips of native wild flowers, sown in the alleys of organic apple orchards, were tested in 7 European countries over two years. In the flower-strip plots there were more natural enemies on the trees, codling moth numbers fell more than in control plots, and fruit damage was lower. In the lab, flowers of wild carrot and other umbellifers more than doubled the lifespan of the codling moth parasitoid Ascogaster quadridentata. The effect was shown for the flower mix as a whole, not for single species, so combine it with other measures.',
      de: 'Mehrjährige Blühstreifen aus heimischen Wildblumen in den Fahrgassen von Bio-Apfelanlagen wurden in 7 europäischen Ländern über zwei Jahre getestet. In den Blühstreifen-Parzellen saßen mehr Nützlinge auf den Bäumen, die Zahl der Apfelwickler sank stärker als in den Kontrollparzellen, und die Fruchtschäden waren geringer. Im Labor verlängerten Blüten der Wilden Möhre und anderer Doldenblütler die Lebensdauer der Wickler-Schlupfwespe Ascogaster quadridentata auf mehr als das Doppelte. Die Wirkung ist für die Blühmischung als Ganzes belegt, nicht für einzelne Arten – daher mit anderen Maßnahmen kombinieren.'
    },
    companionRoles: {
      'plant-yarrow': {
        en: 'Native perennial with flat flower heads and easily reached nectar and pollen – the kind of plant the tested strips were built from. The effect is proven for the mix, not for yarrow alone.',
        de: 'Heimische Staude mit flachen Blütenständen und leicht erreichbarem Nektar und Pollen – die Art von Pflanze, aus der die getesteten Streifen bestanden. Belegt ist die Wirkung für die Mischung, nicht für Schafgarbe allein.'
      },
      'plant-bugleweed': {
        en: 'Low native perennial that flowers in spring and adds early flowers to a perennial strip. The effect is proven for the mix, not for bugleweed alone.',
        de: 'Niedrige heimische Staude, die im Frühjahr blüht und einem Dauer-Blühstreifen frühe Blüten hinzufügt. Belegt ist die Wirkung für die Mischung, nicht für Günsel allein.'
      },
      'plant-wild-carrot': {
        en: 'Native umbellifer for perennial strips. In the lab, wild carrot flowers more than doubled the lifespan of the codling moth parasitoid Ascogaster quadridentata.',
        de: 'Heimischer Doldenblütler für Dauer-Blühstreifen. Im Labor verlängerten Möhrenblüten die Lebensdauer der Wickler-Schlupfwespe Ascogaster quadridentata auf mehr als das Doppelte.'
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
      en: 'In two field experiments in Washington State, apple trees next to flowering sweet alyssum had significantly fewer woolly apple aphids after one week, and the difference lasted several weeks. Generalist predators – spiders and predatory bugs – increased near the alyssum, and immunomarking showed natural enemies moving from the alyssum into the orchard. Caution: in a 6-year orchard trial, sown flowering alleys increased woolly aphid, so the evidence is specific to alyssum and still contested.',
      de: 'In zwei Feldexperimenten im US-Bundesstaat Washington hatten Apfelbäume neben blühendem Duftsteinrich schon nach einer Woche deutlich weniger Blutläuse, und der Unterschied hielt mehrere Wochen an. Generalistische Räuber – Spinnen und Raubwanzen – nahmen am Duftsteinrich zu, und Markierungen zeigten, dass Nützlinge vom Duftsteinrich in die Anlage wanderten. Vorsicht: In einem 6-jährigen Obstanlagen-Versuch erhöhten eingesäte Blühgassen den Blutlausbefall; der Beleg gilt also speziell für Duftsteinrich und ist noch umstritten.'
    },
    companionRoles: {
      'plant-sweet-alyssum': {
        en: 'Its flowers attracted natural enemies; spiders and predatory bugs increased nearby and moved into the apple trees, where woolly aphid densities fell.',
        de: 'Seine Blüten lockten Nützlinge an; Spinnen und Raubwanzen nahmen in der Nähe zu und wanderten in die Apfelbäume, wo die Blutlausdichte sank.'
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
      { label: 'Bussi et al. 2016, Crop Prot. 88:37–44 (4-year field trial, Rhône Valley, France)', doi: '10.1016/j.cropro.2016.05.010' }
    ],
    companionPlantIds: ['plant-white-clover'],
    scientificMechanism: {
      en: 'In a 4-year field trial in France (2010–2013), peaches with a white clover cover in the tree row had less brown rot on the fruit than peaches on herbicide-bare soil. After heavy rain the clover limited soil water; the authors suggest this evens out fruit growth and so probably reduces micro-cracks in the fruit skin, a known entry point for the fungus. The lowest brown rot was found when the clover cover was combined with reduced irrigation late in fruit development. The trial measured fruit rot, not blossom blight; still remove mummified fruit.',
      de: 'In einem 4-jährigen Feldversuch in Frankreich (2010–2013) hatten Pfirsiche mit Weißklee-Unterwuchs im Baumstreifen weniger Monilia-Fruchtfäule als Pfirsiche auf mit Herbizid freigehaltenem Boden. Nach Starkregen begrenzte der Klee das Bodenwasser; laut den Autoren gleicht das das Fruchtwachstum aus und verringert so wahrscheinlich Mikrorisse in der Fruchthaut, eine bekannte Eintrittspforte des Pilzes. Am wenigsten Fruchtfäule gab es, wenn der Klee mit reduzierter Bewässerung in der späten Fruchtentwicklung kombiniert wurde. Gemessen wurde die Fruchtfäule, nicht die Blütenmonilia; Fruchtmumien trotzdem entfernen.'
    },
    companionRoles: {
      'plant-white-clover': {
        en: 'As a living cover in the tree row it limited soil water after heavy rain, which probably reduces the fruit cracking that lets brown rot in.',
        de: 'Als lebende Bodendecke im Baumstreifen begrenzte er nach Starkregen das Bodenwasser, was wahrscheinlich die Fruchtrisse verringert, über die Monilia eindringt.'
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
    companionPlantIds: ['plant-white-clover', 'plant-sainfoin', 'plant-common-vetch'],
    scientificMechanism: {
      en: 'In two organic vineyards over two years, an autumn-sown cover crop in the inter-rows (seed mix: perennial ryegrass 48 %, sainfoin 43 %, white clover 9 %) delayed the onset of downy mildew by about 3 weeks in unsprayed plots and reduced its seasonal severity by 12.5 %; in sprayed plots it gave no extra effect. A spring-sown cover of 92 % common vetch and 8 % mustard reduced the seasonal downy mildew level in unsprayed plots by 22 %. In small-scale tests, a cover-crop canopy cut the rain-splash droplets escaping from the soil by 75–95 %, so fewer spores are splashed up from the ground. The cover was chopped and worked into the soil just before grape flowering. The effect comes from the dense cover as a whole, not from one species.',
      de: 'In zwei Bio-Weinbergen über zwei Jahre verzögerte eine im Herbst gesäte Begrünung der Fahrgassen (Saatmischung: Deutsches Weidelgras 48 %, Esparsette 43 %, Weißklee 9 %) den Beginn des Falschen Mehltaus in unbehandelten Parzellen um etwa 3 Wochen und senkte seine Stärke über die Saison um 12,5 %; in gespritzten Parzellen brachte sie keinen zusätzlichen Effekt. Eine im Frühjahr gesäte Begrünung aus 92 % Saat-Wicke und 8 % Senf senkte den Falschen Mehltau über die Saison in unbehandelten Parzellen um 22 %. In Kleinversuchen verringerte eine Begrünungsdecke die aus dem Boden spritzenden Regentropfen um 75–95 %, sodass weniger Sporen vom Boden hochgespritzt werden. Die Begrünung wurde kurz vor der Rebblüte gemulcht und eingearbeitet. Die Wirkung kommt von der dichten Pflanzendecke als Ganzes, nicht von einer einzelnen Art.'
    },
    companionRoles: {
      'plant-white-clover': {
        en: 'Small part (9 % of the seed) of the tested autumn-sown cover mix, which covered the inter-row soil through winter and spring so that rain splashed fewer spores up from the ground.',
        de: 'Kleiner Teil (9 % des Saatguts) der getesteten Herbst-Begrünung, die den Boden der Fahrgasse über Winter und Frühjahr bedeckte, sodass Regen weniger Sporen vom Boden hochspritzte.'
      },
      'plant-sainfoin': {
        en: 'Main legume of the tested cover mix (43 % of the seed); its foliage helps form the dense canopy that intercepts rain splash from the soil.',
        de: 'Hauptleguminose der getesteten Begrünungsmischung (43 % des Saatguts); ihr Laub bildet mit die dichte Decke, die Spritzwasser vom Boden abfängt.'
      },
      'plant-common-vetch': {
        en: 'Main species (92 % of the seed) of the tested spring-sown cover, chopped and worked in just before grape flowering; in unsprayed plots downy mildew was 22 % lower than with bare soil and natural grass.',
        de: 'Hauptart (92 % des Saatguts) der getesteten Frühjahrsbegrünung, die kurz vor der Rebblüte gehäckselt und eingearbeitet wurde; in unbehandelten Parzellen lag der Falsche Mehltau 22 % niedriger als bei offenem Boden mit natürlichem Bewuchs.'
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
    companionPlantIds: ['plant-white-clover', 'plant-sainfoin', 'plant-common-vetch'],
    scientificMechanism: {
      en: 'In the same vineyard trial, the autumn-sown cover crop delayed the onset of powdery mildew by about 30 days and reduced its seasonal severity by 84 % in unsprayed plots; in sprayed plots it gave no extra effect. The spring-sown vetch cover reduced it by 99 % in unsprayed plots. Results varied with site and year. The authors note that fungal fruiting bodies on the vine bark are considered the main spring source of the fungus, so keep up normal hygiene.',
      de: 'Im selben Weinbergversuch verzögerte die Herbst-Begrünung den Beginn des Echten Mehltaus in unbehandelten Parzellen um etwa 30 Tage und senkte seine Stärke über die Saison um 84 %; in gespritzten Parzellen brachte sie keinen zusätzlichen Effekt. Die im Frühjahr gesäte Wicken-Begrünung senkte ihn in unbehandelten Parzellen um 99 %. Die Ergebnisse schwankten je nach Standort und Jahr. Laut den Autoren gelten Fruchtkörper des Pilzes an der Rebrinde als wichtigste Infektionsquelle im Frühjahr – normale Hygiene also beibehalten.'
    },
    companionRoles: {
      'plant-white-clover': {
        en: 'Small part (9 % of the seed) of the tested autumn-sown cover mix that covered the inter-row soil through winter and spring.',
        de: 'Kleiner Teil (9 % des Saatguts) der getesteten Herbst-Begrünung, die den Boden der Fahrgasse über Winter und Frühjahr bedeckte.'
      },
      'plant-sainfoin': {
        en: 'Main legume of the tested cover mix (43 % of the seed); its foliage helps form the dense cover layer.',
        de: 'Hauptleguminose der getesteten Begrünungsmischung (43 % des Saatguts); ihr Laub bildet mit die dichte Pflanzendecke.'
      },
      'plant-common-vetch': {
        en: 'Main species (92 % of the seed) of the tested spring-sown cover; in unsprayed plots powdery mildew was 99 % lower than with bare soil and natural grass.',
        de: 'Hauptart (92 % des Saatguts) der getesteten Frühjahrsbegrünung; in unbehandelten Parzellen lag der Echte Mehltau 99 % niedriger als bei offenem Boden mit natürlichem Bewuchs.'
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
      { label: 'Tortosa et al. 2025, Ecol. Appl. 35:e70045 (38 vineyards, SW France)', doi: '10.1002/eap.70045' },
      { label: 'Carlos et al. 2022, Bull. Entomol. Res. 112:697–706 (parasitism survey 2002–2015, Douro)', doi: '10.1017/S0007485322000116' },
      { label: 'Reiff et al. 2021, Insects 12:220 (pupal predation, Austrian vineyards)', doi: '10.3390/insects12030220' }
    ],
    companionPlantIds: ['plant-white-clover', 'plant-sainfoin'],
    scientificMechanism: {
      en: 'Across 38 vineyards in south-western France, summer berry damage by the grapevine moth decreased with a higher share of ground vegetation cover in the vineyard. In a 14-year survey in Portugal, parasitism of the caterpillars was higher in vineyards with ground cover. In Austrian vineyards, pupal predation was about 10 % higher with species-rich than with species-poor cover crops. The evidence is correlational: it supports keeping the inter-row green, not any single species.',
      de: 'In 38 Weinbergen in Südwestfrankreich nahmen die Sommerschäden des Traubenwicklers an den Beeren mit höherem Anteil an Bodenvegetation ab. In einer 14-jährigen Erhebung in Portugal waren in begrünten Weinbergen mehr Raupen parasitiert. In österreichischen Weinbergen war der Fraß an den Puppen bei artenreicher Begrünung um etwa 10 % höher als bei artenarmer. Der Beleg ist korrelativ: Er spricht für eine grüne Fahrgasse, nicht für eine einzelne Art.'
    },
    companionRoles: {
      'plant-white-clover': {
        en: 'Helps keep the inter-row green; more ground vegetation went along with less berry damage and more parasitism.',
        de: 'Hilft, die Fahrgasse grün zu halten; mehr Bodenvegetation ging mit weniger Beerenschäden und mehr Parasitierung einher.'
      },
      'plant-sainfoin': {
        en: 'Perennial flowering part of a species-rich inter-row cover; species-rich covers went along with higher pupal predation.',
        de: 'Mehrjähriger, blühender Teil einer artenreichen Fahrgassenbegrünung; artenreiche Begrünung ging mit mehr Fraß an den Puppen einher.'
      }
    }
  },

  // 6b. Botrytis bunch rot / grey mould (Botrytis cinerea) – phacelia mulched in the inter-row (added 2026-10-01)
  {
    id: 'rule-grape-botrytis',
    ruleTitle: {
      en: 'Botrytis Bunch Rot of Grapevine (Botrytis cinerea)',
      de: 'Grauschimmelfäule der Rebe (Botrytis cinerea)'
    },
    keywords: ['botrytis', 'bunch rot', 'grauschimmel'],
    starTreeIds: ['vine-grape'],
    evidence: 'scientific',
    citations: [
      { label: 'Jacometti, Wratten & Walter 2007, Int. J. Agric. Sustain. 5:305–314 (Chardonnay vineyard, New Zealand, one season)', doi: '10.1080/14735903.2007.9684830' }
    ],
    companionPlantIds: ['plant-phacelia'],
    scientificMechanism: {
      en: 'In a replicated trial under 10-year-old Chardonnay vines in New Zealand, inter-row phacelia (and ryegrass) mulched in place in winter kept the soil moister and raised soil biological activity 1.5 to 4.5-fold compared with bare ground. Vine debris on the ground broke down faster, carried less Botrytis cinerea inoculum, and bunch rot severity was lower at flowering and at harvest. This is a single vineyard and season; in the Italian cover-crop trial behind the mildew rules, grey mould did not develop, so it could not be tested there. Keep up canopy airflow and remove infected bunches. Oregano, chamomile, garlic and chives, often recommended against grey mould, have no trial behind them (see the evidence check in the pest guide).',
      de: 'In einem wiederholten Versuch unter 10-jährigen Chardonnay-Reben in Neuseeland hielt im Winter vor Ort gemulchte Phazelie (wie auch Weidelgras) in der Fahrgasse den Boden feuchter und steigerte das Bodenleben gegenüber offenem Boden um das 1,5- bis 4,5-Fache. Rebreste am Boden wurden schneller abgebaut, trugen weniger Botrytis-cinerea-Inokulum, und die Grauschimmelfäule war zur Blüte und zur Ernte schwächer. Belegt ist das für einen Weinberg und eine Saison; im italienischen Begrünungsversuch hinter den Mehltau-Regeln trat Grauschimmel nicht auf und ließ sich dort nicht prüfen. Gute Durchlüftung der Laubwand und das Entfernen befallener Trauben bleiben wichtig. Oregano, Kamille, Knoblauch und Schnittlauch, die oft gegen Grauschimmel empfohlen werden, sind durch keinen Versuch belegt (siehe Faktencheck im Schädlings-Ratgeber).'
    },
    companionRoles: {
      'plant-phacelia': {
        en: 'Sown in the inter-row and mulched in place in winter; the mulch layer speeds up the breakdown of fallen vine debris on which Botrytis survives.',
        de: 'In der Fahrgasse gesät und im Winter vor Ort gemulcht; die Mulchschicht beschleunigt den Abbau herabgefallener Rebreste, auf denen Botrytis überdauert.'
      }
    },
    seeAlso: ['note-grey-mould']
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
      { label: 'Zhang Z. et al. 2014, Phytoparasitica 42:595–607 (field intercrop, southern China; pest reported as Empoasca vitis)', doi: '10.1007/s12600-014-0400-y' },
      { label: 'Zhang Z. et al. 2017, J. Pest Sci. 90:227–237 (field, 2014–2015, northern China, 4 plants compared)', doi: '10.1007/s10340-016-0783-2' },
      { label: 'Niu et al. 2022, Pest Manag. Sci. 78:2161–2172 (push-pull field trial; pest reported as Empoasca flavescens)', doi: '10.1002/ps.6840' },
      { label: 'Qin et al. 2015, PLoS ONE 10:e0139202 (the Chinese tea green leafhopper is E. onukii)', doi: '10.1371/journal.pone.0139202' }
    ],
    companionPlantIds: ['plant-sicklepod', 'plant-chinese-motherwort', 'plant-african-marigold'],
    companionEvidence: {
      'plant-chinese-motherwort': 'scientific',
      'plant-african-marigold': 'scientific'
    },
    scientificMechanism: {
      en: 'Two field studies by different research groups, in southern and northern Chinese tea plantations, found markedly fewer tea green leafhoppers where tea was intercropped with sicklepod (Senna tora, syn. Cassia tora), plus more natural enemies such as spiders, ladybirds and lacewings. Sicklepod volatiles repelled the leafhopper in behavioural tests. Sicklepod is a warm-season annual, so it only works on subtropical or very warm sites. Two further intercrops each lowered the leafhopper in one field study: Chinese motherwort in the northern Chinese trial that also tested sicklepod, and African marigold inside the tea as the repellent push plant, combined with Flemingia macrophylla as the attractive pull plant. As single studies they count as scientific, not field-proven; both grow as summer annuals in temperate gardens too.',
      de: 'Zwei Feldstudien verschiedener Forschungsgruppen in süd- und nordchinesischen Teegärten fanden deutlich weniger Grüne Teezikaden, wo Tee mit Sichelhülse (Senna tora, syn. Cassia tora) im Mischanbau stand, dazu mehr Nützlinge wie Spinnen, Marienkäfer und Florfliegen. Duftstoffe der Sichelhülse wehrten die Zikade in Verhaltensversuchen ab. Die Sichelhülse ist eine wärmeliebende Einjährige; sie wirkt daher nur an subtropischen oder sehr warmen Standorten. Zwei weitere Zwischenkulturen senkten die Zikade in je einer Feldstudie: Chinesisches Herzgespann im nordchinesischen Versuch, der auch die Sichelhülse prüfte, und die Aufrechte Studentenblume im Tee als abwehrende Push-Pflanze, kombiniert mit Flemingia macrophylla als anlockender Pull-Pflanze. Als Einzelstudien gelten sie als wissenschaftlich, nicht als feldbewiesen; beide wachsen auch in gemäßigten Gärten als Sommer-Einjährige.'
    },
    companionRoles: {
      'plant-sicklepod': {
        en: 'Its volatiles repelled the leafhopper, and tea intercropped with it carried more spiders, ladybirds and lacewings.',
        de: 'Ihre Duftstoffe wehrten die Zikade ab, und Tee im Mischanbau mit ihr trug mehr Spinnen, Marienkäfer und Florfliegen.'
      },
      'plant-chinese-motherwort': {
        en: 'In two years of field trials in northern China (2014–2015), tea intercropped with it (reported as Leonurus artemisia) had significantly fewer tea green leafhoppers; a plant bug was not reduced. One study.',
        de: 'In zwei Jahren Feldversuchen in Nordchina (2014–2015) hatte Tee im Mischanbau mit ihr (berichtet als Leonurus artemisia) deutlich weniger Grüne Teezikaden; eine Weichwanze ging nicht zurück. Eine Studie.'
      },
      'plant-african-marigold': {
        en: 'Its odour repelled the leafhopper; planted inside the tea as the push plant, with Flemingia macrophylla as the pull plant, the push-pull plots had far fewer leafhoppers than tea without intercrop. Measured for the combination, not for marigold alone; one study.',
        de: 'Ihr Duft wehrte die Zikade ab; als Push-Pflanze im Tee, mit Flemingia macrophylla als Pull-Pflanze, hatten die Push-Pull-Parzellen weit weniger Zikaden als Tee ohne Zwischenkultur. Gemessen für die Kombination, nicht für die Studentenblume allein; eine Studie.'
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
      { label: 'Zhang Z. et al. 2015, Pest Manag. Sci. 71:96–104 (lab: repellent compounds)', doi: '10.1002/ps.3771' },
      { label: 'Hajiboland 2017, Folia Hortic. 29:199–220 (tea soil pH 4.5–5.6)', doi: '10.1515/fhort-2017-0019' }
    ],
    companionPlantIds: ['plant-rosemary'],
    scientificMechanism: {
      en: 'Rosemary volatiles repel the tea geometrid moth in lab tests, and a field intercrop of tea with rosemary suppressed geometrid infestations. Caution: tea needs acid soil (pH about 4.5–5.6), and the planner treats rosemary as a plant of less acid soils. Plant rosemary in a raised edge strip rather than in the acid tea bed; the builder flags the pH conflict when they share a root zone.',
      de: 'Duftstoffe des Rosmarins wehren den Teespanner im Laborversuch ab, und ein Mischanbau von Tee mit Rosmarin unterdrückte den Befall im Feld. Vorsicht: Tee braucht sauren Boden (pH etwa 4,5–5,6), und der Planer führt Rosmarin als Pflanze weniger saurer Böden. Rosmarin daher in einem erhöhten Randstreifen statt im sauren Teebeet pflanzen; der Planer meldet den pH-Konflikt, wenn beide denselben Wurzelraum teilen.'
    },
    companionRoles: {
      'plant-rosemary': {
        en: 'Releases volatiles that repelled adult tea geometrid moths; best planted in a separate raised edge strip.',
        de: 'Gibt Duftstoffe ab, die erwachsene Teespanner abwehrten; am besten in einem separaten, erhöhten Randstreifen pflanzen.'
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
      en: 'Extracts or oils of tansy and of tree wormwood (Artemisia arborescens) deterred newly hatched codling moth caterpillars from entering apples by over 95 % in tests, but nobody has shown that growing the plants protects trees. Fennel only fits by analogy: flowers of other umbellifers (wild carrot, coriander, parsnip) fed the codling moth parasitoid Ascogaster in the lab.',
      de: 'Extrakte oder Öle aus Rainfarn und Strauch-Wermut (Artemisia arborescens) hielten frisch geschlüpfte Apfelwickler-Raupen in Versuchen zu über 95 % vom Einbohren in Äpfel ab, aber niemand hat gezeigt, dass die lebenden Pflanzen Bäume schützen. Fenchel passt nur in Analogie: Blüten anderer Doldenblütler (Wilde Möhre, Koriander, Pastinake) ernährten im Labor die Wickler-Schlupfwespe Ascogaster.'
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
      en: 'No study of any kind found for lavender or southernwood. In a factorial field trial, French marigold under apple did not reduce codling moth or fruit damage and had a general negative effect on arthropods, including natural enemies.',
      de: 'Für Lavendel und Eberraute wurde keinerlei Studie gefunden. In einem Feldversuch senkte Studentenblume unter Apfel weder Apfelwickler noch Fruchtschäden und wirkte sich allgemein negativ auf Gliederfüßer aus, auch auf Nützlinge.'
    },
    citations: [{ label: 'Laffon et al. 2022, Insects 13:908 (factorial field trial)', doi: '10.3390/insects13100908' }]
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
      en: 'No study found showing that these living plants reduce scab. What does work is dealing with the fallen leaves in which the fungus overwinters: in north-eastern US orchards, shredding all of the leaf litter in November or April cut the scab risk by 80–90 %. In a UK orchard, mulch from cover-crop cuttings raised earthworm numbers and sped up leaf-litter breakdown (scab itself was not measured).',
      de: 'Keine Studie gefunden, die zeigt, dass diese lebenden Pflanzen Schorf verringern. Was hilft, ist der Umgang mit dem Falllaub, in dem der Pilz überwintert: Wurde in Anlagen im Nordosten der USA das gesamte Laub im November oder April gehäckselt, sank das Schorfrisiko um 80–90 %. In einer britischen Anlage erhöhte Mulch aus Begrünungsschnitt die Zahl der Regenwürmer und beschleunigte den Laubabbau (Schorf selbst wurde nicht gemessen).'
    },
    citations: [
      SUTTON_2000,
      { label: 'Webber et al. 2022, Appl. Soil Ecol. 178:104569', doi: '10.1016/j.apsoil.2022.104569' }
    ]
  },
  {
    id: 'note-woolly-aphid-nasturtium',
    pest: { en: 'Woolly apple aphid', de: 'Blutlaus' },
    companions: { en: 'Nasturtium', de: 'Kapuzinerkresse' },
    evidence: 'folklore',
    note: {
      en: 'No study found. Sown flowering alleys even increased woolly aphid in a 6-year trial. Earwigs do help: in two organic orchards, releasing 30 earwigs per tree in corrugated-cardboard shelters shortened woolly aphid colonies from the second year on.',
      de: 'Keine Studie gefunden. Eingesäte Blühgassen erhöhten den Blutlausbefall in einem 6-jährigen Versuch sogar. Ohrwürmer helfen: In zwei Bio-Anlagen verkürzte das Freilassen von 30 Ohrwürmern pro Baum in Wellpappe-Unterschlüpfen die Blutlauskolonien ab dem zweiten Jahr.'
    },
    citations: [
      { label: 'Markó et al. 2013, Biocontrol Sci. Technol. 23:126–145', doi: '10.1080/09583157.2012.743972' },
      { label: 'Alins et al. 2023, Insects 14:890 (earwig releases, 2017–2020)', doi: '10.3390/insects14110890' }
    ]
  },
  {
    id: 'note-aphids-single-plants',
    pest: { en: 'Aphids (fruit trees, currants, hemp, linden, elder)', de: 'Blattläuse (Obstbäume, Johannisbeeren, Hanf, Linde, Holunder)' },
    companions: { en: 'Yarrow, fennel, stinging nettle, catmint', de: 'Schafgarbe, Fenchel, Brennnessel, Katzenminze' },
    evidence: 'promising',
    note: {
      en: 'Mixed perennial flower margins reduced rosy apple aphid damage in apple orchards (trees with damaged fruit fell from 80 % to 48 %), but no single plant has been tested on its own. Nettle aphids on stinging nettle supported aphid enemies (lacewing larvae, a parasitoid wasp) in a lab study. In a fennel–cotton intercrop, fennel aphids were associated with ladybirds, but no reduction of cotton aphids was shown. No trial was found testing living catmint as an aphid companion.',
      de: 'Gemischte mehrjährige Blühsäume verringerten Schäden durch die Mehlige Apfelblattlaus in Apfelanlagen (Bäume mit geschädigten Früchten sanken von 80 % auf 48 %), aber keine Einzelpflanze wurde allein getestet. Brennnessel-Blattläuse ernährten in einer Laborstudie Blattlausfeinde (Florfliegenlarven, eine Schlupfwespe). In einem Fenchel-Baumwoll-Mischanbau traten Fenchel-Blattläuse gemeinsam mit Marienkäfern auf, eine Abnahme der Baumwoll-Blattläuse wurde aber nicht gezeigt. Ein Versuch mit lebender Katzenminze als Begleitpflanze gegen Blattläuse wurde nicht gefunden.'
    },
    citations: [
      { label: 'Howard et al. 2024, J. Appl. Ecol. 61:821–835', doi: '10.1111/1365-2664.14598' },
      { label: 'Baverstock et al. 2011, BioControl 56:215–223 (lab)', doi: '10.1007/s10526-010-9330-x' },
      { label: 'Fernandes et al. 2015, PLoS ONE 10:e0131449', doi: '10.1371/journal.pone.0131449' }
    ]
  },
  {
    id: 'note-pear-psylla',
    pest: { en: 'Pear psylla', de: 'Birnenblattsauger' },
    companions: { en: 'Stinging nettle (promising); yarrow, fennel (no trial found)', de: 'Brennnessel (vielversprechend); Schafgarbe, Fenchel (kein Versuch gefunden)' },
    evidence: 'promising',
    note: {
      en: 'A French survey found hawthorn and nettle around orchards to be a reservoir of the main pear psylla enemies, such as the predatory bug Anthocoris nemoralis, and releases of A. nemoralis nymphs cut psylla by 31–40 % in orchards – but no trial has measured whether nettle patches reduce psylla. In a UK trial, cornflower and corn chamomile attracted many anthocorid bugs, but undersowing pear trees with a flower mix did not significantly reduce psyllids. No trial was found for yarrow or fennel.',
      de: 'Eine französische Erhebung fand Weißdorn und Brennnesseln rund um Anlagen als Reservoir der wichtigsten Blattsauger-Feinde wie der Raubwanze Anthocoris nemoralis, und freigelassene A.-nemoralis-Larven senkten den Blattsauger in Anlagen um 31–40 % – ob Brennnesseln den Blattsauger verringern, hat aber kein Versuch gemessen. In einem britischen Versuch lockten Kornblume und Acker-Hundskamille viele Blumenwanzen an, eine Blühmischung als Untersaat unter Birnen senkte den Blattsauger aber nicht deutlich. Für Schafgarbe oder Fenchel wurde kein Versuch gefunden.'
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
      en: 'Only gardening-site claims, no trial found. The peach tree borer (Synanthedon exitiosa) is a North American pest. Cut out and remove shoots infested by the currant clearwing.',
      de: 'Nur Behauptungen auf Gartenseiten, kein Versuch gefunden. Der Pfirsichbaumbohrer (Synanthedon exitiosa) ist ein nordamerikanischer Schädling. Vom Johannisbeer-Glasflügler befallene Triebe herausschneiden und entfernen.'
    },
    citations: []
  },
  {
    id: 'note-voles',
    pest: { en: 'Voles', de: 'Wühlmäuse' },
    companions: { en: 'Daffodil (promising); hyacinth, hellebore (folklore)', de: 'Narzisse (vielversprechend); Hyazinthe, Christrose (Volksweisheit)' },
    evidence: 'promising',
    note: {
      en: 'In feeding trials with captive prairie voles, daffodil bulbs and daffodil leaves were avoided – so the bulbs themselves tend to survive. Hyacinth bulbs, dried and mixed into food, were readily eaten. Whether daffodils protect neighbouring tree roots has never been tested, and nothing was found for hellebore. A wire-mesh root basket physically shields the roots instead.',
      de: 'In Fütterungsversuchen mit Präriewühlmäusen wurden Narzissenzwiebeln und -blätter gemieden – die Zwiebeln selbst überleben also eher. Getrocknete, ins Futter gemischte Hyazinthenzwiebeln wurden dagegen bereitwillig gefressen. Ob Narzissen benachbarte Baumwurzeln schützen, wurde nie getestet, und für die Christrose fand sich nichts. Ein Wurzelschutzkorb aus Drahtgeflecht schirmt die Wurzeln stattdessen mechanisch ab.'
    },
    citations: [
      { label: 'Curtis et al. 2009, HortTechnology 19:499–503 (feeding trials, 30 bulb varieties)', doi: '10.21273/HORTTECH.19.3.499' },
      { label: 'Curtis et al. 2002, Crop Prot. 21:299–306 (feeding trials, leaves of 10 species)', doi: '10.1016/S0261-2194(01)00101-6' }
    ]
  },
  {
    id: 'note-turf-grass',
    pest: { en: 'Turf grass competition', de: 'Konkurrenz durch Rasengräser' },
    companions: { en: 'Daffodil, chives, hosta', de: 'Narzisse, Schnittlauch, Funkie' },
    evidence: 'folklore',
    note: {
      en: 'Grass competition with young trees is documented: in a 6-year apple trial, trees in mowed sod grew less and yielded less than trees in herbicide strips or straw mulch. That a bulb or herb ring suppresses grass is only claimed in permaculture literature; no measurement was found. Mulch the tree basin instead, but watch for voles: in that trial they were a serious problem under straw mulch.',
      de: 'Dass Gras mit jungen Bäumen konkurriert, ist belegt: In einem 6-jährigen Apfelversuch wuchsen Bäume in gemähtem Rasen schwächer und trugen weniger als Bäume mit Herbizidstreifen oder Strohmulch. Dass ein Zwiebel- oder Kräuterring Gras unterdrückt, wird nur in der Permakultur-Literatur behauptet; eine Messung wurde nicht gefunden. Stattdessen die Baumscheibe mulchen, aber auf Wühlmäuse achten: In jenem Versuch waren sie unter Strohmulch ein ernstes Problem.'
    },
    citations: [{ label: 'Merwin & Stiles 1994, J. Am. Soc. Hortic. Sci. 119:209–215 (6-year groundcover trial)', doi: '10.21273/JASHS.119.2.209' }]
  },
  {
    id: 'note-nematodes',
    pest: { en: 'Root-knot nematodes (fig)', de: 'Wurzelgallenälchen (Feige)' },
    companions: { en: 'Marigold (promising); hemp (contradicted)', de: 'Studentenblume (vielversprechend); Hanf (widerlegt)' },
    evidence: 'promising',
    note: {
      en: 'Marigold\'s nematode suppression has been studied mainly as a cover crop, intercrop or soil amendment in annual crops, with variable results depending on how it was used; no trial was found with marigold as a companion under trees. All hemp cultivars tested in greenhouse trials were good hosts of root-knot nematodes.',
      de: 'Die nematodenhemmende Wirkung von Studentenblumen wurde vor allem als Zwischenfrucht, Mischkultur oder Bodenzusatz in einjährigen Kulturen untersucht, mit je nach Anwendung schwankenden Ergebnissen; ein Versuch mit Studentenblumen als Begleiter unter Bäumen wurde nicht gefunden. Alle in Gewächshausversuchen getesteten Hanfsorten waren gute Wirte für Wurzelgallenälchen.'
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
      en: 'In a 6-year apple trial, sown flowering alleys raised predatory mites (mainly in spring and autumn), while spider mites stayed low in all plots; no study was found for grape, tea or linden. In clementine orchards, a sown grass cover (tall fescue) kept two-spotted spider mites below the action threshold more often than a spontaneous wild cover.',
      de: 'In einem 6-jährigen Apfelversuch erhöhten eingesäte Blühgassen die Raubmilben (vor allem im Frühjahr und Herbst), während Spinnmilben in allen Parzellen selten blieben; für Rebe, Tee oder Linde wurde keine Studie gefunden. In Clementinen-Anlagen hielt eine eingesäte Grasdecke (Rohrschwingel) die Gemeine Spinnmilbe öfter unter der Schadschwelle als eine spontane Wildkrautdecke.'
    },
    citations: [
      { label: 'Aguilar-Fenollosa et al. 2011, Crop Prot. 30:1328–1333', doi: '10.1016/j.cropro.2011.05.011' },
      { label: 'Markó et al. 2012, Biocontrol Sci. Technol. 22:39–60 (flowering alleys, apple mites)', doi: '10.1080/09583157.2011.642337' }
    ]
  },
  {
    id: 'note-downy-mildew-sage',
    pest: { en: 'Grapevine downy mildew', de: 'Falscher Mehltau der Rebe' },
    companions: { en: 'Sage', de: 'Salbei' },
    evidence: 'promising',
    note: {
      en: 'Grapevines kept with sage plants in an airtight box for 24 or 48 h were less susceptible to downy mildew afterwards. No vineyard trial with living sage was found.',
      de: 'Reben, die 24 oder 48 Stunden mit Salbeipflanzen in einer luftdichten Box standen, waren danach weniger anfällig für Falschen Mehltau. Ein Weinbergversuch mit lebendem Salbei wurde nicht gefunden.'
    },
    citations: [{ label: 'Fittipaldi Broussard et al. 2026, Agronomy 16:201', doi: '10.3390/agronomy16020201' }]
  },
  {
    id: 'note-grey-mould',
    pest: { en: 'Grey mould (Botrytis)', de: 'Grauschimmel (Botrytis)' },
    companions: { en: 'Oregano, chamomile, garlic, chives', de: 'Oregano, Kamille, Knoblauch, Schnittlauch' },
    evidence: 'folklore',
    note: {
      en: 'No trial was found in which living oregano, chamomile, garlic or chives reduced grey mould on a neighbouring crop. Rely on airflow, thinning and removing infected material. For grapevine there is one field result with a different plant: phacelia sown in the inter-row and mulched in place in winter lowered bunch rot (scientific tier, see the grapevine Botrytis rule). Caveats: a single vineyard and season, and ryegrass mulch had the same effect, so the mulch layer rather than phacelia itself seems to do the work.',
      de: 'Es wurde kein Versuch gefunden, in dem lebender Oregano, Kamille, Knoblauch oder Schnittlauch Grauschimmel an einer Nachbarkultur verringerte. Auf Luftzirkulation, Auslichten und Entfernen befallener Teile setzen. Für die Rebe gibt es einen Feldbefund mit einer anderen Pflanze: In der Fahrgasse gesäte und im Winter vor Ort gemulchte Phazelie verringerte die Traubenfäule (Stufe Wissenschaftlich, siehe die Botrytis-Regel der Rebe). Einschränkungen: nur ein Weinberg und eine Saison, und Weidelgras-Mulch wirkte genauso – offenbar wirkt die Mulchschicht, nicht die Phazelie selbst.'
    },
    citations: [],
    seeAlso: ['rule-grape-botrytis']
  },
  {
    id: 'note-lace-bug',
    pest: { en: 'Rhododendron lace bug', de: 'Rhododendron-Netzwanze' },
    companions: { en: 'Layered planting (tree canopy + shrubs + groundcover)', de: 'Mehrschichtige Pflanzung (Baumkrone + Sträucher + Bodendecker)' },
    evidence: 'promising',
    note: {
      en: 'For the related azalea lace bug, structurally complex urban landscapes had far fewer lace bugs than simple ones, mainly because generalist predators such as spiders were more abundant. This has not been tested for the rhododendron lace bug.',
      de: 'Bei der verwandten Azaleen-Netzwanze hatten strukturreiche städtische Pflanzungen weit weniger Netzwanzen als einfache, vor allem weil generalistische Räuber wie Spinnen häufiger waren. Für die Rhododendron-Netzwanze ist das nicht getestet.'
    },
    citations: [{ label: 'Shrewsbury & Raupp 2006, Ecol. Appl. 16:262–272', doi: '10.1890/04-1347' }]
  },
  {
    id: 'note-spotted-wing-drosophila',
    pest: { en: 'Spotted wing drosophila', de: 'Kirschessigfliege' },
    companions: { en: 'Peppermint', de: 'Pfefferminze' },
    evidence: 'promising',
    note: {
      en: 'Results conflict: in one single-season trial, fewer flies emerged from fruit baits in peppermint than in ryegrass/clover intercrops (at low fly levels), while peppermint interplanted in strawberries did not reduce infestation – it was lowest without peppermint. Keep elder away from cherries and blueberries: it is a major wild host in Europe.',
      de: 'Die Ergebnisse widersprechen sich: In einem einjährigen Versuch schlüpften aus Fruchtködern in Pfefferminz-Zwischenreihen weniger Fliegen als bei Weidelgras/Klee (bei geringem Befall), während Pfefferminze zwischen Erdbeeren den Befall nicht senkte – er war ohne Pfefferminze am niedrigsten. Holunder von Kirschen und Heidelbeeren fernhalten: Er ist in Europa ein wichtiger Wildwirt.'
    },
    citations: [
      { label: 'Gowton et al. 2021, Front. Sustain. Food Syst. 5:700842', doi: '10.3389/fsufs.2021.700842' },
      { label: 'Renkema et al. 2020, Can. Entomol. 152:575–586', doi: '10.4039/tce.2020.34' },
      { label: 'Kenis et al. 2016, J. Pest Sci. 89:735–748 (wild hosts in Europe)', doi: '10.1007/s10340-016-0755-6' }
    ]
  },
  {
    id: 'note-oriental-fruit-moth',
    pest: { en: 'Oriental fruit moth', de: 'Pfirsichwickler' },
    companions: { en: 'Chinese mint (Mentha haplocalyx)', de: 'Chinesische Minze (Mentha haplocalyx)' },
    evidence: 'promising',
    note: {
      en: 'In a single study, volatiles of Mentha haplocalyx repelled the moth and the mint lowered apple fruit infestation in the field from 33 % to about 10 %. It has not yet been confirmed by other studies, and it is a different mint from peppermint.',
      de: 'In einer Einzelstudie wehrten Duftstoffe von Mentha haplocalyx den Falter ab, und die Minze senkte den Befall von Apfelfrüchten im Feld von 33 % auf etwa 10 %. Bestätigt durch weitere Studien ist das noch nicht, und es ist eine andere Minze als die Pfefferminze.'
    },
    citations: [{ label: 'Zhang Y. et al. 2026, Crop Prot. 199:107430', doi: '10.1016/j.cropro.2025.107430' }]
  },
  {
    id: 'note-rhubarb-phytophthora',
    pest: { en: 'Rhubarb Phytophthora crown rot', de: 'Phytophthora-Wurzelhalsfäule am Rhabarber' },
    companions: { en: 'Fennel', de: 'Fenchel' },
    evidence: 'promising',
    note: {
      en: 'In a greenhouse experiment, intercropping with fennel suppressed Phytophthora capsici blight of pepper, and terpenes from fennel roots interfered with the pathogen – a different host and pathogen, not tested on rhubarb. Rely on standard measures such as good drainage.',
      de: 'In einem Gewächshausversuch unterdrückte Fenchel als Mischkultur die Phytophthora-capsici-Fäule an Paprika, und Terpene aus Fenchelwurzeln störten den Erreger – ein anderer Wirt und Erreger, an Rhabarber nicht getestet. Auf übliche Maßnahmen wie gute Drainage setzen.'
    },
    citations: [{ label: 'Yang et al. 2022, Front. Plant Sci. 13:890534 (greenhouse, pepper)', doi: '10.3389/fpls.2022.890534' }]
  },
  {
    id: 'note-walnut-anthracnose',
    pest: { en: 'Walnut anthracnose', de: 'Walnuss-Anthraknose' },
    companions: { en: 'Autumn olive', de: 'Schmalblättrige Ölweide' },
    evidence: 'promising',
    note: {
      en: 'Applying nitrogen fertiliser was reported to control anthracnose on black walnut; that a nitrogen-fixing companion does the same has not been tested.',
      de: 'Stickstoffdüngung wurde als Mittel gegen Anthraknose an Schwarznuss beschrieben; dass ein stickstoffbindender Begleiter dasselbe bewirkt, wurde nicht getestet.'
    },
    citations: [{ label: 'Neely 1981, Plant Dis. 65:580', doi: '10.1094/PD-65-580' }]
  },
  {
    id: 'note-tea-blister-blight',
    pest: { en: 'Tea blister blight (Exobasidium vexans)', de: 'Teeblasenkrankheit (Exobasidium vexans)' },
    companions: { en: 'Soybean', de: 'Sojabohne' },
    evidence: 'promising',
    note: {
      en: 'In a single study, a tea–soybean intercrop markedly reduced major foliar diseases of tea – especially anthracnose – and raised yield, together with more Pseudomonas bacteria on the leaves. Effect sizes for blister blight could not be checked in the accessible summary, so this is not shown as a defense badge until confirmed.',
      de: 'In einer Einzelstudie senkte ein Tee-Soja-Mischanbau wichtige Blattkrankheiten des Tees deutlich – vor allem Anthraknose – und steigerte den Ertrag, begleitet von mehr Pseudomonas-Bakterien auf den Blättern. Werte speziell zur Teeblasenkrankheit ließen sich in der zugänglichen Zusammenfassung nicht prüfen; daher bis zur Bestätigung kein Abwehr-Badge.'
    },
    citations: [{ label: 'Shao et al. 2026, Ind. Crops Prod. 251:124159 (single study)', doi: '10.1016/j.indcrop.2026.124159' }]
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
 * With a climate zone, only companions that grow there count; with a star plant, only companions
 * compatible with it (compatibility.ts).
 */
export function resolvePestDefense(pestText: string, starTreeId?: string, zone?: ClimateZone): PestResolution {
  const lower = pestText.toLowerCase().trim();

  for (const rule of PEST_DEFENSE_RULES) {
    if (!ruleAppliesToTree(rule, starTreeId)) continue;
    if (rule.keywords.some(k => lower.includes(k))) {
      const companionPlantIds = rule.companionPlantIds.filter(id => growsInZone(id, zone) && fitsStar(id, starTreeId));
      if (companionPlantIds.length === 0) continue;
      return {
        pestText,
        combatable: true,
        companionPlantIds,
        scientificMechanism: rule.scientificMechanism,
        ruleTitle: rule.ruleTitle,
        ruleId: rule.id,
        evidence: strongestEvidence(rule, companionPlantIds),
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
          evidence: companionEvidence(rule, companion.id),
          citations: rule.citations
        });
      }
    }
  }

  return results;
}
