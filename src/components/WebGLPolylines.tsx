import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import chroma from 'chroma-js';
import { PolylineSettings } from '../types';

interface WebGLPolylinesProps {
  settings: PolylineSettings;
}

// Вспомогательный класс для построения геометрии ломаных линий (полилиний)
const tmpVector = new THREE.Vector3();

class PolylineHelper {
  points: THREE.Vector3[];
  count: number;
  geometry!: THREE.BufferGeometry;
  position!: Float32Array;
  prev!: Float32Array;
  next!: Float32Array;

  constructor(points: THREE.Vector3[]) {
    this.points = points;
    this.count = points.length;
    this.init();
    this.updateGeometry();
  }

  init() {
    this.geometry = new THREE.BufferGeometry();
    this.position = new Float32Array(this.count * 3 * 2);
    this.prev = new Float32Array(this.count * 3 * 2);
    this.next = new Float32Array(this.count * 3 * 2);
    const side = new Float32Array(this.count * 1 * 2);
    const uv = new Float32Array(this.count * 2 * 2);
    const index = new Uint16Array((this.count - 1) * 3 * 2);

    for (let i = 0; i < this.count; i++) {
      const i2 = i * 2;
      side.set([-1, 1], i2);
      const v = i / (this.count - 1);
      uv.set([0, v, 1, v], i * 4);

      if (i === this.count - 1) continue;
      index.set([i2 + 0, i2 + 1, i2 + 2], (i2 + 0) * 3);
      index.set([i2 + 2, i2 + 1, i2 + 3], (i2 + 1) * 3);
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.position, 3));
    this.geometry.setAttribute('prev', new THREE.BufferAttribute(this.prev, 3));
    this.geometry.setAttribute('next', new THREE.BufferAttribute(this.next, 3));
    this.geometry.setAttribute('side', new THREE.BufferAttribute(side, 1));
    this.geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    this.geometry.setIndex(new THREE.BufferAttribute(index, 1));
  }

  updateGeometry() {
    this.points.forEach((p, i) => {
      p.toArray(this.position, i * 3 * 2);
      p.toArray(this.position, i * 3 * 2 + 3);

      if (!i) {
        tmpVector.copy(p).sub(this.points[i + 1]).add(p);
        tmpVector.toArray(this.prev, i * 3 * 2);
        tmpVector.toArray(this.prev, i * 3 * 2 + 3);
      } else {
        p.toArray(this.next, (i - 1) * 3 * 2);
        p.toArray(this.next, (i - 1) * 3 * 2 + 3);
      }

      if (i === this.points.length - 1) {
        tmpVector.copy(p).sub(this.points[i - 1]).add(p);
        tmpVector.toArray(this.next, i * 3 * 2);
        tmpVector.toArray(this.next, i * 3 * 2 + 3);
      } else {
        p.toArray(this.prev, (i + 1) * 3 * 2);
        p.toArray(this.prev, (i + 1) * 3 * 2 + 3);
      }
    });

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.prev.needsUpdate = true;
    this.geometry.attributes.next.needsUpdate = true;
  }
}

