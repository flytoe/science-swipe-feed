
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
    
    if (scaleInterval.current) {
      clearInterval(scaleInterval.current);
    }
    
    // Initial scale animation
    setScale(1.1);
    setTranslateY(-2);
    
    // Slower interval for smoother growth
    scaleInterval.current = setInterval(() => {
      const holdDuration = Date.now() - holdStartTime.current;
      const maxHoldTime = 3000; // 3 seconds max for faster feedback
      
      if (holdDuration >= maxHoldTime) {
        clearInterval(scaleInterval.current);
      } else {
        const progress = Math.min(holdDuration / maxHoldTime, 1);
        
        // Enhanced growth curve - more noticeable but still smooth
        const baseScale = 1.1 + (progress * 1.4); // More dramatic scaling
        const pulseAmount = Math.sin(holdDuration / 150) * 0.08; // Stronger pulse
        
        setScale(baseScale + pulseAmount);
        
        // Enhanced floating movement
        const baseTranslate = -15 * progress;
        const floatAmount = Math.sin(holdDuration / 200) * 4;
        setTranslateY(baseTranslate + floatAmount);
      }
    }, 16); // ~60fps for smoother animation
  };

  const stopScaling = () => {
    if (scaleInterval.current) {
      clearInterval(scaleInterval.current);
    }
    setIsHolding(false);
    
    // Quick reset animation
    setScale(1);
    setTranslateY(0);
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
