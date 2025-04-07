
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
    
    // Show a toast notification to let the user know we're generating an image
    toast.loading('Generating image...', { id: `generate-image-${paper.doi}` });
    
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: {
        paperId: paper.doi,
        prompt: paper.ai_image_prompt,
        forceRegenerate: false // Don't force regeneration if image already exists
      }
    });
    
    if (error) {
      console.error('Error invoking generate-image function:', error);
      toast.error('Failed to generate image', { id: `generate-image-${paper.doi}` });
      return null;
    }
    
    console.log('Runware image generation response:', data);
    
    if (data && data.imageUrl) {
      console.log(`Successfully generated image with Runware for paper: ${paper.doi}`);
      toast.success('Image generated successfully', { id: `generate-image-${paper.doi}` });
      return data.imageUrl;
    }
    
    console.warn(`No image URL returned from Runware for paper: ${paper.doi}`);
    toast.error('Failed to generate image', { id: `generate-image-${paper.doi}` });
    return null;
  } catch (error) {
    console.error('Error generating image with Runware:', error);
    toast.error('Failed to generate image', { id: `generate-image-${paper.doi}` });
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

/**
 * Regenerates an image for a paper even if it already has one
 * @param paper The paper to regenerate an image for
 * @returns The URL of the newly generated image, or null if generation failed
 */
export async function regenerateImage(paper: Paper): Promise<string | null> {
  if (!paper.ai_image_prompt) {
    toast.error('No image prompt available for this paper');
    return null;
  }
  
  try {
    toast.loading('Regenerating image...', { id: `regenerate-image-${paper.doi}` });
    
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: {
        paperId: paper.doi,
        prompt: paper.ai_image_prompt,
        forceRegenerate: true // Force regeneration even if image already exists
      }
    });
    
    if (error) {
      console.error('Error regenerating image:', error);
      toast.error('Failed to regenerate image', { id: `regenerate-image-${paper.doi}` });
      return null;
    }
    
    if (data && data.imageUrl) {
      toast.success('Image regenerated successfully', { id: `regenerate-image-${paper.doi}` });
      return data.imageUrl;
    }
    
    toast.error('Failed to regenerate image', { id: `regenerate-image-${paper.doi}` });
    return null;
  } catch (error) {
    console.error('Error regenerating image:', error);
    toast.error('Failed to regenerate image', { id: `regenerate-image-${paper.doi}` });
    return null;
  }
}