export default function WebGLPolylines({ settings }: WebGLPolylinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const uniformsRef = useRef<{
    uTime: { value: number };
    uTimeCoef: { value: number };
  }>({
    uTime: { value: 0 },
    uTimeCoef: { value: settings.speed }
  });

  const getColorScale = (scheme: string) => {
    switch (scheme) {
      case 'ocean':
        return chroma.scale(['#03045e', '#0077b6', '#00b4d8', '#90e0ef', '#caf0f8']).mode('lch');
      case 'sunset':
        return chroma.scale(['#3a0ca3', '#7209b7', '#f72585', '#f15bb5', '#fee440']).mode('lch');
      case 'forest':
        return chroma.scale(['#132a13', '#31572c', '#4f772d', '#90a955', '#ecf39e']).mode('lch');
      case 'neon':
        return chroma.scale(['#00f0ff', '#ff00ff', '#ffff00', '#00ff00', '#ff0000', '#7000ff']).mode('lch');
      default:
        return chroma.scale(['#2175D8', '#DC5DCE', '#CC223D', '#F07414', '#FDEE61', '#74C425']).mode('lch');
    }
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5;
    cameraRef.current = camera;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Шейдер вершин (расчёт изгибов и волн прямо на GPU)
    const vertexShader = `
      uniform float uTime, uTimeCoef;
      uniform float uSize;
      uniform mat2 uMat2;
      uniform vec3 uRnd1;
      uniform vec3 uRnd2;
      uniform vec3 uRnd3;
      uniform vec3 uRnd4;
      uniform vec3 uRnd5;
      attribute vec3 next, prev; 
      attribute float side;
      varying vec2 vUv;

      vec2 dp(vec2 sv) {
        return (1.5 * sv * uMat2);
      }

      void main() {
        vUv = uv;

        vec2 pos = dp(position.xy);

        vec2 normal = dp(vec2(1.0, 0.0));
        normal *= uSize;

        float time = uTime * uTimeCoef;
        vec3 rnd1 = vec3(cos(time * uRnd1.x + uRnd3.x), cos(time * uRnd1.y + uRnd3.y), cos(time * uRnd1.z + uRnd3.z));
        vec3 rnd2 = vec3(cos(time * uRnd2.x + uRnd4.x), cos(time * uRnd2.y + uRnd4.y), cos(time * uRnd2.z + uRnd4.z));
        normal *= 1.0
          + uRnd5.x * (cos((position.y + rnd1.x) * 20.0 * rnd1.y) + 1.0)
          + uRnd5.y * (sin((position.y + rnd2.x) * 20.0 * rnd2.y) + 1.0)
          + uRnd5.z * (cos((position.y + rnd1.z) * 20.0 * rnd2.z) + 1.0);
        pos.xy -= normal * side;

        gl_Position = vec4(pos, 0.0, 1.0);
      }
    `;

    // Фрагментный шейдер (красивый градиентный перелив вдоль полос)
    const fragmentShader = `
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      varying vec2 vUv;
      void main() {
        gl_FragColor = vec4(mix(uColor1, uColor2, vUv.x), 1.0);
      }
    `;

    const rnd = (min: number, max: number) => Math.random() * (max - min) + min;

    const safeNx = Math.max(1, settings.nx || 1);
    const safeNy = Math.max(2, settings.ny || 2);

    const dx = 2 / safeNx;
    const dy = -2 / (safeNy - 1);
    const ox = -1 + dx / 2;
    const oy = 1;

    // Матрица поворота 2D на основе заданного угла
    const angleRad = ((settings.angle || 0) * Math.PI) / 180;
    const mat2 = new Float32Array([
      Math.cos(angleRad), -Math.sin(angleRad),
      Math.sin(angleRad),  Math.cos(angleRad)
    ]);

    const cscale = getColorScale(settings.colorScheme);
    const meshes: THREE.Mesh[] = [];

    // Создаём сетку полилиний
    for (let i = 0; i < safeNx; i++) {
      const points: THREE.Vector3[] = [];
      for (let j = 0; j < safeNy; j++) {
        const x = ox + i * dx;
        const y = oy + j * dy;
        points.push(new THREE.Vector3(x, y, 0));
      }

      const polyline = new PolylineHelper(points);
      
      const col1 = chroma(cscale(i / safeNx).hex()).rgb();
      const col2 = chroma(cscale(i / safeNx).darken(settings.darken || 0).hex()).rgb();

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: uniformsRef.current.uTime,
          uTimeCoef: uniformsRef.current.uTimeCoef,
          uMat2: { value: mat2 },
          uSize: { value: (1.5 / safeNx) * (settings.thickness || 1) },
          uRnd1: { value: new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)) },
          uRnd2: { value: new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)) },
          uRnd3: { value: new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)) },
          uRnd4: { value: new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)) },
          uRnd5: { value: new THREE.Vector3(rnd(0.2, 0.5), rnd(0.3, 0.6), rnd(0.4, 0.7)) },
          uColor1: { value: new THREE.Color(col1[0] / 255, col1[1] / 255, col1[2] / 255) },
          uColor2: { value: new THREE.Color(col2[0] / 255, col2[1] / 255, col2[2] / 255) }
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      });

      const mesh = new THREE.Mesh(polyline.geometry, material);
      scene.add(mesh);
      meshes.push(mesh);
    }

    uniformsRef.current.uTimeCoef.value = settings.speed;

    const clock = new THREE.Clock();
    const animate = () => {
      const startTime = performance.now();
      uniformsRef.current.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
      const endTime = performance.now();
      window.dispatchEvent(new CustomEvent('frame-time', { detail: endTime - startTime }));
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      if (w > 0 && h > 0) {
        rendererRef.current.setSize(w, h);
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

      meshes.forEach(mesh => {
        scene.remove(mesh);
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
      });

      renderer.dispose();
    };
  }, [
    settings.nx,
    settings.ny,
    settings.thickness,
    settings.darken,
    settings.colorScheme,
    settings.angle,
    settings.speed
  ]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full overflow-hidden select-none"
      style={{ opacity: (settings.opacity ?? 100) / 100 }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
