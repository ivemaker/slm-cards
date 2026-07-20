/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Block, ProjectConfig } from './types';

// Premium minimalist, lightweight inline SVG placeholders which work offline and look high-end!
export const PLACEHOLDERS = {
  avatarBusiness: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" fill="%23f4f4f5"/><circle cx="50" cy="40" r="20" fill="%23a1a1aa"/><path d="M20 85 C20 65, 80 65, 80 85" stroke="%23a1a1aa" stroke-width="8" stroke-linecap="round"/></svg>`,
  avatarRestaurant: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" fill="%23faf7f2"/><circle cx="50" cy="50" r="30" stroke="%23d97706" stroke-width="4"/><path d="M42 35 L42 55 M50 30 L50 60 M58 35 L58 55" stroke="%23d97706" stroke-width="3" stroke-linecap="round"/><path d="M35 60 C35 75, 65 75, 65 60 Z" fill="%23d97706"/></svg>`,
  avatarCatalog: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" fill="%23fdfdfd"/><path d="M30 40 L30 80 H70 L70 40 M40 45 V30 C40 20, 60 20, 60 30 V45" stroke="%2318181b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  
  ramen: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" fill="%23FAFaf9"/><circle cx="60" cy="60" r="45" fill="%23FEF2F2" stroke="%23EF4444" stroke-width="3"/><path d="M25 60 H95" stroke="%23F59E0B" stroke-width="4"/><path d="M40 60 C40 85, 80 85, 80 60" fill="%23EF4444"/><circle cx="45" cy="45" r="8" fill="%23FBBF24"/><circle cx="75" cy="45" r="6" fill="%2310B981"/><path d="M30 20 L55 58 M40 18 L65 58" stroke="%2378350F" stroke-width="4" stroke-linecap="round"/></svg>`,
  coffee: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" fill="%23FAFaf9"/><path d="M35 40 H75 V80 C75 90, 35 90, 35 80 Z" fill="%2378350F"/><path d="M75 50 H85 C90 50, 90 70, 85 70 H75" stroke="%2378350F" stroke-width="5" stroke-linecap="round"/><path d="M45 25 Q50 15, 45 10 M55 25 Q60 15, 55 10 M65 25 Q70 15, 65 10" stroke="%23A1A1AA" stroke-width="3" stroke-linecap="round"/></svg>`,
  gourmetBurger: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" fill="%23FAFaf9"/><path d="M30 55 C30 35, 90 35, 90 55 H30 Z" fill="%23F59E0B"/><rect x="25" y="60" width="70" height="8" rx="4" fill="%23EF4444"/><rect x="28" y="70" width="64" height="6" rx="3" fill="%2310B981"/><path d="M32 78 C32 88, 88 88, 88 78 Z" fill="%23D97706"/></svg>`,
  
  bag: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" fill="%23fafafa"/><path d="M35 45 L40 95 H80 L85 45 Z" fill="%2318181b"/><path d="M50 45 V35 C50 25, 70 25, 70 35 V45" stroke="%23a1a1aa" stroke-width="4" stroke-linecap="round"/></svg>`,
  watch: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" fill="%23fafafa"/><rect x="52" y="20" width="16" height="80" rx="4" fill="%2371717a"/><circle cx="60" cy="60" r="22" fill="%2318181b" stroke="%23f4f4f5" stroke-width="3"/><path d="M60 46 V60 H70" stroke="%2310B981" stroke-width="2" stroke-linecap="round"/></svg>`,
  shoes: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" fill="%23fafafa"/><path d="M25 75 L45 50 L85 55 L95 75 Z" fill="%233b82f6"/><path d="M15 75 H95 L95 82 H35 Z" fill="%2318181b"/><path d="M45 50 Q55 45, 60 40 L65 52" stroke="%23ef4444" stroke-width="3" stroke-linecap="round"/></svg>`,
};

