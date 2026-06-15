import json
import os

locales = ['en', 'fr', 'es', 'de', 'it', 'pt', 'nl', 'pl', 'ar', 'zh', 'ja']
base_locale = 'en'

def flatten_dict(d, parent_key='', sep='.'):
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)

data = {}
for loc in locales:
    try:
        with open(f"src/locales/{loc}.json", 'r') as f:
            data[loc] = flatten_dict(json.load(f))
    except Exception as e:
        print(f"Error loading {loc}: {e}")
        data[loc] = {}

en_keys = set(data['en'].keys())
print(f"Total keys in en.json: {len(en_keys)}")

print("| Locale | Total Keys | Missing Keys | Stub (Equal to EN) | Coverage % |")
print("|--------|------------|--------------|--------------------|------------|")

for loc in locales:
    if loc == 'en':
        print(f"| {loc} | {len(en_keys)} | 0 | 0 | 100.0% |")
        continue
    
    loc_keys = set(data[loc].keys())
    missing = en_keys - loc_keys
    
    stubs = 0
    for key in en_keys:
        if key in data[loc] and data[loc][key] == data['en'][key]:
            stubs += 1
            
    coverage = ((len(en_keys) - len(missing) - stubs) / len(en_keys)) * 100
    print(f"| {loc} | {len(en_keys)} | {len(missing)} | {stubs} | {coverage:.1f}% |")

