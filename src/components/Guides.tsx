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
            <RichText text={defects} onFootnote={onFootnote} />
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
    author: 'Jobbágy, E. G., & Jackson, R. B. (2004)',
    title: 'The uplift of soil nutrients by plants: biogeochemical consequences across scales',
    journal: 'Ecology, 85(9), pp. 2380–2389 (DOI: 10.1890/03-0245)',
    note: 'Plant uptake and cycling transport nutrients to the soil surface, giving strongly cycled elements shallower vertical distributions; without plant uplift the exchangeable K pool in the top 20 cm of soils would be one-third to one-half smaller.'
  },
  {
    id: 'fn-4',
    author: 'Oster, M., Reyer, H., Keiler, J., Ball, E., Mulvenna, C., Ponsuksili, S., & Wimmers, K. (2021)',
    title: 'Comfrey (Symphytum spp.) as a feed supplement in pig nutrition contributes to regional resource cycles',
    journal: 'Science of The Total Environment, 796, 148988 (DOI: 10.1016/j.scitotenv.2021.148988)',
    note: 'Describes comfrey as a high-yielding perennial with a root system about 1 m deep; comfrey leaves contained 64.9 g/kg potassium and 10.8 g/kg calcium in dry matter.'
  },
  {
    id: 'fn-5',
    author: 'Timberlake, T. P., Vaughan, I. P., & Memmott, J. (2019)',
    title: 'Phenology of farmland floral resources reveals seasonal gaps in nectar availability for bumblebees',
    journal: 'Journal of Applied Ecology, 56(7), pp. 1585–1596 (DOI: 10.1111/1365-2664.13403)',
    note: 'Whole-farm nectar supply in SW England showed "hunger gaps" in March and August/September when supply is unlikely to meet bumblebee demand; Allium ursinum, Cirsium arvense and Trifolium repens supplied half of all nectar; plants flowering in early spring and late summer should be prioritised.'
  },
  {
    id: 'fn-6',
    author: 'Pickett, J. A., Woodcock, C. M., Midega, C. A. O., & Khan, Z. R. (2014)',
    title: 'Push–pull farming systems',
    journal: 'Current Opinion in Biotechnology, 26, pp. 125–132 (DOI: 10.1016/j.copbio.2013.12.006)',
    note: 'Push–pull systems use companion plants that deliver semiochemicals (plant secondary metabolites) which repel pests and attract beneficial insects.'
  },
  {
    id: 'fn-7',
    author: 'Finch, S., & Collier, R. H. (2000)',
    title: 'Host-plant selection by insects – a theory based on \'appropriate/inappropriate landings\' by pest insects of cruciferous plants',
    journal: 'Entomologia Experimentalis et Applicata, 96(2), pp. 91–102 (DOI: 10.1046/j.1570-7458.2000.00684.x)',
    note: 'Fewer specialist insects are found on host plants growing in diverse backgrounds than on plants in bare soil; searching insects land indiscriminately on green host and non-host leaves (appropriate/inappropriate landings) but avoid brown soil.'
  },
  {
    id: 'fn-8',
    author: 'Teasdale, J. R., & Daughtry, C. S. T. (1993)',
    title: 'Weed suppression by live and desiccated hairy vetch (Vicia villosa)',
    journal: 'Weed Science, 41(2), pp. 207–212 (DOI: 10.1017/S0043174500076074)',
    note: '3-year field experiment: at 87% of sites, live hairy vetch transmitted less than 1% of sunlight; daily maximum soil temperature and its daily amplitude were reduced (live > desiccated vetch > bare soil); soil was moister under live and desiccated vetch during droughts; weeds were suppressed most by the live cover.'
  },
  {
    id: 'fn-9',
    author: 'Merwin, I. A., & Stiles, W. C. (1994)',
    title: 'Orchard groundcover management impacts on apple tree growth and yield, and nutrient availability and uptake',
    journal: 'Journal of the American Society for Horticultural Science, 119(2), pp. 209–215 (DOI: 10.21273/JASHS.119.2.209)',
    note: 'Despite N and K fertilizer, extractable soil N and leaf N were reduced under grass sod, and trunk growth and yield were lower than under other groundcover treatments.'
  },
  {
    id: 'fn-10',
    author: 'Curtis, H., Noll, U., Störmann, J., & Slusarenko, A. J. (2004)',
    title: 'Broad-spectrum activity of the volatile phytoanticipin allicin in extracts of garlic (Allium sativum L.) against plant pathogenic bacteria, fungi and Oomycetes',
    journal: 'Physiological and Molecular Plant Pathology, 65(2), pp. 79–89 (DOI: 10.1016/j.pmpp.2004.11.006)',
    note: 'Allicin from garlic extracts was active in vitro against plant-pathogenic bacteria, fungi (e.g. Alternaria, Botrytis, Magnaporthe) and the oomycete Phytophthora infestans, whose spore germination it reduced.'
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
    author: 'D\'yakova, N. A. (2022)',
    title: 'Accumulation of macro- and microelements in leaves of stinging nettle (Urtica dioica L.)',
    journal: 'Ulyanovsk Medico-biological Journal, (2), pp. 139–147 (DOI: 10.34014/2227-1848-2022-2-139-147)',
    note: 'Nettle leaves accumulated potassium (>26.5 mg/g) and calcium (>26 mg/g); silicon (>9.2 mg/g) and iron (>0.3 mg/g) dominated among the trace elements.'
  },
  {
    id: 'fn-13',
    author: 'Jose, S. (2002)',
    title: 'Black walnut allelopathy: current state of the science',
    journal: 'In Inderjit & A. U. Mallik (eds.), Chemical Ecology of Plants: Allelopathy in Aquatic and Terrestrial Ecosystems, Birkhäuser, Basel, pp. 149–172 (DOI: 10.1007/978-3-0348-8109-8_10)',
    note: 'Review of the research on black walnut (Juglans nigra) allelopathy and juglone, which, as the author notes, now allows myths to be distinguished from science.'
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
    note: 'Soils cultivated with Welsh onion (Allium fistulosum) or onion suppressed Fusarium wilt of cucumber; the accumulation of antagonistic Flavobacterium species plays a key role in this suppression.'
  },
  {
    id: 'fn-19',
    author: 'Reich, P. B., Oleksyn, J., Modrzyński, J., Mrozinski, P., Hobbie, S. E., Eissenstat, D. M., Chorover, J., Chadwick, O. A., Hale, C. M., & Tjoelker, M. G. (2005) & Schelfhout, S., Mertens, J., Verheyen, K., Vesterdal, L., Baeten, L., Muys, B., & De Schrijver, A. (2017)',
    title: 'Linking litter calcium, earthworms and soil properties: a common garden test with 14 tree species / Tree Species Identity Shapes Earthworm Communities',
    journal: 'Ecology Letters, 8(8), pp. 811–818 (DOI: 10.1111/j.1461-0248.2005.00779.x); Forests, 8(3), 85 (DOI: 10.3390/f8030085)',
    note: 'Reich et al.: tree species with calcium-rich litter were associated with more native earthworms, higher soil pH, exchangeable calcium and base saturation, and faster forest-floor turnover. Schelfhout et al. (36-year common garden incl. Tilia cordata): anecic earthworms were abundant under Fraxinus, Acer and Tilia, related to calcium-rich litter and low soil acidification.'
  },
  {
    id: 'fn-20',
    author: 'Hejl, A. M., & Koster, K. L. (2004) & Rietveld, W. J. (1983)',
    title: 'Juglone disrupts root plasma membrane H+-ATPase activity and impairs water uptake, root respiration, and growth in soybean (Glycine max) and corn (Zea mays) / Allelopathic effects of juglone on germination and growth of several herbaceous and woody species',
    journal: 'Journal of Chemical Ecology, 30(2), pp. 453–471 (DOI: 10.1023/B:JOEC.0000017988.20530.d5); Journal of Chemical Ecology, 9(2), pp. 295–308 (DOI: 10.1007/BF00988047)',
    note: 'Hejl & Koster: in hydroponic soybean and corn, juglone (10–1000 µM) significantly reduced root plasma-membrane H+-ATPase activity, water uptake and root oxygen uptake. Rietveld: all 16 herbaceous and woody species tested (incl. Trifolium incarnatum, Alnus glutinosa, Elaeagnus umbellata) were sensitive to juglone in germination and growth assays.'
  },
  {
    id: 'fn-21',
    author: 'Borlinghaus, J., Albrecht, F., Gruhlke, M. C. H., Nwachukwu, I. D., & Slusarenko, A. J. (2014) & Adeleke, M. T. V. (2016)',
    title: 'Allicin: Chemistry and Biological Properties / Effect of Allium sativum (garlic) extract on the growth and nodulation of cowpea (Vigna unguiculata) and groundnut (Arachis hypogea)',
    journal: 'Molecules, 19(8), pp. 12591–12618 (DOI: 10.3390/molecules190812591); African Journal of Agricultural Research, 11(43), pp. 4304–4312 (DOI: 10.5897/AJAR2016.11208)',
    note: 'Borlinghaus et al.: allicin is a reactive sulfur species that reacts with thiol groups in glutathione and proteins, inhibits bacteria and fungi, and in plants inhibits seed germination and attenuates root development. Adeleke: in a greenhouse study, garlic extract (20–80%) applied to soil reduced nodulation, plant height, leaf area and root development of cowpea and groundnut, more so at higher concentrations.'
  },
  {
    id: 'fn-22',
    author: 'Colvin, W. I., III, & Gliessman, S. R. (2011) & Sun, M., Liu, B., Bianchi, F. J. J. A., van der Werf, W., & Lu, Y. (2025)',
    title: 'Effects of fennel (Foeniculum vulgare L.) interference on germination of introduced and native plant species / Abundance of aphid natural enemies on flowering service plants is associated with aphid prey and floral resources',
    journal: 'Allelopathy Journal, 28(1), pp. 41–51; Agriculture, Ecosystems & Environment, 382, 109502 (DOI: 10.1016/j.agee.2025.109502)',
    note: 'Colvin & Gliessman: in laboratory bioassays, germination of native species was significantly inhibited at fennel leaf-leachate concentrations above 2%, while introduced species were not significantly affected. Sun et al.: of 39 service plants in a field experiment (Xinjiang, China), Foeniculum vulgare was among those associated with relatively high aphid natural-enemy abundances.'
  },
  {
    id: 'fn-23',
    author: 'Bode, H. R. (1940) & Funke, G. L. (1943)',
    title: 'Über die Blattausscheidungen des Wermuts und ihre Wirkung auf andere Pflanzen / The influence of Artemisia Absinthium on neighbouring plants (An essay of Experimental Plant Sociology No. III)',
    journal: 'Planta, 30(4), pp. 567–589 (DOI: 10.1007/BF01917042); Blumea, 5(2), pp. 281–293',
    note: 'Funke (summarising Bode): wormwood leaves bear glandular hairs that excrete essential oils and absinthin, which rain washes onto nearby vegetation; seedlings of Foeniculum vulgare and other species were hindered within about 1 m of wormwood. Funke: 18 species sown beside a wormwood hedge were severely injured within ±100 cm, and Levisticum officinale was killed, whereas seedlings of Artemisia absinthium itself were not harmed.'
  },
  {
    id: 'fn-24',
    author: 'Lāce, B. (2017) & Maine Forest Service (n.d.)',
    title: 'Gymnosporangium Species – An Important Issue of Plant Protection / White Pine Blister Rust (Insect & Disease Fact Sheet)',
    journal: 'Proceedings of the Latvian Academy of Sciences, Section B, 71(3), pp. 95–102 (DOI: 10.1515/prolas-2017-0017); Maine Department of Agriculture, Conservation and Forestry (https://www.maine.gov/dacf/mfs/forest_health/diseases/white_pine_blister_rust.htm)',
    note: 'Lāce: strong pear rust infection occurs when pears and junipers grow within 300–500 m; in one study pear leaves were 100% infected 30 m from the juniper, 50% at 150 m and symptom-free at 300 m. Maine Forest Service: blister-rust spores from Ribes rarely survive airborne transport beyond 900 feet, so removing Ribes within 900 feet of pine protects it.'
  },
  {
    id: 'fn-25',
    author: 'Al-Mughrabi, K. I., Poirier, R., & Khabbaz, S. E. (2025)',
    title: 'Status and Best Management Practices of Potato Early Dying Disease in New Brunswick, Canada',
    journal: 'Biology, 14(5), 514 (DOI: 10.3390/biology14050514)',
    note: 'Verticillium species survive in soil as microsclerotia "without a host for at least 14 years"; potato early dying, often called the Verticillium wilt of potato, is one of the most economically damaging potato diseases.'
  },
  {
    id: 'fn-26',
    author: 'Read, D. J. (1996) & Konishi, S., Miyamoto, S., & Taki, T. (1985)',
    title: 'The structure and function of the ericoid mycorrhizal root / Stimulatory effects of aluminum on tea plants (Camellia sinensis) grown under low and high phosphorus supply',
    journal: 'Annals of Botany, 77(4), pp. 365–374 (DOI: 10.1006/anbo.1996.0044); Soil Science and Plant Nutrition, 31(3), pp. 361–368 (DOI: 10.1080/00380768.1985.10557443)',
    note: 'Read: the ericoid mycorrhiza of Ericaceae (e.g. Vaccinium, Rhododendron, Gaultheria) is characteristically restricted to nutrient-poor soils and gives the plants selective access to recalcitrant organic sources of N and P. Konishi et al.: aluminum stimulated tea growth – maximum root and shoot growth occurred with 0.4–1.6 mM Al – and stimulated P absorption.'
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
    note: 'Wäckers: of 11 insect-pollinated herbs tested for olfactory attractiveness and nectar accessibility with the parasitoids Cotesia glomerata, Heterospilus prosopidis and Pimpla turionellae, only Aegopodium podagraria and Origanum vulgare were optimal food sources, combining attractiveness with accessible nectar; Achillea millefolium, Trifolium pratense and Vicia sepium were repellent to at least one of the parasitoids. Gontijo et al.: next to sweet alyssum strips, apple trees had significantly fewer aphids, generalist predators increased, and natural enemies moved from the flowers into the orchard.'
  },
  {
    id: 'fn-29',
    author: 'Curtis, P. D., Curtis, G. B., & Miller, W. B. (2009)',
    title: 'Relative Resistance of Ornamental Flowering Bulbs to Feeding Damage by Voles',
    journal: 'HortTechnology, 19(3), pp. 499–503 (DOI: 10.21273/HORTTECH.19.3.499)',
    note: 'Feeding trials with captive prairie voles on 30 bulb varieties: daffodil (Narcissus), snowdrop, grape hyacinth and others were resistant to vole feeding both as fresh bulbs and as dried bulb mixed into food; tulips showed no resistance, and dried hyacinth, crocus and onion (Allium) were readily eaten.'
  },
  {
    id: 'fn-30',
    author: 'Mukhtar, T., Kayani, M. Z., & Hussain, M. A. (2013)',
    title: 'Nematicidal activities of Cannabis sativa L. and Zanthoxylum alatum Roxb. against Meloidogyne incognita',
    journal: 'Industrial Crops and Products, 42, pp. 447–453 (DOI: 10.1016/j.indcrop.2012.06.027)',
    note: 'Aqueous Cannabis sativa extracts caused higher juvenile mortality and hatching inhibition of the root-knot nematode Meloidogyne incognita than Zanthoxylum alatum; juveniles exposed to the extracts caused no infection, and soil drench and root dip treatments significantly reduced infection of cucumber.'
  },
  {
    id: 'fn-31',
    author: 'Valladares, F., & Niinemets, Ü. (2008)',
    title: 'Shade Tolerance, a Key Plant Feature of Complex Nature and Consequences',
    journal: 'Annual Review of Ecology, Evolution, and Systematics, 39, pp. 237–257 (DOI: 10.1146/annurev.ecolsys.39.110707.173506)',
    note: 'Review of plant shade tolerance: there is consensus on the suites of traits that influence it, but debate over the relative importance of traits that maximize photosynthetic carbon gain in low light versus those that minimize losses.'
  },
  {
    id: 'fn-32',
    author: 'Lapointe, L. (2001)',
    title: 'How phenology influences physiology in deciduous forest spring ephemerals',
    journal: 'Physiologia Plantarum, 113(2), pp. 151–157 (DOI: 10.1034/j.1399-3054.2001.1130201.x)',
    note: 'Spring ephemerals of deciduous forests are adapted to take advantage of the high-light period available in early spring before the canopy closes, and have high photosynthetic rates.'
  },
  {
    id: 'fn-33',
    author: 'He, X. H., Critchley, C., & Bledsoe, C. (2003)',
    title: 'Nitrogen transfer within and between plants through common mycorrhizal networks (CMNs)',
    journal: 'Critical Reviews in Plant Sciences, 22(6), pp. 531–567 (DOI: 10.1080/713608315)',
    note: 'Review: in many studies nitrogen from N2-fixing mycorrhizal plants transferred to neighbouring non-fixing plants; 20–50% one-way N transfer has been observed from legumes to non-legumes, although it is disputed whether the transfer runs directly through common mycorrhizal networks or indirectly through the soil.'
  },
  {
    id: 'fn-34',
    author: 'Wei, C., Yang, H., Wang, S., Zhao, J., Liu, C., Gao, L., Xia, E., Lu, Y., Tai, Y., She, G., et al. (2018)',
    title: 'Draft genome sequence of Camellia sinensis var. sinensis provides insights into the evolution of the tea genome and tea quality',
    journal: 'Proceedings of the National Academy of Sciences (PNAS), 115(18), pp. E4151–E4158 (DOI: 10.1073/pnas.1719622115)',
    note: 'var. sinensis and var. assamica diverged ~0.38–1.54 million years ago; var. sinensis is a slower-growing small-leaved shrub that withstands colder climates, var. assamica is quick-growing, large-leaved and cold-sensitive and mainly grown in warm tropical areas; catechins make up 12–24% of young-leaf dry weight, galloylated catechins accumulate in young leaves (SCPL acyltransferases); theanine (>50% of free amino acids, 1–2% of leaf dry weight) is synthesized mainly in the roots by theanine synthetase (CsTSI) and transported to the shoots.'
  },
  {
    id: 'fn-35',
    author: 'Xia, E.-H., Zhang, H.-B., Sheng, J., Li, K., Zhang, Q.-J., Kim, C., Zhang, Y., Liu, Y., Zhu, T., Li, W., et al. (2017)',
    title: 'The Tea Tree Genome Provides Insights into Tea Flavor and Independent Evolution of Caffeine Biosynthesis',
    journal: 'Molecular Plant, 10(6), pp. 866–877 (DOI: 10.1016/j.molp.2017.04.002)',
    note: 'First high-quality genome of the cultivated tea tree (var. assamica cultivar Yunkang 10); shows an independent and rapid evolution of the tea caffeine synthesis pathway relative to cacao and coffee, and links higher expression of flavonoid and caffeine genes to higher catechin and caffeine production.'
  },
  {
    id: 'fn-36',
    author: 'Rothenberg, D. O., Zhou, C., & Zhang, L. (2018); Rothenberg, D. O., & Zhang, L. (2019); & Wu Mountain Tea (2022)',
    title: 'A Review on the Weight-Loss Effects of Oxidized Tea Polyphenols / Mechanisms Underlying the Anti-Depressive Effects of Regular Tea Consumption / A Masterclass on Tea (8-Chapter Curriculum & Sensory Assessment Rubrics)',
    journal: 'Molecules, 23(5), 1176 (DOI: 10.3390/molecules23051176); Nutrients, 11(6), 1361 (DOI: 10.3390/nu11061361); https://wumountaintea.com/a-masterclass-on-tea/',
    note: 'Reviews by D. O. Rothenberg (Department of Tea Science, South China Agricultural University) on oxidized tea polyphenols and on regular tea consumption and depression; Wu Mountain Tea\'s tea masterclass with assessment rubrics for each tea type that score dry leaf, soup (liquor), aroma, taste and infused leaf and list positive and defect descriptors (e.g. "Emerald/jade", "Radioactive", "Shrimp shells" for green tea).'
  },
  {
    id: 'fn-37',
    author: 'Ruan, J., Gerendás, J., Härdter, R., & Sattelmacher, B. (2007) & Yan, P., Wu, L., Wang, D., Fu, J., Shen, C., Li, X., Zhang, L., Zhang, L., Fan, L., & Han, W. (2020)',
    title: 'Effect of nitrogen form and root-zone pH on growth and nitrogen uptake of tea (Camellia sinensis) plants / Soil acidification in Chinese tea plantations',
    journal: 'Annals of Botany, 99(2), pp. 301–310 (DOI: 10.1093/aob/mcl258); Science of The Total Environment, 715, 136963 (DOI: 10.1016/j.scitotenv.2020.136963)',
    note: 'Ruan et al.: tea biomass was largest at root-zone pH 5.0 (of 4.0, 5.0 and 6.0) regardless of N form; NH4+ was absorbed 2–3.4 times faster than NO3− when supplied separately. Yan et al.: average soil pH in Chinese tea plantations was 4.68 and pH 4.5–5.5 is optimal for tea growth; soil pH decreased by 0.47–1.43 units over 20–30 years, with no significant acidification in organic plantations.'
  },
  {
    id: 'fn-38',
    author: 'Ku, K. M., Choi, J. N., Kim, J., Kim, J. K., Yoo, L. G., Lee, S. J., Hong, Y.-S., & Lee, C. H. (2010)',
    title: 'Metabolomics analysis reveals the compositional differences of shade grown tea (Camellia sinensis L.)',
    journal: 'Journal of Agricultural and Food Chemistry, 58(1), pp. 418–426 (DOI: 10.1021/jf902929h)',
    note: 'Metabolomic comparison of green tea with shade-cultured green tea (tencha): green tea had higher levels of galloylquinic acid, epigallocatechin and epicatechin than tencha; the study "delineates the possibility to get high umami and less astringent green teas in shade culture".'
  },
  {
    id: 'fn-39',
    author: 'Ho, C.-T., Zheng, X., & Li, S. (2015) & Wang, Y., Kan, Z., Thompson, H. J., Ling, T., Ho, C.-T., Li, D., & Wan, X. (2019)',
    title: 'Tea aroma formation / Impact of Six Typical Processing Methods on the Chemical Composition of Tea Leaves Using a Single Camellia sinensis Cultivar, Longjing 43',
    journal: 'Food Science and Human Wellness, 4(1), pp. 9–27 (DOI: 10.1016/j.fshw.2015.04.001); Journal of Agricultural and Food Chemistry, 67(19), pp. 5423–5436 (DOI: 10.1021/acs.jafc.8b05140)',
    note: 'Ho et al.: review of how tea aroma compounds form in green, black and oolong tea from carotenoid, lipid and glycoside precursors and through the Maillard reaction. Wang et al.: a single cultivar (Longjing 43) processed into green, yellow, white, oolong, black and dark tea; catechin content and the whole metabolome separated the six types, and amino acids and GABA increased in white tea.'
  },
  {
    id: 'fn-40',
    author: 'Dai, W., Xie, D., Lu, M., Li, P., Lv, H., Yang, C., Peng, Q., Zhu, Y., Guo, L., Zhang, Y., Tan, J., & Lin, Z. (2017) & Xu, J., Wang, M., Zhao, J., Wang, Y.-H., Tang, Q., & Khan, I. A. (2018)',
    title: 'Characterization of white tea metabolome: Comparison against green and black tea by a nontargeted metabolomics approach / Yellow tea (Camellia sinensis L.), a promising Chinese tea: Processing, chemical constituents and health benefits',
    journal: 'Food Research International, 96, pp. 40–45 (DOI: 10.1016/j.foodres.2017.03.028); Food Research International, 107, pp. 567–577 (DOI: 10.1016/j.foodres.2018.01.063)',
    note: 'Dai et al.: white tea differs from green and black tea in amino acids, catechins, dimeric catechins, flavonol/flavone glycosides and aroma precursors (withering profiled from 0 to 36 h). Xu et al.: review of yellow tea; its unique "sealed yellowing" step increases the oxidation level and removes the grassy smell of green tea.'
  },
  {
    id: 'fn-41',
    author: 'Zeng, L., Zhou, Y., Gui, J., Fu, X., Mei, X., Zhen, Y., Ye, T., Du, B., Dong, F., Watanabe, N., & Yang, Z. (2016)',
    title: 'Formation of Volatile Tea Constituent Indole During the Oolong Tea Manufacturing Process',
    journal: 'Journal of Agricultural and Food Chemistry, 64(24), pp. 5011–5019 (DOI: 10.1021/acs.jafc.6b01742)',
    note: 'CsTSB2 (tryptophan synthase β-subunit) was highly expressed during the oolong turn-over process; continuous mechanical damage simulating turn-over enhanced CsTSB2 expression and indole, so indole accumulates in oolong tea through continuous wounding stress.'
  },
  {
    id: 'fn-42',
    author: 'Roberts, E. A. H. (1958) & Tanaka, T., & Matsuo, Y. (2020)',
    title: 'The chemistry of tea manufacture / Production Mechanisms of Black Tea Polyphenols',
    journal: 'Journal of the Science of Food and Agriculture, 9(7), pp. 381–390 (DOI: 10.1002/jsfa.2740090701); Chemical and Pharmaceutical Bulletin, 68(12), pp. 1131–1142 (DOI: 10.1248/cpb.c20-00295)',
    note: 'Roberts: during fermentation, epigallocatechin and its gallate change most; thearubigins probably form by coupled oxidation of theaflavins; theaflavins and thearubigins account for the colour and strength of tea liquors, theaflavins also for quality and briskness. Tanaka & Matsuo: black tea polyphenols are produced by enzymatic oxidation of the tea catechins (studied with pure catechins and polyphenol oxidase).'
  },
  {
    id: 'fn-43',
    author: 'Lv, H.-P., Zhang, Y.-J., Lin, Z., & Liang, Y.-R. (2013) & Zhu, M.-Z., Li, N., Zhou, F., Ouyang, J., Lu, D.-M., Xu, W., Li, J., Lin, H.-Y., Zhang, Z., Xiao, J.-B., et al. (2020)',
    title: 'Processing and chemical constituents of Pu-erh tea: A review / Microbial bioconversion of the chemical components in dark tea',
    journal: 'Food Research International, 53(2), pp. 608–618 (DOI: 10.1016/j.foodres.2013.02.043); Food Chemistry, 312, 126043 (DOI: 10.1016/j.foodchem.2019.126043)',
    note: 'Lv et al.: Pu-erh is a microbially fermented tea made from the sun-dried leaves of large-leaf Camellia sinensis var. assamica in Yunnan; its sensory character comes from chemical transformations during post-fermentation. Zhu et al.: dark teas (ripe Pu-erh, Fu brick, Liupao) are made by solid-state fermentation, and microbial fermentation is the key factor controlling their quality.'
  },
  {
    id: 'fn-44',
    author: 'Mortimer, P. E., Gui, H., Xu, J., Zhang, C., Barrios, E., & Hyde, K. D. (2015)',
    title: 'Alder trees enhance crop productivity and soil microbial biomass in tea plantations',
    journal: 'Applied Soil Ecology, 96, pp. 25–32 (DOI: 10.1016/j.apsoil.2015.05.012)',
    note: 'Field study in Yunnan, China: planting the actinorhizal N-fixing tree Alnus nepalensis into mature Camellia sinensis var. assamica monoculture increased tea productivity by 52–72%, and soil fungal and bacterial biomass were 41% and 10% higher in the tea + A. nepalensis sites, despite no change in soil nutrition.'
  },
  {
    id: 'fn-45',
    author: 'Orwa, C., Mutua, A., Kindt, R., Jamnadass, R., & Simons, A. (2009)',
    title: 'Agroforestree Database: a tree reference and selection guide, version 4.0 — Albizia chinensis',
    journal: 'World Agroforestry Centre (ICRAF), Nairobi, Kenya (https://apps.worldagroforestry.org/treedb2/speciesprofile.php?Spid=1787)',
    note: 'Albizia chinensis is a nitrogen-fixing tree used for shade in tea and coffee plantations; "Trees grown for shade are left to grow to 7 m tall and then cut back to 4 m"; "It tolerates frequent pruning."'
  },
  {
    id: 'fn-46',
    author: 'Guangming Online – Kepu China (光明网-科普中国) (2022)',
    title: '【科学种植百问百答】如何进行茶树修剪？ (Science-based cultivation Q&A: How should tea bushes be pruned?)',
    journal: 'kepu.gmw.cn, 3 August 2022 (https://kepu.gmw.cn/2022-08/03/content_35930355.htm)',
    note: 'Chinese extension guidance on the three formative cuts (Dingxing XiuJian) of young tea, made to promote axillary-bud break and increase the number of scaffold branches: 1st cut after transplanting once seedlings exceed 25 cm (main stem cut at 15–20 cm, laterals spared); 2nd cut the following year in late February–early March (30–40 cm); 3rd cut one year later (level cut at 40–55 cm, giving bushes 40–55 cm tall and 60–100 cm wide); then two years of light tipping before full plucking once bushes are 60–80 cm tall and over 100 cm wide. Mature bushes: light pruning once a year (usually mid-October to mid-November, or before the spring flush), 3–5 cm above the previous cut; deep pruning every 3–5 years, removing the top 10–15 cm of the canopy. Aged bushes: heavy pruning at about half the bush height, then 1–2 seasons without plucking; collar pruning (Tai Ge) at 3–10 cm or ground level for shrub-type tea, about 20 cm for tree-type large-leaf tea.'
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
  },
  {
    id: 'fn-50',
    author: 'Min, T., & Bartholomew, B. (2007)',
    title: 'Theaceae: Camellia sinensis, var. sinensis and var. assamica',
    journal: 'In: Flora of China, Vol. 12, Science Press, Beijing & Missouri Botanical Garden Press, St. Louis (http://www.efloras.org/florataxon.aspx?flora_id=2&taxon_id=200014043)',
    note: 'Species description: shrubs or trees 1–5(–9) m tall, leaf blade 5–14 × 2–7.5 cm; var. assamica: leaf blade elliptic, 8–14 × 3.5–7.5 cm, densely spreading-villous along the midvein beneath, apex acuminate, in evergreen broad-leaved forests of S Guangdong, S Guangxi, Hainan and S Yunnan (also Laos, Myanmar, Thailand, Vietnam); var. sinensis: leaf blade glabrous beneath or sparsely pubescent only when young, apex bluntly acute.'
  },
  {
    id: 'fn-51',
    author: 'Indian Tea Association (n.d.)',
    title: 'The History of Assam Tea',
    journal: 'indiatea.org (https://www.indiatea.org/application/event/assam-tea-200.html)',
    note: '"In 1823, Major Robert Bruce discovered the native tea plant (Camellia sinensis var. assamica) in Assam’s Brahmaputra Valley."'
  },
  {
    id: 'fn-52',
    author: 'Aaqil, M., Peng, C., Kamal, A., Nawaz, T., Zhang, F., & Gong, J. (2023)',
    title: 'Tea Harvesting and Processing Techniques and Its Effect on Phytochemical Profile and Final Quality of Black Tea: A Review',
    journal: 'Foods, 12(24), 4467 (DOI: 10.3390/foods12244467)',
    note: 'Review of black tea manufacture: withering for 14–18 h lowers leaf moisture from ~70–80% to 60–70%; withered leaf for CTC maceration at 68–72% moisture; fermentation of CTC and orthodox tea for about 55–110 min and 2–4 h, 24–27 °C generally considered best, target TF:TR ratio about 1:10; drying e.g. 110 °C for 10 min then 85 °C, to 3–4% moisture; TFs and TRs highest in the early (March) flush and lowest in the rainy (July) flush; shoots in the Assam Valley plucked at seven-day intervals.'
  },
  {
    id: 'fn-53',
    author: 'Zhang, Y., Skaar, I., Sulyok, M., Liu, X., Rao, M., & Taylor, J. W. (2016)',
    title: 'The Microbiome and Metabolites in Fermented Pu-erh Tea as Revealed by High-Throughput Sequencing and Quantitative Multiplex Metabolite Analysis',
    journal: 'PLOS ONE, 11(6), e0157847 (DOI: 10.1371/journal.pone.0157847)',
    note: 'Raw Pu-erh is withered, roasted to denature enzymes, rolled and sun-dried, then ferments naturally during storage; Ripe Pu-erh, developed in the 1970s to shorten ageing, adds a pile fermentation started by adding water; Aspergillus niger and Blastobotrys adeninivorans are frequently documented as dominant; fresh leaves are an important microbial reservoir.'
  },
  {
    id: 'fn-54',
    author: 'Yang, Z., Xie, Y., Zhu, Y., Lei, M., Chen, X., Jin, W., Fu, C., & Yu, L. (2025)',
    title: 'Unraveling the flavor formation process of mellow and thick-type ripened Pu-erh tea through non-targeted metabolomics and metagenomics',
    journal: 'Food Chemistry: X, 27, 102424 (DOI: 10.1016/j.fochx.2025.102424)',
    note: 'Industrial 30-day pile fermentation of Ripe Pu-erh, turned every 6 days, at 30–42% moisture with the pile core at 35–60 °C (50–60 °C in the middle stage); catechins, theanine and free amino acids decreased while theabrownins increased; best mellow, thick taste on day 24.'
  },
  {
    id: 'fn-55',
    author: 'Li, T., Wei, Y., Lu, M., Wu, Y., Jiang, Y., Ke, H., Shao, A., & Ning, J. (2024)',
    title: 'Exploring microbial and moist-heat effects on Pu-erh tea volatiles and understanding the methoxybenzene formation mechanism using molecular sensory science',
    journal: 'Food Chemistry: X, 23, 101553 (DOI: 10.1016/j.fochx.2024.101553)',
    note: 'Comparing sterile and spontaneous pile fermentation: microbial action produces the stale aroma of Pu-erh; 1,2,3-trimethoxybenzene is among 22 aroma-active compounds, and microorganisms are the main contributors to methoxybenzene synthesis.'
  },
  {
    id: 'fn-56',
    author: 'Hua, J., Wang, H., Yuan, H., Yin, P., Wang, J., Guo, G., & Jiang, Y. (2022)',
    title: 'New insights into the effect of fermentation temperature and duration on catechins conversion and formation of tea pigments and theasinensins in black tea',
    journal: 'Journal of the Science of Food and Agriculture, 102(7), pp. 2750–2760 (DOI: 10.1002/jsfa.11616)',
    note: 'Low fermentation temperatures (20 and 25 °C) maintained polyphenol oxidase activity and continuous theaflavin formation, giving better liquor brightness; 30–40 °C raised peroxidase activity and catechin depletion and produced excessive thearubigins (TRSII) and theabrownins.'
  },
  {
    id: 'fn-57',
    author: 'Huang, F., Huang, Y., Gong, X., Chen, B., Zhang, J., Guo, Q., Zhang, W., Ye, Y., Ma, Z., & Wang, Y. (2026)',
    title: 'Impact of Warm-Air Withering Methods on Aroma Quality of White Teas from Four Tea Cultivars',
    journal: 'Foods, 15(12), 2120 (DOI: 10.3390/foods15122120)',
    note: '"The long withering process of 36–72 h is the key step to shaping white tea’s unique quality"; withering is typically done at room temperature (15–35 °C); control withering at 25 °C and 65% relative humidity for 48 h.'
  },
  {
    id: 'fn-58',
    author: 'Huang, J., Zhang, J., Chen, Z., Xiong, Z., Feng, W., Wei, Y., Li, T., & Ning, J. (2024)',
    title: 'Sensory-directed flavor analysis of Jinggu white tea: Exploring the formation mechanisms of sweet and fruity aromas',
    journal: 'Food Chemistry: X, 24, 102026 (DOI: 10.1016/j.fochx.2024.102026)',
    note: 'Jinggu (Yunnan) white tea has a stronger fruity and sweet aroma than Fujian and other Yunnan white teas; linalool and benzeneacetaldehyde (phenylacetaldehyde) are the main contributors to its fruity and sweet notes.'
  },
  {
    id: 'fn-59',
    author: 'Li, R., Liu, K., Liang, Z., Luo, H., Wang, T., An, J., Wang, Q., Li, X., Guan, Y., Xiao, Y., Lv, C., & Zhao, M. (2022)',
    title: 'Unpruning improvement the quality of tea through increasing the levels of amino acids and reducing contents of flavonoids and caffeine',
    journal: 'Frontiers in Nutrition, 9, 1017693 (DOI: 10.3389/fnut.2022.1017693)',
    note: 'Plantation tea is usually pruned to 70–80 cm; in Yunnan, sun-dried green teas from trees converted to unpruned growth were less bitter and astringent and sweeter, with more theanine and other free amino acids and lower flavonoid and caffeine levels.'
  },
  {
    id: 'fn-60',
    author: 'Ferguson, R. S., & Lovell, S. T. (2014)',
    title: 'Permaculture for agroecology: design, movement, practice, and worldview. A review',
    journal: 'Agronomy for Sustainable Development, 34(2), pp. 251–274 (DOI: 10.1007/s13593-013-0181-6)',
    note: 'Notes that "dynamic accumulators" (plants said to draw nutrients from the subsoil and concentrate them in the topsoil) is a term that does not appear in the scientific literature and is better described as "folk science", although plant processes that shape the vertical distribution of soil nutrients are well supported.'
  },
  {
    id: 'fn-61',
    author: 'Gu, A. (n.d.)',
    title: 'Syrphid Flies (Diptera: Syrphidae)',
    journal: 'Biological Control: A Guide to Natural Enemies in North America, Cornell University (https://biocontrol.entomology.cornell.edu/predators/syrphids.php)',
    note: '"Adult flies visit flowers and feed on nectar and pollen." "Each larva can consume up to 400 aphids during development."'
  },
  {
    id: 'fn-62',
    author: 'Zhang, Z.-Q., Sun, X.-L., Luo, Z.-X., Bian, L., & Chen, Z.-M. (2014)',
    title: 'Dual action of Catsia tora in tea plantations: repellent volatiles and augmented natural enemy population provide control of tea green leafhopper',
    journal: 'Phytoparasitica, 42(5), pp. 595–607 (DOI: 10.1007/s12600-014-0400-y)',
    note: 'Intercropping sicklepod (Cassia/Senna tora) in a tea field markedly reduced tea green leafhopper populations and increased natural enemies such as spiders, coccinellids and lacewings.'
  },
  {
    id: 'fn-63',
    author: 'Zhang, Z.-Q., Sun, X.-L., Xin, Z.-J., Luo, Z.-X., Gao, Y., Bian, L., & Chen, Z.-M. (2013)',
    title: 'Identification and field evaluation of non-host volatiles disturbing host location by the tea geometrid, Ectropis obliqua',
    journal: 'Journal of Chemical Ecology, 39(10), pp. 1284–1296 (DOI: 10.1007/s10886-013-0344-6)',
    note: 'Field results showed that intercropping tea with rosemary (Rosmarinus officinalis) effectively suppressed tea geometrid infestations.'
  },
  {
    id: 'fn-64',
    author: 'Hasanaliyeva, G., Furiosi, M., Rossi, V., & Caffi, T. (2024)',
    title: 'Cover crops lower the dispersal of grapevine foliar pathogens from the ground and contribute to early-season disease management',
    journal: 'Frontiers in Plant Science, 15, 1498848 (DOI: 10.3389/fpls.2024.1498848)',
    note: 'Inter-row cover crops in vineyards reduced the raindrops impacting the soil by 46–74% and the rain-splash droplets escaping the ground by 75–95%, and delayed (by 14–30 days) and reduced downy and powdery mildew epidemics.'
  },
  {
    id: 'fn-65',
    author: 'Bussi, C., Parveaud, C.-E., Mercier, V., & Lescourret, F. (2016)',
    title: 'Effects of irrigation deprivation and ground cover (Trifolium repens) in the tree row on brown rot incidence in peach',
    journal: 'Crop Protection, 88, pp. 37–44 (DOI: 10.1016/j.cropro.2016.05.010)',
    note: 'Brown rot incidence was lowest with reduced irrigation plus white clover cover in the tree row and intermediate with clover alone; the clover limited soil water after heavy rain, probably reducing fruit microcracks.'
  },
  {
    id: 'fn-66',
    author: 'Joy, A., Hudelson, B., & Jull, L. (2024)',
    title: 'Black walnut toxicity (UW Plant Disease Facts D0021)',
    journal: 'University of Wisconsin–Madison Extension, last revised 28 Feb 2024 (https://hort.extension.wisc.edu/articles/black-walnut-toxicity/)',
    note: '"The toxic effects of a mature black walnut tree can extend 50 to 80 feet from the trunk of the tree, with the greatest toxicity occurring within the tree’s dripline." "Vegetables such as tomato, potato, eggplant and pepper, and ornamentals such as lilac, peony, rhododendron and azalea are particularly sensitive to juglone."'
  },
  {
    id: 'fn-67',
    author: 'Jackson, D. R. (2018)',
    title: 'Mulching Landscape Trees',
    journal: 'Penn State Extension, updated 12 April 2018 (https://extension.psu.edu/mulching-landscape-trees)',
    note: 'Overmulching lets trunk diseases enter through constantly wet, decaying bark (fungal cankers and root rots); voles and mice tunnel under deep mulch and gnaw the inner bark of young trees, girdling the stem.'
  },
  {
    id: 'fn-68',
    author: 'Lukas, S., Davis, A., Dixon, E., Detweiler, A. J., & Sanchez, N. (2025) & Hart, J. M., Strik, B. C., DeMoranville, C., Davenport, J. R., & Roper, T. (2015)',
    title: 'Growing blueberries in your home garden (EC 1304) / Cranberries: A nutrient management guide for south coastal Oregon (EM 8672)',
    journal: 'Oregon State University Extension Service (https://extension.oregonstate.edu/catalog/pub/ec-1304-growing-blueberries-your-home-garden ; https://ir.library.oregonstate.edu/xmlui/bitstream/handle/1957/54896/em8672.pdf)',
    note: '"Blueberries require a soil pH of 4.5 to 5.5." "Optimal soil pH for cranberry production is between 4.0 and 5.5."'
  },
  {
    id: 'fn-69',
    author: 'Royal Horticultural Society (n.d.)',
    title: 'Lavender: growing guide',
    journal: 'RHS (https://www.rhs.org.uk/plants/lavender/growing-guide)',
    note: 'Lavender "prefers poor, dry or moderately fertile soil, including chalky and alkaline soils" and "will not thrive in heavy clay soil or any soil that becomes waterlogged over winter".'
  },
  {
    id: 'fn-70',
    author: 'NC State Extension Gardener Plant Toolbox (n.d.)',
    title: 'Camellia sinensis',
    journal: 'North Carolina State University Extension (https://plants.ces.ncsu.edu/plants/camellia-sinensis/)',
    note: '"Camellia sinensis var. sinensis is the Chinese variety that has small leaves and is more tolerant of cold weather hardy into USDA Zone 6. C. sinensis var. assamica … with larger leaves hardy to zone 7 and south"; var. sinensis leaves are 2–3 inches long.'
  },
  {
    id: 'fn-71',
    author: 'Nobre, A. C., Rao, A., & Owen, G. N. (2008)',
    title: 'L-theanine, a natural constituent in tea, and its effect on mental state',
    journal: 'Asia Pacific Journal of Clinical Nutrition, 17(Suppl 1), pp. 167–168 (PMID: 18296328)',
    note: 'EEG studies: L-theanine increases activity in the alpha frequency band, indicating a relaxed mind without drowsiness; a 50 mg dose (n = 16, vs. placebo n = 19) gave a greater increase in alpha activity than placebo.'
  },
  {
    id: 'fn-72',
    author: 'Monteiro, J., Alves, M., Oliveira, P., & Silva, B. (2016)',
    title: 'Structure-Bioactivity Relationships of Methylxanthines: Trying to Make Sense of All the Promises and the Drawbacks',
    journal: 'Molecules, 21(8), 974 (DOI: 10.3390/molecules21080974)',
    note: '"Caffeine content is 2%–3% dry weight in young leaves of first flush shoots of Camellia sinensis, Camellia assamica and Camellia taliensis."'
  },
  {
    id: 'fn-73',
    author: 'Lin, Y.-S., Tsai, Y.-J., Tsay, J.-S., & Lin, J.-K. (2003)',
    title: 'Factors Affecting the Levels of Tea Polyphenols and Caffeine in Tea Leaves',
    journal: 'Journal of Agricultural and Food Chemistry, 51(7), pp. 1864–1873 (DOI: 10.1021/jf021066b)',
    note: 'In fresh tea leaves, "the old tea leaves contain less caffeine but more EGCG and total catechins than young ones."'
  },
  {
    id: 'fn-74',
    author: 'Li, P., Xu, Y., Zhang, Y., Fu, J., Yu, S., Guo, H., Chen, Z., Chen, C., Yang, X., Wang, S., & Zhao, J. (2020)',
    title: 'Metabolite Profiling and Transcriptome Analysis Revealed the Chemical Contributions of Tea Trichomes to Tea Flavors and Tea Plant Defenses',
    journal: 'Journal of Agricultural and Food Chemistry, 68(41), pp. 11389–11401 (DOI: 10.1021/acs.jafc.0c04075)',
    note: 'The unicellular, nonglandular tea trichomes produce characteristic tea metabolites such as UV-protective flavonoids, caffeine, herbivore-defensive volatiles and theanine.'
  },
  {
    id: 'fn-75',
    author: 'Cao, H., Li, J., Ye, Y., Lin, H., Hao, Z., Ye, N., & Yue, C. (2020)',
    title: 'Integrative Transcriptomic and Metabolic Analyses Provide Insights into the Role of Trichomes in Tea Plant (Camellia Sinensis)',
    journal: 'Biomolecules, 10(2), 311 (DOI: 10.3390/biom10020311)',
    note: 'Catechins, caffeine, amino acids and aroma compounds were measured in tea trichomes and leaves; most of these compounds were significantly less abundant in trichomes than in leaves.'
  },
  {
    id: 'fn-76',
    author: 'Morita, A., Yanagisawa, O., Takatsu, S., Maeda, S., & Hiradate, S. (2008)',
    title: 'Mechanism for the detoxification of aluminum in roots of tea plant (Camellia sinensis (L.) Kuntze)',
    journal: 'Phytochemistry, 69(1), pp. 147–153 (DOI: 10.1016/j.phytochem.2007.06.007)',
    note: 'Oxalate is a key Al-chelating compound in the mechanism of aluminum detoxification in tea roots.'
  },
  {
    id: 'fn-77',
    author: 'Zeng, R., Liu, Y., Yu, L., Lei, X., Jiang, J., Shen, Q., Ma, Y., Fang, W., & Zhu, X. (2025)',
    title: 'Interaction Between CsATG8f and CsRAP2.12 Modulates Antioxidant Defense and Hypoxia Response During Submergence in Camellia sinensis',
    journal: 'International Journal of Molecular Sciences, 27(1), 235 (DOI: 10.3390/ijms27010235)',
    note: 'Describes the "moisture-loving yet waterlogging-sensitive nature of tea plants": waterlogging caused by excessive soil moisture or impaired drainage inhibits tea growth and reduces yield and quality.'
  },
  {
    id: 'fn-78',
    author: 'Carr, H. P., Lombi, E., Küpper, H., McGrath, S. P., & Wong, M. H. (2003)',
    title: 'Accumulation and distribution of aluminium and other elements in tea (Camellia sinensis) leaves',
    journal: 'Agronomie, 23(8), pp. 705–710 (DOI: 10.1051/agro:2003045)',
    note: 'Total Al concentrations in young and old tea leaves were 380 and 6866 µg/g, respectively.'
  },
  {
    id: 'fn-79',
    author: 'Sano, T., Horie, H., Matsunaga, A., & Hirono, Y. (2018)',
    title: 'Effect of shading intensity on morphological and color traits and on chemical components of new tea (Camellia sinensis L.) shoots under direct covering cultivation',
    journal: 'Journal of the Science of Food and Agriculture, 98(15), pp. 5666–5676 (DOI: 10.1002/jsfa.9112)',
    note: 'Under covering (shading) culture, new tea leaves were thinner, with larger SPAD values and chlorophyll contents; covering decreased epicatechin and epigallocatechin and increased theanine and caffeine.'
  },
  {
    id: 'fn-80',
    author: 'Dana, M. N., & Lerner, B. R. (1994)',
    title: 'Black Walnut Toxicity (HO-193)',
    journal: 'Purdue University Cooperative Extension Service, rev. 2/94 (https://www.extension.purdue.edu/extmedia/HO/HO-193.pdf)',
    note: 'Juglone occurs in all parts of the black walnut, most in buds, hulls and roots; butternut, English walnut, pecan and hickories produce "such limited quantities compared to the black walnut that toxicity to other plants is rarely observed". Observed sensitive: e.g. tomato, potato, apple, pear, blueberry, azalea, rhododendron, black alder, alfalfa, crimson clover; observed tolerant: e.g. cherry, black raspberry, autumn olive, pawpaw, ferns, hyacinth, lungwort, snowdrop, winter aconite, sweet Cicely, sweet woodruff, narcissus (some). The lists are "for guidance, but not regarded as definitive".'
  },
  {
    id: 'fn-81',
    author: 'Chaanin, A., & Preil, W. (1994)',
    title: 'Influence of bicarbonate on iron deficiency chlorosis in Rhododendron',
    journal: 'Acta Horticulturae, 364, pp. 71–78 (DOI: 10.17660/ActaHortic.1994.364.8)',
    note: 'Increasing bicarbonate (HCO3−) concentrations induced typical iron-deficiency chlorosis in rhododendron, whereas calcium supplied as CaSO4 caused no chlorosis.'
  },
  {
    id: 'fn-82',
    author: 'Hunan Provincial Forestry Department (湖南省林业厅) (2011)',
    title: '铁观音茶树的修剪方法 (Pruning methods for Tieguanyin tea bushes)',
    journal: 'lyj.hunan.gov.cn, 25 July 2011 (http://lyj.hunan.gov.cn/lyj/tslm_71206/lykp/syjs/201512/t20151227_2598325.html)',
    note: '"深修剪主要是剪除铁观音茶树的鸡爪枝、冗生枝、枯枝" – deep pruning mainly removes the crow\'s-feet twigs (Jizhao Zhi), superfluous and dead twigs of the tea bush, so that new production branches form.'
  },
  {
    id: 'fn-83',
    author: 'Fair, B. (2020)',
    title: 'General Pruning Techniques (AG-780-03)',
    journal: 'NC State Extension, published 7 April 2020, reviewed/revised 5 March 2025 (https://content.ces.ncsu.edu/general-pruning-techniques)',
    note: '"Cut back to ¼ inch above a vigorous branch or bud that is pointing in the direction in which you want the plant to grow."'
  },
  {
    id: 'fn-84',
    author: 'Yamashita, H., Tanaka, Y., Umetsu, K., Morita, S., Ono, Y., Suzuki, T., Takemoto, T., Morita, A., & Ikka, T. (2020)',
    title: 'Phenotypic Markers Reflecting the Status of Overstressed Tea Plants Subjected to Repeated Shade Cultivation',
    journal: 'Frontiers in Plant Science, 11, 556476 (DOI: 10.3389/fpls.2020.556476)',
    note: 'Shade cultivation reduces the incident irradiation on tea plants by 60–98% (typically 85%) and is generally applied when two leaves have developed on most new buds, for about 10–30 days; the Kabusecha-style treatment used 85% black cloth for 15 days (first crop) or 10 days (second crop), the Tencha (Matcha)-style treatment 85% for 30 days (first crop) or 15 days (second crop).'
  },
  {
    id: 'fn-85',
    author: 'Kanda, M. (2010)',
    title: 'Production Technique of Shade Grown High Quality Tea in Japan – Matcha tea cultivation and production',
    journal: 'Conference paper, Tea Industry Research Division, Kyoto Prefectural Agriculture, Forestry and Fisheries Technology Center; o-cha.net (https://www.o-cha.net/english/conference2/pdf/2010/files/PROC/pr-s-06.pdf)',
    note: 'Shade-grown Matcha and Gyokuro contain more free amino acids than Sencha, and Matcha, shaded longer, more than Gyokuro; shading increases MMSC, which is converted to dimethyl sulfide (DMS), the "aroma result from shade", when heated; high-quality Matcha requires an 85–98% shading rate for at least 30 days.'
  },
  {
    id: 'fn-86',
    author: 'Qi, D., Lu, M., Shi, Y., Zhang, X., Yue, L., Jia, H., Dong, C., Liu, H., & Yuan, C. (2025)',
    title: 'Volatile metabolomics highlights tea trichome\'s positive contribution to aroma and quality of white tea',
    journal: 'Current Research in Food Science, 11, 101179 (DOI: 10.1016/j.crfs.2025.101179)',
    note: '"The most renowned types of white tea are silver needle (Baihao Yinzhen, bud only) and white peony (Baimudan, one bud and one or two leaves)."'
  },
  {
    id: 'fn-87',
    author: 'Li, Y., Li, Y., Xiao, T., Jia, H., Xiao, Y., Liu, Z., Wang, K., & Zhu, M. (2024)',
    title: 'Integration of non-targeted/targeted metabolomics and electronic sensor technology reveals the chemical and sensor variation in 12 representative yellow teas',
    journal: 'Food Chemistry: X, 21, 101093 (DOI: 10.1016/j.fochx.2023.101093)',
    note: 'Yellow bud tea (e.g. Junshan Yinzhen, Huoshan Huangya, Mengding Huangya) "is prepared only using buds or one bud and one leaf".'
  },
  {
    id: 'fn-88',
    author: 'Liu, C., Wang, C., Wei, M., Ning, M., Xu, Z., Chen, S., Cui, J., Song, C., & Tang, Q. (2026)',
    title: 'Influence of leaf tenderness on the aroma and taste characteristics of green tea from Camellia sinensis cv. Chuancha No. 2: integrated sensory and chemical profiling',
    journal: 'Food Chemistry: X, 35, 103754 (DOI: 10.1016/j.fochx.2026.103754)',
    note: 'Teas "traditionally produced from one bud with one leaf (Longjing and Biluochun)" generally offer balanced chestnut-like or floral aromas with mellow, umami-rich tastes.'
  },
  {
    id: 'fn-89',
    author: 'Lu, X., Lin, Y., Tuo, Y., Liu, L., Du, X., Zhu, Q., Hu, Y., Shi, Y., Wu, L., & Lin, J. (2023)',
    title: 'Optimizing Processing Techniques of Oolong Tea Balancing between High Retention of Catechins and Sensory Quality',
    journal: 'Foods, 12(23), 4334 (DOI: 10.3390/foods12234334)',
    note: '"The banjhi tea shoots composed of one bud and two or three leaves were collected and applied to the production of oolong tea."'
  },
  {
    id: 'fn-90',
    author: 'Xue, J., Liu, P., Feng, L., Zheng, L., Gui, A., Wang, X., Wang, S., Ye, F., Teng, J., Gao, S., & Zheng, P. (2023)',
    title: 'Insights into the effects of fixation methods on the sensory quality of straight-shaped green tea and dynamic changes of key taste metabolites by widely targeted metabolomic analysis',
    journal: 'Food Chemistry: X, 20, 100943 (DOI: 10.1016/j.fochx.2023.100943)',
    note: 'In fixation, polyphenol oxidase and peroxidase are rapidly inactivated at high temperature, preventing enzymatic browning; fresh leaves were spread 8–10 h to about 70% moisture, roller fixation used 280–300 °C for 2 min, and the tea was parched at 100 °C for 5 min and dried at 80 °C for 60 min to below 6% moisture.'
  },
  {
    id: 'fn-91',
    author: 'Li, M., Guo, L., Zhu, R., Yang, D., Xiao, Y., Wu, Y., Zhong, K., Huang, Y., & Gao, H. (2022)',
    title: 'Effect of Fixation Methods on Biochemical Characteristics of Green Teas and Their Lipid-Lowering Effects in a Zebrafish Larvae Model',
    journal: 'Foods, 11(11), 1582 (DOI: 10.3390/foods11111582)',
    note: 'Pan-fired green tea was made with "pan-fire fixation (180–200 °C; 8–10 min; water content, 60%)".'
  },
  {
    id: 'fn-92',
    author: 'Wu, S., Zhang, D., Hu, S., Li, C., Dong, Z., Hu, Y., Fan, F., Ye, J., Zheng, X., Liang, Y., Yu, L., & Lu, J. (2025)',
    title: 'Optimization of the sealed yellowing parameters and suitability evaluation of the different cultivars for manufacturing the Pingyang Huangtang tea',
    journal: 'Food Chemistry: X, 28, 102615 (DOI: 10.1016/j.fochx.2025.102615)',
    note: 'Shoots were fixed in a hot pan at about 280 °C to around 45% moisture; sealed yellowing at 60 °C and 70% RH for 10 h with two ventilations gave the best quality; chlorophylls were converted to pheophytins during yellowing; yellowed leaves (and a green-tea comparison) were dried at 110 °C for 10 min and then at 90 °C to below 6% moisture.'
  },
  {
    id: 'fn-93',
    author: 'Wang, W., Feng, Z., Min, R., Yin, J., & Jiang, H. (2024)',
    title: 'The Effect of Temperature and Humidity on Yellow Tea Volatile Compounds during Yellowing Process',
    journal: 'Foods, 13(20), 3283 (DOI: 10.3390/foods13203283)',
    note: 'During yellowing, amino acids and sucrose increase, accompanied by chlorophyll degradation, flavan-3-ol decomposition and a reduction of catechins, flavonol glycosides and caffeine, which decreases bitterness.'
  },
  {
    id: 'fn-94',
    author: 'Chen, Q., Shi, J., Mu, B., Chen, Z., Dai, W., & Lin, Z. (2020)',
    title: 'Metabolomics combined with proteomics provides a novel interpretation of the changes in nonvolatile compounds during white tea processing',
    journal: 'Food Chemistry, 332, 127412 (DOI: 10.1016/j.foodchem.2020.127412)',
    note: 'During white-tea withering, 13 free amino acids, caffeine and theaflavins increased while theanine and catechins decreased; proteomics showed that protein degradation accounted for the increase in free amino acids.'
  },
  {
    id: 'fn-95',
    author: 'Deng, X., Shang, H., Chen, J., Wu, J., Wang, T., Wang, Y., Zhu, C., & Sun, W. (2022)',
    title: 'Metabolomics Combined with Proteomics Provide a Novel Interpretation of the Changes in Flavonoid Glycosides during White Tea Processing',
    journal: 'Foods, 11(9), 1226 (DOI: 10.3390/foods11091226)',
    note: 'During prolonged white-tea withering, the moisture content of fresh tea leaves is continuously reduced "from 70–78% to 20–30%".'
  },
  {
    id: 'fn-96',
    author: 'Lin, S.-Y., Lo, L.-C., Chen, I.-Z., & Chen, P.-A. (2016)',
    title: 'Effect of shaking process on correlations between catechins and volatiles in oolong tea',
    journal: 'Journal of Food and Drug Analysis, 24(3), pp. 500–507 (DOI: 10.1016/j.jfda.2016.01.011)',
    note: 'During indoor withering, oolong leaves are shaken three to five times at intervals of about 2 hours; the initial mild shaking mainly redistributes moisture from the stalk to the leaves, while heavy shaking releases catechins from the vacuoles.'
  },
  {
    id: 'fn-97',
    author: 'Wu, Z., Liao, W., Zhao, H., Qiu, Z., Zheng, P., Liu, Y., Lin, X., Yao, J., Li, A., Tan, X., Sun, B., Meng, H., & Liu, S. (2024)',
    title: 'Differences in the Quality Components of Wuyi Rock Tea and Huizhou Rock Tea',
    journal: 'Foods, 14(1), 4 (DOI: 10.3390/foods14010004)',
    note: 'Rock tea processing: sun-drying → withering (8–13 h) → fixing (350–380 °C, 10–11 min) → rolling → two water-removing roastings (120–130 °C) → charcoal roasting twice (110–125 °C, 12–14 h).'
  },
  {
    id: 'fn-98',
    author: 'Zeng, L., Zhou, Y., Fu, X., Liao, Y., Yuan, Y., Jia, Y., Dong, F., & Yang, Z. (2018) & Zhou, Y., Zeng, L., Liu, X., Gui, J., Mei, X., Fu, X., Dong, F., Tang, J., Zhang, L., & Yang, Z. (2017)',
    title: 'Biosynthesis of Jasmine Lactone in Tea (Camellia sinensis) Leaves and Its Formation in Response to Multiple Stresses / Formation of (E)-nerolidol in tea (Camellia sinensis) leaves exposed to multiple stresses during tea manufacturing',
    journal: 'Journal of Agricultural and Food Chemistry, 66(15), pp. 3899–3909 (DOI: 10.1021/acs.jafc.8b00515); Food Chemistry, 231, pp. 78–86 (DOI: 10.1016/j.foodchem.2017.03.122)',
    note: 'Jasmine lactone accumulated mostly at the turn-over stage of oolong manufacture, enhanced by continuous mechanical damage (via lipoxygenase CsLOX1); continuous mechanical damage simulating turn-over also enhanced CsNES expression and (E)-nerolidol content.'
  },
  {
    id: 'fn-99',
    author: 'Chen, L., Wang, J., Yang, Y., Wang, H., Xu, A., Ma, J., Wang, Y., & Xu, P. (2024)',
    title: 'Identifying the temporal contributors and their interactions during dynamic formation of black tea cream',
    journal: 'Food Chemistry, 448, 139138 (DOI: 10.1016/j.foodchem.2024.139138)',
    note: 'Tea cream forms in hot, strong tea infusion while cooling; proteins, caffeine and phenolics dominate its formation, and caffeine–theaflavin complexation may be the core skeleton of the growing particles in black tea infusion.'
  },
  {
    id: 'fn-100',
    author: 'Xiang, M., Chu, J., Cai, W., Ma, H., Zhu, W., Zhang, X., Ren, J., Xiao, L., Liu, D., & Liu, X. (2022)',
    title: 'Microbial Succession and Interactions During the Manufacture of Fu Brick Tea',
    journal: 'Frontiers in Microbiology, 13, 892437 (DOI: 10.3389/fmicb.2022.892437)',
    note: 'Pile fermentation of Fu brick tea is normally conducted at over 86% RH and above 25 °C for up to 40 h; "golden flower" blooming occurs at relative humidity under 70% and above 25 °C for around 21 days; the golden cleistothecia are produced by Aspergillus cristatus (sexual morph Eurotium-like).'
  },
  {
    id: 'fn-101',
    author: 'Ma, W., Yao, H., Zhao, L., & Lv, H. (2026)',
    title: 'Effects of the flowering process on the metabolite profiles and bioactivities of Shaanxi Fu brick tea',
    journal: 'Food Chemistry: X, 35, 103741 (DOI: 10.1016/j.fochx.2026.103741)',
    note: 'Catechins and related phenolics undergo oxidative polymerisation, giving rise sequentially to theaflavins, thearubigins and ultimately theabrownins; wet-pile fermentation runs at a moisture content of about 60%; flowering lowered tea polyphenols by 13% and free amino acids by 38%.'
  },
  {
    id: 'fn-102',
    author: 'Stewart, W. D. P., & Pearson, M. C. (1967)',
    title: 'Nodulation and nitrogen-fixation by Hippophaë rhamnoides L. in the field',
    journal: 'Plant and Soil, 26(2), pp. 348–360 (DOI: 10.1007/BF01880184)',
    note: 'Soil plus plant nitrogen increased with the age of sea buckthorn stands, from 27 kg N per hectare per year under bushes 0–3 years old to 179 kg N per hectare per year under bushes 13–16 years old; nitrogen contributions from other sources could not be ruled out.'
  },
  {
    id: 'fn-103',
    author: 'Garden Organic (n.d.)',
    title: 'Growing comfrey',
    journal: 'gardenorganic.org.uk (https://www.gardenorganic.org.uk/expert-advice/all-about-comfrey/growing-comfrey)',
    note: '"If your plant/s are established, leaves can be harvested approximately every six weeks from June." "Don\'t harvest later than September as the plant will need to recover before it dies back in winter." The maximum harvest is "four to five cuts each growing season".'
  },
  {
    id: 'fn-104',
    author: 'Szczukowski, S., Stolarski, M., Tworkowski, J., Przyborowski, J., & Klasa, A. (2005)',
    title: 'Productivity of willow coppice plants grown in short rotations',
    journal: 'Plant, Soil and Environment, 51(9), pp. 423–430 (DOI: 10.17221/3607-PSE)',
    note: 'With an annual harvest cycle, the number of stems per stool averaged 12.14 (S. viminalis clones about 9.7–12.6), significantly more than with two-, three- or four-year cycles (7.38, 4.47 and 2.88).'
  },
  {
    id: 'fn-105',
    author: 'Faiku, F., Haziri, A., Faiku, F., & Faiku, B. (2025)',
    title: 'Composition of some macro and micro elements, polyphenol content, antimicrobial and antioxidant activity of Achillea millefolium (L.) grown in Kosovo',
    journal: 'Chemija, 36(2) (DOI: 10.6001/chemija.2025.36.2.3)',
    note: 'Yarrow contained N 9.95, P 6.15, K 23.85, Ca 21.98 and Mg 6.95 g/kg, Fe 59.85, Zn 35.42 and Cu 10.75 mg/kg; potassium and calcium were the most abundant macro-elements.'
  },
  {
    id: 'fn-106',
    author: 'Plaszkó, T., Szűcs, Z., Vasas, G., & Gonda, S. (2021)',
    title: 'Effects of Glucosinolate-Derived Isothiocyanates on Fungi: A Comprehensive Review on Direct Effects, Mechanisms, Structure-Activity Relationship Data and Possible Agricultural Applications',
    journal: 'Journal of Fungi, 7(7), 539 (DOI: 10.3390/jof7070539)',
    note: 'Glucosinolates are enzymatically converted into isothiocyanates upon fungal challenge or tissue disruption; reviews the antifungal effects of isothiocyanates and biofumigation studies.'
  },
  {
    id: 'fn-107',
    author: 'Che, X., Moir, J. L., Black, A. D., Sheng, H., & Li, X. (2018)',
    title: 'Effects of perennial (\'Russell\') lupins on soil nitrogen and carbon in acid high-country soils',
    journal: 'Journal of New Zealand Grasslands, 80, pp. 67–72 (DOI: 10.33584/jnzg.2018.80.346)',
    note: 'Sites planted with perennial lupin (Lupinus polyphyllus) had significantly higher total soil N and mineralisable N than adjacent pasture soils at all eight sites.'
  },
  {
    id: 'fn-108',
    author: 'Kalembasa, S., Szukała, J., Faligowska, A., Kalembasa, D., Symanowicz, B., Becher, M., & Gebus-Czupyt, B. (2020)',
    title: 'Quantification of Biologically Fixed Nitrogen by White Lupin (Lupins albus L.) and Its Subsequent Uptake by Winter Wheat Using the 15N Isotope Dilution Method',
    journal: 'Agronomy, 10(9), 1392 (DOI: 10.3390/agronomy10091392)',
    note: 'White lupin biomass contained 243.2 kg N/ha, of which 111.2 kg N/ha was fixed from the atmosphere – 93.7 kg/ha ended up in the seeds and 17.5 kg/ha in the crop residues.'
  },
  {
    id: 'fn-109',
    author: 'Thilakarathna, M. S., & Raizada, M. N. (2019)',
    title: 'A Biosensor-Based Assay (GlnLux-Agar) Shows Defoliation Triggers Rapid Release of Glutamine from Nodules and Young Roots of Forage Legumes',
    journal: 'Phytobiomes Journal, 3(2), pp. 85–91 (DOI: 10.1094/PBIOMES-03-19-0014-R)',
    note: 'In alfalfa, red clover and white clover, defoliation induced rhizodeposition of nitrogen compounds; glutamine release started within 2 h after defoliation and came primarily from nodules and young roots.'
  },
  {
    id: 'fn-110',
    author: 'Šukele, R., Lauberte, L., Kovalcuka, L., Logviss, K., Bārzdiņa, A., Brangule, A., Horváth, Z. M., & Bandere, D. (2023)',
    title: 'Chemical Profiling and Antioxidant Activity of Tanacetum vulgare L. Wild-Growing in Latvia',
    journal: 'Plants, 12(10), 1968 (DOI: 10.3390/plants12101968)',
    note: 'Tansy extracts showed "a remarkable variation in the thujone (α + β) content (0.4% up to 6%)".'
  },
  {
    id: 'fn-111',
    author: 'Yuan, S., Zhang, N., Wu, X., Qian, Y., Chen, X., Raza, W., & Li, X. (2017)',
    title: 'Effect of pruned material, extracts, and polyphenols of tea on enzyme activities and microbial community structure in soil',
    journal: 'Soil Science and Plant Nutrition, 63(6), pp. 607–615 (DOI: 10.1080/00380768.2017.1400896)',
    note: '10-week pot incubation: returning tea pruned material or its extracts significantly increased soil pH compared with the control, and raised soil invertase and urease activities.'
  },
  {
    id: 'fn-112',
    author: 'Miladinović, D. L., Dimitrijević, M. V., Miladinović, L. C., Stamenković, J. G., & Mihajilov-Krstev, T. M. (2025)',
    title: 'Study of Hyssop Essential Oil from Southeastern Serbia',
    journal: 'Chemistry & Biodiversity, 22(2), e202401954 (DOI: 10.1002/cbdv.202401954)',
    note: 'Hyssop essential oils showed antibacterial activity (MIC/MMC 2.4–160 mg/mL); the proportions of their dominant compounds, eucalyptol and cis-pinocamphone, affected the antibacterial activity.'
  },
  {
    id: 'fn-113',
    author: 'Abbasi, M. K., Tahir, M. M., Sabir, N., & Khurshid, M. (2015)',
    title: 'Impact of the addition of different plant residues on nitrogen mineralization–immobilization turnover and carbon content of a soil incubated under laboratory conditions',
    journal: 'Solid Earth, 6(1), pp. 197–205 (DOI: 10.5194/se-6-197-2015)',
    note: 'Elaeagnus umbellata leaves (sampled in late autumn) contained 34.7 g/kg total N (C:N 12.1); in a laboratory incubation they showed net N mineralization, with 33% N recovery.'
  },
  {
    id: 'fn-114',
    author: 'Atoloye, I. A., Adesina, I. S., Sharma, H., Subedi, K., Liang, C.-L. K., Shahbazi, A., & Bhowmik, A. (2022)',
    title: 'Hemp biochar impacts on selected biological soil health indicators across different soil types and moisture cycles',
    journal: 'PLOS ONE, 17(2), e0264620 (DOI: 10.1371/journal.pone.0264620)',
    note: 'Reported C:N ratios of 46.7 for hemp residue, 67.6 for hemp biochar and 229 for hardwood biochar.'
  },
  {
    id: 'fn-115',
    author: 'Atis, I., Celiktas, N., Can, E., & Yilmaz, S. (2019)',
    title: 'The effects of cutting intervals and seeding rates on forage yield and quality of alfalfa',
    journal: 'Turkish Journal of Field Crops, pp. 12–20 (DOI: 10.17557/tjfc.562632)',
    note: 'Compared cutting programmes at 20-, 30- and 40-day intervals; a 30-day cutting interval was recommended.'
  },
  {
    id: 'fn-116',
    author: 'Sutton, D. K., MacHardy, W. E., & Lord, W. G. (2000)',
    title: 'Effects of Shredding or Treating Apple Leaf Litter with Urea on Ascospore Dose of Venturia inaequalis and Disease Buildup',
    journal: 'Plant Disease, 84(12), pp. 1319–1326 (DOI: 10.1094/PDIS.2000.84.12.1319)',
    note: 'Ascospores produced on diseased leaves in the leaf litter are the primary inoculum of apple scab; in the northeastern United States, "shredding the leaf litter in November or April will reduce the risk of scab by 80 to 90% if all of the leaf litter is shredded"; urea applied to the litter reduced trapped ascospores by 50% (November) or 66% (April).'
  },
  {
    id: 'fn-117',
    author: 'Seven Cups Fine Chinese Teas (2019)',
    title: 'The Complex Identity of Yue Guang Bai "White Moonlight"',
    journal: 'Seven Cups blog, post by Andrew, 27 September 2019 (https://sevencups.com/2019/09/the-complex-identity-of-yue-guang-bai-white-moonlight/)',
    note: 'Tea-trade article: "Yue Guang Bai leaves are not withered in the typical hot noon sunlight. Rather, they are withered indoors or can even be withered outside at night (poetically speaking) \'under the moonlight\'"; the variety is named as Yangta Da Bai Cha.'
  },
  {
    id: 'fn-118',
    author: 'Sawamura, S., & Masuzawa, T. (1982)',
    title: 'Refiring of Over-Steamed Tea (Fukamushi-cha)',
    journal: 'Chagyo Kenkyu Hokoku (Tea Research Journal), 1982(55), pp. 63–67 (DOI: 10.5979/cha.1982.63)',
    note: 'Study on refiring Fukamushi-cha, which the title identifies as "over-steamed tea", i.e. Japanese green tea steamed for longer than usual.'
  },
  {
    id: 'fn-119',
    author: 'Golian, J., Anyszka, Z., & Kwiatkowska, J. (2023)',
    title: 'Multifunctional living mulches for weeds control in organic apple orchards',
    journal: 'Acta Scientiarum Polonorum Hortorum Cultus, 22(2), pp. 73–84 (DOI: 10.24326/asphc.2023.4473)',
    note: 'Living mulches in the tree rows of an organic apple orchard in Poland, compared with the natural cover: peppermint cut summer weed numbers by 53.6 % and weed cover by about 70 %, nasturtium halved spring weed numbers (-50.4 %), lady\'s mantle reduced summer weed numbers by 37.4 %, and strawberry reduced summer weed cover by about 30 % but weed numbers by only 16.7 %. Tree growth was not measured.'
  },
  {
    id: 'fn-120',
    author: 'Restuccia, A., Scavo, A., Lombardo, S., Pandino, G., Fontanazza, S., Anastasi, U., Abbate, C., & Mauromicale, G. (2020)',
    title: 'Long-term effect of cover crops on species abundance and diversity of weed flora',
    journal: 'Plants, 9(11), 1506 (DOI: 10.3390/plants9111506)',
    note: 'Five-season trial in a Sicilian apricot orchard: subterranean clover covers reduced weed biomass by 32.3–40.9 % on average (up to 86 % in single seasons) and the weed seedbank by 40.5–57 % compared with tilled soil.'
  },
  {
    id: 'fn-121',
    author: 'Song, B. Z., Wu, H. Y., Kong, Y., Zhang, J., Du, Y. L., Hu, J. H., & Yao, Y. C. (2010)',
    title: 'Effects of intercropping with aromatic plants on the diversity and structure of an arthropod community in a pear orchard',
    journal: 'BioControl, 55(6), pp. 741–751 (DOI: 10.1007/s10526-010-9301-2)',
    note: 'In a Chinese pear orchard, five aromatic intercrops (among them basil, summer savory and cornflower) all lowered pest numbers compared with natural grass; only the cornflower plots also changed predator and parasitoid numbers significantly.'
  },
  {
    id: 'fn-122',
    author: 'Yim, B., Hanschen, F. S., Wrede, A., Nitt, H., Schreiner, M., Smalla, K., & Winkelmann, T. (2016)',
    title: 'Effects of biofumigation using Brassica juncea and Raphanus sativus in comparison to disinfection using Basamid on apple plant growth and soil microbial communities at three field sites with replant disease',
    journal: 'Plant and Soil, 406(1–2), pp. 389–408 (DOI: 10.1007/s11104-016-2876-3)',
    note: 'Indian mustard and oilseed radish grown, chopped and incorporated as biofumigation on apple replant-disease soil; apple rootstocks grew clearly better than in untreated soil at some sites but not at others, and the effect was weaker than soil disinfection with Basamid.'
  },
  {
    id: 'fn-123',
    author: 'Pirhofer-Walzl, K., Eriksen, J., Rasmussen, J., Høgh-Jensen, H., Søegaard, K., & Rasmussen, J. (2013)',
    title: 'Effect of four plant species on soil 15N-access and herbage yield in temporary agricultural grasslands',
    journal: 'Plant and Soil, 371(1–2), pp. 313–325 (DOI: 10.1007/s11104-013-1694-0)',
    note: '15N-enriched ammonium sulphate was placed at 0.4, 0.8 and 1.2 m depth: "deep-rooting chicory acquired relatively large amounts of deep soil 15N"; the legumes (lucerne, white clover) fixed large amounts of N2 and spared N for non-leguminous plants.'
  },
  {
    id: 'fn-124',
    author: 'Kristensen, H. L., & Thorup-Kristensen, K. (2004)',
    title: 'Root growth and nitrate uptake of three different catch crops in deep soil layers',
    journal: 'Soil Science Society of America Journal, 68(2), pp. 529–537 (DOI: 10.2136/sssaj2004.5290)',
    note: 'Fodder radish roots grew deeper than 2.4 m (Italian ryegrass 0.6 m, winter rye 1.1 m), and fodder radish left 18 kg nitrate-N/ha in the soil versus 87 kg under ryegrass.'
  },
  {
    id: 'fn-125',
    author: 'Clark, A. (Ed.) (2007)',
    title: 'Sorghum sudangrass hybrids. In: Managing Cover Crops Profitably (3rd ed.)',
    journal: 'SARE Handbook Series 9, Sustainable Agriculture Research and Education (https://www.sare.org/publications/managing-cover-crops-profitably/nonlegume-cover-crops/sorghum-sudangrass/)',
    note: '"Mowing whenever stalks reach 3 to 4 feet tall increases root mass five to eight times"; "For mid-summer cuttings, leave at least 6 inches of stubble"; for nematode control "the cover crop needs to be tilled before frost while it is still green. Otherwise, the nematicidal effect is lost"; the root exudate sorgoleone suppressed pine and redbud tree seedlings in nursery tests.'
  },
  {
    id: 'fn-126',
    author: 'Björkman, T., Bellinder, R. R., Hahn, R. R., & Shail, J. W. (2008)',
    title: 'Buckwheat Cover Crop Handbook',
    journal: 'Cornell University, Geneva, NY (http://www.hort.cornell.edu/bjorkman/lab/covercrops/pdf/bwbrochure.pdf)',
    note: '"Mow no later than 10 days after plants begin to flower (about 6 weeks after seeding). Or else, leave to reseed."'
  },
  {
    id: 'fn-127',
    author: 'Jacometti, M. A., Wratten, S. D., & Walter, M. (2007)',
    title: 'Enhancing ecosystem services in vineyards: using cover crops to decrease botrytis bunch rot severity',
    journal: 'International Journal of Agricultural Sustainability, 5(4), pp. 305–314 (DOI: 10.1080/14735903.2007.9684830)',
    note: 'In a New Zealand Chardonnay vineyard, inter-row phacelia mulched in place in winter raised soil moisture and biological activity, sped up the breakdown of vine debris, reduced Botrytis cinerea inoculum on that debris and lowered bunch rot severity at flowering and harvest.'
  },
  {
    id: 'fn-128',
    author: 'Sundermeier, A. (2008)',
    title: 'Oilseed Radish Cover Crop (SAG-5)',
    journal: 'Ohio State University Extension (https://ohioline.osu.edu/factsheet/SAG-5)',
    note: 'Oilseed radish needs about 60 days of growth; freezing at about 20 °F (-7 °C) kills it, and in mild autumns it should be mowed or tilled before seed set because it can become a weed.'
  },
  {
    id: 'fn-129',
    author: 'Jama, B., Palm, C. A., Buresh, R. J., Niang, A., Gachengo, C., Nziguheba, G., & Amadalo, B. (2000); Orwa, C., et al. (2009); Kriticos, J. M., & Kriticos, D. J. (2021)',
    title: 'Tithonia diversifolia as a green manure for soil fertility improvement in western Kenya: A review / Agroforestree Database 4.0: Tithonia diversifolia / Pretty (and) invasive: The potential global distribution of Tithonia diversifolia under current and future climates',
    journal: 'Agroforestry Systems, 49(2), pp. 201–221 (DOI: 10.1023/A:1006339025728); World Agroforestry Centre (https://apps.worldagroforestry.org/treedb/AFTPDFS/Tithonia_diversifolia.PDF); Invasive Plant Science and Management, 14(4), pp. 205–213 (DOI: 10.1017/inp.2021.29)',
    note: 'Jama et al.: green tithonia leaves average about 3.5 % N, 0.37 % P and 4.1 % K of dry matter; a sole hedge yields about 1 kg dry biomass per metre per year; the biomass decomposes rapidly; transferring it redistributes nutrients within the farm. Orwa et al.: tithonia flowers and produces seeds throughout the year, and its light seeds are dispersed by wind, water and animals. Kriticos & Kriticos: an invasive plant and notorious environmental weed in introduced habitats.'
  },
  {
    id: 'fn-130',
    author: 'Tea Research Institute of Sri Lanka (2018) & Orwa, C., et al. (2009)',
    title: 'Guidelines for establishment of energy plantations with Gliricidia sepium and Calliandra calothrysus (Guideline No. 04/2018) / Agroforestree Database 4.0: Gliricidia sepium',
    journal: 'TRI, Talawakelle (https://www.tri.lk/wp-content/uploads/2023/05/TRISL_Guideline_04_2018_E.pdf); World Agroforestry Centre (https://apps.worldagroforestry.org/treedb/AFTPDFS/Gliricidia_sepium.PDF)',
    note: 'TRI: "First lopping of branches can be done about 12 - 18 months after planting. Branches can be lopped at 8 - 12 month intervals before flowering." Orwa et al.: "Pruning at 0.3-1.5 m will stimulate leaf production"; leaves, seeds and bark are toxic.'
  },
  {
    id: 'fn-131',
    author: 'Herath, U. S., Wickramasinghe, W. M. D. M., Rankoth, L. M., & Egodawatta, W. C. P. (2023)',
    title: 'Decomposition and nitrogen mineralization of Gliricidia sepium leaf green manure under diverse nutrient management strategies in irrigated lowland rice cropping systems in Sri Lanka',
    journal: 'Tropical Agricultural Research and Extension, 26(3), pp. 162–179 (DOI: 10.4038/tare.v26i3.5648)',
    note: 'About 80 % of the nitrogen in incorporated Gliricidia leaves was released within 4–5 weeks.'
  },
  {
    id: 'fn-132',
    author: 'Southern Cover Crops Council (n.d.)',
    title: 'Cover crop information sheet: Vetch, common (Vicia sativa)',
    journal: 'Southern Cover Crops Council (https://southerncovercrops.org/wp-content/uploads/2018/10/Vetch-Common-Row-Crop-CP.pdf)',
    note: 'Preferred soil pH 6.0–7.0; inoculate with Rhizobium leguminosarum bv. viciae; terminate at about 80 % bloom; hard seed can make it a weed.'
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
                        <span><RichText text={text} onFootnote={scrollToFootnote} /></span>
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
                    <RichText text={tr.guidesMatchPlantsYourSoilTexture} onFootnote={scrollToFootnote} />
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
                  cut={<RichText text={tr.guidesCutJustAsFlowerBuds} onFootnote={scrollToFootnote} />}
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
                  much={<RichText text={tr.guidesCoppiceAll1YearRods} onFootnote={scrollToFootnote} />}
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
                  spread={<RichText text={tr.guidesSpreadFinelyAcrossZone2} onFootnote={scrollToFootnote} />}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-horseradish"
                  name={tr.guidesHorseradish}
                  latin={tr.guidesArmoraciaRusticanaAntifungal}
                  badge={tr.guides23LeafCutsAllyl}
                  cut={tr.guidesHarvestMatureOuterLeaves2}
                  much={tr.guidesCutOuter5060Foliage}
                  spread={<RichText text={tr.guidesCrushLeavesSlightlyHandSpread} onFootnote={scrollToFootnote} />}
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
                  spread={<RichText text={tr.guidesSpreadZone2Zone3} onFootnote={scrollToFootnote} />}
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
                  id="chop-plant-chives"
                  name={tr.guidesCommonChives}
                  latin={tr.guidesAlliumSchoenoprasumAlliumBarrier}
                  badge={tr.guides23SummerShearsQuick}
                  cut={tr.guidesShear23TimesBetween}
                  much={tr.guidesCutTop70FoliageDown}
                  spread={<RichText text={tr.guidesScatterClippingsDirectlyAlongZone} onFootnote={scrollToFootnote} />}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-tea-sinensis"
                  name={tr.guidesChineseTeaBush}
                  latin={tr.guidesCamelliaSinensisVarSinensisAcidifying}
                  badge={tr.guidesLateSpringSummerTanninsAcidic}
                  cut={tr.guidesPerformPluckPruningLateSpring}
                  much={tr.guidesTrimTop1015Cm}
                  spread={<RichText text={tr.guidesDropPruningsUnderAcidLoving} onFootnote={scrollToFootnote} />}
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
                  spread={<RichText text={tr.guidesChopScatterAcrossZone2} onFootnote={scrollToFootnote} />}
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
                  spread={<RichText text={tr.guidesChopBranchesFoliageSpreadAcross} onFootnote={scrollToFootnote} />}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-seabuckthorn"
                  name={tr.guidesSeaBuckthorn}
                  latin={tr.guidesHippophaeRhamnoidesActinorhizalShrub}
                  badge={tr.guidesAutumnBerryPruningNitrogenRodent}
                  cut={tr.guidesPruneDuringFruitHarvestAutumn}
                  much={tr.guidesRemove2030DenseFruiting}
                  spread={<RichText text={tr.guidesShredChopThornyBranchesInto} onFootnote={scrollToFootnote} />}
                />
                <ChopCard
                  tr={tr}
                  id="chop-tree-alder"
                  name={tr.guidesBlackAlder}
                  latin={tr.guidesAlnusGlutinosaKeystoneActinorhizal}
                  badge={tr.guidesWinterCoppiceSummerPollardUp}
                  cut={tr.guidesCoppice24YearRotational}
                  much={tr.guidesCoppiceAllUprightPolesDown}
                  spread={<RichText text={tr.guidesChipBranches7CmDiameter} onFootnote={scrollToFootnote} />}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-hemp"
                  name={tr.guidesIndustrialHemp}
                  latin={tr.guidesCannabisSativaLignocellulosicCarbon}
                  badge={tr.guides12CutsSeasonHigh}
                  cut={tr.guidesPruneMidSummerJulyBefore}
                  much={tr.guidesSummerTopMainStalks30}
                  spread={<RichText text={tr.guidesChopFibrousStalksInto10} onFootnote={scrollToFootnote} />}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-alfalfa"
                  name={tr.guidesAlfalfaLucerne}
                  latin={tr.guidesMedicagoSativaDeepTaprootNitrogen}
                  badge={tr.guides34CutsSeasonUltra}
                  cut={tr.guidesCutAtEarlyBudStage}
                  much={<RichText text={tr.guidesCutBack57Cm} onFootnote={scrollToFootnote} />}
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
                  spread={<RichText text={tr.guidesLayFreshlyWiltedFoliageAround} onFootnote={scrollToFootnote} />}
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
                <ChopCard
                  tr={tr}
                  id="chop-plant-sorghum-sudangrass"
                  name={tr.guidesChopSorghumSudangrassName}
                  latin={tr.guidesChopSorghumSudangrassLatin}
                  badge={tr.guidesChopSorghumSudangrassBadge}
                  cut={<RichText text={tr.guidesChopSorghumSudangrassCut} onFootnote={scrollToFootnote} />}
                  much={<RichText text={tr.guidesChopSorghumSudangrassMuch} onFootnote={scrollToFootnote} />}
                  spread={<RichText text={tr.guidesChopSorghumSudangrassSpread} onFootnote={scrollToFootnote} />}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-buckwheat"
                  name={tr.guidesChopBuckwheatName}
                  latin={tr.guidesChopBuckwheatLatin}
                  badge={tr.guidesChopBuckwheatBadge}
                  cut={<RichText text={tr.guidesChopBuckwheatCut} onFootnote={scrollToFootnote} />}
                  much={tr.guidesChopBuckwheatMuch}
                  spread={tr.guidesChopBuckwheatSpread}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-phacelia"
                  name={tr.guidesChopPhaceliaName}
                  latin={tr.guidesChopPhaceliaLatin}
                  badge={tr.guidesChopPhaceliaBadge}
                  cut={tr.guidesChopPhaceliaCut}
                  much={tr.guidesChopPhaceliaMuch}
                  spread={<RichText text={tr.guidesChopPhaceliaSpread} onFootnote={scrollToFootnote} />}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-fodder-radish"
                  name={tr.guidesChopFodderRadishName}
                  latin={tr.guidesChopFodderRadishLatin}
                  badge={tr.guidesChopFodderRadishBadge}
                  cut={<RichText text={tr.guidesChopFodderRadishCut} onFootnote={scrollToFootnote} />}
                  much={tr.guidesChopFodderRadishMuch}
                  spread={<RichText text={tr.guidesChopFodderRadishSpread} onFootnote={scrollToFootnote} />}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-indian-mustard"
                  name={tr.guidesChopIndianMustardName}
                  latin={tr.guidesChopIndianMustardLatin}
                  badge={tr.guidesChopIndianMustardBadge}
                  cut={tr.guidesChopIndianMustardCut}
                  much={tr.guidesChopIndianMustardMuch}
                  spread={<RichText text={tr.guidesChopIndianMustardSpread} onFootnote={scrollToFootnote} />}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-tithonia"
                  name={tr.guidesChopTithoniaName}
                  latin={tr.guidesChopTithoniaLatin}
                  badge={tr.guidesChopTithoniaBadge}
                  cut={<RichText text={tr.guidesChopTithoniaCut} onFootnote={scrollToFootnote} />}
                  much={<RichText text={tr.guidesChopTithoniaMuch} onFootnote={scrollToFootnote} />}
                  spread={<RichText text={tr.guidesChopTithoniaSpread} onFootnote={scrollToFootnote} />}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-gliricidia"
                  name={tr.guidesChopGliricidiaName}
                  latin={tr.guidesChopGliricidiaLatin}
                  badge={tr.guidesChopGliricidiaBadge}
                  cut={<RichText text={tr.guidesChopGliricidiaCut} onFootnote={scrollToFootnote} />}
                  much={<RichText text={tr.guidesChopGliricidiaMuch} onFootnote={scrollToFootnote} />}
                  spread={<RichText text={tr.guidesChopGliricidiaSpread} onFootnote={scrollToFootnote} />}
                />
                <ChopCard
                  tr={tr}
                  id="chop-plant-common-vetch"
                  name={tr.guidesChopCommonVetchName}
                  latin={tr.guidesChopCommonVetchLatin}
                  badge={tr.guidesChopCommonVetchBadge}
                  cut={<RichText text={tr.guidesChopCommonVetchCut} onFootnote={scrollToFootnote} />}
                  much={tr.guidesChopCommonVetchMuch}
                  spread={<RichText text={tr.guidesChopCommonVetchSpread} onFootnote={scrollToFootnote} />}
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
                  <RichText text={tr.guidesWhileMostPermacultureCompanions} onFootnote={scrollToFootnote} />
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
                        <RichText text={tr.guidesHeadBackScaffoldsAt35} onFootnote={scrollToFootnote} slots={[<button
                              type="button"
                              onClick={() => scrollToSection('tea_sinensis', 'tea-pruning-stage-3')}
                              className="text-teal-800 font-bold underline decoration-teal-500 underline-offset-2 hover:text-teal-950 cursor-pointer"
                            >{tr.guidesPluckingTableCaizhaiMian}</button>]} />
                      </li>
                      <li>
                        <strong>{tr.guidesAnnualSkiffingRejuvenation}</strong>{' '}
                        <RichText text={tr.guidesLightlyTrimTop35} onFootnote={scrollToFootnote} slots={[<button
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
                      <RichText text={tr.guides5070Shade1014} onFootnote={scrollToFootnote} />
                    </li>
                    <li>
                      <strong>Tencha (Matcha):</strong>{' '}
                      <RichText text={tr.guides6070Shade7Days} onFootnote={scrollToFootnote} />
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
                      <RichText text={tr.guidesEarlySpringPreQingmingLate} onFootnote={scrollToFootnote} />
                    </li>
                    <li>
                      <strong>{tr.guides1Bud12Leaves}</strong>{' '}
                      <RichText text={tr.guidesGoldStandardLongjingBiLuo} onFootnote={scrollToFootnote} />
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
                        <RichText text={tr.guidesLocateHealthyLeafNodeWhose} onFootnote={scrollToFootnote} />
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
                      <RichText text={tr.guides3OngoingMaintenanceRejuvenationCuts} onFootnote={scrollToFootnote} />
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
                        <RichText text={tr.guidesAfter35YearsRepeated} onFootnote={scrollToFootnote} />
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
                        <RichText text={tr.guidesDeCenteredAt25Cm} onFootnote={scrollToFootnote} />
                      </li>
                      <li>
                        <strong>{tr.guidesYunnanForestTeaArborQiaomu}</strong>{' '}
                        <RichText text={tr.guidesAllowedGrowAsFreeStanding} onFootnote={scrollToFootnote} />
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
                      <RichText text={tr.guidesPostWinterDormancyShootsRich} onFootnote={scrollToFootnote} />
                    </li>
                    <li>
                      <strong>{tr.guidesSecondFlushMayJunePeak}</strong>{' '}
                      {tr.guidesWarmPreMonsoonSunMild}
                    </li>
                    <li>
                      <strong>{tr.guidesMonsoonJulySeptAutumnFlush}</strong>{' '}
                      <RichText text={tr.guidesVigorousMonsoonGrowthIdealStrong} onFootnote={scrollToFootnote} />
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
                    <RichText text={tr.guidesDevelopedSpecificallyLargeLeafVar} onFootnote={scrollToFootnote} />
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
                    <RichText text={tr.guidesDevelopedKunmingMenghai1973Accelerate} onFootnote={scrollToFootnote} />
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
                    <RichText text={tr.guidesStunningSpecialtyJingguXishuangbanna} onFootnote={scrollToFootnote} />
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
