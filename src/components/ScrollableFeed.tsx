
import React, { useState } from 'react';
import { type Paper } from '../lib/supabase';
import FeedItem from './FeedItem';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollableFeedProps {
  papers: Paper[];
  isLoading?: boolean;
}

const ScrollableFeed: React.FC<ScrollableFeedProps> = ({ 
  papers, 
  isLoading = false
}) => {
  if (isLoading) {
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
      className="scrollable-feed px-4 pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-md mx-auto">
        <AnimatePresence>
          {papers.map((paper, index) => (
            <FeedItem key={paper.doi} paper={paper} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ScrollableFeed;
