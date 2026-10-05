import React from 'react';
import { Language, LocalizedString, getLoc } from '../types/guild';

/**
 * Illustrations for the raised-bed and ground-cover guides. Schematic only: every number shown
 * here is taken from the guide text it illustrates (and its sources), nothing is added.
 */

type L = LocalizedString;
const L = (en: string, de: string): L => ({ en, de });

interface DiagramProps { language: Language; className?: string }

const SOIL = '#8b6a48';
const SOIL_DARK = '#6b4f2a';
const NATIVE = '#c8a27a';
const WOOD = '#b45309';
const LINER = '#dc2626';
const LEAF = '#16a34a';

const Label: React.FC<{ x: number; y: number; anchor?: 'start' | 'middle' | 'end'; bold?: boolean; size?: number; fill?: string; children: React.ReactNode }> = ({ x, y, anchor = 'start', bold, size = 11, fill = '#44403c', children }) => (
  <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={bold ? 700 : 500} fill={fill} fontFamily="inherit">{children}</text>
);

const Sprig: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = LEAF }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0 V-22" stroke="#15803d" strokeWidth={2} />
    <ellipse cx={-7} cy={-14} rx={7} ry={3.5} fill={color} transform="rotate(-30 -7 -14)" />
    <ellipse cx={7} cy={-19} rx={7} ry={3.5} fill={color} transform="rotate(30 7 -19)" />
    <ellipse cx={0} cy={-25} rx={4} ry={6} fill={color} />
  </g>
);

/** Cross-section of a lined raised bed with the guide's dimensions. */
export const BedCrossSection: React.FC<DiagramProps> = ({ language, className }) => {
  const g = (l: L) => getLoc(l, language);
  return (
    <svg viewBox="0 0 540 290" className={className} role="img" aria-label={g(L('Cross-section of a raised bed', 'Querschnitt eines Hochbeets'))}>
      <defs>
        <pattern id="bcs-mesh" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 0 L6 6 M6 0 L0 6" stroke="#57534e" strokeWidth={0.8} />
        </pattern>
        <pattern id="bcs-mulch" width="10" height="6" patternUnits="userSpaceOnUse">
          <rect width="10" height="6" fill={SOIL_DARK} />
          <path d="M1 2 h4 M6 4 h3" stroke="#a16207" strokeWidth={1.2} />
        </pattern>
        <linearGradient id="bcs-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7c5a3a" />
          <stop offset="1" stopColor={SOIL} />
        </linearGradient>
        <pattern id="bcs-grain" width="14" height="22" patternUnits="userSpaceOnUse">
          <rect width="14" height="22" fill={WOOD} />
          <path d="M0 21.5 H14" stroke="#92400e" strokeWidth={1} />
          <path d="M3 4 q4 3 8 0" stroke="#92400e" strokeWidth={0.7} fill="none" />
        </pattern>
        <marker id="bcs-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#57534e" />
        </marker>
      </defs>
      {/* native ground */}
      <rect x={0} y={222} width={540} height={68} fill={NATIVE} />
      <path d="M0 222 H540" stroke="#a8794f" strokeWidth={2} />
      {[30, 80, 470, 515].map(x => <Sprig key={x} x={x} y={222} s={0.7} color="#84cc16" />)}
      {/* fill + mulch */}
      <rect x={202} y={104} width={226} height={114} fill="url(#bcs-fill)" />
      <rect x={202} y={96} width={226} height={9} fill="url(#bcs-mulch)" />
      {/* walls */}
      <rect x={188} y={82} width={14} height={140} fill="url(#bcs-grain)" />
      <rect x={428} y={82} width={14} height={140} fill="url(#bcs-grain)" />
      {/* liner */}
      <path d="M203 90 V217 H427 V90" fill="none" stroke={LINER} strokeWidth={2.5} strokeDasharray="7 4" />
      {/* vole mesh */}
      <rect x={188} y={222} width={254} height={5} fill="url(#bcs-mesh)" />
      {/* drainage */}
      <rect x={427} y={205} width={30} height={7} rx={2} fill="#78716c" />
      {[0, 1, 2].map(i => <circle key={i} cx={462 + i * 5} cy={212 + i * 6} r={2} fill="#38bdf8" />)}
      {/* plants */}
      <Sprig x={240} y={97} />
      <Sprig x={300} y={97} s={1.25} />
      <Sprig x={365} y={97} />
      {/* dimensions */}
      <line x1={188} y1={64} x2={442} y2={64} stroke="#57534e" strokeWidth={1.2} markerStart="url(#bcs-arrow)" markerEnd="url(#bcs-arrow)" />
      <Label x={315} y={57} anchor="middle" bold>{g(L('max. 120 cm wide (reach in from both sides)', 'max. 120 cm breit (von beiden Seiten erreichbar)'))}</Label>
      <line x1={490} y1={82} x2={490} y2={222} stroke="#57534e" strokeWidth={1.2} markerStart="url(#bcs-arrow)" markerEnd="url(#bcs-arrow)" />
      <Label x={497} y={140} bold>80–</Label>
      <Label x={497} y={154} bold>100 cm</Label>
      {/* leader labels */}
      {[
        { y: 101, to: [208, 101], t: [L('Mulch layer', 'Mulchschicht')] },
        { y: 142, to: [240, 146], t: [L('Fill: 70 % topsoil', 'Füllung: 70 % Oberboden'), L('+ 30 % compost', '+ 30 % Kompost'), L('(at least 25 cm of soil)', '(mindestens 25 cm Erde)')] },
        { y: 192, to: [203, 192], t: [L('Root-barrier film', 'Wurzelschutzfolie'), L('(walls and bottom)', '(Wände und Boden)')], c: LINER },
        { y: 244, to: [195, 226], t: [L('Vole mesh underneath', 'Wühlmausgitter darunter')] },
      ].map(({ y, to, t, c }, i) => (
        <g key={i}>
          {t.map((line, k) => <Label key={k} x={8} y={y + 4 + k * 13} fill={c ?? '#44403c'} size={10.5}>{g(line)}</Label>)}
          <path d={`M${Math.min(150, 14 + Math.max(...t.slice(0, 2).map(x => g(x).length)) * 5.6)} ${y} L${to[0]} ${to[1]}`} stroke={c ?? '#78716c'} strokeWidth={0.9} fill="none" />
        </g>
      ))}
      <Label x={452} y={250} size={10.5}>{g(L('Drainage outlet', 'Wasserablauf'))}</Label>
      <Label x={230} y={270} size={10.5} fill="#78350f">{g(L('Native soil', 'Gewachsener Boden'))}</Label>
    </svg>
  );
};

