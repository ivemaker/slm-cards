import React, { useState, useEffect, useRef } from 'react';

export interface CornerGlowOverlayProps {
  borderRadius: number;
  
  borderGlowActive?: boolean;
  borderGlowColor?: string;
  borderGlowWidth?: number;
  borderGlowOpacity?: number;

  borderCornerGlowActive?: boolean;
  borderCornerColorTL?: string; // Backwards compatibility
  borderCornerColorTR?: string;
  borderCornerColorBL?: string;
  borderCornerColorBR?: string; // Backwards compatibility
  borderCornerLength?: number;  // Backwards compatibility
  borderCornerStroke?: number;  // Backwards compatibility
  borderCornerGlowSpread?: number;
  borderCornerGlowOpacity?: number;
}

export const CornerGlowOverlay: React.FC<CornerGlowOverlayProps> = ({
  borderRadius = 12,
  
  borderGlowActive = false,
  borderGlowColor = '#6366f1',
  borderGlowWidth = 15,
  borderGlowOpacity = 60,

  borderCornerGlowActive = false,
  borderCornerColorTR = '#818cf8',
  borderCornerColorBL = '#fbbf24',
  borderCornerGlowSpread = 12,
  borderCornerGlowOpacity = 80,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const uniqueId = useRef(Math.random().toString(36).substring(2, 9)).current;

  // Measure card container layout dynamically via ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const parent = containerRef.current.parentElement;
    
    const updateSize = () => {
      if (parent) {
        const w = parent.offsetWidth || parent.clientWidth || 0;
        const h = parent.offsetHeight || parent.clientHeight || 0;
        setDimensions(prev => prev.width !== w || prev.height !== h ? { width: w, height: h } : prev);
      }
    };
    
    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    if (parent) {
      resizeObserver.observe(parent);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const W = dimensions.width;
  const H = dimensions.height;

  // Render minimal anchor if not measured yet
  if (W === 0 || H === 0) {
    return <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
  }

  // S = 1.0 matches the card's 1px outline thickness perfectly (as requested: "угловые контуры должны быть тойже толщины что и основной контур")
  const S = 1.0; 
  const O = S / 2; // Pixel-perfect offset alignment

  const R = Math.min(borderRadius, Math.min(W / 2, H / 2));

  // Top-Right Midpoints and diagonal apex coordinates
  const x_mid_t = W / 2;
  const y_mid_r = H / 2;
  const tr_apex_x = W - O - 0.2929 * R;
  const tr_apex_y = O + 0.2929 * R;

  // BL Midpoints and diagonal apex coordinates
  const y_mid_l = H / 2;
  const x_mid_b = W / 2;
  const bl_apex_x = O + 0.2929 * R;
  const bl_apex_y = H - O - 0.2929 * R;

  // Top-Right Paths
  const pathTR1 = `M ${x_mid_t} ${O} L ${W - O - R} ${O} A ${R} ${R} 0 0 1 ${tr_apex_x} ${tr_apex_y}`;
  const pathTR2 = `M ${tr_apex_x} ${tr_apex_y} A ${R} ${R} 0 0 1 ${W - O} ${O + R} L ${W - O} ${y_mid_r}`;

  // Bottom-Left Paths
  const pathBL1 = `M ${O} ${y_mid_l} L ${O} ${H - O - R} A ${R} ${R} 0 0 0 ${bl_apex_x} ${bl_apex_y}`;
  const pathBL2 = `M ${bl_apex_x} ${bl_apex_y} A ${R} ${R} 0 0 0 ${O + R} ${H - O} L ${x_mid_b} ${H - O}`;

  // Full Outline Glow Style
  const shadowOpacityHex = Math.round((borderGlowOpacity / 100) * 255).toString(16).padStart(2, '0');
  const fullContourGlowStyle: React.CSSProperties = {
    borderRadius: `${borderRadius}px`,
    boxShadow: `0 0 ${borderGlowWidth}px ${borderGlowColor}${shadowOpacityHex}`,
    opacity: borderGlowOpacity / 100,
    mixBlendMode: 'screen',
  };

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none select-none z-50" style={{ borderRadius: `${borderRadius}px` }}>
      {/* 1. Full Contour Glow backplate */}
      {borderGlowActive && (
        <div 
          className="absolute inset-[0.5px] pointer-events-none select-none animate-pulse duration-1000 z-10 mix-blend-screen"
          style={fullContourGlowStyle}
        />
      )}

      {/* 2. Specialized Corner Lights Overlay with fading path linear gradients */}
      {borderCornerGlowActive && (
        <svg 
          className="absolute inset-x-0 inset-y-0 w-full h-full pointer-events-none select-none overflow-visible z-20 mix-blend-screen"
          style={{ mixBlendMode: 'screen', opacity: borderCornerGlowOpacity / 100 }}
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
        >
          <defs>
            {/* Blurring filter definitions for realistic neon halo bloom */}
            <filter id={`corner-bloom-soft-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={borderCornerGlowSpread * 2.2} />
            </filter>
            
            <filter id={`corner-bloom-sharp-${uniqueId}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation={borderCornerGlowSpread * 0.7} />
            </filter>

            {/* TR Segment 1: Fades from 0% opacity at top center (W/2, O) to 100% opacity at Corner Apex */}
            <linearGradient id={`grad-tr1-${uniqueId}`} x1={x_mid_t} y1={O} x2={tr_apex_x} y2={tr_apex_y} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={borderCornerColorTR} stopOpacity="0" />
              <stop offset="100%" stopColor={borderCornerColorTR} stopOpacity="1" />
            </linearGradient>

            {/* TR Segment 2: Fades from 100% opacity at Corner Apex to 0% opacity at right center (W-O, H/2) */}
            <linearGradient id={`grad-tr2-${uniqueId}`} x1={tr_apex_x} y1={tr_apex_y} x2={W - O} y2={y_mid_r} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={borderCornerColorTR} stopOpacity="1" />
              <stop offset="100%" stopColor={borderCornerColorTR} stopOpacity="0" />
            </linearGradient>

            {/* BL Segment 1: Fades from 0% opacity at left center (O, H/2) to 100% opacity at Corner Apex */}
            <linearGradient id={`grad-bl1-${uniqueId}`} x1={O} y1={y_mid_l} x2={bl_apex_x} y2={bl_apex_y} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={borderCornerColorBL} stopOpacity="0" />
              <stop offset="100%" stopColor={borderCornerColorBL} stopOpacity="1" />
            </linearGradient>

            {/* BL Segment 2: Fades from 100% opacity at Corner Apex to 0% opacity at bottom center (W/2, H-O) */}
            <linearGradient id={`grad-bl2-${uniqueId}`} x1={bl_apex_x} y1={bl_apex_y} x2={x_mid_b} y2={H - O} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={borderCornerColorBL} stopOpacity="1" />
              <stop offset="100%" stopColor={borderCornerColorBL} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* LAYER 1: AMBIENT SOFT BLOOM HALO */}
          <g filter={`url(#corner-bloom-soft-${uniqueId})`} opacity={0.85}>
            <path d={pathTR1} fill="none" stroke={`url(#grad-tr1-${uniqueId})`} strokeWidth={borderCornerGlowSpread * 4.5} strokeLinecap="round" />
            <path d={pathTR2} fill="none" stroke={`url(#grad-tr2-${uniqueId})`} strokeWidth={borderCornerGlowSpread * 4.5} strokeLinecap="round" />
            <path d={pathBL1} fill="none" stroke={`url(#grad-bl1-${uniqueId})`} strokeWidth={borderCornerGlowSpread * 4.5} strokeLinecap="round" />
            <path d={pathBL2} fill="none" stroke={`url(#grad-bl2-${uniqueId})`} strokeWidth={borderCornerGlowSpread * 4.5} strokeLinecap="round" />
          </g>

          {/* LAYER 2: INTENSE NEON CORE BLOOM */}
          <g filter={`url(#corner-bloom-sharp-${uniqueId})`} opacity={0.95}>
            <path d={pathTR1} fill="none" stroke={`url(#grad-tr1-${uniqueId})`} strokeWidth={borderCornerGlowSpread * 1.5} strokeLinecap="round" />
            <path d={pathTR2} fill="none" stroke={`url(#grad-tr2-${uniqueId})`} strokeWidth={borderCornerGlowSpread * 1.5} strokeLinecap="round" />
            <path d={pathBL1} fill="none" stroke={`url(#grad-bl1-${uniqueId})`} strokeWidth={borderCornerGlowSpread * 1.5} strokeLinecap="round" />
            <path d={pathBL2} fill="none" stroke={`url(#grad-bl2-${uniqueId})`} strokeWidth={borderCornerGlowSpread * 1.5} strokeLinecap="round" />
          </g>

          {/* LAYER 3: THIN CRISP CONTOUR LASER CORE (Thickness matches card borders) */}
          <g>
            <path d={pathTR1} fill="none" stroke={`url(#grad-tr1-${uniqueId})`} strokeWidth={S} strokeLinecap="round" />
            <path d={pathTR2} fill="none" stroke={`url(#grad-tr2-${uniqueId})`} strokeWidth={S} strokeLinecap="round" />
            <path d={pathBL1} fill="none" stroke={`url(#grad-bl1-${uniqueId})`} strokeWidth={S} strokeLinecap="round" />
            <path d={pathBL2} fill="none" stroke={`url(#grad-bl2-${uniqueId})`} strokeWidth={S} strokeLinecap="round" />
          </g>
        </svg>
      )}
    </div>
  );
};
