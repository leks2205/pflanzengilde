import React from 'react';
import { Ban, Compass, Info, Scale, Scissors, Sprout, Sun, TreePine, TriangleAlert, Wind, LucideIcon } from 'lucide-react';
import { Language, LocalizedString, getLoc } from '../types/guild';
import { GUILD_PLANTS } from '../data/guildPlants';
import { STAR_TREES } from '../data/starTrees';
import { PIONEER_TREES, PIONEER_SOURCES } from '../data/pioneerTrees';
import { SourceList } from './SourceList';
import { Badge, Stat, Tone, TONE } from './RaisedBedGuide';
import { PlantThumbnail } from './PlantThumbnail';

/**
 * Pioneer-tree guide. Claims come from the sources listed at the bottom (research pass 2026-11-08,
 * citations checked against Crossref and the primary pages). Per-species text comes from
 * src/data/pioneerTrees.ts, so the guide and the plant modal never disagree.
 */

type L = LocalizedString;
const L = (en: string, de: string): L => ({ en, de });

const EXTRA_SOURCES = {
  lwf84: 'Skowronek, S. (n.d.). Die Robinie als invasive Problemart im Naturschutz. LWF Wissen 84. Bayerische Landesanstalt für Wald und Forstwirtschaft. https://www.lwf.bayern.de/biodiversitaet/biologische-vielfalt/265020/index.php',
  bfn: 'Bundesamt für Naturschutz (2024). Gefäßpflanzen: naturschutzfachliche Invasivitätsbewertung (Stand 31.03.2024). https://www.bfn.de/gefaesspflanzen',
  euList: 'Commission Implementing Regulation (EU) 2016/1141 adopting a list of invasive alien species of Union concern, consolidated text of 07.08.2025. https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02016R1141-20250807',
  eppoFireBlight: 'EPPO (2026). Erwinia amylovora (ERWIAM): datasheet and host plants. EPPO Global Database. https://gd.eppo.int/taxon/ERWIAM/datasheet',
  kenis2016: 'Kenis, M., Tonina, L., Eschen, R., van der Sluis, B., Sancassani, M., Mori, N., et al. (2016). Non-crop plants used as hosts by Drosophila suzukii in Europe. Journal of Pest Science, 89(3), 735–748. doi:10.1007/s10340-016-0755-6',
  reich2005: 'Reich, P. B., et al. (2005). Linking litter calcium, earthworms and soil properties: a common garden test with 14 tree species. Ecology Letters, 8(8), 811–818. doi:10.1111/j.1461-0248.2005.00779.x',
  cross2010: 'Cross, J. V., Nagy, C., Batki, B., & Linka, J. (2010). Conservation biocontrol of pear psyllids. Mitteilungen Klosterneuburg, 60. Abstract: https://hedgelink.org.uk/?p=4205',
};

const SOURCES: string[] = [
  PIONEER_SOURCES.dawson1993,      // 1
  PIONEER_SOURCES.clark2008,       // 2
  PIONEER_SOURCES.lount2013,       // 3
  PIONEER_SOURCES.niccoli2021,     // 4
  PIONEER_SOURCES.issah2015,       // 5
  PIONEER_SOURCES.mortimer2015,    // 6
  PIONEER_SOURCES.niab,            // 7
  PIONEER_SOURCES.tiebel2018,      // 8
  PIONEER_SOURCES.martinik2018,    // 9
  EXTRA_SOURCES.lwf84,             // 10
  EXTRA_SOURCES.bfn,               // 11
  EXTRA_SOURCES.euList,            // 12
  EXTRA_SOURCES.eppoFireBlight,    // 13
  EXTRA_SOURCES.kenis2016,         // 14
  EXTRA_SOURCES.reich2005,         // 15
  EXTRA_SOURCES.cross2010,         // 16
];

const Refs: React.FC<{ ns: number[] }> = ({ ns }) => (
  <span className="text-[10px] font-semibold text-sky-700">[{ns.join(', ')}]</span>
);

interface Rule { id: string; icon: LucideIcon; tone: Tone; title: L; text: L; refs: number[] }

