import React, { useMemo, useState } from 'react';
import { GuildPlant, Hemisphere, Language, StarTree, getLoc } from '../types/guild';
import { analyzeGuildAntagonisms, AntagonistConflict } from '../core/antagonistEngine';
import { t, formatNumber } from '../i18n/translations';
import {
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  Compass,
  BookOpen,
  ChevronDown,
  ChevronUp,
  MapPin,
  ShieldAlert,
  Info,
  Sparkles
} from 'lucide-react';
import { SourceList } from './SourceList';

interface AntagonistCardProps {
  language: Language;
  starTree: StarTree;
  selectedPlants: GuildPlant[];
  hemisphere?: Hemisphere;
}

export const AntagonistCard: React.FC<AntagonistCardProps> = ({
  language,
  starTree,
  selectedPlants,
  hemisphere = 'NORTHERN'
}) => {
  const tr = t(language);
  const report = useMemo(
    () => analyzeGuildAntagonisms(starTree, selectedPlants, hemisphere),
    [starTree, selectedPlants, hemisphere]
  );
  const [expandedCitations, setExpandedCitations] = useState<Record<string, boolean>>({});
  const [isInternalExpanded, setIsInternalExpanded] = useState<boolean>(true);
  const [isLandscapeExpanded, setIsLandscapeExpanded] = useState<boolean>(false);
  const [isHarmoniesExpanded, setIsHarmoniesExpanded] = useState<boolean>(true);

  const toggleCitations = (id: string) => {
    setExpandedCitations(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const internalConflicts = report.conflicts.filter(c => c.type === 'INTERNAL_PROXIMITY');
  const landscapeConflicts = report.conflicts.filter(c => c.type !== 'INTERNAL_PROXIMITY');

  const landscapeHasCritical = landscapeConflicts.some(c => c.severity === 'CRITICAL');
  const landscapeHasWarning = landscapeConflicts.some(c => c.severity === 'WARNING');
  const landscapeHighestSeverity: 'CRITICAL' | 'WARNING' | 'INFO' = landscapeHasCritical
    ? 'CRITICAL'
    : landscapeHasWarning
    ? 'WARNING'
    : 'INFO';

  // The landscape section takes the colour of its most severe notice.
  const landscapeTabStyles = {
    CRITICAL: {
      container: 'border-rose-200 bg-rose-50/20',
      header: 'bg-rose-50/90 hover:bg-rose-100/70 border-rose-200/80 text-rose-950',
      badge: 'bg-rose-600 text-white',
      icon: <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />,
      chevron: 'text-rose-600'
    },
    WARNING: {
      container: 'border-amber-200 bg-amber-50/20',
      header: 'bg-amber-50/90 hover:bg-amber-100/70 border-amber-200/80 text-amber-950',
      badge: 'bg-amber-600 text-white',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />,
      chevron: 'text-amber-600'
    },
    INFO: {
      container: 'border-sky-200 bg-sky-50/20',
      header: 'bg-sky-50/90 hover:bg-sky-100/70 border-sky-200/80 text-sky-950',
      badge: 'bg-sky-600 text-white',
      icon: <Info className="w-4 h-4 text-sky-600 shrink-0" />,
      chevron: 'text-sky-600'
    }
  }[landscapeHighestSeverity];

  const renderConflictCard = (conflict: AntagonistConflict) => {
    const isCrit = conflict.severity === 'CRITICAL';
    const isWarn = conflict.severity === 'WARNING';
    const citationsOpen = !!expandedCitations[conflict.id];

    return (
      <div
        key={conflict.id}
        className={`rounded-2xl border p-4 sm:p-5 transition-all ${
          isCrit
            ? 'border-rose-200 bg-rose-50/40 hover:border-rose-300'
            : isWarn
            ? 'border-amber-200 bg-amber-50/30 hover:border-amber-300'
            : 'border-sky-200 bg-sky-50/30 hover:border-sky-300'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3 pb-3 border-b border-stone-200/60">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                isCrit
                  ? 'bg-rose-600 text-white'
                  : isWarn
                  ? 'bg-amber-600 text-white'
                  : 'bg-sky-600 text-white'
              }`}>
                {isCrit ? tr.antagonistCriticalAlert : isWarn ? tr.antagonistWarningAlert : tr.antagonistInfoAlert}
              </span>

              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                {conflict.type === 'INTERNAL_PROXIMITY' ? tr.antagonistInternalTag : tr.antagonistExternalTag}
              </span>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-800 text-white flex items-center gap-1">
                <span>{tr.antagonistBufferLabel}:</span>
                <span>≥ {conflict.safeDistanceM} m</span>
              </span>
            </div>

            <h3 className="text-base font-bold text-stone-900 leading-snug">
              {getLoc(conflict.title, language)}
            </h3>

            <div className="text-xs text-stone-600 font-medium mt-0.5 flex flex-wrap items-center gap-1">
              <span className="font-bold text-stone-800">{getLoc(conflict.antagonistName, language)}</span>
              <span className="text-stone-400 italic">({conflict.antagonistBotanical})</span>
            </div>
          </div>
        </div>

        <div className="mb-3.5 p-3 rounded-xl bg-white/90 border border-stone-200/80 shadow-2xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-forest-600" />
            <span>{tr.antagonistAffectedInGuild} ({conflict.affectedPlants.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {conflict.affectedPlants.map((plant, idx) => (
              <div
                key={`${plant.id}-${idx}`}
                className="p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs flex flex-col justify-between"
              >
                <div className="font-semibold text-stone-900 line-clamp-1">
                  {getLoc(plant.name, language)}
                  <span className="text-[10px] font-normal italic text-stone-500 ml-1">
                    ({plant.botanicalName})
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-stone-600 font-medium">
                  <span className="text-forest-700 font-bold">
                    {formatNumber(plant.distanceM, 1, language)} m
                  </span>
                  <span className="text-stone-500 text-[10px]">
                    {getLoc(plant.cardinalDirection, language)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3 p-3.5 rounded-xl bg-white/80 border border-stone-200/80 text-xs leading-relaxed text-stone-700">
          <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>{tr.antagonistMechanism}</span>
          </div>
          <p>{getLoc(conflict.mechanism, language)}</p>
        </div>

        <div className="mb-3 p-3.5 rounded-xl bg-emerald-950 text-white text-xs leading-relaxed shadow-xs">
          <div className="font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>{tr.antagonistSpatialAdvice}</span>
          </div>
          <p className="text-emerald-50/95">{getLoc(conflict.spatialAdvice, language)}</p>
        </div>

        <div className="pt-1">
          <button
            type="button"
            onClick={() => toggleCitations(conflict.id)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-forest-600" />
            <span>{tr.antagonistScientificSources} ({conflict.scientificCitations.length})</span>
            {citationsOpen ? (
              <ChevronUp className="w-3 h-3 text-stone-400" />
            ) : (
              <ChevronDown className="w-3 h-3 text-stone-400" />
            )}
          </button>

          {citationsOpen && (
            <div className="mt-2 p-3 rounded-xl bg-stone-100/90 border border-stone-200 animate-in fade-in">
              <SourceList
                sources={conflict.scientificCitations}
                language={language}
                title={null}
                collapseAfter={0}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${
              report.hasCritical
                ? 'bg-rose-100 text-rose-700'
                : report.hasWarning
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {report.hasCritical ? (
                <AlertOctagon className="w-5 h-5" />
              ) : report.hasWarning ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>{tr.antagonistsSectionTitle}</span>
                {report.totalConflicts > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    report.hasCritical
                      ? 'bg-rose-100 text-rose-800 ring-1 ring-rose-300 animate-pulse'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {report.totalConflicts} {report.totalConflicts === 1 ? tr.antagonistCardNoticeSingular : tr.antagonistCardNoticePlural}
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {tr.antagonistsSectionSub}
              </p>
            </div>
          </div>
        </div>

        <div className="self-start sm:self-center">
          {report.totalConflicts === 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{tr.antagonistCardFullyCompatible}</span>
            </div>
          ) : report.hasCritical ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <span>{tr.antagonistCriticalAlert}</span>
            </div>
          ) : report.hasWarning ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{tr.antagonistWarningAlert}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold">
              <Info className="w-4 h-4 text-sky-600" />
              <span>{tr.antagonistInfoAlert}</span>
            </div>
          )}
        </div>
      </div>

      {report.conflicts.length === 0 ? (
        <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-emerald-950 text-sm mb-1">{tr.noAntagonistsFound}</h3>
          <p className="text-xs text-emerald-800/80 max-w-xl">
            {tr.noAntagonistsFoundSub}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {internalConflicts.length > 0 ? (
            <div className="rounded-2xl border border-rose-300 bg-rose-50/30 overflow-hidden transition-all shadow-2xs">
              <button
                type="button"
                onClick={() => setIsInternalExpanded(prev => !prev)}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-bold text-sm bg-rose-50/90 hover:bg-rose-100/70 border-b border-rose-200/80 text-rose-950 transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5">
                  <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-bold">{tr.antagonistInternalTag}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                    {internalConflicts.length}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-rose-700 font-semibold">
                  <span>{isInternalExpanded ? tr.antagonistCardCollapse : tr.antagonistCardExpand}</span>
                  {isInternalExpanded ? <ChevronUp className="w-4 h-4 text-rose-600" /> : <ChevronDown className="w-4 h-4 text-rose-600" />}
                </div>
              </button>

              {isInternalExpanded && (
                <div className="p-3.5 sm:p-4 space-y-3.5 bg-white/70">
                  {internalConflicts.map(renderConflictCard)}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 text-xs text-emerald-900 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">{tr.antagonistInternalTag}:</span>
                <span>{tr.antagonistCardZeroConflicts}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                0
              </span>
            </div>
          )}

          {landscapeConflicts.length > 0 && (
            <div className={`rounded-2xl border ${landscapeTabStyles.container} overflow-hidden transition-all shadow-2xs`}>
              <button
                type="button"
                onClick={() => setIsLandscapeExpanded(prev => !prev)}
                className={`w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-bold text-sm ${landscapeTabStyles.header} transition-colors cursor-pointer select-none`}
              >
                <div className="flex items-center gap-2.5">
                  {landscapeTabStyles.icon}
                  <span className="font-bold">{tr.antagonistExternalTag}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${landscapeTabStyles.badge}`}>
                    {landscapeConflicts.length}
                  </span>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-semibold ${landscapeTabStyles.chevron}`}>
                  <span>{isLandscapeExpanded ? tr.antagonistCardCollapse : tr.antagonistCardExpand}</span>
                  {isLandscapeExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isLandscapeExpanded && (
                <div className="p-3.5 sm:p-4 space-y-3.5 border-t border-stone-200/80 bg-white/70">
                  {landscapeConflicts.map(renderConflictCard)}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {report.resolvedHarmonies && report.resolvedHarmonies.length > 0 && (
        <div className="mt-4 rounded-2xl border border-emerald-300 bg-emerald-50/20 overflow-hidden transition-all shadow-2xs">
          <button
            type="button"
            onClick={() => setIsHarmoniesExpanded(prev => !prev)}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-bold text-sm bg-emerald-50/90 hover:bg-emerald-100/70 text-emerald-950 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">
                {tr.antagonistCardAutoOptimizedSpacing}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                {report.resolvedHarmonies.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <span>{isHarmoniesExpanded ? tr.antagonistCardCollapse : tr.antagonistCardExpand}</span>
              {isHarmoniesExpanded ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-emerald-600" />}
            </div>
          </button>

          {isHarmoniesExpanded && (
            <div className="p-3.5 sm:p-4 space-y-3.5 border-t border-emerald-200/80 bg-white/70">
              {report.resolvedHarmonies.map((harmony) => (
                <div
                  key={harmony.id}
                  className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5 transition-all shadow-2xs"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3 pb-2 border-b border-emerald-200/60">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                          {tr.antagonistCardOptimallySpaced}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-900 text-white flex items-center gap-1">
                          <span>{tr.antagonistBufferLabel}:</span>
                          <span>≥ {harmony.safeDistanceM} m</span>
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-stone-900 leading-snug">
                        {getLoc(harmony.title, language)}
                      </h3>
                      <div className="text-xs text-stone-600 font-medium mt-0.5">
                        <span className="font-bold text-stone-800">{getLoc(harmony.antagonistName, language)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 p-3 rounded-xl bg-white/95 border border-emerald-200/80 shadow-2xs">
                    <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-forest-600" />
                      <span>{tr.antagonistAffectedInGuild} ({harmony.affectedPlants.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {harmony.affectedPlants.map((plant, idx) => (
                        <div
                          key={`${plant.id}-${idx}`}
                          className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs flex flex-col justify-between"
                        >
                          <div className="font-semibold text-stone-900 line-clamp-1">
                            {getLoc(plant.name, language)}
                            <span className="text-[10px] font-normal italic text-stone-500 ml-1">
                              ({plant.botanicalName})
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[11px] text-stone-600 font-medium">
                            <span className="text-forest-700 font-bold">
                              {formatNumber(plant.distanceM, 1, language)} m
                            </span>
                            <span className="text-stone-600 text-[10px] font-semibold">
                              {getLoc(plant.cardinalDirection, language)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/90 border border-emerald-200/80 text-xs leading-relaxed text-stone-700">
                    <p className="font-semibold text-emerald-950 mb-1">{getLoc(harmony.spatialAdvice, language)}</p>
                    <p className="text-stone-600">{getLoc(harmony.mechanism, language)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
