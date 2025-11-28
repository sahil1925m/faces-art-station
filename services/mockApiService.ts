import { FeatureCategory, DbMatch } from '../types';
import { searchCriminalDatabase } from "./criminalDatabase";

const POLLINATIONS_URL = 'https://image.pollinations.ai/prompt';

const handleApiError = (error: unknown, context: 'generation' | 'refinement'): never => {
  console.error(`Error during image ${context}:`, error);
  const originalMessage = error instanceof Error ? error.message : 'Unknown error';
  throw new Error(`Failed to ${context === 'generation' ? 'generate composite' : 'refine image'}: ${originalMessage}`);
}

export const mockApiService = {
  generateInitialComposite: async (prompt: string, seed?: number): Promise<string> => {
    try {
      console.log(`Generating initial composite for prompt: "${prompt}" with seed: ${seed}`);

      const styleSuffix = ", forensic sketch style, pencil drawing, black and white, high contrast, detailed shading, front view, straight on, mugshot, symmetrical face";
      const fullPrompt = `${prompt}${styleSuffix}`;
      const encodedPrompt = encodeURIComponent(fullPrompt);
      const seedParam = seed ? `&seed=${seed}` : '';
      const imageUrl = `${POLLINATIONS_URL}/${encodedPrompt}?nologo=true${seedParam}`;

      // Verify image is accessible (optional, but good for UX)
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image from Pollinations AI: ${response.statusText}`);
      }

      return response.url;
    } catch (error) {
      handleApiError(error, 'generation');
    }
  },

  refineFeature: async (
    currentPrompt: string, // Changed from baseImage to currentPrompt to support regeneration
    seed: number,
    featureToChange: FeatureCategory | 'inferred',
    refinementPrompt: string
  ): Promise<{ imageUrl: string; updatedPrompt: string }> => {

    console.log(`Refining feature '${featureToChange}' with prompt: "${refinementPrompt}"`);

    try {
      // Construct a new prompt based on the refinement
      // In a real LLM-backed system, we'd ask the LLM to merge the prompts.
      // Here, we'll append the refinement if it's not already there, or just rely on the user's "currentPrompt" state being updated in App.tsx

      // Simple strategy: Append the refinement to the prompt if it's a specific feature change
      // For 'inferred', we assume the prompt passed in IS the full new prompt or a modification.

      let updatedPrompt = currentPrompt;
      if (featureToChange !== 'inferred') {
        updatedPrompt = `${currentPrompt}, ${refinementPrompt}`;
      } else {
        // If it's inferred, we might just append it too, or if the logic in App.tsx handles prompt merging, we just use what's passed.
        // Let's assume for now we append to give more weight to the new instruction.
        updatedPrompt = `${currentPrompt}, ${refinementPrompt}`;
      }

      const styleSuffix = ", forensic sketch style, pencil drawing, black and white, high contrast, detailed shading, front view, straight on, mugshot, symmetrical face";
      const fullPrompt = `${updatedPrompt}${styleSuffix}`;
      const encodedPrompt = encodeURIComponent(fullPrompt);
      const imageUrl = `${POLLINATIONS_URL}/${encodedPrompt}?nologo=true&seed=${seed}`;

      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch refined image from Pollinations AI`);
      }

      return { imageUrl: response.url, updatedPrompt };

    } catch (error) {
      handleApiError(error, 'refinement');
    }
  },

  searchDatabase: async (sketchImage: string): Promise<DbMatch[]> => {
    // --- LIVE FRONTEND SIMULATION ---
    console.log("Simulating vector search against database for image:", sketchImage.substring(0, 50) + "...");

    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate 3 second search time

    const matches = searchCriminalDatabase();
    return matches;
  }
};