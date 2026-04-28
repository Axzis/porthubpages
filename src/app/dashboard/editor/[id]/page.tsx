'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDoc } from '@/firebase';
import { updateLandingPage } from '@/lib/firestore-actions';
import type { LandingPage, HeroSection } from '@/lib/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Loader2, Save, ExternalLink, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;
  const { toast } = useToast();

  const { data: page, loading, error } = useDoc<LandingPage>('landingPages', pageId);

  const [pageName, setPageName] = useState('');
  const [slug, setSlug] = useState('');
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [previewKey, setPreviewKey] = useState(Date.now());
  
  const isSetupComplete = page?.pageName !== 'My New Page';

  useEffect(() => {
    if (page) {
      setPageName(page.pageName);
      setSlug(page.slug);

      const heroSection = page.sections?.find(s => s.type === 'hero') as HeroSection | undefined;
      if (heroSection) {
        setHeadline(heroSection.headline || '');
        setSubheadline(heroSection.subheadline || '');
      }
    }
  }, [page]);
  
  const handleSave = async (showToast: boolean = true) => {
    if (!page) return false;
    setIsSaving(true);

    const currentSections = page.sections || [];
    const heroSectionIndex = currentSections.findIndex(s => s.type === 'hero');
    let newSections = [...currentSections];

    if (heroSectionIndex > -1) {
      const existingHero = newSections[heroSectionIndex] as HeroSection;
      newSections[heroSectionIndex] = {
          ...existingHero,
          headline,
          subheadline
      };
    } else {
        newSections.push({
            id: 'hero',
            type: 'hero',
            enabled: true,
            order: 1,
            headline,
            subheadline,
            primaryCta: { label: 'Get Started', url: '#' },
        } as HeroSection);
    }


    const result = await updateLandingPage(pageId, {
      pageName,
      slug,
      sections: newSections,
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
        <div className="flex items-center justify-center h-screen -mt-16">
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
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(380px,1fr)_2fr] gap-8 items-start">
      {/* Editor Panel */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold font-headline truncate" title={page.pageName}>
              {pageName}
            </h1>
            <p className="text-sm text-muted-foreground truncate">/p/{page.slug}</p>
          </div>
          <Button onClick={() => handleSave()} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span className="ml-2 hidden md:inline">Save</span>
          </Button>
        </div>

        <Accordion type="single" collapsible defaultValue="page-settings" className="w-full">
          <AccordionItem value="page-settings">
            <AccordionTrigger>
              <div className="flex flex-col items-start text-left">
                <h3 className="font-semibold">Page Settings</h3>
                <p className="text-sm font-normal text-muted-foreground">Manage your page name and URL.</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pageName-main">Page Name</Label>
                  <Input
                    id="pageName-main"
                    value={pageName}
                    onChange={(e) => setPageName(e.target.value)}
                    placeholder="My Awesome Page"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug-main">Slug</Label>
                  <Input
                    id="slug-main"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="my-awesome-page"
                  />
                </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="hero-section">
            <AccordionTrigger>
              <div className="flex flex-col items-start text-left">
                <h3 className="font-semibold">Hero Section</h3>
                <p className="text-sm font-normal text-muted-foreground">The first thing your visitors will see.</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Your Compelling Headline"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subheadline">Subheadline</Label>
                <Textarea
                  id="subheadline"
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  placeholder="A short description that explains more."
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Preview Panel */}
      <div className="lg:col-span-1 hidden lg:block">
        <div className="sticky top-24">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Live Preview</CardTitle>
                <Button variant="outline" size="sm" asChild>
                <Link href={`/p/${page.slug}`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open
                </Link>
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="h-[calc(100vh-11rem-4rem)] w-full rounded-b-lg border bg-muted overflow-hidden">
                    <iframe
                    key={previewKey}
                    src={`/p/preview/${pageId}`}
                    className="w-full h-full"
                    title="Page Preview"
                    />
                </div>
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
