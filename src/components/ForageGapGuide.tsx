import React from 'react';
import { CalendarRange, Flower2, Home, Info, Link2, Scale, Sprout, Sun, Timer, TriangleAlert, LucideIcon, Snowflake } from 'lucide-react';
import { Language, LocalizedString, getLoc } from '../types/guild';
import { ACTIVE_GUILD_PLANTS } from '../data/guildPlants';
import { PHENO_SEASONS, plantCoversRoleInSeason } from '../core/seasonalGapEngine';
import { SourceList } from './SourceList';
import { Badge, Stat, Tone, TONE } from './RaisedBedGuide';
import { ForageGapTimeline } from './guideDiagrams';
import { PlantThumbnail } from './PlantThumbnail';

/**
 * Forage-gap guide for bumblebees. Every factual claim comes from the three papers below; their
 * abstracts were opened via Crossref (2026-10-04). The per-season plant lists are catalogue data
 * (floweringSeasons) and make no claim about bumblebee use or exact bloom months.
 */

type L = LocalizedString;
const L = (en: string, de: string): L => ({ en, de });

const SOURCES = [
  'Timberlake, T. P., Vaughan, I. P., & Memmott, J. (2019). Phenology of farmland floral resources reveals seasonal gaps in nectar availability for bumblebees. Journal of Applied Ecology, 56(7), 1585–1596. doi:10.1111/1365-2664.13403',
  'Scheper, J., Bommarco, R., Holzschuh, A., Potts, S. G., Riedinger, V., Roberts, S. P. M., Rundlöf, M., Smith, H. G., Steffan-Dewenter, I., Wickens, J. B., Wickens, V. J., & Kleijn, D. (2015). Local and landscape-level floral resources explain effects of wildflower strips on wild bees across four European countries. Journal of Applied Ecology, 52(5), 1165–1175. doi:10.1111/1365-2664.12479',
  'Timberlake, T. P., Vaughan, I. P., Baude, M., & Memmott, J. (2021). Bumblebee colony density on farmland is influenced by late-summer nectar supply and garden cover. Journal of Applied Ecology, 58(5), 1006–1016. doi:10.1111/1365-2664.13826',
];

interface Claim { id: string; icon: LucideIcon; tone: Tone; visual?: boolean; title: L; text: L; refs: number[]; limit: L }

