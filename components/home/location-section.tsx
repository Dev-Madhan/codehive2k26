"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MapControls,
} from "@/components/ui/map";
import {
  MapPinIcon,
  BusIcon,
  TrainIcon,
  CarIcon,
  NavigationIcon,
  ExternalLinkIcon,
  ClockIcon,
  BuildingIcon,
  DownloadIcon,
  AlertTriangleIcon,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Vel Tech Multi Tech Dr. Rangarajan Dr. Sakunthala Engineering College
// Exact coordinates from https://maps.app.goo.gl/D73DjNqvdQ7uoYXX9
const COLLEGE_LNG = 80.1041894;
const COLLEGE_LAT = 13.1893469;
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/D73DjNqvdQ7uoYXX9";

const transportModes = [
  {
    tag: "BY BUS",
    title: "PUBLIC & COLLEGE TRANSIT",
    desc: "MTC buses connect from CMBT Koyambedu, Broadway, and Poonamallee. College buses run on scheduled AC and Non-AC routes across Chennai.",
    mobileDesc: "MTC & college bus networks connect directly from CMBT, Broadway, and Poonamallee.",
    icon: BusIcon,
    detail: "MTC & College bus routes across Chennai",
    hasDownloads: true,
  },
  {
    tag: "BY TRAIN",
    title: "SUBURBAN RAILWAY",
    desc: "The nearest major suburban station is Avadi (Central–Arakkonam line). Share autos, buses, and cabs are readily available from Avadi station to campus.",
    mobileDesc: "Nearest: Avadi Railway Station (~15 mins via auto or bus).",
    icon: TrainIcon,
    detail: "~15 min from Avadi Railway Station",
    hasDownloads: false,
  },
  {
    tag: "BY CAR / CAB",
    title: "ROAD & CAB ACCESS",
    desc: "Easily reachable via the Chennai Outer Ring Road (ORR) and CTH Road. Ola, Uber, and Rapido drop directly at the main entrance with ample parking.",
    mobileDesc: "Direct drop-off at main campus entrance via Outer Ring Road (ORR) or CTH Road.",
    icon: CarIcon,
    detail: "On Avadi - Vel Tech Road via ORR / CTH",
    hasDownloads: false,
  },
];

const venueDetails = [
  {
    label: "// VENUE",
    value: "Vel Tech Multi Tech Dr. Rangarajan Dr. Sakunthala Engineering College",
    mobileValue: "Vel Tech Multi Tech Engg College",
  },
  {
    label: "// CAMPUS",
    value: "#60, Avadi - Vel Tech Road, Vel Nagar",
    hideOnMobile: true,
  },
  {
    label: "// EVENT HALL",
    value: "Palani Murugan Hall of Fame",
  },
  {
    label: "// ADDRESS",
    value: "Avadi, Chennai – 600 062, Tamil Nadu",
  },
  {
    label: "// DATES",
    value: "23 & 24 OCT 2026",
    hideOnMobile: true,
  },
  {
    label: "// REPORTING",
    value: "08:00 AM (Day 1)",
  },
];

export function LocationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTransport, setActiveTransport] = useState(0);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            ".loc-rule",
            ".loc-tag",
            ".loc-title",
            ".loc-desc",
            ".loc-card",
            ".loc-map",
            ".loc-venue",
            ".loc-stats",
          ],
          { opacity: 1, y: 0, scaleX: 1 }
        );
        return;
      }

      gsap.set(".loc-rule", { scaleX: 0, transformOrigin: "left center" });
      gsap.set([".loc-tag", ".loc-title", ".loc-desc"], { opacity: 0, y: 16 });
      gsap.set(".loc-card", { opacity: 0, y: 18 });
      gsap.set(".loc-map", { opacity: 0, y: 24 });
      gsap.set(".loc-venue", { opacity: 0, y: 12 });
      gsap.set(".loc-stats", { opacity: 0, y: 12 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          once: true,
        },
      });

      tl.to(".loc-rule", { scaleX: 1, duration: 0.5, ease: "power3.out" })
        .to(".loc-tag", { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, "-=0.3")
        .to(".loc-title", { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, "-=0.2")
        .to(".loc-desc", { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, "-=0.3")
        .to(".loc-map", { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, "-=0.2")
        .to(
          ".loc-card",
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power3.out" },
          "-=0.35"
        )
        .to(".loc-venue", { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, "-=0.2")
        .to(".loc-stats", { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, "-=0.2");
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="location"
      className="relative py-12 sm:py-24 lg:py-28 bg-black border-t border-[#262626] overflow-hidden"
    >
      {/* Subtle grid overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Top accent blur */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-b from-white/5 to-transparent blur-[80px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7 sm:space-y-12">

        {/* ── Section Header: Mobile Compact vs Desktop Full ── */}
        <div className="max-w-3xl space-y-2.5 sm:space-y-4">
          <div className="flex items-center gap-3">
            <div className="loc-rule h-px w-8 bg-white" />
            <span className="loc-tag font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-[#737373]">
              // VENUE &amp; NAVIGATION
            </span>
          </div>

          <h2 className="loc-title font-mono text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            FIND US HERE<span className="inline-block animate-pulse text-white">_</span>
          </h2>

          {/* Desktop Description */}
          <p className="loc-desc hidden md:block text-neutral-400 text-sm sm:text-base leading-relaxed font-sans">
            CodeHive 2K26 is hosted at{" "}
            <span className="text-white font-semibold">
              Vel Tech Multi Tech Dr. Rangarajan Dr. Sakunthala Engineering College
            </span>
            , Avadi, Chennai. Use the interactive map below or open in Google Maps to navigate.
          </p>

          {/* Mobile Description: Ultra-Concise Essentials */}
          <p className="loc-desc md:hidden text-neutral-400 text-xs leading-relaxed font-mono">
            Vel Tech Multi Tech, Avadi, Chennai // 23 &amp; 24 OCT 2026
          </p>
        </div>

        {/* ── Two-column layout: Map (3/5) + Venue Details (2/5) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6">

          {/* Map */}
          <div className="loc-map lg:col-span-3 relative border border-[#262626] bg-[#0A0A0A] overflow-hidden flex flex-col h-full min-h-[340px] sm:min-h-[460px]">
            {/* Corner accent brackets */}
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#333333] z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#333333] z-10 pointer-events-none" />

            {/* Map header bar */}
            <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 border-b border-[#262626] bg-[#080808] z-10 flex-none">
              <div className="flex items-center gap-2">
                <MapPinIcon className="size-3.5 text-white shrink-0" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#737373]">
                  // INTERACTIVE MAP
                </span>
              </div>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#737373] hover:text-white transition-colors duration-150 group py-0.5"
              >
                OPEN IN MAPS
                <ExternalLinkIcon className="size-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
              </a>
            </div>

            {/* The map */}
            <div className="relative flex-1 w-full min-h-[290px] xs:min-h-[320px] sm:min-h-[400px]">
              <Map
                theme="dark"
                className="h-full w-full"
                center={[COLLEGE_LNG, COLLEGE_LAT]}
                zoom={15.5}
                cooperativeGestures={true}
                attributionControl={false}
                styles={{
                  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
                  light: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
                }}
              >
                <MapMarker
                  longitude={COLLEGE_LNG}
                  latitude={COLLEGE_LAT}
                >
                  {/* Custom pulsing pin */}
                  <MarkerContent>
                    <div className="relative flex items-center justify-center cursor-pointer p-1">
                      {/* Pulse ring */}
                      <span className="absolute inline-flex h-9 w-9 rounded-full bg-white/20 animate-ping" />
                      {/* Icon container */}
                      <span className="relative inline-flex h-7 w-7 rounded-full bg-white/10 border border-white/50 backdrop-blur-sm items-center justify-center shadow-lg">
                        <MapPinIcon className="size-4 text-white fill-white/30" />
                      </span>
                    </div>
                  </MarkerContent>

                  {/* Popup on marker click */}
                  <MarkerPopup
                    closeButton
                    offset={35}
                    closeOnClick={false}
                    focusAfterOpen={false}
                    className="w-[calc(100vw-64px)] max-w-[230px]"
                  >
                    <div className="p-2 bg-[#0A0A0A] text-white">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#737373]">
                          CodeHive 2K26 Venue
                        </span>
                      </div>
                      <p className="font-mono font-bold text-xs uppercase tracking-wide text-white leading-tight">
                        Vel Tech Multi Tech
                      </p>
                      <p className="font-sans text-[11px] text-neutral-400 mt-0.5 leading-snug">
                        Dr. Rangarajan Dr. Sakunthala Engg College
                      </p>
                      <p className="font-mono text-[10px] text-neutral-500 mt-1">
                        Avadi, Chennai – 600 062
                      </p>
                      <a
                        href={GOOGLE_MAPS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white hover:text-neutral-300 underline underline-offset-2 touch-manipulation py-1"
                      >
                        <NavigationIcon className="size-2.5" />
                        Navigate Here
                      </a>
                    </div>
                  </MarkerPopup>
                </MapMarker>

                <MapControls
                  position="bottom-right"
                  showZoom={true}
                  showCompass={true}
                  showFullscreen={true}
                  className="m-2.5 sm:m-3"
                />
              </Map>
            </div>
          </div>

          {/* Venue Details */}
          <div className="loc-venue lg:col-span-2 flex flex-col border border-[#262626] bg-[#080808] h-full">
            {/* Header */}
            <div className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 border-b border-[#262626] flex-none">
              <BuildingIcon className="size-3.5 text-white shrink-0" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#737373]">
                // VENUE DETAILS
              </span>
            </div>

            {/* Detail rows: Mobile hides redundant lines, Desktop shows all */}
            <div className="flex-1 divide-y divide-[#1a1a1a]">
              {venueDetails.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "px-3.5 sm:px-4 py-2.5 sm:py-3 hover:bg-[#0c0c0c] transition-colors duration-150",
                    item.hideOnMobile && "hidden sm:block"
                  )}
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#737373] mb-1">
                    {item.label}
                  </p>
                  <p className="font-mono text-xs font-bold text-white leading-snug">
                    <span className="sm:hidden">{item.mobileValue || item.value}</span>
                    <span className="hidden sm:inline">{item.value}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Professional Accommodation Note */}
            <div className="p-3 sm:p-3.5 border-t border-[#262626] bg-[#0c0c0c] flex items-start gap-2.5 flex-none">
              <AlertTriangleIcon className="size-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white">
                    NO ACCOMMODATION PROVIDED
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.2 bg-amber-400/10 border border-amber-400/30 text-amber-400 font-mono text-[9px] uppercase tracking-widest">
                    SELF-ARRANGED
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-400 font-sans leading-relaxed">
                  <span className="md:hidden">Participants must arrange their own lodging near Avadi or Chennai.</span>
                  <span className="hidden md:inline">Accommodation is not provided for participants. Outstation teams and attendees are requested to arrange their own stay near Avadi or Chennai city.</span>
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="p-3.5 sm:p-4 border-t border-[#262626] bg-[#060606] flex-none">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full inline-flex items-center justify-center gap-2 min-h-[46px] px-4 py-2.5 border border-[#333333] bg-[#0A0A0A] hover:border-white hover:bg-white hover:text-black active:scale-[0.98] active:bg-white active:text-black transition-all duration-150 font-mono text-[11px] uppercase tracking-widest text-white touch-manipulation select-none"
              >
                <NavigationIcon className="size-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
                GET DIRECTIONS
              </a>
            </div>
          </div>
        </div>

        {/* ── Transit Modes: Mobile Essentials vs Desktop Full Cards ── */}
        <div className="space-y-3">
          {/* Mobile Tab Switcher */}
          <div className="flex md:hidden border border-[#262626] bg-[#080808] p-1 gap-1">
            {transportModes.map((item, idx) => (
              <button
                key={item.tag}
                type="button"
                onClick={() => setActiveTransport(idx)}
                className={cn(
                  "flex-1 py-2 px-1 font-mono text-[10px] tracking-wider uppercase transition-all duration-150 text-center select-none active:scale-[0.98] touch-manipulation",
                  activeTransport === idx
                    ? "bg-white text-black font-black border border-white"
                    : "text-[#737373] hover:text-white bg-transparent"
                )}
              >
                {item.tag}
              </button>
            ))}
          </div>

          {/* Mobile: Ultra-Clean Active Transport Essentials Card */}
          <div className="block md:hidden">
            {(() => {
              const item = transportModes[activeTransport];
              const Icon = item.icon;
              return (
                <div className="loc-card relative p-4 border border-[#262626] bg-[#0A0A0A] backdrop-blur-sm transition-colors duration-150 flex flex-col justify-between">
                  {/* Corner accents */}
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#333333]" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#333333]" />

                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="inline-flex p-1.5 bg-[#141414] border border-[#262626]">
                        <Icon className="size-3.5 text-white" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#737373]">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="font-mono text-sm font-black uppercase text-white tracking-tight mb-1">
                      {item.title}
                    </h3>

                    {/* Mobile: Short Tactical Route Info Only */}
                    <p className="text-xs text-neutral-300 leading-snug font-sans">
                      {item.mobileDesc}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2.5 mt-2.5 border-t border-[#1e1e1e]">
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="size-3 text-[#737373] shrink-0" />
                      <span className="font-mono text-[10px] text-[#737373] leading-tight">
                        {item.detail}
                      </span>
                    </div>

                    {item.hasDownloads && (
                      <div className="grid grid-cols-2 gap-2 pt-0.5">
                        <a
                          href="/routes/AC%20Bus%20Route%20Details.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-2.5 py-1.5 text-[10px] font-mono tracking-wider uppercase border border-[#2a2a2a] bg-[#121212] hover:border-white hover:text-white active:scale-[0.98] text-[#999999] transition-all touch-manipulation"
                        >
                          <DownloadIcon className="size-3 shrink-0" />
                          AC Routes
                        </a>
                        <a
                          href="/routes/Non%20Ac%20Bus%20Route%20Details.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-2.5 py-1.5 text-[10px] font-mono tracking-wider uppercase border border-[#2a2a2a] bg-[#121212] hover:border-white hover:text-white active:scale-[0.98] text-[#999999] transition-all touch-manipulation"
                        >
                          <DownloadIcon className="size-3 shrink-0" />
                          Non-AC
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Desktop: Full 3-column Grid (>= md) */}
          <div className="hidden md:grid md:grid-cols-3 gap-5 sm:gap-6">
            {transportModes.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="loc-card relative group p-6 border border-[#262626] bg-[#0A0A0A] backdrop-blur-sm hover:border-[#404040] hover:bg-[#0D0D0D] active:border-white transition-colors duration-150 flex flex-col justify-between"
                >
                  {/* Corner accent brackets */}
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#333333] group-hover:border-white transition-colors duration-200" />
                  <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#333333] group-hover:border-white transition-colors duration-200" />

                  <div>
                    {/* Card Top */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="inline-flex p-2 bg-[#141414] border border-[#262626] group-hover:border-[#383838] transition-colors">
                        <Icon className="size-4 text-white" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#737373]">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="font-mono text-lg font-black uppercase text-white tracking-tight mb-2 group-hover:text-neutral-100 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans mb-4">
                      {item.desc}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#1e1e1e]">
                    {/* Detail pill */}
                    <div className="flex items-center gap-2">
                      <ClockIcon className="size-3 text-[#737373] shrink-0" />
                      <span className="font-mono text-[10px] text-[#737373] leading-tight">
                        {item.detail}
                      </span>
                    </div>

                    {/* PDF Route Downloads for Bus */}
                    {item.hasDownloads && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <a
                          href="/routes/AC%20Bus%20Route%20Details.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-mono tracking-wider uppercase border border-[#2a2a2a] bg-[#121212] hover:border-white hover:text-white text-[#999999] transition-colors"
                        >
                          <DownloadIcon className="size-2.5" />
                          AC Routes
                        </a>
                        <a
                          href="/routes/Non%20Ac%20Bus%20Route%20Details.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-mono tracking-wider uppercase border border-[#2a2a2a] bg-[#121212] hover:border-white hover:text-white text-[#999999] transition-colors"
                        >
                          <DownloadIcon className="size-2.5" />
                          Non-AC Routes
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Bottom status bar: Responsive 2-col on Mobile (Key items), 4-col on Desktop ── */}
        <div className="loc-stats grid grid-cols-2 md:grid-cols-4 border border-[#262626] bg-[#080808] divide-x divide-[#262626]">
          {/* Desktop-only: CAMPUS */}
          <div className="hidden md:flex flex-col items-center justify-center p-3.5 sm:p-5 hover:bg-[#0c0c0c] transition-colors text-center">
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#737373] mb-1">
              // CAMPUS
            </span>
            <span className="font-mono text-[11px] sm:text-xs md:text-sm font-bold text-white tracking-wide leading-tight">
              VEL TECH MULTI TECH
            </span>
          </div>

          {/* Shown on Mobile & Desktop: LOCATION */}
          <div className="flex flex-col items-center justify-center p-3 sm:p-5 hover:bg-[#0c0c0c] transition-colors text-center">
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#737373] mb-1">
              // LOCATION
            </span>
            <span className="font-mono text-[11px] sm:text-xs md:text-sm font-bold text-white tracking-wide leading-tight">
              AVADI, CHENNAI
            </span>
          </div>

          {/* Shown on Mobile & Desktop: NEAREST STATION */}
          <div className="flex flex-col items-center justify-center p-3 sm:p-5 hover:bg-[#0c0c0c] transition-colors text-center">
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#737373] mb-1">
              // NEAREST STATION
            </span>
            <span className="font-mono text-[11px] sm:text-xs md:text-sm font-bold text-white tracking-wide leading-tight">
              AVADI (~6.5 KM)
            </span>
          </div>

          {/* Desktop-only: REGISTRATION */}
          <div className="hidden md:flex flex-col items-center justify-center p-3.5 sm:p-5 hover:bg-[#0c0c0c] transition-colors text-center">
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#737373] mb-1">
              // REGISTRATION
            </span>
            <span className="font-mono text-[11px] sm:text-xs md:text-sm font-bold text-white tracking-wide leading-tight text-emerald-400">
              FREE ENTRY
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
