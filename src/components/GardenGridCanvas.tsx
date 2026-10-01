import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { GuildPlant, Language, getLoc } from '../types/guild';
import { GardenCompanionInstance, GardenConflict, GardenShadePocket, GardenStarPlantInstance } from '../types/garden';
import { ZoomIn, ZoomOut, Maximize2, Sparkles, Move, Trees, MousePointer, Hand } from 'lucide-react';
import { t, formatNumber } from '../i18n/translations';

// Stable default so the selection-sync effect doesn't re-fire on every render
const NO_IDS: string[] = [];

interface GardenGridCanvasProps {
  language: Language;
  starPlants: GardenStarPlantInstance[];
  companions: GardenCompanionInstance[];
  conflicts: GardenConflict[];
  shadePockets: GardenShadePocket[];
  selectedTreeId: string | null;
  selectedTreeIds?: string[];
  onSelectTree: (instanceId: string | null) => void;
  onSelectTreeIds?: (instanceIds: string[]) => void;
  onUpdateStarPlantPosition: (instanceId: string, xM: number, yM: number) => void;
  onBatchUpdateTrees?: (updated: GardenStarPlantInstance[]) => void;
  onDeleteTrees?: (instanceIds: string[]) => void;
  onPasteTrees?: (treesToPaste: GardenStarPlantInstance[]) => void;
  onSelectCompanion?: (plant: GuildPlant) => void;
  onDropJsonFile?: (file: File, xM: number, yM: number) => void;
}