const CLAIMS: Claim[] = [
  {
    id: 'forage-gaps-timeline', icon: CalendarRange, tone: 'amber', visual: true,
    title: L('Three gaps in the year', 'Drei Lücken im Jahr'),
    text: L(
      'On farms in south-west England, nectar supply peaked twice, in May and July, with a clear "June Gap" in between. March and August/September were also low. Set against what bumblebees need, supply was unlikely to meet demand in March and much of August/September.',
      'Auf Höfen in Südwestengland gab es zwei Nektarspitzen, im Mai und im Juli, dazwischen eine deutliche „Juni-Lücke“. Auch März und August/September waren knapp. Im Vergleich zum Bedarf der Hummeln reichte das Angebot im März und über weite Teile von August/September wahrscheinlich nicht aus.'
    ),
    refs: [1],
    limit: L('Bumblebees only; whole-farm nectar on replicate farms in south-west UK. Whether gardens in Germany show the same timing is our inference.', 'Nur Hummeln; Nektar auf Hofebene auf mehreren Höfen in Südwestengland. Ob Gärten in Deutschland dasselbe Timing zeigen, ist unsere Schlussfolgerung.'),
  },
  {
    id: 'forage-gaps-timing', icon: Timer, tone: 'emerald',
    title: L('Timing matters, not just amount', 'Der Zeitpunkt zählt, nicht nur die Menge'),
    text: L(
      'The authors conclude that when nectar is available may matter as much as how much there is. They recommend prioritising plants that flower in the deficit periods (early spring and late summer). A few low-yield species (ivy, dandelion) helped keep supply continuous.',
      'Die Autoren schließen, dass der Zeitpunkt des Nektarangebots ebenso wichtig sein kann wie die Gesamtmenge. Sie empfehlen, Pflanzen zu bevorzugen, die in den Mangelzeiten blühen (Vorfrühling und Spätsommer). Einzelne ertragsarme Arten (Efeu, Löwenzahn) halfen, das Angebot lückenlos zu halten.'
    ),
    refs: [1],
    limit: L('Recommendation drawn by the authors from farmland data, not a tested garden design.', 'Empfehlung der Autoren aus Daten von Agrarland, kein geprüfter Gartenentwurf.'),
  },
  {
    id: 'forage-gaps-local', icon: Sprout, tone: 'sky',
    title: L('Local flowers help, and the season counts', 'Lokale Blüten helfen, die Jahreszeit zählt'),
    text: L(
      'Sown wildflower strips raised wild-bee numbers and species richness, more so where they created a larger local contrast in flower richness. For bumblebees, the effect grew with more early-season flowers in the surrounding landscape. The authors stress a continuous food supply through the season for bumblebees.',
      'Angesäte Blühstreifen erhöhten Anzahl und Artenvielfalt von Wildbienen, umso mehr, je größer der lokale Unterschied im Blütenreichtum war. Bei Hummeln wuchs der Effekt mit mehr Frühjahrsblüten in der Umgebung. Die Autoren betonen für Hummeln ein durchgehendes Nahrungsangebot über die Saison.'
    ),
    refs: [2],
    limit: L('Wildflower strips on farmland in four European countries, not gardens. Effects on population size were not shown (the authors call for further research).', 'Blühstreifen auf Agrarland in vier europäischen Ländern, keine Gärten. Wirkungen auf die Populationsgröße wurden nicht gezeigt (die Autoren fordern weitere Forschung).'),
  },
  {
    id: 'forage-gaps-september', icon: Sun, tone: 'amber',
    title: L('Late summer, and what gardens may add', 'Spätsommer und der mögliche Beitrag von Gärten'),
    text: L(
      'On 12 farms, nectar supply in September predicted the density of Bombus terrestris colonies the following year (over half of the variation); no other period did. Garden cover in the landscape was also significantly associated with colony density.',
      'Auf 12 Höfen sagte das Nektarangebot im September die Dichte der Bombus-terrestris-Völker im Folgejahr voraus (über die Hälfte der Streuung); kein anderer Zeitraum tat das. Auch der Gartenanteil in der Landschaft hing signifikant mit der Völkerdichte zusammen.'
    ),
    refs: [3],
    limit: L('Correlation, not causation. One species (buff-tailed bumblebee), 12 farms in south-west UK. That a garden planting causes more colonies is not shown.', 'Korrelation, nicht Kausalität. Eine Art (Dunkle Erdhummel), 12 Höfe in Südwestengland. Dass eine Gartenpflanzung mehr Völker bewirkt, ist nicht gezeigt.'),
  },
];

const SEASON_ROWS: { id: (typeof PHENO_SEASONS)[number]['id']; note?: L }[] = [
  { id: 'EARLY_SPRING', note: L('March falls in this block (the March gap itself:', 'Der März liegt in diesem Block (die März-Lücke selbst:') },
  { id: 'LATE_SPRING', note: L('June falls in this block (the June gap itself:', 'Der Juni liegt in diesem Block (die Juni-Lücke selbst:') },
  { id: 'SUMMER', note: L('August falls in this block (the late-summer low itself:', 'Der August liegt in diesem Block (das Spätsommer-Tief selbst:') },
  { id: 'AUTUMN', note: L('September falls in this block (the September finding itself:', 'Der September liegt in diesem Block (der September-Befund selbst:') },
];

const Refs: React.FC<{ ns: number[] }> = ({ ns }) => (
  <span className="text-[10px] font-semibold text-sky-700">[{ns.join(', ')}]</span>
);

