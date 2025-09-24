'use client';

import { useEffect, useRef, useState } from 'react';

export default function AncientDarkGalaxy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying] = useState(true);
  const [currentValue, setCurrentValue] = useState(2);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    let animationFrame = 0;

    // Enhanced Ancient Dark Galaxy with full exponential progression
    const drawAncientDarkGalaxy = () => {
      ctx.fillStyle = 'rgba(8, 2, 12, 0.02)'; // Even more subtle fade
      ctx.fillRect(0, 0, width, height);

      // 2 seconds per doubling: 8 doublings (2^1 to 2^9 = 512) = 16 seconds growth + 8 seconds dissolve = 24 seconds total
      const secondsPerDoubling = 2;
      const doublingSteps = 8; // From 2^1 to 2^9 (512)
      const growthPhase = secondsPerDoubling * doublingSteps * 60; // 16 seconds * 60fps = 960 frames
      const dissolvePhase = (secondsPerDoubling * doublingSteps * 0.5) * 60; // 8 seconds * 60fps = 480 frames
      const totalCycle = growthPhase + dissolvePhase; // 24 seconds total = 1440 frames
      
      const localFrame = animationFrame % totalCycle;
      
      // Calculate current exponential value (2^1 to 2^9 = 512)
      let exponentialStep;
      let galaxyOpacity = 1;
      
      if (localFrame < growthPhase) {
        // Growing phase: 2^1 to 2^9 over 16 seconds (2 seconds per step)
        const growthProgress = localFrame / growthPhase;
        exponentialStep = 1 + (growthProgress * 8); // 1 to 9
      } else {
        // Dissolving phase: maintain 512 but fade opacity over 8 seconds
        exponentialStep = 9; // Keep at maximum (2^9 = 512)
        
        const dissolveProgress = (localFrame - growthPhase) / dissolvePhase;
        galaxyOpacity = 1 - (dissolveProgress * 0.9); // Fade to nearly invisible
      }
      
      const currentExp = Math.floor(exponentialStep);
      const currentPower = Math.pow(2, currentExp);
      setCurrentValue(currentPower);
      
      // Calculate number of spiral arms (grows exponentially)
      const maxSpirals = Math.min(currentExp, 10);
      
      for (let s = 0; s < maxSpirals; s++) {
        const spiralStars = Math.pow(2, s + 1);
        const rotation = animationFrame * 0.0015 * (s + 1); // Ultra slow rotation
        
        for (let i = 0; i < spiralStars; i++) {
          const t = i / spiralStars;
          const angle = t * Math.PI * 4.5 + rotation;
          const radius = t * Math.min(width, height) * 0.45;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          const size = 2 + (1 - t) * 6; // Larger stars
          const baseHue = 280; // Deep purple
          const hue = baseHue + s * 15 + t * 25;
          const baseOpacity = (0.9 - t * 0.4) * galaxyOpacity;
          
          // Dark matter halo (largest layer)
          ctx.fillStyle = `hsla(${hue}, 100%, 25%, ${baseOpacity * 0.12})`;
          ctx.beginPath();
          ctx.arc(x, y, size * 10, 0, Math.PI * 2);
          ctx.fill();
          
          // Cosmic dust cloud
          ctx.fillStyle = `hsla(${hue}, 100%, 40%, ${baseOpacity * 0.2})`;
          ctx.beginPath();
          ctx.arc(x, y, size * 6, 0, Math.PI * 2);
          ctx.fill();
          
          // Stellar atmosphere
          ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${baseOpacity * 0.4})`;
          ctx.beginPath();
          ctx.arc(x, y, size * 3, 0, Math.PI * 2);
          ctx.fill();
          
          // Star corona
          ctx.fillStyle = `hsla(${hue}, 100%, 80%, ${baseOpacity * 0.7})`;
          ctx.beginPath();
          ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
          ctx.fill();
          
          // Ancient star core
          ctx.fillStyle = `hsla(${hue}, 100%, 90%, ${baseOpacity})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
          
          // Gravitational lensing rings (slower pulse)
          if (Math.sin(animationFrame * 0.03 + i) > 0.8) {
            for (let ring = 1; ring <= 3; ring++) {
              ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${0.3 - ring * 0.08})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(x, y, size * (2 + ring * 2), 0, Math.PI * 2);
              ctx.stroke();
            }
          }
          
          // Dark matter tendrils connecting nearby stars
          if (i > 0 && Math.random() > 0.85) {
            const prevT = (i - 1) / spiralStars;
            const prevAngle = prevT * Math.PI * 4.5 + rotation;
            const prevRadius = prevT * Math.min(width, height) * 0.45;
            const prevX = centerX + Math.cos(prevAngle) * prevRadius;
            const prevY = centerY + Math.sin(prevAngle) * prevRadius;
            
            ctx.strokeStyle = `hsla(${hue}, 100%, 40%, ${baseOpacity * 0.15})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(prevX, prevY);
            ctx.stroke();
          }
        }
      }
      
      // Massive galactic center - Dark matter supermassive black hole
      const coreSize = 60 + Math.sin(animationFrame * 0.02) * 8;
      const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreSize);
      centerGradient.addColorStop(0, `rgba(200, 120, 255, ${0.9 * galaxyOpacity})`);
      centerGradient.addColorStop(0.1, `rgba(180, 80, 255, ${0.8 * galaxyOpacity})`);
      centerGradient.addColorStop(0.3, `rgba(150, 40, 255, ${0.6 * galaxyOpacity})`);
      centerGradient.addColorStop(0.6, `rgba(100, 0, 200, ${0.4 * galaxyOpacity})`);
      centerGradient.addColorStop(0.8, `rgba(50, 0, 100, ${0.2 * galaxyOpacity})`);
      centerGradient.addColorStop(1, `rgba(20, 0, 50, ${0.05 * galaxyOpacity})`);
      
      ctx.fillStyle = centerGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Event horizon effects
      for (let i = 0; i < 5; i++) {
        const radius = coreSize * (0.3 + i * 0.15);
        ctx.strokeStyle = `hsla(280, 100%, ${60 - i * 10}%, ${(0.4 - i * 0.06) * galaxyOpacity})`;
        ctx.lineWidth = 2 - i * 0.3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const animate = () => {
      drawAncientDarkGalaxy();
      animationFrame++;

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animate();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-lg">
        <canvas
          ref={canvasRef}
          className="w-full aspect-square"
          style={{ 
            background: 'transparent'
          }}
        />
        
        {/* Current Value Display */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 backdrop-blur-sm px-3 py-2 rounded-lg border border-purple-500/30">
          <div className="text-purple-300 text-xs">Exponential Growth</div>
          <div className="text-white font-bold text-xl">{currentValue}x</div>
          <div className="text-purple-200 text-xs">2^{Math.log2(currentValue).toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
}