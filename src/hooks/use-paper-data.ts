
import { type Paper } from '../lib/supabase';
import { parseKeyTakeaways } from '../utils/takeawayParser';
import { checkAndGenerateImageIfNeeded } from '../lib/imageGenerationService';
import { useState, useEffect } from 'react';

/**
 * Hook to extract and format paper data for display
 */
export const usePaperData = (paper: Paper | undefined) => {
  const [imageSourceType, setImageSourceType] = useState<'default' | 'database' | 'runware'>('default');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  // Add null check for paper and paper.category
  const categories = paper && paper.category ? (
    Array.isArray(paper.category) ? paper.category : 
    (typeof paper.category === 'string' ? [paper.category] : [])
  ) : [];
  
  // Format date as DD.MM.YYYY (European format) with null check
  const formattedDate = (() => {
    try {
      return paper && paper.created_at ? new Date(paper.created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '.') : 'Unknown date';
    } catch (e) {
      console.warn(`Invalid date format for paper ${paper?.doi || 'unknown'}:`, e);
      return 'Unknown date';
    }
  })();
  
  // Handle image source and generation logic
  useEffect(() => {
    const handleImageSource = async () => {
      if (!paper) {
        // Default placeholder image if no paper
        setImageSrc('https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop');
        setImageSourceType('default');
        console.log('Using default placeholder image (no paper available)');
        return;
      }
      
      if (paper.image_url) {
        // Use existing image from database
        setImageSrc(paper.image_url);
        setImageSourceType('database');
        console.log(`Using database image for paper: ${paper.doi}`);
        return;
      }
      
      // No image available, try to generate one using Runware
      if (paper.ai_image_prompt) {
        console.log(`Attempting to generate image for paper: ${paper.doi}`);
        setIsGeneratingImage(true);
        setImageSourceType('runware');
        
        try {
          const generatedImageUrl = await checkAndGenerateImageIfNeeded(paper);
          if (generatedImageUrl) {
            setImageSrc(generatedImageUrl);
            console.log(`Successfully generated image for paper: ${paper.doi}`);
          } else {
            // Fallback to default if generation failed
            setImageSrc('https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop');
            console.log(`Failed to generate image, using fallback for paper: ${paper.doi}`);
          }
        } catch (error) {
          console.error('Error generating image:', error);
          // Fallback to default if generation failed
          setImageSrc('https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop');
        } finally {
          setIsGeneratingImage(false);
        }
        return;
      }
      
      // No prompt available, use default
      setImageSrc('https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop');
      setImageSourceType('default');
      console.log(`No image prompt available, using default for paper: ${paper.doi}`);
    };
    
    handleImageSource();
  }, [paper]);
  
  // Extract first paragraph from key takeaways as highlight
  const firstTakeaway = (() => {
    if (!paper || !paper.ai_key_takeaways) return '';
    
    if (Array.isArray(paper.ai_key_takeaways) && paper.ai_key_takeaways.length > 0) {
      const firstItem = paper.ai_key_takeaways[0];
      
      // Fix TypeScript errors with proper null checks
      if (firstItem === null || firstItem === undefined) {
        return '';
      }
      
      // Since we've already checked for null above, we can now safely use firstItem
      if (typeof firstItem === 'object' && firstItem !== null && 'text' in firstItem) {
        return String(firstItem.text || '');
      }
      
      // Safe conversion to string - use empty string as fallback
      return String(firstItem || '');
    } else if (typeof paper.ai_key_takeaways === 'string') {
      const takeawaysStr = String(paper.ai_key_takeaways);
      const lines = takeawaysStr.split('\n');
      return lines.length > 0 ? lines[0] : '';
    }
    return '';
  })();

  const formattedTakeaways = paper ? parseKeyTakeaways(paper.ai_key_takeaways) : [];

  return {
    categories,
    formattedDate,
    imageSrc,
    displayTitle: paper?.ai_headline || paper?.title_org || 'Untitled Paper',
    firstTakeaway,
    formattedTakeaways,
    isGeneratingImage,
    imageSourceType
  };
};
