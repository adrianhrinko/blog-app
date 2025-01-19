import type { Metadata } from "next";
import "./globals.css";
import FirebaseAuthContextProvider from "@/providers/AuthContextProvider";
import { NavigationGuardProvider } from "next-navigation-guard";
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
          <NavigationGuardProvider>
            {children}
          </NavigationGuardProvider>
        </FirebaseAuthContextProvider>
      </body>
    </html>
  );
}
