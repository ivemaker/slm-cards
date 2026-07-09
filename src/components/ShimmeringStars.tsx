import { useEffect, useRef } from 'react';
import { StarsSettings } from '../types';

interface ShimmeringStarsProps {
  settings: StarsSettings;
}

// Вспомогательная функция для перевода HEX цвета в HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const cleanHex = hex.replace(/^#/, '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

class Star3D {
  ox: number = 0; // Исходные 3D координаты
  oy: number = 0;
  oz: number = 0;
  x: number = 0;  // Координаты после вращения
  y: number = 0;
  z: number = 0;
  px: number = 0; // Спроецированные 2D координаты на экране
  py: number = 0;
  scale: number = 0; // Коэффициент перспективного масштабирования

  baseSize: number = 0;
  size: number = 0;
  color: string = '';
  brightness: number = 0;
  maxBrightness: number = 0;
  minBrightness: number = 0;
  phase: number = 0;
  twinkleSpeed: number = 0;
  glow: number = 0;

  constructor(
    settings: StarsSettings, 
    hsl: { h: number; s: number; l: number }
  ) {
    this.reset(settings, hsl);
  }

  reset(
    settings: StarsSettings, 
    hsl: { h: number; s: number; l: number }
  ) {
    // Равномерно распределяем звезды по сфере
    const maxRadius = settings.fov * 1.5;
    const radius = (Math.random() * 0.92 + 0.08) * maxRadius;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    
    this.ox = radius * Math.sin(phi) * Math.cos(theta);
    this.oy = radius * Math.sin(phi) * Math.sin(theta);
    this.oz = radius * Math.cos(phi);

    // Размер звезды с рандомизацией
    const sizeVar = (settings.sizeRandomness / 100) * settings.starSize;
    this.baseSize = Math.max(0.1, settings.starSize + (Math.random() * 2 - 1) * sizeVar);
    this.size = this.baseSize;

    // Цвет с рандомизацией оттенка
    const hueVar = (settings.colorRandomness / 100) * 180;
    const currentHue = (hsl.h + (Math.random() * 2 - 1) * hueVar + 360) % 360;
    const currentSat = Math.max(0, Math.min(100, hsl.s + (Math.random() * 2 - 1) * settings.colorRandomness));
    const currentLight = Math.max(20, Math.min(95, hsl.l + (Math.random() * 2 - 1) * (settings.colorRandomness * 0.3)));
    this.color = `hsl(${currentHue}, ${currentSat}%, ${currentLight}%)`;

    // Параметры мерцания (яркости)
    const brightVar = (settings.brightnessRandomness / 100) * settings.brightness;
    this.maxBrightness = Math.max(0.1, Math.min(1.0, settings.brightness + (Math.random() * 2 - 1) * brightVar));
    this.minBrightness = Math.max(0.01, this.maxBrightness * (1 - settings.brightnessRandomness / 100));
    this.brightness = Math.random() * (this.maxBrightness - this.minBrightness) + this.minBrightness;

    // Свечение (Glow) вокруг ядра
    const glowVar = (settings.glowRandomness / 100) * settings.glow;
    this.glow = Math.max(0, settings.glow + (Math.random() * 2 - 1) * glowVar);

    this.phase = Math.random() * Math.PI * 2;
    this.twinkleSpeed = 0.01 + Math.random() * 0.03;
  }

  updateAndProject(
    width: number, 
    height: number, 
    ax: number, 
    ay: number, 
    az: number, 
    settings: StarsSettings, 
    timeStep: number
  ) {
    // 3D Вращение вокруг оси X (Pitch)
    const cosX = Math.cos(ax);
    const sinX = Math.sin(ax);
    let x1 = this.ox;
    let y1 = this.oy * cosX - this.oz * sinX;
    let z1 = this.oy * sinX + this.oz * cosX;

    // 3D Вращение вокруг оси Y (Yaw)
    const cosY = Math.cos(ay);
    const sinY = Math.sin(ay);
    let x2 = x1 * cosY + z1 * sinY;
    let y2 = y1;
    let z2 = -x1 * sinY + z1 * cosY;

    // 3D Вращение вокруг оси Z (Roll)
    const cosZ = Math.cos(az);
    const sinZ = Math.sin(az);
    let x3 = x2 * cosZ - y2 * sinZ;
    let y3 = x2 * sinZ + y2 * cosZ;
    let z3 = z2;

    this.x = x3;
    this.y = y3;
    this.z = z3;

    // Перспективная проекция
    const distance = settings.fov * 1.5;
    const projectedZ = this.z + distance;

    if (projectedZ > 15) {
      this.scale = settings.fov / projectedZ;
      this.px = width / 2 + this.x * this.scale;
      this.py = height / 2 + this.y * this.scale;
    } else {
      this.scale = 0;
      this.px = -9999;
      this.py = -9999;
    }

    // Мерцание (синусоидальный цикл)
    this.phase += this.twinkleSpeed * settings.speed * timeStep;
    const sinVal = Math.sin(this.phase);
    
    this.brightness = this.minBrightness + (sinVal + 1) * 0.5 * (this.maxBrightness - this.minBrightness);
    this.size = this.baseSize * (0.85 + sinVal * 0.15);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.scale <= 0 || this.px < 0 || this.py < 0) return;

