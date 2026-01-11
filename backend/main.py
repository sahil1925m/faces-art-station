from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
from PIL import Image
import io
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_services import FaceIdentifier, DigitalSurgeon, BiometricEncoder

app = FastAPI(title="F.A.C.E.S. Refinement API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Initializing Surgical Refinement Architecture...")
try:
    identifier = FaceIdentifier()
    surgeon = DigitalSurgeon()
    encoder = BiometricEncoder()
    print("Surgical units ready.")
except Exception as e:
    print(f"Critical Error initializing AI services: {e}")
    identifier = None
    surgeon = None
    encoder = None

class RefinementResponse(BaseModel):
    image: str
    message: str
    debug_mask: str | None = None

@app.get("/")
def read_root():
    return {"status": "online", "service": "F.A.C.E.S. Surgical Refinement API"}


# The "Nose Dictionary" - precise prompts for surgical refinement (Nuclear/SDXL optimized)
NOSE_PROMPTS = {
    "button": "Short, small, upturned button nose with round tip",
    "hooked": "Prominent aquiline nose, hooked shape, dorsal hump, downward tip",
    "aquiline": "Prominent aquiline nose, hooked shape, dorsal hump, downward tip",
    "wide": "Broad, flat nose, wide nostrils, low nose bridge",
    "broad": "Broad, flat nose, wide nostrils, low nose bridge",
    "straight": "Perfectly straight, narrow nose bridge, symmetrical",
    "snub": "Small, short snub nose, slightly upturned",
    "hawk": "Sharp, angular hawk-like nose",
    "pointed": "Sharp, pointed nose with defined structure"
}

@app.post("/api/refine-feature", response_model=RefinementResponse)
async def refine_feature(
    image: str = Form(...),
    feature_name: str = Form(...),
    refinement_prompt: str = Form(...)
):
    try:
        if identifier is None or surgeon is None:
             raise HTTPException(status_code=503, detail="AI Services unavailable")

        print(f"Received surgical request: {feature_name} -> {refinement_prompt}")
        
        # 1. Decode Image
        try:
            if "base64," in image:
                image_data = base64.b64decode(image.split("base64,")[1])
            else:
                image_data = base64.b64decode(image)
                
            original_image = Image.open(io.BytesIO(image_data)).convert("RGB")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image data: {str(e)}")

        # 2. Step 1: The "Identifier" (Masking)
        print(f"Step 1: Identifying target area for '{feature_name}'...")
        # Use simple fallback strategy which now includes the 'Nose Box' logic
        mask = identifier.get_mask(original_image, feature_name, strategy="auto")
        
        # 3. Post-Process Mask
        processed_mask = identifier.process_mask(mask)

        # 4. Step 2: The "Surgeon" (Inpainting)
        print(f"Step 2: Performing refinement...")
        
        lower_prompt = refinement_prompt.lower()
        feature_lower = feature_name.lower()
        
        # --- LOGIC BRANCHES ---
        
        # Branch A: Surgical Nose Job
        if "nose" in feature_lower:
            print(">>> ACTIVATING NUCLEAR SURGICAL NOSE JOB PIPELINE (SDXL) <<<")
            
            # Check if user selected one of our preset styles
            base_prompt = refinement_prompt # Default to what they sent
            
            # Map known styles
            for style, style_prompt in NOSE_PROMPTS.items():
                if style in lower_prompt or style in feature_lower:
                    base_prompt = style_prompt
                    break
            
            # SDXL Specific Prompting (2D Flat Art Style)
            actual_prompt = f"Macro view of a {base_prompt}, 2D flat line art, clean contour drawing, minimal shading, high contrast, monochrome, technical illustration style"
            negative_prompt = "color, realistic, photo, blur, double nose, painting, 3d render, deformed, anatomy error, rough sketch, heavy shading, gradients"
            
            # CRITICAL NUCLEAR PARAMETERS
            strength_val = 1.0  # COMPLETE DESTRUCTION of old pixels
            guidance_scale_val = 15.0 # Force AI to listen
            steps_val = 50 # Higher quality
            mask_blur_val = 5
            model_type_val = "sdxl" # Signal to use SDXL

        # Branch B: Removal (Beards, glasses, etc.)
        elif any(k in lower_prompt for k in ["remove", "without", "no ", "delete", "gone", "clean-shaven", "bare face"]):
            print(f"Detected REMOVAL intent for: {feature_name}")
            actual_prompt = "natural smooth skin texture, clean face, detailed, seamless blending, no facial hair"
            negative_prompt = f"beard, mustache, moustache, stubble, facial hair, {feature_name}, distortion, unnatural"
            strength_val = 0.90
            guidance_scale_val = 7.5
            steps_val = 25
            mask_blur_val = 0
            model_type_val = "standard"
            
        # Branch C: Hair (Needs volume)
        elif feature_lower in ["hair", "hairstyle", "hairStyle"] or "hair" in lower_prompt:
            print(f"Detected HAIRSTYLE modification")
            actual_prompt = f"{refinement_prompt}. Draw this hairstyle extending OUTWARDS beyond the current head shape. High quality forensic sketch."
            negative_prompt = "bald, half-bald, receding hairline, thin hair, low quality"
            strength_val = 0.95
            guidance_scale_val = 7.5
            steps_val = 25
            mask_blur_val = 0
            model_type_val = "standard"
            
        # Branch D: Standard Refinement
        else:
            print("Standard refinement pipeline")
            actual_prompt = refinement_prompt
            negative_prompt = "blur, low quality, distortion, artifacts"
            strength_val = 0.85
            guidance_scale_val = 7.5
            steps_val = 25
            mask_blur_val = 0
            model_type_val = "standard"

        result_image = surgeon.inpaint(
            image=original_image,
            mask=processed_mask,
            prompt=actual_prompt,
            negative_prompt=negative_prompt,
            strength=strength_val,
            guidance_scale=guidance_scale_val,
            num_inference_steps=steps_val,
            mask_blur=mask_blur_val,
            model_type=model_type_val
        )

        # 5. Encode Response
        buffered = io.BytesIO()
        result_image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        # Encode Mask for Debugging
        mask_buffered = io.BytesIO()
        processed_mask.save(mask_buffered, format="PNG")
        mask_str = base64.b64encode(mask_buffered.getvalue()).decode("utf-8")
        
        return {
            "image": f"data:image/png;base64,{img_str}",
            "message": f"Successfully refined {feature_name}",
            "debug_mask": f"data:image/png;base64,{mask_str}"
        }

    except Exception as e:
        print(f"Refinement Error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal processing error: {str(e)}")

