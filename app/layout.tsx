import type { Metadata } from "next";
import { Geist, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { BeamsBackground } from "@/components/ui/beams-background";

// Geist is used for body and UI text.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
  weight: "400",
});

// Outfit is used for headings and display text.
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: "700",
});

export const metadata: Metadata = {
  title: "CodeHive 2K26 2.0 — National Level Hackathon | Ideas × Code × Impact",
  description:
    "Official platform for CodeHive 2K26 2.0 National Level Hackathon on 23 & 24 October 2026 by Dept of CSBS, Vel Tech Multi Tech, in association with Sri Vensy Technologies & Business Intelligence Club.",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
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
        "h-full",
        "dark",
        "antialiased",
        "bg-background",
        "text-foreground",
        geist.variable,
        outfit.variable,
        "font-sans"
      )}
      style={{ colorScheme: "dark", backgroundColor: "#080D18" }}
    >
      <body className="relative isolate min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-blue-600 selection:text-foreground">
        <BeamsBackground />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <TooltipProvider>{children}</TooltipProvider>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
