
import React from 'react';
import { motion } from 'framer-motion';
import { FormattedTakeaway } from '../utils/takeawayParser';
import { useMindBlow } from '../hooks/use-mind-blow';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import HeroSlide from './paper-slides/HeroSlide';
import TakeawaysSlide from './paper-slides/TakeawaysSlide';
import DetailSlide from './paper-slides/DetailSlide';

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
}) => {
  // Get mind-blow data for the paper
  const { count: mindBlowCount } = useMindBlow(doi || '');
  
  return (
    <motion.div
      className="h-full flex flex-col relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Carousel className="w-full h-full">
        <CarouselContent className="h-full">
          <CarouselItem className="h-full">
            <HeroSlide
              title={displayTitle}
              imageSrc={imageSrc}
              formattedDate={formattedDate}
              mindBlowCount={mindBlowCount}
              creator={creator}
            />
          </CarouselItem>
          
          <CarouselItem className="h-full">
            <TakeawaysSlide takeaways={takeaways} />
          </CarouselItem>
          
          <CarouselItem className="h-full">
            <DetailSlide
              title={displayTitle}
              title_org={title_org}
              abstract_org={abstract_org}
              doi={doi}
            />
          </CarouselItem>
        </CarouselContent>
        
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </motion.div>
  );
};

export default PaperCardDetail;
