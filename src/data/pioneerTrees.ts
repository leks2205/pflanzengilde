import { LocalizedString } from '../types/guild';

/**
 * Pioneer and nurse trees (research pass 2026-11-08: five literature scopes, citations checked
 * against Crossref and the primary pages; report in the maintainer notes).
 *
 * A pioneer tree is an early-successional, light-demanding, fast-growing tree that colonises open
 * ground. Pioneer status alone says nothing about helping a star plant, so the planner shows two tiers:
 *
 * - NURSE_TRIAL  field data with a star plant of this planner as the host (growth, yield or foliar N
 *                measured against a control). `trialStarIds` names those hosts. The trial may still show
 *                a conflict (black alder died back next to vigorous walnut), which the text must say.
 * - PIONEER      pioneer trait plus a measured mechanism (nitrogen fixation, shelter, a forestry nurse
 *                trial), but no trial with a star plant here.
 *
 * Shade-tolerant trees (linden) and invasive or toxic species (Robinia, Leucaena, Acacia) are not
 * pioneers in this sense and are explained in the pioneer guide instead.
 */
export type PioneerTier = 'NURSE_TRIAL' | 'PIONEER';

export interface PioneerTreeInfo {
  tier: PioneerTier;
  /** Star plants (STAR_TREES ids) that were the host in a nurse field trial. */
  trialStarIds: string[];
  /** What the evidence shows, including its limits. */
  evidence: LocalizedString;
  /** How to keep the pioneer from overtopping the star (cycle, height, when to remove). */
  management: LocalizedString;
  sources: string[];
}

