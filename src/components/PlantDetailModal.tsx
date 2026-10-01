import React, { useEffect } from 'react';
import { GuildPlant, Language, SoilType, StarTree, getLoc, ClimateZone } from '../types/guild';
import { STAR_TREES } from '../data/starTrees';
import { X, Sparkles, Sun, Shield, Layers, Calendar, Scissors, AlertTriangle, Mountain, Star, Check, Globe, BookOpen, ArrowRight, Sprout, ShieldCheck, FlaskConical } from 'lucide-react';
import { PHENO_SEASONS, getPlantingSeasons, getHarvestSeasons } from '../core/seasonalGapEngine';
import { t, formatNumber, translateRole, translateLayer, translateSector, translateZone, translateJuglone, translateClimateZone } from '../i18n/translations';
import { getCompanionPestDefenseForTree } from '../core/pestCompanionEngine';
import { EvidenceCitations, EvidenceTag } from './EvidenceTag';
import { SourceList } from './SourceList';
import { PlantThumbnail } from './PlantThumbnail';
import { GoogleImagesButton } from './GoogleImagesButton';
import { getImageCredit } from '../data/imageCredits';

const CHOP_PLANT_ANCHORS: Record<string, string> = {
  'plant-comfrey': 'chop-plant-comfrey',
  'plant-white-clover': 'chop-plant-white-clover',
  'plant-willow': 'chop-plant-willow',
  'plant-goumi': 'chop-plant-goumi',
  'plant-elaeagnus': 'chop-plant-elaeagnus',
  'plant-yarrow': 'chop-plant-yarrow',
  'plant-horseradish': 'chop-plant-horseradish',
  'plant-borage': 'chop-plant-borage',
  'plant-lupine': 'chop-plant-lupine',
  'plant-elderberry': 'chop-plant-elderberry',
  'plant-aster': 'chop-plant-aster',
  'plant-hosta': 'chop-plant-hosta',
  'plant-nasturtium': 'chop-plant-nasturtium',
  'plant-sweet-potato': 'chop-plant-sweet-potato',
  'plant-tansy': 'chop-plant-tansy',
  'plant-chives': 'chop-plant-chives',
  'plant-tea-sinensis': 'chop-plant-tea-sinensis',
  'plant-hyssop': 'chop-plant-hyssop',
  'plant-sage': 'chop-plant-sage',
  'plant-seabuckthorn': 'chop-plant-seabuckthorn',
  'plant-hemp': 'chop-plant-hemp',
  'plant-alfalfa': 'chop-plant-alfalfa',
  'plant-nettle': 'chop-plant-nettle',
  'plant-lovage': 'chop-plant-lovage',
  'tree-alder': 'chop-tree-alder',
  'plant-alder': 'chop-tree-alder',
  'plant-linden': 'chop-plant-linden',
  'tree-linden': 'chop-plant-linden',
  'plant-nepal-alder': 'chop-plant-tea-shade-trees',
  'plant-albizia': 'chop-plant-tea-shade-trees',
  'tree-seabuckthorn-star': 'chop-plant-seabuckthorn',
};

const ROLE_ANCHOR_MAP: Record<string, string> = {
  NITROGEN_FIXER: 'role-NITROGEN_FIXER',
  DYNAMIC_ACCUMULATOR: 'role-DYNAMIC_ACCUMULATOR',
  POLLINATOR_MAGNET: 'role-POLLINATOR_MAGNET',
  PEST_REPELLER: 'role-PEST_REPELLER',
  LIVING_MULCH: 'role-LIVING_MULCH',
  GRASS_BARRIER: 'role-GRASS_BARRIER',
  ANTIFUNGAL: 'role-ANTIFUNGAL',
  BIOMASS_PRODUCER: 'role-BIOMASS_PRODUCER',
  EDIBLE_UNDERSTORY: 'role-EDIBLE_UNDERSTORY',
};

