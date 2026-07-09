import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Monitor, Tablet, Smartphone, ArrowLeft, Eye, X } from 'lucide-react';

interface RadialPreviewMenuProps {
  activeDevice: 'none' | 'tablet' | 'mobile';
  onDeviceChange: (device: 'none' | 'tablet' | 'mobile') => void;
  onBack: () => void;
  lang: 'en' | 'ru';
}

export const RadialPreviewMenu: React.FC<RadialPreviewMenuProps> = ({
  activeDevice,
  onDeviceChange,
  onBack,
  lang
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
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
      isBack: true
    },
  ];

  // Distance from center button
  const radius = 70;

  return (
    <div className="relative flex items-center justify-center">
      <AnimatePresence>
        {isOpen && (
          <div className="absolute inset-0 pointer-events-none">
            {menuItems.map((item, index) => {
              // Calculate angle for fan-out (from left to right in an arc)
              // We distribute 4 items in a 120 degree arc centered at the top (from 150deg to 30deg)
              const startAngle = 160;
              const endAngle = 20;
              const angle = startAngle - (index * (startAngle - endAngle) / (menuItems.length - 1));
              const radian = (angle * Math.PI) / 180;
              
              const x = Math.cos(radian) * radius;
              const y = -Math.sin(radian) * radius;

              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: 1, x, y, scale: 1 }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 350, 
                    damping: 25,
                    delay: index * 0.04 
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.action();
                    setIsOpen(false);
                  }}
                  className={`pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center shadow-xl border backdrop-blur-md transition-all group ${
                    item.active 
                      ? 'bg-white text-zinc-900 border-white ring-4 ring-white/10' 
                      : item.isBack
                        ? 'bg-red-500/90 text-white border-red-400/50 hover:bg-red-600'
                        : 'bg-zinc-900/80 text-zinc-400 border-zinc-700 hover:text-white hover:bg-zinc-800'
                  }`}
                  title={item.label}
                >
                  <item.icon size={19} className="transition-transform group-hover:scale-110" />
                  
                  {/* Label tooltip on hover */}
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
        onClick={() => setIsOpen(!isOpen)}
        className={`relative z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-2 transition-all duration-300 ${
          isOpen 
            ? 'bg-zinc-100 text-zinc-900 border-white rotate-90' 
            : 'bg-zinc-900/90 backdrop-blur-xl text-white border-zinc-700/50'
        }`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {isOpen ? <X size={24} /> : <Eye size={24} />}
        </motion.div>
        
        {!isOpen && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-zinc-900 rounded-full"
          />
        )}
      </motion.button>
    </div>
  );
};
