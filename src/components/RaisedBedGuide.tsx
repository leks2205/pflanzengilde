import React, { useState } from 'react';
import {
  ArrowUpRight, Ban, Blend, BookOpen, BrickWall, CalendarRange, ChevronDown, CloudSun, Droplets, Fence, Hammer, Info, KeyRound, Layers, Leaf,
  LucideIcon, Moon, Mountain, Ruler, Scale, Shovel, Snowflake, Sprout, Sun, SunMoon, Thermometer, ThumbsDown, ThumbsUp, TreeDeciduous, Waves,
} from 'lucide-react';
import { GuildRole, Language, getLoc, LocalizedString } from '../types/guild';
import { ROLE_CROSSES_BED_WALL } from '../core/bedWallRules';
import { BED_WARNINGS, BedWarningId, COMPANION_BED_SUITABILITY, STAR_BED_SUITABILITY } from '../data/raisedBedSuitability';
import { GROUND_COVER_SPECS } from '../data/groundCoverSpecs';
import { OVERLAP_PAIRS, OVERLAP_SOURCES, OverlapEvidence, OverlapVerdict } from '../data/groundCoverOverlap';
import { PlantThumbnail } from './PlantThumbnail';
import {
  BedCrossSection, BedHeightsDiagram, HolesDiagram, MergeDiagram, SeasonTimeline, ShadeDiagram, StripDiagram, TrunkZoneDiagram, VerdictPicture,
  WallCrossingDiagram, WalnutDiagram,
} from './guideDiagrams';
import { GUILD_PLANTS } from '../data/guildPlants';
import { STAR_TREES } from '../data/starTrees';
import { translateRole } from '../i18n/translations';

/**
 * Raised-bed guide (how to build one, what the planner assumes) and the ground-cover explainer.
 * Every factual statement carries a numbered source from BED_GUIDE_SOURCES (all DOIs checked on
 * Crossref, URLs checked 2026-10-03). Text is bilingual inline (DE is the binding language).
 */

type L = LocalizedString;
const L = (en: string, de: string): L => ({ en, de });

interface GuideSource { n: number; text: string; url?: string }

export const BED_GUIDE_SOURCES: GuideSource[] = [
  { n: 1, text: 'Ballard, H. K., Berle, D., & Westerfield, B. (2022). Raised beds vs. in-ground gardens (Circular 1027-3). University of Georgia Extension.', url: 'https://fieldreport.caes.uga.edu/publications/C1027-3/' },
  { n: 2, text: 'Wilton, M. J., et al. (2023). An examination of outdoor garden bed designs in a subarctic community. Arctic, 76(1), 60–71. doi:10.14430/arctic77061', url: 'https://doi.org/10.14430/arctic77061' },
  { n: 3, text: 'Miernicki, E. A., Lovell, S. T., & Wortman, S. E. (2018). Raised beds for vegetable production in urban agriculture. Urban Agriculture & Regional Food Systems, 3(1), 1–10. doi:10.2134/urbanag2018.06.0002', url: 'https://doi.org/10.2134/urbanag2018.06.0002' },
  { n: 4, text: 'Havis, J. R. (1976). Root hardiness of woody ornamentals. HortScience, 11(4), 385–386. doi:10.21273/HORTSCI.11.4.385; Studer, E. J., et al. (1978). Root hardiness of container-grown ornamentals. HortScience, 13(2), 172–174. doi:10.21273/HORTSCI.13.2.172; Mathers, H. M. (2003). Summary of temperature stress issues in nursery containers. HortTechnology, 13(4), 617–624. doi:10.21273/HORTTECH.13.4.0617', url: 'https://doi.org/10.21273/HORTSCI.11.4.385' },
  { n: 5, text: 'Landesamt für Umwelt / Gartenakademie Rheinland-Pfalz (2019). Hochbeete – Gärtnern auf Terrasse und Balkon. Umwelt im Alltag, August 2019.', url: 'https://mkuem.rlp.de/fileadmin/14/Service/Publikationen/UiA-August_2019_Hochbeete.pdf' },
  { n: 6, text: 'Ballard, H. K., Berle, D., & Westerfield, B. (2022). Raised bed materials (Circular 1027-5). University of Georgia Extension.', url: 'https://fieldreport.caes.uga.edu/publications/C1027-5/' },
  { n: 7, text: 'Rahman, F. A., Allan, D. L., Rosen, C. J., & Sadowsky, M. J. (2004). Arsenic availability from chromated copper arsenate (CCA)-treated wood. Journal of Environmental Quality, 33(1), 173–180. doi:10.2134/jeq2004.1730', url: 'https://doi.org/10.2134/jeq2004.1730' },
  { n: 8, text: 'Commission Directive 2003/2/EC restricting the marketing and use of arsenic (now REACH Regulation (EC) No 1907/2006, Annex XVII, entry 19); creosote: Annex XVII, entry 31.', url: 'https://eur-lex.europa.eu/eli/dir/2003/2/oj/eng' },
  { n: 9, text: 'Lebow, S. T., & Tippie, M. (2001). Guide for minimizing the effect of preservative-treated wood on sensitive environments (FPL-GTR-122). USDA Forest Service. doi:10.2737/FPL-GTR-122', url: 'https://doi.org/10.2737/FPL-GTR-122' },
  { n: 10, text: 'Kohler, M., & Künniger, T. (2003). Emissions of polycyclic aromatic hydrocarbons (PAH) from creosoted railroad ties and their relevance for life cycle assessment (LCA). Holz als Roh- und Werkstoff, 61, 117–124. doi:10.1007/s00107-003-0372-y', url: 'https://doi.org/10.1007/s00107-003-0372-y' },
  { n: 11, text: 'Lexmond, T. M. (1987). Distribution of the cumulative zinc burden upon soil around galvanized pylons supporting electricity transmission lines. Netherlands Journal of Agricultural Science, 35(3), 325–337. doi:10.18174/njas.v35i3.16728; Degryse, F., Buekers, J., & Smolders, E. (2004). Radio-labile cadmium and zinc in soils as affected by pH and source of contamination. European Journal of Soil Science, 55, 113–122. doi:10.1046/j.1351-0754.2003.0554.x', url: 'https://doi.org/10.18174/njas.v35i3.16728' },
  { n: 12, text: 'Davidson, D. (2015). Concrete blocks for raised beds (Ask Extension, Colorado State University Extension).', url: 'https://ask.extension.org/kb/faq.php?id=287745' },
  { n: 13, text: 'Chalker-Scott, L. (2017, rev. 2022). Hügelkultur: what is it, and should it be used in home gardens? (FS283E). Washington State University Extension. doi:10.7273/000004616', url: 'https://doi.org/10.7273/000004616' },
  { n: 14, text: 'Bayerische Gartenakademie / LWG (2017). Kulturheidelbeeren (Infoschrift 3163).', url: 'https://www.lwg.bayern.de/mam/cms06/gartenakademie/dateien/3163-kulturheidelbeeren.pdf' },
  { n: 15, text: 'Semananda, N. P. K., Ward, J. D., & Myers, B. R. (2016). Evaluating the efficiency of wicking bed irrigation systems for small-scale urban agriculture. Horticulturae, 2(4), 13. doi:10.3390/horticulturae2040013', url: 'https://doi.org/10.3390/horticulturae2040013' },
  { n: 16, text: 'Ogunleye, O. T., et al. (2024). Enhancing food security through keyhole gardening in Lesotho. Journal of Development Effectiveness. doi:10.1080/19439342.2024.2362784', url: 'https://doi.org/10.1080/19439342.2024.2362784' },
  { n: 17, text: 'Rauter, S., & Sherp, L. (2025). Sheet mulching and lasagna composting with cardboard (EM 9559). Oregon State University Extension.', url: 'https://extension.oregonstate.edu/catalog/em-9559-sheet-mulching-lasagna-composting-cardboard' },
  { n: 18, text: 'Iowa State University Extension (n.d.). What would be a good soil mix for a raised bed?', url: 'https://yardandgarden.extension.iastate.edu/faq/what-would-be-good-soil-mix-raised-bed' },
  { n: 19, text: 'Ballard, H. K., Berle, D., & Westerfield, B. (2022). Raised garden bed dimensions (Circular 1027-4). University of Georgia Extension.', url: 'https://fieldreport.caes.uga.edu/publications/C1027-4/raised-garden-bed-dimensions' },
  { n: 20, text: 'Baldwin, R. A. (2025). Pocket gophers (Pest Notes 7433). UC IPM.', url: 'https://ipm.ucanr.edu/PMG/PESTNOTES/pn7433.html' },
  { n: 21, text: 'Jean, J., Read, P. E., & Paparozzi, E. T. (2024, November). Growing blueberries in raised beds and containers in home or urban landscapes (EC3078). Nebraska Extension.', url: 'https://extensionpubs.unl.edu/publication/ec3078/2025/pdf/view/ec3078-2025.pdf' },
  { n: 22, text: 'Frey, B., & Schüepp, H. (1992). Transfer of symbiotically fixed nitrogen from berseem (Trifolium alexandrinum L.) to maize via vesicular-arbuscular mycorrhizal hyphae. New Phytologist, 122(3), 447–454. doi:10.1111/j.1469-8137.1992.tb00072.x; Mäder, P., et al. (2000). Transport of 15N from a soil compartment separated by a polytetrafluoroethylene membrane to plant roots via the hyphae of arbuscular mycorrhizal fungi. New Phytologist, 146(1), 155–161. doi:10.1046/j.1469-8137.2000.00615.x', url: 'https://doi.org/10.1111/j.1469-8137.1992.tb00072.x' },
  { n: 23, text: 'Dana, M. N., & Lerner, B. R. (rev. 1994). Black walnut toxicity (HO-193). Purdue Extension.', url: 'https://www.extension.purdue.edu/extmedia/ho/ho-193.pdf' },
  { n: 24, text: 'Roman, D., & Sellmer, J. (n.d.). Landscaping and gardening around walnuts and other juglone producing plants. Penn State Extension.', url: 'https://extension.psu.edu/landscaping-and-gardening-around-walnuts-and-other-juglone-producing-plants' },
  { n: 25, text: 'Joy, A., Hudelson, B., & Jull, L. (2024). Black walnut toxicity. University of Wisconsin–Madison Extension.', url: 'https://hort.extension.wisc.edu/articles/black-walnut-toxicity/' },
  { n: 26, text: 'Achatz, M., Morris, E. K., Müller, F., Hilker, M., & Rillig, M. C. (2014). Soil hypha-mediated movement of allelochemicals: arbuscular mycorrhizae extend the bioactive zone of juglone. Functional Ecology, 28(4), 1020–1029. doi:10.1111/1365-2435.12208; von Kiparski, G. R., Lee, L. S., & Gillespie, A. R. (2007). Occurrence and fate of the phytotoxin juglone in alley soils under black walnut trees. Journal of Environmental Quality, 36(3), 709–717. doi:10.2134/jeq2006.0231', url: 'https://doi.org/10.1111/1365-2435.12208' },
  { n: 27, text: 'Smith, M. W., Cheary, B. S., & Carroll, B. L. (2005). Size of vegetation-free area affects nonbearing pecan tree growth. HortScience, 40(5), 1298–1300. doi:10.21273/HORTSCI.40.5.1298; Neilsen, G. H., & Hogue, E. J. (2000). Comparison of white clover and mixed sodgrass as orchard floor vegetation. Canadian Journal of Plant Science, 80(3), 617–622. doi:10.4141/P99-126; Merwin, I. A., & Stiles, W. C. (1994). Orchard groundcover management impacts on apple tree growth and yield. Journal of the American Society for Horticultural Science, 119(2), 209–215. doi:10.21273/JASHS.119.2.209', url: 'https://doi.org/10.21273/HORTSCI.40.5.1298' },
  { n: 28, text: 'Atucha, A., Merwin, I. A., & Brown, M. G. (2011). Long-term effects of four groundcover management systems in an apple orchard. HortScience, 46(8), 1176–1183. doi:10.21273/HORTSCI.46.8.1176; Merwin, I. A., Ray, J. A., & Curtis, P. D. (1999). Orchard groundcover management systems affect meadow vole populations and damage to apple trees. HortScience, 34(2), 271–274. doi:10.21273/HORTSCI.34.2.271', url: 'https://doi.org/10.21273/HORTSCI.46.8.1176' },
  { n: 29, text: 'Hill, M. O., Mountford, J. O., Roy, D. B., & Bunce, R. G. H. (1999). Ellenberg\'s indicator values for British plants. ECOFACT Volume 2 Technical Annex. Institute of Terrestrial Ecology.', url: 'https://nora.nerc.ac.uk/id/eprint/6411/' },
  { n: 30, text: 'Cahenzli, F., et al. (2019). Perennial flower strips for pest control in organic apple orchards – A pan-European study. Agriculture, Ecosystems & Environment, 278, 43–53. doi:10.1016/j.agee.2019.03.011; FiBL / EcoOrchard (2019). Perennial flower strips for pest control in fruit orchards. The Organic Grower, 47, 26–29.', url: 'https://doi.org/10.1016/j.agee.2019.03.011' },
  { n: 31, text: 'Muller, R. N., & Bormann, F. H. (1976). Role of Erythronium americanum Ker. in energy flow and nutrient dynamics of a northern hardwood forest ecosystem. Science, 193(4258), 1126–1128. doi:10.1126/science.193.4258.1126; Lovett Doust, L. (1981). Population dynamics and local specialization in a clonal perennial (Ranunculus repens). Journal of Ecology, 69(3), 743–755. doi:10.2307/2259633', url: 'https://doi.org/10.1126/science.193.4258.1126' },
  { n: 32, text: 'Cooper, P. I. (1969). The absorption of radiation in solar stills. Solar Energy, 12(3), 333–346. doi:10.1016/0038-092X(69)90047-4 (solar declination formula used for the shade offset)', url: 'https://doi.org/10.1016/0038-092X(69)90047-4' },
];

