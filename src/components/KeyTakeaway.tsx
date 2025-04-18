
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
          </p>
          
          {citation && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="mt-2 inline-flex items-center gap-1 text-xs text-white/60 hover:text-white">
                  <Link2 size={14} />
                  <span>View citation</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">{citation}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeyTakeaway;
