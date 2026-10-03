import React, { useState, useMemo } from 'react';
import { ClimateZone, Hemisphere, Language, SoilType, TreeAgeMode, getLoc } from '../types/guild';
import { GardenCompanionInstance, GardenInfrastructure, GardenStarPlantInstance } from '../types/garden';
import { buildEmbedIframeCode, buildGardenEmbedUrl, buildGardenShareUrl } from '../utils/shareUtils';
import { X, Copy, Check, Share2, Code, MessageCircle, Send, Mail, Sparkles, Grid, ExternalLink, Trees, Sprout } from 'lucide-react';
import { t, formatNumber } from '../i18n/translations';

interface GardenEmbedCardProps {
  gardenName: string;
  starPlants: GardenStarPlantInstance[];
  companions: GardenCompanionInstance[];
  soil?: SoilType;
  zone?: ClimateZone;
  language: Language;
  showActionBtn?: boolean;
  actionUrl?: string;
}

export const GardenEmbedCard: React.FC<GardenEmbedCardProps> = ({
  gardenName,
  starPlants,
  companions,
  soil = 'LOAM',
  zone = 'TEMPERATE',
  language,
  showActionBtn = false,
  actionUrl,
}) => {
  const tr = t(language);
  const uniqueStarTrees = useMemo(() => {
    const map = new Map<string, { name: string; color: string; count: number }>();
    for (const sp of starPlants) {
      const existing = map.get(sp.treeId);
      if (existing) existing.count += 1;
      else {
        map.set(sp.treeId, {
          name: getLoc(sp.starTree.commonName, language),
          color: sp.starTree.color || '#ef4444',
          count: 1,
        });
      }
    }
    return Array.from(map.values());
  }, [starPlants, language]);

  const uniqueCompanions = useMemo(() => {
    const map = new Map<string, { name: string; color: string; count: number }>();
    for (const comp of companions) {
      const existing = map.get(comp.plantId);
      if (existing) existing.count += 1;
      else {
        map.set(comp.plantId, {
          name: getLoc(comp.plant.commonName, language),
          color: comp.plant.color || '#16a34a',
          count: 1,
        });
      }
    }
    return Array.from(map.values());
  }, [companions, language]);

  const mapGeometry = useMemo(() => {
    const size = 200;
    const center = size / 2;
    const allX = [...starPlants.map(s => s.xM), ...companions.map(c => c.xM), 0];
    const allY = [...starPlants.map(s => s.yM), ...companions.map(c => c.yM), 0];
    const maxSpan = Math.max(8, Math.max(...allX.map(Math.abs)), Math.max(...allY.map(Math.abs))) * 1.35;
    const scale = (size * 0.42) / maxSpan;

    // Dimension lines to each tree's two nearest neighbours
    const edges: Array<{ ax: number; ay: number; bx: number; by: number; distM: number }> = [];
    const seen = new Set<string>();
    const addEdge = (i: number, j: number) => {
      const key = `${Math.min(i, j)}-${Math.max(i, j)}`;
      if (!seen.has(key)) {
        seen.add(key);
        const a = starPlants[i];
        const b = starPlants[j];
        const distM = Math.hypot(b.xM - a.xM, b.yM - a.yM);
        edges.push({
          ax: center + a.xM * scale,
          ay: center + a.yM * scale,
          bx: center + b.xM * scale,
          by: center + b.yM * scale,
          distM,
        });
      }
    };

    if (starPlants.length === 2) {
      addEdge(0, 1);
    } else if (starPlants.length > 2) {
      for (let i = 0; i < starPlants.length; i++) {
        const dists = starPlants
          .map((other, j) => ({ j, d: i === j ? Infinity : Math.hypot(other.xM - starPlants[i].xM, other.yM - starPlants[i].yM) }))
          .sort((a, b) => a.d - b.d);
        if (dists[0] && dists[0].d < Infinity) addEdge(i, dists[0].j);
        if (dists[1] && dists[1].d < Infinity) addEdge(i, dists[1].j);
      }
    }

    return { size, center, scale, edges };
  }, [starPlants, companions]);

  const displayTitle = gardenName || tr.gardenPageDefaultName;

  return (
    <div className="bg-gradient-to-br from-stone-900 via-forest-950 to-stone-900 text-white p-4 sm:p-5 rounded-2xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
        <div className="w-40 h-40 sm:w-44 sm:h-44 shrink-0 rounded-xl bg-stone-950/90 border border-stone-700/80 shadow-inner flex items-center justify-center relative overflow-hidden">
          <svg
            viewBox={`0 0 ${mapGeometry.size} ${mapGeometry.size}`}
            className="w-full h-full"
          >
            <line x1={mapGeometry.center} y1={0} x2={mapGeometry.center} y2={mapGeometry.size} stroke="#334155" strokeWidth="0.7" strokeDasharray="2,2" />
            <line x1={0} y1={mapGeometry.center} x2={mapGeometry.size} y2={mapGeometry.center} stroke="#334155" strokeWidth="0.7" strokeDasharray="2,2" />

            {mapGeometry.edges.map((e, idx) => {
              const mx = (e.ax + e.bx) / 2;
              const my = (e.ay + e.by) / 2;
              return (
                <g key={idx}>
                  <line x1={e.ax} y1={e.ay} x2={e.bx} y2={e.by} stroke="#94a3b8" strokeWidth="1" />
                  <rect x={mx - 14} y={my - 6} width="28" height="11" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="0.6" />
                  <text x={mx} y={my + 2.5} textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#e2e8f0">
                    {formatNumber(e.distM, 1, language)}m
                  </text>
                </g>
              );
            })}

            {companions.map(comp => {
              const cx = mapGeometry.center + comp.xM * mapGeometry.scale;
              const cy = mapGeometry.center + comp.yM * mapGeometry.scale;
              return (
                <g key={comp.instanceId}>
                  {comp.isMerged && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="5.2"
                      fill="none"
                      stroke={comp.plant.color || '#16a34a'}
                      strokeWidth="0.9"
                    />
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="3.2"
                    fill={comp.plant.color || '#16a34a'}
                  />
                </g>
              );
            })}

            {starPlants.map(sp => {
              const tx = mapGeometry.center + sp.xM * mapGeometry.scale;
              const ty = mapGeometry.center + sp.yM * mapGeometry.scale;
              return (
                <g key={sp.instanceId}>
                  <circle
                    cx={tx}
                    cy={ty}
                    r="5.5"
                    fill={sp.starTree.color || '#ef4444'}
                    stroke="#ffffff"
                    strokeWidth="1.2"
                  />
                  <circle cx={tx} cy={ty} r="1.6" fill="#ffffff" />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex-1 min-w-0 space-y-2.5 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Grid className="w-3 h-3" />
              <span>{tr.shareGardenMultiGuildPlan}</span>
            </span>
            <span className="text-[10px] text-stone-400 font-mono">
              {soil} • {zone}
            </span>
          </div>

          <div>
            <h4 className="text-lg sm:text-xl font-extrabold text-white truncate">
              {displayTitle}
            </h4>
            <p className="text-xs text-stone-300 flex items-center justify-center sm:justify-start gap-3 mt-0.5">
              <span className="inline-flex items-center gap-1 font-semibold text-amber-300">
                <Trees className="w-3.5 h-3.5" />
                {starPlants.length} {tr.shareGardenStarTrees}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-300">
                <Sprout className="w-3.5 h-3.5" />
                {companions.length} {tr.shareGardenCompanions}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
            {uniqueStarTrees.map((st, i) => (
              <span
                key={`st-${i}`}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-[11px] font-semibold text-white"
              >
                <span className="w-2.5 h-2.5 rounded-full border border-white shrink-0" style={{ backgroundColor: st.color }} />
                <span>{st.count}× {st.name}</span>
              </span>
            ))}
            {uniqueCompanions.slice(0, 6).map((c, i) => (
              <span
                key={`c-${i}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-800/90 border border-stone-700 text-[10px] text-stone-200"
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span>{c.count}× {c.name}</span>
              </span>
            ))}
            {uniqueCompanions.length > 6 && (
              <span className="px-2 py-0.5 rounded-md bg-stone-800 text-[10px] text-stone-400">
                +{uniqueCompanions.length - 6} {tr.embedCardMore}
              </span>
            )}
          </div>

          {showActionBtn && actionUrl && (
            <div className="pt-2">
              <a
                href={actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                <span>{tr.gardenPlanOpenInGardenGrid}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ShareGardenModalProps {
  isOpen: boolean;
  onClose: () => void;
  gardenName: string;
  starPlants: GardenStarPlantInstance[];
  companions: GardenCompanionInstance[];
  selectedSoil: SoilType;
  selectedZone: ClimateZone;
  hemisphere: Hemisphere;
  language: Language;
  autoShadeEnabled?: boolean;
  treeAge?: TreeAgeMode;
  infrastructure?: GardenInfrastructure;
}

export const ShareGardenModal: React.FC<ShareGardenModalProps> = ({
  isOpen,
  onClose,
  gardenName,
  starPlants,
  companions,
  selectedSoil,
  selectedZone,
  hemisphere,
  language,
  autoShadeEnabled = false,
  treeAge,
  infrastructure,
}) => {
  const tr = t(language);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'embed'>('link');

  if (!isOpen) return null;

  const encodePayload = {
    gardenName,
    starPlants: starPlants.map(sp => ({
      treeId: sp.treeId,
      xM: sp.xM,
      yM: sp.yM,
      selectedPlantIds: sp.selectedPlantIds || [],
    })),
    soil: selectedSoil,
    zone: selectedZone,
    hemisphere,
    language,
    autoShadeEnabled,
    treeAge,
    infrastructure,
  };

  const shareUrl = buildGardenShareUrl(encodePayload);
  const embedUrl = buildGardenEmbedUrl(encodePayload);
  const iframeSnippet = buildEmbedIframeCode(embedUrl, 640, 360);

  const displayTitle = gardenName || tr.gardenPageDefaultName;
  const shareTitle = `${displayTitle} • Pflanzengilde.de`;
  const shareText = tr.shareGardenShareText
    .replace('{stars}', String(starPlants.length))
    .replace('{companions}', String(companions.length));

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error('Failed to copy garden share link', e);
    }
  };

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(iframeSnippet);
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2500);
    } catch (e) {
      console.error('Failed to copy garden embed code', e);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // cancelled by the user
      }
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-forest-100 text-forest-700">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                {tr.shareGardenTitle}
              </h3>
              <p className="text-xs text-stone-500">
                {tr.shareGardenSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label={tr.closeBtn}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-forest-600" />
                <span>{tr.shareGardenPreview}</span>
              </div>
              <span className="text-[10px] text-stone-500">
                {starPlants.length} {tr.shareGardenStarTrees} • {companions.length} {tr.gardenSidebarCompanions}
              </span>
            </div>

            <div className="rounded-2xl shadow-md ring-1 ring-stone-200 overflow-hidden">
              <GardenEmbedCard
                gardenName={gardenName}
                starPlants={starPlants}
                companions={companions}
                soil={selectedSoil}
                zone={selectedZone}
                language={language}
                showActionBtn={false}
              />
            </div>
          </div>

          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('link')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'link'
                  ? 'bg-white text-forest-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{tr.shareCopyLink}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('embed')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'embed'
                  ? 'bg-white text-forest-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>{tr.shareEmbedCode}</span>
            </button>
          </div>

          {activeTab === 'link' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-700 font-mono select-all focus:outline-none focus:ring-2 focus:ring-forest-500"
                  onClick={e => (e.target as HTMLInputElement).select()}
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    copiedLink
                      ? 'bg-emerald-600 text-white'
                      : 'bg-forest-700 hover:bg-forest-800 text-white'
                  }`}
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? tr.shareLinkCopied : tr.shareCopyLink}</span>
                </button>
              </div>

              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  {tr.shareGuildShareDirectly}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-xs font-semibold text-stone-700 hover:text-emerald-800 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-stone-200 hover:border-sky-400 hover:bg-sky-50/50 text-xs font-semibold text-stone-700 hover:text-sky-800 transition-colors"
                  >
                    <Send className="w-4 h-4 text-sky-500" />
                    <span>Telegram</span>
                  </a>

                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-stone-700" />
                    <span>X / Post</span>
                  </a>

                  <a
                    href={emailUrl}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 text-xs font-semibold text-stone-700 hover:text-amber-900 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-amber-600" />
                    <span>E-Mail</span>
                  </a>
                </div>

                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="w-full mt-2 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-forest-600" />
                    <span>{tr.shareGardenMoreOptions}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-stone-600">
                {tr.shareGardenEmbedHint}
              </p>
              <div className="relative">
                <textarea
                  readOnly
                  rows={3}
                  value={iframeSnippet}
                  onClick={e => (e.target as HTMLTextAreaElement).select()}
                  className="w-full bg-stone-900 text-stone-100 font-mono text-[11px] p-3 rounded-xl border border-stone-700 focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
                <button
                  type="button"
                  onClick={handleCopyEmbed}
                  className={`mt-2 w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    copiedEmbed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-forest-700 hover:bg-forest-800 text-white'
                  }`}
                >
                  {copiedEmbed ? <Check className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                  <span>{copiedEmbed ? tr.shareEmbedCodeCopied : tr.shareEmbedCode}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
