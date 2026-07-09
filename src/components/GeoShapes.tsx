import React, { useEffect, useRef } from 'react';

export interface GeoShapesSettings {
  bgColor: string;
  gridSize: number;
  size: number;
  fallSpeed: number;
  fallDirection: number;
  rotationSpeed: number;
  randomness: number;
  colors: string[];
  opacity?: number;
}

interface GeoShapesProps {
  settings?: Partial<GeoShapesSettings>;
}

const DEFAULT_SETTINGS: GeoShapesSettings = {
  bgColor: '#0f0f11',
  gridSize: 120,
  size: 18,
  fallSpeed: 0.4,
  fallDirection: 135,
  rotationSpeed: 1.0,
  randomness: 0.5,
  colors: ['#a855f7', '#6366f1', '#3b82f6', '#f43f5e']
};

export const GeoShapes: React.FC<GeoShapesProps> = ({ settings: customSettings }) => {
  const settings = { ...DEFAULT_SETTINGS, ...customSettings };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef(settings);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let SCREEN_WIDTH = container.clientWidth;
    let SCREEN_HEIGHT = container.clientHeight;

    type ShapeType = 'circle' | 'square' | 'halfcircle' | 'triangle' | 'dash';

    class Shape {
      x: number;
      y: number;
      side: number;
      color: string;
      direction: number;
      angle: number;
      type: ShapeType;
      speedMultiplier: number;
      rotationMultiplier: number;

      constructor(x: number, y: number, side: number, color: string, type: ShapeType, randomness: number) {
        this.x = x;
        this.y = y;
        this.speedMultiplier = 1 + (Math.random() * 2 - 1) * randomness;
        this.rotationMultiplier = 1 + (Math.random() * 2 - 1) * randomness;
        this.side = side * (1 + (Math.random() * 2 - 1) * randomness * 0.5);
        this.color = color;
        this.direction = Math.random() > 0.5 ? -1 : 1;
        this.angle = Math.random() * Math.PI * 2 * randomness;
        this.type = type;
      }

      render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        
        if (this.type === 'circle') {
          ctx.beginPath();
          ctx.fillStyle = this.color;
          ctx.arc(this.x, this.y, this.side / 2, 0, 2 * Math.PI, true);
          ctx.closePath();
          ctx.fill();
        } 
        else if (this.type === 'square') {
          ctx.translate(this.x + this.side / 2, this.y + this.side / 2);
          ctx.rotate(this.angle * this.direction);
          ctx.fillStyle = this.color;
          ctx.fillRect(-this.side / 2, -this.side / 2, this.side, this.side);
        }
        else if (this.type === 'halfcircle') {
          ctx.translate(this.x + this.side / 2, this.y + this.side / 2);
          ctx.rotate(this.angle * this.direction);
          ctx.beginPath();
          ctx.fillStyle = this.color;
          ctx.arc(0, 0, this.side / 2, 0, Math.PI, true);
          ctx.closePath();
          ctx.fill();
        }
        else if (this.type === 'triangle') {
          ctx.translate(this.x + this.side / 2, this.y + this.side / 2);
          ctx.rotate(this.angle * this.direction);
          ctx.beginPath();
          ctx.fillStyle = this.color;
          ctx.moveTo(0, 0);
          ctx.lineTo(this.side / 2, this.side / 2);
          ctx.lineTo(this.side / 2, -this.side / 2);
          ctx.lineTo(-this.side / 2, -this.side / 2);
          ctx.lineTo(0, 0);
          ctx.closePath();
          ctx.fill();
        }
        else if (this.type === 'dash') {
          const width = this.side / 3.0;
          ctx.translate(this.x + this.side, this.y + width);
          ctx.rotate(this.angle * this.direction);
          ctx.fillStyle = this.color;
          ctx.fillRect(-this.side / 2, -width / 2, this.side, width);
        }
        
        ctx.restore();
      }
    }

    let shapes: Shape[] = [];

    const generateShapes = () => {
      shapes = [];
      const s = settingsRef.current;
      const types: ShapeType[] = ['circle', 'square', 'halfcircle', 'triangle', 'dash'];
      
      for (let i = 0; i < SCREEN_HEIGHT / s.gridSize; i++) {
        for (let j = 0; j < SCREEN_WIDTH / s.gridSize; j++) {
          let x = s.gridSize * j + Math.floor(Math.random() * s.gridSize) - s.gridSize / 2;
          let y = s.gridSize * i + Math.floor(Math.random() * (s.gridSize / 2)) - s.gridSize / 4;
          
          if (s.randomness > 0) {
            x += (Math.random() * 2 - 1) * s.gridSize * s.randomness;
            y += (Math.random() * 2 - 1) * s.gridSize * s.randomness;
          }

          const color = s.colors[Math.floor(Math.random() * s.colors.length)] || '#ffffff';
          const type = types[Math.floor(Math.random() * types.length)];
          
          if (s.randomness > 0.5 || ((i % 2 === 0 && j % 2 !== 0) || (i % 2 !== 0 && j % 2 === 0))) {
            const shape = new Shape(x, y, s.size, color, type, s.randomness);
            shapes.push(shape);
          }
        }
      }
    };

    const resize = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (cw > 0 && ch > 0) {
        SCREEN_WIDTH = cw;
        SCREEN_HEIGHT = ch;
        canvas.width = SCREEN_WIDTH;
        canvas.height = SCREEN_HEIGHT;
        generateShapes();
      }
    };

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);

    const draw = () => {
      const s = settingsRef.current;
      context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      
      const angle = (s.fallDirection * Math.PI) / 180;
      
      for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];
        const dx = Math.cos(angle) * s.fallSpeed * shape.speedMultiplier;
        const dy = Math.sin(angle) * s.fallSpeed * shape.speedMultiplier;
        
        shape.x += dx;
        shape.y += dy;
        
        if (
          shape.x > SCREEN_WIDTH + shape.side * 2 ||
          shape.x < -shape.side * 2 ||
          shape.y > SCREEN_HEIGHT + shape.side * 2 ||
          shape.y < -shape.side * 2
        ) {
          shape.color = s.colors[Math.floor(Math.random() * s.colors.length)] || '#ffffff';
          shape.direction = Math.random() > 0.5 ? 1 : -1;
          
          if (dx > 0 && shape.x > SCREEN_WIDTH + shape.side) shape.x = -shape.side;
          else if (dx < 0 && shape.x < -shape.side) shape.x = SCREEN_WIDTH + shape.side;
          
          if (dy > 0 && shape.y > SCREEN_HEIGHT + shape.side) shape.y = -shape.side;
          else if (dy < 0 && shape.y < -shape.side) shape.y = SCREEN_HEIGHT + shape.side;
          
          shape.speedMultiplier = 1 + (Math.random() * 2 - 1) * s.randomness;
          shape.rotationMultiplier = 1 + (Math.random() * 2 - 1) * s.randomness;
          shape.side = s.size * (1 + (Math.random() * 2 - 1) * s.randomness * 0.5);
          
          const types: ShapeType[] = ['circle', 'square', 'halfcircle', 'triangle', 'dash'];
          shape.type = types[Math.floor(Math.random() * types.length)];
        }
        
        shape.angle += ((2 * Math.PI) / 960) * s.rotationSpeed * shape.rotationMultiplier;
        shape.render(context);
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: settings.bgColor, opacity: settings.opacity !== undefined ? settings.opacity / 100 : 1 }} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
