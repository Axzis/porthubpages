'use client';

import { useParams } from 'next/navigation';
import { useDoc } from '@/firebase';
import type { LandingPage, HeroSection, FeatureSection, GallerySection, TestimonialSection, PricingSection, FAQSection, ContactSection, CTASection, AboutSection } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ContactForm } from '@/components/landing/contact-form';
import { AOSInitializer } from '@/components/landing/aos-initializer';
import { cn } from '@/lib/utils';


// This is a minimal renderer for the live preview iframe.
export default function PreviewPage() {
  const params = useParams();
  const pageId = params.id as string;

  const { data: page, loading, error } = useDoc<LandingPage>('landingPages', pageId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  if (!page) {
    return <div className="p-4">Page not found.</div>;
  }

  const formatUrl = (url: string | undefined): string => {
    if (!url) return '#';
    const trimmedUrl = url.trim();
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://') || trimmedUrl.startsWith('/') || trimmedUrl.startsWith('#') || trimmedUrl.startsWith('mailto:') || trimmedUrl.startsWith('tel:')) {
      return trimmedUrl;
    }
    if (trimmedUrl.includes('.') && !trimmedUrl.includes(' ')) {
      return `https://${trimmedUrl}`;
    }
    return trimmedUrl;
  };
  
  const themeClass = page.style?.theme && page.style.theme !== 'default'
    ? page.style.theme === 'dark' ? 'dark' : `theme-${page.style.theme}`
    : '';

  return (
    <div className={cn(
      "flex flex-col min-h-screen font-body bg-background text-foreground",
      themeClass
    )}>
        <AOSInitializer />
        <main className="flex-grow">
          {(page.sections || []).filter(s => s.enabled).map(section => {
            switch (section.type) {
              case 'hero':
                const heroSection = section as HeroSection;
                return (
                  <section key={section.id} data-aos="fade-up" className="text-center py-20 px-4">
                    <h1 className="text-5xl font-bold font-headline">{heroSection.headline}</h1>
                    {heroSection.subheadline && <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">{heroSection.subheadline}</p>}
                    <div className="mt-8 flex justify-center gap-4">
                        {heroSection.primaryCta?.label && (
                           <Button size="lg" asChild>
                             <Link href={formatUrl(heroSection.primaryCta.url)}>{heroSection.primaryCta.label}</Link>
                           </Button>
                        )}
                        {heroSection.secondaryCta?.label && (
                            <Button size="lg" variant="outline" asChild>
                              <Link href={formatUrl(heroSection.secondaryCta.url)}>{heroSection.secondaryCta.label}</Link>
                            </Button>
                        )}
                    </div>
                    {heroSection.imageUrl && (
                      <div className="mt-8 relative h-96 w-full max-w-4xl mx-auto rounded-lg overflow-hidden bg-muted shadow-2xl">
                        <Image src={heroSection.imageUrl} alt={heroSection.headline} fill style={{objectFit:"cover"}} />
                      </div>
                    )}
                  </section>
                );
              case 'features':
                const featuresSection = section as FeatureSection;
                return (
                  <section key={section.id} data-aos="fade-up" className="py-20 px-4 bg-secondary">
                    <div className="container mx-auto text-center">
                      <h2 className="text-4xl font-bold font-headline">{featuresSection.title}</h2>
                      {featuresSection.description && <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{featuresSection.description}</p>}
                      <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {(featuresSection.items || []).map((item, index) => (
                          <div key={index} className="flex flex-col items-center text-center">
                            {item.imageUrl && (
                               <div className="relative h-40 w-40 mb-4 rounded-full overflow-hidden bg-muted">
                                 <Image src={item.imageUrl} alt={item.title} fill style={{objectFit:"cover"}} />
                               </div>
                            )}
                            <h3 className="text-xl font-bold">{item.title}</h3>
                            <p className="text-muted-foreground mt-2">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              case 'gallery':
                const gallerySection = section as GallerySection;
                return (
                    <section key={section.id} data-aos="fade-up" className="py-20 px-4">
                        <div className="container mx-auto text-center">
                            <h2 className="text-4xl font-bold font-headline">{gallerySection.title}</h2>
                            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
                                {(gallerySection.images || []).map((image, index) => (
                                    <div key={index} className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                                        <Image src={image.url} alt={image.alt} fill style={{objectFit:"cover"}} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );
              case 'testimonials':
                const testimonialsSection = section as TestimonialSection;
                return (
                    <section key={section.id} data-aos="fade-up" className="py-20 px-4 bg-secondary">
                        <div className="container mx-auto text-center">
                            <h2 className="text-4xl font-bold font-headline">{testimonialsSection.title}</h2>
                            <div className="mt-12 grid gap-8 md:grid-cols-3">
                                {(testimonialsSection.items || []).map((item, index) => (
                                    <Card key={index}>
                                        <CardContent className="p-6 text-left">
                                            <p className="italic">"{item.text}"</p>
                                            <div className="mt-4 flex items-center gap-3">
                                                {item.avatarUrl && (
                                                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted">
                                                        <Image src={item.avatarUrl} alt={item.author} fill style={{objectFit:"cover"}} />
                                                    </div>
                                                )}
                                                <p className="font-semibold">{item.author}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>
                );
              case 'pricing':
                const pricingSection = section as PricingSection;
                return (
                    <section key={section.id} data-aos="fade-up" className="py-20 px-4">
                        <div className="container mx-auto text-center">
                            <h2 className="text-4xl font-bold font-headline">{pricingSection.title}</h2>
                            <div className="mt-12 grid gap-8 md:grid-cols-3 items-start">
                                {(pricingSection.plans || []).map((plan, index) => (
                                    <Card key={index} className={plan.highlighted ? 'border-primary ring-2 ring-primary' : ''}>
                                        <CardHeader>
                                            <CardTitle>{plan.name}</CardTitle>
                                            <CardDescription className="text-3xl font-bold">{plan.price}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2 text-left">
                                                {(plan.features || []).map((feature, fIndex) => (
                                                    <li key={fIndex} className="flex items-center gap-2">✓ {feature}</li>
                                                ))}
                                            </ul>
                                            <Button asChild className="mt-6 w-full"><Link href={formatUrl(plan.ctaUrl)}>{plan.ctaLabel}</Link></Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>
                );
              case 'faq':
                const faqSection = section as FAQSection;
                return (
                    <section key={section.id} data-aos="fade-up" className="py-20 px-4 bg-secondary">
                        <div className="container mx-auto max-w-3xl">
                            <h2 className="text-4xl font-bold font-headline text-center">{faqSection.title}</h2>
                            <Accordion type="single" collapsible className="mt-12 w-full">
                                {(faqSection.items || []).map((item, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger>{item.question}</AccordionTrigger>
                                        <AccordionContent>{item.answer}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </section>
                );
              case 'contact':
                const contactSection = section as ContactSection;
                return (
                    <section key={section.id} data-aos="fade-up" className="py-20 px-4">
                        <div className="container mx-auto max-w-xl text-center">
                             <h2 className="text-4xl font-bold font-headline">{contactSection.title}</h2>
                            <p className="mt-4 text-lg text-muted-foreground">{contactSection.description}</p>
                            <div className="mt-8">
                              <ContactForm
                                pageId={page.id}
                                ownerId={page.ownerId}
                                contactSection={contactSection}
                                isPreview={true}
                              />
                            </div>
                        </div>
                    </section>
                );
              case 'cta':
                const ctaSection = section as CTASection;
                return (
                    <section key={section.id} data-aos="fade-up" className="py-20 px-4 bg-primary text-primary-foreground">
                        <div className="container mx-auto text-center">
                            <h2 className="text-4xl font-bold font-headline">{ctaSection.title}</h2>
                            <p className="mt-4 text-lg max-w-2xl mx-auto opacity-90">{ctaSection.description}</p>
                            <Button asChild size="lg" variant="secondary" className="mt-8"><Link href={formatUrl(ctaSection.cta.url)}>{ctaSection.cta.label}</Link></Button>
                        </div>
                    </section>
                );
              case 'about':
                const aboutSection = section as AboutSection;
                return (
                    <section key={section.id} data-aos="fade-up" className="py-20 px-4">
                        <div className="container mx-auto max-w-3xl">
                            <h2 className="text-4xl font-bold font-headline text-center">{aboutSection.title}</h2>
                            <div className="mt-8 text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">{aboutSection.content}</div>
                        </div>
                    </section>
                );

              default:
                return null; // Don't render unsupported sections in preview
            }
          })}
        </main>
        <footer className="py-4 text-center text-muted-foreground text-sm">
            <p>Powered by PortHub Pages (Preview)</p>
        </footer>
    </div>
  );
}
