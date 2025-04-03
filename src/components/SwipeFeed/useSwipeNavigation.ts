
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
  const [dragStart, setDragStart] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  
  // Use a reasonable threshold for swipes
  const SWIPE_THRESHOLD = 60;
  // Vertical threshold to detect when user is trying to scroll vertically
  const VERTICAL_THRESHOLD = 30;
  
  const goToNextPaper = () => {
    if (currentIndex < papersLength - 1) {
      setCurrentIndex(currentIndex + 1);
      setSwipeDirection('left');
    } else {
      // Loop back to the beginning when reaching the end
      setCurrentIndex(0);
      setSwipeDirection('left');
      toast.info('You have seen all papers. Starting from the beginning!');
    }
  };
  
  const goToPrevPaper = () => {
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
    
    setDragStart(e.touches[0].clientX);
    setDragStartY(e.touches[0].clientY);
    setIsDragging(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isScrolling) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    const dragDistanceX = currentX - dragStart;
    const dragDistanceY = currentY - dragStartY;
    
    // If vertical movement is significantly larger than horizontal, treat as scrolling
    if (Math.abs(dragDistanceY) > Math.abs(dragDistanceX) + VERTICAL_THRESHOLD) {
      setIsDragging(false);
      return;
    }
    
    // If horizontal swipe is large enough, trigger page change and end dragging
    if (Math.abs(dragDistanceX) > SWIPE_THRESHOLD) {
      if (dragDistanceX > 0) {
        setSwipeDirection('right');
        goToPrevPaper();
      } else {
        setSwipeDirection('left');
        goToNextPaper();
      }
      
      setIsDragging(false);
    }
  };
  
  const handleTouchEnd = () => {
    if (isScrolling) return;
    setIsDragging(false);
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
    isDragging,
    swipeDirection
  };
};
