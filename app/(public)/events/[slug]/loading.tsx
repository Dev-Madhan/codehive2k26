import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";
import { RegistrationSkeleton } from "@/components/registration/registration-skeleton";

export default function EventDetailLoading() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Header />
      <main className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-10 space-y-4 sm:space-y-8 font-mono">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-[#262626] pb-3 sm:pb-4 gap-2">
          <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-[#0A0A0A] border border-[#262626]">
            <Skeleton className="size-3.5" />
            <Skeleton className="h-3 w-24" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-32" />
          </div>
        </div>

        {/* Event Header Banner */}
        <div className="relative border border-[#262626] bg-[#0A0A0A] p-3.5 sm:p-7 md:p-8">
          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-t border-r border-[#333333] pointer-events-none !m-0" />
          <div className="absolute bottom-0 left-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-b border-l border-[#333333] pointer-events-none !m-0" />

          <div className="space-y-3.5 sm:space-y-6">
            <div className="space-y-1.5 sm:space-y-3">
              <Skeleton className="h-4 sm:h-5 w-24" />
              <Skeleton className="h-7 sm:h-12 w-3/4 max-w-lg" />
              <div className="space-y-1.5 max-w-3xl">
                <Skeleton className="h-3.5 sm:h-4 w-full" />
                <Skeleton className="h-3.5 sm:h-4 w-4/5" />
              </div>
            </div>

            {/* Mobile Compact HUD Quick Specs */}
            <div className="sm:hidden flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-[#262626]">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>

            {/* Desktop Quick Specs Grid */}
            <div className="hidden sm:grid sm:grid-cols-4 gap-2 pt-3 sm:pt-4 border-t border-[#262626]">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#121212] border border-[#1f1f1f] p-2.5 sm:p-3 space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Event Instructions / Track Rules Skeleton */}
        <div className="relative border border-[#262626] bg-[#0A0A0A] p-3.5 sm:p-7 md:p-8 space-y-4">
          <div className="absolute top-0 right-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-t border-r border-[#333333] pointer-events-none !m-0" />
          <div className="absolute bottom-0 left-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-b border-l border-[#333333] pointer-events-none !m-0" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#262626] pb-3 gap-2">
            <div className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 sm:h-7 w-52 sm:w-64" />
            </div>
            <Skeleton className="h-6 w-28 self-start sm:self-auto" />
          </div>

          {/* 4 Rounds Progression / Collapsible list */}
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border border-[#222222] bg-[#0F0F0F] p-3 sm:p-3.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Skeleton className="size-4 shrink-0" />
                  <Skeleton className="h-4 w-36 sm:w-48" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* Registration Section Skeleton */}
        <RegistrationSkeleton />
      </main>
    </div>
  );
}
