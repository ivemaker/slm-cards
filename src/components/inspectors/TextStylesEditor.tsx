import React, { useState } from 'react';

export interface TextStyles {
  textAlign?: 'left' | 'center' | 'right';
  textBold?: boolean;
  textItalic?: boolean;
  textUnderline?: boolean;
  textLineHeight?: number;
  textLetterSpacing?: number;
  
  textShimmerEnabled?: boolean;
  textShimmerColor?: string;
  textShimmerSpeed?: number;
  textShimmerInterval?: number;
  textShimmerDirection?: 'left' | 'right';
  
  textShadowEnabled?: boolean;
  textShadowColor?: string;
  textShadowBlur?: number;
  textShadowOffsetX?: number;
  textShadowOffsetY?: number;
  
  textGlowEnabled?: boolean;
  textGlowColor?: string;
  textGlowRadius?: number;
}

interface TextStylesEditorProps {
  styles: TextStyles | undefined;
  onChange: (styles: TextStyles) => void;
  label?: string;
  lang: 'en' | 'ru';
}

export const TextFormatToolbar: React.FC<{ styles: TextStyles | undefined; onChange: (s: TextStyles) => void }> = ({ styles, onChange }) => {
  const currentStyles = styles || {};
  const update = (updates: Partial<TextStyles>) => onChange({ ...currentStyles, ...updates });
  
  const btnClass = "w-8 h-8 flex items-center justify-center text-[11px] rounded-lg border cursor-pointer transition-colors";
  const activeClass = "bg-white text-zinc-950 border-white font-bold";
  const inactiveClass = "bg-transparent text-zinc-400 border-zinc-700 hover:text-white hover:border-zinc-500";

  return (
    <div className="flex gap-1.5">
      {/* Alignment */}
      <div className="flex gap-1 mr-2">
        {(['left', 'center', 'right'] as const).map((alignVal) => {
          const active = (currentStyles.textAlign || 'center') === alignVal;
          return (
            <button
              key={alignVal}
              type="button"
              onClick={() => update({ textAlign: alignVal })}
              className={`${btnClass} ${active ? activeClass : inactiveClass}`}
            >
              {alignVal === 'left' ? '⇤' : alignVal === 'center' ? '↔' : '⇥'}
            </button>
          );
        })}
      </div>

      {/* Font Styles */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => update({ textBold: !currentStyles.textBold })}
          className={`${btnClass} ${currentStyles.textBold ? activeClass : inactiveClass} font-bold`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => update({ textItalic: !currentStyles.textItalic })}
          className={`${btnClass} ${currentStyles.textItalic ? activeClass : inactiveClass} italic font-serif`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => update({ textUnderline: !currentStyles.textUnderline })}
          className={`${btnClass} ${currentStyles.textUnderline ? activeClass : inactiveClass} underline`}
        >
          U
        </button>
      </div>
    </div>
  );
};