interface Step { id: string; title: L; body: L[]; sources: number[] }

const STEPS: Step[] = [
  { id: 'bed-why', title: L('Why raised beds', 'Warum Hochbeete'), sources: [1, 2, 3], body: [
    L('Raised beds warm up earlier in spring and drain better, and their soil is not compacted because nobody walks on it [1].', 'Hochbeete erwärmen sich im Frühjahr früher und entwässern besser, und ihr Boden wird nicht verdichtet, weil niemand darauf tritt [1].'),
    L('In a subarctic field trial, 25 and 50 cm beds raised early-season soil temperature by 0.5–2.5 °C but held 41–53 % less soil moisture; kale yields were 44–58 % higher, but the difference was not statistically significant [2].', 'In einem subarktischen Feldversuch erhöhten 25 und 50 cm hohe Beete die Bodentemperatur im frühen Sommer um 0,5–2,5 °C, hielten aber 41–53 % weniger Bodenfeuchte; der Grünkohlertrag lag 44–58 % höher, der Unterschied war jedoch statistisch nicht gesichert [2].'),
    L('In an urban trial in Illinois, radish, kale and coriander yielded most in raised beds; a compost–soil mix worked better than pure compost [3].', 'In einem Stadtversuch in Illinois brachten Radieschen, Grünkohl und Koriander im Hochbeet die höchsten Erträge; eine Mischung aus Kompost und Erde funktionierte besser als reiner Kompost [3].'),
  ] },
  { id: 'bed-drawbacks', title: L('Drawbacks', 'Nachteile'), sources: [1, 3, 4], body: [
    L('Raised beds dry out faster and need more watering; materials and fill cost money [1]. Pure-compost fills needed more irrigation, and mixing in soil cut the irrigation demand by 32 % [3].', 'Hochbeete trocknen schneller aus und brauchen mehr Wasser; Material und Füllung kosten Geld [1]. Reine Kompostfüllungen brauchten mehr Bewässerung, eingemischte Erde senkte den Wasserbedarf um 32 % [3].'),
    L('Roots near the walls can freeze harder than in the ground. This is shown for nursery containers: the lethal root temperature of 38 woody plants ranged from −5 to −23 °C, far above their shoot hardiness [4]. Insulate the walls of small or tall beds in winter.', 'Wurzeln an den Wänden können stärker frieren als im Boden. Nachgewiesen ist das für Baumschulkübel: Die tödliche Wurzeltemperatur von 38 Gehölzen lag zwischen −5 und −23 °C, weit über ihrer Triebhärte [4]. Die Wände kleiner oder hoher Beete im Winter dämmen.'),
  ] },
  { id: 'bed-timber', title: L('Timber frames', 'Rahmen aus Holz'), sources: [5, 6, 7, 8, 9], body: [
    L('Durable heartwood such as larch, Douglas fir, oak, sweet chestnut or robinia is the usual choice; Rhineland-Palatinate state advice names larch and Douglas fir [5]. Wood oils have not been shown to make wood last longer in soil contact [6].', 'Dauerhaftes Kernholz wie Lärche, Douglasie, Eiche, Esskastanie oder Robinie ist die übliche Wahl; die Beratung in Rheinland-Pfalz nennt Lärche und Douglasie [5]. Dass Holzöle die Haltbarkeit im Erdkontakt verlängern, ist nicht belegt [6].'),
    L('Avoid old CCA-treated wood: arsenic, copper and chromium moved into the soil of CCA raised beds (arsenic 40–50 mg/kg in the top 2 cm next to the boards, under 3–10 mg/kg 1.5 m away), and crops took up more arsenic [7]. In the EU, arsenic-treated wood may not be used in contact with food or in gardens [8]. For modern copper-treated wood, a plastic liner on the inside is a sensible precaution [9].', 'Altes CCA-imprägniertes Holz meiden: Arsen, Kupfer und Chrom wanderten in den Boden von CCA-Hochbeeten (Arsen 40–50 mg/kg in den obersten 2 cm neben den Brettern, unter 3–10 mg/kg in 1,5 m Abstand), und die Pflanzen nahmen mehr Arsen auf [7]. In der EU darf arsenbehandeltes Holz weder mit Lebensmitteln in Kontakt kommen noch in Gärten verwendet werden [8]. Bei modernem kupferimprägniertem Holz ist eine Folie an der Innenseite eine sinnvolle Vorsorge [9].'),
  ] },
  { id: 'bed-sleepers', title: L('Railway sleepers: don’t', 'Bahnschwellen: lieber nicht'), sources: [8, 10], body: [
    L('A creosoted sleeper emits about 5 kg of creosote and about 0.5 kg of polycyclic aromatic hydrocarbons over its 20–30-year service life [10]. EU law bans creosote-treated wood where it touches skin in gardens and explicitly for containers for live plants [8].', 'Eine mit Teeröl behandelte Schwelle gibt über ihre 20–30-jährige Nutzungsdauer etwa 5 kg Teeröl und etwa 0,5 kg polyzyklische aromatische Kohlenwasserstoffe ab [10]. Das EU-Recht verbietet teerölbehandeltes Holz mit Hautkontakt in Gärten und ausdrücklich für Pflanzbehälter [8].'),
  ] },
  { id: 'bed-steel', title: L('Galvanised steel', 'Verzinkter Stahl'), sources: [11], body: [
    L('Zinc builds up in the soil around galvanised structures over the years, and zinc becomes more mobile as soil pH falls [11]. No study tested galvanised raised beds; for acidic beds (blueberries, rhododendrons) line metal walls with plastic as a precaution.', 'Rund um verzinkte Bauwerke reichert sich über die Jahre Zink im Boden an, und Zink wird mobiler, je saurer der Boden ist [11]. Verzinkte Hochbeete wurden nicht untersucht; bei sauren Beeten (Heidelbeeren, Rhododendren) Metallwände vorsorglich mit Folie auskleiden.'),
  ] },
  { id: 'bed-stone', title: L('Stone, brick and concrete', 'Stein, Ziegel und Beton'), sources: [6, 12, 5], body: [
    L('Concrete blocks slowly release lime, which raises the soil pH [12]: fine for vegetables, wrong for acid-loving plants. Mortared walls are more permanent than dry-stacked ones [6]; open-bottomed masonry beds need sturdy walls or posts against the soil pressure [5].', 'Betonsteine geben langsam Kalk ab und heben den Boden-pH [12]: für Gemüse in Ordnung, für säureliebende Pflanzen falsch. Gemauerte Wände halten länger als trocken gesetzte [6]; Mauerbeete ohne Boden brauchen stabile Wände oder Pfosten gegen den Erddruck [5].'),
  ] },
  { id: 'bed-hugel', title: L('Hügelkultur and layered beds', 'Hügelbeete und Schichtbeete'), sources: [13, 5, 14, 2], body: [
    L('There are no peer-reviewed studies on hügelkultur; mounds sink as the wood rots and need rebuilding after about 5–6 years [13]. Layered beds settle and need topping up after 3–4 years [5]. Wood chips or sawdust in the fill tie up nitrogen, so more fertiliser is needed [14]. In the subarctic trial, a box with a woody core did not beat a plain box [2].', 'Zu Hügelbeeten gibt es keine begutachteten Studien; die Hügel sacken beim Verrotten des Holzes ein und müssen nach etwa 5–6 Jahren neu aufgebaut werden [13]. Schichtbeete setzen sich und müssen nach 3–4 Jahren aufgefüllt werden [5]. Holzhäcksel oder Sägemehl in der Füllung binden Stickstoff, es muss also mehr gedüngt werden [14]. Im subarktischen Versuch war ein Kasten mit Holzkern nicht besser als ein einfacher Kasten [2].'),
  ] },
  { id: 'bed-wicking', title: L('Wicking beds', 'Dochtbeete'), sources: [15], body: [
    L('Wicking beds water from a reservoir below the soil. Tomatoes in wicking beds used water more efficiently and yielded more than with precision surface irrigation; 30 cm of soil worked better than 60 cm, and a 15 or 30 cm reservoir made no difference [15].', 'Dochtbeete bewässern aus einem Wasserspeicher unter der Erde. Tomaten nutzten im Dochtbeet das Wasser effizienter und trugen mehr als bei präziser Oberflächenbewässerung; 30 cm Erde wirkten besser als 60 cm, ein 15 oder 30 cm tiefer Speicher machte keinen Unterschied [15].'),
  ] },
  { id: 'bed-keyhole', title: L('Keyhole beds', 'Schlüssellochbeete'), sources: [16], body: [
    L('Round beds with a central compost basket and a notch for access. In a study of 2,014 households in Lesotho, keyhole gardens were linked to better food security [16]; that is a dryland setting, and there are no Central European data.', 'Runde Beete mit einem Kompostkorb in der Mitte und einer Einbuchtung zum Hineingreifen. In einer Studie mit 2.014 Haushalten in Lesotho gingen Schlüssellochgärten mit besserer Ernährungssicherheit einher [16]; das ist ein Trockengebiet, mitteleuropäische Daten gibt es nicht.'),
  ] },
  { id: 'bed-mound', title: L('Frameless mounds and sheet mulching', 'Hügel ohne Rahmen und Flächenmulch'), sources: [13, 17], body: [
    L('Unframed mounds of soil topped with compost and woody mulch are a durable alternative that cannot collapse [13]. Sheet mulching with plain cardboard (edges overlapped by at least 20 cm) is ready to plant after about 6 months and is best built in autumn; cardboard limits the flow of water and air [17].', 'Erdhügel ohne Rahmen, mit Kompost und Holzmulch bedeckt, sind eine haltbare Alternative, die nicht einstürzen kann [13]. Flächenmulch mit unbedrucktem Karton (Ränder mindestens 20 cm überlappt) ist nach etwa 6 Monaten bepflanzbar und wird am besten im Herbst angelegt; Karton bremst Wasser und Luft [17].'),
  ] },
  { id: 'bed-fill', title: L('What to fill it with', 'Womit füllen'), sources: [18, 3], body: [
    L('Use equal parts topsoil, compost and coarse sand, or about 70 % topsoil and 30 % compost, and mix the bottom layer into the existing soil so there is no sharp boundary [18]. Pure compost raises the pH and drains too fast [3].', 'Gleiche Teile Oberboden, Kompost und grober Sand oder etwa 70 % Oberboden und 30 % Kompost verwenden und die unterste Schicht mit dem vorhandenen Boden vermischen, damit keine scharfe Grenze entsteht [18]. Reiner Kompost hebt den pH und entwässert zu schnell [3].'),
  ] },
  { id: 'bed-dimensions', title: L('Height and width', 'Höhe und Breite'), sources: [5, 19], body: [
    L('About 80 cm high suits seated work or shorter people and up to 100 cm suits tall people standing; 120 cm is the maximum width if you can reach in from both sides [5]. For wheelchair users, about 61 cm high and 91 cm wide, with 1.2 m paths between beds; any bed needs at least 25 cm of soil [19]. Plants with deep roots need more: the planner checks the bed height against each plant (warnings in the Infrastructure card).', 'Etwa 80 cm Höhe passt für die Arbeit im Sitzen oder für kleinere Menschen, bis 100 cm für große Menschen im Stehen; 120 cm ist die größte Breite, wenn man von beiden Seiten hineingreifen kann [5]. Für Menschen im Rollstuhl etwa 61 cm hoch und 91 cm breit, mit 1,2 m breiten Wegen dazwischen; jedes Beet braucht mindestens 25 cm Erde [19]. Tief wurzelnde Pflanzen brauchen mehr: Der Planer prüft die Beethöhe für jede Pflanze (Hinweise in der Infrastruktur-Karte).'),
  ] },
  { id: 'bed-bottom', title: L('The bottom: vole mesh and root barrier', 'Der Boden: Wühlmausgitter und Wurzelsperre'), sources: [20, 21, 22], body: [
    L('Lay hardware cloth or fine wire mesh under the bed to keep voles and gophers out [20].', 'Gegen Wühlmäuse ein engmaschiges Drahtgitter unter das Beet legen [20].'),
    L('A bed without a barrier underneath lets roots of the native soil grow in, which defeats, for example, an acidic fill for blueberries [21]. Fungal threads (mycorrhizae) cross 40 µm mesh and even porous membranes; only very fine membranes stopped them [22]. This planner therefore assumes a solid root-barrier film on walls and bottom; vole mesh or weed fabric alone stops roots, but not fungal threads or soil water. A sealed bottom also limits drainage, so plan a drainage layer or outlet [21].', 'Ein Beet ohne Sperre nach unten lässt Wurzeln aus dem gewachsenen Boden einwachsen, was zum Beispiel eine saure Füllung für Heidelbeeren zunichtemacht [21]. Pilzfäden (Mykorrhiza) wachsen durch 40-µm-Gewebe und sogar durch poröse Membranen; nur sehr feine Membranen hielten sie auf [22]. Dieser Planer geht daher von einer dichten Wurzelschutzfolie an Wänden und Boden aus; Wühlmausgitter oder Vlies allein halten Wurzeln auf, aber keine Pilzfäden und kein Bodenwasser. Ein dichter Boden bremst auch den Wasserabfluss, daher eine Drainageschicht oder einen Ablauf vorsehen [21].'),
  ] },
  { id: 'bed-juglone', title: L('Raised beds near a black walnut', 'Hochbeete in der Nähe einer Schwarznuss'), sources: [23, 24, 25, 26], body: [
    L('Extension services recommend raised beds near walnuts, but as a way to minimise, not remove, juglone exposure: build them to keep walnut roots out, fill them with new topsoil and keep them free of walnut leaves and hulls [23, 24]; barriers should limit root growth through and under the beds, and toxicity is greatest within the walnut’s drip line [25]. Juglone also travels along fungal threads in the soil [26].', 'Beratungsstellen empfehlen Hochbeete in der Nähe von Walnussbäumen, aber um die Juglonbelastung zu verringern, nicht um sie zu beseitigen: so bauen, dass Walnusswurzeln draußen bleiben, mit frischer Erde füllen und frei von Walnusslaub und Fruchtschalen halten [23, 24]; Sperren sollen Wurzelwachstum durch und unter die Beete begrenzen, und die Giftwirkung ist innerhalb der Kronentraufe am stärksten [25]. Juglon wandert auch entlang von Pilzfäden im Boden [26].'),
    L('The planner therefore turns a walnut conflict across a bed wall into a note instead of removing it, and under the walnut canopy it reminds you to keep leaf litter out.', 'Der Planer macht einen Walnusskonflikt über eine Beetwand deshalb zu einem Hinweis, statt ihn zu entfernen, und erinnert unter der Walnusskrone daran, das Laub fernzuhalten.'),
  ] },
];

