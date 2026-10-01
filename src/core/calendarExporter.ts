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
  'plant-southernwood': 'chop-plant-southernwood',
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
};

interface ChopInstruction {
  howToCut: { de: string; en: string };
  howMuch: { de: string; en: string };
  whereToSpread: { de: string; en: string };
  nutrientBenefit: { de: string; en: string };
}

export const DEDICATED_CHOP_INSTRUCTIONS: Record<string, ChopInstruction> = {
  'plant-comfrey': {
    howToCut: {
      de: 'Schneiden, sobald sich die ersten Blütenknospen zeigen (vor dem Aufblühen), da dann die Nährstoffdichte im Blatt maximal ist. Mit scharfer Sichel oder Heckenschere.',
      en: 'Cut just as flower buds begin to emerge (before opening) when foliage nutrient concentration peaks. Use a sharp sickle or hedge shears.'
    },
    howMuch: {
      de: 'Alle großen Außenblätter auf 5 cm über dem Wurzelstock kappen. WICHTIG: Die inneren Herzblätter unberührt lassen, damit die Pflanze sofort wieder austreiben kann.',
      en: 'Cut all large outer leaves down to 5 cm above root crown. CRITICAL: Leave inner heart leaves intact to power rapid regrowth within 2–3 weeks.'
    },
    whereToSpread: {
      de: 'Gleichmäßig als 5–10 cm dicke Mulchschicht in Zone 2 und 3 unter der Traufkante auslegen. Mindestens 15–20 cm Abstand zum Stammkragen (Zone 0) einhalten!',
      en: 'Spread evenly as a 5–10 cm mulch layer in Zone 2 and Zone 3 under the drip line. Keep 15–20 cm away from trunk collar (Zone 0)!'
    },
    nutrientBenefit: {
      de: 'Kalium-Bombe (5,3% K in der Trockenmasse), Calcium und Magnesium aus bis zu 3 m Tiefe. Fördert Fruchtansatz und Zellwandstabilität.',
      en: 'High potassium (5.3% K in dry matter), calcium, and magnesium mined from up to 3 m depth. Boosts fruit set and cellular strength.'
    }
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
      de: 'Schnittgut direkt an Ort und Stelle liegen lassen oder in Zone 2 an die Feinwurzeln der Bäume rechen. Wiederholter Schnitt lässt Weißklee einen Teil seiner Wurzeln und Wurzelknöllchen abstoßen, die anschließend nachwachsen; bei ihrer Zersetzung wird ihr Stickstoff für Nachbarpflanzen verfügbar – in Klee-Gras-Beständen geschätzt 3–102 kg N/ha und Jahr.',
      en: 'Leave clippings in situ on the ground or rake into Zone 2 around tree feeder roots. Repeated cutting makes white clover shed part of its roots and root nodules, which then regrow; as they decompose, their nitrogen becomes available to neighboring plants – an estimated 3–102 kg N/ha per year in clover–grass swards.'
    },
    nutrientBenefit: {
      de: 'Biologischer Reinstickstoff durch Rhizobien-Knöllchenbakterien. Schnelle Zersetzung innerhalb von 2–3 Wochen.',
      en: 'Biological pure nitrogen via Rhizobia root nodule symbiosis. Rapid microbial decomposition within 2–3 weeks.'
    }
  },
  'plant-willow': {
    howToCut: {
      de: 'Im Spätwinter (Februar/März) vor dem Saftaustrieb auf den Stock setzen oder im Juli grüne Triebspitzen stutzen.',
      en: 'Coppice in late winter (February/March) during dormancy before sap rises, or tip tender summer shoots in July.'
    },
    howMuch: {
      de: 'Alle einjährigen Weidenruten auf 10–15 cm über dem Weidenstock zurückschneiden. Ein gesunder Stock treibt jedes Jahr 10–25 neue Ruten.',
      en: 'Coppice all 1-year rods down to 10–15 cm above the stool. Stools produce 10–25 fresh straight rods every year.'
    },
    whereToSpread: {
      de: 'Ruten in 5–10 cm kurze Stücke schneiden oder häckseln (Bois Raméal Fragmenté / BRF). In Zone 3 und 4 verteilen für dauerhaften Humusaufbau.',
      en: 'Chop twigs into 5–10 cm pieces or shred into Ramial Chipped Wood (RCW / BRF). Spread in Zone 3 and 4 to promote mycorrhizal fungi.'
    },
    nutrientBenefit: {
      de: 'Pilzdominierter Dauerhumus, Salicylsäure (natürlicher Wurzelförderer und Phytohormon) und nachhaltiger Erosionsschutz.',
      en: 'Fungal-dominated permanent humus, salicylic acid (natural rooting hormone and defense primer), and long-term soil structure.'
    }
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
      de: 'Triebe zerkleinern und in Zone 2 und 3 unter nährstoffhungrige Obstbäume (Apfel, Pflaume, Pfirsich) streuen. Zersetzt sich in 4–6 Wochen.',
      en: 'Chop leaves and tender twigs and spread in Zone 2–3 around demanding fruit trees (apples, plums, peaches). Decomposes in 4–6 weeks.'
    },
    nutrientBenefit: {
      de: 'Frankia-Aktinorrhiza-Stickstoffdünger direkt am Gehölz. Versorgt flachwurzelnde Obstbäume während des Fruchtwachstums.',
      en: 'Actinorhizal Frankia nitrogen-rich woody mulch. Directly nourishes shallow fruit tree roots during active fruit swelling.'
    }
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
      de: 'Fein verteilt in Zone 2 ausstreuen. Reich an Schwefel und Kupfer; stärkt die mikrobielle Widerstandskraft im Boden.',
      en: 'Spread finely across Zone 2. Rich in sulfur, potassium, and copper, enhancing fungal soil disease resistance.'
    },
    nutrientBenefit: {
      de: 'Kupfer, Schwefel und aromatische Ätheröle wirken als natürliches Boden-Antiseptikum gegen Schadpilze.',
      en: 'Copper, sulfur, and aromatic essential oils act as a mild soil bio-protectant against harmful fungal spores.'
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
      de: 'Blätter grob zerkleinern und unter die Baumkrone (Zone 1 und 2) legen. Beim Verrotten werden flüchtige Senföle frei.',
      en: 'Chop leaves coarsely and mulch beneath tree canopy (Zone 1–2). As leaves decompose, glucosinolates release antimicrobial gases.'
    },
    nutrientBenefit: {
      de: 'Biofumigation durch Allylsenföle (AITC): Hemmt bodenbürtige Schorfpilzsporen und hemmt Wühlmausgänge.',
      en: 'Natural biofumigation via allyl isothiocyanates: Suppresses overwintering fungal scab spores and deters voles.'
    }
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
      de: 'Als zersetzungsfreudigen, weichen Biomasseteppich in Zone 2 verteilen. Trocknet schnell an und nährt Regenwürmer.',
      en: 'Spread as tender, fast-decomposing biomass blanket in Zone 2. Feeds earthworms and disintegrates rapidly.'
    },
    nutrientBenefit: {
      de: 'Hohe Kalium- und Kieselsäurekonzentration. Perfekter Nährstoffschub vor dem Einwintern.',
      en: 'High potassium and soluble silica content. Perfect soil conditioning pulse before winter dormancy.'
    }
  },
  'plant-lupine': {
    howToCut: {
      de: 'Direkt zur Vollblüte schneiden, bevor Hülsen ansetzen, um den maximalen Stickstoff im Grünland festzuhalten.',
      en: 'Chop down right at peak flowering, before seed pods develop, capturing maximum fixed nitrogen in green tissue.'
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
      de: 'Sehr hohes Stickstoff-Biomasse-Verhältnis; bricht dichte Böden auf.',
      en: 'Extremely high nitrogen-to-biomass ratio; deep roots fracture compacted subsoil.'
    }
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
      de: 'Schnittgut um Rebstöcke oder Obstbäume in Zone 2 streuen. Flüchtige Terpene aktivieren pflanzliche Abwehrkräfte.',
      en: 'Spread prunings around grapevines or fruit trees in Zone 2. Emits airborne monoterpenes priming tree defense.'
    },
    nutrientBenefit: {
      de: 'Kampfer, 1,8-Cineol und Thujon stimulieren die Stilben-Synthese benachbarter Pflanzen gegen Pilzinfektionen.',
      en: 'Camphor, 1,8-cineole, and thujone prime grapevine defense metabolites (stilbenes) against downy mildew.'
    }
  },
  'plant-chives': {
    howToCut: {
      de: 'Von April bis Oktober regelmäßig handbreit über dem Boden mit einer scharfen Küchen- oder Ernteschere schneiden.',
      en: 'Cut regularly from April to October a handbreadth above the ground using sharp shears.'
    },
    howMuch: {
      de: 'Auf 2–3 cm über dem Boden kappen. Treibt innerhalb von 10–14 Tagen frisch nach.',
      en: 'Cut down to 2–3 cm above ground level. Regrows fresh tender hollow stems within 10–14 days.'
    },
    whereToSpread: {
      de: 'Direkt im Zwiebelring (Zone 1) rund um den Baumstamm verteilen. Schwefelhaltige Dämpfe steigen in die Krone auf.',
      en: 'Spread directly within Zone 1 bulb ring around trunk base. Sulfur compounds volatilize upward toward lower foliage.'
    },
    nutrientBenefit: {
      de: 'Natürlicher Schwefeldünger; hemmt Apfelschorfsporen (Venturia inaequalis) und beugt Echtem Mehltau vor.',
      en: 'Natural organic sulfur; volatile allicin inhibits apple scab (Venturia inaequalis) and powdery mildew.'
    }
  },
  'plant-nasturtium': {
    howToCut: {
      de: 'Laufend Blätter und Ranken stutzen; nach dem ersten Herbstfrost die erfrorene Masse komplett als Gründüngung einharken.',
      en: 'Lightly trim running vines in summer; after first autumn frost, rake entire collapsed frost-killed mass into soil.'
    },
    howMuch: {
      de: 'Im Sommer bis zu 30 % der Ausläufer; im Spätherbst 100 % der Biomasse nutzen.',
      en: 'In summer up to 30% of runners; in late autumn 100% of frost-killed aboveground biomass.'
    },
    whereToSpread: {
      de: 'Als Bodendecke in Zone 1 und 2 liegen lassen. Zersetzt sich über den Winter vollständig zu nährstoffreichem Humus.',
      en: 'Leave as soil armor blanket across Zone 1 and 2. Decomposes completely over winter into rich bio-humus.'
    },
    nutrientBenefit: {
      de: 'Glucosinolate wirken nematizid und unterdrücken Bodenschädlinge; nährt das edaphische Bodenleben.',
      en: 'Glucosinolates suppress root-knot nematodes and pathogenic larvae while feeding beneficial detritivores.'
    }
  },
  'plant-hemp': {
    howToCut: {
      de: 'Im Hochsommer (Juli) die oberen Triebe stutzen; im Spätherbst nach der Samenreife bodennah mit Sichel oder Astschere kappen.',
      en: 'In mid-summer (July) top vegetative shoots; in late autumn after seed maturity cut down flush with sickle or loppers.'
    },
    howMuch: {
      de: 'Im Sommer obere 30–40 % einkürzen. Im Spätherbst auf 5–10 cm über dem Boden kappen, Pfahlwurzeln zur Unterboden-Lockerung im Boden belassen.',
      en: 'In summer trim top 30–40%. In late autumn cut down to 5–10 cm above ground; leave taproots in soil to create subsoil drainage channels.'
    },
    whereToSpread: {
      de: 'Stängel in 10–20 cm Stücke schneiden und in Zone 2 und 3 unter der Traufkante als langlebige Kohlenstoff-Mulchdecke verteilen.',
      en: 'Chop fibrous stalks into 10–20 cm segments and spread across Zone 2 and 3 as a durable, weed-suppressing carbon mulch.'
    },
    nutrientBenefit: {
      de: 'Hoher Kohlenstoff- und Siliziumgehalt (C:N 35–45:1); fördert nützliche Mykorrhizapilze und hemmt Unkrautkeimung.',
      en: 'High carbon and soluble silica content (C:N 35–45:1); promotes fungal mycorrhizae and suppresses annual weed germination.'
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
      de: 'Stickstoffreiches, leicht saures Laub aus Frankia-Fixierung (je nach Standort 40–300 kg N/ha und Jahr).',
      en: 'N-rich, mildly acidic leaf litter from Frankia fixation (40–300 kg N/ha/yr depending on site).'
    }
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
      de: 'Laub und dünne Zweige 5–10 cm dick in Zone 3 und 4 von Obstbäumen verteilen – nicht unter Tee, Heidelbeere oder Rhododendron (pH-Anstieg).',
      en: 'Spread leaves and thin twigs 5–10 cm deep in Zone 3 and 4 of fruit trees—not under tea, blueberry or rhododendron (raises pH).'
    },
    nutrientBenefit: {
      de: 'Calcium- und magnesiumreiches, schnell zersetzliches Laub; fördert Regenwürmer und Mull-Humus.',
      en: 'Calcium- and magnesium-rich, fast-decomposing litter that boosts earthworms and mull humus.'
    }
  },
  'plant-nepal-alder': {
    howToCut: {
      de: 'Seitenäste in der kühlen Trockenzeit (Dez–Feb) schneiteln; Hauptstamm als Schattenschirm stehen lassen.',
      en: 'Lop side branches in the cool dry season (Dec–Feb); keep the main stem as the shade canopy.'
    },
    howMuch: {
      de: 'So viel Seitenäste entfernen, dass über dem Tee etwa 25–35 % Kronenschatten verbleiben.',
      en: 'Remove enough side branches to keep roughly 25–35% canopy shade over the tea.'
    },
    whereToSpread: {
      de: 'Laub und Feinreisig zwischen den Teereihen (Zone 3 und 4) als Mulch auslegen.',
      en: 'Lay leaves and fine twigs between the tea rows (Zone 3 and 4) as mulch.'
    },
    nutrientBenefit: {
      de: 'Stickstoffreiches Laub aus der Frankia-Symbiose; steigert die mikrobielle Bodenbiomasse.',
      en: 'N-rich litter from the Frankia symbiosis; increases soil microbial biomass.'
    }
  },
  'plant-albizia': {
    howToCut: {
      de: 'In der kühlen Trockenzeit (Dez–Feb) schneiteln; Bäume auf ca. 7 m wachsen lassen und auf ca. 4 m zurückschneiden.',
      en: 'Lop in the cool dry season (Dec–Feb); let trees reach about 7 m, then cut back to about 4 m.'
    },
    howMuch: {
      de: 'Kronenschatten über dem Tee auf lichten Filterschatten auslichten (ca. 25–35 %).',
      en: 'Thin the crown to light, filtered shade over the tea (about 25–35%).'
    },
    whereToSpread: {
      de: 'Fiederblätter, Zweige und Hülsen zwischen den Teereihen (Zone 3 und 4) liegen lassen.',
      en: 'Leave leaflets, twigs and pods between the tea rows (Zone 3 and 4).'
    },
    nutrientBenefit: {
      de: 'Stickstoffreiches Leguminosenlaub (Rhizobium-Symbiose) als organische Substanz für den Teeboden.',
      en: 'N-rich legume litter (Rhizobium symbiosis) adding organic matter to the tea soil.'
    }
  },
  'plant-rhubarb': {
    howToCut: {
      de: 'Nach Ernteende (24. Juni) die großen Blätter am Stielansatz abschneiden; Blütenstängel sofort entfernen.',
      en: 'After the harvest ends (June 24) cut the large leaves at the stalk base; remove flower stalks immediately.'
    },
    howMuch: {
      de: 'Höchstens die Hälfte der Blätter nehmen, damit der Wurzelstock Reserven für das nächste Jahr aufbaut.',
      en: 'Take no more than half of the leaves so the crown can rebuild reserves for next year.'
    },
    whereToSpread: {
      de: 'Blattspreiten flach als Unkrautsperre in Zone 3 auslegen; Abstand zum Stamm 30 cm.',
      en: 'Lay leaf blades flat as a weed barrier in Zone 3, 30 cm away from the trunk.'
    },
    nutrientBenefit: {
      de: 'Große, schnell zersetzliche Blattmasse beschattet den Boden und hält Feuchtigkeit.',
      en: 'Large, fast-decomposing leaf mass shades the soil and conserves moisture.'
    }
  }
};

