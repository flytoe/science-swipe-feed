
import React, { useRef, useEffect, useState } from 'react';
import { Clock, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { FormattedTakeaway } from '../utils/takeawayParser';
import PaperCardTakeaways from './PaperCardTakeaways';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Badge } from './ui/badge';

interface PaperCardContentProps {
  title: string;
  title_org?: string;
  abstract?: string;
  abstract_org?: string;
  formattedDate: string;
  doi?: string;
  takeaways: FormattedTakeaway[];
}

const PaperCardContent: React.FC<PaperCardContentProps> = ({
  title,
  title_org,
  abstract,
  abstract_org,
  formattedDate,
  doi,
  takeaways
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAbstractOpen, setIsAbstractOpen] = useState(false);
  
  // Process abstract_org to remove "arXiv:..." prefix
  const cleanAbstract = abstract_org 
    ? abstract_org.includes("Abstract:") 
      ? abstract_org.split("Abstract:")[1].trim()
      : abstract_org
    : "";
  
  // Create shortened version (120 chars)
  const shortAbstract = cleanAbstract 
    ? cleanAbstract.length > 120 
      ? cleanAbstract.substring(0, 120) + "..." 
      : cleanAbstract
    : "";
  
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

  // Create the DOI URL with proper handling
  const doiUrl = doi ? (
    doi.startsWith('http') ? doi : `https://doi.org/${doi}`
  ) : undefined;

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
          
          {/* Original Title Section */}
          {title_org && title_org !== title && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <Badge variant="outline" className="mb-2">Original Title</Badge>
              <p className="text-sm text-gray-700">{title_org}</p>
            </div>
          )}
          
          {/* Original Abstract Section with Collapsible */}
          {abstract_org && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <Badge variant="outline" className="mb-2">Abstract</Badge>
              <Collapsible 
                open={isAbstractOpen} 
                onOpenChange={setIsAbstractOpen}
                className="space-y-2"
              >
                <div className="flex flex-col space-y-1">
                  <p className="text-sm text-gray-700">{shortAbstract}</p>
                  
                  {cleanAbstract.length > 120 && (
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="self-start -ml-2 text-blue-600"
                      >
                        {isAbstractOpen ? (
                          <span className="flex items-center gap-1">Read less <ChevronDown size={14} /></span>
                        ) : (
                          <span className="flex items-center gap-1">Read more <ChevronRight size={14} /></span>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  )}
                </div>
                
                <CollapsibleContent>
                  <p className="text-sm text-gray-700">{cleanAbstract}</p>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="paper-card-meta">
        <div className="flex items-center">
          <Clock size={14} className="mr-1" />
          <span>{formattedDate}</span>
        </div>
        {doiUrl && (
          <Button 
            variant="outline"
            size="sm"
            className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <a 
              href={doiUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={14} />
              <span>View Paper</span>
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaperCardContent;
