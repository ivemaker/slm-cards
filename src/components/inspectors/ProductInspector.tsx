import React from 'react';
import { Block } from '../../types';
import { TextStylesEditor, TextFormatToolbar } from './TextStylesEditor';
import { compressImage } from '../../utils';

interface ProductInspectorProps {
  focusedBlock: Block;
  lang: 'en' | 'ru';
  updateFocusedBlock: (updateFn: (b: Block) => Partial<Block>) => void;
  handleImageUpload: (file: File, blockId: string, type: 'profile' | 'catalog') => void;
  isCompressing: boolean;
}

export const ProductInspector: React.FC<ProductInspectorProps> = ({
  focusedBlock,
  lang,
  updateFocusedBlock,
  handleImageUpload,
  isCompressing,
}) => {
  const item = focusedBlock.productContent!;
  const [localCompressing, setLocalCompressing] = React.useState<Record<number, boolean>>({});

  const images = item.images && item.images.length > 0 
    ? item.images 
    : [item.image || '/misty_rainy_forest_1781780284992.jpg'];

  const handleUploadSlot = async (file: File, index: number) => {
    setLocalCompressing(prev => ({ ...prev, [index]: true }));
    try {
      const base64 = await compressImage(file, 600, 600);
      updateFocusedBlock(b => {
        const p = b.productContent!;
        const currentImages = p.images && p.images.length > 0 ? [...p.images] : [p.image || '/misty_rainy_forest_1781780284992.jpg'];
        while (currentImages.length <= index) {
          currentImages.push('/misty_rainy_forest_1781780284992.jpg');
        }
        currentImages[index] = base64;
        return {
          productContent: {
            ...p,
            images: currentImages,
            image: index === 0 ? base64 : (p.image || base64)
          }
        };
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLocalCompressing(prev => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="space-y-4">
      {/* SECTION: TITLE, OLD PRICE & PRICE */}
      <div className="text-[10px] font-black uppercase text-orange-500 tracking-wider flex items-center gap-1.5 mt-1.5">
        <span className="w-1.5 h-3.5 bg-orange-500 rounded-full" />
        <span>{lang === 'en' ? 'Product Details' : 'ДЕТАЛИ ТОВАРА'}</span>
      </div>

      {/* Name block with Font selection, name text and Color picker */}
      <div className="flex gap-2 items-end">
        {/* Name Input */}
        <div className="flex-1">
          <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1 truncate">
            {lang === 'en' ? 'Product Name' : 'Название товара'}
          </label>
          <input
            type="text"
            value={item.name}
            onChange={(e) => updateFocusedBlock(b => ({ productContent: { ...b.productContent!, name: e.target.value } }))}
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
          <span>{lang === 'en' ? 'Title Font Size' : 'Размер шрифта названия'}</span>
          <span className="font-mono text-zinc-400">
            {focusedBlock.customTitleFontSize !== undefined ? focusedBlock.customTitleFontSize : 13}px
          </span>
        </div>
        <input
          type="range"
          min="12"
          max="100"
          value={focusedBlock.customTitleFontSize !== undefined ? focusedBlock.customTitleFontSize : 13}
          onChange={(e) => updateFocusedBlock(() => ({ customTitleFontSize: parseInt(e.target.value) }))}
          className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
        />
        <TextStylesEditor 
          styles={focusedBlock.titleTextStyles} 
          onChange={(styles) => updateFocusedBlock(() => ({ titleTextStyles: styles }))}
          lang={lang}
        />
      </div>

      {/* Button Text */}
      <div>
        <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1">
          {lang === 'en' ? 'Button Label' : 'Текст кнопки'}
        </label>
        <input
          type="text"
          value={item.buttonText || ''}
          onChange={(e) => updateFocusedBlock(b => ({ productContent: { ...b.productContent!, buttonText: e.target.value } }))}
          placeholder={lang === 'en' ? 'Buy Now' : 'Купить'}
          className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-lg p-2 text-white outline-none"
        />
      </div>

      {/* SECTION: LAYOUT & IMAGE SIZE */}
      <div className="pt-3 border-t border-zinc-800/60" />
      <div className="text-[10px] font-black uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
        <span className="w-1.5 h-3.5 bg-orange-500 rounded-full" />
        <span>{lang === 'en' ? 'Layout & Image Settings' : 'РАЗМЕТКА И РАЗМЕР ФОТО'}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800/60">
        <div>
          <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1">
            {lang === 'en' ? 'Image Layout' : 'Расположение фото'}
          </label>
          <select
            value={item.imageLayout || 'left'}
            onChange={(e) => updateFocusedBlock(b => ({ productContent: { ...b.productContent!, imageLayout: e.target.value as any } }))}
            className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-lg p-2 text-white focus:outline-none cursor-pointer"
          >
            <option value="left">{lang === 'en' ? 'Left' : 'Слева'}</option>
            <option value="center">{lang === 'en' ? 'Center' : 'По центру'}</option>
            <option value="right">{lang === 'en' ? 'Right' : 'Справа'}</option>
          </select>
        </div>

        <div>
          <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1">
            {lang === 'en' ? 'Image Size' : 'Размер фото'}
          </label>
          <select
            value={item.imageSize || 'md'}
            onChange={(e) => updateFocusedBlock(b => ({ productContent: { ...b.productContent!, imageSize: e.target.value as any } }))}
            className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-lg p-2 text-white focus:outline-none cursor-pointer"
          >
            <option value="sm">{lang === 'en' ? 'Small (sm)' : 'Маленький (sm)'}</option>
            <option value="md">{lang === 'en' ? 'Medium (md)' : 'Средний (md)'}</option>
            <option value="lg">{lang === 'en' ? 'Large (lg)' : 'Большой (lg)'}</option>
          </select>
        </div>
      </div>

      {/* SECTION: PRICING */}
      <div className="pt-3 border-t border-zinc-800/60" />
      <div className="text-[10px] font-black uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
        <span className="w-1.5 h-3.5 bg-orange-500 rounded-full" />
        <span>{lang === 'en' ? 'Pricing Config' : 'НАСТРОЙКА ЦЕН'}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1">
            {lang === 'en' ? 'Current Price ($)' : 'Текущая цена ($)'}
          </label>
          <input
            type="number"
            step="0.01"
            value={item.price}
            onChange={(e) => updateFocusedBlock(b => ({ productContent: { ...b.productContent!, price: parseFloat(e.target.value) || 0 } }))}
            className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-lg p-2 text-white outline-none font-mono"
          />
        </div>

        <div>
          <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1">
            {lang === 'en' ? 'Old Price ($)' : 'Старая цена ($)'}
          </label>
          <input
            type="number"
            step="0.01"
            value={item.oldPrice || ''}
            onChange={(e) => updateFocusedBlock(b => ({ productContent: { ...b.productContent!, oldPrice: parseFloat(e.target.value) || undefined } }))}
            placeholder="0.00"
            className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-lg p-2 text-white outline-none font-mono"
          />
        </div>
      </div>

      {/* SECTION: PRICE & OLD PRICE STYLE */}
      <div className="pt-3 border-t border-zinc-800/60" />
      <div className="text-[10px] font-black uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
        <span className="w-1.5 h-3.5 bg-orange-500 rounded-full" />
        <span>{lang === 'en' ? 'Price & Old Price Styling' : 'СТИЛИЗАЦИЯ ЦЕНЫ'}</span>
      </div>

      <div className="bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800/60 space-y-3">
        {/* Price typography */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[9px] uppercase font-bold text-zinc-400 tracking-wider">
            <span>{lang === 'en' ? 'Price Font Size' : 'Размер цены'}</span>
            <span className="font-mono text-zinc-400 text-[10px]">{item.priceSize || 16}px</span>
          </div>
          <input
            type="range"
            min="12"
            max="28"
            value={item.priceSize !== undefined ? item.priceSize : 16}
            onChange={(e) => updateFocusedBlock(b => ({ productContent: { ...b.productContent!, priceSize: parseInt(e.target.value) } }))}
            className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
          />

          <div className="flex gap-2 items-center pt-1">
            <div className="flex-1">
              <label className="block text-[8px] uppercase font-bold text-zinc-500 tracking-wider mb-1">
                {lang === 'en' ? 'Price Color' : 'Цвет цены'}
              </label>
              <div className="relative w-full h-8 rounded-lg border border-zinc-800 flex items-center justify-center bg-zinc-900 cursor-pointer hover:border-zinc-700 transition">
                <input
                  type="color"
                  value={item.priceColor || '#ffffff'}
                  onChange={(e) => updateFocusedBlock(b => ({ productContent: { ...b.productContent!, priceColor: e.target.value } }))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div 
                  className="w-4 h-4 rounded border border-zinc-700 shadow-inner"
                  style={{ backgroundColor: item.priceColor || '#ffffff' }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateFocusedBlock(b => ({ productContent: { ...b.productContent!, priceColor: '#ffffff' } }))}
              className="text-[9px] text-zinc-400 hover:text-white uppercase font-bold border border-zinc-800 h-8 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 shrink-0 self-end"
            >
              {lang === 'en' ? 'Reset' : 'Сброс'}
            </button>
          </div>
        </div>

        {/* Old Price typography */}
        <div className="space-y-1.5 pt-2 border-t border-zinc-800/30">
          <div className="flex justify-between items-center text-[9px] uppercase font-bold text-zinc-400 tracking-wider">
            <span>{lang === 'en' ? 'Old Price Font Size' : 'Размер старой цены'}</span>
            <span className="font-mono text-zinc-400 text-[10px]">{item.oldPriceSize || 12}px</span>
          </div>
          <input
            type="range"
            min="10"
            max="20"
            value={item.oldPriceSize !== undefined ? item.oldPriceSize : 12}
            onChange={(e) => updateFocusedBlock(b => ({ productContent: { ...b.productContent!, oldPriceSize: parseInt(e.target.value) } }))}
            className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
          />

          <div className="flex gap-2 items-center pt-1">
            <div className="flex-1">
              <label className="block text-[8px] uppercase font-bold text-zinc-500 tracking-wider mb-1">
                {lang === 'en' ? 'Old Price Color' : 'Цвет старой цены'}
              </label>
              <div className="relative w-full h-8 rounded-lg border border-zinc-800 flex items-center justify-center bg-zinc-900 cursor-pointer hover:border-zinc-700 transition">
                <input
                  type="color"
                  value={item.oldPriceColor || '#a1a1aa'}
                  onChange={(e) => updateFocusedBlock(b => ({ productContent: { ...b.productContent!, oldPriceColor: e.target.value } }))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div 
                  className="w-4 h-4 rounded border border-zinc-700 shadow-inner"
                  style={{ backgroundColor: item.oldPriceColor || '#a1a1aa' }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateFocusedBlock(b => ({ productContent: { ...b.productContent!, oldPriceColor: 'rgba(255,255,255,0.4)' } }))}
              className="text-[9px] text-zinc-400 hover:text-white uppercase font-bold border border-zinc-800 h-8 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 shrink-0 self-end"
            >
              {lang === 'en' ? 'Reset' : 'Сброс'}
            </button>
          </div>
        </div>

        {/* Button typography */}
        <div className="space-y-1.5 pt-2 border-t border-zinc-800/30">
          <div className="flex justify-between items-center text-[9px] uppercase font-bold text-zinc-400 tracking-wider">
            <span>{lang === 'en' ? 'Button Font Size' : 'Размер кнопки'}</span>
            <span className="font-mono text-zinc-400 text-[10px]">{item.buttonSize || 13}px</span>
          </div>
          <input
            type="range"
            min="10"
            max="20"
            value={item.buttonSize !== undefined ? item.buttonSize : 13}
            onChange={(e) => updateFocusedBlock(b => ({ productContent: { ...b.productContent!, buttonSize: parseInt(e.target.value) } }))}
            className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
          />
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
            onChange={(e) => updateFocusedBlock(b => ({ productContent: { ...b.productContent!, description: e.target.value } }))}
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

      {/* File Upload */}
      <div className="space-y-4">
        {(item.imageLayout === 'center' ? [0, 1, 2] : [0]).map((idx) => {
          const imgUrl = images[idx] || '';
          return (
            <div key={idx} className="bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800/60 space-y-2">
              <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider flex items-center justify-between">
                <span>
                  {item.imageLayout === 'center'
                    ? `${lang === 'en' ? 'Image' : 'Изображение'} ${idx + 1}`
                    : (lang === 'en' ? 'Upload Local File' : 'Загрузите файл')}
                </span>
                {(isCompressing || localCompressing[idx]) && (
                  <span className="text-[8px] text-amber-400 animate-pulse">Compressing...</span>
                )}
              </label>
              <div className="flex items-center gap-3">
                {imgUrl ? (
                  <img src={imgUrl} className="w-12 h-12 rounded object-cover border border-zinc-800 shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded bg-zinc-950 border border-zinc-900 flex items-center justify-center text-xs text-zinc-600 shrink-0">
                    No img
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadSlot(file, idx);
                  }}
                  className="text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:bg-zinc-800 file:text-white cursor-pointer w-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
