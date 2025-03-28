
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { type Paper } from '../lib/supabase';
import PaperCardMedia from './PaperCardMedia';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';

interface PaperCardProps {
  paper: Paper;
  isActive: boolean;
  isGeneratingImage?: boolean;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper, isActive, isGeneratingImage = false }) => {
  const navigate = useNavigate();
  
  const categories = Array.isArray(paper.category) ? paper.category : 
    (typeof paper.category === 'string' ? [paper.category] : []);
  
  // Format date as DD.MM.YYYY
  const formattedDate = (() => {
    try {
      return new Date(paper.created_at).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '.');
    } catch (e) {
      console.warn(`Invalid date format for paper ${paper.id}:`, e);
      return 'Unknown date';
    }
  })();
  
  // Default image if none is provided
  const imageSrc = paper.image_url || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop';
  
  const cardVariants = {
    active: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    inactive: {
      scale: 0.98,
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' }
    }
  };

  const handleCardClick = () => {
    // Navigate to detail page using paper id or doi as identifier
    const id = paper.doi || paper.id;
    if (id) {
      navigate(`/paper/${id}`);
    }
  };

  // Use original title if AI headline is not available
  const displayTitle = paper.ai_headline || paper.title_org;
  
  // Extract first paragraph from key takeaways as highlight
  const firstTakeaway = paper.ai_key_takeaways && Array.isArray(paper.ai_key_takeaways) && paper.ai_key_takeaways[0]
    ? paper.ai_key_takeaways[0]
    : typeof paper.ai_key_takeaways === 'string' 
      ? paper.ai_key_takeaways.split('\n')[0]
      : '';

  return (
    <motion.div 
      className="paper-card bg-black text-white rounded-lg overflow-hidden cursor-pointer"
      variants={cardVariants}
      initial="inactive"
      animate={isActive ? "active" : "inactive"}
      exit="inactive"
      layout
      onClick={handleCardClick}
    >
      <PaperCardMedia 
        imageSrc={imageSrc}
        imageAlt={displayTitle}
        categories={[]}
        isGenerating={isGeneratingImage}
      />
      
      <div className="p-4 space-y-4">
        {/* Date and categories */}
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className="bg-white/10 text-white border-none">
            {formattedDate}
          </Badge>
          
          {categories.slice(0, 2).map((category, idx) => (
            <Badge 
              key={idx}
              variant="outline" 
              className="bg-white/10 text-white border-none capitalize"
            >
              {category}
            </Badge>
          ))}
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold leading-tight">
          {displayTitle}
        </h2>
        
        {/* First highlight */}
        {firstTakeaway && (
          <div className="border-l-2 border-yellow-400 pl-3 py-1">
            <p className="text-white/80">{firstTakeaway}</p>
          </div>
        )}
        
        {/* View more button */}
        <div className="flex justify-end mt-4">
          <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
            Read More <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PaperCard;
