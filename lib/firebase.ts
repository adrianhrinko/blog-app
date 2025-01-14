import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, signInAnonymously, createUserWithEmailAndPassword} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, Timestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDocs, limit } from "firebase/firestore";
import { query, where } from "firebase/firestore";
import { collection } from "firebase/firestore";

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

export const fromMillis = (milliseconds: number) => {
  return Timestamp.fromMillis(milliseconds);
};

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username: string) {
  const usersRef = collection(firestore, 'users');
  const q = query(usersRef, where('username', '==', username), limit(1));
  const querySnapshot = await getDocs(q);
  const userDoc = querySnapshot.docs[0];
  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc: any) {
  const data = doc.data();
  return {
    ...data,
    // Firestore timestamp is NOT serializable to JSON. Must be convert to milliseconds
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}

