import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types/guild';
import { Sprout, RotateCcw, Download, Upload, FileText, FileJson, Calendar, BookOpen, MoreVertical, Share2, Grid } from 'lucide-react';
import { t } from '../i18n/translations';

interface NavbarProps {
  language: Language;
  setLanguage: (l: Language) => void;
  currentPath: string;
  onNavigate: (path: string) => void;
  onReset: () => void;
  onLoadPreset?: (presetName: 'apple' | 'walnut' | 'apricot' | 'minimal') => void;
  onExportJson: () => void;
  onExportPdf: () => void;
  onExportCalendar: () => void;
  onImportJson: (file: File) => void;
  onShare?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  currentPath,
  onNavigate,
  onReset,
  onLoadPreset,
  onExportJson,
  onExportPdf,
  onExportCalendar,
  onImportJson,
  onShare,
}) => {
  const tr = t(language);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // currentPath carries query and hash (e.g. "/?g=..." from a share link)
  const pathname = currentPath.split(/[?#]/)[0];
  const isPlanner = pathname === '/' || pathname === '';
  const isGarden = currentPath.startsWith('/garten') || currentPath.startsWith('/garden');
  const showActions = isPlanner || isGarden;

  const [openMenu, setOpenMenu] = useState<'export' | 'mobile-more' | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        exportRef.current && !exportRef.current.contains(target) &&
        mobileMenuRef.current && !mobileMenuRef.current.contains(target)
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        onImportJson(files[i]);
      }
      e.target.value = '';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-6 shrink-0 min-w-0">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="flex items-center space-x-2 sm:space-x-3 text-left focus:outline-none cursor-pointer group shrink-0"
            title={tr.appTitle}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-forest-600 text-white flex items-center justify-center shadow-md shadow-forest-600/20 group-hover:scale-105 transition-transform shrink-0">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="hidden sm:block shrink-0">
              <div className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2 group-hover:text-forest-900 transition-colors whitespace-nowrap">
                <span>Pflanzengilde<span className="text-forest-600">.de</span></span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 uppercase tracking-wider shrink-0">
                  {tr.badge}
                </span>
              </div>
              <p className="text-xs text-stone-500 whitespace-nowrap hidden lg:block font-normal">
                {tr.appSubtitle}
              </p>
            </div>
          </button>

          <nav className="flex items-center bg-stone-100/90 p-0.5 sm:p-1 rounded-xl border border-stone-200 text-xs shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                isPlanner
                  ? 'bg-white text-forest-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 text-forest-600 shrink-0" />
              <span>{tr.navPlanner}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/garten')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                isGarden
                  ? 'bg-white text-forest-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-forest-600 shrink-0" />
              <span>{tr.navGarden}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/guides')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                currentPath.startsWith('/guides')
                  ? 'bg-white text-forest-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-forest-600 shrink-0" />
              <span>{tr.navGuides}</span>
            </button>
          </nav>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
          {showActions && (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="hidden md:flex px-2.5 sm:px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 items-center gap-1.5 transition-colors cursor-pointer"
                title={tr.importPlan}
              >
                <Upload className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                <span>{tr.importPlan}</span>
              </button>

              {onShare && (
                <button
                  type="button"
                  onClick={onShare}
                  className="hidden sm:flex px-2.5 sm:px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900 items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
                  title={isGarden ? tr.navbarShareGarden : tr.shareGuildTitle}
                >
                  <Share2 className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                  <span>{isGarden ? tr.navbarShareGarden : tr.shareGuildBtn}</span>
                </button>
              )}

              {/* Opens on hover (desktop) or click (touch) */}
              <div ref={exportRef} className="relative group shrink-0">
                <button
                  type="button"
                  onClick={() => setOpenMenu(prev => prev === 'export' ? null : 'export')}
                  aria-expanded={openMenu === 'export'}
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-forest-700 text-white text-xs font-medium hover:bg-forest-800 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">{tr.exportMenu}</span>
                </button>
                <div
                  className={`absolute right-0 top-full pt-1.5 w-56 z-50 animate-in fade-in zoom-in-95 ${
                    openMenu === 'export' ? 'block' : 'hidden group-hover:block'
                  }`}
                >
                  <div className="bg-white border border-stone-200 rounded-xl shadow-xl py-1.5 relative before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']">
                    <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      {isGarden ? tr.navbarExportGardenPlan : tr.exportPlan}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onExportPdf();
                        setOpenMenu(null);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-forest-50 hover:text-forest-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                      <div>
                        <div className="font-semibold text-stone-800">{tr.exportPdf}</div>
                        <div className="text-[10px] text-stone-500">
                          {isGarden
                            ? tr.navbarPdfGardenSub
                            : tr.navbarPdfGuildSub}
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onExportCalendar();
                        setOpenMenu(null);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-forest-50 hover:text-forest-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <div className="font-semibold text-stone-800">{tr.exportCalendar}</div>
                        <div className="text-[10px] text-stone-500">
                          {isGarden
                            ? tr.navbarCalendarGardenSub
                            : tr.exportCalendarSub}
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onExportJson();
                        setOpenMenu(null);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-forest-50 hover:text-forest-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <FileJson className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-semibold text-stone-800">{tr.exportJson}</div>
                        <div className="text-[10px] text-stone-500">
                          {isGarden
                            ? tr.navbarJsonGardenSub
                            : tr.navbarJsonGuildSub}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onReset}
                className="hidden md:block p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
                title={tr.resetGuild}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div ref={mobileMenuRef} className="relative md:hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setOpenMenu(prev => prev === 'mobile-more' ? null : 'mobile-more')}
                  aria-expanded={openMenu === 'mobile-more'}
                  className="p-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                  title={tr.moreOptions}
                  aria-label={tr.moreOptions}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {openMenu === 'mobile-more' && (
                  <div className="absolute right-0 top-full pt-1.5 w-52 z-50 animate-in fade-in zoom-in-95">
                    <div className="bg-white border border-stone-200 rounded-2xl shadow-xl p-2 space-y-1">
                      {onShare && (
                        <button
                          type="button"
                          onClick={() => {
                            onShare();
                            setOpenMenu(null);
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-stone-50 text-xs font-medium text-stone-700"
                        >
                          <Share2 className="w-4 h-4 text-forest-600" />
                          <span>{isGarden ? tr.navbarShareGarden : tr.shareGuildTitle}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          fileInputRef.current?.click();
                          setOpenMenu(null);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-stone-50 text-xs font-medium text-stone-700"
                      >
                        <Upload className="w-4 h-4 text-stone-600" />
                        <span>{tr.importPlan}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onReset();
                          setOpenMenu(null);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-rose-50 text-xs font-medium text-rose-700"
                      >
                        <RotateCcw className="w-4 h-4 text-rose-600" />
                        <span>{tr.resetGuild}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden sm:block h-5 w-px bg-stone-200" />
            </>
          )}

          <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setLanguage('de')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                language === 'de'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              DE
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,application/json"
        multiple
        className="hidden"
      />
    </header>
  );
};
