"use client";

import React, { useEffect, useRef } from 'react';

export default function ExponentialGrowthChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Create chart elements
    const createGrid = (gridId: string) => {
      const grid = document.getElementById(gridId);
      if (!grid) return;
      
      const gridSize = 10;
      const cellSize = 100 / gridSize;
      
      // Clear existing grid
      grid.innerHTML = '';
      
      // Only create vertical grid lines (Z axis) - remove horizontal lines
      for (let i = 0; i <= gridSize; i++) {
        const gridLine = document.createElement('div');
        gridLine.className = 'grid-line grid-line-z';
        gridLine.style.left = `${i * cellSize}%`;
        grid.appendChild(gridLine);
      }
    };
    
    const clearPoints = () => {
      const chartArea = document.getElementById('chart-area');
      if (!chartArea) return;
      
      const points = chartArea.querySelectorAll('.moving-point');
      const labels = chartArea.querySelectorAll('.value-label');
      
      points.forEach(point => {
        chartArea.removeChild(point);
      });
      
      labels.forEach(label => {
        chartArea.removeChild(label);
      });
    };
    
    const createMovingPoint = (type: string, step: number, value: number, delay: number) => {
      const chartArea = document.getElementById('chart-area');
      if (!chartArea) return;
      
      // Normalize against 2^10 (1024) to show the dramatic scale difference
      let normalizedHeight;
      if (type === 'exponential') {
        normalizedHeight = (value / 1024) * 85; // Use 85% of chart height max
      } else {
        normalizedHeight = (value / 1024) * 100;
      }
      
      // Cap the height at 85% to stay within visible area
      const cappedHeight = Math.min(normalizedHeight, 85);
      
      // Create the moving point
      const point = document.createElement('div');
      point.className = `moving-point moving-point-${type}`;
      
      // Position based on step (horizontal) and value (vertical)
      // Adjust to spread dots evenly with padding on both sides to prevent cropping
      const xPos = 5 + ((step - 1) / 9 * 90); // This spreads positions 1-10 from 5% to 95% of width
      point.style.left = `${xPos}%`;
      point.style.bottom = `${cappedHeight}%`;
      
      // Add animation delay based on step
      point.style.animationDelay = `${delay}s`;
      
      // Add value label
      const label = document.createElement('div');
      label.className = `value-label value-label-${type}`;
      label.textContent = value.toString();
      label.style.left = `${xPos}%`;
      label.style.bottom = `${cappedHeight + 5}%`;
      label.style.animationDelay = `${delay + 0.2}s`;
      
      // Add elements to chart
      chartArea.appendChild(point);
      chartArea.appendChild(label);
    };
    
    const animateLinearGrowth = () => {
      for (let i = 1; i <= 10; i++) {
        createMovingPoint('linear', i, i, (i - 1) * 0.18); // 40% faster (0.3 * 0.6 = 0.18)
      }
    };
    
    const animateExponentialGrowth = () => {
      for (let i = 1; i <= 10; i++) {
        createMovingPoint('exponential', i, Math.pow(2, i), (i - 1) * 0.18); // 40% faster (0.3 * 0.6 = 0.18)
      }
    };
    
    const startAnimationLoop = () => {
      const exponentialDuration = 3000; // 40% faster (5000 * 0.6 = 3000)
      const displayDuration = 2000;
      
      function runAnimation() {
        clearPoints();
        
        animateLinearGrowth();
        
        // Remove delay between linear and exponential animations
        animateExponentialGrowth();
        
        setTimeout(() => {
          setTimeout(() => {
            runAnimation();
          }, displayDuration);
        }, exponentialDuration);
      }
      
      runAnimation();
    };
    
    // Initialize the chart
    createGrid('grid');
    startAnimationLoop();
    
    // Cleanup function
    return () => {
      const chartArea = document.getElementById('chart-area');
      if (chartArea) {
        chartArea.innerHTML = '';
      }
    };
  }, []);
  
  return (
    <div ref={chartRef} className="w-full h-full flex flex-col items-center justify-center">
      <div className="chart-container w-full aspect-square relative perspective-[1200px] max-w-[500px] mx-auto">
        {/* Semi-transparent gradient background */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-900/10 via-indigo-900/15 to-purple-900/10 border border-cyan-500/20"></div>
        
        <div className="chart w-full h-full relative overflow-hidden transform-style-3d p-4">
          <div id="chart-area" className="chart-area w-full h-full relative transform-style-3d">
            <div id="grid" className="grid absolute top-0 left-0 w-full h-full transform-style-3d" 
                 style={{ transform: 'rotateX(60deg) translateZ(-100px)' }}></div>
          </div>
        </div>
      </div>
      
      {/* Legend moved to bottom with increased spacing and adjusted position */}
      <div className="legend flex justify-center gap-6 mt-8 ml-8">
        <span className="legend-item flex items-center gap-2">
          <span className="legend-dot-linear w-4 h-4 rounded-full inline-block"></span> 
          <span className="text-xs md:text-sm">Linear Growth</span>
        </span>
        <span className="legend-item flex items-center gap-2">
          <span className="legend-dot-exponential w-4 h-4 rounded-full inline-block"></span> 
          <span className="text-xs md:text-sm">Exponential Growth</span>
        </span>
      </div>
    </div>
  );
}
