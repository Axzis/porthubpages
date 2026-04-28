import type { LandingPage, Template } from '@/lib/types';
import { placeholderImages } from '@/lib/placeholder-images';

export const mockLandingPages: Omit<LandingPage, 'sections' | 'seo' | 'style' | 'brand' | 'createdAt' | 'updatedAt' | 'publishedAt'>[] = [
  {
    id: 'page-1',
    ownerId: 'user-123',
    pageName: 'Innovate SaaS Launch',
    slug: 'innovate-saas-launch',
    status: 'published',
    template: 'product-launch',
  },
  {
    id: 'page-2',
    ownerId: 'user-123',
    pageName: 'My Freelance Services',
    slug: 'creative-design-services',
    status: 'published',
    template: 'service-business',
  },
  {
    id: 'page-3',
    ownerId: 'user-123',
    pageName: 'Tech Conference 2024 (Draft)',
    slug: 'tech-conf-2024',
    status: 'draft',
    template: 'event-registration',
  },
  {
    id: 'page-4',
    ownerId: 'user-123',
    pageName: 'New Restaurant Opening',
    slug: 'the-grand-bistro',
    status: 'draft',
    template: 'restaurant-cafe',
  },
];


export const mockPage: LandingPage = {
    id: 'page-1',
    ownerId: 'user-123',
    pageName: 'Innovate SaaS Launch',
    slug: 'innovate-saas-launch',
    status: 'published',
    template: 'product-launch',
    createdAt: new Date('2023-10-26T10:00:00Z'),
    updatedAt: new Date('2023-10-28T14:30:00Z'),
    publishedAt: new Date('2023-10-26T12:00:00Z'),
    brand: {
      name: "Innovate Inc.",
      logoUrl: ""
    },
    seo: {
      title: "Innovate SaaS - The Future of Productivity",
      description: "Our new SaaS helps teams collaborate and build faster than ever before. Sign up for early access.",
      ogImageUrl: "https://picsum.photos/seed/saas-og/1200/630"
    },
    style: {
      primaryColor: "#264D73",
      font: "inter",
      layout: "centered"
    },
    sections: [
      {
        id: 's1',
        type: 'hero',
        enabled: true,
        order: 1,
        eyebrow: '🚀 LAUNCHING SOON',
        headline: 'The Future of Team Productivity is Here',
        subheadline: 'Innovate is a new, AI-powered platform that streamlines your workflows, automates tasks, and helps your team build better products, faster.',
        imageUrl: placeholderImages.find(p => p.id === 'hero-saas-product')?.imageUrl,
        primaryCta: {
          label: 'Request Early Access',
          url: '#contact',
        },
        secondaryCta: {
          label: 'Learn More',
          url: '#features',
        }
      },
      {
        id: 's2',
        type: 'features',
        enabled: true,
        order: 2,
        title: 'Work Smarter, Not Harder',
        description: 'Discover a powerful suite of features designed to boost your team\'s efficiency.',
        items: [
          { title: 'AI-Powered Automation', description: 'Let our smart assistant handle repetitive tasks so you can focus on what matters.', icon: 'Bot' },
          { title: 'Seamless Integrations', description: 'Connect with your favorite tools like Slack, Jira, and GitHub in one click.', icon: 'Puzzle' },
          { title: 'Real-time Collaboration', description: 'Work on projects together with live document editing and shared task lists.', icon: 'Users' }
        ]
      },
      {
        id: 's3',
        type: 'gallery',
        enabled: true,
        order: 3,
        title: 'A Glimpse of Innovate',
        images: [
            { id: 'g1', url: placeholderImages.find(p => p.id === 'gallery-image-1')?.imageUrl || '', alt: 'App dashboard view' },
            { id: 'g2', url: placeholderImages.find(p => p.id === 'gallery-image-2')?.imageUrl || '', alt: 'Collaboration feature' },
            { id: 'g3', url: placeholderImages.find(p => p.id === 'gallery-image-3')?.imageUrl || '', alt: 'Integration settings' },
        ]
      },
      {
        id: 's4',
        type: 'testimonials',
        enabled: true,
        order: 4,
        title: 'What Beta Testers Are Saying',
        items: [
            { id: 't1', text: '"Innovate has completely changed how our team works. We\'re shipping features twice as fast."', author: 'Jane Doe, CEO of TechCorp', avatarUrl: placeholderImages.find(p => p.id === 'avatar-1')?.imageUrl },
            { id: 't2', text: '"The AI assistant is a game-changer. I can\'t imagine going back to our old workflow."', author: 'John Smith, Product Manager', avatarUrl: placeholderImages.find(p => p.id === 'avatar-2')?.imageUrl },
        ]
      },
      {
        id: 's5',
        type: 'pricing',
        enabled: true,
        order: 5,
        title: 'Pricing Plans',
        plans: [
          { name: 'Starter', price: '$29', description: 'For small teams', features: ['5 Projects', '10GB Storage', 'Basic Analytics'], ctaLabel: 'Choose Starter', ctaUrl: '#', highlighted: false },
          { name: 'Pro', price: '$99', description: 'For growing businesses', features: ['Unlimited Projects', '100GB Storage', 'Advanced Analytics', 'Priority Support'], ctaLabel: 'Choose Pro', ctaUrl: '#', highlighted: true },
          { name: 'Enterprise', price: 'Contact Us', description: 'For large organizations', features: ['All Pro features', 'Dedicated Account Manager', 'Custom Integrations'], ctaLabel: 'Contact Sales', ctaUrl: '#', highlighted: false }
        ]
      },
      {
        id: 's6',
        type: 'faq',
        enabled: true,
        order: 6,
        title: 'Frequently Asked Questions',
        items: [
          { question: 'Is there a free trial?', answer: 'Yes, we offer a 14-day free trial on all our plans. No credit card required.' },
          { question: 'Can I change my plan later?', answer: 'Absolutely. You can upgrade or downgrade your plan at any time from your account settings.' },
          { question: 'What is your refund policy?', answer: 'We offer a 30-day money-back guarantee if you are not satisfied with our product.' }
        ]
      },
      {
        id: 's7',
        type: 'contact',
        enabled: true,
        order: 7,
        title: 'Get Early Access',
        description: 'Sign up now to be one of the first to experience Innovate. We\'ll notify you when we launch.',
        form: {
            name: true,
            email: true,
            phone: false,
            message: true,
            submitButtonLabel: 'Join the Waitlist'
        }
      }
    ]
};

export const templates: Template[] = [
    {
        id: 'blank',
        name: 'Blank',
        description: 'Start from a clean slate.',
        defaultSections: []
    },
    {
        id: 'product-launch',
        name: 'Product Launch',
        description: 'Best for SaaS, apps, and digital products.',
        defaultSections: ['hero', 'features', 'pricing', 'faq', 'contact']
    },
    {
        id: 'service-business',
        name: 'Service Business',
        description: 'Perfect for freelancers and agencies.',
        defaultSections: ['hero', 'testimonials', 'features', 'contact']
    },
    {
        id: 'event-registration',
        name: 'Event Registration',
        description: 'Promote your next conference or meetup.',
        defaultSections: ['hero', 'faq', 'contact']
    },
    {
        id: 'online-course',
        name: 'Online Course',
        description: 'Sell your expertise with a compelling course page.',
        defaultSections: ['hero', 'features', 'pricing', 'faq']
    },
    {
        id: 'restaurant-cafe',
        name: 'Restaurant/Cafe',
        description: 'Showcase your menu and location.',
        defaultSections: ['hero', 'gallery', 'contact']
    }
]
