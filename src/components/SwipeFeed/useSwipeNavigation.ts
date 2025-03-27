
import { useState } from 'react';
import { toast } from 'sonner';

interface UseSwipeNavigationProps {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  papersLength: number;
}

export const useSwipeNavigation = ({ 
  currentIndex, 
  setCurrentIndex, 
  papersLength 
}: UseSwipeNavigationProps) => {
  const [dragStart, setDragStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const nextPaper = () => {
    if (currentIndex < papersLength - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Loop back to the beginning when reaching the end
      setCurrentIndex(0);
      toast.info('You have seen all papers. Starting from the beginning!');
    }
  };
  
  const prevPaper = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Loop to the end when at the beginning
      setCurrentIndex(papersLength - 1);
      toast.info('Showing the last paper');
    }
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStart(e.touches[0].clientY);
    setIsDragging(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const dragDistance = e.touches[0].clientY - dragStart;
    
    if (Math.abs(dragDistance) > 100) {
      if (dragDistance > 0) {
        prevPaper();
      } else {
        nextPaper();
      }
      
      setIsDragging(false);
    }
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      nextPaper();
    } else {
      prevPaper();
    }
  };
  
  return {
    nextPaper,
    prevPaper,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    isDragging
  };
};
