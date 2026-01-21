---
title: "Shanghai Map Poster"
date: 2026-01-21T13:30:00+08:00
draft: false
tags: ["shanghai", "maps", "python", "maptoposter"]
---

# Create a Minimalist Map of Shanghai

Transform Shanghai's streets into a beautiful, minimalist design using the [maptoposter](https://github.com/originalankur/maptoposter) tool.

## How to Generate

First, clone the repository and install the requirements:

```bash
git clone https://github.com/originalankur/maptoposter.git
cd maptoposter
pip install -r requirements.txt
```

Then, run this command to generate a stunning "Noir" themed map of Shanghai:

```bash
python create_map_poster.py --city "Shanghai" --country "China" --theme "noir" --distance 12000
```

## Other Themes to Try

You can experiment with different themes to match your aesthetic:

*   **Midnight Blue**: `python create_map_poster.py --city "Shanghai" --country "China" --theme "midnight_blue"`
*   **Terracotta**: `python create_map_poster.py --city "Shanghai" --country "China" --theme "terracotta"`
*   **Blueprint**: `python create_map_poster.py --city "Shanghai" --country "China" --theme "blueprint"`

Enjoy your new map poster!
