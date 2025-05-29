'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
  hue: number;
  saturation: number;
  lightness: number;
  rotationSpeed: number;
  rotation: number;
  scaleDirection: number;
  scale: number;
  lastDirectionChange: number;
  pathMemory: Array<{x: number, y: number}>;
}

// Sampled hero image colors (example):
// Blue: #1d5cff
// Gold: #ffd700

export default function HeroSection() {
  const [content, setContent] = useState({ headline: '', subheadline: '' });
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const textAreasRef = useRef<Array<{x: number, y: number, width: number, height: number}>>([]);

  // Initialize random bubbles with unique characteristics
  const initializeBubbles = () => {
    const newBubbles: Bubble[] = [];
    const bubbleCount = 9; // Reduced from 18 to 9 (50% reduction)
    
    for (let i = 0; i < bubbleCount; i++) {
      // Create unique random characteristics for each bubble
      const size = Math.random() * 60 + 20; // 20-80px diameter (never larger than background circles)
      
      // Calculate maximum speed based on diameter (diameter per second = diameter/60 per frame at 60fps)
      const maxSpeedPerFrame = size / 60;
      
      // Generate random initial velocity within the diameter-based speed limit
      const randomDirection = Math.random() * 2 * Math.PI; // Random direction in radians
      const randomSpeed = Math.random() * maxSpeedPerFrame * 0.8; // Use up to 80% of max speed for variety
      
      const bubble: Bubble = {
        id: i,
        x: Math.random() * (window.innerWidth - size),
        y: Math.random() * (window.innerHeight - size),
        size,
        opacity: Math.random() * 0.4 + 0.1, // 0.1 to 0.5 opacity
        vx: Math.cos(randomDirection) * randomSpeed, // Velocity based on diameter constraint
        vy: Math.sin(randomDirection) * randomSpeed, // Velocity based on diameter constraint
        hue: Math.random() * 120 + 180, // Blue to cyan range
        saturation: Math.random() * 40 + 60, // 60-100% saturation
        lightness: Math.random() * 30 + 45, // 45-75% lightness
        rotationSpeed: (Math.random() - 0.5) * 0.8, // Reduced from 4 to 0.8 (20% of original)
        rotation: Math.random() * 360,
        scaleDirection: Math.random() > 0.5 ? 1 : -1,
        scale: 1,
        lastDirectionChange: Date.now() + Math.random() * 25000, // Increased from 5000 to 25000 (5x slower)
        pathMemory: []
      };
      newBubbles.push(bubble);
    }
    
    setBubbles(newBubbles);
  };

  // Get text areas to avoid
  const updateTextAreas = () => {
    if (!containerRef.current) return;
    
    const textElements = containerRef.current.querySelectorAll('h1, div[class*="subheadline"]');
    const areas: Array<{x: number, y: number, width: number, height: number}> = [];
    
    textElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();
      
      areas.push({
        x: rect.left - containerRect.left - 50, // Add padding
        y: rect.top - containerRect.top - 50,
        width: rect.width + 100,
        height: rect.height + 100
      });
    });
    
    textAreasRef.current = areas;
  };

  // Check if position overlaps with text areas
  const isOverlappingText = useCallback((x: number, y: number, size: number) => {
    return textAreasRef.current.some(area => 
      x < area.x + area.width &&
      x + size > area.x &&
      y < area.y + area.height &&
      y + size > area.y
    );
  }, []);

  // Generate truly random movement that avoids repeated patterns
  const updateBubble = useCallback((bubble: Bubble, containerWidth: number, containerHeight: number): Bubble => {
    const now = Date.now();
    let newX = bubble.x + bubble.vx;
    let newY = bubble.y + bubble.vy;
    let newVx = bubble.vx;
    let newVy = bubble.vy;

    // Add random direction changes to prevent repetitive patterns
    if (now > bubble.lastDirectionChange) {
      const randomFactor = 0.06; // Reduced from 0.3 to 0.06 (20% of original)
      newVx += (Math.random() - 0.5) * randomFactor;
      newVy += (Math.random() - 0.5) * randomFactor;
      
      bubble.lastDirectionChange = now + Math.random() * 15000 + 5000; // Increased from 3000+1000 to 15000+5000 (5x slower)
    }

    // Apply diameter-based speed limiting
    // Maximum speed = diameter per second = diameter / 60 pixels per frame (at 60fps)
    const maxSpeedPerFrame = bubble.size / 60;
    const currentSpeed = Math.sqrt(newVx * newVx + newVy * newVy);
    
    if (currentSpeed > maxSpeedPerFrame) {
      // Scale down velocity to stay within diameter-per-second limit
      const speedRatio = maxSpeedPerFrame / currentSpeed;
      newVx *= speedRatio;
      newVy *= speedRatio;
    }

    // Bounce off walls with random angle variation
    if (newX <= 0 || newX >= containerWidth - bubble.size) {
      newVx = -newVx + (Math.random() - 0.5) * 0.1; // Reduced from 0.5 to 0.1 (20% of original)
      newX = Math.max(0, Math.min(containerWidth - bubble.size, newX));
    }
    if (newY <= 0 || newY >= containerHeight - bubble.size) {
      newVy = -newVy + (Math.random() - 0.5) * 0.1; // Reduced from 0.5 to 0.1 (20% of original)
      newY = Math.max(0, Math.min(containerHeight - bubble.size, newY));
    }

    // Avoid text areas by adding repulsion force
    if (isOverlappingText(newX, newY, bubble.size)) {
      // Find nearest text area center
      let nearestArea = textAreasRef.current[0];
      let minDistance = Infinity;
      
      textAreasRef.current.forEach(area => {
        const areaCenterX = area.x + area.width / 2;
        const areaCenterY = area.y + area.height / 2;
        const distance = Math.sqrt(
          Math.pow(newX + bubble.size / 2 - areaCenterX, 2) + 
          Math.pow(newY + bubble.size / 2 - areaCenterY, 2)
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          nearestArea = area;
        }
      });

      // Add repulsion force away from text area
      const areaCenterX = nearestArea.x + nearestArea.width / 2;
      const areaCenterY = nearestArea.y + nearestArea.height / 2;
      const bubbleCenterX = newX + bubble.size / 2;
      const bubbleCenterY = newY + bubble.size / 2;
      
      const repulsionX = bubbleCenterX - areaCenterX;
      const repulsionY = bubbleCenterY - areaCenterY;
      const repulsionDistance = Math.sqrt(repulsionX * repulsionX + repulsionY * repulsionY);
      
      if (repulsionDistance > 0) {
        const repulsionForce = 0.4; // Reduced from 2 to 0.4 (20% of original)
        newVx += (repulsionX / repulsionDistance) * repulsionForce;
        newVy += (repulsionY / repulsionDistance) * repulsionForce;
      }
    }

    // Apply speed limit again after repulsion forces to ensure we never exceed diameter per second
    const finalSpeed = Math.sqrt(newVx * newVx + newVy * newVy);
    if (finalSpeed > maxSpeedPerFrame) {
      const speedRatio = maxSpeedPerFrame / finalSpeed;
      newVx *= speedRatio;
      newVy *= speedRatio;
    }

    // Update rotation and scale for visual variety
    const newRotation = bubble.rotation + bubble.rotationSpeed;
    const scaleSpeed = 0.004; // Reduced from 0.02 to 0.004 (20% of original)
    let newScale = bubble.scale + (bubble.scaleDirection * scaleSpeed);
    let newScaleDirection = bubble.scaleDirection;
    
    if (newScale > 1.3 || newScale < 0.7) {
      newScaleDirection = -newScaleDirection;
      newScale = Math.max(0.7, Math.min(1.3, newScale));
    }

    // Update path memory to ensure uniqueness (keep last 20 positions)
    const newPathMemory = [...bubble.pathMemory, {x: newX, y: newY}];
    if (newPathMemory.length > 20) {
      newPathMemory.shift();
    }

    // Add slight random drift to prevent identical paths
    const driftX = (Math.random() - 0.5) * 0.02; // Reduced from 0.1 to 0.02 (20% of original)
    const driftY = (Math.random() - 0.5) * 0.02; // Reduced from 0.1 to 0.02 (20% of original)

    // Apply final velocity with drift, ensuring it still respects speed limit
    let finalVx = newVx + driftX;
    let finalVy = newVy + driftY;
    
    const driftSpeed = Math.sqrt(finalVx * finalVx + finalVy * finalVy);
    if (driftSpeed > maxSpeedPerFrame) {
      const speedRatio = maxSpeedPerFrame / driftSpeed;
      finalVx *= speedRatio;
      finalVy *= speedRatio;
    }

    return {
      ...bubble,
      x: newX,
      y: newY,
      vx: finalVx,
      vy: finalVy,
      rotation: newRotation,
      scale: newScale,
      scaleDirection: newScaleDirection,
      pathMemory: newPathMemory
    };
  }, [isOverlappingText]);

  useEffect(() => {
    // Load content from the server
    fetch('/api/hero')
      .then(response => response.json())
      .then(data => setContent(data))
      .catch(error => {
        console.error('Error loading hero content:', error);
        // Fallback content
        setContent({
          headline: 'Future Fast',
          subheadline: 'Accelerating Tomorrow&apos;s Innovations Today'
        });
      });

    // Initialize bubbles and start animation
    initializeBubbles();
    
    // Update text areas after content loads
    const timer = setTimeout(() => {
      updateTextAreas();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Start animation when bubbles are initialized
    if (bubbles.length > 0) {
      updateTextAreas();
      
      // Animation loop - defined inside useEffect to avoid dependency issues
      const animate = () => {
        if (!containerRef.current) return;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        setBubbles(prevBubbles => 
          prevBubbles.map(bubble => updateBubble(bubble, containerWidth, containerHeight))
        );
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [bubbles.length, updateBubble]);

  // Update text areas when window resizes
  useEffect(() => {
    const handleResize = () => {
      updateTextAreas();
      initializeBubbles(); // Reinitialize bubbles for new screen size
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <section
      ref={containerRef}
      className="relative flex flex-col items-center justify-center min-h-[65vh] md:min-h-[85vh] w-full overflow-hidden bg-black"
    >
      {/* Background image without darkening overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/FutureFastBack1.jpg)' }}
      />
      
      {/* Dynamic animated floating bubbles - random movement avoiding text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            className="absolute rounded-full"
            style={{
              left: `${bubble.x}px`,
              top: `${bubble.y}px`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              opacity: bubble.opacity,
              background: `linear-gradient(135deg, 
                hsl(${bubble.hue}, ${bubble.saturation}%, ${bubble.lightness}%), 
                hsl(${bubble.hue + 20}, ${bubble.saturation - 10}%, ${bubble.lightness + 10}%))`,
              transform: `rotate(${bubble.rotation}deg) scale(${bubble.scale})`,
              transition: 'none',
              willChange: 'transform, left, top',
              filter: 'blur(0.5px)',
              boxShadow: `0 0 ${bubble.size * 0.3}px hsla(${bubble.hue}, ${bubble.saturation}%, ${bubble.lightness}%, 0.3)`
            }}
          />
        ))}
      </div>
      
      {/* Subtle bottom gradient for text readability */}
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black to-transparent z-10" />
      <div className="absolute inset-x-0 bottom-[-20px] h-[20px] bg-black z-10" /> {/* Solid black bottom to ensure perfect transition */}
      
      {/* Animated content here */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full py-24">
        <h1 className="font-orbitron text-5xl md:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-[#1d5cff] via-[#ffd700] to-[#1d5cff] bg-clip-text text-transparent animate-fade-in drop-shadow-xl">
          {content.headline.split(' ').length > 4 ? (
            <>
              {content.headline.split(' ').slice(0, 4).join(' ')} <br className="hidden md:inline" />
              {content.headline.split(' ').slice(4).join(' ')}
            </>
          ) : (
            content.headline
          )}
        </h1>
        <div className="mt-6 flex justify-center w-full max-w-4xl mx-auto">
          <div className="font-orbitron text-lg md:text-xl lg:text-2xl text-center w-full max-w-3xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-black/70 via-indigo-950/60 to-black/70 border-2 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.3)] text-cyan-100 tracking-wide backdrop-blur-md flex items-center justify-center h-[110px] animate-pulse-subtle">
            {content.subheadline}
          </div>
        </div>
      </div>
    </section>
  );
}
