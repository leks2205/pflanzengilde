import React, { useState, useEffect } from 'react';
import { ActiveGapFilter, ActivePestFilter, ClimateZone, GuildPlant, Hemisphere, Language, PhenoSeason, SoilType, StarTree, TreeAgeMode, getLoc } from './types/guild';
import { STAR_TREES } from './data/starTrees';
import { GUILD_PLANTS } from './data/guildPlants';
import { Navbar } from './components/Navbar';
import { SiteConditionsBar } from './components/SiteConditionsBar';
import { StarTreeSelector } from './components/StarTreeSelector';
import { GuildBuilder } from './components/GuildBuilder';
import { RoleCoverageCard } from './components/RoleCoverageCard';
import { SeasonalCalendar } from './components/SeasonalCalendar';
import { GardenPlanCanvas } from './components/GardenPlanCanvas';
import { PlantDetailModal } from './components/PlantDetailModal';
import { AntagonistCard } from './components/AntagonistCard';
import { GuildEmbedCard } from './components/GuildEmbedCard';
import { GardenEmbedCard } from './components/ShareGardenModal';
import { parseGuildUrl, parseGardenUrl, SOIL_TYPES, CLIMATE_ZONES } from './utils/shareUtils';
import { resolveGardenConflicts } from './core/gardenOptimizer';
import { isCompatibleWithGuild, partitionGuildByCompatibility } from './core/compatibility';
import { GUILD_PRESETS as PRESETS, DEFAULT_GUILD_PLANT_IDS } from './core/guildPresets';
import { t } from './i18n/translations';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { buildClusterStarInstances } from './core/multiStarLayout';
import { StarPlantClusterConfig, GardenStarPlantInstance } from './types/garden';
import { STORAGE_KEY_GARDEN_GRID } from './utils/gardenStorage';

// Legal pages are operator-specific and not in the repository. Drop Impressum.tsx /
// Datenschutz.tsx into src/legal/ to enable the /impressum and /datenschutz routes.
interface LegalPageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onBack: () => void;
  onNavigate: (path: string) => void;
}
const legalModules = import.meta.glob<Record<string, React.ComponentType<LegalPageProps>>>('./legal/*.tsx');
const loadLegalPage = (name: string) => {
  const load = legalModules[`./legal/${name}.tsx`];
  return load ? React.lazy(() => load().then(m => ({ default: m[name] }))) : null;
};
const Impressum = loadLegalPage('Impressum');
const Datenschutz = loadLegalPage('Datenschutz');
const Guides = React.lazy(() => import('./components/Guides').then(m => ({ default: m.Guides })));
const PhotoCredits = React.lazy(() => import('./components/PhotoCredits').then(m => ({ default: m.PhotoCredits })));
const GardenPlannerPage = React.lazy(() => import('./components/GardenPlannerPage').then(m => ({ default: m.GardenPlannerPage })));
const ShareGuildModal = React.lazy(() => import('./components/ShareGuildModal').then(m => ({ default: m.ShareGuildModal })));

const STORAGE_KEY_GUILD = 'permaculture_plant_guild_v1';
const STORAGE_KEY_LANG = 'permaculture_plant_guild_lang';
const STORAGE_KEY_SOIL = 'permaculture_plant_guild_soil';
const STORAGE_KEY_ZONE = 'permaculture_plant_guild_zone';

const isSoilType = (v: unknown): v is SoilType => (SOIL_TYPES as unknown[]).includes(v);
const isClimateZone = (v: unknown): v is ClimateZone => (CLIMATE_ZONES as unknown[]).includes(v);
const isHemisphere = (v: unknown): v is Hemisphere => v === 'NORTHERN' || v === 'SOUTHERN';


const readGuildUrl = () => {
  if (typeof window === 'undefined') return null;
  try {
    const parsed = parseGuildUrl(window.location.search, window.location.pathname);
    return parsed.hasGuildParams ? parsed : null;
  } catch {
    return null;
  }
};

