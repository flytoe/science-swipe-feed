
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';

type KeyTakeawayProps = {
  text: string;
  citation?: string;
  type?: string;
};

const KeyTakeaway: React.FC<KeyTakeawayProps> = ({ text, citation, type }) => {
  // Get the appropriate styling based on the takeaway type
  const getTypeStyles = () => {
    switch (type) {
      case 'why_it_matters':
        return {
          iconColor: 'text-amber-500',
          badgeClass: 'bg-amber-100 text-amber-800 hover:bg-amber-200'
        };
      case 'finding':
        return {
          iconColor: 'text-blue-500',
          badgeClass: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        };
      case 'methodology':
        return {
          iconColor: 'text-purple-500',
          badgeClass: 'bg-purple-100 text-purple-800 hover:bg-purple-200'
        };
      default:
        return {
          iconColor: 'text-blue-500',
          badgeClass: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        };
    }
  };

  const { iconColor, badgeClass } = getTypeStyles();
  
  // Ensure text is a string
  const displayText = typeof text === 'string' ? text : 
    (text && typeof text === 'object' && 'text' in text) ? String(text.text) : 'No content';

  return (
    <div className="key-takeaway animate-fade-in mb-3">
      <div className="flex items-start gap-2">
        <span className={`key-takeaway-icon ${iconColor}`}>
          <ArrowRight size={16} />
        </span>
        <div className="flex flex-col gap-1 flex-1">
          <span className="key-takeaway-text">{displayText}</span>
          {citation && (
            <div className="mt-1">
              <Badge variant="outline" className="text-xs font-normal text-gray-500">
                {citation}
              </Badge>
            </div>
          )}
          {type && !citation && (
            <div className="mt-1">
              <Badge className={`text-xs ${badgeClass}`}>
                {type === 'why_it_matters' ? 'Why it matters' : 
                 type === 'finding' ? 'Key finding' : 
                 type === 'methodology' ? 'Methodology' : type}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeyTakeaway;
