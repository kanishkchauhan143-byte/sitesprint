'use client';

import React, { useEffect, useRef } from 'react';
import { X, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { NAV_ITEMS, NavItem } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { LogoMark } from '@/components/ui/LogoMark';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenModal: () => void;
  activeSection: string;
}

const menuVariants: Variants = {
  hidden: {
    opacity: 0,
    y: '-100%',
    transition: {
      duration: 0.35,
      ease: [0.32, 0, 0.67, 0],
    },
  },
  visible: {
    opacity: 1,
    y: '0%',
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
      when: 'beforeChildren',
    },
  },
};

const navListVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.12,
    },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, x: -24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      damping: 24,
      stiffness: 260,
    },
  },
};

const footerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      delay: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onOpenModal,
  activeSection,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      ref={menuRef}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={menuVariants}
      className="fixed inset-0 z-50 flex flex-col bg-[#0A0A0C]/98 backdrop-blur-2xl p-6 sm:p-8 overflow-y-auto no-scrollbar"
    >
      {/* Top Ambient Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--current-bright)] to-transparent opacity-80" />

      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[var(--hairline)]">
        <a
          href="#"
          onClick={onClose}
          className="flex items-center gap-2.5 group focus-visible:outline-none"
        >
          <LogoMark size="md" />
          <span className="font-heading font-semibold text-xl tracking-tight text-[var(--paper)]">
            SiteSprint
          </span>
        </a>

        <motion.button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-[var(--mist)] hover:text-white rounded-full bg-[var(--elevated)] hover:bg-[var(--hairline)] border border-[var(--hairline)] transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--current-bright)]"
        >
          <X className="w-5 h-5 text-[var(--paper)]" aria-hidden="true" />
        </motion.button>
      </div>

      {/* Nav Links */}
      <motion.nav
        variants={navListVariants}
        className="flex flex-col gap-3 my-auto py-8"
      >
        {NAV_ITEMS.map((item: NavItem) => {
          const isActive = activeSection === item.href.replace('#', '');
          return (
            <motion.a
              key={item.label}
              href={item.href}
              onClick={onClose}
              variants={navItemVariants}
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.98 }}
              className={`relative group py-3.5 px-5 rounded-2xl text-xl font-heading font-medium transition-all duration-200 min-h-[52px] flex items-center justify-between ${
                isActive
                  ? 'text-[var(--current-bright)] bg-[var(--current)]/10 border border-[var(--current)]/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                  : 'text-[var(--paper)] hover:text-[var(--current-bright)] hover:bg-[var(--hairline)]/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[var(--current-bright)] shadow-[0_0_8px_var(--current-bright)] animate-pulse" />
                )}
                <span>{item.label}</span>
              </div>
              <ArrowUpRight className={`w-5 h-5 transition-transform duration-200 ${
                isActive ? 'opacity-100 text-[var(--current-bright)] translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-[var(--mist)]'
              }`} />
            </motion.a>
          );
        })}
      </motion.nav>

      {/* Mobile Footer CTA */}
      <motion.div
        variants={footerVariants}
        className="pt-6 border-t border-[var(--hairline)] mt-auto flex flex-col gap-4"
      >
        <div className="flex items-center justify-between px-1 text-xs text-[var(--mist)]">
          <span className="flex items-center gap-1.5 text-[var(--current-bright)] font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Ready in 7 Days
          </span>
          <span>Next Day Kickoff</span>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full text-base min-h-[52px] shadow-lg shadow-[var(--current-glow)]"
          onClick={() => {
            onClose();
            onOpenModal();
          }}
        >
          Start a Project
        </Button>
      </motion.div>
    </motion.div>
  );
};

