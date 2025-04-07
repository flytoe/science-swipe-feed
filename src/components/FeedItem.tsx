
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';
import { Paper } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { usePaperData } from '../hooks/use-paper-data';

interface FeedItemProps {
  paper: Paper;
  index: number;
}

const FeedItem: React.FC<FeedItemProps> = ({ paper, index }) => {
  const navigate = useNavigate();
  
  const { 
    formattedCategoryNames, 
    formattedDate, 
    imageSrc, 
    displayTitle,
  } = usePaperData(paper);

  // Create properly encoded paper ID for the URL
  const encodedPaperId = encodeURIComponent(paper.doi);
  
  const handleCardClick = () => {
    navigate(`/paper/${encodedPaperId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="feed-item w-full bg-white rounded-xl overflow-hidden shadow-sm mb-6 border border-gray-100"
      onClick={handleCardClick}
    >
      <div className="block cursor-pointer">
        <div className="flex flex-col">
          {/* Square image container */}
          <div className="aspect-square relative">
            <img 
              src={imageSrc} 
              alt={displayTitle}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Content below image - Apple App Store style */}
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {displayTitle}
            </h2>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-gray-100 text-gray-600 border-none text-xs">
                {formattedDate}
              </Badge>
              
              {formattedCategoryNames.slice(0, 1).map((category, idx) => (
                <Badge 
                  key={idx}
                  variant="outline" 
                  className="bg-gray-100 text-gray-600 border-none text-xs"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedItem;
