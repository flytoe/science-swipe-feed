
import React, { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { fetchCategoryMap, formatCategoryName } from '../../utils/categoryUtils';

interface HeroImageSectionProps {
  imageSrc?: string;
  title: string;
  creator?: string[] | string | null;
  categories?: string[];
}

const HeroImageSection: React.FC<HeroImageSectionProps> = ({ 
  imageSrc, 
  title, 
  creator,
  categories = [] 
}) => {
  const [formattedCategories, setFormattedCategories] = useState<string[]>([]);
  
  useEffect(() => {
    async function formatCategories() {
      if (!categories || categories.length === 0) return;
      
      const categoryMap = await fetchCategoryMap();
      const formatted = categories.map(cat => formatCategoryName(cat, categoryMap));
      setFormattedCategories(formatted);
    }
    
    formatCategories();
  }, [categories]);
  
  // Format creator display
  const formatCreator = (creator: string[] | string | null) => {
    if (!creator) return null;
    if (Array.isArray(creator)) {
      return creator.join(', ');
    }
    return creator;
  };

  return (
    <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden mx-[-24px]">
      <img 
        src={imageSrc || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop'}
        alt={title} 
        className="w-full h-full object-cover" 
      />
      
      {/* Gradient overlay for text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
      
      {/* Title and author positioned at the bottom of the image */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {/* Display categories */}
        {formattedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {formattedCategories.map((category, idx) => (
              <Badge 
                key={idx}
                variant="outline" 
                className="bg-white/10 text-white border-none"
              >
                {category}
              </Badge>
            ))}
          </div>
        )}
      
        <h2 className="text-3xl font-bold text-white drop-shadow-md leading-tight">
          {title}
        </h2>
        
        {/* Display Creator if available */}
        {formatCreator(creator) && (
          <p className="text-base text-white/80 mt-2 drop-shadow-md">
            {formatCreator(creator)}
          </p>
        )}
      </div>
    </div>
  );
};

export default HeroImageSection;
