"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextEffectProps {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  preset?: "fade-in-blur" | "fade-in" | "slide-up";
  per?: "word" | "char" | "line";
  delay?: number;
  speedSegment?: number;
}

export function TextEffect({
  children,
  as: Component = "p",
  className,
  delay = 0,
}: TextEffectProps) {
  if (typeof children !== "string") {
    const MotionComponent = motion.create(Component);
    return (
      <MotionComponent
        initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, delay, ease: [0.2, 0.65, 0.3, 0.9] }}
        className={className}
      >
        {children}
      </MotionComponent>
    );
  }

  const words = children.split(" ");
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 12,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.45,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("inline-block", className)}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          className="inline-block whitespace-nowrap mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </MotionComponent>
  );
}
