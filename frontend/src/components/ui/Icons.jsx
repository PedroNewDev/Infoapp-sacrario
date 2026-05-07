import {
  Lock, Check, Book, Headphones, Music, Play,
  Cross, Heart, PenLine, ShoppingBag,
  Shield, SkipForward, Wrench, Hand,
} from 'lucide-react';

const gold = '#C9932A';
const s = { color: gold, strokeWidth: 1.8 };

export const IconLock = (p) => <Lock {...s} size={p.size || 16} {...p} />;
export const IconCheck = (p) => <Check {...s} size={p.size || 16} {...p} />;
export const IconBook = (p) => <Book {...s} size={p.size || 20} {...p} />;
export const IconHeadphones = (p) => <Headphones {...s} size={p.size || 20} {...p} />;
export const IconMusic = (p) => <Music {...s} size={p.size || 16} {...p} />;
export const IconPlay = (p) => <Play {...s} size={p.size || 16} {...p} />;
export const IconCross = (p) => <Cross {...s} size={p.size || 16} {...p} />;
export const IconHeart = (p) => <Heart {...s} size={p.size || 16} {...p} />;
export const IconPen = (p) => <PenLine {...s} size={p.size || 14} {...p} />;
export const IconBag = (p) => <ShoppingBag {...s} size={p.size || 18} {...p} />;
export const IconShield = (p) => <Shield {...s} size={p.size || 18} {...p} />;
export const IconSkip = (p) => <SkipForward {...s} size={p.size || 14} {...p} />;
export const IconWrench = (p) => <Wrench {...s} size={p.size || 14} {...p} />;
export const IconHands = (p) => <Hand {...s} size={p.size || 20} {...p} />;

export function RoseIcon({ size = 24, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...p}>
      {/* Outer petals */}
      <path d="M12 2C8 6 6 10 6 14c0 3.3 2.7 6 6 6s6-2.7 6-6c0-4-2-8-6-12z" fill="#C9932A" opacity={0.7} />
      <path d="M12 2C10 5 9 9 9 12c0 2.2 1.3 4 3 4s3-1.8 3-4c0-3-1-7-3-10z" fill="#D4A843" opacity={0.85} />
      {/* Inner spiral */}
      <path d="M12 6c-1 2-1.5 4-1.5 5.5 0 1 .5 1.5 1.5 1.5s1.5-.5 1.5-1.5C13.5 10 13 8 12 6z" fill="#E8C97A" />
      {/* Stem */}
      <path d="M12 20v2" stroke="#7A5C3A" strokeWidth={1.5} />
      <path d="M10 21.5l2 .5 2-.5" stroke="#7A5C3A" strokeWidth={1} strokeLinecap="round" />
    </svg>
  );
}
