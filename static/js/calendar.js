(function () {
    function initCalendarWidget() {
        const calendarContainer = document.getElementById('calendar-component');
        if (!calendarContainer) return;

        // Reset if it exists to allow re-initialization on Swup navigation
        calendarContainer.dataset.initialized = 'false';

        // Prevent race conditions with initialization
        if (calendarContainer.dataset.loading === 'true') return;
        calendarContainer.dataset.loading = 'true';

        let articles = [];
        let currentDate = new Date();

        // Restore date from storage if available
        try {
            const saved = localStorage.getItem('calendarDate');
            if (saved) {
                const date = new Date(saved);
                if (!isNaN(date)) currentDate = date;
            }
        } catch (e) { }

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        async function init() {
            try {
                // Focus on calendar.json as the main source
                const res = await fetch('/calendar.json?t=' + Date.now());
                if (!res.ok) throw new Error("Could not load /calendar.json");
                articles = await res.json();

                renderCalendar(currentDate);
            } catch (error) {
                console.error('Calendar Error:', error);
                calendarContainer.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">Calendar data currently unavailable.</div>`;
            } finally {
                calendarContainer.dataset.loading = 'false';
            }
        }

        function renderCalendar(date) {
            localStorage.setItem('calendarDate', date.toISOString());
            const year = date.getFullYear();
            const month = date.getMonth();
            const firstDay = new Date(year, month, 1);
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const startDay = firstDay.getDay();

            let html = `
                <div class="calendar-widget">
                    <div class="calendar-header">
                        <h3 class="calendar-title">${monthNames[month]} ${year}</h3>
                        <div class="calendar-nav">
                            <button id="cal-prev" title="Prev">&larr;</button>
                            <button id="cal-today">Today</button>
                            <button id="cal-next" title="Next">&rarr;</button>
                        </div>
                    </div>
                    <div class="calendar-grid">
                        ${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => `<div class="calendar-weekday">${d}</div>`).join('')}
            `;

            for (let i = 0; i < startDay; i++) html += `<div class="calendar-day empty"></div>`;

            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dailyArticles = articles.filter(a => a.date === dateStr);
                const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

                html += `
                    <div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}">
                        <span>${day}</span>
                        ${dailyArticles.length > 0 ? `<div class="calendar-dot ${dailyArticles[0].wordCount > 1000 ? 'heavy' : ''}"></div>` : ''}
                    </div>
                `;
            }

            html += `</div><div id="calendar-article-card"></div></div>`;
            calendarContainer.innerHTML = html;

            // Nav listeners
            calendarContainer.querySelector('#cal-prev').onclick = () => { date.setMonth(date.getMonth() - 1); renderCalendar(date); };
            calendarContainer.querySelector('#cal-next').onclick = () => { date.setMonth(date.getMonth() + 1); renderCalendar(date); };
            calendarContainer.querySelector('#cal-today').onclick = () => { const now = new Date(); renderCalendar(now); };

            // Day listeners
            calendarContainer.querySelectorAll('.calendar-day:not(.empty)').forEach(el => {
                el.onclick = () => {
                    const dateVal = el.dataset.date;
                    const matches = articles.filter(a => a.date === dateVal);
                    const card = calendarContainer.querySelector('#calendar-article-card');
                    if (matches.length > 0) {
                        card.innerHTML = matches.map(a => `<div class="article-card"><h3><a href="${a.permalink}">${a.mood || '📝'} ${a.title}</a></h3></div>`).join('');
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                };
            });
        }

        init();
    }

    window.initCalendarWidget = initCalendarWidget;

    // Runs on initial load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCalendarWidget);
    } else {
        initCalendarWidget();
    }

    // Fallback for other potential navigation-based re-runs
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) initCalendarWidget();
    });
})();
