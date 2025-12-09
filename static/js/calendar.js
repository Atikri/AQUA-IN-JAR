document.addEventListener('DOMContentLoaded', () => {
    const calendarContainer = document.getElementById('calendar-component');
    if (!calendarContainer) {
        console.warn('Calendar component container not found.');
        return;
    }

    // Immediate feedback to show JS is running
    calendarContainer.innerHTML = '<div style="text-align: center; padding: 20px;">Initializing Calendar...</div>';

    let articles = [];
    let currentDate = new Date();
    // Persistence
    const savedDate = localStorage.getItem('calendarDate');
    if (savedDate) {
        currentDate = new Date(savedDate);
    }

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    async function init() {
        try {
            calendarContainer.innerHTML = '<div style="text-align: center; padding: 20px;">Fetching Data...</div>';

            // Try fetching from expected locations with cache busting
            const locations = [
                '/calendar.json',
                '/index.calendar.json',
                '/index.json'
            ];

            let response = null;
            let successLocation = '';

            for (const loc of locations) {
                try {
                    const res = await fetch(loc + '?t=' + Date.now());
                    // Check if content type is JSON
                    const contentType = res.headers.get("content-type");
                    if (res.ok && contentType && contentType.includes("application/json")) {
                        response = res;
                        successLocation = loc;
                        console.log('Calendar data found at:', loc);
                        break;
                    }
                } catch (e) {
                    console.warn(`Failed to fetch ${loc}`, e);
                }
            }

            if (!response) {
                // Try one more time without content-type check (some servers serve json as text/plain or octet-stream)
                for (const loc of locations) {
                    const res = await fetch(loc + '?t=' + Date.now());
                    if (res.ok) {
                        try {
                            const clone = res.clone();
                            await clone.json(); // verify it parses as JSON
                            response = res;
                            successLocation = loc;
                            break;
                        } catch (jsonErr) {
                            console.warn(`${loc} is not valid JSON`);
                        }
                    }
                }
            }

            if (!response) throw new Error('Could not find valid calendar.json data.');

            articles = await response.json();

            // Validate data structure (basic check)
            if (!Array.isArray(articles)) {
                // Should be an array
                if (articles.data && Array.isArray(articles.data)) {
                    articles = articles.data;
                } else if (Object.keys(articles).length > 0) {
                    // Try to conver object values to array? No, just fail or warn.
                    console.warn('Calendar data is not an array', articles);
                    // It might be Hugo index.json standard format which is array, but let's see.
                }
            }

            renderCalendar(currentDate);
        } catch (error) {
            console.error('Calendar Error:', error);
            calendarContainer.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--cal-muted, #666);">
                    <p>Unable to load calendar data.</p>
                    <p style="font-size: 0.8em; opacity: 0.8;">${error.message}</p>
                    <p style="font-size: 0.8em; margin-top: 10px;">Please try restarting the Hugo server.</p>
                </div>`;
        }
    }

    function renderCalendar(date) {
        // Save state
        localStorage.setItem('calendarDate', date.toISOString());

        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayParams = firstDay.getDay(); // 0 = Sunday

        // Structure
        let html = `
            <div class="calendar-widget">
                <div class="calendar-header">
                    <h3 class="calendar-title">${monthNames[month]} ${year}</h3>
                    <div class="calendar-nav">
                        <button id="cal-prev" aria-label="Previous Month">&larr;</button>
                        <button id="cal-today" aria-label="Today">Today</button>
                        <button id="cal-next" aria-label="Next Month">&rarr;</button>
                    </div>
                </div>
                <div class="calendar-grid">
                    ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="calendar-weekday">${d}</div>`).join('')}
        `;

        // Empty slots
        for (let i = 0; i < startDayParams; i++) {
            html += `<div class="calendar-day empty"></div>`;
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            // Match article date (YYYY-MM-DD)
            // Note: dateStr might differ in timezone from article date string, but both are typically YYYY-MM-DD string comparisons
            const dayArticles = articles.filter(a => {
                // Ensure a.date exists and is string
                return a.date && a.date.startsWith(dateStr);
            });

            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

            let dotHtml = '';
            if (dayArticles.length > 0) {
                // Check word count for heatmap
                const maxWordCount = Math.max(...dayArticles.map(a => a.wordCount || 0));
                const isHeavy = maxWordCount > 2000;
                dotHtml = `<div class="calendar-dot ${isHeavy ? 'heavy' : ''}"></div>`;
            }

            html += `
                <div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}">
                    <span>${day}</span>
                    ${dotHtml}
                </div>
            `;
        }

        html += `   </div>
                    <div id="calendar-article-card"></div>
                </div>`;

        calendarContainer.innerHTML = html;

        // Listeners
        const prevBtn = document.getElementById('cal-prev');
        const nextBtn = document.getElementById('cal-next');
        const todayBtn = document.getElementById('cal-today');

        if (prevBtn) prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar(currentDate);
        });
        if (nextBtn) nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar(currentDate);
        });
        if (todayBtn) todayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentDate = new Date();
            renderCalendar(currentDate);
        });

        // Day clicks
        calendarContainer.querySelectorAll('.calendar-day').forEach(el => {
            if (!el.classList.contains('empty')) {
                el.addEventListener('click', () => showArticles(el.getAttribute('data-date')));
            }
        });
    }

    function showArticles(dateStr) {
        const matching = articles.filter(a => a.date && a.date.startsWith(dateStr));
        const cardContainer = document.getElementById('calendar-article-card');

        if (matching.length === 0) {
            // Optional: check if previously showing something, maybe clear or say "No articles"
            // For now, if no article, maybe just clear
            if (cardContainer) cardContainer.innerHTML = '';
            return;
        }

        const html = matching.map(article => `
            <div class="article-card">
                <h3><a href="${article.permalink}">${article.mood || ''} ${article.title}</a></h3>
            </div>
        `).join('');

        if (cardContainer) cardContainer.style.display = 'block';
        if (cardContainer) cardContainer.innerHTML = html;

        // Simple animation/scrollIntoView if needed
    }

    init();
});