const ROLE_REASONS: Partial<Record<GuildRole, L>> = {
  NITROGEN_FIXER: L('Nitrogen reaches neighbours through roots, root fungi and rotting leaves; the wall cuts the first two.', 'Stickstoff erreicht Nachbarn über Wurzeln, Wurzelpilze und verrottendes Laub; die Wand unterbricht die ersten beiden.'),
  DYNAMIC_ACCUMULATOR: L('Its nutrients only reach other plants as cut mulch or litter where it grows.', 'Seine Nährstoffe erreichen andere Pflanzen nur als Schnittgut oder Streu dort, wo er wächst.'),
  POLLINATOR_MAGNET: L('Bees, hoverflies and parasitoid wasps fly over the wall.', 'Bienen, Schwebfliegen und Schlupfwespen fliegen über die Wand.'),
  PEST_REPELLER: L('Scents and beneficial insects cross the wall; soil-acting nematode crops do not.', 'Duftstoffe und Nützlinge überwinden die Wand; im Boden wirkende Nematoden-Kulturen nicht.'),
  LIVING_MULCH: L('Covers only the soil it grows on.', 'Bedeckt nur den Boden, auf dem er wächst.'),
  GRASS_BARRIER: L('Works in the soil; the lined wall itself keeps creeping grass out.', 'Wirkt im Boden; die ausgekleidete Wand hält kriechende Gräser ohnehin fern.'),
  ANTIFUNGAL: L('Works through the soil or by stopping rain splash from the ground beneath it.', 'Wirkt über den Boden oder indem er Spritzwasser vom Boden darunter abhält.'),
  BIOMASS_PRODUCER: L('Mulch is counted where the plant grows.', 'Mulch wird dort angerechnet, wo die Pflanze wächst.'),
  EDIBLE_UNDERSTORY: L('No effect on neighbours.', 'Keine Wirkung auf Nachbarn.'),
};