type ChoreType = 'PLANTING' | 'CHOP_AND_DROP' | 'HARVEST' | 'CANOPY_PRUNING' | 'WINTER_CARE';

/** Month/day for a chore in a given season; shifted by six months for the southern hemisphere. */
function resolveSeasonDate(
  season: PhenoSeason,
  choreType: ChoreType,
  hemisphere: Hemisphere = 'NORTHERN'
): { month: number; day: number } {
  let month = 4;
  let day = 15;

  switch (season) {
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
  hemisphere: Hemisphere = 'NORTHERN'
): { dateObj: Date; dateStr: string; nextDayStr: string } {
  const minTimestamp = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()).getTime();
  const { month, day } = resolveSeasonDate(season, choreType, hemisphere);
  let year = minDate.getFullYear();
  if (new Date(year, month - 1, day).getTime() < minTimestamp) year += 1;

  return {
    dateObj: new Date(year, month - 1, day),
    dateStr: formatDateIcs(year, month, day),
    nextDayStr: getNextDayDateIcs(year, month, day)
  };
}

export const CHOP_INSTRUCTIONS_MAP = DEDICATED_CHOP_INSTRUCTIONS;

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
      { label: `📍 Zone 0 (0–30 cm)`, bg: '#fff1f2', color: '#be123c', border: '#fecdd3' },
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
        const chopTiming = getNextOccurringDate(season, 'CHOP_AND_DROP', plantFirstPlantingDate, hemisphere);
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
    const hasEdibleHarvest = plant.roles.includes('EDIBLE_UNDERSTORY') || (plant.harvestTime && !plant.harvestTime.de.toLowerCase().includes('nicht essbar'));

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
