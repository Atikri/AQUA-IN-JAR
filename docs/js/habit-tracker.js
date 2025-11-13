(function () {
  'use strict';

  const STORAGE_KEY = 'aqua-habit-plans-v1';
  let habits = [];

  function loadHabits() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        habits = JSON.parse(stored);
      } else {
        habits = [];
      }
    } catch (err) {
      console.error('加载习惯数据失败', err);
      habits = [];
    }
  }

  function saveHabits() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch (err) {
      console.error('保存习惯数据失败', err);
    }
  }

  function generateId() {
    return (
      Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    );
  }

  function todayISO() {
    return dateToISO(new Date());
  }

  function dateToISO(date) {
    if (!(date instanceof Date)) return '';
    return date.toISOString().slice(0, 10);
  }

  function parseISO(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split('-').map(Number);
    if (parts.length !== 3) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function diffInDays(laterISO, earlierISO) {
    const later = parseISO(laterISO);
    const earlier = parseISO(earlierISO);
    if (!later || !earlier) return 0;
    const diff = later.getTime() - earlier.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(dateStr) {
    const d = parseISO(dateStr);
    if (!d) return '未知';
    try {
      return new Intl.DateTimeFormat('zh-CN', {
        month: 'numeric',
        day: 'numeric'
      }).format(d);
    } catch (err) {
      return dateStr;
    }
  }

  function uniqueSortedLogs(logs) {
    const set = Array.from(new Set(logs || []));
    return set
      .filter(Boolean)
      .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  }

  function calculateStreaks(logs) {
    const sorted = uniqueSortedLogs(logs);
    if (sorted.length === 0) {
      return { current: 0, longest: 0, todayChecked: false };
    }

    const today = todayISO();
    const last = sorted[sorted.length - 1];
    let current = 0;
    let longest = 0;
    let temp = 1;

    for (let i = 1; i < sorted.length; i += 1) {
      const gap = diffInDays(sorted[i], sorted[i - 1]);
      if (gap === 1) {
        temp += 1;
      } else {
        longest = Math.max(longest, temp);
        temp = 1;
      }
    }
    longest = Math.max(longest, temp);

    const gapFromToday = diffInDays(today, last);
    if (gapFromToday > 1) {
      current = 0;
    } else {
      current = 1;
      for (let i = sorted.length - 1; i > 0; i -= 1) {
        const gap = diffInDays(sorted[i], sorted[i - 1]);
        if (gap === 1) {
          current += 1;
        } else {
          break;
        }
      }
      if (gapFromToday === 1) {
        // streak延续到昨天，提示需要今日打卡维持
      }
    }

    const todayChecked = sorted.includes(today);

    return { current, longest, todayChecked };
  }

  function getHabitStats(habit) {
    const logsSorted = uniqueSortedLogs(habit.logs);
    const targetDays = Math.max(parseInt(habit.targetDays, 10) || 0, 0);
    const completedCount = logsSorted.length;
    const remaining = Math.max(targetDays - completedCount, 0);
    const completion = targetDays
      ? Math.min((completedCount / targetDays) * 100, 100)
      : 0;

    const streak = calculateStreaks(logsSorted);

    const today = todayISO();
    const daysElapsed = Math.max(diffInDays(today, habit.startDate) + 1, 0);
    const expectedProgress = Math.min(daysElapsed, targetDays);
    const delta = completedCount - expectedProgress;

    let paceText = '节奏不错';
    if (delta > 1) {
      paceText = `领先 ${delta} 天`;
    } else if (delta === 1) {
      paceText = '领先 1 天';
    } else if (delta === 0) {
      paceText = '刚好在线';
    } else if (delta === -1) {
      paceText = '落后 1 天';
    } else if (delta < -1) {
      paceText = `落后 ${Math.abs(delta)} 天`;
    }

    const completed = targetDays > 0 && completedCount >= targetDays;

    return {
      logsSorted,
      targetDays,
      completedCount,
      remaining,
      completion: Math.round(completion),
      streak,
      delta,
      paceText,
      completed
    };
  }

  function renderSummary() {
    const summary = document.getElementById('habit-summary');
    if (!summary) return;

    if (habits.length === 0) {
      summary.style.display = 'none';
      return;
    }

    let totalLogs = 0;
    let totalPercent = 0;
    let bestStreak = 0;
    let completedCount = 0;

    habits.forEach((habit) => {
      const stats = getHabitStats(habit);
      totalLogs += stats.completedCount;
      totalPercent += stats.completion;
      bestStreak = Math.max(bestStreak, stats.streak.longest);
      if (stats.completed) {
        completedCount += 1;
      }
    });

    const avgCompletion = habits.length
      ? Math.round(totalPercent / habits.length)
      : 0;

    summary.style.display = 'flex';
    summary.innerHTML = `
      <div class="habit-summary__item">
        <span>正在进行</span>
        <strong>${habits.length} 个习惯</strong>
      </div>
      <div class="habit-summary__item">
        <span>平均完成度</span>
        <strong>${avgCompletion}%</strong>
      </div>
      <div class="habit-summary__item">
        <span>累计打卡</span>
        <strong>${totalLogs} 次</strong>
      </div>
      <div class="habit-summary__item">
        <span>最佳连击</span>
        <strong>${bestStreak} 天</strong>
      </div>
      <div class="habit-summary__item">
        <span>已完成计划</span>
        <strong>${completedCount} 个</strong>
      </div>
    `;
  }

  function toggleLog(habit, dateISO) {
    if (!dateISO) return;
    const logs = habit.logs || [];
    const idx = logs.indexOf(dateISO);
    if (idx === -1) {
      logs.push(dateISO);
    } else {
      logs.splice(idx, 1);
    }
    habit.logs = logs;
  }

  function isDateInFuture(dateISO) {
    return diffInDays(dateISO, todayISO()) > 0;
  }

  function isBeforeStart(habit, dateISO) {
    return diffInDays(dateISO, habit.startDate) < 0;
  }

  function renderCalendar(habit, grid) {
    const stats = getHabitStats(habit);
    const start = parseISO(habit.startDate) || new Date();
    const totalDays = stats.targetDays || 0;
    const limit = totalDays > 0 ? Math.min(totalDays, 70) : 30;
    const today = todayISO();
    const logsSet = new Set(stats.logsSorted);

    grid.innerHTML = '';

    for (let i = 0; i < limit; i += 1) {
      const date = addDays(start, i);
      const iso = dateToISO(date);
      if (!iso) continue;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'habit-day';
      button.textContent = String(i + 1);
      button.dataset.date = iso;

      if (logsSet.has(iso)) {
        button.classList.add('checked');
      }
      if (iso === today) {
        button.classList.add('today');
      }
      if (isDateInFuture(iso)) {
        button.classList.add('future');
        button.disabled = true;
      }
      if (isBeforeStart(habit, iso)) {
        button.disabled = true;
        button.classList.add('future');
      }

      button.addEventListener('click', () => {
        if (button.classList.contains('future')) return;
        toggleLog(habit, iso);
        saveHabits();
        renderHabits();
      });

      grid.appendChild(button);
    }

    const hint = grid.parentElement.querySelector('.habit-calendar__hint');
    if (hint) {
      if (totalDays > limit) {
        hint.textContent = `计划共 ${totalDays} 天，已展示前 ${limit} 天，可通过下方历史记录查看全部打卡`;
        hint.style.display = 'block';
      } else if (totalDays === 0) {
        hint.textContent = '已创建灵活型计划，可自由设置打卡天数';
        hint.style.display = 'block';
      } else {
        hint.style.display = 'none';
      }
    }
  }

  function createHabitCard(habit) {
    const stats = getHabitStats(habit);
    const card = document.createElement('article');
    card.className = `habit-card${stats.completed ? ' completed' : ''}`;

    const badge = stats.completed
      ? '<span class="habit-badge">🌟 计划完成</span>'
      : stats.streak.todayChecked
        ? '<span class="habit-badge">✅ 今日已打卡</span>'
        : '<span class="habit-badge">⏳ 今日待打卡</span>';

    card.innerHTML = `
      <div class="habit-card__header">
        <div>
          <h3 class="habit-card__title">🔥 ${escapeHtml(habit.name)}</h3>
          <p class="habit-card__meta">目标 ${stats.targetDays || '∞'} 天 · 开始于 ${formatDate(habit.startDate)}</p>
          ${badge}
        </div>
        <button class="habit-delete" data-id="${habit.id}">删除</button>
      </div>
      <div class="habit-progress">
        <div class="habit-progress__bar" style="width: ${stats.completion}%"></div>
      </div>
      <div class="habit-progress__label">${stats.completion}% 已完成</div>
      <div class="habit-stats">
        <div class="habit-stat">
          <span>已坚持</span>
          <strong>${stats.completedCount} 天</strong>
        </div>
        <div class="habit-stat">
          <span>剩余目标</span>
          <strong>${stats.remaining} 天</strong>
        </div>
        <div class="habit-stat">
          <span>当前连击</span>
          <strong>${stats.streak.current} 天</strong>
        </div>
        <div class="habit-stat">
          <span>最佳纪录</span>
          <strong>${stats.streak.longest} 天</strong>
        </div>
        <div class="habit-stat">
          <span>节奏</span>
          <strong>${stats.paceText}</strong>
        </div>
      </div>
      <div class="habit-card__actions">
        <button class="habit-btn primary" data-action="mark-today">${stats.streak.todayChecked ? '撤销今日打卡' : '今日打卡'}</button>
        <button class="habit-btn" data-action="fill-date">补打卡</button>
        <button class="habit-btn" data-action="toggle-history">历史记录</button>
      </div>
      <div class="habit-calendar">
        <div class="habit-calendar__grid"></div>
        <div class="habit-calendar__legend">
          <span><span class="dot"></span> 待完成</span>
          <span><span class="dot checked"></span> 已打卡</span>
          <span><span class="dot today"></span> 今天</span>
        </div>
        <p class="habit-calendar__hint"></p>
      </div>
      <div class="habit-history">
        <h4 class="habit-history__title">打卡记录（${stats.completedCount} 次）</h4>
        <div class="habit-history__list">
          ${
            stats.logsSorted.length
              ? stats.logsSorted
                  .map(
                    (date) =>
                      `<span class="habit-history__tag">${formatDate(date)} (${date})</span>`
                  )
                  .join('')
              : '<span class="habit-history__tag">暂无打卡</span>'
          }
        </div>
      </div>
    `;

    const grid = card.querySelector('.habit-calendar__grid');
    renderCalendar(habit, grid);

    const deleteBtn = card.querySelector('.habit-delete');
    deleteBtn.addEventListener('click', () => {
      if (confirm('确定删除这个习惯计划吗？打卡记录将一并移除。')) {
        habits = habits.filter((item) => item.id !== habit.id);
        saveHabits();
        renderHabits();
      }
    });

    const markBtn = card.querySelector('[data-action="mark-today"]');
    markBtn.addEventListener('click', () => {
      const iso = todayISO();
      const already = habit.logs.includes(iso);
      if (already) {
        if (confirm('已经完成今日打卡，是否撤销？')) {
          toggleLog(habit, iso);
          saveHabits();
          renderHabits();
        }
      } else {
        toggleLog(habit, iso);
        saveHabits();
        renderHabits();
      }
    });

    const fillBtn = card.querySelector('[data-action="fill-date"]');
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'habit-hidden-date';
    dateInput.style.position = 'absolute';
    dateInput.style.opacity = '0';
    dateInput.style.pointerEvents = 'none';
    card.appendChild(dateInput);

    dateInput.addEventListener('change', () => {
      const value = dateInput.value;
      if (!value) return;
      if (isBeforeStart(habit, value)) {
        alert('日期早于计划开始时间哦～');
        dateInput.value = '';
        return;
      }
      if (diffInDays(value, habit.startDate) >= habit.targetDays) {
        const confirmAdd = confirm(
          '日期超出了既定的目标天数，仍要记录这一天的打卡吗？'
        );
        if (!confirmAdd) {
          dateInput.value = '';
          return;
        }
      }
      toggleLog(habit, value);
      saveHabits();
      renderHabits();
      dateInput.value = '';
    });

    fillBtn.addEventListener('click', () => {
      if (dateInput.showPicker) {
        dateInput.showPicker();
      } else {
        dateInput.focus();
      }
    });

    const historyBtn = card.querySelector('[data-action="toggle-history"]');
    const historyBlock = card.querySelector('.habit-history');
    historyBtn.addEventListener('click', () => {
      historyBlock.classList.toggle('open');
    });

    return card;
  }

  function renderHabits() {
    const list = document.getElementById('habit-list');
    if (!list) return;
    list.innerHTML = '';

    if (!habits.length) {
      list.innerHTML = `
        <div class="habit-empty">
          <strong>还没有计划</strong>
          从一个小习惯开始，给自己一个温柔的挑战吧 🌱
        </div>
      `;
      renderSummary();
      return;
    }

    habits
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .forEach((habit) => {
        list.appendChild(createHabitCard(habit));
      });

    renderSummary();
  }

  function handleCreateHabit(event) {
    event.preventDefault();
    const nameInput = document.getElementById('habit-name');
    const daysInput = document.getElementById('habit-days');
    const startInput = document.getElementById('habit-start');

    const name = (nameInput.value || '').trim();
    const targetDays = parseInt(daysInput.value, 10);
    const startDate = startInput.value || todayISO();

    if (!name) {
      alert('请输入习惯名称～');
      nameInput.focus();
      return;
    }
    if (Number.isNaN(targetDays) || targetDays <= 0 || targetDays > 365) {
      alert('目标天数建议设置在 1~365 天之间哦');
      daysInput.focus();
      return;
    }

    const habit = {
      id: generateId(),
      name,
      targetDays,
      startDate,
      createdAt: Date.now(),
      logs: []
    };

    habits.unshift(habit);
    saveHabits();
    renderHabits();

    event.target.reset();
    startInput.value = todayISO();
    nameInput.focus();
  }

  function init() {
    const container = document.getElementById('habit-app');
    if (!container) return;

    container.innerHTML = `
      <h2 class="habit-app__title"><span class="emoji">🌊</span>习惯养成计划表</h2>
      <p style="margin-top: -0.6rem; margin-bottom: 1.6rem; color: rgba(29, 40, 75, 0.6);">
        设定目标天数，每天打卡，追踪你的养成进度与连击记录。
      </p>
      <form class="habit-form" id="habit-form">
        <div class="habit-form__group">
          <label for="habit-name">想坚持的习惯</label>
          <input type="text" id="habit-name" placeholder="如：每天喝 2000ml 水" maxlength="40" required>
        </div>
        <div class="habit-form__group">
          <label for="habit-days">目标天数</label>
          <input type="number" id="habit-days" min="1" max="365" placeholder="14" required>
        </div>
        <div class="habit-form__group">
          <label for="habit-start">开始日期</label>
          <input type="date" id="habit-start" required>
        </div>
        <button type="submit" class="habit-form__submit">创建计划</button>
      </form>
      <div id="habit-list" class="habit-list"></div>
      <div id="habit-summary" class="habit-summary" style="display: none;"></div>
    `;

    const form = document.getElementById('habit-form');
    const startInput = document.getElementById('habit-start');
    startInput.value = todayISO();

    form.addEventListener('submit', handleCreateHabit);

    loadHabits();
    renderHabits();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

