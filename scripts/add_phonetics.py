import os
import re
import glob
import json
import urllib.request
import urllib.parse
import time

def get_ipa(word):
    word = word.strip()
    # Cache
    if not hasattr(get_ipa, 'cache'):
        get_ipa.cache = {}
        if os.path.exists('ipa_cache.json'):
            with open('ipa_cache.json', 'r', encoding='utf-8') as f:
                get_ipa.cache = json.load(f)
                
    if word in get_ipa.cache:
        return get_ipa.cache[word]
        
    url = 'https://api.datamuse.com/words?sp=' + urllib.parse.quote(word) + '&md=r&ipa=1'
    try:
        res = urllib.request.urlopen(url)
        data = json.loads(res.read())
        if data:
            tags = data[0].get('tags', [])
            for t in tags:
                if t.startswith('ipa_pron:'):
                    ipa = t.split(':', 1)[1]
                    get_ipa.cache[word] = ipa
                    # Save cache
                    with open('ipa_cache.json', 'w', encoding='utf-8') as f:
                        json.dump(get_ipa.cache, f, ensure_ascii=False)
                    time.sleep(0.1) # Be nice to API
                    return ipa
    except Exception as e:
        print(f"Error fetching IPA for {word}: {e}")
        
    get_ipa.cache[word] = ""
    return ""

def process_file(filepath):
    print(f"Processing {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    changed = False
    for i, line in enumerate(lines):
        # Match lines like "### `word`"
        m = re.match(r"^###\s+`([^`]+)`\s*$", line)
        if m:
            word = m.group(1)
            ipa = get_ipa(word)
            if ipa:
                lines[i] = f"### `{word}` /{ipa}/\n"
                changed = True
                print(f"  Added /{ipa}/ to {word}")
            else:
                print(f"  No IPA found for {word}")
                
    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
            
def main():
    files = glob.glob('content/aquas-field/mysterious-sea-area/merriam-vocab/unit-0[123456].md')
    for f in sorted(files):
        process_file(f)

if __name__ == '__main__':
    main()
