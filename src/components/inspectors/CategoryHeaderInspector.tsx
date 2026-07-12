import React from 'react';
import { Block } from '../../types';
import { TextStylesEditor, TextFormatToolbar } from './TextStylesEditor';

interface CategoryHeaderInspectorProps {
  focusedBlock: Block;
  lang: 'en' | 'ru';
  updateFocusedBlock: (updateFn: (b: Block) => Partial<Block>) => void;
}

export const CategoryHeaderInspector: React.FC<CategoryHeaderInspectorProps> = ({
  focusedBlock,
  lang,
  updateFocusedBlock,
}) => {
  const header = focusedBlock.categoryHeaderContent!;

  return (
    <div className="space-y-4">
      {/* SECTION: TITLE */}
      <div className="text-[10px] font-black uppercase text-orange-500 tracking-wider flex items-center gap-1.5 mt-1.5">
        <span className="w-1.5 h-3.5 bg-orange-500 rounded-full" />
        <span>{lang === 'en' ? 'Section Header Title' : 'ЗАГОЛОВОК РАЗДЕЛА'}</span>
      </div>

      <div className="flex gap-2 items-end">
        {/* Section Header Title Input */}
        <div className="flex-1">
          <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1 truncate">
            {lang === 'en' ? 'Section Header Title' : 'Заголовок раздела'}
          </label>
          <input
            type="text"
            value={header.title}
            onChange={(e) => updateFocusedBlock(b => ({ categoryHeaderContent: { ...b.categoryHeaderContent!, title: e.target.value } }))}
            className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-lg p-2 text-white focus:outline-none"
          />
        </div>

        {/* Font Family Dropdown */}
        <div className="w-[110px] flex-shrink-0">
          <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1 truncate">
            {lang === 'en' ? 'Font' : 'Шрифт'}
          </label>
          <select
            value={focusedBlock.customTitleFont || 'Inter'}
            onChange={(e) => updateFocusedBlock(() => ({ customTitleFont: e.target.value }))}
            className="w-full bg-zinc-900 border border-zinc-800 text-[11px] rounded-lg p-2 text-white focus:outline-none cursor-pointer"
            style={{ fontFamily: focusedBlock.customTitleFont || 'Inter' }}
          >
            <option value="Inter" style={{ fontFamily: 'Inter' }}>Inter</option>
            <option value="Space Grotesk" style={{ fontFamily: 'Space Grotesk' }}>Grotesk</option>
            <option value="Montserrat" style={{ fontFamily: 'Montserrat' }}>Montserrat</option>
            <option value="Unbounded" style={{ fontFamily: 'Unbounded' }}>Unbounded</option>
            <option value="Merriweather" style={{ fontFamily: 'Merriweather' }}>Merriweather</option>
            <option value="Playfair Display" style={{ fontFamily: 'Playfair Display' }}>Playfair</option>
            <option value="JetBrains Mono" style={{ fontFamily: 'JetBrains Mono' }}>Mono</option>
            <option value="Pacifico" style={{ fontFamily: 'Pacifico' }}>Pacifico</option>
          </select>
        </div>

        {/* Color Picker */}
        <div className="flex flex-col items-center flex-shrink-0">
          <label className="block text-[7px] uppercase font-bold text-zinc-500 tracking-wider mb-1 text-center truncate">
            {lang === 'en' ? 'Color' : 'Цвет'}
          </label>
          <div className="relative w-8 h-8 rounded-lg border border-zinc-800 flex items-center justify-center bg-zinc-950 cursor-pointer hover:border-zinc-700 transition">
            <input
              type="color"
              value={focusedBlock.customTitleColor || '#ffffff'}
              onChange={(e) => updateFocusedBlock(() => ({ customTitleColor: e.target.value }))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div 
              className="w-4 h-4 rounded border border-zinc-700 shadow-inner"
              style={{ backgroundColor: focusedBlock.customTitleColor || '#ffffff' }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <TextFormatToolbar 
          styles={focusedBlock.titleTextStyles} 
          onChange={(styles) => updateFocusedBlock(() => ({ titleTextStyles: styles }))}
        />
      </div>

      {/* Font Size Slider */}
      <div className="space-y-1 mt-1 bg-zinc-900/10 p-2 rounded-xl border border-zinc-900">
        <div className="flex justify-between items-center text-[8px] font-bold text-zinc-500 uppercase">
          <span>{lang === 'en' ? 'Header Font Size' : 'Размер шрифта заголовка'}</span>
          <span className="font-mono text-zinc-400">
            {focusedBlock.customTitleFontSize !== undefined ? focusedBlock.customTitleFontSize : 12}px
          </span>
        </div>
        <input
          type="range"
          min="12"
          max="100"
          value={focusedBlock.customTitleFontSize !== undefined ? focusedBlock.customTitleFontSize : 12}
          onChange={(e) => updateFocusedBlock(() => ({ customTitleFontSize: parseInt(e.target.value) }))}
          className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
        />
        <TextStylesEditor 
          styles={focusedBlock.titleTextStyles} 
          onChange={(styles) => updateFocusedBlock(() => ({ titleTextStyles: styles }))}
          lang={lang}
        />
      </div>
    </div>
  );
};
