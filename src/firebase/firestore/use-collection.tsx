'use client';
import { useState, useEffect } from 'react';
import {
  onSnapshot,
  collection,
  query,
  where,
  type CollectionReference,
  type Query,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';

interface DocumentData {
  id: string;
  [key: string]: any;
}

export function useCollection<T extends DocumentData>(
  collectionName: string,
  uid?: string | null
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!firestore) {
      setLoading(false);
      return;
    }

    let q: Query | CollectionReference;
    const collectionRef = collection(firestore, collectionName);

    if (uid) {
      q = query(collectionRef, where('ownerId', '==', uid));
    } else {
      q = collectionRef;
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as T)
        );
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, collectionName, uid]);

  return { data, loading, error };
}
