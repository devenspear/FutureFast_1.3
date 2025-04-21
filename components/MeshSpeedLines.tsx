"use client";
import React, { useRef, useEffect } from "react";

/**
 * MeshSpeedLines renders animated mesh curves ("speed lines") with parallax z-depth on scroll.
 * The effect is achieved with HTML canvas for performance and flexibility.
 */
const NUM_LINES = 14;
const LINE_COLOR = [
  "rgba(168,85,247,0.18)", // purple
  "rgba(34,211,238,0.12)", // cyan
  "rgba(236,72,153,0.13)", // pink
  "rgba(255,255,255,0.10)" // white
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

const MeshSpeedLines: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<unknown[]>([]);
  const animationRef = useRef<number>(0);

  // Generate mesh lines
  useEffect(() => {
    const lines = [];
    const width = window.innerWidth;
    const height = window.innerHeight * 0.9;
    for (let i = 0; i < NUM_LINES; i++) {
      const yStart = randomBetween(height * 0.05, height * 0.95);
      const yEnd = yStart + randomBetween(-40, 40);
      const ctrl1 = [randomBetween(width * 0.1, width * 0.4), randomBetween(0, height)];
      const ctrl2 = [randomBetween(width * 0.6, width * 0.9), randomBetween(0, height)];
      lines.push({
        color: LINE_COLOR[i % LINE_COLOR.length],
        width: randomBetween(1.2, 2.7),
        yStart,
        yEnd,
        ctrl1,
        ctrl2,
        baseOffset: randomBetween(-60, 60),
        speed: randomBetween(0.07, 0.18),
        depth: randomBetween(0.5, 1.5)
      });
    }
    linesRef.current = lines;
  }, []);

  // Animate and parallax
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight * 0.9;
    canvas.width = width;
    canvas.height = height;

    function draw() {
      if (!ctx) return; // Fix: ensure ctx is not null before using
      ctx.clearRect(0, 0, width, height);
      const scrollY = window.scrollY;
      linesRef.current.forEach((line, i) => {
        // Parallax: lines at greater depth move slower on scroll
        if (typeof line !== 'object' || line === null || !('depth' in line) || !('yStart' in line) || !('baseOffset' in line)) {
          return;
        }
        const typedLine = line as {
          depth: number;
          yStart: number;
          baseOffset: number;
          ctrl1: [number, number];
          ctrl2: [number, number];
          yEnd: number;
          color: string;
          width: number;
        };
        const parallax = scrollY * (0.12 + 0.13 * typedLine.depth);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(-60, typedLine.yStart + typedLine.baseOffset + Math.sin(Date.now()/1100 + i) * 8 + parallax);
        ctx.bezierCurveTo(
          typedLine.ctrl1[0],
          typedLine.ctrl1[1] + Math.cos(Date.now()/1200 + i*2) * 18 + parallax * 0.8,
          typedLine.ctrl2[0],
          typedLine.ctrl2[1] + Math.sin(Date.now()/1300 + i*3) * 18 + parallax * 0.5,
          width + 60,
          typedLine.yEnd + typedLine.baseOffset + Math.cos(Date.now()/1000 + i) * 8 + parallax
        );
        ctx.strokeStyle = typedLine.color;
        ctx.lineWidth = typedLine.width + Math.sin(Date.now()/900 + i) * 0.3;
        ctx.shadowBlur = 4;
        ctx.shadowColor = typedLine.color;
        ctx.globalAlpha = 0.92;
        ctx.stroke();
        ctx.restore();
      });
    }

    function animate() {
      draw();
      animationRef.current = requestAnimationFrame(animate);
    }
    animate();
    // Responsive resize
    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight * 0.9;
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

export default MeshSpeedLines;
