
import { useState, useEffect } from 'react';
import { type Paper } from '../lib/supabase';
import { checkAndGenerateImageIfNeeded } from '../lib/imageGenerationService';
import { format } from 'date-fns';
import { parseTakeaways } from '../utils/takeawayParser';

interface UsePaperDataReturnType {
  categories: string[];
  formattedDate: string;
  imageSrc: string;
  displayTitle: string;
  firstTakeaway: string | null;
  formattedTakeaways: { text: string; citation?: string; type?: string }[];
  isGeneratingImage: boolean;
  imageSourceType: 'database' | 'default' | 'generated';
}

export function usePaperData(paper: Paper): UsePaperDataReturnType {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageSourceType, setImageSourceType] = useState<'database' | 'default' | 'generated'>('default');

  // Format paper data for display
  const categories = Array.isArray(paper.category)
    ? paper.category
    : paper.category
    ? [paper.category]
    : [];

  const formattedDate = paper.created_at
    ? format(new Date(paper.created_at), 'MMM d, yyyy')
    : '';

  // Use AI headline if available, otherwise original title
  const displayTitle = paper.ai_headline || paper.title_org;

  // Process takeaways
  const formattedTakeaways = parseTakeaways(paper.ai_key_takeaways);
  
  // Get first takeaway for preview
  const firstTakeaway = formattedTakeaways.length > 0 
    ? formattedTakeaways[0]?.text || null 
    : null;

  // Check for image and generate if needed
  useEffect(() => {
    const getOrGenerateImage = async () => {
      if (!paper) return;

      // If there's a direct image URL, use that
      if (paper.image_url) {
        console.log(`Using database image for paper: ${paper.doi}`);
        setImageSrc(paper.image_url);
        setImageSourceType('database');
        return;
      }

      // Use a default image when there's no image or no prompt
      if (!paper.ai_image_prompt) {
        setImageSrc('https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000');
        setImageSourceType('default');
        return;
      }

      // Generate image if we have a prompt but no image
      try {
        setIsGeneratingImage(true);
        const imageUrl = await checkAndGenerateImageIfNeeded(paper);
        
        if (imageUrl) {
          setImageSrc(imageUrl);
          setImageSourceType('generated');
        } else {
          // Fallback to default
          setImageSrc('https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000');
          setImageSourceType('default');
        }
      } catch (error) {
        console.error('Error generating image:', error);
        // Fallback to default
        setImageSrc('https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000');
        setImageSourceType('default');
      } finally {
        setIsGeneratingImage(false);
      }
    };

    getOrGenerateImage();
  }, [paper]);

  return {
    categories,
    formattedDate,
    imageSrc,
    displayTitle,
    firstTakeaway,
    formattedTakeaways,
    isGeneratingImage,
    imageSourceType
  };
}
