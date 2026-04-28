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
    const newPageData: Omit<LandingPage, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'> = {
      ownerId: userId,
      pageName: pageData.pageName || 'My New Page',
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
    revalidatePath('/dashboard');
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error creating landing page:", error);
    return { error: error.message };
  }
}

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
    await updateDoc(pageRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/editor/${pageId}`);
    if (data.slug) {
      revalidatePath(`/p/${data.slug}`);
    }
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

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
