import { GuildPlant, LocalizedString } from '../types/guild';
import { GroundCoverSpec, getGroundCoverSpec } from './groundCoverSpecs';
import { isAlliumPlant, isLegumePlant, isStrictCalcicolePlant } from '../core/placementRules';

/**
 * Which ground covers may share the same ground (research pass 2026-10-03, five agents; all DOIs
 * checked on Crossref).
 *
 *  COEXIST  the two covers intermix on the same ground (drawn overlapping)
 *  MOSAIC   separate patches that meet in a mixed border (drawn side by side with a blend band)
 *  EXCLUDE  one suppresses the other (hard edge, no overlap)
 *
 * Precedence: documented pair → group exception → timing rule → default MOSAIC.
 * A general "taller plant can grow over a lower one" rule is NOT supported: light competition is
 * size-asymmetric (Hautier et al. 2009; DeMalach et al. 2016) and vertical niche partitioning in
 * grassland has little support (Barry et al. 2019), so height layering is only used where a pair
 * is documented.
 */
export type OverlapVerdict = 'COEXIST' | 'MOSAIC' | 'EXCLUDE';
export type OverlapEvidence = 'trial' | 'community' | 'mixture' | 'guidance' | 'inferred';

export interface OverlapResult {
  verdict: OverlapVerdict;
  evidence: OverlapEvidence;
  reason: LocalizedString;
  sources: string[];
}

const L = (en: string, de: string): LocalizedString => ({ en, de });

