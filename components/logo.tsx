"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import logoImg from "@/public/images/logo.png";

export type LogoSize = "sm" | "md" | "lg" | "xl" | "custom";
export type LogoContext = "header" | "mobile-nav" | "sidebar" | "footer";

export interface LogoProps {
  /** Visual size preset. "custom" delegates sizing to className/imageClassName */
  size?: LogoSize;
  /** Route to navigate. Pass `false` or `null` to render as non-interactive container */
  href?: string | false | null;
  /**
   * true  -> fetchpriority="high" + preload injection (for above-the-fold header)
   * false -> loading="lazy" + decoding="async" (for below-fold footer / hidden menus)
   */
  priority?: boolean;
  /** Semantic context — drives optimal responsive `sizes` attribute automatically */
  context?: LogoContext;
  /** Custom sizes attribute override */
  sizes?: string;
  /** Custom class for the wrapper (Link or div) */
  className?: string;
  /** Custom class for the Image element */
  imageClassName?: string;
  /** Accessible alt text for screen readers */
  alt?: string;
  /** Optional click callback (e.g. to close mobile navigation) */
  onClick?: () => void;
}

/* --- Size presets --- */
const SIZE_CLASSES: Record<Exclude<LogoSize, "custom">, string> = {
  sm: "h-7 w-auto",   // 28px — mobile-nav, compact headers
  md: "h-8 w-auto",   // 32px — standard desktop & mobile header
  lg: "h-9 w-auto",   // 36px — sidebar, auth cards
  xl: "h-11 w-auto",  // 44px — footer brand, hero showcase
};

/* --- Context-driven responsive sizes attribute --- */
const SIZES_ATTR: Record<LogoContext, string> = {
  header: "(max-width: 375px) 100px, (max-width: 640px) 115px, (max-width: 1024px) 130px, 145px",
  "mobile-nav": "(max-width: 640px) 100px, 130px",
  sidebar: "(max-width: 768px) 110px, 130px",
  footer: "(max-width: 640px) 100px, (max-width: 1024px) 120px, 140px",
};

export function Logo({
  size = "md",
  href = "/",
  priority = false,
  context = "header",
  sizes,
  className,
  imageClassName,
  alt = "CodeHive 2K26",
  onClick,
}: LogoProps) {
  const sizeClass = size === "custom" ? "" : SIZE_CLASSES[size];

  const image = (
    <Image
      src={logoImg}
      alt={alt}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      decoding={priority ? "sync" : "async"}
      quality={90}
      sizes={sizes || SIZES_ATTR[context]}
      className={cn(
        "object-contain select-none",
        // Mobile constraint: prevent horizontal overflow on ultra-compact devices
        "max-w-[110px] sm:max-w-none",
        // Smooth opacity transition adhering to motion preferences
        "motion-safe:transition-opacity motion-safe:duration-150",
        sizeClass,
        imageClassName
      )}
    />
  );

  // Non-interactive container variant
  if (href === false || href === null) {
    return (
      <div
        className={cn("inline-flex items-center shrink-0 will-change-transform", className)}
        onClick={onClick}
      >
        {image}
      </div>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label={alt}
      className={cn(
        "inline-flex items-center shrink-0",
        // Mobile tap target safety: guarantees 44px minimum touch target (WCAG 2.5.5)
        "min-h-[44px]",
        // GPU layer promotion hint
        "will-change-transform",
        // Visual touch feedback
        "hover:opacity-85 active:opacity-70",
        // Keyboard focus accessibility
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 rounded-sm",
        className
      )}
    >
      {image}
    </Link>
  );
}
