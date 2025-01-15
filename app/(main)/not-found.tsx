import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CustomNotFound() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-[8rem] font-black leading-none mb-4">
          404
        </h1>
        <p className="text-2xl text-muted-foreground">
          The page you're looking for couldn't be found.
        </p>

        <div className="my-8">
          <iframe
            src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
            width="480"
            height="362" 
            className="rounded border"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>

        <div className="mt-8">
          <p className="text-muted-foreground mb-4">
            Lost? Don't worry, we'll help you find your way back.
          </p>
          <Link href="/" className="mx-auto">
            <Button variant="default" size="lg">
              Back to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}