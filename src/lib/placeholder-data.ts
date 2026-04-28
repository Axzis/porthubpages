import type { LandingPage, Template } from '@/lib/types';
import { placeholderImages } from '@/lib/placeholder-images';

export const templates: Template[] = [
    {
        id: 'blank',
        name: 'Blank',
        description: 'Start from a clean slate.',
        defaultSections: ['hero']
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
