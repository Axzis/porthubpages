'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUser, useCollection } from '@/firebase';
import { createLandingPage, updateLandingPage } from '@/lib/firestore-actions';
import type { LandingPage, Lead } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { PlusCircle, Loader2, Edit, Eye, Mail, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function DashboardPage() {
  const { user } = useUser();
  const {
    data: landingPages,
    loading: pagesLoading,
    error,
  } = useCollection<LandingPage>('landingPages', { where: ['ownerId', '==', user?.uid] });

  const { data: leads, loading: leadsLoading } = useCollection<Lead>('leads', { where: ['ownerId', '==', user?.uid] });

  const { toast } = useToast();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [publishingStates, setPublishingStates] = useState<Record<string, boolean>>({});

  const handleCreatePage = async () => {
    if (!user) return;
    setIsCreating(true);
    const result = await createLandingPage(user.uid, {
      pageName: 'My New Page',
      template: 'blank',
    });
    setIsCreating(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error creating page',
        description: result.error,
      });
    } else {
      toast({
        title: 'Page created!',
        description: 'Your new page has been created as a draft.',
      });
      router.push(`/dashboard/editor/${result.id}`);
    }
  };

  const handlePublishToggle = async (page: LandingPage, published: boolean) => {
    setPublishingStates(prev => ({...prev, [page.id]: true}));
    const newStatus = published ? 'published' : 'draft';
    const result = await updateLandingPage(page.id, { status: newStatus });
    
    if (result.error) {
      toast({ variant: 'destructive', title: 'Update failed', description: result.error });
    } else {
      toast({ title: `Page is now ${newStatus}.` });
    }
    setPublishingStates(prev => ({...prev, [page.id]: false}));
  }
  
  const loading = pagesLoading || leadsLoading;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline">Your Pages</h1>
        <Button onClick={handleCreatePage} disabled={isCreating}>
          {isCreating ? <Loader2 className="animate-spin" /> : <PlusCircle className="mr-2" />}
          Create New Page
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      )}
      {error && (
        <p className="text-destructive">Error loading pages: {error.message}</p>
      )}

      {!loading && landingPages.length === 0 && (
        <Card className="text-center py-16 border-dashed">
          <CardContent>
            <h3 className="text-2xl font-semibold mb-2">No pages yet</h3>
            <p className="text-muted-foreground mb-6">
              Click the button below to build your first landing page.
            </p>
            <Button onClick={handleCreatePage} disabled={isCreating}>
              <PlusCircle className="mr-2" />
              Create Your First Page
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && landingPages.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {landingPages.map((page) => {
            const unreadLeadsCount = leads.filter(lead => lead.pageId === page.id && !lead.isRead).length;

            return (
              <Card key={page.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="truncate pr-4">{page.pageName}</CardTitle>
                    {unreadLeadsCount > 0 && (
                      <Link href={`/dashboard/editor/${page.id}`} className="flex-shrink-0">
                          <Badge variant="default" className="flex items-center gap-1.5 cursor-pointer">
                              <Mail className="h-3 w-3" />
                              {unreadLeadsCount} New
                          </Badge>
                      </Link>
                    )}
                  </div>
                  <CardDescription className="flex items-center justify-between pt-1">
                    <Link href={`/p/${page.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:underline truncate flex items-center gap-1.5">
                      /p/{page.slug} <ExternalLink className="h-3 w-3" />
                    </Link>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">
                    Updated{' '}
                    {page.updatedAt &&
                      formatDistanceToNow(
                        new Date((page.updatedAt as any).seconds * 1000),
                        { addSuffix: true }
                      )}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                          id={`publish-${page.id}`}
                          checked={page.status === 'published'}
                          onCheckedChange={(checked) => handlePublishToggle(page, checked)}
                          disabled={publishingStates[page.id]}
                      />
                      <Label htmlFor={`publish-${page.id}`}>{publishingStates[page.id] ? 'Updating...' : 'Publish'}</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="icon">
                          <Link href={`/p/preview/${page.id}`} target="_blank" rel="noopener noreferrer">
                              <Eye />
                          </Link>
                      </Button>
                      <Button asChild size="icon">
                          <Link href={`/dashboard/editor/${page.id}`}>
                              <Edit />
                          </Link>
                      </Button>
                    </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
}
