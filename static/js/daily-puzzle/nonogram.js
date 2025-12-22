class DailyNonogram {
    constructor(canvasId, seed, size = 10) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.size = size; // 10x10 usually
        this.rng = new DailyRNG(seed);
        this.solution = []; // 0 or 1
        this.playerGrid = []; // 0=Empty, 1=Fill, 2=X
        this.rowHints = [];
        this.colHints = [];

        this.COLORS = {
            BG: '#fff',
            GRID: '#ccc',
            FILL: '#333',
            X: '#ef4444',
            HIGHLIGHT: '#f3f4f6',
            HINT_BG: '#e5e7eb',
            LINE_THICK: '#000'
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
        const N = this.size;
        // Generate random grid pattern
        // Or specific shapes if we get fancy. Random noise is hard to solve sometimes.
        // Let's generate "blobs" via Cellular Automata or just 50% noise
        this.solution = Array(N).fill().map(() => Array(N).fill(0));

        // Simple noise
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
            if (this.rng.next() < 0.55) this.solution[r][c] = 1;
        }

        // Calculate Hints
        this.rowHints = this.solution.map(row => this.getHints(row));
        this.colHints = [];
        for (let c = 0; c < N; c++) {
            let col = [];
            for (let r = 0; r < N; r++) col.push(this.solution[r][c]);
            this.colHints.push(this.getHints(col));
        }

        this.playerGrid = Array(N).fill().map(() => Array(N).fill(0));
    }

    getHints(line) {
        let hints = [];
        let current = 0;
        for (let val of line) {
            if (val === 1) current++;
            else if (current > 0) {
                hints.push(current);
                current = 0;
            }
        }
        if (current > 0) hints.push(current);
        if (hints.length === 0) hints.push(0);
        return hints;
    }

    calculateLayout() {
        const size = Math.min(window.innerWidth - 40, 500);
        this.scale = window.devicePixelRatio || 1;

        // Hints take up ~25% space
        const hintSize = size * 0.25;
        const gridSize = size - hintSize;

        this.hintSize = hintSize;
        this.gridSize = gridSize;
        this.cellSize = gridSize / this.size;

        this.canvas.width = size * this.scale;
        this.canvas.height = size * this.scale;
        this.canvas.style.width = size + "px";
        this.canvas.style.height = size + "px";
        this.ctx.scale(this.scale, this.scale);
    }

    setupInput() {
        const handleStart = (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            let clientX = e.touches ? e.touches[0].clientX : e.clientX;
            let clientY = e.touches ? e.touches[0].clientY : e.clientY;

            let x = clientX - rect.left - this.hintSize;
            let y = clientY - rect.top - this.hintSize;

            if (x < 0 || y < 0) return; // Clicked Hints

            const c = Math.floor(x / this.cellSize);
            const r = Math.floor(y / this.cellSize);

            if (c < this.size && r < this.size) {
                this.toggleCell(r, c, e.button === 2);
            }
        };

        this.canvas.addEventListener('mousedown', handleStart);
        this.canvas.addEventListener('contextmenu', e => e.preventDefault());
    }

    toggleCell(r, c, isRight) {
        let cur = this.playerGrid[r][c];
        if (isRight) {
            if (cur === 2) this.playerGrid[r][c] = 0;
            else this.playerGrid[r][c] = 2; // X
        } else {
            if (cur === 1) this.playerGrid[r][c] = 2; // Cycle: Fill -> X -> Empty
            else if (cur === 2) this.playerGrid[r][c] = 0;
            else this.playerGrid[r][c] = 1;
        }
        this.render();
        this.checkWin();
    }

    render() {
        const ctx = this.ctx;
        const HS = this.hintSize;
        const CS = this.cellSize;
        const W = this.canvas.width / this.scale;

        ctx.clearRect(0, 0, W, W);

        // Draw Hints Background
        ctx.fillStyle = this.COLORS.HINT_BG;
        ctx.fillRect(0, 0, HS, W);
        ctx.fillRect(0, 0, W, HS);

        ctx.fillStyle = this.COLORS.FILL;
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw Top Hints
        for (let c = 0; c < this.size; c++) {
            let hints = this.colHints[c];
            let h = hints.length * 14;
            let startY = HS - h;
            for (let i = 0; i < hints.length; i++) {
                ctx.fillText(hints[i], HS + c * CS + CS / 2, startY + i * 14 + 7);
            }
        }

        // Draw Left Hints
        for (let r = 0; r < this.size; r++) {
            let hints = this.rowHints[r];
            let w = hints.length * 14; // Approximate width needed
            let startX = HS - w - 5;
            for (let i = 0; i < hints.length; i++) {
                ctx.fillText(hints[i], startX + i * 14 + 7, HS + r * CS + CS / 2);
            }
        }

        // Draw Grid
        ctx.translate(HS, HS);

        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                let x = c * CS, y = r * CS;

                let state = this.playerGrid[r][c];
                if (state === 1) {
                    ctx.fillStyle = this.COLORS.FILL;
                    ctx.fillRect(x, y, CS, CS);
                } else if (state === 2) {
                    ctx.fillStyle = this.COLORS.X;
                    ctx.beginPath();
                    ctx.moveTo(x + 2, y + 2); ctx.lineTo(x + CS - 2, y + CS - 2);
                    ctx.moveTo(x + CS - 2, y + 2); ctx.lineTo(x + 2, y + CS - 2);
                    ctx.stroke();
                }

                ctx.strokeStyle = this.COLORS.GRID;
                ctx.strokeRect(x, y, CS, CS);
            }
        }

        // Thick Lines (5x5)
        ctx.strokeStyle = this.COLORS.LINE_THICK;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(5 * CS, 0); ctx.lineTo(5 * CS, this.size * CS);
        ctx.moveTo(0, 5 * CS); ctx.lineTo(this.size * CS, 5 * CS);
        ctx.stroke();

        ctx.translate(-HS, -HS);
    }

    checkWin() {
        for (let r = 0; r < this.size; r++) for (let c = 0; c < this.size; c++) {
            let target = this.solution[r][c];
            let actual = this.playerGrid[r][c] === 1 ? 1 : 0;
            if (target !== actual) return;
        }
        setTimeout(() => alert("PICTURE REVEALED! ⬛"), 100);
    }
}
