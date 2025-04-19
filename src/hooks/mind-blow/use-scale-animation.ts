
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
        setScale(prev => Math.min(prev + 0.15, 4));
      }
    }, 50);
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
