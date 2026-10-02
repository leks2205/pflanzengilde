import React, { useState, useMemo, useDeferredValue, useEffect, useRef } from 'react';
import { ClimateZone, GuildPlant, Hemisphere, Language, PhenoSeason, PlacedPlant, SoilType, StarTree, TreeAgeMode, getLoc } from '../types/guild';
import { GardenCompanionInstance, StarPlantClusterConfig } from '../types/garden';
import { autoPlaceGuildPlants, calculateSpatialMetrics, isAlliumPlant, isLegumePlant, isFennelPlant, isWormwoodPlant } from '../core/placementRules';
import { analyzeGuildSpacing } from '../core/spacingEngine';
import { computeClusterGardenLayout, getMinTrunkDistanceM, getRecommendedSpacingM } from '../core/multiStarLayout';
import { GardenSubstitution } from '../core/gardenOptimizer';
import { GUILD_PLANTS } from '../data/guildPlants';
import { readSavedAutoResolvePreference, STORAGE_KEY_GARDEN_GRID } from '../utils/gardenStorage';
import { AlertOctagon, AlertTriangle, ArrowRight, CheckCircle2, Compass, Eye, EyeOff, RefreshCw, ShieldCheck, SunMedium, Shrink, Sparkles, Trees, Layers } from 'lucide-react';
import { t, formatNumber, translateZone, translateLayer, translateRole } from '../i18n/translations';
import { PlantThumbnail } from './PlantThumbnail';
import { SpacingWarningBanner } from './SpacingWarningBanner';
import { GroundCoverLayer } from './GroundCoverLayer';
import { ShiftHint, SpotLegend, useShiftKey } from './SpotInspector';
import { plantsAtSpot } from '../core/spotInspector';
import { isCoverInSeason } from '../core/groundCoverEngine';
import { buildGardenCoverInput, buildRadialCoverInput, computeGroundCovers, coverReachM, trunkClearanceM } from '../core/groundCoverEngine';
import { isAreaPlant } from '../data/groundCoverSpecs';

interface GardenPlanCanvasProps {
  language: Language;
  starTree: StarTree;
  selectedPlants: GuildPlant[];
  currentSeason: PhenoSeason;
  hemisphere: Hemisphere;
  /** Garden soil and climate zone: used by the garden conflict resolution in multi-star mode. */
  selectedSoil?: SoilType;
  selectedZone?: ClimateZone;
  /** Planting age (bare zone around trunks for ground covers); default young. */
  treeAge?: TreeAgeMode;
  onSelectPlant: (plant: GuildPlant) => void;
  onSwapPlant?: (removePlantId: string, addPlant: GuildPlant) => void;
  onOpenInGardenGrid?: (starTree: StarTree, clusterConfig: StarPlantClusterConfig) => void;
  /** Initial multi-star configuration (default: single star). spacingM 0/absent = recommended spacing. */
  initialClusterConfig?: Partial<StarPlantClusterConfig>;
}

type ClusterShape = Omit<StarPlantClusterConfig, 'spacingM'>;

const PLANT_NAMES = new Map(GUILD_PLANTS.map(p => [p.id, p.commonName]));

