import re
import os

images_map = {
    "1": "assets/phone_1.jpg",
    "2": "assets/phone_2.jpg",
    "3": "assets/phone_3.jpg",
    "4": "https://images.unsplash.com/photo-1644917415843-157d6da0151c?w=500&q=80",
    "5": "assets/phone_5.jpg",
    "6": "assets/phone_6.jpg",
    "7": "https://images.unsplash.com/photo-1681313797078-43d9943ff7eb?w=500&q=80",
    "8": "https://images.unsplash.com/photo-1671391910540-36a5c1a17957?w=500&q=80",
    "9": "https://images.unsplash.com/photo-1647468139535-c3359d3aa474?w=500&q=80",
    "10": "https://images.unsplash.com/photo-1635870723802-e88d72aea6af?w=500&q=80",
    "11": "assets/phone_11.jpg",
    "12": "https://images.unsplash.com/photo-1696515152069-b3a6d9fa247e?w=500&q=80"
}

specs_map = {
    "1": "Display: 6.7\" Super Retina XDR OLED|Processor: A16 Bionic|RAM/Storage: 6GB RAM, 256GB|Camera: 48MP Main, 12MP UW, 12MP Tele|Battery: 4323 mAh",
    "2": "Display: 6.8\" Dynamic AMOLED 2X|Processor: Snapdragon 8 Gen 2|RAM/Storage: 12GB RAM, 512GB|Camera: 200MP Main, 12MP UW, 10MP Tele|Battery: 5000 mAh",
    "3": "Display: 6.1\" Super Retina XDR OLED|Processor: A15 Bionic|RAM/Storage: 6GB RAM, 128GB|Camera: 12MP Main, 12MP UW, 12MP Tele|Battery: 3095 mAh",
    "4": "Display: 6.6\" Dynamic AMOLED 2X|Processor: Snapdragon 8 Gen 1|RAM/Storage: 8GB RAM, 256GB|Camera: 50MP Main, 12MP UW, 10MP Tele|Battery: 4500 mAh",
    "5": "Display: 6.1\" Super Retina XDR OLED|Processor: A14 Bionic|RAM/Storage: 4GB RAM, 64GB|Camera: 12MP Main, 12MP UW|Battery: 2815 mAh",
    "6": "Display: 7.6\" Foldable AMOLED|Processor: Snapdragon 8+ Gen 1|RAM/Storage: 12GB RAM, 512GB|Camera: 50MP Main, 12MP UW, 10MP Tele|Battery: 4400 mAh",
    "7": "Display: 6.7\" Fluid AMOLED|Processor: Snapdragon 8 Gen 2|RAM/Storage: 16GB RAM, 256GB|Camera: 50MP Main, 48MP UW, 32MP Tele|Battery: 5000 mAh",
    "8": "Display: 6.7\" LTPO AMOLED|Processor: Google Tensor G2|RAM/Storage: 12GB RAM, 128GB|Camera: 50MP Main, 12MP UW, 48MP Tele|Battery: 5000 mAh",
    "9": "Display: 6.7\" Fluid AMOLED|Processor: Snapdragon 8 Gen 1|RAM/Storage: 12GB RAM, 128GB|Camera: 48MP Main, 50MP UW, 8MP Tele|Battery: 5000 mAh",
    "10": "Display: 6.7\" LTPO AMOLED|Processor: Google Tensor|RAM/Storage: 12GB RAM, 128GB|Camera: 50MP Main, 12MP UW, 48MP Tele|Battery: 5003 mAh",
    "11": "Display: 6.55\" Fluid AMOLED|Processor: Snapdragon 888|RAM/Storage: 8GB RAM, 128GB|Camera: 48MP Main, 50MP UW, 2MP Mono|Battery: 4500 mAh",
    "12": "Display: 6.7\" LTPO OLED|Processor: Google Tensor G3|RAM/Storage: 12GB RAM, 128GB|Camera: 50MP Main, 48MP UW, 48MP Tele|Battery: 5050 mAh"
}

index_path = r"c:\Users\IT LAND\Desktop\mysite\index.html"
with open(index_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace data-img and src for each card, and inject data-specs right after data-desc
for pid, img_url in images_map.items():
    # Update data-img="..."
    pattern_data_img = re.compile(rf'(data-id="{pid}"\s+.*?data-img=)"([^"]*)"', re.DOTALL)
    content = pattern_data_img.sub(rf'\1"{img_url}"', content)
    
    # Update data-desc="..." with data-specs appended
    # First check if we already added data-specs
    if f'data-specs="{specs_map[pid]}"' not in content:
        pattern_data_desc = re.compile(rf'(data-id="{pid}"\s+.*?data-desc="[^"]*?")', re.DOTALL)
        content = pattern_data_desc.sub(rf'\1 data-specs="{specs_map[pid]}"', content)
    
    # Update the <img src="..." /> inside the same card block
    # Since regex is greedy, we need a careful approach.
    # We find the specific card block first
    card_pattern = re.compile(rf'(<!-- Card {pid} -->.*?)(</div>\s+<!-- Card)', re.DOTALL)
    # The last card might not have next <!-- Card ... so we just do a more precise replacement:
    
    def replace_img_src_in_card(match):
        block = match.group(0)
        # replace img src
        block = re.sub(r'<img\s+src="[^"]+"', f'<img src="{img_url}"', block, count=1) # replace only the main img
        return block

    card_start_regex = re.compile(rf'<div class="card"\s+[^>]*?data-id="{pid}".*?(?:<img\s+src="[^"]+")', re.DOTALL)
    
    def repl_img(m):
        full_match = m.group(0)
        new_match = re.sub(r'src="[^"]+"$', f'src="{img_url}"', full_match)
        return new_match
        
    content = card_start_regex.sub(repl_img, content)

# Write back
with open(index_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated index.html successfully")
