export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface WhyItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ConceptProject {
  id: string;
  title: string;
  description: string;
  category: string;
  iconName: string;
  liveUrl?: string;
  image?: string;
  colorScheme: {
    primary: string;
    secondary: string;
    bgAccent: string;
  };
}

export interface FeatureItem {
  id: string;
  title: string;
  description?: string;
  iconName: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Services', href: '#services' },
  { label: 'Why SiteSprint', href: '#why-us' },
  { label: 'Process', href: '#process' },
  { label: 'Work', href: '#work' },
  { label: 'FAQ', href: '#faq' },
];

export const HERO_CONTENT = {
  h1: 'Your business deserves a website that works as hard as you do.',
  highlightText: 'works as hard as you do.',
  subhead: 'We design and build modern, AI-powered websites that make your business look credible, stand out online, and turn visitors into real inquiries.',
  primaryCta: 'Start a Project',
  secondaryCta: 'See Our Work',
};

export const TRUST_STRIP_CONTENT = {
  highlights: [
    { label: 'AI-Powered', iconName: 'Cpu' },
    { label: 'Mobile-First', iconName: 'Smartphone' },
    { label: 'Conversion-Focused', iconName: 'Target' },
    { label: 'Built for Modern Businesses', iconName: 'Building' },
  ],
};

export const SERVICES_CONTENT = {
  eyebrow: 'SERVICES',
  h2: 'Everything your business needs to win online.',
  subhead: 'From new builds to full redesigns — modern websites, done right.',
  items: [
    {
      id: 'business-websites',
      title: 'Business Websites',
      description: 'A complete, professional website that represents your business the way it deserves — clean, modern, and built to convert visitors into inquiries.',
      iconName: 'Globe',
    },
    {
      id: 'landing-pages',
      title: 'Landing Pages',
      description: 'Focused, high-converting single pages for campaigns, launches, or specific offers — built for speed and clarity.',
      iconName: 'Zap',
    },
    {
      id: 'website-redesigns',
      title: 'Website Redesigns',
      description: 'A modern rebuild of your existing website — same business, dramatically better first impression.',
      iconName: 'RefreshCw',
    },
    {
      id: 'mobile-first',
      title: 'Mobile-First Design',
      description: 'Every SiteSprint website is designed mobile-first, because that\'s where most of your visitors actually are.',
      iconName: 'Smartphone',
    },
    {
      id: 'conversion-ux',
      title: 'Conversion-Focused UX',
      description: 'Layouts, structure, and calls-to-action designed to guide visitors toward contacting you — not just browsing.',
      iconName: 'TrendingUp',
    },
    {
      id: 'maintenance-updates',
      title: 'Website Maintenance & Updates',
      description: 'Ongoing support to keep your website fast, current, and working exactly as it should.',
      iconName: 'ShieldCheck',
    },
  ] as ServiceItem[],
};

export const WHY_SITESPRINT_CONTENT = {
  h2: 'Not just a website. A better first impression.',
  items: [
    {
      id: 'ai-workflow',
      title: 'AI-Powered Workflow',
      description: 'Modern AI-assisted development helps us move from idea to launch faster without sacrificing design quality.',
      iconName: 'Sparkles',
    },
    {
      id: 'around-business',
      title: 'Built Around Your Business',
      description: 'Your website should feel like your brand—not another template with your logo on it.',
      iconName: 'Compass',
    },
    {
      id: 'modern-default',
      title: 'Modern by Default',
      description: 'Clean layouts, sharp typography, responsive design, and thoughtful interactions across every screen.',
      iconName: 'Layers',
    },
    {
      id: 'designed-convert',
      title: 'Designed to Convert',
      description: 'Clear messaging, strategic CTAs, and user-focused layouts built to turn visitors into inquiries.',
      iconName: 'Target',
    },
  ] as WhyItem[],
};

export const PROCESS_CONTENT = {
  eyebrow: 'PROCESS',
  h2: 'From idea to launch.',
  steps: [
    {
      step: '01',
      title: 'Discover',
      description: 'Understand your business, audience and goals.',
    },
    {
      step: '02',
      title: 'Design',
      description: 'Turn your ideas into a clear visual direction.',
    },
    {
      step: '03',
      title: 'Build',
      description: 'Develop your website using modern technology and AI-assisted workflows.',
    },
    {
      step: '04',
      title: 'Launch',
      description: 'Test, optimize and get your website live.',
    },
  ] as ProcessStep[],
};

