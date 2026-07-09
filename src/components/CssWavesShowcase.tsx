import React from 'react';
import { CssWavesSettings } from '../types';

interface CssWavesShowcaseProps {
  settings: CssWavesSettings;
}

export default function CssWavesShowcase({ settings }: CssWavesShowcaseProps) {
  // Внедряем CSS-анимацию бесконечного сдвига в head документа
  React.useEffect(() => {
    const styleId = 'css-waves-keyframes-v4';
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.innerHTML = `
        @keyframes cssWaveMove {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .custom-wave-wrapper {
          overflow: hidden;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          margin: auto;
          width: 100%;
          height: 100%;
        }
        
        .custom-wave-wrapper-inner {
          position: absolute;
          width: 300%;
          height: 3000px; /* Огромная глубина во избежание обрезания при подъеме камеры */
          left: -100%;
        }
        
        .custom-wave-wrapper-inner.bg-top {
          z-index: 15;
        }
        
        .custom-wave-wrapper-inner.bg-middle {
          z-index: 10;
        }
        
        .custom-wave-wrapper-inner.bg-bottom {
          z-index: 5;
        }
        
        .custom-wave-animate {
          animation: cssWaveMove 10s linear infinite;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, []);

  /**
   * Генератор бесшовных путей для viewBox="0 0 2000 3000"
   * Генерирует идеальную синусоидальную волну, повторяющуюся во второй половине,
   * что обеспечивает незаметный переход при сдвиге на 50%.
   */
  const generateWavePath = (amplitude: number, wavelength: number) => {
    const points: string[] = [];
    const width = 2000;
    const height = 3000; // Глубокое заполнение вниз
    const midY = 100;    // Базовая линия колебания волны сверху
    
    points.push(`M 0 ${height}`); // Начинаем снизу слева
    points.push(`L 0 ${midY}`);   // Поднимаемся к началу волны
    
    const steps = 120;
    const cycles = Math.max(1, Math.round(wavelength)); // Количество волн на один экран
    
    for (let i = 0; i <= steps; i++) {
      const x = (width * i) / steps;
      // Удваиваем циклы, так как общая ширина SVG равна 2000 (два экрана для бесшовности)
      const angle = (2 * Math.PI * (cycles * 2) * i) / steps;
      const y = midY + amplitude * Math.sin(angle);
      points.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    
    points.push(`L ${width} ${height}`); // Уходим в правый нижний угол
    points.push(`Z`); // Замыкаем контур обратно в нижний левый угол
    
    return points.join(' ');
  };

  // Процедурно генерируем пути волн на основе настроек
  const topPath = generateWavePath(settings.topAmplitude, settings.topWavelength);
  const middlePath = generateWavePath(settings.middleAmplitude, settings.middleWavelength);
  const bottomPath = generateWavePath(settings.bottomAmplitude, settings.bottomWavelength);

  // Расчет длительности анимации с учетом множителя скорости
  const topDuration = 6 / Math.max(0.01, settings.speedMultiplier);
  const midDuration = 11 / Math.max(0.01, settings.speedMultiplier);
  const botDuration = 16 / Math.max(0.01, settings.speedMultiplier);

  // Default values for gradient backgrounds if not provided
  const bgStart = settings.bgGradientStart || '#03000a';
  const bgEnd = settings.bgGradientEnd || '#0b031e';
  const bgOpacity = settings.opacity !== undefined ? settings.opacity / 100 : 0.5;

  return (
    <div 
      className="custom-wave-wrapper"
      id="css-wave-container"
      style={{
        perspective: `1000px`,
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* Background container with custom opacity (only affects background, not the waves) */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `linear-gradient(to top, ${bgEnd} 20%, ${bgStart} 80%)`,
          opacity: bgOpacity,
          zIndex: 1,
        }}
      />

      {/* 3D-контейнер камеры */}
      <div
        className="w-full h-full absolute inset-0"
        style={{
          zIndex: 2,
          transformStyle: 'preserve-3d',
          // Перемещение по Y (cameraTilt) и вращение по оси Z (cameraYaw)
          transform: `translateY(${settings.cameraTilt}px) rotateZ(${settings.cameraYaw}deg)`,
          // Точка вращения динамически привязана к линии средней волны
          transformOrigin: `50% calc(100% - ${settings.middleYOffset}px)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Слой 1: Верхняя волна */}
        <div 
          className="custom-wave-wrapper-inner bg-top" 
          style={{ 
            opacity: settings.topOpacity,
            // Сдвигаем контейнер вниз так, чтобы волна высотой 100px оказалась на линии topYOffset
            bottom: `${settings.topYOffset - 2900}px`,
            transform: 'translateZ(40px)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div 
            className="absolute left-0 bottom-0"
            style={{
              width: '200%',
              height: '100%',
              transform: 'translateX(0)',
              transformStyle: 'preserve-3d',
            }}
          >
            <svg
              viewBox="0 0 2000 3000"
              preserveAspectRatio="none"
              className="w-full h-full custom-wave-animate"
              style={{
                animationDuration: `${topDuration}s`,
              }}
            >
              <path d={topPath} fill={settings.topColor} />
            </svg>
          </div>
        </div>

        {/* Слой 2: Средняя волна */}
        <div 
          className="custom-wave-wrapper-inner bg-middle" 
          style={{ 
            opacity: settings.middleOpacity,
            bottom: `${settings.middleYOffset - 2900}px`,
            transform: 'translateZ(20px)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div 
            className="absolute left-0 bottom-0"
            style={{
              width: '200%',
              height: '100%',
              transform: 'translateX(0)',
              transformStyle: 'preserve-3d',
            }}
          >
            <svg
              viewBox="0 0 2000 3000"
              preserveAspectRatio="none"
              className="w-full h-full custom-wave-animate"
              style={{
                animationDuration: `${midDuration}s`,
              }}
            >
              <path d={middlePath} fill={settings.middleColor} />
            </svg>
          </div>
        </div>

        {/* Слой 3: Нижняя волна */}
        <div 
          className="custom-wave-wrapper-inner bg-bottom" 
          style={{ 
            opacity: settings.bottomOpacity,
            bottom: `${settings.bottomYOffset - 2900}px`,
            transform: 'translateZ(0px)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div 
            className="absolute left-0 bottom-0"
            style={{
              width: '200%',
              height: '100%',
              transform: 'translateX(0)',
              transformStyle: 'preserve-3d',
            }}
          >
            <svg
              viewBox="0 0 2000 3000"
              preserveAspectRatio="none"
              className="w-full h-full custom-wave-animate"
              style={{
                animationDuration: `${botDuration}s`,
              }}
            >
              <path d={bottomPath} fill={settings.bottomColor} />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
