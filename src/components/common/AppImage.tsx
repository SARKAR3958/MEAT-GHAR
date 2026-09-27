import React, { useState } from 'react';
import { getImageUrl } from '../../utils/imageAssets';

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
  const resolvedSrc = getImageUrl(src);
  const [currentSrc, setCurrentSrc] = useState<string>(resolvedSrc);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const handleError = () => {
    // If resolvedSrc failed, try fallback paths
    const filename = src.split('/').pop();
    if (!hasError && filename) {
      if (currentSrc !== `/images/${filename}`) {
        setCurrentSrc(`/images/${filename}`);
        return;
      }
      if (currentSrc !== `/assets/images/${filename}`) {
        setCurrentSrc(`/assets/images/${filename}`);
        return;
      }
      if (fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        return;
      }
    }
    setHasError(true);
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading="eager"
      decoding="async"
      onError={handleError}
      onLoad={() => setIsLoaded(true)}
      className={`${className} ${!isLoaded ? 'bg-slate-100' : ''} transition-opacity duration-200`}
      {...props}
    />
  );
};

export default AppImage;
