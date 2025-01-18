import { useState, ChangeEvent } from 'react';
import { auth, storage } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { CopyIcon } from 'lucide-react';

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
    <div className="space-y-2">
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full h-1" />
          <p className="text-xs text-muted-foreground text-center">{progress}%</p>
        </div>
      )}

      {!uploading && (
        <Button 
          asChild 
          variant="secondary"
          className="w-full"
        >
          <Label htmlFor="image-upload" className="cursor-pointer flex items-center justify-center gap-2">
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Upload Image
            <input
              id="image-upload"
              type="file"
              onChange={uploadFile}
              accept="image/x-png,image/gif,image/jpeg"
              className="hidden"
            />
          </Label>
        </Button>
      )}

      {downloadURL && (
        <div className="flex bg-gray-50 rounded">
          <button
            onClick={() => navigator.clipboard.writeText(`![alt](${downloadURL})`)}
            title="Copy to clipboard"
            className=" text-gray-600 hover:text-gray-800 transition-colors duration-200 hover:bg-gray-100 p-4 rounded flex items-center justify-center"
          >
            <CopyIcon className="w-4 h-4" />
          </button>
          <div className="text-sm font-mono text-gray-600 break-all py-2 pr-2">
            {`![alt](${downloadURL})`}
          </div>
        </div>
      )}
    </div>
  );
}