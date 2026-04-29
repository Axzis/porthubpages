'use server';

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials.
// These are stored securely as environment variables.
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Generates a signature for a direct-to-Cloudinary upload.
 *
 * This server action is crucial for secure and efficient image uploads on serverless platforms like Vercel.
 * Instead of routing the entire file through our server (which has size limits), we generate a secure,
 * temporary signature here. The client-side code then uses this signature to upload the file
 * directly from the user's browser to Cloudinary.
 *
 * @returns A promise that resolves to an object containing the signature and timestamp needed for the upload.
 */
export async function getSignedUploadSignature() {
  // We use a timestamp to ensure the signature is valid only for a short period.
  const timestamp = Math.round(new Date().getTime() / 1000);

  // Generate the signature using Cloudinary's utility function.
  // This uses your API secret, but the secret itself is never exposed to the client.
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    process.env.CLOUDINARY_API_SECRET as string
  );

  return { timestamp, signature };
}
