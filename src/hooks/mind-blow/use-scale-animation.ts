
import { useState, useRef } from 'react';

export const useScaleAnimation = () => {
  const [scale, setScale] = useState(1);
  const [isHolding, setIsHolding] = useState(false);
  const scaleInterval = useRef<NodeJS.Timeout>();
  const holdStartTime = useRef<number>(0);

  const startScaling = () => {
    setIsHolding(true);
    holdStartTime.current = Date.now();
    setScale(1);
    
    scaleInterval.current = setInterval(() => {
      const holdDuration = Date.now() - holdStartTime.current;
      const maxHoldTime = 5000; // 5 seconds max
      
      if (holdDuration >= maxHoldTime) {
        clearInterval(scaleInterval.current);
      } else {
        // More dynamic scale increase based on hold duration
        const baseScale = 1 + (holdDuration / 1000) * 0.6; // Slower initial growth
        const pulseAmount = Math.sin(holdDuration / 100) * 0.1; // Add subtle pulse
        setScale(prev => Math.min(baseScale + pulseAmount, 2.5));
      }
    }, 16); // Smoother 60fps animation
  };

  const stopScaling = () => {
    if (scaleInterval.current) {
      clearInterval(scaleInterval.current);
    }
    setIsHolding(false);
    setTimeout(() => setScale(1), 100);
  };

  return {
    scale,
    isHolding,
    startScaling,
    stopScaling,
    getHoldDuration: () => Math.min(Date.now() - holdStartTime.current, 5000),
  };
};

