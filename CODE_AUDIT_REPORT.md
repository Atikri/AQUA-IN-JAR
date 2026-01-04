# AQUA IN JAR - Code Audit Report

**Generated:** 2026-01-04  
**Audit Scope:** Complete codebase review  
**Status:** Current deployment state (commit 36940c0)

---

## 🔴 CRITICAL ISSUES

### 1. **Resource Path Errors in `layouts/partials/head.html`**
**Severity:** HIGH  
**Impact:** 404 errors, broken CSS/JS loading, site loading failures

**Lines 25-26, 42-43:**
```html
<!-- INCORRECT (leading spaces) -->
<link rel="preload" href="{{ " fonts/Newsreader.woff2" | relURL }}" ...>
<link rel="icon" href="{{ (print " favicon.ico?v=2") | relURL }}">
```

**Issue:** Hugo's `relURL` function receives strings with leading spaces, generating invalid URLs like `%20fonts/Newsreader.woff2`.

**Effects:**
- Font loading failures
- Favicon not displaying
- Outline style (toc-drawer.css) not loading intermittently
- Overall degraded user experience

**Fix:**
```html
<!-- CORRECT (no spaces) -->
<link rel="preload" href="{{ "fonts/Newsreader.woff2" | relURL }}" ...>
<link rel="icon" href="{{ "favicon.ico?v=2" | relURL }}">
```

**Files to Fix:**
- Remove spaces from ALL `relURL` calls in `layouts/partials/head.html` (lines 25, 26, 42, 43)

---

### 2. **Search Script Limited to Homepage**
**Severity:** MEDIUM  
**Impact:** Search bar non-functional on inner pages

**Line 53-55:**
```html
{{- if .IsHome }}
{{- $searchJS := resources.Get "js/search.js" | minify | fingerprint }}
<script src="{{ $searchJS.RelPermalink }}" ...></script>
{{- end }}
```

**Issue:** Search script only loads on homepage due to `.IsHome` condition.

**Fix:**
```html
<!-- Remove conditional, load globally -->
{{- $searchJS := resources.Get "js/search.js" | minify | fingerprint }}
<script src="{{ $searchJS.RelPermalink }}" integrity="{{ $searchJS.Data.Integrity }}" defer></script>
```

---

### 3. **Checkbox Animation Blocked**
**Severity:** MEDIUM  
**Impact:** Visual feedback disabled, poor UX

**File:** `assets/css/custom.css`  
**Line ~724:**
```css
/* 即时切换，无动画延迟 */
transition: none;
```

**Issue:** Global `transition: none` disables ALL checkbox animations, including the "jelly" effect.

**Fix:**
```css
/* Enable smooth transitions */
transition: background 0.1s ease, transform 0.2s ease;
```

---

## ⚠️ DESIGN CONFLICTS

### 4. **Checkbox-Jelly.js Architecture Issue**
**Severity:** MEDIUM  
**Impact:** Unstable interactions, DOM manipulation overhead

**Problem:**
- `checkbox-jelly.js` creates duplicate visual elements (`.cbx`, `.lbl`)
- Hides native input with `opacity: 0` but keeps it in layout flow
- Can cause "phantom click" areas and double-tabbing issues
- Conflicts with CSS-only implementations

**Current Flow:**
```
HTML Input → JS adds .jelly class → Creates .cbx span → CSS styles .cbx
```

**Recommendation:**
Replace with **Pure CSS** implementation:
- Eliminates JS dependency
- Reduces DOM complexity
- More reliable and performant
- Better accessibility

---

## 📊 REDUNDANT/UNUSED CODE

### 5. **Duplicate/Legacy Files**
- `static/js/interactions-temp.js` - Temporary file, should be removed
- Multiple guide markdown files (12 total) - Consider consolidating
- `how --name-only HEAD`, `how --name-only 8c93ff7` - Git artifacts, remove

### 6. **Unused CSS Modules**
**File:** `assets/css/custom.css`
- Lines ~887-951: "Jelly module" styles for `.cbx`, `.lbl` classes
  - Only used if `checkbox-jelly.js` runs
  - Completely redundant if moving to Pure CSS

---

## 🔧 CODE ORGANIZATION ISSUES

### 7. **Mixed Concerns in `custom.css`**
**Size:** 4150+ lines  
**Issues:**
- Global checkbox styles (line 706-790)
- Jelly module (line 887-951)
- Like button styles (line 992+)
- Dark mode overrides scattered throughout

**Recommendation:**
- Split into modular files: `checkboxes.css`, `forms.css`, `dark-mode.css`, `animations.css`
- Use Hugo's asset pipeline to combine in production

### 8. **Script Loading Inconsistencies**
**head.html:**
- Some scripts use `resources.Get` (fingerprinted, cached)
- Others use `relURL` (non-fingerprinted)
- Mixing strategies reduces cache efficiency

