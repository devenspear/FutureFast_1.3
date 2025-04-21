"use client";
import React, { useRef, useEffect } from "react";

// Settings
const NUM_LINES = 16;
const LINE_COLOR = "rgba(80,200,255,0.18)";
const LINE_WIDTH = 2.2;
const GLOW_COLOR = "rgba(80,200,255,0.28)";
const NUM_STREAKS = 18;
const STREAK_COLOR = "rgba(255,255,255,0.22)";
const STREAK_GLOW = "rgba(80,200,255,0.22)";
const NUM_BLOBS = 7;
const BLOB_COLORS = [
  "rgba(80,200,255,0.15)",
  "rgba(255,255,255,0.09)",
  "rgba(80,255,200,0.12)"
];

const HERO_HEIGHT_FRAC = 0.75; // Hero is 75% of viewport height
const VANISH_Y_FRAC = 0.33; // Vanishing point at 33% of hero height

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

// --- Curve function for exponential lines ---
function expCurve(t: number, base: number = 3): number {
  // Exponential curve that starts slow and accelerates
  return (Math.exp(base * t) - 1) / (Math.exp(base) - 1);
}

// Define the Streak type for proper typing
type Streak = {
  delay: number;
  speed: number;
  frac: number;
  length: number;
  width: number;
  alpha: number;
};

// --- Blob type ---
type Blob = {
  frac: number; // horizontal position (0-1)
  size: number;
  alpha: number;
  color: string;
  speed: number;
  delay: number;
};

const RaceTrackParallaxLines: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0); 
  const streaksRef = useRef<Streak[]>([]);
  const blobsRef = useRef<Blob[]>([]);

  // Generate zoom streaks
  useEffect(() => {
    const streaks: Streak[] = [];
    for (let i = 0; i < NUM_STREAKS; i++) {
      streaks.push({
        frac: randomBetween(0, 1),
        speed: randomBetween(0.008, 0.017),
        width: randomBetween(4, 8), 
        length: randomBetween(60, 170),
        alpha: randomBetween(0.25, 0.7),
        delay: randomBetween(0, 900),
      });
    }
    streaksRef.current = streaks;
    // Generate blobs
    const blobs: Blob[] = [];
    for (let i = 0; i < NUM_BLOBS; i++) {
      blobs.push({
        frac: randomBetween(0, 1),
        size: randomBetween(40, 110),
        alpha: randomBetween(0.13, 0.33),
        color: BLOB_COLORS[Math.floor(Math.random() * BLOB_COLORS.length)],
        speed: randomBetween(0.004, 0.009),
        delay: randomBetween(0, 900),
      });
    }
    blobsRef.current = blobs;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight * HERO_HEIGHT_FRAC;
    canvas.width = width;
    canvas.height = height;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const vanishingX = width / 2;
      const vanishingY = height * VANISH_Y_FRAC + 38;
      const bottomY = height;
      const t = Date.now() / 1800;

      // --- Exponential curved lines (roller coaster style) ---
      for (let i = 0; i < NUM_LINES; i++) {
        const frac = i / (NUM_LINES - 1);
        const baseX = lerp(0, width, frac);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(baseX, bottomY);
        // Exponential curve upward to vanishing point
        for (let j = 0; j <= 40; j++) {
          const tt = j / 40;
          // Exponential curve for y, lerp for x
          const expT = expCurve(tt, 2.7); 
          const x = lerp(baseX, vanishingX, tt);
          const y = lerp(bottomY, vanishingY, expT);
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = LINE_COLOR;
        ctx.lineWidth = LINE_WIDTH + 1.4 * Math.abs(frac - 0.5); 
        ctx.shadowBlur = 18;
        ctx.shadowColor = GLOW_COLOR;
        ctx.globalAlpha = 0.97;
        ctx.stroke();
        ctx.restore();
      }

      // --- Animated streaks (lines) ---
      const now = Date.now();
      for (let i = 0; i < streaksRef.current.length; i++) {
        const s = streaksRef.current[i];
        // Exponential acceleration toward the center
        let prog = expCurve(((now + s.delay) * s.speed) % 1.0, 2.7);
        if (prog < 0.01) prog += 0.02 * Math.random();
        const frac = s.frac;
        const baseX = lerp(0, width, frac);
        // Exponential curve for y, lerp for x
        function bezier(tt: number) {
          const expT = expCurve(tt, 2.7);
          const x = lerp(baseX, vanishingX, tt);
          const y = lerp(bottomY, vanishingY, expT);
          return [x, y];
        }
        const [x1, y1] = bezier(prog);
        const [x2, y2] = bezier(Math.max(0, prog - s.length / height));
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = STREAK_COLOR;
        ctx.lineWidth = s.width;
        ctx.globalAlpha = s.alpha * (1 - prog);
        ctx.shadowBlur = 18;
        ctx.shadowColor = STREAK_GLOW;
        ctx.stroke();
        ctx.restore();
      }

      // --- Animated blobs ---
      for (let i = 0; i < blobsRef.current.length; i++) {
        const b = blobsRef.current[i];
        let prog = expCurve(((now + b.delay) * b.speed) % 1.0, 2.7);
        if (prog < 0.01) prog += 0.02 * Math.random();
        const frac = b.frac;
        const baseX = lerp(0, width, frac);
        const expT = expCurve(prog, 2.7);
        const x = lerp(baseX, vanishingX, prog);
        const y = lerp(bottomY, vanishingY, expT);
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, b.size, 0, 2 * Math.PI);
        ctx.globalAlpha = b.alpha * (1 - prog);
        ctx.fillStyle = b.color;
        ctx.shadowBlur = 18;
        ctx.shadowColor = b.color;
        ctx.fill();
        ctx.restore();
      }
    }

    function animate() {
      draw();
      animationRef.current = requestAnimationFrame(animate);
    }
    animate();
    // Responsive resize
    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight * HERO_HEIGHT_FRAC;
      if (!canvas) return;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationRef.current!);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none"
      style={{ display: 'block', top: 0, left: 0 }}
      aria-hidden="true"
    />
  );
};

export default RaceTrackParallaxLines;
