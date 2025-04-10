
import { useState, useEffect } from 'react';
import type { Paper } from '../lib/supabase';
import { formatCategoryName, fetchCategoryMap, formatCategoryArray } from '../utils/categoryUtils';
import { parseKeyTakeaways } from '../utils/takeawayParser';
import { checkAndGenerateImageIfNeeded, generateImageForPaper } from '../lib/imageGenerationService';
import { toast } from 'sonner';
import { useDatabaseToggle, getPaperId } from './use-database-toggle';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const { databaseSource } = useDatabaseToggle();
  
  // Effect to generate image if needed
  useEffect(() => {
    const generateImageIfNeeded = async () => {
      if (!paper) return;
      
      // Skip if the paper already has an image or we're already generating
      if (paper.image_url || isGenerating) return;
      
      // Generate if we have a prompt OR automatically generate a prompt if none exists
      if (paper.ai_image_prompt || !paper.image_url) {
        try {
          setIsGenerating(true);
          setFormattedData(prev => ({
            ...prev,
            isGeneratingImage: true
          }));
          
          // If no prompt exists, create one based on the title
          let imagePrompt = paper.ai_image_prompt;
          if (!imagePrompt) {
            imagePrompt = `Scientific visualization of: ${paper.title_org}`;
            
            // Save the generated prompt to the database
            const idField = getIdFieldName(databaseSource);
            await supabase
              .from(databaseSource)
              .update({ ai_image_prompt: imagePrompt })
              .eq(idField, paper.id);
              
            // Update the paper object with the new prompt
            paper.ai_image_prompt = imagePrompt;
          }
          
          const imageUrl = await generateImageForPaper(paper);
          
          if (imageUrl) {
            // Update the state with the new image URL
            setFormattedData(prev => ({
              ...prev,
              imageSrc: imageUrl,
              imageSourceType: 'generated',
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
      }
    };
    
    generateImageIfNeeded();
  }, [paper, databaseSource]); // Added databaseSource dependency to trigger regeneration on toggle
  
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
          isGeneratingImage: isGenerating,
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
  }, [paper, isGenerating, databaseSource]); // Added databaseSource dependency to refresh on toggle
  
  return formattedData;
};
