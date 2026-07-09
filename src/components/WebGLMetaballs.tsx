import React, { useEffect, useRef } from 'react';

export interface MetaballsSettings {
  numMetaballs: number;
  minRadius: number;
  maxRadius: number;
  speed: number;
  colorStart: string;
  colorEnd: string;
  glowRadius: number;
  blur: number;
  outline: boolean;
  outlineWidth: number;
  outlineColor: string;
  fill: boolean;
  mouseInteraction: boolean;
  shadow?: boolean;
  shadowBlur?: number;
  shadowOpacity?: number;
  shadowAngle?: number;
  shadowDistance?: number;
  colorOpacity?: number;
  image?: string | null;
  imageBlur?: number;
  metaballsBgColor?: string;
  metaballsUseBgImage?: boolean;
  metaballsBgImage?: string;
  opacity?: number;
}

interface WebGLMetaballsProps {
  settings?: Partial<MetaballsSettings>;
}

const DEFAULT_SETTINGS: MetaballsSettings = {
  numMetaballs: 15,
  minRadius: 60,
  maxRadius: 160,
  speed: 1.2,
  colorStart: '#4f46e5',
  colorEnd: '#ec4899',
  glowRadius: 2.2,
  blur: 0.12,
  outline: false,
  outlineWidth: 0.015,
  outlineColor: '#ffffff',
  fill: true,
  mouseInteraction: true,
  shadow: true,
  shadowBlur: 15,
  shadowOpacity: 40,
  shadowAngle: 45,
  shadowDistance: 8,
  colorOpacity: 100,
  metaballsBgColor: '#000000',
  metaballsUseBgImage: false,
  metaballsBgImage: '',
  opacity: 100
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255.0,
    g: parseInt(result[2], 16) / 255.0,
    b: parseInt(result[3], 16) / 255.0
  } : { r: 1, g: 1, b: 1 };
};

