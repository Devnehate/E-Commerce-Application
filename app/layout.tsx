import type { Metadata } from "next";
import "./globals.css";
import {Inter} from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ecommerce App",
  description: "Created By Dev nehate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gray-900">
      <body className={inter.className}>
        <main className="bg-gray-900">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
