
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMindBlow } from '../../hooks/use-mind-blow';
import MindBlowButton from '../MindBlowButton';
import { motion } from 'framer-motion';

interface SwipeControlsProps {
  currentIndex: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  isDetailOpen?: boolean;
  paperDoi?: string;
  onClose?: () => void;
}

const SwipeControls: React.FC<SwipeControlsProps> = ({ 
  currentIndex, 
  total, 
  onNext, 
  onPrev,
  isDetailOpen = false,
  paperDoi = '',
  onClose
}) => {
  // Get mind-blow data for the paper
  const { count, hasMindBlown, isTopPaper, isLoading, toggleMindBlow } = 
    useMindBlow(paperDoi || '');

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-3 z-20">
      {/* Navigation Controls */}
      <div className="flex items-center gap-3">
        <motion.button 
          onClick={onPrev}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
          aria-label="Previous paper"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={20} />
        </motion.button>
        
        <div className="text-sm font-medium text-white bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full">
          {currentIndex + 1}/{total}
        </div>
        
        <motion.button 
          onClick={onNext}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
          aria-label="Next paper"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>
      
      {/* Mind Blow Button */}
      <div className="ml-2">
        <MindBlowButton
          hasMindBlown={hasMindBlown}
          count={count}
          isTopPaper={isTopPaper}
          isLoading={isLoading}
          onClick={toggleMindBlow}
          size="icon"
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white shadow-md transition-colors"
          showCount={false}
          variant="outline"
        />
      </div>
    </div>
  );
};

export default SwipeControls;
