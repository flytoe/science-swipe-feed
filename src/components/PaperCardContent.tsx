
import React, { useRef } from 'react';
import { Clock, ExternalLink } from 'lucide-react';
import { FormattedTakeaway } from '../utils/takeawayParser';
import PaperCardTakeaways from './PaperCardTakeaways';
import { ScrollArea } from './ui/scroll-area';

interface PaperCardContentProps {
  title: string;
  abstract?: string;
  formattedDate: string;
  doi?: string;
  takeaways: FormattedTakeaway[];
}

const PaperCardContent: React.FC<PaperCardContentProps> = ({
  title,
  abstract,
  formattedDate,
  doi,
  takeaways
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Prevent swipe events from bubbling up when scrolling content
  const handleContentTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="paper-card-content">
      <h2 className="paper-card-title">
        {title}
      </h2>
      
      <ScrollArea 
        className="flex-1 max-h-[calc(100vh-15rem)]" 
        ref={scrollRef}
        onTouchStart={handleContentTouchStart}
      >
        <div className="pr-2">
          {takeaways && takeaways.length > 0 ? (
            <PaperCardTakeaways takeaways={takeaways} />
          ) : abstract ? (
            // Fallback to abstract if no takeaways are available
            <p className="text-sm md:text-base text-gray-700 mb-4">
              {abstract}
            </p>
          ) : null}
        </div>
      </ScrollArea>
      
      <div className="paper-card-meta">
        <div className="flex items-center">
          <Clock size={14} className="mr-1" />
          <span>{formattedDate}</span>
        </div>
        {doi && (
          <a 
            href={`https://doi.org/${doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            <ExternalLink size={14} />
            <span>View Paper</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default PaperCardContent;
