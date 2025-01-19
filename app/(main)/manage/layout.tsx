import AuthCheck from "@/components/AuthCheck";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthCheck>
        {children}
      </AuthCheck>
    </>
  );
}