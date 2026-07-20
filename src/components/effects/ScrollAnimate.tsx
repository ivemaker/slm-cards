import React, { useEffect, useRef, useState } from 'react';
import { Block } from '../../types';

interface ScrollAnimateProps {
  block: Block;
  isEditor: boolean;
  isPremium: boolean;
  children: React.ReactNode;
}

export const ScrollAnimate: React.FC<ScrollAnimateProps> = ({
  block,
  isEditor,
  isPremium,
  children
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      isInitialLoad.current = false;
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // If not premium, or in Editor mode, or animation is set to none, show immediately
    const animType = block.animation?.type || 'none';
    if (!isPremium || isEditor || animType === 'none') {
      setIsVisible(true);
      return;
    }

    // Attempt to locate the smartphone preview scroll container
    const observerRoot = document.getElementById('phone-scroll-container');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: observerRoot,
        threshold: 0.1
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [block.id, isPremium, isEditor, block.animation?.type]);

  const anim = block.animation || { type: 'none', duration: 500, delay: 0 };
  const duration = anim.duration !== undefined ? anim.duration : 500;
  const delay = isInitialLoad.current ? (anim.delay || 0) : 0;

  const style: React.CSSProperties = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`
  };

  let animClasses = 'transition-all ease-out ';

  if (anim.type === 'none' || !isPremium || isEditor) {
    animClasses += 'opacity-100 translate-x-0 translate-y-0';
  } else {
    if (isVisible) {
      animClasses += 'opacity-100 translate-x-0 translate-y-0';
    } else {
      animClasses += 'opacity-0 ';
      if (anim.type === 'slide') {
        const dir = anim.direction || 'bottom';
        if (dir === 'left') {
          animClasses += '-translate-x-12';
        } else if (dir === 'right') {
          animClasses += 'translate-x-12';
        } else {
          animClasses += 'translate-y-8';
        }
      }
    }
  }

  return (
    <div
      ref={elementRef}
      style={style}
      className={`${animClasses} w-full`}
    >
      {children}
    </div>
  );
};
