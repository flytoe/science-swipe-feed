
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const API_ENDPOINT = "https://api.runware.ai/v1"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { 
      prompt, 
      paperId, 
      databaseSource, 
      width = 1024, 
      height = 768,
      shouldStorePrompt = true
    } = await req.json()

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required', success: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (!paperId) {
      return new Response(
        JSON.stringify({ error: 'Paper ID is required', success: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (!databaseSource) {
      return new Response(
        JSON.stringify({ error: 'Database source is required', success: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Generating image for ${databaseSource} with ID: ${paperId}`)
    console.log(`Using prompt: ${prompt}`)
    
    // Get the Runware API key from environment variables
    const RUNWARE_API_KEY = Deno.env.get('RUNWARE_API_KEY')
    if (!RUNWARE_API_KEY) {
      throw new Error('RUNWARE_API_KEY is not set')
    }

    // Create a Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // If shouldStorePrompt is true, update the prompt in the database right away
    if (shouldStorePrompt) {
      console.log(`Updating prompt for ${databaseSource} with ID: ${paperId}`)
      
      const { error: promptUpdateError } = await supabaseAdmin
        .from(databaseSource)
        .update({ ai_image_prompt: prompt })
        .eq('id', paperId)

      if (promptUpdateError) {
        console.error('Error updating paper with prompt:', promptUpdateError)
        // Continue with image generation even if prompt update fails
        console.log('Continuing with image generation despite prompt update failure')
      } else {
        console.log('Successfully updated prompt in database')
      }
    }

    // Call Runware API to generate the image
    const taskUUID = crypto.randomUUID();
    
    const payload = JSON.stringify([
      {
        taskType: "authentication",
        apiKey: RUNWARE_API_KEY
      },
      {
        taskType: "imageInference",
        taskUUID: taskUUID,
        positivePrompt: prompt,
        model: "runware:100@1",
        width: width,
        height: height,
        numberResults: 1,
        outputFormat: "WEBP",
        CFGScale: 1,
        scheduler: "FlowMatchEulerDiscreteScheduler",
        strength: 0.8
      }
    ])

    console.log("Calling Runware API...")
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error from Runware API:', errorText)
      throw new Error(`Runware API returned error: ${errorText}`)
    }

    const result = await response.json()
    console.log("Runware API response received")

    // Find the imageInference task result
    const imageTask = result.data.find((item: any) => item.taskType === 'imageInference')
    
    if (!imageTask || !imageTask.imageURL) {
      throw new Error('No image URL returned from Runware')
    }

    const imageUrl = imageTask.imageURL
    console.log("Generated image URL:", imageUrl)

    // Begin a transaction to update the database
    // This ensures we only update the database if all operations are successful
    let updateData: { image_url: string; ai_image_prompt?: string } = {
      image_url: imageUrl
    };
    
    // If we should also store the prompt, add it to the update data
    if (shouldStorePrompt) {
      updateData.ai_image_prompt = prompt;
    }
    
    // Update the database with the new image URL
    const { error: updateError } = await supabaseAdmin
      .from(databaseSource)
      .update(updateData)
      .eq('id', paperId)

    if (updateError) {
      console.error('Error updating paper with image URL:', updateError)
      throw new Error(`Failed to update database: ${updateError.message}`)
    } else {
      console.log(`Successfully updated ${databaseSource} with image URL for paper ID: ${paperId}`)
    }

    // Return the generated image URL
    return new Response(
      JSON.stringify({ 
        imageUrl,
        success: true,
        message: 'Image generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred', 
        details: error.message,
        success: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
