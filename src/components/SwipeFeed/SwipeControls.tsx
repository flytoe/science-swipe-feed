
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface SwipeControlsProps {
  currentIndex: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}

const SwipeControls: React.FC<SwipeControlsProps> = ({ 
  currentIndex, 
  total, 
  onNext, 
  onPrev 
}) => {
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
