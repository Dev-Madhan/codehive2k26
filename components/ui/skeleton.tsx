import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-none bg-[#161616] border border-[#262626]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
