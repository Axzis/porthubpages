'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { uploadImage } from '@/app/actions/cloudinary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export function ImageUploader() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    setUploadedImageUrl(null);
    const result = await uploadImage(formData);
    setLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: result.error,
      });
    } else {
      setUploadedImageUrl(result.url || null);
      toast({
        title: 'Upload successful!',
        description: 'Your image has been uploaded to Cloudinary.',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          id="picture"
          type="file"
          onChange={handleUpload}
          disabled={loading}
          className="max-w-xs"
        />
        {loading && <Loader2 className="animate-spin" />}
      </div>
      {uploadedImageUrl && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Upload successful:
          </p>
          <div className="relative w-48 h-48 border rounded-md overflow-hidden">
            <Image
              src={uploadedImageUrl}
              alt="Uploaded image"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <a
            href={uploadedImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline mt-2 block break-all"
          >
            {uploadedImageUrl}
          </a>
        </div>
      )}
    </div>
  );
}
