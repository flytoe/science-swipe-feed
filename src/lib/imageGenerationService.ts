
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

export async function checkAndGenerateImageIfNeeded(paper: any): Promise<string | null> {
  // If we already have an image URL, return it
  if (paper.image_url) {
    return paper.image_url;
  }

  // If we have a prompt, generate an image
  if (paper.ai_image_prompt) {
    return await generateAndStoreImage(paper.doi, paper.ai_image_prompt);
  }

  return null;
}
