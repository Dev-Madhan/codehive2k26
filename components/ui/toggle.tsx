"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-none text-xs font-mono uppercase tracking-wider transition-colors outline-none focus-visible:border-white focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50 border cursor-pointer aria-pressed:bg-white aria-pressed:text-black aria-pressed:border-white data-pressed:bg-white data-pressed:text-black data-pressed:border-white data-[state=on]:bg-white data-[state=on]:text-black data-[state=on]:border-white",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-transparent text-neutral-400 hover:bg-[#161616] hover:text-white",
        outline:
          "border-[#262626] bg-[#080808] text-neutral-400 hover:bg-[#161616] hover:text-white",
      },
      size: {
        default: "h-8 px-3",
        sm: "h-7 px-2.5 text-[11px]",
        lg: "h-9 px-4 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
