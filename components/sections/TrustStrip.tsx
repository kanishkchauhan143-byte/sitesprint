import React from 'react';
import { TRUST_STRIP_CONTENT } from '@/lib/content';
import { Cpu, Smartphone, Target, Building } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const getIcon = (iconName: string) => {
    const iconStyle = 'w-4 h-4 text-[var(--current-bright)] shrink-0';
    switch (iconName) {
      case 'Cpu':
        return <Cpu className={iconStyle} />;
      case 'Smartphone':
        return <Smartphone className={iconStyle} />;
      case 'Target':
        return <Target className={iconStyle} />;
      case 'Building':
        return <Building className={iconStyle} />;
      default:
        return <Cpu className={iconStyle} />;
    }
  };

  return (
    <section className="w-full bg-[var(--elevated)]/60 border-y border-[var(--hairline)] py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3.5 sm:gap-8 md:gap-12 text-xs sm:text-sm text-[var(--paper)] font-medium">
          {TRUST_STRIP_CONTENT.highlights.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              {getIcon(item.iconName)}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
