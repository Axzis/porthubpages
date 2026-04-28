import type { LucideIcon } from "lucide-react";

export type LandingPage = {
  id: string;
  ownerId: string;
  pageName: string;
  slug: string;
  status: "draft" | "published";
  template: string;
  brand: {
    name: string;
    logoUrl?: string;
  };
  seo: {
    title: string;
    description: string;
    ogImageUrl?: string;
  };
  style: {
    primaryColor: string;
    font: "inter" | "space-grotesk" | "serif" | "modern";
    layout: "centered" | "split" | "minimal";
    theme?: "default" | "dark" | "corporate" | "sunrise";
  };
  sections: LandingSection[];
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
  publishedAt?: any; // Firestore timestamp
};

export type LandingSection =
  | HeroSection
  | FeatureSection
  | TestimonialSection
  | PricingSection
  | FAQSection
  | CTASection
  | ContactSection
  | GallerySection
  | AboutSection;

export type BaseSection = {
  id: string;
  type: string;
  enabled: boolean;
  order: number;
};

export type HeroSection = BaseSection & {
  type: "hero";
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  imageUrl?: string;
  primaryCta: {
    label: string;
    url: string;
  };
  secondaryCta?: {
    label: string;
    url: string;
  };
};

export type FeatureSection = BaseSection & {
  type: "features";
  title: string;
  description?: string;
  items: {
    title: string;
    description: string;
    icon?: string; // Corresponds to lucide-react icon name
    imageUrl?: string;
  }[];
};

export type TestimonialSection = BaseSection & {
    type: "testimonials";
    title: string;
    items: {
      id: string;
      text: string;
      author: string;
      avatarUrl?: string;
    }[];
};

export type GallerySection = BaseSection & {
    type: 'gallery';
    title: string;
    images: {
        id: string;
        url: string;
        alt: string;
    }[];
};

export type PricingSection = BaseSection & {
  type: "pricing";
  title: string;
  plans: {
    name: string;
    price: string;
    description?: string;
    features: string[];
    ctaLabel: string;
    ctaUrl: string;
    highlighted?: boolean;
  }[];
};

export type FAQSection = BaseSection & {
    type: "faq";
    title: string;
    items: {
        question: string;
        answer: string;
    }[];
};

export type CTASection = BaseSection & {
    type: 'cta';
    title: string;
    description: string;
    cta: {
        label: string;
        url: string;
    };
};

export type ContactSection = BaseSection & {
    type: "contact";
    title: string;
    description: string;
    form: {
        name: boolean;
        email: boolean;
        phone: boolean;
        message: boolean;
        submitButtonLabel: string;
    }
};

export type AboutSection = BaseSection & {
  type: 'about';
  title: string;
  content: string;
};


export type Lead = {
    id: string;
    pageId: string;
    ownerId: string;
    name?: string;
    email: string;
    phone?: string;
    message?: string;
    createdAt: any; // Firestore timestamp
    isRead?: boolean;
};


export type Template = {
    id: string;
    name: string;
    description: string;
    defaultSections: Array<LandingSection['type']>;
};

export type Icon = LucideIcon;
