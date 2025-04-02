
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
  abstract?: string | null;  // Making abstract nullable to match Paper type
  abstract_org?: string;
  formattedDate: string;
  doi?: string;
  takeaways: FormattedTakeaway[];
  creator?: string[] | string | null;
  imageSrc?: string;
  hideFooter?: boolean;
  hideHeroImage?: boolean;
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
  hideFooter = false,
  hideHeroImage = false
}) => {
  return (
    <div className="paper-card-content h-full flex flex-col overflow-y-auto">
      {/* Content section with improved spacing - added significantly more bottom padding for action bar */}
      <div className="p-6 pt-0 pb-32">
        {/* Main takeaways section */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Key Takeaways</h3>
          {takeaways && takeaways.length > 0 ? (
            <PaperCardTakeaways takeaways={takeaways} />
          ) : abstract ? (
            // Fallback to abstract if no takeaways are available
            <p className="text-sm md:text-base text-white/80 mb-4">
              {abstract}
            </p>
          ) : null}
        </div>
        
        {/* Original Title Section */}
        <OriginalTitleSection title={title} title_org={title_org} />
        
        {/* Original Abstract Section with Collapsible */}
        <AbstractSection abstract_org={abstract_org} />
        
        {/* AI Disclaimer */}
        <DisclaimerSection />
      </div>
      
      {/* Footer is conditionally rendered */}
      {!hideFooter && <ContentFooter formattedDate={formattedDate} doi={doi} />}
    </div>
  );
};

export default PaperCardContent;
