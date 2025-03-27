
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PaperCard from '../PaperCard';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import SwipeControls from './SwipeControls';
import SwipeInstructions from './SwipeInstructions';
import { useSwipeNavigation } from './useSwipeNavigation';
import { getPapers, type Paper } from '../../lib/supabase';

const SwipeFeed: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingDemoData, setIsUsingDemoData] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { handleTouchStart, handleTouchMove, handleTouchEnd, handleWheel, nextPaper, prevPaper } = 
    useSwipeNavigation({
      currentIndex,
      setCurrentIndex,
      papersLength: papers.length,
      isScrolling
    });
  
  // Update the scrolling state with debounce for better UX
  const setScrollingState = (scrolling: boolean) => {
    setIsScrolling(scrolling);
  };
  
  useEffect(() => {
    const loadPapers = async () => {
      try {
        console.log('Loading papers...');
        const fetchedPapers = await getPapers();
        console.log('Fetched papers:', fetchedPapers.length);
        
        if (fetchedPapers.length === 0) {
          setError('No papers found in the database.');
        } else {
          setPapers(fetchedPapers);
          
          if (fetchedPapers.length === 3 && fetchedPapers[0].id === '1' && fetchedPapers[1].id === '2' && fetchedPapers[2].id === '3') {
            setIsUsingDemoData(true);
            toast.info('Using demo data. No papers found in your Supabase database.', {
              duration: 5000,
            });
          } else {
            setIsUsingDemoData(false);
            toast.success(`Loaded ${fetchedPapers.length} papers from Supabase`, {
              duration: 3000,
            });
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading papers:', error);
        setError('Failed to load papers. Please check the console for more details.');
        toast.error('Failed to load papers.');
        setLoading(false);
      }
    };
    
    loadPapers();
    
    const timeout = setTimeout(() => {
      setShowInstructions(false);
    }, 5000);
    
    // Improved event handling with more explicit function names
    const handleScrollStart = () => {
      console.log('Content scrolling started');
      setScrollingState(true);
    };
    
    const handleScrollEnded = () => {
      console.log('Content scrolling ended');
      setScrollingState(false);
    };
    
    document.addEventListener('scrollContent', handleScrollStart);
    document.addEventListener('scrollEnd', handleScrollEnded);
    
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('scrollContent', handleScrollStart);
      document.removeEventListener('scrollEnd', handleScrollEnded);
    };
  }, []);

  const handleContainerTouchStart = (e: React.TouchEvent) => {
    if (!isScrolling) {
      handleTouchStart(e);
    }
  };
  
  const handleContainerTouchMove = (e: React.TouchEvent) => {
    if (!isScrolling) {
      handleTouchMove(e);
    }
  };
  
  const handleContainerTouchEnd = (e: React.TouchEvent) => {
    if (!isScrolling) {
      handleTouchEnd(e);
    }
  };
  
  const handleContainerWheel = (e: React.WheelEvent) => {
    if (!isScrolling) {
      handleWheel(e);
    }
  };

  return (
    <div 
      className="swipe-feed-container"
      ref={containerRef}
      onTouchStart={handleContainerTouchStart}
      onTouchMove={handleContainerTouchMove}
      onTouchEnd={handleContainerTouchEnd}
      onWheel={handleContainerWheel}
    >
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="loading-spinner" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 gap-4">
          <AlertTriangle className="text-amber-500" size={32} />
          <div className="text-xl font-semibold mb-2">Data Issue</div>
          <p className="text-gray-500">{error}</p>
        </div>
      ) : papers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <div className="text-xl font-semibold mb-2">No papers found</div>
          <p className="text-gray-500">Check back soon for new scientific content</p>
        </div>
      ) : (
        <>
          {isUsingDemoData && (
            <div className="absolute top-0 left-0 right-0 bg-amber-50 p-3 z-20 shadow-md">
              <div className="flex items-center gap-2 text-amber-800 text-sm">
                <AlertTriangle size={16} />
                <span>Using demo data. No papers found in your Supabase database.</span>
              </div>
            </div>
          )}
          
          <AnimatePresence mode="wait">
            {showInstructions && <SwipeInstructions />}
          </AnimatePresence>
          
          <div className="absolute inset-0 pointer-events-none">
            <AnimatePresence mode="wait">
              {papers.map((paper, index) => (
                index === currentIndex && (
                  <motion.div
                    key={paper.id || index}
                    className="absolute inset-0 p-4"
                  >
                    <PaperCard paper={paper} isActive={index === currentIndex} />
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
          
          <SwipeControls 
            currentIndex={currentIndex} 
            total={papers.length} 
            onNext={nextPaper} 
            onPrev={prevPaper} 
          />
        </>
      )}
    </div>
  );
};

export default SwipeFeed;
