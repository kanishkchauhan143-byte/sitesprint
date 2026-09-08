import React from 'react';

interface LogoMarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LogoMark: React.FC<LogoMarkProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <div
      className={`${sizeMap[size]} ${className} rounded-xl bg-[#0A0A0C] border border-white/10 flex items-center justify-center p-1 shadow-md shrink-0 group-hover:border-[var(--current-bright)]/50 group-hover:shadow-[0_0_15px_var(--current-glow)] transition-all duration-200`.trim()}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Left Chevron - Bright Purple Accent (#A78BFA) */}
        <path
          d="M21 42L31 32L21 22"
          fill="none"
          stroke="#A78BFA"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Right Chevron - Primary Purple Accent (#7C3AED) */}
        <path
          d="M33 42L43 32L33 22"
          fill="none"
          stroke="#7C3AED"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
