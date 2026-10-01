import React, { useState, useMemo, useEffect } from 'react';
import { ActiveGapFilter, ActivePestFilter, ClimateZone, GuildPlant, GuildRole, Language, SoilType, StarTree, getLoc } from '../types/guild';
import { ACTIVE_GUILD_PLANTS } from '../data/guildPlants';
import { Search, Check, Plus, AlertOctagon, Sparkles, Layers, Star, Mountain, Globe, X, ShieldCheck, AlertTriangle, FlaskConical, Sprout, Eye, EyeOff, Ban } from 'lucide-react';
import { IncompatibilityReason, getGuildIncompatibility, partitionGuildByCompatibility, summarizeIncompatibility } from '../core/compatibility';
import { t, translateRole, translateLayer, translateZone } from '../i18n/translations';
import { PlantThumbnail } from './PlantThumbnail';
import { GoogleImagesButton } from './GoogleImagesButton';
import { plantCoversRoleInSeason, PHENO_SEASONS } from '../core/seasonalGapEngine';
import { resolvePestDefense } from '../core/pestCompanionEngine';
import { EvidenceCitations, EvidenceTag } from './EvidenceTag';

interface GuildBuilderProps {
  language: Language;
  selectedSoil: SoilType;
  selectedZone: ClimateZone;
  selectedTree: StarTree;
  selectedPlants: GuildPlant[];
  onTogglePlant: (plant: GuildPlant) => void;
  onOpenPlantModal: (plant: GuildPlant) => void;
  activeGapFilter?: ActiveGapFilter | null;
  onClearGapFilter?: () => void;
  activePestFilter?: ActivePestFilter | null;
  onClearPestFilter?: () => void;
}

type RoleFilter = 'ALL' | 'RECOMMENDED' | GuildRole;

