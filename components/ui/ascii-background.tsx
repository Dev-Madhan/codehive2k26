"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AsciiBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  density?: "low" | "medium" | "high";
  speed?: number;
}

// Curated palette of cyber, algorithmic, and matrix ASCII glyphs
const ASCII_CHARS = [
  // Numbers & Binary
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  // Hex & Code identifiers
  "0x", "A", "B", "C", "D", "E", "F", "X", "Y", "Z", "K", "W", "H", "I", "V", "E",
  // Mathematical & Terminal Symbols
  "λ", "§", "ø", "∆", "∑", "√", "π", "Ω", "{", "}", "[", "]", "<", ">",
  "/", "\\", "*", "+", "~", "!", "?", "|", ":", "=", "_", "^", "$", "%", "#", "&",
  // Dithering & Shading blocks
  "░", "▒", "▓", "█"
];

export function AsciiBackground({
  children,
  className,
  density = "medium",
  speed = 1.0,
}: AsciiBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Grid cell size based on density
    const cellWidth = density === "high" ? 14 : density === "medium" ? 18 : 22;
    const cellHeight = density === "high" ? 20 : density === "medium" ? 24 : 28;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let dpr = 1;

    // Stream columns for digital rain effect
    interface ColumnStream {
      y: number;
      speed: number;
      length: number;
      charPool: string[];
      lastUpdate: number;
    }
    let streams: ColumnStream[] = [];

    // Interactive cursor ripples
    interface Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      intensity: number;
      speed: number;
    }
    const ripples: Ripple[] = [];
    const mouse = { x: -1000, y: -1000, active: false };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / cellWidth) + 1;
      rows = Math.ceil(height / cellHeight) + 1;

      // Initialize streams
      streams = Array.from({ length: cols }, () => ({
        y: Math.random() * -rows,
        speed: (0.15 + Math.random() * 0.35) * speed,
        length: Math.floor(10 + Math.random() * 18),
        charPool: Array.from({ length: rows + 20 }, () =>
          ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]
        ),
        lastUpdate: 0,
      }));
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // Mouse & Touch interaction
    const addRipple = (x: number, y: number) => {
      if (ripples.length > 8) ripples.shift();
      ripples.push({
        x,
        y,
        radius: 5,
        maxRadius: Math.max(width, height) * 0.45,
        intensity: 1.0,
        speed: 6.5,
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.x = x;
      mouse.y = y;
      mouse.active = true;

      // Add occasional ripple on cursor move
      if (Math.random() < 0.2) {
        addRipple(x, y);
      }
    };

    const handlePointerLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    // Visibility control
    let isVisible = true;
    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.025 * speed;

      // Deep obsidian pitch-black clearing
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Set font styling for ASCII characters
      ctx.font = `600 ${cellHeight * 0.58}px "JetBrains Mono", monospace`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.intensity *= 0.965;
        if (r.intensity < 0.03 || r.radius > r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // Render ASCII grid
      for (let c = 0; c < cols; c++) {
        const stream = streams[c];
        if (!stream) continue;

        stream.y += stream.speed;
        if (stream.y - stream.length > rows) {
          stream.y = -Math.floor(Math.random() * 8);
          stream.speed = (0.15 + Math.random() * 0.35) * speed;
          stream.length = Math.floor(10 + Math.random() * 18);
        }

        const colX = c * cellWidth + cellWidth / 2;

        for (let r = 0; r < rows; r++) {
          const rowY = r * cellHeight + cellHeight / 2;

          // 1. Fluid Ambient Harmonic Wave
          const harmonic =
            Math.sin(c * 0.12 + time * 1.2) * Math.cos(r * 0.14 - time * 0.9) +
            Math.sin((c + r) * 0.08 + time * 1.5);
          const harmonicIntensity = Math.max(0, (harmonic + 1.8) / 3.6); // 0 to 1

          // 2. Vertical Stream Head & Trail distance
          const streamDist = stream.y - r;
          let streamIntensity = 0;
          let isHead = false;

          if (streamDist >= 0 && streamDist < stream.length) {
            if (streamDist < 1.0) {
              isHead = true;
              streamIntensity = 1.0;
            } else {
              streamIntensity = Math.pow(1.0 - streamDist / stream.length, 1.6);
            }
          }

          // 3. Cursor proximity & ripple interactions
          let cursorIntensity = 0;
          if (mouse.active) {
            const dx = colX - mouse.x;
            const dy = rowY - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
              cursorIntensity = Math.pow(1 - dist / 180, 2) * 1.2;
            }
          }

          // Ripple shockwave impact
          for (let k = 0; k < ripples.length; k++) {
            const rip = ripples[k];
            const dx = colX - rip.x;
            const dy = rowY - rip.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const ringDist = Math.abs(dist - rip.radius);
            if (ringDist < 60) {
              const ringFactor = (1 - ringDist / 60) * rip.intensity;
              cursorIntensity = Math.max(cursorIntensity, ringFactor * 1.4);
            }
          }

          // Total combined luminance (0 to 1+)
          const totalEnergy =
            harmonicIntensity * 0.22 +
            streamIntensity * 0.45 +
            cursorIntensity * 0.85;

          // Pick character: scramble rapidly if near cursor or stream head
          let charIndex = (c * 7 + r * 13 + Math.floor(time * 6)) % ASCII_CHARS.length;
          if (cursorIntensity > 0.4 || isHead) {
            charIndex = Math.floor(Math.random() * ASCII_CHARS.length);
          }
          const char = ASCII_CHARS[charIndex] || "0";

          // Dynamic Color Grading: Deep Navy -> Cyber Blue -> Electric Cyan / White
          if (totalEnergy > 0.85 || isHead) {
            // High energy / Head: Electric Ice Cyan / Luminous White
            ctx.fillStyle = `rgba(186, 230, 253, ${Math.min(1.0, 0.75 + totalEnergy * 0.25)})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#38bdf8";
          } else if (totalEnergy > 0.45) {
            // Mid energy: Vibrant Royal / Cyber Blue
            ctx.fillStyle = `rgba(59, 130, 246, ${Math.min(0.85, 0.4 + totalEnergy * 0.5)})`;
            ctx.shadowBlur = 4;
            ctx.shadowColor = "#2563eb";
          } else if (totalEnergy > 0.15) {
            // Low ambient energy: Deep Cyber Indigo
            ctx.fillStyle = `rgba(30, 58, 138, ${Math.min(0.45, 0.12 + totalEnergy * 0.3)})`;
            ctx.shadowBlur = 0;
          } else {
            // Rest state: Subtle faint terminal ghost
            ctx.fillStyle = "rgba(15, 23, 42, 0.18)";
            ctx.shadowBlur = 0;
          }

          ctx.fillText(char, colX, rowY);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
      resizeObserver.disconnect();
    };
  }, [density, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full min-h-screen overflow-hidden bg-black selection:bg-blue-600 selection:text-white",
        className
      )}
    >
      {/* Interactive ASCII Matrix Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full pointer-events-auto"
      />

      {/* Cinematic Center & Radial Vignette to guarantee pristine text contrast */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.85)_65%,rgba(0,0,0,0.98)_100%)]" />

      {/* Top subtle blue laser bloom */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-blue-600/15 via-blue-900/5 to-transparent blur-[120px]" />

      {/* Foreground Content */}
      {children && (
        <div className="relative z-10 flex flex-col min-h-full">
          {children}
        </div>
      )}
    </div>
  );
}

export default AsciiBackground;
