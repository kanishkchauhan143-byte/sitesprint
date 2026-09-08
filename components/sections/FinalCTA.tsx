'use client';

import React from 'react';
import { FINAL_CTA_CONTENT } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';

interface FinalCTAProps {
  onOpenModal: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenModal }) => {
  return (
    <section className="relative py-20 sm:py-28 md:py-40 overflow-hidden border-t border-[var(--hairline)]">
      {/* Centered Soft Radial Purple Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[750px] h-[250px] sm:h-[450px] bg-[var(--current-glow)] opacity-35 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center flex flex-col items-center">
        {/* Staggered Container */}
        <div className="flex flex-col items-center w-full">
          {/* 1. Heading Entrance */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--paper)] mb-6 leading-[1.1] tracking-[-0.02em]"
          >
            {FINAL_CTA_CONTENT.h2}
          </motion.h2>

          {/* 2. Subhead Entrance */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-xl text-[var(--mist)] max-w-2xl leading-relaxed mb-10"
          >
            {FINAL_CTA_CONTENT.subhead}
          </motion.p>

          {/* 3. Button Entrance & Animated Glow Pulse */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 18,
              delay: 0.3,
            }}
            className="relative group"
          >
            {/* Ambient Breathing Pulse Glow Behind Button */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.75, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -inset-1 rounded-full bg-gradient-to-r from-[var(--current-bright)] to-[var(--current)] blur-lg opacity-50 pointer-events-none"
            />

            <Button
              variant="primary"
              size="lg"
              onClick={onOpenModal}
              icon={<ArrowRight className="w-4 h-4" />}
              className="relative text-base sm:text-lg px-10 py-4.5 shadow-[0_12px_40px_var(--current-glow)]"
            >
              {FINAL_CTA_CONTENT.primaryCta}
            </Button>
          </motion.div>

          {/* 4. Quiet Mailto Line Entrance */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-8 flex items-center gap-2 text-xs sm:text-sm text-[var(--mist)]"
          >
            <span>{FINAL_CTA_CONTENT.emailText}</span>
            <a
              href={`mailto:${FINAL_CTA_CONTENT.emailAddress}`}
              className="inline-flex items-center gap-1.5 text-[var(--paper)] hover:text-[var(--current-bright)] transition-colors underline underline-offset-4 font-medium"
            >
              <Mail className="w-3.5 h-3.5 text-[var(--current-bright)] shrink-0" />
              <span>{FINAL_CTA_CONTENT.emailAddress}</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
