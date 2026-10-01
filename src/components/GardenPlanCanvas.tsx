import React, { useState, useMemo, useEffect } from 'react';
import { GuildPlant, Hemisphere, Language, PhenoSeason, PlacedPlant, StarTree, getLoc } from '../types/guild';
import { StarPlantClusterConfig } from '../types/garden';
import { autoPlaceGuildPlants, calculateSpatialMetrics, isAlliumPlant, isLegumePlant, isFennelPlant, isWormwoodPlant } from '../core/placementRules';
import { analyzeGuildSpacing } from '../core/spacingEngine';
import { generateStarPlantCoordinates, generateClusterCompanions, getRecommendedSpacingM, ClusterCompanionResult } from '../core/multiStarLayout';
import { Compass, Eye, EyeOff, SunMedium, Shrink, Sparkles, Trees, ArrowRight } from 'lucide-react';
import { t, formatNumber, translateZone, translateLayer, translateRole } from '../i18n/translations';
import { PlantThumbnail } from './PlantThumbnail';
import { SpacingWarningBanner } from './SpacingWarningBanner';

interface GardenPlanCanvasProps {
  language: Language;
  starTree: StarTree;
  selectedPlants: GuildPlant[];
  currentSeason: PhenoSeason;
  hemisphere: Hemisphere;
  onSelectPlant: (plant: GuildPlant) => void;
  onSwapPlant?: (removePlantId: string, addPlant: GuildPlant) => void;
  onOpenInGardenGrid?: (starTree: StarTree, clusterConfig: StarPlantClusterConfig) => void;
}

