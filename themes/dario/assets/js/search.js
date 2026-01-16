"use strict";

// Search functionality
console.log('Search script loaded');

function initSearch() {
    console.log('Initializing search...');

    // 1. Header Search Toggle Logic
    const headerSearchBtn = document.getElementById('headerSearchBtn');
    const headerSearchPanel = document.getElementById('headerSearchPanel');
    const searchInput = document.getElementById("searchInput");

    if (headerSearchBtn && headerSearchPanel) {
        console.log('Header search elements found');
        // Remove existing listeners to avoid duplicates if re-initialized? 
        // A bit hard without named functions, but standard DOM cleanup usually handles page refreshes.

        // Use addEventListener instead of onclick
        headerSearchBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            console.log('Search toggle clicked via addEventListener');
            headerSearchPanel.classList.toggle('active');
            if (headerSearchPanel.classList.contains('active') && searchInput) {
                searchInput.focus();
            }
        });

        // Prevent panel clicks from closing it
        headerSearchPanel.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    } else {
        console.error('Header search elements MISSING');
    }

    // Close header panel if clicking outside
    // Close header panel if clicking outside
    document.addEventListener('click', function (e) {
        // Double check: if the click target IS the button or inside it, do nothing (let the button handler toggle it)
        if (headerSearchBtn && headerSearchBtn.contains(e.target)) return;
        if (headerSearchBtn && e.target.closest('#headerSearchBtn')) return; // Handle SVG children

        // Use composedPath() to detect clicks inside elements properly
        const path = e.composedPath ? e.composedPath() : [];
        const clickedInsidePanel = headerSearchPanel.contains(e.target) || path.includes(headerSearchPanel);

        if (headerSearchPanel && !clickedInsidePanel) {
            if (headerSearchPanel.classList.contains('active')) {
                // console.log('Closing search panel (click outside detected)');
                headerSearchPanel.classList.remove('active');
            }
        }
    });


    // 2. Search Execution Logic
    const searchResults = document.getElementById("searchResults");

    if (!searchInput || !searchResults) {
        console.error('Search Input or Results container missing');
        return;
    }

    let searchData = [];
    let debounceTimer;

    // Load search data
    loadSearchData();

    // Event listeners
    searchInput.oninput = function (e) {
        debouncedSearch(e.target.value);
    };

    searchInput.onfocus = function () {
        if (searchInput.value.length >= 2) {
            performSearch(searchInput.value);
        }
    };

    // Close results when clicking outside
    document.addEventListener('click', function (e) {
        if (searchInput && searchResults && !searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });

    // Keyboard navigation
    searchInput.onkeydown = function (e) {
        // ... (existing logic)
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
            } else if (items.length > 0) {
                // Open first result if none active? Optional.
            }
        } else if (e.key === 'Escape') {
            searchResults.style.display = 'none';
            searchInput.blur();
        }
    };


    // Functions
    async function loadSearchData() {
        searchData = [];
        try {
            const jsonUrl = '/index.json';
            console.log('Fetching', jsonUrl);
            const response = await fetch(jsonUrl);
            if (response.ok) {
                const data = await response.json();
                console.log('Search data loaded:', data.length, 'items');
                searchData = data.map(page => ({
                    title: page.title || '',
                    url: page.permalink || page.url || '',
                    content: page.content || '',
                    excerpt: page.summary || page.description || '',
                    date: page.date || '',
                    section: page.section || ''
                }));
            } else {
                console.error('Fetch failed:', response.status);
                collectDataFromPage();
            }
        } catch (error) {
            console.log('Using fallback search data collection', error);
            collectDataFromPage();
        }
    }

    function collectDataFromPage() {
        // ... (existing fallback)
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

    function highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

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
            let score = 0;
            if (item.title.toLowerCase().includes(queryLower)) score += 10;
            if (item.excerpt.toLowerCase().includes(queryLower)) score += 5;
            if (item.content.toLowerCase().includes(queryLower)) score += 1;

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
            return { ...item, score, snippet };
        }).sort((a, b) => b.score - a.score);

        displayResults(results, query);
    }

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

    function debouncedSearch(query) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            performSearch(query);
        }, 300);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}