export const OVERLAP_SOURCES = {
  eunisData: 'Chytrý, M., Tichý, L., Hennekens, S. M., Knollová, I., et al. (2025). EUNIS-ESy: Expert system for automatic classification of European vegetation plots to EUNIS habitats, v2025-10-03 (characteristic species combinations). Zenodo. doi:10.5281/zenodo.16895007',
  eunis: 'Chytrý, M., Tichý, L., Hennekens, S. M., Knollová, I., Janssen, J. A. M., Rodwell, J. S., et al. (2020). EUNIS Habitat Classification: expert system, characteristic species combinations and distribution maps of European habitats. Applied Vegetation Science, 23(4), 648–675. doi:10.1111/avsc.12519',
  kaushik: 'Kaushik, K., Bricca, A., Mugnai, M., Viciani, D., Rudolf, K., Somfalvi-Tóth, K., et al. (2021). Effects of a dominant species on the functional diversity of coexisting species in temperate deciduous understorey. Plants, 10(11), 2252. doi:10.3390/plants10112252',
  djurdjevic: 'Djurdjević, L., Dinić, A., Pavlović, P., Mitrović, M., Karadžić, B., & Tešević, V. (2004). Allelopathic potential of Allium ursinum L. Biochemical Systematics and Ecology, 32(6), 533–544. doi:10.1016/j.bse.2003.10.001',
  taylor: 'Taylor, K. (2009). Biological Flora of the British Isles: Urtica dioica L. Journal of Ecology, 97(6), 1436–1458. doi:10.1111/j.1365-2745.2009.01575.x',
  feisJenny: 'Innes, R. J. (2011). Lysimachia nummularia. Fire Effects Information System. USDA Forest Service. doi:10.2737/feis-species-review-lysnum',
  feisTansy: 'Gucker, C. L. (2009). Tanacetum vulgare. Fire Effects Information System. USDA Forest Service. doi:10.2737/feis-species-review-tanvul',
  feisClaytonia: 'Matthews, R. F. (1993). Claytonia perfoliata. Fire Effects Information System. USDA Forest Service. doi:10.2737/feis-species-review-claper',
  smithFellowes: 'Smith, L. S., & Fellowes, M. D. E. (2014). The grass-free lawn: management and species choice for optimum ground cover and plant diversity. Urban Forestry & Urban Greening, 13(3), 433–442. doi:10.1016/j.ufug.2014.04.008',
  pornaro: 'Pornaro, C., Fidanza, M., & Macolino, S. (2023). Yarrow (Achillea millefolium) for low-input lawns in the Mediterranean environment. Urban Forestry & Urban Greening, 79, 127812. doi:10.1016/j.ufug.2022.127812',
  lane: 'Lane, I. G., Wolfin, J., Watkins, E., & Spivak, M. (2019). Testing the establishment of eight forbs in mowed lawns of hard fescue for use in pollinator conservation. HortScience, 54(12), 2150–2155. doi:10.21273/HORTSCI14336-19',
  smithCrespo: 'Smith, A., & Crespo, D. G. (1979). Effect of competition by white clover on the seed production characteristics of subterranean clover. Australian Journal of Agricultural Research, 30(4), 597–607. doi:10.1071/AR9790597',
  rhsGrass: 'Royal Horticultural Society (n.d.). Naturalising bulbs in grass. https://www.rhs.org.uk/plants/types/bulbs/naturalising-in-grass',
  brecks: 'Breck\'s (n.d.). Landscaping with bulbs: ground cover should be no more than half the height of the bulb flower (horticultural guidance). https://www.brecksbulbs.ca/pages/how_to_landscaping_with_bulbs_uses',
  pirhofer: 'Pirhofer-Walzl, K., Søegaard, K., Høgh-Jensen, H., Eriksen, J., Sanderson, M. A., Rasmussen, J., & Rasmussen, J. (2011). Forage herbs improve mineral composition of grassland herbage. Grass and Forage Science, 66(3), 415–423. doi:10.1111/j.1365-2494.2011.00799.x',
  foeko: 'Universität Hohenheim, BiodivObst (n.d.). FÖKO-Mischung für die Einsaat in der Fahrgassenmitte. https://biodivobst.uni-hohenheim.de/FahrgassenmischungFOEKO.pdf',
  ecoOrchard: 'FiBL / EcoOrchard (2019). Perennial flower strips for pest control in fruit orchards. The Organic Grower, 47, 26–29. https://agricology.co.uk/sites/default/files/Perennial%20flower%20strips%20for%20pest%20control%20in%20fruit%20orchards.pdf',
  carreck: 'Carreck, N. L., & Williams, I. H. (2002). Food for insect pollinators on farmland: insect visits to flowers of annual seed mixtures. Journal of Insect Conservation, 6(1), 13–23. doi:10.1023/A:1015764925536',
  sareSorghum: 'SARE (2007). Sorghum-sudangrass hybrids. In Managing Cover Crops Profitably (3rd ed.). https://www.sare.org/publications/managing-cover-crops-profitably/nonlegume-cover-crops/sorghum-sudangrass/',
  sareBrassica: 'SARE (2007). Brassicas and mustards. In Managing Cover Crops Profitably (3rd ed.). https://www.sare.org/publications/managing-cover-crops-profitably/nonlegume-cover-crops/brassicas-and-mustards/',
  gross: 'Groß, J., et al. (2024). Improving dual cover crop mixtures to increase shoot biomass production and weed suppression potential. Frontiers in Agronomy, 6, 1416379. doi:10.3389/fagro.2024.1416379',
  elhakeem: 'Elhakeem, A., et al. (2023). Radish-based cover crop mixtures mitigate leaching and increase availability of nitrogen to the cash crop. Field Crops Research, 292, 108803. doi:10.1016/j.fcr.2022.108803',
  wendling: 'Wendling, M., et al. (2017). Specific interactions leading to transgressive overyielding in cover crop mixtures. Agriculture, Ecosystems & Environment, 241, 88–99. doi:10.1016/j.agee.2017.03.003',
  hasanaliyeva: 'Hasanaliyeva, G., Furiosi, M., Rossi, V., & Caffi, T. (2024). Cover crops lower the dispersal of grapevine foliar pathogens. Frontiers in Plant Science, 15, 1498848. doi:10.3389/fpls.2024.1498848',
  weston: 'Weston, L. A., Alsaadawi, I. S., & Baerson, S. R. (2013). Sorghum allelopathy—from ecosystem to molecule. Journal of Chemical Ecology, 39(2), 142–153. doi:10.1007/s10886-013-0245-8',
  harrison: 'Harrison, H. F., & Peterson, J. K. (1986). Allelopathic effects of sweet potatoes (Ipomoea batatas) on yellow nutsedge (Cyperus esculentus) and alfalfa (Medicago sativa). Weed Science, 34(4), 623–627. doi:10.1017/S0043174500067552',
  mullerBormann: 'Muller, R. N., & Bormann, F. H. (1976). Role of Erythronium americanum Ker. in energy flow and nutrient dynamics of a northern hardwood forest ecosystem. Science, 193(4258), 1126–1128. doi:10.1126/science.193.4258.1126',
  hautier: 'Hautier, Y., Niklaus, P. A., & Hector, A. (2009). Competition for light causes plant biodiversity loss after eutrophication. Science, 324(5927), 636–638. doi:10.1126/science.1169640',
  demalach: 'DeMalach, N., Zaady, E., Weiner, J., & Kadmon, R. (2016). Size asymmetry of resource competition and the structure of plant communities. Journal of Ecology, 104(4), 899–910. doi:10.1111/1365-2745.12557',
  barry: 'Barry, K. E., van Ruijven, J., Mommer, L., et al. (2019). Limited evidence for spatial resource partitioning across temperate grassland biodiversity experiments. Ecology, 101(1), e02905. doi:10.1002/ecy.2905',
} as const;
const S = OVERLAP_SOURCES;

