'use client';

import React, { useState, useEffect } from 'react';
import { NAV_ITEMS, NavItem } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { LogoMark } from '@/components/ui/LogoMark';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onOpenModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);

      // Simple active section detection based on element viewport offsets
      const sections = NAV_ITEMS.map((item) => item.href.replace('#', '')).filter(Boolean);
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A0A0C]/80 backdrop-blur-md border-b border-[var(--hairline)] py-3 shadow-lg'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--current-bright)] rounded-lg p-1 -ml-1"
          >
            <LogoMark size="md" />
            <span className="font-heading font-semibold text-xl tracking-tight text-[var(--paper)]">
              SiteSprint
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {NAV_ITEMS.map((item: NavItem) => {
              const sectionId = item.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`relative py-1 transition-colors duration-200 ${
                    isActive
                      ? 'text-[var(--current-bright)]'
                      : 'text-[var(--mist)] hover:text-[var(--paper)]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--current-bright)] rounded-full animate-fade-in" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center">
            <Button variant="primary" size="sm" onClick={onOpenModal}>
              Start a Project
            </Button>
          </div>

          {/* Mobile Hamburger Trigger */}
          <motion.button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open navigation menu"
            className="md:hidden p-2.5 text-[var(--paper)] hover:text-[var(--current-bright)] rounded-xl border border-[var(--hairline)] bg-[var(--elevated)]/90 backdrop-blur-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--current-bright)] min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </motion.button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <MobileMenu
            isOpen={isMobileOpen}
            onClose={() => setIsMobileOpen(false)}
            onOpenModal={onOpenModal}
            activeSection={activeSection}
          />
        )}
      </AnimatePresence>
    </>
  );
};
