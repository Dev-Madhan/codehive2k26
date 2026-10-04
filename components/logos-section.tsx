import React from "react";
import { Curve } from "@/components/ui/curve";
import { LogoCloud } from "@/components/logo-cloud";

export function LogosSection() {
  return (
    <section className="relative pt-8 pb-16">
      <div className="absolute inset-x-0 -top-10 flex h-10">
        <div className="flex-1 translate-x-px border-b" />
        <Curve
          backgroundColor="var(--background)"
          className="h-full"
          direction="tr"
        />
        <div className="relative w-full max-w-[280px] flex-1/2 bg-background py-4 md:flex-1">
          <div className="absolute inset-x-0 top-0 h-px border-t" />
          <h2 className="text-center font-medium text-muted-foreground tracking-tight md:text-base">
            Trusted by Leaders &amp; Partners
          </h2>
        </div>
        <Curve
          backgroundColor="var(--background)"
          className="h-full"
          direction="tl"
        />
        <div className="flex-1 -translate-x-px border-b" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl pt-4">
        <LogoCloud />
      </div>
    </section>
  );
}