const scrollToGuildBuilder = () => {
  setTimeout(() => {
    document.getElementById('guild-builder-step')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
};

export const App: React.FC = () => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [pendingTreesToPlace, setPendingTreesToPlace] = useState<GardenStarPlantInstance[] | null>(null);
  // Bumped to remount the garden planner so it re-reads an imported plan from localStorage
  const [gardenImportKey, setGardenImportKey] = useState(0);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    if (saved === 'de' || saved === 'en') return saved;
    return typeof navigator !== 'undefined' && navigator.language.startsWith('de') ? 'de' : 'en';
  });

  const [selectedSoil, setSelectedSoil] = useState<SoilType>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SOIL);
    return isSoilType(saved) ? saved : 'LOAM';
  });

  const [selectedZone, setSelectedZone] = useState<ClimateZone>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ZONE);
    return isClimateZone(saved) ? saved : 'TEMPERATE';
  });

  const [initialGuildUrl] = useState(readGuildUrl);
  const [selectedTree, setSelectedTree] = useState<StarTree>(() => {
    const tree = initialGuildUrl?.treeId && STAR_TREES.find(t => t.id === initialGuildUrl.treeId);
    return tree || STAR_TREES[0];
  });
  const [selectedPlants, setSelectedPlants] = useState<GuildPlant[]>(() => {
    if (initialGuildUrl && initialGuildUrl.plantIds.length > 0) {
      const plants = GUILD_PLANTS.filter(p => initialGuildUrl.plantIds.includes(p.id));
      if (plants.length > 0) return plants;
    }
    return GUILD_PLANTS.filter(p =>
      DEFAULT_GUILD_PLANT_IDS.includes(p.id)
    );
  });
  const [currentSeason, setCurrentSeason] = useState<PhenoSeason>('LATE_SPRING');
  const [hemisphere, setHemisphere] = useState<Hemisphere>('NORTHERN');
  // Planting age: young trees keep a wider bare zone around the trunk (ground-cover areas)
  const [treeAge, setTreeAge] = useState<TreeAgeMode>('YOUNG');
  const [modalPlant, setModalPlant] = useState<GuildPlant | null>(null);
  const [activeGapFilter, setActiveGapFilter] = useState<ActiveGapFilter | null>(null);
  const [activePestFilter, setActivePestFilter] = useState<ActivePestFilter | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search + window.location.hash;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search + window.location.hash);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      const currentFull = window.location.pathname + window.location.search + window.location.hash;
      if (currentFull !== path) {
        window.history.pushState({}, '', path);
      }
      setCurrentPath(path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      if (!path.includes('#')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const tr = t(language);
  const isGardenRoute = currentPath.startsWith('/garten') || currentPath.startsWith('/garden');

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LANG, language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SOIL, selectedSoil);
  }, [selectedSoil]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ZONE, selectedZone);
    // Pest defenses are zone-dependent (a companion may not grow in the new zone)
    setActivePestFilter(null);
  }, [selectedZone]);

  // Tree and plants from a guild link are already applied by the state initializers above
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const gardenData = parseGardenUrl(window.location.search);
        if (gardenData) {
          if (gardenData.soil) setSelectedSoil(gardenData.soil);
          if (gardenData.zone) setSelectedZone(gardenData.zone);
          if (gardenData.hemisphere) setHemisphere(gardenData.hemisphere);
          if (gardenData.language) setLanguage(gardenData.language);
          if (window.location.pathname === '/' || window.location.pathname === '') {
            navigateTo(`/garten/${window.location.search}`);
          }
          setToast({
            type: 'success',
            message: t(gardenData.language).appSharedGardenLoaded
          });
          return;
        }

        const parsed = initialGuildUrl;
        if (parsed) {
          if (parsed.soil) setSelectedSoil(parsed.soil);
          if (parsed.zone) setSelectedZone(parsed.zone);
          if (parsed.hemisphere) setHemisphere(parsed.hemisphere);
          if (parsed.language) setLanguage(parsed.language);

          setToast({
            type: 'success',
            message: t(parsed.language || language).guildLoadedFromLink
          });
          return;
        }
      }

      const saved = localStorage.getItem(STORAGE_KEY_GUILD);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.treeId) {
          const tree = STAR_TREES.find(t => t.id === data.treeId);
          if (tree) setSelectedTree(tree);
        }
        if (Array.isArray(data.plantIds)) {
          const plants = GUILD_PLANTS.filter(p => data.plantIds.includes(p.id));
          if (plants.length > 0) setSelectedPlants(plants);
        }
        if (isHemisphere(data.hemisphere)) setHemisphere(data.hemisphere);
        if (isSoilType(data.soilType)) setSelectedSoil(data.soilType);
        if (isClimateZone(data.climateZone)) setSelectedZone(data.climateZone);
        if (data.treeAge === 'YOUNG' || data.treeAge === 'ESTABLISHED') setTreeAge(data.treeAge);
      }
    } catch (e) {
      console.error('Failed to load guild from storage or URL', e);
    }
  }, []);

  useEffect(() => {
    try {
      const data = {
        treeId: selectedTree.id,
        plantIds: selectedPlants.map(p => p.id),
        hemisphere,
        soilType: selectedSoil,
        climateZone: selectedZone,
        treeAge,
      };
      localStorage.setItem(STORAGE_KEY_GUILD, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save guild to storage', e);
    }
  }, [selectedTree, selectedPlants, hemisphere, selectedSoil, selectedZone, treeAge]);

  // Adding is guarded by the compatibility prefilter (compatibility.ts); removing is always allowed
  const handleTogglePlant = (plant: GuildPlant) => {
    setSelectedPlants(prev => {
      const exists = prev.some(p => p.id === plant.id);
      if (exists) {
        return prev.filter(p => p.id !== plant.id);
      } else {
        if (!isCompatibleWithGuild(plant, selectedTree, prev)) return prev;
        return [...prev, plant];
      }
    });
  };

  const handleAddPlant = (plant: GuildPlant) => {
    setSelectedPlants(prev => {
      if (prev.some(p => p.id === plant.id)) return prev;
      if (!isCompatibleWithGuild(plant, selectedTree, prev)) return prev;
      return [...prev, plant];
    });
  };

  const handleSwapPlant = (removePlantId: string, addPlant: GuildPlant) => {
    setSelectedPlants(prev => {
      const filtered = prev.filter(p => p.id !== removePlantId);
      if (filtered.some(p => p.id === addPlant.id)) return filtered;
      if (!isCompatibleWithGuild(addPlant, selectedTree, filtered)) return prev;
      return [...filtered, addPlant];
    });
  };

  const handleRemovePlant = (plant: GuildPlant) => {
    setSelectedPlants(prev => prev.filter(p => p.id !== plant.id));
  };

  const handleFilterByGap = (gap: ActiveGapFilter) => {
    setActiveGapFilter(gap);
    setActivePestFilter(null);
    scrollToGuildBuilder();
  };

  const handleClearGapFilter = () => {
    setActiveGapFilter(null);
  };

  const handleFilterByPest = (pestName: string, plantIds: string[]) => {
    setActivePestFilter({ pestName, plantIds });
    setActiveGapFilter(null);
    scrollToGuildBuilder();
  };

  const handleClearPestFilter = () => {
    setActivePestFilter(null);
  };

  // Switching the star drops companions that conflict with the new star (or with each other) and says which
  const handleSelectTree = (tree: StarTree) => {
    setSelectedTree(tree);
    setActiveGapFilter(null);
    setActivePestFilter(null);
    const { compatible, incompatible } = partitionGuildByCompatibility(tree, selectedPlants);
    if (incompatible.length > 0) {
      setSelectedPlants(compatible);
      setToast({
        type: 'success',
        message: tr.compatAutoRemovedToast
          .replace('{count}', String(incompatible.length))
          .replace('{star}', getLoc(tree.commonName, language))
          .replace('{names}', incompatible.map(x => getLoc(x.plant.commonName, language)).join(', '))
      });
    }
  };

  const handleLoadPreset = (presetName: keyof typeof PRESETS) => {
    const preset = PRESETS[presetName];
    setActiveGapFilter(null);
    setActivePestFilter(null);
    const tree = STAR_TREES.find(t => t.id === preset.treeId)!;
    setSelectedTree(tree);
    // Presets are covered by test_conflicts; the partition is a safety net against data drift
    setSelectedPlants(partitionGuildByCompatibility(tree, GUILD_PLANTS.filter(p => preset.plantIds.includes(p.id))).compatible);
  };

  const handleOpenInGardenGrid = (tree: StarTree, clusterConfig: StarPlantClusterConfig) => {
    // Same instances (positions, companion lists, id scheme) the radial plan feeds into the garden
    // pipeline (computeClusterGardenLayout), so the garden shows the layout the radial plan showed
    const instances: GardenStarPlantInstance[] = buildClusterStarInstances(
      tree,
      clusterConfig,
      selectedPlants.map(p => p.id),
      String(Date.now())
    );
    setPendingTreesToPlace(instances);
    navigateTo('/garten');
  };

  // On the garden route the toolbar actions are handled by GardenPlannerPage via window events
  const handleReset = () => {
    if (isGardenRoute) {
      window.dispatchEvent(new CustomEvent('garden-reset'));
      return;
    }
    setSelectedTree(STAR_TREES[0]);
    setSelectedPlants([]);
    setActiveGapFilter(null);
    setActivePestFilter(null);
    localStorage.removeItem(STORAGE_KEY_GUILD);
  };

  const handleExportJson = () => {
    if (isGardenRoute) {
      window.dispatchEvent(new CustomEvent('garden-export-json'));
      return;
    }
    const treeName = getLoc(selectedTree.commonName, language);
    const guildExport = {
      version: '1.0',
      title: `${treeName} Permaculture Plant Guild`,
      language,
      created: new Date().toISOString(),
      hemisphere,
      groundType: selectedSoil,
      climateZone: selectedZone,
      starTree: {
        id: selectedTree.id,
        commonName: treeName,
        botanicalName: selectedTree.botanicalName,
        matureDripLineM: selectedTree.matureRadiusM,
        sunPreference: selectedTree.sunPreference,
      },
      companionPlants: selectedPlants.map(p => ({
        id: p.id,
        commonName: getLoc(p.commonName, language),
        botanicalName: p.botanicalName,
        layer: p.layer,
        roles: p.roles,
        preferredZone: p.preferredZone,
        preferredSector: p.preferredSector,
        recommendedDistanceM: `${p.minDistanceM}–${p.maxDistanceM} m`,
      })),
    };

    const blob = new Blob([JSON.stringify(guildExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${treeName.toLowerCase().replace(/[^a-z0-9äöüß]+/gi, '_')}_guild_plan.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = async () => {
    if (isGardenRoute) {
      window.dispatchEvent(new CustomEvent('garden-export-pdf'));
      return;
    }
    try {
      const { exportGuildPlanPdf } = await import('./core/pdfExporter');
      await exportGuildPlanPdf({
        starTree: selectedTree,
        selectedPlants,
        selectedSoil,
        hemisphere,
        language,
        treeAge,
        selectedZone
      });
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      setToast({
        type: 'error',
        message: tr.appPdfError
      });
    }
  };

  const handleExportCalendar = async () => {
    if (isGardenRoute) {
      window.dispatchEvent(new CustomEvent('garden-export-cal'));
      return;
    }
    try {
      const { exportGuildCalendarIcs } = await import('./core/calendarExporter');
      exportGuildCalendarIcs({
        starTree: selectedTree,
        selectedPlants,
        selectedSoil,
        selectedZone,
        hemisphere,
        language
      });
      setToast({
        type: 'success',
        message: tr.exportCalendarSuccess
      });
    } catch (err) {
      console.error('Failed to generate Calendar .ics:', err);
      setToast({
        type: 'error',
        message: tr.appCalendarError
      });
    }
  };

  // Accepts both guild plan JSON and garden grid JSON
  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) throw new Error('Empty file content');
        const data = JSON.parse(text);

        if (Array.isArray(data.starPlants) && data.starPlants.length > 0) {
          localStorage.setItem(STORAGE_KEY_GARDEN_GRID, text);
          setGardenImportKey(k => k + 1);
          navigateTo('/garten');
          setToast({
            type: 'success',
            message: tr.appGardenPlanLoaded
          });
          return;
        }

        let matchedTree: StarTree | undefined;
        const treeId = data.starTree?.id || data.treeId;
        if (treeId) {
          matchedTree = STAR_TREES.find(t => t.id === treeId);
        }
        if (!matchedTree && data.starTree?.botanicalName) {
          const bName = String(data.starTree.botanicalName).toLowerCase().trim();
          matchedTree = STAR_TREES.find(t => t.botanicalName.toLowerCase().trim() === bName);
        }
        if (!matchedTree && data.starTree?.commonName) {
          const cName = String(data.starTree.commonName).toLowerCase().trim();
          matchedTree = STAR_TREES.find(t =>
            t.commonName.en.toLowerCase().includes(cName) ||
            t.commonName.de.toLowerCase().includes(cName)
          );
        }

        if (!matchedTree) {
          throw new Error('No recognized tree found in plan');
        }

        const resolvedPlants: GuildPlant[] = [];
        const rawPlantList = data.companionPlants || data.plants || [];
        const plantIdList: string[] = Array.isArray(data.plantIds) ? data.plantIds : [];

        plantIdList.forEach(id => {
          const found = GUILD_PLANTS.find(p => p.id === id);
          if (found && !resolvedPlants.some(p => p.id === found.id)) {
            resolvedPlants.push(found);
          }
        });

        if (Array.isArray(rawPlantList)) {
          rawPlantList.forEach((item: any) => {
            let found: GuildPlant | undefined;
            if (item.id) {
              found = GUILD_PLANTS.find(p => p.id === item.id);
            }
            if (!found && item.botanicalName) {
              const bName = String(item.botanicalName).toLowerCase().trim();
              found = GUILD_PLANTS.find(p => p.botanicalName.toLowerCase().trim() === bName);
            }
            if (!found && item.commonName) {
              const cName = String(item.commonName).toLowerCase().trim();
              found = GUILD_PLANTS.find(p =>
                p.commonName.en.toLowerCase() === cName ||
                p.commonName.de.toLowerCase() === cName
              );
            }
            if (found && !resolvedPlants.some(p => p.id === found.id)) {
              resolvedPlants.push(found);
            }
          });
        }

        const soil = data.groundType || data.soilType;
        if (isSoilType(soil)) setSelectedSoil(soil);

        const zone = data.climateZone || data.zone;
        if (isClimateZone(zone)) setSelectedZone(zone);

        if (isHemisphere(data.hemisphere)) setHemisphere(data.hemisphere);

        setSelectedTree(matchedTree);
        setSelectedPlants(resolvedPlants);
        setActiveGapFilter(null);
        setActivePestFilter(null);

        setToast({
          type: 'success',
          message: tr.importSuccess
        });
      } catch (err) {
        console.error('Failed to import plan JSON:', err);
        setToast({
          type: 'error',
          message: tr.importInvalidFormat
        });
      }
    };
    reader.onerror = () => {
      setToast({
        type: 'error',
        message: tr.importInvalidFormat
      });
    };
    reader.readAsText(file);
  };

  // Standalone view for iframe embeds
  if (currentPath.startsWith('/embed')) {
    const gardenData = typeof window !== 'undefined' ? parseGardenUrl(window.location.search) : null;
    if (gardenData && gardenData.starPlants.length > 0) {
      const { companions: embedCompanions } = resolveGardenConflicts(gardenData.starPlants, {
        hemisphere: gardenData.hemisphere,
        zone: gardenData.zone || selectedZone,
        soil: gardenData.soil || selectedSoil,
      });
      const embedLang = gardenData.language || language;
      const embedTr = t(embedLang);
      const defaultName = embedTr.appDefaultGardenName;
      const gardenCode = new URLSearchParams(window.location.search).get('garden') || '';
      return (
        <div className="min-h-screen bg-stone-950 p-2 sm:p-4 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <GardenEmbedCard
              gardenName={gardenData.gardenName || defaultName}
              starPlants={gardenData.starPlants}
              companions={embedCompanions}
              soil={gardenData.soil || selectedSoil}
              zone={gardenData.zone || selectedZone}
              language={embedLang}
              showActionBtn={true}
              actionUrl={`https://pflanzengilde.de/garten/?garden=${gardenCode}`}
            />
            <div className="mt-2 flex justify-end gap-3 text-[10px] text-stone-400">
              {Impressum && (
                <a href="/impressum" target="_blank" rel="noopener noreferrer" className="hover:text-stone-200 underline">
                  {embedTr.impressumLink}
                </a>
              )}
              {Datenschutz && (
                <a href="/datenschutz" target="_blank" rel="noopener noreferrer" className="hover:text-stone-200 underline">
                  {embedTr.appPrivacyLink}
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-stone-950 p-2 sm:p-4 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <GuildEmbedCard
            starTree={selectedTree}
            selectedPlants={selectedPlants}
            language={language}
            showActionBtn={true}
            actionUrl={`https://pflanzengilde.de/?tree=${selectedTree.id}`}
          />
          <div className="mt-2 flex justify-end gap-3 text-[10px] text-stone-400">
            {Impressum && (
              <a href="/impressum" target="_blank" rel="noopener noreferrer" className="hover:text-stone-200 underline">
                {tr.impressumLink}
              </a>
            )}
            {Datenschutz && (
              <a href="/datenschutz" target="_blank" rel="noopener noreferrer" className="hover:text-stone-200 underline">
                {tr.appPrivacyLink}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900 selection:bg-forest-200">
      <Navbar
        language={language}
        setLanguage={setLanguage}
        currentPath={currentPath}
        onNavigate={navigateTo}
        onReset={handleReset}
        onLoadPreset={handleLoadPreset}
        onExportJson={handleExportJson}
        onExportPdf={handleExportPdf}
        onExportCalendar={handleExportCalendar}
        onImportJson={handleImportJson}
        onShare={() => {
          if (isGardenRoute) {
            window.dispatchEvent(new CustomEvent('garden-share'));
          } else {
            setIsShareOpen(true);
          }
        }}
      />

      <React.Suspense fallback={<div className="flex-1 max-w-7xl w-full mx-auto px-4 py-16 text-center text-stone-500 font-medium animate-pulse">{tr.loadingFallback}</div>}>
        {Datenschutz && currentPath.startsWith('/datenschutz') ? (
          <Datenschutz
            language={language}
            setLanguage={setLanguage}
            onBack={() => navigateTo('/')}
            onNavigate={navigateTo}
          />
        ) : Impressum && currentPath.startsWith('/impressum') ? (
          <Impressum
            language={language}
            setLanguage={setLanguage}
            onBack={() => navigateTo('/')}
            onNavigate={navigateTo}
          />
        ) : currentPath.startsWith('/guides') ? (
          <Guides
            language={language}
            setLanguage={setLanguage}
            onNavigate={navigateTo}
          />
        ) : currentPath.startsWith('/credits') ? (
          <PhotoCredits language={language} />
        ) : isGardenRoute ? (
          <GardenPlannerPage
            key={gardenImportKey}
            language={language}
            selectedSoil={selectedSoil}
            selectedZone={selectedZone}
            hemisphere={hemisphere}
            treeAge={treeAge}
            onSelectTreeAge={setTreeAge}
            onNavigate={navigateTo}
            initialStarTree={selectedTree}
            initialSelectedPlants={selectedPlants}
            pendingTreesToPlace={pendingTreesToPlace}
            onClearPendingTrees={() => setPendingTreesToPlace(null)}
          />
        ) : (
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
            <SiteConditionsBar
              language={language}
              selectedSoil={selectedSoil}
              onSelectSoil={setSelectedSoil}
              selectedTree={selectedTree}
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
              hemisphere={hemisphere}
              onSelectHemisphere={setHemisphere}
              treeAge={treeAge}
              onSelectTreeAge={setTreeAge}
            />

            <StarTreeSelector
              language={language}
              selectedSoil={selectedSoil}
              selectedZone={selectedZone}
              selectedTree={selectedTree}
              onSelectTree={handleSelectTree}
              onLoadPreset={handleLoadPreset}
              onFilterByPest={handleFilterByPest}
              onNavigate={navigateTo}
            />

            <div id="guild-builder-step" className="scroll-mt-20 transition-all">
              <GuildBuilder
                language={language}
                selectedSoil={selectedSoil}
                selectedZone={selectedZone}
                selectedTree={selectedTree}
                selectedPlants={selectedPlants}
                onTogglePlant={handleTogglePlant}
                onOpenPlantModal={setModalPlant}
                activeGapFilter={activeGapFilter}
                onClearGapFilter={handleClearGapFilter}
                activePestFilter={activePestFilter}
                onClearPestFilter={handleClearPestFilter}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start content-visibility-auto">
              <div className="lg:col-span-6 space-y-6">
                <RoleCoverageCard
                  language={language}
                  selectedPlants={selectedPlants}
                />
                <SeasonalCalendar
                  language={language}
                  selectedPlants={selectedPlants}
                  currentSeason={currentSeason}
                  onSelectSeason={setCurrentSeason}
                  onAddPlant={handleAddPlant}
                  onFilterByGap={handleFilterByGap}
                  activeGapFilter={activeGapFilter}
                  onSwapPlant={handleSwapPlant}
                  onRemovePlant={handleRemovePlant}
                  selectedTree={selectedTree}
                />
              </div>

              <div className="lg:col-span-6 lg:sticky lg:top-20 space-y-4">
                <GardenPlanCanvas
                  language={language}
                  starTree={selectedTree}
                  selectedPlants={selectedPlants}
                  currentSeason={currentSeason}
                  hemisphere={hemisphere}
                  selectedSoil={selectedSoil}
                  selectedZone={selectedZone}
                  treeAge={treeAge}
                  onSelectPlant={setModalPlant}
                  onSwapPlant={handleSwapPlant}
                  onOpenInGardenGrid={handleOpenInGardenGrid}
                />
              </div>
            </div>

            <div className="content-visibility-auto">
              <AntagonistCard
                language={language}
                starTree={selectedTree}
                selectedPlants={selectedPlants}
                hemisphere={hemisphere}
              />
            </div>
          </main>
        )}
      </React.Suspense>

      <PlantDetailModal
        language={language}
        selectedSoil={selectedSoil}
        selectedTree={selectedTree}
        selectedZone={selectedZone}
        plant={modalPlant}
        onClose={() => setModalPlant(null)}
        isSelected={modalPlant ? selectedPlants.some(p => p.id === modalPlant.id) : false}
        onToggleSelect={handleTogglePlant}
        guildPlants={selectedPlants}
        onNavigate={(path) => {
          setModalPlant(null);
          navigateTo(path);
        }}
      />

      {isShareOpen && (
        <React.Suspense fallback={null}>
          <ShareGuildModal
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            starTree={selectedTree}
            selectedPlants={selectedPlants}
            selectedSoil={selectedSoil}
            selectedZone={selectedZone}
            hemisphere={hemisphere}
            language={language}
          />
        </React.Suspense>
      )}

      <footer className="mt-12 py-6 border-t border-stone-200 bg-white text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>
            {tr.footerText}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/');
              }}
              className="text-stone-500 hover:text-forest-700 underline font-medium transition-colors"
            >
              {tr.navPlanner}
            </a>
            <span className="text-stone-300">•</span>
            <a
              href="/garten"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/garten');
              }}
              className="text-stone-500 hover:text-forest-700 underline font-medium transition-colors"
            >
              {tr.navGarden}
            </a>
            <span className="text-stone-300">•</span>
            <a
              href="/guides"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/guides');
              }}
              className="text-stone-500 hover:text-forest-700 underline font-medium transition-colors"
            >
              {tr.navGuides}
            </a>
            <span className="text-stone-300">•</span>
            <a
              href="/credits"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/credits');
              }}
              className="text-stone-500 hover:text-forest-700 underline font-medium transition-colors"
            >
              {tr.photoCreditsTitle}
            </a>
            {Impressum && (
              <>
                <span className="text-stone-300">•</span>
                <a
                  href="/impressum"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/impressum');
                  }}
                  className="text-stone-500 hover:text-forest-700 underline font-medium transition-colors"
                >
                  {tr.impressumLink}
                </a>
              </>
            )}
            {Datenschutz && (
              <>
                <span className="text-stone-300">•</span>
                <a
                  href="/datenschutz"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/datenschutz');
                  }}
                  className="text-stone-500 hover:text-forest-700 underline font-medium transition-colors"
                >
                  {tr.appPrivacyLink}
                </a>
              </>
            )}
          </div>
        </div>
      </footer>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium transition-all transform animate-in slide-in-from-bottom-5 duration-300 ${
            toast.type === 'success'
              ? 'bg-forest-900 text-white border-forest-700 shadow-forest-950/20'
              : 'bg-rose-900 text-white border-rose-700 shadow-rose-950/20'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 p-1 rounded hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            aria-label={tr.closeBtn}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
