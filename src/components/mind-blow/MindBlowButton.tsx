
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMindBlowTracker } from '@/hooks/use-mind-blow-tracker';
import ReasonOverlay from './ReasonOverlay';
import MindBlowCore from './MindBlowCore';
import ParticleSystem from './ParticleSystem';
import { useMindBlowAnimation } from '@/hooks/use-mind-blow-animation';
import { useHapticFeedback } from '@/hooks/mind-blow/use-haptic-feedback';

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
  const [tapCount, setTapCount] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { increment } = useMindBlowTracker();
  
  const {
    particles,
    scale,
    translateY,
    isHolding,
    handleTap,
    startHolding,
    stopHolding,
    getHoldDuration
  } = useMindBlowAnimation();

  const { tapVibration, startHoldVibration, explosionVibration } = useHapticFeedback();
  
  // Direct vibration trigger for native interactions
  const triggerDirectVibration = (pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      console.log('MindBlowButton: Direct vibration triggered with pattern:', pattern);
      navigator.vibrate(pattern);
    }
  };
  
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

  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (hasMindBlown) return;
    
    if (handleTap()) {
      // Trigger direct haptic feedback on tap
      console.log('Mind Blow Button: Triggering direct tap vibration');
      triggerDirectVibration(15);
      
      setTapCount(prev => prev + 1);
      increment();
      
      if (tapCount >= 2) {
        onClick();
        setTapCount(0);
      }
    }
  }, [hasMindBlown, handleTap, increment, tapCount, onClick]);

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (hasMindBlown) return;
    
    console.log('Mind Blow Button: Start holding, triggering direct hold vibration');
    triggerDirectVibration([20, 30, 20]);
    startHolding();
  }, [hasMindBlown, startHolding]);

  const handleMouseUp = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    if (stopHolding()) {
      const holdDuration = getHoldDuration();
      console.log('Mind Blow Button: Stop holding, triggering direct explosion vibration', holdDuration);
      
      // Calculate a vibration pattern based on hold duration
      const intensity = Math.min(holdDuration / 1000, 1);
      const baseVibration = Math.floor(50 * intensity) || 50;
      triggerDirectVibration([baseVibration, 20, Math.floor(baseVibration * 0.7), 10]);
      
      onClick();
    } else {
      handleInteraction(e);
    }
  }, [stopHolding, getHoldDuration, onClick, handleInteraction]);

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
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleInteraction}
        className="touch-none select-none"
      >
        <MindBlowCore
          hasMindBlown={hasMindBlown}
          count={count}
          showCount={showCount}
          scale={scale}
          translateY={translateY}
          isHolding={isHolding}
          isLoading={isLoading}
          className={className}
          variant={variant}
          size={size}
          buttonRef={buttonRef}
        />
      </motion.div>

      <ParticleSystem particles={particles} />

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
