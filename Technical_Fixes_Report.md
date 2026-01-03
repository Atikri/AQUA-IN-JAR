---
title: "Technical Fixes Report: Header, Search & Quote Board"
date: 2026-01-03
description: "Documentation of fixes applied to resolve Swup integration issues, header unresponsiveness, and quote board failures."
---

# Technical Solutions & Code Changes

This document outlines the technical steps taken to resolve the issues with the **Search Bar**, **Status Bar (Header Controls)**, and **Quote Board** interactivity, particularly in the context of **Swup (Page Transition)** integration.

## 1. Issue: Unresponsive Search & Status Buttons
**Problem:** The Search, Theme Toggle, and Menu buttons stopped working after navigating to other pages, or sometimes failed on the homepage.
**Cause:** 
1. **Navigating Away:** Swup replaces the header, killing event listeners.
2. **Homepage:** Initialization scripts were running twice (once by `DOMContentLoaded` in script, once by `baseof.html`), causing toggle conflicts (turning on and immediately off).

### **Solution: Correct Initialization Lifecycle**
We updated `layouts/_default/baseof.html` to remove the redundant `DOMContentLoaded` listener for `initScripts`, relying on the scripts' own self-initialization for the first load, and using Swup hooks ONLY for subsequent navigations.

**Modified Code (`layouts/_default/baseof.html`):**

```javascript
// Swup Initialization
const swup = new Swup({
    containers: ["#swup", "#site-header", "#tocOverlay", "#toc-sidebar"]
});

function initScripts() {
    // Re-run initialization logic when Swup swaps content
    if (window.initAll) window.initAll();       // Theme/Settings
    if (window.initSearch) window.initSearch(); // Search
    if (window.initQuotes) window.initQuotes(); // Quote Board
    
    // ... TOC re-attachment logic ...
}

// REMOVED: document.addEventListener('DOMContentLoaded', initScripts); 
// (Scripts handle their own first load)

// Hook into Swup Events for page changes
swup.hooks.on('content:replace', initScripts);
```

## 2. Issue: Quote Board Alignment & Direction
**Problem:** The two rows of quotes scrolled in the same direction or stacked vertically.
**Cause:** Duplicate CSS definitions for `.marquee-track` were overriding the specific `.scroll-left` and `.scroll-right` animations.

### **Solution: CSS Cleanup**
We removed the conflicting CSS block at the end of `assets/css/custom.css` that enforced a single `animation` property for all tracks. Now, the specific classes control the direction.

**Key CSS (`assets/css/custom.css`):**
```css
.scroll-left {
  animation: scrollLeft 60s linear infinite;
}

.scroll-right {
  animation: scrollRight 65s linear infinite; /* Diff speed & direction */
}

@keyframes scrollLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes scrollRight {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
```

## 3. Issue: Quote Interaction (Click to Enlarge)
**Problem:** Clicking quotes did nothing.
**Cause:** The `home-scripts.js` file was failing to load due to a malformed URL (`src=" js/..."`), causing a 404 error. The initialization function `initQuotes` never ran.

### **Solution: Fix Script Path**
**Modified Code (`layouts/_default/baseof.html`):**
```html
<!-- Fixed path (removed leading space) -->
<script src="{{ "js/home-scripts.js" | relURL }}"></script>
```

## Summary
The system is now fully functional:
*   **Search/Theme:** Works on load and after navigation (single binding).
*   **Quote Board:** Scrolls left/right correctly, and clicks open the modal (scripts loaded).
*   **Layout:** Preserved (no disjointed gaps).
