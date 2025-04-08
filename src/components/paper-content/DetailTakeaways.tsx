
import React from 'react';
import KeyTakeaway from '../KeyTakeaway';
import { FormattedTakeaway, formatTakeawayText, extractInsightsFromTakeaway } from '../../utils/takeawayParser';
import { LightbulbIcon } from 'lucide-react';
import { Card } from '../ui/card';

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
          {regularTakeaways.map((takeaway, idx) => {
            // Handle complex text objects like {main, insight_1, insight_2}
            if (typeof takeaway.text === 'object') {
              const mainText = formatTakeawayText(takeaway.text);
              const insights = extractInsightsFromTakeaway(takeaway.text);
              
              return (
                <div key={idx} className="space-y-2">
                  <KeyTakeaway 
                    key={`main-${idx}`} 
                    text={mainText} 
                    citation={takeaway.citation} 
                    type="default"
                  />
                  
                  {insights.length > 0 && (
                    <div className="pl-6 space-y-2">
                      {insights.map((insight, insightIdx) => (
                        <Card 
                          key={`insight-${idx}-${insightIdx}`} 
                          className="bg-white/5 border-slate-800 p-3"
                        >
                          <p className="text-white/80 text-sm">{insight}</p>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            
            // Handle regular string text
            return (
              <KeyTakeaway 
                key={idx} 
                text={takeaway.text as string} 
                citation={takeaway.citation} 
                type="default"
              />
            );
          })}
        </div>
      )}
      
      {whyItMattersTakeaway && (
        <div className="mt-4">
          <KeyTakeaway 
            text={typeof whyItMattersTakeaway.text === 'string' 
              ? whyItMattersTakeaway.text 
              : formatTakeawayText(whyItMattersTakeaway.text)
            } 
            citation={whyItMattersTakeaway.citation} 
            type="why_it_matters"
          />
        </div>
      )}
    </div>
  );
};

export default DetailTakeaways;
