
import { useState, useEffect } from 'react';
import type { Paper } from '../lib/supabase';
import { formatCategoryName, fetchCategoryMap } from '../utils/categoryUtils';
import { parseKeyTakeaways } from '../utils/takeawayParser';

interface UsePaperDataResult {
  categories: string[];
  formattedCategoryNames: string[];
  formattedDate: string;
  imageSrc: string;
  displayTitle: string;
  firstTakeaway: string;
  formattedTakeaways: any[];
  isGeneratingImage: boolean;
  imageSourceType: 'default' | 'database' | 'generated' | 'runware';
  refreshImageData: (newImageUrl?: string) => void;
}

export const usePaperData = (paper: Paper): UsePaperDataResult => {
  const [formattedData, setFormattedData] = useState<UsePaperDataResult>({
    categories: [],
    formattedCategoryNames: [],
    formattedDate: '',
    imageSrc: '',
    displayTitle: '',
    firstTakeaway: '',
    formattedTakeaways: [],
    isGeneratingImage: false,
    imageSourceType: 'database',
    refreshImageData: () => {},
  });
  
  useEffect(() => {
    const loadPaperData = async () => {
      if (!paper) return;
      
      try {
        // Format the date
        const createdAt = new Date(paper.created_at);
        const formattedDate = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }).format(createdAt);
        
        // Handle categories
        const paperCategories = Array.isArray(paper.category) ? 
          paper.category : 
          (paper.category ? [paper.category] : []);
          
        // Get category map for displaying full names
        const categoryMap = await fetchCategoryMap();
        
        // Map category codes to full names using the taxonomy data
        const formattedCategoryNames = paperCategories.map(cat => 
          formatCategoryName(cat, categoryMap)
        );
        
        // Parse takeaways
        const takeaways = Array.isArray(paper.ai_key_takeaways) ? 
          paper.ai_key_takeaways : 
          (paper.ai_key_takeaways ? [paper.ai_key_takeaways] : []);
          
        // Image source handling
        const imageSrc = paper.image_url || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973';
        
        // Determine image source type
        let imageSourceType: 'default' | 'database' | 'generated' | 'runware' = 'database';
        if (!paper.image_url) {
          imageSourceType = 'default';
        } else if (paper.image_url.includes('runware')) {
          imageSourceType = 'runware';
        } else if (paper.ai_image_prompt) {
          imageSourceType = 'generated';
        }
        
        // Format takeaways
        const formattedTakeaways = parseKeyTakeaways(paper.ai_key_takeaways);
        
        setFormattedData({
          categories: paperCategories,
          formattedCategoryNames,
          formattedDate,
          imageSrc,
          displayTitle: paper.ai_headline || paper.title_org,
          firstTakeaway: takeaways[0] || '',
          formattedTakeaways,
          isGeneratingImage: false,
          imageSourceType,
          refreshImageData: (newImageUrl?: string) => {
            if (newImageUrl) {
              setFormattedData(prev => ({
                ...prev,
                imageSrc: newImageUrl,
                imageSourceType: 'generated',
                isGeneratingImage: false
              }));
            }
          },
        });
      } catch (error) {
        console.error('Error in usePaperData:', error);
      }
    };
    
    loadPaperData();
  }, [paper]);
  
  return formattedData;
};
