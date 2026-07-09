import React, { useEffect, useRef } from 'react';

export interface ResearchSettings {
  bgColor: string;
  maxCircles: number;
  maxCirclesBg: number;
  colors: string[];
  bgColors: string[];
  radMin: number;
  radMax: number;
  radThreshold: number;
  filledCircle: number;
  concentricCircle: number;
  speedMin: number;
  speedMax: number;
  linkDist: number;
  lineBorder: number;
  circleBorder: number;
  maxOpacity: number;
}

interface ResearchNetworkProps {
  settings?: Partial<ResearchSettings>;
}

const DEFAULT_SETTINGS: ResearchSettings = {
  bgColor: '#020205',
  maxCircles: 45,
  maxCirclesBg: 35,
  colors: ['#38bdf8', '#818cf8', '#ffffff'],
  bgColors: ['#1e1b4b', '#311042'],
  radMin: 4,
  radMax: 18,
  radThreshold: 10,
  filledCircle: 50,
  concentricCircle: 35,
  speedMin: 0.2,
  speedMax: 0.8,
  linkDist: 140,
  lineBorder: 1.0,
  circleBorder: 1.5,
  maxOpacity: 0.5
};

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [255, 255, 255];
};

export const ResearchNetwork: React.FC<ResearchNetworkProps> = ({ settings: customSettings }) => {
  const settings = { ...DEFAULT_SETTINGS, ...customSettings };
  const containerRef = useRef<HTMLDivElement>(null);
  const fgCanvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef(settings);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const fgCanvas = fgCanvasRef.current;
    const bgCanvas = bgCanvasRef.current;
    const container = containerRef.current;
    if (!fgCanvas || !bgCanvas || !container) return;

    const ctxfr = fgCanvas.getContext('2d');
    const ctxbg = bgCanvas.getContext('2d');
    if (!ctxfr || !ctxbg) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const resize = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (cw > 0 && ch > 0) {
        width = cw;
        height = ch;
        fgCanvas.width = width;
        fgCanvas.height = height;
        bgCanvas.width = width;
        bgCanvas.height = height;
      }
    };
    resize();

    const randint = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1) + a);
    const randRange = (a: number, b: number) => Math.random() * (b - a) + a;
    const hyperRange = (a: number, b: number) => Math.random() * Math.random() * Math.random() * (b - a) + a;

    let points: Circle[] = [];
    let pointsBack: Circle[] = [];
    let prevSettingsStr = JSON.stringify(settingsRef.current);

    const backgroundMlt = 0.85;
    
    let circleExp = 1;

    class Circle {
      background: boolean;
      x: number;
      y: number;
      radius: number;
      filled: boolean | 'full' | 'concentric';
      color: string;
      borderColor: string;
      opacity: number;
      speed: number;
      speedAngle: number;
      speedx: number;
      speedy: number;
      ttl: number;

      constructor(background = false) {
        this.background = background;
        this.x = randRange(-width / 2, width / 2);
        this.y = randRange(-height / 2, height / 2);
        const s = settingsRef.current;
        this.radius = background ? hyperRange(s.radMin, s.radMax) * backgroundMlt : hyperRange(s.radMin, s.radMax);
        this.filled = this.radius < s.radThreshold 
          ? (randint(0, 100) > s.filledCircle ? false : 'full') 
          : (randint(0, 100) > s.concentricCircle ? false : 'concentric');
        
        const colors = background ? s.bgColors : s.colors;
        const colorHex = colors[randint(0, colors.length - 1)] || '#ffffff';
        const rgb = hexToRgb(colorHex);
        this.color = `${rgb[0]},${rgb[1]},${rgb[2]}`;
        this.borderColor = this.color;
        
        this.opacity = 0.05;
        this.speed = (background ? randRange(s.speedMin, s.speedMax) / backgroundMlt : randRange(s.speedMin, s.speedMax));
        this.speedAngle = Math.random() * 2 * Math.PI;
        this.speedx = Math.cos(this.speedAngle) * this.speed;
        this.speedy = Math.sin(this.speedAngle) * this.speed;
        
        const spacex = Math.abs((this.x - (this.speedx < 0 ? -1 : 1) * (width / 2 + this.radius)) / this.speedx);
        const spacey = Math.abs((this.y - (this.speedy < 0 ? -1 : 1) * (height / 2 + this.radius)) / this.speedy);
        this.ttl = Math.min(spacex, spacey);
      }

      init(background: boolean) {
        const newCircle = new Circle(background);
        Object.assign(this, newCircle);
      }
    }

    const initPoints = () => {
      points = [];
      pointsBack = [];
      const s = settingsRef.current;
      for (let i = 0; i < s.maxCircles; i++) points.push(new Circle(false));
      for (let i = 0; i < s.maxCirclesBg; i++) pointsBack.push(new Circle(true));
    };
    
    initPoints();

    const drawCircle = (ctx: CanvasRenderingContext2D, circle: Circle) => {
      const s = settingsRef.current;
      const radius = circle.background ? circle.radius *= circleExp : circle.radius /= circleExp;
      
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, radius * circleExp, 0, 2 * Math.PI, false);
      ctx.lineWidth = Math.max(1, s.circleBorder * (s.radMin - circle.radius) / (s.radMin - s.radMax));
      ctx.strokeStyle = `rgba(${circle.borderColor},${circle.opacity})`;
      
      if (circle.filled === 'full') {
        ctx.fillStyle = `rgba(${circle.borderColor},${circle.background ? circle.opacity * 0.8 : circle.opacity})`;
        ctx.fill();
        ctx.lineWidth = 0;
        ctx.strokeStyle = `rgba(${circle.borderColor},0)`;
      }
      ctx.stroke();
      
      if (circle.filled === 'concentric') {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, radius / 2, 0, 2 * Math.PI, false);
        ctx.lineWidth = Math.max(1, s.circleBorder * (s.radMin - circle.radius) / (s.radMin - s.radMax));
        ctx.strokeStyle = `rgba(${circle.color},${circle.opacity})`;
        ctx.stroke();
      }
      
      circle.x += circle.speedx;
      circle.y += circle.speedy;
      if (circle.opacity < (circle.background ? s.maxOpacity : 1)) circle.opacity += 0.01;
      circle.ttl--;
    };

    const renderPoints = (ctx: CanvasRenderingContext2D, arr: Circle[]) => {
      const s = settingsRef.current;
      for (let i = 0; i < arr.length; i++) {
        const circle = arr[i];
        if (circle.ttl < -20) arr[i].init(arr[i].background);
        drawCircle(ctx, circle);
      }
      
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          const deltax = arr[i].x - arr[j].x;
          const deltay = arr[i].y - arr[j].y;
          const dist = Math.sqrt(deltax * deltax + deltay * deltay);
          
          if (dist <= arr[i].radius + arr[j].radius) continue;
          
          if (dist < s.linkDist) {
            const xi = (arr[i].x < arr[j].x ? 1 : -1) * Math.abs(arr[i].radius * deltax / dist);
            const yi = (arr[i].y < arr[j].y ? 1 : -1) * Math.abs(arr[i].radius * deltay / dist);
            const xj = (arr[i].x < arr[j].x ? -1 : 1) * Math.abs(arr[j].radius * deltax / dist);
            const yj = (arr[i].y < arr[j].y ? -1 : 1) * Math.abs(arr[j].radius * deltay / dist);
            
            ctx.beginPath();
            ctx.moveTo(arr[i].x + xi, arr[i].y + yi);
            ctx.lineTo(arr[j].x + xj, arr[j].y + yj);
            ctx.strokeStyle = `rgba(${arr[i].borderColor},${Math.min(arr[i].opacity, arr[j].opacity) * ((s.linkDist - dist) / s.linkDist)})`;
            ctx.lineWidth = (arr[i].background ? s.lineBorder * backgroundMlt : s.lineBorder) * ((s.linkDist - dist) / s.linkDist);
            ctx.stroke();
          }
        }
      }
    };

    const draw = () => {
      const s = settingsRef.current;
      
      const currentSettingsStr = JSON.stringify({
         colors: s.colors,
         bgColors: s.bgColors,
         radMin: s.radMin,
         radMax: s.radMax,
         speedMin: s.speedMin,
         speedMax: s.speedMax,
      });

      if (prevSettingsStr !== currentSettingsStr) {
          initPoints();
          prevSettingsStr = currentSettingsStr;
      }

      if (points.length < s.maxCircles) {
        for (let i = points.length; i < s.maxCircles; i++) points.push(new Circle(false));
      } else if (points.length > s.maxCircles) {
        points.splice(s.maxCircles);
      }

      if (pointsBack.length < s.maxCirclesBg) {
        for (let i = pointsBack.length; i < s.maxCirclesBg; i++) pointsBack.push(new Circle(true));
      } else if (pointsBack.length > s.maxCirclesBg) {
        pointsBack.splice(s.maxCirclesBg);
      }

      ctxfr.globalCompositeOperation = 'destination-over';
      ctxfr.clearRect(0, 0, width, height);
      ctxbg.globalCompositeOperation = 'destination-over';
      ctxbg.clearRect(0, 0, width, height);

      ctxfr.save();
      ctxfr.translate(width / 2, height / 2);
      ctxbg.save();
      ctxbg.translate(width / 2, height / 2);

      renderPoints(ctxfr, points);
      renderPoints(ctxbg, pointsBack);

      ctxfr.restore();
      ctxbg.restore();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    const resizeObserver = new ResizeObserver(() => {
        resize();
    });
    
    if (container) {
        resizeObserver.observe(container);
    }

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden bg-black" style={{ backgroundColor: settings.bgColor }}>
      <canvas ref={fgCanvasRef} className="absolute inset-0 w-full h-full z-10" />
      <canvas ref={bgCanvasRef} className="absolute inset-0 w-full h-full opacity-55 blur-[4px] z-0" />
    </div>
  );
};
