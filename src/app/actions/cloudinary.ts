'use server';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'diipkygpd',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(formData: FormData) {
  const file = formData.get('image') as File;
  if (!file) {
    return { error: 'No image file provided.' };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, (error, result) => {
          if (error) reject(error);
          resolve(result);
        })
        .end(buffer);
    });

    return { success: true, url: (result as any).secure_url };
  } catch (error: any) {
    console.error('Cloudinary Upload Error:', error);
    return { error: 'Failed to upload image.' };
  }
}