    ctx.save();
    
    const size = this.size * this.scale;
    const glow = this.glow * this.scale;

    // Отрисовка мягкого свечения
    if (glow > 0) {
      const grad = ctx.createRadialGradient(this.px, this.py, 0, this.px, this.py, glow + size);
      grad.addColorStop(0, this.color.replace('hsl', 'hsla').replace(')', `, ${this.brightness * 0.7})`));
      grad.addColorStop(0.3, this.color.replace('hsl', 'hsla').replace(')', `, ${this.brightness * 0.2})`));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.px, this.py, glow + size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Отрисовка центрального яркого ядра звезды
    ctx.fillStyle = this.color.replace('hsl', 'hsla').replace(')', `, ${this.brightness * 1.25})`);
    ctx.beginPath();
    ctx.arc(this.px, this.py, size, 0, Math.PI * 2);
    ctx.fill();

    // 4-конечные блики для крупных ярких звезд вблизи камеры
    if (size > 2.0 && this.brightness > 0.65) {
      const flareLen = size * 2.5;
      ctx.strokeStyle = this.color.replace('hsl', 'hsla').replace(')', `, ${this.brightness * 0.35})`);
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(this.px - flareLen, this.py);
      ctx.lineTo(this.px + flareLen, this.py);
      ctx.moveTo(this.px, this.py - flareLen);
      ctx.lineTo(this.px, this.py + flareLen);
      ctx.stroke();
    }

    ctx.restore();
  }
}

class ShootingStar3D {
  ox: number = 0;
  oy: number = 0;
  oz: number = 0;
  x: number = 0;
  y: number = 0;
  z: number = 0;
  vx: number = 0;
  vy: number = 0;
  vz: number = 0;
  length: number = 0;
  opacity: number = 1.0;
  color: string = '';
  active: boolean = true;

  constructor(width: number, height: number, color: string, settings: StarsSettings) {
    const radius = settings.fov * 1.5;
    this.ox = (Math.random() * 2 - 1) * radius;
    this.oy = (Math.random() * 2 - 1) * radius - (radius * 0.4);
    this.oz = (Math.random() * 2 - 1) * radius;

    this.x = this.ox;
    this.y = this.oy;
    this.z = this.oz;

    this.vx = (1.5 + Math.random() * 2.5) * 4;
    this.vy = (1.0 + Math.random() * 2.0) * 4;
    this.vz = (Math.random() * 2 - 1) * 3;

    this.length = 8 + Math.random() * 10;
    this.color = color;
  }

