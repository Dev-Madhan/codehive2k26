import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
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
        "bg-black",
        "text-white",
        inter.variable,
        jetbrainsMono.variable,
        "font-sans"
      )}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col font-sans bg-black text-white">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