export const WebGLMetaballs: React.FC<WebGLMetaballsProps> = ({ settings: customSettings }) => {
  const settings = { ...DEFAULT_SETTINGS, ...customSettings };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true });
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    glRef.current = gl;
    let texture: WebGLTexture | null = null;

    const resize = () => {
      let w = canvas.width;
      let h = canvas.height;
      if (container) {
        const rect = container.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
      } else {
        w = window.innerWidth;
        h = window.innerHeight;
      }
      if (w > 0 && h > 0) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    
    const resizeObserver = new ResizeObserver(() => {
        resize();
    });
    
    if (container) {
        resizeObserver.observe(container);
    }
    
    resize();

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    if (settings.mouseInteraction) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    const numMetaballs = settings.numMetaballs + (settings.mouseInteraction ? 1 : 0);
    const metaballs: { x: number, y: number, vx: number, vy: number, r: number }[] = [];

    for (let i = 0; i < settings.numMetaballs; i++) {
      const radius = Math.random() * (settings.maxRadius - settings.minRadius) + settings.minRadius;
      metaballs.push({
        x: Math.random() * (canvas.width - 2 * radius) + radius,
        y: Math.random() * (canvas.height - 2 * radius) + radius,
        vx: (Math.random() - 0.5) * settings.speed,
        vy: (Math.random() - 0.5) * settings.speed,
        r: radius * 0.75
      });
    }

    if (settings.mouseInteraction) {
      metaballs.push({
        x: mouse.x,
        y: mouse.y,
        vx: 0,
        vy: 0,
        r: settings.maxRadius * 1.5
      });
    }

    const vertexShaderSrc = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const c1 = hexToRgb(settings.colorStart);
    const c2 = hexToRgb(settings.colorEnd);
    const outlineColorRgb = hexToRgb(settings.outlineColor);

    const fragmentShaderSrc = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform vec3 metaballs[` + numMetaballs + `];
      uniform vec3 colorStart;
      uniform vec3 colorEnd;
      uniform vec3 outlineColor;
      uniform float threshold;
      
      uniform sampler2D u_image;
      uniform int u_hasImage;
      uniform float u_imageBlur;
      
      uniform int u_hasShadow;
      uniform float u_shadowBlur;
      uniform float u_shadowOpacity;
      uniform float u_shadowAngle;
      uniform float u_shadowDistance;
      
      uniform float u_colorOpacity;

      vec4 blurImage(vec2 uv, float blurAmount) {
          if (blurAmount <= 0.0) return texture2D(u_image, uv);
          vec4 color = vec4(0.0);
          float total = 0.0;
          float radius = blurAmount * 0.001;
          float angle = 2.39996323; 
          for(float i = 0.0; i < 150.0; i++) {
              float r = radius * sqrt(i / 150.0);
              float theta = i * angle;
              vec2 offset = vec2(cos(theta), sin(theta)) * r;
              
              float weight = exp(-3.0 * (i / 150.0));
              color += texture2D(u_image, uv + offset) * weight;
              total += weight;
          }
          return color / total;
      }

      void main(){
        float x = gl_FragCoord.x;
        float y = u_resolution.y - gl_FragCoord.y; 

        float sum = 0.0;
        for (int i = 0; i < ` + numMetaballs + `; i++) {
          vec3 metaball = metaballs[i];
          float dx = metaball.x - x;
          float dy = metaball.y - y;
          float radius = metaball.z;
          sum += (radius * radius) / (dx * dx + dy * dy);
        }
        
        float shadowSum = 0.0;
        if (u_hasShadow == 1) {
            float angleRad = u_shadowAngle * 3.14159265 / 180.0;
            vec2 offset = vec2(cos(angleRad), -sin(angleRad)) * u_shadowDistance * 5.0;
            float sx = x - offset.x;
            float sy = y - offset.y;
            for (int i = 0; i < ` + numMetaballs + `; i++) {
              vec3 metaball = metaballs[i];
              float dx = metaball.x - sx;
              float dy = metaball.y - sy;
              float radius = metaball.z;
              shadowSum += (radius * radius) / (dx * dx + dy * dy);
            }
        }

        vec3 mixColor = mix(colorStart, colorEnd, x / u_resolution.x);
        vec4 metaballColor = vec4(mixColor, u_colorOpacity / 100.0);
        
        if (u_hasImage == 1) {
            vec2 uv = gl_FragCoord.xy / u_resolution;
            uv.y = 1.0 - uv.y;
            vec4 texColor = blurImage(uv, u_imageBlur);
            metaballColor = vec4(texColor.rgb, 1.0);
        }
        
        float v = sum / threshold;
        float blurAmount = max(0.001, ` + settings.blur.toFixed(5) + `);
        
        float fillAlpha = smoothstep(1.0 - blurAmount, 1.0 + blurAmount, v);
        
        float shadowAlpha = 0.0;
        if (u_hasShadow == 1) {
            float sv = shadowSum / threshold;
            float sBlur = max(0.001, u_shadowBlur * 0.05);
            shadowAlpha = smoothstep(1.0 - sBlur, 1.0 + sBlur, sv) * (u_shadowOpacity / 100.0);
        }
        
        float outlineAlpha = 0.0;
        bool useOutline = ` + (settings.outline ? 'true' : 'false') + `;
        if (useOutline) {
            float inner = 1.0 - ` + settings.outlineWidth.toFixed(5) + `;
            float outer = 1.0 + ` + settings.outlineWidth.toFixed(5) + `;
            outlineAlpha = smoothstep(inner - blurAmount, inner + blurAmount, v) - smoothstep(outer - blurAmount, outer + blurAmount, v);
        }
        
        vec4 finalColor = vec4(0.0);
        
        if (u_hasShadow == 1 && shadowAlpha > 0.0) {
            finalColor = vec4(0.0, 0.0, 0.0, shadowAlpha);
        }
        
        bool useFill = ` + (settings.fill ? 'true' : 'false') + `;
        
        if (useFill && fillAlpha > 0.0) {
            float srcA = metaballColor.a * fillAlpha;
            finalColor.rgb = (metaballColor.rgb * srcA) + (finalColor.rgb * finalColor.a * (1.0 - srcA));
            finalColor.a = srcA + finalColor.a * (1.0 - srcA);
            if (finalColor.a > 0.0) {
                finalColor.rgb /= finalColor.a;
            }
        }
        
        if (useOutline && outlineAlpha > 0.0) {
            float srcA = outlineAlpha;
            finalColor.rgb = (outlineColor * srcA) + (finalColor.rgb * finalColor.a * (1.0 - srcA));
            finalColor.a = srcA + finalColor.a * (1.0 - srcA);
            if (finalColor.a > 0.0) {
                finalColor.rgb /= finalColor.a;
            }
        }
        
        gl_FragColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);
      }
    `;

    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Cannot create shader');
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error('Shader compile failed: ' + gl.getShaderInfoLog(shader));
      }
      return shader;
    };

    try {
      const vs = compileShader(vertexShaderSrc, gl.VERTEX_SHADER);
      const fs = compileShader(fragmentShaderSrc, gl.FRAGMENT_SHADER);

      const program = gl.createProgram();
      if (!program) throw new Error('Cannot create program');
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.useProgram(program);
      programRef.current = program;

      const vertexData = new Float32Array([
        -1.0,  1.0,
        -1.0, -1.0,
         1.0,  1.0,
         1.0, -1.0,
      ]);
      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

      const posLoc = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      const metaballsLoc = gl.getUniformLocation(program, 'metaballs');
      const c1Loc = gl.getUniformLocation(program, 'colorStart');
      const c2Loc = gl.getUniformLocation(program, 'colorEnd');
      const outlineColorLoc = gl.getUniformLocation(program, 'outlineColor');
      const thresholdLoc = gl.getUniformLocation(program, 'threshold');
      
      const locHasImage = gl.getUniformLocation(program, 'u_hasImage');
      const locImageBlur = gl.getUniformLocation(program, 'u_imageBlur');
      const locHasShadow = gl.getUniformLocation(program, 'u_hasShadow');
      const locShadowBlur = gl.getUniformLocation(program, 'u_shadowBlur');
      const locShadowOpacity = gl.getUniformLocation(program, 'u_shadowOpacity');
      const locShadowAngle = gl.getUniformLocation(program, 'u_shadowAngle');
      const locShadowDistance = gl.getUniformLocation(program, 'u_shadowDistance');
      const locColorOpacity = gl.getUniformLocation(program, 'u_colorOpacity');
      const locResolution = gl.getUniformLocation(program, 'u_resolution');

      gl.uniform3f(c1Loc, c1.r, c1.g, c1.b);
      gl.uniform3f(c2Loc, c2.r, c2.g, c2.b);
      gl.uniform3f(outlineColorLoc, outlineColorRgb.r, outlineColorRgb.g, outlineColorRgb.b);
      gl.uniform1f(thresholdLoc, settings.glowRadius);
      
      let imageLoaded = false;

      if (settings.metaballsUseBgImage && settings.metaballsBgImage) {
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Fill with black 1x1 placeholder
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          1,
          1,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          new Uint8Array([0, 0, 0, 0])
        );

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = settings.metaballsBgImage;
        img.onload = () => {
          if (!glRef.current || !texture) return;
          glRef.current.bindTexture(glRef.current.TEXTURE_2D, texture);
          glRef.current.texImage2D(glRef.current.TEXTURE_2D, 0, glRef.current.RGBA, glRef.current.RGBA, glRef.current.UNSIGNED_BYTE, img);
          imageLoaded = true;
        };
      }

      gl.uniform1i(locHasImage, 0);
      gl.uniform1f(locImageBlur, settings.imageBlur ?? 0);
      gl.uniform1i(locHasShadow, settings.shadow ? 1 : 0);
      gl.uniform1f(locShadowBlur, settings.shadowBlur ?? 10);
      gl.uniform1f(locShadowOpacity, settings.shadowOpacity ?? 50);
      gl.uniform1f(locShadowAngle, settings.shadowAngle ?? 45);
      gl.uniform1f(locShadowDistance, settings.shadowDistance ?? 5);
      gl.uniform1f(locColorOpacity, 100.0);

      const loop = () => {
        gl.uniform2f(locResolution, canvas.width, canvas.height);
        
        for (let i = 0; i < settings.numMetaballs; i++) {
          const mb = metaballs[i];
          mb.x += mb.vx;
          mb.y += mb.vy;

          if (mb.x < mb.r || mb.x > canvas.width - mb.r) mb.vx *= -1;
          if (mb.y < mb.r || mb.y > canvas.height - mb.r) mb.vy *= -1;
        }

        if (settings.mouseInteraction) {
          const mouseMb = metaballs[settings.numMetaballs];
          if (mouseMb) {
            mouseMb.x += (mouse.x - mouseMb.x) * 0.1;
            mouseMb.y += (mouse.y - mouseMb.y) * 0.1;
          }
        }

        const data = new Float32Array(3 * numMetaballs);
        for (let i = 0; i < numMetaballs; i++) {
          const mb = metaballs[i];
          data[i * 3 + 0] = mb.x;
          data[i * 3 + 1] = mb.y;
          data[i * 3 + 2] = mb.r;
        }

        gl.uniform3fv(metaballsLoc, data);

        if (settings.metaballsUseBgImage && settings.metaballsBgImage && imageLoaded && texture) {
          gl.uniform1i(locHasImage, 1);
          gl.bindTexture(gl.TEXTURE_2D, texture);
        } else {
          gl.uniform1i(locHasImage, 0);
        }

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        animationRef.current = requestAnimationFrame(loop);
      };

      loop();

    } catch (e) {
      console.error(e);
    }

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (glRef.current && texture) {
        glRef.current.deleteTexture(texture);
      }
    };
  }, [
    settings.mouseInteraction,
    settings.numMetaballs,
    settings.maxRadius,
    settings.minRadius,
    settings.speed,
    settings.colorStart,
    settings.colorEnd,
    settings.outlineColor,
    settings.glowRadius,
    settings.metaballsUseBgImage,
    settings.metaballsBgImage,
    settings.blur,
    settings.outline,
    settings.outlineWidth,
    settings.fill,
    settings.shadow,
    settings.shadowBlur,
    settings.shadowOpacity,
    settings.shadowAngle,
    settings.shadowDistance,
    settings.colorOpacity,
    settings.image,
    settings.imageBlur
  ]);

  const bgOpacityValue = settings.opacity !== undefined ? settings.opacity / 100 : 1.0;

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none bg-transparent">
      {/* Background layer */}
      <div 
        className="absolute inset-0 w-full h-full transition-all duration-300"
        style={{
          backgroundColor: settings.metaballsBgColor || '#000000',
          opacity: bgOpacityValue,
        }}
      />
      
      {/* WebGL Canvas drawing the metaball spheres */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full object-cover" />
    </div>
  );
};
