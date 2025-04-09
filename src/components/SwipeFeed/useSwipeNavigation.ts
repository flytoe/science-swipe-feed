
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseSwipeNavigationProps {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  papersLength: number;
  isScrolling?: boolean;
}

export const useSwipeNavigation = ({ 
  currentIndex, 
  setCurrentIndex, 
  papersLength,
  isScrolling = false
}: UseSwipeNavigationProps) => {
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  
  // Enhanced thresholds for more reliable detection
  const SWIPE_THRESHOLD = 40;
  const SCROLL_TOLERANCE = 25;
  const VELOCITY_THRESHOLD = 0.3;
  
  const goToNextPaper = useCallback(() => {
    if (isScrolling) return;
    
    if (currentIndex < papersLength - 1) {
      setCurrentIndex(currentIndex + 1);
      setSwipeDirection('left');
    } else {
      // Loop back to the beginning when reaching the end
      setCurrentIndex(0);
      setSwipeDirection('left');
      toast.info('Starting from the beginning');
    }
  }, [currentIndex, isScrolling, papersLength, setCurrentIndex]);
  
  const goToPrevPaper = useCallback(() => {
    if (isScrolling) return;
    
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSwipeDirection('right');
    } else {
      // Loop to the end when at the beginning
      setCurrentIndex(papersLength - 1);
      setSwipeDirection('right');
      toast.info('Showing the last paper');
    }
  }, [currentIndex, isScrolling, papersLength, setCurrentIndex]);
  
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isScrolling) return;
    
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
    setTouchEndX(touch.clientX);
    setTouchEndY(touch.clientY);
    setIsSwiping(true);
  }, [isScrolling]);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping || isScrolling) return;
    
    const touch = e.touches[0];
    setTouchEndX(touch.clientX);
    setTouchEndY(touch.clientY);
    
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    
    // If vertical movement is significantly larger than horizontal, treat as scrolling
    if (Math.abs(deltaY) > Math.abs(deltaX) + SCROLL_TOLERANCE) {
      setIsSwiping(false);
    }
  }, [isSwiping, isScrolling, touchStartX, touchStartY, SCROLL_TOLERANCE]);
  
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isSwiping || isScrolling) return;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const timeDelta = 150;
    const velocity = Math.abs(deltaX) / timeDelta;
    
    // Process horizontal swipes with improved detection logic
    if ((Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) || 
        velocity > VELOCITY_THRESHOLD) {
      if (deltaX > 0) {
        goToPrevPaper();
      } else {
        goToNextPaper();
      }
    }
    
    setIsSwiping(false);
  }, [isSwiping, isScrolling, touchEndX, touchStartX, touchEndY, touchStartY, SWIPE_THRESHOLD, VELOCITY_THRESHOLD, goToPrevPaper, goToNextPaper]);
  
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Skip if currently scrolling vertically
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) || isScrolling) {
      return;
    }
    
    // Using a reduced threshold for easier wheel navigation
    if (Math.abs(e.deltaX) > 30) {
      if (e.deltaX > 0) {
        setSwipeDirection('left');
        goToNextPaper();
      } else {
        setSwipeDirection('right');
        goToPrevPaper();
      }
    }
  }, [isScrolling, goToNextPaper, goToPrevPaper]);
  
  return {
    goToNextPaper,
    goToPrevPaper,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    isSwiping,
    swipeDirection
  };
};