const SRC = {
  dawson1993: 'Dawson, J. O., & Van Sambeek, J. W. (1993). Interplanting woody nurse crops promotes differential growth of black walnut saplings. In Proceedings, 9th Central Hardwood Forest Conference (USDA Forest Service Gen. Tech. Rep. NC-161), 455–464. https://research.fs.usda.gov/treesearch/15340',
  clark2008: 'Clark, J. R., Hemery, G. E., & Savill, P. S. (2008). Early growth and form of common walnut (Juglans regia L.) in mixture with tree and shrub nurse species in southern England. Forestry, 81(5), 631–644. doi:10.1093/forestry/cpn036',
  lount2013: 'Clark, J. (2013). Walnut trials at Lount Wood: report 2013. Earth Trust / National Forest Company. https://nationalforest.org/sites/default/files/2024-05/Walnut%20Trials%20at%20Lount%202013%20%28344kb%29.pdf',
  niccoli2021: 'Niccoli, F., Danise, T., Innangi, M., Pelleri, F., Manetti, M. C., & Mastrolonardo, G. (2021). Tree species composition in mixed plantations influences plant growth, intrinsic water use efficiency and soil carbon stock. Forests, 12(9), 1251. doi:10.3390/f12091251',
  niab: 'NIAB (n.d.). Provision of adequate shelter in the orchard. https://niab.com/node/1853',
  tiebel2018: 'Tiebel, K., Huth, F., & Wagner, S. (2018). Soil seed banks of pioneer tree species in European temperate forests: a review. iForest, 11, 48–57. doi:10.3832/ifor2400-011',
  mortimer2015: 'Mortimer, P. E., Gui, H., Xu, J., Zhang, C., Barrios, E., & Hyde, K. D. (2015). Alder trees enhance crop productivity and soil microbial biomass in tea plantations. Applied Soil Ecology, 96, 25–32. doi:10.1016/j.apsoil.2015.05.012',
  issah2015: 'Issah, G., Kimaro, A. A., Kort, J., & Knight, J. D. (2015). Nitrogen transfer to forage crops from a Caragana shelterbelt. Forests, 6(6), 1922–1932. doi:10.3390/f6061922',
  atlasIncana: 'Houston Durrant, T., de Rigo, D., & Caudullo, G. (2016). Alnus incana in Europe: distribution, habitat, usage and threats. In San-Miguel-Ayanz, J., et al. (Eds.), European Atlas of Forest Tree Species. Publications Office of the EU, Luxembourg. https://forest.jrc.ec.europa.eu/media/atlas/Alnus_incana.pdf',
  atlasCordata: 'Caudullo, G., & Mauri, A. (2016). Alnus cordata in Europe: distribution, habitat, usage and threats. In San-Miguel-Ayanz, J., et al. (Eds.), European Atlas of Forest Tree Species. Publications Office of the EU, Luxembourg. https://forest.jrc.ec.europa.eu/media/atlas/Alnus_cordata.pdf',
  atlasGlutinosa: 'Houston Durrant, T., de Rigo, D., & Caudullo, G. (2016). Alnus glutinosa in Europe: distribution, habitat, usage and threats. In San-Miguel-Ayanz, J., et al. (Eds.), European Atlas of Forest Tree Species. Publications Office of the EU, Luxembourg. https://forest.jrc.ec.europa.eu/media/atlas/Alnus_glutinosa.pdf',
  atlasCaprea: 'Enescu, C. M., Houston Durrant, T., de Rigo, D., & Caudullo, G. (2016). Salix caprea in Europe: distribution, habitat, usage and threats. In San-Miguel-Ayanz, J., et al. (Eds.), European Atlas of Forest Tree Species. Publications Office of the EU, Luxembourg. https://forest.jrc.ec.europa.eu/media/atlas/Salix_caprea.pdf',
  atlasBetula: 'Beck, P., Caudullo, G., de Rigo, D., & Tinner, W. (2016). Betula pendula, Betula pubescens and other birches in Europe: distribution, habitat, usage and threats. In San-Miguel-Ayanz, J., et al. (Eds.), European Atlas of Forest Tree Species. Publications Office of the EU, Luxembourg. https://forest.jrc.ec.europa.eu/media/atlas/Betula_spp.pdf',
  atlasSorbus: 'Räty, M., Caudullo, G., & de Rigo, D. (2016). Sorbus aucuparia in Europe: distribution, habitat, usage and threats. In San-Miguel-Ayanz, J., et al. (Eds.), European Atlas of Forest Tree Species. Publications Office of the EU, Luxembourg. https://forest.jrc.ec.europa.eu/media/atlas/Sorbus_aucuparia.pdf',
  martinik2018: 'Martiník, A., Sendecký, M., & Urban, J. (2018). Survival and early growth of silver fir and pioneer species on two sites in nurse crop regeneration systems in the Czech Republic. Dendrobiology, 80, 81–90. doi:10.12657/denbio.080.008',
  baker1993: 'Baker, D. (1993). Hippophaë rhamnoides: an NFT valued for centuries. NFTA 93-02. Forest, Farm, and Community Tree Network (FACT Net), Winrock International. https://winrock.org/hippophae-rhamnoides-an-nft-valued-for-centuries/',
  orwaNepal: 'Orwa, C., et al. (2009). Agroforestree Database: a tree reference and selection guide version 4.0 – Alnus nepalensis. World Agroforestry Centre, Kenya. https://apps.worldagroforestry.org/treedb/AFTPDFS/Alnus_nepalensis.PDF',
  orwaInga: 'Orwa, C., Mutua, A., Kindt, R., Jamnadass, R., & Anthony, S. (2009). Agroforestree Database: a tree reference and selection guide version 4.0 – Inga edulis. World Agroforestry Centre, Kenya. https://apps.worldagroforestry.org/treedb/AFTPDFS/Inga_edulis.PDF',
  schwintzer1982: 'Schwintzer, C. R., Berry, A. M., & Disney, L. D. (1982). Seasonal patterns of root nodule growth, endophyte morphology, nitrogenase activity, and shoot development in Myrica gale. Canadian Journal of Botany, 60(6), 746–757. doi:10.1139/b82-098',
  berriel2023: 'Berriel, V., & Perdomo, C. H. (2023). Cajanus cajan: a promissory high-nitrogen fixing cover crop for Uruguay. Frontiers in Agronomy, 5, 1214811. doi:10.3389/fagro.2023.1214811',
  tropicalForages: 'Cook, B. G., et al. (2020). Cajanus cajan. Tropical Forages: an interactive selection tool. CIAT and ILRI. https://tropicalforages.info/text/entities/cajanus_cajan.htm',
  treesForLifeGale: 'Trees for Life (n.d.). Bog myrtle (Myrica gale). https://treesforlife.org.uk/into-the-forest/trees-plants-animals/plants/bog-myrtle/',
  lwf17: 'Bayerische Landesanstalt für Wald und Forstwirtschaft (n.d.). Beiträge zur Vogelbeere (LWF Wissen 17; proceedings of the 1997 Tree of the Year conference). Freising. https://www.lwf.bayern.de/mam/cms04/service/dateien/w17_beitraege_zur_vogelbeere_gesamtheft_gesch.pdf',
};

