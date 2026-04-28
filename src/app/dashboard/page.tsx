'use client';

import { Button } from '@/components/ui/button';
import { useUser, useCollection } from '@/firebase';
import { createLandingPage } from '@/lib/firestore-actions';
import type { LandingPage } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { PlusCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ImageUploader } from '@/components/image-uploader';

export default function DashboardPage() {
  const { user } = useUser();
  const {
    data: landingPages,
    loading,
    error,
  } = useCollection<LandingPage>('landingPages', user?.uid);
  const { toast } = useToast();

  const handleCreatePage = async () => {
    if (!user) return;

    const mockPageData = {
      pageName: 'My New Page',
      slug: `new-page-${Date.now()}`,
      template: 'blank',
    };

    const result = await createLandingPage(user.uid, mockPageData);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error creating page',
        description: result.error,
      });
    } else {
      toast({
        title: 'Page created!',
        description: 'Your new landing page has been created as a draft.',
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline">Your Pages</h1>
        <Button onClick={handleCreatePage}>
          <PlusCircle className="mr-2" />
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
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">No pages yet</h3>
            <p className="text-muted-foreground mb-4">
              Click "Create New Page" to get started.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && landingPages.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {landingPages.map((page) => (
            <Link href={`/dashboard/editor/${page.id}`} key={page.id}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="truncate">{page.pageName}</CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span>/{page.slug}</span>
                    <Badge
                      variant={page.status === 'published' ? 'default' : 'secondary'}
                    >
                      {page.status}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Updated{' '}
                    {page.updatedAt &&
                      formatDistanceToNow(
                        new Date((page.updatedAt as any).seconds * 1000),
                        { addSuffix: true }
                      )}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Image Uploader</CardTitle>
            <CardDescription>
              Test the Cloudinary image upload functionality.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
