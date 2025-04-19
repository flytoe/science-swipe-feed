
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
      
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        emoji,
        x,
        y,
        rotation: Math.random() * 360
      });
    }
    
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  };

  const createExplosion = () => {
    const scaleLevel = Math.floor(scale);
    const particleCount = Math.min(12 + (scaleLevel * 8), 48);
    const distance = 200 + (scaleLevel * 50);
    const emojis = ['🤯', '✨', '💡', '🔥', '⚡️', '💫'].slice(0, 2 + scaleLevel);
    
    createParticles(particleCount, distance, emojis);
  };

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTapTime.current < 300) return false;
    lastTapTime.current = now;
    
    createParticles(3, 100, ['🤯']);
    return true;
  };

  const startHolding = () => {
    setIsHolding(true);
    setScale(1);
    
    scaleInterval.current = setInterval(() => {
      setScale(prev => Math.min(prev + 0.8, 4));
    }, 100);
  };

  const stopHolding = () => {
    if (scaleInterval.current) {
      clearInterval(scaleInterval.current);
    }
    
    if (isHolding) {
      setIsHolding(false);
      setScale(1);
      createExplosion();
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
