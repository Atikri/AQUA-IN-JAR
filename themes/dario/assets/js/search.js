"use strict";

// Search functionality
document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    
    if (!searchInput || !searchResults) return;
    
    let searchData = [];
    let debounceTimer;
    
    // Load search data from all pages
    function loadSearchData() {
        // This would normally be populated from Hugo's search index
        // For now, we'll create a simple search based on page titles and content
        searchData = [];
        
        // Get all page links and their titles
        const pageLinks = document.querySelectorAll('a[href*="/posts/"], a[href*="/notification-jar/"], a[href*="/aqua-inspiration/"]');
        pageLinks.forEach(link => {
            if (link.href && link.textContent.trim()) {
                searchData.push({
                    title: link.textContent.trim(),
                    url: link.href,
                    excerpt: link.getAttribute('data-excerpt') || ''
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
        
        const results = searchData.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(query.toLowerCase());
            const excerptMatch = item.excerpt.toLowerCase().includes(query.toLowerCase());
            return titleMatch || excerptMatch;
        });
        
        displayResults(results, query);
    }
    
    // Display search results
    function displayResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">没有找到相关文章</div>';
            searchResults.style.display = 'block';
            return;
        }
        
        const html = results.map(item => `
            <div class="search-result-item" onclick="window.location.href='${item.url}'">
                <div class="search-result-title">${highlightText(item.title, query)}</div>
                ${item.excerpt ? `<div class="search-result-excerpt">${highlightText(item.excerpt, query)}</div>` : ''}
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
