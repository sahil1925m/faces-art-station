// @ts-nocheck - Deno environment
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { baseImage, featureToChange, refinementPrompt } = await req.json();
    
    if (!baseImage || !featureToChange || !refinementPrompt) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let textPrompt = `SURGICAL INPAINTING MASKED EDIT: On the provided forensic sketch, find the '${featureToChange}' and replace ONLY that feature with the following description: "${refinementPrompt}". CRITICAL RULE: DO NOT change any other part of the face, hair, or background. Preserve the identity of the person.`;

    if (featureToChange === 'faceShape') {
      textPrompt = `SURGICAL INPAINTING MASKED EDIT: On the provided forensic sketch, surgically modify the overall face shape to become ${refinementPrompt}. The conceptual "mask" for this operation should cover the entire facial silhouette, including the jawline and chin, but excluding hair, ears, and neck. CRITICAL RULE: Preserve all internal facial features like eyes, nose, and mouth. Only alter the contour of the face. Do not change the background or the person's identity.`;
    }

    console.log("Refining feature:", featureToChange, "with prompt:", refinementPrompt);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: textPrompt
              },
              {
                type: "image_url",
                image_url: {
                  url: baseImage
                }
              }
            ]
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Credits depleted. Please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI refinement failed" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("No image returned from API");
    }

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in refine-feature:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
