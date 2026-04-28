'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDoc } from '@/firebase';
import { updateLandingPage } from '@/lib/firestore-actions';
import { uploadImage } from '@/app/actions/cloudinary';
import type { LandingPage, LandingSection, HeroSection, FeatureSection, GallerySection, TestimonialSection, PricingSection, FAQSection, ContactSection, CTASection, AboutSection } from '@/lib/types';
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
import { Loader2, Save, ExternalLink, ArrowLeft, PlusCircle, Trash2, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

type SectionWithDefault = Omit<LandingSection, 'id' | 'enabled' | 'order'>;

const SECTION_DEFAULTS: { [K in LandingSection['type']]: SectionWithDefault } = {
  hero: { type: 'hero', headline: 'Your Big Headline', subheadline: 'A compelling subheadline.', primaryCta: { label: 'Get Started', url: '#' } },
  features: { type: 'features', title: 'Features', description: 'Discover what makes our product unique.', items: [] },
  gallery: { type: 'gallery', title: 'Our Gallery', images: [] },
  testimonials: { type: 'testimonials', title: 'What Our Customers Say', items: [] },
  pricing: { type: 'pricing', title: 'Pricing Plans', plans: [] },
  faq: { type: 'faq', title: 'Frequently Asked Questions', items: [] },
  contact: { type: 'contact', title: 'Get in Touch', description: 'We\'d love to hear from you.', form: { name: true, email: true, phone: false, message: true, submitButtonLabel: 'Submit' } },
  cta: { type: 'cta', title: 'Ready to Dive In?', description: 'Start your free trial today.', cta: { label: 'Sign Up Now', url: '#' } },
  about: { type: 'about', title: 'About Us', content: 'We are a company dedicated to excellence.'}
};

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;
  const { toast } = useToast();

  const { data: initialPage, loading, error } = useDoc<LandingPage>('landingPages', pageId);

  const [page, setPage] = useState<LandingPage | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewKey, setPreviewKey] = useState(Date.now());
  const [uploadingStates, setUploadingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialPage) {
      setPage({
        ...initialPage,
        sections: initialPage.sections || [],
      });
    }
  }, [initialPage]);
  
  const isSetupComplete = page?.pageName !== 'My New Page';

  const handleFieldChange = (field: keyof LandingPage, value: any) => {
    setPage(prev => prev ? { ...prev, [field]: value } : null);
  };
  
  const handleSlugChange = (value: string) => {
    const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setPage(prev => prev ? { ...prev, slug } : null);
  }

  const handleSectionChange = (sectionType: LandingSection['type'], field: string, value: any) => {
    setPage(prevPage => {
        if (!prevPage) return null;
        const newPage = structuredClone(prevPage);
        let section = newPage.sections.find(s => s.type === sectionType);
        if (section) {
            (section as any)[field] = value;
        }
        return newPage;
    });
  };

  const handleSectionItemChange = (sectionType: LandingSection['type'], itemIndex: number, field: string, value: any) => {
     setPage(prevPage => {
        if (!prevPage) return null;
        const newPage = structuredClone(prevPage);
        const section = newPage.sections.find(s => s.type === sectionType) as any;
        if (section && section.items && section.items[itemIndex]) {
            section.items[itemIndex][field] = value;
        }
        return newPage;
    });
  }

  const addSectionItem = (sectionType: 'features' | 'testimonials' | 'faq' | 'pricing') => {
      setPage(prevPage => {
        if (!prevPage) return null;
        const newPage = structuredClone(prevPage);
        const section = newPage.sections.find(s => s.type === sectionType) as any;
        if (section) {
            let newItem;
            switch(sectionType) {
                case 'features': newItem = { title: 'New Feature', description: 'A great new thing.' }; break;
                case 'testimonials': newItem = { id: Date.now().toString(), text: 'Amazing!', author: 'New Customer' }; break;
                case 'faq': newItem = { question: 'New Question?', answer: 'An insightful answer.' }; break;
                case 'pricing': newItem = { name: 'New Plan', price: '$0', features: [], ctaLabel: 'Choose Plan', ctaUrl: '#' }; break;
            }
            if (section.items) {
              section.items.push(newItem);
            } else {
              section.items = [newItem];
            }
        }
        return newPage;
    });
  }

  const removeSectionItem = (sectionType: 'features' | 'testimonials' | 'faq' | 'pricing', itemIndex: number) => {
     setPage(prevPage => {
        if (!prevPage) return null;
        const newPage = structuredClone(prevPage);
        const section = newPage.sections.find(s => s.type === sectionType) as any;
        if (section && section.items) {
            section.items.splice(itemIndex, 1);
        }
        return newPage;
    });
  }
  
  const handleImageUpload = async (file: File, uploadKey: string, onUploadComplete: (url: string) => void) => {
    setUploadingStates(prev => ({ ...prev, [uploadKey]: true }));
    const formData = new FormData();
    formData.append('image', file);
    const result = await uploadImage(formData);
    setUploadingStates(prev => ({ ...prev, [uploadKey]: false }));

    if (result.url) {
      onUploadComplete(result.url);
      toast({ title: 'Image uploaded!' });
    } else {
      toast({ variant: 'destructive', title: 'Upload failed', description: result.error });
    }
  };
  
  const handleToggleSection = (sectionType: LandingSection['type'], enabled: boolean) => {
    setPage(prevPage => {
      if (!prevPage) return null;
      const newPage = structuredClone(prevPage);
      const sectionIndex = newPage.sections.findIndex(s => s.type === sectionType);

      if (enabled) {
        if (sectionIndex === -1) {
          // Add section if it doesn't exist
          const newSection: LandingSection = {
            id: sectionType,
            order: newPage.sections.length + 1,
            enabled: true,
            ...SECTION_DEFAULTS[sectionType]
          } as LandingSection;
          newPage.sections.push(newSection);
        } else {
          // Enable section if it exists
          newPage.sections[sectionIndex].enabled = true;
        }
      } else {
        // Disable section
        if (sectionIndex > -1) {
          newPage.sections[sectionIndex].enabled = false;
        }
      }
      return newPage;
    });
  };

  const isSectionEnabled = (sectionType: LandingSection['type']): boolean => {
    return page?.sections.some(s => s.type === sectionType && s.enabled) || false;
  }
  
  const getSection = <T extends LandingSection>(type: T['type']): T | undefined => {
    if (!page?.sections) return undefined;
    return page.sections.find(s => s.type === type) as T | undefined;
  }

  const handleSave = async (showToast: boolean = true) => {
    if (!page) return false;
    setIsSaving(true);
  
    const result = await updateLandingPage(pageId, {
      pageName: page.pageName,
      slug: page.slug,
      sections: page.sections,
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
      setPreviewKey(Date.now());
      return true;
    }
  };

  const handlePublishToggle = async (published: boolean) => {
    if (!page) return;
    const newStatus = published ? 'published' : 'draft';

    // Optimistic UI update
    setPage(p => p ? { ...p, status: newStatus } : null);

    const result = await updateLandingPage(pageId, { status: newStatus, slug: page.slug });

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: result.error,
      });
      // Revert on error
      setPage(p => p ? { ...p, status: page.status } : null);
    } else {
      toast({
        title: `Page ${newStatus === 'published' ? 'published' : 'is now a draft'}.`,
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

  if (error) return <p className="text-destructive">Error: {error.message}</p>;
  if (!page) return <p>Page not found.</p>;
  
  const heroSection = getSection<HeroSection>('hero');
  const featuresSection = getSection<FeatureSection>('features');
  const gallerySection = getSection<GallerySection>('gallery');
  const testimonialsSection = getSection<TestimonialSection>('testimonials');
  const pricingSection = getSection<PricingSection>('pricing');
  const faqSection = getSection<FAQSection>('faq');
  const contactSection = getSection<ContactSection>('contact');
  const ctaSection = getSection<CTASection>('cta');
  const aboutSection = getSection<AboutSection>('about');
  
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
                        value={page.pageName === 'My New Page' ? '' : page.pageName}
                        onChange={(e) => {
                          handleFieldChange('pageName', e.target.value);
                          handleSlugChange(e.target.value);
                        }}
                        placeholder="e.g. My Awesome Product"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                        id="slug"
                        value={page.slug.startsWith('untitled-page-') ? '' : page.slug}
                        onChange={(e) => handleFieldChange('slug', e.target.value)}
                        placeholder="e.g. my-awesome-product"
                    />
                    <p className="text-sm text-muted-foreground">
                      Your page will be at: /p/{page.slug}
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={() => handleSave(false)} disabled={isSaving || !page.pageName || !page.slug} className="w-full">
                    {isSaving ? <Loader2 className="animate-spin" /> : "Save and Continue"}
                </Button>
            </CardFooter>
        </Card>
      </div>
     )
  }

  const renderImageUploader = (uploadKey: string, value: string | undefined, onUpload: (url: string) => void, onRemove: () => void) => (
    <div className="space-y-2">
      <Label>Image</Label>
      {value ? (
        <div className="relative w-full h-32 border rounded-md overflow-hidden group">
          <Image src={value} alt="Uploaded image" fill objectFit="cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="destructive" size="sm" onClick={onRemove}>Remove</Button>
          </div>
        </div>
      ) : (
        <div className="w-full h-32 border-2 border-dashed rounded-md flex items-center justify-center">
            {uploadingStates[uploadKey] ? <Loader2 className="animate-spin"/> : (
              <div className="text-center">
                 <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                 <Label htmlFor={uploadKey} className="text-primary hover:underline cursor-pointer">
                    Upload an image
                    <Input id={uploadKey} type="file" className="sr-only" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], uploadKey, onUpload)} />
                 </Label>
              </div>
            )}
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(420px,1.2fr)_2fr] gap-8 items-start h-[calc(100vh-8rem)]">
      <div className="lg:col-span-1 flex flex-col gap-6 h-full">
        <div className="flex items-center justify-between gap-4 flex-shrink-0">
          <Button variant="outline" size="icon" onClick={() => router.push('/dashboard')}>
            <ArrowLeft />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold font-headline truncate" title={page.pageName}>
              {page.pageName}
            </h1>
            <p className="text-sm text-muted-foreground truncate">/p/{page.slug}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="publish-status"
                checked={page.status === 'published'}
                onCheckedChange={handlePublishToggle}
              />
              <Label htmlFor="publish-status" className="font-medium">
                {page.status === 'published' ? 'Published' : 'Draft'}
              </Label>
            </div>
            <Button onClick={() => handleSave()} disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
              <span className="ml-2 hidden md:inline">Save</span>
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto flex-grow pr-4 -mr-4">
          <Accordion type="multiple" className="w-full space-y-4">
            
            <AccordionItem value="page-settings" className="border rounded-lg bg-card">
              <AccordionTrigger className="p-4"><h3 className="font-semibold text-lg">Page Settings</h3></AccordionTrigger>
              <AccordionContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pageName-main">Page Name</Label>
                    <Input id="pageName-main" value={page.pageName} onChange={(e) => handleFieldChange('pageName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug-main">Slug</Label>
                    <Input id="slug-main" value={page.slug} onChange={(e) => handleFieldChange('slug', e.target.value)} />
                  </div>
              </AccordionContent>
            </AccordionItem>

            {Object.keys(SECTION_DEFAULTS).map(sectionKey => {
              const sectionType = sectionKey as LandingSection['type'];
              const isEnabled = isSectionEnabled(sectionType);
              
              const renderSectionEditor = () => {
                switch(sectionType) {
                  case 'hero': return heroSection && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="headline">Headline</Label>
                        <Input id="headline" value={heroSection.headline} onChange={e => handleSectionChange('hero', 'headline', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subheadline">Subheadline</Label>
                        <Textarea id="subheadline" value={heroSection.subheadline || ''} onChange={e => handleSectionChange('hero', 'subheadline', e.target.value)} />
                      </div>
                      {renderImageUploader(
                        'hero-image',
                        heroSection.imageUrl,
                        (url) => handleSectionChange('hero', 'imageUrl', url),
                        () => handleSectionChange('hero', 'imageUrl', undefined)
                      )}
                    </div>
                  );
                  case 'features': return featuresSection && (
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <Label>Section Title</Label>
                          <Input value={featuresSection.title} onChange={e => handleSectionChange('features', 'title', e.target.value)} />
                        </div>
                       {(featuresSection.items || []).map((item, index) => (
                         <Card key={index} className="p-4 relative">
                           <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeSectionItem('features', index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                           <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Feature Title</Label>
                                <Input value={item.title} onChange={e => handleSectionItemChange('features', index, 'title', e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={item.description} onChange={e => handleSectionItemChange('features', index, 'description', e.target.value)} />
                              </div>
                               {renderImageUploader(
                                `feature-${index}-image`,
                                item.imageUrl,
                                (url) => handleSectionItemChange('features', index, 'imageUrl', url),
                                () => handleSectionItemChange('features', index, 'imageUrl', undefined)
                              )}
                           </div>
                         </Card>
                       ))}
                       <Button variant="outline" onClick={() => addSectionItem('features')}><PlusCircle className="mr-2"/>Add Feature</Button>
                    </div>
                  );
                  case 'gallery': return gallerySection && (
                     <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Section Title</Label>
                          <Input value={gallerySection.title} onChange={e => handleSectionChange('gallery', 'title', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                           {(gallerySection.images || []).map((image, index) => (
                              <div key={index} className="relative group aspect-square">
                                 <Image src={image.url} alt={image.alt} fill objectFit="cover" className="rounded-md" />
                                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => {
                                        const newImages = gallerySection.images.filter((_, i) => i !== index);
                                        handleSectionChange('gallery', 'images', newImages);
                                    }}><Trash2/></Button>
                                 </div>
                              </div>
                           ))}
                           <div className="border-2 border-dashed rounded-md flex items-center justify-center aspect-square">
                             {uploadingStates['gallery-new-image'] ? <Loader2 className="animate-spin"/> : (
                               <Label htmlFor="gallery-upload" className="cursor-pointer text-center p-2">
                                 <ImageIcon className="mx-auto h-6 w-6 text-muted-foreground"/>
                                 <span className="text-xs">Add Image</span>
                                 <Input id="gallery-upload" type="file" className="sr-only" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'gallery-new-image', (url) => {
                                     const newImages = [...(gallerySection.images || []), { id: Date.now().toString(), url, alt: 'Gallery Image' }];
                                     handleSectionChange('gallery', 'images', newImages);
                                 })}/>
                               </Label>
                             )}
                           </div>
                        </div>
                     </div>
                  );
                  case 'testimonials': return testimonialsSection && (
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <Label>Section Title</Label>
                          <Input value={testimonialsSection.title} onChange={e => handleSectionChange('testimonials', 'title', e.target.value)} />
                        </div>
                       {(testimonialsSection.items || []).map((item, index) => (
                         <Card key={item.id || index} className="p-4 relative">
                           <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeSectionItem('testimonials', index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                           <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Author</Label>
                                <Input value={item.author} onChange={e => handleSectionItemChange('testimonials', index, 'author', e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <Label>Testimonial Text</Label>
                                <Textarea value={item.text} onChange={e => handleSectionItemChange('testimonials', index, 'text', e.target.value)} />
                              </div>
                              {renderImageUploader(
                                `testimonial-${index}-avatar`,
                                item.avatarUrl,
                                (url) => handleSectionItemChange('testimonials', index, 'avatarUrl', url),
                                () => handleSectionItemChange('testimonials', index, 'avatarUrl', undefined)
                              )}
                           </div>
                         </Card>
                       ))}
                       <Button variant="outline" onClick={() => addSectionItem('testimonials')}><PlusCircle className="mr-2"/>Add Testimonial</Button>
                    </div>
                  );
                  case 'pricing': return pricingSection && (
                    <div className="space-y-6">
                      <div className="space-y-2"><Label>Section Title</Label><Input value={pricingSection.title} onChange={e => handleSectionChange('pricing', 'title', e.target.value)}/></div>
                      {(pricingSection.plans || []).map((plan, index) => (
                         <Card key={index} className="p-4 relative">
                           <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeSectionItem('pricing', index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                           <div className="space-y-4">
                              <div className="space-y-2"><Label>Plan Name</Label><Input value={plan.name} onChange={e => handleSectionItemChange('pricing', index, 'name', e.target.value)}/></div>
                              <div className="space-y-2"><Label>Price</Label><Input value={plan.price} onChange={e => handleSectionItemChange('pricing', index, 'price', e.target.value)}/></div>
                              <div className="space-y-2"><Label>Features (one per line)</Label><Textarea value={(plan.features || []).join('\n')} onChange={e => handleSectionItemChange('pricing', index, 'features', e.target.value.split('\n'))}/></div>
                              <div className="space-y-2"><Label>CTA Label</Label><Input value={plan.ctaLabel} onChange={e => handleSectionItemChange('pricing', index, 'ctaLabel', e.target.value)}/></div>
                           </div>
                         </Card>
                       ))}
                       <Button variant="outline" onClick={() => addSectionItem('pricing')}><PlusCircle className="mr-2"/>Add Plan</Button>
                    </div>
                  );
                  case 'faq': return faqSection && (
                     <div className="space-y-6">
                      <div className="space-y-2"><Label>Section Title</Label><Input value={faqSection.title} onChange={e => handleSectionChange('faq', 'title', e.target.value)}/></div>
                       {(faqSection.items || []).map((item, index) => (
                         <Card key={index} className="p-4 relative">
                           <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeSectionItem('faq', index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                           <div className="space-y-4">
                              <div className="space-y-2"><Label>Question</Label><Input value={item.question} onChange={e => handleSectionItemChange('faq', index, 'question', e.target.value)}/></div>
                              <div className="space-y-2"><Label>Answer</Label><Textarea value={item.answer} onChange={e => handleSectionItemChange('faq', index, 'answer', e.target.value)}/></div>
                           </div>
                         </Card>
                       ))}
                       <Button variant="outline" onClick={() => addSectionItem('faq')}><PlusCircle className="mr-2"/>Add FAQ Item</Button>
                    </div>
                  );
                  case 'contact': return contactSection && (
                    <div className="space-y-4">
                       <div className="space-y-2"><Label>Section Title</Label><Input value={contactSection.title} onChange={e => handleSectionChange('contact', 'title', e.target.value)}/></div>
                       <div className="space-y-2"><Label>Description</Label><Textarea value={contactSection.description} onChange={e => handleSectionChange('contact', 'description', e.target.value)}/></div>
                       <div className="space-y-2"><Label>Submit Button Label</Label><Input value={contactSection.form.submitButtonLabel} onChange={e => handleSectionChange('contact', 'form', {...contactSection.form, submitButtonLabel: e.target.value})}/></div>
                    </div>
                  );
                   case 'cta': return ctaSection && (
                    <div className="space-y-4">
                      <div className="space-y-2"><Label>Title</Label><Input value={ctaSection.title} onChange={e => handleSectionChange('cta', 'title', e.target.value)}/></div>
                      <div className="space-y-2"><Label>Description</Label><Textarea value={ctaSection.description} onChange={e => handleSectionChange('cta', 'description', e.target.value)}/></div>
                      <div className="space-y-2"><Label>CTA Label</Label><Input value={ctaSection.cta.label} onChange={e => handleSectionChange('cta', 'cta', {...ctaSection.cta, label: e.target.value})}/></div>
                      <div className="space-y-2"><Label>CTA URL</Label><Input value={ctaSection.cta.url} onChange={e => handleSectionChange('cta', 'cta', {...ctaSection.cta, url: e.target.value})}/></div>
                    </div>
                  );
                  case 'about': return aboutSection && (
                    <div className="space-y-4">
                      <div className="space-y-2"><Label>Title</Label><Input value={aboutSection.title} onChange={e => handleSectionChange('about', 'title', e.target.value)}/></div>
                      <div className="space-y-2"><Label>Content</Label><Textarea value={aboutSection.content} onChange={e => handleSectionChange('about', 'content', e.target.value)} rows={6}/></div>
                    </div>
                  );
                  default: return null;
                }
              };

              return (
                <AccordionItem key={sectionType} value={sectionType} className="border-none">
                  <Card className="overflow-hidden">
                    <div className="flex items-center p-4">
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={(checked) => handleToggleSection(sectionType, checked)}
                          id={`switch-${sectionType}`}
                        />
                        <AccordionTrigger className="w-full text-left ml-4 p-0 hover:no-underline">
                           <label htmlFor={`switch-${sectionType}`} className="font-semibold text-lg capitalize cursor-pointer">
                             {sectionType}
                           </label>
                        </AccordionTrigger>
                    </div>
                    {isEnabled && (
                      <AccordionContent className="p-4 border-t">
                        {renderSectionEditor()}
                      </AccordionContent>
                    )}
                  </Card>
                </AccordionItem>
              );
            })}

          </Accordion>
        </div>
      </div>

      <div className="lg:col-span-1 hidden lg:block h-full">
        <div className="sticky top-20 h-[calc(100vh-7rem)]">
            <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
                <CardTitle>Live Preview</CardTitle>
                <Button variant="outline" size="sm" asChild>
                <Link href={`/p/${page.slug}`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Live Page
                </Link>
                </Button>
            </CardHeader>
            <CardContent className="p-0 flex-grow">
                <div className="h-full w-full rounded-b-lg border bg-muted overflow-hidden">
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
