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
  CardFooter,
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
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    if (page) {
      if (page.pageName !== 'My New Page') {
        setIsSetupComplete(true);
      }
      setPageName(page.pageName);
      setSlug(page.slug);
    }
  }, [page]);
  
  const handleSave = async (showToast: boolean = true) => {
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
      return false;
    } else {
      if (showToast) {
        toast({
          title: 'Page saved!',
          description: 'Your changes have been saved.',
        });
      }
      // Force iframe to reload
      setPreviewKey(Date.now());
      return true;
    }
  };

  const handleInitialSave = async () => {
    const success = await handleSave(false);
    if (success) {
      setIsSetupComplete(true);
      toast({
        title: 'Page created!',
        description: 'Now you can start building your page.',
      });
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
  
  if (!isSetupComplete) {
     return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md">
              <CardHeader>
                  <CardTitle>Let's get started</CardTitle>
                  <CardDescription>Give your new landing page a name and a URL.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="space-y-2">
                      <Label htmlFor="pageName">Page Name</Label>
                      <Input
                          id="pageName"
                          value={pageName === 'My New Page' ? '' : pageName}
                          onChange={(e) => {
                            setPageName(e.target.value);
                            setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                          }}
                          placeholder="e.g. My Awesome Product"
                      />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                          id="slug"
                          value={slug.startsWith('untitled-page-') ? '' : slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder="e.g. my-awesome-product"
                      />
                      <p className="text-sm text-muted-foreground">
                        Your page will be at: /p/{slug}
                      </p>
                  </div>
              </CardContent>
              <CardFooter>
                  <Button onClick={handleInitialSave} disabled={isSaving || !pageName || !slug} className="w-full">
                      {isSaving ? <Loader2 className="animate-spin" /> : "Save and Continue"}
                  </Button>
              </CardFooter>
          </Card>
      </div>
     )
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
              {pageName}
            </h1>
            <p className="text-sm text-muted-foreground">/p/{page.slug}</p>
          </div>
          <Button onClick={() => handleSave()} disabled={isSaving}>
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
