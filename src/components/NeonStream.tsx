import React, { useEffect, useRef } from 'react';
import { NeonStreamSettings } from '../types';

interface Line {
  x: number;
  t: number;
  length: number;
  speedMultiplier: number;
  hueOffset: number;
  widthMultiplier: number;
  flickerSpeed: number;
  flickerOffset: number;
}

interface NeonStreamProps {
  settings: NeonStreamSettings;
}

export default function NeonStream({ settings }: NeonStreamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef(settings);
  const linesRef = useRef<Line[]>([]);
  const animationFrameId = useRef<number>(0);
  const timeRef = useRef<number>(0);

  // Sync settings without restarting the animation loop
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 3D Path constants
    const floorZStart = -200;
    const floorZEnd = 500;   
    const curveR = 300;
    const wallZ = floorZEnd + curveR; 
    const floorY = 150;
    const curveCY = floorY - curveR; 

    const floorLen = floorZEnd - floorZStart; // 700
    const curveLen = curveR * Math.PI / 2;    // ~471
    const wallLen = 1800;                     // Wall climb height

    const totalLen = floorLen + curveLen + wallLen;

    // Calculate 3D coordinates on virtual path
    const get3D = (x: number, t: number) => {
      let y, z;
      const pathT = Math.max(0, t);
      
      if (pathT < floorLen) {
        // Horizontal floor movement away from camera
        z = floorZStart + pathT;
        y = floorY;
      } else if (pathT < floorLen + curveLen) {
        // Curve up the wall
        const a = ((pathT - floorLen) / curveLen) * (Math.PI / 2);
        z = floorZEnd + curveR * Math.sin(a);
        y = curveCY + curveR * Math.cos(a);
      } else {
        // Vertical movement up the wall
        const wallT = pathT - (floorLen + curveLen);
        z = wallZ;
        y = curveCY - wallT;
      }
      return { x, y, z };
    };

    // Perspective projection 3D to 2D
    const project = (pt: { x: number; y: number; z: number }, w: number, h: number) => {
      const fl = h * 0.8; // Focal length
      const camZ = -400;  // Camera Z
      const z = pt.z - camZ; 
      if (z < 10) return null; // Behind camera
      
      const scale = fl / z;
      return {
        x: w / 2 + pt.x * scale,
        y: h / 2 + (pt.y + 100) * scale,
        scale
      };
    };

    // Create random line
    const createRandomLine = (): Line => {
      return {
        x: Math.sign(Math.random() - 0.5) * Math.pow(Math.random(), 3) * 1600, 
        t: Math.random() * totalLen,
        length: 200 + Math.random() * 200,
        speedMultiplier: 0.8 + Math.random() * 1.2,
        hueOffset: Math.random() * 60 - 30,
        widthMultiplier: 0.5 + Math.random() * 1.5,
        flickerSpeed: 0.05 + Math.random() * 0.1,
        flickerOffset: Math.random() * Math.PI * 2,
      };
    };

    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (cw > 0 && ch > 0) {
        width = cw;
        height = ch;
        canvas.width = width;
        canvas.height = height;
      }
    };

    const initLines = () => {
      const initialPoolSize = 1000;
      linesRef.current = Array.from({ length: initialPoolSize }).map(() => createRandomLine());
    };

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    const container = canvas.parentElement;
    if (container) {
      resizeObserver.observe(container);
    }
    initLines();

    const draw = () => {
      const s = settingsRef.current;
      timeRef.current += 1; 
      
      const timeScale = timeRef.current * s.colorSpeed;
      const baseHue = (250 + timeScale * 0.5) % 360; 

      // Render background
      ctx.globalCompositeOperation = 'source-over';
      const bgGrad = ctx.createLinearGradient(0, height, 0, 0);
      bgGrad.addColorStop(0, `hsl(${baseHue}, 40%, 4%)`); 
      bgGrad.addColorStop(0.4, '#000000');
      bgGrad.addColorStop(1, '#000000');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Additive blending for neon glow
      ctx.globalCompositeOperation = 'lighter';

      const linesToDraw = Math.min(s.density, linesRef.current.length);

      for (let i = 0; i < linesToDraw; i++) {
        const line = linesRef.current[i];
        
        // Move along virtual path
        line.t += s.speed * line.speedMultiplier * 3;

        // Reset if past path
        if (line.t - line.length > totalLen) {
          line.t = -Math.random() * 500;
          line.x = Math.sign(Math.random() - 0.5) * Math.pow(Math.random(), 3) * 1600;
          line.hueOffset = Math.random() * 60 - 30;
        }

        const segs = 10;
        const points = [];
        let maxScale = 0;

        // Build segments
        for (let j = 0; j <= segs; j++) {
          const ptT = line.t - line.length + (j / segs) * line.length;
          if (ptT < 0) continue; 
          
          const pt3d = get3D(line.x, ptT);
          const p = project(pt3d, width, height);
          if (!p) continue;

          points.push(p);
          maxScale = Math.max(maxScale, p.scale);
        }

        if (points.length < 2) continue;

        const pStart = points[0];
        const pEnd = points[points.length - 1];

        if (Math.abs(pStart.x - pEnd.x) < 0.1 && Math.abs(pStart.y - pEnd.y) < 0.1) continue;

        const hue = (baseHue + line.hueOffset) % 360;
        const lWidth = Math.max(0.5, s.lineWidth * line.widthMultiplier * maxScale * 0.4);

        let alpha = 1;
        
        // Fade at the top
        if (line.t > totalLen - 600) {
          alpha *= Math.max(0, (totalLen - line.t) / 600); 
        }

        // Flicker
        if (s.flickerIntensity > 0) {
          const flickerVal = Math.sin(timeRef.current * line.flickerSpeed + line.flickerOffset);
          const flickerAlpha = Math.max(0.1, 1 - (s.flickerIntensity * (flickerVal * 0.5 + 0.5)));
          alpha *= flickerAlpha;
        }

        // Tail fade gradient
        const grad = ctx.createLinearGradient(pStart.x, pStart.y, pEnd.x, pEnd.y);
        grad.addColorStop(0, `hsla(${hue}, 100%, 60%, 0)`);
        grad.addColorStop(0.2, `hsla(${hue}, 100%, 60%, ${alpha * 0.2})`);
        grad.addColorStop(1, `hsla(${hue}, 100%, 80%, ${alpha})`);

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let j = 1; j < points.length; j++) {
          ctx.lineTo(points[j].x, points[j].y);
        }

        // Glow layers
        if (s.glowRadius > 0) {
          ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${alpha * 0.25})`;
          ctx.lineWidth = lWidth + s.glowRadius * maxScale * 0.8;
          ctx.lineCap = 'round';
          ctx.stroke();
          
          ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${alpha * 0.5})`;
          ctx.lineWidth = lWidth + s.glowRadius * maxScale * 0.25;
          ctx.stroke();
        }

        // Main core line
        ctx.strokeStyle = grad;
        ctx.lineWidth = lWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      animationFrameId.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <div 
      className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none" 
      style={{ opacity: (settings.opacity ?? 100) / 100 }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
