
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';
import { Paper } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { usePaperData } from '../hooks/use-paper-data';

interface FeedItemProps {
  paper: Paper;
  index: number;
}

const FeedItem: React.FC<FeedItemProps> = ({ paper, index }) => {
  const { 
    formattedCategoryNames, 
    formattedDate, 
    imageSrc, 
    displayTitle,
  } = usePaperData(paper);

  // Create properly encoded paper ID for the URL
  const encodedPaperId = encodeURIComponent(paper.doi);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="feed-item w-full bg-white rounded-xl overflow-hidden shadow-md mb-4 border border-gray-200"
    >
      <Link to={`/paper/${encodedPaperId}`} className="block">
        <div className="relative">
          {/* Image thumbnail with light overlay */}
          <div className="h-48 relative">
            <img 
              src={imageSrc} 
              alt={displayTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
          </div>
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200">
                {formattedDate}
              </Badge>
              
              {formattedCategoryNames.slice(0, 1).map((category, idx) => (
                <Badge 
                  key={idx}
                  variant="outline" 
                  className="bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200"
                >
                  {category}
                </Badge>
              ))}
            </div>
            
            <h2 className="text-lg font-bold text-gray-800 drop-shadow-sm line-clamp-2">
              {displayTitle}
            </h2>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default FeedItem;
