'use client';

import dynamic from 'next/dynamic';

export interface LiquidGlassCardProps {
  children: React.ReactNode;
  displacementScale?: number;
  blurAmount?: number;
  cornerRadius?: number;
  className?: string;
  padding?: string;
  style?: React.CSSProperties;
  shadowMode?: boolean;
  onClick?: () => void;
}

const LiquidGlassCard = dynamic<LiquidGlassCardProps>(
  () => import('@developer-hub/liquid-glass').then((m) => m.GlassCard),
  { ssr: false }
);

export default LiquidGlassCard;
