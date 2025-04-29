
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
      <h2 className="flex items-center text-xl font-semibold mb-4 text-gray-800">
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
                  <Card className="bg-gray-50 border border-gray-200 p-4 shadow-sm">
                    <div className="flex">
                      <div className="mr-3 flex-shrink-0">
                        <div className="w-1 h-full bg-gradient-to-b from-blue-400 to-purple-500 rounded-full" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1 text-gray-800">{mainText}</h3>
                        {takeaway.citation && (
                          <p className="text-gray-500 text-sm">{takeaway.citation}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                  
                  {insights.length > 0 && (
                    <div className="pl-6 space-y-2">
                      {insights.map((insight, insightIdx) => (
                        <Card 
                          key={`insight-${idx}-${insightIdx}`} 
                          className="bg-gray-50 border-gray-200 p-3"
                        >
                          <p className="text-gray-700 text-sm">{insight}</p>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            
            // Handle regular string text
            return (
              <Card key={idx} className="bg-gray-50 border border-gray-200 p-4 shadow-sm">
                <div className="flex">
                  <div className="mr-3 flex-shrink-0">
                    <div className="w-1 h-full bg-gradient-to-b from-blue-400 to-purple-500 rounded-full" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1 text-gray-800">{takeaway.text as string}</h3>
                    {takeaway.citation && (
                      <p className="text-gray-500 text-sm">{takeaway.citation}</p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      
      {whyItMattersTakeaway && (
        <div className="mt-4">
          <Card className="bg-indigo-50 border border-indigo-200 p-4 shadow-sm">
            <div className="flex">
              <div className="mr-3 flex-shrink-0">
                <div className="w-1 h-full bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1 text-indigo-900">
                  {formatTakeawayText(whyItMattersTakeaway.text)}
                </h3>
                {whyItMattersTakeaway.citation && (
                  <p className="text-indigo-600 text-sm">{whyItMattersTakeaway.citation}</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DetailTakeaways;
