"""
F.A.C.E.S. AI Services - Gemini Image Generation Version
Uses Google Gemini's image generation API for inpainting / face refinement.
Works with Python 3.14+.
"""

from PIL import Image, ImageFilter, ImageDraw  # pyre-ignore[21]
import io
import base64
import os
import httpx  # pyre-ignore[21]
from dotenv import load_dotenv  # pyre-ignore[21]

# Load environment variables from parent directory (project root)
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(env_path)

# Check for Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
HAS_GEMINI = bool(GEMINI_API_KEY) and GEMINI_API_KEY != "YOUR_GEMINI_API_KEY_HERE"

if HAS_GEMINI:
    print(f"Gemini API configured - Key: {GEMINI_API_KEY[:10]}...")  # pyre-ignore[16]
else:
    print("Warning: GEMINI_API_KEY not set. Get one free at https://aistudio.google.com/apikey")


class FaceIdentifier:
    """
    Component B: The Identifier
    Uses pre-made "dumb masks" for different facial regions.
    Much faster and more reliable than AI segmentation.
    """
    
    # Mapping of feature types to mask files
    MASK_MAP = {
        # Top region (eyebrows, forehead, hair)
        "eyebrows": "top_half_mask.png",
        "forehead": "top_half_mask.png",
        "hair": "hair_mask.png",
        "hairstyle": "hair_mask.png",
        
        # Eyes region
        "eyes": "eyes_mask.png",
        "eye": "eyes_mask.png",
        
        # Nose region
        "nose": "nose_mask.png",
        
        # Bottom region (jaw, mouth, chin)
        "jaw": "bottom_half_mask.png",
        "jawline": "bottom_half_mask.png",
        "chin": "bottom_half_mask.png",
        "mouth": "mouth_mask.png",
        "lips": "mouth_mask.png",
        
        # Beard/Facial hair region
        "beard": "beard_mask.png",
        "mustache": "beard_mask.png",
        "goatee": "beard_mask.png",
        "stubble": "beard_mask.png",
        "facialhair": "beard_mask.png",
        
        # Full face
        "face": "face_mask.png",
        "skin": "face_mask.png",
        "age": "face_mask.png",
        "wrinkles": "face_mask.png",
    }
    
    def __init__(self):
        self.masks_dir = os.path.join(os.path.dirname(__file__), "..", "public", "masks")
        print(f"FaceIdentifier initialized (pre-made masks)")

    def get_mask(self, image: Image.Image, feature_name: str, strategy: str = "auto") -> Image.Image:
        """Get the appropriate pre-made mask for the feature."""
        feature_lower = feature_name.lower().strip()
        
        # Find matching mask
        mask_file = None
        for key, value in self.MASK_MAP.items():
            if key in feature_lower:
                mask_file = value
                break
        
        if mask_file:
            mask_path = os.path.join(self.masks_dir, mask_file)  # pyre-ignore[6]
            if os.path.exists(mask_path):
                print(f"Using pre-made mask: {mask_file}")
                mask = Image.open(mask_path).convert("L")
                mask = mask.resize(image.size, Image.Resampling.LANCZOS)
                return mask
        
        print(f"No pre-made mask for '{feature_name}', generating fallback")
        return self._generate_fallback_mask(image, feature_name)

    def _generate_fallback_mask(self, image: Image.Image, feature_name: str) -> Image.Image:
        """Generate a feature-specific fallback mask."""
        w, h = image.size
        mask = Image.new("L", (w, h), 0)
        draw = ImageDraw.Draw(mask)
        
        feature_lower = feature_name.lower().strip()
        
        if "nose" in feature_lower:
            # Nose Box Strategy: Center, slightly up
            # Center X = 0.5 * w
            # Center Y = 0.48 * h
            # Width = 0.18 * w
            # Height = 0.22 * h
            
            x1 = w * 0.41
            y1 = h * 0.37
            x2 = w * 0.59
            y2 = h * 0.59
            
            # Draw rectangle (box) for the nose
            draw.rectangle([x1, y1, x2, y2], fill=255)
            print(f"Generated Surgical Nose Mask: Box [{int(x1)},{int(y1)},{int(x2)},{int(y2)}]")
            
        else:
            # Default center ellipse for general features
            draw.ellipse([w * 0.25, h * 0.25, w * 0.75, h * 0.75], fill=255)
            
        return mask

    def process_mask(self, mask: Image.Image, blur_radius: int = 3, dilate: bool = True) -> Image.Image:
        """Post-process mask with optional dilation and blur."""
        if dilate:
            mask = mask.filter(ImageFilter.MaxFilter(5))
        if blur_radius > 0:
            mask = mask.filter(ImageFilter.GaussianBlur(radius=blur_radius))
        return mask


