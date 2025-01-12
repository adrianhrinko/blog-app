"use client"

import { auth, firestore } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

interface AuthContextType {
    user: any | null;
    username: string | null;
}

const AuthContext = createContext<AuthContextType>({ user: null, username: null })

export const useAuth = () => useContext(AuthContext);
export const signOut = () => auth.signOut();

export default function AuthContextProvider({ children }: 
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
    <AuthContext.Provider value={{ user: user, username: username }}>
      {children}
    </AuthContext.Provider>
  );
}
