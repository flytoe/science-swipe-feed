
import { useState, useRef, useEffect } from 'react';
import type { Particle } from '../components/mind-blow/ParticleSystem';

export const useMindBlowAnimation = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [scale, setScale] = useState(1);
  const [isHolding, setIsHolding] = useState(false);
  const scaleInterval = useRef<NodeJS.Timeout>();
  const lastTapTime = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (scaleInterval.current) {
        clearInterval(scaleInterval.current);
      }
    };
  }, []);

  const createParticles = (count: number, distance: number, emojis: string[]) => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const rotation = Math.random() * 360;
      const size = 1 + Math.random() * 1.5; // varying sizes
      
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        emoji,
        x,
        y,
        rotation,
        size
      });
    }
    
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  };

  const createExplosion = () => {
    const scaleLevel = Math.max(1, Math.floor(scale));
    const particleCount = Math.min(16 + (scaleLevel * 12), 64); // More particles based on scale
    const distance = 200 + (scaleLevel * 80); // Larger burst distance based on scale
    
    // More emoji variety with higher scale levels
    const baseEmojis = ['🤯', '✨', '💡'];
    const extraEmojis = ['🔥', '⚡️', '💫', '🌟', '🚀', '💥'];
    const selectedExtraEmojis = extraEmojis.slice(0, Math.min(scaleLevel, extraEmojis.length));
    const emojis = [...baseEmojis, ...selectedExtraEmojis];
    
    createParticles(particleCount, distance, emojis);
  };

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTapTime.current < 300) return false;
    lastTapTime.current = now;
    
    createParticles(5, 120, ['🤯', '✨']); // Slightly more impressive tap effect
    return true;
  };

  const startHolding = () => {
    setIsHolding(true);
    setScale(1);
    
    // Faster scaling rate for more immediate feedback
    scaleInterval.current = setInterval(() => {
      setScale(prev => Math.min(prev + 0.12, 4));
    }, 50); // Shorter interval for faster scaling
  };

  const stopHolding = () => {
    if (scaleInterval.current) {
      clearInterval(scaleInterval.current);
    }
    
    if (isHolding) {
      setIsHolding(false);
      createExplosion();
      // Reset scale after a slight delay to make the explosion more visible
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
