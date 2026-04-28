'use client';

import { useParams } from 'next/navigation';
import { useDoc } from '@/firebase';
import type { LandingPage } from '@/lib/types';
import { Loader2 } from 'lucide-react';

// This is a minimal renderer for the live preview iframe.
// It does not need to be styled perfectly, just show the core content.
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
  const heroSection = page.sections?.find(s => s.type === 'hero');

  return (
    <div className="p-8 font-body">
      <h1 className="text-4xl font-bold font-headline mb-2">{page.pageName}</h1>
      <p className="text-lg text-gray-600 mb-8">This is a live preview. The public page may look different.</p>

      {heroSection && (
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold">{heroSection.headline}</h2>
          {heroSection.subheadline && <p className="mt-2 text-gray-700">{heroSection.subheadline}</p>}
        </div>
      )}

      {!heroSection && (
         <div className="border rounded-lg p-6 bg-gray-50">
           <p className="text-gray-500">No content sections defined yet. Add a Hero section to see it here.</p>
         </div>
      )}

      <pre className="mt-8 bg-gray-100 p-4 rounded text-xs overflow-auto">
        {JSON.stringify(page, null, 2)}
      </pre>
    </div>
  );
}
