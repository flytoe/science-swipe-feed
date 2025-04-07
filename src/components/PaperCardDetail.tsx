
import React from 'react';
import { motion } from 'framer-motion';
import PaperCardContent from './PaperCardContent';
import { FormattedTakeaway } from '../utils/takeawayParser';
import { Badge } from './ui/badge';
import MindBlowBadge from './MindBlowBadge';
import { useMindBlow } from '../hooks/use-mind-blow';
import { Link } from 'react-router-dom';

interface PaperCardDetailProps {
  displayTitle: string;
  title_org?: string;
  abstract_org?: string;
  formattedDate: string;
  doi?: string;
  takeaways: FormattedTakeaway[];
  creator?: string[] | string | null;
  imageSrc: string;
  onClose: (e?: React.MouseEvent) => void;
}

const PaperCardDetail: React.FC<PaperCardDetailProps> = ({
  displayTitle,
  title_org,
  abstract_org,
  formattedDate,
  doi,
  takeaways,
  creator,
  imageSrc,
  onClose
}) => {
  // Get mind-blow data for the paper
  const { count: mindBlowCount, isTopPaper } = useMindBlow(doi || '');
  
  // Create encoded paper ID for the URL if DOI exists
  const encodedPaperId = doi ? encodeURIComponent(doi) : '';

  return (
    <motion.div
      className="h-full flex flex-col relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Link to full paper detail page */}
      {doi && (
        <div className="absolute top-4 right-4 z-20">
          <Link to={`/paper/${encodedPaperId}`} className="block">
            <Badge 
              variant="outline" 
              className="bg-blue-500/80 text-white border-none hover:bg-blue-600/80 transition-colors cursor-pointer"
            >
              View Full Details
            </Badge>
          </Link>
        </div>
      )}
      
      {/* Show date at the top */}
      <div className="absolute top-4 left-4 z-10">
        <Badge variant="outline" className="bg-white/70 backdrop-blur-sm text-gray-700 border-gray-200">
          {formattedDate}
        </Badge>
      </div>
      
      {/* Mind-blow badge - positioned at the top right */}
      {mindBlowCount > 0 && (
        <div className="absolute top-16 right-4 z-10">
          <MindBlowBadge count={mindBlowCount} />
        </div>
      )}
      
      <div className="flex-1 overflow-hidden h-full">
        <PaperCardContent
          title={displayTitle}
          title_org={title_org}
          abstract={abstract_org}
          abstract_org={abstract_org}
          formattedDate={formattedDate}
          doi={doi}
          takeaways={takeaways}
          creator={creator}
          imageSrc={imageSrc}
          hideFooter={true} // Hide the footer with date and link
        />
      </div>
    </motion.div>
  );
};

export default PaperCardDetail;
