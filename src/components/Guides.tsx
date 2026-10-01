import React, { useState, useEffect } from 'react';
import { Language } from '../types/guild';
import { t } from '../i18n/translations';
import { RichText } from '../i18n/RichText';
import { PestEvidenceGuide } from './PestEvidenceGuide';
import {
  Sprout,
  BookOpen,
  Layers,
  Scissors,
  BookmarkCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  TreePine,
  ShieldCheck,
  ShieldAlert,
  Compass,
  Sun,
  Droplets,
  Zap,
  Leaf,
  Bug,
  HeartHandshake
} from 'lucide-react';

interface GuidesProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onNavigate: (path: string) => void;
}

type Tr = ReturnType<typeof t>;
type Icon = typeof Leaf;

type GuideTab = 'roles' | 'guild_design' | 'chop_and_drop' | 'allelopathy' | 'pests' | 'shade_and_stars' | 'tea_sinensis' | 'tea_assamica' | 'sources';

const GUIDE_TABS: { id: GuideTab; icon: Icon; label: keyof Tr }[] = [
  { id: 'roles', icon: Layers, label: 'guidesTabRoles' },
  { id: 'guild_design', icon: TreePine, label: 'guidesTabGuildDesign' },
  { id: 'chop_and_drop', icon: Scissors, label: 'guidesTabChopAndDrop' },
  { id: 'allelopathy', icon: ShieldAlert, label: 'guidesTabAllelopathy' },
  { id: 'pests', icon: Bug, label: 'guidesTabPests' },
  { id: 'shade_and_stars', icon: Sun, label: 'guidesTabShadeAndStars' },
  { id: 'tea_sinensis', icon: Leaf, label: 'guidesTabTeaSinensis' },
  { id: 'tea_assamica', icon: Sprout, label: 'guidesTabTeaAssamica' },
  { id: 'sources', icon: BookmarkCheck, label: 'guidesTabSources' }
];

// Deep links may carry only a hash (e.g. from calendar exports), so the tab is inferred from its prefix.
const tabFromHash = (hash: string): GuideTab | null => {
  if (hash.startsWith('chop-') || hash === 'chop_and_drop') return 'chop_and_drop';
  if (hash.startsWith('role-') || hash === 'roles') return 'roles';
  if (hash.startsWith('guide-') || hash === 'guild_design') return 'guild_design';
  if (hash.startsWith('allelo-') || hash === 'allelopathy') return 'allelopathy';
  if (hash.startsWith('pest-') || hash === 'pests') return 'pests';
  if (hash.startsWith('shade-') || hash.startsWith('dual-') || hash === 'shade_and_stars') return 'shade_and_stars';
  if (hash.startsWith('tea-sinensis-') || hash.startsWith('tea-pruning-') || hash === 'tea_sinensis') return 'tea_sinensis';
  if (hash.startsWith('tea-assamica-') || hash === 'tea_assamica') return 'tea_assamica';
  if (hash.startsWith('fn-') || hash === 'sources') return 'sources';
  return null;
};

const GuideStep: React.FC<{ id: string; step: number; title: string; children: React.ReactNode }> = ({ id, step, title, children }) => (
  <div id={id} className="flex gap-4 p-5 rounded-2xl bg-stone-50 border border-stone-200 scroll-mt-24 transition-all">
    <div className="w-10 h-10 rounded-xl bg-forest-600 text-white font-extrabold flex items-center justify-center shrink-0">
      {step}
    </div>
    <div className="space-y-1.5">
      <h3 className="font-bold text-base text-stone-900">{title}</h3>
      {children}
    </div>
  </div>
);

interface ChopCardProps {
  tr: Tr;
  id: string;
  name: string;
  latin: string;
  badge: string;
  cut: React.ReactNode;
  much: React.ReactNode;
  spread: React.ReactNode;
  children?: React.ReactNode;
}

const ChopCard: React.FC<ChopCardProps> = ({ tr, id, name, latin, badge, cut, much, spread, children }) => (
  <div id={id} className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4 scroll-mt-24 transition-all">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
      <div>
        <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-600" />
          <span>{name}</span>
        </h3>
        <p className="text-xs text-stone-500 italic">{latin}</p>
      </div>
      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">{badge}</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
      {[[tr.chopHowToCut, cut], [tr.chopHowMuch, much], [tr.chopWhereToSpread, spread]].map(([label, text], i) => (
        <div key={i} className="p-3.5 rounded-xl bg-white border border-stone-200">
          <strong className="text-stone-900 font-bold block mb-1">{label}</strong>
          <p className="text-stone-600 leading-relaxed">{text}</p>
        </div>
      ))}
    </div>
    {children}
  </div>
);

const WU_UPLOADS = 'https://wumountaintea.com/wp-content/uploads/2022/09/';

interface TeaProcessCardProps {
  tr: Tr;
  onFootnote: (fnId: string) => void;
  theme: { box: string; badge: string; tag: string; rubric: string; rubricTitle: string; dark?: boolean };
  name: string;
  oxidation: string;
  pdf: string;
  pdfLabel: string;
  protocolTitle: string;
  steps: [string, string][];
  markers: string;
  defects: string;
}

