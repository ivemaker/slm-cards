import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { BgEffect } from '../types';
import { normalizeEffectType } from '../utils';
import { CosmicPlasmaNebula } from './CosmicPlasmaNebula';
import { ChromaLab } from './ChromaLab';
import FlatWaves from './FlatWaves';
import { BezierWaves } from './BezierWaves';
import { LiquidRipples } from './LiquidRipples';
import { OrigamiLine } from './OrigamiLine';
import WebGLPolylines from './WebGLPolylines';
import NeonStream from './NeonStream';
import ShimmeringStars from './ShimmeringStars';
import { WebGLMetaballs } from './WebGLMetaballs';
import { CyberLines } from './CyberLines';
import { NoiseTopography } from './NoiseTopography';
import { VectorForms } from './VectorForms';
import { ResearchNetwork } from './ResearchNetwork';
import { GeoShapes } from './GeoShapes';
import { FloatingCubes } from './FloatingCubes';
import { Clouds3D } from './Clouds3D';
import CssWavesShowcase from './CssWavesShowcase';

interface BackgroundEffectsProps {
  effects?: BgEffect[];
  bgImage?: string;
  isMenuOpen?: boolean;
  forcePause?: boolean;
  scrollOffset?: number;
}

export const BackgroundEffects = React.memo<BackgroundEffectsProps>(({ effects, bgImage, isMenuOpen, forcePause, scrollOffset = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1920, 
    height: typeof window !== 'undefined' ? window.innerHeight : 1080 
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        setSize(prev => prev.width !== width || prev.height !== height ? { width, height } : prev);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!effects || effects.length === 0) return null;

  // Use a reference desktop aspect ratio to ensure scale consistency on mobile/preview
  // We implement "Cover" logic: the background always fills the container while maintaining a 16:9 aspect ratio base
  const refAR = 1920 / 1080;
  const currentAR = size.width / size.height;

  let refWidth, refHeight;
  if (currentAR > refAR) {
    // Screen is wider than 16:9
    refWidth = size.width;
    refHeight = size.width / refAR;
  } else {
    // Screen is taller than 16:9 (like mobile)
    refHeight = size.height;
    refWidth = size.height * refAR;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="shrink-0 relative"
          style={{ 
            width: `${refWidth}px`, 
            height: `${refHeight}px`,
          }}
        >
          {effects.map((effect) => {
            const type = normalizeEffectType(effect.type);
            return (
              <EffectItem 
                key={effect.id} 
                effect={effect} 
                bgImage={bgImage} 
                isMenuOpen={isMenuOpen} 
                forcePause={forcePause} 
                scrollOffset={type === 'clouds-3d' ? scrollOffset : 0} 
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  if (prevProps.bgImage !== nextProps.bgImage) return false;
  if (prevProps.forcePause !== nextProps.forcePause) return false;
  if (prevProps.isMenuOpen !== nextProps.isMenuOpen) return false;
  if (!prevProps.effects && !nextProps.effects) return true;
  if (!prevProps.effects || !nextProps.effects) return false;
  if (prevProps.effects.length !== nextProps.effects.length) return false;

  const hasClouds = nextProps.effects?.some(e => normalizeEffectType(e.type) === 'clouds-3d');
  
  // If only scrollOffset changed and we don't have clouds, we can skip re-render
  if (!hasClouds && prevProps.scrollOffset !== nextProps.scrollOffset) {
    // Continue to check other props
  } else if (hasClouds && prevProps.scrollOffset !== nextProps.scrollOffset) {
    return false; // Must re-render to update cloud camera
  }

  if (JSON.stringify(prevProps.effects) !== JSON.stringify(nextProps.effects)) {
    return false;
  }

  return true;
});

const EffectItem = React.memo<{ effect: BgEffect; bgImage?: string; isMenuOpen?: boolean; forcePause?: boolean; scrollOffset?: number }>(({ effect, bgImage, isMenuOpen, forcePause, scrollOffset = 0 }) => {
  const type = normalizeEffectType(effect.type);
  const { 
    id,
    color, 
    opacity, 
    speed, 
    position, 
    height, 
    seed, 
    blur = 0, 
    amplitude: customAmplitude,
    isSpectrum = false,
    spectrumColors = ['#ff0000', '#00ff00', '#0000ff'],
    isGlare = false,
    glareInterval = 3
  } = effect;

  if (type === 'css-waves') {
    return (
      <CssWavesShowcase
        settings={{
          speedMultiplier: effect.cssWavesSpeed !== undefined ? effect.cssWavesSpeed : 0.5,
          bgGradientStart: effect.cssWavesBgGradientStart || '#03000a',
          bgGradientEnd: effect.cssWavesBgGradientEnd || '#0b031e',
          topOpacity: effect.cssWavesTopOpacity !== undefined ? effect.cssWavesTopOpacity : 0.8,
          middleOpacity: effect.cssWavesMiddleOpacity !== undefined ? effect.cssWavesMiddleOpacity : 0.6,
          bottomOpacity: effect.cssWavesBottomOpacity !== undefined ? effect.cssWavesBottomOpacity : 0.4,
          topColor: effect.cssWavesTopColor || '#38bdf8',
          middleColor: effect.cssWavesMiddleColor || '#3b82f6',
          bottomColor: effect.cssWavesBottomColor || '#1d4ed8',
          topYOffset: effect.cssWavesTopYOffset !== undefined ? effect.cssWavesTopYOffset : 200,
          middleYOffset: effect.cssWavesMiddleYOffset !== undefined ? effect.cssWavesMiddleYOffset : 400,
          bottomYOffset: effect.cssWavesBottomYOffset !== undefined ? effect.cssWavesBottomYOffset : 600,
          cameraTilt: effect.cssWavesCameraTilt !== undefined ? effect.cssWavesCameraTilt : 0,
          cameraYaw: effect.cssWavesCameraYaw !== undefined ? effect.cssWavesCameraYaw : 0,
          topAmplitude: effect.cssWavesTopAmplitude !== undefined ? effect.cssWavesTopAmplitude : 30,
          topWavelength: effect.cssWavesTopWavelength !== undefined ? effect.cssWavesTopWavelength : 2,
          middleAmplitude: effect.cssWavesMiddleAmplitude !== undefined ? effect.cssWavesMiddleAmplitude : 40,
          middleWavelength: effect.cssWavesMiddleWavelength !== undefined ? effect.cssWavesMiddleWavelength : 3,
          bottomAmplitude: effect.cssWavesBottomAmplitude !== undefined ? effect.cssWavesBottomAmplitude : 50,
          bottomWavelength: effect.cssWavesBottomWavelength !== undefined ? effect.cssWavesBottomWavelength : 4,
          opacity: opacity,
        }}
      />
    );
  }

  if (type === 'flat-waves') {
    return (
      <FlatWaves
        settings={{
          speed: forcePause ? 0 : speed,
          amplitude: effect.amplitude !== undefined ? effect.amplitude : 0.6,
          wavelength: effect.wavelength !== undefined ? effect.wavelength : 0.2,
          jitter: effect.jitter !== undefined ? effect.jitter : 0,
          shininess: effect.shininess !== undefined ? effect.shininess : 148,
          zoom: effect.zoom !== undefined ? effect.zoom : 0.45,
          topDown: effect.topDown !== undefined ? effect.topDown : true,
          rotationX: effect.rotationX !== undefined ? effect.rotationX : 0,
          rotationY: effect.rotationY !== undefined ? effect.rotationY : -40,
          posY: effect.posY !== undefined ? effect.posY : 90,
          color: color,
          opacity: opacity,
          environmentReflection: !!effect.environmentReflection,
        }}
      />
    );
  }

  if (type === 'chroma-lab') {
    return <ChromaLab hue={effect.hue} opacity={opacity} />;
  }

  if (type === 'plasma') {
    return (
      <CosmicPlasmaNebula
        settings={{
          speed: forcePause ? 0 : speed,
          complexity: effect.complexity !== undefined ? effect.complexity : 3.0,
          intensity: effect.intensity !== undefined ? effect.intensity : 1.0,
          opacity: opacity,
          blur: blur,
          isPaused: !!effect.isPaused || !!forcePause,
          plasmaColors: effect.plasmaColors || ['#0ea5e9', '#d946ef', '#6366f1'],
          plasmaAlgorithm: effect.plasmaAlgorithm !== undefined ? effect.plasmaAlgorithm : 0,
          scale: effect.plasmaScale !== undefined ? effect.plasmaScale : 2.0,
          turbulence: effect.plasmaTurbulence !== undefined ? effect.plasmaTurbulence : 4.5,
        }}
      />
    );
  }

  if (type === 'bezier-waves') {
    return (
      <BezierWaves
        settings={{
          waves: effect.bezierWaves !== undefined ? effect.bezierWaves : 3,
          speed: forcePause ? 0 : (speed !== undefined ? speed : 1.0),
          width: effect.bezierWidth !== undefined ? effect.bezierWidth : 25,
          amplitude: effect.bezierAmplitude !== undefined ? effect.bezierAmplitude : 0.5,
          hueStart: effect.bezierHueStart !== undefined ? effect.bezierHueStart : 1.0,
          hueEnd: effect.bezierHueEnd !== undefined ? effect.bezierHueEnd : 10.0,
          rotation: effect.bezierRotation !== undefined ? effect.bezierRotation : 45,
          opacity: opacity,
        }}
      />
    );
  }

  if (type === 'liquid-ripples') {
    return (
      <LiquidRipples
        settings={{
          gridX: effect.liquidGridX !== undefined ? effect.liquidGridX : 250,
          gridY: effect.liquidGridY !== undefined ? effect.liquidGridY : 100,
          separation: effect.liquidSeparation !== undefined ? effect.liquidSeparation : 15,
          particleSize: effect.liquidParticleSize !== undefined ? effect.liquidParticleSize : 1.0,
          particleColor: effect.liquidParticleColor !== undefined ? effect.liquidParticleColor : (color || '#6366f1'),
          waveSpeed: forcePause ? 0 : (effect.liquidWaveSpeed !== undefined ? effect.liquidWaveSpeed : 0.85),
          waveFrequency: effect.liquidWaveFrequency !== undefined ? effect.liquidWaveFrequency : 0.07,
          waveAmplitude: effect.liquidWaveAmplitude !== undefined ? effect.liquidWaveAmplitude : 45,
          cameraHeight: effect.liquidCameraHeight !== undefined ? effect.liquidCameraHeight : 100,
          cameraDepth: effect.liquidCameraDepth !== undefined ? effect.liquidCameraDepth : 800,
          bgGradientStart: effect.liquidBgGradientStart !== undefined ? effect.liquidBgGradientStart : '#03000a',
          bgGradientEnd: effect.liquidBgGradientEnd !== undefined ? effect.liquidBgGradientEnd : '#0b031e',
          opacity: opacity,
        }}
      />
    );
  }

  if (type === 'origami-ribbon') {
    return (
      <OrigamiLine
        settings={{
          complexity: effect.origamiComplexity !== undefined ? effect.origamiComplexity : 3,
          size: effect.origamiSize !== undefined ? effect.origamiSize : 0.3,
          fillHue: effect.origamiFillHue !== undefined ? effect.origamiFillHue : 220,
          colorSpeed: forcePause ? 0 : (effect.origamiColorSpeed !== undefined ? effect.origamiColorSpeed : 1.0),
          animationSpeed: forcePause ? 0 : (effect.origamiAnimationSpeed !== undefined ? effect.origamiAnimationSpeed : 1.0),
          amplitude: effect.origamiAmplitude !== undefined ? effect.origamiAmplitude : 80,
          heightOffset: effect.origamiHeightOffset !== undefined ? effect.origamiHeightOffset : 0,
          scale: effect.origamiScale !== undefined ? effect.origamiScale : 1.0,
          rotation: effect.origamiRotation !== undefined ? effect.origamiRotation : 0,
          opacity: opacity,
          wireframe: effect.origamiWireframe !== undefined ? effect.origamiWireframe : false,
          shimmer: effect.origamiShimmer !== undefined ? effect.origamiShimmer : true,
          bgGradientStart: effect.origamiBgGradientStart !== undefined ? effect.origamiBgGradientStart : '#03000a',
          bgGradientEnd: effect.origamiBgGradientEnd !== undefined ? effect.origamiBgGradientEnd : '#0b031e',
        }}
      />
    );
  }

  if (type === 'webgl-polylines') {
    return (
      <WebGLPolylines
        settings={{
          nx: effect.polylineNx !== undefined ? effect.polylineNx : 18,
          ny: effect.polylineNy !== undefined ? effect.polylineNy : 120,
          angle: effect.polylineAngle !== undefined ? effect.polylineAngle : 32,
          colorScheme: effect.polylineColorScheme || 'default',
          darken: effect.polylineDarken !== undefined ? effect.polylineDarken : 0.4,
          thickness: effect.polylineThickness !== undefined ? effect.polylineThickness : 1.0,
          speed: forcePause ? 0 : (speed !== undefined ? speed : 0.25),
          opacity: opacity,
        }}
      />
    );
  }

  if (type === 'neon-stream') {
    return (
      <NeonStream
        settings={{
          density: effect.neonDensity !== undefined ? effect.neonDensity : 150,
          speed: forcePause ? 0 : (effect.neonSpeed !== undefined ? effect.neonSpeed : 5),
          lineWidth: effect.neonLineWidth !== undefined ? effect.neonLineWidth : 2,
          glowRadius: effect.neonGlowRadius !== undefined ? effect.neonGlowRadius : 15,
          flickerIntensity: effect.neonFlickerIntensity !== undefined ? effect.neonFlickerIntensity : 0.3,
          colorSpeed: forcePause ? 0 : (effect.neonColorSpeed !== undefined ? effect.neonColorSpeed : 1),
          opacity: opacity,
        }}
      />
    );
  }

  if (type === 'stars') {
    return (
      <ShimmeringStars
        settings={{
          starCount: effect.starCount !== undefined ? effect.starCount : 1000,
          starSize: effect.starSize !== undefined ? effect.starSize : 1.4,
          sizeRandomness: effect.starSizeRandomness !== undefined ? effect.starSizeRandomness : 100,
          baseColor: color || '#2b00ff',
          colorRandomness: effect.starColorRandomness !== undefined ? effect.starColorRandomness : 65,
          brightness: effect.starBrightness !== undefined ? effect.starBrightness : 1.0,
          brightnessRandomness: effect.starBrightnessRandomness !== undefined ? effect.starBrightnessRandomness : 100,
          glow: effect.starGlow !== undefined ? effect.starGlow : 15,
          glowRandomness: effect.starGlowRandomness !== undefined ? effect.starGlowRandomness : 100,
          speed: forcePause ? 0 : (speed !== undefined ? speed : 1.4),
          rotationSpeedX: effect.starRotationSpeedX !== undefined ? effect.starRotationSpeedX : 0.20,
          rotationSpeedY: effect.starRotationSpeedY !== undefined ? effect.starRotationSpeedY : 0.50,
          rotationSpeedZ: effect.starRotationSpeedZ !== undefined ? effect.starRotationSpeedZ : -0.40,
          fov: effect.starFov !== undefined ? effect.starFov : 590,
          mouseRotation: !!effect.starMouseRotation,
          opacity: opacity,
        }}
      />
    );
  }

  if (type === 'webgl-metaballs') {
    return (
      <WebGLMetaballs
        settings={{
          numMetaballs: effect.numMetaballs !== undefined ? effect.numMetaballs : 15,
          minRadius: effect.minRadius !== undefined ? effect.minRadius : 60,
          maxRadius: effect.maxRadius !== undefined ? effect.maxRadius : 160,
          speed: forcePause ? 0 : (effect.speed !== undefined ? effect.speed : 1.2),
          colorStart: effect.color || '#4f46e5',
          colorEnd: effect.plasmaColors && effect.plasmaColors[1] ? effect.plasmaColors[1] : '#ec4899',
          glowRadius: effect.glowRadius !== undefined ? effect.glowRadius : 2.2,
          blur: effect.blur !== undefined ? effect.blur : 0.12,
          outline: !!effect.outline,
          outlineWidth: effect.outlineWidth !== undefined ? effect.outlineWidth : 0.015,
          outlineColor: effect.outlineColor || '#ffffff',
          fill: effect.fill !== undefined ? effect.fill : true,
          mouseInteraction: effect.mouseInteraction !== undefined ? effect.mouseInteraction : true,
          shadow: effect.shadow !== undefined ? effect.shadow : true,
          shadowBlur: effect.shadowBlur !== undefined ? effect.shadowBlur : 15,
          shadowOpacity: effect.shadowOpacity !== undefined ? effect.shadowOpacity : 40,
          shadowAngle: effect.shadowAngle !== undefined ? effect.shadowAngle : 45,
          shadowDistance: effect.shadowDistance !== undefined ? effect.shadowDistance : 8,
          colorOpacity: opacity,
          image: effect.image,
          imageBlur: effect.imageBlur,
          metaballsBgColor: effect.metaballsBgColor || '#000000',
          metaballsUseBgImage: !!effect.metaballsUseBgImage,
          metaballsBgImage: effect.metaballsBgImage || '',
          opacity: opacity,
        }}
      />
    );
  }

  if (type === 'cyber-lines') {
    return (
      <div style={{ opacity: (opacity !== undefined ? opacity / 100 : 1) }} className="absolute inset-0 w-full h-full pointer-events-none">
        <CyberLines
          settings={{
            count: effect.count !== undefined ? effect.count : 45,
            minWidth: effect.minWidth !== undefined ? effect.minWidth : 1.5,
            maxWidth: effect.maxWidth !== undefined ? effect.maxWidth : 6,
            minSpeed: forcePause ? 0 : (effect.minSpeed !== undefined ? effect.minSpeed : 15),
            maxSpeed: forcePause ? 0 : (effect.maxSpeed !== undefined ? effect.maxSpeed : 60),
            hue: effect.hue !== undefined ? effect.hue : 195,
            hueDif: effect.hueDif !== undefined ? effect.hueDif : 35,
            glow: effect.glow !== undefined ? effect.glow : 12,
            clickToChangeColor: effect.clickToChangeColor !== undefined ? effect.clickToChangeColor : false,
          }}
        />
      </div>
    );
  }

  if (type === 'noise-topography') {
    return (
      <div style={{ opacity: (opacity !== undefined ? opacity / 100 : 1) }} className="absolute inset-0 w-full h-full">
        <NoiseTopography
          settings={{
            scale: effect.scale !== undefined ? effect.scale : 1.8,
            speed: forcePause ? 0 : (effect.speed !== undefined ? effect.speed : 0.4),
            colors: effect.topoColors || [
              { color: '#09090b', opacity: 100 },
              { color: '#18181b', opacity: 100, shadow: true, shadowBlur: 12, shadowOpacity: 50, shadowDistance: 6, shadowAngle: 60 },
              { color: '#27272a', opacity: 100, shadow: true, shadowBlur: 12, shadowOpacity: 50, shadowDistance: 6, shadowAngle: 60 },
              { color: '#3f3f46', opacity: 100, shadow: true, shadowBlur: 12, shadowOpacity: 50, shadowDistance: 6, shadowAngle: 60 },
              { color: '#52525b', opacity: 100, shadow: true, shadowBlur: 12, shadowOpacity: 50, shadowDistance: 6, shadowAngle: 60 }
            ]
          }}
        />
      </div>
    );
  }

  if (type === 'vector-forms') {
    return (
      <div style={{ opacity: (opacity !== undefined ? opacity / 100 : 1) }} className="absolute inset-0 w-full h-full">
        <VectorForms
          settings={{
            cols: effect.cols !== undefined ? effect.cols : 7,
            rows: effect.rows !== undefined ? effect.rows : 4,
            bgColor: effect.bgColor || '#0a0a0a',
            shapeWidth: effect.shapeWidth !== undefined ? effect.shapeWidth : 130,
            shapeHeight: effect.shapeHeight !== undefined ? effect.shapeHeight : 130,
            strokeWidth: effect.strokeWidth !== undefined ? effect.strokeWidth : 2,
            duration: effect.duration !== undefined ? effect.duration : 4.5,
            maskType: effect.maskType || 'hexagon',
            patternType: effect.patternType || 'circles',
            colorHueStart: effect.colorHueStart !== undefined ? effect.colorHueStart : 210,
            colorHueStep: effect.colorHueStep !== undefined ? effect.colorHueStep : 30,
            colorSaturation: effect.colorSaturation !== undefined ? effect.colorSaturation : 90,
            colorLightness: effect.colorLightness !== undefined ? effect.colorLightness : 55,
            overlapMode: effect.overlapMode !== undefined ? effect.overlapMode : true,
            isPaused: !!forcePause,
          }}
        />
      </div>
    );
  }

  if (type === 'research-network') {
    return (
      <div style={{ opacity: (opacity !== undefined ? opacity / 100 : 1) }} className="absolute inset-0 w-full h-full">
        <ResearchNetwork
          settings={{
            bgColor: effect.bgColor || '#020205',
            maxCircles: effect.maxCircles !== undefined ? effect.maxCircles : 45,
            maxCirclesBg: effect.maxCirclesBg !== undefined ? effect.maxCirclesBg : 35,
            colors: effect.colors || ['#38bdf8', '#818cf8', '#ffffff'],
            bgColors: effect.bgColors || ['#1e1b4b', '#311042'],
            radMin: effect.radMin !== undefined ? effect.radMin : 4,
            radMax: effect.radMax !== undefined ? effect.radMax : 18,
            radThreshold: effect.radThreshold !== undefined ? effect.radThreshold : 10,
            filledCircle: effect.filledCircle !== undefined ? effect.filledCircle : 50,
            concentricCircle: effect.concentricCircle !== undefined ? effect.concentricCircle : 35,
            speedMin: forcePause ? 0 : (effect.speedMin !== undefined ? effect.speedMin : 0.2),
            speedMax: forcePause ? 0 : (effect.speedMax !== undefined ? effect.speedMax : 0.8),
            linkDist: effect.linkDist !== undefined ? effect.linkDist : 140,
            lineBorder: effect.lineBorder !== undefined ? effect.lineBorder : 1.0,
            circleBorder: effect.circleBorder !== undefined ? effect.circleBorder : 1.5,
            maxOpacity: effect.maxOpacity !== undefined ? effect.maxOpacity : 0.5,
          }}
        />
      </div>
    );
  }

  if (type === 'geo-shapes') {
    return (
      <div className="absolute inset-0 w-full h-full">
        <GeoShapes
          settings={{
            bgColor: effect.bgColor || '#0f0f11',
            gridSize: effect.gridSize !== undefined ? effect.gridSize : 120,
            size: effect.size !== undefined ? effect.size : 18,
            fallSpeed: forcePause ? 0 : (effect.fallSpeed !== undefined ? effect.fallSpeed : 0.4),
            fallDirection: effect.fallDirection !== undefined ? effect.fallDirection : 135,
            rotationSpeed: forcePause ? 0 : (effect.rotationSpeed !== undefined ? effect.rotationSpeed : 1.0),
            randomness: effect.randomness !== undefined ? effect.randomness : 0.5,
            colors: effect.colors || ['#a855f7', '#6366f1', '#3b82f6', '#f43f5e'],
            opacity: opacity,
          }}
        />
      </div>
    );
  }

  if (type === 'floating-cubes') {
    return (
      <div style={{ opacity: (opacity !== undefined ? opacity / 100 : 1) }} className="absolute inset-0 w-full h-full">
        <FloatingCubes
          settings={{
            bgColor: effect.bgColor || '#0a0a0c',
            count: effect.cubesCount !== undefined ? effect.cubesCount : 15,
            minSize: effect.minSize !== undefined ? effect.minSize : 40,
            maxSize: effect.maxSize !== undefined ? effect.maxSize : 100,
            speed: forcePause ? 0 : (effect.speed !== undefined ? effect.speed : 0.8),
            shapes: effect.shapes || ['cube', 'pyramid'],
            tints: effect.tints || [
              { color: '#ffffff', shading: '#a1a1aa' },
              { color: '#6366f1', shading: '#311042' },
              { color: '#38bdf8', shading: '#1e3a8a' },
            ],
          }}
        />
      </div>
    );
  }

  if (type === 'clouds-3d') {
    return (
      <div className="absolute inset-0 w-full h-full">
        <Clouds3D
          scrollOffset={scrollOffset}
          settings={{
            speed: forcePause ? 0 : (effect.speed !== undefined ? effect.speed : 0.03),
            cloudCount: effect.cloudCount !== undefined ? effect.cloudCount : 8000,
            fogColor: effect.fogColor || '#4584b4',
            fogNear: effect.fogNear !== undefined ? effect.fogNear : -100,
            fogFar: effect.fogFar !== undefined ? effect.fogFar : 3000,
            cloudImage: effect.cloudImage || 'https://mrdoob.com/lab/javascript/webgl/clouds/cloud10.png',
            bgGradientColor1: effect.bgGradientColor1 || '#326696',
            bgGradientColor2: effect.bgGradientColor2 || '#4584b4',
            cameraHeight: effect.cameraHeight !== undefined ? effect.cameraHeight : 0,
            scrollCameraStart: effect.scrollCameraStart !== undefined ? effect.scrollCameraStart : 0,
            scrollCameraEnd: effect.scrollCameraEnd !== undefined ? effect.scrollCameraEnd : -200,
            scrollLimit: effect.scrollLimit !== undefined ? effect.scrollLimit : 1000,
            opacity: opacity,
          }}
        />
      </div>
    );
  }


  // Smooth wavy path or organic blob generation
  const generatePath = () => {
    if (type === 'blob') {
      // Create a centered organic blob with Cubic Béziers
      const cx = 50;
      const cy = position === 'top' ? 20 : 80;
      const r = height;
      const points = 6;
      let path = "";
      
      const getPoint = (i: number) => {
        const angle = (i / points) * Math.PI * 2;
        const noiseAmplitude = r * 0.4;
        const noise = Math.sin(angle * 2 + seed) * noiseAmplitude;
        const currR = r + noise;
        return {
          x: cx + Math.cos(angle) * currR,
          y: cy + Math.sin(angle) * currR,
          angle
        };
      };

      for (let i = 0; i <= points; i++) {
        const p = getPoint(i);
        if (i === 0) {
          path += `M ${p.x} ${p.y}`;
        } else {
          const prev = getPoint(i - 1);
          const midAngle = (prev.angle + p.angle) / 2;
          const cpDist = (p.x - prev.x) ** 2 + (p.y - prev.y) ** 2;
          const cpR = Math.sqrt(cpDist) * 0.5;
          
          const cp1x = prev.x + Math.cos(prev.angle + Math.PI/2) * cpR * 0.5;
          const cp1y = prev.y + Math.sin(prev.angle + Math.PI/2) * cpR * 0.5;
          const cp2x = p.x + Math.cos(p.angle - Math.PI/2) * cpR * 0.5;
          const cp2y = p.y + Math.sin(p.angle - Math.PI/2) * cpR * 0.5;
          
          path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p.x} ${p.y}`;
        }
      }
      return path + " Z";
    }

    // Default: Wavy edges with extreme smoothing (Cubic Bézier)
    const points = 6;
    const baseAmplitude = 8;
    const amplitude = customAmplitude !== undefined ? customAmplitude : baseAmplitude;
    const frequency = 0.15;
    
    let path = `M -20 ${position === 'top' ? 0 : 100}`;
    
    const getWaveY = (i: number) => {
      const yOffset = Math.sin((i * frequency) + seed) * amplitude;
      return (position === 'top' ? height + yOffset : 100 - height - yOffset);
    };

    const xStep = 140 / points;

    for (let i = 0; i <= points; i++) {
      const x = -20 + (i * xStep);
      const y = getWaveY(i);
      
      if (i === 0) {
        path += ` L ${x} ${y}`;
      } else {
        const prevX = x - xStep;
        const prevY = getWaveY(i - 1);
        
        // Control points for cubic bezier to make it very smooth
        const cp1x = prevX + xStep / 3;
        const cp1y = prevY;
        const cp2x = x - xStep / 3;
        const cp2y = y;
        
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
      }
    }
    
    path += ` L 120 ${position === 'top' ? 0 : 100} Z`;
    return path;
  };

  const path = generatePath();

  return (
    <motion.div
      className="absolute w-[200%] h-full -left-[50%]"
      style={{
        [position]: 0,
        height: '100%',
        zIndex: 1,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
      }}
      initial={{ x: "-5%" }}
      animate={forcePause ? false : { 
        x: ["-5%", "5%", "-5%"],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 20 / (speed || 1),
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={`glare-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.6" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.path
          d={path}
          fill={isSpectrum ? spectrumColors[0] : color}
          initial={{ fillOpacity: opacity / 100 }}
          animate={{ 
            fillOpacity: opacity / 100,
            fill: (forcePause || !isSpectrum) ? (isSpectrum ? spectrumColors[0] : color) : [...spectrumColors, spectrumColors[0]]
          }}
          transition={{ 
            fillOpacity: { duration: 0 },
            fill: !forcePause && isSpectrum ? {
              duration: 8 / (speed || 1),
              repeat: Infinity,
              ease: "linear"
            } : { duration: 0.3 }
          }}
        />

        {isGlare && (
          <motion.path
            d={path}
            fill={`url(#glare-grad-${id})`}
            initial={{ x: "-150%", opacity: 0 }}
            animate={forcePause ? false : { 
              x: ["-150%", "150%"],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: glareInterval,
              ease: "easeInOut"
            }}
          />
        )}
      </svg>
    </motion.div>
  );
}, (prev, next) => {
  // Strict comparison to prevent unneeded re-renders
  if (prev.forcePause !== next.forcePause) return false;
  if (prev.isMenuOpen !== next.isMenuOpen) return false;
  if (prev.bgImage !== next.bgImage) return false;
  
  const type = normalizeEffectType(next.effect.type);
  
  // If it's Clouds3D, we care about scrollOffset
  if (type === 'clouds-3d') {
    if (prev.scrollOffset !== next.scrollOffset) return false;
  }
  
  // Compare effect properties
  const a = prev.effect;
  const b = next.effect;
  
  if (a.id !== b.id || a.type !== b.type) return false;
  
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    return false;
  }

  return true;
});
