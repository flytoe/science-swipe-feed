
import React from 'react';
import { Link2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

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
  const isWhyItMatters = type === 'why_it_matters';

  return (
    <div className={`rounded-lg p-4 w-full ${
      isWhyItMatters 
        ? 'text-indigo-100' 
        : 'text-white'
    }`}
    >
      <div className="flex gap-3">
        <div className="flex-1">
          <p className="text-base leading-relaxed">
            {text}
            {citation && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="inline-flex text-white/60 hover:text-white ml-1">
                    <Link2 size={14} />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[280px] z-50">
                    <p className="text-sm">{citation}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyTakeaway;
