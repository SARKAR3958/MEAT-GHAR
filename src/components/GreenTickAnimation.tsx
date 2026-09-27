import React, { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import greenTickData from '../assets/greenTickData';

interface GreenTickAnimationProps {
  className?: string;
  size?: number;
  loop?: boolean;
}

export const GreenTickAnimation: React.FC<GreenTickAnimationProps> = ({
  className = '',
  size = 120,
  loop = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (animRef.current) {
      animRef.current.destroy();
      animRef.current = null;
    }

    try {
      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop,
        autoplay: true,
        animationData: greenTickData,
      });
    } catch (e) {
      console.error('Lottie load failed', e);
    }

    return () => {
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, [loop]);

  return (
    <div
      ref={containerRef}
      style={{ width: size, height: size }}
      className={`flex items-center justify-center pointer-events-none ${className}`}
    />
  );
};
