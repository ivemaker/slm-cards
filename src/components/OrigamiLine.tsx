import React, { useEffect, useRef } from 'react';

// Типы настроек
export interface OrigamiSettings {
  complexity: number;
  size: number;
  fillHue: number;
  colorSpeed: number;
  animationSpeed: number;
  amplitude: number;
  heightOffset: number;
  scale: number;
  rotation: number;
  opacity: number;
  wireframe: boolean;
  shimmer: boolean;
  bgGradientStart: string;
  bgGradientEnd: string;
}

interface Triangle {
  pos: {
    x1: number; y1: number; z1: number;
    x2: number; y2: number; z2: number;
    x3: number; y3: number; z3: number;
  };
  anchorX1: number;
  anchorY1: number;
  anchorZ1: number;
  // Фазы и частоты для создания непрерывного гармонического движения (как под водой)
  phaseX: number; phaseY: number; phaseZ: number;
  freqX: number;  freqY: number;  freqZ: number;
}

interface OrigamiLineProps {
  settings: OrigamiSettings;
}

export function OrigamiLine({ settings }: OrigamiLineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trianglesRef = useRef<Triangle[]>([]);
  const hueRef = useRef<number>(settings.fillHue);
  const animationFrameId = useRef<number>(0);
  const shimmerProgressRef = useRef<number>(0);
  
  const settingsRef = useRef<OrigamiSettings>(settings);

  // Обновляем реф настроек без перезапуска всей геометрии
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // Генерация начальной цепочки треугольников (ленты)
  const generateTriangles = (w: number, h: number, size: number) => {
    const list: Triangle[] = [];
    const currentComplexity = settingsRef.current.complexity;
    const maxValLimit = Math.max(w, h) + size * (4 * currentComplexity);

    const generate = (old: Partial<Triangle['pos']>, second: boolean, prevIdx: number) => {
      const t: Triangle = {
        pos: { x1: 0, y1: 0, z1: 0, x2: 0, y2: 0, z2: 0, x3: 0, y3: 0, z3: 0 },
        anchorX1: 0, anchorY1: 0, anchorZ1: 0,
        phaseX: Math.random() * 100,
        phaseY: Math.random() * 100,
        phaseZ: Math.random() * 100,
        // Очень низкие частоты для плавного, ленивого движения
        freqX: 0.006 + Math.random() * 0.008,
        freqY: 0.006 + Math.random() * 0.008,
        freqZ: 0.006 + Math.random() * 0.008,
      };
      
      const n = Math.random() < 0.5;
      const zDepth = size * 0.45;

      // Генерируем узлы вдоль центральной оси со случайным разбросом
      t.pos.x1 = old.x2 !== undefined ? old.x2 : -size * 3;
      t.pos.y1 = old.y2 !== undefined ? old.y2 : (Math.random() - 0.5) * size;
      t.pos.z1 = old.z2 !== undefined ? old.z2 : (prevIdx % 2 === 0 ? 1 : -1) * zDepth;

      t.pos.x2 = old.x3 !== undefined ? old.x3 : Math.random() * size + t.pos.x1 * (n && old.x2 !== undefined ? -1 : 1);
      t.pos.y2 = old.y3 !== undefined ? old.y3 : Math.random() * size + t.pos.y1 * (n && old.y2 !== undefined ? -1 : 1);
      t.pos.z2 = old.z3 !== undefined ? old.z3 : (prevIdx % 2 === 0 ? -1 : 1) * zDepth;

      t.pos.x3 = Math.random() * size + t.pos.x2;
      t.pos.y3 = Math.random() * size + t.pos.y2 * (second ? -0.3 : 0.3);
      t.pos.z3 = (prevIdx % 2 === 0 ? 0.35 : -0.35) * zDepth;

      t.anchorX1 = t.pos.x1;
      t.anchorY1 = t.pos.y1;
      t.anchorZ1 = t.pos.z1;

      return t;
    };

    let tri = generate({}, false, 0);
    list.push(tri);

    let minVal = Math.max(tri.pos.x1, tri.pos.y1, tri.pos.x2, tri.pos.y2, tri.pos.x3, tri.pos.y3);
    let idx = 1;

    // Строим цепь, пока она не выйдет за границы экрана (с запасом)
    while (minVal < maxValLimit) {
      const prevPos = {
        x2: tri.pos.x2, y2: tri.pos.y2, z2: tri.pos.z2,
        x3: tri.pos.x3, y3: tri.pos.y3, z3: tri.pos.z3
      };
      tri = generate(prevPos, idx % 2 === 0, idx);
      minVal = Math.max(tri.pos.x1, tri.pos.y1, tri.pos.x2, tri.pos.y2, tri.pos.x3, tri.pos.y3);
      list.push(tri);
      idx++;
    }

    trianglesRef.current = list;
    hueRef.current = settingsRef.current.fillHue;
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = containerRef.current.clientWidth || window.innerWidth;
    let h = containerRef.current.clientHeight || window.innerHeight;

    canvas.width = w;
    canvas.height = h;

    const fraction = settingsRef.current.size;
    let size = Math.min(w, h) * fraction;

    // Генерируем начальную геометрию
    generateTriangles(w, h, size);

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      const s = settingsRef.current;

      ctx.save();
      // Трансформации для всего полотна
      ctx.translate(w / 2, h / 2 + s.heightOffset);
      ctx.scale(s.scale, s.scale);
      ctx.rotate((s.rotation * Math.PI) / 180);
      ctx.translate(-w / 2, -h / 2);

      // Анимация цвета
      if (s.colorSpeed > 0) {
        hueRef.current = (hueRef.current + s.colorSpeed * 0.1) % 360;
      } else {
        hueRef.current = s.fillHue;
      }

      const triangles = trianglesRef.current;
      const speedMult = s.animationSpeed;
      const driftRadius = s.amplitude;

      // Обновление прогресса "блика" (shimmer)
      if (s.shimmer) {
        const sweepSpeed = s.animationSpeed > 0 ? s.animationSpeed : 0.5;
        // Используем плавный непрерывный цикл по модулю 2*PI, чтобы избежать скачков
        shimmerProgressRef.current = (shimmerProgressRef.current + 0.003 * sweepSpeed) % (Math.PI * 2);
      }

      const sweepRange = w * 2.2;
      // Плавное гармоническое движение сканера туда и обратно с помощью синуса
      const smoothProgress = (Math.sin(shimmerProgressRef.current) + 1.0) / 2.0;
      const lx = (smoothProgress * sweepRange) - (w * 0.6); // X позиция источника света
      const ly = h / 2 + s.heightOffset;
      const lz = size * 3.5; // Z позиция источника света (над плоскостью)

      // Отрисовка ленты
      for (let i = 0; i < triangles.length; i++) {
        const t = triangles[i];

        if (i > 0) {
          // Инкремент фазы для создания многооктавной гармоники (сложного движения)
          if (speedMult > 0) {
            t.phaseX += t.freqX * speedMult * 0.8;
            t.phaseY += t.freqY * speedMult * 0.8;
            t.phaseZ += t.freqZ * speedMult * 0.8;
          }

          // Многокомпонентный синус (чтобы движение не было слишком предсказуемым)
          const dx = (Math.sin(t.phaseX) + Math.cos(t.phaseX * 0.65) + Math.sin(t.phaseX * 0.35)) / 3.0;
          const dy = (Math.sin(t.phaseY) + Math.cos(t.phaseY * 0.75) + Math.sin(t.phaseY * 0.40)) / 3.0;
          const dz = (Math.sin(t.phaseZ) + Math.cos(t.phaseZ * 0.55) + Math.sin(t.phaseZ * 0.30)) / 3.0;

          // Сдвиг первой точки относительно начального якоря
          t.pos.x1 = t.anchorX1 + dx * driftRadius;
          t.pos.y1 = t.anchorY1 + dy * driftRadius;
          t.pos.z1 = t.anchorZ1 + dz * (driftRadius * 0.45);

          // Точки 2 и 3 привязываются ("прилипают") к предыдущему треугольнику! 
          // Это сохраняет топологию сплошной ленты:
          t.pos.x2 = triangles[i - 1].pos.x3;
          t.pos.y2 = triangles[i - 1].pos.y3;
          t.pos.z2 = triangles[i - 1].pos.z3;

          t.pos.x3 = triangles[i - 1].pos.x1;
          t.pos.y3 = triangles[i - 1].pos.y1;
          t.pos.z3 = triangles[i - 1].pos.z1;
        }

        ctx.beginPath();
        ctx.moveTo(t.pos.x1, t.pos.y1 + h / 2);
        ctx.lineTo(t.pos.x2, t.pos.y2 + h / 2);
        ctx.lineTo(t.pos.x3, t.pos.y3 + h / 2);
        ctx.closePath();

        // Смещение оттенка для каждого сегмента
        const segmentHue = (hueRef.current + i * 3.5) % 360;
        const saturation = Math.min(30 + i * 4, 100);
        const baseOpacity = s.opacity !== undefined ? s.opacity / 100 : 1.0;
        const ribbonAlpha = baseOpacity * 0.55;
        const colorString = `hsla(${segmentHue}, ${saturation}%, 55%, ${ribbonAlpha})`;

        if (s.wireframe) {
          ctx.strokeStyle = colorString;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          ctx.fillStyle = colorString;
          ctx.fill();
        }

        // --- Эффект Шиммера (Отражение света / Физический спекулярный блик) ---
        if (s.shimmer) {
          // 1. Вычисляем нормаль к поверхности (Cross Product)
          const ux = t.pos.x2 - t.pos.x1, uy = t.pos.y2 - t.pos.y1, uz = t.pos.z2 - t.pos.z1;
          const vx = t.pos.x3 - t.pos.x1, vy = t.pos.y3 - t.pos.y1, vz = t.pos.z3 - t.pos.z1;

          let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
          let normalLen = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
          nx /= normalLen; ny /= normalLen; nz /= normalLen;

          // 2. Вектор направления света
          const cx = (t.pos.x1 + t.pos.x2 + t.pos.x3) / 3;
          const cy = (t.pos.y1 + t.pos.y2 + t.pos.y3) / 3 + h / 2;
          const cz = (t.pos.z1 + t.pos.z2 + t.pos.z3) / 3;

          let ldx = lx - cx, ldy = ly - cy, ldz = lz - cz;
          let distL = Math.sqrt(ldx * ldx + ldy * ldy + ldz * ldz) || 1;
          ldx /= distL; ldy /= distL; ldz /= distL;

          // 3. Вычисление отражения (Модель Фонга, Half-vector)
          let hx = ldx, hy = ldy, hz = ldz + 1.0;
          let lenH = Math.sqrt(hx * hx + hy * hy + hz * hz) || 1;
          hx /= lenH; hy /= lenH; hz /= lenH;

          const dotNH = Math.abs(nx * hx + ny * hy + nz * hz);
          // Двухкомпонентный блик: широкий и мягкий (степень 14) плюс яркое ядро (степень 24) для плавной игры света
          const specular = Math.pow(dotNH, 14) * 0.65 + Math.pow(dotNH, 24) * 0.35;

          // 4. Гауссова огибающая: блик виден только рядом с движущимся "сканером"
          const distanceToLightX = Math.abs(cx - lx);
          const sigma = size * 1.8; // Увеличено с 1.5 до 1.8 для мягкого и широкого светового конуса
          const envelope = Math.exp(-(distanceToLightX * distanceToLightX) / (2 * sigma * sigma));

          const finalSpecular = specular * envelope * 0.9;

          if (finalSpecular > 0.001) { // Снижено с 0.01 до 0.001 для бесшовного угасания бликов в темноте
            if (s.wireframe) {
              ctx.strokeStyle = `rgba(255, 255, 255, ${finalSpecular * 0.95})`;
              ctx.lineWidth = 2.0;
              ctx.stroke();
            } else {
              ctx.fillStyle = `rgba(255, 255, 255, ${finalSpecular})`;
              ctx.fill();
            }
          }
        }
      }

      ctx.restore();
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const cw = containerRef.current.clientWidth;
      const ch = containerRef.current.clientHeight;
      if (cw > 0 && ch > 0) {
        w = cw;
        h = ch;
        canvas.width = w;
        canvas.height = h;
        size = Math.min(w, h) * settingsRef.current.size;
        generateTriangles(w, h, size);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => {
      cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
    };
  }, []); 

  const op = settings.opacity !== undefined ? settings.opacity / 100 : 1.0;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none"
      style={{
        background: `linear-gradient(135deg, ${settings.bgGradientStart} 0%, ${settings.bgGradientEnd} 100%)`,
        opacity: op
      }}
    >
      <canvas ref={canvasRef} className="block w-full h-full relative z-10" />
    </div>
  );
}

export default OrigamiLine;