const TeaProcessCard: React.FC<TeaProcessCardProps> = ({ tr, onFootnote, theme, name, oxidation, pdf, pdfLabel, protocolTitle, steps, markers, defects }) => {
  const { dark } = theme;
  return (
    <div className={`p-5 rounded-2xl ${theme.box} space-y-3`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${theme.badge}`}>{name}</span>
          <span className={`text-xs font-mono font-bold ${theme.tag}`}>{oxidation}</span>
        </div>
        <a href={WU_UPLOADS + pdf} target="_blank" rel="noopener noreferrer" className={`text-xs font-bold ${dark ? 'text-amber-300' : 'text-forest-700'} hover:underline inline-flex items-center gap-1`}>
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{pdfLabel}</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className={`space-y-1.5 ${dark ? 'text-stone-300' : 'text-stone-700'} leading-relaxed`}>
          <div className={`font-bold ${dark ? 'text-white' : 'text-stone-900'}`}>{protocolTitle}</div>
          <ol className="list-decimal list-inside space-y-1">
            {steps.map(([step, text]) => (
              <li key={step}>
                <strong>{step}</strong>{' '}
                <RichText text={text} onFootnote={onFootnote} />
              </li>
            ))}
          </ol>
        </div>
        <div className={`p-3.5 rounded-xl ${theme.rubric} space-y-2`}>
          <div className={`font-bold ${theme.rubricTitle}`}>{tr.guidesWuMountainTeaSensoryRubric}</div>
          <p className={`${dark ? 'text-stone-300' : 'text-stone-700'} leading-relaxed`}>
            <strong>{tr.guidesHighQualityMarkers}</strong>{' '}
            <RichText text={markers} onFootnote={onFootnote} />
          </p>
          <p className={`${dark ? 'text-rose-300' : 'text-rose-800'} leading-relaxed`}>
            <strong>{tr.guidesProcessingDefectsDiagnose}</strong>{' '}
            {defects}
          </p>
        </div>
      </div>
    </div>
  );
};

interface Source {
  id: string;
  author: string;
  title: string;
  journal: string;
  note: string;
}

const SOURCES: Source[] = [
  {
    id: 'fn-1',
    author: 'Dawson, J. O. (2008)',
    title: 'Ecology of Actinorhizal Plants',
    journal: 'In: Pawlowski, K. & Newton, W. E. (eds.), Nitrogen-fixing Actinorhizal Symbioses, Springer, pp. 199–234. DOI: 10.1007/978-1-4020-3547-0_8',
    note: 'Documenting Frankia symbiosis in Alnus, Hippophae, and Elaeagnus with nitrogenase reduction.'
  },
  {
    id: 'fn-2',
    author: 'Postgate, J. (1998)',
    title: 'Nitrogen Fixation (3rd ed.)',
    journal: 'Cambridge University Press, Cambridge, UK',
    note: 'Biochemical mechanics of rhizobial nitrogenase enzymes and nodule turnover.'
  },
  {
    id: 'fn-3',
    author: 'Barker, A. V., & Pilbeam, D. J. (2015)',
    title: 'Handbook of Plant Nutrition (2nd ed.)',
    journal: 'CRC Press / Taylor & Francis Group',
    note: 'Subsoil nutrient mining and dynamic accumulation of potassium, calcium, and magnesium by taproot species.'
  },
  {
    id: 'fn-4',
    author: 'Hills, L. D. (1976)',
    title: 'Comfrey: Past, Present and Future',
    journal: 'Faber & Faber, London',
    note: 'Definitive agronomic analysis of Symphytum x uplandicum cultivar Bocking 14 mineral profiles (NPK 1.8-0.5-5.3 dry weight).'
  },
  {
    id: 'fn-5',
    author: 'Goulson, D. (2003)',
    title: 'Bumblebees: Behaviour, Ecology, and Conservation',
    journal: 'Oxford University Press',
    note: 'Phenological floral resource bridges and hoverfly (Syrphidae) aphid predation rates in polycultures.'
  },
  {
    id: 'fn-6',
    author: 'Pickett, J. A., Woodcock, C. M., et al. (2014)',
    title: 'Push–pull farming systems',
    journal: 'Current Opinion in Biotechnology, 26, pp. 125–132 (DOI: 10.1016/j.copbio.2013.12.006)',
    note: 'Volatile monoterpenes and repellent allelochemical masking mechanisms in insect pest management.'
  },
  {
    id: 'fn-7',
    author: 'Finch, S., & Collier, R. H. (2000)',
    title: 'Host-plant selection by insects – a theory based on \'appropriate/inappropriate landings\' by pest insects of cruciferous plants',
    journal: 'Entomologia Experimentalis et Applicata, 96(2), pp. 91–102 (DOI: 10.1046/j.1570-7458.2000.00684.x)',
    note: 'The scientific mechanism behind aromatic understory companion plants reducing oviposition on crop plants.'
  },
  {
    id: 'fn-8',
    author: 'Teasdale, J. R. (1996)',
    title: 'Contribution of cover crops to weed management in sustainable agricultural systems',
    journal: 'Journal of Production Agriculture, 9(4), pp. 475–479',
    note: 'Living mulch soil temperature buffering, soil erosion mitigation, and light-exclusion weed suppression.'
  },
  {
    id: 'fn-9',
    author: 'Robinson, D. (1994)',
    title: 'The responses of plants to non-uniform supplies of nutrients',
    journal: 'New Phytologist, 127(4), pp. 635–674 (DOI: 10.1111/j.1469-8137.1994.tb02969.x)',
    note: 'Root competition dynamics between aggressive turf grasses (Poa, Elymus) and monocot bulb barriers.'
  },
  {
    id: 'fn-10',
    author: 'Curtis, H., Noll, U., et al. (2004)',
    title: 'Broad-spectrum activity of the volatile phytoanticipin allicin in extracts of garlic (Allium sativum L.) against plant pathogenic bacteria, fungi and Oomycetes',
    journal: 'Physiological and Molecular Plant Pathology, 65(2), pp. 79–89 (DOI: 10.1016/j.pmpp.2004.11.006)',
    note: 'In-vitro and in-vivo inhibition of conidial germination in Venturia inaequalis by diallyl thiosulfinate.'
  },
  {
    id: 'fn-11',
    author: 'Choi, K.-D., Kim, H.-Y., & Shin, I.-S. (2017) & Mari, M., Leoni, O., Iori, R., & Cembali, T. (2002)',
    title: 'Antifungal activity of isothiocyanates extracted from horseradish (Armoracia rusticana) root against pathogenic dermal fungi / Antifungal vapour-phase activity of allyl-isothiocyanate against Penicillium expansum on pears',
    journal: 'Food Science and Biotechnology, 26(3), pp. 847–852 (DOI: 10.1007/s10068-017-0104-4); Plant Pathology, 51(2), pp. 231–236 (DOI: 10.1046/j.1365-3059.2002.00667.x)',
    note: 'Isothiocyanates extracted from horseradish root showed antifungal activity in vitro; vapour of allyl isothiocyanate (the main pungent isothiocyanate of horseradish and mustard) controlled blue mould (Penicillium expansum) on inoculated pears.'
  },
  {
    id: 'fn-12',
    author: 'Crawford, M. (2010)',
    title: 'Creating a Forest Garden: Working with Nature to Grow Edible Crops',
    journal: 'Green Books, Totnes, UK',
    note: 'Practical metric spatial zonation, chop-and-drop biomass yield rates, and harvest ladder corridor design.'
  },
  {
    id: 'fn-13',
    author: 'Jose, S. (2002)',
    title: 'Black walnut allelopathy: current state of the science',
    journal: 'In Inderjit & A. U. Mallik (eds.), Chemical Ecology of Plants: Allelopathy in Aquatic and Terrestrial Ecosystems, Birkhäuser, Basel, pp. 149–172 (DOI: 10.1007/978-3-0348-8109-8_10)',
    note: 'Biochemical action of 5-hydroxy-1,4-naphthoquinone (juglone) on electron transport in sensitive understory species.'
  },
  {
    id: 'fn-14',
    author: 'Hemenway, T. (2009)',
    title: 'Gaia\'s Garden: A Guide to Home-Scale Permaculture (2nd ed.)',
    journal: 'Chelsea Green Publishing, White River Junction, VT',
    note: 'Solar sectoring, concentric guild zonation, and guild assembly protocols.'
  },
  {
    id: 'fn-15',
    author: 'Fittipaldi Broussard, M., Campana, C., Ferrari, V., Ragnoli, I., Zhang, L., Lucini, L., Rossi, V., Caffi, T., & Fedele, G. (2026)',
    title: 'The Consociation of Sage and Grapevine Modifies Grape Leaf Metabolism and Reduces Downy Mildew Infection',
    journal: 'Agronomy, 16(2), 201 (DOI: 10.3390/agronomy16020201)',
    note: 'Grapevines co-grown with sage (Salvia officinalis) in a closed box system: sage VOCs reprogrammed grape leaf secondary metabolism (lipids, phenylpropanoids, terpenoids) and leaves pre-exposed to them were significantly less susceptible to Plasmopara viticola (downy mildew).'
  },
  {
    id: 'fn-16',
    author: 'Ries, S. K., Wert, V., Sweeley, C. C., & Leavitt, R. A. (1977)',
    title: 'Triacontanol: a new naturally occurring plant growth regulator',
    journal: 'Science, 195(4284), pp. 1339–1341 (DOI: 10.1126/science.195.4284.1339)',
    note: 'Isolation of triacontanol from alfalfa (Medicago sativa) meal as the active growth-promoting fraction; applied to rice, corn, barley and tomato it increased plant dry weight and growth.'
  },
  {
    id: 'fn-17',
    author: 'Vergnes, S., Ladouce, N., Fournier, S., Ferhout, H., Attia, F., & Dumas, B. (2014)',
    title: 'Foliar treatments with Gaultheria procumbens essential oil induce defense responses and resistance against a fungal pathogen in Arabidopsis',
    journal: 'Frontiers in Plant Science, 5, 477 (DOI: 10.3389/fpls.2014.00477)',
    note: 'Wintergreen essential oil, dominated by methyl salicylate (a volatile salicylic-acid derivative), applied to leaves induces salicylic-acid-dependent defense genes and resistance against a fungal pathogen.'
  },
  {
    id: 'fn-18',
    author: 'Nishioka, T., Marian, M., Kobayashi, I., Kobayashi, Y., Yamamoto, K., Tamaki, H., Suga, H., & Shimizu, M. (2019)',
    title: 'Microbial basis of Fusarium wilt suppression by Allium cultivation',
    journal: 'Scientific Reports, 9, 1715 (DOI: 10.1038/s41598-018-37559-7)',
    note: 'Welsh onion (Allium fistulosum) and onion cultivation suppresses Fusarium wilt via antagonistic gram-negative rhizosphere bacteria enriched in Allium-cultivated soil, plus heat-labile antifungal compounds in Welsh onion roots.'
  },
  {
    id: 'fn-19',
    author: 'Reich, P. B., Oleksyn, J., Modrzynski, J., Mrozinski, P., Hobbie, S. E., Eissenstat, D. M., Chorover, J., Chadwick, O. A., Hale, C. M., & Tjoelker, M. G. (2005)',
    title: 'Linking litter calcium, earthworms and soil properties: a common garden test with 14 tree species',
    journal: 'Ecology Letters, 8(8), pp. 811–818',
    note: 'Common-garden experiment demonstrating that Tilia cordata (Small-leaved Linden) produces calcium-rich leaf litter that stimulates earthworm biomass, accelerates litter decomposition, buffers soil pH, and builds fertile mull humus.'
  },
  {
    id: 'fn-20',
    author: 'Hejl, A. M., & Koster, K. L. (2004) & Rietveld, W. J. (1983)',
    title: 'Juglone disrupts root plasma membrane H+-ATPase activity and impairs water uptake, root respiration, and growth in soybean (Glycine max) and corn (Zea mays) / Allelopathic effects of juglone on germination and growth of several herbaceous and woody species',
    journal: 'Journal of Chemical Ecology, 30(2), pp. 453–471 (DOI: 10.1023/B:JOEC.0000017988.20530.d5); Journal of Chemical Ecology, 9(2), pp. 295–308 (DOI: 10.1007/BF00988047)',
    note: 'Demonstrates that juglone (5-hydroxy-1,4-naphthoquinone) blocks root plasma membrane H+-ATPase and impairs mitochondrial respiration in sensitive Rosaceae, Ericaceae, and Fabaceae (Medicago, Lupinus).'
  },
  {
    id: 'fn-21',
    author: 'Borlinghaus, J., Albrecht, F., Gruhlke, M. C. H., Nwachukwu, I. D., & Slusarenko, A. J. (2014) & Adeleke, M. T. V. (2016)',
    title: 'Allicin: chemistry and biological properties / Effect of Allium sativum (garlic) extract on the growth and nodulation of cowpea (Vigna unguiculata) and groundnut (Arachis hypogaea)',
    journal: 'Molecules, 19(8), pp. 12591–12618 (DOI: 10.3390/molecules190812591); African Journal of Agricultural Research, 11(48), pp. 4945–4951',
    note: 'Proves that bactericidal thiosulfinates (allicin) and disulfides from Allium species oxidize bacterial thiol enzymes and suppress Rhizobium root nodulation in close proximity (< 1.8 m).'
  },
  {
    id: 'fn-22',
    author: 'Colvin, W. I., III, & Gliessman, S. R. (2000) & Colvin, W. I., III, & Gliessman, S. R. (2011)',
    title: 'Fennel (Foeniculum vulgare) management and native species enhancement on Santa Cruz Island, California / Effects of fennel (Foeniculum vulgare L.) interference on germination of introduced and native plant species',
    journal: 'In D. R. Browne, K. L. Mitchell & H. W. Chaney (eds.), Proceedings of the Fifth California Islands Symposium, U.S. Minerals Management Service, Camarillo, CA (OCS Study MMS 99-0038), pp. 184–189; Allelopathy Journal, 28(1), pp. 41–52',
    note: 'Eight-year field trial on Santa Cruz Island (California): dense fennel stands (> 90% cover) suppressed the recruitment of other plants, which recovered when fennel cover was reduced; in laboratory bioassays, water-soluble fennel leaf leachate significantly inhibited germination of all native forbs tested (incl. Lupinus) and of several introduced forbs and grasses (incl. Medicago sativa, Lotus corniculatus).'
  },
  {
    id: 'fn-23',
    author: 'Bode, H. R. (1940) & Funke, G. L. (1943)',
    title: 'Über die Blattausscheidungen des Wermuts (Artemisia absinthium) und ihre Wirkung auf andere Pflanzen / The influence of Artemisia absinthium on neighbouring plants',
    journal: 'Planta, 30(4), pp. 567–589 (DOI: 10.1007/BF01917042); Blumea, 5(2), pp. 281–293',
    note: 'Classic chemical ecology studies proving that T-shaped glandular leaf trichomes of Artemisia absinthium leach the sesquiterpene lactone absinthin via rain drip, inhibiting umbellifers (Levisticum, Foeniculum) and legumes within 1.2 m while Ribes currants remain tolerant.'
  },
  {
    id: 'fn-24',
    author: 'Zambino, P. J. (2010) & Hilber, U. W., Siegfried, W., & Schüepp, H. (1990)',
    title: 'Biology and pathology of Ribes and their implications for management of white pine blister rust (Cronartium ribicola) / Epidemiological investigations on pear trellis rust (Gymnosporangium fuscum / sabinae)',
    journal: 'Forest Pathology, 40(3–4), pp. 264–291 (DOI: 10.1111/j.1439-0329.2010.00658.x); Schweizerische Zeitschrift für Obst- und Weinbau, 126, pp. 320–329',
    note: 'Quantifies heteroecious spore dispersal gradients between Pinus strobus and Ribes spp. (Cronartium ribicola, 300 m buffer) and between Juniperus sabina and Pyrus communis / Cydonia oblonga (Gymnosporangium sabinae, 150–300 m buffer).'
  },
  {
    id: 'fn-25',
    author: 'Pegg, G. F., & Brady, B. L. (2002)',
    title: 'Verticillium Wilts',
    journal: 'CABI Publishing, Wallingford, UK (ISBN 978-0851995298)',
    note: 'Documents 10–14 year soil persistence of Verticillium dahliae microsclerotia amplified by Solanaceae crops (potatoes, tomatoes) and subsequent xylem infection of temperate stone and pome fruit trees.'
  },
  {
    id: 'fn-26',
    author: 'Read, D. J. (1996) & Konishi, S., Miyamoto, S., & Taki, T. (1985)',
    title: 'The structure and function of the ericoid mycorrhizal root / Stimulatory effects of aluminum on tea plants (Camellia sinensis) grown under low and high phosphorus supply',
    journal: 'Annals of Botany, 77(4), pp. 365–374 (DOI: 10.1006/anbo.1996.0044); Soil Science and Plant Nutrition, 31(3), pp. 361–368 (DOI: 10.1080/00380768.1985.10557443)',
    note: 'Explains why obligate calcifuges (Vaccinium, Gaultheria, Camellia sinensis) require acidic soil (pH 4.0–5.5) for intracellular ericoid mycorrhizal coils and soluble Fe2+/Al3+ uptake, suffering lime chlorosis near alkaline calcicoles.'
  },
  {
    id: 'fn-27',
    author: 'Landolt, P. J., Hofstetter, R. W., & Biddick, L. L. (1999)',
    title: 'Plant essential oils as arrestants and repellents for neonate larvae of the codling moth (Lepidoptera: Tortricidae)',
    journal: 'Environmental Entomology, 28(6), pp. 954–960 (DOI: 10.1093/ee/28.6.954)',
    note: 'Laboratory assays of 27 plant essential oils on neonate Cydia pomonella larvae; rue, garlic, patchouli and tansy (Tanacetum vulgare) oils were the strongest repellents.'
  },
  {
    id: 'fn-28',
    author: 'Wäckers, F. L. (2004) & Gontijo, L. M., Beers, E. H., & Snyder, W. E. (2013)',
    title: 'Assessing the suitability of flowering herbs as parasitoid food sources: flower attractiveness and nectar accessibility / Flowers promote aphid suppression in apple orchards',
    journal: 'Biological Control, 29(3), pp. 307–314 (DOI: 10.1016/j.biocontrol.2003.08.005); Biological Control, 66(1), pp. 8–15 (DOI: 10.1016/j.biocontrol.2013.03.007)',
    note: 'Proves that exposed floral nectaries of Apiaceae, Asteraceae, and Origanum vulgare provide accessible nectar for short-tongued parasitoid wasps and hoverflies in temperate fruit orchards.'
  },
  {
    id: 'fn-29',
    author: 'Bastida, J., Lavilla, R., & Viladomat, F. (2006)',
    title: 'Chemical and biological aspects of Narcissus alkaloids',
    journal: 'The Alkaloids: Chemistry and Biology, 63, pp. 87–179 (DOI: 10.1016/S1099-4831(06)63003-4)',
    note: 'Comprehensive phytochemical review of Amaryllidaceae isoquinoline alkaloids (lycorine, galanthamine) in Narcissus and Galanthus bulbs conferring unpalatability and acetylcholinesterase inhibition against burrowing mammalian herbivores and voles.'
  },
  {
    id: 'fn-30',
    author: 'Hooks, C. R. R., Wang, K.-H., Ploeg, A., & McSorley, R. (2010) & Mukhtar, T., Kayani, M. Z., & Hussain, M. A. (2013)',
    title: 'Using marigold (Tagetes spp.) as a cover crop to protect crops from plant-parasitic nematodes / Nematicidal activities of Cannabis sativa L. and Zanthoxylum alatum Roxb. against Meloidogyne incognita',
    journal: 'Applied Soil Ecology, 46(3), pp. 307–320 (DOI: 10.1016/j.apsoil.2010.09.005); Industrial Crops and Products, 42, pp. 447–453 (DOI: 10.1016/j.indcrop.2012.06.027)',
    note: 'Demonstrates rhizosphere suppression of Pratylenchus lesion nematodes and Meloidogyne root-knot nematodes via alpha-terthienyl exudation from Tagetes patula and nematicidal root/foliar metabolites of Cannabis sativa.'
  },
  {
    id: 'fn-31',
    author: 'Valladares, F., & Niinemets, Ü. (2008)',
    title: 'Shade tolerance, a key plant feature of complex nature and consequences',
    journal: 'Annual Review of Ecology, Evolution, and Systematics, 39, pp. 237–257 (DOI: 10.1146/annurev.ecolsys.39.110707.173506)',
    note: 'Synthesizes physiological adaptations of shade-tolerant understory perennials (higher specific leaf area, lower light compensation points) versus sun-demanding aromatic shrubs across canopy irradiance gradients.'
  },
  {
    id: 'fn-32',
    author: 'Lapointe, L. (2001)',
    title: 'How phenology influences physiology in deciduous forest spring ephemerals',
    journal: 'Physiologia Plantarum, 113(2), pp. 151–157 (DOI: 10.1034/j.1399-3054.2001.1130201.x)',
    note: 'Explains how vernal geophytes (Galanthus, Eranthis, Allium ursinum, Narcissus) exploit high early-spring irradiance prior to deciduous tree leaf-out to complete carbohydrate storage before entering summer dormancy.'
  },
  {
    id: 'fn-33',
    author: 'He, X. H., Critchley, C., & Bledsoe, C. (2003)',
    title: 'Nitrogen transfer within and between plants through common mycorrhizal networks (CMNs)',
    journal: 'Critical Reviews in Plant Sciences, 22(6), pp. 531–567 (DOI: 10.1080/713608315)',
    note: 'Reviews bidirectional and source-to-sink underground transfer of symbiotically fixed nitrogen from actinorhizal (Alnus, Elaeagnus, Hippophae) and rhizobial N-fixers to neighboring trees via shared mycorrhizal networks.'
  },
  {
    id: 'fn-34',
    author: 'Wei, C., Yang, H., Wang, S., Zhao, J., Liu, C., Gao, L., Xia, E., Lu, Y., Tai, Y., She, G., et al. (2018)',
    title: 'Draft genome sequence of Camellia sinensis var. sinensis provides insights into the evolution of the tea genome and tea quality',
    journal: 'Proceedings of the National Academy of Sciences (PNAS), 115(18), pp. E4151–E4158 (DOI: 10.1073/pnas.1719622115)',
    note: 'Establishes the 0.38–1.54 Mya evolutionary divergence between Camellia sinensis var. sinensis and var. assamica and characterizes tandem gene duplications driving catechin (SCPL), L-theanine (CsTSI), and terpene aroma biosynthesis.'
  },
  {
    id: 'fn-35',
    author: 'Xia, E.-H., Zhang, H.-B., Sheng, J., Li, K., Zhang, Q.-J., Kim, C., Zhang, Y., Liu, Y., Zhu, T., Li, W., et al. (2017)',
    title: 'The Tea Tree Genome Provides Insights into Tea Flavor and Independent Evolution of Caffeine Biosynthesis',
    journal: 'Molecular Plant, 10(6), pp. 866–877 (DOI: 10.1016/j.molp.2017.04.002)',
    note: 'Reference genome assembly of Camellia sinensis var. assamica (cultivar Yunkang 10), elucidating high flavonoid/catechin pathway expression and N-methyltransferase (TCS1) caffeine evolution in large-leaf tropical tea trees.'
  },
  {
    id: 'fn-36',
    author: 'Rothenberg, D. O., Zhou, C., & Zhang, L. (2018); Rothenberg, D. O., & Zhang, L. (2019); & Wu Mountain Tea (2022)',
    title: 'A Review on the Weight-Loss Effects of Oxidized Tea Polyphenols / Mechanisms Underlying the Anti-Depressive Effects of Regular Tea Consumption / A Masterclass on Tea (8-Chapter Curriculum & Sensory Assessment Rubrics)',
    journal: 'Molecules, 23(5), 1176 (DOI: 10.3390/molecules23051176); Nutrients, 11(6), 1361 (DOI: 10.3390/nu11061361); https://wumountaintea.com/a-masterclass-on-tea/',
    note: 'Comprehensive synthesis of tea secondary metabolites (catechins, L-theanine, caffeine, volatiles), processing biochemistry across all 6 tea types, and formal 5-factor sensory evaluation rubrics.'
  },
  {
    id: 'fn-37',
    author: 'Ruan, J., Gerendás, J., Härdter, R., & Sattelmacher, B. (2007) & Yan, P., Wu, L., Wang, D., Fu, J., Shen, C., Li, X., Zhang, L., Zhang, L., Fan, L., & Wen, W. (2020)',
    title: 'Effect of nitrogen form and root-zone pH on growth and nitrogen uptake of tea (Camellia sinensis) plants / Soil acidification in Chinese tea plantations',
    journal: 'Annals of Botany, 99(2), pp. 301–310 (DOI: 10.1093/aob/mcl258); Science of The Total Environment, 715, 136963 (DOI: 10.1016/j.scitotenv.2020.136963)',
    note: 'Demonstrates preferential NH4+ assimilation via the root GS-GOGAT pathway into L-theanine and ethylamine, optimal growth at pH 4.5–5.5, and active rhizosphere acidification via root plasma-membrane H+-ATPase proton extrusion and organic acid exudates.'
  },
  {
    id: 'fn-38',
    author: 'Ku, K. M., Choi, J. N., Kim, J., Kim, J. K., Yoo, L. G., Lee, S. Y., Hong, Y. S., & Lee, C. H. (2010)',
    title: 'Metabolomics analysis reveals the compositional differences of shade grown tea (Camellia sinensis L.)',
    journal: 'Journal of Agricultural and Food Chemistry, 58(1), pp. 418–426 (DOI: 10.1021/jf902929h)',
    note: 'Proves that canopy and pre-harvest shading (Kabusecha, Gyokuro, Tencha) downregulates Phenylalanine Ammonia-Lyase (PAL) and flavonoid catechin accumulation while significantly increasing L-theanine, free amino acids, caffeine, and chlorophyll a/b.'
  },
  {
    id: 'fn-39',
    author: 'Ho, C.-T., Zheng, X., & Li, S. (2015) & Wang, Y., Kan, Z., Thompson, H. J., Ling, T., Ho, C.-T., Li, D., & Wan, X. (2019)',
    title: 'Tea aroma formation / Impact of Six Typical Processing Methods on the Chemical Composition of Tea Leaves Using a Single Camellia sinensis Cultivar',
    journal: 'Food Science and Human Wellness, 4(1), pp. 9–27 (DOI: 10.1016/j.fshw.2015.04.001); Journal of Agricultural and Food Chemistry, 67(19), pp. 5423–5436 (DOI: 10.1021/acs.jafc.8b05140)',
    note: 'Controlled metabolomic comparison processing a single tea cultivar into Green, Yellow, White, Oolong, Black, and Dark tea, mapping catechin oxidation, glycoside hydrolysis, carotenoid cleavage, lipid degradation, and Maillard pyrazine formation.'
  },
  {
    id: 'fn-40',
    author: 'Dai, W., Xie, D., Lu, M., Li, P., Lv, H., Yang, C., Peng, Q., Zhu, Y., Guo, L., Zhang, Y., Tan, J., & Lin, Z. (2017) & Xu, J., Wang, M., Zhao, J., Wang, Y.-H., Tang, Q., & Khan, I. A. (2018)',
    title: 'Characterization of white tea metabolome: Comparison against green and black tea by a nontargeted metabolomics approach / Yellow tea (Camellia sinensis L.), a promising Chinese tea: Processing, chemical constituents and health benefits',
    journal: 'Food Research International, 96, pp. 40–45 (DOI: 10.1016/j.foodres.2017.03.028); Food Research International, 107, pp. 567–577 (DOI: 10.1016/j.foodres.2018.01.063)',
    note: 'Elucidates endogenous protein hydrolysis into free amino acids (L-theanine, phenylalanine, GABA) during prolonged 48–72 h White tea withering, and non-enzymatic hydrothermal catechin epimerization and chlorophyll degradation during Yellow tea smothering (Men Huang).'
  },
  {
    id: 'fn-41',
    author: 'Zeng, L., Zhou, Y., Gui, J., Fu, X., Mei, X., Zhen, Y., Ye, T., Du, B., Dong, F., Watanabe, N., & Yang, Z. (2016)',
    title: 'Formation of Volatile Tea Constituent Indole During the Oolong Tea Manufacturing Process',
    journal: 'Journal of Agricultural and Food Chemistry, 64(24), pp. 5011–5019 (DOI: 10.1021/acs.jafc.6b01742)',
    note: 'Demonstrates that mechanical leaf-edge bruising (Yao Qing) during Oolong Zuo Qing acts as a biological wounding stress signal in living leaves, activating tryptophan synthase beta-subunit (CsTSB2) and lipoxygenase pathways to synthesize floral indole, jasmine lactone, and trans-nerolidol.'
  },
  {
    id: 'fn-42',
    author: 'Roberts, E. A. H. (1958) & Tanaka, T., & Matsuo, Y. (2020)',
    title: 'The chemistry of tea manufacture / Production Mechanisms of Black Tea Polyphenols',
    journal: 'Journal of the Science of Food and Agriculture, 9(7), pp. 381–390 (DOI: 10.1002/jsfa.2740090701); Chemical and Pharmaceutical Bulletin, 68(12), pp. 1131–1142 (DOI: 10.1248/cpb.c20-00295)',
    note: 'Defines the enzymatic oxidation cascade of catechins by Polyphenol Oxidase (PPO) and Peroxidase (POD) into benzotropolone Theaflavins (TF) and polymeric Thearubigins (TR), as well as the non-covalent TF–caffeine complexation responsible for "creaming down" (Leng Hou Hun) in high-grade Black teas.'
  },
  {
    id: 'fn-43',
    author: 'Lv, H.-P., Zhang, Y.-J., Lin, Z., & Liang, Y.-R. (2013) & Zhu, M.-Z., Li, N., Zhou, F., Ouyang, J., Lu, D.-M., Xu, W., Li, J., Lin, H.-Y., Zhang, Z., Xiao, J.-B., et al. (2020)',
    title: 'Processing and chemical constituents of Pu-erh tea: A review / Microbial bioconversion of the chemical components in dark tea',
    journal: 'Food Research International, 53(2), pp. 608–618 (DOI: 10.1016/j.foodres.2013.02.043); Food Chemistry, 312, 126043 (DOI: 10.1016/j.foodchem.2019.126043)',
    note: 'Details the thermophilic microbial succession (Aspergillus niger, Blastobotrys adeninivorans, Eurotium cristatum) during Wo Dui pile fermentation of Camellia sinensis var. assamica, converting esterified catechins into polymeric Theabrownins (TB), gallic acid, and 1,2,3-trimethoxybenzene.'
  },
  {
    id: 'fn-44',
    author: 'Mortimer, P. E., Gui, H., Xu, J., Zhang, C., Barrios, E., & Hyde, K. D. (2015)',
    title: 'Alder trees enhance crop productivity and soil microbial biomass in tea plantations',
    journal: 'Applied Soil Ecology, 96, pp. 25–32 (DOI: 10.1016/j.apsoil.2015.05.012)',
    note: 'Field study in Yunnan, China: planting the actinorhizal N-fixing tree Alnus nepalensis into mature Camellia sinensis var. assamica monoculture increased tea productivity and shifted soil fungal and bacterial communities toward higher microbial biomass.'
  },
  {
    id: 'fn-45',
    author: 'Orwa, C., Mutua, A., Kindt, R., Jamnadass, R., & Simons, A. (2009)',
    title: 'Agroforestree Database: a tree reference and selection guide, version 4.0 — Albizia chinensis',
    journal: 'World Agroforestry Centre (ICRAF), Nairobi, Kenya (https://apps.worldagroforestry.org/treedb2/speciesprofile.php?Spid=1787)',
    note: 'Documents Albizia chinensis as a nitrogen-fixing shade tree in tea and coffee plantations that tolerates frequent pruning (grown to ~7 m and cut back to ~4 m), light frost, 1,000–5,000 mm rainfall and altitudes up to 1,800 m.'
  },
  {
    id: 'fn-46',
    author: 'Guangming Online – Kepu China (光明网-科普中国) (2022)',
    title: '【科学种植百问百答】如何进行茶树修剪？ (Science-based cultivation Q&A: How should tea bushes be pruned?)',
    journal: 'kepu.gmw.cn, 3 August 2022 (https://kepu.gmw.cn/2022-08/03/content_35930355.htm)',
    note: 'Chinese extension guidance on the three formative cuts (Dingxing XiuJian) of young tea, made to promote axillary-bud break and increase the number of scaffold branches: 1st cut after transplanting once seedlings exceed 25 cm (main stem cut at 15–20 cm, laterals spared); 2nd cut the following year in late February–early March (30–40 cm); 3rd cut one year later (level cut at 40–55 cm); then two seasons of light tipping before full plucking at 60–80 cm height.'
  },
  {
    id: 'fn-47',
    author: 'Yuan, Y., Chen, Z., Huang, X., Wang, F., Guo, H., Huang, Z., & Yang, H. (2023)',
    title: 'Comparative analysis of nitrogen content and its influence on actinorhizal nodule and rhizospheric microorganism diversity in three Alnus species',
    journal: 'Frontiers in Microbiology, 14, 1230170 (DOI: 10.3389/fmicb.2023.1230170)',
    note: 'Compares Alnus glutinosa, A. formosana and A. cremastogyne; summarises that black, red and sitka alders fix 40–300 kg N/ha/yr (comparable to alfalfa and clover), with the amount of fixed N transferred to nearby soils varying greatly within that range.'
  },
  {
    id: 'fn-48',
    author: 'Ledgard, S. F., & Steele, K. W. (1992)',
    title: 'Biological nitrogen fixation in mixed legume/grass pastures',
    journal: 'Plant and Soil, 141(1), pp. 137–153 (DOI: 10.1007/BF00011314)',
    note: 'Review of N fixation in legume/grass pastures (13–682 kg N/ha/yr worldwide; 55–296 kg N/ha/yr in grazed white clover pastures); estimates the fixed N transferred below-ground to associated grasses, predominantly through decomposition of legume roots and nodules, at 3–102 kg N/ha/yr (2–26% of fixation).'
  },
  {
    id: 'fn-49',
    author: 'Butler, G. W., Greenwood, R. M., & Soper, K. (1959)',
    title: 'Effects of shading and defoliation on the turnover of root and nodule tissue of plants of Trifolium repens, Trifolium pratense, and Lotus uliginosus',
    journal: 'New Zealand Journal of Agricultural Research, 2(3), pp. 415–426 (DOI: 10.1080/00288233.1959.10418027)',
    note: 'Glass-sided box study: under recurrent defoliation, white clover lost roots and nodules but more than replaced them with new growth, leading to a rapid turnover of root and nodule tissue.'
  }
];

export const Guides: React.FC<GuidesProps> = ({ language }) => {
  const tr = t(language);
  const [activeTab, setActiveTab] = useState<GuideTab>('roles');

  // Sync the tab with ?tab= / #anchor on mount and whenever App navigates (it dispatches popstate).
  useEffect(() => {
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)); };

    const handleUrlChange = () => {
      if (!window.location.pathname.startsWith('/guides')) return;
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as GuideTab | null;
      const hash = window.location.hash.replace('#', '');

      let targetTab: GuideTab | null = null;
      if (tabParam && GUIDE_TABS.some(tab => tab.id === tabParam)) {
        targetTab = tabParam;
      } else if (hash) {
        targetTab = tabFromHash(hash);
      } else {
        targetTab = 'roles';
      }

      if (targetTab) {
        setActiveTab(targetTab);
      }

      if (hash) {
        // The target only exists once the tab has rendered, so retry briefly.
        const tryScroll = (attempts: number) => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-2', 'ring-forest-500', 'ring-offset-2');
            later(() => el.classList.remove('ring-2', 'ring-forest-500', 'ring-offset-2'), 3500);
          } else if (attempts > 0) {
            later(() => tryScroll(attempts - 1), 100);
          }
        };
        later(() => tryScroll(5), 100);
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      timers.forEach(id => window.clearTimeout(id));
    };
  }, []);

  const handleSelectTab = (tab: GuideTab) => {
    setActiveTab(tab);
    window.history.replaceState({}, '', `/guides?tab=${tab}`);
  };

  const scrollToFootnote = (fnId: string) => {
    setActiveTab('sources');
    window.history.replaceState({}, '', `/guides?tab=sources#${fnId}`);
    setTimeout(() => {
      const el = document.getElementById(fnId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('bg-amber-100/70');
        setTimeout(() => el.classList.remove('bg-amber-100/70'), 2500);
      }
    }, 100);
  };

  const scrollToSection = (tab: GuideTab, sectionId: string) => {
    setActiveTab(tab);
    window.history.replaceState({}, '', `/guides?tab=${tab}#${sectionId}`);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-2', 'ring-forest-500', 'ring-offset-2');
        setTimeout(() => el.classList.remove('ring-2', 'ring-forest-500', 'ring-offset-2'), 3500);
      }
    }, 100);
  };

  const roles: { id: string; icon: Icon; iconClass: string; title: string; tag: string; tagClass: string; body: React.ReactNode }[] = [
    { id: 'role-NITROGEN_FIXER', icon: Zap, iconClass: 'text-emerald-600', title: tr.roleNitrogenFixer, tag: 'N₂ → NH₄⁺', tagClass: 'bg-emerald-100 text-emerald-800', body: <RichText text={tr.guidesPlantsCannotDirectlyAbsorbAtmospheric} onFootnote={scrollToFootnote} /> },
    { id: 'role-DYNAMIC_ACCUMULATOR', icon: Droplets, iconClass: 'text-sky-600', title: tr.roleDynamicAccumulator, tag: 'K⁺, Ca²⁺, Mg²⁺, P', tagClass: 'bg-sky-100 text-sky-800', body: <RichText text={tr.guidesSpeciesProfoundVerticalTaprootsSuch} onFootnote={scrollToFootnote} /> },
    { id: 'role-POLLINATOR_MAGNET', icon: Sun, iconClass: 'text-amber-500', title: tr.rolePollinatorMagnet, tag: tr.guideTagNectarBridge, tagClass: 'bg-amber-100 text-amber-800', body: <RichText text={tr.guidesEffectivePollinationRequires} onFootnote={scrollToFootnote} /> },
    { id: 'role-PEST_REPELLER', icon: Bug, iconClass: 'text-rose-500', title: tr.rolePestRepeller, tag: tr.guideTagPushPull, tagClass: 'bg-rose-100 text-rose-800', body: <RichText text={tr.guidesManyPestInsectsFindTheir} onFootnote={scrollToFootnote} /> },
    { id: 'role-LIVING_MULCH', icon: Leaf, iconClass: 'text-emerald-700', title: tr.roleLivingMulch, tag: tr.guideTagSoilArmor, tagClass: 'bg-emerald-100 text-emerald-900', body: <RichText text={tr.guidesBareSoilEcologicalWoundProstrate} onFootnote={scrollToFootnote} /> },
    { id: 'role-GRASS_BARRIER', icon: ShieldCheck, iconClass: 'text-amber-600', title: tr.roleGrassBarrier, tag: tr.guideTagRhizomeExclusion, tagClass: 'bg-amber-100 text-amber-900', body: <RichText text={tr.guidesTurfgrassesEGPoaPratensis} onFootnote={scrollToFootnote} /> },
    { id: 'role-ANTIFUNGAL', icon: ShieldCheck, iconClass: 'text-indigo-600', title: tr.roleAntifungal, tag: tr.guideTagAntifungalBadge, tagClass: 'bg-indigo-100 text-indigo-900', body: <RichText text={tr.guidesFungalPathogensLikeAppleScab} onFootnote={scrollToFootnote} /> },
    { id: 'role-BIOMASS_PRODUCER', icon: Scissors, iconClass: 'text-emerald-600', title: tr.roleBiomassProducer, tag: tr.guideTagInSituMulch, tagClass: 'bg-emerald-100 text-emerald-900', body: <RichText text={tr.guidesRatherThanImportingBagsPlastic} onFootnote={scrollToFootnote} /> },
    { id: 'role-EDIBLE_UNDERSTORY', icon: HeartHandshake, iconClass: 'text-amber-600', title: tr.roleEdibleUnderstory, tag: tr.guideTagMultiTierYields, tagClass: 'bg-amber-100 text-amber-900', body: tr.guidesPermaculturePrioritizesMultiFunctional }
  ];

  return (
    <div className="flex-1 w-full bg-stone-50 text-stone-900 font-sans selection:bg-forest-200 py-4 sm:py-6">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 w-full space-y-8">
        <div className="border-b border-stone-200 pb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-50 border border-forest-200 text-forest-800 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-forest-600" />
            <span>{tr.guidesPeerReviewedPermacultureScience}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {tr.guidesTitle}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-3xl leading-relaxed">
            {tr.guidesSubtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-stone-200 pb-px">
            {GUIDE_TABS.map(({ id, icon: TabIcon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleSelectTab(id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === id
                    ? 'bg-forest-600 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tr[label]}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'roles' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2.5">
                <Sparkles className="w-6 h-6 text-forest-600" />
                <span>{tr.guidesEcologicalMechanics9PlantRoles}</span>
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                {tr.guidesNaturalEcosystemsPlantsDoNot}
              </p>

              <div className="grid grid-cols-1 gap-6 pt-4">
                {roles.map(({ id, icon: RoleIcon, iconClass, title, tag, tagClass, body }, i) => (
                  <div key={id} id={id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-2 scroll-mt-24 transition-all">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                        <RoleIcon className={`w-4 h-4 ${iconClass}`} />
                        {`${i + 1}. `}{title}
                      </h3>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${tagClass}`}>
                        {tag}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guild_design' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2.5">
                <TreePine className="w-6 h-6 text-forest-600" />
                <span>{tr.guidesStepStepGuildDesignMasterclass}</span>
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                {tr.guidesSuccessfulPermacultureGuildEngineered}
              </p>

              <div className="space-y-6 pt-2">
                <GuideStep id="guide-star-plants" step={1} title={tr.guidesSelectKeystoneStarPlant}>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    <RichText text={tr.guidesDetermineMatureCanopyRadiusR} onFootnote={scrollToFootnote} />
                  </p>
                </GuideStep>

                <GuideStep id="guide-sectors" step={2} title={tr.guidesSolarSectoringAspectOrientation}>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    <RichText text={tr.guidesNorthernHemisphereSouthernArcReceives} onFootnote={scrollToFootnote} />
                  </p>
                </GuideStep>

                <GuideStep id="guide-zonation" step={3} title={tr.guidesEnforce4ConcentricRadialZones}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    {[
                      ['bg-rose-50 border border-rose-200', 'text-rose-900', tr.guidesZone0000, tr.guidesKeepCompletelyBareMulchPlants],
                      ['bg-amber-50 border border-amber-200', 'text-amber-900', tr.guidesZone1031, tr.guidesDenseMonocotBulbRingDaffodils],
                      ['bg-sky-50 border border-sky-200', 'text-sky-900', tr.guidesZone210M, tr.guidesDeepTaprootDynamicAccumulatorsComfrey],
                      ['bg-emerald-50 border border-emerald-200', 'text-emerald-900', tr.guidesZone3Radius07, tr.guidesActiveDripLineFeederRoot]
                    ].map(([boxClass, headClass, zone, text]) => (
                      <div key={zone} className={`p-3 rounded-xl ${boxClass}`}>
                        <strong className={`${headClass} block font-bold mb-1`}>{zone}</strong>
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </GuideStep>

                <GuideStep id="guide-harvest-ladder" step={4} title={tr.guidesPreserveSouthwestHarvestWedge215}>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {tr.guidesNeverPlantThornyBerryShrubs}
                  </p>
                </GuideStep>

                <GuideStep id="guide-soil-succession" step={5} title={tr.guidesSoilTextureMatchingEcological}>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {tr.guidesMatchPlantsYourSoilTexture}
                  </p>
                </GuideStep>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chop_and_drop' && (
          <div id="chop-overview" className="space-y-8 animate-in fade-in duration-200 scroll-mt-24">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
                  <Scissors className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{tr.guidesCompletePracticalFieldManual}</span>
                </div>
                <h2 className="text-2xl font-bold text-stone-900">
                  {tr.guidesTabChopAndDrop}
                </h2>
                <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
                  {tr.guidesChopDropEnginePermacultureFertility}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 pt-4">
                <ChopCard
                  tr={tr}
                  id="chop-plant-comfrey"
                  name={tr.guidesRussianComfreyBocking14}
                  latin={tr.guidesSymphytumXUplandicumSterileCultivar}
                  badge={tr.guides34CutsSeasonHigh}
                  cut={tr.guidesCutJustAsFlowerBuds}
                  much={tr.guidesCutAllLargeOuterLeaves}
                  spread={tr.guidesSpreadEvenlyAs510}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-white-clover"
                  name={tr.guidesWhiteClover}
                  latin={tr.guidesTrifoliumRepensLivingMulchLegume}
                  badge={tr.guides23CutsSeasonHigh}
                  cut={tr.guidesMowShearEarlySummerAfter}
                  much={tr.guidesCutTop5070Aboveground}
                  spread={<RichText text={tr.guidesLeaveClippingsSituGroundRake} onFootnote={scrollToFootnote} />}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-willow"
                  name={tr.guidesBasketWillow}
                  latin={tr.guidesSalixViminalisRamialChippedWood}
                  badge={tr.guidesAnnualWinterCoppiceFungalHumus}
                  cut={tr.guidesCoppiceLateWinterFebruaryMarch}
                  much={tr.guidesCoppiceAll1YearRods}
                  spread={tr.guidesChopTwigsInto510}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-goumi"
                  name={tr.guidesGoumiBerry}
                  latin={tr.guidesElaeagnusMultifloraActinorhizalFrankia}
                  badge={tr.guides2PruningsSeasonNitrogenMulch}
                  cut={tr.guidesPruneLateSpringAfterInitial}
                  much={tr.guidesPruneBack2535Vigorous}
                  spread={tr.guidesChopLeavesTenderTwigsSpread}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-yarrow"
                  name={tr.guidesCommonYarrow}
                  latin={tr.guidesAchilleaMillefoliumDynamicAccumulator}
                  badge={tr.guidesMidSummerAutumnSulfurCopper}
                  cut={tr.guidesCutBackImmediatelyAfterPrimary}
                  much={tr.guidesCutSpentFlowerStemsTall}
                  spread={tr.guidesSpreadFinelyAcrossZone2}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-horseradish"
                  name={tr.guidesHorseradish}
                  latin={tr.guidesArmoraciaRusticanaAntifungal}
                  badge={tr.guides23LeafCutsAllyl}
                  cut={tr.guidesHarvestMatureOuterLeaves2}
                  much={tr.guidesCutOuter5060Foliage}
                  spread={tr.guidesCrushLeavesSlightlyHandSpread}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-borage"
                  name={tr.guidesBorageStarflower}
                  latin={tr.guidesBoragoOfficinalisRapidBiomassDynamic}
                  badge={tr.guidesSummerAutumnHighSiliconPotassium}
                  cut={tr.guidesCutDuringPeakFloweringMid}
                  much={tr.guidesCutTop70LushVegetative}
                  spread={tr.guidesSpreadAcrossZone2Zone}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-lupine"
                  name={tr.guidesWildPerennialLupine}
                  latin={tr.guidesLupinusPerennisPolyphyllusPerennial}
                  badge={tr.guidesMidSummerPreSeedCut}
                  cut={tr.guidesCutMidSummerJuneJuly}
                  much={tr.guidesCutFlowerStalks60Foliage}
                  spread={tr.guidesSpreadZone2Zone3}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-elderberry"
                  name={tr.guidesBlackElderberry}
                  latin={tr.guidesSambucusNigraHighYieldSoft}
                  badge={tr.guidesLateAutumnPruningPotassiumRich}
                  cut={tr.guidesPruneAnnuallyLateAutumnOctober}
                  much={tr.guidesPruneOutSpent3Year}
                  spread={tr.guidesChopPithyStemsInto5}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-aster"
                  name={tr.guidesNewEnglandAster}
                  latin={tr.guidesSymphyotrichumNovaeAngliaeLateAutumn}
                  badge={tr.guidesLateAutumnCutbackWinterThermal}
                  cut={tr.guidesChopDownLateAutumnNovember}
                  much={tr.guidesCutEntireDenseStemCluster}
                  spread={tr.guidesChopTallStemsInto10}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-hosta"
                  name={tr.guidesPlantainLilyHosta}
                  latin={tr.guidesHostaSieboldianaFleshyEarthwormHumus}
                  badge={tr.guidesPostFrostAutumnCollapseFast}
                  cut={tr.guidesChopBackLateAutumnAfter}
                  much={tr.guidesRemoveAllCollapsedOuterLeaves}
                  spread={tr.guidesLayFlatZone2Shade}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-nasturtium"
                  name={tr.guidesGardenNasturtium}
                  latin={tr.guidesTropaeolumMajusRapidTrapCrop}
                  badge={tr.guidesAutumnFrostCollapseGlucosinolatesPest}
                  cut={tr.guidesChopTrailingVegetativeRunnersLate}
                  much={tr.guidesCutAllTrailingSurfaceVines}
                  spread={tr.guidesSpreadAsMoist58}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-sweet-potato"
                  name={tr.guidesSweetPotato}
                  latin={tr.guidesIpomoeaBatatasExplosiveUnderstoryVine}
                  badge={tr.guidesAutumnPreHarvestChopRich}
                  cut={tr.guidesChopTrailingVinesAutumnSeptember}
                  much={tr.guidesSeverAllVines510}
                  spread={tr.guidesChopLongVinesInto10}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-tansy"
                  name={tr.guidesCommonTansy}
                  latin={tr.guidesTanacetumVulgareInsecticidalDynamic}
                  badge={tr.guidesMidSummerAutumnPotassiumThujone}
                  cut={tr.guidesChopBackMidSummerAugust}
                  much={tr.guidesCutFloweringStemsDown10}
                  spread={<RichText text={tr.guidesSpreadAcrossZone2Outer} onFootnote={scrollToFootnote} />}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-southernwood"
                  name={tr.guidesSouthernwood}
                  latin={tr.guidesArtemisiaAbrotanumTerpeneRichWoody}
                  badge={tr.guidesEarlySpringHardCoppiceAbrotanin}
                  cut={tr.guidesCutBackHardLateWinter}
                  much={tr.guidesCutPreviousYearSSemi}
                  spread={tr.guidesChopFinelyDistributeAroundOuter}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-chives"
                  name={tr.guidesCommonChives}
                  latin={tr.guidesAlliumSchoenoprasumAlliumBarrier}
                  badge={tr.guides23SummerShearsQuick}
                  cut={tr.guidesShear23TimesBetween}
                  much={tr.guidesCutTop70FoliageDown}
                  spread={tr.guidesScatterClippingsDirectlyAlongZone}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-tea-sinensis"
                  name={tr.guidesChineseTeaBush}
                  latin={tr.guidesCamelliaSinensisVarSinensisAcidifying}
                  badge={tr.guidesLateSpringSummerTanninsAcidic}
                  cut={tr.guidesPerformPluckPruningLateSpring}
                  much={tr.guidesTrimTop1015Cm}
                  spread={tr.guidesDropPruningsUnderAcidLoving}
                >
                  <div className="pt-1 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => scrollToSection('tea_sinensis', 'tea-sinensis-pruning-guide')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Scissors className="w-3.5 h-3.5 text-teal-700" />
                      <span>{tr.guidesOpenCompleteTeaPruningManual}</span>
                    </button>
                  </div>
                </ChopCard>
                <ChopCard
                  tr={tr}
                  id="chop-plant-hyssop"
                  name={tr.guidesHyssop}
                  latin={tr.guidesHyssopusOfficinalisAntimicrobial}
                  badge={tr.guidesAutumnPostBloomPrunePinocamphone}
                  cut={tr.guidesPruneBackMidAutumnOctober}
                  much={tr.guidesCutBackSoftFloweringShoots}
                  spread={tr.guidesChopScatterAcrossZone2}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-sage"
                  name={tr.guidesCommonSage}
                  latin={tr.guidesSalviaOfficinalisAntifungal}
                  badge={tr.guidesMidSummerPostBloomCut}
                  cut={tr.guidesPruneMidSummerJulyAfter}
                  much={tr.guidesCutBackSoftFloweringStems}
                  spread={
                    <RichText
                      text={tr.guidesScatterClippingsAcrossZone2}
                      slots={[
                        <button
                          type="button"
                          onClick={() => scrollToFootnote('fn-15')}
                          className="inline-flex items-center text-forest-700 hover:text-forest-900 font-bold underline font-mono text-[11px]"
                          title={tr.guidesViewResearchPaperCitation}
                        >
                          [15]
                        </button>
                      ]}
                    />
                  }
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-elaeagnus"
                  name={tr.guidesAutumnOliveSilverberry}
                  latin={tr.guidesElaeagnusUmbellataActinorhizalFrankia}
                  badge={tr.guidesSummerWinterCoppiceHighNitrogen}
                  cut={tr.guidesPruneVigorouslyLateWinterFebruary}
                  much={tr.guidesCutBack2535Long}
                  spread={tr.guidesChopBranchesFoliageSpreadAcross}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-seabuckthorn"
                  name={tr.guidesSeaBuckthorn}
                  latin={tr.guidesHippophaeRhamnoidesActinorhizalShrub}
                  badge={tr.guidesAutumnBerryPruningNitrogenRodent}
                  cut={tr.guidesPruneDuringFruitHarvestAutumn}
                  much={tr.guidesRemove2030DenseFruiting}
                  spread={tr.guidesShredChopThornyBranchesInto}
                />
                <ChopCard
                  tr={tr}
                  id="chop-tree-alder"
                  name={tr.guidesBlackAlder}
                  latin={tr.guidesAlnusGlutinosaKeystoneActinorhizal}
                  badge={tr.guidesWinterCoppiceSummerPollardUp}
                  cut={tr.guidesCoppice24YearRotational}
                  much={tr.guidesCoppiceAllUprightPolesDown}
                  spread={tr.guidesChipBranches7CmDiameter}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-hemp"
                  name={tr.guidesIndustrialHemp}
                  latin={tr.guidesCannabisSativaLignocellulosicCarbon}
                  badge={tr.guides12CutsSeasonHigh}
                  cut={tr.guidesPruneMidSummerJulyBefore}
                  much={tr.guidesSummerTopMainStalks30}
                  spread={tr.guidesChopFibrousStalksInto10}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-alfalfa"
                  name={tr.guidesAlfalfaLucerne}
                  latin={tr.guidesMedicagoSativaDeepTaprootNitrogen}
                  badge={tr.guides34CutsSeasonUltra}
                  cut={tr.guidesCutAtEarlyBudStage}
                  much={tr.guidesCutBack57Cm}
                  spread={<RichText text={tr.guidesSpreadGreenMulchDirectlyAcross} onFootnote={scrollToFootnote} />}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-nettle"
                  name={tr.guidesStingingNettle}
                  latin={tr.guidesUrticaDioicaMineralMiningIron}
                  badge={tr.guides23CutsSeasonSupercharged}
                  cut={tr.guidesWearThickGlovesPruneLush}
                  much={tr.guidesChopEntireStemsDown10}
                  spread={tr.guidesLayFreshlyWiltedFoliageAround}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-lovage"
                  name={tr.guidesLovage}
                  latin={tr.guidesLevisticumOfficinaleGiantUmbellifer}
                  badge={tr.guides23CutsSeasonHigh2}
                  cut={tr.guidesHarvestOuterBulkyLeafStalks}
                  much={tr.guidesChopBackUp5060}
                  spread={tr.guidesChopHollowStalksIntoCoarse}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-linden"
                  name={tr.guidesSmallLeavedLinden}
                  latin={tr.guidesTiliaCordataPollardedHedgerowTree}
                  badge={tr.guidesWinterPollardLateJulyLeaf}
                  cut={tr.guidesPollardCoppiceEvery24}
                  much={tr.guidesCutAllRodsBackPollard}
                  spread={<RichText text={tr.guidesSpreadLeavesFineTwigs5} onFootnote={scrollToFootnote} />}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-tea-shade-trees"
                  name={tr.guidesTeaShadeTreesNepaleseAlder}
                  latin={tr.guidesAlnusNepalensisAlbiziaChinensisLopped}
                  badge={tr.guidesDrySeasonLopping2535}
                  cut={tr.guidesLopSideBranchesPruningSaw}
                  much={<RichText text={tr.guidesThinUntilRoughly2535} onFootnote={scrollToFootnote} />}
                  spread={<RichText text={tr.guidesLeaveLeavesTwigsPodsBetween} onFootnote={scrollToFootnote} />}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'allelopathy' && (
          <div id="allelopathy" className="space-y-8 animate-in fade-in duration-200 scroll-mt-24">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold mb-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>{tr.guidesChemicalEcologyRhizosphereBuffers}</span>
                </div>
                <h2 className="text-2xl font-bold text-stone-900">
                  {tr.guidesAllelopathyRootExudatesSoilAntagonisms}
                </h2>
                <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
                  {tr.guidesWhileMostPermacultureCompanions}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 pt-2">
                <div id="allelo-juglone" className="p-6 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-3 scroll-mt-24">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/70 pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-rose-600" />
                        <span>
                          {tr.guides1WalnutJugloneToxicityJuglans}
                        </span>
                      </h3>
                      <p className="text-xs text-stone-500 italic">
                        {tr.guides5Hydroxy14Naphthoquinone}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold">
                      {tr.guidesBuffer200MTrees}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    <RichText text={tr.guidesOurCentralStarTreePersian} onFootnote={scrollToFootnote} />
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-3.5 rounded-xl bg-white border border-rose-200">
                      <strong className="text-rose-900 font-bold block mb-1">
                        {tr.guidesStrictlyJugloneSensitiveSpeciesOur}
                      </strong>
                      <p className="text-stone-600 leading-relaxed">
                        <RichText text={tr.guidesStarPlantsAppleMalusDomestica} onFootnote={scrollToFootnote} />
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white border border-emerald-200">
                      <strong className="text-emerald-900 font-bold block mb-1">
                        {tr.guidesJugloneTolerantAlliesWalnutGuilds}
                      </strong>
                      <p className="text-stone-600 leading-relaxed">
                        <RichText text={tr.guidesStarSubCanopyPartnersBlack} onFootnote={scrollToFootnote} />
                      </p>
                    </div>
                  </div>
                </div>

                <div id="allelo-allium-legume" className="p-6 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-3 scroll-mt-24">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/70 pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-600" />
                        <span>
                          {tr.guides2AlliumOrganosulfursVsSymbiotic}
                        </span>
                      </h3>
                      <p className="text-xs text-stone-500 italic">
                        {tr.guidesAllicinDiallylDipropylDisulfide}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                      {tr.guidesAutoSolvedPlannerBuffer1}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    <RichText text={tr.guidesAlliumSpeciesOurCatalogChives} onFootnote={scrollToFootnote} />
                  </p>
                  <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-950">
                    <strong className="font-bold block mb-0.5">
                      {tr.guidesHowPflanzengildeSpatialEngineAuto}
                    </strong>
                    {tr.guidesWhenYouSelectBothAlliums}
                  </div>
                </div>

                <div id="allelo-fennel-wormwood" className="p-6 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-3 scroll-mt-24">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/70 pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-600" />
                        <span>
                          {tr.guides3BronzeFennelFoeniculumVulgare}
                        </span>
                      </h3>
                      <p className="text-xs text-stone-500 italic">
                        {tr.guidesTransAnetholeFenchoneAbsinthin}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                      {tr.guidesAutoIsolatedZone4Perimeter}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1.5">
                      <strong className="text-stone-900 font-bold block text-sm">
                        {tr.guidesBronzeFennel15M}
                      </strong>
                      <p className="text-stone-600 leading-relaxed">
                        <RichText text={tr.guidesBronzeFennelFoeniculumVulgareOne} onFootnote={scrollToFootnote} />
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1.5">
                      <strong className="text-stone-900 font-bold block text-sm">
                        {tr.guidesWormwood12MClearance}
                      </strong>
                      <p className="text-stone-600 leading-relaxed">
                        <RichText text={tr.guidesWormwoodArtemisiaAbsinthiumSynthesizes} onFootnote={scrollToFootnote} />
                      </p>
                    </div>
                  </div>
                </div>

                <div id="allelo-ph-and-rust" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-24">
                  <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-stone-900">
                        {tr.guides4EdaphicSoilPhAntagonism}
                      </h3>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        {tr.guidesPh45VsPh}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      <RichText text={tr.guidesObligateAcidophilesCalcifugesHighbush} onFootnote={scrollToFootnote} />
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-stone-900">
                        {tr.guides5HeteroeciousRustsVerticilliumSoil}
                      </h3>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900">
                        {tr.guidesLandscapeBuffers}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      <RichText text={tr.guidesPearTrellisRustGymnosporangiumSabinae} onFootnote={scrollToFootnote} />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pests' && (
          <div id="pests" className="space-y-8 animate-in fade-in duration-200 scroll-mt-24">
            <PestEvidenceGuide language={language} />
          </div>
        )}

        {activeTab === 'shade_and_stars' && (
          <div id="shade_and_stars" className="space-y-8 animate-in fade-in duration-200 scroll-mt-24">
            <div id="shade-mechanics" className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6 scroll-mt-24">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
                  <Sun className="w-3.5 h-3.5 text-amber-600" />
                  <span>{tr.guidesCanopyLightGeometryPhenologicalEscape}</span>
                </div>
                <h2 className="text-2xl font-bold text-stone-900">
                  {tr.guides1ShadeDynamicsSolarSectors}
                </h2>
                <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
                  <RichText text={tr.guidesAsTreeCrownsExpandMultiple} onFootnote={scrollToFootnote} />
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <strong className="text-amber-950 font-bold text-sm flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span>{tr.guidesFullSunSouthernSkirtSouth}</span>
                  </strong>
                  <p className="text-stone-700 leading-relaxed">
                    <RichText text={tr.guidesOutsideCanopyDripLineD} onFootnote={scrollToFootnote} />
                  </p>
                  <div className="pt-1 text-[11px] text-amber-900 font-semibold">
                    {tr.guidesSystemExamplesEnglishLavenderRosemary}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <strong className="text-emerald-950 font-bold text-sm flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-emerald-600" />
                    <span>{tr.guidesPolarShadowConeMultiCrown}</span>
                  </strong>
                  <p className="text-stone-700 leading-relaxed">
                    <RichText text={tr.guidesOurEngineFlagsCoordinateAs} onFootnote={scrollToFootnote} />
                  </p>
                  <div className="pt-1 text-[11px] text-emerald-900 font-semibold">
                    {tr.guidesSystemExamplesSweetWoodruffLungwort}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-2">
                  <strong className="text-sky-950 font-bold text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <span>{tr.guidesVernalPhenologicalShadeEscape}</span>
                  </strong>
                  <p className="text-stone-700 leading-relaxed">
                    <RichText text={tr.guidesDeciduousTreesWalnutApplePear} onFootnote={scrollToFootnote} />
                  </p>
                  <div className="pt-1 text-[11px] text-sky-900 font-semibold">
                    {tr.guidesSystemExamplesSnowdropGalanthusWinter}
                  </div>
                </div>
              </div>
            </div>

            <div id="dual-role-stars" className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6 scroll-mt-24">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-50 border border-forest-200 text-forest-800 text-xs font-semibold mb-2">
                  <TreePine className="w-3.5 h-3.5 text-forest-600" />
                  <span>{tr.guidesKeystoneTreesBuiltEcologicalRoles}</span>
                </div>
                <h2 className="text-2xl font-bold text-stone-900">
                  {tr.guides2DualRoleStarPlants}
                </h2>
                <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
                  {tr.guidesMultiTreeFoodForestNot}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {[
                  { title: tr.guidesBlackAlderAlnusGlutinosa, tag: tr.guidesNitrogenFixerBiomass, tagClass: 'bg-emerald-100 text-emerald-900', text: tr.guidesRegisteredAsCentralNitrogenFixing, slots: [<code>plant-alder</code>] },
                  { title: tr.guidesSeaBuckthornHippophaeRhamnoides, tag: tr.guidesStarCompanionDualPlant, tagClass: 'bg-emerald-100 text-emerald-900', text: tr.guidesAvailableBothAsCentralStar },
                  { title: tr.guidesSmallLeavedLindenTiliaCordata, tag: tr.guidesPollinatorCaAccumulator, tagClass: 'bg-amber-100 text-amber-900', text: tr.guidesRegisteredAsStarTreeR, slots: [<code>plant-linden</code>] },
                  { title: tr.guidesBlackElderberrySambucusNigra, tag: tr.guidesStarCompanionDualPlant, tagClass: 'bg-emerald-100 text-emerald-900', text: tr.guidesAvailableBothAsStarBerry },
                  { title: tr.guidesRedBlackCurrantRibesRubrum, tag: tr.guidesStarShadeUnderstory, tagClass: 'bg-emerald-100 text-emerald-900', text: tr.guidesBothSpeciesServeAsCompact },
                  { title: tr.guidesIndustrialHempTeaCamelliaRhododendron, tag: tr.guidesStarCompanionDualPlants, tagClass: 'bg-sky-100 text-sky-900', text: tr.guidesIndustrialHempCannabisSativaFunctions }
                ].map(({ title, tag, tagClass, text, slots }) => (
                  <div key={title} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-sm text-stone-900">{title}</h3>
                      <span className={`px-2 py-0.5 rounded-full ${tagClass} text-[11px] font-bold`}>{tag}</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                      <RichText text={text} onFootnote={scrollToFootnote} slots={slots} />
                    </p>
                  </div>
                ))}
              </div>

              <div id="dual-companion-sharing" className="p-5 rounded-2xl bg-forest-50/70 border border-forest-200 space-y-3 scroll-mt-24">
                <h3 className="font-bold text-base text-forest-950 flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-forest-700" />
                  <span>
                    {tr.guides3EmpiricalBenefitRadiiCompanion}
                  </span>
                </h3>
                <p className="text-xs text-stone-700 leading-relaxed">
                  <RichText text={tr.guidesWhenYouPlaceMultipleStar} onFootnote={scrollToFootnote} />
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
                  {[
                    { border: 'border-forest-200', head: 'text-forest-900', radius: tr.guides45MRadiusMax, text: tr.guidesInsectariesParasitoidNectarHubsBronze },
                    { border: 'border-forest-200', head: 'text-forest-900', radius: tr.guides25M40, text: tr.guidesActinorhizalNitrogenFixersGoumiBerry },
                    { border: 'border-forest-200', head: 'text-forest-900', radius: tr.guides18MRadius, text: tr.guidesDynamicAccumulatorsHerbaceousLegumes },
                    { border: 'border-rose-200', head: 'text-rose-900', radius: tr.guides08MCollarNever, text: tr.guidesTrunkCollarBulbsAlliumsDaffodil }
                  ].map(({ border, head, radius, text }) => (
                    <div key={radius} className={`p-3 rounded-xl bg-white border ${border}`}>
                      <strong className={`${head} font-bold block mb-0.5`}>{radius}</strong>
                      <span className="text-stone-600">
                        <RichText text={text} onFootnote={scrollToFootnote} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tea_sinensis' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div id="tea-sinensis-botany" className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-stone-100 pb-5">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 mb-2">
                    <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                    {tr.guidesSeedCupAgronomyProcessingMasterclass}
                  </span>
                  <h2 className="text-2xl font-bold text-stone-900">
                    {tr.guidesChineseTeaBushCamelliaSinensis}
                  </h2>
                  <p className="text-sm text-stone-600 mt-1.5 leading-relaxed max-w-3xl">
                    <RichText text={tr.guidesEveryTrueTeaEarthGreen} onFootnote={scrollToFootnote} slots={[<code>tree-tea-sinensis</code>, <code>plant-tea-sinensis</code>]} />
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectTab('tea_assamica')}
                  className="shrink-0 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Sprout className="w-4 h-4 text-amber-700" />
                  <span>{tr.guidesCompareAssamTeaVarAssamica}</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-stone-50 to-amber-50/60 border border-emerald-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                      {tr.guidesPrimaryVideoSensoryReference}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-1.5">
                      {tr.guidesWuMountainTeaMasterclassTea}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {tr.guidesOurProcessingWorkflowsSensoryQuality}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <a
                      href="https://wumountaintea.com/a-masterclass-on-tea/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{tr.guidesWuMountainTeaMasterclassPdfs}</span>
                    </a>
                    <a
                      href="https://www.youtube.com/playlist?list=PLeK5s_4Pb8528z06MYcc_XMfd5V7ZJmUv"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{tr.guides8ChapterYoutubePlaylist}</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-emerald-200/60 text-xs">
                  <div className="space-y-1.5">
                    <div className="font-bold text-stone-800">
                      {tr.guidesKeyVideoChaptersReferenced}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        ['lAYRZeDJ4Pc', tr.guidesCh16TeaTypes],
                        ['munJOh-19yk', tr.guidesCh2TeaBiologyCultivation],
                        ['LqDk2swTiB8', tr.guidesCh3TeaProcessingFull],
                        ['kiqsrAzgbZ8', tr.guidesCh45FactorQuality]
                      ].map(([videoId, label]) => (
                        <a key={videoId} href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-forest-400 text-stone-700 hover:text-forest-800 font-medium inline-flex items-center gap-1">
                          <ExternalLink className="w-3 h-3 text-forest-600" />
                          <span>{label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="font-bold text-stone-800">
                      {tr.guidesOfficialWuMountainTeaAssessment}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        ['General-Guide-to-Tea-Tasting-1.pdf', tr.guidesTastingGuide],
                        ['Green-Tea-Assessment-Rubric.pdf', tr.guidesGreenPdf],
                        ['White-Tea-Assessment-Rubric.pdf', tr.guidesWhitePdf],
                        ['Yellow-Tea-Assessment-Rubric.pdf', tr.guidesYellowPdf],
                        ['Oolong-Tea-Assessment-Rubric.pdf', tr.guidesOolongPdf],
                        ['Black-Tea-Assessment-Rubric.pdf', tr.guidesBlackPdf],
                        ['Dark-Tea-Assessment-Rubric.pdf', tr.guidesDarkPdf]
                      ].map(([file, label]) => (
                        <a key={file} href={WU_UPLOADS + file} target="_blank" rel="noopener noreferrer" className="px-2 py-1 rounded-lg bg-white border border-stone-200 hover:border-amber-400 text-stone-700 font-medium inline-flex items-center gap-1">
                          <ExternalLink className="w-3 h-3 text-amber-600" />
                          <span>{label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-forest-600" />
                  <span>
                    {tr.guides1EvolutionaryEcologyLeafBiochemistry}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  <RichText text={tr.guidesWholeGenomeSequencingDemonstratesThat} onFootnote={scrollToFootnote} />
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        {tr.guides1522DryWeight}
                      </span>
                      <span className="text-xs font-mono text-stone-500">EGCG / ECG / EC</span>
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {tr.guides1TeaPolyphenolsFlavanolsCatechins}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      <RichText text={tr.guidesSynthesizedLeafChloroplastsVia} onFootnote={scrollToFootnote} />
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
                        {tr.guides1545Dry}
                      </span>
                      <span className="text-xs font-mono text-stone-500">γ-Glutamylethylamide</span>
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {tr.guides2LTheanineFreeAmino}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      <RichText text={tr.guidesNonProteinogenicAminoAcidAccounting} onFootnote={scrollToFootnote} slots={[<span className="font-mono">NH4+</span>]} />
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        {tr.guides2035Dry}
                      </span>
                      <span className="text-xs font-mono text-stone-500">1,3,7-Trimethylxanthine</span>
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {tr.guides3CaffeineSilveryLeafTrichomes}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      <RichText text={tr.guidesSynthesizedYoungLeavesAsAllelochemical} onFootnote={scrollToFootnote} />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div id="tea-sinensis-planting" className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-100 text-forest-800 mb-2">
                  <Compass className="w-3.5 h-3.5 text-forest-700" />
                  {tr.guidesSiteSelectionSoilGuildDesign}
                </span>
                <h3 className="text-xl font-bold text-stone-900">
                  {tr.guides2WhereHowPlantCamellia}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                  <RichText text={tr.guidesAsEvolvedSubCanopyForest} onFootnote={scrollToFootnote} />
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-forest-600" />
                    <span>{tr.guidesObligateAcidophileAluminumAccumulator}</span>
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    <RichText text={tr.guidesTeaObligateCalcifugeRequiringDeep} onFootnote={scrollToFootnote} slots={[<span className="font-mono">CaCO3</span>, <span className="font-mono">Al3+</span>, <span className="font-mono">NH4+</span>, <span className="font-mono">NO3-</span>, <span className="font-mono">H+</span>]} />
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span>{tr.guides3050DappledCanopyShade}</span>
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    <RichText text={tr.guidesPlantGentleEastSoutheastFacing} onFootnote={scrollToFootnote} />
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-forest-700" />
                  <span>
                    {tr.guidesOptimalPermacultureGuildCompanionsOur}
                  </span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-1.5">
                    <div className="font-bold text-emerald-900">
                      {tr.guidesSynergisticAcidLovingGuildPartners}
                    </div>
                    <ul className="space-y-1 text-stone-700 list-disc list-inside leading-relaxed">
                      <li>
                        <strong>{tr.guidesOverstoryCanopyNFixation}</strong>{' '}
                        <RichText text={tr.guidesBlackAlderPlantAlderAs} onFootnote={scrollToFootnote} />
                      </li>
                      <li>
                        <strong>{tr.guidesAcidicShrubsGroundcoversSarDefense}</strong>{' '}
                        <RichText text={tr.guidesRhododendronPlantRhododendron} onFootnote={scrollToFootnote} />
                      </li>
                      <li>
                        <strong>{tr.guidesMulchMakersRootCollarShield}</strong>{' '}
                        <RichText text={tr.guidesComfreyBocking14PlantComfrey} onFootnote={scrollToFootnote} />
                      </li>
                    </ul>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-rose-200 space-y-1.5">
                    <div className="font-bold text-rose-900">
                      {tr.guidesIncompatibleAntagonistsNeverInterplant}
                    </div>
                    <ul className="space-y-1 text-stone-700 list-disc list-inside leading-relaxed">
                      <li>
                        <strong>{tr.guidesJugloneProducers}</strong>{' '}
                        <RichText text={tr.guidesWalnutTreeWalnutJuglansRegia} onFootnote={scrollToFootnote} />
                      </li>
                      <li>
                        <strong>{tr.guidesCalciumPumpingTreesAlkalineAsh}</strong>{' '}
                        <RichText text={tr.guidesAvoidPlantingDirectlyUnderSmall} onFootnote={scrollToFootnote} />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div id="tea-sinensis-care" className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-900 mb-2">
                  <Scissors className="w-3.5 h-3.5 text-teal-700" />
                  {tr.guidesPruningShadingPluckingArchitecture}
                </span>
                <h3 className="text-xl font-bold text-stone-900">
                  {tr.guides3CareMultiYearFormative}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-forest-800">
                      {tr.guidesFormativeMaintenancePruning}
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {tr.guidesBuildingWaistHighPluckingTable}
                    </h4>
                    <ul className="text-xs text-stone-600 space-y-1.5 leading-relaxed list-disc list-inside">
                      <li>
                        <strong>{tr.guidesYears12EstablishRoots}</strong>{' '}
                        <RichText text={tr.guidesDoNotHarvestLeavesPinch} onFootnote={scrollToFootnote} slots={[<button
                              type="button"
                              onClick={() => scrollToSection('tea_sinensis', 'tea-sinensis-pruning-guide')}
                              className="text-teal-800 font-bold underline decoration-teal-500 underline-offset-2 hover:text-teal-950 cursor-pointer"
                            >{tr.guidesFirstCenteringCutDingxingXiujian}</button>]} />
                      </li>
                      <li>
                        <strong>{tr.guidesYears34ScaffoldWidening}</strong>{' '}
                        <RichText text={tr.guidesHeadBackScaffoldsAt35} slots={[<button
                              type="button"
                              onClick={() => scrollToSection('tea_sinensis', 'tea-pruning-stage-3')}
                              className="text-teal-800 font-bold underline decoration-teal-500 underline-offset-2 hover:text-teal-950 cursor-pointer"
                            >{tr.guidesPluckingTableCaizhaiMian}</button>]} />
                      </li>
                      <li>
                        <strong>{tr.guidesAnnualSkiffingRejuvenation}</strong>{' '}
                        <RichText text={tr.guidesLightlyTrimTop35} slots={[<button
                              type="button"
                              onClick={() => scrollToSection('tea_sinensis', 'tea-pruning-crows-feet')}
                              className="text-teal-800 font-bold underline decoration-teal-500 underline-offset-2 hover:text-teal-950 cursor-pointer"
                            >{tr.guidesCrowSFeetJizhaoZhi}</button>]} />
                      </li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollToSection('tea_sinensis', 'tea-sinensis-pruning-guide')}
                    className="mt-2 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Scissors className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>
                      {tr.guidesHowPruneStepStepDingxing}
                    </span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-teal-800">
                    {tr.guidesBiochemicalShadeManipulation}
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    {tr.guidesPreHarvestShadingKabusechaGyokuro}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    <RichText text={tr.guidesCraftUltraSavoryJapaneseStyle} onFootnote={scrollToFootnote} />
                  </p>
                  <ul className="text-xs text-stone-600 space-y-1 leading-relaxed list-disc list-inside">
                    <li>
                      <strong>Kabusecha:</strong>{' '}
                      {tr.guides5070Shade1014}
                    </li>
                    <li>
                      <strong>Gyokuro &amp; Tencha (Matcha):</strong>{' '}
                      {tr.guides6070Shade7Days}
                    </li>
                    <li>
                      <strong>{tr.guidesMetabolicEffect}</strong>{' '}
                      <RichText text={tr.guidesBlocksUvInducedConversionL} onFootnote={scrollToFootnote} />
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
                    {tr.guidesPluckingStandardsTiming}
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    {tr.guidesMatchingPluckYourTargetTea}
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-1.5 leading-relaxed list-disc list-inside">
                    <li>
                      <strong>{tr.guidesSingleApicalBudDanYa}</strong>{' '}
                      {tr.guidesEarlySpringPreQingmingLate}
                    </li>
                    <li>
                      <strong>{tr.guides1Bud12Leaves}</strong>{' '}
                      {tr.guidesGoldStandardLongjingBiLuo}
                    </li>
                    <li>
                      <strong>{tr.guidesMatureOpenShootBanjiKai}</strong>{' '}
                      <RichText text={tr.guidesWaitUntilTerminalBudPauses} onFootnote={scrollToFootnote} />
                    </li>
                  </ul>
                </div>
              </div>

              <div
                id="tea-sinensis-pruning-guide"
                className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-teal-50/70 via-white to-emerald-50/40 border border-teal-200 space-y-5 scroll-mt-24 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-200/80 pb-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-teal-100 text-teal-900 mb-1">
                      <Scissors className="w-3.5 h-3.5 text-teal-700" />
                      {tr.guidesStepStepPracticalPruningManual}
                    </span>
                    <h4 className="text-base sm:text-lg font-extrabold text-stone-900">
                      {tr.guides3aHowExecuteTeaPruning}
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white border border-teal-200 text-teal-900 text-xs font-mono font-bold self-start sm:self-center">
                    {tr.guides45OutwardBudCutFeb}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                  <div className="lg:col-span-7 p-4 rounded-xl bg-white border border-stone-200 space-y-2.5 text-xs">
                    <div className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                      <span>
                        {tr.guides1ExactCutGeometryWhere}
                      </span>
                    </div>
                    <ul className="space-y-2 text-stone-700 leading-relaxed list-disc list-inside">
                      <li>
                        <strong>{tr.guides45SlantedCutAwayFrom}</strong>{' '}
                        {tr.guidesLocateHealthyLeafNodeWhose}
                      </li>
                      <li>
                        <strong>{tr.guidesAlwaysLeaveMotherLeavesMutterblatter}</strong>{' '}
                        {tr.guidesUnlikeDeciduousFruitTreesEvergreen}
                      </li>
                      <li>
                        <strong>{tr.guidesToolChoiceBladeHygiene}</strong>{' '}
                        {tr.guidesUseSharpBypassHandPruners}
                      </li>
                    </ul>
                  </div>

                  <div className="lg:col-span-5 p-4 rounded-xl bg-stone-900 text-stone-100 border border-stone-800 flex flex-col justify-between">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-2">
                      {tr.guidesVisualSchema3StageDingxing}
                    </div>
                    <svg viewBox="0 0 360 215" className="w-full h-auto rounded-lg bg-stone-950/80 border border-stone-800 p-1" role="img" aria-label={tr.guidesTeaPruningDiagramAria}>
                      {/* ground + taproot */}
                      <line x1="15" y1="190" x2="235" y2="190" stroke="#78716c" strokeWidth="2" />
                      <text x="18" y="205" fill="#a8a29e" fontSize="9" fontFamily="monospace">0 cm ({tr.guidesSoilLine})</text>

                      <path d="M125 190 L125 212 M125 196 L112 208 M125 198 L138 209" stroke="#a16207" strokeWidth="2" fill="none" />

                      {/* formative cut heights */}
                      <line x1="20" y1="155" x2="230" y2="155" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 3" />
                      <text x="22" y="151" fill="#fbbf24" fontSize="8.5" fontWeight="bold" fontFamily="monospace">{tr.guidesDingxingStage1}</text>

                      <line x1="20" y1="120" x2="230" y2="120" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 3" />
                      <text x="22" y="116" fill="#7dd3fc" fontSize="8.5" fontWeight="bold" fontFamily="monospace">{tr.guidesDingxingStage2}</text>

                      <line x1="20" y1="95" x2="230" y2="95" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 3" />
                      <text x="22" y="91" fill="#d8b4fe" fontSize="8.5" fontWeight="bold" fontFamily="monospace">{tr.guidesDingxingStage3}</text>

                      {/* plucking table */}
                      <path d="M45 42 Q125 32 205 42" stroke="#10b981" strokeWidth="2.5" fill="none" />
                      <text x="48" y="26" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">
                        {tr.guidesPluckingTableCaizhaiMian70}
                      </text>

                      {/* trunk, then one scaffold tier per cut */}
                      <line x1="125" y1="190" x2="125" y2="155" stroke="#854d0e" strokeWidth="4.5" />
                      <path d="M125 155 L95 120 M125 155 L125 120 M125 155 L155 120" stroke="#a16207" strokeWidth="3" fill="none" />
                      <path d="M95 120 L72 95 M95 120 L105 95 M125 120 L118 95 M125 120 L134 95 M155 120 L146 95 M155 120 L178 95" stroke="#ca8a04" strokeWidth="2" fill="none" />
                      <path d="M72 95 L60 41 M72 95 L78 39 M105 95 L96 38 M105 95 L110 37 M118 95 L116 37 M134 95 L134 37 M146 95 L144 38 M146 95 L158 39 M178 95 L172 39 M178 95 L190 41" stroke="#22c55e" strokeWidth="1.5" fill="none" />

                      {/* inset: 45° cut above an outward bud */}
                      <rect x="245" y="18" width="105" height="178" rx="8" fill="#1c1917" stroke="#44403c" strokeWidth="1" />
                      <text x="253" y="34" fill="#fde68a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                        {tr.guides45CutDetail}
                      </text>
                      <line x1="292" y1="175" x2="292" y2="78" stroke="#a16207" strokeWidth="7" />
                      <line x1="292" y1="74" x2="292" y2="45" stroke="#57534e" strokeWidth="5" strokeDasharray="3 3" />
                      <line x1="278" y1="84" x2="308" y2="66" stroke="#f43f5e" strokeWidth="2.2" />
                      <text x="252" y="61" fill="#fda4af" fontSize="7.5" fontFamily="monospace">3–5 mm (45°)</text>
                      <path d="M295 92 Q312 80 315 72 Q304 75 295 86 Z" fill="#22c55e" />
                      <path d="M295 94 Q325 92 338 104 Q318 112 295 98 Z" fill="#15803d" />
                      <path d="M308 74 Q324 58 336 48" stroke="#34d399" strokeWidth="1.8" fill="none" />
                      <polygon points="338,46 331,48 335,53" fill="#34d399" />
                      <text x="252" y="132" fill="#86efac" fontSize="7.5" fontFamily="monospace">
                        {tr.guidesOutwardBud}
                      </text>
                      <text x="252" y="143" fill="#a8a29e" fontSize="7" fontFamily="monospace">
                        {tr.guidesOpensCrown}
                      </text>
                    </svg>
                    <p className="text-[11px] text-stone-300 mt-2 leading-snug">
                      <RichText text={tr.guidesEachLateWinterCutRemoves} onFootnote={scrollToFootnote} />
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-teal-700" />
                    <span>
                      <RichText text={tr.guides23StageFormativePruning} onFootnote={scrollToFootnote} />
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div id="tea-pruning-stage-1" className="p-4 rounded-xl bg-white border border-amber-200 space-y-2 scroll-mt-24">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[11px]">
                          {tr.guides1stCutEndYear1}
                        </span>
                        <span className="font-mono font-bold text-amber-900">15–20 cm</span>
                      </div>
                      <h5 className="font-bold text-stone-900 text-xs sm:text-sm">
                        {tr.guides1stFormativeCutDeCentering}
                      </h5>
                      <ul className="space-y-1.5 text-stone-600 leading-relaxed list-disc list-inside">
                        <li>
                          <strong>{tr.guidesWhenReadiness}</strong>{' '}
                          {tr.guidesLateWinterLateFebruaryMid}
                        </li>
                        <li>
                          <strong>{tr.guidesHowCut}</strong>{' '}
                          {tr.guidesMeasure1520CmUp}
                        </li>
                        <li>
                          <strong>{tr.guidesAnatomicalGoal}</strong>{' '}
                          {tr.guidesHaltsVerticalTreeGrowthForces}
                        </li>
                      </ul>
                    </div>

                    <div id="tea-pruning-stage-2" className="p-4 rounded-xl bg-white border border-sky-200 space-y-2 scroll-mt-24">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 font-extrabold text-[11px]">
                          {tr.guides2ndCutEndYear2}
                        </span>
                        <span className="font-mono font-bold text-sky-900">30–40 cm</span>
                      </div>
                      <h5 className="font-bold text-stone-900 text-xs sm:text-sm">
                        {tr.guides2ndFormativeCutBuildingSecondary}
                      </h5>
                      <ul className="space-y-1.5 text-stone-600 leading-relaxed list-disc list-inside">
                        <li>
                          <strong>{tr.guidesWhen}</strong>{' '}
                          {tr.guidesOneFullYearAfter1st}
                        </li>
                        <li>
                          <strong>{tr.guidesHowCut}</strong>{' '}
                          {tr.guidesMeasure1520CmAbove}
                        </li>
                        <li>
                          <strong>{tr.guidesAnatomicalGoal}</strong>{' '}
                          {tr.guidesMultiplies35PrimaryScaffolds}
                        </li>
                      </ul>
                    </div>

                    <div id="tea-pruning-stage-3" className="p-4 rounded-xl bg-white border border-purple-200 space-y-2 scroll-mt-24">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-extrabold text-[11px]">
                          {tr.guides3rdCutEndYear3}
                        </span>
                        <span className="font-mono font-bold text-purple-900">40–55 cm → 75 cm</span>
                      </div>
                      <h5 className="font-bold text-stone-900 text-xs sm:text-sm">
                        {tr.guides3rdFormativeCutTippingPlucking}
                      </h5>
                      <ul className="space-y-1.5 text-stone-600 leading-relaxed list-disc list-inside">
                        <li>
                          <strong>{tr.guidesLateWinterHorizontalCut}</strong>{' '}
                          {tr.guidesMeasure1015CmAbove}
                        </li>
                        <li>
                          <strong>{tr.guidesSummerTippingDaDingLiu}</strong>{' '}
                          {tr.guidesWhenNewSpringSummerShoots}
                        </li>
                        <li>
                          <strong>{tr.guidesAnatomicalGoal}</strong>{' '}
                          {tr.guidesEstablishesFinishedWaistHighPlucking}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div id="tea-pruning-crows-feet" className="space-y-3 scroll-mt-24">
                  <div className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-emerald-700" />
                    <span>
                      {tr.guides3OngoingMaintenanceRejuvenationCuts}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-stone-900 font-bold">
                          {tr.guidesLightSkiffingQingXiujian}
                        </strong>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono font-bold text-[11px]">
                          {tr.guidesLightSkiffingDepth}
                        </span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        {tr.guidesPerformedAnnuallyEvery2ndYear}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-teal-300 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-teal-950 font-bold">
                          {tr.guidesBDeepPruningAgainstCrow}
                        </strong>
                        <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-mono font-bold text-[11px]">
                          {tr.guidesDeepPruningDepth}
                        </span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        {tr.guidesAfter35YearsRepeated}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-stone-900 font-bold">
                          {tr.guidesCHeavyRejuvenationCutZhong}
                        </strong>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold text-[11px]">
                          {tr.guides3045Cm}
                        </span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        {tr.guidesAgingBushes1220Years}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-stone-900 font-bold">
                          {tr.guidesDCollarCoppicingTaiGe}
                        </strong>
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-mono font-bold text-[11px]">
                          {tr.guides510Cm}
                        </span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        {tr.guidesSenescentFrostDamagedBushes25}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="tea-sinensis-processing" className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 mb-2">
                  <Zap className="w-3.5 h-3.5 text-amber-700" />
                  {tr.guidesBiochemicalProcessingSensoryQuality}
                </span>
                <h3 className="text-xl font-bold text-stone-900">
                  {tr.guides4HowProcessYourHarvest}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                  <RichText text={tr.guidesWhatSeparatesSixTeaCategories} onFootnote={scrollToFootnote} slots={[<a href="https://wumountaintea.com/a-masterclass-on-tea/" target="_blank" rel="noopener noreferrer" className="text-forest-700 font-bold hover:underline">{tr.guidesWuMountainTeaMasterclassRubrics}</a>]} />
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <TeaProcessCard
                  tr={tr}
                  onFootnote={scrollToFootnote}
                  theme={{ box: 'bg-emerald-50/40 border border-emerald-200', badge: 'bg-emerald-600 text-white', tag: 'text-emerald-900', rubric: 'bg-white border border-emerald-200', rubricTitle: 'text-emerald-950' }}
                  name={tr.guides1GreenTeaLuCha}
                  oxidation={tr.guides0EnzymaticOxidationImmediateKill}
                  pdf="Green-Tea-Assessment-Rubric.pdf"
                  pdfLabel={tr.guidesGreenTeaRubricPdf}
                  protocolTitle={tr.guidesStepStepProcessingProtocol}
                  steps={[
                      [tr.guidesBriefIndoorSpreadingTanFang, tr.guidesSpreadFreshlyPlucked1Bud],
                      [tr.guidesKillGreenFixingShaQing, tr.guidesRaiseInternalLeafTemperatureAbove],
                      [tr.guidesRollingShapingRouNian10, tr.guidesWhileWarmPliableGentlyRoll],
                      [tr.guidesTwoStageDryingGanZao, tr.guidesFirstDryAt110C]
                  ]}
                  markers={tr.guidesDryLeafVibrantEmeraldRadioactive}
                  defects={tr.guidesHotSpotsCharredBlackBlisters}
                />

                <TeaProcessCard
                  tr={tr}
                  onFootnote={scrollToFootnote}
                  theme={{ box: 'bg-yellow-50/50 border border-yellow-300', badge: 'bg-yellow-600 text-white', tag: 'text-yellow-900', rubric: 'bg-white border border-yellow-300', rubricTitle: 'text-yellow-950' }}
                  name={tr.guides2YellowTeaHuangCha}
                  oxidation={tr.guidesNonEnzymaticHydrothermalSmotheringMen}
                  pdf="Yellow-Tea-Assessment-Rubric.pdf"
                  pdfLabel={tr.guidesYellowTeaRubricPdf}
                  protocolTitle={tr.guidesStepStepProcessingProtocol}
                  steps={[
                      [tr.guidesGentleKillGreenShaQing, tr.guidesPanFire1Bud1],
                      [tr.guidesSwaddlingSmotheringMenHuangDefining, tr.guidesImmediatelyWrapHotDampLeaves],
                      [tr.guidesSlowLowHeatDrying70, tr.guidesBakeGentlyLockSweetCorn]
                  ]}
                  markers={tr.guidesThreeFoldYellowSanHuang}
                  defects={tr.guidesUnderSmotheredLeavesRemainGreen}
                />

                <TeaProcessCard
                  tr={tr}
                  onFootnote={scrollToFootnote}
                  theme={{ box: 'bg-stone-100/70 border border-stone-300', badge: 'bg-stone-700 text-white', tag: 'text-stone-700', rubric: 'bg-white border border-stone-300', rubricTitle: 'text-stone-900' }}
                  name={tr.guides3WhiteTeaBaiCha}
                  oxidation={tr.guides515SpontaneousMicroOxidation}
                  pdf="White-Tea-Assessment-Rubric.pdf"
                  pdfLabel={tr.guidesWhiteTeaRubricPdf}
                  protocolTitle={tr.guidesStepStepProcessingProtocolNo}
                  steps={[
                      [tr.guidesHarvestDryDownRichShoots, tr.guidesNeverHarvestRainHeavyMorning],
                      [tr.guidesProlongedNaturalWitheringWeiDiao, tr.guidesSpreadLeavesSingleNonOverlapping],
                      [tr.guidesGentleFinalDrying4075, tr.guidesOnceLeavesReach8590]
                  ]}
                  markers={tr.guidesSilverInlaidJadeYinXiang}
                  defects={tr.guidesRustyDarkBrownBlackPatches}
                />

                <TeaProcessCard
                  tr={tr}
                  onFootnote={scrollToFootnote}
                  theme={{ box: 'bg-amber-50/50 border border-amber-300', badge: 'bg-amber-700 text-white', tag: 'text-amber-900', rubric: 'bg-white border border-amber-300', rubricTitle: 'text-amber-950' }}
                  name={tr.guides4OolongTeaQingCha}
                  oxidation={tr.guides1580PartialOxidationMechanical}
                  pdf="Oolong-Tea-Assessment-Rubric.pdf"
                  pdfLabel={tr.guidesOolongTeaRubricPdf}
                  protocolTitle={tr.guidesStepStepProcessingProtocolMost}
                  steps={[
                      [tr.guidesPluckMatureBanjiShootsKai, tr.guidesHarvest24OpenLeaves],
                      [tr.guidesAlternatingBruisingYaoQingResting, tr.guidesTossGentlyTumbleLeavesBamboo],
                      [tr.guidesHighHeatKillGreenSha, tr.guidesOnceDesiredOxidationLevel15],
                      [tr.guidesClothBallRollingBaoRou, tr.guidesEitherWrapTightlyClothBall]
                  ]}
                  markers={tr.guidesDryRolledOolongShowsDragonfly}
                  defects={tr.guidesDeadLeavesBruisedTooViolently}
                />

                <TeaProcessCard
                  tr={tr}
                  onFootnote={scrollToFootnote}
                  theme={{ box: 'bg-rose-50/50 border border-rose-200', badge: 'bg-rose-700 text-white', tag: 'text-rose-900', rubric: 'bg-white border border-rose-200', rubricTitle: 'text-rose-950' }}
                  name={tr.guides5BlackTeaHongCha}
                  oxidation={tr.guides85100FullEnzymaticOxidation}
                  pdf="Black-Tea-Assessment-Rubric.pdf"
                  pdfLabel={tr.guidesBlackTeaRubricPdf}
                  protocolTitle={tr.guidesStepStepProcessingProtocol}
                  steps={[
                      [tr.guidesDeepIndoorWithering1218, tr.guidesWither1Bud12],
                      [tr.guidesVigorousRollingRouNian45, tr.guidesRollFirmlyCircularMotionsLight],
                      [tr.guidesWarmHumidOxidationFermentationFa, tr.guidesPlaceRolledLeaves58],
                      [tr.guidesTwoStageBakingMaoHuo, tr.guidesAsSoonAsLeavesTurn]
                  ]}
                  markers={tr.guidesDryLeafGlossyJetBlack}
                  defects={tr.guidesPigLiverDullDarkBrown}
                />

                <TeaProcessCard
                  tr={tr}
                  onFootnote={scrollToFootnote}
                  theme={{ box: 'bg-stone-800 text-stone-100 border border-stone-700', badge: 'bg-amber-500 text-stone-950', tag: 'text-amber-300', rubric: 'bg-stone-900 border border-stone-700', rubricTitle: 'text-amber-300', dark: true }}
                  name={tr.guides6DarkTeaPostFermented}
                  oxidation={tr.guidesMicrobialSolidStateFermentationWo}
                  pdf="Dark-Tea-Assessment-Rubric.pdf"
                  pdfLabel={tr.guidesDarkTeaRubricPdf}
                  protocolTitle={tr.guidesStepStepProcessingProtocolAnhua}
                  steps={[
                      [tr.guidesHarvestMatureSummerAutumnLeaves, tr.guidesUnlikeSpringBudTeasHei],
                      [tr.guidesKillGreenWaterSprinkleRolling, tr.guidesPanFireAt220260],
                      [tr.guidesMicrobialPileFermentationWoDui, tr.guidesHeapDampRolledLeaves60]
                  ]}
                  markers={tr.guidesDryBrickSplitsCleanlyRevealing}
                  defects={tr.guidesWhiteGreenBlackToxicMold}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tea_assamica' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div id="tea-assamica-botany" className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-stone-100 pb-5">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 mb-2">
                    <Sprout className="w-3.5 h-3.5 text-amber-700" />
                    {tr.guidesLargeLeafTropicalTeaTree}
                  </span>
                  <h2 className="text-2xl font-bold text-stone-900">
                    {tr.guidesAssamYunnanLargeLeafTea}
                  </h2>
                  <p className="text-sm text-stone-600 mt-1.5 leading-relaxed max-w-3xl">
                    <RichText text={tr.guidesWhileCamelliaSinensisVarSinensis} onFootnote={scrollToFootnote} slots={[<code>tree-tea-assamica</code>]} />
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectTab('tea_sinensis')}
                  className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <span>{tr.guidesViewChineseTeaVarSinensis}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-stone-700 leading-relaxed">
                  <strong className="text-stone-900">
                    {tr.guidesReferenceMasterclassVideoCurriculum}
                  </strong>
                  {tr.guidesExploreDrDylanRothenbergS}
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <a
                    href="https://wumountaintea.com/a-masterclass-on-tea/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>wumountaintea.com</span>
                  </a>
                  <a
                    href="https://www.youtube.com/playlist?list=PLeK5s_4Pb8528z06MYcc_XMfd5V7ZJmUv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{tr.guidesYoutubePlaylist}</span>
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>
                    {tr.guides1ScientificComparisonCamelliaSinensis}
                  </span>
                </h3>

                <div className="overflow-x-auto rounded-2xl border border-stone-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-100 text-stone-800 border-b border-stone-200">
                        <th className="p-3 font-extrabold">{tr.guidesTraitParameter}</th>
                        <th className="p-3 font-extrabold text-amber-900 bg-amber-50/70">
                          <em>C. sinensis</em> var. <em>assamica</em> (Assam / Yunnan Dayezhong)
                        </th>
                        <th className="p-3 font-extrabold text-emerald-900 bg-emerald-50/70">
                          <em>C. sinensis</em> var. <em>sinensis</em> {tr.guidesTeaSinensisSmallLeafNote}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 text-stone-700">
                      {[
                        [tr.guidesGrowthHabitTrunk, tr.guidesArborSemiArborSingleTrunk, tr.guidesMultiStemmedBushShrubGuanmu],
                        [tr.guidesLeafSizeAnatomy, tr.guidesLarge1530CmLong, tr.guidesSmall310CmLong],
                        [tr.guidesFrostHardiness, tr.guidesFrostSensitiveUsdaZone9b, tr.guidesColdHardyDown12C],
                        [tr.guidesPolyphenolsCatechinsCaffeine, tr.guidesVeryHighTotalPolyphenols25, tr.guidesModeratePolyphenols1522Dry],
                        [tr.guidesPpoPodEnzymeActivity, tr.guides2025Higher, tr.guidesLowerPpoPodActivityMaking]
                      ].map(([trait, assamica, sinensis]) => (
                        <tr key={trait}>
                          <td className="p-3 font-bold text-stone-900">{trait}</td>
                          <td className="p-3 bg-amber-50/20"><RichText text={assamica} onFootnote={scrollToFootnote} /></td>
                          <td className="p-3 bg-emerald-50/20"><RichText text={sinensis} onFootnote={scrollToFootnote} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-stone-700 leading-relaxed">
                  <strong className="text-amber-950 font-bold">
                    {tr.guidesWhyYouShouldNotProcess}
                  </strong>
                  <RichText text={tr.guidesBecauseVarAssamicaLeavesContain} onFootnote={scrollToFootnote} />
                </div>
              </div>
            </div>

            <div id="tea-assamica-planting" className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-100 text-forest-800 mb-2">
                  <TreePine className="w-3.5 h-3.5 text-forest-700" />
                  {tr.guidesSubtropicalAgroforestryTemperate}
                </span>
                <h3 className="text-xl font-bold text-stone-900">
                  {tr.guides2PlantingCanopyShadePruning}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <h4 className="font-bold text-stone-900 text-sm">
                    {tr.guides1SubtropicalGroundVsTemperate}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    <RichText text={tr.guidesFrostFreeSubtropicalZonesUsda} onFootnote={scrollToFootnote} />
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-bold text-stone-900 text-sm">
                      {tr.guides2EstateTableTaizichaVs}
                    </h4>
                    <ul className="text-xs text-stone-600 space-y-1.5 leading-relaxed list-disc list-inside">
                      <li>
                        <strong>{tr.guidesAssamEstatePluckingTable80}</strong>{' '}
                        {tr.guidesDeCenteredAt25Cm}
                      </li>
                      <li>
                        <strong>{tr.guidesYunnanForestTeaArborQiaomu}</strong>{' '}
                        {tr.guidesAllowedGrowAsFreeStanding}
                      </li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollToSection('tea_sinensis', 'tea-sinensis-pruning-guide')}
                    className="mt-2 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Scissors className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>
                      {tr.guidesViewStepStepPruningGuide}
                    </span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <h4 className="font-bold text-stone-900 text-sm">
                    {tr.guides3SeasonalFlushCalendarVar}
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-1.5 leading-relaxed list-disc list-inside">
                    <li>
                      <strong>{tr.guidesFirstFlushMarchAprilYunnan}</strong>{' '}
                      {tr.guidesPostWinterDormancyShootsRich}
                    </li>
                    <li>
                      <strong>{tr.guidesSecondFlushMayJunePeak}</strong>{' '}
                      {tr.guidesWarmPreMonsoonSunMild}
                    </li>
                    <li>
                      <strong>{tr.guidesMonsoonJulySeptAutumnFlush}</strong>{' '}
                      {tr.guidesVigorousMonsoonGrowthIdealStrong}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div id="tea-assamica-processing" className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-900 mb-2">
                  <Zap className="w-3.5 h-3.5 text-rose-700" />
                  {tr.guidesStepStepAssamicaProcessingProtocols}
                </span>
                <h3 className="text-xl font-bold text-stone-900">
                  {tr.guides3ProcessingVarAssamicaInto}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-700 text-white">
                      {tr.guidesOrthodoxAssamFtgfop1YunnanDianhong}
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-900">
                      {tr.guidesHighTheaflavinThearubiginRatioGolden}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    <RichText text={tr.guides1TroughWithering1418} onFootnote={scrollToFootnote} />
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-800 text-white">
                      {tr.guidesBCtcBlackTeaCrush}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-900">
                      {tr.guidesNear100CellRupture45}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {tr.guidesDevelopedSpecificallyLargeLeafVar}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-700 text-white">
                      {tr.guidesCYunnanRawPuErh}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-900">
                      {tr.guidesLowTempKillGreen180}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    <RichText text={tr.guidesGeographicalIndicationBiochemistry} onFootnote={scrollToFootnote} />
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-800 text-stone-100 border border-stone-700 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500 text-stone-950">
                      {tr.guidesDYunnanRipePuErh}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {tr.guides4565DaysAt50}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    <RichText text={tr.guidesDevelopedKunmingMenghai1973Accelerate} slots={[<button type="button" onClick={() => scrollToFootnote('fn-43')} className="text-forest-400 font-bold hover:underline cursor-pointer">[43]</button>]} />
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-100/80 border border-stone-300 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-stone-700 text-white">
                      {tr.guidesEYunnanMoonlightWhiteYue}
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-700">
                      {tr.guides1525MicroOxidationBlack}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {tr.guidesStunningSpecialtyJingguXishuangbanna}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
                  <BookmarkCheck className="w-6 h-6 text-forest-600" />
                  <span>{tr.guidesTabSources}</span>
                </h2>
                <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
                  {tr.guidesAllBotanicalMechanicsRootSpatial}
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {SOURCES.map((item) => (
                  <div
                    key={item.id}
                    id={item.id}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-200 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-mono font-bold text-forest-700 text-xs mr-2">
                          [{item.id.replace('fn-', '')}]
                        </span>
                        <strong className="text-stone-900 font-bold text-sm">
                          {item.author}
                        </strong>
                        <span className="text-stone-700 text-sm block mt-0.5">
                          <em>{item.title}</em>. {item.journal}.
                        </span>
                        <p className="text-xs text-stone-500 mt-1">
                          {item.note}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
