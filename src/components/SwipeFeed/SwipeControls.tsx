
import React from 'react';
import { ChevronUp, ChevronDown, X, ExternalLink } from 'lucide-react';
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
  // Get mind-blow data for the paper when in detail mode
  const { count, hasMindBlown, isTopPaper, isLoading, toggleMindBlow } = 
    isDetailOpen && paperDoi ? useMindBlow(paperDoi) : { count: 0, hasMindBlown: false, isTopPaper: false, isLoading: false, toggleMindBlow: () => {} };

  // Create the DOI URL with proper handling
  const doiUrl = paperDoi && isDetailOpen ? (
    paperDoi.startsWith('http') ? paperDoi : `https://doi.org/${paperDoi}`
  ) : undefined;

  if (isDetailOpen) {
    return (
      <div className="fixed bottom-4 right-4 flex flex-col items-center justify-center gap-3 z-20">
        {/* Mind Blow Button */}
        <div className="relative">
          <MindBlowButton
            hasMindBlown={hasMindBlown}
            count={count}
            isTopPaper={isTopPaper}
            isLoading={isLoading}
            onClick={toggleMindBlow}
            size="icon"
            className="w-10 h-10 rounded-full shadow-md"
            showCount={false}
            variant="outline"
          />
          
          {/* Count indicator */}
          {count > 0 && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
            >
              {count}
            </motion.div>
          )}
        </div>
        
        {/* Original Paper Link */}
        {doiUrl && (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <a 
              href={doiUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View original paper"
              className="w-10 h-10 rounded-full bg-blue-950/80 hover:bg-blue-900/90 text-blue-400 border border-blue-900/40 shadow-md flex items-center justify-center"
            >
              <ExternalLink size={18} />
            </a>
          </motion.div>
        )}
        
        {/* Close Button */}
        {onClose && (
          <motion.button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/80 backdrop-blur-sm hover:bg-black/60 border border-white/10 text-white shadow-md flex items-center justify-center"
            aria-label="Close detail view"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={18} />
          </motion.button>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-center justify-center gap-3 z-20">
      <motion.button 
        onClick={onPrev}
        className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
        aria-label="Previous paper"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronUp size={20} />
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
        <ChevronDown size={20} />
      </motion.button>
    </div>
  );
};

export default SwipeControls;