export const GuildBuilder: React.FC<GuildBuilderProps> = ({
  language,
  selectedSoil,
  selectedZone,
  selectedTree,
  selectedPlants,
  onTogglePlant,
  onOpenPlantModal,
  activeGapFilter,
  onClearGapFilter,
  activePestFilter,
  onClearPestFilter,
}) => {
  const tr = t(language);
  const [activeTab, setActiveTab] = useState<RoleFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  // Plants that conflict with the star or the chosen companions are hidden unless revealed here
  const [showConflicting, setShowConflicting] = useState(false);
  const [filterOnlyOptimalSoil, setFilterOnlyOptimalSoil] = useState(false);
  const [filterOnlyOptimalZone, setFilterOnlyOptimalZone] = useState(true);

  useEffect(() => {
    if (activeGapFilter) {
      setActiveTab(activeGapFilter.role);
    }
  }, [activeGapFilter]);

  useEffect(() => {
    if (activePestFilter) {
      setActiveTab('ALL');
    }
  }, [activePestFilter]);

  const selectedPlantIds = useMemo(() => new Set(selectedPlants.map(p => p.id)), [selectedPlants]);

  // Compatibility prefilter (compatibility.ts). Selected plants: the later plant of a conflicting
  // pair is flagged (partition); unselected plants: conflicts with the star or any chosen companion.
  const conflictsById = useMemo(() => {
    const map = new Map<string, IncompatibilityReason[]>();
    for (const { plant, reasons } of partitionGuildByCompatibility(selectedTree, selectedPlants).incompatible) {
      map.set(plant.id, reasons);
    }
    for (const plant of ACTIVE_GUILD_PLANTS) {
      if (selectedPlantIds.has(plant.id)) continue;
      const reasons = getGuildIncompatibility(plant, selectedTree, selectedPlants);
      if (reasons.length > 0) map.set(plant.id, reasons);
    }
    return map;
  }, [selectedTree, selectedPlants, selectedPlantIds]);

  const conflictText = (reasons: IncompatibilityReason[]) =>
    summarizeIncompatibility(reasons, selectedTree.id).map(r => getLoc(r.message, language)).join(' · ');

  const pestDefense = useMemo(
    () => (activePestFilter ? resolvePestDefense(activePestFilter.pestName, selectedTree.id, selectedZone) : null),
    [activePestFilter, selectedTree.id, selectedZone]
  );

  const filterTabs: { id: RoleFilter; label: string }[] = [
    { id: 'ALL', label: tr.tabAll },
    { id: 'RECOMMENDED', label: tr.tabRecommended },
    { id: 'NITROGEN_FIXER', label: tr.tabNFixer },
    { id: 'DYNAMIC_ACCUMULATOR', label: tr.tabAccumulator },
    { id: 'POLLINATOR_MAGNET', label: tr.tabPollinator },
    { id: 'PEST_REPELLER', label: tr.tabRepeller },
    { id: 'LIVING_MULCH', label: tr.tabMulch },
    { id: 'GRASS_BARRIER', label: tr.tabGrassBarrier },
    { id: 'ANTIFUNGAL', label: tr.tabAntifungal },
    { id: 'BIOMASS_PRODUCER', label: tr.tabBiomass },
    { id: 'EDIBLE_UNDERSTORY', label: tr.tabEdible },
  ];

  const handleTabClick = (tabId: RoleFilter) => {
    setActiveTab(tabId);
    if (activeGapFilter && onClearGapFilter) {
      onClearGapFilter();
    }
    if (activePestFilter && onClearPestFilter) {
      onClearPestFilter();
    }
  };

  // All filters except compatibility; conflicting plants are split off below
  const matchingPlants = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return ACTIVE_GUILD_PLANTS.filter(plant => {
      if (filterOnlyOptimalSoil) {
        const isOptimalSoil = plant.suitableSoils?.includes(selectedSoil);
        if (!isOptimalSoil) return false;
      }

      if (filterOnlyOptimalZone) {
        const isOptimalZone = plant.climateZones?.includes(selectedZone);
        if (!isOptimalZone) return false;
      }

      if (pestDefense && !pestDefense.companionPlantIds.includes(plant.id)) {
        return false;
      }

      // An active gap filter overrides the role tab.
      if (activeGapFilter) {
        if (!plantCoversRoleInSeason(plant, activeGapFilter.role, activeGapFilter.season)) {
          return false;
        }
      } else {
        if (activeTab === 'RECOMMENDED') {
          const isRecForTree =
            selectedTree.recommendedCompanions?.includes(plant.id) ||
            plant.recommendedForTrees?.includes(selectedTree.id);
          if (!isRecForTree) return false;
        } else if (activeTab !== 'ALL' && !plant.roles.includes(activeTab)) {
          return false;
        }
      }

      if (query !== '') {
        const matchesEn = plant.commonName.en.toLowerCase().includes(query);
        const matchesDe = plant.commonName.de.toLowerCase().includes(query);
        const matchesBotanical = plant.botanicalName.toLowerCase().includes(query);
        const matchesRole = plant.roles.some(r => r.toLowerCase().includes(query));
        if (!matchesEn && !matchesDe && !matchesBotanical && !matchesRole) {
          return false;
        }
      }

      return true;
    });
  }, [
    activeTab,
    searchQuery,
    selectedTree,
    selectedSoil,
    filterOnlyOptimalSoil,
    filterOnlyOptimalZone,
    selectedZone,
    pestDefense,
    activeGapFilter
  ]);

  // Selected plants always stay visible (flagged) so a conflicting one can be removed
  const hiddenConflicting = useMemo(
    () => matchingPlants.filter(p => !selectedPlantIds.has(p.id) && conflictsById.has(p.id)),
    [matchingPlants, selectedPlantIds, conflictsById]
  );
  const filteredPlants = useMemo(
    () => (showConflicting ? matchingPlants : matchingPlants.filter(p => selectedPlantIds.has(p.id) || !conflictsById.has(p.id))),
    [matchingPlants, showConflicting, selectedPlantIds, conflictsById]
  );
  // Star wording when every hidden plant conflicts with the star itself (pair conflicts may come on top)
  const hiddenOnlyByStar = hiddenConflicting.every(p => conflictsById.get(p.id)!.some(r => r.withId === selectedTree.id));
  const starName = getLoc(selectedTree.commonName, language);
  const hiddenNote = (hiddenOnlyByStar
    ? (hiddenConflicting.length === 1 ? tr.compatHiddenNoteOne : tr.compatHiddenNote)
    : tr.compatHiddenNoteGuild
  ).replace('{count}', String(hiddenConflicting.length)).replace('{star}', starName);

  const activeSeasonDef = activeGapFilter
    ? PHENO_SEASONS.find(s => s.id === activeGapFilter.season)
    : null;
  const activeSeasonName = activeSeasonDef ? getLoc(activeSeasonDef.label, language) : '';
  const roleTab = activeGapFilter ? filterTabs.find(t => t.id === activeGapFilter.role) : null;
  const activeRoleName = roleTab ? roleTab.label : (activeGapFilter ? translateRole(activeGapFilter.role, language) : '');

  // Selected plants float to the top, revealed conflicting plants sink to the bottom.
  const sortedPlants = useMemo(() => {
    const rank = (p: GuildPlant) => (selectedPlantIds.has(p.id) ? 0 : conflictsById.has(p.id) ? 2 : 1);
    return [...filteredPlants].sort((a, b) => rank(a) - rank(b));
  }, [filteredPlants, selectedPlantIds, conflictsById]);

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-stone-100">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-forest-600" />
            {tr.step2Title}
          </h2>
          <p className="text-xs text-stone-500">
            {tr.step2Subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder={tr.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent w-full"
            />
          </div>

          <button
            type="button"
            onClick={() => setFilterOnlyOptimalSoil(!filterOnlyOptimalSoil)}
            className={`px-2.5 py-1.5 text-xs rounded-lg border flex items-center gap-1 font-medium transition-colors cursor-pointer shrink-0 ${
              filterOnlyOptimalSoil
                ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold shadow-2xs'
                : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100'
            }`}
            title={tr.filterOptimalSoil}
          >
            <Mountain className="w-3 h-3 text-emerald-600" />
            <span>{tr.filterOptimalSoil}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterOnlyOptimalZone(!filterOnlyOptimalZone)}
            className={`px-2.5 py-1.5 text-xs rounded-lg border flex items-center gap-1 font-medium transition-colors cursor-pointer shrink-0 ${
              filterOnlyOptimalZone
                ? 'bg-sky-100 border-sky-300 text-sky-900 font-bold shadow-2xs'
                : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100'
            }`}
            title={tr.filterOptimalZone}
          >
            <Globe className="w-3.5 h-3.5 text-sky-600" />
            <span>{tr.filterOptimalZone}</span>
          </button>
        </div>
      </div>

      {activePestFilter && pestDefense && (() => {
        const defense = pestDefense;
        const mechanism = defense.scientificMechanism
          ? (defense.scientificMechanism[language] || defense.scientificMechanism.en)
          : null;

        // resolvePestDefense already drops star-incompatible plants; also drop pair conflicts
        const companionPlants = defense.companionPlantIds
          .map(id => ACTIVE_GUILD_PLANTS.find(p => p.id === id))
          .filter((p): p is GuildPlant => !!p && (selectedPlantIds.has(p.id) || !conflictsById.has(p.id)));

        return (
          <div className="mb-5 p-4 sm:p-5 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-950 shadow-xs animate-fadeIn space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-2.5">
                <div className="p-2.5 bg-emerald-200/90 text-emerald-900 rounded-xl flex-shrink-0 shadow-2xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 font-bold text-stone-900">
                    <span className="text-xs uppercase tracking-wider text-emerald-900">{tr.activePestBannerTitle}:</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-200/90 text-emerald-950 text-xs font-bold border border-emerald-300/80">
                      {activePestFilter.pestName}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-900/85 mt-0.5">
                    {tr.activePestBannerDesc} <strong className="text-emerald-950 font-bold">{activePestFilter.pestName}</strong> &mdash;{' '}
                    <strong className="text-emerald-950">{companionPlants.length}</strong>{' '}
                    {companionPlants.length === 1 ? tr.plantsFightingPestSingle : tr.plantsFightingPest}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClearPestFilter}
                className="self-start sm:self-auto px-3.5 py-1.5 bg-white hover:bg-stone-50 border border-emerald-300 hover:border-emerald-400 text-emerald-950 font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer text-xs"
              >
                <X className="w-3.5 h-3.5 text-stone-500" />
                <span>{tr.clearPestFilter}</span>
              </button>
            </div>

            {mechanism && (
              <div className="p-3 sm:p-3.5 rounded-xl bg-white/90 border border-emerald-200 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-[11px] uppercase tracking-wider">
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{tr.scientificMechanismTitle}</span>
                  {defense.evidence && <EvidenceTag level={defense.evidence} language={language} />}
                </div>
                <p className="text-xs text-stone-800 leading-relaxed">
                  {mechanism}
                </p>
                {defense.citations && <EvidenceCitations citations={defense.citations} title={tr.evidenceSourcesTitle} />}
                <p className="text-[10px] text-stone-500 italic">{tr.evidenceBadgeNote}</p>
              </div>
            )}

            {companionPlants.length > 0 && (
              <div className="pt-2 border-t border-emerald-200/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sprout className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{tr.effectiveCompanionsTitle} ({companionPlants.length})</span>
                  </span>
                  <span className="text-[10px] text-emerald-800/80 font-medium hidden sm:inline">
                    {tr.guildBuilderClickPlantForDetails}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {companionPlants.map(companion => {
                    const isAdded = selectedPlantIds.has(companion.id);
                    return (
                      <div
                        key={companion.id}
                        className="inline-flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-white hover:bg-stone-50/90 border border-emerald-200 hover:border-emerald-400 shadow-2xs transition-all text-xs group"
                      >
                        <button
                          type="button"
                          onClick={() => onOpenPlantModal(companion)}
                          className="flex items-center gap-2 cursor-pointer text-left"
                          title={`${getLoc(companion.commonName, language)} — ${tr.viewCompanionDetails}`}
                        >
                          <img
                            src={companion.imageUrl}
                            alt={getLoc(companion.commonName, language)}
                            className="w-7 h-7 rounded-lg object-cover border border-stone-200/80 shrink-0"
                            loading="lazy"
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-stone-900 group-hover:text-emerald-800 transition-colors leading-tight">
                              {getLoc(companion.commonName, language)}
                            </span>
                            <span className="text-[10px] text-stone-500 italic leading-tight">
                              {companion.botanicalName}
                            </span>
                          </div>
                        </button>
                        {isAdded ? (
                          <span className="ml-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-0.5 border border-emerald-200 shrink-0">
                            <Check className="w-2.5 h-2.5" />
                            <span>{tr.guildBuilderInGuild}</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onTogglePlant(companion)}
                            className="ml-1 px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs shrink-0"
                            title={tr.guildBuilderAddToGuild}
                          >
                            <Plus className="w-2.5 h-2.5" />
                            <span>{tr.guildBuilderAdd}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {activeGapFilter && (
        <div className="mb-4 p-3 sm:p-3.5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-xs animate-fadeIn">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="p-2 bg-amber-200 text-amber-900 rounded-lg flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 font-bold text-stone-900">
                <span>{tr.activeGapBannerTitle}:</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-200/90 text-amber-950 text-xs">
                  {activeRoleName}
                </span>
                <span className="text-amber-500">&bull;</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-200/90 text-amber-950 text-xs">
                  {activeSeasonName}
                </span>
              </div>
              <p className="text-[11px] text-amber-900/85 mt-0.5">
                {tr.activeGapBannerDesc} &mdash;{' '}
                <strong className="text-amber-950">{filteredPlants.length}</strong>{' '}
                {filteredPlants.length === 1 ? tr.plantsMatchingGapSingle : tr.plantsMatchingGap}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClearGapFilter}
            className="self-start sm:self-auto px-3 py-1.5 bg-white hover:bg-stone-50 border border-amber-300 hover:border-amber-400 text-amber-950 font-semibold rounded-lg shadow-2xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-stone-500" />
            <span>{tr.clearGapFilter}</span>
          </button>
        </div>
      )}

      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none text-xs">
        {filterTabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                isActive
                  ? 'bg-forest-700 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {hiddenConflicting.length > 0 && (
        <div
          className="-mt-2 mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-stone-500"
          data-testid="compat-hidden-note"
        >
          <Ban className="w-3 h-3 text-stone-400 shrink-0" />
          <span>{hiddenNote}</span>
          <button
            type="button"
            onClick={() => setShowConflicting(!showConflicting)}
            className="inline-flex items-center gap-1 text-stone-600 hover:text-forest-700 underline font-medium cursor-pointer"
            aria-pressed={showConflicting}
          >
            {showConflicting ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            <span>{showConflicting ? tr.compatHideHidden : tr.compatShowHidden}</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[520px] overflow-y-auto pr-1">
        {sortedPlants.map(plant => {
          const isSelected = selectedPlantIds.has(plant.id);
          const conflictReasons = conflictsById.get(plant.id);
          // Revealed conflicting plant: greyed out and cannot be added
          const isBlocked = !isSelected && !!conflictReasons;
          // Already in the guild but conflicting (old link, import): flagged for removal
          const isSelectedConflict = isSelected && !!conflictReasons;
          const isSuperHero = plant.roles.length >= 3;
          const isRecommendedForTree =
            selectedTree.recommendedCompanions?.includes(plant.id) ||
            plant.recommendedForTrees?.includes(selectedTree.id);
          const isOptimalSoil = plant.suitableSoils?.includes(selectedSoil);
          const isUnsuitableSoil = plant.unsuitableSoils?.includes(selectedSoil);
          const fillsActiveGap = Boolean(
            activeGapFilter && plantCoversRoleInSeason(plant, activeGapFilter.role, activeGapFilter.season)
          );
          const localizedName = getLoc(plant.commonName, language);
          const localizedNotes = getLoc(plant.notes, language);

          return (
            <div
              key={plant.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                isSelectedConflict
                  ? 'border-rose-400 bg-rose-50/60 ring-1 ring-rose-400/40'
                  : isBlocked
                  ? 'border-stone-200 bg-stone-50 opacity-60 grayscale'
                  : isSelected
                  ? 'border-forest-600 bg-forest-50/40 ring-1 ring-forest-600/30'
                  : fillsActiveGap
                  ? 'border-amber-300 bg-amber-50/30 ring-1 ring-amber-300 hover:shadow-xs'
                  : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <PlantThumbnail
                      src={plant.imageUrl}
                      alt={localizedName}
                      fallbackText={localizedName.substring(0, 2)}
                      fallbackColor={plant.color}
                      className="w-11 h-11"
                      roundedClassName="rounded-xl ring-1 ring-stone-200"
                      targetSize={140}
                      priority="low"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs text-stone-900 truncate">{localizedName}</span>
                        {isSelected && (
                          <span
                            className="px-1.5 py-0.2 rounded-md bg-forest-100 text-forest-800 border border-forest-300 text-[10px] font-bold flex items-center gap-0.5"
                            title={tr.selectedBadge}
                          >
                            <Check className="w-2.5 h-2.5 text-forest-600" />
                            <span>{tr.selectedBadge}</span>
                          </span>
                        )}
                        {activePestFilter && activePestFilter.plantIds.includes(plant.id) && (
                          <span
                            className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold flex items-center gap-0.5"
                            title={`${tr.activePestBannerDesc} ${activePestFilter.pestName}`}
                          >
                            <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                            <span>{tr.keyPestCombatedBy}</span>
                          </span>
                        )}
                        {!plant.climateZones?.includes(selectedZone) && (
                          <span
                            className="px-1.5 py-0.2 rounded-md bg-amber-100/90 text-amber-900 border border-amber-300 text-[10px] font-bold flex items-center gap-0.5"
                            title={tr.zoneIncompatibleAlert}
                          >
                            <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                            <span>{tr.zoneIncompatibleBadge}</span>
                          </span>
                        )}
                        {fillsActiveGap && (
                          <span
                            className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold flex items-center gap-0.5"
                            title={`${activeRoleName} (${activeSeasonName})`}
                          >
                            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                            <span>{tr.gapFilledSuccess}</span>
                          </span>
                        )}
                        {isRecommendedForTree && (
                          <span
                            className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center gap-0.5"
                            title={`${tr.recommendedForTree} ${getLoc(selectedTree.commonName, language)}`}
                          >
                            <Star className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
                            <span>{tr.starTreeAlly}</span>
                          </span>
                        )}
                        {isSuperHero && (
                          <span
                            className="px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-800 text-[10px] font-bold flex items-center gap-0.5"
                            title={tr.guildBuilderStacksRoles}
                          >
                            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                            {plant.roles.length} {tr.rolesStacked}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500 italic truncate">{plant.botanicalName}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isBlocked}
                    onClick={() => onTogglePlant(plant)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelectedConflict
                        ? 'bg-rose-600 text-white shadow-xs hover:bg-rose-700'
                        : isSelected
                        ? 'bg-forest-600 text-white shadow-xs'
                        : isBlocked
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        : 'border border-stone-300 text-stone-600 hover:border-forest-500 hover:text-forest-600'
                    }`}
                    title={isSelected ? tr.removeGuildBtn : isBlocked ? `${tr.compatCannotAdd}: ${conflictText(conflictReasons!)}` : tr.addGuildBtn}
                  >
                    {isSelectedConflict ? <X className="w-4 h-4" /> : isSelected ? <Check className="w-4 h-4" /> : isBlocked ? <Ban className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>

                {conflictReasons && (
                  <div
                    className={`mt-2 flex items-start gap-1 text-[10px] font-medium ${isSelectedConflict ? 'text-rose-700' : 'text-stone-600'}`}
                    data-testid="compat-reason"
                  >
                    <AlertOctagon className="w-3 h-3 flex-shrink-0 mt-px" />
                    <span>
                      {isSelectedConflict && <strong>{tr.compatSelectedConflict}: </strong>}
                      {conflictText(conflictReasons)}
                    </span>
                  </div>
                )}

                <div className="mt-2.5 flex flex-wrap gap-1">
                  {plant.roles.map(role => (
                    <span
                      key={role}
                      className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-stone-100 text-stone-700"
                    >
                      {translateRole(role, language)}
                    </span>
                  ))}
                </div>

                <p className="mt-2 text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                  {localizedNotes}
                </p>

                <div className="mt-2 pt-1.5 flex flex-wrap items-center justify-between gap-1 text-[10px] border-t border-stone-100/70">
                  <span className="flex items-center gap-1">
                    <span className="text-stone-500 font-medium">{tr.soilType}:</span>
                    {isOptimalSoil ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        <Check className="w-3 h-3 text-emerald-600" /> {tr.soilOptimal}
                      </span>
                    ) : isUnsuitableSoil ? (
                      <span className="text-rose-600 font-bold flex items-center gap-0.5">
                        <AlertOctagon className="w-3 h-3 text-rose-500" /> {tr.soilUnsuitable}
                      </span>
                    ) : (
                      <span className="text-stone-600 font-medium">
                        {tr.soilTolerant}
                      </span>
                    )}
                  </span>

                  <span className="flex items-center gap-1">
                    {plant.climateZones?.includes(selectedZone) ? (
                      <span className="text-sky-700 font-semibold flex items-center gap-0.5">
                        <Globe className="w-3 h-3 text-sky-600" /> {tr.climateMatch}
                      </span>
                    ) : (
                      <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-medium text-[9px] flex items-center gap-0.5" title={tr.zoneIncompatibleAlert}>
                        <AlertTriangle className="w-2.5 h-2.5 text-amber-600" /> {tr.zoneIncompatibleBadge}
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-stone-700">{translateLayer(plant.layer, language)}</span>
                  <span className="text-forest-700 font-semibold">{translateZone(plant.preferredZone, language)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GoogleImagesButton
                    query={`${plant.botanicalName} ${getLoc(plant.commonName, language)}`}
                    title={tr.searchGoogleImages}
                    iconOnly
                  />
                  <button
                    type="button"
                    onClick={() => onOpenPlantModal(plant)}
                    className="text-stone-600 hover:text-forest-700 underline font-medium"
                  >
                    {tr.details}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPlants.length === 0 && (
        <div className="text-center py-10 px-4 text-stone-500 text-xs space-y-3">
          <p>{activeGapFilter ? tr.noGapPlantsFound : activePestFilter ? tr.noPestCompanionsFound : tr.noPlantsMatched}</p>
          {activeGapFilter && (
            <button
              type="button"
              onClick={onClearGapFilter}
              className="px-3.5 py-1.5 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-medium transition-colors cursor-pointer shadow-2xs"
            >
              {tr.clearGapFilter}
            </button>
          )}
          {activePestFilter && (
            <button
              type="button"
              onClick={onClearPestFilter}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors cursor-pointer shadow-2xs"
            >
              {tr.clearPestFilter}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
