'use server';

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials from environment variables.
// Ensure these are set in your hosting environment (e.g., Vercel).
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

/**
 * Generates a signature for a direct-to-Cloudinary upload.
 *
 * This server action provides a secure, temporary signature for the client to use.
 * The client then uploads the file directly to Cloudinary, which is more efficient
 * and avoids serverless function size limits on platforms like Vercel.
 *
 * It now also returns the public API key and cloud name, so the client doesn't
 * need to rely on potentially problematic client-side environment variables.
 *
 * @returns A promise that resolves to an object containing the signature, timestamp, api_key, and cloud_name.
 */
export async function getSignedUploadSignature() {
  if (!apiSecret) {
    throw new Error('Cloudinary API secret is not configured.');
  }

  // We use a timestamp to ensure the signature is valid only for a short period.
  const timestamp = Math.round(new Date().getTime() / 1000);

  // Generate the signature using Cloudinary's utility function.
  // This uses your API secret, but the secret itself is never exposed to the client.
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    apiSecret
  );

  return { timestamp, signature, apiKey, cloudName };
}
