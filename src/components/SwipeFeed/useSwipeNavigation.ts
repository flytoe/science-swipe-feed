
import { useState } from 'react';
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
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  
  // Thresholds for detecting swipes vs. scrolls
  const SWIPE_THRESHOLD = 50;
  const SCROLL_TOLERANCE = 30; 
  const VELOCITY_THRESHOLD = 0.5;
  
  const goToNextPaper = () => {
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
  };
  
  const goToPrevPaper = () => {
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
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isScrolling) return;
    
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
    setIsSwiping(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping || isScrolling) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    
    // If vertical movement is significantly larger than horizontal, treat as scrolling
    if (Math.abs(deltaY) > Math.abs(deltaX) + SCROLL_TOLERANCE) {
      setIsSwiping(false);
      return;
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping || isScrolling) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    
    // Only process horizontal swipes
    if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        goToPrevPaper();
      } else {
        goToNextPaper();
      }
    }
    
    setIsSwiping(false);
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    // If the user is scrolling vertically, don't interfere with paper navigation
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) || isScrolling) {
      return;
    }
    
    // Make wheel navigation less sensitive - require more scrolling
    if (Math.abs(e.deltaX) > 40) {
      if (e.deltaX > 0) {
        setSwipeDirection('left');
        goToNextPaper();
      } else {
        setSwipeDirection('right');
        goToPrevPaper();
      }
    }
  };
  
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
