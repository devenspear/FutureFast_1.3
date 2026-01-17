'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface BubbleData {
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
  rotation: number;
  rotationSpeed: number;
  scale: number;
  scaleDirection: number;
  lastDirectionChange: number;
}

/**
 * HeroSection with performance-optimized floating bubbles
 *
 * Optimizations applied:
 * 1. Uses useRef + direct DOM manipulation instead of React state (0 re-renders)
 * 2. Pauses animation when section is off-screen (IntersectionObserver)
 * 3. Pauses animation when browser tab is hidden (visibilitychange)
 * 4. Movement speed reduced 4x for calmer, more ambient feel
 * 5. Respects prefers-reduced-motion user preference
 */
export default function HeroSection() {
  const [content, setContent] = useState({
    headline: 'Future Fast',
    subheadline: 'Accelerating Tomorrow\'s Innovations Today'
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const bubblesContainerRef = useRef<HTMLDivElement>(null);
  const bubbleElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const bubbleDataRef = useRef<BubbleData[]>([]);
  const animationRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);
  const isTabVisibleRef = useRef(true);

  // Client-side cache for hero content (1 hour)
  const CACHE_KEY = 'hero_content_cache';
  const CACHE_DURATION = 60 * 60 * 1000;

  const getCachedContent = useCallback(() => {
    if (typeof window === 'undefined') return null;
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
      localStorage.removeItem(CACHE_KEY);
      return null;
    } catch {
      return null;
    }
  }, []);

  const setCachedContent = useCallback((data: typeof content) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Initialize bubble data (not state - just data)
  const initializeBubbles = useCallback(() => {
    const bubbles: BubbleData[] = [];
    const width = window.innerWidth;
    const height = window.innerHeight * 0.85;
    const bubbleCount = 6;

    for (let i = 0; i < bubbleCount; i++) {
      const size = Math.random() * 50 + 25; // 25-75px diameter

      // Much slower base speed (4x slower than original)
      const maxSpeed = size / 200000;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * maxSpeed * 0.5;

      bubbles.push({
        id: i,
        x: Math.random() * (width - size),
        y: Math.random() * (height - size),
        size,
        opacity: Math.random() * 0.35 + 0.1, // 0.1 to 0.45
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        hue: Math.random() * 120 + 180, // Blue to cyan
        saturation: Math.random() * 40 + 60,
        lightness: Math.random() * 30 + 45,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.002, // Very slow rotation
        scale: 1,
        scaleDirection: Math.random() > 0.5 ? 1 : -1,
        lastDirectionChange: Date.now() + Math.random() * 600000 + 300000, // 5-15 min
      });
    }

    bubbleDataRef.current = bubbles;
  }, []);

  // Update a single bubble's position (mutates data directly)
  const updateBubble = useCallback((bubble: BubbleData, width: number, height: number) => {
    const now = Date.now();

    // Update position
    bubble.x += bubble.vx;
    bubble.y += bubble.vy;

    // Random direction changes (very infrequent for smooth paths)
    if (now > bubble.lastDirectionChange) {
      const randomFactor = 0.00005; // Very subtle changes
      bubble.vx += (Math.random() - 0.5) * randomFactor;
      bubble.vy += (Math.random() - 0.5) * randomFactor;
      bubble.lastDirectionChange = now + Math.random() * 600000 + 300000;
    }

    // Speed limiting (4x slower than original)
    const maxSpeed = bubble.size / 200000;
    const currentSpeed = Math.sqrt(bubble.vx * bubble.vx + bubble.vy * bubble.vy);
    if (currentSpeed > maxSpeed) {
      const ratio = maxSpeed / currentSpeed;
      bubble.vx *= ratio;
      bubble.vy *= ratio;
    }

    // Bounce off walls with subtle randomization
    if (bubble.x <= 0 || bubble.x >= width - bubble.size) {
      bubble.vx = -bubble.vx + (Math.random() - 0.5) * 0.0005;
      bubble.x = Math.max(0, Math.min(width - bubble.size, bubble.x));
    }
    if (bubble.y <= 0 || bubble.y >= height - bubble.size) {
      bubble.vy = -bubble.vy + (Math.random() - 0.5) * 0.0005;
      bubble.y = Math.max(0, Math.min(height - bubble.size, bubble.y));
    }

    // Update rotation
    bubble.rotation += bubble.rotationSpeed;

    // Update scale (breathing effect)
    bubble.scale += bubble.scaleDirection * 0.00005;
    if (bubble.scale > 1.15 || bubble.scale < 0.85) {
      bubble.scaleDirection = -bubble.scaleDirection;
      bubble.scale = Math.max(0.85, Math.min(1.15, bubble.scale));
    }
  }, []);

  // Apply bubble data to DOM element (direct manipulation, no React)
  const applyBubbleToDOM = useCallback((bubble: BubbleData, element: HTMLDivElement | null) => {
    if (!element) return;

    element.style.transform = `translate(${bubble.x}px, ${bubble.y}px) rotate(${bubble.rotation}deg) scale(${bubble.scale})`;
  }, []);

  // Animation loop - uses refs, not state
  const animate = useCallback(() => {
    if (!isVisibleRef.current || !isTabVisibleRef.current) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Update each bubble and apply to DOM
    bubbleDataRef.current.forEach((bubble, i) => {
      updateBubble(bubble, width, height);
      applyBubbleToDOM(bubble, bubbleElementsRef.current[i]);
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [updateBubble, applyBubbleToDOM]);

  // Start/stop animation based on visibility
  const startAnimation = useCallback(() => {
    if (animationRef.current) return;
    animationRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // Load content
  useEffect(() => {
    const loadContent = async () => {
      const cached = getCachedContent();
      if (cached) {
        setContent(cached);
        return;
      }
      try {
        const response = await fetch('/api/hero');
        const data = await response.json();
        setCachedContent(data);
        setContent(data);
      } catch {
        // Use default content
      }
    };
    loadContent();
  }, [getCachedContent, setCachedContent]);

  // Initialize bubbles and set up visibility detection
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return; // Don't animate if user prefers reduced motion
    }

    initializeBubbles();

    // IntersectionObserver for scroll visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && isTabVisibleRef.current) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Tab visibility detection
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = !document.hidden;
      if (!document.hidden && isVisibleRef.current) {
        startAnimation();
      } else {
        stopAnimation();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle resize
    const handleResize = () => {
      initializeBubbles();
    };
    window.addEventListener('resize', handleResize);

    // Start animation if visible
    if (isVisibleRef.current && isTabVisibleRef.current) {
      startAnimation();
    }

    return () => {
      stopAnimation();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
    };
  }, [initializeBubbles, startAnimation, stopAnimation]);

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col items-center justify-center min-h-[65vh] md:min-h-[85vh] w-full overflow-hidden bg-black"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/FutureFastBack1.jpg)' }}
      />

      {/* Floating bubbles container */}
      <div
        ref={bubblesContainerRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const bubble = bubbleDataRef.current[i];
          return (
            <div
              key={i}
              ref={(el) => { bubbleElementsRef.current[i] = el; }}
              className="absolute rounded-full will-change-transform"
              style={{
                width: bubble?.size || 40,
                height: bubble?.size || 40,
                opacity: bubble?.opacity || 0.2,
                background: bubble
                  ? `linear-gradient(135deg,
                      hsl(${bubble.hue}, ${bubble.saturation}%, ${bubble.lightness}%),
                      hsl(${bubble.hue + 20}, ${bubble.saturation - 10}%, ${bubble.lightness + 10}%))`
                  : 'linear-gradient(135deg, hsl(200, 70%, 50%), hsl(220, 60%, 60%))',
                filter: 'blur(0.5px)',
                boxShadow: bubble
                  ? `0 0 ${bubble.size * 0.3}px hsla(${bubble.hue}, ${bubble.saturation}%, ${bubble.lightness}%, 0.3)`
                  : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Bottom gradient for text readability */}
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black to-transparent z-10" />
      <div className="absolute inset-x-0 bottom-[-20px] h-[20px] bg-black z-10" />

      {/* Hero content */}
      <div className="relative z-20 w-full h-full grid place-items-center p-4">
        <div className="w-full max-w-6xl space-y-8 md:space-y-12">
          {/* Headline */}
          <h1 className="font-orbitron text-5xl md:text-7xl font-bold text-center bg-gradient-to-r from-[#1d5cff] via-[#ffd700] to-[#1d5cff] bg-clip-text text-transparent animate-fade-in drop-shadow-xl">
            {content.headline.split(' ').length > 4 ? (
              <>
                <span className="block">{content.headline.split(' ').slice(0, 4).join(' ')}</span>
                <span className="block">{content.headline.split(' ').slice(4).join(' ')}</span>
              </>
            ) : (
              content.headline
            )}
          </h1>

          {/* Subheadline box */}
          <div className="relative w-full max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/10 to-blue-500/10 border-2 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]" />

              <div className="relative bg-gradient-to-r from-black/70 via-indigo-950/60 to-black/70 backdrop-blur-md p-4 md:p-5 rounded-xl">
                <div className="flex items-center justify-center">
                  <p className="font-orbitron text-base md:text-lg lg:text-xl text-center text-cyan-100 tracking-wide leading-tight py-3 px-2">
                    {content.subheadline}
                  </p>
                </div>
              </div>

              {/* Corner accents */}
              <div className="absolute -top-0.5 -left-0.5 w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-tl-md" />
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 border-t-2 border-r-2 border-cyan-400 rounded-tr-md" />
              <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 border-b-2 border-l-2 border-cyan-400 rounded-bl-md" />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 border-b-2 border-r-2 border-cyan-400 rounded-br-md" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
