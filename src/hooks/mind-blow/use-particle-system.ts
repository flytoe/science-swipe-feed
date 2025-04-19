
import { useState } from 'react';
import type { Particle } from '../../components/mind-blow/ParticleSystem';

export const useParticleSystem = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const createParticles = (count: number, distance: number, emojis: string[], holdDuration: number = 0) => {
    const newParticles: Particle[] = [];
    const particleScale = 1 + (holdDuration / 1000);
    const duration = 0.8 + (holdDuration / 2000);
    
    if (count === 1) {
      // Single particle always moves upward
      newParticles.push({
        id: `particle-${Date.now()}-0`,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: 0,
        y: -distance, // Always move up
        rotation: Math.random() * 360,
        size: 1,
        scale: 1,
        duration: 0.8
      });
    } else {
      // Burst pattern for multiple particles
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
    }
    
    setParticles(newParticles);
    setTimeout(() => setParticles([]), (count === 1 ? 0.8 : duration) * 1000);
  };

  return {
    particles,
    createParticles,
  };
};
