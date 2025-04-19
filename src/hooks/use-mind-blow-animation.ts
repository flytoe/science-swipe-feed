
import { useRef, useEffect } from 'react';
import { useParticleSystem } from './mind-blow/use-particle-system';
import { useScaleAnimation } from './mind-blow/use-scale-animation';

export const useMindBlowAnimation = () => {
  const lastTapTime = useRef<number>(0);
  const isLongPress = useRef(false);
  const longPressTimeout = useRef<NodeJS.Timeout>();
  const { particles, createParticles } = useParticleSystem();
  const { scale, isHolding, startScaling, stopScaling, getHoldDuration } = useScaleAnimation();

  useEffect(() => {
    return () => {
      if (longPressTimeout.current) {
        clearTimeout(longPressTimeout.current);
      }
    };
  }, []);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTapTime.current < 300) return false;
    lastTapTime.current = now;
    
    // Simple tap effect - just one emoji moving upward
    createParticles(1, 100, ['🤯'], 0);
    return true;
  };

  const startHolding = () => {
    isLongPress.current = false;
    // Set a timeout to detect long press
    longPressTimeout.current = setTimeout(() => {
      isLongPress.current = true;
    }, 200);
    startScaling();
  };

  const stopHolding = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
    
    if (isHolding) {
      const holdDuration = getHoldDuration();
      
      if (isLongPress.current) {
        const particleCount = Math.min(10 + Math.floor(holdDuration / 100), 50);
        const distance = 150 + (holdDuration / 10);
        
        const baseEmojis = ['🤯', '✨'];
        const extraEmojis = ['💥', '⚡️', '💫', '🌟', '🚀'];
        const selectedExtraEmojis = extraEmojis.slice(0, Math.min(Math.floor(holdDuration / 1000), extraEmojis.length));
        const emojis = [...baseEmojis, ...selectedExtraEmojis];
        
        createParticles(particleCount, distance, emojis, holdDuration);
      } else {
        handleTap();
      }
      
      stopScaling();
      return true;
    }
    return false;
  };

  return {
    particles,
    scale,
    isHolding,
    handleTap,
    startHolding,
    stopHolding
  };
};