interface PlantDetailModalProps {
  language: Language;
  selectedSoil?: SoilType;
  selectedTree?: StarTree;
  selectedZone?: ClimateZone;
  plant: GuildPlant | null;
  onClose: () => void;
  isSelected: boolean;
  onToggleSelect: (plant: GuildPlant) => void;
  // When set, the add/remove button is disabled and shows this as its tooltip
  toggleDisabledReason?: string;
  onNavigate?: (path: string) => void;
}

export const PlantDetailModal: React.FC<PlantDetailModalProps> = ({
  language,
  selectedSoil = 'LOAM',
  selectedTree,
  selectedZone,
  plant,
  onClose,
  isSelected,
  onToggleSelect,
  toggleDisabledReason,
  onNavigate,
}) => {
  useEffect(() => {
    if (!plant) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [plant, onClose]);

  if (!plant) return null;
  const tr = t(language);

  const getSoilLabel = (s: SoilType) => {
    switch (s) {
      case 'LOAM': return tr.soilLoam;
      case 'CLAY': return tr.soilClay;
      case 'SANDY': return tr.soilSandy;
      case 'CHALKY': return tr.soilChalky;
      case 'ACIDIC': return tr.soilAcidic;
      case 'SILT': return tr.soilSilt;
      default: return s;
    }
  };

  const isChopAndDrop = plant.seasonalActivity.chopAndDropSeasons.length > 0 || plant.roles.includes('BIOMASS_PRODUCER');
  const chopAnchor = CHOP_PLANT_ANCHORS[plant.id] || 'chop-overview';
  const hasDedicatedChopGuide = Boolean(CHOP_PLANT_ANCHORS[plant.id]);
  const pestDefenses = selectedTree ? getCompanionPestDefenseForTree(plant, selectedTree, selectedZone) : [];
  const blockedByJuglone = !isSelected && !!selectedTree?.jugloneProducer && plant.jugloneTolerance === 'SENSITIVE';
  const photoCredit = getImageCredit(plant.imageUrl);

  const handleNavigateToGuide = (path: string) => {
    if (onNavigate) {
      onClose();
      onNavigate(path);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 cursor-pointer"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="plant-detail-title"
    >
      <div
        className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 max-h-[94vh] overflow-y-auto cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3 sm:pb-4 mb-3 sm:mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 id="plant-detail-title" className="text-lg sm:text-xl font-bold text-stone-900">{getLoc(plant.commonName, language)}</h3>
              {plant.roles.length >= 3 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  {plant.roles.length} {tr.rolesStacked}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-stone-500 italic">{plant.botanicalName}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={tr.closeBtn}
            className="p-1.5 sm:p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`relative w-full h-36 sm:h-44 rounded-xl sm:rounded-2xl overflow-hidden ${photoCredit ? 'mb-1' : 'mb-4'} bg-stone-100 border border-stone-200 shadow-inner`}>
          <PlantThumbnail
            src={plant.imageUrl}
            alt={getLoc(plant.commonName, language)}
            fallbackText={getLoc(plant.commonName, language).substring(0, 2)}
            fallbackColor={plant.color}
            className="w-full h-full"
            roundedClassName="rounded-none"
            targetSize={640}
          />
          <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 z-10">
            <GoogleImagesButton
              query={`${plant.botanicalName} ${getLoc(plant.commonName, language)}`}
              label={tr.searchGoogleImages}
              title={tr.searchGoogleImages}
              className="bg-white/95 hover:bg-white text-stone-800 shadow-md backdrop-blur-xs font-semibold py-1 px-2.5 sm:py-1.5 sm:px-3 text-[11px] sm:text-xs"
            />
          </div>
        </div>
        {photoCredit && (
          <p className="mb-4 text-[10px] sm:text-[11px] text-stone-400 leading-snug text-right break-words">
            {tr.photoCreditPhoto}: {photoCredit.author},{' '}
            {photoCredit.licenseUrl ? (
              <a href={photoCredit.licenseUrl} target="_blank" rel="noopener noreferrer license" className="underline hover:text-stone-600">
                {photoCredit.license}
              </a>
            ) : (
              photoCredit.license
            )}{' '}
            –{' '}
            <a href={photoCredit.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-600">
              {photoCredit.sourceName}
            </a>{' '}
            ({tr.photoCreditModified})
          </p>
        )}

        <div className="mb-4">
          <label className="text-[11px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
            {tr.modalRolesTitle}
          </label>
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {plant.roles.map(r => (
              <button
                key={r}
                type="button"
                onClick={() => onNavigate && handleNavigateToGuide(`/guides?tab=roles#${ROLE_ANCHOR_MAP[r] || 'roles'}`)}
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-forest-100 text-forest-800 text-[11px] sm:text-xs font-semibold ${
                  onNavigate ? 'hover:bg-forest-200 hover:ring-1 hover:ring-forest-400 cursor-pointer transition-all' : ''
                }`}
                title={onNavigate ? tr.plantDetailOpenRoleGuide.replace('{role}', translateRole(r, language)) : undefined}
              >
                {translateRole(r, language)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 sm:mb-5 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 leading-relaxed">
          {getLoc(plant.notes, language)}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5 text-xs">
          <div className="p-3 rounded-xl border border-stone-200">
            <div className="text-stone-400 font-medium mb-0.5 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              {tr.layer}
            </div>
            <div className="font-bold text-stone-800">{translateLayer(plant.layer, language)}</div>
          </div>

          <div className="p-3 rounded-xl border border-stone-200">
            <div className="text-stone-400 font-medium mb-0.5 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5" />
              {tr.modalSector}
            </div>
            <div className="font-bold text-stone-800">{translateSector(plant.preferredSector, language)}</div>
          </div>

          <div className="p-3 rounded-xl border border-stone-200">
            <div className="text-stone-400 font-medium mb-0.5 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              {tr.modalZone}
            </div>
            <div className="font-bold text-stone-800">{translateZone(plant.preferredZone, language)}</div>
          </div>

          <div className="p-3 rounded-xl border border-stone-200">
            <div className="text-stone-400 font-medium mb-0.5">{tr.modalSpreadHeight}</div>
            <div className="font-bold text-stone-800">{formatNumber(plant.spreadM, 1, language)} m / {formatNumber(plant.heightM, 1, language)} m</div>
          </div>

          <div className="p-3 rounded-xl border border-stone-200">
            <div className="text-stone-400 font-medium mb-0.5">{tr.modalDistance}</div>
            <div className="font-bold text-stone-800">{formatNumber(plant.minDistanceM, 1, language)} – {formatNumber(plant.maxDistanceM, 1, language)} m</div>
          </div>

          <div className="p-3 rounded-xl border border-stone-200">
            <div className="text-stone-400 font-medium mb-0.5 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              {tr.modalJuglone}
            </div>
            <div className={`font-bold ${plant.jugloneTolerance === 'SENSITIVE' ? 'text-rose-600' : 'text-emerald-700'}`}>
              {translateJuglone(plant.jugloneTolerance, language)}
            </div>
          </div>

          <div className="p-3 rounded-xl border border-stone-200">
            <div className="text-stone-400 font-medium mb-0.5 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-sky-500" />
              {tr.climateZone}
            </div>
            <div className="font-bold text-stone-800 text-xs">
              {plant.climateZones?.map(z => translateClimateZone(z, language)).join(', ') || translateClimateZone('TEMPERATE', language)}
            </div>
          </div>

          {plant.plantingTime && (
            <div className="p-3 rounded-xl border border-stone-200 col-span-2 sm:col-span-1">
              <div className="text-stone-400 font-medium mb-0.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                {tr.plantingTime}
              </div>
              <div className="font-bold text-stone-800 text-xs leading-snug">
                {getLoc(plant.plantingTime, language)}
              </div>
            </div>
          )}

          {plant.harvestTime && (
            <div className="p-3 rounded-xl border border-stone-200 col-span-2 sm:col-span-2">
              <div className="text-stone-400 font-medium mb-0.5 flex items-center gap-1">
                <Scissors className="w-3.5 h-3.5 text-amber-600" />
                {tr.harvestTime}
              </div>
              <div className="font-bold text-stone-800 text-xs leading-snug">
                {getLoc(plant.harvestTime, language)}
              </div>
            </div>
          )}
        </div>

        <div className="mb-5 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs">
          <div className="font-bold text-stone-700 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
            <Mountain className="w-3.5 h-3.5 text-forest-600" />
            <span>{tr.modalSoilTitle}</span>
          </div>

          <div className="mb-2 text-stone-700 leading-relaxed">
            {getLoc(plant.soilNotes, language)}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-stone-200/60">
            <span className="text-[10px] text-stone-500 font-medium">{tr.plantDetailSuitable}</span>
            {plant.suitableSoils.map(s => (
              <span
                key={s}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  s === selectedSoil
                    ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-500/50'
                    : 'bg-stone-200/70 text-stone-700'
                }`}
              >
                {getSoilLabel(s)}
              </span>
            ))}
            {plant.unsuitableSoils.length > 0 && (
              <>
                <span className="text-[10px] text-stone-400 font-medium ml-1">{tr.plantDetailUnsuitable}</span>
                {plant.unsuitableSoils.map(s => (
                  <span
                    key={s}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      s === selectedSoil
                        ? 'bg-rose-100 text-rose-800 ring-1 ring-rose-500/50'
                        : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {getSoilLabel(s)}
                  </span>
                ))}
              </>
            )}
          </div>
        </div>

        {plant.sources && plant.sources.length > 0 && (
          <SourceList sources={plant.sources} language={language} className="mb-5 px-1" />
        )}

        {plant.recommendedForTrees && plant.recommendedForTrees.length > 0 && (
          <div className="mb-5 p-3.5 rounded-2xl bg-forest-50/50 border border-forest-100 text-xs">
            <div className="font-bold text-forest-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>{tr.modalTreeRecommendationsTitle}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {plant.recommendedForTrees.map(treeId => {
                const tree = STAR_TREES.find(t => t.id === treeId);
                if (!tree) return null;
                const isCurrentTree = selectedTree?.id === treeId;
                return (
                  <span
                    key={treeId}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                      isCurrentTree
                        ? 'bg-forest-700 text-white shadow-xs'
                        : 'bg-white border border-forest-200 text-forest-800'
                    }`}
                  >
                    <span>{getLoc(tree.commonName, language)}</span>
                    {isCurrentTree && <Check className="w-3 h-3 text-emerald-300" />}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {pestDefenses.length > 0 && selectedTree && (
          <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-emerald-50/90 border border-emerald-300 text-xs space-y-3 shadow-xs">
            <div className="font-bold text-emerald-950 uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{tr.pestDefenseForStarTree.replace('{tree}', getLoc(selectedTree.commonName, language))}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200/90 text-emerald-900 text-[10px] font-bold border border-emerald-300/80">
                {pestDefenses.length} {pestDefenses.length === 1 ? tr.pestDefenseCountSingle : tr.pestDefenseCountPlural}
              </span>
            </div>

            <div className="space-y-2.5">
              {pestDefenses.map((defense, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/95 border border-emerald-200/90 shadow-2xs space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                      {tr.targetPest}:
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-950 text-xs font-bold border border-rose-200/90 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                      <span>{getLoc(defense.pestText, language)}</span>
                    </span>
                    <EvidenceTag level={defense.evidence} language={language} />
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200/70 text-emerald-950 leading-relaxed space-y-1">
                    <div className="font-bold text-[11px] text-emerald-900 flex items-center gap-1">
                      <Sprout className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{tr.pestDefenseHowItHelps.replace('{plant}', getLoc(plant.commonName, language))}:</span>
                    </div>
                    <p className="text-xs text-stone-800">
                      {getLoc(defense.companionRole, language)}
                    </p>
                  </div>

                  <div className="text-[11px] text-stone-600 pl-1 leading-snug">
                    <strong className="text-stone-700 font-semibold">{tr.scientificMechanismTitle}: </strong>
                    <span>{getLoc(defense.scientificMechanism, language)}</span>
                  </div>

                  <EvidenceCitations citations={defense.citations} title={tr.evidenceSourcesTitle} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-forest-50/70 border border-forest-200/80 text-xs space-y-3">
          <div className="font-bold text-forest-900 uppercase tracking-wider text-[11px] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-forest-700" />
              <span>{tr.plantDetailsGuideSection}</span>
            </span>
          </div>

          {isChopAndDrop && (
            <div className="p-3 rounded-xl bg-white border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
                  <Scissors className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{tr.plantDetailsChopGuideTitle}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    {hasDedicatedChopGuide ? tr.plantDetailSpeciesGuide : tr.chopDropTag}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-snug">
                  {tr.plantDetailsChopGuideDesc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleNavigateToGuide(`/guides?tab=chop_and_drop#${chopAnchor}`)}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>{tr.plantDetailsChopGuideBtn}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-forest-900 block">
              {tr.plantDetailsRolesTitle}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {plant.roles.map(role => {
                const roleAnchor = ROLE_ANCHOR_MAP[role] || 'roles';
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleNavigateToGuide(`/guides?tab=roles#${roleAnchor}`)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-forest-200 hover:border-forest-400 hover:bg-forest-100/60 text-forest-800 text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer shadow-xs group"
                    title={tr.plantDetailViewScientificGuide.replace('{role}', translateRole(role, language))}
                  >
                    <span>{translateRole(role, language)}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-forest-400 group-hover:text-forest-700 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-forest-200/60 space-y-2 text-[11px]">
            <div className="flex items-center justify-between gap-2">
              <div className="text-forest-800">
                <span className="font-bold">{tr.plantDetailsGuildDesignTitle}: </span>
                <span className="text-forest-700 hidden sm:inline">{tr.plantDetailsGuildDesignDesc}</span>
              </div>
              <button
                type="button"
                onClick={() => handleNavigateToGuide('/guides?tab=guild_design#guide-zonation')}
                className="shrink-0 font-bold text-forest-700 hover:text-forest-900 underline flex items-center gap-1 cursor-pointer"
              >
                <span>{tr.plantDetailOpenMasterclass}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => handleNavigateToGuide('/guides?tab=allelopathy#allelo-juglone')}
                className="px-2 py-1 rounded-md bg-amber-50 border border-amber-200 hover:border-amber-400 text-amber-900 font-semibold flex items-center gap-1 transition-all cursor-pointer"
              >
                <FlaskConical className="w-3 h-3 text-amber-600" />
                <span>{tr.guidesTabAllelopathy}</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavigateToGuide('/guides?tab=pests#pest-evidence-backed')}
                className="px-2 py-1 rounded-md bg-rose-50 border border-rose-200 hover:border-rose-400 text-rose-900 font-semibold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Shield className="w-3 h-3 text-rose-600" />
                <span>{tr.guidesTabPests}</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavigateToGuide('/guides?tab=shade_and_stars#shade-mechanics')}
                className="px-2 py-1 rounded-md bg-sky-50 border border-sky-200 hover:border-sky-400 text-sky-900 font-semibold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Sun className="w-3 h-3 text-sky-600" />
                <span>{tr.guidesTabShadeAndStars}</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavigateToGuide('/guides?tab=tea_sinensis#tea-sinensis-botany')}
                className="px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200 hover:border-emerald-400 text-emerald-900 font-semibold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Sprout className="w-3 h-3 text-emerald-600" />
                <span>{tr.guidesTabTeaSinensis}</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavigateToGuide('/guides?tab=tea_assamica#tea-assamica-botany')}
                className="px-2 py-1 rounded-md bg-teal-50 border border-teal-200 hover:border-teal-400 text-teal-900 font-semibold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Sprout className="w-3 h-3 text-teal-600" />
                <span>{tr.guidesTabTeaAssamica}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-forest-600" />
            {tr.modalPhenologyTitle}
          </label>
          <div className="space-y-1.5 text-xs">
            {(() => {
              const plantingSeasons = getPlantingSeasons(plant);
              const harvestSeasons = getHarvestSeasons(plant);

              return PHENO_SEASONS.map(s => {
                const isFlowering = plant.seasonalActivity.floweringSeasons.includes(s.id);
                const hasFoliage = plant.seasonalActivity.foliageSeasons.includes(s.id);
                const isChopDrop = plant.seasonalActivity.chopAndDropSeasons.includes(s.id);
                const isPestDefense = plant.seasonalActivity.pestDeterrenceSeasons.includes(s.id);
                const isPlanting = plantingSeasons.includes(s.id);
                const isHarvest = harvestSeasons.includes(s.id);

                return (
                  <div
                    key={s.id}
                    className="p-2.5 rounded-xl border border-stone-100 bg-stone-50/60 flex items-center justify-between"
                  >
                    <div className="font-medium text-stone-800 w-40 sm:w-44 shrink-0">
                      <div>{getLoc(s.label, language)}</div>
                      <div className="text-[10px] text-stone-400 font-normal">{getLoc(s.months, language)}</div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {isPlanting && (
                        <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center gap-1">
                          <Sprout className="w-2.5 h-2.5 text-teal-700" /> {tr.plantingSeasonTag}
                        </span>
                      )}
                      {isHarvest && (
                        <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-bold flex items-center gap-1">
                          <Scissors className="w-2.5 h-2.5 text-orange-700" /> {tr.harvestSeasonTag}
                        </span>
                      )}
                      {isFlowering && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                          {tr.bloomingTag}
                        </span>
                      )}
                      {hasFoliage && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-medium">
                          {tr.livingMulchTag}
                        </span>
                      )}
                      {isChopDrop && (
                        <span className="px-2 py-0.5 rounded bg-lime-100 text-lime-800 text-[10px] font-bold flex items-center gap-1">
                          <Scissors className="w-2.5 h-2.5" /> {tr.chopDropTag}
                        </span>
                      )}
                      {isPestDefense && (
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-medium">
                          {tr.pestDefenseTag}
                        </span>
                      )}
                      {!isFlowering && !hasFoliage && !isChopDrop && !isPestDefense && !isPlanting && !isHarvest && (
                        <span className="text-[10px] text-stone-400 italic">{tr.dormantTag}</span>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-100">
          <GoogleImagesButton
            query={`${plant.botanicalName} ${getLoc(plant.commonName, language)}`}
            label={tr.googleImages}
            title={tr.searchGoogleImages}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              {tr.closeBtn}
            </button>
            <button
              type="button"
              disabled={blockedByJuglone || !!toggleDisabledReason}
              onClick={() => {
                onToggleSelect(plant);
                onClose();
              }}
              className={`px-5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all ${
                toggleDisabledReason
                  ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                  : isSelected
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : blockedByJuglone
                  ? 'bg-rose-200 text-rose-600 cursor-not-allowed'
                  : 'bg-forest-700 text-white hover:bg-forest-800'
              }`}
              title={toggleDisabledReason ?? (blockedByJuglone ? tr.jugloneWarning : undefined)}
            >
              {isSelected ? tr.removeGuildBtn : tr.addGuildBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
