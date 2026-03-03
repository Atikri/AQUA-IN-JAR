
(function () {
    async function initPremiumCalendar() {
        const container = document.querySelector('.premium-calendar-container');
        if (!container) return;

        const calendarBody = container.querySelector('#premium-calendar-body');
        const monthTitle = container.querySelector('#month-title');
        const articlePreview = container.querySelector('#article-preview-area');
        const filterSection = container.dataset.section || null;

        let articles = [];
        let currentDate = new Date();
        const monthStrings = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        async function fetchData() {
            try {
                const res = await fetch('/index.calendar.json?t=' + Date.now());
                if (!res.ok) throw new Error("Data not found");
                let data = await res.json();

                // Filter by section if specified in data-section
                if (filterSection) {
                    data = data.filter(a => a.permalink.includes(`/${filterSection}/`));
                }

                articles = data;
                render();
            } catch (e) {
                console.error("Calendar fetch error:", e);
                calendarBody.innerHTML = `<div style="padding: 2rem; color: #ff6b6b">Error loading calendar data: ${e.message}</div>`;
            }
        }

        function render() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();

            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startDay = firstDay.getDay();

            monthTitle.innerText = `${monthStrings[month]} ${year}`;

            let html = '';

            // Weekday Headers
            const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            weekdays.forEach(w => {
                html += `<div class="weekday-premium">${w}</div>`;
            });

            // Fill empty days
            for (let i = 0; i < startDay; i++) {
                html += `<div class="day-premium empty"></div>`;
            }

            // Fill actual days
            const todayStr = new Date().toISOString().split('T')[0];

            for (let d = 1; d <= daysInMonth; d++) {
                const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const isToday = dayStr === todayStr;
                const morningArticles = articles.filter(a => a.date === dayStr);
                const hasArticles = morningArticles.length > 0;
                const isHeavy = morningArticles.length > 2;

                html += `
                    <div class="day-premium ${isToday ? 'today' : ''} ${hasArticles ? 'has-content' : ''}" 
                         data-date="${dayStr}"
                         onclick="this.dispatchEvent(new CustomEvent('day-click', { bubbles: true, detail: { date: '${dayStr}' } }))">
                        <span>${d}</span>
                        ${hasArticles ? `<div class="day-dot-premium ${isHeavy ? 'multi' : ''}"></div>` : ''}
                    </div>
                `;
            }

            calendarBody.innerHTML = html;
        }

        // Navigation
        container.querySelector('#prev-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            render();
        });

        container.querySelector('#next-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            render();
        });

        container.querySelector('#go-today').addEventListener('click', () => {
            currentDate = new Date();
            render();
        });

        // Day Selection Interaction
        container.addEventListener('day-click', (e) => {
            const date = e.detail.date;
            const matches = articles.filter(a => a.date === date);

            // Visual highlight
            container.querySelectorAll('.day-premium').forEach(d => d.style.borderColor = '');
            const clicked = container.querySelector(`[data-date="${date}"]`);
            if (clicked && !clicked.classList.contains('today')) {
                clicked.style.borderColor = 'rgba(0, 210, 255, 0.8)';
            }

            if (matches.length > 0) {
                articlePreview.innerHTML = matches.map(a => `
                    <a href="${a.permalink}" class="article-list-item">
                        <div class="article-icon">${a.mood || '📝'}</div>
                        <div class="article-info">
                            <h4>${a.title}</h4>
                            <span>${a.summary ? a.summary.substring(0, 100) + '...' : ''}</span>
                        </div>
                    </a>
                `).join('');

                articlePreview.style.display = 'block';
                articlePreview.style.opacity = '0';
                setTimeout(() => articlePreview.style.opacity = '1', 10);
            } else {
                articlePreview.innerHTML = `<div style="text-align:center; padding: 2rem; color: #8892b0">No activity on this date.</div>`;
            }
        });

        await fetchData();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPremiumCalendar);
    } else {
        initPremiumCalendar();
    }
})();
