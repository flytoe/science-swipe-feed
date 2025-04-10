
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
    const { prompt, paperId, databaseSource } = await req.json()

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Generating image for ${databaseSource} with ID: ${paperId}`)
    
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

    // Call Runware API to generate the image
    const payload = JSON.stringify([
      {
        taskType: "authentication",
        apiKey: RUNWARE_API_KEY
      },
      {
        taskType: "imageInference",
        taskUUID: crypto.randomUUID(),
        positivePrompt: prompt,
        model: "runware:100@1",
        width: 1024,
        height: 768,
        numberResults: 1,
        outputFormat: "WEBP",
        CFGScale: 1,
        scheduler: "FlowMatchEulerDiscreteScheduler",
        strength: 0.8
      }
    ])

    console.log("Calling Runware API with payload:", payload)
    
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
    console.log("Runware API response:", JSON.stringify(result))

    // Find the imageInference task result
    const imageTask = result.data.find(item => item.taskType === 'imageInference')
    
    if (!imageTask || !imageTask.imageURL) {
      throw new Error('No image URL returned from Runware')
    }

    const imageUrl = imageTask.imageURL
    console.log("Generated image URL:", imageUrl)

    // Update the database with the new image URL
    const { error: updateError } = await supabaseAdmin
      .from(databaseSource)
      .update({ image_url: imageUrl })
      .eq('id', paperId)

    if (updateError) {
      console.error('Error updating paper with image URL:', updateError)
    } else {
      console.log(`Successfully updated ${databaseSource} with image URL for paper ID: ${paperId}`)
    }

    // Return the generated image URL
    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
