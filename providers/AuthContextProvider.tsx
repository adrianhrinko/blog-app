"use client"

import { auth, firestore } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  username: string | null;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  username: null 
});

export const useAuth = () => useContext(AuthContext);

export default function FirebaseAuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  const authStateChanged = async (authState: User | null) => {
    if (!authState) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setUser(authState);

    // Get username from Firestore
    const ref = doc(firestore, 'users', authState.uid);
    const unsubscribe = onSnapshot(ref, (doc) => {
      setUsername(doc.data()?.username);
      setLoading(false);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, username }}>
      {children}
    </AuthContext.Provider>
  );
}
