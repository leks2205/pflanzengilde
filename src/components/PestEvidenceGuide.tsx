import React from 'react';
import { Bug, FlaskConical, ShieldAlert, ShieldCheck, Wrench } from 'lucide-react';
import { Language, LocalizedString, getLoc } from '../types/guild';
import { STAR_TREES } from '../data/starTrees';
import { GUILD_PLANTS } from '../data/guildPlants';
import {
  EvidenceCitation,
  EvidenceLevel,
  PEST_DEFENSE_RULES,
  PEST_RESEARCH_NOTES
} from '../core/pestCompanionEngine';
import { PEST_HOST_CONFLICTS } from '../core/pestHostConflicts';
import { EvidenceCitations, EvidenceTag } from './EvidenceTag';
import { t } from '../i18n/translations';

interface NonPlantMeasure {
  pest: LocalizedString;
  measure: LocalizedString;
  citation?: EvidenceCitation;
}

const NON_PLANT_MEASURES: NonPlantMeasure[] = [
  {
    pest: { en: 'Blueberry mummy berry', de: 'Monilia-Fruchtfäule der Heidelbeere' },
    measure: { en: 'A 5 cm layer of Douglas-fir sawdust mulch suppressed the fungus fruiting bodies in spring better than bare ground; 2.5 cm of blueberry leaves did not.', de: 'Eine 5 cm dicke Schicht Douglasien-Sägemehl unterdrückte die Fruchtkörper des Pilzes im Frühjahr besser als offener Boden; 2,5 cm Heidelbeerlaub nicht.' },
    citation: { label: 'Florence & Pscheidt 2017, Plant Dis. 101:807–814', doi: '10.1094/PDIS-01-16-0087-RE' }
  },
  {
    pest: { en: 'Cherry fruit fly', de: 'Kirschfruchtfliege' },
    measure: { en: 'Nets covering the soil under the trees held back emerging flies: fruit infestation −91 % (2 orchards, 2 years).', de: 'Netze über dem Boden unter den Bäumen hielten schlüpfende Fliegen zurück: Fruchtbefall −91 % (2 Anlagen, 2 Jahre).' },
    citation: { label: 'Daniel & Baker 2013, Insects 4:168–176', doi: '10.3390/insects4010168' }
  },
  {
    pest: { en: 'Sea buckthorn fruit fly', de: 'Sanddornfruchtfliege' },
    measure: { en: 'Black PE ground cover around the trunks cut fruit infestation from 62–75 % (control) to 16–22 %.', de: 'Schwarze PE-Bodenabdeckung um die Stämme senkte den Fruchtbefall von 62–75 % (Kontrolle) auf 16–22 %.' },
    citation: { label: 'Zhou, Sattar & Jiao 2026, Insects 17:613 (2-year field study)', doi: '10.3390/insects17060613' }
  },
  {
    pest: { en: 'Apple scab', de: 'Apfelschorf' },
    measure: { en: 'The fungus overwinters on fallen leaves. Shredding all of the leaf litter with a flail mower in November or April cut the scab risk by 80–90 %.', de: 'Der Pilz überwintert im Falllaub. Wurde das gesamte Laub im November oder April mit dem Schlegelmulcher gehäckselt, sank das Schorfrisiko um 80–90 %.' },
    citation: { label: 'Sutton, MacHardy & Lord 2000, Plant Dis. 84:1319–1326', doi: '10.1094/PDIS.2000.84.12.1319' }
  },
  {
    pest: { en: 'Woolly apple aphid', de: 'Blutlaus' },
    measure: { en: 'Releasing 30 earwigs per tree in corrugated-cardboard shelters, repeated every year, shortened colonies from the second year on.', de: 'Das jährlich wiederholte Freilassen von 30 Ohrwürmern pro Baum in Wellpappe-Unterschlüpfen verkürzte die Kolonien ab dem zweiten Jahr.' },
    citation: { label: 'Alins et al. 2023, Insects 14:890', doi: '10.3390/insects14110890' }
  },
  {
    pest: { en: 'Spotted wing drosophila (blueberry)', de: 'Kirschessigfliege (Heidelbeere)' },
    measure: { en: 'Woven weed mat under the bushes stopped larvae from reaching the soil to pupate (greenhouse test); in the field, results varied by site.', de: 'Gewebte Unkrautfolie unter den Sträuchern hinderte Larven daran, sich im Boden zu verpuppen (Gewächshausversuch); im Feld schwankten die Ergebnisse je nach Standort.' },
    citation: { label: 'Rendon et al. 2020, Pest Manag. Sci. 76:55–66', doi: '10.1002/ps.5512' }
  },
  {
    pest: { en: 'Nut weevil', de: 'Haselnussbohrer' },
    measure: { en: 'Entomopathogenic nematodes applied to the soil reduced the weevil population by 32–88 %.', de: 'In den Boden ausgebrachte Nützliche Nematoden senkten die Rüsslerpopulation um 32–88 %.' },
    citation: { label: 'Batalla-Carrera, Morton & García-del-Pino 2013, Span. J. Agric. Res. 11:1112–1119', doi: '10.5424/sjar/2013114-4210' }
  }
];

