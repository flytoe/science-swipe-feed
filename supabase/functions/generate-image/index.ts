
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Get environment variables
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const RUNWARE_API_KEY = Deno.env.get("RUNWARE_API_KEY") || "";
const API_ENDPOINT = "https://api.runware.ai/v1";

// Create Supabase client with SERVICE ROLE KEY for admin access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Generate image using Runware API
async function generateImage(prompt: string): Promise<{imageURL: string, error?: string}> {
  console.log(`Generating image with prompt: ${prompt}`);
  
  try {
    const payload = [
      {
        taskType: "authentication",
        apiKey: RUNWARE_API_KEY
      },
      {
        taskType: "imageInference",
        taskUUID: crypto.randomUUID(),
        positivePrompt: prompt,
        width: 1024,
        height: 1024,
        model: "runware:100@1",
        numberResults: 1,
        outputFormat: "WEBP",
        CFGScale: 1,
      }
    ];

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Runware API response:", data);

    if (!response.ok || data.error) {
      throw new Error(data.error || "Failed to generate image");
    }

    // Find the image inference task in the response
    const imageTask = data.data.find((task: any) => task.taskType === "imageInference");
    if (!imageTask || !imageTask.imageURL) {
      throw new Error("No image URL found in response");
    }

    return { imageURL: imageTask.imageURL };
  } catch (error) {
    console.error("Error generating image:", error);
    return { imageURL: "", error: error.message };
  }
}

// Download image from URL and save to Supabase Storage
async function saveImageToStorage(imageUrl: string, paperId: string): Promise<{path: string, error?: string}> {
  try {
    console.log(`Downloading image from: ${imageUrl}`);
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }
    
    const imageBlob = await response.blob();
    const filename = `${paperId}-${Date.now()}.webp`;
    const filePath = `${filename}`;

    console.log(`Uploading image to storage: ${filePath}`);
    const { data, error } = await supabase.storage
      .from("paper_images")
      .upload(filePath, imageBlob, {
        contentType: "image/webp",
        upsert: true,
      });

    if (error) {
      throw error;
    }

    console.log("Upload successful:", data);
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from("paper_images")
      .getPublicUrl(filePath);

    return { path: urlData.publicUrl };
  } catch (error) {
    console.error("Error saving image to storage:", error);
    return { path: "", error: error.message };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { paperId, prompt } = await req.json();
    
    if (!paperId) {
      return new Response(
        JSON.stringify({ error: "Paper ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if the paper already has an image
    const { data: existingPaper, error: queryError } = await supabase
      .from("n8n_table")
      .select("image_url")
      .eq("doi", paperId)
      .single();
      
    if (queryError) {
      console.error("Error checking existing paper:", queryError);
    } else if (existingPaper?.image_url) {
      console.log(`Paper ${paperId} already has an image: ${existingPaper.image_url}`);
      return new Response(
        JSON.stringify({ imageUrl: existingPaper.image_url }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate the image
    const { imageURL, error: genError } = await generateImage(prompt);
    if (genError || !imageURL) {
      return new Response(
        JSON.stringify({ error: genError || "Failed to generate image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save the image to storage
    const { path, error: saveError } = await saveImageToStorage(imageURL, paperId);
    if (saveError || !path) {
      return new Response(
        JSON.stringify({ error: saveError || "Failed to save image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update the paper record with the new image URL
    const { error: updateError } = await supabase
      .from("n8n_table")
      .update({ image_url: path })
      .eq("doi", paperId);

    if (updateError) {
      console.error("Error updating paper record:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update paper record", details: updateError.message, imageUrl: path }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Successfully updated paper ${paperId} with image URL: ${path}`);

    return new Response(
      JSON.stringify({ imageUrl: path }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
