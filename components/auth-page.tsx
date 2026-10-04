"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Code2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Skiper21 } from "@/components/v1/skiper21";

export function AuthPage() {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/dashboard`,
      });

      if (result.error) {
        throw new Error(result.error.message || "Google sign-in failed");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Google sign-in failed";
      toast.error(message);
      setIsSigningIn(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col p-4 sm:p-6 lg:p-8">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="CodeHive 2K26 home"
            className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 transition-colors hover:bg-white/[0.08]"
          >
            <Image
              src="/code%20hive%20logo.svg"
              alt="CodeHive 2K26"
              width={1825}
              height={416}
              priority
              className="h-7 w-auto brightness-0 invert"
            />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            Back to website
            <ArrowUpRight className="size-4" />
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-2 lg:gap-12 lg:py-10">
          <section className="flex flex-col items-center justify-center">
            <div className="mb-6 w-full max-w-[420px]">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.08] px-3 py-1.5 text-xs font-medium text-blue-200">
                <Sparkles className="size-3.5" />
                Your next big idea starts here
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Welcome to CodeHive
              </h1>
              <p className="mt-2 text-sm leading-6 text-white/55 sm:text-base">
                Continue securely with your Google account.
              </p>
            </div>
            <Skiper21
              isLoading={isSigningIn}
              onGoogleSignIn={handleGoogleSignIn}
            />
          </section>

          <aside className="relative hidden min-h-[620px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B1426] p-8 lg:flex lg:flex-col lg:justify-between xl:p-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_22%,rgba(37,99,235,0.38),transparent_42%),radial-gradient(ellipse_at_5%_100%,rgba(14,165,233,0.22),transparent_45%),linear-gradient(145deg,#101c32_0%,#080d18_70%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.16)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
            <div className="relative flex items-center justify-between">
              <Image
                src="/code%20hive%20logo.svg"
                alt="CodeHive 2K26"
                width={1825}
                height={416}
                className="h-8 w-auto brightness-0 invert"
              />
              <Code2 className="size-5 text-blue-200/80" />
            </div>

            <div className="relative my-12">
              <div className="mb-5 text-xs font-medium uppercase tracking-[0.24em] text-blue-200/80">
                Build something remarkable
              </div>
              <h2 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-[-0.05em] text-white xl:text-6xl">
                Think fast.
                <br />
                <span className="bg-gradient-to-r from-blue-200 via-sky-300 to-white bg-clip-text text-transparent">
                  Build fearless.
                </span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-7 text-slate-300/75">
                Bring your ideas to life, work with fellow builders, and take on
                real-world challenges at CodeHive 2K26.
              </p>
            </div>

            <div className="relative grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-sm">
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/45">
                  Two days
                </div>
                <div className="mt-1.5 text-lg font-semibold text-white">
                  One big build
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-sm">
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/45">
                  Your challenge
                </div>
                <div className="mt-1.5 text-lg font-semibold text-white">
                  Tech + AI
                </div>
              </div>
            </div>
          </aside>
        </div>

        <footer className="flex justify-center py-2 text-center text-xs text-white/35">
          Build together. Make an impact.
        </footer>
      </div>
    </main>
  );
}

export default AuthPage;
