"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { ArrowDownIcon } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const faqs = [
  {
    q: "Who is eligible to participate in CodeHive 2K26 2.0, and what is the team size?",
    mobileQ: "Who can participate & team size?",
    a: "CodeHive 2K26 2.0 is open to all undergraduate and postgraduate college / engineering students across India.\n\n• Team Size: 1 to 3 members per team (Solo participants and teams of 2 or 3 are welcome).\n• Inter-department and inter-college team compositions are permitted.",
    mobileA: "Open to all college & engineering students across India. Teams of 1 to 3 members (Solo or teams of 2–3 welcome).",
    category: "ELIGIBILITY",
  },
  {
    q: "Is there any registration fee to participate in the hackathon?",
    mobileQ: "Is there any registration fee?",
    a: "No. Entry is 100% FREE with zero registration fees.\n\nEvery registered attendee who participates in the hackathon will receive an official physical and digital Certificate of Participation issued by the Department of CSBS, Vel Tech Multi Tech.",
    mobileA: "100% FREE entry. Verified certificates of participation awarded to all attendees.",
    category: "ADMISSION",
  },
  {
    q: "What are the two competition tracks, and how are the 4 rounds structured?",
    mobileQ: "What are the two competition tracks?",
    a: "CodeHive 2K26 2.0 features two flagship 4-round technical tracks:\n\n• EVENT 1: TECH FORGE — 'Analyze, Build, Adapt & Defend'. Solve a real-world engineering challenge, build your application, and face a surprise technical challenge that tests your coding, problem-solving, and rapid adaptation under pressure. (One Problem. Four Rounds. One Champion.)\n\n• EVENT 2: AGENT VIBE — 'Imagine, Build, Adapt & Deploy'. Design and develop autonomous, intelligent AI agents to solve complex problems, then navigate surprise twists leveraging LLMs, prompt engineering, agentic workflows, APIs, and modern generative AI tools. (One Idea. Four Rounds. One AI Champion.)",
    mobileA: "• TECH FORGE: Solve real-world problem statements with a surprise twist.\n• AGENT VIBE: Build intelligent AI agents using LLMs & APIs.\n4 progressive rounds per track.",
    category: "TRACKS",
  },
  {
    q: "When and where is the on-site hackathon conducted?",
    mobileQ: "When and where is the hackathon?",
    a: "CodeHive 2K26 2.0 is a 2-day on-site event conducted on 23rd & 24th October 2026.\n\n• Daily Timings: 8:30 AM – 3:30 PM daily\n• Venue: Palani Murugan Hall of Fame, Room M/K 301, Vel Tech Multi Tech Dr. Rangarajan Dr. Sakunthala Engineering College (Autonomous), Avadi, Chennai.",
    mobileA: "23 & 24 Oct 2026 • 8:30 AM – 3:30 PM daily.\nPalani Murugan Hall of Fame (Room M/K 301), Vel Tech Multi Tech, Avadi, Chennai.",
    category: "SCHEDULE & VENUE",
  },
  {
    q: "What is the prize pool distribution and award recognition?",
    mobileQ: "What is the prize pool distribution?",
    a: "The total prize pool is ₹20,000, distributed equally across both tracks (₹10,000 per track):\n\n• 1st Prize: ₹5,000 cash award + Championship Trophy + Certificate of Excellence\n• 2nd Prize: ₹3,000 cash award + Runner-Up Trophy + Certificate of Excellence\n• 3rd Prize: ₹2,000 cash award + 2nd Runner-Up Trophy + Certificate of Excellence\n\nAll participating teams receive verified official participation certificates.",
    mobileA: "₹20,000 total pool (₹10,000 per track):\n• 1st: ₹5,000 • 2nd: ₹3,000 • 3rd: ₹2,000\nIncludes trophies & certificates for all.",
    category: "AWARDS",
  },
  {
    q: "Who is evaluating the projects, and what are the judging criteria?",
    mobileQ: "Who is evaluating the projects?",
    a: "Submissions will be evaluated live across 4 progressive rounds by senior software engineers from Sri Vensy Technologies Pvt Ltd, Tirupati (our Title Industry Partner) alongside academic experts from the Department of CSBS.\n\nEvaluation criteria include technical innovation, code architecture, problem-solving depth, adaptation to surprise round twists, and final stage defense.",
    mobileA: "Live 4-round evaluation by senior engineers from Sri Vensy Technologies Pvt Ltd, Tirupati & CSBS faculty.",
    category: "EVALUATION",
  },
  {
    q: "What should participants bring to the venue on event days?",
    mobileQ: "What should participants bring?",
    a: "Every participant must bring:\n\n• Personal laptop and charger (power extension cords recommended).\n• Valid College ID card for campus gate pass and attendance check-in.\n\nHigh-speed campus Wi-Fi, workspace desks, power supply outlets, and lab access are provided at the Palani Murugan Hall of Fame (M/K 301).",
    mobileA: "Bring personal laptop, charger & College ID card. Campus Wi-Fi & power workstations are provided.",
    category: "REQUIREMENTS",
  },
  {
    q: "Who should I contact for event queries, coordination, or travel support?",
    mobileQ: "Who should I contact for queries?",
    a: "For event queries, registration assistance, or venue directions, you can directly reach out to our student coordinators:\n\n• Jagadeesh N: +91 81100 57344\n• Shanmugapriyan S: +91 90430 24062\n• Official Instagram: @codehive_2k26\n\nHosted by the Department of CSBS at Vel Tech Multi Tech, Avadi, Chennai.",
    mobileA: "• Jagadeesh N: +91 81100 57344\n• Shanmugapriyan S: +91 90430 24062\n• Instagram: @codehive_2k26",
    category: "CONTACT",
  },
];

