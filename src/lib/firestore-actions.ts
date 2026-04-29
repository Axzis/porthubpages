'use server';

import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  limit,
  writeBatch,
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { LandingPage, Lead } from '@/lib/types';
import { revalidatePath } from 'next/cache';

/**
 * Creates a new landing page document in Firestore.
 * @param userId The ID of the user creating the page.
 * @param pageData Partial data for the new page.
 * @returns An object with success status and the new page ID, or an error.
 */
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
    // Define the default structure for a new landing page
    const newPageData: Omit<LandingPage, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'> = {
      ownerId: userId,
      pageName: pageData.pageName || 'My New Page',
      pagePurpose: 'A new landing page.',
      slug: `untitled-page-${Date.now()}`,
      status: 'draft',
      template: pageData.template || 'blank',
      brand: { name: 'My Brand' },
      seo: { title: 'My New Page', description: '' },
      style: { primaryColor: '#000000', font: 'inter', layout: 'centered' },
      sections: [],
    };

    const docRef = await addDoc(landingPagesRef, {
      ...newPageData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    // Revalidate the dashboard path to show the new page
    revalidatePath('/dashboard');
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error creating landing page:", error);
    return { error: error.message };
  }
}

/**
 * Updates an existing landing page document in Firestore.
 * @param pageId The ID of the page to update.
 * @param data The data to update.
 * @returns An object with success status or an error.
 */
export async function updateLandingPage(
  pageId: string,
  data: Partial<LandingPage>
) {
  if (!pageId) {
    return { error: 'Page ID is required.' };
  }

  const { firestore } = initializeFirebase();
  const pageRef = doc(firestore, 'landingPages', pageId);

  try {
    const updatePayload: { [key: string]: any } = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    // If the page is being published, set the published timestamp
    if (data.status === 'published' && data.status !== 'draft') {
      updatePayload.publishedAt = serverTimestamp();
    }
    
    await updateDoc(pageRef, updatePayload);
    
    // Revalidate relevant paths to reflect changes immediately
    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/editor/${pageId}`);
    if (data.slug) {
      revalidatePath(`/p/${data.slug}`);
    }
    revalidatePath(`/p/preview/${pageId}`);

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Fetches a single landing page by its public slug.
 * @param slug The URL slug of the page.
 * @returns The landing page data or null if not found.
 */
export async function getPageBySlug(slug: string): Promise<LandingPage | null> {
  const { firestore } = initializeFirebase();
  const pagesRef = collection(firestore, 'landingPages');
  const q = query(pagesRef, where('slug', '==', slug), limit(1));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as LandingPage;
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    return null;
  }
}

/**
 * Adds a new lead from a contact form to Firestore.
 * @param pageId The ID of the page where the lead was captured.
 * @param ownerId The ID of the user who owns the page.
 * @param leadData The data captured from the form.
 * @returns An object with success status or an error.
 */
export async function addLead(
  pageId: string,
  ownerId: string,
  leadData: { name?: string; email: string; phone?: string; message?: string }
) {
  if (!pageId || !ownerId) {
    return { error: 'Page or owner information is missing.' };
  }
  if (!leadData.email) {
    return { error: 'Email is a required field.' };
  }

  const { firestore } = initializeFirebase();
  const leadsRef = collection(firestore, 'leads');

  try {
    const newLead: Omit<Lead, 'id'> = {
      pageId,
      ownerId,
      ...leadData,
      isRead: false,
      createdAt: serverTimestamp(),
    };
    await addDoc(leadsRef, newLead);
    return { success: true };
  } catch (error: any) {
    console.error("Error adding lead:", error);
    return { error: error.message };
  }
}

/**
 * Marks a batch of leads as read.
 * @param leadIds An array of lead IDs to mark as read.
 * @returns An object with success status or an error.
 */
export async function markLeadsAsRead(leadIds: string[]) {
    if (!leadIds || leadIds.length === 0) {
        return { success: true };
    }
    const { firestore } = initializeFirebase();
    const batch = writeBatch(firestore);

    leadIds.forEach((id) => {
        const leadRef = doc(firestore, 'leads', id);
        batch.update(leadRef, { isRead: true });
    });

    try {
        await batch.commit();
        return { success: true };
    } catch (error: any) {
        console.error("Error marking leads as read:", error);
        return { error: error.message };
    }
}

/**
 * Permanently deletes a landing page and all of its associated leads.
 * @param pageId The ID of the page to delete.
 * @returns An object with success status or an error.
 */
export async function deleteLandingPage(pageId: string) {
  if (!pageId) {
    return { error: 'Page ID is required.' };
  }

  const { firestore } = initializeFirebase();
  
  try {
    const pageRef = doc(firestore, 'landingPages', pageId);
    
    // Find and delete all associated leads in a batch
    const leadsQuery = query(collection(firestore, 'leads'), where('pageId', '==', pageId));
    const leadsSnapshot = await getDocs(leadsQuery);
    
    const batch = writeBatch(firestore);
    
    leadsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete the landing page itself
    batch.delete(pageRef);
    
    await batch.commit();

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting landing page:", error);
    return { error: error.message };
  }
}
