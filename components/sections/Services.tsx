'use client';

import React from 'react';
import { SERVICES_CONTENT, ServiceItem } from '@/lib/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Globe, Zap, RefreshCw, Smartphone, TrendingUp, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const Services: React.FC = () => {
  const getIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6 text-[var(--current-bright)]' };
    switch (iconName) {
      case 'Globe':
        return <Globe {...props} />;
      case 'Zap':
        return <Zap {...props} />;
      case 'RefreshCw':
        return <RefreshCw {...props} />;
      case 'Smartphone':
        return <Smartphone {...props} />;
      case 'TrendingUp':
        return <TrendingUp {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      default:
        return <Globe {...props} />;
    }
  };

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative py-20 sm:py-28 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 md:px-8"
    >
      {/* Background Soft Purple Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[300px] sm:h-[400px] bg-[var(--current-glow)] opacity-20 blur-[100px] sm:blur-[130px] rounded-full pointer-events-none -z-10" />

      <SectionHeading
        id="services-heading"
        eyebrow={SERVICES_CONTENT.eyebrow}
        title={SERVICES_CONTENT.h2}
        subhead={SERVICES_CONTENT.subhead}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
        {SERVICES_CONTENT.items.map((service: ServiceItem, idx: number) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="group relative p-6 sm:p-7 md:p-8 rounded-2xl sm:rounded-[20px] bg-[var(--elevated)] border border-[var(--hairline)] hover:border-[var(--current-bright)]/50 hover:shadow-[0_20px_40px_-15px_var(--current-glow)] transition-all duration-300 flex flex-col items-start text-left overflow-hidden"
          >
            {/* Top Purple Gradient Border Accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--current-bright)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Accent Glow backdrop on hover */}
            <div className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-[var(--current)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="w-12 h-12 rounded-xl bg-[var(--current)]/20 border border-[var(--current-bright)]/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[var(--current-bright)]/70 group-hover:shadow-[0_0_15px_var(--current-glow)] transition-all duration-300">
              {getIcon(service.iconName)}
            </div>

            <h3 className="font-heading font-semibold text-xl text-[var(--paper)] mb-3 group-hover:text-[var(--current-bright)] transition-colors">
              {service.title}
            </h3>

            <p className="text-sm text-[var(--mist)] leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
