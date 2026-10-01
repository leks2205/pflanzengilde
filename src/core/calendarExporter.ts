import {
  StarTree,
  GuildPlant,
  Language,
  SoilType,
  ClimateZone,
  Hemisphere,
  getLoc,
  PhenoSeason
} from '../types/guild';
import { buildShareUrl } from '../utils/shareUtils';
import { t, formatNumber, translateZone, translateSector, translateRole } from '../i18n/translations';
import { getPlantingSeasons, getHarvestSeasons } from './seasonalGapEngine';

export interface CalendarExportOptions {
  starTree: StarTree;
  selectedPlants: GuildPlant[];
  selectedSoil?: SoilType;
  selectedZone?: ClimateZone;
  hemisphere?: Hemisphere;
  language?: Language;
  baseUrl?: string;
}

export interface IcsEvent {
  uid: string;
  startDate: string; // YYYYMMDD
  endDate: string;   // YYYYMMDD (exclusive next day for all-day events)
  summary: string;
  description: string;
  htmlDescription?: string;
  altrepUrl?: string;
  attachments?: { url: string; mimeType: string }[];
  url?: string;
  categories: string[];
  isRecurring?: boolean; // RRULE:FREQ=YEARLY
}

export const CHOP_PLANT_ANCHORS: Record<string, string> = {
  'plant-comfrey': 'chop-plant-comfrey',
  'plant-white-clover': 'chop-plant-white-clover',
  'plant-willow': 'chop-plant-willow',
  'plant-goumi': 'chop-plant-goumi',
  'plant-elaeagnus': 'chop-plant-elaeagnus',
  'plant-yarrow': 'chop-plant-yarrow',
  'plant-horseradish': 'chop-plant-horseradish',
  'plant-borage': 'chop-plant-borage',
  'plant-lupine': 'chop-plant-lupine',
  'plant-elderberry': 'chop-plant-elderberry',
  'plant-aster': 'chop-plant-aster',
  'plant-hosta': 'chop-plant-hosta',
  'plant-nasturtium': 'chop-plant-nasturtium',
  'plant-sweet-potato': 'chop-plant-sweet-potato',
  'plant-tansy': 'chop-plant-tansy',
  'plant-chives': 'chop-plant-chives',
  'plant-tea-sinensis': 'chop-plant-tea-sinensis',
  'plant-hyssop': 'chop-plant-hyssop',
  'plant-sage': 'chop-plant-sage',
  'plant-seabuckthorn': 'chop-plant-seabuckthorn',
  'tree-alder': 'chop-tree-alder',
  'plant-alder': 'chop-tree-alder',
  'plant-linden': 'chop-plant-linden',
  'tree-linden': 'chop-plant-linden',
  'plant-nepal-alder': 'chop-plant-tea-shade-trees',
  'plant-albizia': 'chop-plant-tea-shade-trees',
  'tree-seabuckthorn-star': 'chop-plant-seabuckthorn',
  'plant-sorghum-sudangrass': 'chop-plant-sorghum-sudangrass',
  'plant-buckwheat': 'chop-plant-buckwheat',
  'plant-phacelia': 'chop-plant-phacelia',
  'plant-fodder-radish': 'chop-plant-fodder-radish',
  'plant-indian-mustard': 'chop-plant-indian-mustard',
  'plant-tithonia': 'chop-plant-tithonia',
  'plant-gliricidia': 'chop-plant-gliricidia',
  'plant-common-vetch': 'chop-plant-common-vetch',
};

interface ChopInstruction {
  howToCut: { de: string; en: string };
  howMuch: { de: string; en: string };
  whereToSpread: { de: string; en: string };
  nutrientBenefit: { de: string; en: string };
  /** Citations backing the factual statements above (traceability only, not displayed in calendar events). */
  sources?: string[];
}

const SRC_OSTER_2021 = 'Oster, M., et al. (2021). Comfrey (Symphytum spp.) as a feed supplement in pig nutrition contributes to regional resource cycles. Science of The Total Environment, 796, 148988. doi:10.1016/j.scitotenv.2021.148988';
const SRC_THILAKARATHNA_2016 = 'Thilakarathna, M. S., et al. (2016). Belowground nitrogen transfer from legumes to non-legumes under managed herbaceous cropping systems. A review. Agronomy for Sustainable Development, 36(4), 58. doi:10.1007/s13593-016-0396-4';
const SRC_DAHLIN_2020 = 'Dahlin, P., & Hallmann, J. (2020). New Insights on the Role of Allyl Isothiocyanate in Controlling the Root Knot Nematode Meloidogyne hapla. Plants, 9(5), 603. doi:10.3390/plants9050603';
const SRC_ALDER_ATLAS = 'Houston Durrant, T., de Rigo, D., & Caudullo, G. (2016). Alnus glutinosa in Europe: distribution, habitat, usage and threats. In San-Miguel-Ayanz, J., et al. (Eds.), European Atlas of Forest Tree Species. Publications Office of the EU, Luxembourg. https://forest.jrc.ec.europa.eu/media/atlas/Alnus_glutinosa.pdf';
const SRC_BEER_1987 = 'Beer, J. (1987). Advantages, disadvantages and desirable characteristics of shade trees for coffee, cacao and tea. Agroforestry Systems, 5(1), 3–13. doi:10.1007/BF00046410';
const SRC_MIRSKY_2016 = 'Mirsky, S., Ackroyd, V., Gaskin, J., & Hendrick, R. (2016). Nitrogen Release from Cover Crops. SARE Southern. https://southern.sare.org/resources/nitrogen-release-from-cover-crops/';

// Sources for the generic care texts in the calendar (i18n keys calendar*Text / calendarChopDefault*).
const SRC_RHS_PLANTING = 'Royal Horticultural Society (n.d.). Trees and shrubs: planting guide. RHS. https://www.rhs.org.uk/plants/types/trees/planting-trees-shrubs';
const SRC_CLEMENTS_2019 = 'Clements, J. (2019, August 22). Will an apple tree grow differently if I plant the graft union high above the soil or close to the ground? Apples (extension.org). https://apples.extension.org/will-an-apple-tree-grow-differently-if-i-plant-the-graft-union-high-above-the-soil-or-close-to-the-ground/';
const SRC_CHALKER_SCOTT_2015 = 'Chalker-Scott, L. (2015). Using Arborist Wood Chips as Landscape Mulch. Washington State University Extension Fact Sheet FS160E. https://pubs.extension.wsu.edu/product/using-arborist-wood-chips-as-a-landscape-mulch-home-garden-series/';
const SRC_NJUE_2018 = 'Njue, G. (2018, updated December 18). Pruning Fruit Trees. SDSU Extension. https://extension.sdstate.edu/pruning-fruit-trees';
const SRC_ILLINOIS_PRUNING_CUTS = 'University of Illinois Extension (n.d.). Making Pruning Cuts. Fruit Trees for Home Gardens. https://extension.illinois.edu/fruit-trees/making-pruning-cuts';
const SRC_ISU_APPLES = 'Iowa State University Extension and Outreach (2025). How to Harvest and Store Apples. Yard and Garden. https://yardandgarden.extension.iastate.edu/how-to/how-harvest-and-store-apples';
const SRC_CAPRILE_VOSSEN_2011 = 'Caprile, J. L., & Vossen, P. M. (2011). Pest Notes: Codling Moth. UC ANR Publication 7412. UC Statewide IPM Program. https://ipm.ucanr.edu/PMG/PESTNOTES/pn7412.html';
const SRC_PSU_VOLES = 'Penn State Extension (2024, updated January 5). Orchard Wildlife: Integrated Management of Voles in Orchards. https://extension.psu.edu/orchard-wildlife-integrated-management-of-voles-in-orchards';
const SRC_KUHNS_2011 = 'Kuhns, M. (2011). Sunscald Injury or Southwest Winter Injury on Deciduous Trees. Utah Forest Facts 021, USU Extension Forestry. https://extension.usu.edu/forestry/publications/utah-forest-facts/021-sunscald-injury-or-southwest-winter-injury-on-deciduous-trees';
const SRC_NAEVE_HAYNES_HERBS = 'Naeve, L., & Haynes, C. (n.d., reviewed 2026). Growing, Harvesting, and Drying Herbs. Iowa State University Extension and Outreach. https://yardandgarden.extension.iastate.edu/how-to/growing-harvesting-and-drying-herbs';

/**
 * Traceability only (calendar events show no citations): which source backs the factual
 * statement in each generic calendar care text, keyed by i18n key.
 */
export const CALENDAR_TEXT_SOURCES: Record<string, string[]> = {
  calendarTreePlantHoleText: [SRC_RHS_PLANTING],
  calendarTreePlantDepthText: [SRC_RHS_PLANTING, SRC_CLEMENTS_2019],
  calendarTreeTrunkCollarText: [SRC_RHS_PLANTING],
  calendarPruneLightText: [SRC_NJUE_2018],
  calendarPruneDeadwoodText: [SRC_NJUE_2018, SRC_ILLINOIS_PRUNING_CUTS],
  calendarPruneSproutsText: [SRC_NJUE_2018],
  calendarPruneWoodText: [SRC_CHALKER_SCOTT_2015],
  calendarTreeHarvestTiltText: [SRC_ISU_APPLES],
  calendarTreeHarvestWindfallText: [SRC_CAPRILE_VOSSEN_2011],
  calendarTreeHarvestStorageText: [SRC_ISU_APPLES],
  calendarCollarClearText: [SRC_CHALKER_SCOTT_2015, SRC_PSU_VOLES],
  calendarCollarBarkText: [SRC_PSU_VOLES],
  calendarCollarFrostText: [SRC_KUHNS_2011],
  calendarChopDefaultHowToCut: [SRC_MIRSKY_2016],
  calendarChopDefaultWhereToSpread: [SRC_RHS_PLANTING],
  calendarChopDefaultNutrientBenefit: [SRC_CHALKER_SCOTT_2015],
  calendarPlantHarvestTimingText: [SRC_NAEVE_HAYNES_HERBS],
  calendarPlantHarvestQuantityText: [SRC_NAEVE_HAYNES_HERBS],
};