interface FaqItemProps {
  faq: (typeof faqs)[number];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqItem({ faq, index, isOpen, onToggle }: FaqItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Handle initial render without jarring animations
      if (isFirstRender.current) {
        isFirstRender.current = false;
        if (!isOpen) {
          gsap.set(contentRef.current, { height: 0, opacity: 0 });
          gsap.set(innerRef.current, { y: -8, opacity: 0 });
          gsap.set(arrowRef.current, { rotation: 0 });
          return;
        }
      }

      if (prefersReducedMotion) {
        if (isOpen) {
          gsap.set(contentRef.current, { height: "auto", opacity: 1 });
          gsap.set(innerRef.current, { y: 0, opacity: 1 });
          gsap.set(arrowRef.current, { rotation: 180 });
        } else {
          gsap.set(contentRef.current, { height: 0, opacity: 0 });
          gsap.set(innerRef.current, { y: -8, opacity: 0 });
          gsap.set(arrowRef.current, { rotation: 0 });
        }
        return;
      }

      const content = contentRef.current;
      const inner = innerRef.current;
      const arrow = arrowRef.current;

      if (!content || !inner || !arrow) return;

      if (isOpen) {
        // 1. Mechanical snap rotation on the directional arrow
        gsap.to(arrow, {
          rotation: 180,
          duration: 0.45,
          ease: "back.out(2)",
          overwrite: "auto",
        });

        // 2. Measure actual target height & animate height smoothly
        gsap.killTweensOf([content, inner]);
        const targetHeight = inner.offsetHeight || inner.scrollHeight;

        gsap.fromTo(
          content,
          { height: content.offsetHeight },
          {
            height: targetHeight,
            opacity: 1,
            duration: 0.45,
            ease: "power3.out",
            overwrite: "auto",
            onComplete: () => {
              if (isOpen) {
                gsap.set(content, { height: "auto" });
              }
            },
          }
        );

        // 3. Subtle vertical drift & opacity fade on answer content
        gsap.fromTo(
          inner,
          { y: -10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            delay: 0.05,
            ease: "power2.out",
            overwrite: "auto",
          }
        );
      } else {
        // 1. Rotate arrow back smoothly to downward orientation
        gsap.to(arrow, {
          rotation: 0,
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });

        // 2. Collapse height gracefully with power3 easing
        gsap.killTweensOf([content, inner]);

        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.35,
          ease: "power3.inOut",
          overwrite: "auto",
        });

