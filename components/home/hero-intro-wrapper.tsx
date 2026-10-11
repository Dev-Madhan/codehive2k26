"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { HeroCyberTitle } from "@/components/home/hero-cyber-title";
import { HeroActions } from "@/components/hero-actions";

export function HeroIntroWrapper() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReduced) {
        gsap.set(
          [".hero-pill-wipe", ".hero-tagline-mask", ".hero-actions-mask"],
          { clipPath: "none", opacity: 1, yPercent: 0, y: 0 }
        );
        return;
      }

      const tl = gsap.timeline({
        delay: 0.15,
      });

      // 1. Status Pill: High-precision horizontal unmask (laser scan style)
      tl.fromTo(
        ".hero-pill-wipe",
        {
          clipPath: "inset(0 100% 0 0)",
          opacity: 0,
        },
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          duration: 0.75,
          ease: "power3.inOut",
        },
        0.05
      );

      // 2. Tagline: Editorial masked slide-up (linear/modern typography style)
      tl.fromTo(
        ".hero-tagline-inner",
        {
          yPercent: 130,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
        },
        0.85
      );

      // 3. CTA Buttons: Unclipped smooth elevation
      tl.fromTo(
        ".hero-actions-inner",
        {
          y: 18,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
        },
        1.45
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col items-center justify-center gap-4 text-center pointer-events-auto"
    >
      {/* 1. Live Status Pill with Horizontal Laser Reveal */}
      <div className="hero-pill-wipe inline-flex items-center gap-2.5 px-3 py-1 border border-[#333333] bg-black/85 backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full bg-white opacity-75" />
          <span className="relative inline-flex h-2 w-2 bg-white" />
        </span>
        <span className="font-mono text-[11px] sm:text-xs font-bold tracking-wider text-white uppercase">
          23 &amp; 24 OCT 2026 // ENTRY FREE
        </span>
      </div>

      {/* 2. Hero Cyber Title & Masked Architectural Tagline */}
      <div className="w-full space-y-3.5 text-center flex flex-col items-center justify-center">
        <HeroCyberTitle />

        {/* Overflow-hidden architectural typography mask */}
        <div className="overflow-hidden py-0.5">
          <p className="hero-tagline-inner font-mono text-xs sm:text-sm md:text-base font-bold tracking-widest text-[#A3A3A3] uppercase text-center mx-auto will-change-transform">
            <span className="block sm:inline">IDEAS × CODE × IMPACT</span>
            <span className="hidden sm:inline mx-1.5 text-neutral-600">•</span>
            <span className="block sm:inline mt-1 sm:mt-0 text-white font-black">
              ₹20,000 PRIZE POOL
            </span>
          </p>
        </div>
      </div>

      {/* 3. Primary Call-to-Actions (Unclipped with full border & shadow clearance) */}
      <div className="pt-2 pb-2 flex justify-center items-center w-full">
        <div className="hero-actions-inner w-full flex justify-center items-center">
          <HeroActions />
        </div>
      </div>
    </div>
  );
}

export default HeroIntroWrapper;
