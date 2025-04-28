
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { type Paper } from '../../lib/supabase';
import PaperCard from '../PaperCard';
import SwipeControls from './SwipeControls';
import { useSwipeNavigation } from './useSwipeNavigation';
import { useIsMobile } from '../../hooks/use-mobile';
import TemporaryDetailView from '../TemporaryDetailView';
import ClaudeToggle from '../ClaudeToggle';

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
  const [showTemporaryDetail, setShowTemporaryDetail] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
  
  // Handle scroll detection for detail view - with improved debounce
  useEffect(() => {
    let timeoutId: number;
    
    const handleScroll = () => {
      if (!feedRef.current) return;
      
      const scrollTop = feedRef.current.scrollTop;
      
      // Clear the previous timeout
      clearTimeout(timeoutId);
      
      // Set a new timeout to update the state after the user has stopped scrolling
      timeoutId = window.setTimeout(() => {
        setIsDetailView(scrollTop > 100);
      }, 100); // Slightly longer debounce for better performance
    };
    
    const currentRef = feedRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
      clearTimeout(timeoutId);
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

  // Handle opening the temporary detail view
  const handleOpenTemporaryDetail = () => {
    setShowTemporaryDetail(true);
  };

  // Enhanced drag constraints with friction
  const dragConstraints = { left: 0, right: 0 };
  
  // Improved drag handling with velocity-based decisions
  const handleDragEnd = (event: any, info: any) => {
    if (isDetailView) return;
    
    const threshold = 50; // Lower threshold for easier swiping
    const velocityThreshold = 0.3; // Add velocity threshold for more natural swiping
    const dragX = info.offset.x;
    const velocityX = info.velocity.x;
    
    // Consider both distance and velocity for more natural swiping
    if (dragX > threshold || velocityX > velocityThreshold) {
      handleNavigate('prev');
    } else if (dragX < -threshold || velocityX < -velocityThreshold) {
      handleNavigate('next');
    }
  };

  return (
    <div 
      className="relative h-full w-full max-w-md mx-auto overflow-y-auto overflow-x-hidden"
      ref={feedRef}
    >
      <div className="min-h-full w-full" ref={contentRef}>
        <div className="h-full w-full relative will-change-transform">
          {/* Claude toggle (when available) */}
          {currentPaper?.claude_refined && (
            <div className="absolute top-4 right-4 z-50">
              <ClaudeToggle 
                paperId={currentPaper.id}
                isEnabled={!!currentPaper.show_claude}
                onToggle={(enabled) => {
                  // Need to update the paper directly since we don't have access to toggleClaudeMode here
                  if (currentPaper) {
                    currentPaper.show_claude = enabled;
                  }
                }}
              />
            </div>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`card-${currentPaper?.doi || currentIndex}`}
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
              <PaperCard 
                paper={currentPaper}
                isActive={true}
                isGeneratingImage={isGeneratingImage}
                onDetailClick={handleOpenTemporaryDetail}
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
                initial={{ x: "-110%", scale: 0.85, opacity: 0.7, zIndex: 1 }}
                animate={{ x: "-85%", scale: 0.85, opacity: 0.7, zIndex: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                style={{
                  willChange: 'transform',
                  backfaceVisibility: 'hidden'
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
                initial={{ x: "110%", scale: 0.85, opacity: 0.7, zIndex: 1 }}
                animate={{ x: "85%", scale: 0.85, opacity: 0.7, zIndex: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                style={{
                  willChange: 'transform',
                  backfaceVisibility: 'hidden'
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

      {/* Temporary Detail View */}
      <TemporaryDetailView 
        paper={currentPaper}
        isOpen={showTemporaryDetail}
        onClose={() => setShowTemporaryDetail(false)}
      />
    </div>
  );
};

export default SwipeFeed;
