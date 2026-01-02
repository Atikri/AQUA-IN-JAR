class DailyBridges {
    constructor(canvasId, seed, size = 7) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.size = size;
        this.rng = new DailyRNG(seed);
        this.islands = [];
        this.bridges = []; // {u, v, count}
        this.selectedNode = null; // For Tap-Tap interaction

        this.COLORS = {
            BG: '#f0f9ff',
            ISLAND: '#fff',
            TEXT: '#0f172a',
            BRIDGE: '#3b82f6',
            HIGHLIGHT: 'rgba(59, 130, 246, 0.4)', // Stronger highlight for selection
            ERROR: '#ef4444',
            COMPLETE: '#10b981'
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
        // Simple Generation:
        // 1. Place random nodes (grid based)
        // 2. Connect them with Spanning Tree (ensure connectivity)
        // 3. Add random extra edges for complexity
        // 4. Calculate required counts
        // 5. Clear edges (Player starts empty)

        const N = this.size;
        // Grid-based islands
        let grid = Array(N).fill().map(() => Array(N).fill(null));
        let nodes = [];

        // Populate Grid (Density ~30-40%)
        let idCounter = 0;
        for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
                if (this.rng.next() < 0.35) {
                    let node = { id: idCounter++, r, c, req: 0, cur: 0 };
                    nodes.push(node);
                    grid[r][c] = node;
                }
            }
        }

        // Ensure at least 4 nodes
        if (nodes.length < 4) {
            this.generatePuzzle(); // Retry
            return;
        }

        // Generate Solution Edges
        // Prim's or Randomized DFS to connect component
        let connected = new Set();
        connected.add(nodes[0]);
        let solutionEdges = [];

        // While not all connected
        // Simple approach: Add edges until connected
        // We need Valid Orthogonal Lines without crossing

        // Let's use a simpler "Construction" approach:
        // 1. Pick random node A in Connected
        // 2. Find closest neighbor B in Unconnected (Orthogonal)
        // 3. Add edge, add B to Connected

        let unvisited = new Set(nodes.slice(1));
        let currentSet = [nodes[0]];

        while (unvisited.size > 0) {
            this.rng.shuffle(currentSet);
            let added = false;

            for (let u of currentSet) {
                // Find neighbors
                let neighbors = this.findVisibleNeighbors(u, grid, solutionEdges);
                // Filter only unvisited
                let candidates = neighbors.filter(n => unvisited.has(n.node));

                if (candidates.length > 0) {
                    this.rng.shuffle(candidates);
                    let target = candidates[0];
                    solutionEdges.push({ u, v: target.node, count: 1 }); // Single bridge initially
                    unvisited.delete(target.node);
                    currentSet.push(target.node);
                    added = true;
                    break;
                }
            }

            // If stuck, restart (bad initial distribution)
            if (!added) break;
        }

        if (unvisited.size > 0) {
            this.generatePuzzle(); // Retry
            return;
        }

        // Add extra randomization (double bridges or cycles)
        // Iterate existing edges, maybe upgrade to 2
        for (let e of solutionEdges) {
            if (this.rng.next() < 0.4) e.count = 2;
        }

        // Calculate Requirements
        for (let e of solutionEdges) {
            e.u.req += e.count;
            e.v.req += e.count;
        }

        this.islands = nodes;
        this.bridges = []; // Empty for player
    }

    findVisibleNeighbors(node, grid, existingEdges) {
        // Look Up, Down, Left, Right
        let neighbors = [];
        const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

        for (let d of dirs) {
            let r = node.r + d[0];
            let c = node.c + d[1];
            while (r >= 0 && r < this.size && c >= 0 && c < this.size) {
                if (grid[r][c]) {
                    // Check if edge blocked by existing crossing?
                    // Our generation builds incrementally, so we just check if line segment implies crossing
                    // But for simple "Closest neighbor", usually safe if we picked closest.
                    neighbors.push({ node: grid[r][c] });
                    break;
                }
                r += d[0];
                c += d[1];
            }
        }
        return neighbors;
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
        this.cellSize = size / (this.size + 1);
        this.padding = this.cellSize / 2;
    }

    setupInput() {
        // Hybrid Interaction: Supports both Tap-Tap and Drag-Release
        this.selectedNode = null;
        this.dragStartNode = null;
        this.currentMouse = null; // For drawing drag line

        const handleStart = (e) => {
            if (e.type !== 'mousedown') e.preventDefault();
            const { x, y } = this.getEventCoords(e);

            let node = this.getNodeAt(x, y);
            if (node) {
                // Drag Init
                this.dragStartNode = node;
                this.currentMouse = { x, y };

                // Tap Selection (Optimistic)
                if (this.selectedNode && this.selectedNode !== node) {
                    // If we tapped B after A, we might be completing a tap-tap
                    // But we also might be starting a drag from B
                    // We'll resolve on Up
                }
            } else {
                // Clicked void
                this.selectedNode = null;
            }
            this.render();
        };

        const handleMove = (e) => {
            if (this.dragStartNode) {
                e.preventDefault();
                const { x, y } = this.getEventCoords(e);
                this.currentMouse = { x, y };
                this.render();
            }
        };

        const handleEnd = (e) => {
            if (this.dragStartNode) {
                // Resolve Drag or Tap
                let { x, y } = this.currentMouse;
                let endNode = this.getNodeAt(x, y);

                if (endNode && endNode !== this.dragStartNode) {
                    // Successful Drag to different node
                    this.toggleBridge(this.dragStartNode, endNode);
                    this.selectedNode = null; // Clear selection if drag succeeded
                } else {
                    // Drag ended on same node = TAP
                    if (this.selectedNode) {
                        if (this.selectedNode === this.dragStartNode) {
                            this.selectedNode = null; // Deselect
                        } else {
                            this.toggleBridge(this.selectedNode, this.dragStartNode);
                            this.selectedNode = null;
                        }
                    } else {
                        // Select it
                        this.selectedNode = this.dragStartNode;
                    }
                }

                this.dragStartNode = null;
                this.currentMouse = null;
                this.render();
                this.checkWin();
            }
        };

        this.canvas.addEventListener('mousedown', handleStart);
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleEnd);

        this.canvas.addEventListener('touchstart', handleStart, { passive: false });
        this.canvas.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('touchend', handleEnd);
    }

    getEventCoords(e) {
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
        return {
            x: (clientX - rect.left) * scaleX / this.scale,
            y: (clientY - rect.top) * scaleY / this.scale
        };
    }

    getNodeAt(x, y) {
        const cs = this.cellSize;
        const p = this.padding;
        for (let n of this.islands) {
            let nx = n.c * cs + cs + p;
            let ny = n.r * cs + cs + p;
            if (Math.hypot(nx - x, ny - y) < cs * 0.45) return n;
        }
        return null;
    }

    toggleBridge(u, v) {
        // Orthogonal check
        if (u.r !== v.r && u.c !== v.c) return;

        // Check bounds or crossing (simplified)

        // Find existing
        let idx = this.bridges.findIndex(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));

        if (idx >= 0) {
            // Cycle: 1 -> 2 -> 0
            this.bridges[idx].count++;
            if (this.bridges[idx].count > 2) {
                this.bridges.splice(idx, 1);
            }
        } else {
            // Add new
            this.bridges.push({ u, v, count: 1 });
        }

        // Recalculate currents
        this.updateCounts();
    }

    updateCounts() {
        for (let n of this.islands) n.cur = 0;
        for (let e of this.bridges) {
            e.u.cur += e.count;
            e.v.cur += e.count;
        }
    }

    render() {
        const ctx = this.ctx;
        const cs = this.cellSize;
        const p = this.padding;
        const W = this.canvas.width / this.scale;

        ctx.clearRect(0, 0, W, W);

        // Draw Bridges
        ctx.strokeStyle = this.COLORS.BRIDGE;
        ctx.lineWidth = 3;

        for (let e of this.bridges) {
            let x1 = e.u.c * cs + cs + p;
            let y1 = e.u.r * cs + cs + p;
            let x2 = e.v.c * cs + cs + p;
            let y2 = e.v.r * cs + cs + p;

            if (e.count === 1) {
                ctx.beginPath();
                ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
                ctx.stroke();
            } else {
                // Double line
                let dx = (y2 - y1) === 0 ? 0 : 4;
                let dy = (x2 - x1) === 0 ? 0 : 4;
                ctx.beginPath();
                ctx.moveTo(x1 - dx, y1 - dy); ctx.lineTo(x2 - dx, y2 - dy);
                ctx.moveTo(x1 + dx, y1 + dy); ctx.lineTo(x2 + dx, y2 + dy);
                ctx.stroke();
            }
        }

        // Draw Active Selection Ring
        if (this.selectedNode) {
            let n = this.selectedNode;
            let x = n.c * cs + cs + p;
            let y = n.r * cs + cs + p;
            ctx.fillStyle = this.COLORS.HIGHLIGHT;
            ctx.beginPath();
            ctx.arc(x, y, cs * 0.6, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw Drag Line
        if (this.dragStartNode && this.currentMouse) {
            let n = this.dragStartNode;
            let x1 = n.c * cs + cs + p;
            let y1 = n.r * cs + cs + p;
            let { x: x2, y: y2 } = this.currentMouse;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = this.COLORS.BRIDGE;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]); // Dashed line for drag preview
            ctx.stroke();
            ctx.setLineDash([]); // Reset
        }

        // Draw Islands
        for (let n of this.islands) {
            let x = n.c * cs + cs + p;
            let y = n.r * cs + cs + p;

            ctx.fillStyle = this.COLORS.ISLAND;
            ctx.strokeStyle = n.cur === n.req ? this.COLORS.COMPLETE :
                (n.cur > n.req ? this.COLORS.ERROR : this.COLORS.TEXT);
            ctx.lineWidth = 2;

            if (n.cur === n.req) ctx.fillStyle = '#e6fffa'; // Light green bg

            ctx.beginPath();
            ctx.arc(x, y, cs * 0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = this.COLORS.TEXT;
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(n.req, x, y);
        }
    }

    checkWin() {
        for (let n of this.islands) {
            if (n.cur !== n.req) return;
        }

        // Also check graph connectivity

        setTimeout(() => alert("BRIDGE COMPLETED! 🌉"), 100);
    }
}
