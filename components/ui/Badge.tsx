import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'outline' | 'solid' | 'muted';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'outline',
  className = '',
}) => {
  const baseStyle =
    'inline-flex items-center font-mono text-[11px] sm:text-[12px] font-medium tracking-[0.08em] uppercase px-2.5 py-1 rounded-full border transition-colors';

  const variantStyles = {
    outline:
      'border-[var(--current-bright)]/40 text-[var(--current-bright)] bg-[var(--current)]/10',
    solid:
      'border-transparent bg-[var(--current)] text-white',
    muted:
      'border-[var(--hairline)] text-[var(--mist)] bg-[var(--elevated)]',
  };

  return (
    <span className={`${baseStyle} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
