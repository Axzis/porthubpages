import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/firestore-actions';
import type { LandingPage, HeroSection, FeatureSection, GallerySection, TestimonialSection, PricingSection, FAQSection, ContactSection, CTASection, AboutSection } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// This is the public-facing page for a created landing page.
export default async function PublicPage({ params }: { params: { slug: string } }) {
  const page: LandingPage | null = await getPageBySlug(params.slug);

  if (!page || page.status !== 'published') {
    notFound();
  }

  const themeClass = page.style?.theme && page.style.theme !== 'default'
    ? page.style.theme === 'dark' ? 'dark' : `theme-${page.style.theme}`
    : '';
  
  return (
    <div className={themeClass}>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          {page.sections.filter(s => s.enabled).map(section => {
            
            switch (section.type) {
              case 'hero':
                const heroSection = section as HeroSection;
                return (
                  <section key={section.id} className="text-center py-20 px-4">
                    <h1 className="text-5xl font-bold font-headline">{heroSection.headline}</h1>
                    {heroSection.subheadline && <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">{heroSection.subheadline}</p>}
                    {heroSection.imageUrl && (
                      <div className="mt-8 relative h-96 w-full max-w-4xl mx-auto rounded-lg overflow-hidden">
                        <Image src={heroSection.imageUrl} alt={heroSection.headline} layout="fill" objectFit="cover" />
                      </div>
                    )}
                  </section>
                );
              case 'features':
                const featuresSection = section as FeatureSection;
                return (
                  <section key={section.id} className="py-20 px-4 bg-secondary">
                    <div className="container mx-auto text-center">
                      <h2 className="text-4xl font-bold font-headline">{featuresSection.title}</h2>
                      {featuresSection.description && <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{featuresSection.description}</p>}
                      <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {(featuresSection.items || []).map((item, index) => (
                          <div key={index} className="flex flex-col items-center text-center">
                            {item.imageUrl && (
                              <div className="relative h-40 w-40 mb-4 rounded-full overflow-hidden">
                                <Image src={item.imageUrl} alt={item.title} layout="fill" objectFit="cover" />
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
                      <section key={section.id} className="py-20 px-4">
                          <div className="container mx-auto text-center">
                              <h2 className="text-4xl font-bold font-headline">{gallerySection.title}</h2>
                              <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
                                  {(gallerySection.images || []).map((image, index) => (
                                      <div key={index} className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                                          <Image src={image.url} alt={image.alt} layout="fill" objectFit="cover" />
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </section>
                  );
              case 'testimonials':
                  const testimonialsSection = section as TestimonialSection;
                  return (
                      <section key={section.id} className="py-20 px-4 bg-secondary">
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
                                                          <Image src={item.avatarUrl} alt={item.author} layout="fill" objectFit="cover" />
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
                      <section key={section.id} className="py-20 px-4">
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
                                              <Button asChild className="mt-6 w-full"><Link href={plan.ctaUrl}>{plan.ctaLabel}</Link></Button>
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
                      <section key={section.id} className="py-20 px-4 bg-secondary">
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
                      <section key={section.id} className="py-20 px-4">
                          <div className="container mx-auto max-w-xl text-center">
                              <h2 className="text-4xl font-bold font-headline">{contactSection.title}</h2>
                              <p className="mt-4 text-lg text-muted-foreground">{contactSection.description}</p>
                              <form className="mt-8 space-y-4 text-left">
                                  <Input placeholder="Name" disabled />
                                  <Input type="email" placeholder="Email" disabled />
                                  <Textarea placeholder="Message" disabled />
                                  <Button className="w-full" disabled>{contactSection.form.submitButtonLabel}</Button>
                              </form>
                          </div>
                      </section>
                  );
              case 'cta':
                  const ctaSection = section as CTASection;
                  return (
                      <section key={section.id} className="py-20 px-4 bg-primary text-primary-foreground">
                          <div className="container mx-auto text-center">
                              <h2 className="text-4xl font-bold font-headline">{ctaSection.title}</h2>
                              <p className="mt-4 text-lg max-w-2xl mx-auto opacity-90">{ctaSection.description}</p>
                              <Button asChild size="lg" variant="secondary" className="mt-8"><Link href={ctaSection.cta.url}>{ctaSection.cta.label}</Link></Button>
                          </div>
                      </section>
                  );
              case 'about':
                  const aboutSection = section as AboutSection;
                  return (
                      <section key={section.id} className="py-20 px-4">
                          <div className="container mx-auto max-w-3xl">
                              <h2 className="text-4xl font-bold font-headline text-center">{aboutSection.title}</h2>
                              <div className="mt-8 text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">{aboutSection.content}</div>
                          </div>
                      </section>
                  );
              default:
                return <div key={section.id} className="p-4 my-2 border rounded-md">Unsupported section: {section.type}</div>;
            }
          })}
        </main>
        <footer className="py-4 text-center text-muted-foreground text-sm">
          <p>Powered by PortHub Pages</p>
        </footer>
      </div>
    </div>
  );
}
