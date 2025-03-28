
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { type Paper } from '../../lib/supabase';
import PaperCard from '../PaperCard';
import SwipeControls from './SwipeControls';
import { useSwipeNavigation } from './useSwipeNavigation';

interface SwipeFeedProps {
  papers: Paper[];
}

const SwipeFeed: React.FC<SwipeFeedProps> = ({ papers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!papers || papers.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white/70">No papers available</p>
      </div>
    );
  }

  const currentPaper = papers[currentIndex];
  
  const {
    nextPaper,
    prevPaper,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
  } = useSwipeNavigation({ 
    currentIndex, 
    setCurrentIndex, 
    papersLength: papers.length 
  });
  
  return (
    <div 
      className="relative h-full w-full max-w-md mx-auto overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <div className="absolute inset-0">
        <AnimatePresence>
          <PaperCard 
            key={currentPaper?.doi || currentIndex}
            paper={currentPaper}
            isActive={true}
          />
        </AnimatePresence>
      </div>
      
      {papers.length > 1 && (
        <SwipeControls 
          currentIndex={currentIndex} 
          total={papers.length}
          onNext={nextPaper}
          onPrev={prevPaper}
        />
      )}
    </div>
  );
};

export default SwipeFeed;
