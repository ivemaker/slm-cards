import React from 'react';
import { Block, BgEffect } from '../../types';
import { compressImage, normalizeEffectType } from '../../utils';
import { CosmicPlasmaNebula } from '../CosmicPlasmaNebula';
import { useDev } from '../../context/DevContext';
import { useToast } from '../../context/ToastContext';
import { BezierWaves } from '../BezierWaves';
import { LiquidRipples } from '../LiquidRipples';
import { OrigamiLine } from '../OrigamiLine';
import WebGLPolylines from '../WebGLPolylines';
import NeonStream from '../NeonStream';
import ShimmeringStars from '../ShimmeringStars';
import { WebGLMetaballs } from '../WebGLMetaballs';
import { CyberLines } from '../CyberLines';
import { NoiseTopography } from '../NoiseTopography';
import { VectorForms } from '../VectorForms';
import { ResearchNetwork } from '../ResearchNetwork';
import { GeoShapes } from '../GeoShapes';
import { FloatingCubes } from '../FloatingCubes';
import { Clouds3D } from '../Clouds3D';
import CssWavesShowcase from '../CssWavesShowcase';
import FlatWaves from '../FlatWaves';
import { BackgroundEffects } from '../BackgroundEffects';

interface MainBgInspectorProps {
  focusedBlock: Block;
  lang: 'en' | 'ru';
  syncThemes: boolean;
  theme: 'light' | 'dark';
  activeSettings: any;
  updateFocusedBlock: (updateFn: (b: Block) => Partial<Block>) => void;
  updateActiveSettings: (newSettings: any) => void;
  setLocalStorageUploading: (loading: boolean) => void;
  localStorageUploading: boolean;
}

