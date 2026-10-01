import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ClimateZone, Language, SoilType, StarTree, getLoc } from '../types/guild';
import { STAR_TREES } from '../data/starTrees';
import { AlertTriangle, TreePine, Sun, CloudSun, Cloud, Droplet, Bug, Mountain, Filter, Sparkles, Calendar, Scissors, Globe, ShieldCheck } from 'lucide-react';
import { t, formatNumber, translateSeason, translateSun, translateRootHabit, translateStarCategory, translateClimateZone } from '../i18n/translations';
import { PlantThumbnail } from './PlantThumbnail';
import { PhotoCreditBadge, creditAnchorId } from './PhotoCreditBadge';
import { GoogleImagesButton } from './GoogleImagesButton';
import { evidenceLabel, resolvePestDefense } from '../core/pestCompanionEngine';
import { EvidenceTag } from './EvidenceTag';
import { SourceList } from './SourceList';

type ShadeFilter = 'ALL' | 'FULL_SUN' | 'PARTIAL_SHADE' | 'FULL_SHADE';
type CategoryFilter = 'ALL' | 'TREES' | 'SHRUBS' | 'VINES_HERBS';

/** The "full shade" filter is only offered when at least one star plant is rated FULL_SHADE. */
const HAS_FULL_SHADE_TREES = STAR_TREES.some(tree => tree.sunPreference === 'FULL_SHADE');

interface StarTreeSelectorProps {
  language: Language;
  selectedSoil: SoilType;
  selectedZone: ClimateZone;
  selectedTree: StarTree;
  onSelectTree: (tree: StarTree) => void;
  onLoadPreset?: (presetName: 'apple' | 'walnut' | 'apricot' | 'minimal') => void;
  onFilterByPest?: (pestName: string, plantIds: string[]) => void;
  /** SPA navigation (used by the photo credit badge) */
  onNavigate?: (path: string) => void;
}

