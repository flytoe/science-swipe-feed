
import React, { useState } from 'react';
import { type Paper } from '../lib/supabase';
import FeedItem from './FeedItem';
import { motion, AnimatePresence } from 'framer-motion';
import InfiniteScrollTrigger from './InfiniteScrollTrigger';

interface ScrollableFeedProps {
  papers: Paper[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 5;

const ScrollableFeed: React.FC<ScrollableFeedProps> = ({ 
  papers, 
  isLoading = false
}) => {
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);

  // Get only the papers we want to display
  const visiblePapers = papers.slice(0, displayCount);
  const hasMore = displayCount < papers.length;

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    
    setLoadingMore(true);
    // Simulate network delay for smooth UX
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + ITEMS_PER_PAGE, papers.length));
      setLoadingMore(false);
    }, 500);
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
