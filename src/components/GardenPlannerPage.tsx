import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ClimateZone, GuildPlant, Hemisphere, Language, SoilType, StarTree, getLoc } from '../types/guild';
import { GardenStarPlantInstance, GardenState, ImportedGuildTemplate } from '../types/garden';
import { STAR_TREES } from '../data/starTrees';
import { GUILD_PLANTS } from '../data/guildPlants';
import {
  GardenSubstitution,
  applyGardenSubstitution,
  pinKey,
  resolveGardenConflicts
} from '../core/gardenOptimizer';
import { detectGardenShadePockets } from '../core/gardenAntagonist';
import { GardenGridCanvas } from './GardenGridCanvas';
import { GardenSidebar } from './GardenSidebar';
import { PlantDetailModal } from './PlantDetailModal';
import { ShareGardenModal } from './ShareGardenModal';
import { parseGardenUrl } from '../utils/shareUtils';
import { STORAGE_KEY_GARDEN_GRID } from '../utils/gardenStorage';
import { placeClusterInGarden } from '../core/multiStarLayout';
import { exportGardenCalendarIcs, hashString } from '../core/gardenCalendar';
import { exportGardenPlanPdf } from '../core/gardenPdfExporter';
import { Check, AlertOctagon } from 'lucide-react';
import { t } from '../i18n/translations';

/** Companion list the optimizer will actually use for this tree (empty selection falls back to recommendations). */
function effectiveCompanionIds(tree: GardenStarPlantInstance): string[] {
  return tree.selectedPlantIds && tree.selectedPlantIds.length > 0
    ? tree.selectedPlantIds
    : tree.starTree.recommendedCompanions;
}

/** Swaps a sun-loving companion (or the last one) for a shade plant. */
function withShadePlant(tree: GardenStarPlantInstance, shadePlantId: string): string[] {
  const ids = [...effectiveCompanionIds(tree)];
  let replaceIdx = ids.findIndex(id => {
    const p = GUILD_PLANTS.find(gp => gp.id === id);
    return p?.preferredSector === 'SOUTH_SUN' || p?.preferredSector === 'WEST_WIND';
  });
  if (replaceIdx === -1) replaceIdx = ids.length - 1;
  if (replaceIdx === -1) ids.push(shadePlantId);
  else ids[replaceIdx] = shadePlantId;
  return ids;
}

/** Short random id for a new garden (keeps its calendar event UIDs apart from other gardens). */
function newGardenId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

interface GardenPlannerPageProps {
  language: Language;
  selectedSoil: SoilType;
  selectedZone: ClimateZone;
  hemisphere: Hemisphere;
  onNavigate: (path: string) => void;
  initialStarTree?: StarTree;
  initialSelectedPlants?: GuildPlant[];
  pendingTreesToPlace?: GardenStarPlantInstance[] | null;
  onClearPendingTrees?: () => void;
}

