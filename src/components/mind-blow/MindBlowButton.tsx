
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useMindBlowTracker } from '@/hooks/use-mind-blow-tracker';
import ReasonOverlay from './ReasonOverlay';

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
  const [isWowed, setIsWowed] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const holdTimeoutRef = useRef<NodeJS.Timeout>();
  const controls = useAnimation();
  
  const { increment } = useMindBlowTracker();

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

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (hasMindBlown) return;
    
    setIsHolding(true);
    controls.start({
      scale: [1, 4],
      rotate: [0, -10, 10, -10, 0],
      transition: { 
        scale: { duration: 1.5, ease: "easeInOut" },
        rotate: { duration: 0.5, ease: "easeInOut", repeat: 3 }
      }
    });

    holdTimeoutRef.current = setTimeout(() => {
      setIsHolding(false);
      setIsWowed(false);
      controls.start({ scale: 1, rotate: 0 });
      onClick();
      increment();
      setShowOverlay(true);
    }, 1500);
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (hasMindBlown) return;
    
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
    }
    
    if (isHolding) {
      setIsHolding(false);
      setIsWowed(true);
      controls.start({ scale: 1 });
      onClick();
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

  const getEmoji = () => {
    if (hasMindBlown) return "🤯";
    if (isWowed) return "😮";
    return "😮";
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
        className="touch-none select-none"
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
              {getEmoji()}
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
        {isWowed && (
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ 
              scale: [1, 2, 3],
              opacity: [1, 0.8, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex: 101 }}
          >
            <span className="text-4xl">🤯</span>
          </motion.div>
        )}
      </AnimatePresence>

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
