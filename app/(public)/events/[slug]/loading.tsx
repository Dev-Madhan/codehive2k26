import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-5 sm:space-y-8 font-mono">
        {/* Navigation & Back Button */}
        <div className="flex items-center justify-between border-b border-[#152A54] pb-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 border border-[#152A54] bg-[#060D1A]">
            <Skeleton className="size-3.5 rounded-none" />
            <Skeleton className="h-3.5 w-28 rounded-none" />
          </div>
        </div>

        {/* Event Header Banner Skeleton */}
        <div className="space-y-4 border border-[#152A54] bg-[#060D1A] p-4 sm:p-8">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 sm:h-10 w-3/4 max-w-lg" />
          <div className="space-y-2 max-w-3xl">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          <div className="flex flex-wrap gap-3.5 sm:gap-6 pt-4 border-t border-[#152A54]">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>

        {/* Event Instructions Skeleton */}
        <div className="border border-[#152A54] bg-[#060D1A] space-y-6 p-4 sm:p-8">
          <div className="space-y-4 border-b border-[#152A54] pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Skeleton className="h-7 w-64" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
            <Skeleton className="h-10 w-full max-w-2xl" />
          </div>

          {/* 4 Rounds Progression Grid */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-4 w-32 hidden sm:block" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="border border-[#152A54] bg-[#03060E] p-4 space-y-2.5"
                >
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Guidelines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-[#152A54] bg-[#03060E] p-4 space-y-2"
              >
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Registration Portal Section Skeleton */}
        <div className="border border-[#152A54] bg-[#060D1A] p-4 sm:p-8 space-y-5">
          <div className="border-b border-[#152A54] pb-4">
            <Skeleton className="h-6 w-60" />
            <Skeleton className="h-3.5 w-72 mt-2" />
          </div>

          {/* Section 01: Team Configuration */}
          <div className="border border-[#152A54] bg-[#060D1A] p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-[#152A54] pb-2">
              <Skeleton className="size-4" />
              <Skeleton className="h-3.5 w-48" />
            </div>
            <Skeleton className="h-11 sm:h-10 w-full" />
          </div>

          {/* Section 02: Team Leader */}
          <div className="border border-[#152A54] bg-[#060D1A] p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#152A54] pb-2">
              <Skeleton className="size-4" />
              <Skeleton className="h-3.5 w-40" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-11 sm:h-10 w-full" />
              <Skeleton className="h-11 sm:h-10 w-full" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Skeleton className="h-11 sm:h-10 sm:col-span-2 w-full" />
                <Skeleton className="h-11 sm:h-10 w-full" />
              </div>
              <Skeleton className="h-11 sm:h-10 w-full" />
            </div>
          </div>

          {/* Section 03/04: ID Card Dropzone */}
          <div className="border border-[#152A54] bg-[#060D1A] p-4 sm:p-5 space-y-3">
            <div className="flex justify-between items-center border-b border-[#152A54] pb-2">
              <Skeleton className="h-3.5 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="border-2 border-dashed border-[#152A54] bg-[#03060E] p-8 flex flex-col items-center justify-center space-y-3">
              <Skeleton className="size-12" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>

          {/* Submit Button Skeleton */}
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
