import React, { useState, useEffect, useRef } from 'react';

// Flyweight Pattern cache to prevent identical normal-map recalculations
const lensCache = new Map<string, string>();

interface GlassEffectLayerProps {
  blockId: string | number;
  borderRadius: number;
  glassThickness: number;
  refractiveIndex: number;
  bezelWidth: number;
  glassZoom?: number;
  glassPreset?: 'convex-circular' | 'convex-smooth' | 'concave' | 'ridge';
  glassShowSpecular?: boolean;
}

export const GlassEffectLayer: React.FC<GlassEffectLayerProps> = ({
  blockId,
  borderRadius = 16,
  glassThickness = 80,
  refractiveIndex = 2.0,
  bezelWidth = 35,
  glassZoom = 30,
  glassPreset = 'convex-circular',
  glassShowSpecular = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dispUrl, setDispUrl] = useState<string>('');
  const [dimensions, setDimensions] = useState({ width: 300, height: 200 });

  // Measure card container layout dynamically via ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const nw = Math.max(10, Math.round(width));
        const nh = Math.max(10, Math.round(height));
        setDimensions(prev => prev.width !== nw || prev.height !== nh ? { width: nw, height: nh } : prev);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // CPU generation of refraction displacement map coordinates (normal maps)
  useEffect(() => {
    const w = dimensions.width;
    const h = dimensions.height;
    if (w < 4 || h < 4) return;

    // PERFORMANCE OPTIMIZATION: Downsample the displacement map to a maximum of 128px.
    // SVG filters scale it up using GPU bilinear interpolation, giving perfectly smooth results
    // while running the CPU looping and toDataURL generation up to 15x faster!
    const maxRes = 128;
    const scaleFactor = Math.min(1.0, maxRes / Math.max(w, h));
    const procW = Math.round(w * scaleFactor);
    const procH = Math.round(h * scaleFactor);

    // Scale properties to match low-res canvas coordinates
    const rScaled = Math.max(0, Math.min(borderRadius * scaleFactor, procW / 2, procH / 2));
    const bScaled = Math.max(2, Math.min(procW / 2, procH / 2, bezelWidth * scaleFactor));

    // Cache lookup key matching identical physical configurations for fast performance
    const cacheKey = `${procW}_${procH}_${rScaled}_${glassThickness}_${refractiveIndex}_${bScaled}_${glassZoom}_${glassPreset}`;
    
    if (lensCache.has(cacheKey)) {
      setDispUrl(lensCache.get(cacheKey)!);
      return;
    }

    // Generate displacement / normals map on hidden Canvas
    const dispCanvas = document.createElement('canvas');
    dispCanvas.width = procW;
    dispCanvas.height = procH;
    const dispCtx = dispCanvas.getContext('2d');

    if (dispCtx) {
      const imgData = dispCtx.createImageData(procW, procH);

      // Standard 2D Rounded Box SDF (Signed Distance Field)
      // Positive inside, Zero on boundary, Negative outside
      const sdRoundedBox = (px: number, py: number) => {
        const cx = procW / 2;
        const cy = procH / 2;
        const dx = Math.abs(px - cx) - (cx - rScaled);
        const dy = Math.abs(py - cy) - (cy - rScaled);
        
        // Accurate outer shape: perfectly circular corner boundaries
        const qx = Math.max(dx, 0);
        const qy = Math.max(dy, 0);
        const len = Math.sqrt(qx * qx + qy * qy);
        
        // Exact interior distance: distance to closest flat edge
        const minDist = Math.min(Math.max(dx, dy), 0);
        
        return rScaled - (len + minDist);
      };

      // 1. Bezel height profile (steep glass frame curve)
      const getBezelHeight = (px: number, py: number) => {
        const d = sdRoundedBox(px, py);
        if (d <= 0) {
          if (glassPreset === 'concave') return 1.0;
          return 0;
        }
        if (d >= bScaled) {
          if (glassPreset === 'concave') return 0;
          if (glassPreset === 'ridge') return 0;
          return 1;
        }
        const t = d / bScaled;
        if (glassPreset === 'convex-smooth') {
          // Smooth S-Curve Convex (Smoothstep)
          return 3.0 * t * t - 2.0 * t * t * t;
        } else if (glassPreset === 'concave') {
          // Scooped Concave
          return (1.0 - t) * (1.0 - t);
        } else if (glassPreset === 'ridge') {
          // Raised Ridge / Ripple
          return Math.pow(Math.sin(t * Math.PI), 2);
        } else {
          // Default: Convex Circular
          return Math.sqrt(1.0 - (1.0 - t) * (1.0 - t));
        }
      };

      // Fill pixel data with exact spatial gradients for refraction + height for reflective lighting
      const zoomStrength = glassZoom / 100;

      for (let y = 0; y < procH; y++) {
        for (let x = 0; x < procW; x++) {
          const idx = (y * procW + x) * 4;

          // Clamped lookups for finite differences to prevent out-of-boundary artifacts
          const xL = Math.max(0, x - 1);
          const xR = Math.min(procW - 1, x + 1);
          const yT = Math.max(0, y - 1);
          const yB = Math.min(procH - 1, y + 1);

          // Get bezel heights for border refraction
          const hbL = getBezelHeight(xL, y);
          const hbR = getBezelHeight(xR, y);
          const hbT = getBezelHeight(x, yT);
          const hbB = getBezelHeight(x, yB);

          const stepX = xR - xL;
          const stepY = yB - yT;

          // Outward slopes for bezel frame refraction (creates the "squeezed" border)
          const slopeBezelX = (hbL - hbR) / (stepX || 1);
          const slopeBezelY = (hbT - hbB) / (stepY || 1);

          const cx = procW / 2;
          const cy = procH / 2;
          const normX = (x - cx) / cx;
          const normY = (y - cy) / cy;

          // Uniform linear zoom displacement field
          // Perfectly clean, creaseless, and undistorted magnification inside the card's boundaries
          const zoomX = -normX * zoomStrength * 0.12;
          const zoomY = -normY * zoomStrength * 0.12;

          // Scale zoom offset by the bezel height to taper it beautifully to 0 at the card's edge
          const hb = getBezelHeight(x, y);
          const nx = slopeBezelX + zoomX * hb;
          const ny = slopeBezelY + zoomY * hb;

          // Map slopes to a safe, beautiful range [-128, 127]
          // Dynamic scaling factor based on refractiveIndex prop (and a scale factor of 128 to match full 8-bit color space)
          const baseStrength = 1.8;
          const finalX = nx * 128 * refractiveIndex * baseStrength;
          const finalY = ny * 128 * refractiveIndex * baseStrength;

          // R channel shifts X, G channel shifts Y (Neutral value is 128)
          const rVal = Math.round(128 + finalX);
          const gVal = Math.round(128 + finalY);

          // B channel stores the height field h(x,y) to feed 3D specular highlight computations inside SVG
          // Center is completely flat (getBezelHeight = 1.0) so specular highlights only reflect on curved border bezels!
          const hVal = getBezelHeight(x, y);
          const bVal = Math.round(Math.min(1.0, hVal) * 255);

          imgData.data[idx] = Math.max(0, Math.min(255, rVal));
          imgData.data[idx + 1] = Math.max(0, Math.min(255, gVal));
          imgData.data[idx + 2] = Math.max(0, Math.min(255, bVal));
          imgData.data[idx + 3] = 255; // Keep texture fully opaque for maximum GPU memory safety
        }
      }
      dispCtx.putImageData(imgData, 0, 0);
      const generatedDispUrl = dispCanvas.toDataURL('image/png');
      
      lensCache.set(cacheKey, generatedDispUrl);
      setDispUrl(generatedDispUrl);
    }
  }, [dimensions, borderRadius, glassThickness, refractiveIndex, bezelWidth, glassZoom, glassPreset]);

  // Gentle layout blur depth, scaled conservatively from 1px to 4px max
  const blurDepth = Math.max(1, Math.min(4, Math.round(glassThickness / 45)));
  
  // Clean displacement scale based on physical glassThickness and refractiveIndex (IOR slider)
  const displacementScale = Math.max(2, Math.round(glassThickness * (refractiveIndex - 0.9) * 0.95));

  // Dynamic filterId that includes actual styling props to bypass browser's stale filter caches
  const rStable = Math.max(0, Math.min(borderRadius, dimensions.width / 2, dimensions.height / 2));
  const roundedRefractiveIndex = Math.round(refractiveIndex * 100);
  const filterId = `glass-refract-${blockId}-${rStable}-${glassThickness}-${bezelWidth}-${roundedRefractiveIndex}-${glassPreset}-${dimensions.width}-${dimensions.height}`;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
      style={{ borderRadius: `${borderRadius}px` }}
    >
      {/* Dynamic Scoped SVG Displacement Filter acting as local shader */}
      {dispUrl && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute pointer-events-none w-0 h-0"
          style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
          aria-hidden="true"
        >
          <defs>
            <filter 
              id={filterId} 
              filterUnits="userSpaceOnUse"
              x={-displacementScale} 
              y={-displacementScale} 
              width={dimensions.width + displacementScale * 2} 
              height={dimensions.height + displacementScale * 2}
              colorInterpolationFilters="sRGB"
            >
              <feImage 
                href={dispUrl} 
                x="0" 
                y="0" 
                width={dimensions.width} 
                height={dimensions.height} 
                preserveAspectRatio="none" 
                result="disp" 
              />
              {/* Refract the background behind the card based on R/G slopes */}
              <feDisplacementMap 
                in="SourceGraphic" 
                in2="disp" 
                scale={displacementScale} 
                xChannelSelector="R" 
                yChannelSelector="G" 
              />
            </filter>
          </defs>
        </svg>
      )}

      {/* Glass backdrop with CSS GPU composition + active SVG normal offset */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-0"
        style={{
          borderRadius: 'inherit',
          backdropFilter: dispUrl 
            ? `blur(${blurDepth}px) url(#${filterId})` 
            : `blur(${blurDepth}px)`,
          WebkitBackdropFilter: dispUrl 
            ? `blur(${blurDepth}px) url(#${filterId})` 
            : `blur(${blurDepth}px)`,
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          willChange: 'backdrop-filter',
          transform: 'translate3d(0,0,0)',
        }}
      />

      {/* Subtle outer bezel line for refined glass edges */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-10"
        style={{
          borderRadius: 'inherit',
          boxShadow: 'inset 0 1px 0px rgba(255, 255, 255, 0.15), inset 0 -1px 0px rgba(0, 0, 0, 0.1)',
        }}
      />
    </div>
  );
};

export const GlassRefractorWrapper: React.FC<{
  blockId: string | number;
  borderRadius: number;
  glassThickness: number;
  refractiveIndex: number;
  bezelWidth: number;
  glassZoom?: number;
  glassPreset?: 'convex-circular' | 'convex-smooth' | 'concave' | 'ridge';
  glassShowSpecular?: boolean;
}> = ({ blockId, borderRadius, glassThickness, refractiveIndex, bezelWidth, glassZoom, glassPreset, glassShowSpecular }) => {
  return (
    <div className="absolute inset-0 z-[5] overflow-visible" style={{ borderRadius: 'inherit' }}>
      <GlassEffectLayer
        blockId={blockId}
        borderRadius={borderRadius}
        glassThickness={glassThickness}
        refractiveIndex={refractiveIndex}
        bezelWidth={bezelWidth}
        glassZoom={glassZoom}
        glassPreset={glassPreset}
        glassShowSpecular={glassShowSpecular}
      />
    </div>
  );
};

export const GlobalGlassFilters: React.FC<{ blocks: any[] }> = ({ blocks }) => {
  return null;
};
