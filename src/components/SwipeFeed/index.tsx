
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { type Paper } from '../../lib/supabase';
import PaperCard from '../PaperCard';
import SwipeControls from './SwipeControls';
import { useSwipeNavigation } from './useSwipeNavigation';
import { ScrollArea } from '../ui/scroll-area';

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

  // Function to get the variants for staggered cards
  const getCardVariants = (index: number) => {
    const isCurrent = index === currentIndex;
    const isPrev = index === currentIndex - 1 || (currentIndex === 0 && index === papers.length - 1);
    const isNext = index === currentIndex + 1 || (currentIndex === papers.length - 1 && index === 0);
    
    if (isCurrent) {
      return {
        initial: { 
          scale: 0.95, 
          opacity: 0.5,
          x: swipeDirection === 'left' ? '100%' : '-100%'
        },
        animate: { 
          scale: 1, 
          opacity: 1, 
          x: 0,
          zIndex: 10
        },
        exit: { 
          scale: 0.95, 
          opacity: 0.5, 
          x: swipeDirection === 'left' ? '-100%' : '100%',
          zIndex: 0
        },
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30
        }
      };
    } else if (isPrev) {
      return {
        initial: { scale: 0.9, x: '-80%', opacity: 0.7, zIndex: 5 },
        animate: { scale: 0.9, x: '-15%', opacity: 0.7, zIndex: 5 },
        exit: { scale: 0.9, x: '-80%', opacity: 0, zIndex: 5 }
      };
    } else if (isNext) {
      return {
        initial: { scale: 0.9, x: '80%', opacity: 0.7, zIndex: 5 },
        animate: { scale: 0.9, x: '15%', opacity: 0.7, zIndex: 5 },
        exit: { scale: 0.9, x: '80%', opacity: 0, zIndex: 5 }
      };
    }
    
    // For other cards
    return {
      initial: { opacity: 0, scale: 0.8, zIndex: 0 },
      animate: { opacity: 0, scale: 0.8, zIndex: 0 },
      exit: { opacity: 0, scale: 0.8, zIndex: 0 }
    };
  };
  
  return (
    <div 
      className="relative h-full w-full mx-auto overflow-hidden"
      ref={feedRef}
      style={{ overflowY: 'auto', overflowX: 'hidden' }}
    >
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
        <div className="h-full w-full relative">
          {papers.map((paper, index) => (
            <AnimatePresence key={paper?.doi || index} initial={false} mode="wait">
              {index === currentIndex && (
                <motion.div
                  key={`card-${paper?.doi || index}`}
                  custom={index}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={getCardVariants(index)}
                  className="absolute inset-0 w-full"
                  drag="x"
                  dragConstraints={dragConstraints}
                  dragElastic={0.1}
                  onDragEnd={handleDragEnd}
                  dragDirectionLock
                  style={{ touchAction: 'pan-y' }}
                >
                  <PaperCard 
                    paper={paper}
                    isActive={true}
                    isGeneratingImage={isGeneratingImage}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          ))}
          
          {/* Staggered cards (visible only when not in detail view) */}
          {!isDetailView && papers.length > 1 && (
            <>
              {/* Previous card (peeking from left) */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={`prev-peek-${currentIndex}`}
                  className="absolute inset-0 w-full pointer-events-none"
                  initial={{ x: "-80%", scale: 0.9, opacity: 0.7, zIndex: 1 }}
                  animate={{ x: "-15%", scale: 0.9, opacity: 0.7, zIndex: 1 }}
                  exit={{ x: "-80%", scale: 0.9, opacity: 0, zIndex: 1 }}
                >
                  <div className="w-full h-full bg-black/60 rounded-lg overflow-hidden">
                    <div className="w-full h-40 bg-gray-800 animate-pulse" />
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Next card (peeking from right) */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={`next-peek-${currentIndex}`}
                  className="absolute inset-0 w-full pointer-events-none"
                  initial={{ x: "80%", scale: 0.9, opacity: 0.7, zIndex: 1 }}
                  animate={{ x: "15%", scale: 0.9, opacity: 0.7, zIndex: 1 }}
                  exit={{ x: "80%", scale: 0.9, opacity: 0, zIndex: 1 }}
                >
                  <div className="w-full h-full bg-black/60 rounded-lg overflow-hidden">
                    <div className="w-full h-40 bg-gray-800 animate-pulse" />
                  </div>
                </motion.div>
              </AnimatePresence>
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
