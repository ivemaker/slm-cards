import React, { useEffect, useRef, useState } from 'react';

export interface CyberLinesSettings {
  count: number;
  minWidth: number;
  maxWidth: number;
  minSpeed: number;
  maxSpeed: number;
  hue: number;
  hueDif: number;
  glow: number;
  clickToChangeColor: boolean;
}

interface CyberLinesProps {
  settings?: Partial<CyberLinesSettings>;
}

const DEFAULT_SETTINGS: CyberLinesSettings = {
  count: 45,
  minWidth: 1.5,
  maxWidth: 6,
  minSpeed: 15,
  maxSpeed: 60,
  hue: 195,
  hueDif: 35,
  glow: 12,
  clickToChangeColor: true
};

export const CyberLines: React.FC<CyberLinesProps> = ({ settings: customSettings }) => {
  const settings = { ...DEFAULT_SETTINGS, ...customSettings };
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentHue, setCurrentHue] = useState(settings.hue);

  useEffect(() => {
    setCurrentHue(settings.hue);
  }, [settings.hue]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let w = container.clientWidth || window.innerWidth;
    let h = container.clientHeight || window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    let dots: any[] = [];
    let maxHeight = h * 0.9;
    let minHeight = h * 0.5;

    const pushDots = () => {
      dots = [];
      for (let i = 0; i < settings.count; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h / 2,
          h: Math.random() * (maxHeight - minHeight) + minHeight,
          w: Math.random() * (settings.maxWidth - settings.minWidth) + settings.minWidth,
          c: Math.random() * ((currentHue + settings.hueDif) - (currentHue - settings.hueDif)) + (currentHue - settings.hueDif),
          m: Math.random() * (settings.maxSpeed - settings.minSpeed) + settings.minSpeed
        });
      }
    };

    pushDots();

    const handleResize = () => {
      if (!containerRef.current) return;
      const cw = containerRef.current.clientWidth;
      const ch = containerRef.current.clientHeight;
      if (cw > 0 && ch > 0) {
        w = cw;
        h = ch;
        canvas.width = w;
        canvas.height = h;
        maxHeight = h * 0.9;
        minHeight = h * 0.5;
        pushDots();
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < dots.length; i++) {
        ctx.beginPath();
        const grd = ctx.createLinearGradient(dots[i].x, dots[i].y, dots[i].x + dots[i].w, dots[i].y + dots[i].h);
        grd.addColorStop(0.0, "hsla(" + dots[i].c + ",50%,50%,.0)");
        grd.addColorStop(0.2, "hsla(" + (dots[i].c + 20) + ",50%,50%,.5)");
        grd.addColorStop(0.5, "hsla(" + (dots[i].c + 50) + ",70%,60%,.8)");
        grd.addColorStop(0.8, "hsla(" + (dots[i].c + 80) + ",50%,50%,.5)");
        grd.addColorStop(1.0, "hsla(" + (dots[i].c + 100) + ",50%,50%,.0)");
        
        ctx.shadowBlur = settings.glow;
        ctx.shadowColor = "hsla(" + dots[i].c + ",50%,50%,1)";
        ctx.fillStyle = grd;
        ctx.fillRect(dots[i].x, dots[i].y, dots[i].w, dots[i].h);
        ctx.closePath();
        
        dots[i].x += dots[i].m / 100;
        if (dots[i].x > w + settings.maxWidth) {
          dots[i].x = -settings.maxWidth;
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    settings.count,
    settings.minWidth,
    settings.maxWidth,
    settings.minSpeed,
    settings.maxSpeed,
    settings.hueDif,
    settings.glow,
    currentHue
  ]);

  const handleClick = () => {
    if (settings.clickToChangeColor) {
      setCurrentHue(Math.random() * 360);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-auto bg-transparent" 
      onClick={handleClick} 
      style={{ cursor: settings.clickToChangeColor ? 'pointer' : 'default' }}
    >
      <div 
        className="absolute inset-0 z-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at center, hsla(${currentHue},50%,50%,0.3) 0%, rgba(0,0,0,0) 100%)`
        }}
      />
      <div 
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,.0) 10%, rgba(0,0,0,.8) 80%, rgba(0,0,0,1) 100%)'
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 block" />
    </div>
  );
};
