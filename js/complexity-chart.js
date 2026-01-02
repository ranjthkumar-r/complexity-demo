export class ComplexityChart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.legendEl = document.getElementById('legend');

        // Core Functions
        this.functions = {
            '1': n => 1,
            'logn': n => Math.log2(n + 1),
            'n': n => n,
            'nlogn': n => n * Math.log2(n + 1),
            'n2': n => n * n,
            'n3': n => n * n * n,
            '2powern': n => Math.pow(2, n),
            'vplusE': n => n * 2 // Simplified proxy for graph
        };

        this.colors = {
            '1': '#6366f1', // Indigo
            'logn': '#22d3ee', // Cyan
            'n': '#10b981', // Emerald
            'nlogn': '#f59e0b', // Amber
            'n2': '#ef4444', // Red
            '2powern': '#8b5cf6', // Violet
            'vplusE': '#ec4899' // Pink
        };

        this.visible = new Set(Object.keys(this.functions));
        this.highlighted = null;

        // Responsive sizing
        window.addEventListener('resize', () => this.resize());
        this.resize();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        this.draw();
    }

    toggle(key) {
        if (this.visible.has(key)) this.visible.delete(key);
        else this.visible.add(key);
        this.draw();
        return this.visible.has(key);
    }

    setHighlight(key) {
        this.highlighted = key;
        this.draw();
    }

    draw() {
        const { width: w, height: h } = this.canvas;
        const { ctx } = this;

        ctx.clearRect(0, 0, w, h);

        // Draw Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        for (let i = 1; i < 5; i++) {
            let y = (h / 5) * i;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // Data generation
        const N = 20;
        const data = {};
        let maxVal = 0;

        for (const [key, fn] of Object.entries(this.functions)) {
            if (!this.visible.has(key)) continue;
            const pts = [];
            for (let i = 1; i <= N; i++) {
                const val = fn(i);
                pts.push(val);
                if (val > maxVal) maxVal = val;
            }
            data[key] = pts;
        }

        // Log scale compression for viz if range is huge
        const useLog = maxVal > 1000;
        if (useLog) maxVal = Math.log1p(maxVal);

        // Draw Curves
        for (const [key, pts] of Object.entries(data)) {
            const color = this.colors[key] || '#fff';
            const isHighlight = this.highlighted === key;

            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = isHighlight ? 4 : 2;
            ctx.shadowBlur = isHighlight ? 15 : 0;
            ctx.shadowColor = color;
            ctx.globalAlpha = (this.highlighted && !isHighlight) ? 0.2 : 1;

            pts.forEach((val, i) => {
                const yVal = useLog ? Math.log1p(val) : val;
                const x = (i / (N - 1)) * (w - 40) + 20;
                const y = h - ((yVal / maxVal) * (h - 40)) - 20;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }
    }

    renderLegend(containerId) {
        const el = document.getElementById(containerId);
        el.innerHTML = '';

        Object.keys(this.functions).forEach(key => {
            const item = document.createElement('div');
            item.className = 'legend-item';
            item.innerHTML = `<span class="dot" style="background:${this.colors[key]}"></span> ${key}`;

            item.onclick = () => {
                const isVis = this.toggle(key);
                item.classList.toggle('hidden', !isVis);
            };

            item.onmouseenter = () => this.setHighlight(key);
            item.onmouseleave = () => this.setHighlight(null);

            el.appendChild(item);
        });
    }
}