type Pair = [string, string, OverlapVerdict, OverlapEvidence, LocalizedString, string[]];
const id = (s: string) => `plant-${s}`;

const WOOD_OH = L('Occur together in the herb layer of beech and oak–hornbeam woodland (habitat co-occurrence, a weaker hint than a planting trial).', 'Kommen gemeinsam in der Krautschicht von Buchen- und Eichen-Hainbuchenwäldern vor (gemeinsames Vorkommen im Lebensraum, schwächerer Hinweis als ein Pflanzversuch).');
const WOOD_LUNG = L('Occur together in the herb layer of oak–hornbeam and ravine woodland (habitat co-occurrence).', 'Kommen gemeinsam in der Krautschicht von Eichen-Hainbuchen- und Schluchtwäldern vor (gemeinsames Vorkommen im Lebensraum).');
const HAY = L('Occur together in hay meadows (habitat co-occurrence).', 'Kommen gemeinsam in Mähwiesen vor (gemeinsames Vorkommen im Lebensraum).');
const MOUNTAIN_HAY = L('Occur together in mountain hay meadows (habitat co-occurrence).', 'Kommen gemeinsam in Berg-Mähwiesen vor (gemeinsames Vorkommen im Lebensraum).');
const GARLIC_PATCH = L('Wild garlic forms dense single-species patches; other woodland herbs coexist mainly at its patch edges.', 'Bärlauch bildet dichte Reinbestände; andere Waldkräuter wachsen vor allem an den Rändern seiner Flecken.');
const NETTLE_PATCH = L('Nettle often forms dense single-species stands; other plants grow mainly at their edges.', 'Brennnessel bildet oft dichte Reinbestände; andere Pflanzen wachsen vor allem an deren Rändern.');
const HERB_LEY = L('Sown together in the same herb-ley mixture.', 'Werden in derselben Kräuterwiesen-Mischung gemeinsam gesät.');
const ALLEY_MIX = L('Sown together in the same orchard-alley flower mixture (cornflower, buckwheat and chamomile as first-year nurse plants).', 'Werden in derselben Fahrgassen-Blühmischung im Obstbau gemeinsam gesät (Kornblume, Buchweizen und Kamille als Ammenpflanzen im ersten Jahr).');
const ECO_MIX = L('Sown together in the same perennial orchard flower strip.', 'Werden im selben mehrjährigen Obstbau-Blühstreifen gemeinsam gesät.');
const NECTAR_MIX = L('Sown together in the same annual nectar mixture.', 'Werden in derselben einjährigen Nektarmischung gemeinsam gesät.');
const COVER_MIX = L('Sown together as a cover-crop mixture.', 'Werden als Gründüngungsmischung gemeinsam gesät.');
const BULB_LAWN = L('Bulbs naturalise in short swards: they flower and die back early (for daffodils, mow at least six weeks after flowering).', 'Zwiebelblumen verwildern in kurzen Rasen: Sie blühen früh und ziehen ein (bei Narzissen frühestens sechs Wochen nach der Blüte mähen).');

