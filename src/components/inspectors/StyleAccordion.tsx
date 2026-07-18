import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Block, FramePadding, FrameRadius } from '../../types';
import { compressImage } from '../../utils';
import { useDev } from '../../context/DevContext';

const getValidHexColor = (colorStr: string | undefined, fallback: string = '#ffffff'): string => {
  if (!colorStr) return fallback;
  const clean = colorStr.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(clean)) {
    return clean;
  }
  if (/^#[0-9a-fA-F]{3}$/.test(clean)) {
    return '#' + clean[1] + clean[1] + clean[2] + clean[2] + clean[3] + clean[3];
  }
  return fallback;
};

interface StyleAccordionProps {
  focusedBlock: Block;
  lang: 'en' | 'ru';
  updateFocusedBlock: (updateFn: (b: Block) => Partial<Block>) => void;
}

export const StyleAccordion: React.FC<StyleAccordionProps> = ({
  focusedBlock,
  lang,
  updateFocusedBlock,
}) => {
  const { planType } = useDev();
  const handlePremiumClick = (e: React.MouseEvent) => {
    // Unlocked for all plans
  };

  const [isStylesExpanded, setIsStylesExpanded] = React.useState(false);
  const [isFillExpanded, setIsFillExpanded] = React.useState(false);
  const [isEffectsExpanded, setIsEffectsExpanded] = React.useState(false);
  const [isTextExpanded, setIsTextExpanded] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const stylesRef = React.useRef<HTMLDivElement>(null);
  const fillRef = React.useRef<HTMLDivElement>(null);
  const effectsRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLDivElement>(null);

  const [stylesHeight, setStylesHeight] = React.useState(0);
  const [fillHeight, setFillHeight] = React.useState(0);
  const [effectsHeight, setEffectsHeight] = React.useState(0);
  const [textHeight, setTextHeight] = React.useState(0);

  React.useEffect(() => {
    const updateHeights = () => {
      if (stylesRef.current) {
        const h = stylesRef.current.offsetHeight;
        if (h) setStylesHeight(prev => prev !== h ? h : prev);
      }
      if (fillRef.current) {
        const h = fillRef.current.offsetHeight;
        if (h) setFillHeight(prev => prev !== h ? h : prev);
      }
      if (effectsRef.current) {
        const h = effectsRef.current.offsetHeight;
        if (h) setEffectsHeight(prev => prev !== h ? h : prev);
      }
      if (textRef.current) {
        const h = textRef.current.offsetHeight;
        if (h) setTextHeight(prev => prev !== h ? h : prev);
      }
    };

    updateHeights();
    const observers = [stylesRef, fillRef, effectsRef, textRef].map((ref, idx) => {
      if (!ref.current) return null;
      const obs = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const h = entry.contentRect.height;
          if (h) {
            if (idx === 0) setStylesHeight(prev => prev !== h ? h : prev);
            if (idx === 1) setFillHeight(prev => prev !== h ? h : prev);
            if (idx === 2) setEffectsHeight(prev => prev !== h ? h : prev);
            if (idx === 3) setTextHeight(prev => prev !== h ? h : prev);
          }
        }
      });
      obs.observe(ref.current);
      return obs;
    });

    return () => {
      observers.forEach(obs => obs?.disconnect());
    };
  }, [focusedBlock]);

  const getTransitionDuration = (height: number) => {
    if (!height) return 700;
    // Constant speed of opening: scale duration proportionally with height (2x slower)
    return Math.max(440, Math.round(height * 1.4));
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      try {
        const file = e.target.files[0];
        const base64 = await compressImage(file, 800, 800);
        updateFocusedBlock(() => ({ fillImage: base64 }));
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    }
  };

  const triggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="pt-3.5 border-t border-zinc-900/50">
      {/* SECTION 1: LAYOUT & SPACING */}
      <button
        type="button"
        onClick={() => setIsStylesExpanded(!isStylesExpanded)}
        className="w-full flex items-center justify-between text-[11px] font-sans text-stone-950 font-bold transition-all py-2 px-2.5 bg-orange-500 hover:bg-orange-400 active:scale-[0.99] rounded-xl cursor-pointer shadow-sm shadow-orange-500/10 border-none"
      >
        <span className="font-bold uppercase tracking-wider">📦 {lang === 'en' ? 'Layout & Spacing' : 'Отступы и Форма'}</span>
        <span style={{ transform: isStylesExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} className="text-stone-950 font-extrabold">▼</span>
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateRows: isStylesExpanded ? '1fr' : '0fr',
          transition: `grid-template-rows ${getTransitionDuration(stylesHeight)}ms cubic-bezier(0.25, 1, 0.5, 1), opacity ${getTransitionDuration(stylesHeight)}ms cubic-bezier(0.25, 1, 0.5, 1)`,
          opacity: isStylesExpanded ? 1 : 0,
          pointerEvents: isStylesExpanded ? 'auto' : 'none'
        }}
      >
        <div style={{ minHeight: 0 }} className="overflow-hidden">
          <div ref={stylesRef} className="pt-2">
            <div className="p-3 bg-zinc-900/30 rounded-xl border border-zinc-900 space-y-3.5">
              <div>
                <label className="block text-[8px] uppercase font-bold text-zinc-500 tracking-wider mb-1.5">{lang === 'en' ? 'Internal Padding' : 'Внутренние отступы'}</label>
                <div className="grid grid-cols-4 gap-1">
                  {['none', 'small', 'medium', 'large'].map((p) => {
                    const label = p === 'none' 
                      ? (lang === 'en' ? 'None' : 'Ноль') 
                      : p === 'small' 
                        ? (lang === 'en' ? 'Small' : 'Малый') 
                        : p === 'medium' 
                          ? (lang === 'en' ? 'Medium' : 'Средний') 
                          : (lang === 'en' ? 'Large' : 'Большой');
                    return (
                      <button
                        key={p}
                        onClick={() => updateFocusedBlock(b => ({ padding: p as FramePadding }))}
                        className={`py-1 text-[9.5px] font-bold rounded border transition-colors cursor-pointer ${
                          focusedBlock.padding === p 
                            ? 'bg-white text-zinc-950 border-white' 
                            : 'bg-zinc-950 text-zinc-500 border-zinc-850 hover:text-zinc-350'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Full Width Option */}
              <div className="flex items-center justify-between pt-2.5 border-t border-zinc-850/40">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                  {lang === 'en' ? 'Full Width Card' : 'На всю ширину'}
                </span>
                <input
                  type="checkbox"
                  checked={focusedBlock.fullWidth === true}
                  onChange={(e) => updateFocusedBlock(b => {
                    const updates: Partial<Block> = { fullWidth: e.target.checked };
                    if (b.type === 'profile') {
                      updates.profileContent = {
                        ...(b.profileContent || { name: '', bio: '' }),
                        fullWidth: e.target.checked
                      } as any;
                    }
                    return updates;
                  })}
                  className="w-4 h-4 text-emerald-600 bg-zinc-950 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: FRAME BACKGROUND & BORDERS */}
      <button
        type="button"
        onClick={() => setIsFillExpanded(!isFillExpanded)}
        className="w-full flex items-center justify-between text-[11px] font-sans text-stone-950 font-bold transition-all py-2 px-2.5 bg-orange-500 hover:bg-orange-400 active:scale-[0.99] rounded-xl cursor-pointer shadow-sm shadow-orange-500/10 border-none mt-4"
      >
        <span className="font-bold uppercase tracking-wider">🌆 {lang === 'en' ? 'Background & Borders' : 'Заливка и Обводка'}</span>
        <span style={{ transform: isFillExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} className="text-stone-950 font-extrabold">▼</span>
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateRows: isFillExpanded ? '1fr' : '0fr',
          transition: `grid-template-rows ${getTransitionDuration(fillHeight)}ms cubic-bezier(0.25, 1, 0.5, 1), opacity ${getTransitionDuration(fillHeight)}ms cubic-bezier(0.25, 1, 0.5, 1)`,
          opacity: isFillExpanded ? 1 : 0,
          pointerEvents: isFillExpanded ? 'auto' : 'none'
        }}
      >
        <div style={{ minHeight: 0 }} className="overflow-hidden">
          <div ref={fillRef} className="pt-2">
            <div className="p-3 bg-zinc-900/30 rounded-xl border border-zinc-900 space-y-4">
                
                {/* Fill Type Selector */}
                <div className="flex bg-zinc-1050 p-1 rounded-lg border border-zinc-850">
                  {['color', 'image', 'gradient'].map((t) => (
                    <button
                      key={t}
                      onClick={() => updateFocusedBlock(b => ({ fillType: t as any }))}
                      className={`flex-1 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-all cursor-pointer ${
                        (focusedBlock.fillType || 'color') === t ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-400'
                      }`}
                    >
                      {t === 'color' ? (lang === 'en' ? 'Color' : 'Цвет') : t === 'image' ? (lang === 'en' ? 'Image' : 'Карта') : (lang === 'en' ? 'Gradient' : 'Град')}
                    </button>
                  ))}
                </div>

          {/* COLOR FILL SECTION */}
          {(focusedBlock.fillType === 'color' || !focusedBlock.fillType) && (
            <div className="space-y-1.5">
              <label className="block text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                {lang === 'en' ? 'Background Solid Color' : 'Сплошной цвет фона'}
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={focusedBlock.fillColor || '#18181b'}
                  onChange={(e) => updateFocusedBlock(b => ({ fillColor: e.target.value }))}
                  className="w-10 h-8 rounded border border-zinc-850 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                />
                <input
                  type="text"
                  value={(focusedBlock.fillColor || '#18181b').toUpperCase()}
                  onChange={(e) => updateFocusedBlock(b => ({ fillColor: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-850 text-[10px] text-zinc-300 rounded px-2.5 py-1.5 font-mono focus:outline-none focus:border-zinc-700 uppercase"
                />
              </div>
            </div>
          )}

          {/* IMAGE FILL SECTION */}
          {focusedBlock.fillType === 'image' && (
            <div className="space-y-2">
              <label className="block text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                {lang === 'en' ? 'Background Image' : 'Космический клип / Изображение'}
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageFileChange}
                accept="image/*"
                className="hidden"
              />

              {focusedBlock.fillImage ? (
                <div className="space-y-2">
                  <div className="aspect-video w-full rounded-lg border border-zinc-800 relative bg-zinc-950/40 flex items-center justify-center overflow-hidden">
                    <img 
                      src={focusedBlock.fillImage} 
                      alt="Block Bg" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-1.5 opacity-0 hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={triggerUpload}
                        className="p-1 px-2.5 bg-zinc-900 border border-zinc-700 text-[9px] font-bold rounded-md text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        {lang === 'en' ? 'Replace' : 'Заменить'}
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFocusedBlock(() => ({ fillImage: undefined }))}
                        className="p-1 px-2.5 bg-red-950/80 border border-red-800 text-[9px] font-bold rounded-md text-red-100 hover:bg-red-900 transition-colors cursor-pointer"
                      >
                        {lang === 'en' ? 'Remove' : 'Удалить'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={uploading}
                  onClick={triggerUpload}
                  className="w-full border border-dashed border-zinc-800 hover:border-zinc-500 bg-zinc-950/40 hover:bg-zinc-950/80 rounded-xl p-6 text-center space-y-1.5 transition-all text-xs font-medium cursor-pointer"
                >
                  <div className="mx-auto w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400">
                    📂
                  </div>
                  <div>
                    {uploading 
                      ? (lang === 'en' ? 'Compressing...' : 'Сжатие и загрузка...') 
                      : (lang === 'en' ? 'Upload Image from PC' : 'Загрузить картинку с устройства')
                    }
                  </div>
                  <div className="text-[9px] text-zinc-500 font-normal">
                    {lang === 'en' ? 'Format auto-compressed for rapid load' : 'Сжимается автоматически для быстрой загрузки'}
                  </div>
                </button>
              )}
            </div>
          )}

          {/* GRADIENT FILL SECTION */}
          {focusedBlock.fillType === 'gradient' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                  {lang === 'en' ? 'Gradient Preset' : 'Пресет градиента'}
                </label>
                <select
                  value={focusedBlock.fillGradientPreset || 'cosmic'}
                  onChange={(e) => updateFocusedBlock(b => ({ fillGradientPreset: e.target.value as any }))}
                  className="w-full bg-zinc-950 border border-zinc-850 text-[10px] rounded p-1.5 text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer"
                >
                  <option value="cosmic">🌌 {lang === 'en' ? 'Cosmic Space' : 'Стандартный космос'}</option>
                  <option value="sunset">🌅 {lang === 'en' ? 'Warm Sunset' : 'Теплый закат'}</option>
                  <option value="ocean">🌊 {lang === 'en' ? 'Abyssal Ocean' : 'Глубокий океан'}</option>
                  <option value="emerald">💚 {lang === 'en' ? 'Emerald Glow' : 'Изумрудный луч'}</option>
                  <option value="bubblegum">🌸 {lang === 'en' ? 'Bubblegum Dream' : 'Розовый туман'}</option>
                  <option value="fire">🔥 {lang === 'en' ? 'Solar Flare' : 'Солнечная вспышка'}</option>
                  <option value="custom">🎨 [ {lang === 'en' ? 'Custom Duel Colors' : 'Кастомный двухцветный'} ]</option>
                </select>
              </div>

              {/* Custom dual color inputs if preset === 'custom' */}
              {focusedBlock.fillGradientPreset === 'custom' && (
                <div className="space-y-2.5 p-2 bg-zinc-950/40 rounded-lg border border-zinc-900 animate-slide-up">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[7.5px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Start Color' : 'Начальный цвет'}</span>
                      <div className="flex gap-1 items-center bg-zinc-950 p-1.5 rounded border border-zinc-900">
                        <input
                          type="color"
                          value={focusedBlock.customGradientStart || '#4f46e5'}
                          onChange={(e) => updateFocusedBlock(() => ({ customGradientStart: e.target.value }))}
                          className="w-6 h-6 rounded border border-zinc-850 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={(focusedBlock.customGradientStart || '#4f46e5').toUpperCase()}
                          onChange={(e) => updateFocusedBlock(() => ({ customGradientStart: e.target.value }))}
                          className="w-full bg-transparent text-[8.5px] text-zinc-400 p-0 font-mono text-center focus:outline-none uppercase border-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[7.5px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'End Color' : 'Конечный цвет'}</span>
                      <div className="flex gap-1 items-center bg-zinc-950 p-1.5 rounded border border-zinc-900">
                        <input
                          type="color"
                          value={focusedBlock.customGradientEnd || '#db2777'}
                          onChange={(e) => updateFocusedBlock(() => ({ customGradientEnd: e.target.value }))}
                          className="w-6 h-6 rounded border border-zinc-850 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={(focusedBlock.customGradientEnd || '#db2777').toUpperCase()}
                          onChange={(e) => updateFocusedBlock(() => ({ customGradientEnd: e.target.value }))}
                          className="w-full bg-transparent text-[8.5px] text-zinc-400 p-0 font-mono text-center focus:outline-none uppercase border-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 uppercase">
                      <span>{lang === 'en' ? 'Gradient Angle' : 'Угол градиента'}</span>
                      <span className="font-mono text-zinc-400">{focusedBlock.customGradientAngle !== undefined ? focusedBlock.customGradientAngle : 135}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={focusedBlock.customGradientAngle !== undefined ? focusedBlock.customGradientAngle : 135}
                      onChange={(e) => updateFocusedBlock(() => ({ customGradientAngle: parseInt(e.target.value) }))}
                      className="w-full accent-white bg-zinc-950 h-1 rounded-sm cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Animated Shifting */}
              <div className="flex items-center justify-between py-1 bg-zinc-950/20 p-2 rounded-lg border border-zinc-900/40">
                <div className="flex flex-col animate-pulsate">
                  <span className="text-[10px] font-bold text-zinc-300">
                    {lang === 'en' ? '🎬 Animated Shifting' : '🎬 Плавное переливание'}
                  </span>
                  <span className="text-[8px] text-zinc-500">
                    {lang === 'en' ? 'Fluid gradient color flow motion' : 'Космическая динамика градиентов'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => updateFocusedBlock(b => ({ fillGradientAnimated: !b.fillGradientAnimated }))}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                    focusedBlock.fillGradientAnimated ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    focusedBlock.fillGradientAnimated ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          )}

          {/* OPACITY SLIDER */}
          <div className="space-y-1 pt-3.5 border-t border-zinc-900/60">
            <div className="flex justify-between items-center text-[8px] font-bold text-zinc-400 uppercase tracking-wider">
              <span>{lang === 'en' ? 'Background Opacity' : 'Прозрачность фона'}</span>
              <span className="font-mono text-emerald-400">{focusedBlock.bgOpacity !== undefined ? focusedBlock.bgOpacity : 100}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={focusedBlock.bgOpacity !== undefined ? focusedBlock.bgOpacity : 100}
              onChange={(e) => updateFocusedBlock(() => ({ bgOpacity: parseInt(e.target.value) }))}
              className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* CUSTOM FONT & ICON COLORS */}
          <div className="space-y-3 pt-3.5 border-t border-zinc-900/60">
            <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
              🎨 {lang === 'en' ? 'Fonts & Icons Color' : 'Цвета шрифта и иконок'}
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Font Color */}
              <div className="space-y-1.5 p-2 bg-zinc-950/20 rounded-lg border border-zinc-900/60">
                <span className="text-[8px] uppercase font-bold text-zinc-500 block">
                  {lang === 'en' ? 'Font Color' : 'Цвет шрифта'}
                </span>
                <div className="flex gap-1 items-center bg-zinc-950 p-1.5 rounded border border-zinc-900">
                  <input
                    type="color"
                    value={focusedBlock.customTextColor || '#ffffff'}
                    onChange={(e) => updateFocusedBlock(() => ({ customTextColor: e.target.value }))}
                    className="w-5 h-5 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={focusedBlock.customTextColor ? focusedBlock.customTextColor.toUpperCase() : ''}
                    placeholder={lang === 'en' ? 'Default' : 'По умолч.'}
                    onChange={(e) => updateFocusedBlock(() => ({ customTextColor: e.target.value || null as any }))}
                    className="w-full bg-transparent text-[8.5px] text-zinc-400 p-0 font-mono text-center focus:outline-none uppercase border-none"
                  />
                </div>
              </div>

              {/* Icon Color */}
              <div className="space-y-1.5 p-2 bg-zinc-950/20 rounded-lg border border-zinc-900/60">
                <span className="text-[8px] uppercase font-bold text-zinc-500 block">
                  {lang === 'en' ? 'Icon Color' : 'Цвет иконок'}
                </span>
                <div className="flex gap-1 items-center bg-zinc-950 p-1.5 rounded border border-zinc-900">
                  <input
                    type="color"
                    value={focusedBlock.customIconColor || '#ffffff'}
                    onChange={(e) => updateFocusedBlock(() => ({ customIconColor: e.target.value }))}
                    className="w-5 h-5 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={focusedBlock.customIconColor ? focusedBlock.customIconColor.toUpperCase() : ''}
                    placeholder={lang === 'en' ? 'Default' : 'По умолч.'}
                    onChange={(e) => updateFocusedBlock(() => ({ customIconColor: e.target.value || null as any }))}
                    className="w-full bg-transparent text-[8.5px] text-zinc-400 p-0 font-mono text-center focus:outline-none uppercase border-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BORDER CONFIGURATOR */}
          <div className="space-y-2 pt-3 border-t border-zinc-900/60">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                  {lang === 'en' ? 'Enable Frame Border' : 'Включить рамку (обводку)'}
                </span>
                <span className="text-[8px] text-zinc-600">
                  {lang === 'en' ? 'Toggle outline card border' : 'Сенсорная обводка граней блока'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => updateFocusedBlock(b => ({ hasBorder: !b.hasBorder }))}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                  focusedBlock.hasBorder ? 'bg-emerald-500' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  focusedBlock.hasBorder ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {focusedBlock.hasBorder && (
              <div className="space-y-2.5 p-2 bg-zinc-950/40 rounded-lg border border-zinc-900 animate-slide-up">
                {/* Border Style Selector */}
                <div className="space-y-1">
                  <span className="text-[7.5px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Border Style Type' : 'Тип обводки'}</span>
                  <select
                    value={focusedBlock.borderStyleType || 'solid'}
                    onChange={(e) => updateFocusedBlock(() => ({ borderStyleType: e.target.value as any }))}
                    className="w-full bg-zinc-950 border border-zinc-900 text-[10px] rounded p-1 text-zinc-300 focus:outline-none cursor-pointer"
                  >
                    <option value="solid">➖ {lang === 'en' ? 'Solid Line' : 'Сплошная линия (Solid)'}</option>
                    <option value="dashed">--- {lang === 'en' ? 'Dashed Line' : 'Штрих пунктир (Dashed)'}</option>
                    <option value="dotted">... {lang === 'en' ? 'Dotted Pixels' : 'Точечный пиксель (Dotted)'}</option>
                    <option value="double">== {lang === 'en' ? 'Double Line' : 'Двойная линия (Double)'}</option>
                  </select>
                </div>

                {/* Border Width and Color settings */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 uppercase">
                      <span>{lang === 'en' ? 'Border Width' : 'Толщина'};</span>
                      <span className="font-mono text-zinc-400">{focusedBlock.borderWidthValue || 1}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={focusedBlock.borderWidthValue || 1}
                      onChange={(e) => updateFocusedBlock(() => ({ borderWidthValue: parseInt(e.target.value) }))}
                      className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[7.5px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Border Color' : 'Цвет обводки'}</span>
                    <div className="flex gap-1 items-center bg-zinc-950 p-1 rounded border border-zinc-900">
                      <input
                        type="color"
                        value={getValidHexColor(focusedBlock.customBorderColor)}
                        onChange={(e) => updateFocusedBlock(() => ({ customBorderColor: e.target.value }))}
                        className="w-5 h-5 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={(focusedBlock.customBorderColor || '#ffffff').toUpperCase()}
                        onChange={(e) => updateFocusedBlock(() => ({ customBorderColor: e.target.value }))}
                        className="w-full bg-transparent text-[8px] text-zinc-400 p-0 font-mono text-center focus:outline-none uppercase border-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOUR & CORNER GLOW DESIGNER */}
          <div className="space-y-3 pt-3 border-t border-zinc-900/60 mt-3">
            {/* Main Title Header */}
            <div>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
                {lang === 'en' ? 'Border & Corner Glow' : 'Свечение контура и углов'}
              </span>
              <span className="text-[8px] text-zinc-650 block">
                {lang === 'en' ? 'Add neon outlines and multi-color gradient corners' : 'Неоновая подсветка контура и настраиваемое свечение углов'}
              </span>
            </div>

            {/* 1. Full Contour Glow Section */}
            <div className="space-y-2 bg-zinc-950/20 p-2 rounded-lg border border-zinc-900/40">
              <div className="flex items-center justify-between">
                <span className="text-[8.5px] font-semibold text-zinc-400">
                  {lang === 'en' ? 'Enable Contour Glow' : 'Свечение всего контура'}
                </span>
                <button
                  type="button"
                  onClick={() => updateFocusedBlock(b => ({ borderGlowActive: !b.borderGlowActive }))}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                    focusedBlock.borderGlowActive ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    focusedBlock.borderGlowActive ? 'translate-x-3.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {focusedBlock.borderGlowActive && (
                <div className="space-y-2.5 pt-1.5 border-t border-zinc-900/30 animate-slide-up">
                  {/* Glow Color */}
                  <div className="space-y-1">
                    <span className="text-[7.5px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Glow Color' : 'Цвет свечения'}</span>
                    <div className="flex gap-1 items-center bg-zinc-950 p-1 rounded border border-zinc-900">
                      <input
                        type="color"
                        value={focusedBlock.borderGlowColor || '#6366f1'}
                        onChange={(e) => updateFocusedBlock(() => ({ borderGlowColor: e.target.value }))}
                        className="w-5 h-5 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={(focusedBlock.borderGlowColor || '#6366f1').toUpperCase()}
                        onChange={(e) => updateFocusedBlock(() => ({ borderGlowColor: e.target.value }))}
                        className="w-full bg-transparent text-[8px] text-zinc-400 p-0 font-mono text-center focus:outline-none uppercase border-none"
                      />
                    </div>
                  </div>

                  {/* Glow Spread & Opacity */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 uppercase">
                        <span>{lang === 'en' ? 'Glow Size' : 'Радиус'}</span>
                        <span className="font-mono text-zinc-400">{focusedBlock.borderGlowWidth !== undefined ? focusedBlock.borderGlowWidth : 15}px</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="50"
                        value={focusedBlock.borderGlowWidth !== undefined ? focusedBlock.borderGlowWidth : 15}
                        onChange={(e) => updateFocusedBlock(() => ({ borderGlowWidth: parseInt(e.target.value) }))}
                        className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 uppercase">
                        <span>{lang === 'en' ? 'Opacity' : 'Яркость'}</span>
                        <span className="font-mono text-zinc-400">{focusedBlock.borderGlowOpacity !== undefined ? focusedBlock.borderGlowOpacity : 60}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={focusedBlock.borderGlowOpacity !== undefined ? focusedBlock.borderGlowOpacity : 60}
                        onChange={(e) => updateFocusedBlock(() => ({ borderGlowOpacity: parseInt(e.target.value) }))}
                        className="w-full accent-white bg-zinc-950 h-1 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Corners Glow Section */}
            <div className="space-y-2 bg-zinc-950/20 p-2 rounded-lg border border-zinc-900/40">
              <div className="flex items-center justify-between">
                <span className="text-[8.5px] font-semibold text-zinc-400">
                  {lang === 'en' ? 'Gradient Corner Lights' : 'Свечение углов'}
                </span>
                <button
                  type="button"
                  onClick={() => updateFocusedBlock(b => ({ borderCornerGlowActive: !b.borderCornerGlowActive }))}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                    focusedBlock.borderCornerGlowActive ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    focusedBlock.borderCornerGlowActive ? 'translate-x-3.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {focusedBlock.borderCornerGlowActive && (
                <div className="space-y-3 pt-1.5 border-t border-zinc-900/30 animate-slide-up">
                  
                  {/* Spread and Opacity adjustments */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 uppercase">
                        <span>{lang === 'en' ? 'Glow Spread' : 'Размыв свечения'}</span>
                        <span className="font-mono text-[8px] text-zinc-400">{focusedBlock.borderCornerGlowSpread !== undefined ? focusedBlock.borderCornerGlowSpread : 12}px</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={focusedBlock.borderCornerGlowSpread !== undefined ? focusedBlock.borderCornerGlowSpread : 12}
                        onChange={(e) => updateFocusedBlock(() => ({ borderCornerGlowSpread: parseInt(e.target.value) }))}
                        className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 uppercase">
                        <span>{lang === 'en' ? 'Opacity' : 'Прозрачность'}</span>
                        <span className="font-mono text-[8px] text-zinc-400">{focusedBlock.borderCornerGlowOpacity !== undefined ? focusedBlock.borderCornerGlowOpacity : 80}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={focusedBlock.borderCornerGlowOpacity !== undefined ? focusedBlock.borderCornerGlowOpacity : 80}
                        onChange={(e) => updateFocusedBlock(() => ({ borderCornerGlowOpacity: parseInt(e.target.value) }))}
                        className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Corner Colors Selection (Only 2 corners: Top-Right & Bottom-Left) */}
                  <div className="space-y-1.5 border-t border-zinc-900/20 pt-2">
                    <span className="text-[7.5px] uppercase font-bold text-zinc-500 block">
                      {lang === 'en' ? 'Corner Glow Colors' : 'Цвета свечения углов'}
                    </span>
                    
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {/* Top-Right */}
                      <div className="space-y-0.5">
                        <span className="text-[7px] text-zinc-600 font-medium block">{lang === 'en' ? 'Top-Right' : 'Вверх-вправо'}</span>
                        <div className="flex gap-1 items-center bg-zinc-950/70 p-0.5 rounded border border-zinc-900">
                          <input
                            type="color"
                            value={focusedBlock.borderCornerColorTR || '#818cf8'}
                            onChange={(e) => updateFocusedBlock(() => ({ borderCornerColorTR: e.target.value }))}
                            className="w-5 h-5 rounded border border-zinc-805 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                          />
                          <input
                            type="text"
                            value={(focusedBlock.borderCornerColorTR || '#818cf8').toUpperCase()}
                            onChange={(e) => updateFocusedBlock(() => ({ borderCornerColorTR: e.target.value }))}
                            className="w-full bg-transparent text-[8px] text-zinc-405 p-0 font-mono text-center focus:outline-none uppercase border-none"
                          />
                        </div>
                      </div>

                      {/* Bottom-Left */}
                      <div className="space-y-0.5">
                        <span className="text-[7px] text-zinc-600 font-medium block">{lang === 'en' ? 'Bottom-Left' : 'Вниз-влево'}</span>
                        <div className="flex gap-1 items-center bg-zinc-950/70 p-0.5 rounded border border-zinc-900">
                          <input
                            type="color"
                            value={focusedBlock.borderCornerColorBL || '#fbbf24'}
                            onChange={(e) => updateFocusedBlock(() => ({ borderCornerColorBL: e.target.value }))}
                            className="w-5 h-5 rounded border border-zinc-805 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                          />
                          <input
                            type="text"
                            value={(focusedBlock.borderCornerColorBL || '#fbbf24').toUpperCase()}
                            onChange={(e) => updateFocusedBlock(() => ({ borderCornerColorBL: e.target.value }))}
                            className="w-full bg-transparent text-[8px] text-zinc-405 p-0 font-mono text-center focus:outline-none uppercase border-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CORNER RADIUS CONTROL */}
            <div className="space-y-2 pt-3 border-t border-zinc-900/60 mt-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                    {lang === 'en' ? 'Smooth Rounded Corners' : 'Скругление углов'}
                  </span>
                  <span className="text-[8px] text-zinc-650">
                    {lang === 'en' ? 'Toggle custom rounded corners shape' : 'Регулировка формы и сглаживания углов плашки'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const alreadyEnabled = focusedBlock.customCornersEnabled;
                    const nextEnabled = !alreadyEnabled;
                    
                    // Safe fallback conversion
                    let nextRadius = focusedBlock.customCornersRadius;
                    if (nextRadius === undefined) {
                      if (focusedBlock.borderRadius === 'none') {
                        nextRadius = 0;
                      } else if (focusedBlock.borderRadius === 'sm') {
                        nextRadius = 4;
                      } else if (focusedBlock.borderRadius === 'md') {
                        nextRadius = 6;
                      } else if (focusedBlock.borderRadius === 'full') {
                        nextRadius = 10;
                      } else {
                        nextRadius = 8; // default 'lg'
                      }
                    }
                    if (nextRadius === 0 && nextEnabled) {
                      nextRadius = 8;
                    }

                    updateFocusedBlock(() => ({
                      customCornersEnabled: nextEnabled,
                      customCornersRadius: nextRadius
                    }));
                  }}
                  className={`w-9 h-5 rounded-full p-0.5 transition-all focus:outline-none cursor-pointer ${
                    focusedBlock.customCornersEnabled ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    focusedBlock.customCornersEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {focusedBlock.customCornersEnabled && (
                <div className="space-y-1 p-2 bg-zinc-950/40 rounded-lg border border-zinc-900 animate-slide-up">
                  <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 uppercase">
                    <span>{lang === 'en' ? 'Smooth Corner Radius' : 'Радиус скругления'}</span>
                    <span className="font-mono text-zinc-400">
                      {focusedBlock.customCornersRadius !== undefined ? focusedBlock.customCornersRadius : 8}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={focusedBlock.customCornersRadius !== undefined ? focusedBlock.customCornersRadius : 8}
                    onChange={(e) => updateFocusedBlock(() => ({ customCornersRadius: parseInt(e.target.value) }))}
                    className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* HOVER EFFECTS */}
            <div className="space-y-2 pt-3 border-t border-zinc-900/60 mt-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-zinc-300">
                    {lang === 'en' ? 'Interactive Hover Effect' : 'Интерактивный Ховер'}
                  </span>
                  <span className="text-[8px] text-zinc-500">
                    {lang === 'en' ? 'Smooth border and lift on focus' : 'Плавное изменение обводки при наведении'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => updateFocusedBlock(b => ({ enableHoverEffect: !b.enableHoverEffect }))}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                    focusedBlock.enableHoverEffect ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    focusedBlock.enableHoverEffect ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {focusedBlock.enableHoverEffect && (
                <div className="space-y-2.5 p-2 bg-zinc-950/40 rounded-lg border border-zinc-900 animate-slide-up">
                  <div className="space-y-1">
                    <span className="text-[7.5px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Hover Border Color' : 'Цвет обводки при наведении'}</span>
                    <div className="flex gap-1 items-center bg-zinc-950 p-1 rounded border border-zinc-900">
                      <input
                        type="color"
                        value={getValidHexColor(focusedBlock.hoverBorderColor)}
                        onChange={(e) => updateFocusedBlock(() => ({ hoverBorderColor: e.target.value }))}
                        className="w-5 h-5 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={(focusedBlock.hoverBorderColor || '#ffffff').toUpperCase()}
                        onChange={(e) => updateFocusedBlock(() => ({ hoverBorderColor: e.target.value }))}
                        className="w-full bg-transparent text-[8px] text-zinc-400 p-0 font-mono text-center focus:outline-none uppercase border-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SIMPLE SHADOW */}
            <div className="space-y-2 pt-3 border-t border-zinc-900/60 mt-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-zinc-300">
                    {lang === 'en' ? '🌑 Dynamic Card Shadow' : '🌑 Мягкая тень блока'}
                  </span>
                  <span className="text-[8px] text-zinc-500">
                    {lang === 'en' ? 'Add depth with a spread shadow' : 'Глубина и объем для блока'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => updateFocusedBlock(b => {
                    const nextEnabled = !b.enableShadow;
                    const update: any = { enableShadow: nextEnabled };
                    if (nextEnabled) {
                      if (b.shadowSize === undefined || b.shadowSize < 5) update.shadowSize = 25;
                      if (b.shadowIntensity === undefined || b.shadowIntensity < 5) update.shadowIntensity = 25;
                    }
                    return update;
                  })}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                    focusedBlock.enableShadow ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    focusedBlock.enableShadow ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {focusedBlock.enableShadow && (
                <div className="space-y-3 p-2.5 bg-zinc-950/40 rounded-lg border border-zinc-900 animate-slide-up">
                  {/* SHADOW SIZE (BLUR) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 uppercase tracking-tighter">
                      <span>{lang === 'en' ? 'Shadow Blur (Size)' : 'Размер (Размытие)'}</span>
                      <input 
                        type="number"
                        value={focusedBlock.shadowSize !== undefined ? focusedBlock.shadowSize : 25}
                        onChange={(e) => updateFocusedBlock(() => ({ shadowSize: Math.min(30, parseInt(e.target.value) || 0) }))}
                        className="w-10 bg-zinc-900 border border-zinc-800 rounded text-center text-[8px] text-zinc-300 focus:outline-none"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={focusedBlock.shadowSize !== undefined ? focusedBlock.shadowSize : 25}
                      onChange={(e) => updateFocusedBlock(() => ({ shadowSize: parseInt(e.target.value) }))}
                      className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* SHADOW INTENSITY (OPACITY) */}
                  <div className="space-y-1.5 pt-1 border-t border-zinc-900/50">
                    <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 uppercase tracking-tighter">
                      <span>{lang === 'en' ? 'Shadow Intensity (%)' : 'Интенсивность (%)'}</span>
                      <input 
                        type="number"
                        value={focusedBlock.shadowIntensity !== undefined ? focusedBlock.shadowIntensity : 25}
                        onChange={(e) => updateFocusedBlock(() => ({ shadowIntensity: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) }))}
                        className="w-10 bg-zinc-900 border border-zinc-850 rounded text-center text-[8px] text-zinc-300 focus:outline-none"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={focusedBlock.shadowIntensity !== undefined ? focusedBlock.shadowIntensity : 25}
                      onChange={(e) => updateFocusedBlock(() => ({ shadowIntensity: parseInt(e.target.value) }))}
                      className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>

      {/* SECTION 3: SPECIAL BLOCK EFFECTS */}
      <button
        type="button"
        onClick={() => setIsEffectsExpanded(!isEffectsExpanded)}
        className="w-full flex items-center justify-between text-[11px] font-sans text-stone-950 font-bold transition-all py-2 px-2.5 bg-orange-500 hover:bg-orange-400 active:scale-[0.99] rounded-xl cursor-pointer shadow-sm shadow-orange-500/10 border-none mt-4"
      >
        <span className="font-bold uppercase tracking-wider">💫 {lang === 'en' ? 'Block Special Effects' : 'Спецэффекты плашки'}</span>
        <span style={{ transform: isEffectsExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} className="text-stone-950 font-extrabold">▼</span>
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateRows: isEffectsExpanded ? '1fr' : '0fr',
          transition: `grid-template-rows ${getTransitionDuration(effectsHeight)}ms cubic-bezier(0.25, 1, 0.5, 1), opacity ${getTransitionDuration(effectsHeight)}ms cubic-bezier(0.25, 1, 0.5, 1)`,
          opacity: isEffectsExpanded ? 1 : 0,
          pointerEvents: isEffectsExpanded ? 'auto' : 'none'
        }}
      >
        <div style={{ minHeight: 0 }} className="overflow-hidden">
          <div ref={effectsRef} className="pt-2">
            <div className="p-3 bg-zinc-900/30 rounded-xl border border-zinc-900 space-y-4">

          {/* Effect 1: Backdrop Blur */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-300 animate-pulse">
                  {lang === 'en' ? '🔍 Backdrop Frosted Blur' : '🔍 Размытие фона за картой'}
                </span>
                <span className="text-[8px] text-zinc-500">
                  {lang === 'en' ? 'Sophisticated frosting glass filter' : 'Матовое стекло (работает при <100% прозрачности)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => updateFocusedBlock(b => ({ enableBlurEffect: !b.enableBlurEffect }))}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                  focusedBlock.enableBlurEffect ? 'bg-emerald-500' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  focusedBlock.enableBlurEffect ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>
            {focusedBlock.enableBlurEffect && (
              <div className="space-y-1 p-2 bg-zinc-950/40 rounded-lg border border-zinc-900 animate-slide-up">
                <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 uppercase">
                  <span>{lang === 'en' ? 'Blur Radius' : 'Сила размытия'}</span>
                  <span className="font-mono text-zinc-400">{focusedBlock.blurEffectAmount !== undefined ? focusedBlock.blurEffectAmount : 8}px</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={focusedBlock.blurEffectAmount !== undefined ? focusedBlock.blurEffectAmount : 8}
                  onChange={(e) => updateFocusedBlock(() => ({ blurEffectAmount: parseInt(e.target.value) }))}
                  className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Effect 2: Contour Glare */}
          <div 
            onClickCapture={handlePremiumClick}
            className="space-y-2 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-300 flex items-center">
                  {lang === 'en' ? '✨ Animated Glare Sweep' : '✨ Пробегающий блик'}
                </span>
                <span className="text-[8px] text-zinc-500">
                  {lang === 'en' ? 'A shining light beam sweeps across' : 'Периодический плавный световой блик'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => updateFocusedBlock(b => ({ enableGlareEffect: !b.enableGlareEffect }))}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                  focusedBlock.enableGlareEffect ? 'bg-emerald-500' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  focusedBlock.enableGlareEffect ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>
            {focusedBlock.enableGlareEffect && (
              <div className="space-y-2.5 p-2 bg-zinc-950/40 rounded-lg border border-zinc-900 animate-slide-up">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 uppercase">
                      <span>{lang === 'en' ? 'Interval (Slow-Fast)' : 'Интервал скорости'}</span>
                      <span className="font-mono text-zinc-400">{focusedBlock.glareEffectSpeed !== undefined ? focusedBlock.glareEffectSpeed : 4}s</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      step="0.5"
                      value={focusedBlock.glareEffectSpeed !== undefined ? focusedBlock.glareEffectSpeed : 4}
                      onChange={(e) => updateFocusedBlock(() => ({ glareEffectSpeed: parseFloat(e.target.value) }))}
                      className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[7.5px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Glare Color' : 'Цвет блика'}</span>
                    <div className="flex gap-1 items-center bg-zinc-950 p-1 rounded border border-zinc-900">
                      <input
                        type="color"
                        value={focusedBlock.glareEffectColor || '#ffffff'}
                        onChange={(e) => updateFocusedBlock(() => ({ glareEffectColor: e.target.value }))}
                        className="w-5 h-5 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={(focusedBlock.glareEffectColor || '#ffffff').toUpperCase()}
                        onChange={(e) => updateFocusedBlock(() => ({ glareEffectColor: e.target.value }))}
                        className="w-full bg-transparent text-[8px] text-zinc-400 p-0 font-mono text-center focus:outline-none uppercase border-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Effect 3: Outer Pulsating Glow */}
          <div 
            onClickCapture={handlePremiumClick}
            className="space-y-2 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-300 flex items-center">
                  {lang === 'en' ? '🔮 Pulsating Halo Glow' : '🔮 Пульсирующее свечение'}
                </span>
                <span className="text-[8px] text-zinc-500">
                  {lang === 'en' ? 'A beautiful outer ambient light shadow' : 'Внешнее пульсирующее био-свечение около плашки'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => updateFocusedBlock(b => ({ enableGlowEffect: !b.enableGlowEffect }))}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                  focusedBlock.enableGlowEffect ? 'bg-emerald-500' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  focusedBlock.enableGlowEffect ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>
            {focusedBlock.enableGlowEffect && (
              <div className="space-y-2.5 p-2 bg-zinc-950/40 rounded-lg border border-zinc-900 animate-slide-up">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 uppercase">
                      <span>{lang === 'en' ? 'Pulse Period' : 'Период пульсации'}</span>
                      <span className="font-mono text-zinc-400">{focusedBlock.glowEffectSpeed !== undefined ? focusedBlock.glowEffectSpeed : 2}s</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={focusedBlock.glowEffectSpeed !== undefined ? focusedBlock.glowEffectSpeed : 2}
                      onChange={(e) => updateFocusedBlock(() => ({ glowEffectSpeed: parseFloat(e.target.value) }))}
                      className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[7.5px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Glow Color' : 'Цвет свечения'}</span>
                    <div className="flex gap-1 items-center bg-zinc-950 p-1 rounded border border-zinc-900">
                      <input
                        type="color"
                        value={focusedBlock.glowEffectColor || '#6366f1'}
                        onChange={(e) => updateFocusedBlock(() => ({ glowEffectColor: e.target.value }))}
                        className="w-5 h-5 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={(focusedBlock.glowEffectColor || '#6366f1').toUpperCase()}
                        onChange={(e) => updateFocusedBlock(() => ({ glowEffectColor: e.target.value }))}
                        className="w-full bg-transparent text-[8px] text-zinc-400 p-0 font-mono text-center focus:outline-none uppercase border-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Effect 4: Analog Film Grain Noise */}
          <div 
            onClickCapture={handlePremiumClick}
            className="space-y-2 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-300 flex items-center">
                  {lang === 'en' ? '📻 Analog Film Grain' : '📻 Эффект зернистости / шума'}
                </span>
                <span className="text-[8px] text-zinc-500">
                  {lang === 'en' ? 'Sophisticated noise grain texture overlay' : 'Роскошная текстура космической пыли'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => updateFocusedBlock(b => ({ enableNoiseEffect: !b.enableNoiseEffect }))}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                  focusedBlock.enableNoiseEffect ? 'bg-emerald-500' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  focusedBlock.enableNoiseEffect ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>
            {focusedBlock.enableNoiseEffect && (
              <div className="space-y-1 p-2 bg-zinc-950/40 rounded-lg border border-zinc-900 animate-slide-up">
                <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 uppercase">
                  <span>{lang === 'en' ? 'Grain Intensity' : 'Интенсивность шума'}</span>
                  <span className="font-mono text-zinc-400">{focusedBlock.noiseEffectOpacity !== undefined ? focusedBlock.noiseEffectOpacity : 12}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={focusedBlock.noiseEffectOpacity !== undefined ? focusedBlock.noiseEffectOpacity : 12}
                  onChange={(e) => updateFocusedBlock(() => ({ noiseEffectOpacity: parseInt(e.target.value) }))}
                  className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Effect 5: Glass refraction structure */}
          <div 
            onClickCapture={handlePremiumClick}
            className="space-y-2 border-t border-zinc-900/40 pt-2 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-300 flex items-center">
                  {lang === 'en' ? '💎 Glass Refraction' : '💎 Эффект: Стекло'}
                </span>
                <span className="text-[8px] text-zinc-500">
                  {lang === 'en' ? 'Refraction bending at block edges as a physical lens' : 'Физическое преломление по краям плашки как у настоящего стекла'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => updateFocusedBlock(b => {
                  const nextEnabled = !b.enableGlassEffect;
                  const update: any = { enableGlassEffect: nextEnabled };
                  if (nextEnabled) {
                    if (b.glassThickness === undefined) update.glassThickness = 80;
                    if (b.refractiveIndex === undefined) update.refractiveIndex = 2.0;
                    if (b.bezelWidth === undefined) update.bezelWidth = 35;
                    if (b.glassZoom === undefined) update.glassZoom = 30;
                  }
                  return update;
                })}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                  focusedBlock.enableGlassEffect ? 'bg-emerald-500' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  focusedBlock.enableGlassEffect ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>
            
            {focusedBlock.enableGlassEffect && (
              <div className="space-y-3 p-2.5 bg-zinc-950/40 rounded-lg border border-zinc-900 animate-slide-up">
                
                {/* GLASS PRESET SELECTOR (4 PRESETS) */}
                <div className="space-y-1.5 pb-2 border-b border-zinc-900/50">
                  <span className="block text-[8px] uppercase font-bold text-zinc-500 tracking-wider">
                    {lang === 'en' ? 'Glass Edge Profile' : 'Профиль фаски / Сглаживание'}
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { 
                        id: 'convex-circular', 
                        name: lang === 'en' ? 'Convex Circular' : 'Выпуклый 1 (Круг)',
                        path: "M6,26 C6,15 15,6 26,6" 
                      },
                      { 
                        id: 'convex-smooth', 
                        name: lang === 'en' ? 'Convex Smooth' : 'Выпуклый 2 (S-кривая)',
                        path: "M6,26 C14,26 18,6 26,6" 
                      },
                      { 
                        id: 'concave', 
                        name: lang === 'en' ? 'Concave Scooped' : 'Вогнутый 1 (Чаша)',
                        path: "M6,6 C6,18 14,26 26,26" 
                      },
                      { 
                        id: 'ridge', 
                        name: lang === 'en' ? 'Raised Ridge' : 'Вогнутый 2 (Кант/Ридж)',
                        path: "M6,26 C12,25 12,6 16,6 C20,6 20,25 26,26" 
                      }
                    ].map((p) => {
                      const isActive = (focusedBlock.glassPreset || 'convex-circular') === p.id;
                      return (
                        <button
                          key={p.id}
                          title={p.name}
                          type="button"
                          onClick={() => updateFocusedBlock(() => ({ glassPreset: p.id as any }))}
                          className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-2 transition-all relative group cursor-pointer ${
                            isActive 
                              ? 'bg-zinc-100 border-zinc-100 shadow-[0_0_12px_rgba(255,255,255,0.15)] text-zinc-950' 
                              : 'bg-zinc-950/60 border-zinc-850 text-zinc-500 hover:border-zinc-700 hover:text-zinc-350'
                          }`}
                        >
                          <svg 
                            viewBox="0 0 32 32" 
                            className="w-7 h-7 fill-none transition-transform group-hover:scale-105"
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            strokeLinecap="round"
                          >
                            <path d={p.path} />
                          </svg>
                          <span className="sr-only">{p.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  {/* Selected Preset name label under buttons for friendly visual confirmation */}
                  <div className="text-[8.5px] font-sans font-medium text-emerald-400/90 italic text-center pt-1.5 leading-tight">
                    {(focusedBlock.glassPreset || 'convex-circular') === 'convex-circular' 
                      ? (lang === 'en' ? 'Convex Circular Profile (Quarter-circle)' : 'Профиль выпуклый 1: Идеальный четверть-круг')
                      : (focusedBlock.glassPreset || 'convex-circular') === 'convex-smooth'
                        ? (lang === 'en' ? 'Convex Smooth Profile (S-Curve)' : 'Профиль выпуклый 2: Анатомическая S-кривая')
                        : (focusedBlock.glassPreset || 'convex-circular') === 'concave'
                          ? (lang === 'en' ? 'Concave Scooped Profile (Liquid Hollow)' : 'Профиль вогнутый 1: Глубокая линзовая чаша')
                          : (lang === 'en' ? 'Raised Ridge Profile (Double Curve Ripple)' : 'Профиль вогнутый 2: Двухволновой кант-волна')
                    }
                  </div>
                </div>

                {/* GLASS THICKNESS */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 uppercase">
                    <span>{lang === 'en' ? 'Thickness' : 'Толщина (Thickness)'}</span>
                    <span className="font-mono text-zinc-400">{focusedBlock.glassThickness !== undefined ? focusedBlock.glassThickness : 80}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={focusedBlock.glassThickness !== undefined ? focusedBlock.glassThickness : 80}
                    onChange={(e) => updateFocusedBlock(() => ({ glassThickness: parseInt(e.target.value) }))}
                    className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* BEZEL WIDTH */}
                <div className="space-y-1.5 pt-1 border-t border-zinc-900/50">
                  <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 uppercase">
                    <span>{lang === 'en' ? 'Bezel Width' : 'Ширина кромки (Bezel width)'}</span>
                    <span className="font-mono text-zinc-400">{focusedBlock.bezelWidth !== undefined ? focusedBlock.bezelWidth : 35}px</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="60"
                    value={focusedBlock.bezelWidth !== undefined ? focusedBlock.bezelWidth : 35}
                    onChange={(e) => updateFocusedBlock(() => ({ bezelWidth: parseInt(e.target.value) }))}
                    className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* REFRACTIVE INDEX */}
                <div className="space-y-1.5 pt-1 border-t border-zinc-900/50">
                  <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 uppercase">
                    <span>{lang === 'en' ? 'Refractive Index' : 'Индекс рефракции (Refractive index)'}</span>
                    <span className="font-mono text-zinc-400">{(focusedBlock.refractiveIndex !== undefined ? focusedBlock.refractiveIndex : 2.0).toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="6.0"
                    step="0.05"
                    value={focusedBlock.refractiveIndex !== undefined ? focusedBlock.refractiveIndex : 2.0}
                    onChange={(e) => updateFocusedBlock(() => ({ refractiveIndex: parseFloat(e.target.value) }))}
                    className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* LENS ZOOM STRENGTH */}
                <div className="space-y-1.5 pt-1 border-t border-zinc-900/50">
                  <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 uppercase">
                    <span>{lang === 'en' ? 'Lens Zoom' : 'Зум линзы (Lens zoom)'}</span>
                    <span className="font-mono text-zinc-400">{focusedBlock.glassZoom !== undefined ? focusedBlock.glassZoom : 30}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={focusedBlock.glassZoom !== undefined ? focusedBlock.glassZoom : 30}
                    onChange={(e) => updateFocusedBlock(() => ({ glassZoom: parseInt(e.target.value) }))}
                    className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
        </div>
      </div>

    </div>
  );
};

