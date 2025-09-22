---
title: "番茄计时器"
date: 2025-01-27
description: "专注工作，高效休息。使用番茄工作法提升你的生产力"
---

🍅基于番茄工作法的时间管理工具，帮助你保持专注，提高工作效率。

## 🎵 专注音乐

在专注学习时，可以播放轻柔的背景音乐来提升效率。我们为你准备了精选的专注音乐播放列表。

<div class="music-player">
    <div class="music-controls">
        <button id="prev-btn" class="music-btn prev-btn" onclick="previousTrack()" title="上一首">
            <span>⏮️</span>
        </button>
        <button id="play-music-btn" class="music-btn play-btn" onclick="toggleMusic()" title="播放/暂停">
            <span id="play-icon">▶️</span>
        </button>
        <button id="next-btn" class="music-btn next-btn" onclick="nextTrack()" title="下一首">
            <span>⏭️</span>
        </button>
        <div class="music-info">
            <div class="music-title" id="current-title">Instrumental Study</div>
            <div class="music-subtitle" id="current-artist">Soft and contemplative piano music</div>
            <div class="track-info">
                <span id="current-track">1</span> / <span id="total-tracks">5</span>
            </div>
        </div>
        <div class="volume-control">
            <span>🔊</span>
            <input type="range" id="volume-slider" min="0" max="100" value="30" onchange="setVolume(this.value)">
        </div>
    </div>
    <div class="music-status" id="music-status">点击播放按钮开始音乐</div>
    <div class="playlist-info">
        <small>💡 提示：由于版权限制，这里播放的是示例音频。你可以打开 <a href="https://open.spotify.com/playlist/37i9dQZF1DX9sIqqvKsjG8?si=4f451714f7eb43f1" target="_blank" style="color: rgba(255,255,255,0.8);">Spotify播放列表</a> 在后台播放</small>
    </div>
</div>

## 什么是番茄工作法？

番茄工作法是一种时间管理方法，由弗朗西斯科·西里洛于1992年创立。基本流程是：

1. **25分钟专注工作** - 全身心投入当前任务
2. **5分钟短休息** - 放松身心，为下一个番茄钟做准备
3. **每4个番茄钟后** - 进行15-30分钟的长休息

## 使用说明

- 🎯 **工作模式**：25分钟专注时间
- ☕ **短休息**：5分钟休息时间  
- 🌴 **长休息**：15分钟深度休息
- ⏸️ **暂停/继续**：随时控制计时器
- 🔄 **重置**：重新开始当前阶段

---

<div id="pomodoro-timer"></div>

<style>
.pomodoro-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 音乐播放器样式 */
.music-player {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 30px;
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.music-controls {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
}

.music-controls .music-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 16px;
}

.music-controls .music-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

.music-controls .play-btn {
    width: 55px;
    height: 55px;
    font-size: 20px;
}

.music-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 18px;
}

.music-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

.music-info {
    flex: 1;
}

.music-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 5px;
}

.music-subtitle {
    font-size: 14px;
    opacity: 0.8;
}

.track-info {
    font-size: 12px;
    opacity: 0.7;
    margin-top: 5px;
}

.playlist-info {
    margin-top: 15px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    text-align: center;
}

.volume-control {
    display: flex;
    align-items: center;
    gap: 10px;
}

.volume-control input[type="range"] {
    width: 80px;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    outline: none;
    -webkit-appearance: none;
}

.volume-control input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
}

.music-status {
    text-align: center;
    font-size: 14px;
    opacity: 0.9;
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
}

.timer-display {
    text-align: center;
    margin-bottom: 20px;
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.mode-indicator {
    margin-bottom: 15px;
}

.mode-indicator span {
    display: block;
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
}

#current-mode {
    font-size: 24px;
    color: #e74c3c;
}

#cycle-info {
    font-size: 16px;
    color: #7f8c8d;
}

.time-display {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    pointer-events: none;
}

#time-text {
    font-size: 48px;
    font-weight: 300;
    color: #2c3e50;
    font-variant-numeric: tabular-nums;
    margin: 0;
}

.progress-ring {
    position: relative;
    display: inline-block;
    width: 200px;
    height: 200px;
}

.progress-circle {
    transform: rotate(-90deg);
}

.progress-bg {
    fill: none;
    stroke: #ecf0f1;
    stroke-width: 8;
}

.progress-bar {
    fill: none;
    stroke: #e74c3c;
    stroke-width: 8;
    stroke-linecap: round;
    stroke-dasharray: 565.48;
    stroke-dashoffset: 565.48;
    transition: stroke-dashoffset 1s linear;
}

