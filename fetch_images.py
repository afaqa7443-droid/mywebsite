import json
import urllib.request
import os
import time

phones = [
    ("iPhone 14 Pro", 1),
    ("Samsung Galaxy S23", 2), 
    ("iPhone 13 Pro", 3),
    ("Samsung Galaxy S22", 4), 
    ("iPhone 12", 5),
    ("Samsung Galaxy Z Fold 4", 6),
    ("OnePlus 11", 7),
    ("Pixel 7", 8), 
    ("OnePlus 10 Pro", 9),
    ("Pixel 6", 10), 
    ("OnePlus 9", 11),
    ("Pixel 8", 12) 
]

os.makedirs("assets", exist_ok=True)
opener = urllib.request.build_opener()
opener.addheaders = [('User-Agent', 'MyStoreApp/1.0 (test@example.com)')]
urllib.request.install_opener(opener)

def get_wiki_image(title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=pageimages&format=json&pithumbsize=600"
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
            pages = data['query']['pages']
            for page_id in pages:
                if 'thumbnail' in pages[page_id]:
                    return pages[page_id]['thumbnail']['source']
    except Exception as e:
        print(f"Error fetching wiki for {title}: {e}")
    return None

for title, pid in phones:
    img_url = get_wiki_image(title)
    if img_url:
        print(f"Downloading {title} from {img_url}")
        try:
            with urllib.request.urlopen(img_url) as response, open(f"assets/phone_{pid}.jpg", "wb") as f:
                f.write(response.read())
        except Exception as e:
            print(f"Failed to download {img_url}: {e}")
    else:
        # fallback search
        print(f"No image found for {title}")
    time.sleep(2)

print("Done")
