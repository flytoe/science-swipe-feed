import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useMindBlowTracker } from '@/hooks/use-mind-blow-tracker';
import ReasonOverlay from './ReasonOverlay';
import { Sparkles, Zap } from 'lucide-react';

interface MindBlowButtonProps {
  hasMindBlown: boolean;
  count: number;
  isTopPaper: boolean;
  isLoading: boolean;
  onClick: (reason?: string) => void;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  showCount?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

const MindBlowButton: React.FC<MindBlowButtonProps> = ({
  hasMindBlown,
  count,
  isTopPaper,
  isLoading,
  onClick,
  size = 'default',
  showCount = true,
  className = '',
  variant = 'default'
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isHolding, setIsHolding] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const holdTimeoutRef = useRef<NodeJS.Timeout>();
  const controls = useAnimation();
  const lastTapTime = useRef<number>(0);
  
  const { increment, triggerBurst } = useMindBlowTracker();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node) && 
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowOverlay(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
      }
    };
  }, []);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (hasMindBlown) return;
    
    const now = Date.now();
    if (now - lastTapTime.current < 300) return;
    lastTapTime.current = now;
    
    controls.start({
      scale: [1, 1.2, 1],
      transition: { duration: 0.3 }
    });
    
    setTapCount(prev => prev + 1);
    increment();
    
    if (tapCount >= 2) {
      onClick();
      setTapCount(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (hasMindBlown) return;
    
    setIsHolding(true);
    controls.start({
      scale: [1, 4],
      transition: { duration: 0.5, ease: "easeOut" }
    });

    holdTimeoutRef.current = setTimeout(() => {
      controls.start({ scale: 4 });
    }, 500);
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
    }
    
    if (isHolding) {
      setIsHolding(false);
      controls.start({ scale: 1 });
      triggerBurst(1); // Only trigger one big explosion
      onClick();
    } else {
      handleTap(e);
    }
  };

  const handleSubmit = () => {
    let finalReason = reason.trim();
    
    if (selectedTags.length > 0) {
      const tagsText = selectedTags.join(", ");
      finalReason = finalReason ? `${finalReason} (${tagsText})` : tagsText;
    }
    
    if (finalReason) {
      onClick(finalReason);
    }
    
    setReason('');
    setSelectedTags([]);
    setShowOverlay(false);
  };

  return (
    <div className="relative inline-block">
      <motion.div
        animate={controls}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleTap}
        className={`touch-none select-none ${isHolding ? 'animate-wiggle' : ''}`}
      >
        <Button 
          variant={variant}
          size={size}
          disabled={isLoading}
          className={`relative group ${className} ${hasMindBlown ? 'bg-white hover:bg-white/90 text-black border-none' : ''}`}
          ref={buttonRef}
        >
          <motion.div
            className="relative"
            animate={hasMindBlown ? {
              scale: [1, 1.4, 1],
              rotate: [0, -10, 10, -10, 0]
            } : {}}
            transition={{ 
              duration: 0.5,
              repeat: hasMindBlown ? Infinity : 0,
              repeatType: "reverse",
              repeatDelay: 2
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
          </motion.div>
          
          {tapCount > 0 && !hasMindBlown && (
            <motion.div 
              className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              {tapCount}
            </motion.div>
          )}
          
          {isTopPaper && (
            <motion.div 
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            >
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </motion.div>
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {showOverlay && (
          <div ref={overlayRef}>
            <ReasonOverlay
              reason={reason}
              selectedTags={selectedTags}
              isLoading={isLoading}
              onReasonChange={setReason}
              onToggleTag={(tag) => {
                setSelectedTags(prev => 
                  prev.includes(tag) 
                    ? prev.filter(t => t !== tag)
                    : [...prev, tag]
                );
              }}
              onSubmit={handleSubmit}
              onClose={() => {
                setReason('');
                setSelectedTags([]);
                setShowOverlay(false);
              }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MindBlowButton;