const RULES: Rule[] = [
  {
    id: 'pioneer-rule-young', icon: Sprout, tone: 'emerald',
    title: L('The benefit belongs to the young planting', 'Der Nutzen gehört der jungen Pflanzung'),
    text: L(
      'Nurse trees helped most in the first years. In a 20-year Italian plantation the positive effect on walnut and poplar faded once the companions\' crowns competed for light, and the authors call for thinning and pruning. Plan every pioneer as a temporary or permanently cut-back tree, not as a second canopy.',
      'Ammenbäume halfen vor allem in den ersten Jahren. In einer 20-jährigen italienischen Pflanzung ließ der positive Effekt auf Walnuss und Pappel nach, sobald die Kronen der Begleiter um Licht konkurrierten; die Autoren empfehlen Durchforstung und Schnitt. Jeden Pionier als vorübergehenden oder dauerhaft zurückgeschnittenen Baum planen, nicht als zweites Kronendach.'
    ),
    refs: [4, 3],
  },
  {
    id: 'pioneer-rule-nitrogen', icon: Scale, tone: 'sky',
    title: L('Nitrogen-fixers did the work', 'Die Stickstoffbinder machten den Unterschied'),
    text: L(
      'In the Illinois walnut trial only the nitrogen-fixing nurses (black alder, autumn olive, Russian olive, Siberian pea shrub) raised walnut growth; non-fixing nurses (Amur maple, Amur honeysuckle, Scots pine) gave no significant gain. In England, walnuts without a nitrogen-fixing nurse were nitrogen deficient.',
      'Im Walnussversuch in Illinois steigerten nur die stickstoffbindenden Ammen (Schwarzerle, Doldige und Schmalblättrige Ölweide, Erbsenstrauch) das Walnusswachstum; nicht-fixierende Ammen (Feuer-Ahorn, Amur-Heckenkirsche, Waldkiefer) brachten keinen signifikanten Vorteil. In England hatten Walnüsse ohne stickstoffbindende Amme Stickstoffmangel.'
    ),
    refs: [1, 2],
  },
  {
    id: 'pioneer-rule-distance', icon: Compass, tone: 'amber',
    title: L('Not too close: about 3–4 m', 'Nicht zu nah: etwa 3–4 m'),
    text: L(
      'Next to a Siberian pea shrub shelterbelt, crops 2 m from the row grew worse, while at 4 m they grew best and took about 40 % of their nitrogen from the shrubs; nitrogen from the shelterbelt was still measurable at 20 m. The planner therefore places pioneer trees in the outer zone, at least 3 m from the trunk and outside the star\'s crown.',
      'Neben einer Erbsenstrauch-Windschutzhecke wuchsen Kulturen 2 m neben der Reihe schlechter, in 4 m Abstand am besten und bezogen dort etwa 40 % ihres Stickstoffs von den Sträuchern; Stickstoff aus der Hecke war noch in 20 m messbar. Der Planer setzt Pionierbäume daher in die äußere Zone, mindestens 3 m vom Stamm und außerhalb der Krone der Star-Pflanze.'
    ),
    refs: [5],
  },
  {
    id: 'pioneer-rule-wind', icon: Wind, tone: 'stone',
    title: L('Windward edge, open at the bottom on slopes', 'An die Windseite, auf Hängen unten offen'),
    text: L(
      'NIAB names alders, especially Italian and grey alder, among the best windbreak trees for apple orchards because they compete less for water and nutrients than willow or poplar. On slopes, keep the base of a windbreak free for 1.5–2.0 m so cold air can drain away and no frost pocket forms.',
      'NIAB nennt Erlen, besonders Italienische und Grau-Erle, unter den besten Windschutzbäumen für Apfelanlagen, weil sie weniger um Wasser und Nährstoffe konkurrieren als Weide oder Pappel. An Hängen den Fuß einer Windschutzhecke 1,5–2,0 m hoch frei halten, damit Kaltluft abfließen kann und kein Frostloch entsteht.'
    ),
    refs: [7],
  },
];

