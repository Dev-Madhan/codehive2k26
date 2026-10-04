import React from "react";
import { cn } from "@/lib/utils";

type CurveProps = React.ComponentProps<"svg"> & {
  backgroundColor?: string;
  borderColor?: string;
  direction?: "tl" | "tr" | "bl" | "br";
};

export function Curve({
  direction = "tl",
  preserveAspectRatio = "none",
  backgroundColor = "var(--background)",
  borderColor = "var(--border)",
  className,
  ...props
}: Omit<CurveProps, "viewBox" | "fill">) {
  const directionClass = {
    tl: "rotate-0", // top-left (default)
    tr: "rotate-0 scale-x-[-1]", // top-right (flipped horizontally)
    bl: "rotate-180 scale-x-[-1]", // bottom-left (flipped horizontally + upside down)
    br: "rotate-180", // bottom-right (upside down)
  }[direction];

  return (
    <svg
      className={cn("overflow-hidden", directionClass, className)}
      fill="none"
      preserveAspectRatio={preserveAspectRatio}
      viewBox="0 0 60 42"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask
        height="43"
        id="overlay_nav_mask0"
        maskUnits="userSpaceOnUse"
        style={{ maskType: "alpha" }}
        width="60"
        x="0"
        y="0"
      >
        <mask
          fill="black"
          height="43"
          id="path_1_outside"
          maskUnits="userSpaceOnUse"
          width="60"
          x="0"
          y="0"
        >
          <rect fill="white" height="43" width="60" y="0" />
          <path d="M1 0L8.0783 0C15.772 0 22.7836 4.41324 26.111 11.3501L34.8889 29.6498C38.2164 36.5868 45.228 41 52.9217 41H60H1L1 0Z" />
        </mask>
        <path
          d="M1 0L8.0783 0C15.772 0 22.7836 4.41324 26.111 11.3501L34.8889 29.6498C38.2164 36.5868 45.228 41 52.9217 41H60H1L1 0Z"
          fill="white"
        />
        <path
          d="M1 0V-1H0V0L1 0ZM1 41H0V42H1V41ZM34.8889 29.6498L33.9873 30.0823L34.8889 29.6498ZM26.111 11.3501L27.0127 10.9177L26.111 11.3501ZM1 1H8.0783V-1H1V1ZM60 40H1V42H60V40ZM2 41V0L0 0L0 41H2ZM25.2094 11.7826L33.9873 30.0823L35.7906 29.2174L27.0127 10.9177L25.2094 11.7826ZM52.9217 42H60V40H52.9217V42ZM33.9873 30.0823C37.4811 37.3661 44.8433 42 52.9217 42V40C45.6127 40 38.9517 35.8074 35.7906 29.2174L33.9873 30.0823ZM8.0783 1C15.3873 1 22.0483 5.19257 25.2094 11.7826L27.0127 10.9177C23.5188 3.6339 16.1567 -1 8.0783 -1V1Z"
          fill="black"
          mask="url(#path_1_outside)"
        />
      </mask>

      <g mask="url(#overlay_nav_mask0)">
        <mask
          fill="black"
          height="43"
          id="path_3_outside"
          maskUnits="userSpaceOnUse"
          width="60"
          x="-1"
          y="0"
        >
          <rect fill="white" height="43" width="60" x="-1" y="0" />
          <path d="M0 1.02441H7.0783C14.772 1.02441 21.7836 5.43765 25.111 12.3746L33.8889 30.6743C37.2164 37.6112 44.228 42.0244 51.9217 42.0244H59H0L0 1.02441Z" />
        </mask>
        <path
          d="M0 1.02441H7.0783C14.772 1.02441 21.7836 5.43765 25.111 12.3746L33.8889 30.6743C37.2164 37.6112 44.228 42.0244 51.9217 42.0244H59H0L0 1.02441Z"
          fill={backgroundColor}
        />
        <path
          d="M0 1.02441L0 0H-1V1.02441H0ZM0 42.0244H-1V43.0244H0L0 42.0244ZM33.8889 30.6743L32.9873 31.1068L33.8889 30.6743ZM25.111 12.3746L26.0127 11.9421L25.111 12.3746ZM0 2.02441H7.0783V0.0244141H0L0 2.02441ZM59 41.0244H0L0 43.0244H59V41.0244ZM1 42.0244L1 1.02441H-1L-1 42.0244H1ZM24.2094 12.8071L32.9873 31.1068L34.7906 30.2418L26.0127 11.9421L24.2094 12.8071ZM51.9217 43.0244H59V41.0244H51.9217V43.0244ZM32.9873 31.1068C36.4811 38.3905 43.8433 43.0244 51.9217 43.0244V41.0244C44.6127 41.0244 37.9517 36.8318 34.7906 30.2418L32.9873 31.1068ZM7.0783 2.02441C14.3873 2.02441 21.0483 6.21699 24.2094 12.8071L26.0127 11.9421C22.5188 4.65831 15.1567 0.0244141 7.0783 0.0244141V2.02441Z"
          fill={borderColor}
          mask="url(#path_3_outside)"
        />
      </g>
    </svg>
  );
}
