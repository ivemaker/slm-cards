import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home,
  Monitor, 
  Tablet, 
  Smartphone, 
  ArrowLeft, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Settings, 
  Layout, 
  Image as ImageIcon, 
  Dices,
  Check
} from 'lucide-react';

interface PublicPreviewControlsProps {
  activeDevice: 'none' | 'tablet' | 'mobile';
  onDeviceChange: (device: 'none' | 'tablet' | 'mobile') => void;
  onBack: () => void;
  lang: 'en' | 'ru';
  
  // Theme navigation
  onNextTheme: () => void;
  onPrevTheme: () => void;
  onResetTheme: () => void;
  onShowApplyConfirm: () => void;
  activeIndex: number;
  toggleBack: boolean;
  toggleCards: boolean;
  canGoNext: boolean;
  canGoPrev: boolean;
  
  // Toggles
  toggleDice: boolean;
  onToggleBack: () => void;
  onToggleCards: () => void;
  onToggleDice: () => void;
  
  // Like
  isLiked: boolean;
  onLike: () => void;
  showLike: boolean;
  onMenuToggle?: (isOpen: boolean) => void;
}

export const PublicPreviewControls: React.FC<PublicPreviewControlsProps> = ({
  activeDevice,
  onDeviceChange,
  onBack,
  lang,
  onNextTheme,
  onPrevTheme,
  canGoNext,
  canGoPrev,
  toggleBack,
  toggleCards,
  toggleDice,
  onToggleBack,
  onToggleCards,
  onToggleDice,
  isLiked,
  onLike,
  showLike,
  onMenuToggle,
  onResetTheme,
  onShowApplyConfirm,
  activeIndex
}) => {
  const [isEyeOpen, setIsEyeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrevMenuOpen, setIsPrevMenuOpen] = useState(false);
  const [isLikeMenuOpen, setIsLikeMenuOpen] = useState(false);

  // Helper to close all menus
  const closeAllMenus = () => {
    setIsEyeOpen(false);
    setIsSettingsOpen(false);
    setIsPrevMenuOpen(false);
    setIsLikeMenuOpen(false);
  };

  const prevMenuItems = [
    { 
      id: 'prev', 
      icon: ChevronLeft, 
      label: lang === 'en' ? 'Previous' : 'Назад', 
      action: onPrevTheme, 
    },
    { 
      id: 'home', 
      icon: Home, 
      label: lang === 'en' ? 'My Design' : 'Мой дизайн', 
      action: onResetTheme, 
    }
  ];

  const eyeMenuItems = [
    { 
      id: 'none', 
      icon: Monitor, 
      label: lang === 'en' ? 'PC View' : 'ПК вид', 
      action: () => onDeviceChange('none'), 
      active: activeDevice === 'none' 
    },
    { 
      id: 'tablet', 
      icon: Tablet, 
      label: lang === 'en' ? 'Tablet View' : 'Планшет', 
      action: () => onDeviceChange('tablet'), 
      active: activeDevice === 'tablet' 
    },
    { 
      id: 'mobile', 
      icon: Smartphone, 
      label: lang === 'en' ? 'Mobile View' : 'Мобильный вид', 
      action: () => onDeviceChange('mobile'), 
      active: activeDevice === 'mobile' 
    },
    { 
      id: 'back', 
      icon: ArrowLeft, 
      label: lang === 'en' ? 'Back to Editor' : 'В редактор', 
      action: onBack, 
      active: false,
      isDanger: true
    }
  ];

  const likeMenuItems = [
    {
      id: 'like',
      icon: Heart,
      label: isLiked ? (lang === 'en' ? 'Unlike' : 'Убрать лайк') : (lang === 'en' ? 'Like' : 'Лайк'),
      action: onLike,
      active: isLiked
    },
    {
      id: 'apply',
      icon: Check,
      label: lang === 'en' ? 'Apply to Design' : 'Применить к дизайну',
      action: onShowApplyConfirm,
      active: false,
      disabled: !toggleBack && !toggleCards
    }
  ];

  const settingsMenuItems = [
    {
      id: 'back',
      icon: ImageIcon,
      label: lang === 'en' ? 'Background' : 'Фон',
      action: onToggleBack,
      active: toggleBack
    },
    {
      id: 'cards',
      icon: Layout,
      label: lang === 'en' ? 'Cards' : 'Плашки',
      action: onToggleCards,
      active: toggleCards
    }
  ];

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSmallScreen = windowWidth < 640;
  const radius = isSmallScreen ? 54 : 70;
  const fanBtnClass = isSmallScreen ? 'w-9 h-9' : 'w-11 h-11';
  const fanIconSize = isSmallScreen ? 15 : 19;

  return (
    <div className="flex items-center gap-3 sm:gap-6 md:gap-12 select-none will-change-transform">
        {/* PREV ARROW WITH CONDITIONAL FAN MENU */}
        <div className="relative">
          <AnimatePresence>
            {isPrevMenuOpen && activeIndex > 1 && (
              <div className="absolute inset-0 pointer-events-none">
                {prevMenuItems.map((item, index) => {
                  const angle = 90 - (index * 45);
                  const radian = (angle * Math.PI) / 180;
                  const x = Math.cos(radian) * radius;
                  const y = -Math.sin(radian) * radius;

                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                      animate={{ opacity: 1, x, y, scale: 1 }}
                      exit={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 800, damping: 35, delay: index * 0.01 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        item.action();
                        setIsPrevMenuOpen(false);
                      }}
                      className={`pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${fanBtnClass} rounded-full flex items-center justify-center shadow-xl border bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-900 transition-all group will-change-transform`}
                    >
                      <item.icon size={fanIconSize} />
                      <div className="absolute bottom-full mb-3 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap border border-zinc-800 shadow-2xl transition-opacity">
                        {item.label}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={canGoPrev ? { scale: 1.1, x: -5 } : {}}
            whileTap={canGoPrev ? { scale: 0.9 } : {}}
            onClick={() => {
              if (!canGoPrev) return;
              if (activeIndex === 1) {
                closeAllMenus();
                onPrevTheme();
              } else {
                const nextState = !isPrevMenuOpen;
                closeAllMenus();
                setIsPrevMenuOpen(nextState);
                onMenuToggle?.(nextState);
              }
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 will-change-transform ${
              !canGoPrev 
                ? 'opacity-0 pointer-events-none' 
                : isPrevMenuOpen 
                  ? 'bg-white text-zinc-900 border-white'
                  : 'bg-zinc-950 text-white border-zinc-700/50 hover:bg-zinc-900'
            }`}
          >
            {isPrevMenuOpen ? <X size={20} /> : <ChevronLeft size={24} />}
          </motion.button>
        </div>

        {/* LIKE BUTTON WITH FAN MENU */}
        <div className="relative">
          <AnimatePresence>
            {isLikeMenuOpen && (
              <div className="absolute inset-0 pointer-events-none">
                {likeMenuItems.map((item, index) => {
                  const angle = 90 + (index === 0 ? 30 : -30);
                  const radian = (angle * Math.PI) / 180;
                  const x = Math.cos(radian) * radius;
                  const y = -Math.sin(radian) * radius;

                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                      animate={{ opacity: 1, x, y, scale: 1 }}
                      exit={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 800, damping: 35, delay: index * 0.01 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.disabled) return;
                        item.action();
                        setIsLikeMenuOpen(false);
                      }}
                      className={`pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${fanBtnClass} rounded-full flex items-center justify-center shadow-xl border transition-all group will-change-transform ${
                        item.id === 'like' && item.active
                          ? 'bg-rose-500 text-white border-rose-400'
                          : item.disabled
                            ? 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed opacity-50'
                            : 'bg-zinc-950 text-white border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700'
                      }`}
                    >
                      <item.icon size={fanIconSize} className={item.id === 'like' && item.active ? 'fill-current' : ''} />
                      <div className="absolute bottom-full mb-3 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap border border-zinc-800 shadow-2xl transition-opacity">
                        {item.label}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </AnimatePresence>

          {showLike && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const nextState = !isLikeMenuOpen;
                closeAllMenus();
                setIsLikeMenuOpen(nextState);
                onMenuToggle?.(nextState);
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 will-change-transform ${
                isLikeMenuOpen 
                  ? 'bg-white text-zinc-900 border-white' 
                  : 'bg-zinc-950 text-white border-zinc-700/50 hover:bg-zinc-900'
              }`}
            >
              <Heart size={20} className={isLiked && !isLikeMenuOpen ? 'fill-current text-rose-500' : ''} />
            </motion.button>
          )}
        </div>

        {/* CENTER EYE BUTTON */}
        <div className="relative">
          <AnimatePresence>
          {isEyeOpen && (
            <div className="absolute inset-0 pointer-events-none">
              {eyeMenuItems.map((item, index) => {
                const startAngle = 160;
                const endAngle = 20;
                const angle = startAngle - (index * (startAngle - endAngle) / (eyeMenuItems.length - 1));
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * radius;
                const y = -Math.sin(radian) * radius;

                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                    animate={{ opacity: 1, x, y, scale: 1 }}
                    exit={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 800, damping: 35, delay: index * 0.01 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      item.action();
                      setIsEyeOpen(false);
                    }}
                    className={`pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${fanBtnClass} rounded-full flex items-center justify-center shadow-xl border transition-all group will-change-transform ${
                      item.active 
                        ? 'bg-white text-zinc-900 border-white ring-4 ring-white/10' 
                        : item.isDanger
                          ? 'bg-red-600 text-white border-red-500 hover:bg-red-700 shadow-red-900/20'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <item.icon size={fanIconSize} />
                    <div className="absolute bottom-full mb-3 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap border border-zinc-800 shadow-2xl transition-opacity">
                      {item.label}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        <motion.button
          layout
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const nextState = !isEyeOpen;
            closeAllMenus();
            setIsEyeOpen(nextState);
            onMenuToggle?.(nextState);
          }}
          className={`relative z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-2 transition-all duration-300 will-change-transform ${
            isEyeOpen 
              ? 'bg-white text-zinc-900 border-white' 
              : 'bg-zinc-950 text-white border-zinc-700/50'
          }`}
        >
          <motion.div animate={{ rotate: isEyeOpen ? 90 : 0 }}>
            {isEyeOpen ? <X size={24} /> : <Eye size={24} />}
          </motion.div>
        </motion.button>
      </div>

      {/* SETTINGS BUTTON */}
      <div className="relative">
        <AnimatePresence>
          {isSettingsOpen && (
            <div className="absolute inset-0 pointer-events-none">
              {settingsMenuItems.map((item, index) => {
                // Settings fan out to the top-right
                const startAngle = 120;
                const endAngle = 30;
                const angle = startAngle - (index * (startAngle - endAngle) / (settingsMenuItems.length - 1));
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * radius;
                const y = -Math.sin(radian) * radius;

                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                    animate={{ opacity: 1, x, y, scale: 1 }}
                    exit={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 800, damping: 35, delay: index * 0.01 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      item.action();
                    }}
                    className={`pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${fanBtnClass} rounded-full flex items-center justify-center shadow-xl border transition-all group will-change-transform ${
                      item.active 
                        ? 'bg-emerald-500 text-white border-emerald-400 ring-4 ring-emerald-500/20' 
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <item.icon size={fanIconSize} />
                    <div className="absolute bottom-full mb-3 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap border border-zinc-800 shadow-2xl transition-opacity">
                      {item.label}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            const nextState = !isSettingsOpen;
            closeAllMenus();
            setIsSettingsOpen(nextState);
            onMenuToggle?.(nextState);
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 will-change-transform ${
            isSettingsOpen 
              ? 'bg-white text-zinc-900 border-white' 
              : 'bg-zinc-950 text-white border-zinc-700/50 hover:bg-zinc-900'
          }`}
        >
          <Settings size={20} className={isSettingsOpen ? 'rotate-90 transition-transform' : ''} />
        </motion.button>
      </div>

      {/* NEXT ARROW */}
      <motion.button
        whileHover={canGoNext ? { scale: 1.1, x: 5 } : {}}
        whileTap={canGoNext ? { scale: 0.9 } : {}}
        onClick={() => {
          closeAllMenus();
          onNextTheme();
        }}
        disabled={!canGoNext}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 ${
          canGoNext 
            ? 'bg-zinc-950 text-white border-zinc-700/50 hover:bg-zinc-900' 
            : 'bg-zinc-950/20 text-zinc-700 border-zinc-800/20 cursor-not-allowed opacity-30'
        }`}
      >
        {toggleDice ? <Dices size={24} /> : <ChevronRight size={24} />}
      </motion.button>
    </div>
  );
};