  // Рождение падающей звезды из клика пользователя
  setFromClick(clickX: number, clickY: number, width: number, height: number, settings: StarsSettings) {
    const distance = settings.fov * 1.5;
    const zPos = -settings.fov * 0.5;
    const scale = settings.fov / (zPos + distance);
    
    this.ox = (clickX - width / 2) / scale;
    this.oy = (clickY - height / 2) / scale;
    this.oz = zPos;

    this.x = this.ox;
    this.y = this.oy;
    this.z = this.oz;

    const speedMultiplier = 5 + Math.random() * 5;
    const angle2D = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle2D) * speedMultiplier;
    this.vy = Math.sin(angle2D) * speedMultiplier;
    this.vz = (Math.random() * 2 - 1) * speedMultiplier;
  }

  update(timeStep: number) {
    this.x += this.vx * timeStep;
    this.y += this.vy * timeStep;
    this.z += this.vz * timeStep;
    this.opacity -= 0.012 * timeStep;

    if (this.opacity <= 0) {
      this.active = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number, settings: StarsSettings) {
    if (!this.active) return;

    const distance = settings.fov * 1.5;

    // Головной наконечник падающей звезды
    const pz1 = this.z + distance;
    if (pz1 <= 15) return;
    const scale1 = settings.fov / pz1;
    const px1 = width / 2 + this.x * scale1;
    const py1 = height / 2 + this.y * scale1;

    // Хвост падающей звезды, уходящий назад в пространстве
    const prevX = this.x - this.vx * this.length * 0.25;
    const prevY = this.y - this.vy * this.length * 0.25;
    const prevZ = this.z - this.vz * this.length * 0.25;

    const pz2 = prevZ + distance;
    if (pz2 <= 15) return;
    const scale2 = settings.fov / pz2;
    const px2 = width / 2 + prevX * scale2;
    const py2 = height / 2 + prevY * scale2;

    ctx.save();
    
    const grad = ctx.createLinearGradient(px2, py2, px1, py1);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    grad.addColorStop(0.5, this.color.replace('hsl', 'hsla').replace(')', `, ${this.opacity * 0.45})`));
    grad.addColorStop(1, `rgba(255, 255, 255, ${this.opacity})`);

    ctx.strokeStyle = grad;
    ctx.lineWidth = Math.max(0.5, 1.8 * scale1);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(px2, py2);
    ctx.lineTo(px1, py1);
    ctx.stroke();

    ctx.restore();
  }
}