/** What crosses a bed wall: insects and scents over it, roots and fungal threads stop at the liner. */
export const WallCrossingDiagram: React.FC<DiagramProps> = ({ language, className }) => {
  const g = (l: L) => getLoc(l, language);
  return (
    <svg viewBox="0 0 540 232" className={className} role="img" aria-label={g(L('What crosses a raised-bed wall', 'Was über eine Hochbeetwand gelangt'))}>
      <defs>
        <marker id="wcd-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="#059669" />
        </marker>
      </defs>
      <rect x={0} y={150} width={290} height={82} fill={NATIVE} />
      <rect x={290} y={90} width={250} height={142} fill={SOIL} />
      <rect x={276} y={84} width={14} height={148} fill={WOOD} />
      <path d="M291 86 V232" stroke={LINER} strokeWidth={2.5} strokeDasharray="7 4" />
      <Label x={14} y={172} bold fill="#78350f">{g(L('Open ground', 'Offener Boden'))}</Label>
      <Label x={526} y={116} anchor="end" bold fill="#fef3c7">{g(L('Raised bed', 'Hochbeet'))}</Label>
      <Sprig x={70} y={150} s={1.3} color="#a3e635" />
      <Sprig x={190} y={150} s={1.1} />
      <Sprig x={380} y={90} s={1.2} />
      <Sprig x={470} y={90} s={1} color="#a3e635" />
      <path d="M80 112 C 150 30, 300 20, 372 62" fill="none" stroke="#059669" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#wcd-arrow)" />
      <g transform="translate(225 40)">
        <ellipse cx={-2} cy={-8} rx={5} ry={3} fill="#e0f2fe" stroke="#94a3b8" strokeWidth={0.5} />
        <ellipse cx={4} cy={-8} rx={5} ry={3} fill="#e0f2fe" stroke="#94a3b8" strokeWidth={0.5} />
        <ellipse cx={0} cy={0} rx={9} ry={6} fill="#facc15" stroke="#422006" strokeWidth={1} />
        <path d="M-3 -6 V6 M3 -6 V6" stroke="#422006" strokeWidth={1.6} />
      </g>
      <Label x={225} y={14} anchor="middle" size={11} fill="#047857" bold>{g(L('crosses: pollinators, scents, beneficial insects', 'gelangt darüber: Bestäuber, Duftstoffe, Nützlinge'))}</Label>
      {[0, 1, 2].map(i => (
        <path key={i} d={`M190 ${154 + i * 3} C 210 ${166 + i * 8}, 240 ${162 + i * 10}, 268 ${170 + i * 12}`} stroke="#fafaf9" strokeWidth={1.6} fill="none" />
      ))}
      {[170, 182, 194].map(y => (
        <path key={y} d="M-4 -4 L4 4 M4 -4 L-4 4" stroke={LINER} strokeWidth={2.2} transform={`translate(280 ${y})`} />
      ))}
      <Label x={14} y={208} size={10.5} fill="#7f1d1d" bold>{g(L('stays on its side:', 'bleibt auf seiner Seite:'))}</Label>
      <Label x={14} y={222} size={10.5} fill="#7f1d1d">{g(L('roots, fungal threads, nitrogen, mulch', 'Wurzeln, Pilzfäden, Stickstoff, Mulch'))}</Label>
    </svg>
  );
};

