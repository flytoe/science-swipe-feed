
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paper } from '../../lib/supabase';
import PaperCard from '../PaperCard';
import ClaudeToggle from '../ClaudeToggle';

interface SwipeableContentProps {
  currentPaper: Paper;
  swipeDirection: 'left' | 'right' | null;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  handleWheel: (e: React.WheelEvent) => void;
  isDetailView: boolean;
  dragConstraints: { left: number; right: number };
  handleDragEnd: (event: any, info: any) => void;
  isMobile: boolean;
}

const SwipeableContent: React.FC<SwipeableContentProps> = ({
  currentPaper,
  swipeDirection,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleWheel,
  isDetailView,
  dragConstraints,
  handleDragEnd,
  isMobile,
}) => {
  // Handle toggle state changes with force re-render
  const handleClaudeToggle = (enabled: boolean) => {
    if (currentPaper) {
      currentPaper.show_claude = enabled;
      // Force re-render of the component to show updated content
      window.setTimeout(() => {
        // This empty timeout forces React to re-render with the updated state
      }, 0);
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={`card-${currentPaper?.id}-${currentPaper?.show_claude ? 'claude' : 'default'}`} // Add show_claude to key to force re-render
        initial={{ 
          opacity: 0, 
          x: swipeDirection === 'left' ? '100%' : '-100%',
          scale: 0.92
        }}
        animate={{ 
          opacity: 1, 
          x: 0, 
          scale: 1,
          zIndex: 10
        }}
        exit={{ 
          opacity: 0, 
          x: swipeDirection === 'left' ? '-100%' : '100%',
          scale: 0.92,
          zIndex: 0
        }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 1
        }}
        className="w-full h-full"
        drag={isMobile && !isDetailView ? "x" : false}
        dragConstraints={dragConstraints}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        dragDirectionLock
        onTouchStart={!isDetailView ? handleTouchStart : undefined}
        onTouchMove={!isDetailView ? handleTouchMove : undefined}
        onTouchEnd={!isDetailView ? handleTouchEnd : undefined}
        onWheel={!isDetailView ? handleWheel : undefined}
        style={{ 
          touchAction: isDetailView ? 'pan-y' : 'none',
          position: 'relative',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      >
        <div className="absolute top-4 right-4 z-50">
          {currentPaper.claude_refined && (
            <ClaudeToggle
              paperId={currentPaper.id}
              isEnabled={!!currentPaper.show_claude}
              onToggle={handleClaudeToggle}
            />
          )}
        </div>
        <PaperCard 
          paper={currentPaper}
          isActive={true}
          isGeneratingImage={false}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default SwipeableContent;
