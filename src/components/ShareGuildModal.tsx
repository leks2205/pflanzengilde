import React, { useEffect, useState } from 'react';
import { ClimateZone, GuildPlant, Hemisphere, Language, SoilType, StarTree, getLoc } from '../types/guild';
import { GuildEmbedCard } from './GuildEmbedCard';
import { buildEmbedIframeCode, buildEmbedUrl, buildShareUrl } from '../utils/shareUtils';
import { X, Copy, Check, Share2, Code, MessageCircle, Send, Mail, Sparkles } from 'lucide-react';
import { t } from '../i18n/translations';

interface ShareGuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  starTree: StarTree;
  selectedPlants: GuildPlant[];
  selectedSoil?: SoilType;
  selectedZone?: ClimateZone;
  hemisphere?: Hemisphere;
  language: Language;
}

export const ShareGuildModal: React.FC<ShareGuildModalProps> = ({
  isOpen,
  onClose,
  starTree,
  selectedPlants,
  selectedSoil,
  selectedZone,
  hemisphere,
  language,
}) => {
  const tr = t(language);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'embed'>('link');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shareUrl = buildShareUrl({
    starTree,
    selectedPlants,
    soil: selectedSoil,
    zone: selectedZone,
    hemisphere,
    language,
    useShareRoute: true,
  });

  const directPlannerUrl = buildShareUrl({
    starTree,
    selectedPlants,
    soil: selectedSoil,
    zone: selectedZone,
    hemisphere,
    language,
    useShareRoute: false,
  });

  const embedUrl = buildEmbedUrl({
    starTree,
    selectedPlants,
    soil: selectedSoil,
    zone: selectedZone,
    hemisphere,
    language,
  });

  const iframeSnippet = buildEmbedIframeCode(embedUrl);

  const treeName = getLoc(starTree.commonName, language);
  const shareTitle = `${treeName} ${tr.permacultureGuildLabel}`;
  const shareText = tr.shareGuildShareText.replace('{tree}', treeName);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error('Failed to copy share link', e);
    }
  };

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(iframeSnippet);
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2500);
    } catch (e) {
      console.error('Failed to copy embed code', e);
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
        // Dismissing the share sheet rejects with AbortError.
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
      role="dialog"
      aria-modal="true"
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
                {tr.shareGuildTitle}
              </h3>
              <p className="text-xs text-stone-500">
                {tr.shareGuildDesc}
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
                <span>{tr.shareEmbedPreview}</span>
              </div>
              <span className="text-[10px] text-stone-500">
                {tr.shareGuildPreviewTitle}
              </span>
            </div>

            <div className="rounded-2xl shadow-md ring-1 ring-stone-200 overflow-hidden">
              <GuildEmbedCard
                starTree={starTree}
                selectedPlants={selectedPlants}
                language={language}
                compact={false}
                showActionBtn={false}
                actionUrl={directPlannerUrl}
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
                    <svg className="w-3.5 h-3.5 fill-current text-stone-800" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>X / Twitter</span>
                  </a>

                  <a
                    href={emailUrl}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 text-xs font-semibold text-stone-700 hover:text-amber-800 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-amber-600" />
                    <span>E-Mail</span>
                  </a>
                </div>

                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="w-full mt-2 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-forest-600" />
                    <span>{tr.shareGuildShareViaDevice}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-stone-500">
                {tr.shareGuildEmbedInstructions}
              </p>

              <div className="relative">
                <textarea
                  readOnly
                  rows={3}
                  value={iframeSnippet}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-700 font-mono select-all focus:outline-none focus:ring-2 focus:ring-forest-500"
                  onClick={e => (e.target as HTMLTextAreaElement).select()}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCopyEmbed}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    copiedEmbed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-forest-700 hover:bg-forest-800 text-white'
                  }`}
                >
                  {copiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
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
