
import React from 'react';
import PaperCardTakeaways from './PaperCardTakeaways';
import { FormattedTakeaway } from '../utils/takeawayParser';
import OriginalTitleSection from './paper-content/OriginalTitleSection';
import AbstractSection from './paper-content/AbstractSection';
import DisclaimerSection from './paper-content/DisclaimerSection';

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
      <div className="p-6 pt-20 pb-24 max-w-4xl mx-auto">
        {/* Main takeaways section with expanded width */}
        <div className="mb-6">
          {takeaways && takeaways.length > 0 ? (
            <PaperCardTakeaways takeaways={takeaways} />
          ) : abstract ? (
            // Fallback to abstract if no takeaways are available
            <div className="mt-6 mb-8">
              <h3 className="text-base font-semibold uppercase text-indigo-400 mb-4">Summary</h3>
              <p className="text-base text-white/80 leading-relaxed">
                {abstract}
              </p>
            </div>
          ) : null}
        </div>
        
        <OriginalTitleSection title={title} title_org={title_org} />
        <AbstractSection abstract_org={abstract_org} />
        <DisclaimerSection />
      </div>
    </div>
  );
};

export default PaperCardContent;