const PAIRS: Pair[] = [
  // ── Carpet × carpet / drift ───────────────────────────────────────────────────────────────────
  [id('white-clover'), id('thyme'), 'MOSAIC', 'inferred', L('Both establish in mown fescue lawns, but they were only tested in separate plots (both did better on dry sand).', 'Beide etablieren sich in gemähten Schwingelrasen, wurden aber nur in getrennten Parzellen getestet (beide besser auf trockenem Sand).'), [S.lane]],
  [id('white-clover'), id('yarrow'), 'COEXIST', 'trial', L('White clover and yarrow planted together both persisted in mown grass-free lawns; yarrow mixtures gave good low-input swards.', 'Gemeinsam gepflanzt hielten sich Weißklee und Schafgarbe in gemähten graslosen Rasen; Mischungen mit Schafgarbe ergaben gute, pflegearme Rasen.'), [S.smithFellowes, S.pornaro]],
  [id('white-clover'), id('bugleweed'), 'COEXIST', 'community', HAY, [S.eunis, S.eunisData]],
  [id('white-clover'), id('creeping-jenny'), 'MOSAIC', 'community', L('Occur together in moist meadows, but creeping jenny can form dense mats (reported mainly in weed fact sheets).', 'Kommen gemeinsam in feuchten Wiesen vor, aber Pfennigkraut kann dichte Teppiche bilden (v. a. in Unkraut-Merkblättern beschrieben).'), [S.eunis, S.feisJenny]],
  [id('white-clover'), id('ladys-mantle'), 'COEXIST', 'community', MOUNTAIN_HAY, [S.eunis, S.eunisData]],
  [id('white-clover'), id('subterranean-clover'), 'EXCLUDE', 'community', L('In pastures, subterranean clover set 757 mg seed per dm² alone but only 34 mg next to white clover; white clover may reduce its persistence.', 'In Weiden setzte Bodenfrüchtiger Klee allein 757 mg Samen pro dm² an, neben Weißklee nur 34 mg; Weißklee kann seinen Bestand gefährden.'), [S.smithCrespo]],
  [id('white-clover'), id('nettle'), 'EXCLUDE', 'inferred', L('Nettle forms dense single-species stands; low, light-demanding clover is unlikely to persist inside them (inference).', 'Brennnessel bildet dichte Reinbestände; niedriger, lichtbedürftiger Klee hält sich darin kaum (Schlussfolgerung).'), [S.taylor]],
  [id('woodruff'), id('bugleweed'), 'COEXIST', 'community', WOOD_OH, [S.eunis, S.eunisData]],
  [id('woodruff'), id('strawberry'), 'COEXIST', 'community', WOOD_OH, [S.eunis, S.eunisData]],
  [id('woodruff'), id('wild-ginger'), 'COEXIST', 'community', WOOD_OH, [S.eunis, S.eunisData]],
  [id('bugleweed'), id('strawberry'), 'COEXIST', 'community', WOOD_OH, [S.eunis, S.eunisData]],
  [id('bugleweed'), id('wild-ginger'), 'COEXIST', 'community', WOOD_OH, [S.eunis, S.eunisData]],
  [id('strawberry'), id('wild-ginger'), 'COEXIST', 'community', WOOD_OH, [S.eunis, S.eunisData]],
  ...['woodruff', 'bugleweed', 'strawberry', 'wild-ginger'].map(o => [id(o), id('lungwort'), 'COEXIST', 'community', WOOD_LUNG, [S.eunis, S.eunisData]] as Pair),
  [id('bugleweed'), id('ladys-mantle'), 'COEXIST', 'community', MOUNTAIN_HAY, [S.eunis, S.eunisData]],
  [id('strawberry'), id('lingonberry'), 'COEXIST', 'community', L('Occur together in the herb layer of pine and spruce forests (habitat co-occurrence).', 'Kommen gemeinsam in der Krautschicht von Kiefern- und Fichtenwäldern vor (gemeinsames Vorkommen im Lebensraum).'), [S.eunis, S.eunisData]],
  [id('strawberry'), id('oregano'), 'COEXIST', 'community', L('Occur together in warm forest fringes (habitat co-occurrence).', 'Kommen gemeinsam in warmen Waldsäumen vor (gemeinsames Vorkommen im Lebensraum).'), [S.eunis, S.eunisData]],
  [id('cranberry'), id('lingonberry'), 'COEXIST', 'inferred', L('The related small cranberry (V. oxycoccos) grows with lingonberry in raised bogs and mire forests; assumed similar for American cranberry.', 'Die verwandte Moosbeere (V. oxycoccos) wächst mit Preiselbeere in Hochmooren und Moorwäldern; für die Großfrüchtige Moosbeere angenommen.'), [S.eunis, S.eunisData]],
  [id('creeping-jenny'), id('peppermint'), 'COEXIST', 'community', L('Co-dominant in a documented wetland plant community (Illinois).', 'Gemeinsam vorherrschend in einer beschriebenen Feuchtgebiets-Pflanzengesellschaft (Illinois).'), [S.feisJenny]],
  [id('creeping-jenny'), id('nettle'), 'MOSAIC', 'community', L('Both occur in riparian woodland; nettle forms dense stands, so creeping jenny grows mainly at their edges.', 'Beide kommen in Auwäldern vor; Brennnessel bildet dichte Bestände, Pfennigkraut wächst vor allem an deren Rändern.'), [S.eunis, S.taylor]],
  [id('yarrow'), id('thyme'), 'COEXIST', 'community', L('Occur together in inland sand grassland (habitat co-occurrence).', 'Kommen gemeinsam in Sandtrockenrasen vor (gemeinsames Vorkommen im Lebensraum).'), [S.eunis, S.eunisData]],
  [id('yarrow'), id('bugleweed'), 'COEXIST', 'community', HAY, [S.eunis, S.eunisData]],
  [id('yarrow'), id('strawberry'), 'COEXIST', 'community', L('Occur together in forest fringes and light woodland (habitat co-occurrence).', 'Kommen gemeinsam in Waldsäumen und lichten Wäldern vor (gemeinsames Vorkommen im Lebensraum).'), [S.eunis, S.eunisData]],
  [id('yarrow'), id('ladys-mantle'), 'COEXIST', 'community', MOUNTAIN_HAY, [S.eunis, S.eunisData]],
  [id('thyme'), id('oregano'), 'COEXIST', 'inferred', L('Thyme species (T. pulegioides, T. praecox) grow with oregano in semi-dry calcareous grassland; assumed similar for creeping thyme.', 'Thymian-Arten (T. pulegioides, T. praecox) wachsen mit Dost in Halbtrocken-Kalkrasen; für Sand-Thymian angenommen.'), [S.eunis, S.eunisData]],
  // ── wild garlic & nettle patches ───────────────────────────────────────────────────────────────
  ...['woodruff', 'strawberry', 'wild-ginger', 'lungwort', 'nettle'].map(o =>
    [id('wild-garlic'), id(o), 'MOSAIC', 'community', GARLIC_PATCH, [S.kaushik, S.djurdjevic, S.eunis]] as Pair),
  ...['snowdrop', 'winter-aconite'].map(o =>
    [id('wild-garlic'), id(o), 'MOSAIC', 'community', GARLIC_PATCH, [S.kaushik, S.djurdjevic]] as Pair),
  ...['woodruff', 'bugleweed', 'strawberry', 'wild-ginger', 'ladys-mantle', 'lungwort', 'yarrow', 'tansy'].map(o =>
    [id('nettle'), id(o), 'MOSAIC', 'community', NETTLE_PATCH, [S.taylor, S.eunis]] as Pair),
  // tansy crowds out low carpets
  ...['white-clover', 'thyme', 'subterranean-clover', 'creeping-phlox', 'sweet-potato', 'strawberry', 'bugleweed'].map(o =>
    [id('tansy'), id(o), 'EXCLUDE', 'guidance', L('Tansy can form dense rhizomatous colonies that crowd out other plants (reported mainly in weed fact sheets).', 'Rainfarn kann dichte Rhizom-Kolonien bilden, die andere Pflanzen verdrängen (v. a. in Unkraut-Merkblättern beschrieben).'), [S.feisTansy]] as Pair),
  // ── bulbs ────────────────────────────────────────────────────────────────────────────────────────
  ...['crocus', 'snowdrop', 'winter-aconite', 'daffodil'].map(b =>
    [id(b), id('white-clover'), 'COEXIST', 'guidance', BULB_LAWN, [S.rhsGrass]] as Pair),
  [id('miners-lettuce'), id('ostrich-fern'), 'COEXIST', 'inferred', L('Miner\'s lettuce grows densest in bracken stands (California), using the ground while the fern is dormant; assumed similar for ostrich fern.', 'Tellerkraut wächst in Adlerfarnbeständen (Kalifornien) am dichtesten und nutzt den Boden, solange der Farn ruht; für Straußenfarn angenommen.'), [S.feisClaytonia]],
  // ── sown mixtures (ALLEY) ────────────────────────────────────────────────────────────────────────
  ...pairsOf(['alfalfa', 'chicory', 'ribwort-plantain', 'salad-burnet', 'white-clover'], 'COEXIST', 'mixture', HERB_LEY, [S.pirhofer]),
  ...pairsOf(['wild-carrot', 'chicory', 'alfalfa', 'cornflower', 'buckwheat', 'yarrow', 'chamomile'], 'COEXIST', 'mixture', ALLEY_MIX, [S.foeko]),
  ...pairsOf(['wild-carrot', 'yarrow', 'bugleweed'], 'COEXIST', 'mixture', ECO_MIX, [S.ecoOrchard]),
  ...pairsOf(['phacelia', 'buckwheat', 'cornflower', 'pot-marigold'], 'COEXIST', 'mixture', NECTAR_MIX, [S.carreck]),
  [id('sorghum-sudangrass'), id('buckwheat'), 'COEXIST', 'mixture', COVER_MIX, [S.sareSorghum]],
  [id('sorghum-sudangrass'), id('soybean'), 'COEXIST', 'mixture', COVER_MIX, [S.sareSorghum]],
  [id('fodder-radish'), id('common-vetch'), 'COEXIST', 'mixture', L('Sown together as a cover-crop mixture (radish tends to dominate).', 'Werden als Gründüngungsmischung gemeinsam gesät (Rettich setzt sich meist durch).'), [S.elhakeem]],
  [id('fodder-radish'), id('phacelia'), 'COEXIST', 'mixture', COVER_MIX, [S.gross]],
  [id('phacelia'), id('common-vetch'), 'COEXIST', 'mixture', COVER_MIX, [S.gross]],
  [id('indian-mustard'), id('phacelia'), 'COEXIST', 'mixture', L('Sown together in cover-crop trials, though mustard strongly suppresses phacelia.', 'In Versuchen gemeinsam gesät, wobei Senf die Phazelie stark unterdrückt.'), [S.wendling]],
  [id('indian-mustard'), id('common-vetch'), 'COEXIST', 'inferred', L('White mustard, a close relative, is sown with common vetch in cover-crop mixtures; assumed similar for Indian mustard.', 'Weißer Senf, ein naher Verwandter, wird mit Saatwicke als Gründüngung gemischt; für Sareptasenf angenommen.'), [S.hasanaliyeva, S.gross]],
  [id('indian-mustard'), id('fodder-radish'), 'COEXIST', 'mixture', COVER_MIX, [S.sareBrassica]],
  [id('sainfoin'), id('white-clover'), 'COEXIST', 'mixture', L('Sown together in vineyard inter-row covers.', 'Werden gemeinsam als Weinbergs-Zwischenreihenbegrünung gesät.'), [S.hasanaliyeva]],
  [id('sweet-potato'), id('alfalfa'), 'EXCLUDE', 'trial', L('In greenhouse tests, soil from sweet potato plots reduced alfalfa growth for several weeks.', 'Im Gewächshaus verringerte Boden aus Süßkartoffel-Beeten das Luzernewachstum für einige Wochen.'), [S.harrison]],
];