export default function ShimmeringStars({ settings }: ShimmeringStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, isOver: false, isDown: false });
  const starsRef = useRef<Star3D[]>([]);
  const shootingStarsRef = useRef<ShootingStar3D[]>([]);
  const animationRef = useRef<number | null>(null);

  // Состояние ручного вращения (drag-to-rotate)
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragDistanceRef = useRef<number>(0);

  // Накопленные углы вращения по 3 осям
  const angleXRef = useRef<number>(0);
  const angleYRef = useRef<number>(0);
  const angleZRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      const container = containerRef.current;
      if (container) {
        const cw = container.clientWidth;
        const ch = container.clientHeight;
        if (cw > 0 && ch > 0) {
          canvas.width = cw;
          canvas.height = ch;
        }
      } else {
        const ww = window.innerWidth;
        const wh = window.innerHeight;
        if (ww > 0 && wh > 0) {
          canvas.width = ww;
          canvas.height = wh;
        }
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Инициализация звезд
    const hsl = hexToHsl(settings.baseColor);
    starsRef.current = Array.from({ length: settings.starCount }, () => new Star3D(settings, hsl));
    shootingStarsRef.current = [];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      if (settings.mouseRotation && isDraggingRef.current) {
        const dx = e.clientX - lastMousePosRef.current.x;
        const dy = e.clientY - lastMousePosRef.current.y;
        
        // Перемещение мыши поворачивает систему (рыскание и тангаж)
        angleYRef.current += dx * 0.006;
        angleXRef.current += dy * 0.006;

        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        dragDistanceRef.current += Math.hypot(dx, dy);
      }

      mouseRef.current.x = currentX;
      mouseRef.current.y = currentY;
      mouseRef.current.isOver = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isOver = false;
      isDraggingRef.current = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      dragDistanceRef.current = 0;
    };

    const handleMouseUp = (e: MouseEvent) => {
      mouseRef.current.isDown = false;
      isDraggingRef.current = false;

      // Создаем звезду при клике (только если мышь не перетаскивали)
      if (dragDistanceRef.current < 6) {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const shootingStar = new ShootingStar3D(canvas.width, canvas.height, `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, settings);
        shootingStar.setFromClick(clickX, clickY, canvas.width, canvas.height, settings);
        shootingStarsRef.current.push(shootingStar);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const currentX = touch.clientX - rect.left;
        const currentY = touch.clientY - rect.top;

        if (settings.mouseRotation && isDraggingRef.current) {
          const dx = touch.clientX - lastMousePosRef.current.x;
          const dy = touch.clientY - lastMousePosRef.current.y;
          
          angleYRef.current += dx * 0.008;
          angleXRef.current += dy * 0.008;

          lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };
          dragDistanceRef.current += Math.hypot(dx, dy);
        }

        mouseRef.current.x = currentX;
        mouseRef.current.y = currentY;
        mouseRef.current.isOver = true;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const clickX = touch.clientX - rect.left;
        const clickY = touch.clientY - rect.top;

        mouseRef.current.x = clickX;
        mouseRef.current.y = clickY;
        mouseRef.current.isOver = true;
        mouseRef.current.isDown = true;

        isDraggingRef.current = true;
        lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };
        dragDistanceRef.current = 0;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      mouseRef.current.isDown = false;
      isDraggingRef.current = false;

      if (dragDistanceRef.current < 8 && e.changedTouches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.changedTouches[0];
        const clickX = touch.clientX - rect.left;
        const clickY = touch.clientY - rect.top;

        const shootingStar = new ShootingStar3D(canvas.width, canvas.height, `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, settings);
        shootingStar.setFromClick(clickX, clickY, canvas.width, canvas.height, settings);
        shootingStarsRef.current.push(shootingStar);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchend', handleTouchEnd);

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min(3, (time - lastTime) / 16.666);
      lastTime = time;

      // Очистка холста для прозрачности и наложения фонов
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      const stars = starsRef.current;
      const shootingStars = shootingStarsRef.current;

      // Обновляем углы авто-вращения
      if (settings.speed > 0) {
        angleXRef.current += (settings.rotationSpeedX * 0.004) * dt;
        angleYRef.current += (settings.rotationSpeedY * 0.004) * dt;
        angleZRef.current += (settings.rotationSpeedZ * 0.004) * dt;
      }

      // Авто-спавн падающих звезд время от времени
      if (settings.speed > 0 && Math.random() < 0.002) {
        shootingStars.push(new ShootingStar3D(canvas.width, canvas.height, `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, settings));
      }

      // Отрисовка созвездий (линий связи) вокруг курсора
      if (mouse.isOver) {
        ctx.save();
        ctx.strokeStyle = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 0.03)`;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          if (s.scale <= 0) continue;

          const distMouse = Math.hypot(s.px - mouse.x, s.py - mouse.y);
          if (distMouse < 180) {
            const force = (180 - distMouse) / 180;
            // Линии от звезды к мыши
            ctx.strokeStyle = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${force * 0.12 * Math.min(1.2, s.scale)})`;
            ctx.beginPath();
            ctx.moveTo(s.px, s.py);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();

            // Линии между соседними звездами на схожей глубине
            for (let j = i + 1; j < stars.length; j++) {
              const other = stars[j];
              if (other.scale <= 0) continue;
              
              const distOther = Math.hypot(s.px - other.px, s.py - other.py);
              if (distOther < 80 && Math.abs(s.scale - other.scale) < 0.3) {
                const combinedForce = force * ((80 - distOther) / 80);
                ctx.strokeStyle = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${combinedForce * 0.09 * Math.min(1.2, s.scale)})`;
                ctx.beginPath();
                ctx.moveTo(s.px, s.py);
                ctx.lineTo(other.px, other.py);
                ctx.stroke();
              }
            }
          }
        }
        ctx.restore();
      }

      // Рассчитываем новые 3D-координаты и проецируем на 2D плоскость
      for (let i = 0; i < stars.length; i++) {
        stars[i].updateAndProject(
          canvas.width, 
          canvas.height, 
          angleXRef.current, 
          angleYRef.current, 
          angleZRef.current, 
          settings, 
          dt
        );
      }

      // Сортировка по Z (Painter's algorithm)
      const sortedStars = [...stars].sort((a, b) => b.z - a.z);

      // Рисуем отсортированные звезды
      for (let i = 0; i < sortedStars.length; i++) {
        sortedStars[i].draw(ctx);
      }

      // Обновляем и рисуем падающие звезды
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        if (settings.speed > 0) {
          ss.update(dt);
        }
        ss.draw(ctx, canvas.width, canvas.height, settings);
        if (!ss.active) {
          shootingStars.splice(i, 1);
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    settings.starCount,
    settings.starSize,
    settings.sizeRandomness,
    settings.baseColor,
    settings.colorRandomness,
    settings.brightness,
    settings.brightnessRandomness,
    settings.glow,
    settings.glowRandomness,
    settings.speed,
    settings.rotationSpeedX,
    settings.rotationSpeedY,
    settings.rotationSpeedZ,
    settings.fov,
    settings.mouseRotation,
    settings.opacity
  ]);

  return (
    <div 
      id="stars-container" 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full bg-transparent"
      style={{ opacity: settings.opacity !== undefined ? settings.opacity / 100 : 1 }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