export const GardenGridCanvas: React.FC<GardenGridCanvasProps> = ({
  language,
  starPlants,
  companions,
  conflicts,
  shadePockets,
  selectedTreeId,
  selectedTreeIds = NO_IDS,
  onSelectTree,
  onSelectTreeIds,
  onUpdateStarPlantPosition,
  onBatchUpdateTrees,
  onDeleteTrees,
  onPasteTrees,
  onSelectCompanion,
  onDropJsonFile,
}) => {
  const tr = t(language);
  const containerRef = useRef<HTMLDivElement>(null);

  const [toolMode, setToolMode] = useState<'PAN' | 'SELECT'>('PAN');
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(() =>
    selectedTreeIds.length > 0 ? selectedTreeIds : (selectedTreeId ? [selectedTreeId] : [])
  );

  const [isSelectingMarquee, setIsSelectingMarquee] = useState(false);
  const [marqueeStart, setMarqueeStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [marqueeCurrent, setMarqueeCurrent] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [clipboardTrees, setClipboardTrees] = useState<GardenStarPlantInstance[]>([]);

  useEffect(() => {
    if (selectedTreeIds && selectedTreeIds.length > 0) {
      setLocalSelectedIds(selectedTreeIds);
    } else if (selectedTreeId) {
      setLocalSelectedIds([selectedTreeId]);
    } else {
      setLocalSelectedIds([]);
    }
  }, [selectedTreeId, selectedTreeIds]);

  // zoom in px per metre, pan in px
  const [zoom, setZoom] = useState<number>(26);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [draggingTreeId, setDraggingTreeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ dxM: number; dyM: number }>({ dxM: 0, dyM: 0 });

  const [hoveredTreeId, setHoveredTreeId] = useState<string | null>(null);
  const [hoveredCompId, setHoveredCompId] = useState<string | null>(null);

  const [isDragOver, setIsDragOver] = useState(false);

  const [canvasDim, setCanvasDim] = useState({ width: 680, height: 680 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const size = Math.min(rect.width, 820);
        setCanvasDim({ width: size, height: size });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const centerX = canvasDim.width / 2;
  const centerY = canvasDim.height / 2;

  const toScreen = useCallback(
    (xM: number, yM: number) => ({
      x: centerX + pan.x + xM * zoom,
      y: centerY + pan.y + yM * zoom,
    }),
    [centerX, centerY, pan.x, pan.y, zoom]
  );

  const toMetric = useCallback(
    (screenX: number, screenY: number) => ({
      xM: Number(((screenX - centerX - pan.x) / zoom).toFixed(2)),
      yM: Number(((screenY - centerY - pan.y) / zoom).toFixed(2)),
    }),
    [centerX, centerY, pan.x, pan.y, zoom]
  );

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(65, Math.max(12, prev + delta)));
  };

  const handleResetView = () => {
    setZoom(26);
    setPan({ x: 0, y: 0 });
  };

  // Native non-passive listener: React's onWheel is passive and can't prevent page scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = el.getBoundingClientRect();
      const mouseScreenX = e.clientX - rect.left;
      const mouseScreenY = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const zoomDelta = e.deltaY < 0 ? 2.5 : -2.5;

      setZoom(prevZoom => {
        const nextZoom = Math.min(65, Math.max(12, prevZoom + zoomDelta));
        if (nextZoom === prevZoom) return prevZoom;

        // Keep the point under the cursor fixed
        setPan(prevPan => {
          const metricXM = (mouseScreenX - cx - prevPan.x) / prevZoom;
          const metricYM = (mouseScreenY - cy - prevPan.y) / prevZoom;

          return {
            x: Number((mouseScreenX - cx - metricXM * nextZoom).toFixed(2)),
            y: Number((mouseScreenY - cy - metricYM * nextZoom).toFixed(2)),
          };
        });

        return nextZoom;
      });
    };

    el.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleNativeWheel);
  }, []);

  // Ctrl/Cmd+C/X/V and Delete/Backspace act on the selected trees
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable) {
        return;
      }
      // Don't hijack a normal text copy elsewhere on the page
      const hasTextSelection = Boolean(window.getSelection()?.toString());

      const activeIds = localSelectedIds.length > 0
        ? localSelectedIds
        : (selectedTreeId ? [selectedTreeId] : []);

      const isCtrl = e.ctrlKey || e.metaKey;

      if (isCtrl && e.key.toLowerCase() === 'c' && activeIds.length > 0 && !hasTextSelection) {
        e.preventDefault();
        const treesToCopy = starPlants.filter(t => activeIds.includes(t.instanceId));
        if (treesToCopy.length > 0) {
          setClipboardTrees(treesToCopy);
        }
        return;
      }

      if (isCtrl && e.key.toLowerCase() === 'x' && activeIds.length > 0 && !hasTextSelection) {
        e.preventDefault();
        const treesToCut = starPlants.filter(t => activeIds.includes(t.instanceId));
        if (treesToCut.length > 0) {
          setClipboardTrees(treesToCut);
          onDeleteTrees?.(activeIds);
          setLocalSelectedIds([]);
          onSelectTree(null);
          onSelectTreeIds?.([]);
        }
        return;
      }

      if (isCtrl && e.key.toLowerCase() === 'v' && clipboardTrees.length > 0) {
        e.preventDefault();
        if (onPasteTrees) {
          onPasteTrees(clipboardTrees);
        }
        return;
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && activeIds.length > 0) {
        e.preventDefault();
        onDeleteTrees?.(activeIds);
        setLocalSelectedIds([]);
        onSelectTree(null);
        onSelectTreeIds?.([]);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [localSelectedIds, selectedTreeId, starPlants, clipboardTrees, onDeleteTrees, onPasteTrees, onSelectTree, onSelectTreeIds]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const isBackground =
      (e.target as HTMLElement).tagName === 'svg' ||
      (e.target as HTMLElement).id === 'grid-background';

    if (!isBackground) return;

    if (toolMode === 'PAN') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (toolMode === 'SELECT') {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      setIsSelectingMarquee(true);
      setMarqueeStart({ x: mouseX, y: mouseY });
      setMarqueeCurrent({ x: mouseX, y: mouseY });
      if (!e.shiftKey) {
        setLocalSelectedIds([]);
        onSelectTree(null);
        onSelectTreeIds?.([]);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    } else if (isSelectingMarquee && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMarqueeCurrent({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    } else if (draggingTreeId && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseScreenX = e.clientX - rect.left;
      const mouseScreenY = e.clientY - rect.top;
      const metric = toMetric(mouseScreenX, mouseScreenY);

      // Snap to 0.25 m
      const snappedX = Number((Math.round((metric.xM - dragOffset.dxM) * 4) / 4).toFixed(2));
      const snappedY = Number((Math.round((metric.yM - dragOffset.dyM) * 4) / 4).toFixed(2));

      const primaryTree = starPlants.find(t => t.instanceId === draggingTreeId);
      // Most mousemoves stay within the same snap cell; skip those to avoid re-running the optimizer
      if (!primaryTree || (primaryTree.xM === snappedX && primaryTree.yM === snappedY)) return;

      if (localSelectedIds.length > 1 && localSelectedIds.includes(draggingTreeId) && onBatchUpdateTrees) {
        const deltaX = Number((snappedX - primaryTree.xM).toFixed(2));
        const deltaY = Number((snappedY - primaryTree.yM).toFixed(2));
        onBatchUpdateTrees(starPlants.map(t =>
          localSelectedIds.includes(t.instanceId)
            ? { ...t, xM: Number((t.xM + deltaX).toFixed(2)), yM: Number((t.yM + deltaY).toFixed(2)) }
            : t
        ));
      } else {
        onUpdateStarPlantPosition(draggingTreeId, snappedX, snappedY);
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingTreeId(null);

    if (isSelectingMarquee) {
      setIsSelectingMarquee(false);
      const minX = Math.min(marqueeStart.x, marqueeCurrent.x);
      const maxX = Math.max(marqueeStart.x, marqueeCurrent.x);
      const minY = Math.min(marqueeStart.y, marqueeCurrent.y);
      const maxY = Math.max(marqueeStart.y, marqueeCurrent.y);

      // Ignore clicks that barely moved
      if (maxX - minX > 4 || maxY - minY > 4) {
        const boxed = starPlants.filter(t => {
          const pos = toScreen(t.xM, t.yM);
          return pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY;
        });
        const boxedIds = boxed.map(t => t.instanceId);
        setLocalSelectedIds(boxedIds);
        onSelectTreeIds?.(boxedIds);
        if (boxedIds.length > 0) {
          onSelectTree(boxedIds[0]);
        }
      }
    }
  };

  // mouseup is caught on window so releasing outside the canvas still ends a drag/pan/marquee
  const mouseUpRef = useRef(handleMouseUp);
  mouseUpRef.current = handleMouseUp;
  const isInteracting = isPanning || draggingTreeId !== null || isSelectingMarquee;
  useEffect(() => {
    if (!isInteracting) return;
    const onUp = () => mouseUpRef.current();
    window.addEventListener('mouseup', onUp);
    return () => window.removeEventListener('mouseup', onUp);
  }, [isInteracting]);

  const startDragTree = (e: React.MouseEvent, tree: GardenStarPlantInstance) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const metric = toMetric(e.clientX - rect.left, e.clientY - rect.top);

    setDraggingTreeId(tree.instanceId);
    setDragOffset({
      dxM: metric.xM - tree.xM,
      dyM: metric.yM - tree.yM,
    });

    if (e.shiftKey || toolMode === 'SELECT') {
      if (!localSelectedIds.includes(tree.instanceId)) {
        const next = [...localSelectedIds, tree.instanceId];
        setLocalSelectedIds(next);
        onSelectTreeIds?.(next);
      }
    } else {
      if (!localSelectedIds.includes(tree.instanceId)) {
        setLocalSelectedIds([tree.instanceId]);
        onSelectTreeIds?.([tree.instanceId]);
      }
    }
    onSelectTree(tree.instanceId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && onDropJsonFile && containerRef.current) {
      const file = e.dataTransfer.files[0];
      const rect = containerRef.current.getBoundingClientRect();
      const metric = toMetric(e.clientX - rect.left, e.clientY - rect.top);
      onDropJsonFile(file, metric.xM, metric.yM);
    }
  };

  // 1 m minor lines, 5 m major lines
  const visibleRangeM = useMemo(() => {
    const halfWidthM = (canvasDim.width / 2) / zoom;
    const halfHeightM = (canvasDim.height / 2) / zoom;
    const minXM = Math.floor((-pan.x / zoom) - halfWidthM - 2);
    const maxXM = Math.ceil((-pan.x / zoom) + halfWidthM + 2);
    const minYM = Math.floor((-pan.y / zoom) - halfHeightM - 2);
    const maxYM = Math.ceil((-pan.y / zoom) + halfHeightM + 2);
    return { minXM, maxXM, minYM, maxYM };
  }, [canvasDim.width, canvasDim.height, pan.x, pan.y, zoom]);

  const gridLines = useMemo(() => {
    const lines: { pos: number; isMajor: boolean; label?: number }[] = [];
    for (let m = visibleRangeM.minXM; m <= visibleRangeM.maxXM; m++) {
      lines.push({ pos: m, isMajor: m % 5 === 0, label: m });
    }
    return lines;
  }, [visibleRangeM.minXM, visibleRangeM.maxXM]);

  const vGridLines = useMemo(() => {
    const lines: { pos: number; isMajor: boolean; label?: number }[] = [];
    for (let m = visibleRangeM.minYM; m <= visibleRangeM.maxYM; m++) {
      lines.push({ pos: m, isMajor: m % 5 === 0, label: m });
    }
    return lines;
  }, [visibleRangeM.minYM, visibleRangeM.maxYM]);

  const treesById = useMemo(() => new Map(starPlants.map(t => [t.instanceId, t])), [starPlants]);

  return (
    <div className="relative bg-white rounded-2xl border border-stone-200 shadow-sm p-3 sm:p-4 select-none flex flex-col items-center">
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-stone-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-800 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-forest-600 animate-pulse" />
            {tr.gardenGridTitle}
          </span>
          <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
            {tr.gardenGridScaleHint}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 mr-1">
            <button
              type="button"
              onClick={() => setToolMode('PAN')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                toolMode === 'PAN'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title={tr.gardenGridPanTool}
            >
              <Hand className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setToolMode('SELECT')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                toolMode === 'SELECT'
                  ? 'bg-forest-600 text-white shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title={
                tr.gardenGridSelectTool
              }
            >
              <MousePointer className="w-3.5 h-3.5" />
            </button>
          </div>

          {localSelectedIds.length > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
              {localSelectedIds.length} {tr.gardenGridSelected}
            </span>
          )}

          <button
            type="button"
            onClick={() => handleZoom(-3)}
            className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer"
            title={tr.gardenGridZoomOut}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1.5 py-0.5 font-mono text-[10px] text-stone-500 min-w-[3.5rem] text-center">
            {Math.round(zoom)} px/m
          </span>
          <button
            type="button"
            onClick={() => handleZoom(3)}
            className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer"
            title={tr.gardenGridZoomIn}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetView}
            className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer ml-1"
            title={tr.gardenGridCenterView}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className={`relative w-full aspect-square max-w-[800px] overflow-hidden rounded-xl border transition-all ${
          isDragOver
            ? 'border-forest-500 bg-forest-50/30 ring-2 ring-forest-400'
            : 'border-stone-300 bg-stone-50'
        } ${
          isPanning
            ? 'cursor-grab active:cursor-grabbing'
            : toolMode === 'SELECT'
            ? 'cursor-crosshair'
            : 'cursor-default'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <svg
          width={canvasDim.width}
          height={canvasDim.height}
          className="w-full h-full block"
        >
          <defs>
            <radialGradient id="gardenCanopyGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
              <stop offset="80%" stopColor="#16a34a" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#15803d" stopOpacity="0.08" />
            </radialGradient>

            <radialGradient id="selectedCanopyGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="85%" stopColor="#0284c7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.1" />
            </radialGradient>

            <radialGradient id="walnutWarningGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="85%" stopColor="#dc2626" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.04" />
            </radialGradient>

            <radialGradient id="deepShadeGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.0" />
            </radialGradient>
          </defs>

          <rect id="grid-background" width="100%" height="100%" fill="transparent" />

          {/* Not hit-testable, so pan/marquee also start on top of a grid line */}
          <g id="grid-layer" pointerEvents="none">
            {gridLines.map(l => {
              const xPos = centerX + pan.x + l.pos * zoom;
              const isCenter = l.pos === 0;
              return (
                <g key={`v-${l.pos}`}>
                  <line
                    x1={xPos}
                    y1={0}
                    x2={xPos}
                    y2={canvasDim.height}
                    stroke={isCenter ? '#047857' : l.isMajor ? '#cbd5e1' : '#f1f5f9'}
                    strokeWidth={isCenter ? 1.5 : l.isMajor ? 1 : 0.6}
                    strokeDasharray={isCenter ? undefined : l.isMajor ? undefined : '2,2'}
                  />
                  {l.isMajor && (
                    <text
                      x={xPos + 2}
                      y={14}
                      fontSize="9"
                      fontFamily="monospace"
                      fill={isCenter ? '#047857' : '#94a3b8'}
                      fontWeight={isCenter ? 'bold' : 'normal'}
                    >
                      {l.pos > 0 ? `+${l.pos}m` : `${l.pos}m`}
                    </text>
                  )}
                </g>
              );
            })}

            {vGridLines.map(l => {
              const yPos = centerY + pan.y + l.pos * zoom;
              const isCenter = l.pos === 0;
              return (
                <g key={`h-${l.pos}`}>
                  <line
                    x1={0}
                    y1={yPos}
                    x2={canvasDim.width}
                    y2={yPos}
                    stroke={isCenter ? '#047857' : l.isMajor ? '#cbd5e1' : '#f1f5f9'}
                    strokeWidth={isCenter ? 1.5 : l.isMajor ? 1 : 0.6}
                    strokeDasharray={isCenter ? undefined : l.isMajor ? undefined : '2,2'}
                  />
                  {l.isMajor && (
                    <text
                      x={4}
                      y={yPos - 2}
                      fontSize="9"
                      fontFamily="monospace"
                      fill={isCenter ? '#047857' : '#94a3b8'}
                      fontWeight={isCenter ? 'bold' : 'normal'}
                    >
                      {l.pos > 0 ? `+${l.pos}m` : `${l.pos}m`}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {shadePockets.map(pocket => {
            const pos = toScreen(pocket.xM, pocket.yM);
            const rPx = pocket.radiusM * zoom;
            return (
              <g key={pocket.id} pointerEvents="none">
                <circle cx={pos.x} cy={pos.y} r={rPx} fill="url(#deepShadeGrad)" />
                <circle cx={pos.x} cy={pos.y} r={rPx} stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,3" fill="none" opacity="0.4" />
              </g>
            );
          })}

          {conflicts.map(c => {
            const posA = toScreen(c.plantA.xM, c.plantA.yM);
            const posB = toScreen(c.plantB.xM, c.plantB.yM);
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
                  strokeDasharray="4,4"
                  opacity="0.85"
                />
                <circle cx={midX} cy={midY} r="9" fill={isCritical ? '#fee2e2' : '#fef3c7'} stroke={isCritical ? '#dc2626' : '#d97706'} strokeWidth="1" />
                <text
                  x={midX}
                  y={midY + 3}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="bold"
                  fill={isCritical ? '#b91c1c' : '#b45309'}
                >
                  !
                </text>
                <text
                  x={midX}
                  y={midY - 12}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                  fill={isCritical ? '#b91c1c' : '#b45309'}
                  className="drop-shadow-xs"
                >
                  {formatNumber(c.distanceM, 1, language)} m
                </text>
              </g>
            );
          })}

          {/* Companion-to-tree service links */}
          {companions.map(comp => {
            const compPos = toScreen(comp.xM, comp.yM);
            const isHovered = hoveredCompId === comp.instanceId;

            return (
              <g key={`links-${comp.instanceId}`} pointerEvents="none">
                {comp.servicingTreeIds.map(tId => {
                  const tree = treesById.get(tId);
                  if (!tree) return null;
                  const treePos = toScreen(tree.xM, tree.yM);

                  return (
                    <line
                      key={`link-${comp.instanceId}-${tId}`}
                      x1={compPos.x}
                      y1={compPos.y}
                      x2={treePos.x}
                      y2={treePos.y}
                      stroke={comp.plant.color}
                      strokeWidth={isHovered ? 1.5 : 0.8}
                      strokeDasharray="3,3"
                      opacity={isHovered ? 0.8 : comp.isMerged ? 0.6 : 0.25}
                    />
                  );
                })}
              </g>
            );
          })}

          {starPlants.map(treeInst => {
            const pos = toScreen(treeInst.xM, treeInst.yM);
            const rPx = treeInst.starTree.matureRadiusM * zoom;
            const isSelected = localSelectedIds.includes(treeInst.instanceId) || selectedTreeId === treeInst.instanceId;
            const isHovered = hoveredTreeId === treeInst.instanceId;
            const isWalnut = treeInst.starTree.jugloneProducer;

            return (
              <g
                key={treeInst.instanceId}
                onMouseEnter={() => setHoveredTreeId(treeInst.instanceId)}
                onMouseLeave={() => setHoveredTreeId(null)}
                className="cursor-move group"
                onMouseDown={e => startDragTree(e, treeInst)}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={rPx}
                  fill={
                    isSelected
                      ? 'url(#selectedCanopyGrad)'
                      : isWalnut
                      ? 'url(#walnutWarningGrad)'
                      : 'url(#gardenCanopyGrad)'
                  }
                  stroke={isSelected ? '#0284c7' : isWalnut ? '#ef4444' : '#16a34a'}
                  strokeWidth={isSelected ? 2 : 1.2}
                  strokeDasharray={isSelected ? undefined : '4,3'}
                />

                {/* Bare trunk collar (0.3 m) */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={Math.max(4, 0.3 * zoom)}
                  fill="#78350f"
                  fillOpacity="0.25"
                  stroke="#78350f"
                  strokeWidth="0.8"
                />

                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={Math.max(6, 0.45 * zoom)}
                  fill={isSelected ? '#0284c7' : '#15803d'}
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 2.5 : 2}
                  className="filter drop-shadow-sm"
                />

                <text
                  x={pos.x}
                  y={pos.y + 3.5}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="bold"
                  fill="#ffffff"
                  pointerEvents="none"
                >
                  {getLoc(treeInst.starTree.commonName, language).slice(0, 1)}
                </text>

                <g transform={`translate(${pos.x}, ${pos.y - rPx - 8})`} pointerEvents="none">
                  <rect
                    x="-42"
                    y="-10"
                    width="84"
                    height="16"
                    rx="4"
                    fill="#1e293b"
                    fillOpacity="0.9"
                  />
                  <text
                    x="0"
                    y="1"
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#ffffff"
                  >
                    {getLoc(treeInst.starTree.commonName, language).slice(0, 14)}
                  </text>
                </g>

                {(isHovered || isSelected) && (
                  <text
                    x={pos.x}
                    y={pos.y + rPx + 14}
                    textAnchor="middle"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="#475569"
                    pointerEvents="none"
                  >
                    ({formatNumber(treeInst.xM, 1, language)}m, {formatNumber(treeInst.yM, 1, language)}m)
                  </text>
                )}
              </g>
            );
          })}

          {companions.map(comp => {
            const pos = toScreen(comp.xM, comp.yM);
            const isHovered = hoveredCompId === comp.instanceId;
            const rPx = Math.max(5, (comp.plant.spreadM / 2) * zoom);

            return (
              <g
                key={comp.instanceId}
                onMouseEnter={() => setHoveredCompId(comp.instanceId)}
                onMouseLeave={() => setHoveredCompId(null)}
                onClick={() => onSelectCompanion?.(comp.plant)}
                className="cursor-pointer group"
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={rPx}
                  fill={comp.plant.color}
                  fillOpacity={isHovered ? 0.35 : 0.18}
                  stroke={comp.plant.color}
                  strokeWidth="0.8"
                  strokeDasharray="2,2"
                />

                {comp.isMerged && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={8.5}
                    fill="none"
                    stroke={comp.plant.color}
                    strokeWidth="1.2"
                    strokeDasharray="2,2"
                    opacity="0.85"
                  />
                )}

                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={comp.isMerged ? 6 : 5}
                  fill={comp.plant.color}
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 2.5 : comp.isMerged ? 2 : 1.5}
                  className="filter drop-shadow-xs"
                />

                {comp.isMerged && (
                  <circle
                    cx={pos.x + 4}
                    cy={pos.y - 4}
                    r="3.5"
                    fill={comp.plant.color}
                    stroke="#ffffff"
                    strokeWidth="0.8"
                  />
                )}

                {isHovered && (
                  <g transform={`translate(${pos.x}, ${pos.y - 12})`} pointerEvents="none">
                    <rect
                      x="-45"
                      y="-11"
                      width="90"
                      height="16"
                      rx="4"
                      fill="#0f172a"
                      fillOpacity="0.95"
                    />
                    <text
                      x="0"
                      y="1"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#f8fafc"
                    >
                      {getLoc(comp.plant.commonName, language).slice(0, 15)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {isSelectingMarquee && (
            <rect
              x={Math.min(marqueeStart.x, marqueeCurrent.x)}
              y={Math.min(marqueeStart.y, marqueeCurrent.y)}
              width={Math.abs(marqueeCurrent.x - marqueeStart.x)}
              height={Math.abs(marqueeCurrent.y - marqueeStart.y)}
              fill="#0284c7"
              fillOpacity="0.12"
              stroke="#0284c7"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              pointerEvents="none"
            />
          )}
        </svg>

        {isDragOver && (
          <div className="absolute inset-0 bg-forest-900/40 backdrop-blur-xs flex flex-col items-center justify-center text-white pointer-events-none p-6 text-center space-y-2">
            <Sparkles className="w-12 h-12 text-forest-300 animate-bounce" />
            <h4 className="text-lg font-bold">
              {tr.gardenGridDropHere}
            </h4>
            <p className="text-xs text-forest-100 max-w-sm">
              {tr.gardenGridDropHint}
            </p>
          </div>
        )}

        {starPlants.length === 0 && !isDragOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center space-y-2.5">
            <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-xs border border-stone-200 text-forest-700 shadow-xs">
              <Trees className="w-8 h-8 text-forest-600" />
            </div>
            <div className="space-y-1 bg-white/85 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-stone-200 shadow-2xs max-w-xs">
              <h4 className="text-xs font-bold text-stone-800">
                {tr.gardenGridReady}
              </h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                {tr.gardenGridReadyHint}
              </p>
            </div>
          </div>
        )}

        <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs border border-stone-200 px-2 py-1 rounded-md text-[10px] font-mono text-stone-600 flex items-center gap-1 shadow-xs pointer-events-none">
          <Move className="w-3 h-3 text-stone-400" />
          <span>{tr.gardenGridOriginLabel}</span>
        </div>
      </div>
    </div>
  );
};
