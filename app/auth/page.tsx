import type { Metadata } from "next";
import Link from "next/link";
import { Auth3 } from "@/components/ui/auth-03";
import { AnimatedButton } from "@/components/ui/animated-button";
import { ArrowLeftIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In / Register | CodeHive",
  description: "Access your CodeHive workspace, collaborate in real-time, and build modern apps.",
};

export default function AuthPage() {
  return (
    <main className="relative min-h-screen w-full bg-black">
      {/* Back to Home Button on Top Left */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/" className="inline-block">
          <AnimatedButton
            as="span"
            className="h-10 px-4 py-2 text-sm font-medium rounded-lg border-2 border-[#262626] bg-[#141414] text-foreground cursor-pointer shadow-sm select-none"
          >
            <ArrowLeftIcon className="size-4 text-cyan shrink-0" />
            <span className="leading-none">Back to Home</span>
          </AnimatedButton>
        </Link>
      </div>

      <Auth3 />
    </main>
  );
}
