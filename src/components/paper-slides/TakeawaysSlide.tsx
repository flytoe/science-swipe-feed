
import React from 'react';
import { FormattedTakeaway } from '../../utils/takeawayParser';
import KeyTakeaway from '../KeyTakeaway';

interface TakeawaysSlideProps {
  takeaways: FormattedTakeaway[];
}

const TakeawaysSlide: React.FC<TakeawaysSlideProps> = ({ takeaways }) => {
  if (!takeaways || takeaways.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 bg-gray-50 min-h-[280px] h-full">
        <p className="text-gray-500 text-center">No key insights available for this paper.</p>
      </div>
    );
  }

  const takeaway = takeaways[0];
  const takeawayText = typeof takeaway.text === 'string' 
    ? takeaway.text 
    : JSON.stringify(takeaway.text);

  return (
    <div className="flex items-center p-6 bg-white min-h-[280px] h-full">
      <div className="w-full max-w-2xl mx-auto">
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
