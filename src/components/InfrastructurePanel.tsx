import React from 'react';
import { Circle, Fence, Lasso, Square, Trash2, AlertTriangle, Info, BookOpen, CheckCircle2 } from 'lucide-react';
import { GardenCompanionInstance, GardenInfrastructure, GardenSiteWarning, GardenStarPlantInstance, GardenShape } from '../types/garden';
import { Language, getLoc } from '../types/guild';
import { t, formatNumber } from '../i18n/translations';
import { InfraShapeKind, InfraTool } from './GardenInfrastructureLayer';
import { shapeAreaM2 } from '../core/geometry2d';
import { bedLabel } from '../core/gardenSite';
import { compartmentAt } from '../core/compartments';
import { CollapseChevron, useCollapsible } from './useCollapsible';

interface InfrastructurePanelProps {
  language: Language;
  infrastructure: GardenInfrastructure;
  tool: InfraTool | null;
  onSelectTool: (tool: InfraTool | null) => void;
  selectedShapeId: string | null;
  onSelectShape: (id: string | null) => void;
  onDeleteShape: (id: string) => void;
  onUpdateBedHeight: (id: string, heightM: number) => void;
  siteWarnings: GardenSiteWarning[];
  starPlants: GardenStarPlantInstance[];
  companions: GardenCompanionInstance[];
  onNavigate?: (path: string) => void;
}

const SHAPES: { kind: InfraShapeKind; Icon: typeof Square }[] = [
  { kind: 'RECT', Icon: Square },
  { kind: 'CIRCLE', Icon: Circle },
  { kind: 'LASSO', Icon: Lasso },
];

