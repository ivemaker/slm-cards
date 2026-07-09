import React, { useEffect, useRef } from 'react';

export interface TopoLayer {
  color: string;
  opacity?: number;
  image?: string | null;
  blur?: number;
  shadow?: boolean;
  shadowBlur?: number;
  shadowOpacity?: number;
  shadowAngle?: number;
  shadowDistance?: number;
}

export interface TopoSettings {
  scale: number;
  speed: number;
  colors: TopoLayer[];
  backgroundImage?: string | null;
}

interface NoiseTopographyProps {
  settings?: Partial<TopoSettings>;
}

const DEFAULT_SETTINGS: TopoSettings = {
  scale: 1.8,
  speed: 0.4,
  colors: [
    { color: '#09090b', opacity: 100 },
    { color: '#18181b', opacity: 100, shadow: true, shadowBlur: 12, shadowOpacity: 50, shadowDistance: 6, shadowAngle: 60 },
    { color: '#27272a', opacity: 100, shadow: true, shadowBlur: 12, shadowOpacity: 50, shadowDistance: 6, shadowAngle: 60 },
    { color: '#3f3f46', opacity: 100, shadow: true, shadowBlur: 12, shadowOpacity: 50, shadowDistance: 6, shadowAngle: 60 },
    { color: '#52525b', opacity: 100, shadow: true, shadowBlur: 12, shadowOpacity: 50, shadowDistance: 6, shadowAngle: 60 }
  ]
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255.0,
    g: parseInt(result[2], 16) / 255.0,
    b: parseInt(result[3], 16) / 255.0,
  } : { r: 0, g: 0, b: 0 };
};

