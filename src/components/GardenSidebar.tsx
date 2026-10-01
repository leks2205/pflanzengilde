import React, { useState, useRef, useMemo } from 'react';
import { GuildPlant, Language, StarTree, getLoc } from '../types/guild';
import { GardenCompanionInstance, GardenConflict, GardenShadePocket, GardenStarPlantInstance, GardenStats, ImportedGuildTemplate } from '../types/garden';
import { GardenWarningsBox } from './GardenWarningsBox';
import { PlantThumbnail } from './PlantThumbnail';
import { starTreeToGuildPlant } from '../core/gardenOptimizer';
import { Upload, Plus, Trash2, Copy, Trees, FileJson, Info, ChevronDown, ChevronRight, Sprout } from 'lucide-react';
import { t, formatNumber, translateRole } from '../i18n/translations';

interface GardenSidebarProps {
  language: Language;
  starPlants: GardenStarPlantInstance[];
  companions?: GardenCompanionInstance[];
  conflicts: GardenConflict[];
  shadePockets: GardenShadePocket[];
  stats: GardenStats;
  selectedTreeId: string | null;
  selectedTreeIds?: string[];
  onSelectTree: (instanceId: string | null) => void;
  onSelectTreeIds?: (instanceIds: string[]) => void;
  onAddStarPlant: (starTree: StarTree, selectedPlantIds?: string[], xM?: number, yM?: number) => void;
  onRemoveStarPlant: (instanceId: string) => void;
  onDuplicateStarPlant: (instanceId: string) => void;
  onImportJsonFile: (file: File) => void;
  loadedGuildTemplates: ImportedGuildTemplate[];
  autoShadeEnabled?: boolean;
  onToggleAutoShade?: () => void;
  onApplyShadePlant?: (plantId: string) => void;
  onOpenPlantDetailModal?: (plant: GuildPlant) => void;
}

