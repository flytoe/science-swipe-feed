
import { useState, useEffect } from 'react';
import type { Paper } from '../lib/supabase';
import { formatCategoryName, fetchCategoryMap, formatCategoryArray } from '../utils/categoryUtils';
import { parseKeyTakeaways } from '../utils/takeawayParser';
import { checkAndGenerateImageIfNeeded, generateImageForPaper } from '../lib/imageGenerationService';
import { toast } from 'sonner';
import { useDatabaseToggle } from './use-database-toggle';
import { supabase } from '../integrations/supabase/client';

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
  paper: Paper | null;
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
  paper: null,
};

export const usePaperData = (paper: Paper | null): UsePaperDataResult => {
  // Always initialize state, even if paper is null
  const [formattedData, setFormattedData] = useState<UsePaperDataResult>({
    ...defaultPaperData, 
    paper
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { databaseSource } = useDatabaseToggle();
  
  // Effect to generate image if needed
  useEffect(() => {
    const generateImageIfNeeded = async () => {
      if (!paper) return;
      
      // Skip if the paper already has an image or we're already generating
      if (paper.image_url || isGenerating) return;
      
      try {
        setIsGenerating(true);
        setFormattedData(prev => ({
          ...prev,
          isGeneratingImage: true
        }));
        
        // If no prompt exists, checkAndGenerateImageIfNeeded will create one
        const imageUrl = await checkAndGenerateImageIfNeeded(paper);
        
        if (imageUrl) {
          // Update the state with the new image URL
          setFormattedData(prev => ({
            ...prev,
            imageSrc: imageUrl,
            imageSourceType: 'runware',
            isGeneratingImage: false
          }));
          
          console.log(`Successfully generated image for paper: ${paper.id}`);
        } else {
          console.warn(`Failed to generate image for paper: ${paper.id}`);
          setFormattedData(prev => ({
            ...prev,
            isGeneratingImage: false
          }));
        }
      } catch (error) {
        console.error(`Error generating image for paper ${paper.id}:`, error);
        toast.error('Failed to generate image');
      } finally {
        setIsGenerating(false);
      }
    };
    
    generateImageIfNeeded();
  }, [paper, databaseSource]); 
  
  useEffect(() => {
    const loadPaperData = async () => {
      if (!paper) {
        setFormattedData({...defaultPaperData, paper: null});
        return;
      }
      
      try {
        // Format the date
        let createdAt = new Date(paper.created_at);
        // Check if date is valid
        if (isNaN(createdAt.getTime())) {
          createdAt = new Date(); // Use current date as fallback
        }
        
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
          
        // Image source handling - use a placeholder if empty
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
        
        // Use either the AI headline or original title, with fallback
        const displayTitle = paper.ai_headline || paper.title_org || 'Untitled Paper';
        
        setFormattedData({
          categories: paperCategories,
          formattedCategoryNames,
          formattedDate,
          imageSrc,
          displayTitle,
          firstTakeaway: takeaways[0] || '',
          formattedTakeaways,
          isGeneratingImage: isGenerating,
          imageSourceType,
          paper: paper,
          refreshImageData: (newImageUrl?: string) => {
            if (newImageUrl) {
              setFormattedData(prev => ({
                ...prev,
                imageSrc: newImageUrl,
                imageSourceType: 'runware',
                isGeneratingImage: false
              }));
            }
          },
        });
      } catch (error) {
        console.error('Error in usePaperData:', error);
        setFormattedData({...defaultPaperData, paper});
      }
    };
    
    loadPaperData();
  }, [paper, isGenerating, databaseSource]);
  
  return formattedData;
};
