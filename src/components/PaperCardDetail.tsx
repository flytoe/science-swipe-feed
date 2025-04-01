
import React from 'react';
import { motion } from 'framer-motion';
import PaperCardContent from './PaperCardContent';
import { FormattedTakeaway } from '../utils/takeawayParser';
import { Badge } from './ui/badge';

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
  return (
    <motion.div
      className="h-full flex flex-col relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Show date at the top */}
      <div className="absolute top-4 left-4 z-10">
        <Badge variant="outline" className="bg-black/50 backdrop-blur-sm text-white border-none">
          {formattedDate}
        </Badge>
      </div>
      
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