export const MainBgInspector: React.FC<MainBgInspectorProps> = ({
  focusedBlock,
  lang,
  syncThemes,
  theme,
  activeSettings,
  updateFocusedBlock,
  updateActiveSettings,
  setLocalStorageUploading,
  localStorageUploading,
}) => {
  const { planType } = useDev();
  const { error: toastError } = useToast();
  const mainBg = focusedBlock as any;

  const handleEffectTypeChange = (idx: number, effect: BgEffect, typeVal: string) => {
    const updated = [...(activeSettings.effects || [])];
    updated[idx] = { 
      ...effect, 
      type: typeVal,
      complexity: 3.0,
      intensity: 1.0,
      isPaused: false,
      ...(typeVal === 'css-waves' ? {
        cssWavesSpeed: 0.5,
        cssWavesBgGradientStart: '#03000a',
        cssWavesBgGradientEnd: '#0b031e',
        cssWavesTopOpacity: 0.8,
        cssWavesMiddleOpacity: 0.6,
        cssWavesBottomOpacity: 0.4,
        cssWavesTopColor: '#38bdf8',
        cssWavesMiddleColor: '#3b82f6',
        cssWavesBottomColor: '#1d4ed8',
        cssWavesTopYOffset: 200,
        cssWavesMiddleYOffset: 400,
        cssWavesBottomYOffset: 600,
        cssWavesCameraTilt: 0,
        cssWavesCameraYaw: 0,
        cssWavesTopAmplitude: 30,
        cssWavesTopWavelength: 2,
        cssWavesMiddleAmplitude: 40,
        cssWavesMiddleWavelength: 3,
        cssWavesBottomAmplitude: 50,
        cssWavesBottomWavelength: 4,
        opacity: 50,
      } : {}),
      ...(typeVal === 'flat-waves' ? {
        amplitude: 0.6,
        wavelength: 0.2,
        jitter: 0,
        shininess: 148,
        zoom: 0.45,
        topDown: true,
        rotationX: 0,
        rotationY: -40,
        posY: 90,
        speed: 0.25,
        color: '#0561c9',
      } : {}),
      ...(typeVal === 'bezier-waves' ? {
        bezierWaves: 3,
        speed: 1.0,
        bezierWidth: 25,
        bezierAmplitude: 0.5,
        bezierHueStart: 1.0,
        bezierHueEnd: 10.0,
        bezierRotation: 45,
        opacity: 100,
      } : {}),
      ...(typeVal === 'liquid-ripples' ? {
        liquidGridX: 250,
        liquidGridY: 100,
        liquidSeparation: 15,
        liquidParticleSize: 1.0,
        liquidParticleColor: '#6366f1',
        liquidWaveSpeed: 0.85,
        liquidWaveFrequency: 0.07,
        liquidWaveAmplitude: 45,
        liquidCameraHeight: 100,
        liquidCameraDepth: 800,
        liquidBgGradientStart: '#03000a',
        liquidBgGradientEnd: '#0b031e',
        opacity: 100,
      } : {}),
      ...(typeVal === 'origami-ribbon' ? {
        origamiComplexity: 3,
        origamiSize: 0.3,
        origamiFillHue: 220,
        origamiColorSpeed: 1.0,
        origamiAnimationSpeed: 1.0,
        origamiAmplitude: 80,
        origamiHeightOffset: 0,
        origamiScale: 1.0,
        origamiRotation: 0,
        origamiWireframe: false,
        origamiShimmer: true,
        origamiBgGradientStart: '#03000a',
        origamiBgGradientEnd: '#0b031e',
        opacity: 100,
      } : {}),
      ...(typeVal === 'webgl-polylines' ? {
        polylineNx: 18,
        polylineNy: 120,
        polylineAngle: 32,
        polylineColorScheme: 'default',
        polylineDarken: 0.4,
        polylineThickness: 1.0,
        speed: 0.25,
        opacity: 100,
      } : {}),
      ...(typeVal === 'neon-stream' ? {
        neonDensity: 150,
        neonSpeed: 5,
        neonLineWidth: 2,
        neonGlowRadius: 15,
        neonFlickerIntensity: 0.3,
        neonColorSpeed: 1,
        opacity: 100,
      } : {}),
      ...(typeVal === 'stars' ? {
        starCount: 1000,
        starSize: 1.4,
        starSizeRandomness: 100,
        color: '#2b00ff',
        starColorRandomness: 65,
        starBrightness: 1.0,
        starBrightnessRandomness: 100,
        starGlow: 15,
        starGlowRandomness: 100,
        speed: 1.4,
        starRotationSpeedX: 0.20,
        starRotationSpeedY: 0.50,
        starRotationSpeedZ: -0.40,
        starFov: 590,
        starMouseRotation: false,
        opacity: 100,
      } : {}),
      ...(typeVal === 'chroma-lab' ? {
        speed: 0.2,
        intensity: 1.0,
        color: '#ff0055',
        opacity: 100,
      } : {}),
      ...(typeVal === 'plasma' ? {
        speed: 0.5,
        complexity: 3.0,
        intensity: 1.0,
        opacity: 100,
      } : {}),
      ...(typeVal === 'webgl-metaballs' ? {
        numMetaballs: 15,
        minRadius: 60,
        maxRadius: 160,
        speed: 1.2,
        color: '#4f46e5',
        plasmaColors: ['#4f46e5', '#ec4899'],
        glowRadius: 2.2,
        blur: 0.12,
        outline: false,
        outlineWidth: 0.015,
        outlineColor: '#ffffff',
        fill: true,
        mouseInteraction: true,
        shadow: true,
        shadowBlur: 15,
        shadowOpacity: 40,
        shadowAngle: 45,
        shadowDistance: 8,
        colorOpacity: 100,
        opacity: 100,
        metaballsBgColor: '#000000',
        metaballsUseBgImage: false,
        metaballsBgImage: '',
      } : {}),
      ...(typeVal === 'cyber-lines' ? {
        count: 45,
        minWidth: 1.5,
        maxWidth: 6,
        minSpeed: 15,
        maxSpeed: 60,
        hue: 195,
        hueDif: 35,
        glow: 12,
        clickToChangeColor: true,
        opacity: 100,
      } : {}),
      ...(typeVal === 'noise-topography' ? {
        scale: 1.5,
        speed: 0.5,
        topoColors: [
          { color: '#030712', opacity: 100 },
          { color: '#111827', opacity: 100, shadow: true, shadowBlur: 10, shadowOpacity: 40, shadowDistance: 5, shadowAngle: 45 },
          { color: '#1f2937', opacity: 100, shadow: true, shadowBlur: 10, shadowOpacity: 40, shadowDistance: 5, shadowAngle: 45 },
          { color: '#374151', opacity: 100, shadow: true, shadowBlur: 10, shadowOpacity: 40, shadowDistance: 5, shadowAngle: 45 },
          { color: '#4b5563', opacity: 100, shadow: true, shadowBlur: 10, shadowOpacity: 40, shadowDistance: 5, shadowAngle: 45 },
          { color: '#6b7280', opacity: 100, shadow: true, shadowBlur: 10, shadowOpacity: 40, shadowDistance: 5, shadowAngle: 45 }
        ],
        opacity: 100,
      } : {}),
      ...(typeVal === 'vector-forms' ? {
        cols: 7,
        rows: 4,
        bgColor: '#0a0a0a',
        shapeWidth: 130,
        shapeHeight: 130,
        strokeWidth: 2,
        duration: 4.5,
        maskType: 'hexagon',
        patternType: 'circles',
        colorHueStart: 210,
        colorHueStep: 30,
        colorSaturation: 90,
        colorLightness: 55,
        overlapMode: true,
        opacity: 100,
      } : {}),
      ...(typeVal === 'research-network' ? {
        bgColor: '#020205',
        maxCircles: 45,
        maxCirclesBg: 35,
        colors: ['#38bdf8', '#818cf8', '#ffffff'],
        bgColors: ['#1e1b4b', '#311042'],
        radMin: 4,
        radMax: 18,
        radThreshold: 10,
        filledCircle: 50,
        concentricCircle: 35,
        speedMin: 0.2,
        speedMax: 0.8,
        linkDist: 140,
        lineBorder: 1.0,
        circleBorder: 1.5,
        maxOpacity: 0.5,
        opacity: 100,
      } : {}),
      ...(typeVal === 'geo-shapes' ? {
        bgColor: '#0f0f11',
        gridSize: 120,
        size: 18,
        fallSpeed: 0.4,
        fallDirection: 135,
        rotationSpeed: 1.0,
        randomness: 0.5,
        colors: ['#a855f7', '#6366f1', '#3b82f6', '#f43f5e'],
        opacity: 100,
      } : {}),
      ...(typeVal === 'floating-cubes' ? {
        bgColor: '#0a0a0c',
        cubesCount: 15,
        minSize: 40,
        maxSize: 100,
        speed: 0.8,
        shapes: ['cube', 'pyramid'],
        tints: [
          { color: '#ffffff', shading: '#a1a1aa' },
          { color: '#6366f1', shading: '#311042' },
          { color: '#38bdf8', shading: '#1e3a8a' },
        ],
        opacity: 100,
      } : {}),
      ...(typeVal === 'clouds-3d' ? {
        speed: 0.03,
        cloudCount: 8000,
        fogColor: '#4584b4',
        fogNear: -100,
        fogFar: 3000,
        cloudImage: 'https://mrdoob.com/lab/javascript/webgl/clouds/cloud10.png',
        bgGradientColor1: '#326696',
        bgGradientColor2: '#4584b4',
        cameraHeight: 0,
        scrollCameraStart: 0,
        scrollCameraEnd: -200,
        scrollLimit: 1000,
        opacity: 100,
      } : {}),
      ...(typeVal === 'blob' ? {
        speed: 0.4,
        color: theme === 'dark' ? '#0ea5e9' : '#38bdf8',
        opacity: 100,
      } : {}),
    };
    updateActiveSettings({ ...activeSettings, effects: updated });
  };

  const renderEffectTypeSelect = (effect: BgEffect, idx: number) => {
    return (
      <div className="space-y-1">
        <span className="text-[8px] uppercase font-bold text-zinc-500">
          {lang === 'en' ? 'Effect Type' : 'Тип эффекта'}
        </span>
        <select
          value={effect.type}
          onChange={(e) => {
            const val = e.target.value;
            const isPremium = [
              'css-waves', 'bezier-waves', 'webgl-metaballs', 'noise-topography',
              'liquid-ripples', 'origami-ribbon', 'webgl-polylines', 'neon-stream',
              'cyber-lines', 'vector-forms', 'research-network', 'geo-shapes',
              'floating-cubes', 'clouds-3d'
            ].includes(val);
            if (isPremium && planType === 'basic') {
              toastError(lang === 'en' 
                ? "👑 This effect is only available for Premium plans. Upgrade the plan in Dev Tools to enable!"
                : "👑 Этот эффект доступен только для Premium проектов. Переключите тариф проекта на Premium в панели разработчика для тестирования!"
              );
              return;
            }
            handleEffectTypeChange(idx, effect, val as any);
          }}
          className="w-full bg-zinc-900 border border-zinc-800 text-[10px] rounded p-1 text-white focus:outline-none cursor-pointer"
        >
          <option value="css-waves">👑 🌊 {lang === 'en' ? 'Procedural 3D Waves' : 'Процедурные 3D-волны'}</option>
          <option value="blob">🫧 {lang === 'en' ? 'Organic Blobs' : 'Органические капли'}</option>
          <option value="plasma">🌌 {lang === 'en' ? 'Cosmic Plasma' : 'Космическая плазма'}</option>
          <option value="chroma-lab">🧪 {lang === 'en' ? 'Chroma Lab' : 'Хрома Лаб'}</option>
          <option value="flat-waves">🔮 {lang === 'en' ? '3D Low-Poly Waves' : '3D Волны'}</option>
          <option value="bezier-waves">👑 ➰ {lang === 'en' ? 'Bezier Waves' : 'Кривые Безье'}</option>
          <option value="liquid-ripples">👑 🌊 {lang === 'en' ? 'Interactive Waves' : 'Интерактивные волны'}</option>
          <option value="origami-ribbon">👑 🎗️ {lang === 'en' ? 'Origami Ribbon' : 'Бумажная лента'}</option>
          <option value="webgl-polylines">👑 ⚡ {lang === 'en' ? 'WebGL Lines' : 'WebGL Линии'}</option>
          <option value="neon-stream">👑 🌌 {lang === 'en' ? 'Neon Stream' : 'Неоновый поток'}</option>
          <option value="stars">✨ {lang === 'en' ? 'Stars' : 'Звезды'}</option>
          <option value="webgl-metaballs">👑 🟢 {lang === 'en' ? 'WebGL Metaballs' : 'Органические метасферы'}</option>
          <option value="cyber-lines">👑 🚥 {lang === 'en' ? 'Cyber Lines' : 'Киберлинии'}</option>
          <option value="noise-topography">👑 ⛰️ {lang === 'en' ? 'Noise Topography' : 'Рельефная топография'}</option>
          <option value="vector-forms">👑 📐 {lang === 'en' ? 'Vector Forms' : 'Векторные формы'}</option>
          <option value="research-network">👑 🕸️ {lang === 'en' ? 'Research Network' : 'Информационная сеть'}</option>
          <option value="geo-shapes">👑 📐 {lang === 'en' ? 'Geo Shapes' : 'Геометрические примитивы'}</option>
          <option value="floating-cubes">👑 📦 {lang === 'en' ? 'Floating Cubes' : 'Парящие CSS 3D кубы'}</option>
          <option value="clouds-3d">👑 ☁️ {lang === 'en' ? 'Clouds 3D' : 'Облака 3D'}</option>
        </select>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Sync themes toggle */}
      <div className="flex items-center justify-between p-2.5 bg-zinc-900/40 rounded-lg border border-zinc-800/80">
        <span className="text-xs text-zinc-300 font-medium">{lang === 'en' ? 'Sync Light/Dark' : 'Синхронизировать темы'}</span>
        <input
          type="checkbox"
          checked={syncThemes}
          onChange={(e) => {
            updateFocusedBlock(() => ({
              mainBg: { ...mainBg, syncThemes: e.target.checked }
            }));
          }}
          className="w-4 h-4 text-emerald-600 bg-zinc-950 rounded border-zinc-800 focus:ring-emerald-500 cursor-pointer"
        />
      </div>

      {!syncThemes && (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => updateFocusedBlock(() => ({ mainBg: { ...mainBg, theme: 'light' } }))}
            className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-white text-zinc-950 border-white shadow-sm font-bold'
                : 'bg-zinc-900 text-zinc-400 border-zinc-850 hover:text-white'
            }`}
          >
            ☀️ {lang === 'en' ? 'Edit Light' : 'Настроить светлую'}
          </button>
          <button
            type="button"
            onClick={() => updateFocusedBlock(() => ({ mainBg: { ...mainBg, theme: 'dark' } }))}
            className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-white text-zinc-950 border-white shadow-sm font-bold'
                : 'bg-zinc-900 text-zinc-400 border-zinc-850 hover:text-white'
            }`}
          >
            🌙 {lang === 'en' ? 'Edit Dark' : 'Настроить темную'}
          </button>
        </div>
      )}

      {/* Block Spacing / Отступы между блоками */}
      <div className="p-3.5 bg-zinc-900/40 rounded-xl border border-zinc-850/60 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1.5">
            📏 {lang === 'en' ? 'Block Spacing' : 'Отступы между блоками'}
          </label>
          <span className="text-xs text-zinc-300 font-mono font-medium">
            {Math.round((mainBg.blockSpacing !== undefined ? mainBg.blockSpacing : 32) * 0.5)} px
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="100"
            value={mainBg.blockSpacing !== undefined ? mainBg.blockSpacing : 32}
            onChange={(e) => {
              updateFocusedBlock(() => ({
                mainBg: { ...mainBg, blockSpacing: parseInt(e.target.value) }
              }));
            }}
            className="flex-1 accent-emerald-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-[10px] text-zinc-500 font-mono w-6 text-right">
            {mainBg.blockSpacing !== undefined ? mainBg.blockSpacing : 32}%
          </span>
        </div>
        <div className="text-[10px] text-zinc-500">
          {lang === 'en' 
            ? 'Adjust the vertical gaps between content blocks.' 
            : 'Настройте вертикальные отступы между блоками контента.'}
        </div>
      </div>

      <div className="p-3.5 bg-zinc-900/40 rounded-xl border border-zinc-850/60 space-y-3.5">
        <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider">
          🎨 {lang === 'en' ? 'Background Fill Style' : 'Заливка фона'} ({theme})
        </label>
        
        <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-850">
          {['color', 'image', 'gradient'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => updateActiveSettings({ ...activeSettings, fillType: type })}
              className={`flex-1 py-1 text-center text-[10px] font-bold rounded transition-all cursor-pointer ${
                (activeSettings.fillType || 'color') === type
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              {type === 'color' ? (lang === 'en' ? 'Color' : 'Цвет') : type === 'image' ? (lang === 'en' ? 'Image' : 'Картинка') : (lang === 'en' ? 'Gradient' : 'Градиент')}
            </button>
          ))}
        </div>
        
        {(activeSettings.fillType || 'color') === 'color' && (
          <div className="space-y-2.5">
            <div className="flex items-center flex-wrap gap-1.5">
              {[
                '#ffffff', '#f4f4f5', '#faf8f5', '#fef2f2', '#f0fdf4',
                '#09090b', '#0f172a', '#111827', '#18181b', '#052e16',
              ].map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => updateActiveSettings({ ...activeSettings, fillColor: col })}
                  style={{ backgroundColor: col }}
                  className={`w-6 h-6 rounded-full border border-zinc-800 hover:scale-110 transition-transform cursor-pointer ${
                    activeSettings.fillColor === col ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-950' : ''
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={activeSettings.fillColor || ''}
                placeholder="#ffffff"
                onChange={(e) => updateActiveSettings({ ...activeSettings, fillColor: e.target.value })}
                className="bg-zinc-950 border border-zinc-850 rounded text-[11px] p-2 text-white flex-1 focus:outline-none font-mono"
              />
              <input
                type="color"
                value={activeSettings.fillColor?.startsWith('#') && activeSettings.fillColor.length === 7 ? activeSettings.fillColor : '#ffffff'}
                onChange={(e) => updateActiveSettings({ ...activeSettings, fillColor: e.target.value })}
                className="w-8 h-8 rounded border border-zinc-850 bg-transparent p-0 cursor-pointer overflow-hidden"
              />
            </div>
          </div>
        )}

         {activeSettings.fillType === 'image' && (
          <div className="space-y-2.5">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setLocalStorageUploading(true);
                  try {
                    const b64 = await compressImage(file, 1000, 1000);
                    updateActiveSettings({ ...activeSettings, fillImage: b64 });
                  } finally {
                    setLocalStorageUploading(false);
                  }
                }
              }}
              className="w-full text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:bg-zinc-800 file:text-white cursor-pointer"
            />
            {activeSettings.fillImage && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-2 bg-zinc-950/40 rounded-lg border border-zinc-850">
                  <div className="w-8 h-8 rounded border border-zinc-850 bg-cover bg-center" style={{ backgroundImage: `url("${activeSettings.fillImage}")` }} />
                  <button onClick={() => updateActiveSettings({ ...activeSettings, fillImage: undefined })} className="text-[10px] text-rose-400 hover:text-rose-300 font-medium hover:underline cursor-pointer">
                    {lang === 'en' ? 'Remove' : 'Удалить'}
                  </button>
                </div>
                
                {/* Blur adjustment slider */}
                <div className="p-2.5 bg-zinc-950/40 rounded-lg border border-zinc-850/80 space-y-1.5 shadow-sm">
                  <div className="flex justify-between items-center text-[10.5px]">
                    <span className="text-zinc-400 font-medium">{lang === 'en' ? 'Image Blur' : 'Размытие изображения'}</span>
                    <span className="text-sky-450 font-mono font-bold">{(activeSettings as any).fillImageBlur || 0}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="1"
                    value={(activeSettings as any).fillImageBlur || 0}
                    onChange={(e) => updateActiveSettings({ ...activeSettings, fillImageBlur: parseInt(e.target.value) })}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeSettings.fillType === 'gradient' && (
          <div className="space-y-3">
            <select
              value={activeSettings.fillGradientPreset || 'cosmic'}
              onChange={(e) => updateActiveSettings({ ...activeSettings, fillGradientPreset: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-850 rounded text-[11px] p-2 focus:outline-none text-white cursor-pointer"
            >
              <option value="cosmic">🌌 Cosmic Night</option>
              <option value="sunset">🌅 Golden Sunset</option>
              <option value="ocean">🌊 Deep Ocean</option>
              <option value="emerald">🌿 Emerald Mint</option>
              <option value="bubblegum">🍬 Pink Bubblegum</option>
              <option value="fire">🔥 Solar Flare</option>
            </select>
            <div className="flex items-center justify-between p-2 bg-zinc-950/40 rounded-lg border border-zinc-850">
              <span className="text-[10.5px] text-zinc-300 font-medium">✨ Animated Fluid</span>
              <input
                type="checkbox"
                checked={activeSettings.fillGradientAnimated === true}
                onChange={(e) => updateActiveSettings({ ...activeSettings, fillGradientAnimated: e.target.checked })}
                className="w-4 h-4 text-emerald-600 bg-zinc-950 rounded cursor-pointer"
              />
            </div>
          </div>
        )}


      </div>

      <div className="p-3.5 bg-zinc-900/40 rounded-xl border border-zinc-850/60 space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider">
            ✨ {lang === 'en' ? 'Background Effects' : 'Эффекты фона'}
          </label>
          <button
            onClick={() => {
              const defaultType = planType === 'basic' ? 'blob' : 'css-waves';
              const newEffect: BgEffect = {
                id: Math.random().toString(36).substr(2, 9),
                type: defaultType,
                cssWavesSpeed: 0.5,
                cssWavesBgGradientStart: '#03000a',
                cssWavesBgGradientEnd: '#0b031e',
                cssWavesTopOpacity: 0.8,
                cssWavesMiddleOpacity: 0.6,
                cssWavesBottomOpacity: 0.4,
                cssWavesTopColor: '#38bdf8',
                cssWavesMiddleColor: '#3b82f6',
                cssWavesBottomColor: '#1d4ed8',
                cssWavesTopYOffset: 200,
                cssWavesMiddleYOffset: 400,
                cssWavesBottomYOffset: 600,
                cssWavesCameraTilt: 0,
                cssWavesCameraYaw: 0,
                cssWavesTopAmplitude: 30,
                cssWavesTopWavelength: 2,
                cssWavesMiddleAmplitude: 40,
                cssWavesMiddleWavelength: 3,
                cssWavesBottomAmplitude: 50,
                cssWavesBottomWavelength: 4,
                opacity: 50,
                color: theme === 'dark' ? '#0ea5e9' : '#38bdf8',
                speed: 0.4,
                position: 'bottom',
                height: 40,
                amplitude: 15,
                seed: Math.random() * 1000,
                isSpectrum: false,
                spectrumColors: theme === 'dark' ? ['#0ea5e9', '#d946ef', '#6366f1'] : ['#38bdf8', '#f472b6', '#818cf8'],
                isGlare: false,
                glareInterval: 3,
              };
              updateActiveSettings({
                ...activeSettings,
                effects: [...(activeSettings.effects || []), newEffect]
              });
            }}
            className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-tight"
          >
            + {lang === 'en' ? 'Add Effect' : 'Добавить'}
          </button>
        </div>



        <div className="space-y-3">
          {(activeSettings.effects || []).map((effect: BgEffect, idx: number) => (
            <div key={effect.id} className="p-3 bg-zinc-950/60 rounded-lg border border-zinc-900 space-y-2.5 relative group">
              {effect.type === 'css-waves' ? (
                <div className="space-y-4">
                  {/* 16:9 Live Preview Window */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? '📺 Real-time Preview (16:9)' : '📺 Превью в реальном времени (16:9)'}
                    </span>
                    <div className="w-full aspect-video rounded-lg relative overflow-hidden bg-black border border-zinc-800">
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
                          opacity: effect.opacity !== undefined ? effect.opacity : 50,
                        }}
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[8px] rounded border border-zinc-850 text-emerald-400 font-mono tracking-wider uppercase">
                        {lang === 'en' ? 'Procedural Waves Sandbox' : 'Процедурные волны'}
                      </div>
                    </div>
                  </div>

                  {/* General settings: Effect Type selection and Opacity (only background) */}
                  <div className="grid grid-cols-2 gap-2">
                    {renderEffectTypeSelect(effect, idx)}

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Background Opacity' : 'Непрозрачность фона'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effect.opacity}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, opacity: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Speed and Camera Tilt */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Speed Multiplier' : 'Множитель скорости'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.cssWavesSpeed !== undefined ? effect.cssWavesSpeed : 0.5}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={effect.cssWavesSpeed !== undefined ? effect.cssWavesSpeed : 0.5}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, cssWavesSpeed: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Camera Tilt' : 'Наклон камеры'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.cssWavesCameraTilt !== undefined ? effect.cssWavesCameraTilt : 0}px</span>
                      </div>
                      <input
                        type="range"
                        min="-500"
                        max="500"
                        step="10"
                        value={effect.cssWavesCameraTilt !== undefined ? effect.cssWavesCameraTilt : 0}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, cssWavesCameraTilt: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Camera Yaw */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] uppercase font-bold text-zinc-500">
                        {lang === 'en' ? 'Camera Yaw (Rotation)' : 'Поворот камеры (Yaw)'}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400">{effect.cssWavesCameraYaw !== undefined ? effect.cssWavesCameraYaw : 0}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="5"
                      value={effect.cssWavesCameraYaw !== undefined ? effect.cssWavesCameraYaw : 0}
                      onChange={(e) => {
                        const updated = [...activeSettings.effects];
                        updated[idx] = { ...effect, cssWavesCameraYaw: parseInt(e.target.value) };
                        updateActiveSettings({ ...activeSettings, effects: updated });
                      }}
                      className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* Wave Layers Settings Accordions / Subsections */}
                  <div className="border border-zinc-800/80 rounded p-2 bg-zinc-950/40 space-y-3.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-400 tracking-wider block">
                      {lang === 'en' ? 'Layer settings' : 'Настройки слоев'}
                    </span>

                    {/* Top Wave (Слой 1) */}
                    <div className="space-y-2 border-b border-zinc-900 pb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-zinc-300">
                          {lang === 'en' ? 'Top Wave (Front)' : 'Верхняя волна'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={effect.cssWavesTopColor || '#38bdf8'}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, cssWavesTopColor: e.target.value };
                              updateActiveSettings({ ...activeSettings, textShadowColor: e.target.value, effects: updated });
                            }}
                            className="w-4 h-4 bg-transparent border-0 cursor-pointer rounded overflow-hidden"
                          />
                          <span className="text-[8px] font-mono text-zinc-500 uppercase">{effect.cssWavesTopColor || '#38bdf8'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[7.5px] uppercase font-bold text-zinc-500">Amplitude</span>
                            <span className="text-[8px] font-mono text-zinc-400">{effect.cssWavesTopAmplitude !== undefined ? effect.cssWavesTopAmplitude : 30}</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="70"
                            value={effect.cssWavesTopAmplitude !== undefined ? effect.cssWavesTopAmplitude : 30}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, cssWavesTopAmplitude: parseInt(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[7.5px] uppercase font-bold text-zinc-500">Wavelength</span>
                            <span className="text-[8px] font-mono text-zinc-400">{effect.cssWavesTopWavelength !== undefined ? effect.cssWavesTopWavelength : 2}</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="8"
                            value={effect.cssWavesTopWavelength !== undefined ? effect.cssWavesTopWavelength : 2}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, cssWavesTopWavelength: parseInt(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[7.5px] uppercase font-bold text-zinc-500">Y Offset</span>
                            <span className="text-[8px] font-mono text-zinc-400">{effect.cssWavesTopYOffset !== undefined ? effect.cssWavesTopYOffset : 200}px</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="1000"
                            step="10"
                            value={effect.cssWavesTopYOffset !== undefined ? effect.cssWavesTopYOffset : 200}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, cssWavesTopYOffset: parseInt(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[7.5px] uppercase font-bold text-zinc-500">Opacity</span>
                            <span className="text-[8px] font-mono text-zinc-400">{Math.round((effect.cssWavesTopOpacity !== undefined ? effect.cssWavesTopOpacity : 0.8) * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={effect.cssWavesTopOpacity !== undefined ? effect.cssWavesTopOpacity : 0.8}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, cssWavesTopOpacity: parseFloat(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Middle Wave (Слой 2) */}
                    <div className="space-y-2 border-b border-zinc-900 pb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-zinc-300">
                          {lang === 'en' ? 'Middle Wave' : 'Средняя волна'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={effect.cssWavesMiddleColor || '#3b82f6'}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, cssWavesMiddleColor: e.target.value };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-4 h-4 bg-transparent border-0 cursor-pointer rounded overflow-hidden"
                          />
                          <span className="text-[8px] font-mono text-zinc-500 uppercase">{effect.cssWavesMiddleColor || '#3b82f6'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[7.5px] uppercase font-bold text-zinc-500">Amplitude</span>
                            <span className="text-[8px] font-mono text-zinc-400">{effect.cssWavesMiddleAmplitude !== undefined ? effect.cssWavesMiddleAmplitude : 40}</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="80"
                            value={effect.cssWavesMiddleAmplitude !== undefined ? effect.cssWavesMiddleAmplitude : 40}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, cssWavesMiddleAmplitude: parseInt(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[7.5px] uppercase font-bold text-zinc-500">Wavelength</span>
                            <span className="text-[8px] font-mono text-zinc-400">{effect.cssWavesMiddleWavelength !== undefined ? effect.cssWavesMiddleWavelength : 3}</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="8"
                            value={effect.cssWavesMiddleWavelength !== undefined ? effect.cssWavesMiddleWavelength : 3}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, cssWavesMiddleWavelength: parseInt(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[7.5px] uppercase font-bold text-zinc-500">Y Offset</span>
                            <span className="text-[8px] font-mono text-zinc-400">{effect.cssWavesMiddleYOffset !== undefined ? effect.cssWavesMiddleYOffset : 400}px</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="1000"
                            step="10"
                            value={effect.cssWavesMiddleYOffset !== undefined ? effect.cssWavesMiddleYOffset : 400}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, cssWavesMiddleYOffset: parseInt(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[7.5px] uppercase font-bold text-zinc-500">Opacity</span>
                            <span className="text-[8px] font-mono text-zinc-400">{Math.round((effect.cssWavesMiddleOpacity !== undefined ? effect.cssWavesMiddleOpacity : 0.6) * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={effect.cssWavesMiddleOpacity !== undefined ? effect.cssWavesMiddleOpacity : 0.6}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, cssWavesMiddleOpacity: parseFloat(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Wave (Слой 3) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-zinc-300">
                          {lang === 'en' ? 'Bottom Wave' : 'Нижняя волна'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={effect.cssWavesBottomColor || '#1d4ed8'}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, cssWavesBottomColor: e.target.value };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-4 h-4 bg-transparent border-0 cursor-pointer rounded overflow-hidden"
                          />
                          <span className="text-[8px] font-mono text-zinc-500 uppercase">{effect.cssWavesBottomColor || '#1d4ed8'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[7.5px] uppercase font-bold text-zinc-500">Amplitude</span>
                            <span className="text-[8px] font-mono text-zinc-400">{effect.cssWavesBottomAmplitude !== undefined ? effect.cssWavesBottomAmplitude : 50}</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="90"
                            value={effect.cssWavesBottomAmplitude !== undefined ? effect.cssWavesBottomAmplitude : 50}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, cssWavesBottomAmplitude: parseInt(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[7.5px] uppercase font-bold text-zinc-500">Wavelength</span>
                            <span className="text-[8px] font-mono text-zinc-400">{effect.cssWavesBottomWavelength !== undefined ? effect.cssWavesBottomWavelength : 4}</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="8"
                            value={effect.cssWavesBottomWavelength !== undefined ? effect.cssWavesBottomWavelength : 4}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, cssWavesBottomWavelength: parseInt(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[7.5px] uppercase font-bold text-zinc-500">Y Offset</span>
                            <span className="text-[8px] font-mono text-zinc-400">{effect.cssWavesBottomYOffset !== undefined ? effect.cssWavesBottomYOffset : 600}px</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="1000"
                            step="10"
                            value={effect.cssWavesBottomYOffset !== undefined ? effect.cssWavesBottomYOffset : 600}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, cssWavesBottomYOffset: parseInt(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[7.5px] uppercase font-bold text-zinc-500">Opacity</span>
                            <span className="text-[8px] font-mono text-zinc-400">{Math.round((effect.cssWavesBottomOpacity !== undefined ? effect.cssWavesBottomOpacity : 0.4) * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={effect.cssWavesBottomOpacity !== undefined ? effect.cssWavesBottomOpacity : 0.4}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, cssWavesBottomOpacity: parseFloat(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="pt-2 border-t border-zinc-900">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = activeSettings.effects.filter((_: any, i: number) => i !== idx);
                        updateActiveSettings({ ...activeSettings, effects: updated });
                      }}
                      className="w-full py-1.5 text-[10px] text-rose-400 hover:text-white hover:bg-rose-500/20 rounded border border-rose-500/30 transition-all uppercase font-bold tracking-wider"
                    >
                      {lang === 'en' ? 'Remove Effect' : 'Удалить эффект'}
                    </button>
                  </div>
                </div>
              ) : effect.type === 'plasma' ? (
                <div className="space-y-4">
                  {/* 16:9 Live Preview Window */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? '📺 Real-time Preview (16:9)' : '📺 Превью в реальном времени (16:9)'}
                    </span>
                    <div className="w-full aspect-video rounded-lg relative overflow-hidden bg-black border border-zinc-800">
                      <CosmicPlasmaNebula
                        settings={{
                          speed: effect.speed || 0.5,
                          complexity: effect.complexity !== undefined ? effect.complexity : 3.0,
                          intensity: effect.intensity !== undefined ? effect.intensity : 1.0,
                          opacity: effect.opacity !== undefined ? effect.opacity : 100,
                          blur: effect.blur !== undefined ? effect.blur : 0,
                          isPaused: effect.isPaused || false,
                          plasmaColors: effect.plasmaColors || ['#0ea5e9', '#d946ef', '#6366f1'],
                          plasmaAlgorithm: effect.plasmaAlgorithm !== undefined ? effect.plasmaAlgorithm : 0,
                          scale: effect.plasmaScale !== undefined ? effect.plasmaScale : 2.0,
                          turbulence: effect.plasmaTurbulence !== undefined ? effect.plasmaTurbulence : 4.5,
                        }}
                      />
                      {/* Interactive Touch Floating badge */}
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[8px] rounded border border-zinc-850 text-emerald-400 font-mono tracking-wider uppercase">
                        {lang === 'en' ? 'Active Sandbox' : 'Песочница'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {renderEffectTypeSelect(effect, idx)}

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Opacity' : 'Прозрачность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effect.opacity}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, opacity: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Nebula Complexity' : 'Сложность туманности'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.complexity !== undefined ? effect.complexity : 3.0}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={effect.complexity !== undefined ? effect.complexity : 3.0}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, complexity: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Intensity' : 'Интенсивность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.intensity !== undefined ? effect.intensity : 1.0}</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={effect.intensity !== undefined ? effect.intensity : 1.0}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, intensity: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Plasma Scale' : 'Масштаб плазмы'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.plasmaScale !== undefined ? effect.plasmaScale : 2.0}</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="5.0"
                        step="0.1"
                        value={effect.plasmaScale !== undefined ? effect.plasmaScale : 2.0}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, plasmaScale: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Turbulence' : 'Завихрения'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.plasmaTurbulence !== undefined ? effect.plasmaTurbulence : 4.5}</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="10.0"
                        step="0.1"
                        value={effect.plasmaTurbulence !== undefined ? effect.plasmaTurbulence : 4.5}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, plasmaTurbulence: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Drift Speed' : 'Скорость дрейфа'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.speed || 0.5}</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="3"
                        step="0.05"
                        value={effect.speed || 0.5}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, speed: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Glow Blur' : 'Размытие свечения'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.blur !== undefined ? effect.blur : 0}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        step="1"
                        value={effect.blur !== undefined ? effect.blur : 0}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, blur: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] uppercase font-bold text-zinc-500">
                      {lang === 'en' ? 'Nebula Algorithms' : 'Алгоритм плазмы'}
                    </span>
                    <select
                      value={effect.plasmaAlgorithm !== undefined ? effect.plasmaAlgorithm : 0}
                      onChange={(e) => {
                        const updated = [...activeSettings.effects];
                        updated[idx] = { ...effect, plasmaAlgorithm: parseInt(e.target.value) };
                        updateActiveSettings({ ...activeSettings, effects: updated });
                      }}
                      className="w-full bg-zinc-900 border border-zinc-800 text-[10px] rounded p-1 text-white focus:outline-none cursor-pointer"
                    >
                      <option value={0}>💫 Sine Cosine Turbulence</option>
                      <option value={1}>🌈 Multi-frequency Sine Waves</option>
                      <option value={2}>🧬 Simplex Noise (Approximated)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 block">
                      {lang === 'en' ? 'Palette Presets' : 'Пресеты палитры'}
                    </span>
                    <div className="grid grid-cols-2 gap-1 max-h-24 overflow-y-auto pr-1">
                      {[
                        { name: 'Cosmic Indigo', colors: ['#0ea5e9', '#d946ef', '#6366f1'] },
                        { name: 'Aurora Borealis', colors: ['#10b981', '#06b6d4', '#3b82f6'] },
                        { name: 'Solar Flare', colors: ['#f59e0b', '#ef4444', '#ec4899'] },
                        { name: 'Deep Cyber', colors: ['#8b5cf6', '#a855f7', '#00ffff'] },
                        { name: 'Monochrome Smoke', colors: ['#18181b', '#3f3f46', '#a1a1aa'] }
                      ].map((preset) => {
                        const isSelected = effect.plasmaColors?.join(',') === preset.colors.join(',');
                        return (
                          <button
                            key={preset.name}
                            onClick={() => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, plasmaColors: preset.colors };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className={`p-1.5 rounded border text-[8px] flex flex-col gap-1 text-left transition-all ${
                              isSelected ? 'border-emerald-500 bg-emerald-950/20 text-emerald-400' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 text-zinc-400'
                            }`}
                          >
                            <span className="font-semibold truncate">{preset.name}</span>
                            <div className="flex gap-0.5">
                              {preset.colors.map((c, cIdx) => (
                                <div key={cIdx} className="w-2.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
                              ))}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 block">
                      {lang === 'en' ? 'Custom Palette Editor' : 'Редактор кастомной палитры'}
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {[0, 1, 2].map((colorIdx) => {
                        const colors = effect.plasmaColors || ['#0ea5e9', '#d946ef', '#6366f1'];
                        return (
                          <input
                            key={colorIdx}
                            type="color"
                            value={colors[colorIdx] || '#ffffff'}
                            onChange={(e) => {
                              const updatedColors = [...colors];
                              updatedColors[colorIdx] = e.target.value;
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, plasmaColors: updatedColors };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-6 rounded cursor-pointer bg-transparent border-0"
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-zinc-900/30 rounded border border-zinc-850">
                    <span className="text-[9px] text-zinc-300 font-medium">
                      {lang === 'en' ? 'Pause Animation' : 'Приостановить анимацию'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!effect.isPaused}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, isPaused: e.target.checked };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-7 h-4 bg-zinc-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-350 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-white" />
                    </label>
                  </div>

                  <button
                    onClick={() => {
                      const updated = activeSettings.effects.filter((_: any, i: number) => i !== idx);
                      updateActiveSettings({ ...activeSettings, effects: updated });
                    }}
                    className="w-full py-1.5 text-[10px] text-rose-400 hover:text-white hover:bg-rose-500/20 rounded border border-rose-500/30 transition-all uppercase font-bold tracking-wider"
                  >
                    {lang === 'en' ? 'Remove Effect' : 'Удалить эффект'}
                  </button>
                </div>
              ) : effect.type === 'vector-forms' ? (
                <div className="space-y-4">
                  {/* 16:9 Live Preview Window */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? '📺 Real-time Preview (16:9)' : '📺 Превью в реальном времени (16:9)'}
                    </span>
                    <div className="w-full aspect-video rounded-lg relative overflow-hidden bg-black border border-zinc-800">
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
                        }}
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[8px] rounded border border-zinc-850 text-emerald-400 font-mono tracking-wider uppercase">
                        {lang === 'en' ? 'Vector Forms Sandbox' : 'Векторные формы'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {renderEffectTypeSelect(effect, idx)}

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Opacity' : 'Прозрачность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effect.opacity}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, opacity: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-zinc-500">
                        {lang === 'en' ? 'Mask Type' : 'Тип маски'}
                      </span>
                      <select
                        value={effect.maskType || 'hexagon'}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, maskType: e.target.value as any };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full bg-zinc-900 border border-zinc-800 text-[10px] rounded p-1 text-white focus:outline-none cursor-pointer font-mono"
                      >
                        <option value="hexagon">Hexagon</option>
                        <option value="circle">Circle</option>
                        <option value="square">Square</option>
                        <option value="none">None</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-zinc-500">
                        {lang === 'en' ? 'Pattern Type' : 'Тип узора'}
                      </span>
                      <select
                        value={effect.patternType || 'circles'}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, patternType: e.target.value as any };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full bg-zinc-900 border border-zinc-800 text-[10px] rounded p-1 text-white focus:outline-none cursor-pointer font-mono"
                      >
                        <option value="circles">Circles</option>
                        <option value="star">Star</option>
                        <option value="cross">Cross</option>
                        <option value="triangle">Triangle</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Columns' : 'Колонки'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.cols !== undefined ? effect.cols : 7}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="15"
                        step="1"
                        value={effect.cols !== undefined ? effect.cols : 7}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, cols: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Rows' : 'Ряды'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.rows !== undefined ? effect.rows : 4}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={effect.rows !== undefined ? effect.rows : 4}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, rows: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Shape Width' : 'Ширина формы'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.shapeWidth !== undefined ? effect.shapeWidth : 130}px</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="300"
                        step="5"
                        value={effect.shapeWidth !== undefined ? effect.shapeWidth : 130}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, shapeWidth: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Shape Height' : 'Высота формы'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.shapeHeight !== undefined ? effect.shapeHeight : 130}px</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="300"
                        step="5"
                        value={effect.shapeHeight !== undefined ? effect.shapeHeight : 130}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, shapeHeight: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Stroke Width' : 'Толщина линий'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.strokeWidth !== undefined ? effect.strokeWidth : 2}px</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="10"
                        step="0.5"
                        value={effect.strokeWidth !== undefined ? effect.strokeWidth : 2}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, strokeWidth: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Duration (s)' : 'Длительность (сек)'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.duration !== undefined ? effect.duration : 4.5}s</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="0.5"
                        value={effect.duration !== undefined ? effect.duration : 4.5}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, duration: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Color Hue Start' : 'Начальный тон'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.colorHueStart !== undefined ? effect.colorHueStart : 210}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="1"
                        value={effect.colorHueStart !== undefined ? effect.colorHueStart : 210}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, colorHueStart: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Color Hue Step' : 'Шаг тона'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.colorHueStep !== undefined ? effect.colorHueStep : 30}°</span>
                      </div>
                      <input
                        type="range"
                        min="-120"
                        max="120"
                        step="5"
                        value={effect.colorHueStep !== undefined ? effect.colorHueStep : 30}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, colorHueStep: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Saturation' : 'Насыщенность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.colorSaturation !== undefined ? effect.colorSaturation : 90}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={effect.colorSaturation !== undefined ? effect.colorSaturation : 90}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, colorSaturation: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Lightness' : 'Яркость'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.colorLightness !== undefined ? effect.colorLightness : 55}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={effect.colorLightness !== undefined ? effect.colorLightness : 55}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, colorLightness: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-zinc-500">
                        {lang === 'en' ? 'Background Color' : 'Цвет фона'}
                      </span>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={effect.bgColor || '#0a0a0a'}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, bgColor: e.target.value };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={effect.bgColor || '#0a0a0a'}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, bgColor: e.target.value };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 text-[10px] rounded p-1 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-zinc-500 block">
                        {lang === 'en' ? 'Overlap Mode' : 'Режим наложения'}
                      </span>
                      <label className="inline-flex items-center gap-2 mt-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={effect.overlapMode !== undefined ? effect.overlapMode : true}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, overlapMode: e.target.checked };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="rounded border-zinc-800 bg-zinc-900 text-emerald-500 focus:ring-0 w-3 h-3 cursor-pointer"
                        />
                        <span className="text-[10px] text-zinc-300">
                          {lang === 'en' ? 'Enabled' : 'Включено'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const updated = activeSettings.effects.filter((_: any, i: number) => i !== idx);
                      updateActiveSettings({ ...activeSettings, effects: updated });
                    }}
                    className="w-full py-1.5 text-[10px] text-rose-400 hover:text-white hover:bg-rose-500/20 rounded border border-rose-500/30 transition-all uppercase font-bold tracking-wider"
                  >
                    {lang === 'en' ? 'Remove Effect' : 'Удалить эффект'}
                  </button>
                </div>
              ) : effect.type === 'research-network' ? (
                <div className="space-y-4">
                  {/* 16:9 Live Preview Window */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? '📺 Real-time Preview (16:9)' : '📺 Превью в реальном времени (16:9)'}
                    </span>
                    <div className="w-full aspect-video rounded-lg relative overflow-hidden bg-black border border-zinc-800">
                      <div style={{ opacity: effect.opacity !== undefined ? effect.opacity / 100 : 1 }} className="absolute inset-0 w-full h-full pointer-events-none">
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
                            speedMin: effect.speedMin !== undefined ? effect.speedMin : 0.2,
                            speedMax: effect.speedMax !== undefined ? effect.speedMax : 0.8,
                            linkDist: effect.linkDist !== undefined ? effect.linkDist : 140,
                            lineBorder: effect.lineBorder !== undefined ? effect.lineBorder : 1.0,
                            circleBorder: effect.circleBorder !== undefined ? effect.circleBorder : 1.5,
                            maxOpacity: effect.maxOpacity !== undefined ? effect.maxOpacity : 0.5,
                          }}
                        />
                      </div>
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[8px] rounded border border-zinc-800 text-emerald-400 font-mono tracking-wider uppercase">
                        {lang === 'en' ? 'Research Network Sandbox' : 'Информационная сеть'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {renderEffectTypeSelect(effect, idx)}

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Opacity' : 'Прозрачность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effect.opacity}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, opacity: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Node Count (FG)' : 'Нод (Передний план)'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.maxCircles !== undefined ? effect.maxCircles : 45}</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        value={effect.maxCircles !== undefined ? effect.maxCircles : 45}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, maxCircles: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Node Count (BG)' : 'Нод (Задний план)'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.maxCirclesBg !== undefined ? effect.maxCirclesBg : 35}</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="80"
                        value={effect.maxCirclesBg !== undefined ? effect.maxCirclesBg : 35}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, maxCirclesBg: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Link Distance' : 'Дистанция связей'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.linkDist !== undefined ? effect.linkDist : 140}px</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="250"
                        value={effect.linkDist !== undefined ? effect.linkDist : 140}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, linkDist: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Max Opacity' : 'Макс. яркость'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.maxOpacity !== undefined ? effect.maxOpacity : 0.5}</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={effect.maxOpacity !== undefined ? effect.maxOpacity : 0.5}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, maxOpacity: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 block">
                      {lang === 'en' ? 'Foreground Node Colors' : 'Цвета передних нод'}
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {Array.from({ length: 3 }).map((_, colIdx) => {
                        const colors = effect.colors || ['#38bdf8', '#818cf8', '#ffffff'];
                        return (
                          <input
                            key={colIdx}
                            type="color"
                            value={colors[colIdx] || '#ffffff'}
                            onChange={(e) => {
                              const updatedColors = [...colors];
                              updatedColors[colIdx] = e.target.value;
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, colors: updatedColors };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-6 rounded cursor-pointer bg-transparent border-0"
                          />
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const updated = activeSettings.effects.filter((_: any, i: number) => i !== idx);
                      updateActiveSettings({ ...activeSettings, effects: updated });
                    }}
                    className="w-full py-1.5 text-[10px] text-rose-400 hover:text-white hover:bg-rose-500/20 rounded border border-rose-500/30 transition-all uppercase font-bold tracking-wider"
                  >
                    {lang === 'en' ? 'Remove Effect' : 'Удалить эффект'}
                  </button>
                </div>
              ) : effect.type === 'geo-shapes' ? (
                <div className="space-y-4">
                  {/* 16:9 Live Preview Window */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? '📺 Real-time Preview (16:9)' : '📺 Превью в реальном времени (16:9)'}
                    </span>
                    <div className="w-full aspect-video rounded-lg relative overflow-hidden bg-black border border-zinc-800">
                      <GeoShapes
                        settings={{
                          bgColor: effect.bgColor || '#0f0f11',
                          gridSize: effect.gridSize !== undefined ? effect.gridSize : 120,
                          size: effect.size !== undefined ? effect.size : 18,
                          fallSpeed: effect.fallSpeed !== undefined ? effect.fallSpeed : 0.4,
                          fallDirection: effect.fallDirection !== undefined ? effect.fallDirection : 135,
                          rotationSpeed: effect.rotationSpeed !== undefined ? effect.rotationSpeed : 1.0,
                          randomness: effect.randomness !== undefined ? effect.randomness : 0.5,
                          colors: effect.colors || ['#a855f7', '#6366f1', '#3b82f6', '#f43f5e'],
                          opacity: effect.opacity,
                        }}
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[8px] rounded border border-zinc-800 text-emerald-400 font-mono tracking-wider uppercase">
                        {lang === 'en' ? 'Geo Shapes Sandbox' : 'Геометрические примитивы'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {renderEffectTypeSelect(effect, idx)}

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Opacity' : 'Прозрачность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effect.opacity}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, opacity: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Grid Size' : 'Размер сетки'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.gridSize !== undefined ? effect.gridSize : 120}px</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="250"
                        value={effect.gridSize !== undefined ? effect.gridSize : 120}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, gridSize: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Shape Size' : 'Размер фигур'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.size !== undefined ? effect.size : 18}px</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="80"
                        value={effect.size !== undefined ? effect.size : 18}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, size: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Fall Speed' : 'Скорость падения'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.fallSpeed !== undefined ? effect.fallSpeed : 0.4}</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="4.0"
                        step="0.1"
                        value={effect.fallSpeed !== undefined ? effect.fallSpeed : 0.4}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, fallSpeed: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Direction' : 'Направление'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.fallDirection !== undefined ? effect.fallDirection : 135}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={effect.fallDirection !== undefined ? effect.fallDirection : 135}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, fallDirection: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Rotation' : 'Вращение'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.rotationSpeed !== undefined ? effect.rotationSpeed : 1.0}</span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="3.0"
                        step="0.1"
                        value={effect.rotationSpeed !== undefined ? effect.rotationSpeed : 1.0}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, rotationSpeed: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Randomness' : 'Хаотичность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.randomness !== undefined ? effect.randomness : 0.5}</span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="1.0"
                        step="0.05"
                        value={effect.randomness !== undefined ? effect.randomness : 0.5}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, randomness: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 block">
                      {lang === 'en' ? 'Shape Colors' : 'Цвета фигур'}
                    </span>
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({ length: 4 }).map((_, colIdx) => {
                        const colors = effect.colors || ['#a855f7', '#6366f1', '#3b82f6', '#f43f5e'];
                        return (
                          <input
                            key={colIdx}
                            type="color"
                            value={colors[colIdx] || '#ffffff'}
                            onChange={(e) => {
                              const updatedColors = [...colors];
                              updatedColors[colIdx] = e.target.value;
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, colors: updatedColors };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-6 rounded cursor-pointer bg-transparent border-0"
                          />
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const updated = activeSettings.effects.filter((_: any, i: number) => i !== idx);
                      updateActiveSettings({ ...activeSettings, effects: updated });
                    }}
                    className="w-full py-1.5 text-[10px] text-rose-400 hover:text-white hover:bg-rose-500/20 rounded border border-rose-500/30 transition-all uppercase font-bold tracking-wider"
                  >
                    {lang === 'en' ? 'Remove Effect' : 'Удалить эффект'}
                  </button>
                </div>
              ) : effect.type === 'floating-cubes' ? (
                <div className="space-y-4">
                  {/* 16:9 Live Preview Window */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? '📺 Real-time Preview (16:9)' : '📺 Превью в реальном времени (16:9)'}
                    </span>
                    <div className="w-full aspect-video rounded-lg relative overflow-hidden bg-black border border-zinc-800">
                      <FloatingCubes
                        settings={{
                          bgColor: effect.bgColor || '#0a0a0c',
                          count: effect.cubesCount !== undefined ? effect.cubesCount : 15,
                          minSize: effect.minSize !== undefined ? effect.minSize : 40,
                          maxSize: effect.maxSize !== undefined ? effect.maxSize : 100,
                          speed: effect.speed !== undefined ? effect.speed : 0.8,
                          shapes: effect.shapes || ['cube', 'pyramid'],
                          tints: effect.tints || [
                            { color: '#ffffff', shading: '#a1a1aa' },
                            { color: '#6366f1', shading: '#311042' },
                            { color: '#38bdf8', shading: '#1e3a8a' },
                          ],
                        }}
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[8px] rounded border border-zinc-800 text-emerald-400 font-mono tracking-wider uppercase">
                        {lang === 'en' ? 'Floating Cubes Sandbox' : 'Парящие CSS 3D кубы'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {renderEffectTypeSelect(effect, idx)}

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Opacity' : 'Прозрачность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effect.opacity}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, opacity: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Shape Count' : 'Кол-во фигур'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.cubesCount !== undefined ? effect.cubesCount : 15}</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="40"
                        value={effect.cubesCount !== undefined ? effect.cubesCount : 15}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, cubesCount: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Rotation Speed' : 'Скорость вращения'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.speed !== undefined ? effect.speed : 0.8}</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="4.0"
                        step="0.1"
                        value={effect.speed !== undefined ? effect.speed : 0.8}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, speed: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Min Size' : 'Мин. размер'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.minSize !== undefined ? effect.minSize : 40}px</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={effect.minSize !== undefined ? effect.minSize : 40}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, minSize: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Max Size' : 'Макс. размер'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.maxSize !== undefined ? effect.maxSize : 100}px</span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="200"
                        value={effect.maxSize !== undefined ? effect.maxSize : 100}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, maxSize: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 block">
                      {lang === 'en' ? 'Active 3D Shapes' : 'Активные 3D-формы'}
                    </span>
                    <div className="flex items-center gap-4 mt-1">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(effect.shapes || ['cube', 'pyramid']).includes('cube')}
                          onChange={(e) => {
                            const current = effect.shapes || ['cube', 'pyramid'];
                            const next = e.target.checked 
                              ? [...current, 'cube'] 
                              : current.filter(s => s !== 'cube');
                            if (next.length === 0) return; // Prevent empty shapes
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, shapes: next };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="rounded border-zinc-800 bg-zinc-900 text-emerald-500 focus:ring-0 w-3 h-3 cursor-pointer"
                        />
                        <span className="text-[10px] text-zinc-300">Cube</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(effect.shapes || ['cube', 'pyramid']).includes('pyramid')}
                          onChange={(e) => {
                            const current = effect.shapes || ['cube', 'pyramid'];
                            const next = e.target.checked 
                              ? [...current, 'pyramid'] 
                              : current.filter(s => s !== 'pyramid');
                            if (next.length === 0) return; // Prevent empty shapes
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, shapes: next };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="rounded border-zinc-800 bg-zinc-900 text-emerald-500 focus:ring-0 w-3 h-3 cursor-pointer"
                        />
                        <span className="text-[10px] text-zinc-300">Pyramid</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 block">
                      {lang === 'en' ? 'Tints & Shadings' : 'Палитра и тени'}
                    </span>
                    <div className="space-y-1.5">
                      {Array.from({ length: 3 }).map((_, tintIdx) => {
                        const tints = effect.tints || [
                          { color: '#ffffff', shading: '#a1a1aa' },
                          { color: '#6366f1', shading: '#311042' },
                          { color: '#38bdf8', shading: '#1e3a8a' },
                        ];
                        const tint = tints[tintIdx] || { color: '#ffffff', shading: '#ffffff' };
                        return (
                          <div key={tintIdx} className="flex items-center gap-2">
                            <span className="text-[9px] text-zinc-500 w-8">Tint {tintIdx + 1}:</span>
                            <div className="flex-1 grid grid-cols-2 gap-1">
                              <div className="flex items-center gap-1 bg-zinc-900/60 p-1 rounded border border-zinc-800">
                                <span className="text-[7px] text-zinc-500">Base</span>
                                <input
                                  type="color"
                                  value={tint.color}
                                  onChange={(e) => {
                                    const nextTints = [...tints];
                                    nextTints[tintIdx] = { ...tint, color: e.target.value };
                                    const updated = [...activeSettings.effects];
                                    updated[idx] = { ...effect, tints: nextTints };
                                    updateActiveSettings({ ...activeSettings, effects: updated });
                                  }}
                                  className="w-4 h-4 rounded cursor-pointer bg-transparent border-0 p-0"
                                />
                              </div>
                              <div className="flex items-center gap-1 bg-zinc-900/60 p-1 rounded border border-zinc-800">
                                <span className="text-[7px] text-zinc-500">Shade</span>
                                <input
                                  type="color"
                                  value={tint.shading}
                                  onChange={(e) => {
                                    const nextTints = [...tints];
                                    nextTints[tintIdx] = { ...tint, shading: e.target.value };
                                    const updated = [...activeSettings.effects];
                                    updated[idx] = { ...effect, tints: nextTints };
                                    updateActiveSettings({ ...activeSettings, effects: updated });
                                  }}
                                  className="w-4 h-4 rounded cursor-pointer bg-transparent border-0 p-0"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const updated = activeSettings.effects.filter((_: any, i: number) => i !== idx);
                      updateActiveSettings({ ...activeSettings, effects: updated });
                    }}
                    className="w-full py-1.5 text-[10px] text-rose-400 hover:text-white hover:bg-rose-500/20 rounded border border-rose-500/30 transition-all uppercase font-bold tracking-wider"
                  >
                    {lang === 'en' ? 'Remove Effect' : 'Удалить эффект'}
                  </button>
                </div>
              ) : effect.type === 'clouds-3d' ? (
                <div className="space-y-4">
                  {/* 16:9 Live Preview Window */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? '📺 Real-time Preview (16:9)' : '📺 Превью в реальном времени (16:9)'}
                    </span>
                    <div className="w-full aspect-video rounded-lg relative overflow-hidden bg-black border border-zinc-800">
                      <Clouds3D
                        settings={{
                          speed: effect.speed !== undefined ? effect.speed : 0.03,
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
                          opacity: effect.opacity,
                        }}
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[8px] rounded border border-zinc-800 text-emerald-400 font-mono tracking-wider uppercase">
                        {lang === 'en' ? 'Clouds 3D Sandbox' : 'Облака 3D'}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {renderEffectTypeSelect(effect, idx)}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Speed' : 'Скорость'}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono bg-zinc-900 px-1 rounded border border-zinc-800">
                          {effect.speed !== undefined ? effect.speed : 0.03}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.001"
                        max="0.2"
                        step="0.001"
                        value={effect.speed !== undefined ? effect.speed : 0.03}
                        onChange={(e) => updateActiveSettings({ ...activeSettings, effects: activeSettings.effects.map((ef: any, i: number) => i === idx ? { ...ef, speed: parseFloat(e.target.value) } : ef) })}
                        className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Opacity (%)' : 'Прозрачность (%)'}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono bg-zinc-900 px-1 rounded border border-zinc-800">
                          {effect.opacity !== undefined ? effect.opacity : 100}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={effect.opacity !== undefined ? effect.opacity : 100}
                        onChange={(e) => updateActiveSettings({ ...activeSettings, effects: activeSettings.effects.map((ef: any, i: number) => i === idx ? { ...ef, opacity: parseInt(e.target.value) } : ef) })}
                        className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Camera Height' : 'Высота камеры'}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono bg-zinc-900 px-1 rounded border border-zinc-800">
                          {effect.cameraHeight !== undefined ? effect.cameraHeight : 0}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-200"
                        max="200"
                        step="1"
                        value={effect.cameraHeight !== undefined ? effect.cameraHeight : 0}
                        onChange={(e) => updateActiveSettings({ ...activeSettings, effects: activeSettings.effects.map((ef: any, i: number) => i === idx ? { ...ef, cameraHeight: parseInt(e.target.value) } : ef) })}
                        className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="bg-zinc-950/40 p-2.5 rounded border border-zinc-800/60 space-y-3 mt-2">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? '🖱️ Scroll Synchronization' : '🖱️ Синхронизация скролла'}
                    </span>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[8px] text-zinc-500 uppercase">{lang === 'en' ? 'Camera Start Y' : 'Старт камеры Y'}</span>
                        <input
                          type="number"
                          value={effect.scrollCameraStart !== undefined ? effect.scrollCameraStart : 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            updateActiveSettings({ ...activeSettings, effects: activeSettings.effects.map((ef: any, i: number) => i === idx ? { ...ef, scrollCameraStart: isNaN(val) ? 0 : val } : ef) });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-300 font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] text-zinc-500 uppercase">{lang === 'en' ? 'Camera End Y' : 'Финиш камеры Y'}</span>
                        <input
                          type="number"
                          value={effect.scrollCameraEnd !== undefined ? effect.scrollCameraEnd : -200}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            updateActiveSettings({ ...activeSettings, effects: activeSettings.effects.map((ef: any, i: number) => i === idx ? { ...ef, scrollCameraEnd: isNaN(val) ? 0 : val } : ef) });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-300 font-mono"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Scroll Range (px)' : 'Диапазон скролла (px)'}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {effect.scrollLimit !== undefined ? effect.scrollLimit : 1000}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="5000"
                        step="100"
                        value={effect.scrollLimit !== undefined ? effect.scrollLimit : 1000}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          updateActiveSettings({ ...activeSettings, effects: activeSettings.effects.map((ef: any, i: number) => i === idx ? { ...ef, scrollLimit: isNaN(val) ? 1000 : val } : ef) });
                        }}
                        className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 mt-3">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? 'Color Settings' : 'Настройки цвета'}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/80">
                        <div className="flex flex-col space-y-1.5">
                          <span className="text-[8px] text-zinc-400 uppercase tracking-wider">{lang === 'en' ? 'Fog Color' : 'Цвет тумана'}</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={effect.fogColor || '#4584b4'}
                              onChange={(e) => updateActiveSettings({ ...activeSettings, effects: activeSettings.effects.map((ef: any, i: number) => i === idx ? { ...ef, fogColor: e.target.value } : ef) })}
                              className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
                            />
                            <input
                              type="text"
                              value={effect.fogColor || '#4584b4'}
                              onChange={(e) => updateActiveSettings({ ...activeSettings, effects: activeSettings.effects.map((ef: any, i: number) => i === idx ? { ...ef, fogColor: e.target.value } : ef) })}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] text-zinc-300 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/80">
                        <div className="flex flex-col space-y-1.5">
                          <span className="text-[8px] text-zinc-400 uppercase tracking-wider">{lang === 'en' ? 'BG Color 1 (Top)' : 'Фон 1 (Верх)'}</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={effect.bgGradientColor1 || '#326696'}
                              onChange={(e) => updateActiveSettings({ ...activeSettings, effects: activeSettings.effects.map((ef: any, i: number) => i === idx ? { ...ef, bgGradientColor1: e.target.value } : ef) })}
                              className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
                            />
                            <input
                              type="text"
                              value={effect.bgGradientColor1 || '#326696'}
                              onChange={(e) => updateActiveSettings({ ...activeSettings, effects: activeSettings.effects.map((ef: any, i: number) => i === idx ? { ...ef, bgGradientColor1: e.target.value } : ef) })}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] text-zinc-300 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/80">
                        <div className="flex flex-col space-y-1.5">
                          <span className="text-[8px] text-zinc-400 uppercase tracking-wider">{lang === 'en' ? 'BG Color 2 (Bottom)' : 'Фон 2 (Низ)'}</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={effect.bgGradientColor2 || '#4584b4'}
                              onChange={(e) => updateActiveSettings({ ...activeSettings, effects: activeSettings.effects.map((ef: any, i: number) => i === idx ? { ...ef, bgGradientColor2: e.target.value } : ef) })}
                              className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
                            />
                            <input
                              type="text"
                              value={effect.bgGradientColor2 || '#4584b4'}
                              onChange={(e) => updateActiveSettings({ ...activeSettings, effects: activeSettings.effects.map((ef: any, i: number) => i === idx ? { ...ef, bgGradientColor2: e.target.value } : ef) })}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] text-zinc-300 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const updated = activeSettings.effects.filter((_: any, i: number) => i !== idx);
                      updateActiveSettings({ ...activeSettings, effects: updated });
                    }}
                    className="w-full py-1.5 text-[10px] text-rose-400 hover:text-white hover:bg-rose-500/20 rounded border border-rose-500/30 transition-all uppercase font-bold tracking-wider"
                  >
                    {lang === 'en' ? 'Remove Effect' : 'Удалить эффект'}
                  </button>
                </div>
              ) : effect.type === 'bezier-waves' ? (
                <div className="space-y-4">
                  {/* 16:9 Live Preview Window */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? '📺 Real-time Preview (16:9)' : '📺 Превью в реальном времени (16:9)'}
                    </span>
                    <div className="w-full aspect-video rounded-lg relative overflow-hidden bg-black border border-zinc-800">
                      <BezierWaves
                        settings={{
                          waves: effect.bezierWaves !== undefined ? effect.bezierWaves : 3,
                          speed: effect.speed !== undefined ? effect.speed : 1.0,
                          width: effect.bezierWidth !== undefined ? effect.bezierWidth : 25,
                          amplitude: effect.bezierAmplitude !== undefined ? effect.bezierAmplitude : 0.5,
                          hueStart: effect.bezierHueStart !== undefined ? effect.bezierHueStart : 1.0,
                          hueEnd: effect.bezierHueEnd !== undefined ? effect.bezierHueEnd : 10.0,
                          rotation: effect.bezierRotation !== undefined ? effect.bezierRotation : 45,
                          opacity: effect.opacity !== undefined ? effect.opacity : 100,
                        }}
                      />
                      {/* Interactive Touch Floating badge */}
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[8px] rounded border border-zinc-850 text-emerald-400 font-mono tracking-wider uppercase">
                        {lang === 'en' ? 'Active Sandbox' : 'Песочница'}
                      </div>
                    </div>
                  </div>

                  {/* Row 1: Shape & Opacity */}
                  <div className="grid grid-cols-2 gap-2">
                    {renderEffectTypeSelect(effect, idx)}

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Opacity' : 'Прозрачность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effect.opacity}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, opacity: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Bezier Waves custom sliders */}
                  <div className="space-y-3 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-900/60">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block border-b border-zinc-900 pb-1">
                      ➰ {lang === 'en' ? 'Bezier Waves Settings' : 'Настройки кривых Безье'}
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Speed */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Speed' : 'Скорость'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{(effect.speed !== undefined ? effect.speed : 1.0).toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="4.0"
                          step="0.1"
                          value={effect.speed !== undefined ? effect.speed : 1.0}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, speed: parseFloat(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>

                      {/* Waves Count */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Waves Count' : 'Количество волн'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{effect.bezierWaves !== undefined ? effect.bezierWaves : 3}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="1"
                          value={effect.bezierWaves !== undefined ? effect.bezierWaves : 3}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, bezierWaves: parseInt(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Ribbon width / Tail thickness */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Tail Width' : 'Толщина шлейфа'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{effect.bezierWidth !== undefined ? effect.bezierWidth : 25}</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="100"
                          step="1"
                          value={effect.bezierWidth !== undefined ? effect.bezierWidth : 25}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, bezierWidth: parseInt(e.target.value) };
                            updateActiveSettings({ ...activeSettings, text: '', effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>

                      {/* Curve Amplitude */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Amplitude' : 'Изогнутость'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{(effect.bezierAmplitude !== undefined ? effect.bezierAmplitude : 0.5).toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="3.0"
                          step="0.05"
                          value={effect.bezierAmplitude !== undefined ? effect.bezierAmplitude : 0.5}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, bezierAmplitude: parseFloat(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Hue Start */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Color Phase Min' : 'Минимум фазы цвета'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{(effect.bezierHueStart !== undefined ? effect.bezierHueStart : 1.0).toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.0"
                          max="20.0"
                          step="0.1"
                          value={effect.bezierHueStart !== undefined ? effect.bezierHueStart : 1.0}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, bezierHueStart: parseFloat(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>

                      {/* Hue End */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Color Phase Max' : 'Максимум фазы цвета'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{(effect.bezierHueEnd !== undefined ? effect.bezierHueEnd : 10.0).toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.0"
                          max="40.0"
                          step="0.1"
                          value={effect.bezierHueEnd !== undefined ? effect.bezierHueEnd : 10.0}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, bezierHueEnd: parseFloat(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Rotation */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Rotation Angle' : 'Угол вращения'}</span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.bezierRotation !== undefined ? effect.bezierRotation : 45}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="1"
                        value={effect.bezierRotation !== undefined ? effect.bezierRotation : 45}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, bezierRotation: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, ...{ effects: updated } });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              ) : effect.type === 'liquid-ripples' ? (
                <div className="space-y-4">
                  {/* 16:9 Live Preview Window */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? '📺 Real-time Preview (16:9)' : '📺 Превью в реальном времени (16:9)'}
                    </span>
                    <div className="w-full aspect-video rounded-lg relative overflow-hidden bg-black border border-zinc-800">
                      <LiquidRipples
                        settings={{
                          gridX: effect.liquidGridX !== undefined ? effect.liquidGridX : 250,
                          gridY: effect.liquidGridY !== undefined ? effect.liquidGridY : 100,
                          separation: effect.liquidSeparation !== undefined ? effect.liquidSeparation : 15,
                          particleSize: effect.liquidParticleSize !== undefined ? effect.liquidParticleSize : 1.0,
                          particleColor: effect.liquidParticleColor !== undefined ? effect.liquidParticleColor : '#6366f1',
                          waveSpeed: effect.liquidWaveSpeed !== undefined ? effect.liquidWaveSpeed : 0.85,
                          waveFrequency: effect.liquidWaveFrequency !== undefined ? effect.liquidWaveFrequency : 0.07,
                          waveAmplitude: effect.liquidWaveAmplitude !== undefined ? effect.liquidWaveAmplitude : 45,
                          cameraHeight: effect.liquidCameraHeight !== undefined ? effect.liquidCameraHeight : 100,
                          cameraDepth: effect.liquidCameraDepth !== undefined ? effect.liquidCameraDepth : 800,
                          bgGradientStart: effect.liquidBgGradientStart !== undefined ? effect.liquidBgGradientStart : '#03000a',
                          bgGradientEnd: effect.liquidBgGradientEnd !== undefined ? effect.liquidBgGradientEnd : '#0b031e',
                          opacity: 100,
                        }}
                      />
                      {/* Interactive Touch Floating badge */}
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[8px] rounded border border-zinc-855 text-emerald-400 font-mono tracking-wider uppercase">
                        {lang === 'en' ? 'Active Sandbox' : 'Песочница'}
                      </div>
                    </div>
                  </div>

                  {/* Row 1: Shape & Opacity */}
                  <div className="grid grid-cols-2 gap-2">
                    {renderEffectTypeSelect(effect, idx)}

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Opacity' : 'Прозрачность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effect.opacity}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, opacity: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Liquid Ripples settings */}
                  <div className="space-y-3 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-900/60">
                    <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block border-b border-zinc-900 pb-1">
                      🌊 {lang === 'en' ? 'Interactive Waves Settings' : 'Настройки интерактивных волн'}
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Particle Color' : 'Цвет точек'}</span>
                        <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 p-1 rounded">
                          <input
                            type="color"
                            value={effect.liquidParticleColor !== undefined ? effect.liquidParticleColor : '#6366f1'}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, liquidParticleColor: e.target.value };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-5 h-5 bg-transparent border-0 cursor-pointer rounded-sm"
                          />
                          <input
                            type="text"
                            value={effect.liquidParticleColor !== undefined ? effect.liquidParticleColor : '#6366f1'}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, liquidParticleColor: e.target.value };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="bg-transparent border-0 text-[9px] font-mono text-zinc-300 w-full focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Particle Size' : 'Размер точек'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{(effect.liquidParticleSize !== undefined ? effect.liquidParticleSize : 1.0).toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.1"
                          value={effect.liquidParticleSize !== undefined ? effect.liquidParticleSize : 1.0}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, liquidParticleSize: parseFloat(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Wave Speed' : 'Скорость волн'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{(effect.liquidWaveSpeed !== undefined ? effect.liquidWaveSpeed : 0.85).toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.05"
                          max="1.5"
                          step="0.05"
                          value={effect.liquidWaveSpeed !== undefined ? effect.liquidWaveSpeed : 0.85}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, liquidWaveSpeed: parseFloat(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Frequency' : 'Частота волн'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{(effect.liquidWaveFrequency !== undefined ? effect.liquidWaveFrequency : 0.07).toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.01"
                          max="0.50"
                          step="0.01"
                          value={effect.liquidWaveFrequency !== undefined ? effect.liquidWaveFrequency : 0.07}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, liquidWaveFrequency: parseFloat(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Amplitude' : 'Высота волн'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{(effect.liquidWaveAmplitude !== undefined ? effect.liquidWaveAmplitude : 45)}</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="150"
                          step="5"
                          value={effect.liquidWaveAmplitude !== undefined ? effect.liquidWaveAmplitude : 45}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, liquidWaveAmplitude: parseInt(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Camera Height' : 'Высота камеры'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{effect.liquidCameraHeight !== undefined ? effect.liquidCameraHeight : 100}</span>
                        </div>
                        <input
                          type="range"
                          min="100"
                          max="1000"
                          step="25"
                          value={effect.liquidCameraHeight !== undefined ? effect.liquidCameraHeight : 100}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, liquidCameraHeight: parseInt(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Grid Width (X)' : 'Точек по шир. (X)'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{effect.liquidGridX !== undefined ? effect.liquidGridX : 250}</span>
                        </div>
                        <input
                          type="range"
                          min="30"
                          max="250"
                          step="5"
                          value={effect.liquidGridX !== undefined ? effect.liquidGridX : 250}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, liquidGridX: parseInt(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Grid Depth (Y)' : 'Точек по глуб. (Y)'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{effect.liquidGridY !== undefined ? effect.liquidGridY : 100}</span>
                        </div>
                        <input
                          type="range"
                          min="30"
                          max="250"
                          step="5"
                          value={effect.liquidGridY !== undefined ? effect.liquidGridY : 100}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, liquidGridY: parseInt(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'BG Gradient Start' : 'Фон градиент нач.'}</span>
                        <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 p-1 rounded">
                          <input
                            type="color"
                            value={effect.liquidBgGradientStart !== undefined ? effect.liquidBgGradientStart : '#03000a'}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, liquidBgGradientStart: e.target.value };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-5 h-5 bg-transparent border-0 cursor-pointer rounded-sm"
                          />
                          <input
                            type="text"
                            value={effect.liquidBgGradientStart !== undefined ? effect.liquidBgGradientStart : '#03000a'}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, liquidBgGradientStart: e.target.value };
                              updateActiveSettings({ ...activeSettings, ...{ effects: updated } });
                            }}
                            className="bg-transparent border-0 text-[9px] font-mono text-zinc-300 w-full focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'BG Gradient End' : 'Фон градиент кон.'}</span>
                        <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 p-1 rounded">
                          <input
                            type="color"
                            value={effect.liquidBgGradientEnd !== undefined ? effect.liquidBgGradientEnd : '#0b031e'}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, liquidBgGradientEnd: e.target.value };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-5 h-5 bg-transparent border-0 cursor-pointer rounded-sm"
                          />
                          <input
                            type="text"
                            value={effect.liquidBgGradientEnd !== undefined ? effect.liquidBgGradientEnd : '#0b031e'}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, liquidBgGradientEnd: e.target.value };
                              updateActiveSettings({ ...activeSettings, ...{ effects: updated } });
                            }}
                            className="bg-transparent border-0 text-[9px] font-mono text-zinc-300 w-full focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Camera Distance' : 'Дистанция камеры'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{effect.liquidCameraDepth !== undefined ? effect.liquidCameraDepth : 800}</span>
                        </div>
                        <input
                          type="range"
                          min="300"
                          max="2000"
                          step="50"
                          value={effect.liquidCameraDepth !== undefined ? effect.liquidCameraDepth : 800}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, liquidCameraDepth: parseInt(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Separation' : 'Расстояние точек'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{effect.liquidSeparation !== undefined ? effect.liquidSeparation : 15}</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="40"
                          step="1"
                          value={effect.liquidSeparation !== undefined ? effect.liquidSeparation : 15}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, liquidSeparation: parseInt(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : effect.type === 'origami-ribbon' ? (
                <div className="space-y-4">
                  {/* 16:9 Live Preview Window */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? '📺 Real-time Preview (16:9)' : '📺 Превью в реальном времени (16:9)'}
                    </span>
                    <div className="w-full aspect-video rounded-lg relative overflow-hidden bg-black border border-zinc-800">
                      <OrigamiLine
                        settings={{
                          complexity: effect.origamiComplexity !== undefined ? effect.origamiComplexity : 3,
                          size: effect.origamiSize !== undefined ? effect.origamiSize : 0.3,
                          fillHue: effect.origamiFillHue !== undefined ? effect.origamiFillHue : 220,
                          colorSpeed: effect.origamiColorSpeed !== undefined ? effect.origamiColorSpeed : 1.0,
                          animationSpeed: effect.origamiAnimationSpeed !== undefined ? effect.origamiAnimationSpeed : 1.0,
                          amplitude: effect.origamiAmplitude !== undefined ? effect.origamiAmplitude : 80,
                          heightOffset: effect.origamiHeightOffset !== undefined ? effect.origamiHeightOffset : 0,
                          scale: effect.origamiScale !== undefined ? effect.origamiScale : 1.0,
                          rotation: effect.origamiRotation !== undefined ? effect.origamiRotation : 0,
                          wireframe: effect.origamiWireframe !== undefined ? effect.origamiWireframe : false,
                          shimmer: effect.origamiShimmer !== undefined ? effect.origamiShimmer : true,
                          bgGradientStart: effect.origamiBgGradientStart !== undefined ? effect.origamiBgGradientStart : '#03000a',
                          bgGradientEnd: effect.origamiBgGradientEnd !== undefined ? effect.origamiBgGradientEnd : '#0b031e',
                          opacity: effect.opacity !== undefined ? effect.opacity : 100,
                        }}
                      />
                      {/* Interactive Touch Floating badge */}
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[8px] rounded border border-zinc-850 text-emerald-400 font-mono tracking-wider uppercase">
                        {lang === 'en' ? 'Active Sandbox' : 'Песочница'}
                      </div>
                    </div>
                  </div>

                  {/* Row 1: Shape & Opacity */}
                  <div className="grid grid-cols-2 gap-2">
                    {renderEffectTypeSelect(effect, idx)}

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Opacity' : 'Прозрачность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effect.opacity}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, opacity: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Settings Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-zinc-850">
                    {/* Complexity & Ribbon Width */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Complexity' : 'Сложность (Складки)'}</span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.origamiComplexity !== undefined ? effect.origamiComplexity : 3}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={effect.origamiComplexity !== undefined ? effect.origamiComplexity : 3}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, origamiComplexity: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Ribbon Width' : 'Ширина ленты'}</span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.origamiSize !== undefined ? effect.origamiSize : 0.3}</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="1.0"
                        step="0.05"
                        value={effect.origamiSize !== undefined ? effect.origamiSize : 0.3}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, origamiSize: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    {/* Wave Amplitude & Color Hue */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Base Hue' : 'Базовый тон'}</span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.origamiFillHue !== undefined ? effect.origamiFillHue : 220}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="1"
                        value={effect.origamiFillHue !== undefined ? effect.origamiFillHue : 220}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, origamiFillHue: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Wave Amplitude' : 'Амплитуда волны'}</span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.origamiAmplitude !== undefined ? effect.origamiAmplitude : 80}px</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="300"
                        step="5"
                        value={effect.origamiAmplitude !== undefined ? effect.origamiAmplitude : 80}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, origamiAmplitude: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    {/* Animation Speed & Color Shimmer Speed */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Motion Speed' : 'Скорость волн'}</span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.origamiAnimationSpeed !== undefined ? effect.origamiAnimationSpeed : 1.0}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="5.0"
                        step="0.1"
                        value={effect.origamiAnimationSpeed !== undefined ? effect.origamiAnimationSpeed : 1.0}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, origamiAnimationSpeed: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Color Cycle Speed' : 'Скорость цвета'}</span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.origamiColorSpeed !== undefined ? effect.origamiColorSpeed : 1.0}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="5.0"
                        step="0.1"
                        value={effect.origamiColorSpeed !== undefined ? effect.origamiColorSpeed : 1.0}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, origamiColorSpeed: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    {/* Scale & Height Offset */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Height Offset' : 'Смещение по высоте'}</span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.origamiHeightOffset !== undefined ? effect.origamiHeightOffset : 0}px</span>
                      </div>
                      <input
                        type="range"
                        min="-200"
                        max="200"
                        step="5"
                        value={effect.origamiHeightOffset !== undefined ? effect.origamiHeightOffset : 0}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, origamiHeightOffset: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Scale' : 'Масштаб'}</span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.origamiScale !== undefined ? effect.origamiScale : 1.0}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="3.0"
                        step="0.1"
                        value={effect.origamiScale !== undefined ? effect.origamiScale : 1.0}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, origamiScale: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    {/* Rotation */}
                    <div className="space-y-1 col-span-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Rotation Angle' : 'Угол поворота'}</span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.origamiRotation !== undefined ? effect.origamiRotation : 0}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="5"
                        value={effect.origamiRotation !== undefined ? effect.origamiRotation : 0}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, origamiRotation: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    {/* Checkboxes: Wireframe & Shimmer */}
                    <div className="flex items-center space-x-2 bg-zinc-950 p-1.5 rounded border border-zinc-900 col-span-2">
                      <input
                        type="checkbox"
                        id={`origamiWireframe-${idx}`}
                        checked={effect.origamiWireframe !== undefined ? effect.origamiWireframe : false}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, origamiWireframe: e.target.checked };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="rounded border-zinc-850 text-emerald-500 focus:ring-emerald-500 w-3.5 h-3.5 bg-zinc-900"
                      />
                      <label htmlFor={`origamiWireframe-${idx}`} className="text-[9px] font-bold text-zinc-400 uppercase cursor-pointer select-none">
                        {lang === 'en' ? 'Wireframe Mode (Triangles)' : 'Режим сетки (Треугольники)'}
                      </label>
                    </div>

                    <div className="flex items-center space-x-2 bg-zinc-950 p-1.5 rounded border border-zinc-900 col-span-2">
                      <input
                        type="checkbox"
                        id={`origamiShimmer-${idx}`}
                        checked={effect.origamiShimmer !== undefined ? effect.origamiShimmer : true}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, origamiShimmer: e.target.checked };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="rounded border-zinc-850 text-emerald-500 focus:ring-emerald-500 w-3.5 h-3.5 bg-zinc-900"
                      />
                      <label htmlFor={`origamiShimmer-${idx}`} className="text-[9px] font-bold text-zinc-400 uppercase cursor-pointer select-none">
                        {lang === 'en' ? 'Shimmer & Shading' : 'Световые блики и тени'}
                      </label>
                    </div>

                    {/* Gradient Background Colors */}
                    <div className="space-y-1 col-span-2">
                      <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Background Gradient' : 'Фоновый градиент'}</span>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Start Color */}
                        <div className="flex items-center space-x-1 bg-zinc-900/50 p-1 rounded border border-zinc-850">
                          <input
                            type="color"
                            value={effect.origamiBgGradientStart !== undefined ? effect.origamiBgGradientStart : '#03000a'}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, origamiBgGradientStart: e.target.value };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-5 h-5 bg-transparent border-0 cursor-pointer rounded-sm"
                          />
                          <input
                            type="text"
                            value={effect.origamiBgGradientStart !== undefined ? effect.origamiBgGradientStart : '#03000a'}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, origamiBgGradientStart: e.target.value };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="bg-transparent border-0 text-[9px] font-mono text-zinc-300 w-full focus:outline-none"
                          />
                        </div>

                        {/* End Color */}
                        <div className="flex items-center space-x-1 bg-zinc-900/50 p-1 rounded border border-zinc-850">
                          <input
                            type="color"
                            value={effect.origamiBgGradientEnd !== undefined ? effect.origamiBgGradientEnd : '#0b031e'}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, origamiBgGradientEnd: e.target.value };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-5 h-5 bg-transparent border-0 cursor-pointer rounded-sm"
                          />
                          <input
                            type="text"
                            value={effect.origamiBgGradientEnd !== undefined ? effect.origamiBgGradientEnd : '#0b031e'}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, origamiBgGradientEnd: e.target.value };
                              updateActiveSettings({ ...activeSettings, ...{ effects: updated } });
                            }}
                            className="bg-transparent border-0 text-[9px] font-mono text-zinc-300 w-full focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : effect.type === 'stars' ? (
                <div className="space-y-4">
                  {/* 16:9 Live Preview Window */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? '📺 Real-time Preview (16:9)' : '📺 Превью в реальном времени (16:9)'}
                    </span>
                    <div className="w-full aspect-video rounded-lg relative overflow-hidden bg-black border border-zinc-800">
                      <ShimmeringStars
                        settings={{
                          starCount: effect.starCount !== undefined ? effect.starCount : 1000,
                          starSize: effect.starSize !== undefined ? effect.starSize : 1.4,
                          sizeRandomness: effect.starSizeRandomness !== undefined ? effect.starSizeRandomness : 100,
                          baseColor: effect.color || '#2b00ff',
                          colorRandomness: effect.starColorRandomness !== undefined ? effect.starColorRandomness : 65,
                          brightness: effect.starBrightness !== undefined ? effect.starBrightness : 1.0,
                          brightnessRandomness: effect.starBrightnessRandomness !== undefined ? effect.starBrightnessRandomness : 100,
                          glow: effect.starGlow !== undefined ? effect.starGlow : 15,
                          glowRandomness: effect.starGlowRandomness !== undefined ? effect.starGlowRandomness : 100,
                          speed: effect.speed !== undefined ? effect.speed : 1.4,
                          rotationSpeedX: effect.starRotationSpeedX !== undefined ? effect.starRotationSpeedX : 0.20,
                          rotationSpeedY: effect.starRotationSpeedY !== undefined ? effect.starRotationSpeedY : 0.50,
                          rotationSpeedZ: effect.starRotationSpeedZ !== undefined ? effect.starRotationSpeedZ : -0.40,
                          fov: effect.starFov !== undefined ? effect.starFov : 590,
                          mouseRotation: !!effect.starMouseRotation,
                        }}
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[8px] rounded border border-zinc-850 text-emerald-400 font-mono tracking-wider uppercase">
                        {lang === 'en' ? 'Stars Sandbox' : 'Звездная песочница'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {renderEffectTypeSelect(effect, idx)}

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Opacity' : 'Прозрачность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effect.opacity}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, opacity: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Count' : 'Количество'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.starCount || 1000}</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="3000"
                        value={effect.starCount || 1000}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, starCount: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Size' : 'Размер'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.starSize || 1.4}</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="5"
                        step="0.1"
                        value={effect.starSize || 1.4}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, starSize: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Twinkle Speed' : 'Скорость мерцания'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.speed || 1.4}</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="10"
                        step="0.1"
                        value={effect.speed || 1.4}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, speed: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'FOV' : 'Поле зрения'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.starFov || 590}</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="2000"
                        value={effect.starFov || 590}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, starFov: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-zinc-500 block">Rot X</span>
                      <input
                        type="range"
                        min="-2"
                        max="2"
                        step="0.05"
                        value={effect.starRotationSpeedX || 0}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, starRotationSpeedX: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-zinc-500 block">Rot Y</span>
                      <input
                        type="range"
                        min="-2"
                        max="2"
                        step="0.05"
                        value={effect.starRotationSpeedY || 0}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, starRotationSpeedY: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-zinc-500 block">Rot Z</span>
                      <input
                        type="range"
                        min="-2"
                        max="2"
                        step="0.05"
                        value={effect.starRotationSpeedZ || 0}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, starRotationSpeedZ: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-[10px] text-zinc-400">{lang === 'en' ? 'Mouse Rotation' : 'Вращение мышью'}</span>
                    <input
                      type="checkbox"
                      checked={!!effect.starMouseRotation}
                      onChange={(e) => {
                        const updated = [...activeSettings.effects];
                        updated[idx] = { ...effect, starMouseRotation: e.target.checked };
                        updateActiveSettings({ ...activeSettings, effects: updated });
                      }}
                      className="w-4 h-4 text-emerald-600 bg-zinc-950 rounded cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Star Color' : 'Цвет звезд'}</span>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={effect.color || '#2b00ff'}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, color: e.target.value };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-8 h-8 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden"
                      />
                      <input
                        type="text"
                        value={effect.color || '#2b00ff'}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, color: e.target.value };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded text-[10px] p-1 text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const updated = activeSettings.effects.filter((_: any, i: number) => i !== idx);
                      updateActiveSettings({ ...activeSettings, effects: updated });
                    }}
                    className="w-full py-1.5 text-[10px] text-rose-400 hover:text-white hover:bg-rose-500/20 rounded border border-rose-500/30 transition-all uppercase font-bold tracking-wider"
                  >
                    {lang === 'en' ? 'Remove Effect' : 'Удалить эффект'}
                  </button>
                </div>
              ) : effect.type === 'webgl-metaballs' ? (
                <div className="space-y-4">
                  {/* 16:9 Live Preview Window */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? '📺 Real-time Preview (16:9)' : '📺 Превью в реальном времени (16:9)'}
                    </span>
                    <div className="w-full aspect-video rounded-lg relative overflow-hidden bg-black border border-zinc-800">
                      <WebGLMetaballs
                        settings={{
                          numMetaballs: effect.numMetaballs !== undefined ? effect.numMetaballs : 15,
                          minRadius: effect.minRadius !== undefined ? effect.minRadius : 60,
                          maxRadius: effect.maxRadius !== undefined ? effect.maxRadius : 160,
                          speed: effect.speed !== undefined ? effect.speed : 1.2,
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
                          colorOpacity: effect.opacity,
                          metaballsBgColor: effect.metaballsBgColor || '#000000',
                          metaballsUseBgImage: !!effect.metaballsUseBgImage,
                          metaballsBgImage: effect.metaballsBgImage || '',
                          opacity: effect.opacity !== undefined ? effect.opacity : 100,
                        }}
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[8px] rounded border border-zinc-850 text-emerald-400 font-mono tracking-wider uppercase">
                        {lang === 'en' ? 'Metaballs Sandbox' : 'Метасферы'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {renderEffectTypeSelect(effect, idx)}

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Opacity' : 'Прозрачность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effect.opacity}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, opacity: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Spheres Count' : 'Кол-во сфер'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.numMetaballs !== undefined ? effect.numMetaballs : 15}</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="40"
                        value={effect.numMetaballs !== undefined ? effect.numMetaballs : 15}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, numMetaballs: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Movement Speed' : 'Скорость'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.speed !== undefined ? effect.speed : 1.2}</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="5.0"
                        step="0.1"
                        value={effect.speed !== undefined ? effect.speed : 1.2}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, speed: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Min Radius' : 'Мин. радиус'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.minRadius !== undefined ? effect.minRadius : 60}</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="200"
                        value={effect.minRadius !== undefined ? effect.minRadius : 60}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          const newMin = parseInt(e.target.value);
                          const curMax = effect.maxRadius !== undefined ? effect.maxRadius : 160;
                          updated[idx] = { ...effect, minRadius: newMin, maxRadius: Math.max(newMin + 10, curMax) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Max Radius' : 'Макс. радиус'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.maxRadius !== undefined ? effect.maxRadius : 160}</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="300"
                        value={effect.maxRadius !== undefined ? effect.maxRadius : 160}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          const newMax = parseInt(e.target.value);
                          const curMin = effect.minRadius !== undefined ? effect.minRadius : 60;
                          updated[idx] = { ...effect, maxRadius: newMax, minRadius: Math.min(newMax - 10, curMin) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Fusion Threshold' : 'Порог слияния'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.glowRadius !== undefined ? effect.glowRadius : 2.2}</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="5.0"
                        step="0.1"
                        value={effect.glowRadius !== undefined ? effect.glowRadius : 2.2}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, glowRadius: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Edge Blur' : 'Размытие краев'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.blur !== undefined ? effect.blur : 0.12}</span>
                      </div>
                      <input
                        type="range"
                        min="0.01"
                        max="0.4"
                        step="0.01"
                        value={effect.blur !== undefined ? effect.blur : 0.12}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, blur: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Dual Color Selection */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 block">
                      {lang === 'en' ? 'Gradient Colors' : 'Цвета градиента'}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[7px] text-zinc-400 uppercase font-semibold block">{lang === 'en' ? 'Start Color' : 'Стартовый'}</span>
                        <div className="flex gap-1">
                          <input
                            type="color"
                            value={effect.color || '#4f46e5'}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              const endCol = effect.plasmaColors && effect.plasmaColors[1] ? effect.plasmaColors[1] : '#ec4899';
                              updated[idx] = { ...effect, color: e.target.value, plasmaColors: [e.target.value, endCol] };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-6 h-6 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                          />
                          <input
                            type="text"
                            value={(effect.color || '#4f46e5').toUpperCase()}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              const endCol = effect.plasmaColors && effect.plasmaColors[1] ? effect.plasmaColors[1] : '#ec4899';
                              updated[idx] = { ...effect, color: e.target.value, plasmaColors: [e.target.value, endCol] };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="bg-zinc-900 border border-zinc-800 rounded text-[9px] p-1 text-white focus:outline-none font-mono w-full"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[7px] text-zinc-400 uppercase font-semibold block">{lang === 'en' ? 'End Color' : 'Конечный'}</span>
                        <div className="flex gap-1">
                          <input
                            type="color"
                            value={effect.plasmaColors && effect.plasmaColors[1] ? effect.plasmaColors[1] : '#ec4899'}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              const startCol = effect.color || '#4f46e5';
                              updated[idx] = { ...effect, plasmaColors: [startCol, e.target.value] };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-6 h-6 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                          />
                          <input
                            type="text"
                            value={(effect.plasmaColors && effect.plasmaColors[1] ? effect.plasmaColors[1] : '#ec4899').toUpperCase()}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              const startCol = effect.color || '#4f46e5';
                              updated[idx] = { ...effect, plasmaColors: [startCol, e.target.value] };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="bg-zinc-900 border border-zinc-800 rounded text-[9px] p-1 text-white focus:outline-none font-mono w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Outline settings */}
                  <div className="p-2.5 bg-zinc-900/60 rounded border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-zinc-400">{lang === 'en' ? 'Draw Outline Only' : 'Отрисовывать только контур'}</span>
                      <input
                        type="checkbox"
                        checked={!!effect.outline}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, outline: e.target.checked };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-4 h-4 text-emerald-600 bg-zinc-950 rounded cursor-pointer"
                      />
                    </div>

                    {effect.outline && (
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800/60">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Width' : 'Толщина'}</span>
                            <span className="text-[9px] font-mono text-zinc-400">{effect.outlineWidth !== undefined ? effect.outlineWidth : 0.015}</span>
                          </div>
                          <input
                            type="range"
                            min="0.002"
                            max="0.08"
                            step="0.001"
                            value={effect.outlineWidth !== undefined ? effect.outlineWidth : 0.015}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, outlineWidth: parseFloat(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-955 rounded appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[8px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Color' : 'Цвет контура'}</span>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={effect.outlineColor || '#ffffff'}
                              onChange={(e) => {
                                const updated = [...activeSettings.effects];
                                updated[idx] = { ...effect, outlineColor: e.target.value };
                                updateActiveSettings({ ...activeSettings, effects: updated });
                              }}
                              className="w-6 h-6 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                            />
                            <input
                              type="text"
                              value={(effect.outlineColor || '#ffffff').toUpperCase()}
                              onChange={(e) => {
                                const updated = [...activeSettings.effects];
                                updated[idx] = { ...effect, outlineColor: e.target.value };
                                updateActiveSettings({ ...activeSettings, effects: updated });
                              }}
                              className="bg-zinc-950 border border-zinc-800 rounded text-[9px] p-1 text-white focus:outline-none font-mono w-full"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fills & Interaction checkboxes */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between p-2 bg-zinc-900 rounded border border-zinc-800">
                      <span className="text-[10px] text-zinc-400">{lang === 'en' ? 'Solid Fill' : 'Заливка цветом'}</span>
                      <input
                        type="checkbox"
                        checked={effect.fill !== undefined ? !!effect.fill : true}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, fill: e.target.checked };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-4 h-4 text-emerald-600 bg-zinc-950 rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-2 bg-zinc-900 rounded border border-zinc-800">
                      <span className="text-[10px] text-zinc-400">{lang === 'en' ? 'Mouse Follow' : 'Курсор-метабол'}</span>
                      <input
                        type="checkbox"
                        checked={effect.mouseInteraction !== undefined ? !!effect.mouseInteraction : true}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, mouseInteraction: e.target.checked };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-4 h-4 text-emerald-600 bg-zinc-950 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Shadow settings */}
                  <div className="p-2.5 bg-zinc-900/60 rounded border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-zinc-400">{lang === 'en' ? 'Organic 2D Shadow' : 'Объемная 2D тень'}</span>
                      <input
                        type="checkbox"
                        checked={effect.shadow !== undefined ? !!effect.shadow : true}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, shadow: e.target.checked };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-4 h-4 text-emerald-600 bg-zinc-950 rounded cursor-pointer"
                      />
                    </div>

                    {(effect.shadow !== undefined ? !!effect.shadow : true) && (
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800/60">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Blur' : 'Размытие'}</span>
                            <span className="text-[9px] font-mono text-zinc-400">{effect.shadowBlur !== undefined ? effect.shadowBlur : 15}</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="40"
                            value={effect.shadowBlur !== undefined ? effect.shadowBlur : 15}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, shadowBlur: parseInt(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-955 rounded appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Opacity' : 'Плотность'}</span>
                            <span className="text-[9px] font-mono text-zinc-400">{effect.shadowOpacity !== undefined ? effect.shadowOpacity : 40}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={effect.shadowOpacity !== undefined ? effect.shadowOpacity : 40}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, shadowOpacity: parseInt(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-955 rounded appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Angle' : 'Угол'}</span>
                            <span className="text-[9px] font-mono text-zinc-400">{effect.shadowAngle !== undefined ? effect.shadowAngle : 45}°</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={effect.shadowAngle !== undefined ? effect.shadowAngle : 45}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, shadowAngle: parseInt(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-955 rounded appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Distance' : 'Смещение'}</span>
                            <span className="text-[9px] font-mono text-zinc-400">{effect.shadowDistance !== undefined ? effect.shadowDistance : 8}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="25"
                            value={effect.shadowDistance !== undefined ? effect.shadowDistance : 8}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, shadowDistance: parseInt(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-955 rounded appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ball Image & Background Settings */}
                  <div className="p-2.5 bg-zinc-900/60 rounded border border-zinc-800 space-y-3">
                    <span className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">
                      {lang === 'en' ? 'Image & Background Settings' : 'Изображение шаров и фон'}
                    </span>

                    {/* Checkbox: Use Background Image */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400">
                        {lang === 'en' ? 'Use Image inside Balls' : 'Использовать картинку в шарах'}
                      </span>
                      <input
                        type="checkbox"
                        checked={!!effect.metaballsUseBgImage}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, metaballsUseBgImage: e.target.checked };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-4 h-4 text-emerald-600 bg-zinc-950 rounded cursor-pointer"
                      />
                    </div>

                    {/* Background Color Picker */}
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-zinc-500 block">
                        {lang === 'en' ? 'Background Color' : 'Выбор цвета фона'}
                      </span>
                      <div className="flex gap-1">
                        <input
                          type="color"
                          value={effect.metaballsBgColor || '#000000'}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, metaballsBgColor: e.target.value };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-6 h-6 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={(effect.metaballsBgColor || '#000000').toUpperCase()}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, metaballsBgColor: e.target.value };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="bg-zinc-950 border border-zinc-800 rounded text-[9px] p-1 text-white focus:outline-none font-mono w-full"
                        />
                      </div>
                    </div>

                    {/* Image Upload Input (Only shown if checked) */}
                    {!!effect.metaballsUseBgImage && (
                      <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                        <span className="text-[8px] uppercase font-bold text-zinc-500 block">
                          {lang === 'en' ? 'Upload Image for Balls' : 'Загрузить картинку для шаров'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const b64 = await compressImage(file, 1200, 1200);
                                const updated = [...activeSettings.effects];
                                updated[idx] = { ...effect, metaballsBgImage: b64 };
                                updateActiveSettings({ ...activeSettings, effects: updated });
                              } catch (err) {
                                console.error('Image compression error', err);
                              }
                            }
                          }}
                          className="w-full text-[10px] text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[9px] file:bg-zinc-800 file:text-white cursor-pointer"
                        />
                        
                        {effect.metaballsBgImage && (
                          <div className="flex items-center justify-between p-1.5 bg-zinc-950/40 rounded border border-zinc-850">
                            <div 
                              className="w-8 h-8 rounded border border-zinc-800 bg-cover bg-center" 
                              style={{ backgroundImage: `url("${effect.metaballsBgImage}")` }} 
                            />
                            <button 
                              onClick={() => {
                                const updated = [...activeSettings.effects];
                                updated[idx] = { ...effect, metaballsBgImage: '' };
                                updateActiveSettings({ ...activeSettings, effects: updated });
                              }} 
                              className="text-[9px] text-rose-400 hover:text-rose-300 font-medium hover:underline cursor-pointer"
                            >
                              {lang === 'en' ? 'Remove' : 'Удалить'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      const updated = activeSettings.effects.filter((_: any, i: number) => i !== idx);
                      updateActiveSettings({ ...activeSettings, effects: updated });
                    }}
                    className="w-full py-1.5 text-[10px] text-rose-400 hover:text-white hover:bg-rose-500/20 rounded border border-rose-500/30 transition-all uppercase font-bold tracking-wider"
                  >
                    {lang === 'en' ? 'Remove Effect' : 'Удалить эффект'}
                  </button>
                </div>
              ) : effect.type === 'cyber-lines' ? (
                <div className="space-y-4">
                  {/* 16:9 Live Preview Window */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? '📺 Real-time Preview (16:9)' : '📺 Превью в реальном времени (16:9)'}
                    </span>
                    <div className="w-full aspect-video rounded-lg relative overflow-hidden bg-black border border-zinc-800">
                      <CyberLines
                        settings={{
                          count: effect.count !== undefined ? effect.count : 45,
                          minWidth: effect.minWidth !== undefined ? effect.minWidth : 1.5,
                          maxWidth: effect.maxWidth !== undefined ? effect.maxWidth : 6,
                          minSpeed: effect.minSpeed !== undefined ? effect.minSpeed : 15,
                          maxSpeed: effect.maxSpeed !== undefined ? effect.maxSpeed : 60,
                          hue: effect.hue !== undefined ? effect.hue : 195,
                          hueDif: effect.hueDif !== undefined ? effect.hueDif : 35,
                          glow: effect.glow !== undefined ? effect.glow : 12,
                          clickToChangeColor: effect.clickToChangeColor !== undefined ? effect.clickToChangeColor : true,
                        }}
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[8px] rounded border border-zinc-850 text-emerald-400 font-mono tracking-wider uppercase">
                        {lang === 'en' ? 'Cyber Lines Sandbox' : 'Киберлинии'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {renderEffectTypeSelect(effect, idx)}

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Opacity' : 'Прозрачность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effect.opacity}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, opacity: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Lines Count' : 'Кол-во линий'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.count !== undefined ? effect.count : 45}</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="150"
                        value={effect.count !== undefined ? effect.count : 45}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, count: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Neon Glow' : 'Свечение'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.glow !== undefined ? effect.glow : 12}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        value={effect.glow !== undefined ? effect.glow : 12}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, glow: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Min Width' : 'Мин. ширина'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.minWidth !== undefined ? effect.minWidth : 1.5}px</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="10"
                        step="0.5"
                        value={effect.minWidth !== undefined ? effect.minWidth : 1.5}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          const newMin = parseFloat(e.target.value);
                          const curMax = effect.maxWidth !== undefined ? effect.maxWidth : 6;
                          updated[idx] = { ...effect, minWidth: newMin, maxWidth: Math.max(newMin + 0.5, curMax) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Max Width' : 'Макс. ширина'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.maxWidth !== undefined ? effect.maxWidth : 6}px</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="25"
                        step="0.5"
                        value={effect.maxWidth !== undefined ? effect.maxWidth : 6}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          const newMax = parseFloat(e.target.value);
                          const curMin = effect.minWidth !== undefined ? effect.minWidth : 1.5;
                          updated[idx] = { ...effect, maxWidth: newMax, minWidth: Math.min(newMax - 0.5, curMin) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Min Speed' : 'Мин. скорость'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.minSpeed !== undefined ? effect.minSpeed : 15}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={effect.minSpeed !== undefined ? effect.minSpeed : 15}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          const newMin = parseInt(e.target.value);
                          const curMax = effect.maxSpeed !== undefined ? effect.maxSpeed : 60;
                          updated[idx] = { ...effect, minSpeed: newMin, maxSpeed: Math.max(newMin + 5, curMax) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Max Speed' : 'Макс. скорость'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.maxSpeed !== undefined ? effect.maxSpeed : 60}</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="250"
                        value={effect.maxSpeed !== undefined ? effect.maxSpeed : 60}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          const newMax = parseInt(e.target.value);
                          const curMin = effect.minSpeed !== undefined ? effect.minSpeed : 15;
                          updated[idx] = { ...effect, maxSpeed: newMax, minSpeed: Math.min(newMax - 5, curMin) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Base Hue' : 'Базовый тон'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400" style={{ color: `hsl(${effect.hue !== undefined ? effect.hue : 195}, 80%, 60%)` }}>
                          {effect.hue !== undefined ? effect.hue : 195}°
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={effect.hue !== undefined ? effect.hue : 195}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, hue: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Hue Variation' : 'Разброс тона'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">±{effect.hueDif !== undefined ? effect.hueDif : 35}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="120"
                        value={effect.hueDif !== undefined ? effect.hueDif : 35}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, hueDif: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-[10px] text-zinc-400">{lang === 'en' ? 'Click to Change Color' : 'Клик меняет цвет'}</span>
                    <input
                      type="checkbox"
                      checked={effect.clickToChangeColor !== undefined ? !!effect.clickToChangeColor : true}
                      onChange={(e) => {
                        const updated = [...activeSettings.effects];
                        updated[idx] = { ...effect, clickToChangeColor: e.target.checked };
                        updateActiveSettings({ ...activeSettings, effects: updated });
                      }}
                      className="w-4 h-4 text-emerald-600 bg-zinc-950 rounded cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={() => {
                      const updated = activeSettings.effects.filter((_: any, i: number) => i !== idx);
                      updateActiveSettings({ ...activeSettings, effects: updated });
                    }}
                    className="w-full py-1.5 text-[10px] text-rose-400 hover:text-white hover:bg-rose-500/20 rounded border border-rose-500/30 transition-all uppercase font-bold tracking-wider"
                  >
                    {lang === 'en' ? 'Remove Effect' : 'Удалить эффект'}
                  </button>
                </div>
              ) : effect.type === 'noise-topography' ? (
                <div className="space-y-4">
                  {/* 16:9 Live Preview Window */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? '📺 Real-time Preview (16:9)' : '📺 Превью в реальном времени (16:9)'}
                    </span>
                    <div className="w-full aspect-video rounded-lg relative overflow-hidden bg-black border border-zinc-800">
                      <NoiseTopography
                        settings={{
                          scale: effect.scale !== undefined ? effect.scale : 1.8,
                          speed: effect.speed !== undefined ? effect.speed : 0.4,
                          colors: effect.topoColors || [
                            { color: '#09090b', opacity: 100 },
                            { color: '#18181b', opacity: 100, shadow: true, shadowBlur: 12, shadowOpacity: 50, shadowDistance: 6, shadowAngle: 60 },
                            { color: '#27272a', opacity: 100, shadow: true, shadowBlur: 12, shadowOpacity: 50, shadowDistance: 6, shadowAngle: 60 },
                            { color: '#3f3f46', opacity: 100, shadow: true, shadowBlur: 12, shadowOpacity: 50, shadowDistance: 6, shadowAngle: 60 },
                            { color: '#52525b', opacity: 100, shadow: true, shadowBlur: 12, shadowOpacity: 50, shadowDistance: 6, shadowAngle: 60 }
                          ]
                        }}
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[8px] rounded border border-zinc-850 text-emerald-400 font-mono tracking-wider uppercase">
                        {lang === 'en' ? 'Noise Topography Sandbox' : 'Рельефная топография'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {renderEffectTypeSelect(effect, idx)}

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Opacity' : 'Прозрачность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effect.opacity}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, opacity: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Scale' : 'Масштаб'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.scale !== undefined ? effect.scale : 1.5}</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="4"
                        step="0.1"
                        value={effect.scale !== undefined ? effect.scale : 1.5}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, scale: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Drift Speed' : 'Скорость дрейфа'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.speed !== undefined ? effect.speed : 0.5}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={effect.speed !== undefined ? effect.speed : 0.5}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, speed: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Layers control */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                        {lang === 'en' ? 'Terrain Layers' : 'Слои рельефа'}
                      </span>
                      <button
                        onClick={() => {
                          const currentLayers = effect.topoColors || [];
                          if (currentLayers.length >= 20) return;
                          const lastLayer = currentLayers[currentLayers.length - 1] || { color: '#6b7280', opacity: 100 };
                          const newLayer = {
                            color: lastLayer.color,
                            opacity: 100,
                            shadow: true,
                            shadowBlur: 10,
                            shadowOpacity: 40,
                            shadowDistance: 5,
                            shadowAngle: 45,
                            blur: 0,
                            image: ''
                          };
                          const updatedLayers = [...currentLayers, newLayer];
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, topoColors: updatedLayers };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        disabled={(effect.topoColors || []).length >= 20}
                        className="px-2 py-1 text-[9px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-800/40 rounded transition-all flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        + {lang === 'en' ? 'Add Layer' : 'Добавить слой'}
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                      {(effect.topoColors || []).map((layer: any, lIdx: number) => {
                        const handleImageUpload = (file: File) => {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const base64 = reader.result as string;
                            const updated = [...activeSettings.effects];
                            const updatedLayers = [...(effect.topoColors || [])];
                            updatedLayers[lIdx] = { ...layer, image: base64 };
                            updated[idx] = { ...effect, topoColors: updatedLayers };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          };
                          reader.readAsDataURL(file);
                        };

                        return (
                          <div
                            key={lIdx}
                            className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05),_2px_2px_8px_rgba(0,0,0,0.5)] space-y-3 transition-all"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] text-zinc-400 font-mono font-bold">Layer #{lIdx + 1}</span>
                              {(effect.topoColors || []).length > 1 && (
                                <button
                                  onClick={() => {
                                    const updatedLayers = (effect.topoColors || []).filter((_: any, li: number) => li !== lIdx);
                                    const updated = [...activeSettings.effects];
                                    updated[idx] = { ...effect, topoColors: updatedLayers };
                                    updateActiveSettings({ ...activeSettings, effects: updated });
                                  }}
                                  className="text-[9px] font-medium text-rose-400 hover:text-rose-300 transition-colors"
                                >
                                  {lang === 'en' ? 'Delete' : 'Удалить'}
                                </button>
                              )}
                            </div>

                            {/* Color & Opacity Row */}
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <span className="text-[9px] text-zinc-500 font-medium block">
                                  {lang === 'en' ? 'Color' : 'Цвет'}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <div className="relative w-6 h-6 rounded-md overflow-hidden border border-zinc-700 shadow-[inset_-1px_-1px_1px_rgba(255,255,255,0.1),_1px_1px_2px_rgba(0,0,0,0.4)]">
                                    <input
                                      type="color"
                                      value={layer.color || '#ffffff'}
                                      onChange={(e) => {
                                        const updatedLayers = [...(effect.topoColors || [])];
                                        updatedLayers[lIdx] = { ...layer, color: e.target.value };
                                        const updated = [...activeSettings.effects];
                                        updated[idx] = { ...effect, topoColors: updatedLayers };
                                        updateActiveSettings({ ...activeSettings, effects: updated });
                                      }}
                                      className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    value={layer.color || '#ffffff'}
                                    onChange={(e) => {
                                      const updatedLayers = [...(effect.topoColors || [])];
                                      updatedLayers[lIdx] = { ...layer, color: e.target.value };
                                      const updated = [...activeSettings.effects];
                                      updated[idx] = { ...effect, topoColors: updatedLayers };
                                      updateActiveSettings({ ...activeSettings, effects: updated });
                                    }}
                                    className="w-full bg-zinc-950 border border-zinc-800 text-[9px] rounded-md px-1.5 py-1 text-center font-mono text-white focus:outline-none focus:border-zinc-700"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] text-zinc-500 font-medium">
                                    {lang === 'en' ? 'Opacity' : 'Прозрачность'}
                                  </span>
                                  <span className="text-[9px] text-zinc-400 font-mono">{layer.opacity ?? 100}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={layer.opacity ?? 100}
                                  onChange={(e) => {
                                    const updatedLayers = [...(effect.topoColors || [])];
                                    updatedLayers[lIdx] = { ...layer, opacity: parseInt(e.target.value) };
                                    const updated = [...activeSettings.effects];
                                    updated[idx] = { ...effect, topoColors: updatedLayers };
                                    updateActiveSettings({ ...activeSettings, effects: updated });
                                  }}
                                  className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                              </div>
                            </div>

                            {/* Image Fill Section */}
                            <div className="space-y-1.5 p-2 rounded-lg bg-zinc-950/40 border border-zinc-800/40">
                              <span className="text-[9px] text-zinc-500 font-bold block">
                                {lang === 'en' ? 'Texture Fill' : 'Заполнение текстурой'}
                              </span>
                              {layer.image ? (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={layer.image}
                                        alt="layer tex"
                                        className="w-10 h-10 object-cover rounded border border-zinc-700"
                                      />
                                      <span className="text-[9px] text-zinc-400 font-mono">
                                        {lang === 'en' ? 'Texture active' : 'Текстура активна'}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => {
                                        const updatedLayers = [...(effect.topoColors || [])];
                                        updatedLayers[lIdx] = { ...layer, image: '', blur: 0 };
                                        const updated = [...activeSettings.effects];
                                        updated[idx] = { ...effect, topoColors: updatedLayers };
                                        updateActiveSettings({ ...activeSettings, effects: updated });
                                      }}
                                      className="px-2 py-0.5 text-[8px] bg-rose-950/40 border border-rose-800/30 hover:bg-rose-950 text-rose-400 rounded transition-colors"
                                    >
                                      {lang === 'en' ? 'Reset' : 'Сбросить'}
                                    </button>
                                  </div>

                                  {/* Blur Slider */}
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[9px] text-zinc-500 font-medium">
                                        {lang === 'en' ? 'Blur' : 'Размытие'}
                                      </span>
                                      <span className="text-[9px] text-zinc-400 font-mono">{layer.blur ?? 0}px</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="0"
                                      max="50"
                                      value={layer.blur ?? 0}
                                      onChange={(e) => {
                                        const updatedLayers = [...(effect.topoColors || [])];
                                        updatedLayers[lIdx] = { ...layer, blur: parseInt(e.target.value) };
                                        const updated = [...activeSettings.effects];
                                        updated[idx] = { ...effect, topoColors: updatedLayers };
                                        updateActiveSettings({ ...activeSettings, effects: updated });
                                      }}
                                      className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    if (file && file.type.startsWith('image/')) {
                                      handleImageUpload(file);
                                    }
                                  }}
                                  className="border border-dashed border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40 rounded-lg p-3 text-center cursor-pointer transition-colors relative"
                                >
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleImageUpload(file);
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                  <span className="text-[9px] text-zinc-400 block font-medium">
                                    {lang === 'en' ? 'Click or Drag Image' : 'Нажмите или перетащите фото'}
                                  </span>
                                  <span className="text-[8px] text-zinc-600 block mt-0.5">
                                    PNG, JPG, SVG
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Shadow Settings */}
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={!!layer.shadow}
                                  onChange={(e) => {
                                    const updatedLayers = [...(effect.topoColors || [])];
                                    updatedLayers[lIdx] = { ...layer, shadow: e.target.checked };
                                    const updated = [...activeSettings.effects];
                                    updated[idx] = { ...effect, topoColors: updatedLayers };
                                    updateActiveSettings({ ...activeSettings, effects: updated });
                                  }}
                                  className="w-3.5 h-3.5 bg-zinc-950 text-emerald-600 border-zinc-800 rounded cursor-pointer accent-emerald-500"
                                />
                                <span className="text-[9px] font-bold text-zinc-400">
                                  {lang === 'en' ? 'Layer Shadow' : 'Тень слоя'}
                                </span>
                              </label>

                              {layer.shadow && (
                                <div className="p-2.5 rounded-lg bg-zinc-950/30 border border-zinc-800/40 grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[8px] text-zinc-500 font-medium">Blur</span>
                                      <span className="text-[8px] text-zinc-400 font-mono">{layer.shadowBlur ?? 10}</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="0"
                                      max="50"
                                      value={layer.shadowBlur ?? 10}
                                      onChange={(e) => {
                                        const updatedLayers = [...(effect.topoColors || [])];
                                        updatedLayers[lIdx] = { ...layer, shadowBlur: parseInt(e.target.value) };
                                        const updated = [...activeSettings.effects];
                                        updated[idx] = { ...effect, topoColors: updatedLayers };
                                        updateActiveSettings({ ...activeSettings, effects: updated });
                                      }}
                                      className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[8px] text-zinc-500 font-medium">Distance</span>
                                      <span className="text-[8px] text-zinc-400 font-mono">{layer.shadowDistance ?? 5}</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="0"
                                      max="30"
                                      value={layer.shadowDistance ?? 5}
                                      onChange={(e) => {
                                        const updatedLayers = [...(effect.topoColors || [])];
                                        updatedLayers[lIdx] = { ...layer, shadowDistance: parseInt(e.target.value) };
                                        const updated = [...activeSettings.effects];
                                        updated[idx] = { ...effect, topoColors: updatedLayers };
                                        updateActiveSettings({ ...activeSettings, effects: updated });
                                      }}
                                      className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[8px] text-zinc-500 font-medium">Angle</span>
                                      <span className="text-[8px] text-zinc-400 font-mono">{layer.shadowAngle ?? 45}°</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="0"
                                      max="360"
                                      value={layer.shadowAngle ?? 45}
                                      onChange={(e) => {
                                        const updatedLayers = [...(effect.topoColors || [])];
                                        updatedLayers[lIdx] = { ...layer, shadowAngle: parseInt(e.target.value) };
                                        const updated = [...activeSettings.effects];
                                        updated[idx] = { ...effect, topoColors: updatedLayers };
                                        updateActiveSettings({ ...activeSettings, effects: updated });
                                      }}
                                      className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[8px] text-zinc-500 font-medium">Opacity</span>
                                      <span className="text-[8px] text-zinc-400 font-mono">{layer.shadowOpacity ?? 40}%</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={layer.shadowOpacity ?? 40}
                                      onChange={(e) => {
                                        const updatedLayers = [...(effect.topoColors || [])];
                                        updatedLayers[lIdx] = { ...layer, shadowOpacity: parseInt(e.target.value) };
                                        const updated = [...activeSettings.effects];
                                        updated[idx] = { ...effect, topoColors: updatedLayers };
                                        updateActiveSettings({ ...activeSettings, effects: updated });
                                      }}
                                      className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const updated = activeSettings.effects.filter((_: any, i: number) => i !== idx);
                      updateActiveSettings({ ...activeSettings, effects: updated });
                    }}
                    className="w-full py-1.5 text-[10px] text-rose-400 hover:text-white hover:bg-rose-500/20 rounded border border-rose-500/30 transition-all uppercase font-bold tracking-wider"
                  >
                    {lang === 'en' ? 'Remove Effect' : 'Удалить эффект'}
                  </button>
                </div>
              ) : effect.type === 'neon-stream' ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? '📺 Real-time Preview (16:9)' : '📺 Превью в реальном времени (16:9)'}
                    </span>
                    <div className="w-full aspect-video rounded-lg relative overflow-hidden bg-black border border-zinc-800">
                      <NeonStream
                        settings={{
                          density: effect.neonDensity !== undefined ? effect.neonDensity : 150,
                          speed: effect.neonSpeed !== undefined ? effect.neonSpeed : 5,
                          lineWidth: effect.neonLineWidth !== undefined ? effect.neonLineWidth : 2,
                          glowRadius: effect.neonGlowRadius !== undefined ? effect.neonGlowRadius : 15,
                          flickerIntensity: effect.neonFlickerIntensity !== undefined ? effect.neonFlickerIntensity : 0.3,
                          colorSpeed: effect.neonColorSpeed !== undefined ? effect.neonColorSpeed : 1,
                          opacity: effect.opacity,
                        }}
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[8px] rounded border border-zinc-850 text-emerald-400 font-mono tracking-wider uppercase">
                        {lang === 'en' ? 'Neon Sandbox' : 'Неоновая песочница'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {renderEffectTypeSelect(effect, idx)}

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Opacity' : 'Прозрачность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effect.opacity}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, opacity: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Density' : 'Плотность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.neonDensity || 150}</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="500"
                        value={effect.neonDensity || 150}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, neonDensity: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Speed' : 'Скорость'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.neonSpeed || 5}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={effect.neonSpeed || 5}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, neonSpeed: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Line Width' : 'Толщина'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.neonLineWidth || 2}</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="10"
                        step="0.5"
                        value={effect.neonLineWidth || 2}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, neonLineWidth: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Glow Radius' : 'Свечение'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.neonGlowRadius || 15}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={effect.neonGlowRadius || 15}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, neonGlowRadius: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Flicker' : 'Мерцание'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.neonFlickerIntensity || 0.3}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={effect.neonFlickerIntensity || 0.3}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, neonFlickerIntensity: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Color Speed' : 'Скорость цвета'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.neonColorSpeed || 1}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.2"
                        value={effect.neonColorSpeed || 1}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, neonColorSpeed: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              ) : effect.type === 'webgl-polylines' ? (
                <div className="space-y-4">
                  {/* 16:9 Live Preview Window */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? '📺 Real-time Preview (16:9)' : '📺 Превью в реальном времени (16:9)'}
                    </span>
                    <div className="w-full aspect-video rounded-lg relative overflow-hidden bg-black border border-zinc-800">
                      <WebGLPolylines
                        settings={{
                          nx: effect.polylineNx !== undefined ? effect.polylineNx : 18,
                          ny: effect.polylineNy !== undefined ? effect.polylineNy : 120,
                          angle: effect.polylineAngle !== undefined ? effect.polylineAngle : 32,
                          colorScheme: effect.polylineColorScheme || 'default',
                          darken: effect.polylineDarken !== undefined ? effect.polylineDarken : 0.4,
                          thickness: effect.polylineThickness !== undefined ? effect.polylineThickness : 1.0,
                          speed: effect.speed !== undefined ? effect.speed : 0.25,
                          opacity: effect.opacity !== undefined ? effect.opacity : 100,
                        }}
                      />
                      {/* Interactive Touch Floating badge */}
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[8px] rounded border border-zinc-850 text-emerald-400 font-mono tracking-wider uppercase">
                        {lang === 'en' ? 'Active Sandbox' : 'Песочница'}
                      </div>
                    </div>
                  </div>

                  {/* Row 1: Shape & Opacity */}
                  <div className="grid grid-cols-2 gap-2">
                    {renderEffectTypeSelect(effect, idx)}

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Opacity' : 'Прозрачность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effect.opacity}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, opacity: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Settings Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-zinc-850">
                    {/* Columns Count (NX) & Rows Count (NY) */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Lines Count (NX)' : 'Число линий (NX)'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.polylineNx !== undefined ? effect.polylineNx : 18}</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="100"
                        step="1"
                        value={effect.polylineNx !== undefined ? effect.polylineNx : 18}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, polylineNx: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Points count (NY)' : 'Точек в линии (NY)'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.polylineNy !== undefined ? effect.polylineNy : 120}</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="300"
                        step="5"
                        value={effect.polylineNy !== undefined ? effect.polylineNy : 120}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, polylineNy: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    {/* Angle (Угол наклона) & Thickness (Толщина линий) */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Rotation Angle' : 'Угол наклона'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.polylineAngle !== undefined ? effect.polylineAngle : 32}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="5"
                        value={effect.polylineAngle !== undefined ? effect.polylineAngle : 32}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, polylineAngle: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Line Thickness' : 'Толщина линий'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.polylineThickness !== undefined ? effect.polylineThickness : 1.0}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="5.0"
                        step="0.1"
                        value={effect.polylineThickness !== undefined ? effect.polylineThickness : 1.0}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, polylineThickness: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    {/* Speed (Скорость) & Darken (Затемнение) */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Animation Speed' : 'Скорость волн'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.speed !== undefined ? effect.speed : 0.25}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.01"
                        max="2.0"
                        step="0.01"
                        value={effect.speed !== undefined ? effect.speed : 0.25}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, speed: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Darken Intensity' : 'Затемнение краёв'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.polylineDarken !== undefined ? effect.polylineDarken : 0.4}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="1.5"
                        step="0.05"
                        value={effect.polylineDarken !== undefined ? effect.polylineDarken : 0.4}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, polylineDarken: parseFloat(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    {/* Palette Selector (Схема цветов) */}
                    <div className="space-y-1 col-span-2">
                      <span className="text-[8px] uppercase font-bold text-zinc-500 block mb-0.5">
                        {lang === 'en' ? 'Color Palette' : 'Цветовая палитра'}
                      </span>
                      <select
                        value={effect.polylineColorScheme || 'default'}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, polylineColorScheme: e.target.value as any };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full bg-zinc-900 border border-zinc-800 text-[10px] rounded p-1 text-white focus:outline-none cursor-pointer"
                      >
                        <option value="default">🌈 {lang === 'en' ? 'Multicolor Rainbow' : 'Разноцветная Радуга'}</option>
                        <option value="ocean">🌊 {lang === 'en' ? 'Ocean Breeze' : 'Морской бриз'}</option>
                        <option value="sunset">🌅 {lang === 'en' ? 'Sunset Glow' : 'Закатный свет'}</option>
                        <option value="forest">🌲 {lang === 'en' ? 'Forest Moss' : 'Лесной мох'}</option>
                        <option value="neon">⚡ {lang === 'en' ? 'Neon Pulse' : 'Неоновый пульс'}</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : effect.type === 'flat-waves' ? (
                <div className="space-y-4">
                  {/* 16:9 Live Preview Window */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? '📺 Real-time Preview (16:9)' : '📺 Превью в реальном времени (16:9)'}
                    </span>
                    <div className="w-full aspect-video rounded-lg relative overflow-hidden bg-black border border-zinc-800">
                      <FlatWaves
                        settings={{
                          speed: effect.speed !== undefined ? effect.speed : 0.25,
                          amplitude: effect.amplitude !== undefined ? effect.amplitude : 0.6,
                          wavelength: effect.wavelength !== undefined ? effect.wavelength : 0.2,
                          jitter: effect.jitter !== undefined ? effect.jitter : 0,
                          shininess: effect.shininess !== undefined ? effect.shininess : 148,
                          zoom: effect.zoom !== undefined ? effect.zoom : 0.45,
                          topDown: effect.topDown !== undefined ? effect.topDown : true,
                          rotationX: effect.rotationX !== undefined ? effect.rotationX : 0,
                          rotationY: effect.rotationY !== undefined ? effect.rotationY : -40,
                          posY: effect.posY !== undefined ? effect.posY : 90,
                          color: effect.color || (theme === 'dark' ? '#0561c9' : '#38bdf8'),
                          environmentReflection: !!effect.environmentReflection,
                          opacity: effect.opacity,
                        }}
                      />
                      {/* Interactive Touch Floating badge */}
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[8px] rounded border border-zinc-850 text-amber-400 font-mono tracking-wider uppercase">
                        {lang === 'en' ? 'Active Sandbox' : 'Песочница'}
                      </div>
                    </div>
                  </div>

                  {/* Controls Row 1: Type & Opacity */}
                  <div className="grid grid-cols-2 gap-2">
                    {renderEffectTypeSelect(effect, idx)}

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Opacity' : 'Прозрачность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effect.opacity}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, opacity: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  {/* 3D Wave Specific Controls */}
                  <div className="space-y-3 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-900">
                    <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block border-b border-zinc-900 pb-1">🔮 {lang === 'en' ? '3D Low-Poly Waves Options' : 'Параметры 3D Волн'}</span>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Wavelength' : 'Длина волны'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{effect.wavelength !== undefined ? effect.wavelength : 0.4}</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="2.0"
                          step="0.05"
                          value={effect.wavelength !== undefined ? effect.wavelength : 0.4}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, wavelength: parseFloat(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Polygon Jitter' : 'Искажение сетки'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{effect.jitter !== undefined ? effect.jitter : 0.70}</span>
                        </div>
                        <input
                          type="range"
                          min="0.0"
                          max="1.5"
                          step="0.05"
                          value={effect.jitter !== undefined ? effect.jitter : 0.70}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, jitter: parseFloat(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Shininess' : 'Глянцевость'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{effect.shininess !== undefined ? effect.shininess : 25}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="200"
                          step="1"
                          value={effect.shininess !== undefined ? effect.shininess : 25}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, shininess: parseInt(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Camera Zoom' : 'Приближение'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{effect.zoom !== undefined ? effect.zoom : 0.5}</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="2.0"
                          step="0.05"
                          value={effect.zoom !== undefined ? effect.zoom : 0.5}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, zoom: parseFloat(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">Rotation X</span>
                          <span className="text-[9px] font-mono text-zinc-400">{effect.rotationX !== undefined ? effect.rotationX : 0}°</span>
                        </div>
                        <input
                          type="range"
                          min="-90"
                          max="90"
                          step="5"
                          value={effect.rotationX !== undefined ? effect.rotationX : 0}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, rotationX: parseInt(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">Rotation Y</span>
                          <span className="text-[9px] font-mono text-zinc-400">{effect.rotationY !== undefined ? effect.rotationY : 20}°</span>
                        </div>
                        <input
                          type="range"
                          min="-90"
                          max="90"
                          step="5"
                          value={effect.rotationY !== undefined ? effect.rotationY : 20}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, rotationY: parseInt(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Plane Height Y' : 'Высота плоскости Y'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{effect.posY !== undefined ? effect.posY : 50}</span>
                        </div>
                        <input
                          type="range"
                          min="-100"
                          max="150"
                          step="5"
                          value={effect.posY !== undefined ? effect.posY : 50}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, posY: parseInt(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>

                      <div className="space-y-1">
                         <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Amplitude' : 'Амплитуда'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{effect.amplitude !== undefined ? effect.amplitude : 0.8}</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="3.0"
                          step="0.05"
                          value={effect.amplitude !== undefined ? effect.amplitude : 0.8}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, amplitude: parseFloat(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Speed' : 'Скорость'}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{effect.speed}x</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.05"
                          value={effect.speed}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, speed: parseFloat(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>

                      <div className="space-y-1 flex flex-col justify-end pb-1">
                        <label className="flex items-center gap-2 cursor-pointer text-[10px] text-zinc-400 select-none">
                          <input
                            type="checkbox"
                            checked={effect.topDown !== undefined ? effect.topDown : true}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, topDown: e.target.checked };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-3.5 h-3.5 bg-zinc-900 border border-zinc-800 rounded text-amber-500 cursor-pointer animate-none"
                          />
                          <span>{lang === 'en' ? 'Top-Down Camera' : 'Камера сверху'}</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1 border-t border-zinc-900/50">
                      <div className="space-y-1">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Polygon Color' : 'Цвет полигонов'}</span>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={effect.color || '#0561c9'}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, color: e.target.value };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-6 bg-zinc-900 border border-zinc-800 rounded p-0.5 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 16:9 Live Preview Window */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? '📺 Real-time Preview (16:9)' : '📺 Превью в реальном времени (16:9)'}
                    </span>
                    <div className="w-full aspect-video rounded-lg relative overflow-hidden bg-black border border-zinc-800">
                      <BackgroundEffects effects={[effect]} />
                      {/* Interactive Touch Floating badge */}
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[8px] rounded border border-zinc-850 text-emerald-400 font-mono tracking-wider uppercase">
                        {lang === 'en' ? 'Legacy Sandbox' : 'Песочница'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {renderEffectTypeSelect(effect, idx)}

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Opacity' : 'Прозрачность'}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{effect.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effect.opacity}
                        onChange={(e) => {
                          const updated = [...activeSettings.effects];
                          updated[idx] = { ...effect, opacity: parseInt(e.target.value) };
                          updateActiveSettings({ ...activeSettings, effects: updated });
                        }}
                        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {effect.type === 'chroma-lab' ? (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[8px] font-bold text-zinc-500 uppercase">
                          <span>{lang === 'en' ? 'Base Hue' : 'Базовый оттенок'}</span>
                          <span className="font-mono text-zinc-400">{effect.hue !== undefined ? effect.hue : 280}°</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={effect.hue !== undefined ? effect.hue : 280}
                          onChange={(e) => {
                            const updated = [...activeSettings.effects];
                            updated[idx] = { ...effect, hue: parseInt(e.target.value) };
                            updateActiveSettings({ ...activeSettings, effects: updated });
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Seed' : 'Сид (Случайность)'}</span>
                            <button 
                              onClick={() => {
                                const updated = [...activeSettings.effects];
                                updated[idx] = { ...effect, seed: Math.random() * 1000 };
                                updateActiveSettings({ ...activeSettings, effects: updated });
                              }}
                              className="text-[8px] text-emerald-500 hover:text-emerald-400 font-bold uppercase transition-colors"
                            >
                              🎲 {lang === 'en' ? 'Randomize' : 'Случайно'}
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="0"
                              max="1000"
                              value={effect.seed}
                              onChange={(e) => {
                                const updated = [...activeSettings.effects];
                                updated[idx] = { ...effect, seed: parseInt(e.target.value) };
                                updateActiveSettings({ ...activeSettings, effects: updated });
                              }}
                              className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-zinc-600"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[8px] uppercase font-bold text-zinc-500">Position</span>
                          <select
                            value={effect.position}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, position: e.target.value as any };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full bg-zinc-900 border border-zinc-800 text-[10px] rounded p-1 text-white focus:outline-none cursor-pointer"
                          >
                            <option value="bottom">⚓ Bottom Side</option>
                            <option value="top">☁️ Top Side</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>

                  {effect.type !== 'chroma-lab' && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] uppercase font-bold text-zinc-500">Size / Height</span>
                            <span className="text-[9px] font-mono text-zinc-400">{effect.height}%</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="100"
                            value={effect.height}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, height: parseInt(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] uppercase font-bold text-zinc-500">Blur</span>
                            <span className="text-[9px] font-mono text-zinc-400">{effect.blur || 0}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="40"
                            value={effect.blur || 0}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, blur: parseInt(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Amplitude' : 'Амплитуда'}</span>
                            <span className="text-[9px] font-mono text-zinc-400">
                              {effect.amplitude !== undefined ? effect.amplitude : 8}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="60"
                            step="1"
                            value={effect.amplitude !== undefined ? effect.amplitude : 8}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, amplitude: parseFloat(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] uppercase font-bold text-zinc-500">{lang === 'en' ? 'Speed' : 'Скорость'}</span>
                            <span className="text-[9px] font-mono text-zinc-400">{effect.speed}x</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.5"
                            value={effect.speed}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, speed: parseFloat(e.target.value) };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-2 border-t border-zinc-900 pt-2.5">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] uppercase font-bold text-zinc-500">Spectrum</span>
                            <input
                              type="checkbox"
                              checked={effect.isSpectrum || false}
                              onChange={(e) => {
                                const updated = [...activeSettings.effects];
                                updated[idx] = { 
                                  ...effect, 
                                  isSpectrum: e.target.checked,
                                  spectrumColors: effect.spectrumColors || [effect.color, '#ff0000', '#00ff00']
                                };
                                updateActiveSettings({ ...activeSettings, effects: updated });
                              }}
                              className="w-3 h-3 text-emerald-600 bg-zinc-900 rounded border-zinc-800"
                            />
                          </div>
                          {effect.isSpectrum && (
                            <div className="flex gap-1">
                              {(effect.spectrumColors || [effect.color, '#ff0000', '#00ff00']).map((c, cIdx) => (
                                <input
                                  key={cIdx}
                                  type="color"
                                  value={c}
                                  onChange={(e) => {
                                    const newCols = [...(effect.spectrumColors || [effect.color, '#ff0000', '#00ff00'])];
                                    newCols[cIdx] = e.target.value;
                                    const updated = [...activeSettings.effects];
                                    updated[idx] = { ...effect, spectrumColors: newCols };
                                    updateActiveSettings({ ...activeSettings, effects: updated });
                                  }}
                                  className="w-full h-4 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden"
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] uppercase font-bold text-zinc-500">Glare</span>
                            <input
                              type="checkbox"
                              checked={effect.isGlare || false}
                              onChange={(e) => {
                                const updated = [...activeSettings.effects];
                                updated[idx] = { ...effect, isGlare: e.target.checked };
                                updateActiveSettings({ ...activeSettings, effects: updated });
                              }}
                              className="w-3 h-3 text-emerald-600 bg-zinc-900 rounded border-zinc-800"
                            />
                          </div>
                          {effect.isGlare && (
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[7px] text-zinc-500 uppercase font-mono">
                                <span>Interval</span>
                                <span>{effect.glareInterval || 3}s</span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={effect.glareInterval || 3}
                                onChange={(e) => {
                                  const updated = [...activeSettings.effects];
                                  updated[idx] = { ...effect, glareInterval: parseInt(e.target.value) };
                                  updateActiveSettings({ ...activeSettings, effects: updated });
                                }}
                                className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-zinc-500"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1 mt-1">
                        <span className="text-[8px] uppercase font-bold text-zinc-500">
                          {lang === 'en' ? 'Layer Color' : 'Цвет слоя'}
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={effect.color}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, color: e.target.value };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="w-6 h-6 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden"
                          />
                          <input
                            type="text"
                            value={effect.color}
                            onChange={(e) => {
                              const updated = [...activeSettings.effects];
                              updated[idx] = { ...effect, color: e.target.value };
                              updateActiveSettings({ ...activeSettings, effects: updated });
                            }}
                            className="bg-zinc-900 border border-zinc-800 text-[10px] rounded px-1.5 py-1 text-zinc-400 w-full font-mono focus:outline-none"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  </div>
                )}

              {/* Удалить эффект / Delete effect button */}
              <div className="pt-2.5 border-t border-zinc-900/50 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const filtered = activeSettings.effects.filter((_: any, i: number) => i !== idx);
                    updateActiveSettings({ ...activeSettings, effects: filtered });
                  }}
                  className="px-2.5 py-1.5 text-[9px] font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md border border-rose-500/15 hover:border-rose-500/30 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {lang === 'en' ? 'Delete Effect' : 'Удалить эффект'}
                </button>
              </div>
            </div>
          ))}

          {(!activeSettings.effects || activeSettings.effects.length === 0) && (
            <div className="text-[10px] text-zinc-600 text-center py-4 border border-zinc-900 border-dashed rounded-lg">
              No active visual effects
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
