import React, { useEffect, useRef } from 'react';

interface RaindropsEffectProps {
  speed?: number;
  opacity?: number;
  backgroundImage?: string;
}

export const RaindropsEffect: React.FC<RaindropsEffectProps> = ({
  speed = 0.4,
  opacity = 100,
  backgroundImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);

  const finalBgImage = backgroundImage || "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2000";

  useEffect(() => {
    // 1. Подключаем библиотеку капель динамически, если еще не подключена
    const scriptId = 'raindrops-script';
    let loadRainScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    let isDestroyed = false;
    let raindropInstance: any = null;

    const initRaindrops = () => {
      if (isDestroyed) return;

      const canvas = canvasRef.current;
      const bgImage = bgImageRef.current;
      if (!canvas || !bgImage) return;

      // Temporarily strip 'custom-bg' and 'bg-canvas' IDs from any other element in the DOM
      // so this instance can have uncontested ownership when the constructor looks them up.
      const existingBg = document.getElementById('custom-bg');
      if (existingBg && existingBg !== bgImage) {
        existingBg.removeAttribute('id');
      }
      const existingCanvas = document.getElementById('bg-canvas');
      if (existingCanvas && existingCanvas !== canvas) {
        existingCanvas.removeAttribute('id');
      }

      bgImage.id = 'custom-bg';
      canvas.id = 'bg-canvas';

      if (raindropInstance && typeof raindropInstance.destroy === 'function') {
        raindropInstance.destroy();
      }

      const parent = canvas.parentElement;
      if (!parent) return;
      const winW = parent.clientWidth;
      const winH = parent.clientHeight;
      if (winW <= 0 || winH <= 0) return;
      let drawW = winW;
      let drawH = winH;

      // Правильный расчет соотношения сторон, чтобы капли не сплющивало
      if (bgImage && bgImage.naturalWidth > 0) {
        const imgRatio = bgImage.naturalWidth / bgImage.naturalHeight;
        const winRatio = winW / winH;
        if (winRatio > imgRatio) {
          drawW = winW;
          drawH = winW / imgRatio;
        } else {
          drawH = winH;
          drawW = winH * imgRatio;
        }
      }

      // Применяем правильные размеры к холсту
      canvas.width = drawW;
      canvas.height = drawH;
      canvas.style.width = drawW + 'px';
      canvas.style.height = drawH + 'px';

      // Настройка параметров на основе props
      const computedActiveRatio = 0.05 + (speed * 0.12); // Зависимость интенсивности от speed
      const computedFallMultiplier = 0.5 + (speed * 1.25); // Скорость падения от speed

      // 3. Запускаем анимацию капель с нужными пропорциями
      const RaindropsConstructor = (window as any).Raindrops;
      if (RaindropsConstructor) {
        try {
          raindropInstance = new RaindropsConstructor(canvas, canvas.width, canvas.height, {
            renderDropsOnTop: true,
            brightness: 1.04,   // Яркость преломления
            alphaMultiply: 6,
            alphaSubtract: 3,
            minR: 10,           // Минимальный размер капель
            maxR: 40,           // Максимальный размер капель
            activeRatio: computedActiveRatio,   // Интенсивность дождя
            dropFallMultiplier: computedFallMultiplier // Скорость падения
          });
        } catch (err) {
          console.error("Failed to initialize raindrops effect:", err);
        }
      }
    };

    const handleScriptLoad = () => {
      if (isDestroyed) return;
      const bgImage = bgImageRef.current;
      if (!bgImage) return;

      // Ждем загрузки картинки, потом запускаем дождь
      if (bgImage.complete && bgImage.naturalWidth > 0) {
        initRaindrops();
      } else {
        bgImage.addEventListener('load', initRaindrops, { once: true });
      }
    };

    if (!loadRainScript) {
      loadRainScript = document.createElement('script');
      loadRainScript.id = scriptId;
      loadRainScript.src = "https://fyildiz1974.github.io/web/files/raindrops.js";
      document.head.appendChild(loadRainScript);
      loadRainScript.onload = handleScriptLoad;
    } else {
      // Скрипт уже загружается или загружен
      if ((window as any).Raindrops) {
        handleScriptLoad();
      } else {
        loadRainScript.addEventListener('load', handleScriptLoad);
      }
    }

    // При изменении размеров экрана пересчитываем пропорции
    let resizeTimeout: any;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initRaindrops, 200);
    };

    let resizeObserver: ResizeObserver | null = null;
    const parent = canvasRef.current?.parentElement;
    if (parent) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(parent);
    }

    return () => {
      isDestroyed = true;
      if (raindropInstance && typeof raindropInstance.destroy === 'function') {
        raindropInstance.destroy();
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      clearTimeout(resizeTimeout);
      if (loadRainScript) {
        loadRainScript.removeEventListener('load', handleScriptLoad);
      }
    };
  }, [speed, opacity, finalBgImage]);

  return (
    <div 
      className="absolute inset-0 overflow-hidden" 
      style={{ 
        width: '100%', 
        height: '100%', 
        opacity: opacity / 100,
        zIndex: 0,
        backgroundColor: '#000'
      }}
    >
      <img
        ref={bgImageRef}
        id="custom-bg"
        src={finalBgImage}
        crossOrigin="anonymous"
        alt="Background"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          minWidth: '100%',
          minHeight: '100%',
          maxWidth: 'none',
          maxHeight: 'none',
          transform: 'translate(-50%, -50%) scale(1.05)',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />
      <canvas
        ref={canvasRef}
        id="bg-canvas"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