export const DEDICATED_CHOP_INSTRUCTIONS: Record<string, ChopInstruction> = {
  'plant-comfrey': {
    howToCut: {
      de: 'Vor der Blüte schneiden, sobald sich die ersten Blütenknospen zeigen; regelmäßiges Schneiden verhindert die Blüte. Mit scharfer Sichel oder Heckenschere.',
      en: 'Cut before flowering, as the first flower buds appear; regular cutting prevents flowering. Use a sharp sickle or hedge shears.'
    },
    howMuch: {
      de: 'Alle großen Außenblätter auf 5 cm über dem Wurzelstock kappen; die inneren Herzblätter stehen lassen. Etwa alle 6 Wochen ist ein neuer Schnitt möglich (4–5 Schnitte pro Saison).',
      en: 'Cut all large outer leaves down to 5 cm above the root crown, leaving the inner heart leaves. A new cut is possible about every 6 weeks (4–5 cuts per season).'
    },
    whereToSpread: {
      de: 'Gleichmäßig als 5–10 cm dicke Mulchschicht in Zone 2 und 3 unter der Traufkante auslegen. Mindestens 15–20 cm Abstand zum Stammkragen (Zone 0) einhalten!',
      en: 'Spread evenly as a 5–10 cm mulch layer in Zone 2 and Zone 3 under the drip line. Keep 15–20 cm away from trunk collar (Zone 0)!'
    },
    nutrientBenefit: {
      de: 'Sehr kaliumreiche Blätter (in einer Analyse rund 6,5 % K in der Trockenmasse), dazu Calcium; das Wurzelsystem reicht etwa 1 m tief.',
      en: 'Very potassium-rich leaves (about 6.5% K in dry matter in one analysis), plus calcium; the root system reaches about 1 m deep.'
    },
    sources: [
      SRC_OSTER_2021,
      'Garden Organic (n.d.). Growing comfrey. Garden Organic, All about comfrey. https://www.gardenorganic.org.uk/expert-advice/all-about-comfrey/growing-comfrey'
    ]
  },
  'plant-white-clover': {
    howToCut: {
      de: 'Im Frühsommer nach der Hauptblüte und im Frühherbst schneiden. Mit Grasschere oder hoch eingestelltem Trimmer arbeiten.',
      en: 'Mow or shear in early summer after first bloom flushes and in early autumn. Use hand grass shears or a high-set trimmer.'
    },
    howMuch: {
      de: 'Die oberen 50–70 % des Blattwerks auf 4–6 cm einkürzen. Die flach kriechenden Ausläufer (Stolonen) keinesfalls verletzen.',
      en: 'Cut top 50–70% of aboveground foliage down to 4–6 cm height. Never scalp ground-level stolons.'
    },
    whereToSpread: {
      de: 'Schnittgut direkt an Ort und Stelle liegen lassen oder in Zone 2 an die Feinwurzeln der Bäume rechen. Der Schnitt lässt Wurzeln und Wurzelknöllchen teilweise absterben; bei ihrer Zersetzung wird ihr Stickstoff für Nachbarpflanzen verfügbar – Schätzungen für Leguminosen-Gras-Bestände reichen von 3 bis 102 kg N/ha und Jahr.',
      en: 'Leave clippings in situ on the ground or rake into Zone 2 around tree feeder roots. Cutting makes part of the roots and root nodules die back; as they decompose, their nitrogen becomes available to neighboring plants – estimates for legume–grass pastures range from 3 to 102 kg N/ha per year.'
    },
    nutrientBenefit: {
      de: 'Stickstoff aus der Rhizobien-Symbiose der Wurzelknöllchen. Feine Wurzeln mit engem C:N-Verhältnis und wenig Lignin werden rasch umgesetzt.',
      en: 'Nitrogen from the Rhizobia root nodule symbiosis. Fine roots with a low C:N ratio and little lignin turn over quickly.'
    },
    sources: [SRC_THILAKARATHNA_2016]
  },
  'plant-willow': {
    howToCut: {
      de: 'Im Spätwinter (Februar/März) vor dem Saftaustrieb auf den Stock setzen oder im Juli grüne Triebspitzen stutzen.',
      en: 'Coppice in late winter (February/March) during dormancy before sap rises, or tip tender summer shoots in July.'
    },
    howMuch: {
      de: 'Alle einjährigen Weidenruten auf 10–15 cm über dem Weidenstock zurückschneiden. Ein auf den Stock gesetzter Weidenstock treibt mehrere neue Ruten (oft 8–10, je nach Sorte).',
      en: 'Coppice all 1-year rods down to 10–15 cm above the stool. A coppiced stool resprouts with several new rods (often 8–10, depending on variety).'
    },
    whereToSpread: {
      de: 'Ruten in 5–10 cm kurze Stücke schneiden oder häckseln (Zweighäcksel, Bois Raméal Fragmenté / BRF). In Zone 3 und 4 verteilen.',
      en: 'Chop twigs into 5–10 cm pieces or shred into ramial chipped wood (RCW / BRF). Spread in Zone 3 and 4.'
    },
    nutrientBenefit: {
      de: 'Holzige organische Substanz für langfristigen Humus- und Strukturaufbau; Zweighäcksel förderte in einem Feldversuch vor allem die Bodenbakterien, weniger deutlich die Pilze.',
      en: 'Woody organic matter for long-term humus and soil structure; in a field trial, ramial chipped wood mainly boosted soil bacteria, with a less marked effect on fungi.'
    },
    sources: [
      'Caslin, B., Finnan, J., Johnston, C., McCracken, A., & Walsh, L. (Eds.) (2015). Short Rotation Coppice Willow: Best Practice Guidelines. Teagasc & AFBI. https://teagasc.ie/wp-content/uploads/2025/05/Short_Rotation_Coppice_Best_Practice_Guidelines.pdf',
      'Taurines, S., Séguin, A., & Guittonny, M. (2025). Promoting soil microbial community development in early primary succession on waste rock by mulching with ramial chipped wood, in a boreal context. Applied Soil Ecology, 207, 105958. doi:10.1016/j.apsoil.2025.105958'
    ]
  },
  'plant-goumi': {
    howToCut: {
      de: 'Im Spätfrühling nach dem ersten Austrieb und im Spätsommer nach der Beerenernte mit scharfer Astschere stutzen.',
      en: 'Prune in late spring after initial growth flush and again in late summer after fruit harvest using bypass loppers.'
    },
    howMuch: {
      de: '25–35 % der kräftigen Jahrestriebe und nach innen wachsenden Zweige herausschneiden, um Licht in den Busch zu lassen.',
      en: 'Prune back 25–35% of vigorous annual green shoots and crossing interior branches to maintain open light penetration.'
    },
    whereToSpread: {
      de: 'Triebe zerkleinern und in Zone 2 und 3 unter nährstoffhungrige Obstbäume (Apfel, Pflaume, Pfirsich) streuen.',
      en: 'Chop leaves and tender twigs and spread in Zone 2–3 around demanding fruit trees (apples, plums, peaches).'
    },
    nutrientBenefit: {
      de: 'Stickstoff fixierender Strauch (Elaeagnus, Frankia-Aktinorrhiza); das Schnittgut liefert stickstoffreichen Mulch.',
      en: 'Nitrogen-fixing shrub (Elaeagnus, actinorhizal Frankia symbiosis); its prunings make a nitrogen-rich mulch.'
    },
    sources: [
      'Huss-Danell, K. (1997). Actinorhizal symbioses and their N2 fixation. New Phytologist, 136(3), 375–405. doi:10.1046/j.1469-8137.1997.00755.x'
    ]
  },
  'plant-yarrow': {
    howToCut: {
      de: 'Direkt nach der ersten Hauptblüte im Juli bodennah zurückschneiden, ein zweites Mal vor dem Wintereinbruch im Oktober.',
      en: 'Cut back immediately after primary summer flowering flush (July), and again in autumn before winter.'
    },
    howMuch: {
      de: 'Blütenstängel und aufrechtes Laub auf 5 cm einkürzen. Die flache, bodendeckende Grundrosette unberührt lassen.',
      en: 'Cut spent flower stems and tall foliage down to 5 cm above ground, preserving basal ground-hugging rosette.'
    },
    whereToSpread: {
      de: 'Fein verteilt in Zone 2 ausstreuen.',
      en: 'Spread finely across Zone 2.'
    },
    nutrientBenefit: {
      de: 'Weicher Kräutermulch, der seine Mineralstoffe beim Verrotten an den Boden zurückgibt.',
      en: 'A soft herb mulch that returns its minerals to the soil as it decomposes.'
    }
  },
  'plant-horseradish': {
    howToCut: {
      de: 'Von Juli bis Oktober regelmäßig die großen äußeren Blätter mit einem scharfen Messer bodennah abernten.',
      en: 'Harvest mature outer leaves 2–3 times between mid-summer and autumn using a sharp harvest knife.'
    },
    howMuch: {
      de: 'Bis zu 40 % des äußeren Blattkragens abschneiden. Das vegetative Herz im Zentrum muss zwingend intakt bleiben.',
      en: 'Harvest up to 40% of outer leaf crown. The central growing heart must remain untouched.'
    },
    whereToSpread: {
      de: 'Blätter grob zerkleinern und unter die Baumkrone (Zone 1 und 2) legen.',
      en: 'Chop leaves coarsely and mulch beneath tree canopy (Zone 1–2).'
    },
    nutrientBenefit: {
      de: 'Meerrettich enthält das Glucosinolat Sinigrin, das beim Zerkleinern scharfes Allylsenföl (AITC) freisetzt. Eine Wirkung des Blattmulchs auf Schorfpilze oder Wühlmäuse ist nicht belegt; selbst eingearbeitete Biofumigation wirkt uneinheitlich.',
      en: 'Horseradish contains the glucosinolate sinigrin, which releases pungent allyl isothiocyanate (AITC) when the tissue is crushed. An effect of leaf mulch on scab fungi or voles is not established; even incorporated biofumigation gives inconsistent results.'
    },
    sources: [
      'Alibrahem, W., et al. (2025). Health Benefits, Applications, and Analytical Methods of Freshly Produced Allyl Isothiocyanate. Foods, 14(4), 579. doi:10.3390/foods14040579',
      SRC_DAHLIN_2020
    ]
  },
  'plant-borage': {
    howToCut: {
      de: 'Im Hochsommer verblühte Triebe kappen für eine zweite Blühwelle; im Spätherbst nach den ersten Nachtfrösten komplett bodennah abräumen.',
      en: 'Clip spent flowering stems in mid-summer to stimulate a second flowering flush; full chop down after first hard frost in autumn.'
    },
    howMuch: {
      de: 'Im Sommer auf 10–15 cm einkürzen; im Spätherbst vollständig bodennah kappen.',
      en: 'Prune back to 10–15 cm in summer; cut flush to ground level after first autumn frosts.'
    },
    whereToSpread: {
      de: 'Als weichen Biomasseteppich in Zone 2 verteilen.',
      en: 'Spread as a tender biomass blanket in Zone 2.'
    },
    nutrientBenefit: {
      de: 'Kaliumreiche, weiche Biomasse – Kalium ist der wichtigste Mineralstoff im Borretsch.',
      en: 'Potassium-rich, soft biomass – potassium is the main mineral element in borage.'
    },
    sources: [
      'Medrano, A., Masoud, T. A., & Martinez, M. C. (1992). Mineral and proximate composition of borage. Journal of Food Composition and Analysis, 5(4), 313–318. doi:10.1016/0889-1575(92)90064-Q'
    ]
  },
  'plant-lupine': {
    howToCut: {
      de: 'Zur Vollblüte schneiden, bevor Hülsen ansetzen – dann enthält die Pflanze am meisten Stickstoff.',
      en: 'Cut at mid-bloom, before seed pods develop, when the plant holds the most nitrogen.'
    },
    howMuch: {
      de: 'Ganze Stängel auf 5–10 cm über dem Wurzelansatz kappen.',
      en: 'Cut entire stems down to 5–10 cm above root crown.'
    },
    whereToSpread: {
      de: 'Um nährstoffzehrende Gehölze in Zone 2 und 3 drapieren.',
      en: 'Lay around heavy-feeding woody perennials in Zone 2 and 3.'
    },
    nutrientBenefit: {
      de: 'Stickstoffreiche Leguminosen-Biomasse; Lupinen-Keimwurzeln durchdringen sehr festen Boden besser als die meisten Kulturen.',
      en: 'Nitrogen-rich legume biomass; lupin seedling roots penetrate very strong soil better than most crops.'
    },
    sources: [
      SRC_MIRSKY_2016,
      'Materechera, S. A., Dexter, A. R., & Alston, A. M. (1991). Penetration of very strong soils by seedling roots of different plant species. Plant and Soil, 135(1), 31–41. doi:10.1007/BF00014776'
    ]
  },
  'plant-sage': {
    howToCut: {
      de: 'Nach der Frühjahrsblüte (Juni/Juli) verblühte Triebe einkürzen und im zeitigen Frühjahr Formschnitt durchführen.',
      en: 'Trim back faded flower spikes in early summer (June/July) and perform a light structural shape-up in early spring.'
    },
    howMuch: {
      de: 'Die beblätterten Triebe um ca. ein Drittel einkürzen. Keinesfalls ins alte, kahle Holz schneiden!',
      en: 'Trim back leafy green shoots by one third. Never cut back into old, bare, leafless woody branches!'
    },
    whereToSpread: {
      de: 'Schnittgut um Rebstöcke oder Obstbäume in Zone 2 streuen.',
      en: 'Spread prunings around grapevines or fruit trees in Zone 2.'
    },
    nutrientBenefit: {
      de: 'Salbei enthält viel Thujon, 1,8-Cineol und Campher. In einem geschlossenen Boxversuch waren Rebblätter, die den Duftstoffen lebender Salbeipflanzen ausgesetzt waren, weniger anfällig für Falschen Mehltau; für Schnittgut als Mulch ist das nicht geprüft.',
      en: 'Sage is rich in thujone, 1,8-cineole and camphor. In a sealed-box trial, grape leaves exposed to volatiles of living sage plants were less susceptible to downy mildew; this has not been tested for prunings used as mulch.'
    },
    sources: [
      'Craft, J., Satyal, P., & Setzer, W. (2017). The Chemotaxonomy of Common Sage (Salvia officinalis) Based on the Volatile Constituents. Medicines, 4(3), 47. doi:10.3390/medicines4030047',
      'Fittipaldi Broussard, M., et al. (2026). The Consociation of Sage and Grapevine Modifies Grape Leaf Metabolism and Reduces Downy Mildew Infection. Agronomy, 16(2), 201. doi:10.3390/agronomy16020201'
    ]
  },
  'plant-chives': {
    howToCut: {
      de: 'Von April bis Oktober regelmäßig handbreit über dem Boden mit einer scharfen Küchen- oder Ernteschere schneiden.',
      en: 'Cut regularly from April to October a handbreadth above the ground using sharp shears.'
    },
    howMuch: {
      de: 'Auf 2–3 cm über dem Boden kappen; treibt danach rasch wieder aus.',
      en: 'Cut down to 2–3 cm above ground level; regrows quickly afterwards.'
    },
    whereToSpread: {
      de: 'Direkt im Zwiebelring (Zone 1) rund um den Baumstamm verteilen.',
      en: 'Spread directly within the Zone 1 bulb ring around the trunk base.'
    },
    nutrientBenefit: {
      de: 'Schwefelreiche Blätter mit zwiebeltypischen Aromavorstufen (vor allem Isoalliin; anders als Knoblauch kein Alliin, also auch kein Allicin). Eine Schutzwirkung gegen Apfelschorf oder Mehltau ist nicht belegt.',
      en: 'Sulfur-rich leaves with onion-type flavor precursors (mainly isoalliin; unlike garlic no alliin, hence no allicin). A protective effect against apple scab or powdery mildew is not proven.'
    },
    sources: [
      'Yamazaki, Y., Iwasaki, K., Mikami, M., & Yagihashi, A. (2010). Distribution of Eleven Flavor Precursors, S-Alk(en)yl-L-Cysteine Derivatives, in Seven Allium Vegetables. Food Science and Technology Research, 17(1), 55–62. doi:10.3136/fstr.17.55'
    ]
  },
  'plant-nasturtium': {
    howToCut: {
      de: 'Laufend Blätter und Ranken stutzen; nach dem ersten Herbstfrost die erfrorene Masse als Bodendecke liegen lassen.',
      en: 'Lightly trim running vines in summer; after the first autumn frost, leave the collapsed frost-killed mass as ground cover.'
    },
    howMuch: {
      de: 'Im Sommer bis zu 30 % der Ausläufer; im Spätherbst 100 % der Biomasse nutzen.',
      en: 'In summer up to 30% of runners; in late autumn 100% of frost-killed aboveground biomass.'
    },
    whereToSpread: {
      de: 'Als Bodendecke in Zone 1 und 2 liegen lassen.',
      en: 'Leave as a soil-covering blanket across Zone 1 and 2.'
    },
    nutrientBenefit: {
      de: 'Enthält in allen Pflanzenteilen Benzylglucosinolat, das zu Benzylsenföl (BITC) abgebaut wird; eine Wirkung des Mulchs gegen Nematoden ist nicht belegt. Nährt beim Verrotten das Bodenleben.',
      en: 'All plant parts contain benzyl glucosinolate, which breaks down into benzyl isothiocyanate (BITC); an effect of the mulch against nematodes is not shown. Feeds soil life as it decomposes.'
    },
    sources: [
      'Pintão, A. M., Santos, T., & Nogueira, F. (2024). Antimalarial Activity of Aqueous Extracts of Nasturtium (Tropaeolum majus L.) and Benzyl Isothiocyanate. Molecules, 29(10), 2316. doi:10.3390/molecules29102316',
      SRC_DAHLIN_2020
    ]
  },
  'plant-hemp': {
    howToCut: {
      de: 'Im Hochsommer (Juli) die oberen Triebe stutzen; im Spätherbst nach der Samenreife bodennah mit Sichel oder Astschere kappen.',
      en: 'In mid-summer (July) top vegetative shoots; in late autumn after seed maturity cut down flush with sickle or loppers.'
    },
    howMuch: {
      de: 'Im Sommer obere 30–40 % einkürzen. Im Spätherbst auf 5–10 cm über dem Boden kappen und die Wurzeln im Boden belassen.',
      en: 'In summer trim top 30–40%. In late autumn cut down to 5–10 cm above ground and leave the roots in the soil.'
    },
    whereToSpread: {
      de: 'Stängel in 10–20 cm Stücke schneiden und in Zone 2 und 3 unter der Traufkante als Mulchdecke verteilen.',
      en: 'Chop fibrous stalks into 10–20 cm segments and spread across Zone 2 and 3 as a mulch layer.'
    },
    nutrientBenefit: {
      de: 'Kohlenstoffreiche, faserige Stängel ergeben einen langsam verrottenden Mulch, der den Boden beschattet.',
      en: 'High-carbon, fibrous stalks make a slow-decomposing mulch that shades the soil surface.'
    }
  },
  'plant-alder': {
    howToCut: {
      de: 'Auf den Stock setzen im Niederwald-Turnus (2–4 Jahre) im Spätwinter (Jan–Mär) oder belaubte Sommertriebe im Juli schneiteln. Mit Säge oder Astschere.',
      en: 'Coppice on a 2–4 year rotation in late winter (Jan–Mar) or summer leaf-pollard leafy shoots in July. Use a pruning saw or loppers.'
    },
    howMuch: {
      de: 'Stangen auf 15–20 cm über dem Wurzelstock kappen oder Kopf auf 1,8–2,0 m halten, damit die Krone die Star-Pflanze nur lichten Schatten wirft.',
      en: 'Cut poles to 15–20 cm above the stool or keep a pollard head at 1.8–2.0 m so the crown only casts light, dappled shade on the star plant.'
    },
    whereToSpread: {
      de: 'Zweige (< 7 cm) zu Zweighäcksel (BRF) verarbeiten, Sommerlaub direkt 5–10 cm dick in Zone 3 und 4 auslegen; 30 cm Abstand zum Stamm.',
      en: 'Chip branches (< 7 cm) into ramial chipped wood (BRF); lay summer leaves 5–10 cm deep in Zone 3 and 4, keeping 30 cm from the trunk.'
    },
    nutrientBenefit: {
      de: 'Stickstoffreiches Laub aus der Frankia-Symbiose. Die Fixierleistung schwankt stark je nach Standort (Erlen: von einigen bis etwa 320 kg N/ha und Jahr).',
      en: 'Nitrogen-rich leaf litter from the Frankia symbiosis. Fixation varies strongly with site (alders: from several up to about 320 kg N/ha per year).'
    },
    sources: [
      SRC_ALDER_ATLAS,
      'Tobita, H., et al. (2015). Responses of symbiotic N2 fixation in Alnus species to the projected elevated CO2 environment. Trees, 30(2), 523–537. doi:10.1007/s00468-015-1297-x'
    ]
  },
  'plant-linden': {
    howToCut: {
      de: 'Kopfschnitt im Winter (Dez–Feb) alle 2–4 Jahre; belaubte Sommertriebe nach der Blüte (Ende Juli) als Laubmulch schneiden.',
      en: 'Pollard in winter (Dec–Feb) every 2–4 years; cut leafy summer shoots after flowering (late July) for leaf mulch.'
    },
    howMuch: {
      de: 'Alle Ruten bis auf den Kopf in 1,8–2,5 m Höhe (oder 15–20 cm über dem Stock) zurücknehmen.',
      en: 'Remove all rods back to the pollard head at 1.8–2.5 m (or 15–20 cm above the coppice stool).'
    },
    whereToSpread: {
      de: 'Laub und dünne Zweige 5–10 cm dick in Zone 3 und 4 von Obstbäumen verteilen – nicht unter Säureliebhabern wie Tee, Heidelbeere oder Rhododendron.',
      en: 'Spread leaves and thin twigs 5–10 cm deep in Zone 3 and 4 of fruit trees—not under acid-loving plants such as tea, blueberry or rhododendron.'
    },
    nutrientBenefit: {
      de: 'Calciumreiches, schnell umgesetztes Laub; unter Linden fanden sich mehr tiefgrabende Regenwürmer und ein höherer pH-Wert der Humusauflage als unter den meisten anderen Baumarten.',
      en: 'Calcium-rich, fast-turnover litter; under lime trees, studies found more burrowing earthworms and a higher forest-floor pH than under most other tree species.'
    },
    sources: [
      'Reich, P. B., et al. (2005). Linking litter calcium, earthworms and soil properties: a common garden test with 14 tree species. Ecology Letters, 8(8), 811–818. doi:10.1111/j.1461-0248.2005.00779.x',
      'Schelfhout, S., et al. (2017). Tree Species Identity Shapes Earthworm Communities. Forests, 8(3), 85. doi:10.3390/f8030085'
    ]
  },
  'plant-nepal-alder': {
    howToCut: {
      de: 'Seitenäste in der kühlen Trockenzeit (Dez–Feb) schneiteln; Hauptstamm als Schattenschirm stehen lassen.',
      en: 'Lop side branches in the cool dry season (Dec–Feb); keep the main stem as the shade canopy.'
    },
    howMuch: {
      de: 'So viele Seitenäste entfernen, dass über dem Tee lichter Filterschatten bleibt.',
      en: 'Remove enough side branches to keep light, filtered shade over the tea.'
    },
    whereToSpread: {
      de: 'Laub und Feinreisig zwischen den Teereihen (Zone 3 und 4) als Mulch auslegen.',
      en: 'Lay leaves and fine twigs between the tea rows (Zone 3 and 4) as mulch.'
    },
    nutrientBenefit: {
      de: 'Stickstoff fixierender (Frankia) Schattenbaum. In Teegärten mit Nepal-Erle war die Biomasse der Bodenpilze um 41 % und der Bodenbakterien um 10 % höher, der Teeertrag um 52–72 %.',
      en: 'Nitrogen-fixing (Frankia) shade tree. In tea plantations with Nepal alder, soil fungal biomass was 41% and bacterial biomass 10% higher, and tea yield 52–72% higher.'
    },
    sources: [
      'Mortimer, P. E., Gui, H., Xu, J., Zhang, C., Barrios, E., & Hyde, K. D. (2015). Alder trees enhance crop productivity and soil microbial biomass in tea plantations. Applied Soil Ecology, 96, 25–32. doi:10.1016/j.apsoil.2015.05.012',
      SRC_BEER_1987
    ]
  },
  'plant-albizia': {
    howToCut: {
      de: 'In der kühlen Trockenzeit (Dez–Feb) schneiteln und die Krone so niedrig halten, dass sie den Tee nur licht überschirmt.',
      en: 'Lop in the cool dry season (Dec–Feb), keeping the crown low enough to cast only light shade over the tea.'
    },
    howMuch: {
      de: 'Kronenschatten über dem Tee auf lichten Filterschatten auslichten.',
      en: 'Thin the crown to light, filtered shade over the tea.'
    },
    whereToSpread: {
      de: 'Fiederblätter, Zweige und Hülsen zwischen den Teereihen (Zone 3 und 4) liegen lassen.',
      en: 'Leave leaflets, twigs and pods between the tea rows (Zone 3 and 4).'
    },
    nutrientBenefit: {
      de: 'Leguminosen-Schattenbaum, dessen Laub dem Teeboden organische Substanz zuführt.',
      en: 'Leguminous shade tree whose litter adds organic matter to the tea soil.'
    },
    sources: [SRC_BEER_1987]
  },
  'plant-rhubarb': {
    howToCut: {
      de: 'Nach Ernteende (traditionell Johannistag, 24. Juni; spätestens Anfang Juli) die großen Blätter am Stielansatz abschneiden; Blütenstängel sofort entfernen.',
      en: 'After the harvest ends (traditionally St John\'s Day, June 24; at the latest early July) cut the large leaves at the stalk base; remove flower stalks immediately.'
    },
    howMuch: {
      de: 'Höchstens etwa ein Drittel der Blätter nehmen, damit genug Laub die Pflanze im Wachstum hält.',
      en: 'Take no more than about a third of the leaves so enough foliage keeps the plant in active growth.'
    },
    whereToSpread: {
      de: 'Blattspreiten flach als Unkrautsperre in Zone 3 auslegen; Abstand zum Stamm 30 cm.',
      en: 'Lay leaf blades flat as a weed barrier in Zone 3, 30 cm away from the trunk.'
    },
    nutrientBenefit: {
      de: 'Große Blattmasse beschattet den Boden und hält Feuchtigkeit.',
      en: 'Large leaf mass shades the soil and conserves moisture.'
    },
    sources: [
      'Royal Horticultural Society (n.d.). How to grow rhubarb. RHS Grow Your Own. https://www.rhs.org.uk/vegetables/rhubarb/grow-your-own'
    ]
  },
  'plant-sorghum-sudangrass': {
    howToCut: {
      de: 'Mähen, sobald die Halme 0,9–1,2 m erreichen; bei Sommerschnitten mindestens 15 cm Stoppeln für den Nachwuchs stehen lassen. Der Schnitt steigert die Wurzelmasse auf das Fünf- bis Achtfache.',
      en: 'Mow whenever the stalks reach 0.9–1.2 m; for mid-summer cuts leave at least 15 cm of stubble for regrowth. Mowing raises root mass five- to eightfold.'
    },
    howMuch: {
      de: 'Zum Schluss den ganzen Bestand häckseln und noch grün und vor dem ersten Frost einarbeiten – sonst geht die Wirkung gegen Nematoden verloren.',
      en: 'At the end, chop the whole stand and work it in while still green and before the first frost – otherwise the effect against nematodes is lost.'
    },
    whereToSpread: {
      de: 'Auf dem künftigen Pflanzplatz oder in der Fahrgasse einer jungen Anlage einarbeiten, nicht rund um junge Bäume: Sein Wurzelausscheidungsstoff Sorgoleon hemmte in Baumschulversuchen auch Gehölzsämlinge.',
      en: 'Work it into the future planting spot or the alley of a young orchard, not around young trees: its root exudate sorgoleone also suppressed tree seedlings in nursery tests.'
    },
    nutrientBenefit: {
      de: 'Etwa 4,5–5,6 t/ha Trockenmasse. Vor einer Pfirsich-Nachpflanzung grün eingearbeitet, unterdrückte eine Sorghum-Gründüngung Ringnematoden anfangs etwa so gut wie Methylbromid.',
      en: 'About 4.5–5.6 t/ha of dry matter. Worked in green before replanting peach, a sorghum green manure suppressed ring nematodes about as well as methyl bromide at first.'
    },
    sources: [
      'Clark, A. (Ed.) (2007). Sorghum sudangrass hybrids. In Managing Cover Crops Profitably (3rd ed., SARE Handbook Series 9). Sustainable Agriculture Research and Education. https://www.sare.org/publications/managing-cover-crops-profitably/nonlegume-cover-crops/sorghum-sudangrass/',
      'Nyczepir, A. P., & Rodriguez-Kabana, R. (2007). Preplant biofumigation with sorghum or methyl bromide compared for managing Criconemoides xenoplax in a young peach orchard. Plant Disease, 91(12), 1607–1611. doi:10.1094/PDIS-91-12-1607'
    ]
  },
  'plant-buckwheat': {
    howToCut: {
      de: 'Spätestens 10 Tage nach Blühbeginn mähen (etwa 6 Wochen nach der Saat), bevor Samen reifen.',
      en: 'Mow no later than 10 days after the plants begin to flower (about 6 weeks after sowing), before seed sets.'
    },
    howMuch: {
      de: 'Den ganzen Bestand schneiden, sonst sät er sich selbst aus. Mehrere Aussaaten pro Sommer sind möglich.',
      en: 'Cut the whole stand; otherwise it reseeds itself. Several sowings per summer are possible.'
    },
    whereToSpread: {
      de: 'Das Schnittgut als Mulch in der Traufzone (Zone 3) liegen lassen oder flach einarbeiten; beim Abbau gibt es den aufgenommenen Phosphor an die Folgekultur ab.',
      en: 'Leave the cut plants as mulch in the drip zone (Zone 3) or work them in shallowly; as the residue breaks down it releases the phosphorus it took up to the next crop.'
    },
    nutrientBenefit: {
      de: 'Erschließt calciumgebundenen Bodenphosphor: In einem Versuch nahm er 40 kg P/ha auf, Weizen 16 kg, und hinterließ mehr verfügbaren P für die Folgekultur.',
      en: 'Mobilises calcium-bound soil phosphorus: in one trial it took up 40 kg P/ha against 16 kg for wheat and left more available P for the next crop.'
    },
    sources: [
      'Björkman, T., Bellinder, R. R., Hahn, R. R., & Shail, J. W. (2008). Buckwheat cover crop handbook. Cornell University, Geneva, NY. http://www.hort.cornell.edu/bjorkman/lab/covercrops/pdf/bwbrochure.pdf',
      'Teboh, J. M., & Franzen, D. W. (2011). Buckwheat (Fagopyrum esculentum Moench) potential to contribute solubilized soil phosphorus to subsequent crops. Communications in Soil Science and Plant Analysis, 42(13), 1544–1550. doi:10.1080/00103624.2011.581724'
    ]
  },
  'plant-phacelia': {
    howToCut: {
      de: 'Nach dem Ende der Blüte und vor der Samenreife mähen oder vor Ort mulchen; Spätsommersaaten erfrieren bei etwa -8 °C und können im Winter gemulcht werden.',
      en: 'Mow or mulch in place once flowering ends, before the seeds ripen; late-summer sowings are killed by frost at about -8 °C and can be mulched in winter.'
    },
    howMuch: {
      de: 'Den ganzen Bestand schneiden; für Bienen gestaffelt säen und jeweils nur einen Streifen schneiden.',
      en: 'Cut the whole stand; for bees, sow in succession and cut one strip at a time.'
    },
    whereToSpread: {
      de: 'Den Mulch in der Fahrgasse oder Traufzone liegen lassen: In einem Weinberg beschleunigte im Winter vor Ort gemulchte Phazelie den Abbau von Rebresten und senkte das Botrytis-Inokulum und die Traubenfäule.',
      en: 'Leave the mulch in place in the inter-row or drip zone: in a vineyard, phacelia mulched in place in winter sped up the breakdown of vine debris and lowered Botrytis inoculum and bunch rot.'
    },
    nutrientBenefit: {
      de: 'Als Zwischenfrucht steigerte sie die Phosphoraufnahme der Folgekulturen und den Boden-P etwa so stark wie Stallmist, Kompost oder mineralischer P-Dünger.',
      en: 'As a catch crop it raised the phosphorus uptake of following crops and soil P about as much as manure, compost or mineral P fertiliser.'
    },
    sources: [
      'Eichler-Löbermann, B., Köhne, S., Kowalski, B., & Schnug, E. (2008). Effect of catch cropping on phosphorus bioavailability in comparison to organic and inorganic fertilization. Journal of Plant Nutrition, 31(4), 659–676. doi:10.1080/01904160801926517',
      'Jacometti, M. A., Wratten, S. D., & Walter, M. (2007). Enhancing ecosystem services in vineyards: using cover crops to decrease botrytis bunch rot severity. International Journal of Agricultural Sustainability, 5(4), 305–314. doi:10.1080/14735903.2007.9684830',
      'Smither-Kopperl, M. (2018). Plant guide for lacy phacelia (Phacelia tanacetifolia). USDA-Natural Resources Conservation Service, Lockeford Plant Materials Center, Lockeford, CA. https://plants.usda.gov/DocumentLibrary/plantguide/pdf/pg_phta.pdf'
    ]
  },
  'plant-fodder-radish': {
    howToCut: {
      de: 'Im August säen; Frost um etwa -7 °C lässt ihn an Ort und Stelle absterben. In milden Herbsten vor der Samenbildung mähen oder einarbeiten, damit er nicht verunkrautet.',
      en: 'Sow in August; frost at about -7 °C kills it in place. In mild autumns mow or till before seed set so that it does not become a weed.'
    },
    howMuch: {
      de: 'Den ganzen Aufwuchs schneiden und die Wurzeln im Boden verrotten lassen.',
      en: 'Cut the whole top and leave the roots to decompose in the soil.'
    },
    whereToSpread: {
      de: 'Das abgestorbene Kraut als Mulch in der Traufzone liegen lassen. Auf einem Nachbau-Pflanzplatz stattdessen als Biofumigation nutzen: zur Blüte häckseln und sofort einarbeiten.',
      en: 'Leave the dead tops as mulch in the drip zone. On a replant spot use it as biofumigation instead: chop at flowering and work it in at once.'
    },
    nutrientBenefit: {
      de: 'Wurzeln tiefer als 2,4 m nehmen Nitrat auf, das unter normale Wurzeln ausgewaschen wurde; die Reste geben diese Nährstoffe an die Folgekultur ab.',
      en: 'Roots deeper than 2.4 m take up nitrate that has leached below ordinary roots; the residue releases these nutrients to the next crop.'
    },
    sources: [
      'Kristensen, H. L., & Thorup-Kristensen, K. (2004). Root growth and nitrate uptake of three different catch crops in deep soil layers. Soil Science Society of America Journal, 68(2), 529–537. doi:10.2136/sssaj2004.5290',
      'Sundermeier, A. (2008). Oilseed radish cover crop (SAG-5). Ohio State University Extension. https://ohioline.osu.edu/factsheet/SAG-5',
      'Yim, B., Hanschen, F. S., Wrede, A., Nitt, H., Schreiner, M., Smalla, K., & Winkelmann, T. (2016). Effects of biofumigation using Brassica juncea and Raphanus sativus in comparison to disinfection using Basamid on apple plant growth and soil microbial communities at three field sites with replant disease. Plant and Soil, 406(1–2), 389–408. doi:10.1007/s11104-016-2876-3'
    ]
  },
  'plant-indian-mustard': {
    howToCut: {
      de: 'Zur Blüte häckseln und sofort in den Boden einarbeiten, damit die aus den Glucosinolaten freigesetzten Isothiocyanate im Boden wirken.',
      en: 'Chop at flowering and work it into the soil immediately, so that the isothiocyanates released from its glucosinolates act in the soil.'
    },
    howMuch: {
      de: 'Den ganzen Bestand vor dem Einarbeiten möglichst fein zerkleinern.',
      en: 'Chop the whole stand as finely as possible before working it in.'
    },
    whereToSpread: {
      de: 'Auf dem künftigen Pflanzplatz eines Baumes auf Boden mit Nachbaukrankheit einarbeiten. In Feldversuchen war die Wirkung auf Apfelunterlagen an manchen Standorten deutlich, an anderen fehlte sie, und sie war schwächer als eine chemische Bodenentseuchung.',
      en: 'Work it into the future planting spot of a tree on replant-disease soil. In field trials the effect on apple rootstocks was clear at some sites and absent at others, and weaker than chemical fumigation.'
    },
    nutrientBenefit: {
      de: 'Biofumigation: Seine Glucosinolate zerfallen im Boden zu Isothiocyanaten. Auf Boden mit Nachbaukrankheit wuchsen Apfelunterlagen an einem Standort mit 148 % mehr Sprossmasse, an einem zweiten nicht.',
      en: 'Biofumigation: its glucosinolates break down into isothiocyanates in the soil. On replant-disease soil, apple rootstocks grew 148 % more shoot mass at one site but not at a second.'
    },
    sources: [
      'Yim, B., Hanschen, F. S., Wrede, A., Nitt, H., Schreiner, M., Smalla, K., & Winkelmann, T. (2016). Effects of biofumigation using Brassica juncea and Raphanus sativus in comparison to disinfection using Basamid on apple plant growth and soil microbial communities at three field sites with replant disease. Plant and Soil, 406(1–2), 389–408. doi:10.1007/s11104-016-2876-3',
      'Yim, B., Nitt, H., Wrede, A., Jacquiod, S., Sørensen, S. J., Winkelmann, T., & Smalla, K. (2017). Effects of soil pre-treatment with Basamid granules, Brassica juncea, Raphanus sativus, and Tagetes patula on bacterial and fungal communities at two apple replant disease sites. Frontiers in Microbiology, 8, 1604. doi:10.3389/fmicb.2017.01604',
      'SARE Outreach (2007). Brassicas and mustards (contributors: Chen, G., Clark, A., Kremen, A., Lawley, Y., Price, A., Stocking, L., & Weil, R.). In Managing Cover Crops Profitably (3rd ed.). Sustainable Agriculture Research and Education. https://www.sare.org/publications/managing-cover-crops-profitably/nonlegume-cover-crops/brassicas-and-mustards/'
    ]
  },
  'plant-tithonia': {
    howToCut: {
      de: 'Blätter und weiche Triebe regelmäßig schneiden, immer vor der Samenreife: Sie blüht und fruchtet ganzjährig und ist außerhalb ihrer Heimat invasiv.',
      en: 'Cut leaves and soft shoots regularly, always before seed set: it flowers and seeds all year and is invasive outside its native range.'
    },
    howMuch: {
      de: 'Eine reine Hecke liefert rund 1 kg Trockenmasse pro Meter und Jahr; die grünen Blätter enthalten etwa 3,5 % N, 0,37 % P und 4,1 % K in der Trockenmasse.',
      en: 'A pure hedge yields about 1 kg of dry biomass per metre per year; the green leaves hold about 3.5 % N, 0.37 % P and 4.1 % K of dry matter.'
    },
    whereToSpread: {
      de: 'Die Blätter in den Wurzelbereich der Star-Pflanze tragen und als Mulch verteilen; sie zersetzen sich schnell. Das verteilt Nährstoffe im Garten um, statt neue zuzuführen.',
      en: 'Carry the leaves to the root zone of the star plant and spread them as mulch; they decompose rapidly. This moves nutrients within the garden rather than adding new ones.'
    },
    nutrientBenefit: {
      de: 'Die Blätter enthalten etwa 3,5 % N, 0,37 % P und 4,1 % K in der Trockenmasse; 5 t/ha Blatt-Trockenmasse liefern etwa 159 kg N, 15 kg P, 161 kg K und 100 kg Ca je Hektar.',
      en: 'Leaves hold about 3.5 % N, 0.37 % P and 4.1 % K of dry matter; 5 t/ha of leafy dry matter supply about 159 kg N, 15 kg P, 161 kg K and 100 kg Ca per hectare.'
    },
    sources: [
      'Jama, B., Palm, C. A., Buresh, R. J., Niang, A., Gachengo, C., Nziguheba, G., & Amadalo, B. (2000). Tithonia diversifolia as a green manure for soil fertility improvement in western Kenya: A review. Agroforestry Systems, 49(2), 201–221. doi:10.1023/A:1006339025728',
      'Orwa, C., Mutua, A., Kindt, R., Jamnadass, R., & Anthony, S. (2009). Agroforestree Database: a tree reference and selection guide version 4.0 – Tithonia diversifolia. World Agroforestry Centre, Kenya. https://apps.worldagroforestry.org/treedb/AFTPDFS/Tithonia_diversifolia.PDF'
    ]
  },
  'plant-gliricidia': {
    howToCut: {
      de: 'Erster Schnitt etwa 12–18 Monate nach der Pflanzung, danach alle 8–12 Monate, immer vor der Blüte.',
      en: 'First lopping about 12–18 months after planting, then every 8–12 months, always before flowering.'
    },
    howMuch: {
      de: 'Auf 0,3–1,5 m zurückschneiden, um den Blattaustrieb anzuregen; Blätter und Triebspitzen sind die Gründüngung.',
      en: 'Prune at 0.3–1.5 m to stimulate leaf production; the leaves and shoot tips are the green manure.'
    },
    whereToSpread: {
      de: 'Blätter und Triebspitzen als Mulch zwischen den Teesträuchern verteilen; in einer Feldstudie in Sri Lanka wurden etwa 80 % des Stickstoffs eingearbeiteter Blätter innerhalb von 4–5 Wochen freigesetzt. Blätter, Samen und Rinde sind giftig, daher nicht verfüttern.',
      en: 'Spread leaves and shoot tips between the tea bushes as mulch; about 80 % of the nitrogen in incorporated leaves was released within 4–5 weeks in a Sri Lankan field study. Leaves, seeds and bark are toxic, so do not use them as fodder.'
    },
    nutrientBenefit: {
      de: 'Stickstoffbindende Leguminose; etwa 80 % des Stickstoffs eingearbeiteter Blätter wurden innerhalb von 4–5 Wochen freigesetzt.',
      en: 'Nitrogen-fixing legume; about 80 % of the nitrogen in incorporated leaves was released within 4–5 weeks.'
    },
    sources: [
      'Tea Research Institute of Sri Lanka (2018). Guidelines for establishment of energy plantations with Gliricidia sepium and Calliandra calothrysus (Guideline No. 04/2018). TRI, Talawakelle. https://www.tri.lk/wp-content/uploads/2023/05/TRISL_Guideline_04_2018_E.pdf',
      'Orwa, C., Mutua, A., Kindt, R., Jamnadass, R., & Anthony, S. (2009). Agroforestree Database: a tree reference and selection guide version 4.0 – Gliricidia sepium. World Agroforestry Centre, Kenya. https://apps.worldagroforestry.org/treedb/AFTPDFS/Gliricidia_sepium.PDF',
      'Herath, U. S., Wickramasinghe, W. M. D. M., Rankoth, L. M., & Egodawatta, W. C. P. (2023). Decomposition and nitrogen mineralization of Gliricidia sepium leaf green manure under diverse nutrient management strategies in irrigated lowland rice cropping systems in Sri Lanka. Tropical Agricultural Research and Extension, 26(3), 162–179. doi:10.4038/tare.v26i3.5648'
    ]
  },
  'plant-common-vetch': {
    howToCut: {
      de: 'Kurz vor der Rebblüte häckseln, spätestens bei etwa 80 % Blüte und vor der Samenreife, denn ihre hartschaligen Samen können sie zum Unkraut machen.',
      en: 'Chop just before grape flowering, at the latest at about 80 % bloom and before seed set, because its hard seed can make it weedy.'
    },
    howMuch: {
      de: 'Den ganzen Bestand schneiden und zerkleinern.',
      en: 'Cut and chop the whole stand.'
    },
    whereToSpread: {
      de: 'In den Boden der Fahrgasse einarbeiten oder dort als Mulch liegen lassen. Im Weinbergversuch senkte eine Frühjahrsbegrünung aus 92 % Wicke, vor der Rebblüte eingearbeitet, den Falschen und Echten Mehltau in unbehandelten Parzellen.',
      en: 'Work it into the inter-row soil or leave it as mulch there. In the vineyard trial, a spring cover of 92 % vetch worked in before grape flowering reduced downy and powdery mildew in unsprayed plots.'
    },
    nutrientBenefit: {
      de: 'Stickstoffbindende Leguminose (Rhizobium leguminosarum bv. viciae); die Frühjahrsbegrünung mit Wicke senkte außerdem Falschen und Echten Mehltau der Rebe in unbehandelten Parzellen.',
      en: 'Nitrogen-fixing legume (Rhizobium leguminosarum bv. viciae); the spring vetch cover also reduced downy and powdery mildew of grapevine in unsprayed plots.'
    },
    sources: [
      'Southern Cover Crops Council (n.d.). Cover crop information sheet: Vetch, common (Vicia sativa). https://southerncovercrops.org/wp-content/uploads/2018/10/Vetch-Common-Row-Crop-CP.pdf',
      'Hasanaliyeva, G., Furiosi, M., Rossi, V., & Caffi, T. (2024). Cover crops lower the dispersal of grapevine foliar pathogens from the ground and contribute to early-season disease management. Frontiers in Plant Science, 15, 1498848. doi:10.3389/fpls.2024.1498848'
    ]
  }
};

