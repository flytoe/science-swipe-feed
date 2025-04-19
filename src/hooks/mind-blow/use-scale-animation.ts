
import { useState, useRef } from 'react';

export const useScaleAnimation = () => {
  const [scale, setScale] = useState(1);
  const [translateY, setTranslateY] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const scaleInterval = useRef<NodeJS.Timeout>();
  const holdStartTime = useRef<number>(0);

  const startScaling = () => {
    setIsHolding(true);
    holdStartTime.current = Date.now();
    setScale(1);
    setTranslateY(0);
    
    scaleInterval.current = setInterval(() => {
      const holdDuration = Date.now() - holdStartTime.current;
      const maxHoldTime = 5000; // 5 seconds max
      
      if (holdDuration >= maxHoldTime) {
        clearInterval(scaleInterval.current);
      } else {
        // Enhanced growth rate with more dramatic scaling
        const baseScale = 1 + (holdDuration / 1000) * 1.8; // Faster initial growth
        const pulseAmount = Math.sin(holdDuration / 80) * 0.2; // Stronger and faster pulse
        setScale(prev => Math.min(baseScale + pulseAmount, 4)); // Increased max scale
        
        // More pronounced upward movement
        const baseTranslate = -50 * (baseScale - 1); // Move up more dramatically as it scales
        setTranslateY(baseTranslate + Math.sin(holdDuration / 100) * 10); // Add subtle floating effect
      }
    }, 16); // Smooth 60fps animation
  };

  const stopScaling = () => {
    if (scaleInterval.current) {
      clearInterval(scaleInterval.current);
    }
    setIsHolding(false);
    setTranslateY(0); // Reset position
    setTimeout(() => setScale(1), 100); // Slight delay before resetting scale for smoother animation
  };

  return {
    scale,
    translateY,
    isHolding,
    startScaling,
    stopScaling,
    getHoldDuration: () => Math.min(Date.now() - holdStartTime.current, 5000),
  };
};
