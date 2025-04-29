
import React from 'react';
import KeyTakeaway from './KeyTakeaway';
import { FormattedTakeaway, formatTakeawayText, extractInsightsFromTakeaway } from '../utils/takeawayParser';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

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
      <h3 className="text-base font-semibold uppercase text-indigo-400 mb-4">Key Insights</h3>
      
      {/* Display "why it matters" takeaways first with special styling */}
      {whyItMattersTakeaways.length > 0 && (
        <div className="mb-5">
          {whyItMattersTakeaways.map((takeaway, index) => {
            const formattedText = formatTakeawayText(takeaway.text);
              
            return (
              <div key={`why-${index}`} className="flex flex-col gap-2 mb-4">
                <Badge variant="outline" className="self-start text-xs bg-indigo-100 text-indigo-800 border-indigo-300">
                  Why It Matters
                </Badge>
                <KeyTakeaway 
                  text={formattedText}
                  citation={takeaway.citation}
                  type="why_it_matters"
                />
              </div>
            );
          })}
        </div>
      )}
      
      {/* Display other takeaways */}
      <div className="space-y-5">
        {otherTakeaways.map((takeaway, index) => {
          // Handle complex text objects
          if (typeof takeaway.text === 'object') {
            const mainText = formatTakeawayText(takeaway.text);
            const insights = extractInsightsFromTakeaway(takeaway.text);
            
            return (
              <div key={`other-${index}`} className="flex flex-col gap-2 mb-4">
                {takeaway.citation && (
                  <Badge variant="outline" className="self-start text-xs bg-blue-100 text-blue-800 border-blue-300">
                    {takeaway.citation}
                  </Badge>
                )}
                <KeyTakeaway 
                  text={mainText}
                  citation={null}
                  type="default"
                />
                
                {insights.length > 0 && (
                  <div className="pl-4 space-y-2 mt-2">
                    {insights.map((insight, insightIdx) => (
                      <div 
                        key={`insight-${index}-${insightIdx}`} 
                        className="text-sm text-gray-700 border-l-2 border-blue-300 pl-3 py-1 bg-white/50"
                      >
                        {insight}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          
          // Handle simple string takeaways
          return (
            <div key={`other-${index}`} className="flex flex-col gap-2 mb-4">
              {takeaway.citation && (
                <Badge variant="outline" className="self-start text-xs bg-blue-100 text-blue-800 border-blue-300">
                  {takeaway.citation}
                </Badge>
              )}
              <KeyTakeaway 
                text={takeaway.text as string}
                citation={null}
                type="default"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaperCardTakeaways;