@app.post("/api/search-database")
async def search_database(image: str = Form(...)):
    try:
        if encoder is None:
             import random
             return {"matches": [{"suspectId": "mock-1", "score": 0.95, "mugshotUrl": "...", "metadata": {"name": "Simulated Match"}}]}

        try:
            if "base64," in image:
                image_data = base64.b64decode(image.split("base64,")[1])
            else:
                image_data = base64.b64decode(image)
            original_image = Image.open(io.BytesIO(image_data)).convert("RGB")
        except Exception as e:
            raise HTTPException(status_code=400, detail="Invalid image data")

        vector = encoder.encode(original_image)
        print(f"Generated vector of length {len(vector)}. Searching database...")
        
        return {
            "matches": [
                {
                    "suspectId": "S-29402", 
                    "similarityScore": 0.92, 
                    "mugshotUrl": "https://randomuser.me/api/portraits/men/32.jpg",
                    "metadata": { "name": "Older Brother", "offense": "Theft" }
                },
                 {
                    "suspectId": "S-99120", 
                    "similarityScore": 0.78, 
                    "mugshotUrl": "https://randomuser.me/api/portraits/men/45.jpg",
                    "metadata": { "name": "Random Bystander", "offense": "None" }
                }
            ]
        }
            
    except Exception as e:
        print(f"Search Error: {e}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.post("/api/tts")
async def text_to_speech(text: str = Form(...)):
    print(f"TTS Request: {text}")
    try:
        ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
        if not ELEVENLABS_API_KEY:
             print("Warning: ELEVENLABS_API_KEY not set. Using mock audio.")
             # Return a mock audio response or error? For now, let's error so we know to set the key.
             # Or better, fallback to browser TTS if backend fails?
             # transformation: Frontend handles fallback if backend returns 500?
             raise HTTPException(status_code=500, detail="ElevenLabs API Key missing")

        url = "https://api.elevenlabs.io/v1/text-to-speech/nPczCjzI2devNBz1zQrb" # Declan ID (or similar deep voice)
        
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY
        }
        
        data = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        }

        import requests
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code != 200:
            print(f"ElevenLabs Error: {response.text}")
            raise HTTPException(status_code=response.status_code, detail="TTS generation failed")

        # Encode audio to base64 to send back JSON (or stream binary)
        # For simplicity with current setup, let's return base64
        audio_base64 = base64.b64encode(response.content).decode('utf-8')
        
        return {"audio": f"data:audio/mpeg;base64,{audio_base64}"}

    except Exception as e:
        print(f"TTS Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
