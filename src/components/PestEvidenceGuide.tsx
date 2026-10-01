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
    measure: { en: 'At least 5 cm of sawdust mulch in spring suppresses the fungus fruiting bodies; a thin leaf layer does not.', de: 'Mindestens 5 cm Sägemehl-Mulch im Frühjahr unterdrückt die Fruchtkörper des Pilzes; eine dünne Laubschicht nicht.' },
    citation: { label: 'Florence et al. 2017, Plant Dis.', doi: '10.1094/PDIS-01-16-0087-RE' }
  },
  {
    pest: { en: 'Cherry fruit fly', de: 'Kirschfruchtfliege' },
    measure: { en: 'Ground nets under the tree stop emerging flies: −91 % infestation.', de: 'Bodennetze unter dem Baum halten schlüpfende Fliegen zurück: −91 % Befall.' },
    citation: { label: 'Daniel & Baker 2013, Insects 4:168', doi: '10.3390/insects4010168' }
  },
  {
    pest: { en: 'Sea buckthorn fruit fly', de: 'Sanddornfruchtfliege' },
    measure: { en: 'Black PE ground cover cut infestation from 62–75 % to 16–22 %.', de: 'Schwarze PE-Bodenabdeckung senkte den Befall von 62–75 % auf 16–22 %.' },
    citation: { label: 'Zhou et al. 2026, Insects 17:613 (2-year field study)', doi: '10.3390/insects17060613' }
  },
  {
    pest: { en: 'Apple scab, currant leaf spot, quince leaf blight', de: 'Apfelschorf, Blattfallkrankheit, Quitten-Blattbräune' },
    measure: { en: 'Remove, shred or mow fallen leaves in autumn – the fungi overwinter in the leaf litter.', de: 'Falllaub im Herbst entfernen, häckseln oder mulchen – die Pilze überwintern im Laub.' }
  },
  {
    pest: { en: 'Woolly apple aphid', de: 'Blutlaus' },
    measure: { en: 'Earwig releases and shelters (pots with wood wool) gave cumulative control over the years.', de: 'Ohrwurm-Freilassungen und -Unterschlüpfe (Töpfe mit Holzwolle) wirkten über die Jahre zunehmend.' },
    citation: { label: 'Alins et al. 2023, Insects 14:890', doi: '10.3390/insects14110890' }
  },
  {
    pest: { en: 'Spotted wing drosophila (blueberry)', de: 'Kirschessigfliege (Heidelbeere)' },
    measure: { en: 'Woven weed mat under the bushes blocks pupation in the soil; harvest promptly and completely.', de: 'Gewebte Unkrautfolie unter den Sträuchern verhindert die Verpuppung im Boden; zügig und vollständig ernten.' },
    citation: { label: 'Rendon et al. 2020, Pest Manag. Sci.', doi: '10.1002/ps.5512' }
  },
  {
    pest: { en: 'Nut weevil', de: 'Haselnussbohrer' },
    measure: { en: 'Entomopathogenic nematodes against overwintering larvae: 32–88 % reduction.', de: 'Nützliche Nematoden gegen überwinternde Larven: 32–88 % Reduktion.' },
    citation: { label: 'Batalla-Carrera et al. 2013, Span. J. Agric. Res.', doi: '10.5424/sjar/2013114-4210' }
  },
  {
    pest: { en: 'Voles', de: 'Wühlmäuse' },
    measure: { en: 'Plant young trees in a wire root basket.', de: 'Jungbäume in einem Wurzelschutzkorb aus Draht pflanzen.' }
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
