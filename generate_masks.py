"""
Generate simple regional masks for inpainting.
These are "dumb masks" - simple shapes covering facial regions.
"""
from PIL import Image, ImageDraw

def create_masks(size=(512, 512)):
    w, h = size
    
    # 1. Top half mask (for eyebrows, forehead, hair)
    top_mask = Image.new("RGB", size, (0, 0, 0))
    draw = ImageDraw.Draw(top_mask)
    draw.rectangle([0, 0, w, h * 0.45], fill=(255, 255, 255))
    top_mask.save("public/masks/top_half_mask.png")
    print("Created: public/masks/top_half_mask.png")
    
    # 2. Bottom half mask (for jaw, mouth, chin)
    bottom_mask = Image.new("RGB", size, (0, 0, 0))
    draw = ImageDraw.Draw(bottom_mask)
    draw.rectangle([0, h * 0.55, w, h], fill=(255, 255, 255))
    bottom_mask.save("public/masks/bottom_half_mask.png")
    print("Created: public/masks/bottom_half_mask.png")
    
    # 3. Eyes region mask
    eyes_mask = Image.new("RGB", size, (0, 0, 0))
    draw = ImageDraw.Draw(eyes_mask)
    draw.rectangle([w * 0.1, h * 0.28, w * 0.9, h * 0.45], fill=(255, 255, 255))
    eyes_mask.save("public/masks/eyes_mask.png")
    print("Created: public/masks/eyes_mask.png")
    
    # 4. Nose region mask
    nose_mask = Image.new("RGB", size, (0, 0, 0))
    draw = ImageDraw.Draw(nose_mask)
    draw.ellipse([w * 0.3, h * 0.35, w * 0.7, h * 0.65], fill=(255, 255, 255))
    nose_mask.save("public/masks/nose_mask.png")
    print("Created: public/masks/nose_mask.png")
    
    # 5. Mouth region mask
    mouth_mask = Image.new("RGB", size, (0, 0, 0))
    draw = ImageDraw.Draw(mouth_mask)
    draw.ellipse([w * 0.25, h * 0.6, w * 0.75, h * 0.85], fill=(255, 255, 255))
    mouth_mask.save("public/masks/mouth_mask.png")
    print("Created: public/masks/mouth_mask.png")
    
    # 6. Full face mask (for skin texture, age)
    face_mask = Image.new("RGB", size, (0, 0, 0))
    draw = ImageDraw.Draw(face_mask)
    draw.ellipse([w * 0.15, h * 0.1, w * 0.85, h * 0.9], fill=(255, 255, 255))
    face_mask.save("public/masks/face_mask.png")
    print("Created: public/masks/face_mask.png")
    
    # 7. Hair region mask (top + sides, extending beyond head)
    hair_mask = Image.new("RGB", size, (0, 0, 0))
    draw = ImageDraw.Draw(hair_mask)
    # Top dome
    draw.ellipse([w * 0.05, -h * 0.2, w * 0.95, h * 0.5], fill=(255, 255, 255))
    # Left side
    draw.rectangle([0, h * 0.1, w * 0.2, h * 0.6], fill=(255, 255, 255))
    # Right side
    draw.rectangle([w * 0.8, h * 0.1, w, h * 0.6], fill=(255, 255, 255))
    hair_mask.save("public/masks/hair_mask.png")
    print("Created: public/masks/hair_mask.png")
    
    print("\nAll masks created successfully!")

if __name__ == "__main__":
    create_masks()