export const GardenPlanCanvas: React.FC<GardenPlanCanvasProps> = ({
  language,
  starTree,
  selectedPlants,
  currentSeason,
  hemisphere,
  selectedSoil,
  selectedZone,
  treeAge = 'YOUNG',
  onSelectPlant,
  onSwapPlant,
  onOpenInGardenGrid,
  initialClusterConfig,
}) => {
  const tr = t(language);
  const [showRings, setShowRings] = useState(true);
  const [showSunOverlay, setShowSunOverlay] = useState(true);
  const [showCanopySpread, setShowCanopySpread] = useState(true);
  const [showGroundCovers, setShowGroundCovers] = useState(true);
  // Shift + hover: legend of everything growing at the hovered spot
  const shiftDown = useShiftKey();
  const mapRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState<{ px: number; py: number; vx: number; vy: number; w: number } | null>(null);
  const [hoveredPlant, setHoveredPlant] = useState<PlacedPlant | null>(null);
  const [hoveredClusterComp, setHoveredClusterComp] = useState<GardenCompanionInstance | null>(null);

  const [clusterShape, setClusterShape] = useState<ClusterShape>(() => {
    const count = Math.max(1, Math.min(6, Math.round(initialClusterConfig?.count ?? 1)));
    const pattern = initialClusterConfig?.pattern && initialClusterConfig.pattern !== 'SINGLE' ? initialClusterConfig.pattern : 'LINE';
    return {
      pattern: count === 1 ? 'SINGLE' : pattern,
      count,
      orientationDeg: initialClusterConfig?.orientationDeg ?? 90,
      ...(initialClusterConfig?.gridCols ? { gridCols: initialClusterConfig.gridCols } : {}),
    };
  });
  // A user-chosen spacing belongs to one star species; switching the star falls back to its recommendation
  const [spacingOverride, setSpacingOverride] = useState<{ treeId: string; spacingM: number } | null>(() =>
    initialClusterConfig?.spacingM && initialClusterConfig.spacingM > 0
      ? { treeId: starTree.id, spacingM: initialClusterConfig.spacingM }
      : null
  );
  const [isMultiPanelOpen, setIsMultiPanelOpen] = useState(() => (initialClusterConfig?.count ?? 1) > 1);

  const recommendedSpacing = useMemo(() => getRecommendedSpacingM(starTree), [starTree]);
  const spacingMinM = Math.max(getMinTrunkDistanceM(starTree), Number((starTree.matureRadiusM * 1.2).toFixed(1)));
  const spacingMaxM = Math.max(10.0, starTree.matureRadiusM * 3.5, recommendedSpacing.optimal);
  const spacingM = spacingOverride && spacingOverride.treeId === starTree.id
    ? spacingOverride.spacingM
    : Math.max(spacingMinM, recommendedSpacing.optimal);

  const clusterConfig = useMemo<StarPlantClusterConfig>(
    () => ({ ...clusterShape, spacingM }),
    [clusterShape, spacingM]
  );
  // Count/pattern/spacing changes re-run the garden pipeline; deferring keeps the controls responsive
  const renderedConfig = useDeferredValue(clusterConfig);
  const isMulti = renderedConfig.count > 1;

  const selectedPlantIds = useMemo(() => selectedPlants.map(p => p.id), [selectedPlants]);

  // The garden's saved "automatic conflict resolution" preference, so preview and garden agree
  // (re-read when another tab changes it; this view remounts when coming back from the garden)
  const [autoResolve, setAutoResolve] = useState<boolean>(() => readSavedAutoResolvePreference());
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === STORAGE_KEY_GARDEN_GRID) setAutoResolve(readSavedAutoResolvePreference());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Multi-star mode: the same pipeline as the garden planner (shared companions, garden conflict
  // analysis, automatic substitutions), see computeClusterGardenLayout
  const clusterLayout = useMemo(() => {
    if (renderedConfig.count <= 1) return null;
    return computeClusterGardenLayout(starTree, renderedConfig, selectedPlantIds, {
      hemisphere,
      zone: selectedZone,
      soil: selectedSoil,
      autoResolve,
    });
  }, [starTree, renderedConfig, selectedPlantIds, hemisphere, selectedZone, selectedSoil, autoResolve]);

  const metrics = useMemo(() => calculateSpatialMetrics(starTree), [starTree]);
  const placedPlants = useMemo(() => {
    return autoPlaceGuildPlants(starTree, selectedPlants, hemisphere);
  }, [starTree, selectedPlants, hemisphere]);

  const spacingReport = useMemo(() => {
    return analyzeGuildSpacing(starTree, selectedPlants, hemisphere);
  }, [starTree, selectedPlants, hemisphere]);

  // Decimal comma only in German
  const fmtM = (v: number) => formatNumber(v, 1, language);

  const viewBoxSize = 640;
  const center = viewBoxSize / 2;
  const maxPlacedR = placedPlants.length > 0 ? Math.max(...placedPlants.map(p => p.distanceM + p.plant.spreadM / 2)) : 0;
  const maxCoverR = placedPlants.length > 0 ? Math.max(0, ...placedPlants.map(p => coverReachM(starTree, p.plant))) : 0;
  const maxRadiusM = Math.max(metrics.outerZoneMaxM, maxPlacedR, maxCoverR) + 0.8;

  // Ground-cover areas (single star at the origin, metres x east / y south)
  const radialCovers = useMemo(() => {
    if (!placedPlants.some(p => isAreaPlant(p.plant))) return [];
    return computeGroundCovers(buildRadialCoverInput(starTree, placedPlants, { hemisphere, zone: selectedZone, treeAge }));
  }, [starTree, placedPlants, hemisphere, selectedZone, treeAge]);
  const scale = (viewBoxSize * 0.44) / maxRadiusM; // px per metre

  // Fit the whole cluster (zone rings, companion spreads) into the view, centred on its extent
  const clusterCovers = useMemo(() => {
    if (!clusterLayout || !clusterLayout.resolution.companions.some(c => isAreaPlant(c.plant))) return [];
    return computeGroundCovers(buildGardenCoverInput(clusterLayout.starPlants, clusterLayout.resolution.companions, {
      hemisphere, zone: selectedZone, treeAge, resolutionM: 0.08,
    }));
  }, [clusterLayout, hemisphere, selectedZone, treeAge]);

  const clusterView = useMemo(() => {
    if (!clusterLayout) return { scale: 1, cxM: 0, cyM: 0 };
    const b = clusterLayout.boundsM;
    const padPx = 44;
    const spanM = Math.max(b.maxX - b.minX, b.maxY - b.minY, 4);
    return {
      scale: (viewBoxSize - 2 * padPx) / spanM,
      cxM: (b.minX + b.maxX) / 2,
      cyM: (b.minY + b.maxY) / 2,
    };
  }, [clusterLayout]);
  const clusterScale = clusterView.scale;
  // Markers shrink with the map scale so companions at the 0.4 m trunk collar don't hide under the trunk marker
  const starMarkerR = Math.min(12, Math.max(7, 0.2 * clusterScale));
  const compMarkerR = Math.min(8, Math.max(5, 0.18 * clusterScale));

  const toCoords = (distanceM: number, angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: center + distanceM * scale * Math.cos(rad),
      y: center + distanceM * scale * Math.sin(rad),
    };
  };

  const toClusterCoords = (xM: number, yM: number) => {
    return {
      x: center + (xM - clusterView.cxM) * clusterScale,
      y: center + (yM - clusterView.cyM) * clusterScale,
    };
  };

  // Derived drawing data for the cluster (memoized: only changes with the layout)
  const clusterDerived = useMemo(() => {
    if (!clusterLayout) return null;
    const stars = clusterLayout.starPlants;
    const starIndex = new Map(stars.map((s, i) => [s.instanceId, i]));
    const starById = new Map(stars.map(s => [s.instanceId, s]));

    // Dimension lines only between nearest neighbours (no diagonal row wrap-arounds in grids)
    let minDist = Infinity;
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        minDist = Math.min(minDist, Math.hypot(stars[j].xM - stars[i].xM, stars[j].yM - stars[i].yM));
      }
    }
    const neighbourLinks: { a: number; b: number; distM: number }[] = [];
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const d = Math.hypot(stars[j].xM - stars[i].xM, stars[j].yM - stars[i].yM);
        if (d <= minDist * 1.05 + 0.01) neighbourLinks.push({ a: i, b: j, distM: d });
      }
    }

    // Companions added by an automatic substitution, keyed `${plantId}@${starInstanceId}`
    const substituteOf = new Map<string, GardenSubstitution>();
    for (const sub of clusterLayout.resolution.substitutions) {
      for (const pid of sub.addedPlantIds) {
        for (const tid of sub.servedTreeIds) substituteOf.set(`${pid}@${tid}`, sub);
      }
    }
    const findSubstitution = (comp: GardenCompanionInstance) => {
      for (const tid of comp.servicingTreeIds) {
        const sub = substituteOf.get(`${comp.plantId}@${tid}`);
        if (sub) return sub;
      }
      return null;
    };

    return { starIndex, starById, neighbourLinks, findSubstitution };
  }, [clusterLayout]);

  const starLabel = (instanceId: string) => {
    const idx = clusterDerived?.starIndex.get(instanceId);
    return idx === undefined ? instanceId : `#${idx + 1}`;
  };
  const plantName = (id: string | null) => {
    const name = id ? PLANT_NAMES.get(id) : undefined;
    return name ? getLoc(name, language) : id ?? '';
  };

  const getSeasonalPlantStyle = (plant: GuildPlant) => {
    const isFlowering = plant.seasonalActivity.floweringSeasons.includes(currentSeason);
    const hasFoliage = plant.seasonalActivity.foliageSeasons.includes(currentSeason);

    if (currentSeason === 'WINTER') {
      if (hasFoliage) {
        return { fill: plant.color, stroke: '#047857', opacity: 0.9 };
      }
      return { fill: '#78716c', stroke: '#44403c', opacity: 0.45 };
    }

    if (currentSeason === 'AUTUMN') {
      return { fill: isFlowering ? '#f59e0b' : '#b45309', stroke: '#78350f', opacity: 0.95 };
    }

    if (isFlowering) {
      return { fill: plant.color, stroke: '#ffffff', opacity: 1.0 };
    }

    return { fill: plant.color, stroke: '#15803d', opacity: 0.85 };
  };

  const hasOptimizedResolution = useMemo(() => {
    return (
      (selectedPlants.some(isAlliumPlant) && selectedPlants.some(isLegumePlant)) ||
      (starTree.category === 'NITROGEN_FIXING_TREE' && selectedPlants.some(isAlliumPlant)) ||
      selectedPlants.some(isFennelPlant) ||
      selectedPlants.some(isWormwoodPlant)
    );
  }, [selectedPlants, starTree]);

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-sky-600" />
              {tr.canvasTitle}
            </span>
            {hasOptimizedResolution && (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200"
                title={
                  tr.gardenPlanAutoSpacedTitle
                }
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span className="hidden sm:inline">
                  {tr.gardenPlanAutoSpaced}
                </span>
              </span>
            )}
          </h3>
          <p className="text-xs text-stone-500">
            {tr.canvasSubtitle}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 self-start sm:self-end">
          <div className="flex items-center gap-1.5 text-xs flex-wrap">
            <button
              type="button"
              onClick={() => setShowRings(!showRings)}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-colors ${
                showRings ? 'bg-forest-50 border-forest-300 text-forest-800 font-medium' : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
              }`}
            >
              {showRings ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{tr.toggleZones}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSunOverlay(!showSunOverlay)}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-colors ${
                showSunOverlay ? 'bg-amber-50 border-amber-300 text-amber-900 font-medium' : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
              }`}
            >
              <SunMedium className="w-3.5 h-3.5 text-amber-500" />
              <span>{tr.toggleSun}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCanopySpread(!showCanopySpread)}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-colors ${
                showCanopySpread ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium' : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
              }`}
              title={tr.gardenPlanToggleCanopyTitle}
            >
              <Shrink className="w-3.5 h-3.5 text-emerald-600" />
              <span>{tr.spacingToggleCanopy}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowGroundCovers(!showGroundCovers)}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-colors ${
                showGroundCovers ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium' : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
              }`}
              title={tr.groundCoverLegendHint}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>{tr.showGroundCovers}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs flex-wrap justify-start sm:justify-end">
            <button
              type="button"
              onClick={() => setIsMultiPanelOpen(!isMultiPanelOpen)}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                clusterConfig.count > 1 || isMultiPanelOpen
                  ? 'bg-sky-50 border-sky-300 text-sky-900 font-bold'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
              title={tr.gardenPlanClusterTitle}
            >
              <Trees className="w-3.5 h-3.5 text-forest-600" />
              <span>
                {clusterConfig.count > 1
                  ? tr.gardenPlanStarPlantsCount.replace('{count}', String(clusterConfig.count))
                  : tr.gardenPlanMultiplePlants}
              </span>
            </button>

            {onOpenInGardenGrid && (
              <button
                type="button"
                onClick={() => onOpenInGardenGrid(starTree, clusterConfig)}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                title={tr.gardenPlanOpenInGridTitle}
              >
                <span>{tr.gardenPlanOpenInGrid}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {isMultiPanelOpen && (
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-bold text-stone-800 flex items-center gap-1.5">
              <Trees className="w-4 h-4 text-forest-600" />
              <span>{tr.gardenPlanNumberOfStarPlants}</span>
            </div>
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-stone-200">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={clusterConfig.count === n}
                  onClick={() => setClusterShape(prev => ({
                    ...prev,
                    count: n,
                    pattern: n === 1 ? 'SINGLE' : (prev.pattern === 'SINGLE' ? 'LINE' : prev.pattern)
                  }))}
                  className={`w-7 h-7 rounded-md font-bold text-xs transition-colors cursor-pointer ${
                    clusterConfig.count === n
                      ? 'bg-forest-600 text-white shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {clusterConfig.count > 1 && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-200">
                <span className="font-bold text-stone-700">
                  {tr.gardenPlanLayoutPattern}
                </span>
                <div className="flex items-center gap-1.5">
                  {([
                    ['LINE', tr.gardenPlanPatternLine],
                    ['GRID', tr.gardenPlanPatternGrid],
                    ['TRIANGLE', tr.gardenPlanPatternTriangle],
                  ] as const).map(([pattern, label]) => (
                    <button
                      key={pattern}
                      type="button"
                      aria-pressed={clusterConfig.pattern === pattern}
                      onClick={() => setClusterShape(prev => ({ ...prev, pattern }))}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-semibold cursor-pointer ${
                        clusterConfig.pattern === pattern
                          ? 'bg-white border-forest-500 text-forest-800 shadow-xs'
                          : 'border-stone-200 text-stone-600 hover:bg-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1 border-t border-stone-200">
                <span className="font-bold text-stone-700">
                  {tr.gardenPlanPlantSpacing}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={spacingMinM}
                    max={spacingMaxM}
                    step={0.1}
                    value={spacingM}
                    onChange={e => setSpacingOverride({ treeId: starTree.id, spacingM: parseFloat(e.target.value) })}
                    className="w-32 accent-forest-600 cursor-pointer"
                    aria-label={tr.gardenPlanPlantSpacing}
                  />
                  <span className="font-mono font-bold text-stone-800 min-w-[3.5rem] text-right">
                    {fmtM(spacingM)} m
                  </span>
                </div>
              </div>

              {clusterLayout && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {tr.gardenPlanSavings
                        .replace('{optimized}', String(clusterLayout.resolution.stats.companionPlantCount))
                        .replace('{unoptimized}', String(clusterLayout.resolution.stats.unoptimizedCompanionCount))
                        .replace('{percent}', String(clusterLayout.resolution.stats.savingsPercent))}
                    </span>
                  </div>
                  {onOpenInGardenGrid && (
                    <button
                      type="button"
                      onClick={() => onOpenInGardenGrid(starTree, clusterConfig)}
                      className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shrink-0 transition-colors cursor-pointer self-end sm:self-auto"
                    >
                      <span>{tr.gardenPlanOpenInGardenGrid}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}


      <div
        ref={mapRef}
        className="relative w-full aspect-square max-w-[580px] mx-auto bg-stone-900/5 rounded-2xl overflow-hidden border border-stone-200 flex items-center justify-center"
        onMouseMove={e => {
          const box = mapRef.current?.getBoundingClientRect();
          if (!box || !e.shiftKey) { if (spot) setSpot(null); return; }
          const px = e.clientX - box.left;
          const py = e.clientY - box.top;
          setSpot({ px, py, vx: (px / box.width) * viewBoxSize, vy: (py / box.height) * viewBoxSize, w: box.width });
        }}
        onMouseLeave={() => setSpot(null)}
      >
        <svg
          id="radial-garden-map-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className="w-full h-full select-none touch-manipulation"
        >
          <defs>
            <radialGradient id="sunGradient" cx="50%" cy="85%" r="70%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#fef08a" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="canopyGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#15803d" stopOpacity="0.3" />
              <stop offset="85%" stopColor="#166534" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#14532d" stopOpacity="0.05" />
            </radialGradient>

            <radialGradient id="shadeGradient" cx="50%" cy="15%" r="70%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width={viewBoxSize} height={viewBoxSize} fill="#fafaf9" />

          <line x1={center} y1={25} x2={center} y2={viewBoxSize - 25} stroke="#e7e5e4" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={25} y1={center} x2={viewBoxSize - 25} y2={center} stroke="#e7e5e4" strokeWidth="1" strokeDasharray="3 3" />

          {showSunOverlay && (
            <>
              {hemisphere === 'NORTHERN' ? (
                <>
                  <rect width={viewBoxSize} height={viewBoxSize} fill="url(#sunGradient)" />
                  <rect width={viewBoxSize} height={viewBoxSize} fill="url(#shadeGradient)" />
                </>
              ) : (
                <g transform={`rotate(180 ${center} ${center})`}>
                  <rect width={viewBoxSize} height={viewBoxSize} fill="url(#sunGradient)" />
                  <rect width={viewBoxSize} height={viewBoxSize} fill="url(#shadeGradient)" />
                </g>
              )}
            </>
          )}

          {!isMulti && (
            <>
              {/* Ladder / harvest path wedge */}
              {(() => {
                const r = metrics.outerZoneMaxM * scale;
                const rad1 = ((metrics.ladderSectorStartDeg - 90) * Math.PI) / 180;
                const rad2 = ((metrics.ladderSectorEndDeg - 90) * Math.PI) / 180;
                const x1 = center + r * Math.cos(rad1);
                const y1 = center + r * Math.sin(rad1);
                const x2 = center + r * Math.cos(rad2);
                const y2 = center + r * Math.sin(rad2);
                const pathData = `M ${center} ${center} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;

                return (
                  <g>
                    <path d={pathData} fill="#f5f5f4" stroke="#d6d3d1" strokeDasharray="3 3" opacity="0.8" />
                    <text
                      x={center - 70}
                      y={center + 110}
                      fill="#a8a29e"
                      fontSize="9"
                      fontFamily="sans-serif"
                      fontWeight="600"
                      transform={`rotate(-45 ${center - 70} ${center + 110})`}
                    >
                      {tr.ladderPath}
                    </text>
                  </g>
                );
              })()}

          {showRings && (
            <g>
              <circle
                cx={center}
                cy={center}
                r={metrics.outerZoneMaxM * scale}
                fill="none"
                stroke="#d6d3d1"
                strokeWidth="1.25"
                strokeDasharray="4 4"
              />

              <circle
                cx={center}
                cy={center}
                r={metrics.dripZoneOuterM * scale}
                fill="#10b981"
                fillOpacity="0.10"
                stroke="#059669"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <text
                x={center}
                y={center - metrics.dripZoneOuterM * scale + 13}
                textAnchor="middle"
                fill="#047857"
                fontSize="8.5"
                fontFamily="sans-serif"
                fontWeight="bold"
                className="select-none pointer-events-none"
              >
                Zone 3
              </text>

              <circle
                cx={center}
                cy={center}
                r={metrics.dripLineM * scale}
                fill="url(#canopyGradient)"
                stroke="#16a34a"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
              <text
                x={center + metrics.dripLineM * scale + 6}
                y={center - 8}
                fill="#15803d"
                fontSize="10"
                fontFamily="sans-serif"
                fontWeight="bold"
                className="select-none pointer-events-none drop-shadow-xs"
              >
                {tr.dripLineM} ({fmtM(starTree.matureRadiusM)} m)
              </text>

              <circle
                cx={center}
                cy={center}
                r={metrics.midZoneOuterM * scale}
                fill="#0284c7"
                fillOpacity="0.12"
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={center}
                y={center - metrics.midZoneOuterM * scale + 12}
                textAnchor="middle"
                fill="#0369a1"
                fontSize="8"
                fontFamily="sans-serif"
                fontWeight="bold"
                className="select-none pointer-events-none"
              >
                Zone 2 ({fmtM(1)}–{fmtM(metrics.midZoneOuterM)} m)
              </text>

              <circle
                cx={center}
                cy={center}
                r={metrics.bulbRingOuterM * scale}
                fill="#f59e0b"
                fillOpacity="0.16"
                stroke="#d97706"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <text
                x={center}
                y={center - metrics.bulbRingOuterM * scale + 10}
                textAnchor="middle"
                fill="#b45309"
                fontSize="7.5"
                fontFamily="sans-serif"
                fontWeight="bold"
                className="select-none pointer-events-none"
              >
                Zone 1 ({fmtM(0.3)}–{fmtM(1)} m)
              </text>

              <circle
                cx={center}
                cy={center}
                r={metrics.collarRadiusM * scale}
                fill="#ef4444"
                fillOpacity="0.45"
                stroke="#dc2626"
                strokeWidth="2"
                strokeDasharray="3 2"
              />

              {[1, 2, 3, 4, 5, 6].filter(m => m <= metrics.outerZoneMaxM).map(m => {
                const tickX = center + m * scale;
                return (
                  <g key={m} className="pointer-events-none select-none">
                    <line
                      x1={tickX}
                      y1={center - 4}
                      x2={tickX}
                      y2={center + 4}
                      stroke="#44403c"
                      strokeWidth="1.5"
                    />
                    <text
                      x={tickX}
                      y={center + 14}
                      fill="#57534e"
                      fontSize="8"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {m}m
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </>
      )}

          <text x={center} y={22} textAnchor="middle" fill="#0369a1" fontSize="12" fontWeight="bold">
            {hemisphere === 'NORTHERN' ? tr.northShade : tr.northSun}
          </text>
          <text x={center} y={viewBoxSize - 10} textAnchor="middle" fill="#b45309" fontSize="12" fontWeight="bold">
            {hemisphere === 'NORTHERN' ? tr.southSun : tr.southShade}
          </text>
          <text x={viewBoxSize - 18} y={center + 4} textAnchor="end" fill="#78716c" fontSize="11" fontWeight="bold">
            {tr.eastMorning}
          </text>
          <text x={18} y={center + 4} textAnchor="start" fill="#78716c" fontSize="11" fontWeight="bold">
            {tr.westWind}
          </text>

          {!isMulti ? (
            <>
              <g>
                <circle
                  cx={center}
                  cy={center}
                  r={12}
                  fill={starTree.color}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="shadow-md"
                />
                <text
                  x={center}
                  y={center + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="9"
                  fontWeight="bold"
                >
                  ★
                </text>
                <text
                  x={center}
                  y={center - 16}
                  textAnchor="middle"
                  fill="#1c1917"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {getLoc(starTree.commonName, language)}
                </text>
                <text
                  x={center}
                  y={center + 24}
                  textAnchor="middle"
                  fill="#ef4444"
                  fontSize="8"
                  fontWeight="600"
                >
                  {tr.keepCollarBare.replace('{m}', `${formatNumber(trunkClearanceM(starTree, treeAge), 2, language)} m`)}
                </text>
              </g>

              {showGroundCovers && (
                <GroundCoverLayer
                  shapes={radialCovers}
                  toPx={(xM, yM) => ({ x: center + xM * scale, y: center + yM * scale })}
                  scale={scale}
                  season={currentSeason}
                />
              )}

              {showCanopySpread && (
                <g id="canopy-spreads" className="pointer-events-none select-none">
                  {placedPlants.filter(placed => !showGroundCovers || !isAreaPlant(placed.plant)).map((placed) => {
                    const coords = toCoords(placed.distanceM, placed.angleDeg);
                    const radiusPx = (placed.plant.spreadM / 2) * scale;
                    const conflict = spacingReport.conflicts.find(
                      c => c.plantA.instanceId === placed.instanceId || c.plantB.instanceId === placed.instanceId
                    );
                    const isCritical = conflict?.severity === 'CRITICAL';
                    const isConflict = Boolean(conflict);

                    return (
                      <g key={`canopy-${placed.instanceId}`}>
                        <circle
                          cx={coords.x}
                          cy={coords.y}
                          r={radiusPx}
                          fill={placed.plant.color}
                          fillOpacity={isConflict ? (isCritical ? 0.28 : 0.2) : 0.09}
                          stroke={isConflict ? (isCritical ? '#dc2626' : '#d97706') : placed.plant.color}
                          strokeWidth={isConflict ? (isCritical ? 2 : 1.5) : 1}
                          strokeDasharray={isConflict ? '4 2' : '2 2'}
                          strokeOpacity={isConflict ? 0.9 : 0.45}
                        />
                      </g>
                    );
                  })}
                </g>
              )}

              {placedPlants.map((placed) => {
                const coords = toCoords(placed.distanceM, placed.angleDeg);
                const style = getSeasonalPlantStyle(placed.plant);
                const isHovered = hoveredPlant?.instanceId === placed.instanceId;
                const localizedName = getLoc(placed.plant.commonName, language);

                return (
                  <g
                    key={placed.instanceId}
                    transform={`translate(${coords.x}, ${coords.y})`}
                    className="cursor-pointer touch-manipulation"
                    onMouseEnter={() => setHoveredPlant(placed)}
                    onMouseLeave={() => setHoveredPlant(null)}
                    onClick={() => onSelectPlant(placed.plant)}
                  >
                    <circle r="22" fill="transparent" className="cursor-pointer" />
                    {isHovered && (
                      <circle
                        r={16}
                        fill="none"
                        stroke="#15803d"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                        opacity="0.85"
                      />
                    )}
                    <circle
                      r={isHovered ? 12 : 9}
                      fill={style.fill}
                      stroke={isHovered ? '#ffffff' : style.stroke}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      opacity={style.opacity}
                      className="transition-all duration-150"
                    />
                    {placed.plant.seasonalActivity.floweringSeasons.includes(currentSeason) && (
                      <circle
                        r={isHovered ? 4 : 3}
                        fill="#ffffff"
                        stroke={style.fill}
                        strokeWidth="1"
                      />
                    )}
                    <text
                      y={isHovered ? 18 : 16}
                      textAnchor="middle"
                      fill="#1c1917"
                      fontSize={isHovered ? "10" : "9"}
                      fontWeight={isHovered ? "bold" : "600"}
                      className="pointer-events-none drop-shadow-xs"
                    >
                      {localizedName}
                    </text>
                  </g>
                );
              })}
            </>
          ) : clusterLayout && clusterDerived && (
            <>
              {/* Canopy-overlap shade pockets (as in the garden grid) */}
              <g id="cluster-shade-pockets" className="pointer-events-none select-none">
                {clusterLayout.shadePockets.map(pocket => {
                  const pos = toClusterCoords(pocket.xM, pocket.yM);
                  return (
                    <circle
                      key={pocket.id}
                      cx={pos.x}
                      cy={pos.y}
                      r={pocket.radiusM * clusterScale}
                      fill="#0284c7"
                      fillOpacity="0.07"
                      stroke="#3b82f6"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      strokeOpacity="0.4"
                    />
                  );
                })}
              </g>

              {/* Per-star planting zones, layered by zone so overlapping guilds read cleanly */}
              <g id="cluster-star-zones" className="pointer-events-none select-none">
                {showRings && clusterLayout.starPlants.map(star => {
                  const c = toClusterCoords(star.xM, star.yM);
                  return (
                    <circle
                      key={`zone3-${star.instanceId}`}
                      cx={c.x}
                      cy={c.y}
                      r={metrics.dripZoneOuterM * clusterScale}
                      fill="#10b981"
                      fillOpacity="0.06"
                      stroke="#059669"
                      strokeWidth="1"
                      strokeDasharray="5 4"
                      strokeOpacity="0.6"
                    />
                  );
                })}
                {clusterLayout.starPlants.map(star => {
                  const c = toClusterCoords(star.xM, star.yM);
                  return (
                    <circle
                      key={`canopy-${star.instanceId}`}
                      cx={c.x}
                      cy={c.y}
                      r={metrics.dripLineM * clusterScale}
                      fill="url(#canopyGradient)"
                      stroke="#16a34a"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                    />
                  );
                })}
                {showRings && clusterLayout.starPlants.map(star => {
                  const c = toClusterCoords(star.xM, star.yM);
                  return (
                    <g key={`inner-zones-${star.instanceId}`}>
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r={metrics.midZoneOuterM * clusterScale}
                        fill="#0284c7"
                        fillOpacity="0.08"
                        stroke="#0284c7"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        strokeOpacity="0.7"
                      />
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r={metrics.bulbRingOuterM * clusterScale}
                        fill="#f59e0b"
                        fillOpacity="0.12"
                        stroke="#d97706"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />
                    </g>
                  );
                })}
                {clusterLayout.starPlants.map(star => {
                  const c = toClusterCoords(star.xM, star.yM);
                  return (
                    <circle
                      key={`collar-${star.instanceId}`}
                      cx={c.x}
                      cy={c.y}
                      r={Math.max(metrics.collarRadiusM * clusterScale, 2)}
                      fill="#ef4444"
                      fillOpacity="0.35"
                      stroke="#dc2626"
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                    />
                  );
                })}
              </g>

              {/* Spacing dimension lines between nearest neighbours */}
              <g id="cluster-links" className="pointer-events-none select-none">
                {clusterDerived.neighbourLinks.map(link => {
                  const a = clusterLayout.starPlants[link.a];
                  const b = clusterLayout.starPlants[link.b];
                  const p1 = toClusterCoords(a.xM, a.yM);
                  const p2 = toClusterCoords(b.xM, b.yM);
                  const midX = (p1.x + p2.x) / 2;
                  const midY = (p1.y + p2.y) / 2;
                  return (
                    <g key={`cluster-link-${link.a}-${link.b}`}>
                      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#15803d" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6" />
                      <rect x={midX - 22} y={midY - 8} width="44" height="16" rx="4" fill="#ffffff" fillOpacity="0.9" stroke="#cbd5e1" strokeWidth="1" />
                      <text x={midX} y={midY + 3.5} textAnchor="middle" fill="#15803d" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif">
                        {fmtM(link.distM)} m
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Service links: which stars a shared companion serves */}
              <g id="cluster-service-links" className="pointer-events-none select-none">
                {clusterLayout.resolution.companions.map(comp => {
                  const isHovered = hoveredClusterComp?.instanceId === comp.instanceId;
                  if (!comp.isMerged && !isHovered) return null;
                  const cp = toClusterCoords(comp.xM, comp.yM);
                  return comp.servicingTreeIds.map(tid => {
                    const star = clusterDerived.starById.get(tid);
                    if (!star) return null;
                    const sp = toClusterCoords(star.xM, star.yM);
                    return (
                      <line
                        key={`svc-${comp.instanceId}-${tid}`}
                        x1={cp.x}
                        y1={cp.y}
                        x2={sp.x}
                        y2={sp.y}
                        stroke="#059669"
                        strokeWidth={isHovered ? 1.5 : 0.8}
                        strokeDasharray="2 3"
                        opacity={isHovered ? 0.9 : 0.35}
                      />
                    );
                  });
                })}
              </g>

              <g id="cluster-star-trees">
                {clusterLayout.starPlants.map((star, idx) => {
                  const coords = toClusterCoords(star.xM, star.yM);
                  return (
                    <g key={`cluster-tree-${star.instanceId}`} data-star-instance={star.instanceId}>
                      <circle cx={coords.x} cy={coords.y} r={starMarkerR} fill={starTree.color} stroke="#ffffff" strokeWidth="2" className="shadow-md" />
                      <text x={coords.x} y={coords.y + starMarkerR * 0.33} textAnchor="middle" fill="#ffffff" fontSize={Math.round(starMarkerR * 0.75)} fontWeight="bold">
                        ★
                      </text>
                      <text x={coords.x} y={coords.y - starMarkerR - 4} textAnchor="middle" fill="#1c1917" fontSize="9.5" fontWeight="bold" className="drop-shadow-xs">
                        {getLoc(starTree.commonName, language)} #{idx + 1}
                      </text>
                    </g>
                  );
                })}
              </g>

              {showGroundCovers && (
                <GroundCoverLayer
                  id="cluster-ground-covers"
                  shapes={clusterCovers}
                  toPx={toClusterCoords}
                  scale={clusterScale}
                  season={currentSeason}
                />
              )}

              {showCanopySpread && (
                <g id="cluster-canopy-spreads" className="pointer-events-none select-none">
                  {clusterLayout.resolution.companions.filter(comp => !showGroundCovers || !isAreaPlant(comp.plant)).map(comp => {
                    const coords = toClusterCoords(comp.xM, comp.yM);
                    return (
                      <circle
                        key={`cluster-spread-${comp.instanceId}`}
                        cx={coords.x}
                        cy={coords.y}
                        r={(comp.plant.spreadM / 2) * clusterScale}
                        fill={comp.plant.color}
                        fillOpacity={0.1}
                        stroke={comp.plant.color}
                        strokeWidth={1}
                        strokeDasharray="2 2"
                        strokeOpacity={0.5}
                      />
                    );
                  })}
                </g>
              )}

              {/* Unresolved garden conflicts (as in the garden grid) */}
              <g id="cluster-conflicts" className="pointer-events-none select-none">
                {clusterLayout.resolution.unresolved.map(c => {
                  const posA = toClusterCoords(c.plantA.xM, c.plantA.yM);
                  const posB = toClusterCoords(c.plantB.xM, c.plantB.yM);
                  const midX = (posA.x + posB.x) / 2;
                  const midY = (posA.y + posB.y) / 2;
                  const isCritical = c.severity === 'CRITICAL';
                  return (
                    <g key={c.id}>
                      <line
                        x1={posA.x}
                        y1={posA.y}
                        x2={posB.x}
                        y2={posB.y}
                        stroke={isCritical ? '#ef4444' : '#f59e0b'}
                        strokeWidth={isCritical ? 2 : 1.5}
                        strokeDasharray="4 4"
                        opacity="0.85"
                      />
                      <circle cx={midX} cy={midY} r="8" fill={isCritical ? '#fee2e2' : '#fef3c7'} stroke={isCritical ? '#dc2626' : '#d97706'} strokeWidth="1" />
                      <text x={midX} y={midY + 3} textAnchor="middle" fontSize="8" fontWeight="bold" fill={isCritical ? '#b91c1c' : '#b45309'}>
                        !
                      </text>
                    </g>
                  );
                })}
              </g>

              <g id="cluster-companions">
                {clusterLayout.resolution.companions.map(comp => {
                  const coords = toClusterCoords(comp.xM, comp.yM);
                  const style = getSeasonalPlantStyle(comp.plant);
                  const isHovered = hoveredClusterComp?.instanceId === comp.instanceId;
                  const isShared = comp.isMerged || comp.servicingTreeIds.length > 1;
                  const isSubstitute = Boolean(clusterDerived.findSubstitution(comp));
                  const showLabel = isHovered || clusterLayout.resolution.companions.length <= 40;

                  return (
                    <g
                      key={comp.instanceId}
                      data-companion={comp.plantId}
                      transform={`translate(${coords.x}, ${coords.y})`}
                      className="cursor-pointer touch-manipulation"
                      onMouseEnter={() => setHoveredClusterComp(comp)}
                      onMouseLeave={() => setHoveredClusterComp(null)}
                      onClick={() => onSelectPlant(comp.plant)}
                    >
                      <circle r="18" fill="transparent" className="cursor-pointer" />

                      {isShared && (
                        <circle r={compMarkerR + (isHovered ? 7 : 4)} fill="none" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8" />
                      )}

                      {isHovered && (
                        <circle r={16} fill="none" stroke="#15803d" strokeWidth="2" strokeDasharray="3 3" opacity="0.85" />
                      )}

                      <circle
                        r={isHovered ? compMarkerR + 3 : compMarkerR}
                        fill={style.fill}
                        stroke={isHovered ? '#ffffff' : style.stroke}
                        strokeWidth={isHovered ? 2 : 1.5}
                        opacity={style.opacity}
                        className="transition-all duration-150"
                      />

                      {comp.plant.seasonalActivity.floweringSeasons.includes(currentSeason) && (
                        <circle r={compMarkerR * (isHovered ? 0.45 : 0.32)} fill="#ffffff" stroke={style.fill} strokeWidth="1" />
                      )}

                      {isSubstitute && (
                        <g transform={`translate(${compMarkerR}, ${-compMarkerR})`}>
                          <circle r="4.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
                          <text y="2.5" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#ffffff">↻</text>
                        </g>
                      )}

                      {showLabel && (
                        <text
                          y={compMarkerR + (isHovered ? 10 : 8)}
                          textAnchor="middle"
                          fill="#1c1917"
                          fontSize={isHovered ? '9.5' : '8.5'}
                          fontWeight={isHovered ? 'bold' : '600'}
                          className="pointer-events-none drop-shadow-xs"
                        >
                          {getLoc(comp.plant.commonName, language)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </>
          )}
        </svg>

        {shiftDown && spot && (() => {
          const xM = isMulti ? (spot.vx - center) / clusterScale + clusterView.cxM : (spot.vx - center) / scale;
          const yM = isMulti ? (spot.vy - center) / clusterScale + clusterView.cyM : (spot.vy - center) / scale;
          const entries = isMulti && clusterLayout
            ? plantsAtSpot({
                xM, yM,
                stars: clusterLayout.starPlants.map(st => ({ key: st.instanceId, xM: st.xM, yM: st.yM, star: st.starTree })),
                plants: clusterLayout.resolution.companions.map(c => ({ key: c.instanceId, xM: c.xM, yM: c.yM, plant: c.plant })),
                covers: showGroundCovers ? clusterCovers : [],
                isInSeason: sh => isCoverInSeason(sh.spec, currentSeason),
                pickRadiusM: 12 / clusterScale,
              })
            : plantsAtSpot({
                xM, yM,
                stars: [{ key: 'star', xM: 0, yM: 0, star: starTree }],
                plants: placedPlants.map(p => {
                  const rad = ((p.angleDeg - 90) * Math.PI) / 180;
                  return { key: p.instanceId, xM: p.distanceM * Math.cos(rad), yM: p.distanceM * Math.sin(rad), plant: p.plant };
                }),
                covers: showGroundCovers ? radialCovers : [],
                isInSeason: sh => isCoverInSeason(sh.spec, currentSeason),
                pickRadiusM: 12 / scale,
              });
          const subtitle = isMulti ? undefined : tr.spotFromTrunk.replace('{m}', formatNumber(Math.hypot(xM, yM), 1, language));
          return <SpotLegend language={language} entries={entries} x={spot.px} y={spot.py} containerWidth={spot.w} subtitle={subtitle} />;
        })()}

        {!(shiftDown && spot) && (hoveredPlant || (hoveredClusterComp && clusterLayout)) && (() => {
          const plant = hoveredPlant ? hoveredPlant.plant : hoveredClusterComp!.plant;
          const coords = hoveredPlant
            ? toCoords(hoveredPlant.distanceM, hoveredPlant.angleDeg)
            : toClusterCoords(hoveredClusterComp!.xM, hoveredClusterComp!.yM);
          const isTopLeft = coords.x < center && coords.y < center;
          const posClass = isTopLeft ? 'bottom-4 left-4' : 'top-4 left-4';
          const isShared = Boolean(hoveredClusterComp && (hoveredClusterComp.isMerged || hoveredClusterComp.servicingTreeIds.length > 1));
          const substitution = hoveredClusterComp && clusterDerived ? clusterDerived.findSubstitution(hoveredClusterComp) : null;

          return (
            <div className={`absolute ${posClass} z-30 max-w-sm bg-stone-900/95 text-white p-3.5 rounded-xl shadow-xl backdrop-blur-xs text-xs animate-in fade-in pointer-events-none border border-stone-700/80`}>
              <div className="flex items-start gap-2.5 border-b border-stone-700 pb-2 mb-2">
                <PlantThumbnail
                  src={plant.imageUrl}
                  alt={getLoc(plant.commonName, language)}
                  fallbackText={getLoc(plant.commonName, language).substring(0, 2)}
                  fallbackColor={plant.color}
                  className="w-12 h-12"
                  roundedClassName="rounded-lg ring-1 ring-stone-600"
                  targetSize={120}
                  priority="low"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-forest-300 leading-snug truncate">
                    {getLoc(plant.commonName, language)}
                  </div>
                  <div className="text-[10px] text-stone-400 italic truncate">
                    {plant.botanicalName}
                  </div>
                  <div className="text-[10px] text-stone-300 mt-0.5">
                    {hoveredPlant ? (
                      <>
                        <strong>{fmtM(hoveredPlant.distanceM)} m</strong> {tr.fromTrunk} ({translateZone(hoveredPlant.zone, language)})
                      </>
                    ) : (
                      <>
                        {isShared ? (
                          <span className="text-emerald-400 font-semibold">
                            ✨ {tr.gardenPlanSharedByTrees.replace('{count}', String(hoveredClusterComp!.servicingTreeIds.length))}
                            {' '}({hoveredClusterComp!.servicingTreeIds.map(starLabel).join(', ')})
                          </span>
                        ) : (
                          <span className="text-stone-300">
                            {getLoc(starTree.commonName, language)} {hoveredClusterComp!.servicingTreeIds.map(starLabel).join(', ')}
                            {' · '}{fmtM(hoveredClusterComp!.xM)} m, {fmtM(hoveredClusterComp!.yM)} m
                          </span>
                        )}
                        {substitution && (
                          <div className="text-sky-300 font-semibold mt-0.5">
                            ↻ {tr.gardenPlanSubstituteTooltip
                              .replace('{plant}', plantName(substitution.removedPlantId))
                              .replace('{reason}', getLoc(substitution.reason, language))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1 text-[11px] text-stone-300">
                <div>{tr.layer}: <span className="text-forest-400">{translateLayer(plant.layer, language)}</span></div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {plant.roles.map(r => (
                    <span key={r} className="px-1.5 py-0.5 rounded bg-forest-950 text-forest-200 text-[9px]">
                      {translateRole(r, language)}
                    </span>
                  ))}
                </div>
                <p className="mt-1 text-[10px] text-stone-400 leading-tight">
                  {getLoc(plant.notes, language)}
                </p>
              </div>
            </div>
          );
        })()}
      </div>

      <ShiftHint language={language} className="justify-center -mt-1" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-100 text-[11px] text-stone-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block border border-rose-600" />
          <span>{tr.legendCollar}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block border border-amber-500" />
          <span>{tr.legendBulb}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-400/80 inline-block border border-blue-500" />
          <span>{tr.legendMid}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block border border-emerald-700" />
          <span>{tr.legendDrip}</span>
        </div>
        {isMulti && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full inline-block border-2 border-dashed border-emerald-600" />
              <span>{tr.gardenPlanLegendShared}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-600 inline-flex items-center justify-center text-[8px] text-white font-bold">↻</span>
              <span>{tr.gardenPlanLegendSubstituted}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 border-t-2 border-dashed border-rose-500 inline-block" />
              <span>{tr.gardenPlanLegendConflict}</span>
            </div>
          </>
        )}
      </div>

      {isMulti && clusterLayout ? (
        <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 text-xs space-y-2.5" id="radial-cluster-garden-check">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-stone-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-forest-600" />
              {tr.gardenWarningsTitle}
            </span>
            {clusterLayout.resolution.unresolved.length > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-semibold text-[10px]">
                {clusterLayout.resolution.unresolved.length} {tr.gardenWarningsConflicts}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-[10px]">
                {tr.gardenWarningsInHarmony}
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-600 leading-relaxed">{tr.gardenPlanClusterGardenNote}</p>

          {clusterLayout.resolution.unresolved.length === 0 ? (
            <div className="flex items-center gap-1.5 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{tr.gardenWarningsAllHarmony}</span>
            </div>
          ) : (
            <ul className="space-y-1.5">
              {clusterLayout.resolution.unresolved.map(c => (
                <li
                  key={c.id}
                  className={`p-2 rounded-lg border flex items-start gap-1.5 ${
                    c.severity === 'CRITICAL' ? 'bg-rose-50 border-rose-200 text-rose-950' : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  {c.severity === 'CRITICAL'
                    ? <AlertOctagon className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    : <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />}
                  <div className="min-w-0">
                    <div className="font-semibold">{getLoc(c.title, language)}</div>
                    <div className="text-[11px] opacity-80">{getLoc(c.description, language)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {clusterLayout.resolution.unresolved.some(c => clusterDerived?.starById.has(c.plantA.id) && clusterDerived?.starById.has(c.plantB.id)) && (
            <p className="text-[11px] text-stone-600 leading-relaxed">{tr.gardenResolveStarStarHint}</p>
          )}

          {([
            [clusterLayout.resolution.substitutions, tr.gardenResolveHeading, tr.gardenResolveIntro],
            [clusterLayout.resolution.suggestions, tr.gardenResolveSuggestionsHeading, autoResolve ? tr.gardenResolveSuggestionsPinned : tr.gardenResolveSuggestionsOffPreview],
          ] as const).map(([subs, heading, intro]) => subs.length > 0 && (
            <div key={heading} className="space-y-1.5 pt-2 border-t border-stone-200">
              <div className="font-bold text-stone-700 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-forest-600" />
                <span>{heading}</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">{intro}</p>
              {subs.map(sub => (
                <div key={sub.id} className="p-2 rounded-lg bg-white border border-stone-200 space-y-0.5">
                  <div className="font-semibold flex flex-wrap items-center gap-1">
                    <span className="line-through decoration-stone-400 text-stone-500">{plantName(sub.removedPlantId)}</span>
                    <ArrowRight className="w-3 h-3 text-stone-400 shrink-0" />
                    <span className="text-forest-800">
                      {sub.addedPlantIds.length > 0 ? sub.addedPlantIds.map(plantName).join(' + ') : tr.gardenResolveDropped}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    {tr.gardenResolveInGuild.replace('{trees}', sub.servedTreeIds.map(starLabel).join(', '))}
                    {' · '}
                    {tr.gardenResolveReason.replace('{reason}', getLoc(sub.reason, language))}
                  </p>
                  {sub.rolesLost.length > 0 && (
                    <p className="text-[11px] text-amber-800">
                      {tr.gardenResolveRolesLost.replace('{roles}', sub.rolesLost.map(r => translateRole(r, language)).join(', '))}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <SpacingWarningBanner
          language={language}
          report={spacingReport}
          onSwapPlant={onSwapPlant}
        />
      )}
    </div>
  );
};
