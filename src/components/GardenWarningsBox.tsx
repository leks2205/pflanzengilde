import React from 'react';
import { Language, getLoc } from '../types/guild';
import { GardenConflict, GardenShadePocket, GardenStarPlantInstance, GardenStats } from '../types/garden';
import { AlertOctagon, AlertTriangle, CheckCircle2, CloudRain, ShieldCheck, Sparkles, Sun } from 'lucide-react';
import { t, formatNumber } from '../i18n/translations';
import { SourceList } from './SourceList';

interface GardenWarningsBoxProps {
  language: Language;
  conflicts: GardenConflict[];
  shadePockets: GardenShadePocket[];
  stats: GardenStats;
  starPlants?: GardenStarPlantInstance[];
  autoShadeEnabled?: boolean;
  onToggleAutoShade?: () => void;
  onApplyShadePlant?: (plantId: string) => void;
}

export const GardenWarningsBox: React.FC<GardenWarningsBoxProps> = ({
  language,
  conflicts,
  shadePockets,
  stats,
  starPlants = [],
  autoShadeEnabled = false,
  onToggleAutoShade,
  onApplyShadePlant,
}) => {
  const tr = t(language);
  const involvedTreeIds = new Set(shadePockets.flatMap(p => p.treeIds));
  const involvedTrees = starPlants.filter(t => involvedTreeIds.has(t.instanceId));

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-forest-700" />
          <h3 className="text-sm font-bold text-stone-900">
            {tr.gardenWarningsTitle}
          </h3>
        </div>
        {conflicts.length > 0 ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>{conflicts.length} {tr.gardenWarningsConflicts}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{tr.gardenWarningsInHarmony}</span>
          </span>
        )}
      </div>

      <div className="space-y-2.5">
        <div className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
          <span>{tr.gardenWarningsCompatHeading}</span>
          <span className="text-[10px] font-normal text-stone-400">
            {conflicts.length} {tr.gardenWarningsDetected}
          </span>
        </div>

        {conflicts.length === 0 ? (
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">
                {tr.gardenWarningsAllHarmony}
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                {tr.gardenWarningsNoConflictsDesc}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {conflicts.map(c => {
              const isCrit = c.severity === 'CRITICAL';
              return (
                <div
                  key={c.id}
                  className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                    isCrit
                      ? 'bg-rose-50/80 border-rose-300 text-rose-950'
                      : 'bg-amber-50/80 border-amber-300 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold flex items-center gap-1.5">
                      {isCrit ? (
                        <AlertOctagon className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      )}
                      <span>{getLoc(c.title, language)}</span>
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isCrit ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
                    }`}>
                      {formatNumber(c.distanceM, 1, language)} m / min. {formatNumber(c.requiredDistanceM, 1, language)} m
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-stone-700">
                    {getLoc(c.description, language)}
                  </p>
                  <SourceList sources={c.sources} language={language} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-2 pt-2 border-t border-stone-100">
        <div className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>{tr.gardenWarningsCanopyShading}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleAutoShade}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                autoShadeEnabled
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200'
              }`}
              title={tr.gardenWarningsAutoShadeTitle}
            >
              <Sparkles className="w-3 h-3" />
              <span>Auto: {autoShadeEnabled ? tr.gardenWarningsOn : tr.gardenWarningsOff}</span>
            </button>
            <span className="text-[10px] font-normal text-stone-400">
              {shadePockets.length} {tr.gardenWarningsOverlaps}
            </span>
          </div>
        </div>

        {shadePockets.length > 0 ? (
          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-sky-900">
              <CloudRain className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                {tr.gardenWarningsShadePockets.replace('{count}', String(shadePockets.length))}
              </span>
            </div>
            <p className="text-[11px] text-sky-800 leading-relaxed">
              {tr.gardenWarningsShadeAdvice}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {[
                { id: 'plant-wild-garlic', icon: '🌿', name: tr.gardenWarningsShadeWildGarlic },
                { id: 'plant-hosta', icon: '🍃', name: tr.gardenWarningsShadeHosta },
                { id: 'plant-comfrey', icon: '🌱', name: tr.gardenWarningsShadeComfrey },
              ].map(spec => {
                const isSatisfied =
                  involvedTrees.length > 0 &&
                  involvedTrees.every(t =>
                    (t.selectedPlantIds?.length ? t.selectedPlantIds : t.starTree.recommendedCompanions).includes(spec.id)
                  );

                if (isSatisfied) {
                  return (
                    <div
                      key={spec.id}
                      className="px-2.5 py-1 bg-emerald-50 border border-emerald-300 rounded-lg text-[11px] font-medium text-emerald-950 flex items-center gap-1.5 shadow-2xs"
                      title={tr.gardenWarningsShadeSatisfiedTitle.replace('{name}', spec.name)}
                    >
                      <span>{spec.icon}</span>
                      <span>{spec.name}</span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded border border-emerald-300">
                        ✓ {tr.gardenWarningsPlaced}
                      </span>
                    </div>
                  );
                }

                return (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => onApplyShadePlant?.(spec.id)}
                    className="px-2.5 py-1 bg-white hover:bg-sky-100 border border-sky-200 hover:border-sky-400 rounded-lg text-[11px] font-medium text-sky-950 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    title={tr.gardenWarningsShadeApplyTitle.replace('{name}', spec.name)}
                  >
                    <span>{spec.icon}</span>
                    <span>{spec.name}</span>
                    <span className="text-[9px] font-bold text-sky-600 bg-sky-50 px-1 py-0.2 rounded border border-sky-200">
                      + {tr.gardenWarningsPlace}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-500">
            {tr.gardenWarningsNoShade}
          </p>
        )}
      </div>

      <div className="space-y-2 pt-2 border-t border-stone-100">
        <div className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
          <span>{tr.gardenWarningsEfficiency}</span>
          <span className="text-emerald-700 font-bold">{stats.savingsPercent}% {tr.gardenWarningsSaved}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
            <div className="text-base font-extrabold text-stone-900">{stats.starPlantCount}</div>
            <div className="text-[10px] text-stone-500">{tr.gardenPdfStarPlants}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-forest-50 border border-forest-200">
            <div className="text-base font-extrabold text-forest-800">{stats.companionPlantCount}</div>
            <div className="text-[10px] text-forest-700">
              {tr.gardenWarningsCompanionsVs.replace('{count}', String(stats.unoptimizedCompanionCount))}
            </div>
          </div>
        </div>

        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600">
            <span>{tr.gardenWarningsRolesCovered}</span>
            <span className="font-mono text-forest-700 font-bold">{stats.coveredRoles} / 9</span>
          </div>
          <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
            <div
              className="h-full bg-forest-600 rounded-full transition-all duration-500"
              style={{ width: `${(stats.coveredRoles / 9) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
