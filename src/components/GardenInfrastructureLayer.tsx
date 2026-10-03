import React, { useEffect, useRef, useState } from 'react';
import { GardenInfrastructure, GardenShape, RaisedBed } from '../types/garden';
import { Language, getLoc } from '../types/guild';
import { Pt, isSimplePolygon, lassoToPolygon, rectFromCorners, shapeToPolygon, snapM, translateShape } from '../core/geometry2d';
import { bedLabel } from '../core/gardenSite';
import { formatNumber } from '../i18n/translations';

export type InfraShapeKind = 'RECT' | 'CIRCLE' | 'LASSO';
export interface InfraTool {
  target: 'OUTLINE' | 'BED';
  shape: InfraShapeKind;
}

interface GardenInfrastructureLayerProps {
  language: Language;
  infrastructure: GardenInfrastructure;
  tool: InfraTool | null;
  /** 'outline' or a bed id. */
  selectedShapeId: string | null;
  onSelectShape: (id: string | null) => void;
  onCommitShape: (target: 'OUTLINE' | 'BED', shape: GardenShape) => void;
  onUpdateShape: (id: string, shape: GardenShape) => void;
  onCancelTool: () => void;
  toScreen: (xM: number, yM: number) => { x: number; y: number };
  clientToMetric: (clientX: number, clientY: number) => { xM: number; yM: number };
  zoom: number;
  width: number;
  height: number;
  /** Select mode: shapes can be picked and edited. */
  editable: boolean;
}

const path = (pts: Array<{ x: number; y: number }>) => (pts.length ? `M${pts.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('L')}Z` : '');

type Drag =
  | { kind: 'MOVE'; id: string; start: Pt; orig: GardenShape }
  | { kind: 'RECT_CORNER'; id: string; fixed: Pt }
  | { kind: 'CIRCLE_R'; id: string; centre: Pt }
  | { kind: 'VERTEX'; id: string; index: number; orig: GardenShape };

/**
 * Garden outline and raised beds on the grid: drawing tools (rectangle/square with Shift, circle,
 * freehand lasso that closes on release like the Concepts app) and editing (move, resize, drag
 * polygon vertices). Changes are committed on pointer-up so the optimizer runs once per edit.
 */
