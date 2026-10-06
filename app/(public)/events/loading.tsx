import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventsLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 font-mono">
        {/* Terminal Header & Status Strip */}
        <div className="border-b border-[#262626] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-10 w-64 sm:w-80" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>

        {/* 6 Responsive Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="border border-[#262626] bg-[#0F0F0F] flex flex-col justify-between overflow-hidden"
            >
              {/* Event Poster / Banner Placeholder */}
              <div className="relative h-44 sm:h-48 w-full bg-[#080808] border-b border-[#262626] flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>

              {/* Event Content */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-6 w-4/5" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="space-y-3 pt-3 border-t border-[#262626]">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
