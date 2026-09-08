'use client';

import React from 'react';
import { FAQ_CONTENT } from '@/lib/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion } from '@/components/ui/Accordion';

export const FAQ: React.FC = () => {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-20 sm:py-28 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 border-t border-[var(--hairline)]"
    >
      <SectionHeading
        id="faq-heading"
        eyebrow={FAQ_CONTENT.eyebrow}
        title={FAQ_CONTENT.h2}
      />

      <Accordion items={FAQ_CONTENT.items} />
    </section>
  );
};