/** Top view: raised beds inside and outside a walnut's drip line. */
export const WalnutDiagram: React.FC<DiagramProps> = ({ language, className }) => {
  const g = (l: L) => getLoc(l, language);
  return (
    <svg viewBox="0 0 300 170" className={className} role="img" aria-label={g(L('Raised beds near a walnut', 'Hochbeete nahe einer Walnuss'))}>
      <circle cx={95} cy={85} r={72} fill="#365314" opacity={0.18} />
      <circle cx={95} cy={85} r={72} fill="none" stroke="#365314" strokeWidth={1.5} strokeDasharray="6 4" />
      <circle cx={95} cy={85} r={7} fill="#78350f" />
      <Label x={95} y={168} anchor="middle" size={10} fill="#365314">{g(L('drip line', 'Kronentraufe'))}</Label>
      <rect x={110} y={42} width={44} height={30} rx={3} fill={SOIL} stroke={WOOD} strokeWidth={3} />
      <circle cx={146} cy={44} r={9} fill="#f59e0b" />
      <Label x={146} y={48} anchor="middle" size={11} bold fill="#fff">!</Label>
      <rect x={210} y={92} width={60} height={34} rx={3} fill={SOIL} stroke={WOOD} strokeWidth={3} />
      <circle cx={263} cy={94} r={9} fill="#0ea5e9" />
      <Label x={263} y={98} anchor="middle" size={11} bold fill="#fff">i</Label>
      {/* falling leaves */}
      {[[128, 30], [140, 82], [114, 88]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={5} ry={2.5} fill="#a16207" transform={`rotate(${i * 50} ${x} ${y})`} />
      ))}
      <Label x={176} y={24} size={10} fill="#92400e" bold>{g(L('under the crown:', 'unter der Krone:'))}</Label>
      <Label x={176} y={37} size={10} fill="#92400e">{g(L('note + keep leaves out', 'Hinweis + Laub fernhalten'))}</Label>
      <Label x={208} y={146} size={10} fill="#0369a1" bold>{g(L('further away:', 'weiter weg:'))}</Label>
      <Label x={208} y={159} size={10} fill="#0369a1">{g(L('note (reduced)', 'Hinweis (verringert)'))}</Label>
    </svg>
  );
};

