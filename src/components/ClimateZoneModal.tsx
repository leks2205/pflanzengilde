import React, { useState, useEffect } from 'react';
import { ClimateZone, Hemisphere, Language } from '../types/guild';
import { GUILD_PLANTS } from '../data/guildPlants';
import { STAR_TREES } from '../data/starTrees';
import { t } from '../i18n/translations';
import { X, Globe, Check, Sun, Snowflake, Flame, CloudSun, Compass, MapPin } from 'lucide-react';
import { WORLD_LAND_PATH } from '../data/worldLandPath';

import {
  WorldRegionId,
  WorldRegionDef,
  WORLD_REGIONS,
  CLIMATE_DISPLAY_BOUNDARIES,
} from '../data/worldClimateRegions';

// Catalogue data is static, so per-zone species counts only need computing once.
const PLANT_COUNTS = Object.fromEntries(
  (['BOREAL', 'TEMPERATE', 'SUBTROPICAL', 'TROPICAL'] as ClimateZone[]).map(zone => {
    const starCount = STAR_TREES.filter(tree => tree.climateZones.includes(zone)).length;
    const companionCount = GUILD_PLANTS.filter(p => p.climateZones.includes(zone)).length;
    return [zone, { starCount, companionCount, total: starCount + companionCount }];
  })
) as Record<ClimateZone, { starCount: number; companionCount: number; total: number }>;

interface ClimateZoneModalProps {
  language: Language;
  selectedZone: ClimateZone;
  hemisphere: Hemisphere;
  onSelectZone: (zone: ClimateZone) => void;
  onSelectHemisphere: (hemisphere: Hemisphere) => void;
  onClose: () => void;
}

