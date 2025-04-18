import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
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

  const [scale, setScale] = useState(1);
  const [particles, setParticles] = useState<Array<{ id: string, emoji: string, x: number, y: number, rotation: number }>>([]);
  const scaleInterval = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
      }
      if (scaleInterval.current) {
        clearInterval(scaleInterval.current);
      }
    };
  }, []);

  const createParticles = () => {
    const newParticles = [];
    const emojis = ['🤯', '✨', '💡'];
    const particleCount = 12;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 200;
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

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (hasMindBlown) return;
    
    setIsHolding(true);
    setScale(1);
    
    // Start growing while holding
    scaleInterval.current = setInterval(() => {
      setScale(prev => Math.min(prev + 0.5, 4));
    }, 100);
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
    }
    if (scaleInterval.current) {
      clearInterval(scaleInterval.current);
    }
    
    if (isHolding) {
      setIsHolding(false);
      setScale(1);
      createParticles();
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
            style={{ 
              '--scale': scale,
              transform: `scale(${scale})`,
              transformOrigin: 'center center'
            } as any}
            animate={hasMindBlown ? {
              scale: [1, 1.4, 1],
              rotate: [0, -10, 10, -10, 0]
            } : {}}
            className={isHolding ? 'animate-wiggle' : ''}
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
      </motion.div>

      <AnimatePresence>
        {particles.map(particle => (
          <div
            key={particle.id}
            className="animate-particle absolute pointer-events-none"
            style={{
              '--x-offset': `${particle.x}px`,
              '--y-offset': `${particle.y}px`,
              '--rotation': `${particle.rotation}deg`
            } as any}
          >
            {particle.emoji}
          </div>
        ))}
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
