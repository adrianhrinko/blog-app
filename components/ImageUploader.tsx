import { useState, ChangeEvent } from 'react';
import { auth, storage } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';

// Uploads images to Firebase Storage
export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  // Creates a Firebase Upload Task
  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    // Get the file
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split('/')[1];

    if (!auth.currentUser?.uid) return;

    // Makes reference to the storage bucket location
    const storageRef = ref(storage, `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
    setUploading(true);

    // Starts the upload
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen to updates to upload task
    uploadTask.on('state_changed', 
      (snapshot) => {
        const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(Math.round(pct));
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error(error);
        setUploading(false);
      },
      () => {
        // Handle successful upload
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setDownloadURL(url);
          setUploading(false);
        });
      }
    );
  };

  return (
    <Card className="p-4">
      {uploading && (
        <div className="flex flex-col items-center gap-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">{progress}% uploaded</p>
        </div>
      )}

      {!uploading && (
        <div>
          <Button asChild variant="secondary" className="w-full">
            <Label htmlFor="image-upload" className="cursor-pointer">
              📸 Upload Image
              <input
                id="image-upload"
                type="file"
                onChange={uploadFile}
                accept="image/x-png,image/gif,image/jpeg"
                className="hidden"
              />
            </Label>
          </Button>
        </div>
      )}

      {downloadURL && (
        <code className="mt-4 w-full">
          {`![alt](${downloadURL})`}
        </code>
      )}
    </Card>
  );
}