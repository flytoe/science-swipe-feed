import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paper } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { usePaperData } from '../hooks/use-paper-data';
import RegenerateImageButton from './RegenerateImageButton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots
} from './ui/carousel';
import HeroSlide from './paper-slides/HeroSlide';
import TakeawaysSlide from './paper-slides/TakeawaysSlide';
import DetailSlide from './paper-slides/DetailSlide';
import { ImageOff } from 'lucide-react';
import MindBlowButton from './MindBlowButton';
import { useMindBlow } from '../hooks/use-mind-blow';
import { useDatabaseToggle } from '../hooks/use-database-toggle';

interface FeedItemProps {
  paper: Paper;
  index: number;
}

const FeedItem: React.FC<FeedItemProps> = ({ paper, index }) => {
  const navigate = useNavigate();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { databaseSource } = useDatabaseToggle();
  
  const { 
    formattedCategoryNames, 
    formattedDate, 
    imageSrc, 
    displayTitle,
    refreshImageData,
    formattedTakeaways,
    paper: paperWithData
  } = usePaperData(paper);

  const { count, hasMindBlown, isLoading, isTopPaper, toggleMindBlow } = useMindBlow(paper.id);

  const encodedPaperId = encodeURIComponent(paper.id);
  
  const handleRegenerationComplete = (imageUrl: string | null) => {
    setIsRegenerating(false);
    if (imageUrl) {
      refreshImageData(imageUrl);
    }
  };

  const handleCarouselChange = (api: any) => {
    const selectedIndex = api?.selectedScrollSnap() || 0;
    setActiveIndex(selectedIndex);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="feed-item w-full bg-white rounded-xl overflow-hidden shadow-sm mb-6 border border-gray-100 relative"
      layout
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={imageSrc}
          alt={displayTitle}
          className="w-full h-full object-cover opacity-20"
          style={{ filter: 'blur(10px)' }}
        />
        <div className="absolute inset-0 bg-white/80 backdrop-blur-md" />
      </div>

      <div className="relative z-10">
        <Carousel className="w-full" setApi={handleCarouselChange}>
          <CarouselContent>
            <CarouselItem className="min-h-[280px]">
              <HeroSlide
                title={displayTitle}
                imageSrc={imageSrc}
                formattedDate={formattedDate}
                creator={paper.creator}
                mindBlowCount={count}
              />
            </CarouselItem>
            
            {formattedTakeaways && formattedTakeaways.length > 0 ? (
              formattedTakeaways.map((takeaway, idx) => (
                <CarouselItem key={`takeaway-${idx}`} className="min-h-[280px]">
                  <TakeawaysSlide takeaways={[takeaway]} />
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="min-h-[280px]">
                <TakeawaysSlide takeaways={[]} />
              </CarouselItem>
            )}
            
            <CarouselItem className="min-h-[280px]">
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

        <div className="flex justify-center py-4 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
          <MindBlowButton 
            hasMindBlown={hasMindBlown}
            count={count}
            isTopPaper={isTopPaper}
            isLoading={isLoading}
            onClick={toggleMindBlow}
            size="lg"
            showCount={true}
            className="shadow-md"
          />
        </div>
      </div>

      <div className="absolute top-4 right-4 z-40">
        <RegenerateImageButton 
          paper={paperWithData}
          onRegenerationStart={() => setIsRegenerating(true)}
          onRegenerationComplete={handleRegenerationComplete}
          variant="outline"
          size="icon"
          className="rounded-full bg-black/50 text-white hover:bg-black/70 border-none"
        />
      </div>
      
      {isRegenerating && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="text-white text-sm">Regenerating...</div>
        </div>
      )}
    </motion.div>
  );
};

export default FeedItem;
