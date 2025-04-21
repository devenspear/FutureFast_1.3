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

const HERO_HEIGHT_FRAC = 0.75; // Hero is 75% of viewport height
const VANISH_Y_FRAC = 0.33; // Vanishing point at 33% of hero height

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
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

const RaceTrackParallaxLines: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0); // FIX: Provide initial value 0 to useRef<number>()
  const streaksRef = useRef<Streak[]>([]);

  // Generate zoom streaks
  useEffect(() => {
    const streaks: Streak[] = [];
    for (let i = 0; i < NUM_STREAKS; i++) {
      streaks.push({
        frac: randomBetween(0, 1),
        speed: randomBetween(0.008, 0.017),
        width: randomBetween(2, 4),
        length: randomBetween(60, 170),
        alpha: randomBetween(0.25, 0.7),
        delay: randomBetween(0, 900),
      });
    }
    streaksRef.current = streaks;
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
      if (!ctx) return; // Fix: ensure ctx is not null before using
      ctx.clearRect(0, 0, width, height);
      // Vanishing point fixed
      const vanishingX = width / 2;
      const vanishingY = height * VANISH_Y_FRAC + 38;
      const bottomY = height;
      const t = Date.now() / 1800;
      // Draw converging road lines from left and right edges
      for (let i = 0; i < NUM_LINES; i++) {
        const frac = i / (NUM_LINES - 1);
        // Fan lines from left to right edge
        const baseX = lerp(0, width, frac);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(baseX, bottomY);
        // Slight curve for a "road" feel
        const ctrlY = lerp(bottomY, vanishingY, 0.55);
        const ctrlX = lerp(baseX, vanishingX, 0.5) + Math.sin(t + i) * 8 * (frac - 0.5);
        ctx.quadraticCurveTo(ctrlX, ctrlY, vanishingX, vanishingY);
        ctx.strokeStyle = LINE_COLOR;
        ctx.lineWidth = LINE_WIDTH;
        ctx.shadowBlur = 12;
        ctx.shadowColor = GLOW_COLOR;
        ctx.globalAlpha = 0.95;
        ctx.stroke();
        ctx.restore();
      }
      // Animate zoom streaks
      const now = Date.now();
      for (let i = 0; i < streaksRef.current.length; i++) {
        const s = streaksRef.current[i];
        let prog = ((now + s.delay) * s.speed) % 1.2;
        if (prog < 0.01) prog += 0.02 * Math.random();
        const frac = s.frac;
        const baseX = lerp(0, width, frac);
        const ctrlY = lerp(bottomY, vanishingY, 0.55);
        const ctrlX = lerp(baseX, vanishingX, 0.5) + Math.sin(t + i) * 8 * (frac - 0.5);
        // Interpolate along quadratic Bezier
        function bezier(t: number) {
          const x = (1-t)*(1-t)*baseX + 2*(1-t)*t*ctrlX + t*t*vanishingX;
          const y = (1-t)*(1-t)*bottomY + 2*(1-t)*t*ctrlY + t*t*vanishingY;
          return [x, y];
        }
        const [x1, y1] = bezier(prog);
        const [x2, y2] = bezier(Math.max(0, prog - s.length/height));
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = STREAK_COLOR;
        ctx.lineWidth = s.width;
        ctx.globalAlpha = s.alpha * (1 - prog);
        ctx.shadowBlur = 10;
        ctx.shadowColor = STREAK_GLOW;
        ctx.stroke();
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
