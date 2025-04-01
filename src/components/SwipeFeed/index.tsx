
import React, { useState, useRef, useEffect } from 'react';
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
  const [internalIndex, setInternalIndex] = useState(0);
  const [isDetailView, setIsDetailView] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  
  // Use external or internal state depending on what's provided
  const currentIndex = externalIndex !== undefined ? externalIndex : internalIndex;
  const setCurrentIndex = (index: number) => {
    if (setExternalIndex) {
      setExternalIndex(index);
    } else {
      setInternalIndex(index);
    }
  };
  
  // Handle scroll detection for detail view
  useEffect(() => {
    const handleScroll = () => {
      if (!feedRef.current) return;
      
      const scrollTop = feedRef.current.scrollTop;
      // If scrolled more than 100px, consider it detail view
      setIsDetailView(scrollTop > 100);
    };
    
    const currentRef = feedRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
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
    isScrolling: isDetailView
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
  
  // Helper function to turn off detail view
  const scrollToTop = () => {
    if (feedRef.current) {
      feedRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  
  // Handle navigation with automatic scroll to top
  const handleNavigate = (direction: 'next' | 'prev') => {
    scrollToTop();
    if (direction === 'next') {
      nextPaper();
    } else {
      prevPaper();
    }
  };

  // Drag constraints for horizontal swiping
  const dragConstraints = { left: 0, right: 0 };
  const dragElastic = 0.7; // Elastic feel when dragging beyond edges
  
  // Calculate drag direction and handle completion
  const handleDragEnd = (event: any, info: any) => {
    if (isDetailView) return;
    
    const threshold = 100; // Threshold to determine if swipe should change slide
    const dragX = info.offset.x;
    
    if (dragX > threshold) {
      handleNavigate('prev');
    } else if (dragX < -threshold) {
      handleNavigate('next');
    }
  };
  
  return (
    <div 
      className="relative h-full w-full max-w-md mx-auto overflow-hidden"
      ref={feedRef}
      onWheel={handleWheel}
    >
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentPaper?.doi || currentIndex}
            initial={{ 
              x: swipeDirection === 'left' ? '100%' : '-100%', 
              opacity: 0.5
            }}
            animate={{ 
              x: 0, 
              opacity: 1 
            }}
            exit={{ 
              x: swipeDirection === 'left' ? '-100%' : '100%', 
              opacity: 0.5
            }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="h-full w-full"
            drag="x"
            dragConstraints={dragConstraints}
            dragElastic={dragElastic}
            onDragEnd={handleDragEnd}
          >
            <PaperCard 
              paper={currentPaper}
              isActive={true}
              isGeneratingImage={isGeneratingImage}
              onDetailToggle={() => {}} // We no longer need this since scrolling handles detail view
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {papers.length > 1 && (
        <SwipeControls 
          currentIndex={currentIndex} 
          total={papers.length}
          onNext={() => handleNavigate('next')}
          onPrev={() => handleNavigate('prev')}
          isDetailOpen={isDetailView}
          paperDoi={currentPaper?.doi}
        />
      )}
    </div>
  );
};

export default SwipeFeed;
