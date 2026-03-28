import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from 'react-hot-toast';
import UpvoteWidget from '@/components/UpvoteWidget';

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FinGenius | AI Personal Finance",
  description: "Your intelligent AI financial mentor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "FinGenius",
        "url": "https://fingenius.entrext.com",
        "logo": "https://fingenius.entrext.com/logo.png"
      },
      {
        "@type": "WebSite",
        "name": "FinGenius AI Personal Finance",
        "url": "https://fingenius.entrext.com"
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200 selection:bg-indigo-500/30">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <ThemeProvider>
          <AuthProvider>
            <Toaster position="top-center" />
            <UpvoteWidget />

            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