export const GardenSidebar: React.FC<GardenSidebarProps> = ({
  language,
  starPlants,
  companions = [],
  conflicts,
  shadePockets,
  stats,
  selectedTreeId,
  selectedTreeIds = [],
  onSelectTree,
  onSelectTreeIds,
  onAddStarPlant,
  onRemoveStarPlant,
  onDuplicateStarPlant,
  onImportJsonFile,
  loadedGuildTemplates,
  autoShadeEnabled = false,
  onToggleAutoShade,
  onApplyShadePlant,
  onOpenPlantDetailModal,
}) => {
  const tr = t(language);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isDropActive, setIsDropActive] = useState(false);
  const [expandedTreeSpecies, setExpandedTreeSpecies] = useState<string[]>([]);
  const [expandedCompanionSpecies, setExpandedCompanionSpecies] = useState<string[]>([]);

  const groupedStarPlants = useMemo(() => {
    const map = new Map<string, { tree: StarTree; instances: GardenStarPlantInstance[] }>();
    for (const inst of starPlants) {
      const key = inst.treeId;
      const existing = map.get(key);
      if (existing) {
        existing.instances.push(inst);
      } else {
        map.set(key, { tree: inst.starTree, instances: [inst] });
      }
    }
    return Array.from(map.values());
  }, [starPlants]);

  const groupedCompanions = useMemo(() => {
    const map = new Map<string, { plant: GuildPlant; instances: GardenCompanionInstance[]; mergedCount: number }>();
    for (const c of companions) {
      const key = c.plantId;
      const existing = map.get(key);
      if (existing) {
        existing.instances.push(c);
        if (c.isMerged) existing.mergedCount++;
      } else {
        map.set(key, { plant: c.plant, instances: [c], mergedCount: c.isMerged ? 1 : 0 });
      }
    }
    return Array.from(map.values());
  }, [companions]);

  const toggleTreeSpecies = (speciesId: string) => {
    setExpandedTreeSpecies(prev =>
      prev.includes(speciesId) ? prev.filter(id => id !== speciesId) : [...prev, speciesId]
    );
  };

  const toggleCompanionSpecies = (speciesId: string) => {
    setExpandedCompanionSpecies(prev =>
      prev.includes(speciesId) ? prev.filter(id => id !== speciesId) : [...prev, speciesId]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJsonFile(file);
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropActive(true);
  };

  const handleDragLeave = () => {
    setIsDropActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImportJsonFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full lg:w-96 flex flex-col space-y-4 shrink-0">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Trees className="w-5 h-5 text-forest-700" />
            <h3 className="text-sm font-bold text-stone-900">
              {tr.gardenSidebarTitle}
            </h3>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-forest-50 text-forest-800 border border-forest-200">
            {starPlants.length} {tr.gardenSidebarInPlan}
          </span>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-3.5 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center space-y-1.5 ${
            isDropActive
              ? 'border-forest-500 bg-forest-50'
              : 'border-stone-300 hover:border-forest-400 bg-stone-50/50 hover:bg-forest-50/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-forest-800">
            <Upload className="w-4 h-4 text-forest-600" />
            <span>{tr.gardenSidebarDropJson}</span>
          </div>
          <p className="text-[11px] text-stone-500">
            {tr.gardenSidebarDropJsonHint}
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setIsPickerOpen(!isPickerOpen)}
            className="w-full py-2 px-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{tr.gardenSidebarAddStarPlant}</span>
          </button>

          {isPickerOpen && (
            <div className="mt-2 p-2 rounded-xl bg-stone-50 border border-stone-200 max-h-60 overflow-y-auto space-y-1.5">
              <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                <span>{tr.gardenSidebarImportedGuilds}</span>
                <span className="font-mono text-forest-700 font-bold">{loadedGuildTemplates.length}</span>
              </div>
              {loadedGuildTemplates.length === 0 ? (
                <div className="p-3 text-center space-y-2 text-xs text-stone-600 bg-white rounded-lg border border-dashed border-stone-200">
                  <FileJson className="w-5 h-5 text-stone-400 mx-auto" />
                  <p className="font-semibold text-stone-800">
                    {tr.gardenSidebarNoGuilds}
                  </p>
                  <p className="text-[11px] text-stone-500 leading-tight">
                    {tr.gardenSidebarNoGuildsHint}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPickerOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="px-2.5 py-1 bg-forest-600 hover:bg-forest-700 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{tr.gardenSidebarSelectJson}</span>
                  </button>
                </div>
              ) : (
                loadedGuildTemplates.map(tmpl => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => {
                      onAddStarPlant(tmpl.starTree, tmpl.selectedPlantIds);
                      setIsPickerOpen(false);
                    }}
                    className="w-full p-2.5 rounded-lg bg-white hover:bg-forest-50 border border-stone-200 text-left flex flex-col gap-1 text-xs transition-colors cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-stone-800 group-hover:text-forest-800 truncate">
                        {getLoc(tmpl.starTree.commonName, language)}
                      </span>
                      <span className="text-[10px] font-mono text-forest-700 font-semibold shrink-0 bg-forest-50 px-1.5 py-0.5 rounded border border-forest-200">
                        {tmpl.selectedPlantIds.length} {tr.gardenSidebarCompanions}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-500 flex items-center justify-between w-full">
                      <span className="italic truncate">{tmpl.sourceName}</span>
                      <span className="font-mono text-stone-400">r={tmpl.starTree.matureRadiusM}m</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="space-y-2 pt-2 border-t border-stone-100">
          <div className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Trees className="w-3.5 h-3.5 text-forest-700" />
              <span>{tr.gardenSidebarActiveStarPlants}</span>
            </div>
            <span className="text-[10px] font-mono text-stone-500 font-bold bg-stone-100 px-1.5 py-0.5 rounded">
              {starPlants.length}
            </span>
          </div>

          {starPlants.length === 0 ? (
            <div className="p-3 text-center text-xs text-stone-400 bg-stone-50 rounded-xl border border-stone-100">
              {tr.gardenSidebarNoStarPlants}
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {groupedStarPlants.map(({ tree, instances }) => {
                const isExpanded = expandedTreeSpecies.includes(tree.id);
                const allSelected = instances.length > 0 && instances.every(i =>
                  selectedTreeIds.includes(i.instanceId) || selectedTreeId === i.instanceId
                );
                const someSelected = instances.some(i =>
                  selectedTreeIds.includes(i.instanceId) || selectedTreeId === i.instanceId
                );

                return (
                  <div
                    key={tree.id}
                    className={`rounded-xl border transition-all ${
                      allSelected
                        ? 'bg-sky-50/70 border-sky-300 ring-1 ring-sky-300'
                        : someSelected
                        ? 'bg-sky-50/40 border-sky-200'
                        : 'bg-white hover:bg-stone-50/80 border-stone-200'
                    }`}
                  >
                    <div
                      onClick={() => {
                        const ids = instances.map(i => i.instanceId);
                        onSelectTreeIds?.(ids);
                        if (ids.length > 0) onSelectTree(ids[0]);
                      }}
                      className="p-2.5 flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <PlantThumbnail
                          src={tree.imageUrl}
                          alt={getLoc(tree.commonName, language)}
                          fallbackText={getLoc(tree.commonName, language).slice(0, 2)}
                          fallbackColor={tree.color}
                          className="w-9 h-9 shrink-0"
                          roundedClassName="rounded-lg shadow-2xs"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-stone-900 truncate flex items-center gap-1.5">
                            <span>{getLoc(tree.commonName, language)}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-forest-100 text-forest-800 shrink-0">
                              ×{instances.length}
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-500 italic truncate">
                            {tree.botanicalName}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 shrink-0" onClick={e => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onOpenPlantDetailModal?.(starTreeToGuildPlant(tree))}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-forest-700 hover:bg-forest-50 transition-colors cursor-pointer"
                          title={tr.gardenSidebarViewDetails}
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleTreeSpecies(tree.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                          title={tr.gardenSidebarToggleInstances}
                        >
                          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-stone-100 bg-stone-50/60 p-1.5 space-y-1 rounded-b-xl">
                        {instances.map((inst, idx) => {
                          const isInstSelected = selectedTreeId === inst.instanceId || selectedTreeIds.includes(inst.instanceId);
                          return (
                            <div
                              key={inst.instanceId}
                              onClick={() => {
                                onSelectTree(inst.instanceId);
                                onSelectTreeIds?.([inst.instanceId]);
                              }}
                              className={`p-2 rounded-lg border text-[11px] flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                                isInstSelected
                                  ? 'bg-sky-100 border-sky-300 text-sky-950 font-semibold'
                                  : 'bg-white hover:bg-stone-100/80 border-stone-200 text-stone-700'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="font-mono text-[10px] text-stone-400 font-bold">#{idx + 1}</span>
                                <span className="font-mono text-[10px] text-stone-600">
                                  ({inst.xM > 0 ? `+${inst.xM}` : inst.xM}m, {inst.yM > 0 ? `+${inst.yM}` : inst.yM}m)
                                </span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => onDuplicateStarPlant(inst.instanceId)}
                                  className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200 cursor-pointer"
                                  title={tr.gardenSidebarDuplicate}
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onRemoveStarPlant(inst.instanceId)}
                                  className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                  title={tr.gardenSidebarRemove}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-2 pt-3 border-t border-stone-100">
          <div className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-forest-600" />
              <span>{tr.gardenSidebarActiveCompanions}</span>
            </div>
            <span className="text-[10px] font-mono text-stone-500 font-bold bg-stone-100 px-1.5 py-0.5 rounded">
              {companions.length}
            </span>
          </div>

          {companions.length === 0 ? (
            <div className="p-3 text-center text-xs text-stone-400 bg-stone-50 rounded-xl border border-stone-100">
              {tr.gardenSidebarNoCompanions}
            </div>
          ) : (
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {groupedCompanions.map(({ plant, instances, mergedCount }) => {
                const isExpanded = expandedCompanionSpecies.includes(plant.id);

                return (
                  <div
                    key={plant.id}
                    className="rounded-xl border border-stone-200 bg-white hover:bg-stone-50/80 transition-all text-xs"
                  >
                    <div
                      onClick={() => toggleCompanionSpecies(plant.id)}
                      className="p-2 flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <PlantThumbnail
                          src={plant.imageUrl}
                          alt={getLoc(plant.commonName, language)}
                          fallbackText={getLoc(plant.commonName, language).slice(0, 2)}
                          fallbackColor={plant.color}
                          className="w-8 h-8 shrink-0"
                          roundedClassName="rounded-lg shadow-2xs"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-stone-900 truncate flex items-center gap-1.5">
                            <span>{getLoc(plant.commonName, language)}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-700 shrink-0">
                              ×{instances.length}
                            </span>
                            {mergedCount > 0 && (
                              <span className="text-[9px] font-medium px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                {mergedCount} {tr.gardenSidebarShared}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-stone-500 italic truncate">
                            {plant.botanicalName}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 shrink-0" onClick={e => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onOpenPlantDetailModal?.(plant)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-forest-700 hover:bg-forest-50 transition-colors cursor-pointer"
                          title={tr.gardenSidebarViewDetails}
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleCompanionSpecies(plant.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                          title={tr.gardenSidebarToggleCoords}
                        >
                          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-stone-100 bg-stone-50/60 p-2 space-y-1 rounded-b-xl text-[10px]">
                        <div className="flex flex-wrap gap-1 pb-1">
                          {plant.roles.map(r => (
                            <span
                              key={r}
                              className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-white border border-stone-200 text-stone-600"
                            >
                              {translateRole(r, language)}
                            </span>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-1 font-mono text-stone-600">
                          {instances.map((inst, iIdx) => (
                            <div
                              key={inst.instanceId}
                              className="bg-white p-1 rounded border border-stone-200 flex items-center justify-between"
                            >
                              <span>#{iIdx + 1}: ({formatNumber(inst.xM, 1, language)}m, {formatNumber(inst.yM, 1, language)}m)</span>
                              {inst.isMerged && <span className="text-emerald-600 font-bold font-sans">✓</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <GardenWarningsBox
        language={language}
        conflicts={conflicts}
        shadePockets={shadePockets}
        stats={stats}
        starPlants={starPlants}
        autoShadeEnabled={autoShadeEnabled}
        onToggleAutoShade={onToggleAutoShade}
        onApplyShadePlant={onApplyShadePlant}
      />
    </div>
  );
};
