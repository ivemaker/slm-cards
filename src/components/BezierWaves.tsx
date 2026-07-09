import { useEffect, useRef } from 'react';

export interface BezierSettings {
  waves: number;       // Количество независимых волн/лент
  speed: number;       // Множитель общей скорости анимации
  width: number;       // "Толщина" шлейфа (количество линий в одной волне)
  amplitude: number;   // Размах/амплитуда изгиба кривых
  hueStart: number;    // Минимальное значение фазы цвета
  hueEnd: number;      // Максимальное значение фазы цвета
  rotation: number;    // Угол поворота всей сцены в градусах
  opacity?: number;    // General opacity 0-100
}

export function BezierWaves({ settings }: { settings: BezierSettings }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef(settings);

  // Синхронизация настроек в реальном времени без лишних ререндеров
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let radius = 0;
    let centerX = 0;
    let centerY = 0;
    let scale = 1;

    // Адаптивное изменение размеров Canvas под экран
    const handleResize = () => {
      const parentWidth = container.offsetWidth;
      const parentHeight = container.offsetHeight;
      if (parentWidth > 0 && parentHeight > 0) {
        scale = window.devicePixelRatio || 1;
        width = parentWidth * scale;
        height = parentHeight * scale;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = parentWidth + 'px';
        canvas.style.height = parentHeight + 'px';
        // Радиус охватывающей окружности для вылета линий за края экрана
        radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
        centerX = width / 2;
        centerY = height / 2;
      }
    };

    handleResize();
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // Математические хелперы
    const pi = Math.PI;
    const pi2 = 2 * Math.PI;
    const dtr = (deg: number) => (deg * pi) / 180;
    const rnd = (a: number, b?: number) => {
      if (b === undefined) return Math.random() * a;
      return a + Math.random() * (b - a);
    };
    const rnd_sign = () => (Math.random() > 0.5 ? 1 : -1);

    // Логика плавной смены цветов по синусоиде (эффект радуги)
    let hue = settingsRef.current.hueStart;
    let hueFw = true;
    let waveColor = 'rgba(0, 0, 0, 0.1)';

    const updateColor = () => {
      const s = settingsRef.current;
      hue += hueFw ? 0.01 : -0.01;

      if (hue > s.hueEnd && hueFw) {
        hue = s.hueEnd;
        hueFw = false;
      } else if (hue < s.hueStart && !hueFw) {
        hue = s.hueStart;
        hueFw = true;
      }

      // Генерация RGB каналов со сдвигом фазы на 0, 2 и 4 радиана
      const r = Math.floor(127 * Math.sin(0.3 * hue + 0) + 128);
      const g = Math.floor(127 * Math.sin(0.3 * hue + 2) + 128);
      const b = Math.floor(127 * Math.sin(0.3 * hue + 4) + 128);

      waveColor = `rgba(${r}, ${g}, ${b}, 0.1)`;
    };

    // Представление отдельной линии в шлейфе
    class Line {
      angle: number[];
      color: string;
      constructor(angles: number[], color: string) {
        this.angle = angles;
        this.color = color;
      }
    }

    // Логика движения и накопления шлейфа волны
    class WaveInstance {
      angle: number[];
      speed: number[];
      lines: Line[];

      constructor() {
        // Каждая волна имеет 4 независимых угла (для 4 опорных точек кривой Безье)
        this.angle = [rnd(pi2), rnd(pi2), rnd(pi2), rnd(pi2)];
        const minSpeed = 0.004;
        const maxSpeed = 0.008;
        // Случайные скорости и направления вращения для каждой из 4 точек
        this.speed = [
          rnd(minSpeed, maxSpeed) * rnd_sign(),
          rnd(minSpeed, maxSpeed) * rnd_sign(),
          rnd(minSpeed, maxSpeed) * rnd_sign(),
          rnd(minSpeed, maxSpeed) * rnd_sign(),
        ];
        this.lines = [];
      }

      update(cfgSpeed: number, cfgWidth: number) {
        // Смещаем углы на основе индивидуальной скорости и глобального множителя
        this.angle = [
          this.angle[0] + this.speed[0] * cfgSpeed,
          this.angle[1] + this.speed[1] * cfgSpeed,
          this.angle[2] + this.speed[2] * cfgSpeed,
          this.angle[3] + this.speed[3] * cfgSpeed,
        ];

        // Получаем значения синусов углов, чтобы получить волнообразные координаты (-1..1)
        const nextAngleLine = [
          Math.sin(this.angle[0]),
          Math.sin(this.angle[1]),
          Math.sin(this.angle[2]),
          Math.sin(this.angle[3]),
        ];

        // Добавляем новую линию в массив шлейфа
        this.lines.push(new Line(nextAngleLine, waveColor));

        // Удаляем старые линии, если шлейф превышает заданную длину (width)
        while (this.lines.length > cfgWidth) {
          this.lines.shift();
        }
      }

      draw(amplitude: number, rotationDeg: number) {
        const radius3 = radius / 3;
        const rotationVec = dtr(rotationDeg);

        for (let i = 0; i < this.lines.length; i++) {
          const line = this.lines[i];
          const angle = line.angle;

          // Начальная точка кривой (на краю окружности)
          const x1 = centerX - radius * Math.cos(angle[0] * amplitude + rotationVec);
          const y1 = centerY - radius * Math.sin(angle[0] * amplitude + rotationVec);
          
          // Конечная точка кривой (на противоположном краю)
          const x2 = centerX + radius * Math.cos(angle[3] * amplitude + rotationVec);
          const y2 = centerY + radius * Math.sin(angle[3] * amplitude + rotationVec);
          
          // Две контрольные (опорные) точки кривой Безье (ближе к центру, на 1/3 радиуса)
          const cpx1 = centerX - radius3 * Math.cos(angle[1] * amplitude * 2);
          const cpy1 = centerY - radius3 * Math.sin(angle[1] * amplitude * 2);
          const cpx2 = centerX + radius3 * Math.cos(angle[2] * amplitude * 2);
          const cpy2 = centerY + radius3 * Math.sin(angle[2] * amplitude * 2);

          // Отрисовка кубической кривой Безье
          ctx.strokeStyle = line.color;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);
          ctx.stroke();
        }
      }
    }

    let wavesList: WaveInstance[] = [];

    // Динамическая синхронизация количества активных волн
    const syncWavesList = (count: number) => {
      if (wavesList.length < count) {
        while (wavesList.length < count) {
          wavesList.push(new WaveInstance());
        }
      } else if (wavesList.length > count) {
        wavesList = wavesList.slice(0, count);
      }
    };

    let animationFrameId = 0;

    const render = () => {
      const startTime = performance.now();
      const s = settingsRef.current;
      
      syncWavesList(s.waves);
      updateColor();

      // Очистка кадра
      ctx.clearRect(0, 0, width, height);

      // Отрисовка фонового градиента от черного к текущему цвету волн (создает глубину)
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(1, waveColor);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Обновление и отрисовка всех волн
      for (const w of wavesList) {
        w.update(s.speed, w.lines.length > s.width ? s.width : s.width);
      }
      for (const w of wavesList) {
        w.draw(s.amplitude, s.rotation);
      }

      animationFrameId = requestAnimationFrame(render);
      const endTime = performance.now();
      // Передача времени кадра для FPS-индикатора
      window.dispatchEvent(new CustomEvent('frame-time', { detail: endTime - startTime }));
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  const op = settings.opacity !== undefined ? settings.opacity / 100 : 1;

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
      style={{ opacity: op }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

export default BezierWaves;