export function useGardenInfrastructureLayer({
  language, infrastructure, tool, selectedShapeId, onSelectShape, onCommitShape, onUpdateShape, onCancelTool,
  toScreen, clientToMetric, zoom, width, height, editable,
}: GardenInfrastructureLayerProps): { base: React.ReactNode; top: React.ReactNode } {
  const [draft, setDraft] = useState<{ start: Pt; current: Pt; lasso: Pt[]; shift: boolean } | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [preview, setPreview] = useState<{ id: string; shape: GardenShape } | null>(null);
  const draftRef = useRef(draft);
  draftRef.current = draft;

  useEffect(() => {
    if (!tool) setDraft(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDraft(null);
        onCancelTool();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tool, onCancelTool]);

  const shapeOf = (id: string): GardenShape | null => {
    if (preview && preview.id === id) return preview.shape;
    if (id === 'outline') return infrastructure.outline;
    return infrastructure.raisedBeds.find(b => b.id === id)?.shape ?? null;
  };

  // ── Drawing ─────────────────────────────────────────────────────────────────────────────────────
  const metricPt = (e: React.PointerEvent, snap: boolean): Pt => {
    const { xM, yM } = clientToMetric(e.clientX, e.clientY);
    return snap ? [snapM(xM), snapM(yM)] : [xM, yM];
  };
  const draftShape = (): GardenShape | null => {
    if (!tool || !draft) return null;
    if (tool.shape === 'RECT') {
      let [ax, ay] = draft.start;
      let [bx, by] = draft.current;
      if (draft.shift) {
        const side = Math.max(Math.abs(bx - ax), Math.abs(by - ay));
        bx = ax + Math.sign(bx - ax || 1) * side;
        by = ay + Math.sign(by - ay || 1) * side;
      }
      return rectFromCorners([ax, ay], [bx, by]);
    }
    if (tool.shape === 'CIRCLE') {
      return { kind: 'CIRCLE', cxM: draft.start[0], cyM: draft.start[1], rM: Math.hypot(draft.current[0] - draft.start[0], draft.current[1] - draft.start[1]) };
    }
    return draft.lasso.length >= 3 ? { kind: 'POLYGON', points: draft.lasso } : null;
  };
  const onDrawDown = (e: React.PointerEvent) => {
    if (!tool) return;
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    const p = metricPt(e, tool.shape !== 'LASSO');
    setDraft({ start: p, current: p, lasso: [p], shift: e.shiftKey });
  };
  const onDrawMove = (e: React.PointerEvent) => {
    const d = draftRef.current;
    if (!tool || !d) return;
    const p = metricPt(e, tool.shape !== 'LASSO');
    const last = d.lasso[d.lasso.length - 1];
    const lasso = tool.shape === 'LASSO' && Math.hypot(p[0] - last[0], p[1] - last[1]) > 2 / zoom ? [...d.lasso, p] : d.lasso;
    setDraft({ ...d, current: p, lasso, shift: e.shiftKey });
  };
  const onDrawUp = () => {
    if (!tool || !draft) return;
    let shape = draftShape();
    setDraft(null);
    if (!shape) return;
    if (shape.kind === 'RECT' && (shape.wM < 0.5 || shape.hM < 0.5)) return;
    if (shape.kind === 'CIRCLE' && shape.rM < 0.25) return;
    if (shape.kind === 'POLYGON') {
      const pts = lassoToPolygon(shape.points, 0.05);
      if (pts.length < 3 || !isSimplePolygon(pts)) return;
      shape = { kind: 'POLYGON', points: pts };
    }
    onCommitShape(tool.target, shape);
  };

  // ── Editing ─────────────────────────────────────────────────────────────────────────────────────
  const startDrag = (e: React.PointerEvent, d: Drag) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    setDrag(d);
  };
  const onEditMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const shape = shapeOf(drag.id);
    if (!shape) return;
    const { xM, yM } = clientToMetric(e.clientX, e.clientY);
    const p: Pt = [snapM(xM), snapM(yM)];
    let next: GardenShape | null = null;
    if (drag.kind === 'MOVE') next = translateShape(drag.orig, p[0] - drag.start[0], p[1] - drag.start[1]);
    else if (drag.kind === 'RECT_CORNER') next = rectFromCorners(drag.fixed, p);
    else if (drag.kind === 'CIRCLE_R') next = { kind: 'CIRCLE', cxM: drag.centre[0], cyM: drag.centre[1], rM: Math.max(0.25, Math.hypot(p[0] - drag.centre[0], p[1] - drag.centre[1])) };
    else if (drag.kind === 'VERTEX' && drag.orig.kind === 'POLYGON') {
      const pts = drag.orig.points.map((q, i) => (i === drag.index ? ([xM, yM] as Pt) : q));
      next = { kind: 'POLYGON', points: pts };
    }
    if (next) setPreview({ id: drag.id, shape: next });
  };
  const onEditUp = () => {
    if (drag && preview && preview.id === drag.id) {
      const s = preview.shape;
      const ok = s.kind !== 'POLYGON' || isSimplePolygon(s.points);
      if (ok) onUpdateShape(drag.id, s);
    }
    setDrag(null);
    setPreview(null);
  };

  const renderShape = (id: string, shape: GardenShape, isBed: boolean, label?: string) => {
    const pts = shapeToPolygon(shape).map(([x, y]) => toScreen(x, y));
    const selected = selectedShapeId === id;
    const d = path(pts);
    const centre = pts.reduce((a, p) => ({ x: a.x + p.x / pts.length, y: a.y + p.y / pts.length }), { x: 0, y: 0 });
    return (
      <g key={id} data-infra={id}>
        <path
          d={d}
          fill={isBed ? '#92400e' : 'none'}
          fillOpacity={isBed ? 0.16 : 0}
          stroke={isBed ? '#78350f' : '#1c1917'}
          strokeWidth={selected ? 3 : isBed ? 2 : 2.5}
          strokeDasharray={isBed ? undefined : '10 5'}
          style={{ cursor: editable ? 'move' : 'default', pointerEvents: editable && !tool ? (isBed ? 'all' : 'stroke') : 'none' }}
          onPointerDown={e => {
            if (!editable || tool) return;
            onSelectShape(id);
            const { xM, yM } = clientToMetric(e.clientX, e.clientY);
            startDrag(e, { kind: 'MOVE', id, start: [snapM(xM), snapM(yM)], orig: shape });
          }}
          onPointerMove={onEditMove}
          onPointerUp={onEditUp}
        />
        {label && (
          <text x={centre.x} y={centre.y} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#78350f" pointerEvents="none" className="select-none">
            {label}
          </text>
        )}
      </g>
    );
  };

  const handle = (key: string, x: number, y: number, onDown: (e: React.PointerEvent) => void) => (
    <circle key={key} cx={x} cy={y} r={6} fill="#ffffff" stroke="#78350f" strokeWidth={2}
      style={{ cursor: 'grab', pointerEvents: 'all' }}
      onPointerDown={onDown} onPointerMove={onEditMove} onPointerUp={onEditUp} />
  );
  const renderHandles = (id: string, shape: GardenShape) => {
    if (shape.kind === 'RECT') {
      const c: Pt[] = [[shape.xM, shape.yM], [shape.xM + shape.wM, shape.yM], [shape.xM + shape.wM, shape.yM + shape.hM], [shape.xM, shape.yM + shape.hM]];
      return c.map((p, i) => {
        const s = toScreen(p[0], p[1]);
        const opp = c[(i + 2) % 4];
        return handle(`h${i}`, s.x, s.y, e => startDrag(e, { kind: 'RECT_CORNER', id, fixed: opp }));
      });
    }
    if (shape.kind === 'CIRCLE') {
      const s = toScreen(shape.cxM + shape.rM, shape.cyM);
      return [handle('hr', s.x, s.y, e => startDrag(e, { kind: 'CIRCLE_R', id, centre: [shape.cxM, shape.cyM] }))];
    }
    // Freehand shapes stay a plain outline (no vertex circles); move them, or redraw to reshape
    return null;
  };

  const outline = shapeOf('outline');
  const ds = draftShape();
  const base = (
    <g id="garden-infrastructure">
      {outline && (
        <>
          {/* dim everything outside the garden */}
          <path
            d={`M0 0H${width}V${height}H0Z${path(shapeToPolygon(outline).map(([x, y]) => toScreen(x, y)))}`}
            fill="#78716c" fillOpacity={0.12} fillRule="evenodd" pointerEvents="none"
          />
          {renderShape('outline', outline, false)}
        </>
      )}
      {infrastructure.raisedBeds.map((b: RaisedBed, i) => {
        const shape = shapeOf(b.id) ?? b.shape;
        const name = b.name || getLoc(bedLabel(i), language);
        return renderShape(b.id, shape, true, `${name} · ${formatNumber(b.heightM * 100, 0, language)} cm`);
      })}
    </g>
  );
  const selShape = selectedShapeId ? shapeOf(selectedShapeId) : null;
  const top = (
    <g id="garden-infrastructure-tools">
      {selShape && selectedShapeId && editable && !tool && renderHandles(selectedShapeId, selShape)}
      {tool && (
        <rect
          x={0} y={0} width={width} height={height} fill="transparent"
          style={{ cursor: 'crosshair', pointerEvents: 'all', touchAction: 'none' }}
          onPointerDown={onDrawDown} onPointerMove={onDrawMove} onPointerUp={onDrawUp}
        />
      )}
      {ds && (
        <path
          d={tool?.shape === 'LASSO' && draft
            ? `M${draft.lasso.map(([x, y]) => { const sc = toScreen(x, y); return `${sc.x.toFixed(1)} ${sc.y.toFixed(1)}`; }).join('L')}`
            : path(shapeToPolygon(ds).map(([x, y]) => toScreen(x, y)))}
          fill={tool?.target === 'BED' ? '#92400e' : 'none'} fillOpacity={0.12}
          stroke={tool?.target === 'BED' ? '#78350f' : '#1c1917'} strokeWidth={2} strokeDasharray="6 4" pointerEvents="none"
        />
      )}
    </g>
  );
  return { base, top };
}
