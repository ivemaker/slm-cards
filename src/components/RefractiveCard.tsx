import React, { useState, useEffect, useRef } from 'react';

interface RefractiveCardProps {
  children?: React.ReactNode;
  className?: string; // Для кастомного позиционирования, внешних отступов и т.д.
  borderRadius?: number; // Радиус скругления плашки (в px)
  refractivePower?: number; // Сила преломления (от 10 до 150)
  bezelWidth?: number; // Ширина фаски преломления по краям карточки (в px)
  glassPreset?: 'convex-circular' | 'convex-smooth' | 'concave' | 'ridge';
}

export default function RefractiveCard({
  children,
  className = '',
  borderRadius = 16,
  refractivePower = 50,
  bezelWidth = 24,
  glassPreset = 'convex-circular',
}: RefractiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [dispUrl, setDispUrl] = useState<string>('');
  const [specUrl, setSpecUrl] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 300, height: 200 });

  // Создаем уникальные ID для фильтров, чтобы несколько карточек на одной странице не конфликтовали
  const uniqueId = useRef(Math.random().toString(36).substring(2, 9));
  const filterId = `refract-filter-${uniqueId.current}`;
  const filterMobileId = `refract-filter-mobile-${uniqueId.current}`;

  // Определение мобильного устройства и слежение за размерами плашки
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth <= 768 || 
        /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
      );
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (cardRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          const nw = Math.max(10, Math.round(width));
          const nh = Math.max(10, Math.round(height));
          setDimensions(prev => prev.width !== nw || prev.height !== nh ? { width: nw, height: nh } : prev);
        }
      });
      resizeObserver.observe(cardRef.current);
      return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', checkMobile);
      };
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Генерация карт нормалей и бликов
  useEffect(() => {
    const w = dimensions.width;
    const h = dimensions.height;
    if (w < 4 || h < 4) return;

    // PERFORMANCE OPTIMIZATION: Downsample the displacement map to maximum 128px.
    // SVG scales it smoothly, running the CPU loop and toDataURL up to 15x faster!
    const maxRes = 128;
    const scaleFactor = Math.min(1.0, maxRes / Math.max(w, h));
    const procW = Math.round(w * scaleFactor);
    const procH = Math.round(h * scaleFactor);

    // Scale properties to match low-res canvas coordinates
    const rScaled = Math.max(0, Math.min(borderRadius * scaleFactor, procW / 2, procH / 2));
    const bScaled = Math.max(2, Math.min(procW / 2, procH / 2, bezelWidth * scaleFactor));

    // 1. Генерация карты смещения (Displacement Map)
    const dispCanvas = document.createElement('canvas');
    dispCanvas.width = procW;
    dispCanvas.height = procH;
    const dispCtx = dispCanvas.getContext('2d');
    
    if (dispCtx) {
      const imgData = dispCtx.createImageData(procW, procH);

      // Standard 2D Rounded Box SDF
      const sdRoundedBox = (px: number, py: number) => {
        const cx = procW / 2;
        const cy = procH / 2;
        const dx = Math.abs(px - cx) - (cx - rScaled);
        const dy = Math.abs(py - cy) - (cy - rScaled);
        
        // Accurate outer shape: perfectly circular corner boundaries
        const qx = Math.max(dx, 0);
        const qy = Math.max(dy, 0);
        const len = Math.sqrt(qx * qx + qy * qy);
        
        // Exact interior distance: distance to closest flat edge
        const minDist = Math.min(Math.max(dx, dy), 0);
        
        return rScaled - (len + minDist);
      };

      // Сферический профиль высоты линзы
      const getGlassHeight = (px: number, py: number) => {
        const d = sdRoundedBox(px, py);
        if (d <= 0) {
          if (glassPreset === 'concave') return 1.0;
          return 0;
        }
        if (d >= bScaled) {
          if (glassPreset === 'concave') return 0;
          if (glassPreset === 'ridge') return 0;
          return 1;
        }
        const t = d / bScaled;
        if (glassPreset === 'convex-smooth') {
          return 3.0 * t * t - 2.0 * t * t * t;
        } else if (glassPreset === 'concave') {
          return (1.0 - t) * (1.0 - t);
        } else if (glassPreset === 'ridge') {
          return Math.pow(Math.sin(t * Math.PI), 2);
        } else {
          return Math.sqrt(1.0 - (1.0 - t) * (1.0 - t));
        }
      };

      for (let y = 0; y < procH; y++) {
        for (let x = 0; x < procW; x++) {
          const idx = (y * procW + x) * 4;

          const xL = Math.max(0, x - 1);
          const xR = Math.min(procW - 1, x + 1);
          const yT = Math.max(0, y - 1);
          const yB = Math.min(procH - 1, y + 1);

          const hL = getGlassHeight(xL, y);
          const hR = getGlassHeight(xR, y);
          const hT = getGlassHeight(x, yT);
          const hB = getGlassHeight(x, yB);

          const stepX = xR - xL;
          const stepY = yB - yT;

          const nx = (hL - hR) / (stepX || 1);
          const ny = (hT - hB) / (stepY || 1);

          // Сила преломления масштабирует сдвиг (refractivePower / 100)
          const multiplier = 1.8 * (refractivePower / 65);
          const finalX = nx * 128 * multiplier;
          const finalY = ny * 128 * multiplier;

          const rVal = Math.round(128 + finalX);
          const gVal = Math.round(128 + finalY);

          imgData.data[idx] = Math.max(0, Math.min(255, rVal));
          imgData.data[idx + 1] = Math.max(0, Math.min(255, gVal));
          imgData.data[idx + 2] = 255;
          imgData.data[idx + 3] = 255;
        }
      }
      dispCtx.putImageData(imgData, 0, 0);
      setDispUrl(dispCanvas.toDataURL('image/png'));
    }

    // 2. Генерация карты бликов/отражения (Specular Highlight Map)
    const specCanvas = document.createElement('canvas');
    specCanvas.width = procW;
    specCanvas.height = procH;
    const specCtx = specCanvas.getContext('2d');

    if (specCtx) {
      specCtx.clearRect(0, 0, procW, procH);

      // Изящный стеклянный диагональный блик света
      const grad = specCtx.createLinearGradient(0, 0, procW, procH);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      grad.addColorStop(0.28, 'rgba(255, 255, 255, 0.01)');
      grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.18)'); // Лучик света
      grad.addColorStop(0.32, 'rgba(255, 255, 255, 0.01)');
      grad.addColorStop(0.7, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.01)');

      specCtx.fillStyle = grad;
      specCtx.fillRect(0, 0, procW, procH);

      // Внутренний тонкий контур стекла светлым цветом
      specCtx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      specCtx.lineWidth = 1;
      specCtx.strokeRect(0.5, 0.5, procW - 1, procH - 1);

      setSpecUrl(specCanvas.toDataURL('image/png'));
    }
  }, [dimensions, refractivePower, bezelWidth, borderRadius, glassPreset]);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-visible flex flex-col justify-between ${className}`}
      style={{ borderRadius: `${borderRadius}px` }}
    >
      {/* 1. Динамические SVG Фильтры преломления */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute pointer-events-none w-0 h-0"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feImage href={dispUrl || undefined} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="disp" />
            <feDisplacementMap in="SourceGraphic" in2="disp" scale={refractivePower} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          </filter>

          <filter id={filterMobileId} x="0%" y="0%" width="100%" height="100%">
            <feImage href={dispUrl || undefined} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="disp" />
            <feDisplacementMap in="SourceGraphic" in2="disp" scale={refractivePower} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* 2. Задний преломляющий слой (Рендерится ПОД контентом карточки) */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-[-1]"
        style={{
          borderRadius: 'inherit',
          backdropFilter: (dispUrl && specUrl) 
            ? `blur(12px) url(#${isMobile ? filterMobileId : filterId})` 
            : 'blur(16px)',
          WebkitBackdropFilter: (dispUrl && specUrl)
            ? `blur(12px) url(#${isMobile ? filterMobileId : filterId})` 
            : 'blur(16px)',
          willChange: 'backdrop-filter',
          transform: 'translate3d(0,0,0)',
        }}
      />

      {/* 3. Верхний стеклянный слой (Тонирование, подсветка краев и физические тени) */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-0"
        style={{
          borderRadius: 'inherit',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          backgroundImage: specUrl ? `url("${specUrl}")` : 'none',
          backgroundSize: '100% 100%',
          boxShadow: 'inset 0 1px 0px rgba(255, 255, 255, 0.25), inset 0 -1px 0px rgba(0, 0, 0, 0.1)',
        }}
      />

      {/* 4. Слой контента */}
      <div className="relative z-10 w-full h-full p-6 text-white" style={{ borderRadius: 'inherit' }}>
        {children}
      </div>
    </div>
  );
}
