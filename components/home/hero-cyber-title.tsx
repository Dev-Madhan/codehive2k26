"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import NumberFlow from "@number-flow/react";
import { animate, useMotionValue } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CODEHIVE_CHARS = ["C", "O", "D", "E", "H", "I", "V", "E"];

function getRandomLetter(): string {
  return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
}

export function HeroCyberTitle({ className }: { className?: string }) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const codehiveSpanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const kSpanRef = useRef<HTMLSpanElement | null>(null);

  // Fluid rolling states for the numbers (identical to the Prize section NumberFlow engine)
  const [yearFirst, setYearFirst] = useState(2);
  const [yearLast, setYearLast] = useState(26);
  const [versionNum, setVersionNum] = useState(2.0);

  // Framer motion values for smooth continuous number interpolation
  const countYearFirst = useMotionValue(0);
  const countYearLast = useMotionValue(0);
  const countVersion = useMotionValue(0.0);

  const isInitialComplete = useRef(false);
  const isHoverActive = useRef({ codehive: false, year: false, version: false });

  // Function to execute the fluid number roll animation
  const runNumberRolls = useCallback(
    (delay = 0.35) => {
      // Roll the "2" in 2K26 (rolls 0 -> 2 over ~1.8s)
      countYearFirst.set(0);
      setYearFirst(0);
      const timer1 = setTimeout(() => {
        animate(countYearFirst, 2, {
          duration: 1.8,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (latest) => setYearFirst(Math.round(latest)),
        });
      }, delay * 1000);

      // Roll the "26" in 2K26 (rolls through 00 -> 26 with fluid digit reels over ~2.5s)
      countYearLast.set(0);
      setYearLast(0);
      const timer2 = setTimeout(() => {
        animate(countYearLast, 26, {
          duration: 2.5,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (latest) => setYearLast(Math.round(latest)),
        });
      }, (delay + 0.15) * 1000);

      // Roll the "2.0" (rolls from 0.0 -> 2.0 with fluid decimal digit roll over ~2.75s)
      countVersion.set(0.0);
      setVersionNum(0.0);
      const timer3 = setTimeout(() => {
        animate(countVersion, 2.0, {
          duration: 2.75,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (latest) => setVersionNum(Number(latest.toFixed(1))),
        });
      }, (delay + 0.2) * 1000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    },
    [countYearFirst, countYearLast, countVersion]
  );

  // Master Orchestration: Blends GSAP Alphabet Cyber Scramble with Fluid Number Rolls
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReduced) {
        setYearFirst(2);
        setYearLast(26);
        setVersionNum(2.0);
        CODEHIVE_CHARS.forEach((c, idx) => {
          const el = codehiveSpanRefs.current[idx];
          if (el) el.textContent = c;
        });
        if (kSpanRef.current) kSpanRef.current.textContent = "K";
        isInitialComplete.current = true;
        return;
      }

      // 1. Kick off the fluid NumberFlow rolls (calibrated for ~3.3s total time)
      const cleanTimers = runNumberRolls(0.35);

      // 2. Initialize alphabet spans with starting random Latin glyphs
      CODEHIVE_CHARS.forEach((_, idx) => {
        const el = codehiveSpanRefs.current[idx];
        if (el) el.textContent = getRandomLetter();
      });
      if (kSpanRef.current) kSpanRef.current.textContent = getRandomLetter();

      // 3. Staggered GSAP Cyber Decryption Wave for the Alphabet letters (~3.2s total span)
      const BASE_DELAY = 0.45;
      const STAGGER = 0.25; // Smooth 0.25s stagger between each letter's lock-in

      const codehiveTokens = CODEHIVE_CHARS.map((char, i) => ({
        char,
        lockTime: BASE_DELAY + i * STAGGER,
        lastSwapTime: 0,
      }));

      const kToken = {
        char: "K",
        lockTime: BASE_DELAY + CODEHIVE_CHARS.length * STAGGER + 0.2,
        lastSwapTime: 0,
      };

      const maxTime = 3.3; // 3.3 seconds total sequence duration
      const clock = { time: 0 };

      gsap.to(clock, {
        time: maxTime,
        duration: maxTime,
        ease: "none",
        onUpdate: () => {
          const curTime = clock.time;

          // Scramble & lock CODEHIVE letters
          codehiveTokens.forEach((tok, idx) => {
            const el = codehiveSpanRefs.current[idx];
            if (!el) return;

            if (curTime >= tok.lockTime) {
              if (el.textContent !== tok.char) el.textContent = tok.char;
            } else {
              const rem = tok.lockTime - curTime;
              const interval = rem > 0.6 ? 0.038 : rem > 0.25 ? 0.075 : 0.12;
              if (curTime - tok.lastSwapTime >= interval) {
                tok.lastSwapTime = curTime;
                el.textContent = getRandomLetter();
              }
            }
          });

          // Scramble & lock K in 2K26
          if (kSpanRef.current) {
            if (curTime >= kToken.lockTime) {
              if (kSpanRef.current.textContent !== kToken.char) {
                kSpanRef.current.textContent = kToken.char;
              }
            } else {
              const rem = kToken.lockTime - curTime;
              const interval = rem > 0.6 ? 0.038 : rem > 0.25 ? 0.075 : 0.12;
              if (curTime - kToken.lastSwapTime >= interval) {
                kToken.lastSwapTime = curTime;
                kSpanRef.current.textContent = getRandomLetter();
              }
            }
          }
        },
        onComplete: () => {
          CODEHIVE_CHARS.forEach((c, idx) => {
            const el = codehiveSpanRefs.current[idx];
            if (el) el.textContent = c;
          });
          if (kSpanRef.current) kSpanRef.current.textContent = "K";
          isInitialComplete.current = true;
        },
      });

      return () => {
        cleanTimers();
      };
    },
    { scope: containerRef }
  );

  // Interactive Hover: CODEHIVE alphabet cyber-scramble wave
  const triggerCodehiveHover = useCallback(() => {
    if (!isInitialComplete.current || isHoverActive.current.codehive) return;
    isHoverActive.current.codehive = true;

    const clock = { time: 0 };
    const dur = 0.45;
    const tokens = CODEHIVE_CHARS.map((char, i) => ({
      char,
      lock: 0.18 + i * 0.03,
      lastSwap: 0,
    }));

    gsap.to(clock, {
      time: dur,
      duration: dur,
      ease: "none",
      onUpdate: () => {
        const cur = clock.time;
        tokens.forEach((tok, idx) => {
          const el = codehiveSpanRefs.current[idx];
          if (!el) return;

          if (cur >= tok.lock) {
            if (el.textContent !== tok.char) el.textContent = tok.char;
          } else if (cur - tok.lastSwap >= 0.04) {
            tok.lastSwap = cur;
            el.textContent = getRandomLetter();
          }
        });
      },
      onComplete: () => {
        CODEHIVE_CHARS.forEach((c, idx) => {
          const el = codehiveSpanRefs.current[idx];
          if (el) el.textContent = c;
        });
        isHoverActive.current.codehive = false;
      },
    });
  }, []);

  // Interactive Hover: 2K26 fluid number rolls + K cyber scramble
  const triggerYearHover = useCallback(() => {
    if (!isInitialComplete.current || isHoverActive.current.year) return;
    isHoverActive.current.year = true;

    // Roll 2 and 26 again
    countYearFirst.set(0);
    setYearFirst(0);
    animate(countYearFirst, 2, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setYearFirst(Math.round(latest)),
    });

    countYearLast.set(0);
    setYearLast(0);
    animate(countYearLast, 26, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setYearLast(Math.round(latest)),
    });

    // Cyber scramble K
    const kClock = { time: 0 };
    gsap.to(kClock, {
      time: 0.5,
      duration: 0.5,
      ease: "none",
      onUpdate: () => {
        if (kClock.time >= 0.35) {
          if (kSpanRef.current && kSpanRef.current.textContent !== "K") {
            kSpanRef.current.textContent = "K";
          }
        } else if (kSpanRef.current) {
          kSpanRef.current.textContent = getRandomLetter();
        }
      },
      onComplete: () => {
        if (kSpanRef.current) kSpanRef.current.textContent = "K";
        isHoverActive.current.year = false;
      },
    });
  }, [countYearFirst, countYearLast]);

  // Interactive Hover: 2.0 fluid decimal roll
  const triggerVersionHover = useCallback(() => {
    if (!isInitialComplete.current || isHoverActive.current.version) return;
    isHoverActive.current.version = true;

    countVersion.set(0.0);
    setVersionNum(0.0);
    animate(countVersion, 2.0, {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setVersionNum(Number(latest.toFixed(1))),
      onComplete: () => {
        isHoverActive.current.version = false;
      },
    });
  }, [countVersion]);

  return (
    <h1
      ref={containerRef}
      aria-label="CODEHIVE 2K26 2.0"
      className={cn(
        "font-mono text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white leading-none uppercase text-center mx-auto select-none flex flex-wrap items-center justify-center gap-x-[0.35em] sm:gap-x-[0.45em] gap-y-2",
        className
      )}
    >
      {/* Word 0: CODEHIVE (GSAP Alphabet Cyber Decryption Wave) */}
      <span
        onMouseEnter={triggerCodehiveHover}
        className="inline-flex items-center whitespace-nowrap cursor-default text-white"
      >
        {CODEHIVE_CHARS.map((char, idx) => (
          <span
            key={`codehive-${idx}`}
            ref={(el) => {
              codehiveSpanRefs.current[idx] = el;
            }}
            aria-hidden="true"
            className="inline-block text-center w-[1ch] overflow-visible select-none text-white font-black"
          >
            {char}
          </span>
        ))}
      </span>

      {/* Word 1: 2K26 (Fluid Number Rolls for 2 & 26 + GSAP Cyber Shuffle for K) */}
      <span
        onMouseEnter={triggerYearHover}
        className="inline-flex items-center whitespace-nowrap cursor-default text-white"
      >
        <NumberFlow
          value={yearFirst}
          aria-hidden="true"
          className="inline-block text-white font-black font-mono leading-none"
        />
        <span
          ref={kSpanRef}
          aria-hidden="true"
          className="inline-block text-center w-[1ch] overflow-visible select-none text-white font-black"
        >
          K
        </span>
        <NumberFlow
          value={yearLast}
          format={{ minimumIntegerDigits: 2 }}
          aria-hidden="true"
          className="inline-block text-white font-black font-mono leading-none"
        />
      </span>

      {/* Word 2: 2.0 (Fluid Decimal Number Roll from Prize Section) */}
      <span
        onMouseEnter={triggerVersionHover}
        className="inline-flex items-center whitespace-nowrap cursor-default text-white"
      >
        <NumberFlow
          value={versionNum}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
          aria-hidden="true"
          className="inline-block text-white font-black font-mono leading-none"
        />
      </span>
    </h1>
  );
}

export default HeroCyberTitle;
