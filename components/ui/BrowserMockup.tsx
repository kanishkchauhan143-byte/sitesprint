'use client';

import React from 'react';
import { Stethoscope, Home, Utensils, Building2, Globe, Sparkles } from 'lucide-react';

interface BrowserMockupProps {
  variant?: 'abstract' | 'dental' | 'interior' | 'restaurant' | 'realestate';
  url?: string;
  image?: string;
  imageAlt?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const BrowserMockup: React.FC<BrowserMockupProps> = ({
  variant = 'abstract',
  url = 'sitesprint.ai/preview',
  image,
  imageAlt,
  className = '',
  style,
}) => {
  const getIndustryTheme = () => {
    switch (variant) {
      case 'dental':
        return {
          badge: 'Healthcare & Wellness',
          accent: '#38BDF8',
          accentGlow: 'rgba(56, 189, 248, 0.25)',
          icon: <Stethoscope className="w-5 h-5 text-[#38BDF8]" />,
          title: 'Northstar Dental',
          sub: 'Book Online Appointment',
          cta: 'Book Appointment',
        };
      case 'interior':
        return {
          badge: 'Design & Architecture',
          accent: '#F59E0B',
          accentGlow: 'rgba(245, 158, 11, 0.25)',
          icon: <Home className="w-5 h-5 text-[#F59E0B]" />,
          title: 'Studio Auren',
          sub: 'Luxury Interior Design',
          cta: 'Explore Spaces',
        };
      case 'restaurant':
        return {
          badge: 'Hospitality & Dining',
          accent: '#A85D45',
          accentGlow: 'rgba(168, 93, 69, 0.25)',
          icon: <Utensils className="w-5 h-5 text-[#A85D45]" />,
          title: 'Luma & Hearth',
          sub: 'Seasonal Hearth Cooking',
          cta: 'Reserve Table',
        };
      case 'realestate':
        return {
          badge: 'Property & Investment',
          accent: '#10B981',
          accentGlow: 'rgba(16, 185, 129, 0.25)',
          icon: <Building2 className="w-5 h-5 text-[#10B981]" />,
          title: 'Real Estate Agency',
          sub: 'Modern Property Listings',
          cta: 'Explore Listings',
        };
      default:
        return {
          badge: 'Live Preview',
          accent: 'var(--current-bright)',
          accentGlow: 'var(--current-glow)',
          icon: <Sparkles className="w-5 h-5 text-[var(--current-bright)]" />,
          title: 'Modern Business Platform',
          sub: 'AI-Powered Architecture',
          cta: 'Get Started',
        };
    }
  };

  const theme = getIndustryTheme();

  return (
    <div
      className={`rounded-xl sm:rounded-2xl border border-[var(--hairline)] bg-[var(--elevated)]/90 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col transition-all duration-300 group-hover:border-[var(--current-bright)]/40 group-hover:shadow-[0_15px_35px_-10px_var(--current-glow)] ${className}`}
      style={style}
    >
      {/* Browser Chrome Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 sm:py-2.5 bg-[#0D0D11] border-b border-[var(--hairline)] select-none shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#FF5F56]/80" />
          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#FFBD2E]/80" />
          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#27C93F]/80" />
        </div>
        <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-full bg-[var(--void)] border border-[var(--hairline)] text-[10px] sm:text-[11px] text-[var(--mist)] font-mono max-w-[200px] truncate">
          <Globe className="w-3 h-3 shrink-0 text-[var(--mist)]" />
          <span className="truncate">{url}</span>
        </div>
        <div className="w-6 sm:w-8" />
      </div>

      {/* Mockup Window Content */}
      {image ? (
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#0A0A0C]">
          <img
            src={image}
            alt={imageAlt || `${theme.title} website preview`}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* Subtle gradient vignette to blend into dark edges */}
          <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10" />
        </div>
      ) : (
        /* Mini Mockup Window Content Fallback */
        <div className="p-4 sm:p-5 flex-1 flex flex-col gap-4 bg-gradient-to-b from-[#131318] to-[#0A0A0C] text-[var(--paper)] select-none">
          {/* Navigation Mock */}
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-white/5">{theme.icon}</div>
              <span className="font-heading font-semibold text-xs text-white tracking-tight">
                {theme.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1.5 rounded-full bg-white/10" />
              <div className="w-8 h-1.5 rounded-full bg-white/10" />
              <div
                className="px-2 py-0.5 rounded-full text-[9px] font-medium text-white shadow-sm"
                style={{ backgroundColor: theme.accent }}
              >
                {theme.cta}
              </div>
            </div>
          </div>

          {/* Hero Banner Mock */}
          <div className="relative rounded-xl p-3 sm:p-4 bg-white/[0.02] border border-white/5 flex flex-col gap-2 overflow-hidden">
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border"
                style={{
                  color: theme.accent,
                  borderColor: theme.accentGlow,
                  backgroundColor: theme.accentGlow,
                }}
              >
                {theme.badge}
              </span>
            </div>
            <div className="w-3/4 h-3.5 rounded bg-white/20" />
            <div className="w-1/2 h-2 rounded bg-white/10" />
            <div className="flex items-center gap-2 mt-1">
              <div
                className="h-5 px-3 rounded-full text-[9px] font-medium text-white flex items-center justify-center shadow"
                style={{ backgroundColor: theme.accent }}
              >
                Contact Us
              </div>
              <div className="h-5 w-12 rounded-full border border-white/10 flex items-center justify-center text-[9px] text-white/50">
                Learn
              </div>
            </div>
          </div>

          {/* Layout Grid Blocks Mock */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col gap-1.5">
              <div
                className="w-4 h-4 rounded flex items-center justify-center text-[10px]"
                style={{ backgroundColor: theme.accentGlow }}
              >
                ✦
              </div>
              <div className="w-full h-1.5 rounded bg-white/20" />
              <div className="w-2/3 h-1 rounded bg-white/10" />
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col gap-1.5">
              <div
                className="w-4 h-4 rounded flex items-center justify-center text-[10px]"
                style={{ backgroundColor: theme.accentGlow }}
              >
                ★
              </div>
              <div className="w-full h-1.5 rounded bg-white/20" />
              <div className="w-2/3 h-1 rounded bg-white/10" />
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col gap-1.5">
              <div
                className="w-4 h-4 rounded flex items-center justify-center text-[10px]"
                style={{ backgroundColor: theme.accentGlow }}
              >
                ♦
              </div>
              <div className="w-full h-1.5 rounded bg-white/20" />
              <div className="w-2/3 h-1 rounded bg-white/10" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
