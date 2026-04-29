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

type UseCollectionOptions = {
    where?: [string, '==' | 'in' | 'array-contains', any];
}

export function useCollection<T extends DocumentData>(
  collectionName: string,
  options?: UseCollectionOptions
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Destructuring for stable dependencies in useEffect
  const whereField = options?.where?.[0];
  const whereOp = options?.where?.[1];
  const whereValue = options?.where?.[2];

  useEffect(() => {
    if (!firestore) {
      setLoading(false);
      return;
    }

    // If a 'where' clause is provided but the value to compare against is missing
    // (e.g., waiting for user auth), return empty data for now.
    // The hook will re-run when the value is available.
    if (whereField && (whereValue === undefined || whereValue === null)) {
        setData([]);
        setLoading(false);
        return;
    }

    let q: Query | CollectionReference;
    const collectionRef = collection(firestore, collectionName);

    if (whereField && whereOp && whereValue !== undefined && whereValue !== null) {
      q = query(collectionRef, where(whereField, whereOp, whereValue));
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
        setError(null);
      },
      (err) => {
        console.error(`Error fetching collection ${collectionName}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, collectionName, whereField, whereOp, whereValue]);

  return { data, loading, error };
}