export const TextStylesEditor: React.FC<TextStylesEditorProps> = ({ styles, onChange, label, lang }) => {
  const currentStyles = styles || {};
  const [isOpen, setIsOpen] = useState(false);

  const update = (updates: Partial<TextStyles>) => {
    onChange({ ...currentStyles, ...updates });
  };

  return (
    <div className="space-y-3 pt-3 border-t border-zinc-900/60 mt-3 animate-slide-up">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center bg-zinc-950 p-2 rounded border border-zinc-900 transition-colors cursor-pointer text-left hover:bg-zinc-900"
      >
        <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">
          {label || (lang === 'en' ? 'Advanced Text Effects' : 'Доп. настройки текста')}
        </span>
        <span className="text-[10px] text-zinc-500 font-bold font-mono">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen && (
        <div className="space-y-4 animate-slide-up pb-2">
          {/* Spacing */}
          <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 uppercase">
            <span>{lang === 'en' ? 'Line Height' : 'Межстрочный'}</span>
            <span className="font-mono text-zinc-400">{currentStyles.textLineHeight !== undefined ? currentStyles.textLineHeight : '1.4'}</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="2.5"
            step="0.1"
            value={currentStyles.textLineHeight !== undefined ? currentStyles.textLineHeight : 1.4}
            onChange={(e) => update({ textLineHeight: parseFloat(e.target.value) })}
            className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[7.5px] font-bold text-zinc-500 uppercase">
            <span>{lang === 'en' ? 'Letter Spacing' : 'Межбуквенный'}</span>
            <span className="font-mono text-zinc-400">{currentStyles.textLetterSpacing !== undefined ? currentStyles.textLetterSpacing : '0'}px</span>
          </div>
          <input
            type="range"
            min="-2"
            max="12"
            step="0.5"
            value={currentStyles.textLetterSpacing !== undefined ? currentStyles.textLetterSpacing : 0}
            onChange={(e) => update({ textLetterSpacing: parseFloat(e.target.value) })}
            className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Effects list */}
      <div className="space-y-2">
        {/* Shimmer */}
        <div className="space-y-1.5 p-2 bg-zinc-950/40 rounded-lg border border-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-[8.5px] font-bold text-zinc-300">
              💫 {lang === 'en' ? 'Running Glint' : 'Бегущий блик'}
            </span>
            <button
              type="button"
              onClick={() => update({ textShimmerEnabled: !currentStyles.textShimmerEnabled })}
              className={`w-7 h-4 rounded-full p-0.5 transition-colors cursor-pointer border-none ${
                currentStyles.textShimmerEnabled ? 'bg-emerald-500' : 'bg-zinc-850'
              }`}
            >
              <div className={`w-3 h-3 rounded-full bg-white transition-transform ${
                currentStyles.textShimmerEnabled ? 'translate-x-3' : 'translate-x-0'
              }`} />
            </button>
          </div>
          {currentStyles.textShimmerEnabled && (
            <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-zinc-900/30 animate-slide-up">
              <div className="space-y-1">
                <span className="text-[7px] uppercase font-bold text-zinc-500 flex justify-between">
                  <span>{lang === 'en' ? 'Color' : 'Цвет'}</span>
                  <span>{lang === 'en' ? 'Dir' : 'Напр.'}</span>
                </span>
                <div className="flex gap-1 items-center bg-zinc-950 p-1 rounded border border-zinc-900 justify-between">
                  <input
                    type="color"
                    value={currentStyles.textShimmerColor || '#ffffff'}
                    onChange={(e) => update({ textShimmerColor: e.target.value })}
                    className="w-4 h-4 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                  />
                  <div className="flex bg-zinc-900 rounded">
                    <button
                      type="button"
                      onClick={() => update({ textShimmerDirection: 'left' })}
                      className={`w-4 h-4 flex items-center justify-center text-[8px] rounded-l transition-colors cursor-pointer border-none ${
                        currentStyles.textShimmerDirection === 'left' ? 'bg-zinc-700 text-white' : 'bg-transparent text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => update({ textShimmerDirection: 'right' })}
                      className={`w-4 h-4 flex items-center justify-center text-[8px] rounded-r transition-colors cursor-pointer border-none ${
                        currentStyles.textShimmerDirection !== 'left' ? 'bg-zinc-700 text-white' : 'bg-transparent text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[7px] font-bold text-zinc-500 uppercase">
                  <span>{lang === 'en' ? 'Speed' : 'Скор.'}</span>
                  <span className="font-mono text-zinc-400">{currentStyles.textShimmerSpeed || 3}s</span>
                </div>
                <input
                  type="range" min="1" max="8" step="0.5"
                  value={currentStyles.textShimmerSpeed || 3}
                  onChange={(e) => update({ textShimmerSpeed: parseFloat(e.target.value) })}
                  className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[7px] font-bold text-zinc-500 uppercase">
                  <span>{lang === 'en' ? 'Interval' : 'Период.'}</span>
                  <span className="font-mono text-zinc-400">{currentStyles.textShimmerInterval || 0}s</span>
                </div>
                <input
                  type="range" min="0" max="10" step="0.5"
                  value={currentStyles.textShimmerInterval || 0}
                  onChange={(e) => update({ textShimmerInterval: parseFloat(e.target.value) })}
                  className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Text Shadow */}
        <div className="space-y-1.5 p-2 bg-zinc-950/40 rounded-lg border border-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-[8.5px] font-bold text-zinc-300">
              👥 {lang === 'en' ? 'Drop Shadow' : 'Тень'}
            </span>
            <button
              type="button"
              onClick={() => update({ textShadowEnabled: !currentStyles.textShadowEnabled })}
              className={`w-7 h-4 rounded-full p-0.5 transition-colors cursor-pointer border-none ${
                currentStyles.textShadowEnabled ? 'bg-emerald-500' : 'bg-zinc-850'
              }`}
            >
              <div className={`w-3 h-3 rounded-full bg-white transition-transform ${
                currentStyles.textShadowEnabled ? 'translate-x-3' : 'translate-x-0'
              }`} />
            </button>
          </div>
          {currentStyles.textShadowEnabled && (
            <div className="space-y-1.5 pt-1.5 border-t border-zinc-900/30 animate-slide-up">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[7px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Color' : 'Цвет'}</span>
                  <div className="flex gap-1 items-center bg-zinc-950 p-1 rounded border border-zinc-900">
                    <input
                      type="color"
                      value={currentStyles.textShadowColor || '#000000'}
                      onChange={(e) => update({ textShadowColor: e.target.value })}
                      className="w-4 h-4 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[7px] font-bold text-zinc-500 uppercase">
                    <span>{lang === 'en' ? 'Blur' : 'Размытие'}</span>
                    <span className="font-mono text-zinc-400">{currentStyles.textShadowBlur !== undefined ? currentStyles.textShadowBlur : 4}px</span>
                  </div>
                  <input
                    type="range" min="0" max="20"
                    value={currentStyles.textShadowBlur !== undefined ? currentStyles.textShadowBlur : 4}
                    onChange={(e) => update({ textShadowBlur: parseInt(e.target.value) })}
                    className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[7px] font-bold text-zinc-500 uppercase">
                    <span>{lang === 'en' ? 'Offset X' : 'Сдвиг X'}</span>
                    <span className="font-mono text-zinc-400">{currentStyles.textShadowOffsetX !== undefined ? currentStyles.textShadowOffsetX : 1}px</span>
                  </div>
                  <input
                    type="range" min="-10" max="10"
                    value={currentStyles.textShadowOffsetX !== undefined ? currentStyles.textShadowOffsetX : 1}
                    onChange={(e) => update({ textShadowOffsetX: parseInt(e.target.value) })}
                    className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[7px] font-bold text-zinc-500 uppercase">
                    <span>{lang === 'en' ? 'Offset Y' : 'Сдвиг Y'}</span>
                    <span className="font-mono text-zinc-400">{currentStyles.textShadowOffsetY !== undefined ? currentStyles.textShadowOffsetY : 1}px</span>
                  </div>
                  <input
                    type="range" min="-10" max="10"
                    value={currentStyles.textShadowOffsetY !== undefined ? currentStyles.textShadowOffsetY : 1}
                    onChange={(e) => update({ textShadowOffsetY: parseInt(e.target.value) })}
                    className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Glow */}
        <div className="space-y-1.5 p-2 bg-zinc-950/40 rounded-lg border border-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-[8.5px] font-bold text-zinc-300">
              🌟 {lang === 'en' ? 'Outer Glow' : 'Свечение'}
            </span>
            <button
              type="button"
              onClick={() => update({ textGlowEnabled: !currentStyles.textGlowEnabled })}
              className={`w-7 h-4 rounded-full p-0.5 transition-colors cursor-pointer border-none ${
                currentStyles.textGlowEnabled ? 'bg-emerald-500' : 'bg-zinc-850'
              }`}
            >
              <div className={`w-3 h-3 rounded-full bg-white transition-transform ${
                currentStyles.textGlowEnabled ? 'translate-x-3' : 'translate-x-0'
              }`} />
            </button>
          </div>
          {currentStyles.textGlowEnabled && (
            <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-zinc-900/30 animate-slide-up">
              <div className="space-y-1">
                <span className="text-[7px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Color' : 'Цвет'}</span>
                <div className="flex gap-1 items-center bg-zinc-950 p-1 rounded border border-zinc-900">
                  <input
                    type="color"
                    value={currentStyles.textGlowColor || '#6366f1'}
                    onChange={(e) => update({ textGlowColor: e.target.value })}
                    className="w-4 h-4 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[7px] font-bold text-zinc-500 uppercase">
                  <span>{lang === 'en' ? 'Radius' : 'Радиус'}</span>
                  <span className="font-mono text-zinc-400">{currentStyles.textGlowRadius !== undefined ? currentStyles.textGlowRadius : 8}px</span>
                </div>
                <input
                  type="range" min="2" max="30"
                  value={currentStyles.textGlowRadius !== undefined ? currentStyles.textGlowRadius : 8}
                  onChange={(e) => update({ textGlowRadius: parseInt(e.target.value) })}
                  className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      )}
    </div>
  );
};
