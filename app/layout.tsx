import type { Metadata } from 'next';
import { Poppins, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sitesprint.example'),
  title: 'SiteSprint — Modern AI-Powered Websites for Businesses',
  description:
    'SiteSprint designs and builds premium, AI-powered websites for small and medium businesses — modern, mobile-first, and built to convert.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'SiteSprint — Modern AI-Powered Websites for Businesses',
    description:
      'SiteSprint designs and builds premium, AI-powered websites for small and medium businesses — modern, mobile-first, and built to convert.',
    url: 'https://sitesprint.example',
    siteName: 'SiteSprint',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SiteSprint — Modern AI-Powered Websites for Businesses',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SiteSprint — Modern AI-Powered Websites for Businesses',
    description:
      'SiteSprint designs and builds premium, AI-powered websites for small and medium businesses — modern, mobile-first, and built to convert.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Organization Schema
  // Note: Replace https://sitesprint.example once a production domain is deployed.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SiteSprint',
    url: 'https://sitesprint.example',
    logo: 'https://sitesprint.example/favicon.svg',
    email: 'team.sitesprint@gmail.com',
    sameAs: ['https://instagram.com/sitesprintweb'],
  };

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${jetbrainsMono.variable} dark scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[var(--void)] text-[var(--paper)] font-sans antialiased selection:bg-[var(--current)] selection:text-white">
        {children}
      </body>
    </html>
  );
}
