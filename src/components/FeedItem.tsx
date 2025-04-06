
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
    firstTakeaway
  } = usePaperData(paper);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="feed-item w-full bg-gray-900 rounded-xl overflow-hidden shadow-lg mb-4 border border-white/10"
    >
      <Link to={`/paper/${paper.doi}`} className="block">
        <div className="relative">
          {/* Image thumbnail with gradient overlay */}
          <div className="h-48 relative">
            <img 
              src={imageSrc} 
              alt={displayTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="bg-black/50 backdrop-blur-sm text-white border-none">
                {formattedDate}
              </Badge>
              
              {formattedCategoryNames.slice(0, 1).map((category, idx) => (
                <Badge 
                  key={idx}
                  variant="outline" 
                  className="bg-black/50 backdrop-blur-sm text-white border-none"
                >
                  {category}
                </Badge>
              ))}
            </div>
            
            <h2 className="text-lg font-bold text-white drop-shadow-md line-clamp-2">
              {displayTitle}
            </h2>
          </div>
        </div>
        
        {/* Preview of first takeaway */}
        <div className="p-4 bg-gradient-to-b from-gray-900 to-gray-800">
          <p className="text-sm text-white/70 line-clamp-2">
            {firstTakeaway || "Read more about this research..."}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default FeedItem;
