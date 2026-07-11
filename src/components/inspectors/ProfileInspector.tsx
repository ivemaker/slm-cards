import React from 'react';
import { Block } from '../../types';
import { compressImage } from '../../utils';
import { TextStylesEditor, TextFormatToolbar } from './TextStylesEditor';
import { useDev } from '../../context/DevContext';

interface ProfileInspectorProps {
  focusedBlock: Block;
  viewMode: 'desktop' | 'mobile' | 'tablet';
  lang: 'en' | 'ru';
  translations: any;
  updateFocusedBlock: (updateFn: (b: Block) => Partial<Block>) => void;
  handleImageUpload: (file: File, blockId: string, type: 'profile' | 'catalog') => void;
  isCompressing: boolean;
  setLocalStorageUploading: (loading: boolean) => void;
  localStorageUploading: boolean;
}

export const ProfileInspector: React.FC<ProfileInspectorProps> = ({
  focusedBlock,
  viewMode,
  lang,
  translations,
  updateFocusedBlock,
  handleImageUpload,
  isCompressing,
  setLocalStorageUploading,
  localStorageUploading,
}) => {
  const { planType } = useDev();
  const profile = focusedBlock.profileContent!;

  const handlePremiumClick = (e: React.MouseEvent) => {
    if (planType === 'basic') {
      e.preventDefault();
      e.stopPropagation();
      alert("👑 Этот эффект доступен только для Premium проектов. Переключите тариф проекта на Premium в панели разработчика для тестирования!");
    }
  };

  const isSvgOrPng = profile.avatar?.startsWith('data:image/svg') || 
                     profile.avatar?.startsWith('data:image/png') || 
                     profile.avatar?.startsWith('data:image/gif') ||
                     !!profile.avatarSvgRaw;

  const baseWidth = viewMode === 'mobile' ? 375 : 720;
  let horizontalPadding = 0;
  if (!focusedBlock.fullWidth) {
    if (focusedBlock.padding === 'small') horizontalPadding = 32;
    else if (focusedBlock.padding === 'medium') horizontalPadding = 48;
    else if (focusedBlock.padding === 'large') horizontalPadding = 64;
  }
  const maxAvatarSize = baseWidth - horizontalPadding;

  const txtShowAvatar = lang === 'en' ? 'Show Avatar Icon' : 'Показывать аватарку';
  const txtAvatarShape = lang === 'en' ? 'Avatar Form Style' : 'Форма авы';
  const txtLayout = lang === 'en' ? 'Layout Orientation' : 'Расположение (Вёрстка)';
  const txtAlign = lang === 'en' ? 'Text Align' : 'Выравнивание текста';
  const txtFullWidth = lang === 'en' ? 'Full Width Card' : 'На всю ширину';
  const txtBgImage = lang === 'en' ? 'Custom Background Cover' : 'Свой фоновый баннер';
  
  // Highly robust updater that ensures we always merge with current profile content and don't lose any other properties.
  const updateProfileContent = (updatedFields: Partial<NonNullable<Block['profileContent']>>) => {
    updateFocusedBlock(b => {
      const currentContent = b.profileContent || { name: '', bio: '' };
      const nextProfile = {
        ...currentContent,
        ...updatedFields
      };
      const updates: Partial<Block> = {
        profileContent: nextProfile
      };
      if (updatedFields.fullWidth !== undefined) {
        updates.fullWidth = updatedFields.fullWidth;
      }
      return updates;
    });
  };

  return (
    <div className="space-y-3.5">
      <div className="flex gap-2 items-end">
        {/* Name Input Field */}
        <div className="flex-1">
          <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1 truncate">{translations.block_profile_name}</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => updateProfileContent({ name: e.target.value })}
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
          <span>{lang === 'en' ? 'Name Font Size' : 'Размер шрифта имени'}</span>
          <span className="font-mono text-zinc-400">
            {focusedBlock.customTitleFontSize !== undefined ? focusedBlock.customTitleFontSize : 20}px
          </span>
        </div>
        <input
          type="range"
          min="12"
          max="100"
          value={focusedBlock.customTitleFontSize !== undefined ? focusedBlock.customTitleFontSize : 20}
          onChange={(e) => updateFocusedBlock(() => ({ customTitleFontSize: parseInt(e.target.value) }))}
          className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
        />
        <TextStylesEditor 
          styles={focusedBlock.titleTextStyles} 
          onChange={(styles) => updateFocusedBlock(() => ({ titleTextStyles: styles }))}
          lang={lang}
        />
      </div>

      {/* Bio / Tagline with Font, Color Picker and Size Slider */}
      <div className="flex gap-2 items-end">
        {/* Bio Textarea Input */}
        <div className="flex-1">
          <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1 truncate">
            {translations.block_profile_bio}
          </label>
          <textarea
            rows={3}
            value={profile.bio}
            onChange={(e) => updateProfileContent({ bio: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-lg p-2 text-white focus:outline-none leading-relaxed"
          />
        </div>

        {/* Font Family Dropdown for Description */}
        <div className="w-[110px] flex-shrink-0">
          <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1 truncate">
            {lang === 'en' ? 'Bio Font' : 'Шрифт био'}
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
          <span>{lang === 'en' ? 'Bio Font Size' : 'Размер шрифта био / подписи'}</span>
          <span className="font-mono text-zinc-400">
            {focusedBlock.customDescFontSize !== undefined ? focusedBlock.customDescFontSize : 12}px
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={focusedBlock.customDescFontSize !== undefined ? focusedBlock.customDescFontSize : 12}
          onChange={(e) => updateFocusedBlock(() => ({ customDescFontSize: parseInt(e.target.value) }))}
          className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
        />
        <TextStylesEditor 
          styles={focusedBlock.descTextStyles} 
          onChange={(styles) => updateFocusedBlock(() => ({ descTextStyles: styles }))}
          lang={lang}
        />
      </div>

      <div className="flex items-center justify-between p-2.5 bg-zinc-900/40 rounded-lg border border-zinc-800/80">
        <span className="text-xs text-zinc-300 font-medium">{txtShowAvatar}</span>
        <input
          type="checkbox"
          checked={profile.showAvatar !== false}
          onChange={(e) => updateProfileContent({ showAvatar: e.target.checked })}
          className="w-4 h-4 text-emerald-600 bg-zinc-950 rounded cursor-pointer"
        />
      </div>

      {profile.showAvatar !== false && (
        <div className="space-y-3 p-2.5 bg-zinc-900/40 rounded-lg border border-zinc-800/80">
          <div className={isSvgOrPng ? 'opacity-50 pointer-events-none' : ''}>
            <label className="block text-[8px] uppercase font-mono font-bold text-zinc-400 tracking-wider mb-1">
              {lang === 'en' ? 'Shape / Form' : 'Форма авы'}
            </label>
            <select
              value={profile.avatarShape || 'circle'}
              onChange={(e) => updateProfileContent({ avatarShape: e.target.value as any })}
              disabled={isSvgOrPng}
              className="w-full bg-zinc-950 border border-zinc-800 text-xs rounded-lg p-2 text-white cursor-pointer disabled:opacity-50"
            >
              <option value="circle">Circle</option>
              <option value="square">Square</option>
              <option value="rounded">Rounded</option>
              <option value="none">None</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {profile.avatar && (
              <div className="w-9 h-9 border border-zinc-700 rounded-lg overflow-hidden bg-transparent flex items-center justify-center flex-shrink-0 relative">
                {profile.avatarSvgRaw ? (
                  <div 
                    className="w-full h-full p-1 flex items-center justify-center text-white"
                    dangerouslySetInnerHTML={{ 
                      __html: profile.avatarSvgColor 
                        ? profile.avatarSvgRaw
                            .replace(/fill="((?!none)[^"]+)"/g, `fill="${profile.avatarSvgColor}"`)
                            .replace(/stroke="((?!none)[^"]+)"/g, `stroke="${profile.avatarSvgColor}"`)
                        : profile.avatarSvgRaw 
                    }} 
                  />
                ) : (
                  <img src={profile.avatar} className="w-full h-full object-cover" />
                )}
              </div>
            )}
            <input
              type="file"
              accept="image/*,.svg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, focusedBlock.id, 'profile');
              }}
              className="text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:bg-zinc-800 file:text-white cursor-pointer"
            />
          </div>

          {profile.avatarSvgRaw && (
            <div className="pt-2.5 border-t border-zinc-850 space-y-1.5 animate-slide-up">
              <span className="block text-[8px] uppercase font-mono font-bold text-zinc-400 tracking-wider">
                🎨 {lang === 'en' ? 'Replace SVG Vector Color' : 'Заменить цвет SVG вектора'}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 items-center bg-zinc-950 p-1.5 rounded-lg border border-zinc-800 flex-1">
                  <input
                    type="color"
                    value={profile.avatarSvgColor || '#ffffff'}
                    onChange={(e) => updateProfileContent({ avatarSvgColor: e.target.value })}
                    className="w-5.5 h-5.5 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={profile.avatarSvgColor ? profile.avatarSvgColor.toUpperCase() : ''}
                    placeholder={lang === 'en' ? 'Original Colors' : 'Исходные цвета'}
                    onChange={(e) => updateProfileContent({ avatarSvgColor: e.target.value || undefined })}
                    className="w-full bg-transparent text-[10px] text-zinc-300 p-0 font-mono focus:outline-none uppercase border-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-zinc-850">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[8px] uppercase font-mono font-bold text-zinc-400 tracking-wider">
                {lang === 'en' ? 'Avatar Size' : 'Размер аватара'}
              </label>
              <span className="text-[10px] font-mono text-zinc-400 font-bold">{profile.avatarSize || 80}px</span>
            </div>
            <input
              type="range"
              min={40}
              max={maxAvatarSize}
              value={Math.min(profile.avatarSize || 80, maxAvatarSize)}
              onChange={(e) => updateProfileContent({ avatarSize: Math.min(parseInt(e.target.value, 10), maxAvatarSize) })}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Border (Contour) Settings */}
          <div className="pt-2.5 border-t border-zinc-850 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                {lang === 'en' ? 'Avatar Outline' : 'Контур аватара'}
              </span>
              <input
                type="checkbox"
                checked={profile.avatarBorderEnabled === true}
                onChange={(e) => updateProfileContent({ avatarBorderEnabled: e.target.checked })}
                className="w-3.5 h-3.5 text-emerald-600 bg-zinc-950 rounded cursor-pointer"
              />
            </div>
            {profile.avatarBorderEnabled && (
              <div className="grid grid-cols-2 gap-2 bg-zinc-950/40 p-2 rounded-lg border border-zinc-850/60">
                <div className="space-y-1">
                  <span className="text-[8px] text-zinc-500 uppercase">{lang === 'en' ? 'Width' : 'Толщина'}</span>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={profile.avatarBorderWidth ?? 2}
                    onChange={(e) => updateProfileContent({ avatarBorderWidth: parseInt(e.target.value, 10) })}
                    className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded-lg cursor-pointer"
                  />
                  <span className="block text-[8px] font-mono text-zinc-400 text-right">{profile.avatarBorderWidth ?? 2}px</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] text-zinc-500 uppercase">{lang === 'en' ? 'Style' : 'Стиль'}</span>
                  <select
                    value={profile.avatarBorderStyle ?? 'solid'}
                    onChange={(e) => updateProfileContent({ avatarBorderStyle: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-[10px] rounded p-1 text-white cursor-pointer"
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                    <option value="double">Double</option>
                  </select>
                </div>

                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-[8px] text-zinc-500 uppercase">{lang === 'en' ? 'Color' : 'Цвет'}</span>
                  <div className="relative w-7 h-7 rounded border border-zinc-800 flex items-center justify-center bg-zinc-950 cursor-pointer">
                    <input
                      type="color"
                      value={profile.avatarBorderColor ?? '#ffffff'}
                      onChange={(e) => updateProfileContent({ avatarBorderColor: e.target.value })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: profile.avatarBorderColor ?? '#ffffff' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Drop Shadow Settings */}
          <div className="pt-2.5 border-t border-zinc-850 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                {lang === 'en' ? 'Drop Shadow' : 'Отбрасывание тени'}
              </span>
              <input
                type="checkbox"
                checked={profile.avatarShadowEnabled === true}
                onChange={(e) => updateProfileContent({ avatarShadowEnabled: e.target.checked })}
                className="w-3.5 h-3.5 text-emerald-600 bg-zinc-950 rounded cursor-pointer"
              />
            </div>
            {profile.avatarShadowEnabled && (
              <div className="space-y-2 bg-zinc-950/40 p-2 rounded-lg border border-zinc-850/60 text-[10px]">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[8px] text-zinc-500 uppercase">{lang === 'en' ? 'Blur' : 'Размытие'}</span>
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={profile.avatarShadowBlur ?? 8}
                      onChange={(e) => updateProfileContent({ avatarShadowBlur: parseInt(e.target.value, 10) })}
                      className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded-lg cursor-pointer"
                    />
                    <span className="block text-[8px] font-mono text-zinc-400 text-right">{profile.avatarShadowBlur ?? 8}px</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] text-zinc-500 uppercase">{lang === 'en' ? 'Opacity' : 'Прозрачность'}</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={profile.avatarShadowOpacity ?? 40}
                      onChange={(e) => updateProfileContent({ avatarShadowOpacity: parseInt(e.target.value, 10) })}
                      className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded-lg cursor-pointer"
                    />
                    <span className="block text-[8px] font-mono text-zinc-400 text-right">{profile.avatarShadowOpacity ?? 40}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[8px] text-zinc-500 uppercase">{lang === 'en' ? 'Offset X' : 'Смещение X'}</span>
                    <input
                      type="range"
                      min={-20}
                      max={20}
                      value={profile.avatarShadowOffsetX ?? 0}
                      onChange={(e) => updateProfileContent({ avatarShadowOffsetX: parseInt(e.target.value, 10) })}
                      className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded-lg cursor-pointer"
                    />
                    <span className="block text-[8px] font-mono text-zinc-400 text-right">{profile.avatarShadowOffsetX ?? 0}px</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] text-zinc-500 uppercase">{lang === 'en' ? 'Offset Y' : 'Смещение Y'}</span>
                    <input
                      type="range"
                      min={-20}
                      max={20}
                      value={profile.avatarShadowOffsetY ?? 4}
                      onChange={(e) => updateProfileContent({ avatarShadowOffsetY: parseInt(e.target.value, 10) })}
                      className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded-lg cursor-pointer"
                    />
                    <span className="block text-[8px] font-mono text-zinc-400 text-right">{profile.avatarShadowOffsetY ?? 4}px</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[8px] text-zinc-500 uppercase">{lang === 'en' ? 'Color' : 'Цвет тени'}</span>
                  <div className="relative w-7 h-7 rounded border border-zinc-800 flex items-center justify-center bg-zinc-950 cursor-pointer">
                    <input
                      type="color"
                      value={profile.avatarShadowColor ?? '#000000'}
                      onChange={(e) => updateProfileContent({ avatarShadowColor: e.target.value })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: profile.avatarShadowColor ?? '#000000' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Avatar Effects (Glow, Shimmer, Glass) */}
          <div className="pt-2.5 border-t border-zinc-850 space-y-2">
            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              {lang === 'en' ? 'Avatar Effects' : 'Эффекты авы'}
            </span>
            <div 
              onClickCapture={handlePremiumClick}
              className={`bg-zinc-950/30 p-2 rounded-lg border border-zinc-850/50 space-y-1.5 transition-all duration-200 ${
                planType === 'basic' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-semibold text-zinc-300 flex items-center">
                  {lang === 'en' ? 'Backlight Glow' : 'Свечение за иконкой'}
                  <span className="text-[8px] bg-amber-500/20 text-amber-400 px-1 py-0.2 rounded ml-1.5 font-bold">PRO</span>
                </span>
                <input
                  type="checkbox"
                  checked={profile.avatarGlowEnabled === true}
                  onChange={(e) => updateProfileContent({ avatarGlowEnabled: e.target.checked })}
                  disabled={planType === 'basic'}
                  className="w-3 h-3 text-emerald-600 bg-zinc-950 rounded cursor-pointer disabled:cursor-not-allowed"
                />
              </div>
              {profile.avatarGlowEnabled && (
                <div className="space-y-2 pt-1 border-t border-zinc-900/60">
                  <div className="grid grid-cols-2 gap-2 text-[8px]">
                    <div className="space-y-1">
                      <span className="text-zinc-500 uppercase">{lang === 'en' ? 'Radius' : 'Радиус'}</span>
                      <input
                        type="range"
                        min={5}
                        max={80}
                        value={profile.avatarGlowRadius ?? 20}
                        onChange={(e) => updateProfileContent({ avatarGlowRadius: parseInt(e.target.value, 10) })}
                        disabled={planType === 'basic'}
                        className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="block font-mono text-zinc-400 text-right">{profile.avatarGlowRadius ?? 20}px</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-zinc-500 uppercase">{lang === 'en' ? 'Intensity' : 'Интенсивность'}</span>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={profile.avatarGlowIntensity ?? 50}
                        onChange={(e) => updateProfileContent({ avatarGlowIntensity: parseInt(e.target.value, 10) })}
                        disabled={planType === 'basic'}
                        className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="block font-mono text-zinc-400 text-right">{profile.avatarGlowIntensity ?? 50}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[8px]">
                    <span className="text-zinc-500 uppercase">{lang === 'en' ? 'Glow Color' : 'Цвет свечения'}</span>
                    <div className="relative w-6 h-6 rounded border border-zinc-800 flex items-center justify-center bg-zinc-950 cursor-pointer">
                      <input
                        type="color"
                        value={profile.avatarGlowColor ?? '#6366f1'}
                        onChange={(e) => updateProfileContent({ avatarGlowColor: e.target.value })}
                        disabled={planType === 'basic'}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: profile.avatarGlowColor ?? '#6366f1' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Running Sheen/Shimmer */}
            <div 
              onClickCapture={handlePremiumClick}
              className={`bg-zinc-950/30 p-2 rounded-lg border border-zinc-850/50 space-y-1.5 transition-all duration-200 ${
                isSvgOrPng ? 'opacity-50 pointer-events-none' : ''
              } ${planType === 'basic' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-semibold text-zinc-300 flex items-center">
                  {lang === 'en' ? 'Running Sheen' : 'Пробегающий блик'}
                  <span className="text-[8px] bg-amber-500/20 text-amber-400 px-1 py-0.2 rounded ml-1.5 font-bold">PRO</span>
                </span>
                <input
                  type="checkbox"
                  checked={profile.avatarShimmerEnabled === true}
                  onChange={(e) => updateProfileContent({ avatarShimmerEnabled: e.target.checked })}
                  disabled={isSvgOrPng || planType === 'basic'}
                  className="w-3 h-3 text-emerald-600 bg-zinc-950 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              {profile.avatarShimmerEnabled && (
                <div className="space-y-2 pt-1 border-t border-zinc-900/60 text-[8px]">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-zinc-500 uppercase">{lang === 'en' ? 'Speed' : 'Скорость'}</span>
                      <input
                        type="range"
                        min={0.5}
                        max={5.0}
                        step={0.1}
                        value={profile.avatarShimmerSpeed ?? 2.0}
                        onChange={(e) => updateProfileContent({ avatarShimmerSpeed: parseFloat(e.target.value) })}
                        disabled={planType === 'basic'}
                        className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="block font-mono text-zinc-400 text-right">{profile.avatarShimmerSpeed ?? 2.0}s</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-zinc-500 uppercase">{lang === 'en' ? 'Interval' : 'Период'}</span>
                      <input
                        type="range"
                        min={0.0}
                        max={10.0}
                        step={0.5}
                        value={profile.avatarShimmerInterval ?? 3.0}
                        onChange={(e) => updateProfileContent({ avatarShimmerInterval: parseFloat(e.target.value) })}
                        disabled={planType === 'basic'}
                        className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="block font-mono text-zinc-400 text-right">{profile.avatarShimmerInterval ?? 3.0}s</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-zinc-500 uppercase">{lang === 'en' ? 'Sheen Width' : 'Толщина блика'}</span>
                      <input
                        type="range"
                        min={5}
                        max={100}
                        step={5}
                        value={profile.avatarShimmerWidth ?? 30}
                        onChange={(e) => updateProfileContent({ avatarShimmerWidth: parseInt(e.target.value, 10) })}
                        disabled={planType === 'basic'}
                        className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="block font-mono text-zinc-400 text-right">{profile.avatarShimmerWidth ?? 30}%</span>
                    </div>

                    <div className="space-y-1 flex flex-col justify-end">
                      <div className="flex items-center justify-between h-5">
                        <span className="text-zinc-500 uppercase">{lang === 'en' ? 'Color' : 'Цвет'}</span>
                        <div className="relative w-5 h-5 rounded border border-zinc-800 flex items-center justify-center bg-zinc-950 cursor-pointer">
                          <input
                            type="color"
                            value={profile.avatarShimmerColor ?? '#ffffff'}
                            onChange={(e) => updateProfileContent({ avatarShimmerColor: e.target.value })}
                            disabled={planType === 'basic'}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          />
                          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: profile.avatarShimmerColor ?? '#ffffff' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Overlay Glass effect */}
            <div 
              onClickCapture={handlePremiumClick}
              className={`bg-zinc-950/30 p-2 rounded-lg border border-zinc-850/50 space-y-1.5 transition-all duration-200 ${
                isSvgOrPng ? 'opacity-50 pointer-events-none' : ''
              } ${planType === 'basic' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-semibold text-zinc-300 flex items-center">
                  {lang === 'en' ? 'Glass Overlay' : 'Стекло с бликом'}
                  <span className="text-[8px] bg-amber-500/20 text-amber-400 px-1 py-0.2 rounded ml-1.5 font-bold">PRO</span>
                </span>
                <input
                  type="checkbox"
                  checked={profile.avatarGlassEnabled === true}
                  onChange={(e) => updateProfileContent({ avatarGlassEnabled: e.target.checked })}
                  disabled={isSvgOrPng || planType === 'basic'}
                  className="w-3 h-3 text-emerald-600 bg-zinc-950 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              {profile.avatarGlassEnabled && (
                <div className="space-y-2 pt-1 border-t border-zinc-900/60 text-[8px]">
                  <div className="space-y-1">
                    <span className="text-zinc-500 uppercase">{lang === 'en' ? 'Glass Style' : 'Тип стекла'}</span>
                    <select
                      value={profile.avatarGlassType ?? 'dome'}
                      onChange={(e) => updateProfileContent({ avatarGlassType: e.target.value as any })}
                      disabled={planType === 'basic'}
                      className="w-full bg-zinc-900 border border-zinc-800 text-[10px] rounded p-1 text-white cursor-pointer disabled:cursor-not-allowed"
                    >
                      <option value="dome">{lang === 'en' ? '3D Spherical Dome' : '3D Сферический купол'}</option>
                      <option value="retro">{lang === 'en' ? 'Retro Gloss (Web 2.0)' : 'Ретро-глянец (Web 2.0)'}</option>
                      <option value="flat">{lang === 'en' ? 'Flat Glass Plate' : 'Плоская стеклянная пластина'}</option>
                      <option value="crystal">{lang === 'en' ? 'Facet Crystal Glass' : 'Кристальные грани'}</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-zinc-500 uppercase">{lang === 'en' ? 'Opacity' : 'Прозрачность'}</span>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={profile.avatarGlassOpacity ?? 40}
                        onChange={(e) => updateProfileContent({ avatarGlassOpacity: parseInt(e.target.value, 10) })}
                        disabled={planType === 'basic'}
                        className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="block font-mono text-zinc-400 text-right">{profile.avatarGlassOpacity ?? 40}%</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-zinc-500 uppercase">{lang === 'en' ? 'Reflection' : 'Отражение'}</span>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={profile.avatarGlassReflectIntensity ?? 60}
                        onChange={(e) => updateProfileContent({ avatarGlassReflectIntensity: parseInt(e.target.value, 10) })}
                        disabled={planType === 'basic'}
                        className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="block font-mono text-zinc-400 text-right">{profile.avatarGlassReflectIntensity ?? 60}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-zinc-500 uppercase">{lang === 'en' ? 'Glare Blur' : 'Размытие блика'}</span>
                      <input
                        type="range"
                        min={0}
                        max={20}
                        value={profile.avatarGlassBlur ?? 0}
                        onChange={(e) => updateProfileContent({ avatarGlassBlur: parseInt(e.target.value, 10) })}
                        disabled={planType === 'basic'}
                        className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="block font-mono text-zinc-400 text-right">{profile.avatarGlassBlur ?? 0}px</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-zinc-500 uppercase">{lang === 'en' ? 'Glare Angle' : 'Поворот блика'}</span>
                      <input
                        type="range"
                        min={0}
                        max={360}
                        value={profile.avatarGlassAngle ?? 0}
                        onChange={(e) => updateProfileContent({ avatarGlassAngle: parseInt(e.target.value, 10) })}
                        disabled={planType === 'basic'}
                        className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="block font-mono text-zinc-400 text-right">{profile.avatarGlassAngle ?? 0}°</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 uppercase">{lang === 'en' ? 'Glass Tint' : 'Оттенок стекла'}</span>
                    <div className="relative w-6 h-6 rounded border border-zinc-800 flex items-center justify-center bg-zinc-950 cursor-pointer">
                      <input
                        type="color"
                        value={profile.avatarGlassColor ?? '#ffffff'}
                        onChange={(e) => updateProfileContent({ avatarGlassColor: e.target.value })}
                        disabled={planType === 'basic'}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: profile.avatarGlassColor ?? '#ffffff' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1">{txtLayout}</label>
        <select
          value={profile.layout || 'stacked'}
          onChange={(e) => updateProfileContent({ layout: e.target.value as any })}
          className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-lg p-2 text-white cursor-pointer"
        >
          <option value="stacked">Stacked</option>
          <option value="row">Row</option>
        </select>
      </div>

      <div>
        <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1.5">{txtAlign}</label>
        <div className="grid grid-cols-3 gap-1.5">
          {['left', 'center', 'right'].map((align) => (
            <button
              key={align}
              onClick={() => updateProfileContent({ align: align as any })}
              className={`py-1.5 text-xs font-semibold rounded-lg border ${(profile.align || 'center') === align ? 'bg-white text-zinc-950 border-white' : 'bg-zinc-900 text-zinc-400 border-zinc-800'}`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-2.5 bg-zinc-900/40 rounded-lg border border-zinc-800/80">
        <span className="text-xs text-zinc-300 font-medium">{txtFullWidth}</span>
        <input
          type="checkbox"
          checked={profile.fullWidth === true}
          onChange={(e) => updateProfileContent({ fullWidth: e.target.checked })}
          className="w-4 h-4 text-emerald-600 bg-zinc-950 rounded cursor-pointer"
        />
      </div>
    </div>
  );
};