export const ForageGapGuide: React.FC<{ language: Language; onNavigate?: (path: string) => void }> = ({ language, onNavigate }) => {
  const g = (l: L) => getLoc(l, language);
  const plantsIn = (season: (typeof SEASON_ROWS)[number]['id']) =>
    ACTIVE_GUILD_PLANTS
      .filter(p => plantCoversRoleInSeason(p, 'POLLINATOR_MAGNET', season))
      .sort((a, b) => g(a.commonName).localeCompare(g(b.commonName), language));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-white to-emerald-50 border border-stone-200 p-6 space-y-3">
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
          <Flower2 className="w-3 h-3" />{g(L('Bumblebees', 'Hummeln'))}
        </span>
        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">{g(L('Closing forage gaps: flowers for bumblebees all year', 'Trachtlücken schließen: Blüten für Hummeln das ganze Jahr'))}</h2>
        <p className="text-sm text-stone-600 leading-relaxed max-w-3xl">
          {g(L(
            'Bumblebee colonies need nectar and pollen across their entire flight season [1]. Research on farmland found stretches of the year when supply falls short. This guide shows where, and how to check your own planting for the same holes. Numbers in brackets refer to the sources at the bottom.',
            'Hummelvölker brauchen während ihrer gesamten Flugzeit Nektar und Pollen [1]. Forschung auf Agrarland fand Zeiten im Jahr, in denen das Angebot nicht reicht. Dieser Leitfaden zeigt, wann, und wie du deine eigene Pflanzung auf dieselben Lücken prüfst. Zahlen in Klammern verweisen auf die Quellen unten.'
          ))}
        </p>
      </div>

      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 flex gap-3 text-sm text-amber-950" role="note">
        <TriangleAlert className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <p className="font-bold">{g(L('What this evidence covers, and what it does not', 'Was diese Evidenz abdeckt und was nicht'))}</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>{g(L('Bumblebees only. Nothing here is shown for solitary bees, honey bees, butterflies or other insects.', 'Nur Hummeln. Für Solitärbienen, Honigbienen, Schmetterlinge oder andere Insekten ist hier nichts gezeigt.'))}</li>
            <li>{g(L('The gap timing comes from farmland in south-west England. That Germany and home gardens follow the same pattern is our inference, not a finding.', 'Das Lücken-Timing stammt von Agrarland in Südwestengland. Dass Deutschland und Hausgärten dem gleichen Muster folgen, ist unsere Schlussfolgerung, kein Befund.'))}</li>
            <li>{g(L('The September result is a correlation, not proof of cause.', 'Das September-Ergebnis ist eine Korrelation, kein Ursachenbeweis.'))}</li>
            <li>{g(L('All three sources are field studies on farmland; none tested a garden planting plan. Evidence tier for every claim below: moderate.', 'Alle drei Quellen sind Feldstudien auf Agrarland; keine prüfte einen Gartenpflanzplan. Evidenzstufe aller Aussagen unten: moderat.'))}</li>
            <li>{g(L('The sources were checked at abstract level only; no full text was read.', 'Die Quellen wurden nur auf Abstract-Ebene geprüft; kein Volltext wurde gelesen.'))}</li>
          </ul>
        </div>
      </div>

      <div className="flex items-start gap-3 pt-2">
        <Scale className="w-6 h-6 text-forest-600 shrink-0 mt-0.5" />
        <h3 className="text-lg font-bold text-stone-900">{g(L('What the studies found', 'Was die Studien fanden'))}</h3>
      </div>
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Stat icon={Snowflake} tone="sky" value={g(L('March', 'März'))} label={g(L('supply unlikely to meet bumblebee demand', 'Angebot reichte wahrscheinlich nicht für den Hummelbedarf'))} refs={[1]} refsNode={<Refs ns={[1]} />} />
        <Stat icon={CalendarRange} tone="amber" value={g(L('June', 'Juni'))} label={g(L('"June Gap" between the May and July nectar peaks', '„Juni-Lücke“ zwischen den Nektarspitzen im Mai und Juli'))} refs={[1]} refsNode={<Refs ns={[1]} />} />
        <Stat icon={Sun} tone="red" value={g(L('Aug–Sep', 'Aug–Sep'))} label={g(L('much of late summer fell short of demand', 'weite Teile des Spätsommers unter dem Bedarf'))} refs={[1]} refsNode={<Refs ns={[1]} />} />
        <Stat icon={Home} tone="emerald" value={g(L('> 50 %', '> 50 %'))} label={g(L('of next-year colony density variation explained by September nectar (12 farms)', 'der Streuung der Völkerdichte im Folgejahr durch September-Nektar erklärt (12 Höfe)'))} refs={[3]} refsNode={<Refs ns={[3]} />} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {CLAIMS.map(c => {
          const Icon = c.icon;
          return (
            <div key={c.id} id={c.id} className="overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-xs scroll-mt-24 flex flex-col">
              <div className={`h-1.5 bg-gradient-to-r ${TONE[c.tone].band}`} />
              <div className="p-5 space-y-2 flex-1 flex flex-col">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${TONE[c.tone].icon} text-white flex items-center justify-center shrink-0`}><Icon className="w-5 h-5" /></div>
                  <h4 className="font-bold text-base text-stone-900 flex-1">{g(c.title)}</h4>
                  <Badge tone="sky">{g(L('Evidence: moderate', 'Evidenz: moderat'))}</Badge>
                </div>
                {c.visual && <div className="rounded-xl bg-stone-50 border border-stone-100 p-2"><ForageGapTimeline language={language} /></div>}
                <p className="text-sm text-stone-700 leading-relaxed">{g(c.text)} <Refs ns={c.refs} /></p>
                <p className="mt-auto text-xs text-stone-600 leading-relaxed flex gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-stone-400" />
                  <span><strong>{g(L('Limits: ', 'Grenzen: '))}</strong>{g(c.limit)}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div id="forage-gaps-plants" className="flex items-start gap-3 pt-2 scroll-mt-24">
        <CalendarRange className="w-6 h-6 text-forest-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-lg font-bold text-stone-900">{g(L('Which catalogue plants flower when', 'Welche Katalogpflanzen wann blühen'))}</h3>
          <p className="text-sm text-stone-500 max-w-3xl">
            {g(L(
              'Taken from the planner catalogue (the same flowering seasons the seasonal-gap check uses). The planner works in two-month blocks, so the June gap sits inside May–June and the late-summer low spans July–August and September–October. These lists are not a bumblebee-forage rating and give no exact bloom months: none of the studies tested the catalogue plants listed here, so we make no claim that a given plant closes a gap.',
              'Aus dem Planer-Katalog (dieselben Blütezeiten, die die Saisonlücken-Prüfung nutzt). Der Planer rechnet in Zwei-Monats-Blöcken: Die Juni-Lücke liegt also in Mai–Juni, das Spätsommer-Tief verteilt sich auf Juli–August und September–Oktober. Die Listen sind keine Bewertung als Hummelnahrung und nennen keine genauen Blütemonate: Keine der Studien hat die hier gelisteten Katalogpflanzen geprüft, wir behaupten daher nicht, dass eine bestimmte Pflanze eine Lücke schließt.'
            ))}
          </p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {SEASON_ROWS.map(row => {
          const def = PHENO_SEASONS.find(s => s.id === row.id)!;
          const plants = plantsIn(row.id);
          return (
            <div key={row.id} className="rounded-2xl bg-white border border-stone-200 p-4 space-y-3">
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="font-bold text-stone-900">{g(def.label)} <span className="text-xs font-medium text-stone-500">({g(def.months)})</span></h4>
                <span className="text-xs text-stone-500">{plants.length} {g(L('plants', 'Pflanzen'))}</span>
              </div>
              {row.note && <p className="text-xs text-stone-600 mb-1">{g(row.note)} {row.id !== 'LATE_SPRING' && row.id !== 'SUMMER' && <Refs ns={row.id === 'AUTUMN' ? [3] : [1]} />}{(row.id === 'LATE_SPRING' || row.id === 'SUMMER') && <Refs ns={[1]} />})</p>}
              <div className="flex flex-wrap gap-2">
                {plants.map(p => (
                  <div key={p.id} className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 pr-3 p-1">
                    <PlantThumbnail
                      src={p.imageUrl}
                      alt={g(p.commonName)}
                      fallbackColor={p.color}
                      className="w-6 h-6"
                      roundedClassName="rounded-full"
                    />
                    <span className="text-xs font-medium text-stone-700">{g(p.commonName)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div id="forage-gaps-check" className="rounded-2xl bg-white border border-stone-200 p-5 space-y-2 scroll-mt-24">
        <h3 className="flex items-center gap-2 font-bold text-stone-900"><Link2 className="w-4 h-4 text-forest-600" />{g(L('Check your own planting', 'Prüfe deine eigene Pflanzung'))}</h3>
        <p className="text-sm text-stone-700 leading-relaxed">
          {g(L(
            'The guild planner flags a "Pollinator Magnet" season with no flowering companion (early spring, late spring, summer, autumn) and suggests plants for it. Use it to see whether your guild has a hole in the seasons above. The check is a coarse planner heuristic; it is not itself backed by the studies cited here.',
            'Der Gilden-Planer meldet eine „Bestäuber- & Nützlingsmagnet“-Jahreszeit ohne blühende Begleitpflanze (Vorfrühling, Spätfrühling, Sommer, Herbst) und schlägt Pflanzen dafür vor. So siehst du, ob deine Gilde in den obigen Jahreszeiten eine Lücke hat. Die Prüfung ist eine grobe Planer-Heuristik; sie selbst wird von den hier zitierten Studien nicht gestützt.'
          ))}
        </p>
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            {g(L('Open the guild planner', 'Gilden-Planer öffnen'))}
          </button>
        )}
      </div>

      <div className="rounded-2xl bg-stone-50 border border-stone-200 p-4">
        <SourceList
          sources={SOURCES.map((s, i) => `[${i + 1}] ${s}`)}
          language={language}
          collapseAfter={0}
        />
      </div>
    </div>
  );
};
