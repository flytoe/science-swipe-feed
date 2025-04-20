
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
  
  // Simpler wiggle animation with scale consideration
  const wiggleAnimation = isHolding ? {
    rotate: [-2, 2, -1, 1, 0],
    transition: {
      duration: 0.3,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  } : {};

  // Single tap animation
  const tapAnimation = !isHolding ? {
    scale: [1, 1.1, 1],
    transition: { duration: 0.2 }
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
        animate={hasMindBlown ? tapAnimation : wiggleAnimation}
      >
        <div
          style={{ 
            transform: `scale(${scale}) translateY(${translateY}px)`,
            transition: 'transform 0.15s ease-out',
            transformOrigin: 'center bottom',
          }}
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
        </div>
      </motion.div>
    </Button>
  );
};

export default MindBlowCore;
