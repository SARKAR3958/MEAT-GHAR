import React, { useState, useEffect } from 'react';
import { getImageUrl, STATIC_IMAGES } from '../../utils/imageAssets';

interface AppImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
}

export const AppImage: React.FC<AppImageProps> = ({
  src,
  alt = 'Meat Ghar',
  className = '',
  fallbackSrc,
  ...props
}) => {
  const initialUrl = getImageUrl(src);
  const [currentSrc, setCurrentSrc] = useState<string>(initialUrl || src);
  const [attempt, setAttempt] = useState<number>(0);

  useEffect(() => {
    const nextUrl = getImageUrl(src);
    setCurrentSrc(nextUrl || src);
    setAttempt(0);
  }, [src]);

  const handleError = () => {
    const filename = src.split('/').pop()?.split('?')[0];

    if (attempt === 0 && filename && STATIC_IMAGES[filename]) {
      setAttempt(1);
      setCurrentSrc(STATIC_IMAGES[filename]);
      return;
    }

    if (attempt <= 1 && filename) {
      setAttempt(2);
      if (currentSrc !== `/images/${filename}`) {
        setCurrentSrc(`/images/${filename}`);
        return;
      }
    }

    if (attempt <= 2 && filename) {
      setAttempt(3);
      if (currentSrc !== `/assets/images/${filename}`) {
        setCurrentSrc(`/assets/images/${filename}`);
        return;
      }
    }

    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setAttempt(4);
      setCurrentSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading="eager"
      decoding="async"
      onError={handleError}
      className={className}
      {...props}
    />
  );
};

export default AppImage;
