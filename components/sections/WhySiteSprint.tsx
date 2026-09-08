'use client';

import React from 'react';
import { WHY_SITESPRINT_CONTENT, WhyItem } from '@/lib/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Sparkles, Compass, Layers, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export const WhySiteSprint: React.FC = () => {
  const getIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6 text-[var(--current-bright)]' };
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Compass':
        return <Compass {...props} />;
      case 'Layers':
        return <Layers {...props} />;
      case 'Target':
        return <Target {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  return (
    <section
      id="why-us"
      aria-labelledby="why-heading"
      className="relative py-20 sm:py-28 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 border-t border-[var(--hairline)]"
    >
      {/* Background Soft Purple Glow */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[320px] sm:w-[500px] h-[300px] sm:h-[350px] bg-[var(--current-glow)] opacity-15 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none -z-10" />

      <SectionHeading
        id="why-heading"
        title={WHY_SITESPRINT_CONTENT.h2}
        align="center"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 max-w-5xl mx-auto mt-6 sm:mt-8">
        {WHY_SITESPRINT_CONTENT.items.map((item: WhyItem, idx: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group flex items-start gap-5 text-left"
          >
            {/* Rich purple accent-outlined circle with glow */}
            <div className="w-12 h-12 rounded-full border border-[var(--current-bright)]/60 bg-[var(--current)]/20 shadow-[0_0_15px_var(--current-glow)] group-hover:scale-110 group-hover:border-[var(--current-bright)] transition-all duration-300 flex items-center justify-center shrink-0 mt-1">
              {getIcon(item.iconName)}
            </div>

            <div>
              <h3 className="font-heading font-semibold text-xl text-[var(--paper)] mb-2 group-hover:text-[var(--current-bright)] transition-colors">
                {item.title}
              </h3>
              <p className="text-base text-[var(--mist)] leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
