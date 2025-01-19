'use client';

import { firestore } from '@/lib/firebase';
import { doc, updateDoc, setDoc, Timestamp, deleteDoc } from 'firebase/firestore';
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/providers/AuthContextProvider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUploader from '@/components/ImageUploader';
import { EyeIcon, PencilIcon, SaveIcon, TrashIcon, GlobeIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import PostContent from '@/components/PostContent';
import kebabCase from 'lodash.kebabcase';
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import DeleteDialog from './DeleteDialog';
import { useNavigationGuard } from "next-navigation-guard";
import { LeavingDialog } from "./LeavingDialog";

export default function PostManager({ post, postRef, user }: { post?: any, postRef?: any, user: any}) {
  const [preview, setPreview] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { username } = useAuth();
  const isSaving = useRef(false);
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, reset, watch, formState: { errors, isDirty, isValid } } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: post
  }); 

  const navGuard = useNavigationGuard({ enabled: !isSaving.current && isDirty && isValid})

  const updatePost = async ({ title, subtitle, content, published }: FormData) => {
    isSaving.current = true;
    if (!post) {
      // Create new post
      const slug = encodeURI(kebabCase(title));
      const uid = user?.uid;
      const userPhotoUrl = user?.photoURL;
      
      if (!uid || !username) return;

      const newPostRef = doc(firestore, 'users', uid, 'posts', slug);

      const data = {
        title,
        subtitle,
        slug,
        uid,
        username,
        userPhotoUrl,
        published,
        content,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        heartCount: 0,
      };

      await setDoc(newPostRef, data);

      toast({
        title: "Success!",
        description: "Your post has been created.",
      });

      router.push(`/manage/${slug}`);
    } else {
      // Update existing post
      await updateDoc(postRef, {
        title,
        subtitle,
        content,
        published,
        updatedAt: Timestamp.now(),
      });
      toast({
        title: "Success!",
        description: "Your changes have been saved.",
      });
    }

    reset({ title, subtitle, content, published });
  };

  const deletePost = async () => {
    await deleteDoc(postRef);
    setShowDeleteDialog(false);
    toast({
      title: "Success!",
      description: "Your post has been deleted.",
    });
    router.push('/manage');
  };

  const currentFormState = {
    title: watch('title'),
    subtitle: watch('subtitle'),
    content: watch('content'),
    published: watch('published')
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit(updatePost)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-2">
            {preview ? 
              <PostContent post={currentFormState} preview={true} /> : 
              <PostEditor register={register} watch={watch} errors={errors} preview={preview} />}
          </section>
          <Actions
            watch={watch}
            register={register}
            preview={preview}
            published={post?.published || false}
            canSubmit={isDirty && isValid}
            isNewPost={!post}
            setPreview={setPreview}
            onDelete={() => setShowDeleteDialog(true)}
          />
        </div>
      </form>
      <DeleteDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={deletePost} />
      <LeavingDialog isOpen={navGuard.active} yesCallback={navGuard.accept} noCallback={navGuard.reject} />
    </main>
  );
}

interface PostEditorProps {
  register: any;
  watch: any;
  errors: any;
  preview: boolean;
}

interface FormData {
  title: string;
  subtitle: string;
  content: string;
  published: boolean;
}

function PostEditor({ register, errors }: PostEditorProps) {
  return (
        <>
          <div className="mb-6">
            <Input
              {...register('title', {
                required: { value: true, message: 'Title is required' },
                minLength: { value: 3, message: 'Title must be at least 3 characters' },
                maxLength: { value: 100, message: 'Title must be less than 100 characters' }
              })}
              className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2 shadow-none border-0 focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:outline-none p-0 h-auto placeholder:text-muted-foreground/50"
              placeholder="Post title"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            <Input
              {...register('subtitle', {
                maxLength: { value: 200, message: 'Subtitle must be less than 200 characters' }
              })}
              className="text-xl text-muted-foreground shadow-none border-0 focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:outline-none p-0 h-auto mt-2 placeholder:text-muted-foreground/50"
              placeholder="Add a subtitle (optional)"
            />
            {errors.subtitle && <p className="text-red-500 text-sm">{errors.subtitle.message}</p>}
          </div>
          <div className="space-y-4">
            <Textarea
              {...register('content', {
                maxLength: { value: 20000, message: 'Content is too long' },
                minLength: { value: 10, message: 'Content is too short' },
                required: { value: true, message: 'Content is required' }
              })}
              className="mx-auto bg-white shadow-none border-0 focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:outline-none text-l p-0 pb-8 placeholder:text-muted-foreground/50 min-h-[200px] overflow-hidden"
              placeholder="Tell your story..."
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
            {errors.content && <p className="text-red-500 text-center">{errors.content.message}</p>}
            <input type="hidden" {...register('published')} />
          </div>
        </>
  );
}

interface ActionsProps {
  watch: any;
  register: any;
  preview: boolean;
  published: boolean;
  canSubmit: boolean;
  isNewPost: boolean;
  setPreview: (preview: boolean) => void;
  onDelete: () => void;
}

function Actions({ watch, register, preview, published, canSubmit, isNewPost, setPreview, onDelete }: ActionsProps) {
  return (
    <aside className="md:col-span-1 sticky top-6 self-start">
      <h3 className="text-xl font-semibold tracking-tight mb-4">
        Actions
      </h3>
      <div className="flex flex-col gap-3">
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GlobeIcon className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="published" className="font-medium">Published</Label>
              </div>
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
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {published ? 'The post is visible to the public' : 'The post is in draft mode'}
            </p>
          </CardContent>
        </Card>

        <Button
          type="button"
          variant="secondary"
          onClick={() => setPreview(!preview)}
          className="w-full justify-center flex items-center gap-2"
        >
          {preview ? (
            <>
              <PencilIcon className="w-4 h-4" />
              Edit Post
            </>
          ) : (
            <>
              <EyeIcon className="w-4 h-4" />
              Preview Post
            </>
          )}
        </Button>
        
        <ImageUploader />

        <Button
          type="submit"
          className="w-full justify-center flex items-center gap-2"
          disabled={!canSubmit}
        >
          <SaveIcon className="w-4 h-4" />
          {isNewPost ? 'Create Post' : 'Save Changes'}
        </Button>

        { !isNewPost && <Button
          type="button"
          variant="destructive"
          className="w-full justify-center flex items-center gap-2"
          onClick={onDelete}
        >
          <TrashIcon className="w-4 h-4" />
          Delete Post
        </Button>}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Editor Tips</CardTitle>
          <p className="text-sm text-muted-foreground">Format your post with <a href="https://www.markdownguide.org/cheat-sheet/" className="underline hover:text-foreground" target="_blank" rel="noopener noreferrer">Markdown</a></p>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2 opacity-75">
            <div className="flex items-center gap-2">
              <code className="bg-muted/50 px-1 rounded text-xs"># Title</code>
              <span>→</span>
              <span className="font-medium">Large Heading</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="bg-muted/50 px-1 rounded text-xs">**text**</code>
              <span>→</span>
              <span className="font-bold">Bold Text</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="bg-muted/50 px-1 rounded text-xs">*text*</code>
              <span>→</span>
              <span className="italic">Italic Text</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="bg-muted/50 px-1 rounded text-xs">[Click](url)</code>
              <span>→</span>
              <span className="underline">Link</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}