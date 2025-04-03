
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { type Paper } from '../../lib/supabase';
import PaperCard from '../PaperCard';
import SwipeControls from './SwipeControls';
import { useSwipeNavigation } from './useSwipeNavigation';
import { useIsMobile } from '../../hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
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
  
  const {
    goToNextPaper,
    goToPrevPaper,
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
  const nextIndex = currentIndex < papers.length - 1 ? currentIndex + 1 : 0;
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : papers.length - 1;
  const nextPaperData = papers[nextIndex];
  const prevPaperData = papers[prevIndex];
  
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
      goToNextPaper();
    } else {
      goToPrevPaper();
    }
  };

  // Drag constraints for horizontal swiping
  const dragConstraints = { left: 0, right: 0 };
  
  // Calculate drag direction and handle completion
  const handleDragEnd = (event: any, info: any) => {
    if (isDetailView) return;
    
    const threshold = 80; // Lower threshold for easier swiping
    const dragX = info.offset.x;
    
    if (dragX > threshold) {
      handleNavigate('prev');
    } else if (dragX < -threshold) {
      handleNavigate('next');
    }
  };

  // Create a more natural card swipe effect with previews of adjacent cards
  return (
    <div 
      className="relative h-full w-full mx-auto"
      ref={feedRef}
      style={{ overflowY: 'auto', overflowX: 'hidden' }}
    >
      <div className="min-h-full w-full pb-24">
        <div className="h-full w-full relative">
          {/* Current card */}
          <AnimatePresence key={`animation-${currentIndex}`} initial={false} mode="wait">
            <motion.div
              key={`card-${currentPaper?.doi || currentIndex}`}
              initial={{ 
                opacity: 0, 
                x: swipeDirection === 'left' ? '100%' : '-100%',
                scale: 0.95
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
                scale: 0.95,
                zIndex: 0
              }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className="w-full"
              drag={isMobile && !isDetailView ? "x" : false}
              dragConstraints={dragConstraints}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              dragDirectionLock
              onTouchStart={!isDetailView ? handleTouchStart : undefined}
              onTouchMove={!isDetailView ? handleTouchMove : undefined}
              onTouchEnd={!isDetailView ? handleTouchEnd : undefined}
              onWheel={!isDetailView ? handleWheel : undefined}
              style={{ touchAction: 'pan-y' }}
            >
              <PaperCard 
                paper={currentPaper}
                isActive={true}
                isGeneratingImage={isGeneratingImage}
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Staggered cards (visible only when not in detail view) */}
          {!isDetailView && papers.length > 1 && (
            <>
              {/* Previous card (peeking from left) */}
              <motion.div
                key={`prev-peek-${prevIndex}`}
                className="absolute inset-0 w-full pointer-events-none"
                initial={{ x: "-110%", scale: 0.9, opacity: 0.7, zIndex: 1 }}
                animate={{ x: "-85%", scale: 0.9, opacity: 0.7, zIndex: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              >
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <PaperCard 
                    paper={prevPaperData}
                    isActive={false}
                  />
                </div>
              </motion.div>
              
              {/* Next card (peeking from right) */}
              <motion.div
                key={`next-peek-${nextIndex}`}
                className="absolute inset-0 w-full pointer-events-none"
                initial={{ x: "110%", scale: 0.9, opacity: 0.7, zIndex: 1 }}
                animate={{ x: "85%", scale: 0.9, opacity: 0.7, zIndex: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              >
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <PaperCard 
                    paper={nextPaperData}
                    isActive={false}
                  />
                </div>
              </motion.div>
            </>
          )}
        </div>
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
