
import React from 'react';
import { ChevronUp, ChevronDown, X, ExternalLink } from 'lucide-react';
import { useMindBlow } from '../../hooks/use-mind-blow';
import MindBlowButton from '../MindBlowButton';

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
        
        {/* Original Paper Link */}
        {doiUrl && (
          <div className="w-10 h-10 rounded-full bg-blue-950/80 hover:bg-blue-900/90 text-blue-400 border-blue-900/40 shadow-md flex items-center justify-center">
            <a 
              href={doiUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View original paper"
              className="w-full h-full flex items-center justify-center"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        )}
        
        {/* Close Button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/80 backdrop-blur-sm hover:bg-black/60 border border-white/10 text-white shadow-md flex items-center justify-center"
            aria-label="Close detail view"
          >
            <X size={18} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-center justify-center gap-3 z-20">
      <button 
        onClick={onPrev}
        className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
        aria-label="Previous paper"
      >
        <ChevronUp size={20} />
      </button>
      <div className="text-sm font-medium text-white bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full">
        {currentIndex + 1}/{total}
      </div>
      <button 
        onClick={onNext}
        className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
        aria-label="Next paper"
      >
        <ChevronDown size={20} />
      </button>
    </div>
  );
};

export default SwipeControls;
