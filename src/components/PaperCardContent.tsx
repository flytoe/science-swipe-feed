
import React, { useRef, useEffect, useState } from 'react';
import { Clock, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { FormattedTakeaway } from '../utils/takeawayParser';
import PaperCardTakeaways from './PaperCardTakeaways';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Separator } from './ui/separator';

interface PaperCardContentProps {
  title: string;
  title_org?: string;
  abstract?: string;
  abstract_org?: string;
  formattedDate: string;
  doi?: string;
  takeaways: FormattedTakeaway[];
  creator?: string[] | string | null;
  imageSrc?: string;
}

const PaperCardContent: React.FC<PaperCardContentProps> = ({
  title,
  title_org,
  abstract,
  abstract_org,
  formattedDate,
  doi,
  takeaways,
  creator,
  imageSrc
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
  
  // Format creator display
  const formatCreator = (creator: string[] | string | null) => {
    if (!creator) return null;
    if (Array.isArray(creator)) {
      return creator.join(', ');
    }
    return creator;
  };
  
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
  
  // Handle collapsible triggers to prevent propagation
  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="paper-card-content h-full flex flex-col">
      {/* Hero Image Section */}
      <div className="relative h-40 min-h-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent z-10" />
        <img 
          src={imageSrc || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop'}
          alt={title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 flex flex-col justify-end p-4 z-20">
          <h2 className="text-2xl font-bold text-white drop-shadow-md leading-tight">
            {title}
          </h2>
          
          {/* Display Creator if available */}
          {formatCreator(creator) && (
            <p className="text-sm text-white/80 mt-1 drop-shadow-md">
              {formatCreator(creator)}
            </p>
          )}
        </div>
      </div>
      
      <ScrollArea 
        className="flex-1 h-full overflow-auto p-4"
        ref={scrollRef}
        onTouchStart={handleContentTouchStart}
      >
        <div className="pr-2">
          {takeaways && takeaways.length > 0 ? (
            <PaperCardTakeaways takeaways={takeaways} />
          ) : abstract ? (
            // Fallback to abstract if no takeaways are available
            <p className="text-sm md:text-base text-white/80 mb-4">
              {abstract}
            </p>
          ) : null}
          
          {/* Original Title Section */}
          {title_org && title_org !== title && (
            <div className="mt-6 border-t border-white/10 pt-4">
              <h3 className="text-sm font-medium text-white/80 mb-2">Original Title</h3>
              <p className="text-sm text-white/70">{title_org}</p>
            </div>
          )}
          
          {/* Original Abstract Section with Collapsible */}
          {abstract_org && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <h3 className="text-sm font-medium text-white/80 mb-2">Abstract</h3>
              <Collapsible 
                open={isAbstractOpen} 
                onOpenChange={setIsAbstractOpen}
                className="space-y-2"
              >
                {!isAbstractOpen ? (
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm text-white/70">{shortAbstract}</p>
                    
                    {cleanAbstract.length > 120 && (
                      <CollapsibleTrigger asChild onClick={handleTriggerClick}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="self-start -ml-2 text-blue-400"
                        >
                          <span className="flex items-center gap-1">Read more <ChevronRight size={14} /></span>
                        </Button>
                      </CollapsibleTrigger>
                    )}
                  </div>
                ) : null}
                
                <CollapsibleContent>
                  <p className="text-sm text-white/70">{cleanAbstract}</p>
                  {cleanAbstract.length > 120 && (
                    <CollapsibleTrigger asChild onClick={handleTriggerClick}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="self-start -ml-2 mt-2 text-blue-400"
                      >
                        <span className="flex items-center gap-1">Read less <ChevronDown size={14} /></span>
                      </Button>
                    </CollapsibleTrigger>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="paper-card-meta border-t border-white/10 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Clock size={14} className="mr-1 text-white/60" />
          <span className="text-white/60">{formattedDate}</span>
        </div>
        {doiUrl && (
          <Button 
            variant="outline"
            size="sm"
            className="inline-flex items-center gap-1 text-xs bg-blue-950/40 hover:bg-blue-900/60 text-blue-400 border-blue-900/40"
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