type ChoreType = 'PLANTING' | 'CHOP_AND_DROP' | 'HARVEST' | 'CANOPY_PRUNING' | 'WINTER_CARE';

/** Month/day for a chore in a given season; shifted by six months for the southern hemisphere. */
function resolveSeasonDate(
  season: PhenoSeason,
  choreType: ChoreType,
  hemisphere: Hemisphere = 'NORTHERN',
  override?: { month: number; day: number }
): { month: number; day: number } {
  let month = 4;
  let day = 15;

  switch (override ? 'OVERRIDE' : season) {
    case 'OVERRIDE':
      month = override!.month; day = override!.day;
      break;

    case 'EARLY_SPRING':
      if (choreType === 'CANOPY_PRUNING') { month = 3; day = 1; }
      else if (choreType === 'PLANTING') { month = 4; day = 5; }
      else if (choreType === 'HARVEST') { month = 4; day = 15; }
      else { month = 4; day = 20; }
      break;

    case 'LATE_SPRING':
      if (choreType === 'PLANTING') { month = 5; day = 15; }
      else if (choreType === 'CHOP_AND_DROP') { month = 5; day = 25; }
      else if (choreType === 'HARVEST') { month = 5; day = 20; }
      else { month = 5; day = 18; }
      break;

    case 'SUMMER':
      if (choreType === 'PLANTING') { month = 6; day = 15; }
      else if (choreType === 'CHOP_AND_DROP') { month = 7; day = 15; }
      else if (choreType === 'HARVEST') { month = 7; day = 25; }
      else { month = 8; day = 1; }
      break;

    case 'AUTUMN':
      if (choreType === 'PLANTING') { month = 10; day = 15; }
      else if (choreType === 'CHOP_AND_DROP') { month = 10; day = 10; }
      else if (choreType === 'HARVEST') { month = 9; day = 25; }
      else { month = 10; day = 5; }
      break;

    case 'WINTER':
      if (choreType === 'CANOPY_PRUNING') { month = 2; day = 15; }
      else if (choreType === 'WINTER_CARE') { month = 11; day = 20; }
      else if (choreType === 'CHOP_AND_DROP') { month = 2; day = 20; }
      else { month = 12; day = 1; }
      break;
  }

  if (hemisphere === 'SOUTHERN') {
    month = ((month + 5) % 12) + 1;
  }

  return { month, day };
}

