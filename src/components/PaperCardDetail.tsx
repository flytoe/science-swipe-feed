
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormattedTakeaway } from '../utils/takeawayParser';
import { useMindBlow } from '../hooks/use-mind-blow';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
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
  const { count: mindBlowCount } = useMindBlow(doi || '');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  return (
    <motion.div
      className="h-full flex flex-col relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 transition-[filter] duration-300"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: isTransitioning ? 'blur(8px)' : 'none'
          }}
        />
      </div>

      <Carousel 
        className="w-full h-full"
        setApi={(api) => {
          if (api) {
            api.on('select', () => {
              setIsTransitioning(true);
              setTimeout(() => setIsTransitioning(false), 300);
              setCurrentSlide(api.selectedScrollSnap());
            });
          }
        }}
      >
        <CarouselContent className="h-full">
          <CarouselItem className="h-full">
            <HeroSlide
              title={displayTitle}
              imageSrc={imageSrc}
              formattedDate={formattedDate}
              mindBlowCount={mindBlowCount}
              creator={creator}
              isFirstSlide={currentSlide === 0}
              activeIndex={currentSlide}
            />
          </CarouselItem>
          
          {takeaways.map((takeaway, index) => (
            <CarouselItem key={index} className="h-full">
              <TakeawaysSlide 
                takeaways={[takeaway]} 
                currentIndex={index}
                totalTakeaways={takeaways.length}
              />
            </CarouselItem>
          ))}
          
          <CarouselItem className="h-full">
            <DetailSlide
              title={displayTitle}
              title_org={title_org}
              abstract_org={abstract_org}
              doi={doi}
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </motion.div>
  );
};

export default PaperCardDetail;
