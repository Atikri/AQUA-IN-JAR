/**
 * Home Page Scripts - Marquee & Modal Logic
 * Extracted for Swup compatibility
 */

// Global Quote Interactions
// Store reference to the current quote content to sync duplicates
let currentQuoteContent = "";

window.openQuoteModal = function (element) {
    const modal = document.getElementById('quoteModal');
    const modalText = document.getElementById('modalQuoteText');
    const modalAuthor = document.getElementById('modalQuoteAuthor');
    const modalLikeBtn = document.getElementById('modalLikeBtn');
    const marqueeTracks = document.querySelectorAll('.marquee-track');

    if (!modal) return;

    const quote = element.getAttribute('data-quote');
    const author = element.getAttribute('data-author');
    currentQuoteContent = quote; // Store for syncing

    if (modalText) modalText.textContent = quote;
    if (modalAuthor) modalAuthor.textContent = author;

    // 1. Mark as Viewed (Visual Feedback)
    markCardsAs(quote, 'viewed');

    // 2. Check if already liked check UI state
    // (Simple check: does the card already have 'liked' class?)
    const isLiked = element.classList.contains('liked');

    if (modalLikeBtn) {
        modalLikeBtn.classList.toggle('liked', isLiked);
        const heart = modalLikeBtn.querySelector('.heart-icon');
        if (heart) heart.textContent = isLiked ? '❤️' : '🤍';
    }

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    marqueeTracks.forEach(track => track.style.animationPlayState = 'paused');
};

window.toggleModalLike = function () {
    const modalLikeBtn = document.getElementById('modalLikeBtn');
    if (!modalLikeBtn) return;

    // Toggle Button State
    const isLikedNow = !modalLikeBtn.classList.contains('liked');
    modalLikeBtn.classList.toggle('liked', isLikedNow);

    const heart = modalLikeBtn.querySelector('.heart-icon');
    if (heart) {
        heart.textContent = isLikedNow ? '❤️' : '🤍';
    }

    // Toggle Card State (Sync all duplicates)
    markCardsAs(currentQuoteContent, 'liked', isLikedNow);
};

// Helper to find all cards with specific text (handle horizontal scroll duplicates)
function markCardsAs(quoteContent, className, forceState = true) {
    const allCards = document.querySelectorAll('.quote-card-compact');
    allCards.forEach(card => {
        if (card.getAttribute('data-quote') === quoteContent) {
            if (className === 'liked') {
                card.classList.toggle('liked', forceState);
            } else {
                card.classList.add(className);
            }
        }
    });
}

window.closeQuoteModal = function () {
    const modal = document.getElementById('quoteModal');
    const marqueeTracks = document.querySelectorAll('.marquee-track');

    if (modal) modal.classList.remove('show');
    document.body.style.overflow = '';
    marqueeTracks.forEach(track => track.style.animationPlayState = 'running');
};

// Global escape handler (stable reference)
function handleEscapeKey(e) {
    const modal = document.getElementById('quoteModal');
    if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
        window.closeQuoteModal();
    }
}

// Main Initialization Function - Called by Swup on page view/replace
// Main Initialization Function - Called by Swup on page view/replace
window.initQuotes = function () {
    const wrapper = document.querySelector('.marquee-wrapper');
    const marqueeTracks = document.querySelectorAll('.marquee-track');
    const modal = document.getElementById('quoteModal');

    // Only run if we are on a page with the marquee
    if (!wrapper || !modal) return;

    // 1. Hover Events for Pause
    wrapper.addEventListener('mouseenter', () => {
        marqueeTracks.forEach(track => track.style.animationPlayState = 'paused');
    });

    wrapper.addEventListener('mouseleave', () => {
        if (modal && !modal.classList.contains('show')) {
            marqueeTracks.forEach(track => track.style.animationPlayState = 'running');
        }
    });

    // 2. Click Events for Quote Cards (Programmatic Binding)
    const quoteCards = document.querySelectorAll('.quote-card-compact');
    quoteCards.forEach(card => {
        card.addEventListener('click', () => {
            window.openQuoteModal(card);
        });
    });

    // 3. Re-attach escape listener
    document.removeEventListener('keydown', handleEscapeKey);
    document.addEventListener('keydown', handleEscapeKey);
};

// Also handle Random Article Script if it's there
window.initRandomArticle = function () {
    // This logic relies on __randomArticles being defined globally via the template.
    // If the template re-renders, the script tag with __randomArticles runs again (if we are lucky) 
    // or we might need to parse it from a data attribute.
    // For now, let's assume the inline script for __randomArticles runs because it's in the body?
    // Swup executes scripts in the new content if using the Scripts plugin.
    // But we are not using the Scripts plugin yet.
    // So __randomArticles might disappear or not update.
    // Safe bet: Move the data generation to a data attribute on a hidden element.
};

// Auto-initialize on first load (if not handled by Swup immediately)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initQuotes);
} else {
    window.initQuotes();
}
