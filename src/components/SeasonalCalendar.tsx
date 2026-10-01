import React, { useMemo } from 'react';
import { ActiveGapFilter, GuildPlant, Language, PhenoSeason, StarTree, getLoc } from '../types/guild';
import { analyzeSeasonalRoleGaps, PHENO_SEASONS, getSuggestedPlantsForGap, analyzePlantRedundancy } from '../core/seasonalGapEngine';
import { Calendar, AlertCircle, Plus, Check, Sparkles, Clock, Filter, Search, RefreshCw, ArrowRightLeft, Trash2 } from 'lucide-react';
import { t, translateRole, translateSeason } from '../i18n/translations';

interface SeasonalCalendarProps {
  language: Language;
  selectedPlants: GuildPlant[];
  currentSeason: PhenoSeason;
  onSelectSeason: (season: PhenoSeason) => void;
  onAddPlant: (plant: GuildPlant) => void;
  onFilterByGap?: (gap: ActiveGapFilter) => void;
  activeGapFilter?: ActiveGapFilter | null;
  onSwapPlant?: (removePlantId: string, addPlant: GuildPlant) => void;
  onRemovePlant?: (plant: GuildPlant) => void;
  selectedTree?: StarTree | null;
}

export const SeasonalCalendar: React.FC<SeasonalCalendarProps> = ({
  language,
  selectedPlants,
  currentSeason,
  onSelectSeason,
  onAddPlant,
  onFilterByGap,
  activeGapFilter,
  onSwapPlant,
  onRemovePlant,
  selectedTree,
}) => {
  const tr = t(language);
  const roleStatuses = useMemo(() => analyzeSeasonalRoleGaps(selectedPlants, selectedTree), [selectedPlants, selectedTree]);
  const redundantReports = useMemo(
    () => analyzePlantRedundancy(selectedPlants, selectedTree),
    [selectedPlants, selectedTree]
  );
  const allGaps = useMemo(() => roleStatuses.flatMap(rs => rs.gaps), [roleStatuses]);

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-forest-600" />
            {tr.calendarTitle}
          </h3>
          <p className="text-xs text-stone-500">
            {tr.calendarSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl overflow-x-auto text-xs">
          {PHENO_SEASONS.map(s => {
            const isCurrent = currentSeason === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectSeason(s.id)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition-all ${
                  isCurrent
                    ? 'bg-white text-forest-800 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {getLoc(s.label, language)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-200 text-stone-400">
              <th className="py-2 px-3 font-semibold text-stone-700 w-44">{tr.functionalRole}</th>
              {PHENO_SEASONS.map(s => (
                <th
                  key={s.id}
                  className={`py-2 px-2 text-center transition-colors font-medium ${
                    currentSeason === s.id ? 'text-forest-700 bg-forest-50/70 rounded-t-lg' : ''
                  }`}
                >
                  <div className="font-bold">{getLoc(s.label, language)}</div>
                  <div className="text-[10px] text-stone-400 font-normal">{getLoc(s.months, language)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {roleStatuses.map(rs => {
              const hasAnyPlant = selectedPlants.some(p => p.roles.includes(rs.role));
              return (
                <tr key={rs.role} className="hover:bg-stone-50/50">
                  <td className="py-2.5 px-3 font-semibold text-stone-800">
                    <div>{getLoc(rs.displayName, language)}</div>
                    <div className="text-[10px] text-stone-400 font-normal">
                      {hasAnyPlant ? translateRole(rs.role, language) : tr.noPlantChosenYet}
                    </div>
                  </td>

                  {PHENO_SEASONS.map(s => {
                    const cell = rs.seasonCoverage[s.id];
                    const isCurrent = currentSeason === s.id;

                    return (
                      <td
                        key={s.id}
                        className={`py-2.5 px-2 text-center transition-colors ${
                          isCurrent ? 'bg-forest-50/50' : ''
                        }`}
                      >
                        {(() => {
                          const isCellFiltered = activeGapFilter?.role === rs.role && activeGapFilter?.season === s.id;

                          if (cell.covered) {
                            return (
                              <div className="inline-flex flex-col items-center group relative cursor-help">
                                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shadow-2xs">
                                  <Check className="w-3.5 h-3.5" />
                                </span>
                                <span className="text-[10px] text-stone-600 font-medium mt-0.5 max-w-[80px] truncate">
                                  {getLoc(cell.plants[0]?.commonName, language)}
                                  {cell.plants.length > 1 && ` +${cell.plants.length - 1}`}
                                </span>
                                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-50 w-44 bg-stone-900 text-white text-[10px] rounded p-1.5 shadow-lg pointer-events-none">
                                  {cell.plants.map(p => getLoc(p.commonName, language)).join(', ')}
                                </div>
                              </div>
                            );
                          } else if (hasAnyPlant) {
                            return (
                              <button
                                type="button"
                                onClick={() => onFilterByGap?.({ role: rs.role, season: s.id })}
                                className={`inline-flex flex-col items-center group cursor-pointer p-1 rounded-xl transition-all hover:scale-105 active:scale-95 focus:outline-none ${
                                  isCellFiltered
                                    ? 'ring-2 ring-amber-500 bg-amber-100/90 shadow-xs'
                                    : 'hover:bg-rose-100/80'
                                }`}
                                title={tr.clickToFillGap}
                              >
                                <span
                                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-2xs transition-colors ${
                                    isCellFiltered
                                      ? 'bg-amber-500 text-white'
                                      : 'bg-rose-50 text-rose-500 border border-rose-200 group-hover:bg-rose-500 group-hover:text-white'
                                  }`}
                                >
                                  {tr.missingGap}
                                </span>
                                <span className="text-[9px] text-rose-600 font-semibold mt-0.5 group-hover:underline flex items-center gap-0.5">
                                  <Search className="w-2.5 h-2.5" />
                                  {tr.missingGap}
                                </span>
                              </button>
                            );
                          } else {
                            return (
                              <button
                                type="button"
                                onClick={() => onFilterByGap?.({ role: rs.role, season: s.id })}
                                className={`inline-flex flex-col items-center group cursor-pointer p-1 rounded-xl transition-all hover:scale-105 active:scale-95 focus:outline-none ${
                                  isCellFiltered
                                    ? 'ring-2 ring-amber-500 bg-amber-50 shadow-xs'
                                    : 'hover:bg-stone-100'
                                }`}
                                title={tr.clickToFillGap}
                              >
                                <span
                                  className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs transition-colors ${
                                    isCellFiltered
                                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                                      : 'bg-stone-100 text-stone-400 border-stone-200 group-hover:border-forest-400 group-hover:bg-forest-50 group-hover:text-forest-700'
                                  }`}
                                >
                                  <Plus className="w-3 h-3 text-stone-400 group-hover:text-forest-600" />
                                </span>
                                <span className="text-[9px] text-stone-400 group-hover:text-forest-700 font-medium mt-0.5">
                                  —
                                </span>
                              </button>
                            );
                          }
                        })()}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {allGaps.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>{tr.gapsDetectedTitle}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allGaps.map((gap, idx) => {
              const suggestedPlants = getSuggestedPlantsForGap(gap.suggestedPlantIds);
              const isGapActive = activeGapFilter?.role === gap.role && activeGapFilter?.season === gap.season;

              return (
                <div
                  key={`${gap.role}-${gap.season}-${idx}`}
                  className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                    isGapActive
                      ? 'border-amber-400 bg-amber-100/60 ring-2 ring-amber-400/50'
                      : 'border-amber-200 bg-amber-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-amber-950 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        {translateSeason(gap.season, language)}: {translateRole(gap.role, language)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">
                          {tr.temporalGap}
                        </span>
                        <button
                          type="button"
                          onClick={() => onFilterByGap?.({ role: gap.role, season: gap.season })}
                          className="px-2 py-0.5 rounded bg-white hover:bg-amber-200 border border-amber-300 text-amber-950 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                          title={tr.clickToFillGap}
                        >
                          <Filter className="w-2.5 h-2.5 text-amber-700" />
                          <span>{tr.filterGapAction}</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-amber-900/90 text-[11px] leading-relaxed mb-2.5">
                      {getLoc(gap.reason, language)}
                    </p>
                  </div>

                  {suggestedPlants.length > 0 && (
                    <div className="pt-2 border-t border-amber-200/60">
                      <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        {tr.recommendedAllies}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {suggestedPlants.slice(0, 3).map(candidate => (
                          <button
                            key={candidate.id}
                            type="button"
                            onClick={() => onAddPlant(candidate)}
                            className="group px-2 py-1 rounded-lg bg-white border border-amber-300 hover:bg-forest-600 hover:text-white hover:border-forest-600 text-amber-950 text-[11px] font-medium shadow-2xs flex items-center gap-1 transition-all"
                            title={tr.seasonalCalendarAddToFillGap.replace('{plant}', getLoc(candidate.commonName, language)).replace('{season}', translateSeason(gap.season, language))}
                          >
                            <Plus className="w-3 h-3 text-forest-600 group-hover:text-white" />
                            <span>+ {getLoc(candidate.commonName, language)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {allGaps.length === 0 && selectedPlants.length > 2 && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            <strong>{tr.flawlessTitle}</strong> {tr.flawlessDesc}
          </span>
        </div>
      )}

      {redundantReports.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-stone-200">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-sky-950 flex items-center gap-2">
                <span>{tr.redundantSectionTitle}</span>
                <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                  {redundantReports.length} {tr.seasonalCalendarOptimizable}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                {tr.redundantSectionSub}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {redundantReports.map((report) => (
              <div
                key={report.plant.id}
                className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50 space-y-2.5 text-xs flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: report.plant.color }}
                      />
                      <span className="font-bold text-stone-900 text-sm">
                        {getLoc(report.plant.commonName, language)}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-300">
                      {tr.redundantBadge}
                    </span>
                  </div>

                  <div className="text-[11px] text-stone-600 space-y-1 mb-2">
                    <div className="font-medium text-stone-700">
                      {tr.redundantCoveredByLabel}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {report.coveringPlants.map(cov => (
                        <span
                          key={cov.id}
                          className="px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-700 font-medium text-[10px] flex items-center gap-1 shadow-2xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cov.color }} />
                          {getLoc(cov.commonName, language)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-sky-200/80">
                  {report.suggestedAlternativeForGaps.length > 0 && onSwapPlant && (
                    <div>
                      <div className="text-[10px] font-bold text-sky-900 flex items-center gap-1 mb-1">
                        <Sparkles className="w-3 h-3 text-sky-600" />
                        <span>{tr.redundantSwapForUncovered}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {report.suggestedAlternativeForGaps.map(cand => (
                          <button
                            key={cand.id}
                            type="button"
                            onClick={() => onSwapPlant(report.plant.id, cand)}
                            className="group px-2 py-1 rounded-lg bg-white border border-sky-300 hover:bg-forest-600 hover:text-white hover:border-forest-600 text-stone-800 text-[11px] font-medium shadow-2xs flex items-center gap-1 transition-all cursor-pointer"
                            title={tr.seasonalCalendarSwapWith.replace('{plant}', getLoc(report.plant.commonName, language)).replace('{candidate}', getLoc(cand.commonName, language))}
                          >
                            <ArrowRightLeft className="w-3 h-3 text-sky-600 group-hover:text-white" />
                            <span>{getLoc(cand.commonName, language)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {onRemovePlant && (
                    <div className="pt-1 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => onRemovePlant(report.plant)}
                        className="text-[11px] text-rose-700 hover:text-rose-900 font-medium flex items-center gap-1 transition-colors hover:underline cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{tr.redundantRemoveAction}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
