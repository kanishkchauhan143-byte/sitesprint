import React from 'react';

interface LogoMarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const LogoMark: React.FC<LogoMarkProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-7 h-7 p-1',
    md: 'w-8.5 h-8.5 p-1.5',
    lg: 'w-11 h-11 p-2',
    xl: 'w-16 h-16 p-3',
  };

  return (
    <div
      className={`${sizeMap[size]} ${className} rounded-xl bg-[#0A0A0C] border border-white/10 flex items-center justify-center shadow-md shrink-0 group-hover:border-[#7434FD]/60 group-hover:shadow-[0_0_18px_rgba(116,52,253,0.4)] transition-all duration-200`.trim()}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 163 134"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Top/Left Electric Purple Sprint Segment */}
        <polygon
          points="86,1 162,1 154,41 91,41 49,83 0,83"
          fill="#7434FD"
        />
        {/* Bottom/Right Crisp Silver-White Return Segment */}
        <polygon
          points="91,62 160,62 90,132 43,132 91,85"
          fill="#F6F6F7"
        />
      </svg>
    </div>
  );
};
