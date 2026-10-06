import type { Metadata } from "next";
import Link from "next/link";
import { Auth3 } from "@/components/ui/auth-03";
import { ArrowLeftIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In / Register | CodeHive 2K26",
  description: "Access your CodeHive workspace, manage event registrations, and view your digital passes.",
};

export default function AuthPage() {
  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col justify-center items-center">
      {/* Back to Home Button on Top Left (Reference Image layout) */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-2 font-mono text-xs uppercase tracking-wider font-semibold rounded-none border border-[#262626] bg-[#0F0F0F] hover:bg-[#161616] hover:border-[#404040] text-[#A3A3A3] hover:text-white transition-colors cursor-pointer select-none"
        >
          <ArrowLeftIcon className="size-3.5 text-white shrink-0" />
          <span>&lt; Back to Home</span>
        </Link>
      </div>

      <Auth3 />
    </main>
  );
}
