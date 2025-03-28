
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import PaperCardContent from './PaperCardContent';
import { FormattedTakeaway } from '../utils/takeawayParser';

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
      {/* Close button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
        onClick={(e) => onClose(e)}
      >
        <X size={18} />
      </Button>
      
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
        />
      </div>
    </motion.div>
  );
};

export default PaperCardDetail;
