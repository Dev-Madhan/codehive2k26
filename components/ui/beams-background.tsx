"use client";

import { useEffect, useRef } from "react";

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

function createBeam(width: number, height: number): Beam {
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5,
    width: 55 + Math.random() * 95,
    length: height * 1.8,
    speed: 0.25 + Math.random() * 0.55,
    opacity: 0.12 + Math.random() * 0.1,
    hue: 190 + Math.random() * 70,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.008 + Math.random() * 0.012,
  };
}

export function BeamsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasElement = canvas;

    const context = canvasElement.getContext("2d");
    if (context === null) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        startAnimation();
      } else {
        window.cancelAnimationFrame(animationFrame);
      }
    });
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let beams: Beam[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvasElement.width = Math.round(width * dpr);
      canvasElement.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      beams = Array.from({ length: 16 }, () => createBeam(width, height));
      render(false);
    };

    const drawBeam = (
      beam: Beam,
      drawingContext: CanvasRenderingContext2D
    ) => {
      drawingContext.save();
      drawingContext.translate(beam.x, beam.y);
      drawingContext.rotate((-35 * Math.PI) / 180);

      const opacity = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2);
      const gradient = drawingContext.createLinearGradient(
        0,
        0,
        0,
        beam.length
      );
      gradient.addColorStop(0, `hsla(${beam.hue}, 85%, 65%, 0)`);
      gradient.addColorStop(0.15, `hsla(${beam.hue}, 85%, 65%, ${opacity * 0.5})`);
      gradient.addColorStop(0.5, `hsla(${beam.hue}, 85%, 65%, ${opacity})`);
      gradient.addColorStop(0.85, `hsla(${beam.hue}, 85%, 65%, ${opacity * 0.5})`);
      gradient.addColorStop(1, `hsla(${beam.hue}, 85%, 65%, 0)`);

      drawingContext.fillStyle = gradient;
      drawingContext.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      drawingContext.restore();
    };

    function render(animate: boolean) {
      const drawingContext = canvasElement.getContext("2d");
      if (!drawingContext) return;
      drawingContext.clearRect(0, 0, width, height);
      drawingContext.save();
      drawingContext.filter = "blur(28px)";

      beams.forEach((beam) => {
        if (animate) {
          beam.y -= beam.speed;
          beam.pulse += beam.pulseSpeed;
          if (beam.y + beam.length < -height * 0.5) {
            beam.y = height + Math.random() * height * 0.5;
            beam.x = Math.random() * width * 1.5 - width * 0.25;
          }
        }
        drawBeam(beam, drawingContext);
      });

      drawingContext.restore();
      if (animate && !document.hidden && !motionPreference.matches) {
        animationFrame = window.requestAnimationFrame(() => render(true));
      }
    }

    const startAnimation = () => {
      window.cancelAnimationFrame(animationFrame);
      if (motionPreference.matches || document.hidden) {
        render(false);
      } else {
        animationFrame = window.requestAnimationFrame(() => render(true));
      }
    };
    const handleVisibility = () => startAnimation();

    resize();
    startAnimation();
    visibilityObserver.observe(canvasElement);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);
    motionPreference.addEventListener("change", startAnimation);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      visibilityObserver.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      motionPreference.removeEventListener("change", startAnimation);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen opacity-45 mix-blend-screen"
    />
  );
}
