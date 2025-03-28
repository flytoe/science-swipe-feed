
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PaperCard from '../PaperCard';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import SwipeControls from './SwipeControls';
import SwipeInstructions from './SwipeInstructions';
import { useSwipeNavigation } from './useSwipeNavigation';
import { getPapers, type Paper } from '../../lib/supabase';
import { checkAndGenerateImageIfNeeded } from '../../lib/imageGenerationService';

const SwipeFeed: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingDemoData, setIsUsingDemoData] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { handleTouchStart, handleTouchMove, handleTouchEnd, handleWheel, nextPaper, prevPaper } = 
    useSwipeNavigation({
      currentIndex,
      setCurrentIndex,
      papersLength: papers.length,
      isScrolling
    });
  
  const setScrollingState = () => {
    setIsScrolling(true);
  };
  
  useEffect(() => {
    const generateImageForCurrentPaper = async () => {
      if (papers.length === 0 || isGeneratingImage) return;
      
      const currentPaper = papers[currentIndex];
      if (!currentPaper) return;
      
      if (currentPaper.ai_image_prompt && !currentPaper.image_url) {
        setIsGeneratingImage(true);
        
        try {
          const newImageUrl = await checkAndGenerateImageIfNeeded(currentPaper);
          
          if (newImageUrl) {
            setPapers(prevPapers => 
              prevPapers.map(paper => 
                paper.doi === currentPaper.doi 
                  ? { ...paper, image_url: newImageUrl } 
                  : paper
              )
            );
          }
        } catch (error) {
          console.error('Error generating image:', error);
        } finally {
          setIsGeneratingImage(false);
        }
      }
    };
    
    generateImageForCurrentPaper();
  }, [currentIndex, papers, isGeneratingImage]);
  
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
    
    const handleScrollStart = () => {
      console.log('Content scrolling started');
      setIsScrolling(true);
    };
    
    const handleScrollEnded = () => {
      console.log('Content scrolling ended');
      setIsScrolling(false);
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
      className="swipe-feed-container bg-black"
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
        <div className="flex flex-col items-center justify-center h-full text-center p-6 gap-4 text-white">
          <AlertTriangle className="text-amber-500" size={32} />
          <div className="text-xl font-semibold mb-2">Data Issue</div>
          <p className="text-gray-400">{error}</p>
        </div>
      ) : papers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white">
          <div className="text-xl font-semibold mb-2">No papers found</div>
          <p className="text-gray-400">Check back soon for new scientific content</p>
        </div>
      ) : (
        <>
          {isUsingDemoData && (
            <div className="absolute top-0 left-0 right-0 bg-amber-900/50 p-3 z-20">
              <div className="flex items-center gap-2 text-amber-200 text-sm">
                <AlertTriangle size={16} />
                <span>Using demo data. No papers found in your Supabase database.</span>
              </div>
            </div>
          )}
          
          <AnimatePresence mode="wait">
            {showInstructions && <SwipeInstructions />}
          </AnimatePresence>
          
          <div className="absolute inset-0">
            <AnimatePresence mode="wait">
              {papers.map((paper, index) => (
                index === currentIndex && (
                  <motion.div
                    key={paper.id || index}
                    className="absolute inset-0 p-4"
                  >
                    <PaperCard 
                      paper={paper} 
                      isActive={index === currentIndex} 
                      isGeneratingImage={isGeneratingImage && paper.doi === papers[currentIndex].doi} 
                    />
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