function formatDateIcs(y: number, m: number, d: number): string {
  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  return `${y}${pad(m)}${pad(d)}`;
}

function getNextDayDateIcs(y: number, m: number, d: number): string {
  const next = new Date(y, m - 1, d + 1);
  return formatDateIcs(next.getFullYear(), next.getMonth() + 1, next.getDate());
}

/** First occurrence of the chore on or after minDate (so nothing lands in the past or before planting). */
function getNextOccurringDate(
  season: PhenoSeason,
  choreType: ChoreType,
  minDate: Date,
  hemisphere: Hemisphere = 'NORTHERN',
  override?: { month: number; day: number }
): { dateObj: Date; dateStr: string; nextDayStr: string } {
  const minTimestamp = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()).getTime();
  const { month, day } = resolveSeasonDate(season, choreType, hemisphere, override);
  let year = minDate.getFullYear();
  if (new Date(year, month - 1, day).getTime() < minTimestamp) year += 1;

  return {
    dateObj: new Date(year, month - 1, day),
    dateStr: formatDateIcs(year, month, day),
    nextDayStr: getNextDayDateIcs(year, month, day)
  };
}

export const CHOP_INSTRUCTIONS_MAP = DEDICATED_CHOP_INSTRUCTIONS;

/**
 * Legumes cut at a bloom stage rather than at the generic late-spring date (25 May):
 * lupine at mid-bloom (SARE: "terminate the legume at mid-bloom when the cover crop contains
 * the most nitrogen"; Lupinus perennis blooms May–July) and sainfoin mown around full bloom.
 * Northern-hemisphere dates; resolveSeasonDate shifts them for the southern hemisphere.
 */
