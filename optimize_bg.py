import os
import requests
from PIL import Image
from io import BytesIO

url = "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/ruixen_moon_2.png"
output_dir = "public/backgrounds"
output_filename = "home-bg.webp"
output_path = os.path.join(output_dir, output_filename)

try:
    print(f"Downloading {url}...")
    response = requests.get(url)
    response.raise_for_status()
    
    img = Image.open(BytesIO(response.content))
    print(f"Original size: {img.size}, Format: {img.format}")
    
    # Resize if too large (e.g. width > 1920)
    if img.width > 1920:
        ratio = 1920 / img.width
        new_height = int(img.height * ratio)
        img = img.resize((1920, new_height), Image.Resampling.LANCZOS)
        print(f"Resized to: {img.size}")
        
    # Save as WebP
    print(f"Saving to {output_path}...")
    img.save(output_path, "WEBP", quality=80)
    print("Optimization complete!")
    
except Exception as e:
    print(f"Error: {e}")
