
import React, { useRef, useEffect } from 'react';
import { Clock, ExternalLink } from 'lucide-react';
import { FormattedTakeaway } from '../utils/takeawayParser';
import PaperCardTakeaways from './PaperCardTakeaways';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

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
  
  // Handle scroll events to prevent card swipes during content scrolling
  const handleContentScroll = (e: Event) => {
    // Create and dispatch custom events for scroll state
    const scrollEvent = new CustomEvent('scrollContent');
    document.dispatchEvent(scrollEvent);
  };
  
  const handleScrollEnd = () => {
    // Wait a bit before enabling swiping again
    setTimeout(() => {
      const endEvent = new CustomEvent('scrollEnd');
      document.dispatchEvent(endEvent);
    }, 200);
  };

  useEffect(() => {
    const scrollArea = scrollRef.current;
    
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleContentScroll, { passive: true });
      scrollArea.addEventListener('touchend', handleScrollEnd, { passive: true });
      
      return () => {
        scrollArea.removeEventListener('scroll', handleContentScroll);
        scrollArea.removeEventListener('touchend', handleScrollEnd);
      };
    }
  }, []);

  // Prevent swipe events from bubbling up when interacting with content
  const handleContentTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const scrollEvent = new CustomEvent('scrollContent');
    document.dispatchEvent(scrollEvent);
  };

  // Create the DOI URL
  const doiUrl = doi ? `https://doi.org/${doi}` : undefined;

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
        {doiUrl && (
          <a 
            href={doiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
            onClick={(e) => e.stopPropagation()}
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
