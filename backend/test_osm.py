import urllib.request
import json

query = """[out:json][timeout:15];
(
  node["amenity"~"hospital|clinic|doctors"](around:8000, 28.6139, 77.2090);
  way["amenity"~"hospital|clinic|doctors"](around:8000, 28.6139, 77.2090);
);
out center 15;"""

headers = {
    'User-Agent': 'DrGlanceHealthcareApp/2.0 (health-monitoring-screening)',
    'Content-Type': 'application/x-www-form-urlencoded'
}

data = f"data={urllib.parse.quote(query)}".encode('utf-8')

try:
    req = urllib.request.Request("https://overpass-api.de/api/interpreter", data=data, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as response:
        result = json.loads(response.read().decode('utf-8'))
        elements = [e for e in result.get('elements', []) if 'tags' in e and 'name' in e['tags']]
        print(f"Total named facilities found: {len(elements)}")
        for e in elements[:10]:
            name = e['tags'].get('name')
            amenity = e['tags'].get('amenity')
            phone = e['tags'].get('phone') or e['tags'].get('contact:phone') or 'Not listed'
            addr = e['tags'].get('addr:street') or e['tags'].get('addr:full') or 'Local area'
            print(f"- {name} ({amenity}) | Phone: {phone} | {addr}")
except Exception as ex:
    print("Error:", ex)