function pairsOf(ids: string[], verdict: OverlapVerdict, evidence: OverlapEvidence, reason: LocalizedString, sources: string[]): Pair[] {
  const out: Pair[] = [];
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) out.push([id(ids[i]), id(ids[j]), verdict, evidence, reason, sources]);
  return out;
}

const key = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);
const RANK: Record<OverlapVerdict, number> = { EXCLUDE: 0, MOSAIC: 1, COEXIST: 2 };
/** Documented pairs; if two sources disagree the more cautious verdict wins. */
export const OVERLAP_PAIRS: ReadonlyMap<string, OverlapResult> = (() => {
  const m = new Map<string, OverlapResult>();
  for (const [a, b, verdict, evidence, reason, sources] of PAIRS) {
    const k = key(a, b);
    const prev = m.get(k);
    if (prev && RANK[prev.verdict] <= RANK[verdict]) {
      if (prev.verdict === verdict) prev.sources = [...new Set([...prev.sources, ...sources])];
      continue;
    }
    m.set(k, { verdict, evidence, reason, sources: [...sources] });
  }
  return m;
})();

/** Annual alley covers that are cut and worked into the soil: they never overlap perennial covers. */
// (buckwheat is not listed: in orchard alley mixes it is an undisturbed first-year nurse crop)
const TILLED_ALLEYS = new Set([id('sorghum-sudangrass'), id('indian-mustard'), id('fodder-radish'), id('phacelia')]);
const CREEPING_JENNY = id('creeping-jenny');
const SORGHUM = id('sorghum-sudangrass');
const isPerennialCover = (p: GuildPlant, s: GroundCoverSpec) => p.perennial && s.mode !== 'ALLEY';

