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

      // --- Animated monorail cars ---
      for (let i = 0; i < carsRef.current.length; i++) {
        const car = carsRef.current[i];
        let prog = expCurve(((now + car.delay) * car.speed) % 1.0, 2.7);
        if (prog < 0.01) prog += 0.02 * Math.random();
        const frac = car.trackFrac;
        const baseX = lerp(0, width, frac);
        // --- Calculate position and tangent for the car ---
        function curvePos(tt: number) {
          const expT = expCurve(tt, 2.7);
          const x = lerp(baseX, vanishingX, tt);
          const y = lerp(bottomY, vanishingY, expT);
          return [x, y];
        }
        // Position
        const [x, y] = curvePos(prog);
        // Tangent (direction)
        const [x2, y2] = curvePos(Math.min(1, prog + 0.01));
        const angle = Math.atan2(y2 - y, x2 - x);
        // --- Draw monorail car ---
        const carLen = car.size * 2.8;
        const carWid = car.size * 0.72;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.beginPath();
        // Capsule body
        ctx.moveTo(-carLen / 2 + carWid / 2, -carWid / 2);
        ctx.arc(-carLen / 2 + carWid / 2, 0, carWid / 2, -Math.PI / 2, Math.PI / 2, true);
        ctx.lineTo(carLen / 2 - carWid / 2, carWid / 2);
        ctx.arc(carLen / 2 - carWid / 2, 0, carWid / 2, Math.PI / 2, -Math.PI / 2, true);
        ctx.closePath();
        ctx.globalAlpha = car.alpha * (1 - prog);
        ctx.fillStyle = car.color;
        ctx.shadowBlur = 18;
        ctx.shadowColor = car.color;
        ctx.fill();
        // Window
        ctx.globalAlpha = car.alpha * 0.7 * (1 - prog);
        ctx.beginPath();
        ctx.ellipse(0, 0, carLen * 0.36, carWid * 0.32, 0, 0, 2 * Math.PI);
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
