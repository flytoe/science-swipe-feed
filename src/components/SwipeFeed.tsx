
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PaperCard from './PaperCard';
import { getPapers, type Paper } from '../lib/supabase';
import { ChevronUp, ChevronDown, ArrowUpDown, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const SwipeFeed: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [dragStart, setDragStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingDemoData, setIsUsingDemoData] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
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
          
          // Check if using demo data (when we have exactly 3 demo papers)
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
    
    // Hide instructions after 5 seconds
    const timeout = setTimeout(() => {
      setShowInstructions(false);
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  const nextPaper = () => {
    if (currentIndex < papers.length - 1) {
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
      setCurrentIndex(papers.length - 1);
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

  return (
    <div 
      className="swipe-feed-container"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
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
            {showInstructions && (
              <motion.div
                className="swipe-instruction"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={16} />
                  <span>Swipe up/down to navigate</span>
                </div>
              </motion.div>
            )}
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
          
          <div className="absolute right-4 inset-y-0 flex flex-col items-center justify-center gap-4 z-10">
            <button 
              onClick={prevPaper}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
              aria-label="Previous paper"
            >
              <ChevronUp size={20} />
            </button>
            <div className="text-sm font-medium text-white bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full">
              {currentIndex + 1}/{papers.length}
            </div>
            <button 
              onClick={nextPaper}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
              aria-label="Next paper"
            >
              <ChevronDown size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SwipeFeed;