export const NoiseTopography: React.FC<NoiseTopographyProps> = ({ settings: customSettings }) => {
  const settings = { ...DEFAULT_SETTINGS, ...customSettings };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedImages, setLoadedImages] = React.useState<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    const uniqueImages = Array.from(new Set<string>(
      settings.colors
        .map(c => c.image)
        .filter((img): img is string => typeof img === 'string' && img !== '')
    ));

    uniqueImages.forEach((imgSrc: string) => {
      if (loadedImages[imgSrc]) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imgSrc;
      img.onload = () => {
        setLoadedImages(prev => ({
          ...prev,
          [imgSrc]: img
        }));
      };
    });
  }, [settings.colors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext;
    if (!gl) return;

    let animationFrameId: number;
    let w = window.innerWidth;
    let h = window.innerHeight;
    
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        w = rect.width || window.innerWidth;
        h = rect.height || window.innerHeight;
    }
    
    canvas.width = w;
    canvas.height = h;

    gl.viewport(0, 0, w, h);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0
      ]),
      gl.STATIC_DRAW
    );

    const vertexShaderSrc = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSrc = `
      #ifdef GL_ES
      precision highp float;
      #endif

      uniform vec2 u_resolution;
      uniform float u_time;
      
      uniform int u_numColors;
      uniform vec4 u_colors[20];
      
      uniform float u_scale;
      uniform int u_hasShadow[20];
      uniform float u_shadowBlur[20];
      uniform float u_shadowOpacity[20];
      uniform float u_shadowAngle[20];
      uniform float u_shadowDistance[20];

      uniform sampler2D u_texture0;
      uniform sampler2D u_texture1;
      uniform sampler2D u_texture2;
      uniform sampler2D u_texture3;
      uniform sampler2D u_texture4;
      uniform sampler2D u_texture5;
      uniform sampler2D u_texture6;
      uniform sampler2D u_texture7;

      uniform int u_layerTextureIdx[20];
      uniform float u_layerBlur[20];

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) { 
        const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;

        i = mod289(i); 
        vec4 p = permute( permute( permute( 
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                      dot(p2,x2), dot(p3,x3) ) );
      }

      vec4 sampleTexture(int idx, vec2 uv) {
        if (idx == 0) return texture2D(u_texture0, uv);
        if (idx == 1) return texture2D(u_texture1, uv);
        if (idx == 2) return texture2D(u_texture2, uv);
        if (idx == 3) return texture2D(u_texture3, uv);
        if (idx == 4) return texture2D(u_texture4, uv);
        if (idx == 5) return texture2D(u_texture5, uv);
        if (idx == 6) return texture2D(u_texture6, uv);
        if (idx == 7) return texture2D(u_texture7, uv);
        return vec4(1.0);
      }

      vec4 getLayerTextureBlurred(int samplerIdx, vec2 uv, float blurPx) {
        if (blurPx <= 0.0) {
            return sampleTexture(samplerIdx, uv);
        }
        vec4 color = vec4(0.0);
        float total = 0.0;
        float stepX = blurPx / u_resolution.x;
        float stepY = blurPx / u_resolution.y;
        for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
                float weight = 1.0 / (1.0 + x*x + y*y);
                color += sampleTexture(samplerIdx, uv + vec2(x * stepX, y * stepY)) * weight;
                total += weight;
            }
        }
        return color / total;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;
        
        st.xy *= u_scale;
        float r = snoise(vec3(st.x, st.y, u_time));
        
        vec4 layerColor = u_colors[0];
        int activeLayerIndex = 0;
        
        for (int i = 0; i < 20; i++) {
            if (i >= u_numColors) break;
            
            if (i == u_numColors - 1) {
                layerColor = u_colors[i];
                activeLayerIndex = i;
                break;
            } else if (r > 1.0 - float(i + 1) * (2.0 / float(u_numColors))) {
                layerColor = u_colors[i];
                activeLayerIndex = i;
                break;
            }
        }
        
        int texIdx = -1;
        float blurVal = 0.0;
        
        if (activeLayerIndex == 0) { texIdx = u_layerTextureIdx[0]; blurVal = u_layerBlur[0]; }
        else if (activeLayerIndex == 1) { texIdx = u_layerTextureIdx[1]; blurVal = u_layerBlur[1]; }
        else if (activeLayerIndex == 2) { texIdx = u_layerTextureIdx[2]; blurVal = u_layerBlur[2]; }
        else if (activeLayerIndex == 3) { texIdx = u_layerTextureIdx[3]; blurVal = u_layerBlur[3]; }
        else if (activeLayerIndex == 4) { texIdx = u_layerTextureIdx[4]; blurVal = u_layerBlur[4]; }
        else if (activeLayerIndex == 5) { texIdx = u_layerTextureIdx[5]; blurVal = u_layerBlur[5]; }
        else if (activeLayerIndex == 6) { texIdx = u_layerTextureIdx[6]; blurVal = u_layerBlur[6]; }
        else if (activeLayerIndex == 7) { texIdx = u_layerTextureIdx[7]; blurVal = u_layerBlur[7]; }
        else if (activeLayerIndex == 8) { texIdx = u_layerTextureIdx[8]; blurVal = u_layerBlur[8]; }
        else if (activeLayerIndex == 9) { texIdx = u_layerTextureIdx[9]; blurVal = u_layerBlur[9]; }
        else if (activeLayerIndex == 10) { texIdx = u_layerTextureIdx[10]; blurVal = u_layerBlur[10]; }
        else if (activeLayerIndex == 11) { texIdx = u_layerTextureIdx[11]; blurVal = u_layerBlur[11]; }
        else if (activeLayerIndex == 12) { texIdx = u_layerTextureIdx[12]; blurVal = u_layerBlur[12]; }
        else if (activeLayerIndex == 13) { texIdx = u_layerTextureIdx[13]; blurVal = u_layerBlur[13]; }
        else if (activeLayerIndex == 14) { texIdx = u_layerTextureIdx[14]; blurVal = u_layerBlur[14]; }
        else if (activeLayerIndex == 15) { texIdx = u_layerTextureIdx[15]; blurVal = u_layerBlur[15]; }
        else if (activeLayerIndex == 16) { texIdx = u_layerTextureIdx[16]; blurVal = u_layerBlur[16]; }
        else if (activeLayerIndex == 17) { texIdx = u_layerTextureIdx[17]; blurVal = u_layerBlur[17]; }
        else if (activeLayerIndex == 18) { texIdx = u_layerTextureIdx[18]; blurVal = u_layerBlur[18]; }
        else if (activeLayerIndex == 19) { texIdx = u_layerTextureIdx[19]; blurVal = u_layerBlur[19]; }

        vec4 finalColor = layerColor;
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        if (texIdx >= 0) {
            vec4 texColor = getLayerTextureBlurred(texIdx, uv, blurVal);
            finalColor.rgb = mix(texColor.rgb, layerColor.rgb, layerColor.a);
            finalColor.a = max(texColor.a, layerColor.a);
        }
        
        float accumulatedShadow = 0.0;
        for (int i = 0; i < 20; i++) {
            if (i >= activeLayerIndex) break; 
            
            if (u_hasShadow[i] == 1) {
                float t_i = 1.0 - float(i + 1) * (2.0 / float(u_numColors));
                
                float angleRad = u_shadowAngle[i] * 3.14159265 / 180.0;
                vec2 offset = vec2(cos(angleRad), -sin(angleRad)) * u_shadowDistance[i] * 0.01 * u_scale;
                
                float r_offset = snoise(vec3(st.x - offset.x, st.y - offset.y, u_time));
                
                float blurAmt = max(0.001, u_shadowBlur[i] * 0.01);
                float shadowFactor = smoothstep(t_i - blurAmt, t_i + blurAmt, r_offset);
                
                accumulatedShadow = max(accumulatedShadow, shadowFactor * (u_shadowOpacity[i] / 100.0));
            }
        }
        
        finalColor.rgb = mix(finalColor.rgb, vec3(0.0), accumulatedShadow);
        finalColor.a = max(finalColor.a, accumulatedShadow);
        gl_FragColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSrc);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSrc);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const locationOfResolution = gl.getUniformLocation(program, 'u_resolution');
    const locationOfTime = gl.getUniformLocation(program, 'u_time');
    
    const locNumColors = gl.getUniformLocation(program, 'u_numColors');
    const locColors = gl.getUniformLocation(program, 'u_colors');
    const locScale = gl.getUniformLocation(program, 'u_scale');
    
    const locHasShadow = gl.getUniformLocation(program, 'u_hasShadow');
    const locShadowBlur = gl.getUniformLocation(program, 'u_shadowBlur');
    const locShadowOpacity = gl.getUniformLocation(program, 'u_shadowOpacity');
    const locShadowAngle = gl.getUniformLocation(program, 'u_shadowAngle');
    const locShadowDistance = gl.getUniformLocation(program, 'u_shadowDistance');

    const locLayerTextureIdx = gl.getUniformLocation(program, 'u_layerTextureIdx');
    const locLayerBlur = gl.getUniformLocation(program, 'u_layerBlur');

    // Load unique active images into WebGL textures
    const activeImages = settings.colors
      .map(c => c.image)
      .filter((img): img is string => !!img && !!loadedImages[img]);
    const uniqueActiveImages = Array.from(new Set(activeImages)).slice(0, 8);

    const webglTextures: WebGLTexture[] = [];
    uniqueActiveImages.forEach((imgSrc, texIdx) => {
      const img = loadedImages[imgSrc];
      if (!img) return;
      const texture = gl.createTexture();
      if (texture) {
        gl.activeTexture(gl.TEXTURE0 + texIdx);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        webglTextures.push(texture);
      }
    });

    const handleResize = () => {
      let nextW = w;
      let nextH = h;
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        nextW = rect.width;
        nextH = rect.height;
      } else {
        nextW = window.innerWidth;
        nextH = window.innerHeight;
      }
      if (nextW > 0 && nextH > 0) {
        w = nextW;
        h = nextH;
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    
    const resizeObserver = new ResizeObserver(() => {
        handleResize();
    });
    
    if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
    }
    window.addEventListener('resize', handleResize);

    const startTime = Date.now();

    const render = () => {
      gl.useProgram(program);
      gl.uniform1i(locNumColors, settings.colors.length);
      
      const colorsData = new Float32Array(settings.colors.length * 4);
      const hasShadowData = new Int32Array(20);
      const shadowBlurData = new Float32Array(20);
      const shadowOpacityData = new Float32Array(20);
      const shadowAngleData = new Float32Array(20);
      const shadowDistanceData = new Float32Array(20);

      const layerTextureIdxData = new Int32Array(20).fill(-1);
      const layerBlurData = new Float32Array(20);
      
      settings.colors.forEach((c, i) => {
        const rgb = hexToRgb(c.color);
        colorsData[i * 4] = rgb.r;
        colorsData[i * 4 + 1] = rgb.g;
        colorsData[i * 4 + 2] = rgb.b;
        colorsData[i * 4 + 3] = (c.opacity ?? 100) / 100.0;
        
        hasShadowData[i] = c.shadow ? 1 : 0;
        shadowBlurData[i] = c.shadowBlur ?? 10;
        shadowOpacityData[i] = c.shadowOpacity ?? 50;
        shadowAngleData[i] = c.shadowAngle ?? 45;
        shadowDistanceData[i] = c.shadowDistance ?? 5;

        if (c.image) {
          const texIdx = uniqueActiveImages.indexOf(c.image);
          if (texIdx !== -1) {
            layerTextureIdxData[i] = texIdx;
            layerBlurData[i] = c.blur ?? 0;
          }
        }
      });

      gl.uniform4fv(locColors, colorsData);
      gl.uniform1iv(locHasShadow, hasShadowData);
      gl.uniform1fv(locShadowBlur, shadowBlurData);
      gl.uniform1fv(locShadowOpacity, shadowOpacityData);
      gl.uniform1fv(locShadowAngle, shadowAngleData);
      gl.uniform1fv(locShadowDistance, shadowDistanceData);
      gl.uniform1f(locScale, settings.scale * 0.4);

      // Bind sampler uniforms to their texture units
      for (let texIdx = 0; texIdx < 8; texIdx++) {
        const locTex = gl.getUniformLocation(program, `u_texture${texIdx}`);
        if (locTex) {
          gl.uniform1i(locTex, texIdx);
        }
      }

      if (locLayerTextureIdx) gl.uniform1iv(locLayerTextureIdx, layerTextureIdxData);
      if (locLayerBlur) gl.uniform1fv(locLayerBlur, layerBlurData);

      // Re-bind texture units just in case
      uniqueActiveImages.forEach((imgSrc, texIdx) => {
        if (webglTextures[texIdx]) {
          gl.activeTexture(gl.TEXTURE0 + texIdx);
          gl.bindTexture(gl.TEXTURE_2D, webglTextures[texIdx]);
        }
      });

      const currentTime = (Date.now() - startTime) / 1000;
      gl.uniform2f(locationOfResolution, w, h);
      gl.uniform1f(locationOfTime, currentTime * settings.speed * 0.1);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      webglTextures.forEach(tex => gl.deleteTexture(tex));
    };
  }, [
    settings.scale,
    settings.speed,
    JSON.stringify(settings.colors),
    settings.backgroundImage,
    loadedImages
  ]);

  return (
    <div ref={containerRef} className="absolute inset-0 bg-transparent overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 block" />
    </div>
  );
};
