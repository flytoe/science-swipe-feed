
import React from 'react';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { useMindBlow } from '../../hooks/use-mind-blow';
import MindBlowButton from '../MindBlowButton';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface SwipeControlsProps {
  currentIndex: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  isDetailOpen?: boolean;
  paperDoi?: string;
}

const SwipeControls: React.FC<SwipeControlsProps> = ({ 
  currentIndex, 
  total, 
  onNext, 
  onPrev,
  isDetailOpen = false,
  paperDoi = ''
}) => {
  // Get mind-blow data for the paper
  const { count, hasMindBlown, isTopPaper, isLoading, toggleMindBlow } = 
    useMindBlow(paperDoi || '');

  // Create DOI URL with proper handling
  const doiUrl = paperDoi ? (
    paperDoi.startsWith('http') ? paperDoi : `https://doi.org/${paperDoi}`
  ) : undefined;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-5 z-50 px-6 py-3 bg-black/80 backdrop-blur-sm rounded-full shadow-lg">
      {/* Navigation Controls */}
      <div className="flex items-center gap-4">
        <motion.button 
          onClick={onPrev}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          aria-label="Previous paper"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={18} />
        </motion.button>
        
        <div className="text-sm font-medium text-white px-3 py-1 rounded-full bg-white/10">
          {currentIndex + 1}/{total}
        </div>
        
        <motion.button 
          onClick={onNext}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          aria-label="Next paper"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowRight size={18} />
        </motion.button>
      </div>
      
      {/* View Paper Link - simplified with book icon */}
      {doiUrl && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <a 
            href={doiUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            aria-label="Read original paper"
          >
            <BookOpen size={18} />
          </a>
        </motion.div>
      )}
      
      {/* Mind Blow Button - with updated styling */}
      <MindBlowButton
        hasMindBlown={hasMindBlown}
        count={count}
        isTopPaper={isTopPaper}
        isLoading={isLoading}
        onClick={toggleMindBlow}
        size="icon"
        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors border-none"
        showCount={false}
        variant="ghost"
      />
    </div>
  );
};

export default SwipeControls;
