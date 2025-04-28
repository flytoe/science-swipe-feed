
import React, { useState, useRef, useEffect } from 'react';
import { type Paper } from '../../lib/supabase';
import { useSwipeNavigation } from './useSwipeNavigation';
import { useIsMobile } from '../../hooks/use-mobile';
import TemporaryDetailView from '../TemporaryDetailView';
import SwipeControls from './SwipeControls';
import SwipeableContent from './SwipeableContent';
import PeekingCards from './PeekingCards';

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
  
  // Handle scroll detection for detail view
  useEffect(() => {
    let timeoutId: number;
    
    const handleScroll = () => {
      if (!feedRef.current) return;
      
      const scrollTop = feedRef.current.scrollTop;
      
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setIsDetailView(scrollTop > 100);
      }, 100);
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
  const nextPaper = papers[nextIndex];
  const prevPaper = papers[prevIndex];
  
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

  // Enhanced drag constraints with friction
  const dragConstraints = { left: 0, right: 0 };
  
  // Improved drag handling with velocity-based decisions
  const handleDragEnd = (event: any, info: any) => {
    if (isDetailView) return;
    
    const threshold = 50;
    const velocityThreshold = 0.3;
    const dragX = info.offset.x;
    const velocityX = info.velocity.x;
    
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
          <SwipeableContent
            currentPaper={currentPaper}
            swipeDirection={swipeDirection}
            handleTouchStart={handleTouchStart}
            handleTouchMove={handleTouchMove}
            handleTouchEnd={handleTouchEnd}
            handleWheel={handleWheel}
            isDetailView={isDetailView}
            dragConstraints={dragConstraints}
            handleDragEnd={handleDragEnd}
            isMobile={isMobile}
          />
          
          {/* Peeking cards (visible only when not in detail view) */}
          {!isDetailView && papers.length > 1 && (
            <PeekingCards
              prevPaper={prevPaper}
              nextPaper={nextPaper}
            />
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