const RATING_LABEL: Record<string, L> = {
  S: L('suitable', 'geeignet'), C: L('conditional', 'bedingt'), C_REC: L('recommended with conditions', 'mit Bedingungen empfohlen'), U: L('unsuitable', 'ungeeignet'),
};
const RATING_DOT: Record<string, string> = { S: 'bg-emerald-500', C: 'bg-amber-400', C_REC: 'bg-sky-500', U: 'bg-red-500' };

const SourceRefs: React.FC<{ ns: number[] }> = ({ ns }) => (
  <span className="text-[11px] text-stone-500">
    {ns.map((n, i) => (
      <a key={n} href={`#bed-src-${n}`} className="underline hover:text-forest-700">{i > 0 ? ', ' : ''}[{n}]</a>
    ))}
  </span>
);

const SourceList: React.FC<{ language: Language; ns?: number[] }> = ({ language, ns }) => (
  <ol className="space-y-1 text-[11px] text-stone-600 list-none">
    {BED_GUIDE_SOURCES.filter(s => !ns || ns.includes(s.n)).map(s => (
      <li key={s.n} id={`bed-src-${s.n}`} className="scroll-mt-24">
        <span className="font-bold text-stone-700">[{s.n}]</span> {s.text}{' '}
        {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-forest-700 underline break-all">{language === 'de' ? 'Quelle' : 'source'}</a>}
      </li>
    ))}
  </ol>
);

export type Tone = 'emerald' | 'amber' | 'red' | 'sky' | 'stone';
export const TONE: Record<Tone, { badge: string; icon: string; band: string }> = {
  emerald: { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: 'bg-emerald-600', band: 'from-emerald-400 to-emerald-600' },
  amber: { badge: 'bg-amber-100 text-amber-900 border-amber-200', icon: 'bg-amber-600', band: 'from-amber-300 to-amber-600' },
  red: { badge: 'bg-red-100 text-red-800 border-red-200', icon: 'bg-red-600', band: 'from-red-400 to-red-600' },
  sky: { badge: 'bg-sky-100 text-sky-900 border-sky-200', icon: 'bg-sky-600', band: 'from-sky-300 to-sky-600' },
  stone: { badge: 'bg-stone-200 text-stone-700 border-stone-300', icon: 'bg-stone-600', band: 'from-stone-300 to-stone-500' },
};

export const Badge: React.FC<{ tone: Tone; children: React.ReactNode }> = ({ tone, children }) => (
  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${TONE[tone].badge}`}>{children}</span>
);

/** One guide step as a card: icon, title, badge, the full text, optional picture. */
const StepCard: React.FC<{ step: Step; language: Language; icon: LucideIcon; tone: Tone; badge?: L; visual?: React.ReactNode; band?: boolean }> = ({ step, language, icon: Icon, tone, badge, visual, band }) => {
  const g = (l: L) => getLoc(l, language);
  return (
    <div id={step.id} className="relative overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-xs scroll-mt-24 flex flex-col">
      {band && <div className={`h-1.5 bg-gradient-to-r ${TONE[tone].band}`} />}
      <div className="p-5 space-y-2 flex-1 flex flex-col">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${TONE[tone].icon} text-white flex items-center justify-center shrink-0`}><Icon className="w-5 h-5" /></div>
          <h3 className="font-bold text-base text-stone-900 flex-1">{g(step.title)}</h3>
          {badge && <Badge tone={tone}>{g(badge)}</Badge>}
        </div>
        {visual && <div className="rounded-xl bg-stone-50 border border-stone-100 p-2">{visual}</div>}
        {step.body.map((b, k) => <p key={k} className="text-sm text-stone-700 leading-relaxed">{g(b)}</p>)}
        <div className="mt-auto pt-1"><SourceRefs ns={step.sources} /></div>
      </div>
    </div>
  );
};

const SectionTitle: React.FC<{ icon: LucideIcon; title: string; subtitle?: string }> = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-start gap-3 pt-2">
    <Icon className="w-6 h-6 text-forest-600 shrink-0 mt-0.5" />
    <div>
      <h3 className="text-lg font-bold text-stone-900">{title}</h3>
      {subtitle && <p className="text-sm text-stone-500">{subtitle}</p>}
    </div>
  </div>
);

