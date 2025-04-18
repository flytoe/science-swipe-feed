
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

  const createSingleParticle = () => {
    setParticles([{
      id: `particle-${Date.now()}`,
      emoji: '🤯',
      x: 0,
      y: -100,
      rotation: Math.random() * 20 - 10
    }]);
    
    setTimeout(() => setParticles([]), 1000);
  };

  const createExplosion = () => {
    if (scale >= 2) {
      const newParticles: Particle[] = [];
      const emojis = ['🤯', '✨', '💡'];
      const particleCount = 24;

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 300;
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
    }
  };

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTapTime.current < 300) return false;
    lastTapTime.current = now;
    
    createSingleParticle();
    return true;
  };

  const startHolding = () => {
    setIsHolding(true);
    setScale(1);
    
    scaleInterval.current = setInterval(() => {
      setScale(prev => Math.min(prev + 0.5, 4));
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
