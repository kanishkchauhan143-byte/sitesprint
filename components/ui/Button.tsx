'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  onClick,
  disabled,
  type = 'button',
  ...props
}) => {
  const baseClasses =
    'group relative inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer overflow-hidden select-none';

  const sizeClasses = {
    sm: 'text-xs px-4 py-2 gap-1.5',
    md: 'text-sm px-6 py-3 gap-2',
    lg: 'text-base px-8 py-4 gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[var(--current)] to-[#8B5CF6] text-white hover:from-[var(--current-bright)] hover:to-[var(--current)] shadow-[0_4px_25px_-2px_var(--current-glow)] hover:shadow-[0_10px_40px_0_var(--current-glow)] border border-[var(--current-bright)]/30',
    ghost:
      'bg-transparent text-[var(--paper)] border border-[var(--hairline)] hover:border-[var(--current-bright)]/50 hover:bg-[var(--current)]/10 hover:text-white',
    secondary:
      'bg-[var(--elevated)] text-[var(--paper)] border border-[var(--hairline)] hover:border-[var(--current-bright)] hover:text-white',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {/* Light Shimmer Effect */}
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
      )}

      <span className="relative z-10 flex items-center gap-2">
        <span>{children}</span>
        {icon && (
          <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-1">
            {icon}
          </span>
        )}
      </span>
    </motion.button>
  );
};
