import { FeatureCategory, DbMatch } from '../types';
import { searchCriminalDatabase } from "./criminalDatabase";

const POLLINATIONS_URL = 'https://image.pollinations.ai/prompt';
const BACKEND_URL = 'http://localhost:8000/api/refine-feature';

const handleApiError = (error: unknown, context: 'generation' | 'refinement'): never => {
  console.error(`Error during image ${context}:`, error);
  const originalMessage = error instanceof Error ? error.message : 'Unknown error';
  throw new Error(`Failed to ${context === 'generation' ? 'generate composite' : 'refine image'}: ${originalMessage}`);
}

/**
 * Convert an image URL to base64 data URI
 */
async function imageUrlToBase64(imageUrl: string): Promise<string> {
  // If already base64, return as-is
  if (imageUrl.startsWith('data:image')) {
    return imageUrl;
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Failed to convert image to base64:", error);
    throw error;
  }
}

/**
 * Infer the feature category from the refinement prompt
 */
function inferFeatureFromPrompt(prompt: string): FeatureCategory {
  const lowerPrompt = prompt.toLowerCase();

  // Hair-related
  if (/\b(hair|hairstyle|bald|curly|wavy|straight|afro|ponytail|braids?|dreads?|mohawk|buzz\s?cut|fade)\b/.test(lowerPrompt)) {
    return 'hairStyle';
  }

  // Eyebrows
  if (/\b(eyebrow|brow|bushy|thin\s+brows?|arched|unibrow)\b/.test(lowerPrompt)) {
    return 'eyebrows';
  }

  // Eyes
  if (/\b(eye|eyes|eyelid|pupil|iris|glasses|sunglasses|eye\s*color)\b/.test(lowerPrompt)) {
    return 'eyes';
  }

  // Nose
  if (/\b(nose|nostril|bridge|nasal)\b/.test(lowerPrompt)) {
    return 'nose';
  }

  // Mouth/Lips
  if (/\b(mouth|lip|lips|teeth|smile|smiling|frown|grin)\b/.test(lowerPrompt)) {
    return 'lips';
  }

  // Facial hair
  if (/\b(beard|mustache|moustache|goatee|stubble|clean\s*shaven|facial\s*hair|sideburns?|whiskers?)\b/.test(lowerPrompt)) {
    return 'facialHair';
  }

  // Face shape/jaw
  if (/\b(jaw|jawline|chin|face\s*shape|cheek|cheekbone|oval|round|square|angular)\b/.test(lowerPrompt)) {
    return 'faceShape';
  }

  // Skin/Age
  if (/\b(skin|wrinkle|age|older|younger|scar|freckle|mole|complexion|acne)\b/.test(lowerPrompt)) {
    return 'skinAge';
  }

  // Default to face for general refinements
  return 'faceShape';
}

/**
 * Map FeatureCategory to the mask feature name expected by the backend
 */
function mapCategoryToMaskName(category: FeatureCategory | 'inferred', prompt: string): string {
  // If 'inferred', try to detect from prompt
  if (category === 'inferred') {
    category = inferFeatureFromPrompt(prompt);
  }

  const categoryMaskMap: Record<FeatureCategory, string> = {
    'hairStyle': 'hair',
    'eyebrows': 'eyebrows',
    'eyes': 'eyes',
    'nose': 'nose',
    'lips': 'mouth',
    'facialHair': 'beard',
    'faceShape': 'jaw',
    'jawline': 'jaw',
    'cheekbones': 'face',
    'ears': 'face',
    'skinAge': 'face',
    'accessories': 'face',
    'expression': 'face',
  };

  return categoryMaskMap[category] || 'face';
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

      // Return URL immediately - let the <img> tag handle loading
      // Pollinations API generates the image when the URL is accessed
      // This provides much faster perceived response time
      console.log("Returning image URL for lazy loading:", imageUrl);
      return imageUrl;
    } catch (error) {
      handleApiError(error, 'generation');
    }
  },

  refineFeature: async (
    currentImage: string, // Could be URL or base64
    currentPrompt: string,
    seed: number,
    featureToChange: FeatureCategory | 'inferred',
    refinementPrompt: string
  ): Promise<{ imageUrl: string; updatedPrompt: string }> => {

    console.log(`Refining feature '${featureToChange}' with prompt: "${refinementPrompt}"`);

    try {
      // Step 1: Convert image URL to base64 if needed
      console.log("Converting image to base64...");
      const base64Image = await imageUrlToBase64(currentImage);
      console.log("Image converted, length:", base64Image.length);

      // Step 2: Infer the correct feature from the prompt if category is 'inferred'
      const maskFeatureName = mapCategoryToMaskName(featureToChange, refinementPrompt);
      console.log(`Mapped feature category '${featureToChange}' to mask: '${maskFeatureName}'`);

      // Step 3: Create FormData to send to Python backend
      const formData = new FormData();
      formData.append('image', base64Image);
      formData.append('feature_name', maskFeatureName);
      formData.append('refinement_prompt', refinementPrompt);

      // Step 4: Call the local Python backend
      console.log("Calling backend API...");
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Backend error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Backend response received:", data.message);

      // The backend returns { image: "data:image/png;base64,...", message: "..." }
      const newPrompt = `${currentPrompt}, ${refinementPrompt}`;

      return {
        imageUrl: data.image,
        updatedPrompt: newPrompt
      };

    } catch (error) {
      console.error("Backend refinement failed, falling back to Pollinations regeneration...", error);

      // Fallback to old logic if backend fails (e.g. not running)
      let updatedPrompt = currentPrompt;
      const lowerRefinement = refinementPrompt.toLowerCase().trim();

      // Handle "remove", "delete", "no", "without" commands
      const removeMatch = lowerRefinement.match(/^(?:remove|delete|no|without)\s+(.+)$/);

      if (removeMatch) {
        const termToRemove = removeMatch[1];
        const regex = new RegExp(`(?:,\\s*)?\\b${termToRemove}\\b(?:\\s*,)?`, 'gi');
        updatedPrompt = updatedPrompt.replace(regex, '');
        updatedPrompt = updatedPrompt.replace(/,\s*,/g, ',').replace(/^,\s*/, '').replace(/,\s*$/, '');
      } else {
        if (!updatedPrompt.toLowerCase().includes(lowerRefinement)) {
          updatedPrompt = `${updatedPrompt}, ${refinementPrompt}`;
        }
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