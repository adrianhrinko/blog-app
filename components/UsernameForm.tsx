"use client"
import { useCallback, useEffect, useState } from 'react';
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/Spinner"
import { firestore } from '@/lib/firebase';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import { debounce } from 'lodash';
import { useAuth } from '@/providers/AuthContextProvider';
import { Button } from "@/components/ui/button"

export default function UsernameForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [formValue, setFormValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.uid) {
      console.error('No user found');
      return;
    }

    // Create refs for both documents
    const userDoc = doc(firestore, 'users', user.uid);
    const usernameDoc = doc(firestore, 'usernames', formValue);

    // Commit both docs together as a batch write.
    const batch = writeBatch(firestore);
    batch.set(userDoc, { 
      username: formValue, 
      photoURL: user.photoURL, 
      displayName: user.displayName,
      anonymous: user.isAnonymous
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };
  
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    setFormValue(val);
    setLoading(false);

    if (val.length === 0) {
      setError('');
    } else if (val.length < 3) {
      setError('Username must be at least 3 characters long');
    } else if (val.length > 15) {
      setError('Username must be less than 15 characters long');
    } else if (!re.test(val)) {
      setError('Username can only contain letters, numbers, . and _ (not at start/end, no doubles)');
    } else {
      setLoading(true);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const checkUsername = useCallback(
    debounce(async (username: string) => {
      if (username.length >= 3) {
        setLoading(true);
        const ref = doc(firestore, 'usernames', username);
        const snap = await getDoc(ref);
        const exists = snap.exists();
        if (exists) {
          setError('This username is already taken');
        } else {
          setError('');
        }
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Choose Username</CardTitle>
          <CardDescription>
            Pick a unique username for your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="myusername"
                    onChange={onChange}
                    value={formValue}
                    className={cn(
                      !error && formValue && "border-green-500",
                      error && "border-red-500"
                    )}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Spinner show={loading} size={20} />
                  </div>
                </div>
                {error ? (
                  <p className="text-sm text-red-500">{error}</p>
                ) : formValue && (
                  <p className="text-sm text-green-500">Username is available!</p>
                )}
              </div>
              <Button type="submit" disabled={!!error || !formValue}>
                Choose Username
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
