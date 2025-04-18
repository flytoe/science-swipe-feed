
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paper } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { usePaperData } from '../hooks/use-paper-data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots
} from './ui/carousel';
import HeroSlide from './paper-slides/HeroSlide';
import TakeawaysSlide from './paper-slides/TakeawaysSlide';
import DetailSlide from './paper-slides/DetailSlide';

interface FeedItemProps {
  paper: Paper;
  index: number;
}

const FeedItem: React.FC<FeedItemProps> = ({ paper, index }) => {
  const navigate = useNavigate();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { 
    formattedCategoryNames, 
    formattedDate, 
    imageSrc, 
    displayTitle,
    refreshImageData,
    formattedTakeaways,
    paper: paperWithData
  } = usePaperData(paper);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="feed-item w-full bg-white rounded-xl overflow-hidden shadow-sm mb-6 border border-gray-100 relative"
      layout
    >
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <img
          src={imageSrc}
          alt={displayTitle}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      </div>

      <div className="relative z-10">
        <Carousel className="w-full" setApi={handleCarouselChange}>
          <CarouselContent>
            <CarouselItem>
              <HeroSlide
                title={displayTitle}
                imageSrc={imageSrc}
                formattedDate={formattedDate}
                creator={paper.creator}
              />
            </CarouselItem>
            
            {formattedTakeaways && formattedTakeaways.length > 0 ? (
              formattedTakeaways.map((takeaway, idx) => (
                <CarouselItem key={`takeaway-${idx}`}>
                  <TakeawaysSlide takeaways={[takeaway]} />
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <TakeawaysSlide takeaways={[]} />
              </CarouselItem>
            )}
            
            <CarouselItem>
              <DetailSlide
                title={displayTitle}
                title_org={paper.title_org}
                abstract_org={paper.abstract_org}
                doi={paper.doi}
              />
            </CarouselItem>
          </CarouselContent>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <CarouselDots className="flex gap-1" />
          </div>
        </Carousel>
      </div>
      
      {isRegenerating && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50 rounded-xl">
          <div className="text-white text-sm">Regenerating...</div>
        </div>
      )}
    </motion.div>
  );
};

export default FeedItem;