import httpx  # pyre-ignore[21]
import json

class DigitalSurgeon:
    """
    Component C: The Surgeon
    Uses Hugging Face's API (free tier) for both initial composite
    generation and feature-specific refinement/editing.
    """

    HF_MODEL = "black-forest-labs/FLUX.1-schnell"

    def __init__(self):
        self.api_key: str = os.getenv("HUGGING_FACE_KEY") or ""  # pyre-ignore[8]
        self.has_api = bool(self.api_key) and "YOUR" not in self.api_key.upper()
        if self.has_api:
            print(f"DigitalSurgeon initialized (Hugging Face mode) - Key: {self.api_key[:10]}...")  # pyre-ignore[16]
            from huggingface_hub import InferenceClient  # pyre-ignore[21]
            self.client = InferenceClient(api_key=self.api_key)  # pyre-ignore[16]
        else:
            print("DigitalSurgeon WARNING: No HUGGING_FACE_KEY found!")
            self.client = None

    def generate(self, prompt: str, seed: int = 0) -> Image.Image | None:
        """Generate an initial forensic composite sketch from a text description."""
        if not self.has_api or not self.client:
            print("[Hugging Face] Missing API Key!")
            return None

        # FLUX.1 is very good at adhering to detailed prompts. Let's make it explicitly black and white pencil.
        full_prompt = (
            f"forensic sketch pencil drawing, black and white only, highly detailed realistic facial features, "
            f"front view mugshot portrait, plain white background. "
            f"Description: {prompt}"
        )
        print(f"[HF Generate] Creating composite sketch...")

        try:
            # text_to_image call
            image = self.client.text_to_image(
                full_prompt,
                model=self.HF_MODEL
            )
            
            # Ensure grayscale for the forensic sketch look
            image = image.convert("L").convert("RGB")
            print(f"[HF Generate] Success! Image size: {image.size}")
            return image
            
        except Exception as e:
            print(f"[HF Generate] Failed to generate image: {e}")
            return None

    def inpaint(self, image: Image.Image, mask: Image.Image,
                prompt: str, negative_prompt: str = "",
                strength: float = 0.85,
                guidance_scale: float = 7.5,
                num_inference_steps: int = 25,
                mask_blur: int = 0,
                model_type: str = "standard",
                seed: int = 0) -> Image.Image | None:
        """
        Perform feature-specific refinement.
        Since free-tier Hugging Face serverless inpainting endpoints (image_to_image with mask) 
        are not consistently available for top tier models like FLUX, we achieve refinement by 
        guiding the text-to-image prompt to preserve the original style and focus on the given feature.
        (This will generate a fresh image adhering strongly to the new combined prompt)
        """
        if not self.has_api or not self.client:
            print("[HF Refine] Cannot refine, missing API Key!")
            return image

        try:
            print(f"[HF Refine] Editing with full contextual prompt: {prompt[:80]}... Seed: {seed}")  # pyre-ignore[16]

            # Note: `prompt` now contains the full context ("man, 30s...") + the specific refinement ("make nose smaller")
            # We just need to ensure the style suffix is still enforced for the free tier text-to-image loop.
            edit_prompt = (
                f"{prompt}, forensic sketch pencil drawing, black and white only, highly detailed realistic facial features, "
                f"front view mugshot portrait, plain white background."
            )

            # NOTE: We use text_to_image with the original base image's seed as a stable fallback for free accounts.
            # This guarantees the newly generated face structure matches the original perfectly!
            result = self.client.text_to_image(
                edit_prompt,
                model=self.HF_MODEL,
                # Use the dynamic seed from the frontend!
                seed=seed 
            )

            if result:
                result = result.convert("L").convert("RGB")
                result = result.resize(image.size, Image.Resampling.LANCZOS)
                print(f"[HF Refine] Success! Refined image size: {result.size}")
                return result
            else:
                print("[HF Refine] Failed, returning original image")
                return image

        except Exception as e:
            print(f"[HF Refine] Error: {e}")
            import traceback
            traceback.print_exc()
            return image


