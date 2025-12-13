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

        const audioPath = this.resolveAudioPath();
        this.breakMusic = new Audio(audioPath);
        this.breakMusic.loop = true;
        this.breakMusic.addEventListener('error', (e) => {
            console.error('Error loading audio from path:', audioPath, e);
        });

        this.init();
    }

    resolveAudioPath() {
        // dynamic path resolution for subdirectory deployments
        try {
            const script = document.querySelector('script[src*="pomodoro-timer.js"]');
            if (script) {
                // Assumes structure: .../js/pomodoro-timer.js and .../audio/file.mp3
                // new URL('.', script.src) gives the directory of the script (.../js/)
                // So going up one level to static root is '..' relative to that?
                // Actually, new URL('../audio/...', script.src) works if script.src is the file.
                // Examples: 
                // script.src = "http://site.com/js/pomodoro-timer.js" -> new URL("../audio/x", src) = "http://site.com/audio/x"
                // script.src = "http://site.com/repo/js/pomodoro-timer.js" -> new URL("../audio/x", src) = "http://site.com/repo/audio/x"
                return new URL('../audio/rainy-day-lofi-guitar-drums-piano-216566.mp3', script.src).href;
            }
        } catch (e) {
            console.warn('Could not resolve audio path dynamically:', e);
        }
        // Fallback to absolute path
        return '/audio/rainy-day-lofi-guitar-drums-piano-216566.mp3';
    }

    init() {
        this.createTimerHTML();
        this.bindEvents();
        this.loadSettings();
        this.loadData();
        this.updateDisplay();
        this.updateModeUI();

        // Mobile-friendly audio unlock
        const unlockAudio = () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            // Pre-load audio to unlock generic audio playback
            this.breakMusic.load();
        };

        ['click', 'touchstart'].forEach(evt => {
            document.body.addEventListener(evt, unlockAudio, { once: true });
        });
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

        // Robust skip handling for mobile and desktop
        // Using a single handler function
        const handleSkip = (e) => {
            // Prevent default touch behavior (scrolling/zoom) if it's a touch event,
            // but also prevent default click behavior
            if (e.cancelable) e.preventDefault();
            e.stopPropagation();
            this.skipTimer();
        };

        if (skipBtn) {
            // Use touchstart for faster reaction on mobile
            // Use simple click for desktop
            // To avoid double firing if both fire:
            // Touchend is safer than touchstart for buttons to allow scrolling?
            // But user said "does nothing", implying lack of response.
            // Let's use click, but ensure it captures bubbles.

            // Actually, mobile browsers often wait 300ms on click. 
            // 'touchstart' is immediate.
            skipBtn.addEventListener('touchstart', handleSkip, { passive: false });
            skipBtn.addEventListener('click', (e) => {
                // If it was triggered by touch, we might get a click later 
                // We can't easily know. But handleSkip calls completeSession.
                // completeSession is idempotent regarding timer stop, but NOT regarding cycle count.
                // We need to debounce or throttle?
                // Or check e.isTrusted?

                // Let's keep it simple: Just handle click.
                // If the user says "does nothing", maybe it's not receiving click.
                // But touchstart is aggressive.

                // If I listen to touchstart AND click, I might get two skips.
                // I will listen to CLICK only, but with logging.
                // Wait, I promised to fix it. 
                // Most robust mobile fix: 'touchend'.
                // If I use 'touchend', I can preventDefault() to stop the click from firing.
            });

            // Re-implementing handleSkip attachment safely
            skipBtn.addEventListener('touchend', (e) => {
                e.preventDefault(); // Prevents mouse click generation
                e.stopPropagation();
                this.skipTimer();
            });

            skipBtn.addEventListener('click', (e) => {
                // This click will happen if not prevented by touchend.
                // Desktop clicks will come here.
                e.preventDefault();
                e.stopPropagation();
                this.skipTimer();
            });
        }

        // Manual mode switching
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

        // Update Skip button state based on music
        this.breakMusic.addEventListener('play', () => this.updateSkipButtonState());
        this.breakMusic.addEventListener('pause', () => this.updateSkipButtonState());
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

        // Manage music state on start
        if (this.currentMode !== 'work' && this.breakMusic.paused) {
            safelyPlayAudio(this.breakMusic);
        } else if (this.currentMode === 'work') {
            this.breakMusic.pause();
            this.breakMusic.currentTime = 0;
        }

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

        if (!this.breakMusic.paused) {
            this.breakMusic.pause();
        }

        this.saveData();
    }

    resetTimer() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.timer);
        this.breakMusic.pause();
        this.breakMusic.currentTime = 0;

        this.currentTime = this.getCurrentModeTime();
        this.updateDisplay();
        this.updateControlsState('initial');
        this.saveData();
    }

    skipTimer() {
        // Smart Skip: If in break and music is playing, stop music first
        const isBreak = this.currentMode !== 'work';
        if (isBreak && !this.breakMusic.paused) {
            this.breakMusic.pause();
            return;
        }
        this.completeSession();
    }

    completeSession() {
        clearInterval(this.timer);
        this.isRunning = false;

        // Visual update first for immediate feedback
        this.updateControlsState('initial');

        // Logic wrapper to prevent crashes
        try {
            this.handleSessionCompletionEffects();
        } catch (err) {
            console.error('Error during session completion effects:', err);
        }

        this.updateStats();
        this.switchModeAuto();
        this.saveData();
    }

    handleSessionCompletionEffects() {
        const justFinishedWork = this.currentMode === 'work';

        this.playNotificationSound(justFinishedWork);
        this.showNotification();

        if (justFinishedWork) {
            // Finished Work -> Entering Break
            this.breakMusic.currentTime = 0;
            safelyPlayAudio(this.breakMusic);
        } else {
            // Finished Break -> Entering Work
            this.breakMusic.pause();
            this.breakMusic.currentTime = 0;
        }
    }

    switchModeManual(mode) {
        this.isRunning = false;
        clearInterval(this.timer);
        this.breakMusic.pause();
        this.breakMusic.currentTime = 0;

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
        const timeDisplay = document.getElementById('time-text');
        if (timeDisplay) timeDisplay.textContent = timeText;

        if (this.currentTime % 5 === 0 || this.currentTime < 60) {
            this.updateTitle();
        }

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

    updateSkipButtonState() {
        const skipBtn = document.getElementById('skip-btn');
        if (!skipBtn) return;

        const isBreak = this.currentMode !== 'work';
        const isMusicPlaying = !this.breakMusic.paused;

        if (isBreak && isMusicPlaying) {
            skipBtn.innerHTML = '<span class="btn-icon">🔇</span>';
            skipBtn.classList.add('music-active');
            skipBtn.setAttribute('aria-label', 'Stop Music');
        } else {
            skipBtn.innerHTML = '<span class="btn-icon">⏭</span>';
            skipBtn.classList.remove('music-active');
            skipBtn.setAttribute('aria-label', 'Skip Session');
        }
    }

    updateModeUI() {
        this.updateSkipButtonState();
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

    playNotificationSound(justFinishedWork) {
        this.ensureAudioContext();
        if (!this.audioContext) return;

        // Only play alert when returning to work (Break -> Work)
        if (!justFinishedWork) {
            const ctx = this.audioContext;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;
            osc.type = 'sine';

            // Alert for back to work
            osc.frequency.setValueAtTime(880.00, now);
            osc.frequency.linearRampToValueAtTime(440.00, now + 0.3);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
            osc.start(now);
            osc.stop(now + 0.8);
        }
    }

    showNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            const isWork = this.currentMode === 'work';
            const msg = isWork ? 'Good job! Relax to the music.' : 'Break is over! Time to focus.';
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

// Helper for safe audio playback
function safelyPlayAudio(audioElement) {
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Auto-play was prevented:', error);
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    new PomodoroTimer();
});
