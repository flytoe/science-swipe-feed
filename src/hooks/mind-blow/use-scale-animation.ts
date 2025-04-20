
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
        // Smoother growth curve
        const baseScale = 1.1 + (progress * 0.9); // More gradual scaling
        const pulseAmount = Math.sin(holdDuration / 150) * 0.05; // Gentler pulse
        
        setScale(baseScale + pulseAmount);
        
        // Smoother floating movement
        const baseTranslate = -10 * progress;
        const floatAmount = Math.sin(holdDuration / 200) * 3;
        setTranslateY(baseTranslate + floatAmount);
      }
    }, 33); // ~30fps for better performance
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
