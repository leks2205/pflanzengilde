import React from 'react';
import { GuildPlant, Language, getLoc } from '../types/guild';
import { calculateGuildEfficiencyScore, calculateRoleCoverage, detectMultiFunctionalHeroes } from '../core/roleCoverageEngine';
import { CheckCircle2, CircleDashed, Sparkles, Award } from 'lucide-react';
import { t } from '../i18n/translations';

interface RoleCoverageCardProps {
  language: Language;
  selectedPlants: GuildPlant[];
}

export const RoleCoverageCard: React.FC<RoleCoverageCardProps> = ({ language, selectedPlants }) => {
  const tr = t(language);
  const coverage = calculateRoleCoverage(selectedPlants);
  const efficiency = calculateGuildEfficiencyScore(selectedPlants);
  const multiHeroes = detectMultiFunctionalHeroes(selectedPlants);

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-1.5">
            <Award className="w-5 h-5 text-forest-600" />
            {tr.coverageTitle}
          </h3>
          <p className="text-xs text-stone-500">
            {tr.coverageSubtitle}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xl font-extrabold text-forest-700">
            {efficiency.coveredRoleCount} / {efficiency.totalRoles}
          </div>
          <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
            {efficiency.efficiencyPercent}% {tr.coveredRatio}
          </div>
        </div>
      </div>

      <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            efficiency.isFullyCovered ? 'bg-forest-600' : 'bg-forest-500'
          }`}
          style={{ width: `${efficiency.efficiencyPercent}%` }}
        />
      </div>

      {multiHeroes.length > 0 && (
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{tr.heroesTitle}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {multiHeroes.map(({ plant, roleCount }) => (
              <span
                key={plant.id}
                className="px-2 py-0.5 rounded-lg bg-white border border-amber-200 text-amber-900 text-xs font-medium shadow-2xs flex items-center gap-1"
                title={`${getLoc(plant.commonName, language)}: ${roleCount} ${tr.rolesStacked}`}
              >
                <span>{getLoc(plant.commonName, language)}</span>
                <span className="text-[10px] font-bold px-1 rounded bg-amber-200 text-amber-800">
                  {roleCount}
                </span>
              </span>
            ))}
          </div>
          <p className="text-[10px] text-amber-800/80 mt-1.5">
            {tr.heroesTip}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
        {coverage.map((item) => {
          return (
            <div
              key={item.role}
              className={`p-2.5 rounded-xl border text-xs flex items-start justify-between transition-all ${
                item.covered
                  ? 'border-forest-200 bg-forest-50/50 text-forest-950'
                  : 'border-stone-200 bg-stone-50/50 text-stone-500'
              }`}
            >
              <div className="flex items-start gap-2">
                {item.covered ? (
                  <CheckCircle2 className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <CircleDashed className="w-4 h-4 text-stone-300 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <div className="font-semibold">{getLoc(item.displayName, language)}</div>
                  <div className="text-[10px] text-stone-500 line-clamp-1">
                    {item.covered
                      ? item.plants.map(p => getLoc(p.commonName, language)).join(', ')
                      : tr.notYetCovered}
                  </div>
                </div>
              </div>

              {item.covered && (
                <span className="px-1.5 py-0.2 rounded-full bg-forest-200/80 text-forest-800 text-[10px] font-bold">
                  {item.plantCount}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
