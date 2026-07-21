import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Heart, 
  Check, 
  X 
} from 'lucide-react';
import { useDev } from '../context/DevContext';

interface PreviewDockProps {
  activeDevice: 'none' | 'tablet' | 'mobile';
  onDeviceChange: (device: 'none' | 'tablet' | 'mobile') => void;
  lang: 'en' | 'ru';
  activeIndex: number;
  onNextTheme: () => void;
  onPrevTheme: () => void;
  isLiked: boolean;
  onLike: () => void;
  onCancel: () => void;
  onApply: () => void;
  maxIndex: number;
}

export const PreviewDock: React.FC<PreviewDockProps> = ({
  activeDevice,
  onDeviceChange,
  lang,
  activeIndex,
  onNextTheme,
  onPrevTheme,
  isLiked,
  onLike,
  onCancel,
  onApply,
  maxIndex
}) => {
  const { previewScope, setPreviewScope } = useDev();
  const [isScopeOpen, setIsScopeOpen] = useState(false);
  const [isDeviceOpen, setIsDeviceOpen] = useState(false);

  const scopeRef = useRef<HTMLDivElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (scopeRef.current && !scopeRef.current.contains(event.target as Node)) {
        setIsScopeOpen(false);
      }
      if (deviceRef.current && !deviceRef.current.contains(event.target as Node)) {
        setIsDeviceOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDeviceIcon = () => {
    switch (activeDevice) {
      case 'tablet': return <Tablet size={18} />;
      case 'mobile': return <Smartphone size={18} />;
      default: return <Monitor size={18} />;
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-neutral-950/85 backdrop-blur-md border border-white/10 rounded-full py-2.5 px-4 shadow-2xl h-14" id="preview-dock">
      {/* ◀ ChevronLeft */}
      {activeIndex > 0 && (
        <button
          type="button"
          onClick={onPrevTheme}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
          id="dock-btn-prev"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* ⚙️ Scope Settings Popover */}
      <div className="relative" ref={scopeRef}>
        <button
          type="button"
          onClick={() => {
            setIsScopeOpen(!isScopeOpen);
            setIsDeviceOpen(false);
          }}
          className={`p-2 rounded-full transition-all cursor-pointer ${isScopeOpen ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
          id="dock-btn-scope"
          title={lang === 'en' ? 'Preview Scope' : 'Область применения'}
        >
          <Settings size={18} className={isScopeOpen ? 'rotate-45 duration-200' : 'duration-200'} />
        </button>

        {isScopeOpen && (
          <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-neutral-950/95 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 min-w-[130px] animate-fade-in" id="dock-scope-popover">
            <button
              type="button"
              onClick={() => {
                setPreviewScope('all');
                setIsScopeOpen(false);
              }}
              className={`px-3 py-1.5 text-xs text-center rounded-xl transition-all cursor-pointer ${previewScope === 'all' ? 'bg-white text-black font-bold' : 'text-white/70 hover:bg-white/10'}`}
            >
              {lang === 'en' ? 'All' : 'Все'}
            </button>
            <button
              type="button"
              onClick={() => {
                setPreviewScope('blocks');
                setIsScopeOpen(false);
              }}
              className={`px-3 py-1.5 text-xs text-center rounded-xl transition-all cursor-pointer ${previewScope === 'blocks' ? 'bg-white text-black font-bold' : 'text-white/70 hover:bg-white/10'}`}
            >
              {lang === 'en' ? 'Windows' : 'Окна'}
            </button>
            <button
              type="button"
              onClick={() => {
                setPreviewScope('backgrounds');
                setIsScopeOpen(false);
              }}
              className={`px-3 py-1.5 text-xs text-center rounded-xl transition-all cursor-pointer ${previewScope === 'backgrounds' ? 'bg-white text-black font-bold' : 'text-white/70 hover:bg-white/10'}`}
            >
              {lang === 'en' ? 'Backgrounds' : 'Фоны'}
            </button>
          </div>
        )}
      </div>

      {/* 📱 Device View Selector Popover */}
      <div className="relative" ref={deviceRef}>
        <button
          type="button"
          onClick={() => {
            setIsDeviceOpen(!isDeviceOpen);
            setIsScopeOpen(false);
          }}
          className={`p-2 rounded-full transition-all cursor-pointer ${isDeviceOpen ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
          id="dock-btn-device"
          title={lang === 'en' ? 'Select Device' : 'Выбор устройства'}
        >
          {getDeviceIcon()}
        </button>

        {isDeviceOpen && (
          <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-neutral-950/95 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 min-w-[130px] animate-fade-in" id="dock-device-popover">
            <button
              type="button"
              onClick={() => {
                onDeviceChange('none');
                setIsDeviceOpen(false);
              }}
              className={`px-3 py-1.5 text-xs text-center rounded-xl transition-all cursor-pointer ${activeDevice === 'none' ? 'bg-white text-black font-bold' : 'text-white/70 hover:bg-white/10'}`}
            >
              {lang === 'en' ? 'PC' : 'ПК'}
            </button>
            <button
              type="button"
              onClick={() => {
                onDeviceChange('tablet');
                setIsDeviceOpen(false);
              }}
              className={`px-3 py-1.5 text-xs text-center rounded-xl transition-all cursor-pointer ${activeDevice === 'tablet' ? 'bg-white text-black font-bold' : 'text-white/70 hover:bg-white/10'}`}
            >
              {lang === 'en' ? 'Tablet' : 'Планшет'}
            </button>
            <button
              type="button"
              onClick={() => {
                onDeviceChange('mobile');
                setIsDeviceOpen(false);
              }}
              className={`px-3 py-1.5 text-xs text-center rounded-xl transition-all cursor-pointer ${activeDevice === 'mobile' ? 'bg-white text-black font-bold' : 'text-white/70 hover:bg-white/10'}`}
            >
              {lang === 'en' ? 'Phone' : 'Телефон'}
            </button>
          </div>
        )}
      </div>

      {/* Action group (appears only for activeIndex > 0) */}
      {activeIndex > 0 && (
        <div className="flex items-center gap-2 border-l border-white/10 pl-2">
          {/* 🤍 Heart (like) */}
          <button
            type="button"
            onClick={onLike}
            className={`p-2 rounded-full transition-all cursor-pointer ${isLiked ? 'text-rose-500 hover:text-rose-600 bg-rose-500/10' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            id="dock-btn-like"
            title={lang === 'en' ? 'Save as Template' : 'Сохранить как шаблон'}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>

          {/* ✓ Apply check */}
          <button
            type="button"
            onClick={onApply}
            className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition-all cursor-pointer"
            id="dock-btn-apply"
            title={lang === 'en' ? 'Apply template' : 'Применить шаблон'}
          >
            <Check size={18} />
          </button>
        </div>
      )}

      {/* ▶ ChevronRight */}
      {activeIndex < maxIndex && (
        <button
          type="button"
          onClick={onNextTheme}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
          id="dock-btn-next"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* ✕ Close Cancel */}
      <button
        type="button"
        onClick={onCancel}
        className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-full transition-all cursor-pointer"
        id="dock-btn-cancel"
        title={lang === 'en' ? 'Cancel preview' : 'Отмена'}
      >
        <X size={18} />
      </button>
    </div>
  );
};
