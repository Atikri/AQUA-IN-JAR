// 番茄计时器功能
class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60; // 25分钟
        this.shortBreakTime = 5 * 60; // 5分钟
        this.longBreakTime = 15 * 60; // 15分钟
        this.currentTime = this.workTime;
        this.isRunning = false;
        this.isPaused = false;
        this.currentMode = 'work'; // work, shortBreak, longBreak
        this.cycleCount = 0;
        this.timer = null;
        
        this.init();
    }
    
    init() {
        this.createTimerHTML();
        this.bindEvents();
        this.updateDisplay();
        this.loadSettings();
    }
    
    createTimerHTML() {
        const container = document.getElementById('pomodoro-timer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="pomodoro-container">
                <div class="timer-display">
                    <div class="mode-indicator">
                        <span id="current-mode">专注工作</span>
                        <span id="cycle-info">第 1 个番茄钟</span>
                    </div>
                    <div class="progress-ring">
                        <svg class="progress-circle" width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
                            <circle class="progress-bg" cx="100" cy="100" r="90"></circle>
                            <circle class="progress-bar" cx="100" cy="100" r="90" id="progress-circle" transform="rotate(-90 100 100)"></circle>
                            <text id="time-text" x="50%" y="50%" dy="0.35em" text-anchor="middle" alignment-baseline="middle" font-size="48" fill="#2c3e50" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">25:00</text>
                        </svg>
                    </div>
                </div>
                
                <div class="timer-controls">
                    <button id="start-pause-btn" class="control-btn primary">开始</button>
                    <button id="reset-btn" class="control-btn secondary">重置</button>
                    <button id="skip-btn" class="control-btn secondary">跳过</button>
                </div>
                
                <div class="timer-settings">
                    <div class="setting-group">
                        <label>工作时间 (分钟)</label>
                        <input type="number" id="work-time" value="25" min="1" max="60">
                    </div>
                    <div class="setting-group">
                        <label>短休息 (分钟)</label>
                        <input type="number" id="short-break-time" value="5" min="1" max="30">
                    </div>
                    <div class="setting-group">
                        <label>长休息 (分钟)</label>
                        <input type="number" id="long-break-time" value="15" min="1" max="60">
                    </div>
                </div>
                
                <div class="timer-stats">
                    <div class="stat-item">
                        <span class="stat-label">今日完成</span>
                        <span class="stat-value" id="today-completed">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">当前周期</span>
                        <span class="stat-value" id="current-cycle">1/4</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        document.getElementById('start-pause-btn')?.addEventListener('click', () => this.toggleTimer());
        document.getElementById('reset-btn')?.addEventListener('click', () => this.resetTimer());
        document.getElementById('skip-btn')?.addEventListener('click', () => this.skipTimer());
        
        // 设置变更事件
        document.getElementById('work-time')?.addEventListener('change', (e) => this.updateTimeSetting('work', e.target.value));
        document.getElementById('short-break-time')?.addEventListener('change', (e) => this.updateTimeSetting('shortBreak', e.target.value));
        document.getElementById('long-break-time')?.addEventListener('change', (e) => this.updateTimeSetting('longBreak', e.target.value));
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.toggleTimer();
            } else if (e.code === 'KeyR' && e.ctrlKey) {
                e.preventDefault();
                this.resetTimer();
            } else if (e.code === 'KeyS' && e.ctrlKey) {
                e.preventDefault();
                this.skipTimer();
            }
        });
    }
    
    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }
    
    startTimer() {
        this.isRunning = true;
        this.isPaused = false;
        document.getElementById('start-pause-btn').textContent = '暂停';
        document.getElementById('start-pause-btn').classList.add('paused');
        
        this.timer = setInterval(() => {
            this.currentTime--;
            this.updateDisplay();
            
            if (this.currentTime <= 0) {
                this.completeSession();
            }
        }, 1000);
    }
    
    pauseTimer() {
        this.isRunning = false;
        this.isPaused = true;
        document.getElementById('start-pause-btn').textContent = '继续';
        document.getElementById('start-pause-btn').classList.remove('paused');
        
        clearInterval(this.timer);
    }
    
    resetTimer() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.timer);
        
        this.currentTime = this.getCurrentModeTime();
        this.updateDisplay();
        
        document.getElementById('start-pause-btn').textContent = '开始';
        document.getElementById('start-pause-btn').classList.remove('paused');
    }
    
    skipTimer() {
        this.completeSession();
    }
    
    completeSession() {
        clearInterval(this.timer);
        this.isRunning = false;
        this.isPaused = false;
        
        // 播放提示音
        this.playNotificationSound();
        
        // 显示通知
        this.showNotification();
        
        // 切换到下一个模式
        this.switchMode();
        
        // 更新统计
        this.updateStats();
        
        // 保存数据
        this.saveData();
    }
    
    switchMode() {
        if (this.currentMode === 'work') {
            this.cycleCount++;
            if (this.cycleCount % 4 === 0) {
                this.currentMode = 'longBreak';
            } else {
                this.currentMode = 'shortBreak';
            }
        } else {
            this.currentMode = 'work';
        }
        
        this.currentTime = this.getCurrentModeTime();
        this.updateDisplay();
        this.updateModeIndicator();
    }
    
    getCurrentModeTime() {
        switch (this.currentMode) {
            case 'work': return this.workTime;
            case 'shortBreak': return this.shortBreakTime;
            case 'longBreak': return this.longBreakTime;
            default: return this.workTime;
        }
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        const timeText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('time-text').textContent = timeText;
        
        // 更新进度条
        this.updateProgress();
    }
    
    updateProgress() {
        const totalTime = this.getCurrentModeTime();
        const progress = ((totalTime - this.currentTime) / totalTime) * 100;
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (progress / 100) * circumference;
        
        const progressCircle = document.getElementById('progress-circle');
        if (progressCircle) {
            progressCircle.style.strokeDashoffset = offset;
        }
    }
    
    updateModeIndicator() {
        const modeText = {
            'work': '专注工作',
            'shortBreak': '短休息',
            'longBreak': '长休息'
        };
        
        document.getElementById('current-mode').textContent = modeText[this.currentMode];
        document.getElementById('cycle-info').textContent = `第 ${this.cycleCount + 1} 个番茄钟`;
    }
    
    updateTimeSetting(mode, value) {
        const time = parseInt(value) * 60;
        switch (mode) {
            case 'work': this.workTime = time; break;
            case 'shortBreak': this.shortBreakTime = time; break;
            case 'longBreak': this.longBreakTime = time; break;
        }
        
        if (this.currentMode === mode && !this.isRunning) {
            this.currentTime = time;
            this.updateDisplay();
        }
        
        this.saveSettings();
    }
    
    updateStats() {
        const today = new Date().toDateString();
        const completed = this.getTodayCompleted();
        
        if (this.currentMode === 'work') {
            localStorage.setItem(`pomodoro_${today}`, completed + 1);
        }
        
        document.getElementById('today-completed').textContent = this.getTodayCompleted();
        document.getElementById('current-cycle').textContent = `${(this.cycleCount % 4) + 1}/4`;
    }
    
    getTodayCompleted() {
        const today = new Date().toDateString();
        return parseInt(localStorage.getItem(`pomodoro_${today}`) || '0');
    }
    
    playNotificationSound() {
        // 创建简单的提示音
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    showNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            const message = this.currentMode === 'work' ? 
                '休息时间到了！' : '该开始工作了！';
            new Notification('番茄计时器', { body: message, icon: '/favicon.ico' });
        }
    }
    
    saveSettings() {
        const settings = {
            workTime: this.workTime,
            shortBreakTime: this.shortBreakTime,
            longBreakTime: this.longBreakTime
        };
        localStorage.setItem('pomodoro_settings', JSON.stringify(settings));
    }
    
    loadSettings() {
        const settings = localStorage.getItem('pomodoro_settings');
        if (settings) {
            const parsed = JSON.parse(settings);
            this.workTime = parsed.workTime || this.workTime;
            this.shortBreakTime = parsed.shortBreakTime || this.shortBreakTime;
            this.longBreakTime = parsed.longBreakTime || this.longBreakTime;
            
            // 更新输入框
            document.getElementById('work-time').value = this.workTime / 60;
            document.getElementById('short-break-time').value = this.shortBreakTime / 60;
            document.getElementById('long-break-time').value = this.longBreakTime / 60;
        }
    }
    
    saveData() {
        const data = {
            cycleCount: this.cycleCount,
            currentMode: this.currentMode,
            currentTime: this.currentTime,
            isRunning: this.isRunning,
            isPaused: this.isPaused
        };
        localStorage.setItem('pomodoro_state', JSON.stringify(data));
    }
    
    loadData() {
        const data = localStorage.getItem('pomodoro_state');
        if (data) {
            const parsed = JSON.parse(data);
            this.cycleCount = parsed.cycleCount || 0;
            this.currentMode = parsed.currentMode || 'work';
            this.currentTime = parsed.currentTime || this.getCurrentModeTime();
            this.isRunning = false; // 不自动恢复运行状态
            this.isPaused = false;
        }
    }
}

// 初始化番茄计时器
document.addEventListener('DOMContentLoaded', function() {
    // 请求通知权限
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // 创建番茄计时器实例
    new PomodoroTimer();
});
