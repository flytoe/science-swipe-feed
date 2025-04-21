
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMindBlowTracker } from '@/hooks/use-mind-blow-tracker';
import ReasonOverlay from './ReasonOverlay';
import MindBlowCore from './MindBlowCore';
import ParticleSystem from './ParticleSystem';
import { useMindBlowAnimation } from '@/hooks/use-mind-blow-animation';

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
  const checkboxRef = useRef<HTMLInputElement>(null);
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

  // Forward user interaction to the checkbox to get native haptic feedback
  const triggerHapticCheckbox = () => {
    if (checkboxRef.current && !hasMindBlown) {
      // This will toggle the checkbox state and trigger haptic feedback on iOS
      checkboxRef.current.click();
    }
  };

  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (hasMindBlown) return;
    
    triggerHapticCheckbox();
    
    if (handleTap()) {
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
    
    triggerHapticCheckbox();
    startHolding();
  }, [hasMindBlown, startHolding]);

  const handleMouseUp = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    if (stopHolding()) {
      const holdDuration = getHoldDuration();
      triggerHapticCheckbox();
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

  // This checkbox is used only for haptic feedback
  // It must be visible (not display: none) but we can make it visually hidden
  // We'll make it tiny and position it off-screen, but it's still technically visible
  const hapticCheckbox = (
    <input
      ref={checkboxRef}
      type="checkbox"
      aria-hidden="true"
      className="h-px w-px opacity-0 absolute top-[-9999px] left-[-9999px]"
      onChange={(e) => {
        // Just a dummy handler to prevent React warning about controlled inputs
        // The actual handlers are called in our component logic
      }}
      // Important: must not be hidden with display:none or visibility:hidden
      // Style visually hidden but technically visible for iOS haptics
    />
  );

  return (
    <div className="relative inline-block">
      {/* This checkbox will be used for native haptic feedback on iOS */}
      {hapticCheckbox}
      
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
