import urllib.request
import json

url = "https://nominatim.openstreetmap.org/search?format=json&q=hospital+near+New+Delhi&limit=10"
headers = {'User-Agent': 'DrGlanceApp/2.0 (contact: info@drglance.org)'}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as res:
        data = json.loads(res.read().decode('utf-8'))
        print(f"Nominatim found {len(data)} locations:")
        for item in data[:6]:
            print("-", item.get('display_name')[:80], "|", item.get('lat'), item.get('lon'))
except Exception as e:
    print("Error:", e)
