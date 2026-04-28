'use client';
import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

interface DocumentData {
  id: string;
  [key: string]: any;
}

export function useDoc<T extends DocumentData>(
  collectionName: string,
  docId: string
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!firestore || !docId) {
      setLoading(false);
      return;
    }

    const docRef = doc(firestore, collectionName, docId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, collectionName, docId]);

  return { data, loading, error };
}
