"use client"

import { auth, firestore } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

interface AuthContextType {
    user: User | null;
    username: string | null;
}

const AuthContext = createContext<AuthContextType>({ user: null, username: null })

export const useAuth = () => useContext(AuthContext);

export default function FirebaseAuthContextProvider({ children }: 
  { children:  React.ReactNode }) {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);

    useEffect(() => {
      console.log("user", user);
      let unsubscribe = () => {};

      if (user) {
        const ref = doc(firestore, 'users', user.uid);
        unsubscribe = onSnapshot(ref, (doc) => {
          setUsername(doc.data()?.username);
        });
      } else {
        setUsername(null);
      }

      return () => unsubscribe();
    }, [user]);
    
  return (
    <AuthContext.Provider value={{ user: user || null, username: username }}>
      {children}
    </AuthContext.Provider>
  );
}
