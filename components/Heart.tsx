'use client';

import { useDocument } from 'react-firebase-hooks/firestore';
import { collection, doc, writeBatch, increment } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Heart as HeartIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/AuthContextProvider';

interface HeartProps {
  postPath: string;
  heartCount: number;
}

// Allows user to heart or like a post
export default function HeartComponent({ postPath, heartCount }: HeartProps) {
  const { user } = useAuth();

  // Add validation to ensure postPath is not empty
  if (!postPath) {
    console.error('Invalid postPath provided to HeartComponent');
    return null;
  }

  const postRef = doc(firestore, postPath);
  const heartRef = user?.uid ? doc(collection(postRef, 'hearts'), user.uid) : null;
  const [heartDoc] = useDocument(heartRef);

  // Create a user-to-post relationship
  const addHeart = async () => {
    if (!user?.uid) return;

    const batch = writeBatch(firestore);
    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid: user?.uid });
    await batch.commit();
  };

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    if (!user?.uid) return;

    const batch = writeBatch(firestore);
    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);
    await batch.commit();
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={heartDoc?.exists() ? removeHeart : addHeart}
        disabled={!user?.uid}
        className={cn(
          "p-1 rounded-full transition-colors",
          heartDoc?.exists() ? "text-red-500" : "text-gray-500",
          !user?.uid && "opacity-50 cursor-not-allowed",
          user?.uid && "hover:bg-red-50"
        )}
      >
        <HeartIcon className="w-5 h-5" fill={heartDoc?.exists() ? "currentColor" : "none"} />
      </button>
      <span className="text-sm text-gray-500">{heartCount}</span>
    </div>
  );
}