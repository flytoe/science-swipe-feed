
import React from 'react';
import KeyTakeaway from './KeyTakeaway';
import { FormattedTakeaway } from '../utils/takeawayParser';
import { Badge } from './ui/badge';

interface PaperCardTakeawaysProps {
  takeaways: FormattedTakeaway[];
}

const PaperCardTakeaways: React.FC<PaperCardTakeawaysProps> = ({ takeaways }) => {
  if (!takeaways || takeaways.length === 0) return null;
  
  // Split takeaways into "why it matters" and other takeaways
  const whyItMattersTakeaways = takeaways.filter(t => t.type === 'why_it_matters');
  const otherTakeaways = takeaways.filter(t => t.type !== 'why_it_matters');

  return (
    <div className="mt-4 mb-6">
      <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Key Takeaways</h3>
      
      {/* Display "why it matters" takeaways first */}
      {whyItMattersTakeaways.length > 0 && (
        <div className="mb-4">
          {whyItMattersTakeaways.map((takeaway, index) => (
            <div key={`why-${index}`} className="flex flex-col gap-1 mb-3">
              {takeaway.tag && (
                <Badge variant="outline" className="self-start text-xs">
                  {takeaway.tag}
                </Badge>
              )}
              <KeyTakeaway 
                text={takeaway.text} 
                citation={takeaway.citation}
                type={takeaway.type}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Display other takeaways */}
      <div className="space-y-4">
        {otherTakeaways.map((takeaway, index) => (
          <div key={`other-${index}`} className="flex flex-col gap-1">
            {takeaway.tag && (
              <Badge variant="outline" className="self-start text-xs">
                {takeaway.tag}
              </Badge>
            )}
            <KeyTakeaway 
              text={takeaway.text} 
              citation={takeaway.citation}
              type={takeaway.type}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaperCardTakeaways;
