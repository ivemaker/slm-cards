import React from 'react';
import { Block } from '../types';
import { getTextStyles } from '../utils';

interface ProfileBlockContentProps {
  block: Block;
  isPreviewMockupMode: boolean;
  updateBlocks?: (newBlocks: Block[]) => void;
  configBlocks?: Block[];
  lang: 'en' | 'ru';
}

export const ProfileBlockContent: React.FC<ProfileBlockContentProps> = ({
  block,
  lang,
}) => {
  const profile = block.profileContent;
  if (!profile) return null;

  const isRow = profile.layout === 'row';
  const align = profile.align || 'center';
  const finalAlign = block.textAlign || align;
  const showAvatar = profile.showAvatar !== false;
  const avatarSize = profile.avatarSize || 80;

  const alignContainerClass =
    finalAlign === 'left'
      ? 'items-start text-left'
      : finalAlign === 'right'
        ? 'items-end text-right'
        : 'items-center text-center';

  const contentAlignClass =
    finalAlign === 'left'
      ? 'text-left'
      : finalAlign === 'right'
        ? 'text-right'
        : 'text-center';

  const isAvatarRight = isRow && align === 'right';

  const isSvgOrPng = profile.avatar?.startsWith('data:image/svg') || 
                     profile.avatar?.startsWith('data:image/png') || 
                     profile.avatar?.startsWith('data:image/gif') ||
                     !!profile.avatarSvgRaw;

  // Avatar rounding/shaping class
  const shapeClass = isSvgOrPng ? '' :
    profile.avatarShape === 'square'
      ? 'rounded-none'
      : profile.avatarShape === 'rounded'
        ? 'rounded-2xl'
        : 'rounded-full';

  const getRgbFromHex = (hex: string) => {
    let cleaned = hex.replace('#', '');
    if (cleaned.length === 3) {
      cleaned = cleaned.split('').map(c => c + c).join('');
    }
    const num = parseInt(cleaned, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `${r}, ${g}, ${b}`;
  };

  // 1. Shadow properties & style
  let dropShadowFilter = '';
  const shadowStyle: React.CSSProperties = {};
  if (profile.avatarShadowEnabled) {
    const blur = profile.avatarShadowBlur ?? 8;
    const opacity = (profile.avatarShadowOpacity ?? 40) / 100;
    const color = profile.avatarShadowColor ?? '#000000';
    const offsetX = profile.avatarShadowOffsetX ?? 0;
    const offsetY = profile.avatarShadowOffsetY ?? 4;
    
    try {
      const rgb = getRgbFromHex(color);
      if (isSvgOrPng) {
        dropShadowFilter += ` drop-shadow(${offsetX}px ${offsetY}px ${blur}px rgba(${rgb}, ${opacity}))`;
      } else {
        shadowStyle.boxShadow = `${offsetX}px ${offsetY}px ${blur}px rgba(${rgb}, ${opacity})`;
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 3. Glow element (placed outside/behind avatar)
  let glowElement = null;
  if (profile.avatarGlowEnabled) {
    if (isSvgOrPng) {
      const glowColor = profile.avatarGlowColor ?? '#6366f1';
      const glowRadius = profile.avatarGlowRadius ?? 20;
      const glowIntensity = (profile.avatarGlowIntensity ?? 50) / 100;
      try {
        const rgb = getRgbFromHex(glowColor);
        dropShadowFilter += ` drop-shadow(0px 0px ${glowRadius}px rgba(${rgb}, ${glowIntensity}))`;
      } catch (e) {
        dropShadowFilter += ` drop-shadow(0px 0px ${glowRadius}px ${glowColor})`;
      }
    } else {
      glowElement = (
        <div
          style={{
            position: 'absolute',
            inset: `-${(profile.avatarGlowRadius ?? 20) / 2}px`,
            backgroundColor: profile.avatarGlowColor ?? '#6366f1',
            opacity: (profile.avatarGlowIntensity ?? 50) / 100,
            filter: `blur(${profile.avatarGlowRadius ?? 20}px)`,
            zIndex: -1,
          }}
          className={`${shapeClass} pointer-events-none transition-all duration-300`}
        />
      );
    }
  }

  // 2. Border properties & style
  const borderWidth = profile.avatarBorderWidth ?? 2;
  const borderStyle: React.CSSProperties = profile.avatarBorderEnabled && !isSvgOrPng ? {
    position: 'absolute',
    inset: `-${borderWidth}px`,
    borderWidth: `${borderWidth}px`,
    borderStyle: profile.avatarBorderStyle ?? 'solid',
    borderColor: profile.avatarBorderColor ?? '#ffffff',
    pointerEvents: 'none',
    zIndex: 25,
  } : {};

  const borderElement = profile.avatarBorderEnabled && !isSvgOrPng ? (
    <div style={borderStyle} className={`${shapeClass} transition-all duration-200`} />
  ) : null;

  // 4. Shimmer element (interval-based sheen with screen blending)
  const shimmerSpeed = profile.avatarShimmerSpeed ?? 2.0;
  const shimmerInterval = profile.avatarShimmerInterval ?? 3.0;
  const totalDuration = shimmerSpeed + shimmerInterval;
  const movementPercent = (shimmerSpeed / totalDuration) * 100;

  const shimmerStyleBlock = profile.avatarShimmerEnabled && !isSvgOrPng ? (
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes avatar-shimmer-anim-${block.id} {
        0% { left: -150%; }
        ${movementPercent}% { left: 150%; }
        100% { left: 150%; }
      }
    `}} />
  ) : null;

  const shimmerElement = profile.avatarShimmerEnabled && !isSvgOrPng ? (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 10,
      }}
      className={shapeClass}
    >
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-150%',
          width: `${profile.avatarShimmerWidth ?? 30}%`,
          height: '200%',
          background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${profile.avatarShimmerColor ?? '#ffffff'} 50%, rgba(255,255,255,0) 100%)`,
          opacity: 0.8,
          transform: 'rotate(25deg)',
          animation: `avatar-shimmer-anim-${block.id} ${totalDuration}s infinite linear`,
          mixBlendMode: 'screen',
        }}
      />
    </div>
  ) : null;

  // 5. Procedural Realistic Glass Overlay (Dome / Retro / Flat / Crystal)
  const glassType = profile.avatarGlassType || 'dome';
  const reflectOpacity = (profile.avatarGlassReflectIntensity ?? 60) / 100;
  const glassOpacity = (profile.avatarGlassOpacity ?? 40) / 100;
  const glassColor = profile.avatarGlassColor ?? '#ffffff';
  const glassBlur = profile.avatarGlassBlur ?? 0;
  const glassAngle = profile.avatarGlassAngle ?? 0;

  const getRgbFromHexForGlass = (hex: string) => {
    let cleaned = hex.replace('#', '');
    if (cleaned.length === 3) {
      cleaned = cleaned.split('').map(c => c + c).join('');
    }
    const num = parseInt(cleaned, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `${r}, ${g}, ${b}`;
  };

  let glassRgb = '255, 255, 255';
  try {
    glassRgb = getRgbFromHexForGlass(glassColor);
  } catch (e) {}

  // Border radius for Retro Web 2.0 glass cap depending on shape
  const getRetroCapBorderRadius = () => {
    if (profile.avatarShape === 'circle') {
      return '50% 50% 15% 15% / 100% 100% 30% 30%';
    } else if (profile.avatarShape === 'rounded' || !profile.avatarShape) {
      return '16px 16px 4px 4px / 24px 24px 8px 8px';
    } else {
      return '0 0 2px 2px';
    }
  };

  const glassOverlayElement = profile.avatarGlassEnabled && !isSvgOrPng ? (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 15,
        pointerEvents: 'none',
        backgroundColor: `rgba(${glassRgb}, ${glassOpacity * 0.15})`,
      }}
      className={`${shapeClass} overflow-hidden`}
    >
      {/* 3D Glass Surface Shadowing & Rim Highlights (Always aligns with the physical boundaries of the shape) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          boxShadow: `inset 0 1.5px 2px rgba(255,255,255,${reflectOpacity * 0.95}), inset 0 -1.5px 2px rgba(0,0,0,0.45)`,
          border: `1px solid rgba(255, 255, 255, ${reflectOpacity * 0.2})`,
          zIndex: 10,
        }}
      />

      {/* ROTATABLE & BLURRABLE GLARE MAP WRAPPER (This contains the glares and handles rotation and blurring) */}
      <div
        style={{
          position: 'absolute',
          inset: '-30%',
          transform: `rotate(${glassAngle}deg)`,
          filter: glassBlur > 0 ? `blur(${glassBlur}px)` : undefined,
          transformOrigin: 'center center',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        {/* PRESET SPECIFIC PROCEDURAL GLARES */}
        {glassType === 'dome' && (
          <>
            {/* Spherical Dome 3D Top Glow */}
            <div
              style={{
                position: 'absolute',
                top: '20%',
                left: '25%',
                right: '25%',
                height: '40%',
                background: `radial-gradient(ellipse at 50% 0%, rgba(255,255,255,${reflectOpacity * 0.85}) 0%, rgba(255,255,255,${reflectOpacity * 0.1}) 55%, rgba(255,255,255,0) 80%)`,
                borderRadius: profile.avatarShape === 'circle' ? '50%' : '12px',
              }}
            />
            {/* Spherical Secondary Glint */}
            <div
              style={{
                position: 'absolute',
                top: '24%',
                left: '32%',
                width: '16%',
                height: '16%',
                background: `radial-gradient(circle, rgba(255,255,255,${reflectOpacity * 0.95}) 0%, rgba(255,255,255,0) 75%)`,
                borderRadius: '50%',
              }}
            />
            {/* 3D Bottom Light Reflection */}
            <div
              style={{
                position: 'absolute',
                bottom: '22%',
                left: '25%',
                right: '25%',
                height: '25%',
                background: `radial-gradient(ellipse at 50% 100%, rgba(255,255,255,${reflectOpacity * 0.5}) 0%, rgba(255,255,255,0) 70%)`,
                borderRadius: profile.avatarShape === 'circle' ? '50%' : '12px',
              }}
            />
          </>
        )}

        {glassType === 'retro' && (
          <>
            {/* Classic Web 2.0 Jelly Gloss (Linear split with curved shape adapting to avatar shape) */}
            <div
              style={{
                position: 'absolute',
                top: '20%',
                left: '22%',
                right: '22%',
                height: '32%',
                background: `linear-gradient(to bottom, rgba(255,255,255,${reflectOpacity * 0.85}) 0%, rgba(255,255,255,${reflectOpacity * 0.25}) 96%, rgba(255,255,255,0) 100%)`,
                borderRadius: getRetroCapBorderRadius(),
                borderBottom: `0.5px solid rgba(255,255,255,${reflectOpacity * 0.45})`,
              }}
            />
            {/* Specular Glare Bubble (top-left) */}
            <div
              style={{
                position: 'absolute',
                top: '22%',
                left: '26%',
                width: '20%',
                height: '10%',
                background: `radial-gradient(ellipse at 50% 50%, rgba(255,255,255,${reflectOpacity * 0.7}) 0%, rgba(255,255,255,0) 80%)`,
                transform: 'rotate(-10deg)',
              }}
            />
          </>
        )}

        {glassType === 'flat' && (
          <>
            {/* Elegant Diagonal Sheet of Glass Glares */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '42%',
                width: '16%',
                background: `linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,${reflectOpacity * 0.75}) 50%, rgba(255,255,255,0) 100%)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '64%',
                width: '4%',
                background: `linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,${reflectOpacity * 0.45}) 50%, rgba(255,255,255,0) 100%)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '32%',
                width: '2%',
                background: `linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,${reflectOpacity * 0.35}) 50%, rgba(255,255,255,0) 100%)`,
              }}
            />
          </>
        )}

        {glassType === 'crystal' && (
          <>
            {/* Multiple Geometric Facet Glares */}
            <div
              style={{
                position: 'absolute',
                top: '20%',
                bottom: '20%',
                left: '20%',
                width: '32%',
                background: `linear-gradient(115deg, rgba(255,255,255,${reflectOpacity * 0.45}) 0%, rgba(255,255,255,0) 60%)`,
                clipPath: 'polygon(0 0, 100% 30%, 50% 100%, 0 70%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '18%',
                bottom: '18%',
                right: '20%',
                width: '32%',
                background: `linear-gradient(245deg, rgba(255,255,255,${reflectOpacity * 0.5}) 0%, rgba(255,255,255,0) 50%)`,
                clipPath: 'polygon(100% 0, 100% 70%, 50% 100%, 0 30%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '32%',
                left: '42%',
                width: '16%',
                height: '36%',
                background: `linear-gradient(to bottom, rgba(255,255,255,${reflectOpacity * 0.65}) 0%, rgba(255,255,255,0) 100%)`,
                clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '20%',
                left: '28%',
                width: '44%',
                height: '18%',
                background: `linear-gradient(to top, rgba(255,255,255,${reflectOpacity * 0.45}) 0%, rgba(255,255,255,0) 80%)`,
                clipPath: 'polygon(0 100%, 100% 100%, 50% 0)',
              }}
            />
          </>
        )}
      </div>
    </div>
  ) : null;

  const avatarElement = showAvatar && profile.avatar ? (
    <div
      style={{
        width: `${avatarSize}px`,
        height: `${avatarSize}px`,
        ...shadowStyle,
      }}
      className={`select-none flex-shrink-0 relative ${shapeClass}`}
    >
      {shimmerStyleBlock}
      {glowElement}

      <div
        style={{
          width: '100%',
          height: '100%',
          ...(isSvgOrPng ? { filter: dropShadowFilter.trim() } : {})
        }}
        className={`relative ${isSvgOrPng ? '' : 'overflow-hidden'} ${shapeClass}`}
      >
        {profile.avatarSvgRaw ? (
          <div 
            style={{ width: '100%', height: '100%' }}
            className="flex items-center justify-center p-2 text-white bg-transparent"
            dangerouslySetInnerHTML={{ 
              __html: profile.avatarSvgRaw
                // Apply SVG outline if enabled
                .replace(/<svg(.*?)>/, `<svg$1 ${profile.avatarBorderEnabled ? `stroke="${profile.avatarBorderColor ?? '#ffffff'}" stroke-width="${profile.avatarBorderWidth ?? 2}" stroke-linejoin="round"` : ''}>`)
                // Apply color replacements if any
                .replace(/fill="((?!none)[^"]+)"/g, profile.avatarSvgColor ? `fill="${profile.avatarSvgColor}"` : `fill="$1"`)
                .replace(/stroke="((?!none)[^"]+)"/g, profile.avatarSvgColor ? `stroke="${profile.avatarSvgColor}"` : `stroke="$1"`)
            }}
          />
        ) : (
          <img
            src={profile.avatar}
            alt={profile.name}
            className={`object-cover bg-transparent w-full h-full`}
            referrerPolicy="no-referrer"
            draggable={false}
          />
        )}
        {shimmerElement}
        {glassOverlayElement}
      </div>
      {borderElement}
    </div>
  ) : null;

  const hasTextEffects = 
    block.textShadowEnabled || block.textGlowEnabled || block.textShimmerEnabled ||
    block.titleTextStyles?.textShadowEnabled || block.titleTextStyles?.textGlowEnabled || block.titleTextStyles?.textShimmerEnabled ||
    block.descTextStyles?.textShadowEnabled || block.descTextStyles?.textGlowEnabled || block.descTextStyles?.textShimmerEnabled;

  return (
    <div className="w-full relative z-10">
      <div
        className={`w-full flex ${
          isRow
            ? `flex-row items-center gap-4 ${isAvatarRight ? 'justify-between' : 'justify-start'}`
            : `flex-col space-y-3.5 ${alignContainerClass}`
        }`}
      >
        {!isAvatarRight && avatarElement}

        <div className={`space-y-1.5 flex-1 min-w-0 max-w-full ${hasTextEffects ? 'overflow-visible' : 'overflow-hidden'} ${isRow ? contentAlignClass : 'w-full ' + contentAlignClass}`}>
          <h2 
            className={`font-bold tracking-tight ${(block.titleTextStyles?.textShimmerEnabled || block.textShimmerEnabled) ? 'text-shimmer-effect' : ''}`}
            style={{
              ...(block.customTitleColor ? { color: block.customTitleColor } : block.customTextColor ? { color: block.customTextColor } : {}),
              ...(block.customTitleFont ? { fontFamily: block.customTitleFont } : {}),
              fontSize: block.customTitleFontSize !== undefined ? `${block.customTitleFontSize}px` : '20px',
              ...getTextStyles(block, false)
            }}
          >
            {profile.name}
          </h2>
          <p 
            className={`text-xs opacity-85 leading-relaxed font-light whitespace-pre-line break-words max-w-full ${(block.descTextStyles?.textShimmerEnabled || block.textShimmerEnabled) ? 'text-shimmer-effect' : ''}`}
            style={{
              ...(block.customDescColor ? { color: block.customDescColor } : block.customTextColor ? { color: block.customTextColor } : {}),
              ...(block.customDescFont ? { fontFamily: block.customDescFont } : {}),
              fontSize: block.customDescFontSize !== undefined ? `${block.customDescFontSize}px` : undefined,
              ...getTextStyles(block, true)
            }}
          >
            {profile.bio}
          </p>
        </div>

        {isAvatarRight && avatarElement}
      </div>
    </div>
  );
};
