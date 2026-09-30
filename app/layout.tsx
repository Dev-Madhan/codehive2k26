import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// Inter: Primary font for body, UI, descriptions, and components
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Space Grotesk: Display font strictly for main parts, headings, and branding
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "CodeHive 2K26 — Premier Event & Hackathon Platform",
  description: "Next-generation college symposium and hackathon registration platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "dark",
        "h-full",
        "antialiased",
        inter.variable,
        spaceGrotesk.variable,
        "font-sans"
      )}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