export const WORK_CONTENT = {
  eyebrow: 'WORK',
  h2: 'See what\'s possible',
  subhead: 'A look at the kind of digital experiences we can create for modern businesses.',
  badgeText: 'CONCEPT PROJECT',
  projects: [
    {
      id: 'northstar-dental',
      title: 'Northstar Dental',
      category: 'HEALTHCARE & WELLNESS',
      description: 'A modern, trustworthy dental website designed to make booking appointments simple and stress-free.',
      iconName: 'Stethoscope',
      liveUrl: 'https://northstar-dental-xi.vercel.app/',
      image: '/projects/northstar-dental.jpg',
      colorScheme: {
        primary: '#38BDF8',
        secondary: '#0284C7',
        bgAccent: 'rgba(56, 189, 248, 0.1)',
      },
    },
    {
      id: 'studio-auren',
      title: 'Studio Auren',
      category: 'DESIGN & ARCHITECTURE',
      description: 'A premium editorial interior design experience showcasing luxury spaces and timeless design.',
      iconName: 'Home',
      liveUrl: 'https://studio-auren.vercel.app/',
      image: '/projects/studio-auren.jpg',
      colorScheme: {
        primary: '#F59E0B',
        secondary: '#D97706',
        bgAccent: 'rgba(245, 158, 11, 0.1)',
      },
    },
    {
      id: 'luma-and-hearth',
      title: 'Luma & Hearth',
      category: 'Hospitality & Dining',
      description: 'A premium boutique restaurant website built around seasonal food, thoughtful ingredients, and an intimate dining experience.',
      iconName: 'Utensils',
      liveUrl: 'https://luma-and-hearth.vercel.app',
      image: '/projects/luma-and-hearth.jpg',
      colorScheme: {
        primary: '#A85D45',
        secondary: '#C06F55',
        bgAccent: 'rgba(168, 93, 69, 0.1)',
      },
    },
    {
      id: 'haven-co',
      title: 'Haven & Co',
      category: 'PROPERTY & INVESTMENT',
      description: 'A refined real estate experience designed to showcase premium properties and generate buyer inquiries.',
      iconName: 'Building2',
      liveUrl: 'https://haven-co-orcin.vercel.app/',
      image: '/projects/haven-co.jpg',
      colorScheme: {
        primary: '#10B981',
        secondary: '#059669',
        bgAccent: 'rgba(16, 185, 129, 0.1)',
      },
    },
  ] as ConceptProject[],
};

export const FEATURES_CONTENT = {
  h2: 'Built for the way people browse today.',
  subhead: 'The essentials, built in from the start — not bolted on later.',
  items: [
    { id: 'responsive', title: 'Responsive on Every Device', iconName: 'Smartphone' },
    { id: 'fast', title: 'Fast-Loading Architecture', iconName: 'Zap' },
    { id: 'seo', title: 'SEO-Friendly Structure', iconName: 'Search' },
    { id: 'cta', title: 'Clear Calls-to-Action', iconName: 'MousePointerClick' },
    { id: 'forms', title: 'Contact Forms', iconName: 'Mail' },
    { id: 'whatsapp', title: 'WhatsApp Integration', iconName: 'MessageSquare' },
    { id: 'maps', title: 'Google Maps Integration', iconName: 'MapPin' },
    { id: 'social', title: 'Social Media Integration', iconName: 'Share2' },
    { id: 'analytics', title: 'Analytics-Ready', iconName: 'BarChart3' },
    { id: 'easy-updates', title: 'Easy Content Updates', iconName: 'FileEdit' },
  ] as FeatureItem[],
};

export const FAQ_CONTENT = {
  eyebrow: 'FAQ',
  h2: 'Questions, answered.',
  items: [
    {
      id: 'faq-1',
      question: 'What types of businesses do you build websites for?',
      answer: 'Mostly small and medium-sized businesses — clinics, studios, restaurants, real estate, local services, and other growing businesses that need a more professional online presence.',
    },
    {
      id: 'faq-2',
      question: 'How long does a website typically take?',
      answer: 'Timelines vary by project scope, but our AI-assisted workflow lets us move significantly faster than a traditional agency. We\'ll give you a clear estimate after understanding your project.',
    },
    {
      id: 'faq-3',
      question: 'Do you build fully custom websites?',
      answer: 'Yes. Every website is designed around your business — not a recycled template.',
    },
    {
      id: 'faq-4',
      question: 'Can you redesign my existing website?',
      answer: 'Yes. Redesigns are one of our core services, whether you need a full rebuild or a modern refresh.',
    },
    {
      id: 'faq-5',
      question: 'Will my website work well on mobile?',
      answer: 'Every SiteSprint website is designed mobile-first, since that\'s where most of your visitors will actually find you.',
    },
    {
      id: 'faq-6',
      question: 'Can you help with hosting and domain setup?',
      answer: 'Yes — we can guide you through hosting and domain setup as part of the process.',
    },
    {
      id: 'faq-7',
      question: 'How do I get started?',
      answer: 'Click "Start a Project" and tell us a bit about your business. We\'ll follow up to discuss the details.',
    },
  ] as FAQItem[],
};

export const FINAL_CTA_CONTENT = {
  h2: 'Ready to build a better first impression?',
  subhead: 'Tell us about your business and what you want your website to achieve. We\'ll take it from there.',
  primaryCta: 'Start a Project',
  emailText: 'or email us at',
  emailAddress: 'team.sitesprint@gmail.com',
};

export const FOOTER_CONTENT = {
  tagline: 'AI-powered modern websites for businesses.',
  emailAddress: 'team.sitesprint@gmail.com',
  instagramUrl: 'https://instagram.com/sitesprintweb',
  instagramHandle: '@sitesprintweb',
  copyright: '© 2026 SiteSprint. All rights reserved.',
};

export const BUSINESS_TYPES = [
  'Clinic / Healthcare',
  'Restaurant / Café',
  'Real Estate',
  'Salon / Beauty',
  'Interior Design',
  'Professional Services',
  'Gym / Fitness',
  'Local Service Business',
  'Other',
];

export const SERVICE_NEEDS = [
  'New Website',
  'Website Redesign',
  'Landing Page',
  'Not Sure Yet',
];
