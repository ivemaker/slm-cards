import React, { useState } from 'react';
import { Block, SocialsIconStyle } from '../../types';
import { useDev } from '../../context/DevContext';
import { 
  Sparkles, 
  Palette, 
  ChevronDown, 
  ChevronUp, 
  Check,
  Eye,
  Sliders,
  Maximize2,
  Trash2,
  Plus
} from 'lucide-react';

interface SocialsInspectorProps {
  focusedBlock: Block;
  lang: 'en' | 'ru';
  updateFocusedBlock: (updateFn: (b: Block) => Partial<Block>) => void;
}

export const SocialsInspector: React.FC<SocialsInspectorProps> = ({
  focusedBlock,
  lang,
  updateFocusedBlock,
}) => {
  const socials = focusedBlock.socialsContent!;
  const [openSection, setOpenSection] = useState<string | null>('preset');
  const { projects, activeProjectId } = useDev();
  const activeProject = projects.find(p => p.id === activeProjectId);
  
  const hasPhone = socials.links.some(l => l.platform === 'phone');

  const addLink = (platform: string) => {
    const newLink = { platform: platform as any, url: platform === 'email' ? 'mailto:' : 'https://' };
    updateFocusedBlock(b => ({
      socialsContent: {
        ...b.socialsContent!,
        links: [...b.socialsContent!.links, newLink]
      }
    }));
  };

  const removeLink = (idx: number) => {
    updateFocusedBlock(b => ({
      socialsContent: {
        ...b.socialsContent!,
        links: b.socialsContent!.links.filter((_, i) => i !== idx)
      }
    }));
  };

  const updateLink = (idx: number, url: string) => {
    updateFocusedBlock(b => ({
      socialsContent: {
        ...b.socialsContent!,
        links: b.socialsContent!.links.map((l, i) => i === idx ? { ...l, url } : l)
      }
    }));
  };

  const addPhone = () => {
    updateFocusedBlock(b => {
      const currentPhones = b.socialsContent?.phones || [];
      return {
        socialsContent: {
          ...b.socialsContent!,
          phones: [...currentPhones, { number: '', isPrimary: currentPhones.length === 0 }]
        }
      };
    });
  };

  const removePhone = (idx: number) => {
    updateFocusedBlock(b => {
      const currentPhones = b.socialsContent?.phones || [];
      const newPhones = currentPhones.filter((_, i) => i !== idx);
      // Ensure one is primary if the list is not empty
      if (newPhones.length > 0 && !newPhones.some(p => p.isPrimary)) {
        newPhones[0].isPrimary = true;
      }
      return {
        socialsContent: {
          ...b.socialsContent!,
          phones: newPhones
        }
      };
    });
  };

  const updatePhone = (idx: number, updates: Partial<{ number: string; isPrimary: boolean }>) => {
    updateFocusedBlock(b => {
      const currentPhones = b.socialsContent?.phones || [];
      let newPhones = currentPhones.map((p, i) => i === idx ? { ...p, ...updates } : p);
      
      // Validation for number
      if (updates.number !== undefined) {
        newPhones[idx].number = updates.number.replace(/[^\d+]/g, '');
      }

      // If this one is set to primary, unset others
      if (updates.isPrimary) {
        newPhones = newPhones.map((p, i) => ({ ...p, isPrimary: i === idx }));
      }
      // If we are unsetting primary, but it's the last one, prevent it (just enforce true)
      if (updates.isPrimary === false && !newPhones.some(p => p.isPrimary) && newPhones.length > 0) {
        newPhones[0].isPrimary = true;
      }

      return {
        socialsContent: {
          ...b.socialsContent!,
          phones: newPhones
        }
      };
    });
  };

  const updateContactName = (name: string) => {
    updateFocusedBlock(b => ({
      socialsContent: {
        ...b.socialsContent!,
        contactName: name.trim() === '' ? undefined : name
      }
    }));
  };

  // Icon Custom Style Presets
  const presets: Record<string, SocialsIconStyle> = {
    minimalist: {
      preset: 'minimalist',
      borderRadius: 'circle',
      borderWidth: 0,
      borderColor: '#ffffff',
      borderStyle: 'solid',
      fillType: 'color',
      fillColor: '#ffffff',
      fillOpacity: 10,
      enableShadow: false,
      shadowColor: '#000000',
      shadowBlur: 10,
      shadowIntensity: 30,
      colorType: 'solid',
      iconColor: '#ffffff',
      iconColorEnd: '#3b82f6',
      enableGlare: false,
      glareSpeed: 3,
      glareColor: '#ffffff',
      enableGlass: false,
      glassThickness: 40,
      enableBlur: false,
      blurAmount: 8,
    },
    neon: {
      preset: 'neon',
      borderRadius: 'rounded-lg',
      borderWidth: 1.5,
      borderColor: '#a855f7',
      borderStyle: 'solid',
      fillType: 'color',
      fillColor: '#0c0a0f',
      fillOpacity: 85,
      enableShadow: true,
      shadowColor: '#a855f7',
      shadowBlur: 14,
      shadowIntensity: 85,
      colorType: 'solid',
      iconColor: '#e9d5ff',
      iconColorEnd: '#3b82f6',
      enableGlare: false,
      glareSpeed: 3,
      glareColor: '#ffffff',
      enableGlass: false,
      glassThickness: 40,
      enableBlur: false,
      blurAmount: 8,
    },
    glassmorphic: {
      preset: 'glassmorphic',
      borderRadius: 'squircle',
      borderWidth: 1,
      borderColor: '#ffffff',
      borderStyle: 'solid',
      fillType: 'color',
      fillColor: '#ffffff',
      fillOpacity: 12,
      enableShadow: true,
      shadowColor: '#000000',
      shadowBlur: 12,
      shadowIntensity: 30,
      colorType: 'solid',
      iconColor: '#ffffff',
      iconColorEnd: '#3b82f6',
      enableGlare: true,
      glareSpeed: 4,
      glareColor: '#ffffff',
      enableGlass: true,
      glassThickness: 35,
      enableBlur: true,
      blurAmount: 14,
    },
    'retro-synth': {
      preset: 'retro-synth',
      borderRadius: 'square',
      borderWidth: 2,
      borderColor: '#f43f5e',
      borderStyle: 'solid',
      fillType: 'gradient',
      fillColor: '#ffffff',
      fillOpacity: 100,
      gradientStart: '#ec4899',
      gradientEnd: '#3b82f6',
      gradientAngle: 45,
      enableShadow: true,
      shadowColor: '#ec4899',
      shadowBlur: 15,
      shadowIntensity: 90,
      colorType: 'solid',
      iconColor: '#ffffff',
      iconColorEnd: '#3b82f6',
      enableGlare: true,
      glareSpeed: 3,
      glareColor: '#ffffff',
      enableGlass: false,
      glassThickness: 40,
      enableBlur: false,
      blurAmount: 8,
    },
    corporate: {
      preset: 'corporate',
      borderRadius: 'squircle',
      borderWidth: 0,
      borderColor: '#27272a',
      borderStyle: 'solid',
      fillType: 'color',
      fillColor: '#18181b',
      fillOpacity: 100,
      enableShadow: true,
      shadowColor: '#000000',
      shadowBlur: 6,
      shadowIntensity: 45,
      colorType: 'solid',
      iconColor: '#ffffff',
      iconColorEnd: '#3b82f6',
      enableGlare: false,
      glareSpeed: 3,
      glareColor: '#ffffff',
      enableGlass: false,
      glassThickness: 40,
      enableBlur: false,
      blurAmount: 8,
    }
  };

  const applyPreset = (presetName: keyof typeof presets) => {
    updateFocusedBlock(b => ({
      socialsContent: {
        ...b.socialsContent!,
        iconStyle: { ...presets[presetName] }
      }
    }));
  };

  const updateIconStyle = (updatedStyle: Partial<SocialsIconStyle>) => {
    updateFocusedBlock(b => {
      const currentContent = b.socialsContent || { links: [] };
      const currentStyle = currentContent.iconStyle || {};
      return {
        socialsContent: {
          ...currentContent,
          iconStyle: {
            ...currentStyle,
            ...updatedStyle,
            // Reset active preset name on custom edit
            preset: undefined
          }
        }
      };
    });
  };

  const currentStyle = socials.iconStyle || {};

  const toggleSection = (secName: string) => {
    setOpenSection(prev => prev === secName ? null : secName);
  };

  return (
    <div className="space-y-4">
      {/* SECTION: SOCIAL LINK CHANNELS */}
      <div className="text-[10px] font-black uppercase text-orange-500 tracking-wider flex items-center gap-1.5 mt-1.5">
        <span className="w-1.5 h-3.5 bg-orange-500 rounded-full" />
        <span>{lang === 'en' ? 'Social Link Channels' : 'КАНАЛЫ СВЯЗИ И ССЫЛКИ'}</span>
      </div>

      {/* 1. SOCIAL LINK CHANNELS LIST */}
      <div className="space-y-3">
        <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
          {socials.links.map((link, idx) => (
            <div key={idx} className="bg-zinc-900 border border-zinc-850 p-2 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono uppercase bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 font-extrabold">{link.platform}</span>
                <button onClick={() => removeLink(idx)} className="text-[9px] font-mono text-red-400 uppercase font-bold cursor-pointer">Delete</button>
              </div>
              {link.platform === 'phone' ? (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-zinc-500 tracking-wider mb-1">
                      {lang === 'en' ? 'Contact Name (for save)' : 'Имя контакта (для сохранения)'}
                    </label>
                    <input
                      type="text"
                      value={socials.contactName || ''}
                      onChange={(e) => updateContactName(e.target.value)}
                      placeholder={activeProject?.name || 'Contact Name'}
                      className="w-full bg-zinc-950 border border-zinc-800 text-[10px] rounded p-2 text-white focus:outline-none focus:border-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
                      {lang === 'en' ? 'Phone Numbers' : 'Номера телефонов'}
                    </label>
                    <div className="space-y-2">
                      {(socials.phones || []).map((phone, pIdx) => (
                        <div key={pIdx} className="bg-zinc-950 border border-zinc-800 p-1.5 rounded flex items-center gap-2">
                          <input
                            type="radio"
                            name={`primary-phone-${focusedBlock.id}`}
                            checked={phone.isPrimary}
                            onChange={() => updatePhone(pIdx, { isPrimary: true })}
                            title={lang === 'en' ? 'Set as Primary' : 'Основной номер'}
                            className="accent-orange-500 w-3 h-3 cursor-pointer ml-1"
                          />
                          <input
                            type="tel"
                            value={phone.number}
                            onChange={(e) => updatePhone(pIdx, { number: e.target.value })}
                            placeholder="+1234567890"
                            className="flex-1 min-w-0 bg-transparent text-[10px] text-white font-mono focus:outline-none"
                          />
                          <button 
                            onClick={() => removePhone(pIdx)} 
                            className="p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded transition-colors"
                            title={lang === 'en' ? 'Remove number' : 'Удалить номер'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addPhone}
                      className="w-full py-1.5 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded text-[9px] font-bold uppercase text-zinc-400 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      {lang === 'en' ? 'Add Phone Number' : 'Добавить номер'}
                    </button>
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateLink(idx, e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-[10px] rounded p-1.5 text-white font-mono focus:outline-none"
                />
              )}
            </div>
          ))}
        </div>
        <div className="pt-1.5 border-t border-zinc-900">
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                addLink(e.target.value);
                e.target.value = "";
              }
            }}
            className="bg-zinc-900 hover:bg-zinc-850 text-[10px] font-mono text-zinc-300 uppercase font-semibold border border-zinc-800 p-2 rounded focus:outline-none w-full cursor-pointer"
          >
            <option value="">+ Add Social Link...</option>
            <option value="instagram">Instagram</option>
            <option value="telegram">Telegram</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="twitter">X / Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="github">GitHub</option>
            <option value="email">Email</option>
            <option value="phone">Phone / Call</option>
            <option value="website">Custom Website</option>
          </select>
        </div>
      </div>

      {/* 2. ICON LAYOUT CONFIGURATION */}
      <div className="pt-3 border-t border-zinc-800/60 space-y-3.5">
        {/* SECTION: LAYOUT & STYLE */}
        <div className="text-[10px] font-black uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-3.5 bg-orange-500 rounded-full" />
          <span>{lang === 'en' ? 'Layout & Style' : 'РАСПОЛОЖЕНИЕ И СТИЛЬ'}</span>
        </div>

        <div>
          <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1">
            {lang === 'en' ? 'Layout Orientation' : 'Расположение (Вёрстка)'}
          </label>
          <select
            value={socials.layout || 'row'}
            onChange={(e) => updateFocusedBlock(b => ({
              socialsContent: {
                ...b.socialsContent!,
                layout: e.target.value as 'stacked' | 'row'
              }
            }))}
            className="w-full bg-zinc-900 border border-zinc-850 text-xs rounded-lg p-2 text-white cursor-pointer focus:outline-none"
          >
            <option value="row">{lang === 'en' ? 'Row (Horizontal)' : 'В ряд (Горизонтально)'}</option>
            <option value="stacked">{lang === 'en' ? 'Stacked (Vertical)' : 'В столбик (Вертикально)'}</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
            <span>{lang === 'en' ? 'Icon Size' : 'Размер иконок'}</span>
            <span className="font-mono text-emerald-400">{socials.iconSize || 16}px</span>
          </div>
          <input
            type="range"
            min="12"
            max="48"
            value={socials.iconSize || 16}
            onChange={(e) => updateFocusedBlock(b => ({
              socialsContent: {
                ...b.socialsContent!,
                iconSize: parseInt(e.target.value)
              }
            }))}
            className="w-full h-1.5 rounded-lg bg-zinc-900 accent-white cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
            <span>{lang === 'en' ? 'Max Icons Per Row' : 'Макс. иконок в одной строке'}</span>
            <span className="font-mono text-emerald-400">
              {socials.maxPerRow && socials.maxPerRow < 11 ? socials.maxPerRow : (lang === 'en' ? 'Unlimited' : 'Без ограничений')}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="11"
            value={socials.maxPerRow || 11}
            onChange={(e) => updateFocusedBlock(b => {
              const val = parseInt(e.target.value);
              return {
                socialsContent: {
                  ...b.socialsContent!,
                  maxPerRow: val === 11 ? undefined : val
                }
              };
            })}
            className="w-full h-1.5 rounded-lg bg-zinc-900 accent-white cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider">
            {lang === 'en' ? 'Icon Spacing (Distance)' : 'Расстояние между иконками'}
          </label>
          <div className="grid grid-cols-3 gap-1">
            {['small', 'medium', 'large'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => updateFocusedBlock(b => ({
                  socialsContent: {
                    ...b.socialsContent!,
                    iconSpacing: s as 'small' | 'medium' | 'large'
                  }
                }))}
                className={`py-1 text-[10px] font-bold rounded border transition-colors cursor-pointer ${
                  (socials.iconSpacing || 'medium') === s
                    ? 'bg-white text-zinc-950 border-white'
                    : 'bg-zinc-950 text-zinc-500 border-zinc-850 hover:text-zinc-300'
                }`}
              >
                {s === 'small' ? (lang === 'en' ? 'Small' : 'Малое') : s === 'medium' ? (lang === 'en' ? 'Medium' : 'Среднее') : (lang === 'en' ? 'Large' : 'Большое')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. ICON STYLE CUSTOMIZER PANEL */}
      <div className="pt-4 border-t border-zinc-900 space-y-3">
        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
          <Palette size={14} className="text-emerald-400" />
          {lang === 'en' ? 'Icon Container Styling' : 'Настройки контейнеров иконок'}
        </h3>

        {/* SECTION A: PRESET ICON COLLECTIONS */}
        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/40">
          <button
            type="button"
            onClick={() => toggleSection('preset')}
            className="w-full flex items-center justify-between p-2.5 bg-zinc-900/60 hover:bg-zinc-900 transition-colors text-left focus:outline-none"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Sparkles size={11} className="text-amber-400" />
              {lang === 'en' ? 'Style Collections (5 Presets)' : 'Готовые коллекции стилей'}
            </span>
            {openSection === 'preset' ? <ChevronUp size={13} className="text-zinc-400" /> : <ChevronDown size={13} className="text-zinc-400" />}
          </button>

          {openSection === 'preset' && (
            <div className="p-2.5 space-y-2 bg-zinc-950/20">
              <div className="grid grid-cols-1 gap-2">
                {[
                  { key: 'minimalist', nameEn: 'Minimalist', nameRu: 'Минималистичный', descEn: 'Translucent borders & simple monochrome glyphs', descRu: 'Тонкая полупрозрачность и лаконичная монохромность' },
                  { key: 'neon', nameEn: 'Neon Accent', nameRu: 'Неоновый акцент', descEn: 'Intense glowing neon borders and drop-shadow styling', descRu: 'Яркие неоновые рамки и насыщенное размытое свечение' },
                  { key: 'glassmorphic', nameEn: 'Glassmorphic', nameRu: 'Стекло', descEn: 'Frosted glare shine, backdrop blur, glass thickness', descRu: 'Эффект матового стекла, отражение блика и размытие фона' },
                  { key: 'retro-synth', nameEn: 'Retro Synth', nameRu: 'Ретро-синт', descEn: 'Vibrant cyberpunk gradient fills, thick contours, glare', descRu: 'Киберпанк градиенты, толстые контуры и анимация блика' },
                  { key: 'corporate', nameEn: 'Corporate Bold', nameRu: 'Строгий', descEn: 'Solid dark fills, crisp squircle shapes, clean contrast', descRu: 'Сплошная глубокая заливка, элегантная форма и строгость' }
                ].map((preset) => {
                  const isActive = currentStyle.preset === preset.key;
                  return (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() => applyPreset(preset.key as any)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left border transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-emerald-500/10 border-emerald-500/80 text-white' 
                          : 'bg-zinc-900/40 border-zinc-850 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-800'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold block">{lang === 'en' ? preset.nameEn : preset.nameRu}</span>
                        <span className="text-[8px] text-zinc-500 block leading-tight">{lang === 'en' ? preset.descEn : preset.descRu}</span>
                      </div>
                      {isActive && <Check size={12} className="text-emerald-400 flex-shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* SECTION B: SHAPE AND CONTOUR (ФОРМА И КОНТУР) */}
        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/40">
          <button
            type="button"
            onClick={() => toggleSection('shape')}
            className="w-full flex items-center justify-between p-2.5 bg-zinc-900/60 hover:bg-zinc-900 transition-colors text-left focus:outline-none"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">
              {lang === 'en' ? 'Shape & Outline' : 'Форма и Контур'}
            </span>
            {openSection === 'shape' ? <ChevronUp size={13} className="text-zinc-400" /> : <ChevronDown size={13} className="text-zinc-400" />}
          </button>

          {openSection === 'shape' && (
            <div className="p-2.5 space-y-3 bg-zinc-950/20">
              {/* Border Radius */}
              <div className="space-y-1">
                <span className="text-[8px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Corner Shape' : 'Форма (Углы)'}</span>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { key: 'circle', labelEn: 'Circle', labelRu: 'Круг' },
                    { key: 'square', labelEn: 'Square', labelRu: 'Квадрат' },
                    { key: 'rounded-lg', labelEn: 'Rounded', labelRu: 'Скруглен' },
                    { key: 'squircle', labelEn: 'Squircle', labelRu: 'Суперкруг' }
                  ].map((radiusOpt) => (
                    <button
                      key={radiusOpt.key}
                      type="button"
                      onClick={() => updateIconStyle({ borderRadius: radiusOpt.key as any })}
                      className={`py-1 text-[8px] font-bold rounded border transition-colors cursor-pointer ${
                        (currentStyle.borderRadius || 'circle') === radiusOpt.key
                          ? 'bg-white text-zinc-950 border-white'
                          : 'bg-zinc-900 text-zinc-500 border-zinc-850 hover:text-zinc-300'
                      }`}
                    >
                      {lang === 'en' ? radiusOpt.labelEn : radiusOpt.labelRu}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Width */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-bold text-zinc-500 uppercase">
                  <span>{lang === 'en' ? 'Outline Thickness' : 'Толщина рамки'}</span>
                  <span className="font-mono text-emerald-400">{currentStyle.borderWidth ?? 0}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  step="0.5"
                  value={currentStyle.borderWidth ?? 0}
                  onChange={(e) => updateIconStyle({ borderWidth: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-zinc-900 accent-white cursor-pointer rounded-lg"
                />
              </div>

              {/* Border Color */}
              {((currentStyle.borderWidth ?? 0) > 0) && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Border Color' : 'Цвет обводки'}</span>
                      <div className="flex gap-1.5 items-center">
                        <input
                          type="color"
                          value={currentStyle.borderColor || '#ffffff'}
                          onChange={(e) => updateIconStyle({ borderColor: e.target.value })}
                          className="w-8 h-7 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={(currentStyle.borderColor || '#ffffff').toUpperCase()}
                          onChange={(e) => updateIconStyle({ borderColor: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-850 text-[9px] text-zinc-300 rounded p-1 font-mono focus:outline-none uppercase"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Border Style' : 'Стиль обводки'}</span>
                      <select
                        value={currentStyle.borderStyle || 'solid'}
                        onChange={(e) => updateIconStyle({ borderStyle: e.target.value as any })}
                        className="w-full bg-zinc-900 border border-zinc-850 text-[10px] rounded p-1.5 text-white cursor-pointer focus:outline-none"
                      >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                        <option value="double">Double</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION C: CONTAINER FILL (ЗАЛИВКА) */}
        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/40">
          <button
            type="button"
            onClick={() => toggleSection('fill')}
            className="w-full flex items-center justify-between p-2.5 bg-zinc-900/60 hover:bg-zinc-900 transition-colors text-left focus:outline-none"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">
              {lang === 'en' ? 'Container Fill' : 'Заливка фона'}
            </span>
            {openSection === 'fill' ? <ChevronUp size={13} className="text-zinc-400" /> : <ChevronDown size={13} className="text-zinc-400" />}
          </button>

          {openSection === 'fill' && (
            <div className="p-2.5 space-y-3 bg-zinc-950/20">
              {/* Fill Type */}
              <div className="space-y-1">
                <span className="text-[8px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Fill Type' : 'Тип заливки'}</span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { key: 'none', labelEn: 'None', labelRu: 'Нет' },
                    { key: 'color', labelEn: 'Solid', labelRu: 'Цвет' },
                    { key: 'gradient', labelEn: 'Gradient', labelRu: 'Градиент' }
                  ].map((fillOpt) => (
                    <button
                      key={fillOpt.key}
                      type="button"
                      onClick={() => updateIconStyle({ fillType: fillOpt.key as any })}
                      className={`py-1 text-[8px] font-bold rounded border transition-colors cursor-pointer ${
                        (currentStyle.fillType || 'color') === fillOpt.key
                          ? 'bg-white text-zinc-950 border-white'
                          : 'bg-zinc-900 text-zinc-500 border-zinc-850 hover:text-zinc-300'
                      }`}
                    >
                      {lang === 'en' ? fillOpt.labelEn : fillOpt.labelRu}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fill Color */}
              {(currentStyle.fillType || 'color') === 'color' && (
                <div className="space-y-2">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Solid Color' : 'Сплошной цвет'}</span>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="color"
                        value={currentStyle.fillColor || '#ffffff'}
                        onChange={(e) => updateIconStyle({ fillColor: e.target.value })}
                        className="w-8 h-7 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={(currentStyle.fillColor || '#ffffff').toUpperCase()}
                        onChange={(e) => updateIconStyle({ fillColor: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-850 text-[9px] text-zinc-300 rounded p-1 font-mono focus:outline-none uppercase"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-bold text-zinc-500 uppercase">
                      <span>{lang === 'en' ? 'Fill Opacity' : 'Прозрачность заливки'}</span>
                      <span className="font-mono text-emerald-400">{currentStyle.fillOpacity ?? 100}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentStyle.fillOpacity ?? 100}
                      onChange={(e) => updateIconStyle({ fillOpacity: parseInt(e.target.value) })}
                      className="w-full h-1 bg-zinc-900 accent-white cursor-pointer rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Gradient Fills */}
              {currentStyle.fillType === 'gradient' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Gradient Start' : 'Начало'}</span>
                      <div className="flex gap-1 items-center bg-zinc-950 p-1 rounded border border-zinc-850">
                        <input
                          type="color"
                          value={currentStyle.gradientStart || '#ec4899'}
                          onChange={(e) => updateIconStyle({ gradientStart: e.target.value })}
                          className="w-5 h-5 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={(currentStyle.gradientStart || '#ec4899').toUpperCase()}
                          onChange={(e) => updateIconStyle({ gradientStart: e.target.value })}
                          className="w-full bg-transparent text-[8px] text-zinc-300 font-mono focus:outline-none uppercase"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Gradient End' : 'Конец'}</span>
                      <div className="flex gap-1 items-center bg-zinc-950 p-1 rounded border border-zinc-850">
                        <input
                          type="color"
                          value={currentStyle.gradientEnd || '#3b82f6'}
                          onChange={(e) => updateIconStyle({ gradientEnd: e.target.value })}
                          className="w-5 h-5 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={(currentStyle.gradientEnd || '#3b82f6').toUpperCase()}
                          onChange={(e) => updateIconStyle({ gradientEnd: e.target.value })}
                          className="w-full bg-transparent text-[8px] text-zinc-300 font-mono focus:outline-none uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-bold text-zinc-500 uppercase">
                      <span>{lang === 'en' ? 'Gradient Angle' : 'Угол градиента'}</span>
                      <span className="font-mono text-emerald-400">{currentStyle.gradientAngle ?? 45}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={currentStyle.gradientAngle ?? 45}
                      onChange={(e) => updateIconStyle({ gradientAngle: parseInt(e.target.value) })}
                      className="w-full h-1 bg-zinc-900 accent-white cursor-pointer rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION D: CONTAINER SHADOW (ТЕНЬ) */}
        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/40">
          <button
            type="button"
            onClick={() => toggleSection('shadow')}
            className="w-full flex items-center justify-between p-2.5 bg-zinc-900/60 hover:bg-zinc-900 transition-colors text-left focus:outline-none"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">
              {lang === 'en' ? 'Shadow Properties' : 'Тень'}
            </span>
            {openSection === 'shadow' ? <ChevronUp size={13} className="text-zinc-400" /> : <ChevronDown size={13} className="text-zinc-400" />}
          </button>

          {openSection === 'shadow' && (
            <div className="p-2.5 space-y-3 bg-zinc-950/20">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-semibold text-zinc-200 block">{lang === 'en' ? 'Enable Container Shadow' : 'Включить тень'}</span>
                  <span className="text-[7.5px] text-zinc-500 block leading-tight">{lang === 'en' ? 'Adds modern 3D drop-shadow styling' : 'Объемная тень вокруг иконки'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => updateIconStyle({ enableShadow: !currentStyle.enableShadow })}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                    currentStyle.enableShadow ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    currentStyle.enableShadow ? 'translate-x-3.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {currentStyle.enableShadow && (
                <div className="space-y-3 p-2 bg-zinc-950/40 border border-zinc-900 rounded-lg animate-slide-up">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Shadow Glow Color' : 'Цвет свечения тени'}</span>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="color"
                        value={currentStyle.shadowColor || '#000000'}
                        onChange={(e) => updateIconStyle({ shadowColor: e.target.value })}
                        className="w-7 h-6 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={(currentStyle.shadowColor || '#000000').toUpperCase()}
                        onChange={(e) => updateIconStyle({ shadowColor: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-850 text-[9px] text-zinc-300 rounded p-1 font-mono focus:outline-none uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] font-bold text-zinc-500 uppercase">
                        <span>{lang === 'en' ? 'Blur Size' : 'Размытие'}</span>
                        <span className="font-mono text-emerald-400">{currentStyle.shadowBlur ?? 10}px</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="30"
                        value={currentStyle.shadowBlur ?? 10}
                        onChange={(e) => updateIconStyle({ shadowBlur: parseInt(e.target.value) })}
                        className="w-full h-1 bg-zinc-900 accent-white cursor-pointer rounded-lg"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] font-bold text-zinc-500 uppercase">
                        <span>{lang === 'en' ? 'Intensity' : 'Яркость'}</span>
                        <span className="font-mono text-emerald-400">{currentStyle.shadowIntensity ?? 40}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={currentStyle.shadowIntensity ?? 40}
                        onChange={(e) => updateIconStyle({ shadowIntensity: parseInt(e.target.value) })}
                        className="w-full h-1 bg-zinc-900 accent-white cursor-pointer rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION E: ICON GLYPHS COLOR (ЦВЕТ ИКОНКИ) */}
        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/40">
          <button
            type="button"
            onClick={() => toggleSection('color')}
            className="w-full flex items-center justify-between p-2.5 bg-zinc-900/60 hover:bg-zinc-900 transition-colors text-left focus:outline-none"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">
              {lang === 'en' ? 'Icon Color & Gradients' : 'Цвет иконки и значка'}
            </span>
            {openSection === 'color' ? <ChevronUp size={13} className="text-zinc-400" /> : <ChevronDown size={13} className="text-zinc-400" />}
          </button>

          {openSection === 'color' && (
            <div className="p-2.5 space-y-3 bg-zinc-950/20">
              {/* Color Type */}
              <div className="space-y-1">
                <span className="text-[8px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Color Pattern' : 'Тип окрашивания'}</span>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { key: 'solid', labelEn: 'Solid Fill', labelRu: 'Сплошной' },
                    { key: 'gradient', labelEn: 'Gradient Fill', labelRu: 'Градиентный' }
                  ].map((colorOpt) => (
                    <button
                      key={colorOpt.key}
                      type="button"
                      onClick={() => updateIconStyle({ colorType: colorOpt.key as any })}
                      className={`py-1 text-[8px] font-bold rounded border transition-colors cursor-pointer ${
                        (currentStyle.colorType || 'solid') === colorOpt.key
                          ? 'bg-white text-zinc-950 border-white'
                          : 'bg-zinc-900 text-zinc-500 border-zinc-850 hover:text-zinc-300'
                      }`}
                    >
                      {lang === 'en' ? colorOpt.labelEn : colorOpt.labelRu}
                    </button>
                  ))}
                </div>
              </div>

              {/* Solid Icon Color */}
              {(currentStyle.colorType || 'solid') === 'solid' && (
                <div className="space-y-1">
                  <span className="text-[8px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Icon Glyph Color' : 'Цвет значка'}</span>
                  <div className="flex gap-1.5 items-center">
                    <input
                      type="color"
                      value={currentStyle.iconColor || '#ffffff'}
                      onChange={(e) => updateIconStyle({ iconColor: e.target.value })}
                      className="w-8 h-7 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={(currentStyle.iconColor || '#ffffff').toUpperCase()}
                      onChange={(e) => updateIconStyle({ iconColor: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-850 text-[9px] text-zinc-300 rounded p-1 font-mono focus:outline-none uppercase"
                    />
                  </div>
                </div>
              )}

              {/* Gradient Icon Color */}
              {currentStyle.colorType === 'gradient' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Glyph Start' : 'Начало'}</span>
                      <div className="flex gap-1 items-center bg-zinc-950 p-1 rounded border border-zinc-850">
                        <input
                          type="color"
                          value={currentStyle.iconColor || '#ffffff'}
                          onChange={(e) => updateIconStyle({ iconColor: e.target.value })}
                          className="w-5 h-5 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={(currentStyle.iconColor || '#ffffff').toUpperCase()}
                          onChange={(e) => updateIconStyle({ iconColor: e.target.value })}
                          className="w-full bg-transparent text-[8px] text-zinc-300 font-mono focus:outline-none uppercase"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Glyph End' : 'Конец'}</span>
                      <div className="flex gap-1 items-center bg-zinc-950 p-1 rounded border border-zinc-850">
                        <input
                          type="color"
                          value={currentStyle.iconColorEnd || '#3b82f6'}
                          onChange={(e) => updateIconStyle({ iconColorEnd: e.target.value })}
                          className="w-5 h-5 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={(currentStyle.iconColorEnd || '#3b82f6').toUpperCase()}
                          onChange={(e) => updateIconStyle({ iconColorEnd: e.target.value })}
                          className="w-full bg-transparent text-[8px] text-zinc-300 font-mono focus:outline-none uppercase"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION F: VISUAL EFFECTS (ЭФФЕКТЫ БЛИКА, СТЕКЛА, РАЗМЫТИЯ) */}
        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/40">
          <button
            type="button"
            onClick={() => toggleSection('effects')}
            className="w-full flex items-center justify-between p-2.5 bg-zinc-900/60 hover:bg-zinc-900 transition-colors text-left focus:outline-none"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1">
              <Sparkles size={11} className="text-emerald-400" />
              {lang === 'en' ? 'Advanced Visual Effects' : 'Спецэффекты'}
            </span>
            {openSection === 'effects' ? <ChevronUp size={13} className="text-zinc-400" /> : <ChevronDown size={13} className="text-zinc-400" />}
          </button>

          {openSection === 'effects' && (
            <div className="p-2.5 space-y-4 bg-zinc-950/20">
              {/* EFFECT 1: GLARE SHIMMER / SWEEP */}
              <div className="space-y-2 border-b border-zinc-900 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-semibold text-zinc-200 block">{lang === 'en' ? 'Sweeping Glare Shimmer' : 'Пробегающий блик'}</span>
                    <span className="text-[7.5px] text-zinc-500 block leading-tight">{lang === 'en' ? 'A dramatic light reflections animation' : 'Блестящая анимация скользящего света'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateIconStyle({ enableGlare: !currentStyle.enableGlare })}
                    className={`w-8 h-4.5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                      currentStyle.enableGlare ? 'bg-emerald-500' : 'bg-zinc-800'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      currentStyle.enableGlare ? 'translate-x-3.5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {currentStyle.enableGlare && (
                  <div className="space-y-2.5 p-2 bg-zinc-950/40 border border-zinc-900 rounded-lg animate-slide-up">
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-zinc-500 block">{lang === 'en' ? 'Glare Color' : 'Цвет блика'}</span>
                      <div className="flex gap-1.5 items-center">
                        <input
                          type="color"
                          value={currentStyle.glareColor || '#ffffff'}
                          onChange={(e) => updateIconStyle({ glareColor: e.target.value })}
                          className="w-7 h-5.5 rounded border border-zinc-800 bg-transparent p-0 cursor-pointer overflow-hidden flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={(currentStyle.glareColor || '#ffffff').toUpperCase()}
                          onChange={(e) => updateIconStyle({ glareColor: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-850 text-[8px] text-zinc-300 rounded p-1 font-mono focus:outline-none uppercase"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] font-bold text-zinc-500 uppercase">
                        <span>{lang === 'en' ? 'Speed' : 'Скорость (Период)'}</span>
                        <span className="font-mono text-emerald-400">{currentStyle.glareSpeed ?? 3}s</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        value={currentStyle.glareSpeed ?? 3}
                        onChange={(e) => updateIconStyle({ glareSpeed: parseInt(e.target.value) })}
                        className="w-full h-1 bg-zinc-900 accent-white cursor-pointer rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* EFFECT 2: FROSTED GLASS EFFECT */}
              <div className="space-y-2 border-b border-zinc-900 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-semibold text-zinc-200 block">{lang === 'en' ? 'Frosted Glass' : 'Эффект стекло (Glassmorphic)'}</span>
                    <span className="text-[7.5px] text-zinc-500 block leading-tight">{lang === 'en' ? 'Simulates realistic translucent glossy glass' : 'Придает иконке блеск и текстуру стекла'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateIconStyle({ enableGlass: !currentStyle.enableGlass })}
                    className={`w-8 h-4.5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                      currentStyle.enableGlass ? 'bg-emerald-500' : 'bg-zinc-800'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      currentStyle.enableGlass ? 'translate-x-3.5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {currentStyle.enableGlass && (
                  <div className="space-y-4 p-2 bg-zinc-950/40 border border-zinc-900 rounded-lg animate-slide-up">
                    {/* BEVEL PROFILE / SMOOTHING */}
                    <div className="space-y-1.5">
                      <span className="block text-[7.5px] font-bold text-zinc-500 uppercase tracking-wider">
                        {lang === 'en' ? 'Bevel Profile / Smoothing' : 'Профиль фаски / Сглаживание'}
                      </span>
                      <div className="grid grid-cols-4 gap-1.5">
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
                          const isActive = (currentStyle.glassPreset || 'convex-circular') === p.id;
                          return (
                            <button
                              key={p.id}
                              title={p.name}
                              type="button"
                              onClick={() => updateIconStyle({ glassPreset: p.id as any })}
                              className={`aspect-square rounded-lg border flex flex-col items-center justify-center p-1 transition-all relative group cursor-pointer ${
                                isActive 
                                  ? 'bg-zinc-100 border-zinc-100 text-zinc-950' 
                                  : 'bg-zinc-950/60 border-zinc-850 text-zinc-500 hover:border-zinc-750 hover:text-zinc-350'
                              }`}
                            >
                              <svg 
                                viewBox="0 0 32 32" 
                                className="w-5 h-5 fill-none transition-transform group-hover:scale-105"
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
                      <div className="text-[7.5px] font-sans font-medium text-emerald-400/90 italic text-center pt-1 leading-tight">
                        {(currentStyle.glassPreset || 'convex-circular') === 'convex-circular' 
                          ? (lang === 'en' ? 'Convex Circular (Quarter-circle)' : 'Профиль выпуклый 1: Идеальный четверть-круг')
                          : (currentStyle.glassPreset || 'convex-circular') === 'convex-smooth'
                            ? (lang === 'en' ? 'Convex Smooth (S-Curve)' : 'Профиль выпуклый 2: Анатомическая S-кривая')
                            : (currentStyle.glassPreset || 'convex-circular') === 'concave'
                              ? (lang === 'en' ? 'Concave Scooped (Liquid Hollow)' : 'Профиль вогнутый 1: Глубокая линзовая чаша')
                              : (lang === 'en' ? 'Raised Ridge (Double Curve Ripple)' : 'Профиль вогнутый 2: Двухволновой кант-волна')
                        }
                      </div>
                    </div>

                    {/* GLASS THICKNESS */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] font-bold text-zinc-500 uppercase">
                        <span>{lang === 'en' ? 'Thickness' : 'Толщина (Thickness)'}</span>
                        <span className="font-mono text-emerald-400">{currentStyle.glassThickness ?? 80}</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="200"
                        value={currentStyle.glassThickness ?? 80}
                        onChange={(e) => updateIconStyle({ glassThickness: parseInt(e.target.value) })}
                        className="w-full h-1 bg-zinc-900 accent-white cursor-pointer rounded-lg"
                      />
                    </div>

                    {/* BEZEL WIDTH */}
                    <div className="space-y-1 pt-1.5 border-t border-zinc-900/50">
                      <div className="flex justify-between text-[8px] font-bold text-zinc-500 uppercase">
                        <span>{lang === 'en' ? 'Bezel Width' : 'Ширина кромки (Bezel width)'}</span>
                        <span className="font-mono text-emerald-400">{currentStyle.bezelWidth ?? 6}px</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={currentStyle.bezelWidth ?? 6}
                        onChange={(e) => updateIconStyle({ bezelWidth: parseInt(e.target.value) })}
                        className="w-full h-1 bg-zinc-900 accent-white cursor-pointer rounded-lg"
                      />
                    </div>

                    {/* REFRACTIVE INDEX */}
                    <div className="space-y-1 pt-1.5 border-t border-zinc-900/50">
                      <div className="flex justify-between text-[8px] font-bold text-zinc-500 uppercase">
                        <span>{lang === 'en' ? 'Refractive Index' : 'Индекс рефракции (Refractive index)'}</span>
                        <span className="font-mono text-emerald-400">{(currentStyle.glassRefractiveIndex ?? 2.0).toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="6.0"
                        step="0.05"
                        value={currentStyle.glassRefractiveIndex ?? 2.0}
                        onChange={(e) => updateIconStyle({ glassRefractiveIndex: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-zinc-900 accent-white cursor-pointer rounded-lg"
                      />
                    </div>

                    {/* LENS ZOOM STRENGTH */}
                    <div className="space-y-1 pt-1.5 border-t border-zinc-900/50">
                      <div className="flex justify-between text-[8px] font-bold text-zinc-500 uppercase">
                        <span>{lang === 'en' ? 'Lens Zoom' : 'Зум линзы (Lens zoom)'}</span>
                        <span className="font-mono text-emerald-400">{currentStyle.glassZoom ?? 30}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={currentStyle.glassZoom ?? 30}
                        onChange={(e) => updateIconStyle({ glassZoom: parseInt(e.target.value) })}
                        className="w-full h-1 bg-zinc-900 accent-white cursor-pointer rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* EFFECT 3: BACKDROP BLUR */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-semibold text-zinc-200 block">{lang === 'en' ? 'Backdrop Blur' : 'Размытие фона (Backdrop-filter)'}</span>
                    <span className="text-[7.5px] text-zinc-500 block leading-tight">{lang === 'en' ? 'Blurs background content behind icons' : 'Размывает элементы, находящиеся под иконкой'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateIconStyle({ enableBlur: !currentStyle.enableBlur })}
                    className={`w-8 h-4.5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                      currentStyle.enableBlur ? 'bg-emerald-500' : 'bg-zinc-800'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      currentStyle.enableBlur ? 'translate-x-3.5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {currentStyle.enableBlur && (
                  <div className="space-y-2 p-2 bg-zinc-950/40 border border-zinc-900 rounded-lg animate-slide-up">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] font-bold text-zinc-500 uppercase">
                        <span>{lang === 'en' ? 'Blur Intensity' : 'Радиус размытия'}</span>
                        <span className="font-mono text-emerald-400">{currentStyle.blurAmount ?? 8}px</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="24"
                        value={currentStyle.blurAmount ?? 8}
                        onChange={(e) => updateIconStyle({ blurAmount: parseInt(e.target.value) })}
                        className="w-full h-1 bg-zinc-900 accent-white cursor-pointer rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
