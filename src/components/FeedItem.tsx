
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
import MatterSlide from './paper-slides/MatterSlide';
import MindBlowButton from './MindBlowButton';
import { useMindBlow } from '../hooks/use-mind-blow';
import RegenerateImageButton from './RegenerateImageButton';
import ClaudeToggle from './ClaudeToggle';

interface FeedItemProps {
  paper: Paper;
  index: number;
}

const FeedItem: React.FC<FeedItemProps> = ({ paper, index }) => {
  const navigate = useNavigate();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { 
    formattedCategoryNames, 
    formattedDate, 
    imageSrc, 
    displayTitle,
    refreshImageData,
    formattedTakeaways,
    paper: paperWithData,
    hasClaudeContent,
    showClaudeToggle,
    toggleClaudeMode
  } = usePaperData(paper);

  const { isLoading, hasMindBlown, count, toggleMindBlow: toggle } = useMindBlow(paper.doi);

  const handleCarouselChange = (api: any) => {
    if (api) {
      api.on('select', () => {
        setActiveIndex(api.selectedScrollSnap());
      });
    }
  };

  // Extract matter content and determine if Claude toggle should be shown
  const matter = hasClaudeContent ? paper.ai_matter_claude : paper.ai_matter;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="feed-item w-full bg-white rounded-xl overflow-hidden shadow-sm mb-6 border border-gray-100 relative"
      layout
    >
      {/* Top toolbar - Claude Toggle and Regenerate Image Button */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {showClaudeToggle && (
          <div className="mr-2">
            <ClaudeToggle
              paperId={paper.id}
              isEnabled={!!paper.show_claude}
              onToggle={toggleClaudeMode}
              size="sm"
            />
          </div>
        )}
        
        <RegenerateImageButton
          paper={paper}
          variant="ghost"
          size="icon"
          className="bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm"
        />
      </div>

      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <img
          src={imageSrc}
          alt={displayTitle}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10">
        <Carousel className="w-full" setApi={handleCarouselChange}>
          <CarouselContent className="-ml-0">
            {/* Hero Slide */}
            <CarouselItem className="pl-0">
              <HeroSlide
                title={displayTitle}
                imageSrc={imageSrc}
                formattedDate={formattedDate}
                creator={paper.creator}
              />
            </CarouselItem>
            
            {/* Matter Slide - only render if matter content exists */}
            {matter && (
              <CarouselItem className="pl-0">
                <MatterSlide matter={matter} />
              </CarouselItem>
            )}
            
            {/* Research Findings Slides */}
            {formattedTakeaways && formattedTakeaways.length > 0 ? (
              formattedTakeaways
                .filter(takeaway => takeaway.type !== 'why_it_matters')
                .map((takeaway, idx) => (
                  <CarouselItem key={`takeaway-${idx}`} className="pl-0">
                    <TakeawaysSlide 
                      takeaways={[takeaway]} 
                      currentIndex={idx}
                      totalTakeaways={formattedTakeaways.filter(t => t.type !== 'why_it_matters').length}
                    />
                  </CarouselItem>
                ))
            ) : (
              <CarouselItem className="pl-0">
                <TakeawaysSlide takeaways={[]} />
              </CarouselItem>
            )}
            
            {/* Detail Slide */}
            <CarouselItem className="pl-0">
              <DetailSlide
                title={displayTitle}
                title_org={paper.title_org}
                abstract_org={paper.abstract_org}
                doi={paper.doi}
                creator={paper.creator}
              />
            </CarouselItem>
          </CarouselContent>
          
          <div className="absolute bottom-4 w-full flex justify-between items-center px-6">
            <CarouselDots className="flex gap-1" />
            <MindBlowButton
              hasMindBlown={hasMindBlown}
              count={count}
              isTopPaper={false}
              isLoading={isLoading}
              onClick={toggle}
              size="sm"
              variant="ghost"
              className="text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm"
            />
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