export const BUSINESS_TPL_BLOCKS: Block[] = [
  {
    id: 'b1',
    type: 'profile',
    padding: 'medium',
    bgColor: 'bg-white border border-gray-100',
    textColor: 'text-zinc-900',
    borderRadius: 'lg',
    borderColor: 'border-zinc-100',
    borderWidth: 'none',
    profileContent: {
      avatar: PLACEHOLDERS.avatarBusiness,
      name: 'Sarah Jenkins',
      bio: 'Lead UX Designer & Brand Architect. Creating premium digital design systems for fast-growing global startups.',
    }
  },
  {
    id: 'b2',
    type: 'socials',
    padding: 'small',
    bgColor: 'bg-zinc-50 border border-transparent',
    textColor: 'text-zinc-900',
    borderRadius: 'full',
    borderColor: 'border-transparent',
    borderWidth: 'none',
    socialsContent: {
      links: [
        { platform: 'instagram', url: 'https://instagram.com/sarahdesign' },
        { platform: 'twitter', url: 'https://twitter.com/sarahdev' },
        { platform: 'linkedin', url: 'https://linkedin.com/in/sarahjenkins' },
        { platform: 'email', url: 'mailto:sarah@studio.com' },
      ]
    }
  },
  {
    id: 'b3',
    type: 'text',
    padding: 'medium',
    bgColor: 'bg-white border border-zinc-100',
    textColor: 'text-zinc-900',
    borderRadius: 'md',
    borderColor: 'border-zinc-100',
    borderWidth: 'thin',
    textContent: {
      title: 'Design Philosophy',
      body: 'I believe true beauty lies in the careful restriction of layout options. Good software should feel spatial, expensive, and completely distraction-free.'
    }
  },
  {
    id: 'b4',
    type: 'button',
    padding: 'medium',
    bgColor: 'bg-zinc-900 border border-transparent',
    textColor: 'text-white',
    borderRadius: 'lg',
    borderColor: 'border-zinc-900',
    borderWidth: 'none',
    buttonContent: {
      label: 'Book 1:1 Design Session',
      url: 'https://calendly.com/sarah-jenkins',
      variant: 'primary'
    }
  },
  {
    id: 'b5',
    type: 'spacer',
    padding: 'small',
    bgColor: 'bg-transparent border-transparent',
    textColor: 'text-transparent',
    borderRadius: 'none',
    borderColor: 'border-transparent',
    borderWidth: 'none',
    spacerContent: {
      height: 'small'
    }
  }
];

export const RESTAURANT_TPL_BLOCKS: Block[] = [
  {
    id: 'r1',
    type: 'profile',
    padding: 'medium',
    bgColor: 'bg-stone-50 border border-stone-200/65',
    textColor: 'text-stone-950',
    borderRadius: 'lg',
    borderColor: 'border-stone-200/60',
    borderWidth: 'thin',
    profileContent: {
      avatar: PLACEHOLDERS.avatarRestaurant,
      name: 'Kobe Noodle Bar',
      bio: 'Authentic handmade noodles, rich complex broths, and fresh locally sourced ingredients. Master-crafted in small micro-batches everyday.',
    }
  },
  {
    id: 'r2',
    type: 'category-header',
    padding: 'small',
    bgColor: 'bg-transparent border-transparent',
    textColor: 'text-stone-900 font-serif font-bold text-lg',
    borderRadius: 'none',
    borderColor: 'border-transparent',
    borderWidth: 'none',
    categoryHeaderContent: {
      title: '🍜 Signature Ramen Bowls'
    }
  },
  {
    id: 'r3',
    type: 'dish',
    padding: 'medium',
    bgColor: 'bg-white border border-stone-100',
    textColor: 'text-stone-900',
    borderRadius: 'lg',
    borderColor: 'border-stone-100',
    borderWidth: 'thin',
    dishContent: {
      id: 'dish-1',
      name: 'Фирменный бургер',
      description: 'Сочная котлета из мраморной говядины, хрустящий бекон, чеддер и наш фирменный соус на пышной булочке.',
      price: 16.0,
      weight: '350 г',
      image: '/misty_rainy_forest_1781780284992.jpg',
      images: ['/misty_rainy_forest_1781780284992.jpg']
    }
  },
  {
    id: 'r4',
    type: 'dish',
    padding: 'medium',
    bgColor: 'bg-white border border-stone-100',
    textColor: 'text-stone-900',
    borderRadius: 'lg',
    borderColor: 'border-stone-100',
    borderWidth: 'thin',
    dishContent: {
      id: 'dish-2',
      name: 'Классический Цезарь',
      description: 'Хрустящие листья романо, сочная куриная грудка-гриль, золотистые гренки, тертый пармезан и наш фирменный соус.',
      price: 12.5,
      weight: '250 г',
      image: '/misty_rainy_forest_1781780284992.jpg',
      images: ['/misty_rainy_forest_1781780284992.jpg']
    }
  },
  {
    id: 'r5',
    type: 'category-header',
    padding: 'small',
    bgColor: 'bg-transparent border-transparent',
    textColor: 'text-stone-900 font-serif font-bold text-lg',
    borderRadius: 'none',
    borderColor: 'border-transparent',
    borderWidth: 'none',
    categoryHeaderContent: {
      title: '🍵 Craft Matcha & Drinks'
    }
  },
  {
    id: 'r6',
    type: 'dish',
    padding: 'medium',
    bgColor: 'bg-white border border-stone-100',
    textColor: 'text-stone-900',
    borderRadius: 'lg',
    borderColor: 'border-stone-100',
    borderWidth: 'thin',
    dishContent: {
      id: 'dish-3',
      name: 'Церемониальный Матча-Латте',
      description: 'Органический японский чай матча, взбитый с нежным овсяным молоком и каплей меда диких цветов.',
      price: 6.5,
      weight: '250 мл',
      image: '/misty_rainy_forest_1781780284992.jpg',
      images: ['/misty_rainy_forest_1781780284992.jpg']
    }
  }
];