/** Shared source list for the pioneer guide. */
export const PIONEER_SOURCES = SRC;

const L = (en: string, de: string): LocalizedString => ({ en, de });

export const PIONEER_TREES: Readonly<Record<string, PioneerTreeInfo>> = {
  'plant-elaeagnus': {
    tier: 'NURSE_TRIAL',
    trialStarIds: ['tree-walnut'],
    evidence: L(
      'Best-tested nurse for walnut. In a 14-year Illinois trial, black walnut between autumn olive or other nitrogen-fixing nurses grew up to 50 % more than in pure plots; non-fixing nurses gave no significant gain. In southern England, walnut height growth with autumn olive was significantly greater and foliar nitrogen was in the optimal range, while walnuts without a nitrogen-fixing nurse were nitrogen deficient. At Lount (UK) the best walnuts of every type grew with autumn olive as shrub nurse.',
      'Am besten geprüfte Amme für Walnuss. In einem 14-jährigen Versuch in Illinois wuchsen Schwarznüsse zwischen Doldiger Ölweide oder anderen stickstoffbindenden Ammen bis zu 50 % stärker als in reinen Parzellen; nicht-fixierende Ammen brachten keinen signifikanten Vorteil. In Südengland war das Höhenwachstum der Walnuss mit Ölweide signifikant größer und der Blattstickstoff im Optimalbereich, während Walnüsse ohne stickstoffbindende Amme Stickstoffmangel hatten. In Lount (UK) wuchsen die besten Walnüsse jeder Sorte mit Ölweide als Strauchamme.'
    ),
    management: L(
      'Cut it back as soon as it shades the young tree: at Lount, autumn olive that grew particularly well cast too much shade and had to be cut back. Planted in North America it spreads by bird-dispersed seed.',
      'Zurückschneiden, sobald sie den jungen Baum beschattet: In Lount warfen besonders wüchsige Ölweiden zu dichten Schatten und mussten zurückgeschnitten werden. In Nordamerika breitet sie sich über Vogelsamen aus.'
    ),
    sources: [SRC.dawson1993, SRC.clark2008, SRC.lount2013]
  },
  'plant-caragana': {
    tier: 'NURSE_TRIAL',
    trialStarIds: ['tree-walnut'],
    evidence: L(
      'One of the four nitrogen-fixing nurses in the 14-year Illinois walnut trial (up to 50 % more walnut growth than pure plots). It survived well on the drier upland site and poorly on the floodplain. Next to a caragana shelterbelt, about 40 % of the nitrogen in forage crops 4 m away came from caragana, but crops 2 m from the row grew worse.',
      'Eine der vier stickstoffbindenden Ammen im 14-jährigen Walnussversuch in Illinois (bis zu 50 % mehr Walnusswachstum als in reinen Parzellen). Auf dem trockeneren Hangstandort überlebte er gut, in der Aue schlecht. Neben einer Caragana-Windschutzhecke stammten in 4 m Abstand etwa 40 % des Stickstoffs in Futterpflanzen von Caragana, 2 m neben der Reihe wuchsen die Pflanzen aber schlechter.'
    ),
    management: L(
      'Plant at least 3 m from the star and prune after flowering to keep it at 2–3 m.',
      'Mindestens 3 m von der Star-Pflanze entfernt pflanzen und nach der Blüte auf 2–3 m schneiden.'
    ),
    sources: [SRC.dawson1993, SRC.issah2015]
  },
  'plant-alder': {
    tier: 'NURSE_TRIAL',
    trialStarIds: ['tree-walnut'],
    evidence: L(
      'Light-demanding, fast-growing pioneer that fixes nitrogen with Frankia. In the 14-year Illinois trial black alder promoted walnut growth more than the other nurses on the upland site, but on the floodplain many alders died next to the vigorous walnuts, which the authors attribute to alder\'s sensitivity to juglone. The planner therefore never pairs it with walnut and uses it as a coppiced windbreak and nitrogen source for apple, pear and tea; NIAB names alders among the best windbreak trees for apple orchards.',
      'Lichtbedürftiger, schnellwüchsiger Pionierbaum, der mit Frankia Stickstoff bindet. Im 14-jährigen Versuch in Illinois förderte die Schwarzerle das Walnusswachstum auf dem Hangstandort stärker als die anderen Ammen, in der Aue starben aber viele Erlen neben den wüchsigen Walnüssen, was die Autoren auf ihre Juglonempfindlichkeit zurückführen. Der Planer kombiniert sie daher nie mit Walnuss und nutzt sie als auf den Stock gesetzten Windschutz und Stickstoffquelle für Apfel, Birne und Tee; NIAB zählt Erlen zu den besten Windschutzbäumen für Apfelanlagen.'
    ),
    management: L(
      'Coppice on a 2–4 year rotation in late winter or keep a pollard head at 1.8–2.0 m so the crown only casts light shade.',
      'Im Spätwinter im 2–4-jährigen Umtrieb auf den Stock setzen oder einen Kopf in 1,8–2,0 m halten, damit die Krone nur lichten Schatten wirft.'
    ),
    sources: [SRC.dawson1993, SRC.niab, SRC.atlasGlutinosa]
  },
  'plant-nepal-alder': {
    tier: 'NURSE_TRIAL',
    trialStarIds: ['tree-tea-assamica'],
    evidence: L(
      'Pioneer of degraded Himalayan slopes that fixes nitrogen with Frankia. In a Yunnan field study, Assam tea with interplanted alders yielded 52–72 % more than tea monoculture, with more soil fungal and bacterial biomass.',
      'Pionier degradierter Himalaya-Hänge, der mit Frankia Stickstoff bindet. In einer Feldstudie in Yunnan brachte Assam-Tee mit eingepflanzten Erlen 52–72 % mehr Ertrag als Tee-Monokultur, bei höherer Pilz- und Bakterienbiomasse im Boden.'
    ),
    management: L(
      'Lop side branches in the cool dry season and keep the shade light: denser shade went with more tea mosquito bug damage in the only tea survey available.',
      'Seitenäste in der kühlen Trockenzeit schneiteln und den Schatten licht halten: Dichterer Schatten ging in der einzigen vorliegenden Tee-Erhebung mit mehr Teewanzen-Schäden einher.'
    ),
    sources: [SRC.mortimer2015, SRC.orwaNepal]
  },
  'plant-italian-alder': {
    tier: 'PIONEER',
    trialStarIds: [],
    evidence: L(
      'Medium-sized pioneer that colonises open ground, fixes nitrogen and is planted for windbreaks; NIAB names it especially suited for apple-orchard windbreaks. At Lount, walnuts with Italian alder as tree nurse grew tall, but the trial had no plot without a tree nurse, so the alder effect cannot be separated. In a 20-year Italian plantation the early benefit of nurse trees faded once their crowns competed for light.',
      'Mittelgroßer Pionierbaum, der offene Flächen besiedelt, Stickstoff bindet und für Windschutz gepflanzt wird; NIAB nennt ihn besonders geeignet für den Windschutz von Apfelanlagen. In Lount wuchsen Walnüsse mit Italienischer Erle als Ammenbaum hoch, der Versuch hatte aber keine Parzelle ohne Ammenbaum, sodass sich die Erlenwirkung nicht trennen lässt. In einer 20-jährigen italienischen Pflanzung ließ der anfängliche Nutzen der Ammenbäume nach, sobald ihre Kronen um Licht konkurrierten.'
    ),
    management: L(
      'Coppice or pollard every few years in late winter; at Lount the alders had to be cut back where they started to overtop the walnuts.',
      'Alle paar Jahre im Spätwinter auf den Stock setzen oder köpfen; in Lount mussten die Erlen zurückgeschnitten werden, wo sie die Walnüsse zu überwachsen begannen.'
    ),
    sources: [SRC.atlasCordata, SRC.niab, SRC.lount2013, SRC.niccoli2021]
  },
  'plant-grey-alder': {
    tier: 'PIONEER',
    trialStarIds: [],
    evidence: L(
      'Fast-growing, short-lived pioneer that colonises disturbed ground, fixes nitrogen and is used to improve soil and reclaim derelict land; extremely frost tolerant. NIAB names it especially suited for apple-orchard windbreaks. No nurse trial with a fruit or nut tree was found.',
      'Schnellwüchsiger, kurzlebiger Pionierbaum, der gestörte Flächen besiedelt, Stickstoff bindet und zur Bodenverbesserung und Rekultivierung genutzt wird; äußerst frosthart. NIAB nennt ihn besonders geeignet für den Windschutz von Apfelanlagen. Ein Ammenversuch mit einem Obst- oder Nussbaum wurde nicht gefunden.'
    ),
    management: L(
      'Coppice every 2–4 years in late winter; it regenerates from root suckers, so dig out suckers inside the guild.',
      'Alle 2–4 Jahre im Spätwinter auf den Stock setzen; sie treibt Wurzelbrut, daher Ausläufer innerhalb der Gilde abstechen.'
    ),
    sources: [SRC.atlasIncana, SRC.niab]
  },
  'plant-seabuckthorn': {
    tier: 'PIONEER',
    trialStarIds: [],
    evidence: L(
      'Nitrogen-fixing pioneer of open, disturbed sites such as dunes and river gravel, used for soil improvement and wind and sand control. No nurse trial with a star plant here was found.',
      'Stickstoffbindender Pionier offener, gestörter Standorte wie Dünen und Flusskies, genutzt zur Bodenverbesserung und gegen Wind- und Sanderosion. Ein Ammenversuch mit einer Star-Pflanze dieses Planers wurde nicht gefunden.'
    ),
    management: L(
      'Needs full sun and suckers: plant it on a sunny outer edge, never under a taller crown, and cut suckers back.',
      'Braucht volle Sonne und bildet Ausläufer: an einen sonnigen Außenrand setzen, nie unter eine höhere Krone, und Ausläufer zurückschneiden.'
    ),
    sources: [SRC.baker1993]
  },
  'plant-willow': {
    tier: 'PIONEER',
    trialStarIds: [],
    evidence: L(
      'Willows are among the classic short-lived pioneer trees of European forests. Pioneer is not the same as nurse, though: NIAB advises against willow in orchard windbreaks because it competes strongly for water and nutrients. Use it for biomass and early pollen, well away from the star.',
      'Weiden gehören zu den klassischen kurzlebigen Pionierbäumen europäischer Wälder. Pionier heißt aber nicht Amme: NIAB rät von Weiden im Windschutz von Obstanlagen ab, weil sie stark um Wasser und Nährstoffe konkurrieren. Für Biomasse und frühen Pollen nutzen, mit Abstand zur Star-Pflanze.'
    ),
    management: L(
      'Coppice in late winter (February) at 30–50 cm above ground.',
      'Im Spätwinter (Februar) 30–50 cm über dem Boden auf den Stock setzen.'
    ),
    sources: [SRC.tiebel2018, SRC.niab]
  },
  'plant-goat-willow': {
    tier: 'PIONEER',
    trialStarIds: [],
    evidence: L(
      'Fast-growing pioneer of open, sunny ground and one of the first spring flowers, with a high quantity of pollen and nectar. Its value next to a pear is early predator bugs (counts only, no damage trial); like other willows it competes for water, so keep it on the outer edge.',
      'Schnellwüchsiger Pionier offener, sonniger Flächen und einer der ersten Frühjahrsblüher mit viel Pollen und Nektar. Neben einer Birne liefert er früh Raubwanzen (nur Zählungen, kein Schadensversuch); wie andere Weiden konkurriert er um Wasser, daher an den äußeren Rand setzen.'
    ),
    management: L(
      'Coppice or pollard every 1–3 years in winter, taking at most half the rods a year so catkins flower every spring.',
      'Alle 1–3 Jahre im Winter auf den Stock setzen oder köpfen, pro Jahr höchstens die Hälfte der Ruten, damit jedes Frühjahr Kätzchen blühen.'
    ),
    sources: [SRC.atlasCaprea, SRC.niab]
  },
  'plant-silver-birch': {
    tier: 'PIONEER',
    trialStarIds: [],
    evidence: L(
      'The classic pioneer of European secondary succession; birch stands shelter seedlings of frost-sensitive trees. In a Czech forestry trial silver fir grew significantly taller under silver birch after three years. The host was a conifer seedling, not a fruit or nut tree.',
      'Der klassische Pionier der europäischen Sekundärsukzession; Birkenbestände schützen Sämlinge frostempfindlicher Bäume. In einem tschechischen Forstversuch wuchs Weißtanne unter Hänge-Birke nach drei Jahren signifikant höher. Wirt war ein Nadelbaum-Sämling, kein Obst- oder Nussbaum.'
    ),
    management: L(
      'Treat it as a temporary nurse: thin in winter and fell after about 5–10 years. It resprouts poorly, so do not plan it as coppice.',
      'Als vorübergehende Amme behandeln: im Winter auslichten und nach etwa 5–10 Jahren fällen. Sie treibt schlecht aus dem Stock aus, daher nicht als Niederwald planen.'
    ),
    sources: [SRC.atlasBetula, SRC.martinik2018, SRC.tiebel2018]
  },
  'plant-rowan': {
    tier: 'PIONEER',
    trialStarIds: [],
    evidence: L(
      'Frost-hardy pioneer that colonises open ground together with willow and birch; in forestry it is used as a nurse and filler tree for beech and fir. No nurse trial with a fruit or nut tree was found, and it hosts fire blight, so it is kept away from apple, pear and quince.',
      'Frostharter Pionier, der zusammen mit Weide und Birke offene Flächen besiedelt; im Wald wird er als Schutz- und Füllbaum für Buche und Tanne genutzt. Ein Ammenversuch mit einem Obst- oder Nussbaum wurde nicht gefunden, und er ist Feuerbrandwirt, daher Abstand zu Apfel, Birne und Quitte.'
    ),
    management: L(
      'Resprouts very well: coppice in winter when the crown starts to shade the star.',
      'Treibt sehr gut aus dem Stock aus: im Winter auf den Stock setzen, wenn die Krone die Star-Pflanze zu beschatten beginnt.'
    ),
    sources: [SRC.atlasSorbus, SRC.lwf17]
  },
  'plant-sweet-gale': {
    tier: 'PIONEER',
    trialStarIds: [],
    evidence: L(
      'Nitrogen-fixing shrub (Frankia) of open, wet, acidic ground that plays the same role there as alder: dense stands fixed 24–37 kg N per hectare and year. No trial of nitrogen transfer to a fruit shrub was found.',
      'Stickstoffbindender Strauch (Frankia) offener, nasser, saurer Standorte, der dort dieselbe Rolle spielt wie die Erle: Dichte Bestände banden 24–37 kg N je Hektar und Jahr. Ein Versuch zur Stickstoffübertragung auf einen Obststrauch wurde nicht gefunden.'
    ),
    management: L(
      'Only in permanently moist, acidic soil. It spreads by rhizomes; cut back runners that grow into the star\'s root zone.',
      'Nur in dauerhaft feuchtem, saurem Boden. Breitet sich über Rhizome aus; Ausläufer, die in den Wurzelraum der Star-Pflanze wachsen, abstechen.'
    ),
    sources: [SRC.schwintzer1982, SRC.treesForLifeGale]
  },
  'plant-pigeon-pea': {
    tier: 'PIONEER',
    trialStarIds: [],
    evidence: L(
      'Fast, short-lived woody legume: in a Uruguayan cover-crop trial it fixed about 149 kg N/ha on average (up to about 253 kg) with about 11 t/ha of biomass in about 120 days. It is a classic establishment-phase nurse in warm climates, but no trial with a fruit tree as host was found.',
      'Schneller, kurzlebiger holziger Schmetterlingsblütler: In einem Zwischenfruchtversuch in Uruguay band er im Mittel etwa 149 kg N/ha (bis etwa 253 kg) bei rund 11 t/ha Biomasse in etwa 120 Tagen. Er ist eine klassische Amme für die Anwuchsphase in warmen Klimaten, ein Versuch mit einem Obstbaum als Wirt wurde aber nicht gefunden.'
    ),
    management: L(
      'Sow while the star is young, cut it back at the end of the season and lay the prunings as mulch; replace it after 2–5 years. It cannot tolerate frequent, severe cutting.',
      'Aussäen, solange die Star-Pflanze jung ist, am Saisonende zurückschneiden und das Schnittgut als Mulch auslegen; nach 2–5 Jahren ersetzen. Häufigen, starken Schnitt verträgt er nicht.'
    ),
    sources: [SRC.berriel2023, SRC.tropicalForages]
  },
  'plant-inga': {
    tier: 'PIONEER',
    trialStarIds: [],
    evidence: L(
      'Light-demanding gap pioneer of lowland rain forest that grows fast on very poor acid soils, fixes nitrogen and has shaded coffee and cocoa since the 19th century. No trial with tea was found.',
      'Lichtbedürftiger Lückenpionier des Tiefland-Regenwalds, der auf sehr armen, sauren Böden schnell wächst, Stickstoff bindet und seit dem 19. Jahrhundert Kaffee und Kakao beschattet. Ein Versuch mit Tee wurde nicht gefunden.'
    ),
    management: L(
      'Prune side branches in the dry season, never below about 0.75 m, and leave a few branches uncut.',
      'Seitenäste in der Trockenzeit schneiden, nie tiefer als etwa 0,75 m, und einige Äste stehen lassen.'
    ),
    sources: [SRC.orwaInga]
  }
};

/**
 * Pioneer info for a companion id, or for a star plant through its companion twin (same botanical
 * name, e.g. tree-alder -> plant-alder, tree-rowan -> plant-rowan).
 */
export function getPioneerInfo(
  id: string,
  botanicalName?: string,
  catalogue?: ReadonlyArray<{ id: string; botanicalName: string }>
): { plantId: string; info: PioneerTreeInfo } | null {
  if (PIONEER_TREES[id]) return { plantId: id, info: PIONEER_TREES[id] };
  if (!botanicalName || !catalogue) return null;
  const key = botanicalName.toLowerCase().trim();
  const twin = catalogue.find(p => p.botanicalName.toLowerCase().trim() === key && PIONEER_TREES[p.id]);
  return twin ? { plantId: twin.id, info: PIONEER_TREES[twin.id] } : null;
}
