import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicRootLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 font-mono">
        <div className="border border-border bg-card p-6 sm:p-10 space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 sm:h-12 w-2/3 max-w-xl" />
          <Skeleton className="h-16 w-full max-w-3xl" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-11 w-36" />
            <Skeleton className="h-11 w-36" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border border-border bg-card p-6 space-y-3"
            >
              <Skeleton className="size-10" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
