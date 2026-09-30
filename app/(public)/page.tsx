import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Background Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[800px] rounded-full bg-primary/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-[350px] w-[350px] rounded-full bg-cyan/10 blur-[120px]" />

      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface/60 text-xs text-cyan backdrop-blur-md">
            <SparklesIcon className="size-3.5 text-mint" />
            <span>CodeHive 2K26 is now live</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
            Build, collaborate & ship{" "}
            <span className="bg-gradient-to-r from-primary via-cyan to-mint bg-clip-text text-transparent">
              faster
            </span>
          </h1>

          <p className="text-base sm:text-xl text-muted max-w-xl mx-auto leading-relaxed">
            The next-generation platform designed for modern development teams, featuring ultra-fast tools and real-time collaboration.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25 cursor-pointer font-medium border-2 border-primary"
              render={<Link href="/events" />}
              nativeButton={false}
            >
              Explore Events <ArrowRightIcon className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto cursor-pointer border-2"
              render={<Link href="/auth" />}
              nativeButton={false}
            >
              Sign In
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
