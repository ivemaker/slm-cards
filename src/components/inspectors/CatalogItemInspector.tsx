import React from 'react';
import { Block } from '../../types';
import { TextStylesEditor, TextFormatToolbar } from './TextStylesEditor';

interface CatalogItemInspectorProps {
  focusedBlock: Block;
  lang: 'en' | 'ru';
  updateFocusedBlock: (updateFn: (b: Block) => Partial<Block>) => void;
  handleImageUpload: (file: File, blockId: string, type: 'profile' | 'catalog') => void;
  isCompressing: boolean;
}

export const CatalogItemInspector: React.FC<CatalogItemInspectorProps> = ({
  focusedBlock,
  lang,
  updateFocusedBlock,
  handleImageUpload,
  isCompressing,
}) => {
  const item = focusedBlock.catalogItemContent!;

  return (
    <div className="space-y-4">
      {/* SECTION: TITLE & PRICE */}
      <div className="text-[10px] font-black uppercase text-orange-500 tracking-wider flex items-center gap-1.5 mt-1.5">
        <span className="w-1.5 h-3.5 bg-orange-500 rounded-full" />
        <span>{lang === 'en' ? 'Product Name & Price' : 'НАЗВАНИЕ И ЦЕНА'}</span>
      </div>

      {/* Title block with Font selection, Title text and Color picker */}
      <div className="flex gap-2 items-end">
        {/* Title Input */}
        <div className="flex-1">
          <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1 truncate">
            {lang === 'en' ? 'Product / Menu Title' : 'Название товара / Блюда'}
          </label>
          <input
            type="text"
            value={item.title}
            onChange={(e) => updateFocusedBlock(b => ({ catalogItemContent: { ...b.catalogItemContent!, title: e.target.value } }))}
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
          <span>{lang === 'en' ? 'Title Font Size' : 'Размер шрифта заголовка'}</span>
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

      {/* Price Input Field */}
      <div>
        <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1">
          {lang === 'en' ? 'Price ($)' : 'Цена ($)'}
        </label>
        <input
          type="number"
          step="0.01"
          value={item.price}
          onChange={(e) => updateFocusedBlock(b => ({ catalogItemContent: { ...b.catalogItemContent!, price: parseFloat(e.target.value) || 0 } }))}
          className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-lg p-2 text-white outline-none font-mono"
        />
      </div>

      {/* E-commerce settings */}
      <div className="space-y-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            {lang === 'en' ? 'Enable Cart/Order' : 'Включить заказ'}
          </label>
          <button
            onClick={() => updateFocusedBlock(b => ({ config: { ...b.config, isEcomEnabled: !b.config?.isEcomEnabled } }))}
            className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${focusedBlock.config?.isEcomEnabled ? 'bg-indigo-500' : 'bg-zinc-700'}`}
          >
            <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${focusedBlock.config?.isEcomEnabled ? 'left-4' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      {/* SECTION: DESCRIPTION */}
      <div className="pt-3 border-t border-zinc-800/60" />
      <div className="text-[10px] font-black uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
        <span className="w-1.5 h-3.5 bg-orange-500 rounded-full" />
        <span>{lang === 'en' ? 'Product Description' : 'ОПИСАНИЕ ТОВАРА'}</span>
      </div>

      {/* Description Field with Font, Color Picker and Size Slider */}
      <div className="flex gap-2 items-end">
        {/* Description Textarea Input */}
        <div className="flex-1">
          <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1 truncate">
            {lang === 'en' ? 'Description' : 'Описание'}
          </label>
          <textarea
            rows={2}
            value={item.description}
            onChange={(e) => updateFocusedBlock(b => ({ catalogItemContent: { ...b.catalogItemContent!, description: e.target.value } }))}
            className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-lg p-2 text-white focus:outline-none leading-relaxed"
          />
        </div>

        {/* Font Family Dropdown for Description */}
        <div className="w-[110px] flex-shrink-0">
          <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1 truncate">
            {lang === 'en' ? 'Desc Font' : 'Шрифт описания'}
          </label>
          <select
            value={focusedBlock.customDescFont || 'Inter'}
            onChange={(e) => updateFocusedBlock(() => ({ customDescFont: e.target.value }))}
            className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-lg p-2 text-white focus:outline-none font-medium cursor-pointer"
          >
            <option value="Inter" style={{ fontFamily: 'Inter' }}>Inter</option>
            <option value="Unbounded" style={{ fontFamily: 'Unbounded' }}>Unbounded</option>
            <option value="Merriweather" style={{ fontFamily: 'Merriweather' }}>Merriweather</option>
            <option value="Playfair Display" style={{ fontFamily: 'Playfair Display' }}>Playfair</option>
            <option value="JetBrains Mono" style={{ fontFamily: 'JetBrains Mono' }}>Mono</option>
            <option value="Pacifico" style={{ fontFamily: 'Pacifico' }}>Pacifico</option>
          </select>
        </div>

        {/* Color Picker for Description */}
        <div className="flex flex-col items-center flex-shrink-0">
          <label className="block text-[7px] uppercase font-bold text-zinc-500 tracking-wider mb-1 text-center truncate">
            {lang === 'en' ? 'Color' : 'Цвет'}
          </label>
          <div className="relative w-8 h-8 rounded-lg border border-zinc-800 flex items-center justify-center bg-zinc-950 cursor-pointer hover:border-zinc-700 transition">
            <input
              type="color"
              value={focusedBlock.customDescColor || '#a1a1aa'}
              onChange={(e) => updateFocusedBlock(() => ({ customDescColor: e.target.value }))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div 
              className="w-4 h-4 rounded border border-zinc-700 shadow-inner"
              style={{ backgroundColor: focusedBlock.customDescColor || '#a1a1aa' }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <TextFormatToolbar 
          styles={focusedBlock.descTextStyles} 
          onChange={(styles) => updateFocusedBlock(() => ({ descTextStyles: styles }))}
        />
      </div>

      {/* Description Font Size Slider */}
      <div className="space-y-1 mt-1 bg-zinc-900/10 p-2 rounded-xl border border-zinc-900">
        <div className="flex justify-between items-center text-[8px] font-bold text-zinc-500 uppercase">
          <span>{lang === 'en' ? 'Desc Font Size' : 'Размер шрифта описания'}</span>
          <span className="font-mono text-zinc-400">
            {focusedBlock.customDescFontSize !== undefined ? focusedBlock.customDescFontSize : 11}px
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={focusedBlock.customDescFontSize !== undefined ? focusedBlock.customDescFontSize : 11}
          onChange={(e) => updateFocusedBlock(() => ({ customDescFontSize: parseInt(e.target.value) }))}
          className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
        />
        <TextStylesEditor 
          styles={focusedBlock.descTextStyles} 
          onChange={(styles) => updateFocusedBlock(() => ({ descTextStyles: styles }))}
          lang={lang}
        />
      </div>
      {/* SECTION: PHOTO */}
      <div className="pt-3 border-t border-zinc-800/60" />
      <div className="text-[10px] font-black uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
        <span className="w-1.5 h-3.5 bg-orange-500 rounded-full" />
        <span>{lang === 'en' ? 'Product Photo' : 'ФОТО ТОВАРА'}</span>
      </div>

      <div>
        <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1.5 flex items-center justify-between">
          <span>Product Photo</span>
          {isCompressing && <span className="text-[8px] text-amber-400 animate-pulse">Compressing...</span>}
        </label>
        <div className="flex items-center gap-3">
          {item.image && <img src={item.image} className="w-9 h-9 rounded object-cover border border-zinc-800" />}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file, focusedBlock.id, 'catalog');
            }}
            className="text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:bg-zinc-800 file:text-white cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
