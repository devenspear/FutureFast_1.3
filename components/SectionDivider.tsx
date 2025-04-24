import React from "react";

// Props allow flipping the curve and customizing color
type SectionDividerProps = {
  flip?: boolean;
  gradientId?: string;
};

export default function SectionDivider({ flip = false, gradientId = "gradient1" }: SectionDividerProps) {
  return (
    <div aria-hidden="true" style={{ lineHeight: 0 }}>
      <svg
        viewBox="0 0 1440 120"
        width="100%"
        height="60"
        preserveAspectRatio="none"
        style={{ display: "block", transform: flip ? "rotate(180deg)" : undefined }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>
        </defs>
        <path
          d="M0,0 C480,120 960,0 1440,120 L1440,120 L0,120 Z"
          fill={`url(#${gradientId})`}
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
