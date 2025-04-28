
import { useState, useEffect } from 'react';
import type { Paper } from '../lib/supabase';
import { formatCategoryName, fetchCategoryMap } from '../utils/categoryUtils';
import { parseKeyTakeaways } from '../utils/takeawayParser';
import { checkAndGenerateImageIfNeeded } from '../lib/imageGenerationService';
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
  hasClaudeContent: boolean;
  showClaudeToggle: boolean;
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
  hasClaudeContent: false,
  showClaudeToggle: false,
  toggleClaudeMode: () => {},
};

export const usePaperData = (paper: Paper | null): UsePaperDataResult => {
  const [formattedData, setFormattedData] = useState<UsePaperDataResult>(defaultPaperData);
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    const loadPaperData = async () => {
      if (!paper) {
        setFormattedData(defaultPaperData);
        return;
      }
      
      try {
        // Format date
        let createdAt = new Date(paper.created_at);
        if (isNaN(createdAt.getTime())) {
          createdAt = new Date();
        }
        
        const formattedDate = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }).format(createdAt);
        
        // Format categories
        const paperCategories = Array.isArray(paper.category) ? 
          paper.category : 
          (paper.category ? [paper.category] : []);
          
        const categoryMap = await fetchCategoryMap();
        const formattedCategoryNames = paperCategories.map(cat => 
          formatCategoryName(cat, categoryMap)
        );
        
        // Check if paper has Claude content
        const hasClaudeContent = !!(
          paper.ai_headline_claude ||
          paper.ai_matter_claude ||
          paper.ai_key_takeaways_claude
        );
        
        // Choose content based on show_claude flag
        const headline = paper.show_claude ? paper.ai_headline_claude : paper.ai_headline;
        const matter = paper.show_claude ? paper.ai_matter_claude : paper.ai_matter;
        const takeaways = paper.show_claude ? paper.ai_key_takeaways_claude : paper.ai_key_takeaways;
        
        const simpleTakeaways = Array.isArray(takeaways) ? 
          takeaways : 
          (takeaways ? [takeaways] : []);
          
        // Handle image source
        const imageSrc = paper.image_url || defaultPaperData.imageSrc;
        let imageSourceType: 'default' | 'database' | 'generated' | 'runware' = 'database';
        if (!paper.image_url) {
          imageSourceType = 'default';
        } else if (paper.image_url.includes('runware')) {
          imageSourceType = 'runware';
        } else if (paper.ai_image_prompt) {
          imageSourceType = 'generated';
        }
        
        const formattedTakeaways = parseKeyTakeaways(takeaways, matter);
        const displayTitle = headline || paper.title_org || 'Untitled Paper';
        
        // Toggle handler
        const toggleClaudeMode = async (enabled: boolean) => {
          try {
            const { error } = await supabase
              .from('europe_paper')
              .update({ show_claude: enabled })
              .eq('id', paper.id);
              
            if (error) throw error;
            
            // Update local state immediately for better UX
            setFormattedData(prev => ({
              ...prev,
              paper: { ...paper, show_claude: enabled }
            }));
          } catch (error) {
            console.error('Error updating Claude preference:', error);
            toast.error('Failed to save preference');
          }
        };
        
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
          paper,
          hasClaudeContent,
          showClaudeToggle: hasClaudeContent,
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
        setFormattedData({ ...defaultPaperData, paper });
      }
    };
    
    loadPaperData();
  }, [paper, isGenerating]);
  
  return formattedData;
};