export const GardenPlanCanvas: React.FC<GardenPlanCanvasProps> = ({
  language,
  starTree,
  selectedPlants,
  currentSeason,
  hemisphere,
  onSelectPlant,
  onSwapPlant,
  onOpenInGardenGrid,
}) => {
  const tr = t(language);
  const [showRings, setShowRings] = useState(true);
  const [showSunOverlay, setShowSunOverlay] = useState(true);
  const [showCanopySpread, setShowCanopySpread] = useState(true);
  const [hoveredPlant, setHoveredPlant] = useState<PlacedPlant | null>(null);
  const [hoveredClusterComp, setHoveredClusterComp] = useState<ClusterCompanionResult | null>(null);

  const [clusterConfig, setClusterConfig] = useState<StarPlantClusterConfig>(() => ({
    pattern: 'SINGLE',
    count: 1,
    spacingM: getRecommendedSpacingM(starTree).optimal,
    orientationDeg: 90,
  }));
  const [isMultiPanelOpen, setIsMultiPanelOpen] = useState(false);

  useEffect(() => {
    setClusterConfig(prev => ({
      ...prev,
      spacingM: getRecommendedSpacingM(starTree).optimal
    }));
  }, [starTree]);

  const isMulti = clusterConfig.count > 1;

  const multiCluster = useMemo(() => {
    return generateStarPlantCoordinates(starTree, clusterConfig);
  }, [starTree, clusterConfig]);

  const multiCompanions = useMemo(() => {
    return generateClusterCompanions(starTree, selectedPlants, multiCluster, hemisphere);
  }, [starTree, selectedPlants, multiCluster, hemisphere]);

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
  const maxRadiusM = Math.max(metrics.outerZoneMaxM, maxPlacedR) + 0.8;
  const scale = (viewBoxSize * 0.44) / maxRadiusM; // px per metre

  const clusterSpanM = Math.max(
    multiCluster.widthM + starTree.matureRadiusM * 2 + 1.5,
    multiCluster.heightM + starTree.matureRadiusM * 2 + 1.5,
    8
  );
  const clusterScale = (viewBoxSize * 0.74) / clusterSpanM;

  const toCoords = (distanceM: number, angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: center + distanceM * scale * Math.cos(rad),
      y: center + distanceM * scale * Math.sin(rad),
    };
  };

  const toClusterCoords = (xM: number, yM: number) => {
    return {
      x: center + xM * clusterScale,
      y: center + yM * clusterScale,
    };
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
                  onClick={() => setClusterConfig(prev => ({
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
                  <button
                    type="button"
                    onClick={() => setClusterConfig(prev => ({ ...prev, pattern: 'LINE' }))}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-semibold cursor-pointer ${
                      clusterConfig.pattern === 'LINE'
                        ? 'bg-white border-forest-500 text-forest-800 shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:bg-white'
                    }`}
                  >
                    {tr.gardenPlanPatternLine}
                  </button>
                  <button
                    type="button"
                    onClick={() => setClusterConfig(prev => ({ ...prev, pattern: 'GRID' }))}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-semibold cursor-pointer ${
                      clusterConfig.pattern === 'GRID'
                        ? 'bg-white border-forest-500 text-forest-800 shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:bg-white'
                    }`}
                  >
                    {tr.gardenPlanPatternGrid}
                  </button>
                  <button
                    type="button"
                    onClick={() => setClusterConfig(prev => ({ ...prev, pattern: 'TRIANGLE' }))}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-semibold cursor-pointer ${
                      clusterConfig.pattern === 'TRIANGLE'
                        ? 'bg-white border-forest-500 text-forest-800 shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:bg-white'
                    }`}
                  >
                    {tr.gardenPlanPatternTriangle}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1 border-t border-stone-200">
                <span className="font-bold text-stone-700">
                  {tr.gardenPlanPlantSpacing}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={Math.max(1.0, starTree.matureRadiusM * 1.2)}
                    max={Math.max(10.0, starTree.matureRadiusM * 3.5)}
                    step={0.5}
                    value={clusterConfig.spacingM || getRecommendedSpacingM(starTree).optimal}
                    onChange={e => setClusterConfig(prev => ({ ...prev, spacingM: parseFloat(e.target.value) }))}
                    className="w-32 accent-forest-600 cursor-pointer"
                  />
                  <span className="font-mono font-bold text-stone-800 min-w-[3.5rem] text-right">
                    {fmtM(clusterConfig.spacingM || getRecommendedSpacingM(starTree).optimal)} m
                  </span>
                </div>
              </div>

              {multiCompanions.savingsPercent > 0 && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {tr.gardenPlanSavings
                        .replace('{optimized}', String(multiCompanions.optimizedCount))
                        .replace('{unoptimized}', String(multiCompanions.unoptimizedCount))
                        .replace('{percent}', String(multiCompanions.savingsPercent))}
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

      <div className="relative w-full aspect-square max-w-[580px] mx-auto bg-stone-900/5 rounded-2xl overflow-hidden border border-stone-200 flex items-center justify-center">
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
                  {tr.keepCollarBare}
                </text>
              </g>

              {showCanopySpread && (
                <g id="canopy-spreads" className="pointer-events-none select-none">
                  {placedPlants.map((placed) => {
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
          ) : (
            <>
              {/* Spacing dimension lines between neighbouring trees */}
              <g id="cluster-links" className="pointer-events-none select-none">
                {multiCluster.treePoints.map((tree, i) => {
                  if (i === 0) return null;
                  const prev = multiCluster.treePoints[i - 1];
                  const p1 = toClusterCoords(prev.dxM, prev.dyM);
                  const p2 = toClusterCoords(tree.dxM, tree.dyM);
                  const midX = (p1.x + p2.x) / 2;
                  const midY = (p1.y + p2.y) / 2;
                  return (
                    <g key={`cluster-link-${i}`}>
                      <line
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke="#15803d"
                        strokeWidth="2"
                        strokeDasharray="5 3"
                        opacity="0.7"
                      />
                      <rect
                        x={midX - 24}
                        y={midY - 9}
                        width="48"
                        height="18"
                        rx="4"
                        fill="#ffffff"
                        stroke="#cbd5e1"
                        strokeWidth="1.2"
                      />
                      <text
                        x={midX}
                        y={midY + 4}
                        textAnchor="middle"
                        fill="#15803d"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                      >
                        {fmtM(clusterConfig.spacingM || getRecommendedSpacingM(starTree).optimal)} m
                      </text>
                    </g>
                  );
                })}
              </g>

              <g id="cluster-star-trees">
                {multiCluster.treePoints.map((tree, idx) => {
                  const coords = toClusterCoords(tree.dxM, tree.dyM);
                  const canopyRadiusPx = starTree.matureRadiusM * clusterScale;
                  const collarRadiusPx = metrics.collarRadiusM * clusterScale;

                  return (
                    <g key={`cluster-tree-${tree.index}`}>
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={canopyRadiusPx}
                        fill="url(#canopyGradient)"
                        stroke="#16a34a"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                      />
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={collarRadiusPx}
                        fill="#ef4444"
                        fillOpacity="0.3"
                        stroke="#dc2626"
                        strokeWidth="1.5"
                        strokeDasharray="3 2"
                      />
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={12}
                        fill={starTree.color}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        className="shadow-md"
                      />
                      <text
                        x={coords.x}
                        y={coords.y + 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        ★
                      </text>
                      <text
                        x={coords.x}
                        y={coords.y - 15}
                        textAnchor="middle"
                        fill="#1c1917"
                        fontSize="9.5"
                        fontWeight="bold"
                        className="drop-shadow-xs"
                      >
                        {getLoc(starTree.commonName, language)} #{idx + 1}
                      </text>
                    </g>
                  );
                })}
              </g>

              {showCanopySpread && (
                <g id="cluster-canopy-spreads" className="pointer-events-none select-none">
                  {multiCompanions.companions.map((comp, cIdx) => {
                    const coords = toClusterCoords(comp.dxM, comp.dyM);
                    const radiusPx = (comp.plant.spreadM / 2) * clusterScale;
                    return (
                      <circle
                        key={`cluster-spread-${comp.plantId}-${cIdx}`}
                        cx={coords.x}
                        cy={coords.y}
                        r={radiusPx}
                        fill={comp.plant.color}
                        fillOpacity={0.12}
                        stroke={comp.plant.color}
                        strokeWidth={1}
                        strokeDasharray="2 2"
                      />
                    );
                  })}
                </g>
              )}

              <g id="cluster-companions">
                {multiCompanions.companions.map((comp, cIdx) => {
                  const coords = toClusterCoords(comp.dxM, comp.dyM);
                  const style = getSeasonalPlantStyle(comp.plant);
                  const isHovered = hoveredClusterComp === comp;
                  const isShared = comp.isMerged || comp.servicingTreeIndices.length > 1;
                  const localizedName = getLoc(comp.plant.commonName, language);

                  return (
                    <g
                      key={`cluster-comp-${comp.plantId}-${cIdx}`}
                      transform={`translate(${coords.x}, ${coords.y})`}
                      className="cursor-pointer touch-manipulation"
                      onMouseEnter={() => setHoveredClusterComp(comp)}
                      onMouseLeave={() => setHoveredClusterComp(null)}
                      onClick={() => onSelectPlant(comp.plant)}
                    >
                      <circle r="20" fill="transparent" className="cursor-pointer" />

                      {isShared && (
                        <circle
                          r={isHovered ? 15 : 12}
                          fill="none"
                          stroke="#059669"
                          strokeWidth="1.5"
                          strokeDasharray="3 2"
                          opacity="0.8"
                        />
                      )}

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
                        r={isHovered ? 11 : 8}
                        fill={style.fill}
                        stroke={isHovered ? '#ffffff' : style.stroke}
                        strokeWidth={isHovered ? 2 : 1.5}
                        opacity={style.opacity}
                        className="transition-all duration-150"
                      />

                      {comp.plant.seasonalActivity.floweringSeasons.includes(currentSeason) && (
                        <circle
                          r={isHovered ? 3.5 : 2.5}
                          fill="#ffffff"
                          stroke={style.fill}
                          strokeWidth="1"
                        />
                      )}

                      <text
                        y={isHovered ? 17 : 15}
                        textAnchor="middle"
                        fill="#1c1917"
                        fontSize={isHovered ? '9.5' : '8.5'}
                        fontWeight={isHovered ? 'bold' : '600'}
                        className="pointer-events-none drop-shadow-xs"
                      >
                        {localizedName}
                      </text>
                    </g>
                  );
                })}
              </g>
            </>
          )}
        </svg>

        {(hoveredPlant || hoveredClusterComp) && (() => {
          const plant = hoveredPlant ? hoveredPlant.plant : hoveredClusterComp!.plant;
          const coords = hoveredPlant
            ? toCoords(hoveredPlant.distanceM, hoveredPlant.angleDeg)
            : toClusterCoords(hoveredClusterComp!.dxM, hoveredClusterComp!.dyM);
          const isTopLeft = coords.x < center && coords.y < center;
          const posClass = isTopLeft ? 'bottom-4 left-4' : 'top-4 left-4';
          const isShared = Boolean(hoveredClusterComp && (hoveredClusterComp.isMerged || hoveredClusterComp.servicingTreeIndices.length > 1));

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
                            ✨ {tr.gardenPlanSharedByTrees.replace('{count}', String(hoveredClusterComp!.servicingTreeIndices.length))}
                          </span>
                        ) : (
                          <span className="text-stone-300">
                            {fmtM(hoveredClusterComp!.dxM)}m, {fmtM(hoveredClusterComp!.dyM)}m
                          </span>
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
      </div>

      <SpacingWarningBanner
        language={language}
        report={spacingReport}
        onSwapPlant={onSwapPlant}
      />
    </div>
  );
};
