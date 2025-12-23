class DailyPipes {
    constructor(canvasId, seed, size = 5) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.size = size;
        this.rng = new DailyRNG(seed);
        this.grid = []; // { type: 'I'|'L'|'T'|'X', rot: 0-3, locked: bool }
        this.source = { r: Math.floor(size / 2), c: Math.floor(size / 2) }; // Center start
        this.connected = []; // Boolean grid

        this.COLORS = {
            BG: '#1e293b', // Slate 800
            PIPE: '#475569', // Slate 600
            FLOW: '#38bdf8', // Sky 400 (Connected)
            SOURCE: '#f0f9ff',
            WIN_FLASH: '#ffffff',
            HIGHLIGHT: 'rgba(255,255,255,0.05)'
        };

        this.init();
    }

    init() {
        this.generatePuzzle();
        this.calculateLayout();
        this.setupInput();
        this.checkConnectivity();
        this.render();
    }

    generatePuzzle() {
        const N = this.size;
        // Generate a spanning tree (Randomized Prim's) to ensure full connectivity solution vertically/horizontally
        // Then convert nodes to pipe types based on neighbors

        // 1. Generate Tree
        let edges = [];
        let visited = Array(N).fill().map(() => Array(N).fill(false));
        // Start at center
        let start = this.source;
        visited[start.r][start.c] = true;
        let frontier = this.getNeighbors(start.r, start.c);

        // Track connections for each cell: Up, Right, Down, Left (0,1,2,3)
        let connections = Array(N).fill().map(() => Array(N).fill().map(() => [false, false, false, false]));

        while (frontier.length > 0) {
            // Pick random edge from frontier
            this.rng.shuffle(frontier);
            let next = frontier.pop();
            // If already visited, skip
            if (visited[next.r][next.c]) continue;

            // Connect to a visited neighbor
            let neighbors = this.getNeighbors(next.r, next.c).filter(n => visited[n.r][n.c]);
            this.rng.shuffle(neighbors);
            let parent = neighbors[0];

            // Mark connection
            this.connect(connections, parent, next);
            visited[next.r][next.c] = true;

            // Add new neighbors
            let newNeighbors = this.getNeighbors(next.r, next.c).filter(n => !visited[n.r][n.c]);
            frontier.push(...newNeighbors);
        }

        // 2. Add some loops (extra complexity)
        // Find adjacent cells not connected and connect them occasionally
        /*
        for(let r=0; r<N; r++) for(let c=0; c<N; c++) {
            if(this.rng.next() < 0.1) {
                // Try add Right or Down
                if (c < N-1 && !connections[r][c][1]) {
                    connections[r][c][1] = true;
                    connections[r][c+1][3] = true;
                }
            }
        }
        */

        // 3. Convert to Pipe Types & Random Rotation
        this.grid = [];
        for (let r = 0; r < N; r++) {
            let row = [];
            for (let c = 0; c < N; c++) {
                let cons = connections[r][c];
                // cons is [Up, Right, Down, Left]
                let type = this.getTypeFromCons(cons);
                // Randomize current rotation
                let rot = this.rng.nextInt(0, 4);

                // For center source, maybe don't rotate? Or do. Input handles it.
                row.push({ type: type.char, baseCons: type.cons, rot: rot });
            }
            this.grid.push(row);
        }
    }

    getNeighbors(r, c) {
        let n = [];
        if (r > 0) n.push({ r: r - 1, c });
        if (r < this.size - 1) n.push({ r: r + 1, c });
        if (c > 0) n.push({ r, c: c - 1 });
        if (c < this.size - 1) n.push({ r, c: c + 1 });
        return n;
    }

    connect(grid, n1, n2) {
        // n1 is parent, n2 is child. Find direction.
        if (n1.r - n2.r === 1) { // n1 is Below n2. n1 handles Up(0), n2 handles Down(2)
            grid[n1.r][n1.c][0] = true; grid[n2.r][n2.c][2] = true;
        } else if (n1.r - n2.r === -1) { // n1 is Above.
            grid[n1.r][n1.c][2] = true; grid[n2.r][n2.c][0] = true;
        } else if (n1.c - n2.c === 1) { // n1 is Right.
            grid[n1.r][n1.c][3] = true; grid[n2.r][n2.c][1] = true;
        } else if (n1.c - n2.c === -1) { // n1 is Left.
            grid[n1.r][n1.c][1] = true; grid[n2.r][n2.c][3] = true;
        }
    }

    getTypeFromCons(cons) {
        // [U, R, D, L]
        let num = cons.filter(Boolean).length;
        if (num === 1) return { char: 'END', cons: [1, 0, 0, 0] }; // Can be rotated to match
        // Map current cons to canonical type
        // I = Straight [1,0,1,0]
        // L = Corner [1,1,0,0]
        // T = Tee [1,1,1,0]
        // X = Cross [1,1,1,1]

        let sum = cons.map(b => b ? 1 : 0).join('');

        // We need to return the BASE type (Up-oriented) and how much we rotated to get the Input Cons
        // Actually, we store the Type (I, L, T, X) and just render rotation based on current state?
        // Wait, "connections" is the SOLUTION state.
        // We derive the Type from solution, then we RANDOMIZE 'rot'.

        // Correct approach:
        // Identify shape.
        if (num === 4) return { char: 'X', cons: [1, 1, 1, 1] };
        if (num === 3) return { char: 'T', cons: [1, 1, 1, 0] }; // Base T is Up,Right,Down (Left missing) ? No standard is usually "Point Up" -> Left,Up,Right
        if (num === 1) return { char: 'E', cons: [1, 0, 0, 0] }; // End cap Point Up

        // 2 is tricky: Line or Corner
        if ((cons[0] && cons[2]) || (cons[1] && cons[3])) return { char: 'I', cons: [1, 0, 1, 0] }; // Vertical
        return { char: 'L', cons: [1, 1, 0, 0] }; // Up-Right Corner
    }

    calculateLayout() {
        // Same robust layout logic
        const size = Math.min(window.innerWidth - 40, 500);
        this.canvas.width = size;
        this.canvas.height = size;
        this.scale = window.devicePixelRatio || 1;
        this.canvas.style.width = size + "px";
        this.canvas.style.height = size + "px";
        this.canvas.width = size * this.scale;
        this.canvas.height = size * this.scale;
        this.ctx.scale(this.scale, this.scale);
        this.cellSize = size / this.size;
    }

    setupInput() {
        const handleStart = (e) => {
            if (e.type !== 'mousedown') e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            let clientX = e.touches ? e.touches[0].clientX : e.clientX;
            let clientY = e.touches ? e.touches[0].clientY : e.clientY;

            // Scale logic
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            let x = (clientX - rect.left) * scaleX / this.scale;
            let y = (clientY - rect.top) * scaleY / this.scale;

            let c = Math.floor(x / this.cellSize);
            let r = Math.floor(y / this.cellSize);

            if (r >= 0 && r < this.size && c >= 0 && c < this.size) {
                this.rotateCell(r, c);
            }
        };

        this.canvas.addEventListener('mousedown', handleStart);
        this.canvas.addEventListener('touchstart', handleStart, { passive: false });
    }

    rotateCell(r, c) {
        // Rotate 90 deg clockwise
        this.grid[r][c].rot = (this.grid[r][c].rot + 1) % 4;
        this.checkConnectivity();
        this.render();
        this.checkWin();
    }

    getEffectiveCons(r, c) {
        // Return [U, R, D, L] based on type and current rot
        let cell = this.grid[r][c];
        let base = [];
        // Define base shapes (pointing "North/Up" or similar standard)
        if (cell.type === 'I') base = [1, 0, 1, 0]; // Vertical
        if (cell.type === 'L') base = [1, 1, 0, 0]; // North + East
        if (cell.type === 'T') base = [1, 1, 1, 0]; // North, East, South
        if (cell.type === 'X') base = [1, 1, 1, 1];
        if (cell.type === 'E') base = [1, 0, 0, 0]; // North

        // Shift array 'rot' times right (clockwise visual rotation corresponds to shifting indices?)
        // Standard: 0=U, 1=R, 2=D, 3=L
        // Rot 1 (90 CW): U becomes R. Index 0 moves to Index 1.
        let cons = [0, 0, 0, 0];
        for (let i = 0; i < 4; i++) {
            if (base[i]) {
                cons[(i + cell.rot) % 4] = 1;
            }
        }
        return cons;
    }

    checkConnectivity() {
        // BFS from Source
        const N = this.size;
        let connected = Array(N).fill().map(() => Array(N).fill(false));
        let q = [this.source];
        connected[this.source.r][this.source.c] = true;

        let filledCount = 0;

        while (q.length > 0) {
            let curr = q.shift();
            filledCount++;
            let r = curr.r, c = curr.c;
            let myCons = this.getEffectiveCons(r, c); // [U, R, D, L]

            // Check Neighbors
            // Up (0)
            if (myCons[0] && r > 0) {
                let nCons = this.getEffectiveCons(r - 1, c);
                if (nCons[2] && !connected[r - 1][c]) { // Neighbor has Down?
                    connected[r - 1][c] = true;
                    q.push({ r: r - 1, c });
                }
            }
            // Right (1)
            if (myCons[1] && c < N - 1) {
                let nCons = this.getEffectiveCons(r, c + 1);
                if (nCons[3] && !connected[r][c + 1]) { // Neighbor has Left?
                    connected[r][c + 1] = true;
                    q.push({ r, c: c + 1 });
                }
            }
            // Down (2)
            if (myCons[2] && r < N - 1) {
                let nCons = this.getEffectiveCons(r + 1, c);
                if (nCons[0] && !connected[r + 1][c]) { // Neighbor has Up?
                    connected[r + 1][c] = true;
                    q.push({ r: r + 1, c });
                }
            }
            // Left (3)
            if (myCons[3] && c > 0) {
                let nCons = this.getEffectiveCons(r, c - 1);
                if (nCons[1] && !connected[r][c - 1]) { // Neighbor has Right?
                    connected[r][c - 1] = true;
                    q.push({ r, c: c - 1 });
                }
            }
        }
        this.connectedGrid = connected;
        // Check "No Leaks" condition for win? 
        // Or just "All filled"? Standard Pipe game usually requires all pipes used.
        // But our generation logic uses all cells. So yes.
        return filledCount === N * N;
    }

    render() {
        const ctx = this.ctx;
        const cs = this.cellSize;
        const W = this.canvas.width / this.scale;

        ctx.clearRect(0, 0, W, W);

        // BG
        ctx.fillStyle = this.COLORS.BG;
        ctx.fillRect(0, 0, W, W);

        // Draw Pipes
        for (let r = 0; r < this.size; r++) for (let c = 0; c < this.size; c++) {
            this.drawPipe(r, c, cs);
        }

        // Highlight Source
        let sr = this.source.r, sc = this.source.c;
        ctx.fillStyle = this.COLORS.SOURCE;
        ctx.beginPath();
        ctx.arc(sc * cs + cs / 2, sr * cs + cs / 2, cs * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }

    drawPipe(r, c, cs) {
        const ctx = this.ctx;
        const cell = this.grid[r][c];
        const isFlowing = this.connectedGrid[r][c];

        let cx = c * cs + cs / 2;
        let cy = r * cs + cs / 2;
        let thick = cs * 0.2;

        ctx.strokeStyle = isFlowing ? this.COLORS.FLOW : this.COLORS.PIPE;
        ctx.lineWidth = thick;
        ctx.lineCap = 'round';

        // Rotate context to simplify drawing
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(cell.rot * Math.PI / 2);

        // Draw Base Shape (Defined as Pointing North)
        ctx.beginPath();
        if (cell.type === 'I') {
            ctx.moveTo(0, -cs / 2); ctx.lineTo(0, cs / 2);
        } else if (cell.type === 'L') {
            ctx.moveTo(0, -cs / 2); ctx.lineTo(0, 0); ctx.lineTo(cs / 2, 0);
        } else if (cell.type === 'T') {
            ctx.moveTo(-cs / 2, 0); ctx.lineTo(cs / 2, 0); // Left to Right
            ctx.moveTo(0, 0); ctx.lineTo(0, -cs / 2); // Center to Up
        } else if (cell.type === 'X') {
            ctx.moveTo(0, -cs / 2); ctx.lineTo(0, cs / 2);
            ctx.moveTo(-cs / 2, 0); ctx.lineTo(cs / 2, 0);
        } else if (cell.type === 'E') {
            ctx.moveTo(0, 0); ctx.lineTo(0, -cs / 2);
            // Cap end?
            ctx.arc(0, 0, thick / 2, 0, Math.PI * 2);
        }
        ctx.stroke();
        ctx.restore();
    }

    checkWin() {
        // 1. All connected? 
        // 2. No open ends? (Implicit if all connected in a square grid of valid pipes usually, but loose ends might exist if rot prevents connection)
        // Strictly: Every connection must meet a connection.

        let allConnected = true;
        for (let r = 0; r < this.size; r++) for (let c = 0; c < this.size; c++) {
            if (!this.connectedGrid[r][c]) { allConnected = false; break; }

            // Check leaks (My connection points to Nothing or Non-connection)
            let myCons = this.getEffectiveCons(r, c);
            const N = this.size;

            // Up
            if (myCons[0]) {
                if (r === 0) return; // Pointing off grid
                let nCons = this.getEffectiveCons(r - 1, c);
                if (!nCons[2]) return; // Neighbor doesn't point back
            }
            // Right
            if (myCons[1]) {
                if (c === N - 1) return;
                let nCons = this.getEffectiveCons(r, c + 1);
                if (!nCons[3]) return;
            }
            // Down
            if (myCons[2]) {
                if (r === N - 1) return;
                let nCons = this.getEffectiveCons(r + 1, c);
                if (!nCons[0]) return;
            }
            // Left
            if (myCons[3]) {
                if (c === 0) return;
                let nCons = this.getEffectiveCons(r, c - 1);
                if (!nCons[1]) return;
            }
        }

        if (allConnected) {
            setTimeout(() => alert("⚡ POWER RESTORED! Great job!"), 50);
        }
    }
}
