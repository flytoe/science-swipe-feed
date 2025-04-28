
import React, { useState, useEffect } from 'react';
import { type Paper } from '../lib/supabase';
import FeedItem from './FeedItem';
import { motion, AnimatePresence } from 'framer-motion';
import InfiniteScrollTrigger from './InfiniteScrollTrigger';

interface ScrollableFeedProps {
  papers: Paper[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 10; // Increased from 5 to 10 for better preloading

const ScrollableFeed: React.FC<ScrollableFeedProps> = ({ 
  papers, 
  isLoading = false
}) => {
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [preloadedCount, setPreloadedCount] = useState(0);

  // Get only the papers we want to display
  const visiblePapers = papers.slice(0, displayCount);
  const hasMore = displayCount < papers.length;

  // Preload next batch when we're 3 items away from the end
  useEffect(() => {
    if (displayCount - preloadedCount <= 3 && hasMore && !loadingMore) {
      setPreloadedCount(displayCount);
      // Start preloading next batch
      setTimeout(() => {
        setDisplayCount(prev => Math.min(prev + ITEMS_PER_PAGE, papers.length));
      }, 100); // Very short timeout to not block UI
    }
  }, [displayCount, papers.length, hasMore, loadingMore, preloadedCount]);

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    
    setLoadingMore(true);
    // Simulate network delay for smooth UX
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + ITEMS_PER_PAGE, papers.length));
      setLoadingMore(false);
    }, 300); // Reduced from 500ms to 300ms for faster loading
  };

  if (isLoading && papers.length === 0) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-12rem)]">
        <div className="loading-spinner border-gray-200 border-t-blue-500" />
      </div>
    );
  }

  if (!papers || papers.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)] text-gray-500">
        <p>No papers available</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="scrollable-feed px-4 pb-20 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="max-w-md mx-auto">
        <AnimatePresence mode="popLayout">
          {visiblePapers.map((paper, index) => (
            <FeedItem key={paper.doi} paper={paper} index={index} />
          ))}
        </AnimatePresence>
        
        {hasMore && (
          <InfiniteScrollTrigger 
            onIntersect={loadMore}
            isLoading={loadingMore}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ScrollableFeed;
