import React, { useState, useEffect } from 'react';
import { Block } from '../types';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface MediaBlockContentProps {
  block: Block;
  lang: 'en' | 'ru';
}

export const MediaBlockContent: React.FC<MediaBlockContentProps> = ({ block, lang }) => {
  const content = block.mediaContent;
  if (!content || !content.items || content.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center opacity-60">
        <ImageIcon size={28} className="text-zinc-400 mb-2" />
        <span className="text-xs font-mono">
          {lang === 'en' ? 'Empty Media Block' : 'Пустой медиа-блок'}
        </span>
      </div>
    );
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const items = content.items;

  // Listen to iframe focus (blur of main window when user clicks to play/interact with iframe) and postMessage signals
  useEffect(() => {
    const handleBlur = () => {
      setTimeout(() => {
        if (document.activeElement?.tagName === 'IFRAME') {
          setIsVideoPlaying(true);
        }
      }, 150);
    };

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        // YouTube API events
        if (data && data.event === 'infoDelivery' && data.info) {
          if (data.info.playerState === 1) {
            setIsVideoPlaying(true);
          } else if (data.info.playerState === 2 || data.info.playerState === 0) {
            setIsVideoPlaying(false);
          }
        }
        // Vimeo API events
        if (data && data.event === 'play') {
          setIsVideoPlaying(true);
        } else if (data && (data.event === 'pause' || data.event === 'finish')) {
          setIsVideoPlaying(false);
        }
      } catch (e) {
        // Safe play
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Autoplay timers
  useEffect(() => {
    if (items.length <= 1 || content.autoplay === false || isVideoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        if (prev === items.length - 1) {
          return content.loop !== false ? 0 : prev;
        }
        return prev + 1;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length, content.autoplay, content.loop, isVideoPlaying]);

  const resetVideoStateAndRefocus = () => {
    setIsVideoPlaying(false);
    if (document.activeElement?.tagName === 'IFRAME') {
      // Blur the iframe and focus the parent body to restore tab context
      try {
        (document.activeElement as HTMLElement).blur();
      } catch (e) {}
      window.focus();
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetVideoStateAndRefocus();
    setActiveIndex((prev) => (prev === 0 ? (content.loop !== false ? items.length - 1 : 0) : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetVideoStateAndRefocus();
    setActiveIndex((prev) => (prev === items.length - 1 ? (content.loop !== false ? 0 : prev) : prev + 1));
  };

  const activeItem = items[activeIndex];

  const aspectClass =
    content.aspectRatio === 'square' ? 'aspect-square' :
    content.aspectRatio === 'portrait' ? 'aspect-[9/16]' :
    content.aspectRatio === 'video' ? 'aspect-video' : 'h-auto';

  const fitClass = content.objectFit === 'contain' ? 'object-contain bg-black/10' : 'object-cover';

  const renderVideo = (videoUrl: string) => {
    let embedUrl = '';

    const ytMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
    if (ytMatch && ytMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?enablejsapi=1&autoplay=${items.length === 1 && content.autoplay ? 1 : 0}&mute=1&loop=${content.loop !== false ? 1 : 0}&playlist=${ytMatch[1]}`;
    }

    const vimeoMatch = videoUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/i);
    if (vimeoMatch && vimeoMatch[1]) {
      embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}?api=1&autoplay=${items.length === 1 && content.autoplay ? 1 : 0}&muted=1&loop=${content.loop !== false ? 1 : 0}`;
    }

    if (embedUrl) {
      return (
        <iframe
          src={embedUrl}
          className="w-full h-full border-0 absolute inset-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Video Player"
          referrerPolicy="no-referrer"
        />
      );
    }

    return (
      <video
        key={videoUrl}
        src={videoUrl}
        controls={content.showControls !== false}
        autoPlay={items.length === 1 && content.autoplay !== false}
        muted
        loop={content.loop !== false}
        playsInline
        onPlay={() => setIsVideoPlaying(true)}
        onPause={() => setIsVideoPlaying(false)}
        onEnded={() => setIsVideoPlaying(false)}
        className="w-full h-full object-cover"
      />
    );
  };

  return (
    <div className={`relative overflow-hidden w-full ${aspectClass} rounded-[inherit]`} style={{ minHeight: aspectClass === 'h-auto' ? '220px' : undefined }}>
      <div className="w-full h-full relative" style={{ minHeight: aspectClass === 'h-auto' ? '220px' : '100%' }}>
        {activeItem.type === 'image' ? (
          <img
            src={activeItem.url}
            alt={`Slide ${activeIndex + 1}`}
            className={`w-full h-full ${fitClass}`}
            style={{ pointerEvents: 'none' }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full absolute inset-0 bg-black flex items-center justify-center">
            {renderVideo(activeItem.url)}
          </div>
        )}
      </div>

      {items.length > 1 && content.showControls !== false && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white cursor-pointer transition-colors border border-white/10 select-none z-10 flex items-center justify-center"
            title={lang === 'en' ? 'Previous' : 'Предыдущий'}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white cursor-pointer transition-colors border border-white/10 select-none z-10 flex items-center justify-center"
            title={lang === 'en' ? 'Next' : 'Следующий'}
          >
            <ChevronRight size={16} />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs select-none">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetVideoStateAndRefocus();
                  setActiveIndex(i);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                  i === activeIndex ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/50 text-[9px] font-mono font-bold text-white/90 border border-white/5 select-none pointer-events-none z-10">
            {activeIndex + 1} / {items.length}
          </div>
        </>
      )}
    </div>
  );
};
