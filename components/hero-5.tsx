"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/ui/grid-pattern";
import { TextEffect } from "@/components/ui/text-effect";
import { Button } from "@/components/ui/button";
import {
  RocketIcon,
  ArrowUpRightIcon,
  ChevronRightIcon,
  SparklesIcon,
  TrophyIcon,
  ClockIcon,
  UsersIcon,
  QrCodeIcon,
} from "lucide-react";

const HERO_GRADIENT = `radial-gradient(77% 116% at 37% 67%, #EEA5BA, rgba(238, 165, 186, 0) 50%),
  radial-gradient(56% 84% at 34% 56%, #3A8BFD, rgba(58, 139, 253, 0) 50%),
  radial-gradient(85% 127% at 100% 100%, #E4C795, rgba(228, 199, 149, 0) 50%),
  radial-gradient(82% 122% at 3% 29%, #855AFC, rgba(133, 90, 252, 0) 50%),
  radial-gradient(90% 136% at 52% 100%, #FD3A4E, rgba(253, 58, 78, 0) 50%),
  radial-gradient(102% 143% at 92% 7%, #72FE7D, rgba(114, 254, 125, 0) 50%)`;

export function Hero5() {
  return (
    <section className="relative overflow-hidden">
      {/* Vertical Masked Boundary Lines (Efferd Signature) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 mx-auto hidden min-h-screen w-full max-w-5xl md:block pointer-events-none"
      >
        <div className="mask-[linear-gradient(to_bottom,transparent,black,transparent)] absolute inset-y-0 left-0 z-10 h-full w-px bg-foreground/20" />
        <div className="mask-[linear-gradient(to_bottom,transparent,black,transparent)] absolute inset-y-0 right-0 z-10 h-full w-px bg-foreground/20" />
      </div>

      {/* Vibrant Ambient Radial Gradient Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 size-full overflow-hidden pointer-events-none"
      >
        <div className="transform-[translate3d(0,0,0)] absolute -inset-x-10 bottom-0 h-[65%] opacity-40 blur-[110px] dark:opacity-25">
          <div
            className="mask-[radial-gradient(closest-side,black_100%,transparent_100%)] size-full -scale-y-100"
            style={{ backgroundImage: HERO_GRADIENT }}
          />
        </div>
      </div>

      {/* Dynamic Grid Pattern */}
      <GridPattern
        className={cn(
          "fill-none stroke-foreground/10",
          "mask-[linear-gradient(to_bottom,transparent,var(--background),transparent)]"
        )}
        height={60}
        width={60}
        x={-8}
      />

      <div className="relative mx-auto w-full max-w-5xl px-4 pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 z-0 h-full w-full",
            "bg-[radial-gradient(ellipse_at_center,theme(--color-background/.8)_25%,transparent,transparent)]"
          )}
        />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center gap-6 text-center">
          {/* Institutional Banner */}
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 px-3.5 py-1 rounded-full border border-border/60 bg-card/60 backdrop-blur-md shadow-xs">
            <span className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Vel Tech Multi Tech Dr. Rangarajan Dr. Sakunthala Engineering College
            </span>
            <span className="text-blue-500 text-xs hidden sm:inline">•</span>
            <span className="font-mono text-[10px] text-blue-500 font-semibold uppercase">
              Autonomous • NBA • NAAC &apos;A&apos;
            </span>
          </div>

          {/* Announcement Capsule */}
          <Link
            href="/events"
            className={cn(
              "group flex w-fit items-center gap-2 rounded-full border bg-card/90 px-3.5 py-1.5 shadow-xs outline outline-border/60 outline-offset-2 active:scale-98 transition-all hover:border-blue-500/50"
            )}
          >
            <RocketIcon className="size-3.5 text-blue-500" />
            <span className="text-xs font-medium font-mono text-foreground">
              NATIONAL LEVEL HACKATHON // 23 &amp; 24 OCT 2026
            </span>
            <span className="block h-3.5 border-l border-border" />
            <span className="font-mono text-[11px] text-emerald-500 font-bold uppercase">
              ENTRY FREE
            </span>
            <ArrowUpRightIcon className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          {/* Main Headline */}
          <div className="space-y-3">
            <h1 className="flex justify-center">
              <Image
                src="/code%20hive%20logo.svg"
                alt="CodeHive 2K26"
                width={1825}
                height={416}
                priority
                className="h-auto w-full max-w-[min(82vw,36rem)]"
              />
            </h1>

            <p className="font-mono text-xs sm:text-sm md:text-base font-bold tracking-widest text-sky-500 uppercase">
              IDEAS × CODE × IMPACT
            </p>
          </div>

          {/* Subtitle */}
          <TextEffect
            as="p"
            className={cn(
              "mx-auto max-w-xl text-center text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed font-sans"
            )}
            delay={0.25}
            per="line"
            preset="fade-in-blur"
            speedSegment={0.3}
          >
            A 2-day national hackathon featuring TECH FORGE and AGENT VIBE. Compete for the ₹20,000 Prize Pool at Palani Murugan Hall of Fame.
          </TextEffect>

          {/* Action CTAs */}
          <div className="flex flex-row flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/auth">
              <Button
                className="rounded-full shadow-lg shadow-blue-500/25 active:scale-98 cursor-pointer px-6 h-11"
                size="lg"
              >
                <span>Register Now</span>
                <ChevronRightIcon className="size-4 ml-1" />
              </Button>
            </Link>

            <Link href="/events">
              <Button
                className="rounded-full border bg-card/80 backdrop-blur-md active:scale-98 cursor-pointer px-6 h-11"
                size="lg"
                variant="outline"
              >
                <SparklesIcon className="size-4 mr-1 text-blue-400" />
                <span>Explore Tracks</span>
              </Button>
            </Link>
          </div>

          {/* 4-Item Telemetry Highlights Grid */}
          <div className="w-full pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="p-3.5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xs hover:border-blue-500/50 transition-all group">
              <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                <TrophyIcon className="size-4" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  PRIZE POOL
                </span>
              </div>
              <p className="text-sm sm:text-base font-mono font-bold text-foreground">
                ₹20,000 TOTAL
              </p>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                ₹5K / ₹3K / ₹2K Per Track
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xs hover:border-blue-500/50 transition-all group">
              <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                <ClockIcon className="size-4" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  SCHEDULE
                </span>
              </div>
              <p className="text-sm sm:text-base font-mono font-bold text-foreground">
                23 &amp; 24 OCT
              </p>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                8:30 AM – 3:30 PM Daily
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xs hover:border-emerald-500/50 transition-all group">
              <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                <UsersIcon className="size-4" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  REGISTRATION
                </span>
              </div>
              <p className="text-sm sm:text-base font-mono font-bold text-emerald-500">
                100% FREE
              </p>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                Certificates For All
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xs hover:border-blue-500/50 transition-all group">
              <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                <QrCodeIcon className="size-4" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  VENUE
                </span>
              </div>
              <p className="text-sm sm:text-base font-mono font-bold text-foreground truncate">
                PALANI MURUGAN
              </p>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5 truncate">
                Hall of Fame, Vel Tech
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero5;
