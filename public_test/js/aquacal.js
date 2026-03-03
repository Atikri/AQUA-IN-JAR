
(function () {
    async function initAllCalendars() {
        const containers = document.querySelectorAll('.premium-calendar-container');
        if (containers.length === 0) return;

        let allArticles = [];
        const monthStrings = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        // One-time fetch for all data
        try {
            const res = await fetch('/index.calendar.json?t=' + Date.now());
            if (!res.ok) throw new Error("Data not found");
            allArticles = await res.json();
        } catch (e) {
            console.error("Calendar fetch error:", e);
            containers.forEach(c => {
                const body = c.querySelector('#premium-calendar-body');
                if (body) body.innerHTML = `<div style="padding: 2rem; color: #ff6b6b">Error: ${e.message}</div>`;
            });
            return;
        }

        containers.forEach(container => {
            const calendarBody = container.querySelector('#premium-calendar-body');
            const monthTitle = container.querySelector('#month-title');
            const articlePreview = container.querySelector('#article-preview-area');
            const filterSection = container.dataset.section || null;

            let currentDate = new Date();
            let sectionArticles = allArticles;

            if (filterSection) {
                // Adjust filter to match your site's URL structure
                sectionArticles = allArticles.filter(a => a.permalink.includes(`/${filterSection}/`));
            }

            function render() {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();

                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                const daysInMonth = lastDay.getDate();
                const startDay = firstDay.getDay();

                if (monthTitle) monthTitle.innerText = `${monthStrings[month]} ${year}`;

                let html = '';
                const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                weekdays.forEach(w => html += `<div class="weekday-premium">${w}</div>`);

                for (let i = 0; i < startDay; i++) {
                    html += `<div class="day-premium empty"></div>`;
                }

                const todayStr = new Date().toISOString().split('T')[0];
                for (let d = 1; d <= daysInMonth; d++) {
                    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    const isToday = dayStr === todayStr;
                    const morningArticles = sectionArticles.filter(a => a.date === dayStr);
                    const hasArticles = morningArticles.length > 0;
                    const isHeavy = morningArticles.length > 2;

                    html += `
                        <div class="day-premium ${isToday ? 'today' : ''} ${hasArticles ? 'has-content' : ''}" 
                             data-date="${dayStr}">
                            <span>${d}</span>
                            ${hasArticles ? `<div class="day-dot-premium ${isHeavy ? 'multi' : ''}"></div>` : ''}
                        </div>
                    `;
                }
                if (calendarBody) {
                    calendarBody.innerHTML = html;
                    // Add listeners after render
                    calendarBody.querySelectorAll('.day-premium:not(.empty)').forEach(el => {
                        el.addEventListener('click', () => handleDayClick(el.dataset.date));
                    });
                }
            }

            function handleDayClick(date) {
                const matches = sectionArticles.filter(a => a.date === date);

                container.querySelectorAll('.day-premium').forEach(d => d.style.borderColor = '');
                const clicked = container.querySelector(`[data-date="${date}"]`);
                if (clicked && !clicked.classList.contains('today')) {
                    clicked.style.borderColor = 'rgba(0, 210, 255, 0.8)';
                }

                if (articlePreview) {
                    if (matches.length > 0) {
                        articlePreview.innerHTML = matches.map(a => `
                            <a href="${a.permalink}" class="article-list-item">
                                <div class="article-icon">${a.mood || '📝'}</div>
                                <div class="article-info">
                                    <h4>${a.title}</h4>
                                    <span>${a.summary ? a.summary.substring(0, 80) + '...' : ''}</span>
                                </div>
                            </a>
                        `).join('');
                        articlePreview.style.display = 'block';
                    } else {
                        articlePreview.innerHTML = `<div style="text-align:center; padding: 2rem; color: #8892b0">No activity on this date.</div>`;
                    }
                }
            }

            // Navigation
            const prev = container.querySelector('#prev-month');
            const next = container.querySelector('#next-month');
            const today = container.querySelector('#go-today');

            if (prev) prev.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); render(); });
            if (next) next.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); render(); });
            if (today) today.addEventListener('click', () => { currentDate = new Date(); render(); });

            render();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllCalendars);
    } else {
        initAllCalendars();
    }
})();
