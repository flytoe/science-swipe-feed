import React from 'react';
import { FormattedTakeaway } from '../../utils/takeawayParser';
import KeyTakeaway from '../KeyTakeaway';
import { Badge } from '../ui/badge';

interface TakeawaysSlideProps {
  takeaways: FormattedTakeaway[];
  currentIndex?: number;
  totalTakeaways?: number;
}

const TakeawaysSlide: React.FC<TakeawaysSlideProps> = ({ 
  takeaways,
  currentIndex = 0,
  totalTakeaways = 0
}) => {
  if (!takeaways || takeaways.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm min-h-[280px] h-full">
        <p className="text-white/80 text-center">No key insights available for this paper.</p>
      </div>
    );
  }

  const takeaway = takeaways[0];
  const isWhyItMatters = takeaway.type === 'why_it_matters';
  const takeawayText = typeof takeaway.text === 'string' ? takeaway.text : JSON.stringify(takeaway.text);
  
  let displayNumber;
  if (isWhyItMatters) {
    displayNumber = 'Why It Matters';
  } else if (takeaway.citation) {
    displayNumber = takeaway.citation;
  } else if (currentIndex !== undefined && totalTakeaways) {
    displayNumber = `Research Finding ${currentIndex + 1} of ${totalTakeaways}`;
  } else {
    displayNumber = 'Research Finding';
  }

  return (
    <div className="flex items-center p-6 bg-black/60 backdrop-blur-sm min-h-[280px] h-full">
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-6">
          <Badge 
            variant="outline" 
            className={`
              ${isWhyItMatters 
                ? 'bg-indigo-500/20 border-indigo-400/30' 
                : 'bg-purple-500/20 border-purple-400/30'
              } 
              text-white text-base px-3 py-1
            `}
          >
            {displayNumber}
          </Badge>
        </div>
        <KeyTakeaway 
          text={takeawayText} 
          citation={takeaway.citation} 
          type={takeaway.type || 'default'} 
        />
      </div>
    </div>
  );
};

export default TakeawaysSlide;