export const GardenPlannerPage: React.FC<GardenPlannerPageProps> = ({
  language,
  selectedSoil,
  selectedZone,
  hemisphere,
  onNavigate,
  initialStarTree,
  initialSelectedPlants,
  pendingTreesToPlace,
  onClearPendingTrees,
}) => {
  const tr = t(language);

  const getSavedData = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_GARDEN_GRID);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse saved garden grid data', e);
    }
    return null;
  };

  const savedData = useMemo(() => getSavedData(), []);

  const urlGarden = useMemo(() => {
    if (typeof window !== 'undefined') {
      try {
        return parseGardenUrl(window.location.search);
      } catch (e) {
        return null;
      }
    }
    return null;
  }, []);

  const [gardenName] = useState<string>(() =>
    urlGarden?.gardenName || savedData?.gardenName || tr.gardenPageDefaultName
  );

  // Stable per garden: shared links derive it from the code, so opening the same link twice and
  // exporting the calendar again updates the imported events instead of duplicating them.
  const [gardenId, setGardenId] = useState<string>(() => {
    const sharedCode = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('garden') : null;
    if (urlGarden && sharedCode) return `s${hashString(sharedCode)}`;
    if (typeof savedData?.gardenId === 'string' && savedData.gardenId) return savedData.gardenId;
    return newGardenId();
  });

  // Guild templates for the picker: shared-URL trees, the active planner guild, then earlier imports
  const [loadedGuildTemplates, setLoadedGuildTemplates] = useState<ImportedGuildTemplate[]>(() => {
    const existingTemplates: ImportedGuildTemplate[] =
      savedData && Array.isArray(savedData.loadedGuildTemplates) ? savedData.loadedGuildTemplates : [];

    const urlTemplates: ImportedGuildTemplate[] = [];
    if (urlGarden && urlGarden.starPlants.length > 0) {
      const seenTreeIds = new Set<string>();
      for (const sp of urlGarden.starPlants) {
        if (!seenTreeIds.has(sp.treeId)) {
          seenTreeIds.add(sp.treeId);
          urlTemplates.push({
            id: `tmpl-shared-${sp.treeId}`,
            sourceName: tr.gardenPageSharedSource.replace('{name}', getLoc(sp.starTree.commonName, language)),
            starTree: sp.starTree,
            selectedPlantIds: sp.selectedPlantIds || [],
            importedAt: new Date().toISOString()
          });
        }
      }
    }

    const starterTree = initialStarTree || STAR_TREES[0];
    const initialPlantIds = initialSelectedPlants && initialSelectedPlants.length > 0
      ? initialSelectedPlants.map(p => p.id)
      : starterTree.recommendedCompanions.slice(0, 5);

    const plannerTemplateId = `tmpl-planner-${starterTree.id}`;
    const plannerTemplate: ImportedGuildTemplate = {
      id: plannerTemplateId,
      sourceName: tr.gardenPagePlannerSource.replace('{name}', getLoc(starterTree.commonName, language)),
      starTree: starterTree,
      selectedPlantIds: initialPlantIds,
      importedAt: new Date().toISOString()
    };

    const combined = [...urlTemplates, plannerTemplate];
    const filtered = existingTemplates.filter(t => !combined.some(c => c.id === t.id));
    return [...combined, ...filtered];
  });

  const [starPlants, setStarPlants] = useState<GardenStarPlantInstance[]>(() => {
    if (urlGarden && urlGarden.starPlants.length > 0) {
      return urlGarden.starPlants;
    }
    if (savedData && Array.isArray(savedData.starPlants)) {
      return savedData.starPlants;
    }
    return [];
  });

  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(() => {
    if (urlGarden && urlGarden.starPlants.length > 0) {
      return urlGarden.starPlants[0].instanceId;
    }
    return null;
  });
  const [selectedTreeIds, setSelectedTreeIds] = useState<string[]>([]);
  const [modalPlant, setModalPlant] = useState<GuildPlant | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(() => {
    if (urlGarden && urlGarden.starPlants.length > 0) {
      return {
        type: 'success',
        message: tr.gardenPageSharedLoaded.replace('{count}', String(urlGarden.starPlants.length))
      };
    }
    return null;
  });
  const [autoShadeEnabled, setAutoShadeEnabled] = useState<boolean>(() => {
    return urlGarden?.autoShadeEnabled ?? savedData?.autoShadeEnabled ?? false;
  });
  // Garden-level conflict resolution: on by default; local preference only (not part of share codes)
  const [autoResolveEnabled, setAutoResolveEnabled] = useState<boolean>(() =>
    typeof savedData?.autoResolveEnabled === 'boolean' ? savedData.autoResolveEnabled : true
  );
  // Companions the user chose in the garden itself (pinKey(tree, plant)): never auto-replaced
  const [pinnedCompanions, setPinnedCompanions] = useState<string[]>(() =>
    Array.isArray(savedData?.pinnedCompanions) ? savedData.pinnedCompanions.filter((k: unknown) => typeof k === 'string') : []
  );

  // Keep the planner tab's current guild at the top of the templates
  useEffect(() => {
    if (!initialStarTree) return;

    const plannerPlantIds = initialSelectedPlants && initialSelectedPlants.length > 0
      ? initialSelectedPlants.map(p => p.id)
      : initialStarTree.recommendedCompanions.slice(0, 5);

    const plannerTemplateId = `tmpl-planner-${initialStarTree.id}`;
    const plannerTemplate: ImportedGuildTemplate = {
      id: plannerTemplateId,
      sourceName: tr.gardenPagePlannerSource.replace('{name}', getLoc(initialStarTree.commonName, language)),
      starTree: initialStarTree,
      selectedPlantIds: plannerPlantIds,
      importedAt: new Date().toISOString()
    };

    setLoadedGuildTemplates(prev => {
      const existing = prev.find(t => t.id === plannerTemplateId);
      if (existing) {
        const idsMatch =
          existing.selectedPlantIds.length === plannerPlantIds.length &&
          existing.selectedPlantIds.every((id, idx) => id === plannerPlantIds[idx]);
        if (idsMatch) return prev;
      }
      return [plannerTemplate, ...prev.filter(t => t.id !== plannerTemplateId)];
    });
  }, [initialStarTree, initialSelectedPlants, language]);

  useEffect(() => {
    try {
      const data = {
        gardenId,
        gardenName,
        starPlants,
        loadedGuildTemplates,
        autoShadeEnabled,
        autoResolveEnabled,
        pinnedCompanions
      };
      localStorage.setItem(STORAGE_KEY_GARDEN_GRID, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save garden grid state to localStorage', e);
    }
  }, [gardenId, gardenName, starPlants, loadedGuildTemplates, autoShadeEnabled, autoResolveEnabled, pinnedCompanions]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Optimizer + garden conflict resolution. Substitutions are derived on every render (never persisted),
  // so saved gardens and share codes keep the user's own lists.
  const resolution = useMemo(() => {
    return resolveGardenConflicts(starPlants, {
      allGuildPlants: GUILD_PLANTS,
      hemisphere,
      zone: selectedZone,
      soil: selectedSoil,
      enabled: autoResolveEnabled,
      pinned: new Set(pinnedCompanions)
    });
  }, [starPlants, hemisphere, selectedZone, selectedSoil, autoResolveEnabled, pinnedCompanions]);
  const { companions, stats } = resolution;
  const conflicts = resolution.unresolved;

  /** Companion list as shown (after automatic substitutions). */
  const resolvedCompanionIds = (tree: GardenStarPlantInstance): string[] =>
    resolution.effectiveCompanionIds[tree.instanceId] ?? effectiveCompanionIds(tree);

  const plantLabel = (id: string | null) => {
    const p = id ? GUILD_PLANTS.find(gp => gp.id === id) : undefined;
    return p ? getLoc(p.commonName, language) : id ?? '';
  };

  // Undo an automatic swap: the original plant becomes a user choice and is only suggested from now on
  const handleKeepOriginal = (sub: GardenSubstitution) => {
    const keys = sub.servedTreeIds.map(tid => pinKey(tid, sub.removedPlantId));
    setPinnedCompanions(prev => [...prev, ...keys.filter(k => !prev.includes(k))]);
    setToast({ type: 'success', message: tr.gardenResolveKeptToast.replace('{plant}', plantLabel(sub.removedPlantId)) });
  };

  // One-click fix for a suggestion: write the resolved lists (with the swap) into the served trees
  const handleApplySuggestion = (sub: GardenSubstitution) => {
    const next = applyGardenSubstitution(resolution.effectiveCompanionIds, sub);
    setStarPlants(prev => prev.map(tree => (
      sub.servedTreeIds.includes(tree.instanceId) && next[tree.instanceId]
        ? { ...tree, selectedPlantIds: [...next[tree.instanceId]] }
        : tree
    )));
    const dropKeys = new Set(sub.servedTreeIds.map(tid => pinKey(tid, sub.removedPlantId)));
    setPinnedCompanions(prev => prev.filter(k => !dropKeys.has(k)));
    setToast({
      type: 'success',
      message: tr.gardenResolveAppliedToast
        .replace('{removed}', plantLabel(sub.removedPlantId))
        .replace('{added}', sub.addedPlantIds.length > 0 ? sub.addedPlantIds.map(plantLabel).join(' + ') : '-')
    });
  };

  const shadePockets = useMemo(() => {
    return detectGardenShadePockets(starPlants);
  }, [starPlants]);

  const handleApplyShadePlant = (shadePlantId: string) => {
    if (shadePockets.length === 0) {
      setToast({
        type: 'error',
        message: tr.gardenPageNoShadePockets
      });
      return;
    }

    const targetPlant = GUILD_PLANTS.find(p => p.id === shadePlantId);
    const plantName = targetPlant ? getLoc(targetPlant.commonName, language) : shadePlantId;

    setStarPlants(prev => {
      return prev.map(tree => {
        const isInAnyPocket = shadePockets.some(p => p.treeIds.includes(tree.instanceId));
        if (!isInAnyPocket) return tree;
        if (effectiveCompanionIds(tree).includes(shadePlantId)) return tree;
        return { ...tree, selectedPlantIds: withShadePlant(tree, shadePlantId) };
      });
    });

    setToast({
      type: 'success',
      message: tr.gardenPageShadePlantPlaced.replace('{name}', plantName)
    });
  };

  // Auto mode: give every tree in a shade pocket a shade-tolerant companion
  useEffect(() => {
    if (!autoShadeEnabled || shadePockets.length === 0) return;

    setStarPlants(prev => {
      let changed = false;
      const next = prev.map(tree => {
        const inPocket = shadePockets.some(p => p.treeIds.includes(tree.instanceId));
        if (!inPocket) return tree;

        const hasShadePlant = effectiveCompanionIds(tree).some(id => ['plant-wild-garlic', 'plant-hosta', 'plant-comfrey'].includes(id));
        if (hasShadePlant) return tree;

        changed = true;
        return { ...tree, selectedPlantIds: withShadePlant(tree, 'plant-wild-garlic') };
      });
      return changed ? next : prev;
    });
  }, [autoShadeEnabled, shadePockets]);

  const handleAddStarPlant = (tree: StarTree, selectedPlantIds?: string[], xM = 0, yM = 0) => {
    let finalX = xM;
    let finalY = yM;

    // Stagger new trees so they don't all land on the origin
    if (finalX === 0 && finalY === 0 && starPlants.length > 0) {
      const offset = (starPlants.length * 3.5);
      finalX = Number((offset % 12 - 4).toFixed(1));
      finalY = Number((Math.floor(offset / 12) * 4).toFixed(1));
    }

    const companions = selectedPlantIds && selectedPlantIds.length > 0
      ? selectedPlantIds
      : tree.recommendedCompanions.slice(0, 5);

    const newInst: GardenStarPlantInstance = {
      instanceId: `star-tree-${tree.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      treeId: tree.id,
      starTree: tree,
      xM: finalX,
      yM: finalY,
      selectedPlantIds: companions
    };

    setStarPlants(prev => [...prev, newInst]);
    setSelectedTreeId(newInst.instanceId);
    setToast({
      type: 'success',
      message: tr.gardenPageStarPlantAdded
        .replace('{name}', getLoc(tree.commonName, language))
        .replace('{count}', String(companions.length))
    });
  };

  const handleRemoveStarPlant = (instanceId: string) => {
    setStarPlants(prev => prev.filter(t => t.instanceId !== instanceId));
    if (selectedTreeId === instanceId) setSelectedTreeId(null);
    setSelectedTreeIds(prev => prev.filter(id => id !== instanceId));
  };

  const handleDeleteTrees = (instanceIds: string[]) => {
    setStarPlants(prev => prev.filter(t => !instanceIds.includes(t.instanceId)));
    setSelectedTreeIds([]);
    if (selectedTreeId && instanceIds.includes(selectedTreeId)) {
      setSelectedTreeId(null);
    }
  };

  const handleDuplicateStarPlant = (instanceId: string) => {
    const existing = starPlants.find(t => t.instanceId === instanceId);
    if (!existing) return;

    const newX = Number((existing.xM + existing.starTree.matureRadiusM * 1.8).toFixed(1));
    const newY = Number((existing.yM).toFixed(1));

    const dup: GardenStarPlantInstance = {
      ...existing,
      instanceId: `star-tree-${existing.treeId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      xM: newX,
      yM: newY,
    };

    setStarPlants(prev => [...prev, dup]);
    setSelectedTreeId(dup.instanceId);
  };

  const handlePasteTrees = (treesToPaste: GardenStarPlantInstance[]) => {
    const newTrees = treesToPaste.map(t => ({
      ...t,
      instanceId: `star-tree-${t.treeId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      xM: Number((t.xM + 2.0).toFixed(2)),
      yM: Number((t.yM + 2.0).toFixed(2)),
    }));
    setStarPlants(prev => [...prev, ...newTrees]);
    const newIds = newTrees.map(t => t.instanceId);
    setSelectedTreeIds(newIds);
    if (newIds.length > 0) setSelectedTreeId(newIds[0]);
    setToast({
      type: 'success',
      message: tr.gardenPagePasted.replace('{count}', String(newTrees.length))
    });
  };

  const handleBatchUpdateTrees = (updated: GardenStarPlantInstance[]) => {
    setStarPlants(updated);
  };

  const handleUpdateStarPlantPosition = (instanceId: string, xM: number, yM: number) => {
    setStarPlants(prev =>
      prev.map(t => (t.instanceId === instanceId ? { ...t, xM, yM } : t))
    );
  };

  // Accepts both garden-grid exports and single-tree plans from the radial planner
  const handleImportJsonFile = (file: File, targetXM = 0, targetYM = 0) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const text = e.target?.result as string;
        if (!text) throw new Error('Empty file content');
        const data = JSON.parse(text);

        if (Array.isArray(data.starPlants) && data.starPlants.length > 0) {
          const importedStars: GardenStarPlantInstance[] = [];
          const newTemplates: ImportedGuildTemplate[] = [];

          for (const sp of data.starPlants) {
            const foundTree = STAR_TREES.find(t => t.id === sp.treeId || t.id === sp.starTree?.id);
            if (foundTree) {
              const companions = Array.isArray(sp.selectedPlantIds) ? sp.selectedPlantIds : foundTree.recommendedCompanions;
              importedStars.push({
                instanceId: `imported-${foundTree.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                treeId: foundTree.id,
                starTree: foundTree,
                xM: Number((targetXM + (sp.xM || 0)).toFixed(2)),
                yM: Number((targetYM + (sp.yM || 0)).toFixed(2)),
                selectedPlantIds: companions
              });

              newTemplates.push({
                id: `tmpl-${foundTree.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                sourceName: file.name.replace(/\.json$/i, '') || getLoc(foundTree.commonName, language),
                starTree: foundTree,
                selectedPlantIds: companions,
                importedAt: new Date().toISOString()
              });
            }
          }
          if (importedStars.length > 0) {
            setStarPlants(prev => [...prev, ...importedStars]);
            setLoadedGuildTemplates(prev => [...newTemplates, ...prev]);
            setToast({
              type: 'success',
              message: tr.gardenPageImportedStars.replace('{count}', String(importedStars.length))
            });
            return;
          }
        }

        const treeId = data.starTree?.id || data.treeId;
        const matchedTree = STAR_TREES.find(t => t.id === treeId) ||
          STAR_TREES.find(t => t.botanicalName.toLowerCase().trim() === String(data.starTree?.botanicalName).toLowerCase().trim());

        if (!matchedTree) {
          throw new Error('No recognized tree found in plan JSON');
        }

        const plantIds: string[] = [];
        if (Array.isArray(data.companionPlants)) {
          data.companionPlants.forEach((p: any) => {
            if (p.id) plantIds.push(p.id);
          });
        }

        const companions = plantIds.length > 0 ? plantIds : matchedTree.recommendedCompanions;

        const importedStar: GardenStarPlantInstance = {
          instanceId: `imported-${matchedTree.id}-${Date.now()}`,
          treeId: matchedTree.id,
          starTree: matchedTree,
          xM: targetXM,
          yM: targetYM,
          selectedPlantIds: companions
        };

        const newTemplate: ImportedGuildTemplate = {
          id: `tmpl-${matchedTree.id}-${Date.now()}`,
          sourceName: file.name.replace(/\.json$/i, '') || getLoc(matchedTree.commonName, language),
          starTree: matchedTree,
          selectedPlantIds: companions,
          importedAt: new Date().toISOString()
        };

        setStarPlants(prev => [...prev, importedStar]);
        setLoadedGuildTemplates(prev => [newTemplate, ...prev.filter(t => t.id !== newTemplate.id)]);
        setSelectedTreeId(importedStar.instanceId);
        setToast({
          type: 'success',
          message: tr.gardenPageImportedGuild.replace('{name}', getLoc(matchedTree.commonName, language))
        });
      } catch (err) {
        console.error('Failed to import JSON plan', err);
        setToast({
          type: 'error',
          message: tr.gardenPageInvalidJson
        });
      }
    };
    reader.readAsText(file);
  };

  const buildGardenState = (): GardenState => ({
    version: '2.0',
    name: gardenName,
    createdAt: new Date().toISOString(),
    soil: selectedSoil,
    zone: selectedZone,
    hemisphere,
    language,
    starPlants,
    placedCompanions: companions,
    gridBoundsM: { minX: -20, maxX: 20, minY: -20, maxY: 20 }
  });

  const handleExportJson = () => {
    const gardenState = buildGardenState();
    const blob = new Blob([JSON.stringify(gardenState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gardenName.toLowerCase().replace(/[^a-z0-9äöüß]+/gi, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = async () => {
    try {
      await exportGardenPlanPdf({ garden: buildGardenState() });
      setToast({
        type: 'success',
        message: tr.gardenPagePdfSuccess
      });
    } catch (e) {
      console.error('Failed to export PDF:', e);
      setToast({
        type: 'error',
        message: tr.gardenPagePdfError
      });
    }
  };

  const handleExportCalendar = () => {
    try {
      exportGardenCalendarIcs({ garden: buildGardenState(), gardenKey: gardenId });
      setToast({
        type: 'success',
        message: tr.exportCalendarSuccess
      });
    } catch (e) {
      console.error('Failed to export Calendar .ics:', e);
      setToast({
        type: 'error',
        message: tr.gardenPageCalendarError
      });
    }
  };

  const handleResetGarden = () => {
    setStarPlants([]);
    setPinnedCompanions([]);
    setGardenId(newGardenId());
    setSelectedTreeId(null);
    setSelectedTreeIds([]);
    setToast({
      type: 'success',
      message: tr.gardenPageCleared
    });
  };

  // Star-plant instance whose guild the plant detail modal edits: the one tree the plant serves,
  // else the selected tree, else the only tree in the garden. None for star plants themselves.
  const modalPlantIsStarPlant = modalPlant ? STAR_TREES.some(tree => tree.id === modalPlant.id) : false;
  const modalTargetTree = useMemo((): GardenStarPlantInstance | null => {
    if (!modalPlant || modalPlantIsStarPlant) return null;
    const servingIds = new Set(
      companions.filter(c => c.plantId === modalPlant.id).flatMap(c => c.servicingTreeIds)
    );
    if (servingIds.size === 1) {
      const onlyTree = starPlants.find(tree => servingIds.has(tree.instanceId));
      if (onlyTree) return onlyTree;
    }
    const selected = selectedTreeId ? starPlants.find(tree => tree.instanceId === selectedTreeId) : undefined;
    if (selected) return selected;
    return starPlants.length === 1 ? starPlants[0] : null;
  }, [modalPlant, modalPlantIsStarPlant, companions, starPlants, selectedTreeId]);

  const modalPlantInGuild = modalPlant && modalTargetTree
    ? resolvedCompanionIds(modalTargetTree).includes(modalPlant.id)
    : false;

  const handleToggleModalCompanion = (plant: GuildPlant) => {
    const plantName = getLoc(plant.commonName, language);
    if (modalPlantIsStarPlant) {
      setToast({ type: 'error', message: tr.gardenPageCompanionIsStarPlant.replace('{plant}', plantName) });
      return;
    }
    const target = modalTargetTree;
    if (!target) {
      setToast({ type: 'error', message: tr.gardenPageCompanionNoTree });
      return;
    }
    const treeName = target.customName || getLoc(target.starTree.commonName, language);
    // Edit what the user sees: automatic swaps of this tree become part of its own list
    const current = resolvedCompanionIds(target);
    const key = pinKey(target.instanceId, plant.id);

    if (current.includes(plant.id)) {
      const next = current.filter(id => id !== plant.id);
      // An empty list means "use the recommendations", which would bring every default back
      if (next.length === 0) {
        setToast({
          type: 'error',
          message: tr.gardenPageCompanionLastOne.replace('{plant}', plantName).replace('{tree}', treeName)
        });
        return;
      }
      setStarPlants(prev => prev.map(tree => (tree.instanceId === target.instanceId ? { ...tree, selectedPlantIds: next } : tree)));
      setPinnedCompanions(prev => prev.filter(k => k !== key));
      setToast({
        type: 'success',
        message: tr.gardenPageCompanionRemoved.replace('{plant}', plantName).replace('{tree}', treeName)
      });
      return;
    }

    // Same rule the modal applies to its button
    if (target.starTree.jugloneProducer && plant.jugloneTolerance === 'SENSITIVE') {
      setToast({ type: 'error', message: tr.jugloneWarning });
      return;
    }
    setStarPlants(prev => prev.map(tree => (tree.instanceId === target.instanceId ? { ...tree, selectedPlantIds: [...current, plant.id] } : tree)));
    // Added by hand in the garden: respected as the user's choice, never replaced automatically
    setPinnedCompanions(prev => (prev.includes(key) ? prev : [...prev, key]));
    setToast({
      type: 'success',
      message: tr.gardenPageCompanionAdded.replace('{plant}', plantName).replace('{tree}', treeName)
    });
  };

  // Trees handed over from the radial planner's cluster view. In a garden that already has stars the
  // cluster is moved as one block to free space (placeClusterInGarden), so it keeps the preview's
  // layout and never lands on existing trunks. The ref makes the effect run once per hand-over:
  // StrictMode runs effects twice before the parent has cleared pendingTreesToPlace.
  const handledHandoverRef = useRef<GardenStarPlantInstance[] | null>(null);
  useEffect(() => {
    if (!pendingTreesToPlace || pendingTreesToPlace.length === 0) return;
    if (handledHandoverRef.current === pendingTreesToPlace) return;
    handledHandoverRef.current = pendingTreesToPlace;
    // Placed against the garden as it is when the hand-over arrives
    const placement = placeClusterInGarden(starPlants, pendingTreesToPlace);
    setStarPlants(prev => [...prev, ...placement.starPlants.filter(t => !prev.some(p => p.instanceId === t.instanceId))]);
    setSelectedTreeId(placement.starPlants[0].instanceId);
    onClearPendingTrees?.();
    const firstTree = placement.starPlants[0].starTree;
    const sameSpecies = placement.starPlants.every(t => t.treeId === firstTree.id);
    setToast({
      type: 'success',
      message: starPlants.length > 0 && sameSpecies
        ? tr.gardenPagePendingPlacedBeside
            .replace('{count}', String(placement.starPlants.length))
            .replace('{name}', getLoc(firstTree.commonName, language))
        : tr.gardenPagePendingPlaced.replace('{count}', String(placement.starPlants.length))
    });
  }, [pendingTreesToPlace]);

  // Export/reset/share actions are triggered from the top navbar via window events
  useEffect(() => {
    const onPdf = () => handleExportPdf();
    const onJson = () => handleExportJson();
    const onCal = () => handleExportCalendar();
    const onReset = () => handleResetGarden();
    const onShare = () => setIsShareModalOpen(true);

    window.addEventListener('garden-export-pdf', onPdf);
    window.addEventListener('garden-export-json', onJson);
    window.addEventListener('garden-export-cal', onCal);
    window.addEventListener('garden-reset', onReset);
    window.addEventListener('garden-share', onShare);

    return () => {
      window.removeEventListener('garden-export-pdf', onPdf);
      window.removeEventListener('garden-export-json', onJson);
      window.removeEventListener('garden-export-cal', onCal);
      window.removeEventListener('garden-reset', onReset);
      window.removeEventListener('garden-share', onShare);
    };
  }, [handleExportPdf, handleExportJson, handleExportCalendar, handleResetGarden]);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5 space-y-3">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm flex items-center space-x-2 transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-900 border-emerald-700 text-emerald-100'
              : 'bg-rose-900 border-rose-700 text-rose-100'
          }`}
        >
          {toast.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertOctagon className="w-4 h-4 text-rose-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6">
        <div className="w-full lg:w-96 lg:max-h-[calc(100vh-8.5rem)] lg:overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          <GardenSidebar
            language={language}
            starPlants={starPlants}
            companions={companions}
            conflicts={conflicts}
            shadePockets={shadePockets}
            stats={stats}
            selectedTreeId={selectedTreeId}
            selectedTreeIds={selectedTreeIds}
            onSelectTree={setSelectedTreeId}
            onSelectTreeIds={setSelectedTreeIds}
            onAddStarPlant={handleAddStarPlant}
            onRemoveStarPlant={handleRemoveStarPlant}
            onDuplicateStarPlant={handleDuplicateStarPlant}
            onImportJsonFile={handleImportJsonFile}
            loadedGuildTemplates={loadedGuildTemplates}
            autoShadeEnabled={autoShadeEnabled}
            onToggleAutoShade={() => setAutoShadeEnabled(prev => !prev)}
            onApplyShadePlant={handleApplyShadePlant}
            onOpenPlantDetailModal={setModalPlant}
            substitutions={resolution.substitutions}
            suggestions={resolution.suggestions}
            autoResolveEnabled={autoResolveEnabled}
            onToggleAutoResolve={() => setAutoResolveEnabled(prev => !prev)}
            onKeepOriginal={handleKeepOriginal}
            onApplySuggestion={handleApplySuggestion}
          />
        </div>

        <div className="flex-1 w-full lg:sticky lg:top-20 flex justify-center">
          <GardenGridCanvas
            language={language}
            starPlants={starPlants}
            companions={companions}
            conflicts={conflicts}
            shadePockets={shadePockets}
            selectedTreeId={selectedTreeId}
            selectedTreeIds={selectedTreeIds}
            onSelectTree={setSelectedTreeId}
            onSelectTreeIds={setSelectedTreeIds}
            onUpdateStarPlantPosition={handleUpdateStarPlantPosition}
            onBatchUpdateTrees={handleBatchUpdateTrees}
            onDeleteTrees={handleDeleteTrees}
            onPasteTrees={handlePasteTrees}
            onSelectCompanion={setModalPlant}
            onDropJsonFile={handleImportJsonFile}
          />
        </div>
      </div>

      {modalPlant && (
        <PlantDetailModal
          language={language}
          plant={modalPlant}
          selectedTree={modalTargetTree?.starTree}
          selectedSoil={selectedSoil}
          selectedZone={selectedZone}
          onClose={() => setModalPlant(null)}
          isSelected={modalPlantInGuild}
          onToggleSelect={handleToggleModalCompanion}
          toggleDisabledReason={
            modalPlant && modalPlantIsStarPlant
              ? tr.gardenPageCompanionIsStarPlant.replace('{plant}', getLoc(modalPlant.commonName, language))
              : !modalTargetTree
              ? tr.gardenPageCompanionNoTree
              : undefined
          }
          onNavigate={onNavigate}
        />
      )}

      {isShareModalOpen && (
        <ShareGardenModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          gardenName={gardenName}
          starPlants={starPlants}
          companions={companions}
          selectedSoil={selectedSoil}
          selectedZone={selectedZone}
          hemisphere={hemisphere}
          language={language}
          autoShadeEnabled={autoShadeEnabled}
        />
      )}
    </div>
  );
};
