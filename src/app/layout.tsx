import type { Metadata } from "next";
import { Archivo_Narrow, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { MotionConfig } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToasterProvider } from "@/components/shared/ToasterProvider";
import "./globals.css";

const displayFace = Archivo_Narrow({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFace = IBM_Plex_Sans({
  variable: "--font-body-face",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const monoFace = IBM_Plex_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Project Sphere",
  description: "Where student builders showcase what they made.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${displayFace.variable} ${bodyFace.variable} ${monoFace.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <MotionConfig reducedMotion="user">
              <Navbar />
              <div className="flex flex-1 flex-col">{children}</div>
              <Footer />
              <ToasterProvider />
            </MotionConfig>
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
