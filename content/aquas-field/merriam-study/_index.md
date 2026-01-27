---
title: "Merriam Study"
date: 2026-01-26
description: "Comprehensive study notes, analysis, and deep dive into Merriam.pdf."
menu:
  main:
    parent: "Aquas Field"
type: "docs"
weight: 10
---

<div class="merriam-study-container">

<div class="study-header glass-panel">
<h1 class="study-title">The Merriam Study</h1>
<p class="study-subtitle">Deconstructing the text, one chapter at a time.</p>

<div class="resource-links">
<a href="/file/Merriam.pdf" target="_blank" class="btn-primary">
<span class="icon">📄</span> Open Original PDF
</a>
</div>
</div>

<div class="study-dashboard">
<!-- Progress Section -->
<div class="dashboard-card progress-card glass-panel">
<h3>Current Progress</h3>
<div class="progress-bar-container">
<div class="progress-bar" style="width: 5%;"></div>
</div>
<p class="progress-text">Getting Started • 5%</p>
</div>

<!-- Quick Stats or Info -->
<div class="dashboard-card info-card glass-panel">
<h3>Study Focus</h3>
<ul>
<li><strong>Source:</strong> Merriam.pdf</li>
<li><strong>Status:</strong> Active Learning</li>
<li><strong>Goal:</strong> Complete Mastery</li>
</ul>
</div>
</div>

<div class="modules-section">
<h2>Study Modules</h2>
<div class="modules-grid">

<!-- Module 1 -->
<a href="./01-introduction" class="module-card glass-panel">
<div class="module-number">01</div>
<div class="module-content">
<h3>Introduction & Overview</h3>
<p>Initial breakdown of the book's structure and key themes.</p>
</div>
<div class="module-status status-active">In Progress</div>
</a>

<!-- Placeholder for Module 2 -->
<div class="module-card glass-panel locked">
<div class="module-number">02</div>
<div class="module-content">
<h3>Chapter 1: Foundations</h3>
<p>Coming soon...</p>
</div>
<div class="module-status status-locked">Locked</div>
</div>

</div>
</div>

</div>

<style>
/* Scoped styles for the study center to ensure it looks premium immediately */
.merriam-study-container {
max-width: 1200px;
margin: 0 auto;
padding: 2rem 0;
font-family: var(--font-body, sans-serif);
color: #334155; /* Default dark text */
}

.glass-panel {
background: rgba(255, 255, 255, 0.4); /* More opaque for contrast */
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.5); /* Stronger border */
border-radius: 16px;
padding: 2rem;
transition: transform 0.3s ease, box-shadow 0.3s ease;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); /* Subtle shadow */
}

.glass-panel:hover {
transform: translateY(-2px);
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
border-color: rgba(255, 255, 255, 0.8);
background: rgba(255, 255, 255, 0.6);
}

.study-header {
text-align: center;
margin-bottom: 3rem;
padding: 4rem 2rem;
background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
}

.study-title {
font-size: 3.5rem;
font-weight: 800;
margin-bottom: 0.5rem;
background: linear-gradient(90deg, #1e293b, #475569); /* Dark gradient */
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
letter-spacing: -1px;
}

.study-subtitle {
font-size: 1.2rem;
color: #475569; /* Darker grey */
margin-bottom: 2rem;
font-weight: 500;
}

.btn-primary {
display: inline-flex;
align-items: center;
gap: 0.5rem;
padding: 0.8rem 1.5rem;
background: #2563eb; /* Stronger blue */
color: white;
text-decoration: none;
border-radius: 50px;
font-weight: 600;
transition: all 0.2s ease;
box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover {
background: #1d4ed8;
transform: scale(1.05);
box-shadow: 0 6px 15px rgba(37, 99, 235, 0.4);
}

.study-dashboard {
display: grid;
grid-template-columns: 2fr 1fr;
gap: 1.5rem;
margin-bottom: 3rem;
}

.progress-bar-container {
width: 100%;
height: 10px;
background: rgba(0,0,0,0.1); /* Darker track */
border-radius: 5px;
margin: 1rem 0;
overflow: hidden;
}

.progress-bar {
height: 100%;
background: linear-gradient(90deg, #3b82f6, #6366f1);
border-radius: 5px;
}

.progress-text {
color: #475569;
font-weight: 500;
}

.info-card h3, .progress-card h3 {
color: #1e293b;
margin-bottom: 1rem;
}

.info-card ul {
list-style: none;
padding: 0;
margin: 0;
}

.info-card li {
margin-bottom: 0.5rem;
color: #475569; /* Dark text */
}

.info-card strong {
color: #1e293b; /* Darker bold */
}

.modules-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: 1.5rem;
}

.module-card {
position: relative;
display: flex;
flex-direction: column;
justify-content: space-between;
min-height: 200px;
text-decoration: none;
color: inherit;
overflow: hidden;
}

.module-number {
font-size: 4rem;
position: absolute;
top: -10px;
right: -10px;
opacity: 0.1; /* Subtle dark watermark */
font-weight: 900;
color: #000;
}

.module-content h3 {
font-size: 1.5rem;
margin-bottom: 0.5rem;
color: #1e293b; /* Dark title */
font-weight: 700;
}

.module-content p {
color: #475569; /* Dark description */
font-size: 0.95rem;
line-height: 1.5;
}

.module-status {
align-self: flex-start;
padding: 0.3rem 0.8rem;
border-radius: 20px;
font-size: 0.75rem;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.5px;
margin-top: 1rem;
}

.status-active {
background: rgba(37, 99, 235, 0.1); /* Blue tint */
color: #2563eb; /* Strong blue */
border: 1px solid rgba(37, 99, 235, 0.2);
}

.status-locked {
background: rgba(100, 116, 139, 0.1);
color: #64748b;
border: 1px solid rgba(100, 116, 139, 0.2);
}

.module-card.locked {
opacity: 0.6;
cursor: not-allowed;
filter: grayscale(0.2);
background: rgba(255, 255, 255, 0.2);
}
</style>
