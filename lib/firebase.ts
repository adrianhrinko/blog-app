import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, signInAnonymously, createUserWithEmailAndPassword} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!getApps().length) {
    initializeApp(config);
}

export const app = getApp();
const googleAuthProvider = new GoogleAuthProvider();

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export const signInWithGoogle = async () => {
  return signInWithPopup(auth, googleAuthProvider);
};

export const signInWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const getAnalyticsInstance = () => {
    return getAnalytics(app);
};

export const signOutUser = () => {
    return signOut(auth);
};

export const anonymousSignIn = () => {
    return signInAnonymously(auth);
};

export const signUpWithEmail = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};
