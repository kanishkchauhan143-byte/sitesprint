'use client';

import React from 'react';
import { PROCESS_CONTENT, ProcessStep } from '@/lib/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { motion } from 'framer-motion';

export const Process: React.FC = () => {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="py-20 sm:py-28 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 border-t border-[var(--hairline)]"
    >
      <SectionHeading
        id="process-heading"
        eyebrow={PROCESS_CONTENT.eyebrow}
        title={PROCESS_CONTENT.h2}
      />

      {/* Desktop Horizontal Timeline / Mobile Vertical Timeline */}
      <div className="relative mt-8 sm:mt-12">
        {/* Horizontal Connecting Line (Desktop) */}
        <div className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[var(--hairline)] via-[var(--current-bright)]/40 to-[var(--hairline)] -z-0" />

        {/* Vertical Connecting Line (Mobile) */}
        <div className="lg:hidden absolute top-[24px] bottom-[24px] left-[23px] sm:left-[27px] w-[2px] bg-gradient-to-b from-[var(--hairline)] via-[var(--current-bright)]/40 to-[var(--hairline)] -z-0" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-6 relative z-10">
          {PROCESS_CONTENT.steps.map((step: ProcessStep, idx: number) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="relative flex lg:flex-col items-start text-left gap-4 sm:gap-6 lg:gap-4 pl-14 sm:pl-16 lg:pl-0"
            >
              {/* Step Circle with Utility Monospace Number */}
              <div className="absolute lg:relative left-0 lg:left-auto top-0 lg:top-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--elevated)] border-2 border-[var(--current-bright)] text-[var(--current-bright)] font-mono font-bold text-base sm:text-lg flex items-center justify-center shadow-[0_0_20px_var(--current-glow)] shrink-0">
                {step.step}
              </div>

              <div>
                <h3 className="font-heading font-semibold text-lg sm:text-xl text-[var(--paper)] mb-1.5 sm:mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--mist)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
