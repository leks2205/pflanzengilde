import { LocalizedString } from '../types/guild';

/**
 * Can a plant grow in a typical raised bed (framed, about 0.3–0.8 m tall, about 1.2 m wide,
 * lined)? Research pass 2026-10-02 (extension services, RHS, LWG Bayern, peer-reviewed root
 * hardiness studies). Entries marked `unsourced` are judgement calls without a bed-specific source.
 *
 * All beds are treated as lined with a solid root-barrier film (walls and bottom); see the
 * raised-bed guide for what vole mesh or weed fabric do and don't stop.
 *
 * S       suitable
 * C       conditional (see the warnings)
 * C_REC   conditional but recommended (acid-loving plants on alkaline or heavy native soil)
 * U       unsuitable
 */
export type BedRating = 'S' | 'C' | 'C_REC' | 'U';
export type BedWarningId =
  | 'W1' | 'W2' | 'W3' | 'W4' | 'W5' | 'W6' | 'W7' | 'W8' | 'W9'
  | 'W10' | 'W11' | 'W12' | 'W13' | 'W14' | 'W15' | 'W16' | 'W17' | 'W18' | 'W19' | 'W20';

export interface BedSuitability {
  rating: BedRating;
  warnings: BedWarningId[];
  unsourced?: true;
}

