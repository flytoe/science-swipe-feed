
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
    <div className="mt-6 mb-8">
      <h3 className="text-base font-semibold uppercase text-indigo-400 mb-3">Key Insights</h3>
      
      {/* Display "why it matters" takeaways first with special styling */}
      {whyItMattersTakeaways.length > 0 && (
        <div className="mb-4">
          {whyItMattersTakeaways.map((takeaway, index) => (
            <div key={`why-${index}`} className="flex flex-col gap-2 mb-4">
              {takeaway.tag && (
                <Badge variant="outline" className="self-start text-xs bg-indigo-900/40 text-indigo-300 border-indigo-700/50">
                  {takeaway.tag || 'Why It Matters'}
                </Badge>
              )}
              <KeyTakeaway 
                text={takeaway.text} 
                citation={takeaway.citation}
                type="why_it_matters"
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Display other takeaways */}
      <div className="space-y-4">
        {otherTakeaways.map((takeaway, index) => (
          <div key={`other-${index}`} className="flex flex-col gap-2 mb-3">
            {takeaway.tag && (
              <Badge variant="outline" className="self-start text-xs">
                {takeaway.tag}
              </Badge>
            )}
            <KeyTakeaway 
              text={takeaway.text} 
              citation={takeaway.citation}
              type="default"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaperCardTakeaways;
