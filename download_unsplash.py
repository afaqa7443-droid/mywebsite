import urllib.request
import os

images = {
    1: "https://images.unsplash.com/photo-1605236453806-6ff3685e2ca7?w=500&q=80",  # iPhone approx
    2: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80",  # Samsung approx
    3: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&q=80",  # iPhone 13 approx
    4: "https://images.unsplash.com/photo-1644917415843-157d6da0151c?w=500&q=80",  # Samsung approx
    5: "https://images.unsplash.com/photo-1605170439002-90845e8c0137?w=500&q=80",  # iPhone 12 approx
    6: "https://images.unsplash.com/photo-1632311681283-9bd138f65cc9?w=500&q=80",  # Fold approx
    7: "https://images.unsplash.com/photo-1681313797078-43d9943ff7eb?w=500&q=80",  # OnePlus approx
    8: "https://images.unsplash.com/photo-1671391910540-36a5c1a17957?w=500&q=80",  # Pixel approx
    9: "https://images.unsplash.com/photo-1647468139535-c3359d3aa474?w=500&q=80",  # OnePlus approx
    10: "https://images.unsplash.com/photo-1635870723802-e88d72aea6af?w=500&q=80", # Pixel approx
    11: "https://images.unsplash.com/photo-1617260591522-8d7d91e60ad3?w=500&q=80", # OnePlus approx
    12: "https://images.unsplash.com/photo-1696515152069-b3a6d9fa247e?w=500&q=80"  # Pixel approx
}

os.makedirs("assets", exist_ok=True)

for pid, url in images.items():
    print(f"Downloading {pid}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            with open(f"assets/phone_{pid}.jpg", "wb") as f:
                f.write(response.read())
    except Exception as e:
        print(f"Failed {pid}: {e}")

print("Done")
