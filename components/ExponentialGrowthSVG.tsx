'use client';

import React from 'react';

/**
 * ExponentialGrowthSVG - A static visualization comparing linear vs exponential growth
 * Replaces the CPU-intensive AncientDarkGalaxy animation
 * Matches FutureFast's dark, futuristic aesthetic with cyan/gold accents
 */
export default function ExponentialGrowthSVG() {
  return (
    <div className="w-full aspect-square relative">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        aria-label="Chart comparing linear growth versus exponential growth, showing how exponential growth starts slow but rapidly accelerates"
      >
        {/* Definitions for gradients and filters */}
        <defs>
          {/* Exponential curve gradient - cyan to gold */}
          <linearGradient id="expGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#ffd700" />
          </linearGradient>

          {/* Linear line gradient - muted purple */}
          <linearGradient id="linearGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6b21a8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
          </linearGradient>

          {/* Glow effect for exponential curve */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Subtle glow for the "knee" point */}
          <filter id="kneeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Grid pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e1b4b" strokeWidth="0.5" opacity="0.5" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="400" height="400" fill="#0a0a0f" rx="12" />

        {/* Grid overlay */}
        <rect x="50" y="30" width="320" height="300" fill="url(#grid)" opacity="0.6" />

        {/* Axes */}
        <line x1="50" y1="330" x2="370" y2="330" stroke="#4c1d95" strokeWidth="1.5" opacity="0.7" />
        <line x1="50" y1="330" x2="50" y2="30" stroke="#4c1d95" strokeWidth="1.5" opacity="0.7" />

        {/* Linear growth line (straight diagonal) */}
        <line
          x1="50"
          y1="330"
          x2="370"
          y2="60"
          stroke="url(#linearGradient)"
          strokeWidth="2.5"
          strokeDasharray="8 4"
          opacity="0.7"
        />

        {/* Exponential growth curve */}
        <path
          d="M 50 330
             Q 100 328, 130 325
             Q 160 320, 190 310
             Q 220 295, 250 265
             Q 280 215, 310 130
             Q 330 70, 350 35"
          fill="none"
          stroke="url(#expGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* The "knee" point - where exponential takes off */}
        <circle
          cx="250"
          cy="265"
          r="8"
          fill="#ffd700"
          filter="url(#kneeGlow)"
          opacity="0.9"
        />
        <circle
          cx="250"
          cy="265"
          r="4"
          fill="#ffffff"
        />

        {/* Data points on exponential curve */}
        {[
          { x: 90, y: 327 },
          { x: 130, y: 322 },
          { x: 170, y: 312 },
          { x: 210, y: 290 },
          { x: 290, y: 180 },
          { x: 330, y: 80 },
        ].map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#22d3ee"
            opacity={0.6 + i * 0.06}
          />
        ))}

        {/* Labels */}
        <text x="200" y="385" textAnchor="middle" fill="#9ca3af" fontSize="12" fontFamily="system-ui, sans-serif">
          Time
        </text>
        <text x="25" y="180" textAnchor="middle" fill="#9ca3af" fontSize="12" fontFamily="system-ui, sans-serif" transform="rotate(-90, 25, 180)">
          Growth
        </text>

        {/* Legend */}
        <g transform="translate(60, 50)">
          {/* Exponential legend */}
          <line x1="0" y1="0" x2="25" y2="0" stroke="#22d3ee" strokeWidth="3" />
          <text x="32" y="4" fill="#e5e7eb" fontSize="11" fontFamily="system-ui, sans-serif">
            Exponential
          </text>

          {/* Linear legend */}
          <line x1="0" y1="20" x2="25" y2="20" stroke="#a855f7" strokeWidth="2" strokeDasharray="6 3" opacity="0.7" />
          <text x="32" y="24" fill="#9ca3af" fontSize="11" fontFamily="system-ui, sans-serif">
            Linear
          </text>
        </g>

        {/* Annotation for the knee point */}
        <g transform="translate(258, 240)">
          <text fill="#ffd700" fontSize="10" fontFamily="system-ui, sans-serif" fontWeight="600">
            The Inflection Point
          </text>
          <text y="14" fill="#9ca3af" fontSize="9" fontFamily="system-ui, sans-serif">
            Where change accelerates
          </text>
        </g>

        {/* Value annotations */}
        <text x="355" y="28" fill="#ffd700" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="bold">
          1024x
        </text>
        <text x="375" y="65" fill="#a855f7" fontSize="10" fontFamily="system-ui, sans-serif" opacity="0.8">
          10x
        </text>
      </svg>
    </div>
  );
}
