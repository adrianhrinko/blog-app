import { Metadata } from "next";

export default function generateMetadata({ 
    title, 
    description, 
    image = "/logo.svg" 
  }: { 
    title: string; 
    description?: string; 
    image?: string; 
  }): Metadata {
    return {
      title,
      description,
      openGraph: {
        title,
        description: description,
        images: image ? [image] : undefined,
        siteName: 'FEED',
      },
      twitter: {
        card: 'summary',
        title: title,
        description: description,
        images: image ? [image] : undefined,
      },
    };
  }