export const BLOOM_STAGE_CHOP_DATES: Record<string, Partial<Record<PhenoSeason, { month: number; day: number }>>> = {
  'plant-lupine': { LATE_SPRING: { month: 6, day: 15 } },
  'plant-sainfoin': { LATE_SPRING: { month: 6, day: 15 } }
};

/** TEXT value escaping per RFC 5545 §3.3.11. */
export function escapeIcsText(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n?|\n/g, '\\n');
}

function utf8Length(codePoint: number): number {
  return codePoint < 0x80 ? 1 : codePoint < 0x800 ? 2 : codePoint < 0x10000 ? 3 : 4;
}

/**
 * Folds to at most 75 octets per line (RFC 5545 §3.1). Splits only between code points so
 * multi-byte UTF-8 sequences stay intact; the leading space of a continuation counts toward the limit.
 */
export function foldIcsLine(line: string): string {
  const chunks: string[] = [];
  let currentChunk = '';
  let currentByteLen = 0;

  for (const char of line) {
    const charBytes = utf8Length(char.codePointAt(0)!);
    if (currentByteLen + charBytes > 75) {
      chunks.push(currentChunk);
      currentChunk = ' ' + char;
      currentByteLen = 1 + charBytes;
    } else {
      currentChunk += char;
      currentByteLen += charBytes;
    }
  }
  chunks.push(currentChunk);

  return chunks.join('\r\n');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function soilName(soil: SoilType, tr: ReturnType<typeof t>): string {
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

function getMimeTypeFromUrl(url: string): string {
  if (url.endsWith('.webp')) return 'image/webp';
  if (url.endsWith('.svg')) return 'image/svg+xml';
  if (url.endsWith('.png')) return 'image/png';
  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg';
  return 'image/webp';
}

interface BrandedEventConfig {
  categoryTitle: string;
  commonName: string;
  botanicalName: string;
  guildTreeName: string;
  seasonLabel: string;
  recurrenceText: string;
  imageUrl: string;
  metaPills: { label: string; bg: string; color: string; border: string }[];
  instructionHeading: string;
  instructions: { label: string; text: string }[];
  detailRows?: { label: string; text: string }[];
  guideUrl?: string;
  guideLabel?: string;
  guildShareUrl: string;
  baseUrl: string;
  language: Language;
}

/** Plain-text DESCRIPTION plus an HTML card for X-ALT-DESC (Outlook, Thunderbird, Apple Calendar). */
function buildBrandedDescriptions(config: BrandedEventConfig): { plainText: string; htmlText: string } {
  const {
    categoryTitle,
    commonName,
    botanicalName,
    guildTreeName,
    seasonLabel,
    recurrenceText,
    imageUrl,
    metaPills,
    instructionHeading,
    instructions,
    detailRows = [],
    guideUrl,
    guideLabel,
    guildShareUrl,
    baseUrl,
    language
  } = config;

  const tr = t(language);
  const width = 60;
  const dividerDouble = '='.repeat(width);
  const dividerSingle = '-'.repeat(width);

  const plainLines: string[] = [];
  plainLines.push(dividerDouble);
  plainLines.push(tr.calendarPlainHeader);
  plainLines.push(dividerDouble);
  plainLines.push(`${tr.calendarPlainTask}:        ${categoryTitle}`);
  plainLines.push(`${tr.calendarPlainPlant}:        ${commonName}${botanicalName ? ` (${botanicalName})` : ''}`);
  plainLines.push(`${tr.calendarPlainStarTree}:    ${guildTreeName}`);
  plainLines.push(`${tr.calendarPlainTiming}:        ${seasonLabel} • ${recurrenceText}`);
  plainLines.push(``);

  plainLines.push(dividerSingle);
  plainLines.push(instructionHeading.toUpperCase() + ':');
  plainLines.push(dividerSingle);
  instructions.forEach((i) => {
    plainLines.push(`• ${i.label}:`);
    plainLines.push(`  ${i.text}`);
    plainLines.push(``);
  });

  if (detailRows.length > 0) {
    plainLines.push(dividerSingle);
    plainLines.push(tr.calendarPlainSiteDetails);
    plainLines.push(dividerSingle);
    detailRows.forEach((r) => {
      plainLines.push(`• ${r.label}: ${r.text}`);
    });
    plainLines.push(``);
  }

  plainLines.push(dividerSingle);
  plainLines.push(tr.calendarPlainGuideLinks);
  plainLines.push(dividerSingle);
  if (guideUrl) {
    plainLines.push(`• ${guideLabel || tr.calendarPlainFieldGuide}:`);
    plainLines.push(`  ${guideUrl}`);
  }
  plainLines.push(`• ${tr.calendarPlainOpenGuild}:`);
  plainLines.push(`  ${guildShareUrl}`);
  if (imageUrl && !imageUrl.endsWith('favicon.svg')) {
    plainLines.push(`• ${tr.calendarPlainPlantPhoto}:`);
    plainLines.push(`  ${imageUrl}`);
  }
  plainLines.push(``);
  plainLines.push(dividerDouble);
  plainLines.push('                                            pflanzengilde.de');
  plainLines.push(tr.calendarPlainFooter);

  const plainText = plainLines.join('\n');

  const h = escapeHtml;
  const metaPillsHtml = metaPills
    .map(
      (p) =>
        `<span style="display:inline-block;background-color:${p.bg};color:${p.color};border:1px solid ${p.border};font-size:11px;font-weight:700;padding:3px 8px;border-radius:6px;margin:0 4px 4px 0;">${h(p.label)}</span>`
    )
    .join('');

  const instructionsRowsHtml = instructions
    .map(
      (i) =>
        `<tr><td style="font-weight:700;color:#292524;padding:4px 8px 4px 0;vertical-align:top;width:125px;white-space:nowrap;">${h(i.label)}:</td><td style="color:#44403c;padding:4px 0;vertical-align:top;">${h(i.text)}</td></tr>`
    )
    .join('');

  const detailsRowsHtml =
    detailRows.length > 0
      ? `<div style="background-color:#f5f5f4;border:1px solid #e7e5e4;border-radius:12px;padding:10px 14px;margin-bottom:14px;"><table style="width:100%;border-collapse:collapse;font-size:11.5px;">` +
        detailRows
          .map(
            (r) =>
              `<tr><td style="font-weight:700;color:#44403c;padding:3px 8px 3px 0;vertical-align:top;width:125px;white-space:nowrap;">${h(r.label)}:</td><td style="color:#57534e;padding:3px 0;vertical-align:top;">${h(r.text)}</td></tr>`
          )
          .join('') +
        `</table></div>`
      : '';

  const guideButtonHtml = guideUrl
    ? `<a href="${h(guideUrl)}" target="_blank" style="background-color:#15803d;color:#ffffff;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;display:inline-block;margin-right:8px;box-shadow:0 1px 2px rgba(0,0,0,0.05);">${h(guideLabel || tr.calendarHtmlViewGuide)}</a>`
    : '';

  const guildButtonHtml = `<a href="${h(guildShareUrl)}" target="_blank" style="background-color:#f5f5f4;color:#292524;border:1px solid #d6d3d1;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;display:inline-block;">${h(tr.calendarHtmlOpenInPlanner)}</a>`;

  const htmlText = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c1917;background-color:#fafaf9;margin:0;padding:12px;line-height:1.5;"><div style="background-color:#ffffff;border:1px solid #e7e5e4;border-radius:16px;padding:16px;max-width:580px;box-shadow:0 2px 8px rgba(0,0,0,0.04);"><table style="width:100%;border-collapse:collapse;border-bottom:2px solid #f5f5f4;padding-bottom:12px;margin-bottom:12px;"><tr><td style="width:58px;vertical-align:middle;padding-right:12px;"><img src="${h(imageUrl)}" width="54" height="54" style="border-radius:12px;object-fit:cover;border:1px solid #d6d3d1;display:block;" alt="${h(commonName)}" /></td><td style="vertical-align:middle;"><div style="font-size:11px;font-weight:800;color:#15803d;text-transform:uppercase;letter-spacing:0.5px;">${h(categoryTitle)} • ${h(seasonLabel)}</div><div style="font-size:18px;font-weight:800;color:#1c1917;margin:2px 0;">${h(commonName)}</div>${botanicalName ? `<div style="font-size:12px;color:#78716c;font-style:italic;">${h(botanicalName)}</div>` : ''}</td></tr></table><div style="margin-bottom:14px;">${metaPillsHtml}</div><div style="background-color:#fcfcfc;border:1px solid #f0f0f0;border-left:4px solid #16a34a;border-radius:8px;padding:12px 14px;margin-bottom:14px;"><div style="font-size:12px;font-weight:800;color:#166534;text-transform:uppercase;margin-bottom:8px;letter-spacing:0.5px;">${h(instructionHeading)}</div><table style="width:100%;border-collapse:collapse;font-size:12px;">${instructionsRowsHtml}</table></div>${detailsRowsHtml}<div style="margin-bottom:16px;">${guideButtonHtml}${guildButtonHtml}</div><div style="border-top:1px solid #e7e5e4;padding-top:10px;text-align:right;"><a href="${h(baseUrl)}" target="_blank" style="display:inline-block;text-decoration:none;color:#166534;font-weight:700;font-size:12px;"><table style="display:inline-table;border-collapse:collapse;margin-left:auto;"><tr><td style="padding-right:6px;vertical-align:middle;"><img src="${h(baseUrl)}/favicon.svg" width="18" height="18" style="display:block;border-radius:4px;" alt="Logo" /></td><td style="vertical-align:middle;color:#166534;font-size:13px;font-weight:700;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Pflanzengilde.de</td></tr></table></a></div></div></body></html>`;

  return { plainText, htmlText };
}

export function generateGuildCalendarIcs(options: CalendarExportOptions): string {
  const {
    starTree,
    selectedPlants,
    selectedSoil = 'LOAM',
    selectedZone = 'TEMPERATE',
    hemisphere = 'NORTHERN',
    language = 'de',
    baseUrl = 'https://pflanzengilde.de'
  } = options;
  const tr = t(language);

  const today = new Date();
  const events: IcsEvent[] = [];

  const treeCommonName = getLoc(starTree.commonName, language);
  const guildShareUrl = buildShareUrl({
    starTree,
    selectedPlants,
    soil: selectedSoil,
    zone: selectedZone,
    hemisphere,
    language,
    baseUrl
  });

  const nowStamp = today.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const treeImgUrl = starTree.imageUrl ? (starTree.imageUrl.startsWith('http') ? starTree.imageUrl : `${baseUrl}${starTree.imageUrl}`) : `${baseUrl}/favicon.svg`;
  const treeAttachments = [
    { url: treeImgUrl, mimeType: getMimeTypeFromUrl(treeImgUrl) },
    { url: `${baseUrl}/favicon.svg`, mimeType: 'image/svg+xml' }
  ];

  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Star tree: one-off planting, then yearly pruning, harvest and winter care from the planting date on.
  const treePlantSeason: PhenoSeason = starTree.plantingTime?.de?.toLowerCase().includes('herbst') ? 'AUTUMN' : 'EARLY_SPRING';
  const treePlantTiming = getNextOccurringDate(treePlantSeason, 'PLANTING', todayMidnight, hemisphere);
  const treePlantStart = treePlantTiming.dateStr;
  const treePlantEnd = treePlantTiming.nextDayStr;
  const treeFirstPlantingDate = treePlantTiming.dateObj;

  const treePlantTitle = tr.calendarTreePlantTitle
    .replace('{tree}', treeCommonName)
    .replace('{botanical}', starTree.botanicalName);

  const treePlantingDescs = buildBrandedDescriptions({
    categoryTitle: tr.calendarCatPlantingUpper,
    commonName: treeCommonName,
    botanicalName: starTree.botanicalName,
    guildTreeName: treeCommonName,
    seasonLabel: treePlantSeason === 'AUTUMN' ? tr.seasonAutumn : tr.calendarSeasonSpring,
    recurrenceText: tr.calendarOneTimePlanting,
    imageUrl: treeImgUrl,
    metaPills: [
      { label: `🌳 ${tr.calendarPillKeystoneTree}`, bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
      { label: `📍 Zone 0–3`, bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
      { label: tr.calendarPillOneTimeTask, bg: '#fefce8', color: '#854d0e', border: '#fef08a' }
    ],
    instructionHeading: tr.calendarTreePlantHeading,
    instructions: [
      { label: tr.calendarTreePlantHoleLabel, text: tr.calendarTreePlantHoleText },
      { label: tr.calendarTreePlantDepthLabel, text: tr.calendarTreePlantDepthText },
      { label: tr.calendarTreeTrunkCollarLabel, text: tr.calendarTreeTrunkCollarText },
      { label: tr.calendarSoilGuidance, text: getLoc(starTree.soilAdvice, language) }
    ],
    detailRows: [
      { label: tr.calendarCanopyRadius, text: `ca. ${formatNumber(starTree.matureRadiusM, 1, language)} m` },
      { label: tr.calendarRootHabit, text: starTree.rootHabit === 'SURFACE_FEEDER' ? tr.calendarRootSurfaceFeeder : starTree.rootHabit === 'DEEP_TAP' ? tr.calendarRootDeepTap : tr.calendarRootWideSpreading }
    ],
    guideUrl: `${baseUrl}/guides#guild_design`,
    guideLabel: tr.calendarGuideOpen,
    guildShareUrl,
    baseUrl,
    language
  });

  events.push({
    uid: `${starTree.id}-planting@pflanzengilde.de`,
    startDate: treePlantStart,
    endDate: treePlantEnd,
    summary: treePlantTitle,
    description: treePlantingDescs.plainText,
    htmlDescription: treePlantingDescs.htmlText,
    altrepUrl: `${baseUrl}/guides#guild_design`,
    attachments: treeAttachments,
    url: guildShareUrl,
    categories: ['Pflanzengilde', tr.calendarPlanting],
    isRecurring: false
  });

  const treePruneTiming = getNextOccurringDate('WINTER', 'CANOPY_PRUNING', treeFirstPlantingDate, hemisphere);
  const treePruneStart = treePruneTiming.dateStr;
  const treePruneEnd = treePruneTiming.nextDayStr;

  const treePruneTitle = tr.calendarTreePruneTitle.replace('{tree}', treeCommonName);

  const treePruneDescs = buildBrandedDescriptions({
    categoryTitle: tr.calendarCatCanopyPruning,
    commonName: treeCommonName,
    botanicalName: starTree.botanicalName,
    guildTreeName: treeCommonName,
    seasonLabel: tr.calendarSeasonLateWinter,
    recurrenceText: tr.calendarYearly,
    imageUrl: treeImgUrl,
    metaPills: [
      { label: `🌳 ${treeCommonName}`, bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
      { label: tr.calendarPillDormantPruning, bg: '#fff1f2', color: '#be123c', border: '#fecdd3' },
      { label: `🔄 ${tr.calendarYearly}`, bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' }
    ],
    instructionHeading: tr.calendarPruneHeading,
    instructions: [
      { label: tr.calendarPruneLightLabel, text: tr.calendarPruneLightText },
      { label: tr.calendarPruneDeadwoodLabel, text: tr.calendarPruneDeadwoodText },
      { label: tr.calendarPruneSproutsLabel, text: tr.calendarPruneSproutsText },
      { label: tr.calendarPruneWoodLabel, text: tr.calendarPruneWoodText }
    ],
    guideUrl: `${baseUrl}/guides#guild_design`,
    guideLabel: tr.calendarGuidePruning,
    guildShareUrl,
    baseUrl,
    language
  });

  events.push({
    uid: `${starTree.id}-pruning-winter@pflanzengilde.de`,
    startDate: treePruneStart,
    endDate: treePruneEnd,
    summary: treePruneTitle,
    description: treePruneDescs.plainText,
    htmlDescription: treePruneDescs.htmlText,
    altrepUrl: `${baseUrl}/guides#guild_design`,
    attachments: treeAttachments,
    url: guildShareUrl,
    categories: ['Pflanzengilde', tr.calendarCatPruning],
    isRecurring: true
  });

  const treeHarvestTiming = getNextOccurringDate(starTree.harvestSeason || 'AUTUMN', 'HARVEST', treeFirstPlantingDate, hemisphere);
  const treeHarvestStart = treeHarvestTiming.dateStr;
  const treeHarvestEnd = treeHarvestTiming.nextDayStr;

  const treeHarvestTitle = tr.calendarTreeHarvestTitle.replace('{tree}', treeCommonName);

  const treeHarvestDescs = buildBrandedDescriptions({
    categoryTitle: tr.calendarCatMainHarvest,
    commonName: treeCommonName,
    botanicalName: starTree.botanicalName,
    guildTreeName: treeCommonName,
    seasonLabel: starTree.harvestTime ? getLoc(starTree.harvestTime, language) : tr.seasonAutumn,
    recurrenceText: tr.calendarYearly,
    imageUrl: treeImgUrl,
    metaPills: [
      { label: `🌳 ${treeCommonName}`, bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
      { label: tr.calendarPillMainHarvest, bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
      { label: `🔄 ${tr.calendarYearly}`, bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' }
    ],
    instructionHeading: tr.calendarTreeHarvestHeading,
    instructions: [
      { label: tr.calendarTreeHarvestTiltLabel, text: tr.calendarTreeHarvestTiltText },
      { label: tr.calendarTreeHarvestWindfallLabel, text: tr.calendarTreeHarvestWindfallText },
      { label: tr.calendarTreeHarvestStorageLabel, text: tr.calendarTreeHarvestStorageText }
    ],
    guideUrl: `${baseUrl}/guides#guild_design`,
    guildShareUrl,
    baseUrl,
    language
  });

  events.push({
    uid: `${starTree.id}-harvest@pflanzengilde.de`,
    startDate: treeHarvestStart,
    endDate: treeHarvestEnd,
    summary: treeHarvestTitle,
    description: treeHarvestDescs.plainText,
    htmlDescription: treeHarvestDescs.htmlText,
    altrepUrl: guildShareUrl,
    attachments: treeAttachments,
    url: guildShareUrl,
    categories: ['Pflanzengilde', tr.calendarCatHarvest],
    isRecurring: true
  });

  const treeCollarTiming = getNextOccurringDate('WINTER', 'WINTER_CARE', treeFirstPlantingDate, hemisphere);
  const treeCollarStart = treeCollarTiming.dateStr;
  const treeCollarEnd = treeCollarTiming.nextDayStr;

  const treeCollarTitle = tr.calendarTreeCollarTitle.replace('{tree}', treeCommonName);

  const treeCollarDescs = buildBrandedDescriptions({
    categoryTitle: tr.calendarCatTrunkCollar,
    commonName: treeCommonName,
    botanicalName: starTree.botanicalName,
    guildTreeName: treeCommonName,
    seasonLabel: tr.calendarSeasonLateAutumn,
    recurrenceText: tr.calendarYearly,
    imageUrl: treeImgUrl,
    metaPills: [
      { label: `🌳 ${treeCommonName}`, bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
      { label: `📍 Zone 0`, bg: '#fff1f2', color: '#be123c', border: '#fecdd3' },
      { label: tr.calendarPillWinterDefense, bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' }
    ],
    instructionHeading: tr.calendarCollarHeading,
    instructions: [
      { label: tr.calendarCollarClearLabel, text: tr.calendarCollarClearText },
      { label: tr.calendarCollarBarkLabel, text: tr.calendarCollarBarkText },
      { label: tr.calendarCollarFrostLabel, text: tr.calendarCollarFrostText }
    ],
    guideUrl: `${baseUrl}/guides#guild_design`,
    guildShareUrl,
    baseUrl,
    language
  });

  events.push({
    uid: `${starTree.id}-collar-care@pflanzengilde.de`,
    startDate: treeCollarStart,
    endDate: treeCollarEnd,
    summary: treeCollarTitle,
    description: treeCollarDescs.plainText,
    htmlDescription: treeCollarDescs.htmlText,
    altrepUrl: `${baseUrl}/guides#guild_design`,
    attachments: treeAttachments,
    url: guildShareUrl,
    categories: ['Pflanzengilde', tr.calendarCatTreeCare],
    isRecurring: true
  });

  // Companions: planting (not before the tree), then chop & drop and harvest from their own planting date on.
  // UIDs carry the star tree so calendars of different guilds don't overwrite each other's companion
  // events on import, and no dates, so re-importing the same guild updates instead of duplicating.
  const companionUidPrefix = `${starTree.id}.`;
  selectedPlants.forEach((plant) => {
    const plantCommon = getLoc(plant.commonName, language);
    const isPerennial = plant.perennial;
    const chopAnchor = CHOP_PLANT_ANCHORS[plant.id] || 'chop_and_drop';
    const chopInfo = DEDICATED_CHOP_INSTRUCTIONS[plant.id];
    const plantImgUrl = plant.imageUrl ? (plant.imageUrl.startsWith('http') ? plant.imageUrl : `${baseUrl}${plant.imageUrl}`) : `${baseUrl}/favicon.svg`;
    const plantAttachments = [
      { url: plantImgUrl, mimeType: getMimeTypeFromUrl(plantImgUrl) },
      { url: `${baseUrl}/favicon.svg`, mimeType: 'image/svg+xml' }
    ];

    const plantSeason = getPlantingSeasons(plant)[0] || 'LATE_SPRING';
    const plantTiming = getNextOccurringDate(plantSeason, 'PLANTING', treeFirstPlantingDate, hemisphere);
    const pStart = plantTiming.dateStr;
    const pEnd = plantTiming.nextDayStr;
    const plantFirstPlantingDate = plantTiming.dateObj;

    const plantActionLabel = isPerennial
      ? tr.calendarActionPlanting
      : tr.calendarActionSowingPlanting;

    const plantSummary = `${plantActionLabel} ${plantCommon} (${plant.botanicalName})`;

    const plantDescs = buildBrandedDescriptions({
      categoryTitle: isPerennial ? tr.calendarCatPlantingUpper : tr.calendarCatSowingUpper,
      commonName: plantCommon,
      botanicalName: plant.botanicalName,
      guildTreeName: treeCommonName,
      seasonLabel: plant.plantingTime ? getLoc(plant.plantingTime, language) : tr.calendarSeasonSpring,
      recurrenceText: isPerennial
        ? tr.calendarOneTimePlanting
        : tr.calendarYearlyInSpring,
      imageUrl: plantImgUrl,
      metaPills: [
        { label: `📍 ${translateZone(plant.preferredZone, language)}`, bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
        { label: `🧭 ${translateSector(plant.preferredSector, language)}`, bg: '#fefce8', color: '#854d0e', border: '#fef08a' },
        { label: isPerennial ? tr.calendarPerennial : tr.calendarAnnual, bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' }
      ],
      instructionHeading: tr.calendarPlantSiteHeading,
      instructions: [
        { label: tr.calendarPlantTimingLabel, text: plant.plantingTime ? getLoc(plant.plantingTime, language) : tr.calendarSpringOrAutumn },
        { label: tr.calendarDistanceToTrunk, text: `${formatNumber(plant.minDistanceM, 1, language)}–${formatNumber(plant.maxDistanceM, 1, language)} m` },
        {
          label: tr.calendarDimensions,
          text: tr.calendarDimensionsValue
            .replace('{spread}', formatNumber(plant.spreadM, 1, language))
            .replace('{height}', formatNumber(plant.heightM, 1, language))
        },
        { label: tr.calendarSoilMatch, text: plant.suitableSoils.map((soil) => soilName(soil, tr)).join(', ') },
        { label: tr.calendarSoilNote, text: getLoc(plant.soilNotes, language) }
      ],
      detailRows: [
        { label: tr.calendarGuildRoles, text: plant.roles.map((r) => translateRole(r, language)).join(', ') },
        { label: tr.calendarPermacultureNotes, text: getLoc(plant.notes, language) }
      ],
      guideUrl: `${baseUrl}/guides#guild_design`,
      guideLabel: tr.calendarGuideGuildDesign,
      guildShareUrl,
      baseUrl,
      language
    });

    events.push({
      uid: `${companionUidPrefix}${plant.id}-planting@pflanzengilde.de`,
      startDate: pStart,
      endDate: pEnd,
      summary: plantSummary,
      description: plantDescs.plainText,
      htmlDescription: plantDescs.htmlText,
      altrepUrl: `${baseUrl}/guides#guild_design`,
      attachments: plantAttachments,
      url: guildShareUrl,
      categories: ['Pflanzengilde', tr.calendarPlanting],
      isRecurring: !isPerennial
    });

    const chopSeasons = plant.seasonalActivity.chopAndDropSeasons;
    if (chopSeasons && chopSeasons.length > 0) {
      chopSeasons.forEach((season, sIdx) => {
        const chopTiming = getNextOccurringDate(season, 'CHOP_AND_DROP', plantFirstPlantingDate, hemisphere, BLOOM_STAGE_CHOP_DATES[plant.id]?.[season]);
        const cStart = chopTiming.dateStr;
        const cEnd = chopTiming.nextDayStr;

        const seasonLabel = season === 'EARLY_SPRING' ? tr.seasonEarlySpring : season === 'LATE_SPRING' ? tr.calendarChopSeasonLateSpring : season === 'SUMMER' ? tr.calendarChopSeasonSummer : season === 'AUTUMN' ? tr.calendarChopSeasonAutumn : tr.seasonWinter;

        const chopSummary = tr.calendarChopTitle
          .replace('{plant}', plantCommon)
          .replace('{season}', seasonLabel);

        const howToCut = chopInfo ? chopInfo.howToCut[language] : tr.calendarChopDefaultHowToCut;
        const howMuch = chopInfo ? chopInfo.howMuch[language] : tr.calendarChopDefaultHowMuch;
        const whereToSpread = chopInfo ? chopInfo.whereToSpread[language] : tr.calendarChopDefaultWhereToSpread;
        const nutrientBenefit = chopInfo ? chopInfo.nutrientBenefit[language] : tr.calendarChopDefaultNutrientBenefit;

        const guideUrl = `${baseUrl}/guides#${chopAnchor}`;

        const chopDescs = buildBrandedDescriptions({
          categoryTitle: 'CHOP & DROP',
          commonName: plantCommon,
          botanicalName: plant.botanicalName,
          guildTreeName: treeCommonName,
          seasonLabel: `${seasonLabel} (${tr.calendarChopPass.replace('{index}', String(sIdx + 1)).replace('{total}', String(chopSeasons.length))})`,
          recurrenceText: tr.calendarYearly,
          imageUrl: plantImgUrl,
          metaPills: [
            { label: `🌿 ${tr.calendarPillBiomass}`, bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
            { label: `📍 ${translateZone(plant.preferredZone, language)}`, bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
            { label: `🔄 ${tr.calendarYearly}`, bg: '#fefce8', color: '#854d0e', border: '#fef08a' }
          ],
          instructionHeading: tr.calendarChopHeading,
          instructions: [
            { label: tr.calendarChopHowToCutLabel, text: howToCut },
            { label: tr.calendarChopHowMuchLabel, text: howMuch },
            { label: tr.calendarChopWhereToSpreadLabel, text: whereToSpread },
            { label: tr.calendarChopNutrientBenefitLabel, text: nutrientBenefit }
          ],
          guideUrl,
          guideLabel: tr.calendarGuideChop,
          guildShareUrl,
          baseUrl,
          language
        });

        events.push({
          uid: `${companionUidPrefix}${plant.id}-chop-${season.toLowerCase()}@pflanzengilde.de`,
          startDate: cStart,
          endDate: cEnd,
          summary: chopSummary,
          description: chopDescs.plainText,
          htmlDescription: chopDescs.htmlText,
          altrepUrl: guideUrl,
          attachments: plantAttachments,
          url: guideUrl,
          categories: ['Pflanzengilde', 'Chop & Drop'],
          isRecurring: true
        });
      });
    }

    const harvestSeasons = getHarvestSeasons(plant);
    const hasEdibleHarvest = plant.roles.includes('EDIBLE_UNDERSTORY');

    if (hasEdibleHarvest && harvestSeasons.length > 0) {
      const harvestTiming = getNextOccurringDate(harvestSeasons[0], 'HARVEST', plantFirstPlantingDate, hemisphere);
      const hStart = harvestTiming.dateStr;
      const hEnd = harvestTiming.nextDayStr;

      const harvestSummary = tr.calendarPlantHarvestTitle
        .replace('{plant}', plantCommon)
        .replace('{botanical}', plant.botanicalName);

      const harvestDescs = buildBrandedDescriptions({
        categoryTitle: tr.calendarCatHarvestUpper,
        commonName: plantCommon,
        botanicalName: plant.botanicalName,
        guildTreeName: treeCommonName,
        seasonLabel: plant.harvestTime ? getLoc(plant.harvestTime, language) : tr.calendarSummerToAutumn,
        recurrenceText: tr.calendarYearly,
        imageUrl: plantImgUrl,
        metaPills: [
          { label: `🍓 ${tr.calendarPillEdibleYield}`, bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
          { label: `📍 ${translateZone(plant.preferredZone, language)}`, bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
          { label: `🔄 ${tr.calendarYearly}`, bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' }
        ],
        instructionHeading: tr.calendarPlantHarvestHeading,
        instructions: [
          { label: tr.calendarPlantHarvestTimingLabel, text: tr.calendarPlantHarvestTimingText },
          { label: tr.calendarPlantHarvestQuantityLabel, text: tr.calendarPlantHarvestQuantityText },
          { label: tr.calendarPlantHarvestUsageLabel, text: tr.calendarPlantHarvestUsageText }
        ],
        guideUrl: `${baseUrl}/guides#guild_design`,
        guideLabel: tr.calendarGuideGuild,
        guildShareUrl,
        baseUrl,
        language
      });

      events.push({
        uid: `${companionUidPrefix}${plant.id}-harvest@pflanzengilde.de`,
        startDate: hStart,
        endDate: hEnd,
        summary: harvestSummary,
        description: harvestDescs.plainText,
        htmlDescription: harvestDescs.htmlText,
        altrepUrl: guildShareUrl,
        attachments: plantAttachments,
        url: guildShareUrl,
        categories: ['Pflanzengilde', tr.calendarCatHarvest],
        isRecurring: true
      });
    }
  });

  events.sort((a, b) => a.startDate.localeCompare(b.startDate));

  const calName = tr.calendarIcsName.replace('{tree}', treeCommonName);

  const calDesc = tr.calendarIcsDesc.replace('{tree}', treeCommonName);

  const icsLines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Pflanzengilde//Permakultur Kalender 1.0//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    foldIcsLine(`X-WR-CALNAME:${escapeIcsText(calName)}`),
    foldIcsLine(`X-WR-CALDESC:${escapeIcsText(calDesc)}`),
    'X-WR-TIMEZONE:UTC'
  ];

  events.forEach((ev) => {
    icsLines.push('BEGIN:VEVENT');
    icsLines.push(foldIcsLine(`UID:${ev.uid}`));
    icsLines.push(`DTSTAMP:${nowStamp}`);
    icsLines.push(`DTSTART;VALUE=DATE:${ev.startDate}`);
    icsLines.push(`DTEND;VALUE=DATE:${ev.endDate}`);
    icsLines.push(foldIcsLine(`SUMMARY:${escapeIcsText(ev.summary)}`));
    icsLines.push(foldIcsLine(`DESCRIPTION:${escapeIcsText(ev.description)}`));
    if (ev.htmlDescription) {
      icsLines.push(foldIcsLine(`X-ALT-DESC;FMTTYPE=text/html:${escapeIcsText(ev.htmlDescription)}`));
    }
    if (ev.attachments && ev.attachments.length > 0) {
      ev.attachments.forEach((att) => {
        icsLines.push(foldIcsLine(`ATTACH;FMTTYPE=${att.mimeType}:${att.url}`));
      });
    }
    if (ev.url) {
      icsLines.push(foldIcsLine(`URL:${ev.url}`));
    }
    if (ev.categories.length > 0) {
      icsLines.push(foldIcsLine(`CATEGORIES:${ev.categories.map((c) => escapeIcsText(c)).join(',')}`));
    }
    if (ev.isRecurring) {
      icsLines.push('RRULE:FREQ=YEARLY');
    }
    icsLines.push('STATUS:CONFIRMED');
    icsLines.push('TRANSP:TRANSPARENT');
    icsLines.push('END:VEVENT');
  });

  icsLines.push('END:VCALENDAR');

  return icsLines.join('\r\n');
}

export function exportGuildCalendarIcs(options: CalendarExportOptions): void {
  const icsContent = generateGuildCalendarIcs(options);
  const treeSlug = options.starTree.botanicalName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const filename = `${treeSlug}_pflanzengilde_kalender.ics`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Revoking synchronously can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
