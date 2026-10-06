import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";

export default function RegistrationLoading() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="inline-flex justify-center">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="h-10 sm:h-12 w-3/4 max-w-md" />
        </div>
        <div className="space-y-2 max-w-lg mx-auto">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5 mx-auto" />
        </div>
        <div className="pt-2 flex justify-center">
          <Skeleton className="h-11 w-52" />
        </div>
      </div>
    </div>
  );
}
