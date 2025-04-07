
import { useState, useEffect } from 'react';
import type { Paper } from '../lib/supabase';
import { formatCategoryName, fetchCategoryMap, formatCategoryArray } from '../utils/categoryUtils';
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

// Create default values for when paper is null
const defaultPaperData: UsePaperDataResult = {
  categories: [],
  formattedCategoryNames: [],
  formattedDate: '',
  imageSrc: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973',
  displayTitle: 'Paper not found',
  firstTakeaway: '',
  formattedTakeaways: [],
  isGeneratingImage: false,
  imageSourceType: 'default',
  refreshImageData: () => {},
};

export const usePaperData = (paper: Paper | null): UsePaperDataResult => {
  // Always initialize state, even if paper is null
  const [formattedData, setFormattedData] = useState<UsePaperDataResult>(defaultPaperData);
  
  useEffect(() => {
    const loadPaperData = async () => {
      if (!paper) {
        setFormattedData(defaultPaperData);
        return;
      }
      
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
        
        // Format all category names using the utility function
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
        setFormattedData(defaultPaperData);
      }
    };
    
    loadPaperData();
  }, [paper]);
  
  return formattedData;
};
