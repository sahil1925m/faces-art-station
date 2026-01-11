"""
F.A.C.E.S. AI Services - Replicate HTTP API Version
Uses Replicate's stable-diffusion-inpainting via HTTP API (no SDK needed).
Works with Python 3.14+.
"""

from PIL import Image, ImageFilter, ImageDraw
import io
import base64
import os
import time
import httpx
from dotenv import load_dotenv

# Load environment variables from parent directory (project root)
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(env_path)

# Check for Replicate API token
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN", "")
HAS_REPLICATE = bool(REPLICATE_API_TOKEN) and REPLICATE_API_TOKEN != "YOUR_REPLICATE_API_TOKEN_HERE"

if HAS_REPLICATE:
    print(f"Replicate API configured (HTTP mode) - Token: {REPLICATE_API_TOKEN[:10]}...")
else:
    print("Warning: REPLICATE_API_TOKEN not set. Get one free at https://replicate.com/account/api-tokens")


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
            mask_path = os.path.join(self.masks_dir, mask_file)
            if os.path.exists(mask_path):
                print(f"Using pre-made mask: {mask_file}")
                mask = Image.open(mask_path).convert("L")
                mask = mask.resize(image.size, Image.LANCZOS)
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


class DigitalSurgeon:
    """
    Component C: The Surgeon
    Uses Replicate's HTTP API for stable-diffusion-inpainting.
    No SDK needed - works with Python 3.14+.
    """
    
    REPLICATE_API_URL = "https://api.replicate.com/v1/predictions"
    # SD 1.5 Inpainting (Standard)
    INPAINT_MODEL_VERSION = "95b7223104132402a9ae91cc677285bc5eb997834bd2349fa486f53910fd5952"
    # SDXL Inpainting (Nuclear Option)
    SDXL_INPAINT_MODEL_VERSION = "e3332d725651c6c52994e77227d81a98604313054f195d249f3e5f2a96996d93"
    
    def __init__(self):
        self.api_token = REPLICATE_API_TOKEN
        self.has_api = HAS_REPLICATE
        if self.has_api:
            print("DigitalSurgeon initialized (Replicate HTTP API mode)")
        else:
            print("DigitalSurgeon in fallback mode (no API token)")

    def _image_to_data_uri(self, image: Image.Image) -> str:
        """Convert PIL Image to data URI."""
        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{b64}"

    def inpaint(self, image: Image.Image, mask: Image.Image, 
                prompt: str, negative_prompt: str = "", 
                strength: float = 0.85,
                guidance_scale: float = 7.5,
                num_inference_steps: int = 25,
                mask_blur: int = 0,
                model_type: str = "standard") -> Image.Image:
        """Perform inpainting using Replicate HTTP API."""
        if not self.has_api:
            return self._fallback_inpaint(image, mask, prompt)
        
        try:
            print(f"[Replicate] Inpainting ({model_type}): {prompt[:50]}...")
            
            # Prepare images
            # For SDXL, 1024x1024 is native, but 512x512 might be faster/cheaper.
            # However, SDXL works better at higher res.
            # Let's target 768x768 for SDXL if possible, or 512x512 for standard.
            
            target_size = (1024, 1024) if model_type == "sdxl" else (512, 512)
            
            original_size = image.size
            img_resized = image.resize(target_size, Image.LANCZOS)
            mask_resized = mask.resize(target_size, Image.LANCZOS)
            
            # Convert to data URIs
            image_uri = self._image_to_data_uri(img_resized)
            mask_uri = self._image_to_data_uri(mask_resized.convert("RGB"))
            
            # Build prompts
            if model_type == "sdxl":
                 # SDXL handles natural language well, we passed the full prompt from main.py
                 full_prompt = prompt
                 full_negative = negative_prompt
                 current_version = self.SDXL_INPAINT_MODEL_VERSION
                 
                 # SDXL Params
                 input_payload = {
                    "image": image_uri,
                    "mask": mask_uri,
                    "prompt": full_prompt,
                    "negative_prompt": full_negative,
                    "prompt_strength": strength, # 1.0 for nuclear
                    "num_inference_steps": num_inference_steps,
                    "guidance_scale": guidance_scale,
                    "mask_blur": mask_blur,
                    "condition_scale": 0.5 # As per nuclear instructions (if supported by this endpoint vars)
                 }
            else:
                current_version = self.INPAINT_MODEL_VERSION
                full_prompt = f"high quality forensic sketch, pencil drawing, {prompt}, detailed, professional composite sketch"
                full_negative = f"bad anatomy, blurry, color, photo, realistic, deformed, {negative_prompt}"
                
                input_payload = {
                    "image": image_uri,
                    "mask": mask_uri,
                    "prompt": full_prompt,
                    "negative_prompt": full_negative,
                    "prompt_strength": strength,
                    "num_inference_steps": num_inference_steps,
                    "guidance_scale": guidance_scale,
                }
            
            # Create prediction via HTTP API
            headers = {
                "Authorization": f"Token {self.api_token}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "version": current_version,
                "input": input_payload
            }
            
            with httpx.Client(timeout=120.0) as client:
                # Start prediction
                response = client.post(self.REPLICATE_API_URL, headers=headers, json=payload)
                
                if response.status_code != 201:
                    print(f"[Replicate] API error: {response.status_code} - {response.text[:200]}")
                    return self._fallback_inpaint(image, mask, prompt)
                
                prediction = response.json()
                prediction_url = prediction.get("urls", {}).get("get")
                
                if not prediction_url:
                    print("[Replicate] No prediction URL returned")
                    return self._fallback_inpaint(image, mask, prompt)
                
                # Poll for completion
                print("[Replicate] Waiting for generation...")
                for _ in range(60):  # Max 60 seconds
                    time.sleep(1)
                    status_response = client.get(prediction_url, headers=headers)
                    
                    if status_response.status_code != 200:
                        continue
                    
                    status_data = status_response.json()
                    status = status_data.get("status")
                    
                    if status == "succeeded":
                        output = status_data.get("output")
                        if output and len(output) > 0:
                            result_url = output[0]
                            print(f"[Replicate] Success! Downloading result...")
                            
                            # Download result image
                            img_response = client.get(result_url)
                            if img_response.status_code == 200:
                                result_image = Image.open(io.BytesIO(img_response.content))
                                # CRITICAL: Convert to grayscale to match sketch style
                                result_image = result_image.convert("L").convert("RGB")
                                result_image = result_image.resize(original_size, Image.LANCZOS)
                                print("[Replicate] Inpainting complete!")
                                return result_image
                        break
                    
                    elif status == "failed":
                        error = status_data.get("error", "Unknown error")
                        print(f"[Replicate] Generation failed: {error}")
                        break
                
                print("[Replicate] Timeout or no output, using fallback")
                return self._fallback_inpaint(image, mask, prompt)
            
        except Exception as e:
            print(f"[Replicate] Error: {e}")
            return self._fallback_inpaint(image, mask, prompt)

    def _fallback_inpaint(self, image: Image.Image, mask: Image.Image, prompt: str) -> Image.Image:
        """
        Fallback: Use Pollinations API for image generation when Replicate fails.
        This generates a new sketch incorporating the requested changes.
        """
        print(f"[Fallback] Using Pollinations API for: {prompt[:50]}...")
        
        try:
            import urllib.parse
            
            # Build a forensic sketch prompt
            full_prompt = f"forensic sketch, pencil drawing, black and white, high contrast, detailed shading, front view portrait, {prompt}"
            encoded_prompt = urllib.parse.quote(full_prompt)
            
            # Generate a deterministic seed from the original image for consistency
            import hashlib
            img_bytes = io.BytesIO()
            image.save(img_bytes, format="PNG")
            img_hash = hashlib.md5(img_bytes.getvalue()).hexdigest()
            seed = int(img_hash[:8], 16) % 1000000
            
            pollinations_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?seed={seed}&nologo=true"
            
            print(f"[Fallback] Requesting from Pollinations...")
            
            with httpx.Client(timeout=60.0) as client:
                response = client.get(pollinations_url)
                
                if response.status_code == 200:
                    result_image = Image.open(io.BytesIO(response.content))
                    result_image = result_image.convert("L").convert("RGB")  # Grayscale for sketch style
                    result_image = result_image.resize(image.size, Image.LANCZOS)
                    print(f"[Fallback] Pollinations generation successful!")
                    return result_image
                else:
                    print(f"[Fallback] Pollinations failed: {response.status_code}")
                    
        except Exception as e:
            print(f"[Fallback] Pollinations error: {e}")
        
        # Ultimate fallback: return original image unchanged
        print(f"[Fallback] All methods failed, returning original image")
        return image


class BiometricEncoder:
    """Component for encoding faces into vectors for database matching."""
    
    def __init__(self):
        print("BiometricEncoder initialized (hash-based mode)")
        
    def encode(self, image: Image.Image) -> list[float]:
        """Generate a feature vector for the face image."""
        import hashlib
        import random
        
        small = image.resize((32, 32)).convert("L")
        pixels = list(small.getdata())
        
        pixel_hash = hashlib.md5(bytes(pixels)).hexdigest()
        seed = int(pixel_hash[:8], 16)
        random.seed(seed)
        
        vector = [random.gauss(0, 1) for _ in range(512)]
        magnitude = sum(x**2 for x in vector) ** 0.5
        vector = [x / magnitude for x in vector]
        
        return vector
