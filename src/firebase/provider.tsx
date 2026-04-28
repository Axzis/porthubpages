// src/firebase/provider.tsx
'use client';
import {
  createContext,
  useContext,
  useMemo,
} from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

export type FirebaseContextValue = {
  firebaseApp: FirebaseApp | null,
  firestore: Firestore | null,
  auth: Auth | null,
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({
  children,
  firebaseApp,
  firestore,
  auth,
}: {
  children: React.ReactNode,
} & FirebaseContextValue) {
  const value = useMemo(() => {
    return {
      firebaseApp,
      firestore,
      auth,
    };
  }, [firebaseApp, firestore, auth]);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export function useFirebaseApp() {
  const context = useFirebase();
  return context.firebaseApp;
}

export function useFirestore() {
  const context = useFirebase();
  return context.firestore;
}

export function useAuth() {
  const context = useFirebase();
  return context.auth;
}
