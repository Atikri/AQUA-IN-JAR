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

/* 平板设备 (769px - 1024px) */
@media (max-width: 1024px) and (min-width: 769px) {
    .pomodoro-container {
        padding: 15px;
        max-width: 90%;
    }
    
    .progress-ring {
        width: 190px;
        height: 190px;
    }
    
    .progress-circle {
        width: 190px;
        height: 190px;
    }
    
    #time-text {
        font-size: 40px;
    }
    
    .timer-controls {
        gap: 12px;
    }
    
    .control-btn {
        padding: 12px 20px;
        font-size: 15px;
        min-height: 48px;
    }
}

/* 手机设备 (最大768px) */
@media (max-width: 768px) {
    .pomodoro-container {
        padding: 8px;
        max-width: 100%;
        margin: 0;
    }
    
    .timer-display {
        padding: 12px;
        margin-bottom: 12px;
        border-radius: 8px;
    }
    
    .mode-indicator {
        margin-bottom: 8px;
    }
    
    .mode-indicator span {
        font-size: 14px;
        margin-bottom: 2px;
    }
    
    #current-mode {
        font-size: 18px;
    }
    
    #cycle-info {
        font-size: 12px;
    }
    
    .progress-ring {
        width: 160px;
        height: 160px;
    }
    
    .progress-circle {
        width: 160px;
        height: 160px;
    }
    
    #time-text {
        font-size: 28px;
    }
    
    .timer-controls {
        flex-direction: column;
        align-items: center;
        margin-bottom: 12px;
        gap: 8px;
    }
    
    .control-btn {
        width: 100%;
        max-width: 180px;
        padding: 12px 16px;
        font-size: 14px;
        min-height: 48px;
        border-radius: 20px;
    }
    
    .timer-settings {
        margin-bottom: 12px;
        padding: 12px;
        border-radius: 8px;
    }
    
    .setting-group {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
        margin-bottom: 10px;
    }
    
    .setting-group label {
        font-size: 13px;
        font-weight: 600;
    }
    
    .setting-group input {
        width: 100%;
        max-width: 80px;
        padding: 6px 10px;
        font-size: 13px;
    }
    
    .timer-stats {
        flex-direction: column;
        gap: 12px;
        margin-top: 8px;
        padding: 12px;
        border-radius: 8px;
    }
    
    .stat-label {
        font-size: 11px;
    }
    
    .stat-value {
        font-size: 18px;
    }
}

/* 小屏手机设备 (最大480px) */
@media (max-width: 480px) {
    .pomodoro-container {
        padding: 5px;
    }
    
    .timer-display {
        padding: 10px;
        margin-bottom: 10px;
    }
    
    .mode-indicator {
        margin-bottom: 6px;
    }
    
    .mode-indicator span {
        font-size: 12px;
    }
    
    #current-mode {
        font-size: 16px;
    }
    
    #cycle-info {
        font-size: 11px;
    }
    
    .progress-ring {
        width: 140px;
        height: 140px;
    }
    
    .progress-circle {
        width: 140px;
        height: 140px;
    }
    
    #time-text {
        font-size: 24px;
    }
    
    .timer-controls {
        gap: 6px;
        margin-bottom: 10px;
    }
    
    .control-btn {
        padding: 10px 14px;
        font-size: 13px;
        min-height: 44px;
        max-width: 160px;
    }
    
    .timer-settings {
        padding: 10px;
        margin-bottom: 10px;
    }
    
    .setting-group {
        margin-bottom: 8px;
        gap: 4px;
    }
    
    .setting-group label {
        font-size: 12px;
    }
    
    .setting-group input {
        max-width: 70px;
        padding: 5px 8px;
        font-size: 12px;
    }
    
    .timer-stats {
        padding: 10px;
        gap: 10px;
    }
    
    .stat-label {
        font-size: 10px;
    }
    
    .stat-value {
        font-size: 16px;
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
        // 绑定按钮事件 - 同时支持点击和触摸
        const startPauseBtn = document.getElementById('start-pause-btn');
        const resetBtn = document.getElementById('reset-btn');
        const skipBtn = document.getElementById('skip-btn');
        
        // 通用事件处理函数
        const handleButtonEvent = (callback, buttonName) => {
            return (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`${buttonName} button triggered:`, e.type); // 调试日志
                callback();
            };
        };
        
        if (startPauseBtn) {
            const startPauseHandler = handleButtonEvent(() => this.toggleTimer(), 'Start/Pause');
            startPauseBtn.addEventListener('click', startPauseHandler);
            startPauseBtn.addEventListener('touchend', startPauseHandler);
            startPauseBtn.addEventListener('touchstart', (e) => e.preventDefault()); // 防止触摸延迟
        }
        
        if (resetBtn) {
            const resetHandler = handleButtonEvent(() => this.resetTimer(), 'Reset');
            resetBtn.addEventListener('click', resetHandler);
            resetBtn.addEventListener('touchend', resetHandler);
            resetBtn.addEventListener('touchstart', (e) => e.preventDefault());
        }
        
        if (skipBtn) {
            const skipHandler = handleButtonEvent(() => this.skipTimer(), 'Skip');
            skipBtn.addEventListener('click', skipHandler);
            skipBtn.addEventListener('touchend', skipHandler);
            skipBtn.addEventListener('touchstart', (e) => e.preventDefault());
            
            // 添加额外的触摸事件支持
            skipBtn.addEventListener('touchcancel', (e) => e.preventDefault());
        }
        
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
        
        // 全局触摸事件处理 - 确保触摸设备上的响应
        document.addEventListener('touchstart', (e) => {
            // 防止触摸时的默认行为（如滚动）
            if (e.target.classList.contains('control-btn')) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // 添加触摸设备检测
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) {
            console.log('Touch device detected, enhanced touch support enabled');
            // 为所有控制按钮添加额外的触摸支持
            document.querySelectorAll('.control-btn').forEach(btn => {
                btn.style.touchAction = 'manipulation';
                btn.style.webkitTapHighlightColor = 'transparent';
            });
        }
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
        console.log('skipTimer called - current mode:', this.currentMode, 'isRunning:', this.isRunning); // 调试日志
        
        try {
            // 停止当前计时器
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
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
                console.log('Button state updated to 开始'); // 调试日志
            } else {
                console.error('Start/Pause button not found!'); // 调试日志
            }
            
            console.log('skipTimer completed successfully'); // 调试日志
        } catch (error) {
            console.error('Error in skipTimer:', error); // 调试日志
        }
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

// 初始化番茄计时器
document.addEventListener('DOMContentLoaded', function() {
    // 请求通知权限
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // 创建番茄计时器实例
    new PomodoroTimer();
});
</script>
