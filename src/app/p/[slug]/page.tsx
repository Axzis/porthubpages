import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/firestore-actions';
import type { LandingPage } from '@/lib/types';

// This is the public-facing page for a created landing page.
// For now, it's a minimal implementation.
export default async function PublicPage({ params }: { params: { slug: string } }) {
  const page: LandingPage | null = await getPageBySlug(params.slug);

  if (!page || page.status !== 'published') {
    notFound();
  }
  
  const heroSection = page.sections?.find(s => s.type === 'hero');

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold font-headline">{heroSection?.headline || page.pageName}</h1>
        {heroSection?.subheadline && <p className="mt-4 text-xl text-muted-foreground">{heroSection.subheadline}</p>}
        
        {page.status === 'draft' && (
          <div className="mt-8 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md">
            This is a draft page and is not publicly visible.
          </div>
        )}
      </main>
      <footer className="py-4 text-center text-muted-foreground text-sm">
        <p>Powered by PortHub Pages</p>
      </footer>
    </div>
  );
}
