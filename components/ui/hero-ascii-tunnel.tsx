"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// VanishRun / HeroAsciiTunnel — a full-bleed ASCII perspective corridor.
// Runs continuously and forward-moving down a central corridor.
// Content is stably centered via CSS without magnetic cursor tracking.
// ---------------------------------------------------------------------------

const RAMP = " .:-=+*#%@"; // 10-step density ramp, index 0 = blank
const RING_COUNT = 16;
const Z_NEAR = 0.55;
const Z_FAR = 6.2;
const CYCLE_SECONDS = 3.4; // time for one ring to travel Z_FAR -> Z_NEAR
const RING_SPEED = (Z_FAR - Z_NEAR) / CYCLE_SECONDS;
const WORLD_A = 1.55; // squircle half-width, world units
const WORLD_B = 1; // squircle half-height, world units
const SQUIRCLE_EXP = 0.5; // 2/n with n=4 — rounded-rect-ish ring
const DT_MAX = 0.05;
const CONTENT_FEATHER_PX = 64; // soft falloff distance beyond the children's box

export interface VanishRunProps {
  /** grid cell size in px */
  cellSize?: number;
  /** headline / CTA centered in the hero */
  children?: ReactNode;
  /** extra classes merged onto the rendered root element */
  className?: string;
  /** extra classes merged onto the centered content element */
  contentClassName?: string;
}

