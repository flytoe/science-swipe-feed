
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CategoryTag from './CategoryTag';
import KeyTakeaway from './KeyTakeaway';
import { type Paper } from '../lib/supabase';
import { Clock } from 'lucide-react';

interface PaperCardProps {
  paper: Paper;
  isActive: boolean;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper, isActive }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showFullAbstract, setShowFullAbstract] = useState(false);
  
  const categories = Array.isArray(paper.category) ? paper.category : 
    (typeof paper.category === 'string' ? [paper.category] : []);
  
  const keyTakeaways = Array.isArray(paper.ai_key_takeaways) ? paper.ai_key_takeaways : 
    (typeof paper.ai_key_takeaways === 'string' ? JSON.parse(paper.ai_key_takeaways) : []);
    
  const formattedDate = new Date(paper.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Default image if none is provided
  const imageSrc = paper.image_url || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop';
  
  const cardVariants = {
    active: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    inactive: {
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' }
    }
  };

  return (
    <motion.div 
      className="paper-card"
      variants={cardVariants}
      initial="inactive"
      animate={isActive ? "active" : "inactive"}
      exit="inactive"
      layout
    >
      <div className="relative">
        <div className={`paper-card-image-container relative overflow-hidden ${!imageLoaded ? 'bg-gray-200 animate-pulse' : ''}`}>
          <motion.img
            src={imageSrc}
            alt={paper.ai_headline || paper.title_org}
            className="paper-card-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex flex-wrap">
            {categories.map((category, index) => (
              <CategoryTag key={index} category={category} />
            ))}
          </div>
        </div>
      </div>
      
      <div className="paper-card-content">
        <h2 className="paper-card-title">
          {paper.ai_headline || paper.title_org}
        </h2>
        
        <p className={`${showFullAbstract ? 'text-sm md:text-base text-gray-700 mb-4' : 'paper-card-abstract'}`}>
          {paper.abstract_org}
        </p>
        
        {!showFullAbstract && paper.abstract_org && paper.abstract_org.length > 150 && (
          <button 
            onClick={() => setShowFullAbstract(true)}
            className="text-blue-500 text-sm font-medium mb-4 hover:text-blue-700 transition-colors"
          >
            Read more
          </button>
        )}
        
        {showFullAbstract && (
          <button 
            onClick={() => setShowFullAbstract(false)}
            className="text-blue-500 text-sm font-medium mb-4 hover:text-blue-700 transition-colors"
          >
            Show less
          </button>
        )}
        
        {keyTakeaways && keyTakeaways.length > 0 && (
          <div className="mt-4 mb-6">
            <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Key Takeaways</h3>
            <div className="space-y-2">
              {keyTakeaways.slice(0, 3).map((takeaway: string, index: number) => (
                <KeyTakeaway key={index} text={takeaway} />
              ))}
            </div>
          </div>
        )}
        
        <div className="paper-card-meta">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{formattedDate}</span>
          </div>
          {paper.doi && (
            <a 
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              View Source
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PaperCard;
