'use client';

import React from 'react';
import { FEATURES_CONTENT, FeatureItem } from '@/lib/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  Smartphone,
  Zap,
  Search,
  MousePointerClick,
  Mail,
  MessageSquare,
  MapPin,
  Share2,
  BarChart3,
  FileEdit,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Features: React.FC = () => {
  const getIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5 text-[var(--current-bright)] shrink-0' };
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone {...props} />;
      case 'Zap':
        return <Zap {...props} />;
      case 'Search':
        return <Search {...props} />;
      case 'MousePointerClick':
        return <MousePointerClick {...props} />;
      case 'Mail':
        return <Mail {...props} />;
      case 'MessageSquare':
        return <MessageSquare {...props} />;
      case 'MapPin':
        return <MapPin {...props} />;
      case 'Share2':
        return <Share2 {...props} />;
      case 'BarChart3':
        return <BarChart3 {...props} />;
      case 'FileEdit':
        return <FileEdit {...props} />;
      default:
        return <Zap {...props} />;
    }
  };

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="relative py-20 sm:py-28 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 border-t border-[var(--hairline)]"
    >
      {/* Background Soft Purple Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[300px] sm:h-[350px] bg-[var(--current-glow)] opacity-15 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none -z-10" />

      <SectionHeading
        id="features-heading"
        title={FEATURES_CONTENT.h2}
        subhead={FEATURES_CONTENT.subhead}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-8 sm:gap-x-10 sm:gap-y-10 mt-10 sm:mt-12 max-w-6xl mx-auto">
        {FEATURES_CONTENT.items.map((item: FeatureItem, idx: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: idx * 0.04 }}
            className="group flex items-center gap-3.5 text-left py-1"
          >
            <div className="p-2.5 rounded-xl bg-[var(--current)]/15 border border-[var(--current-bright)]/30 group-hover:border-[var(--current-bright)]/70 group-hover:bg-[var(--current)]/25 group-hover:shadow-[0_0_15px_var(--current-glow)] shrink-0 transition-all duration-200">
              {getIcon(item.iconName)}
            </div>
            <span className="font-heading font-medium text-sm text-[var(--paper)] leading-snug group-hover:text-[var(--current-bright)] transition-colors">
              {item.title}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
