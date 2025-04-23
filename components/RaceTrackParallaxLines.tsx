"use client";
import React, { useRef, useEffect } from "react";

// Settings
const NUM_LINES = 16;
const LINE_COLOR = "rgba(80,220,255,0.65)";
const LINE_WIDTH = 2.2;
const GLOW_COLOR = "rgba(80,220,255,0.45)";
const DOTS_PER_LINE = 2;
const DOT_RADIUS = 6;
const DOT_ACCEL = 2.1; // exponential acceleration
const DOT_MIN_SPEED = 0.004; // Increase speed by 200%
const DOT_MAX_SPEED = 0.016; // Increase speed by 200%
const HERO_HEIGHT_FRAC = 0.75; // Hero is 75% of viewport height
const VANISH_Y_FRAC = 0; // Vanishing point at the very top

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

interface RainbowDot {
  t: number;        // Progress along the line (0-1)
  speed: number;    // How fast the dot moves
  color: string;    // Dot color
  delay: number;    // Delay before starting
}

const RaceTrackParallaxLines: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0); 
  const dotsRef = useRef<RainbowDot[][]>([]);

  // Generate dots
  useEffect(() => {
    const dots: RainbowDot[][] = [];
    for (let i = 0; i < NUM_LINES; i++) {
      const lineDots: RainbowDot[] = [];
      for (let j = 0; j < DOTS_PER_LINE; j++) {
        lineDots.push({
          t: Math.random(),
          speed: randomBetween(DOT_MIN_SPEED, DOT_MAX_SPEED),
          color: getRandomRainbowColor(),
          delay: randomBetween(0, 1200),
        });
      }
      dots.push(lineDots);
    }
    dotsRef.current = dots;
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
      const vanishingY = height * VANISH_Y_FRAC;
      const bottomY = height;

      // --- Outward-bowing (convex) rollercoaster curve ---
      function convexRollercoasterCurve(baseX: number, vanishingX: number, bottomY: number, vanishingY: number, frac: number, t: number) {
        // X: smoothly interpolate from baseX to vanishingX
        const x = lerp(baseX, vanishingX, Math.pow(t, 1.18));
        // Y: convex arc (ease-out, stays low then shoots up)
        const y = lerp(bottomY, vanishingY, Math.pow(t, 2.2));
        return [x, y];
      }

      // Draw convex rollercoaster lines with glow
      for (let i = 0; i < NUM_LINES; i++) {
        const frac = i / (NUM_LINES - 1);
        const baseX = lerp(0, width, frac);
        ctx.save();
        ctx.beginPath();
        let prev = convexRollercoasterCurve(baseX, vanishingX, bottomY, vanishingY, frac, 0);
        for (let j = 1; j <= 50; j++) {
          const t = j / 50;
          const curr = convexRollercoasterCurve(baseX, vanishingX, bottomY, vanishingY, frac, t);
          ctx.moveTo(prev[0], prev[1]);
          ctx.lineTo(curr[0], curr[1]);
          // Glow for each segment
          ctx.save();
          ctx.strokeStyle = GLOW_COLOR;
          ctx.lineWidth = (LINE_WIDTH + 2.7 * Math.abs(frac - 0.5));
          ctx.shadowBlur = 16;
          ctx.shadowColor = GLOW_COLOR;
          ctx.globalAlpha = 0.4;
          ctx.stroke();
          ctx.restore();
          prev = curr;
        }
        // Main line on top
        ctx.beginPath();
        const [x0, y0] = convexRollercoasterCurve(baseX, vanishingX, bottomY, vanishingY, frac, 0);
        ctx.moveTo(x0, y0);
        for (let j = 1; j <= 50; j++) {
          const t = j / 50;
          const [x, y] = convexRollercoasterCurve(baseX, vanishingX, bottomY, vanishingY, frac, t);
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = LINE_COLOR;
        ctx.lineWidth = LINE_WIDTH + 1.4 * Math.abs(frac - 0.5);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 0.97;
        ctx.stroke();
        ctx.restore();
      }

      // --- Animated rainbow dots (semi-transparent, faster) ---
      for (let i = 0; i < NUM_LINES; i++) {
        const frac = i / (NUM_LINES - 1);
        const baseX = lerp(0, width, frac);
        for (let j = 0; j < DOTS_PER_LINE; j++) {
          const dot = dotsRef.current[i][j];
          let t = dot.t;
          if (dot.delay > 0) {
            dot.delay -= 16;
            continue;
          }
          dot.t += dot.speed * Math.pow(1 + t, DOT_ACCEL);
          if (dot.t >= 1) {
            dot.t = 0;
            dot.speed = randomBetween(DOT_MIN_SPEED, DOT_MAX_SPEED);
            dot.color = getRandomRainbowColor();
            dot.delay = randomBetween(0, 1200);
          }
          const [x, y] = convexRollercoasterCurve(baseX, vanishingX, bottomY, vanishingY, frac, t);
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, DOT_RADIUS, 0, 2 * Math.PI);
          ctx.globalAlpha = 0.44; // semi-transparent
          ctx.fillStyle = dot.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = dot.color;
          ctx.fill();
          ctx.restore();
        }
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

function getRandomRainbowColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 95%, 55%)`;
}

export default RaceTrackParallaxLines;
