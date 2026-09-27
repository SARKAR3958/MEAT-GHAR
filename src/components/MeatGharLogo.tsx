import React from 'react';

interface MeatGharLogoProps {
  variant?: 'red' | 'white';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'header';
  showTagline?: boolean;
}

export const HeaderMeatGharLogo: React.FC<{ onClick?: () => void; variant?: 'red' | 'white' }> = ({
  onClick,
  variant = 'red',
}) => {
  const isWhite = variant === 'white';
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer hover:opacity-85 transition-opacity shrink-0 select-none"
    >
      <div className="w-6 h-6">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-2xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 12 L15 42 L15 84 C15 86.2 16.8 88 19 88 L81 88 C83.2 88 85 86.2 85 84 L85 42 Z"
            stroke={isWhite ? '#FFFFFF' : '#BA181B'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M68 25 L68 18 L76 18 L76 32"
            stroke={isWhite ? '#FFFFFF' : '#BA181B'}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g transform="translate(28, 40) scale(0.85)">
            <path
              d="M 12 22 C 12 12, 38 8, 46 16 C 54 24, 48 40, 36 42 C 24 44, 12 32, 12 22 Z"
              fill={isWhite ? '#FFFFFF' : '#BA181B'}
              stroke={isWhite ? '#FFFFFF' : '#BA181B'}
              strokeWidth="2"
            />
            <path
              d="M 20 23 C 20 18, 32 15, 37 19 C 42 23, 38 32, 30 33 C 22 34, 20 28, 20 23 Z"
              fill={isWhite ? '#BA181B' : '#FFFFFF'}
            />
            <path
              d="M 16 18 Q 28 14 42 20"
              stroke={isWhite ? '#BA181B' : '#FFFFFF'}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </svg>
      </div>
      <span
        className={`text-[11.5px] font-black ${
          isWhite ? 'text-white' : 'text-[#BA181B]'
        } tracking-tight leading-none mt-0.5`}
        style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
      >
        Meat Ghar
      </span>
    </div>
  );
};

export const MeatGharLogo: React.FC<MeatGharLogoProps> = ({
  variant = 'red',
  size = 'md',
  showTagline = false,
}) => {
  const isWhite = variant === 'white';

  if (size === 'header' || size === 'sm' || size === 'xs' || !showTagline) {
    return <HeaderMeatGharLogo variant={variant} />;
  }

  // Size calculations
  const iconSizes: Record<'xs' | 'sm' | 'md' | 'lg', string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-22 h-22',
  };

  const titleSizes: Record<'xs' | 'sm' | 'md' | 'lg', string> = {
    xs: 'text-xs font-black',
    sm: 'text-base font-bold',
    md: 'text-2xl font-extrabold',
    lg: 'text-3xl font-black',
  };

  const taglineSizes: Record<'xs' | 'sm' | 'md' | 'lg', string> = {
    xs: 'text-[7.5px]',
    sm: 'text-[10px]',
    md: 'text-xs font-semibold',
    lg: 'text-sm font-bold',
  };

  const activeSize: 'md' | 'lg' = size === 'lg' ? 'lg' : 'md';

  return (
    <div className="flex flex-col items-center text-center select-none">
      {/* Icon: House with steak cut inside */}
      <div className={`relative flex items-center justify-center ${iconSizes[activeSize]} mb-1.5 transition-transform duration-300 hover:scale-105`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* House outline */}
          <path
            d="M50 12 L15 42 L15 84 C15 86.2 16.8 88 19 88 L81 88 C83.2 88 85 86.2 85 84 L85 42 Z"
            stroke={isWhite ? '#FFFFFF' : '#BA181B'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Chimney */}
          <path
            d="M68 25 L68 18 L76 18 L76 32"
            stroke={isWhite ? '#FFFFFF' : '#BA181B'}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Steak inside house */}
          <g transform="translate(28, 40) scale(0.85)">
            {/* Oval steak body */}
            <path
              d="M 12 22 C 12 12, 38 8, 46 16 C 54 24, 48 40, 36 42 C 24 44, 12 32, 12 22 Z"
              fill={isWhite ? '#FFFFFF' : '#BA181B'}
              stroke={isWhite ? '#FFFFFF' : '#BA181B'}
              strokeWidth="2"
            />
            {/* Steak meat center red detail */}
            <path
              d="M 20 23 C 20 18, 32 15, 37 19 C 42 23, 38 32, 30 33 C 22 34, 20 28, 20 23 Z"
              fill={isWhite ? '#BA181B' : '#FFFFFF'}
            />
            {/* Fat marbling streak */}
            <path
              d="M 16 18 Q 28 14 42 20"
              stroke={isWhite ? '#BA181B' : '#FFFFFF'}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </svg>
      </div>

      {/* Brand Title */}
      <h1
        className={`${titleSizes[activeSize]} tracking-tight leading-none ${
          isWhite ? 'text-white' : 'text-[#BA181B]'
        }`}
        style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
      >
        Meat Ghar
      </h1>

      {/* Tagline */}
      {showTagline && (
        <p
          className={`mt-1 tracking-tight leading-none ${taglineSizes[activeSize]} ${
            isWhite ? 'text-white/90' : 'text-[#BA181B]'
          }`}
        >
          Fresh Meat. Fast Delivery.
        </p>
      )}
    </div>
  );
};
