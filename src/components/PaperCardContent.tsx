
import React, { useRef, useEffect, useState } from 'react';
import { Clock, ExternalLink, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
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
  
  // Create the DOI URL with proper handling
  const doiUrl = doi ? (
    doi.startsWith('http') ? doi : `https://doi.org/${doi}`
  ) : undefined;
  
  // Handle collapsible triggers to prevent propagation
  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Fix: Prevent the Read More action from closing the detail view
  const handleReadMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAbstractOpen(true);
  };

  // Fix: Prevent the Read Less action from closing the detail view
  const handleReadLess = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAbstractOpen(false);
  };

  return (
    <div className="paper-card-content h-full flex flex-col">
      {/* Full height scroll container */}
      <ScrollArea className="flex-1 h-full overflow-auto">
        {/* Hero Image Section - Larger image similar to the reference */}
        <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <img 
            src={imageSrc || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop'}
            alt={title} 
            className="w-full h-full object-cover" 
          />
          
          {/* Gradient overlay for text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          
          {/* Title and author positioned at the bottom of the image */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-3xl font-bold text-white drop-shadow-md leading-tight">
              {title}
            </h2>
            
            {/* Display Creator if available */}
            {formatCreator(creator) && (
              <p className="text-base text-white/80 mt-2 drop-shadow-md">
                {formatCreator(creator)}
              </p>
            )}
          </div>
        </div>
        
        {/* Content section */}
        <div className="p-6">
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
                      <CollapsibleTrigger asChild onClick={handleReadMore}>
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
                    <CollapsibleTrigger asChild onClick={handleReadLess}>
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
          
          {/* AI Disclaimer */}
          <div className="mt-6 border-t border-white/10 pt-4 pb-2">
            <div className="bg-white/5 rounded-md p-3 flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-white/70">
                  This content was generated using AI and may contain inaccuracies or errors.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="self-start text-xs border-white/10 hover:bg-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                Report a problem
              </Button>
            </div>
          </div>
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
