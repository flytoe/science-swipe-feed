
import React from 'react';
import KeyTakeaway from '../KeyTakeaway';
import { FormattedTakeaway } from '../../utils/takeawayParser';
import { LightbulbIcon } from 'lucide-react';

interface DetailTakeawaysProps {
  takeaways: FormattedTakeaway[];
}

const DetailTakeaways: React.FC<DetailTakeawaysProps> = ({ takeaways }) => {
  if (!takeaways || takeaways.length === 0) return null;

  // Find the "why it matters" takeaway, if any
  const whyItMattersTakeaway = takeaways.find(t => t.type === 'why_it_matters');
  
  // Get the regular takeaways
  const regularTakeaways = takeaways.filter(t => t.type !== 'why_it_matters');

  return (
    <div className="space-y-4">
      <h2 className="flex items-center text-xl font-semibold mb-4 text-white">
        <LightbulbIcon className="mr-2 h-5 w-5 text-amber-500" />
        Key Insights
      </h2>
      
      {regularTakeaways.length > 0 && (
        <div className="space-y-3">
          {regularTakeaways.map((takeaway, idx) => (
            <KeyTakeaway 
              key={idx} 
              text={takeaway.text} 
              citation={takeaway.citation} 
              type="default"
            />
          ))}
        </div>
      )}
      
      {whyItMattersTakeaway && (
        <div className="mt-4">
          <KeyTakeaway 
            text={whyItMattersTakeaway.text} 
            citation={whyItMattersTakeaway.citation} 
            type="why_it_matters"
          />
        </div>
      )}
    </div>
  );
};

export default DetailTakeaways;
