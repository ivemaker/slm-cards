/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { get, set, del } from 'idb-keyval';
import STATIC_READY_TEMPLATES from './custom_ready_templates.json';
import { 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Trash2, 
  Globe, 
  Languages, 
  Sparkle, 
  CloudRain, 
  Smartphone, 
  TrendingUp, 
  MousePointerClick, 
  QrCode, 
  Download, 
  ShoppingBag, 
  Settings, 
  ChevronRight, 
  ChevronLeft,
  ArrowLeft,
  Share2, 
  Undo,
  Redo, 
  Instagram, 
  Twitter, 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  Globe2, 
  Send, 
  Check, 
  FileText, 
  Bold, 
  Eye, 
  PlusCircle, 
  Sliders, 
  RefreshCcw, 
  Minimize2,
  Maximize2,
  UserPlus, 
  FolderHeart, 
  CheckCircle2, 
  Layers,
  Copy,
  Type,
  User,
  FolderPlus,
  FolderOpen,
  ArrowUpDown,
  GripVertical,
  Monitor,
  Tablet,
  Wand2,
  Image as ImageIcon,
  Sun,
  Moon,
  ShoppingCart,
  Coffee,
  Scissors,
  X,
  Upload,
  Bell,
  Menu,
  LogOut
} from 'lucide-react';

import { 
  ProjectConfig, 
  Block, 
  BlockType, 
  TypographyTheme, 
  FramePadding, 
  FrameRadius, 
  SocialLink, 
  CartItem,
  MainBgConfig,
  BgEffect
} from './types';

import { 
  DEFAULT_CONFIGS, 
  PLACEHOLDERS 
} from './templates';

import { PublicPreviewControls } from './components/PublicPreviewControls';
import { LayersPanel } from './components/LayersPanel';
import { BlockInspector } from './components/BlockInspector';
import { BackgroundEffects } from './components/BackgroundEffects';
import { GlassRefractorWrapper, GlobalGlassFilters } from './components/GlassEffectLayer';
import { MediaBlockContent } from './components/MediaBlockContent';
import { ProfileBlockContent } from './components/ProfileBlockContent';
import { CornerGlowOverlay } from './components/CornerGlowOverlay';
import { ProjectsTab } from './components/ProjectsTab';
import { DashboardTab } from './components/DashboardTab';
import { motion, AnimatePresence } from 'motion/react';
import { useDev } from './context/DevContext';
import { SettingsTab } from './components/SettingsTab';
import { useToast } from './context/ToastContext';
import { AuthModal } from './components/AuthModal';
import RainOfArthurPage from './rain_effect/RainOfArthurPage';
import Landing from './components/Landing';

import { 
  compressImage, 
  formatPrice, 
  generateWhatsAppLink, 
  generateTelegramLink, 
  generateSimpleQRCodeSVG, 
  TRANSLATIONS,
  getTextStyles
} from './utils';

const STYLE_KEYS = [
  'padding', 'bgColor', 'textColor', 'borderRadius', 'borderColor', 'borderWidth',
  'bgOpacity', 'hasBorder', 'borderStyleType', 'borderWidthValue', 'customBorderColor',
  'customCornersEnabled', 'customCornersRadius', 'customGradientStart', 'customGradientEnd',
  'customGradientAngle', 'customTextColor', 'customTitleColor', 'customDescColor', 'customTitleFont', 'customTitleFontSize', 'customDescFont', 'customDescFontSize', 'customIconColor', 'fillType', 'fillColor',
  'fillGradientPreset', 'fillGradientAnimated', 'bgEffects',
  'enableShadow', 'shadowSize', 'shadowIntensity', 'customShadow',
  'textAlign', 'textBold', 'textItalic', 'textUnderline', 'textLineHeight', 'textLetterSpacing',
  'textShimmerEnabled', 'textShimmerColor', 'textShimmerSpeed', 'textShimmerInterval', 'textShimmerDirection', 'textShadowEnabled', 'textShadowColor',
  'textShadowBlur', 'textShadowOffsetX', 'textShadowOffsetY', 'textGlowEnabled', 'textGlowColor', 'textGlowRadius',
  'titleTextStyles', 'descTextStyles',
  'enableHoverEffect', 'hoverBorderColor',
  'enableBlurEffect', 'blurEffectAmount',
  'enableGlareEffect', 'glareEffectSpeed', 'glareEffectColor',
  'enableGlowEffect', 'glowEffectColor', 'glowEffectSpeed',
  'enableNoiseEffect', 'noiseEffectOpacity',
  'enableGlassEffect', 'glassThickness', 'refractiveIndex', 'bezelWidth', 'glassZoom', 'glassPreset', 'glassShowSpecular',
  'borderGlowActive', 'borderGlowColor', 'borderGlowWidth', 'borderGlowOpacity',
  'borderCornerGlowActive', 'borderCornerColorTL', 'borderCornerColorTR', 'borderCornerColorBL', 'borderCornerColorBR',
  'borderCornerLength', 'borderCornerStroke', 'borderCornerGlowSpread', 'borderCornerGlowOpacity',
  'tabletOverrides', 'mobileOverrides', 'darkOverrides'
];

const stripLargeBase64AndStrings = (obj: any, keyName?: string): any => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    // Exempt keys that are meant to hold uploaded image base64 data URLs or SVGs
    const isExempt = keyName === 'fillImage' || keyName === 'bgImage' || keyName === 'avatarSvgRaw';
    if (!isExempt && (obj.length > 2000 || obj.startsWith('data:'))) {
      return '';
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => stripLargeBase64AndStrings(item, keyName));
  }
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cleaned[key] = stripLargeBase64AndStrings(obj[key], key);
      }
    }
    return cleaned;
  }
  return obj;
};

const cleanTemplateConfig = (template: any) => {
  if (!template || !template.config) return template;
  
  const config = template.config;
  
  // 1. Rebuild or update blockTypeDefaults from live blocks to ensure latest custom designs are saved
  if (config.blocks) {
    const blockTypeDefaults: Record<string, any> = { ...(config.blockTypeDefaults || {}) };
    
    const collectStyles = (blocksList: any[]) => {
      if (!Array.isArray(blocksList)) return;
      blocksList.forEach(b => {
        if (!b) return;
        const styleObj: any = {};
        STYLE_KEYS.forEach(key => {
          if (b[key] !== undefined) {
            styleObj[key] = b[key];
          }
        });
        if (b.type === 'socials' && b.socialsContent) {
          styleObj.socialsContentStyle = {
            iconSize: b.socialsContent.iconSize,
            maxPerRow: b.socialsContent.maxPerRow,
            iconSpacing: b.socialsContent.iconSpacing,
            layout: b.socialsContent.layout,
            iconStyle: b.socialsContent.iconStyle ? JSON.parse(JSON.stringify(b.socialsContent.iconStyle)) : undefined
          };
        }
        if (b.type === 'profile' && b.profileContent) {
          styleObj.profileContentStyle = {
            avatarShape: b.profileContent.avatarShape,
            avatarSize: b.profileContent.avatarSize,
            layout: b.profileContent.layout,
            align: b.profileContent.align,
            fullWidth: b.profileContent.fullWidth,
            showAvatar: b.profileContent.showAvatar,
            bgImage: b.profileContent.bgImage,
            avatarBorderEnabled: b.profileContent.avatarBorderEnabled,
            avatarBorderWidth: b.profileContent.avatarBorderWidth,
            avatarBorderStyle: b.profileContent.avatarBorderStyle,
            avatarBorderColor: b.profileContent.avatarBorderColor,
            avatarShadowEnabled: b.profileContent.avatarShadowEnabled,
            avatarShadowBlur: b.profileContent.avatarShadowBlur,
            avatarShadowColor: b.profileContent.avatarShadowColor,
            avatarShadowOpacity: b.profileContent.avatarShadowOpacity,
            avatarShadowOffsetX: b.profileContent.avatarShadowOffsetX,
            avatarShadowOffsetY: b.profileContent.avatarShadowOffsetY,
            avatarGlowEnabled: b.profileContent.avatarGlowEnabled,
            avatarGlowColor: b.profileContent.avatarGlowColor,
            avatarGlowRadius: b.profileContent.avatarGlowRadius,
            avatarGlowIntensity: b.profileContent.avatarGlowIntensity,
            avatarShimmerEnabled: b.profileContent.avatarShimmerEnabled,
            avatarShimmerSpeed: b.profileContent.avatarShimmerSpeed,
            avatarShimmerColor: b.profileContent.avatarShimmerColor,
            avatarShimmerWidth: b.profileContent.avatarShimmerWidth,
            avatarShimmerInterval: b.profileContent.avatarShimmerInterval,
            avatarGlassEnabled: b.profileContent.avatarGlassEnabled,
            avatarGlassColor: b.profileContent.avatarGlassColor,
            avatarGlassOpacity: b.profileContent.avatarGlassOpacity,
            avatarGlassReflectIntensity: b.profileContent.avatarGlassReflectIntensity,
            avatarGlassType: b.profileContent.avatarGlassType,
            avatarGlassBlur: b.profileContent.avatarGlassBlur,
            avatarGlassAngle: b.profileContent.avatarGlassAngle,
            avatarSvgRaw: b.profileContent.avatarSvgRaw,
            avatarSvgColor: b.profileContent.avatarSvgColor
          };
        }
        blockTypeDefaults[b.type] = styleObj;
        
        if (b.type === 'group' && b.groupContent && b.groupContent.blocks) {
          collectStyles(b.groupContent.blocks);
        }
      });
    };
    
    collectStyles(config.blocks);
    config.blockTypeDefaults = blockTypeDefaults;
  }
  
  // 2. Keep ONLY style properties in the config and scrub huge string values (e.g. base64 data URLs)
  const cleanConfig: any = stripLargeBase64AndStrings({
    theme: config.theme,
    mainBg: config.mainBg,
    designTemplate: config.designTemplate,
    blockDefaults: config.blockDefaults,
    blockTypeDefaults: config.blockTypeDefaults
  });
  
  return {
    ...template,
    config: cleanConfig
  };
};

const isThemeSpecificProperty = (key: string): boolean => {
  const k = key.toLowerCase();
  
  if (k === 'iconstyle') return true;
  
  // Never treat structural or nested content objects as simple theme-specific properties
  const structural = ['mainbg', 'darkoverrides', 'mobileoverrides', 'rowblocks', 'groupcontent', 'blocks', 'spacercontent', 'profilecontent', 'socialscontent', 'mediacontent', 'catalogcontent', 'buttoncontent', 'lightconfig', 'darkconfig'];
  if (structural.includes(k)) return false;

  // Content and structural keys that should always be synced across themes
  const contentKeys = [
    'name', 'bio', 'text', 'content', 'title', 'description', 'role', 'location', 
    'platform', 'link', 'url', 'avatar', 'icon', 'font', 'size', 'weight', 
    'spacing', 'width', 'height', 'top', 'bottom', 'left', 'right',
    'margin', 'padding', 'align', 'justify', 'flex', 'grid', 'column', 'row', 'order',
    'zindex', 'overflow', 'display', 'position', 'visible', 'hidden', 'enabled', 'active',
    'id', 'type', 'subtype', 'speed', 'complexity', 'count', 'nx', 'ny', 'angle', 'rotation', 'pos', 'depth',
    'jitter', 'wavelength', 'amplitude', 'frequency', 'separation', 'particlesize', 'camera', 'ispaused',
    'algorithm', 'gridx', 'gridy', 'direction', 'seed', 'item', 'product', 'price', 'currency', 'stock',
    'zoom', 'scale', 'thickness', 'density', 'fov', 'wireframe', 'range', 'factor', 'smoothness', 'strength'
  ];

  if (contentKeys.some(ck => k === ck || k.endsWith(ck))) {
    // Exception: if it specifically mentions a theme-related term while ending with a content key
    if (
      k.includes('color') || k.includes('gradient') || k.includes('fill') || k.includes('glow') || 
      k.includes('opacity') || k.includes('blur') || k.includes('shadow') || (k.includes('bg') && k !== 'mainbg') ||
      k.includes('border') || k.includes('glass') || k.includes('bezel') || k.includes('preset') || 
      k.includes('glare') || k.includes('shimmer') || k.includes('intensity') || k.includes('outline') || 
      k.includes('accent') || k.includes('highlight') || k.includes('theme')
    ) {
       return true;
    }
    return false;
  }

  // Everything else is considered theme-specific (colors, effects, aesthetic overrides)
  return (
    k.includes('color') ||
    k.includes('gradient') ||
    k.includes('glow') ||
    k.includes('shadow') ||
    k.includes('fill') ||
    k.includes('stop') ||
    k.includes('glare') ||
    k.includes('hue') ||
    k.includes('shimmer') ||
    k.includes('glass') ||
    k.includes('tint') ||
    k.includes('opacity') ||
    k.includes('blur') ||
    k.includes('intensity') ||
    k.includes('reflection') ||
    k.includes('border') ||
    k.includes('outline') ||
    k.includes('shininess') ||
    k.includes('saturation') ||
    k.includes('lightness') ||
    k.includes('accent') ||
    k.includes('highlight') ||
    (k.includes('bg') && k !== 'mainbg') ||
    k.includes('backdrop') ||
    k.includes('filter') ||
    k.includes('theme') ||
    k.includes('mixblend') ||
    k.includes('active') ||
    k.includes('hover') ||
    k.includes('preset') ||
    k.includes('bezel') ||
    k.includes('refractive')
  );
};

const cleanThemeProperties = (obj: any): any => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const cleaned: any = {};
  Object.keys(obj).forEach(key => {
    if (isThemeSpecificProperty(key)) return;
    const val = obj[key];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      cleaned[key] = cleanThemeProperties(val);
    } else {
      cleaned[key] = val;
    }
  });
  return cleaned;
};

const stripContentProperties = (key: string, obj: any): any => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  
  const k = key.toLowerCase();
  const cleaned = { ...obj };
  
  if (k === 'profilecontent') {
    delete cleaned.avatar;
    delete cleaned.name;
    delete cleaned.bio;
    delete cleaned.avatarSvgRaw;
    delete cleaned.avatarSvgColor;
  } else if (k === 'textcontent') {
    delete cleaned.title;
    delete cleaned.body;
  } else if (k === 'buttoncontent') {
    delete cleaned.label;
    delete cleaned.url;
  } else if (k === 'mediacontent') {
    delete cleaned.items;
    delete cleaned.autoplay;
    delete cleaned.loop;
    delete cleaned.showControls;
  } else if (k === 'catalogitemcontent') {
    delete cleaned.id;
    delete cleaned.image;
    delete cleaned.title;
    delete cleaned.description;
    delete cleaned.price;
  } else if (k === 'categoryheadercontent') {
    delete cleaned.title;
  } else if (k === 'socialscontent') {
    delete cleaned.links;
  } else if (k === 'mediacontent') {
    delete cleaned.items;
  } else if (k === 'groupcontent') {
    delete cleaned.title;
  }
  
  return cleaned;
};

const mergeThemeOverrides = (base: any, overrides: any): any => {
  if (!overrides || typeof overrides !== 'object') return base;
  if (Array.isArray(overrides)) return overrides; 
  
  const result = { ...base };
  Object.keys(overrides).forEach(key => {
    const val = overrides[key];
    if (val === undefined || val === null) return;
    
    if (isThemeSpecificProperty(key)) {
      result[key] = val;
    } else if (Array.isArray(val)) {
      const baseArr = Array.isArray(base[key]) ? base[key] : [];
      // Apply overrides to elements, keeping base structure
      result[key] = val.map((oItem, i) => {
        const bItem = baseArr[i];
        if (!bItem || typeof oItem !== 'object' || Array.isArray(oItem)) return oItem;
        return mergeThemeOverrides(bItem, oItem);
      });
      // If base was longer, keep remaining elements (important for partial array updates)
      if (baseArr.length > val.length) {
        result[key] = [...result[key], ...baseArr.slice(val.length)];
      }
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      result[key] = mergeThemeOverrides(base[key] || {}, val);
    }
  });
  return result;
};

const splitThemeUpdates = (base: any, dark: any, updates: any, theme: 'light' | 'dark'): { base: any; dark: any } => {
  const nBase = { ...base };
  const nDark = { ...dark };

  Object.keys(updates).forEach(key => {
    const val = updates[key];
    if (val === undefined) return;

    if (isThemeSpecificProperty(key)) {
      if (theme === 'dark') {
        if (val === null) delete nDark[key];
        else nDark[key] = val;
      } else {
        nBase[key] = val;
        // If we update a theme property in light mode, it SHOULD overwrite the dark one too IF they were identical 
        // (to keep them in sync if the user hasn't deviated), but currently we want full independence.
        // If the user explicitly wants to sync, they use syncThemes toggle.
      }
    } else if (Array.isArray(val)) {
      const bArr = Array.isArray(base[key]) ? base[key] : [];
      const dArr = Array.isArray(dark[key]) ? dark[key] : [];
      const resBase: any[] = [];
      const resDark: any[] = [];
      
      val.forEach((item, i) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
           const { base: nb, dark: nd } = splitThemeUpdates(bArr[i] || {}, dArr[i] || {}, item, theme);
           resBase[i] = nb;
           if (Object.keys(nd).length > 0) {
             resDark[i] = nd;
           }
        } else {
           resBase[i] = item;
        }
      });
      nBase[key] = resBase;
      if (resDark.length > 0 && resDark.some(x => x !== undefined)) {
        nDark[key] = resDark;
      }
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      const { base: nb, dark: nd } = splitThemeUpdates(base[key] || {}, dark[key] || {}, val, theme);
      nBase[key] = nb;
      if (Object.keys(nd).length > 0) {
        nDark[key] = nd;
      }
    } else {
      nBase[key] = val;
      // If we update a non-theme property, we should remove it from dark overrides 
      // so it falls back to the new base value.
      if (nDark[key] !== undefined) {
        delete nDark[key];
      }
    }
  });

  return { base: nBase, dark: nDark };
};

export function resolveBlockOverrides(block: Block, device: 'none' | 'tablet' | 'mobile', theme: 'light' | 'dark' = 'light'): Block {
  if (!block) return block;
  
  // Fast path: if no overrides, return original to preserve reference stability and avoid re-render loops
  if ((!block.darkOverrides || Object.keys(block.darkOverrides).length === 0) && 
      (!block.mobileOverrides || Object.keys(block.mobileOverrides).length === 0) &&
      (!block.tabletOverrides || Object.keys(block.tabletOverrides).length === 0)) {
    return block;
  }

  let resolved = { ...block };

  // 1. First apply theme overrides if we are in dark mode
  if (theme === 'dark' && block.darkOverrides && Object.keys(block.darkOverrides).length > 0) {
    resolved = mergeThemeOverrides(resolved, block.darkOverrides);
  }

  // 2. Then apply device overrides (mobile and tablet supported)
  if (device === 'none') return resolved;
  const overrides = device === 'mobile' ? block.mobileOverrides : (device === 'tablet' ? block.tabletOverrides : null);
  if (!overrides || Object.keys(overrides).length === 0) return resolved;

  Object.keys(overrides).forEach(key => {
    let value = (overrides as any)[key];
    if (value !== undefined) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        value = cleanThemeProperties(value);
        value = stripContentProperties(key, value);
      }
      if (key === 'spacerContent' && resolved.spacerContent) {
        resolved.spacerContent = { ...resolved.spacerContent, ...value };
      } else if (key === 'profileContent' && resolved.profileContent) {
        resolved.profileContent = { ...resolved.profileContent, ...value };
      } else if (key === 'socialsContent' && resolved.socialsContent) {
        resolved.socialsContent = { ...resolved.socialsContent, ...value };
      } else if ((resolved as any)[key] && typeof (resolved as any)[key] === 'object' && !Array.isArray((resolved as any)[key])) {
        (resolved as any)[key] = { ...(resolved as any)[key], ...value };
      } else {
        (resolved as any)[key] = value;
      }
    }
  });

  return resolved;
}

function useActiveDevice(viewMode: 'desktop' | 'mobile' | 'tablet', isEditorMode: boolean) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If the physical window width is mobile size (less than 640px), we must enforce 'mobile'
  // mode. Rendering tablet/desktop configurations on a mobile physical screen would overflow and break.
  if (windowWidth < 640) {
    return 'mobile';
  }

  // If screen is physically tablet size and preview is set to PC/None, fall back to tablet layout to avoid overflow.
  if (windowWidth < 1024 && viewMode === 'desktop') {
    return 'tablet';
  }

  if (viewMode !== 'desktop') {
    return viewMode;
  }

  if (isEditorMode) {
    return 'none';
  }

  if (windowWidth < 1024) {
    return 'tablet';
  }
  return 'none';
}

// Template aesthetics preset definition
const DESIGN_PRESETS = [
  {
    id: 'tpl-default',
    nameEn: 'Basic White',
    nameRu: 'Базовый',
    descriptionEn: 'Clear white minimalism with elegant spacing.',
    descriptionRu: 'Чистый светлый минимализм с аккуратным межстрочным полем.',
    previewGradient: 'from-zinc-50 via-zinc-100 to-zinc-200',
    config: {
      designTemplate: 'none',
      theme: 'modern',
      mainBg: {
        theme: 'light',
        syncThemes: true,
        lightConfig: {
          fillType: 'color',
          fillColor: '#FFFFFF'
        }
      },
      blockDefaults: {
        bgColor: 'bg-white',
        textColor: 'text-black',
        hasBorder: true,
        customBorderColor: '#E5E7EB',
        bgOpacity: 100,
        enableShadow: false,
        enableBlurEffect: false,
        enableGlareEffect: false,
        enableGlowEffect: false,
        enableNoiseEffect: false,
        enableHoverEffect: false
      }
    }
  },
  {
    id: 'tpl-chroma',
    nameEn: 'Chroma Lab',
    nameRu: 'Хрома Лаб',
    descriptionEn: 'Matte glass overlays with an ambient fluid spectrum field.',
    descriptionRu: 'Стильное матовое стекло поверх живой орбитальной волны.',
    previewGradient: 'from-purple-900 via-indigo-950 to-pink-950',
    config: {
      designTemplate: 'chroma-lab',
      theme: 'modern',
      mainBg: {
        theme: 'dark',
        syncThemes: true,
        lightConfig: {
          fillType: 'color',
          fillColor: '#050505',
          effects: [
            { id: 'chroma-lab-eff', type: 'chroma-lab', color: '#ffffff', opacity: 100, speed: 1, position: 'bottom', height: 100, seed: 123, hue: 280 }
          ]
        },
        darkConfig: {
          fillType: 'color',
          fillColor: '#050505',
          effects: [
            { id: 'chroma-lab-eff', type: 'chroma-lab', color: '#ffffff', opacity: 100, speed: 1, position: 'bottom', height: 100, seed: 123, hue: 280 }
          ]
        }
      },
      blockDefaults: {
        bgColor: 'bg-zinc-950/40',
        bgOpacity: 15,
        borderRadius: 'lg',
        hasBorder: true,
        customBorderColor: 'oklch(0.9 0.05 280 / 0.3)',
        hoverBorderColor: 'oklch(0.95 0.1 280 / 0.6)',
        borderWidthValue: 1,
        enableBlurEffect: true,
        blurEffectAmount: 20,
        enableShadow: true,
        shadowSize: 25,
        shadowIntensity: 90,
        enableHoverEffect: true
      }
    }
  },
  {
    id: 'tpl-retro',
    nameEn: 'Basic Dark',
    nameRu: 'Базовый темный',
    descriptionEn: 'Deep black elegance with sharp contrasts.',
    descriptionRu: 'Глубокая черная элегантность с четкими контрастами.',
    previewGradient: 'from-zinc-800 via-zinc-900 to-black',
    config: {
      designTemplate: 'none',
      theme: 'modern',
      mainBg: {
        theme: 'dark',
        syncThemes: true,
        darkConfig: {
          fillType: 'color',
          fillColor: '#000000',
        }
      },
      blockDefaults: {
        bgColor: 'bg-black',
        textColor: 'text-white',
        hasBorder: true,
        customBorderColor: '#3F3F46',
        bgOpacity: 100,
        enableShadow: false,
        enableBlurEffect: false,
        enableGlareEffect: false,
        enableGlowEffect: false,
        enableNoiseEffect: false,
        enableHoverEffect: false
      }
    }
  }
];

