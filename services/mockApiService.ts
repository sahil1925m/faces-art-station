import { FeatureCategory, DbMatch } from '../types';
import { searchCriminalDatabase } from "./criminalDatabase";

const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const handleApiError = (error: unknown, context: 'generation' | 'refinement'): never => {
    console.error(`Error during image ${context}:`, error);
    if (error instanceof Error) {
        if (error.message.includes('Rate limits exceeded')) {
            throw new Error("Too many requests. Please try again in a moment.");
        }
        if (error.message.includes('Credits depleted')) {
            throw new Error("AI credits depleted. Please contact support.");
        }
        if (error.message.toLowerCase().includes('safety')) {
            throw new Error(`${context === 'generation' ? 'Generation' : 'Refinement'} failed due to safety filters. Please try a different description.`);
        }
    }
    throw new Error(`Failed to ${context === 'generation' ? 'generate composite' : 'refine image'} from AI.`);
}

export const mockApiService = {
  generateInitialComposite: async (prompt: string): Promise<string> => {
    try {
      console.log(`Generating initial composite for prompt: "${prompt}"`);
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-composite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate composite');
      }

      const data = await response.json();
      if (!data.imageUrl) {
        throw new Error("API did not return an image.");
      }

      return data.imageUrl;
    } catch (error) {
        handleApiError(error, 'generation');
    }
  },

  refineFeature: async (
    baseImage: string,
    featureToChange: FeatureCategory | 'inferred',
    refinementPrompt: string
  ): Promise<string> => {
    /*
    ======================================================================
    === BACKEND PSEUDOCODE: FastAPI /api/refine-feature endpoint       ===
    ======================================================================
    
    import uvicorn
    from fastapi import FastAPI
    from pydantic import BaseModel
    import base64
    
    # --- Mock/Placeholder AI Model Clients ---
    # from sam_client import SegmentationModel
    # from inpainting_client import InpaintingModel
    #
    # segmentation_model = SegmentationModel()
    # inpainting_model = InpaintingModel()
    
    def segment_face(image_bytes, feature_name):
        # In a real implementation, this function calls a Semantic Segmentation
        # model (like SAM) or a specialized facial parsing model.
        print(f"Calling Segmentation AI to find the '{feature_name}'...")
        # mask_bytes = segmentation_model.get_mask(image=image_bytes, feature=feature_name)
        # return mask_bytes
        # For the pseudocode, we'll assume it returns a placeholder mask.
        return b'placeholder_mask_bytes'
    
    def inpaint(image_bytes, mask_bytes, prompt):
        # This function calls a Masked Inpainting AI model.
        print(f"Calling Inpainting AI to redraw the masked area with prompt: '{prompt}'...")
        # new_image_bytes = inpainting_model.inpaint(image=image_bytes, mask=mask_bytes, prompt=prompt)
        # return new_image_bytes
        # For the pseudocode, we'll just return the original image bytes.
        return image_bytes

    app = FastAPI()

    class RefinePayload(BaseModel):
        current_image: str   # Base64 encoded data URL
        feature_to_change: str
        new_feature_prompt: str

    @app.post("/api/refine-feature")
    async def refine_feature_endpoint(payload: RefinePayload):
        image_data = base64.b64decode(payload.current_image.split(',')[1])
        
        # === [Backend Step 1: Segmentation - The "Identifier"] ===
        # The frontend sends a category name (e.g., "nose"). The backend
        # uses the segmentation model to find those pixels on the image.
        mask_data = segment_face(
            image_bytes=image_data, 
            feature_name=payload.feature_to_change
        )
        if not mask_data:
            # ERROR HANDLING: If the AI cannot find the feature,
            # return an error to the user.
            return {"error": f"Sorry, I couldn't identify the '{payload.feature_to_change}'. Please be more specific in the chat."}

        # === CRITICAL CHALLENGE ANALYSIS: Masking Non-Obvious Features ===
        # How do we mask "Jawline" or "Face Shape"?
        # 1. Specialized Model: The best solution is a facial parsing model trained
        #    to recognize these broader regions. For "Jawline", it would identify the lower
        #    third of the face outline. For "Face Shape", it would mask the entire facial
        #    silhouette, excluding hair and ears. This is the most accurate method.
        # 2. Heuristic Masks + Inpainting Prompt: If a specialized model is unavailable,
        #    we can generate a heuristic mask (e.g., a soft-edged oval for the face) and
        #    rely on the inpainting prompt's strength. For "a square jawline", the inpainting
        #    AI would reshape the lower part of the masked oval into a square form. The mask
        #    is still critical because it constrains the AI's changes to the facial area only,
        #    preserving the background, clothing, and overall composition.

        # === MASK BLENDING STRATEGY ===
        # To ensure the new feature blends seamlessly, the mask returned from the segmentation
        # model should be "feathered" (blurred at the edges) before being passed to the
        # inpainting model. This creates a soft transition zone, allowing the AI to generate
        # pixels that bridge the original image and the new feature without a hard edge.
        
        # === [Backend Step 2: Inpainting - The "Surgeon"] ===
        # The inpainting AI receives the original image, the mask, and the text prompt.
        # It regenerates *only* the pixels inside the mask.
        new_image_data = inpaint(
            image_bytes=image_data,
            mask_bytes=mask_data,
            prompt=payload.new_feature_prompt
        )

        new_image_base64 = "data:image/jpeg;base64," + base64.b64encode(new_image_data).decode('utf-8')
        return {"image_base64": new_image_base64}
    */
    
    // --- FRONTEND CALLING BACKEND ---
    console.log(`Refining feature '${featureToChange}' with prompt: "${refinementPrompt}"`);

    try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/refine-feature`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            baseImage,
            featureToChange,
            refinementPrompt,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to refine feature');
        }

        const data = await response.json();
        if (!data.imageUrl) {
          throw new Error("API did not return an image.");
        }

        return data.imageUrl;
    } catch (error) {
        handleApiError(error, 'refinement');
    }
  },

  searchDatabase: async (sketchImage: string): Promise<DbMatch[]> => {
    /*
    ======================================================================
    === FRONTEND LOGIC (PSEUDOCODE/JS) for Database Search
    ======================================================================

    const searchDbBtn = document.getElementById('search-db-btn');
    const modal = document.getElementById('db-modal');
    const loader = document.getElementById('db-loader');
    const resultsGrid = document.getElementById('db-results-grid');

    searchDbBtn.addEventListener('click', async () => {
        // 1. Show the modal and the loading state
        modal.style.display = 'flex';
        loader.style.display = 'block';
        resultsGrid.innerHTML = '';
        
        try {
            // 2. Simulate API call (fetch)
            // const response = await fetch('/api/search-database', { method: 'POST', ... });
            // const matches = await response.json();
            
            // For demo purposes, we use a setTimeout
            setTimeout(() => {
                const matches = [
                    { subjectId: '...', score: 92, imageUrl: '...' },
                    { subjectId: '...', score: 88, imageUrl: '...' },
                ];

                // 3. Hide loader and display results
                loader.style.display = 'none';
                matches.forEach(match => {
                    const card = document.createElement('div');
                    card.innerHTML = `
                        <img src="${match.imageUrl}" />
                        <h3>Subject ID: ${match.subjectId}</h3>
                        <p>Similarity Score: ${match.score}%</p>
                    `;
                    resultsGrid.appendChild(card);
                });

            }, 3000); // 3-second simulated search

        } catch (error) {
            console.error(error);
            // Handle errors (e.g., show an error message in the modal)
        }
    });
    */
    
    // --- LIVE FRONTEND SIMULATION ---
    console.log("Simulating vector search against database for image:", sketchImage.substring(0, 50) + "...");
    
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate 3 second search time

    const matches = searchCriminalDatabase();
    
    // To test the "no match" scenario, uncomment the line below:
    // return [];

    return matches;
  }
};