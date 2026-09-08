import React from 'react';
import { NAV_ITEMS, FOOTER_CONTENT } from '@/lib/content';
import { LogoMark } from '@/components/ui/LogoMark';
import { Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[var(--void)] border-t border-[var(--hairline)] pt-16 pb-12 text-[var(--mist)] text-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-[var(--hairline)]">
          {/* Column 1: Brand & Tagline */}
          <div className="flex flex-col gap-3">
            <a href="#" className="flex items-center gap-2.5 w-fit group">
              <LogoMark size="sm" />
              <span className="font-heading font-semibold text-lg tracking-tight text-[var(--paper)]">
                SiteSprint
              </span>
            </a>
            <p className="text-xs text-[var(--mist)] max-w-xs leading-relaxed">
              {FOOTER_CONTENT.tagline}
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--paper)] mb-1">
              Navigation
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="hover:text-[var(--current-bright)] transition-colors py-1"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Contact & Social */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--paper)] mb-1">
              Direct Contact
            </span>
            <a
              href={`mailto:${FOOTER_CONTENT.emailAddress}`}
              className="inline-flex items-center gap-2 text-xs text-[var(--paper)] hover:text-[var(--current-bright)] transition-colors w-fit"
            >
              <Mail className="w-3.5 h-3.5 text-[var(--current-bright)] shrink-0" />
              <span>{FOOTER_CONTENT.emailAddress}</span>
            </a>
            <a
              href={FOOTER_CONTENT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-[var(--paper)] hover:text-[var(--current-bright)] transition-colors w-fit"
            >
              <svg
                className="w-3.5 h-3.5 text-[var(--current-bright)] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span>{FOOTER_CONTENT.instagramHandle}</span>
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 text-center text-xs text-[var(--mist)]/70">
          <p>{FOOTER_CONTENT.copyright}</p>
        </div>
      </div>
    </footer>
  );
};
