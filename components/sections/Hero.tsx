'use client';

import React from 'react';
import { HERO_CONTENT } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { BrowserMockup } from '@/components/ui/BrowserMockup';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenModal }) => {
  return (
    <section className="relative pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-24 md:pb-28 overflow-hidden min-h-[85vh] sm:min-h-[90vh] flex items-center">
      {/* Background Soft Purple Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] xs:w-[500px] sm:w-[700px] md:w-[800px] h-[250px] sm:h-[400px] bg-[var(--current-glow)] opacity-25 blur-[100px] sm:blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Tag / Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--current-bright)]/30 bg-[var(--current)]/10 text-[var(--current-bright)] font-mono text-[11px] sm:text-xs font-medium uppercase tracking-[0.08em] mb-4 sm:mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Web Design Agency</span>
            </div>

            {/* H1 Headline */}
            <h1 className="hero-h1 font-heading text-[var(--paper)] mb-4 sm:mb-6 max-w-2xl font-bold tracking-[-0.02em]">
              Your business deserves a website that{' '}
              <span className="bg-gradient-to-r from-[var(--current-bright)] via-[#C084FC] to-[var(--current)] bg-clip-text text-transparent">
                {HERO_CONTENT.highlightText}
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-sm sm:text-base md:text-lg text-[var(--mist)] leading-relaxed mb-6 sm:mb-8 max-w-xl">
              {HERO_CONTENT.subhead}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenModal}
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto text-sm sm:text-base py-3.5 sm:py-4"
              >
                {HERO_CONTENT.primaryCta}
              </Button>
              <a href="#work" className="w-full sm:w-auto">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto text-sm sm:text-base py-3.5 sm:py-4">
                  {HERO_CONTENT.secondaryCta}
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Signature Layered Browser Mockup Composition */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[290px] xs:min-h-[330px] sm:min-h-[440px] select-none w-full max-w-full py-4 sm:py-0 overflow-visible">
            {/* Radial Glow Frame */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--current)]/25 via-[var(--current-glow)]/15 to-transparent blur-2xl rounded-full opacity-70 pointer-events-none" />

            {/* Mockup Frame 1 (Background left tilted -6 deg) */}
            <motion.div
              initial={{ opacity: 0, y: 24, rotate: -6 }}
              animate={{ opacity: 0.55, y: 0, rotate: -6 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-[170px] xs:w-[200px] sm:w-[270px] md:w-[280px] -left-2 xs:left-0 sm:left-0 top-1 sm:top-4 pointer-events-none z-0"
            >
              <motion.div
                animate={{ y: [-3, 3, -3] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <BrowserMockup
                  variant="realestate"
                  url="sitesprint.ai/realestate"
                  className="shadow-xl opacity-60 sm:opacity-60 scale-90 sm:scale-90"
                />
              </motion.div>
            </motion.div>

            {/* Mockup Frame 2 (Background right tilted 5 deg) */}
            <motion.div
              initial={{ opacity: 0, y: 24, rotate: 5 }}
              animate={{ opacity: 0.7, y: 0, rotate: 5 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-[180px] xs:w-[210px] sm:w-[280px] md:w-[290px] -right-2 xs:right-0 sm:right-0 top-7 sm:top-12 pointer-events-none z-0"
            >
              <motion.div
                animate={{ y: [3.5, -3.5, 3.5] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <BrowserMockup
                  variant="interior"
                  url="sitesprint.ai/studio"
                  className="shadow-2xl opacity-75 sm:opacity-75 scale-95 sm:scale-95"
                />
              </motion.div>
            </motion.div>

            {/* Mockup Frame 3 (Foreground center tilted -2 deg) */}
            <motion.div
              initial={{ opacity: 0, y: 35, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[230px] xs:w-[265px] sm:w-[340px] z-10 my-2 sm:my-0"
            >
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <BrowserMockup
                  variant="abstract"
                  url="sitesprint.ai/modern-web"
                  className="shadow-[0_15px_45px_rgba(124,58,237,0.35)] border-[var(--current-bright)]/35"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