        gsap.to(inner, {
          y: -8,
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
          overwrite: "auto",
        });
      }
    },
    { dependencies: [isOpen] }
  );

  const indexString = String(index + 1).padStart(2, "0");

  return (
    <div
      className={cn(
        "faq-row border-b border-[#262626] transition-colors duration-200",
        isOpen ? "bg-white/[0.02]" : "hover:bg-white/[0.01]"
      )}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="w-full py-5 sm:py-7 flex items-start sm:items-center justify-between gap-3 sm:gap-8 text-left cursor-pointer group select-none"
      >
        {/* Col 1: Monospace Index */}
        <div
          className={cn(
            "w-8 sm:w-16 md:w-20 shrink-0 font-mono text-xs sm:text-sm md:text-base transition-colors duration-200 pt-0.5 sm:pt-0",
            isOpen ? "text-white font-bold" : "text-[#737373] group-hover:text-neutral-300"
          )}
        >
          {indexString}
        </div>

        {/* Col 2: Question Title */}
        <div className="flex-1 min-w-0 pr-2">
          <h3
            className={cn(
              "font-sans text-sm sm:text-lg md:text-xl tracking-tight transition-colors duration-200",
              isOpen
                ? "text-white font-semibold"
                : "text-neutral-200 group-hover:text-white font-normal sm:font-medium"
            )}
          >
            {/* Mobile concise question */}
            <span className="sm:hidden">{faq.mobileQ || faq.q}</span>
            {/* Desktop comprehensive question */}
            <span className="hidden sm:inline">{faq.q}</span>
          </h3>
        </div>

        {/* Col 3: Reference Directional Arrow with GSAP Rotation */}
        <div
          ref={arrowRef}
          className={cn(
            "shrink-0 flex items-center justify-center size-7 sm:size-8 transition-colors duration-200",
            isOpen ? "text-white" : "text-neutral-400 group-hover:text-white"
          )}
        >
          <ArrowDownIcon className="size-4 sm:size-5 stroke-[1.75]" />
        </div>
      </button>

      {/* Answer Container: GSAP Animated Height */}
      <div
        ref={contentRef}
        style={{ height: 0, opacity: 0, overflow: "hidden" }}
      >
        <div ref={innerRef} className="pl-8 sm:pl-16 md:pl-20 pr-4 sm:pr-12 pb-5 sm:pb-8">
          <div className="pt-2 sm:pt-3 border-t border-[#1C1C1C]">
            {/* Desktop detailed answer (100% untouched) */}
            <p className="hidden sm:block font-sans text-sm md:text-base text-neutral-400 leading-relaxed max-w-3xl whitespace-pre-line">
              <span className="font-mono text-neutral-200 mr-2 font-bold select-none">&gt;</span>
              {faq.a}
            </p>
            {/* Mobile minimalistic answer */}
            <p className="sm:hidden font-sans text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
              <span className="font-mono text-neutral-200 mr-1.5 font-bold select-none">&gt;</span>
              {faq.mobileA || faq.a}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  // Entrance Stagger Animation on Scroll
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      });

      tl.from(".faq-header-meta", {
        opacity: 0,
        y: 14,
        duration: 0.6,
        ease: "power3.out",
      })
        .from(
          ".faq-title",
          {
            opacity: 0,
            y: 24,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .from(
          ".faq-row",
          {
            opacity: 0,
            y: 16,
            stagger: 0.05,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="faq"
      className="relative py-20 sm:py-32 bg-black border-t border-[#262626] overflow-hidden"
    >
      {/* Background Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Swiss Typographic Giant + Terminal ASCII Metadata */}
        <div className="mb-12 sm:mb-20">
          {/* Metadata Ribbon */}
          <div className="faq-header-meta flex items-center justify-between gap-4 mb-4 sm:mb-6 font-mono text-[10px] sm:text-[11px] text-[#737373]">
            <div className="flex items-center gap-2">
              <span className="size-1.5 bg-white rounded-none animate-pulse" />
              <span className="uppercase tracking-widest text-neutral-400">
                // SYSTEM QUERY ARCHIVE
              </span>
            </div>
            <span className="uppercase tracking-widest hidden sm:inline-block">
              [ 08 ENTRIES LOADED ]
            </span>
          </div>

          {/* Grand Swiss Title */}
          <h2 className="faq-title font-mono text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-white leading-none">
            FAQ<span className="text-[#404040]">_</span>
          </h2>
        </div>

        {/* Swiss Grid Accordion List with Continuous Hairline Rules */}
        <div className="border-t border-[#262626]">
          {faqs.map((faq, i) => (
            <FaqItem
              key={faq.q}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
