
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
    
    // Clear any existing interval
    if (scaleInterval.current) {
      clearInterval(scaleInterval.current);
    }
    
    // Start with initial scale bump
    setScale(1.2);
    setTranslateY(-5);
    
    scaleInterval.current = setInterval(() => {
      const holdDuration = Date.now() - holdStartTime.current;
      const maxHoldTime = 5000; // 5 seconds max
      
      if (holdDuration >= maxHoldTime) {
        clearInterval(scaleInterval.current);
      } else {
        const progress = Math.min(holdDuration / maxHoldTime, 1);
        // Enhanced growth rate with more dramatic scaling
        const baseScale = 1.2 + (progress * 1.8); // Faster initial growth
        const pulseAmount = Math.sin(holdDuration / 80) * 0.15; // Stronger and faster pulse
        
        setScale(prev => {
          const newScale = Math.min(baseScale + pulseAmount, 3);
          return newScale;
        });
        
        // More pronounced floating movement
        const baseTranslate = -20 * progress;
        const floatAmount = Math.sin(holdDuration / 100) * 5;
        setTranslateY(baseTranslate + floatAmount);
      }
    }, 16); // Smooth 60fps animation
  };

  const stopScaling = () => {
    if (scaleInterval.current) {
      clearInterval(scaleInterval.current);
    }
    setIsHolding(false);
    
    // Animate back to normal with a slight bounce
    setScale(1.1);
    setTranslateY(-2);
    
    // Reset to normal after a short delay
    setTimeout(() => {
      setScale(1);
      setTranslateY(0);
    }, 100);
  };

  return {
    scale,
    translateY,
    isHolding,
    startScaling,
    stopScaling,
    getHoldDuration: () => Date.now() - holdStartTime.current,
  };
};