/** Working heights from the guide (wheelchair 61 cm, seated 80 cm, standing 100 cm). */
export const BedHeightsDiagram: React.FC<DiagramProps> = ({ language, className }) => {
  const g = (l: L) => getLoc(l, language);
  const bars = [
    { h: 61, w: 91, t: L('wheelchair', 'Rollstuhl'), c: '#0ea5e9' },
    { h: 80, w: 120, t: L('seated / shorter', 'sitzend / kleiner'), c: '#16a34a' },
    { h: 100, w: 120, t: L('standing, tall', 'stehend, groß'), c: '#b45309' },
  ];
  return (
    <svg viewBox="0 0 300 150" className={className} role="img" aria-label={g(L('Bed heights', 'Beethöhen'))}>
      <path d="M10 125 H290" stroke="#a8a29e" strokeWidth={1.5} />
      {bars.map((b, i) => {
        const x = 20 + i * 95;
        const bw = b.w * 0.6;
        return (
          <g key={i}>
            <rect x={x} y={125 - b.h} width={bw} height={b.h} rx={3} fill={b.c} opacity={0.85} />
            <rect x={x} y={125 - b.h} width={bw} height={6} rx={2} fill="#3f6212" />
            <Label x={x + bw / 2} y={125 - b.h - 6} anchor="middle" bold size={12}>{`${b.h} cm`}</Label>
            <Label x={x + bw / 2} y={139} anchor="middle" size={10}>{g(b.t)}</Label>
            <Label x={x + bw / 2} y={125 - b.h / 2 + 4} anchor="middle" size={9.5} fill="#fff" bold>{`↔ ${b.w}`}</Label>
          </g>
        );
      })}
    </svg>
  );
};

// ── Ground covers ────────────────────────────────────────────────────────────────────────────────

const COVER = '#22c55e';
const COVER2 = '#a855f7';

/** Bare zone around a young vs an established trunk (0.9 m vs 0.3 m). */
export const TrunkZoneDiagram: React.FC<DiagramProps> = ({ language, className }) => {
  const g = (l: L) => getLoc(l, language);
  const panel = (cx: number, r: number, t: L, m: string) => (
    <g>
      <circle cx={cx} cy={58} r={46} fill={COVER} opacity={0.35} />
      <circle cx={cx} cy={58} r={r} fill="#fafaf9" stroke="#a8a29e" strokeDasharray="3 3" />
      <circle cx={cx} cy={58} r={4} fill="#78350f" />
      <Label x={cx} y={122} anchor="middle" size={10.5} bold>{g(t)}</Label>
      <Label x={cx + r + 2} y={50} size={10} fill="#57534e">{m}</Label>
    </g>
  );
  return (
    <svg viewBox="0 0 240 130" className={className} role="img" aria-label={g(L('Bare zone around the trunk', 'Offene Zone um den Stamm'))}>
      {panel(62, 30, L('young planting', 'junge Pflanzung'), '0.9 m')}
      {panel(180, 10, L('established', 'etabliert'), '0.3 m')}
    </svg>
  );
};

/** Daily shade offset away from the noon sun; shade lovers sit in it, sun lovers outside. */
export const ShadeDiagram: React.FC<DiagramProps> = ({ language, className }) => {
  const g = (l: L) => getLoc(l, language);
  return (
    <svg viewBox="0 0 240 130" className={className} role="img" aria-label={g(L('Daily shade of a tree', 'Tagesschatten eines Baums'))}>
      <ellipse cx={120} cy={42} rx={44} ry={32} fill="#44403c" opacity={0.18} />
      <ellipse cx={120} cy={42} rx={30} ry={20} fill={COVER2} opacity={0.4} />
      <circle cx={120} cy={68} r={34} fill="none" stroke="#15803d" strokeWidth={1.5} strokeDasharray="5 3" />
      <circle cx={120} cy={68} r={4} fill="#78350f" />
      <path d="M70 112 Q120 132 170 112 L180 92 Q120 116 60 92 Z" fill={COVER} opacity={0.4} />
      <g transform="translate(205 112)">
        <circle r={9} fill="#facc15" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
          <path key={a} d="M0 -12 V-16" stroke="#eab308" strokeWidth={2} transform={`rotate(${a})`} />
        ))}
      </g>
      <path d="M18 30 V8" stroke="#57534e" strokeWidth={1.5} markerEnd="url(#sd-n)" />
      <defs>
        <marker id="sd-n" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#57534e" /></marker>
      </defs>
      <Label x={18} y={42} anchor="middle" size={10} bold>N</Label>
      <Label x={120} y={14} anchor="middle" size={10} fill="#6b21a8" bold>{g(L('shade lovers', 'Schattenpflanzen'))}</Label>
      <Label x={120} y={127} anchor="middle" size={10} fill="#15803d" bold>{g(L('sun lovers', 'Sonnenpflanzen'))}</Label>
    </svg>
  );
};