const AVOID: { name: L; botanical: string; reason: L; refs: number[] }[] = [
  { name: L('Black locust', 'Robinie'), botanical: 'Robinia pseudoacacia', reason: L('Rated invasive in Germany (BfN management list); it enriches poor soils with nitrogen and displaces dry-grassland species.', 'In Deutschland als invasiv bewertet (BfN-Managementliste); sie reichert magere Böden mit Stickstoff an und verdrängt Trockenrasenarten.'), refs: [10, 11] },
  { name: L('Russian olive', 'Schmalblättrige Ölweide'), botanical: 'Elaeagnus angustifolia', reason: L('A proven walnut nurse, but listed in the BfN invasiveness assessment; autumn olive and goumi cover the same role here.', 'Bewährte Walnuss-Amme, steht aber in der BfN-Invasivitätsbewertung; Doldige Ölweide und Goumi decken dieselbe Rolle ab.'), refs: [1, 11] },
  { name: L('Wattles', 'Akazien'), botanical: 'Acacia saligna, A. mearnsii', reason: L('Nitrogen-fixing pioneers, but on the EU list of invasive alien species of Union concern.', 'Stickstoffbindende Pioniere, aber auf der EU-Liste invasiver gebietsfremder Arten von unionsweiter Bedeutung.'), refs: [12] },
  { name: L('Hawthorn', 'Weißdorn'), botanical: 'Crataegus monogyna', reason: L('EPPO names hawthorn among the important fire blight inoculum sources for apple and pear.', 'Die EPPO nennt Weißdorn unter den wichtigen Feuerbrand-Infektionsquellen für Apfel und Birne.'), refs: [13] },
  { name: L('Alder buckthorn, bird cherry', 'Faulbaum, Traubenkirsche'), botanical: 'Frangula alnus, Prunus padus', reason: L('Wild hosts of spotted wing drosophila; alder buckthorn was among the most heavily infested hosts in a European survey.', 'Wilde Wirte der Kirschessigfliege; der Faulbaum gehörte in einer europäischen Erhebung zu den am stärksten befallenen Wirten.'), refs: [14] },
  { name: L('Small-leaved linden', 'Winterlinde'), botanical: 'Tilia cordata', reason: L('A valuable bee and pollard tree (it stays in the catalogue), but shade-tolerant and late-successional, so not a pioneer.', 'Wertvoller Bienen- und Kopfbaum (bleibt im Katalog), aber schattenverträglich und spätsukzessional, also kein Pionier.'), refs: [15] },
];

