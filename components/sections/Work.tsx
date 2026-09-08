'use client';

import React from 'react';
import { WORK_CONTENT, ConceptProject } from '@/lib/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { BrowserMockup } from '@/components/ui/BrowserMockup';
import { motion } from 'framer-motion';

export const Work: React.FC = () => {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative py-20 sm:py-28 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 border-t border-[var(--hairline)]"
    >
      {/* Background Soft Purple Glow */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[650px] h-[300px] sm:h-[450px] bg-[var(--current-glow)] opacity-20 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none -z-10" />

      <SectionHeading
        id="work-heading"
        eyebrow={WORK_CONTENT.eyebrow}
        title={WORK_CONTENT.h2}
        subhead={WORK_CONTENT.subhead}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
        {WORK_CONTENT.projects.map((project: ConceptProject, idx: number) => {
          const variantMap: Record<string, 'dental' | 'interior' | 'restaurant' | 'realestate'> = {
            'dental-clinic': 'dental',
            'northstar-dental': 'dental',
            'interior-studio': 'interior',
            'studio-auren': 'interior',
            'boutique-restaurant': 'restaurant',
            'luma-and-hearth': 'restaurant',
            'haven-co': 'realestate',
            'real-estate': 'realestate',
            'real-estate-agency': 'realestate',
          };

          const mockupVariant = variantMap[project.id] || 'abstract';
          const formattedNumber = `0${idx + 1}`;
          const cleanUrl = project.liveUrl
            ? project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
            : `sitesprint.ai/concept-${project.id}`;

          const PreviewWrapper = project.liveUrl ? 'a' : 'div';
          const previewProps = project.liveUrl
            ? {
                href: project.liveUrl,
                target: '_blank',
                rel: 'noopener noreferrer',
                'aria-label': `View live demo of ${project.title}`,
              }
            : {};

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative rounded-2xl sm:rounded-[20px] bg-[var(--elevated)] border border-[var(--hairline)] hover:border-[var(--current-bright)]/50 hover:shadow-[0_20px_45px_-15px_var(--current-glow)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Top Purple Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--current-bright)]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none" />

              <div>
                {/* Clickable Preview Container */}
                <PreviewWrapper
                  {...previewProps}
                  className="block relative p-4 xs:p-5 sm:p-7 bg-gradient-to-b from-[#181824] to-[var(--elevated)] border-b border-[var(--hairline)] overflow-hidden min-h-[220px] sm:min-h-[260px] flex items-center justify-center pt-12 sm:pt-14 cursor-pointer focus:outline-none"
                >
                  {/* Pinned "CONCEPT PROJECT" Badge */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 pointer-events-none">
                    <Badge variant="outline" className="shadow-[0_0_12px_var(--current-glow)] bg-[var(--current)]/20 text-[10px] sm:text-[11px] px-2 py-0.5 sm:px-2.5 sm:py-1">
                      {WORK_CONTENT.badgeText}
                    </Badge>
                  </div>

                  {/* Interactive Browser Mockup with Real Live Preview or Fallback */}
                  <div className="w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[380px] md:max-w-[430px] transform transition-transform duration-300">
                    <BrowserMockup
                      variant={mockupVariant}
                      url={cleanUrl}
                      image={project.image}
                      imageAlt={`${project.title} live website screenshot`}
                    />
                  </div>
                </PreviewWrapper>

                {/* Card Meta Content */}
                <div className="p-5 sm:p-7 md:p-8 flex flex-col text-left">
                  <span className="font-mono text-[11px] sm:text-xs text-[var(--current-bright)] uppercase tracking-wider mb-1.5 sm:mb-2 font-medium">
                    {formattedNumber} — {project.category}
                  </span>
                  <h3 className="font-heading font-semibold text-lg sm:text-xl text-[var(--paper)] mb-2 group-hover:text-[var(--current-bright)] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--mist)] leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* View Concept Action (if liveUrl exists) */}
              {project.liveUrl && (
                <div className="px-5 pb-5 sm:px-7 sm:pb-7 md:px-8 md:pb-8 pt-0">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono font-medium text-[var(--current-bright)] hover:text-white transition-colors group/link py-1"
                  >
                    <span>View Concept</span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5 group-hover/link:translate-x-1.5">→</span>
                  </a>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