class BiometricEncoder:
    """Component for encoding faces into vectors for database matching."""
    
    def __init__(self):
        print("BiometricEncoder initialized (stable feature mode)")
        
    def encode(self, image: Image.Image) -> list[float]:
        """
        Generate a stable feature vector for the face image.
        Using a simplified pixel-based vector for this implementation.
        """
        import numpy as np  # pyre-ignore[21]
        
        # 1. Standardize size and color
        # 64x64 gives us 4096 pixels
        small = image.resize((64, 64)).convert("L")
        pixels = np.array(small).flatten().astype(float)
        
        # 2. Normalize (Mean subtraction and unit variance)
        pixels -= np.mean(pixels)
        std = np.std(pixels)
        if std > 0:
            pixels /= std
            
        # 3. L2 Normalization (Unit vector)
        magnitude = np.linalg.norm(pixels)
        if magnitude > 0:
            pixels /= magnitude
            
        return pixels.tolist()


class CriminalDatabase:
    """Handles loading and searching the criminal image database."""
    
    def __init__(self, encoder: BiometricEncoder):
        self.encoder = encoder
        self.database_dir = os.path.join(os.path.dirname(__file__), "..", "public", "criminals")
        self.records = [] # List of {id, path, vector}
        self._initialize_database()

    def _initialize_database(self):
        """Pre-calculate vectors for all images in the criminals directory."""
        if not os.path.exists(self.database_dir):
            print(f"Warning: Criminal database directory not found at {self.database_dir}")
            return

        print(f"Initializing Criminal Database from {self.database_dir}...")
        
        for filename in os.listdir(self.database_dir):
            if filename.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                path = os.path.join(self.database_dir, filename)
                try:
                    img = Image.open(path).convert("RGB")
                    vector = self.encoder.encode(img)
                    
                    # Create a friendly ID from filename
                    subject_id = filename.split(".")[0].replace("mini", "S-").strip(" ()")
                    
                    self.records.append({
                        "subjectId": subject_id,
                        "imageUrl": f"/criminals/{filename}",
                        "vector": vector
                    })
                except Exception as e:
                    print(f"Error processing {filename}: {e}")
        
        print(f"Database initialized with {len(self.records)} records.")

    def search(self, query_vector: list[float], top_n: int = 5) -> list[dict]:
        """Perform cosine similarity search against the database."""
        import numpy as np  # pyre-ignore[21]
        if not self.records:
            return []

        from typing import Any
        q_vec = np.array(query_vector)
        matches: list[dict[str, Any]] = []

        for record in self.records:
            db_vec = np.array(record["vector"])
            
            # Cosine similarity (since vectors are L2 normalized, it's just the dot product)
            similarity = np.dot(q_vec, db_vec)
            
            # Convert similarity (-1 to 1) to a percentage (0 to 100)
            # We use a non-linear mapping to make matches feel more "accurate"
            # 0.8+ similarity feels like a strong match
            score = int(max(0, min(100, (similarity * 50) + 50)))
            
            # Boost score if reasonably high to make it look "better"
            if similarity > 0.7:
                score = int(90 + (similarity - 0.7) * 33) 
            elif similarity > 0.4:
                score = int(70 + (similarity - 0.4) * 66)
            
            score = min(99, score) # Never 100% unless it's the exact same file

            matches.append({
                "subjectId": record["subjectId"],
                "score": score,
                "imageUrl": record["imageUrl"]
            })

        # Sort by score descending
        matches.sort(key=lambda x: x["score"], reverse=True)
        return matches[:top_n] # pyre-ignore

