import React, { useEffect, useRef } from 'react';

export interface CubeTint {
  color: string;
  shading: string;
}

export interface CubesSettings {
  bgColor: string;
  count: number;
  minSize: number;
  maxSize: number;
  speed: number;
  shapes: string[];
  tints: CubeTint[];
}

interface FloatingCubesProps {
  settings?: Partial<CubesSettings>;
}

const DEFAULT_SETTINGS: CubesSettings = {
  bgColor: '#0a0a0c',
  count: 15,
  minSize: 40,
  maxSize: 100,
  speed: 0.8,
  shapes: ['cube', 'pyramid'],
  tints: [
    { color: '#ffffff', shading: '#a1a1aa' },
    { color: '#6366f1', shading: '#311042' },
    { color: '#38bdf8', shading: '#1e3a8a' }
  ]
};

const Strut = {
  random: (e: number, t: number) => Math.random() * (t - e) + e,
  arrayRandom: <T,>(e: T[]): T => e[Math.floor(Math.random() * e.length)],
  interpolate: (e: number, t: number, n: number) => e * (1 - n) + t * n,
};

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [255, 255, 255];
};

interface FaceConfig {
  className: string;
  normal: [number, number, number];
  transform: string;
  clipPath?: string;
  borderRadius?: string;
  transformOrigin?: string;
}

