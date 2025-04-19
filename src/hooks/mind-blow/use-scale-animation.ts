
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
        // More dynamic scale increase based on hold duration
        const baseScale = 1 + (holdDuration / 1000) * 1.2; // Faster growth
        const pulseAmount = Math.sin(holdDuration / 100) * 0.15; // Stronger pulse
        setScale(prev => Math.min(baseScale + pulseAmount, 3.5));
        
        // Move emoji upward as it grows
        const baseTranslate = -30 * (baseScale - 1); // Move up more as it scales
        setTranslateY(baseTranslate);
      }
    }, 16); // Smooth 60fps animation
  };

  const stopScaling = () => {
    if (scaleInterval.current) {
      clearInterval(scaleInterval.current);
    }
    setIsHolding(false);
    setTranslateY(0); // Reset position
    setTimeout(() => setScale(1), 100);
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