/** Left-column card: drawing tools for the garden outline and raised beds, bed list, site warnings. */
export const InfrastructurePanel: React.FC<InfrastructurePanelProps> = ({
  language, infrastructure, tool, onSelectTool, selectedShapeId, onSelectShape, onDeleteShape, onUpdateBedHeight,
  siteWarnings, starPlants, companions, onNavigate,
}) => {
  const tr = t(language);
  const { isOpen, toggle } = useCollapsible();
  const header = (key: string, text: string) => (
    <button type="button" onClick={() => toggle(key)} aria-expanded={isOpen(key)} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-stone-500 cursor-pointer">
      <CollapseChevron open={isOpen(key)} />
      {text}
    </button>
  );
  const label = (k: InfraShapeKind) => (k === 'RECT' ? tr.infraRect : k === 'CIRCLE' ? tr.infraCircle : tr.infraLasso);
  const hint = (k: InfraShapeKind) => (k === 'RECT' ? tr.infraRectHint : k === 'CIRCLE' ? tr.infraCircleHint : tr.infraLassoHint);
  const area = (s: GardenShape) => tr.infraArea.replace('{area}', formatNumber(shapeAreaM2(s), 1, language));

  const toolButtons = (target: 'OUTLINE' | 'BED') => (
    <div className="flex items-center gap-1">
      {SHAPES.map(({ kind, Icon }) => {
        const active = tool?.target === target && tool.shape === kind;
        return (
          <button
            key={kind}
            type="button"
            title={hint(kind)}
            onClick={() => onSelectTool(active ? null : { target, shape: kind })}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${
              active ? 'bg-forest-600 text-white border-forest-600' : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label(kind)}</span>
          </button>
        );
      })}
    </div>
  );

  const items = [...starPlants.map(s => ({ x: s.xM, y: s.yM })), ...companions.map(c => ({ x: c.xM, y: c.yM }))];
  const contents = (bedId: string) => items.filter(i => compartmentAt(i.x, i.y, infrastructure.raisedBeds) === bedId).length;
  const guide = () => onNavigate?.('/guides?tab=raised_beds');

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 space-y-3">
      <div role="button" tabIndex={0} aria-expanded={isOpen('card')} onClick={() => toggle('card')}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle('card'); } }}
        className="flex items-center gap-2 cursor-pointer select-none">
        <CollapseChevron open={isOpen('card')} className="w-4 h-4 text-stone-400 shrink-0" />
        <Fence className="w-4 h-4 text-amber-800" />
        <div>
          <h3 className="text-sm font-bold text-stone-900">{tr.infraTitle}</h3>
          <p className="text-[11px] text-stone-500">{tr.infraSubtitle}</p>
        </div>
      </div>

      {isOpen('card') && (<>
      {tool && (
        <div className="text-[11px] font-semibold text-forest-800 bg-forest-50 border border-forest-200 rounded-lg px-2 py-1">
          {tr.infraDrawing} · {hint(tool.shape)}
        </div>
      )}

      <section className="space-y-1.5">
        {header('shape', tr.infraGardenShape)}
        {isOpen('shape') && (<>
        {toolButtons('OUTLINE')}
        {infrastructure.outline ? (
          <div className={`flex items-center justify-between text-xs rounded-lg border px-2 py-1 ${selectedShapeId === 'outline' ? 'border-stone-500 bg-stone-50' : 'border-stone-200'}`}>
            <button type="button" className="font-semibold text-stone-800 cursor-pointer" onClick={() => onSelectShape('outline')} title={tr.infraSelect}>
              {label(infrastructure.outline.kind === 'POLYGON' ? 'LASSO' : infrastructure.outline.kind)} · {area(infrastructure.outline)}
            </button>
            <button type="button" onClick={() => onDeleteShape('outline')} className="text-stone-400 hover:text-rose-600 cursor-pointer" title={tr.infraDelete}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="text-[11px] text-stone-400 italic">{tr.infraNoOutline}</div>
        )}
        </>)}
      </section>

      <section className="space-y-1.5">
        {header('beds', `${tr.infraRaisedBeds} (${infrastructure.raisedBeds.length})`)}
        {isOpen('beds') && (<>
        {toolButtons('BED')}
        {infrastructure.raisedBeds.length === 0 && <div className="text-[11px] text-stone-400 italic">{tr.infraNoBeds}</div>}
        <ul className="space-y-1">
          {infrastructure.raisedBeds.map((b, i) => {
            const warn = siteWarnings.some(w => w.bedId === b.id && w.severity === 'WARNING');
            return (
              <li key={b.id} className={`flex items-center gap-2 text-xs rounded-lg border px-2 py-1 ${selectedShapeId === b.id ? 'border-amber-700 bg-amber-50' : 'border-stone-200'}`}>
                <button type="button" className="flex-1 text-left cursor-pointer" onClick={() => onSelectShape(b.id)} title={tr.infraSelect}>
                  <span className="font-semibold text-stone-800">{b.name || getLoc(bedLabel(i), language)}</span>
                  <span className="text-stone-500"> · {area(b.shape)} · {tr.infraBedContents.replace('{n}', String(contents(b.id)))}</span>
                  {warn && <AlertTriangle className="inline w-3.5 h-3.5 text-amber-600 ml-1 -mt-0.5" />}
                </button>
                <label className="flex items-center gap-1 text-[11px] text-stone-500">
                  {tr.infraHeight}
                  <input
                    type="number" min={10} max={150} step={5}
                    value={Math.round(b.heightM * 100)}
                    onChange={e => {
                      const cm = Number(e.target.value);
                      if (Number.isFinite(cm) && cm >= 5 && cm <= 200) onUpdateBedHeight(b.id, cm / 100);
                    }}
                    className="w-14 px-1 py-0.5 rounded border border-stone-300 text-xs text-stone-800"
                  />
                  cm
                </label>
                <button type="button" onClick={() => onDeleteShape(b.id)} className="text-stone-400 hover:text-rose-600 cursor-pointer" title={tr.infraDelete}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
        <p className="text-[10.5px] text-stone-500 leading-snug">
          {tr.infraLinedHint}{' '}
          <button type="button" onClick={guide} className="inline-flex items-center gap-0.5 text-forest-700 font-semibold underline cursor-pointer">
            <BookOpen className="w-3 h-3" />{tr.infraGuideLink}
          </button>
        </p>
        </>)}
      </section>

      {siteWarnings.length > 0 && (
        <section className="space-y-1.5 pt-2 border-t border-stone-100">
          {header('warnings', `${tr.infraSiteWarnings} (${siteWarnings.length})`)}
          {isOpen('warnings') && <ul className="space-y-1.5">
            {siteWarnings.map(w => {
              const isWarn = w.severity === 'WARNING';
              const positive = w.kind === 'BED_RECOMMENDED';
              const Icon = isWarn ? AlertTriangle : positive ? CheckCircle2 : Info;
              return (
                <li key={w.id} className={`text-[11px] rounded-lg border px-2 py-1.5 ${isWarn ? 'bg-amber-50 border-amber-300 text-amber-950' : positive ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-sky-50 border-sky-200 text-sky-950'}`}>
                  <div className="flex items-start gap-1.5">
                    <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isWarn ? 'text-amber-600' : positive ? 'text-emerald-600' : 'text-sky-600'}`} />
                    <div>
                      <div className="font-bold">{getLoc(w.title, language)}</div>
                      <div className="leading-snug opacity-90">{getLoc(w.description, language)}</div>
                      {w.guideHash && (
                        <button type="button" onClick={() => onNavigate?.(`/guides?tab=raised_beds#${w.guideHash}`)} className="mt-0.5 underline font-semibold cursor-pointer">
                          {tr.infraGuideLink}
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>}
        </section>
      )}
      </>)}
    </div>
  );
};
