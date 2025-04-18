
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Particle {
  id: string;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
}

interface ParticleSystemProps {
  particles: Particle[];
}

const ParticleSystem = ({ particles }: ParticleSystemProps) => {
  return (
    <AnimatePresence>
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute pointer-events-none"
          initial={{ 
            x: 0, 
            y: 0, 
            opacity: 1, 
            rotate: 0 
          }}
          animate={{ 
            x: particle.x,
            y: particle.y,
            opacity: 0,
            rotate: particle.rotation 
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 1,
            ease: "easeOut"
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default ParticleSystem;
