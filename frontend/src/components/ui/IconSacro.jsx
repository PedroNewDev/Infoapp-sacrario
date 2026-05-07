/**
 * IconSacro — Ícones devocionais católicos no estilo "Estampa Iluminada"
 * - viewBox 48x48
 * - Outline #6B4A0C (dourado escuro)
 * - Fill em gradiente dourado (folha-de-ouro)
 * - Marca de coesão: losango ✦ recorrente em cada ícone
 */

const G = 'iconsacro-gold';
const STROKE = '#6B4A0C';
const HIGHLIGHT = '#FFE9B5';
const DEEP = '#7A5410';

function Defs() {
  return (
    <defs>
      <linearGradient id={G} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F0D27F" />
        <stop offset="45%" stopColor="#C9932A" />
        <stop offset="100%" stopColor="#7A5410" />
      </linearGradient>
    </defs>
  );
}

const fill = `url(#${G})`;

function Mark({ x, y, s = 1, op = 0.5 }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${s})`} fill="#C9932A" opacity={op}>
      <path d="M0 -2.5 L0.55 0 L0 2.5 L-0.55 0 Z M-2.5 0 L0 -0.55 L2.5 0 L0 0.55 Z" />
    </g>
  );
}

function Rosary() {
  return (
    <g>
      <circle cx="24" cy="17" r="9.5" fill="none" stroke={STROKE} strokeWidth="0.7" opacity="0.55" />
      <circle cx="24" cy="7.5" r="2.4" fill={fill} stroke={STROKE} strokeWidth="0.5" />
      <circle cx="24" cy="7.5" r="0.6" fill={HIGHLIGHT} opacity="0.85" />
      <circle cx="30.7" cy="10.3" r="1.55" fill={fill} stroke={STROKE} strokeWidth="0.4" />
      <circle cx="33.5" cy="17" r="1.55" fill={fill} stroke={STROKE} strokeWidth="0.4" />
      <circle cx="30.7" cy="23.7" r="1.55" fill={fill} stroke={STROKE} strokeWidth="0.4" />
      <circle cx="24" cy="26.5" r="1.55" fill={fill} stroke={STROKE} strokeWidth="0.4" />
      <circle cx="17.3" cy="23.7" r="1.55" fill={fill} stroke={STROKE} strokeWidth="0.4" />
      <circle cx="14.5" cy="17" r="1.55" fill={fill} stroke={STROKE} strokeWidth="0.4" />
      <circle cx="17.3" cy="10.3" r="1.55" fill={fill} stroke={STROKE} strokeWidth="0.4" />
      <line x1="24" y1="28" x2="24" y2="35" stroke={STROKE} strokeWidth="0.7" />
      <circle cx="24" cy="31.5" r="1.3" fill={fill} stroke={STROKE} strokeWidth="0.4" />
      <g transform="translate(24, 41)">
        <path d="M-1.3 -5.5 L1.3 -5.5 L1.3 5 L-1.3 5 Z" fill={fill} stroke={STROKE} strokeWidth="0.5" strokeLinejoin="round" />
        <path d="M-4.2 -1.6 L4.2 -1.6 L4.2 1 L-4.2 1 Z" fill={fill} stroke={STROKE} strokeWidth="0.5" strokeLinejoin="round" />
        <circle cx="0" cy="-0.3" r="0.6" fill={HIGHLIGHT} opacity="0.8" />
      </g>
      <Mark x={24} y={17} s={0.85} />
    </g>
  );
}

function Rose() {
  return (
    <g>
      <path d="M24 28 Q22 35 24 42" stroke={STROKE} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M24 36 Q18 33 14 37 Q19 39 24 37" fill={fill} stroke={STROKE} strokeWidth="0.5" strokeLinejoin="round" />
      <path d="M24 32 Q30 30 33 33 Q29 35 24 33" fill={fill} stroke={STROKE} strokeWidth="0.5" strokeLinejoin="round" opacity="0.85" />
      <path d="M16 22 Q14 14 22 12 Q26 12 28 16 Q34 14 34 22 Q34 28 28 30 Q24 32 20 30 Q14 28 16 22 Z" fill={fill} stroke={STROKE} strokeWidth="0.6" strokeLinejoin="round" />
      <path d="M19 22 Q19 17 24 17 Q29 17 29 22 Q29 27 24 27 Q19 27 19 22 Z" fill={DEEP} stroke={STROKE} strokeWidth="0.4" />
      <path d="M22 20 Q22 18 24 18 Q26 18 26 21 Q26 24 24 24 Q22 24 22 22 Z" fill={HIGHLIGHT} opacity="0.55" />
      <Mark x={24} y={9} s={0.7} />
    </g>
  );
}

function PrayingHands() {
  return (
    <g>
      <path d="M22 7 Q20 7 20 10 L18 28 Q15 28 15 31 L15 38 L24 38 L24 8 Q24 7 23 7 Z" fill={fill} stroke={STROKE} strokeWidth="0.55" strokeLinejoin="round" />
      <path d="M26 7 Q28 7 28 10 L30 28 Q33 28 33 31 L33 38 L24 38 L24 8 Q24 7 25 7 Z" fill={fill} stroke={STROKE} strokeWidth="0.55" strokeLinejoin="round" />
      <line x1="24" y1="9" x2="24" y2="38" stroke={STROKE} strokeWidth="0.5" opacity="0.6" />
      <path d="M14 38 L34 38 L34 41 L14 41 Z" fill={DEEP} stroke={STROKE} strokeWidth="0.5" />
      <Mark x={24} y={5} s={0.65} />
    </g>
  );
}

function Candle() {
  return (
    <g>
      <ellipse cx="24" cy="40" rx="7" ry="1.5" fill={fill} stroke={STROKE} strokeWidth="0.5" />
      <path d="M19 17 L29 17 L28 39 L20 39 Z" fill={fill} stroke={STROKE} strokeWidth="0.5" strokeLinejoin="round" />
      <path d="M28 20 Q29.5 24 28 28" stroke={STROKE} strokeWidth="0.5" fill="none" />
      <path d="M21 22 Q22 26 21 30" stroke={STROKE} strokeWidth="0.4" fill="none" opacity="0.6" />
      <line x1="24" y1="14" x2="24" y2="17" stroke={STROKE} strokeWidth="0.7" />
      <path d="M24 5 Q21 8 21 13 Q21 16 24 16 Q27 16 27 13 Q27 8 24 5 Z" fill={fill} stroke={STROKE} strokeWidth="0.5" strokeLinejoin="round" />
      <path d="M24 9 Q22.5 11 23 13 Q24 14.5 25 13 Q25.5 11 24 9 Z" fill={HIGHLIGHT} opacity="0.75" />
      <Mark x={24} y={10} s={0.5} op={0.6} />
    </g>
  );
}

function Church() {
  return (
    <g>
      <line x1="24" y1="3" x2="24" y2="9" stroke={STROKE} strokeWidth="1" strokeLinecap="round" />
      <line x1="22" y1="5.5" x2="26" y2="5.5" stroke={STROKE} strokeWidth="1" strokeLinecap="round" />
      <path d="M21 14 L24 9.5 L27 14 L27 22 L21 22 Z" fill={fill} stroke={STROKE} strokeWidth="0.5" strokeLinejoin="round" />
      <path d="M14 22 L14 41 L34 41 L34 22 L24 18 Z" fill={fill} stroke={STROKE} strokeWidth="0.5" strokeLinejoin="round" />
      <circle cx="24" cy="26" r="2" fill={HIGHLIGHT} stroke={STROKE} strokeWidth="0.4" />
      <line x1="24" y1="24" x2="24" y2="28" stroke={STROKE} strokeWidth="0.4" />
      <line x1="22" y1="26" x2="26" y2="26" stroke={STROKE} strokeWidth="0.4" />
      <path d="M21 33 Q21 31 24 31 Q27 31 27 33 L27 41 L21 41 Z" fill={DEEP} stroke={STROKE} strokeWidth="0.5" />
      <line x1="14" y1="41" x2="34" y2="41" stroke={STROKE} strokeWidth="0.6" />
      <Mark x={11} y={26} s={0.55} op={0.45} />
      <Mark x={37} y={26} s={0.55} op={0.45} />
    </g>
  );
}

function Book() {
  return (
    <g>
      <line x1="24" y1="11" x2="24" y2="40" stroke={STROKE} strokeWidth="0.6" />
      <path d="M24 12 L8 14 L8 38 L24 40 Z" fill={fill} stroke={STROKE} strokeWidth="0.55" strokeLinejoin="round" />
      <path d="M24 12 L40 14 L40 38 L24 40 Z" fill={fill} stroke={STROKE} strokeWidth="0.55" strokeLinejoin="round" />
      <line x1="11" y1="20" x2="20" y2="20.6" stroke={STROKE} strokeWidth="0.5" opacity="0.65" />
      <line x1="11" y1="24" x2="20" y2="24.6" stroke={STROKE} strokeWidth="0.5" opacity="0.65" />
      <line x1="11" y1="28" x2="18" y2="28.5" stroke={STROKE} strokeWidth="0.5" opacity="0.65" />
      <line x1="11" y1="32" x2="20" y2="32.6" stroke={STROKE} strokeWidth="0.5" opacity="0.65" />
      <line x1="28" y1="20.6" x2="37" y2="20" stroke={STROKE} strokeWidth="0.5" opacity="0.65" />
      <line x1="28" y1="24.6" x2="37" y2="24" stroke={STROKE} strokeWidth="0.5" opacity="0.65" />
      <line x1="30" y1="28.5" x2="37" y2="28" stroke={STROKE} strokeWidth="0.5" opacity="0.65" />
      <line x1="28" y1="32.6" x2="37" y2="32" stroke={STROKE} strokeWidth="0.5" opacity="0.65" />
      <path d="M28 12.5 L28 22 L30 20.4 L32 22 L32 12.7 Z" fill={DEEP} stroke={STROKE} strokeWidth="0.4" strokeLinejoin="round" />
      <Mark x={24} y={9} s={0.55} />
    </g>
  );
}

function Headphones() {
  return (
    <g>
      <path d="M9 30 Q9 11 24 11 Q39 11 39 30" stroke={STROKE} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M11 29 Q11 13 24 13 Q37 13 37 29" stroke={fill} strokeWidth="0.7" fill="none" />
      <path d="M5 29 L5 40 Q5 43 8 43 L13 43 Q15 43 15 40 L15 29 Q15 27 13 27 L7 27 Q5 27 5 29 Z" fill={fill} stroke={STROKE} strokeWidth="0.55" strokeLinejoin="round" />
      <path d="M33 29 Q33 27 35 27 L41 27 Q43 27 43 29 L43 40 Q43 43 40 43 L35 43 Q33 43 33 40 Z" fill={fill} stroke={STROKE} strokeWidth="0.55" strokeLinejoin="round" />
      <line x1="7" y1="35" x2="13" y2="35" stroke={STROKE} strokeWidth="0.5" opacity="0.7" />
      <line x1="35" y1="35" x2="41" y2="35" stroke={STROKE} strokeWidth="0.5" opacity="0.7" />
      <Mark x={24} y={9} s={0.55} />
    </g>
  );
}

function Music() {
  return (
    <g>
      <ellipse cx="17" cy="36" rx="5.5" ry="3.8" transform="rotate(-18 17 36)" fill={fill} stroke={STROKE} strokeWidth="0.55" />
      <line x1="22" y1="34" x2="22" y2="9" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M22 9 Q33 13 33 23 Q28 18 22 19 Z" fill={fill} stroke={STROKE} strokeWidth="0.55" strokeLinejoin="round" />
      <path d="M22 14 Q30 17 30 22" stroke={STROKE} strokeWidth="0.4" fill="none" opacity="0.55" />
      <Mark x={32} y={9} s={0.5} />
    </g>
  );
}

function Heart() {
  return (
    <g>
      <path d="M24 40 C10 31 6 19 13 13 Q19 9 23 14 L24 16 L25 14 Q29 9 35 13 C42 19 38 31 24 40 Z" fill={fill} stroke={STROKE} strokeWidth="0.6" strokeLinejoin="round" />
      <path d="M16 16 Q13 22 15 28" stroke={HIGHLIGHT} strokeWidth="0.7" fill="none" opacity="0.65" />
      <circle cx="24" cy="22" r="1.2" fill={DEEP} />
      <Mark x={24} y={6} s={0.55} />
    </g>
  );
}

function Cross() {
  return (
    <g>
      <path d="M22 5 L26 5 L26 17 L38 17 L38 21 L26 21 L26 43 L22 43 L22 21 L10 21 L10 17 L22 17 Z" fill={fill} stroke={STROKE} strokeWidth="0.6" strokeLinejoin="round" />
      <circle cx="24" cy="5" r="1.8" fill={fill} stroke={STROKE} strokeWidth="0.4" />
      <circle cx="10" cy="19" r="1.8" fill={fill} stroke={STROKE} strokeWidth="0.4" />
      <circle cx="38" cy="19" r="1.8" fill={fill} stroke={STROKE} strokeWidth="0.4" />
      <circle cx="24" cy="43" r="1.8" fill={fill} stroke={STROKE} strokeWidth="0.4" />
      <circle cx="24" cy="19" r="1" fill={HIGHLIGHT} opacity="0.85" />
      <Mark x={24} y={30} s={0.5} op={0.4} />
    </g>
  );
}

function Crown() {
  return (
    <g>
      <line x1="24" y1="3" x2="24" y2="9" stroke={STROKE} strokeWidth="0.9" strokeLinecap="round" />
      <line x1="22" y1="5.5" x2="26" y2="5.5" stroke={STROKE} strokeWidth="0.9" strokeLinecap="round" />
      <path d="M8 32 L10 16 L18 24 L24 10 L30 24 L38 16 L40 32 Z" fill={fill} stroke={STROKE} strokeWidth="0.6" strokeLinejoin="round" />
      <path d="M8 32 L40 32 L40 38 L8 38 Z" fill={fill} stroke={STROKE} strokeWidth="0.6" />
      <line x1="8" y1="35" x2="40" y2="35" stroke={STROKE} strokeWidth="0.4" opacity="0.7" />
      <circle cx="10" cy="16" r="1.4" fill={DEEP} stroke={STROKE} strokeWidth="0.4" />
      <circle cx="38" cy="16" r="1.4" fill={DEEP} stroke={STROKE} strokeWidth="0.4" />
      <circle cx="24" cy="10" r="1.8" fill={DEEP} stroke={STROKE} strokeWidth="0.4" />
      <circle cx="14" cy="35" r="0.9" fill={DEEP} />
      <circle cx="24" cy="35" r="0.9" fill={DEEP} />
      <circle cx="34" cy="35" r="0.9" fill={DEEP} />
    </g>
  );
}

function Lock() {
  return (
    <g>
      <path d="M16 22 L16 14 Q16 7 24 7 Q32 7 32 14 L32 22" stroke={STROKE} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M17 22 L17 14 Q17 8.5 24 8.5 Q31 8.5 31 14 L31 22" stroke={fill} strokeWidth="1" fill="none" />
      <rect x="11" y="22" width="26" height="19" rx="2.5" fill={fill} stroke={STROKE} strokeWidth="0.6" />
      <circle cx="24" cy="29" r="2.4" fill={DEEP} stroke={STROKE} strokeWidth="0.4" />
      <path d="M24 31 L24 36" stroke={DEEP} strokeWidth="1.5" strokeLinecap="round" />
      <Mark x={24} y={14} s={0.55} op={0.45} />
    </g>
  );
}

function Star() {
  return (
    <g>
      <path d="M24 4 L26.5 21.5 L44 24 L26.5 26.5 L24 44 L21.5 26.5 L4 24 L21.5 21.5 Z" fill={fill} stroke={STROKE} strokeWidth="0.6" strokeLinejoin="round" />
      <path d="M24 14 L25 23 L34 24 L25 25 L24 34 L23 25 L14 24 L23 23 Z" fill={HIGHLIGHT} opacity="0.55" />
      <circle cx="24" cy="24" r="1.2" fill={HIGHLIGHT} opacity="0.9" />
    </g>
  );
}

function Bag() {
  return (
    <g>
      <path d="M19 16 L19 12 Q19 7 24 7 Q29 7 29 12 L29 16" stroke={STROKE} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M12 16 L36 16 L38 41 L10 41 Z" fill={fill} stroke={STROKE} strokeWidth="0.6" strokeLinejoin="round" />
      <line x1="13" y1="22" x2="35" y2="22" stroke={STROKE} strokeWidth="0.5" opacity="0.6" />
      <Mark x={24} y={29} s={0.7} />
    </g>
  );
}

function Medal() {
  return (
    <g>
      <path d="M19 7 L21 18 L27 18 L29 7 Z" fill={DEEP} stroke={STROKE} strokeWidth="0.5" strokeLinejoin="round" />
      <line x1="20" y1="11" x2="28" y2="11" stroke={STROKE} strokeWidth="0.4" />
      <circle cx="24" cy="30" r="11" fill={fill} stroke={STROKE} strokeWidth="0.6" />
      <circle cx="24" cy="30" r="8" fill="none" stroke={STROKE} strokeWidth="0.4" />
      <line x1="24" y1="22" x2="24" y2="38" stroke={STROKE} strokeWidth="0.5" />
      <line x1="16" y1="30" x2="32" y2="30" stroke={STROKE} strokeWidth="0.5" />
      <Mark x={24} y={30} s={0.7} op={0.7} />
    </g>
  );
}

function Shield() {
  return (
    <g>
      <path d="M24 5 L38 9 L38 26 Q38 36 24 43 Q10 36 10 26 L10 9 Z" fill={fill} stroke={STROKE} strokeWidth="0.6" strokeLinejoin="round" />
      <path d="M24 8 L35 11 L35 25 Q35 33 24 39 Q13 33 13 25 L13 11 Z" fill="none" stroke={STROKE} strokeWidth="0.4" opacity="0.5" />
      <path d="M22 16 L26 16 L26 22 L32 22 L32 26 L26 26 L26 34 L22 34 L22 26 L16 26 L16 22 L22 22 Z" fill={DEEP} stroke={STROKE} strokeWidth="0.4" strokeLinejoin="round" />
    </g>
  );
}

const ICONS = {
  rosary: Rosary,
  rose: Rose,
  'praying-hands': PrayingHands,
  candle: Candle,
  church: Church,
  book: Book,
  headphones: Headphones,
  music: Music,
  heart: Heart,
  cross: Cross,
  crown: Crown,
  lock: Lock,
  star: Star,
  bag: Bag,
  medal: Medal,
  shield: Shield,
};

export default function IconSacro({ name, size = 48, className = '', style }) {
  const IconBody = ICONS[name];
  if (!IconBody) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <Defs />
      <IconBody />
    </svg>
  );
}
