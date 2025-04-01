import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { type Paper } from '../../lib/supabase';
import PaperCard from '../PaperCard';
import SwipeControls from './SwipeControls';
import { useSwipeNavigation } from './useSwipeNavigation';

interface SwipeFeedProps {
  papers: Paper[];
  currentIndex?: number;
  setCurrentIndex?: (index: number) => void;
  isGeneratingImage?: boolean;
}

const SwipeFeed: React.FC<SwipeFeedProps> = ({ 
  papers, 
  currentIndex: externalIndex, 
  setCurrentIndex: setExternalIndex,
  isGeneratingImage = false
}) => {
  const [internalIndex, setInternalIndex] = React.useState(0);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  
  // Use external or internal state depending on what's provided
  const currentIndex = externalIndex !== undefined ? externalIndex : internalIndex;
  const setCurrentIndex = (index: number) => {
    if (setExternalIndex) {
      setExternalIndex(index);
    } else {
      setInternalIndex(index);
    }
  };
  
  // Always call hooks at the top level, regardless of conditions
  const {
    nextPaper,
    prevPaper,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    swipeDirection
  } = useSwipeNavigation({ 
    currentIndex, 
    setCurrentIndex, 
    papersLength: papers?.length || 0,
    isScrolling: isDetailOpen // Pass isDetailOpen to disable swipe when detail is open
  });
  
  // Check for empty papers after hooks are called
  if (!papers || papers.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white/70">No papers available</p>
      </div>
    );
  }

  const currentPaper = papers[currentIndex];
  
  // This handles detail toggle state
  const handleDetailToggle = (isOpen: boolean) => {
    setIsDetailOpen(isOpen);
  };

  // Close detail handler for the button
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };
  
  return (
    <div 
      className="relative h-full w-full max-w-md mx-auto overflow-hidden"
      onTouchStart={!isDetailOpen ? handleTouchStart : undefined}
      onTouchMove={!isDetailOpen ? handleTouchMove : undefined}
      onTouchEnd={!isDetailOpen ? handleTouchEnd : undefined}
      onWheel={!isDetailOpen ? handleWheel : undefined}
    >
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPaper?.doi || currentIndex}
            initial={{ y: swipeDirection === 'up' ? 100 : -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: swipeDirection === 'up' ? -100 : 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <PaperCard 
              paper={currentPaper}
              isActive={true}
              isGeneratingImage={isGeneratingImage}
              onDetailToggle={handleDetailToggle}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Show different controls based on detail state */}
      {papers.length > 1 && (
        <SwipeControls 
          currentIndex={currentIndex} 
          total={papers.length}
          onNext={nextPaper}
          onPrev={prevPaper}
          isDetailOpen={isDetailOpen}
          paperDoi={currentPaper?.doi}
          onClose={isDetailOpen ? handleCloseDetail : undefined}
        />
      )}
    </div>
  );
};

export default SwipeFeed;