/** How two ground covers share the ground. Symmetric. */
export function coverOverlap(a: GuildPlant, b: GuildPlant): OverlapResult {
  const sa = getGroundCoverSpec(a);
  const sb = getGroundCoverSpec(b);
  if (!sa || !sb) return { verdict: 'MOSAIC', evidence: 'inferred', reason: L('', ''), sources: [] };
  const doc = OVERLAP_PAIRS.get(key(a.id, b.id));
  if (doc) return doc;

  const either = (f: (p: GuildPlant, s: GroundCoverSpec) => boolean) => f(a, sa) || f(b, sb);
  const pairWith = (fa: (p: GuildPlant, s: GroundCoverSpec) => boolean, fb: (p: GuildPlant, s: GroundCoverSpec) => boolean) =>
    (fa(a, sa) && fb(b, sb)) || (fa(b, sb) && fb(a, sa));

  // Group exceptions
  if (either(p => p.id === SORGHUM)) {
    return { verdict: 'EXCLUDE', evidence: 'trial', reason: L('Sorghum-sudangrass roots release sorgoleone, which suppresses neighbouring seedlings; of the planner\'s plants only buckwheat and soybean are documented partners.', 'Sorghum-Sudangras gibt über die Wurzeln Sorgoleon ab, das benachbarte Keimlinge unterdrückt; von den Pflanzen des Planers sind nur Buchweizen und Sojabohne belegte Partner.'), sources: [S.weston, S.sareSorghum] };
  }
  if (pairWith(p => TILLED_ALLEYS.has(p.id), isPerennialCover)) {
    return { verdict: 'EXCLUDE', evidence: 'inferred', reason: L('This strip is cut and worked into the soil, which would destroy a perennial cover underneath (planning judgement).', 'Dieser Streifen wird gemulcht und eingearbeitet, was einen mehrjährigen Bodendecker darunter zerstören würde (Planungsentscheidung).'), sources: [] };
  }
  if (pairWith(p => isAlliumPlant(p), p => isLegumePlant(p))) {
    return { verdict: 'EXCLUDE', evidence: 'inferred', reason: L('Onion-family plants and legumes are kept apart (the planner\'s allium–legume rule; traditional companion-planting rule, not backed by trials).', 'Lauchgewächse und Leguminosen werden getrennt gehalten (die Lauch-Leguminosen-Regel des Planers; überlieferte Mischkulturregel, nicht durch Versuche belegt).'), sources: [] };
  }
  if (pairWith((_, s) => Boolean(s.acidOnly), p => isStrictCalcicolePlant(p))) {
    return { verdict: 'EXCLUDE', evidence: 'inferred', reason: L('Acid-soil and lime-loving plants need different soil.', 'Moorbeet- und kalkliebende Pflanzen brauchen unterschiedlichen Boden.'), sources: [] };
  }
  if (pairWith(p => p.id === CREEPING_JENNY, (_, s) => s.mode === 'CARPET')) {
    return { verdict: 'MOSAIC', evidence: 'guidance', reason: L('Creeping jenny can form dense mats that crowd out other carpets (reported mainly in weed fact sheets).', 'Pfennigkraut kann dichte Teppiche bilden, die andere Bodendecker verdrängen (v. a. in Unkraut-Merkblättern beschrieben).'), sources: [S.feisJenny] };
  }

  // Timing: plants that use the ground at different times overlap
  const ephemeral = (s: GroundCoverSpec) => s.seasonLayer === 'SPRING_EPHEMERAL';
  if (sa.seasonLayer !== sb.seasonLayer) {
    if (ephemeral(sa) !== ephemeral(sb) && (sa.seasonLayer === 'SUMMER' || sb.seasonLayer === 'SUMMER')) {
      const [bulb, mat] = ephemeral(sa) ? [a, b] : [b, a];
      const matSpec = ephemeral(sa) ? sb : sa;
      // a low mat lets bulbs through; a mat taller than half the bulb competes with it
      if (matSpec.mode === 'CARPET' && mat.heightM > bulb.heightM * 0.5) {
        return { verdict: 'MOSAIC', evidence: 'guidance', reason: L('Rule of thumb from bulb growers: the ground cover should be at most half as tall as the bulb flower; this one is taller (horticultural guidance).', 'Faustregel aus dem Zwiebelhandel: Der Bodendecker sollte höchstens halb so hoch sein wie die Zwiebelblüte; dieser ist höher (gärtnerische Empfehlung).'), sources: [S.brecks] };
      }
      return { verdict: 'COEXIST', evidence: 'community', reason: L('Spring plants grow and die back before the summer cover closes, so both use the same ground at different times (by analogy with woodland spring flowers).', 'Frühjahrspflanzen wachsen und ziehen ein, bevor sich der Sommerbodendecker schließt; beide nutzen denselben Boden zu verschiedenen Zeiten (in Analogie zu Frühjahrsblühern im Wald).'), sources: [S.mullerBormann] };
    }
    if ((sa.seasonLayer === 'COOL_SEASON' && sb.seasonLayer === 'SUMMER') || (sb.seasonLayer === 'COOL_SEASON' && sa.seasonLayer === 'SUMMER')) {
      const [cool, summer] = sa.seasonLayer === 'COOL_SEASON' ? [sa, sb] : [sb, sa];
      // subterranean clover must re-establish from seed each autumn; a dense perennial carpet competes with it
      const coolPlant = sa.seasonLayer === 'COOL_SEASON' ? a : b;
      if (summer.mode === 'CARPET' && cool.mode !== 'ALLEY' && coolPlant.id === id('subterranean-clover')) {
        return { verdict: 'MOSAIC', evidence: 'community', reason: L('This winter annual must re-establish from seed each autumn; a dense perennial carpet competes with it (white clover cut subterranean-clover seed yield from 757 to 34 mg/dm²).', 'Diese Winterannuelle muss sich jeden Herbst aus Samen neu etablieren; ein dichter mehrjähriger Teppich konkurriert mit ihr (Weißklee senkte den Samenertrag des Bodenfrüchtigen Klees von 757 auf 34 mg/dm²).'), sources: [S.smithCrespo] };
      }
      return { verdict: 'COEXIST', evidence: 'inferred', reason: L('Winter and summer covers use the ground at different times (planning judgement).', 'Winter- und Sommerbegrünung nutzen den Boden zu verschiedenen Zeiten (Planungsentscheidung).'), sources: [] };
    }
  }
  // Same season, no documented pair: separate patches with a mixed border
  return {
    verdict: 'MOSAIC', evidence: 'inferred',
    reason: L('No evidence that these two intermix; drawn as neighbouring patches with a mixed border (planning convention; light competition favours taller plants).', 'Kein Beleg für Durchmischung; als benachbarte Flecken mit gemischtem Rand dargestellt (Planungskonvention; Lichtkonkurrenz begünstigt höhere Pflanzen).'),
    sources: [S.hautier, S.demalach, S.barry],
  };
}
