import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Типизация настроек
export interface WaveSettings {
  speed: number;                  // Скорость анимации волн (например, 1.0)
  amplitude: number;              // Множитель высоты волн (например, 1.0)
  wavelength: number;             // Длина волны / частота (например, 1.0)
  jitter: number;                 // Хаотичность сетки (джиттер)
  shininess: number;              // Сила бликов (от 10 до 200)
  environmentReflection: boolean; // Включить/выключить отражение карты окружения
  reflectionImageUrl?: string;    // Ссылка на эквидистантную панораму для отражений
  posY: number;                   // Смещение сетки по вертикали (например, 0)
  rotationX: number;              // Наклон сетки по оси X в градусах
  rotationY: number;              // Наклон сетки по оси Y в градусах
  zoom: number;                   // Зум камеры (например, 1.0)
  topDown: boolean;               // Вид строго сверху (ортографическая имитация)
  color?: string;                 // Цвет волн
  opacity?: number;               // Прозрачность всего слоя
}

interface FlatWavesProps {
  settings: WaveSettings;
}

export default function FlatWaves({ settings }: FlatWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef(settings);

  // Синхронизируем настройки в реальном времени, избегая перезапуска useEffect
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let animationFrameId: number;
    
    // 1. Создание сцены и тумана для плавного ухода плоскости в даль
    const scene = new THREE.Scene();
    const bgColor = '#033b7a'; // Глубокий темно-синий цвет фона по умолчанию
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.Fog(bgColor, 150, 450); // Туман от 150 до 450 единиц
    
    // 2. Настройка камеры
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.set(0, 100, 150);
    camera.lookAt(0, 0, 0);

    // 3. Рендерер
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Ограничиваем dpr ради производительности
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // 4. Генератор PMREM для реалистичных глянцевых отражений (карта освещения)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    let loadedUrl = '';
    let currentEnvMap: THREE.Texture | null = null;
    let pmremTarget: THREE.WebGLRenderTarget | null = null;

    // 5. Материал с эффектом плоского затенения (Flat Shading)
    const material = new THREE.MeshStandardMaterial({
      color: settingsRef.current.color || '#0561c9',       // Базовый цвет волны
      roughness: Math.max(0.001, Math.min(1.0, 1.0 - (settingsRef.current.shininess - 10) / 190.0)),
      metalness: settingsRef.current.environmentReflection ? 0.85 : 0.15,
      emissive: '#041f47',    // Цвет теней на стыках (насыщенный темно-синий)
      flatShading: true,      // КЛЮЧЕВОЙ параметр: отключает интерполяцию нормалей, создавая граненый "low-poly" вид
      side: THREE.DoubleSide,
    });

    // Функция динамической загрузки карты отражений
    const loadReflectionTexture = (url: string) => {
      if (!url) return;
      loadedUrl = url;

      const textureLoader = new THREE.TextureLoader();
      textureLoader.setCrossOrigin('anonymous');
      textureLoader.load(
        url,
        (tex) => {
          if (loadedUrl !== url) {
            tex.dispose();
            return;
          }
          if (pmremTarget) pmremTarget.dispose();
          if (currentEnvMap) currentEnvMap.dispose();

          tex.mapping = THREE.EquirectangularReflectionMapping;
          const target = pmremGenerator.fromEquirectangular(tex);
          pmremTarget = target;
          currentEnvMap = target.texture;

          if (settingsRef.current.environmentReflection) {
            material.envMap = currentEnvMap;
            material.needsUpdate = true;
          }
          tex.dispose();
        },
        undefined,
        (err) => console.error('Error loading texture:', err)
      );
    };

    if (settingsRef.current.reflectionImageUrl) {
      loadReflectionTexture(settingsRef.current.reflectionImageUrl);
    }

    // 6. Геометрия плоскости и создание сетки
    const width = 1200;
    const depth = 1200;
    const segX = 45; // Количество сегментов (полигонов)
    const segZ = 45;
    
    const geometry = new THREE.PlaneGeometry(width, depth, segX, segZ);
    geometry.rotateX(-Math.PI / 2); // Кладем плоскость горизонтально
    
    // Рандомизация (джиттеринг) вершин для создания хаотичной низкополигональной структуры
    const positionAttribute = geometry.attributes.position;
    const vertexData = [];
    
    for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        const z = positionAttribute.getZ(i);

        // Края плоскости не сдвигаем (jitter = 0), чтобы не было дыр на стыке с туманом
        const isEdge = Math.abs(Math.abs(x) - width / 2) < 1.0 || Math.abs(Math.abs(z) - depth / 2) < 1.0;
        
        const jitterX = isEdge ? 0 : (Math.random() - 0.5) * (width / segX);
        const jitterZ = isEdge ? 0 : (Math.random() - 0.5) * (depth / segZ) * 0.8;

        vertexData.push({
            origX: x,
            origY: y,
            origZ: z,
            jitterOffsetX: jitterX,
            jitterOffsetZ: jitterZ,
        });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = -20;
    scene.add(mesh);

    // 7. Освещение (неподвижное в пространстве)
    const ambientLight = new THREE.AmbientLight('#001230', 1.2); // Increased ambient
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight('#ffffff', 4.4); // Doubled intensity
    directionalLight1.position.set(-150, 200, -100);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight('#0e5bbd', 3.0); // Doubled intensity
    directionalLight2.position.set(150, 100, 150);
    scene.add(directionalLight2);

    // 8. Цикл анимации
    let time = 0;
    const targetLookAt = new THREE.Vector3(0, 0, 0);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const current = settingsRef.current;
      
      time += 0.01 * current.speed; 

      // Применяем параметры материала
      material.roughness = Math.max(0.001, Math.min(1.0, 1.0 - (current.shininess - 10) / 190.0));
      if (current.color) material.color.set(current.color);

      mesh.position.y = -20 + current.posY;
      mesh.rotation.x = THREE.MathUtils.degToRad(current.rotationX);
      mesh.rotation.y = THREE.MathUtils.degToRad(current.rotationY);
      camera.zoom = current.zoom;

      // Плавное следование камеры за переключением режимов (Обычный / Сверху)
      const targetX = 0;
      const targetY = current.topDown ? 300 : 100;
      const targetZ = current.topDown ? 0.05 : 150;

      camera.position.x += (targetX - camera.position.x) * 0.08;
      camera.position.y += (targetY - camera.position.y) * 0.08;
      camera.position.z += (targetZ - camera.position.z) * 0.08;
      camera.lookAt(targetLookAt);
      camera.updateProjectionMatrix();

      // 9. Динамический расчет волн математическими формулами на CPU
      for (let i = 0; i < positionAttribute.count; i++) {
          const vd = vertexData[i];
          
          // Позиция вершины с учетом настроек хаотичности (джиттера)
          const actualX = vd.origX + vd.jitterOffsetX * current.jitter;
          const actualZ = vd.origZ + vd.jitterOffsetZ * current.jitter;

          const kx = 0.008 / current.wavelength;
          const kz = 0.012 / current.wavelength;

          // Три наложенные друг на друга тригонометрические волны для природной хаотичности
          const wave1 = Math.sin(actualX * kx + time * 1.5) * 20 * current.amplitude;
          const wave2 = Math.cos(actualZ * kz + time * 1.2) * 15 * current.amplitude;
          const wave3 = Math.sin((actualX + actualZ) * (0.01 / current.wavelength) + time) * 10 * current.amplitude;
          
          positionAttribute.setXYZ(
            i, 
            actualX, 
            vd.origY + wave1 + wave2 + wave3, 
            actualZ
          );
      }
      
      positionAttribute.needsUpdate = true;
      
      // Пересчитываем нормали полигонов, чтобы освещение ложилось на новые изгибы сетки
      geometry.computeVertexNormals();

      renderer.render(scene, camera);
    };

    animate();

    // Слушатель ресайза через ResizeObserver (более надежно для вложенных контейнеров)
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

    // Очистка при размонтировании компонента
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      material.dispose();
      if (pmremTarget) pmremTarget.dispose();
      if (currentEnvMap) currentEnvMap.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full block bg-[#033b7a] overflow-hidden" 
      style={{ opacity: (settings.opacity ?? 100) / 100 }}
    />
  );
}