const BS = {
  havis1976: 'Havis, J. R. (1976). Root Hardiness of Woody Ornamentals. HortScience, 11(4), 385-386. doi:10.21273/HORTSCI.11.4.385',
  studer1978: 'Studer, E. J., Steponkus, P. L., Good, G. L., & Wiest, S. C. (1978). Root Hardiness of Container-grown Ornamentals. HortScience, 13(2), 172-174. doi:10.21273/HORTSCI.13.2.172',
  mathers2003: 'Mathers, H. M. (2003). Summary of Temperature Stress Issues in Nursery Containers and Current Methods of Protection. HortTechnology, 13(4), 617-624. doi:10.21273/HORTTECH.13.4.0617',
  rhsTrees: 'Royal Horticultural Society (n.d.). Trees: growing in containers. https://www.rhs.org.uk/plants/types/trees/container-growing',
  rhsFruitContainers: 'Royal Horticultural Society (n.d.). Fruit in containers. https://www.rhs.org.uk/fruit/fruit-trees/containers',
  rhsFigs: 'Royal Horticultural Society (n.d.). Figs: grow your own. https://www.rhs.org.uk/fruit/figs/grow-your-own',
  rhsMulberries: 'Royal Horticultural Society (n.d.). Mulberries: grow your own. https://www.rhs.org.uk/fruit/mulberries/grow-your-own',
  rhsBlackcurrants: 'Royal Horticultural Society (n.d.). Blackcurrants: grow your own. https://www.rhs.org.uk/fruit/blackcurrants/grow-your-own',
  rhsRedcurrants: 'Royal Horticultural Society (n.d.). Redcurrants: grow your own. https://www.rhs.org.uk/fruit/redcurrants/grow-your-own',
  rhsGrapes: 'Royal Horticultural Society (n.d.). Grapes: grow your own. https://www.rhs.org.uk/fruit/grapes/grow-your-own',
  rhsKiwi: 'Royal Horticultural Society (n.d.). Kiwi: grow your own. https://www.rhs.org.uk/fruit/kiwi/grow-your-own',
  rhsRhubarb: 'Royal Horticultural Society (n.d.). Rhubarb: grow your own. https://www.rhs.org.uk/vegetables/rhubarb/grow-your-own',
  rhsBlueberries: 'Royal Horticultural Society (n.d.). Blueberries: grow your own. https://www.rhs.org.uk/fruit/blueberries/grow-your-own',
  rhsRhodo: 'Royal Horticultural Society (n.d.). Rhododendrons on alkaline soils. https://www.rhs.org.uk/plants/rhododendron/on-alkaline-soil',
  rhsCamellia: 'Royal Horticultural Society (n.d.). Camellia growing guide. https://www.rhs.org.uk/plants/camellia/growing-guide',
  rhsMint: 'Royal Horticultural Society (n.d.). Mint: grow your own. https://www.rhs.org.uk/herbs/mint/grow-your-own',
  rhsWildGarlic: 'Royal Horticultural Society (n.d.). Allium ursinum (wild garlic). https://www.rhs.org.uk/plants/879/allium-ursinum/details',
  nebraska: 'Jean, J., Read, P. E., & Paparozzi, E. T. (2024, November). Growing blueberries (Vaccinium spp.) in raised beds and containers in home or urban landscapes (EC3078). Nebraska Extension. https://extensionpubs.unl.edu/publication/ec3078/2025/pdf/view/ec3078-2025.pdf',
  pnw583: 'Penhallegon, R. (2006). Lingonberry production guide for the Pacific Northwest (PNW 583-E). Oregon State University. https://extension.oregonstate.edu/sites/extd8/files/documents/pnw583.pdf',
  umaine: 'University of Maine Cooperative Extension (n.d.). How to grow cranberries. https://extension.umaine.edu/cranberries/growing-cranberries/',
  lwgHochbeet: 'Bayerische Landesanstalt für Weinbau und Gartenbau (2021). Kräuter und Gemüse im Hochbeet (3. Auflage). https://www.lwg.bayern.de/mam/cms06/landespflege/dateien/lwg_ug_hochbeet_bf.pdf',
  weaver1927: 'Weaver, J. E., & Bruner, W. E. (1927). Root development of vegetable crops. McGraw-Hill. https://soilandhealth.org/wp-content/uploads/01aglibrary/010137veg.roots/010137toc.html',
  ucRooting: 'Geisel, P. (2009). Comparative rooting depths of common garden vegetables. UC ANR. https://ucanr.edu/sites/default/files/2010-07/29037.pdf',
  ncsu: 'NC State Extension (n.d.). North Carolina Extension Gardener Plant Toolbox (species pages). https://plants.ces.ncsu.edu/',
  sareSorghum: 'SARE (2007). Sorghum-sudangrass hybrids. In Managing Cover Crops Profitably (3rd ed.). https://www.sare.org/publications/managing-cover-crops-profitably/nonlegume-cover-crops/sorghum-sudangrass/',
  icraf: 'Orwa, C., Mutua, A., Kindt, R., Jamnadass, R., & Anthony, S. (2009). Agroforestree Database: a tree reference and selection guide, version 4.0. World Agroforestry Centre. https://apps.worldagroforestry.org/treedb/',
  amaducci2008: 'Amaducci, S., Zatta, A., Raffanini, M., & Venturi, G. (2008). Characterisation of hemp (Cannabis sativa L.) roots under different growing conditions. Plant and Soil, 313(1-2), 227-235. doi:10.1007/s11104-008-9695-0',
};

const W = (en: string, de: string): LocalizedString => ({ en, de });

