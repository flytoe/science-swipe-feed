
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface MindBlowCoreProps {
  hasMindBlown: boolean;
  count: number;
  showCount: boolean;
  scale: number;
  translateY: number;
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
  translateY,
  isHolding,
  isLoading,
  className = '',
  variant = 'default',
  size = 'default',
  buttonRef
}: MindBlowCoreProps) => {
  const isMobile = useIsMobile();
  
  // Enhanced wiggle animation based on scale
  const wiggleAnimation = isHolding ? {
    rotate: [-3 * scale, 3 * scale, -2 * scale, 2 * scale, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  } : {};

  // Single tap animation
  const tapAnimation = !isHolding ? {
    scale: [1, 1.2, 1],
    transition: { duration: 0.3 }
  } : {};
  
  return (
    <Button 
      variant={variant}
      size={size}
      disabled={isLoading}
      className={`relative group touch-none select-none ${className} ${hasMindBlown ? 'bg-white hover:bg-white/90 text-black border-none' : ''}`}
      ref={buttonRef}
    >
      <motion.div
        className="relative z-50"
        style={{ 
          transform: `scale(${scale}) translateY(${translateY}px)`,
          transformOrigin: 'center 60%',
          filter: isHolding ? `brightness(${1 + (scale - 1) * 0.3}) drop-shadow(0 0 ${scale * 5}px rgba(255,255,255,0.8))` : 'none',
          transition: 'transform 0.1s ease-out, filter 0.2s ease-out'
        }}
        animate={hasMindBlown ? tapAnimation : wiggleAnimation}
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
