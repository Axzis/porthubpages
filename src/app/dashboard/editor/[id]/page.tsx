'use client';

import { useParams } from 'next/navigation';
import { useDoc } from '@/firebase';
import type { LandingPage } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function EditorPage() {
  const params = useParams();
  const pageId = params.id as string;

  const { data: page, loading, error } = useDoc<LandingPage>('landingPages', pageId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive">Error: {error.message}</p>;
  }

  if (!page) {
    return <p>Page not found.</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">{page.pageName}</h1>
        <p className="text-muted-foreground">Editing page: /{page.slug}</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Page Builder</CardTitle>
          <CardDescription>
            This is where the page editor will go. For now, here is the raw page data from Firestore.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
            {JSON.stringify(page, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