export const BED_WARNINGS: Readonly<Record<BedWarningId, { title: LocalizedString; text: LocalizedString; minBedHeightM?: number; sources: string[] }>> = {
  W1: { title: W('Too large for a raised bed', 'Zu groß für ein Hochbeet'), text: W('This is a full-size tree; its roots and crown outgrow any raised bed within a few years. Plant it in open ground.', 'Dies ist ein großer Baum; Wurzeln und Krone sprengen jedes Hochbeet in wenigen Jahren. Bitte in den gewachsenen Boden pflanzen.'), sources: [BS.rhsTrees, BS.ncsu] },
  W2: { title: W('Only dwarf or container forms', 'Nur schwachwüchsige oder Kübelformen'), text: W('Only on a dwarfing or container rootstock (apple M9/M26, pear Quince C, cherry Gisela 5, plum/peach/apricot Pixy or St Julien A) or as a compact variety (mulberry), in a tree raised bed or large planter at least 45–50 cm wide and deep. Roots near the walls can freeze harder than in the ground (shown for containers), so insulate the walls in winter.', 'Nur auf schwachwachsender bzw. kübelgeeigneter Unterlage (Apfel M9/M26, Birne Quitte C, Kirsche Gisela 5, Pflaume/Pfirsich/Aprikose Pixy oder St. Julien A) oder als kompakte Sorte (Maulbeere), in einem Baum-Hochbeet oder großen Kübel mit mindestens 45–50 cm Breite und Tiefe. Wurzeln an den Wänden können stärker frieren als im Boden (nachgewiesen für Kübel), daher die Wände im Winter dämmen.'), minBedHeightM: 0.45, sources: [BS.rhsFruitContainers, BS.rhsTrees, BS.rhsMulberries, BS.havis1976, BS.mathers2003] },
  W3: { title: W('Large suckering shrub', 'Großer, Ausläufer bildender Strauch'), text: W('Large shrub or small tree that suckers or spreads; it will fill the bed and grow beyond it. Plant it in the ground.', 'Großer Strauch oder kleiner Baum, der Ausläufer treibt oder sich ausbreitet; er füllt das Hochbeet aus und wächst darüber hinaus. Ins Freiland pflanzen.'), sources: [BS.ncsu] },
  W4: { title: W('Needs acidic substrate', 'Braucht saures Substrat'), text: W('Recommended on alkaline or heavy soil, but only if the bed is filled with at least 30 cm of acidic ericaceous substrate (pH about 4.5–5.5) over a lime-free drainage layer or a barrier that separates it from the native soil, and watered with rainwater.', 'Auf kalkhaltigem oder schwerem Boden empfehlenswert, aber nur mit mindestens 30 cm saurem Moorbeet- bzw. Rhododendronsubstrat (pH ca. 4,5–5,5) über einer kalkfreien Drainageschicht oder einer Sperre zum Unterboden und mit Regenwasser gegossen.'), minBedHeightM: 0.3, sources: [BS.rhsBlueberries, BS.rhsRhodo, BS.rhsCamellia, BS.nebraska, BS.pnw583] },
  W5: { title: W('Needs a moist bog bed', 'Braucht ein feuchtes Moorbeet'), text: W('Needs an acidic sand bed (pH about 4–5) over a water-holding base, kept evenly moist but never waterlogged; a normal raised bed is too dry.', 'Braucht ein saures Sandbeet (pH ca. 4–5) über einer wasserhaltenden Unterschicht, gleichmäßig feucht, aber nie staunass; ein normales Hochbeet ist zu trocken.'), sources: [BS.umaine] },
  W6: { title: W('Contain it', 'Eingrenzen'), text: W('Spreads aggressively by roots or runners. Give it its own bed or a sunken bottomless pot; never plant it among other crops.', 'Breitet sich über Wurzeln oder Ausläufer stark aus. Eigenes Beet oder versenkten Topf ohne Boden verwenden, nie zwischen andere Kulturen.'), sources: [BS.rhsMint, BS.weaver1927] },
  W7: { title: W('Rampant spreader', 'Wuchert stark'), text: W('Rampant spreader that is very hard to remove once established. Keep it out of raised beds and plant it in a wild corner.', 'Wuchert stark und lässt sich kaum wieder entfernen. Nicht ins Hochbeet, sondern in eine wilde Gartenecke pflanzen.'), sources: [BS.rhsWildGarlic, BS.ncsu] },
  W8: { title: W('Woodland plant', 'Waldpflanze'), text: W('Woodland plant: only for a shaded raised bed kept moist with mulch. In a sunny bed it dries out.', 'Waldpflanze: nur in einem schattigen, gemulchten, feucht gehaltenen Hochbeet. Im sonnigen Beet vertrocknet sie.'), sources: [BS.ncsu] },
  W9: { title: W('Wet soil or deep taproot', 'Nasser Boden oder tiefe Pfahlwurzel'), text: W('Needs constantly moist or wet soil, which a raised bed does not provide. Plant it in the ground.', 'Braucht dauerhaft feuchten oder nassen Boden, den ein Hochbeet nicht bietet. Ins Freiland pflanzen.'), sources: [BS.ncsu] },
  W10: { title: W('Spreads into neighbours', 'Wandert in Nachbarkulturen'), text: W('Spreads by runners or rhizomes into neighbouring crops. Use it only as an edging and cut it back regularly.', 'Wandert über Ausläufer in Nachbarkulturen ein. Nur als Randbepflanzung nutzen und regelmäßig zurückschneiden.'), sources: [BS.ncsu] },
  W11: { title: W('Tall plant shades the bed', 'Hohe Pflanze beschattet das Beet'), text: W('Grows tall (about 1.2–3 m) and shades the whole bed. Place it on the north side, or use it only as a whole-bed cover crop.', 'Wird hoch (ca. 1,2–3 m) und beschattet das ganze Beet. An die Nordseite setzen oder nur als Gründüngung für das ganze Beet nutzen.'), sources: [BS.ncsu, BS.lwgHochbeet, BS.amaducci2008, BS.sareSorghum] },
  W12: { title: W('Heavy self-seeder', 'Sät sich stark aus'), text: W('Self-seeds heavily into the bed. Cut flower heads before the seeds ripen.', 'Sät sich stark im Beet aus. Blütenstände vor der Samenreife abschneiden.'), sources: [BS.ncsu] },
  W13: { title: W('Only marginally hardy', 'Nur bedingt winterhart'), text: W('Roots near the walls of a raised bed can freeze harder than in the ground (shown for containers), especially in small or tall beds, and this plant is only marginally hardy. Insulate the walls in winter or grow it in a movable pot.', 'Wurzeln an den Wänden eines Hochbeets können stärker frieren als im Boden (nachgewiesen für Kübel), besonders in kleinen oder hohen Beeten, und diese Pflanze ist nur bedingt winterhart. Die Wände im Winter dämmen oder im mobilen Kübel ziehen.'), sources: [BS.havis1976, BS.studer1978, BS.mathers2003, BS.rhsFigs, BS.rhsCamellia] },
  W14: { title: W('Tropical tree', 'Tropischer Baum'), text: W('Tropical or subtropical tree, not frost-hardy in Central Europe and too large for a bed. Grow it only as a container plant overwintered indoors.', 'Tropischer oder subtropischer Baum, in Mitteleuropa nicht frosthart und zu groß fürs Beet. Nur als Kübelpflanze mit frostfreier Überwinterung.'), sources: [BS.icraf] },
  W15: { title: W('Vigorous climber', 'Starkwüchsiger Kletterer'), text: W('Vigorous climber reaching 8 m or more that needs a pergola. Not for a raised bed.', 'Starkwüchsiger Kletterer (8 m und mehr), braucht eine Pergola. Nicht fürs Hochbeet.'), sources: [BS.rhsKiwi, BS.ncsu] },
  W16: { title: W('Needs a trellis', 'Braucht ein Spalier'), text: W('Needs a sturdy trellis and at least 30 cm of soil. Place it at the edge of the bed.', 'Braucht ein stabiles Spalier und mindestens 30 cm Erde. Am Beetrand pflanzen.'), minBedHeightM: 0.3, sources: [BS.rhsGrapes] },
  W17: { title: W('Needs space and depth', 'Braucht Platz und Tiefe'), text: W('Takes about 1.5 m² of bed and needs at least 45 cm of depth. Choose compact varieties, and expect to move it to the ground after a few years.', 'Braucht ca. 1,5 m² Beetfläche und mindestens 45 cm Tiefe. Kompakte Sorten wählen; nach einigen Jahren ins Freiland umsetzen.'), minBedHeightM: 0.45, sources: [BS.rhsBlackcurrants, BS.rhsRedcurrants] },
  W18: { title: W('Deep roots', 'Tiefe Wurzeln'), text: W('Needs at least 50 cm of soil and about 1–1.5 m² per plant (the clump grows about 1.5 m wide).', 'Braucht mindestens 50 cm Erde und ca. 1–1,5 m² pro Pflanze (der Horst wird etwa 1,5 m breit).'), minBedHeightM: 0.5, sources: [BS.rhsRhubarb, BS.weaver1927] },
  W19: { title: W('Deep taproot', 'Tiefe Pfahlwurzel'), text: W('Forms a deep taproot and prefers dry, well-drained soil. It grows in a deep bed (at least 45 cm), but cannot reach its full rooting depth there; best used short-term as green manure or in the ground.', 'Bildet eine tiefe Pfahlwurzel und bevorzugt trockenen, durchlässigen Boden. Wächst in einem tiefen Beet (mindestens 45 cm), erreicht dort aber nicht ihre volle Wurzeltiefe; am besten kurzzeitig als Gründüngung oder im Freiland.'), minBedHeightM: 0.45, sources: [BS.ncsu, BS.weaver1927] },
  W20: { title: W('Invasive large shrub', 'Invasiver großer Strauch'), text: W('Large shrub (3–5 m) that spreads by bird-dispersed seed and is invasive in parts of the world. Not for a raised bed.', 'Großer Strauch (3–5 m), der sich über Vogelsamen ausbreitet und in Teilen der Welt invasiv ist. Nicht fürs Hochbeet.'), sources: [BS.ncsu] },
};

