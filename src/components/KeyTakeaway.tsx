
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, AlertOctagon, ArrowUpRight } from 'lucide-react';

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
      className={`rounded-lg p-3 ${
        isWhyItMatters 
          ? 'bg-indigo-950/40 border border-indigo-800/30' 
          : 'bg-white/5'
      }`}
    >
      <div className="flex">
        <div className="mr-3 flex-shrink-0">
          <div className={`w-1 h-full ${
            isWhyItMatters 
              ? 'bg-gradient-to-b from-indigo-400 to-purple-500' 
              : 'bg-gradient-to-b from-blue-400 to-purple-500'
          } rounded-full`} />
        </div>
        
        <div>
          <p className="text-white/90">
            {text}
          </p>
          
          {citation && (
            <div className="text-xs text-white/60 mt-1 italic">
              {citation}
            </div>
          )}
        </div>
        
        {isWhyItMatters && (
          <div className="ml-auto pl-3">
            <AlertCircle size={16} className="text-indigo-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default KeyTakeaway;
