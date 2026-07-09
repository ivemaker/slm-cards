import React, { useEffect, useRef, useState } from 'react';
import { CosmicPlasmaSettings } from '../types';

interface CosmicPlasmaNebulaProps {
  settings: CosmicPlasmaSettings;
}

// Перевод HEX-цветов (например, "#0ea5e9") в нормированные значения { r, g, b } (от 0.0 до 1.0) для WebGL
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16) || 0;
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
  };
}

export const CosmicPlasmaNebula = React.memo<CosmicPlasmaNebulaProps>(({ settings }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useFallback, setUseFallback] = useState(false);

  const accumulatedTimeRef = useRef<number>(Math.random() * 100);
  const prevTimeRef = useRef<number>(performance.now());
  const mouseRef = useRef({ x: 0, y: 0 });
  
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Синхронизация текущих настроек через React refs для использования внутри цикла анимации без лишних ререндеров
  const settingsRef = useRef({
    speed: settings.speed,
    complexity: settings.complexity,
    intensity: settings.intensity,
    opacity: settings.opacity,
    blur: settings.blur,
    isPaused: settings.isPaused,
    plasmaAlgorithm: settings.plasmaAlgorithm,
    scale: settings.scale,
    turbulence: settings.turbulence,
    col1: hexToRgb(settings.plasmaColors[0] || '#0ea5e9'),
    col2: hexToRgb(settings.plasmaColors[1] || '#d946ef'),
    col3: hexToRgb(settings.plasmaColors[2] || '#6366f1'),
  });

  useEffect(() => {
    settingsRef.current = {
      speed: settings.speed,
      complexity: settings.complexity,
      intensity: settings.intensity,
      opacity: settings.opacity,
      blur: settings.blur,
      isPaused: settings.isPaused,
      plasmaAlgorithm: settings.plasmaAlgorithm,
      scale: settings.scale,
      turbulence: settings.turbulence,
      col1: hexToRgb(settings.plasmaColors[0] || '#0ea5e9'),
      col2: hexToRgb(settings.plasmaColors[1] || '#d946ef'),
      col3: hexToRgb(settings.plasmaColors[2] || '#6366f1'),
    };
  }, [
    settings.speed,
    settings.complexity,
    settings.intensity,
    settings.opacity,
    settings.blur,
    settings.isPaused,
    settings.plasmaAlgorithm,
    settings.scale,
    settings.turbulence,
    settings.plasmaColors,
  ]);

  // Отслеживание курсора мыши для интерактивного завихрения
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Основной WebGL-контекст и шейдерный цикл
  useEffect(() => {
    if (useFallback || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'high-performance' });

    if (!gl) {
      console.warn('WebGL не поддерживается. Переключаемся на резервный CPU Canvas 2D.');
      setUseFallback(true);
      return;
    }

    glRef.current = gl;

    // Вершинный шейдер
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Фрагментный шейдер с математикой деформаций плазмы
    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_complexity;
      uniform float u_intensity;
      uniform float u_opacity;
      uniform vec3 u_col1;
      uniform vec3 u_col2;
      uniform vec3 u_col3;
      uniform float u_algorithm;
      uniform float u_scale;
      uniform float u_turbulence;

      // Вспомогательная функция вращения двумерного вектора
      mat2 rotate(float angle) {
        float c = cos(angle);
        float s = sin(angle);
        return mat2(c, -s, s, c);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = uv - 0.5;
        p.x *= u_resolution.x / u_resolution.y;
        
        // Интерактивное завихрение пространства вокруг курсора
        vec2 m = u_mouse / u_resolution.xy;
        vec2 center = (m - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
        float d = length(p - center);
        float rot = 1.0 - smoothstep(0.0, 0.3, d);
        float theta = rot * 3.14159 * 0.5;
        p = rotate(theta) * p;

        // Масштабирование узора
        p *= u_scale;

        float val = 0.0;
        float strength = 1.0;
        float freq = 1.0;
        
        if (u_algorithm < 0.5) {
          // 0: СТАНДАРТ (Космическое рождение)
          for (int i = 0; i < 6; i++) {
            if (float(i) >= u_complexity) break;
            float fi = float(i);
            p += vec2(sin(p.y + u_time * 0.2), cos(p.x + u_time * 0.15)) * u_turbulence * 0.15;
            p = rotate(0.5 + fi) * p;
            val += sin(p.x * freq + u_time) * cos(p.y * freq - u_time * 0.8) * strength;
            freq *= 1.7;
            strength *= 0.55;
          }
        } 
        else if (u_algorithm < 1.5) {
          // 1: ВИХРЬ (Изумрудная бездна)
          float r_dist = length(p);
          float angle_spiral = r_dist * u_turbulence * 1.8 - u_time * 0.6;
          p = rotate(angle_spiral) * p;
          
          for (int i = 0; i < 6; i++) {
            if (float(i) >= u_complexity) break;
            float fi = float(i);
            p += vec2(sin(p.y * 1.5 + u_time * 0.3), cos(p.x * 1.2 - u_time * 0.2)) * u_turbulence * 0.1;
            p = rotate(1.1 + fi) * p;
            val += sin(p.x * freq + u_time * 1.2) * sin(p.y * freq + u_time * 0.9) * strength;
            freq *= 1.8;
            strength *= 0.5;
          }
        } 
        else if (u_algorithm < 2.5) {
          // 2: КИБЕР (Квантовые волны / Ядро матрицы)
          for (int i = 0; i < 6; i++) {
            if (float(i) >= u_complexity) break;
            float fi = float(i);
            p += vec2(cos(p.y * 2.0 + u_time * 0.4), sin(p.x * 2.0 - u_time * 0.3)) * u_turbulence * 0.12;
            p = rotate(0.8 + fi * 0.4) * p;
            val += sin(p.x * freq + p.y * freq + u_time * 1.5) * strength;
            freq *= 1.6;
            strength *= 0.6;
          }
          val = sin(val * 3.0 + u_time * 0.5);
        } 
        else {
          // 3: ОГОНЬ (Мистическое пламя)
          for (int i = 0; i < 6; i++) {
            if (float(i) >= u_complexity) break;
            float fi = float(i);
            p += vec2(sin(p.y * 1.1 + u_time * 0.5), cos(p.x * 1.1 - u_time * 0.4)) * u_turbulence * 0.2;
            p = rotate(0.35 + fi) * p;
            float v1 = 1.0 - abs(sin(p.x * freq + u_time * 1.3));
            float v2 = 1.0 - abs(cos(p.y * freq - u_time * 1.1));
            val += (v1 * v2) * strength;
            freq *= 1.9;
            strength *= 0.48;
          }
        }

        val = (val + 1.0) * 0.5;
        val = clamp(val, 0.0, 1.0);
        val = pow(val, 1.0 / max(0.1, u_intensity));
        
        vec3 col = mix(u_col1, u_col2, val);
        col = mix(col, u_col3, val * val * 1.2);
        col *= smoothstep(-0.2, 1.0, val);
        
        gl_FragColor = vec4(col, val * u_opacity);
      }
    `;

    // Компиляция шейдеров
    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Шейдерная ошибка: ', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) {
      setUseFallback(true);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setUseFallback(true);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Ошибка линковки программы: ', gl.getProgramInfoLog(program));
      setUseFallback(true);
      return;
    }

    programRef.current = program;

    // Буфер плоскости отрисовки (Quad)
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLocation);
    gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

    let width = containerRef.current.clientWidth || window.innerWidth;
    let height = containerRef.current.clientHeight || window.innerHeight;

    // Оптимизация производительности: Даунсемплинг до 60% для стабильных 60 FPS
    const resize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const cw = containerRef.current.clientWidth;
      const ch = containerRef.current.clientHeight;
      if (cw > 0 && ch > 0) {
        width = cw;
        height = ch;
        canvas.width = Math.round(width * 0.6);
        canvas.height = Math.round(height * 0.6);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Отрисовочный цикл
    const renderLoop = () => {
      const startRender = performance.now();
      const dt = startRender - prevTimeRef.current;
      prevTimeRef.current = startRender;

      if (!settingsRef.current.isPaused) {
        accumulatedTimeRef.current += (dt * 0.001) * settingsRef.current.speed;
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      // Передача параметров во фрагментный шейдер
      const uTimeLoc = gl.getUniformLocation(program, 'u_time');
      const uResLoc = gl.getUniformLocation(program, 'u_resolution');
      const uMouseLoc = gl.getUniformLocation(program, 'u_mouse');
      const uComplexityLoc = gl.getUniformLocation(program, 'u_complexity');
      const uIntensityLoc = gl.getUniformLocation(program, 'u_intensity');
      const uOpacityLoc = gl.getUniformLocation(program, 'u_opacity');
      const uCol1Loc = gl.getUniformLocation(program, 'u_col1');
      const uCol2Loc = gl.getUniformLocation(program, 'u_col2');
      const uCol3Loc = gl.getUniformLocation(program, 'u_col3');
      const uAlgLoc = gl.getUniformLocation(program, 'u_algorithm');
      const uScaleLoc = gl.getUniformLocation(program, 'u_scale');
      const uTurbulenceLoc = gl.getUniformLocation(program, 'u_turbulence');

      gl.uniform1f(uTimeLoc, accumulatedTimeRef.current);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);

      const rawMouse = mouseRef.current;
      const scaleX = canvas.width / width;
      const scaleY = canvas.height / height;
      gl.uniform2f(uMouseLoc, rawMouse.x * scaleX, (height - rawMouse.y) * scaleY);

      gl.uniform1f(uComplexityLoc, settingsRef.current.complexity);
      gl.uniform1f(uIntensityLoc, settingsRef.current.intensity);
      gl.uniform1f(uOpacityLoc, settingsRef.current.opacity / 100);

      const { col1, col2, col3 } = settingsRef.current;
      gl.uniform3f(uCol1Loc, col1.r, col1.g, col1.b);
      gl.uniform3f(uCol2Loc, col2.r, col2.g, col2.b);
      gl.uniform3f(uCol3Loc, col3.r, col3.g, col3.b);
      gl.uniform1f(uAlgLoc, settingsRef.current.plasmaAlgorithm);
      gl.uniform1f(uScaleLoc, settingsRef.current.scale);
      gl.uniform1f(uTurbulenceLoc, settingsRef.current.turbulence);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      const endRender = performance.now();
      window.dispatchEvent(new CustomEvent('frame-time', { detail: endRender - startRender }));

      animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      resizeObserver.disconnect();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [useFallback]);

  // CPU Резервный отрисовщик (Canvas 2D) для слабых систем
  useEffect(() => {
    if (!useFallback || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Низкое разрешение сетки расчетов для CPU во избежание лагов (120x80)
    const w = 120;
    const h = 80;
    canvas.width = w;
    canvas.height = h;

    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    const renderLoopFallback = () => {
      const startRender = performance.now();
      const dt = startRender - prevTimeRef.current;
      prevTimeRef.current = startRender;

      if (!settingsRef.current.isPaused) {
        accumulatedTimeRef.current += (dt * 0.001) * settingsRef.current.speed;
      }

      const time = accumulatedTimeRef.current;
      const complexity = Math.min(3.0, settingsRef.current.complexity); // Ограничение слоев для CPU
      const algorithm = settingsRef.current.plasmaAlgorithm;
      const intensity = settingsRef.current.intensity;
      const scaleSetting = settingsRef.current.scale;
      const turbSetting = settingsRef.current.turbulence;
      const { col1, col2, col3 } = settingsRef.current;
      const opacityFactor = settingsRef.current.opacity / 100;

      for (let y = 0; y < h; y++) {
        const ny = y / h - 0.5;
        for (let x = 0; x < w; x++) {
          const nx = (x / w - 0.5) * (w / h);
          
          let px = nx * scaleSetting;
          let py = ny * scaleSetting;
          let val = 0;
          let strength = 1.0;
          let freq = 1.0;

          const cpuRotate = (xVal: number, yVal: number, angle: number) => {
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            return { x: xVal * c - yVal * s, y: xVal * s + yVal * c };
          };

          for (let i = 0; i < 3; i++) {
            if (i >= complexity) break;
            const fi = i;

            if (algorithm === 3) { // Cosmic Supernova Fire
              px += Math.sin(py * 1.1 + time * 0.5) * turbSetting * 0.2;
              py += Math.cos(px * 1.1 - time * 0.4) * turbSetting * 0.2;
              const rotated = cpuRotate(px, py, 0.35 + fi);
              px = rotated.x;
              py = rotated.y;
              const v1 = 1.0 - Math.abs(Math.sin(px * freq + time * 1.3));
              const v2 = 1.0 - Math.abs(Math.cos(py * freq - time * 1.1));
              val += (v1 * v2) * strength;
              freq *= 1.9;
              strength *= 0.48;
            } else if (algorithm === 2) { // Cyber Quantum Waves
              px += Math.cos(py * 2.0 + time * 0.4) * turbSetting * 0.12;
              py += Math.sin(px * 2.0 - time * 0.3) * turbSetting * 0.12;
              const rotated = cpuRotate(px, py, 0.8 + fi * 0.4);
              px = rotated.x;
              py = rotated.y;
              val += Math.sin(px * freq + py * freq + time * 1.5) * strength;
              freq *= 1.6;
              strength *= 0.6;
            } else if (algorithm === 1) { // Swirling Vortex
              const r_dist = Math.sqrt(px * px + py * py);
              const angle_spiral = r_dist * turbSetting * 1.8 - time * 0.6;
              const spiralRot = cpuRotate(px, py, angle_spiral);
              px = spiralRot.x;
              py = spiralRot.y;

              px += Math.sin(py * 1.5 + time * 0.3) * turbSetting * 0.1;
              py += Math.cos(px * 1.2 - time * 0.2) * turbSetting * 0.1;
              const rotated = cpuRotate(px, py, 1.1 + fi);
              px = rotated.x;
              py = rotated.y;
              val += Math.sin(px * freq + time * 1.2) * Math.sin(py * freq + time * 0.9) * strength;
              freq *= 1.8;
              strength *= 0.5;
            } else { // Standard
              px += Math.sin(py + time * 0.2) * turbSetting * 0.15;
              py += Math.cos(px + time * 0.15) * turbSetting * 0.15;
              const rotated = cpuRotate(px, py, 0.5 + fi);
              px = rotated.x;
              py = rotated.y;
              val += Math.sin(px * freq + time) * Math.cos(py * freq - time * 0.8) * strength;
              freq *= 1.7;
              strength *= 0.55;
            }
          }

          if (algorithm === 2) {
            val = Math.sin(val * 3.0 + time * 0.5);
          }

          val = (val + 1.0) * 0.5;
          val = Math.min(1.0, Math.max(0.0, val));
          val = Math.pow(val, 1.0 / Math.max(0.1, intensity));

          // Смешивание RGB каналов
          const r1 = col1.r * (1 - val) + col2.r * val;
          const g1 = col1.g * (1 - val) + col2.g * val;
          const b1 = col1.b * (1 - val) + col2.b * val;

          const valSq = val * val;
          const finalR = Math.min(255, Math.max(0, Math.round((r1 * (1 - valSq) + col3.r * valSq) * 255)));
          const finalG = Math.min(255, Math.max(0, Math.round((g1 * (1 - valSq) + col3.g * valSq) * 255)));
          const finalB = Math.min(255, Math.max(0, Math.round((b1 * (1 - valSq) + col3.b * valSq) * 255)));

          const idx = (y * w + x) * 4;
          data[idx] = finalR;
          data[idx + 1] = finalG;
          data[idx + 2] = finalB;
          data[idx + 3] = Math.round(opacityFactor * 255);
        }
      }

      ctx.putImageData(imgData, 0, 0);

      const endRender = performance.now();
      window.dispatchEvent(new CustomEvent('frame-time', { detail: endRender - startRender }));

      animationFrameId.current = requestAnimationFrame(renderLoopFallback);
    };

    renderLoopFallback();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [useFallback]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none"
      style={{
        filter: settings.blur > 0 ? `blur(${settings.blur}px)` : 'none',
        background: 'transparent'
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: settings.opacity / 100,
          imageRendering: useFallback ? 'pixelated' : 'auto',
          transform: 'scale(1.01)' // Исключает артефакты пиксельных границ
        }}
      />
    </div>
  );
});

CosmicPlasmaNebula.displayName = 'CosmicPlasmaNebula';
export default CosmicPlasmaNebula;