const e = (rating: BedRating, warnings: BedWarningId[] = [], unsourced = false): BedSuitability =>
  unsourced ? { rating, warnings, unsourced: true } : { rating, warnings };

export const STAR_BED_SUITABILITY: Readonly<Record<string, BedSuitability>> = {
  'tree-apple': e('C', ['W2']), 'tree-walnut': e('U', ['W1']), 'tree-peach': e('C', ['W2']), 'tree-plum': e('C', ['W2']),
  'tree-pear': e('C', ['W2']), 'tree-fig': e('C', ['W13']), 'tree-hazelnut': e('U', ['W3']), 'tree-chestnut': e('U', ['W1']),
  'tree-apricot': e('C', ['W2']), 'tree-cherry': e('C', ['W2']), 'tree-quince': e('C', ['W2'], true), 'tree-mulberry': e('C', ['W2']),
  'tree-seabuckthorn-star': e('U', ['W3']), 'tree-alder': e('U', ['W1']), 'tree-pawpaw': e('U', ['W3']),
  'shrub-blueberry': e('C_REC', ['W4']), 'shrub-blackcurrant': e('C', ['W17']), 'vine-grape': e('C', ['W16']), 'vine-kiwi': e('U', ['W15']),
  'herb-rhubarb': e('C', ['W18']), 'shrub-elderberry': e('U', ['W3']), 'tree-ginkgo': e('U', ['W1']),
  'tree-tea-sinensis': e('C', ['W4', 'W13']), 'tree-tea-assamica': e('U', ['W14'], true), 'herb-hemp': e('C', ['W11']),
  'shrub-red-currant': e('C', ['W17']), 'tree-linden': e('U', ['W1']), 'shrub-rhododendron': e('C_REC', ['W4']),
};

