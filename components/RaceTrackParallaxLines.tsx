"use client";
import React, { useRef, useEffect } from "react";

// Settings
const NUM_LINES = 16;
const LINE_COLOR = "rgba(80,220,255,0.65)";
const LINE_WIDTH = 2.2;
const GLOW_COLOR = "rgba(80,220,255,0.45)";
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

// --- MonorailCar type ---
type MonorailCar = {
  trackFrac: number; // which main line/track this car rides (0-1)
  size: number;
  alpha: number;
  color: string;
  speed: number;
  delay: number;
  windowColor: string;
};

const RaceTrackParallaxLines: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0); 
  const streaksRef = useRef<Streak[]>([]);
  const carsRef = useRef<MonorailCar[]>([]);

  // Generate zoom streaks
  useEffect(() => {
    const streaks: Streak[] = [];
    for (let i = 0; i < NUM_STREAKS; i++) {
      streaks.push({
        frac: randomBetween(0, 1),
        speed: randomBetween(0.003, 0.007), // SLOWER animation for streaks
        width: randomBetween(4, 8), 
        length: randomBetween(60, 170),
        alpha: randomBetween(0.25, 0.7),
        delay: randomBetween(0, 900),
      });
    }
    streaksRef.current = streaks;
    // Generate monorail cars
    const cars: MonorailCar[] = [];
    for (let i = 0; i < NUM_BLOBS; i++) {
      const frac = randomBetween(0, 1);
      cars.push({
        trackFrac: frac,
        size: randomBetween(42, 90),
        alpha: randomBetween(0.18, 0.33),
        color: BLOB_COLORS[Math.floor(Math.random() * BLOB_COLORS.length)],
        speed: randomBetween(0.0015, 0.004),
        delay: randomBetween(0, 900),
        windowColor: 'rgba(255,255,255,0.42)',
      });
    }
    carsRef.current = cars;
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
        let [x0, y0] = convexRollercoasterCurve(baseX, vanishingX, bottomY, vanishingY, frac, 0);
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

      // --- Animated blobs follow the convex arc, are smaller, and visible to the end ---
      for (let i = 0; i < carsRef.current.length; i++) {
        const car = carsRef.current[i];
        let progLin = ((now + car.delay) * car.speed) % 1.0;
        if (progLin < 0.01) progLin += 0.02 * Math.random();
        // Steep ease: slow at start, fast at top
        let prog = Math.pow(progLin, 2.5);
        const frac = car.trackFrac;
        const baseX = lerp(0, width, frac);
        // Follow the convex arc
        const [x, y] = convexRollercoasterCurve(baseX, vanishingX, bottomY, vanishingY, frac, prog);
        const [x2, y2] = convexRollercoasterCurve(baseX, vanishingX, bottomY, vanishingY, frac, Math.min(1, prog + 0.01));
        const angle = Math.atan2(y2 - y, x2 - x);
        // 60% smaller overall, visible to the end
        const scale = lerp(0.4, 0.11, prog); // base is 0.4 (60% smaller), shrinks to 0.11
        const alpha = car.alpha * (1 - 0.7 * prog); // fades a bit, but visible at top
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.scale(scale, scale);
        ctx.beginPath();
        ctx.moveTo(-car.size * 1.4 + car.size * 0.36, -car.size * 0.36);
        ctx.arc(-car.size * 1.4 + car.size * 0.36, 0, car.size * 0.36, -Math.PI / 2, Math.PI / 2, true);
        ctx.lineTo(car.size * 1.4 - car.size * 0.36, car.size * 0.36);
        ctx.arc(car.size * 1.4 - car.size * 0.36, 0, car.size * 0.36, Math.PI / 2, -Math.PI / 2, true);
        ctx.closePath();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = car.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = car.color;
        ctx.fill();
        ctx.globalAlpha = alpha * 0.7;
        ctx.beginPath();
        ctx.ellipse(0, 0, car.size * 0.7, car.size * 0.45, 0, 0, 2 * Math.PI);
        ctx.fillStyle = car.windowColor;
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
