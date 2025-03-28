
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";

export async function generateAndStoreImage(paperId: string, prompt: string): Promise<string | null> {
  try {
    toast.loading("Generating image...", { id: "generate-image" });
    
    const { data, error } = await supabase.functions.invoke("generate-image", {
      body: { paperId, prompt },
    });

    if (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image", { id: "generate-image" });
      return null;
    }

    toast.success("Image generated successfully!", { id: "generate-image" });
    return data.imageUrl;
  } catch (error) {
    console.error("Error in generateAndStoreImage:", error);
    toast.error("An error occurred while generating the image", { id: "generate-image" });
    return null;
  }
}

/**
 * Checks if a paper already has an image_url, and only generates a new one
 * if the image_url is empty and an ai_image_prompt exists.
 * 
 * @param paper - The paper object containing doi, image_url and ai_image_prompt
 * @returns The image URL (either existing or newly generated) or null
 */
export async function checkAndGenerateImageIfNeeded(paper: any): Promise<string | null> {
  // If we already have an image URL, return it without generating a new one
  if (paper.image_url) {
    console.log(`Paper ${paper.doi} already has an image: ${paper.image_url}`);
    return paper.image_url;
  }

  // If we have a prompt, generate an image
  if (paper.ai_image_prompt) {
    console.log(`Generating image for paper ${paper.doi} with prompt: ${paper.ai_image_prompt}`);
    return await generateAndStoreImage(paper.doi, paper.ai_image_prompt);
  }

  console.log(`Paper ${paper.doi} has no image_url and no ai_image_prompt`);
  return null;
}
