
import React from 'react';
import { Card } from '../ui/card';
import { FormattedTakeaway } from '../../utils/takeawayParser';
import KeyTakeaway from '../KeyTakeaway';

interface TakeawaysSlideProps {
  takeaways: FormattedTakeaway[];
}

const TakeawaysSlide: React.FC<TakeawaysSlideProps> = ({ takeaways }) => {
  if (!takeaways || takeaways.length === 0) {
    return (
      <Card className="w-full h-full flex items-center justify-center p-6 bg-gray-50">
        <p className="text-gray-500 text-center">No key insights available for this paper.</p>
      </Card>
    );
  }

  // Now we're displaying just one takeaway per slide
  const takeaway = takeaways[0];
  const takeawayText = typeof takeaway.text === 'string' 
    ? takeaway.text 
    : JSON.stringify(takeaway.text);

  return (
    <Card className="w-full h-full flex items-center p-6 bg-white">
      <div className="w-full max-w-2xl mx-auto">
        <KeyTakeaway 
          text={takeawayText} 
          citation={takeaway.citation} 
          type={takeaway.type || 'default'} 
        />
      </div>
    </Card>
  );
};

export default TakeawaysSlide;