export const ClimateZoneModal: React.FC<ClimateZoneModalProps> = ({
  language,
  selectedZone,
  hemisphere,
  onSelectZone,
  onSelectHemisphere,
  onClose,
}) => {
  const tr = t(language);
  const [hoveredRegionId, setHoveredRegionId] = useState<WorldRegionId | null>(null);

  const activeRegionId: WorldRegionId = (() => {
    if (selectedZone === 'TROPICAL') {
      return hemisphere === 'SOUTHERN' ? 'TROPICAL_SOUTH' : 'TROPICAL_NORTH';
    }
    if (selectedZone === 'BOREAL') {
      return hemisphere === 'SOUTHERN' ? 'BOREAL_SOUTH' : 'BOREAL_NORTH';
    }
    if (selectedZone === 'TEMPERATE') {
      return hemisphere === 'SOUTHERN' ? 'TEMPERATE_SOUTH' : 'TEMPERATE_NORTH';
    }
    if (selectedZone === 'SUBTROPICAL') {
      return hemisphere === 'SOUTHERN' ? 'SUBTROPICAL_SOUTH' : 'SUBTROPICAL_NORTH';
    }
    return 'TEMPERATE_NORTH';
  })();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSelectRegion = (region: WorldRegionDef) => {
    onSelectZone(region.zone);
    onSelectHemisphere(region.hemisphere);
  };

  const ZONES: {
    id: ClimateZone;
    name: string;
    sub: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    borderAccent: string;
    northRegionId: WorldRegionId;
    southRegionId?: WorldRegionId;
  }[] = [
    {
      id: 'BOREAL',
      name: tr.zoneBoreal,
      sub: tr.zoneBorealSub,
      desc: tr.zoneBorealDesc,
      icon: <Snowflake className="w-5 h-5 text-sky-500" />,
      color: '#0284c7',
      borderAccent: 'border-sky-300',
      northRegionId: 'BOREAL_NORTH',
      southRegionId: 'BOREAL_SOUTH',
    },
    {
      id: 'TEMPERATE',
      name: tr.zoneTemperate,
      sub: tr.zoneTemperateSub,
      desc: tr.zoneTemperateDesc,
      icon: <CloudSun className="w-5 h-5 text-emerald-600" />,
      color: '#16a34a',
      borderAccent: 'border-emerald-300',
      northRegionId: 'TEMPERATE_NORTH',
      southRegionId: 'TEMPERATE_SOUTH',
    },
    {
      id: 'SUBTROPICAL',
      name: tr.zoneSubtropical,
      sub: tr.zoneSubtropicalSub,
      desc: tr.zoneSubtropicalDesc,
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      color: '#d97706',
      borderAccent: 'border-amber-300',
      northRegionId: 'SUBTROPICAL_NORTH',
      southRegionId: 'SUBTROPICAL_SOUTH',
    },
    {
      id: 'TROPICAL',
      name: tr.zoneTropical,
      sub: tr.zoneTropicalSub,
      desc: tr.zoneTropicalDesc,
      icon: <Flame className="w-5 h-5 text-rose-500" />,
      color: '#e11d48',
      borderAccent: 'border-rose-300',
      northRegionId: 'TROPICAL_NORTH',
      southRegionId: 'TROPICAL_SOUTH',
    },
  ];

  const displayRegion = WORLD_REGIONS.find(r => r.id === (hoveredRegionId || activeRegionId)) || WORLD_REGIONS[1];
  const activeRegion = WORLD_REGIONS.find(r => r.id === activeRegionId) || WORLD_REGIONS[1];

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 cursor-pointer"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="climate-zone-modal-title"
    >
      <div
        className="bg-white rounded-2xl sm:rounded-3xl max-w-5xl w-full p-4 sm:p-7 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 max-h-[95vh] overflow-y-auto cursor-default space-y-4 sm:space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-forest-600 text-white flex items-center justify-center shadow-md shadow-forest-600/20 shrink-0">
              <Globe className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h2 id="climate-zone-modal-title" className="text-lg sm:text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
                {tr.climateZoneModalTitle}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                {tr.climateZoneModalSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label={tr.closeBtn}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-900 text-white rounded-xl sm:rounded-2xl px-3.5 py-3 sm:px-4 sm:py-3.5 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-2.5 md:gap-4 min-h-[92px] sm:min-h-[76px] md:h-[72px]">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className="p-2 sm:p-2.5 rounded-xl shrink-0"
              style={{ backgroundColor: `${displayRegion.color}25`, color: displayRegion.color }}
            >
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight truncate">
                  {displayRegion.name[language]}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0"
                  style={{ backgroundColor: `${displayRegion.color}35`, color: displayRegion.fillColor }}
                >
                  {displayRegion.usda}
                </span>
                <span className="text-xs text-slate-400 font-mono shrink-0 hidden sm:inline">
                  {displayRegion.latRange[language]}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 truncate">
                <strong className="text-slate-200">{tr.climateModalKeyRegions}</strong>
                <span className="text-slate-300">{displayRegion.geoAreas[language]}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-4">
            <Compass className="w-4 h-4 text-sky-400 shrink-0" />
            <div className="text-xs">
              <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium whitespace-nowrap">
                {tr.hemisphereDerivedNote}
              </div>
              <div className="font-bold text-slate-200 whitespace-nowrap">
                {displayRegion.hemisphere === 'NORTHERN' ? tr.sunPathNorthNote : tr.sunPathSouthNote}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-slate-800 shadow-inner relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 px-2">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px] sm:text-xs">
              <Globe className="w-3.5 h-3.5 text-forest-400" />
              {tr.worldMapTitle}
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
              {tr.mapRegionHoverHint}
            </span>
          </div>

          <div className="relative">
            <svg
              viewBox="0 20 1000 440"
              className="w-full h-auto max-h-[380px] rounded-xl select-none block"
              aria-label={tr.climateModalMapAria}
            >
              <defs>
                <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0b1120" />
                  <stop offset="50%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>

                <clipPath id="worldLandPath">
                  <path d={WORLD_LAND_PATH} />
                </clipPath>

                <filter id="beaconGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
                </filter>
              </defs>

              <rect x="0" y="20" width="1000" height="440" rx="12" fill="url(#oceanGrad)" />

              <line x1="0" y1="65" x2="1000" y2="65" stroke="#38bdf8" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.3" />

              {CLIMATE_DISPLAY_BOUNDARIES.map((boundary) => (
                <path
                  key={boundary.id}
                  d={boundary.d}
                  fill="none"
                  stroke={boundary.stroke}
                  strokeWidth={boundary.strokeWidth}
                  strokeDasharray={boundary.dashArray}
                  opacity={boundary.opacity}
                />
              ))}

              <text x="990" y="68" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="end" opacity="0.45">66.5°N</text>
              <text x="990" y="92" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="end" opacity="0.6">~55°–62°N</text>
              <text x="990" y="152" fill="#4ade80" fontSize="9" fontWeight="bold" textAnchor="end" opacity="0.6">~35°–43°N</text>
              <text x="990" y="188" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="end" opacity="0.6">~23.5°N</text>
              <text x="990" y="253" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="end" opacity="0.85">{tr.climateModalMapEquator}</text>
              <text x="990" y="318" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="end" opacity="0.6">~23.5°S</text>
              <text x="990" y="352" fill="#4ade80" fontSize="9" fontWeight="bold" textAnchor="end" opacity="0.6">~35°S</text>
              <text x="990" y="408" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="end" opacity="0.6">~55°S</text>

              <g fill="#64748b" fontSize="10" fontWeight="bold" letterSpacing="1.5" opacity="0.45" pointerEvents="none">
                <text x="525" y="122" textAnchor="middle">{tr.climateModalMapEurope}</text>
                <text x="215" y="125" textAnchor="middle">{tr.climateModalMapNorthAmerica}</text>
                <text x="730" y="115" textAnchor="middle">{tr.climateModalMapAsia}</text>
                <text x="525" y="260" textAnchor="middle">{tr.climateModalMapAfrica}</text>
                <text x="315" y="305" textAnchor="middle">{tr.climateModalMapSouthAmerica}</text>
                <text x="830" y="345" textAnchor="middle">{tr.climateModalMapAustralia}</text>
                <text x="925" y="380" textAnchor="middle">{tr.climateModalMapNewZealand}</text>
              </g>

              <g clipPath="url(#worldLandPath)">
                <rect x="0" y="20" width="1000" height="440" fill="#334155" />

                {WORLD_REGIONS.map((region) => {
                  const isCurrent = activeRegionId === region.id;
                  const isHovered = hoveredRegionId === region.id;
                  const opacity = isHovered ? 0.95 : isCurrent ? 0.8 : 0.32;

                  return (
                    <path
                      key={region.id}
                      d={region.polygonPath}
                      fill={region.fillColor}
                      fillOpacity={opacity}
                      className="transition-all duration-150"
                    />
                  );
                })}
              </g>

              <path
                d={WORLD_LAND_PATH}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="0.85"
                opacity="0.65"
                pointerEvents="none"
              />

              <g pointerEvents="none" transform={`translate(${activeRegion.beaconX}, ${activeRegion.beaconY})`}>
                <circle r="14" fill={activeRegion.color} opacity="0.35" filter="url(#beaconGlow)">
                  <animate attributeName="r" values="8;18;8" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle r="5" fill="#ffffff" stroke={activeRegion.color} strokeWidth="2.5" />
                <circle r="2" fill={activeRegion.color} />
              </g>

              {WORLD_REGIONS.map((region) => (
                <path
                  key={`hit-${region.id}`}
                  d={region.polygonPath}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredRegionId(region.id)}
                  onMouseLeave={() => setHoveredRegionId(null)}
                  onClick={() => handleSelectRegion(region)}
                >
                  <title>{`${region.name[language]} (${region.usda}) — ${region.geoAreas[language]}`}</title>
                </path>
              ))}

              <g fill="#94a3b8" fontSize="8" fontWeight="bold" opacity="0.75" pointerEvents="none">
                <text x="12" y="45">{tr.climateModalMapNorthernHemisphere}</text>
                <text x="12" y="440">{tr.climateModalMapSouthernHemisphere}</text>
              </g>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {ZONES.map((zone) => {
            const isSelected = selectedZone === zone.id;
            const counts = PLANT_COUNTS[zone.id];

            const northDef = WORLD_REGIONS.find(r => r.id === zone.northRegionId);
            const southDef = zone.southRegionId ? WORLD_REGIONS.find(r => r.id === zone.southRegionId) : null;

            return (
              <div
                key={zone.id}
                className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all relative text-left ${
                  isSelected
                    ? `${zone.borderAccent} bg-white shadow-md ring-2 ring-forest-500/20`
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-stone-100 shrink-0">
                      {zone.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                        {zone.name}
                      </h3>
                      <p className="text-xs font-semibold text-stone-500">
                        {zone.sub}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest-600 text-white text-xs font-bold shadow-xs shrink-0">
                      <Check className="w-3.5 h-3.5" />
                      {tr.selectedZoneLabel}
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-3 mt-1.5">
                  {zone.desc}
                </p>

                <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-stone-100 mb-2.5">
                  <span className="text-[11px] font-semibold text-stone-500 mr-1">
                    {tr.climateModalSelectRegion}
                  </span>
                  {northDef && (
                    <button
                      type="button"
                      onClick={() => handleSelectRegion(northDef)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                        activeRegionId === northDef.id
                          ? 'bg-forest-600 text-white border-forest-600 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                      }`}
                    >
                      <span>
                        {northDef.id === 'BOREAL_NORTH' && tr.climateModalRegionBorealNorth}
                        {northDef.id === 'TEMPERATE_NORTH' && tr.climateModalRegionTemperateNorth}
                        {northDef.id === 'SUBTROPICAL_NORTH' && tr.climateModalRegionSubtropicalNorth}
                        {northDef.id === 'TROPICAL_NORTH' && tr.climateModalRegionTropicalNorth}
                      </span>
                      {activeRegionId === northDef.id && <Check className="w-3 h-3" />}
                    </button>
                  )}
                  {southDef && (
                    <button
                      type="button"
                      onClick={() => handleSelectRegion(southDef)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                        activeRegionId === southDef.id
                          ? 'bg-forest-600 text-white border-forest-600 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                      }`}
                    >
                      <span>
                        {southDef.id === 'BOREAL_SOUTH' && tr.climateModalRegionBorealSouth}
                        {southDef.id === 'TEMPERATE_SOUTH' && tr.climateModalRegionTemperateSouth}
                        {southDef.id === 'SUBTROPICAL_SOUTH' && tr.climateModalRegionSubtropicalSouth}
                        {southDef.id === 'TROPICAL_SOUTH' && tr.climateModalRegionTropicalSouth}
                      </span>
                      {activeRegionId === southDef.id && <Check className="w-3 h-3" />}
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1.5 border-t border-stone-100/70">
                  <span>
                    {tr.climateModalMatchingSpecies.replace('{count}', String(counts.total))}
                  </span>
                  <span className="font-semibold text-stone-700">
                    ({counts.starCount} {tr.climateModalAnchors} • {counts.companionCount} {tr.climateModalCompanions})
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-2 text-stone-500">
            <Compass className="w-4 h-4 text-forest-600 shrink-0" />
            <span>
              {tr.climateModalActive.replace('{region}', activeRegion.name[language]).replace('{hemisphere}', activeRegion.hemisphere === 'NORTHERN' ? tr.climateModalNorthernHemisphere : tr.climateModalSouthernHemisphere)}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer shrink-0"
          >
            {tr.climateModalApplyClose}
          </button>
        </div>
      </div>
    </div>
  );
};
