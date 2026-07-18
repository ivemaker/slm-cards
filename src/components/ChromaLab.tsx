import React, { useState, useEffect } from 'react';
import { useDev } from '../context/DevContext';

interface ChromaLabProps {
  hue?: number;
  opacity?: number;
  forcePause?: boolean;
}

export const ChromaLab: React.FC<ChromaLabProps> = ({ hue = 280, opacity = 100, forcePause }) => {
  const { planType, projects, activeProjectId } = useDev();
  const activeProject = projects.find(p => p.id === activeProjectId);
  const isPremium = activeProject ? activeProject.tariff === 'Premium' : planType === 'premium';
  const shouldPause = forcePause || !isPremium;

  const baseHueStr = hue.toString();

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ 
      color: 'white',
      fontFamily: '"Inter", system-ui, sans-serif',
      display: 'grid',
      placeItems: 'center',
      overflow: 'hidden',
      opacity: opacity / 100,
      ['--base-hue' as any]: baseHueStr,
      ['--color-1' as any]: 'oklch(0.65 0.25 var(--base-hue))',
      ['--color-2' as any]: 'oklch(0.65 0.25 calc(var(--base-hue) + 120))',
      ['--color-3' as any]: 'oklch(0.65 0.25 calc(var(--base-hue) + 240))',
      ['--ambient-glow' as any]: 'oklch(from var(--color-1) 0.15 0.05 h)',
      background: 'radial-gradient(circle at center, var(--ambient-glow) 0%, #050505 100%)',
      zIndex: 0
    }}>
      <style>{`
        @property --base-hue {
          syntax: "<number>";
          inherits: true;
          initial-value: 280;
        }

        .fluid-mesh {
          position: absolute;
          width: 100vw;
          height: 100vh;
          filter: blur(80px);
          z-index: 0;
          opacity: 0.8;
        }

        .orb {
          position: absolute;
          width: 50vmin;
          height: 50vmin;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          translate: -50% -50%;
          mix-blend-mode: screen;
        }

        .orb-1 {
          background: var(--color-1);
          animation: orbit 12s ease-in-out infinite alternate;
          animation-play-state: ${shouldPause ? 'paused' : 'running'};
        }
        .orb-2 {
          background: var(--color-2);
          animation: orbit 16s ease-in-out infinite alternate-reverse;
          animation-play-state: ${shouldPause ? 'paused' : 'running'};
        }
        .orb-3 {
          background: var(--color-3);
          animation: orbit 20s linear infinite;
          animation-play-state: ${shouldPause ? 'paused' : 'running'};
        }

        @keyframes orbit {
          0% {
            transform: translate(calc(sin(0deg) * 20vw), calc(cos(0deg) * 20vh)) scale(1);
          }
          33% {
            transform: translate(calc(sin(120deg) * 25vw), calc(cos(120deg) * 15vh)) scale(1.5);
          }
          66% {
            transform: translate(calc(sin(240deg) * 15vw), calc(cos(240deg) * 25vh)) scale(0.8);
          }
          100% {
            transform: translate(calc(sin(360deg) * 20vw), calc(cos(360deg) * 20vh)) scale(1);
          }
        }
      `}</style>
      
      <div className="fluid-mesh">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
    </div>
  );
};
