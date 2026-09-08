import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subhead?: string;
  align?: 'left' | 'center';
  id?: string;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subhead,
  align = 'center',
  id,
  className = '',
}) => {
  const alignment = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col max-w-3xl mb-12 sm:mb-16 ${alignment} ${className}`}>
      {eyebrow && (
        <span className="font-mono text-xs font-medium tracking-[0.1em] uppercase text-[var(--current-bright)] mb-3 inline-block">
          {eyebrow}
        </span>
      )}
      <h2
        id={id}
        className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.01em] text-[var(--paper)] leading-[1.15]"
      >
        {title}
      </h2>
      {subhead && (
        <p className="mt-4 text-base sm:text-lg text-[var(--mist)] leading-relaxed max-w-2xl">
          {subhead}
        </p>
      )}
    </div>
  );
};
