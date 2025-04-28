
import React from 'react';
import { Badge } from '../ui/badge';

interface MatterSlideProps {
  matter: string;
}

const MatterSlide: React.FC<MatterSlideProps> = ({ matter }) => {
  if (!matter) return null;

  return (
    <div className="flex items-center p-6 bg-black/60 backdrop-blur-sm min-h-[280px] h-full">
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-6">
          <Badge 
            variant="outline" 
            className="bg-indigo-500/20 text-white border-indigo-400/30 text-base px-3 py-1"
          >
            Why It Matters
          </Badge>
        </div>
        <p className="text-white text-lg leading-relaxed">
          {matter}
        </p>
      </div>
    </div>
  );
};

export default MatterSlide;