export const Stat: React.FC<{ value: string; label: string; icon: LucideIcon; tone: Tone; refs: number[]; refsNode?: React.ReactNode }> = ({ value, label, icon: Icon, tone, refs, refsNode }) => (
  <div className="rounded-2xl bg-white border border-stone-200 p-4 flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-lg ${TONE[tone].icon} text-white flex items-center justify-center`}><Icon className="w-4 h-4" /></div>
      <span className="text-xl font-extrabold text-stone-900 tracking-tight">{value}</span>
    </div>
    <span className="text-xs text-stone-600 leading-snug">{label} {refsNode ?? <SourceRefs ns={refs} />}</span>
  </div>
);

interface PlantRef { id: string; name: string; imageUrl?: string; color: string }

const PlantChip: React.FC<{ p: PlantRef }> = ({ p }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-stone-200 pl-0.5 pr-2 py-0.5 text-[11px] font-semibold text-stone-700">
    <PlantThumbnail src={p.imageUrl} alt={p.name} fallbackColor={p.color} className="w-5 h-5" roundedClassName="rounded-full" targetSize={48} priority="low" />
    {p.name}
  </span>
);

const step = (id: string) => STEPS.find(s => s.id === id)!;

/** Star and companion versions of the same plant share a name; list each name once. */
const dedupeByName = (list: PlantRef[]) => [...new Map(list.map(p => [p.name.toLowerCase(), p])).values()];