export const StarTreeSelector: React.FC<StarTreeSelectorProps> = ({
  language,
  selectedSoil,
  selectedZone,
  selectedTree,
  onSelectTree,
  onLoadPreset,
  onFilterByPest,
  onNavigate,
}) => {
  const tr = t(language);
  const [shadeFilter, setShadeFilter] = useState<ShadeFilter>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ALL');
  const [zoneOnlyFilter, setZoneOnlyFilter] = useState<boolean>(true);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const presetsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (presetsRef.current && !presetsRef.current.contains(event.target as Node)) {
        setIsPresetsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTrees = useMemo(() => {
    return STAR_TREES.filter((tree) => {
      if (zoneOnlyFilter && !tree.climateZones.includes(selectedZone)) {
        return false;
      }

      if (shadeFilter === 'FULL_SUN' && tree.sunPreference !== 'FULL_SUN') return false;
      if (shadeFilter === 'PARTIAL_SHADE' && tree.sunPreference !== 'PARTIAL_SUN') return false;
      if (shadeFilter === 'FULL_SHADE' && tree.sunPreference !== 'FULL_SHADE') return false;

      if (categoryFilter === 'TREES') {
        if (!['FRUIT_TREE', 'NUT_TREE', 'NITROGEN_FIXING_TREE'].includes(tree.category)) return false;
      } else if (categoryFilter === 'SHRUBS') {
        if (tree.category !== 'BERRY_SHRUB') return false;
      } else if (categoryFilter === 'VINES_HERBS') {
        if (!['VINE', 'PERENNIAL_HERB', 'ANNUAL_HERB'].includes(tree.category)) return false;
      }

      return true;
    });
  }, [shadeFilter, categoryFilter, zoneOnlyFilter, selectedZone]);

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <TreePine className="w-5 h-5 text-forest-600" />
            {tr.step1Title}
          </h2>
          <p className="text-xs text-stone-500">
            {tr.step1Subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          {selectedTree.jugloneProducer && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium animate-pulse">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{tr.jugloneActiveAlert}</span>
            </div>
          )}

          {onLoadPreset && (
            <div ref={presetsRef} className="relative">
              <button
                type="button"
                onClick={() => setIsPresetsOpen(prev => !prev)}
                aria-expanded={isPresetsOpen}
                className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-900 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title={tr.presetsTitle}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{tr.presets}</span>
              </button>

              {isPresetsOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-64 z-30 animate-in fade-in zoom-in-95 bg-white border border-stone-200 rounded-2xl shadow-xl p-1.5">
                  <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 mb-1">
                    {tr.presetsTitle}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onLoadPreset('apple');
                      setIsPresetsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-forest-50 hover:text-forest-900 rounded-lg flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="font-semibold">{tr.presetApple}</span>
                    <span className="text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">{tr.presetAppleSub}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLoadPreset('walnut');
                      setIsPresetsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-amber-50 hover:text-amber-900 rounded-lg flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="font-semibold">{tr.presetWalnut}</span>
                    <span className="text-[10px] text-amber-600 bg-amber-50 font-semibold px-1.5 py-0.5 rounded">{tr.presetWalnutSub}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLoadPreset('apricot');
                      setIsPresetsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-orange-50 hover:text-orange-900 rounded-lg flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="font-semibold">{tr.presetApricot}</span>
                    <span className="text-[10px] text-orange-600 bg-orange-50 font-semibold px-1.5 py-0.5 rounded">{tr.presetApricotSub}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLoadPreset('minimal');
                      setIsPresetsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 rounded-lg flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="font-semibold">{tr.presetMinimal}</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 font-semibold px-1.5 py-0.5 rounded">{tr.presetMinimalSub}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 p-3 bg-stone-50/80 rounded-xl border border-stone-200/80 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-stone-700 flex items-center gap-1 mr-1">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            {tr.shadeLevelLabel}:
          </span>
          <button
            type="button"
            onClick={() => setShadeFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              shadeFilter === 'ALL'
                ? 'bg-forest-700 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {tr.filterShadeAll}
          </button>
          <button
            type="button"
            onClick={() => setShadeFilter('FULL_SUN')}
            className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all ${
              shadeFilter === 'FULL_SUN'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            {tr.filterShadeFullSun}
          </button>
          <button
            type="button"
            onClick={() => setShadeFilter('PARTIAL_SHADE')}
            className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all ${
              shadeFilter === 'PARTIAL_SHADE'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <CloudSun className="w-3.5 h-3.5" />
            {tr.filterShadePartial}
          </button>
          {HAS_FULL_SHADE_TREES && (
            <button
              type="button"
              onClick={() => setShadeFilter('FULL_SHADE')}
              className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all ${
                shadeFilter === 'FULL_SHADE'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              {tr.filterShadeFull}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-200">
          <span className="font-semibold text-stone-700 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            {tr.categoryFilterLabel}:
          </span>
          <button
            type="button"
            onClick={() => setCategoryFilter('ALL')}
            className={`px-2 py-1 rounded-lg font-medium transition-all ${
              categoryFilter === 'ALL'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {tr.filterCategoryAll}
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('TREES')}
            className={`px-2 py-1 rounded-lg font-medium transition-all ${
              categoryFilter === 'TREES'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {tr.filterCategoryTrees}
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('SHRUBS')}
            className={`px-2 py-1 rounded-lg font-medium transition-all ${
              categoryFilter === 'SHRUBS'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {tr.filterCategoryShrubs}
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('VINES_HERBS')}
            className={`px-2 py-1 rounded-lg font-medium transition-all ${
              categoryFilter === 'VINES_HERBS'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {tr.filterCategoryVinesHerbs}
          </button>

          <button
            type="button"
            onClick={() => setZoneOnlyFilter(!zoneOnlyFilter)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              zoneOnlyFilter
                ? 'bg-sky-700 text-white shadow-xs font-bold'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
            title={tr.filterZoneOnly}
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>{tr.filterZoneOnly}: {zoneOnlyFilter ? tr.gardenWarningsOn : tr.gardenWarningsOff}</span>
          </button>

          <span className="ml-auto text-[11px] text-stone-500 font-medium pl-2">
            {tr.showingCountOfTotal
              .replace('{count}', filteredTrees.length.toString())
              .replace('{total}', STAR_TREES.length.toString())}
          </span>
        </div>
      </div>

      {filteredTrees.length === 0 ? (
        <div className="text-center py-8 px-4 border border-dashed border-stone-200 rounded-xl bg-stone-50">
          <p className="text-sm text-stone-600 mb-2">{tr.noPlantsMatchFilter}</p>
          <button
            type="button"
            onClick={() => {
              setShadeFilter('ALL');
              setCategoryFilter('ALL');
              setZoneOnlyFilter(false);
            }}
            className="px-3 py-1.5 rounded-lg bg-forest-600 text-white text-xs font-semibold hover:bg-forest-700 transition-colors cursor-pointer"
          >
            {tr.resetFilter}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 sm:gap-2.5">
          {filteredTrees.map((tree) => {
            const isSelected = tree.id === selectedTree.id;
            const localizedName = getLoc(tree.commonName, language);
            const isZoneIncompatible = !tree.climateZones.includes(selectedZone);

            return (
              <button
                key={tree.id}
                type="button"
                onClick={() => onSelectTree(tree)}
                className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer group ${
                  isSelected
                    ? 'border-forest-600 bg-forest-50/40 ring-2 ring-forest-600/20 shadow-xs'
                    : 'border-stone-200 hover:border-forest-300 hover:bg-stone-50/50 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <PlantThumbnail
                        src={tree.imageUrl}
                        alt={localizedName}
                        fallbackText={localizedName.substring(0, 2)}
                        fallbackColor={tree.color}
                        className="w-7 h-7 sm:w-8 sm:h-8"
                        targetSize={64}
                      />
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: tree.color }} />
                    </div>
                    <div className="flex flex-wrap items-center gap-1 justify-end">
                      {tree.sunPreference === 'FULL_SUN' && (
                        <span title={tr.sunFull}>
                          <Sun className="w-3.5 h-3.5 text-amber-500" />
                        </span>
                      )}
                      {tree.sunPreference === 'PARTIAL_SUN' && (
                        <span title={tr.sunPartial}>
                          <CloudSun className="w-3.5 h-3.5 text-amber-600" />
                        </span>
                      )}
                      {tree.sunPreference === 'FULL_SHADE' && (
                        <span title={tr.sunShade}>
                          <Cloud className="w-3.5 h-3.5 text-indigo-500" />
                        </span>
                      )}

                      {tree.preferredSoils?.includes(selectedSoil) && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title={tr.soilOptimal} />
                      )}
                      {tree.unsuitableSoils?.includes(selectedSoil) && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" title={tr.soilUnsuitable} />
                      )}

                      {tree.jugloneProducer && (
                        <span
                          className="text-[9px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded bg-amber-100 text-amber-800"
                          title={tr.starSelectorProducesJuglone}
                        >
                          Juglone
                        </span>
                      )}

                      {isZoneIncompatible && (
                        <span
                          className="text-[9px] font-bold px-1 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-0.5"
                          title={`${tr.zoneIncompatibleAlert} (${translateClimateZone(selectedZone, language)})`}
                        >
                          <AlertTriangle className="w-2.5 h-2.5 text-rose-600 shrink-0" />
                          <span>{tr.zoneIncompatibleBadge}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="font-semibold text-xs text-stone-900 line-clamp-1">
                    {localizedName}
                  </div>
                  <div className="text-[10px] text-stone-500 italic line-clamp-1">
                    {tree.botanicalName}
                  </div>
                  <div className="text-[9px] font-medium text-stone-500 mt-0.5">
                    {translateStarCategory(tree.category, language)}
                  </div>
                </div>

                <div className="mt-2 pt-1.5 sm:pt-2 border-t border-stone-100 text-[10px] text-stone-500 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-0.5">
                  <span>{tr.dripLine}: {formatNumber(tree.matureRadiusM, 1, language)} m</span>
                  <span className="font-medium text-forest-700">{translateSeason(tree.bloomSeason, language)}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-4 p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        {!selectedTree.climateZones.includes(selectedZone) && (
          <div className="md:col-span-12 p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <strong>{tr.zoneIncompatibleBadge}:</strong> {tr.zoneIncompatibleAlert} ({translateClimateZone(selectedZone, language)}).
            </div>
          </div>
        )}

        <div className="md:col-span-2 flex flex-col items-center sm:items-start gap-1.5">
          <div className="relative">
            <PlantThumbnail
              src={selectedTree.imageUrl}
              alt={getLoc(selectedTree.commonName, language)}
              fallbackText={getLoc(selectedTree.commonName, language).substring(0, 2)}
              fallbackColor={selectedTree.color}
              className="w-20 h-20 sm:w-24 sm:h-24"
              roundedClassName="rounded-2xl ring-2 ring-stone-200"
              targetSize={240}
              priority="high"
            />
            <PhotoCreditBadge
              imageUrl={selectedTree.imageUrl}
              anchorId={creditAnchorId(selectedTree.id)}
              language={language}
              onNavigate={onNavigate}
              className="bottom-1.5 right-1.5"
            />
          </div>
          <GoogleImagesButton
            query={`${selectedTree.botanicalName} ${getLoc(selectedTree.commonName, language)}`}
            label={tr.googleImages}
            title={tr.searchGoogleImages}
            className="w-full justify-center text-[10px] py-0.5"
          />
        </div>

        <div className="md:col-span-5 space-y-1.5">
          <div className="font-semibold text-stone-900 mb-1 flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-bold">{getLoc(selectedTree.commonName, language)}</span>
            <span className="text-stone-500 font-normal italic">({selectedTree.botanicalName})</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
              {translateStarCategory(selectedTree.category, language)}
            </span>
          </div>
          <p className="text-stone-600 leading-relaxed text-xs">
            {getLoc(selectedTree.description, language)}
          </p>
          <SourceList key={selectedTree.id} sources={selectedTree.sources} language={language} className="pt-1" />
        </div>

        <div className="md:col-span-5 space-y-2 border-t md:border-t-0 md:border-l border-stone-200 pt-3 md:pt-0 md:pl-4 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-white border border-stone-200/80 space-y-0.5">
              <div className="text-[10px] text-stone-400 font-semibold flex items-center gap-1 uppercase">
                <Sun className="w-3 h-3 text-amber-500" />
                {tr.lightPref}
              </div>
              <div className="font-bold text-stone-800">
                {translateSun(selectedTree.sunPreference, language)}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-white border border-stone-200/80 space-y-0.5">
              <div className="text-[10px] text-stone-400 font-semibold flex items-center gap-1 uppercase">
                <Droplet className="w-3 h-3 text-blue-500" />
                {tr.rootHabit}
              </div>
              <div className="font-bold text-stone-800">
                {translateRootHabit(selectedTree.rootHabit, language)}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-stone-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-stone-500 font-semibold uppercase">
              <span className="flex items-center gap-1">
                <Bug className="w-3 h-3 text-rose-500" />
                {tr.keyPests}
              </span>
              <span className="text-[9px] text-stone-400 lowercase font-normal">
                {tr.starSelectorClickToFilterDefense}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(selectedTree.vulnerabilities[language] || selectedTree.vulnerabilities.en).map((pest, pIdx) => {
                const defense = resolvePestDefense(pest, selectedTree.id, selectedZone);
                if (defense.combatable && defense.evidence) {
                  return (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => onFilterByPest?.(pest, defense.companionPlantIds)}
                      className="px-2 py-0.5 rounded-md bg-rose-50 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 text-rose-900 text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
                      title={`${tr.keyPestClickToFilter} (${defense.companionPlantIds.length}) · ${tr.evidenceLevelTooltip.replace('{level}', evidenceLabel(defense.evidence, language))}`}
                    >
                      <ShieldCheck className="w-2.5 h-2.5 text-rose-600 shrink-0" />
                      <span>{pest}</span>
                      <EvidenceTag level={defense.evidence} language={language} compact />
                    </button>
                  );
                }
                return (
                  <span
                    key={pIdx}
                    className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-600 text-[10px]"
                  >
                    {pest}
                  </span>
                );
              })}
            </div>
          </div>

          {(selectedTree.plantingTime || selectedTree.harvestTime) && (
            <div className="p-2 rounded-lg bg-white border border-stone-200/80 space-y-1">
              {selectedTree.plantingTime && (
                <div className="flex items-center gap-1.5 text-stone-600">
                  <Calendar className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="text-[11px]">{tr.plantingTime}: <strong>{getLoc(selectedTree.plantingTime, language)}</strong></span>
                </div>
              )}
              {selectedTree.harvestTime && (
                <div className="flex items-center gap-1.5 text-stone-600">
                  <Scissors className="w-3 h-3 text-amber-600 shrink-0" />
                  <span className="text-[11px]">{tr.harvestTime}: <strong>{getLoc(selectedTree.harvestTime, language)}</strong></span>
                </div>
              )}
            </div>
          )}

          <div className="p-2 rounded-lg bg-white border border-stone-200/80 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-stone-600">
              <Mountain className="w-3.5 h-3.5 text-forest-600 shrink-0" />
              <span className="text-[11px]">{tr.soilType}:</span>
            </div>
            <strong className={`text-[11px] ${selectedTree.preferredSoils.includes(selectedSoil) ? 'text-emerald-700' : selectedTree.unsuitableSoils.includes(selectedSoil) ? 'text-rose-700' : 'text-stone-800'}`}>
              {selectedTree.preferredSoils.includes(selectedSoil) ? tr.soilOptimal : selectedTree.unsuitableSoils.includes(selectedSoil) ? tr.soilUnsuitable : tr.soilTolerant}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
