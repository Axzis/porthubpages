'use client';

import { useParams } from 'next/navigation';
import { useDoc } from '@/firebase';
import type { LandingPage, HeroSection } from '@/lib/types';
import { Loader2 } from 'lucide-react';

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
  
  // Find the hero section to display
  const heroSection = page.sections?.find(s => s.type === 'hero') as HeroSection | undefined;

  return (
    <div className="flex flex-col min-h-screen font-body bg-background text-foreground">
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
            <h1 className="text-5xl font-bold font-headline">{heroSection?.headline || page.pageName}</h1>
            {heroSection?.subheadline && <p className="mt-4 text-xl text-muted-foreground">{heroSection.subheadline}</p>}
        </main>
        <footer className="py-4 text-center text-muted-foreground text-sm">
            <p>Powered by PortHub Pages (Preview)</p>
        </footer>
    </div>
  );
}
