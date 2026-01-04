# AQUA IN JAR

![Hugo](https://img.shields.io/badge/Hugo-0.139.4-ff4088?logo=hugo)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Production-success)

A premium personal blog and interactive web experience built with Hugo, featuring dynamic weather integration, daily puzzles, habit tracking, and content management.

🌐 **Live Site:** https://Atikri.github.io/AQUA-IN-JAR/

---

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Interactive Features](#interactive-features)
- [Configuration](#configuration)
- [Known Issues](#known-issues)
- [Contributing](#contributing)
- [Documentation](#documentation)

---

## ✨ Features

### Content Management
- 📝 **Rich Markdown Support:** Enhanced with custom shortcodes
- 🎨 **Dark/Light Mode:** Automatic theme switching with manual override
- 📱 **Fully Responsive:** Mobile-first design
- 🔍 **Full-Text Search:** Fast client-side search across all content
- 📊 **Table of Contents:** Auto-generated, collapsible navigation

### Interactive Tools
- 🌤️ **Weather Widget:** Real-time weather with location-based BGM
- 🧩 **Daily Puzzles:** Tents & Trees, Bridges logic games
- ✅ **Habit Tracker:** Visual progress tracking with persistence
- 📝 **Todo List:** Task management with local storage
- ⏱️ **Pomodoro Timer:** Productivity timer with audio cues
- 💰 **Money Tracker:** Personal finance tracking

### Social & Engagement
- ❤️ **Like System:** Powered by Supabase, real-time counts
- 💬 **Comment System:** Article-specific discussions
- 📅 **Content Calendar:** Visual content timeline

### Performance
- ⚡ **Lazy Loading:** Images and heavy content
- 🎯 **Asset Fingerprinting:** Cache-friendly builds
- 📦 **Minification:** CSS/JS optimization in production
- 🔒 **Subresource Integrity:** Security for external resources

---

## 🚀 Quick Start

### Prerequisites
- **Hugo Extended** v0.139.4 or later
- **Git** for version control
- **(Optional)** Node.js for development tools

### Installation

```bash
# Clone the repository
git clone https://github.com/Atikri/AQUA-IN-JAR.git
cd AQUA-IN-JAR

# Start local development server
hugo server -D

# Open browser to http://localhost:1313
```

### First-Time Setup

```bash
# Install Hugo (Windows with Chocolatey)
choco install hugo-extended

# Install Hugo (macOS with Homebrew)
brew install hugo

# Install Hugo (Linux)
# Download from https://github.com/gohugoio/hugo/releases
```

---

## 📁 Project Structure

```
AQUA-IN-JAR/
├── .github/workflows/      # CI/CD automation
│   └── hugo.yml           # GitHub Pages deployment
├── assets/                # Hugo asset pipeline
│   ├── css/
│   │   ├── custom.css     # Site-wide custom styles
│   │   └── toc-drawer.css # Table of contents styles
│   └── js/                # (Future: modular JS)
├── content/               # All site content
│   ├── _index.md         # Homepage
│   ├── aquas-field/      # Main content section
│   │   ├── daily/        # Daily notes
│   │   ├── reading-notes/# Book summaries
│   │   └── recipe/       # Recipes
│   ├── toolbox/          # Interactive tools
│   ├── Aquas-Game/       # Puzzle games
│   ├── notification-jar/ # About/Contact
│   ├── podcast-music/    # Audio content
│   └── shop/             # E-commerce
├── data/                 # Data files
│   ├── quotes.yaml       # Homepage quote carousel
│   ├── menu.yaml         # Navigation menus
│   └── calendar.json     # Content calendar
├── layouts/              # Custom templates
│   ├── _default/         # Base templates
│   │   └── baseof.html   # Main wrapper
│   ├── partials/         # Reusable components
│   │   ├── head.html     # <head> section
│   │   ├── header.html   # Site header
│   │   └── footer.html   # Site footer
│   ├── shortcodes/       # Custom shortcodes
│   │   ├── weather-widget.html
│   │   └── checklist-score.html
│   └── aquas-game/       # Game templates
│       └── single.html   # Game page layout
├── static/               # Direct-serve files
│   ├── audio/            # Music/sound effects
│   ├── css/              # Legacy/external CSS
│   ├── js/               # JavaScript modules
│   │   ├── checkbox-jelly.js
│   │   ├── weather-widget.js
│   │   ├── home-scripts.js
│   │   └── daily-puzzle/ # Game logic
│   └── images/           # Static images
├── themes/dario/         # Base Hugo theme
├── docs/                 # Built site (GitHub Pages)
├── hugo.yaml            # Main configuration
└── README.md            # This file
```

---

## 💻 Development

### Local Development

```bash
# Standard server
hugo server

# Include drafts
hugo server -D

# Bind to all interfaces (for testing on other devices)
hugo server --bind 0.0.0.0

# Disable live reload (for debugging)
hugo server --disableLiveReload
```

### Creating Content

#### New Blog Post
```bash
# Create new post
hugo new aquas-field/daily/my-new-post.md

# Edit content/aquas-field/daily/my-new-post.md
```

#### Front Matter Template
```yaml
---
date: '2026-01-04'
title: 'My Post Title'
description: 'Brief summary'
draft: false
tags: ['tag1', 'tag2']
categories: ['category']
---

Your content here...
```

### Testing Before Deploy

```bash
# Build for production
hugo --minify

# Check for broken links
hugo server --renderToDisk

# Validate HTML (requires external tool)
# npm install -g html-validator-cli
# html-validator --file=docs/index.html
```

---

## 🚢 Deployment

### Automatic Deployment (Current Setup)

The site auto-deploys via **GitHub Actions** on every push to `master`:

1. **Trigger:** Push to `master` branch
2. **Build:** GitHub Actions runs `hugo --minify`
3. **Deploy:** Built site (`docs/`) published to GitHub Pages
4. **URL:** https://Atikri.github.io/AQUA-IN-JAR/

### Manual Deployment

```bash
# Build site
hugo --minify -d docs

# Commit and push
git add docs/
git commit -m "Deploy: [description]"
git push origin master
```

### Deployment Checklist
- [ ] Test locally with `hugo server`
- [ ] Check for console errors in browser
- [ ] Verify search works on inner pages
- [ ] Test dark/light mode toggle
- [ ] Confirm interactive elements (checkboxes, weather, etc.)
- [ ] Review changelog/commit message

---

## 🎮 Interactive Features

### Weather Widget
**Location:** Homepage  
**API:** Open-Meteo (free, no auth required)  
**Features:**
- Auto-geolocation with fallback to Hong Kong
- Weather-themed background animations
- Curated music based on conditions
- 4-day forecast

**Files:**
- `layouts/shortcodes/weather-widget.html`
- `static/js/weather-widget.js`

### Daily Puzzles
**Location:** `/Aquas-Game/`  
**Games:**
- **Tents & Trees:** Logic puzzle with camping theme
- **Bridges:** Connect islands with bridge-building rules

**Files:**
- `layouts/aquas-game/single.html`
- `static/js/daily-puzzle/tents.js`
- `static/js/daily-puzzle/bridges.js`
- `static/js/daily-puzzle/rng.js` (seeded random generation)

### Habit Tracker
**Location:** `/toolbox/habit-tracker/`  
**Storage:** LocalStorage  
**Features:**
- Visual grid for daily completion
- Streak tracking
- Export data function

**File:** `static/js/habit-tracker.js`

### Like & Comment System
**Backend:** Supabase (PostgreSQL)  
**Features:**
- Real-time like counts
- Article-specific comments
- No user authentication (anonymous)

**Setup:**
1. Create Supabase project
2. Run SQL from `supabase-setup.sql`
3. Update `static/js/like-config.js` with API keys

**Files:**
- `static/js/like-config.js` (config)
- `static/js/like-button.js` (likes)
- `static/js/comments.js` (comments)
- `static/js/interactions.js` (orchestrator)

---

## ⚙️ Configuration

### Main Config: `hugo.yaml`

```yaml
baseURL: 'https://Atikri.github.io/AQUA-IN-JAR/'
languageCode: zh-CN
title: AQUA IN JAR
theme: dario
copyright: '© 2026 AQUA IN JAR'

params:
  googleAnalytics: GA_TRACKING_ID
  backtotop: /images/back-to-top.svg
  colorScheme: toggle  # 'light', 'dark', or 'toggle'
  disableSocialMeta: false
  disableFontPreload: false

mainSections:
  - aquas-field
  - toolbox
  - Aquas-Game

markup:
  goldmark:
    renderer:
      unsafe: true  # Allow raw HTML in markdown
  highlight:
    style: dracula
    lineNos: false
  tableOfContents:
    startLevel: 2
    endLevel: 4

enableEmoji: true
canonifyURLs: true
disablePathToLower: true
buildFuture: true
```

### Environment Variables

Create `.env` file (not committed) for sensitive data:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

Then reference in `like-config.js`.

---

## ⚠️ Known Issues

### Critical (Fix Before Deploy)

1. **Resource Path Errors** (`layouts/partials/head.html`)
   - Leading spaces in `relURL` calls cause 404s
   - **Impact:** Fonts, icons, CSS/JS fail to load
   - **Fix:** Remove spaces (see [CODE_AUDIT_REPORT.md](CODE_AUDIT_REPORT.md))

2. **Search Limited to Homepage**
   - Script only loads on `/` due to `.IsHome` condition
   - **Impact:** Search non-functional on inner pages
   - **Fix:** Remove conditional in `head.html` line 53

3. **Checkbox Animations Disabled**
   - `transition: none` in CSS blocks visual feedback
   - **Impact:** Checkboxes feel unresponsive
   - **Fix:** Replace with `transition: background 0.1s ease`

### Minor

4. **Weather Widget API Dependency**
   - No offline fallback if Open-Meteo is down
   - **Mitigation:** Add localStorage cache

5. **Checkbox-Jelly.js Conflicts**
   - JS creates duplicate DOM elements
   - Can cause phantom click areas
   - **Recommendation:** Migrate to Pure CSS implementation

**Full details:** [CODE_AUDIT_REPORT.md](CODE_AUDIT_REPORT.md)

---

## 🤝 Contributing

### Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make changes and test locally**
   ```bash
   hugo server -D
   ```

3. **Build and verify**
   ```bash
   hugo --minify
   ```

4. **Commit with descriptive message**
   ```bash
   git add .
   git commit -m "feat: add new interactive calendar"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/my-new-feature
   ```

### Code Style

- **HTML/Templates:** 2-space indentation
- **CSS:** BEM naming convention preferred
- **JavaScript:** ES6+, use `const`/`let`, avoid `var`
- **Comments:** Use Chinese for content, English for code

### Testing Checklist

- [ ] Works in Chrome, Firefox, Safari
- [ ] Responsive on mobile (< 768px)
- [ ] Dark mode tested
- [ ] No console errors
- [ ] Accessibility: keyboard navigation works

---

## 📚 Documentation

### Guides (in project root)
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Deploy to various platforms
- [HUGO_GITHUB_PAGES_COMPLETE_GUIDE.md](HUGO_GITHUB_PAGES_COMPLETE_GUIDE.md) - GitHub Pages setup
- [LIKE_FEATURE_SETUP.md](LIKE_FEATURE_SETUP.md) - Configure Supabase likes
- [LAZY_LOADING_GUIDE.md](LAZY_LOADING_GUIDE.md) - Optimize images
- [CODE_AUDIT_REPORT.md](CODE_AUDIT_REPORT.md) - **Current code quality assessment**

### External Resources
- [Hugo Documentation](https://gohugo.io/documentation/)
- [Dario Theme](https://github.com/gohugoio/hugoThemes) (base theme)
- [Open-Meteo API](https://open-meteo.com/en/docs)
- [Supabase Docs](https://supabase.com/docs)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **Hugo** - Static site generator
- **Dario Theme** - Base theme foundation
- **Open-Meteo** - Free weather API
- **Supabase** - Backend as a Service
- **GitHub Pages** - Free hosting

---

## 📬 Contact

- **Website:** https://Atikri.github.io/AQUA-IN-JAR/
- **GitHub:** https://github.com/Atikri/AQUA-IN-JAR
- **Issues:** https://github.com/Atikri/AQUA-IN-JAR/issues

---

**Last Updated:** 2026-01-04  
**Version:** 2.0 (Post Code Audit)
