"use strict";

/* =========================================
   THEME MANAGEMENT
   ========================================= */

function setDarkMode(isDarkMode) {
  const initialReadyState = document.readyState;

  // Handle class toggle in one batch
  requestAnimationFrame(() => {
    // Prevent transition flash on load
    if (initialReadyState !== "complete") {
      document.documentElement.classList.add("dark-mode-init");
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("dark-mode-init");
      });
    }

    document.documentElement.classList.toggle("dark-mode-on", isDarkMode);
    document.documentElement.classList.toggle("dark-mode-off", !isDarkMode);

    // Update localStorage
    localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");

    // Update UI buttons
    updateThemeButtons(isDarkMode);
  });
}

function updateThemeButtons(isDarkMode) {
  const lightBtns = document.querySelectorAll('.light-theme-btn');
  const darkBtns = document.querySelectorAll('.dark-theme-btn');

  lightBtns.forEach(btn => {
    btn.classList.toggle('active', !isDarkMode);
    btn.setAttribute('aria-pressed', !isDarkMode);
  });

  darkBtns.forEach(btn => {
    btn.classList.toggle('active', isDarkMode);
    btn.setAttribute('aria-pressed', isDarkMode);
  });
}

function initTheme() {
  // 1. Read Storage or System Pref
  let isDarkMode = false;
  const savedMode = localStorage.getItem("darkMode");

  if (savedMode === "enabled") {
    isDarkMode = true;
  } else if (savedMode === "disabled") {
    isDarkMode = false;
  } else {
    // Fallback to system preference
    isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  // 2. Apply
  setDarkMode(isDarkMode);

  // 3. Listeners for Theme Buttons
  document.querySelectorAll('.light-theme-btn').forEach(btn => {
    btn.addEventListener('click', () => setDarkMode(false));
  });
  document.querySelectorAll('.dark-theme-btn').forEach(btn => {
    btn.addEventListener('click', () => setDarkMode(true));
  });
}

/* =========================================
   FONT SIZE MANAGEMENT
   ========================================= */

const DEFAULT_FONT_SIZE = 20;
const FONT_STEP = 2;
const MIN_FONT = 16;
const MAX_FONT = 24;
// Levels: 16, 18, 20 (default), 22, 24 (5 levels maps nicely to 5 dots)

function setFontSize(size) {
  // Constrain
  if (size < MIN_FONT) size = MIN_FONT;
  if (size > MAX_FONT) size = MAX_FONT;

  // Apply to Root
  document.documentElement.style.setProperty('--font-size-base', `${size}px`);

  // Persist
  localStorage.setItem('fontSize', size);

  // Update UI
  updateFontUI(size);
}

function updateFontUI(currentSize) {
  const indicators = document.querySelectorAll('.font-indicator');
  const totalSteps = (MAX_FONT - MIN_FONT) / FONT_STEP; // (24-16)/2 = 4 steps (5 positions)
  const currentStep = (currentSize - MIN_FONT) / FONT_STEP; // 0 to 4

  indicators.forEach((dot, index) => {
    dot.classList.toggle('active', index <= currentStep);
  });

  const decreaseBtn = document.getElementById('decreaseFont');
  const increaseBtn = document.getElementById('increaseFont');

  if (decreaseBtn) decreaseBtn.disabled = currentSize <= MIN_FONT;
  if (increaseBtn) increaseBtn.disabled = currentSize >= MAX_FONT;
}

function initFontSize() {
  const savedFont = parseInt(localStorage.getItem('fontSize'));
  const initialSize = !isNaN(savedFont) ? savedFont : DEFAULT_FONT_SIZE;
  setFontSize(initialSize);

  // Listeners
  const decreaseBtn = document.getElementById('decreaseFont');
  const increaseBtn = document.getElementById('increaseFont');

  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => {
      const current = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--font-size-base')) || DEFAULT_FONT_SIZE;
      setFontSize(current - FONT_STEP);
    });
  }

  if (increaseBtn) {
    increaseBtn.addEventListener('click', () => {
      const current = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--font-size-base')) || DEFAULT_FONT_SIZE;
      setFontSize(current + FONT_STEP);
    });
  }
}

/* =========================================
   PANEL INTERACTION
   ========================================= */

function initPanel() {
  const btn = document.getElementById('displaySettingsBtn');
  const panel = document.getElementById('displaySettingsPanel');

  if (!btn || !panel) return;

  // Toggle
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = panel.classList.contains('visible');
    if (isVisible) {
      panel.classList.remove('visible');
      panel.setAttribute('aria-hidden', 'true');
    } else {
      panel.classList.add('visible');
      panel.setAttribute('aria-hidden', 'false');
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !btn.contains(e.target)) {
      panel.classList.remove('visible');
      panel.setAttribute('aria-hidden', 'true');
    }
  });

  // Prevent closing when clicking inside panel
  panel.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

/* =========================================
   TOC MOBILE TOGGLE (Preserved Legacy)
   ========================================= */
function initTOC() {
  const tocToggle = document.querySelector('.toc-toggle');
  const tocOverlay = document.getElementById('tocOverlay');
  if (tocToggle && tocOverlay) {
    tocToggle.addEventListener('click', () => {
      const isOpen = tocOverlay.classList.contains('open');
      if (isOpen) {
        tocOverlay.classList.remove('open');
        document.body.classList.remove('toc-open');
      } else {
        tocOverlay.classList.add('open');
        document.body.classList.add('toc-open');
      }
    });
    tocOverlay.addEventListener('click', (e) => {
      if (e.target === tocOverlay) {
        tocOverlay.classList.remove('open');
        document.body.classList.remove('toc-open');
      }
    });
  }
}

/* =========================================
   MAIN INITIALIZATION
   ========================================= */

function initAll() {
  initTheme();
  initFontSize();
  initPanel();
  initTOC();

  // Show controls (fade in effect helper)
  requestAnimationFrame(() => {
    const controls = document.querySelector(".header-controls");
    if (controls) controls.style.opacity = "1";
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll);
} else {
  initAll();
}
