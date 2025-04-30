
import React from 'react';
import { motion } from 'framer-motion';
import { FormattedTakeaway } from '../utils/takeawayParser';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots
} from './ui/carousel';
import HeroSlide from './paper-slides/HeroSlide';
import MatterSlide from './paper-slides/MatterSlide';
import DetailSlide from './paper-slides/DetailSlide';
import TakeawaysSlide from './paper-slides/TakeawaysSlide';
import PostTypeBadge from './PostTypeBadge';
import { Paper } from '../types/paper';

interface PaperCardDetailProps {
  displayTitle: string;
  title_org?: string;
  abstract_org?: string;
  formattedDate: string;
  doi?: string;
  takeaways: FormattedTakeaway[];
  creator?: string[] | string | null;
  imageSrc: string;
  ai_matter?: string;
  post_type?: string | null;
  paper?: Paper;
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
  ai_matter,
  post_type,
  paper
}) => {
  // Separate takeaways into research findings and "Why It Matters"
  const researchTakeaways = takeaways.filter(t => t.type !== 'why_it_matters');
  
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
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      <Carousel className="w-full h-full relative">
        <CarouselContent className="-ml-0">
          {/* Hero Slide */}
          <CarouselItem className="pl-0">
            <HeroSlide
              title={displayTitle}
              imageSrc={imageSrc}
              formattedDate={formattedDate}
              creator={creator}
              postType={post_type}
            />
          </CarouselItem>
          
          {/* Matter Slide */}
          {ai_matter && (
            <CarouselItem className="pl-0">
              <MatterSlide matter={ai_matter} />
            </CarouselItem>
          )}
          
          {/* Takeaway Slides */}
          {researchTakeaways.map((takeaway, index) => (
            <CarouselItem key={index} className="pl-0">
              <TakeawaysSlide 
                takeaways={[takeaway]}
                currentIndex={researchTakeaways.indexOf(takeaway)}
                totalTakeaways={researchTakeaways.length}
              />
            </CarouselItem>
          ))}
          
          {/* Detail Slide */}
          <CarouselItem className="pl-0">
            <DetailSlide
              title={displayTitle}
              title_org={title_org}
              abstract_org={abstract_org}
              doi={doi}
              creator={creator}
            />
          </CarouselItem>
        </CarouselContent>

        <div className="absolute bottom-6 w-full flex justify-center">
          <CarouselDots className="z-50" />
        </div>
      </Carousel>
    </motion.div>
  );
};

export default PaperCardDetail;
