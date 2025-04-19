
import { useState, useRef, useEffect } from 'react';
import type { Particle } from '../components/mind-blow/ParticleSystem';

export const useMindBlowAnimation = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [scale, setScale] = useState(1);
  const [isHolding, setIsHolding] = useState(false);
  const scaleInterval = useRef<NodeJS.Timeout>();
  const holdStartTime = useRef<number>(0);
  const lastTapTime = useRef<number>(0);
  const isLongPress = useRef(false);

  useEffect(() => {
    return () => {
      if (scaleInterval.current) {
        clearInterval(scaleInterval.current);
      }
    };
  }, []);

  const createParticles = (count: number, distance: number, emojis: string[], holdDuration: number = 0) => {
    const newParticles: Particle[] = [];
    const particleScale = 1 + (holdDuration / 1000); // Scale based on hold duration
    const duration = 0.8 + (holdDuration / 2000); // Longer animation for longer holds
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const adjustedDistance = distance * (1 + (holdDuration / 2000));
      const x = Math.cos(angle) * adjustedDistance;
      const y = Math.sin(angle) * adjustedDistance;
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const rotation = Math.random() * 360 * (1 + holdDuration / 1000);
      const size = 1 + Math.random() * (1 + holdDuration / 1000);
      
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        emoji,
        x,
        y,
        rotation,
        size,
        scale: particleScale,
        duration
      });
    }
    
    setParticles(newParticles);
    setTimeout(() => setParticles([]), duration * 1000);
  };

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTapTime.current < 300) return false;
    lastTapTime.current = now;
    
    // Simple tap effect - just one emoji
    createParticles(1, 100, ['🤯'], 0);
    return true;
  };

  const startHolding = () => {
    setIsHolding(true);
    holdStartTime.current = Date.now();
    isLongPress.current = false;
    setScale(1);
    
    // Start scaling animation
    scaleInterval.current = setInterval(() => {
      const holdDuration = Date.now() - holdStartTime.current;
      const maxHoldTime = 5000; // 5 seconds max
      
      if (holdDuration >= 200) {
        isLongPress.current = true;
      }
      
      if (holdDuration >= maxHoldTime) {
        clearInterval(scaleInterval.current);
      } else {
        setScale(prev => Math.min(prev + 0.15, 4));
      }
    }, 50);
  };

  const stopHolding = () => {
    if (scaleInterval.current) {
      clearInterval(scaleInterval.current);
    }
    
    if (isHolding) {
      const holdDuration = Math.min(Date.now() - holdStartTime.current, 5000);
      setIsHolding(false);
      
      if (isLongPress.current) {
        // Calculate particles based on hold duration
        const particleCount = Math.min(10 + Math.floor(holdDuration / 100), 50);
        const distance = 150 + (holdDuration / 10);
        
        // More emoji variety with longer holds
        const baseEmojis = ['🤯', '✨'];
        const extraEmojis = ['💥', '⚡️', '💫', '🌟', '🚀'];
        const selectedExtraEmojis = extraEmojis.slice(0, Math.min(Math.floor(holdDuration / 1000), extraEmojis.length));
        const emojis = [...baseEmojis, ...selectedExtraEmojis];
        
        createParticles(particleCount, distance, emojis, holdDuration);
      } else {
        handleTap();
      }
      
      // Reset scale after a slight delay
      setTimeout(() => setScale(1), 100);
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
