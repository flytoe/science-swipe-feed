
import React from 'react';
import PaperCardTakeaways from './PaperCardTakeaways';
import { FormattedTakeaway } from '../utils/takeawayParser';
import HeroImageSection from './paper-content/HeroImageSection';
import OriginalTitleSection from './paper-content/OriginalTitleSection';
import AbstractSection from './paper-content/AbstractSection';
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
    <div className="paper-card-content">
      {/* Content section with improved spacing - increased width for better readability */}
      <div className="p-6 pt-0 pb-28">
        {/* Main takeaways section with expanded width */}
        <div className="mb-6 max-w-4xl mx-auto">
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
