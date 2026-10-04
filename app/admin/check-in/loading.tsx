import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCheckInLoading() {
  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="border-b border-border pb-4 space-y-2">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-3.5 w-full max-w-xl" />
      </div>

      {/* Centered Pass Verifier Card Skeleton */}
      <div className="py-4">
        <div className="max-w-xl mx-auto rounded-none border border-border bg-card p-5 sm:p-7 space-y-6">
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-border pb-5 text-center">
            <Skeleton className="size-12" />
            <Skeleton className="h-6 w-60" />
            <Skeleton className="h-3.5 w-80 max-w-md" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
