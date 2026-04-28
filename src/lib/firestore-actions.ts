'use server';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { LandingPage } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function createLandingPage(
  userId: string,
  pageData: Partial<Omit<LandingPage, 'id'>>
) {
  if (!userId) {
    return { error: 'User is not authenticated.' };
  }

  const { firestore } = initializeFirebase();
  const landingPagesRef = collection(firestore, 'landingPages');

  try {
    const newPageData = {
      ...pageData,
      ownerId: userId,
      status: 'draft',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(landingPagesRef, newPageData);
    revalidatePath('/dashboard');
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { error: error.message };
  }
}
