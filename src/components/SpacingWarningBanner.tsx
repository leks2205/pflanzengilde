import React from 'react';
import { GuildPlant, Language, getLoc } from '../types/guild';
import { PlantOverlapConflict, SpacingReport } from '../core/spacingEngine';
import { t, formatNumber, translateRole, translateZone } from '../i18n/translations';
import { AlertTriangle, AlertOctagon, ArrowRightLeft, Sparkles, Layers } from 'lucide-react';

interface SpacingWarningBannerProps {
  language: Language;
  report: SpacingReport;
  onSwapPlant?: (removePlantId: string, addPlant: GuildPlant) => void;
}

export const SpacingWarningBanner: React.FC<SpacingWarningBannerProps> = ({
  language,
  report,
  onSwapPlant,
}) => {
  const tr = t(language);
  const hasZoneOvercrowded = report.zoneSaturations.some(z => z.isOvercrowded);

  if (!report.hasConflicts && !hasZoneOvercrowded) return null;

  const renderAlternatives = (
    original: GuildPlant,
    alternatives: PlantOverlapConflict['suggestedAlternativesA']
  ) => {
    if (alternatives.length === 0) return null;
    return (
      <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/80 space-y-1.5">
        <div className="text-[10px] font-bold text-stone-600 flex items-center justify-between">
          <span>
            {tr.spacingBannerAlternativesFor.replace('{plant}', getLoc(original.commonName, language)).replace('{spread}', String(original.spreadM))}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {alternatives.map(alt => (
            <div
              key={alt.plant.id}
              className="bg-white p-2 rounded-lg border border-stone-200 flex flex-col justify-between gap-1.5"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-stone-900 text-xs">
                    {getLoc(alt.plant.commonName, language)}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    -{alt.spreadReductionPercent}% {tr.spacingBannerSpread}
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">
                  {getLoc(alt.reason, language)}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {alt.sharedRoles.map(r => (
                    <span key={r} className="text-[9px] px-1 py-0.2 rounded bg-forest-50 text-forest-800 font-medium">
                      {translateRole(r, language)}
                    </span>
                  ))}
                </div>
              </div>

              {onSwapPlant && (
                <button
                  type="button"
                  onClick={() => onSwapPlant(original.id, alt.plant)}
                  className="w-full mt-1 px-2 py-1 rounded bg-forest-600 hover:bg-forest-700 text-white font-semibold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>{tr.spacingSwapAction} {getLoc(alt.plant.commonName, language)}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-4 sm:p-5 text-xs text-stone-800 space-y-4 shadow-sm animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-200/80">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl shrink-0 ${
            report.hasCritical
              ? 'bg-rose-100 text-rose-700'
              : 'bg-amber-100 text-amber-800'
          }`}>
            {report.hasCritical ? (
              <AlertOctagon className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <span>{tr.spacingOverlapTitle}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                report.hasCritical
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-amber-600 text-white'
              }`}>
                {report.totalConflicts > 0
                  ? `${report.totalConflicts} ${tr.spacingBannerCollisions}`
                  : tr.spacingBannerZoneSaturated}
              </span>
            </h4>
            <p className="text-[11px] text-stone-600 mt-0.5">
              {tr.spacingOverlapSub}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3.5">
        {report.conflicts.map((conflict: PlantOverlapConflict) => {
          const isCrit = conflict.severity === 'CRITICAL';
          const pA = conflict.plantA.plant;
          const pB = conflict.plantB.plant;

          return (
            <div
              key={conflict.id}
              className={`p-3.5 rounded-xl border bg-white shadow-2xs space-y-3 ${
                isCrit ? 'border-rose-300 ring-1 ring-rose-200' : 'border-amber-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pA.color }} />
                    <span>{getLoc(pA.commonName, language)}</span>
                  </span>
                  <span className="text-stone-400 font-normal">✕</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pB.color }} />
                    <span>{getLoc(pB.commonName, language)}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold">
                  <span className={`px-2 py-0.5 rounded-md ${
                    isCrit ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {tr.spacingOverlapRatio}: {conflict.overlapPercent}% ({formatNumber(conflict.overlapDistanceM, 2, language)} m)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                    {tr.spacingMeasuredDistance}: {formatNumber(conflict.distanceM, 2, language)} m ({tr.spacingRequiredLabel}: ≥ {formatNumber(conflict.combinedRadiusM, 2, language)} m)
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-stone-600 leading-relaxed">
                {tr.spacingConflictDesc}
              </p>

              {(conflict.suggestedAlternativesA.length > 0 || conflict.suggestedAlternativesB.length > 0) && (
                <div className="pt-2 border-t border-stone-100 space-y-2">
                  <div className="text-[11px] font-bold text-forest-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-forest-600" />
                    <span>{tr.spacingSuggestedAlternatives}</span>
                  </div>

                  {renderAlternatives(pA, conflict.suggestedAlternativesA)}
                  {renderAlternatives(pB, conflict.suggestedAlternativesB)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasZoneOvercrowded && (
        <div className="pt-2 border-t border-amber-200">
          <div className="text-[11px] font-bold text-amber-950 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            <span>{tr.spacingZoneSaturatedTitle}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {report.zoneSaturations.filter(z => z.isOvercrowded).map(z => (
              <div key={z.zone} className="p-2.5 rounded-lg bg-amber-100/70 border border-amber-300 text-xs">
                <div className="font-bold text-amber-950 flex items-center justify-between">
                  <span>{translateZone(z.zone, language)}</span>
                  <span className="font-extrabold text-amber-900">{z.saturationPercent}% {tr.spacingBannerSaturated}</span>
                </div>
                <div className="text-[10px] text-amber-900/80 mt-0.5">
                  {z.plantCount} {tr.spacingBannerPlantsAcross} {z.zoneAreaM2.toFixed(1)} m² ({z.plantsAreaM2.toFixed(1)} m² {tr.spacingBannerTotalCanopyArea}). {tr.spacingZoneSaturatedDesc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