export const RaisedBedGuide: React.FC<{ language: Language }> = ({ language }) => {
  const g = (l: L) => getLoc(l, language);
  const plantsFor = (w: BedWarningId): PlantRef[] => dedupeByName([
    ...STAR_TREES.filter(t => STAR_BED_SUITABILITY[t.id]?.warnings.includes(w)).map(t => ({ id: t.id, name: g(t.commonName), imageUrl: t.imageUrl, color: t.color })),
    ...GUILD_PLANTS.filter(p => !p.retired && COMPANION_BED_SUITABILITY[p.id]?.warnings.includes(w)).map(p => ({ id: p.id, name: g(p.commonName), imageUrl: p.imageUrl, color: p.color })),
  ]);
  const ratingCounts = Object.keys(RATING_LABEL).map(k => ({
    k, n: [...Object.values(STAR_BED_SUITABILITY), ...Object.values(COMPANION_BED_SUITABILITY)].filter(r => r.rating === k).length,
  }));
  const crossing = (Object.keys(ROLE_CROSSES_BED_WALL) as GuildRole[]).filter(r => ROLE_CROSSES_BED_WALL[r] === 'CROSSES');
  const blocked = (Object.keys(ROLE_CROSSES_BED_WALL) as GuildRole[]).filter(r => ROLE_CROSSES_BED_WALL[r] !== 'CROSSES');
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-white to-emerald-50 border border-stone-200 p-6 grid gap-4 lg:grid-cols-[1fr_1.35fr] items-center">
        <div className="space-y-2">
          <Badge tone="amber"><Fence className="w-3 h-3" />{g(L('Raised beds', 'Hochbeete'))}</Badge>
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">{g(L('Building raised beds', 'Hochbeete bauen'))}</h2>
          <p className="text-sm text-stone-600 leading-relaxed">{g(L('Ways to build a raised bed, what each method is good for, and what the planner assumes when you draw a bed in the garden grid. Numbers in brackets refer to the sources at the bottom.', 'Wege, ein Hochbeet zu bauen, wofür sich jede Bauweise eignet und wovon der Planer ausgeht, wenn du im Gartenraster ein Beet zeichnest. Zahlen in Klammern verweisen auf die Quellen unten.'))}</p>
        </div>
        <div className="rounded-2xl bg-white/80 border border-stone-200 p-2">
          <BedCrossSection language={language} className="w-full h-auto" />
          <p className="text-[10px] text-stone-400 text-center">{g(L('Schematic; values from the sections below', 'Schema; Werte aus den Abschnitten unten'))} <SourceRefs ns={[5, 18, 19, 20, 21]} /></p>
        </div>
      </div>

      {/* Key numbers */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Stat icon={Thermometer} tone="amber" value="+0.5–2.5 °C" label={g(L('warmer soil early in the season (subarctic trial)', 'wärmerer Boden früh in der Saison (subarktischer Versuch)'))} refs={[2]} />
        <Stat icon={Droplets} tone="sky" value="−41–53 %" label={g(L('less soil moisture in the same beds', 'weniger Bodenfeuchte in denselben Beeten'))} refs={[2]} />
        <Stat icon={Shovel} tone="emerald" value="−32 %" label={g(L('less irrigation when soil is mixed into compost', 'weniger Bewässerung mit Erde in der Kompostfüllung'))} refs={[3]} />
        <Stat icon={Snowflake} tone="stone" value="−5 … −23 °C" label={g(L('lethal root temperature of woody plants in containers', 'tödliche Wurzeltemperatur von Gehölzen im Kübel'))} refs={[4]} />
      </div>

      {/* Pros and cons */}
      <SectionTitle icon={Scale} title={g(L('Is it worth it?', 'Lohnt es sich?'))} />
      <div className="grid gap-4 md:grid-cols-2">
        <StepCard step={step('bed-why')} language={language} icon={ThumbsUp} tone="emerald" band />
        <StepCard step={step('bed-drawbacks')} language={language} icon={ThumbsDown} tone="amber" band />
      </div>

      {/* Materials */}
      <SectionTitle icon={Hammer} title={g(L('Wall materials', 'Material für die Wände'))} subtitle={g(L('What each material does to the soil inside', 'Was jedes Material mit der Erde im Beet macht'))} />
      <div className="grid gap-4 md:grid-cols-2">
        <StepCard step={step('bed-timber')} language={language} icon={TreeDeciduous} tone="emerald" band badge={L('good choice', 'gute Wahl')} />
        <StepCard step={step('bed-sleepers')} language={language} icon={Ban} tone="red" band badge={L('banned', 'verboten')} />
        <StepCard step={step('bed-steel')} language={language} icon={Layers} tone="amber" band badge={L('line acid beds', 'saure Beete auskleiden')} />
        <StepCard step={step('bed-stone')} language={language} icon={BrickWall} tone="amber" band badge={L('adds lime', 'gibt Kalk ab')} />
      </div>

      {/* Bed styles */}
      <SectionTitle icon={Sprout} title={g(L('Other bed styles', 'Andere Beetformen'))} subtitle={g(L('The badge shows how good the evidence is', 'Das Abzeichen zeigt, wie gut die Belege sind'))} />
      <div className="grid gap-4 md:grid-cols-2">
        <StepCard step={step('bed-hugel')} language={language} icon={Mountain} tone="stone" band badge={L('no studies', 'keine Studien')} />
        <StepCard step={step('bed-wicking')} language={language} icon={Waves} tone="emerald" band badge={L('field trial', 'Feldversuch')} />
        <StepCard step={step('bed-keyhole')} language={language} icon={KeyRound} tone="amber" band badge={L('survey, drylands', 'Umfrage, Trockengebiet')} />
        <StepCard step={step('bed-mound')} language={language} icon={Shovel} tone="sky" band badge={L('extension advice', 'Beratung')} />
      </div>

      {/* Building */}
      <SectionTitle icon={Ruler} title={g(L('Building it', 'Der Aufbau'))} />
      <div className="grid gap-4 md:grid-cols-2">
        <StepCard step={step('bed-fill')} language={language} icon={Shovel} tone="emerald" visual={
          <div className="space-y-2 p-1">
            {[
              { t: L('Mix A', 'Mischung A'), parts: [[33.3, L('topsoil', 'Oberboden'), '#7c5a3a'], [33.3, L('compost', 'Kompost'), '#3f2a14'], [33.4, L('coarse sand', 'grober Sand'), '#d6c29a']] as Array<[number, L, string]> },
              { t: L('Mix B', 'Mischung B'), parts: [[70, L('topsoil', 'Oberboden'), '#7c5a3a'], [30, L('compost', 'Kompost'), '#3f2a14']] as Array<[number, L, string]> },
            ].map(m => (
              <div key={m.t.en} className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-stone-500 w-20 shrink-0">{g(m.t)}</span>
                <div className="flex-1 flex h-6 rounded-lg overflow-hidden">
                  {m.parts.map(([w, l, c], i) => (
                    <div key={i} className="flex items-center justify-center text-[10px] font-bold" style={{ width: `${w}%`, background: c, color: c === '#d6c29a' ? '#44403c' : '#fff' }}>{Math.round(w)} % {g(l)}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        } />
        <StepCard step={step('bed-dimensions')} language={language} icon={Ruler} tone="sky" visual={<BedHeightsDiagram language={language} className="w-full h-auto max-h-40" />} />
        <StepCard step={step('bed-bottom')} language={language} icon={Layers} tone="red" visual={
          <div className="flex flex-wrap gap-2 p-1 text-[11px]">
            {[
              { t: L('Vole mesh: keeps voles out', 'Wühlmausgitter: hält Wühlmäuse fern'), c: 'bg-stone-100 text-stone-700 border-stone-300' },
              { t: L('Fabric: stops roots, not fungal threads', 'Vlies: stoppt Wurzeln, keine Pilzfäden'), c: 'bg-amber-50 text-amber-900 border-amber-200' },
              { t: L('Solid root-barrier film: what the planner assumes', 'Dichte Wurzelschutzfolie: davon geht der Planer aus'), c: 'bg-red-50 text-red-800 border-red-200' },
            ].map(x => <span key={x.t.en} className={`rounded-lg border px-2 py-1 font-semibold ${x.c}`}>{g(x.t)}</span>)}
          </div>
        } />
        <StepCard step={step('bed-juglone')} language={language} icon={TreeDeciduous} tone="amber" visual={<WalnutDiagram language={language} className="w-full h-auto max-h-44" />} />
      </div>

      {/* Walls */}
      <div id="bed-walls" className="rounded-2xl bg-white border border-stone-200 scroll-mt-24 p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-forest-600 text-white flex items-center justify-center shrink-0"><Fence className="w-5 h-5" /></div>
          <h3 className="font-bold text-base text-stone-900">{g(L('What crosses a raised-bed wall', 'Was über eine Hochbeetwand gelangt'))}</h3>
        </div>
        <p className="text-sm text-stone-700">{g(L('In the garden grid a raised bed counts as its own small garden. Companions only help across a bed wall through effects that pass over it; a companion is shared across a wall only if everything it does crosses, so guilds on both sides keep their own nitrogen fixers, ground covers and mulch plants.', 'Im Gartenraster zählt ein Hochbeet als eigener kleiner Garten. Begleiter helfen über eine Beetwand nur mit Wirkungen, die darüber gelangen; geteilt wird ein Begleiter über eine Wand nur, wenn alles, was er tut, darüber wirkt, sodass Gilden auf beiden Seiten ihre eigenen Stickstoff-Fixierer, Bodendecker und Mulchpflanzen behalten.'))}</p>
        <div className="rounded-xl bg-sky-50/60 border border-sky-100 p-2"><WallCrossingDiagram language={language} className="w-full h-auto" /></div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { roles: crossing, tone: 'emerald' as Tone, icon: ArrowUpRight, t: L('crosses', 'gelangt darüber') },
            { roles: blocked, tone: 'amber' as Tone, icon: Ban, t: L('stays on its side', 'bleibt auf seiner Seite') },
          ].map(col => (
            <div key={col.t.en} className={`rounded-xl border p-3 space-y-2 ${col.tone === 'emerald' ? 'bg-emerald-50/50 border-emerald-200' : 'bg-amber-50/50 border-amber-200'}`}>
              <div className="flex items-center gap-2"><col.icon className={`w-4 h-4 ${col.tone === 'emerald' ? 'text-emerald-700' : 'text-amber-800'}`} /><Badge tone={col.tone}>{g(col.t)}</Badge></div>
              {col.roles.map(r => (
                <div key={r} className="text-xs">
                  <span className="font-bold text-stone-800">{translateRole(r, language)}</span>
                  <span className="text-stone-600"> · {ROLE_REASONS[r] ? g(ROLE_REASONS[r]!) : ''}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="text-sm text-stone-700">{g(L('Conflicts across a wall: soil pH and onion-family plants next to legumes no longer clash; fennel and wormwood count one level milder; black walnut, Verticillium and Phytophthora become notes because water, soil on tools and leaf litter can still carry them; pests that fly or crawl (spotted wing drosophila, vine weevil, aphids, silver leaf spores) are not stopped.', 'Konflikte über eine Wand: Boden-pH und Lauchgewächse neben Leguminosen stören sich nicht mehr; Fenchel und Wermut zählen eine Stufe milder; Schwarznuss, Verticillium und Phytophthora werden zu Hinweisen, weil Wasser, Erde an Werkzeugen und Laub sie weiter tragen können; Schädlinge, die fliegen oder krabbeln (Kirschessigfliege, Dickmaulrüssler, Blattläuse, Sporen der Bleiglanzkrankheit), werden nicht aufgehalten.'))} <SourceRefs ns={[22, 23, 26]} /></p>
      </div>

      {/* Suitability */}
      <div id="bed-suitability" className="rounded-2xl bg-white border border-stone-200 scroll-mt-24 p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-forest-600 text-white flex items-center justify-center shrink-0"><Sprout className="w-5 h-5" /></div>
          <h3 className="font-bold text-base text-stone-900">{g(L('Which plants suit a raised bed', 'Welche Pflanzen ins Hochbeet passen'))}</h3>
        </div>
        <p className="text-sm text-stone-700">{g(L('Each plant has a rating; plants that are not simply suitable carry one of these notes. The garden grid shows them in the Infrastructure card when a plant sits in a bed.', 'Jede Pflanze hat eine Einstufung; Pflanzen, die nicht einfach geeignet sind, tragen einen dieser Hinweise. Das Gartenraster zeigt sie in der Infrastruktur-Karte, sobald eine Pflanze in einem Beet steht.'))}</p>
        <div className="flex flex-wrap gap-2">
          {ratingCounts.map(({ k, n }) => (
            <span key={k} className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 border border-stone-200 px-2.5 py-1 text-xs font-semibold text-stone-700">
              <span className={`w-2.5 h-2.5 rounded-full ${RATING_DOT[k]}`} />{g(RATING_LABEL[k])}<span className="text-stone-400">{n}</span>
            </span>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {(Object.keys(BED_WARNINGS) as BedWarningId[]).map(w => {
            const plants = plantsFor(w);
            if (plants.length === 0) return null;
            return (
              <div key={w} id={`bed-${w.toLowerCase()}`} className="scroll-mt-24 rounded-xl border border-stone-200 bg-stone-50/60 p-3 space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-extrabold text-white bg-stone-500 rounded-md px-1.5 py-0.5 mt-0.5">{w}</span>
                  <div className="text-sm font-bold text-stone-900">{g(BED_WARNINGS[w].title)}</div>
                </div>
                <p className="text-xs text-stone-700">{g(BED_WARNINGS[w].text)}</p>
                <div className="flex flex-wrap gap-1">{plants.map(p => <PlantChip key={p.id} p={p} />)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <details className="rounded-2xl bg-stone-50 border border-stone-200 p-5 group" open>
        <summary className="cursor-pointer font-bold text-sm text-stone-900 flex items-center gap-2"><BookOpen className="w-4 h-4 text-forest-600" />{g(L('Sources', 'Quellen'))}</summary>
        <div className="mt-2"><SourceList language={language} ns={[...Array(26).keys()].map(i => i + 1)} /></div>
      </details>
    </div>
  );
};

const MODE_LABEL: Record<string, L> = {
  CARPET: L('carpet', 'Teppich'), DRIFT: L('drift / patches', 'Gruppen / Flecken'), ALLEY: L('sown strip', 'gesäter Streifen'),
};
const MODE_HINT: Record<string, L> = {
  CARPET: L('closed mat around the tree', 'geschlossene Matte um den Baum'),
  DRIFT: L('loose groups with gaps', 'lockere Gruppen mit Lücken'),
  ALLEY: L('sown between the trees', 'zwischen den Bäumen gesät'),
};
const LIGHT_LABEL: Record<string, L> = {
  SHADE: L('shade', 'Schatten'), HALF: L('half shade', 'Halbschatten'), SUN: L('sun', 'Sonne'), ANY: L('any', 'beliebig'),
};
const LIGHT_ICON: Record<string, LucideIcon> = { SHADE: Moon, HALF: CloudSun, SUN: Sun, ANY: SunMoon };
const SEASON_LABEL: Record<string, L> = {
  SUMMER: L('growing season', 'Vegetationszeit'), SPRING_EPHEMERAL: L('spring only', 'nur Frühjahr'), COOL_SEASON: L('autumn to spring', 'Herbst bis Frühjahr'),
};
const SEASON_DOT: Record<string, string> = { SUMMER: 'bg-green-500', SPRING_EPHEMERAL: 'bg-pink-400', COOL_SEASON: 'bg-sky-400' };

const VERDICT_LABEL: Record<OverlapVerdict, L> = {
  COEXIST: L('mix', 'mischen sich'), MOSAIC: L('separate patches', 'getrennte Flecken'), EXCLUDE: L('keep apart', 'getrennt halten'),
};
const VERDICT_TONE: Record<OverlapVerdict, Tone> = { COEXIST: 'emerald', MOSAIC: 'sky', EXCLUDE: 'amber' };
const EVIDENCE_LABEL: Record<OverlapEvidence, L> = {
  trial: L('trial', 'Versuch'), mixture: L('sown mix', 'Saatmischung'), community: L('same habitat', 'gleicher Lebensraum'),
  guidance: L('advice', 'Empfehlung'), inferred: L('inferred', 'abgeleitet'),
};

const RuleCard: React.FC<{ visual: React.ReactNode; children: React.ReactNode }> = ({ visual, children }) => (
  <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden flex flex-col">
    <div className="bg-gradient-to-b from-stone-50 to-white border-b border-stone-100 p-2">{visual}</div>
    <div className="p-4 text-sm text-stone-700 leading-relaxed">{children}</div>
  </div>
);

/** Explainer for the ground-cover areas (guild-design tab). */
export const GroundCoverGuide: React.FC<{ language: Language }> = ({ language }) => {
  const g = (l: L) => getLoc(l, language);
  const specs = Object.values(GROUND_COVER_SPECS);
  const plantOf = (id: string) => GUILD_PLANTS.find(p => p.id === id);
  const ref = (id: string): PlantRef => {
    const p = plantOf(id);
    return { id, name: g(p?.commonName ?? L(id, id)), imageUrl: p?.imageUrl, color: p?.color ?? '#15803d' };
  };
  const [filter, setFilter] = useState<OverlapVerdict | 'ALL'>('ALL');
  const [showAll, setShowAll] = useState(false);
  // strongest evidence first; with no filter the verdicts take turns so the first cards show all three
  const EVIDENCE_RANK: Record<OverlapEvidence, number> = { trial: 0, community: 1, guidance: 2, inferred: 3, mixture: 4 };
  const pairs = [...OVERLAP_PAIRS.entries()].sort((x, y) => EVIDENCE_RANK[x[1].evidence] - EVIDENCE_RANK[y[1].evidence] || x[0].localeCompare(y[0]));
  const byVerdict = (v: OverlapVerdict) => pairs.filter(([, r]) => r.verdict === v);
  const interleaved = (() => {
    const lists = (['COEXIST', 'MOSAIC', 'EXCLUDE'] as const).map(byVerdict);
    const out: typeof pairs = [];
    for (let i = 0; out.length < pairs.length; i++) lists.forEach(l => { if (l[i]) out.push(l[i]); });
    return out;
  })();
  const shown = filter === 'ALL' ? interleaved : byVerdict(filter);
  const PAIR_LIMIT = 12;
  const counts = { COEXIST: 0, MOSAIC: 0, EXCLUDE: 0 } as Record<OverlapVerdict, number>;
  pairs.forEach(([, r]) => { counts[r.verdict]++; });
  const diagram = 'w-full h-auto max-h-32';
  return (
    <div id="guide-ground-covers" className="rounded-3xl bg-white border border-stone-200 scroll-mt-24 p-6 space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center shrink-0"><Leaf className="w-5 h-5" /></div>
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-stone-900">{g(L('Ground covers are areas, not single plants', 'Bodendecker sind Flächen, keine Einzelpflanzen'))}</h3>
          <p className="text-sm text-stone-700">{g(L('Clover, woodruff, creeping thyme, naturalising bulbs and sown strips are drawn as translucent areas. Their shapes follow these rules:', 'Klee, Waldmeister, Sand-Thymian, verwildernde Zwiebelblumen und gesäte Streifen werden als durchscheinende Flächen gezeichnet. Ihre Formen folgen diesen Regeln:'))}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <RuleCard visual={<TrunkZoneDiagram language={language} className={diagram} />}>
          {g(L('Bare zone around every trunk: 0.9 m for young plantings (first about 5 years), where a 1.83 m weed-free circle gave near-maximum tree growth and 1.5 m weed-free strips beat living mulches; established trees keep a 0.3 m collar (0.5 m for dense mats, a planning value). Spring bulbs keep only the collar because they are dormant in summer.', 'Offene Zone um jeden Stamm: 0,9 m bei jungen Pflanzungen (etwa die ersten 5 Jahre), wo ein unkrautfreier Kreis von 1,83 m nahezu maximales Baumwachstum brachte und 1,5 m breite unkrautfreie Streifen lebende Mulche übertrafen; etablierte Bäume behalten einen Kragen von 0,3 m (0,5 m bei dichten Teppichen, ein Planungswert). Frühjahrszwiebeln behalten nur den Kragen, weil sie im Sommer ruhen.'))} <SourceRefs ns={[27, 28]} />
        </RuleCard>
        <RuleCard visual={<ShadeDiagram language={language} className={diagram} />}>
          {g(L('Shade lovers sit in the tree’s daily shade, which lies on the side away from the noon sun (north in the northern hemisphere), offset by about 0.6 × crown height × the cotangent of the noon sun elevation; sun lovers thin out under the canopy. Light classes follow published light indicator values.', 'Schattenpflanzen liegen im Tagesschatten des Baums, der auf der der Mittagssonne abgewandten Seite liegt (auf der Nordhalbkugel im Norden), versetzt um etwa 0,6 × Kronenhöhe × Kotangens der Sonnenhöhe am Mittag; Sonnenpflanzen werden unter der Krone lichter. Die Lichtklassen folgen veröffentlichten Lichtzeigerwerten.'))} <SourceRefs ns={[29, 32]} />
        </RuleCard>
        <RuleCard visual={<HolesDiagram language={language} className={diagram} />}>
          {g(L('Holes around other plants (their spread plus a year of runner growth) and around fennel (1.5 m), wormwood (1.2 m) and, for clover-type covers, onion-family plants (1.8 m), the same distances the conflict checks use.', 'Aussparungen um andere Pflanzen (ihr Durchmesser plus ein Jahr Ausläuferwachstum) und um Fenchel (1,5 m), Wermut (1,2 m) und bei kleeartigen Bodendeckern um Lauchgewächse (1,8 m), dieselben Abstände wie bei der Konfliktprüfung.'))}
        </RuleCard>
        <RuleCard visual={<StripDiagram language={language} className={diagram} />}>
          {g(L('Sown flower or cover-crop strips lie outside the drip line, like the alley flower strips of the orchard trials.', 'Gesäte Blüh- oder Gründüngungsstreifen liegen außerhalb der Kronentraufe, wie die Fahrgassen-Blühstreifen der Obstbauversuche.'))} <SourceRefs ns={[30]} />
        </RuleCard>
        <RuleCard visual={<MergeDiagram language={language} className={diagram} />}>
          {g(L('The same cover around neighbouring trees merges into one area; covers that grow at the same time share the ground, runner plants interweave at their border; spring bulbs and winter covers overlap summer covers because they use the ground at another time.', 'Derselbe Bodendecker um benachbarte Bäume verschmilzt zu einer Fläche; gleichzeitig wachsende Bodendecker teilen sich den Boden, Ausläuferpflanzen verweben sich an der Grenze; Frühjahrszwiebeln und Winterbegrünung überlappen Sommerbodendecker, weil sie den Boden zu einer anderen Zeit nutzen.'))} <SourceRefs ns={[31]} />
        </RuleCard>
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-4 text-sm text-stone-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <span>{g(L('The exact outline, edge noise and how densely an area is shaded are planning values, not measurements.', 'Der genaue Umriss, das Randrauschen und wie dicht eine Fläche eingefärbt ist, sind Planungswerte, keine Messwerte.'))}</span>
        </div>
      </div>

      {/* Plants by shape */}
      <div className="space-y-3">
        {(['CARPET', 'DRIFT', 'ALLEY'] as const).map(mode => (
          <div key={mode} className="space-y-2">
            <div className="flex items-baseline gap-2">
              <h4 className="font-bold text-sm text-stone-900 capitalize">{g(MODE_LABEL[mode])}</h4>
              <span className="text-xs text-stone-500">{g(MODE_HINT[mode])}</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {specs.filter(sp => sp.mode === mode).map(sp => {
                const p = ref(sp.plantId);
                const LightIcon = LIGHT_ICON[sp.light] ?? Sun;
                return (
                  <div key={sp.plantId} className="rounded-xl border border-stone-200 bg-stone-50/50 p-2.5 flex gap-2.5">
                    <PlantThumbnail src={p.imageUrl} alt={p.name} fallbackColor={p.color} className="w-11 h-11" roundedClassName="rounded-lg" targetSize={96} priority="low" />
                    <div className="min-w-0 space-y-0.5">
                      <div className="text-xs font-bold text-stone-900">{p.name}</div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-stone-600">
                        <span className="inline-flex items-center gap-0.5"><LightIcon className="w-3 h-3 text-amber-500" />{g(LIGHT_LABEL[sp.light])}{sp.ellenbergL !== undefined ? ` (L ${sp.ellenbergL})` : ''}</span>
                        <span className="inline-flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${SEASON_DOT[sp.seasonLayer]}`} />{g(SEASON_LABEL[sp.seasonLayer])}</span>
                      </div>
                      {sp.caveat && <p className="text-[10.5px] text-stone-500 leading-snug">{g(sp.caveat)}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <details className="text-[11px]">
        <summary className="cursor-pointer font-semibold text-stone-600">{g(L('Sources', 'Quellen'))}</summary>
        <div className="mt-1"><SourceList language={language} ns={[27, 28, 29, 30, 31, 32]} /></div>
      </details>

      {/* Overlap */}
      <div id="guide-ground-cover-overlap" className="pt-4 border-t border-stone-100 space-y-4 scroll-mt-24">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0"><Blend className="w-5 h-5" /></div>
          <h4 className="font-bold text-lg text-stone-900 pt-1.5">{g(L('Which ground covers can share the ground', 'Welche Bodendecker sich den Boden teilen können'))}</h4>
        </div>
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
          <div className="shrink-0 rounded-lg bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 h-fit">{g(L('Myth check', 'Mythos-Check'))}</div>
          <p className="text-sm text-amber-950">{g(L('"A taller plant can simply grow over a lower one" is not a rule the evidence supports: taller plants take a disproportionate share of the light, and grassland plants show little vertical niche separation. Height layering is only used where a pair is documented.', '„Eine höhere Pflanze kann einfach über einer niedrigeren wachsen“ ist keine durch Belege gestützte Regel: Höhere Pflanzen nehmen überproportional viel Licht, und Wiesenpflanzen zeigen kaum Trennung nach Höhenschichten. Höhenschichtung wird nur bei belegten Paaren genutzt.'))}</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {([
            ['COEXIST', L('Documented partners are drawn overlapping: lawn trials, seed mixtures sown together, and plants that occur together in the same natural habitat (a weaker hint). Where only a related species is documented, the table says so.', 'Belegte Partner werden überlappend gezeichnet: aus Rasenversuchen, gemeinsam gesäten Mischungen und Pflanzen, die im selben natürlichen Lebensraum vorkommen (ein schwächerer Hinweis). Ist nur eine verwandte Art belegt, steht das in der Tabelle.')],
            ['MOSAIC', L('Everything else is drawn as neighbouring patches with a mixed border (planning convention: there is no evidence that they intermix, and light competition favours the taller plant); runner plants weave further into each other than dense mats.', 'Alles andere wird als benachbarte Flecken mit gemischtem Rand gezeichnet (Planungskonvention: Es gibt keinen Beleg für Durchmischung, und Lichtkonkurrenz begünstigt die höhere Pflanze); Ausläuferpflanzen verweben sich dabei weiter als dichte Polster.')],
            ['EXCLUDE', L('Kept apart: sorghum-sudangrass (except with buckwheat and soybean; sorgoleone is documented), and as planning judgements: strips that are cut and dug in next to perennial covers (buckwheat counts as an undisturbed nurse crop in orchard alley mixes), onion-family plants with legumes (traditional rule, not backed by trials), acid-soil with lime-loving plants. Dense colonies (nettle, wild garlic, tansy, creeping jenny) form separate patches.', 'Getrennt gehalten: Sorghum-Sudangras (außer mit Buchweizen und Sojabohne; Sorgoleon ist belegt), und als Planungsentscheidungen: Streifen, die gemulcht und eingearbeitet werden, neben mehrjährigen Bodendeckern (Buchweizen gilt in Obstbau-Fahrgassenmischungen als ungestörte Ammenpflanze), Lauchgewächse mit Leguminosen (überlieferte Regel, nicht durch Versuche belegt), Moorbeet- mit kalkliebenden Pflanzen. Dichte Kolonien (Brennnessel, Bärlauch, Rainfarn, Pfennigkraut) bilden getrennte Flecken.')],
          ] as Array<[OverlapVerdict, L]>).map(([v, text]) => (
            <div key={v} className="rounded-2xl border border-stone-200 overflow-hidden bg-white">
              <div className="flex items-center justify-between gap-2 bg-stone-50 px-3 py-2 border-b border-stone-100">
                <VerdictPicture verdict={v} className="w-24 h-12" />
                <Badge tone={VERDICT_TONE[v]}>{g(VERDICT_LABEL[v])}</Badge>
              </div>
              <p className="p-3 text-sm text-stone-700 leading-relaxed">{g(text)}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-stone-200 p-4 space-y-3 bg-gradient-to-br from-pink-50/50 via-white to-sky-50/50">
          <div className="flex items-center gap-2"><CalendarRange className="w-4 h-4 text-pink-600" /><span className="text-sm font-bold text-stone-900">{g(L('Different times, same ground', 'Verschiedene Zeiten, gleicher Boden'))}</span></div>
          <SeasonTimeline language={language} />
          <p className="text-[10px] text-stone-400">{g(L('Schematic months for Central Europe', 'Schematische Monate für Mitteleuropa'))}</p>
          <p className="text-sm text-stone-700">{g(L('Plants that use the ground at different times overlap: spring bulbs under summer covers (by analogy with woodland spring flowers), as long as the cover is at most half as tall as the bulb flower (a rule of thumb from bulb growers, not a measured threshold); winter covers with summer covers (planning judgement), except subterranean clover next to a closed carpet, which competes with its reseeding.', 'Pflanzen, die den Boden zu verschiedenen Zeiten nutzen, überlappen: Frühjahrszwiebeln unter Sommerbodendeckern (in Analogie zu Frühjahrsblühern im Wald), solange der Bodendecker höchstens halb so hoch ist wie die Zwiebelblüte (Faustregel aus dem Zwiebelhandel, kein gemessener Schwellenwert); Winter- mit Sommerbegrünung (Planungsentscheidung), außer Bodenfrüchtigem Klee neben einem geschlossenen Teppich, der mit seiner Selbstaussaat konkurriert.'))}</p>
        </div>

        {/* Documented pairs */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-stone-900 mr-1">{g(L('Documented pairs', 'Belegte Paare'))}</span>
            {(['ALL', 'COEXIST', 'MOSAIC', 'EXCLUDE'] as const).map(f => (
              <button key={f} onClick={() => { setFilter(f); setShowAll(false); }}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${filter === f ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}`}>
                {f === 'ALL' ? `${g(L('all', 'alle'))} ${pairs.length}` : `${g(VERDICT_LABEL[f])} ${counts[f]}`}
              </button>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {(showAll ? shown : shown.slice(0, PAIR_LIMIT)).map(([k, r]) => {
              const [a, b2] = k.split('|').map(ref);
              return (
                <div key={k} className="rounded-xl border border-stone-200 bg-white p-3 flex gap-3">
                  <div className={`flex items-center shrink-0 ${r.verdict === 'COEXIST' ? '-space-x-3' : r.verdict === 'MOSAIC' ? '-space-x-1' : 'gap-2'}`}>
                    <PlantThumbnail src={a.imageUrl} alt={a.name} fallbackColor={a.color} className="w-11 h-11 ring-2 ring-white" roundedClassName="rounded-full" targetSize={96} priority="low" />
                    {r.verdict === 'EXCLUDE' && <span className="w-0.5 h-8 bg-amber-500 rounded" />}
                    <PlantThumbnail src={b2.imageUrl} alt={b2.name} fallbackColor={b2.color} className="w-11 h-11 ring-2 ring-white" roundedClassName="rounded-full" targetSize={96} priority="low" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="text-xs font-bold text-stone-900">{a.name} + {b2.name}</div>
                    <div className="flex flex-wrap gap-1">
                      <Badge tone={VERDICT_TONE[r.verdict]}>{g(VERDICT_LABEL[r.verdict])}</Badge>
                      <Badge tone="stone">{g(EVIDENCE_LABEL[r.evidence])}</Badge>
                    </div>
                    <p className="text-xs text-stone-600 leading-snug">{g(r.reason)}</p>
                    <p className="text-[10px] text-stone-400">{r.sources.map(src => src.split(' (')[0].split('.')[0] + (src.match(/\((\d{4}|n\.d\.)\)/)?.[0] ? ` ${src.match(/\((\d{4}|n\.d\.)\)/)?.[0]}` : '')).join('; ')}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {shown.length > PAIR_LIMIT && (
            <button onClick={() => setShowAll(v => !v)} className="w-full rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 py-2 text-xs font-bold text-stone-700 inline-flex items-center justify-center gap-1">
              <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
              {showAll ? g(L('Show fewer', 'Weniger zeigen')) : `${g(L('Show all', 'Alle zeigen'))} (${shown.length})`}
            </button>
          )}
        </div>
        <details className="text-[11px] text-stone-600">
          <summary className="cursor-pointer font-semibold">{g(L('Full sources for the overlap rules', 'Vollständige Quellen der Überlappungsregeln'))}</summary>
          <ul className="list-disc pl-5 space-y-0.5 mt-1">
            {[...new Set(Object.values(OVERLAP_SOURCES))].sort().map(src => <li key={src}>{src}</li>)}
          </ul>
        </details>
      </div>
    </div>
  );
};
