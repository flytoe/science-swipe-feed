
import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import PaperCardTakeaways from './PaperCardTakeaways';
import { FormattedTakeaway } from '../utils/takeawayParser';
import HeroImageSection from './paper-content/HeroImageSection';
import AbstractSection from './paper-content/AbstractSection';
import OriginalTitleSection from './paper-content/OriginalTitleSection';
import DisclaimerSection from './paper-content/DisclaimerSection';
import ContentFooter from './paper-content/ContentFooter';

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
  hideFooter?: boolean;
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
  imageSrc,
  hideFooter = false
}) => {
  return (
    <div className="paper-card-content h-full flex flex-col">
      {/* Full height scroll container */}
      <ScrollArea className="flex-1 h-full overflow-auto">
        {/* Hero Image Section - now full width */}
        <HeroImageSection 
          imageSrc={imageSrc}
          title={title}
          creator={creator}
        />
        
        {/* Content section */}
        <div className="p-6">
          {/* Make takeaways prominently displayed */}
          {takeaways && takeaways.length > 0 ? (
            <PaperCardTakeaways takeaways={takeaways} />
          ) : abstract ? (
            // Fallback to abstract if no takeaways are available
            <p className="text-sm md:text-base text-white/80 mb-4">
              {abstract}
            </p>
          ) : null}
          
          {/* Original Title Section */}
          <OriginalTitleSection title={title} title_org={title_org} />
          
          {/* Original Abstract Section with Collapsible */}
          <AbstractSection abstract_org={abstract_org} />
          
          {/* AI Disclaimer */}
          <DisclaimerSection />
        </div>
      </ScrollArea>
      
      {!hideFooter && <ContentFooter formattedDate={formattedDate} doi={doi} />}
    </div>
  );
};

export default PaperCardContent;
