
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
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  
  // Increase threshold for more deliberate swipes
  const SWIPE_THRESHOLD = 100;
  
  const nextPaper = () => {
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
  
  const prevPaper = () => {
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
    
    setDragStart(e.touches[0].clientX); // Changed from clientY to clientX
    setIsDragging(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isScrolling) return;
    
    const dragDistance = e.touches[0].clientX - dragStart; // Changed from clientY to clientX
    
    // Use threshold for more deliberate swipes
    if (Math.abs(dragDistance) > SWIPE_THRESHOLD) {
      if (dragDistance > 0) {
        setSwipeDirection('right');
        prevPaper();
      } else {
        setSwipeDirection('left');
        nextPaper();
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
    if (Math.abs(e.deltaX) > 50) {
      if (e.deltaX > 0) {
        setSwipeDirection('left');
        nextPaper();
      } else {
        setSwipeDirection('right');
        prevPaper();
      }
    }
  };
  
  return {
    nextPaper,
    prevPaper,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    isDragging,
    swipeDirection
  };
};