/** Holes around clump plants inside a cover. */
export const HolesDiagram: React.FC<DiagramProps> = ({ language, className }) => {
  const g = (l: L) => getLoc(l, language);
  return (
    <svg viewBox="0 0 240 130" className={className} role="img" aria-label={g(L('Holes around other plants', 'Aussparungen um andere Pflanzen'))}>
      <defs>
        <mask id="hd-mask">
          <rect width={240} height={130} fill="#fff" />
          {[[80, 50, 18], [150, 75, 24], [105, 95, 13]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#000" />)}
        </mask>
      </defs>
      <path d="M30 60 C 30 15, 110 5, 160 18 S 225 60, 205 95 S 120 128, 70 118 S 30 95, 30 60 Z" fill={COVER} opacity={0.45} mask="url(#hd-mask)" />
      {[[80, 50, 10, '#f97316'], [150, 75, 14, '#3b82f6'], [105, 95, 7, '#e11d48']].map(([x, y, r, c], i) => (
        <circle key={i} cx={x as number} cy={y as number} r={r as number} fill={c as string} opacity={0.85} />
      ))}
      <Label x={150} y={112} anchor="middle" size={9.5} fill="#57534e">{g(L('spread + 1 year of runners', 'Durchmesser + 1 Jahr Ausläufer'))}</Label>
    </svg>
  );
};

/** Sown strips outside the drip lines. */
export const StripDiagram: React.FC<DiagramProps> = ({ language, className }) => {
  const g = (l: L) => getLoc(l, language);
  return (
    <svg viewBox="0 0 240 130" className={className} role="img" aria-label={g(L('Sown strips between trees', 'Gesäte Streifen zwischen Bäumen'))}>
      <rect x={0} y={52} width={240} height={26} fill="#eab308" opacity={0.45} />
      {[[40, 20], [200, 20], [40, 110], [200, 110]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={28} fill="#15803d" opacity={0.18} />
          <circle cx={x} cy={y} r={28} fill="none" stroke="#15803d" strokeDasharray="4 3" />
          <circle cx={x} cy={y} r={3.5} fill="#78350f" />
        </g>
      ))}
      <Label x={120} y={69} anchor="middle" size={10.5} bold fill="#713f12">{g(L('flower strip outside the crowns', 'Blühstreifen außerhalb der Kronen'))}</Label>
    </svg>
  );
};

/** The same cover around two trees merges into one area. */
export const MergeDiagram: React.FC<DiagramProps> = ({ language, className }) => {
  const g = (l: L) => getLoc(l, language);
  return (
    <svg viewBox="0 0 240 130" className={className} role="img" aria-label={g(L('Covers merge between trees', 'Bodendecker verschmelzen zwischen Bäumen'))}>
      <path d="M30 65 C 30 15, 95 15, 120 45 C 145 15, 210 15, 210 65 C 210 115, 145 115, 120 85 C 95 115, 30 115, 30 65 Z" fill={COVER} opacity={0.45} />
      <circle cx={75} cy={65} r={12} fill="#fafaf9" />
      <circle cx={165} cy={65} r={12} fill="#fafaf9" />
      <circle cx={75} cy={65} r={4} fill="#78350f" />
      <circle cx={165} cy={65} r={4} fill="#78350f" />
      <Label x={120} y={124} anchor="middle" size={10} fill="#57534e">{g(L('one area across both trees', 'eine Fläche über beide Bäume'))}</Label>
    </svg>
  );
};

/** Overlap verdicts as pictures: mix / separate patches / keep apart. */
export const VerdictPicture: React.FC<{ verdict: 'COEXIST' | 'MOSAIC' | 'EXCLUDE'; className?: string }> = ({ verdict, className }) => {
  const id = `vp-${verdict}`;
  return (
    <svg viewBox="0 0 120 64" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={COVER} />
          <stop offset="0.42" stopColor={COVER} />
          <stop offset="0.58" stopColor={COVER2} />
          <stop offset="1" stopColor={COVER2} />
        </linearGradient>
      </defs>
      {verdict === 'COEXIST' && (
        <>
          <circle cx={46} cy={32} r={26} fill={COVER} opacity={0.5} />
          <circle cx={74} cy={32} r={26} fill={COVER2} opacity={0.45} />
        </>
      )}
      {verdict === 'MOSAIC' && <rect x={8} y={8} width={104} height={48} rx={22} fill={`url(#${id})`} opacity={0.6} />}
      {verdict === 'EXCLUDE' && (
        <>
          <rect x={6} y={8} width={44} height={48} rx={18} fill={COVER} opacity={0.5} />
          <rect x={70} y={8} width={44} height={48} rx={18} fill={COVER2} opacity={0.45} />
          <path d="M60 6 V58" stroke="#b45309" strokeWidth={2} strokeDasharray="4 3" />
        </>
      )}
    </svg>
  );
};

/** Months each season layer occupies the ground (northern-hemisphere schematic). */
export const SeasonTimeline: React.FC<DiagramProps> = ({ language, className }) => {
  const g = (l: L) => getLoc(l, language);
  const months = language === 'de' ? 'JFMAMJJASOND' : 'JFMAMJJASOND';
  const rows: Array<{ t: L; spans: Array<[number, number]>; c: string }> = [
    { t: L('Spring bulbs', 'Frühjahrszwiebeln'), spans: [[1, 5]], c: '#f472b6' },
    { t: L('Summer covers', 'Sommerbodendecker'), spans: [[3, 10]], c: COVER },
    { t: L('Winter covers', 'Winterbegrünung'), spans: [[0, 4], [8, 12]], c: '#38bdf8' },
  ];
  return (
    <div className={className}>
      <div className="grid grid-cols-[7.5rem_1fr] gap-x-2 gap-y-1.5 items-center text-[11px]">
        <span />
        <div className="grid grid-cols-12 text-center text-[10px] font-bold text-stone-400">{months.split('').map((m, i) => <span key={i}>{m}</span>)}</div>
        {rows.map(r => (
          <React.Fragment key={r.t.en}>
            <span className="font-semibold text-stone-700 text-right">{g(r.t)}</span>
            <div className="relative h-4 rounded-full bg-stone-100">
              {r.spans.map(([a, b], i) => (
                <div key={i} className="absolute top-0 h-4 rounded-full" style={{ left: `${(a / 12) * 100}%`, width: `${((b - a) / 12) * 100}%`, background: r.c, opacity: 0.75 }} />
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/** Schematic of the nectar pattern reported in the forage-gap study: peaks in May and July, low in March, June and Aug/Sep. */
export const ForageGapTimeline: React.FC<DiagramProps> = ({ language, className }) => {
  const g = (l: L) => getLoc(l, language);
  const months = 'JFMAMJJASOND';
  const gaps: Array<{ t: L; a: number; b: number }> = [
    { t: L('March', 'März'), a: 2, b: 3 },
    { t: L('June', 'Juni'), a: 5, b: 6 },
    { t: L('Aug–Sep', 'Aug–Sep'), a: 7, b: 9 },
  ];
  const peaks: Array<[number, number]> = [[4, 5], [6, 7]];
  const bar = (a: number, b: number) => ({ left: `${(a / 12) * 100}%`, width: `${((b - a) / 12) * 100}%` });
  return (
    <div className={className}>
      <div className="grid grid-cols-[7.5rem_1fr] gap-x-2 gap-y-1.5 items-center text-[11px]">
        <span />
        <div className="grid grid-cols-12 text-center text-[10px] font-bold text-stone-400">{months.split('').map((m, i) => <span key={i}>{m}</span>)}</div>
        <span className="font-semibold text-stone-700 text-right">{g(L('Nectar peaks', 'Nektarspitzen'))}</span>
        <div className="relative h-4 rounded-full bg-stone-100">
          {peaks.map(([a, b], i) => <div key={i} className="absolute top-0 h-4 rounded-full" style={{ ...bar(a, b), background: LEAF, opacity: 0.75 }} />)}
        </div>
        <span className="font-semibold text-stone-700 text-right">{g(L('Gaps', 'Lücken'))}</span>
        <div className="relative h-4 rounded-full bg-stone-100">
          {gaps.map(x => <div key={x.t.en} className="absolute top-0 h-4 rounded-full" style={{ ...bar(x.a, x.b), background: '#f59e0b', opacity: 0.8 }} />)}
        </div>
      </div>
      <p className="mt-1.5 text-[10px] text-stone-500 text-center">{g(L('Schematic, south-west England farmland [1]. Month positions are approximate.', 'Schema, Agrarland in Südwestengland [1]. Monatslagen sind ungefähr.'))}</p>
    </div>
  );
};