export default function App() {
  // Synchronous top-level migration to permanently move existing user templates to ready-made templates list (v6)
  // This runs immediately upon initialization, before any useState initializers execute.
  try {
    const migratedFlag = localStorage.getItem('nocode_migrated_v6_final');
    if (migratedFlag !== 'true') {
      const savedUserTpls = localStorage.getItem('nocode_user_templates');
      const savedReadyTpls = localStorage.getItem('nocode_custom_ready_templates');
      
      let readyList: any[] = [];
      if (savedReadyTpls) {
        try {
          const parsedReady = JSON.parse(savedReadyTpls);
          if (Array.isArray(parsedReady)) {
            // Scrub any existing large items inside the custom ready-made list as well
            readyList = parsedReady.map(cleanTemplateConfig);
          }
        } catch (e) {}
      }

      if (savedUserTpls) {
        try {
          const parsedUser = JSON.parse(savedUserTpls);
          if (Array.isArray(parsedUser) && parsedUser.length > 0) {
            // Clean newly migrated templates of massive data/base64 strings
            const cleaned = parsedUser.map(cleanTemplateConfig);
            
            // Merge into ready list avoiding duplicate IDs
            const existingIds = new Set(readyList.map(t => t.id));
            const newToAdd = cleaned.filter(t => !existingIds.has(t.id));
            readyList = [...readyList, ...newToAdd];
            
            try {
              set('nocode_custom_ready_templates', readyList).catch(e => console.error(e));
              set('nocode_user_templates', []).catch(e => console.error(e));
              localStorage.setItem('nocode_custom_ready_templates', JSON.stringify(readyList));
              localStorage.setItem('nocode_user_templates', JSON.stringify([]));
            } catch (e) {
              console.warn('localStorage full during migration');
            }
          }
        } catch (e) {}
      }
      localStorage.setItem('nocode_migrated_v6_final', 'true');
    }
  } catch (err) {
    console.error("Top-level templates migration error:", err);
  }

  // Navigation tabs: 'landing' | 'projects' | 'editor' | 'dashboard' | 'preview'
  const { isAuthenticated, login, logout, planType, activeTab, setActiveTab, activeProjectId, projects, developerMode, updateProject } = useDev();
  const activeProjectForPremiumCheck = projects.find(p => p.id === activeProjectId);
  const isPremium = activeProjectForPremiumCheck ? (activeProjectForPremiumCheck.tariff === 'Premium') : (planType === 'premium');
  const toast = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && activeTab !== 'landing') {
      setActiveTab('landing');
    }
  }, [isAuthenticated, activeTab]);
  
  // Selection of template type
  const [templateType, setTemplateType] = useState<'business' | 'restaurant' | 'catalog'>('business');
  
  useEffect(() => {
    if (activeProjectId) {
      const activeProject = projects.find(p => p.id === activeProjectId);
      if (activeProject) {
        let targetType: 'business' | 'restaurant' | 'catalog' = 'business';
        if (activeProject.type === 'menu') targetType = 'restaurant';
        if (activeProject.type === 'catalog') targetType = 'catalog';
        if (templateType !== targetType) {
          setTemplateType(targetType);
        }
      }
    }
  }, [activeProjectId, projects, templateType]);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Track the project ID that is currently loaded in the configs state
  const [loadedProjectId, setLoadedProjectId] = useState<string | null>(null);
  const prevActiveProjectIdRef = useRef<string | null>(null);

  // Effect to load project-specific configurations when switching projects
  useEffect(() => {
    // Load the active project's configuration
    if (activeProjectId && isDataLoaded) {
      const activeProject = projects.find(p => p.id === activeProjectId);
      if (activeProject) {
        let targetType: 'business' | 'restaurant' | 'catalog' = 'business';
        if (activeProject.type === 'menu') targetType = 'restaurant';
        if (activeProject.type === 'catalog') targetType = 'catalog';
        
        async function loadProjectConfig() {
          try {
            const savedProjConfig = await get(`nocode_cfg_project_${activeProjectId}`) ?? localStorage.getItem(`nocode_cfg_project_${activeProjectId}`);
            let loadedConfig: ProjectConfig | null = null;
            let isNewConfig = false;
            
            if (savedProjConfig) {
              loadedConfig = typeof savedProjConfig === 'string' ? JSON.parse(savedProjConfig) : savedProjConfig;
            }
            
            if (!loadedConfig && (activeProjectId === 'demo-card' || activeProjectId === 'demo-menu')) {
              // Backward compatibility fallback to the global config ONLY for demo projects
              const globalKey = `nocode_cfg_${targetType}`;
              const globalSaved = await get(globalKey) ?? localStorage.getItem(globalKey);
              if (globalSaved) {
                loadedConfig = typeof globalSaved === 'string' ? JSON.parse(globalSaved) : globalSaved;
              }
            }

            if (!loadedConfig) {
              loadedConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIGS[targetType]));
              isNewConfig = true;
            }
            
            if (loadedConfig) {
              if (isNewConfig) {
                let modified = false;
                
                // 1. Sync name, avatar, description into profile block if exists
                loadedConfig.blocks = loadedConfig.blocks.map(block => {
                  if (block.type === 'profile') {
                    const profile = block.profileContent;
                    const newAvatar = activeProject.avatar || profile?.avatar || PLACEHOLDERS.avatarBusiness;
                    const newBio = activeProject.description || profile?.bio || '';
                    
                    // Determine initial inspector-compatible settings based on selected project creation layout
                    const initLayout = activeProject.layout === 'classic' ? 'stacked' : 'row';
                    const initAlign = activeProject.layout === 'classic' ? 'center' : 'left';
                    const initFullWidth = activeProject.layout === 'cover';
                    
                    modified = true;
                    return {
                      ...block,
                      fullWidth: initFullWidth,
                      profileContent: {
                        ...(profile || { name: '', avatar: '', bio: '' }),
                        name: activeProject.name,
                        avatar: newAvatar,
                        bio: newBio,
                        layout: initLayout,
                        align: initAlign,
                        fullWidth: initFullWidth,
                      }
                    };
                  }
                  return block;
                });

                // 2. Sync themeStyle into mainBg
                if (activeProject.themeStyle) {
                  modified = true;
                  const fillGradientPreset = activeProject.themeStyle as any;
                  const presetEffects: BgEffect[] = [
                    {
                      id: 'bg-fx-1',
                      type: fillGradientPreset === 'cosmic' ? 'plasma' : fillGradientPreset === 'sunset' ? 'blob' : fillGradientPreset === 'ocean' ? 'css-waves' : fillGradientPreset === 'emerald' ? 'blob' : 'plasma',
                      color: fillGradientPreset === 'cosmic' ? '#6366f1' : fillGradientPreset === 'sunset' ? '#f97316' : fillGradientPreset === 'ocean' ? '#0ea5e9' : fillGradientPreset === 'emerald' ? '#10b981' : '#6366f1',
                      opacity: 50,
                      speed: 1,
                      position: 'top',
                      height: 100,
                      seed: 1,
                      complexity: 3.0,
                      intensity: 1.0,
                      isPaused: false,
                    }
                  ];

                  const currentMainBg = loadedConfig.mainBg || {};
                  loadedConfig.mainBg = {
                    ...currentMainBg,
                    lightConfig: {
                      ...currentMainBg.lightConfig,
                      fillType: 'gradient',
                      fillGradientPreset,
                      fillGradientAnimated: true,
                      effects: presetEffects,
                    },
                    darkConfig: {
                      ...currentMainBg.darkConfig,
                      fillType: 'gradient',
                      fillGradientPreset,
                      fillGradientAnimated: true,
                      effects: presetEffects,
                    }
                  };
                }

                if (modified) {
                  const key = `nocode_cfg_project_${activeProjectId}`;
                  await set(key, loadedConfig).catch(e => console.error('Error saving new project config to IDB', e));
                  try {
                    localStorage.setItem(key, JSON.stringify(loadedConfig));
                  } catch (e) {
                    console.warn(e);
                  }
                }
              }

              setConfigs(prev => ({
                ...prev,
                [targetType]: loadedConfig
              }));
              setLoadedProjectId(activeProjectId);
            }
          } catch (e) {
            console.error('Error loading project config', e);
          }
        }
        
        loadProjectConfig();
      }
    } else if (!activeProjectId && isDataLoaded) {
      setLoadedProjectId(null);
    }
  }, [activeProjectId, isDataLoaded]);

  // Custom language switcher
  const [lang, setLang] = useState<'en' | 'ru'>('en');
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Project Creation Modal State
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectStep, setNewProjectStep] = useState(1);
  const [newProjectData, setNewProjectData] = useState({
    type: '',
    title: '',
    subtitle: '',
    image: '',
    structure: 1,
    style: 1
  });
  
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [projectToDeleteIndex, setProjectToDeleteIndex] = useState<number | null>(null);
  
  // Complete configurations for each of the three template routes, loaded or defaulted
  const [configs, setConfigs] = useState<Record<'business' | 'restaurant' | 'catalog', ProjectConfig>>(DEFAULT_CONFIGS);

  const [customReadyTemplates, setCustomReadyTemplates] = useState<any[]>([]);
  const [userTemplates, setUserTemplates] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const savedBusiness = await get('nocode_cfg_business') ?? localStorage.getItem('nocode_cfg_business');
        const savedRestaurant = await get('nocode_cfg_restaurant') ?? localStorage.getItem('nocode_cfg_restaurant');
        const savedCatalog = await get('nocode_cfg_catalog') ?? localStorage.getItem('nocode_cfg_catalog');
        
        const b = typeof savedBusiness === 'string' ? JSON.parse(savedBusiness) : savedBusiness;
        const r = typeof savedRestaurant === 'string' ? JSON.parse(savedRestaurant) : savedRestaurant;
        const c = typeof savedCatalog === 'string' ? JSON.parse(savedCatalog) : savedCatalog;

        setConfigs({
          business: b || DEFAULT_CONFIGS.business,
          restaurant: r || DEFAULT_CONFIGS.restaurant,
          catalog: c || DEFAULT_CONFIGS.catalog,
        });

        let apiTemplates: any[] | null = null;
        try {
          const res = await fetch('/api/custom-ready-templates');
          if (res.ok) {
            apiTemplates = await res.json();
          }
        } catch (apiErr) {
          console.warn('API fetch for custom templates failed, using static fallback', apiErr);
        }

        // Rescue user templates from old nocode_custom_ready_templates if they were migrated there previously
        let rescuedUserTemplates: any[] = [];
        try {
          const savedReady = await get('nocode_custom_ready_templates') ?? localStorage.getItem('nocode_custom_ready_templates');
          const localTemplates = typeof savedReady === 'string' ? JSON.parse(savedReady) : savedReady;
          if (Array.isArray(localTemplates) && localTemplates.length > 0) {
            rescuedUserTemplates = localTemplates.filter(t => 
              t && (t.isUserTemplate === true || t.id?.startsWith('user-') || (!t.id?.startsWith('tpl-') && !t.id?.startsWith('ready-')))
            );
          }
        } catch (rescueErr) {
          console.warn('Could not check ready templates for custom templates to rescue', rescueErr);
        }

        // Clean up any old copies of ready-made templates from local storage / IndexedDB
        try {
          localStorage.removeItem('nocode_custom_ready_templates');
          del('nocode_custom_ready_templates').catch(e => console.error(e));
        } catch (e) {}

        const systemTemplates = (apiTemplates !== null && Array.isArray(apiTemplates) && apiTemplates.length > 0)
          ? apiTemplates
          : STATIC_READY_TEMPLATES;

        const templateMap = new Map<string, any>();
        systemTemplates.forEach(t => {
          if (t && t.id && t.id !== 'tpl-anakonda' && t.id !== 'anakonda' && t.nameEn?.toLowerCase() !== 'anakonda' && t.nameRu?.toLowerCase() !== 'anakonda') {
            templateMap.set(t.id, t);
          }
        });

        // Ensure any anakonda instances are deleted from the map
        templateMap.delete('tpl-anakonda');
        templateMap.delete('anakonda');

        const mergedTemplates = Array.from(templateMap.values()).map(cleanTemplateConfig);
        setCustomReadyTemplates(mergedTemplates);

        const savedUser = await get('nocode_user_templates') ?? localStorage.getItem('nocode_user_templates');
        let parsedUser = typeof savedUser === 'string' ? JSON.parse(savedUser) : savedUser;
        if (!Array.isArray(parsedUser)) {
          parsedUser = [];
        }

        // Add rescued user templates to user's saved templates, keeping unique IDs
        if (rescuedUserTemplates.length > 0) {
          const existingUserIds = new Set(parsedUser.map((t: any) => t.id));
          const newToAdd = rescuedUserTemplates.filter(t => !existingUserIds.has(t.id)).map(t => ({ ...t, isUserTemplate: true }));
          if (newToAdd.length > 0) {
            parsedUser = [...parsedUser, ...newToAdd];
            try {
              localStorage.setItem('nocode_user_templates', JSON.stringify(parsedUser));
              set('nocode_user_templates', parsedUser).catch(e => console.error(e));
            } catch (e) {
              console.warn('localStorage full during rescue write');
            }
          }
        }

        setUserTemplates(parsedUser.map(cleanTemplateConfig));

      } catch (err) {
        console.error('Failed to load data from storage', err);
      } finally {
        setIsDataLoaded(true);
      }
    }
    loadData();
  }, []);


  // Active configuration depending on currently selected templateType
  const config = configs[templateType];

  const getMainBgStyle = (mainBg: any, scrollOffset: number) => {
    if (!mainBg) {
      return { className: 'bg-white', style: {}, effects: [] };
    }

    const { syncThemes, theme, lightConfig, darkConfig } = mainBg;
    
    // Determine active settings
    const activeTheme = theme || 'light';
    const settings = (syncThemes || activeTheme === 'light') 
      ? (lightConfig || {}) 
      : (darkConfig || {});
      
    const { fillType, fillColor, fillImage, fillImageBlur, fillGradientPreset, fillGradientAnimated, effects } = settings;

    const baseStyle: React.CSSProperties = {
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    };

    if (fillType === 'image' && fillImage) {
      const blurVal = fillImageBlur !== undefined ? fillImageBlur : 0;
      return {
        className: 'text-white overflow-hidden',
        style: {},
        effects: effects || [],
        innerStyle: {
          ...baseStyle,
          backgroundImage: `url("${fillImage}")`,
          filter: blurVal > 0 ? `blur(${blurVal}px)` : 'none',
          transform: blurVal > 0 ? 'scale(1.1)' : 'none',
          position: 'absolute' as const,
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none' as const,
          transition: 'filter 0.3s ease, transform 0.3s ease',
        }
      };
    }

    if (fillType === 'gradient') {
      let gradientStyle = 'from-indigo-950 via-purple-950 to-zinc-950'; // Default cosmic
      if (fillGradientPreset === 'sunset') {
        gradientStyle = 'from-amber-600 via-rose-600 to-indigo-950';
      } else if (fillGradientPreset === 'ocean') {
        gradientStyle = 'from-teal-900 via-sky-900 to-blue-955';
      } else if (fillGradientPreset === 'emerald') {
        gradientStyle = 'from-emerald-990 via-teal-950 to-zinc-950';
      } else if (fillGradientPreset === 'bubblegum') {
        gradientStyle = 'from-fuchsia-800 via-violet-850 to-indigo-950';
      } else if (fillGradientPreset === 'fire') {
        gradientStyle = 'from-red-650 via-orange-600 to-yellow-950';
      }

      // If animated, we can use CSS animation
      const animateClass = fillGradientAnimated ? 'bg-[length:200%_200%] animate-gradient-flow-slow' : '';

      return {
        className: `bg-gradient-to-br ${gradientStyle} ${animateClass}`,
        style: {
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
        },
        effects: effects || [],
      };
    }

    // Default: Color
    const resolvedColor = fillColor || '#ffffff';
    // If color is dark, text should be white, otherwise black
    const isDark = resolvedColor === '#09090b' || resolvedColor === '#0f172a' || resolvedColor === '#111827' || resolvedColor === '#18181b' || resolvedColor === '#052e16';
    
    return {
      className: isDark ? 'text-white bg-zinc-950' : 'text-zinc-900 bg-white',
      style: {
        backgroundColor: resolvedColor,
      },
      effects: effects || [],
    };
  };
  
  // Controls visibility of sliding layers list, settings popup, and nested inserter
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  // DESIGN_PRESETS relocated to top-level module scope to avoid Temporal Dead Zone (TDZ)

  // Migration completed synchronously at component start
  const [templateToApply, setTemplateToApply] = useState<any | null>(null);
  const [applyToBackground, setApplyToBackground] = useState<boolean>(true);
  const [applyToWindows, setApplyToWindows] = useState<boolean>(true);

  useEffect(() => {
    if (templateToApply) {
      setApplyToBackground(true);
      setApplyToWindows(true);
    }
  }, [templateToApply]);

  // Undo/Redo History Stacks
  const [undoStack, setUndoStack] = useState<Record<'business' | 'restaurant' | 'catalog', ProjectConfig[]>>({
    business: [],
    restaurant: [],
    catalog: []
  });
  const [redoStack, setRedoStack] = useState<Record<'business' | 'restaurant' | 'catalog', ProjectConfig[]>>({
    business: [],
    restaurant: [],
    catalog: []
  });
  const [showSaveStyleModal, setShowSaveStyleModal] = useState(false);
  const [styleSaveName, setStyleSaveName] = useState('');
  const [showSaveReadyTemplateModal, setShowSaveReadyTemplateModal] = useState(false);
  const [readyTemplateSaveName, setReadyTemplateSaveName] = useState('');
  const [templateToDeleteId, setTemplateToDeleteId] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [showMockup, setShowMockup] = useState(false);

  // Auto-detect device on mount and resize
  useEffect(() => {
    const detectDevice = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) {
          setViewMode('mobile');
        } else if (window.innerWidth < 1024) {
          setViewMode('tablet');
        } else {
          setViewMode('desktop');
        }
      }
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  const activeDevice = useActiveDevice(viewMode === 'desktop' ? 'none' : viewMode, activeTab === 'editor');
  
  // Public Preview Theme Switching States
  const [activeThemeIndex, setActiveThemeIndex] = useState(0); 
  const [activeThemeName, setActiveThemeName] = useState('');
  const [likedThemes, setLikedThemes] = useState<Set<string>>(new Set());
  const [isPreviewMenuOpen, setIsPreviewMenuOpen] = useState(false);
  const [toggleBack, setToggleBack] = useState(true);
  const [toggleCards, setToggleCards] = useState(true);
  const [toggleDice, setToggleDice] = useState(false);
  const [originalConfigAtPreviewStart, setOriginalConfigAtPreviewStart] = useState<ProjectConfig | null>(null);

  // Re-apply current theme when settings change for live preview
  useEffect(() => {
    if (activeTab === 'preview' && activeThemeIndex !== -1) {
      applyThemeAtIndex(activeThemeIndex);
    }
  }, [toggleBack, toggleCards]);

  // Sync original config when entering preview
  useEffect(() => {
    if (activeTab === 'preview') {
      // Save deep copy of current state before we start messin' with themes
      setOriginalConfigAtPreviewStart(JSON.parse(JSON.stringify(configs[templateType])));
      setActiveThemeIndex(0);
      setActiveThemeName(lang === 'en' ? 'My Design' : 'Мой дизайн');
    } else {
      // If we are leaving preview, restore original (if we applied, original matches current so no-op)
      if (originalConfigAtPreviewStart) {
        setConfigs(prev => ({
          ...prev,
          [templateType]: JSON.parse(JSON.stringify(originalConfigAtPreviewStart))
        }));
      }
      // Cleanup
      setOriginalConfigAtPreviewStart(null);
    }
  }, [activeTab]);

  const publicThemes = [
    { id: 'original', name: lang === 'en' ? 'My Design' : 'Мой дизайн', config: originalConfigAtPreviewStart },
    ...DESIGN_PRESETS.map(t => ({ id: t.id, name: lang === 'en' ? t.nameEn : t.nameRu, config: t.config }))
  ];

  const handleNextTheme = () => {
    if (!toggleBack && !toggleCards) return;
    
    if (toggleDice) {
      const randomTheme = generateRandomThemeConfig();
      applyRandomTheme(randomTheme);
      return;
    }

    const nextIndex = (activeThemeIndex + 1) % publicThemes.length;
    applyThemeAtIndex(nextIndex);
  };

  const generateRandomThemeConfig = () => {
    const presets = ['sunset', 'ocean', 'emerald', 'bubblegum', 'fire', 'cosmic', 'aurora', 'noir', 'gold', 'lavender', 'custom'];
    const getRandomPreset = () => presets[Math.floor(Math.random() * presets.length)];
    const getRandomColor = () => `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    const fillTypes: ('color' | 'gradient')[] = ['color', 'gradient'];
    const getRandomFillType = () => fillTypes[Math.floor(Math.random() * fillTypes.length)];

    const effectsTypes = ['plasma', 'bezier-waves', 'flat-waves', 'chroma-lab', 'liquid-ripples', 'origami-ribbon', 'webgl-polylines', 'neon-stream', 'stars', 'blob', 'none'];
    const activeEffects = [];
    if (Math.random() > 0.2) {
      const effectCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < effectCount; i++) {
        activeEffects.push({
          id: `rand-eff-${i}`,
          type: effectsTypes[Math.floor(Math.random() * (effectsTypes.length - 1))],
          color: getRandomColor(),
          opacity: Math.floor(Math.random() * 70) + 10,
          speed: Math.random() * 2.0 + 0.2
        });
      }
    }

    const bgTheme = Math.random() > 0.5 ? 'dark' : 'light';

    return {
      mainBg: {
        theme: bgTheme,
        syncThemes: Math.random() > 0.1,
        [bgTheme === 'light' ? 'lightConfig' : 'darkConfig']: {
          fillType: getRandomFillType(),
          fillColor: getRandomColor(),
          fillGradientPreset: getRandomPreset(),
          fillGradientAnimated: Math.random() > 0.2,
          effects: activeEffects
        }
      },
      blockDefaults: {
        borderRadius: ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'][Math.floor(Math.random() * 8)],
        borderWidthValue: Math.floor(Math.random() * 6),
        borderStyleType: ['solid', 'dashed', 'dotted', 'double'][Math.floor(Math.random() * 4)],
        customBorderColor: getRandomColor(),
        enableShadow: Math.random() > 0.15,
        shadowSize: Math.floor(Math.random() * 80) + 5,
        customShadow: getRandomColor(),
        shadowIntensity: Math.floor(Math.random() * 80) + 10,
        enableBlurEffect: Math.random() > 0.2,
        blurEffectAmount: Math.floor(Math.random() * 30),
        bgOpacity: Math.floor(Math.random() * 95) + 5,
        enableGlassEffect: Math.random() > 0.4,
        glassThickness: Math.floor(Math.random() * 150) + 20,
        refractiveIndex: Math.random() * 4 + 1,
        bezelWidth: Math.floor(Math.random() * 40) + 5,
        glassPreset: ['convex-circular', 'convex-smooth', 'concave', 'ridge'][Math.floor(Math.random() * 4)],
        
        // Advanced effects
        enableGlareEffect: Math.random() > 0.7,
        glareEffectColor: getRandomColor(),
        glareEffectSpeed: Math.random() * 4 + 1,
        enableGlowEffect: Math.random() > 0.8,
        glowEffectColor: getRandomColor(),
        glowEffectSpeed: Math.random() * 3 + 0.5,
        enableNoiseEffect: Math.random() > 0.7,
        noiseEffectOpacity: Math.floor(Math.random() * 30),
        
        // Border glows
        borderGlowActive: Math.random() > 0.85,
        borderGlowColor: getRandomColor(),
        borderGlowWidth: Math.floor(Math.random() * 30),
        borderGlowOpacity: Math.floor(Math.random() * 80),
        borderCornerGlowActive: Math.random() > 0.85,
        borderCornerColorTL: getRandomColor(),
        borderCornerColorTR: getRandomColor(),
        borderCornerColorBL: getRandomColor(),
        borderCornerColorBR: getRandomColor(),
        borderCornerLength: Math.floor(Math.random() * 60) + 10,
        borderCornerStroke: Math.floor(Math.random() * 5) + 1,
      },
      blockTypeDefaults: {
        profile: {
          avatarShape: ['circle', 'square', 'rounded'][Math.floor(Math.random() * 3)],
          avatarBorderEnabled: Math.random() > 0.3,
          avatarBorderWidth: Math.floor(Math.random() * 8) + 1,
          avatarBorderStyle: ['solid', 'dashed', 'dotted', 'double'][Math.floor(Math.random() * 4)],
          avatarBorderColor: getRandomColor(),
          avatarGlowEnabled: Math.random() > 0.7,
          avatarGlowRadius: Math.floor(Math.random() * 80),
          avatarGlowIntensity: Math.floor(Math.random() * 90),
          avatarGlowColor: getRandomColor(),
          avatarShimmerEnabled: Math.random() > 0.8,
          avatarShimmerSpeed: Math.floor(Math.random() * 8) + 1,
          avatarShimmerColor: getRandomColor(),
          avatarShimmerWidth: Math.floor(Math.random() * 80) + 5,
          avatarShimmerInterval: Math.floor(Math.random() * 8) + 1,
          avatarGlassEnabled: Math.random() > 0.3,
          avatarGlassType: ['dome', 'retro', 'flat', 'crystal'][Math.floor(Math.random() * 4)],
          avatarGlassOpacity: Math.floor(Math.random() * 80),
          avatarGlassReflectIntensity: Math.floor(Math.random() * 80),
          avatarGlassBlur: Math.floor(Math.random() * 15),
          avatarGlassAngle: Math.floor(Math.random() * 360),
          avatarShadowEnabled: Math.random() > 0.4,
          avatarShadowBlur: Math.floor(Math.random() * 45),
          avatarShadowColor: getRandomColor(),
          avatarShadowOpacity: Math.floor(Math.random() * 80),
          avatarShadowOffsetX: Math.floor(Math.random() * 30) - 15,
          avatarShadowOffsetY: Math.floor(Math.random() * 30) - 15,
        },
        socials: {
          iconStyle: {
            preset: ['minimalist', 'neon', 'glassmorphic', 'retro-synth', 'corporate'][Math.floor(Math.random() * 5)],
            borderRadius: ['circle', 'square', 'rounded-lg', 'squircle'][Math.floor(Math.random() * 4)],
            fillType: ['color', 'gradient', 'none'][Math.floor(Math.random() * 3)],
            fillColor: getRandomColor(),
            gradientStart: getRandomColor(),
            gradientEnd: getRandomColor(),
            enableShadow: Math.random() > 0.4,
            shadowColor: getRandomColor(),
            enableGlare: Math.random() > 0.6,
            enableGlass: Math.random() > 0.6,
            enableBlur: Math.random() > 0.6,
          }
        }
      }
    };
  };

  const applyRandomTheme = (newConfig: any) => {
    // When randomizing, we set index to a special value (like -1) or keep as is but update configs
    setActiveThemeIndex(-1); // Special index for random
    setActiveThemeName(lang === 'en' ? 'Random Mix' : 'Случайный микс');
    
    setConfigs(prev => {
      const current = JSON.parse(JSON.stringify(prev[templateType]));

      if (toggleBack && newConfig.mainBg) {
        current.mainBg = newConfig.mainBg;
      }

      if (toggleCards) {
        current.blocks = current.blocks.map((b: any) => {
          let updatedBlock = { ...b };
          
          if (newConfig.blockDefaults) {
            updatedBlock = {
              ...updatedBlock,
              ...newConfig.blockDefaults,
              ...(newConfig.theme ? { theme: newConfig.theme } : {})
            };
          }

          // Apply type-specific random defaults
          if (newConfig.blockTypeDefaults && newConfig.blockTypeDefaults[b.type]) {
            const typeDefaults = newConfig.blockTypeDefaults[b.type];
            if (b.type === 'profile' && b.profileContent) {
              const profileStyle = typeDefaults.profileContentStyle || {};
              updatedBlock.profileContent = {
                ...b.profileContent,
                ...profileStyle
              };
            } else if (b.type === 'socials' && b.socialsContent) {
              const socialsStyle = typeDefaults.socialsContentStyle || {};
              updatedBlock.socialsContent = {
                ...b.socialsContent,
                ...socialsStyle
              };
            }
          }

          return updatedBlock;
        });
        if (newConfig.theme) {
          current.theme = newConfig.theme;
        }
      }

      return {
        ...prev,
        [templateType]: current
      };
    });
  };

  const handlePrevTheme = () => {
    if (!toggleBack && !toggleCards || activeThemeIndex === 0) return;
    
    let prevIndex;
    if (activeThemeIndex === -1) {
      prevIndex = 0; // Go back to original from random
    } else {
      prevIndex = (activeThemeIndex - 1 + publicThemes.length) % publicThemes.length;
    }
    applyThemeAtIndex(prevIndex);
  };

  const applyThemeAtIndex = (index: number) => {
    const theme = publicThemes[index];
    if (!theme || !theme.config) return;

    setActiveThemeIndex(index);
    setActiveThemeName(theme.name || '');
    
    setConfigs(prev => {
      const current = JSON.parse(JSON.stringify(prev[templateType]));
      const newConfig = JSON.parse(JSON.stringify(theme.config));

      if (toggleBack && newConfig.mainBg) {
        current.mainBg = newConfig.mainBg;
        if (newConfig.designTemplate !== undefined) {
          current.designTemplate = newConfig.designTemplate;
        }
      }

      if (toggleCards && newConfig.blockDefaults) {
        // Apply block defaults to all blocks
        current.blocks = current.blocks.map((b: any) => {
          const updated = { ...b, ...newConfig.blockDefaults };
          // If the template has a specific theme (modern/mono/serif), apply it too
          if (newConfig.theme) updated.theme = newConfig.theme;
          return updated;
        });
        if (newConfig.theme) current.theme = newConfig.theme;
      }

      return {
        ...prev,
        [templateType]: current
      };
    });
  };

  const isThemeLiked = likedThemes.has(activeThemeIndex === -1 ? 'random' : publicThemes[activeThemeIndex]?.id || '');
  const handleLike = () => {
    setLikedThemes(prev => {
      const next = new Set(prev);
      const currentId = activeThemeIndex === -1 ? 'random' : publicThemes[activeThemeIndex]?.id || '';
      if (next.has(currentId)) next.delete(currentId);
      else next.add(currentId);
      return next;
    });
  };

  const handleApplyTheme = () => {
    saveToLocalStorage(configs); // Save to disk and add to undo history
    setOriginalConfigAtPreviewStart(JSON.parse(JSON.stringify(configs[templateType])));
    setActiveThemeIndex(0);
    setToastMessage(lang === 'en' ? 'Style successfully applied to your design' : 'Стиль успешно применен к вашему дизайну');
    setShowApplyConfirm(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [showApplyConfirm, setShowApplyConfirm] = useState(false);

  const [isInserting, setIsInserting] = useState(false);

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [mobileScale, setMobileScale] = useState<number>(1.0);
  const [tabletScale, setTabletScale] = useState<number>(1.0);
  const [isDraggingScale, setIsDraggingScale] = useState<boolean>(false);

  const handleScaleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingScale(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const activeViewMode = viewMode;
    const startScale = activeViewMode === 'mobile' ? mobileScale : tabletScale;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      // Dragging diagonally from bottom-left to top-right (deltaX is positive, deltaY is negative)
      // should decrease the scale.
      // So, dragProgress increases when moving right (deltaX > 0) and up (deltaY < 0).
      const dragProgress = deltaX - deltaY;
      
      const newScale = Math.max(0.3, Math.min(1.0, startScale - dragProgress * 0.0015));
      if (activeViewMode === 'mobile') {
        setMobileScale(newScale);
      } else {
        setTabletScale(newScale);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingScale(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Currently focused block inside left workspace toolbar / mockup
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [blockDraggableId, setBlockDraggableId] = useState<string | null>(null);
  
  // UI helper alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Public visitor cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // State for image uploads in progress
  const [isCompressing, setIsCompressing] = useState(false);

  // Scroll states for Main Background Parallax feature
  const [phoneScrollY, setPhoneScrollY] = useState(0);
  const [windowScrollY, setWindowScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      setWindowScrollY(scrollY);
      // Sync window scroll to phone scroll ONLY if we are NOT using the phone mockup frame
      if (viewMode !== 'desktop' && !showMockup) {
        setPhoneScrollY(scrollY);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewMode, showMockup]);

  // Swipe to open/close layers drawer on mobile
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Ensure horizontal swipe
      if (Math.abs(diffX) > 80 && Math.abs(diffY) < 60) {
        if (diffX > 0) {
          // Swipe Right - Open drawer
          setShowLayersPanel(true);
        } else {
          // Swipe Left - Close drawer
          setShowLayersPanel(false);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // References
  const qrRef = useRef<SVGSVGElement | null>(null);

  // Horizontal drag scrolling for the block inserter
  const inserterListRef = useRef<HTMLDivElement | null>(null);
  const [inserterIsDragging, setInserterIsDragging] = useState(false);
  const [inserterStartX, setInserterStartX] = useState(0);
  const [inserterScrollLeft, setInserterScrollLeft] = useState(0);

  // Mouse event handlers for dragging the list
  const handleInserterMouseDown = (e: React.MouseEvent) => {
    if (!inserterListRef.current) return;
    setInserterIsDragging(true);
    const rect = inserterListRef.current.getBoundingClientRect();
    setInserterStartX(e.clientX - rect.left);
    setInserterScrollLeft(inserterListRef.current.scrollLeft);
  };

  const handleInserterMouseLeave = () => {
    setInserterIsDragging(false);
  };

  const handleInserterMouseUp = () => {
    setInserterIsDragging(false);
  };

  const handleInserterMouseMove = (e: React.MouseEvent) => {
    if (!inserterIsDragging || !inserterListRef.current) return;
    e.preventDefault();
    const rect = inserterListRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const walk = (x - inserterStartX) * 1.8; // scroll speed multiplier
    inserterListRef.current.scrollLeft = inserterScrollLeft - walk;
  };

  // Helper to scroll left/right programmatically via arrows
  const scrollInserter = (direction: 'left' | 'right') => {
    if (!inserterListRef.current) return;
    const offset = direction === 'left' ? -120 : 120;
    inserterListRef.current.scrollTo({
      left: inserterListRef.current.scrollLeft + offset,
      behavior: 'smooth'
    });
  };

  // Sync active language configuration to config.lang
  useEffect(() => {
    if (isDataLoaded) {
      updateConfigField('lang', lang);
    }
  }, [lang, isDataLoaded]);

  // Prevent page scroll when block inspector popup modal is open
  useEffect(() => {
    if (selectedBlockId && activeTab === 'editor') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedBlockId, activeTab]);

  // Sync config layout blocks to localStorage on change and update configs state
  const saveToLocalStorage = (newConfigs: Record<'business' | 'restaurant' | 'catalog', ProjectConfig>, skipHistory = false) => {
    if (!skipHistory) {
      setUndoStack(prev => ({
        ...prev,
        [templateType]: [...(prev[templateType] || []), JSON.parse(JSON.stringify(configs[templateType]))]
      }));
      setRedoStack(prev => ({
        ...prev,
        [templateType]: []
      }));
    }
    setConfigs(newConfigs);
    
    if (activeProjectId && !skipHistory) {
      updateProject(activeProjectId, { hasUnpublishedChanges: true });
    }

    set('nocode_cfg_business', newConfigs.business).catch(e => console.error('IDB save error', e));
    set('nocode_cfg_restaurant', newConfigs.restaurant).catch(e => console.error('IDB save error', e));
    set('nocode_cfg_catalog', newConfigs.catalog).catch(e => console.error('IDB save error', e));
    
    try {
      localStorage.setItem('nocode_cfg_business', JSON.stringify(newConfigs.business));
      localStorage.setItem('nocode_cfg_restaurant', JSON.stringify(newConfigs.restaurant));
      localStorage.setItem('nocode_cfg_catalog', JSON.stringify(newConfigs.catalog));
    } catch (e) {
      console.warn('localStorage quota exceeded, falling back to IDB only');
    }

    // Save project-specific configuration if we have an active project and it is currently loaded
    if (activeProjectId && loadedProjectId === activeProjectId) {
      const activeProject = projects.find(p => p.id === activeProjectId);
      if (activeProject) {
        let targetType: 'business' | 'restaurant' | 'catalog' = 'business';
        if (activeProject.type === 'menu') targetType = 'restaurant';
        if (activeProject.type === 'catalog') targetType = 'catalog';
        
        const projectConfig = newConfigs[targetType];
        set(`nocode_cfg_project_${activeProjectId}`, projectConfig).catch(e => console.error('IDB project save error', e));
        try {
          localStorage.setItem(`nocode_cfg_project_${activeProjectId}`, JSON.stringify(projectConfig));
        } catch (e) {
          console.warn('localStorage quota exceeded for project save', e);
        }
      }
    }
  };

  // Automatic downgrades/resets on plan changes are now removed.
  // Premium background/styling configs remain intact but render in freeze-frame mode on basic.

  const showToast = (msg: string) => {
    toast.success(msg);
  };

  // State update handlers
  const updateConfigField = <K extends keyof ProjectConfig>(field: K, value: ProjectConfig[K]) => {
    let finalValue = value;
    
    if (field === 'mainBg' && value) {
      const bg = JSON.parse(JSON.stringify(value)) as MainBgConfig;
      if (!bg.syncThemes) {
        const activeTheme = bg.theme || 'light';
        const activeConfigKey = activeTheme === 'light' ? 'lightConfig' : 'darkConfig';
        const otherConfigKey = activeTheme === 'light' ? 'darkConfig' : 'lightConfig';
        
        const activeConfig = bg[activeConfigKey];
        const otherConfig = bg[otherConfigKey];
        
        if (activeConfig && otherConfig) {
          const syncedOtherConfig = { ...otherConfig };
          
          Object.keys(activeConfig).forEach(key => {
            const isThemeProp = isThemeSpecificProperty(key);
            
            if (!isThemeProp && key !== 'effects') {
              (syncedOtherConfig as any)[key] = (activeConfig as any)[key];
            }
            if (key === 'effects' && activeConfig.effects) {
              syncedOtherConfig.effects = activeConfig.effects.map((eff, i) => {
                const otherEff = otherConfig.effects?.[i];
                // Sync everything EXCEPT theme properties
                const syncedEff = { ...eff };
                if (otherEff) {
                   // Restore otherEff theme properties to syncedEff
                   Object.keys(otherEff).forEach(ek => {
                     if (isThemeSpecificProperty(ek)) {
                       (syncedEff as any)[ek] = (otherEff as any)[ek];
                     }
                   });
                }
                return syncedEff;
              });
            }
          });
          
          (bg as any)[otherConfigKey] = syncedOtherConfig;
          finalValue = bg as ProjectConfig[K];
        }
      }
    }

    const updated = {
      ...configs,
      [templateType]: {
        ...configs[templateType],
        [field]: finalValue
      }
    };
    saveToLocalStorage(updated);
  };

  const updateBlocks = (newBlocks: Block[], skipHistory: boolean = false) => {
    const updated = {
      ...configs,
      [templateType]: {
        ...configs[templateType],
        blocks: newBlocks
      }
    };
    saveToLocalStorage(updated, skipHistory);
  };

  // Drag and drop layout states for layer editing
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<'before' | 'after' | 'inside' | null>(null);

  // Deep recursive block finder
  const findBlockRecursive = (blocks: Block[], id: string): Block | undefined => {
    for (const b of blocks) {
      if (b.id === id) return b;
      if (b.type === 'group' && b.groupContent) {
        const found = findBlockRecursive(b.groupContent.blocks, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  // Deep recursive descendant checker
  const isDescendant = (blocks: Block[], parentId: string, childId: string): boolean => {
    const parentBlock = findBlockRecursive(blocks, parentId);
    if (!parentBlock || parentBlock.type !== 'group' || !parentBlock.groupContent) return false;
    const checkHelper = (subBlocks: Block[]): boolean => {
      for (const b of subBlocks) {
        if (b.id === childId) return true;
        if (b.type === 'group' && b.groupContent && checkHelper(b.groupContent.blocks)) return true;
      }
      return false;
    };
    return checkHelper(parentBlock.groupContent.blocks);
  };

  // Deep recursive block updater
  const updateFocusedBlock = (updater: (b: Block) => Partial<Block>) => {
    if (!selectedBlockId) return;
    const currentTheme = config.mainBg?.syncThemes ? 'light' : (config.mainBg?.theme || 'light');
    
    const recurse = (blocks: Block[]): Block[] => {
      return blocks.map(b => {
        if (b.id === selectedBlockId) {
          const updates = updater(resolveBlockOverrides(b, viewMode, currentTheme));
          
          const { base, dark } = splitThemeUpdates(b, b.darkOverrides || {}, updates, currentTheme);
          const updatedBlock = { ...base, darkOverrides: dark };
          
          if (viewMode === 'mobile') {
            const mOverrides = updatedBlock.mobileOverrides || {};
            const newMOverrides = { ...mOverrides };
            
            Object.keys(updates).forEach(key => {
              // Only store non-theme properties in mobileOverrides to avoid clobbering theme independence
              if (!isThemeSpecificProperty(key)) {
                const val = (updates as any)[key];
                if (val && typeof val === 'object' && !Array.isArray(val)) {
                  (newMOverrides as any)[key] = stripContentProperties(key, cleanThemeProperties(val));
                } else {
                  (newMOverrides as any)[key] = val;
                }
              } else {
                // Remove from mobile overrides so it falls back to base / dark block values correctly
                delete (newMOverrides as any)[key];
              }
            });
            
            updatedBlock.mobileOverrides = newMOverrides;
          } else if (viewMode === 'tablet') {
            const tOverrides = updatedBlock.tabletOverrides || {};
            const newTOverrides = { ...tOverrides };
            
            Object.keys(updates).forEach(key => {
              // Only store non-theme properties in tabletOverrides to avoid clobbering theme independence
              if (!isThemeSpecificProperty(key)) {
                const val = (updates as any)[key];
                if (val && typeof val === 'object' && !Array.isArray(val)) {
                  (newTOverrides as any)[key] = stripContentProperties(key, cleanThemeProperties(val));
                } else {
                  (newTOverrides as any)[key] = val;
                }
              } else {
                // Remove from tablet overrides so it falls back to base / dark block values correctly
                delete (newTOverrides as any)[key];
              }
            });
            
            updatedBlock.tabletOverrides = newTOverrides;
          }

          // Cleanup content properties in mobileOverrides and tabletOverrides if we are not editing them
          if (viewMode !== 'mobile' && updatedBlock.mobileOverrides) {
            const newMOverrides = { ...updatedBlock.mobileOverrides };
            Object.keys(newMOverrides).forEach(key => {
              const val = (newMOverrides as any)[key];
              if (val && typeof val === 'object' && !Array.isArray(val)) {
                (newMOverrides as any)[key] = stripContentProperties(key, val);
              }
            });
            updatedBlock.mobileOverrides = newMOverrides;
          }
          if (viewMode !== 'tablet' && updatedBlock.tabletOverrides) {
            const newTOverrides = { ...updatedBlock.tabletOverrides };
            Object.keys(newTOverrides).forEach(key => {
              const val = (newTOverrides as any)[key];
              if (val && typeof val === 'object' && !Array.isArray(val)) {
                (newTOverrides as any)[key] = stripContentProperties(key, val);
              }
            });
            updatedBlock.tabletOverrides = newTOverrides;
          }

          return updatedBlock;
        }
        if (b.type === 'row-group' && b.rowBlocks) {
          return { ...b, rowBlocks: recurse(b.rowBlocks) };
        }
        if (b.type === 'group' && b.groupContent) {
          return {
            ...b,
            groupContent: {
              ...b.groupContent,
              blocks: recurse(b.groupContent.blocks)
            }
          };
        }
        return b;
      });
    };
    updateBlocks(recurse(config.blocks));
  };

  // Deep recursive block removal
  const removeBlockRecursive = (blocks: Block[], targetId: string): { list: Block[]; removed: Block | null } => {
    let removed: Block | null = null;
    const filter = (list: Block[]): Block[] => {
      const result: Block[] = [];
      for (const b of list) {
        if (b.id === targetId) {
          removed = b;
        } else if (b.type === 'group' && b.groupContent) {
          const { list: innerList, removed: r } = removeBlockRecursive(b.groupContent.blocks, targetId);
          if (r) removed = r;
          result.push({
            ...b,
            groupContent: {
              ...b.groupContent,
              blocks: innerList
            }
          });
        } else {
          result.push(b);
        }
      }
      return result;
    };
    return { list: filter(blocks), removed };
  };

  // Deep recursive block insertion
  const insertBlockRecursive = (
    blocks: Block[],
    blockToInsert: Block,
    targetId: string,
    position: 'before' | 'after' | 'inside'
  ): Block[] => {
    const result: Block[] = [];
    for (const b of blocks) {
      if (b.id === targetId) {
        if (position === 'before') {
          result.push(blockToInsert);
          result.push(b);
        } else if (position === 'after') {
          result.push(b);
          result.push(blockToInsert);
        } else if (position === 'inside') {
          if (b.type === 'group' && b.groupContent) {
            result.push({
              ...b,
              groupContent: {
                ...b.groupContent,
                blocks: [...b.groupContent.blocks, blockToInsert]
              }
            });
          } else {
            result.push(b);
            result.push(blockToInsert);
          }
        }
      } else if (b.type === 'group' && b.groupContent) {
        const updatedInner = insertBlockRecursive(b.groupContent.blocks, blockToInsert, targetId, position);
        result.push({
          ...b,
          groupContent: {
            ...b.groupContent,
            blocks: updatedInner
          }
        });
      } else {
        result.push(b);
      }
    }
    return result;
  };

  // Drag-and-drop actions
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedBlockId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string, isGroup: boolean) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling up to parent groups and causing flickering
    if (draggedBlockId === targetId) return;
    if (draggedBlockId && isDescendant(config.blocks, draggedBlockId, targetId)) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const height = rect.height;

    let position: 'before' | 'after' | 'inside' = 'after';

    if (isGroup) {
      if (relativeY < height * 0.25) {
        position = 'before';
      } else if (relativeY > height * 0.75) {
        position = 'after';
      } else {
        position = 'inside';
      }
    } else {
      if (relativeY < height * 0.5) {
        position = 'before';
      } else {
        position = 'after';
      }
    }

    setDragOverBlockId(targetId);
    setDragPosition(position);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Intentionally keep drag state active to prevent flickering when children are hovered over.
    // The target and active state resets on dragEnd or drop.
  };

  const handleDragEnd = () => {
    setDraggedBlockId(null);
    setDragOverBlockId(null);
    setDragPosition(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent duplicate drop triggers inside nested elements
    if (!draggedBlockId || draggedBlockId === targetId) return;
    if (isDescendant(config.blocks, draggedBlockId, targetId)) return;

    const { list: afterRemove, removed } = removeBlockRecursive(config.blocks, draggedBlockId);
    
    if (removed) {
      const afterInsert = insertBlockRecursive(afterRemove, removed, targetId, dragPosition || 'after');
      updateBlocks(afterInsert, true);
      showToast(lang === 'en' ? 'Reordered layers successfully' : 'Порядок блоков успешно обновлен');
    }

    setDraggedBlockId(null);
    setDragOverBlockId(null);
    setDragPosition(null);
  };

  const handleDropAtRoot = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedBlockId) return;
    const { list: cleaned, removed } = removeBlockRecursive(config.blocks, draggedBlockId);
    if (removed) {
      updateBlocks([...cleaned, removed], true);
      showToast(lang === 'en' ? 'Moved to page root' : 'Перемещено в корень страницы');
    }
    setDraggedBlockId(null);
  };

  // Toggle internal collapse for folders/groups
  const toggleGroupCollapse = (groupId: string) => {
    const toggleRecursive = (blocks: Block[]): Block[] => {
      return blocks.map(b => {
        if (b.id === groupId) {
          if (b.type === 'group' && b.groupContent) {
            return {
              ...b,
              groupContent: {
                ...b.groupContent,
                isCollapsed: !b.groupContent.isCollapsed
              }
            };
          }
        } else if (b.type === 'group' && b.groupContent) {
          return {
            ...b,
            groupContent: {
              ...b.groupContent,
              blocks: toggleRecursive(b.groupContent.blocks)
            }
          };
        }
        return b;
      });
    };
    updateBlocks(toggleRecursive(config.blocks), true);
  };

  // Rename a specific group
  const renameGroup = (groupId: string, newTitle: string) => {
    const renameRecursive = (blocks: Block[]): Block[] => {
      return blocks.map(b => {
        if (b.id === groupId) {
          if (b.type === 'group' && b.groupContent) {
            return {
              ...b,
              groupContent: {
                ...b.groupContent,
                title: newTitle || (lang === 'en' ? 'Unnamed Group' : 'Группа без имени')
              }
            };
          }
        } else if (b.type === 'group' && b.groupContent) {
          return {
            ...b,
            groupContent: {
              ...b.groupContent,
              blocks: renameRecursive(b.groupContent.blocks)
            }
          };
        }
        return b;
      });
    };
    updateBlocks(renameRecursive(config.blocks), true);
    showToast(lang === 'en' ? 'Group renamed' : 'Группа переименована');
  };

  // Delete group but unnest children to the parent level
  const deleteGroupAndUnnest = (groupId: string) => {
    const unnestRecursive = (blocks: Block[]): Block[] => {
      const result: Block[] = [];
      for (const b of blocks) {
        if (b.id === groupId) {
          if (b.type === 'group' && b.groupContent) {
            result.push(...b.groupContent.blocks);
          }
        } else if (b.type === 'group' && b.groupContent) {
          result.push({
            ...b,
            groupContent: {
              ...b.groupContent,
              blocks: unnestRecursive(b.groupContent.blocks)
            }
          });
        } else {
          result.push(b);
        }
      }
      return result;
    };
    
    const updated = unnestRecursive(config.blocks);
    updateBlocks(updated, true);
    if (selectedBlockId === groupId) {
      setSelectedBlockId(null);
    }
    showToast(lang === 'en' ? 'Group deleted, blocks moved up' : 'Группа удалена, блоки перенесены наверх');
  };

  // Keyboard reordering fallback inside hierarchical tree list
  const handleKeyboardMove = (targetId: string, direction: 'up' | 'down') => {
    const moveRecursive = (blocks: Block[]): { list: Block[]; moved: boolean } => {
      const idx = blocks.findIndex(b => b.id === targetId);
      if (idx !== -1) {
        const siblingArray = [...blocks];
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx >= 0 && swapIdx < siblingArray.length) {
          const temp = siblingArray[idx];
          siblingArray[idx] = siblingArray[swapIdx];
          siblingArray[swapIdx] = temp;
          return { list: siblingArray, moved: true };
        }
        return { list: blocks, moved: false };
      }

      let isMoved = false;
      const updatedList = blocks.map(b => {
        if (b.type === 'group' && b.groupContent) {
          const { list: innerList, moved } = moveRecursive(b.groupContent.blocks);
          if (moved) {
            isMoved = true;
            return {
              ...b,
              groupContent: {
                ...b.groupContent,
                blocks: innerList
              }
            };
          }
        }
        return b;
      });

      return { list: updatedList, moved: isMoved };
    };

    const { list: updatedBlocks, moved } = moveRecursive(config.blocks);
    if (moved) updateBlocks(updatedBlocks, true);
  };

  // Add a brand-new Frame to layout config
  const handleAddBlock = (type: BlockType) => {
    const isDarkTheme = config.mainBg?.theme === 'dark';
    let newBlock: Block = {
      id: `block_${Date.now()}`,
      type: type,
      padding: 'medium',
      bgColor: isDarkTheme ? 'bg-zinc-950' : 'bg-white',
      textColor: isDarkTheme ? 'text-white' : 'text-zinc-900',
      borderRadius: 'lg',
      hasBorder: true,
      borderColor: isDarkTheme ? 'border-zinc-850' : 'border-zinc-100',
      borderWidth: 'thin',
    };

    // Populate initial logical default structures
    if (type === 'profile') {
      newBlock.profileContent = {
        avatar: PLACEHOLDERS.avatarBusiness,
        name: lang === 'en' ? 'New Brand Profile' : 'Новый профиль',
        bio: lang === 'en' ? 'Tap here to customize your minimalist bio card description.' : 'Расскажите о преимуществах вашей компании.',
      };
      // High contrast default background for profile
      newBlock.bgColor = isDarkTheme ? 'bg-zinc-900 border border-zinc-800/80' : 'bg-stone-50 border border-stone-200/50';
    } else if (type === 'socials') {
      newBlock.socialsContent = {
        links: [
          { platform: 'instagram', url: 'https://instagram.com' },
          { platform: 'telegram', url: 'https://t.me' },
          { platform: 'email', url: 'mailto:info@brand.com' }
        ]
      };
      newBlock.bgColor = 'bg-transparent border-transparent';
      newBlock.borderWidth = 'none';
      newBlock.padding = 'small';
    } else if (type === 'text') {
      newBlock.textContent = {
        title: lang === 'en' ? 'Minimal Statement' : 'Заголовок блока',
        body: lang === 'en' ? 'Beautiful luxury brands limit their visual vocabulary to standard layouts to enforce high-end status.' : 'Этот блок идеально подходит для ключевого текста, девиза или информации о часах работы.'
      };
    } else if (type === 'button') {
      newBlock.buttonContent = {
        label: lang === 'en' ? 'Discover Collection' : 'Открыть каталог',
        url: 'https://google.com',
        variant: 'primary'
      };
      newBlock.bgColor = isDarkTheme ? 'bg-white border border-transparent' : 'bg-zinc-950 border border-transparent';
      newBlock.textColor = isDarkTheme ? 'text-zinc-950' : 'text-white';
    } else if (type === 'catalog-item') {
      newBlock.catalogItemContent = {
        id: `item_${Date.now()}`,
        image: PLACEHOLDERS.ramen,
        title: lang === 'en' ? 'Specialist Craft Work' : 'Авторское блюдо / Товар',
        description: lang === 'en' ? 'Fine custom detailing using durable vegetable leather accents.' : 'Опишите преимущества, материалы, состав или порцию этого товара.',
        price: 45.0
      };
      newBlock.bgColor = isDarkTheme ? 'bg-zinc-900' : 'bg-white';
    } else if (type === 'category-header') {
      newBlock.categoryHeaderContent = {
        title: lang === 'en' ? '📦 Premium Curations' : '📦 Раздел каталога'
      };
      newBlock.bgColor = 'bg-transparent border-transparent';
      newBlock.borderWidth = 'none';
      newBlock.padding = 'small';
    } else if (type === 'spacer') {
      newBlock.spacerContent = {
        height: 'medium'
      };
      newBlock.bgColor = 'bg-transparent border-transparent';
      newBlock.borderWidth = 'none';
    } else if (type === 'media') {
      newBlock.mediaContent = {
        items: [
          { id: `med_${Date.now()}_1`, type: 'image', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80' }
        ],
        autoplay: true,
        loop: true,
        showControls: true,
        aspectRatio: 'video',
        objectFit: 'cover'
      };
      newBlock.bgColor = isDarkTheme ? 'bg-zinc-900' : 'bg-white';
      newBlock.padding = 'none';
    } else if (type === 'group') {
      newBlock.groupContent = {
        title: lang === 'en' ? 'Group Workspace' : 'Группа элементов',
        isCollapsed: false,
        blocks: []
      };
      newBlock.bgColor = isDarkTheme ? 'bg-zinc-900/50 border border-zinc-800/40 animate-fade-in' : 'bg-zinc-50/50 border border-zinc-200/40 animate-fade-in';
      newBlock.padding = 'small';
    }
    
    // Find the first block of the same type recursively in the current project configuration
    const findFirstBlockOfType = (blocksList: Block[], targetType: BlockType): Block | null => {
      for (const b of blocksList) {
        if (b.type === targetType) {
          return b;
        }
        if (b.type === 'group' && b.groupContent && b.groupContent.blocks) {
          const found = findFirstBlockOfType(b.groupContent.blocks, targetType);
          if (found) return found;
        }
      }
      return null;
    };

    const firstMatchingBlock = findFirstBlockOfType(config.blocks, type);
    const blockTypeDefaults = config.blockTypeDefaults || {};
    const typeSpecificDefault = blockTypeDefaults[type];

    // Priority 1: live block style in the layout
    // Priority 2: template-level defaults for this specific section type (from style template)
    const styleSource = firstMatchingBlock || typeSpecificDefault;
    let finalBlock: Block = { ...newBlock };

    if (styleSource) {
      // Copy all styling properties from STYLE_KEYS
      STYLE_KEYS.forEach(key => {
        if (styleSource[key] !== undefined) {
          (finalBlock as any)[key] = JSON.parse(JSON.stringify(styleSource[key]));
        }
      });
      
      // Also copy nested styling properties if they exist
      if (type === 'profile' && finalBlock.profileContent) {
        const sourceProfile = styleSource.profileContent || styleSource.profileContentStyle;
        if (sourceProfile) {
          const profileKeys = [
            'avatarShape', 'avatarSize', 'layout', 'align', 'fullWidth', 'showAvatar', 'bgImage',
            'avatarBorderEnabled', 'avatarBorderWidth', 'avatarBorderStyle', 'avatarBorderColor',
            'avatarShadowEnabled', 'avatarShadowBlur', 'avatarShadowColor', 'avatarShadowOpacity',
            'avatarShadowOffsetX', 'avatarShadowOffsetY', 'avatarGlowEnabled', 'avatarGlowColor',
            'avatarGlowRadius', 'avatarGlowIntensity', 'avatarShimmerEnabled', 'avatarShimmerSpeed',
            'avatarShimmerColor', 'avatarShimmerWidth', 'avatarShimmerInterval', 'avatarGlassEnabled',
            'avatarGlassColor', 'avatarGlassOpacity', 'avatarGlassReflectIntensity', 'avatarGlassType',
            'avatarGlassBlur', 'avatarGlassAngle', 'avatarSvgRaw', 'avatarSvgColor'
          ];
          profileKeys.forEach(k => {
            if ((sourceProfile as any)[k] !== undefined) {
              (finalBlock.profileContent as any)[k] = (sourceProfile as any)[k];
            }
          });
        }
      }
      
      if (type === 'socials' && finalBlock.socialsContent) {
        const sourceSocials = styleSource.socialsContent || styleSource.socialsContentStyle;
        if (sourceSocials) {
          const socialsKeys = ['layout', 'iconSize', 'maxPerRow', 'iconSpacing', 'iconStyle'];
          socialsKeys.forEach(k => {
            if ((sourceSocials as any)[k] !== undefined) {
              (finalBlock.socialsContent as any)[k] = JSON.parse(JSON.stringify((sourceSocials as any)[k]));
            }
          });
        }
      }
    } else {
      // START FROM SCRATCH - BASIC RECTANGULAR BLOCK WITHOUT HIGH-END DECORATIVE EFFECTS
      finalBlock.borderRadius = 'none';
      finalBlock.customCornersEnabled = false;
      finalBlock.customCornersRadius = 0;
      
      // Disable all effects
      finalBlock.enableShadow = false;
      finalBlock.shadowSize = 0;
      finalBlock.shadowIntensity = 0;
      finalBlock.enableBlurEffect = false;
      finalBlock.enableGlareEffect = false;
      finalBlock.enableGlowEffect = false;
      finalBlock.enableNoiseEffect = false;
      finalBlock.borderGlowActive = false;
      finalBlock.borderCornerGlowActive = false;
      finalBlock.enableGlassEffect = false;
      
      // Reset some defaults
      finalBlock.fillType = 'color';
      finalBlock.bgOpacity = 100;
      
      // Merge global template-level block defaults
      const templateDefaults = config.blockDefaults || {};
      finalBlock = {
        ...finalBlock,
        ...templateDefaults,
        // Ensure no effects even if global defaults have them because we are creating "from scratch"
        borderRadius: 'none',
        customCornersEnabled: false,
        customCornersRadius: 0,
        enableShadow: false,
        enableBlurEffect: false,
        enableGlareEffect: false,
        enableGlowEffect: false,
        enableNoiseEffect: false,
        borderGlowActive: false,
        borderCornerGlowActive: false,
        enableGlassEffect: false,
      };
    }

    const modified = [...config.blocks, finalBlock];
    updateBlocks(modified, true);
    setSelectedBlockId(finalBlock.id);
    showToast(lang === 'en' ? `Added ${type} Frame` : `Добавлен блок: ${type}`);
  };

  // Duplicate Frame Block
  const duplicateBlock = (id: string) => {
    const findAndDuplicate = (blocks: Block[]): Block[] => {
      const result: Block[] = [];
      for (const b of blocks) {
        result.push(b);
        if (b.id === id) {
          const newBlock = { ...b, id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
          result.push(newBlock);
        } else if (b.type === 'group' && b.groupContent) {
          // If in group, search in groupContent
          // This only handles top-level duplicates for now for simplicity, 
          // or needs recursive search
        }
      }
      return result;
    };
    // Let's use a simpler recursive approach if needed or find the parent
    const duplicateRecursive = (blocks: Block[]): Block[] => {
      return blocks.reduce((acc: Block[], b: Block) => {
        acc.push(b);
        if (b.id === id) {
           acc.push({ ...b, id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` });
        } else if (b.type === 'group' && b.groupContent) {
          acc[acc.length - 1] = {
            ...b,
            groupContent: {
              ...b.groupContent,
              blocks: duplicateRecursive(b.groupContent.blocks)
            }
          };
        }
        return acc;
      }, []);
    };
    
    updateBlocks(duplicateRecursive(config.blocks), true);
    showToast(lang === 'en' ? 'Frame duplicated' : 'Фрейм дублирован');
  };

  // Delete Frame Block
  const deleteBlock = (id: string) => {
    const { list: filtered } = removeBlockRecursive(config.blocks, id);
    updateBlocks(filtered, true);
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
    showToast(lang === 'en' ? 'Frame deleted' : 'Фрейм удален');
  };

  // Handle Image uploads with client side canvas compression
  const handleImageUpload = async (file: File, blockId: string, itemType: 'profile' | 'catalog') => {
    try {
      setIsCompressing(true);
      
      let finalAvatarUrl = '';
      let rawSvgText = '';
      
      if (file.type === 'image/svg+xml') {
        // Read raw SVG text for color replacement support
        rawSvgText = await new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.onload = (e) => resolve(e.target?.result as string);
          r.onerror = (err) => reject(err);
          r.readAsText(file);
        });
        
        // Also read as Data URL for fallback image
        finalAvatarUrl = await new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.onload = (e) => resolve(e.target?.result as string);
          r.onerror = (err) => reject(err);
          r.readAsDataURL(file);
        });
      } else if (file.type === 'image/gif') {
        // GIF - keep animation frames
        finalAvatarUrl = await new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.onload = (e) => resolve(e.target?.result as string);
          r.onerror = (err) => reject(err);
          r.readAsDataURL(file);
        });
      } else if (file.type === 'image/png') {
        // PNG - preserve transparency channel
        finalAvatarUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              const maxW = 500;
              const maxH = 500;
              if (width > height) {
                if (width > maxW) {
                  height = Math.round((height * maxW) / width);
                  width = maxW;
                }
              } else {
                if (height > maxH) {
                  width = Math.round((width * maxH) / height);
                  height = maxH;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                resolve(img.src);
                return;
              }
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/png', 0.85));
            };
            img.onerror = (err) => reject(err);
          };
          reader.onerror = (err) => reject(err);
        });
      } else {
        // Fallback standard Jpeg compression
        finalAvatarUrl = await compressImage(file);
      }
      
      const updatedBlocks = config.blocks.map(b => {
        if (b.id === blockId) {
          if (itemType === 'profile' && b.profileContent) {
            return {
              ...b,
              profileContent: { 
                ...b.profileContent, 
                avatar: finalAvatarUrl,
                avatarSvgRaw: rawSvgText || undefined
              }
            };
          } else if (itemType === 'catalog' && b.catalogItemContent) {
            return {
              ...b,
              catalogItemContent: { ...b.catalogItemContent, image: finalAvatarUrl }
            };
          }
        }
        return b;
      });

      updateBlocks(updatedBlocks);
      showToast(lang === 'en' ? 'Image uploaded successfully' : 'Изображение успешно загружено');
    } catch (err) {
      console.error(err);
      showToast(lang === 'en' ? 'Upload error' : 'Ошибка загрузки изображения');
    } finally {
      setIsCompressing(false);
    }
  };

  // Reset template config to defaults
  const handleResetTemplate = () => {
    const confirmText = lang === 'en' 
      ? "Are you sure you want to reset all custom edits to the default starter template?" 
      : "Вы уверены, что хотите сбросить все изменения к стартовому шаблону?";
    if (window.confirm(confirmText)) {
      const updated = {
        ...configs,
        [templateType]: DEFAULT_CONFIGS[templateType]
      };
      saveToLocalStorage(updated);
      setSelectedBlockId(null);
      setCart([]);
      showToast(TRANSLATIONS[lang].originalTemplate);
    }
  };

  // Undo / Redo active updates
  const handleUndo = () => {
    const stack = undoStack[templateType] || [];
    if (stack.length === 0) return;
    
    const prevHistory = [...stack];
    const previousState = prevHistory.pop()!;
    
    // Push current to redo stack
    setRedoStack(prev => ({
      ...prev,
      [templateType]: [...(prev[templateType] || []), JSON.parse(JSON.stringify(config))]
    }));
    
    // Update undo stack
    setUndoStack(prev => ({
      ...prev,
      [templateType]: prevHistory
    }));
    
    // Restore state (bypass history tracking so we don't save another step)
    const updated = {
      ...configs,
      [templateType]: previousState
    };
    saveToLocalStorage(updated, true);
    showToast(lang === 'en' ? 'Undo applied' : 'Изменение отменено');
  };

  const handleRedo = () => {
    const stack = redoStack[templateType] || [];
    if (stack.length === 0) return;
    
    const nextHistory = [...stack];
    const nextState = nextHistory.pop()!;
    
    // Push current to undo stack
    setUndoStack(prev => ({
      ...prev,
      [templateType]: [...(prev[templateType] || []), JSON.parse(JSON.stringify(config))]
    }));
    
    // Update redo stack
    setRedoStack(prev => ({
      ...prev,
      [templateType]: nextHistory
    }));
    
    // Restore state (bypass history tracking so we don't save another step)
    const updated = {
      ...configs,
      [templateType]: nextState
    };
    saveToLocalStorage(updated, true);
    showToast(lang === 'en' ? 'Redo applied' : 'Изменение возвращено');
  };

  // Custom user templates actions (Using beautiful non-blocking custom inline input)
  const handleSaveCurrentStyle = () => {
    setStyleSaveName(
      lang === 'en' 
        ? `Style Preset ${userTemplates.length + 1}` 
        : `Шаблон стиля ${userTemplates.length + 1}`
    );
    setShowSaveStyleModal(true);
  };

  const handleConfirmSaveStyle = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const name = styleSaveName.trim();
    if (!name) return;

    try {
      const gradients = [
        'from-purple-900 to-pink-900',
        'from-slate-900 to-zinc-900',
        'from-rose-950 to-orange-950',
        'from-emerald-950 to-teal-950',
        'from-indigo-950 to-blue-950'
      ];
      const previewGradient = gradients[Math.floor(Math.random() * gradients.length)];

      const savedConfig = JSON.parse(JSON.stringify(config));
      
      // Merge tablet overrides into the base style properties so that they apply to the PC version 1-to-1
      const mergeTabletToBase = (blocksList: Block[]) => {
        blocksList.forEach(b => {
          if (b.tabletOverrides) {
            Object.keys(b.tabletOverrides).forEach(key => {
              const val = (b.tabletOverrides as any)[key];
              if (val !== undefined) {
                if (key === 'spacerContent' && b.spacerContent) {
                  b.spacerContent = { ...b.spacerContent, ...stripContentProperties(key, val) };
                } else if (key === 'profileContent' && b.profileContent) {
                  b.profileContent = { ...b.profileContent, ...stripContentProperties(key, val) };
                } else if (key === 'socialsContent' && b.socialsContent) {
                  b.socialsContent = { ...b.socialsContent, ...stripContentProperties(key, val) };
                } else if (key === 'mediaContent' && b.mediaContent) {
                  b.mediaContent = { ...b.mediaContent, ...stripContentProperties(key, val) };
                } else {
                  (b as any)[key] = stripContentProperties(key, val);
                }
              }
            });
          }
          if (b.type === 'group' && b.groupContent && b.groupContent.blocks) {
            mergeTabletToBase(b.groupContent.blocks);
          }
        });
      };
      if (savedConfig.blocks) {
        mergeTabletToBase(savedConfig.blocks);
      }
      
      const styleDefaults: any = { ...(savedConfig.blockDefaults || {}) };
      if (savedConfig.blocks && savedConfig.blocks.length > 0) {
        const firstBlock = savedConfig.blocks[0];
        STYLE_KEYS.forEach(key => {
          if (firstBlock[key] !== undefined) {
            styleDefaults[key] = firstBlock[key];
          }
        });
      }
      savedConfig.blockDefaults = styleDefaults;

      // Create blockTypeDefaults mapping recursively
      const blockTypeDefaults: Record<string, any> = {};
      const collectStyles = (blocksList: Block[]) => {
        blocksList.forEach(b => {
          if (!blockTypeDefaults[b.type]) {
            const styleObj: any = {};
            STYLE_KEYS.forEach(key => {
              if (b[key] !== undefined) {
                styleObj[key] = b[key];
              }
            });
            // Also collect iconStyle, iconSize, maxPerRow, iconSpacing, layout if b.type === 'socials'
            if (b.type === 'socials' && b.socialsContent) {
              styleObj.socialsContentStyle = {
                iconSize: b.socialsContent.iconSize,
                maxPerRow: b.socialsContent.maxPerRow,
                iconSpacing: b.socialsContent.iconSpacing,
                layout: b.socialsContent.layout,
                iconStyle: b.socialsContent.iconStyle ? JSON.parse(JSON.stringify(b.socialsContent.iconStyle)) : undefined
              };
            }
            if (b.type === 'profile' && b.profileContent) {
              styleObj.profileContentStyle = {
                avatarShape: b.profileContent.avatarShape,
                avatarSize: b.profileContent.avatarSize,
                layout: b.profileContent.layout,
                align: b.profileContent.align,
                fullWidth: b.profileContent.fullWidth,
                showAvatar: b.profileContent.showAvatar,
                bgImage: b.profileContent.bgImage,
                avatarBorderEnabled: b.profileContent.avatarBorderEnabled,
                avatarBorderWidth: b.profileContent.avatarBorderWidth,
                avatarBorderStyle: b.profileContent.avatarBorderStyle,
                avatarBorderColor: b.profileContent.avatarBorderColor,
                avatarShadowEnabled: b.profileContent.avatarShadowEnabled,
                avatarShadowBlur: b.profileContent.avatarShadowBlur,
                avatarShadowColor: b.profileContent.avatarShadowColor,
                avatarShadowOpacity: b.profileContent.avatarShadowOpacity,
                avatarShadowOffsetX: b.profileContent.avatarShadowOffsetX,
                avatarShadowOffsetY: b.profileContent.avatarShadowOffsetY,
                avatarGlowEnabled: b.profileContent.avatarGlowEnabled,
                avatarGlowColor: b.profileContent.avatarGlowColor,
                avatarGlowRadius: b.profileContent.avatarGlowRadius,
                avatarGlowIntensity: b.profileContent.avatarGlowIntensity,
                avatarShimmerEnabled: b.profileContent.avatarShimmerEnabled,
                avatarShimmerSpeed: b.profileContent.avatarShimmerSpeed,
                avatarShimmerColor: b.profileContent.avatarShimmerColor,
                avatarShimmerWidth: b.profileContent.avatarShimmerWidth,
                avatarShimmerInterval: b.profileContent.avatarShimmerInterval,
                avatarGlassEnabled: b.profileContent.avatarGlassEnabled,
                avatarGlassColor: b.profileContent.avatarGlassColor,
                avatarGlassOpacity: b.profileContent.avatarGlassOpacity,
                avatarGlassReflectIntensity: b.profileContent.avatarGlassReflectIntensity,
                avatarGlassType: b.profileContent.avatarGlassType,
                avatarGlassBlur: b.profileContent.avatarGlassBlur,
                avatarGlassAngle: b.profileContent.avatarGlassAngle,
                avatarSvgRaw: b.profileContent.avatarSvgRaw,
                avatarSvgColor: b.profileContent.avatarSvgColor
              };
            }
            blockTypeDefaults[b.type] = styleObj;
          }
          if (b.type === 'group' && b.groupContent && b.groupContent.blocks) {
            collectStyles(b.groupContent.blocks);
          }
        });
      };
      if (savedConfig.blocks) {
        collectStyles(savedConfig.blocks);
      }
      savedConfig.blockTypeDefaults = blockTypeDefaults;

      const newTemplate = {
        id: 'user-' + Date.now(),
        nameEn: name,
        nameRu: name,
        descriptionEn: `Custom saved style (${templateType})`,
        descriptionRu: `Пользовательский стиль (${templateType})`,
        previewGradient: previewGradient,
        config: savedConfig,
        isUserTemplate: true
      };

      const cleanedNewTemplate = cleanTemplateConfig(newTemplate);

      const updated = [...userTemplates, cleanedNewTemplate];
      setUserTemplates(updated);
      set('nocode_user_templates', updated).catch(e => console.error(e));
      try {
        localStorage.setItem('nocode_user_templates', JSON.stringify(updated));
      } catch (e) { console.warn('localStorage full'); }
      showToast(lang === 'en' ? 'Style successfully saved to templates!' : 'Стиль успешно сохранен в шаблоны!');
    } catch (err) {
      console.error("Error saving current style:", err);
      showToast(lang === 'en' ? 'Error saving style template' : 'Ошибка при сохранении шаблона');
    } finally {
      setShowSaveStyleModal(false);
    }
  };

  const handleSaveReadyTemplate = () => {
    setReadyTemplateSaveName(
      lang === 'en' 
        ? `Ready Style ${customReadyTemplates.length + 1}` 
        : `Готовый стиль ${customReadyTemplates.length + 1}`
    );
    setShowSaveReadyTemplateModal(true);
  };

  const handleConfirmSaveReadyTemplate = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const name = readyTemplateSaveName.trim();
    if (!name) return;
    handleSaveCurrentAsReadyTemplate(name);
    setReadyTemplateSaveName('');
    setShowSaveReadyTemplateModal(false);
  };

  const handleDeleteUserTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Open custom inline deletion modal instead of window.confirm
    setTemplateToDeleteId(id);
  };

  const handleConfirmDeleteUserTemplate = () => {
    if (!templateToDeleteId) return;
    try {
      const updated = userTemplates.filter(t => t.id !== templateToDeleteId);
      setUserTemplates(updated);
      set('nocode_user_templates', updated).catch(e => console.error(e));
      try {
        localStorage.setItem('nocode_user_templates', JSON.stringify(updated));
      } catch (e) { console.warn('localStorage full'); }
      showToast(lang === 'en' ? 'Template deleted' : 'Шаблон удален');
    } catch (err) {
      console.error("Error deleting template:", err);
    } finally {
      setTemplateToDeleteId(null);
    }
  };

  const handleDeleteReadyTemplate = async (id: string) => {
    try {
      const updated = customReadyTemplates.filter(t => t.id !== id);
      setCustomReadyTemplates(updated);

      try {
        await fetch(`/api/custom-ready-templates/${id}`, { method: 'DELETE' });
      } catch (apiErr) {
        console.warn('Failed to delete ready template via API', apiErr);
      }

      showToast(lang === 'en' ? 'Template removed from ready-made' : 'Шаблон удален из готовых');
    } catch (err) {
      console.error("Error deleting ready template:", err);
    }
  };

  const handleUpdateReadyTemplates = async (newTemplates: any[]) => {
    try {
      setCustomReadyTemplates(newTemplates);

      try {
        await fetch(`/api/custom-ready-templates`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTemplates)
        });
      } catch (apiErr) {
        console.warn('Failed to update ready templates via API', apiErr);
      }
    } catch (err) {
      console.error("Error updating ready templates:", err);
    }
  };

  const handleSaveCurrentAsReadyTemplate = async (name: string) => {
    try {
      const gradients = [
        'from-purple-900 to-pink-900',
        'from-slate-900 to-zinc-900',
        'from-rose-950 to-orange-950',
        'from-emerald-950 to-teal-950',
        'from-indigo-950 to-blue-950'
      ];
      const previewGradient = gradients[Math.floor(Math.random() * gradients.length)];

      const savedConfig = JSON.parse(JSON.stringify(configs[templateType]));
      
      const mergeTabletToBase = (blocksList: Block[]) => {
        blocksList.forEach(b => {
          if (b.tabletOverrides) {
            Object.keys(b.tabletOverrides).forEach(key => {
              const val = (b.tabletOverrides as any)[key];
              if (val !== undefined) {
                if (key === 'spacerContent' && b.spacerContent) {
                  b.spacerContent = { ...b.spacerContent, ...stripContentProperties(key, val) };
                } else if (key === 'profileContent' && b.profileContent) {
                  b.profileContent = { ...b.profileContent, ...stripContentProperties(key, val) };
                } else if (key === 'socialsContent' && b.socialsContent) {
                  b.socialsContent = { ...b.socialsContent, ...stripContentProperties(key, val) };
                } else if (key === 'mediaContent' && b.mediaContent) {
                  b.mediaContent = { ...b.mediaContent, ...stripContentProperties(key, val) };
                } else {
                  (b as any)[key] = stripContentProperties(key, val);
                }
              }
            });
          }
          if (b.type === 'group' && b.groupContent && b.groupContent.blocks) {
            mergeTabletToBase(b.groupContent.blocks);
          }
        });
      };
      if (savedConfig.blocks) {
        mergeTabletToBase(savedConfig.blocks);
      }
      
      const styleDefaults: any = { ...(savedConfig.blockDefaults || {}) };
      if (savedConfig.blocks && savedConfig.blocks.length > 0) {
        const firstBlock = savedConfig.blocks[0];
        STYLE_KEYS.forEach(key => {
          if (firstBlock[key] !== undefined) {
            styleDefaults[key] = firstBlock[key];
          }
        });
      }
      savedConfig.blockDefaults = styleDefaults;

      const blockTypeDefaults: Record<string, any> = {};
      const collectStyles = (blocksList: Block[]) => {
        blocksList.forEach(b => {
          if (!blockTypeDefaults[b.type]) {
            const styleObj: any = {};
            STYLE_KEYS.forEach(key => {
              if (b[key] !== undefined) {
                styleObj[key] = b[key];
              }
            });
            if (b.type === 'socials' && b.socialsContent) {
              styleObj.socialsContentStyle = {
                iconSize: b.socialsContent.iconSize,
                maxPerRow: b.socialsContent.maxPerRow,
                iconSpacing: b.socialsContent.iconSpacing,
                layout: b.socialsContent.layout,
                iconStyle: b.socialsContent.iconStyle ? JSON.parse(JSON.stringify(b.socialsContent.iconStyle)) : undefined
              };
            }
            if (b.type === 'profile' && b.profileContent) {
              styleObj.profileContentStyle = {
                avatarShape: b.profileContent.avatarShape,
                avatarSize: b.profileContent.avatarSize,
                layout: b.profileContent.layout,
                align: b.profileContent.align,
                fullWidth: b.profileContent.fullWidth,
                showAvatar: b.profileContent.showAvatar,
                bgImage: b.profileContent.bgImage,
                avatarBorderEnabled: b.profileContent.avatarBorderEnabled,
                avatarBorderWidth: b.profileContent.avatarBorderWidth,
                avatarBorderStyle: b.profileContent.avatarBorderStyle,
                avatarBorderColor: b.profileContent.avatarBorderColor,
                avatarShadowEnabled: b.profileContent.avatarShadowEnabled,
                avatarShadowBlur: b.profileContent.avatarShadowBlur,
                avatarShadowColor: b.profileContent.avatarShadowColor,
                avatarShadowOpacity: b.profileContent.avatarShadowOpacity,
                avatarShadowOffsetX: b.profileContent.avatarShadowOffsetX,
                avatarShadowOffsetY: b.profileContent.avatarShadowOffsetY,
                avatarGlowEnabled: b.profileContent.avatarGlowEnabled,
                avatarGlowColor: b.profileContent.avatarGlowColor,
                avatarGlowRadius: b.profileContent.avatarGlowRadius,
                avatarGlowIntensity: b.profileContent.avatarGlowIntensity,
                avatarShimmerEnabled: b.profileContent.avatarShimmerEnabled,
                avatarShimmerSpeed: b.profileContent.avatarShimmerSpeed,
                avatarShimmerColor: b.profileContent.avatarShimmerColor,
                avatarShimmerWidth: b.profileContent.avatarShimmerWidth,
                avatarShimmerInterval: b.profileContent.avatarShimmerInterval,
                avatarGlassEnabled: b.profileContent.avatarGlassEnabled,
                avatarGlassColor: b.profileContent.avatarGlassColor,
                avatarGlassOpacity: b.profileContent.avatarGlassOpacity,
                avatarGlassReflectIntensity: b.profileContent.avatarGlassReflectIntensity,
                avatarGlassType: b.profileContent.avatarGlassType,
                avatarGlassBlur: b.profileContent.avatarGlassBlur,
                avatarGlassAngle: b.profileContent.avatarGlassAngle,
                avatarSvgRaw: b.profileContent.avatarSvgRaw,
                avatarSvgColor: b.profileContent.avatarSvgColor
              };
            }
            blockTypeDefaults[b.type] = styleObj;
          }
          if (b.type === 'group' && b.groupContent && b.groupContent.blocks) {
            collectStyles(b.groupContent.blocks);
          }
        });
      };
      if (savedConfig.blocks) {
        collectStyles(savedConfig.blocks);
      }
      savedConfig.blockTypeDefaults = blockTypeDefaults;

      const newTemplate = {
        id: 'ready-' + Date.now(),
        nameEn: name,
        nameRu: name,
        descriptionEn: `Ready template saved from active designer`,
        descriptionRu: `Готовый шаблон, сохраненный из дизайнера`,
        previewGradient: previewGradient,
        config: savedConfig,
        isUserTemplate: false
      };

      const cleaned = cleanTemplateConfig(newTemplate);
      const updated = [...customReadyTemplates, cleaned];
      setCustomReadyTemplates(updated);

      try {
        await fetch('/api/custom-ready-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cleaned)
        });
      } catch (apiErr) {
        console.warn('Failed to save ready template via API', apiErr);
      }

      showToast(lang === 'en' ? 'Style saved to ready templates!' : 'Стиль добавлен в готовые шаблоны!');
    } catch (err) {
      console.error("Error adding ready template:", err);
      showToast(lang === 'en' ? 'Error saving ready template' : 'Ошибка при добавлении в готовые шаблоны');
    }
  };

  // Handles applying specified templates: Background selective vs Windows selective style
  const handleApplySelectedTemplate = () => {
    if (!templateToApply) return;

    const currentConfig = configs[templateType];
    const updatedConfig = { ...currentConfig };

    // Record history state for Undo action
    setUndoStack(prev => ({
      ...prev,
      [templateType]: [...(prev[templateType] || []), JSON.parse(JSON.stringify(currentConfig))]
    }));
    setRedoStack(prev => ({
      ...prev,
      [templateType]: []
    }));

    if (applyToBackground) {
      updatedConfig.mainBg = templateToApply.config.mainBg || currentConfig.mainBg;
      updatedConfig.designTemplate = templateToApply.config.designTemplate || 'none';
    }

    if (applyToWindows) {
      updatedConfig.theme = templateToApply.config.theme || currentConfig.theme;
      
      const blockDefaults = templateToApply.config.blockDefaults || {};
      updatedConfig.blockDefaults = {
        ...currentConfig.blockDefaults,
        ...blockDefaults
      };

      // Get or dynamically build type-specific style defaults for the template on-the-fly
      let blockTypeDefaults = templateToApply.config.blockTypeDefaults || {};
      if (Object.keys(blockTypeDefaults).length === 0 && templateToApply.config.blocks) {
        const collected: Record<string, any> = {};
        const collectStyles = (bList: Block[]) => {
          bList.forEach(b => {
            if (!collected[b.type]) {
              const styleObj: any = {};
              STYLE_KEYS.forEach(key => {
                if (b[key] !== undefined) {
                  styleObj[key] = b[key];
                }
              });
              if (b.type === 'socials' && b.socialsContent) {
                styleObj.socialsContentStyle = {
                  iconSize: b.socialsContent.iconSize,
                  maxPerRow: b.socialsContent.maxPerRow,
                  iconSpacing: b.socialsContent.iconSpacing,
                  layout: b.socialsContent.layout,
                  iconStyle: b.socialsContent.iconStyle ? JSON.parse(JSON.stringify(b.socialsContent.iconStyle)) : undefined
                };
              }
              if (b.type === 'profile' && b.profileContent) {
                styleObj.profileContentStyle = {
                  avatarShape: b.profileContent.avatarShape,
                  avatarSize: b.profileContent.avatarSize,
                  layout: b.profileContent.layout,
                  align: b.profileContent.align,
                  fullWidth: b.profileContent.fullWidth,
                  showAvatar: b.profileContent.showAvatar,
                  bgImage: b.profileContent.bgImage,
                  avatarBorderEnabled: b.profileContent.avatarBorderEnabled,
                  avatarBorderWidth: b.profileContent.avatarBorderWidth,
                  avatarBorderStyle: b.profileContent.avatarBorderStyle,
                  avatarBorderColor: b.profileContent.avatarBorderColor,
                  avatarShadowEnabled: b.profileContent.avatarShadowEnabled,
                  avatarShadowBlur: b.profileContent.avatarShadowBlur,
                  avatarShadowColor: b.profileContent.avatarShadowColor,
                  avatarShadowOpacity: b.profileContent.avatarShadowOpacity,
                  avatarShadowOffsetX: b.profileContent.avatarShadowOffsetX,
                  avatarShadowOffsetY: b.profileContent.avatarShadowOffsetY,
                  avatarGlowEnabled: b.profileContent.avatarGlowEnabled,
                  avatarGlowColor: b.profileContent.avatarGlowColor,
                  avatarGlowRadius: b.profileContent.avatarGlowRadius,
                  avatarGlowIntensity: b.profileContent.avatarGlowIntensity,
                  avatarShimmerEnabled: b.profileContent.avatarShimmerEnabled,
                  avatarShimmerSpeed: b.profileContent.avatarShimmerSpeed,
                  avatarShimmerColor: b.profileContent.avatarShimmerColor,
                  avatarShimmerWidth: b.profileContent.avatarShimmerWidth,
                  avatarShimmerInterval: b.profileContent.avatarShimmerInterval,
                  avatarGlassEnabled: b.profileContent.avatarGlassEnabled,
                  avatarGlassColor: b.profileContent.avatarGlassColor,
                  avatarGlassOpacity: b.profileContent.avatarGlassOpacity,
                  avatarGlassReflectIntensity: b.profileContent.avatarGlassReflectIntensity,
                  avatarGlassType: b.profileContent.avatarGlassType,
                  avatarGlassBlur: b.profileContent.avatarGlassBlur,
                  avatarGlassAngle: b.profileContent.avatarGlassAngle
                };
              }
              collected[b.type] = styleObj;
            }
            if (b.type === 'group' && b.groupContent && b.groupContent.blocks) {
              collectStyles(b.groupContent.blocks);
            }
          });
        };
        collectStyles(templateToApply.config.blocks);
        blockTypeDefaults = collected;
      }

      const applyStyleToBlocks = (blocksList: Block[]): Block[] => {
        return blocksList.map(b => {
          // If a type-specific style default exists for this block type, use it; otherwise fall back to global blockDefaults
          const specificStyle = blockTypeDefaults[b.type] || blockDefaults;
          
          const { socialsContentStyle, profileContentStyle, ...restStyle } = specificStyle;
          const updatedBlock = { ...b };
          
          STYLE_KEYS.forEach(key => {
            if (key !== 'socialsContentStyle' && key !== 'profileContentStyle') {
              updatedBlock[key] = restStyle[key] !== undefined ? restStyle[key] : undefined;
            }
          });
          
          // Apply tabletOverrides to base block styles for 1-to-1 computer PC layout matching
          if (updatedBlock.tabletOverrides) {
            Object.keys(updatedBlock.tabletOverrides).forEach(key => {
              const val = (updatedBlock.tabletOverrides as any)[key];
              if (val !== undefined) {
                if (key === 'spacerContent' && updatedBlock.spacerContent) {
                  updatedBlock.spacerContent = { ...updatedBlock.spacerContent, ...stripContentProperties(key, val) };
                } else if (key === 'profileContent' && updatedBlock.profileContent) {
                  updatedBlock.profileContent = { ...updatedBlock.profileContent, ...stripContentProperties(key, val) };
                } else if (key === 'socialsContent' && updatedBlock.socialsContent) {
                  updatedBlock.socialsContent = { ...updatedBlock.socialsContent, ...stripContentProperties(key, val) };
                } else if (key === 'mediaContent' && updatedBlock.mediaContent) {
                  updatedBlock.mediaContent = { ...updatedBlock.mediaContent, ...stripContentProperties(key, val) };
                } else {
                  (updatedBlock as any)[key] = stripContentProperties(key, val);
                }
              }
            });
          }
          
          if (b.type === 'socials' && socialsContentStyle) {
            updatedBlock.socialsContent = {
              ...b.socialsContent,
              links: b.socialsContent?.links || [],
              iconSize: socialsContentStyle.iconSize !== undefined ? socialsContentStyle.iconSize : b.socialsContent?.iconSize,
              maxPerRow: socialsContentStyle.maxPerRow !== undefined ? socialsContentStyle.maxPerRow : b.socialsContent?.maxPerRow,
              iconSpacing: socialsContentStyle.iconSpacing !== undefined ? socialsContentStyle.iconSpacing : b.socialsContent?.iconSpacing,
              layout: socialsContentStyle.layout !== undefined ? socialsContentStyle.layout : b.socialsContent?.layout,
              iconStyle: socialsContentStyle.iconStyle ? JSON.parse(JSON.stringify(socialsContentStyle.iconStyle)) : b.socialsContent?.iconStyle
            };
          }

          if (b.type === 'profile' && profileContentStyle) {
            updatedBlock.profileContent = {
              ...b.profileContent,
              avatarShape: profileContentStyle.avatarShape !== undefined ? profileContentStyle.avatarShape : b.profileContent?.avatarShape,
              avatarSize: profileContentStyle.avatarSize !== undefined ? profileContentStyle.avatarSize : b.profileContent?.avatarSize,
              layout: profileContentStyle.layout !== undefined ? profileContentStyle.layout : b.profileContent?.layout,
              align: profileContentStyle.align !== undefined ? profileContentStyle.align : b.profileContent?.align,
              fullWidth: profileContentStyle.fullWidth !== undefined ? profileContentStyle.fullWidth : b.profileContent?.fullWidth,
              showAvatar: profileContentStyle.showAvatar !== undefined ? profileContentStyle.showAvatar : b.profileContent?.showAvatar,
              bgImage: profileContentStyle.bgImage !== undefined ? profileContentStyle.bgImage : b.profileContent?.bgImage,
              avatarBorderEnabled: profileContentStyle.avatarBorderEnabled !== undefined ? profileContentStyle.avatarBorderEnabled : b.profileContent?.avatarBorderEnabled,
              avatarBorderWidth: profileContentStyle.avatarBorderWidth !== undefined ? profileContentStyle.avatarBorderWidth : b.profileContent?.avatarBorderWidth,
              avatarBorderStyle: profileContentStyle.avatarBorderStyle !== undefined ? profileContentStyle.avatarBorderStyle : b.profileContent?.avatarBorderStyle,
              avatarBorderColor: profileContentStyle.avatarBorderColor !== undefined ? profileContentStyle.avatarBorderColor : b.profileContent?.avatarBorderColor,
              avatarShadowEnabled: profileContentStyle.avatarShadowEnabled !== undefined ? profileContentStyle.avatarShadowEnabled : b.profileContent?.avatarShadowEnabled,
              avatarShadowBlur: profileContentStyle.avatarShadowBlur !== undefined ? profileContentStyle.avatarShadowBlur : b.profileContent?.avatarShadowBlur,
              avatarShadowColor: profileContentStyle.avatarShadowColor !== undefined ? profileContentStyle.avatarShadowColor : b.profileContent?.avatarShadowColor,
              avatarShadowOpacity: profileContentStyle.avatarShadowOpacity !== undefined ? profileContentStyle.avatarShadowOpacity : b.profileContent?.avatarShadowOpacity,
              avatarShadowOffsetX: profileContentStyle.avatarShadowOffsetX !== undefined ? profileContentStyle.avatarShadowOffsetX : b.profileContent?.avatarShadowOffsetX,
              avatarShadowOffsetY: profileContentStyle.avatarShadowOffsetY !== undefined ? profileContentStyle.avatarShadowOffsetY : b.profileContent?.avatarShadowOffsetY,
              avatarGlowEnabled: profileContentStyle.avatarGlowEnabled !== undefined ? profileContentStyle.avatarGlowEnabled : b.profileContent?.avatarGlowEnabled,
              avatarGlowColor: profileContentStyle.avatarGlowColor !== undefined ? profileContentStyle.avatarGlowColor : b.profileContent?.avatarGlowColor,
              avatarGlowRadius: profileContentStyle.avatarGlowRadius !== undefined ? profileContentStyle.avatarGlowRadius : b.profileContent?.avatarGlowRadius,
              avatarGlowIntensity: profileContentStyle.avatarGlowIntensity !== undefined ? profileContentStyle.avatarGlowIntensity : b.profileContent?.avatarGlowIntensity,
              avatarShimmerEnabled: profileContentStyle.avatarShimmerEnabled !== undefined ? profileContentStyle.avatarShimmerEnabled : b.profileContent?.avatarShimmerEnabled,
              avatarShimmerSpeed: profileContentStyle.avatarShimmerSpeed !== undefined ? profileContentStyle.avatarShimmerSpeed : b.profileContent?.avatarShimmerSpeed,
              avatarShimmerColor: profileContentStyle.avatarShimmerColor !== undefined ? profileContentStyle.avatarShimmerColor : b.profileContent?.avatarShimmerColor,
              avatarShimmerWidth: profileContentStyle.avatarShimmerWidth !== undefined ? profileContentStyle.avatarShimmerWidth : b.profileContent?.avatarShimmerWidth,
              avatarShimmerInterval: profileContentStyle.avatarShimmerInterval !== undefined ? profileContentStyle.avatarShimmerInterval : b.profileContent?.avatarShimmerInterval,
              avatarGlassEnabled: profileContentStyle.avatarGlassEnabled !== undefined ? profileContentStyle.avatarGlassEnabled : b.profileContent?.avatarGlassEnabled,
              avatarGlassColor: profileContentStyle.avatarGlassColor !== undefined ? profileContentStyle.avatarGlassColor : b.profileContent?.avatarGlassColor,
              avatarGlassOpacity: profileContentStyle.avatarGlassOpacity !== undefined ? profileContentStyle.avatarGlassOpacity : b.profileContent?.avatarGlassOpacity,
              avatarGlassReflectIntensity: profileContentStyle.avatarGlassReflectIntensity !== undefined ? profileContentStyle.avatarGlassReflectIntensity : b.profileContent?.avatarGlassReflectIntensity,
              avatarGlassType: profileContentStyle.avatarGlassType !== undefined ? profileContentStyle.avatarGlassType : b.profileContent?.avatarGlassType,
              avatarGlassBlur: profileContentStyle.avatarGlassBlur !== undefined ? profileContentStyle.avatarGlassBlur : b.profileContent?.avatarGlassBlur,
              avatarGlassAngle: profileContentStyle.avatarGlassAngle !== undefined ? profileContentStyle.avatarGlassAngle : b.profileContent?.avatarGlassAngle,
              avatarSvgRaw: profileContentStyle.avatarSvgRaw !== undefined ? profileContentStyle.avatarSvgRaw : b.profileContent?.avatarSvgRaw,
              avatarSvgColor: profileContentStyle.avatarSvgColor !== undefined ? profileContentStyle.avatarSvgColor : b.profileContent?.avatarSvgColor
            };
          }
          
          if (b.type === 'group' && b.groupContent && b.groupContent.blocks) {
            updatedBlock.groupContent = {
              ...b.groupContent,
              blocks: applyStyleToBlocks(b.groupContent.blocks)
            };
          }
          return updatedBlock;
        });
      };

      if (currentConfig.blocks) {
        updatedConfig.blocks = applyStyleToBlocks(currentConfig.blocks);
      }
    }

    const updated = {
      ...configs,
      [templateType]: updatedConfig
    };
    saveToLocalStorage(updated);
    setTemplateToApply(null);
    showToast(lang === 'en' ? 'Design configuration updated!' : 'Оформление успешно обновлено!');
  };

  // Separated overlay render to handle CRLF issues elegantly
  const renderTemplateChoiceDialogContent = () => {
    if (!templateToApply) return null;
    return (
      <div className="space-y-5 text-left">
        {/* Template info card */}
        <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80 flex gap-3.5 items-center">
          <div className={`w-14 aspect-[9/16] rounded-md bg-gradient-to-tr ${templateToApply.previewGradient} shrink-0 shadow-lg`} />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-[13px] text-purple-300 truncate">
              {lang === 'en' ? templateToApply.nameEn : templateToApply.nameRu}
            </h4>
            <p className="text-[10px] text-zinc-400 mt-1 leading-normal font-sans">
              {lang === 'en' ? templateToApply.descriptionEn : templateToApply.descriptionRu}
            </p>
          </div>
        </div>

        {/* Informative description */}
        <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
          {lang === 'en'
            ? 'Select which design modules from the template you want to apply to your current screen. Your written texts, links, headers, and media will remain completely unchanged!'
            : 'Выберите, какие элементы оформления шаблона применить к текущей странице. Ваши тексты, ссылки, заголовки и медиафайлы останутся нетронутыми!'}
        </p>

        {/* Checkbox controls list */}
        <div className="space-y-3 bg-zinc-950/30 p-3 rounded-xl border border-zinc-850">
          
          {/* CHECKBOX 1: APPLY TO BACKGROUND */}
          <label className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-zinc-850/40 transition-colors cursor-pointer group">
            <input
              type="checkbox"
              checked={applyToBackground}
              onChange={(e) => setApplyToBackground(e.target.checked)}
              className="mt-0.5 rounded border-zinc-700 text-purple-600 focus:ring-purple-500 bg-zinc-900 focus:ring-offset-zinc-900 h-4 w-4"
            />
            <div className="min-w-0 flex-1 select-none">
              <span className="font-bold text-xs text-zinc-200 group-hover:text-white transition-colors block">
                {lang === 'en' ? 'Apply to Background' : 'Применить для фона'}
              </span>
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 transition-colors block mt-0.5 leading-normal font-sans">
                {lang === 'en'
                  ? 'Applies background color, image, gradients, and ambient moving particles/ripples.'
                  : 'Цвета, градиенты, изображения и анимированные эффекты базового фона.'}
              </span>
            </div>
          </label>

          {/* CHECKBOX 2: APPLY TO WINDOWS */}
          <label className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-zinc-850/40 transition-colors cursor-pointer group">
            <input
              type="checkbox"
              checked={applyToWindows}
              onChange={(e) => setApplyToWindows(e.target.checked)}
              className="mt-0.5 rounded border-zinc-700 text-purple-600 focus:ring-purple-500 bg-zinc-900 focus:ring-offset-zinc-900 h-4 w-4"
            />
            <div className="min-w-0 flex-1 select-none">
              <span className="font-bold text-xs text-zinc-200 group-hover:text-white transition-colors block">
                {lang === 'en' ? 'Apply to Windows' : 'Применить для окон'}
              </span>
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 transition-colors block mt-0.5 leading-normal font-sans">
                {lang === 'en'
                  ? 'Applies text typography fonts, frame opacity, shadows, rounded corners, and frame colors.'
                  : 'Шрифты, скругления, прозрачность, тени, анимации и цвета окон-рамок.'}
              </span>
            </div>
          </label>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={() => setTemplateToApply(null)}
            className="flex-1 py-2 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-850 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer text-center"
          >
            {lang === 'en' ? 'Cancel' : 'Отмена'}
          </button>
          <button
            type="button"
            onClick={handleApplySelectedTemplate}
            disabled={!applyToBackground && !applyToWindows}
            className="flex-1 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-lg shadow-purple-900/20 transition-all cursor-pointer text-center"
          >
            {lang === 'en' ? 'Apply' : 'Применить'}
          </button>
        </div>
      </div>
    );
  };

  // Visitor shopping cart handlers
  const handleAddToCart = (item: { id: string; title: string; price: number; image?: string }) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    // Simulate interactive clicks increasing for live feedback!
    updateConfigField('clicks', config.clicks + 1);
    showToast(lang === 'en' ? `Added ${item.title} to Cart` : `${item.title} добавлен в корзину`);
  };

  const renderCartUI = (isMockup = false) => {
    if (cart.length === 0) return null;
    const isDarkAppTheme = config.mainBg?.theme === 'dark';

    return (
      <>
        {/* Floating Cart Badge */}
        {!isCartOpen && (
          <button
            id="floating_cart_badge"
            onClick={() => setIsCartOpen(true)}
            className={`${isMockup ? 'absolute' : 'fixed'} top-4 right-4 z-[100] p-2 drop-shadow-md hover:scale-110 transition-transform active:scale-95 duration-200 animate-fade-in`}
          >
            <div className={`relative flex items-center justify-center ${isDarkAppTheme ? 'text-white' : 'text-zinc-900'}`}>
              <ShoppingBag size={26} strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-sm">
                {cart.reduce((s, c) => s + c.quantity, 0)}
              </span>
            </div>
          </button>
        )}

        {/* Cart Drawer */}
        {isCartOpen && (
          <div className={`${isMockup ? 'absolute' : 'fixed'} inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-end justify-center p-0 sm:p-4 animate-fade-in`} onClick={() => setIsCartOpen(false)}>
            <div 
              className={`bg-white w-full ${isMockup ? '' : 'sm:max-w-md'} p-6 sm:rounded-2xl rounded-t-2xl shadow-2xl space-y-4 animate-slide-up ${isMockup ? 'max-h-[78%]' : 'max-h-[85%]'} flex flex-col`} 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 shrink-0">
                <h3 className="font-bold text-sm tracking-tight text-zinc-900 flex items-center gap-1.5">
                  <ShoppingBag size={15} className="text-zinc-500" />
                  <span>{TRANSLATIONS[lang].cartTitle}</span>
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="text-[10px] text-zinc-400 hover:text-zinc-900 transition-colors uppercase font-mono font-bold tracking-widest px-1.5">Close ✕</button>
              </div>
              
              <div className="space-y-3 overflow-y-auto pr-1 flex-1 min-h-0 scrollbar-thin">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 py-1.5 border-b border-zinc-50">
                    {item.image && <img src={item.image} alt={item.title} className="w-10 h-10 rounded object-cover flex-shrink-0 bg-zinc-50" />}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs text-zinc-900 truncate">{item.title}</h4>
                      <span className="text-[10px] text-zinc-500 font-mono">{formatPrice(item.price, lang)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleUpdateCartQty(item.id, item.quantity - 1)} className="w-5 h-5 bg-zinc-100 hover:bg-zinc-200 rounded text-center text-xs font-bold flex items-center justify-center">-</button>
                      <span className="font-mono text-xs text-zinc-900 font-bold min-w-[12px] text-center">{item.quantity}</span>
                      <button onClick={() => handleUpdateCartQty(item.id, item.quantity + 1)} className="w-5 h-5 bg-zinc-100 hover:bg-zinc-200 rounded text-center text-xs font-bold flex items-center justify-center">+</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-100 pt-3 space-y-3 shrink-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-medium text-zinc-500">Order Subtotal:</span>
                  <span className="text-sm font-mono font-bold text-zinc-900">{formatPrice(cart.reduce((s, c) => s + (c.price * c.quantity), 0), lang)}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleCartCheckout('whatsapp')} className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded transition duration-200 shadow-lg active:scale-98">
                    {lang === 'en' ? 'Order via WhatsApp' : 'Заказать в WhatsApp'}
                  </button>
                  <button onClick={() => handleCartCheckout('telegram')} className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded transition duration-200 shadow-lg active:scale-98">
                    {lang === 'en' ? 'Order via Telegram' : 'Заказать в Telegram'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter(i => i.id !== id));
  };

  const handleUpdateCartQty = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(id);
    } else {
      setCart(cart.map(i => i.id === id ? { ...i, quantity: qty } : i));
    }
  };

  // Cart compile and message direct checkout redirect
  const handleCartCheckout = (platform: 'whatsapp' | 'telegram') => {
    if (cart.length === 0) return;
    
    // Increment conversions
    updateConfigField('conversions', config.conversions + 1);

    const currencySymbol = lang === 'en' ? '$' : '₽';
    const totalSum = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let message = lang === 'en' 
      ? `🛍️ *New Order from website* [${config.username}]\n`
      : `🛍️ *Новый заказ с сайта* [${config.username}]\n`;
    message += `-----------------------------\n`;
    
    cart.forEach(item => {
      message += `• ${item.title} (${item.quantity} шт) — ${formatPrice(item.price * item.quantity, lang)}\n`;
    });
    
    message += `-----------------------------\n`;
    message += lang === 'en'
      ? `*Total sum:* ${formatPrice(totalSum, lang)}\n\nThank you!`
      : `*Итого к оплате:* ${formatPrice(totalSum, lang)}\n\nСпасибо!`;

    // Get active project contacts
    const activeProject = projects.find(p => p.id === activeProjectId);
    const whatsappPhone = activeProject?.whatsappPhone || '+1234567890';
    const telegramUsername = activeProject?.telegramUsername || 'mybrand';

    let destinationUrl = '';

    if (platform === 'whatsapp') {
      destinationUrl = generateWhatsAppLink(whatsappPhone, message);
    } else {
      destinationUrl = generateTelegramLink(telegramUsername, message);
    }

    // Attempt direct redirect or target blank reference to guarantee working preview
    const checkoutLink = document.createElement('a');
    checkoutLink.href = destinationUrl;
    checkoutLink.target = '_blank';
    checkoutLink.rel = 'noopener noreferrer';
    checkoutLink.click();
    
    // Reset cart
    setCart([]);
    setIsCartOpen(false);
    showToast(lang === 'en' ? "Redirecting to messaging app..." : "Переход к подтверждению заказа...");
  };

  // Simulated Analytics scores computed for the preview
  const conversionRate = config.views > 0 
    ? ((config.conversions / config.views) * 100).toFixed(1)
    : '5.2';

  // Computed public site simulation address based on settings
  const publicSimulatedUrl = config.isCustomDomainActive && config.customDomain
    ? `https://${config.customDomain}`
    : `https://brand.co/${config.username}`;

  // Custom QR Code Generator SVG
  const qrSvgMarkup = generateSimpleQRCodeSVG(publicSimulatedUrl, 260);

  // Download QR Code client side (PNG or SVG format)
  const downloadQRCodeSVG = () => {
    const svgBlob = new Blob([qrSvgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `qrcode_${config.username}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    showToast(lang === 'en' ? "Vector SVG (PDF alternative) downloaded" : "Векторный SVG скачан");
  };

  const downloadQRCodePNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    // Load SVG as markup src
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(qrSvgMarkup)));
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 500, 500);
      ctx.drawImage(img, 20, 20, 460, 460);
      
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qrcode_${config.username}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      showToast(lang === 'en' ? "High-res QR Code PNG downloaded" : "QR-код в формате PNG скачан");
    };
  };

  // Clean public view component (Reusable block rendering)
  const renderPublicBlocks = (isPreviewMockupMode: boolean) => {
    const fontClass = config.theme === 'serif' 
      ? 'font-serif' 
      : config.theme === 'mono' 
        ? 'font-mono' 
        : 'font-sans';

    const currentTheme = config.mainBg?.syncThemes ? 'light' : (config.mainBg?.theme || 'light');
    const isDarkAppTheme = currentTheme === 'dark';

    const renderSingleBlock = (block: Block, isInsideRowGroup: boolean = false): React.JSX.Element => {
      const currentTheme = config.mainBg?.syncThemes ? 'light' : (config.mainBg?.theme || 'light');
      block = resolveBlockOverrides(block, activeDevice, currentTheme);
      const isFullWidthMedia = block.fullWidth === true || (block.type === 'profile' && block.profileContent?.fullWidth === true);
      const hasTextEffects = 
        block.textShadowEnabled || block.textGlowEnabled || block.textShimmerEnabled ||
        block.titleTextStyles?.textShadowEnabled || block.titleTextStyles?.textGlowEnabled || block.titleTextStyles?.textShimmerEnabled ||
        block.descTextStyles?.textShadowEnabled || block.descTextStyles?.textGlowEnabled || block.descTextStyles?.textShimmerEnabled;

      const fullWidthBleedClass = isFullWidthMedia
        ? '-mx-4 w-[calc(100%+32px)] max-w-none'
        : isInsideRowGroup
          ? 'flex-1 min-w-[240px] max-w-full'
          : 'w-full';

      // Dynamic layout style resolvers based on Framer configuration
      const paddingClass = block.padding === 'none'
        ? 'p-0'
        : block.padding === 'small' 
          ? 'p-3 md:p-4' 
          : block.padding === 'large' 
            ? 'p-8 md:p-10' 
            : 'p-5 md:p-6';

      // Clean background classes to completely avoid double borders & legacy outline issues
      let cleanedBgClass = block.bgColor || '';
      if (cleanedBgClass) {
        cleanedBgClass = cleanedBgClass
          .split(' ')
          .filter(c => !c.startsWith('border-') && c !== 'border' && !c.startsWith('rounded'))
          .join(' ');
      }

      // 1. DYNAMIC CORNER RADIUS UNIFICATION
      let hasBorderActive = block.hasBorder;

      if (hasBorderActive === undefined) {
        hasBorderActive = (block.borderWidth === 'thin');
      }

      let cornersEnabled = block.customCornersEnabled;
      let cornersRadius = block.customCornersRadius;

      if (cornersEnabled === undefined) {
        // Automatic legacy format conversion
        if (block.borderRadius === 'none') {
          cornersEnabled = false;
          cornersRadius = 0;
        } else {
          cornersEnabled = true;
          if (block.borderRadius === 'sm') cornersRadius = 4;
          else if (block.borderRadius === 'md') cornersRadius = 6;
          else if (block.borderRadius === 'full') cornersRadius = 10;
          else cornersRadius = 8; // default 'lg' or others
        }
      }

      const radiusClass = cornersEnabled ? '' : 'rounded-none';

      // 2. DYNAMIC BORDER STYLES UNIFICATION
      const borderStyleVal = block.borderStyleType || 'solid';
      const borderWidthVal = block.borderWidthValue || (block.borderWidth === 'thin' ? 1 : 0);
      const borderColorVal = block.customBorderColor || '#ffffff';

      // Click Handler if clicked in Mockup or Editor setup to focus configuration
      const isSelected = selectedBlockId === block.id;

      const isDragOverTarget = dragOverBlockId === block.id;
      let dragHighlightStyle: React.CSSProperties = {};
      if (isPreviewMockupMode && isDragOverTarget) {
        if (dragPosition === 'before') {
          dragHighlightStyle = { boxShadow: 'inset 0 4px 0 0 #18181b', transition: 'box-shadow 0.15s ease' };
        } else if (dragPosition === 'after') {
          dragHighlightStyle = { boxShadow: 'inset 0 -4px 0 0 #18181b', transition: 'box-shadow 0.15s ease' };
        }
      }

      // Background Fill calculations: Color vs Image vs Gradient
      const fillLayerStyle: React.CSSProperties = {};
      let fillClass = '';

      const fillTypeResolved = block.fillType || 'color';

      // Set opacity multiplier for backdrop layer
      let bgOpacityVal = block.bgOpacity !== undefined ? block.bgOpacity : 100;
      if (block.enableGlassEffect) {
        // Automatically make background semi-transparent so the refract background underneath is clearly visible!
        if (fillTypeResolved === 'color' && !block.fillColor) {
          bgOpacityVal = Math.min(bgOpacityVal, 12);
        }
        // Default transparent white tint for glass blocks so they have consistent shape visibility
        if (!block.fillColor && fillTypeResolved === 'color') {
          fillLayerStyle.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
      } else if (block.enableBlurEffect) {
        // Automatically ensure background is semi-transparent so the frosted glass blur under it can be seen
        if (fillTypeResolved === 'color' && !block.fillColor) {
          bgOpacityVal = Math.min(bgOpacityVal, 30);
        }
        if (!block.fillColor && fillTypeResolved === 'color') {
          fillLayerStyle.backgroundColor = 'rgba(255, 255, 255, 0.08)';
        }
      }
      fillLayerStyle.opacity = bgOpacityVal / 100;

      if (fillTypeResolved === 'color') {
        if (block.fillColor) {
          fillLayerStyle.backgroundColor = block.fillColor;
        } else {
          fillClass += ` ${cleanedBgClass}`;
        }
      } else if (fillTypeResolved === 'image') {
        if (block.fillImage) {
          fillLayerStyle.backgroundImage = `url("${block.fillImage}")`;
          fillLayerStyle.backgroundSize = 'cover';
          fillLayerStyle.backgroundPosition = 'center';
        } else {
          fillClass += ` ${cleanedBgClass}`;
        }
      } else if (fillTypeResolved === 'gradient') {
        const preset = block.fillGradientPreset || 'cosmic';
        let gradientCSS = '';
        if (preset === 'cosmic') {
          gradientCSS = 'linear-gradient(135deg, #1e1b4b, #311042, #0f172a)';
        } else if (preset === 'sunset') {
          gradientCSS = 'linear-gradient(135deg, #f59e0b, #ed3833, #881337)';
        } else if (preset === 'ocean') {
          gradientCSS = 'linear-gradient(135deg, #0f766e, #0284c7, #1e1b4b)';
        } else if (preset === 'emerald') {
          gradientCSS = 'linear-gradient(135deg, #064e3b, #059669, #022c22)';
        } else if (preset === 'bubblegum') {
          gradientCSS = 'linear-gradient(135deg, #ec4899, #8b5cf6, #311042)';
        } else if (preset === 'fire') {
          gradientCSS = 'linear-gradient(135deg, #ea580c, #dc2626, #7c2d12)';
        } else if (preset === 'custom') {
          const start = block.customGradientStart || '#4f46e5';
          const end = block.customGradientEnd || '#db2777';
          const angle = block.customGradientAngle !== undefined ? block.customGradientAngle : 135;
          gradientCSS = `linear-gradient(${angle}deg, ${start}, ${end})`;
        }
        
        fillLayerStyle.backgroundImage = gradientCSS;
        if (block.fillGradientAnimated) {
          fillLayerStyle.backgroundSize = '400% 400%';
          fillClass += ' animate-gradient-shift';
        }
      }

      if (block.type === 'profile' && block.profileContent?.bgImage && fillTypeResolved === 'color' && !block.fillColor) {
        fillLayerStyle.backgroundImage = `url("${block.profileContent.bgImage}")`;
        fillLayerStyle.backgroundSize = 'cover';
        fillLayerStyle.backgroundPosition = 'center';
      }

      // Add Custom Border Customization
      const borderStyles: React.CSSProperties = {};
      if (hasBorderActive && borderWidthVal > 0) {
        borderStyles.borderStyle = borderStyleVal;
        borderStyles.borderWidth = `${borderWidthVal}px`;
        borderStyles.borderColor = borderColorVal;
      } else {
        borderStyles.borderWidth = '0px';
        borderStyles.borderStyle = 'none';
      }

      // 3. INTERNAL RADIUS CALCULATION (Ensures sub-layers match clipper)
      const internalRadius = cornersEnabled ? `${cornersRadius}px` : '0px';

      // Outer block style handles layout
      const outerBlockStyle: React.CSSProperties = {
        ...dragHighlightStyle,
        borderRadius: internalRadius,
        backgroundColor: 'transparent',
        position: 'relative',
        zIndex: isSelected ? 100 : undefined, // Only selected block gets a high context
      };

      // Background shadow layer style
      const shadowLayerStyle: React.CSSProperties = {
        borderRadius: internalRadius,
        position: 'absolute',
        inset: '0',
        zIndex: isSelected ? 90 : 1, // Stays below clipper (10) but above background
        pointerEvents: 'none',
        display: (block.enableShadow || block.enableGlowEffect) ? 'block' : 'none',
      };

      // Background Effects container style
      const bgContainerStyle: React.CSSProperties = {
        borderRadius: internalRadius,
        overflow: 'hidden',
        position: 'absolute',
        inset: '0',
        pointerEvents: 'none',
        zIndex: 0,
      };

      // Pulse Glow animation
      if (block.enableGlowEffect) {
        shadowLayerStyle['--glow-color' as any] = block.glowEffectColor || '#6366f1';
        const glowSec = block.glowEffectSpeed !== undefined ? block.glowEffectSpeed : 2;
        shadowLayerStyle.animation = `border-glow ${glowSec}s ease-in-out infinite alternate`;
      }

      if (block.enableShadow) {
        const size = block.shadowSize !== undefined ? block.shadowSize : 25;
        const intensityPerc = block.shadowIntensity !== undefined ? block.shadowIntensity : 30;
        const intensity = intensityPerc / 100;
        const shadowColor = `rgba(0,0,0,${intensity})`;
        shadowLayerStyle.boxShadow = `0 ${size / 3}px ${size}px ${shadowColor}`;
      }

      let wrapperClassExtra = '';
      if (block.enableHoverEffect) {
        wrapperClassExtra += ' transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ';
        if (block.hoverBorderColor) {
          outerBlockStyle['--hover-border-color' as any] = block.hoverBorderColor;
          wrapperClassExtra += ' hover:!border-[var(--hover-border-color)] ';
        }
      }

      let hasDarkFill = 
        configs[templateType].designTemplate === 'chroma-lab' ||
        fillTypeResolved === 'gradient' || 
        fillTypeResolved === 'image' || 
        (fillTypeResolved === 'color' && block.fillColor && (
          block.fillColor === '#09090b' ||
          block.fillColor === '#1c1917' ||
          block.fillColor === '#111827' ||
          block.fillColor === '#022c22' ||
          block.fillColor === '#0f172a' ||
          (!block.fillColor.startsWith('#f') && !block.fillColor.startsWith('#e') && block.fillColor !== '#ffffff' && block.fillColor !== '#f4f4f5')
        )) || (block.type === 'profile' && !!block.profileContent?.bgImage);

      const resolvedTextColor = hasDarkFill ? 'text-white' : block.textColor;

      const borderStyleClass = '';

      return (
        <div
          id={block.id}
          key={block.id}
          draggable={isPreviewMockupMode && blockDraggableId === block.id}
          onDragStart={(e) => {
            if (isPreviewMockupMode) {
              handleDragStart(e, block.id);
            }
          }}
          onDragOver={(e) => {
            if (isPreviewMockupMode) {
              handleDragOver(e, block.id, block.type === 'group');
            }
          }}
          onDragLeave={(e) => {
            if (isPreviewMockupMode) {
              handleDragLeave(e);
            }
          }}
          onDragEnd={() => {
            if (isPreviewMockupMode) {
              handleDragEnd();
              setBlockDraggableId(null);
            }
          }}
          onDrop={(e) => {
            if (isPreviewMockupMode) {
              handleDrop(e, block.id);
            }
          }}
          onClick={(e) => {
            if (isPreviewMockupMode) {
              e.stopPropagation();
              setSelectedBlockId(block.id);
            }
          }}
          style={outerBlockStyle}
          className={`
            relative transition-all duration-200 group/block ${fullWidthBleedClass}
            ${isPreviewMockupMode ? 'cursor-pointer shadow-sm hover:after:absolute hover:after:-inset-[1px] hover:after:ring-2 hover:after:ring-zinc-400/50 hover:after:rounded-[inherit] hover:after:pointer-events-none' : ''}
            ${draggedBlockId === block.id ? 'opacity-40 animate-pulse' : ''}
            ${wrapperClassExtra}
          `}
        >
          {/* Selection indicator overlay (avoids box-shadow conflict with ring utility) */}
          {isPreviewMockupMode && isSelected && (
            <div 
              className="absolute -inset-[2px] border-2 border-zinc-950 z-50 pointer-events-none shadow-[0_0_15px_rgba(0,0,0,0.1)]"
              style={{ borderRadius: cornersEnabled ? `${cornersRadius + 2}px` : '3px' }}
            />
          )}

          {/* BACKGROUND SHADOW LAYER: Separated to stay behind all block clippers */}
          <div style={shadowLayerStyle} className="shadow-isolation-layer" />


          {/* Physical Glass Refraction Effect (Стекло) - Placed OUTSIDE Clipper Container to bypass stacking isolation */}
          {block.enableGlassEffect && (
            <GlassRefractorWrapper
              blockId={block.id}
              borderRadius={cornersEnabled ? cornersRadius : 0}
              glassThickness={block.glassThickness !== undefined ? block.glassThickness : 80}
              refractiveIndex={block.refractiveIndex !== undefined ? block.refractiveIndex : 2.0}
              bezelWidth={block.bezelWidth !== undefined ? block.bezelWidth : 35}
              glassZoom={block.glassZoom !== undefined ? block.glassZoom : 30}
              glassPreset={block.glassPreset || 'convex-circular'}
              glassShowSpecular={block.glassShowSpecular !== false}
            />
          )}

          {/* Frosted Backdrop Blur Effect - Placed OUTSIDE Clipper Container to bypass stacking isolation */}
          {block.enableBlurEffect && (
            <div 
              className="absolute inset-0 pointer-events-none select-none z-[5]" 
              style={{
                borderRadius: internalRadius,
                backdropFilter: `blur(${block.blurEffectAmount !== undefined ? block.blurEffectAmount : 8}px)`,
                WebkitBackdropFilter: `blur(${block.blurEffectAmount !== undefined ? block.blurEffectAmount : 8}px)`,
                backgroundColor: 'rgba(255, 255, 255, 0.01)',
              }} 
            />
          )}

          {/* CLIPPER CONTAINER: Handles border, background, and isolation */}
          <div 
            className={`
              relative w-full ${(block.type === 'socials' || block.type === 'profile' || hasTextEffects) ? 'overflow-visible' : 'overflow-hidden'} z-[10]
              ${paddingClass} ${resolvedTextColor}
              flex flex-col
            `}
            style={{ 
              borderRadius: internalRadius,
              ...borderStyles,
              color: block.customTextColor || undefined,
              ['--block-icon-color' as any]: block.customIconColor || undefined,
              isolation: 'auto',
              WebkitMaskImage: (block.type === 'socials' || block.type === 'profile' || hasTextEffects) ? undefined : '-webkit-radial-gradient(white, black)', // Stability fix for rounded clipping
              WebkitTransform: (block.type === 'socials' || block.type === 'profile' || hasTextEffects) ? undefined : 'translateZ(0)',
              backfaceVisibility: (block.type === 'socials' || block.type === 'profile' || hasTextEffects) ? undefined : 'hidden',
              WebkitBackfaceVisibility: (block.type === 'socials' || block.type === 'profile' || hasTextEffects) ? undefined : 'hidden',
              minHeight: 'inherit',
            }}
          >
            {/* Background Layer Group */}
            <div style={bgContainerStyle}>
              {/* Isolated background fill layer */}
              <div 
                className={`absolute inset-0 z-10 ${fillClass}`} 
                style={{ ...fillLayerStyle, borderRadius: 'inherit' }} 
              />

              {/* Glass Refraction Effect rendered outside Clipper Container */}

              {/* Glare Shine */}
              {block.enableGlareEffect && (
                <div 
                  className="absolute inset-0 z-20 pointer-events-none"
                  style={{
                    borderRadius: 'inherit',
                    backgroundImage: `linear-gradient(90deg, transparent, ${block.glareEffectColor || '#ffffff'}35 50%, transparent)`,
                    animation: `shine-sweep ${block.glareEffectSpeed !== undefined ? block.glareEffectSpeed : 4}s cubic-bezier(0.4, 0, 0.2, 1) infinite ${isPremium ? 'running' : 'paused'}`,
                  }}
                />
              )}

              {/* Noise Grain Overlay */}
              {block.enableNoiseEffect && (
                <div 
                  className="absolute inset-0 z-30 pointer-events-none mix-blend-overlay"
                  style={{
                    borderRadius: 'inherit',
                    opacity: (block.noiseEffectOpacity !== undefined ? block.noiseEffectOpacity : 12) / 100,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                  }} 
                />
              )}

              {/* Pulse Glow animation inside border */}
              {block.enableGlowEffect && (
                <div 
                   className="absolute inset-0 z-0 pointer-events-none opacity-50"
                  style={{
                    boxShadow: `inset 0 0 20px ${block.glowEffectColor || '#6366f1'}`,
                    borderRadius: 'inherit',
                    animation: (isPreviewMockupMode && showMockup && viewMode !== 'desktop') ? 'none' : `border-glow ${block.glowEffectSpeed !== undefined ? block.glowEffectSpeed : 2}s ease-in-out infinite alternate`
                  }}
                />
              )}

              {/* Background effects */}
              {block.bgEffects && block.bgEffects.length > 0 && (
                <div className="absolute inset-0 z-[1] pointer-events-none" style={{ borderRadius: 'inherit', overflow: 'hidden' }}>
                  <BackgroundEffects effects={block.bgEffects} forcePause={isPreviewMockupMode && showMockup && viewMode !== 'desktop'} scrollOffset={windowScrollY} />
                </div>
              )}
            </div>

            {fillTypeResolved === 'image' && block.fillImage && (
              <div 
                className="absolute inset-0 bg-black z-0 rounded-[inherit] pointer-events-none" 
                style={{ opacity: 0.35 * (bgOpacityVal / 100) }}
              />
            )}

            {/* BLOCK CONTENT: Elevated above backgrounds */}
            <div className={`relative z-40 w-full max-w-full break-words ${(block.type === 'socials' || block.type === 'profile' || hasTextEffects) ? 'overflow-visible' : 'overflow-hidden'} box-border font-sans`}>
              {/* RENDER BY BLOCK TYPE */}
              {block.type === 'profile' && block.profileContent && (
                <>
                  {block.profileContent.bgImage && (
                    <div 
                      className="absolute inset-0 bg-black z-0 rounded-[inherit] pointer-events-none" 
                      style={{ opacity: 0.45 * (bgOpacityVal / 100) }}
                    />
                  )}
                  <ProfileBlockContent 
                    block={block} 
                    isPreviewMockupMode={isPreviewMockupMode} 
                    updateBlocks={updateBlocks} 
                    configBlocks={config.blocks} 
                    lang={lang} 
                  />
                </>
              )}

              {block.type === 'socials' && block.socialsContent && (() => {
            const validLinks = block.socialsContent.links.filter(link => link.url.trim() !== '');
            const maxPerRow = block.socialsContent.maxPerRow || 999;
            const iconSize = block.socialsContent.iconSize || 16;
            const isStacked = block.socialsContent.layout === 'stacked';
            const iconStyle = block.socialsContent.iconStyle;
            
            const spacingClass = 
              block.socialsContent.iconSpacing === 'small' ? 'gap-1.5' : 
              block.socialsContent.iconSpacing === 'large' ? 'gap-5' : 
              'gap-3';

            const renderSvgGradientDefs = () => {
              if (iconStyle && iconStyle.colorType === 'gradient') {
                return (
                  <svg width="0" height="0" className="absolute pointer-events-none" style={{ position: 'absolute', width: 0, height: 0 }}>
                    <defs>
                      <linearGradient id={`icon-grad-${block.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={iconStyle.iconColor || '#ffffff'} />
                        <stop offset="100%" stopColor={iconStyle.iconColorEnd || '#3b82f6'} />
                      </linearGradient>
                    </defs>
                  </svg>
                );
              }
              return null;
            };

            const renderIconInnerAndWrapper = (link: any, idx: number, isLink: boolean) => {
              const iconContainerSize = Math.max(34, iconSize * 2.2);
              const widthHeight = `${iconContainerSize}px`;

              let borderRadiusValue = '9999px';
              let numericRadius = iconContainerSize / 2;
              
              let borderWidth = 0;
              let borderColor = '#ffffff';
              let borderStyle = 'solid';
              let fillType = 'color';
              let fillColor = '#ffffff';
              let fillOpacity = 15;
              let gradientStart = '#ec4899';
              let gradientEnd = '#3b82f6';
              let gradientAngle = 45;
              let enableShadow = false;
              let shadowColor = '#000000';
              let shadowBlur = 10;
              let shadowIntensity = 50;
              let enableGlare = false;
              let glareSpeed = 3;
              let glareColor = '#ffffff';
              let enableGlass = false;
              let glassThickness = 80;
              let glassRefractiveIndex = 2.0;
              let bezelWidth = 6;
              let glassZoom = 30;
              let glassPreset: 'convex-circular' | 'convex-smooth' | 'concave' | 'ridge' = 'convex-circular';
              let enableBlur = false;
              let blurAmount = 8;

              if (iconStyle) {
                const rShape = iconStyle.borderRadius || 'circle';
                if (rShape === 'square') {
                  borderRadiusValue = '0px';
                  numericRadius = 0;
                } else if (rShape === 'rounded-lg') {
                  borderRadiusValue = '12px';
                  numericRadius = 12;
                } else if (rShape === 'squircle') {
                  borderRadiusValue = '18px';
                  numericRadius = 18;
                } else {
                  borderRadiusValue = '9999px';
                  numericRadius = iconContainerSize / 2;
                }

                borderWidth = iconStyle.borderWidth ?? 0;
                borderColor = iconStyle.borderColor ?? '#ffffff';
                borderStyle = iconStyle.borderStyle ?? 'solid';
                fillType = iconStyle.fillType ?? 'color';
                fillColor = iconStyle.fillColor ?? '#ffffff';
                fillOpacity = iconStyle.fillOpacity ?? 15;
                gradientStart = iconStyle.gradientStart ?? '#ec4899';
                gradientEnd = iconStyle.gradientEnd ?? '#3b82f6';
                gradientAngle = iconStyle.gradientAngle ?? 45;
                enableShadow = !!iconStyle.enableShadow;
                shadowColor = iconStyle.shadowColor ?? '#000000';
                shadowBlur = iconStyle.shadowBlur ?? 10;
                shadowIntensity = iconStyle.shadowIntensity ?? 50;
                enableGlare = !!iconStyle.enableGlare;
                glareSpeed = iconStyle.glareSpeed ?? 3;
                glareColor = iconStyle.glareColor ?? '#ffffff';
                enableGlass = !!iconStyle.enableGlass;
                glassThickness = iconStyle.glassThickness ?? 80;
                glassRefractiveIndex = iconStyle.glassRefractiveIndex ?? 2.0;
                bezelWidth = iconStyle.bezelWidth ?? 6;
                glassZoom = iconStyle.glassZoom ?? 30;
                glassPreset = iconStyle.glassPreset ?? 'convex-circular';
                enableBlur = !!iconStyle.enableBlur;
                blurAmount = iconStyle.blurAmount ?? 8;
              } else {
                borderRadiusValue = isStacked ? '8px' : '9999px';
                numericRadius = isStacked ? 8 : iconContainerSize / 2;
                const defaultColor = block.customIconColor || undefined;
                fillType = 'color';
                fillColor = defaultColor ? defaultColor : (hasDarkFill ? '#ffffff' : '#f0f0f0');
                fillOpacity = defaultColor ? 9 : (hasDarkFill ? 10 : 100);
                if (defaultColor) {
                  borderWidth = 1;
                  borderColor = `${defaultColor}30`;
                }
              }

              let backgroundStyle = 'transparent';
              if (fillType === 'color') {
                const hex = fillColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16) || 0;
                const g = parseInt(hex.substring(2, 4), 16) || 0;
                const b = parseInt(hex.substring(4, 6), 16) || 0;
                backgroundStyle = `rgba(${r}, ${g}, ${b}, ${fillOpacity / 100})`;
              } else if (fillType === 'gradient') {
                backgroundStyle = `linear-gradient(${gradientAngle}deg, ${gradientStart}, ${gradientEnd})`;
              }

              const borderStyleCSS = borderWidth > 0 ? `${borderWidth}px ${borderStyle} ${borderColor}` : 'none';

              let shadowStyle = 'none';
              if (enableShadow) {
                const hex = shadowColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16) || 0;
                const g = parseInt(hex.substring(2, 4), 16) || 0;
                const b = parseInt(hex.substring(4, 6), 16) || 0;
                shadowStyle = `0 4px ${shadowBlur}px rgba(${r}, ${g}, ${b}, ${shadowIntensity / 100})`;
              }

              const getIconStrokeColor = () => {
                if (iconStyle) {
                  if (iconStyle.colorType === 'gradient' && iconStyle.iconColor) {
                    return `url(#icon-grad-${block.id})`;
                  }
                  if (iconStyle.iconColor) {
                    return iconStyle.iconColor;
                  }
                }
                if (block.customIconColor) {
                  return block.customIconColor;
                }
                return hasDarkFill ? '#ffffff' : '#18181b';
              };
              const iconStrokeColor = getIconStrokeColor();

              let visualBorder = borderStyleCSS;
              let visualShadow = 'none';
              if (enableGlass) {
                visualBorder = `${borderWidth > 0 ? borderWidth : 1}px solid rgba(255, 255, 255, 0.25)`;
                visualShadow = `inset 0 1px 1px rgba(255,255,255,0.3)`;
              }

              const outerStyle: React.CSSProperties = {
                width: widthHeight,
                height: widthHeight,
                borderRadius: borderRadiusValue,
                boxShadow: shadowStyle !== 'none' ? shadowStyle : undefined,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              };

              const outerClassName = isLink
                ? "relative flex items-center justify-center transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer"
                : "relative flex items-center justify-center transition-all duration-300";

              const innerContent = (
                <>
                  {renderSvgGradientDefs()}

                  {/* Layer 1: Backdrop Blur */}
                  {enableBlur && (
                    <div 
                      className="absolute inset-0 pointer-events-none select-none z-[1]" 
                      style={{
                        borderRadius: borderRadiusValue,
                        backdropFilter: `blur(${blurAmount}px)`,
                        WebkitBackdropFilter: `blur(${blurAmount}px)`,
                        backgroundColor: 'rgba(255, 255, 255, 0.01)',
                      }} 
                    />
                  )}

                  {/* Layer 2: Background Fill & Border */}
                  <div 
                    className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
                    style={{
                      borderRadius: borderRadiusValue,
                      background: backgroundStyle,
                      border: visualBorder,
                      boxShadow: visualShadow,
                    }}
                  />

                  {/* Layer 3: Glass Refractor Layer */}
                  {enableGlass && (
                    <div className="absolute inset-0 z-[3] overflow-visible" style={{ borderRadius: borderRadiusValue }}>
                      <GlassRefractorWrapper
                        blockId={`${block.id}-icon-${idx}`}
                        borderRadius={numericRadius}
                        glassThickness={glassThickness}
                        refractiveIndex={glassRefractiveIndex}
                        bezelWidth={bezelWidth}
                        glassZoom={glassZoom}
                        glassPreset={glassPreset}
                        glassShowSpecular={block.glassShowSpecular !== false}
                      />
                    </div>
                  )}

                  {/* Layer 4: Glass gloss shine and glare overlays */}
                  {enableGlass && (
                    <div 
                      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-[4]"
                      style={{ borderRadius: borderRadiusValue }}
                    >
                      <span 
                        className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/10"
                        style={{ opacity: (glassThickness / 100) }}
                      />
                    </div>
                  )}

                  {enableGlare && (
                    <div 
                      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-[4]"
                      style={{ borderRadius: borderRadiusValue }}
                    >
                      <span 
                        className="absolute -inset-full pointer-events-none rotate-45 transform"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${glareColor}50, transparent)`,
                          animation: `icon-glare ${glareSpeed}s ease-in-out infinite ${isPremium ? 'running' : 'paused'}`,
                        }}
                      />
                    </div>
                  )}

                  {/* Layer 5: Icon SVG */}
                  <span className="relative z-[10] flex items-center justify-center pointer-events-none" style={{ color: iconStrokeColor }}>
                    {link.platform === 'instagram' && <Instagram size={iconSize} color={iconStrokeColor} />}
                    {link.platform === 'twitter' && <Twitter size={iconSize} color={iconStrokeColor} />}
                    {link.platform === 'github' && <Github size={iconSize} color={iconStrokeColor} />}
                    {link.platform === 'linkedin' && <Linkedin size={iconSize} color={iconStrokeColor} />}
                    {link.platform === 'email' && <Mail size={iconSize} color={iconStrokeColor} />}
                    {link.platform === 'phone' && <Phone size={iconSize} color={iconStrokeColor} />}
                    {link.platform === 'whatsapp' && <Send size={iconSize} className="rotate-45" color={iconStrokeColor} />}
                    {link.platform === 'telegram' && <Send size={iconSize} color={iconStrokeColor} />}
                    {link.platform === 'website' && <Globe2 size={iconSize} color={iconStrokeColor} />}
                  </span>
                </>
              );

              if (isLink) {
                return (
                  <a
                    key={idx}
                    href={isPreviewMockupMode ? undefined : link.url}
                    target="_blank"
                    rel="noreferrer"
                    className={outerClassName}
                    style={outerStyle}
                    title={link.platform}
                  >
                    {innerContent}
                  </a>
                );
              } else {
                return (
                  <span
                    key={idx}
                    className={outerClassName}
                    style={outerStyle}
                  >
                    {innerContent}
                  </span>
                );
              }
            };

            if (isStacked) {
              const platformNames: Record<string, { en: string; ru: string }> = {
                instagram: { en: 'Instagram', ru: 'Instagram' },
                telegram: { en: 'Telegram', ru: 'Telegram' },
                whatsapp: { en: 'WhatsApp', ru: 'WhatsApp' },
                twitter: { en: 'Twitter / X', ru: 'Twitter / X' },
                linkedin: { en: 'LinkedIn', ru: 'LinkedIn' },
                github: { en: 'GitHub', ru: 'GitHub' },
                email: { en: 'Email support', ru: 'Напишите на почту' },
                phone: { en: 'Phone support', ru: 'Позвонить' },
                website: { en: 'Website', ru: 'Открыть сайт' }
              };

              return (
                <div className="flex flex-col w-full gap-2 opacity-100">
                  {validLinks.map((link, idx) => {
                    const platformMeta = platformNames[link.platform] || { en: 'Link', ru: 'Ссылка' };
                    const platformLabel = lang === 'en' ? platformMeta.en : platformMeta.ru;
                    
                    let subLabel = '';
                    if (link.url) {
                      subLabel = link.url
                        .trim()
                        .replace('mailto:', '')
                        .replace('tel:', '')
                        .replace('https://', '')
                        .replace('http://', '')
                        .split('/')[0];
                      if (subLabel === 'mailto:' || subLabel === 'tel:' || subLabel.toLowerCase() === platformLabel.toLowerCase()) {
                        subLabel = '';
                      }
                    }

                    return (
                      <a
                        key={idx}
                        href={isPreviewMockupMode ? undefined : link.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center justify-between w-full p-2.5 transition-all duration-150 active:scale-[0.99] border hover:shadow-xs ${radiusClass} ${
                          block.customTextColor
                            ? ''
                            : hasDarkFill 
                              ? 'bg-white/10 text-white hover:bg-white/15 border-white/5' 
                              : 'bg-zinc-50 border-zinc-200/60 text-zinc-850 hover:bg-zinc-100/90 hover:border-zinc-350'
                        }`}
                        style={{
                          color: block.customTextColor ? block.customTextColor : undefined,
                          borderColor: block.customTextColor ? `${block.customTextColor}25` : undefined,
                          backgroundColor: block.customTextColor ? `${block.customTextColor}10` : undefined,
                        }}
                        title={link.platform}
                      >
                        <div className="flex items-center gap-3">
                          {renderIconInnerAndWrapper(link, idx, false)}
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-semibold tracking-tight leading-none text-inherit">{platformLabel}</span>
                            {subLabel && <span className="text-[10px] opacity-50 font-mono mt-1 max-w-[200px] truncate">{subLabel}</span>}
                          </div>
                        </div>
                        <ChevronRight size={14} className="opacity-40 flex-shrink-0 mr-1" style={{ color: block.customTextColor || undefined }} />
                      </a>
                    );
                  })}
                </div>
              );
            }

            const rows: any[][] = [];
            for (let i = 0; i < validLinks.length; i += maxPerRow) {
              rows.push(validLinks.slice(i, i + maxPerRow));
            }

            return (
              <div className={`flex flex-col items-center ${spacingClass}`}>
                {rows.map((row, rowIdx) => (
                  <div key={rowIdx} className={`flex flex-wrap justify-center ${spacingClass}`}>
                    {row.map((link, idx) => renderIconInnerAndWrapper(link, idx, true))}
                  </div>
                ))}
              </div>
            );
          })()}

          {block.type === 'text' && block.textContent && (
            <div className="space-y-1" style={{ textAlign: block.textAlign }}>
              {block.textContent.title && (
                <h3 
                  className={`font-semibold tracking-tight ${(block.titleTextStyles?.textShimmerEnabled || block.textShimmerEnabled) ? 'text-shimmer-effect' : ''}`}
                  style={{
                    ...(block.customTitleColor ? { color: block.customTitleColor } : block.customTextColor ? { color: block.customTextColor } : {}),
                    ...(block.customTitleFont ? { fontFamily: block.customTitleFont } : {}),
                    fontSize: block.customTitleFontSize !== undefined ? `${block.customTitleFontSize}px` : '16px',
                    ...getTextStyles(block, false, isPremium)
                  }}
                >
                  {block.textContent.title}
                </h3>
              )}
              {block.textContent.body && (
                <p 
                  className={`text-xs opacity-90 leading-relaxed whitespace-pre-line font-light ${(block.descTextStyles?.textShimmerEnabled || block.textShimmerEnabled) ? 'text-shimmer-effect' : ''}`}
                  style={{
                    ...(block.customDescColor ? { color: block.customDescColor } : block.customTextColor ? { color: block.customTextColor } : {}),
                    ...(block.customDescFont ? { fontFamily: block.customDescFont } : {}),
                    fontSize: block.customDescFontSize !== undefined ? `${block.customDescFontSize}px` : undefined,
                    ...getTextStyles(block, true, isPremium)
                  }}
                >
                  {block.textContent.body}
                </p>
              )}
            </div>
          )}

          {block.type === 'button' && block.buttonContent && (
            <div className="w-full" style={{ textAlign: block.textAlign || 'center' }}>
              {block.config?.isEcomEnabled ? (
                <button
                  onClick={(e) => {
                    if (isPreviewMockupMode) return;
                    e.stopPropagation();
                    handleAddToCart({
                      id: block.id,
                      title: block.buttonContent!.label,
                      price: block.config?.price || 0,
                    });
                  }}
                  style={{
                    ...(block.customTitleColor ? { color: block.customTitleColor } : block.customTextColor ? { color: block.customTextColor } : {}),
                    ...(block.customTitleFont ? { fontFamily: block.customTitleFont } : {}),
                    ...(block.customTitleFontSize ? { fontSize: `${block.customTitleFontSize}px` } : {}),
                    ...getTextStyles(block, false, isPremium)
                  }}
                  className={`
                    inline-block w-full py-2.5 px-4 font-medium text-xs tracking-tight transition-transform active:scale-[0.98]
                    ${(block.titleTextStyles?.textShimmerEnabled || block.textShimmerEnabled) ? 'text-shimmer-effect' : ''}
                    ${radiusClass}
                    ${block.buttonContent.variant === 'primary' ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-md' : ''}
                    ${block.buttonContent.variant === 'secondary' ? 'border border-zinc-200 text-zinc-900 hover:bg-zinc-50' : ''}
                    ${block.buttonContent.variant === 'outline' ? 'border border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white' : ''}
                  `}
                >
                  {block.buttonContent.label}
                </button>
              ) : (
                <a
                  href={isPreviewMockupMode ? undefined : block.buttonContent.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    ...(block.customTitleColor ? { color: block.customTitleColor } : block.customTextColor ? { color: block.customTextColor } : {}),
                    ...(block.customTitleFont ? { fontFamily: block.customTitleFont } : {}),
                    ...(block.customTitleFontSize ? { fontSize: `${block.customTitleFontSize}px` } : {}),
                    ...getTextStyles(block, false, isPremium)
                  }}
                  className={`
                    inline-block w-full py-2.5 px-4 font-medium text-xs tracking-tight transition-transform active:scale-[0.98]
                    ${(block.titleTextStyles?.textShimmerEnabled || block.textShimmerEnabled) ? 'text-shimmer-effect' : ''}
                    ${radiusClass}
                    ${block.buttonContent.variant === 'primary' ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-md' : ''}
                    ${block.buttonContent.variant === 'secondary' ? 'border border-zinc-200 text-zinc-900 hover:bg-zinc-50' : ''}
                    ${block.buttonContent.variant === 'outline' ? 'border border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white' : ''}
                  `}
                >
                  {block.buttonContent.label}
                </a>
              )}
            </div>
          )}

          {block.type === 'catalog-item' && block.catalogItemContent && (
            <div className="flex items-start gap-4" style={{ textAlign: block.textAlign }}>
              {block.catalogItemContent.image && (
                <img 
                  src={block.catalogItemContent.image} 
                  alt={block.catalogItemContent.title} 
                  className="w-20 h-20 rounded-lg object-cover bg-zinc-50 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 
                    className={`font-semibold flex-1 truncate ${(block.titleTextStyles?.textShimmerEnabled || block.textShimmerEnabled) ? 'text-shimmer-effect' : ''} ${block.customTitleColor || block.customTextColor ? '' : hasDarkFill ? 'text-white' : 'text-zinc-900'}`}
                    style={{
                      ...(block.customTitleColor ? { color: block.customTitleColor } : block.customTextColor ? { color: block.customTextColor } : {}),
                      ...(block.customTitleFont ? { fontFamily: block.customTitleFont } : {}),
                      fontSize: block.customTitleFontSize !== undefined ? `${block.customTitleFontSize}px` : '12px',
                      ...getTextStyles(block, false, isPremium)
                    }}
                  >
                    {block.catalogItemContent.title}
                  </h4>
                  <span 
                    className={`font-mono text-xs font-semibold flex-shrink-0 ${(block.titleTextStyles?.textShimmerEnabled || block.textShimmerEnabled) ? 'text-shimmer-effect' : ''} ${block.customTitleColor || block.customTextColor ? '' : hasDarkFill ? 'text-zinc-250' : 'text-zinc-950'}`}
                    style={{
                      ...(block.customTitleColor ? { color: block.customTitleColor } : block.customTextColor ? { color: block.customTextColor } : {}),
                      ...(block.customTitleFont ? { fontFamily: block.customTitleFont } : {}),
                      ...getTextStyles(block, false, isPremium)
                    }}
                  >
                    {formatPrice(block.catalogItemContent.price, lang)}
                  </span>
                </div>
                <p 
                  className={`text-[11px] font-light leading-relaxed line-clamp-2 ${(block.descTextStyles?.textShimmerEnabled || block.textShimmerEnabled) ? 'text-shimmer-effect' : ''} ${block.customDescColor || block.customTextColor ? '' : hasDarkFill ? 'text-zinc-300' : 'text-zinc-500'}`}
                  style={{
                    ...(block.customDescColor ? { color: block.customDescColor } : block.customTextColor ? { color: block.customTextColor } : {}),
                    ...(block.customDescFont ? { fontFamily: block.customDescFont } : {}),
                    fontSize: block.customDescFontSize !== undefined ? `${block.customDescFontSize}px` : undefined,
                    opacity: 0.85,
                    ...getTextStyles(block, true, isPremium)
                  }}
                >
                  {block.catalogItemContent.description}
                </p>
                
                {/* Add to Cart button option in Menu / Catalog modes */}
                <div className="pt-2" style={{ textAlign: block.textAlign || 'right' }}>
                  <button
                    onClick={(e) => {
                      if (isPreviewMockupMode) return; // ignore in active editor mockup clicks
                      e.stopPropagation();
                      handleAddToCart({
                        id: block.id,
                        title: block.catalogItemContent!.title,
                        price: block.catalogItemContent!.price,
                        image: block.catalogItemContent!.image,
                      });
                    }}
                    style={block.customTitleColor ? { color: block.customTitleColor } : block.customTextColor ? { color: block.customTextColor } : undefined}
                    className={`px-2.5 py-1 border border-transparent rounded font-medium text-[10px] transition shadow-sm active:scale-95 inline-flex items-center gap-1.5 ${
                      hasDarkFill 
                        ? 'bg-white text-zinc-950 hover:bg-zinc-100' 
                        : 'bg-zinc-900 text-white hover:bg-zinc-800'
                    }`}
                  >
                    <Plus size={10} />
                    {TRANSLATIONS[lang].addToCart}
                  </button>
                </div>
              </div>
            </div>
          )}

          {block.type === 'category-header' && block.categoryHeaderContent && (
            <div 
              className={`border-b pb-1.5 pt-1 ${hasDarkFill ? 'border-zinc-800' : 'border-zinc-100'}`}
              style={{
                borderColor: block.customTitleColor ? `${block.customTitleColor}25` : block.customTextColor ? `${block.customTextColor}25` : undefined,
                textAlign: block.textAlign
              }}
            >
              <span 
                className={`uppercase font-bold tracking-widest ${(block.titleTextStyles?.textShimmerEnabled || block.textShimmerEnabled) ? 'text-shimmer-effect' : ''} ${block.customTitleColor || block.customTextColor ? '' : hasDarkFill ? 'text-zinc-400' : 'text-zinc-500'}`}
                style={{
                  ...(block.customTitleColor ? { color: block.customTitleColor } : block.customTextColor ? { color: block.customTextColor } : {}),
                  ...(block.customTitleFont ? { fontFamily: block.customTitleFont } : {}),
                  fontSize: block.customTitleFontSize !== undefined ? `${block.customTitleFontSize}px` : '12px',
                  ...getTextStyles(block, false, isPremium)
                }}
              >
                {block.categoryHeaderContent.title}
              </span>
            </div>
          )}

          {block.type === 'spacer' && block.spacerContent && (
            <div className={`
              w-full 
              ${block.spacerContent.height === 'small' ? 'h-6' : ''}
              ${block.spacerContent.height === 'medium' ? 'h-12' : ''}
              ${block.spacerContent.height === 'large' ? 'h-20' : ''}
            `} />
          )}

          {block.type === 'media' && block.mediaContent && (
            <MediaBlockContent block={block} lang={lang} />
          )}

          {/* GROUP BLOCK TYPE: Recursive grid/flow containers */}
          {block.type === 'group' && block.groupContent && (
            <div className={`w-full ${block.groupContent.layout === 'row' ? 'space-y-4' : 'space-y-3.5'}`}>
              <div className="flex items-center justify-between border-b border-zinc-200/40 pb-1.5">
                <span 
                  className="text-xs font-bold uppercase tracking-widest select-none opacity-80"
                  style={{
                    ...(block.customTitleColor ? { color: block.customTitleColor } : {}),
                    ...(block.customTitleFont ? { fontFamily: block.customTitleFont } : {}),
                    fontSize: block.customTitleFontSize !== undefined ? `${block.customTitleFontSize}px` : undefined
                  }}
                >
                  📁 {block.groupContent.title || (lang === 'en' ? 'Section Group' : 'Группа слоев')}
                </span>
              </div>
              <div className={block.groupContent.layout === 'row' ? 'flex flex-row flex-wrap gap-4 w-full items-stretch justify-center' : 'space-y-4 w-full'}>
                {block.groupContent.blocks.length === 0 ? (
                  <div className="py-7 border border-dashed border-zinc-250 rounded-lg text-center text-xs opacity-65 font-mono w-full">
                    {lang === 'en' ? '[ Empty Group Container ]' : '[ Пустая группа фреймов ]'}
                  </div>
                ) : (
                  block.groupContent.blocks.map(innerBlock => renderSingleBlock(innerBlock, block.groupContent?.layout === 'row'))
                )}
              </div>
            </div>
          )}

          </div> {/* End CONTENT LAYER */}
        </div> {/* End CLIPPER CONTAINER */}

        {/* Contour Glow and Corner Lights Overlay placed on top of Clipper Container */}
        {(block.borderGlowActive || block.borderCornerGlowActive) && (
          <CornerGlowOverlay
            borderRadius={cornersEnabled && cornersRadius !== undefined ? cornersRadius : 12}
            borderGlowActive={block.borderGlowActive}
            borderGlowColor={block.borderGlowColor}
            borderGlowWidth={block.borderGlowWidth}
            borderGlowOpacity={block.borderGlowOpacity}
            borderCornerGlowActive={block.borderCornerGlowActive}
            borderCornerColorTL={block.borderCornerColorTL}
            borderCornerColorTR={block.borderCornerColorTR}
            borderCornerColorBL={block.borderCornerColorBL}
            borderCornerColorBR={block.borderCornerColorBR}
            borderCornerLength={block.borderCornerLength}
            borderCornerStroke={block.borderCornerStroke}
            borderCornerGlowSpread={block.borderCornerGlowSpread}
            borderCornerGlowOpacity={block.borderCornerGlowOpacity}
          />
        )}

        {/* Editor Helpers: Placed OUTSIDE the clipper so they don't get cut off */}
        {isPreviewMockupMode && (
          <>
            {/* Minimalist reorder drag handles */}
            <div 
              className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white text-zinc-800 border border-zinc-200 shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 active:scale-95 transition-all z-50"
              onMouseDown={() => setBlockDraggableId(block.id)}
              onMouseUp={() => { setBlockDraggableId(null); }}
              onMouseLeave={() => { if (!draggedBlockId) setBlockDraggableId(null); }}
              onClick={(e) => { e.stopPropagation(); }}
              title={lang === 'en' ? 'Drag to reorder' : 'Перетащить вверх/вниз'}
            >
               <GripVertical size={14} className="text-zinc-500" />
            </div>

            {/* Actions: Duplicate and Delete */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity z-50">
                <button
                    onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }}
                    className="p-1.5 bg-zinc-900 border border-zinc-700 rounded-full text-white hover:bg-purple-600 transition-colors"
                >
                    <Copy size={14} className="text-white" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
                    className="p-1.5 bg-zinc-900 border border-zinc-700 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            {/* Block Type Indicator */}
            <span className="absolute bottom-2 right-2 opacity-0 group-hover/block:opacity-100 transition-opacity bg-zinc-900/80 text-zinc-300 font-mono text-[9px] px-1.5 py-0.5 rounded uppercase pointer-events-none z-50 w-auto">
              {block.type}
            </span>
          </>
        )}
      </div>
    );
  };

    const containerWidthClass = viewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-[720px]';

    const blockSpacingVal = config.mainBg?.blockSpacing !== undefined ? config.mainBg.blockSpacing : 32;
    const blockSpacingPx = (blockSpacingVal / 100) * 50;

    return (
      <div 
        className={`flex flex-col ${fontClass} text-zinc-900 transition-all duration-300 w-full ${containerWidthClass} mx-auto relative min-h-full flex-1`}
        style={{ gap: `${blockSpacingPx}px` }}
      >
        {config.blocks.map((block) => renderSingleBlock(block))}

        {/* Dynamic "+" Inserter at the bottom of the blocks (Only in Editor Mode) */}
        {isPreviewMockupMode && (
          <div className="mt-6 animate-fade-in pt-1">
            {!isInserting ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsInserting(true);
                }}
                className="w-full py-5 border-2 border-dashed border-zinc-200 hover:border-zinc-350 bg-zinc-50/20 hover:bg-zinc-50 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer"
              >
                <Plus size={18} className="text-zinc-400 group-hover:scale-110 group-hover:text-zinc-700 transition-all duration-200" />
                <span className="text-[11px] font-semibold text-zinc-500 group-hover:text-zinc-800 transition-colors">
                  {lang === 'en' ? 'Add Section / Block' : 'Добавить блок / Стенд'}
                </span>
              </button>
            ) : (
              <div className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl p-4 shadow-2xl space-y-3.5 animate-slide-up text-left z-35">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 font-mono">
                    {lang === 'en' ? 'Choose Block Type' : 'Выберите тип блока'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsInserting(false);
                    }}
                    className="text-zinc-500 hover:text-zinc-300 text-[11px] font-mono transition-colors"
                  >
                    ✕ Close
                  </button>
                </div>
                
                {/* Horizontal Minimalist Icon List with drag-to-scroll & custom nav arrows */}
                <div className="relative flex items-center group/panel w-full">
                  {/* Left Scroll Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollInserter('left');
                    }}
                    className="absolute left-0 z-10 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center opacity-100 sm:opacity-0 group-hover/panel:opacity-100 transition-opacity hover:bg-zinc-750 cursor-pointer shadow-md"
                    title="Scroll Left"
                  >
                    <ChevronLeft size={12} />
                  </button>

                  {/* Horizontal Scroll Area */}
                  <div 
                    ref={inserterListRef}
                    onMouseDown={handleInserterMouseDown}
                    onMouseLeave={handleInserterMouseLeave}
                    onMouseUp={handleInserterMouseUp}
                    onMouseMove={handleInserterMouseMove}
                    className={`flex items-center gap-1 overflow-x-auto px-6 pb-1.5 scrollbar-none justify-start w-full transition-all ${
                      inserterIsDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
                    }`}
                  >
                    {[
                      { type: 'profile', icon: User, label: lang === 'en' ? 'Profile' : 'Био' },
                      { type: 'socials', icon: Share2, label: lang === 'en' ? 'Socials' : 'Сети' },
                      { type: 'text', icon: Type, label: lang === 'en' ? 'Text' : 'Текст' },
                      { type: 'button', icon: MousePointerClick, label: lang === 'en' ? 'CTA' : 'Кнопка' },
                      { type: 'catalog-item', icon: ShoppingBag, label: lang === 'en' ? 'Product' : 'Товар' },
                      { type: 'category-header', icon: FolderHeart, label: lang === 'en' ? 'Header' : 'Раздел' },
                      { type: 'spacer', icon: ArrowUpDown, label: lang === 'en' ? 'Spacer' : 'Отступ' },
                      { type: 'media', icon: ImageIcon, label: lang === 'en' ? 'Media' : 'Медиа' },
                      { type: 'group', icon: FolderPlus, iconColor: 'text-amber-500', label: lang === 'en' ? 'Group' : 'Группа' },
                    ].map((btn) => {
                      const IconComp = btn.icon;
                      return (
                        <button
                          type="button"
                          key={btn.type}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Only select/add if not actively drag-scrolling a long distance
                            handleAddBlock(btn.type as any);
                            setIsInserting(false);
                          }}
                          className="flex flex-col items-center gap-1 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 transition-all flex-shrink-0 w-[54px] group/btn border border-zinc-900 hover:border-zinc-800"
                          title={btn.label}
                        >
                          <IconComp size={15} className={`${btn.iconColor ? btn.iconColor : 'text-zinc-400'} group-hover/btn:text-white transition-colors pointer-events-none`} />
                          <span className="text-[8px] font-mono font-medium text-zinc-400 group-hover/btn:text-zinc-200 select-none text-center leading-tight truncate w-full mt-1 pointer-events-none">
                            {btn.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Scroll Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollInserter('right');
                    }}
                    className="absolute right-0 z-10 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center opacity-100 sm:opacity-0 group-hover/panel:opacity-100 transition-opacity hover:bg-zinc-750 cursor-pointer shadow-md"
                    title="Scroll Right"
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Generate dynamic keyframes for text shimmer intervals
  const dynamicStyles = React.useMemo(() => {
    let css = '';
    for (let percent = 1; percent <= 100; percent++) {
      css += `
        @keyframes shimmer-anim-${percent} {
          0% { background-position: 100% 0; }
          ${percent}% { background-position: 0% 0; }
          100% { background-position: 0% 0; }
        }
      `;
    }
    return css;
  }, []);

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans selection:bg-zinc-900 selection:text-white antialiased">
      {!isDataLoaded && (
        <div className="fixed inset-0 z-[9999] bg-zinc-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-800 rounded-full animate-spin"></div>
        </div>
      )}
      <style>{dynamicStyles}</style>
      
      {/* SAVE CUSTOM STYLE MODAL */}
      {showSaveStyleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={() => setShowSaveStyleModal(false)}
          />
          <form 
            onSubmit={handleConfirmSaveStyle}
            className="relative bg-zinc-900 border border-zinc-805 text-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in space-y-4 select-none text-left z-50"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                <Sparkle size={16} className="text-purple-400 animate-pulse" />
                <span>{lang === 'en' ? 'Save Custom Style' : 'Сохранить стиль'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSaveStyleModal(false)}
                className="text-zinc-500 hover:text-white transition-colors text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                {lang === 'en' ? 'Template Name' : 'Название шаблона'}
              </label>
              <input
                type="text"
                maxLength={40}
                required
                value={styleSaveName}
                onChange={(e) => setStyleSaveName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                placeholder={lang === 'en' ? 'e.g. My Bio-Link Style' : 'например, Мой стиль визитки'}
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSaveStyleModal(false)}
                className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white text-xs hover:bg-zinc-800 transition-all font-medium"
              >
                {lang === 'en' ? 'Cancel' : 'Отмена'}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-900/40"
              >
                {lang === 'en' ? 'Save Style' : 'Сохранить'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SAVE CUSTOM READY TEMPLATE MODAL */}
      {showSaveReadyTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={() => setShowSaveReadyTemplateModal(false)}
          />
          <form 
            onSubmit={handleConfirmSaveReadyTemplate}
            className="relative bg-zinc-900 border border-zinc-805 text-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in space-y-4 select-none text-left z-50"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                <Sparkle size={16} className="text-amber-400 animate-pulse" />
                <span>{lang === 'en' ? 'Save as Ready Template' : 'Добавить в готовые шаблоны'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSaveReadyTemplateModal(false)}
                className="text-zinc-500 hover:text-white transition-colors text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                {lang === 'en' ? 'Template Name' : 'Название готового шаблона'}
              </label>
              <input
                type="text"
                maxLength={40}
                required
                value={readyTemplateSaveName}
                onChange={(e) => setReadyTemplateSaveName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                placeholder={lang === 'en' ? 'e.g. Amber Minimal' : 'например, Янтарный Минимал'}
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSaveReadyTemplateModal(false)}
                className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white text-xs hover:bg-zinc-800 transition-all font-medium"
              >
                {lang === 'en' ? 'Cancel' : 'Отмена'}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-lg shadow-amber-900/40"
              >
                {lang === 'en' ? 'Add Template' : 'Добавить шаблон'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE USER TEMPLATE CONFIRMATION MODAL */}
      {templateToDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={() => setTemplateToDeleteId(null)}
          />
          <div 
            className="relative bg-zinc-900 border border-zinc-855 text-white rounded-2xl p-6 max-w-xs w-full shadow-2xl animate-fade-in space-y-4 select-none text-left z-50"
          >
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
              <Trash2 size={18} className="text-red-400" />
              <h3 className="font-bold text-sm tracking-tight text-white">
                {lang === 'en' ? 'Delete Template?' : 'Удалить шаблон?'}
              </h3>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-semibold block">
              {lang === 'en' 
                ? 'Are you sure you want to permanently delete this custom style preset?' 
                : 'Вы уверены, что хотите навсегда удалить этот шаблон стиля?'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTemplateToDeleteId(null)}
                className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white text-xs hover:bg-zinc-800 transition-all font-semibold"
              >
                {lang === 'en' ? 'Cancel' : 'Отмена'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUserTemplate}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-lg shadow-red-900/40"
              >
                {lang === 'en' ? 'Delete' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNDO/REDO FLOATING BUTTONS IN FOOTER (Visible during editor mode) */}
      {activeTab === 'editor' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[47] flex items-center gap-1 bg-zinc-950/90 backdrop-blur-md border border-zinc-850 text-white rounded-full px-4 py-2.5 shadow-2xl shrink-0 select-none max-w-[90vw] animate-slide-up">
          <button
            type="button"
            onClick={handleUndo}
            disabled={!undoStack[templateType] || undoStack[templateType].length === 0}
            className="px-3 py-1.5 rounded-full hover:bg-zinc-850 text-zinc-300 disabled:text-zinc-650 disabled:hover:bg-transparent transition-all flex items-center gap-1.5 focus:outline-none cursor-pointer disabled:cursor-not-allowed font-semibold"
            title={lang === 'en' ? 'Undo changes' : 'Отменить изменения'}
          >
            <Undo size={14} className={undoStack[templateType] && undoStack[templateType].length > 0 ? "text-purple-400" : "text-zinc-500"} />
            <span className="text-[11px] font-bold">{lang === 'en' ? 'Undo' : 'Назад'}</span>
            {undoStack[templateType] && undoStack[templateType].length > 0 && (
              <span className="bg-purple-650 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none shadow-sm ml-0.5 font-mono">
                {undoStack[templateType].length}
              </span>
            )}
          </button>
          
          <div className="w-[1.5px] h-4 bg-zinc-800 mx-1" />
          
          <button
            type="button"
            onClick={handleRedo}
            disabled={!redoStack[templateType] || redoStack[templateType].length === 0}
            className="px-3 py-1.5 rounded-full hover:bg-zinc-850 text-zinc-300 disabled:text-zinc-650 disabled:hover:bg-transparent transition-all flex items-center gap-1.5 focus:outline-none cursor-pointer disabled:cursor-not-allowed font-semibold"
            title={lang === 'en' ? 'Redo changes' : 'Вернуть изменения'}
          >
            <span className="text-[11px] font-bold">{lang === 'en' ? 'Redo' : 'Вперед'}</span>
            <Redo size={14} className={redoStack[templateType] && redoStack[templateType].length > 0 ? "text-emerald-400" : "text-zinc-500"} />
            {redoStack[templateType] && redoStack[templateType].length > 0 && (
              <span className="bg-emerald-650 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none shadow-sm ml-0.5 font-mono">
                {redoStack[templateType].length}
              </span>
            )}
          </button>
        </div>
      )}
      
      {/* Dynamic Toast popup notifier */}
      {toastMessage && (
        <div id="toast" className="fixed bottom-6 right-6 bg-zinc-950 text-white font-mono text-xs px-4 py-3 rounded-lg shadow-xl border border-zinc-800 z-50 transition-all transform animate-fade-in flex items-center gap-2">
          <CheckCircle2 size={13} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
      {/* TOP BAR / THE CREATOR NAV */}
      {activeTab !== 'preview' && (
        <header id="top_bar" className="fixed top-0 left-0 right-0 h-16 z-40 bg-zinc-950 text-white border-b border-zinc-800/80">
          <div className="relative w-full px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between gap-4">
            
              {/* Left Side: Logo Brand */}
              <div className="flex items-center gap-6">
                <div 
                  onClick={() => {
                    setActiveTab('landing');
                    setIsBurgerMenuOpen(false);
                  }}
                  className="flex items-center cursor-pointer select-none"
                >
                  <img
                    src="/SLM cards logo.svg"
                    alt="SLM Cards"
                    className="h-8 w-auto object-contain transition-none transform-none hover:scale-100 active:scale-100"
                    style={{ filter: 'brightness(0) invert(1)' }}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

            {/* Center Side: Breadcrumbs and Preview */}
            {isAuthenticated && activeTab !== 'projects' && (
              <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-2 bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/50 z-10">
                <button
                  id="tab_projects"
                  onClick={() => {
                    setActiveTab('projects');
                    setIsBurgerMenuOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-850/50"
                >
                  <FolderOpen size={14} />
                  <span>
                    {lang === 'en' ? 'My Projects' : 'Мои проекты'}
                    {activeTab === 'editor' && activeProjectId && (
                      <>
                        <span className="mx-2 text-zinc-600 font-normal">/</span>
                        <span className="text-zinc-200" title={projects.find(p => p.id === activeProjectId)?.name || 'Project'}>
                          {(() => {
                            const name = projects.find(p => p.id === activeProjectId)?.name || 'Project';
                            return name.length > 30 ? name.slice(0, 27) + '...' : name;
                          })()}
                        </span>
                      </>
                    )}
                  </span>
                </button>

                {activeTab === 'editor' && activeProjectId && (
                  <button
                    onClick={() => {
                      setActiveTab('preview');
                      // Simulate views growth
                      updateConfigField('views', config.views + 1);
                      setIsBurgerMenuOpen(false);
                    }}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    title={lang === 'en' ? 'Open Public Preview' : 'Открыть публичный просмотр'}
                  >
                    <Eye size={14} />
                    <span>{lang === 'en' ? 'Preview' : 'Просмотр'}</span>
                  </button>
                )}
              </nav>
            )}

            {/* Right Side: Language switcher, notifications, profile, and hamburger */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Active Project Info Widget (Subtle badge) */}
              {isAuthenticated && activeProjectId && activeTab !== 'editor' && activeTab !== 'projects' && activeTab !== 'landing' && (
                <div className="hidden lg:flex items-center gap-2 bg-zinc-900/40 border border-zinc-800/60 px-3 py-1.5 rounded-lg text-xs">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-zinc-400 max-w-[120px] truncate">
                    {projects.find(p => p.id === activeProjectId)?.name || 'Project'}
                  </span>
                </div>
              )}

              {/* 👁️ PUBLIC PREVIEW BUTTON (Highly Prominent!) */}
              {isAuthenticated && activeProjectId && activeTab !== 'editor' && activeTab !== 'projects' && activeTab !== 'landing' && (
                <button
                  onClick={() => {
                    setActiveTab('preview');
                    // Simulate views growth
                    updateConfigField('views', config.views + 1);
                    setIsBurgerMenuOpen(false);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  title={lang === 'en' ? 'Open Public Preview' : 'Открыть публичный просмотр'}
                >
                  <Eye size={14} />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Public Preview' : 'Просмотр'}</span>
                </button>
              )}

              {/* Notification bell */}
              {isAuthenticated && (
                <div className="relative">
                  <button 
                    onClick={() => {
                      setIsNotificationsOpen(!isNotificationsOpen);
                      setIsBurgerMenuOpen(false);
                    }}
                    className="text-zinc-400 hover:text-white p-2 rounded-lg bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/60 transition-colors relative h-9 w-9 flex items-center justify-center cursor-pointer"
                  >
                    <Bell size={15} />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full ring-2 ring-zinc-950" />
                  </button>
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-4 z-50 animate-scale-up">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
                        <span className="font-bold text-xs text-white">
                          {lang === 'en' ? 'Notifications' : 'Уведомления'}
                        </span>
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded font-bold font-mono">1 new</span>
                      </div>
                      <div className="space-y-2 py-1 max-h-48 overflow-y-auto">
                        <div className="flex gap-2.5 p-2 rounded-lg bg-zinc-850 border border-zinc-800/60">
                          <span className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-zinc-100">
                              {lang === 'en' ? 'Welcome to SLM Cards!' : 'Добро пожаловать в SLM Cards!'}
                            </p>
                            <p className="text-[10px] text-zinc-400 leading-normal mt-0.5">
                              {lang === 'en' 
                                ? 'Start creating premium interactive micro-landings in minutes.' 
                                : 'Начните создавать интерактивные микролендинги за пару минут.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* RU/ENG Selector */}
              <button
                onClick={() => setLang(l => l === 'en' ? 'ru' : 'en')}
                className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 hover:text-white p-2 h-9 flex items-center justify-center bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/60 rounded-lg transition-all cursor-pointer"
                title={lang === 'en' ? 'Switch to Russian' : 'Переключить на английский'}
              >
                {lang === 'en' ? 'RU' : 'EN'}
              </button>

              {/* Profile card / Login button */}
              {!isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-1.5">
                  <button 
                    onClick={() => {
                      setIsAuthModalOpen(true);
                    }}
                    className="text-xs font-bold px-3 py-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {lang === 'en' ? 'Login' : 'Войти'}
                  </button>
                  <button 
                    onClick={() => {
                      setIsAuthModalOpen(true);
                    }}
                    className="text-xs font-bold px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-lg shadow-indigo-600/10 cursor-pointer"
                  >
                    {lang === 'en' ? 'Register' : 'Регистрация'}
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/60 p-1.5 pr-3 rounded-xl transition-all select-none">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px] uppercase shadow-sm">
                    US
                  </div>
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-[10px] font-bold text-zinc-200">ivemaker</span>
                    <button 
                      onClick={() => {
                        logout();
                      }}
                      className="text-[9px] font-semibold text-zinc-500 hover:text-rose-450 text-left cursor-pointer transition-colors mt-0.5 leading-none"
                    >
                      {lang === 'en' ? 'Sign out' : 'Выйти'}
                    </button>
                  </div>
                </div>
              )}

              {/* 🍔 BURGER MENU TRIGGER BUTTON & DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsBurgerMenuOpen(!isBurgerMenuOpen);
                    setIsNotificationsOpen(false);
                  }}
                  className="p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/60 transition-colors flex items-center justify-center h-9 w-9 cursor-pointer"
                  title="Menu / Меню"
                >
                  {isBurgerMenuOpen ? <X size={16} /> : <Menu size={16} />}
                </button>

                {/* SMOOTH ANIMATED BURGER DROPDOWN LIST */}
                <AnimatePresence>
                  {isBurgerMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 p-1.5 flex flex-col gap-0.5"
                    >
                      {/* Navigation links for MOBILE/TABLET (since they are hidden in center on small screens) */}
                      {isAuthenticated && (
                        <div className="md:hidden flex flex-col gap-0.5">
                          <div className="px-3 py-1.5 text-[9px] text-zinc-500 uppercase tracking-wider font-bold">
                            {lang === 'en' ? 'Workspace' : 'Рабочая область'}
                          </div>
                          
                          <button
                            onClick={() => {
                              setActiveTab('projects');
                              setIsBurgerMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                              activeTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-zinc-300 hover:bg-zinc-800'
                            }`}
                          >
                            <FolderOpen size={14} className="shrink-0" />
                            <span>{lang === 'en' ? 'My Projects' : 'Мои проекты'}</span>
                          </button>
                          
                          <div className="h-px bg-zinc-800/60 my-1" />
                        </div>
                      )}

                      {/* Public Navigation */}
                      <div className="md:hidden flex flex-col gap-0.5">
                        <div className="px-3 py-1.5 text-[9px] text-zinc-500 uppercase tracking-wider font-bold">
                          {lang === 'en' ? 'Navigation' : 'Навигация'}
                        </div>
                        <div className="h-px bg-zinc-800/60 my-1" />
                      </div>

                      {/* Management section */}
                      <div className="px-3 py-1.5 text-[9px] text-zinc-500 uppercase tracking-wider font-bold">
                        {lang === 'en' ? 'Management' : 'Управление'}
                      </div>

                      {isAuthenticated ? (
                        <>
                          <button
                            onClick={() => {
                              setActiveTab('settings');
                              setIsBurgerMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                              activeTab === 'settings' ? 'bg-zinc-800 text-indigo-400' : 'text-zinc-300 hover:bg-zinc-800'
                            }`}
                          >
                            <Settings size={14} className="text-zinc-400 shrink-0" />
                            <span>{lang === 'en' ? 'Platform Settings' : 'Настройки платформы'}</span>
                          </button>
                        </>
                      ) : (
                        <div className="text-[10px] text-zinc-500 italic px-3 py-2 bg-zinc-950/40 rounded-lg">
                          {lang === 'en' ? 'Sign in to access analytics & settings.' : 'Войдите для доступа к аналитике и настройкам.'}
                        </div>
                      )}

                      <div className="h-px bg-zinc-800/60 my-1" />

                      {/* Account section */}
                      <div className="px-3 py-1.5 text-[9px] text-zinc-500 uppercase tracking-wider font-bold">
                        {lang === 'en' ? 'Account Profile' : 'Профиль аккаунта'}
                      </div>

                      {isAuthenticated ? (
                        <div className="p-1 flex flex-col gap-1">
                          <div className="flex items-center gap-2 px-2 py-1.5 bg-zinc-950/30 rounded-lg border border-zinc-800/40">
                            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px] uppercase shrink-0">
                              US
                            </div>
                            <div className="min-w-0 flex-1 leading-none">
                              <p className="text-[10px] font-bold text-zinc-200 truncate leading-none">ivemaker@gmail.com</p>
                              <p className="text-[8px] text-zinc-500 font-mono leading-none mt-1">
                                {lang === 'en' ? 'Authorized Creator' : 'Создатель'}
                              </p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => {
                              logout();
                              setIsBurgerMenuOpen(false);
                            }}
                            className="w-full mt-1 px-3 py-2 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 transition-colors text-left text-xs font-bold rounded-lg flex items-center gap-2.5 cursor-pointer"
                          >
                            <LogOut size={13} className="shrink-0 text-rose-455" />
                            <span>{lang === 'en' ? 'Sign Out / Exit' : 'Выйти из аккаунта'}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="p-1">
                          <button
                            onClick={() => {
                              setIsAuthModalOpen(true);
                              setIsBurgerMenuOpen(false);
                            }}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-colors text-center cursor-pointer flex items-center justify-center gap-2"
                          >
                            <User size={13} />
                            <span>{lang === 'en' ? 'Sign In / Log In' : 'Войти в аккаунт'}</span>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* RENDER MASTER CONTENT VIEWS */}
      {activeTab !== 'preview' ? (
        <div className={`h-screen pt-16 flex flex-col font-sans overflow-hidden ${
          activeTab === 'projects' || activeTab === 'editor' || activeTab === 'landing' 
            ? 'bg-zinc-950 text-white' 
            : 'bg-zinc-50 text-zinc-900'
        }`}>
          <main className={`flex-1 flex flex-col relative ${
            activeTab === 'editor' ? 'overflow-hidden' : 'overflow-y-auto'
          } ${
            activeTab === 'projects' || activeTab === 'editor' || activeTab === 'landing' 
              ? 'bg-zinc-950 text-white' 
              : 'bg-zinc-50 text-zinc-900'
          }`}>

        {/* 1. THE CREATOR WORKSPACE (EDITOR TAB) */}
        {isAuthenticated && activeTab === 'editor' && activeProjectId === null ? (
          <div className="flex-1 w-full flex flex-col items-center justify-center p-8 bg-zinc-950 text-center animate-fade-in min-h-[70vh]">
            <div className="max-w-md bg-zinc-900 border border-zinc-850 p-8 rounded-2xl shadow-2xl flex flex-col items-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg">
                <FolderOpen className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  {lang === 'en' ? 'No Active Project Selected' : 'У вас нет активного проекта'}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {lang === 'en' 
                    ? 'Please select an existing project in the "Projects" tab or create a new one to start working.' 
                    : 'Пожалуйста, выберите существующий проект во вкладке «Проекты» или создайте новый, чтобы начать работу.'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('projects')}
                id="btn-go-to-projects-placeholder"
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/10 border border-indigo-500 hover:shadow-indigo-500/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{lang === 'en' ? 'Go to Projects' : 'Перейти к проектам'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : isAuthenticated && activeTab === 'editor' && (
          <div className="w-full flex flex-col items-stretch justify-center relative h-[calc(100vh-56px)] overflow-hidden">
            
            {/* LAYERS DRAWER BACKDROP OVERLAY */}
            {showLayersPanel && (
              <div 
                className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-[48] transition-opacity duration-300 animate-fade-in cursor-pointer"
                onClick={() => setShowLayersPanel(false)}
              />
            )}

            {/* GORGEOUS SLIDING LAYERS SIDEBAR SCREEN DRAWER (POPUP SIDE MENU) */}
            <div 
              className={`fixed top-0 left-0 h-screen w-80 bg-white border-r border-zinc-200 shadow-[10px_0_30px_rgba(0,0,0,0.12)] z-[49] flex flex-col transition-transform duration-300 ease-in-out transform ${
                showLayersPanel ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <LayersPanel
                blocks={config.blocks}
                selectedBlockId={selectedBlockId}
                draggedBlockId={draggedBlockId}
                dragOverBlockId={dragOverBlockId}
                dragPosition={dragPosition}
                lang={lang}
                setShowLayersPanel={setShowLayersPanel}
                setSelectedBlockId={setSelectedBlockId}
                toggleGroupCollapse={toggleGroupCollapse}
                renameGroup={renameGroup}
                handleKeyboardMove={handleKeyboardMove}
                deleteGroupAndUnnest={deleteGroupAndUnnest}
                deleteBlock={deleteBlock}
                handleDragStart={handleDragStart}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleDragEnd={handleDragEnd}
                handleDrop={handleDrop}
                handleDropAtRoot={handleDropAtRoot}
                setDragOverBlockId={setDragOverBlockId}
                setDragPosition={setDragPosition}
                presets={customReadyTemplates}
                userTemplates={userTemplates}
                currentConfig={config}
                onApplyTemplate={setTemplateToApply}
                onSaveCurrentStyle={handleSaveCurrentStyle}
                onDeleteUserTemplate={handleDeleteUserTemplate}
                isDevMode={developerMode}
                onDeleteReadyTemplate={handleDeleteReadyTemplate}
                onUpdateReadyTemplates={handleUpdateReadyTemplates}
                onAddReadyTemplate={handleSaveReadyTemplate}
              />
            </div>

            {/* SLIDING DOCK TRIGGER HANDLE ARROW */}
            <div 
              onClick={() => setShowLayersPanel(!showLayersPanel)}
              className="fixed top-[35%] -translate-y-1/2 z-[50] bg-zinc-950 border border-l-0 border-zinc-800 text-white rounded-r-xl py-4 px-1.5 shadow-[5px_5px_15px_rgba(0,0,0,0.2)] flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 ease-in-out hover:bg-zinc-850 hover:px-2.5 select-none"
              style={{ left: showLayersPanel ? '320px' : '0px' }}
              title={showLayersPanel ? (lang === 'en' ? 'Close Layers Panel' : 'Закрыть панель слоев') : (lang === 'en' ? 'Open Layers Panel (Swipe Right)' : 'Панель слоев (Свайп вправо)')}
            >
              {showLayersPanel ? (
                <ChevronLeft size={14} className="text-zinc-400 hover:text-white" />
              ) : (
                <ChevronRight size={14} className="text-zinc-400 hover:text-white" />
              )}
            </div>

            {/* 2. CENTER CANVAS: INTERACTIVE RESPONSIVE WORKSPACE */}
            {(() => {
              const bgInfo = getMainBgStyle(config.mainBg, phoneScrollY);
              const isDarkText = bgInfo.className.includes('text-white');
              const textColorClass = isDarkText ? 'text-white' : 'text-zinc-900';

              const outerClassName = `flex-1 w-full min-h-[75vh] relative overflow-hidden flex flex-col transition-all duration-300 transform translate-x-0 ${bgInfo.className} ${textColorClass}`;
              const outerStyle = bgInfo.style;

              const innerClassName = `w-full h-full py-10 px-4 overflow-y-auto overflow-x-hidden relative flex flex-col items-center z-10 font-[system-ui] transition-all duration-500 ${viewMode === 'mobile' ? 'max-w-[375px] mx-auto shadow-[0_0_50px_rgba(0,0,0,0.3)]' : 'max-w-[720px] mx-auto'}`;
              const innerStyle = {};

              return (
                <div 
                  id="live_preview" 
                  className={outerClassName}
                  style={outerStyle}
                >
                  {bgInfo.innerStyle && (
                    <div style={bgInfo.innerStyle} className="absolute inset-0 bg-cover bg-center pointer-events-none transition-all duration-300" />
                  )}
                  <BackgroundEffects effects={bgInfo.effects} forcePause={showMockup && viewMode !== 'desktop'} scrollOffset={phoneScrollY} />
                  
                  {/* Inner screen content */}
                  <div 
                    onScroll={(e) => {
                      setPhoneScrollY(e.currentTarget.scrollTop);
                    }}
                    className={innerClassName}
                    style={innerStyle}
                  >
                    <div className="relative z-10 flex flex-col min-h-full w-full">
                      {/* Frame elements output */}
                      {renderPublicBlocks(true)}

                      {/* Simple copyright footer inside designer */}
                      <footer className="mt-auto pt-16 pb-4 text-center text-[10px] text-zinc-400 font-mono select-none">
                        Powered by No-Code Page Creator Studio
                      </footer>
                    </div>
                  </div>

                  {!showMockup && renderCartUI()}

                  {/* SELECTED FRAME INSPECTOR POPUP MODAL */}
                  {selectedBlockId && (() => {
                    let focusedBlock: any = null;
                    if (selectedBlockId === 'main-bg') {
                      focusedBlock = {
                        id: 'main-bg',
                        type: 'main-bg',
                        ...config.mainBg,
                      };
                    } else {
                      focusedBlock = findBlockRecursive(config.blocks, selectedBlockId);
                    }
                    if (!focusedBlock) return null;

                    const isDesktopScreen = windowWidth >= 1024;

                    if (isDesktopScreen) {
                      return (
                        <div 
                          className="lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:flex-col lg:justify-start lg:pointer-events-auto lg:select-auto lg:z-30 lg:border-r lg:border-zinc-900 bg-zinc-950/98 shadow-xl lg:min-w-[320px]"
                          style={{
                            width: viewMode === 'mobile' ? 'calc((100% - 375px) / 2)' : 'calc((100% - 720px) / 2)'
                          }}
                        >
                          {/* Desktop/PC Left side inspector with full scroll support */}
                          <div className="relative w-full h-full p-6 pb-16 overflow-y-auto flex-1">
                            <BlockInspector
                              viewMode={viewMode}
                              focusedBlock={focusedBlock ? resolveBlockOverrides(focusedBlock, viewMode, config.mainBg?.syncThemes ? 'light' : (config.mainBg?.theme || 'light')) : null}
                              selectedBlockId={selectedBlockId}
                              config={config}
                              updateBlocks={updateBlocks}
                              lang={lang}
                              isCompressing={isCompressing}
                              handleImageUpload={handleImageUpload}
                              updateFocusedBlock={(updateFn) => {
                                if (selectedBlockId === 'main-bg') {
                                  const virtualBlock = {
                                    id: 'main-bg',
                                    type: 'main-bg',
                                    ...config.mainBg,
                                  };
                                  const partial = updateFn(virtualBlock as any);
                                  if (partial.mainBg) {
                                    updateConfigField('mainBg', partial.mainBg);
                                  }
                                } else {
                                  updateFocusedBlock((b) => {
                                    return updateFn(b);
                                  });
                                }
                              }}
                              setSelectedBlockId={setSelectedBlockId}
                              translations={TRANSLATIONS[lang]}
                            />
                          </div>
                        </div>
                      );
                    }

                    // Mobile & Tablet: Bottom sheet rising from the bottom up to 50vh of the screen height
                    return (
                      <div className="fixed inset-0 overflow-hidden z-[48] flex flex-col justify-end pointer-events-none select-none">
                        {/* Dark active background backdrop overlay */}
                        <div 
                          className="absolute inset-0 bg-black/15 backdrop-blur-0 transition-opacity cursor-pointer duration-300 pointer-events-auto select-auto"
                          onClick={() => setSelectedBlockId(null)}
                        />
                        
                        {/* Floating bottom sheet with scroll support */}
                        <div className="relative w-full max-w-[850px] mx-auto bg-zinc-950 text-white rounded-t-[24px] pointer-events-auto select-auto z-40 max-h-[50vh] overflow-y-auto p-4 pb-16 border-t border-zinc-900 animate-slide-up shadow-2xl">
                          {/* Drag handle pill */}
                          <div className="w-10 h-1 bg-zinc-850/80 rounded-full mx-auto mb-3 flex-shrink-0" />
                          
                          <BlockInspector
                            viewMode={viewMode}
                            focusedBlock={focusedBlock ? resolveBlockOverrides(focusedBlock, viewMode, config.mainBg?.syncThemes ? 'light' : (config.mainBg?.theme || 'light')) : null}
                            selectedBlockId={selectedBlockId}
                            config={config}
                            updateBlocks={updateBlocks}
                            lang={lang}
                            isCompressing={isCompressing}
                            handleImageUpload={handleImageUpload}
                            updateFocusedBlock={(updateFn) => {
                              if (selectedBlockId === 'main-bg') {
                                const virtualBlock = {
                                  id: 'main-bg',
                                  type: 'main-bg',
                                  ...config.mainBg,
                                };
                                const partial = updateFn(virtualBlock as any);
                                if (partial.mainBg) {
                                  updateConfigField('mainBg', partial.mainBg);
                                }
                              } else {
                                updateFocusedBlock((b) => {
                                  return updateFn(b);
                                });
                              }
                            }}
                            setSelectedBlockId={setSelectedBlockId}
                            translations={TRANSLATIONS[lang]}
                          />
                        </div>
                      </div>
                    );
                  })()}

                </div>
              );
            })()}

            <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-[49] flex-col gap-2 bg-zinc-950/90 backdrop-blur-md border border-zinc-800 p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-fade-in">
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest text-center py-1 select-none border-b border-zinc-900 mb-1">
              {lang === 'en' ? 'View' : 'Вид'}
            </div>
            
            {/* Desktop Mode Button */}
            <button
              onClick={() => {
                setViewMode('desktop');
                setShowMockup(false);
              }}
              className={`p-2.5 rounded-xl transition-all flex flex-col items-center gap-1 group relative cursor-pointer ${
                viewMode === 'desktop'
                  ? 'bg-zinc-850 text-white shadow-md border border-zinc-700'
                  : 'text-zinc-500 hover:bg-zinc-900/60 hover:text-zinc-200 border border-transparent'
              }`}
              title={lang === 'en' ? 'Desktop View' : 'Компьютерный вид'}
            >
              <Monitor size={15} />
              <span className="text-[8px] font-mono font-semibold">{lang === 'en' ? 'Desktop' : 'ПК'}</span>
            </button>

            {/* Tablet Mode Button */}
            <button
              onClick={() => {
                setViewMode('tablet');
                setShowMockup(true);
              }}
              className={`p-2.5 rounded-xl transition-all flex flex-col items-center gap-1 group relative cursor-pointer ${
                viewMode === 'tablet'
                  ? 'bg-zinc-850 text-white shadow-md border border-zinc-700'
                  : 'text-zinc-500 hover:bg-zinc-900/60 hover:text-zinc-200 border border-transparent'
              }`}
              title={lang === 'en' ? 'Tablet View' : 'Вид на планшете'}
            >
              <Tablet size={15} />
              <span className="text-[8px] font-mono font-semibold">{lang === 'en' ? 'Tablet' : 'Планшет'}</span>
            </button>

            {/* Mobile Mode Button */}
            <button
              onClick={() => {
                setViewMode('mobile');
                setShowMockup(true);
              }}
              className={`p-2.5 rounded-xl transition-all flex flex-col items-center gap-1 group relative cursor-pointer ${
                viewMode === 'mobile'
                  ? 'bg-zinc-850 text-white shadow-md border border-zinc-700'
                  : 'text-zinc-500 hover:bg-zinc-900/60 hover:text-zinc-200 border border-transparent'
              }`}
              title={lang === 'en' ? 'Mobile View' : 'Вид на телефоне'}
            >
              <Smartphone size={15} />
              <span className="text-[8px] font-mono font-semibold">{lang === 'en' ? 'Mobile' : 'Моб.'}</span>
            </button>
          </div>

          {/* FLOATING RESPONSIVE DEVICE PREVIEW FOR EDITOR (NO BACKGROUND PLATE / ONLY HARDWARE FRAME) */}
          <div 
            className={`hidden lg:flex fixed right-24 top-1/2 -translate-y-1/2 z-[49] items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none ${
              showMockup 
                ? 'translate-x-[0] opacity-100'
                : 'translate-x-[150px] opacity-0'
            }`}
          >
            {showMockup && (() => {
              const editorBgInfo = getMainBgStyle(config.mainBg, phoneScrollY);
              const currentScale = viewMode === 'mobile' ? mobileScale : tabletScale;
              return (
                <div 
                  className="pointer-events-auto relative animate-fade-in"
                  style={{
                    transform: `scale(${currentScale})`,
                    transformOrigin: 'right top',
                    transition: isDraggingScale ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {/* Floating Close Badge above Device Frame */}
                  <button
                    onClick={() => setShowMockup(false)}
                    className="absolute -top-10 right-2 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-zinc-400 hover:text-white px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-mono shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all flex items-center gap-1 cursor-pointer animate-fade-in"
                    title={lang === 'en' ? 'Hide Device' : 'Скрыть устройство'}
                  >
                    ✕ {lang === 'en' ? 'Hide' : 'Скрыть'}
                  </button>

                  {/* MOBILE PHONE MOCKUP */}
                  {viewMode === 'mobile' && (
                    <div className="relative">
                      <div className="relative w-[392px] h-[720px] max-w-[95vw] max-h-[85vh] bg-black rounded-[48px] p-2.5 border-[6px] border-zinc-800 shadow-[0_30px_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden">
                        {/* Dynamic Island Pin */}
                        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-center border border-zinc-900/50">
                          <div className="w-2 h-2 bg-zinc-950 rounded-full mr-1.5 flex-shrink-0 relative">
                            <div className="absolute inset-[2.5px] bg-blue-950/80 rounded-full" />
                          </div>
                          <div className="w-1 h-1 bg-zinc-950 rounded-full flex-shrink-0" />
                        </div>
                        
                        {/* Theme Toggle for non-synced themes */}
                        {config.mainBg && !config.mainBg.syncThemes && (
                          <button
                            onClick={() => {
                              const nextTheme = config.mainBg.theme === 'dark' ? 'light' : 'dark';
                              updateConfigField('mainBg', { ...config.mainBg, theme: nextTheme });
                            }}
                            className="absolute top-3 right-6 z-30 p-1.5 bg-zinc-900/80 backdrop-blur-md rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer shadow-lg hover:scale-110 active:scale-95"
                            title={lang === 'en' ? 'Toggle Light/Dark' : 'Переключить Светлая/Темная'}
                          >
                            {config.mainBg.theme === 'dark' ? <Sun size={12} className="text-amber-400" /> : <Moon size={12} className="text-blue-400" />}
                          </button>
                        )}
                        
                        {/* Render Page inside Mobile Mockup */}
                        {(() => {
                          const isDarkText = editorBgInfo.className.includes('text-white');
                          const textColorClass = isDarkText ? 'text-white' : 'text-zinc-900';

                          const outerClassName = `w-full h-full rounded-[38px] relative overflow-hidden select-none isolate transform translate-x-0 ${editorBgInfo.className} ${textColorClass}`;
                          const outerStyle = editorBgInfo.style;

                          const innerClassName = `absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-none w-full h-full py-8 px-4 flex flex-col items-center z-10 font-[system-ui] transition-all duration-500`;
                          const innerStyle = {};

                          return (
                            <div className={outerClassName} style={outerStyle}>
                              {editorBgInfo.innerStyle && (
                                <div style={editorBgInfo.innerStyle} className="absolute inset-0 bg-cover bg-center pointer-events-none transition-all duration-300" />
                              )}
                              <BackgroundEffects effects={editorBgInfo.effects} scrollOffset={phoneScrollY} />
                              <div 
                                className={innerClassName} 
                                style={innerStyle} 
                                onScroll={(e) => {
                                  setPhoneScrollY(e.currentTarget.scrollTop);
                                }}
                              >
                                <div className="relative z-10 flex flex-col min-h-full w-full">
                                  {renderPublicBlocks(false)}
                                </div>
                              </div>
                              {renderCartUI(true)}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Scale / Reset button aligned to the bottom-left of the phone hardware */}
                      <button
                        onMouseDown={currentScale === 1.0 ? handleScaleMouseDown : undefined}
                        onClick={currentScale !== 1.0 ? () => setMobileScale(1.0) : undefined}
                        style={{
                          transform: `scale(${1 / currentScale})`,
                          transformOrigin: 'bottom left',
                          transition: isDraggingScale ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                        className={`absolute -bottom-3 -left-3 z-50 p-3 rounded-full border border-zinc-700/80 shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all flex items-center justify-center cursor-pointer pointer-events-auto bg-zinc-900/95 hover:bg-zinc-800 text-zinc-300 hover:text-white ${
                          currentScale === 1.0 ? 'cursor-ns-resize' : 'cursor-pointer'
                        }`}
                        title={
                          currentScale === 1.0 
                            ? (lang === 'en' ? 'Drag diagonally to top-right to scale down' : 'Потяните по диагонали к правому верхнему углу для уменьшения')
                            : (lang === 'en' ? 'Reset scale (100%)' : 'Сбросить масштаб (100%)')
                        }
                      >
                        {currentScale === 1.0 ? <Minimize2 size={16} /> : <RefreshCcw size={16} />}
                      </button>
                    </div>
                  )}

                    {/* TABLET MOCKUP */}
                    {viewMode === 'tablet' && (
                      <div className="relative">
                        <div className="relative w-[760px] h-[820px] max-w-[95vw] max-h-[90vh] bg-black rounded-[32px] p-3 border-[8px] border-zinc-800/95 shadow-[0_30px_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden">
                          {/* Camera Sensor Pin */}
                          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-950 rounded-full border border-zinc-800/40 z-20" />

                          {/* Theme Toggle for non-synced themes (Tablet) */}
                          {config.mainBg && !config.mainBg.syncThemes && (
                            <button
                              onClick={() => {
                                const nextTheme = config.mainBg.theme === 'dark' ? 'light' : 'dark';
                                updateConfigField('mainBg', { ...config.mainBg, theme: nextTheme });
                              }}
                              className="absolute top-3 right-8 z-30 p-1.5 bg-zinc-900/80 backdrop-blur-md rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer shadow-lg hover:scale-110 active:scale-95"
                              title={lang === 'en' ? 'Toggle Light/Dark' : 'Переключить Светлая/Темная'}
                            >
                              {config.mainBg.theme === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-blue-400" />}
                            </button>
                          )}

                          {/* Render Page inside Tablet Mockup */}
                          {(() => {
                            const isDarkText = editorBgInfo.className.includes('text-white');
                            const textColorClass = isDarkText ? 'text-white' : 'text-zinc-900';

                            const outerClassName = `w-full h-full rounded-[22px] relative overflow-hidden select-none isolate transform translate-x-0 ${editorBgInfo.className} ${textColorClass}`;
                            const outerStyle = editorBgInfo.style;

                            const innerClassName = `absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-none w-full h-full py-8 px-4 flex flex-col items-center z-10 font-[system-ui] transition-all duration-500`;
                            const innerStyle = {};

                            return (
                              <div className={outerClassName} style={outerStyle}>
                                {editorBgInfo.innerStyle && (
                                  <div style={editorBgInfo.innerStyle} className="absolute inset-0 bg-cover bg-center pointer-events-none transition-all duration-300" />
                                )}
                                <BackgroundEffects effects={editorBgInfo.effects} scrollOffset={phoneScrollY} />
                                <div 
                                  className={innerClassName} 
                                  style={innerStyle} 
                                  onScroll={(e) => {
                                    setPhoneScrollY(e.currentTarget.scrollTop);
                                  }}
                                >
                                  <div className="relative z-10 flex flex-col min-h-full w-full mx-auto">
                                    {renderPublicBlocks(false)}
                                  </div>
                                </div>
                                {renderCartUI(true)}
                              </div>
                            );
                          })()}
                        </div>

                        {/* Scale / Reset button aligned to the bottom-left of the tablet hardware */}
                        <button
                          onMouseDown={currentScale === 1.0 ? handleScaleMouseDown : undefined}
                          onClick={currentScale !== 1.0 ? () => setTabletScale(1.0) : undefined}
                          style={{
                            transform: `scale(${1 / currentScale})`,
                            transformOrigin: 'bottom left',
                            transition: isDraggingScale ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                          className={`absolute -bottom-3 -left-3 z-50 p-3 rounded-full border border-zinc-700/80 shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all flex items-center justify-center cursor-pointer pointer-events-auto bg-zinc-900/95 hover:bg-zinc-800 text-zinc-300 hover:text-white ${
                            currentScale === 1.0 ? 'cursor-ns-resize' : 'cursor-pointer'
                          }`}
                          title={
                            currentScale === 1.0 
                              ? (lang === 'en' ? 'Drag diagonally to top-right to scale down' : 'Потяните по диагонали к правому верхнему углу для уменьшения')
                              : (lang === 'en' ? 'Reset scale (100%)' : 'Сбросить масштаб (100%)')
                          }
                        >
                          {currentScale === 1.0 ? <Minimize2 size={16} /> : <RefreshCcw size={16} />}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

          </div>
        )}


        {/* LANDING TAB */}
        {(!isAuthenticated || activeTab === 'landing') && (
          <Landing 
            lang={lang} 
            isAuthenticated={isAuthenticated} 
            setIsAuthModalOpen={setIsAuthModalOpen} 
            setActiveTab={setActiveTab} 
          />
        )}
        {/* PROJECTS TAB */}
        {isAuthenticated && activeTab === 'projects' && (
          <ProjectsTab lang={lang} />
        )}

        {/* DASHBOARD TAB */}
        {isAuthenticated && activeTab === 'dashboard' && (
          <DashboardTab lang={lang} />
        )}

        {/* SETTINGS TAB */}
        {isAuthenticated && activeTab === 'settings' && (
          <SettingsTab lang={lang} />
        )}
          </main>
        </div>
      ) : (
        <main className="flex-1 flex flex-col">
          {/* 3. SIMULATED PUBLIC VIEW STANDALONE SCREEN (PREVIEW TAB) */}
          {activeTab === 'preview' && (() => {
          const bgInfo = getMainBgStyle(config.mainBg, windowScrollY);
          const isDarkTheme = config.mainBg?.theme === 'dark';
          const containerWidthClass = 'max-w-[800px] w-full';

          const isDarkText = bgInfo.className.includes('text-white');
          const textColorClass = isDarkText ? 'text-white' : 'text-zinc-900';

          const outerClassName = `fixed inset-0 overflow-hidden transition-all duration-300 animate-fade-in ${bgInfo.className} ${textColorClass}`;
          const outerStyle = bgInfo.style;

          const innerClassName = `absolute inset-0 overflow-y-auto overflow-x-hidden flex flex-col items-center py-10 pb-32 z-10 font-[system-ui] transition-all duration-500`;
          const innerStyle = {};

          return (
            <div id="public_page_root" className={outerClassName} style={outerStyle}>
              {bgInfo.innerStyle ? (
                <div style={bgInfo.innerStyle} className="absolute inset-0 bg-cover bg-center pointer-events-none transition-all duration-300" />
              ) : (
                <div className="absolute inset-0 z-0" style={bgInfo.style} />
              )}
              <BackgroundEffects effects={bgInfo.effects} isMenuOpen={isPreviewMenuOpen} scrollOffset={windowScrollY} />
              
              {/* Static non-scrolling side vignettes for large screens to focus on the simulated canvas */}
              <div className="absolute inset-0 pointer-events-none z-[15] overflow-hidden">
                <div 
                  className="w-full h-full mx-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] relative flex flex-col items-center px-4"
                  style={{
                    maxWidth: 
                      viewMode === 'mobile' ? '360px' : 
                      viewMode === 'tablet' ? '720px' : 
                      '720px',
                  }}
                >
                  <div 
                    className="hidden lg:block absolute inset-y-0 right-full w-[4000px] pointer-events-none"
                    style={{
                      backgroundImage: viewMode === 'desktop'
                        ? 'linear-gradient(to left, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 600px, rgba(0,0,0,1) 100%)'
                        : 'linear-gradient(to left, rgba(0,0,0,0.5) 0%, rgba(0,0,0,1) 300px, rgba(0,0,0,1) 100%)'
                    }}
                  />
                  <div 
                    className="hidden lg:block absolute inset-y-0 left-full w-[4000px] pointer-events-none"
                    style={{
                      backgroundImage: viewMode === 'desktop'
                        ? 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 600px, rgba(0,0,0,1) 100%)'
                        : 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,1) 300px, rgba(0,0,0,1) 100%)'
                    }}
                  />
                </div>
              </div>
              
              <div 
                className={innerClassName} 
                style={innerStyle} 
                onScroll={(e) => {
                  setWindowScrollY(e.currentTarget.scrollTop);
                }}
              >
                {/* THEME NAME OVERLAY */}
                <AnimatePresence mode="wait">
                  {activeThemeName && (
                    <motion.div
                      key={activeThemeName}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 0.6, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="fixed top-8 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full border border-zinc-500/20 bg-zinc-500/10 backdrop-blur-sm pointer-events-none select-none z-[100]"
                    >
                      <span className={`text-[11px] font-bold tracking-[0.2em] uppercase ${isDarkTheme ? 'text-white' : 'text-zinc-900'}`}>
                        {activeThemeName}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div 
                  className="w-full mx-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] relative flex flex-col items-center px-4"
                  style={{
                    maxWidth: 
                      viewMode === 'mobile' ? '360px' : 
                      viewMode === 'tablet' ? '720px' : 
                      '720px',
                  }}
                >
                  {/* Output Frame elements strictly block configured */}
                  {renderPublicBlocks(false)}

                  {renderCartUI()}

                  {/* Static tiny trademark footer */}
                  <footer className={`mt-14 text-center border-t pt-6 text-[10px] font-mono tracking-wider w-full ${
                    isDarkTheme ? 'border-zinc-800/50 text-zinc-500' : 'border-zinc-200 text-zinc-400'
                  }`}>
                    This digital card is hosted securely. Connected with WhatsApp directly to order menu.
                  </footer>
                </div>
              </div>

              {/* BOTTOM CONTROL PILL FOR RESPONSIVE PREVIEW & BACK TO EDITOR */}
              <div className="fixed bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-zinc-950/95 via-zinc-950/60 to-transparent backdrop-blur-[1px] pointer-events-none z-[240]" />

              <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[250] select-none">
                <PublicPreviewControls 
                  activeDevice={viewMode}
                  onDeviceChange={setViewMode}
                  onBack={() => setActiveTab('editor')}
                  lang={lang}
                  onNextTheme={handleNextTheme}
                  onPrevTheme={handlePrevTheme}
                  canGoNext={(toggleBack || toggleCards) && (toggleDice || activeThemeIndex < publicThemes.length - 1)}
                  canGoPrev={activeThemeIndex !== 0}
                  toggleBack={toggleBack}
                  toggleCards={toggleCards}
                  toggleDice={toggleDice}
                  onToggleBack={() => setToggleBack(!toggleBack)}
                  onToggleCards={() => setToggleCards(!toggleCards)}
                  onToggleDice={() => setToggleDice(!toggleDice)}
                  isLiked={isThemeLiked}
                  onLike={handleLike}
                  showLike={activeThemeIndex !== 0}
                  onMenuToggle={setIsPreviewMenuOpen}
                  onResetTheme={() => applyThemeAtIndex(0)}
                  onShowApplyConfirm={() => setShowApplyConfirm(true)}
                  activeIndex={activeThemeIndex}
                />
              </div>

              {/* APPLY CONFIRMATION DIALOG */}
              <AnimatePresence>
                {showApplyConfirm && (
                  <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full shadow-2xl"
                    >
                      <h3 className="text-xl font-semibold text-white mb-4">
                        {lang === 'en' ? 'Apply this style?' : 'Применить этот стиль?'}
                      </h3>
                      <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                        {lang === 'en' ? (
                          <>
                            This will update the design of your{' '}
                            {toggleBack && toggleCards ? (
                              <>
                                <span className="text-orange-500 font-medium">background</span> and{' '}
                                <span className="text-orange-500 font-medium">cards</span>
                              </>
                            ) : toggleBack ? (
                              <span className="text-orange-500 font-medium">background</span>
                            ) : toggleCards ? (
                              <span className="text-orange-500 font-medium">cards</span>
                            ) : (
                              'elements'
                            )}{' '}
                            permanently.
                          </>
                        ) : (
                          <>
                            Это навсегда обновит дизайн вашего{' '}
                            {toggleBack && toggleCards ? (
                              <>
                                <span className="text-orange-500 font-medium">фона</span> и{' '}
                                <span className="text-orange-500 font-medium">карточек</span>
                              </>
                            ) : toggleBack ? (
                              <span className="text-orange-500 font-medium">фона</span>
                            ) : toggleCards ? (
                              <span className="text-orange-500 font-medium">карточек товаров</span>
                            ) : (
                              'дизайна'
                            )}
                            .
                          </>
                        )}
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowApplyConfirm(false)}
                          className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
                        >
                          {lang === 'en' ? 'Cancel' : 'Отмена'}
                        </button>
                        <button
                          onClick={handleApplyTheme}
                          className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors"
                        >
                          {lang === 'en' ? 'Apply' : 'Применить'}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          );
        })()}





       </main>
      )}

       {/* NEW PROJECT MODAL */}
       {showNewProjectModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Backdrop blur */}
           <div 
             className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity"
             onClick={() => setShowNewProjectModal(false)}
           />
           
           {/* Modal Dialog Content */}
           <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-full max-w-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]">
             {/* Header */}
             <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
               <div className="flex items-center gap-3">
                 <h2 className="text-lg font-bold tracking-tight text-zinc-900">
                   {lang === 'en' ? 'Create New Project' : 'Создание нового проекта'}
                 </h2>
                 <span className="bg-zinc-100 text-zinc-500 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">
                   {lang === 'en' ? `Step ${newProjectStep} of 4` : `Шаг ${newProjectStep} из 4`}
                 </span>
               </div>
               <button onClick={() => setShowNewProjectModal(false)} className="text-zinc-400 hover:text-zinc-900 p-1 rounded transition-colors">
                 <X size={18} />
               </button>
             </div>

             {/* Body */}
             <div className="flex-1 overflow-y-auto p-6">
               {newProjectStep === 1 && (
                 <div className="space-y-6">
                   <h3 className="font-semibold text-zinc-900">{lang === 'en' ? 'Select Project Type' : 'Выберите тип проекта'}</h3>
                   <div className="grid grid-cols-2 gap-4">
                     {[
                       { id: 'business', label: lang === 'en' ? 'Business Card' : 'Визитка', icon: <User size={24} /> },
                       { id: 'restaurant', label: lang === 'en' ? 'Restaurant / Cafe' : 'Ресторан / Кафе', icon: <Coffee size={24} /> },
                       { id: 'catalog', label: lang === 'en' ? 'Product Catalog' : 'Каталог продуктов', icon: <ShoppingCart size={24} /> }
                     ].map(t => (
                       <button
                         key={t.id}
                         onClick={() => setNewProjectData({ ...newProjectData, type: t.id })}
                         className={`p-6 border-2 rounded-xl flex flex-col items-center justify-center gap-3 transition-all ${
                           newProjectData.type === t.id ? 'border-zinc-900 bg-zinc-50 shadow-sm text-zinc-900' : 'border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:bg-zinc-50'
                         }`}
                       >
                         {t.icon}
                         <span className="font-semibold">{t.label}</span>
                       </button>
                     ))}
                   </div>
                 </div>
               )}

               {newProjectStep === 2 && (
                 <div className="space-y-6">
                   <h3 className="font-semibold text-zinc-900">{lang === 'en' ? 'Project Details' : 'Детали проекта'}</h3>
                   <div className="space-y-4">
                     <div>
                       <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">{lang === 'en' ? 'Project Title' : 'Название (заголовок)'}</label>
                       <input 
                         type="text" 
                         value={newProjectData.title}
                         onChange={(e) => setNewProjectData({ ...newProjectData, title: e.target.value })}
                         className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-shadow"
                         placeholder={lang === 'en' ? 'e.g. My Awesome Cafe' : 'Например: Мое классное кафе'}
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">{lang === 'en' ? 'Subtitle / Description' : 'Подзаголовок / Описание'}</label>
                       <textarea 
                         value={newProjectData.subtitle}
                         onChange={(e) => setNewProjectData({ ...newProjectData, subtitle: e.target.value })}
                         className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-shadow h-24 resize-none"
                         placeholder={lang === 'en' ? 'Brief description...' : 'Краткое описание...'}
                       />
                     </div>
                   </div>
                 </div>
               )}

               {newProjectStep === 3 && (
                 <div className="space-y-6 flex flex-col items-center">
                   <h3 className="font-semibold text-zinc-900 self-start">{lang === 'en' ? 'Upload Logo / Avatar' : 'Загрузите логотип или аватар'}</h3>
                   <div className="w-40 h-40 border-2 border-dashed border-zinc-300 rounded-full flex items-center justify-center bg-zinc-50 overflow-hidden relative group cursor-pointer mt-4">
                     {newProjectData.image ? (
                       <img src={newProjectData.image} className="w-full h-full object-cover" alt="Avatar" />
                     ) : (
                       <div className="text-zinc-400 flex flex-col items-center">
                         <Upload size={32} />
                         <span className="text-xs font-medium mt-2">{lang === 'en' ? 'Click to upload' : 'Нажмите для загрузки'}</span>
                       </div>
                     )}
                     <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              if (evt.target?.result) {
                                setNewProjectData({ ...newProjectData, image: evt.target.result.toString() });
                              }
                            };
                            reader.readAsDataURL(e.target.files[0]);
                          }
                        }}
                     />
                   </div>
                 </div>
               )}

               {newProjectStep === 4 && (
                 <div className="space-y-8">
                   <div className="space-y-4">
                     <h3 className="font-semibold text-zinc-900">{lang === 'en' ? 'Structure' : 'Структура страницы'}</h3>
                     <div className="grid grid-cols-3 gap-4">
                       {[1, 2, 3].map(struct => (
                         <button
                           key={struct}
                           onClick={() => setNewProjectData({ ...newProjectData, structure: struct })}
                           className={`h-24 border-2 rounded-xl flex items-center justify-center text-zinc-400 font-mono text-sm transition-all ${
                             newProjectData.structure === struct ? 'border-zinc-900 bg-zinc-50 text-zinc-900' : 'border-zinc-200 hover:border-zinc-400'
                           }`}
                         >
                           Layout {struct}
                         </button>
                       ))}
                     </div>
                   </div>

                   <div className="space-y-4 border-t border-zinc-100 pt-6">
                     <h3 className="font-semibold text-zinc-900">{lang === 'en' ? 'Style' : 'Стиль страницы'}</h3>
                     <div className="grid grid-cols-5 gap-3">
                       {[1, 2, 3, 4, 5].map(style => (
                         <button
                           key={style}
                           onClick={() => setNewProjectData({ ...newProjectData, style })}
                           className={`aspect-square border-2 rounded-xl flex items-center justify-center text-zinc-400 font-mono text-xs transition-all ${
                             newProjectData.style === style ? 'border-zinc-900 bg-zinc-50 text-zinc-900' : 'border-zinc-200 hover:border-zinc-400'
                           }`}
                         >
                           Theme {style}
                         </button>
                       ))}
                     </div>
                   </div>
                 </div>
               )}
             </div>

             {/* Footer Controls */}
             <div className="bg-zinc-50 px-6 py-4 border-t border-zinc-100 flex items-center justify-between">
               <div className="flex gap-2">
                 <button
                   disabled={newProjectStep === 1}
                   onClick={() => setNewProjectStep(s => Math.max(1, s - 1))}
                   className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                     newProjectStep === 1 ? 'text-zinc-300 cursor-not-allowed' : 'text-zinc-600 hover:bg-zinc-200 bg-zinc-100'
                   }`}
                 >
                   {lang === 'en' ? 'Back' : 'Назад'}
                 </button>
                 <button
                   disabled={newProjectStep === 4}
                   onClick={() => setNewProjectStep(s => Math.min(4, s + 1))}
                   className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                     newProjectStep === 4 ? 'text-zinc-300 cursor-not-allowed hidden' : 'text-zinc-900 hover:bg-zinc-200 bg-zinc-100'
                   }`}
                 >
                   {lang === 'en' ? 'Next' : 'Вперед'}
                 </button>
               </div>
               <button
                 onClick={() => {
                   // Create project
                   const newProj = {
                     id: `proj_${Date.now()}`,
                     title: newProjectData.title || (lang === 'en' ? 'My New Project' : 'Мой новый проект'),
                     subtitle: newProjectData.subtitle || '',
                     type: newProjectData.type || 'business',
                     image: newProjectData.image || '',
                     structure: newProjectData.structure,
                     style: newProjectData.style,
                     createdAt: new Date().toISOString()
                   };
                   setMyProjects([...myProjects, newProj]);
                   setShowNewProjectModal(false);
                 }}
                 className="px-6 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
               >
                 {lang === 'en' ? 'Create Project' : 'Создать проект'}
               </button>
             </div>
           </div>
         </div>
       )}
       
       {/* PUBLISH SETTINGS DIALOG MODAL */}
       {showPublishModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Backdrop blur */}
           <div 
             className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity"
             onClick={() => setShowPublishModal(false)}
           />
           
           {/* Modal Container */}
           <div className="relative bg-zinc-900 text-white rounded-2xl border border-zinc-800 p-6 max-w-sm w-full shadow-2xl animate-slide-up space-y-5">
             <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
               <h3 className="font-bold text-xs tracking-tight text-white flex items-center gap-2">
                 <Settings size={15} className="text-zinc-400" />
                 <span>{TRANSLATIONS[lang].publishSettings}</span>
               </h3>
               <button
                 onClick={() => setShowPublishModal(false)}
                 className="text-zinc-500 hover:text-white transition-colors text-xs"
               >
                 ✕ Close
               </button>
             </div>

             <div className="space-y-4 text-left">
               {/* Starter Template Selector */}
               <div>
                 <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-2">
                   {TRANSLATIONS[lang].templateLabel}
                 </label>
                 <div className="flex flex-col gap-1.5">
                   {(['business', 'restaurant', 'catalog'] as const).map((type) => (
                     <button
                       type="button"
                       key={type}
                       onClick={() => {
                         if (templateType !== type) {
                           setTemplateType(type);
                           setSelectedBlockId(null);
                           showToast(lang === 'en' ? `Loaded ${type} preset` : `Загружен шаблон: ${type}`);
                         }
                       }}
                       className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                         templateType === type 
                           ? 'bg-white text-zinc-950 shadow-md font-bold' 
                           : 'bg-zinc-800 text-zinc-350 hover:bg-zinc-750'
                       }`}
                     >
                       {type === 'business' && '💳 Business Card / Bio'}
                       {type === 'restaurant' && '🍛 Restaurant Menu'}
                       {type === 'catalog' && '🛍️ Product Catalog'}
                     </button>
                   ))}
                 </div>
               </div>

               {/* Typography theme presets */}
               <div>
                 <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-2">
                   {TRANSLATIONS[lang].themeLabel}
                 </label>
                 <div className="flex flex-col gap-1.5">
                   {(['modern', 'serif', 'mono'] as const).map((themeVal) => (
                     <button
                       type="button"
                       key={themeVal}
                       onClick={() => updateConfigField('theme', themeVal)}
                       className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                         config.theme === themeVal 
                           ? 'bg-white text-zinc-950 shadow-md font-bold' 
                           : 'bg-zinc-800 text-zinc-350 hover:bg-zinc-750'
                       }`}
                     >
                       {themeVal === 'modern' && '✦ Modern Sans (Inter)'}
                       {themeVal === 'serif' && '✦ Editorial Serif (Merri)'}
                       {themeVal === 'mono' && '✦ Tech Mono (Fira Code)'}
                     </button>
                   ))}
                 </div>
               </div>

               {/* Checkout order destination settings */}
               <div className="border-t border-zinc-800 pt-3">
                 <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-2">
                   {TRANSLATIONS[lang].destinationLabel}
                 </label>
                 <div className="grid grid-cols-12 gap-2">
                   <select
                     value={config.orderDestinationType}
                     onChange={(e) => updateConfigField('orderDestinationType', e.target.value as 'whatsapp' | 'telegram')}
                     className="col-span-4 bg-zinc-800 hover:bg-zinc-755 border border-zinc-700 text-white text-xs rounded p-2 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                   >
                     <option value="whatsapp">WhatsApp</option>
                     <option value="telegram">Telegram</option>
                   </select>

                   <input
                     type="text"
                     value={config.orderDestinationValue}
                     onChange={(e) => updateConfigField('orderDestinationValue', e.target.value)}
                     placeholder={config.orderDestinationType === 'whatsapp' ? TRANSLATIONS[lang].phonePlaceholder : TRANSLATIONS[lang].telegramPlaceholder}
                     className="col-span-8 bg-zinc-800 text-white placeholder-zinc-500 text-xs rounded p-2 border border-transparent focus:border-zinc-700 focus:outline-none"
                   />
                 </div>
                 <p className="text-[10px] text-zinc-500 mt-2 font-mono leading-relaxed">
                   {TRANSLATIONS[lang].destinationHelp}
                 </p>
               </div>
             </div>

             <div className="flex items-center gap-2 pt-2">
               <button
                 type="button"
                 onClick={handleResetTemplate}
                 className="flex-1 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-red-400 hover:text-red-300 font-mono text-[9px] uppercase font-bold transition-all focus:outline-none flex items-center justify-center gap-1"
                 title="Reset Template Contents"
               >
                 <RefreshCcw size={10} />
                 <span>Reset Layout</span>
               </button>
               
               <button
                 type="button"
                 onClick={() => {
                   setShowPublishModal(false);
                   showToast(lang === 'en' ? 'Settings saved and synced!' : 'Настройки сохранены!');
                 }}
                 className="flex-1 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs transition-all focus:outline-none flex items-center justify-center"
               >
                 Done
               </button>
             </div>
           </div>
         </div>
       )}

       {/* DESIGN TEMPLATES MODAL */}
       {templateToApply && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div 
             className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity cursor-pointer"
             onClick={() => setTemplateToApply(null)}
           />
            <div className="relative bg-zinc-900 border border-zinc-850 text-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in space-y-6 select-none text-left z-10">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                  <Wand2 size={16} className="text-purple-400" />
                  <span>{lang === 'en' ? 'Apply Design Template' : 'Применить шаблон дизайна'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setTemplateToApply(null)}
                  className="text-zinc-500 hover:text-white transition-colors text-xs"
                >
                  ✕ Close
                </button>
              </div>
              {renderTemplateChoiceDialogContent()}
            </div>
            <div className="hidden">
             <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
               <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                 <Wand2 size={16} className="text-zinc-400" />
                 <span>{lang === 'en' ? 'Apply Design Template' : 'Применить шаблон дизайна'}</span>
               </h3>
               <button
                 onClick={() => setTemplateToApply(null)}
                 className="text-zinc-500 hover:text-white transition-colors text-xs"
               >
                 ✕ Close
               </button>
             </div>

             <div className="grid grid-cols-2 gap-3">
               {/* DEFAULT TEMPLATE */}
               <button
                 onClick={() => {
                   updateConfigField('designTemplate', 'none');
                   showToast(lang === 'en' ? 'Default template applied' : 'Стандартный шаблон применен');
                 }}
                 className={`flex flex-col items-start gap-4 p-4 rounded-xl border transition-all text-left group ${
                   config.designTemplate === 'none' || !config.designTemplate
                     ? 'border-white bg-zinc-800/80' 
                     : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600 hover:bg-zinc-900'
                 }`}
               >
                 <div className={`p-2 rounded-lg shrink-0 ${
                   config.designTemplate === 'none' || !config.designTemplate ? 'bg-white text-zinc-900' : 'bg-zinc-800 text-zinc-400'
                 }`}>
                   <Layers size={20} />
                 </div>
                 <div>
                   <h4 className="font-bold text-[13px] text-white">Default Sandbox</h4>
                   <p className="text-[10px] text-zinc-400 mt-1 leading-tight">Standard block editor layout driven purely by your custom configuration.</p>
                 </div>
               </button>

               {/* CHROMA LAB TEMPLATE */}
               <button
                 onClick={() => {
                   updateConfigField('designTemplate', 'chroma-lab');
                   showToast(lang === 'en' ? 'Chroma Lab applied' : 'Применен шаблон Chroma Lab');
                 }}
                 className={`flex flex-col items-start gap-4 p-4 rounded-xl border transition-all text-left relative overflow-hidden group ${
                   config.designTemplate === 'chroma-lab'
                     ? 'border-purple-400 bg-purple-900/20' 
                     : 'border-zinc-800 bg-zinc-950 hover:border-purple-500/50 hover:bg-purple-950/20'
                 }`}
               >
                 {/* Decorator background */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-transparent to-pink-500/10 pointer-events-none" />
                 
                 <div className={`relative p-2 rounded-lg shrink-0 ${
                   config.designTemplate === 'chroma-lab' ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-zinc-800 text-zinc-400 group-hover:text-purple-400'
                 }`}>
                   <Sparkle size={20} />
                 </div>
                 <div className="relative z-10">
                   <h4 className="font-bold text-[13px] text-white">Chroma Lab</h4>
                   <p className="text-[10px] text-zinc-400 mt-1 leading-tight">Apply glass-prism effects to blocks over a dynamic orbital mesh background.</p>
                 </div>
               </button>
             </div>
          </div>
        </div>
      )}
      {/* PROJECT DELETE CONFIRMATION MODAL */}
      {projectToDeleteIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setProjectToDeleteIndex(null)}
          />
          <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-full max-w-sm overflow-hidden relative z-10 flex flex-col p-6 animate-fade-in">
            <h3 className="text-lg font-bold text-zinc-900 mb-2">
              {lang === 'en' ? 'Delete Project' : 'Удалить проект'}
            </h3>
            <p className="text-sm text-zinc-500 mb-6">
              {lang === 'en' 
                ? 'Are you sure you want to delete this project? This action cannot be undone.' 
                : 'Вы уверены, что хотите удалить этот проект? Это действие нельзя отменить.'}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setProjectToDeleteIndex(null)}
                className="px-4 py-2 text-sm font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                {lang === 'en' ? 'Cancel' : 'Отмена'}
              </button>
              <button
                onClick={() => {
                  setMyProjects(myProjects.filter((_, index) => index !== projectToDeleteIndex));
                  setProjectToDeleteIndex(null);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
              >
                {lang === 'en' ? 'Delete' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}

      <GlobalGlassFilters blocks={config.blocks} />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} lang={lang} />
    </div>
  );
}