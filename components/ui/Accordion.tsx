'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQItem } from '@/lib/content';

interface AccordionProps {
  items: FAQItem[];
}

export const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full max-w-3xl mx-auto divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const buttonId = `accordion-button-${item.id}`;
        const contentId = `accordion-content-${item.id}`;

        return (
          <div key={item.id} className="py-5 sm:py-6 transition-colors">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center justify-between text-left font-heading font-medium text-lg sm:text-xl text-[var(--paper)] hover:text-[var(--current-bright)] transition-colors gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--current-bright)] rounded-sm py-1"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[var(--mist)] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[var(--current-bright)]' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={contentId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-base text-[var(--mist)] leading-relaxed pr-6">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
