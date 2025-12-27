import re

file_path = '/Users/equus/Desktop/snd/Mindforge/20_Projects/21_Active_Sprint/21_Scale_Recommender_App/data/handpan-data/scales.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

errors = []
own_url_count = 0
smart_store_count = 0

for i, line in enumerate(lines):
    line_num = i + 1
    stripped = line.strip()
    
    if 'ownUrl:' in stripped:
        own_url_count += 1
        if 'smartstore.naver.com' in stripped:
            smart_store_count += 1
            errors.append(f"Line {line_num}: ownUrl points to Smart Store! {stripped}")
        
        # Check for comma
        if not stripped.endswith(','):
            # It might be valid if it's the last property, but ownUrlEn should follow
            # Check next line
            if i + 1 < len(lines):
                 next_line = lines[i+1].strip()
                 if not next_line.startswith('ownUrlEn:') and not next_line.startswith('}'):
                     errors.append(f"Line {line_num}: ownUrl missing comma? {stripped}")

    if 'ownUrlEn:' in stripped:
        if 'smartstore.naver.com' in stripped:
             errors.append(f"Line {line_num}: ownUrlEn points to Smart Store! {stripped}")

print(f"Total ownUrl found: {own_url_count}")
print(f"Total Smart Store in ownUrl: {smart_store_count}")

if errors:
    print("Errors found:")
    for e in errors:
        print(e)
else:
    print("No obvious data errors found.")
