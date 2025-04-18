
import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

interface AbstractSectionProps {
  abstract_org?: string;
  isWhiteText?: boolean;
}

const AbstractSection: React.FC<AbstractSectionProps> = ({ 
  abstract_org,
  isWhiteText = false
}) => {
  const [isAbstractOpen, setIsAbstractOpen] = React.useState(false);
  
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

  // Handle collapsible triggers to prevent propagation
  const handleReadMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAbstractOpen(true);
  };

  // Fix: Prevent the Read Less action from closing the detail view
  const handleReadLess = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAbstractOpen(false);
  };

  if (!abstract_org) return null;

  const textColorClass = isWhiteText ? 'text-white' : 'text-gray-700';
  const textColorClassSecondary = isWhiteText ? 'text-white/80' : 'text-gray-600';
  const buttonColorClass = isWhiteText ? 'text-white/80 hover:text-white' : 'text-blue-600 hover:text-blue-800';

  return (
    <div className={`mt-4 border-t border-white/20 pt-4`}>
      <h3 className={`text-sm font-medium ${textColorClass} mb-2`}>Abstract</h3>
      <Collapsible 
        open={isAbstractOpen} 
        onOpenChange={setIsAbstractOpen}
        className="space-y-2"
      >
        {!isAbstractOpen ? (
          <div className="flex flex-col space-y-1">
            <p className={`text-sm ${textColorClassSecondary}`}>{shortAbstract}</p>
            
            {cleanAbstract.length > 120 && (
              <CollapsibleTrigger asChild onClick={handleReadMore}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`self-start -ml-2 ${buttonColorClass}`}
                >
                  <span className="flex items-center gap-1">Read more <ChevronRight size={14} /></span>
                </Button>
              </CollapsibleTrigger>
            )}
          </div>
        ) : null}
        
        <CollapsibleContent>
          <p className={`text-sm ${textColorClassSecondary}`}>{cleanAbstract}</p>
          {cleanAbstract.length > 120 && (
            <CollapsibleTrigger asChild onClick={handleReadLess}>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`self-start -ml-2 mt-2 ${buttonColorClass}`}
              >
                <span className="flex items-center gap-1">Read less <ChevronDown size={14} /></span>
              </Button>
            </CollapsibleTrigger>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AbstractSection;