.timer-controls {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 20px;
}

.control-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 80px;
    min-height: 44px; /* 确保触摸目标足够大 */
    touch-action: manipulation; /* 优化触摸响应 */
    -webkit-tap-highlight-color: transparent; /* 移除点击高亮 */
    user-select: none; /* 防止文本选择 */
}

.control-btn.primary {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
}

.control-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
}

.control-btn.primary.paused {
    background: linear-gradient(135deg, #f39c12, #e67e22);
    box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
}

.control-btn.secondary {
    background: #ecf0f1;
    color: #2c3e50;
    border: 2px solid #bdc3c7;
}

.control-btn.secondary:hover {
    background: #d5dbdb;
    transform: translateY(-1px);
}

.timer-settings {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
}

.setting-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.setting-group:last-child {
    margin-bottom: 0;
}

.setting-group label {
    font-weight: 500;
    color: #2c3e50;
}

.setting-group input {
    width: 80px;
    padding: 8px 12px;
    border: 2px solid #bdc3c7;
    border-radius: 6px;
    text-align: center;
    font-size: 14px;
}

.setting-group input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.timer-stats {
    display: flex;
    justify-content: space-around;
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
}

.stat-item {
    text-align: center;
}

.stat-label {
    display: block;
    font-size: 14px;
    color: #7f8c8d;
    margin-bottom: 5px;
}

.stat-value {
    display: block;
    font-size: 24px;
    font-weight: 600;
    color: #2c3e50;
}

/* 统一响应式设计 - 所有设备使用相同的布局 */
@media (max-width: 768px) {
    .pomodoro-container {
        padding: 15px;
        max-width: 100%;
    }
    
    .music-controls {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }
    
    .music-controls .music-btn {
        width: 40px;
        height: 40px;
        font-size: 14px;
    }
    
    .music-controls .play-btn {
        width: 50px;
        height: 50px;
        font-size: 18px;
    }
    
    .music-info {
        order: 2;
    }
    
    .volume-control {
        order: 3;
        justify-content: center;
    }
    
    .music-controls .prev-btn,
    .music-controls .play-btn,
    .music-controls .next-btn {
        order: 1;
        display: inline-flex;
        margin: 0 5px;
    }
    
    .timer-controls {
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
    
    .control-btn {
        width: 100%;
        max-width: 200px;
        min-height: 48px;
    }
    
    .timer-settings {
        padding: 15px;
    }
    
    .setting-group {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
    
    .setting-group input {
        width: 100%;
        max-width: 100px;
    }
    
    .timer-stats {
        flex-direction: column;
        gap: 15px;
    }
}
</style>

<script>
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
                        <svg class="progress-circle" width="200" height="200">
                            <circle class="progress-bg" cx="100" cy="100" r="90"></circle>
                            <circle class="progress-bar" cx="100" cy="100" r="90" id="progress-circle"></circle>
                        </svg>
                        <div class="time-display">
                            <span id="time-text">25:00</span>
                        </div>
                    </div>
                </div>
                
                <div class="timer-controls">
                    <button id="start-pause-btn" class="control-btn primary" onclick="pomodoroTimer.toggleTimer()">开始</button>
                    <button id="reset-btn" class="control-btn secondary" onclick="pomodoroTimer.resetTimer()">重置</button>
                    <button id="skip-btn" class="control-btn secondary" onclick="pomodoroTimer.skipTimer()">跳过</button>
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
        console.log('=== SKIP TIMER CALLED ===');
        console.log('Current mode:', this.currentMode);
        console.log('Is running:', this.isRunning);
        
        // 停止当前计时器
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
        
        // 确保按钮状态正确
        const startPauseBtn = document.getElementById('start-pause-btn');
        if (startPauseBtn) {
            startPauseBtn.textContent = '开始';
            startPauseBtn.classList.remove('paused');
            console.log('Button state updated to 开始');
        } else {
            console.error('Start/Pause button not found!');
        }
        
        console.log('=== SKIP TIMER COMPLETED ===');
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
        
        // 确保按钮状态正确
        document.getElementById('start-pause-btn').textContent = '开始';
        document.getElementById('start-pause-btn').classList.remove('paused');
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

// 音乐播放器功能
let musicPlayer = null;
let isMusicPlaying = false;
let currentVolume = 30;

// 音乐播放列表 - 基于Spotify的Instrumental Study播放列表
const musicPlaylist = [
    {
        title: "Windswept",
        artist: "J. Alke",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" // 示例音频，实际使用时需要替换为真实音频URL
    },
    {
        title: "There Is Light", 
        artist: "Alfons Daiminger",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        title: "Particles",
        artist: "Malmkvist", 
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        title: "In Green",
        artist: "Arlo Thiem",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        title: "Equinox",
        artist: "J. Alke",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        title: "New",
        artist: "Marco Apicella",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        title: "Olivanders",
        artist: "Adjoa Bekoe",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        title: "Molto piano",
        artist: "Alex Laude",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        title: "Forgotten Photographs",
        artist: "Arata Rin",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        title: "Whirlwinds of Life",
        artist: "Francis Monet",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    }
];

let currentTrackIndex = 0;

function initMusicPlayer() {
    // 创建音频对象
    musicPlayer = new Audio();
    musicPlayer.loop = false; // 不循环单曲，而是播放整个播放列表
    musicPlayer.volume = currentVolume / 100;
    
    // 设置第一首歌曲
    loadTrack(currentTrackIndex);
    
    // 更新总曲目数
    document.getElementById('total-tracks').textContent = musicPlaylist.length;
    
    // 监听音频事件
    musicPlayer.addEventListener('loadstart', () => {
        updateMusicStatus('正在加载音乐...');
    });
    
    musicPlayer.addEventListener('canplay', () => {
        updateMusicStatus('音乐已准备就绪');
    });
    
    musicPlayer.addEventListener('error', () => {
        updateMusicStatus('音乐加载失败，请检查网络连接');
    });
    
    // 监听歌曲结束事件，自动播放下一首
    musicPlayer.addEventListener('ended', () => {
        nextTrack();
    });
}

function loadTrack(index) {
    if (musicPlaylist[index]) {
        const track = musicPlaylist[index];
        musicPlayer.src = track.url;
        updateMusicInfo(track.title, track.artist);
        updateTrackInfo(index + 1);
    }
}

function updateMusicInfo(title, artist) {
    document.getElementById('current-title').textContent = title;
    document.getElementById('current-artist').textContent = artist;
}

function updateTrackInfo(trackNumber) {
    document.getElementById('current-track').textContent = trackNumber;
}

function updateMusicStatus(message) {
    document.getElementById('music-status').textContent = message;
}

function toggleMusic() {
    if (!musicPlayer) {
        initMusicPlayer();
    }
    
    if (isMusicPlaying) {
        musicPlayer.pause();
        document.getElementById('play-icon').textContent = '▶️';
        updateMusicStatus('音乐已暂停');
        isMusicPlaying = false;
    } else {
        musicPlayer.play().then(() => {
            document.getElementById('play-icon').textContent = '⏸️';
            updateMusicStatus('正在播放专注音乐');
            isMusicPlaying = true;
        }).catch((error) => {
            console.error('播放音乐失败:', error);
            updateMusicStatus('播放失败，请检查浏览器设置');
        });
    }
}

function setVolume(value) {
    currentVolume = parseInt(value);
    if (musicPlayer) {
        musicPlayer.volume = currentVolume / 100;
    }
    updateMusicStatus(`音量: ${currentVolume}%`);
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % musicPlaylist.length;
    loadTrack(currentTrackIndex);
    
    if (isMusicPlaying) {
        musicPlayer.play().then(() => {
            updateMusicStatus(`正在播放: ${musicPlaylist[currentTrackIndex].title}`);
        }).catch((error) => {
            console.error('播放下一首失败:', error);
            updateMusicStatus('播放失败，请检查浏览器设置');
        });
    } else {
        updateMusicStatus(`已切换到: ${musicPlaylist[currentTrackIndex].title}`);
    }
}

function previousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + musicPlaylist.length) % musicPlaylist.length;
    loadTrack(currentTrackIndex);
    
    if (isMusicPlaying) {
        musicPlayer.play().then(() => {
            updateMusicStatus(`正在播放: ${musicPlaylist[currentTrackIndex].title}`);
        }).catch((error) => {
            console.error('播放上一首失败:', error);
            updateMusicStatus('播放失败，请检查浏览器设置');
        });
    } else {
        updateMusicStatus(`已切换到: ${musicPlaylist[currentTrackIndex].title}`);
    }
}

// 初始化番茄计时器
let pomodoroTimer;
document.addEventListener('DOMContentLoaded', function() {
    // 请求通知权限
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // 创建番茄计时器实例并保存为全局变量
    pomodoroTimer = new PomodoroTimer();
    
    // 初始化音乐播放器
    initMusicPlayer();
});
</script>