export function VanishRun({
  cellSize = 13,
  children,
  className = "",
  contentClassName = "",
}: VanishRunProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let fg = "currentColor";
    let cellW = cellSize;
    let cellH = cellSize;
    let cols = 0;
    let rows = 0;
    let dpr = 1;
    let sized = false;
    let ready = false;
    let disposed = false;

    let rMinRow = 0;
    let rMaxRow = 0;
    let rMinCol = 0;
    let rMaxCol = 0;
    let renderCx = 0;
    let renderCy = 0;
    let K1 = 0;
    let rootW = 0;
    let rootH = 0;

    // Measured box of children to attenuate characters behind text
    const content = contentRef.current;
    const hasContent = !!content;
    let contentW = 0;
    let contentH = 0;
    const measureContent = () => {
      if (!content) return;
      const r = content.getBoundingClientRect();
      contentW = r.width;
      contentH = r.height;
    };
    measureContent();
    const contentRO = content ? new ResizeObserver(measureContent) : null;
    if (content) contentRO?.observe(content);

    let depthBuf = new Float32Array(0);
    let charBuf = new Uint8Array(0);

    let pointsPerRing = 96;
    const ringZ = new Float32Array(RING_COUNT);
    for (let i = 0; i < RING_COUNT; i++) {
      ringZ[i] = Z_NEAR + (i * (Z_FAR - Z_NEAR)) / RING_COUNT;
    }

    const readTokens = () => {
      fg = getComputedStyle(canvas).color;
    };

    const measureCell = (fontFamily: string) => {
      const off = document.createElement("canvas");
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.font = `${cellSize}px ${fontFamily}`;
      const m = octx.measureText("M");
      cellW = Math.max(1, Math.round(m.width));
      cellH = cellSize;
    };

    const resize = () => {
      if (disposed) return;
      const rootRect = root.getBoundingClientRect();
      rootW = rootRect.width;
      rootH = rootRect.height;
      if (rootW === 0 || rootH === 0) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      const computed = getComputedStyle(root);
      const ff = computed.fontFamily || "monospace";
      measureCell(ff);

      const renderW = rootW * dpr;
      const renderH = rootH * dpr;
      cols = Math.floor(renderW / cellW);
      rows = Math.floor(renderH / cellH);
      if (cols <= 0 || rows <= 0) return;

      canvas.width = renderW;
      canvas.height = renderH;
      canvas.style.width = `${rootW}px`;
      canvas.style.height = `${rootH}px`;

      ctx.font = `${cellSize}px ${ff}`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      const totalCells = cols * rows;
      if (depthBuf.length !== totalCells) {
        depthBuf = new Float32Array(totalCells);
        charBuf = new Uint8Array(totalCells);
      }

      renderCx = renderW / 2;
      renderCy = renderH / 2;

      K1 = Math.min(renderW, renderH) * 0.42;

      rMinRow = 0;
      rMaxRow = rows;
      rMinCol = 0;
      rMaxCol = cols;

      const approxRadiusPx = (K1 * WORLD_A) / Z_NEAR;
      const circPx = 2 * Math.PI * approxRadiusPx;
      const targetStepPx = Math.max(cellW, cellH) * 0.7;
      pointsPerRing = Math.max(
        64,
        Math.min(240, Math.round(circPx / targetStepPx))
      );

      measureContent();
      sized = true;
    };

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeTimer = null;
        resize();
        if (reduced) draw();
      }, 150);
    };

    const draw = () => {
      if (!sized) return;
      const w = cols * cellW;
      const h = rows * cellH;
      ctx.clearRect(0, 0, w, h);
      depthBuf.fill(0);
      charBuf.fill(0);

      // Always draw vanishing point directly in the isometric center
      const cx = renderCx;
      const cy = renderCy;
      const thetaStep = (Math.PI * 2) / pointsPerRing;

      for (let i = 0; i < RING_COUNT; i++) {
        const z = ringZ[i];
        const ooz = 1 / z;
        const depthT = Math.min(
          1,
          Math.max(0, 1 - (z - Z_NEAR) / (Z_FAR - Z_NEAR))
        );
        const li = Math.min(
          RAMP.length - 1,
          Math.max(1, Math.round(Math.pow(depthT, 0.85) * (RAMP.length - 1)))
        );

        for (let p = 0; p < pointsPerRing; p++) {
          const theta = p * thetaStep;
          const cosT = Math.cos(theta);
          const sinT = Math.sin(theta);
          const wx =
            WORLD_A * Math.sign(cosT) * Math.pow(Math.abs(cosT), SQUIRCLE_EXP);
          const wy =
            WORLD_B * Math.sign(sinT) * Math.pow(Math.abs(sinT), SQUIRCLE_EXP);

          const px = cx + K1 * ooz * wx;
          const py = cy + K1 * ooz * wy;
          const col = Math.round(px / cellW);
          const row = Math.round(py / cellH);
          if (col < rMinCol || col >= rMaxCol || row < rMinRow || row >= rMaxRow)
            continue;

          const idx = row * cols + col;
          if (ooz > depthBuf[idx]) {
            depthBuf[idx] = ooz;
            charBuf[idx] = li + 1;
          }
        }
      }

      // Attenuate ring characters under children's central bounding box
      const hasContentBox = hasContent && contentW > 0 && contentH > 0;
      const contentCx = (rootW * dpr) / 2;
      const contentCy = (rootH * dpr) / 2;
      const innerHalfW = (contentW * dpr) / 2;
      const innerHalfH = (contentH * dpr) / 2;

      ctx.fillStyle = fg;
      for (let row = rMinRow; row < rMaxRow; row++) {
        for (let col = rMinCol; col < rMaxCol; col++) {
          const idx = row * cols + col;
          const ci = charBuf[idx];
          if (ci === 0) continue;
          const li = ci - 1;
          let alpha = 0.3 + (li / (RAMP.length - 1)) * 0.7;
          const px = col * cellW + cellW / 2;
          const py = row * cellH + cellH / 2;
          if (hasContentBox) {
            const dx = Math.max(Math.abs(px - contentCx) - innerHalfW, 0);
            const dy = Math.max(Math.abs(py - contentCy) - innerHalfH, 0);
            const dist = Math.sqrt(dx * dx + dy * dy);
            const t = Math.min(1, Math.max(0, dist / (CONTENT_FEATHER_PX * dpr)));
            const atten = t * t * (3 - 2 * t); // smoothstep
            if (atten <= 0.02) continue;
            alpha *= atten;
          }
          ctx.globalAlpha = alpha;
          ctx.fillText(RAMP[li], px, py);
        }
      }
      ctx.globalAlpha = 1;
    };

    // Animation loop (steady isometric forward motion)
    let raf = 0;
    let last = 0;

    const loop = (now: number) => {
      const dt = last ? Math.min(DT_MAX, (now - last) / 1000) : 1 / 60;
      last = now;
      for (let i = 0; i < RING_COUNT; i++) {
        ringZ[i] -= RING_SPEED * dt;
        if (ringZ[i] < Z_NEAR) ringZ[i] += Z_FAR - Z_NEAR;
      }
      draw();
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };

    const onVis = () => {
      if (!document.hidden && !reduced && ready) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    };
    const mo = new MutationObserver(() => {
      readTokens();
      if (reduced) draw();
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    document.fonts.ready.then(() => {
      if (disposed) return;
      readTokens();
      resize();
      ready = true;
      if (reduced) {
        draw();
      } else {
        raf = requestAnimationFrame(loop);
      }
    });

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (resizeTimer) clearTimeout(resizeTimer);
      mo.disconnect();
      contentRO?.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [cellSize]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative isolate min-h-screen w-full overflow-hidden bg-background font-mono",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 block h-full w-full text-foreground pointer-events-none"
      />
      {children ? (
        <div
          ref={contentRef}
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex w-full max-w-5xl sm:max-w-6xl flex-col items-center justify-center gap-4 px-4 sm:px-6 text-center z-10 pointer-events-auto",
            contentClassName
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export const HeroAsciiTunnel = VanishRun;
export default VanishRun;
