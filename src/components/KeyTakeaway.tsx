
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
          containerClass: 'key-takeaway-why-matters',
          iconColor: 'text-amber-500',
          borderColor: 'border-amber-200'
        };
      case 'finding':
        return {
          containerClass: 'key-takeaway-finding',
          iconColor: 'text-blue-500',
          borderColor: 'border-blue-200'
        };
      case 'methodology':
        return {
          containerClass: 'key-takeaway-methodology',
          iconColor: 'text-purple-500',
          borderColor: 'border-purple-200'
        };
      default:
        return {
          containerClass: '',
          iconColor: 'text-blue-500',
          borderColor: citation ? 'border-gray-200' : ''
        };
    }
  };

  const { containerClass, iconColor, borderColor } = getTypeStyles();

  return (
    <div className={`key-takeaway animate-fade-in ${containerClass} ${citation ? 'p-3 rounded-md ' + borderColor : ''}`}>
      <div className="flex items-start gap-2">
        <span className={`key-takeaway-icon ${iconColor}`}>
          <ArrowRight size={16} />
        </span>
        <div className="flex flex-col gap-1 flex-1">
          <span className="key-takeaway-text">{text}</span>
          {citation && (
            <div className="mt-1">
              <Badge variant="outline" className="text-xs font-normal text-gray-500">
                {citation}
              </Badge>
            </div>
          )}
          {type === 'why_it_matters' && !citation && (
            <div className="mt-1">
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs">
                Why it matters
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeyTakeaway;
