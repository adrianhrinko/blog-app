'use client';

import AuthCheck from '@/components/AuthCheck';
import { firestore } from '@/lib/firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthContextProvider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import ImageUploader from '@/components/ImageUploader';

export default function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);
  const { slug } = useParams();
  const { user } = useAuth();

  const postRef = doc(firestore, 'users', user?.uid || 'dummy', 'posts', slug as string);
  const [snapshot] = useDocument(postRef);
  const post = snapshot?.data();

  return (
    <main className="max-w-4xl mx-auto p-4">
      {post && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <section className="md:col-span-2">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">{post.title}</h1>
            <p className="text-sm text-muted-foreground mb-4">ID: {post.slug}</p>

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          <aside className="md:col-span-1">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">Tools</h3>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => setPreview(!preview)}
                variant="default"
              >
                {preview ? 'Edit' : 'Preview'}
              </Button>
              <Link href={`/${post.username}/${post.slug}`}>
                <Button variant="secondary" className="w-full">
                  Live view
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

interface PostFormProps {
  defaultValues: any;
  postRef: any;
  preview: boolean;
}

interface FormData {
  content: string;
  published: boolean;
}

function PostForm({ defaultValues, postRef, preview }: PostFormProps) {
  const { register, handleSubmit, reset, watch, formState: { errors, isDirty, isValid } } = useForm<FormData>({ 
    defaultValues, 
    mode: 'onChange' 
  });

  const updatePost = async ({ content, published }: FormData) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: Timestamp.now(),
    });

    reset({ content, published });
    console.log('Post updated successfully', published);
    // TODO: SUCCESS TOAST
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <Card className="prose max-w-none">
          <CardContent className="pt-6">
            <ReactMarkdown>{watch('content')}</ReactMarkdown>
          </CardContent>
        </Card>
      )}

      <ImageUploader />

      <div className={`${preview ? 'hidden' : 'block'} space-y-4`}>
        <Textarea
          {...register('content', {
            maxLength: { value: 20000, message: 'Content is too long' },
            minLength: { value: 10, message: 'Content is too short' },
            required: { value: true, message: 'Content is required'}
          })}
          className="min-h-[256px]"
        />
        {errors.content && <p className="text-red-500">{errors.content.message}</p>}

        <div className="flex items-center space-x-2">
          <Checkbox
              id="published"
              checked={watch('published')}
              onCheckedChange={(checked) => {
                const value = checked === true;
                register('published').onChange({
                  target: { name: 'published', value }
                });
              }}
            />
          <Label htmlFor="published">Published</Label>
        </div>

        <Button type="submit" className="w-full" disabled={!isDirty || !isValid}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}