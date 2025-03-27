
import React from 'react';
import KeyTakeaway from './KeyTakeaway';
import { FormattedTakeaway } from '../utils/takeawayParser';
import { Badge } from './ui/badge';

interface PaperCardTakeawaysProps {
  takeaways: FormattedTakeaway[];
}

const PaperCardTakeaways: React.FC<PaperCardTakeawaysProps> = ({ takeaways }) => {
  if (!takeaways || takeaways.length === 0) return null;

  return (
    <div className="mt-4 mb-6">
      <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Key Takeaways</h3>
      <div className="space-y-4">
        {takeaways.map((takeaway, index) => (
          <div key={index} className="flex flex-col gap-1">
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
