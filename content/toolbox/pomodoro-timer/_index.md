---
title: "番茄计时器"
date: 2025-01-27
description: "专注工作，高效休息。使用番茄工作法提升你的生产力"
---

🍅基于番茄工作法的时间管理工具，帮助你保持专注，提高工作效率。

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
        this.loadData();
        this.updateStats(); // 加载今日完成数量
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
        
        // 如果跳过的是工作模式，先增加计数
        if (this.currentMode === 'work') {
            this.incrementTodayCompleted();
        }
        
        // 切换到下一个模式
        this.switchMode();
        
        // 更新统计显示
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
        
        // 如果完成的是工作模式，先增加计数
        if (this.currentMode === 'work') {
            this.incrementTodayCompleted();
        }
        
        // 切换到下一个模式
        this.switchMode();
        
        // 更新统计显示
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
        this.updateStats(); // 更新统计信息
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
    
    incrementTodayCompleted() {
        const today = new Date().toDateString();
        const completed = this.getTodayCompleted();
        localStorage.setItem(`pomodoro_${today}`, completed + 1);
    }
    
    updateStats() {
        // 更新显示
        const todayCompletedElement = document.getElementById('today-completed');
        const currentCycleElement = document.getElementById('current-cycle');
        
        if (todayCompletedElement) {
            todayCompletedElement.textContent = this.getTodayCompleted();
        }
        if (currentCycleElement) {
            currentCycleElement.textContent = `${(this.cycleCount % 4) + 1}/4`;
        }
    }
    
    getTodayCompleted() {
        const today = new Date().toDateString();
        return parseInt(localStorage.getItem(`pomodoro_${today}`) || '0');
    }
    
    playNotificationSound() {
        // 创建更好听的提示音
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // 创建主音调
        const oscillator1 = audioContext.createOscillator();
        const gainNode1 = audioContext.createGain();
        
        // 创建和声
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        
        // 连接音频节点
        oscillator1.connect(gainNode1);
        oscillator2.connect(gainNode2);
        gainNode1.connect(audioContext.destination);
        gainNode2.connect(audioContext.destination);
        
        // 设置音调 - 使用更悦耳的音程
        oscillator1.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator2.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
        
        // 创建上升音调效果
        oscillator1.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator1.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2);
        oscillator1.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.4);
        
        oscillator2.frequency.setValueAtTime(659.25, audioContext.currentTime);
        oscillator2.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
        oscillator2.frequency.setValueAtTime(987.77, audioContext.currentTime + 0.4);
        
        // 设置音量包络 - 更柔和的音量变化
        gainNode1.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode1.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
        gainNode1.gain.setValueAtTime(0.2, audioContext.currentTime + 0.4);
        gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        
        gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode2.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.1);
        gainNode2.gain.setValueAtTime(0.15, audioContext.currentTime + 0.4);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        
        // 播放音效
        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 0.8);
        oscillator2.stop(audioContext.currentTime + 0.8);
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
let pomodoroTimer;
document.addEventListener('DOMContentLoaded', function() {
    // 请求通知权限
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // 创建番茄计时器实例并保存为全局变量
    pomodoroTimer = new PomodoroTimer();
});
</script>
