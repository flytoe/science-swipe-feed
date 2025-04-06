
import React from 'react';
import { type Paper } from '../lib/supabase';
import FeedItem from './FeedItem';

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
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!papers || papers.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <p className="text-white/70">No papers available</p>
      </div>
    );
  }

  return (
    <div className="scrollable-feed px-4 pb-8">
      <div className="max-w-md mx-auto">
        {papers.map((paper, index) => (
          <FeedItem key={paper.doi} paper={paper} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ScrollableFeed;
