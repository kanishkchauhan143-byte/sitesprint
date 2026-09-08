'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { TrustStrip } from '@/components/sections/TrustStrip';
import { Services } from '@/components/sections/Services';
import { WhySiteSprint } from '@/components/sections/WhySiteSprint';
import { Process } from '@/components/sections/Process';
import { Work } from '@/components/sections/Work';
import { Features } from '@/components/sections/Features';
import { FAQ } from '@/components/sections/FAQ';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Footer } from '@/components/layout/Footer';
import { Modal } from '@/components/ui/Modal';
import { ContactForm } from '@/components/forms/ContactForm';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Visually-Hidden Skip to Content Link for Keyboard / Screen Readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--current)] focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none"
      >
        Skip to content
      </a>

      {/* Sticky Header Navigation */}
      <Navbar onOpenModal={handleOpenModal} />

      {/* Main Semantic Page Content */}
      <main id="main-content" className="relative z-10">
        <Hero onOpenModal={handleOpenModal} />
        <TrustStrip />
        <Services />
        <WhySiteSprint />
        <Process />
        <Work />
        <Features />
        <FAQ />
        <FinalCTA onOpenModal={handleOpenModal} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Contact Dialog Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Start Your Project"
      >
        <ContactForm onSuccess={handleCloseModal} />
      </Modal>
    </>
  );
}
