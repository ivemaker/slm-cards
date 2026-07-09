import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export interface CloudsSettings {
  speed: number;
  cloudCount: number;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  cloudImage: string;
  bgGradientColor1: string;
  bgGradientColor2: string;
  cameraHeight: number;
  scrollCameraStart?: number;
  scrollCameraEnd?: number;
  scrollLimit?: number;
  opacity?: number;
}

interface Clouds3DProps {
  settings?: Partial<CloudsSettings>;
  scrollOffset?: number;
}

const DEFAULT_CLOUDS_SETTINGS: CloudsSettings = {
  speed: 0.03,
  cloudCount: 8000,
  fogColor: '#4584b4',
  fogNear: -100,
  fogFar: 3000,
  cloudImage: 'https://mrdoob.com/lab/javascript/webgl/clouds/cloud10.png',
  bgGradientColor1: '#326696',
  bgGradientColor2: '#4584b4',
  cameraHeight: 0,
  scrollCameraStart: 0,
  scrollCameraEnd: -200,
  scrollLimit: 1000,
};

export const Clouds3D: React.FC<Clouds3DProps> = ({ settings: customSettings, scrollOffset: externalScrollOffset }) => {
  const settings = { ...DEFAULT_CLOUDS_SETTINGS, ...customSettings };
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(externalScrollOffset || 0);
  const lerpScrollRef = useRef(externalScrollOffset || 0);
  
  // Three.js references to avoid re-initialization
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planesMeshRef = useRef<THREE.Mesh | null>(null);
  const planesMeshARef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Update the scroll ref whenever the prop changes
  useEffect(() => {
    if (externalScrollOffset !== undefined) {
      scrollRef.current = externalScrollOffset;
    }
  }, [externalScrollOffset]);

  // Handle initialization and lifecycle
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    
    // Initialize Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Initialize Camera
    const camera = new THREE.PerspectiveCamera(
      30,
      container.clientWidth / container.clientHeight || 1,
      1,
      3000
    );
    camera.position.z = 6000;
    cameraRef.current = camera;

    // Initialize Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) {
          const width = entry.contentRect.width || container.clientWidth;
          const height = entry.contentRect.height || container.clientHeight;
          if (width > 0 && height > 0) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
          }
        }
      }
    });
    resizeObserver.observe(container);
    resizeObserverRef.current = resizeObserver;
    
    const cloudShader = {
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform vec3 fogColor;
        uniform float fogNear;
        uniform float fogFar;
        varying vec2 vUv;

        void main() {
          float depth = gl_FragCoord.z / gl_FragCoord.w;
          float fogFactor = smoothstep( fogNear, fogFar, depth );

          gl_FragColor = texture2D( map, vUv );
          gl_FragColor.w *= pow( gl_FragCoord.z, 20.0 );
          gl_FragColor = mix( gl_FragColor, vec4( fogColor , gl_FragColor.w ), fogFactor );
        }
      `
    };

    const loadTexture = async () => {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.setCrossOrigin("anonymous");
      try {
        const texture = await textureLoader.loadAsync(settings.cloudImage);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        
        const material = new THREE.ShaderMaterial({
          uniforms: {
            map: { value: texture },
            fogColor: { value: new THREE.Color(settings.fogColor) },
            fogNear: { value: settings.fogNear },
            fogFar: { value: settings.fogFar }
          },
          vertexShader: cloudShader.vertexShader,
          fragmentShader: cloudShader.fragmentShader,
          depthWrite: false,
          depthTest: false,
          transparent: true
        });

        const planeGeo = new THREE.PlaneGeometry(64, 64);
        const planeObj = new THREE.Object3D();
        const geometries = [];

        for (let i = 0; i < settings.cloudCount; i++) {
          planeObj.position.x = Math.random() * 1000 - 500;
          planeObj.position.y = -Math.random() * Math.random() * 200 - 15;
          planeObj.position.z = i;
          planeObj.rotation.z = Math.random() * Math.PI;
          planeObj.scale.x = planeObj.scale.y =
            Math.random() * Math.random() * 1.5 + 0.5;
          planeObj.updateMatrix();

          const clonedPlaneGeo = planeGeo.clone();
          clonedPlaneGeo.applyMatrix4(planeObj.matrix);
          geometries.push(clonedPlaneGeo);
        }

        const planeGeos = BufferGeometryUtils.mergeGeometries(geometries);
        const planesMesh = new THREE.Mesh(planeGeos, material);
        planesMesh.renderOrder = 2;
        planesMeshRef.current = planesMesh;

        const planesMeshA = planesMesh.clone();
        planesMeshA.position.z = -settings.cloudCount;
        planesMeshA.renderOrder = 1;
        planesMeshARef.current = planesMeshA;

        scene.add(planesMesh);
        scene.add(planesMeshA);
      } catch (err) {
        console.error("Failed to load cloud texture", err);
      }
    };
    
    loadTexture();

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // We use current settings from the loop scope if they are captured, 
      // but it's better to use a ref for settings too or just rely on the re-init if really needed.
      // Actually, we want to update some things dynamically.
      
      // Since this animate is created on mount, it captures initial settings.
      // We need a ref for settings.
    };
    
    // Actually, let's keep the animate loop but use refs for everything that changes.
    
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      if (rendererRef.current) {
        if (rendererRef.current.domElement.parentElement) {
          rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
      if (planesMeshRef.current) planesMeshRef.current.geometry.dispose();
      if (planesMeshARef.current) planesMeshARef.current.geometry.dispose();
    };
  }, []); // Only run once on mount

  // Ref for settings to use in the animation loop without re-initializing
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
    
    // Update fog and material properties without re-init
    if (sceneRef.current) {
      const fogColor = new THREE.Color(settings.fogColor);
      sceneRef.current.fog = new THREE.Fog(fogColor, settings.fogNear, settings.fogFar);
      
      if (planesMeshRef.current) {
        const material = planesMeshRef.current.material as THREE.ShaderMaterial;
        if (material.uniforms) {
          material.uniforms.fogColor.value = fogColor;
          material.uniforms.fogNear.value = settings.fogNear;
          material.uniforms.fogFar.value = settings.fogFar;
        }
      }
    }
  }, [settings.fogColor, settings.fogNear, settings.fogFar]);

  // Separate effect for animation to handle speed and other updates
  useEffect(() => {
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (!cameraRef.current || !rendererRef.current || !sceneRef.current) return;
      
      const s = settingsRef.current;
      const position = ((Date.now() - startTimeRef.current) * s.speed) % s.cloudCount;

      lerpScrollRef.current += (scrollRef.current - lerpScrollRef.current) * 0.1;
      const effectiveScrollY = lerpScrollRef.current;
      
      let currentY = s.cameraHeight;
      if (s.scrollCameraStart !== undefined && s.scrollCameraEnd !== undefined && s.scrollLimit) {
        const scrollProgress = Math.min(Math.max(effectiveScrollY / s.scrollLimit, 0), 1);
        currentY = s.scrollCameraStart + (s.scrollCameraEnd - s.scrollCameraStart) * scrollProgress;
      } else {
        currentY = s.cameraHeight - effectiveScrollY * 0.1;
      }

      cameraRef.current.position.y = currentY;
      cameraRef.current.position.z = -position + s.cloudCount;

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, []); // Only one animation loop

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          background: `linear-gradient(to bottom, ${settings.bgGradientColor1}, ${settings.bgGradientColor2})`,
          opacity: settings.opacity !== undefined ? settings.opacity / 100 : 1 
        }}
      />
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};
