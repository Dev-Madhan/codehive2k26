import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

// Inter: Primary font for body, UI, descriptions, and components
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// JetBrains Mono: Monospace display font for terminal headers, code, buttons, and metrics
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Space Grotesk: High-impact display font for headlines, heroes, and prominent typography
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://codehive2k26.vercel.app");

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "CodeHive 2K26 2.0 — National Level Hackathon | Ideas × Code × Impact",
    template: "%s | CodeHive 2K26",
  },
  description:
    "Official platform for CodeHive 2K26 2.0 National Level Hackathon on 23 & 24 October 2026 by Dept of CSBS, Vel Tech Multi Tech, in association with Sri Vensy Technologies.",
  keywords: [
    "CodeHive 2K26",
    "CodeHive",
    "Vel Tech Multi Tech",
    "National Level Hackathon",
    "CSBS",
    "Sri Vensy Technologies",
    "Hackathon Chennai",
    "Engineering Symposium",
  ],
  authors: [{ name: "Dept of CSBS, Vel Tech Multi Tech" }],
  creator: "CodeHive 2K26 Operations Team",
  publisher: "Vel Tech Multi Tech Dr.Rangarajan Dr.Sakunthala Engineering College",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: appUrl,
    siteName: "CodeHive 2K26",
    title: "CodeHive 2K26 2.0 — National Level Hackathon | Ideas × Code × Impact",
    description:
      "Official platform for CodeHive 2K26 2.0 National Level Hackathon on 23 & 24 October 2026 by Dept of CSBS, Vel Tech Multi Tech.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeHive 2K26 2.0 — National Level Hackathon",
    description:
      "Official platform for CodeHive 2K26 2.0 National Level Hackathon on 23 & 24 October 2026.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.ico",
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
      <body className="min-h-full flex flex-col font-sans bg-black text-white selection:bg-white selection:text-black">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
