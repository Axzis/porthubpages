'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDoc } from '@/firebase';
import { updateLandingPage } from '@/lib/firestore-actions';
import type { LandingPage } from '@/lib/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Loader2, Save, ExternalLink, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;
  const { toast } = useToast();

  const { data: page, loading, error } = useDoc<LandingPage>('landingPages', pageId);

  const [pageName, setPageName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [previewKey, setPreviewKey] = useState(Date.now());

  useEffect(() => {
    if (page) {
      setPageName(page.pageName);
      setSlug(page.slug);
    }
  }, [page]);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateLandingPage(pageId, {
      pageName,
      slug,
    });
    setIsSaving(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error saving page',
        description: result.error,
      });
    } else {
      toast({
        title: 'Page saved!',
        description: 'Your changes have been saved.',
      });
      // Force iframe to reload
      setPreviewKey(Date.now());
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <p className="ml-4">Loading Editor...</p>
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start h-full">
      {/* Editor Panel */}
      <div className="lg:col-span-1 flex flex-col gap-6 sticky top-24">
        <div className="flex items-center justify-between gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/dashboard')}>
            <ArrowLeft />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold font-headline truncate" title={page.pageName}>
              {page.pageName}
            </h1>
            <p className="text-sm text-muted-foreground">/{page.slug}</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save />
            )}
            <span className="ml-2 hidden md:inline">Save</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Page Settings</CardTitle>
            <CardDescription>Manage your page details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pageName">Page Name</Label>
              <Input
                id="pageName"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                placeholder="My Awesome Page"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-awesome-page"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Panel */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Live Preview</CardTitle>
            <Button variant="outline" asChild>
              <Link href={`/p/${page.slug}`} target="_blank">
                <ExternalLink className="mr-2" />
                Open in new tab
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="h-[calc(100vh-220px)] p-0">
            <iframe
              key={previewKey}
              src={`/p/preview/${pageId}`}
              className="w-full h-full border-0 rounded-b-lg"
              title="Page Preview"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
