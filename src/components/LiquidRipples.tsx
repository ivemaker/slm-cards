import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { LiquidSettings } from '../types';

interface LiquidRipplesProps {
  settings: LiquidSettings;
}

export function LiquidRipples({ settings }: LiquidRipplesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Счётчик тиков анимации (время)
  const countRef = useRef<number>(0);

  // Сохраняем настройки в ref, чтобы изменять их на лету без пересоздания Three.js сцены
  const settingsRef = useRef<LiquidSettings>(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Инициализация сцены, камеры и WebGL рендерера
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(100, width / height, 1, 15000);
    camera.position.z = settingsRef.current.cameraDepth;
    camera.position.y = settingsRef.current.cameraHeight;
    camera.position.x = 0;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true, // Прозрачный фон, чтобы был виден фоновый градиент
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';

    // 2. Создание геометрии сетки частиц (буферные массивы)
    const gridX = Math.round(settingsRef.current.gridX);
    const gridY = Math.round(settingsRef.current.gridY);
    const particleCount = gridX * gridY;
    const separation = settingsRef.current.separation;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizeScale = new Float32Array(particleCount);

    // Первоначальное плоское распределение точек по сетке XZ
    let i = 0;
    for (let ix = 0; ix < gridX; ix++) {
      for (let iy = 0; iy < gridY; iy++) {
        positions[i * 3] = ix * separation - ((gridX * separation) / 2);
        positions[i * 3 + 1] = 0; // Высота Y (будет изменяться в цикле)
        positions[i * 3 + 2] = iy * separation - ((gridY * separation) / 2);
        
        sizeScale[i] = 1.0;
        i++;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('sizeScale', new THREE.BufferAttribute(sizeScale, 1));

    // Custom Shaders для отрисовки идеально сглаженных, светящихся кругов
    const vertexShader = `
      attribute float sizeScale;
      varying float vSizeScale;
      varying float vHeight;
      uniform float uSize;
      
      void main() {
        vSizeScale = sizeScale;
        vHeight = position.y;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        // Перспективное затухание размера (точки уменьшаются по мере удаления от камеры)
        gl_PointSize = uSize * (1500.0 / -mvPosition.z) * sizeScale;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform vec3 uColor;
      varying float vSizeScale;
      varying float vHeight;
      
      void main() {
        // Отрисовка круга из квадратного спрайта точки
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;
        
        // Мягкое сглаживание краев (anti-aliasing) и эффект центрального свечения
        float alpha = smoothstep(0.5, 0.15, dist);
        
        // Слегка меняем яркость частицы в зависимости от её высоты (гребень/впадина)
        float heightFactor = clamp((vHeight + 100.0) / 200.0, 0.4, 1.3);
        vec3 finalColor = uColor * heightFactor;
        
        gl_FragColor = vec4(finalColor, alpha * 0.95);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(settingsRef.current.particleColor) },
        uSize: { value: settingsRef.current.particleSize }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending // Аддитивное смешивание для красивого неонового свечения при наложении
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Основной анимационный цикл
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      const startTime = performance.now();
      const dt = clock.getDelta();
      const s = settingsRef.current;

      // Динамическое обновление униформов шейдера без пересоздания объектов
      material.uniforms.uColor.value.set(s.particleColor);
      material.uniforms.uSize.value = s.particleSize;

      // Наращиваем фазу волны на основе прошедшего времени и скорости
      countRef.current += dt * s.waveSpeed * 8.5;
      const count = countRef.current;

      // Плавное следование камеры за изменениями в настройках
      camera.position.x = 0;
      camera.position.y += (s.cameraHeight - camera.position.y) * 0.08;
      camera.position.z += (s.cameraDepth - camera.position.z) * 0.08;
      
      const targetY = camera.position.y - 120;
      camera.lookAt(new THREE.Vector3(0, targetY, 0));

      const positions = geometry.attributes.position.array as Float32Array;
      const positionAttr = geometry.attributes.position;
      const sizeScaleArray = geometry.attributes.sizeScale.array as Float32Array;

      // Расчет высоты волны по формуле двойного синуса для каждой точки сетки
      for (let ix = 0; ix < gridX; ix++) {
        for (let iy = 0; iy < gridY; iy++) {
          const idx = ix * gridY + iy;
          const px = ix * separation - ((gridX * separation) / 2);
          const pz = iy * separation - ((gridY * separation) / 2);

          const waveFreq = Math.max(0.0001, s.waveFrequency || 0.01);
          const waveAmp = isNaN(s.waveAmplitude) ? 10 : s.waveAmplitude;

          // Формула сложной 3D волны (суперпозиция двух синусоид по осям X и Y)
          let py = (Math.sin((ix + count) * waveFreq) * waveAmp) + 
                   (Math.sin((iy + count) * waveFreq * 1.66) * waveAmp);
          if (isNaN(py)) py = 0;

          // Размер точки колеблется в такт волне
          let pScale = (Math.sin((ix + count) * waveFreq) + 1) * 2 + 
                       (Math.sin((iy + count) * waveFreq * 1.66) * 1.5 + 1.5);
          if (isNaN(pScale)) pScale = 1;

          positions[idx * 3] = px;
          positions[idx * 3 + 1] = py;
          positions[idx * 3 + 2] = pz;

          sizeScaleArray[idx] = pScale;
        }
      }

      // Сообщаем Three.js, что данные в буферах изменились, и их нужно перерисовать
      positionAttr.needsUpdate = true;
      geometry.attributes.sizeScale.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
      const endTime = performance.now();
      window.dispatchEvent(new CustomEvent('frame-time', { detail: endTime - startTime }));
    };

    animate();

    // 4. Слушатель изменения размеров экрана через ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) {
          const width = entry.contentRect.width;
          const height = entry.contentRect.height;
          
          if (width === 0 || height === 0) return;

          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
      }
    });
    resizeObserver.observe(container);

    // Освобождение ресурсов при демонтировании компонента
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      
      scene.remove(particles);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [settings.gridX, settings.gridY, settings.separation]); // Сетка пересоздается только при изменении размеров структуры

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full overflow-hidden select-none"
      style={{
        background: `linear-gradient(135deg, ${settings.bgGradientStart} 0%, ${settings.bgGradientEnd} 100%)`,
        opacity: settings.opacity !== undefined ? settings.opacity / 100 : 1.0
      }}
    >
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/40 to-transparent opacity-40 pointer-events-none" />
      <canvas ref={canvasRef} className="block w-full h-full relative z-10" />
    </div>
  );
}

export default LiquidRipples;
