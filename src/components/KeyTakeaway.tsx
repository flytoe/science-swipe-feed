
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface KeyTakeawayProps {
  text: string;
  citation?: string;
  type?: 'default' | 'why_it_matters';
}

const KeyTakeaway: React.FC<KeyTakeawayProps> = ({
  text,
  citation,
  type = 'default',
}) => {
  // Different styling for "why it matters" takeaways
  const isWhyItMatters = type === 'why_it_matters';

  return (
    <div 
      className={`rounded-lg p-4 w-full shadow-sm ${
        isWhyItMatters 
          ? 'bg-indigo-100 text-indigo-900' 
          : 'bg-white text-gray-800'
      }`}
    >
      <div className="flex">
        <div className="mr-3 flex-shrink-0">
          <div className={`w-1.5 h-full ${
            isWhyItMatters 
              ? 'bg-gradient-to-b from-indigo-400 to-purple-500' 
              : 'bg-gradient-to-b from-blue-400 to-purple-500'
          } rounded-full`} />
        </div>
        
        <div className="flex-1">
          <p className={`${isWhyItMatters ? 'text-indigo-900' : 'text-gray-800'} text-base leading-relaxed`}>
            {text}
          </p>
          
          {citation && (
            <div className={`text-xs ${isWhyItMatters ? 'text-indigo-700' : 'text-gray-600'} mt-2 italic`}>
              {citation}
            </div>
          )}
        </div>
        
        {isWhyItMatters && (
          <div className="ml-auto pl-3 flex-shrink-0">
            <AlertCircle size={18} className="text-indigo-600" />
          </div>
        )}
      </div>
    </div>
  );
};

export default KeyTakeaway;