const SHAPE_CONFIGS: Record<string, (size: number) => FaceConfig[]> = {
  cube: (size) => [
    { className: 'front', normal: [0, 0, 1], transform: `rotateY(0deg) translateZ(${size / 2}px)` },
    { className: 'back', normal: [0, 0, -1], transform: `rotateY(180deg) translateZ(${size / 2}px)` },
    { className: 'left', normal: [-1, 0, 0], transform: `rotateY(-90deg) translateZ(${size / 2}px)` },
    { className: 'right', normal: [1, 0, 0], transform: `rotateY(90deg) translateZ(${size / 2}px)` },
    { className: 'top', normal: [0, 1, 0], transform: `rotateX(90deg) translateZ(${size / 2}px)` },
    { className: 'bottom', normal: [0, -1, 0], transform: `rotateX(-90deg) translateZ(${size / 2}px)` }
  ],
  pyramid: (size) => [
    { className: 'bottom', normal: [0, -1, 0], transform: `rotateX(-90deg) translateZ(${size / 2}px)` },
    { className: 'front', normal: [0, 0.5, 0.866], transform: `rotateY(0deg) translateZ(${size / 2}px) rotateX(30deg)`, transformOrigin: 'bottom', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
    { className: 'back', normal: [0, 0.5, -0.866], transform: `rotateY(180deg) translateZ(${size / 2}px) rotateX(30deg)`, transformOrigin: 'bottom', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
    { className: 'left', normal: [-0.866, 0.5, 0], transform: `rotateY(-90deg) translateZ(${size / 2}px) rotateX(30deg)`, transformOrigin: 'bottom', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
    { className: 'right', normal: [0.866, 0.5, 0], transform: `rotateY(90deg) translateZ(${size / 2}px) rotateX(30deg)`, transformOrigin: 'bottom', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }
  ]
};

export const FloatingCubes: React.FC<FloatingCubesProps> = ({ settings: customSettings }) => {
  const settings = { ...DEFAULT_SETTINGS, ...customSettings };
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    const parent = containerRef.current;
    if (!parent) return;
    
    const existingCubes = parent.querySelectorAll('.cubes-container');
    existingCubes.forEach(el => el.remove());

    let parentWidth = parent.clientWidth;
    let parentHeight = parent.clientHeight;
    
    const handleResize = () => {
      if (parent) {
        const cw = parent.clientWidth;
        const ch = parent.clientHeight;
        if (cw > 0 && ch > 0) {
          parentWidth = cw;
          parentHeight = ch;
        }
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(parent);

    const directions = ["x", "y"] as const;

    const setState = (state: {x: number, y: number}, speed: {x: number, y: number}) => {
      directions.forEach(axis => {
        state[axis] += speed[axis] * settings.speed;
        if (Math.abs(state[axis]) < 360) return;
        const max = Math.max(state[axis], 360);
        const min = max === 360 ? Math.abs(state[axis]) : 360;
        state[axis] = max - min;
      });
    };

    const createShapeDOM = (faceConfigs: FaceConfig[], tint: {color: [number, number, number], shading: [number, number, number]}): HTMLElement => {
      const cube = document.createElement("div");
      cube.className = "cube";
      
      const shadow = document.createElement("div");
      shadow.className = "shadow";
      cube.appendChild(shadow);
      
      const sidesContainer = document.createElement("div");
      sidesContainer.className = "sides";
      
      faceConfigs.forEach(face => {
        const side = document.createElement("div");
        side.className = face.className;
        if (face.clipPath) {
          side.style.clipPath = face.clipPath;
          (side.style as any).webkitClipPath = face.clipPath;
        }
        if (face.transformOrigin) {
          side.style.transformOrigin = face.transformOrigin;
        }
        side.style.transform = face.transform;
        sidesContainer.appendChild(side);
      });
      
      cube.appendChild(sidesContainer);
      return cube;
    };

    const setCubeStyles = ({cube, size, left, top}: {cube: HTMLElement, size: number, left: number, top: number}) => {
      Object.assign(cube.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}px`,
        top: `${top}px`
      });

      const shadow = cube.querySelector(".shadow") as HTMLElement;
      if (shadow) {
        Object.assign(shadow.style, {
          filter: `blur(${Math.round(size * .6)}px)`,
          opacity: Math.min(size / 120, .3).toString()
        });
      }
    };

    const palettes = settings.tints.map(t => ({
      color: hexToRgb(t.color),
      shading: hexToRgb(t.shading)
    }));

    const shapesToUse = settings.shapes;

    const generatedCubes: any[] = [];
    for (let i = 0; i < settings.count; i++) {
      const size = Strut.random(settings.minSize, settings.maxSize);
      const tint = Strut.arrayRandom(palettes);
      const left = Strut.random(0, parentWidth);
      const top = Strut.random(0, parentHeight);
      
      const shapeType = Strut.arrayRandom(shapesToUse) as keyof typeof SHAPE_CONFIGS;
      const faceConfigs = SHAPE_CONFIGS[shapeType] ? SHAPE_CONFIGS[shapeType](size) : SHAPE_CONFIGS.cube(size);

      const cube = createShapeDOM(faceConfigs, tint as { color: [number, number, number]; shading: [number, number, number] });
      const sidesContainer = cube.querySelector(".sides") as HTMLElement;

      const faces = Array.from(sidesContainer.children).map((child, idx) => ({
        side: child as HTMLElement,
        normal: faceConfigs[idx].normal,
        config: faceConfigs[idx]
      }));

      const state = {
        x: Strut.random(0, 360),
        y: Strut.random(0, 360)
      };

      const speed = directions.reduce((object, axis) => {
        const max = size > ((settings.maxSize + settings.minSize) / 2) ? .3 : .6;
        object[axis] = Strut.random(-max, max);
        return object;
      }, {} as {x: number, y: number});

      generatedCubes.push({
        cube,
        sidesContainer,
        faces,
        state,
        speed,
        size,
        tint,
        left,
        top
      });
    }

    generatedCubes.forEach(setCubeStyles);

    const updateSides = (shapeObj: any) => {
      const { state, speed, sidesContainer, faces, tint } = shapeObj;

      setState(state, speed);
      sidesContainer.style.transform = `rotateX(${state.x}deg) rotateY(${state.y}deg)`;

      const rx = state.x * Math.PI / 180;
      const ry = state.y * Math.PI / 180;

      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);

      faces.forEach((faceObj: any) => {
        const { side, normal } = faceObj;
        
        const x1 = normal[0];
        const y1 = normal[1] * cosX - normal[2] * sinX;
        const z1 = normal[1] * sinX + normal[2] * cosX;

        const nx = x1 * cosY + z1 * sinY;
        const ny = y1;
        const nz = -x1 * sinY + z1 * cosY;

        const dot = nx * 0.3 + ny * 0.5 + nz * 0.8;
        const alpha = Math.max(0, Math.min(1, (1 - dot) / 2));

        const r = Math.round(Strut.interpolate(tint.color[0], tint.shading[0], alpha));
        const g = Math.round(Strut.interpolate(tint.color[1], tint.shading[1], alpha));
        const b = Math.round(Strut.interpolate(tint.color[2], tint.shading[2], alpha));

        side.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      });
    };

    const tick = () => {
      generatedCubes.forEach(updateSides);
      animationRef.current = requestAnimationFrame(tick);
    };

    const container = document.createElement("div");
    container.className = "cubes-container absolute inset-0 w-full h-full pointer-events-none";
    generatedCubes.forEach(({cube}) => container.appendChild(cube));

    parent.appendChild(container);
    tick();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      if (parent.contains(container)) {
        parent.removeChild(container);
      }
    };
  }, [
    settings.bgColor,
    settings.count,
    settings.minSize,
    settings.maxSize,
    settings.speed,
    JSON.stringify(settings.shapes),
    JSON.stringify(settings.tints)
  ]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ backgroundColor: settings.bgColor }} ref={containerRef}>
       <style dangerouslySetInnerHTML={{__html: `
        .cubes-container {
          perspective: 1000px;
        }

        .cubes-container .cube {
          position: absolute;
          margin: 0;
          animation: cube-fade-in 2s cubic-bezier(.165, .84, .44, 1);
          transform-style: preserve-3d;
          will-change: transform;
        }

        @keyframes cube-fade-in {
          0% {
            opacity: 0;
            transform: scale(.5);
          }
        }

        .cubes-container .cube .shadow {
          position: absolute;
          background: rgba(0, 0, 0, 0.15);
          top: 85%;
          left: 10%;
          width: 80%;
          height: 15%;
          border-radius: 50%;
          transform: rotateX(90deg);
          pointer-events: none;
        }

        .cubes-container .cube .sides {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          will-change: transform;
        }

        .cubes-container .cube .sides div {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          will-change: transform, background-color;
        }
       `}} />
    </div>
  );
}