export const PioneerGuide: React.FC<{ language: Language }> = ({ language }) => {
  const g = (l: L) => getLoc(l, language);
  const entries = Object.entries(PIONEER_TREES)
    .map(([id, info]) => ({ id, info, plant: GUILD_PLANTS.find(p => p.id === id)! }))
    .filter(e => e.plant && !e.plant.retired)
    .sort((a, b) => (a.info.tier === b.info.tier ? 0 : a.info.tier === 'NURSE_TRIAL' ? -1 : 1));
  const starName = (id: string) => {
    const s = STAR_TREES.find(t => t.id === id);
    return s ? g(s.commonName) : id;
  };
  const starTwin = (botanical: string) => STAR_TREES.find(s => s.botanicalName === botanical);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-lime-50 via-white to-emerald-50 border border-stone-200 p-6 space-y-3">
        <span className="inline-flex items-center gap-1 rounded-full border border-lime-300 bg-lime-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-lime-800">
          <TreePine className="w-3 h-3" />{g(L('Succession', 'Sukzession'))}
        </span>
        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">{g(L('Pioneer trees as companions', 'Pionierbäume als Begleiter'))}</h2>
        <p className="text-sm text-stone-600 leading-relaxed max-w-3xl">
          {g(L(
            'Pioneer trees are the first trees on open ground: light-demanding, fast-growing and often short-lived. Birch, alder, willow, poplar and rowan are the classic pioneers of European forests [8]. Some of them, above all nitrogen-fixers, act as nurse trees: they shelter a young fruit or nut tree and feed it nitrogen through leaves and roots. This guide shows what the trials found, how to place and cut pioneers, and which species the planner leaves out on purpose.',
            'Pionierbäume sind die ersten Bäume auf offenem Boden: lichtbedürftig, schnellwüchsig und oft kurzlebig. Birke, Erle, Weide, Pappel und Eberesche sind die klassischen Pioniere europäischer Wälder [8]. Einige von ihnen, vor allem Stickstoffbinder, wirken als Ammenbäume: Sie schützen einen jungen Obst- oder Nussbaum und versorgen ihn über Laub und Wurzeln mit Stickstoff. Dieser Leitfaden zeigt, was die Versuche fanden, wie man Pioniere setzt und schneidet und welche Arten der Planer bewusst weglässt.'
          ))}
        </p>
      </div>

      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 flex gap-3 text-sm text-amber-950" role="note">
        <TriangleAlert className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <p className="font-bold">{g(L('What the evidence covers, and what it does not', 'Was die Evidenz abdeckt und was nicht'))}</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>{g(L('Field trials with a host from this planner exist only for walnut (black alder, autumn olive, Siberian pea shrub) and Assam tea (Nepal alder). Those pioneers carry the "Nurse trial" label.', 'Feldversuche mit einem Wirt aus diesem Planer gibt es nur für Walnuss (Schwarzerle, Doldige Ölweide, Erbsenstrauch) und Assam-Tee (Nepal-Erle). Diese Pioniere tragen das Label „Ammen-Versuch“.'))}</li>
            <li>{g(L('For apple, pear, plum, cherry, hazel and chestnut no nurse trial was found. Pioneers there are labelled "Pioneer": shelter and nitrogen are plausible, a yield gain is not shown.', 'Für Apfel, Birne, Pflaume, Kirsche, Hasel und Kastanie wurde kein Ammenversuch gefunden. Pioniere dort heißen „Pionier“: Windschutz und Stickstoff sind plausibel, ein Mehrertrag ist nicht gezeigt.'))}</li>
            <li>{g(L('No pioneer tree has field evidence against a key pest of a star plant here, so none of them carries a pest-defence badge. Pest-host conflicts (silver leaf, fire blight) are flagged instead.', 'Kein Pionierbaum hat Feldevidenz gegen einen Hauptschädling einer Star-Pflanze hier, daher trägt keiner ein Schädlingsabwehr-Badge. Stattdessen werden Wirtskonflikte (Bleiglanz, Feuerbrand) gemeldet.'))}</li>
          </ul>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Stat icon={TreePine} tone="emerald" value="+50 %" label={g(L('walnut height and diameter growth with nitrogen-fixing nurses over 14 years', 'Walnuss-Höhen- und Dickenwachstum mit stickstoffbindenden Ammen über 14 Jahre'))} refs={[1]} refsNode={<Refs ns={[1]} />} />
        <Stat icon={Scale} tone="sky" value="~40 %" label={g(L('of crop nitrogen from a pea shrub shelterbelt 4 m away', 'des Stickstoffs der Kultur aus einer Erbsenstrauch-Hecke in 4 m Abstand'))} refs={[5]} refsNode={<Refs ns={[5]} />} />
        <Stat icon={Sprout} tone="amber" value="+52–72 %" label={g(L('Assam tea yield with interplanted alders (Yunnan)', 'Ertrag von Assam-Tee mit eingepflanzten Erlen (Yunnan)'))} refs={[6]} refsNode={<Refs ns={[6]} />} />
        <Stat icon={Sun} tone="red" value="2 m" label={g(L('crops this close to the shelterbelt grew worse', 'so nah an der Hecke wuchsen die Kulturen schlechter'))} refs={[5]} refsNode={<Refs ns={[5]} />} />
      </div>

      <div id="pioneer-management" className="flex items-start gap-3 pt-2 scroll-mt-24">
        <Scissors className="w-6 h-6 text-forest-600 shrink-0 mt-0.5" />
        <h3 className="text-lg font-bold text-stone-900">{g(L('How to use pioneer trees', 'So setzt du Pionierbäume ein'))}</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {RULES.map(r => {
          const Icon = r.icon;
          return (
            <div key={r.id} id={r.id} className="overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-xs scroll-mt-24">
              <div className={`h-1.5 bg-gradient-to-r ${TONE[r.tone].band}`} />
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${TONE[r.tone].icon} text-white flex items-center justify-center shrink-0`}><Icon className="w-5 h-5" /></div>
                  <h4 className="font-bold text-base text-stone-900">{g(r.title)}</h4>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed">{g(r.text)} <Refs ns={r.refs} /></p>
              </div>
            </div>
          );
        })}
      </div>

      <div id="pioneer-species" className="flex items-start gap-3 pt-2 scroll-mt-24">
        <Sprout className="w-6 h-6 text-forest-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-lg font-bold text-stone-900">{g(L('Pioneer trees and shrubs in the catalogue', 'Pionierbäume und -sträucher im Katalog'))}</h3>
          <p className="text-sm text-stone-500 max-w-3xl">{g(L('Each card names the star plants it is recommended for. Species marked "Nurse trial" were tested with that host; sources are on the plant cards in the planner.', 'Jede Karte nennt die Star-Pflanzen, für die sie empfohlen wird. Arten mit „Ammen-Versuch“ wurden mit diesem Wirt geprüft; die Quellen stehen auf den Pflanzenkarten im Planer.'))}</p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {entries.map(({ id, info, plant }) => {
          const twin = starTwin(plant.botanicalName);
          return (
            <div key={id} id={`pioneer-${id.replace(/^plant-/, '')}`} className="rounded-2xl bg-white border border-stone-200 p-4 space-y-2 scroll-mt-24">
              <div className="flex items-center gap-3">
                <PlantThumbnail src={plant.imageUrl} alt={g(plant.commonName)} fallbackColor={plant.color} className="w-12 h-12" roundedClassName="rounded-xl" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-stone-900 leading-tight">{g(plant.commonName)}</h4>
                  <p className="text-xs italic text-stone-500">{plant.botanicalName}</p>
                </div>
                <Badge tone={info.tier === 'NURSE_TRIAL' ? 'emerald' : 'amber'}>
                  {info.tier === 'NURSE_TRIAL' ? g(L('Nurse trial', 'Ammen-Versuch')) : g(L('Pioneer', 'Pionier'))}
                </Badge>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">{g(info.evidence)}</p>
              <p className="text-xs text-stone-700 leading-relaxed"><strong>{g(L('Keep it in check: ', 'So bleibt er in Schach: '))}</strong>{g(info.management)}</p>
              <p className="text-xs text-stone-600">
                <strong>{g(L('Recommended for: ', 'Empfohlen für: '))}</strong>
                {plant.recommendedForTrees.length ? plant.recommendedForTrees.map(starName).join(', ') : '–'}
                {info.trialStarIds.length > 0 && <> · <strong>{g(L('Trial host: ', 'Versuchswirt: '))}</strong>{info.trialStarIds.map(starName).join(', ')}</>}
                {twin && <> · <strong>{g(L('Also a star plant: ', 'Auch Star-Pflanze: '))}</strong>{g(twin.commonName)}</>}
              </p>
            </div>
          );
        })}
      </div>

      <div id="pioneer-excluded" className="rounded-2xl bg-white border border-stone-200 p-5 space-y-3 scroll-mt-24">
        <h3 className="flex items-center gap-2 font-bold text-stone-900"><Ban className="w-4 h-4 text-rose-600" />{g(L('Pioneers the planner leaves out on purpose', 'Pioniere, die der Planer bewusst weglässt'))}</h3>
        <ul className="space-y-2">
          {AVOID.map(a => (
            <li key={a.botanical} className="text-sm text-stone-700 leading-relaxed">
              <strong>{g(a.name)}</strong> <span className="italic text-stone-500">({a.botanical})</span>: {g(a.reason)} <Refs ns={a.refs} />
            </li>
          ))}
        </ul>
        <p className="text-xs text-stone-600 flex gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-stone-400" />
          <span>{g(L('Italian alder windbreaks gave little or no benefit against pear psylla in a UK study, so no pioneer is offered as a pest control for pear [16].', 'Windschutz aus Italienischer Erle brachte in einer britischen Studie kaum Nutzen gegen den Birnblattsauger, daher wird kein Pionier als Schädlingsbekämpfung für Birne angeboten [16].'))}</span>
        </p>
      </div>

      <div className="rounded-2xl bg-stone-50 border border-stone-200 p-4">
        <SourceList sources={SOURCES.map((s, i) => `[${i + 1}] ${s}`)} language={language} collapseAfter={0} />
      </div>
    </div>
  );
};
