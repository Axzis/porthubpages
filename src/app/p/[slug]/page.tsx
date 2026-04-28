import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/firestore-actions';
import type { LandingPage, HeroSection } from '@/lib/types';

// This is the public-facing page for a created landing page.
export default async function PublicPage({ params }: { params: { slug: string } }) {
  const page: LandingPage | null = await getPageBySlug(params.slug);

  if (!page || page.status !== 'published') {
    notFound();
  }
  
  const heroSection = page.sections?.find(s => s.type === 'hero') as HeroSection | undefined;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold font-headline">{heroSection?.headline || page.pageName}</h1>
        {heroSection?.subheadline && <p className="mt-4 text-xl text-muted-foreground">{heroSection.subheadline}</p>}
      </main>
      <footer className="py-4 text-center text-muted-foreground text-sm">
        <p>Powered by PortHub Pages</p>
      </footer>
    </div>
  );
}
