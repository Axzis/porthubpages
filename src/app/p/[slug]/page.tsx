import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/firestore-actions';
import type { LandingPage, HeroSection, FeatureSection } from '@/lib/types';
import Image from 'next/image';

// This is the public-facing page for a created landing page.
export default async function PublicPage({ params }: { params: { slug: string } }) {
  const page: LandingPage | null = await getPageBySlug(params.slug);

  if (!page || page.status !== 'published') {
    notFound();
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {page.sections.map(section => {
          if (!section.enabled) return null;

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
            // Add other section renderers here in the future
            default:
              return <div key={section.id} className="p-4 my-2 border rounded-md">Unsupported section: {section.type}</div>;
          }
        })}
      </main>
      <footer className="py-4 text-center text-muted-foreground text-sm">
        <p>Powered by PortHub Pages</p>
      </footer>
    </div>
  );
}