const starName = (id: string, language: Language) => {
  const tree = STAR_TREES.find(star => star.id === id);
  return tree ? getLoc(tree.commonName, language) : id;
};

const plantName = (id: string, language: Language) => {
  const plant = GUILD_PLANTS.find(p => p.id === id);
  return plant ? getLoc(plant.commonName, language) : id;
};

export const PestEvidenceGuide: React.FC<{ language: Language }> = ({ language }) => {
  const tr = t(language);
  const sourcesTitle = tr.evidenceSourcesTitle;
  const evidenceDefinitions: Record<EvidenceLevel, string> = {
    'field-proven': tr.pestEvidenceDefFieldProven,
    'scientific': tr.pestEvidenceDefScientific,
    'promising': tr.pestEvidenceDefPromising,
    'folklore': tr.pestEvidenceDefFolklore
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
          <Bug className="w-3.5 h-3.5 text-emerald-600" />
          <span>{tr.pestEvidenceBadge}</span>
        </div>
        <h2 className="text-2xl font-bold text-stone-900">
          {tr.pestEvidenceTitle}
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
          {tr.pestEvidenceIntro}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
          {(Object.keys(evidenceDefinitions) as EvidenceLevel[]).map(level => (
            <div key={level} className="flex items-start gap-2 text-xs text-stone-600">
              <EvidenceTag level={level} language={language} />
              <span>{evidenceDefinitions[level]}</span>
            </div>
          ))}
        </div>
      </div>

      <section id="pest-evidence-backed" className="space-y-3 scroll-mt-24">
        <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>{tr.pestEvidenceSection1Title}</span>
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {PEST_DEFENSE_RULES.map(rule => (
            <div key={rule.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-stone-200 pb-2.5">
                <div>
                  <h4 className="text-base font-bold text-stone-900">{getLoc(rule.ruleTitle, language)}</h4>
                  <p className="text-xs text-stone-500">
                    {tr.pestEvidenceStarPlants}
                    {(rule.starTreeIds || []).map(id => starName(id, language)).join(', ')}
                  </p>
                </div>
                <EvidenceTag level={rule.evidence} language={language} />
              </div>
              <p className="text-xs text-stone-700">
                <strong>{tr.pestEvidenceCompanions}</strong>
                {rule.companionPlantIds.map(id => plantName(id, language)).join(', ')}
              </p>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">{getLoc(rule.scientificMechanism, language)}</p>
              <EvidenceCitations citations={rule.citations} title={sourcesTitle} />
            </div>
          ))}
        </div>
      </section>

      <section id="pest-evidence-check" className="space-y-3 scroll-mt-24">
        <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-amber-600" />
          <span>{tr.pestEvidenceSection2Title}</span>
        </h3>
        <p className="text-xs text-stone-600 max-w-3xl">
          {tr.pestEvidenceSection2Desc}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(['promising', 'folklore'] as const).flatMap(level =>
            PEST_RESEARCH_NOTES.filter(n => n.evidence === level).map(note => (
              <div key={note.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-stone-900">{getLoc(note.pest, language)}</div>
                    <div className="text-xs text-stone-500">{getLoc(note.companions, language)}</div>
                  </div>
                  <EvidenceTag level={note.evidence} language={language} />
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">{getLoc(note.note, language)}</p>
                <EvidenceCitations citations={note.citations} title={sourcesTitle} />
              </div>
            ))
          )}
        </div>
      </section>

      <section id="pest-non-plant-measures" className="space-y-3 scroll-mt-24">
        <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-sky-600" />
          <span>{tr.pestEvidenceSection3Title}</span>
        </h3>
        <p className="text-xs text-stone-600 max-w-3xl">
          {tr.pestEvidenceSection3Desc}
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {NON_PLANT_MEASURES.map(m => (
            <li key={m.pest.en} className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-1 text-xs text-stone-700">
              <div className="font-bold text-stone-900 text-sm">{getLoc(m.pest, language)}</div>
              <p className="leading-relaxed">{getLoc(m.measure, language)}</p>
              {m.citation && <EvidenceCitations citations={[m.citation]} title={sourcesTitle} />}
            </li>
          ))}
        </ul>
      </section>

      <section id="pest-host-conflicts" className="space-y-3 scroll-mt-24">
        <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <span>{tr.pestEvidenceSection4Title}</span>
        </h3>
        <p className="text-xs text-stone-600 max-w-3xl">
          {tr.pestEvidenceSection4Desc}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PEST_HOST_CONFLICTS.map(spec => (
            <div key={spec.id} className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-1.5 text-xs text-stone-700">
              <div className="font-bold text-stone-900 text-sm">{getLoc(spec.title, language)}</div>
              <div className="text-stone-500">
                {getLoc(spec.antagonistName, language)} → {spec.starTreeIds.map(id => starName(id, language)).join(', ')}
              </div>
              <p className="leading-relaxed">{getLoc(spec.mechanism, language)}</p>
              <p className="leading-relaxed font-medium">{getLoc(spec.spatialAdvice, language)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