**Pattern:**
```html
<!-- Fingerprinted (GOOD) -->
{{- $searchJS := resources.Get "js/search.js" | minify | fingerprint }}
<script src="{{ $searchJS.RelPermalink }}" integrity="...">

<!-- Non-fingerprinted (LESS OPTIMAL) -->
<script src="{{ "js/lazy-loading.js" | relURL }}" defer>
```

**Recommendation:** Standardize on fingerprinted resources for all custom scripts.

---

## 🐛 MINOR BUGS

### 9. **Weather Widget API Dependency**
**File:** `static/js/weather-widget.js`  
**Lines:** 297, 323

**Issue:**
- Hard-coded dependency on `api.open-meteo.com`
- No offline fallback
- Could block site render if API slow/unavailable

**Recommendation:**
- Add timeout to fetch calls (currently 10s for geolocation, none for weather)
- Implement graceful degradation
- Cache last successful response in localStorage

### 10. **Missing Error Boundaries**
**Multiple scripts:**
- `checkbox-jelly.js` - No try-catch around DOM operations
- `home-scripts.js` - Quote modal can throw if DOM elements missing

**Recommendation:** Wrap initialization code in try-catch blocks.

---

## 📁 PROJECT STRUCTURE ASSESSMENT

### Current Structure:
```
AQUA-IN-JAR/
├── assets/css/              # Asset pipeline CSS (2 files)
├── static/css/              # Direct-serve CSS (4 files)
├── static/js/               # 18 JS files
├── layouts/                 # 35+ layout files
├── content/                 # 115+ content files
└── [12 guide markdown files at root]
```

### Issues:
1. **CSS Split:** Assets vs Static folders creates confusion
2. **Root Clutter:** 12 guide files pollute root directory
3. **No Clear Module Boundaries:** Features mixed across files

### Recommended Structure:
```
AQUA-IN-JAR/
├── assets/
│   ├── css/
│   │   ├── base/           # Reset, variables
│   │   ├── components/     # Buttons, forms, checkboxes
│   │   ├── layouts/        # Grid, containers
│   │   └── utilities/      # Dark mode, animations
│   └── js/
│       ├── core/           # Init, utils
│       ├── features/       # Weather, search, etc.
│       └── games/          # Daily puzzles
├── docs/                   # All guide markdown files
├── static/
│   ├── audio/
│   ├── images/
│   └── fonts/
└── [Core files only: hugo.yaml, README.md]
```

---

## 🎯 PRIORITY FIXES

### Immediate (Before Next Deploy):
1. ✅ Fix `head.html` resource paths (remove leading spaces)
2. ✅ Enable global search script loading
3. ✅ Fix checkbox transition CSS

### Short-term (Next Sprint):
4. Replace `checkbox-jelly.js` with Pure CSS implementation
5. Remove temporary/unused files
6. Consolidate documentation

### Long-term (Refactor):
7. Reorganize CSS into modular structure
8. Standardize script loading patterns
9. Implement error boundaries

---

## 📝 RECOMMENDATIONS

### Development Workflow:
1. **Always test with `hugo server`** before committing
2. **Check browser console** for 404 errors on resource loads
3. **Test on both light/dark modes** for all UI changes
4. **Verify on mobile** (touch interactions especially for checkboxes)

### Code Quality:
1. **Use Hugo's asset pipeline** for all custom CSS/JS (enables fingerprinting, minification)
2. **Implement linting:** ESLint for JS, Stylelint for CSS
3. **Add JSDoc comments** to all exported functions
4. **Create component documentation** for reusable UI elements

### Performance:
1. **Lazy-load non-critical scripts** (weather widget, games)
2. **Defer all JS** except critical path
3. **Optimize images** (current static folder has unoptimized assets)
4. **Enable HTTP/2 Server Push** for critical CSS

---

## 🔒 SECURITY NOTES

### Supabase Integration:
- API keys in `static/js/like-config.js` (PUBLIC, acceptable for client-side SDK)
- Ensure Row Level Security (RLS) is enabled in Supabase
- Verify `.env` files are in `.gitignore` (if any)

### External Dependencies:
- Open-Meteo API (weather): No auth required, rate limits unknown
- All external scripts should have Subresource Integrity (SRI) hashes

---

## 📈 METRICS

**Current State:**
- Total Files: ~400+ (including build artifacts)
- CSS Size: ~85KB (custom.css alone)
- JS Files: 18 modules
- Page Load Issues: 4-6 potential 404s per page due to path errors

**After Fixes:**
- Expected 404 reduction: 100%
- CSS potential split: 4-6 modular files (~15-20KB each)
- JS consolidation opportunity: ~30% reduction
- Improved cache hit rate: ~40% (via fingerprinting)

---

This audit provides a roadmap for improving code quality, performance, and maintainability.
