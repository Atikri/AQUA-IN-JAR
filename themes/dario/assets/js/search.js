"use strict";

// Search functionality
document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    
    if (!searchInput || !searchResults) return;
    
    let searchData = [];
    let debounceTimer;
    
    // Load search data from all pages
    async function loadSearchData() {
        searchData = [];
        
        try {
            // Build base-aware URL for index.json (works under subpaths)
            const baseHref = (document.querySelector('base') && document.querySelector('base').href) || document.baseURI || '/';
            const jsonUrl = new URL('index.json', baseHref).toString();
            // Fetch all pages to get their content
            const response = await fetch(jsonUrl);
            if (response.ok) {
                const data = await response.json();
                searchData = data.map(page => ({
                    title: page.title || '',
                    url: page.permalink || page.url || '',
                    content: page.content || '',
                    excerpt: page.summary || page.description || '',
                    date: page.date || '',
                    section: page.section || ''
                }));
            } else {
                // Fallback: collect data from current page
                collectDataFromPage();
            }
        } catch (error) {
            console.log('Using fallback search data collection');
            collectDataFromPage();
        }
    }
    
    // Fallback method to collect data from current page
    function collectDataFromPage() {
        // Get all page links and their titles
        const pageLinks = document.querySelectorAll('a[href*="/posts/"], a[href*="/notification-jar/"], a[href*="/aqua-inspiration/"]');
        pageLinks.forEach(link => {
            if (link.href && link.textContent.trim()) {
                searchData.push({
                    title: link.textContent.trim(),
                    url: link.href,
                    content: '',
                    excerpt: link.getAttribute('data-excerpt') || '',
                    date: '',
                    section: ''
                });
            }
        });
    }
    
    // Highlight search terms in text
    function highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }
    
    // Perform search
    function performSearch(query) {
        if (!query || query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        const queryLower = query.toLowerCase();
        const results = searchData.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(queryLower);
            const excerptMatch = item.excerpt.toLowerCase().includes(queryLower);
            const contentMatch = item.content.toLowerCase().includes(queryLower);
            return titleMatch || excerptMatch || contentMatch;
        }).map(item => {
            // Calculate relevance score
            let score = 0;
            if (item.title.toLowerCase().includes(queryLower)) score += 10;
            if (item.excerpt.toLowerCase().includes(queryLower)) score += 5;
            if (item.content.toLowerCase().includes(queryLower)) score += 1;
            
            // Find content snippet around the match
            let snippet = item.excerpt;
            if (item.content) {
                const contentLower = item.content.toLowerCase();
                const matchIndex = contentLower.indexOf(queryLower);
                if (matchIndex !== -1) {
                    const start = Math.max(0, matchIndex - 100);
                    const end = Math.min(item.content.length, matchIndex + 100);
                    snippet = item.content.substring(start, end);
                    if (start > 0) snippet = '...' + snippet;
                    if (end < item.content.length) snippet = snippet + '...';
                }
            }
            
            return {
                ...item,
                score: score,
                snippet: snippet
            };
        }).sort((a, b) => b.score - a.score); // Sort by relevance
        
        displayResults(results, query);
    }
    
    // Display search results
    function displayResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">没有找到相关文章</div>';
            searchResults.style.display = 'block';
            return;
        }
        
        const html = results.slice(0, 10).map(item => `
            <div class="search-result-item" onclick="window.location.href='${item.url}'">
                <div class="search-result-title">${highlightText(item.title, query)}</div>
                ${item.snippet ? `<div class="search-result-excerpt">${highlightText(item.snippet, query)}</div>` : ''}
                ${item.section ? `<div class="search-result-section">分类: ${item.section}</div>` : ''}
            </div>
        `).join('');
        
        searchResults.innerHTML = html;
        searchResults.style.display = 'block';
    }
    
    // Debounced search
    function debouncedSearch(query) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            performSearch(query);
        }, 300);
    }
    
    // Event listeners
    searchInput.addEventListener('input', function(e) {
        debouncedSearch(e.target.value);
    });
    
    searchInput.addEventListener('focus', function() {
        if (searchInput.value.length >= 2) {
            performSearch(searchInput.value);
        }
    });
    
    // Hide results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
    
    // Load search data
    loadSearchData();
    
    // Add keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
        const items = searchResults.querySelectorAll('.search-result-item');
        const currentActive = searchResults.querySelector('.search-result-item.active');
        let activeIndex = -1;
        
        if (currentActive) {
            activeIndex = Array.from(items).indexOf(currentActive);
        }
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (activeIndex < items.length - 1) {
                if (currentActive) currentActive.classList.remove('active');
                items[activeIndex + 1].classList.add('active');
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (activeIndex > 0) {
                if (currentActive) currentActive.classList.remove('active');
                items[activeIndex - 1].classList.add('active');
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentActive) {
                window.location.href = currentActive.onclick.toString().match(/window\.location\.href='([^']+)'/)[1];
            }
        } else if (e.key === 'Escape') {
            searchResults.style.display = 'none';
            searchInput.blur();
        }
    });
});