export const CATALOG_TPL_BLOCKS: Block[] = [
  {
    id: 'c1',
    type: 'profile',
    padding: 'medium',
    bgColor: 'bg-zinc-900 text-white border-transparent',
    textColor: 'text-zinc-50',
    borderRadius: 'lg',
    borderColor: 'border-transparent',
    borderWidth: 'none',
    profileContent: {
      avatar: PLACEHOLDERS.avatarCatalog,
      name: 'NIL Atelier',
      bio: 'Slow luxury curated modern objects. Designed to look timeless, weather with beauty, and last several lifetimes.',
    }
  },
  {
    id: 'c2',
    type: 'category-header',
    padding: 'small',
    bgColor: 'bg-transparent border-transparent',
    textColor: 'text-zinc-900 font-medium tracking-tight',
    borderRadius: 'none',
    borderColor: 'border-transparent',
    borderWidth: 'none',
    categoryHeaderContent: {
      title: 'Selected Objects — Series 01'
    }
  },
  {
    id: 'c3',
    type: 'product',
    padding: 'medium',
    bgColor: 'bg-zinc-50 border border-zinc-100',
    textColor: 'text-zinc-900',
    borderRadius: 'md',
    borderColor: 'border-zinc-100',
    borderWidth: 'thin',
    productContent: {
      id: 'prod-1',
      name: 'Кроссовки Urban Runner',
      description: 'Дышащие кроссовки для бега и повседневной носки с технологией амортизации.',
      price: 110.0,
      oldPrice: 150.0,
      buttonText: 'Купить',
      image: '/misty_rainy_forest_1781780284992.jpg',
      images: ['/misty_rainy_forest_1781780284992.jpg']
    }
  },
  {
    id: 'c4',
    type: 'product',
    padding: 'medium',
    bgColor: 'bg-zinc-50 border border-zinc-100',
    textColor: 'text-zinc-900',
    borderRadius: 'md',
    borderColor: 'border-zinc-100',
    borderWidth: 'thin',
    productContent: {
      id: 'prod-2',
      name: 'Рюкзак Explorer 25L',
      description: 'Влагозащищенный городской рюкзак с отделением для ноутбука и дышащей спинкой.',
      price: 85.0,
      oldPrice: 120.0,
      buttonText: 'Купить',
      image: '/misty_rainy_forest_1781780284992.jpg',
      images: ['/misty_rainy_forest_1781780284992.jpg']
    }
  }
];

export const DEFAULT_CONFIGS: Record<'business' | 'restaurant' | 'catalog', ProjectConfig> = {
  business: {
    username: 'sarahjenkins',
    customDomain: 'design.sarahjenkins.com',
    isCustomDomainActive: true,
    theme: 'modern',
    lang: 'en',
    templateType: 'business',
    orderDestinationType: 'telegram',
    orderDestinationValue: '@sarahjenkins',
    blocks: BUSINESS_TPL_BLOCKS,
    views: 1240,
    clicks: 432,
    conversions: 89,
    mainBg: {
      theme: 'light',
      syncThemes: true,
      lightConfig: {
        fillType: 'color',
        fillColor: '#f4f4f5',
      },
      darkConfig: {
        fillType: 'color',
        fillColor: '#09090b',
      },
    }
  },
  restaurant: {
    username: 'kobenoodles',
    customDomain: 'menu.kobenoodles.jp',
    isCustomDomainActive: false,
    theme: 'serif',
    lang: 'en',
    templateType: 'restaurant',
    orderDestinationType: 'whatsapp',
    orderDestinationValue: '+819012345678',
    blocks: RESTAURANT_TPL_BLOCKS,
    views: 8940,
    clicks: 1950,
    conversions: 341,
    mainBg: {
      theme: 'light',
      syncThemes: true,
      lightConfig: {
        fillType: 'color',
        fillColor: '#FAF8F5',
      },
      darkConfig: {
        fillType: 'color',
        fillColor: '#09090b',
      },
    }
  },
  catalog: {
    username: 'nilatelier',
    customDomain: 'store.nilatelier.co',
    isCustomDomainActive: false,
    theme: 'mono',
    lang: 'en',
    templateType: 'catalog',
    orderDestinationType: 'whatsapp',
    orderDestinationValue: '+15550199',
    blocks: CATALOG_TPL_BLOCKS,
    views: 4320,
    clicks: 812,
    conversions: 154,
    mainBg: {
      theme: 'dark',
      syncThemes: true,
      lightConfig: {
        fillType: 'color',
        fillColor: '#ffffff',
      },
      darkConfig: {
        fillType: 'gradient',
        fillGradientPreset: 'cosmic',
        fillGradientAnimated: true,
      },
    }
  }
};