export const COMPANION_BED_SUITABILITY: Readonly<Record<string, BedSuitability>> = {
  'plant-comfrey': e('U', ['W7']), 'plant-white-clover': e('C', ['W10']), 'plant-yarrow': e('C', ['W10']), 'plant-chives': e('S'),
  'plant-garlic': e('S'), 'plant-daffodil': e('S'), 'plant-nasturtium': e('S'), 'plant-borage': e('S'), 'plant-horseradish': e('C', ['W6']),
  'plant-lavender': e('S'), 'plant-goumi': e('C', ['W17'], true), 'plant-seabuckthorn': e('U', ['W3']), 'plant-lupine': e('C', ['W19']),
  'plant-red-currant': e('C', ['W17']), 'plant-elderberry': e('U', ['W3']), 'plant-woodruff': e('C', ['W8']), 'plant-thyme': e('S'), 'plant-sage': e('S'),
  'plant-strawberry': e('S'), 'plant-bugleweed': e('C', ['W10']), 'plant-crocus': e('S', [], true), 'plant-snowdrop': e('S'), 'plant-sedum': e('S'),
  'plant-aster': e('C', ['W11']), 'plant-hosta': e('S'), 'plant-fennel': e('C', ['W11']), 'plant-sweet-potato': e('S'), 'plant-winter-aconite': e('S'),
  'plant-hellebore': e('S'), 'plant-willow': e('U', ['W1']), 'plant-elaeagnus': e('U', ['W20']), 'plant-miners-lettuce': e('S', [], true),
  'plant-wild-garlic': e('U', ['W7']), 'plant-hyssop': e('S'), 'plant-cranberry': e('C', ['W5']), 'plant-tansy': e('U', ['W7']),
  'plant-hyacinth': e('S', [], true), 'plant-tea-sinensis': e('C', ['W4', 'W13']), 'plant-marigold': e('S', [], true), 'plant-hemp': e('C', ['W11']),
  'plant-rosemary': e('C', ['W13']), 'plant-lemon-balm': e('S'), 'plant-sweet-cicely': e('C', ['W8'], true), 'plant-dandelion': e('C', ['W12'], true),
  'plant-chamomile': e('S', [], true), 'plant-oregano': e('S'), 'plant-catmint': e('S'), 'plant-creeping-jenny': e('C', ['W10']), 'plant-lovage': e('C', ['W11']),
  'plant-peppermint': e('C', ['W6']), 'plant-alfalfa': e('C', ['W19']), 'plant-nettle': e('U', ['W7']), 'plant-wintergreen': e('C_REC', ['W4', 'W8']),
  'plant-lingonberry': e('C_REC', ['W4']), 'plant-cowslip': e('S', [], true), 'plant-lungwort': e('C', ['W8']), 'plant-epimedium': e('C', ['W8']),
  'plant-wild-ginger': e('C', ['W8'], true), 'plant-ostrich-fern': e('U', ['W9']), 'plant-meadowsweet': e('U', ['W9']), 'plant-welsh-onion': e('S', [], true),
  'plant-echinacea': e('S'), 'plant-rhododendron': e('C_REC', ['W4']), 'plant-alder': e('U', ['W1']), 'plant-nepal-alder': e('U', ['W14']),
  'plant-albizia': e('U', ['W14']), 'plant-linden': e('U', ['W1']), 'plant-blueberry': e('C_REC', ['W4']), 'plant-blackcurrant': e('C', ['W17']),
  'plant-rhubarb': e('C', ['W18']), 'plant-sweet-alyssum': e('S'), 'plant-wild-carrot': e('C', ['W12']), 'plant-sainfoin': e('C', ['W19']),
  'plant-sicklepod': e('C', ['W12']), 'plant-soybean': e('S', [], true), 'plant-subterranean-clover': e('S', [], true), 'plant-ladys-mantle': e('S'),
  'plant-creeping-phlox': e('S'), 'plant-sorghum-sudangrass': e('C', ['W11']), 'plant-chicory': e('C', ['W12']), 'plant-ribwort-plantain': e('C', ['W12']),
  'plant-salad-burnet': e('S'), 'plant-buckwheat': e('S', [], true), 'plant-phacelia': e('S', [], true), 'plant-fodder-radish': e('S'), 'plant-tithonia': e('C', ['W11']),
  'plant-gliricidia': e('U', ['W14']), 'plant-basil': e('S'), 'plant-summer-savory': e('S', [], true), 'plant-cornflower': e('S', [], true),
  'plant-pot-marigold': e('S', [], true), 'plant-african-marigold': e('S', [], true), 'plant-chinese-motherwort': e('C', ['W12'], true),
  'plant-indian-mustard': e('S'), 'plant-common-vetch': e('S', [], true), 'plant-garlic-chives': e('C', ['W12']),
};

export function getBedSuitability(id: string): BedSuitability | null {
  return STAR_BED_SUITABILITY[id] ?? COMPANION_BED_SUITABILITY[id] ?? null;
}

/** Sources for the root-zone freezing note shown with every bed (containers and beds lose insulation). */
export const BED_FREEZING_SOURCES: readonly string[] = [BS.havis1976, BS.studer1978, BS.mathers2003];
export const BED_SUITABILITY_SOURCES: readonly string[] = Object.values(BS);
