
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface MindBlowCoreProps {
  hasMindBlown: boolean;
  count: number;
  showCount: boolean;
  scale: number;
  isHolding: boolean;
  isLoading: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  buttonRef: React.RefObject<HTMLButtonElement>;
}

const MindBlowCore = ({
  hasMindBlown,
  count,
  showCount,
  scale,
  isHolding,
  isLoading,
  className = '',
  variant = 'default',
  size = 'default',
  buttonRef
}: MindBlowCoreProps) => {
  // Create a more pronounced wiggle animation
  const wiggleAnimation = isHolding ? {
    rotate: [0, -3, 3, -2, 2, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  } : {};
  
  return (
    <Button 
      variant={variant}
      size={size}
      disabled={isLoading}
      className={`relative group ${className} ${hasMindBlown ? 'bg-white hover:bg-white/90 text-black border-none' : ''}`}
      ref={buttonRef}
    >
      <motion.div
        className="relative"
        style={{ 
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          filter: isHolding ? `brightness(${1 + (scale - 1) * 0.4}) drop-shadow(0 0 ${scale * 2}px rgba(255,255,255,0.8))` : 'none'
        }}
        animate={hasMindBlown ? {
          scale: [1, 1.4, 1],
          rotate: [0, -10, 10, -10, 0]
        } : wiggleAnimation}
        transition={{ duration: 0.3 }}
      >
        <span className="inline-flex items-center">
          🤯
          {showCount && count > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              className="ml-1 text-sm font-bold"
            >
              +{count}
            </motion.span>
          )}
        </span>
      </motion.div>
    </Button>
  );
};

export default MindBlowCore;
