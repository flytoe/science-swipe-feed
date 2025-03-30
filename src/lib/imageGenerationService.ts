
import { supabase } from '../integrations/supabase/client';
import { Paper } from './supabase';
import { toast } from 'sonner';

/**
 * Generates an image for a paper using the edge function
 * @param paper The paper to generate an image for
 * @returns The URL of the generated image, or null if generation failed
 */
export async function generateImageForPaper(paper: Paper): Promise<string | null> {
  if (!paper.ai_image_prompt) {
    console.warn('No image prompt available for paper:', paper.doi);
    return null;
  }
  
  try {
    console.log(`Generating image with Runware for paper ${paper.doi} with prompt: ${paper.ai_image_prompt}`);
    
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: {
        paperId: paper.doi,
        prompt: paper.ai_image_prompt,
        forceRegenerate: true // Force regeneration even if image already exists
      }
    });
    
    if (error) {
      console.error('Error invoking generate-image function:', error);
      toast.error('Failed to generate image');
      return null;
    }
    
    console.log('Runware image generation response:', data);
    
    if (data && data.imageUrl) {
      console.log(`Successfully generated image with Runware for paper: ${paper.doi}`);
      return data.imageUrl;
    }
    
    console.warn(`No image URL returned from Runware for paper: ${paper.doi}`);
    return null;
  } catch (error) {
    console.error('Error generating image with Runware:', error);
    toast.error('Failed to generate image');
    return null;
  }
}

/**
 * Checks if a paper has an image and generates one if not
 * @param paper The paper to check
 * @returns The URL of the existing or newly generated image, or null if generation failed
 */
export async function checkAndGenerateImageIfNeeded(paper: Paper): Promise<string | null> {
  // If the paper already has an image, just return that URL
  if (paper.image_url) {
    console.log(`Paper ${paper.doi} already has an image: ${paper.image_url}`);
    return paper.image_url;
  }
  
  console.log(`Paper ${paper.doi} has no image. Checking if generation is possible...`);
  
  // Only generate if we have a prompt AND no existing image
  if (paper.ai_image_prompt) {
    console.log(`Found prompt for paper ${paper.doi}, generating image with Runware...`);
    return await generateImageForPaper(paper);
  }
  
  console.log(`No prompt available for paper ${paper.doi}, cannot generate image`);
  return null;
}
