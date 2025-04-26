
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FormattedTakeaway } from '../utils/takeawayParser';
import { useMindBlow } from '../hooks/use-mind-blow';
import { useDatabaseToggle } from '../hooks/use-database-toggle';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots
} from './ui/carousel';
import HeroSlide from './paper-slides/HeroSlide';
import DetailSlide from './paper-slides/DetailSlide';
import TakeawaysSlide from './paper-slides/TakeawaysSlide';

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
}) => {
  // Separate takeaways into "Why It Matters" and research findings
  const whyItMattersTakeaway = takeaways.find(t => t.type === 'why_it_matters');
  const researchTakeaways = takeaways.filter(t => t.type !== 'why_it_matters');
  
  // Order takeaways with research findings first, then "Why It Matters"
  const orderedTakeaways = [...researchTakeaways];
  if (whyItMattersTakeaway) {
    orderedTakeaways.push(whyItMattersTakeaway);
  }

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
            />
          </CarouselItem>
          
          {/* Research Findings and Why It Matters Slides */}
          {orderedTakeaways.map((takeaway, index) => {
            const isResearchFinding = takeaway.type !== 'why_it_matters';
            const findingIndex = isResearchFinding ? 
              researchTakeaways.findIndex(t => t === takeaway) : 
              undefined;
            
            return (
              <CarouselItem key={index} className="pl-0">
                <TakeawaysSlide 
                  takeaways={[takeaway]}
                  currentIndex={findingIndex}
                  totalTakeaways={researchTakeaways.length}
                />
              </CarouselItem>
            );
          })}
          
          {/* Detail Slide */}
          <CarouselItem className="pl-0">
            <DetailSlide
              title={displayTitle}
              title_org={title_org}
              abstract_org={abstract_org}
              doi={doi}
              creator={creator}
              matter={whyItMattersTakeaway?.text as string}
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
