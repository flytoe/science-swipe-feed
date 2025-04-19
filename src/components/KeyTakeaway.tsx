
import React, { useState } from 'react';
import { Link2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const handleCitationClick = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

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
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <button 
                    className="inline-flex text-white/60 hover:text-white ml-1 focus:outline-none"
                    onClick={handleCitationClick}
                  >
                    <Link2 size={14} />
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  side="top" 
                  className="max-w-[280px] z-50 bg-gray-800 text-white border-gray-700"
                >
                  <p className="text-sm">{citation}</p>
                </PopoverContent>
              </Popover>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyTakeaway;
