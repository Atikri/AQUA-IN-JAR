class DailySudoku {
    constructor(canvasId, seed, difficulty = 'medium') {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.size = 9;
        this.rng = new DailyRNG(seed);
        this.difficulty = difficulty;
        this.board = []; // 9x9, value 1-9 or 0
        this.solution = [];
        this.fixed = []; // Boolean 9x9
        this.selected = { r: -1, c: -1 }; // {r, c}

        this.COLORS = {
            BG: '#fff',
            GRID_TEAL: '#b2d8d8', // Theming
            GRID_THICK: '#004d40',
            GRID_THIN: '#e0f2f1',
            TEXT: '#004d40',
            FIXED: '#000',
            HIGHLIGHT: '#e0f7fa',
            SELECTED: '#80cbc4',
            ERROR: '#ef9a9a'
        };

        this.init();
    }

    init() {
        this.generatePuzzle();
        this.calculateLayout();
        this.setupInput();
        this.render();
    }

    generatePuzzle() {
        // Full grid generation via backtracking
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.fillDiagonal();
        this.fillRemaining(0, 3);

        // Remove Digits to make puzzle
        this.board = this.solution.map(row => [...row]);
        this.fixed = Array(9).fill().map(() => Array(9).fill(true));

        let attempts = 40; // Default Medium
        if (this.difficulty === 'easy') attempts = 30;
        if (this.difficulty === 'hard') attempts = 50;
        while (attempts > 0) {
            let r = this.rng.nextInt(0, 9);
            let c = this.rng.nextInt(0, 9);
            if (this.board[r][c] !== 0) {
                this.board[r][c] = 0;
                this.fixed[r][c] = false;
                attempts--;
            }
        }
    }

    fillDiagonal() {
        for (let i = 0; i < 9; i = i + 3) {
            this.fillBox(i, i);
        }
    }

    fillBox(row, col) {
        let num;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                do {
                    num = this.rng.nextInt(1, 10);
                } while (!this.unUsedInBox(row, col, num));
                this.solution[row + i][col + j] = num;
            }
        }
    }

    unUsedInBox(rowStart, colStart, num) {
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                if (this.solution[rowStart + i][colStart + j] === num)
                    return false;
        return true;
    }

    fillRemaining(i, j) {
        if (j >= 9 && i < 9 - 1) {
            i = i + 1;
            j = 0;
        }
        if (i >= 9 && j >= 9) return true;
        if (i < 3) {
            if (j < 3) j = 3;
        } else if (i < 6) {
            if (j === (Math.floor(i / 3)) * 3) j = j + 3;
        } else {
            if (j === 6) {
                i = i + 1;
                j = 0;
                if (i >= 9) return true;
            }
        }

        for (let num = 1; num <= 9; num++) {
            if (this.checkIfSafe(i, j, num)) {
                this.solution[i][j] = num;
                if (this.fillRemaining(i, j + 1)) return true;
                this.solution[i][j] = 0;
            }
        }
        return false;
    }

    checkIfSafe(i, j, num) {
        return (this.unUsedInRow(i, num) &&
            this.unUsedInCol(j, num) &&
            this.unUsedInBox(i - i % 3, j - j % 3, num));
    }

    unUsedInRow(i, num) {
        for (let j = 0; j < 9; j++) if (this.solution[i][j] === num) return false;
        return true;
    }
    unUsedInCol(j, num) {
        for (let i = 0; i < 9; i++) if (this.solution[i][j] === num) return false;
        return true;
    }

    calculateLayout() {
        const size = Math.min(window.innerWidth - 40, 500);
        this.canvas.width = size;
        this.canvas.height = size;
        this.scale = window.devicePixelRatio || 1;
        this.canvas.style.width = size + "px";
        this.canvas.style.height = size + "px";
        this.canvas.width = size * this.scale;
        this.canvas.height = size * this.scale;
        this.ctx.scale(this.scale, this.scale);

        this.cellSize = size / 9;
    }

    setupInput() {
        const handleStart = (e) => {
            if (e.type !== 'mousedown') e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            let clientX, clientY;
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;

            let x = (clientX - rect.left) * scaleX;
            let y = (clientY - rect.top) * scaleY;

            const c = Math.floor(x / this.cellSize);
            const r = Math.floor(y / this.cellSize);

            if (r >= 0 && r < 9 && c >= 0 && c < 9) {
                this.selected = { r, c };
                this.render();
            }
        };

        this.canvas.addEventListener('mousedown', handleStart);
        this.canvas.addEventListener('touchstart', handleStart, { passive: false });

        // Keypad
        window.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '9') {
                this.handleInput(parseInt(e.key));
            } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
                this.handleInput(0);
            }
        });
    }

    handleInput(num) {
        if (this.selected.r === -1) return;
        if (this.fixed[this.selected.r][this.selected.c]) return;

        this.board[this.selected.r][this.selected.c] = num;
        this.render();
        this.checkWin();
    }

    render() {
        const ctx = this.ctx;
        const cs = this.cellSize;
        const W = this.canvas.width / this.scale;

        ctx.clearRect(0, 0, W, W);

        // Highlight Selected
        if (this.selected.r !== -1) {
            ctx.fillStyle = this.COLORS.HIGHLIGHT;
            // Highlight Row/Col
            ctx.fillRect(0, this.selected.r * cs, W, cs);
            ctx.fillRect(this.selected.c * cs, 0, cs, W);
            ctx.fillStyle = this.COLORS.SELECTED;
            ctx.fillRect(this.selected.c * cs, this.selected.r * cs, cs, cs);
        }

        // Draw Grid
        for (let i = 0; i <= 9; i++) {
            ctx.lineWidth = (i % 3 === 0) ? 3 : 1;
            ctx.strokeStyle = (i % 3 === 0) ? this.COLORS.GRID_THICK : this.COLORS.GRID_THICK;
            if (i % 3 !== 0) ctx.strokeStyle = '#80cbc4';

            ctx.beginPath();
            ctx.moveTo(i * cs, 0); ctx.lineTo(i * cs, W);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i * cs); ctx.lineTo(W, i * cs);
            ctx.stroke();
        }

        // Draw Numbers
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${cs * 0.6}px sans-serif`;

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                let val = this.board[r][c];
                if (val !== 0) {
                    ctx.fillStyle = this.fixed[r][c] ? this.COLORS.FIXED : this.COLORS.TEXT;
                    if (!this.fixed[r][c] && val !== this.solution[r][c]) {
                        // Optional: Error check immediately? or wait?
                        // Let's keep it simple for now, no instant tell
                    }
                    ctx.fillText(val, c * cs + cs / 2, r * cs + cs / 2);
                }
            }
        }
    }

    checkWin() {
        for (let r = 0; r < 9; r++)
            for (let c = 0; c < 9; c++) {
                if (this.board[r][c] !== this.solution[r][c]) return;
            }
        setTimeout(() => alert("SUDOKU SOLVED! 🔢"), 100);
    }
}
