
import { useState, useEffect } from 'react';
import type { Paper } from '../lib/supabase';
import { formatCategoryName, fetchCategoryMap, formatCategoryArray } from '../utils/categoryUtils';
import { parseKeyTakeaways } from '../utils/takeawayParser';
import { checkAndGenerateImageIfNeeded, generateImageForPaper } from '../lib/imageGenerationService';
import { toast } from 'sonner';
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
  claudeMode: boolean;
  toggleClaudeMode: (enabled: boolean) => void;
}

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
  claudeMode: false,
  toggleClaudeMode: () => {},
};

export const usePaperData = (paper: Paper | null): UsePaperDataResult => {
  const [formattedData, setFormattedData] = useState<UsePaperDataResult>({
    ...defaultPaperData, 
    paper
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [claudeMode, setClaudeMode] = useState(false);
  
  // Initialize Claude mode from paper data
  useEffect(() => {
    if (paper && 'show_claude' in paper) {
      setClaudeMode(!!paper.show_claude);
    }
  }, [paper]);
  
  const toggleClaudeMode = async (enabled: boolean) => {
    setClaudeMode(enabled);
    
    // Update the show_claude value in the database if we have a paper ID
    if (paper && paper.id) {
      try {
        // Convert paperId to appropriate type for database comparison
        const { error } = await supabase
          .from('europe_paper')
          .update({ show_claude: enabled })
          .eq('id', Number(paper.id)); // Convert to Number to ensure compatibility
        
        if (error) {
          console.error('Error updating Claude preference:', error);
          toast.error('Failed to save preference');
        }
      } catch (error) {
        console.error('Error in toggle action:', error);
      }
    }
  };
  
  useEffect(() => {
    const generateImageIfNeeded = async () => {
      if (!paper) return;
      
      if (paper.image_url || isGenerating) return;
      
      try {
        setIsGenerating(true);
        setFormattedData(prev => ({
          ...prev,
          isGeneratingImage: true
        }));
        
        const imageUrl = await checkAndGenerateImageIfNeeded(paper);
        
        if (imageUrl) {
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
  }, [paper]); 
  
  useEffect(() => {
    const loadPaperData = async () => {
      if (!paper) {
        setFormattedData({...defaultPaperData, paper: null, claudeMode, toggleClaudeMode});
        return;
      }
      
      try {
        let createdAt = new Date(paper.created_at);
        if (isNaN(createdAt.getTime())) {
          createdAt = new Date();
        }
        
        const formattedDate = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }).format(createdAt);
        
        const paperCategories = Array.isArray(paper.category) ? 
          paper.category : 
          (paper.category ? [paper.category] : []);
          
        const categoryMap = await fetchCategoryMap();
        
        const formattedCategoryNames = paperCategories.map(cat => 
          formatCategoryName(cat, categoryMap)
        );
        
        // Choose between default and Claude data based on claude mode
        const headline = claudeMode && paper.ai_headline_claude 
          ? paper.ai_headline_claude 
          : paper.ai_headline;
          
        const matter = claudeMode && paper.ai_matter_claude
          ? paper.ai_matter_claude
          : paper.ai_matter;
          
        const takeaways = claudeMode && paper.ai_key_takeaways_claude
          ? paper.ai_key_takeaways_claude
          : paper.ai_key_takeaways;
          
        const simpleTakeaways = Array.isArray(takeaways) ? 
          takeaways : 
          (takeaways ? [takeaways] : []);
          
        const imageSrc = paper.image_url || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973';
        
        let imageSourceType: 'default' | 'database' | 'generated' | 'runware' = 'database';
        if (!paper.image_url) {
          imageSourceType = 'default';
        } else if (paper.image_url.includes('runware')) {
          imageSourceType = 'runware';
        } else if (paper.ai_image_prompt) {
          imageSourceType = 'generated';
        }
        
        const formattedTakeaways = parseKeyTakeaways(
          takeaways, 
          matter
        );
        
        const displayTitle = headline || paper.title_org || 'Untitled Paper';
        
        setFormattedData({
          categories: paperCategories,
          formattedCategoryNames,
          formattedDate,
          imageSrc,
          displayTitle,
          firstTakeaway: simpleTakeaways[0] || '',
          formattedTakeaways,
          isGeneratingImage: isGenerating,
          imageSourceType,
          paper: paper,
          claudeMode,
          toggleClaudeMode,
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
        setFormattedData({...defaultPaperData, paper, claudeMode, toggleClaudeMode});
      }
    };
    
    loadPaperData();
  }, [paper, isGenerating, claudeMode]);
  
  return formattedData;
};
