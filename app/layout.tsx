import type { Metadata } from "next";
import "./globals.css";
import FirebaseAuthContextProvider from "@/providers/AuthContextProvider";

export const metadata: Metadata = {
  title: "FEED",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <FirebaseAuthContextProvider>
          {children}
        </FirebaseAuthContextProvider>
      </body>
    </html>
  );
}
