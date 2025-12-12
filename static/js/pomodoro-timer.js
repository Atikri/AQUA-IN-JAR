// Pomodoro Timer Functionality
class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60;
        this.shortBreakTime = 5 * 60;
        this.longBreakTime = 15 * 60;
        this.currentTime = this.workTime;
        this.isRunning = false;
        this.isPaused = false;
        this.currentMode = 'work'; // work, shortBreak, longBreak
        this.cycleCount = 0;
        this.timer = null;
        this.audioContext = null;

        this.init();
    }

    init() {
        this.createTimerHTML();
        this.bindEvents();
        this.loadSettings();
        this.loadData();
        this.updateDisplay();
        this.updateModeUI();

        // Request audio context interaction
        document.body.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }, { once: true });
    }

    createTimerHTML() {
        const container = document.getElementById('pomodoro-timer');
        if (!container) return;

        container.innerHTML = `
            <div class="pomodoro-container glass-card">
                <div class="timer-header">
                    <div class="mode-badges">
                        <button class="mode-badge active" data-mode="work">Focus</button>
                        <button class="mode-badge" data-mode="shortBreak">Short Break</button>
                        <button class="mode-badge" data-mode="longBreak">Long Break</button>
                    </div>
                </div>

                <div class="task-input-section">
                    <input type="text" id="current-task" class="task-input" placeholder="What are you working on?" value="${localStorage.getItem('pomodoro_current_task') || ''}">
                </div>
                
                <div class="timer-display-section">
                    <div class="progress-ring-container">
                        <svg class="progress-circle" width="260" height="260" viewBox="0 0 260 260">
                            <defs>
                                <linearGradient id="gradient-work" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="#ff7e5f" />
                                    <stop offset="100%" stop-color="#feb47b" />
                                </linearGradient>
                                <linearGradient id="gradient-break" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="#4facfe" />
                                    <stop offset="100%" stop-color="#00f2fe" />
                                </linearGradient>
                            </defs>
                            <circle class="progress-bg" cx="130" cy="130" r="120"></circle>
                            <circle class="progress-bar" cx="130" cy="130" r="120" id="progress-circle" transform="rotate(-90 130 130)"></circle>
                        </svg>
                        <div class="time-overlay">
                            <div id="time-text" class="time-text">25:00</div>
                            <div id="cycle-info" class="cycle-text">Cycle 1/4</div>
                        </div>
                    </div>
                </div>
                
                <div class="timer-controls">
                    <button id="start-pause-btn" class="control-btn primary" aria-label="Start Timer">
                        <span class="btn-icon">▶</span>
                    </button>
                    <button id="reset-btn" class="control-btn secondary" aria-label="Reset Timer">
                        <span class="btn-icon">↺</span>
                    </button>
                    <button id="skip-btn" class="control-btn secondary" aria-label="Skip Session">
                        <span class="btn-icon">⏭</span>
                    </button>
                </div>
                
                <div class="timer-footer">
                    <div class="stat-item">
                        <span class="stat-value" id="today-completed">0</span>
                        <span class="stat-label">completed today</span>
                    </div>
                    <button id="settings-toggle" class="settings-btn">⚙ Settings</button>
                </div>

                <div id="settings-panel" class="settings-panel hidden">
                    <div class="settings-content">
                        <h3>Timer Settings</h3>
                        <div class="setting-group">
                            <label>Focus (min)</label>
                            <input type="number" id="work-time" value="25" min="1" max="90">
                        </div>
                        <div class="setting-group">
                            <label>Short Break (min)</label>
                            <input type="number" id="short-break-time" value="5" min="1" max="30">
                        </div>
                        <div class="setting-group">
                            <label>Long Break (min)</label>
                            <input type="number" id="long-break-time" value="15" min="1" max="60">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const startBtn = document.getElementById('start-pause-btn');
        const resetBtn = document.getElementById('reset-btn');
        const skipBtn = document.getElementById('skip-btn');

        startBtn?.addEventListener('click', () => this.toggleTimer());
        resetBtn?.addEventListener('click', () => this.resetTimer());
        skipBtn?.addEventListener('click', () => this.skipTimer());

        document.querySelectorAll('.mode-badge').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                if (this.currentMode !== mode) {
                    if (this.isRunning && !confirm('Switching modes will reset current timer. Continue?')) return;
                    this.switchModeManual(mode);
                }
            });
        });

        document.getElementById('current-task')?.addEventListener('input', (e) => {
            localStorage.setItem('pomodoro_current_task', e.target.value);
            this.updateTitle();
        });

        const settingsPanel = document.getElementById('settings-panel');
        document.getElementById('settings-toggle')?.addEventListener('click', () => {
            settingsPanel.classList.toggle('hidden');
        });

        ['work-time', 'short-break-time', 'long-break-time'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', (e) => {
                const map = { 'work-time': 'work', 'short-break-time': 'shortBreak', 'long-break-time': 'longBreak' };
                this.updateTimeSetting(map[id], e.target.value);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;
            if (e.code === 'Space') {
                e.preventDefault();
                this.toggleTimer();
            }
            if (e.code === 'KeyR' && e.ctrlKey) {
                e.preventDefault();
                this.resetTimer();
            }
        });
    }

    toggleTimer() {
        if (this.isRunning) this.pauseTimer();
        else this.startTimer();
    }

    startTimer() {
        this.isRunning = true;
        this.isPaused = false;
        this.updateControlsState('running');
        this.ensureAudioContext();

        this.timer = setInterval(() => {
            this.currentTime--;
            this.updateDisplay();

            if (this.currentTime <= 0) {
                this.completeSession();
            }
        }, 1000);
        this.saveData();
    }

    pauseTimer() {
        this.isRunning = false;
        this.isPaused = true;
        this.updateControlsState('paused');
        clearInterval(this.timer);
        this.saveData();
    }

    resetTimer() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.timer);
        this.currentTime = this.getCurrentModeTime();
        this.updateDisplay();
        this.updateControlsState('initial');
        this.saveData();
    }

    skipTimer() {
        this.completeSession();
    }

    completeSession() {
        clearInterval(this.timer);
        this.isRunning = false;
        this.playNotificationSound();
        this.showNotification();
        this.updateStats(); // Update stats BEFORE switching mode
        this.switchModeAuto();
        this.updateControlsState('initial');
        this.saveData();
    }

    switchModeManual(mode) {
        this.isRunning = false;
        clearInterval(this.timer);
        this.currentMode = mode;
        this.currentTime = this.getCurrentModeTime();
        this.updateDisplay();
        this.updateModeUI();
        this.updateControlsState('initial');
        this.saveData();
    }

    switchModeAuto() {
        if (this.currentMode === 'work') {
            this.cycleCount++;
            this.currentMode = (this.cycleCount % 4 === 0) ? 'longBreak' : 'shortBreak';
        } else {
            this.currentMode = 'work';
        }
        this.currentTime = this.getCurrentModeTime();
        this.updateDisplay();
        this.updateModeUI();
    }

    getCurrentModeTime() {
        return this[this.currentMode + 'Time'];
    }

    updateDisplay() {
        const timeText = this.formatTime(this.currentTime);
        document.getElementById('time-text').textContent = timeText;
        this.updateTitle();

        const totalTime = this.getCurrentModeTime();
        const progress = ((totalTime - this.currentTime) / totalTime);
        const circumference = 2 * Math.PI * 120; // r=120
        const dashoffset = circumference * (1 - progress);

        const progressCircle = document.getElementById('progress-circle');
        if (progressCircle) {
            progressCircle.style.strokeDasharray = circumference;
            progressCircle.style.strokeDashoffset = dashoffset;
        }
    }

    updateTitle() {
        const timeText = this.formatTime(this.currentTime);
        const task = document.getElementById('current-task')?.value || 'Focus';
        const modeEmoji = this.currentMode === 'work' ? '🍅' : '☕';
        document.title = `${timeText} - ${modeEmoji} ${task}`;
    }

    formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    updateModeUI() {
        document.querySelectorAll('.mode-badge').forEach(b => {
            b.classList.toggle('active', b.dataset.mode === this.currentMode);
        });

        const container = document.querySelector('.pomodoro-container');
        if (container) {
            container.classList.remove('mode-work', 'mode-shortBreak', 'mode-longBreak');
            container.classList.add(`mode-${this.currentMode}`);
        }

        document.getElementById('cycle-info').textContent = `Cycle ${Math.floor(this.cycleCount / 4) + 1} - ${this.cycleCount % 4 + 1}/4`;
    }

    updateControlsState(state) {
        const btn = document.getElementById('start-pause-btn');
        if (!btn) return;
        if (state === 'running') {
            btn.innerHTML = '<span class="btn-icon">⏸</span>';
            btn.classList.add('active');
        } else {
            btn.innerHTML = '<span class="btn-icon">▶</span>';
            btn.classList.remove('active');
        }
    }

    updateTimeSetting(mode, value) {
        this[mode + 'Time'] = parseInt(value) * 60;
        if (this.currentMode === mode && !this.isRunning) {
            this.currentTime = this[mode + 'Time'];
            this.updateDisplay();
        }
        this.saveSettings();
    }

    updateStats() {
        // If we were working, add to today's count
        if (this.currentMode === 'work') {
            const today = new Date().toDateString();
            const current = this.getTodayCompleted();
            localStorage.setItem(`pomodoro_${today}`, current + 1);
            document.getElementById('today-completed').textContent = current + 1;
        }
    }

    getTodayCompleted() {
        const today = new Date().toDateString();
        return parseInt(localStorage.getItem(`pomodoro_${today}`) || '0');
    }

    ensureAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    playNotificationSound() {
        this.ensureAudioContext();
        if (!this.audioContext) return;

        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;
        osc.type = 'sine';

        // Check "previous" mode (which is still currentMode at this point in logic if we call before switch)
        // Actually completeSession calls playNotificationSound BEFORE switchModeAuto.
        // So this.currentMode is the one that just finished.

        if (this.currentMode === 'work') {
            // Work finished -> Happy break sound
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.1); // G5
            osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.2); // C6
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
            osc.start(now);
            osc.stop(now + 1.5);
        } else {
            // Break finished -> "Back to work" alert
            osc.frequency.setValueAtTime(659.25, now); // E5
            osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.1); // A5
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
            osc.start(now);
            osc.stop(now + 1.2);
        }
    }

    showNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            const isWork = this.currentMode === 'work';
            const msg = isWork ? 'Good job! Take a break.' : 'Break is over! Time to focus.';
            new Notification('Pomodoro Timer', { body: msg, icon: '/favicon.ico' });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }

    saveSettings() {
        localStorage.setItem('pomodoro_settings', JSON.stringify({
            workTime: this.workTime,
            shortBreakTime: this.shortBreakTime,
            longBreakTime: this.longBreakTime
        }));
    }

    loadSettings() {
        const s = JSON.parse(localStorage.getItem('pomodoro_settings'));
        if (s) {
            this.workTime = s.workTime || this.workTime;
            this.shortBreakTime = s.shortBreakTime || this.shortBreakTime;
            this.longBreakTime = s.longBreakTime || this.longBreakTime;

            const workInp = document.getElementById('work-time');
            if (workInp) workInp.value = this.workTime / 60;
            const shortInp = document.getElementById('short-break-time');
            if (shortInp) shortInp.value = this.shortBreakTime / 60;
            const longInp = document.getElementById('long-break-time');
            if (longInp) longInp.value = this.longBreakTime / 60;
        }
    }

    saveData() {
        localStorage.setItem('pomodoro_state', JSON.stringify({
            cycleCount: this.cycleCount,
            currentMode: this.currentMode,
            currentTime: this.currentTime,
            lastSaved: new Date().getTime()
        }));
    }

    loadData() {
        const d = JSON.parse(localStorage.getItem('pomodoro_state'));
        if (d && (new Date().getTime() - d.lastSaved < 12 * 60 * 60 * 1000)) {
            this.cycleCount = d.cycleCount || 0;
            this.currentMode = d.currentMode || 'work';
            this.currentTime = d.currentTime;
            document.getElementById('today-completed').textContent = this.getTodayCompleted();
        } else {
            document.getElementById('today-completed').textContent = this.getTodayCompleted();
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    new PomodoroTimer();
});
