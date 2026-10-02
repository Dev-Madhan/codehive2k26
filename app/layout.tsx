import type { Metadata } from "next";
import { JetBrains_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

// Inter: Primary font for body, UI, descriptions, and components
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// JetBrains Mono: Monospace display font for terminal headers, code, buttons, and metrics
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// Space Grotesk: High-impact display font for headlines, heroes, and prominent typography
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CodeHive 2K26 2.0 — National Level Hackathon | Ideas × Code × Impact",
  description:
    "Official platform for CodeHive 2K26 2.0 National Level Hackathon on 23 & 24 October 2026 by Dept of CSBS, Vel Tech Multi Tech, in association with Sri Vensy Technologies & Business Intelligence Club.",
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
        "bg-black",
        "text-white",
        inter.variable,
        jetbrainsMono.variable,
        spaceGrotesk.variable,
        "font-sans"
      )}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col font-sans bg-black text-white selection:bg-blue-600 selection:text-white">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
