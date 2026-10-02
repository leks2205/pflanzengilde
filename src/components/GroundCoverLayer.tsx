import React from 'react';
import { PhenoSeason } from '../types/guild';
import { CoverShape, isCoverInSeason, ringsToSvgPath } from '../core/groundCoverEngine';

interface GroundCoverLayerProps {
  shapes: CoverShape[];
  /** Metres → SVG pixels. */
  toPx: (xM: number, yM: number) => { x: number; y: number };
  /** Pixels per metre (dot size). */
  scale: number;
  season: PhenoSeason | 'ALL';
  id?: string;
}

/**
 * Translucent ground-cover areas (even-odd paths with holes) and clustered bulb dots.
 * Absolute coordinates only (no transforms), so server-rendered markup stays comparable.
 */
export const GroundCoverLayer: React.FC<GroundCoverLayerProps> = ({ shapes, toPx, scale, season, id = 'ground-covers' }) => {
  if (shapes.length === 0) return null;
  const dotR = Math.max(1.1, Math.min(3, 0.04 * scale));
  return (
    <g id={id} className="pointer-events-none select-none">
      {shapes.map(shape => {
        const inSeason = isCoverInSeason(shape.spec, season);
        const d = ringsToSvgPath(shape.rings, toPx);
        if (!d) return null;
        const opacity = inSeason ? shape.opacity : 0.05;
        return (
          <g key={`cover-${shape.plantId}`} data-cover={shape.plantId}>
            <path
              d={d}
              fill={shape.color}
              fillOpacity={opacity}
              fillRule="evenodd"
              stroke={shape.color}
              strokeOpacity={inSeason ? 0.55 : 0.25}
              strokeWidth={shape.spec.edge === 'HARD' ? 1.4 : 0.9}
              strokeDasharray={inSeason ? (shape.spec.edge === 'HARD' ? undefined : '5 3') : '2 3'}
              strokeLinejoin="round"
            />
            {shape.dots.length > 0 &&
              shape.dots.map(([x, y], i) => {
                const p = toPx(x, y);
                if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) return null;
                return (
                  <circle
                    key={i}
                    cx={p.x.toFixed(2)}
                    cy={p.y.toFixed(2)}
                    r={dotR.toFixed(2)}
                    fill={shape.color}
                    fillOpacity={inSeason ? 0.75 : 0.18}
                  />
                );
              })}
          </g>
        );
      })}
    </g>
  );
};
